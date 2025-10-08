import { CalculatorMode } from './calculatorMode';

// Property and Operation Types
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

// Subject-To Loan Interface
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

// Subject-To Inputs
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
  loanTerm: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  balloonDue?: number; // Years until balloon payment is due
  interestOnly?: boolean; // Whether this is an interest-only loan
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

export interface LoanTerms {
  downPayment: number;
  loanAmount: number;
  amortizationAmount: number;
  amortizationYears: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  totalInterest: number;
  totalPayment: number;
  balloonDue?: number; // Years until balloon payment is due
  interestOnly: boolean;
  closingCosts?: number;
  rehabCosts?: number;
  ioPeriodMonths?: number; // IO period for hybrid IO loans
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export interface MarketConditions {
  type: "hot" | "stable" | "slow";
  vacancyRateAdjustment: number; // Percentage adjustment to base vacancy rate
  rentGrowthRate: number; // Annual rent growth percentage
  appreciationRate: number; // Annual property appreciation percentage
  capRateAdjustment: number; // Adjustment to cap rate
  inflationRate: number; // Annual inflation rate percentage
  capRate?: number; // Actual cap rate for the market
  marketVolatility?: number; // Market volatility score (1-10)
}

export interface SeasonalFactors {
  summerVacancyRate: number;
  winterVacancyRate: number;
  springVacancyRate: number;
  fallVacancyRate: number;
  seasonalMaintenanceMultiplier: number;
  q1: number; // Q1 occupancy multiplier
  q2: number; // Q2 occupancy multiplier
  q3: number; // Q3 occupancy multiplier
  q4: number; // Q4 occupancy multiplier
}

export interface PropertyAgeFactors {
  age: number;
  maintenanceCostMultiplier: number;
  utilityEfficiencyMultiplier: number;
  insuranceCostMultiplier: number;
  expectedLifespan: number;
}

export interface LocationFactors {
  type: "urban" | "suburban" | "rural";
  propertyTaxRate: number;
  insuranceCostMultiplier: number;
  maintenanceCostMultiplier: number;
  utilityCostMultiplier: number;
  transportationCostMultiplier: number;
}

export interface ExitStrategy {
  timeframe: number;
  sellingCosts: number;
  capitalGainsTax: number;
  depreciationRecapture: number;
  marketAppreciation: number;
}

export interface RefinanceScenario {
  timeframe: number;
  newLoanAmount: number;
  newInterestRate: number;
  closingCosts: number;
  cashOut: number;
  monthlyPayment: number;
  totalCosts: number;
  netBenefit: number;
}

export interface TaxImplications {
  propertyTaxDeduction: boolean;
  mortgageInterestDeduction: boolean;
  depreciationDeduction: boolean;
  repairExpenseDeduction: boolean;
  taxBracket: number;
}

export interface RiskFactors {
  marketVolatility: number;
  tenantQuality: number;
  propertyCondition: number;
  locationStability: number;
  financingRisk: number;
}

// Appreciation Inputs
export interface AppreciationInputs {
  appreciationPercentPerYear: number;
  yearsOfAppreciation: number;
  futurePropertyValue: number;
  refinanceLtv: number;
  refinancePotential: number;
  remainingBalanceAfterRefi: number;
  manuallyOverridden?: boolean; // Track if user manually overrode balloon payment setting
}

// Income Inputs for Different Property Types
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

// Enhanced STR Inputs
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

// Office/Retail Inputs
export interface OfficeRetailInputs {
  squareFootage: number;
  rentPerSFMonthly: number;
  occupancyRatePct: number;
  extraMonthlyIncome: number;
}

// Land Inputs
export interface LandInputs {
  acreage: number;
  zoning?: "Residential" | "Commercial" | "Agricultural" | "Mixed";
  extraMonthlyIncome: number;
}

// Arbitrage Inputs
export interface ArbitrageInputs {
  deposit: number;
  monthlyRentToLandlord: number;
  estimateCostOfRepairs: number;
  furnitureCost: number;
  otherStartupCosts: number;
  startupCostsTotal: number;
}

// Operating Inputs
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

// Metrics with Confidence Intervals
export interface MetricWithConfidence {
  low: number;
  base: number;
  high: number;
  standardDeviation: number;
  confidenceLevel: number;
}

// Uncertainty Parameters
export interface UncertaintyParameters {
  incomeUncertainty: number;
  expenseUncertainty: number;
  occupancyUncertainty: number;
  appreciationUncertainty: number;
  confidenceLevel: number;
}

// Pro Forma Preset
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

// Sensitivity Analysis
export interface SensitivityAnalysis {
  showSensitivity: boolean;
  sensitivityRange: number;
  sensitivitySteps: number;
}

// Benchmark Comparison
export interface BenchmarkComparison {
  showBenchmarks: boolean;
  selectedMarket?: string;
  includeBenchmarks: boolean;
}

// Revenue Inputs
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

// Break-Even Analysis
export interface BreakEvenAnalysis {
  showBreakEven: boolean;
  breakEvenOccupancy: number;
  breakEvenADR: number;
  breakEvenRevenue: number;
  marginOfSafety: number;
}

// Capital Events
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

// 1031 Exchange Inputs
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

// Enhanced Tax Implications
export interface EnhancedTaxImplications extends TaxImplications {
  taxStrategy?: string;
  capitalGainsTaxRate?: number;
  depreciationRecaptureRate?: number;
  stateIncomeTaxRate?: number;
  qualifiedBusinessIncomeDeduction?: boolean;
}

export interface DealState {
  // Basic Property Information
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
  
  // Calculator Mode
  calculatorMode?: CalculatorMode;

  // Market Type
  marketType: "hot" | "stable" | "slow";

  // Loan Information
  loan: LoanTerms;

  // Subject-To Financing
  subjectTo: SubjectToInputs;

  // Hybrid Financing
  hybrid: HybridInputs;

  // Fix & Flip
  fixFlip?: FixFlipInputs;

  // BRRRR
  brrrr?: BRRRRInputs;

  // Operations
  ops: OperatingInputsCommon;

  // Property-Specific Income Inputs
  sfr?: IncomeInputsSfr;
  multi?: IncomeInputsMulti;
  str?: IncomeInputsStr;
  enhancedSTR?: EnhancedSTRInputs;
  officeRetail?: OfficeRetailInputs;
  land?: LandInputs;
  arbitrage?: ArbitrageInputs;

  // Appreciation
  appreciation: AppreciationInputs;

  // Revenue Inputs (for Hotel/STR)
  revenueInputs: RevenueInputs;

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
  proFormaAuto: boolean;

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
  breakEvenAnalysis: BreakEvenAnalysis;
  activeProFormaTab:
    | "presets"
    | "custom"
    | "sensitivity"
    | "benchmarks"
    | "revenue"
    | "breakEven";

  // Advanced Analysis Configuration
  marketConditions: MarketConditions;
  exitStrategies: ExitStrategy[];
  seasonalFactors: SeasonalFactors;
  propertyAge: PropertyAgeFactors;
  locationFactors: LocationFactors;
  riskFactors: RiskFactors;
  taxImplications: TaxImplications;

  // Enhanced tax configuration with IRS compliance
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
    riskCategory: "Low" | "Medium" | "High" | "Very High";
    riskBreakdown: {
      marketRisk: number;
      propertyRisk: number;
      tenantRisk: number;
      financingRisk: number;
      locationRisk: number;
    };
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

  // IRR Configuration Parameters
  irrHoldPeriodYears: number; // Default 5 years
  irrIncomeGrowthRate: number; // Annual income growth % (default 2%)
  irrExpenseGrowthRate: number; // Annual expense growth % (default 3%)
  irrSellingCostsPct: number; // Selling costs as % of sale price (default 7%)
  showIrrCashFlowBreakdown: boolean; // Toggle for cash flow detail view

  // Capital Events
  capitalEvents: CapitalEventInputs;

  // Confidence Intervals
  showConfidenceIntervals: boolean;
  uncertaintyParameters: UncertaintyParameters;

  // 1031 Exchange Calculator
  exchange1031?: Exchange1031Inputs;

  // UX/logic helpers
  validationMessages: string[];
  showAmortizationOverride?: boolean;
  snackbarOpen?: boolean;

  // Inflation Adjustment Configuration
  inflationProjectionYears?: number;
  baseMonthlyRent?: number;

  // Market Data API Integration
  marketDataLoading?: boolean;
  marketDataError?: string | null;
  lastMarketDataUpdate?: string | null;

  // Deal Modification Tracking
  lastModified?: string;

  // Toggle states for advanced features
  proFormaEnabled?: boolean;
  advancedModelingEnabled?: boolean;
}
