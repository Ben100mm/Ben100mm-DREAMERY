import { describe, it, expect } from "@jest/globals";
import {
  pmt,
  remainingPrincipalAfterPayments,
  totalMonthlyDebtService,
  breakEvenOccupancy,
  brrrrAnnualCashFlowPostRefi,
} from "../finance";

describe("finance utils", () => {
  it("pmt computes correct fixed payment (rough)", () => {
    const annualRate = 0.06; // 6%
    const nper = 360; // 30 years
    const pv = 300000;
    const payment = pmt(annualRate, nper, pv);
    // Around $1,798.65
    expect(Math.round(payment)).toBeGreaterThan(1700);
    expect(Math.round(payment)).toBeLessThan(1900);
  });

  it("remaining principal after 0 and full term", () => {
    const spec = { principal: 200000, annualRate: 0.05, termMonths: 360 };
    expect(remainingPrincipalAfterPayments(spec, 0)).toBeCloseTo(200000, 2);
    const rem = remainingPrincipalAfterPayments(spec, 360);
    expect(rem).toBeLessThan(1000); // near zero
  });

  it("totalMonthlyDebtService sums all parts", () => {
    expect(totalMonthlyDebtService({ newLoanMonthly: 1000 })).toBe(1000);
    expect(
      totalMonthlyDebtService({
        newLoanMonthly: 1000,
        subjectToMonthlyTotal: 300,
      }),
    ).toBe(1300);
    expect(
      totalMonthlyDebtService({
        newLoanMonthly: 1000,
        subjectToMonthlyTotal: 300,
        hybridMonthly: 200,
      }),
    ).toBe(1500);
  });

  it("breakEvenOccupancy respects variable toggle", () => {
    const monthlyRevenueAt100 = 5000;
    const fixed = 2000;
    const varPct = 0.1; // 10%
    const off = breakEvenOccupancy({
      monthlyRevenueAt100,
      fixedMonthlyOps: fixed,
      variablePct: varPct,
      includeVariablePct: false,
    });
    const on = breakEvenOccupancy({
      monthlyRevenueAt100,
      fixedMonthlyOps: fixed,
      variablePct: varPct,
      includeVariablePct: true,
    });
    expect(off).toBeCloseTo(2000 / 5000, 6);
    expect(on).toBeCloseTo((2000 + 0.1 * 5000) / 5000, 6);
  });

  it("brrrrAnnualCashFlowPostRefi basic scenario", () => {
    const cf = brrrrAnnualCashFlowPostRefi({
      monthlyRevenue: 6000,
      fixedMonthlyOps: 2000,
      variablePct: 0.1,
      newLoanMonthly: 1500,
    });
    // NOI monthly = 6000 - 2000 - 600 = 3400; annual NOI = 40800; DS annual = 18000; CF = 22800
    expect(Math.round(cf)).toBe(22800);
  });
});
