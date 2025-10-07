/**
 * Monte Carlo Risk Simulation - Example Usage
 * 
 * This file demonstrates how to use the Monte Carlo simulation
 * for real estate investment risk analysis.
 */

import {
  runMonteCarloSimulation,
  createDefaultUncertaintyParameters,
  generateSummaryText,
  type MonteCarloInputs,
  type BaseState,
  type UncertaintyParameters,
  type MonteCarloResults,
} from './monteCarloRiskSimulation';

/**
 * Example 1: Basic Monte Carlo Simulation
 * Single-family rental property analysis
 */
export async function exampleBasicSimulation(): Promise<MonteCarloResults> {
  // Define base case scenario
  const baseState: BaseState = {
    purchasePrice: 400000,
    initialMonthlyRent: 2500,
    annualTaxes: 4800,
    annualInsurance: 1500,
    annualMaintenance: 2000,
    annualManagement: 3000,
    annualCapEx: 2400,
    loanAmount: 320000, // 80% LTV
    annualInterestRate: 0.065, // 6.5%
    loanTermMonths: 360, // 30 years
    initialInvestment: 80000, // Down payment + closing costs
    projectionYears: 10,
  };

  // Use default uncertainty parameters (reasonable distributions)
  const uncertaintyParameters = createDefaultUncertaintyParameters(baseState);

  // Configure simulation
  const inputs: MonteCarloInputs = {
    baseState,
    uncertaintyParameters,
    simulations: 10000,
    yearsToProject: 10,
    randomSeed: 12345, // For reproducibility
    onProgress: (progress) => {
      console.log(`Progress: ${progress.percentage.toFixed(1)}%`);
    },
  };

  // Run simulation
  console.log('Running Monte Carlo simulation...');
  const results = await runMonteCarloSimulation(inputs);

  // Display summary
  console.log(generateSummaryText(results));

  return results;
}

/**
 * Example 2: Custom Uncertainty Parameters
 * More aggressive assumptions for a high-growth market
 */
export async function exampleCustomUncertainty(): Promise<MonteCarloResults> {
  const baseState: BaseState = {
    purchasePrice: 800000,
    initialMonthlyRent: 4500,
    annualTaxes: 9600,
    annualInsurance: 2400,
    annualMaintenance: 4000,
    annualManagement: 5400,
    annualCapEx: 4800,
    loanAmount: 600000, // 75% LTV
    annualInterestRate: 0.07,
    loanTermMonths: 360,
    initialInvestment: 200000,
    projectionYears: 15,
  };

  // Custom uncertainty parameters for high-growth market
  const uncertaintyParameters: UncertaintyParameters = {
    rentGrowthDistribution: {
      type: 'triangular',
      min: 0.03, // 3% minimum rent growth
      mode: 0.05, // 5% most likely
      max: 0.08, // 8% maximum
    },
    initialRentDistribution: {
      type: 'normal',
      mean: baseState.initialMonthlyRent,
      stdDev: baseState.initialMonthlyRent * 0.08, // 8% variation
    },
    expenseGrowthDistribution: {
      type: 'triangular',
      min: 0.02,
      mode: 0.035,
      max: 0.06,
    },
    appreciationDistribution: {
      type: 'triangular',
      min: 0.02, // 2% minimum appreciation
      mode: 0.05, // 5% most likely
      max: 0.10, // 10% maximum (hot market)
    },
    vacancyRateDistribution: {
      type: 'triangular',
      min: 0.02, // 2% minimum vacancy
      mode: 0.04, // 4% most likely
      max: 0.08, // 8% maximum
    },
    maintenanceDistribution: {
      type: 'triangular',
      min: 0.7, // 70% of expected
      mode: 1.0, // 100% expected
      max: 2.0, // 200% (major repairs)
    },
    purchasePriceDistribution: {
      type: 'normal',
      mean: baseState.purchasePrice,
      stdDev: baseState.purchasePrice * 0.03, // 3% negotiation range
    },
  };

  const inputs: MonteCarloInputs = {
    baseState,
    uncertaintyParameters,
    simulations: 20000, // More simulations for higher accuracy
    yearsToProject: 15,
    randomSeed: 54321,
  };

  console.log('Running custom Monte Carlo simulation...');
  const results = await runMonteCarloSimulation(inputs);

  return results;
}

/**
 * Example 3: Conservative Analysis
 * More conservative assumptions for risk-averse investors
 */
export async function exampleConservativeAnalysis(): Promise<MonteCarloResults> {
  const baseState: BaseState = {
    purchasePrice: 300000,
    initialMonthlyRent: 2000,
    annualTaxes: 3600,
    annualInsurance: 1200,
    annualMaintenance: 1800,
    annualManagement: 2400,
    annualCapEx: 1800,
    loanAmount: 210000, // 70% LTV (more conservative)
    annualInterestRate: 0.06,
    loanTermMonths: 360,
    initialInvestment: 90000,
    projectionYears: 10,
  };

  // Conservative uncertainty parameters
  const uncertaintyParameters: UncertaintyParameters = {
    rentGrowthDistribution: {
      type: 'triangular',
      min: 0.005, // 0.5% minimum
      mode: 0.025, // 2.5% most likely
      max: 0.045, // 4.5% maximum
    },
    initialRentDistribution: {
      type: 'normal',
      mean: baseState.initialMonthlyRent,
      stdDev: baseState.initialMonthlyRent * 0.03,
    },
    expenseGrowthDistribution: {
      type: 'triangular',
      min: 0.025,
      mode: 0.04,
      max: 0.06,
    },
    appreciationDistribution: {
      type: 'triangular',
      min: -0.01, // Allow for slight depreciation
      mode: 0.025, // 2.5% most likely
      max: 0.05, // 5% maximum
    },
    vacancyRateDistribution: {
      type: 'triangular',
      min: 0.04,
      mode: 0.07,
      max: 0.12, // Higher vacancy assumptions
    },
    maintenanceDistribution: {
      type: 'triangular',
      min: 0.9,
      mode: 1.2, // Expect 20% higher maintenance
      max: 2.5, // Very high for worst case
    },
    purchasePriceDistribution: {
      type: 'normal',
      mean: baseState.purchasePrice,
      stdDev: baseState.purchasePrice * 0.01,
    },
  };

  const inputs: MonteCarloInputs = {
    baseState,
    uncertaintyParameters,
    simulations: 15000,
    yearsToProject: 10,
  };

  console.log('Running conservative Monte Carlo simulation...');
  const results = await runMonteCarloSimulation(inputs);

  return results;
}

/**
 * Example 4: Analyzing Results
 * Demonstrates how to extract and use specific metrics
 */
export function analyzeResults(results: MonteCarloResults): void {
  const { distributions, riskMetrics, scenarioAnalysis } = results;

  console.log('\n=== DETAILED ANALYSIS ===\n');

  // Return Analysis
  console.log('RETURN ANALYSIS:');
  console.log(`Expected Annualized Return: ${distributions.annualizedReturn.mean.toFixed(2)}%`);
  console.log(`Median Return: ${distributions.annualizedReturn.p50.toFixed(2)}%`);
  console.log(`Return Range (P10-P90): ${distributions.annualizedReturn.p10.toFixed(2)}% to ${distributions.annualizedReturn.p90.toFixed(2)}%`);
  console.log(`Standard Deviation: ${distributions.annualizedReturn.stdDev.toFixed(2)}%`);

  // Risk Analysis
  console.log('\nRISK ANALYSIS:');
  console.log(`Probability of Loss: ${riskMetrics.probabilityOfLoss.toFixed(2)}%`);
  console.log(`Value at Risk (95%): ${riskMetrics.valueAtRisk95.toFixed(2)}%`);
  console.log(`Conditional VaR (95%): ${riskMetrics.conditionalVaR95.toFixed(2)}%`);
  console.log(`Sharpe Ratio: ${riskMetrics.sharpeRatio.toFixed(2)}`);
  console.log(`Sortino Ratio: ${riskMetrics.sortinoRatio.toFixed(2)}`);

  // Scenario Comparison
  console.log('\nSCENARIO COMPARISON:');
  console.log(`Worst Case Total Return: $${scenarioAnalysis.worstCase.totalReturn.toLocaleString()}`);
  console.log(`Pessimistic Case (P25): $${scenarioAnalysis.pessimisticCase.totalReturn.toLocaleString()}`);
  console.log(`Expected Case (P50): $${scenarioAnalysis.expectedCase.totalReturn.toLocaleString()}`);
  console.log(`Optimistic Case (P75): $${scenarioAnalysis.optimisticCase.totalReturn.toLocaleString()}`);
  console.log(`Best Case Total Return: $${scenarioAnalysis.bestCase.totalReturn.toLocaleString()}`);

  // Cash Flow Analysis
  console.log('\nCASH FLOW ANALYSIS:');
  console.log(`Expected Total Cash Flow: $${distributions.totalCashFlow.mean.toLocaleString()}`);
  console.log(`Cash Flow Range (P10-P90): $${distributions.totalCashFlow.p10.toLocaleString()} to $${distributions.totalCashFlow.p90.toLocaleString()}`);

  // Equity Build-Up
  console.log('\nEQUITY BUILD-UP:');
  console.log(`Expected Final Equity: $${distributions.finalEquity.mean.toLocaleString()}`);
  console.log(`Expected Principal Paydown: $${distributions.totalPrincipalPaydown.mean.toLocaleString()}`);
  console.log(`Expected Appreciation: $${distributions.totalAppreciation.mean.toLocaleString()}`);

  // Investment Decision Framework
  console.log('\nINVESTMENT DECISION FRAMEWORK:');
  
  const isGoodInvestment = 
    riskMetrics.probabilityOfLoss < 10 && // Less than 10% chance of loss
    distributions.annualizedReturn.p50 > 8 && // Median return > 8%
    riskMetrics.sharpeRatio > 1.0; // Sharpe ratio > 1
  
  console.log(`Probability of Loss: ${riskMetrics.probabilityOfLoss < 10 ? '✓ PASS' : '✗ FAIL'} (${riskMetrics.probabilityOfLoss.toFixed(1)}% < 10%)`);
  console.log(`Median Return: ${distributions.annualizedReturn.p50 > 8 ? '✓ PASS' : '✗ FAIL'} (${distributions.annualizedReturn.p50.toFixed(1)}% > 8%)`);
  console.log(`Risk-Adjusted Return: ${riskMetrics.sharpeRatio > 1.0 ? '✓ PASS' : '✗ FAIL'} (Sharpe: ${riskMetrics.sharpeRatio.toFixed(2)} > 1.0)`);
  
  console.log(`\nOverall Assessment: ${isGoodInvestment ? '✓ RECOMMENDED' : '✗ NOT RECOMMENDED'}`);
}

/**
 * Example 5: Comparing Multiple Properties
 */
export async function compareProperties(): Promise<void> {
  console.log('Comparing three different investment properties...\n');

  // Property A: Conservative single-family
  const propertyA = await exampleConservativeAnalysis();
  
  // Property B: Standard rental
  const propertyB = await exampleBasicSimulation();
  
  // Property C: High-growth market
  const propertyC = await exampleCustomUncertainty();

  console.log('\n=== PROPERTY COMPARISON ===\n');

  const properties = [
    { name: 'Property A (Conservative)', results: propertyA },
    { name: 'Property B (Standard)', results: propertyB },
    { name: 'Property C (High-Growth)', results: propertyC },
  ];

  properties.forEach(({ name, results }) => {
    console.log(`${name}:`);
    console.log(`  Expected Return: ${results.distributions.annualizedReturn.mean.toFixed(2)}%`);
    console.log(`  Risk (Std Dev): ${results.distributions.annualizedReturn.stdDev.toFixed(2)}%`);
    console.log(`  Sharpe Ratio: ${results.riskMetrics.sharpeRatio.toFixed(2)}`);
    console.log(`  Probability of Loss: ${results.riskMetrics.probabilityOfLoss.toFixed(2)}%`);
    console.log(`  Median Total Return: $${results.distributions.totalReturn.p50.toLocaleString()}`);
    console.log('');
  });

  // Determine best property based on risk-adjusted returns
  const bestProperty = properties.reduce((best, current) => {
    return current.results.riskMetrics.sharpeRatio > best.results.riskMetrics.sharpeRatio
      ? current
      : best;
  });

  console.log(`Best Risk-Adjusted Investment: ${bestProperty.name}`);
}

/**
 * Run all examples
 */
export async function runAllExamples(): Promise<void> {
  try {
    console.log('='.repeat(60));
    console.log('MONTE CARLO SIMULATION EXAMPLES');
    console.log('='.repeat(60));

    // Example 1: Basic simulation
    console.log('\n--- Example 1: Basic Simulation ---');
    const basicResults = await exampleBasicSimulation();
    analyzeResults(basicResults);

    // Example 2: Custom uncertainty
    console.log('\n--- Example 2: Custom Uncertainty Parameters ---');
    const customResults = await exampleCustomUncertainty();
    analyzeResults(customResults);

    // Example 3: Conservative analysis
    console.log('\n--- Example 3: Conservative Analysis ---');
    const conservativeResults = await exampleConservativeAnalysis();
    analyzeResults(conservativeResults);

    // Example 4: Property comparison
    console.log('\n--- Example 5: Property Comparison ---');
    await compareProperties();

    console.log('\n' + '='.repeat(60));
    console.log('ALL EXAMPLES COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Error running examples:', error);
    throw error;
  }
}

// Export all examples
export default {
  exampleBasicSimulation,
  exampleCustomUncertainty,
  exampleConservativeAnalysis,
  analyzeResults,
  compareProperties,
  runAllExamples,
};

