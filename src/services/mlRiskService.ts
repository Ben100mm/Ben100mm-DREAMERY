/**
 * ML Risk Service
 * Handles communication with ML Risk Model API and provides fallback to rule-based scoring
 */

import {
  MLRiskFeatures,
  MLRiskPrediction,
  MLRiskRequest,
  MLRiskResponse,
  MLRiskError,
  MLModelInfo,
  EnhancedRiskAnalysis,
} from '../types/mlRisk';
import { DealState } from '../types/deal';
import { calculateRiskScore, defaultRiskFactors } from '../utils/advancedCalculations';

const ML_RISK_API_URL = process.env.REACT_APP_ML_RISK_API_URL || 'http://localhost:8001';
const ML_RISK_ENABLED = process.env.REACT_APP_ML_RISK_ENABLED !== 'false'; // Enable by default
const REQUEST_TIMEOUT = 5000; // 5 seconds

// Cache for ML predictions to avoid repeated calls
const predictionCache = new Map<string, { prediction: MLRiskPrediction; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Extract ML risk features from deal state
 */
export function extractMLFeaturesFromDealState(dealState: DealState): MLRiskFeatures {
  const purchasePrice = dealState.purchasePrice || 300000;
  const downPayment = purchasePrice - (dealState.loan?.loanAmount || purchasePrice * 0.8);
  const loanAmount = purchasePrice - downPayment;
  const monthlyRent = dealState.baseMonthlyRent || 0;
  const monthlyExpenses =
    (dealState.ops?.taxes || 0) / 12 +
    (dealState.ops?.insurance || 0) / 12 +
    (dealState.ops?.maintenance || 0) / 12;
  const monthlyCashFlow = monthlyRent - monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Calculate DSCR
  const interestRate = dealState.loan?.annualInterestRate || 6.5;
  const loanTermYears = dealState.loan?.amortizationYears || 30;
  const monthlyRate = interestRate / 100 / 12;
  const loanTermMonths = loanTermYears * 12;
  let monthlyPayment = 0;

  if (monthlyRate > 0 && loanAmount > 0) {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  }

  const dscr = monthlyPayment > 0 ? (monthlyCashFlow + monthlyPayment) / monthlyPayment : 1.25;

  // Calculate LTV
  const ltv = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 80;

  // Extract market conditions
  const marketConditions = dealState.marketConditions || { type: 'stable', appreciationRate: 3.5 };
  const marketVolatility = dealState.riskFactors?.marketVolatility || 5;
  const marketAppreciation =
    typeof marketConditions.appreciationRate === 'number' ? marketConditions.appreciationRate : 3.5;

  // Determine market demand strength based on market type
  let marketDemandStrength = 5;
  if (marketConditions.type === 'hot') {
    marketDemandStrength = 8;
  } else if (marketConditions.type === 'slow') {
    marketDemandStrength = 3;
  }

  // Property factors
  const propertyAge = dealState.propertyAge?.age || 20;
  const propertyCondition = dealState.riskFactors?.propertyCondition || 5;
  const maintenanceCostMultiplier = dealState.propertyAge?.maintenanceCostMultiplier || 1.0;

  // Location factors
  const locationStability = dealState.riskFactors?.locationStability || 5;

  // Get location data if available
  const neighborhoodCrimeRate = 5.0; // Default - could be enriched from location data
  const schoolRating = 6.0; // Default - could be enriched from location data
  const walkabilityScore = 50; // Default - could be enriched from location data

  // Tenant factors
  const tenantQuality = dealState.riskFactors?.tenantQuality || 5;
  const vacancyRate = 5.0; // Default vacancy rate
  const rentToMarketRatio = 1.0; // Default rent to market ratio

  // Financing factors
  const financingRisk = dealState.riskFactors?.financingRisk || 5;
  const hasBalloonPayment =
    (dealState.offerType === 'Seller Finance' && dealState.hybrid?.balloonDue) ||
    (dealState.offerType === 'Hybrid' && dealState.hybrid?.balloonDue) ||
    false;
  const isInterestOnly = dealState.loan?.interestOnly || false;

  // Economic factors (defaults - could be enriched from external data)
  const unemploymentRate = 4.5;
  const inflationRate = 2.5;
  const medianIncome = 65000;

  return {
    market_volatility: marketVolatility,
    market_appreciation_rate: marketAppreciation,
    market_inventory_level: 6.0, // Default
    market_demand_strength: marketDemandStrength,
    property_age: propertyAge,
    property_condition: propertyCondition,
    property_value: purchasePrice,
    maintenance_cost_multiplier: maintenanceCostMultiplier,
    location_stability: locationStability,
    neighborhood_crime_rate: neighborhoodCrimeRate,
    school_rating: schoolRating,
    walkability_score: walkabilityScore,
    tenant_quality: tenantQuality,
    vacancy_rate: vacancyRate,
    rent_to_market_ratio: rentToMarketRatio,
    debt_service_coverage_ratio: dscr,
    financing_risk: financingRisk,
    loan_to_value: ltv,
    interest_rate: interestRate,
    has_balloon_payment: hasBalloonPayment,
    is_interest_only: isInterestOnly,
    unemployment_rate: unemploymentRate,
    inflation_rate: inflationRate,
    median_income: medianIncome,
  };
}

/**
 * Generate cache key from features
 */
function getCacheKey(features: MLRiskFeatures): string {
  return JSON.stringify(features);
}

/**
 * Check if cached prediction is still valid
 */
function getCachedPrediction(features: MLRiskFeatures): MLRiskPrediction | null {
  const key = getCacheKey(features);
  const cached = predictionCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.prediction;
  }

  // Clean up expired cache entry
  if (cached) {
    predictionCache.delete(key);
  }

  return null;
}

/**
 * Cache prediction
 */
function cachePrediction(features: MLRiskFeatures, prediction: MLRiskPrediction): void {
  const key = getCacheKey(features);
  predictionCache.set(key, {
    prediction,
    timestamp: Date.now(),
  });

  // Clean up old cache entries if cache is getting too large
  if (predictionCache.size > 100) {
    const entries = Array.from(predictionCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    // Remove oldest 50 entries
    for (let i = 0; i < 50; i++) {
      predictionCache.delete(entries[i][0]);
    }
  }
}

/**
 * Call ML Risk API to get prediction
 */
async function callMLRiskAPI(
  features: MLRiskFeatures,
  ruleBasedScore?: number
): Promise<MLRiskPrediction> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${ML_RISK_API_URL}/api/predict-risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...features,
        rule_based_score: ruleBasedScore,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const prediction: MLRiskResponse = await response.json();
    return prediction;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('ML Risk API request timed out');
      }
      throw error;
    }
    throw new Error('Unknown error calling ML Risk API');
  }
}

/**
 * Get ML risk prediction with fallback to rule-based
 */
export async function getMLRiskPrediction(
  dealState: DealState,
  options?: {
    useCache?: boolean;
    fallbackToRule?: boolean;
  }
): Promise<MLRiskPrediction | null> {
  const { useCache = true, fallbackToRule = true } = options || {};

  if (!ML_RISK_ENABLED) {
    console.log('ML Risk API is disabled');
    return null;
  }

  try {
    // Extract features
    const features = extractMLFeaturesFromDealState(dealState);

    // Check cache
    if (useCache) {
      const cached = getCachedPrediction(features);
      if (cached) {
        console.log('Using cached ML prediction');
        return cached;
      }
    }

    // Calculate rule-based score for comparison
    let ruleBasedScore: number | undefined;
    if (dealState.riskScoreResults) {
      ruleBasedScore = dealState.riskScoreResults.overallRiskScore;
    } else {
      const riskScore = calculateRiskScore(
        dealState.riskFactors || defaultRiskFactors,
        dealState.marketConditions || { type: 'stable', appreciationRate: 3.5 },
        dealState.propertyAge || { age: 20, maintenanceCostMultiplier: 1.0, utilityEfficiencyMultiplier: 1.0, insuranceCostMultiplier: 1.0, expectedLifespan: 50 }
      );
      ruleBasedScore = riskScore.overallRiskScore;
    }

    // Call API
    const prediction = await callMLRiskAPI(features, ruleBasedScore);

    // Cache result
    if (useCache) {
      cachePrediction(features, prediction);
    }

    return prediction;
  } catch (error) {
    console.error('Error getting ML risk prediction:', error);

    if (!fallbackToRule) {
      return null;
    }

    // Return null to allow fallback to rule-based
    return null;
  }
}

/**
 * Get enhanced risk analysis combining rule-based and ML predictions
 */
export async function getEnhancedRiskAnalysis(
  dealState: DealState
): Promise<EnhancedRiskAnalysis> {
  // Calculate rule-based risk
  const riskFactors = dealState.riskFactors || defaultRiskFactors;
  const marketConditions = dealState.marketConditions || { type: 'stable', appreciationRate: 3.5 };
  const propertyAge = dealState.propertyAge || {
    age: 20,
    maintenanceCostMultiplier: 1.0,
    utilityEfficiencyMultiplier: 1.0,
    insuranceCostMultiplier: 1.0,
    expectedLifespan: 50,
  };

  const ruleBasedRisk = calculateRiskScore(riskFactors, marketConditions, propertyAge);

  // Try to get ML prediction
  const mlPrediction = await getMLRiskPrediction(dealState);

  // Determine combined score and category
  let combinedScore = ruleBasedRisk.overallRiskScore;
  let combinedCategory = ruleBasedRisk.riskCategory;

  if (mlPrediction) {
    // Weight ML prediction slightly higher (60% ML, 40% rule-based)
    combinedScore = mlPrediction.overall_risk_score * 0.6 + ruleBasedRisk.overallRiskScore * 0.4;

    // Determine combined category
    if (combinedScore <= 3) {
      combinedCategory = 'Low';
    } else if (combinedScore <= 5) {
      combinedCategory = 'Medium';
    } else if (combinedScore <= 7) {
      combinedCategory = 'High';
    } else {
      combinedCategory = 'Very High';
    }
  }

  // Combine recommendations
  const allRecommendations = [
    ...ruleBasedRisk.recommendations,
    ...(mlPrediction?.ml_recommendations || []),
  ];

  return {
    ruleBasedScore: ruleBasedRisk.overallRiskScore,
    ruleBasedCategory: ruleBasedRisk.riskCategory,
    ruleBasedRecommendations: ruleBasedRisk.recommendations,
    mlPrediction,
    mlAvailable: mlPrediction !== null,
    combinedScore,
    combinedCategory,
    allRecommendations,
  };
}

/**
 * Get ML model info
 */
export async function getMLModelInfo(): Promise<MLModelInfo | null> {
  if (!ML_RISK_ENABLED) {
    return null;
  }

  try {
    const response = await fetch(`${ML_RISK_API_URL}/api/model-info`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting ML model info:', error);
    return null;
  }
}

/**
 * Check if ML Risk API is available
 */
export async function checkMLRiskAPIHealth(): Promise<boolean> {
  if (!ML_RISK_ENABLED) {
    return false;
  }

  try {
    const response = await fetch(`${ML_RISK_API_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Clear prediction cache
 */
export function clearMLRiskCache(): void {
  predictionCache.clear();
}

