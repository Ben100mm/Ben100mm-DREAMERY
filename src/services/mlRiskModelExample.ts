/**
 * ML Risk Model Usage Example
 * 
 * This file demonstrates how to use the ML Risk Model framework
 * for risk assessment of real estate deals.
 */

import { mlRiskModel, createMLRiskModel } from './mlRiskModel';
import { MLRiskModelInputs, DealMetrics } from '../types/mlRiskTypes';

/**
 * Example: Analyze a single-family home investment
 */
export function exampleSingleFamilyAnalysis() {
  // Prepare deal metrics
  const dealMetrics: DealMetrics = {
    // Financing
    dscr: 1.35,
    ltv: 0.75,
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    
    // Returns
    cocReturn: 9.5,
    capRate: 7.2,
    irr: 12.5,
    moic: 2.1,
    
    // Property
    propertyAge: 15,
    propertyType: 'SFH',
    squareFeet: 2000,
    bedrooms: 3,
    bathrooms: 2,
    
    // Location
    zipCode: '94102',
    city: 'San Francisco',
    state: 'CA',
    
    // Market
    purchasePrice: 400000,
    afterRepairValue: 500000,
    monthlyRent: 3500,
    occupancyRate: 0.95,
    marketAppreciation: 4.5,
    
    // Operations
    monthlyIncome: 3500,
    monthlyExpenses: 2100,
    vacancyRate: 0.05,
    maintenanceReserve: 350,
    managementFeeRate: 0.10,
    
    // Rehab
    rehabCost: 50000,
    rehabDuration: 3,
    
    // Market conditions
    daysOnMarket: 45,
    unemploymentRate: 4.2,
    schoolRating: 8,
    walkScore: 85
  };
  
  // Create inputs
  const inputs: MLRiskModelInputs = {
    dealMetrics
  };
  
  // Get risk prediction
  const prediction = mlRiskModel.predict(inputs);
  
  // Log results
  console.log('ML Risk Assessment Results:');
  console.log('----------------------------');
  console.log(`Overall Risk Score: ${prediction.overallRiskScore.toFixed(2)}/100`);
  console.log(`Risk Category: ${prediction.riskCategory}`);
  console.log(`Probability of Default: ${(prediction.probabilityOfDefault * 100).toFixed(2)}%`);
  console.log(`Expected Return: ${prediction.expectedReturn.toFixed(2)}%`);
  console.log(`Return Volatility: ${prediction.returnVolatility.toFixed(2)}%`);
  console.log(`Prediction Confidence: ${(prediction.predictionConfidence * 100).toFixed(1)}%`);
  console.log(`Data Quality: ${(prediction.dataQuality * 100).toFixed(1)}%`);
  
  console.log('\nRisk Breakdown:');
  console.log(`  Financial Risk: ${prediction.riskBreakdown.financialRisk.toFixed(1)}/100`);
  console.log(`  Market Risk: ${prediction.riskBreakdown.marketRisk.toFixed(1)}/100`);
  console.log(`  Property Risk: ${prediction.riskBreakdown.propertyRisk.toFixed(1)}/100`);
  console.log(`  Location Risk: ${prediction.riskBreakdown.locationRisk.toFixed(1)}/100`);
  console.log(`  Liquidity Risk: ${prediction.riskBreakdown.liquidityRisk.toFixed(1)}/100`);
  console.log(`  Operational Risk: ${prediction.riskBreakdown.operationalRisk.toFixed(1)}/100`);
  
  console.log('\nTop Risk Drivers:');
  prediction.topRiskDrivers.forEach((driver, i) => {
    console.log(`  ${i + 1}. ${driver.featureName} (${driver.category}): ${(driver.importance * 100).toFixed(1)}%`);
  });
  
  console.log('\nTop Opportunities:');
  prediction.topOpportunityDrivers.forEach((driver, i) => {
    console.log(`  ${i + 1}. ${driver.featureName} (${driver.category}): ${(driver.importance * 100).toFixed(1)}%`);
  });
  
  if (prediction.recommendations.length > 0) {
    console.log('\nRecommendations:');
    prediction.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }
  
  if (prediction.warnings.length > 0) {
    console.log('\nWarnings:');
    prediction.warnings.forEach((warn, i) => {
      console.log(`  ${i + 1}. ${warn}`);
    });
  }
  
  // Calculate risk-adjusted metrics
  const riskAdjustedMetrics = mlRiskModel.calculateRiskAdjustedMetrics(
    prediction.expectedReturn,
    prediction.returnVolatility,
    4.0 // risk-free rate
  );
  
  console.log('\nRisk-Adjusted Metrics:');
  console.log(`  Sharpe Ratio: ${riskAdjustedMetrics.sharpeRatio.toFixed(2)}`);
  console.log(`  Sortino Ratio: ${riskAdjustedMetrics.sortinoRatio.toFixed(2)}`);
  console.log(`  Risk-Adjusted Return: ${riskAdjustedMetrics.riskAdjustedReturn.toFixed(2)}%`);
  console.log(`  Value at Risk (95%): ${riskAdjustedMetrics.valueAtRisk95.toFixed(2)}%`);
  console.log(`  Conditional VaR (95%): ${riskAdjustedMetrics.conditionalVaR95.toFixed(2)}%`);
  
  return prediction;
}

/**
 * Example: Create custom model with different risk thresholds
 */
export function exampleCustomConfiguration() {
  const customModel = createMLRiskModel({
    riskThresholds: {
      veryLow: 15,
      low: 35,
      moderate: 55,
      high: 75,
      veryHigh: 100
    },
    confidenceLevel: 0.99, // 99% confidence intervals
    minDataQuality: 0.7 // stricter data quality requirement
  });
  
  // Use custom model...
  console.log('Custom ML Risk Model created with stricter thresholds');
  
  return customModel;
}

/**
 * Example: Integration with existing deal analysis
 */
export function integrateWithDealAnalysis(dealData: any) {
  // Transform existing deal data to ML model format
  const dealMetrics: DealMetrics = {
    dscr: dealData.dscr || 0,
    ltv: dealData.ltv || 0,
    loanAmount: dealData.loanAmount || 0,
    interestRate: dealData.interestRate || 0,
    loanTerm: dealData.loanTerm || 30,
    
    cocReturn: dealData.cashOnCashReturn || 0,
    capRate: dealData.capRate || 0,
    irr: dealData.irr,
    moic: dealData.moic,
    
    propertyAge: dealData.propertyAge || 20,
    propertyType: dealData.propertyType || 'SFH',
    squareFeet: dealData.squareFeet || 0,
    bedrooms: dealData.bedrooms || 0,
    bathrooms: dealData.bathrooms || 0,
    
    zipCode: dealData.zipCode || '',
    city: dealData.city || '',
    state: dealData.state || '',
    
    purchasePrice: dealData.purchasePrice || 0,
    afterRepairValue: dealData.arv || dealData.afterRepairValue || 0,
    monthlyRent: dealData.monthlyRent || 0,
    occupancyRate: dealData.occupancyRate || 0.95,
    marketAppreciation: dealData.appreciationRate || 3,
    
    monthlyIncome: dealData.monthlyIncome || 0,
    monthlyExpenses: dealData.monthlyExpenses || 0,
    vacancyRate: dealData.vacancyRate || 0.08,
    maintenanceReserve: dealData.maintenanceReserve || 0,
    managementFeeRate: dealData.managementFeeRate || 0.10,
    
    rehabCost: dealData.rehabCost || 0,
    rehabDuration: dealData.rehabDuration
  };
  
  const inputs: MLRiskModelInputs = { dealMetrics };
  const prediction = mlRiskModel.predict(inputs);
  
  // Return enriched deal data with risk assessment
  return {
    ...dealData,
    riskAssessment: {
      score: prediction.overallRiskScore,
      category: prediction.riskCategory,
      probabilityOfDefault: prediction.probabilityOfDefault,
      expectedReturn: prediction.expectedReturn,
      breakdown: prediction.riskBreakdown,
      confidence: prediction.predictionConfidence
    }
  };
}

/**
 * Example: Batch analysis of multiple deals
 */
export function exampleBatchAnalysis(deals: DealMetrics[]) {
  const results = deals.map(dealMetrics => {
    const inputs: MLRiskModelInputs = { dealMetrics };
    return mlRiskModel.predict(inputs);
  });
  
  // Sort by risk score
  results.sort((a, b) => a.overallRiskScore - b.overallRiskScore);
  
  console.log(`Analyzed ${deals.length} deals:`);
  console.log(`Lowest risk: ${results[0].overallRiskScore.toFixed(2)} (${results[0].riskCategory})`);
  console.log(`Highest risk: ${results[results.length - 1].overallRiskScore.toFixed(2)} (${results[results.length - 1].riskCategory})`);
  console.log(`Average risk: ${(results.reduce((sum, r) => sum + r.overallRiskScore, 0) / results.length).toFixed(2)}`);
  
  return results;
}

/**
 * Example: Add historical performance data for future ML training
 */
export function exampleAddTrainingData() {
  mlRiskModel.addTrainingData({
    inputs: {
      dealMetrics: {
        dscr: 1.4,
        ltv: 0.70,
        cocReturn: 11,
        capRate: 8,
        propertyAge: 10,
        propertyType: 'SFH',
        // ... other metrics
      } as DealMetrics
    },
    outcome: {
      actualRisk: 35, // actual risk score after holding period
      actualReturn: 13.5, // actual return achieved
      defaulted: false
    },
    weight: 1.0
  });
  
  console.log('Training data point added for future model training');
}

/**
 * Example: Train ML Risk Model (Framework Placeholder)
 * 
 * Demonstrates the trainMLRiskModel() function that will train on
 * thousands of historical deals once institutional data APIs are integrated.
 * 
 * REQUIRES: API integration with institutional data providers
 * REQUIRES: Train model on thousands of historical deals
 */
export async function exampleTrainMLRiskModel() {
  console.log('=== ML Model Training Example ===\n');
  
  // Configure training parameters
  const trainingConfig = {
    dataSource: 'https://api.institutional-provider.com/deals',
    minSampleSize: 5000, // Minimum 5,000 deals
    lookbackYears: 10, // 10 years of historical data
    validationSplit: 0.15, // 15% for validation
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001
  };
  
  console.log('Training Configuration:');
  console.log(`  Data Source: ${trainingConfig.dataSource}`);
  console.log(`  Minimum Sample Size: ${trainingConfig.minSampleSize} deals`);
  console.log(`  Lookback Period: ${trainingConfig.lookbackYears} years`);
  console.log(`  Validation Split: ${trainingConfig.validationSplit * 100}%`);
  console.log(`  Training Epochs: ${trainingConfig.epochs}`);
  console.log(`  Batch Size: ${trainingConfig.batchSize}`);
  console.log(`  Learning Rate: ${trainingConfig.learningRate}\n`);
  
  try {
    // Attempt to train model
    const results = await mlRiskModel.trainMLRiskModel(trainingConfig);
    
    if (results.success) {
      console.log('✅ Model Training Successful!\n');
      console.log('Model Evaluation Metrics:');
      console.log(`  Accuracy: ${(results.metrics.accuracy * 100).toFixed(2)}%`);
      console.log(`  Precision: ${(results.metrics.precision * 100).toFixed(2)}%`);
      console.log(`  Recall: ${(results.metrics.recall * 100).toFixed(2)}%`);
      console.log(`  F1 Score: ${results.metrics.f1Score.toFixed(3)}`);
      console.log(`  AUC-ROC: ${results.metrics.auc.toFixed(3)}`);
      console.log(`  MAE: ${results.metrics.mae.toFixed(3)}`);
      console.log(`  RMSE: ${results.metrics.rmse.toFixed(3)}`);
      console.log(`  R²: ${results.metrics.r2.toFixed(3)}\n`);
      
      if (results.trainingHistory) {
        console.log('Training History (last 5 epochs):');
        results.trainingHistory.slice(-5).forEach(epoch => {
          console.log(`  Epoch ${epoch.epoch}: Loss=${epoch.loss.toFixed(4)}, Val Loss=${epoch.valLoss.toFixed(4)}`);
        });
      }
    } else {
      console.log('⚠️  Model Training Not Yet Available');
      console.log(`Message: ${results.message}\n`);
      console.log('Implementation Requirements:');
      console.log('  1. Integrate with institutional data providers:');
      console.log('     - CoreLogic: Property & transaction data');
      console.log('     - RealtyTrac: Default & foreclosure data');
      console.log('     - Freddie Mac: Loan performance data');
      console.log('     - Fannie Mae: Single-family loan database');
      console.log('  2. Collect 5,000-10,000+ historical deals with outcomes');
      console.log('  3. Integrate TensorFlow.js or ONNX runtime');
      console.log('  4. Build data preprocessing pipeline');
    }
  } catch (error) {
    console.error('Error during model training:', error);
  }
  
  return;
}

/**
 * Example: Predict Default Probability with ML Model (Framework Placeholder)
 * 
 * Demonstrates ML-based default probability prediction that will use
 * trained models once implemented.
 * 
 * REQUIRES: API integration with institutional data providers
 * REQUIRES: Train model on thousands of historical deals
 */
export async function examplePredictDefaultProbability() {
  console.log('=== ML Default Probability Prediction Example ===\n');
  
  // Prepare deal metrics for a sample property
  const inputs: MLRiskModelInputs = {
    dealMetrics: {
      dscr: 1.2,
      ltv: 0.80,
      loanAmount: 320000,
      interestRate: 7.0,
      loanTerm: 30,
      cocReturn: 7.5,
      capRate: 6.8,
      propertyAge: 25,
      propertyType: 'SFH',
      squareFeet: 1800,
      bedrooms: 3,
      bathrooms: 2,
      zipCode: '90210',
      city: 'Beverly Hills',
      state: 'CA',
      purchasePrice: 400000,
      afterRepairValue: 450000,
      monthlyRent: 3200,
      occupancyRate: 0.92,
      marketAppreciation: 3.5,
      monthlyIncome: 3200,
      monthlyExpenses: 2400,
      vacancyRate: 0.08,
      maintenanceReserve: 320,
      managementFeeRate: 0.10,
      rehabCost: 30000,
      unemploymentRate: 5.5
    }
  };
  
  try {
    // Predict default probability with feature importance
    const prediction = await mlRiskModel.predictDefaultProbability(inputs, {
      includeFeatureImportance: true,
      confidenceInterval: 0.95
    });
    
    console.log('Default Probability Analysis:');
    console.log(`  Probability of Default: ${(prediction.probability * 100).toFixed(2)}%`);
    console.log(`  Risk Category: ${prediction.riskCategory}`);
    console.log(`  95% Confidence Interval: [${(prediction.lowerBound * 100).toFixed(2)}%, ${(prediction.upperBound * 100).toFixed(2)}%]`);
    console.log(`  Model Version: ${prediction.modelVersion}`);
    console.log(`  Timestamp: ${prediction.timestamp.toISOString()}\n`);
    
    if (prediction.featureImportance && prediction.featureImportance.length > 0) {
      console.log('Top Risk Drivers:');
      prediction.featureImportance.forEach((driver, i) => {
        console.log(`  ${i + 1}. ${driver.featureName} (${driver.category})`);
        console.log(`     Importance: ${(driver.importance * 100).toFixed(1)}% | Impact: ${driver.direction}`);
      });
    }
    
    console.log('\n💡 Note: Currently using rule-based fallback.');
    console.log('   ML-based prediction requires trained model on historical default data.');
    
  } catch (error) {
    console.error('Error predicting default probability:', error);
  }
  
  return;
}

/**
 * Example: Predict Expected Return Distribution with ML (Framework Placeholder)
 * 
 * Demonstrates ML-based return distribution prediction that provides
 * full probability distribution, not just point estimates.
 * 
 * REQUIRES: API integration with institutional data providers
 * REQUIRES: Train model on thousands of historical deals
 */
export async function examplePredictReturnDistribution() {
  console.log('=== ML Return Distribution Prediction Example ===\n');
  
  // Prepare deal metrics
  const inputs: MLRiskModelInputs = {
    dealMetrics: {
      dscr: 1.45,
      ltv: 0.70,
      loanAmount: 280000,
      interestRate: 6.5,
      loanTerm: 30,
      cocReturn: 11.2,
      capRate: 7.5,
      irr: 14.8,
      moic: 2.3,
      propertyAge: 12,
      propertyType: 'Multi-Family',
      squareFeet: 4500,
      bedrooms: 8,
      bathrooms: 4,
      zipCode: '78701',
      city: 'Austin',
      state: 'TX',
      purchasePrice: 400000,
      afterRepairValue: 500000,
      monthlyRent: 5600,
      occupancyRate: 0.96,
      marketAppreciation: 5.2,
      monthlyIncome: 5600,
      monthlyExpenses: 2800,
      vacancyRate: 0.04,
      maintenanceReserve: 560,
      managementFeeRate: 0.08,
      rehabCost: 40000,
      unemploymentRate: 3.8,
      schoolRating: 7,
      walkScore: 78
    }
  };
  
  try {
    // Predict full return distribution
    const distribution = await mlRiskModel.predictExpectedReturnDistribution(inputs, {
      numSamples: 10000,
      includeScenarios: true
    });
    
    console.log('Return Distribution Analysis:');
    console.log(`  Expected Return (Mean): ${distribution.mean.toFixed(2)}%`);
    console.log(`  Median Return: ${distribution.median.toFixed(2)}%`);
    console.log(`  Standard Deviation: ${distribution.stdDev.toFixed(2)}%`);
    console.log(`  Skewness: ${distribution.skewness.toFixed(3)}`);
    console.log(`  Kurtosis: ${distribution.kurtosis.toFixed(3)}\n`);
    
    console.log('Return Percentiles:');
    console.log(`  5th Percentile:  ${distribution.percentiles.p05.toFixed(2)}%`);
    console.log(`  25th Percentile: ${distribution.percentiles.p25.toFixed(2)}%`);
    console.log(`  50th Percentile: ${distribution.percentiles.p50.toFixed(2)}% (median)`);
    console.log(`  75th Percentile: ${distribution.percentiles.p75.toFixed(2)}%`);
    console.log(`  95th Percentile: ${distribution.percentiles.p95.toFixed(2)}%\n`);
    
    console.log('Risk Metrics:');
    console.log(`  Probability of Loss: ${(distribution.probabilityOfLoss * 100).toFixed(2)}%`);
    console.log(`  Probability of Outperformance: ${(distribution.probabilityOfOutperformance * 100).toFixed(2)}%`);
    console.log(`  Value at Risk (95%): ${distribution.valueAtRisk95.toFixed(2)}%`);
    console.log(`  Conditional VaR (95%): ${distribution.conditionalVaR95.toFixed(2)}%\n`);
    
    if (distribution.scenarios) {
      console.log('Scenario Analysis:');
      console.log(`  Bear Case:  ${distribution.scenarios.bearCase.return.toFixed(2)}% (probability: ${(distribution.scenarios.bearCase.probability * 100).toFixed(0)}%)`);
      console.log(`  Base Case:  ${distribution.scenarios.baseCase.return.toFixed(2)}% (probability: ${(distribution.scenarios.baseCase.probability * 100).toFixed(0)}%)`);
      console.log(`  Bull Case:  ${distribution.scenarios.bullCase.return.toFixed(2)}% (probability: ${(distribution.scenarios.bullCase.probability * 100).toFixed(0)}%)`);
    }
    
    console.log(`\nModel Version: ${distribution.modelVersion}`);
    console.log(`Confidence: ${(distribution.confidence * 100).toFixed(1)}%`);
    console.log(`Timestamp: ${distribution.timestamp.toISOString()}`);
    
    console.log('\n💡 Note: Currently using normal distribution fallback.');
    console.log('   ML-based prediction requires:');
    console.log('   - Trained Mixture Density Network or Quantile Regression model');
    console.log('   - Historical deal returns from institutional databases');
    console.log('   - 5,000-10,000+ deals across multiple market cycles');
    
  } catch (error) {
    console.error('Error predicting return distribution:', error);
  }
  
  return;
}

/**
 * Example: Complete ML Risk Assessment Workflow
 * 
 * Demonstrates a complete workflow using all ML risk model functions.
 * Shows how the framework will work once fully implemented.
 */
export async function exampleCompleteMLWorkflow() {
  console.log('===========================================');
  console.log('  COMPLETE ML RISK ASSESSMENT WORKFLOW');
  console.log('===========================================\n');
  
  // Step 1: Traditional risk assessment
  console.log('STEP 1: Running traditional risk assessment...\n');
  const prediction = exampleSingleFamilyAnalysis();
  
  console.log('\n-------------------------------------------\n');
  
  // Step 2: ML-based default probability
  console.log('STEP 2: Running ML default probability prediction...\n');
  await examplePredictDefaultProbability();
  
  console.log('\n-------------------------------------------\n');
  
  // Step 3: ML-based return distribution
  console.log('STEP 3: Running ML return distribution prediction...\n');
  await examplePredictReturnDistribution();
  
  console.log('\n-------------------------------------------\n');
  
  console.log('WORKFLOW COMPLETE\n');
  console.log('Summary:');
  console.log('  ✓ Traditional risk scoring: ACTIVE (rule-based)');
  console.log('  ⏳ ML default prediction: FRAMEWORK READY (awaiting training data)');
  console.log('  ⏳ ML return distribution: FRAMEWORK READY (awaiting training data)');
  console.log('  ⏳ Model training: FRAMEWORK READY (awaiting API integration)\n');
  
  console.log('To activate full ML capabilities:');
  console.log('  1. Integrate APIs with institutional data providers');
  console.log('  2. Collect 5,000-10,000+ historical deals with outcomes');
  console.log('  3. Implement TensorFlow.js or ONNX model runtime');
  console.log('  4. Train and validate ML models');
  console.log('  5. Deploy trained models for inference');
  
  return;
}

