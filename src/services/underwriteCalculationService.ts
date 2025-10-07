/**
 * Underwrite Calculation Service
 * Centralized service for all real estate deal calculations
 * 
 * This service provides a single source of truth for all financial calculations
 * used in the underwriting process. All methods are pure functions that take
 * a DealState and return calculated values.
 */

import {
  pmt,
  totalMonthlyDebtService,
  computeFixedMonthlyOps,
  computeVariableMonthlyOpsPct,
  computeVariableExpenseFromPercentages,
  remainingPrincipalAfterPayments,
  type LoanSpec,
} from "../utils/finance";
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
  type SeasonalFactors,
  type ExitStrategy,
  type RefinanceScenario,
  type TaxImplications,
  type RiskFactors,
} from "../utils/advancedCalculations";
import {
  DealState,
  MetricWithConfidence,
  AmortizationRow,
} from "../components/underwrite/types";
import {
  computeIncome,
  computeGrossPotentialIncome,
  computeLoanAmount,
  buildAmortization,
  calculateSTRRevenue,
  calculateConfidenceInterval,
  shouldShowAdrTabs,
} from "../components/underwrite/utils";

/**
 * Result interface for basic deal metrics
 */
export interface BasicMetrics {
  monthlyIncome: number;
  grossPotentialIncome: number;
  monthlyFixedOps: number;
  monthlyVariableOps: number;
  monthlyDebtService: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
}

/**
 * Result interface for NOI and cap rate calculations
 */
export interface NOIMetrics {
  monthlyNOI: number;
  annualNOI: number;
  capRate: number;
}

/**
 * Result interface for return metrics
 */
export interface ReturnMetrics {
  cocReturn: number;
  dscr: number;
  roe: number;
  ltv: number;
}

/**
 * Result interface for equity and investment metrics
 */
export interface EquityMetrics {
  loanAmount: number;
  totalCashInvested: number;
  equity: number;
  equityPercentage: number;
}

/**
 * Result interface for IRR calculations
 */
export interface IRRMetrics {
  leveredIRR: number;
  unleveredIRR: number;
  equityMultiple: number;
  moic: number;
}

/**
 * Result interface for comprehensive deal analysis
 */
export interface DealAnalysis extends BasicMetrics, NOIMetrics, ReturnMetrics, EquityMetrics {
  amortizationSchedule: AmortizationRow[];
}

/**
 * Underwrite Calculation Service
 * Singleton service for all underwriting calculations
 */
class UnderwriteCalculationService {
  private static instance: UnderwriteCalculationService;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): UnderwriteCalculationService {
    if (!UnderwriteCalculationService.instance) {
      UnderwriteCalculationService.instance = new UnderwriteCalculationService();
    }
    return UnderwriteCalculationService.instance;
  }

  // ============================================================================
  // Basic Income & Expense Calculations
  // ============================================================================

  /**
   * Calculate monthly income
   */
  public calculateMonthlyIncome(state: DealState): number {
    return computeIncome(state);
  }

  /**
   * Calculate gross potential income (100% occupancy)
   */
  public calculateGrossPotentialIncome(state: DealState): number {
    return computeGrossPotentialIncome(state);
  }

  /**
   * Calculate monthly fixed operating expenses
   */
  public calculateMonthlyFixedOps(state: DealState): number {
    return computeFixedMonthlyOps(state.ops);
  }

  /**
   * Calculate monthly variable operating expenses
   * Uses EGI (Effective Gross Income) per industry standard
   */
  public calculateMonthlyVariableOps(state: DealState): number {
    const egi = computeIncome(state);
    return computeVariableExpenseFromPercentages(egi, state.ops);
  }

  /**
   * Calculate monthly debt service
   */
  public calculateMonthlyDebtService(state: DealState): number {
    return totalMonthlyDebtService({
      newLoanMonthly: state.loan.monthlyPayment || 0,
      subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
      hybridMonthly: state.hybrid?.monthlyPayment,
    });
  }

  /**
   * Calculate total monthly expenses
   */
  public calculateMonthlyExpenses(state: DealState): number {
    const fixedOps = this.calculateMonthlyFixedOps(state);
    const variableOps = this.calculateMonthlyVariableOps(state);
    const debtService = this.calculateMonthlyDebtService(state);
    return fixedOps + variableOps + debtService;
  }

  /**
   * Get all basic metrics at once
   */
  public calculateBasicMetrics(state: DealState): BasicMetrics {
    const monthlyIncome = this.calculateMonthlyIncome(state);
    const grossPotentialIncome = this.calculateGrossPotentialIncome(state);
    const monthlyFixedOps = this.calculateMonthlyFixedOps(state);
    const monthlyVariableOps = this.calculateMonthlyVariableOps(state);
    const monthlyDebtService = this.calculateMonthlyDebtService(state);
    const monthlyExpenses = monthlyFixedOps + monthlyVariableOps + monthlyDebtService;
    const monthlyCashFlow = monthlyIncome - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    return {
      monthlyIncome,
      grossPotentialIncome,
      monthlyFixedOps,
      monthlyVariableOps,
      monthlyDebtService,
      monthlyExpenses,
      monthlyCashFlow,
      annualCashFlow,
    };
  }

  // ============================================================================
  // NOI & Cap Rate Calculations
  // ============================================================================

  /**
   * Calculate Net Operating Income (monthly)
   */
  public calculateMonthlyNOI(state: DealState): number {
    const income = this.calculateMonthlyIncome(state);
    const fixedOps = this.calculateMonthlyFixedOps(state);
    const variableOps = this.calculateMonthlyVariableOps(state);
    return income - fixedOps - variableOps;
  }

  /**
   * Calculate Net Operating Income (annual)
   */
  public calculateAnnualNOI(state: DealState): number {
    return this.calculateMonthlyNOI(state) * 12;
  }

  /**
   * Calculate Capitalization Rate
   */
  public calculateCapRate(state: DealState): number {
    if (state.purchasePrice <= 0) return 0;
    const annualNOI = this.calculateAnnualNOI(state);
    return (annualNOI / state.purchasePrice) * 100;
  }

  /**
   * Get NOI and Cap Rate metrics
   */
  public calculateNOIMetrics(state: DealState): NOIMetrics {
    const monthlyNOI = this.calculateMonthlyNOI(state);
    const annualNOI = monthlyNOI * 12;
    const capRate = this.calculateCapRate(state);

    return {
      monthlyNOI,
      annualNOI,
      capRate,
    };
  }

  // ============================================================================
  // Cash Flow Calculations
  // ============================================================================

  /**
   * Calculate monthly cash flow
   */
  public calculateMonthlyCashFlow(state: DealState): number {
    const income = this.calculateMonthlyIncome(state);
    const expenses = this.calculateMonthlyExpenses(state);
    return income - expenses;
  }

  /**
   * Calculate annual cash flow
   */
  public calculateAnnualCashFlow(state: DealState): number {
    return this.calculateMonthlyCashFlow(state) * 12;
  }

  // ============================================================================
  // Return Metrics
  // ============================================================================

  /**
   * Calculate total cash invested
   */
  public calculateTotalCashInvested(state: DealState): number {
    if (state.operationType === "Rental Arbitrage") {
      return (
        (state.arbitrage?.deposit ?? 0) +
        (state.arbitrage?.estimateCostOfRepairs ?? 0) +
        (state.arbitrage?.furnitureCost ?? 0) +
        (state.arbitrage?.otherStartupCosts ?? 0)
      );
    }

    const fixedOps = this.calculateMonthlyFixedOps(state);
    const variableOps = this.calculateMonthlyVariableOps(state);

    return (
      (state.loan.downPayment || 0) +
      (state.loan.closingCosts || 0) +
      (state.loan.rehabCosts || 0) +
      (state.operationType === "Short Term Rental" ? state.arbitrage?.furnitureCost || 0 : 0) +
      state.subjectTo.paymentToSeller +
      (state.reservesCalculationMethod === "months"
        ? (fixedOps + variableOps) * (state.reservesMonths || 0)
        : state.reservesFixedAmount || 0)
    );
  }

  /**
   * Calculate Cash on Cash Return
   */
  public calculateCoC(state: DealState): number {
    const annualCashFlow = this.calculateAnnualCashFlow(state);
    const cashInvested = this.calculateTotalCashInvested(state);

    if (cashInvested <= 0) return 0;

    return (annualCashFlow / cashInvested) * 100;
  }

  /**
   * Calculate Debt Service Coverage Ratio
   */
  public calculateDSCR(state: DealState): number {
    const monthlyNOI = this.calculateMonthlyNOI(state);
    const monthlyDebtService = this.calculateMonthlyDebtService(state);

    if (monthlyDebtService <= 0) return 0;

    return monthlyNOI / monthlyDebtService;
  }

  /**
   * Calculate Return on Equity
   */
  public calculateROE(state: DealState): number {
    const annualCashFlow = this.calculateAnnualCashFlow(state);
    const equity = this.calculateEquity(state);

    if (equity <= 0) return 0;

    return (annualCashFlow / equity) * 100;
  }

  /**
   * Get all return metrics
   */
  public calculateReturnMetrics(state: DealState): ReturnMetrics {
    return {
      cocReturn: this.calculateCoC(state),
      dscr: this.calculateDSCR(state),
      roe: this.calculateROE(state),
      ltv: this.calculateLTV(state),
    };
  }

  // ============================================================================
  // Equity & Investment Metrics
  // ============================================================================

  /**
   * Calculate loan amount
   */
  public calculateLoanAmount(state: DealState): number {
    return computeLoanAmount(state);
  }

  /**
   * Calculate equity
   */
  public calculateEquity(state: DealState): number {
    return state.purchasePrice - this.calculateLoanAmount(state);
  }

  /**
   * Calculate equity percentage
   */
  public calculateEquityPercentage(state: DealState): number {
    if (state.purchasePrice <= 0) return 0;
    const equity = this.calculateEquity(state);
    return (equity / state.purchasePrice) * 100;
  }

  /**
   * Calculate Loan to Value ratio
   */
  public calculateLTV(state: DealState): number {
    if (state.purchasePrice <= 0) return 0;
    const loanAmount = this.calculateLoanAmount(state);
    return (loanAmount / state.purchasePrice) * 100;
  }

  /**
   * Get all equity metrics
   */
  public calculateEquityMetrics(state: DealState): EquityMetrics {
    const loanAmount = this.calculateLoanAmount(state);
    const equity = this.calculateEquity(state);
    const equityPercentage = this.calculateEquityPercentage(state);
    const totalCashInvested = this.calculateTotalCashInvested(state);

    return {
      loanAmount,
      totalCashInvested,
      equity,
      equityPercentage,
    };
  }

  // ============================================================================
  // IRR & MOIC Calculations
  // ============================================================================

  /**
   * Calculate Internal Rate of Return
   * Simplified version - full implementation would need cash flow projections
   */
  public calculateIRR(state: DealState): number {
    // This is a placeholder - the actual implementation is complex
    // and requires building year-by-year cash flow projections
    // See the original UnderwritePage.tsx for the full implementation
    return 0;
  }

  /**
   * Calculate Multiple on Invested Capital
   */
  public calculateMOIC(state: DealState): number {
    const cashInvested = this.calculateTotalCashInvested(state);
    if (cashInvested <= 0) return 0;

    // Simplified calculation based on current equity
    const currentEquity = this.calculateEquity(state);
    const appreciation = state.appreciation?.futurePropertyValue || state.purchasePrice;
    const futureEquity = appreciation - this.calculateLoanAmount(state);

    return futureEquity / cashInvested;
  }

  /**
   * Calculate equity multiple
   */
  public calculateEquityMultiple(state: DealState): number {
    return this.calculateMOIC(state);
  }

  // ============================================================================
  // Amortization Calculations
  // ============================================================================

  /**
   * Build complete amortization schedule
   */
  public calculateAmortizationSchedule(state: DealState): AmortizationRow[] {
    const amount = state.loan?.loanAmount || 0;
    const rate = state.loan?.annualInterestRate || 0;
    const years = state.loan?.amortizationYears || 0;
    const io = state.loan?.interestOnly || false;
    const ioPeriod = state.loan?.ioPeriodMonths || 0;

    if (amount <= 0 || years <= 0) return [];

    return buildAmortization(amount, rate, years, io, undefined, ioPeriod);
  }

  /**
   * Calculate remaining balance at a specific payment number
   */
  public calculateRemainingBalance(state: DealState, paymentNumber: number): number {
    const schedule = this.calculateAmortizationSchedule(state);
    if (paymentNumber >= schedule.length) return 0;
    return schedule[paymentNumber - 1]?.balance || 0;
  }

  /**
   * Calculate total interest paid over loan term
   */
  public calculateTotalInterest(state: DealState): number {
    const schedule = this.calculateAmortizationSchedule(state);
    return schedule.reduce((sum, row) => sum + row.interest, 0);
  }

  // ============================================================================
  // Confidence Intervals
  // ============================================================================

  /**
   * Calculate CoC with confidence intervals
   */
  public calculateCoCWithConfidence(state: DealState): MetricWithConfidence | null {
    if (!state.showConfidenceIntervals) return null;

    const cocReturn = this.calculateCoC(state);
    const combinedUncertainty = Math.sqrt(
      Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
        Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
    );

    return calculateConfidenceInterval(
      cocReturn,
      combinedUncertainty,
      state.uncertaintyParameters.confidenceLevel
    );
  }

  /**
   * Calculate NOI with confidence intervals
   */
  public calculateNOIWithConfidence(state: DealState): MetricWithConfidence | null {
    if (!state.showConfidenceIntervals) return null;

    const annualNOI = this.calculateAnnualNOI(state);
    const combinedUncertainty = Math.sqrt(
      Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
        Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
    );

    return calculateConfidenceInterval(
      annualNOI,
      combinedUncertainty,
      state.uncertaintyParameters.confidenceLevel
    );
  }

  /**
   * Calculate Cap Rate with confidence intervals
   */
  public calculateCapRateWithConfidence(state: DealState): MetricWithConfidence | null {
    if (!state.showConfidenceIntervals) return null;

    const capRate = this.calculateCapRate(state);
    const combinedUncertainty = Math.sqrt(
      Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
        Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
    );

    return calculateConfidenceInterval(
      capRate,
      combinedUncertainty,
      state.uncertaintyParameters.confidenceLevel
    );
  }

  // ============================================================================
  // Comprehensive Analysis
  // ============================================================================

  /**
   * Calculate all deal metrics at once
   * This is the main method to use for comprehensive analysis
   */
  public calculateDealAnalysis(state: DealState): DealAnalysis {
    const basicMetrics = this.calculateBasicMetrics(state);
    const noiMetrics = this.calculateNOIMetrics(state);
    const returnMetrics = this.calculateReturnMetrics(state);
    const equityMetrics = this.calculateEquityMetrics(state);
    const amortizationSchedule = this.calculateAmortizationSchedule(state);

    return {
      ...basicMetrics,
      ...noiMetrics,
      ...returnMetrics,
      ...equityMetrics,
      amortizationSchedule,
    };
  }

  /**
   * Validate deal state for calculations
   */
  public validateDealState(state: DealState): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (state.purchasePrice <= 0) {
      errors.push("Purchase price must be greater than 0");
    }

    if (state.loan.loanAmount < 0) {
      errors.push("Loan amount cannot be negative");
    }

    if (state.loan.annualInterestRate < 0 || state.loan.annualInterestRate > 100) {
      errors.push("Interest rate must be between 0 and 100");
    }

    if (state.loan.amortizationYears <= 0 || state.loan.amortizationYears > 50) {
      errors.push("Amortization years must be between 1 and 50");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const underwriteCalculationService = UnderwriteCalculationService.getInstance();

// Also export the class for testing purposes
export { UnderwriteCalculationService };

