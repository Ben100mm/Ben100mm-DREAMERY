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

