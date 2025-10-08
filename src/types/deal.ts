import { CalculatorMode } from './calculatorMode';
import { EnhancedTaxImplications } from '../utils/advancedCalculations';
import { Exchange1031Inputs } from '../components/underwrite/types';

export interface HybridInputs {
  loanAmount: number;
  loanTerm: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  balloonDue?: number; // Years until balloon payment is due
  interestOnly?: boolean; // Whether this is an interest-only loan
  subjectToLoans?: Array<{
    id: string;
    balance: number;
    monthlyPayment: number;
    annualInterestRate: number;
    remainingTermMonths: number;
    balloonDue?: number;
    interestOnly?: boolean;
  }>;
  totalLoanBalance?: number;
  totalMonthlyPayment?: number;
  totalAnnualPayment?: number;
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
  exitStrategies?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
}

export interface LoanTerms {
  loanAmount: number;
  amortizationYears: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  totalInterest: number;
  totalPayment: number;
  balloonDue?: number; // Years until balloon payment is due
  interestOnly?: boolean; // Whether this is an interest-only loan
  downPayment?: number;
  closingCosts?: number;
  rehabCosts?: number;
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
  q1: number;
  q2: number;
  q3: number;
  q4: number;
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

export interface DealState {
  // Basic Property Information
  propertyType:
    | "Single Family"
    | "Multi Family"
    | "Condo"
    | "Townhouse"
    | "Land"
    | "Hotel"
    | "Office"
    | "Retail";
  operationType:
    | "Buy & Hold"
    | "Fix & Flip"
    | "Short Term Rental"
    | "Rental Arbitrage"
    | "BRRRR";
  purchasePrice: number;
  city: string;
  state: string;
  
  // Calculator Mode
  calculatorMode?: CalculatorMode;

  // Financing Type
  offerType?:
    | "Cash"
    | "Conventional"
    | "FHA"
    | "DSCR"
    | "Seller Finance"
    | "Hard Money"
    | "Private"
    | "Subject To Existing Mortgage"
    | "Hybrid"
    | "Line of Credit";

  // Market Type
  marketType: "hot" | "stable" | "slow";

  // Loan Information
  loan: LoanTerms;

  // Subject-To Financing
  subjectTo: {
    loans: Array<{
      id: string;
      balance: number;
      monthlyPayment: number;
      annualInterestRate: number;
      remainingTermMonths: number;
      balloonDue?: number; // Years until balloon payment is due
      interestOnly?: boolean; // Whether this is an interest-only loan
    }>;
    totalBalance: number;
    totalMonthlyPayment: number;
    paymentToSeller?: number;
    totalLoanBalance?: number;
    totalAnnualPayment?: number;
  };

  // Hybrid Financing
  hybrid: HybridInputs;

  // Operations
  ops: {
    taxes: number;
    insurance: number;
    maintenance: number;
    vacancy: number;
    management: number;
    capEx: number;
    opEx: number;
  };

  // Revenue Inputs (for Hotel/STR)
  revenueInputs: {
    totalRooms: number;
    averageDailyRate: number;
    occupancyRate: number;
    seasonalVariations: SeasonalFactors;
  };

  // Income by property/operation type
  sfr?: {
    monthlyRent: number;
    grossMonthlyIncome: number;
    grossYearlyIncome: number;
  };
  multi?: {
    unitRents: number[];
    grossMonthlyIncome: number;
    grossYearlyIncome: number;
  };
  str?: {
    unitDailyRents: number[];
    unitMonthlyRents: number[];
    dailyCleaningFee: number;
    laundry: number;
    activities: number;
    avgNightsPerMonth: number;
    grossDailyIncome: number;
    grossMonthlyIncome: number;
    grossYearlyIncome: number;
  };
  enhancedSTR?: {
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
  };
  officeRetail?: {
    squareFootage: number;
    rentPerSFMonthly: number;
    occupancyRatePct: number;
    extraMonthlyIncome: number;
  };
  land?: {
    acreage: number;
    zoning?: "Residential" | "Commercial" | "Agricultural" | "Mixed";
    extraMonthlyIncome: number;
  };
  arbitrage?: {
    deposit: number;
    monthlyRentToLandlord: number;
    estimateCostOfRepairs: number;
    furnitureCost: number;
    otherStartupCosts: number;
    startupCostsTotal: number;
  };

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

  // Fix & Flip
  fixFlip: FixFlipInputs;

  // BRRRR
  brrrr: BRRRRInputs;

  // Appreciation
  appreciation: {
    appreciationPercentPerYear: number;
    yearsOfAppreciation: number;
    futurePropertyValue: number;
    refinanceLtv: number;
    refinancePotential: number;
    remainingBalanceAfterRefi: number;
    manuallyOverridden?: boolean;
  };

  // Settings
  showBothPaybackMethods: boolean;
  paybackCalculationMethod: "initial" | "remaining";
  reservesCalculationMethod: "months" | "fixed";
  reservesMonths: number;
  reservesFixedAmount: number;
  includeVariableExpensesInBreakEven: boolean;
  includeVariablePctInBreakeven?: boolean;
  proFormaPreset: "conservative" | "moderate" | "aggressive" | "custom";
  customProFormaPresets: Array<{
    id: string;
    name: string;
    description?: string;
    maintenance: number;
    vacancy: number;
    management: number;
    capEx: number;
    opEx: number;
    propertyType: string;
    operationType: string;
    createdAt: Date;
  }>;
  selectedCustomPreset?: string;
  sensitivityAnalysis: {
    showSensitivity: boolean;
    sensitivityRange: number;
    sensitivitySteps: number;
  };
  benchmarkComparison: {
    showBenchmarks: boolean;
    selectedMarket?: string;
    includeBenchmarks: boolean;
  };
  breakEvenAnalysis: {
    showBreakEven: boolean;
    breakEvenOccupancy: number;
    breakEvenADR: number;
    breakEvenRevenue: number;
    marginOfSafety: number;
  };
  activeProFormaTab:
    | "presets"
    | "custom"
    | "sensitivity"
    | "benchmarks"
    | "revenue"
    | "breakEven";

  // IRR Configuration
  irrHoldPeriodYears: number;
  irrIncomeGrowthRate: number;
  irrExpenseGrowthRate: number;
  irrSellingCostsPct: number;
  showIrrCashFlowBreakdown: boolean;

  // Capital Events
  capitalEvents: {
    events: Array<{
      id: string;
      year: number;
      description: string;
      estimatedCost: number;
      category: 'roof' | 'hvac' | 'foundation' | 'electrical' | 'plumbing' | 'other';
      likelihood: number;
    }>;
    totalExpectedCost: number;
    averageAnnualCost: number;
  };

  // Confidence Intervals
  showConfidenceIntervals: boolean;
  uncertaintyParameters: {
    incomeUncertainty: number;
    expenseUncertainty: number;
    occupancyUncertainty: number;
    appreciationUncertainty: number;
    confidenceLevel: number;
  };

  // 1031 Exchange
  exchange1031?: Exchange1031Inputs;

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
  refinanceScenarioResults?: RefinanceScenario[];
  taxImplicationResults?: {
    taxableIncome: number;
    taxSavings: number;
    effectiveTaxRate: number;
    netIncome: number;
  };
  riskScoreResults?: {
    overallRiskScore: number;
    riskCategory: string;
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
    confidenceLevel: number;
    lowerBound: number;
    upperBound: number;
  };
  inflationProjections?: {
    [years: number]: {
      adjustedRent: number;
      adjustedExpenses: number;
      adjustedPropertyValue: number;
    };
  };

  // Inflation Adjustment Configuration
  inflationProjectionYears?: number;
  baseMonthlyRent?: number;

  // Market Data API Integration
  marketDataLoading?: boolean;
  marketDataError?: string | null;
  lastMarketDataUpdate?: string | null;

  // Deal Modification Tracking
  lastModified?: string;

  // UX/logic helpers
  validationMessages: string[];
  showAmortizationOverride?: boolean;
  snackbarOpen?: boolean;
}
