/**
 * Finance Calculation Utilities
 * 
 * Comprehensive financial calculations for real estate investment analysis
 */

// Basic financial functions
export function pmt(rate: number, nper: number, pv: number, fv: number = 0, type: number = 0): number {
  if (rate === 0) return -(pv + fv) / nper;
  const pvif = Math.pow(1 + rate, nper);
  const pmt = rate / (pvif - 1) * -(pv * pvif + fv);
  return type === 1 ? pmt / (1 + rate) : pmt;
}

export function pv(rate: number, nper: number, pmt: number, fv: number = 0, type: number = 0): number {
  if (rate === 0) return -(pmt * nper + fv);
  const pvif = Math.pow(1 + rate, nper);
  return -(pmt * (1 + rate * type) * ((pvif - 1) / rate) + fv) / pvif;
}

export function fv(rate: number, nper: number, pmt: number, pv: number = 0, type: number = 0): number {
  if (rate === 0) return -(pv + pmt * nper);
  const pvif = Math.pow(1 + rate, nper);
  return -(pv * pvif + pmt * (1 + rate * type) * ((pvif - 1) / rate));
}

export function nper(rate: number, pmt: number, pv: number, fv: number = 0, type: number = 0): number {
  if (rate === 0) return -(pv + fv) / pmt;
  const term = Math.log((pmt * (1 + rate * type) - fv * rate) / (pv * rate + pmt * (1 + rate * type))) / Math.log(1 + rate);
  return term;
}

export function rate(nper: number, pmt: number, pv: number, fv: number = 0, type: number = 0, guess: number = 0.1): number {
  // Newton-Raphson method for finding rate
  let r = guess;
  const tolerance = 1e-6;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const f = pv * Math.pow(1 + r, nper) + pmt * (1 + r * type) * ((Math.pow(1 + r, nper) - 1) / r) + fv;
    const fPrime = nper * pv * Math.pow(1 + r, nper - 1) + pmt * type * ((Math.pow(1 + r, nper) - 1) / r) + 
                   pmt * (1 + r * type) * ((nper * Math.pow(1 + r, nper - 1) * r - (Math.pow(1 + r, nper) - 1)) / (r * r));
    
    if (Math.abs(fPrime) < tolerance) break;
    
    const newR = r - f / fPrime;
    if (Math.abs(newR - r) < tolerance) {
      r = newR;
      break;
    }
    r = newR;
  }
  
  return r;
}

// Real estate specific calculations
export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  return pmt(monthlyRate, numPayments, principal);
}

export function calculateLoanAmount(purchasePrice: number, downPayment: number): number {
  return purchasePrice - downPayment;
}

export function calculateDownPayment(purchasePrice: number, downPaymentPercent: number): number {
  return purchasePrice * (downPaymentPercent / 100);
}

export function calculateLTV(loanAmount: number, propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  return (loanAmount / propertyValue) * 100;
}

export function calculateDTI(monthlyDebt: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  return (monthlyDebt / monthlyIncome) * 100;
}

// Cash flow calculations
export function calculateMonthlyCashFlow(monthlyIncome: number, monthlyExpenses: number): number {
  return monthlyIncome - monthlyExpenses;
}

export function calculateAnnualCashFlow(monthlyCashFlow: number): number {
  return monthlyCashFlow * 12;
}

export function calculateCashOnCashReturn(cashInvested: number, annualCashFlow: number): number {
  if (cashInvested <= 0) return 0;
  return (annualCashFlow / cashInvested) * 100;
}

export function calculateCapRate(annualNOI: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (annualNOI / purchasePrice) * 100;
}

export function calculateROI(cashInvested: number, annualCashFlow: number, annualAppreciation: number): number {
  if (cashInvested <= 0) return 0;
  return ((annualCashFlow + annualAppreciation) / cashInvested) * 100;
}

export function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  // Internal Rate of Return calculation using Newton-Raphson method
  const tolerance = 1e-6;
  const maxIterations = 100;
  let r = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let npvPrime = 0;
    
    for (let j = 0; j < cashFlows.length; j++) {
      const discountFactor = Math.pow(1 + r, j);
      npv += cashFlows[j] / discountFactor;
      npvPrime -= j * cashFlows[j] / (discountFactor * (1 + r));
    }
    
    if (Math.abs(npvPrime) < tolerance) break;
    
    const newR = r - npv / npvPrime;
    if (Math.abs(newR - r) < tolerance) {
      r = newR;
      break;
    }
    r = newR;
  }
  
  return r * 100; // Return as percentage
}

export function calculateMOIC(totalCashInvested: number, totalCashReceived: number): number {
  if (totalCashInvested <= 0) return 0;
  return totalCashReceived / totalCashInvested;
}

// Operating expense calculations
export function calculateFixedMonthlyOps(ops: {
  taxes: number;
  insurance: number;
  gasElectric: number;
  internet: number;
  hoa: number;
  cleaner: number;
  waterSewer: number;
  heat: number;
  lawnSnow: number;
  phoneBill: number;
  extra: number;
  maintenance: number;
  capEx: number;
  opEx: number;
}): number {
  return (
    ops.taxes / 12 +
    ops.insurance / 12 +
    ops.gasElectric +
    ops.internet +
    ops.hoa +
    ops.cleaner +
    ops.waterSewer +
    ops.heat +
    ops.lawnSnow +
    ops.phoneBill +
    ops.extra +
    ops.maintenance +
    ops.capEx +
    ops.opEx
  );
}

export function calculateVariableMonthlyOps(monthlyIncome: number, vacancyRate: number, managementRate: number): number {
  return monthlyIncome * (vacancyRate / 100) + monthlyIncome * (managementRate / 100);
}

export function calculateTotalMonthlyOps(fixedOps: number, variableOps: number): number {
  return fixedOps + variableOps;
}

// Break-even calculations
export function calculateBreakEvenOccupancy(monthlyFixedOps: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  return (monthlyFixedOps / monthlyIncome) * 100;
}

export function calculateBreakEvenRent(monthlyExpenses: number): number {
  return monthlyExpenses;
}

// Appreciation calculations
export function calculateFutureValue(presentValue: number, annualRate: number, years: number): number {
  return presentValue * Math.pow(1 + annualRate / 100, years);
}

export function calculateAnnualAppreciation(presentValue: number, annualRate: number): number {
  return presentValue * (annualRate / 100);
}

export function calculateTotalAppreciation(presentValue: number, annualRate: number, years: number): number {
  const futureValue = calculateFutureValue(presentValue, annualRate, years);
  return futureValue - presentValue;
}

// Amortization schedule
export interface AmortizationEntry {
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  month: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number,
  startMonth: number = 1
): AmortizationEntry[] {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  
  const schedule: AmortizationEntry[] = [];
  let balance = principal;
  
  for (let month = startMonth; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    schedule.push({
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      month: month,
    });
    
    if (balance <= 0) break;
  }
  
  return schedule;
}

// Refinance calculations
export function calculateRefinanceSavings(
  currentPayment: number,
  newPayment: number,
  closingCosts: number
): { monthlySavings: number; annualSavings: number; breakEvenMonths: number } {
  const monthlySavings = currentPayment - newPayment;
  const annualSavings = monthlySavings * 12;
  const breakEvenMonths = closingCosts / monthlySavings;
  
  return {
    monthlySavings,
    annualSavings,
    breakEvenMonths: Math.max(0, breakEvenMonths),
  };
}

// Tax calculations
export function calculateDepreciationDeduction(costBasis: number, years: number = 27.5): number {
  return costBasis / years;
}

export function calculateTaxSavings(taxableIncome: number, taxRate: number): number {
  return taxableIncome * (taxRate / 100);
}

// Utility functions
export function parseCurrency(input: string): number {
  const numeric = Number(String(input).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${Number.isFinite(value) ? value.toFixed(decimals) : 0}%`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', { 
    maximumFractionDigits: decimals 
  }).format(Number.isFinite(value) ? value : 0);
}

// Validation functions
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isValidPositiveNumber(value: any): boolean {
  return isValidNumber(value) && value >= 0;
}

export function isValidPercentage(value: any): boolean {
  return isValidNumber(value) && value >= 0 && value <= 100;
}

export function isValidRate(value: any): boolean {
  return isValidNumber(value) && value >= 0 && value <= 50; // Reasonable rate limit
}

// Date utilities
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function addYears(date: string, years: number): string {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split('T')[0];
}

export function addMonths(date: string, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

// Property type utilities
export const PROPERTY_TYPES = [
  'SFR',
  'Multi Family',
  'Commercial',
  'Land',
  'Hotel',
  'Office',
  'Retail',
  'Condo',
  'Townhouse',
] as const;

export const OPERATION_TYPES = [
  'Buy & Hold',
  'Fix & Flip',
  'Short Term Rental',
  'Rental Arbitrage',
  'BRRRR',
] as const;

export const OFFER_TYPES = [
  'Cash',
  'Conventional',
  'FHA',
  'VA',
  'USDA',
  'Subject To Existing Mortgage',
  'Seller Finance',
  'Hybrid',
  'Hard Money',
  'Private',
  'Line of Credit',
  'SBA',
  'DSCR',
] as const;

// Default values
export const DEFAULT_VALUES = {
  PROPERTY_PRICE: 250000,
  DOWN_PAYMENT_PERCENT: 20,
  INTEREST_RATE: 6.5,
  AMORTIZATION_YEARS: 30,
  CLOSING_COSTS_PERCENT: 2.4,
  MONTHLY_RENT: 2000,
  RENT_GROWTH_RATE: 3,
  ANNUAL_APPRECIATION_RATE: 3,
  HOLDING_PERIOD_YEARS: 10,
  VACANCY_RATE: 5,
  MANAGEMENT_RATE: 10,
  MAINTENANCE_RATE: 1,
  CAPEX_RATE: 1,
  PROPERTY_TAX_RATE: 1.2,
  INSURANCE_RATE: 0.5,
} as const;
