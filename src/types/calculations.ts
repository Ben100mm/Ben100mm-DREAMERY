// Comprehensive TypeScript interfaces for all calculator results

// Exit Strategy Results - based on actual calculateExitStrategies output
export interface ExitStrategyResult {
  timeframe: number;
  projectedValue: number;
  netProceeds: number;
  roi: number;
  annualizedRoi: number;
  // Additional properties that might be present
  totalInvestment?: number;
  netProfit?: number;
  monthlyCashFlow?: number;
  annualCashFlow?: number;
  capRate?: number;
  appreciation?: number;
  sellingCosts?: number;
  confidenceInterval?: {
    lowerBound: number;
    upperBound: number;
    confidenceLevel: number;
  };
}

// Risk Analysis Results - based on actual calculateRiskScore output
export interface RiskAnalysisResult {
  overallRiskScore: number;
  riskBreakdown: {
    marketRisk: number;
    propertyRisk: number;
    tenantRisk: number;
    financingRisk: number;
  };
  riskCategory: "Low" | "Medium" | "High" | "Very High";
  recommendations: string[];
  // Additional properties that might be present
  overallScore?: number;
  marketRisk?: {
    score: number;
    factors: string[];
    mitigation: string[];
  };
  propertyRisk?: {
    score: number;
    factors: string[];
    mitigation: string[];
  };
  tenantRisk?: {
    score: number;
    factors: string[];
    mitigation: string[];
  };
  financingRisk?: {
    score: number;
    factors: string[];
    mitigation: string[];
  };
  confidenceInterval?: {
    lowerBound: number;
    upperBound: number;
    confidenceLevel: number;
  };
}

// Tax Implications Results - based on actual calculateTaxImplications output
export interface TaxImplicationsResult {
  taxableIncome: number;
  taxSavings: number;
  effectiveTaxRate: number;
  netIncome: number;
  // Additional properties that might be present
  annualIncome?: number;
  propertyExpenses?: number;
  taxLiability?: number;
  deductions?: {
    mortgageInterest: number;
    propertyTax: number;
    insurance: number;
    maintenance: number;
    depreciation: number;
    other: number;
  };
  netIncomeAfterTax?: number;
  marginalTaxRate?: number;
}

// Refinance Scenarios Results
export interface RefinanceScenarioResult {
  scenario: string;
  currentLoan: {
    balance: number;
    rate: number;
    payment: number;
    remainingTerm: number;
  };
  newLoan: {
    balance: number;
    rate: number;
    payment: number;
    term: number;
    closingCosts: number;
  };
  savings: {
    monthlyPayment: number;
    totalInterest: number;
    breakEvenMonths: number;
    netPresentValue: number;
  };
  cashOut?: {
    amount: number;
    newPayment: number;
    paymentIncrease: number;
  };
}

// Seasonal Adjustments Results
export interface SeasonalAdjustmentsResult {
  monthlyAdjustments: {
    [month: string]: {
      vacancyRate: number;
      maintenanceCosts: number;
      utilityCosts: number;
      propertyManagement: number;
    };
  };
  annualTotals: {
    totalVacancy: number;
    totalMaintenance: number;
    totalUtilities: number;
    totalManagement: number;
  };
  seasonalFactors: {
    peakSeason: string[];
    offSeason: string[];
    transitionMonths: string[];
  };
}

// Market Conditions Results
export interface MarketConditionsResult {
  marketType: "hot" | "stable" | "slow";
  adjustments: {
    rentGrowth: number;
    appreciation: number;
    vacancyRate: number;
    daysOnMarket: number;
    capRate: number;
  };
  localFactors: {
    employment: number;
    populationGrowth: number;
    newConstruction: number;
    infrastructure: number;
  };
  marketTrends: {
    direction: "up" | "down" | "stable";
    strength: number;
    confidence: number;
  };
}

// Sensitivity Analysis Results
export interface SensitivityAnalysisResult {
  baseCase: {
    roi: number;
    cashFlow: number;
    breakEven: number;
  };
  variations: {
    [variable: string]: {
      low: {
        roi: number;
        cashFlow: number;
        breakEven: number;
      };
      high: {
        roi: number;
        cashFlow: number;
        breakEven: number;
      };
      impact: number;
    };
  };
  keyDrivers: string[];
  riskFactors: string[];
}

// Stress Testing Results
export interface StressTestingResult {
  scenarios: {
    [scenario: string]: {
      description: string;
      probability: number;
      impact: {
        roi: number;
        cashFlow: number;
        breakEven: number;
        riskScore: number;
      };
      mitigation: string[];
    };
  };
  worstCase: {
    roi: number;
    cashFlow: number;
    breakEven: number;
    riskScore: number;
    probability: number;
  };
  recommendations: string[];
}

// Inflation Adjustments Results
export interface InflationAdjustmentsResult {
  baseAmounts: {
    rent: number;
    expenses: number;
    propertyValue: number;
  };
  adjustedAmounts: {
    rent: number;
    expenses: number;
    propertyValue: number;
  };
  projections: {
    [year: number]: {
      rent: number;
      expenses: number;
      propertyValue: number;
      inflationRate: number;
    };
  };
  insights: {
    rentInflationImpact: number;
    expenseInflationImpact: number;
    valueAppreciation: number;
    realIncomeChange: number;
  };
}

// Scenario Comparison Results
export interface ScenarioComparisonResult {
  scenarios: {
    [name: string]: {
      timestamp: string;
      dealState: any;
      results: Partial<CalculatorResults>;
      summary: {
        roi: number;
        cashFlow: number;
        riskScore: number;
        breakEven: number;
      };
    };
  };
  comparison: {
    bestRoi: string;
    bestCashFlow: string;
    lowestRisk: string;
    fastestBreakEven: string;
  };
  recommendations: string[];
}

// Main Calculator Results Type
export interface CalculatorResults {
  exit: ExitStrategyResult[];
  risk: RiskAnalysisResult;
  tax: TaxImplicationsResult;
  refinance: RefinanceScenarioResult[];
  seasonal: SeasonalAdjustmentsResult;
  market: MarketConditionsResult;
  sensitivity: SensitivityAnalysisResult;
  stress: StressTestingResult;
  inflation: InflationAdjustmentsResult;
  scenarios: ScenarioComparisonResult;
}

// Partial results for incomplete calculations
export type PartialCalculatorResults = Partial<CalculatorResults>;

// Result type for individual calculator functions
export type CalculatorResult<T extends keyof CalculatorResults> =
  CalculatorResults[T];

// Utility types for specific calculations
export type ExitStrategyResults = CalculatorResults["exit"];
export type RiskAnalysisResults = CalculatorResults["risk"];
export type TaxImplicationsResults = CalculatorResults["tax"];
export type RefinanceScenarioResults = CalculatorResults["refinance"];
export type SeasonalAdjustmentsResults = CalculatorResults["seasonal"];
export type MarketConditionsResults = CalculatorResults["market"];
export type SensitivityAnalysisResults = CalculatorResults["sensitivity"];
export type StressTestingResults = CalculatorResults["stress"];
export type InflationAdjustmentsResults = CalculatorResults["inflation"];
export type ScenarioComparisonResults = CalculatorResults["scenarios"];

// Type guards for checking result completeness
export const isCompleteExitResults = (
  results: any,
): results is ExitStrategyResult[] => {
  return (
    Array.isArray(results) &&
    results.length > 0 &&
    results.every((r) => r.timeframe && r.projectedValue && r.roi)
  );
};

export const isCompleteRiskResults = (
  results: any,
): results is RiskAnalysisResult => {
  return (
    results &&
    typeof results.overallRiskScore === "number" &&
    results.riskBreakdown &&
    results.riskCategory
  );
};

export const isCompleteTaxResults = (
  results: any,
): results is TaxImplicationsResult => {
  return (
    results &&
    typeof results.taxableIncome === "number" &&
    typeof results.effectiveTaxRate === "number"
  );
};

// Helper function to get result type from key
export const getResultType = <K extends keyof CalculatorResults>(
  key: K,
): CalculatorResults[K] => {
  // This is a type helper - actual implementation would depend on context
  throw new Error(
    `getResultType is a type helper and should not be called directly`,
  );
};
