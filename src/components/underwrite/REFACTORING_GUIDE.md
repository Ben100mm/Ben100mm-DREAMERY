# UnderwritePage Refactoring Guide

## Overview

This document describes the refactoring work completed for the UnderwritePage component (originally 9,700+ lines) and provides guidance on continuing the refactoring process.

## Completed Work

### Phase 1: Setup ✅
- Created directory structure: `src/components/underwrite/`
- Created subdirectories: `hooks/` for custom hooks

### Phase 2: Type Definitions & Constants ✅
- **`types.ts`**: All TypeScript interfaces and type definitions
  - Property types (PropertyType, OperationType, OfferType)
  - Loan interfaces (LoanTerms, SubjectToLoan, HybridInputs, etc.)
  - Income/expense interfaces
  - Advanced analysis interfaces
  - Main DealState interface
  
- **`constants.ts`**: Default values and initial state
  - defaultState with all default values
  - getCurrentDate() helper function

- **`utils.ts`**: Utility functions
  - Currency formatting (parseCurrency, formatCurrency)
  - Date formatting (formatDateToMMDDYY, getTodayFormatted)
  - Property/financing helpers (getOperationTypeOptions, getOfferTypeOptions)
  - Loan calculations (monthlyPayment, buildAmortization, buildSubjectToAmortization)
  - Income/expense calculations (computeIncome, computeGrossPotentialIncome, computeLoanAmount)
  - Capital events (generateCapitalEventTemplates, calculateCapitalEventMetrics)
  - Confidence intervals (calculateConfidenceInterval, formatConfidenceInterval)

### Phase 3: Custom Hooks ✅
- **`hooks/useValidation.ts`**: Validation logic
  - `validateAndNormalizeState()` - Ensures valid property/operation/offer type combinations
  - `useValidation()` - Hook exposing validation functions

- **`hooks/useCalculations.ts`**: Financial calculations
  - All computed metrics (income, expenses, cash flow, NOI, cap rate, CoC, DSCR)
  - Amortization schedule generation
  - Confidence interval calculations
  - Fully memoized for performance

- **`hooks/useUnderwriteState.ts`**: State management
  - State initialization from localStorage
  - State persistence to localStorage
  - State update handlers
  - Property/operation/offer type change handlers with validation
  - Snackbar management

### Phase 4: Example Components ✅
- **`BasicInfoSection.tsx`**: Basic property information inputs
  - Agent/Owner, Property Address
  - Email, Phone
  - Analysis Date, Listed Price, Purchase Price, % Difference
  - Property Type, Operation Type, Finance Type selects

- **`ResultsSection.tsx`**: Calculated metrics display
  - Monthly/Annual Income & Expenses
  - Cash Flow
  - NOI, Cap Rate
  - CoC Return, DSCR
  - Loan Amount, Cash Invested, Equity

- **`index.ts`**: Central export point for all components and utilities

## Architecture Pattern

### Component Structure
```typescript
interface SectionProps {
  state: DealState;
  onUpdate: (field: keyof DealState, value: any) => void;
  setState: React.Dispatch<React.SetStateAction<DealState>>;
  // Additional props as needed (e.g., calculated values)
}

export const SectionName: React.FC<SectionProps> = ({
  state,
  onUpdate,
  setState,
}) => {
  return (
    <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Section Title</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Section content */}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
```

### Main Page Pattern
```typescript
const UnderwritePage: React.FC = () => {
  // Use custom hooks
  const { state, updateState, setState } = useUnderwriteState();
  const calculations = useCalculations(state);
  
  // Update handler
  const handleUpdate = (field: keyof DealState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };
  
  return (
    <Container>
      <BasicInfoSection 
        state={state} 
        onUpdate={handleUpdate}
        setState={setState}
      />
      <ResultsSection {...calculations} />
      {/* Other sections */}
    </Container>
  );
};
```

## Remaining Work

### Sections to Extract (Priority Order)

1. **LoanSection.tsx** - Loan terms and calculations
   - Down payment, loan amount, interest rate
   - Amortization settings
   - IO periods, balloon payments
   - Closing costs, rehab costs

2. **SubjectToSection.tsx** - Subject-to financing
   - Existing loan details
   - Payment to seller
   - Amortization of existing loans

3. **HybridFinancingSection.tsx** - Hybrid financing options
   - Combined subject-to + new loan
   - Hybrid loan calculations

4. **IncomeSection.tsx** - Income inputs by property type
   - SFR: Monthly rent
   - Multi-family: Unit rents
   - STR: Nightly rates, occupancy
   - Enhanced STR: Channel fees, dynamic pricing
   - Office/Retail: SF calculations
   - Hotel: ADR, occupancy, seasonality

5. **OperatingExpensesSection.tsx** - Operating expense inputs
   - Fixed expenses (taxes, insurance, utilities, etc.)
   - Variable expenses (maintenance, vacancy, management, CapEx, OpEx)
   - Expense calculations

6. **ProFormaSection.tsx** - Pro forma presets
   - Conservative/Moderate/Aggressive presets
   - Custom presets
   - Sensitivity analysis
   - Benchmarks

7. **AdvancedAnalysisSection.tsx** - Advanced metrics
   - IRR calculations
   - Exit strategies
   - Refinance scenarios
   - Risk analysis
   - Tax implications
   - Confidence intervals

8. **AppreciationSection.tsx** - Appreciation projections
   - Appreciation rate
   - Years of appreciation
   - Future property value
   - Refinance potential

9. **AmortizationSection.tsx** - Amortization schedules
   - Full amortization table
   - Principal/interest breakdown
   - Remaining balance tracking

10. **SettingsSection.tsx** - Calculator settings
    - Payback calculation method
    - Reserves calculation
    - Variable expense settings
    - Display preferences

### How to Extract a Section

1. **Identify the section** in the original UnderwritePage.tsx
   - Search for the Accordion with the section name
   - Note the start and end of the section

2. **Create the component file** in `src/components/underwrite/`
   ```bash
   touch src/components/underwrite/SectionName.tsx
   ```

3. **Copy the section JSX** from UnderwritePage.tsx

4. **Add component structure**:
   ```typescript
   import React from "react";
   import { /* MUI imports */ } from "@mui/material";
   import { DealState } from "./types";
   import { /* utility functions */ } from "./utils";
   
   interface SectionNameProps {
     state: DealState;
     onUpdate: (field: keyof DealState, value: any) => void;
     setState: React.Dispatch<React.SetStateAction<DealState>>;
   }
   
   export const SectionName: React.FC<SectionNameProps> = ({
     state,
     onUpdate,
     setState,
   }) => {
     return (
       {/* Paste section JSX here */}
     );
   };
   ```

5. **Update state references**:
   - Replace `setState((prev) => ({ ...prev, ... }))` with `onUpdate(field, value)`
   - Replace `state.` references to use the `state` prop

6. **Extract section-specific functions** to `utils.ts` if needed

7. **Add component export** to `index.ts`:
   ```typescript
   export { SectionName } from "./SectionName";
   ```

8. **Test the component** independently

9. **Commit the changes**:
   ```bash
   git add -A
   git commit -m "Extract SectionName component"
   ```

## Benefits of This Refactoring

1. **Maintainability**: Each section is now a focused, manageable component
2. **Testability**: Components can be tested in isolation
3. **Reusability**: Components can be reused in other contexts
4. **Performance**: Calculations are memoized to prevent unnecessary recomputation
5. **Type Safety**: Full TypeScript support with comprehensive type definitions
6. **State Management**: Centralized state management with localStorage persistence
7. **Developer Experience**: Easier to find and modify specific sections

## File Size Reduction

- **Before**: UnderwritePage.tsx = 9,700 lines
- **After (when complete)**: 
  - Main orchestrator: ~300 lines
  - 12 section components: ~200-400 lines each
  - 3 custom hooks: ~100-200 lines each
  - Utils/types/constants: ~500 lines each

Total lines remain similar, but organized into manageable, focused files.

## Testing Strategy

### Unit Tests
- Test utility functions independently
- Test custom hooks with React Testing Library
- Test components with user interactions

### Integration Tests
- Test full UnderwritePage with all sections
- Test state persistence/restoration
- Test validation logic

### Example Test
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useCalculations } from './hooks/useCalculations';
import { defaultState } from './constants';

describe('useCalculations', () => {
  it('calculates monthly cash flow correctly', () => {
    const { result } = renderHook(() => useCalculations(defaultState));
    expect(result.current.monthlyCashFlow).toBeGreaterThan(0);
  });
});
```

## Next Steps

1. Continue extracting sections in priority order (see above)
2. Update main UnderwritePage.tsx to use extracted components
3. Add unit tests for each component
4. Add integration tests for the full page
5. Update documentation as sections are extracted
6. Consider adding Storybook for component documentation

## Questions?

If you have questions about the refactoring pattern or need clarification on how to extract a specific section, please reach out or refer to the existing `BasicInfoSection.tsx` and `ResultsSection.tsx` as examples.

