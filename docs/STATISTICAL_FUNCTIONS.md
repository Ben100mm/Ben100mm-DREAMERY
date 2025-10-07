# Monte Carlo Statistical Functions Reference

## Overview

This document provides a complete reference for all statistical functions used in the Monte Carlo simulation system.

---

## Core Statistical Functions

### 1. `calculateDistributionStats()` / `calculatePercentiles()`

**Purpose:** Calculate percentiles, mean, and standard deviation for all metrics

**Signature:**
```typescript
function calculateDistributionStats(
  results: SimulationResult[]
): Distributions
```

**Returns:** `Distributions` object containing:
- **P10**: 10th percentile (10% of outcomes below this)
- **P25**: 25th percentile (pessimistic case)
- **P50**: 50th percentile (median/expected case)
- **P75**: 75th percentile (optimistic case)
- **P90**: 90th percentile (90% of outcomes below this)
- **Mean**: Average of all outcomes
- **StdDev**: Standard deviation (measure of volatility)
- **Min**: Minimum value observed
- **Max**: Maximum value observed

**Metrics Analyzed:**
1. Total Return
2. Total Cash Flow
3. Total Appreciation
4. Total Principal Paydown
5. Final Equity
6. Final Property Value
7. Annualized Return
8. Cash-on-Cash Return

**Example:**
```typescript
const results = await runMonteCarloSimulation(inputs);
const stats = calculateDistributionStats(results.rawResults);

console.log('Median Return:', stats.annualizedReturn.p50);
console.log('Mean Return:', stats.annualizedReturn.mean);
console.log('Std Dev:', stats.annualizedReturn.stdDev);
console.log('P10-P90 Range:', stats.annualizedReturn.p10, 'to', stats.annualizedReturn.p90);
```

**Mathematical Details:**
- **Percentile Calculation**: Linear interpolation between sorted values
  ```
  index = (percentile / 100) * (n - 1)
  value = array[floor(index)] * (1 - weight) + array[ceil(index)] * weight
  where weight = index - floor(index)
  ```

- **Mean**: 
  ```
  μ = (Σ xi) / n
  ```

- **Standard Deviation**:
  ```
  σ = sqrt(Σ(xi - μ)² / n)
  ```

---

### 2. `calculateRiskMetrics()`

**Purpose:** Calculate comprehensive risk metrics including VaR, CVaR, Sharpe ratio, Sortino ratio

**Signature:**
```typescript
function calculateRiskMetrics(
  results: SimulationResult[],
  distributions: Distributions,
  riskFreeRate: number = 0.03,
  targetReturn: number = 0.08
): RiskMetrics
```

**Parameters:**
- `results`: Array of simulation results
- `distributions`: Distribution statistics from calculateDistributionStats()
- `riskFreeRate`: Risk-free rate for Sharpe/Sortino calculations (default: 3%)
- `targetReturn`: Target return for probability calculation (default: 8%)

**Returns:** `RiskMetrics` object containing:

#### Value at Risk (VaR)
- **valueAtRisk95**: 95% VaR - Maximum expected loss at 95% confidence
- **valueAtRisk99**: 99% VaR - Maximum expected loss at 99% confidence

**Formula:**
```
VaR95 = -percentile_5(returns)
VaR99 = -percentile_1(returns)
```

**Interpretation:** "There's a 5% chance we'll lose at least VaR95%"

#### Conditional Value at Risk (CVaR)
- **conditionalVaR95**: Average loss in worst 5% of scenarios
- **conditionalVaR99**: Average loss in worst 1% of scenarios

**Formula:**
```
CVaR95 = -mean(returns where return < VaR95)
```

**Interpretation:** "If we're in the worst 5%, expect to lose CVaR95% on average"

#### Probability Metrics
- **probabilityOfLoss**: Percentage chance of negative return
- **probabilityOfTarget**: Percentage chance of achieving target return

**Formula:**
```
P(loss) = (count(returns < 0) / n) * 100
P(target) = (count(returns ≥ target) / n) * 100
```

#### Volatility Metrics
- **downsideDeviation**: Semi-deviation below mean (only negative deviations)
- **coefficientOfVariation**: Relative risk measure (σ / μ)
- **maxDrawdown**: Worst observed loss

**Downside Deviation Formula:**
```
DD = sqrt(Σ(min(0, xi - μ)²) / n)
```

#### Risk-Adjusted Returns
- **sharpeRatio**: (Return - Risk-Free Rate) / Standard Deviation
- **sortinoRatio**: (Return - Risk-Free Rate) / Downside Deviation

**Formulas:**
```
Sharpe = (μ - rf) / σ
Sortino = (μ - rf) / σ_downside
```

**Interpretation:**
- Sharpe < 1: Poor risk-adjusted return
- Sharpe 1-2: Good risk-adjusted return
- Sharpe > 2: Excellent risk-adjusted return

**Example:**
```typescript
const distributions = calculateDistributionStats(results);
const riskMetrics = calculateRiskMetrics(
  results,
  distributions,
  0.03,  // 3% risk-free rate
  0.08   // 8% target return
);

console.log('VaR (95%):', riskMetrics.valueAtRisk95, '%');
console.log('CVaR (95%):', riskMetrics.conditionalVaR95, '%');
console.log('Probability of Loss:', riskMetrics.probabilityOfLoss, '%');
console.log('Sharpe Ratio:', riskMetrics.sharpeRatio);
console.log('Sortino Ratio:', riskMetrics.sortinoRatio);
```

---

### 3. `generateScenarioAnalysis()` / `performScenarioAnalysis()`

**Purpose:** Generate worst/base/best case scenarios

**Signature:**
```typescript
function generateScenarioAnalysis(
  results: SimulationResult[],
  distributions: Distributions
): ScenarioAnalysis
```

**Returns:** `ScenarioAnalysis` object containing complete simulation results for:

1. **worstCase**: Minimum total return scenario
2. **pessimisticCase**: 25th percentile scenario
3. **expectedCase**: 50th percentile (median/base case)
4. **optimisticCase**: 75th percentile scenario
5. **bestCase**: Maximum total return scenario

**Each scenario includes:**
- Total Return
- Total Cash Flow
- Total Appreciation
- Total Principal Paydown
- Final Equity
- Final Property Value
- Annualized Return
- Cash-on-Cash Return

**Example:**
```typescript
const distributions = calculateDistributionStats(results);
const scenarios = generateScenarioAnalysis(results, distributions);

console.log('WORST CASE:');
console.log('  Total Return:', formatCurrency(scenarios.worstCase.totalReturn));
console.log('  Annualized:', formatPercentage(scenarios.worstCase.annualizedReturn));

console.log('EXPECTED CASE (BASE):');
console.log('  Total Return:', formatCurrency(scenarios.expectedCase.totalReturn));
console.log('  Annualized:', formatPercentage(scenarios.expectedCase.annualizedReturn));

console.log('BEST CASE:');
console.log('  Total Return:', formatCurrency(scenarios.bestCase.totalReturn));
console.log('  Annualized:', formatPercentage(scenarios.bestCase.annualizedReturn));
```

**Use Cases:**
- Present range of outcomes to investors
- Stress testing (worst case analysis)
- Conservative planning (pessimistic case)
- Optimistic projections (optimistic case)
- Most likely outcome (expected/base case)

---

### 4. `boxMullerRandom()`

**Purpose:** Normal distribution random number generator using Box-Muller transform

**Signature:**
```typescript
function boxMullerRandom(): number
```

**Returns:** Random number from standard normal distribution N(0, 1)

**Mathematical Formula:**
```
u1, u2 ~ Uniform(0, 1)
z = sqrt(-2 * ln(u1)) * cos(2π * u2)
where z ~ N(0, 1)
```

**Properties:**
- **Exact transformation** (not approximation)
- Generates standard normal (μ=0, σ=1)
- Based on George Box and Mervin E. Muller (1958)

**Example:**
```typescript
// Generate standard normal random variable
const z = boxMullerRandom();
console.log('Standard normal:', z);  // Mean ≈ 0, StdDev ≈ 1

// Generate 10,000 samples and verify distribution
const samples = Array.from({ length: 10000 }, () => boxMullerRandom());
const mean = samples.reduce((a, b) => a + b) / samples.length;
const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
console.log('Empirical mean:', mean);      // Should be ≈ 0
console.log('Empirical std dev:', Math.sqrt(variance));  // Should be ≈ 1
```

**Advanced Usage:**

For custom mean and standard deviation, use `boxMullerRandomCustom()`:

```typescript
function boxMullerRandomCustom(mean: number, stdDev: number): number {
  return mean + stdDev * boxMullerRandom();
}

// Generate rent growth: mean 3%, std dev 1.5%
const rentGrowth = boxMullerRandomCustom(0.03, 0.015);
console.log('Rent growth:', rentGrowth * 100, '%');
```

**Why Box-Muller?**

1. **Mathematically Exact**: Not an approximation like Central Limit Theorem methods
2. **Efficient**: Generates one normal from two uniforms
3. **Well-Tested**: Industry standard since 1958
4. **Enables Correlation**: Can generate correlated normals via Cholesky decomposition

---

## Supporting Utility Functions

### `calculateMean()`
```typescript
function calculateMean(values: number[]): number
```
Returns arithmetic mean: μ = Σxi / n

### `calculateStdDev()`
```typescript
function calculateStdDev(values: number[], mean?: number): number
```
Returns standard deviation: σ = sqrt(Σ(xi - μ)² / n)

### `calculateDownsideDeviation()`
```typescript
function calculateDownsideDeviation(values: number[], target: number = 0): number
```
Returns semi-deviation below target (only counts negative deviations)

### `calculatePercentile()`
```typescript
function calculatePercentile(sortedArray: number[], percentile: number): number
```
Returns percentile value using linear interpolation

### `extractMetric()`
```typescript
function extractMetric(results: SimulationResult[], metric: keyof SimulationResult): number[]
```
Extracts a specific metric from all simulation results

---

## Complete Usage Example

```typescript
import {
  runMonteCarloSimulation,
  calculateDistributionStats,
  calculateRiskMetrics,
  generateScenarioAnalysis,
  boxMullerRandom,
  formatCurrency,
  formatPercentage,
  type BaseState,
  type MonteCarloInputs,
} from './utils/monteCarloRiskSimulation';

// Define base investment parameters
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

// Run simulation
const monteCarloResults = await runMonteCarloSimulation({
  baseState,
  uncertaintyParameters: createDefaultUncertaintyParameters(baseState),
  simulations: 10000,
  yearsToProject: 10,
  onProgress: (progress) => console.log(`${progress.percentage.toFixed(1)}%`),
});

// 1. Calculate Distribution Statistics
const distributions = calculateDistributionStats(monteCarloResults.rawResults);
console.log('\n=== DISTRIBUTION STATISTICS ===');
console.log('Annualized Return:');
console.log('  P10:', formatPercentage(distributions.annualizedReturn.p10));
console.log('  P25:', formatPercentage(distributions.annualizedReturn.p25));
console.log('  P50 (Median):', formatPercentage(distributions.annualizedReturn.p50));
console.log('  P75:', formatPercentage(distributions.annualizedReturn.p75));
console.log('  P90:', formatPercentage(distributions.annualizedReturn.p90));
console.log('  Mean:', formatPercentage(distributions.annualizedReturn.mean));
console.log('  Std Dev:', formatPercentage(distributions.annualizedReturn.stdDev));

// 2. Calculate Risk Metrics
const riskMetrics = calculateRiskMetrics(
  monteCarloResults.rawResults,
  distributions,
  0.03,  // 3% risk-free rate
  0.08   // 8% target return
);
console.log('\n=== RISK METRICS ===');
console.log('Value at Risk (95%):', formatPercentage(riskMetrics.valueAtRisk95));
console.log('Conditional VaR (95%):', formatPercentage(riskMetrics.conditionalVaR95));
console.log('Probability of Loss:', formatPercentage(riskMetrics.probabilityOfLoss));
console.log('Downside Deviation:', formatPercentage(riskMetrics.downsideDeviation));
console.log('Sharpe Ratio:', riskMetrics.sharpeRatio.toFixed(2));
console.log('Sortino Ratio:', riskMetrics.sortinoRatio.toFixed(2));

// 3. Generate Scenario Analysis
const scenarios = generateScenarioAnalysis(
  monteCarloResults.rawResults,
  distributions
);
console.log('\n=== SCENARIO ANALYSIS ===');
console.log('Worst Case:', formatCurrency(scenarios.worstCase.totalReturn));
console.log('Pessimistic (P25):', formatCurrency(scenarios.pessimisticCase.totalReturn));
console.log('Expected/Base (P50):', formatCurrency(scenarios.expectedCase.totalReturn));
console.log('Optimistic (P75):', formatCurrency(scenarios.optimisticCase.totalReturn));
console.log('Best Case:', formatCurrency(scenarios.bestCase.totalReturn));

// 4. Box-Muller Random (for custom simulations)
console.log('\n=== BOX-MULLER RANDOM SAMPLES ===');
for (let i = 0; i < 5; i++) {
  const randomNormal = boxMullerRandom();
  console.log(`Sample ${i + 1}:`, randomNormal.toFixed(4));
}

// Investment Decision
console.log('\n=== INVESTMENT DECISION ===');
const isGoodInvestment = 
  riskMetrics.probabilityOfLoss < 10 &&
  distributions.annualizedReturn.p50 > 8 &&
  riskMetrics.sharpeRatio > 1.0;

console.log('Probability of Loss:', riskMetrics.probabilityOfLoss < 10 ? '✓ PASS' : '✗ FAIL');
console.log('Median Return > 8%:', distributions.annualizedReturn.p50 > 8 ? '✓ PASS' : '✗ FAIL');
console.log('Sharpe Ratio > 1.0:', riskMetrics.sharpeRatio > 1.0 ? '✓ PASS' : '✗ FAIL');
console.log('\nRecommendation:', isGoodInvestment ? '✓ INVEST' : '✗ PASS');
```

---

## Integration with runMonteCarloSimulation()

All three main statistical functions are automatically called by `runMonteCarloSimulation()`:

```typescript
const results = await runMonteCarloSimulation(inputs);

// Results object contains:
results.distributions     // From calculateDistributionStats()
results.riskMetrics       // From calculateRiskMetrics()
results.scenarioAnalysis  // From generateScenarioAnalysis()
results.rawResults        // All simulation outcomes
results.metadata          // Simulation info (count, time, seed)
```

You can also call these functions separately for custom analysis or to recalculate with different parameters (e.g., different risk-free rate).

---

## Performance Characteristics

| Function | Complexity | Typical Time (10k sims) |
|----------|------------|-------------------------|
| calculateDistributionStats() | O(n log n) | ~50ms |
| calculateRiskMetrics() | O(n) | ~20ms |
| generateScenarioAnalysis() | O(n log n) | ~30ms |
| boxMullerRandom() | O(1) | ~0.001ms |

**Total overhead for statistical analysis: ~100ms per 10,000 simulations**

---

## References

### Academic Papers
1. Box, G. E. P., & Muller, M. E. (1958). "A Note on the Generation of Random Normal Deviates"
2. Artzner, P., et al. (1999). "Coherent Measures of Risk"
3. Sharpe, W. F. (1966). "Mutual Fund Performance"
4. Sortino, F. A., & Price, L. N. (1994). "Performance Measurement in a Downside Risk Framework"

### Industry Standards
- Basel III framework for VaR and CVaR
- CFA Institute guidelines for risk metrics
- GIPS standards for performance reporting

---

## Support

For questions about statistical functions:
- Review implementation in `src/utils/monteCarloRiskSimulation.ts`
- See examples in `src/utils/monteCarloExample.ts`
- Check correlation documentation in `docs/MONTE_CARLO_CORRELATION.md`

---

*Statistical functions documentation - October 7, 2025*
*Part of Dreamery Real Estate Platform Phase 2*

