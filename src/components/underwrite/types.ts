/**
 * Type definitions for UnderwritePage components
 * Extracted from UnderwritePage.tsx for better maintainability
 */

import {
  SeasonalFactors,
  MarketConditions,
  ExitStrategy,
  RefinanceScenario,
  TaxImplications,
  EnhancedTaxImplications,
  RiskFactors,
  PropertyAgeFactors,
  LocationFactors,
} from "../../utils/advancedCalculations";

// ============================================================================
// Property & Deal Type Definitions
// ============================================================================

export type PropertyType =
  | "Single Family"
  | "Multi Family"
  | "Hotel"
  | "Land"
  | "Office"
  | "Retail"
  | "Condo"
  | "Townhouse";

export type OperationType =
  | "Buy & Hold"
  | "Fix & Flip"
  | "Short Term Rental"
  | "Rental Arbitrage"
  | "BRRRR";

export type OfferType =
  | "Cash"
  | "FHA"
  | "Seller Finance"
  | "Conventional"
  | "SBA"
  | "DSCR"
  | "Hard Money"
  | "Private"
  | "Line of Credit"
  | "Subject To Existing Mortgage"
  | "Hybrid";

// ============================================================================
// Loan & Financing Interfaces
// ============================================================================

export interface LoanTerms {
  downPayment: number;
  loanAmount: number;
  amortizationAmount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  interestOnly: boolean;
  balloonDue?: number;
  closingCosts?: number;
  rehabCosts?: number;
  ioPeriodMonths?: number; // IO period for hybrid IO loans
  totalInterest: number;
  totalPayment: number;
  amortizationYears: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export interface SubjectToLoan {
  amount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  originalTermYears: number;
  startDate: string;
  currentBalance: number;
  paymentNumber: number;
  balloonDue: number;
  interestOnly: boolean;
}

export interface SubjectToInputs {
  paymentToSeller: number;
  loans: SubjectToLoan[];
  totalLoanBalance: number;
  totalMonthlyPayment: number;
  totalAnnualPayment: number;
}

export interface HybridInputs {
  downPayment: number;
  loan3Amount: number;
  loanAmount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  loanTerm: number;
  interestOnly?: boolean;
  balloonDue?: number;
  paymentToSeller: number;
  subjectToLoans: SubjectToLoan[];
  totalLoanBalance: number;
  totalMonthlyPayment: number;
  totalAnnualPayment: number;
  loanBalance?: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

// ============================================================================
// Strategy-Specific Interfaces
// ============================================================================

export interface FixFlipInputs {
  arv: number;
  holdingPeriodMonths: number;
  holdingCosts: number;
  sellingCostsPercent: number;
  targetPercent: number;
  rehabCost: number;
  maximumAllowableOffer: number;
  projectedProfit: number;
  roiDuringHold: number;
  annualizedRoi: number;
  exitStrategies?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
}

export interface BRRRRInputs {
  arv: number;
  refinanceLtv: number;
  refinanceInterestRate: number;
  loanTerm: number;
  newMonthlyPayment: number;
  originalCashInvested: number;
  cashOutAmount: number;
  remainingCashInDeal: number;
  newCashOnCashReturn: number;
  refinanceClosingCosts: number;
  effectiveCashOut: number;
  ltvConstraint: boolean;
  exitStrategies?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
}

export interface AppreciationInputs {
  appreciationPercentPerYear: number;
  yearsOfAppreciation: number;
  futurePropertyValue: number;
  refinanceLtv: number;
  refinancePotential: number;
  remainingBalanceAfterRefi: number;
  manuallyOverridden?: boolean;
}

// ============================================================================
// Income Interfaces
// ============================================================================

export interface IncomeInputsSfr {
  monthlyRent: number;
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
}

export interface IncomeInputsMulti {
  unitRents: number[];
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
}

export interface IncomeInputsStr {
  unitDailyRents: number[];
  unitMonthlyRents: number[];
  dailyCleaningFee: number;
  laundry: number;
  activities: number;
  avgNightsPerMonth: number;
  grossDailyIncome: number;
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
}

export interface EnhancedSTRInputs {
  averageDailyRate: number;
  occupancyRate: number;
  channelFees: {
    airbnb: number;
    vrbo: number;
    direct: number;
  };
  channelMix: {
    airbnb: number;
    vrbo: number;
    direct: number;
  };
  averageLengthOfStay: number;
  turnoverDays: number;
  minimumStay: number;
  blockedDays: number;
  dynamicPricing: boolean;
  weekendPremium: number;
  useEnhancedModel: boolean;
}

export interface OfficeRetailInputs {
  squareFootage: number;
  rentPerSFMonthly: number;
  occupancyRatePct: number;
  extraMonthlyIncome: number;
}

export interface LandInputs {
  acreage: number;
  zoning?: "Residential" | "Commercial" | "Agricultural" | "Mixed";
  extraMonthlyIncome: number;
}

export interface ArbitrageInputs {
  deposit: number;
  monthlyRentToLandlord: number;
  estimateCostOfRepairs: number;
  furnitureCost: number;
  otherStartupCosts: number;
  startupCostsTotal: number;
}

// ============================================================================
// Operating Expenses & Revenue Interfaces
// ============================================================================

export interface OperatingInputsCommon {
  principalAndInterest: number;
  totalSubtoLoans: number;
  taxes: number;
  insurance: number;
  gasElectric: number;
  internet: number;
  hoa: number;
  cleaner: number;
  monthlyRentToLandlord: number;
  waterSewer: number;
  heat: number;
  lawnSnow: number;
  phoneBill: number;
  extra: number;
  maintenance: number;
  vacancy: number;
  management: number;
  capEx: number;
  opEx: number;
  utilitiesPct?: number;
  expensesWithoutMortgage: number;
  monthlyExpenses: number;
  monthlyExpensesPercent: number;
  yearlyExpenses: number;
  expensesWithMortgage: number;
  monthlyExpensesWithMortgage: number;
  yearlyExpensesWithMortgage: number;
}

export interface RevenueInputs {
  totalRooms: number;
  averageDailyRate: number;
  occupancyRate: number;
  seasonalVariations: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  fixedAnnualCosts: number;
  fixedMonthlyCosts: number;
}

// ============================================================================
// Pro Forma & Analysis Interfaces
// ============================================================================

export interface CustomProFormaPreset {
  id: string;
  name: string;
  description?: string;
  maintenance: number;
  vacancy: number;
  management: number;
  capEx: number;
  opEx: number;
  propertyType: PropertyType;
  operationType: OperationType;
  createdAt: Date;
}

export interface SensitivityAnalysis {
  showSensitivity: boolean;
  sensitivityRange: number;
  sensitivitySteps: number;
}

export interface BenchmarkComparison {
  showBenchmarks: boolean;
  selectedMarket?: string;
  includeBenchmarks: boolean;
}

export interface BreakEvenAnalysis {
  showBreakEven: boolean;
  breakEvenOccupancy: number;
  breakEvenADR: number;
  breakEvenRevenue: number;
  marginOfSafety: number;
}

// ============================================================================
// Advanced Analysis Interfaces
// ============================================================================

export interface MetricWithConfidence {
  low: number;
  base: number;
  high: number;
  standardDeviation: number;
  confidenceLevel: number;
}

export interface UncertaintyParameters {
  incomeUncertainty: number;
  expenseUncertainty: number;
  occupancyUncertainty: number;
  appreciationUncertainty: number;
  confidenceLevel: number;
}

export interface CapitalEvent {
  id: string;
  year: number;
  description: string;
  estimatedCost: number;
  category: 'roof' | 'hvac' | 'foundation' | 'electrical' | 'plumbing' | 'other';
  likelihood: number;
}

export interface CapitalEventInputs {
  events: CapitalEvent[];
  totalExpectedCost: number;
  averageAnnualCost: number;
}

export interface Exchange1031Inputs {
  enabled: boolean;
  relinquishedPropertyValue: number;
  relinquishedPropertyBasis: number;
  relinquishedPropertyDepreciation: number;
  relinquishedPropertyMortgage: number;
  replacementPropertyValue: number;
  replacementPropertyMortgage: number;
  qualifiedIntermediaryFee: number;
  otherExchangeCosts: number;
  identificationDeadline: string;
  closingDeadline: string;
  deferredGain: number;
  recognizedGain: number;
  carryoverBasis: number;
  cashBoot: number;
  mortgageBoot: number;
  totalTaxableGain: number;
  estimatedTaxLiability: number;
  netProceedsToReinvest: number;
}

// ============================================================================
// Main DealState Interface
// ============================================================================

export interface DealState {
  // Basic property info
  propertyType: PropertyType;
  operationType: OperationType;
  offerType?: OfferType;
  propertyAddress: string;
  agentOwner: string;
  call: string;
  email: string;
  analysisDate: string;
  listedPrice: number;
  purchasePrice: number;
  percentageDifference: number;
  city: string;
  state: string;

  // Financing
  loan: LoanTerms;
  subjectTo: SubjectToInputs;
  hybrid: HybridInputs;
  fixFlip?: FixFlipInputs;
  brrrr?: BRRRRInputs;

  // Operating expenses
  ops: OperatingInputsCommon;

  // Income by property/operation type
  sfr?: IncomeInputsSfr;
  multi?: IncomeInputsMulti;
  str?: IncomeInputsStr;
  enhancedSTR?: EnhancedSTRInputs;
  officeRetail?: OfficeRetailInputs;
  land?: LandInputs;
  arbitrage?: ArbitrageInputs;

  // Appreciation
  appreciation: AppreciationInputs;

  // Settings
  showBothPaybackMethods: boolean;
  paybackCalculationMethod: "initial" | "remaining";
  reservesCalculationMethod: "months" | "fixed";
  reservesMonths: number;
  reservesFixedAmount: number;
  includeVariableExpensesInBreakEven: boolean;
  includeVariablePctInBreakeven?: boolean;
  proFormaPreset: "conservative" | "moderate" | "aggressive" | "custom";
  customProFormaPresets: CustomProFormaPreset[];
  selectedCustomPreset?: string;
  sensitivityAnalysis: SensitivityAnalysis;
  benchmarkComparison: BenchmarkComparison;
  revenueInputs: RevenueInputs;
  breakEvenAnalysis: BreakEvenAnalysis;
  activeProFormaTab:
    | "presets"
    | "custom"
    | "sensitivity"
    | "benchmarks"
    | "revenue"
    | "breakEven";
  marketType: "hot" | "stable" | "slow";

  // Advanced Analysis Configuration
  marketConditions: MarketConditions;
  exitStrategies: ExitStrategy[];
  seasonalFactors: SeasonalFactors;
  propertyAge: PropertyAgeFactors;
  locationFactors: LocationFactors;
  riskFactors: RiskFactors;
  taxImplications: TaxImplications;
  enhancedTaxConfig?: EnhancedTaxImplications;
  useEnhancedTaxCalculation?: boolean;

  // Advanced Analysis Results
  exitStrategyResults?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
  refinanceScenarioResults?: Array<{
    timing: number;
    newMonthlyPayment: number;
    monthlySavings: number;
    totalSavings: number;
    breakEvenMonths: number;
    cashOutAmount: number;
  }>;
  taxImplicationResults?: {
    taxableIncome: number;
    taxSavings: number;
    effectiveTaxRate: number;
    netIncome: number;
  };
  riskScoreResults?: {
    overallRiskScore: number;
    riskBreakdown: {
      marketRisk: number;
      propertyRisk: number;
      tenantRisk: number;
      financingRisk: number;
      locationRisk: number;
    };
    riskCategory: "Low" | "Medium" | "High" | "Very High";
    recommendations: string[];
  };
  confidenceIntervalResults?: {
    lowerBound: number;
    upperBound: number;
    confidenceLevel: number;
  };
  inflationProjections?: {
    [years: number]: {
      adjustedRent: number;
      adjustedExpenses: number;
      adjustedPropertyValue: number;
    };
  };

  // IRR Configuration
  irrHoldPeriodYears: number;
  irrIncomeGrowthRate: number;
  irrExpenseGrowthRate: number;
  irrSellingCostsPct: number;
  showIrrCashFlowBreakdown: boolean;

  // Capital Events
  capitalEvents: CapitalEventInputs;

  // Confidence Intervals
  showConfidenceIntervals: boolean;
  uncertaintyParameters: UncertaintyParameters;

  // 1031 Exchange
  exchange1031?: Exchange1031Inputs;

  // UX/logic helpers
  proFormaAuto: boolean;
  validationMessages: string[];
  showAmortizationOverride?: boolean;
  snackbarOpen?: boolean;
  
  // Pro Forma
  proForma: {
    taxes: number;
    insurance: number;
    maintenance: number;
    vacancy: number;
    management: number;
    capEx: number;
    opEx: number;
  };

  // Toggle states for advanced features
  proFormaEnabled?: boolean;
  advancedModelingEnabled?: boolean;
  cashFlowProjectionsEnabled?: boolean;
}

// ============================================================================
// Amortization Schedule
// ============================================================================

export interface AmortizationRow {
  index: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  isIOPhase?: boolean;
}

