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
import {
  generateCashFlowProjections,
  type CashFlowProjectionParams,
  type CashFlowProjectionResults,
} from "../utils/cashFlowProjections";
import {
  runMonteCarloSimulation,
  createDefaultUncertaintyInputs,
  type MonteCarloResults,
  type MonteCarloConfig,
  type MonteCarloInputs,
  type RiskMetrics,
} from "../utils/monteCarloSimulation";

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
 * Result interface for year-specific metrics
 * Accounts for equity growth from principal paydown and appreciation
 */
export interface YearSpecificMetrics {
  year: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  annualCashFlow: number;
  roe: number;
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
 * Detailed breakdown for MOIC calculation
 */
export interface MOICBreakdown {
  cashInvested: number;
  totalCashFlows: number;
  principalPaydown: number;
  appreciation: number;
  exitProceeds: {
    futureValue: number;
    sellingCosts: number;
    remainingLoanBalance: number;
    netSaleProceeds: number;
  };
  totalReturn: number;
  moic: number;
}

/**
 * Detailed breakdown for IRR calculation
 */
export interface IRRBreakdown {
  initialInvestment: number;
  annualCashFlows: number[];
  exitValue: number;
  holdingPeriodYears: number;
  leveredIRR: number;
  unleveredIRR: number;
  equityMultiple: number;
}

/**
 * Configuration for Monte Carlo simulation from service
 */
export interface MonteCarloServiceConfig {
  simulationCount?: number; // Default 10,000
  randomSeed?: number; // For reproducibility
  confidenceLevel?: number; // Default 0.95
  customUncertaintyInputs?: MonteCarloInputs; // Override defaults
  holdingPeriodYears?: number; // Override state default
  sellingCostsPct?: number; // Override default 6%
}

/**
 * Monte Carlo results specific to IRR
 */
export interface MonteCarloIRRResults {
  leveredIRR: {
    mean: number;
    median: number;
    percentile10: number;
    percentile90: number;
    stdDev: number;
  };
  unleveredIRR: {
    mean: number;
    median: number;
    percentile10: number;
    percentile90: number;
    stdDev: number;
  };
  riskMetrics: RiskMetrics;
  fullResults: MonteCarloResults;
}

/**
 * Monte Carlo results specific to MOIC
 */
export interface MonteCarloMOICResults {
  moic: {
    mean: number;
    median: number;
    percentile10: number;
    percentile90: number;
    stdDev: number;
  };
  riskMetrics: RiskMetrics;
  fullResults: MonteCarloResults;
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

  /**
   * Calculate annual cash flow at a specific year
   * Accounts for rent growth and expense growth
   */
  public calculateAnnualCashFlowAtYear(state: DealState, year: number): number {
    if (year <= 0) return this.calculateAnnualCashFlow(state);
    
    // Get initial values
    const initialMonthlyIncome = this.calculateMonthlyIncome(state);
    const initialMonthlyFixedOps = this.calculateMonthlyFixedOps(state);
    const initialMonthlyVariableOps = this.calculateMonthlyVariableOps(state);
    
    // Apply growth rates
    const rentGrowthRate = state.marketConditions?.rentGrowthRate || 0;
    const expenseGrowthRate = 3; // Default expense growth rate
    
    const projectedMonthlyIncome = initialMonthlyIncome * Math.pow(1 + rentGrowthRate / 100, year - 1);
    const projectedMonthlyFixedOps = initialMonthlyFixedOps * Math.pow(1 + expenseGrowthRate / 100, year - 1);
    const projectedMonthlyVariableOps = initialMonthlyVariableOps * Math.pow(1 + expenseGrowthRate / 100, year - 1);
    
    // Debt service typically stays constant (unless it's variable rate)
    const monthlyDebtService = this.calculateMonthlyDebtService(state);
    
    const monthlyCashFlow = projectedMonthlyIncome - projectedMonthlyFixedOps - projectedMonthlyVariableOps - monthlyDebtService;
    
    return monthlyCashFlow * 12;
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
   * Calculate Return on Equity (using initial equity)
   * Note: For multi-year projections, use calculateROEAtYear() instead
   */
  public calculateROE(state: DealState): number {
    const annualCashFlow = this.calculateAnnualCashFlow(state);
    const equity = this.calculateEquity(state);

    if (equity <= 0) return 0;

    return (annualCashFlow / equity) * 100;
  }

  /**
   * Calculate property value at a specific year with appreciation
   */
  public calculatePropertyValueAtYear(state: DealState, year: number): number {
    if (year <= 0) return state.purchasePrice;
    
    const appreciationRate = state.appreciation?.appreciationPercentPerYear || 0;
    return state.purchasePrice * Math.pow(1 + appreciationRate / 100, year);
  }

  /**
   * Calculate loan balance at a specific year
   */
  public calculateLoanBalanceAtYear(state: DealState, year: number): number {
    if (year <= 0) return this.calculateLoanAmount(state);
    
    const schedule = this.calculateAmortizationSchedule(state);
    const monthIndex = Math.min(year * 12 - 1, schedule.length - 1);
    
    if (monthIndex < 0 || monthIndex >= schedule.length) {
      return 0;
    }
    
    return schedule[monthIndex].balance;
  }

  /**
   * Calculate equity at a specific year
   * Accounts for principal paydown and property appreciation
   */
  public calculateEquityAtYear(state: DealState, year: number): number {
    const propertyValue = this.calculatePropertyValueAtYear(state, year);
    const loanBalance = this.calculateLoanBalanceAtYear(state, year);
    return propertyValue - loanBalance;
  }

  /**
   * Calculate Return on Equity at a specific year
   * Uses the equity at that year (not initial equity)
   * Also uses cash flow at that year (accounting for rent and expense growth)
   * This provides a more accurate ROE that reflects principal paydown and appreciation
   */
  public calculateROEAtYear(state: DealState, year: number): number {
    const annualCashFlow = this.calculateAnnualCashFlowAtYear(state, year);
    const equity = this.calculateEquityAtYear(state, year);

    if (equity <= 0) return 0;

    return (annualCashFlow / equity) * 100;
  }

  /**
   * Get all metrics for a specific year
   * Useful for multi-year projections where equity grows over time
   */
  public calculateYearSpecificMetrics(state: DealState, year: number): YearSpecificMetrics {
    const propertyValue = this.calculatePropertyValueAtYear(state, year);
    const loanBalance = this.calculateLoanBalanceAtYear(state, year);
    const equity = this.calculateEquityAtYear(state, year);
    const annualCashFlow = this.calculateAnnualCashFlowAtYear(state, year);
    const roe = this.calculateROEAtYear(state, year);

    return {
      year,
      propertyValue,
      loanBalance,
      equity,
      annualCashFlow,
      roe,
    };
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
   * @deprecated Use calculateComprehensiveIRR() for accurate calculations
   * This simplified version does not account for year-by-year cash flows
   */
  public calculateIRR(state: DealState): number {
    // This is a placeholder - use calculateComprehensiveIRR() instead
    return 0;
  }

  /**
   * Calculate Multiple on Invested Capital
   * @deprecated Use calculateComprehensiveMOIC() for accurate calculations
   * This simplified version does not account for principal paydown
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
   * @deprecated Use calculateComprehensiveMOIC() for accurate calculations
   */
  public calculateEquityMultiple(state: DealState): number {
    return this.calculateMOIC(state);
  }

  // ============================================================================
  // Comprehensive IRR & MOIC Calculations
  // ============================================================================

  /**
   * Convert DealState to CashFlowProjectionParams
   * Helper method to bridge between deal state and cash flow projection inputs
   */
  private convertDealStateToCashFlowParams(
    state: DealState,
    holdingPeriodYears?: number
  ): CashFlowProjectionParams {
    const monthlyIncome = this.calculateMonthlyIncome(state);
    const monthlyFixedOps = this.calculateMonthlyFixedOps(state);
    const monthlyVariableOps = this.calculateMonthlyVariableOps(state);
    const loanAmount = this.calculateLoanAmount(state);
    const totalCashInvested = this.calculateTotalCashInvested(state);
    
    // Get growth rates from state
    const rentGrowthRate = (state.marketConditions?.rentGrowthRate || 2) / 100;
    const expenseGrowthRate = 3 / 100; // Default expense growth rate
    const propertyAppreciationRate = (state.appreciation?.appreciationPercentPerYear || 3) / 100;
    
    // Calculate annual expenses (approximation from monthly)
    const annualOps = (monthlyFixedOps + monthlyVariableOps) * 12;
    
    return {
      purchasePrice: state.purchasePrice,
      currentPropertyValue: state.purchasePrice,
      initialMonthlyRent: monthlyIncome,
      otherMonthlyIncome: 0,
      vacancyRate: 0, // Already factored into monthlyIncome
      annualTaxes: (state.ops.taxes || 0) * 12,
      annualInsurance: (state.ops.insurance || 0) * 12,
      annualMaintenance: (state.ops.maintenance || 0) * 12,
      annualManagement: (state.ops.management || 0) * 12,
      annualCapEx: (state.ops.capEx || 0) * 12,
      otherAnnualExpenses: annualOps - ((state.ops.taxes || 0) + (state.ops.insurance || 0) + 
                          (state.ops.maintenance || 0) + (state.ops.management || 0) + 
                          (state.ops.capEx || 0)) * 12,
      loanAmount,
      annualInterestRate: (state.loan.annualInterestRate || 0) / 100,
      loanTermMonths: (state.loan.amortizationYears || 30) * 12,
      interestOnly: state.loan.interestOnly || false,
      ioPeriodMonths: state.loan.ioPeriodMonths,
      growthRates: {
        rentGrowthRate,
        expenseGrowthRate,
        propertyAppreciationRate,
      },
      capitalEvents: [], // Could be extended to include state.capitalEvents if needed
      projectionYears: holdingPeriodYears || state.irrHoldPeriodYears || 5,
      initialInvestment: totalCashInvested,
    };
  }

  /**
   * Calculate IRR using Newton-Raphson method
   * @param initialInvestment - Initial cash outlay (negative number)
   * @param cashFlows - Array of annual cash flows
   * @param finalValue - Exit proceeds
   * @param maxIterations - Maximum iterations for convergence (default 100)
   * @param tolerance - Convergence tolerance (default 0.0001)
   * @returns IRR as a decimal (e.g., 0.15 for 15%)
   */
  private calculateIRRNewtonRaphson(
    initialInvestment: number,
    cashFlows: number[],
    finalValue: number,
    maxIterations: number = 100,
    tolerance: number = 0.0001
  ): number {
    // Handle edge cases
    if (initialInvestment >= 0) return 0; // No investment
    if (cashFlows.length === 0) return 0; // No cash flows
    
    // Start with 10% initial guess
    let irr = 0.1;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = initialInvestment; // Already negative
      let derivative = 0;
      
      // Calculate NPV and its derivative
      cashFlows.forEach((cf, year) => {
        const period = year + 1;
        const discountFactor = Math.pow(1 + irr, period);
        npv += cf / discountFactor;
        derivative -= period * cf / Math.pow(1 + irr, period + 1);
      });
      
      // Add final sale value
      const finalYear = cashFlows.length + 1;
      npv += finalValue / Math.pow(1 + irr, finalYear);
      derivative -= finalYear * finalValue / Math.pow(1 + irr, finalYear + 1);
      
      // Check for derivative too close to zero (prevent division issues)
      if (Math.abs(derivative) < 0.000001) {
        break;
      }
      
      // Newton-Raphson iteration
      const newIrr = irr - npv / derivative;
      
      // Check convergence
      if (Math.abs(newIrr - irr) < tolerance) {
        return newIrr;
      }
      
      // Prevent negative or extremely high IRR
      if (newIrr < -0.99) {
        return -0.99; // Cap at -99%
      }
      if (newIrr > 10) {
        return 10; // Cap at 1000%
      }
      
      irr = newIrr;
    }
    
    // Return best estimate if not converged
    return irr;
  }

  /**
   * Calculate comprehensive MOIC with detailed breakdown
   * Accounts for principal paydown, appreciation, and operating cash flows
   * 
   * @param state - Current deal state
   * @param holdingPeriodYears - Holding period in years (default from state or 5)
   * @param sellingCostsPct - Selling costs as percentage (default 6%)
   * @returns Detailed MOIC breakdown
   */
  public calculateComprehensiveMOIC(
    state: DealState,
    holdingPeriodYears?: number,
    sellingCostsPct: number = 6
  ): MOICBreakdown {
    const holdYears = holdingPeriodYears || state.irrHoldPeriodYears || 5;
    const cashInvested = this.calculateTotalCashInvested(state);
    
    // Generate year-by-year projections using sophisticated cash flow module
    const params = this.convertDealStateToCashFlowParams(state, holdYears);
    const projections = generateCashFlowProjections(params);
    
    // Extract summary data
    const totalCashFlows = projections.summary.totalCashFlow;
    const principalPaydown = projections.summary.totalPrincipalPaydown;
    const appreciation = projections.summary.totalAppreciation;
    
    // Calculate exit proceeds
    const finalProjection = projections.yearlyProjections[projections.yearlyProjections.length - 1];
    const futureValue = finalProjection.propertyValue;
    const sellingCosts = futureValue * (sellingCostsPct / 100);
    const remainingLoanBalance = finalProjection.loanBalance;
    const netSaleProceeds = futureValue - sellingCosts - remainingLoanBalance;
    
    // Total return = cash flows + net sale proceeds
    const totalReturn = totalCashFlows + netSaleProceeds;
    
    // MOIC = Total Return / Cash Invested
    const moic = cashInvested > 0 ? totalReturn / cashInvested : 0;
    
    return {
      cashInvested,
      totalCashFlows,
      principalPaydown,
      appreciation,
      exitProceeds: {
        futureValue,
        sellingCosts,
        remainingLoanBalance,
        netSaleProceeds,
      },
      totalReturn,
      moic,
    };
  }

  /**
   * Calculate comprehensive IRR with detailed breakdown
   * Uses year-by-year cash flow projections and Newton-Raphson solver
   * 
   * @param state - Current deal state
   * @param holdingPeriodYears - Holding period in years (default from state or 5)
   * @param sellingCostsPct - Selling costs as percentage (default 6%)
   * @returns Detailed IRR breakdown with levered and unlevered IRR
   */
  public calculateComprehensiveIRR(
    state: DealState,
    holdingPeriodYears?: number,
    sellingCostsPct: number = 6
  ): IRRBreakdown {
    const holdYears = holdingPeriodYears || state.irrHoldPeriodYears || 5;
    const initialInvestment = this.calculateTotalCashInvested(state);
    
    // Generate cash flow projections
    const params = this.convertDealStateToCashFlowParams(state, holdYears);
    const projections = generateCashFlowProjections(params);
    
    // Extract annual cash flows
    const annualCashFlows = projections.yearlyProjections.map(p => p.cashFlowAfterCapEx);
    
    // Calculate exit value
    const finalProjection = projections.yearlyProjections[projections.yearlyProjections.length - 1];
    const futureValue = finalProjection.propertyValue;
    const sellingCosts = futureValue * (sellingCostsPct / 100);
    const remainingLoanBalance = finalProjection.loanBalance;
    const exitValue = futureValue - sellingCosts - remainingLoanBalance;
    
    // Calculate levered IRR (with debt)
    const leveredIRR = this.calculateIRRNewtonRaphson(
      -initialInvestment,
      annualCashFlows,
      exitValue
    );
    
    // Calculate unlevered IRR (as if all cash purchase)
    // For unlevered, we need to recalculate without debt service
    const unleveredParams = {
      ...params,
      loanAmount: 0,
      annualInterestRate: 0,
      loanTermMonths: 0,
      initialInvestment: state.purchasePrice, // Full purchase price
    };
    const unleveredProjections = generateCashFlowProjections(unleveredParams);
    const unleveredCashFlows = unleveredProjections.yearlyProjections.map(p => p.cashFlowAfterCapEx);
    const unleveredExitValue = futureValue - sellingCosts; // No loan to pay off
    const unleveredIRR = this.calculateIRRNewtonRaphson(
      -state.purchasePrice,
      unleveredCashFlows,
      unleveredExitValue
    );
    
    // Calculate equity multiple (same as MOIC)
    const totalReturn = annualCashFlows.reduce((sum, cf) => sum + cf, 0) + exitValue;
    const equityMultiple = initialInvestment > 0 ? totalReturn / initialInvestment : 0;
    
    return {
      initialInvestment,
      annualCashFlows,
      exitValue,
      holdingPeriodYears: holdYears,
      leveredIRR,
      unleveredIRR,
      equityMultiple,
    };
  }

  // ============================================================================
  // Monte Carlo Simulation
  // ============================================================================

  /**
   * Run comprehensive Monte Carlo simulation on deal
   * 
   * @param state - Current deal state
   * @param config - Monte Carlo configuration options
   * @returns Full Monte Carlo simulation results with risk metrics
   */
  public runMonteCarloSimulation(
    state: DealState,
    config?: MonteCarloServiceConfig
  ): MonteCarloResults {
    const holdYears = config?.holdingPeriodYears || state.irrHoldPeriodYears || 5;
    const simulationCount = config?.simulationCount || 10000;
    const randomSeed = config?.randomSeed;
    const confidenceLevel = config?.confidenceLevel || 0.95;
    
    // Convert DealState to CashFlowProjectionParams
    const baseParams = this.convertDealStateToCashFlowParams(state, holdYears);
    
    // Create uncertainty inputs (use custom or defaults)
    const uncertaintyInputs = config?.customUncertaintyInputs || 
      createDefaultUncertaintyInputs(baseParams);
    
    // Configure and run Monte Carlo simulation
    const monteCarloConfig: MonteCarloConfig = {
      baseParams,
      uncertaintyInputs,
      simulationCount,
      randomSeed,
      confidenceLevel
    };
    
    return runMonteCarloSimulation(monteCarloConfig);
  }

  /**
   * Run Monte Carlo simulation focused on IRR distribution
   * Calculates both levered and unlevered IRR distributions with risk metrics
   * 
   * @param state - Current deal state
   * @param config - Monte Carlo configuration options
   * @returns IRR-focused Monte Carlo results
   */
  public runMonteCarloIRR(
    state: DealState,
    config?: MonteCarloServiceConfig
  ): MonteCarloIRRResults {
    // Run full Monte Carlo simulation
    const fullResults = this.runMonteCarloSimulation(state, config);
    
    // Extract IRR statistics
    const irrStats = fullResults.irrStats;
    
    // For unlevered IRR, we'd need to rerun without debt
    // For now, we'll provide levered IRR statistics
    // This could be enhanced to run a second simulation without debt
    
    return {
      leveredIRR: {
        mean: irrStats.mean,
        median: irrStats.median,
        percentile10: irrStats.percentile10,
        percentile90: irrStats.percentile90,
        stdDev: irrStats.stdDev
      },
      unleveredIRR: {
        // Placeholder - would need separate simulation
        mean: 0,
        median: 0,
        percentile10: 0,
        percentile90: 0,
        stdDev: 0
      },
      riskMetrics: fullResults.riskMetrics,
      fullResults
    };
  }

  /**
   * Run Monte Carlo simulation focused on MOIC distribution
   * Calculates MOIC (equity multiple) distribution with risk metrics
   * 
   * @param state - Current deal state  
   * @param config - Monte Carlo configuration options
   * @returns MOIC-focused Monte Carlo results
   */
  public runMonteCarloMOIC(
    state: DealState,
    config?: MonteCarloServiceConfig
  ): MonteCarloMOICResults {
    // Run full Monte Carlo simulation
    const fullResults = this.runMonteCarloSimulation(state, config);
    
    // Calculate MOIC for each simulation result
    const cashInvested = this.calculateTotalCashInvested(state);
    const moics = fullResults.results.map(r => 
      cashInvested > 0 ? r.totalReturn / cashInvested : 0
    );
    
    // Calculate MOIC statistics
    const sortedMoics = [...moics].sort((a, b) => a - b);
    const moicMean = moics.reduce((sum, m) => sum + m, 0) / moics.length;
    const moicMedian = sortedMoics[Math.floor(sortedMoics.length / 2)];
    const moicP10 = sortedMoics[Math.floor(sortedMoics.length * 0.1)];
    const moicP90 = sortedMoics[Math.floor(sortedMoics.length * 0.9)];
    
    // Calculate standard deviation
    const squaredDiffs = moics.map(m => Math.pow(m - moicMean, 2));
    const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / moics.length;
    const moicStdDev = Math.sqrt(variance);
    
    return {
      moic: {
        mean: moicMean,
        median: moicMedian,
        percentile10: moicP10,
        percentile90: moicP90,
        stdDev: moicStdDev
      },
      riskMetrics: fullResults.riskMetrics,
      fullResults
    };
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

