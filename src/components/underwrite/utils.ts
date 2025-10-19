/**
 * Utility functions for UnderwritePage components
 * Extracted from UnderwritePage.tsx for better maintainability
 */

import React from "react";
import {
  pmt,
  totalMonthlyDebtService,
  computeFixedMonthlyOps,
  computeVariableMonthlyOpsPct,
  computeVariableExpenseFromPercentages,
  remainingPrincipalAfterPayments,
  monthlyRate,
  type LoanSpec,
} from "../../utils/finance";
import {
  calculateSeasonalAdjustments,
  type SeasonalFactors,
} from "../../utils/advancedCalculations";
import {
  DealState,
  PropertyType,
  OperationType,
  OfferType,
  SubjectToLoan,
  EnhancedSTRInputs,
  AmortizationRow,
  MetricWithConfidence,
  CapitalEvent,
} from "./types";

// ============================================================================
// Currency & Date Formatting
// ============================================================================

export function parseCurrency(input: string): number {
  const numeric = Number(String(input).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function parseCurrencyWithValidation(
  input: string,
  fieldName: string,
  setState: React.Dispatch<React.SetStateAction<DealState>>,
): number {
  const numeric = Number(String(input).replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  if (numeric < 0) {
    setState((prev) => ({
      ...prev,
      validationMessages: [
        ...(prev.validationMessages || []),
        `${fieldName} cannot be negative. Value has been reset to 0.`,
      ],
      snackbarOpen: true,
    }));
    return 0;
  }

  return numeric;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDateToMMDDYY(dateInput: string | undefined): string {
  if (!dateInput) return "";

  const regex = /^\d{2} \/ \d{2} \/ \d{2}$/;
  if (regex.test(dateInput)) {
    return dateInput;
  }

  const now = new Date();

  if (dateInput && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const inputDate = new Date(dateInput);
    const today = new Date();

    if (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate()
    ) {
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const year = now.getFullYear().toString().slice(-2);
      return `${month} / ${day} / ${year}`;
    }
  }

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return dateInput;
  }

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${month} / ${day} / ${year}`;
}

export function currentDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayFormatted(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${month} / ${day} / ${year}`;
}

// ============================================================================
// Property & Financing Type Helpers
// ============================================================================

export function getOperationTypeOptions(propertyType: PropertyType): OperationType[] {
  if (propertyType === "Hotel") {
    return ["Short Term Rental", "Rental Arbitrage"];
  }
  if (propertyType === "Land") {
    return ["Buy & Hold", "Fix & Flip", "BRRRR"];
  }
  if (propertyType === "Office" || propertyType === "Retail") {
    return ["Buy & Hold", "Fix & Flip", "Rental Arbitrage", "BRRRR"];
  }
  return [
    "Buy & Hold",
    "Fix & Flip",
    "Short Term Rental",
    "Rental Arbitrage",
    "BRRRR",
  ];
}

export function getOfferTypeOptions(
  propertyType: PropertyType,
  operationType: OperationType,
): OfferType[] {
  if (propertyType === "Land") {
    if (operationType === "Fix & Flip" || operationType === "BRRRR") {
      return [
        "Cash",
        "Hard Money",
        "Private",
        "Seller Finance",
        "Line of Credit",
      ];
    }
    return ["Cash", "Seller Finance", "Private", "Line of Credit"];
  }
  if (operationType === "Rental Arbitrage") {
    return ["Cash", "Private", "Line of Credit", "Seller Finance"];
  }
  if (operationType === "Fix & Flip") {
    return [
      "Seller Finance",
      "Hard Money",
      "Private",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  }
  if (operationType === "BRRRR") {
    return [
      "Cash",
      "Hard Money",
      "Private",
      "Seller Finance",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  }
  if (
    operationType === "Buy & Hold" &&
    (propertyType === "Single Family" || propertyType === "Multi Family")
  ) {
    return [
      "FHA",
      "Cash",
      "Seller Finance",
      "Conventional",
      "DSCR",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  }
  if (
    operationType === "Buy & Hold" &&
    (propertyType === "Office" || propertyType === "Retail")
  ) {
    return [
      "Cash",
      "Seller Finance",
      "Conventional",
      "DSCR",
      "SBA",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  }
  return [
    "Cash",
    "Seller Finance",
    "Conventional",
    "DSCR",
    "Subject To Existing Mortgage",
    "Hybrid",
    "Line of Credit",
  ];
}

// ============================================================================
// Loan Calculation Functions
// ============================================================================

export function monthlyPayment(
  loanAmount: number,
  annualRatePct: number,
  years: number,
  interestOnly: boolean,
): number {
  if (loanAmount <= 0 || years <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (interestOnly) return loanAmount * monthlyRate;
  if (monthlyRate === 0) return loanAmount / n;
  const factor = Math.pow(1 + monthlyRate, n);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

export function buildAmortization(
  loanAmount: number,
  annualRatePct: number,
  years: number,
  interestOnly: boolean,
  startBalance?: number,
  ioPeriodMonths?: number,
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const n = Math.min(600, Math.round(years * 12));
  let balance = startBalance ?? loanAmount;
  const monthlyRate = annualRatePct / 100 / 12;
  
  if (interestOnly && ioPeriodMonths && ioPeriodMonths > 0) {
    const ioPeriod = Math.min(ioPeriodMonths, n);
    const ioPmt = balance * monthlyRate;
    
    for (let i = 1; i <= ioPeriod; i += 1) {
      const interest = balance * monthlyRate;
      schedule.push({ 
        index: i, 
        payment: ioPmt, 
        interest, 
        principal: 0, 
        balance,
        isIOPhase: true,
      });
    }
    
    if (ioPeriod < n) {
      const remainingMonths = n - ioPeriod;
      const amortYears = remainingMonths / 12;
      const amortPmt = monthlyPayment(balance, annualRatePct, amortYears, false);
      
      for (let i = ioPeriod + 1; i <= n; i += 1) {
        const interest = balance * monthlyRate;
        const principal = Math.max(0, amortPmt - interest);
        balance = Math.max(0, balance - principal);
        schedule.push({ 
          index: i, 
          payment: amortPmt, 
          interest, 
          principal, 
          balance,
          isIOPhase: false,
        });
      }
    }
  } 
  else if (interestOnly) {
    const pmt = balance * monthlyRate;
    for (let i = 1; i <= n; i += 1) {
      const interest = balance * monthlyRate;
      schedule.push({ 
        index: i, 
        payment: pmt, 
        interest, 
        principal: 0, 
        balance,
        isIOPhase: true,
      });
    }
  } 
  else {
    const pmt = monthlyPayment(balance, annualRatePct, years, false);
    for (let i = 1; i <= n; i += 1) {
      const interest = balance * monthlyRate;
      const principal = Math.max(0, pmt - interest);
      balance = Math.max(0, balance - principal);
      schedule.push({ 
        index: i, 
        payment: pmt, 
        interest, 
        principal, 
        balance,
        isIOPhase: false,
      });
    }
  }

  return schedule;
}

export function buildSubjectToAmortization(
  loan: SubjectToLoan,
  currentPaymentNumber: number,
): Array<{
  index: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  paymentDate: string;
}> {
  const spec: LoanSpec = {
    principal: loan.amount,
    annualRate: loan.annualInterestRate / 100,
    termMonths: loan.originalTermYears * 12,
    interestOnly: false,
  };

  const monthlyRateValue = monthlyRate(spec.annualRate);
  const expectedPayment = pmt(spec.annualRate, spec.termMonths, spec.principal);

  const paymentToUse =
    Math.abs(loan.monthlyPayment - expectedPayment) < 0.01
      ? loan.monthlyPayment
      : expectedPayment;

  let balance = remainingPrincipalAfterPayments(spec, currentPaymentNumber - 1);

  const schedule: Array<{
    index: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
    paymentDate: string;
  }> = [];
  const remainingPayments = spec.termMonths - currentPaymentNumber + 1;

  for (let i = 0; i < remainingPayments; i++) {
    const paymentIndex = currentPaymentNumber + i;
    const interest = balance * monthlyRateValue;
    const principal = paymentToUse - interest;
    balance = Math.max(0, balance - principal);

    const startDate = new Date(loan.startDate);
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(startDate.getMonth() + paymentIndex - 1);

    schedule.push({
      index: paymentIndex,
      payment: paymentToUse,
      interest,
      principal,
      balance,
      paymentDate: paymentDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    });
  }

  return schedule;
}

// ============================================================================
// Income & Expense Calculations
// ============================================================================

export function computeGrossPotentialIncome(state: DealState): number {
  const { propertyType, operationType } = state;

  if (operationType === "Fix & Flip") {
    return 0;
  }

  if (propertyType === "Office" || propertyType === "Retail") {
    const sf = state.officeRetail?.squareFootage ?? 0;
    const rentPerSF = state.officeRetail?.rentPerSFMonthly ?? 0;
    const other = state.officeRetail?.extraMonthlyIncome ?? 0;
    const base = sf * rentPerSF;
    return base + other;
  }

  if (
    (operationType === "Short Term Rental" ||
      operationType === "Rental Arbitrage") &&
    propertyType !== "Land"
  ) {
    if (propertyType === "Hotel") {
      const {
        totalRooms,
        averageDailyRate,
        occupancyRate,
      } = state.revenueInputs;
      if (totalRooms > 0 && averageDailyRate > 0) {
        const annualRevenue =
          totalRooms * averageDailyRate * (occupancyRate / 100) * 365;
        return annualRevenue / 12;
      }
    }

    const nights = state.str?.avgNightsPerMonth ?? 0;
    const nightly = state.str?.unitDailyRents?.[0] ?? 0;
    const rent = nights * nightly;
    const fees =
      (state.str?.dailyCleaningFee ?? 0) *
      (nights > 0 ? Math.ceil(nights) : 0);
    const extra =
      (state.str?.laundry ?? 0) +
      (state.str?.activities ?? 0) +
      (state.str?.grossMonthlyIncome ?? 0);
    return rent + fees + extra;
  }

  if (propertyType === "Single Family") {
    const baseIncome =
      (state.sfr?.monthlyRent ?? 0) + (state.sfr?.grossMonthlyIncome ?? 0);
    return baseIncome;
  }

  if (propertyType === "Multi Family") {
    const rents = state.multi?.unitRents ?? [];
    const rentTotal = rents.reduce((a, b) => a + b, 0);
    const baseIncome = rentTotal + (state.multi?.grossMonthlyIncome ?? 0);
    return baseIncome;
  }

  if (propertyType === "Land") {
    return state.land?.extraMonthlyIncome ?? 0;
  }

  return 0;
}

export function shouldShowAdrTabs(state: DealState): boolean {
  const isNotLand = state.propertyType !== "Land";
  const isSTR = state.operationType === "Short Term Rental";
  const isHotel = state.propertyType === "Hotel";
  const isSfrOrMfArb =
    (state.propertyType === "Single Family" ||
      state.propertyType === "Multi Family") &&
    state.operationType === "Rental Arbitrage";

  const supportsADR = isSTR || isHotel || isSfrOrMfArb;

  const hasValidInputs =
    state.revenueInputs.totalRooms > 0 &&
    state.revenueInputs.averageDailyRate > 0;

  return isNotLand && supportsADR && hasValidInputs;
}

export function calculateSTRRevenue(inputs: EnhancedSTRInputs): {
  monthlyRevenue: number;
  metrics: {
    availableNights: number;
    bookedNights: number;
    effectiveOccupancy: number;
    grossRevenue: number;
    totalChannelFees: number;
    netRevenue: number;
    revPAN: number;
    netADR: number;
  };
} {
  const availableNights = 365 - inputs.blockedDays;
  
  const daysPerBookingCycle = inputs.averageLengthOfStay + inputs.turnoverDays;
  const turnovers = daysPerBookingCycle > 0 
    ? Math.floor(availableNights / daysPerBookingCycle) 
    : 0;
  
  const bookableNights = turnovers * inputs.averageLengthOfStay;
  const bookedNights = bookableNights * (inputs.occupancyRate / 100);
  
  const effectiveOccupancy = availableNights > 0 
    ? (bookedNights / availableNights) * 100 
    : 0;
  
  let averageRate = inputs.averageDailyRate;
  if (inputs.dynamicPricing) {
    // Assume 28.57% of nights are weekends (2 out of 7 days: Fri/Sat)
    const weekendNights = bookedNights * 0.2857;
    const weekdayNights = bookedNights * 0.7143;
    const weekendRate = inputs.averageDailyRate * (1 + inputs.weekendPremium / 100);
    
    averageRate = (weekendNights * weekendRate + weekdayNights * inputs.averageDailyRate) / bookedNights;
  }
  
  const grossRevenue = bookedNights * averageRate;
  
  const airbnbRevenue = grossRevenue * (inputs.channelMix.airbnb / 100);
  const vrboRevenue = grossRevenue * (inputs.channelMix.vrbo / 100);
  const directRevenue = grossRevenue * (inputs.channelMix.direct / 100);
  
  const airbnbFees = airbnbRevenue * (inputs.channelFees.airbnb / 100);
  const vrboFees = vrboRevenue * (inputs.channelFees.vrbo / 100);
  const directFees = directRevenue * (inputs.channelFees.direct / 100);
  
  const totalChannelFees = airbnbFees + vrboFees + directFees;
  const netRevenue = grossRevenue - totalChannelFees;
  
  const revPAN = availableNights > 0 ? netRevenue / availableNights : 0;
  const netADR = bookedNights > 0 ? netRevenue / bookedNights : 0;
  
  return {
    monthlyRevenue: netRevenue / 12,
    metrics: {
      availableNights,
      bookedNights: Math.round(bookedNights),
      effectiveOccupancy: Math.round(effectiveOccupancy * 10) / 10,
      grossRevenue: Math.round(grossRevenue),
      totalChannelFees: Math.round(totalChannelFees),
      netRevenue: Math.round(netRevenue),
      revPAN: Math.round(revPAN * 100) / 100,
      netADR: Math.round(netADR * 100) / 100,
    },
  };
}

export function computeIncome(state: DealState): number {
  const { propertyType, operationType } = state;

  if (operationType === "Fix & Flip") {
    return 0;
  }

  if (propertyType === "Office" || propertyType === "Retail") {
    const sf = state.officeRetail?.squareFootage ?? 0;
    const rentPerSF = state.officeRetail?.rentPerSFMonthly ?? 0;
    const occ = (state.officeRetail?.occupancyRatePct ?? 0) / 100;
    const other = state.officeRetail?.extraMonthlyIncome ?? 0;
    const base = sf * rentPerSF;
    return base * occ + other;
  }

  if (
    (operationType === "Short Term Rental" ||
      operationType === "Rental Arbitrage") &&
    propertyType !== "Land"
  ) {
    if (state.enhancedSTR?.useEnhancedModel && state.enhancedSTR.averageDailyRate > 0) {
      const { monthlyRevenue } = calculateSTRRevenue(state.enhancedSTR);
      return monthlyRevenue;
    }
    
    if (propertyType === "Hotel") {
      const {
        totalRooms,
        averageDailyRate,
        occupancyRate,
        seasonalVariations,
      } = state.revenueInputs;
      if (totalRooms > 0 && averageDailyRate > 0) {
        if (shouldShowAdrTabs(state)) {
          const seasonalFactors: SeasonalFactors = {
            summerVacancyRate: seasonalVariations.q2 / 100,
            winterVacancyRate: seasonalVariations.q4 / 100,
            springVacancyRate: seasonalVariations.q1 / 100,
            fallVacancyRate: seasonalVariations.q3 / 100,
            seasonalMaintenanceMultiplier: 1,
          };
          const month = new Date().getMonth() + 1;
          const { adjustedVacancyRate } = calculateSeasonalAdjustments(
            state.ops.vacancy / 100,
            seasonalFactors,
            month,
          );

          const adjustedOccupancyRate = Math.max(
            0,
            Math.min(100, occupancyRate * (1 - adjustedVacancyRate)),
          );
          const annualRevenue =
            totalRooms * averageDailyRate * (adjustedOccupancyRate / 100) * 365;
          return annualRevenue / 12;
        } else {
          const avgOccupancy =
            (seasonalVariations.q1 +
              seasonalVariations.q2 +
              seasonalVariations.q3 +
              seasonalVariations.q4) /
            4;
          const annualRevenue =
            totalRooms *
            averageDailyRate *
            (occupancyRate / 100) *
            365 *
            avgOccupancy;
          return annualRevenue / 12;
        }
      }
    }

    const nights = state.str?.avgNightsPerMonth ?? 0;
    const nightly = state.str?.unitDailyRents?.[0] ?? 0;
    const rent = nights * nightly;
    const fees =
      (state.str?.dailyCleaningFee ?? 0) *
      (nights > 0 ? Math.ceil(nights) : 0);
    const extra =
      (state.str?.laundry ?? 0) +
      (state.str?.activities ?? 0) +
      (state.str?.grossMonthlyIncome ?? 0);
    return rent + fees + extra;
  }

  if (propertyType === "Single Family") {
    const baseIncome =
      (state.sfr?.monthlyRent ?? 0) + (state.sfr?.grossMonthlyIncome ?? 0);
    if (shouldShowAdrTabs(state)) {
      const { seasonalVariations } = state.revenueInputs;
      const avgMultiplier =
        (seasonalVariations.q1 +
          seasonalVariations.q2 +
          seasonalVariations.q3 +
          seasonalVariations.q4) /
        4;
      return baseIncome * avgMultiplier;
    }
    return baseIncome;
  }

  if (propertyType === "Multi Family") {
    const rents = state.multi?.unitRents ?? [];
    const rentTotal = rents.reduce((a, b) => a + b, 0);
    const baseIncome = rentTotal + (state.multi?.grossMonthlyIncome ?? 0);
    if (shouldShowAdrTabs(state)) {
      const { seasonalVariations } = state.revenueInputs;
      const avgMultiplier =
        (seasonalVariations.q1 +
          seasonalVariations.q2 +
          seasonalVariations.q3 +
          seasonalVariations.q4) /
        4;
      return baseIncome * avgMultiplier;
    }
    return baseIncome;
  }

  if (propertyType === "Land") {
    return state.land?.extraMonthlyIncome ?? 0;
  }

  return 0;
}

export function computeLoanAmount(state: DealState): number {
  if (state.operationType === "Rental Arbitrage") return 0;
  if (state.offerType === "Subject To Existing Mortgage") {
    const existing = state.subjectTo.totalLoanBalance;
    const sellerPayment = state.subjectTo.paymentToSeller;
    const need = Math.max(0, state.purchasePrice - sellerPayment - existing);
    return need;
  }
  const base = Math.max(0, state.purchasePrice - state.loan.downPayment);
  return base;
}

export function computeCocAnnual(state: DealState, annualCashFlow: number): number {
  const invested =
    state.operationType === "Rental Arbitrage"
      ? (state.arbitrage?.deposit ?? 0) +
        (state.arbitrage?.estimateCostOfRepairs ?? 0) +
        (state.arbitrage?.furnitureCost ?? 0) +
        (state.arbitrage?.otherStartupCosts ?? 0)
      : (state.loan.downPayment || 0) +
        (state.loan.closingCosts || 0) +
        (state.loan.rehabCosts || 0) +
        (state.operationType === "Short Term Rental"
          ? state.arbitrage?.furnitureCost || 0
          : 0) +
        state.subjectTo.paymentToSeller +
        (state.reservesCalculationMethod === "months"
          ? (computeFixedMonthlyOps(state.ops) +
              (computeIncome(state) * computeVariableMonthlyOpsPct(state.ops)) /
                100) *
            (state.reservesMonths || 0)
          : state.reservesFixedAmount || 0);

  if (invested <= 0) {
    return 0;
  }

  return (annualCashFlow / invested) * 100;
}

// ============================================================================
// Capital Events
// ============================================================================

export function generateCapitalEventTemplates(propertyAge: number, purchasePrice: number): CapitalEvent[] {
  const templates: CapitalEvent[] = [];
  
  if (propertyAge >= 15) {
    templates.push({
      id: `roof-${Date.now()}-1`,
      year: Math.max(1, 22 - propertyAge),
      description: 'Roof Replacement',
      estimatedCost: Math.round(purchasePrice * 0.05),
      category: 'roof',
      likelihood: propertyAge >= 18 ? 80 : 50,
    });
  }

  if (propertyAge >= 10) {
    templates.push({
      id: `hvac-${Date.now()}-1`,
      year: Math.max(1, 17 - propertyAge),
      description: 'HVAC System Replacement',
      estimatedCost: Math.round(purchasePrice * 0.03),
      category: 'hvac',
      likelihood: propertyAge >= 15 ? 70 : 40,
    });
  }

  if (propertyAge >= 8) {
    templates.push({
      id: `plumbing-${Date.now()}-1`,
      year: Math.max(1, 12 - propertyAge),
      description: 'Water Heater Replacement',
      estimatedCost: Math.round(purchasePrice * 0.005),
      category: 'plumbing',
      likelihood: propertyAge >= 12 ? 75 : 35,
    });
  }

  if (propertyAge >= 30) {
    templates.push({
      id: `electrical-${Date.now()}-1`,
      year: Math.max(1, 3),
      description: 'Electrical Panel Upgrade',
      estimatedCost: Math.round(purchasePrice * 0.02),
      category: 'electrical',
      likelihood: 60,
    });
  }

  if (propertyAge >= 40) {
    templates.push({
      id: `foundation-${Date.now()}-1`,
      year: Math.max(1, 5),
      description: 'Foundation Repairs',
      estimatedCost: Math.round(purchasePrice * 0.04),
      category: 'foundation',
      likelihood: 40,
    });
  }

  if (propertyAge >= 5) {
    templates.push({
      id: `other-${Date.now()}-1`,
      year: Math.max(1, 8 - (propertyAge % 8)),
      description: 'Exterior Painting',
      estimatedCost: Math.round(purchasePrice * 0.015),
      category: 'other',
      likelihood: 85,
    });
  }

  return templates;
}

export function calculateCapitalEventMetrics(
  events: CapitalEvent[],
  holdPeriodYears: number
): { totalExpectedCost: number; averageAnnualCost: number } {
  const totalExpectedCost = events.reduce((sum, event) => {
    return sum + (event.estimatedCost * event.likelihood / 100);
  }, 0);

  const averageAnnualCost = holdPeriodYears > 0 
    ? totalExpectedCost / holdPeriodYears 
    : 0;

  return {
    totalExpectedCost: Math.round(totalExpectedCost),
    averageAnnualCost: Math.round(averageAnnualCost),
  };
}

export function getCapitalEventsForYear(events: CapitalEvent[], year: number): number {
  return events
    .filter(event => event.year === year)
    .reduce((sum, event) => sum + (event.estimatedCost * event.likelihood / 100), 0);
}

// ============================================================================
// Confidence Intervals
// ============================================================================

export function calculateConfidenceInterval(
  baseValue: number,
  uncertaintyFactor: number,
  confidenceLevel: number = 80
): MetricWithConfidence {
  const zScore = confidenceLevel === 80 ? 1.28 : confidenceLevel === 90 ? 1.645 : 1.96;
  
  const standardDeviation = baseValue * uncertaintyFactor;
  const low = baseValue - (zScore * standardDeviation);
  const high = baseValue + (zScore * standardDeviation);
  
  return {
    low: Math.round(low * 100) / 100,
    base: Math.round(baseValue * 100) / 100,
    high: Math.round(high * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    confidenceLevel,
  };
}

export function formatConfidenceInterval(
  metric: MetricWithConfidence,
  isPercentage: boolean = false,
  isCurrency: boolean = false
): string {
  const suffix = isPercentage ? '%' : '';
  
  if (isCurrency) {
    return `${formatCurrency(metric.low)} - ${formatCurrency(metric.base)} - ${formatCurrency(metric.high)}`;
  }
  
  return `${metric.low.toFixed(1)}${suffix} - ${metric.base.toFixed(1)}${suffix} - ${metric.high.toFixed(1)}${suffix}`;
}

