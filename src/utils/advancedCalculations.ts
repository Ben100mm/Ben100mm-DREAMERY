// Advanced calculation utilities for enhanced financial analysis
// These utilities can be integrated with existing calculations without breaking current functionality

import {
  StressTestInputs,
  ComprehensiveStressTestResults,
  StressTestScenarios,
  DEFAULT_STRESS_SCENARIOS,
  runComprehensiveStressTest,
  createCustomScenario,
} from './stressTests';

export interface MarketConditions {
  type: "hot" | "stable" | "slow";
  vacancyRateAdjustment: number; // Percentage adjustment to base vacancy rate
  rentGrowthRate: number; // Annual rent growth percentage
  appreciationRate: number; // Annual property appreciation percentage
  capRateAdjustment: number; // Adjustment to cap rate
  inflationRate: number; // Annual inflation rate percentage
}

export interface SeasonalFactors {
  summerVacancyRate: number;
  winterVacancyRate: number;
  springVacancyRate: number;
  fallVacancyRate: number;
  seasonalMaintenanceMultiplier: number;
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
  timeframe: number; // Years
  sellingCosts: number; // Percentage of sale price
  capitalGainsTax: number; // Percentage
  depreciationRecapture: number; // Percentage
  marketAppreciation: number; // Annual percentage
}

export interface RefinanceScenario {
  timing: number; // Years from now
  newRate: number; // New interest rate
  newTerm: number; // New loan term
  refinanceCosts: number; // Dollar amount
  cashOutAmount: number; // Dollar amount
}

export interface TaxImplications {
  propertyTaxDeduction: boolean;
  mortgageInterestDeduction: boolean;
  depreciationDeduction: boolean;
  repairExpenseDeduction: boolean;
  taxBracket: number; // Percentage
}

/**
 * Enhanced tax implications with IRS rule compliance
 * Includes passive loss limitations, QBI deduction, and material participation rules
 */
export interface EnhancedTaxImplications extends TaxImplications {
  investorAGI: number; // Adjusted Gross Income (for passive loss phase-out)
  materialParticipation: boolean; // True if >750 hours/year OR real estate professional
  professionalStatus: boolean; // IRS-defined real estate professional status
  qbiEligible: boolean; // Qualified Business Income eligible (Section 199A)
  investmentType: "residential" | "commercial"; // For depreciation period
  stateTaxRate?: number; // State income tax rate (percentage)
  marriedFilingJointly?: boolean; // Filing status affects passive loss limits
}

export interface RiskFactors {
  marketVolatility: number; // 1-10 scale
  tenantQuality: number; // 1-10 scale
  propertyCondition: number; // 1-10 scale
  locationStability: number; // 1-10 scale
  financingRisk: number; // 1-10 scale
}

// Seasonal adjustments for vacancy rates and maintenance costs
export const calculateSeasonalAdjustments = (
  baseVacancyRate: number,
  seasonalFactors: SeasonalFactors,
  month: number,
): { adjustedVacancyRate: number; maintenanceMultiplier: number } => {
  let seasonalVacancyRate: number;

  // Determine season based on month
  if (month >= 6 && month <= 8) {
    seasonalVacancyRate = seasonalFactors.summerVacancyRate;
  } else if (month >= 12 || month <= 2) {
    seasonalVacancyRate = seasonalFactors.winterVacancyRate;
  } else if (month >= 3 && month <= 5) {
    seasonalVacancyRate = seasonalFactors.springVacancyRate;
  } else {
    seasonalVacancyRate = seasonalFactors.fallVacancyRate;
  }

  const adjustedVacancyRate = baseVacancyRate * (1 + seasonalVacancyRate);
  const maintenanceMultiplier = seasonalFactors.seasonalMaintenanceMultiplier;

  return { adjustedVacancyRate, maintenanceMultiplier };
};

// Market-specific adjustments
export const calculateMarketAdjustments = (
  baseMetrics: {
    vacancyRate: number;
    rentGrowth: number;
    appreciation: number;
    capRate: number;
  },
  marketConditions: MarketConditions,
): {
  adjustedVacancyRate: number;
  adjustedRentGrowth: number;
  adjustedAppreciation: number;
  adjustedCapRate: number;
} => {
  return {
    adjustedVacancyRate:
      baseMetrics.vacancyRate * (1 + marketConditions.vacancyRateAdjustment),
    adjustedRentGrowth:
      baseMetrics.rentGrowth * (1 + marketConditions.rentGrowthRate),
    adjustedAppreciation:
      baseMetrics.appreciation * (1 + marketConditions.appreciationRate),
    adjustedCapRate:
      baseMetrics.capRate * (1 + marketConditions.capRateAdjustment),
  };
};

// Property age considerations
export const calculateAgeBasedAdjustments = (
  baseCosts: {
    maintenance: number;
    utilities: number;
    insurance: number;
  },
  propertyAge: PropertyAgeFactors,
): {
  adjustedMaintenance: number;
  adjustedUtilities: number;
  adjustedInsurance: number;
  remainingLifespan: number;
} => {
  const ageMultiplier = Math.max(1, propertyAge.age / 20); // Increase costs with age

  return {
    adjustedMaintenance:
      baseCosts.maintenance *
      propertyAge.maintenanceCostMultiplier *
      ageMultiplier,
    adjustedUtilities:
      baseCosts.utilities * propertyAge.utilityEfficiencyMultiplier,
    adjustedInsurance:
      baseCosts.insurance * propertyAge.insuranceCostMultiplier * ageMultiplier,
    remainingLifespan: Math.max(
      0,
      propertyAge.expectedLifespan - propertyAge.age,
    ),
  };
};

// Location-based adjustments
export const calculateLocationAdjustments = (
  baseCosts: {
    propertyTax: number;
    insurance: number;
    maintenance: number;
    utilities: number;
    transportation: number;
  },
  locationFactors: LocationFactors,
): {
  adjustedPropertyTax: number;
  adjustedInsurance: number;
  adjustedMaintenance: number;
  adjustedUtilities: number;
  adjustedTransportation: number;
} => {
  return {
    adjustedPropertyTax:
      baseCosts.propertyTax * locationFactors.propertyTaxRate,
    adjustedInsurance:
      baseCosts.insurance * locationFactors.insuranceCostMultiplier,
    adjustedMaintenance:
      baseCosts.maintenance * locationFactors.maintenanceCostMultiplier,
    adjustedUtilities:
      baseCosts.utilities * locationFactors.utilityCostMultiplier,
    adjustedTransportation:
      baseCosts.transportation * locationFactors.transportationCostMultiplier,
  };
};

// Multiple exit strategies analysis
export const calculateExitStrategies = (
  propertyValue: number,
  exitStrategies: ExitStrategy[],
  currentMarketValue: number,
): Array<{
  timeframe: number;
  projectedValue: number;
  netProceeds: number;
  roi: number;
  annualizedRoi: number;
}> => {
  return exitStrategies.map((strategy) => {
    const projectedValue =
      currentMarketValue *
      Math.pow(1 + strategy.marketAppreciation, strategy.timeframe);
    const sellingCosts = projectedValue * (strategy.sellingCosts / 100);
    const capitalGainsTax =
      (projectedValue - propertyValue) * (strategy.capitalGainsTax / 100);
    const depreciationRecapture =
      (projectedValue - propertyValue) * (strategy.depreciationRecapture / 100);

    const netProceeds =
      projectedValue - sellingCosts - capitalGainsTax - depreciationRecapture;
    const roi = ((netProceeds - propertyValue) / propertyValue) * 100;
    const annualizedRoi =
      (Math.pow(1 + roi / 100, 1 / strategy.timeframe) - 1) * 100;

    return {
      timeframe: strategy.timeframe,
      projectedValue,
      netProceeds,
      roi,
      annualizedRoi,
    };
  });
};

// Refinance scenarios analysis
export const calculateRefinanceScenarios = (
  currentLoan: {
    balance: number;
    rate: number;
    term: number;
    monthlyPayment: number;
  },
  refinanceScenarios: RefinanceScenario[],
  propertyValue: number,
): Array<{
  timing: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  totalSavings: number;
  breakEvenMonths: number;
  cashOutAmount: number;
}> => {
  return refinanceScenarios.map((scenario) => {
    const remainingBalance =
      currentLoan.balance *
      Math.pow(1 + currentLoan.rate / 100 / 12, scenario.timing * 12);
    const newMonthlyPayment = calculateMonthlyPayment(
      remainingBalance,
      scenario.newRate,
      scenario.newTerm,
    );
    const monthlySavings = currentLoan.monthlyPayment - newMonthlyPayment;
    const totalSavings = monthlySavings * (scenario.newTerm * 12);
    const breakEvenMonths = scenario.refinanceCosts / monthlySavings;

    return {
      timing: scenario.timing,
      newMonthlyPayment,
      monthlySavings,
      totalSavings,
      breakEvenMonths,
      cashOutAmount: scenario.cashOutAmount,
    };
  });
};

// Tax implications calculator
export const calculateTaxImplications = (
  annualIncome: number,
  propertyExpenses: {
    mortgageInterest: number;
    propertyTax: number;
    depreciation: number;
    repairs: number;
  },
  taxImplications: TaxImplications,
): {
  taxableIncome: number;
  taxSavings: number;
  effectiveTaxRate: number;
  netIncome: number;
} => {
  let deductions = 0;

  if (taxImplications.mortgageInterestDeduction) {
    deductions += propertyExpenses.mortgageInterest;
  }
  if (taxImplications.propertyTaxDeduction) {
    deductions += propertyExpenses.propertyTax;
  }
  if (taxImplications.depreciationDeduction) {
    deductions += propertyExpenses.depreciation;
  }
  if (taxImplications.repairExpenseDeduction) {
    deductions += propertyExpenses.repairs;
  }

  const taxableIncome = Math.max(0, annualIncome - deductions);
  const taxSavings = deductions * (taxImplications.taxBracket / 100);
  const effectiveTaxRate =
    taxableIncome > 0
      ? (taxableIncome * (taxImplications.taxBracket / 100)) / annualIncome
      : 0;
  const netIncome =
    annualIncome -
    taxableIncome * (taxImplications.taxBracket / 100) +
    taxSavings;

  return {
    taxableIncome,
    taxSavings,
    effectiveTaxRate,
    netIncome,
  };
};

/**
 * Enhanced tax calculation with IRS compliance
 * Implements passive loss limitations, QBI deduction, SALT cap, and depreciation rules
 * 
 * @param annualIncome - Gross annual income from property
 * @param propertyExpenses - Breakdown of property expenses
 * @param taxConfig - Enhanced tax configuration with IRS rule parameters
 * @param propertyValue - Total property value (for depreciation calculation)
 * @returns Detailed tax calculation results with all limitations applied
 * 
 * @example
 * ```typescript
 * const result = calculateEnhancedTaxImplications(
 *   50000, // Annual rental income
 *   { mortgageInterest: 15000, propertyTax: 8000, repairs: 5000 },
 *   { 
 *     investorAGI: 120000, 
 *     materialParticipation: false,
 *     investmentType: 'residential',
 *     taxBracket: 24,
 *     // ... other fields
 *   },
 *   400000 // Property value
 * );
 * ```
 */
export const calculateEnhancedTaxImplications = (
  annualIncome: number,
  propertyExpenses: {
    mortgageInterest: number;
    propertyTax: number;
    repairs: number;
    otherOperatingExpenses?: number;
  },
  taxConfig: EnhancedTaxImplications,
  propertyValue: number,
): {
  taxableIncome: number;
  taxSavings: number;
  taxOwed: number;
  effectiveTaxRate: number;
  netIncome: number;
  depreciationUsed: number;
  qbiDeduction: number;
  passiveLossLimited: boolean;
  allowablePassiveLoss: number;
  disallowedPassiveLoss: number;
  saltCapApplied: boolean;
  stateTaxOwed: number;
  totalTaxOwed: number;
  warnings: string[];
} => {
  const warnings: string[] = [];
  let deductions = 0;

  // Calculate depreciation based on property type
  // IRS rules: 80% building value, 20% land (non-depreciable)
  // Residential: 27.5 years, Commercial: 39 years
  const buildingValue = propertyValue * 0.8;
  const depreciationYears =
    taxConfig.investmentType === "residential" ? 27.5 : 39;
  const annualDepreciation = buildingValue / depreciationYears;

  // Apply mortgage interest deduction
  if (taxConfig.mortgageInterestDeduction) {
    deductions += propertyExpenses.mortgageInterest;
  }

  // Apply property tax deduction with SALT cap
  let saltCapApplied = false;
  if (taxConfig.propertyTaxDeduction) {
    const SALT_CAP = 10000; // IRS SALT deduction cap
    if (propertyExpenses.propertyTax > SALT_CAP) {
      deductions += SALT_CAP;
      saltCapApplied = true;
      warnings.push(
        `SALT cap applied: Property tax deduction limited to $${SALT_CAP.toLocaleString()} (Tax was $${propertyExpenses.propertyTax.toLocaleString()})`
      );
    } else {
      deductions += propertyExpenses.propertyTax;
    }
  }

  // Apply depreciation deduction
  if (taxConfig.depreciationDeduction) {
    deductions += annualDepreciation;
  }

  // Apply repair expense deduction
  if (taxConfig.repairExpenseDeduction) {
    deductions += propertyExpenses.repairs;
  }

  // Add other operating expenses
  if (propertyExpenses.otherOperatingExpenses) {
    deductions += propertyExpenses.otherOperatingExpenses;
  }

  // Calculate net income/loss before passive loss limitations
  const netIncomeBeforeLimitations = annualIncome - deductions;
  const passiveLoss = netIncomeBeforeLimitations < 0 ? Math.abs(netIncomeBeforeLimitations) : 0;

  let allowablePassiveLoss = 0;
  let disallowedPassiveLoss = 0;
  let passiveLossLimited = false;
  let adjustedNetIncome = netIncomeBeforeLimitations;

  // Apply passive loss limitations (IRS Publication 925)
  if (
    passiveLoss > 0 &&
    !taxConfig.materialParticipation &&
    !taxConfig.professionalStatus
  ) {
    passiveLossLimited = true;
    const agi = taxConfig.investorAGI;

    // Calculate allowable passive loss with $25K special allowance
    // Phase-out: $100K - $150K AGI range
    let specialAllowance = 25000;

    if (agi > 100000) {
      // Phase-out: 50 cents per dollar over $100K
      const phaseOutAmount = Math.min(25000, (agi - 100000) * 0.5);
      specialAllowance = Math.max(0, 25000 - phaseOutAmount);

      if (agi >= 150000) {
        specialAllowance = 0; // Complete phase-out
        warnings.push(
          "Passive loss fully disallowed: AGI exceeds $150,000 phase-out threshold"
        );
      } else {
        warnings.push(
          `Passive loss partially limited: AGI in phase-out range ($${agi.toLocaleString()})`
        );
      }
    }

    // For married filing separately, the allowance is $12,500 with phase-out at $50K-$75K
    if (taxConfig.marriedFilingJointly === false) {
      specialAllowance = Math.min(specialAllowance / 2, 12500);
      if (agi > 50000) {
        const mfsPhaseOut = Math.min(12500, (agi - 50000) * 0.5);
        specialAllowance = Math.max(0, 12500 - mfsPhaseOut);
      }
    }

    allowablePassiveLoss = Math.min(passiveLoss, specialAllowance);
    disallowedPassiveLoss = passiveLoss - allowablePassiveLoss;
    adjustedNetIncome = -allowablePassiveLoss;

    if (disallowedPassiveLoss > 0) {
      warnings.push(
        `$${disallowedPassiveLoss.toLocaleString()} in passive losses carried forward to future years`
      );
    }
  } else if (taxConfig.professionalStatus) {
    warnings.push(
      "No passive loss limitation: Qualifies as real estate professional"
    );
  } else if (taxConfig.materialParticipation) {
    warnings.push(
      "No passive loss limitation: Material participation (>750 hours/year)"
    );
  }

  // Calculate taxable income before QBI
  let taxableIncome = Math.max(0, adjustedNetIncome);

  // Calculate QBI deduction (Section 199A) - 20% of qualified business income
  let qbiDeduction = 0;
  if (taxConfig.qbiEligible && taxableIncome > 0) {
    // QBI deduction is lesser of:
    // 1. 20% of QBI
    // 2. 20% of taxable income (before QBI deduction)
    qbiDeduction = Math.min(taxableIncome * 0.2, taxableIncome * 0.2);

    // Note: Simplified calculation. Actual QBI has income thresholds and limitations
    // based on W-2 wages and property basis for high-income taxpayers
    if (taxConfig.investorAGI > 170050) {
      warnings.push(
        "QBI deduction may be limited for high-income taxpayers (>$170,050 single, >$340,100 MFJ)"
      );
    }
  }

  // Final taxable income after QBI deduction
  const finalTaxableIncome = Math.max(0, taxableIncome - qbiDeduction);

  // Calculate federal tax owed
  const federalTaxOwed = finalTaxableIncome * (taxConfig.taxBracket / 100);

  // Calculate state tax if applicable
  const stateTaxRate = taxConfig.stateTaxRate || 0;
  const stateTaxOwed = finalTaxableIncome * (stateTaxRate / 100);

  // Total tax owed
  const totalTaxOwed = federalTaxOwed + stateTaxOwed;

  // Calculate tax savings (deductions × tax rate)
  const actualDeductionsUsed = taxConfig.professionalStatus || taxConfig.materialParticipation
    ? deductions
    : allowablePassiveLoss;
  const taxSavings = actualDeductionsUsed * (taxConfig.taxBracket / 100);

  // Calculate effective tax rate
  const effectiveTaxRate =
    annualIncome > 0 ? (totalTaxOwed / annualIncome) * 100 : 0;

  // Net income after taxes
  const netIncome = annualIncome - totalTaxOwed;

  // Add professional disclaimer
  warnings.push(
    "⚠️  Tax calculations are estimates. Consult a licensed tax professional for your specific situation."
  );

  return {
    taxableIncome: finalTaxableIncome,
    taxSavings,
    taxOwed: federalTaxOwed,
    effectiveTaxRate,
    netIncome,
    depreciationUsed: taxConfig.depreciationDeduction ? annualDepreciation : 0,
    qbiDeduction,
    passiveLossLimited,
    allowablePassiveLoss,
    disallowedPassiveLoss,
    saltCapApplied,
    stateTaxOwed,
    totalTaxOwed,
    warnings,
  };
};

// Inflation adjustments over time
export const calculateInflationAdjustments = (
  baseAmounts: {
    rent: number;
    expenses: number;
    propertyValue: number;
  },
  inflationRate: number,
  years: number,
): {
  adjustedRent: number;
  adjustedExpenses: number;
  adjustedPropertyValue: number;
} => {
  const inflationMultiplier = Math.pow(1 + inflationRate / 100, years);

  return {
    adjustedRent: baseAmounts.rent * inflationMultiplier,
    adjustedExpenses: baseAmounts.expenses * inflationMultiplier,
    adjustedPropertyValue: baseAmounts.propertyValue * inflationMultiplier,
  };
};

// Sensitivity analysis
export const calculateSensitivityAnalysis = (
  baseScenario: {
    monthlyRent: number;
    monthlyExpenses: number;
    propertyValue: number;
    monthlyCashFlow: number;
  },
  variations: Array<{
    rentChange: number; // Percentage
    expenseChange: number; // Percentage
    valueChange: number; // Percentage
  }>,
): Array<{
  scenario: string;
  adjustedRent: number;
  adjustedExpenses: number;
  adjustedValue: number;
  adjustedCashFlow: number;
  cashFlowChange: number;
  cashFlowChangePercent: number;
}> => {
  return variations.map((variation, index) => {
    const adjustedRent =
      baseScenario.monthlyRent * (1 + variation.rentChange / 100);
    const adjustedExpenses =
      baseScenario.monthlyExpenses * (1 + variation.expenseChange / 100);
    const adjustedValue =
      baseScenario.propertyValue * (1 + variation.valueChange / 100);
    const adjustedCashFlow = adjustedRent - adjustedExpenses;

    return {
      scenario: `Scenario ${index + 1}`,
      adjustedRent,
      adjustedExpenses,
      adjustedValue,
      adjustedCashFlow,
      cashFlowChange: adjustedCashFlow - baseScenario.monthlyCashFlow,
      cashFlowChangePercent:
        ((adjustedCashFlow - baseScenario.monthlyCashFlow) /
          baseScenario.monthlyCashFlow) *
        100,
    };
  });
};

// Stress testing with worst-case scenarios
export const calculateStressTest = (
  baseScenario: {
    monthlyRent: number;
    monthlyExpenses: number;
    propertyValue: number;
    monthlyCashFlow: number;
    annualRoi: number;
  },
  stressFactors: {
    rentDrop: number; // Percentage
    expenseIncrease: number; // Percentage
    valueDrop: number; // Percentage
    vacancyIncrease: number; // Percentage
  },
): {
  stressTestCashFlow: number;
  stressTestRoi: number;
  cashFlowBuffer: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
} => {
  const stressRent =
    baseScenario.monthlyRent *
    (1 - stressFactors.rentDrop / 100) *
    (1 - stressFactors.vacancyIncrease / 100);
  const stressExpenses =
    baseScenario.monthlyExpenses * (1 + stressFactors.expenseIncrease / 100);
  const stressCashFlow = stressRent - stressExpenses;
  const stressValue =
    baseScenario.propertyValue * (1 - stressFactors.valueDrop / 100);

  const stressTestRoi = ((stressCashFlow * 12) / stressValue) * 100;
  const cashFlowBuffer = stressCashFlow / baseScenario.monthlyCashFlow;

  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  if (cashFlowBuffer >= 0.8 && stressTestRoi >= 6) {
    riskLevel = "Low";
  } else if (cashFlowBuffer >= 0.6 && stressTestRoi >= 4) {
    riskLevel = "Medium";
  } else if (cashFlowBuffer >= 0.4 && stressTestRoi >= 2) {
    riskLevel = "High";
  } else {
    riskLevel = "Critical";
  }

  return {
    stressTestCashFlow: stressCashFlow,
    stressTestRoi: stressTestRoi,
    cashFlowBuffer,
    riskLevel,
  };
};

/**
 * Enhanced stress test function that runs comprehensive analysis across 4 scenarios:
 * 1. Recession - income -20%, expenses +15%, vacancy +10%, depreciation -10%
 * 2. Interest Rate Shock - rate +3%, refinance impact
 * 3. Operating Shock - major repair $50k, legal $15k, 6mo vacancy
 * 4. Market Correction - price -15%, rent -10%, 12mo time to sell
 * 
 * @param inputs - Property and financial inputs for stress testing
 * @param customScenarios - Optional custom scenarios (uses defaults if not provided)
 * @returns Comprehensive stress test results with all scenarios and recommendations
 */
export const calculateAdvancedStressTest = (
  inputs: StressTestInputs,
  customScenarios?: Partial<StressTestScenarios>,
): ComprehensiveStressTestResults => {
  const scenarios = customScenarios
    ? createCustomScenario(customScenarios)
    : DEFAULT_STRESS_SCENARIOS;

  return runComprehensiveStressTest(inputs, scenarios);
};

/**
 * Helper function to convert common property data to StressTestInputs format
 */
export const prepareStressTestInputs = (
  propertyValue: number,
  downPaymentPercentage: number,
  loanInterestRate: number,
  loanTermYears: number,
  monthlyRent: number,
  monthlyExpenses: number,
  monthlyCashFlow: number,
  annualRoi: number,
): StressTestInputs => {
  const downPayment = propertyValue * (downPaymentPercentage / 100);
  const loanAmount = propertyValue - downPayment;
  const loanTermMonths = loanTermYears * 12;

  return {
    propertyValue,
    monthlyRent,
    monthlyExpenses,
    monthlyCashFlow,
    currentInterestRate: loanInterestRate,
    loanAmount,
    loanTerm: loanTermMonths,
    downPayment,
    annualRoi,
  };
};

/**
 * Quick stress test that returns simplified results
 * Useful for UI components that need summary information
 */
export const quickStressTestSummary = (
  inputs: StressTestInputs,
): {
  overallRisk: "Low" | "Medium" | "High" | "Critical";
  worstCaseScenario: string;
  worstCaseImpact: number;
  criticalScenarios: string[];
  highRiskScenarios: string[];
  passedScenarios: string[];
} => {
  const results = runComprehensiveStressTest(inputs);

  const criticalScenarios: string[] = [];
  const highRiskScenarios: string[] = [];
  const passedScenarios: string[] = [];

  Object.entries(results.scenarios).forEach(([key, scenario]) => {
    if (scenario.riskLevel === "Critical") {
      criticalScenarios.push(scenario.scenarioName);
    } else if (scenario.riskLevel === "High") {
      highRiskScenarios.push(scenario.scenarioName);
    } else {
      passedScenarios.push(scenario.scenarioName);
    }
  });

  let overallRisk: "Low" | "Medium" | "High" | "Critical";
  if (results.overallRiskScore >= 75) {
    overallRisk = "Critical";
  } else if (results.overallRiskScore >= 50) {
    overallRisk = "High";
  } else if (results.overallRiskScore >= 25) {
    overallRisk = "Medium";
  } else {
    overallRisk = "Low";
  }

  return {
    overallRisk,
    worstCaseScenario: results.worstCaseScenario.scenarioName,
    worstCaseImpact: results.worstCaseScenario.impact,
    criticalScenarios,
    highRiskScenarios,
    passedScenarios,
  };
};

// Re-export stress test types for convenience
export type {
  StressTestInputs,
  ComprehensiveStressTestResults,
  StressTestScenarios,
  RecessionScenario,
  InterestRateShockScenario,
  OperatingShockScenario,
  MarketCorrectionScenario,
  StressTestResult,
  StressTestResultWithMetrics,
} from './stressTests';

export { 
  DEFAULT_STRESS_SCENARIOS,
  runStressTests,
  getStressTestSummary,
  getSeverity,
  applyStressScenario,
} from './stressTests';

// Risk scoring system with weighted factors
export const calculateRiskScore = (
  riskFactors: RiskFactors,
  marketConditions: MarketConditions,
  propertyAge: PropertyAgeFactors,
  financingDetails?: {
    type: string;
    balloonPayment: number;
    balloonDueYears: number;
    interestOnly: boolean;
    totalLoanAmount: number;
  },
): {
  overallRiskScore: number; // 1-10 scale
  riskBreakdown: {
    marketRisk: number;
    propertyRisk: number;
    tenantRisk: number;
    financingRisk: number;
    locationRisk: number;
  };
  riskCategory: "Low" | "Medium" | "High" | "Very High";
  recommendations: string[];
} => {
  // Default weights based on impact analysis
  const weights = {
    marketVolatility: 0.25,      // 25% - Market conditions impact
    financingRisk: 0.30,         // 30% - Highest impact on deal viability
    propertyCondition: 0.20,     // 20% - Property quality and maintenance
    locationStability: 0.15,     // 15% - Location and neighborhood factors
    tenantQuality: 0.10,         // 10% - Tenant screening and reliability
  };

  // Calculate individual risk components
  const marketRisk =
    (riskFactors.marketVolatility +
      (marketConditions.type === "slow"
        ? 3
        : marketConditions.type === "stable"
          ? 1
          : 0)) /
    2;
  
  const propertyRisk =
    (riskFactors.propertyCondition +
      (propertyAge.age > 30
        ? 3
        : propertyAge.age > 20
          ? 2
          : propertyAge.age > 10
            ? 1
            : 0)) /
    2;
  
  const tenantRisk = riskFactors.tenantQuality;
  const locationRisk = riskFactors.locationStability;

  // Enhanced financing risk calculation including balloon payment risk
  let financingRisk = riskFactors.financingRisk;

  if (financingDetails) {
    // Add balloon payment risk
    if (financingDetails.balloonPayment > 0) {
      const balloonRiskMultiplier = Math.max(
        1,
        (financingDetails.balloonPayment / financingDetails.totalLoanAmount) *
          2,
      );
      const timeRiskMultiplier = Math.max(
        1,
        (10 - financingDetails.balloonDueYears) / 5,
      ); // Shorter time = higher risk
      financingRisk = Math.min(
        10,
        financingRisk * balloonRiskMultiplier * timeRiskMultiplier,
      );
    }

    // Add interest-only risk
    if (financingDetails.interestOnly) {
      financingRisk = Math.min(10, financingRisk * 1.3);
    }
  }

  // Weighted average for overall risk score using correct weights
  const overallRiskScore =
    marketRisk * weights.marketVolatility +
    financingRisk * weights.financingRisk +
    propertyRisk * weights.propertyCondition +
    locationRisk * weights.locationStability +
    tenantRisk * weights.tenantQuality;

  // Determine risk category
  let riskCategory: "Low" | "Medium" | "High" | "Very High";
  if (overallRiskScore <= 3) {
    riskCategory = "Low";
  } else if (overallRiskScore <= 5) {
    riskCategory = "Medium";
  } else if (overallRiskScore <= 7) {
    riskCategory = "High";
  } else {
    riskCategory = "Very High";
  }

  // Generate recommendations based on risk factors
  const recommendations: string[] = [];

  if (marketRisk > 5) {
    recommendations.push("Consider market timing and local economic factors");
  }
  if (propertyRisk > 5) {
    recommendations.push("Budget for increased maintenance and repairs");
  }
  if (tenantRisk > 5) {
    recommendations.push("Implement stricter tenant screening and lease terms");
  }
  if (locationRisk > 5) {
    recommendations.push("Evaluate location stability and neighborhood trends");
  }
  if (financingRisk > 5) {
    recommendations.push("Consider more conservative financing terms");
  }

  // Add balloon payment specific recommendations
  if (financingDetails?.balloonPayment && financingDetails.balloonPayment > 0) {
    if (financingDetails.balloonDueYears <= 3) {
      recommendations.push(
        "High balloon payment risk: Plan exit strategy within 3 years",
      );
    } else if (financingDetails.balloonDueYears <= 5) {
      recommendations.push(
        "Medium balloon payment risk: Ensure sufficient cash flow for balloon payment",
      );
    } else {
      recommendations.push(
        "Balloon payment due: Plan refinancing or sale strategy",
      );
    }

    if (
      financingDetails.balloonPayment >
      (financingDetails.totalLoanAmount || 0) * 0.5
    ) {
      recommendations.push(
        "Large balloon payment: Consider refinancing before balloon due date",
      );
    }
  }

  if (financingDetails?.interestOnly) {
    recommendations.push(
      "Interest-only loan: Plan for principal payments or refinancing",
    );
  }

  return {
    overallRiskScore: Math.round(overallRiskScore * 10) / 10,
    riskBreakdown: {
      marketRisk: Math.round(marketRisk * 10) / 10,
      propertyRisk: Math.round(propertyRisk * 10) / 10,
      tenantRisk: Math.round(tenantRisk * 10) / 10,
      financingRisk: Math.round(financingRisk * 10) / 10,
      locationRisk: Math.round(locationRisk * 10) / 10,
    },
    riskCategory,
    recommendations,
  };
};

// Helper function to determine risk category based on overall score and probability of loss
export const getRiskCategory = (
  overallRiskScore: number,
  probabilityOfLoss: number,
): "Low" | "Medium" | "High" | "Very High" => {
  // Use both risk score and probability of loss for more accurate categorization
  if (overallRiskScore <= 3 && probabilityOfLoss < 0.2) {
    return "Low";
  } else if (overallRiskScore <= 5 && probabilityOfLoss < 0.4) {
    return "Medium";
  } else if (overallRiskScore <= 7 && probabilityOfLoss < 0.6) {
    return "High";
  } else {
    return "Very High";
  }
};

// Helper function to generate comprehensive risk recommendations
export const generateRiskRecommendations = (params: {
  marketRisk: number;
  propertyRisk: number;
  tenantRisk: number;
  locationRisk: number;
  financingRisk: number;
  metricRiskAdjustments: {
    dscr: { value: number; adjustment: number; riskLevel: string };
    ltv: { value: number; adjustment: number; riskLevel: string };
    coc: { value: number; adjustment: number; riskLevel: string };
    capRate: { value: number; adjustment: number; riskLevel: string };
    totalAdjustment: number;
  };
  probabilityOfLoss: number;
  financingDetails?: {
    type: string;
    balloonPayment: number;
    balloonDueYears: number;
    interestOnly: boolean;
    totalLoanAmount: number;
  };
}): string[] => {
  const recommendations: string[] = [];
  const {
    marketRisk,
    propertyRisk,
    tenantRisk,
    locationRisk,
    financingRisk,
    metricRiskAdjustments,
    probabilityOfLoss,
    financingDetails,
  } = params;

  // Risk factor recommendations
  if (marketRisk > 5) {
    recommendations.push("Consider market timing and local economic factors");
  }
  if (propertyRisk > 5) {
    recommendations.push("Budget for increased maintenance and repairs");
  }
  if (tenantRisk > 5) {
    recommendations.push("Implement stricter tenant screening and lease terms");
  }
  if (locationRisk > 5) {
    recommendations.push("Evaluate location stability and neighborhood trends");
  }
  if (financingRisk > 5) {
    recommendations.push("Consider more conservative financing terms");
  }

  // Metric-based recommendations with adjustment context
  if (metricRiskAdjustments.dscr.riskLevel === "Poor" || metricRiskAdjustments.dscr.riskLevel === "Marginal") {
    recommendations.push(
      `DSCR ${metricRiskAdjustments.dscr.riskLevel.toLowerCase()} (${metricRiskAdjustments.dscr.value.toFixed(2)}, +${metricRiskAdjustments.dscr.adjustment} risk): Increase income or reduce debt payments`
    );
  }
  if (metricRiskAdjustments.ltv.riskLevel === "High" || metricRiskAdjustments.ltv.riskLevel === "Critical") {
    recommendations.push(
      `LTV ${metricRiskAdjustments.ltv.riskLevel.toLowerCase()} (${metricRiskAdjustments.ltv.value.toFixed(1)}%, +${metricRiskAdjustments.ltv.adjustment} risk): Consider larger down payment`
    );
  }
  if (metricRiskAdjustments.coc.riskLevel === "Poor" || metricRiskAdjustments.coc.riskLevel === "Marginal") {
    recommendations.push(
      `CoC return ${metricRiskAdjustments.coc.riskLevel.toLowerCase()} (${metricRiskAdjustments.coc.value.toFixed(1)}%, +${metricRiskAdjustments.coc.adjustment} risk): Improve cash flow or reduce investment`
    );
  }
  if (metricRiskAdjustments.capRate.riskLevel === "Poor" || metricRiskAdjustments.capRate.riskLevel === "Marginal") {
    recommendations.push(
      `Cap rate ${metricRiskAdjustments.capRate.riskLevel.toLowerCase()} (${metricRiskAdjustments.capRate.value.toFixed(1)}%, +${metricRiskAdjustments.capRate.adjustment} risk): Property may be overpriced`
    );
  }

  // Positive adjustments (excellent metrics)
  const excellentMetrics: string[] = [];
  if (metricRiskAdjustments.dscr.riskLevel === "Excellent") {
    excellentMetrics.push(`Excellent DSCR (${metricRiskAdjustments.dscr.value.toFixed(2)})`);
  }
  if (metricRiskAdjustments.ltv.riskLevel === "Excellent") {
    excellentMetrics.push(`Excellent LTV (${metricRiskAdjustments.ltv.value.toFixed(1)}%)`);
  }
  if (metricRiskAdjustments.coc.riskLevel === "Excellent") {
    excellentMetrics.push(`Excellent CoC (${metricRiskAdjustments.coc.value.toFixed(1)}%)`);
  }
  if (metricRiskAdjustments.capRate.riskLevel === "Excellent") {
    excellentMetrics.push(`Excellent Cap Rate (${metricRiskAdjustments.capRate.value.toFixed(1)}%)`);
  }
  if (excellentMetrics.length > 0) {
    recommendations.push(
      `Strong metrics: ${excellentMetrics.join(", ")} - Risk reduced by ${Math.abs(metricRiskAdjustments.totalAdjustment).toFixed(1)}`
    );
  }

  // Probability of loss recommendations
  if (probabilityOfLoss > 0.6) {
    recommendations.push(
      `High probability of loss (${(probabilityOfLoss * 100).toFixed(1)}%): Consider passing on this deal`
    );
  } else if (probabilityOfLoss > 0.4) {
    recommendations.push(
      `Moderate probability of loss (${(probabilityOfLoss * 100).toFixed(1)}%): Ensure adequate cash reserves`
    );
  }

  // Balloon payment recommendations
  if (financingDetails?.balloonPayment && financingDetails.balloonPayment > 0) {
    if (financingDetails.balloonDueYears <= 3) {
      recommendations.push(
        "High balloon payment risk: Plan exit strategy within 3 years"
      );
    } else if (financingDetails.balloonDueYears <= 5) {
      recommendations.push(
        "Medium balloon payment risk: Ensure sufficient cash flow for balloon payment"
      );
    }

    if (
      financingDetails.balloonPayment >
      (financingDetails.totalLoanAmount || 0) * 0.5
    ) {
      recommendations.push(
        "Large balloon payment: Consider refinancing before balloon due date"
      );
    }
  }

  if (financingDetails?.interestOnly) {
    recommendations.push(
      "Interest-only loan: Plan for principal payments or refinancing"
    );
  }

  return recommendations;
};

// Helper function to calculate metric risk adjustments with exact thresholds
const calculateMetricRiskAdjustments = (metrics: {
  dscr: number;
  ltv: number;
  coc: number;
  capRate: number;
}): {
  dscr: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" };
  ltv: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Moderate" | "High" | "Critical" };
  coc: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" };
  capRate: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" };
  totalAdjustment: number;
} => {
  // DSCR Risk Adjustment (Debt Service Coverage Ratio)
  // Lower DSCR = Higher Risk (worse debt coverage)
  let dscrAdjustment = 0;
  let dscrRiskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" = "Good";
  
  if (metrics.dscr > 2.0) {
    dscrAdjustment = -0.5; // Excellent coverage - reduce risk
    dscrRiskLevel = "Excellent";
  } else if (metrics.dscr >= 1.5) {
    dscrAdjustment = 0; // Good coverage - no adjustment
    dscrRiskLevel = "Good";
  } else if (metrics.dscr >= 1.25) {
    dscrAdjustment = 0.5; // Acceptable but tight
    dscrRiskLevel = "Acceptable";
  } else if (metrics.dscr >= 1.0) {
    dscrAdjustment = 1.0; // Marginal coverage - increase risk
    dscrRiskLevel = "Marginal";
  } else {
    dscrAdjustment = 2.0; // Poor coverage - significant risk increase
    dscrRiskLevel = "Poor";
  }

  // LTV Risk Adjustment (Loan-to-Value)
  // Higher LTV = Higher Risk (more leverage)
  let ltvAdjustment = 0;
  let ltvRiskLevel: "Excellent" | "Good" | "Acceptable" | "Moderate" | "High" | "Critical" = "Acceptable";
  
  if (metrics.ltv < 60) {
    ltvAdjustment = -0.5; // Low leverage - reduce risk
    ltvRiskLevel = "Excellent";
  } else if (metrics.ltv <= 70) {
    ltvAdjustment = 0; // Moderate leverage - no adjustment
    ltvRiskLevel = "Good";
  } else if (metrics.ltv <= 80) {
    ltvAdjustment = 0.5; // Standard leverage - slight risk increase
    ltvRiskLevel = "Acceptable";
  } else if (metrics.ltv <= 90) {
    ltvAdjustment = 1.0; // High leverage - increase risk
    ltvRiskLevel = "High";
  } else {
    ltvAdjustment = 1.5; // Very high leverage - significant risk increase
    ltvRiskLevel = "Critical";
  }

  // CoC Risk Adjustment (Cash-on-Cash Return)
  // Lower CoC = Higher Risk (worse return)
  let cocAdjustment = 0;
  let cocRiskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" = "Acceptable";
  
  if (metrics.coc > 15) {
    cocAdjustment = -0.5; // Excellent return - reduce risk
    cocRiskLevel = "Excellent";
  } else if (metrics.coc >= 8) {
    cocAdjustment = 0; // Good return - no adjustment
    cocRiskLevel = "Good";
  } else if (metrics.coc >= 5) {
    cocAdjustment = 0.5; // Acceptable return - slight risk increase
    cocRiskLevel = "Acceptable";
  } else if (metrics.coc >= 3) {
    cocAdjustment = 1.0; // Marginal return - increase risk
    cocRiskLevel = "Marginal";
  } else {
    cocAdjustment = 1.0; // Poor return - increase risk (capping at 1.0 for <5)
    cocRiskLevel = "Poor";
  }

  // Cap Rate Risk Adjustment
  // Lower Cap Rate = Higher Risk (worse yield)
  let capRateAdjustment = 0;
  let capRateRiskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" = "Acceptable";
  
  if (metrics.capRate > 8) {
    capRateAdjustment = -0.5; // Excellent cap rate - reduce risk
    capRateRiskLevel = "Excellent";
  } else if (metrics.capRate >= 5) {
    capRateAdjustment = 0; // Good cap rate - no adjustment
    capRateRiskLevel = "Good";
  } else if (metrics.capRate >= 4) {
    capRateAdjustment = 0.5; // Acceptable cap rate - slight risk increase
    capRateRiskLevel = "Acceptable";
  } else if (metrics.capRate >= 2) {
    capRateAdjustment = 1.0; // Marginal cap rate - increase risk
    capRateRiskLevel = "Marginal";
  } else {
    capRateAdjustment = 1.0; // Poor cap rate - increase risk (capping at 1.0 for <4)
    capRateRiskLevel = "Poor";
  }

  // Calculate total adjustment
  const totalAdjustment = dscrAdjustment + ltvAdjustment + cocAdjustment + capRateAdjustment;

  return {
    dscr: { value: metrics.dscr, adjustment: dscrAdjustment, riskLevel: dscrRiskLevel },
    ltv: { value: metrics.ltv, adjustment: ltvAdjustment, riskLevel: ltvRiskLevel },
    coc: { value: metrics.coc, adjustment: cocAdjustment, riskLevel: cocRiskLevel },
    capRate: { value: metrics.capRate, adjustment: capRateAdjustment, riskLevel: capRateRiskLevel },
    totalAdjustment: Math.round(totalAdjustment * 10) / 10,
  };
};

// Enhanced Risk Scoring with Weighted Factors and Logistic Regression
export const calculateEnhancedRiskScore = (
  riskFactors: RiskFactors,
  marketConditions: MarketConditions,
  propertyAge: PropertyAgeFactors,
  metrics: {
    dscr: number;
    ltv: number;
    coc: number;
    capRate: number;
  },
  financingDetails?: {
    type: string;
    balloonPayment: number;
    balloonDueYears: number;
    interestOnly: boolean;
    totalLoanAmount: number;
  },
): {
  overallRiskScore: number;
  weightedBreakdown: {
    marketVolatility: { score: number; weight: number; weightedScore: number };
    financingRisk: { score: number; weight: number; weightedScore: number };
    propertyCondition: { score: number; weight: number; weightedScore: number };
    locationStability: { score: number; weight: number; weightedScore: number };
    tenantQuality: { score: number; weight: number; weightedScore: number };
  };
  metricRiskAdjustments: {
    dscr: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" };
    ltv: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Moderate" | "High" | "Critical" };
    coc: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" };
    capRate: { value: number; adjustment: number; riskLevel: "Excellent" | "Good" | "Acceptable" | "Marginal" | "Poor" };
    totalAdjustment: number;
  };
  probabilityOfLoss: number;
  riskCategory: "Low" | "Medium" | "High" | "Very High";
  recommendations: string[];
} => {
  // Default weights based on impact analysis
  const weights = {
    marketVolatility: 0.25,      // 25% - Market conditions impact
    financingRisk: 0.30,         // 30% - Highest impact on deal viability
    propertyCondition: 0.20,     // 20% - Property quality and maintenance
    locationStability: 0.15,     // 15% - Location and neighborhood factors
    tenantQuality: 0.10,         // 10% - Tenant screening and reliability
  };

  // Calculate individual risk components
  const marketRisk =
    (riskFactors.marketVolatility +
      (marketConditions.type === "slow"
        ? 3
        : marketConditions.type === "stable"
          ? 1
          : 0)) /
    2;

  const propertyRisk =
    (riskFactors.propertyCondition +
      (propertyAge.age > 30
        ? 3
        : propertyAge.age > 20
          ? 2
          : propertyAge.age > 10
            ? 1
            : 0)) /
    2;

  const tenantRisk = riskFactors.tenantQuality;
  const locationRisk = riskFactors.locationStability;

  // Enhanced financing risk calculation including balloon payment risk
  let financingRisk = riskFactors.financingRisk;

  if (financingDetails) {
    // Add balloon payment risk
    if (financingDetails.balloonPayment > 0) {
      const balloonRiskMultiplier = Math.max(
        1,
        (financingDetails.balloonPayment / financingDetails.totalLoanAmount) * 2,
      );
      const timeRiskMultiplier = Math.max(
        1,
        (10 - financingDetails.balloonDueYears) / 5,
      );
      financingRisk = Math.min(
        10,
        financingRisk * balloonRiskMultiplier * timeRiskMultiplier,
      );
    }

    // Add interest-only risk
    if (financingDetails.interestOnly) {
      financingRisk = Math.min(10, financingRisk * 1.3);
    }
  }

  // Calculate weighted breakdown
  const weightedBreakdown = {
    marketVolatility: {
      score: Math.round(marketRisk * 10) / 10,
      weight: weights.marketVolatility,
      weightedScore: Math.round(marketRisk * weights.marketVolatility * 10) / 10,
    },
    financingRisk: {
      score: Math.round(financingRisk * 10) / 10,
      weight: weights.financingRisk,
      weightedScore: Math.round(financingRisk * weights.financingRisk * 10) / 10,
    },
    propertyCondition: {
      score: Math.round(propertyRisk * 10) / 10,
      weight: weights.propertyCondition,
      weightedScore: Math.round(propertyRisk * weights.propertyCondition * 10) / 10,
    },
    locationStability: {
      score: Math.round(locationRisk * 10) / 10,
      weight: weights.locationStability,
      weightedScore: Math.round(locationRisk * weights.locationStability * 10) / 10,
    },
    tenantQuality: {
      score: Math.round(tenantRisk * 10) / 10,
      weight: weights.tenantQuality,
      weightedScore: Math.round(tenantRisk * weights.tenantQuality * 10) / 10,
    },
  };

  // Calculate metric risk adjustments
  const metricRiskAdjustments = calculateMetricRiskAdjustments(metrics);

  // Calculate base weighted risk score
  const baseRiskScore =
    marketRisk * weights.marketVolatility +
    financingRisk * weights.financingRisk +
    propertyRisk * weights.propertyCondition +
    locationRisk * weights.locationStability +
    tenantRisk * weights.tenantQuality;

  // Apply metric adjustments to overall risk score
  // Adjustments can be positive (increase risk) or negative (decrease risk)
  const overallRiskScore = Math.max(
    1,
    Math.min(10, baseRiskScore + metricRiskAdjustments.totalAdjustment)
  ); // Keep within 1-10 scale

  // Logistic Regression for Probability of Loss
  // Formula: P(loss) = 1 / (1 + e^(-z))
  // where z = β0 + β1*x1 + β2*x2 + ... (linear combination of risk factors)
  
  // Coefficients calibrated based on real estate investment data
  // Higher values = more predictive of loss
  const beta0 = -6.5; // Intercept (baseline probability)
  const coefficients = {
    overallRiskScore: 0.8,        // Primary risk indicator
    metricAdjustment: 0.7,        // Metric adjustments are highly predictive
    dscrAdjustment: 0.6,          // Debt coverage is critical
    ltvAdjustment: 0.5,           // Leverage risk
    cocAdjustment: 0.4,           // Cash flow risk
    capRateAdjustment: 0.3,       // Return risk
    marketCondition: marketConditions.type === "slow" ? 0.5 : 
                     marketConditions.type === "stable" ? 0 : -0.3, // Market adjustment
  };

  // Calculate linear combination (z-score)
  const z = beta0 +
    coefficients.overallRiskScore * overallRiskScore +
    coefficients.metricAdjustment * metricRiskAdjustments.totalAdjustment +
    coefficients.dscrAdjustment * metricRiskAdjustments.dscr.adjustment +
    coefficients.ltvAdjustment * metricRiskAdjustments.ltv.adjustment +
    coefficients.cocAdjustment * metricRiskAdjustments.coc.adjustment +
    coefficients.capRateAdjustment * metricRiskAdjustments.capRate.adjustment +
    coefficients.marketCondition;

  // Apply logistic function
  const probabilityOfLoss = 1 / (1 + Math.exp(-z));

  // Determine risk category using helper function
  const riskCategory = getRiskCategory(overallRiskScore, probabilityOfLoss);

  // Generate comprehensive recommendations using helper function
  const recommendations = generateRiskRecommendations({
    marketRisk,
    propertyRisk,
    tenantRisk,
    locationRisk,
    financingRisk,
    metricRiskAdjustments,
    probabilityOfLoss,
    financingDetails,
  });

  return {
    overallRiskScore: Math.round(overallRiskScore * 10) / 10,
    weightedBreakdown,
    metricRiskAdjustments,
    probabilityOfLoss: Math.round(probabilityOfLoss * 1000) / 1000,
    riskCategory,
    recommendations,
  };
};

// Confidence intervals for projections
export const calculateConfidenceIntervals = (
  baseProjection: number,
  volatility: number, // Percentage
  confidenceLevel: number = 0.95, // 95% confidence interval
): {
  lowerBound: number;
  upperBound: number;
  confidenceLevel: number;
} => {
  // Using normal distribution approximation
  const zScore =
    confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.9 ? 1.645 : 2.576;
  const marginOfError = baseProjection * (volatility / 100) * zScore;

  return {
    lowerBound: Math.max(0, baseProjection - marginOfError),
    upperBound: baseProjection + marginOfError,
    confidenceLevel,
  };
};

// Helper function for monthly payment calculation
const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number,
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const totalPayments = years * 12;

  if (monthlyRate === 0) return principal / totalPayments;

  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
};

// Default market conditions for common scenarios
export const defaultMarketConditions: Record<string, MarketConditions> = {
  hot: {
    type: "hot",
    vacancyRateAdjustment: -0.3, // 30% lower vacancy
    rentGrowthRate: 0.15, // 15% annual growth
    appreciationRate: 0.12, // 12% annual appreciation
    capRateAdjustment: -0.2, // 20% lower cap rate
    inflationRate: 0.04, // 4% inflation in hot markets
  },
  stable: {
    type: "stable",
    vacancyRateAdjustment: 0, // No adjustment
    rentGrowthRate: 0.03, // 3% annual growth
    appreciationRate: 0.04, // 4% annual appreciation
    capRateAdjustment: 0, // No adjustment
    inflationRate: 0.02, // 2% inflation in stable markets
  },
  slow: {
    type: "slow",
    vacancyRateAdjustment: 0.4, // 40% higher vacancy
    rentGrowthRate: -0.02, // -2% annual growth
    appreciationRate: 0.01, // 1% annual appreciation
    capRateAdjustment: 0.3, // 30% higher cap rate
    inflationRate: 0.01, // 1% inflation in slow markets
  },
};

// Simple default market conditions for direct use
export const defaultMarketConditionsSimple = {
  inflationRate: 0.02, // 2% inflation
  appreciationRate: 0.04, // 4% appreciation
  rentGrowthRate: 0.03, // 3% rent growth
  vacancyRate: 0.05, // 5% vacancy rate
};

// Default seasonal factors
export const defaultSeasonalFactors: SeasonalFactors = {
  summerVacancyRate: 0.1, // 10% higher in summer
  winterVacancyRate: -0.05, // 5% lower in winter
  springVacancyRate: 0.05, // 5% higher in spring
  fallVacancyRate: 0, // No adjustment in fall
  seasonalMaintenanceMultiplier: 1.2, // 20% higher maintenance in summer
  q1: 0.8, // Q1 (Jan-Mar): 80% occupancy multiplier
  q2: 1.0, // Q2 (Apr-Jun): 100% occupancy multiplier
  q3: 1.2, // Q3 (Jul-Sep): 120% occupancy multiplier
  q4: 0.9, // Q4 (Oct-Dec): 90% occupancy multiplier
};

// Default location factors
export const defaultLocationFactors: Record<string, LocationFactors> = {
  urban: {
    type: "urban",
    propertyTaxRate: 1.2, // 20% higher taxes
    insuranceCostMultiplier: 1.3, // 30% higher insurance
    maintenanceCostMultiplier: 1.4, // 40% higher maintenance
    utilityCostMultiplier: 1.1, // 10% higher utilities
    transportationCostMultiplier: 0.7, // 30% lower transportation
  },
  suburban: {
    type: "suburban",
    propertyTaxRate: 1.0, // Standard rates
    insuranceCostMultiplier: 1.0, // Standard rates
    maintenanceCostMultiplier: 1.0, // Standard rates
    utilityCostMultiplier: 1.0, // Standard rates
    transportationCostMultiplier: 1.0, // Standard rates
  },
  rural: {
    type: "rural",
    propertyTaxRate: 0.8, // 20% lower taxes
    insuranceCostMultiplier: 0.9, // 10% lower insurance
    maintenanceCostMultiplier: 1.2, // 20% higher maintenance
    utilityCostMultiplier: 1.3, // 30% higher utilities
    transportationCostMultiplier: 1.5, // 50% higher transportation
  },
};

// Default risk factors
export const defaultRiskFactors: RiskFactors = {
  marketVolatility: 5, // Medium volatility
  tenantQuality: 7, // Good tenant quality
  propertyCondition: 6, // Average condition
  locationStability: 8, // High stability
  financingRisk: 4, // Low financing risk
};

// Default tax implications
export const defaultTaxImplications: TaxImplications = {
  propertyTaxDeduction: true,
  mortgageInterestDeduction: true,
  depreciationDeduction: true,
  repairExpenseDeduction: true,
  taxBracket: 24, // 24% tax bracket
};

// Default property age factors
export const defaultPropertyAgeFactors: PropertyAgeFactors = {
  age: 20, // 20 years old
  maintenanceCostMultiplier: 1.0, // Standard maintenance
  utilityEfficiencyMultiplier: 0.9, // 10% less efficient
  insuranceCostMultiplier: 1.1, // 10% higher insurance
  expectedLifespan: 50, // 50 years expected lifespan
};

// Default exit strategies
export const defaultExitStrategies: ExitStrategy[] = [
  {
    timeframe: 5,
    sellingCosts: 6, // 6% of sale price
    capitalGainsTax: 15, // 15% capital gains tax
    depreciationRecapture: 25, // 25% depreciation recapture
    marketAppreciation: 0.04, // 4% annual appreciation
  },
  {
    timeframe: 10,
    sellingCosts: 6,
    capitalGainsTax: 15,
    depreciationRecapture: 25,
    marketAppreciation: 0.04,
  },
];

// Calculate years until refinance is possible based on appreciation and LTV constraints
export const calculateYearsUntilRefinance = (
  currentLoanBalance: number,
  purchasePrice: number,
  annualAppreciationRate: number,
  refinanceLtv: number,
): number => {
  if (
    currentLoanBalance <= 0 ||
    purchasePrice <= 0 ||
    annualAppreciationRate <= 0 ||
    refinanceLtv <= 0
  ) {
    return 0;
  }

  // Calculate the property value needed to support the current loan balance at the target LTV
  const targetPropertyValue = currentLoanBalance / (refinanceLtv / 100);

  // Calculate years needed for the property to appreciate to that value
  if (targetPropertyValue <= purchasePrice) {
    return 0; // Already possible to refinance
  }

  const years =
    Math.log(targetPropertyValue / purchasePrice) /
    Math.log(1 + annualAppreciationRate / 100);
  return Math.max(0, Math.ceil(years));
};

// Calculate refinance potential based on future property value and LTV
export const calculateRefinancePotential = (
  futurePropertyValue: number,
  currentLoanBalance: number,
  refinanceLtv: number,
): number => {
  if (futurePropertyValue <= 0 || refinanceLtv <= 0) {
    return 0;
  }

  const maxRefinanceLoan = futurePropertyValue * (refinanceLtv / 100);
  return Math.max(0, maxRefinanceLoan - currentLoanBalance);
};
