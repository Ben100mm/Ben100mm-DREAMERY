// Advanced calculation utilities for enhanced financial analysis
// These utilities can be integrated with existing calculations without breaking current functionality

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

// Risk scoring system
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
  };
  riskCategory: "Low" | "Medium" | "High" | "Very High";
  recommendations: string[];
} => {
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

  // Weighted average for overall risk score
  const overallRiskScore =
    marketRisk * 0.25 +
    propertyRisk * 0.25 +
    tenantRisk * 0.25 +
    financingRisk * 0.25;

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
    },
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
