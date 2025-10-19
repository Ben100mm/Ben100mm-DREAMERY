# Essentials Calculator System

This is an exact copy of the Essentials mode Calculator from the Dreamery platform. It provides a simplified real estate investment calculator with progressive disclosure modes.

## Features

### Essentials Mode
- **Basic property inputs**: Property price, down payment, interest rate, loan term
- **Simple financing options**: Cash, Conventional, FHA loans
- **Preset operating expenses**: Pre-configured expense categories based on property type
- **Buy & Hold strategy only**: Focused on rental property analysis
- **Key metrics**: Cash flow, Cash on Cash return, Cap Rate, ROI
- **Basic amortization schedule**: First 12 months summary
- **Break-even analysis**: Minimum rent required
- **Property type support**: Single Family Residential, Multi Family
- **Simple rent input**: Monthly or annual rent entry
- **Basic expense categories**: Property tax, insurance, maintenance, management, utilities, vacancy

### Calculator Modes
- **Essential**: Quick analysis with simplified inputs
- **Standard**: Comprehensive analysis (upgrade prompt shown)
- **Professional**: Full featured toolkit (upgrade prompt shown)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Basic Calculator Flow

1. **Select Calculator Mode**: Choose between Essential, Standard, or Professional modes
2. **Enter Property Information**: Property price, type, and operation type
3. **Configure Financing**: Select financing type and enter loan details
4. **Set Rental Income**: Enter monthly or annual rent
5. **Review Operating Expenses**: Use preset values or customize (Essential mode uses presets)
6. **View Results**: Analyze key metrics, cash flow, and amortization schedule

### Key Metrics Calculated

- **Monthly Cash Flow**: Net income after all expenses and mortgage payment
- **Cash on Cash Return**: Annual return on cash invested
- **Cap Rate**: Net operating income divided by property price
- **ROI**: Return on investment including appreciation
- **Break-Even Rent**: Minimum rent required to cover all expenses
- **Gross Rent Multiplier**: Property price divided by annual rent
- **Debt Service Coverage Ratio**: NOI divided by mortgage payment

### Features by Mode

#### Essentials Mode
- Basic property inputs only
- Limited financing options (Cash, Conventional, FHA)
- Preset operating expenses
- Buy & Hold strategy only
- SFR and Multi Family property types
- Basic amortization schedule (first 12 months)
- Key metrics display

#### Standard Mode (Upgrade Prompt)
- All financing types
- Custom expense categories
- All property strategies
- All property types
- Full amortization schedule
- Advanced analysis features

#### Professional Mode (Upgrade Prompt)
- All Standard features
- Capital events planning
- Tax-deferred exchanges
- Advanced modeling
- Monte Carlo simulations
- Scenario analysis

## File Structure

```
src/
├── components/
│   ├── EssentialsCalculator.tsx          # Main calculator component
│   ├── calculator/
│   │   ├── ModeSelector.tsx              # Mode selection component
│   │   └── UpgradePrompt.tsx             # Upgrade prompts
│   └── index.ts                          # Component exports
├── hooks/
│   └── useCalculatorMode.ts              # Calculator mode state management
├── types/
│   └── calculatorMode.ts                 # Type definitions and configurations
├── pages/
│   └── EssentialsCalculatorPage.tsx      # Demo page
└── theme.ts                              # Brand colors and theme
```

## Component Architecture

### EssentialsCalculator
The main calculator component that handles:
- Input state management
- Calculation logic
- UI rendering
- Mode-specific feature display

### ModeSelector
Handles calculator mode switching with:
- Mode selection UI
- Feature descriptions
- Tooltips with mode details

### UpgradePrompt
Shows upgrade prompts for advanced features when in Essential mode

### useCalculatorMode Hook
Manages calculator mode state with:
- Local storage persistence
- Mode validation
- Upgrade logic

## Customization

### Adding New Property Types
1. Update the `propertyType` options in `EssentialsCalculator.tsx`
2. Add preset expenses in `PRESET_EXPENSES` object
3. Update the upgrade prompt logic if needed

### Modifying Calculations
All calculation logic is in the `EssentialsCalculator` component:
- `monthlyPayment`: Mortgage payment calculation
- `monthlyCashFlow`: Cash flow calculation
- `cashOnCashReturn`: Return on cash invested
- `capRate`: Capitalization rate
- `roi`: Return on investment

### Styling
The theme is defined in `theme.ts` with brand colors and Material-UI theme overrides.

## Dependencies

- **React**: UI framework
- **Material-UI**: Component library
- **TypeScript**: Type safety
- **React Router**: Navigation (for demo page)

## License

This is a copy of the Essentials mode Calculator from the Dreamery platform for educational and development purposes.