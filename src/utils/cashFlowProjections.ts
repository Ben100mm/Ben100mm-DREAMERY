/**
 * Year-by-Year Cash Flow Projections
 * 
 * This module provides detailed annual cash flow modeling including:
 * - Rent growth projections
 * - Expense growth (inflation-adjusted)
 * - Loan paydown schedule
 * - Capital events (major expenses/improvements)
 * - NOI and cash flow calculations by year
 */

import { pmt, remainingPrincipalAfterPayments, LoanSpec } from './finance';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Types of capital events that can occur
 */
export enum CapitalEventType {
  ROOF_REPLACEMENT = 'Roof Replacement',
  HVAC_REPLACEMENT = 'HVAC Replacement',
  APPLIANCE_REPLACEMENT = 'Appliance Replacement',
  MAJOR_RENOVATION = 'Major Renovation',
  FOUNDATION_REPAIR = 'Foundation Repair',
  PLUMBING_UPGRADE = 'Plumbing Upgrade',
  ELECTRICAL_UPGRADE = 'Electrical Upgrade',
  EXTERIOR_PAINTING = 'Exterior Painting',
  LANDSCAPING = 'Landscaping',
  OTHER = 'Other'
}

/**
 * Capital event - major expense or improvement in a specific year
 */
export interface CapitalEvent {
  id: string;
  year: number; // Year number (1, 2, 3, etc.)
  type: CapitalEventType;
  description: string;
  amount: number;
  isCapitalImprovement: boolean; // If true, adds to property value
  valueAddPercentage?: number; // % of cost that adds to property value (default 100% if capital improvement)
}

/**
 * Annual projection data for a single year
 */
export interface YearlyProjection {
  year: number;
  
  // Revenue
  monthlyRent: number;
  annualRent: number;
  annualGrossIncome: number;
  
  // Expenses
  fixedExpenses: number;
  variableExpenses: number;
  totalExpenses: number;
  
  // NOI
  noi: number;
  
  // Debt Service
  loanBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalDebtService: number;
  
  // Capital Events
  capitalEvents: CapitalEvent[];
  totalCapitalEvents: number;
  
  // Cash Flow
  cashFlowBeforeCapEx: number;
  cashFlowAfterCapEx: number;
  cumulativeCashFlow: number;
  
  // Property Value
  propertyValue: number;
  equity: number;
  
  // Metrics
  cashOnCashReturn: number;
  roi: number;
  capRate: number;
}

/**
 * Loan paydown schedule entry
 */
export interface LoanPaydownEntry {
  year: number;
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

/**
 * Growth rate configuration
 */
export interface GrowthRates {
  rentGrowthRate: number; // Annual rent growth % (e.g., 0.03 for 3%)
  expenseGrowthRate: number; // Annual expense growth % (e.g., 0.025 for 2.5%)
  propertyAppreciationRate: number; // Annual property appreciation % (e.g., 0.04 for 4%)
}

/**
 * Input parameters for cash flow projection
 */
export interface CashFlowProjectionParams {
  // Basic Property Info
  purchasePrice: number;
  currentPropertyValue?: number; // If different from purchase price
  
  // Initial Income
  initialMonthlyRent: number;
  otherMonthlyIncome?: number;
  vacancyRate?: number; // As decimal (e.g., 0.05 for 5%)
  
  // Initial Expenses (annual)
  annualTaxes: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualManagement: number;
  annualCapEx: number;
  otherAnnualExpenses?: number;
  
  // Loan Information
  loanAmount: number;
  annualInterestRate: number;
  loanTermMonths: number;
  interestOnly?: boolean;
  ioPeriodMonths?: number;
  
  // Growth Rates
  growthRates: GrowthRates;
  
  // Capital Events
  capitalEvents?: CapitalEvent[];
  
  // Projection Settings
  projectionYears: number;
  initialInvestment: number; // Down payment + closing costs
}

/**
 * Complete projection results
 */
export interface CashFlowProjectionResults {
  yearlyProjections: YearlyProjection[];
  loanPaydownSchedule: LoanPaydownEntry[];
  summary: {
    totalCashFlow: number;
    totalPrincipalPaydown: number;
    totalAppreciation: number;
    totalReturn: number;
    annualizedReturn: number;
    finalEquity: number;
    totalCapitalEvents: number;
  };
}

// ============================================================================
// Calculation Functions
// ============================================================================

/**
 * Calculate monthly rent for a specific year with growth applied
 */
export function projectMonthlyRent(
  initialMonthlyRent: number,
  rentGrowthRate: number,
  year: number
): number {
  if (year === 1) return initialMonthlyRent;
  return initialMonthlyRent * Math.pow(1 + rentGrowthRate, year - 1);
}

/**
 * Calculate annual expenses for a specific year with inflation applied
 */
export function projectAnnualExpenses(
  initialExpenses: number,
  expenseGrowthRate: number,
  year: number
): number {
  if (year === 1) return initialExpenses;
  return initialExpenses * Math.pow(1 + expenseGrowthRate, year - 1);
}

/**
 * Calculate property value for a specific year with appreciation
 */
export function projectPropertyValue(
  initialValue: number,
  appreciationRate: number,
  year: number,
  capitalImprovements: number = 0
): number {
  const appreciatedValue = initialValue * Math.pow(1 + appreciationRate, year - 1);
  return appreciatedValue + capitalImprovements;
}

/**
 * Generate loan paydown schedule for the entire projection period
 */
export function generateLoanPaydownSchedule(
  loanSpec: LoanSpec,
  projectionYears: number
): LoanPaydownEntry[] {
  const schedule: LoanPaydownEntry[] = [];
  const monthlyPayment = pmt(loanSpec.annualRate, loanSpec.termMonths, loanSpec.principal);
  const monthlyRate = loanSpec.annualRate / 12;
  
  const totalMonths = Math.min(loanSpec.termMonths, projectionYears * 12);
  
  for (let month = 1; month <= totalMonths; month++) {
    const previousBalance = month === 1 
      ? loanSpec.principal 
      : schedule[month - 2].balance;
    
    let interest: number;
    let principal: number;
    
    // Handle interest-only period
    if (loanSpec.interestOnly && loanSpec.ioPeriodMonths && month <= loanSpec.ioPeriodMonths) {
      interest = previousBalance * monthlyRate;
      principal = 0;
    } else if (loanSpec.interestOnly && !loanSpec.ioPeriodMonths) {
      // Pure IO loan
      interest = previousBalance * monthlyRate;
      principal = 0;
    } else {
      interest = previousBalance * monthlyRate;
      principal = monthlyPayment - interest;
    }
    
    const balance = Math.max(0, previousBalance - principal);
    const year = Math.ceil(month / 12);
    
    schedule.push({
      year,
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance
    });
  }
  
  return schedule;
}

/**
 * Calculate capital events for a specific year
 */
export function getCapitalEventsForYear(
  year: number,
  capitalEvents: CapitalEvent[]
): CapitalEvent[] {
  return capitalEvents.filter(event => event.year === year);
}

/**
 * Calculate total capital improvements value up to a specific year
 */
export function calculateCapitalImprovements(
  year: number,
  capitalEvents: CapitalEvent[]
): number {
  return capitalEvents
    .filter(event => event.year <= year && event.isCapitalImprovement)
    .reduce((total, event) => {
      const valueAddPct = event.valueAddPercentage ?? 1.0;
      return total + (event.amount * valueAddPct);
    }, 0);
}

/**
 * Generate complete year-by-year cash flow projections
 */
export function generateCashFlowProjections(
  params: CashFlowProjectionParams
): CashFlowProjectionResults {
  const {
    purchasePrice,
    currentPropertyValue,
    initialMonthlyRent,
    otherMonthlyIncome = 0,
    vacancyRate = 0,
    annualTaxes,
    annualInsurance,
    annualMaintenance,
    annualManagement,
    annualCapEx,
    otherAnnualExpenses = 0,
    loanAmount,
    annualInterestRate,
    loanTermMonths,
    interestOnly = false,
    ioPeriodMonths,
    growthRates,
    capitalEvents = [],
    projectionYears,
    initialInvestment
  } = params;
  
  const propertyValue = currentPropertyValue || purchasePrice;
  
  // Create loan spec
  const loanSpec: LoanSpec = {
    principal: loanAmount,
    annualRate: annualInterestRate,
    termMonths: loanTermMonths,
    interestOnly,
    ioPeriodMonths
  };
  
  // Generate loan paydown schedule
  const loanPaydownSchedule = generateLoanPaydownSchedule(loanSpec, projectionYears);
  
  // Calculate initial annual expenses
  const initialAnnualExpenses = 
    annualTaxes + 
    annualInsurance + 
    annualMaintenance + 
    annualManagement + 
    annualCapEx + 
    otherAnnualExpenses;
  
  const yearlyProjections: YearlyProjection[] = [];
  let cumulativeCashFlow = 0;
  
  for (let year = 1; year <= projectionYears; year++) {
    // Project rent with growth
    const monthlyRent = projectMonthlyRent(
      initialMonthlyRent,
      growthRates.rentGrowthRate,
      year
    );
    
    // Calculate annual income
    const annualGrossRent = monthlyRent * 12;
    const annualOtherIncome = otherMonthlyIncome * 12;
    const vacancyLoss = (annualGrossRent + annualOtherIncome) * vacancyRate;
    const annualGrossIncome = annualGrossRent + annualOtherIncome - vacancyLoss;
    
    // Project expenses with inflation
    const totalExpenses = projectAnnualExpenses(
      initialAnnualExpenses,
      growthRates.expenseGrowthRate,
      year
    );
    
    // Calculate NOI
    const noi = annualGrossIncome - totalExpenses;
    
    // Get loan payments for this year
    const yearPayments = loanPaydownSchedule.filter(entry => entry.year === year);
    const annualPrincipal = yearPayments.reduce((sum, entry) => sum + entry.principal, 0);
    const annualInterest = yearPayments.reduce((sum, entry) => sum + entry.interest, 0);
    const totalDebtService = annualPrincipal + annualInterest;
    const endOfYearBalance = yearPayments.length > 0 
      ? yearPayments[yearPayments.length - 1].balance 
      : loanAmount;
    
    // Get capital events for this year
    const yearCapitalEvents = getCapitalEventsForYear(year, capitalEvents);
    const totalCapitalEventsAmount = yearCapitalEvents.reduce(
      (sum, event) => sum + event.amount,
      0
    );
    
    // Calculate cash flows
    const cashFlowBeforeCapEx = noi - totalDebtService;
    const cashFlowAfterCapEx = cashFlowBeforeCapEx - totalCapitalEventsAmount;
    cumulativeCashFlow += cashFlowAfterCapEx;
    
    // Calculate property value with appreciation and capital improvements
    const capitalImprovements = calculateCapitalImprovements(year, capitalEvents);
    const currentPropertyValue = projectPropertyValue(
      propertyValue,
      growthRates.propertyAppreciationRate,
      year,
      capitalImprovements
    );
    
    const equity = currentPropertyValue - endOfYearBalance;
    
    // Calculate metrics
    const cashOnCashReturn = initialInvestment > 0 
      ? (cashFlowAfterCapEx / initialInvestment) * 100 
      : 0;
    const roi = initialInvestment > 0
      ? ((cashFlowAfterCapEx + annualPrincipal + (currentPropertyValue - propertyValue)) / initialInvestment) * 100
      : 0;
    const capRate = currentPropertyValue > 0 ? (noi / currentPropertyValue) * 100 : 0;
    
    yearlyProjections.push({
      year,
      monthlyRent,
      annualRent: annualGrossRent,
      annualGrossIncome,
      fixedExpenses: totalExpenses,
      variableExpenses: 0, // Could be broken out separately if needed
      totalExpenses,
      noi,
      loanBalance: endOfYearBalance,
      principalPayment: annualPrincipal,
      interestPayment: annualInterest,
      totalDebtService,
      capitalEvents: yearCapitalEvents,
      totalCapitalEvents: totalCapitalEventsAmount,
      cashFlowBeforeCapEx,
      cashFlowAfterCapEx,
      cumulativeCashFlow,
      propertyValue: currentPropertyValue,
      equity,
      cashOnCashReturn,
      roi,
      capRate
    });
  }
  
  // Calculate summary metrics
  const totalCashFlow = yearlyProjections.reduce(
    (sum, proj) => sum + proj.cashFlowAfterCapEx,
    0
  );
  
  const totalPrincipalPaydown = yearlyProjections.reduce(
    (sum, proj) => sum + proj.principalPayment,
    0
  );
  
  const finalProjection = yearlyProjections[yearlyProjections.length - 1];
  const totalAppreciation = finalProjection.propertyValue - propertyValue;
  const totalCapitalEventsAmount = yearlyProjections.reduce(
    (sum, proj) => sum + proj.totalCapitalEvents,
    0
  );
  
  const totalReturn = totalCashFlow + totalPrincipalPaydown + totalAppreciation;
  const annualizedReturn = initialInvestment > 0
    ? (Math.pow(1 + (totalReturn / initialInvestment), 1 / projectionYears) - 1) * 100
    : 0;
  
  return {
    yearlyProjections,
    loanPaydownSchedule,
    summary: {
      totalCashFlow,
      totalPrincipalPaydown,
      totalAppreciation,
      totalReturn,
      annualizedReturn,
      finalEquity: finalProjection.equity,
      totalCapitalEvents: totalCapitalEventsAmount
    }
  };
}

/**
 * Helper to create a sample capital event
 */
export function createCapitalEvent(
  year: number,
  type: CapitalEventType,
  amount: number,
  description?: string,
  isCapitalImprovement: boolean = false,
  valueAddPercentage?: number
): CapitalEvent {
  return {
    id: `event-${Date.now()}-${Math.random()}`,
    year,
    type,
    description: description || type,
    amount,
    isCapitalImprovement,
    valueAddPercentage
  };
}

/**
 * Common capital event presets with typical costs
 */
export const CAPITAL_EVENT_PRESETS = {
  ROOF_REPLACEMENT: (year: number, sqft: number = 2000) => 
    createCapitalEvent(
      year,
      CapitalEventType.ROOF_REPLACEMENT,
      sqft * 8, // ~$8 per sqft
      `Roof Replacement (${sqft} sqft)`,
      true,
      0.8 // 80% value add
    ),
  
  HVAC_REPLACEMENT: (year: number, tons: number = 3) =>
    createCapitalEvent(
      year,
      CapitalEventType.HVAC_REPLACEMENT,
      tons * 2500, // ~$2,500 per ton
      `HVAC Replacement (${tons} tons)`,
      true,
      0.7 // 70% value add
    ),
  
  KITCHEN_RENOVATION: (year: number, budget: number = 25000) =>
    createCapitalEvent(
      year,
      CapitalEventType.MAJOR_RENOVATION,
      budget,
      'Kitchen Renovation',
      true,
      1.0 // 100% value add
    ),
  
  EXTERIOR_PAINT: (year: number, sqft: number = 2000) =>
    createCapitalEvent(
      year,
      CapitalEventType.EXTERIOR_PAINTING,
      sqft * 3, // ~$3 per sqft
      `Exterior Painting (${sqft} sqft)`,
      false
    )
};

