# Monte Carlo Risk Simulation

## Overview

The Monte Carlo Risk Simulation module provides comprehensive probabilistic analysis for real estate investment decisions. It uses Web Workers to run thousands of simulations without blocking the UI, generating detailed risk metrics, percentile distributions, and scenario analyses.

## Features

### Core Capabilities

1. **Probabilistic Modeling**
   - Models uncertainty in key investment variables (rent growth, expenses, appreciation, etc.)
   - Supports 4 distribution types: Normal, Triangular, Uniform, Log-Normal
   - Customizable parameters for each variable

2. **Percentile Analysis**
   - P10, P25, P50 (Median), P75, P90 distributions
   - Mean, Standard Deviation, Min/Max values
   - Applied to all key metrics

3. **Risk Metrics**
   - **Value at Risk (VaR)**: 95% and 99% confidence levels
   - **Conditional VaR (CVaR)**: Expected loss beyond VaR threshold
   - **Probability of Loss**: Likelihood of negative returns
   - **Downside Deviation**: Semi-deviation below mean
   - **Sharpe Ratio**: Risk-adjusted return metric
   - **Sortino Ratio**: Downside risk-adjusted return
   - **Coefficient of Variation**: Relative risk measure
   - **Maximum Drawdown**: Worst-case scenario
   - **Target Probability**: Chance of achieving target return

4. **Scenario Analysis**
   - Best Case (Maximum return)
   - Optimistic Case (75th percentile)
   - Expected Case (50th percentile/Median)
   - Pessimistic Case (25th percentile)
   - Worst Case (Minimum return)

5. **Web Worker Integration**
   - Non-blocking execution
   - Progress callbacks
   - Handles 10,000+ simulations smoothly

## Files

### Core Implementation

- **`src/utils/monteCarloRiskSimulation.ts`** (~606 lines)
  - Main TypeScript module
  - Type-safe interfaces and functions
  - Risk metric calculations
  - Web Worker orchestration

- **`public/monteCarloWorker.js`** (existing)
  - Web Worker for simulation execution
  - Distribution sampling
  - Cash flow calculations
  - Progress reporting

- **`src/utils/monteCarloExample.ts`** (~366 lines)
  - Comprehensive usage examples
  - 5 different scenarios
  - Property comparison utilities
  - Investment decision framework

## Usage

### Basic Example

```typescript
import {
  runMonteCarloSimulation,
  createDefaultUncertaintyParameters,
  type BaseState,
  type MonteCarloInputs,
} from './utils/monteCarloRiskSimulation';

// Define base case
const baseState: BaseState = {
  purchasePrice: 400000,
  initialMonthlyRent: 2500,
  annualTaxes: 4800,
  annualInsurance: 1500,
  annualMaintenance: 2000,
  annualManagement: 3000,
  annualCapEx: 2400,
  loanAmount: 320000,
  annualInterestRate: 0.065,
  loanTermMonths: 360,
  initialInvestment: 80000,
  projectionYears: 10,
};

// Create default uncertainty parameters
const uncertaintyParameters = createDefaultUncertaintyParameters(baseState);

// Configure simulation
const inputs: MonteCarloInputs = {
  baseState,
  uncertaintyParameters,
  simulations: 10000,
  yearsToProject: 10,
  onProgress: (progress) => {
    console.log(`Progress: ${progress.percentage.toFixed(1)}%`);
  },
};

// Run simulation
const results = await runMonteCarloSimulation(inputs);

// Access results
console.log('Expected Return:', results.distributions.annualizedReturn.mean);
console.log('Probability of Loss:', results.riskMetrics.probabilityOfLoss);
console.log('Sharpe Ratio:', results.riskMetrics.sharpeRatio);
```

### Custom Distributions

```typescript
import type { UncertaintyParameters } from './utils/monteCarloRiskSimulation';

const customUncertainty: UncertaintyParameters = {
  rentGrowthDistribution: {
    type: 'triangular',
    min: 0.03,
    mode: 0.05,
    max: 0.08,
  },
  appreciationDistribution: {
    type: 'normal',
    mean: 0.04,
    stdDev: 0.02,
  },
  vacancyRateDistribution: {
    type: 'uniform',
    min: 0.03,
    max: 0.08,
  },
  // ... other parameters
};
```

## Distribution Types

### 1. Normal Distribution

Best for: Variables that cluster around a mean value

```typescript
{
  type: 'normal',
  mean: 0.05,    // Average value
  stdDev: 0.02   // Standard deviation
}
```

**Use Cases:**
- Purchase price variations
- Initial rent estimates
- Interest rate fluctuations

### 2. Triangular Distribution

Best for: Variables with known min/max and most likely value

```typescript
{
  type: 'triangular',
  min: 0.02,     // Minimum value
  mode: 0.04,    // Most likely value
  max: 0.08      // Maximum value
}
```

**Use Cases:**
- Rent growth rates
- Expense growth rates
- Property appreciation
- Vacancy rates

### 3. Uniform Distribution

Best for: Variables with equal probability across a range

```typescript
{
  type: 'uniform',
  min: 0.03,     // Minimum value
  max: 0.07      // Maximum value
}
```

**Use Cases:**
- Vacancy rates in uncertain markets
- Cap rate variations

### 4. Log-Normal Distribution

Best for: Variables that can't be negative and are right-skewed

```typescript
{
  type: 'lognormal',
  mean: 0.04,    // Mean of log-transformed variable
  stdDev: 0.5    // Std dev of log-transformed variable
}
```

**Use Cases:**
- Property appreciation in high-growth areas
- Major repair costs
- Insurance claims

## Result Interpretation

### Percentile Distributions

```typescript
distributions.annualizedReturn = {
  p10: 3.2,      // 10% of outcomes below this
  p25: 5.1,      // 25% of outcomes below this (pessimistic)
  p50: 7.5,      // 50% of outcomes below this (median/expected)
  p75: 9.8,      // 75% of outcomes below this (optimistic)
  p90: 12.4,     // 90% of outcomes below this
  mean: 7.6,     // Average of all outcomes
  stdDev: 3.2,   // Measure of variability
  min: -2.1,     // Worst outcome
  max: 18.5      // Best outcome
}
```

**Interpretation:**
- **P50 (Median)**: Most reliable estimate, not affected by extremes
- **P10-P90 Range**: Where 80% of outcomes fall
- **Mean**: Average outcome (can be skewed by extremes)
- **StdDev**: Higher = more uncertainty/risk

### Risk Metrics

```typescript
riskMetrics = {
  valueAtRisk95: 2.5,           // 5% chance of losing 2.5%+
  conditionalVaR95: 4.1,        // If in worst 5%, expect 4.1% loss
  probabilityOfLoss: 8.3,       // 8.3% chance of negative return
  sharpeRatio: 1.8,             // Risk-adjusted return (>1 is good)
  sortinoRatio: 2.4,            // Downside risk-adjusted return
  downsideDeviation: 1.5,       // Volatility of negative returns
  maxDrawdown: 5.2,             // Worst observed loss
  probabilityOfTarget: 65.4     // 65.4% chance of meeting target
}
```

**Interpretation:**
- **VaR95**: "There's a 5% chance we'll lose at least this much"
- **CVaR95**: "If things go badly (worst 5%), this is the average loss"
- **Sharpe Ratio**: 
  - < 1: Poor risk-adjusted return
  - 1-2: Good
  - > 2: Excellent
- **Probability of Loss**: Lower is better (< 10% is good)

## Investment Decision Framework

### Recommended Criteria

```typescript
function evaluateInvestment(results: MonteCarloResults): boolean {
  const { distributions, riskMetrics } = results;
  
  // Criteria for a "good" investment
  const criteria = {
    lowRisk: riskMetrics.probabilityOfLoss < 10,
    adequateReturn: distributions.annualizedReturn.p50 > 8,
    goodRiskAdjusted: riskMetrics.sharpeRatio > 1.0,
    positiveDownside: distributions.annualizedReturn.p25 > 5,
  };
  
  // Must meet all criteria
  return Object.values(criteria).every(Boolean);
}
```

### Risk Tolerance Profiles

#### Conservative Investor
- Probability of Loss < 5%
- P25 Return > 6%
- Sharpe Ratio > 1.5
- Max Drawdown < 3%

#### Moderate Investor
- Probability of Loss < 10%
- P50 Return > 8%
- Sharpe Ratio > 1.0
- Max Drawdown < 5%

#### Aggressive Investor
- Probability of Loss < 20%
- P50 Return > 10%
- Sharpe Ratio > 0.8
- Willing to accept higher volatility

## Advanced Usage

### Comparing Multiple Properties

```typescript
import { runMonteCarloSimulation } from './utils/monteCarloRiskSimulation';

async function compareProperties(properties: BaseState[]) {
  const results = await Promise.all(
    properties.map(property => 
      runMonteCarloSimulation({
        baseState: property,
        uncertaintyParameters: createDefaultUncertaintyParameters(property),
        simulations: 10000,
        yearsToProject: 10,
      })
    )
  );
  
  // Sort by risk-adjusted returns
  const ranked = results
    .map((r, i) => ({ property: i, sharpe: r.riskMetrics.sharpeRatio, result: r }))
    .sort((a, b) => b.sharpe - a.sharpe);
  
  return ranked;
}
```

### Sensitivity Analysis

```typescript
async function sensitivityAnalysis(baseState: BaseState) {
  const simulations = 5000;
  const scenarios = {
    rentGrowth: [0.02, 0.03, 0.04, 0.05, 0.06],
    appreciation: [0.01, 0.02, 0.03, 0.04, 0.05],
  };
  
  const results = [];
  
  for (const rentGrowth of scenarios.rentGrowth) {
    for (const appreciation of scenarios.appreciation) {
      const uncertainty = createDefaultUncertaintyParameters(baseState);
      uncertainty.rentGrowthDistribution = { type: 'normal', mean: rentGrowth, stdDev: 0.005 };
      uncertainty.appreciationDistribution = { type: 'normal', mean: appreciation, stdDev: 0.005 };
      
      const result = await runMonteCarloSimulation({
        baseState,
        uncertaintyParameters: uncertainty,
        simulations,
        yearsToProject: 10,
      });
      
      results.push({ rentGrowth, appreciation, result });
    }
  }
  
  return results;
}
```

## Performance Considerations

### Simulation Count Guidelines

- **Quick Analysis**: 1,000-5,000 simulations (~1-2 seconds)
- **Standard Analysis**: 10,000 simulations (~3-5 seconds)
- **Detailed Analysis**: 20,000-50,000 simulations (~10-20 seconds)
- **Research/Publication**: 100,000+ simulations (~1-2 minutes)

### Memory Usage

- Each simulation result: ~200 bytes
- 10,000 simulations: ~2 MB
- 100,000 simulations: ~20 MB

Recommendation: For typical use, 10,000 simulations provide excellent accuracy with minimal wait time.

## API Reference

### Main Functions

#### `runMonteCarloSimulation(inputs: MonteCarloInputs): Promise<MonteCarloResults>`

Runs the Monte Carlo simulation and returns comprehensive results.

#### `calculatePercentiles(results: SimulationResult[]): Distributions`

Calculates percentile distributions for all metrics.

#### `calculateRiskMetrics(results: SimulationResult[], distributions: Distributions): RiskMetrics`

Calculates comprehensive risk metrics.

#### `performScenarioAnalysis(results: SimulationResult[], distributions: Distributions): ScenarioAnalysis`

Identifies best/worst/expected case scenarios.

#### `createDefaultUncertaintyParameters(baseState: BaseState): UncertaintyParameters`

Creates reasonable default uncertainty parameters.

### Type Definitions

See `src/utils/monteCarloRiskSimulation.ts` for complete type definitions.

## Best Practices

1. **Use Triangular Distributions** for most real estate variables (rent growth, appreciation)
2. **Use Normal Distributions** for price/value variations
3. **Run at least 10,000 simulations** for reliable results
4. **Set a random seed** for reproducible results during testing
5. **Focus on median (P50)** rather than mean for decision-making
6. **Consider P25-P75 range** for realistic outcome expectations
7. **Use Sharpe ratio** to compare risk-adjusted returns across properties
8. **Don't ignore downside risk** - check probability of loss and CVaR

## Troubleshooting

### Simulations Running Slow

- Reduce simulation count
- Check browser Web Worker support
- Close other tabs/applications

### Unexpected Results

- Verify input parameters (interest rates should be decimal, e.g., 0.065 not 6.5)
- Check distribution parameters are logical (min < mode < max)
- Ensure base state values are realistic

### Web Worker Errors

- Verify `monteCarloWorker.js` is in the `public` folder
- Check browser console for detailed error messages
- Ensure browser supports Web Workers

## Future Enhancements

Potential additions to consider:

1. **Correlation Modeling**: Model correlations between variables (e.g., rent growth and appreciation)
2. **Time-Series Forecasting**: Incorporate historical trends
3. **Tax Modeling**: Include detailed tax implications
4. **Market Cycles**: Model economic cycles and recession scenarios
5. **Multiple Exit Strategies**: Analyze different hold periods
6. **Portfolio Analysis**: Optimize across multiple properties
7. **Visualization**: Interactive charts and histograms

## References

- [Monte Carlo Method - Wikipedia](https://en.wikipedia.org/wiki/Monte_Carlo_method)
- [Value at Risk - Investopedia](https://www.investopedia.com/terms/v/var.asp)
- [Sharpe Ratio - Investopedia](https://www.investopedia.com/terms/s/sharperatio.asp)
- [Real Estate Investment Analysis Best Practices](https://www.biggerpockets.com/)

## License

Part of the Dreamery Real Estate Platform.

## Support

For questions or issues, contact the development team.

