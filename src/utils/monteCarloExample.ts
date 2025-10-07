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
  generateRandomScenario,
  generateRandomScenarios,
  formatPercentage,
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
 * Example 2: Custom Uncertainty Parameters with Correlation
 * More aggressive assumptions for a high-growth market
 * Demonstrates correlated income and expense growth (0.6 correlation)
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
  // Using normal distributions to enable correlation modeling
  const uncertaintyParameters: UncertaintyParameters = {
    rentGrowthDistribution: {
      type: 'normal',
      mean: 0.05, // 5% average rent growth
      stdDev: 0.015, // 1.5% standard deviation
    },
    initialRentDistribution: {
      type: 'normal',
      mean: baseState.initialMonthlyRent,
      stdDev: baseState.initialMonthlyRent * 0.08, // 8% variation
    },
    expenseGrowthDistribution: {
      type: 'normal',
      mean: 0.04, // 4% average expense growth
      stdDev: 0.012, // 1.2% standard deviation
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
    incomeExpenseCorrelation: 0.6, // 60% correlation between income and expense growth
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
 * Example 4: Correlation Impact Analysis
 * Compares results with and without correlation to show the impact
 */
export async function exampleCorrelationImpact(): Promise<void> {
  console.log('\n=== CORRELATION IMPACT ANALYSIS ===\n');
  
  const baseState: BaseState = {
    purchasePrice: 500000,
    initialMonthlyRent: 3000,
    annualTaxes: 6000,
    annualInsurance: 1800,
    annualMaintenance: 2500,
    annualManagement: 3600,
    annualCapEx: 3000,
    loanAmount: 400000,
    annualInterestRate: 0.065,
    loanTermMonths: 360,
    initialInvestment: 100000,
    projectionYears: 10,
  };

  // Run with correlation (0.6)
  const withCorrelation = await runMonteCarloSimulation({
    baseState,
    uncertaintyParameters: createDefaultUncertaintyParameters(baseState, true),
    simulations: 10000,
    yearsToProject: 10,
    randomSeed: 42,
  });

  // Run without correlation (independent)
  const withoutCorrelation = await runMonteCarloSimulation({
    baseState,
    uncertaintyParameters: createDefaultUncertaintyParameters(baseState, false),
    simulations: 10000,
    yearsToProject: 10,
    randomSeed: 42,
  });

  console.log('WITH CORRELATION (0.6):');
  console.log(`  Expected Return: ${withCorrelation.distributions.annualizedReturn.mean.toFixed(2)}%`);
  console.log(`  Standard Deviation: ${withCorrelation.distributions.annualizedReturn.stdDev.toFixed(2)}%`);
  console.log(`  Probability of Loss: ${withCorrelation.riskMetrics.probabilityOfLoss.toFixed(2)}%`);
  console.log(`  Sharpe Ratio: ${withCorrelation.riskMetrics.sharpeRatio.toFixed(2)}`);
  console.log(`  P10-P90 Range: ${withCorrelation.distributions.annualizedReturn.p10.toFixed(2)}% to ${withCorrelation.distributions.annualizedReturn.p90.toFixed(2)}%`);
  
  console.log('\nWITHOUT CORRELATION (Independent):');
  console.log(`  Expected Return: ${withoutCorrelation.distributions.annualizedReturn.mean.toFixed(2)}%`);
  console.log(`  Standard Deviation: ${withoutCorrelation.distributions.annualizedReturn.stdDev.toFixed(2)}%`);
  console.log(`  Probability of Loss: ${withoutCorrelation.riskMetrics.probabilityOfLoss.toFixed(2)}%`);
  console.log(`  Sharpe Ratio: ${withoutCorrelation.riskMetrics.sharpeRatio.toFixed(2)}`);
  console.log(`  P10-P90 Range: ${withoutCorrelation.distributions.annualizedReturn.p10.toFixed(2)}% to ${withoutCorrelation.distributions.annualizedReturn.p90.toFixed(2)}%`);
  
  console.log('\nIMPACT OF CORRELATION:');
  const stdDevDiff = ((withCorrelation.distributions.annualizedReturn.stdDev - withoutCorrelation.distributions.annualizedReturn.stdDev) / withoutCorrelation.distributions.annualizedReturn.stdDev) * 100;
  console.log(`  Volatility Change: ${stdDevDiff > 0 ? '+' : ''}${stdDevDiff.toFixed(1)}%`);
  console.log(`  Risk Adjustment: ${stdDevDiff > 0 ? 'Higher' : 'Lower'} risk when correlation is modeled`);
  console.log(`  \nKey Insight: Correlated variables ${stdDevDiff > 0 ? 'increase' : 'decrease'} portfolio volatility`);
  console.log(`  because income and expenses tend to move together in real markets.`);
}

/**
 * Example 5: Analyzing Results
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
 * Example 6: Comparing Multiple Properties
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
 * Example 7: Random Scenario Generation
 * Demonstrates generateRandomScenario() with market-correlated factors
 */
export function exampleRandomScenarios(): void {
  console.log('\n=== RANDOM SCENARIO GENERATION ===\n');
  
  // Generate 10 random scenarios
  const scenarios = generateRandomScenarios(10);
  
  console.log('Generated 10 random scenarios with market correlation:\n');
  
  scenarios.forEach((scenario, i) => {
    console.log(`Scenario ${i + 1}: ${scenario.scenario.toUpperCase()}`);
    console.log(`  Market Factor: ${scenario.marketFactor.toFixed(2)}`);
    console.log(`  Income Growth: ${formatPercentage(scenario.incomeGrowthRate * 100)} (correlated)`);
    console.log(`  Expense Growth: ${formatPercentage(scenario.expenseGrowthRate * 100)} (0.6 correlation)`);
    console.log(`  Occupancy: ${formatPercentage(scenario.occupancyRate * 100)} (independent)`);
    console.log(`  Appreciation: ${formatPercentage(scenario.appreciationRate * 100)}`);
    console.log('');
  });
  
  // Analyze correlation
  console.log('CORRELATION VERIFICATION:');
  const incomeGrowths = scenarios.map(s => s.incomeGrowthRate);
  const expenseGrowths = scenarios.map(s => s.expenseGrowthRate);
  const marketFactors = scenarios.map(s => s.marketFactor);
  
  // Calculate correlation between market and income
  const meanIncome = incomeGrowths.reduce((a, b) => a + b) / incomeGrowths.length;
  const meanMarket = marketFactors.reduce((a, b) => a + b) / marketFactors.length;
  const meanExpense = expenseGrowths.reduce((a, b) => a + b) / expenseGrowths.length;
  
  const covMarketIncome = incomeGrowths.reduce((sum, income, i) => 
    sum + (income - meanIncome) * (marketFactors[i] - meanMarket), 0) / incomeGrowths.length;
  const varMarket = marketFactors.reduce((sum, m) => sum + Math.pow(m - meanMarket, 2), 0) / marketFactors.length;
  const varIncome = incomeGrowths.reduce((sum, i) => sum + Math.pow(i - meanIncome, 2), 0) / incomeGrowths.length;
  
  const corrMarketIncome = covMarketIncome / (Math.sqrt(varMarket) * Math.sqrt(varIncome));
  
  console.log(`  Market-Income Correlation: ${corrMarketIncome.toFixed(2)} (target: 0.70)`);
  console.log(`  Note: With only 10 samples, empirical correlation varies. Run with 1000+ for accuracy.`);
  
  // Custom parameters example
  console.log('\n=== CUSTOM SCENARIO PARAMETERS ===\n');
  
  const customScenario = generateRandomScenario({
    incomeGrowthMean: 0.05,  // Higher income growth
    expenseGrowthMean: 0.04, // Higher expense growth
    occupancyMean: 0.95,     // Higher occupancy
    marketExpenseCorrelation: 0.8,  // Stronger correlation
  });
  
  console.log('Custom Scenario (Hot Market):');
  console.log(`  Market: ${customScenario.scenario}`);
  console.log(`  Market Factor: ${customScenario.marketFactor.toFixed(2)}`);
  console.log(`  Income Growth: ${formatPercentage(customScenario.incomeGrowthRate * 100)}`);
  console.log(`  Expense Growth: ${formatPercentage(customScenario.expenseGrowthRate * 100)}`);
  console.log(`  Occupancy: ${formatPercentage(customScenario.occupancyRate * 100)}`);
  console.log(`  Appreciation: ${formatPercentage(customScenario.appreciationRate * 100)}`);
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

    // Example 4: Correlation impact
    console.log('\n--- Example 4: Correlation Impact Analysis ---');
    await exampleCorrelationImpact();

    // Example 5: Property comparison
    console.log('\n--- Example 6: Property Comparison ---');
    await compareProperties();

    // Example 6: Random scenario generation
    console.log('\n--- Example 7: Random Scenario Generation ---');
    exampleRandomScenarios();

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
  exampleCorrelationImpact,
  exampleRandomScenarios,
  analyzeResults,
  compareProperties,
  runAllExamples,
};

