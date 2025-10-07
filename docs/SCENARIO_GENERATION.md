# Random Scenario Generation

## Overview

The `generateRandomScenario()` function creates complete random scenarios with market-correlated factors for real estate investment analysis. This powerful utility generates realistic scenarios where income and expenses move together based on overall market conditions.

---

## Key Features

### ✅ Market Factor Integration
- Overall market condition factor (standard normal)
- Drives correlated variables
- Labeled scenarios: Recession, Stagnant, Stable, Growth, Boom

### ✅ Income Variation with Market Factor
- **Default correlation: 0.7** (strong positive correlation)
- Income grows when market is strong
- Income stagnates/declines when market is weak
- Configurable correlation strength

### ✅ Expense Variation (0.6 Correlation with Market)
- **Default correlation: 0.6** (moderate positive correlation)
- Expenses rise with market (inflation, labor costs)
- Lower correlation than income (some expenses fixed)
- Realistic modeling of expense behavior

### ✅ Occupancy Variation (Independent)
- **Independent of market factor**
- Property-specific performance
- Random variation around mean
- Bounded between 50% and 100%

### ✅ Appreciation Variation
- Property value appreciation rate
- Can be independent or market-correlated
- Configurable parameters

---

## Function Signatures

### `generateRandomScenario()`

Generate a single random scenario with correlated factors.

```typescript
function generateRandomScenario(
  params?: Partial<ScenarioParameters>
): RandomScenario
```

### `generateRandomScenarios()`

Generate multiple random scenarios.

```typescript
function generateRandomScenarios(
  count: number,
  params?: Partial<ScenarioParameters>
): RandomScenario[]
```

---

## Interfaces

### `ScenarioParameters`

```typescript
interface ScenarioParameters {
  incomeGrowthMean: number;           // Default: 0.03 (3%)
  incomeGrowthStdDev: number;         // Default: 0.015 (1.5%)
  expenseGrowthMean: number;          // Default: 0.03 (3%)
  expenseGrowthStdDev: number;        // Default: 0.01 (1%)
  occupancyMean: number;              // Default: 0.92 (92%)
  occupancyStdDev: number;            // Default: 0.05 (5%)
  appreciationMean: number;           // Default: 0.03 (3%)
  appreciationStdDev: number;         // Default: 0.02 (2%)
  marketIncomeCorrelation: number;    // Default: 0.7 (strong)
  marketExpenseCorrelation: number;   // Default: 0.6 (moderate)
}
```

### `RandomScenario`

```typescript
interface RandomScenario {
  marketFactor: number;               // Standard normal (-3 to +3 typically)
  incomeGrowthRate: number;           // Annual income growth rate
  expenseGrowthRate: number;          // Annual expense growth rate
  occupancyRate: number;              // Occupancy rate (0.5 to 1.0)
  appreciationRate: number;           // Property appreciation rate
  scenario: 'recession' | 'stagnant' | 'stable' | 'growth' | 'boom';
}
```

---

## Mathematical Implementation

### Correlation via Cholesky Decomposition

```typescript
// 1. Generate market factor (overall market conditions)
const marketFactor = boxMullerRandom();  // N(0, 1)

// 2. Generate independent random factors
const z1 = boxMullerRandom();  // Independent factor for income
const z2 = boxMullerRandom();  // Independent factor for expenses

// 3. Apply correlation using Cholesky decomposition
// For income (ρ = 0.7 correlation with market):
const incomeCorrelated = 0.7 * marketFactor + sqrt(1 - 0.7²) * z1;
const incomeGrowthRate = meanIncome + stdDevIncome * incomeCorrelated;

// For expenses (ρ = 0.6 correlation with market):
const expenseCorrelated = 0.6 * marketFactor + sqrt(1 - 0.6²) * z2;
const expenseGrowthRate = meanExpense + stdDevExpense * expenseCorrelated;
```

### Why This Works

**Cholesky Decomposition for 2-variable correlation:**

For variables X and Y with correlation ρ:
```
X = Z₁
Y = ρ·Z₁ + √(1-ρ²)·Z₂

where Z₁, Z₂ ~ N(0,1) are independent
```

**Properties:**
- Corr(X, Y) = ρ
- X ~ N(0, 1)
- Y ~ N(0, 1)
- Maintains marginal distributions

---

## Usage Examples

### Example 1: Basic Usage

```typescript
import { generateRandomScenario } from './utils/monteCarloRiskSimulation';

// Generate a single scenario with default parameters
const scenario = generateRandomScenario();

console.log('Market Condition:', scenario.scenario);           // 'stable', 'growth', etc.
console.log('Market Factor:', scenario.marketFactor);          // e.g., 0.5
console.log('Income Growth:', scenario.incomeGrowthRate);      // e.g., 0.035 (3.5%)
console.log('Expense Growth:', scenario.expenseGrowthRate);    // e.g., 0.032 (3.2%)
console.log('Occupancy:', scenario.occupancyRate);             // e.g., 0.94 (94%)
console.log('Appreciation:', scenario.appreciationRate);       // e.g., 0.028 (2.8%)
```

### Example 2: Generate Multiple Scenarios

```typescript
import { generateRandomScenarios } from './utils/monteCarloRiskSimulation';

// Generate 100 scenarios
const scenarios = generateRandomScenarios(100);

// Analyze distribution of scenarios
const scenarioCounts = {
  recession: scenarios.filter(s => s.scenario === 'recession').length,
  stagnant: scenarios.filter(s => s.scenario === 'stagnant').length,
  stable: scenarios.filter(s => s.scenario === 'stable').length,
  growth: scenarios.filter(s => s.scenario === 'growth').length,
  boom: scenarios.filter(s => s.scenario === 'boom').length,
};

console.log('Scenario Distribution:', scenarioCounts);
// Example output: { recession: 7, stagnant: 15, stable: 38, growth: 31, boom: 9 }
```

### Example 3: Custom Parameters

```typescript
import { generateRandomScenario } from './utils/monteCarloRiskSimulation';

// Hot market with higher growth
const hotMarketScenario = generateRandomScenario({
  incomeGrowthMean: 0.06,              // 6% income growth
  expenseGrowthMean: 0.04,             // 4% expense growth
  occupancyMean: 0.96,                 // 96% occupancy
  appreciationMean: 0.05,              // 5% appreciation
  marketIncomeCorrelation: 0.8,        // Stronger correlation
  marketExpenseCorrelation: 0.7,       // Stronger correlation
});

// Conservative market with lower growth
const conservativeScenario = generateRandomScenario({
  incomeGrowthMean: 0.02,              // 2% income growth
  expenseGrowthMean: 0.025,            // 2.5% expense growth
  occupancyMean: 0.88,                 // 88% occupancy
  appreciationMean: 0.015,             // 1.5% appreciation
  marketExpenseCorrelation: 0.5,       // Lower correlation
});
```

### Example 4: Scenario-Based Forecasting

```typescript
import { generateRandomScenarios, formatPercentage } from './utils/monteCarloRiskSimulation';

// Generate scenarios and forecast outcomes
const scenarios = generateRandomScenarios(1000);

// Group by scenario type
const byScenario = {
  recession: scenarios.filter(s => s.scenario === 'recession'),
  stagnant: scenarios.filter(s => s.scenario === 'stagnant'),
  stable: scenarios.filter(s => s.scenario === 'stable'),
  growth: scenarios.filter(s => s.scenario === 'growth'),
  boom: scenarios.filter(s => s.scenario === 'boom'),
};

// Calculate average metrics for each scenario type
Object.entries(byScenario).forEach(([type, scenarios]) => {
  const avgIncome = scenarios.reduce((sum, s) => sum + s.incomeGrowthRate, 0) / scenarios.length;
  const avgExpense = scenarios.reduce((sum, s) => sum + s.expenseGrowthRate, 0) / scenarios.length;
  
  console.log(`${type.toUpperCase()} (${scenarios.length} scenarios):`);
  console.log(`  Avg Income Growth: ${formatPercentage(avgIncome * 100)}`);
  console.log(`  Avg Expense Growth: ${formatPercentage(avgExpense * 100)}`);
  console.log(`  Spread: ${formatPercentage((avgIncome - avgExpense) * 100)}`);
});
```

### Example 5: Correlation Verification

```typescript
import { generateRandomScenarios } from './utils/monteCarloRiskSimulation';

// Generate large sample for correlation verification
const scenarios = generateRandomScenarios(10000);

// Extract data
const marketFactors = scenarios.map(s => s.marketFactor);
const incomeGrowths = scenarios.map(s => s.incomeGrowthRate);
const expenseGrowths = scenarios.map(s => s.expenseGrowthRate);

// Calculate empirical correlation
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b) / n;
  const meanY = y.reduce((a, b) => a + b) / n;
  
  const cov = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) / n;
  const varX = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) / n;
  const varY = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0) / n;
  
  return cov / (Math.sqrt(varX) * Math.sqrt(varY));
}

const corrMarketIncome = calculateCorrelation(marketFactors, incomeGrowths);
const corrMarketExpense = calculateCorrelation(marketFactors, expenseGrowths);

console.log('Empirical Correlations:');
console.log(`  Market-Income: ${corrMarketIncome.toFixed(3)} (target: 0.700)`);
console.log(`  Market-Expense: ${corrMarketExpense.toFixed(3)} (target: 0.600)`);
```

---

## Scenario Labels

### Market Factor Ranges

| Market Factor | Scenario | Probability* | Description |
|--------------|----------|-------------|-------------|
| < -1.5 | Recession | ~6.7% | Severe downturn |
| -1.5 to -0.5 | Stagnant | ~24.2% | Weak market |
| -0.5 to 0.5 | Stable | ~38.3% | Normal conditions |
| 0.5 to 1.5 | Growth | ~24.2% | Strong market |
| > 1.5 | Boom | ~6.7% | Exceptional growth |

\* Based on standard normal distribution

### Typical Characteristics by Scenario

**Recession** (Market Factor < -1.5):
- Income Growth: ~0-1%
- Expense Growth: ~1-2%
- Negative spread (expenses > income)
- High vacancy risk

**Stagnant** (Market Factor -1.5 to -0.5):
- Income Growth: ~1.5-2.5%
- Expense Growth: ~2-3%
- Marginal performance
- Below-average occupancy

**Stable** (Market Factor -0.5 to 0.5):
- Income Growth: ~2.5-3.5%
- Expense Growth: ~2.5-3.5%
- Balanced performance
- Normal occupancy

**Growth** (Market Factor 0.5 to 1.5):
- Income Growth: ~3.5-5%
- Expense Growth: ~3-4%
- Positive spread
- Above-average occupancy

**Boom** (Market Factor > 1.5):
- Income Growth: ~5-7%+
- Expense Growth: ~3.5-5%
- Strong positive spread
- High occupancy

---

## Integration with Monte Carlo Simulation

The `generateRandomScenario()` function can be used alongside Monte Carlo simulation for scenario-based analysis:

```typescript
import {
  generateRandomScenario,
  runMonteCarloSimulation,
  createDefaultUncertaintyParameters,
} from './utils/monteCarloRiskSimulation';

// Generate a specific market scenario
const marketScenario = generateRandomScenario({
  marketIncomeCorrelation: 0.8,  // Strong market influence
});

// Use scenario parameters for Monte Carlo simulation
const uncertaintyParams = createDefaultUncertaintyParameters(baseState);
uncertaintyParams.rentGrowthDistribution = {
  type: 'normal',
  mean: marketScenario.incomeGrowthRate,  // Use scenario income growth
  stdDev: 0.01,
};
uncertaintyParams.expenseGrowthDistribution = {
  type: 'normal',
  mean: marketScenario.expenseGrowthRate,  // Use scenario expense growth
  stdDev: 0.008,
};

// Run simulation with scenario-specific parameters
const results = await runMonteCarloSimulation({
  baseState,
  uncertaintyParameters: uncertaintyParams,
  simulations: 10000,
  yearsToProject: 10,
});

console.log(`Analysis for ${marketScenario.scenario} scenario:`);
console.log(`  Expected Return: ${results.distributions.annualizedReturn.mean}%`);
```

---

## Best Practices

### 1. Use Large Samples for Correlation Verification

```typescript
// ❌ BAD: Too few samples
const scenarios = generateRandomScenarios(10);  // Correlation will be noisy

// ✅ GOOD: Sufficient samples
const scenarios = generateRandomScenarios(1000);  // Reliable correlation
```

### 2. Customize Parameters for Specific Markets

```typescript
// ✅ Hot coastal market
const coastalScenario = generateRandomScenario({
  incomeGrowthMean: 0.05,
  appreciationMean: 0.04,
  occupancyMean: 0.96,
});

// ✅ Stable midwest market
const midwestScenario = generateRandomScenario({
  incomeGrowthMean: 0.025,
  appreciationMean: 0.02,
  occupancyMean: 0.90,
});
```

### 3. Consider Independent Occupancy

Occupancy is independent by design because:
- Property-specific management quality
- Local competition factors
- Not directly tied to broader market
- Can be high even in weak markets

### 4. Document Correlation Assumptions

```typescript
const scenario = generateRandomScenario({
  marketIncomeCorrelation: 0.8,  // Higher due to:
  // - Strong local market correlation observed
  // - Luxury segment more market-sensitive
  // - Historical data supports 0.75-0.85 range
  
  marketExpenseCorrelation: 0.5,  // Lower due to:
  // - Many fixed-rate contracts
  // - Long-term service agreements
  // - Less market sensitivity
});
```

---

## Performance

| Operation | Complexity | Time |
|-----------|-----------|------|
| `generateRandomScenario()` | O(1) | ~0.01ms |
| `generateRandomScenarios(1000)` | O(n) | ~10ms |
| `generateRandomScenarios(10000)` | O(n) | ~100ms |

Very efficient for generating thousands of scenarios.

---

## Comparison with Monte Carlo Simulation

| Feature | generateRandomScenario() | Monte Carlo Simulation |
|---------|-------------------------|----------------------|
| **Purpose** | Single scenario generation | Full probabilistic analysis |
| **Speed** | Instant (~0.01ms) | Seconds (for 10k sims) |
| **Output** | Single scenario snapshot | Complete distributions |
| **Use Case** | Quick scenario testing | Comprehensive risk analysis |
| **Correlation** | Market-driven | Income-expense correlation |
| **Complexity** | Simple | Comprehensive |

**When to Use:**
- **generateRandomScenario()**: Quick what-if analysis, scenario planning, sensitivity testing
- **Monte Carlo Simulation**: Full investment analysis, risk assessment, decision-making

---

## Future Enhancements

Potential additions:
1. **Time-varying correlations**: Correlation changes over time
2. **Multi-property correlation**: Portfolio-level market factors
3. **Regional factors**: Geographic market conditions
4. **Seasonal patterns**: Quarterly/monthly variations
5. **Economic indicators**: GDP, unemployment correlation
6. **Custom distribution types**: Beyond normal distributions

---

## References

- Cholesky Decomposition for correlation
- Box-Muller Transform for normal generation
- Standard normal distribution properties
- Real estate market correlation research

---

*Scenario Generation Documentation - October 7, 2025*  
*Part of Dreamery Real Estate Platform Phase 2*

