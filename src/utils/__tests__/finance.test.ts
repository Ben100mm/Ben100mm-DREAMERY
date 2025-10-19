import { describe, it, expect } from "@jest/globals";
import {
  pmt,
  monthlyRate,
  remainingPrincipalAfterPayments,
  totalMonthlyDebtService,
  breakEvenOccupancy,
  brrrrAnnualCashFlowPostRefi,
  computeFixedMonthlyOps,
  computeVariableExpensePct,
  computeVariableExpenseDollars,
  computeVariableExpenseFromPercentages,
  computeVariableMonthlyOpsPct,
  type LoanSpec,
  type OperatingInputs,
} from "../finance";

describe("Finance Utils - Comprehensive Test Suite", () => {
  // ========================================
  // PMT FUNCTION TESTS (10 test cases)
  // ========================================
  describe("pmt() - Payment Calculation", () => {
    it("should calculate correct payment for standard 30-year mortgage", () => {
      const annualRate = 0.06; // 6%
      const nper = 360; // 30 years
      const pv = 300000;
      const payment = pmt(annualRate, nper, pv);
      // Expected: ~$1,798.65
      expect(payment).toBeCloseTo(1798.65, 2);
    });

    it("should calculate correct payment for 15-year mortgage", () => {
      const annualRate = 0.045; // 4.5%
      const nper = 180; // 15 years
      const pv = 250000;
      const payment = pmt(annualRate, nper, pv);
      // Expected: ~$1,912.48
      expect(payment).toBeCloseTo(1912.48, 2);
    });

    it("should calculate correct payment for high interest rate", () => {
      const annualRate = 0.12; // 12%
      const nper = 360; // 30 years
      const pv = 200000;
      const payment = pmt(annualRate, nper, pv);
      // Expected: ~$2,057.23
      expect(payment).toBeCloseTo(2057.23, 2);
    });

    it("should calculate correct payment for short-term loan", () => {
      const annualRate = 0.08; // 8%
      const nper = 60; // 5 years
      const pv = 50000;
      const payment = pmt(annualRate, nper, pv);
      // Expected: ~$1,013.82
      expect(payment).toBeCloseTo(1013.82, 2);
    });

    it("should handle zero interest rate (straight principal repayment)", () => {
      const annualRate = 0; // 0%
      const nper = 120; // 10 years
      const pv = 120000;
      const payment = pmt(annualRate, nper, pv);
      // Expected: 120000 / 120 = 1000
      expect(payment).toBe(1000);
    });

    it("should handle very low interest rate", () => {
      const annualRate = 0.001; // 0.1%
      const nper = 360;
      const pv = 300000;
      const payment = pmt(annualRate, nper, pv);
      // Should be slightly more than principal/nper
      expect(payment).toBeGreaterThan(300000 / 360);
      expect(payment).toBeLessThan(900);
    });

    it("should throw error for negative principal", () => {
      expect(() => pmt(0.05, 360, -100000)).toThrow(
        "Invalid inputs: principal, term, and rate must be non-negative, term must be positive."
      );
    });

    it("should throw error for negative interest rate", () => {
      expect(() => pmt(-0.05, 360, 100000)).toThrow(
        "Invalid inputs: principal, term, and rate must be non-negative, term must be positive."
      );
    });

    it("should throw error for zero or negative term", () => {
      expect(() => pmt(0.05, 0, 100000)).toThrow(
        "Invalid inputs: principal, term, and rate must be non-negative, term must be positive."
      );
      expect(() => pmt(0.05, -120, 100000)).toThrow(
        "Invalid inputs: principal, term, and rate must be non-negative, term must be positive."
      );
    });

    it("should handle very small principal amount", () => {
      const annualRate = 0.05; // 5%
      const nper = 12; // 1 year
      const pv = 100;
      const payment = pmt(annualRate, nper, pv);
      expect(payment).toBeGreaterThan(8);
      expect(payment).toBeLessThan(9);
    });
  });

  // ========================================
  // MONTHLY RATE HELPER TESTS (2 test cases)
  // ========================================
  describe("monthlyRate() - Interest Rate Conversion", () => {
    it("should convert annual rate to monthly rate correctly", () => {
      expect(monthlyRate(0.12)).toBeCloseTo(0.01, 6);
      expect(monthlyRate(0.06)).toBeCloseTo(0.005, 6);
      expect(monthlyRate(0.048)).toBeCloseTo(0.004, 6);
    });

    it("should throw error for negative rate", () => {
      expect(() => monthlyRate(-0.05)).toThrow(
        "Annual interest rate cannot be negative."
      );
    });
  });

  // ========================================
  // REMAINING PRINCIPAL TESTS (15 test cases)
  // ========================================
  describe("remainingPrincipalAfterPayments() - Loan Balance Calculation", () => {
    it("should return full principal with zero payments made", () => {
      const spec: LoanSpec = {
        principal: 200000,
        annualRate: 0.05,
        termMonths: 360,
      };
      expect(remainingPrincipalAfterPayments(spec, 0)).toBe(200000);
    });

    it("should return near-zero balance after all payments made", () => {
      const spec: LoanSpec = {
        principal: 200000,
        annualRate: 0.05,
        termMonths: 360,
      };
      const remaining = remainingPrincipalAfterPayments(spec, 360);
      expect(remaining).toBeLessThan(1);
      expect(remaining).toBeGreaterThanOrEqual(0);
    });

    it("should calculate correct balance after 60 payments on 30-year loan", () => {
      const spec: LoanSpec = {
        principal: 300000,
        annualRate: 0.06,
        termMonths: 360,
      };
      const remaining = remainingPrincipalAfterPayments(spec, 60);
      // After 5 years, principal should be ~$280,000
      expect(remaining).toBeGreaterThan(275000);
      expect(remaining).toBeLessThan(285000);
    });

    it("should calculate correct balance after 180 payments on 30-year loan", () => {
      const spec: LoanSpec = {
        principal: 300000,
        annualRate: 0.06,
        termMonths: 360,
      };
      const remaining = remainingPrincipalAfterPayments(spec, 180);
      // After 15 years (halfway), ~71% principal remains due to amortization schedule
      expect(remaining).toBeGreaterThan(210000);
      expect(remaining).toBeLessThan(215000);
    });

    it("should handle interest-only loan (full principal remains)", () => {
      const spec: LoanSpec = {
        principal: 200000,
        annualRate: 0.05,
        termMonths: 360,
        interestOnly: true,
      };
      // After any number of payments, principal unchanged
      expect(remainingPrincipalAfterPayments(spec, 60)).toBe(200000);
      expect(remainingPrincipalAfterPayments(spec, 180)).toBe(200000);
      expect(remainingPrincipalAfterPayments(spec, 359)).toBe(200000);
    });

    it("should handle hybrid IO loan during IO period", () => {
      const spec: LoanSpec = {
        principal: 300000,
        annualRate: 0.06,
        termMonths: 360,
        interestOnly: true,
        ioPeriodMonths: 60, // 5 years IO
      };
      // During IO period, principal unchanged
      expect(remainingPrincipalAfterPayments(spec, 30)).toBe(300000);
      expect(remainingPrincipalAfterPayments(spec, 60)).toBe(300000);
    });

    it("should handle hybrid IO loan after IO period ends", () => {
      const spec: LoanSpec = {
        principal: 300000,
        annualRate: 0.06,
        termMonths: 360,
        interestOnly: true,
        ioPeriodMonths: 60, // 5 years IO, then 25 years amortizing
      };
      // After 120 payments (60 IO + 60 amortizing), principal should have decreased
      const remaining = remainingPrincipalAfterPayments(spec, 120);
      expect(remaining).toBeLessThan(300000);
      expect(remaining).toBeGreaterThan(265000); // Adjusted expectation
    });

    it("should handle zero interest rate (straight principal reduction)", () => {
      const spec: LoanSpec = {
        principal: 120000,
        annualRate: 0,
        termMonths: 120,
      };
      // After 60 payments, exactly half should remain
      expect(remainingPrincipalAfterPayments(spec, 60)).toBe(60000);
      expect(remainingPrincipalAfterPayments(spec, 30)).toBe(90000);
    });

    it("should handle zero interest hybrid IO loan", () => {
      const spec: LoanSpec = {
        principal: 100000,
        annualRate: 0,
        termMonths: 120,
        interestOnly: true,
        ioPeriodMonths: 60,
      };
      // During IO, full principal
      expect(remainingPrincipalAfterPayments(spec, 30)).toBe(100000);
      // After IO, linear amortization over remaining 60 months
      expect(remainingPrincipalAfterPayments(spec, 90)).toBeCloseTo(50000, 2);
    });

    it("should throw error for negative principal", () => {
      const spec: LoanSpec = {
        principal: -100000,
        annualRate: 0.05,
        termMonths: 360,
      };
      expect(() => remainingPrincipalAfterPayments(spec, 60)).toThrow(
        "Invalid loan specification"
      );
    });

    it("should throw error for negative payments made", () => {
      const spec: LoanSpec = {
        principal: 200000,
        annualRate: 0.05,
        termMonths: 360,
      };
      expect(() => remainingPrincipalAfterPayments(spec, -10)).toThrow(
        "Payments made cannot be negative."
      );
    });

    it("should throw error when payments exceed term", () => {
      const spec: LoanSpec = {
        principal: 200000,
        annualRate: 0.05,
        termMonths: 360,
      };
      expect(() => remainingPrincipalAfterPayments(spec, 400)).toThrow(
        "Payments made cannot exceed loan term."
      );
    });

    it("should throw error when IO period exceeds term", () => {
      const spec: LoanSpec = {
        principal: 200000,
        annualRate: 0.05,
        termMonths: 360,
        interestOnly: true,
        ioPeriodMonths: 400,
      };
      expect(() => remainingPrincipalAfterPayments(spec, 60)).toThrow(
        "IO period cannot exceed total loan term."
      );
    });

    it("should handle very short term loan", () => {
      const spec: LoanSpec = {
        principal: 12000,
        annualRate: 0.08,
        termMonths: 12,
      };
      const remaining = remainingPrincipalAfterPayments(spec, 6);
      expect(remaining).toBeGreaterThan(5500);
      expect(remaining).toBeLessThan(6500);
    });

    it("should return zero for fully paid off loan", () => {
      const spec: LoanSpec = {
        principal: 100000,
        annualRate: 0.05,
        termMonths: 120,
      };
      const remaining = remainingPrincipalAfterPayments(spec, 120);
      expect(remaining).toBeLessThan(1);
      expect(remaining).toBeGreaterThanOrEqual(0);
    });
  });

  // ========================================
  // TOTAL DEBT SERVICE TESTS (5 test cases)
  // ========================================
  describe("totalMonthlyDebtService() - Debt Payment Aggregation", () => {
    it("should return only new loan payment when others are undefined", () => {
      expect(totalMonthlyDebtService({ newLoanMonthly: 1500 })).toBe(1500);
    });

    it("should sum new loan and subject-to payments", () => {
      expect(
        totalMonthlyDebtService({
          newLoanMonthly: 1500,
          subjectToMonthlyTotal: 500,
        })
      ).toBe(2000);
    });

    it("should sum all three payment types", () => {
      expect(
        totalMonthlyDebtService({
          newLoanMonthly: 1500,
          subjectToMonthlyTotal: 500,
          hybridMonthly: 300,
        })
      ).toBe(2300);
    });

    it("should handle zero payments", () => {
      expect(
        totalMonthlyDebtService({
          newLoanMonthly: 0,
          subjectToMonthlyTotal: 0,
          hybridMonthly: 0,
        })
      ).toBe(0);
    });

    it("should throw error for negative payments", () => {
      expect(() =>
        totalMonthlyDebtService({ newLoanMonthly: -1000 })
      ).toThrow("Monthly debt service payments cannot be negative.");

      expect(() =>
        totalMonthlyDebtService({
          newLoanMonthly: 1000,
          subjectToMonthlyTotal: -500,
        })
      ).toThrow("Monthly debt service payments cannot be negative.");

      expect(() =>
        totalMonthlyDebtService({
          newLoanMonthly: 1000,
          hybridMonthly: -300,
        })
      ).toThrow("Monthly debt service payments cannot be negative.");
    });
  });

  // ========================================
  // FIXED OPERATING EXPENSES TESTS (6 test cases)
  // ========================================
  describe("computeFixedMonthlyOps() - Fixed Operating Expense Aggregation", () => {
    it("should sum all fixed expenses correctly", () => {
      const ops: OperatingInputs = {
        taxes: 200,
        insurance: 150,
        hoa: 100,
        gasElectric: 80,
        internet: 50,
        waterSewer: 40,
        heat: 60,
        lawnSnow: 30,
        phone: 25,
        cleaner: 75,
        extras: 45,
      };
      expect(computeFixedMonthlyOps(ops)).toBe(855);
    });

    it("should handle undefined values as zero", () => {
      const ops: OperatingInputs = {
        taxes: 200,
        insurance: 150,
      };
      expect(computeFixedMonthlyOps(ops)).toBe(350);
    });

    it("should return zero for all undefined expenses", () => {
      const ops: OperatingInputs = {};
      expect(computeFixedMonthlyOps(ops)).toBe(0);
    });

    it("should include arbitrage rent if provided", () => {
      const ops: OperatingInputs = {
        taxes: 100,
        baseRentForArbitrage: 2000,
      };
      expect(computeFixedMonthlyOps(ops)).toBe(2100);
    });

    it("should throw error for negative expense values", () => {
      const ops: OperatingInputs = {
        taxes: 200,
        insurance: -50,
      };
      expect(() => computeFixedMonthlyOps(ops)).toThrow(
        "Fixed monthly operating expenses cannot be negative."
      );
    });

    it("should handle large expense values", () => {
      const ops: OperatingInputs = {
        taxes: 5000,
        insurance: 3000,
        baseRentForArbitrage: 10000,
      };
      expect(computeFixedMonthlyOps(ops)).toBe(18000);
    });
  });

  // ========================================
  // VARIABLE EXPENSE PERCENTAGE TESTS (8 test cases)
  // ========================================
  describe("computeVariableExpensePct() - Variable Expense Percentage Calculation", () => {
    it("should sum all variable percentages correctly", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10, // 10%
        repairsPct: 0.05, // 5%
        capExPct: 0.05, // 5%
        opExPct: 0.03, // 3%
        utilitiesPct: 0.02, // 2%
      };
      expect(computeVariableExpensePct(ops)).toBeCloseTo(0.25, 6);
    });

    it("should handle undefined percentages as zero", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10,
        repairsPct: 0.05,
      };
      expect(computeVariableExpensePct(ops)).toBeCloseTo(0.15, 6);
    });

    it("should return zero for all undefined percentages", () => {
      const ops: OperatingInputs = {};
      expect(computeVariableExpensePct(ops)).toBe(0);
    });

    it("should handle zero percentages", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0,
        repairsPct: 0,
        capExPct: 0,
      };
      expect(computeVariableExpensePct(ops)).toBe(0);
    });

    it("should throw error for negative percentage", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10,
        repairsPct: -0.05,
      };
      expect(() => computeVariableExpensePct(ops)).toThrow(
        "Variable operating expense percentages cannot be negative."
      );
    });

    it("should throw error for percentage exceeding 100%", () => {
      const ops: OperatingInputs = {
        mgmtPct: 1.5,
      };
      expect(() => computeVariableExpensePct(ops)).toThrow(
        "Variable operating expense percentages cannot exceed 100%."
      );
    });

    it("should handle very small percentages", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.001,
        repairsPct: 0.002,
      };
      expect(computeVariableExpensePct(ops)).toBeCloseTo(0.003, 6);
    });

    it("should handle maximum reasonable percentages", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.20,
        repairsPct: 0.15,
        capExPct: 0.10,
        opExPct: 0.10,
        utilitiesPct: 0.05,
      };
      expect(computeVariableExpensePct(ops)).toBeCloseTo(0.60, 6);
    });
  });

  // ========================================
  // VARIABLE EXPENSE DOLLAR TESTS (6 test cases)
  // ========================================
  describe("computeVariableExpenseDollars() - Variable Expense Dollar Calculation", () => {
    it("should calculate variable expenses correctly", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10, // 10%
        repairsPct: 0.05, // 5%
      };
      const grossIncome = 10000;
      expect(computeVariableExpenseDollars(grossIncome, ops)).toBeCloseTo(
        1500,
        2
      );
    });

    it("should return zero for zero gross income", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10,
      };
      expect(computeVariableExpenseDollars(0, ops)).toBe(0);
    });

    it("should return zero for zero percentages", () => {
      const ops: OperatingInputs = {};
      expect(computeVariableExpenseDollars(10000, ops)).toBe(0);
    });

    it("should handle large gross income values", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.08,
        repairsPct: 0.05,
      };
      const grossIncome = 1000000;
      expect(computeVariableExpenseDollars(grossIncome, ops)).toBe(130000);
    });

    it("should throw error for negative gross income", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10,
      };
      expect(() => computeVariableExpenseDollars(-5000, ops)).toThrow(
        "Gross income cannot be negative."
      );
    });

    it("should propagate errors from percentage calculation", () => {
      const ops: OperatingInputs = {
        mgmtPct: -0.10,
      };
      expect(() => computeVariableExpenseDollars(10000, ops)).toThrow(
        "Variable operating expense percentages cannot be negative."
      );
    });
  });

  // ========================================
  // VARIABLE EXPENSE FROM PERCENTAGES TESTS (6 test cases)
  // ========================================
  describe("computeVariableExpenseFromPercentages() - 0-100 Format Conversion", () => {
    it("should convert 0-100 percentages to dollar amounts correctly", () => {
      const percentages = {
        management: 10, // 10%
        maintenance: 5, // 5%
        capEx: 5, // 5%
      };
      expect(
        computeVariableExpenseFromPercentages(10000, percentages)
      ).toBeCloseTo(2000, 2);
    });

    it("should handle undefined percentages as zero", () => {
      const percentages = {
        management: 10,
      };
      expect(
        computeVariableExpenseFromPercentages(10000, percentages)
      ).toBeCloseTo(1000, 2);
    });

    it("should handle zero percentages", () => {
      const percentages = {
        management: 0,
        maintenance: 0,
      };
      expect(computeVariableExpenseFromPercentages(10000, percentages)).toBe(0);
    });

    it("should handle all expense categories", () => {
      const percentages = {
        management: 10,
        maintenance: 5,
        utilitiesPct: 3,
        capEx: 5,
        opEx: 2,
      };
      expect(
        computeVariableExpenseFromPercentages(10000, percentages)
      ).toBeCloseTo(2500, 2);
    });

    it("should throw error for percentage exceeding 100%", () => {
      const percentages = {
        management: 150,
      };
      expect(() =>
        computeVariableExpenseFromPercentages(10000, percentages)
      ).toThrow("Variable expense percentages cannot exceed 100%.");
    });

    it("should throw error for negative gross income", () => {
      const percentages = {
        management: 10,
      };
      expect(() =>
        computeVariableExpenseFromPercentages(-5000, percentages)
      ).toThrow("Gross income cannot be negative.");
    });
  });

  // ========================================
  // BREAK-EVEN OCCUPANCY TESTS (8 test cases)
  // ========================================
  describe("breakEvenOccupancy() - Break-Even Analysis", () => {
    it("should calculate break-even without variable expenses", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 10000,
        fixedMonthlyOps: 4000,
        variablePct: 0.1,
        includeVariablePct: false,
      });
      expect(result).toBeCloseTo(0.4, 6);
    });

    it("should calculate break-even with variable expenses", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 10000,
        fixedMonthlyOps: 4000,
        variablePct: 0.1,
        includeVariablePct: true,
      });
      // (4000 + 0.1 * 10000) / 10000 = 5000 / 10000 = 0.5
      expect(result).toBeCloseTo(0.5, 6);
    });

    it("should handle zero fixed expenses", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 10000,
        fixedMonthlyOps: 0,
        variablePct: 0.15,
        includeVariablePct: true,
      });
      expect(result).toBeCloseTo(0.15, 6);
    });

    it("should handle zero variable percentage", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 10000,
        fixedMonthlyOps: 3000,
        variablePct: 0,
        includeVariablePct: true,
      });
      expect(result).toBeCloseTo(0.3, 6);
    });

    it("should cap result at 100% (1.0) when expenses exceed revenue", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 5000,
        fixedMonthlyOps: 6000,
        variablePct: 0.1,
        includeVariablePct: false,
      });
      expect(result).toBe(1);
    });

    it("should return 0 when expenses are zero", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 10000,
        fixedMonthlyOps: 0,
        variablePct: 0,
        includeVariablePct: true,
      });
      expect(result).toBe(0);
    });

    it("should throw error for zero or negative revenue", () => {
      expect(() =>
        breakEvenOccupancy({
          monthlyRevenueAt100: 0,
          fixedMonthlyOps: 1000,
          variablePct: 0.1,
          includeVariablePct: false,
        })
      ).toThrow("Monthly revenue must be positive for break-even calculation.");

      expect(() =>
        breakEvenOccupancy({
          monthlyRevenueAt100: -5000,
          fixedMonthlyOps: 1000,
          variablePct: 0.1,
          includeVariablePct: false,
        })
      ).toThrow("Monthly revenue must be positive for break-even calculation.");
    });

    it("should handle high variable percentage", () => {
      const result = breakEvenOccupancy({
        monthlyRevenueAt100: 10000,
        fixedMonthlyOps: 2000,
        variablePct: 0.5,
        includeVariablePct: true,
      });
      // (2000 + 0.5 * 10000) / 10000 = 7000 / 10000 = 0.7
      expect(result).toBeCloseTo(0.7, 6);
    });
  });

  // ========================================
  // BRRRR CASH FLOW TESTS (10 test cases)
  // ========================================
  describe("brrrrAnnualCashFlowPostRefi() - BRRRR Strategy Analysis", () => {
    it("should calculate positive cash flow correctly", () => {
      const cf = brrrrAnnualCashFlowPostRefi({
        monthlyRevenue: 6000,
        fixedMonthlyOps: 2000,
        variablePct: 0.1,
        newLoanMonthly: 1500,
      });
      // Monthly NOI = 6000 - 2000 - 600 = 3400
      // Annual NOI = 40,800
      // Annual debt service = 18,000
      // Cash flow = 22,800
      expect(cf).toBeCloseTo(22800, 2);
    });

    it("should calculate negative cash flow correctly", () => {
      const cf = brrrrAnnualCashFlowPostRefi({
        monthlyRevenue: 3000,
        fixedMonthlyOps: 2000,
        variablePct: 0.2,
        newLoanMonthly: 1500,
      });
      // Monthly NOI = 3000 - 2000 - 600 = 400
      // Annual NOI = 4,800
      // Annual debt service = 18,000
      // Cash flow = -13,200
      expect(cf).toBeCloseTo(-13200, 2);
    });

    it("should handle zero variable expenses", () => {
      const cf = brrrrAnnualCashFlowPostRefi({
        monthlyRevenue: 5000,
        fixedMonthlyOps: 2000,
        variablePct: 0,
        newLoanMonthly: 1000,
      });
      // Monthly NOI = 5000 - 2000 - 0 = 3000
      // Annual NOI = 36,000
      // Annual debt service = 12,000
      // Cash flow = 24,000
      expect(cf).toBe(24000);
    });

    it("should handle zero debt service", () => {
      const cf = brrrrAnnualCashFlowPostRefi({
        monthlyRevenue: 5000,
        fixedMonthlyOps: 2000,
        variablePct: 0.1,
        newLoanMonthly: 0,
      });
      // Monthly NOI = 5000 - 2000 - 500 = 2500
      // Annual NOI = 30,000
      // Cash flow = 30,000
      expect(cf).toBe(30000);
    });

    it("should handle zero fixed expenses", () => {
      const cf = brrrrAnnualCashFlowPostRefi({
        monthlyRevenue: 5000,
        fixedMonthlyOps: 0,
        variablePct: 0.2,
        newLoanMonthly: 1000,
      });
      // Monthly NOI = 5000 - 0 - 1000 = 4000
      // Annual NOI = 48,000
      // Annual debt service = 12,000
      // Cash flow = 36,000
      expect(cf).toBe(36000);
    });

    it("should handle high variable percentage", () => {
      const cf = brrrrAnnualCashFlowPostRefi({
        monthlyRevenue: 10000,
        fixedMonthlyOps: 2000,
        variablePct: 0.5,
        newLoanMonthly: 2000,
      });
      // Monthly NOI = 10000 - 2000 - 5000 = 3000
      // Annual NOI = 36,000
      // Annual debt service = 24,000
      // Cash flow = 12,000
      expect(cf).toBe(12000);
    });

    it("should throw error for negative revenue", () => {
      expect(() =>
        brrrrAnnualCashFlowPostRefi({
          monthlyRevenue: -5000,
          fixedMonthlyOps: 2000,
          variablePct: 0.1,
          newLoanMonthly: 1000,
        })
      ).toThrow("Invalid inputs: all parameters must be non-negative.");
    });

    it("should throw error for negative fixed ops", () => {
      expect(() =>
        brrrrAnnualCashFlowPostRefi({
          monthlyRevenue: 5000,
          fixedMonthlyOps: -2000,
          variablePct: 0.1,
          newLoanMonthly: 1000,
        })
      ).toThrow("Invalid inputs: all parameters must be non-negative.");
    });

    it("should throw error for negative variable percentage", () => {
      expect(() =>
        brrrrAnnualCashFlowPostRefi({
          monthlyRevenue: 5000,
          fixedMonthlyOps: 2000,
          variablePct: -0.1,
          newLoanMonthly: 1000,
        })
      ).toThrow("Invalid inputs: all parameters must be non-negative.");
    });

    it("should throw error for variable percentage exceeding 100%", () => {
      expect(() =>
        brrrrAnnualCashFlowPostRefi({
          monthlyRevenue: 5000,
          fixedMonthlyOps: 2000,
          variablePct: 1.5,
          newLoanMonthly: 1000,
        })
      ).toThrow("Variable percentage cannot exceed 100%.");
    });
  });

  // ========================================
  // BACKWARDS COMPATIBILITY TESTS (1 test case)
  // ========================================
  describe("computeVariableMonthlyOpsPct() - Deprecated Function", () => {
    it("should maintain backwards compatibility with new function", () => {
      const ops: OperatingInputs = {
        mgmtPct: 0.10,
        repairsPct: 0.05,
        capExPct: 0.03,
      };
      expect(computeVariableMonthlyOpsPct(ops)).toBe(
        computeVariableExpensePct(ops)
      );
    });
  });

  // ========================================
  // EDGE CASES AND EXTREME VALUES (15 test cases)
  // ========================================
  describe("Edge Cases and Extreme Values", () => {
    describe("Extreme Principal Values", () => {
      it("should handle very large principal amount", () => {
        const annualRate = 0.05;
        const nper = 360;
        const pv = 10000000; // $10 million
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(0);
        expect(payment).toBeCloseTo(53682.16, 2);
      });

      it("should handle very small principal amount", () => {
        const annualRate = 0.05;
        const nper = 360;
        const pv = 1000; // $1,000
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(0);
        expect(payment).toBeCloseTo(5.37, 2);
      });
    });

    describe("Extreme Interest Rates", () => {
      it("should handle very high interest rate (20%)", () => {
        const annualRate = 0.20;
        const nper = 360;
        const pv = 200000;
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(3300);
        expect(payment).toBeLessThan(3400);
      });

      it("should handle very low interest rate (0.5%)", () => {
        const annualRate = 0.005;
        const nper = 360;
        const pv = 200000;
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(550);
        expect(payment).toBeLessThan(600);
      });
    });

    describe("Extreme Term Lengths", () => {
      it("should handle very short term (6 months)", () => {
        const annualRate = 0.05;
        const nper = 6;
        const pv = 10000;
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(1650);
        expect(payment).toBeLessThan(1700);
      });

      it("should handle very long term (40 years)", () => {
        const annualRate = 0.05;
        const nper = 480; // 40 years
        const pv = 200000;
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(900);
        expect(payment).toBeLessThan(1000);
      });
    });

    describe("Extreme Operating Expenses", () => {
      it("should handle all maximum fixed expenses", () => {
        const ops: OperatingInputs = {
          taxes: 5000,
          insurance: 3000,
          hoa: 1000,
          gasElectric: 500,
          internet: 200,
          waterSewer: 300,
          heat: 400,
          lawnSnow: 250,
          phone: 150,
          cleaner: 500,
          extras: 1000,
          baseRentForArbitrage: 10000,
        };
        expect(computeFixedMonthlyOps(ops)).toBe(22300);
      });

      it("should handle all maximum variable percentages (edge of valid)", () => {
        const ops: OperatingInputs = {
          mgmtPct: 0.20,
          repairsPct: 0.20,
          utilitiesPct: 0.15,
          capExPct: 0.15,
          opExPct: 0.20,
        };
        expect(computeVariableExpensePct(ops)).toBeCloseTo(0.90, 6);
      });
    });

    describe("Zero Value Edge Cases", () => {
      it("should handle all zero operating inputs", () => {
        const ops: OperatingInputs = {
          taxes: 0,
          insurance: 0,
          hoa: 0,
          mgmtPct: 0,
          repairsPct: 0,
        };
        expect(computeFixedMonthlyOps(ops)).toBe(0);
        expect(computeVariableExpensePct(ops)).toBe(0);
      });

      it("should handle zero revenue in variable expense calculation", () => {
        const ops: OperatingInputs = {
          mgmtPct: 0.10,
        };
        expect(computeVariableExpenseDollars(0, ops)).toBe(0);
      });
    });

    describe("Boundary Value Testing", () => {
      it("should handle exactly 100% break-even scenario", () => {
        const result = breakEvenOccupancy({
          monthlyRevenueAt100: 10000,
          fixedMonthlyOps: 10000,
          variablePct: 0,
          includeVariablePct: false,
        });
        expect(result).toBe(1);
      });

      it("should handle remaining principal at exactly half-life", () => {
        const spec: LoanSpec = {
          principal: 100000,
          annualRate: 0,
          termMonths: 100,
        };
        expect(remainingPrincipalAfterPayments(spec, 50)).toBe(50000);
      });
    });

    describe("Precision and Rounding", () => {
      it("should maintain precision for very small monthly payments", () => {
        const annualRate = 0.03;
        const nper = 360;
        const pv = 1000;
        const payment = pmt(annualRate, nper, pv);
        expect(payment).toBeGreaterThan(4);
        expect(payment).toBeLessThan(5);
      });

      it("should handle fractional percentages correctly", () => {
        const ops: OperatingInputs = {
          mgmtPct: 0.0875, // 8.75%
          repairsPct: 0.0325, // 3.25%
        };
        expect(computeVariableExpensePct(ops)).toBeCloseTo(0.12, 6);
      });
    });

    describe("Complex Hybrid Scenarios", () => {
      it("should handle hybrid IO at exactly IO period boundary", () => {
        const spec: LoanSpec = {
          principal: 200000,
          annualRate: 0.06,
          termMonths: 360,
          interestOnly: true,
          ioPeriodMonths: 120,
        };
        // At exactly 120 payments, should still be full principal
        expect(remainingPrincipalAfterPayments(spec, 120)).toBe(200000);
        // At 121, should start decreasing
        expect(remainingPrincipalAfterPayments(spec, 121)).toBeLessThan(200000);
      });
    });
  });
});
