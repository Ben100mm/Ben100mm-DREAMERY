# Calculation Documentation

**Version:** 1.0  
**Last Updated:** October 7, 2025  
**Status:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Mortgage & Loan Calculations](#mortgage--loan-calculations)
3. [Property Valuation Calculations](#property-valuation-calculations)
4. [Cash Flow Calculations](#cash-flow-calculations)
5. [Monte Carlo Simulations](#monte-carlo-simulations)
6. [Advanced Financial Calculations](#advanced-financial-calculations)
7. [Tax Calculations](#tax-calculations)
8. [Risk Analysis](#risk-analysis)
9. [Assumptions](#assumptions)
10. [Limitations](#limitations)
11. [References](#references)

---

## Overview

This document provides comprehensive documentation for all financial formulas and calculations used in the Dreamery real estate investment platform. Each section includes the mathematical formula, implementation details, example calculations, and relevant assumptions.

**Key Calculation Categories:**
- Mortgage payments and amortization schedules
- Property valuation and appreciation
- Cash flow projections and ROI metrics
- Probabilistic Monte Carlo simulations
- Tax implications and deductions
- Risk scoring and stress testing

---

## Mortgage & Loan Calculations

### Monthly Payment Calculation (PMT)

**Formula:**
```
PMT = P × [r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
- PMT = Monthly payment
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate / 12)
- n = Total number of payments (years × 12)
```

**Special Cases:**
- **Interest-Only Loan:** `PMT = P × r`
- **Zero Interest:** `PMT = P / n`

**Implementation:**
```typescript
function monthlyPayment(
  loanAmount: number,
  annualRatePct: number,
  years: number,
  interestOnly: boolean
): number {
  if (loanAmount <= 0 || years <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  
  if (interestOnly) {
    return loanAmount * monthlyRate;
  }
  
  if (monthlyRate === 0) {
    return loanAmount / (years * 12);
  }
  
  const n = years * 12;
  return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / 
         (Math.pow(1 + monthlyRate, n) - 1);
}
```

**Example Calculation:**

Given:
- Loan amount: $400,000
- Annual interest rate: 6.5%
- Term: 30 years

```
r = 6.5% / 12 = 0.00541667
n = 30 × 12 = 360 months

PMT = $400,000 × [0.00541667 × (1.00541667)^360] / [(1.00541667)^360 - 1]
    = $400,000 × [0.00541667 × 6.8404] / [6.8404 - 1]
    = $400,000 × 0.03705 / 5.8404
    = $2,528.27/month
```

### Remaining Principal After Payments

**Formula:**
```
B_k = PV × (1 + r)^k - PMT × [(1 + r)^k - 1] / r

Where:
- B_k = Balance after k payments
- PV = Original principal
- r = Monthly interest rate
- k = Number of payments made
- PMT = Monthly payment
```

**Hybrid Interest-Only Loans:**

For loans with an interest-only period followed by amortization:

1. **During IO Period (k ≤ IO_period):**
   ```
   B_k = PV  (principal unchanged)
   ```

2. **After IO Period (k > IO_period):**
   ```
   amortizing_payments = k - IO_period
   amortizing_term = total_term - IO_period
   PMT_amort = pmt(PV, r, amortizing_term)
   
   B_k = PV × (1 + r)^amortizing_payments - PMT_amort × [(1 + r)^amortizing_payments - 1] / r
   ```

**Example Calculation:**

Given:
- Original loan: $400,000
- Interest rate: 6.5% annual
- 60 months interest-only, then 300 months amortizing
- Payments made: 120 months

```
IO period = 60 months
Amortizing payments = 120 - 60 = 60 months
Remaining amortizing term = 300 months

r = 0.065 / 12 = 0.00541667
PMT_amort = pmt(400000, 0.065, 25)  // 300/12 = 25 years
          = $2,706.82

B_120 = $400,000 × (1.00541667)^60 - $2,706.82 × [(1.00541667)^60 - 1] / 0.00541667
      = $400,000 × 1.3956 - $2,706.82 × 73.03
      = $558,240 - $197,684
      = $360,556
```

### Amortization Schedule

**Algorithm:**

For standard amortizing loans:
```
For each month i from 1 to n:
  Interest_i = Balance_(i-1) × monthly_rate
  Principal_i = PMT - Interest_i
  Balance_i = Balance_(i-1) - Principal_i
```

For hybrid IO loans:
```
# Interest-Only Phase
For month i from 1 to IO_period:
  Interest_i = Balance × monthly_rate
  Principal_i = 0
  Balance_i = Balance  (unchanged)

# Amortization Phase
For month i from (IO_period + 1) to n:
  Interest_i = Balance_(i-1) × monthly_rate
  Principal_i = PMT_amort - Interest_i
  Balance_i = Balance_(i-1) - Principal_i
```

---

## Property Valuation Calculations

### Price Per Square Foot

**Formula:**
```
Price per sqft = Purchase Price / Square Footage
```

**Example:**
```
Property price: $850,000
Square footage: 1,850 sqft

Price per sqft = $850,000 / 1,850
               = $459.46/sqft
```

### Property Appreciation

**Formula:**
```
Future Value = Present Value × (1 + appreciation_rate)^years
```

**Example:**
```
Purchase price: $500,000
Appreciation rate: 4% per year
Years: 5

Future Value = $500,000 × (1.04)^5
             = $500,000 × 1.2167
             = $608,326
```

### After Repair Value (ARV)

**Formula:**
```
ARV = Purchase Price × (1 + appreciation_multiplier)

Or for fix-and-flip:
ARV = Comparable Sales Average
Maximum Allowable Offer = (ARV × 0.70) - Repair Costs
```

**Example:**
```
Purchase price: $300,000
Repair costs: $50,000
ARV (based on comps): $450,000
Desired profit margin: 30%

MAO = (ARV × 0.70) - Repair Costs
    = ($450,000 × 0.70) - $50,000
    = $315,000 - $50,000
    = $265,000 (maximum offer)
```

---

## Cash Flow Calculations

### Gross Rental Income

**Single Family Rental:**
```
Gross Monthly Income = Monthly Rent + Other Income
Annual Gross Income = Gross Monthly Income × 12
```

**Multi-Family:**
```
Gross Monthly Income = Σ(Unit_i Rent) + Other Income
```

**Short-Term Rental:**
```
Gross Monthly Income = (Nightly Rate × Average Nights Booked) + 
                       Cleaning Fees + Laundry + Activities + Other
```

### Net Operating Income (NOI)

**Formula:**
```
NOI = Gross Income - Operating Expenses - Vacancy Loss

Where:
Operating Expenses = Fixed Expenses + (Gross Income × Variable Expense %)
Vacancy Loss = Gross Income × Vacancy Rate
```

**Example:**
```
Gross monthly rent: $3,500
Other monthly income: $200
Total gross income: $3,700/month = $44,400/year

Fixed expenses:
- Property tax: $600/month
- Insurance: $150/month
- HOA: $100/month
Total fixed: $850/month = $10,200/year

Variable expenses:
- Management: 8% of gross = $296/month
- Maintenance: 5% of gross = $185/month
- CapEx reserve: 5% of gross = $185/month
Total variable: 18% of gross = $666/month = $7,992/year

Vacancy: 5% of gross = $185/month = $2,220/year

NOI = $44,400 - $10,200 - $7,992 - $2,220
    = $23,988/year
    = $1,999/month
```

### Cash Flow After Debt Service

**Formula:**
```
Cash Flow = NOI - Total Debt Service

Where:
Total Debt Service = Primary Loan Payment + 
                     Subject-To Payments + 
                     Hybrid Loan Payment
```

**Example:**
```
NOI: $1,999/month
Primary loan payment: $1,265/month
Subject-to payment: $0
Hybrid loan payment: $0

Monthly Cash Flow = $1,999 - $1,265
                  = $734/month

Annual Cash Flow = $734 × 12
                 = $8,808/year
```

### Cash-on-Cash Return (CoC)

**Formula:**
```
CoC Return = (Annual Cash Flow / Total Cash Invested) × 100%

Where:
Total Cash Invested = Down Payment + 
                      Closing Costs + 
                      Repair Costs + 
                      Furniture (for STR) +
                      Other Initial Costs
```

**Example:**
```
Annual cash flow: $8,808
Down payment: $80,000
Closing costs: $5,000
Repair costs: $10,000
Total cash invested: $95,000

CoC Return = ($8,808 / $95,000) × 100%
           = 9.27%
```

### Debt Service Coverage Ratio (DSCR)

**Formula:**
```
DSCR = NOI / Total Debt Service

Interpretation:
- DSCR > 1.25: Strong (many lenders' requirement)
- DSCR = 1.00: Break-even
- DSCR < 1.00: Negative cash flow
```

**Example:**
```
Monthly NOI: $1,999
Monthly debt service: $1,265

DSCR = $1,999 / $1,265
     = 1.58

This indicates 58% more income than needed for debt service.
```

### Internal Rate of Return (IRR)

**Formula:**

IRR is the discount rate where NPV = 0:
```
0 = CF_0 + Σ [CF_t / (1 + IRR)^t]

Where:
- CF_0 = Initial investment (negative)
- CF_t = Cash flow in period t
- t = Time period
```

**Simplified Approximation:**
```
IRR ≈ [(Total Return / Initial Investment)^(1/years) - 1] × 100%
```

**Example:**
```
Initial investment: $100,000
Year 1 cash flow: $8,000
Year 2 cash flow: $8,500
Year 3 cash flow: $9,000
Year 4 cash flow: $9,500
Year 5 cash flow: $10,000 + $550,000 (sale)

Using approximation:
Total return = $8,000 + $8,500 + $9,000 + $9,500 + $560,000 = $595,000

IRR ≈ [($595,000 / $100,000)^(1/5) - 1] × 100%
    ≈ [(5.95)^0.2 - 1] × 100%
    ≈ 43.1%
```

### Cap Rate

**Formula:**
```
Cap Rate = (NOI / Property Value) × 100%
```

**Example:**
```
Annual NOI: $44,400
Property value: $500,000

Cap Rate = ($44,400 / $500,000) × 100%
         = 8.88%
```

---

## Monte Carlo Simulations

### Overview

Monte Carlo simulation uses random sampling to model uncertainty in real estate investments. The platform runs thousands of simulations with varied inputs to generate probability distributions of outcomes.

### Random Distributions

**1. Normal Distribution (Box-Muller Transform)**

**Formula:**
```
z_0 = √(-2 ln(u_1)) × cos(2π u_2)
x = μ + σ × z_0

Where:
- u_1, u_2 = Uniform random variables [0,1]
- μ = Mean
- σ = Standard deviation
- x = Normal random variable
```

**Use Cases:** Rent growth rates, appreciation rates, expense growth

**2. Triangular Distribution**

**Formula:**
```
If u < f:
  x = min + √(u × (max - min) × (mode - min))
Else:
  x = max - √((1 - u) × (max - min) × (max - mode))

Where:
- f = (mode - min) / (max - min)
- u = Uniform random [0,1]
```

**Use Cases:** Initial rent estimates, maintenance costs, vacancy rates

**3. Log-Normal Distribution**

**Formula:**
```
x = e^(μ + σ × z)

Where z is standard normal
```

**Use Cases:** Property values, insurance costs

**4. Uniform Distribution**

**Formula:**
```
x = min + u × (max - min)

Where u = Uniform random [0,1]
```

### Simulation Process

**Algorithm:**
```
1. Define base case parameters
2. Define uncertainty distributions for key inputs
3. For each simulation (typically 1,000-10,000):
   a. Sample random values from each distribution
   b. Run cash flow projection with sampled values
   c. Calculate key metrics (ROI, IRR, cash flow, equity)
   d. Store results
4. Calculate statistics on results:
   - Mean, median, standard deviation
   - Percentiles (10th, 25th, 75th, 90th)
   - Confidence intervals
   - Probability distributions
```

### Statistical Measures

**Mean:**
```
μ = Σ(x_i) / n
```

**Standard Deviation:**
```
σ = √[Σ(x_i - μ)^2 / n]
```

**Percentile (p-th):**
```
For sorted array of n values:
index = p × (n - 1)
value = array[floor(index)] × (1 - weight) + array[ceil(index)] × weight
where weight = index - floor(index)
```

**95% Confidence Interval:**
```
CI = μ ± 1.96 × (σ / √n)

Where:
- 1.96 is the z-score for 95% confidence
- n is sample size
```

**Example Simulation:**

```
Base Case:
- Purchase price: $500,000
- Initial rent: $3,000/month
- Appreciation: 4%/year
- Rent growth: 3%/year

Uncertainty Distributions:
- Appreciation: Normal(mean=4%, stddev=2%)
- Rent growth: Normal(mean=3%, stddev=2%)
- Initial rent: Triangular(min=$2,700, mode=$3,000, max=$3,300)
- Vacancy: Triangular(min=2%, mode=5%, max=8%)

Run 10,000 simulations

Results (example):
- Mean 5-year return: 45.2%
- Standard deviation: 12.8%
- 10th percentile: 28.5%
- 90th percentile: 62.1%
- Probability of positive return: 94.7%
- Probability of >50% return: 38.2%
```

---

## Advanced Financial Calculations

### BRRRR Strategy Calculations

**Formula:**
```
1. Purchase and Rehab:
   Total Investment = Purchase + Rehab + Closing Costs

2. Refinance:
   New Loan Amount = ARV × Refinance LTV%
   Cash Out = New Loan - Remaining Original Loan - Refinance Costs
   
3. Remaining Cash in Deal:
   Remaining Cash = Total Investment - Cash Out
   
4. New Cash-on-Cash Return:
   New CoC = (Annual Cash Flow / Remaining Cash) × 100%
```

**Example:**
```
Purchase: $200,000
Rehab: $50,000
Closing: $6,000
Total Investment: $256,000

ARV after rehab: $350,000
Refinance at 75% LTV: $262,500
Remaining loan: $180,000
Refinance costs: $5,000

Cash Out = $262,500 - $180,000 - $5,000 = $77,500

Remaining Cash = $256,000 - $77,500 = $178,500

Annual Cash Flow (post-refi): $12,000
New CoC = ($12,000 / $178,500) × 100% = 6.72%

If infinite return achieved:
Cash Out = $262,500 (all cash recovered)
Remaining Cash = -$6,500 (money out of deal)
```

### Fix & Flip Calculations

**Maximum Allowable Offer (70% Rule):**
```
MAO = (ARV × 0.70) - Repair Costs - Holding Costs

Projected Profit = ARV - MAO - Repair Costs - Holding Costs - 
                   Selling Costs - Financing Costs

ROI During Hold = (Profit / Total Investment) × 100%

Annualized ROI = [(1 + ROI)^(12/hold_months) - 1] × 100%
```

**Example:**
```
ARV: $400,000
Repair costs: $40,000
Holding costs (6 months): $10,000
Selling costs (6%): $24,000
Financing costs: $8,000

MAO = ($400,000 × 0.70) - $40,000 - $10,000
    = $280,000 - $50,000
    = $230,000

Total costs = $230,000 + $40,000 + $10,000 + $24,000 + $8,000
            = $312,000

Profit = $400,000 - $312,000 = $88,000

ROI = ($88,000 / $312,000) × 100% = 28.2%

Annualized ROI = [(1.282)^(12/6) - 1] × 100%
               = [(1.282)^2 - 1] × 100%
               = 64.4%
```

### Rental Arbitrage Calculations

**Formula:**
```
Monthly Profit = STR Revenue - Landlord Rent - Operating Expenses

Total Startup Costs = Security Deposit + First/Last Month + 
                      Furniture + Supplies + Repairs

Cash-on-Cash = (Annual Profit / Startup Costs) × 100%
```

**Example:**
```
Lease from landlord: $2,500/month
Average STR revenue: $4,200/month
Operating expenses: $800/month

Monthly profit = $4,200 - $2,500 - $800 = $900

Startup costs:
- Security deposit: $2,500
- First month: $2,500
- Last month: $2,500
- Furniture: $8,000
- Supplies: $1,500
Total: $17,000

Annual profit = $900 × 12 = $10,800
CoC = ($10,800 / $17,000) × 100% = 63.5%
```

### Sensitivity Analysis

**Formula:**
```
For each scenario variation:
  Adjusted Metric = Base Metric × (1 + percentage_change/100)
  Impact = Adjusted Metric - Base Metric
  Percentage Impact = (Impact / Base Metric) × 100%
```

**Example:**
```
Base Case Cash Flow: $800/month

Scenario 1: Rent -10%
New rent = $3,000 × 0.90 = $2,700
New cash flow = $500/month
Impact = -$300/month (-37.5%)

Scenario 2: Expenses +20%
New expenses = $1,500 × 1.20 = $1,800
New cash flow = $500/month
Impact = -$300/month (-37.5%)

Scenario 3: Vacancy +5%
Additional vacancy loss = $150/month
New cash flow = $650/month
Impact = -$150/month (-18.75%)
```

### Stress Testing

**Formula:**
```
Stress Scenario:
- Rent drop: X%
- Expense increase: Y%
- Vacancy increase: Z%
- Value drop: W%

Stressed Cash Flow = (Rent × (1 - X%)) × (1 - Vacancy% - Z%) - 
                     (Expenses × (1 + Y%))

Cash Flow Buffer = Stressed Cash Flow / Base Cash Flow

Risk Level:
- Buffer ≥ 0.8: Low Risk
- Buffer 0.6-0.8: Medium Risk
- Buffer 0.4-0.6: High Risk
- Buffer < 0.4: Critical Risk
```

**Example:**
```
Base Case:
- Monthly rent: $3,000
- Monthly expenses: $1,500
- Vacancy: 5%
- Cash flow: $850/month

Stress Test:
- Rent drop: 15%
- Expense increase: 25%
- Vacancy increase: +10% (total 15%)

Stressed rent = $3,000 × 0.85 = $2,550
Effective rent = $2,550 × 0.85 = $2,168
Stressed expenses = $1,500 × 1.25 = $1,875

Stressed cash flow = $2,168 - $1,875 = $293/month

Buffer = $293 / $850 = 0.345 (34.5%)
Risk Level: Critical
```

---

## Tax Calculations

### Basic Tax Deductions

**Deductible Expenses:**
```
Total Deductions = Mortgage Interest + Property Tax + 
                   Depreciation + Repairs + Operating Expenses
```

**Tax Savings:**
```
Tax Savings = Total Deductions × Tax Bracket%
```

### Depreciation

**Residential Property (Modified Accelerated Cost Recovery System - MACRS):**
```
Depreciable Basis = Purchase Price × 80%  (80% building, 20% land)
Annual Depreciation = Depreciable Basis / 27.5 years

For commercial:
Annual Depreciation = Depreciable Basis / 39 years
```

**Example:**
```
Purchase price: $500,000
Depreciable basis = $500,000 × 0.80 = $400,000

Annual depreciation = $400,000 / 27.5 = $14,545/year
```

### Passive Loss Limitations (IRS Publication 925)

**Special Allowance:**
```
Base allowance = $25,000

If AGI > $100,000:
  Phase-out = (AGI - $100,000) × 0.50
  Allowance = max(0, $25,000 - Phase-out)

If AGI ≥ $150,000:
  Allowance = $0 (complete phase-out)

Allowable Loss = min(Passive Loss, Allowance)
Disallowed Loss = Passive Loss - Allowable Loss (carried forward)
```

**Example:**
```
Passive loss: $20,000
AGI: $120,000

Phase-out = ($120,000 - $100,000) × 0.50
          = $20,000 × 0.50
          = $10,000

Allowance = $25,000 - $10,000 = $15,000

Allowable loss this year: $15,000
Disallowed (carry forward): $5,000
```

### SALT Cap (State and Local Tax Deduction)

**Formula:**
```
Deductible Property Tax = min(Property Tax, $10,000)
```

**Example:**
```
Property tax: $15,000

Deductible amount = min($15,000, $10,000) = $10,000
Non-deductible: $5,000
```

### Qualified Business Income (QBI) Deduction - Section 199A

**Formula:**
```
QBI Deduction = min(
  20% × Qualified Business Income,
  20% × Taxable Income (before QBI deduction)
)

Note: Subject to additional limitations for high-income taxpayers:
- Single: AGI > $170,050
- Married Filing Jointly: AGI > $340,100
```

**Example:**
```
Rental income (QBI): $50,000
Taxable income: $200,000
AGI: $180,000 (above threshold - may have limitations)

Base QBI deduction = min(20% × $50,000, 20% × $200,000)
                   = min($10,000, $40,000)
                   = $10,000

Final taxable income = $200,000 - $10,000 = $190,000
```

### Capital Gains Tax

**Formula:**
```
Long-term capital gain = Sale Price - Cost Basis - Selling Costs
Capital Gains Tax = Capital Gain × Tax Rate%

Tax Rates (2025):
- 0%: Single <$44,625, MFJ <$89,250
- 15%: Single $44,625-$492,300, MFJ $89,250-$553,850
- 20%: Above those thresholds

Depreciation Recapture = Accumulated Depreciation × 25%
```

**Example:**
```
Purchase price: $500,000
Accumulated depreciation: $72,727 (5 years)
Sale price: $650,000
Selling costs: $39,000

Cost basis = $500,000 - $72,727 = $427,273
Capital gain = $650,000 - $427,273 - $39,000 = $183,727

Long-term cap gains tax (15%) = $183,727 × 0.15 = $27,559
Depreciation recapture = $72,727 × 0.25 = $18,182

Total tax = $27,559 + $18,182 = $45,741
```

---

## Risk Analysis

### Risk Scoring System

**Formula:**
```
Overall Risk Score = 
  (Market Risk × 0.25) + 
  (Property Risk × 0.25) + 
  (Tenant Risk × 0.25) + 
  (Financing Risk × 0.25)

Scale: 1-10 (1 = lowest risk, 10 = highest risk)

Risk Categories:
- Low: Score ≤ 3
- Medium: Score 3-5
- High: Score 5-7
- Very High: Score > 7
```

**Risk Components:**

1. **Market Risk:**
   ```
   Market Risk = (Market Volatility + Market Condition Adjustment) / 2
   
   Market Condition Adjustment:
   - Hot market: 0
   - Stable market: +1
   - Slow market: +3
   ```

2. **Property Risk:**
   ```
   Property Risk = (Property Condition Score + Age Factor) / 2
   
   Age Factor:
   - Age < 10 years: 0
   - Age 10-20 years: +1
   - Age 20-30 years: +2
   - Age > 30 years: +3
   ```

3. **Financing Risk (with Balloon Payments):**
   ```
   Base Financing Risk × Balloon Multiplier × Time Multiplier
   
   Balloon Multiplier = max(1, Balloon Amount / Total Loan × 2)
   Time Multiplier = max(1, (10 - Years Until Due) / 5)
   
   Interest-Only Multiplier = 1.3 (if applicable)
   ```

**Example:**
```
Market volatility: 5
Market condition: Stable (+1)
Market Risk = (5 + 1) / 2 = 3.0

Property condition: 6
Property age: 25 years (+2)
Property Risk = (6 + 2) / 2 = 4.0

Tenant quality: 7
Tenant Risk = 7.0

Base financing risk: 4
Balloon: $150,000
Total loan: $400,000
Years until due: 3

Balloon Multiplier = max(1, $150,000 / $400,000 × 2) = 0.75
Time Multiplier = max(1, (10 - 3) / 5) = 1.4
Financing Risk = 4 × 0.75 × 1.4 = 4.2

Overall Risk = (3.0 × 0.25) + (4.0 × 0.25) + (7.0 × 0.25) + (4.2 × 0.25)
             = 0.75 + 1.00 + 1.75 + 1.05
             = 4.55 (Medium Risk)
```

### Confidence Intervals

**Formula:**
```
Margin of Error = z × (σ / √n)

Confidence Interval = [μ - ME, μ + ME]

Where:
- z = z-score (1.96 for 95%, 1.645 for 90%, 2.576 for 99%)
- σ = Standard deviation
- n = Sample size
- μ = Mean
```

**Example:**
```
Mean return: 12.5%
Standard deviation: 4.2%
Sample size: 10,000 simulations
Confidence level: 95%

z-score = 1.96
ME = 1.96 × (4.2% / √10,000)
   = 1.96 × (4.2% / 100)
   = 1.96 × 0.042%
   = 0.082%

95% CI = [12.5% - 0.082%, 12.5% + 0.082%]
       = [12.418%, 12.582%]
```

---

## Assumptions

### General Assumptions

1. **Time Value of Money:**
   - Monthly compounding is used for all mortgage calculations
   - Annual compounding is used for appreciation and growth rates unless otherwise specified

2. **Market Conditions:**
   - Historical appreciation rates (typically 3-5%) are not guaranteed
   - Rent growth assumptions based on local market trends
   - Stable economic conditions unless stress-tested

3. **Property Operations:**
   - Properties are managed competently
   - Major systems (HVAC, roof, etc.) in working condition
   - No major environmental or structural issues

4. **Tax Assumptions:**
   - Investor is U.S. taxpayer subject to federal income tax
   - Tax brackets remain stable (subject to legislation changes)
   - Standard deductions apply unless specified
   - Consult tax professional for specific situations

5. **Financing Assumptions:**
   - Borrower qualifies for stated interest rates
   - No prepayment penalties unless specified
   - Closing costs estimated at 2-3% of loan amount
   - Lender requirements met (DSCR, LTV, etc.)

### Calculation-Specific Assumptions

**Mortgage Calculations:**
- Fixed interest rates unless specified
- No ARM adjustment calculations included
- Points and fees not included in APR calculations
- Insurance and taxes in escrow

**Property Valuation:**
- Comparable sales methodology valid
- No extraordinary property features affecting value
- Market conditions remain stable during analysis period
- Professional appraisal recommended for final decisions

**Cash Flow Projections:**
- Linear growth rates (no acceleration/deceleration)
- Vacancy rates remain constant
- No major economic disruptions
- Operating expenses scaled with inflation

**Monte Carlo Simulations:**
- Input distributions represent realistic ranges
- Variables are independent (no correlation modeling)
- Past performance used to estimate future volatility
- Sufficient simulation count (typically 10,000+) for statistical significance

**Tax Calculations:**
- Current tax code applies (2025)
- No major tax reform assumed
- State tax rates vary by jurisdiction
- Passive activity rules properly applied
- Tax professional review recommended

**Risk Analysis:**
- Risk factors scored subjectively (1-10 scale)
- Historical data used for volatility estimates
- Black swan events not modeled
- Insurance coverage assumed adequate

---

## Limitations

### Calculation Limitations

1. **Simplified Models:**
   - Many calculations use simplified formulas for accessibility
   - Complex scenarios may require professional financial modeling
   - Actual results may vary based on specific circumstances

2. **Data Quality:**
   - Results dependent on accuracy of input data
   - Garbage in, garbage out principle applies
   - Market data may be outdated or incomplete

3. **Future Uncertainty:**
   - All projections are estimates based on assumptions
   - Actual future performance may differ significantly
   - Cannot predict major market disruptions

4. **Tax Complexity:**
   - Tax calculations are simplified
   - Does not account for all tax situations
   - State and local tax variations not fully modeled
   - Tax professional consultation required for accuracy

5. **Market Dynamics:**
   - Does not model supply/demand economics
   - Assumes stable competitive environment
   - Does not predict market cycles
   - Local market conditions may override models

### Technical Limitations

1. **Numerical Precision:**
   - Floating-point arithmetic may introduce small rounding errors
   - Results rounded to reasonable precision (typically 2 decimal places)
   - Cumulative rounding in long projections

2. **Monte Carlo Simulations:**
   - Assumes independence of variables (may not reflect real correlations)
   - Pseudo-random number generation (not true randomness)
   - Computational limits on simulation count
   - Results vary between runs unless seed is set

3. **IRR Calculations:**
   - Uses approximation for complex cash flow patterns
   - May not converge for some cash flow scenarios
   - Assumes reinvestment at IRR rate (often unrealistic)

4. **Amortization:**
   - Standard 30/360 day count convention
   - Actual/actual calculations not implemented
   - Partial payments and extra payments require manual adjustment

### Use Case Limitations

**Not Suitable For:**
- Legal or tax advice (consult professionals)
- Final investment decisions (due diligence required)
- Loan approval processes (lender requirements vary)
- Tax filing (CPA required)
- Legal contracts (attorney required)

**Suitable For:**
- Initial analysis and screening
- Comparative analysis of opportunities
- Educational purposes
- Pro forma estimates
- Sensitivity and scenario analysis

---

## References

### Financial Formulas

1. **Mortgage Mathematics:**
   - Excel PMT Function Documentation
   - "Mortgage Mathematics" - Financial Mathematics Society
   - Federal Reserve Bank - Consumer Handbook on Adjustable Rate Mortgages

2. **Investment Analysis:**
   - "Real Estate Finance and Investments" - William Brueggeman & Jeffrey Fisher
   - "The Real Estate Investor's Handbook" - Steven D. Fisher

3. **Monte Carlo Methods:**
   - "Monte Carlo Simulation and Finance" - Don L. McLeish
   - "Simulation Modeling and Analysis" - Averill Law

### Tax References

1. **IRS Publications:**
   - Publication 527: Residential Rental Property
   - Publication 925: Passive Activity and At-Risk Rules
   - Publication 946: How to Depreciate Property
   - Publication 544: Sales and Other Dispositions of Assets

2. **Tax Code Sections:**
   - Section 199A: Qualified Business Income Deduction
   - Section 1031: Like-Kind Exchanges
   - Section 121: Exclusion of Gain from Sale of Principal Residence
   - Section 469: Passive Activity Losses

### Industry Standards

1. **Appraisal Standards:**
   - Uniform Standards of Professional Appraisal Practice (USPAP)
   - Fannie Mae Selling Guide
   - Freddie Mac Seller/Servicer Guide

2. **Accounting Standards:**
   - Generally Accepted Accounting Principles (GAAP)
   - Financial Accounting Standards Board (FASB) guidelines

3. **Real Estate Analysis:**
   - Appraisal Institute - "The Appraisal of Real Estate"
   - Urban Land Institute - "Real Estate Market Analysis"
   - National Association of Realtors - Market Statistics

### Statistical Methods

1. **Probability Distributions:**
   - "Probability and Statistics for Engineering and the Sciences" - Jay Devore
   - "Statistical Methods for Research Workers" - R.A. Fisher

2. **Risk Analysis:**
   - "Risk Analysis in Engineering and Economics" - Bilal Ayyub
   - "Quantitative Risk Management" - McNeil, Frey, Embrechts

### Online Resources

1. **Calculators and Tools:**
   - Mortgage Calculator - Bankrate.com
   - Real Estate Analysis - BiggerPockets.com
   - Investment Calculators - Investor.gov

2. **Market Data:**
   - Federal Housing Finance Agency (FHFA) House Price Index
   - Bureau of Labor Statistics - Consumer Price Index
   - Federal Reserve Economic Data (FRED)

3. **Educational Resources:**
   - Khan Academy - Finance and Capital Markets
   - Coursera - Real Estate Finance courses
   - MIT OpenCourseWare - Real Estate Finance and Investment

---

## Disclaimer

**⚠️ IMPORTANT NOTICE**

The calculations, formulas, and analyses provided in this documentation are for informational and educational purposes only. They are not intended to constitute:

- Financial advice
- Tax advice
- Legal advice
- Investment recommendations
- Professional consulting services

**Before making any investment decisions:**

1. **Consult Professionals:**
   - Licensed Financial Advisor
   - Certified Public Accountant (CPA)
   - Real Estate Attorney
   - Mortgage Broker/Lender

2. **Perform Due Diligence:**
   - Property inspections
   - Market analysis
   - Title search
   - Environmental assessments
   - Financial verification

3. **Understand Risks:**
   - Real estate investments involve substantial risk
   - Past performance does not guarantee future results
   - Market conditions can change rapidly
   - You may lose your entire investment

4. **Verify Calculations:**
   - Use multiple sources for verification
   - Have complex calculations reviewed by professionals
   - Understand the assumptions behind each calculation
   - Test scenarios and stress cases

**Dreamery provides tools and calculators as a service to users but makes no warranties or guarantees regarding:**
- Accuracy of calculations
- Completeness of information
- Suitability for any particular purpose
- Investment outcomes

Users assume all risks associated with using these calculation tools and any investment decisions made based on them.

**Tax Disclaimer:**
Tax laws are complex and subject to change. Tax calculations in this document are simplified and may not apply to your specific situation. Always consult a licensed tax professional before making tax-related decisions.

**Legal Disclaimer:**
This documentation does not create an attorney-client relationship. Legal requirements vary by jurisdiction. Consult a real estate attorney for legal advice.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 7, 2025 | Dreamery Dev Team | Initial comprehensive documentation |

---

**Document Status:** Production  
**Review Cycle:** Quarterly  
**Next Review:** January 7, 2026  
**Owner:** Dreamery Development Team  
**Contact:** dev@dreamery.com

