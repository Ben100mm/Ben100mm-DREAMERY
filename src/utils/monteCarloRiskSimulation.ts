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
 * Perform scenario analysis
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
    expectedCase: findClosestToPercentile(50), // Median case
    pessimisticCase: findClosestToPercentile(25), // 25th percentile
    optimisticCase: findClosestToPercentile(75), // 75th percentile
  };
}

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

