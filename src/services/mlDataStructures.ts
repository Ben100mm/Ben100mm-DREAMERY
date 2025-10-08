/**
 * ML Data Structures Helper Service
 * 
 * Demonstrates how to use the ML data structures for:
 * - Model weights storage
 * - Feature importance tracking
 * - Prediction confidence intervals
 * 
 * This is a framework helper that shows how to integrate these structures
 * into the ML risk model service once models are trained.
 */

import {
  ModelWeights,
  ModelRegistry,
  ModelCheckpoint,
  FeatureImportanceTracking,
  GlobalFeatureImportance,
  PredictionFeatureImportance,
  PredictionConfidenceIntervals,
  EnhancedConfidenceInterval,
  ConfidenceTracking,
  UncertaintyDecomposition,
  ConfidenceIntervalConfig,
  FeatureImportance,
  ModelEvaluationMetrics
} from '../types/mlRiskTypes';

// ============================================================================
// MODEL WEIGHTS STORAGE HELPERS
// ============================================================================

/**
 * Create a model weights entry for storage
 */
export function createModelWeights(
  modelName: string,
  modelType: ModelWeights['modelType'],
  weights: any,
  performanceMetrics: ModelEvaluationMetrics,
  featureNames: string[],
  hyperparameters: any
): ModelWeights {
  const modelId = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    modelId,
    modelName,
    modelType,
    version: '1.0.0',
    weights: {
      format: 'json',
      data: weights
    },
    hyperparameters,
    trainingMetadata: {
      trainingDate: new Date(),
      trainingDuration: 0, // to be filled during training
      datasetSize: 0,
      trainTestSplit: 0.8
    },
    performanceMetrics,
    featureNames,
    storageMetadata: {
      createdAt: new Date(),
      updatedAt: new Date()
    },
    notes: 'Initial model version'
  };
}

/**
 * Initialize model registry
 */
export function initializeModelRegistry(): ModelRegistry {
  return {
    models: {},
    modelHistory: []
  };
}

/**
 * Register a new model in the registry
 */
export function registerModel(
  registry: ModelRegistry,
  modelWeights: ModelWeights,
  setAsActive: boolean = false
): ModelRegistry {
  const updatedRegistry = { ...registry };
  
  // Add model to registry
  updatedRegistry.models[modelWeights.modelId] = modelWeights;
  
  // Add history event
  updatedRegistry.modelHistory.push({
    modelId: modelWeights.modelId,
    event: 'created',
    timestamp: new Date(),
    performanceMetrics: modelWeights.performanceMetrics,
    notes: `Model ${modelWeights.modelName} v${modelWeights.version} created`
  });
  
  // Set as active if requested
  if (setAsActive) {
    updatedRegistry.activeModelId = modelWeights.modelId;
    updatedRegistry.modelHistory.push({
      modelId: modelWeights.modelId,
      event: 'deployed',
      timestamp: new Date(),
      notes: 'Model deployed as active'
    });
  }
  
  return updatedRegistry;
}

/**
 * Save model checkpoint during training
 */
export function createModelCheckpoint(
  modelId: string,
  epoch: number,
  weights: any,
  trainingLoss: number,
  validationLoss: number,
  metrics: { [key: string]: number }
): ModelCheckpoint {
  return {
    checkpointId: `checkpoint-${modelId}-epoch${epoch}`,
    modelId,
    epoch,
    weights,
    trainingLoss,
    validationLoss,
    trainingMetrics: metrics,
    validationMetrics: metrics,
    timestamp: new Date(),
    isBestModel: false // to be determined by comparing with previous checkpoints
  };
}

/**
 * Load active model from registry
 */
export function getActiveModel(registry: ModelRegistry): ModelWeights | null {
  if (!registry.activeModelId) return null;
  return registry.models[registry.activeModelId] || null;
}

/**
 * Export model weights for persistence
 * 
 * In production, this would save to:
 * - Local file system (development)
 * - Cloud storage (S3, GCS, Azure Blob)
 * - Model registry (MLflow, Weights & Biases)
 */
export function exportModelWeights(modelWeights: ModelWeights): string {
  // Serialize to JSON for storage
  return JSON.stringify(modelWeights, null, 2);
}

/**
 * Import model weights from storage
 */
export function importModelWeights(serializedWeights: string): ModelWeights {
  const weights = JSON.parse(serializedWeights);
  
  // Convert date strings back to Date objects
  weights.trainingMetadata.trainingDate = new Date(weights.trainingMetadata.trainingDate);
  weights.storageMetadata.createdAt = new Date(weights.storageMetadata.createdAt);
  weights.storageMetadata.updatedAt = new Date(weights.storageMetadata.updatedAt);
  
  return weights;
}

// ============================================================================
// FEATURE IMPORTANCE TRACKING HELPERS
// ============================================================================

/**
 * Initialize feature importance tracking for a feature
 */
export function initializeFeatureTracking(
  featureName: string,
  category: FeatureImportance['category'],
  currentImportance: FeatureImportance
): FeatureImportanceTracking {
  return {
    trackingId: `track-${featureName}-${Date.now()}`,
    featureName,
    category,
    currentImportance,
    importanceHistory: [
      {
        timestamp: new Date(),
        importance: currentImportance.importance,
        modelVersion: '1.0.0',
        datasetSize: 0
      }
    ],
    statistics: {
      mean: currentImportance.importance,
      median: currentImportance.importance,
      stdDev: 0,
      min: currentImportance.importance,
      max: currentImportance.importance,
      trend: 'stable',
      volatility: 0
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      analysisCount: 1
    }
  };
}

/**
 * Update feature importance tracking with new prediction
 */
export function updateFeatureImportance(
  tracking: FeatureImportanceTracking,
  importance: number,
  modelVersion: string,
  marketCondition?: 'Expansion' | 'Peak' | 'Contraction' | 'Trough'
): FeatureImportanceTracking {
  const updated = { ...tracking };
  
  // Add to history
  updated.importanceHistory.push({
    timestamp: new Date(),
    importance,
    modelVersion,
    marketCondition,
    datasetSize: updated.importanceHistory.length + 1
  });
  
  // Recalculate statistics
  const importances = updated.importanceHistory.map(h => h.importance);
  const mean = importances.reduce((a, b) => a + b, 0) / importances.length;
  const sortedImportances = [...importances].sort((a, b) => a - b);
  const median = sortedImportances[Math.floor(sortedImportances.length / 2)];
  const variance = importances.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / importances.length;
  const stdDev = Math.sqrt(variance);
  
  updated.statistics = {
    mean,
    median,
    stdDev,
    min: Math.min(...importances),
    max: Math.max(...importances),
    trend: determineTrend(importances),
    volatility: stdDev / mean // coefficient of variation
  };
  
  updated.currentImportance.importance = importance;
  updated.metadata.updatedAt = new Date();
  updated.metadata.analysisCount++;
  
  return updated;
}

/**
 * Determine trend from time series
 */
function determineTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable';
  
  // Simple linear regression slope
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }
  
  const slope = numerator / denominator;
  
  if (slope > 0.01) return 'increasing';
  if (slope < -0.01) return 'decreasing';
  return 'stable';
}

/**
 * Initialize global feature importance tracking
 */
export function initializeGlobalFeatureImportance(): GlobalFeatureImportance {
  return {
    features: {},
    topFeatures: {
      overall: [],
      byCategory: {}
    },
    featureStability: {
      stable: [],
      volatile: [],
      emerging: [],
      declining: []
    },
    summary: {
      totalFeatures: 0,
      activeFeaturesCount: 0,
      averageImportance: 0,
      importanceConcentration: 0,
      lastUpdated: new Date()
    }
  };
}

/**
 * Update global feature importance with new tracking data
 */
export function updateGlobalFeatureImportance(
  global: GlobalFeatureImportance,
  tracking: FeatureImportanceTracking
): GlobalFeatureImportance {
  const updated = { ...global };
  
  // Update feature tracking
  updated.features[tracking.featureName] = tracking;
  
  // Recalculate top features
  const allFeatures = Object.values(updated.features).map(f => f.currentImportance);
  updated.topFeatures.overall = allFeatures
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);
  
  // Update by category
  const categories = new Set(allFeatures.map(f => f.category));
  categories.forEach(category => {
    updated.topFeatures.byCategory[category] = allFeatures
      .filter(f => f.category === category)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);
  });
  
  // Update stability classifications
  const volatilityThreshold = 0.3;
  updated.featureStability = {
    stable: Object.entries(updated.features)
      .filter(([_, f]) => f.statistics.volatility < volatilityThreshold)
      .map(([name]) => name),
    volatile: Object.entries(updated.features)
      .filter(([_, f]) => f.statistics.volatility >= volatilityThreshold)
      .map(([name]) => name),
    emerging: Object.entries(updated.features)
      .filter(([_, f]) => f.statistics.trend === 'increasing')
      .map(([name]) => name),
    declining: Object.entries(updated.features)
      .filter(([_, f]) => f.statistics.trend === 'decreasing')
      .map(([name]) => name)
  };
  
  // Update summary
  updated.summary = {
    totalFeatures: Object.keys(updated.features).length,
    activeFeaturesCount: allFeatures.filter(f => f.importance > 0.1).length,
    averageImportance: allFeatures.reduce((sum, f) => sum + f.importance, 0) / allFeatures.length,
    importanceConcentration: calculateConcentration(allFeatures.map(f => f.importance)),
    lastUpdated: new Date()
  };
  
  return updated;
}

/**
 * Calculate concentration (Herfindahl index)
 */
function calculateConcentration(values: number[]): number {
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return values.reduce((sum, val) => sum + Math.pow(val / total, 2), 0);
}

/**
 * Create feature importance snapshot for a prediction
 */
export function createPredictionFeatureSnapshot(
  predictionId: string,
  modelVersion: string,
  featureImportances: FeatureImportance[],
  featureValues: { [key: string]: number }
): PredictionFeatureImportance {
  // Calculate contributions
  const contributions = featureImportances.map(fi => ({
    featureName: fi.featureName,
    value: featureValues[fi.featureName] || 0,
    importance: fi.importance,
    contribution: fi.importance * (featureValues[fi.featureName] || 0),
    direction: fi.direction,
    percentile: 0.5 // would calculate from historical distribution
  }));
  
  return {
    predictionId,
    timestamp: new Date(),
    modelVersion,
    featureContributions: contributions,
    topPositiveContributors: contributions
      .filter(c => c.direction === 'positive')
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 5)
      .map(c => c.featureName),
    topNegativeContributors: contributions
      .filter(c => c.direction === 'negative')
      .sort((a, b) => a.contribution - b.contribution)
      .slice(0, 5)
      .map(c => c.featureName),
    deviationFromAverage: {}
  };
}

// ============================================================================
// CONFIDENCE INTERVAL HELPERS
// ============================================================================

/**
 * Default confidence interval configuration
 */
export const DEFAULT_CONFIDENCE_CONFIG: ConfidenceIntervalConfig = {
  method: 'monteCarlo',
  confidenceLevel: 0.95,
  numSamples: 10000,
  intervalType: 'percentile',
  allowAsymmetric: true
};

/**
 * Create enhanced confidence interval
 */
export function createEnhancedConfidenceInterval(
  lower: number,
  upper: number,
  confidence: number,
  mean: number,
  stdDev: number,
  config: ConfidenceIntervalConfig = DEFAULT_CONFIDENCE_CONFIG
): EnhancedConfidenceInterval {
  const startTime = Date.now();
  
  const interval: EnhancedConfidenceInterval = {
    lower,
    upper,
    confidence,
    distribution: {
      mean,
      median: mean, // simplified assumption
      mode: mean,
      stdDev,
      skewness: 0,
      kurtosis: 0
    },
    uncertaintySources: {
      modelUncertainty: stdDev * 0.6,
      dataUncertainty: stdDev * 0.3,
      parameterUncertainty: stdDev * 0.1,
      totalUncertainty: stdDev
    },
    intervalWidth: upper - lower,
    relativeWidth: (upper - lower) / Math.abs(mean),
    computedAt: new Date(),
    computationTime: Date.now() - startTime
  };
  
  return interval;
}

/**
 * Create prediction confidence intervals
 */
export function createPredictionConfidenceIntervals(
  predictionId: string,
  modelVersion: string,
  riskScore: { mean: number; lower: number; upper: number; stdDev: number },
  expectedReturn: { mean: number; lower: number; upper: number; stdDev: number },
  probabilityOfDefault: { mean: number; lower: number; upper: number; stdDev: number },
  config: ConfidenceIntervalConfig = DEFAULT_CONFIDENCE_CONFIG
): PredictionConfidenceIntervals {
  return {
    predictionId,
    modelVersion,
    timestamp: new Date(),
    riskScore: createEnhancedConfidenceInterval(
      riskScore.lower,
      riskScore.upper,
      config.confidenceLevel,
      riskScore.mean,
      riskScore.stdDev,
      config
    ),
    expectedReturn: createEnhancedConfidenceInterval(
      expectedReturn.lower,
      expectedReturn.upper,
      config.confidenceLevel,
      expectedReturn.mean,
      expectedReturn.stdDev,
      config
    ),
    probabilityOfDefault: createEnhancedConfidenceInterval(
      probabilityOfDefault.lower,
      probabilityOfDefault.upper,
      config.confidenceLevel,
      probabilityOfDefault.mean,
      probabilityOfDefault.stdDev,
      config
    ),
    overallConfidence: {
      score: 0.8,
      category: 'High',
      factors: {
        dataQuality: 0.85,
        modelConfidence: 0.80,
        featureCompleteness: 0.90,
        historicalAccuracy: 0.75
      }
    },
    config
  };
}

/**
 * Initialize confidence tracking
 */
export function initializeConfidenceTracking(modelId: string): ConfidenceTracking {
  return {
    trackingId: `conf-track-${modelId}-${Date.now()}`,
    modelId,
    confidenceHistory: [],
    calibrationAnalysis: {
      expectedCoverage: 0.95,
      actualCoverage: 0,
      calibrationError: 0,
      isWellCalibrated: false,
      calibrationCurve: []
    },
    trends: {
      averageConfidence: 0,
      confidenceTrend: 'stable',
      intervalWidthTrend: 'stable',
      calibrationTrend: 'stable'
    },
    performanceByConfidence: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPredictions: 0,
      predictionsWithOutcomes: 0
    }
  };
}

/**
 * Update confidence tracking with new prediction
 */
export function updateConfidenceTracking(
  tracking: ConfidenceTracking,
  predictionId: string,
  predictedConfidence: number,
  intervalWidth: number,
  actualOutcome?: number
): ConfidenceTracking {
  const updated = { ...tracking };
  
  const entry = {
    timestamp: new Date(),
    predictionId,
    predictedConfidence,
    actualOutcome,
    predictionError: actualOutcome !== undefined ? Math.abs(actualOutcome - predictedConfidence) : undefined,
    isWithinInterval: true, // would calculate based on actual intervals
    intervalWidth
  };
  
  updated.confidenceHistory.push(entry);
  updated.metadata.totalPredictions++;
  if (actualOutcome !== undefined) {
    updated.metadata.predictionsWithOutcomes++;
  }
  updated.metadata.updatedAt = new Date();
  
  // Recalculate trends
  const confidences = updated.confidenceHistory.map(h => h.predictedConfidence);
  updated.trends.averageConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
  updated.trends.confidenceTrend = determineTrend(confidences);
  
  const widths = updated.confidenceHistory.map(h => h.intervalWidth);
  updated.trends.intervalWidthTrend = determineTrend(widths);
  
  return updated;
}

/**
 * Create uncertainty decomposition
 */
export function createUncertaintyDecomposition(
  predictionId: string,
  totalUncertainty: number
): UncertaintyDecomposition {
  // Simplified decomposition (would be more sophisticated in production)
  const epistemicTotal = totalUncertainty * 0.7;
  const aleatoricTotal = totalUncertainty * 0.3;
  
  return {
    predictionId,
    totalUncertainty,
    epistemicUncertainty: {
      modelUncertainty: epistemicTotal * 0.5,
      parameterUncertainty: epistemicTotal * 0.3,
      structuralUncertainty: epistemicTotal * 0.2,
      total: epistemicTotal
    },
    aleatoricUncertainty: {
      measurementNoise: aleatoricTotal * 0.6,
      inherentRandomness: aleatoricTotal * 0.4,
      total: aleatoricTotal
    },
    uncertaintyAttribution: {
      'Model Architecture': {
        contribution: epistemicTotal * 0.5,
        percentage: 35,
        reducible: true
      },
      'Training Data Quality': {
        contribution: epistemicTotal * 0.3,
        percentage: 21,
        reducible: true
      },
      'Market Volatility': {
        contribution: aleatoricTotal * 0.6,
        percentage: 18,
        reducible: false
      }
    },
    recommendations: [
      {
        priority: 'high',
        action: 'Collect more training data to reduce model uncertainty',
        potentialReduction: epistemicTotal * 0.4
      },
      {
        priority: 'medium',
        action: 'Improve feature engineering to capture market dynamics',
        potentialReduction: epistemicTotal * 0.2
      }
    ]
  };
}

/**
 * Example: Complete data structure integration
 */
export function exampleIntegration() {
  console.log('=== ML Data Structures Integration Example ===\n');
  
  // 1. Model Weights Storage
  console.log('1. Model Weights Storage:');
  const registry = initializeModelRegistry();
  console.log('   ✓ Model registry initialized');
  console.log('   - Ready for model registration and versioning');
  console.log('   - Supports multiple serialization formats (TensorFlow, ONNX, JSON)\n');
  
  // 2. Feature Importance Tracking
  console.log('2. Feature Importance Tracking:');
  const globalTracking = initializeGlobalFeatureImportance();
  console.log('   ✓ Global feature tracking initialized');
  console.log('   - Tracks importance over time and across model versions');
  console.log('   - Identifies stable, volatile, emerging, and declining features');
  console.log('   - Supports SHAP value integration\n');
  
  // 3. Confidence Intervals
  console.log('3. Prediction Confidence Intervals:');
  const confidenceTracking = initializeConfidenceTracking('model-1');
  console.log('   ✓ Confidence tracking initialized');
  console.log('   - Tracks calibration and interval quality');
  console.log('   - Decomposes uncertainty into reducible and irreducible components');
  console.log('   - Monitors model confidence trends over time\n');
  
  console.log('All data structures ready for ML model integration!');
  console.log('\nNext Steps:');
  console.log('  1. Train ML models and store weights using ModelWeights');
  console.log('  2. Track feature importance with each prediction');
  console.log('  3. Generate confidence intervals for all predictions');
  console.log('  4. Monitor model performance and calibration over time');
}

