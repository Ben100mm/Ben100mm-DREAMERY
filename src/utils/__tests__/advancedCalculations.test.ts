import {
  calculateSeasonalAdjustments,
  calculateMarketAdjustments,
  calculateExitStrategies,
  calculateRefinanceScenarios,
  calculateTaxImplications,
  calculateInflationAdjustments,
  calculateSensitivityAnalysis,
  calculateStressTest,
  calculateRiskScore,
  defaultMarketConditions,
  defaultSeasonalFactors,
} from '../advancedCalculations';

describe('advancedCalculations', () => {
  test('calculateSeasonalAdjustments returns adjusted vacancy and maintenance multiplier', () => {
    const baseVacancy = 0.05;
    const res = calculateSeasonalAdjustments(baseVacancy, defaultSeasonalFactors, 7); // July -> summerVacancyRate 0.1
    expect(res.adjustedVacancyRate).toBeCloseTo(baseVacancy * (1 + defaultSeasonalFactors.summerVacancyRate));
    expect(res.maintenanceMultiplier).toBe(defaultSeasonalFactors.seasonalMaintenanceMultiplier);
  });

  test('calculateMarketAdjustments applies market conditions', () => {
    const base = { vacancyRate: 0.05, rentGrowth: 0.03, appreciation: 0.04, capRate: 0.06 };
    const hot = defaultMarketConditions.hot;
    const res = calculateMarketAdjustments(base, hot);
    expect(res.adjustedVacancyRate).toBeCloseTo(base.vacancyRate * (1 + hot.vacancyRateAdjustment));
    expect(res.adjustedRentGrowth).toBeCloseTo(base.rentGrowth * (1 + hot.rentGrowthRate));
    expect(res.adjustedAppreciation).toBeCloseTo(base.appreciation * (1 + hot.appreciationRate));
    expect(res.adjustedCapRate).toBeCloseTo(base.capRate * (1 + hot.capRateAdjustment));
  });

  test('calculateExitStrategies computes ROI and annualized ROI', () => {
    const propertyValue = 300000;
    const currentMarketValue = 330000;
    const strategies = [
      { timeframe: 2, sellingCosts: 6, capitalGainsTax: 15, depreciationRecapture: 10, marketAppreciation: 0.04 },
      { timeframe: 5, sellingCosts: 6, capitalGainsTax: 15, depreciationRecapture: 10, marketAppreciation: 0.04 },
    ];
    const res = calculateExitStrategies(propertyValue, strategies, currentMarketValue);
    expect(res.length).toBe(2);
    res.forEach((r) => {
      expect(r.projectedValue).toBeGreaterThan(0);
      expect(Number.isFinite(r.roi)).toBe(true);
      expect(Number.isFinite(r.annualizedRoi)).toBe(true);
    });
  });

  test('calculateRefinanceScenarios returns meaningful savings and break-even', () => {
    const currentLoan = { balance: 250000, rate: 6.5, term: 30, monthlyPayment: 1580 };
    const propertyValue = 350000;
    const scenarios = [
      { timing: 2, newRate: 5.5, newTerm: 30, refinanceCosts: 5000, cashOutAmount: 0 },
      { timing: 5, newRate: 5.0, newTerm: 25, refinanceCosts: 5000, cashOutAmount: 25000 },
    ];
    const res = calculateRefinanceScenarios(currentLoan, scenarios, propertyValue);
    expect(res.length).toBe(2);
    res.forEach((r) => {
      expect(Number.isFinite(r.newMonthlyPayment)).toBe(true);
      expect(Number.isFinite(r.monthlySavings)).toBe(true);
      expect(Number.isFinite(r.breakEvenMonths)).toBe(true);
    });
  });

  test('calculateTaxImplications respects deductions', () => {
    const annualIncome = 120000;
    const expenses = { mortgageInterest: 12000, propertyTax: 6000, depreciation: 8000, repairs: 3000 };
    const imp = { propertyTaxDeduction: true, mortgageInterestDeduction: true, depreciationDeduction: true, repairExpenseDeduction: false, taxBracket: 24 };
    const res = calculateTaxImplications(annualIncome, expenses, imp);
    expect(res.taxableIncome).toBeLessThan(annualIncome);
    expect(res.netIncome).toBeGreaterThan(0);
    expect(res.effectiveTaxRate).toBeGreaterThanOrEqual(0);
  });

  test('calculateInflationAdjustments projects forward', () => {
    const base = { rent: 2500, expenses: 1500, propertyValue: 350000 };
    const res = calculateInflationAdjustments(base, 2.5, 10);
    expect(res.adjustedRent).toBeGreaterThan(base.rent);
    expect(res.adjustedExpenses).toBeGreaterThan(base.expenses);
    expect(res.adjustedPropertyValue).toBeGreaterThan(base.propertyValue);
  });

  test('calculateSensitivityAnalysis varies cash flow', () => {
    const base = { monthlyRent: 2500, monthlyExpenses: 1500, propertyValue: 350000, monthlyCashFlow: 1000 };
    const variations = [ { rentChange: -10, expenseChange: 10, valueChange: -5 }, { rentChange: 10, expenseChange: -5, valueChange: 5 } ];
    const res = calculateSensitivityAnalysis(base, variations);
    expect(res.length).toBe(2);
    res.forEach((r) => {
      expect(Number.isFinite(r.adjustedCashFlow)).toBe(true);
      expect(Number.isFinite(r.cashFlowChangePercent)).toBe(true);
    });
  });

  test('calculateStressTest degrades metrics and assigns risk level', () => {
    const base = { monthlyRent: 2500, monthlyExpenses: 1500, propertyValue: 350000, monthlyCashFlow: 1000, annualRoi: 3.4 };
    const stress = { rentDrop: 20, expenseIncrease: 25, valueDrop: 15, vacancyIncrease: 30 };
    const res = calculateStressTest(base, stress);
    expect(Number.isFinite(res.stressTestCashFlow)).toBe(true);
    expect(['Low', 'Medium', 'High', 'Critical']).toContain(res.riskLevel);
  });

  test('calculateRiskScore returns category and breakdown', () => {
    const riskFactors = { marketVolatility: 5, tenantQuality: 5, propertyCondition: 5, locationStability: 5, financingRisk: 5 };
    const market = defaultMarketConditions.stable;
    const propertyAge = { age: 20, maintenanceCostMultiplier: 1.0, utilityEfficiencyMultiplier: 1.0, insuranceCostMultiplier: 1.0, expectedLifespan: 50 };
    const res = calculateRiskScore(riskFactors, market, propertyAge);
    expect(Number.isFinite(res.overallRiskScore)).toBe(true);
    expect(['Low', 'Medium', 'High', 'Very High']).toContain(res.riskCategory);
    expect(res.recommendations).toBeInstanceOf(Array);
  });
});


