# Standard Calculator - Real Estate Investment Analysis Tool

An exact copy of the Standard mode Calculator for comprehensive real estate investment analysis. This calculator provides detailed financial modeling capabilities for various property types and investment strategies.

## Features

### Core Functionality
- **Comprehensive Property Analysis**: Support for SFR, Multi Family, Commercial, Land, Hotel, Office, Retail, Condo, and Townhouse properties
- **Multiple Investment Strategies**: Buy & Hold, Fix & Flip, Short Term Rental, Rental Arbitrage, and BRRRR
- **Advanced Financing Options**: Cash, Conventional, FHA, VA, USDA, Subject-To, Seller Finance, Hybrid, Hard Money, Private, Line of Credit, SBA, and DSCR
- **Detailed Expense Tracking**: Custom operating expense categories with preset and manual inputs
- **Real-time Calculations**: Live updates of all financial metrics as inputs change

### Financial Metrics
- **Cash Flow Analysis**: Monthly and annual cash flow calculations
- **Return Metrics**: Cash-on-Cash Return, Cap Rate, ROI, IRR, and MOIC
- **Break-even Analysis**: Occupancy rates and rent requirements
- **Appreciation Modeling**: Future value projections with customizable growth rates
- **Amortization Schedules**: Complete loan payment breakdowns

### User Interface
- **Accordion-based Layout**: Organized sections that expand based on selections
- **Mode Selector**: Toggle between Essential, Standard, and Professional modes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Input validation with helpful error messages
- **Professional Styling**: Clean, modern interface with Material-UI components

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/standard-calculator.git
cd standard-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Basic Workflow
1. **Select Calculator Mode**: Choose between Essential, Standard, or Professional modes
2. **Enter Property Details**: Fill in basic information including property type, operation type, and offer type
3. **Input Financial Data**: Enter purchase price, financing details, and income projections
4. **Configure Expenses**: Set up operating expenses, taxes, insurance, and other costs
5. **Review Results**: Analyze the calculated metrics and financial projections

### Key Sections

#### Basic Info
- Property address and contact information
- Property type selection
- Operation type (investment strategy)
- Offer type (financing method)
- Purchase price and listing details

#### Income
- Monthly and yearly rent inputs
- Rent growth rate projections
- Multi-family unit calculations
- Short-term rental parameters

#### Operating Expenses
- Property taxes and insurance
- Utilities (gas, electric, water, sewer)
- Maintenance and capital expenditures
- Management and vacancy allowances
- HOA fees and other miscellaneous costs

#### Financing
- Down payment and loan amount
- Interest rate and amortization period
- Closing costs and rehab expenses
- Points and other loan fees

#### Appreciation Calculator
- Annual appreciation rate
- Holding period projections
- Future value calculations

### Advanced Features

#### Conditional Sections
- **Subject-To Financing**: Additional inputs for existing mortgage details
- **Hybrid Financing**: Combination of cash, loan, and seller financing
- **Fix & Flip**: Renovation costs, holding period, and selling expenses
- **BRRRR**: Refinance parameters and cash-out calculations

#### Results Dashboard
- **KPI Grid**: Key performance indicators in an easy-to-read format
- **Summary Table**: Comprehensive deal breakdown
- **Amortization Schedule**: Detailed loan payment schedule
- **Cash Flow Projections**: Multi-year financial forecasts

## File Structure

```
src/
├── components/
│   ├── StandardCalculator.tsx    # Main calculator component
│   ├── ModeSelector.tsx         # Mode selection component
│   └── UpgradePrompt.tsx        # Upgrade prompts
├── utils/
│   ├── financeUtils.ts          # Financial calculation functions
│   └── theme.ts                 # Theme and styling configuration
├── types/
│   └── calculator.ts            # TypeScript type definitions
└── index.tsx                    # Application entry point
```

## Key Components

### StandardCalculator
The main component that orchestrates the entire calculator interface. It manages state, handles user interactions, and displays results.

### ModeSelector
Allows users to switch between Essential, Standard, and Professional calculator modes with detailed feature descriptions.

### UpgradePrompt
Displays upgrade prompts when users try to access features not available in their current mode.

### Finance Utils
Comprehensive collection of financial calculation functions including:
- Loan calculations (PMT, PV, FV, etc.)
- Cash flow analysis
- Return metrics (CoC, Cap Rate, ROI, IRR, MOIC)
- Amortization schedules
- Break-even calculations

## Customization

### Theme Configuration
The calculator uses a comprehensive theme system defined in `theme.ts`:
- Brand colors and gradients
- Typography settings
- Spacing and border radius
- Component-specific styles
- Animation configurations

### Adding New Features
1. Define new input types in the type definitions
2. Add calculation functions to `financeUtils.ts`
3. Update the main component to include new sections
4. Add appropriate validation and error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## Changelog

### Version 1.0.0
- Initial release with complete Standard mode functionality
- All core features implemented
- Responsive design and professional styling
- Comprehensive financial calculations
- Mode-based feature access

## Roadmap

- [ ] Add data persistence (localStorage/sessionStorage)
- [ ] Implement export functionality (PDF, Excel)
- [ ] Add more property types and strategies
- [ ] Enhanced mobile experience
- [ ] Integration with external APIs
- [ ] Advanced reporting features
- [ ] Multi-language support