/**
 * Monte Carlo Risk Simulation
 * 
 * Comprehensive Monte Carlo simulation for real estate investment risk analysis.
 * Uses Web Workers for non-blocking execution of computationally intensive simulations.
 * 
 * Features:
 * - Probabilistic modeling of key investment variables
 * - Percentile distribution analysis (P10/P25/P50/P75/P90)
 * - Risk metrics (VaR, CVaR, Sharpe ratio, etc.)
 * - Scenario analysis (best/worst/expected cases)
 * - Progress tracking for long-running simulations
 */

// ==================== INTERFACES ====================

/**
 * Distribution types for uncertainty modeling
 */
export type DistributionType = 'normal' | 'triangular' | 'uniform' | 'lognormal';

/**
 * Base distribution interface
 */
export interface Distribution {
  type: DistributionType;
  mean?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  mode?: number;
}

/**
 * Normal distribution parameters
 */
export interface NormalDistribution extends Distribution {
  type: 'normal';
  mean: number;
  stdDev: number;
}

/**
 * Triangular distribution parameters
 */
export interface TriangularDistribution extends Distribution {
  type: 'triangular';
  min: number;
  mode: number;
  max: number;
}

/**
 * Uniform distribution parameters
 */
export interface UniformDistribution extends Distribution {
  type: 'uniform';
  min: number;
  max: number;
}

/**
 * Log-normal distribution parameters
 */
export interface LognormalDistribution extends Distribution {
  type: 'lognormal';
  mean: number;
  stdDev: number;
}

/**
 * Uncertainty parameters for key investment variables
 */
export interface UncertaintyParameters {
  rentGrowthDistribution: Distribution;
  initialRentDistribution: Distribution;
  expenseGrowthDistribution: Distribution;
  appreciationDistribution: Distribution;
  vacancyRateDistribution: Distribution;
  maintenanceDistribution: Distribution;
  purchasePriceDistribution: Distribution;
  capRateDistribution?: Distribution;
  exitCapRateDistribution?: Distribution;
  incomeExpenseCorrelation?: number; // Correlation between rent growth and expense growth (default: 0.6)
}

/**
 * Base state for Monte Carlo simulation
 */
export interface BaseState {
  purchasePrice: number;
  initialMonthlyRent: number;
  annualTaxes: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualManagement: number;
  annualCapEx: number;
  loanAmount: number;
  annualInterestRate: number;
  loanTermMonths: number;
  initialInvestment: number;
  projectionYears: number;
}

/**
 * Monte Carlo simulation inputs
 */
export interface MonteCarloInputs {
  baseState: BaseState;
  uncertaintyParameters: UncertaintyParameters;
  simulations: number;
  yearsToProject: number;
  randomSeed?: number;
  onProgress?: (progress: ProgressUpdate) => void;
}

/**
 * Progress update callback data
 */
export interface ProgressUpdate {
  completed: number;
  total: number;
  percentage: number;
}

/**
 * Individual simulation result
 */
export interface SimulationResult {
  totalReturn: number;
  totalCashFlow: number;
  totalAppreciation: number;
  totalPrincipalPaydown: number;
  finalEquity: number;
  finalPropertyValue: number;
  annualizedReturn: number;
  cashOnCashReturn: number;
}

/**
 * Percentile distribution data
 */
export interface PercentileDistribution {
  p10: number;
  p25: number;
  p50: number; // Median
  p75: number;
  p90: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

/**
 * Distribution results for all key metrics
 */
export interface Distributions {
  totalReturn: PercentileDistribution;
  totalCashFlow: PercentileDistribution;
  totalAppreciation: PercentileDistribution;
  totalPrincipalPaydown: PercentileDistribution;
  finalEquity: PercentileDistribution;
  finalPropertyValue: PercentileDistribution;
  annualizedReturn: PercentileDistribution;
  cashOnCashReturn: PercentileDistribution;
}

/**
 * Risk metrics
 */
export interface RiskMetrics {
  valueAtRisk95: number; // 95% VaR
  valueAtRisk99: number; // 99% VaR
  conditionalVaR95: number; // CVaR/Expected Shortfall at 95%
  conditionalVaR99: number; // CVaR/Expected Shortfall at 99%
  probabilityOfLoss: number; // Probability of negative return
  downsideDeviation: number; // Semi-deviation below mean
  coefficientOfVariation: number; // Std dev / mean
  sharpeRatio: number; // (Mean - risk-free rate) / std dev
  sortinoRatio: number; // (Mean - risk-free rate) / downside dev
  maxDrawdown: number; // Maximum observed loss
  probabilityOfTarget: number; // Probability of achieving target return
}

/**
 * Scenario analysis
 */
export interface ScenarioAnalysis {
  bestCase: SimulationResult;
  worstCase: SimulationResult;
  expectedCase: SimulationResult;
  pessimisticCase: SimulationResult; // 25th percentile
  optimisticCase: SimulationResult; // 75th percentile
}

/**
 * Monte Carlo simulation results
 */
export interface MonteCarloResults {
  distributions: Distributions;
  riskMetrics: RiskMetrics;
  scenarioAnalysis: ScenarioAnalysis;
  rawResults: SimulationResult[];
  metadata: {
    simulationCount: number;
    executionTimeMs: number;
    randomSeed?: number;
    completedAt: Date;
  };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Box-Muller transform for generating normal random variables
 * Generates a standard normal random variable (mean=0, stdDev=1)
 * 
 * @returns A random number from standard normal distribution N(0,1)
 */
export function boxMullerRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  
  // Box-Muller transform
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  return z0;
}

/**
 * Box-Muller transform with custom mean and standard deviation
 * 
 * @param mean - The mean of the normal distribution
 * @param stdDev - The standard deviation of the normal distribution
 * @returns A random number from N(mean, stdDev²)
 */
export function boxMullerRandomCustom(mean: number, stdDev: number): number {
  return mean + stdDev * boxMullerRandom();
}

/**
 * Calculate percentile from sorted array
 */
function calculatePercentile(sortedArray: number[], percentile: number): number {
  const index = (percentile / 100) * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  if (lower === upper) {
    return sortedArray[lower];
  }
  
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Calculate mean of an array
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values: number[], mean?: number): number {
  if (values.length === 0) return 0;
  const avg = mean ?? calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate downside deviation (semi-deviation below target)
 */
function calculateDownsideDeviation(values: number[], target: number = 0): number {
  const belowTarget = values.filter(val => val < target);
  if (belowTarget.length === 0) return 0;
  
  const squaredDiffs = belowTarget.map(val => Math.pow(val - target, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Extract metric values from simulation results
 */
function extractMetric(results: SimulationResult[], metric: keyof SimulationResult): number[] {
  return results.map(r => r[metric] as number);
}

/**
 * Calculate percentile distribution for a metric
 */
function calculatePercentileDistribution(values: number[]): PercentileDistribution {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);
  
  return {
    p10: calculatePercentile(sorted, 10),
    p25: calculatePercentile(sorted, 25),
    p50: calculatePercentile(sorted, 50),
    p75: calculatePercentile(sorted, 75),
    p90: calculatePercentile(sorted, 90),
    mean,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Calculate all percentile distributions from simulation results
 * Alias: calculateDistributionStats
 */
export function calculatePercentiles(results: SimulationResult[]): Distributions {
  return {
    totalReturn: calculatePercentileDistribution(extractMetric(results, 'totalReturn')),
    totalCashFlow: calculatePercentileDistribution(extractMetric(results, 'totalCashFlow')),
    totalAppreciation: calculatePercentileDistribution(extractMetric(results, 'totalAppreciation')),
    totalPrincipalPaydown: calculatePercentileDistribution(extractMetric(results, 'totalPrincipalPaydown')),
    finalEquity: calculatePercentileDistribution(extractMetric(results, 'finalEquity')),
    finalPropertyValue: calculatePercentileDistribution(extractMetric(results, 'finalPropertyValue')),
    annualizedReturn: calculatePercentileDistribution(extractMetric(results, 'annualizedReturn')),
    cashOnCashReturn: calculatePercentileDistribution(extractMetric(results, 'cashOnCashReturn')),
  };
}

/**
 * Calculate distribution statistics (percentiles, mean, stdDev)
 * Alias for calculatePercentiles
 */
export const calculateDistributionStats = calculatePercentiles;

/**
 * Calculate comprehensive risk metrics
 */
export function calculateRiskMetrics(
  results: SimulationResult[],
  distributions: Distributions,
  riskFreeRate: number = 0.03,
  targetReturn: number = 0.08
): RiskMetrics {
  const returns = extractMetric(results, 'annualizedReturn').map(r => r / 100); // Convert to decimal
  const sortedReturns = [...returns].sort((a, b) => a - b);
  
  // Value at Risk (VaR) - loss at given confidence level
  const var95Index = Math.floor(returns.length * 0.05);
  const var99Index = Math.floor(returns.length * 0.01);
  const valueAtRisk95 = -sortedReturns[var95Index] * 100;
  const valueAtRisk99 = -sortedReturns[var99Index] * 100;
  
  // Conditional VaR (CVaR) - expected loss beyond VaR
  const cvar95Returns = sortedReturns.slice(0, var95Index + 1);
  const cvar99Returns = sortedReturns.slice(0, var99Index + 1);
  const conditionalVaR95 = -calculateMean(cvar95Returns) * 100;
  const conditionalVaR99 = -calculateMean(cvar99Returns) * 100;
  
  // Probability of loss
  const lossCount = returns.filter(r => r < 0).length;
  const probabilityOfLoss = (lossCount / returns.length) * 100;
  
  // Downside deviation (semi-deviation below mean)
  const meanReturn = distributions.annualizedReturn.mean / 100;
  const downsideDeviation = calculateDownsideDeviation(returns, meanReturn) * 100;
  
  // Coefficient of variation
  const coefficientOfVariation = distributions.annualizedReturn.stdDev / 
    Math.abs(distributions.annualizedReturn.mean);
  
  // Sharpe ratio
  const excessReturn = meanReturn - riskFreeRate;
  const returnStdDev = distributions.annualizedReturn.stdDev / 100;
  const sharpeRatio = returnStdDev !== 0 ? excessReturn / returnStdDev : 0;
  
  // Sortino ratio (uses downside deviation instead of total std dev)
  const downsideDeviationDecimal = downsideDeviation / 100;
  const sortinoRatio = downsideDeviationDecimal !== 0 ? excessReturn / downsideDeviationDecimal : 0;
  
  // Max drawdown
  const maxDrawdown = Math.abs(distributions.annualizedReturn.min);
  
  // Probability of achieving target return
  const achievedTargetCount = returns.filter(r => r >= targetReturn).length;
  const probabilityOfTarget = (achievedTargetCount / returns.length) * 100;
  
  return {
    valueAtRisk95,
    valueAtRisk99,
    conditionalVaR95,
    conditionalVaR99,
    probabilityOfLoss,
    downsideDeviation,
    coefficientOfVariation,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    probabilityOfTarget,
  };
}

/**
 * Perform scenario analysis (worst/base/best case)
 * Alias: generateScenarioAnalysis
 */
export function performScenarioAnalysis(
  results: SimulationResult[],
  distributions: Distributions
): ScenarioAnalysis {
  // Sort by total return
  const sortedByReturn = [...results].sort((a, b) => a.totalReturn - b.totalReturn);
  
  // Find scenarios closest to key percentiles
  const findClosestToPercentile = (percentile: number): SimulationResult => {
    const targetReturn = calculatePercentile(
      sortedByReturn.map(r => r.totalReturn),
      percentile
    );
    
    return sortedByReturn.reduce((closest, current) => {
      const currentDiff = Math.abs(current.totalReturn - targetReturn);
      const closestDiff = Math.abs(closest.totalReturn - targetReturn);
      return currentDiff < closestDiff ? current : closest;
    });
  };
  
  return {
    bestCase: sortedByReturn[sortedByReturn.length - 1],
    worstCase: sortedByReturn[0],
    expectedCase: findClosestToPercentile(50), // Median case (base case)
    pessimisticCase: findClosestToPercentile(25), // 25th percentile
    optimisticCase: findClosestToPercentile(75), // 75th percentile
  };
}

/**
 * Generate scenario analysis (worst/base/best case)
 * Alias for performScenarioAnalysis
 */
export const generateScenarioAnalysis = performScenarioAnalysis;

/**
 * Run Monte Carlo simulation using Web Worker
 */
export async function runMonteCarloSimulation(
  inputs: MonteCarloInputs
): Promise<MonteCarloResults> {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    // Create Web Worker
    const worker = new Worker('/monteCarloWorker.js');
    
    // Handle messages from worker
    worker.onmessage = (e) => {
      const { type, data } = e.data;
      
      if (type === 'PROGRESS') {
        // Report progress to callback if provided
        if (inputs.onProgress) {
          inputs.onProgress(data);
        }
      } else if (type === 'COMPLETE') {
        // Process results
        const results: SimulationResult[] = data;
        
        // Calculate distributions
        const distributions = calculatePercentiles(results);
        
        // Calculate risk metrics
        const riskMetrics = calculateRiskMetrics(results, distributions);
        
        // Perform scenario analysis
        const scenarioAnalysis = performScenarioAnalysis(results, distributions);
        
        // Calculate execution time
        const executionTimeMs = Date.now() - startTime;
        
        // Compile final results
        const monteCarloResults: MonteCarloResults = {
          distributions,
          riskMetrics,
          scenarioAnalysis,
          rawResults: results,
          metadata: {
            simulationCount: results.length,
            executionTimeMs,
            randomSeed: inputs.randomSeed,
            completedAt: new Date(),
          },
        };
        
        // Clean up worker
        worker.terminate();
        
        // Resolve promise
        resolve(monteCarloResults);
      } else if (type === 'ERROR') {
        worker.terminate();
        reject(new Error(data.message || 'Simulation failed'));
      }
    };
    
    // Handle worker errors
    worker.onerror = (error) => {
      worker.terminate();
      reject(new Error(`Worker error: ${error.message}`));
    };
    
    // Send simulation request to worker
    worker.postMessage({
      type: 'RUN_SIMULATION',
      data: {
        baseParams: inputs.baseState,
        uncertaintyInputs: inputs.uncertaintyParameters,
        simulationCount: inputs.simulations,
        randomSeed: inputs.randomSeed,
      },
    });
  });
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Create default uncertainty parameters with reasonable defaults
 * Uses normal distributions for rent and expense growth to enable correlation
 */
export function createDefaultUncertaintyParameters(
  baseState: BaseState,
  useCorrelation: boolean = true
): UncertaintyParameters {
  return {
    rentGrowthDistribution: {
      type: 'normal',
      mean: 0.03,
      stdDev: 0.015, // 1.5% standard deviation
    },
    initialRentDistribution: {
      type: 'normal',
      mean: baseState.initialMonthlyRent,
      stdDev: baseState.initialMonthlyRent * 0.05,
    },
    expenseGrowthDistribution: {
      type: 'normal',
      mean: 0.03,
      stdDev: 0.01, // 1% standard deviation
    },
    appreciationDistribution: {
      type: 'triangular',
      min: 0.00,
      mode: 0.03,
      max: 0.07,
    },
    vacancyRateDistribution: {
      type: 'triangular',
      min: 0.03,
      mode: 0.05,
      max: 0.10,
    },
    maintenanceDistribution: {
      type: 'triangular',
      min: 0.8,
      mode: 1.0,
      max: 1.5,
    },
    purchasePriceDistribution: {
      type: 'normal',
      mean: baseState.purchasePrice,
      stdDev: baseState.purchasePrice * 0.02,
    },
    incomeExpenseCorrelation: useCorrelation ? 0.6 : 0, // 0.6 correlation by default
  };
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Scenario parameters for random scenario generation
 */
export interface ScenarioParameters {
  incomeGrowthMean: number;
  incomeGrowthStdDev: number;
  expenseGrowthMean: number;
  expenseGrowthStdDev: number;
  occupancyMean: number;
  occupancyStdDev: number;
  appreciationMean: number;
  appreciationStdDev: number;
  marketIncomeCorrelation: number;  // Correlation between market factor and income
  marketExpenseCorrelation: number; // Correlation between market factor and expenses (default: 0.6)
}

/**
 * Random scenario output
 */
export interface RandomScenario {
  marketFactor: number;           // Overall market condition factor
  incomeGrowthRate: number;       // Annual income growth rate (correlated with market)
  expenseGrowthRate: number;      // Annual expense growth rate (0.6 correlated with market)
  occupancyRate: number;          // Occupancy rate (independent of market)
  appreciationRate: number;       // Property appreciation rate
  scenario: 'recession' | 'stagnant' | 'stable' | 'growth' | 'boom';  // Market scenario label
}

/**
 * Generate a random scenario with correlated market factors
 * 
 * This function creates a complete random scenario incorporating:
 * - Market factor (overall market conditions)
 * - Income variation (correlated with market)
 * - Expense variation (0.6 correlation with market by default)
 * - Occupancy variation (independent)
 * - Appreciation variation
 * 
 * @param params Scenario parameters (optional, uses defaults if not provided)
 * @returns RandomScenario with all correlated factors
 */
export function generateRandomScenario(params?: Partial<ScenarioParameters>): RandomScenario {
  // Default parameters
  const defaults: ScenarioParameters = {
    incomeGrowthMean: 0.03,
    incomeGrowthStdDev: 0.015,
    expenseGrowthMean: 0.03,
    expenseGrowthStdDev: 0.01,
    occupancyMean: 0.92,
    occupancyStdDev: 0.05,
    appreciationMean: 0.03,
    appreciationStdDev: 0.02,
    marketIncomeCorrelation: 0.7,     // Strong correlation between market and income
    marketExpenseCorrelation: 0.6,    // Moderate correlation between market and expenses
  };
  
  const p = { ...defaults, ...params };
  
  // Generate market factor (standard normal, represents overall market conditions)
  const marketFactor = boxMullerRandom();
  
  // Generate independent random factors using Box-Muller
  const u1 = Math.random();
  const u2 = Math.random();
  const u3 = Math.random();
  const u4 = Math.random();
  
  // Box-Muller transform for independent normals
  const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);  // For income
  const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);  // For expenses
  const z3 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);  // For occupancy
  const z4 = Math.sqrt(-2 * Math.log(u3)) * Math.sin(2 * Math.PI * u4);  // For appreciation
  
  // Apply correlation to income (correlated with market factor)
  // Using Cholesky decomposition: x = ρ * market + sqrt(1 - ρ²) * independent
  const incomeIndependent = p.marketIncomeCorrelation * marketFactor + 
    Math.sqrt(1 - p.marketIncomeCorrelation * p.marketIncomeCorrelation) * z1;
  const incomeGrowthRate = p.incomeGrowthMean + p.incomeGrowthStdDev * incomeIndependent;
  
  // Apply correlation to expenses (0.6 correlated with market factor by default)
  const expenseIndependent = p.marketExpenseCorrelation * marketFactor + 
    Math.sqrt(1 - p.marketExpenseCorrelation * p.marketExpenseCorrelation) * z2;
  const expenseGrowthRate = p.expenseGrowthMean + p.expenseGrowthStdDev * expenseIndependent;
  
  // Occupancy is independent of market factor (but still random)
  const occupancyRate = Math.max(0.5, Math.min(1.0, p.occupancyMean + p.occupancyStdDev * z3));
  
  // Appreciation can be independent or you could correlate it with market
  const appreciationRate = p.appreciationMean + p.appreciationStdDev * z4;
  
  // Determine scenario label based on market factor
  let scenario: 'recession' | 'stagnant' | 'stable' | 'growth' | 'boom';
  if (marketFactor < -1.5) {
    scenario = 'recession';
  } else if (marketFactor < -0.5) {
    scenario = 'stagnant';
  } else if (marketFactor < 0.5) {
    scenario = 'stable';
  } else if (marketFactor < 1.5) {
    scenario = 'growth';
  } else {
    scenario = 'boom';
  }
  
  return {
    marketFactor,
    incomeGrowthRate,
    expenseGrowthRate,
    occupancyRate,
    appreciationRate,
    scenario,
  };
}

/**
 * Generate multiple random scenarios
 * 
 * @param count Number of scenarios to generate
 * @param params Optional scenario parameters
 * @returns Array of random scenarios
 */
export function generateRandomScenarios(
  count: number,
  params?: Partial<ScenarioParameters>
): RandomScenario[] {
  return Array.from({ length: count }, () => generateRandomScenario(params));
}

/**
 * Generate summary statistics text
 */
export function generateSummaryText(results: MonteCarloResults): string {
  const { distributions, riskMetrics, scenarioAnalysis } = results;
  
  return `
Monte Carlo Simulation Summary
==============================

Simulations: ${results.metadata.simulationCount.toLocaleString()}
Execution Time: ${(results.metadata.executionTimeMs / 1000).toFixed(2)}s

RETURN DISTRIBUTIONS
--------------------
Annualized Return:
  P10: ${formatPercentage(distributions.annualizedReturn.p10)}
  P25: ${formatPercentage(distributions.annualizedReturn.p25)}
  P50 (Median): ${formatPercentage(distributions.annualizedReturn.p50)}
  P75: ${formatPercentage(distributions.annualizedReturn.p75)}
  P90: ${formatPercentage(distributions.annualizedReturn.p90)}
  Mean: ${formatPercentage(distributions.annualizedReturn.mean)}
  Std Dev: ${formatPercentage(distributions.annualizedReturn.stdDev)}

Total Return:
  P10: ${formatCurrency(distributions.totalReturn.p10)}
  P50 (Median): ${formatCurrency(distributions.totalReturn.p50)}
  P90: ${formatCurrency(distributions.totalReturn.p90)}
  Mean: ${formatCurrency(distributions.totalReturn.mean)}

RISK METRICS
------------
Value at Risk (95%): ${formatPercentage(riskMetrics.valueAtRisk95)}
Conditional VaR (95%): ${formatPercentage(riskMetrics.conditionalVaR95)}
Probability of Loss: ${formatPercentage(riskMetrics.probabilityOfLoss)}
Sharpe Ratio: ${riskMetrics.sharpeRatio.toFixed(2)}
Sortino Ratio: ${riskMetrics.sortinoRatio.toFixed(2)}

SCENARIO ANALYSIS
-----------------
Worst Case: ${formatCurrency(scenarioAnalysis.worstCase.totalReturn)}
Pessimistic (P25): ${formatCurrency(scenarioAnalysis.pessimisticCase.totalReturn)}
Expected (P50): ${formatCurrency(scenarioAnalysis.expectedCase.totalReturn)}
Optimistic (P75): ${formatCurrency(scenarioAnalysis.optimisticCase.totalReturn)}
Best Case: ${formatCurrency(scenarioAnalysis.bestCase.totalReturn)}
`.trim();
}

