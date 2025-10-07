// Advanced Stress Testing Scenarios for Real Estate Investment Analysis
// Provides comprehensive stress testing across multiple adverse scenarios

export interface RecessionScenario {
  incomeReduction: number; // Percentage reduction in rental income (e.g., -20)
  expenseIncrease: number; // Percentage increase in expenses (e.g., +15)
  vacancyIncrease: number; // Percentage point increase in vacancy (e.g., +10)
  depreciationReduction: number; // Percentage reduction in depreciation benefit (e.g., -10)
  description: string;
}

export interface InterestRateShockScenario {
  rateIncrease: number; // Percentage point increase in interest rate (e.g., +3)
  refinanceImpact: boolean; // Whether refinancing is affected
  newRate?: number; // New interest rate if refinancing
  refinanceCosts?: number; // Additional costs for refinancing
  description: string;
}

export interface OperatingShockScenario {
  majorRepairCost: number; // One-time major repair cost (e.g., $50,000)
  legalCost: number; // Legal/litigation costs (e.g., $15,000)
  vacancyMonths: number; // Extended vacancy period in months (e.g., 6)
  description: string;
}

export interface MarketCorrectionScenario {
  priceReduction: number; // Percentage reduction in property value (e.g., -15)
  rentReduction: number; // Percentage reduction in rental income (e.g., -10)
  timeToSellMonths: number; // Extended time to sell in months (e.g., 12)
  additionalCarryingCosts: boolean; // Whether to include extended carrying costs
  description: string;
}

export interface StressTestScenarios {
  recession: RecessionScenario;
  interestRateShock: InterestRateShockScenario;
  operatingShock: OperatingShockScenario;
  marketCorrection: MarketCorrectionScenario;
}

// Pre-configured standard stress test scenarios
export const DEFAULT_STRESS_SCENARIOS: StressTestScenarios = {
  recession: {
    incomeReduction: -20,
    expenseIncrease: 15,
    vacancyIncrease: 10,
    depreciationReduction: -10,
    description: "Economic recession with reduced rental demand and increased costs",
  },
  interestRateShock: {
    rateIncrease: 3,
    refinanceImpact: true,
    refinanceCosts: 5000,
    description: "Sudden interest rate increase impacting financing costs",
  },
  operatingShock: {
    majorRepairCost: 50000,
    legalCost: 15000,
    vacancyMonths: 6,
    description: "Major unexpected repairs and extended vacancy",
  },
  marketCorrection: {
    priceReduction: -15,
    rentReduction: -10,
    timeToSellMonths: 12,
    additionalCarryingCosts: true,
    description: "Market downturn affecting property values and rental rates",
  },
};

// Input parameters for stress test calculations
export interface StressTestInputs {
  propertyValue: number;
  monthlyRent: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  currentInterestRate: number;
  loanAmount: number;
  loanTerm: number; // months
  downPayment: number;
  annualRoi: number;
}

// Results from a single stress test scenario
export interface StressTestResult {
  scenarioName: string;
  description: string;
  adjustedMonthlyRent: number;
  adjustedMonthlyExpenses: number;
  adjustedCashFlow: number;
  adjustedPropertyValue: number;
  adjustedRoi: number;
  totalImpact: number; // Dollar amount of impact
  impactPercentage: number; // Percentage change from baseline
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  cashFlowBuffer: number; // Ratio of stressed to baseline cash flow
  breakEvenMonths?: number; // Time to break even under stress
  recoveryTimeMonths?: number; // Estimated recovery time
}

// Comprehensive results from all stress tests
export interface ComprehensiveStressTestResults {
  baselineScenario: {
    monthlyRent: number;
    monthlyExpenses: number;
    monthlyCashFlow: number;
    propertyValue: number;
    annualRoi: number;
  };
  scenarios: {
    recession: StressTestResult;
    interestRateShock: StressTestResult;
    operatingShock: StressTestResult;
    marketCorrection: StressTestResult;
  };
  worstCaseScenario: {
    scenarioName: string;
    impact: number;
  };
  overallRiskScore: number; // 0-100 scale
  recommendations: string[];
}

/**
 * Calculate the impact of a recession scenario
 */
export const calculateRecessionImpact = (
  inputs: StressTestInputs,
  scenario: RecessionScenario,
): StressTestResult => {
  // Apply income reduction
  const adjustedMonthlyRent =
    inputs.monthlyRent * (1 + scenario.incomeReduction / 100);

  // Apply expense increase
  const adjustedMonthlyExpenses =
    inputs.monthlyExpenses * (1 + scenario.expenseIncrease / 100);

  // Calculate adjusted cash flow (vacancy impact included in rent)
  const vacancyImpact = 1 - scenario.vacancyIncrease / 100;
  const adjustedCashFlow =
    adjustedMonthlyRent * vacancyImpact - adjustedMonthlyExpenses;

  // Property value typically unchanged in short term
  const adjustedPropertyValue = inputs.propertyValue;

  // Calculate adjusted ROI
  const adjustedRoi =
    ((adjustedCashFlow * 12) / inputs.downPayment) * 100;

  // Calculate impact
  const totalImpact = (adjustedCashFlow - inputs.monthlyCashFlow) * 12;
  const impactPercentage =
    ((adjustedCashFlow - inputs.monthlyCashFlow) / inputs.monthlyCashFlow) *
    100;

  // Calculate cash flow buffer
  const cashFlowBuffer = adjustedCashFlow / inputs.monthlyCashFlow;

  // Determine risk level
  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  if (cashFlowBuffer >= 0.8 && adjustedRoi >= 6) {
    riskLevel = "Low";
  } else if (cashFlowBuffer >= 0.6 && adjustedRoi >= 4) {
    riskLevel = "Medium";
  } else if (cashFlowBuffer >= 0.4 && adjustedRoi >= 2) {
    riskLevel = "High";
  } else {
    riskLevel = "Critical";
  }

  return {
    scenarioName: "Recession",
    description: scenario.description,
    adjustedMonthlyRent,
    adjustedMonthlyExpenses,
    adjustedCashFlow,
    adjustedPropertyValue,
    adjustedRoi,
    totalImpact,
    impactPercentage,
    riskLevel,
    cashFlowBuffer,
    recoveryTimeMonths: cashFlowBuffer < 0.5 ? 24 : 12,
  };
};

/**
 * Calculate the impact of an interest rate shock scenario
 */
export const calculateInterestRateShockImpact = (
  inputs: StressTestInputs,
  scenario: InterestRateShockScenario,
): StressTestResult => {
  // Calculate new interest rate
  const newRate = inputs.currentInterestRate + scenario.rateIncrease;
  const monthlyRate = newRate / 100 / 12;

  // Calculate new monthly payment
  const remainingBalance = inputs.loanAmount;
  const remainingTermMonths = inputs.loanTerm;

  const newMonthlyPayment =
    (remainingBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingTermMonths)) /
    (Math.pow(1 + monthlyRate, remainingTermMonths) - 1);

  // Calculate old monthly payment for comparison
  const oldMonthlyRate = inputs.currentInterestRate / 100 / 12;
  const oldMonthlyPayment =
    (inputs.loanAmount * oldMonthlyRate * Math.pow(1 + oldMonthlyRate, inputs.loanTerm)) /
    (Math.pow(1 + oldMonthlyRate, inputs.loanTerm) - 1);

  // Calculate payment increase
  const paymentIncrease = newMonthlyPayment - oldMonthlyPayment;

  // Adjust expenses to include refinance costs if applicable
  let adjustedMonthlyExpenses = inputs.monthlyExpenses + paymentIncrease;
  let oneTimeImpact = 0;

  if (scenario.refinanceImpact && scenario.refinanceCosts) {
    oneTimeImpact = scenario.refinanceCosts;
    // Amortize refinance costs over 12 months for monthly impact
    adjustedMonthlyExpenses += scenario.refinanceCosts / 12;
  }

  const adjustedCashFlow = inputs.monthlyRent - adjustedMonthlyExpenses;
  const adjustedRoi = ((adjustedCashFlow * 12) / inputs.downPayment) * 100;

  // Calculate impact (including one-time costs)
  const totalImpact =
    (adjustedCashFlow - inputs.monthlyCashFlow) * 12 - oneTimeImpact;
  const impactPercentage =
    ((adjustedCashFlow - inputs.monthlyCashFlow) / inputs.monthlyCashFlow) *
    100;

  const cashFlowBuffer = adjustedCashFlow / inputs.monthlyCashFlow;

  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  if (cashFlowBuffer >= 0.85 && adjustedRoi >= 6) {
    riskLevel = "Low";
  } else if (cashFlowBuffer >= 0.7 && adjustedRoi >= 4) {
    riskLevel = "Medium";
  } else if (cashFlowBuffer >= 0.5 && adjustedRoi >= 2) {
    riskLevel = "High";
  } else {
    riskLevel = "Critical";
  }

  return {
    scenarioName: "Interest Rate Shock",
    description: scenario.description,
    adjustedMonthlyRent: inputs.monthlyRent,
    adjustedMonthlyExpenses,
    adjustedCashFlow,
    adjustedPropertyValue: inputs.propertyValue,
    adjustedRoi,
    totalImpact,
    impactPercentage,
    riskLevel,
    cashFlowBuffer,
    recoveryTimeMonths: 0, // Rate shock is permanent unless refinanced again
  };
};

/**
 * Calculate the impact of an operating shock scenario
 */
export const calculateOperatingShockImpact = (
  inputs: StressTestInputs,
  scenario: OperatingShockScenario,
): StressTestResult => {
  // Calculate one-time costs
  const totalOneTimeCosts = scenario.majorRepairCost + scenario.legalCost;

  // Calculate vacancy impact
  const vacancyLoss = inputs.monthlyRent * scenario.vacancyMonths;

  // Total first year impact
  const totalFirstYearImpact = totalOneTimeCosts + vacancyLoss;

  // Adjusted monthly cash flow during vacancy
  const adjustedCashFlowDuringVacancy = -inputs.monthlyExpenses;

  // Average adjusted cash flow for the year
  const vacancyMonthsCashFlow =
    adjustedCashFlowDuringVacancy * scenario.vacancyMonths;
  const normalMonthsCashFlow =
    inputs.monthlyCashFlow * (12 - scenario.vacancyMonths);
  const totalAnnualCashFlow =
    vacancyMonthsCashFlow + normalMonthsCashFlow - totalOneTimeCosts;
  const averageMonthlyAdjustedCashFlow = totalAnnualCashFlow / 12;

  // Calculate adjusted ROI
  const adjustedRoi =
    ((averageMonthlyAdjustedCashFlow * 12) / inputs.downPayment) * 100;

  // Calculate impact
  const totalImpact = totalAnnualCashFlow - inputs.monthlyCashFlow * 12;
  const impactPercentage =
    ((averageMonthlyAdjustedCashFlow - inputs.monthlyCashFlow) /
      inputs.monthlyCashFlow) *
    100;

  const cashFlowBuffer =
    averageMonthlyAdjustedCashFlow / inputs.monthlyCashFlow;

  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  if (cashFlowBuffer >= 0.7 && adjustedRoi >= 5) {
    riskLevel = "Low";
  } else if (cashFlowBuffer >= 0.5 && adjustedRoi >= 3) {
    riskLevel = "Medium";
  } else if (cashFlowBuffer >= 0.3 && adjustedRoi >= 1) {
    riskLevel = "High";
  } else {
    riskLevel = "Critical";
  }

  // Calculate break-even months
  const breakEvenMonths = Math.ceil(
    totalOneTimeCosts / inputs.monthlyCashFlow,
  );

  return {
    scenarioName: "Operating Shock",
    description: scenario.description,
    adjustedMonthlyRent: inputs.monthlyRent,
    adjustedMonthlyExpenses: inputs.monthlyExpenses,
    adjustedCashFlow: averageMonthlyAdjustedCashFlow,
    adjustedPropertyValue: inputs.propertyValue,
    adjustedRoi,
    totalImpact,
    impactPercentage,
    riskLevel,
    cashFlowBuffer,
    breakEvenMonths,
    recoveryTimeMonths: scenario.vacancyMonths + breakEvenMonths,
  };
};

/**
 * Calculate the impact of a market correction scenario
 */
export const calculateMarketCorrectionImpact = (
  inputs: StressTestInputs,
  scenario: MarketCorrectionScenario,
): StressTestResult => {
  // Apply price reduction
  const adjustedPropertyValue =
    inputs.propertyValue * (1 + scenario.priceReduction / 100);

  // Apply rent reduction
  const adjustedMonthlyRent =
    inputs.monthlyRent * (1 + scenario.rentReduction / 100);

  // Calculate additional carrying costs during extended sale period
  let adjustedMonthlyExpenses = inputs.monthlyExpenses;
  if (scenario.additionalCarryingCosts) {
    // Add marketing, staging, and holding costs
    const additionalCosts = inputs.monthlyExpenses * 0.1; // 10% increase in costs
    adjustedMonthlyExpenses += additionalCosts;
  }

  const adjustedCashFlow = adjustedMonthlyRent - adjustedMonthlyExpenses;

  // Calculate adjusted ROI based on new property value
  const adjustedRoi = ((adjustedCashFlow * 12) / inputs.downPayment) * 100;

  // Calculate impact including equity loss
  const equityLoss = inputs.propertyValue - adjustedPropertyValue;
  const annualCashFlowImpact =
    (adjustedCashFlow - inputs.monthlyCashFlow) * 12;
  const totalImpact = annualCashFlowImpact - equityLoss / scenario.timeToSellMonths * 12;

  const impactPercentage =
    ((adjustedCashFlow - inputs.monthlyCashFlow) / inputs.monthlyCashFlow) *
    100;

  const cashFlowBuffer = adjustedCashFlow / inputs.monthlyCashFlow;

  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  if (cashFlowBuffer >= 0.85 && adjustedRoi >= 5) {
    riskLevel = "Low";
  } else if (cashFlowBuffer >= 0.7 && adjustedRoi >= 3) {
    riskLevel = "Medium";
  } else if (cashFlowBuffer >= 0.5 && adjustedRoi >= 1) {
    riskLevel = "High";
  } else {
    riskLevel = "Critical";
  }

  return {
    scenarioName: "Market Correction",
    description: scenario.description,
    adjustedMonthlyRent,
    adjustedMonthlyExpenses,
    adjustedCashFlow,
    adjustedPropertyValue,
    adjustedRoi,
    totalImpact,
    impactPercentage,
    riskLevel,
    cashFlowBuffer,
    recoveryTimeMonths: scenario.timeToSellMonths,
  };
};

/**
 * Run comprehensive stress test across all scenarios
 */
export const runComprehensiveStressTest = (
  inputs: StressTestInputs,
  scenarios: StressTestScenarios = DEFAULT_STRESS_SCENARIOS,
): ComprehensiveStressTestResults => {
  // Calculate each scenario
  const recessionResult = calculateRecessionImpact(inputs, scenarios.recession);
  const interestRateResult = calculateInterestRateShockImpact(
    inputs,
    scenarios.interestRateShock,
  );
  const operatingShockResult = calculateOperatingShockImpact(
    inputs,
    scenarios.operatingShock,
  );
  const marketCorrectionResult = calculateMarketCorrectionImpact(
    inputs,
    scenarios.marketCorrection,
  );

  // Find worst case scenario
  const results = [
    { name: "Recession", impact: recessionResult.totalImpact },
    { name: "Interest Rate Shock", impact: interestRateResult.totalImpact },
    { name: "Operating Shock", impact: operatingShockResult.totalImpact },
    { name: "Market Correction", impact: marketCorrectionResult.totalImpact },
  ];

  const worstCase = results.reduce((worst, current) =>
    current.impact < worst.impact ? current : worst,
  );

  // Calculate overall risk score (0-100)
  const riskScores = {
    Low: 25,
    Medium: 50,
    High: 75,
    Critical: 100,
  };

  const averageRiskScore =
    (riskScores[recessionResult.riskLevel] +
      riskScores[interestRateResult.riskLevel] +
      riskScores[operatingShockResult.riskLevel] +
      riskScores[marketCorrectionResult.riskLevel]) /
    4;

  // Generate recommendations
  const recommendations: string[] = [];

  if (recessionResult.riskLevel === "High" || recessionResult.riskLevel === "Critical") {
    recommendations.push(
      "Build larger cash reserves to weather economic downturns (6-12 months of expenses)",
    );
  }

  if (interestRateResult.riskLevel === "High" || interestRateResult.riskLevel === "Critical") {
    recommendations.push(
      "Consider locking in fixed-rate financing or reducing leverage",
    );
  }

  if (operatingShockResult.riskLevel === "High" || operatingShockResult.riskLevel === "Critical") {
    recommendations.push(
      "Establish emergency fund for major repairs ($50,000+ recommended)",
    );
    recommendations.push("Consider landlord insurance with loss of rent coverage");
  }

  if (marketCorrectionResult.riskLevel === "High" || marketCorrectionResult.riskLevel === "Critical") {
    recommendations.push(
      "Diversify portfolio across markets to reduce concentration risk",
    );
    recommendations.push("Maintain lower loan-to-value ratio for exit flexibility");
  }

  if (averageRiskScore >= 75) {
    recommendations.push(
      "Overall risk level is high - reconsider investment or seek professional advice",
    );
  } else if (averageRiskScore >= 50) {
    recommendations.push(
      "Moderate risk detected - implement risk mitigation strategies before proceeding",
    );
  }

  return {
    baselineScenario: {
      monthlyRent: inputs.monthlyRent,
      monthlyExpenses: inputs.monthlyExpenses,
      monthlyCashFlow: inputs.monthlyCashFlow,
      propertyValue: inputs.propertyValue,
      annualRoi: inputs.annualRoi,
    },
    scenarios: {
      recession: recessionResult,
      interestRateShock: interestRateResult,
      operatingShock: operatingShockResult,
      marketCorrection: marketCorrectionResult,
    },
    worstCaseScenario: {
      scenarioName: worstCase.name,
      impact: worstCase.impact,
    },
    overallRiskScore: averageRiskScore,
    recommendations,
  };
};

/**
 * Create custom stress test scenario
 */
export const createCustomScenario = (
  partialScenarios: Partial<StressTestScenarios>,
): StressTestScenarios => {
  return {
    recession: partialScenarios.recession || DEFAULT_STRESS_SCENARIOS.recession,
    interestRateShock:
      partialScenarios.interestRateShock ||
      DEFAULT_STRESS_SCENARIOS.interestRateShock,
    operatingShock:
      partialScenarios.operatingShock || DEFAULT_STRESS_SCENARIOS.operatingShock,
    marketCorrection:
      partialScenarios.marketCorrection ||
      DEFAULT_STRESS_SCENARIOS.marketCorrection,
  };
};

// ============================================================================
// DealState Integration
// ============================================================================

/**
 * Get severity classification based on DSCR (Debt Service Coverage Ratio)
 * 
 * @param dscr - Debt Service Coverage Ratio
 * @returns Severity level classification
 * 
 * Classification:
 * - Critical: DSCR < 1.0 (Cannot cover debt service)
 * - Severe: 1.0 <= DSCR < 1.2 (Marginal coverage)
 * - Moderate: 1.2 <= DSCR < 1.5 (Acceptable but tight)
 * - Mild: DSCR >= 1.5 (Good coverage)
 */
export const getSeverity = (
  dscr: number,
): "Mild" | "Moderate" | "Severe" | "Critical" => {
  if (dscr < 1.0) {
    return "Critical";
  } else if (dscr < 1.2) {
    return "Severe";
  } else if (dscr < 1.5) {
    return "Moderate";
  } else {
    return "Mild";
  }
};

/**
 * Apply a specific stress scenario to a DealState and return the modified state
 * 
 * @param baseState - The original DealState
 * @param scenarioType - Type of stress scenario to apply
 * @param customScenario - Optional custom scenario parameters (uses defaults if not provided)
 * @returns Modified DealState with stress scenario applied
 */
export const applyStressScenario = (
  baseState: any, // Using any to avoid circular dependency, should be DealState
  scenarioType: "recession" | "interestRateShock" | "operatingShock" | "marketCorrection",
  customScenario?: RecessionScenario | InterestRateShockScenario | OperatingShockScenario | MarketCorrectionScenario,
): any => {
  // Create a deep copy of the base state
  const stressedState = JSON.parse(JSON.stringify(baseState));

  // Get the appropriate scenario
  let scenario: any;
  if (customScenario) {
    scenario = customScenario;
  } else {
    scenario = DEFAULT_STRESS_SCENARIOS[scenarioType];
  }

  // Apply scenario based on type
  switch (scenarioType) {
    case "recession":
      const recessionScenario = scenario as RecessionScenario;
      
      // Reduce income by percentage
      if (stressedState.baseMonthlyRent) {
        stressedState.baseMonthlyRent *= (1 + recessionScenario.incomeReduction / 100);
      }
      
      // Reduce revenue for Hotel/STR
      if (stressedState.revenueInputs) {
        if (stressedState.revenueInputs.occupancyRate) {
          // Reduce occupancy rate by income reduction percentage
          stressedState.revenueInputs.occupancyRate *= (1 + recessionScenario.incomeReduction / 100);
        }
      }
      
      // Increase operating expenses
      if (stressedState.ops) {
        const expenseMultiplier = 1 + recessionScenario.expenseIncrease / 100;
        stressedState.ops.taxes *= expenseMultiplier;
        stressedState.ops.insurance *= expenseMultiplier;
        stressedState.ops.maintenance *= expenseMultiplier;
        stressedState.ops.management *= expenseMultiplier;
        stressedState.ops.capEx *= expenseMultiplier;
        stressedState.ops.opEx *= expenseMultiplier;
      }
      
      // Increase vacancy rate
      if (stressedState.ops && stressedState.ops.vacancy !== undefined) {
        stressedState.ops.vacancy += recessionScenario.vacancyIncrease;
      }
      
      break;

    case "interestRateShock":
      const rateShockScenario = scenario as InterestRateShockScenario;
      
      // Increase interest rate
      if (stressedState.loan && stressedState.loan.rate !== undefined) {
        stressedState.loan.rate += rateShockScenario.rateIncrease;
      }
      
      // Add refinance costs if applicable
      if (rateShockScenario.refinanceImpact && rateShockScenario.refinanceCosts) {
        // Add one-time cost to expenses (amortized over 12 months)
        const monthlyRefinanceCost = rateShockScenario.refinanceCosts / 12;
        if (stressedState.ops) {
          stressedState.ops.opEx = (stressedState.ops.opEx || 0) + monthlyRefinanceCost * 12;
        }
      }
      
      break;

    case "operatingShock":
      const operatingScenario = scenario as OperatingShockScenario;
      
      // Add major repair and legal costs as one-time expenses
      const totalOneTimeCosts = operatingScenario.majorRepairCost + operatingScenario.legalCost;
      if (stressedState.ops) {
        // Amortize one-time costs over first year for monthly impact
        stressedState.ops.opEx = (stressedState.ops.opEx || 0) + totalOneTimeCosts;
      }
      
      // Set extended vacancy period
      if (stressedState.ops) {
        // Convert months to percentage (e.g., 6 months = 50% annual vacancy)
        const vacancyPercentage = (operatingScenario.vacancyMonths / 12) * 100;
        stressedState.ops.vacancy = Math.max(stressedState.ops.vacancy || 0, vacancyPercentage);
      }
      
      // Store the vacancy duration for reference
      stressedState._stressTestMetadata = {
        ...stressedState._stressTestMetadata,
        extendedVacancyMonths: operatingScenario.vacancyMonths,
        oneTimeCosts: totalOneTimeCosts,
      };
      
      break;

    case "marketCorrection":
      const marketScenario = scenario as MarketCorrectionScenario;
      
      // Reduce property value
      if (stressedState.purchasePrice) {
        stressedState.purchasePrice *= (1 + marketScenario.priceReduction / 100);
      }
      
      // Reduce rental income
      if (stressedState.baseMonthlyRent) {
        stressedState.baseMonthlyRent *= (1 + marketScenario.rentReduction / 100);
      }
      
      // Reduce revenue for Hotel/STR
      if (stressedState.revenueInputs) {
        if (stressedState.revenueInputs.averageDailyRate) {
          stressedState.revenueInputs.averageDailyRate *= (1 + marketScenario.rentReduction / 100);
        }
      }
      
      // Add additional carrying costs if specified
      if (marketScenario.additionalCarryingCosts && stressedState.ops) {
        const costIncrease = 1.1; // 10% increase in operating costs
        stressedState.ops.maintenance *= costIncrease;
        stressedState.ops.management *= costIncrease;
      }
      
      // Store time to sell for reference
      stressedState._stressTestMetadata = {
        ...stressedState._stressTestMetadata,
        timeToSellMonths: marketScenario.timeToSellMonths,
      };
      
      break;

    default:
      throw new Error(`Unknown scenario type: ${scenarioType}`);
  }

  // Add metadata to track which scenario was applied
  stressedState._stressTestMetadata = {
    ...stressedState._stressTestMetadata,
    scenarioType,
    appliedAt: new Date().toISOString(),
  };

  return stressedState;
};

/**
 * Interface for stress test result with calculated metrics
 */
export interface StressTestResultWithMetrics {
  scenarioName: string;
  cashFlow: number; // Monthly cash flow
  cocReturn: number; // Cash on Cash Return (%)
  dscr: number; // Debt Service Coverage Ratio
  passesTest: boolean; // Whether the scenario passes stress test
  severity: "Mild" | "Moderate" | "Severe" | "Critical";
  description: string;
  impactPercentage: number;
}

/**
 * Run all stress tests on a DealState and return formatted results
 * 
 * @param baseState - The base DealState to stress test
 * @returns Array of stress test results with calculated metrics
 */
export const runStressTests = (
  baseState: any, // Using any to avoid circular dependency, should be DealState
): StressTestResultWithMetrics[] => {
  // Extract base metrics from DealState
  const purchasePrice = baseState.purchasePrice || 0;
  const downPaymentPct = baseState.loan?.downPayment || 20;
  const downPayment = purchasePrice * (downPaymentPct / 100);
  const loanAmount = baseState.loan?.amount || (purchasePrice - downPayment);
  const interestRate = baseState.loan?.rate || 0;
  const loanTermYears = baseState.loan?.term || 30;
  const loanTermMonths = loanTermYears * 12;

  // Calculate monthly payment
  const monthlyRate = interestRate / 100 / 12;
  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  } else {
    monthlyPayment = loanAmount / loanTermMonths;
  }

  // Extract operating expenses
  const ops = baseState.ops || {};
  const monthlyTaxes = (ops.taxes || 0) / 12;
  const monthlyInsurance = (ops.insurance || 0) / 12;
  const monthlyMaintenance = (ops.maintenance || 0) / 12;
  const monthlyManagement = (ops.management || 0) / 12;
  const monthlyCapEx = (ops.capEx || 0) / 12;
  const monthlyOpEx = (ops.opEx || 0) / 12;

  const totalMonthlyExpenses =
    monthlyPayment +
    monthlyTaxes +
    monthlyInsurance +
    monthlyMaintenance +
    monthlyManagement +
    monthlyCapEx +
    monthlyOpEx;

  // Calculate monthly rent (handle different property types)
  let monthlyRent = 0;
  if (baseState.propertyType === "Hotel" || baseState.propertyType === "Short Term Rental") {
    const revenueInputs = baseState.revenueInputs || {};
    const totalRooms = revenueInputs.totalRooms || 1;
    const adr = revenueInputs.averageDailyRate || 0;
    const occupancy = revenueInputs.occupancyRate || 0;
    monthlyRent = totalRooms * adr * 30 * (occupancy / 100);
  } else {
    monthlyRent = baseState.baseMonthlyRent || 0;
  }

  // Calculate base cash flow and metrics
  const baseMonthlyCashFlow = monthlyRent - totalMonthlyExpenses;
  const baseAnnualCashFlow = baseMonthlyCashFlow * 12;
  const baseCoCReturn = downPayment > 0 ? (baseAnnualCashFlow / downPayment) * 100 : 0;
  
  // Calculate NOI (Net Operating Income) - excludes debt service
  const monthlyNOI = monthlyRent - (totalMonthlyExpenses - monthlyPayment);
  const annualNOI = monthlyNOI * 12;
  const annualDebtService = monthlyPayment * 12;
  const baseDSCR = annualDebtService > 0 ? annualNOI / annualDebtService : 0;

  // Prepare inputs for stress tests
  const inputs: StressTestInputs = {
    propertyValue: purchasePrice,
    monthlyRent,
    monthlyExpenses: totalMonthlyExpenses,
    monthlyCashFlow: baseMonthlyCashFlow,
    currentInterestRate: interestRate,
    loanAmount,
    loanTerm: loanTermMonths,
    downPayment,
    annualRoi: baseCoCReturn,
  };

  // Run comprehensive stress tests
  const comprehensiveResults = runComprehensiveStressTest(inputs);

  // Format results for each scenario
  const results: StressTestResultWithMetrics[] = [];

  // Process each scenario
  Object.entries(comprehensiveResults.scenarios).forEach(([key, scenario]) => {
    // Calculate adjusted metrics
    const adjustedMonthlyCashFlow = scenario.adjustedCashFlow;
    const adjustedAnnualCashFlow = adjustedMonthlyCashFlow * 12;
    const adjustedCoCReturn = downPayment > 0 ? (adjustedAnnualCashFlow / downPayment) * 100 : 0;
    
    // Calculate adjusted NOI and DSCR
    const adjustedMonthlyNOI = scenario.adjustedMonthlyRent - (scenario.adjustedMonthlyExpenses - monthlyPayment);
    const adjustedAnnualNOI = adjustedMonthlyNOI * 12;
    const adjustedDSCR = annualDebtService > 0 ? adjustedAnnualNOI / annualDebtService : 0;

    // Determine if test passes (basic criteria)
    const passesTest = 
      adjustedMonthlyCashFlow > 0 && // Positive cash flow
      adjustedDSCR >= 1.0 && // Can cover debt service
      adjustedCoCReturn > 0; // Positive return

    // Get severity based on DSCR
    const severity = getSeverity(adjustedDSCR);

    results.push({
      scenarioName: scenario.scenarioName,
      cashFlow: adjustedMonthlyCashFlow,
      cocReturn: adjustedCoCReturn,
      dscr: adjustedDSCR,
      passesTest,
      severity,
      description: scenario.description,
      impactPercentage: scenario.impactPercentage,
    });
  });

  return results;
};

/**
 * Get a summary of stress test results
 */
export const getStressTestSummary = (
  results: StressTestResultWithMetrics[],
): {
  totalTests: number;
  passed: number;
  failed: number;
  passRate: number;
  worstScenario: string;
  criticalCount: number;
  severeCount: number;
  moderateCount: number;
  mildCount: number;
} => {
  const totalTests = results.length;
  const passed = results.filter((r) => r.passesTest).length;
  const failed = totalTests - passed;
  const passRate = (passed / totalTests) * 100;

  const worstScenario =
    results.reduce((worst, current) =>
      current.cashFlow < worst.cashFlow ? current : worst,
    ).scenarioName;

  const criticalCount = results.filter((r) => r.severity === "Critical").length;
  const severeCount = results.filter((r) => r.severity === "Severe").length;
  const moderateCount = results.filter((r) => r.severity === "Moderate").length;
  const mildCount = results.filter((r) => r.severity === "Mild").length;

  return {
    totalTests,
    passed,
    failed,
    passRate,
    worstScenario,
    criticalCount,
    severeCount,
    moderateCount,
    mildCount,
  };
};

