/**
 * Calculations hook for UnderwritePage
 * Handles all financial calculations and metrics using the centralized calculation service
 */

import { useMemo } from "react";
import { underwriteCalculationService } from "../../../services/underwriteCalculationService";
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
 * Now using the centralized calculation service for better maintainability
 */
export function useCalculations(state: DealState) {
  const service = underwriteCalculationService;
  
  // Calculate all metrics using the service with memoization
  const basicMetrics = useMemo(() => service.calculateBasicMetrics(state), [state]);
  const noiMetrics = useMemo(() => service.calculateNOIMetrics(state), [state]);
  const returnMetrics = useMemo(() => service.calculateReturnMetrics(state), [state]);
  const equityMetrics = useMemo(() => service.calculateEquityMetrics(state), [state]);
  const amortizationSchedule = useMemo(() => service.calculateAmortizationSchedule(state), [state]);
  
  // Confidence intervals (if enabled)
  const cocWithConfidence = useMemo(
    () => service.calculateCoCWithConfidence(state),
    [state, state.showConfidenceIntervals, state.uncertaintyParameters]
  );
  
  const noiWithConfidence = useMemo(
    () => service.calculateNOIWithConfidence(state),
    [state, state.showConfidenceIntervals, state.uncertaintyParameters]
  );
  
  const capRateWithConfidence = useMemo(
    () => service.calculateCapRateWithConfidence(state),
    [state, state.showConfidenceIntervals, state.uncertaintyParameters]
  );
  
  // Return all calculated metrics in the same format as before
  return {
    // Basic metrics
    monthlyIncome: basicMetrics.monthlyIncome,
    grossPotentialIncome: basicMetrics.grossPotentialIncome,
    monthlyFixedOps: basicMetrics.monthlyFixedOps,
    monthlyVariableOps: basicMetrics.monthlyVariableOps,
    monthlyDebtService: basicMetrics.monthlyDebtService,
    monthlyExpenses: basicMetrics.monthlyExpenses,
    
    // Cash flow
    monthlyCashFlow: basicMetrics.monthlyCashFlow,
    annualCashFlow: basicMetrics.annualCashFlow,
    
    // NOI & Cap Rate
    monthlyNOI: noiMetrics.monthlyNOI,
    annualNOI: noiMetrics.annualNOI,
    capRate: noiMetrics.capRate,
    
    // Returns
    cocReturn: returnMetrics.cocReturn,
    dscr: returnMetrics.dscr,
    
    // Loan & Equity
    loanAmount: equityMetrics.loanAmount,
    totalCashInvested: equityMetrics.totalCashInvested,
    equity: equityMetrics.equity,
    
    // Amortization
    amortizationSchedule,
    
    // Confidence intervals
    cocWithConfidence,
    noiWithConfidence,
    capRateWithConfidence,
  };
}

