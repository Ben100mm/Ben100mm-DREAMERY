/**
 * Monte Carlo Simulation for Real Estate Investment Analysis
 * 
 * Provides probabilistic modeling of investment returns using Monte Carlo methods.
 * Runs thousands of simulations with randomized inputs to generate distribution of outcomes.
 */

import { CashFlowProjectionParams, generateCashFlowProjections } from './cashFlowProjections';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Types of probability distributions
 */
export enum DistributionType {
  NORMAL = 'normal',
  TRIANGULAR = 'triangular',
  UNIFORM = 'uniform',
  LOGNORMAL = 'lognormal'
}

/**
 * Configuration for a probability distribution
 */
export interface Distribution {
  type: DistributionType;
  // For Normal/LogNormal: mean and stdDev
  mean?: number;
  stdDev?: number;
  // For Triangular: min, mode, max
  min?: number;
  mode?: number;
  max?: number;
  // For Uniform: min and max
  // min and max already defined above
}

/**
 * Uncertainty parameters for Monte Carlo simulation
 */
export interface MonteCarloInputs {
  // Rent uncertainty
  rentGrowthDistribution: Distribution;
  initialRentDistribution: Distribution;
  
  // Expense uncertainty
  expenseGrowthDistribution: Distribution;
  maintenanceDistribution: Distribution;
  
  // Property value uncertainty
  appreciationDistribution: Distribution;
  purchasePriceDistribution: Distribution;
  
  // Vacancy uncertainty
  vacancyRateDistribution: Distribution;
  
  // Interest rate uncertainty (for refinancing scenarios)
  interestRateDistribution?: Distribution;
}

/**
 * Results from a single simulation run
 */
export interface SimulationResult {
  totalReturn: number;
  totalCashFlow: number;
  totalAppreciation: number;
  totalPrincipalPaydown: number;
  annualizedReturn: number;
  finalEquity: number;
  finalPropertyValue: number;
  cashOnCashReturn: number; // Year 1
  irr: number;
}

/**
 * Statistical summary of simulation results
 */
export interface MonteCarloStatistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentile10: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
  confidenceInterval95: {
    lower: number;
    upper: number;
  };
}

/**
 * Complete Monte Carlo simulation results
 */
export interface MonteCarloResults {
  simulationCount: number;
  results: SimulationResult[];
  
  // Statistics for key metrics
  totalReturnStats: MonteCarloStatistics;
  annualizedReturnStats: MonteCarloStatistics;
  cashFlowStats: MonteCarloStatistics;
  finalEquityStats: MonteCarloStatistics;
  
  // Probability analysis
  probabilityOfPositiveReturn: number;
  probabilityOfTargetReturn: (targetReturn: number) => number;
  
  // Distribution data for visualization
  histogramData: {
    bins: number[];
    frequencies: number[];
    binWidth: number;
  };
  
  // Performance metrics
  executionTimeMs: number;
}

/**
 * Configuration for Monte Carlo simulation
 */
export interface MonteCarloConfig {
  baseParams: CashFlowProjectionParams;
  uncertaintyInputs: MonteCarloInputs;
  simulationCount: number;
  randomSeed?: number;
  confidenceLevel?: number; // Default 0.95
}

// ============================================================================
// Random Number Generation
// ============================================================================

/**
 * Seeded random number generator (for reproducibility)
 */
class SeededRandom {
  private seed: number;
  
  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }
  
  /**
   * Generate random number between 0 and 1
   */
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  
  /**
   * Reset seed
   */
  reset(seed: number): void {
    this.seed = seed;
  }
}

// Global random instance
let random = new SeededRandom();

/**
 * Set seed for reproducibility
 */
export function setRandomSeed(seed: number): void {
  random = new SeededRandom(seed);
}

/**
 * Generate random number from uniform distribution
 */
export function uniform(min: number, max: number): number {
  return min + random.next() * (max - min);
}

/**
 * Generate random number from normal distribution using Box-Muller transform
 */
export function normal(mean: number, stdDev: number): number {
  // Box-Muller transform
  const u1 = random.next();
  const u2 = random.next();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * stdDev;
}

/**
 * Generate random number from triangular distribution
 */
export function triangular(min: number, mode: number, max: number): number {
  const u = random.next();
  const f = (mode - min) / (max - min);
  
  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

/**
 * Generate random number from log-normal distribution
 */
export function lognormal(meanLog: number, stdDevLog: number): number {
  const normalValue = normal(meanLog, stdDevLog);
  return Math.exp(normalValue);
}

/**
 * Sample from a distribution configuration
 */
export function sampleDistribution(dist: Distribution): number {
  switch (dist.type) {
    case DistributionType.NORMAL:
      return normal(dist.mean!, dist.stdDev!);
    
    case DistributionType.TRIANGULAR:
      return triangular(dist.min!, dist.mode!, dist.max!);
    
    case DistributionType.UNIFORM:
      return uniform(dist.min!, dist.max!);
    
    case DistributionType.LOGNORMAL:
      return lognormal(dist.mean!, dist.stdDev!);
    
    default:
      throw new Error(`Unknown distribution type: ${dist.type}`);
  }
}

// ============================================================================
// Statistical Functions
// ============================================================================

/**
 * Calculate percentile of sorted array
 */
export function percentile(sortedArray: number[], p: number): number {
  if (sortedArray.length === 0) return 0;
  if (p <= 0) return sortedArray[0];
  if (p >= 1) return sortedArray[sortedArray.length - 1];
  
  const index = p * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Calculate mean of array
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate standard deviation of array
 */
export function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  const squaredDiffs = values.map(val => Math.pow(val - m, 2));
  const variance = mean(squaredDiffs);
  return Math.sqrt(variance);
}

/**
 * Calculate statistics for a set of values
 */
export function calculateStatistics(values: number[], confidenceLevel: number = 0.95): MonteCarloStatistics {
  if (values.length === 0) {
    return {
      mean: 0,
      median: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      percentile10: 0,
      percentile25: 0,
      percentile75: 0,
      percentile90: 0,
      confidenceInterval95: { lower: 0, upper: 0 }
    };
  }
  
  const sorted = [...values].sort((a, b) => a - b);
  const m = mean(values);
  const sd = stdDev(values);
  
  // Calculate confidence interval
  const alpha = 1 - confidenceLevel;
  const zScore = 1.96; // For 95% confidence
  const marginOfError = zScore * (sd / Math.sqrt(values.length));
  
  return {
    mean: m,
    median: percentile(sorted, 0.5),
    stdDev: sd,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    percentile10: percentile(sorted, 0.1),
    percentile25: percentile(sorted, 0.25),
    percentile75: percentile(sorted, 0.75),
    percentile90: percentile(sorted, 0.9),
    confidenceInterval95: {
      lower: m - marginOfError,
      upper: m + marginOfError
    }
  };
}

/**
 * Create histogram from values
 */
export function createHistogram(values: number[], binCount: number = 50): {
  bins: number[];
  frequencies: number[];
  binWidth: number;
} {
  if (values.length === 0) {
    return { bins: [], frequencies: [], binWidth: 0 };
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / binCount;
  
  const bins: number[] = [];
  const frequencies: number[] = new Array(binCount).fill(0);
  
  // Create bin edges
  for (let i = 0; i <= binCount; i++) {
    bins.push(min + i * binWidth);
  }
  
  // Count frequencies
  for (const value of values) {
    const binIndex = Math.min(
      Math.floor((value - min) / binWidth),
      binCount - 1
    );
    frequencies[binIndex]++;
  }
  
  return { bins, frequencies, binWidth };
}

// ============================================================================
// Monte Carlo Simulation Engine
// ============================================================================

/**
 * Run a single simulation with randomized inputs
 */
function runSingleSimulation(
  baseParams: CashFlowProjectionParams,
  uncertaintyInputs: MonteCarloInputs
): SimulationResult {
  // Sample random values from distributions
  const rentGrowth = sampleDistribution(uncertaintyInputs.rentGrowthDistribution);
  const initialRent = sampleDistribution(uncertaintyInputs.initialRentDistribution);
  const expenseGrowth = sampleDistribution(uncertaintyInputs.expenseGrowthDistribution);
  const appreciation = sampleDistribution(uncertaintyInputs.appreciationDistribution);
  const vacancyRate = sampleDistribution(uncertaintyInputs.vacancyRateDistribution);
  const maintenanceMultiplier = sampleDistribution(uncertaintyInputs.maintenanceDistribution);
  const purchasePrice = sampleDistribution(uncertaintyInputs.purchasePriceDistribution);
  
  // Create modified parameters for this simulation
  const simParams: CashFlowProjectionParams = {
    ...baseParams,
    purchasePrice,
    initialMonthlyRent: initialRent,
    vacancyRate: Math.max(0, Math.min(1, vacancyRate)), // Clamp to [0, 1]
    annualMaintenance: baseParams.annualMaintenance * maintenanceMultiplier,
    growthRates: {
      rentGrowthRate: rentGrowth,
      expenseGrowthRate: expenseGrowth,
      propertyAppreciationRate: appreciation
    }
  };
  
  // Run cash flow projection
  const results = generateCashFlowProjections(simParams);
  
  // Calculate IRR (simplified - could be enhanced)
  const cashFlows = results.yearlyProjections.map(p => p.cashFlowAfterCapEx);
  const irr = calculateSimpleIRR(-simParams.initialInvestment, cashFlows, results.summary.finalEquity);
  
  return {
    totalReturn: results.summary.totalReturn,
    totalCashFlow: results.summary.totalCashFlow,
    totalAppreciation: results.summary.totalAppreciation,
    totalPrincipalPaydown: results.summary.totalPrincipalPaydown,
    annualizedReturn: results.summary.annualizedReturn,
    finalEquity: results.summary.finalEquity,
    finalPropertyValue: results.yearlyProjections[results.yearlyProjections.length - 1].propertyValue,
    cashOnCashReturn: results.yearlyProjections[0].cashOnCashReturn,
    irr
  };
}

/**
 * Simple IRR calculation
 */
function calculateSimpleIRR(initialInvestment: number, cashFlows: number[], finalValue: number): number {
  const totalCashFlow = cashFlows.reduce((sum, cf) => sum + cf, 0);
  const totalReturn = totalCashFlow + finalValue;
  const years = cashFlows.length;
  
  if (initialInvestment <= 0 || years === 0) return 0;
  
  // Simple approximation
  return ((Math.pow(totalReturn / initialInvestment, 1 / years) - 1) * 100);
}

/**
 * Run Monte Carlo simulation
 */
export function runMonteCarloSimulation(config: MonteCarloConfig): MonteCarloResults {
  const startTime = performance.now();
  
  // Set random seed if provided
  if (config.randomSeed !== undefined) {
    setRandomSeed(config.randomSeed);
  }
  
  const results: SimulationResult[] = [];
  
  // Run simulations
  for (let i = 0; i < config.simulationCount; i++) {
    try {
      const result = runSingleSimulation(config.baseParams, config.uncertaintyInputs);
      results.push(result);
    } catch (error) {
      console.error(`Simulation ${i} failed:`, error);
      // Continue with next simulation
    }
  }
  
  const endTime = performance.now();
  
  // Extract metrics for statistical analysis
  const totalReturns = results.map(r => r.totalReturn);
  const annualizedReturns = results.map(r => r.annualizedReturn);
  const cashFlows = results.map(r => r.totalCashFlow);
  const finalEquities = results.map(r => r.finalEquity);
  
  // Calculate statistics
  const confidenceLevel = config.confidenceLevel || 0.95;
  const totalReturnStats = calculateStatistics(totalReturns, confidenceLevel);
  const annualizedReturnStats = calculateStatistics(annualizedReturns, confidenceLevel);
  const cashFlowStats = calculateStatistics(cashFlows, confidenceLevel);
  const finalEquityStats = calculateStatistics(finalEquities, confidenceLevel);
  
  // Calculate probabilities
  const positiveReturns = totalReturns.filter(r => r > 0).length;
  const probabilityOfPositiveReturn = positiveReturns / results.length;
  
  const probabilityOfTargetReturn = (targetReturn: number) => {
    const achieving = totalReturns.filter(r => r >= targetReturn).length;
    return achieving / results.length;
  };
  
  // Create histogram
  const histogramData = createHistogram(totalReturns);
  
  return {
    simulationCount: results.length,
    results,
    totalReturnStats,
    annualizedReturnStats,
    cashFlowStats,
    finalEquityStats,
    probabilityOfPositiveReturn,
    probabilityOfTargetReturn,
    histogramData,
    executionTimeMs: endTime - startTime
  };
}

/**
 * Create default uncertainty inputs (moderate assumptions)
 */
export function createDefaultUncertaintyInputs(
  baseParams: CashFlowProjectionParams
): MonteCarloInputs {
  return {
    // Rent growth: 3% ± 2% (normal distribution)
    rentGrowthDistribution: {
      type: DistributionType.NORMAL,
      mean: 0.03,
      stdDev: 0.02
    },
    
    // Initial rent: base ± 10% (triangular)
    initialRentDistribution: {
      type: DistributionType.TRIANGULAR,
      min: baseParams.initialMonthlyRent * 0.9,
      mode: baseParams.initialMonthlyRent,
      max: baseParams.initialMonthlyRent * 1.1
    },
    
    // Expense growth: 2.5% ± 1.5% (normal)
    expenseGrowthDistribution: {
      type: DistributionType.NORMAL,
      mean: 0.025,
      stdDev: 0.015
    },
    
    // Maintenance: 0.8x to 1.5x base (triangular)
    maintenanceDistribution: {
      type: DistributionType.TRIANGULAR,
      min: 0.8,
      mode: 1.0,
      max: 1.5
    },
    
    // Appreciation: 4% ± 2% (normal)
    appreciationDistribution: {
      type: DistributionType.NORMAL,
      mean: 0.04,
      stdDev: 0.02
    },
    
    // Purchase price: base ± 5% (triangular)
    purchasePriceDistribution: {
      type: DistributionType.TRIANGULAR,
      min: baseParams.purchasePrice * 0.95,
      mode: baseParams.purchasePrice,
      max: baseParams.purchasePrice * 1.05
    },
    
    // Vacancy rate: base ± 3% (triangular, clamped to [0, 1])
    vacancyRateDistribution: {
      type: DistributionType.TRIANGULAR,
      min: Math.max(0, (baseParams.vacancyRate || 0.05) - 0.03),
      mode: baseParams.vacancyRate || 0.05,
      max: Math.min(1, (baseParams.vacancyRate || 0.05) + 0.03)
    }
  };
}

/**
 * Export simulation results to CSV
 */
export function exportSimulationResultsToCSV(results: MonteCarloResults): string {
  const headers = [
    'Total Return',
    'Annualized Return',
    'Total Cash Flow',
    'Total Appreciation',
    'Principal Paydown',
    'Final Equity',
    'Final Property Value',
    'Year 1 CoC',
    'IRR'
  ];
  
  const rows = results.results.map(r => [
    r.totalReturn,
    r.annualizedReturn,
    r.totalCashFlow,
    r.totalAppreciation,
    r.totalPrincipalPaydown,
    r.finalEquity,
    r.finalPropertyValue,
    r.cashOnCashReturn,
    r.irr
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

