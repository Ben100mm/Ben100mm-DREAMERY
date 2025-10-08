/**
 * ML Risk Model Service
 * 
 * Machine learning-based risk assessment framework for real estate deals.
 * This provides a foundation for ML model integration and advanced risk scoring.
 * 
 * Framework Design:
 * - Feature engineering and extraction
 * - Rule-based risk scoring (can be replaced with trained models)
 * - Feature importance analysis
 * - Risk-adjusted return calculations
 * - Extensible architecture for future ML integration (TensorFlow.js, etc.)
 */

import {
  MLRiskModelInputs,
  MLRiskPrediction,
  MLModelConfig,
  DealMetrics,
  EngineeredFeatures,
  RiskBreakdown,
  FeatureImportance,
  ConfidenceInterval,
  RiskAdjustedMetrics,
  ModelEvaluationMetrics,
  TrainingDataPoint
} from '../types/mlRiskTypes';

/**
 * Default model configuration
 */
const DEFAULT_CONFIG: MLModelConfig = {
  modelType: 'RandomForest',
  featureScaling: true,
  featureSelection: true,
  maxFeatures: 50,
  riskThresholds: {
    veryLow: 20,
    low: 40,
    moderate: 60,
    high: 80,
    veryHigh: 100
  },
  confidenceLevel: 0.95,
  minDataQuality: 0.6
};

/**
 * ML Risk Model Service Class
 */
export class MLRiskModelService {
  private config: MLModelConfig;
  private trainingData: TrainingDataPoint[] = [];
  
  constructor(config?: Partial<MLModelConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Main prediction method
   * Generates comprehensive risk assessment for a deal
   */
  predict(inputs: MLRiskModelInputs): MLRiskPrediction {
    // Step 1: Feature Engineering
    const features = this.engineerFeatures(inputs.dealMetrics);
    
    // Step 2: Data Quality Assessment
    const dataQuality = this.assessDataQuality(inputs);
    
    // Step 3: Calculate Risk Breakdown
    const riskBreakdown = this.calculateRiskBreakdown(inputs.dealMetrics, features);
    
    // Step 4: Calculate Overall Risk Score
    const overallRiskScore = this.calculateOverallRiskScore(riskBreakdown);
    
    // Step 5: Determine Risk Category
    const riskCategory = this.categorizeRisk(overallRiskScore);
    
    // Step 6: Calculate Probability Estimates
    const probabilityOfDefault = this.estimateProbabilityOfDefault(overallRiskScore, riskBreakdown);
    const expectedLossRate = this.calculateExpectedLoss(probabilityOfDefault, inputs.dealMetrics);
    const expectedReturn = this.estimateExpectedReturn(inputs.dealMetrics, overallRiskScore);
    const returnVolatility = this.estimateReturnVolatility(inputs.dealMetrics, riskBreakdown);
    
    // Step 7: Feature Importance Analysis
    const topRiskDrivers = this.identifyTopRiskDrivers(inputs.dealMetrics, features, riskBreakdown);
    const topOpportunityDrivers = this.identifyTopOpportunities(inputs.dealMetrics, features);
    
    // Step 8: Confidence Intervals
    const confidenceIntervals = this.calculateConfidenceIntervals(
      overallRiskScore,
      expectedReturn,
      probabilityOfDefault,
      dataQuality
    );
    
    // Step 9: Generate Recommendations
    const recommendations = this.generateRecommendations(riskBreakdown, inputs.dealMetrics);
    const warnings = this.generateWarnings(riskBreakdown, inputs.dealMetrics);
    
    // Step 10: Compile Prediction
    return {
      overallRiskScore,
      riskCategory,
      probabilityOfDefault,
      expectedLossRate,
      expectedReturn,
      returnVolatility,
      riskBreakdown,
      predictionConfidence: this.calculatePredictionConfidence(dataQuality, overallRiskScore),
      confidenceIntervals,
      topRiskDrivers,
      topOpportunityDrivers,
      recommendations,
      warnings,
      modelVersion: '1.0.0-framework',
      timestamp: new Date(),
      dataQuality
    };
  }
  
  /**
   * Engineer features from raw deal metrics
   */
  private engineerFeatures(metrics: DealMetrics): EngineeredFeatures {
    // Calculate derived ratios
    const debtToIncome = metrics.monthlyExpenses / Math.max(metrics.monthlyIncome, 1);
    const rentToPrice = (metrics.monthlyRent * 12) / metrics.purchasePrice;
    const priceToIncomeRatio = metrics.purchasePrice / (metrics.monthlyIncome * 12);
    const operatingExpenseRatio = metrics.monthlyExpenses / Math.max(metrics.monthlyIncome, 1);
    const cashFlowCoverage = (metrics.monthlyIncome - metrics.monthlyExpenses) / 
                             Math.max(metrics.monthlyExpenses, 1);
    
    // Calculate risk indicators
    const leverageScore = this.calculateLeverageScore(metrics);
    const liquidityScore = this.calculateLiquidityScore(metrics);
    const stabilityScore = this.calculateStabilityScore(metrics);
    
    // Market position indicators
    const relativePricing = metrics.afterRepairValue / Math.max(metrics.purchasePrice, 1);
    const marketMomentum = metrics.marketAppreciation / 3; // normalized
    const competitivePosition = this.calculateCompetitivePosition(metrics);
    
    // Composite scores
    const financialHealthScore = this.calculateFinancialHealthScore(metrics);
    const locationQualityScore = this.calculateLocationQualityScore(metrics);
    const propertyQualityScore = this.calculatePropertyQualityScore(metrics);
    
    return {
      debtToIncome,
      rentToPrice,
      priceToIncomeRatio,
      operatingExpenseRatio,
      cashFlowCoverage,
      leverageScore,
      liquidityScore,
      stabilityScore,
      relativePricing,
      marketMomentum,
      competitivePosition,
      financialHealthScore,
      locationQualityScore,
      propertyQualityScore
    };
  }
  
  /**
   * Calculate risk breakdown by category
   */
  private calculateRiskBreakdown(metrics: DealMetrics, features: EngineeredFeatures): RiskBreakdown {
    return {
      financialRisk: this.calculateFinancialRisk(metrics, features),
      marketRisk: this.calculateMarketRisk(metrics),
      propertyRisk: this.calculatePropertyRisk(metrics),
      locationRisk: this.calculateLocationRisk(metrics),
      liquidityRisk: this.calculateLiquidityRisk(metrics, features),
      operationalRisk: this.calculateOperationalRisk(metrics)
    };
  }
  
  /**
   * Financial risk scoring (0-100)
   */
  private calculateFinancialRisk(metrics: DealMetrics, features: EngineeredFeatures): number {
    let risk = 50; // baseline
    
    // DSCR impact (lower DSCR = higher risk)
    if (metrics.dscr < 1.0) risk += 30;
    else if (metrics.dscr < 1.25) risk += 15;
    else if (metrics.dscr > 2.0) risk -= 15;
    
    // LTV impact (higher LTV = higher risk)
    if (metrics.ltv > 0.85) risk += 25;
    else if (metrics.ltv > 0.75) risk += 10;
    else if (metrics.ltv < 0.6) risk -= 10;
    
    // Cash-on-Cash return (lower CoC = higher risk)
    if (metrics.cocReturn < 5) risk += 20;
    else if (metrics.cocReturn < 8) risk += 10;
    else if (metrics.cocReturn > 15) risk -= 10;
    
    // Leverage score impact
    risk += (features.leverageScore - 50) * 0.3;
    
    return Math.max(0, Math.min(100, risk));
  }
  
  /**
   * Market risk scoring
   */
  private calculateMarketRisk(metrics: DealMetrics): number {
    let risk = 50;
    
    // Vacancy rate impact
    if (metrics.vacancyRate > 0.15) risk += 20;
    else if (metrics.vacancyRate > 0.1) risk += 10;
    else if (metrics.vacancyRate < 0.05) risk -= 10;
    
    // Market appreciation
    if (metrics.marketAppreciation < 0) risk += 25;
    else if (metrics.marketAppreciation < 2) risk += 10;
    else if (metrics.marketAppreciation > 5) risk -= 10;
    
    // Days on market (if available)
    if (metrics.daysOnMarket) {
      if (metrics.daysOnMarket > 180) risk += 15;
      else if (metrics.daysOnMarket > 90) risk += 8;
      else if (metrics.daysOnMarket < 30) risk -= 5;
    }
    
    // Unemployment rate
    if (metrics.unemploymentRate) {
      if (metrics.unemploymentRate > 8) risk += 15;
      else if (metrics.unemploymentRate > 6) risk += 8;
      else if (metrics.unemploymentRate < 4) risk -= 8;
    }
    
    return Math.max(0, Math.min(100, risk));
  }
  
  /**
   * Property-specific risk scoring
   */
  private calculatePropertyRisk(metrics: DealMetrics): number {
    let risk = 50;
    
    // Property age impact
    if (metrics.propertyAge > 50) risk += 20;
    else if (metrics.propertyAge > 30) risk += 10;
    else if (metrics.propertyAge < 10) risk -= 10;
    
    // Rehab cost relative to purchase price
    const rehabRatio = metrics.rehabCost / metrics.purchasePrice;
    if (rehabRatio > 0.5) risk += 25;
    else if (rehabRatio > 0.3) risk += 15;
    else if (rehabRatio > 0.2) risk += 8;
    
    // Property condition indicators
    if (metrics.foreclosure) risk += 15;
    if (metrics.floodZone) risk += 10;
    
    // Property type risk adjustment
    const propertyTypeRisk: Record<string, number> = {
      'SFH': -5,
      'Condo': 5,
      'Townhouse': 0,
      'Multi-Family': -10,
      'Commercial': 10
    };
    risk += propertyTypeRisk[metrics.propertyType] || 0;
    
    return Math.max(0, Math.min(100, risk));
  }
  
  /**
   * Location risk scoring
   */
  private calculateLocationRisk(metrics: DealMetrics): number {
    let risk = 50;
    
    // Crime index
    if (metrics.crimeIndex) {
      if (metrics.crimeIndex > 70) risk += 20;
      else if (metrics.crimeIndex > 50) risk += 10;
      else if (metrics.crimeIndex < 30) risk -= 10;
    }
    
    // School rating
    if (metrics.schoolRating) {
      if (metrics.schoolRating < 4) risk += 15;
      else if (metrics.schoolRating < 6) risk += 8;
      else if (metrics.schoolRating > 8) risk -= 15;
    }
    
    // Walk score
    if (metrics.walkScore) {
      if (metrics.walkScore < 30) risk += 10;
      else if (metrics.walkScore > 70) risk -= 10;
    }
    
    return Math.max(0, Math.min(100, risk));
  }
  
  /**
   * Liquidity risk scoring
   */
  private calculateLiquidityRisk(metrics: DealMetrics, features: EngineeredFeatures): number {
    let risk = 50;
    
    // Days on market indicator
    if (metrics.daysOnMarket && metrics.daysOnMarket > 180) risk += 20;
    
    // Price reduction indicator
    if (metrics.priceReduction && metrics.priceReduction > 0.1) risk += 15;
    
    // Liquidity score from features
    risk += (100 - features.liquidityScore) * 0.5;
    
    // Property type liquidity
    if (metrics.propertyType === 'Commercial') risk += 15;
    if (metrics.propertyType === 'SFH') risk -= 10;
    
    return Math.max(0, Math.min(100, risk));
  }
  
  /**
   * Operational risk scoring
   */
  private calculateOperationalRisk(metrics: DealMetrics): number {
    let risk = 50;
    
    // Occupancy rate
    if (metrics.occupancyRate < 0.85) risk += 20;
    else if (metrics.occupancyRate < 0.9) risk += 10;
    else if (metrics.occupancyRate > 0.95) risk -= 10;
    
    // Management complexity
    if (metrics.propertyType === 'Multi-Family') risk += 10;
    if (metrics.propertyType === 'Commercial') risk += 15;
    
    // Owner occupied reduces operational complexity
    if (metrics.ownerOccupied) risk -= 15;
    
    // HOA can add operational burden
    if (metrics.hoa && metrics.hoaFees && metrics.hoaFees > 300) risk += 8;
    
    return Math.max(0, Math.min(100, risk));
  }
  
  /**
   * Calculate overall risk score from breakdown
   */
  private calculateOverallRiskScore(breakdown: RiskBreakdown): number {
    const weights = {
      financialRisk: 0.30,
      marketRisk: 0.25,
      propertyRisk: 0.15,
      locationRisk: 0.15,
      liquidityRisk: 0.10,
      operationalRisk: 0.05
    };
    
    return (
      breakdown.financialRisk * weights.financialRisk +
      breakdown.marketRisk * weights.marketRisk +
      breakdown.propertyRisk * weights.propertyRisk +
      breakdown.locationRisk * weights.locationRisk +
      breakdown.liquidityRisk * weights.liquidityRisk +
      breakdown.operationalRisk * weights.operationalRisk
    );
  }
  
  /**
   * Categorize risk score into buckets
   */
  private categorizeRisk(score: number): MLRiskPrediction['riskCategory'] {
    const thresholds = this.config.riskThresholds;
    if (score < thresholds.veryLow) return 'Very Low';
    if (score < thresholds.low) return 'Low';
    if (score < thresholds.moderate) return 'Moderate';
    if (score < thresholds.high) return 'High';
    return 'Very High';
  }
  
  /**
   * Estimate probability of default
   */
  private estimateProbabilityOfDefault(riskScore: number, breakdown: RiskBreakdown): number {
    // Base probability from risk score (sigmoid-like curve)
    let probability = 1 / (1 + Math.exp(-0.1 * (riskScore - 50)));
    
    // Adjust for financial risk (most important for default)
    if (breakdown.financialRisk > 70) probability *= 1.5;
    if (breakdown.financialRisk < 30) probability *= 0.5;
    
    return Math.max(0, Math.min(1, probability));
  }
  
  /**
   * Calculate expected loss given default
   */
  private calculateExpectedLoss(probabilityOfDefault: number, metrics: DealMetrics): number {
    // Loss Given Default (LGD) estimate
    const lgd = 0.4; // assume 40% loss severity (industry average)
    
    // Adjust LGD based on LTV
    const adjustedLgd = lgd * (metrics.ltv / 0.8); // normalized to 80% LTV
    
    return probabilityOfDefault * Math.min(1, adjustedLgd);
  }
  
  /**
   * Estimate expected return adjusted for risk
   */
  private estimateExpectedReturn(metrics: DealMetrics, riskScore: number): number {
    // Start with CoC return
    let expectedReturn = metrics.cocReturn;
    
    // Add appreciation
    expectedReturn += metrics.marketAppreciation;
    
    // Risk adjustment (higher risk should demand higher returns, but expected returns may be lower)
    const riskPenalty = (riskScore - 50) * 0.1; // 10% per 10 points of risk over 50
    expectedReturn -= riskPenalty;
    
    return expectedReturn;
  }
  
  /**
   * Estimate return volatility (standard deviation)
   */
  private estimateReturnVolatility(metrics: DealMetrics, breakdown: RiskBreakdown): number {
    // Base volatility
    let volatility = 5.0; // 5% baseline
    
    // Market risk increases volatility
    volatility += breakdown.marketRisk * 0.1;
    
    // High leverage increases volatility
    if (metrics.ltv > 0.8) volatility *= 1.5;
    
    // Property type adjustments
    if (metrics.propertyType === 'Commercial') volatility *= 1.3;
    if (metrics.propertyType === 'Multi-Family') volatility *= 0.9;
    
    return volatility;
  }
  
  /**
   * Identify top risk drivers
   */
  private identifyTopRiskDrivers(
    metrics: DealMetrics,
    features: EngineeredFeatures,
    breakdown: RiskBreakdown
  ): FeatureImportance[] {
    const drivers: FeatureImportance[] = [];
    
    // Analyze key metrics
    if (metrics.dscr < 1.25) {
      drivers.push({
        featureName: 'Low DSCR',
        importance: Math.min(1, (1.25 - metrics.dscr) * 2),
        category: 'Financial',
        direction: 'negative'
      });
    }
    
    if (metrics.ltv > 0.75) {
      drivers.push({
        featureName: 'High LTV',
        importance: Math.min(1, (metrics.ltv - 0.75) * 4),
        category: 'Financial',
        direction: 'negative'
      });
    }
    
    if (metrics.vacancyRate > 0.1) {
      drivers.push({
        featureName: 'High Vacancy Rate',
        importance: Math.min(1, metrics.vacancyRate * 5),
        category: 'Market',
        direction: 'negative'
      });
    }
    
    if (breakdown.financialRisk > 60) {
      drivers.push({
        featureName: 'Overall Financial Risk',
        importance: breakdown.financialRisk / 100,
        category: 'Financial',
        direction: 'negative'
      });
    }
    
    if (breakdown.marketRisk > 60) {
      drivers.push({
        featureName: 'Market Conditions',
        importance: breakdown.marketRisk / 100,
        category: 'Market',
        direction: 'negative'
      });
    }
    
    // Sort by importance and return top 5
    return drivers.sort((a, b) => b.importance - a.importance).slice(0, 5);
  }
  
  /**
   * Identify top opportunity drivers
   */
  private identifyTopOpportunities(metrics: DealMetrics, features: EngineeredFeatures): FeatureImportance[] {
    const opportunities: FeatureImportance[] = [];
    
    if (metrics.cocReturn > 12) {
      opportunities.push({
        featureName: 'Strong Cash-on-Cash Return',
        importance: Math.min(1, metrics.cocReturn / 20),
        category: 'Financial',
        direction: 'positive'
      });
    }
    
    if (metrics.marketAppreciation > 4) {
      opportunities.push({
        featureName: 'Market Appreciation',
        importance: Math.min(1, metrics.marketAppreciation / 10),
        category: 'Market',
        direction: 'positive'
      });
    }
    
    if (metrics.dscr > 1.5) {
      opportunities.push({
        featureName: 'Strong Debt Coverage',
        importance: Math.min(1, (metrics.dscr - 1) * 0.5),
        category: 'Financial',
        direction: 'positive'
      });
    }
    
    if (features.locationQualityScore > 70) {
      opportunities.push({
        featureName: 'Prime Location',
        importance: features.locationQualityScore / 100,
        category: 'Location',
        direction: 'positive'
      });
    }
    
    return opportunities.sort((a, b) => b.importance - a.importance).slice(0, 5);
  }
  
  /**
   * Calculate confidence intervals
   */
  private calculateConfidenceIntervals(
    riskScore: number,
    expectedReturn: number,
    probabilityOfDefault: number,
    dataQuality: number
  ): MLRiskPrediction['confidenceIntervals'] {
    // Confidence width based on data quality (lower quality = wider intervals)
    const widthMultiplier = 2 - dataQuality;
    
    return {
      riskScore: {
        lower: Math.max(0, riskScore - 10 * widthMultiplier),
        upper: Math.min(100, riskScore + 10 * widthMultiplier),
        confidence: this.config.confidenceLevel
      },
      expectedReturn: {
        lower: expectedReturn - 5 * widthMultiplier,
        upper: expectedReturn + 5 * widthMultiplier,
        confidence: this.config.confidenceLevel
      },
      probabilityOfDefault: {
        lower: Math.max(0, probabilityOfDefault - 0.1 * widthMultiplier),
        upper: Math.min(1, probabilityOfDefault + 0.1 * widthMultiplier),
        confidence: this.config.confidenceLevel
      }
    };
  }
  
  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(breakdown: RiskBreakdown, metrics: DealMetrics): string[] {
    const recommendations: string[] = [];
    
    if (breakdown.financialRisk > 60) {
      if (metrics.dscr < 1.25) {
        recommendations.push('Consider negotiating better loan terms or increasing down payment to improve DSCR');
      }
      if (metrics.ltv > 0.8) {
        recommendations.push('High leverage detected. Consider additional equity to reduce LTV below 80%');
      }
    }
    
    if (breakdown.marketRisk > 60) {
      recommendations.push('Market conditions present elevated risk. Consider waiting for better market timing');
      if (metrics.vacancyRate > 0.1) {
        recommendations.push('High vacancy rate in area. Budget for extended vacancy periods');
      }
    }
    
    if (breakdown.propertyRisk > 60) {
      recommendations.push('Property condition or age presents risk. Budget additional reserves for maintenance');
    }
    
    if (breakdown.liquidityRisk > 60) {
      recommendations.push('Exit strategy may be challenging. Ensure adequate liquidity reserves');
    }
    
    return recommendations;
  }
  
  /**
   * Generate risk warnings
   */
  private generateWarnings(breakdown: RiskBreakdown, metrics: DealMetrics): string[] {
    const warnings: string[] = [];
    
    if (metrics.dscr < 1.0) {
      warnings.push('CRITICAL: DSCR below 1.0 - property cannot cover debt service');
    }
    
    if (metrics.ltv > 0.9) {
      warnings.push('WARNING: Very high leverage (LTV > 90%) increases default risk significantly');
    }
    
    if (metrics.cocReturn < 5) {
      warnings.push('WARNING: Low cash-on-cash return may not justify investment risk');
    }
    
    if (breakdown.financialRisk > 80 || breakdown.marketRisk > 80) {
      warnings.push('CRITICAL: Extremely high risk detected. Reconsider this investment');
    }
    
    return warnings;
  }
  
  /**
   * Assess input data quality
   */
  private assessDataQuality(inputs: MLRiskModelInputs): number {
    const metrics = inputs.dealMetrics;
    let score = 1.0;
    let fields = 0;
    let present = 0;
    
    // Check presence of key fields
    const keyFields: (keyof DealMetrics)[] = [
      'dscr', 'ltv', 'cocReturn', 'capRate', 'propertyAge',
      'purchasePrice', 'monthlyRent', 'occupancyRate', 'monthlyIncome',
      'monthlyExpenses', 'vacancyRate', 'marketAppreciation'
    ];
    
    keyFields.forEach(field => {
      fields++;
      if (metrics[field] !== undefined && metrics[field] !== null) {
        present++;
      }
    });
    
    score = present / fields;
    
    // Bonus for optional but valuable fields
    const optionalFields: (keyof DealMetrics)[] = [
      'unemploymentRate', 'crimeIndex', 'schoolRating', 'walkScore',
      'daysOnMarket', 'irr', 'moic'
    ];
    
    let optionalPresent = 0;
    optionalFields.forEach(field => {
      if (metrics[field] !== undefined && metrics[field] !== null) {
        optionalPresent++;
      }
    });
    
    score += (optionalPresent / optionalFields.length) * 0.2; // up to 20% bonus
    
    return Math.min(1, score);
  }
  
  /**
   * Calculate prediction confidence
   */
  private calculatePredictionConfidence(dataQuality: number, riskScore: number): number {
    // Base confidence on data quality
    let confidence = dataQuality;
    
    // Reduce confidence for extreme risk scores (less data typically available)
    if (riskScore < 20 || riskScore > 80) {
      confidence *= 0.9;
    }
    
    return confidence;
  }
  
  // Helper scoring functions
  
  private calculateLeverageScore(metrics: DealMetrics): number {
    const score = 50 + (0.8 - metrics.ltv) * 100; // normalized around LTV=0.8
    return Math.max(0, Math.min(100, score));
  }
  
  private calculateLiquidityScore(metrics: DealMetrics): number {
    let score = 50;
    if (metrics.daysOnMarket) {
      score = 100 - (metrics.daysOnMarket / 2); // 200 days = score of 0
    }
    return Math.max(0, Math.min(100, score));
  }
  
  private calculateStabilityScore(metrics: DealMetrics): number {
    const cashFlowStability = (metrics.monthlyIncome - metrics.monthlyExpenses) / metrics.monthlyIncome;
    const occupancyStability = metrics.occupancyRate;
    return ((cashFlowStability + occupancyStability) / 2) * 100;
  }
  
  private calculateCompetitivePosition(metrics: DealMetrics): number {
    const valueScore = (metrics.afterRepairValue / metrics.purchasePrice - 1) * 100;
    return Math.max(0, Math.min(100, 50 + valueScore));
  }
  
  private calculateFinancialHealthScore(metrics: DealMetrics): number {
    const dscrScore = Math.min(100, metrics.dscr * 40); // DSCR of 2.5 = 100
    const cocScore = Math.min(100, metrics.cocReturn * 5); // CoC of 20% = 100
    const ltvScore = (1 - metrics.ltv) * 100; // Lower LTV = higher score
    return (dscrScore * 0.4 + cocScore * 0.3 + ltvScore * 0.3);
  }
  
  private calculateLocationQualityScore(metrics: DealMetrics): number {
    let score = 50;
    if (metrics.schoolRating) score += (metrics.schoolRating - 5) * 5;
    if (metrics.walkScore) score += (metrics.walkScore - 50) * 0.3;
    if (metrics.crimeIndex) score -= (metrics.crimeIndex - 50) * 0.3;
    return Math.max(0, Math.min(100, score));
  }
  
  private calculatePropertyQualityScore(metrics: DealMetrics): number {
    let score = 70; // baseline
    score -= metrics.propertyAge * 0.5; // age penalty
    score += (metrics.afterRepairValue - metrics.purchasePrice) / metrics.purchasePrice * 50; // value-add bonus
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate risk-adjusted metrics (Sharpe ratio, etc.)
   */
  calculateRiskAdjustedMetrics(
    expectedReturn: number,
    returnVolatility: number,
    riskFreeRate: number = 4.0
  ): RiskAdjustedMetrics {
    const excessReturn = expectedReturn - riskFreeRate;
    const sharpeRatio = returnVolatility > 0 ? excessReturn / returnVolatility : 0;
    
    // Sortino ratio (using downside deviation approximation)
    const downsideDeviation = returnVolatility * 0.7; // approximate
    const sortinoRatio = downsideDeviation > 0 ? excessReturn / downsideDeviation : 0;
    
    // Simplified risk-adjusted return
    const riskAdjustedReturn = expectedReturn - (returnVolatility * 0.5);
    
    // Value at Risk (95% confidence, normal distribution assumption)
    const valueAtRisk95 = expectedReturn - (1.645 * returnVolatility);
    const conditionalVaR95 = expectedReturn - (2.06 * returnVolatility); // CVaR approximation
    
    return {
      sharpeRatio,
      sortinoRatio,
      calmarRatio: 0, // Would need max drawdown data
      informationRatio: 0, // Would need benchmark data
      riskAdjustedReturn,
      valueAtRisk95,
      conditionalVaR95
    };
  }
  
  /**
   * Add training data point (for future ML model training)
   */
  addTrainingData(dataPoint: TrainingDataPoint): void {
    this.trainingData.push(dataPoint);
  }
  
  /**
   * Get training data (for export/analysis)
   */
  getTrainingData(): TrainingDataPoint[] {
    return this.trainingData;
  }
  
  /**
   * Placeholder for future model training
   */
  async trainModel(): Promise<ModelEvaluationMetrics> {
    // TODO: Implement actual ML model training with TensorFlow.js or similar
    // This is a placeholder for future enhancement
    
    console.warn('Model training not yet implemented. Using rule-based scoring.');
    
    return {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      auc: 0,
      mae: 0,
      mse: 0,
      rmse: 0,
      r2: 0,
      calibrationError: 0,
      overallScore: 0,
      timestamp: new Date()
    };
  }
  
  /**
   * Train ML Risk Model on Historical Deals
   * 
   * FRAMEWORK PLACEHOLDER - Future Implementation Required
   * 
   * This function will train a machine learning model on thousands of historical
   * real estate deals to improve default probability and return predictions.
   * 
   * Requirements:
   * - Requires API integration with institutional data providers (CoreLogic, RealtyTrac, etc.)
   * - Train model on thousands of historical deals with actual outcomes
   * - Minimum 5,000+ deals recommended for reliable model training
   * - Historical data should include: deal metrics, market conditions, and actual outcomes
   * 
   * Suggested Implementation Steps:
   * 1. Data Collection:
   *    - Integrate with institutional data APIs (CoreLogic, RealtyTrac, Zillow Research)
   *    - Collect historical deal data with verified outcomes (5-10 years)
   *    - Include economic indicators, market cycles, regional variations
   * 
   * 2. Data Preprocessing:
   *    - Clean and normalize features
   *    - Handle missing values with appropriate imputation
   *    - Feature scaling (standardization or normalization)
   *    - Train/validation/test split (70/15/15)
   * 
   * 3. Feature Engineering:
   *    - Create interaction terms (e.g., DSCR × LTV)
   *    - Time-based features (market cycle indicators)
   *    - Geographic clustering features
   *    - Polynomial features for non-linear relationships
   * 
   * 4. Model Selection & Training:
   *    - Classification models for default prediction (Gradient Boosting, Random Forest)
   *    - Regression models for return prediction (Neural Networks, XGBoost)
   *    - Cross-validation for hyperparameter tuning
   *    - Ensemble methods for improved accuracy
   * 
   * 5. Model Evaluation:
   *    - ROC-AUC for default classification
   *    - RMSE, MAE for return prediction
   *    - Calibration plots for probability estimates
   *    - Backtesting on out-of-sample data
   * 
   * 6. Model Deployment:
   *    - Export trained model to TensorFlow.js format
   *    - Implement model versioning
   *    - Set up periodic retraining schedule
   *    - Monitor model drift and performance degradation
   * 
   * @param trainingConfig Configuration for model training
   * @param trainingConfig.dataSource API endpoint for historical data
   * @param trainingConfig.minSampleSize Minimum number of deals required
   * @param trainingConfig.lookbackYears Years of historical data to include
   * @param trainingConfig.validationSplit Proportion of data for validation
   * @param trainingConfig.epochs Number of training epochs
   * @param trainingConfig.batchSize Batch size for training
   * @param trainingConfig.learningRate Initial learning rate
   * 
   * @returns Promise resolving to training results and model evaluation metrics
   * 
   * @example
   * ```typescript
   * const results = await mlRiskModel.trainMLRiskModel({
   *   dataSource: 'https://api.institutional-provider.com/deals',
   *   minSampleSize: 5000,
   *   lookbackYears: 10,
   *   validationSplit: 0.15,
   *   epochs: 100,
   *   batchSize: 32,
   *   learningRate: 0.001
   * });
   * console.log(`Model trained with AUC: ${results.auc}`);
   * ```
   */
  async trainMLRiskModel(trainingConfig?: {
    dataSource?: string;
    minSampleSize?: number;
    lookbackYears?: number;
    validationSplit?: number;
    epochs?: number;
    batchSize?: number;
    learningRate?: number;
  }): Promise<{
    success: boolean;
    metrics: ModelEvaluationMetrics;
    trainingHistory?: {
      epoch: number;
      loss: number;
      valLoss: number;
      accuracy: number;
      valAccuracy: number;
    }[];
    message: string;
  }> {
    /**
     * IMPLEMENTATION NOTES:
     * 
     * Requires API integration with institutional data providers:
     * - CoreLogic: Property data, transaction history, foreclosure data
     * - RealtyTrac: Default and foreclosure data
     * - Zillow Research: Market trends and pricing data
     * - Freddie Mac: Loan performance data
     * - Fannie Mae: Single-family loan performance database
     * 
     * Train model on thousands of historical deals:
     * - Minimum 5,000 deals for reliable training
     * - Ideally 10,000+ deals across multiple market cycles
     * - Include data from expansion, peak, contraction, and trough phases
     * - Geographic diversity to capture regional variations
     * - Property type diversity (SFH, Multi-Family, Commercial)
     * 
     * Recommended ML Libraries:
     * - TensorFlow.js for browser-based inference
     * - Python backend with scikit-learn/XGBoost for training
     * - ONNX for model exchange between frameworks
     * 
     * Model Architecture Suggestions:
     * - Gradient Boosting (XGBoost/LightGBM) for tabular data
     * - Neural Network with 3-4 hidden layers for complex patterns
     * - Ensemble of multiple models for robust predictions
     * - Separate models for default prediction and return forecasting
     */
    
    console.warn('trainMLRiskModel: Framework placeholder - implementation required');
    console.info('Requirements:');
    console.info('  1. API integration with institutional data providers (CoreLogic, RealtyTrac)');
    console.info('  2. Access to thousands of historical deals with verified outcomes');
    console.info('  3. ML framework integration (TensorFlow.js, ONNX)');
    console.info('  4. Data preprocessing and feature engineering pipeline');
    console.info(`  5. Minimum ${trainingConfig?.minSampleSize || 5000} deals required for training`);
    
    // Placeholder validation
    if (this.trainingData.length < (trainingConfig?.minSampleSize || 5000)) {
      return {
        success: false,
        metrics: {
          accuracy: 0,
          precision: 0,
          recall: 0,
          f1Score: 0,
          auc: 0,
          mae: 0,
          mse: 0,
          rmse: 0,
          r2: 0,
          calibrationError: 0,
          overallScore: 0,
          timestamp: new Date()
        },
        message: `Insufficient training data. Need ${trainingConfig?.minSampleSize || 5000} deals, have ${this.trainingData.length}`
      };
    }
    
    // TODO: Implement actual training logic
    // 1. Load data from institutional providers
    // 2. Preprocess and engineer features
    // 3. Train ML models (classification + regression)
    // 4. Validate and evaluate
    // 5. Export trained model
    
    return {
      success: false,
      metrics: {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        auc: 0,
        mae: 0,
        mse: 0,
        rmse: 0,
        r2: 0,
        calibrationError: 0,
        overallScore: 0,
        timestamp: new Date()
      },
      message: 'Model training not yet implemented. Framework placeholder only.'
    };
  }
  
  /**
   * Predict Default Probability using ML Model
   * 
   * FRAMEWORK PLACEHOLDER - Future ML Implementation
   * 
   * Uses trained machine learning model to predict the probability that a
   * borrower will default on a real estate investment loan.
   * 
   * This is a more sophisticated version of estimateProbabilityOfDefault() that
   * leverages trained ML models instead of rule-based heuristics.
   * 
   * Requirements:
   * - Requires API integration with institutional data providers for model training
   * - Train model on thousands of historical deals with actual default outcomes
   * - Minimum 5,000+ deals with verified default data recommended
   * 
   * Model Features:
   * - Uses all 50+ deal metrics as input features
   * - Applies learned weights from historical default patterns
   * - Accounts for non-linear relationships between features
   * - Considers market cycle indicators and regional variations
   * - Provides calibrated probability estimates with confidence intervals
   * 
   * Suggested Model Architecture:
   * - Gradient Boosting Classifier (XGBoost/LightGBM)
   * - Logistic Regression with polynomial features
   * - Neural Network with 3 hidden layers
   * - Ensemble of multiple models for robustness
   * 
   * @param inputs Deal metrics and optional historical performance data
   * @param options Prediction options
   * @param options.includeFeatureImportance Return SHAP values for interpretability
   * @param options.confidenceInterval Confidence level for probability intervals
   * 
   * @returns Promise resolving to default probability with confidence metrics
   * 
   * @example
   * ```typescript
   * const result = await mlRiskModel.predictDefaultProbability(inputs, {
   *   includeFeatureImportance: true,
   *   confidenceInterval: 0.95
   * });
   * console.log(`Default probability: ${result.probability * 100}%`);
   * console.log(`95% CI: [${result.lowerBound}, ${result.upperBound}]`);
   * ```
   */
  async predictDefaultProbability(
    inputs: MLRiskModelInputs,
    options?: {
      includeFeatureImportance?: boolean;
      confidenceInterval?: number;
    }
  ): Promise<{
    probability: number;
    lowerBound: number;
    upperBound: number;
    confidence: number;
    riskCategory: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
    featureImportance?: FeatureImportance[];
    modelVersion: string;
    timestamp: Date;
  }> {
    /**
     * IMPLEMENTATION NOTES:
     * 
     * Requires API integration with institutional data providers:
     * - Freddie Mac Single-Family Loan-Level Dataset
     * - Fannie Mae Single-Family Loan Performance Data
     * - RealtyTrac Foreclosure and Default Database
     * - CoreLogic Loan Performance Data
     * 
     * Train model on thousands of historical deals:
     * - Collect 5,000-10,000+ loans with known default outcomes
     * - Include features: DSCR, LTV, DTI, FICO, property characteristics
     * - Include market conditions at origination and during holding period
     * - Include regional economic indicators (unemployment, GDP growth)
     * - Label: binary default indicator (1 = defaulted, 0 = performed)
     * 
     * Model Training Process:
     * 1. Data Collection & Cleaning:
     *    - Download historical loan performance data
     *    - Filter for investment properties (exclude owner-occupied)
     *    - Handle missing values and outliers
     *    - Create binary default labels (90+ days delinquent or foreclosure)
     * 
     * 2. Feature Engineering:
     *    - Calculate derived ratios (DTI, DSCR, LTV trends)
     *    - Create interaction terms (DSCR × LTV, Age × LTV)
     *    - Add macroeconomic indicators at origination date
     *    - Create time-to-event features for survival analysis
     * 
     * 3. Model Training:
     *    - Split data: 70% train, 15% validation, 15% test
     *    - Train gradient boosting classifier (XGBoost recommended)
     *    - Hyperparameter tuning via cross-validation
     *    - Calibrate probabilities using Platt scaling or isotonic regression
     * 
     * 4. Model Evaluation:
     *    - ROC-AUC score (target: >0.75 for good discrimination)
     *    - Precision-Recall curves for imbalanced data
     *    - Calibration plots to ensure probability accuracy
     *    - Confusion matrix at various threshold levels
     * 
     * 5. SHAP Analysis:
     *    - Use SHAP (SHapley Additive exPlanations) for feature importance
     *    - Generate per-prediction explanations
     *    - Identify top risk factors for each deal
     * 
     * Example TensorFlow.js Implementation:
     * ```javascript
     * const model = await tf.loadLayersModel('file://./models/default-predictor/model.json');
     * const features = preprocessFeatures(inputs.dealMetrics);
     * const prediction = model.predict(features);
     * const probability = await prediction.data();
     * ```
     */
    
    console.warn('predictDefaultProbability: Framework placeholder - using rule-based fallback');
    console.info('ML-based prediction requires:');
    console.info('  1. Trained model on historical default data');
    console.info('  2. API access to institutional loan performance databases');
    console.info('  3. TensorFlow.js or ONNX model runtime');
    
    // Fallback to rule-based estimation
    const prediction = this.predict(inputs);
    const probability = prediction.probabilityOfDefault;
    const confidenceLevel = options?.confidenceInterval || 0.95;
    const margin = (1 - prediction.predictionConfidence) * 0.2;
    
    let riskCategory: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
    if (probability < 0.05) riskCategory = 'Very Low';
    else if (probability < 0.15) riskCategory = 'Low';
    else if (probability < 0.30) riskCategory = 'Moderate';
    else if (probability < 0.50) riskCategory = 'High';
    else riskCategory = 'Very High';
    
    return {
      probability,
      lowerBound: Math.max(0, probability - margin),
      upperBound: Math.min(1, probability + margin),
      confidence: confidenceLevel,
      riskCategory,
      featureImportance: options?.includeFeatureImportance ? prediction.topRiskDrivers : undefined,
      modelVersion: '1.0.0-rule-based-fallback',
      timestamp: new Date()
    };
  }
  
  /**
   * Predict Expected Return Distribution using ML Model
   * 
   * FRAMEWORK PLACEHOLDER - Future ML Implementation
   * 
   * Uses trained machine learning models to predict the full probability
   * distribution of expected returns, not just a point estimate.
   * 
   * This enables:
   * - More accurate risk assessment with return volatility
   * - Confidence intervals for return expectations
   * - Downside risk analysis (probability of loss)
   * - Upside potential quantification
   * - Scenario-based return forecasting
   * 
   * Requirements:
   * - Requires API integration with institutional data providers for training data
   * - Train model on thousands of historical deals with actual return outcomes
   * - Minimum 5,000+ deals with verified exit returns recommended
   * - Include deals across multiple market cycles for robustness
   * 
   * Model Approach:
   * - Quantile Regression: Predict return distribution percentiles
   * - Monte Carlo Dropout: Generate return samples for distribution
   * - Mixture Density Networks: Output full probability distribution
   * - Gaussian Process Regression: Predict mean and variance
   * 
   * Output Distribution:
   * - Mean expected return
   * - Standard deviation (volatility)
   * - Percentiles: 5th, 25th, 50th (median), 75th, 95th
   * - Probability of negative returns
   * - Value at Risk (VaR) and Conditional VaR
   * 
   * @param inputs Deal metrics and optional historical performance data
   * @param options Distribution prediction options
   * @param options.numSamples Number of Monte Carlo samples for distribution
   * @param options.percentiles Percentiles to return for distribution
   * @param options.includeScenarios Return scenario-based forecasts
   * 
   * @returns Promise resolving to return distribution with statistics
   * 
   * @example
   * ```typescript
   * const distribution = await mlRiskModel.predictExpectedReturnDistribution(inputs, {
   *   numSamples: 10000,
   *   percentiles: [0.05, 0.25, 0.5, 0.75, 0.95],
   *   includeScenarios: true
   * });
   * console.log(`Expected return: ${distribution.mean}% ± ${distribution.stdDev}%`);
   * console.log(`95% CI: [${distribution.percentiles.p05}, ${distribution.percentiles.p95}]`);
   * console.log(`Probability of loss: ${distribution.probabilityOfLoss * 100}%`);
   * ```
   */
  async predictExpectedReturnDistribution(
    inputs: MLRiskModelInputs,
    options?: {
      numSamples?: number;
      percentiles?: number[];
      includeScenarios?: boolean;
    }
  ): Promise<{
    mean: number;
    median: number;
    stdDev: number;
    skewness: number;
    kurtosis: number;
    percentiles: {
      p05: number;
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
      p95: number;
    };
    probabilityOfLoss: number;
    probabilityOfOutperformance: number; // > expected return
    valueAtRisk95: number;
    conditionalVaR95: number;
    scenarios?: {
      bearCase: { return: number; probability: number };
      baseCase: { return: number; probability: number };
      bullCase: { return: number; probability: number };
    };
    distributionSamples?: number[];
    confidence: number;
    modelVersion: string;
    timestamp: Date;
  }> {
    /**
     * IMPLEMENTATION NOTES:
     * 
     * Requires API integration with institutional data providers:
     * - NCREIF Property Index: Historical property returns
     * - Zillow Research: Transaction-based returns data
     * - CoreLogic: Property appreciation and income data
     * - Real Capital Analytics: Commercial property returns
     * - Private equity real estate databases (Cambridge Associates, Preqin)
     * 
     * Train model on thousands of historical deals:
     * - Collect 5,000-10,000+ deals with verified exit returns
     * - Include holding period returns (1, 3, 5, 7, 10 years)
     * - Include total returns (appreciation + income)
     * - Include deals across market cycles (2000-present)
     * - Geographic and property type diversity
     * 
     * Data Collection Requirements:
     * 1. Deal Characteristics at Entry:
     *    - Purchase price, financing terms, property metrics
     *    - Market conditions, cap rates, rental yields
     *    - Economic indicators at purchase date
     * 
     * 2. Holding Period Data:
     *    - Annual cash flows (rental income - expenses)
     *    - Property value changes (annual appraisals)
     *    - Capital expenditures and improvements
     *    - Market cycle indicators during hold
     * 
     * 3. Exit Data:
     *    - Sale price and date
     *    - Total holding period return (IRR, MOIC)
     *    - Exit strategy (sale, refinance, hold)
     *    - Market conditions at exit
     * 
     * Model Architecture Options:
     * 
     * Option 1: Quantile Regression Neural Network
     * - Train separate models for percentiles (5th, 25th, 50th, 75th, 95th)
     * - Advantages: Direct percentile predictions, no distribution assumptions
     * - Implementation: TensorFlow.js with custom quantile loss function
     * 
     * Option 2: Mixture Density Network (MDN)
     * - Output parameters of Gaussian mixture model
     * - Advantages: Full distribution, handles multi-modal returns
     * - Implementation: Neural network with MDN output layer
     * 
     * Option 3: Monte Carlo Dropout
     * - Use dropout at inference time for uncertainty estimation
     * - Generate 1,000+ predictions to form distribution
     * - Advantages: Simple, works with existing architectures
     * 
     * Option 4: Gaussian Process Regression
     * - Model returns as Gaussian process
     * - Advantages: Principled uncertainty quantification
     * - Challenges: Computationally expensive for large datasets
     * 
     * Recommended Approach:
     * - Use Mixture Density Network for primary model
     * - Ensemble with quantile regression for robustness
     * - Validate against historical return distributions
     * - Calibrate predictions using isotonic regression
     * 
     * Example Implementation (MDN):
     * ```javascript
     * const model = await tf.loadLayersModel('file://./models/return-mdn/model.json');
     * const features = preprocessFeatures(inputs.dealMetrics);
     * const [mus, sigmas, pis] = model.predict(features); // Mixture parameters
     * const samples = sampleFromMixture(mus, sigmas, pis, numSamples=10000);
     * const distribution = calculateStatistics(samples);
     * ```
     */
    
    console.warn('predictExpectedReturnDistribution: Framework placeholder - using simplified fallback');
    console.info('ML-based distribution prediction requires:');
    console.info('  1. Trained model on historical deal returns (5,000+ deals)');
    console.info('  2. API access to property return databases (NCREIF, CoreLogic)');
    console.info('  3. Mixture Density Network or Quantile Regression model');
    console.info('  4. Monte Carlo simulation framework for distribution sampling');
    
    // Fallback to simplified distribution based on rule-based estimates
    const prediction = this.predict(inputs);
    const mean = prediction.expectedReturn;
    const stdDev = prediction.returnVolatility;
    
    // Generate simplified normal distribution samples
    const numSamples = options?.numSamples || 10000;
    const samples: number[] = [];
    for (let i = 0; i < numSamples; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      samples.push(mean + z * stdDev);
    }
    
    samples.sort((a, b) => a - b);
    
    // Calculate percentiles
    const getPercentile = (p: number) => samples[Math.floor(numSamples * p)];
    
    // Calculate moments
    const sum = samples.reduce((a, b) => a + b, 0);
    const mean_calc = sum / numSamples;
    const median = getPercentile(0.5);
    
    const variance = samples.reduce((sum, x) => sum + Math.pow(x - mean_calc, 2), 0) / numSamples;
    const stdDev_calc = Math.sqrt(variance);
    
    const skewness = samples.reduce((sum, x) => sum + Math.pow((x - mean_calc) / stdDev_calc, 3), 0) / numSamples;
    const kurtosis = samples.reduce((sum, x) => sum + Math.pow((x - mean_calc) / stdDev_calc, 4), 0) / numSamples - 3;
    
    // Calculate probabilities
    const probabilityOfLoss = samples.filter(x => x < 0).length / numSamples;
    const probabilityOfOutperformance = samples.filter(x => x > mean).length / numSamples;
    
    // VaR and CVaR
    const valueAtRisk95 = -getPercentile(0.05); // 5th percentile loss
    const lossesWorseThanVaR = samples.slice(0, Math.floor(numSamples * 0.05));
    const conditionalVaR95 = lossesWorseThanVaR.length > 0
      ? -(lossesWorseThanVaR.reduce((a, b) => a + b, 0) / lossesWorseThanVaR.length)
      : valueAtRisk95;
    
    return {
      mean: mean_calc,
      median,
      stdDev: stdDev_calc,
      skewness,
      kurtosis,
      percentiles: {
        p05: getPercentile(0.05),
        p10: getPercentile(0.10),
        p25: getPercentile(0.25),
        p50: getPercentile(0.50),
        p75: getPercentile(0.75),
        p90: getPercentile(0.90),
        p95: getPercentile(0.95)
      },
      probabilityOfLoss,
      probabilityOfOutperformance,
      valueAtRisk95,
      conditionalVaR95,
      scenarios: options?.includeScenarios ? {
        bearCase: { return: getPercentile(0.10), probability: 0.10 },
        baseCase: { return: median, probability: 0.50 },
        bullCase: { return: getPercentile(0.90), probability: 0.10 }
      } : undefined,
      distributionSamples: options?.numSamples ? samples : undefined,
      confidence: prediction.predictionConfidence,
      modelVersion: '1.0.0-normal-distribution-fallback',
      timestamp: new Date()
    };
  }
}

/**
 * Export singleton instance with default configuration
 */
export const mlRiskModel = new MLRiskModelService();

/**
 * Export factory function for custom configurations
 */
export const createMLRiskModel = (config?: Partial<MLModelConfig>) => {
  return new MLRiskModelService(config);
};

