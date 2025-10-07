/**
 * Tests for Cash Flow Projections
 */

import {
  projectMonthlyRent,
  projectAnnualExpenses,
  projectPropertyValue,
  generateCashFlowProjections,
  createCapitalEvent,
  CapitalEventType,
  CashFlowProjectionParams
} from '../cashFlowProjections';

describe('Cash Flow Projections', () => {
  describe('projectMonthlyRent', () => {
    it('should return initial rent for year 1', () => {
      const result = projectMonthlyRent(2000, 0.03, 1);
      expect(result).toBe(2000);
    });

    it('should project rent growth correctly', () => {
      const result = projectMonthlyRent(2000, 0.03, 2);
      expect(result).toBeCloseTo(2060, 0); // 2000 * 1.03
    });

    it('should compound growth over multiple years', () => {
      const result = projectMonthlyRent(2000, 0.03, 5);
      expect(result).toBeCloseTo(2251.02, 0); // 2000 * 1.03^4
    });

    it('should handle zero growth rate', () => {
      const result = projectMonthlyRent(2000, 0, 10);
      expect(result).toBe(2000);
    });
  });

  describe('projectAnnualExpenses', () => {
    it('should return initial expenses for year 1', () => {
      const result = projectAnnualExpenses(10000, 0.025, 1);
      expect(result).toBe(10000);
    });

    it('should project expense inflation correctly', () => {
      const result = projectAnnualExpenses(10000, 0.025, 2);
      expect(result).toBeCloseTo(10250, 0); // 10000 * 1.025
    });

    it('should compound inflation over multiple years', () => {
      const result = projectAnnualExpenses(10000, 0.025, 5);
      expect(result).toBeCloseTo(11038.13, 0); // 10000 * 1.025^4
    });
  });

  describe('projectPropertyValue', () => {
    it('should return initial value for year 1', () => {
      const result = projectPropertyValue(500000, 0.04, 1);
      expect(result).toBe(500000);
    });

    it('should project appreciation correctly', () => {
      const result = projectPropertyValue(500000, 0.04, 2);
      expect(result).toBeCloseTo(520000, 0); // 500000 * 1.04
    });

    it('should include capital improvements', () => {
      const result = projectPropertyValue(500000, 0.04, 2, 25000);
      expect(result).toBeCloseTo(545000, 0); // (500000 * 1.04) + 25000
    });

    it('should compound appreciation over multiple years', () => {
      const result = projectPropertyValue(500000, 0.04, 10);
      // Actual calculation: 500000 * 1.04^9 = 711,655.91
      expect(result).toBeCloseTo(711656, 0);
    });
  });

  describe('createCapitalEvent', () => {
    it('should create a capital event with correct properties', () => {
      const event = createCapitalEvent(
        5,
        CapitalEventType.ROOF_REPLACEMENT,
        15000,
        'Replace roof',
        true,
        0.8
      );

      expect(event.year).toBe(5);
      expect(event.type).toBe(CapitalEventType.ROOF_REPLACEMENT);
      expect(event.amount).toBe(15000);
      expect(event.description).toBe('Replace roof');
      expect(event.isCapitalImprovement).toBe(true);
      expect(event.valueAddPercentage).toBe(0.8);
      expect(event.id).toBeDefined();
    });

    it('should use type as description if not provided', () => {
      const event = createCapitalEvent(
        3,
        CapitalEventType.HVAC_REPLACEMENT,
        8000,
        undefined,
        true
      );

      expect(event.description).toBe(CapitalEventType.HVAC_REPLACEMENT);
    });
  });

  describe('generateCashFlowProjections', () => {
    const baseParams: CashFlowProjectionParams = {
      purchasePrice: 500000,
      initialMonthlyRent: 3000,
      vacancyRate: 0.05,
      annualTaxes: 6000,
      annualInsurance: 1200,
      annualMaintenance: 3000,
      annualManagement: 3600,
      annualCapEx: 2400,
      loanAmount: 400000,
      annualInterestRate: 0.05,
      loanTermMonths: 360,
      growthRates: {
        rentGrowthRate: 0.03,
        expenseGrowthRate: 0.025,
        propertyAppreciationRate: 0.04
      },
      projectionYears: 10,
      initialInvestment: 100000
    };

    it('should generate correct number of yearly projections', () => {
      const results = generateCashFlowProjections(baseParams);
      expect(results.yearlyProjections).toHaveLength(10);
    });

    it('should calculate year 1 correctly', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];

      expect(year1.year).toBe(1);
      expect(year1.monthlyRent).toBe(3000);
      expect(year1.annualRent).toBe(36000);
      
      // Gross income with vacancy
      const expectedGrossIncome = 36000 * (1 - 0.05);
      expect(year1.annualGrossIncome).toBeCloseTo(expectedGrossIncome, 0);
      
      // Total expenses
      const expectedExpenses = 6000 + 1200 + 3000 + 3600 + 2400;
      expect(year1.totalExpenses).toBeCloseTo(expectedExpenses, 0);
      
      // NOI
      expect(year1.noi).toBeCloseTo(expectedGrossIncome - expectedExpenses, 0);
    });

    it('should apply rent growth over time', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];
      const year5 = results.yearlyProjections[4];

      expect(year5.monthlyRent).toBeGreaterThan(year1.monthlyRent);
      expect(year5.monthlyRent).toBeCloseTo(3000 * Math.pow(1.03, 4), 0);
    });

    it('should apply expense growth over time', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];
      const year5 = results.yearlyProjections[4];

      expect(year5.totalExpenses).toBeGreaterThan(year1.totalExpenses);
    });

    it('should reduce loan balance over time', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];
      const year10 = results.yearlyProjections[9];

      expect(year10.loanBalance).toBeLessThan(year1.loanBalance);
      // Balance at end of year 1 will be slightly less due to principal paydown
      expect(year1.loanBalance).toBeLessThan(400000);
      expect(year1.loanBalance).toBeGreaterThan(390000);
    });

    it('should increase property value with appreciation', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];
      const year10 = results.yearlyProjections[9];

      expect(year10.propertyValue).toBeGreaterThan(year1.propertyValue);
      expect(year10.propertyValue).toBeCloseTo(
        500000 * Math.pow(1.04, 9),
        -3
      );
    });

    it('should calculate cumulative cash flow', () => {
      const results = generateCashFlowProjections(baseParams);
      const year5 = results.yearlyProjections[4];

      const manualSum = results.yearlyProjections
        .slice(0, 5)
        .reduce((sum, proj) => sum + proj.cashFlowAfterCapEx, 0);

      expect(year5.cumulativeCashFlow).toBeCloseTo(manualSum, 0);
    });

    it('should handle capital events correctly', () => {
      const roofEvent = createCapitalEvent(
        5,
        CapitalEventType.ROOF_REPLACEMENT,
        15000,
        'Replace roof',
        true,
        0.8
      );

      const paramsWithEvents = {
        ...baseParams,
        capitalEvents: [roofEvent]
      };

      const results = generateCashFlowProjections(paramsWithEvents);
      const year5 = results.yearlyProjections[4];

      expect(year5.capitalEvents).toHaveLength(1);
      expect(year5.totalCapitalEvents).toBe(15000);
      expect(year5.cashFlowBeforeCapEx).toBeGreaterThan(year5.cashFlowAfterCapEx);
    });

    it('should calculate summary metrics correctly', () => {
      const results = generateCashFlowProjections(baseParams);

      expect(results.summary.totalCashFlow).toBeDefined();
      expect(results.summary.totalPrincipalPaydown).toBeGreaterThan(0);
      expect(results.summary.totalAppreciation).toBeGreaterThan(0);
      expect(results.summary.totalReturn).toBe(
        results.summary.totalCashFlow +
        results.summary.totalPrincipalPaydown +
        results.summary.totalAppreciation
      );
    });

    it('should generate loan paydown schedule', () => {
      const results = generateCashFlowProjections(baseParams);

      expect(results.loanPaydownSchedule.length).toBeGreaterThan(0);
      expect(results.loanPaydownSchedule.length).toBeLessThanOrEqual(120); // 10 years * 12 months
      
      const firstMonth = results.loanPaydownSchedule[0];
      expect(firstMonth.year).toBe(1);
      expect(firstMonth.month).toBe(1);
      expect(firstMonth.payment).toBeGreaterThan(0);
      expect(firstMonth.principal).toBeGreaterThan(0);
      expect(firstMonth.interest).toBeGreaterThan(0);
    });

    it('should handle interest-only loans', () => {
      const ioParams = {
        ...baseParams,
        interestOnly: true,
        ioPeriodMonths: 60 // 5 years IO
      };

      const results = generateCashFlowProjections(ioParams);
      
      // During IO period, principal payments should be 0
      const year1 = results.yearlyProjections[0];
      expect(year1.principalPayment).toBeCloseTo(0, 0);
      
      // After IO period, principal should be paid down
      const year10 = results.yearlyProjections[9];
      expect(year10.principalPayment).toBeGreaterThan(0);
    });

    it('should calculate cash-on-cash return', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];

      const expectedCoC = (year1.cashFlowAfterCapEx / baseParams.initialInvestment) * 100;
      expect(year1.cashOnCashReturn).toBeCloseTo(expectedCoC, 1);
    });

    it('should increase equity over time', () => {
      const results = generateCashFlowProjections(baseParams);
      const year1 = results.yearlyProjections[0];
      const year10 = results.yearlyProjections[9];

      expect(year10.equity).toBeGreaterThan(year1.equity);
      expect(year10.equity).toBe(year10.propertyValue - year10.loanBalance);
    });
  });
});

