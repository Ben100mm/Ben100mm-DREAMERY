/**
 * Calculations hook for UnderwritePage
 * Handles all financial calculations and metrics
 */

import { useMemo } from "react";
import {
  totalMonthlyDebtService,
  computeFixedMonthlyOps,
  computeVariableMonthlyOpsPct,
  computeVariableExpenseFromPercentages,
} from "../../../utils/finance";
import {
  calculateSeasonalAdjustments,
  calculateMarketAdjustments,
  calculateExitStrategies,
  calculateRefinanceScenarios,
  calculateTaxImplications,
  calculateEnhancedTaxImplications,
  calculateRiskScore,
  calculateConfidenceIntervals,
  calculateStressTest,
  calculateInflationAdjustments,
  calculateYearsUntilRefinance,
  calculateRefinancePotential,
} from "../../../utils/advancedCalculations";
import {
  computeIncome,
  computeGrossPotentialIncome,
  computeLoanAmount,
  computeCocAnnual,
  buildAmortization,
  calculateConfidenceInterval,
} from "../utils";
import { DealState, MetricWithConfidence, AmortizationRow } from "../types";

export interface CalculatedMetrics {
  // Income & Expenses
  monthlyIncome: number;
  monthlyFixedOps: number;
  monthlyVariableOps: number;
  monthlyDebtService: number;
  monthlyExpenses: number;
  
  // Cash Flow
  monthlyCashFlow: number;
  annualCashFlow: number;
  
  // NOI & Cap Rate
  monthlyNOI: number;
  annualNOI: number;
  capRate: number;
  
  // Returns
  cocReturn: number;
  dscr: number;
  
  // Loan & Equity
  loanAmount: number;
  totalCashInvested: number;
  equity: number;
  
  // Amortization
  amortizationSchedule: AmortizationRow[];
}

/**
 * Hook for all financial calculations
 */
export function useCalculations(state: DealState) {
  // ============================================================================
  // Basic Income & Expense Calculations
  // ============================================================================
  
  const monthlyIncome = useMemo(() => computeIncome(state), [state]);
  
  const grossPotentialIncome = useMemo(
    () => computeGrossPotentialIncome(state),
    [state]
  );
  
  const monthlyFixedOps = useMemo(
    () => computeFixedMonthlyOps(state.ops),
    [state.ops]
  );
  
  const monthlyVariableOps = useMemo(
    () => computeVariableExpenseFromPercentages(grossPotentialIncome, state.ops),
    [grossPotentialIncome, state.ops]
  );
  
  const monthlyDebtService = useMemo(
    () =>
      totalMonthlyDebtService({
        newLoanMonthly: state.loan.monthlyPayment || 0,
        subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
        hybridMonthly: state.hybrid?.monthlyPayment,
      }),
    [state.loan.monthlyPayment, state.subjectTo?.totalMonthlyPayment, state.hybrid?.monthlyPayment]
  );
  
  const monthlyExpenses = useMemo(
    () => monthlyFixedOps + monthlyVariableOps + monthlyDebtService,
    [monthlyFixedOps, monthlyVariableOps, monthlyDebtService]
  );
  
  // ============================================================================
  // Cash Flow Calculations
  // ============================================================================
  
  const monthlyCashFlow = useMemo(
    () => monthlyIncome - monthlyFixedOps - monthlyVariableOps - monthlyDebtService,
    [monthlyIncome, monthlyFixedOps, monthlyVariableOps, monthlyDebtService]
  );
  
  const annualCashFlow = useMemo(() => monthlyCashFlow * 12, [monthlyCashFlow]);
  
  // ============================================================================
  // NOI & Cap Rate
  // ============================================================================
  
  const monthlyNOI = useMemo(
    () => monthlyIncome - monthlyFixedOps - monthlyVariableOps,
    [monthlyIncome, monthlyFixedOps, monthlyVariableOps]
  );
  
  const annualNOI = useMemo(() => monthlyNOI * 12, [monthlyNOI]);
  
  const capRate = useMemo(() => {
    if (state.purchasePrice <= 0) return 0;
    return (annualNOI / state.purchasePrice) * 100;
  }, [annualNOI, state.purchasePrice]);
  
  // ============================================================================
  // Returns & Metrics
  // ============================================================================
  
  const loanAmount = useMemo(() => computeLoanAmount(state), [state]);
  
  const totalCashInvested = useMemo(() => {
    if (state.operationType === "Rental Arbitrage") {
      return (
        (state.arbitrage?.deposit ?? 0) +
        (state.arbitrage?.estimateCostOfRepairs ?? 0) +
        (state.arbitrage?.furnitureCost ?? 0) +
        (state.arbitrage?.otherStartupCosts ?? 0)
      );
    }
    
    return (
      (state.loan.downPayment || 0) +
      (state.loan.closingCosts || 0) +
      (state.loan.rehabCosts || 0) +
      (state.operationType === "Short Term Rental" ? state.arbitrage?.furnitureCost || 0 : 0) +
      state.subjectTo.paymentToSeller +
      (state.reservesCalculationMethod === "months"
        ? (monthlyFixedOps + monthlyVariableOps) * (state.reservesMonths || 0)
        : state.reservesFixedAmount || 0)
    );
  }, [
    state.operationType,
    state.arbitrage,
    state.loan,
    state.subjectTo,
    state.reservesCalculationMethod,
    state.reservesMonths,
    state.reservesFixedAmount,
    monthlyFixedOps,
    monthlyVariableOps,
  ]);
  
  const cocReturn = useMemo(
    () => computeCocAnnual(state, annualCashFlow),
    [state, annualCashFlow]
  );
  
  const dscr = useMemo(() => {
    if (monthlyDebtService <= 0) return 0;
    return monthlyNOI / monthlyDebtService;
  }, [monthlyNOI, monthlyDebtService]);
  
  const equity = useMemo(
    () => state.purchasePrice - loanAmount,
    [state.purchasePrice, loanAmount]
  );
  
  // ============================================================================
  // Amortization Schedule
  // ============================================================================
  
  const amortizationSchedule = useMemo(() => {
    const amount = state.loan?.loanAmount || 0;
    const rate = state.loan?.annualInterestRate || 0;
    const years = state.loan?.amortizationYears || 0;
    const io = state.loan?.interestOnly || false;
    const ioPeriod = state.loan?.ioPeriodMonths || 0;
    
    if (amount <= 0 || years <= 0) return [];
    
    return buildAmortization(amount, rate, years, io, undefined, ioPeriod);
  }, [
    state.loan?.loanAmount,
    state.loan?.annualInterestRate,
    state.loan?.amortizationYears,
    state.loan?.interestOnly,
    state.loan?.ioPeriodMonths,
  ]);
  
  // ============================================================================
  // Confidence Intervals (if enabled)
  // ============================================================================
  
  const cocWithConfidence = useMemo((): MetricWithConfidence | null => {
    if (!state.showConfidenceIntervals) return null;
    
    if (totalCashInvested <= 0) {
      return {
        low: 0,
        base: 0,
        high: 0,
        standardDeviation: 0,
        confidenceLevel: state.uncertaintyParameters.confidenceLevel,
      };
    }
    
    const baseCoC = cocReturn;
    
    const combinedUncertainty = Math.sqrt(
      Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
        Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
    );
    
    return calculateConfidenceInterval(
      baseCoC,
      combinedUncertainty,
      state.uncertaintyParameters.confidenceLevel
    );
  }, [
    state.showConfidenceIntervals,
    state.uncertaintyParameters,
    totalCashInvested,
    cocReturn,
  ]);
  
  const noiWithConfidence = useMemo((): MetricWithConfidence | null => {
    if (!state.showConfidenceIntervals) return null;
    
    const combinedUncertainty = Math.sqrt(
      Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
        Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
    );
    
    return calculateConfidenceInterval(
      annualNOI,
      combinedUncertainty,
      state.uncertaintyParameters.confidenceLevel
    );
  }, [state.showConfidenceIntervals, state.uncertaintyParameters, annualNOI]);
  
  const capRateWithConfidence = useMemo((): MetricWithConfidence | null => {
    if (!state.showConfidenceIntervals) return null;
    
    if (state.purchasePrice <= 0) {
      return {
        low: 0,
        base: 0,
        high: 0,
        standardDeviation: 0,
        confidenceLevel: state.uncertaintyParameters.confidenceLevel,
      };
    }
    
    const combinedUncertainty = Math.sqrt(
      Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
        Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
    );
    
    return calculateConfidenceInterval(
      capRate,
      combinedUncertainty,
      state.uncertaintyParameters.confidenceLevel
    );
  }, [
    state.showConfidenceIntervals,
    state.uncertaintyParameters,
    state.purchasePrice,
    capRate,
  ]);
  
  // ============================================================================
  // Return all calculated metrics
  // ============================================================================
  
  return {
    // Basic metrics
    monthlyIncome,
    grossPotentialIncome,
    monthlyFixedOps,
    monthlyVariableOps,
    monthlyDebtService,
    monthlyExpenses,
    
    // Cash flow
    monthlyCashFlow,
    annualCashFlow,
    
    // NOI & Cap Rate
    monthlyNOI,
    annualNOI,
    capRate,
    
    // Returns
    cocReturn,
    dscr,
    
    // Loan & Equity
    loanAmount,
    totalCashInvested,
    equity,
    
    // Amortization
    amortizationSchedule,
    
    // Confidence intervals
    cocWithConfidence,
    noiWithConfidence,
    capRateWithConfidence,
  };
}

