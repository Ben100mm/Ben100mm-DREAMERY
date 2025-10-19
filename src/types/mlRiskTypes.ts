/**
 * ML Risk Model Types
 * 
 * Type definitions for machine learning-based risk assessment framework.
 * This provides the structure for future ML model integration.
 */

/**
 * Core deal metrics used as ML model inputs
 */
export interface DealMetrics {
  // Financing Metrics
  dscr: number; // Debt Service Coverage Ratio
  ltv: number; // Loan-to-Value ratio
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // in years
  
  // Return Metrics
  cocReturn: number; // Cash-on-Cash return
  capRate: number; // Capitalization rate
  irr?: number; // Internal Rate of Return
  moic?: number; // Multiple on Invested Capital
  equityMultiple?: number;
  
  // Property Characteristics
  propertyAge: number; // in years
  propertyType: 'SFH' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Commercial';
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  lotSize?: number;
  
  // Location Data
  zipCode: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  
  // Market Data
  purchasePrice: number;
  afterRepairValue: number;
  monthlyRent: number;
  occupancyRate: number; // 0-1
  marketAppreciation: number; // annual % expected
  
  // Operating Metrics
  monthlyIncome: number;
  monthlyExpenses: number;
  vacancyRate: number; // 0-1
  maintenanceReserve: number;
  managementFeeRate: number; // 0-1
  
  // Renovation/Rehab
  rehabCost: number;
  rehabDuration?: number; // in months
  holdingCosts?: number;
  
  // Market Conditions
  daysOnMarket?: number;
  priceReduction?: number;
  competitiveListings?: number;
  unemploymentRate?: number;
  crimeIndex?: number;
  schoolRating?: number;
  walkScore?: number;
  
  // Additional Risk Factors
  ownerOccupied?: boolean;
  foreclosure?: boolean;
  floodZone?: boolean;
  historicDistrict?: boolean;
  hoa?: boolean;
  hoaFees?: number;
}

/**
 * Historical performance data for model training and validation
 */
export interface HistoricalPerformance {
  actualReturns: number[]; // yearly returns
  defaultOccurred: boolean;
  yearsHeld: number;
  exitStrategy: 'Sale' | 'Refinance' | 'Hold' | 'Default';
  finalValue: number;
  totalCashFlow: number;
  unexpectedExpenses: number;
  marketCyclePhase: 'Expansion' | 'Peak' | 'Contraction' | 'Trough';
  seasonality?: string; // e.g., 'Q1', 'Q2', etc.
}

/**
 * Complete ML model input structure
 */
export interface MLRiskModelInputs {
  dealMetrics: DealMetrics;
  historicalPerformance?: HistoricalPerformance;
  externalData?: {
    censusData?: any;
    economicIndicators?: any;
    marketTrends?: any;
  };
}

/**
 * Feature importance scoring for interpretability
 */
export interface FeatureImportance {
  featureName: string;
  importance: number; // 0-1 scale
  category: 'Financial' | 'Location' | 'Property' | 'Market' | 'Risk';
  direction: 'positive' | 'negative' | 'neutral'; // impact on risk
}

/**
 * Confidence intervals for predictions
 */
export interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidence: number; // e.g., 0.95 for 95% CI
}

/**
 * Risk score breakdown by category
 */
export interface RiskBreakdown {
  financialRisk: number; // 0-100
  marketRisk: number; // 0-100
  propertyRisk: number; // 0-100
  locationRisk: number; // 0-100
  liquidityRisk: number; // 0-100
  operationalRisk: number; // 0-100
}

/**
 * ML model prediction output
 */
export interface MLRiskPrediction {
  // Overall Risk Score
  overallRiskScore: number; // 0-100 (0 = lowest risk, 100 = highest risk)
  riskCategory: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  
  // Probability Estimates
  probabilityOfDefault: number; // 0-1
  expectedLossRate: number; // 0-1
  expectedReturn: number; // %
  returnVolatility: number; // standard deviation
  
  // Risk Breakdown
  riskBreakdown: RiskBreakdown;
  
  // Confidence Metrics
  predictionConfidence: number; // 0-1
  confidenceIntervals: {
    riskScore: ConfidenceInterval;
    expectedReturn: ConfidenceInterval;
    probabilityOfDefault: ConfidenceInterval;
  };
  
  // Feature Analysis
  topRiskDrivers: FeatureImportance[];
  topOpportunityDrivers: FeatureImportance[];
  
  // Recommendations
  recommendations: string[];
  warnings: string[];
  
  // Model Metadata
  modelVersion: string;
  timestamp: Date;
  dataQuality: number; // 0-1 (completeness of input data)
}

/**
 * ML model configuration
 */
export interface MLModelConfig {
  // Model Parameters
  modelType: 'LinearRegression' | 'LogisticRegression' | 'RandomForest' | 'GradientBoosting' | 'NeuralNetwork';
  featureScaling: boolean;
  featureSelection: boolean;
  maxFeatures?: number;
  
  // Risk Thresholds
  riskThresholds: {
    veryLow: number; // e.g., 0-20
    low: number; // e.g., 20-40
    moderate: number; // e.g., 40-60
    high: number; // e.g., 60-80
    veryHigh: number; // e.g., 80-100
  };
  
  // Feature Weights (for weighted scoring)
  featureWeights?: {
    [key: string]: number;
  };
  
  // Validation Settings
  crossValidationFolds?: number;
  testSplitRatio?: number;
  
  // Prediction Settings
  confidenceLevel: number; // e.g., 0.95
  minDataQuality: number; // minimum required data quality score
}

/**
 * Engineered features for ML model
 */
export interface EngineeredFeatures {
  // Derived Ratios
  debtToIncome: number;
  rentToPrice: number;
  priceToIncomeRatio: number;
  operatingExpenseRatio: number;
  cashFlowCoverage: number;
  
  // Risk Indicators
  leverageScore: number;
  liquidityScore: number;
  stabilityScore: number;
  
  // Market Position
  relativePricing: number; // vs market average
  marketMomentum: number;
  competitivePosition: number;
  
  // Composite Scores
  financialHealthScore: number;
  locationQualityScore: number;
  propertyQualityScore: number;
}

/**
 * Model training data point
 */
export interface TrainingDataPoint {
  inputs: MLRiskModelInputs;
  outcome: {
    actualRisk: number;
    actualReturn: number;
    defaulted: boolean;
  };
  weight?: number; // for weighted training
}

/**
 * Model evaluation metrics
 */
export interface ModelEvaluationMetrics {
  // Classification Metrics (for default prediction)
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number; // Area Under ROC Curve
  
  // Regression Metrics (for return prediction)
  mae: number; // Mean Absolute Error
  mse: number; // Mean Squared Error
  rmse: number; // Root Mean Squared Error
  r2: number; // R-squared
  
  // Calibration Metrics
  calibrationError: number;
  
  // Overall Performance
  overallScore: number;
  timestamp: Date;
}

/**
 * Risk-adjusted return metrics
 */
export interface RiskAdjustedMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  informationRatio: number;
  riskAdjustedReturn: number;
  valueAtRisk95: number; // 95% VaR
  conditionalVaR95: number; // Expected Shortfall
}

// ============================================================================
// MODEL WEIGHTS STORAGE - Future ML Integration
// ============================================================================

/**
 * Model weights storage format
 * 
 * Stores trained model weights for persistence and versioning.
 * Supports multiple model architectures and serialization formats.
 */
export interface ModelWeights {
  modelId: string; // Unique identifier for this model
  modelName: string; // Human-readable name
  modelType: 'LinearRegression' | 'LogisticRegression' | 'RandomForest' | 'GradientBoosting' | 'NeuralNetwork' | 'Ensemble';
  version: string; // Semantic versioning (e.g., "1.2.3")
  
  // Weight data
  weights: {
    format: 'tensorflow' | 'onnx' | 'json' | 'binary';
    data: any; // Model-specific weight data
    shape?: number[]; // Tensor shapes if applicable
    dtype?: string; // Data type (float32, float64, etc.)
  };
  
  // Model architecture
  architecture?: {
    layers?: LayerConfig[];
    inputShape?: number[];
    outputShape?: number[];
    activationFunctions?: string[];
    regularization?: {
      type: 'l1' | 'l2' | 'dropout' | 'none';
      value: number;
    };
  };
  
  // Hyperparameters
  hyperparameters: {
    learningRate?: number;
    epochs?: number;
    batchSize?: number;
    optimizer?: string;
    lossFunction?: string;
    [key: string]: any; // Additional hyperparameters
  };
  
  // Training metadata
  trainingMetadata: {
    trainingDate: Date;
    trainingDuration: number; // seconds
    datasetSize: number; // number of samples
    trainTestSplit: number; // e.g., 0.8 for 80/20
    crossValidationFolds?: number;
    randomSeed?: number;
  };
  
  // Performance metrics
  performanceMetrics: ModelEvaluationMetrics;
  
  // Feature information
  featureNames: string[];
  featureScaling?: {
    method: 'standardization' | 'normalization' | 'none';
    parameters?: {
      mean?: number[];
      std?: number[];
      min?: number[];
      max?: number[];
    };
  };
  
  // Storage metadata
  storageMetadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    fileSize?: number; // bytes
    checksum?: string; // for integrity verification
    storageLocation?: string; // file path or URL
  };
  
  // Deployment status
  deployment?: {
    status: 'development' | 'staging' | 'production' | 'deprecated';
    deployedAt?: Date;
    endpoint?: string;
    servingPlatform?: string;
  };
  
  // Notes and documentation
  notes?: string;
  tags?: string[];
}

/**
 * Layer configuration for neural network architectures
 */
export interface LayerConfig {
  type: 'dense' | 'dropout' | 'batchNorm' | 'conv' | 'lstm' | 'embedding';
  units?: number;
  activation?: string;
  dropout?: number;
  inputShape?: number[];
  outputShape?: number[];
  parameters?: {
    [key: string]: any;
  };
}

/**
 * Model registry for managing multiple model versions
 */
export interface ModelRegistry {
  models: {
    [modelId: string]: ModelWeights;
  };
  activeModelId?: string; // Currently deployed model
  defaultModelId?: string; // Fallback model
  modelHistory: {
    modelId: string;
    event: 'created' | 'trained' | 'deployed' | 'deprecated' | 'deleted';
    timestamp: Date;
    performanceMetrics?: ModelEvaluationMetrics;
    notes?: string;
  }[];
}

/**
 * Model checkpoint for incremental training
 */
export interface ModelCheckpoint {
  checkpointId: string;
  modelId: string;
  epoch: number;
  weights: any; // Serialized weights at this checkpoint
  trainingLoss: number;
  validationLoss: number;
  trainingMetrics: {
    [metricName: string]: number;
  };
  validationMetrics: {
    [metricName: string]: number;
  };
  timestamp: Date;
  isBestModel: boolean; // Best performing checkpoint
}

// ============================================================================
// FEATURE IMPORTANCE TRACKING - Advanced Analytics
// ============================================================================

/**
 * Feature importance tracking over time
 * 
 * Tracks how feature importance changes across model versions,
 * time periods, and market conditions.
 */
export interface FeatureImportanceTracking {
  trackingId: string;
  featureName: string;
  category: 'Financial' | 'Location' | 'Property' | 'Market' | 'Risk';
  
  // Current importance
  currentImportance: FeatureImportance;
  
  // Historical importance
  importanceHistory: {
    timestamp: Date;
    importance: number;
    modelVersion: string;
    marketCondition?: 'Expansion' | 'Peak' | 'Contraction' | 'Trough';
    datasetSize: number;
    notes?: string;
  }[];
  
  // Statistical analysis
  statistics: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    volatility: number; // measure of importance stability
  };
  
  // Correlation with outcomes
  outcomeCorrelation?: {
    defaultCorrelation: number; // correlation with default probability
    returnCorrelation: number; // correlation with returns
    riskCorrelation: number; // correlation with risk score
  };
  
  // Feature interactions
  interactions?: {
    featureName: string;
    interactionStrength: number; // 0-1
    interactionType: 'synergistic' | 'antagonistic' | 'independent';
  }[];
  
  // SHAP values (if available)
  shapValues?: {
    mean: number;
    median: number;
    min: number;
    max: number;
    distribution: number[]; // SHAP value distribution
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    analysisCount: number; // number of predictions analyzed
  };
}

/**
 * Global feature importance summary
 * 
 * Aggregates feature importance across all predictions and models.
 */
export interface GlobalFeatureImportance {
  features: {
    [featureName: string]: FeatureImportanceTracking;
  };
  
  // Top features
  topFeatures: {
    overall: FeatureImportance[];
    byCategory: {
      [category: string]: FeatureImportance[];
    };
    byMarketCondition?: {
      [condition: string]: FeatureImportance[];
    };
  };
  
  // Feature stability
  featureStability: {
    stable: string[]; // features with low volatility
    volatile: string[]; // features with high volatility
    emerging: string[]; // features gaining importance
    declining: string[]; // features losing importance
  };
  
  // Summary statistics
  summary: {
    totalFeatures: number;
    activeFeaturesCount: number; // features with importance > threshold
    averageImportance: number;
    importanceConcentration: number; // measure of whether importance is concentrated in few features
    lastUpdated: Date;
  };
}

/**
 * Feature importance snapshot for a specific prediction
 */
export interface PredictionFeatureImportance {
  predictionId: string;
  timestamp: Date;
  modelVersion: string;
  
  // Feature contributions to this specific prediction
  featureContributions: {
    featureName: string;
    value: number; // actual feature value
    importance: number; // importance score (0-1)
    contribution: number; // contribution to prediction
    direction: 'positive' | 'negative' | 'neutral';
    percentile: number; // where this value falls in historical distribution
  }[];
  
  // Top positive and negative contributors
  topPositiveContributors: string[];
  topNegativeContributors: string[];
  
  // Comparison to average
  deviationFromAverage: {
    [featureName: string]: number; // how much this differs from typical
  };
}

// ============================================================================
// PREDICTION CONFIDENCE INTERVALS - Uncertainty Quantification
// ============================================================================

/**
 * Confidence interval configuration
 * 
 * Defines how confidence intervals are calculated and stored.
 */
export interface ConfidenceIntervalConfig {
  method: 'bootstrap' | 'bayesian' | 'monteCarlo' | 'analytical';
  confidenceLevel: number; // e.g., 0.95 for 95% CI
  numSamples?: number; // for bootstrap/Monte Carlo
  burnInPeriod?: number; // for Bayesian methods
  
  // Interval type
  intervalType: 'percentile' | 'hdi' | 'normal'; // highest density interval
  
  // Asymmetric intervals
  allowAsymmetric: boolean; // allow different upper/lower bounds
}

/**
 * Enhanced confidence interval with detailed uncertainty metrics
 */
export interface EnhancedConfidenceInterval extends ConfidenceInterval {
  // Basic interval
  // lower: number;
  // upper: number;
  // confidence: number;
  
  // Distribution shape
  distribution?: {
    mean: number;
    median: number;
    mode: number;
    stdDev: number;
    skewness: number;
    kurtosis: number;
  };
  
  // Uncertainty sources
  uncertaintySources?: {
    modelUncertainty: number; // epistemic uncertainty
    dataUncertainty: number; // aleatoric uncertainty
    parameterUncertainty: number; // hyperparameter uncertainty
    totalUncertainty: number; // combined
  };
  
  // Interval width metrics
  intervalWidth: number;
  relativeWidth: number; // width relative to mean
  
  // Calibration metrics
  calibration?: {
    isWellCalibrated: boolean;
    calibrationError: number;
    coverage: number; // actual coverage vs expected
  };
  
  // Method-specific data
  methodMetadata?: {
    samplingMethod?: string;
    convergenceDiagnostic?: number;
    effectiveSampleSize?: number;
  };
  
  // Computation metadata
  computedAt: Date;
  computationTime: number; // milliseconds
}

/**
 * Confidence intervals for all predictions
 * 
 * Stores confidence intervals for risk score, return, and default probability.
 */
export interface PredictionConfidenceIntervals {
  predictionId: string;
  modelVersion: string;
  timestamp: Date;
  
  // Core predictions with intervals
  riskScore: EnhancedConfidenceInterval;
  expectedReturn: EnhancedConfidenceInterval;
  probabilityOfDefault: EnhancedConfidenceInterval;
  
  // Additional predictions
  capRate?: EnhancedConfidenceInterval;
  cashOnCash?: EnhancedConfidenceInterval;
  irr?: EnhancedConfidenceInterval;
  
  // Overall prediction confidence
  overallConfidence: {
    score: number; // 0-1
    category: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
    factors: {
      dataQuality: number;
      modelConfidence: number;
      featureCompleteness: number;
      historicalAccuracy: number;
    };
  };
  
  // Confidence interval configuration used
  config: ConfidenceIntervalConfig;
  
  // Warnings and notes
  warnings?: string[];
  notes?: string;
}

/**
 * Confidence tracking over time
 * 
 * Tracks model confidence and calibration over time to detect degradation.
 */
export interface ConfidenceTracking {
  trackingId: string;
  modelId: string;
  
  // Time series of confidence metrics
  confidenceHistory: {
    timestamp: Date;
    predictionId: string;
    predictedConfidence: number;
    actualOutcome?: number;
    predictionError?: number;
    isWithinInterval: boolean;
    intervalWidth: number;
  }[];
  
  // Calibration analysis
  calibrationAnalysis: {
    expectedCoverage: number; // e.g., 0.95
    actualCoverage: number; // actual % of outcomes within intervals
    calibrationError: number; // difference
    isWellCalibrated: boolean;
    
    // Calibration by confidence level
    calibrationCurve: {
      predictedProbability: number;
      actualProbability: number;
      sampleCount: number;
    }[];
  };
  
  // Confidence trends
  trends: {
    averageConfidence: number;
    confidenceTrend: 'increasing' | 'decreasing' | 'stable';
    intervalWidthTrend: 'increasing' | 'decreasing' | 'stable';
    calibrationTrend: 'improving' | 'degrading' | 'stable';
  };
  
  // Performance by confidence level
  performanceByConfidence: {
    confidenceRange: string; // e.g., "0.8-0.9"
    predictionCount: number;
    averageError: number;
    coverage: number;
  }[];
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    totalPredictions: number;
    predictionsWithOutcomes: number; // predictions we can validate
  };
}

/**
 * Uncertainty decomposition
 * 
 * Breaks down prediction uncertainty into components for analysis.
 */
export interface UncertaintyDecomposition {
  predictionId: string;
  
  // Total uncertainty
  totalUncertainty: number;
  
  // Epistemic uncertainty (reducible with more data)
  epistemicUncertainty: {
    modelUncertainty: number; // uncertainty in model choice
    parameterUncertainty: number; // uncertainty in parameters
    structuralUncertainty: number; // uncertainty in model structure
    total: number;
  };
  
  // Aleatoric uncertainty (irreducible randomness)
  aleatoricUncertainty: {
    measurementNoise: number; // noise in measurements
    inherentRandomness: number; // intrinsic stochasticity
    total: number;
  };
  
  // Uncertainty attribution
  uncertaintyAttribution: {
    [source: string]: {
      contribution: number; // contribution to total uncertainty
      percentage: number; // percentage of total
      reducible: boolean; // can this be reduced?
    };
  };
  
  // Recommendations for uncertainty reduction
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    potentialReduction: number; // estimated uncertainty reduction
  }[];
}

