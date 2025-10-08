/**
 * Type definitions for ML Risk Model
 */

export interface MLRiskFeatures {
  // Market factors
  market_volatility: number; // 1-10 scale
  market_appreciation_rate: number; // Annual %
  market_inventory_level: number; // Months of inventory
  market_demand_strength: number; // 1-10 scale

  // Property factors
  property_age: number; // Years
  property_condition: number; // 1-10 scale
  property_value: number; // Dollar amount
  maintenance_cost_multiplier: number; // Multiplier

  // Location factors
  location_stability: number; // 1-10 scale
  neighborhood_crime_rate: number; // Per 1000 residents
  school_rating: number; // 1-10 scale
  walkability_score: number; // 0-100

  // Tenant/Income factors
  tenant_quality: number; // 1-10 scale
  vacancy_rate: number; // Percentage
  rent_to_market_ratio: number; // Ratio
  debt_service_coverage_ratio: number; // DSCR

  // Financing factors
  financing_risk: number; // 1-10 scale
  loan_to_value: number; // Percentage
  interest_rate: number; // Percentage
  has_balloon_payment: boolean;
  is_interest_only: boolean;

  // Economic factors
  unemployment_rate: number; // Percentage
  inflation_rate: number; // Percentage
  median_income: number; // Dollar amount
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface MLConfidenceInterval {
  lower_bound: number;
  upper_bound: number;
}

export interface MLComparison {
  rule_based_score: number;
  ml_vs_rule_difference: number;
}

export interface MLPredictionMetadata {
  model_version: string;
  prediction_timestamp: string;
}

export interface MLRiskPrediction {
  overall_risk_score: number; // 1-10 scale
  confidence_score: number; // 0-1 scale
  risk_category: 'Low' | 'Medium' | 'High' | 'Very High';
  top_risk_drivers: FeatureImportance[];
  confidence_interval: MLConfidenceInterval;
  comparison: MLComparison;
  ml_recommendations: string[];
  metadata: MLPredictionMetadata;
}

export interface MLRiskRequest {
  features: MLRiskFeatures;
  rule_based_score?: number;
}

export interface MLRiskResponse extends MLRiskPrediction {}

export interface MLRiskError {
  error: string;
  message: string;
  fallback_used: boolean;
}

export interface MLModelInfo {
  model_version: string;
  feature_count: number;
  features: string[];
  sklearn_available: boolean;
}

// Helper type for dealing with ML risk in UI components
export interface EnhancedRiskAnalysis {
  // Original rule-based risk
  ruleBasedScore: number;
  ruleBasedCategory: 'Low' | 'Medium' | 'High' | 'Very High';
  ruleBasedRecommendations: string[];

  // ML-enhanced risk (may be null if not available)
  mlPrediction: MLRiskPrediction | null;
  mlAvailable: boolean;

  // Combined insights
  combinedScore: number; // Weighted average or preference
  combinedCategory: 'Low' | 'Medium' | 'High' | 'Very High';
  allRecommendations: string[];
}

