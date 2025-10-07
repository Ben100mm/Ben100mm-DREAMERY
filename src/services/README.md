# Services Directory

This directory contains business logic services that encapsulate complex calculations and operations.

## UnderwriteCalculationService

A centralized service for all real estate deal calculations used in the underwriting process.

### Features

- **Singleton Pattern**: Ensures single instance across the application
- **Pure Functions**: All methods are pure functions that take state and return calculated values
- **Comprehensive Calculations**: Covers all aspects of deal analysis
- **Type-Safe**: Fully typed with TypeScript
- **Testable**: Easy to unit test with clear inputs and outputs
- **Performance**: Results can be memoized by consumers

### Usage

```typescript
import { underwriteCalculationService } from './services/underwriteCalculationService';
import { DealState } from './components/underwrite/types';

// Calculate a single metric
const monthlyIncome = underwriteCalculationService.calculateMonthlyIncome(state);
const cocReturn = underwriteCalculationService.calculateCoC(state);
const capRate = underwriteCalculationService.calculateCapRate(state);

// Calculate grouped metrics
const basicMetrics = underwriteCalculationService.calculateBasicMetrics(state);
const noiMetrics = underwriteCalculationService.calculateNOIMetrics(state);
const returnMetrics = underwriteCalculationService.calculateReturnMetrics(state);
const equityMetrics = underwriteCalculationService.calculateEquityMetrics(state);

// Calculate everything at once
const analysis = underwriteCalculationService.calculateDealAnalysis(state);
console.log(analysis.monthlyCashFlow);
console.log(analysis.cocReturn);
console.log(analysis.capRate);
```

### Available Methods

#### Basic Calculations
- `calculateMonthlyIncome(state)` - Monthly rental/operational income
- `calculateGrossPotentialIncome(state)` - Income at 100% occupancy
- `calculateMonthlyFixedOps(state)` - Fixed operating expenses
- `calculateMonthlyVariableOps(state)` - Variable operating expenses
- `calculateMonthlyDebtService(state)` - Total debt service
- `calculateMonthlyExpenses(state)` - Total expenses
- `calculateBasicMetrics(state)` - All basic metrics at once

#### NOI & Cap Rate
- `calculateMonthlyNOI(state)` - Net Operating Income (monthly)
- `calculateAnnualNOI(state)` - Net Operating Income (annual)
- `calculateCapRate(state)` - Capitalization Rate
- `calculateNOIMetrics(state)` - All NOI metrics at once

#### Cash Flow
- `calculateMonthlyCashFlow(state)` - Monthly cash flow after all expenses
- `calculateAnnualCashFlow(state)` - Annual cash flow

#### Returns
- `calculateCoC(state)` - Cash on Cash Return
- `calculateDSCR(state)` - Debt Service Coverage Ratio
- `calculateROE(state)` - Return on Equity
- `calculateLTV(state)` - Loan to Value ratio
- `calculateReturnMetrics(state)` - All return metrics at once

#### Equity & Investment
- `calculateLoanAmount(state)` - Total loan amount
- `calculateEquity(state)` - Equity in the deal
- `calculateEquityPercentage(state)` - Equity as percentage
- `calculateTotalCashInvested(state)` - Total cash required
- `calculateEquityMetrics(state)` - All equity metrics at once

#### Amortization
- `calculateAmortizationSchedule(state)` - Full amortization table
- `calculateRemainingBalance(state, paymentNumber)` - Balance at specific payment
- `calculateTotalInterest(state)` - Total interest over loan term

#### Advanced Metrics
- `calculateIRR(state)` - Internal Rate of Return (placeholder)
- `calculateMOIC(state)` - Multiple on Invested Capital
- `calculateEquityMultiple(state)` - Equity multiple

#### Confidence Intervals
- `calculateCoCWithConfidence(state)` - CoC with confidence bands
- `calculateNOIWithConfidence(state)` - NOI with confidence bands
- `calculateCapRateWithConfidence(state)` - Cap Rate with confidence bands

#### Validation
- `validateDealState(state)` - Validates deal state for calculations

### Return Types

The service provides several comprehensive return types:

- `BasicMetrics` - Income, expenses, cash flow
- `NOIMetrics` - NOI and cap rate calculations
- `ReturnMetrics` - CoC, DSCR, ROE, LTV
- `EquityMetrics` - Loan, equity, cash invested
- `IRRMetrics` - IRR and equity multiple (planned)
- `DealAnalysis` - All metrics combined

### Testing

Unit tests are available in `__tests__/underwriteCalculationService.test.ts`:

```bash
npm test underwriteCalculationService
```

### Integration with React Hooks

The service is consumed by the `useCalculations` hook, which adds memoization:

```typescript
import { useCalculations } from './components/underwrite/hooks/useCalculations';

function MyComponent() {
  const { state } = useUnderwriteState();
  const calculations = useCalculations(state); // Memoized
  
  return (
    <div>
      <p>Monthly Cash Flow: {calculations.monthlyCashFlow}</p>
      <p>CoC Return: {calculations.cocReturn}%</p>
    </div>
  );
}
```

### Benefits

1. **Single Source of Truth**: All calculations in one place
2. **Consistency**: Same calculations used everywhere
3. **Testability**: Easy to test without React components
4. **Maintainability**: Changes to calculations happen in one place
5. **Reusability**: Can be used in React components, Node.js scripts, API endpoints, etc.
6. **Type Safety**: Full TypeScript support with clear interfaces
7. **Documentation**: Self-documenting through method names and types

### Future Enhancements

- Complete IRR calculation with year-by-year cash flows
- Sensitivity analysis methods
- Scenario comparison methods
- Export to Excel/PDF functionality
- Batch calculation for multiple deals

