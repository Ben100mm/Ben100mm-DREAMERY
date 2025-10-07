/**
 * Unit tests for UnderwriteCalculationService
 * These tests demonstrate how to test the calculation service
 */

import { underwriteCalculationService } from '../underwriteCalculationService';
import { defaultState } from '../../components/underwrite/constants';
import { DealState } from '../../components/underwrite/types';

describe('UnderwriteCalculationService', () => {
  describe('Basic Calculations', () => {
    it('should calculate monthly income correctly', () => {
      const testState: DealState = {
        ...defaultState,
        sfr: {
          monthlyRent: 2000,
          grossMonthlyIncome: 0,
          grossYearlyIncome: 0,
        },
      };

      const monthlyIncome = underwriteCalculationService.calculateMonthlyIncome(testState);
      expect(monthlyIncome).toBe(2000);
    });

    it('should calculate monthly NOI correctly', () => {
      const testState: DealState = {
        ...defaultState,
        sfr: {
          monthlyRent: 2000,
          grossMonthlyIncome: 0,
          grossYearlyIncome: 0,
        },
        ops: {
          ...defaultState.ops,
          taxes: 100,
          insurance: 50,
          maintenance: 0,
          vacancy: 0,
          management: 0,
          capEx: 0,
          opEx: 0,
        },
      };

      const monthlyNOI = underwriteCalculationService.calculateMonthlyNOI(testState);
      // Income (2000) - Fixed Ops (100 + 50) = 1850
      expect(monthlyNOI).toBe(1850);
    });

    it('should calculate cap rate correctly', () => {
      const testState: DealState = {
        ...defaultState,
        purchasePrice: 200000,
        sfr: {
          monthlyRent: 2000,
          grossMonthlyIncome: 0,
          grossYearlyIncome: 0,
        },
        ops: {
          ...defaultState.ops,
          taxes: 100,
          insurance: 50,
          maintenance: 0,
          vacancy: 0,
          management: 0,
          capEx: 0,
          opEx: 0,
        },
      };

      const capRate = underwriteCalculationService.calculateCapRate(testState);
      // Annual NOI = 1850 * 12 = 22,200
      // Cap Rate = (22,200 / 200,000) * 100 = 11.1%
      expect(capRate).toBeCloseTo(11.1, 1);
    });
  });

  describe('Return Metrics', () => {
    it('should calculate Cash on Cash return correctly', () => {
      const testState: DealState = {
        ...defaultState,
        purchasePrice: 200000,
        loan: {
          ...defaultState.loan,
          downPayment: 40000,
          loanAmount: 160000,
          monthlyPayment: 1000,
          closingCosts: 0,
          rehabCosts: 0,
        },
        sfr: {
          monthlyRent: 2000,
          grossMonthlyIncome: 0,
          grossYearlyIncome: 0,
        },
        ops: {
          ...defaultState.ops,
          taxes: 100,
          insurance: 50,
        },
        reservesCalculationMethod: 'fixed',
        reservesFixedAmount: 0,
      };

      const cocReturn = underwriteCalculationService.calculateCoC(testState);
      // Monthly Cash Flow = 2000 - 150 (ops) - 1000 (debt) = 850
      // Annual Cash Flow = 850 * 12 = 10,200
      // CoC = (10,200 / 40,000) * 100 = 25.5%
      expect(cocReturn).toBeCloseTo(25.5, 1);
    });

    it('should calculate DSCR correctly', () => {
      const testState: DealState = {
        ...defaultState,
        loan: {
          ...defaultState.loan,
          monthlyPayment: 1000,
        },
        sfr: {
          monthlyRent: 2000,
          grossMonthlyIncome: 0,
          grossYearlyIncome: 0,
        },
        ops: {
          ...defaultState.ops,
          taxes: 100,
          insurance: 50,
        },
      };

      const dscr = underwriteCalculationService.calculateDSCR(testState);
      // Monthly NOI = 2000 - 150 = 1850
      // DSCR = 1850 / 1000 = 1.85
      expect(dscr).toBeCloseTo(1.85, 2);
    });

    it('should calculate LTV correctly', () => {
      const testState: DealState = {
        ...defaultState,
        purchasePrice: 200000,
        loan: {
          ...defaultState.loan,
          downPayment: 40000,
          loanAmount: 160000,
        },
      };

      const ltv = underwriteCalculationService.calculateLTV(testState);
      // LTV = (160,000 / 200,000) * 100 = 80%
      expect(ltv).toBe(80);
    });
  });

  describe('Equity Calculations', () => {
    it('should calculate equity correctly', () => {
      const testState: DealState = {
        ...defaultState,
        purchasePrice: 200000,
        loan: {
          ...defaultState.loan,
          downPayment: 40000,
          loanAmount: 160000,
        },
      };

      const equity = underwriteCalculationService.calculateEquity(testState);
      // Equity = 200,000 - 160,000 = 40,000
      expect(equity).toBe(40000);
    });

    it('should calculate equity percentage correctly', () => {
      const testState: DealState = {
        ...defaultState,
        purchasePrice: 200000,
        loan: {
          ...defaultState.loan,
          downPayment: 40000,
          loanAmount: 160000,
        },
      };

      const equityPct = underwriteCalculationService.calculateEquityPercentage(testState);
      // Equity % = (40,000 / 200,000) * 100 = 20%
      expect(equityPct).toBe(20);
    });
  });

  describe('Validation', () => {
    it('should validate valid deal state', () => {
      const result = underwriteCalculationService.validateDealState(defaultState);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid purchase price', () => {
      const invalidState: DealState = {
        ...defaultState,
        purchasePrice: 0,
      };

      const result = underwriteCalculationService.validateDealState(invalidState);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Purchase price must be greater than 0');
    });

    it('should detect invalid interest rate', () => {
      const invalidState: DealState = {
        ...defaultState,
        loan: {
          ...defaultState.loan,
          annualInterestRate: 150,
        },
      };

      const result = underwriteCalculationService.validateDealState(invalidState);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Interest rate must be between 0 and 100');
    });
  });

  describe('Comprehensive Analysis', () => {
    it('should calculate all metrics at once', () => {
      const testState: DealState = {
        ...defaultState,
        purchasePrice: 200000,
        loan: {
          ...defaultState.loan,
          downPayment: 40000,
          loanAmount: 160000,
          monthlyPayment: 1000,
          annualInterestRate: 6,
          amortizationYears: 30,
        },
        sfr: {
          monthlyRent: 2000,
          grossMonthlyIncome: 0,
          grossYearlyIncome: 0,
        },
        ops: {
          ...defaultState.ops,
          taxes: 100,
          insurance: 50,
        },
        reservesCalculationMethod: 'fixed',
        reservesFixedAmount: 0,
      };

      const analysis = underwriteCalculationService.calculateDealAnalysis(testState);

      expect(analysis.monthlyIncome).toBe(2000);
      expect(analysis.monthlyCashFlow).toBeGreaterThan(0);
      expect(analysis.annualNOI).toBeGreaterThan(0);
      expect(analysis.capRate).toBeGreaterThan(0);
      expect(analysis.cocReturn).toBeGreaterThan(0);
      expect(analysis.dscr).toBeGreaterThan(1);
      expect(analysis.loanAmount).toBe(160000);
      expect(analysis.equity).toBe(40000);
      expect(analysis.amortizationSchedule.length).toBeGreaterThan(0);
    });
  });
});

