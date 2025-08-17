import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { brandColors } from "../theme";
import { PageAppBar } from "../components/Header";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Slider,
  Alert,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  pmt,
  totalMonthlyDebtService,
  computeFixedMonthlyOps,
  computeVariableMonthlyOpsPct,
  breakEvenOccupancy as financeBreakEvenOccupancy,
  remainingPrincipalAfterPayments,
  brrrrAnnualCashFlowPostRefi,
  monthlyRate,
  type LoanSpec,
} from "../utils/finance";
import {
  calculateSeasonalAdjustments,
  defaultSeasonalFactors,
  calculateMarketAdjustments,
  defaultMarketConditions,
  calculateExitStrategies,
  calculateRefinanceScenarios,
  calculateTaxImplications,
  calculateRiskScore,
  calculateConfidenceIntervals,
  calculateStressTest,
  calculateInflationAdjustments,
  calculateYearsUntilRefinance,
  calculateRefinancePotential,
  defaultLocationFactors,
  type SeasonalFactors,
  type MarketConditions,
  type ExitStrategy,
  type RefinanceScenario,
  type TaxImplications,
  type RiskFactors,
  type PropertyAgeFactors,
  type LocationFactors,
} from "../utils/advancedCalculations";

// Updated type definitions
type PropertyType =
  | "Single Family"
  | "Multi Family"
  | "Hotel"
  | "Land"
  | "Office"
  | "Retail";
type OperationType =
  | "Buy & Hold"
  | "Fix & Flip"
  | "Short Term Rental"
  | "Rental Arbitrage"
  | "BRRRR";
type OfferType =
  | "Cash"
  | "FHA"
  | "Seller Finance"
  | "Conventional"
  | "SBA"
  | "DSCR"
  | "Hard Money"
  | "Private"
  | "Line of Credit"
  | "Subject To Existing Mortgage"
  | "Hybrid";

interface LoanTerms {
  downPayment: number;
  loanAmount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  interestOnly: boolean;
  balloonDue: number;
  amortizationAmount: number;
  amortizationYears: number;
  closingCosts?: number;
  rehabCosts?: number;
}

interface SubjectToLoan {
  amount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  originalTermYears: number;
  startDate: string;
  currentBalance: number;
  paymentNumber: number;
  balloonDue: number;
  interestOnly: boolean;
}

interface SubjectToInputs {
  paymentToSeller: number;
  loans: SubjectToLoan[];
  totalLoanBalance: number;
  totalMonthlyPayment: number;
  totalAnnualPayment: number;
}

interface HybridInputs {
  downPayment: number;
  loan3Amount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  annualPayment: number;
  loanTerm: number;
  interestOnly: boolean;
  balloonDue: number;
  paymentToSeller: number;
  subjectToLoans: SubjectToLoan[];
  totalLoanBalance: number;
  totalMonthlyPayment: number;
  totalAnnualPayment: number;
  loanBalance?: number;
}

interface FixFlipInputs {
  arv: number;
  holdingPeriodMonths: number;
  holdingCosts: number;
  sellingCostsPercent: number;
  targetPercent: number;
  rehabCost: number;
  maximumAllowableOffer: number;
  projectedProfit: number;
  roiDuringHold: number;
  annualizedRoi: number;
  exitStrategies?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
}

interface BRRRRInputs {
  arv: number;
  refinanceLtv: number;
  refinanceInterestRate: number;
  loanTerm: number;
  newMonthlyPayment: number;
  originalCashInvested: number;
  cashOutAmount: number;
  remainingCashInDeal: number;
  newCashOnCashReturn: number;
  refinanceClosingCosts: number;
  effectiveCashOut: number;
  ltvConstraint: boolean;
  exitStrategies?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
}

interface AppreciationInputs {
  appreciationPercentPerYear: number;
  yearsOfAppreciation: number;
  futurePropertyValue: number;
  refinanceLtv: number;
  refinancePotential: number;
  remainingBalanceAfterRefi: number;
  manuallyOverridden?: boolean; // Track if user manually overrode balloon payment setting
}

interface IncomeInputsSfr {
  monthlyRent: number;
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
}

interface IncomeInputsMulti {
  unitRents: number[];
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
}

interface IncomeInputsStr {
  unitDailyRents: number[];
  unitMonthlyRents: number[];
  dailyCleaningFee: number;
  laundry: number;
  activities: number;
  avgNightsPerMonth: number;
  grossDailyIncome: number;
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
}

// New inputs for Office/Retail properties
interface OfficeRetailInputs {
  squareFootage: number;
  rentPerSFMonthly: number; // monthly base rent per square foot
  occupancyRatePct: number; // 0-100
  extraMonthlyIncome: number; // other income (parking, signage, etc.)
}

// New inputs for Land properties
interface LandInputs {
  acreage: number;
  zoning?: "Residential" | "Commercial" | "Agricultural" | "Mixed";
  extraMonthlyIncome: number; // e.g., grazing, storage, temporary uses
}

interface ArbitrageInputs {
  deposit: number;
  monthlyRentToLandlord: number;
  estimateCostOfRepairs: number;
  furnitureCost: number;
  otherStartupCosts: number;
  startupCostsTotal: number;
}

interface OperatingInputsCommon {
  principalAndInterest: number;
  totalSubtoLoans: number;
  taxes: number;
  insurance: number;
  gasElectric: number;
  internet: number;
  hoa: number;
  cleaner: number;
  monthlyRentToLandlord: number;
  waterSewer: number;
  heat: number;
  lawnSnow: number;
  phoneBill: number;
  extra: number;
  maintenance: number;
  vacancy: number;
  management: number;
  capEx: number;
  opEx: number;
  utilitiesPct?: number;
  expensesWithoutMortgage: number;
  monthlyExpenses: number;
  monthlyExpensesPercent: number;
  yearlyExpenses: number;
  expensesWithMortgage: number;
  monthlyExpensesWithMortgage: number;
  yearlyExpensesWithMortgage: number;
}

interface CustomProFormaPreset {
  id: string;
  name: string;
  description?: string;
  maintenance: number;
  vacancy: number;
  management: number;
  capEx: number;
  opEx: number;
  propertyType: PropertyType;
  operationType: OperationType;
  createdAt: Date;
}

interface SensitivityAnalysis {
  showSensitivity: boolean;
  sensitivityRange: number; // e.g., ±20%
  sensitivitySteps: number; // e.g., 5 steps
}

interface BenchmarkComparison {
  showBenchmarks: boolean;
  selectedMarket?: string;
  includeBenchmarks: boolean;
}

interface RevenueInputs {
  totalRooms: number;
  averageDailyRate: number;
  occupancyRate: number;
  seasonalVariations: {
    q1: number; // Q1 occupancy multiplier
    q2: number; // Q2 occupancy multiplier
    q3: number; // Q3 occupancy multiplier
    q4: number; // Q4 occupancy multiplier
  };
  fixedAnnualCosts: number;
  fixedMonthlyCosts: number;
}

interface BreakEvenAnalysis {
  showBreakEven: boolean;
  breakEvenOccupancy: number;
  breakEvenADR: number;
  breakEvenRevenue: number;
  marginOfSafety: number;
}

interface DealState {
  propertyType: PropertyType;
  operationType: OperationType;
  offerType: OfferType;
  propertyAddress: string;
  agentOwner: string;
  call: string;
  email: string;
  analysisDate: string;
  listedPrice: number;
  purchasePrice: number;
  percentageDifference: number;
  loan: LoanTerms;
  subjectTo: SubjectToInputs;
  hybrid: HybridInputs;
  fixFlip?: FixFlipInputs;
  brrrr?: BRRRRInputs;
  ops: OperatingInputsCommon;
  sfr?: IncomeInputsSfr;
  multi?: IncomeInputsMulti;
  str?: IncomeInputsStr;
  officeRetail?: OfficeRetailInputs;
  land?: LandInputs;
  arbitrage?: ArbitrageInputs;
  appreciation: AppreciationInputs;
  // Settings
  showBothPaybackMethods: boolean;
  paybackCalculationMethod: "initial" | "remaining";
  reservesCalculationMethod: "months" | "fixed";
  reservesMonths: number;
  reservesFixedAmount: number;
  includeVariableExpensesInBreakEven: boolean;
  includeVariablePctInBreakeven?: boolean;
  proFormaPreset: "conservative" | "moderate" | "aggressive" | "custom";
  customProFormaPresets: CustomProFormaPreset[];
  selectedCustomPreset?: string;
  sensitivityAnalysis: SensitivityAnalysis;
  benchmarkComparison: BenchmarkComparison;
  revenueInputs: RevenueInputs;
  breakEvenAnalysis: BreakEvenAnalysis;
  activeProFormaTab:
    | "presets"
    | "custom"
    | "sensitivity"
    | "benchmarks"
    | "revenue"
    | "breakEven";
  // Market conditions for enhanced sensitivity analysis
  marketType: "hot" | "stable" | "slow";
  // Advanced Analysis Configuration
  marketConditions: MarketConditions;
  exitStrategies: ExitStrategy[];
  seasonalFactors: SeasonalFactors;
  propertyAge: PropertyAgeFactors;
  locationFactors: LocationFactors;
  riskFactors: RiskFactors;
  taxImplications: TaxImplications;
  // Advanced Analysis Results
  exitStrategyResults?: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
  refinanceScenarioResults?: Array<{
    timing: number;
    newMonthlyPayment: number;
    monthlySavings: number;
    totalSavings: number;
    breakEvenMonths: number;
    cashOutAmount: number;
  }>;
  taxImplicationResults?: {
    taxableIncome: number;
    taxSavings: number;
    effectiveTaxRate: number;
    netIncome: number;
  };
  riskScoreResults?: {
    overallRiskScore: number;
    riskBreakdown: {
      marketRisk: number;
      propertyRisk: number;
      tenantRisk: number;
      financingRisk: number;
    };
    riskCategory: "Low" | "Medium" | "High" | "Very High";
    recommendations: string[];
  };
  confidenceIntervalResults?: {
    lowerBound: number;
    upperBound: number;
    confidenceLevel: number;
  };
  inflationProjections?: {
    [years: number]: {
      adjustedRent: number;
      adjustedExpenses: number;
      adjustedPropertyValue: number;
    };
  };
  // UX/logic helpers
  proFormaAuto: boolean; // when true, auto-apply preset values on PT/OT change; turns off on manual edits
  validationMessages: string[];
  showAmortizationOverride?: boolean;
  snackbarOpen?: boolean;
}

// Helper: should show ADR/rooms tabs (Revenue/Break-Even)
function shouldShowAdrTabs(state: DealState): boolean {
  const isNotLand = state.propertyType !== "Land";
  const isSTR = state.operationType === "Short Term Rental";
  const isHotel = state.propertyType === "Hotel";
  const isSfrOrMfArb =
    (state.propertyType === "Single Family" ||
      state.propertyType === "Multi Family") &&
    state.operationType === "Rental Arbitrage";

  // Check if the operation type supports ADR-based calculations
  const supportsADR = isSTR || isHotel || isSfrOrMfArb;

  // Check if revenue inputs have valid values for meaningful calculations
  const hasValidInputs =
    state.revenueInputs.totalRooms > 0 &&
    state.revenueInputs.averageDailyRate > 0;

  // Only show tabs when both conditions are met:
  // 1. Property type and operation type support ADR calculations
  // 2. Revenue inputs have valid values for meaningful analysis
  return isNotLand && supportsADR && hasValidInputs;
}

function parseCurrency(input: string): number {
  const numeric = Number(String(input).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

// Enhanced currency parser with validation feedback
function parseCurrencyWithValidation(
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatDateToMMDDYY(dateInput: string | undefined): string {
  console.log("formatDateToMMDDYY input:", dateInput);
  if (!dateInput) return "";

  // Check if the input string already matches MM / DD / YY format
  const regex = /^\d{2} \/ \d{2} \/ \d{2}$/;
  if (regex.test(dateInput)) {
    console.log("Already in MM/DD/YY format, returning:", dateInput);
    return dateInput; // If already in desired format, return as is
  }

  // Always use current system time for today's date to avoid timezone issues
  const now = new Date();
  console.log("Current system time:", now.toLocaleString());

  // If the input is today's date in YYYY-MM-DD format, use current system time
  if (dateInput && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const inputDate = new Date(dateInput);
    const today = new Date();

    // Check if it's the same date (ignoring time)
    if (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate()
    ) {
      console.log("Input is today's date, using current system time");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const year = now.getFullYear().toString().slice(-2);
      const result = `${month} / ${day} / ${year}`;
      console.log("Formatted result from system time:", result);
      return result;
    }
  }

  // Fallback: attempt to parse the input date
  const date = new Date(dateInput);
  console.log("Parsed date object:", date, "isValid:", !isNaN(date.getTime()));

  if (isNaN(date.getTime())) {
    console.log("Invalid date, returning original input:", dateInput);
    return dateInput; // If parsing failed, return original input (e.g., if user typed something invalid)
  }

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const result = `${month} / ${day} / ${year}`;
  console.log("Formatted result from parsed date:", result);
  return result;
}

// Returns today's date formatted for an HTML input[type="date"] (YYYY-MM-DD) using local time
function currentDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Returns today's date in MM / DD / YY format directly from system time
function getTodayFormatted(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${month} / ${day} / ${year}`;
}

function monthlyPayment(
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

function buildAmortization(
  loanAmount: number,
  annualRatePct: number,
  years: number,
  interestOnly: boolean,
  startBalance?: number,
): Array<{
  index: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}> {
  const schedule: Array<{
    index: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
  }> = [];
  const n = Math.min(600, Math.round(years * 12)); // cap at 50 years
  let balance = startBalance ?? loanAmount;
  const monthlyRate = annualRatePct / 100 / 12;
  const pmt = interestOnly
    ? balance * monthlyRate
    : monthlyPayment(balance, annualRatePct, years, false);
  for (let i = 1; i <= n; i += 1) {
    const interest = balance * monthlyRate;
    const principal = interestOnly ? 0 : Math.max(0, pmt - interest);
    balance = Math.max(0, interestOnly ? balance : balance - principal);
    schedule.push({ index: i, payment: pmt, interest, principal, balance });
  }
  return schedule;
}

function buildSubjectToAmortization(
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
  // Create LoanSpec for finance.ts functions
  const spec: LoanSpec = {
    principal: loan.amount,
    annualRate: loan.annualInterestRate / 100,
    termMonths: loan.originalTermYears * 12,
    interestOnly: false,
  };

  // Use standard finance functions for consistency
  const monthlyRateValue = monthlyRate(spec.annualRate);
  const expectedPayment = pmt(spec.annualRate, spec.termMonths, spec.principal);

  // Validate user-provided payment against calculated payment
  const paymentToUse =
    Math.abs(loan.monthlyPayment - expectedPayment) < 0.01
      ? loan.monthlyPayment
      : expectedPayment;

  // Use remainingPrincipalAfterPayments for accurate balance calculation
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

  // Generate remaining payments using standard finance calculations
  for (let i = 0; i < remainingPayments; i++) {
    const paymentIndex = currentPaymentNumber + i;
    const interest = balance * monthlyRateValue;
    const principal = paymentToUse - interest;
    balance = Math.max(0, balance - principal);

    // Calculate payment date based on start date
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

function computeIncome(state: DealState): number {
  const { propertyType, operationType } = state;

  // Fix & Flip has no rental income during hold period in this calculator
  if (operationType === "Fix & Flip") {
    return 0;
  }

  // Office/Retail: always use per-SF model, including for Rental Arbitrage
  if (propertyType === "Office" || propertyType === "Retail") {
    const sf = state.officeRetail?.squareFootage ?? 0;
    const rentPerSF = state.officeRetail?.rentPerSFMonthly ?? 0;
    const occ = (state.officeRetail?.occupancyRatePct ?? 0) / 100;
    const other = state.officeRetail?.extraMonthlyIncome ?? 0;
    const base = sf * rentPerSF;
    return base * occ + other;
  }

  // STR/Arbitrage nightly model for SFR/Multi/Hotel only
  if (
    (operationType === "Short Term Rental" ||
      operationType === "Rental Arbitrage") &&
    propertyType !== "Land"
  ) {
    // Hotel properties use revenueInputs for more accurate calculations
    if (propertyType === "Hotel") {
      const {
        totalRooms,
        averageDailyRate,
        occupancyRate,
        seasonalVariations,
      } = state.revenueInputs;
      if (totalRooms > 0 && averageDailyRate > 0) {
        // Apply seasonal adjustments for Hotel properties
        if (shouldShowAdrTabs(state)) {
          const seasonalFactors: SeasonalFactors = {
            summerVacancyRate: seasonalVariations.q2 / 100,
            winterVacancyRate: seasonalVariations.q4 / 100,
            springVacancyRate: seasonalVariations.q1 / 100,
            fallVacancyRate: seasonalVariations.q3 / 100,
            seasonalMaintenanceMultiplier: 1, // Default, adjust if needed
          };
          const month = new Date().getMonth() + 1;
          const { adjustedVacancyRate } = calculateSeasonalAdjustments(
            state.ops.vacancy / 100,
            seasonalFactors,
            month,
          );

          // Apply seasonal vacancy adjustment to occupancy rate
          const adjustedOccupancyRate = Math.max(
            0,
            Math.min(100, occupancyRate * (1 - adjustedVacancyRate)),
          );
          const annualRevenue =
            totalRooms * averageDailyRate * (adjustedOccupancyRate / 100) * 365;
          return annualRevenue / 12; // Convert to monthly
        } else {
          // Fallback to average seasonal variation if ADR tabs not applicable
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
          return annualRevenue / 12; // Convert to monthly
        }
      }
    }

    // Apply seasonal adjustments for STR properties
    if (shouldShowAdrTabs(state)) {
      const { seasonalVariations } = state.revenueInputs;
      const seasonalFactors: SeasonalFactors = {
        summerVacancyRate: seasonalVariations.q2 / 100,
        winterVacancyRate: seasonalVariations.q4 / 100,
        springVacancyRate: seasonalVariations.q1 / 100,
        fallVacancyRate: seasonalVariations.q3 / 100,
        seasonalMaintenanceMultiplier: 1, // Default, adjust if needed
      };
      const month = new Date().getMonth() + 1;
      const { adjustedVacancyRate } = calculateSeasonalAdjustments(
        state.ops.vacancy / 100,
        seasonalFactors,
        month,
      );

      // Apply seasonal vacancy adjustment to STR calculations
      const nights = state.str?.avgNightsPerMonth ?? 0;
      const nightly = state.str?.unitDailyRents?.[0] ?? 0;
      const adjustedNights = Math.max(0, nights * (1 - adjustedVacancyRate));
      const rent = adjustedNights * nightly;
      const fees =
        (state.str?.dailyCleaningFee ?? 0) *
        (adjustedNights > 0 ? Math.ceil(adjustedNights) : 0);
      const extra =
        (state.str?.laundry ?? 0) +
        (state.str?.activities ?? 0) +
        (state.str?.grossMonthlyIncome ?? 0);
      return rent + fees + extra;
    } else {
      // Fallback to STR model for non-Hotel properties without seasonal adjustments
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
  }

  if (propertyType === "Single Family") {
    const baseIncome =
      (state.sfr?.monthlyRent ?? 0) + (state.sfr?.grossMonthlyIncome ?? 0);
    // Apply seasonal variations if ADR tabs are applicable
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
    // Apply seasonal variations if ADR tabs are applicable
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
    // Land typically has no rent; allow optional extra income (e.g., grazing)
    return state.land?.extraMonthlyIncome ?? 0;
  }

  // BRRRR/Seller Finance/etc. fall through to 0 if no property-type income
  return 0;
}

function computeLoanAmount(state: DealState): number {
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

function computeCocAnnual(state: DealState, annualCashFlow: number): number {
  const invested =
    state.operationType === "Rental Arbitrage"
      ? (state.arbitrage?.deposit ?? 0) +
        (state.arbitrage?.estimateCostOfRepairs ?? 0) +
        (state.arbitrage?.furnitureCost ?? 0) +
        (state.arbitrage?.otherStartupCosts ?? 0)
      : // Buyer's entry cash for non-arbitrage: Down + Closing + Rehab + STR furniture (if STR) + Subject-To seller payment + reserves (if modeled)
        (state.loan.downPayment || 0) +
        (state.loan.closingCosts || 0) +
        (state.loan.rehabCosts || 0) +
        (state.operationType === "Short Term Rental"
          ? state.arbitrage?.furnitureCost || 0
          : 0) +
        state.subjectTo.paymentToSeller +
        // reserves modeled as months or fixed (optional flags exist in state)
        (state.reservesCalculationMethod === "months"
          ? (computeFixedMonthlyOps(state.ops) +
              (computeIncome(state) * computeVariableMonthlyOpsPct(state.ops)) /
                100) *
            (state.reservesMonths || 0)
          : state.reservesFixedAmount || 0);

  // Handle invalid invested amounts
  if (invested <= 0) {
    // Return 0 for invalid cases - validation messages will be handled by input validation
    return 0;
  }

  return (annualCashFlow / invested) * 100;
}

// Helper function to check if cash-on-cash calculation is valid
function isCashOnCashValid(state: DealState): boolean {
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

  return invested > 0;
}

// Helper function to check if break-even calculation is valid
function isBreakEvenValid(state: DealState): boolean {
  const monthlyRevenueAt100 =
    state.propertyType === "Office" || state.propertyType === "Retail"
      ? (state.officeRetail?.squareFootage || 0) *
          (state.officeRetail?.rentPerSFMonthly || 0) +
        (state.officeRetail?.extraMonthlyIncome || 0)
      : computeIncome(state);

  if (monthlyRevenueAt100 <= 0) return false;

  const variablePct = computeVariableMonthlyOpsPct(state.ops);
  const netRevenuePerRoom =
    monthlyRevenueAt100 - (monthlyRevenueAt100 * variablePct) / 100;

  return netRevenuePerRoom > 0;
}
function computeFixFlipCalculations(state: DealState): {
  maximumAllowableOffer: number;
  projectedProfit: number;
  roiDuringHold: number;
  annualizedRoi: number;
  exitStrategies: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
} {
  const arv = state.fixFlip?.arv ?? 0;
  const targetPercent = state.fixFlip?.targetPercent ?? 70;
  const rehabCost = state.fixFlip?.rehabCost ?? 0;
  const holdingCosts = state.fixFlip?.holdingCosts ?? 0;
  const holdingPeriodMonths = state.fixFlip?.holdingPeriodMonths ?? 0;
  const sellingCostsPercent = state.fixFlip?.sellingCostsPercent ?? 0;

  // Calculate MAO (Maximum Allowable Offer)
  const targetPrice = arv * (targetPercent / 100);
  const sellingCosts = arv * (sellingCostsPercent / 100);
  const totalHoldingCosts = holdingCosts * holdingPeriodMonths;
  const maximumAllowableOffer = Math.max(
    0,
    targetPrice - rehabCost - totalHoldingCosts - sellingCosts,
  );

  // Calculate financing costs during holding period
  let financingCosts = 0;
  if (state.offerType !== "Cash" && holdingPeriodMonths > 0) {
    // For financed deals, calculate interest payments during holding period
    if (state.offerType === "Hard Money") {
      // Hard Money typically has higher rates and interest-only payments
      const loanAmount = state.loan.loanAmount || 0;
      const annualRate = state.loan.annualInterestRate || 0;
      if (loanAmount > 0 && annualRate > 0) {
        // Interest-only payment for the holding period
        financingCosts =
          (loanAmount * (annualRate / 100) * holdingPeriodMonths) / 12;
      }
    } else if (
      state.offerType === "Private" ||
      state.offerType === "Line of Credit"
    ) {
      // Private money and LOC may have different terms
      const loanAmount = state.loan.loanAmount || 0;
      const annualRate = state.loan.annualInterestRate || 0;
      if (loanAmount > 0 && annualRate > 0) {
        // Calculate monthly payment and extract interest portion
        const monthlyPmt = monthlyPayment(loanAmount, annualRate, 30, false); // Assume 30-year term for calculation
        const monthlyRate = annualRate / 100 / 12;
        let balance = loanAmount;
        let totalInterest = 0;

        // Calculate interest paid during holding period
        for (let month = 1; month <= holdingPeriodMonths; month++) {
          const interest = balance * monthlyRate;
          totalInterest += interest;
          const principal = monthlyPmt - interest;
          balance = Math.max(0, balance - principal);
        }
        financingCosts = totalInterest;
      }
    } else if (
      state.offerType === "Seller Finance" ||
      state.offerType === "Subject To Existing Mortgage"
    ) {
      // For seller financing and subject-to, use existing loan terms
      const loanAmount = state.loan.loanAmount || 0;
      const annualRate = state.loan.annualInterestRate || 0;
      if (loanAmount > 0 && annualRate > 0) {
        // Calculate interest paid during holding period
        const monthlyPmt = monthlyPayment(loanAmount, annualRate, 30, false); // Assume 30-year term
        const monthlyRate = annualRate / 100 / 12;
        let balance = loanAmount;
        let totalInterest = 0;

        for (let month = 1; month <= holdingPeriodMonths; month++) {
          const interest = balance * monthlyRate;
          totalInterest += interest;
          const principal = monthlyPmt - interest;
          balance = Math.max(0, balance - principal);
        }
        financingCosts = totalInterest;
      }
    }
  }

  // Calculate Projected Profit with financing costs included
  const totalCosts =
    maximumAllowableOffer +
    rehabCost +
    totalHoldingCosts +
    sellingCosts +
    financingCosts;
  const projectedProfit = Math.max(0, arv - totalCosts);

  // Calculate ROI During Hold (cash invested + financing costs)
  const totalCashInvested = maximumAllowableOffer + rehabCost;
  const roiDuringHold =
    totalCashInvested > 0 ? (projectedProfit / totalCashInvested) * 100 : 0;

  // Calculate Annualized ROI
  const annualizedRoi =
    holdingPeriodMonths > 0 ? (roiDuringHold / holdingPeriodMonths) * 12 : 0;

  // Calculate Exit Strategies for long-term ROI analysis
  const exitStrategies = [
    {
      timeframe: 1,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
    {
      timeframe: 3,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
    {
      timeframe: 5,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
    {
      timeframe: 10,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
  ];

  const exitResults = calculateExitStrategies(
    state.purchasePrice,
    exitStrategies,
    state.purchasePrice,
  );

  return {
    maximumAllowableOffer,
    projectedProfit,
    roiDuringHold,
    annualizedRoi,
    exitStrategies: exitResults,
  };
}

function computeBRRRRCalculations(state: DealState): {
  cashOutAmount: number;
  remainingCashInDeal: number;
  newCashOnCashReturn: number;
  refinanceClosingCosts: number;
  effectiveCashOut: number;
  ltvConstraint: boolean;
  exitStrategies: Array<{
    timeframe: number;
    projectedValue: number;
    netProceeds: number;
    roi: number;
    annualizedRoi: number;
  }>;
} {
  const arv = state.brrrr?.arv ?? 0;
  const refinanceLtv = state.brrrr?.refinanceLtv ?? 0;
  const originalCashInvested = state.brrrr?.originalCashInvested ?? 0;
  const refinanceInterestRate = state.brrrr?.refinanceInterestRate ?? 0;
  const loanTerm = state.brrrr?.loanTerm ?? 30;

  // Calculate refinance loan amount based on ARV and LTV
  const refinanceLoan = arv * (refinanceLtv / 100);

  // Calculate new monthly payment using pmt function for consistency
  const newLoanMonthly = pmt(
    refinanceInterestRate / 100, // Convert percentage to decimal
    loanTerm * 12, // Convert years to months
    refinanceLoan,
  );

  // Include refinance closing costs (typically 2-3% of loan amount)
  const refinanceClosingCosts = refinanceLoan * 0.02; // 2% closing costs

  // Calculate effective cash-out amount after accounting for closing costs
  const effectiveCashOut = Math.max(
    0,
    refinanceLoan - originalCashInvested - refinanceClosingCosts,
  );

  // Check if LTV constraint allows for the desired cash-out
  const ltvConstraint = refinanceLoan <= arv * 0.75; // Standard 75% LTV limit for investment properties

  // Remaining cash in deal after refi proceeds and closing costs
  const remainingCashInDeal = Math.max(
    0,
    originalCashInvested - effectiveCashOut,
  );

  // Compute post-refi annual cash flow using finance.ts function for consistency
  const monthlyRevenue = computeIncome(state);
  const fixedMonthlyOps = computeFixedMonthlyOps(state.ops);
  const variablePct = computeVariableMonthlyOpsPct(state.ops) / 100;

  const annualCashFlow = brrrrAnnualCashFlowPostRefi({
    monthlyRevenue,
    fixedMonthlyOps,
    variablePct,
    newLoanMonthly,
  });

  const newCashOnCashReturn =
    remainingCashInDeal > 0 ? (annualCashFlow / remainingCashInDeal) * 100 : 0;

  // Calculate Exit Strategies for long-term ROI analysis
  const exitStrategies = [
    {
      timeframe: 3,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
    {
      timeframe: 5,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
    {
      timeframe: 10,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
    {
      timeframe: 15,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: state.marketConditions.appreciationRate,
    },
  ];

  const exitResults = calculateExitStrategies(
    state.purchasePrice,
    exitStrategies,
    state.purchasePrice,
  );

  return {
    cashOutAmount: effectiveCashOut, // Return effective cash-out (after closing costs)
    remainingCashInDeal,
    newCashOnCashReturn,
    refinanceClosingCosts,
    effectiveCashOut,
    ltvConstraint,
    exitStrategies: exitResults,
  };
}

// Inflation-adjusted long-term projections
function computeLongTermProjections(state: DealState, years: number) {
  const baseAmounts = {
    rent: computeIncome(state),
    expenses:
      computeFixedMonthlyOps(state.ops) +
      (computeVariableMonthlyOpsPct(state.ops) / 100) * computeIncome(state),
    propertyValue: state.purchasePrice,
  };

  // Use market-specific inflation rate or default to 2%
  const inflationRate = state.marketConditions?.inflationRate || 0.02;

  return calculateInflationAdjustments(baseAmounts, inflationRate, years);
}

// Calculate inflation projections for multiple timeframes
function computeInflationProjections(state: DealState) {
  const timeframes = [1, 3, 5, 10, 15, 20, 30];
  const projections: {
    [years: number]: {
      adjustedRent: number;
      adjustedExpenses: number;
      adjustedPropertyValue: number;
    };
  } = {};

  timeframes.forEach((years) => {
    projections[years] = computeLongTermProjections(state, years);
  });

  return projections;
}

// Update inflation projections in state
function updateInflationProjections(
  state: DealState,
  setState: React.Dispatch<React.SetStateAction<DealState>>,
) {
  try {
    const projections = computeInflationProjections(state);
    setState((prev) => ({
      ...prev,
      inflationProjections: projections,
    }));
    return projections;
  } catch (error) {
    console.error("Error calculating inflation projections:", error);
    setState((prev) => ({
      ...prev,
      validationMessages: [
        ...(prev.validationMessages || []),
        "Error calculating inflation projections.",
      ],
      snackbarOpen: true,
    }));
    return null;
  }
}

function getOperationTypeOptions(propertyType: PropertyType): OperationType[] {
  if (propertyType === "Hotel") {
    return ["Short Term Rental", "Rental Arbitrage"];
  }
  if (propertyType === "Land") {
    // Land logic is intentionally non-additive for operations: raw land is modeled as hold/improve/exit scenarios only
    return ["Buy & Hold", "Fix & Flip", "BRRRR"];
  }
  if (propertyType === "Office" || propertyType === "Retail") {
    // Commercial: allow B&H, F&F, Arbitrage, BRRRR. Remove STR for Office/Retail.
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

function getOfferTypeOptions(
  propertyType: PropertyType,
  operationType: OperationType,
): OfferType[] {
  // First handle Land so that subsequent operation-based narrowing does not affect logic
  if (propertyType === "Land") {
    if (operationType === "Fix & Flip" || operationType === "BRRRR") {
      // Allow Hard Money for improvement/refi paths
      return [
        "Cash",
        "Hard Money",
        "Private",
        "Seller Finance",
        "Line of Credit",
      ];
    }
    // Buy & Hold raw land: conventional/DSCR/FHA/SBA typically not applicable in this model
    return ["Cash", "Seller Finance", "Private", "Line of Credit"];
  }
  // Rental Arbitrage: only Cash / Private / Line of Credit (plus optional Seller Finance)
  if (operationType === "Rental Arbitrage") {
    return ["Cash", "Private", "Line of Credit", "Seller Finance"];
  }
  // Fix & Flip: include Subject-To, Hybrid, Line of Credit; remove SBA
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
  // BRRRR: Only Cash/Hard Money/Private/Seller Finance/Subject-To/Hybrid/LOC
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
  // Buy & Hold (SFR/Multi): keep broad retail + creative options
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
  // Commercial (Office/Retail): allow conventional, DSCR, SBA in addition to existing options
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
  // Default for Hotel STR etc.
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

// Wrapper to compute variable monthly expenses (% of income) from state.ops
function variableMonthlyFromPercentages(
  currentIncome: number,
  ops: OperatingInputsCommon,
): number {
  const mgmt = (ops.management || 0) / 100;
  const repairs = (ops.maintenance || 0) / 100;
  const utilities = (ops.utilitiesPct || 0) / 100;
  const capex = (ops.capEx || 0) / 100;
  const opex = (ops.opEx || 0) / 100;
  const pct = mgmt + repairs + utilities + capex + opex;
  return currentIncome * pct;
}

function Kpi(props: { label: string; value: string }) {
  return (
    <Box sx={{ border: "1px solid brandColors.borders.secondary", borderRadius: 1, p: 1 }}>
      <Typography variant="caption" sx={{ color: brandColors.neutral.dark }}>
        {props.label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
        {props.value}
      </Typography>
    </Box>
  );
}

const defaultState: DealState = {
  propertyType: "Single Family",
  operationType: "Buy & Hold",
  offerType: "Conventional",
  propertyAddress: "",
  agentOwner: "",
  call: "",
  email: "",
  analysisDate: (() => {
    // Get the current date directly from the user's system
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })(),
  listedPrice: 160000,
  purchasePrice: 160000,
  percentageDifference: 0,
  loan: {
    downPayment: 32000,
    loanAmount: 128000,
    annualInterestRate: 7,
    monthlyPayment: 800,
    annualPayment: 9600,
    interestOnly: false,
    balloonDue: 0,
    amortizationAmount: 128000,
    amortizationYears: 50,
    closingCosts: 0,
    rehabCosts: 0,
  },
  subjectTo: {
    paymentToSeller: 0,
    loans: [],
    totalLoanBalance: 0,
    totalMonthlyPayment: 0,
    totalAnnualPayment: 0,
  },
  hybrid: {
    downPayment: 0,
    loan3Amount: 0,
    annualInterestRate: 0,
    monthlyPayment: 0,
    annualPayment: 0,
    loanTerm: 30,
    interestOnly: false,
    balloonDue: 0,
    paymentToSeller: 0,
    subjectToLoans: [],
    totalLoanBalance: 0,
    totalMonthlyPayment: 0,
    totalAnnualPayment: 0,
  },
  fixFlip: {
    arv: 0,
    holdingPeriodMonths: 0,
    holdingCosts: 0,
    sellingCostsPercent: 0,
    targetPercent: 70,
    rehabCost: 0,
    maximumAllowableOffer: 0,
    projectedProfit: 0,
    roiDuringHold: 0,
    annualizedRoi: 0,
    exitStrategies: [],
  },
  brrrr: {
    arv: 0,
    refinanceLtv: 0,
    refinanceInterestRate: 0,
    loanTerm: 0,
    newMonthlyPayment: 0,
    originalCashInvested: 0,
    cashOutAmount: 0,
    remainingCashInDeal: 0,
    newCashOnCashReturn: 0,
    refinanceClosingCosts: 0,
    effectiveCashOut: 0,
    ltvConstraint: true,
    exitStrategies: [],
  },
  ops: {
    principalAndInterest: 800,
    totalSubtoLoans: 0,
    taxes: 54,
    insurance: 50,
    gasElectric: 0,
    internet: 0,
    hoa: 33,
    cleaner: 0,
    monthlyRentToLandlord: 2000,
    waterSewer: 0,
    heat: 0,
    lawnSnow: 0,
    phoneBill: 0,
    extra: 0,
    maintenance: 0,
    vacancy: 0,
    management: 0,
    capEx: 0,
    opEx: 0,
    utilitiesPct: 0,
    expensesWithoutMortgage: 0,
    monthlyExpenses: 0,
    monthlyExpensesPercent: 0,
    yearlyExpenses: 0,
    expensesWithMortgage: 0,
    monthlyExpensesWithMortgage: 0,
    yearlyExpensesWithMortgage: 0,
  },
  sfr: { monthlyRent: 1300, grossMonthlyIncome: 0, grossYearlyIncome: 0 },
  multi: {
    unitRents: [1300, 1300],
    grossMonthlyIncome: 0,
    grossYearlyIncome: 0,
  },
  str: {
    unitDailyRents: [100, 100],
    unitMonthlyRents: [3000, 3000],
    dailyCleaningFee: 0,
    laundry: 0,
    activities: 0,
    avgNightsPerMonth: 0,
    grossDailyIncome: 0,
    grossMonthlyIncome: 0,
    grossYearlyIncome: 0,
  },
  officeRetail: {
    squareFootage: 5000,
    rentPerSFMonthly: 2.5,
    occupancyRatePct: 90,
    extraMonthlyIncome: 0,
  },
  land: {
    acreage: 1,
    zoning: "Residential",
    extraMonthlyIncome: 0,
  },
  arbitrage: {
    deposit: 2000,
    monthlyRentToLandlord: 0,
    estimateCostOfRepairs: 0,
    furnitureCost: 0,
    otherStartupCosts: 0,
    startupCostsTotal: 0,
  },
  appreciation: {
    appreciationPercentPerYear: 3,
    yearsOfAppreciation: 3,
    futurePropertyValue: 0,
    refinanceLtv: 70,
    refinancePotential: 0,
    remainingBalanceAfterRefi: 0,
  },
  // Settings
  showBothPaybackMethods: false,
  paybackCalculationMethod: "initial",
  reservesCalculationMethod: "months",
  reservesMonths: 3,
  reservesFixedAmount: 0,
  includeVariableExpensesInBreakEven: false,
  includeVariablePctInBreakeven: false,
  proFormaPreset: "moderate",
  customProFormaPresets: [],
  selectedCustomPreset: undefined,
  sensitivityAnalysis: {
    showSensitivity: false,
    sensitivityRange: 20,
    sensitivitySteps: 5,
  },
  benchmarkComparison: { showBenchmarks: false, includeBenchmarks: true },
  revenueInputs: {
    totalRooms: 1,
    averageDailyRate: 150,
    occupancyRate: 75,
    seasonalVariations: { q1: 0.8, q2: 1.0, q3: 1.2, q4: 0.9 },
    fixedAnnualCosts: 50000,
    fixedMonthlyCosts: 4167,
  },
  breakEvenAnalysis: {
    showBreakEven: false,
    breakEvenOccupancy: 0,
    breakEvenADR: 0,
    breakEvenRevenue: 0,
    marginOfSafety: 0,
  },
  activeProFormaTab: "presets",
  // Market conditions for enhanced sensitivity analysis
  marketType: "stable" as const,
  // Advanced Analysis Configuration
  marketConditions: defaultMarketConditions.stable,
  exitStrategies: [
    {
      timeframe: 5,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: 0.04,
    },
    {
      timeframe: 10,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: 0.04,
    },
    {
      timeframe: 15,
      sellingCosts: 6,
      capitalGainsTax: 20,
      depreciationRecapture: 25,
      marketAppreciation: 0.04,
    },
  ],
  seasonalFactors: defaultSeasonalFactors,
  propertyAge: {
    age: 15,
    maintenanceCostMultiplier: 1.2,
    utilityEfficiencyMultiplier: 0.9,
    insuranceCostMultiplier: 1.1,
    expectedLifespan: 50,
  },
  locationFactors: defaultLocationFactors.suburban,
  riskFactors: {
    marketVolatility: 5,
    tenantQuality: 7,
    propertyCondition: 6,
    locationStability: 8,
    financingRisk: 4,
  },
  taxImplications: {
    propertyTaxDeduction: true,
    mortgageInterestDeduction: true,
    depreciationDeduction: true,
    repairExpenseDeduction: true,
    taxBracket: 24,
  },
  // Advanced Analysis Results - initialized as undefined
  exitStrategyResults: undefined,
  refinanceScenarioResults: undefined,
  taxImplicationResults: undefined,
  riskScoreResults: undefined,
  confidenceIntervalResults: undefined,
  inflationProjections: undefined,
  proFormaAuto: true,
  validationMessages: [],
  showAmortizationOverride: false,
  snackbarOpen: false,
};
const UnderwritePage: React.FC = () => {
  const navigate = useNavigate();
  function validateAndNormalizeState(input: DealState): {
    next: DealState;
    messages: string[];
  } {
    const messages: string[] = [];
    // Ensure operation type valid for property type
    const allowedOps = getOperationTypeOptions(input.propertyType);
    let operationType = input.operationType;
    if (!allowedOps.includes(operationType)) {
      operationType = allowedOps[0];
      messages.push(
        `Operation Type reset to ${operationType} for ${input.propertyType}.`,
      );
    }
    // Ensure offer type valid for combination
    const allowedOffers = getOfferTypeOptions(
      input.propertyType,
      operationType,
    );
    let offerType = input.offerType;
    if (!allowedOffers.includes(offerType)) {
      offerType = allowedOffers[0];
      messages.push(
        `Finance Type reset to ${offerType} for ${input.propertyType} + ${operationType}.`,
      );
    }
    const next: DealState = {
      ...input,
      operationType,
      offerType,
      validationMessages: messages,
      snackbarOpen: messages.length > 0,
    };
    return { next, messages };
  }

  const [state, setState] = useState<DealState>(() => {
    try {
      const fromLocal = localStorage.getItem("underwrite:last");
      if (fromLocal) {
        const parsed = JSON.parse(fromLocal) as DealState;
        console.log(
          "Loading from localStorage, original analysisDate:",
          parsed.analysisDate,
        );
        const normalized = validateAndNormalizeState({
          ...parsed,
          analysisDate: (() => {
            // Get the current date directly from the user's system
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const today = `${year}-${month}-${day}`;
            console.log(
              "Overriding localStorage analysisDate with today:",
              today,
            );
            return today;
          })(), // Always use current date
          proFormaAuto: parsed.proFormaAuto ?? true,
          validationMessages: [],
        });
        return normalized.next;
      }
    } catch {}
    return defaultState;
  });

  const [currentDate, setCurrentDate] = useState(() => {
    // Get the current date directly from the user's system
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    console.log(
      "Initial date set to:",
      dateString,
      "Current time:",
      now.toLocaleString(),
    );
    return dateString;
  });

  // Update the current date every minute to keep it live
  useEffect(() => {
    const updateDate = () => {
      // Get the current date directly from the user's system
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const currentDateString = `${year}-${month}-${day}`;
      console.log(
        "Updating date to:",
        currentDateString,
        "Current time:",
        now.toLocaleString(),
      );
      setCurrentDate(currentDateString);
    };

    // Update immediately
    updateDate();

    // Force update after a short delay to ensure it takes effect
    const forceUpdate = setTimeout(updateDate, 100);

    // Update every minute, but also check if we've crossed midnight
    const interval = setInterval(updateDate, 60000);

    // Also check for midnight crossing
    const checkMidnight = () => {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour === 0 && now.getMinutes() === 0) {
        updateDate();
      }
    };

    const midnightInterval = setInterval(checkMidnight, 60000); // Check every minute

    return () => {
      clearTimeout(forceUpdate);
      clearInterval(interval);
      clearInterval(midnightInterval);
    };
  }, []);

  // Update the analysis date whenever currentDate changes
  useEffect(() => {
    console.log("Updating state analysisDate to:", currentDate);
    setState((prev) => ({
      ...prev,
      analysisDate: currentDate,
    }));
  }, [currentDate]);

  // Debug: Log currentDate changes
  useEffect(() => {
    console.log("currentDate changed to:", currentDate);
  }, [currentDate]);

  // Force update analysis date on component mount
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;
    console.log("Component mount - forcing analysis date to:", today);
    setState((prev) => ({
      ...prev,
      analysisDate: today,
    }));
  }, []);

  function saveDeal() {
    localStorage.setItem("underwrite:last", JSON.stringify(state));
  }

  function update<K extends keyof DealState>(key: K, value: DealState[K]) {
    setState((prev) => {
      let candidate: DealState = { ...prev, [key]: value } as DealState;

      // Validate cash investment fields to prevent negative values that could cause division by zero in ROI calculations
      if (key === "reservesMonths" && (value as number) < 0) {
        candidate.validationMessages = [
          ...(candidate.validationMessages || []),
          "Reserves Months cannot be negative. This could cause invalid ROI calculations.",
        ];
        candidate.snackbarOpen = true;
      }

      if (key === "reservesFixedAmount" && (value as number) < 0) {
        candidate.validationMessages = [
          ...(candidate.validationMessages || []),
          "Reserves Fixed Amount cannot be negative. This could cause invalid ROI calculations.",
        ];
        candidate.snackbarOpen = true;
      }

      // Validate combinations when PT/OT change and potentially auto-apply Pro Forma
      if (key === "propertyType" || key === "operationType") {
        const currentProperty =
          key === "propertyType" ? (value as PropertyType) : prev.propertyType;
        const currentOperation =
          key === "operationType"
            ? (value as OperationType)
            : prev.operationType;

        // Validate operation type for property changes
        if (key === "propertyType") {
          const allowedOps = getOperationTypeOptions(currentProperty);
          if (!allowedOps.includes(currentOperation)) {
            candidate.operationType = allowedOps[0];
            candidate.validationMessages = [
              ...(candidate.validationMessages || []),
              `Operation Type reset to ${candidate.operationType} for ${currentProperty}.`,
            ];
          }
        }

        // Validate offer type for the combination
        const offers = getOfferTypeOptions(
          currentProperty,
          candidate.operationType as OperationType,
        );
        if (!offers.includes(candidate.offerType)) {
          candidate.offerType = offers[0];
          candidate.validationMessages = [
            ...(candidate.validationMessages || []),
            `Finance Type reset to ${candidate.offerType} for ${currentProperty} + ${candidate.operationType}.`,
          ];
          candidate.snackbarOpen = true;
        }

        // Auto-apply Pro Forma only if not custom and auto flag is on
        if (prev.proFormaPreset !== "custom" && prev.proFormaAuto) {
          // Get holding period for Fix & Flip operations to calculate appropriate vacancy rates
          const holdingPeriodMonths =
            candidate.operationType === "Fix & Flip" &&
            candidate.fixFlip?.holdingPeriodMonths
              ? candidate.fixFlip.holdingPeriodMonths
              : undefined;

          const newValues = getProFormaValues(
            currentProperty,
            candidate.operationType as OperationType,
            prev.proFormaPreset as "conservative" | "moderate" | "aggressive",
            holdingPeriodMonths,
          );

          // Check if current pro forma values differ from what would be applied (indicating manual edits)
          const hasManualEdits =
            prev.ops.maintenance !== newValues.maintenance ||
            prev.ops.vacancy !== newValues.vacancy ||
            prev.ops.management !== newValues.management ||
            prev.ops.capEx !== newValues.capEx ||
            prev.ops.opEx !== newValues.opEx;

          if (hasManualEdits) {
            // Warn user that manual edits will be overwritten
            candidate.validationMessages = [
              ...(candidate.validationMessages || []),
              `Pro Forma Auto-Apply disabled: Changing ${key === "propertyType" ? "property type" : "operation type"} would overwrite your manual Pro Forma edits. Auto-apply has been disabled to protect your custom values. You can re-enable it in the Pro Forma settings if desired.`,
            ];
            candidate.snackbarOpen = true;

            // Disable auto-apply to prevent overwriting without user awareness
            candidate.proFormaAuto = false;
          } else {
            // No manual edits detected, safe to apply new values
            candidate.ops = {
              ...candidate.ops,
              maintenance: newValues.maintenance,
              vacancy: newValues.vacancy,
              management: newValues.management,
              capEx: newValues.capEx,
              opEx: newValues.opEx,
            };
          }
        }
      }

      return candidate;
    });
  }

  function updateLoan<K extends keyof LoanTerms>(key: K, value: LoanTerms[K]) {
    setState((prev) => {
      // Validate cash investment fields to prevent negative values that could cause division by zero in ROI calculations
      const cashInvestmentFields: Array<keyof LoanTerms> = [
        "downPayment",
        "closingCosts",
        "rehabCosts",
      ];
      const hasNegativeValue =
        cashInvestmentFields.includes(key) && (value as number) < 0;

      // Validate finance calculation fields to prevent invalid inputs to finance.ts functions
      const financeCalculationFields: Array<keyof LoanTerms> = [
        "loanAmount",
        "amortizationYears",
        "annualInterestRate",
      ];
      const hasInvalidFinanceValue =
        financeCalculationFields.includes(key) &&
        ((key === "loanAmount" && (value as number) < 0) ||
          (key === "amortizationYears" && (value as number) <= 0) ||
          (key === "annualInterestRate" && (value as number) < 0));

      // Return single state update with all computed values
      return {
        ...prev,
        loan: { ...prev.loan, [key]: value },
        ...(hasNegativeValue && {
          validationMessages: [
            ...(prev.validationMessages || []),
            `${key === "downPayment" ? "Down Payment" : key === "closingCosts" ? "Closing Costs" : "Rehab Costs"} cannot be negative. This could cause invalid ROI calculations.`,
          ],
          snackbarOpen: true,
        }),
        ...(hasInvalidFinanceValue && {
          validationMessages: [
            ...(prev.validationMessages || []),
            `${key === "loanAmount" ? "Loan Amount" : key === "amortizationYears" ? "Loan Term" : "Interest Rate"} has an invalid value. ${key === "loanAmount" ? "Amount cannot be negative." : key === "amortizationYears" ? "Term must be positive." : "Rate cannot be negative."}`,
          ],
          snackbarOpen: true,
        }),
      };
    });
  }

  function updateOps<K extends keyof OperatingInputsCommon>(
    key: K,
    value: OperatingInputsCommon[K],
  ) {
    setState((prev) => {
      // Validate operating expense fields to prevent negative values that could cause invalid finance calculations
      const expenseFields: Array<keyof OperatingInputsCommon> = [
        "taxes",
        "insurance",
        "hoa",
        "gasElectric",
        "internet",
        "waterSewer",
        "heat",
        "lawnSnow",
        "phoneBill",
        "cleaner",
        "extra",
        "maintenance",
        "vacancy",
        "management",
        "capEx",
        "opEx",
      ];
      const hasNegativeValue =
        expenseFields.includes(key) && (value as number) < 0;

      // Validate percentage fields to ensure they don't exceed 100%
      const percentageFields: Array<keyof OperatingInputsCommon> = [
        "maintenance",
        "vacancy",
        "management",
        "capEx",
        "opEx",
        "utilitiesPct",
      ];
      const hasInvalidPercentage =
        percentageFields.includes(key) && (value as number) > 100;

      // If user manually adjusts any of the pro forma percentages, disable auto-apply
      const proFormaKeys: Array<keyof OperatingInputsCommon> = [
        "maintenance",
        "vacancy",
        "management",
        "capEx",
        "opEx",
      ];
      const shouldDisableAuto = proFormaKeys.includes(key);

      // Return single state update with all computed values
      return {
        ...prev,
        ops: { ...prev.ops, [key]: value },
        ...(shouldDisableAuto && { proFormaAuto: false }),
        ...(hasNegativeValue && {
          validationMessages: [
            ...(prev.validationMessages || []),
            `${key === "phoneBill" ? "Phone Bill" : key === "gasElectric" ? "Gas/Electric" : key === "waterSewer" ? "Water/Sewer" : key === "lawnSnow" ? "Lawn/Snow" : key} cannot be negative.`,
          ],
          snackbarOpen: true,
        }),
        ...(hasInvalidPercentage && {
          validationMessages: [
            ...(prev.validationMessages || []),
            `${key === "utilitiesPct" ? "Utilities Percentage" : key} cannot exceed 100%.`,
          ],
          snackbarOpen: true,
        }),
      };
    });
  }

  function updateProFormaPreset(
    preset: "conservative" | "moderate" | "aggressive" | "custom",
  ) {
    setState((prev) => ({ ...prev, proFormaPreset: preset }));
  }

  function toggleProFormaAuto() {
    setState((prev) => {
      const newAutoState = !prev.proFormaAuto;
      let messages = [...(prev.validationMessages || [])];

      if (newAutoState) {
        messages.push(
          "Pro Forma Auto-Apply re-enabled. Property/operation type changes will now automatically update Pro Forma values.",
        );
      } else {
        messages.push(
          "Pro Forma Auto-Apply disabled. Your manual Pro Forma edits will be preserved.",
        );
      }

      return {
        ...prev,
        proFormaAuto: newAutoState,
        validationMessages: messages,
        snackbarOpen: true,
      };
    });
  }

  // Dynamic Pro Forma calculations based on property type and operation type
  function getProFormaValues(
    propertyType: PropertyType,
    operationType: OperationType,
    preset: "conservative" | "moderate" | "aggressive",
    holdingPeriodMonths?: number,
  ) {
    const baseValues = {
      "Single Family": {
        "Buy & Hold": {
          maintenance: 6,
          vacancy: 4,
          management: 9,
          capEx: 4,
          opEx: 3,
        },
        "Fix & Flip": {
          maintenance: 20,
          vacancy: 0,
          management: 6,
          capEx: 30,
          opEx: 4,
        },
        "Short Term Rental": {
          maintenance: 10,
          vacancy: 30,
          management: 20,
          capEx: 8,
          opEx: 10,
        },
        "Rental Arbitrage": {
          maintenance: 12,
          vacancy: 35,
          management: 25,
          capEx: 12,
          opEx: 15,
        },
        BRRRR: { maintenance: 8, vacancy: 5, management: 8, capEx: 6, opEx: 4 },
      },
      "Multi Family": {
        "Buy & Hold": {
          maintenance: 10,
          vacancy: 6,
          management: 6,
          capEx: 6,
          opEx: 4,
        },
        "Fix & Flip": {
          maintenance: 18,
          vacancy: 0,
          management: 5,
          capEx: 25,
          opEx: 3,
        },
        "Short Term Rental": {
          maintenance: 12,
          vacancy: 25,
          management: 18,
          capEx: 10,
          opEx: 12,
        },
        "Rental Arbitrage": {
          maintenance: 15,
          vacancy: 30,
          management: 22,
          capEx: 15,
          opEx: 18,
        },
        BRRRR: { maintenance: 9, vacancy: 6, management: 7, capEx: 7, opEx: 5 },
      },
      Hotel: {
        "Buy & Hold": {
          maintenance: 15,
          vacancy: 20,
          management: 10,
          capEx: 10,
          opEx: 8,
        },
        "Fix & Flip": {
          maintenance: 25,
          vacancy: 0,
          management: 8,
          capEx: 35,
          opEx: 6,
        },
        "Short Term Rental": {
          maintenance: 18,
          vacancy: 35,
          management: 25,
          capEx: 12,
          opEx: 15,
        },
        "Rental Arbitrage": {
          maintenance: 20,
          vacancy: 40,
          management: 28,
          capEx: 18,
          opEx: 20,
        },
        BRRRR: {
          maintenance: 12,
          vacancy: 15,
          management: 8,
          capEx: 8,
          opEx: 6,
        },
      },
      Office: {
        "Buy & Hold": {
          maintenance: 10,
          vacancy: 12,
          management: 4,
          capEx: 8,
          opEx: 6,
        },
        "Fix & Flip": {
          maintenance: 15,
          vacancy: 0,
          management: 4,
          capEx: 20,
          opEx: 5,
        },
        "Short Term Rental": {
          maintenance: 12,
          vacancy: 18,
          management: 5,
          capEx: 10,
          opEx: 8,
        },
        "Rental Arbitrage": {
          maintenance: 12,
          vacancy: 20,
          management: 6,
          capEx: 10,
          opEx: 10,
        },
        BRRRR: {
          maintenance: 10,
          vacancy: 12,
          management: 4,
          capEx: 8,
          opEx: 6,
        },
      },
      Retail: {
        "Buy & Hold": {
          maintenance: 9,
          vacancy: 10,
          management: 5,
          capEx: 7,
          opEx: 6,
        },
        "Fix & Flip": {
          maintenance: 14,
          vacancy: 0,
          management: 4,
          capEx: 18,
          opEx: 5,
        },
        "Short Term Rental": {
          maintenance: 10,
          vacancy: 16,
          management: 5,
          capEx: 9,
          opEx: 7,
        },
        "Rental Arbitrage": {
          maintenance: 10,
          vacancy: 18,
          management: 6,
          capEx: 9,
          opEx: 9,
        },
        BRRRR: {
          maintenance: 9,
          vacancy: 10,
          management: 5,
          capEx: 7,
          opEx: 6,
        },
      },
      Land: {
        // Land modeled as hold/development; STR/Arbitrage not applicable. Vacancy kept minimal.
        "Buy & Hold": {
          maintenance: 2,
          vacancy: 0,
          management: 2,
          capEx: 3,
          opEx: 1,
        },
        "Fix & Flip": {
          maintenance: 3,
          vacancy: 0,
          management: 2,
          capEx: 8,
          opEx: 2,
        },
        BRRRR: { maintenance: 2, vacancy: 0, management: 2, capEx: 3, opEx: 1 },
      },
    };

    // Safe access: some property types (e.g., Land) intentionally omit certain operations
    const base =
      (baseValues as any)[propertyType]?.[operationType] ||
      baseValues["Single Family"]["Buy & Hold"];

    // Apply preset multipliers
    const multipliers = {
      conservative: {
        maintenance: 0.8,
        vacancy: 0.8,
        management: 0.9,
        capEx: 0.8,
        opEx: 0.8,
      },
      moderate: {
        maintenance: 1.0,
        vacancy: 1.0,
        management: 1.0,
        capEx: 1.0,
        opEx: 1.0,
      },
      aggressive: {
        maintenance: 1.3,
        vacancy: 1.2,
        management: 1.1,
        capEx: 1.3,
        opEx: 1.2,
      },
    };

    const multiplier = multipliers[preset];

    // Calculate base values with multipliers
    let calculatedValues = {
      maintenance: Math.round(base.maintenance * multiplier.maintenance),
      vacancy: Math.round(base.vacancy * multiplier.vacancy),
      management: Math.round(base.management * multiplier.management),
      capEx: Math.round(base.capEx * multiplier.capEx),
      opEx: Math.round(base.opEx * multiplier.opEx),
    };

    // Apply Fix & Flip vacancy rate adjustment based on holding period
    if (
      operationType === "Fix & Flip" &&
      holdingPeriodMonths &&
      holdingPeriodMonths > 0
    ) {
      // Use helper function to calculate appropriate vacancy rate based on holding period
      calculatedValues.vacancy =
        calculateFixFlipVacancyRate(holdingPeriodMonths);
    }

    return calculatedValues;
  }

  function applyProFormaPreset(
    preset: "conservative" | "moderate" | "aggressive",
  ) {
    // Get holding period for Fix & Flip operations to calculate appropriate vacancy rates
    const holdingPeriodMonths =
      state.operationType === "Fix & Flip" && state.fixFlip?.holdingPeriodMonths
        ? state.fixFlip.holdingPeriodMonths
        : undefined;

    const values = getProFormaValues(
      state.propertyType,
      state.operationType,
      preset,
      holdingPeriodMonths,
    );
    updateOps("maintenance", values.maintenance);
    updateOps("vacancy", values.vacancy);
    updateOps("management", values.management);
    updateOps("capEx", values.capEx);
    updateOps("opEx", values.opEx);
    updateProFormaPreset(preset);
    setState((prev) => ({
      ...prev,
      selectedCustomPreset: undefined,
      proFormaAuto: true,
    }));
  }

  // Custom Preset Management
  function saveCustomPreset(name: string, description?: string) {
    const newPreset: CustomProFormaPreset = {
      id: Date.now().toString(),
      name,
      description,
      maintenance: state.ops.maintenance,
      vacancy: state.ops.vacancy,
      management: state.ops.management,
      capEx: state.ops.capEx,
      opEx: state.ops.opEx,
      propertyType: state.propertyType,
      operationType: state.operationType,
      createdAt: new Date(),
    };

    const updatedPresets = [...state.customProFormaPresets, newPreset];

    console.log("Saving custom preset:", newPreset);
    console.log("Updated presets array:", updatedPresets);

    setState((prev) => ({
      ...prev,
      customProFormaPresets: updatedPresets,
      selectedCustomPreset: newPreset.id,
    }));

    // Save to localStorage
    localStorage.setItem(
      "dreameryCustomProFormaPresets",
      JSON.stringify(updatedPresets),
    );

    // Verify localStorage was updated
    const saved = localStorage.getItem("dreameryCustomProFormaPresets");
    console.log("localStorage after save:", saved);
  }

  function deleteCustomPreset(id: string) {
    const updatedPresets = state.customProFormaPresets.filter(
      (p) => p.id !== id,
    );
    setState((prev) => ({
      ...prev,
      customProFormaPresets: updatedPresets,
      selectedCustomPreset:
        prev.selectedCustomPreset === id
          ? undefined
          : prev.selectedCustomPreset,
    }));

    // Update localStorage
    localStorage.setItem(
      "dreameryCustomProFormaPresets",
      JSON.stringify(updatedPresets),
    );
  }

  // Helper: get reason why ADR tabs are not showing (for user guidance)
  function getAdrTabsVisibilityReason(): string | null {
    if (state.propertyType === "Land") {
      return "ADR tabs are not available for Land properties.";
    }

    const isSTR = state.operationType === "Short Term Rental";
    const isHotel = state.propertyType === "Hotel";
    const isSfrOrMfArb =
      (state.propertyType === "Single Family" ||
        state.propertyType === "Multi Family") &&
      state.operationType === "Rental Arbitrage";

    if (!isSTR && !isHotel && !isSfrOrMfArb) {
      return "ADR tabs are only available for Short Term Rental, Hotel properties, or Rental Arbitrage on Single Family/Multi Family properties.";
    }

    if (state.revenueInputs.totalRooms <= 0) {
      return "Please enter a valid number of rooms (greater than 0) to see ADR analysis tabs.";
    }

    if (state.revenueInputs.averageDailyRate <= 0) {
      return "Please enter a valid Average Daily Rate (greater than 0) to see ADR analysis tabs.";
    }

    return null; // Tabs should be visible
  }

  function applyCustomPreset(id: string) {
    const preset = state.customProFormaPresets.find((p) => p.id === id);
    if (preset) {
      updateOps("maintenance", preset.maintenance);
      updateOps("vacancy", preset.vacancy);
      updateOps("management", preset.management);
      updateOps("capEx", preset.capEx);
      updateOps("opEx", preset.opEx);
      setState((prev) => ({
        ...prev,
        selectedCustomPreset: id,
        proFormaPreset: "custom",
      }));
    }
  }

  // Risk Score Calculation Function
  function computeRiskScore(state: DealState) {
    try {
      const results = calculateRiskScore(
        state.riskFactors,
        state.marketConditions,
        state.propertyAge,
      );
      setState((prev) => ({ ...prev, riskScoreResults: results }));
      return results;
    } catch (error) {
      console.error("Error calculating risk score:", error);
      setState((prev) => ({
        ...prev,
        validationMessages: [
          ...(prev.validationMessages || []),
          "Error calculating risk score.",
        ],
        snackbarOpen: true,
      }));
      return null;
    }
  }

  // Enhanced Sensitivity Analysis with Seasonal Variations and Market Adjustments
  function calculateSensitivityAnalysis() {
    const baseState = { ...state };
    const range = state.sensitivityAnalysis.sensitivityRange / 100;
    const steps = state.sensitivityAnalysis.sensitivitySteps;
    const stepSize = (range * 2) / (steps - 1);

    // Get market conditions for enhanced sensitivity analysis
    const marketConditions =
      defaultMarketConditions[state.marketType || "stable"];
    const baseMetrics = {
      vacancyRate: state.ops.vacancy / 100,
      rentGrowth: 0.03, // Default 3% annual rent growth
      appreciation: 0.04, // Default 4% annual appreciation
      capRate: 0.06, // Default 6% cap rate
    };
    const adjustedMetrics = calculateMarketAdjustments(
      baseMetrics,
      marketConditions,
    );

    const results = [];

    // Add seasonal variation scenarios if ADR tabs are applicable
    const seasonalScenarios = shouldShowAdrTabs(state)
      ? [
          {
            name: "Q1 (Winter)",
            multiplier: state.revenueInputs.seasonalVariations.q1,
          },
          {
            name: "Q2 (Spring)",
            multiplier: state.revenueInputs.seasonalVariations.q2,
          },
          {
            name: "Q3 (Summer)",
            multiplier: state.revenueInputs.seasonalVariations.q3,
          },
          {
            name: "Q4 (Fall)",
            multiplier: state.revenueInputs.seasonalVariations.q4,
          },
          {
            name: "Annual Avg",
            multiplier:
              (state.revenueInputs.seasonalVariations.q1 +
                state.revenueInputs.seasonalVariations.q2 +
                state.revenueInputs.seasonalVariations.q3 +
                state.revenueInputs.seasonalVariations.q4) /
              4,
          },
        ]
      : [{ name: "Base", multiplier: 1 }];

    // Add market-adjusted scenarios for comprehensive analysis
    const marketScenarios = [
      {
        name: "Market Adjusted",
        rentChange: adjustedMetrics.adjustedRentGrowth * 100,
        expenseChange: 0,
        valueChange: adjustedMetrics.adjustedAppreciation * 100,
      },
      {
        name: "Conservative",
        rentChange: -10,
        expenseChange: 10,
        valueChange: -10,
      },
      {
        name: "Optimistic",
        rentChange: 10,
        expenseChange: -10,
        valueChange: 10,
      },
    ];

    for (let i = 0; i < steps; i++) {
      const multiplier = 1 - range + i * stepSize;

      for (const seasonalScenario of seasonalScenarios) {
        for (const marketScenario of marketScenarios) {
          const testState = {
            ...baseState,
            ops: {
              ...baseState.ops,
              maintenance: Math.round(baseState.ops.maintenance * multiplier),
              vacancy: Math.round(baseState.ops.vacancy * multiplier),
              management: Math.round(baseState.ops.management * multiplier),
              capEx: Math.round(baseState.ops.capEx * multiplier),
              opEx: Math.round(baseState.ops.opEx * multiplier),
            },
          };

          // Calculate revenue-based income with seasonal variations
          let monthlyIncome = computeIncome(testState);

          // Apply seasonal multiplier to income if ADR tabs are applicable
          if (
            shouldShowAdrTabs(testState) &&
            testState.revenueInputs.totalRooms > 0 &&
            testState.revenueInputs.averageDailyRate > 0
          ) {
            // Use seasonal variation multiplier for more accurate projections
            monthlyIncome = monthlyIncome * seasonalScenario.multiplier;
          }

          // Apply market-adjusted rent growth to income
          monthlyIncome *= 1 + marketScenario.rentChange / 100;

          const monthlyExpenses =
            computeFixedMonthlyOps(testState.ops) +
            (monthlyIncome * computeVariableMonthlyOpsPct(testState.ops)) / 100;

          // Apply market-adjusted expense changes
          const adjustedMonthlyExpenses =
            monthlyExpenses * (1 + marketScenario.expenseChange / 100);

          const monthlyCashFlow =
            monthlyIncome -
            adjustedMonthlyExpenses -
            totalMonthlyDebtService({
              newLoanMonthly: testState.loan.monthlyPayment || 0,
              subjectToMonthlyTotal: testState.subjectTo?.totalMonthlyPayment,
              hybridMonthly: testState.hybrid?.monthlyPayment,
            });

          // Calculate market-adjusted property value
          const adjustedPropertyValue =
            testState.purchasePrice * (1 + marketScenario.valueChange / 100);

          results.push({
            multiplier: (multiplier * 100).toFixed(0) + "%",
            seasonalScenario: seasonalScenario.name,
            seasonalMultiplier: seasonalScenario.multiplier.toFixed(2),
            marketScenario: marketScenario.name,
            rentChange: marketScenario.rentChange.toFixed(1) + "%",
            expenseChange: marketScenario.expenseChange.toFixed(1) + "%",
            valueChange: marketScenario.valueChange.toFixed(1) + "%",
            maintenance: testState.ops.maintenance,
            vacancy: testState.ops.vacancy,
            management: testState.ops.management,
            capEx: testState.ops.capEx,
            opEx: testState.ops.opEx,
            monthlyIncome: Math.round(monthlyIncome),
            monthlyCashFlow: Math.round(monthlyCashFlow),
            annualCashFlow: Math.round(monthlyCashFlow * 12),
            adjustedPropertyValue: Math.round(adjustedPropertyValue),
            cashOnCash:
              monthlyCashFlow > 0
                ? (
                    ((monthlyCashFlow * 12) /
                      ((adjustedPropertyValue *
                        (testState.loan.downPayment || 0)) /
                        100)) *
                    100
                  ).toFixed(1) + "%"
                : "N/A",
          });
        }
      }
    }

    return results;
  }

  function toggleSensitivityAnalysis() {
    setState((prev) => ({
      ...prev,
      sensitivityAnalysis: {
        ...prev.sensitivityAnalysis,
        showSensitivity: !prev.sensitivityAnalysis.showSensitivity,
      },
    }));
  }

  // Benchmark Comparison
  function getIndustryBenchmarks() {
    const benchmarks = {
      "Single Family": {
        "Buy & Hold": {
          maintenance: 8,
          vacancy: 5,
          management: 10,
          capEx: 5,
          opEx: 4,
        },
        "Fix & Flip": {
          maintenance: 20,
          vacancy: 0,
          management: 6,
          capEx: 30,
          opEx: 4,
        },
        "Short Term Rental": {
          maintenance: 12,
          vacancy: 25,
          management: 20,
          capEx: 8,
          opEx: 10,
        },
        "Rental Arbitrage": {
          maintenance: 15,
          vacancy: 30,
          management: 25,
          capEx: 12,
          opEx: 15,
        },
        BRRRR: {
          maintenance: 10,
          vacancy: 6,
          management: 10,
          capEx: 7,
          opEx: 5,
        },
      },
      "Multi Family": {
        "Buy & Hold": {
          maintenance: 12,
          vacancy: 7,
          management: 8,
          capEx: 7,
          opEx: 5,
        },
        "Fix & Flip": {
          maintenance: 18,
          vacancy: 0,
          management: 5,
          capEx: 25,
          opEx: 3,
        },
        "Short Term Rental": {
          maintenance: 15,
          vacancy: 28,
          management: 22,
          capEx: 10,
          opEx: 12,
        },
        "Rental Arbitrage": {
          maintenance: 18,
          vacancy: 32,
          management: 25,
          capEx: 15,
          opEx: 18,
        },
        BRRRR: {
          maintenance: 11,
          vacancy: 7,
          management: 9,
          capEx: 8,
          opEx: 6,
        },
      },
      Hotel: {
        "Buy & Hold": {
          maintenance: 18,
          vacancy: 22,
          management: 12,
          capEx: 12,
          opEx: 10,
        },
        "Fix & Flip": {
          maintenance: 25,
          vacancy: 0,
          management: 8,
          capEx: 35,
          opEx: 6,
        },
        "Short Term Rental": {
          maintenance: 20,
          vacancy: 35,
          management: 25,
          capEx: 15,
          opEx: 18,
        },
        "Rental Arbitrage": {
          maintenance: 22,
          vacancy: 40,
          management: 28,
          capEx: 18,
          opEx: 20,
        },
        BRRRR: {
          maintenance: 15,
          vacancy: 18,
          management: 10,
          capEx: 10,
          opEx: 8,
        },
      },
      Office: {
        "Buy & Hold": {
          maintenance: 10,
          vacancy: 12,
          management: 5,
          capEx: 8,
          opEx: 6,
        },
        "Fix & Flip": {
          maintenance: 15,
          vacancy: 0,
          management: 5,
          capEx: 20,
          opEx: 5,
        },
        "Short Term Rental": {
          maintenance: 12,
          vacancy: 18,
          management: 6,
          capEx: 10,
          opEx: 8,
        },
        "Rental Arbitrage": {
          maintenance: 12,
          vacancy: 20,
          management: 6,
          capEx: 10,
          opEx: 10,
        },
        BRRRR: {
          maintenance: 10,
          vacancy: 12,
          management: 5,
          capEx: 8,
          opEx: 6,
        },
      },
      Retail: {
        "Buy & Hold": {
          maintenance: 9,
          vacancy: 10,
          management: 6,
          capEx: 7,
          opEx: 6,
        },
        "Fix & Flip": {
          maintenance: 14,
          vacancy: 0,
          management: 5,
          capEx: 18,
          opEx: 5,
        },
        "Short Term Rental": {
          maintenance: 10,
          vacancy: 16,
          management: 6,
          capEx: 9,
          opEx: 7,
        },
        "Rental Arbitrage": {
          maintenance: 10,
          vacancy: 18,
          management: 6,
          capEx: 9,
          opEx: 9,
        },
        BRRRR: {
          maintenance: 9,
          vacancy: 10,
          management: 6,
          capEx: 7,
          opEx: 6,
        },
      },
      Land: {
        "Buy & Hold": {
          maintenance: 2,
          vacancy: 0,
          management: 2,
          capEx: 3,
          opEx: 1,
        },
        "Fix & Flip": {
          maintenance: 3,
          vacancy: 0,
          management: 2,
          capEx: 8,
          opEx: 2,
        },
        "Short Term Rental": {
          maintenance: 2,
          vacancy: 0,
          management: 2,
          capEx: 3,
          opEx: 1,
        },
        "Rental Arbitrage": {
          maintenance: 2,
          vacancy: 0,
          management: 2,
          capEx: 3,
          opEx: 1,
        },
        BRRRR: { maintenance: 2, vacancy: 0, management: 2, capEx: 3, opEx: 1 },
      },
    };

    const propertyBenchmarks = benchmarks[state.propertyType];
    if (!propertyBenchmarks) {
      return benchmarks["Single Family"]["Buy & Hold"];
    }

    const operationBenchmarks = propertyBenchmarks[state.operationType];
    if (!operationBenchmarks) {
      return benchmarks["Single Family"]["Buy & Hold"];
    }

    return operationBenchmarks;
  }

  function compareToBenchmarks() {
    const benchmarks = getIndustryBenchmarks();
    const current = state.ops;

    return {
      maintenance: {
        current: current.maintenance,
        benchmark: benchmarks.maintenance,
        variance: current.maintenance - benchmarks.maintenance,
        variancePct: (
          ((current.maintenance - benchmarks.maintenance) /
            benchmarks.maintenance) *
          100
        ).toFixed(1),
      },
      vacancy: {
        current: current.vacancy,
        benchmark: benchmarks.vacancy,
        variance: current.vacancy - benchmarks.vacancy,
        variancePct: (
          ((current.vacancy - benchmarks.vacancy) / benchmarks.vacancy) *
          100
        ).toFixed(1),
      },
      management: {
        current: current.management,
        benchmark: benchmarks.management,
        variance: current.management - benchmarks.management,
        variancePct: (
          ((current.management - benchmarks.management) /
            benchmarks.management) *
          100
        ).toFixed(1),
      },
      capEx: {
        current: current.capEx,
        benchmark: benchmarks.capEx,
        variance: current.capEx - benchmarks.capEx,
        variancePct: (
          ((current.capEx - benchmarks.capEx) / benchmarks.capEx) *
          100
        ).toFixed(1),
      },
      opEx: {
        current: current.opEx,
        benchmark: benchmarks.opEx,
        variance: current.opEx - benchmarks.opEx,
        variancePct: (
          ((current.opEx - benchmarks.opEx) / benchmarks.opEx) *
          100
        ).toFixed(1),
      },
    };
  }

  function toggleBenchmarkComparison() {
    setState((prev) => ({
      ...prev,
      benchmarkComparison: {
        ...prev.benchmarkComparison,
        showBenchmarks: !prev.benchmarkComparison.showBenchmarks,
      },
    }));
  }

  // Break-Even Analysis Functions
  function calculateBreakEvenOccupancy(): number {
    // Don't calculate break-even for Land properties or when ADR tabs shouldn't be shown
    if (!shouldShowAdrTabs(state)) {
      return 0;
    }

    try {
      const {
        averageDailyRate,
        totalRooms,
        occupancyRate,
        seasonalVariations,
      } = state.revenueInputs;

      // Validate inputs before calculation
      if (averageDailyRate <= 0 || totalRooms <= 0) {
        setState((prev) => ({
          ...prev,
          validationMessages: [
            ...(prev.validationMessages || []),
            "Invalid ADR or rooms for break-even calculation.",
          ],
          snackbarOpen: true,
        }));
        return 0;
      }

      // Apply seasonal adjustments if ADR tabs are applicable
      let adjustedMonthlyRevenueAt100 = averageDailyRate * totalRooms * 30.42; // Average days per month

      if (shouldShowAdrTabs(state)) {
        const seasonalFactors: SeasonalFactors = {
          summerVacancyRate: seasonalVariations.q2 / 100,
          winterVacancyRate: seasonalVariations.q4 / 100,
          springVacancyRate: seasonalVariations.q1 / 100,
          fallVacancyRate: seasonalVariations.q3 / 100,
          seasonalMaintenanceMultiplier: 1, // Default, adjust if needed
        };
        const month = new Date().getMonth() + 1;
        const { adjustedVacancyRate } = calculateSeasonalAdjustments(
          state.ops.vacancy / 100,
          seasonalFactors,
          month,
        );

        // Apply seasonal vacancy adjustment to revenue calculation
        adjustedMonthlyRevenueAt100 *= 1 - adjustedVacancyRate;
      }

      // Use finance.ts functions for consistent calculations
      const fixedMonthlyOps = computeFixedMonthlyOps(state.ops);
      const variablePct = computeVariableMonthlyOpsPct(state.ops) / 100;

      // Call finance.ts breakEvenOccupancy with proper error handling
      const breakEvenRatio = financeBreakEvenOccupancy({
        monthlyRevenueAt100: adjustedMonthlyRevenueAt100,
        fixedMonthlyOps,
        variablePct,
        includeVariablePct: true,
      });

      // Convert ratio to percentage
      return breakEvenRatio * 100;
    } catch (error) {
      // Enhanced error handling with specific messages
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setState((prev) => ({
        ...prev,
        validationMessages: [
          ...(prev.validationMessages || []),
          "Error in break-even occupancy calculation: " + errorMessage,
        ],
        snackbarOpen: true,
      }));
      return 0;
    }
  }

  function calculateBreakEvenADR(): number {
    // Don't calculate break-even ADR for Land properties or when ADR tabs shouldn't be shown
    if (!shouldShowAdrTabs(state)) {
      return 0;
    }

    try {
      // Use centralized utility functions to eliminate redundant calculations
      const variablePct = computeVariableMonthlyOpsPct(state.ops);
      const fixedCosts = state.revenueInputs.fixedAnnualCosts;
      const occupancy = state.revenueInputs.occupancyRate;
      const rooms = state.revenueInputs.totalRooms;

      if (occupancy === 0 || rooms === 0) {
        setState((prev) => ({
          ...prev,
          validationMessages: [
            ...(prev.validationMessages || []),
            "Invalid occupancy rate or rooms for break-even ADR calculation.",
          ],
          snackbarOpen: true,
        }));
        return 0;
      }

      const dailyFixedCosts = fixedCosts / 365;
      const occupiedRooms = (rooms * occupancy) / 100;

      if (occupiedRooms === 0) {
        setState((prev) => ({
          ...prev,
          validationMessages: [
            ...(prev.validationMessages || []),
            "No occupied rooms for break-even ADR calculation.",
          ],
          snackbarOpen: true,
        }));
        return 0;
      }

      const breakEvenADR = dailyFixedCosts / occupiedRooms;
      const variableCostMultiplier = 1 + variablePct / 100;

      return breakEvenADR * variableCostMultiplier;
    } catch (error) {
      console.error("Error calculating break-even ADR:", error);
      setState((prev) => ({
        ...prev,
        validationMessages: [
          ...(prev.validationMessages || []),
          "Error in break-even ADR calculation.",
        ],
        snackbarOpen: true,
      }));
      return 0;
    }
  }
  function calculateMarginOfSafety(): number {
    // Don't calculate margin of safety for Land properties or when ADR tabs shouldn't be shown
    if (!shouldShowAdrTabs(state)) {
      return 0;
    }

    try {
      const breakEvenOccupancy = calculateBreakEvenOccupancy();
      const currentOccupancy = state.revenueInputs.occupancyRate;

      if (breakEvenOccupancy >= currentOccupancy) {
        setState((prev) => ({
          ...prev,
          validationMessages: [
            ...(prev.validationMessages || []),
            "Current occupancy is at or below break-even; no margin of safety.",
          ],
          snackbarOpen: true,
        }));
        return 0;
      }

      return (
        ((currentOccupancy - breakEvenOccupancy) / breakEvenOccupancy) * 100
      );
    } catch (error) {
      console.error("Error calculating margin of safety:", error);
      setState((prev) => ({
        ...prev,
        validationMessages: [
          ...(prev.validationMessages || []),
          "Error in margin of safety calculation.",
        ],
        snackbarOpen: true,
      }));
      return 0;
    }
  }

  function updateAppreciation<K extends keyof AppreciationInputs>(
    key: K,
    value: AppreciationInputs[K],
    isAutomatic: boolean = false,
  ) {
    setState((prev) => {
      const updatedAppreciation = { ...prev.appreciation, [key]: value };

      // Auto-calculate future property value and refinance potential when appreciation inputs change
      if (
        key === "appreciationPercentPerYear" ||
        key === "yearsOfAppreciation"
      ) {
        const annualRate =
          key === "appreciationPercentPerYear"
            ? (value as number)
            : prev.appreciation?.appreciationPercentPerYear || 0;
        const years =
          key === "yearsOfAppreciation"
            ? (value as number)
            : prev.appreciation?.yearsOfAppreciation || 0;

        if (annualRate > 0 && years > 0 && prev.purchasePrice > 0) {
          const futureValue =
            prev.purchasePrice * Math.pow(1 + annualRate / 100, years);
          const refinanceLtv = updatedAppreciation.refinanceLtv || 70;
          const currentLoanBalance = prev.loan?.loanAmount || 0;
          const refinancePotential = calculateRefinancePotential(
            futureValue,
            currentLoanBalance,
            refinanceLtv,
          );

          updatedAppreciation.futurePropertyValue = futureValue;
          updatedAppreciation.refinancePotential = refinancePotential;
          updatedAppreciation.remainingBalanceAfterRefi =
            futureValue * (refinanceLtv / 100);
        }
      }

      // Handle manual override logic for yearsOfAppreciation
      if (key === "yearsOfAppreciation") {
        if (isAutomatic) {
          // This is an automatic update from balloon payment terms - reset the override flag
          updatedAppreciation.manuallyOverridden = false;
        } else {
          // This is a manual user change - mark as overridden
          updatedAppreciation.manuallyOverridden = true;
        }
      }

      return { ...prev, appreciation: updatedAppreciation };
    });
  }

  function updateSfr<K extends keyof IncomeInputsSfr>(
    key: K,
    value: IncomeInputsSfr[K],
  ) {
    setState((prev) => ({
      ...prev,
      sfr: {
        // Preserve other fields unless explicitly set
        monthlyRent: prev.sfr?.monthlyRent || 0,
        grossMonthlyIncome: prev.sfr?.grossMonthlyIncome || 0,
        grossYearlyIncome: prev.sfr?.grossYearlyIncome || 0,
        [key]: value,
      },
    }));
  }

  function updateMulti<K extends keyof IncomeInputsMulti>(
    key: K,
    value: IncomeInputsMulti[K],
  ) {
    setState((prev) => ({
      ...prev,
      multi: {
        unitRents: prev.multi?.unitRents || [],
        grossMonthlyIncome: prev.multi?.grossMonthlyIncome || 0,
        grossYearlyIncome: prev.multi?.grossYearlyIncome || 0,
        [key]: value,
      },
    }));
  }

  function updateStr<K extends keyof IncomeInputsStr>(
    key: K,
    value: IncomeInputsStr[K],
  ) {
    setState((prev) => ({
      ...prev,
      str: {
        unitDailyRents: prev.str?.unitDailyRents || [],
        unitMonthlyRents: prev.str?.unitMonthlyRents || [],
        dailyCleaningFee: prev.str?.dailyCleaningFee || 0,
        laundry: prev.str?.laundry || 0,
        activities: prev.str?.activities || 0,
        avgNightsPerMonth: prev.str?.avgNightsPerMonth || 0,
        grossDailyIncome: prev.str?.grossDailyIncome || 0,
        grossMonthlyIncome: prev.str?.grossMonthlyIncome || 0,
        grossYearlyIncome: prev.str?.grossYearlyIncome || 0,
        [key]: value,
      },
    }));
  }

  function updateOfficeRetail<K extends keyof OfficeRetailInputs>(
    key: K,
    value: OfficeRetailInputs[K],
  ) {
    setState((prev) => ({
      ...prev,
      officeRetail: {
        ...(prev.officeRetail ?? {
          squareFootage: 0,
          rentPerSFMonthly: 0,
          occupancyRatePct: 0,
          extraMonthlyIncome: 0,
        }),
        [key]: value,
      },
    }));
  }

  function updateLand<K extends keyof LandInputs>(
    key: K,
    value: LandInputs[K],
  ) {
    setState((prev) => ({
      ...prev,
      land: {
        ...(prev.land ?? {
          acreage: 0,
          zoning: "Residential",
          extraMonthlyIncome: 0,
        }),
        [key]: value,
      },
    }));
  }

  function updateArbitrage<K extends keyof ArbitrageInputs>(
    key: K,
    value: ArbitrageInputs[K],
  ) {
    setState((prev) => {
      // Validate cash investment fields to prevent negative values that could cause division by zero in ROI calculations
      const cashInvestmentFields: Array<keyof ArbitrageInputs> = [
        "deposit",
        "estimateCostOfRepairs",
        "furnitureCost",
        "otherStartupCosts",
      ];
      const hasNegativeValue =
        cashInvestmentFields.includes(key) && (value as number) < 0;

      // Return single state update with all computed values
      return {
        ...prev,
        arbitrage: {
          ...(prev.arbitrage ?? {
            deposit: 0,
            monthlyRentToLandlord: 0,
            estimateCostOfRepairs: 0,
            furnitureCost: 0,
            otherStartupCosts: 0,
            startupCostsTotal: 0,
          }),
          [key]: value,
        },
        ...(hasNegativeValue && {
          validationMessages: [
            ...(prev.validationMessages || []),
            `${key === "deposit" ? "Deposit" : key === "estimateCostOfRepairs" ? "Cost of Repairs" : key === "furnitureCost" ? "Furniture Cost" : "Other Startup Costs"} cannot be negative. This could cause invalid ROI calculations.`,
          ],
          snackbarOpen: true,
        }),
      };
    });
  }

  function updateSubjectTo<K extends keyof SubjectToInputs>(
    key: K,
    value: SubjectToInputs[K],
  ) {
    setState((prev) => {
      // Validate cash investment fields to prevent negative values that could cause division by zero in ROI calculations
      const hasNegativeValue =
        key === "paymentToSeller" && (value as number) < 0;

      // Return single state update with all computed values
      return {
        ...prev,
        subjectTo: {
          ...(prev.subjectTo ?? {
            paymentToSeller: 0,
            loans: [],
            totalLoanBalance: 0,
            totalMonthlyPayment: 0,
            totalAnnualPayment: 0,
          }),
          [key]: value,
        },
        ...(hasNegativeValue && {
          validationMessages: [
            ...(prev.validationMessages || []),
            "Subject-To Payment to Seller cannot be negative. This could cause invalid ROI calculations.",
          ],
          snackbarOpen: true,
        }),
      };
    });
  }

  function updateHybrid<K extends keyof HybridInputs>(
    key: K,
    value: HybridInputs[K],
  ) {
    setState((prev) => {
      // Validate cash investment fields to prevent negative values that could cause division by zero in ROI calculations
      const hasNegativeValue = key === "downPayment" && (value as number) < 0;

      const updatedHybrid = {
        ...(prev.hybrid ?? {
          downPayment: 0,
          loan3Amount: 0,
          annualInterestRate: 0,
          monthlyPayment: 0,
          annualPayment: 0,
          loanTerm: 30,
          interestOnly: false,
          balloonDue: 0,
          paymentToSeller: 0,
          subjectToLoans: [],
          totalLoanBalance: 0,
          totalMonthlyPayment: 0,
          totalAnnualPayment: 0,
        }),
        [key]: value,
      };

      // Auto-calculate monthly payment when loan terms change
      if (["loan3Amount", "annualInterestRate", "loanTerm"].includes(key)) {
        const { loan3Amount, annualInterestRate, loanTerm } = updatedHybrid;
        if (loan3Amount > 0 && annualInterestRate > 0 && loanTerm > 0) {
          // Convert loan term from years to months for finance calculations
          const termMonths = loanTerm * 12;
          // Calculate monthly payment using finance.ts pmt function
          const calculatedMonthlyPayment = pmt(
            annualInterestRate / 100,
            termMonths,
            loan3Amount,
          );
          updatedHybrid.monthlyPayment = Math.round(calculatedMonthlyPayment);
          updatedHybrid.annualPayment = Math.round(
            calculatedMonthlyPayment * 12,
          );
        }
      }

      // Return single state update with all computed values
      return {
        ...prev,
        hybrid: updatedHybrid,
        ...(hasNegativeValue && {
          validationMessages: [
            ...(prev.validationMessages || []),
            "Hybrid Down Payment cannot be negative. This could cause invalid ROI calculations.",
          ],
          snackbarOpen: true,
        }),
      };
    });
  }

  function updateFixFlip<K extends keyof FixFlipInputs>(
    key: K,
    value: FixFlipInputs[K],
  ) {
    setState((prev) => {
      const updatedFixFlip = {
        ...(prev.fixFlip ?? {
          arv: 0,
          holdingPeriodMonths: 0,
          holdingCosts: 0,
          sellingCostsPercent: 0,
          targetPercent: 70,
          rehabCost: 0,
          maximumAllowableOffer: 0,
          projectedProfit: 0,
          roiDuringHold: 0,
          annualizedRoi: 0,
        }),
        [key]: value,
      };

      // If holding period changed and pro forma auto is enabled, update vacancy rate
      if (
        key === "holdingPeriodMonths" &&
        prev.proFormaAuto &&
        prev.proFormaPreset !== "custom"
      ) {
        const newHoldingPeriod = value as number;
        const newVacancyRate = calculateFixFlipVacancyRate(newHoldingPeriod);

        return {
          ...prev,
          fixFlip: updatedFixFlip,
          ops: {
            ...prev.ops,
            vacancy: newVacancyRate,
          },
        };
      }

      // Auto-calculate Fix & Flip results including exit strategies when key inputs change
      if (
        [
          "arv",
          "targetPercent",
          "rehabCost",
          "holdingCosts",
          "holdingPeriodMonths",
          "sellingCostsPercent",
        ].includes(key)
      ) {
        const calculations = computeFixFlipCalculations({
          ...prev,
          fixFlip: updatedFixFlip,
        });

        return {
          ...prev,
          fixFlip: {
            ...updatedFixFlip,
            maximumAllowableOffer: calculations.maximumAllowableOffer,
            projectedProfit: calculations.projectedProfit,
            roiDuringHold: calculations.roiDuringHold,
            annualizedRoi: calculations.annualizedRoi,
            exitStrategies: calculations.exitStrategies,
          },
        };
      }

      return {
        ...prev,
        fixFlip: updatedFixFlip,
      };
    });
  }

  function updateBRRRR<K extends keyof BRRRRInputs>(
    key: K,
    value: BRRRRInputs[K],
  ) {
    setState((prev) => {
      const updatedBRRRR = {
        ...(prev.brrrr ?? {
          arv: 0,
          refinanceLtv: 0,
          refinanceInterestRate: 0,
          loanTerm: 0,
          newMonthlyPayment: 0,
          originalCashInvested: 0,
          cashOutAmount: 0,
          remainingCashInDeal: 0,
          newCashOnCashReturn: 0,
          refinanceClosingCosts: 0,
          effectiveCashOut: 0,
          ltvConstraint: true,
        }),
        [key]: value,
      };

      // Auto-calculate BRRRR results when key inputs change
      if (
        [
          "arv",
          "refinanceLtv",
          "originalCashInvested",
          "newMonthlyPayment",
        ].includes(key)
      ) {
        const calculations = computeBRRRRCalculations({
          ...prev,
          brrrr: updatedBRRRR,
        });

        return {
          ...prev,
          brrrr: {
            ...updatedBRRRR,
            cashOutAmount: calculations.cashOutAmount,
            remainingCashInDeal: calculations.remainingCashInDeal,
            newCashOnCashReturn: calculations.newCashOnCashReturn,
            refinanceClosingCosts: calculations.refinanceClosingCosts,
            effectiveCashOut: calculations.effectiveCashOut,
            ltvConstraint: calculations.ltvConstraint,
            exitStrategies: calculations.exitStrategies,
          },
        };
      }

      return {
        ...prev,
        brrrr: updatedBRRRR,
      };
    });
  }

  // Helper function to calculate appropriate vacancy rate for Fix & Flip operations
  function calculateFixFlipVacancyRate(holdingPeriodMonths: number): number {
    if (holdingPeriodMonths <= 0) return 0;

    // Apply holding period delay factor (10% of holding period) to model vacancy-like costs
    // This accounts for potential delays in selling and market conditions
    const baseVacancyRate = Math.round(holdingPeriodMonths * 0.1);

    // Ensure minimum vacancy rate of 1% for meaningful impact
    return Math.max(1, baseVacancyRate);
  }

  function recalcSubjectToTotals(loans: SubjectToLoan[] | undefined) {
    const arr = loans || [];
    const totalBalance = arr.reduce(
      (sum, l) => sum + (l.currentBalance || l.amount || 0),
      0,
    );
    const totalMonthly = arr.reduce(
      (sum, l) => sum + (l.monthlyPayment || 0),
      0,
    );
    setState((prev) => ({
      ...prev,
      subjectTo: {
        ...(prev.subjectTo || {
          paymentToSeller: 0,
          loans: [] as SubjectToLoan[],
          totalLoanBalance: 0,
          totalMonthlyPayment: 0,
          totalAnnualPayment: 0,
        }),
        totalLoanBalance: totalBalance,
        totalMonthlyPayment: totalMonthly,
        totalAnnualPayment: totalMonthly * 12,
      },
    }));
  }

  function updateSubjectToLoan(
    index: number,
    key: keyof SubjectToLoan,
    value: number,
  ) {
    setState((prev) => {
      // Ensure subjectTo exists and is properly initialized
      if (!prev.subjectTo) {
        prev.subjectTo = {
          paymentToSeller: 0,
          loans: [],
          totalLoanBalance: 0,
          totalMonthlyPayment: 0,
          totalAnnualPayment: 0,
        };
      }

      const newLoans = [...prev.subjectTo.loans];

      // Validate loan index and initialize if needed
      if (!newLoans[index]) {
        newLoans[index] = {
          amount: 0,
          annualInterestRate: 0,
          monthlyPayment: 0,
          originalTermYears: 30,
          startDate: currentDateInputValue(),
          currentBalance: 0,
          paymentNumber: 1,
          balloonDue: 0,
          interestOnly: false,
        };
      }

      newLoans[index] = { ...newLoans[index], [key]: value };

      // Compute all totals in a single pass
      const totalBalance = newLoans.reduce(
        (sum, l) => sum + (l.currentBalance || l.amount || 0),
        0,
      );
      const totalMonthly = newLoans.reduce(
        (sum, l) => sum + (l.monthlyPayment || 0),
        0,
      );

      // Return single state update with all computed values
      return {
        ...prev,
        subjectTo: {
          ...prev.subjectTo,
          loans: newLoans,
          totalLoanBalance: totalBalance,
          totalMonthlyPayment: totalMonthly,
          totalAnnualPayment: totalMonthly * 12,
        },
      };
    });
  }

  function updateHybridSubjectToLoan(
    index: number,
    key: keyof SubjectToLoan,
    value: number,
  ) {
    setState((prev) => {
      // Ensure hybrid exists and is properly initialized
      if (!prev.hybrid) {
        prev.hybrid = {
          downPayment: 0,
          loan3Amount: 0,
          annualInterestRate: 0,
          monthlyPayment: 0,
          annualPayment: 0,
          loanTerm: 30,
          interestOnly: false,
          balloonDue: 0,
          paymentToSeller: 0,
          subjectToLoans: [],
          totalLoanBalance: 0,
          totalMonthlyPayment: 0,
          totalAnnualPayment: 0,
        };
      }

      const newLoans = [...prev.hybrid.subjectToLoans];

      // Validate loan index and initialize if needed
      if (!newLoans[index]) {
        newLoans[index] = {
          amount: 0,
          annualInterestRate: 0,
          monthlyPayment: 0,
          originalTermYears: 30,
          startDate: currentDateInputValue(),
          currentBalance: 0,
          paymentNumber: 1,
          balloonDue: 0,
          interestOnly: false,
        };
      }

      newLoans[index] = { ...newLoans[index], [key]: value };

      // Compute all totals in a single pass
      const totalBalance = newLoans.reduce(
        (sum, l) => sum + (l.currentBalance || l.amount || 0),
        0,
      );
      const totalMonthly = newLoans.reduce(
        (sum, l) => sum + (l.monthlyPayment || 0),
        0,
      );

      // Return single state update with all computed values
      return {
        ...prev,
        hybrid: {
          ...prev.hybrid,
          subjectToLoans: newLoans,
          totalLoanBalance: totalBalance,
          totalMonthlyPayment: totalMonthly,
          totalAnnualPayment: totalMonthly * 12,
        },
      } as DealState;
    });
  }

  // Helper function to safely access loan data with validation
  function getSubjectToLoan(
    state: DealState,
    index: number,
  ): SubjectToLoan | null {
    if (!state.subjectTo || !state.subjectTo.loans[index]) {
      return null;
    }
    return state.subjectTo.loans[index];
  }

  // Helper function to safely access hybrid loan data with validation
  function getHybridSubjectToLoan(
    state: DealState,
    index: number,
  ): SubjectToLoan | null {
    if (!state.hybrid || !state.hybrid.subjectToLoans[index]) {
      return null;
    }
    return state.hybrid.subjectToLoans[index];
  }

  function exportToPDF() {
    // TODO: Implement PDF export with jsPDF
    const proFormaData = {
      currentPreset: state.proFormaPreset,
      currentValues: {
        maintenance: state.ops.maintenance,
        vacancy: state.ops.vacancy,
        management: state.ops.management,
        capEx: state.ops.capEx,
        opEx: state.ops.opEx,
      },
      customPresets: state.customProFormaPresets,
      sensitivityAnalysis: state.sensitivityAnalysis.showSensitivity
        ? calculateSensitivityAnalysis()
        : null,
      benchmarkComparison: state.benchmarkComparison.showBenchmarks
        ? compareToBenchmarks()
        : null,
    };

    console.log("Pro Forma data for PDF export:", proFormaData);
    alert(
      "PDF export coming soon! This will include your deal analysis with Pro Forma data and Dreamery branding.",
    );
  }

  function exportToExcel() {
    // TODO: Implement Excel export with xlsx
    const proFormaData = {
      currentPreset: state.proFormaPreset,
      currentValues: {
        maintenance: state.ops.maintenance,
        vacancy: state.ops.vacancy,
        management: state.ops.management,
        capEx: state.ops.capEx,
        opEx: state.ops.opEx,
      },
      customPresets: state.customProFormaPresets,
      sensitivityAnalysis: state.sensitivityAnalysis.showSensitivity
        ? calculateSensitivityAnalysis()
        : null,
      benchmarkComparison: state.benchmarkComparison.showBenchmarks
        ? compareToBenchmarks()
        : null,
    };

    console.log("Pro Forma data for Excel export:", proFormaData);
    alert(
      "Excel export coming soon! This will include your deal analysis with Pro Forma data in an editable spreadsheet format.",
    );
  }

  useEffect(() => {
    // Load custom presets from localStorage
    console.log("Loading custom presets from localStorage...");
    const savedPresets = localStorage.getItem("dreameryCustomProFormaPresets");
    console.log("Raw localStorage data:", savedPresets);

    if (savedPresets) {
      try {
        const parsedPresets = JSON.parse(savedPresets);
        console.log("Parsed presets:", parsedPresets);

        // Convert string dates back to Date objects
        const presetsWithDates = parsedPresets.map((preset: any) => ({
          ...preset,
          createdAt: new Date(preset.createdAt),
        }));

        console.log("Presets with dates:", presetsWithDates);
        setState((prev) => ({
          ...prev,
          customProFormaPresets: presetsWithDates,
        }));
      } catch (error) {
        console.error("Error loading custom presets:", error);
      }
    } else {
      console.log("No custom presets found in localStorage");
    }
  }, []);

  // Auto-calculate risk score when risk factors or market conditions change
  useEffect(() => {
    if (state.riskFactors && state.marketConditions && state.propertyAge) {
      computeRiskScore(state);
    }
  }, [state.riskFactors, state.marketConditions, state.propertyAge]);

  // Auto-update inflation projections when key inputs change
  useEffect(() => {
    if (state.purchasePrice > 0 && state.ops && state.marketConditions) {
      updateInflationProjections(state, setState);
    }
  }, [
    state.purchasePrice,
    state.ops.maintenance,
    state.ops.vacancy,
    state.ops.management,
    state.ops.capEx,
    state.ops.opEx,
    state.marketConditions,
  ]);

  // Auto-sync balloon payment terms with appreciation calculator "Years to Hold"
  useEffect(() => {
    if (
      state.offerType &&
      ["Seller Finance", "Subject To Existing Mortgage", "Hybrid"].includes(
        state.offerType,
      )
    ) {
      let balloonDueYears = 0;

      switch (state.offerType) {
        case "Seller Finance":
          balloonDueYears = state.loan?.balloonDue || 0;
          break;
        case "Subject To Existing Mortgage":
          // Find the maximum balloon due years among all subject-to loans
          balloonDueYears = Math.max(
            ...(state.subjectTo?.loans?.map((loan) => loan.balloonDue || 0) || [
              0,
            ]),
          );
          break;
        case "Hybrid":
          // Find the maximum balloon due years among hybrid and subject-to loans
          const hybridBalloonDue = state.hybrid?.balloonDue || 0;
          const subjectToBalloonDue = Math.max(
            ...(state.hybrid?.subjectToLoans?.map(
              (loan) => loan.balloonDue || 0,
            ) || [0]),
          );
          balloonDueYears = Math.max(hybridBalloonDue, subjectToBalloonDue);
          break;
      }

      // Update appreciation calculator "Years to Hold" if balloon payment is due
      if (
        balloonDueYears > 0 &&
        balloonDueYears !== state.appreciation?.yearsOfAppreciation &&
        !state.appreciation?.manuallyOverridden
      ) {
        updateAppreciation("yearsOfAppreciation", balloonDueYears, true); // Pass isAutomatic: true
      }
    }
  }, [
    state.offerType,
    state.loan?.balloonDue,
    state.subjectTo?.loans,
    state.hybrid?.balloonDue,
    state.hybrid?.subjectToLoans,
  ]);
  return (
    <>
              <PageAppBar title="Underwrite Properties with Dreamery" />
      <Box
        sx={{
          minHeight: "100vh",
          background: brandColors.backgrounds.primary,
          transition: "all 0.3s ease-in-out",
          marginTop: "64px", // Add margin to account for fixed AppBar
        }}
      >
      <Container
        maxWidth="lg"
        sx={{ py: 2, minHeight: "100vh", transition: "all 0.3s ease-in-out" }}
      >
        <Card
          sx={{
            borderRadius: 2,
            border: "1px solid brandColors.borders.secondary",
            transition: "all 0.3s ease-in-out",
            minHeight: "fit-content",
          }}
        >
          <CardContent>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              Dreamery Calculator
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Analyze your next real estate investment with our comprehensive
              calculator. Input your property details and financing terms to see
              projected returns and key metrics.
            </Typography>
          </CardContent>
        </Card>

        {/* Validation messages */}
        {state.validationMessages && state.validationMessages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {state.validationMessages.map((msg, idx) => (
              <Alert key={idx} severity="info" sx={{ mb: 1 }}>
                {msg}
              </Alert>
            ))}
          </Box>
        )}
        <Snackbar
          open={!!state.validationMessages?.length && !!state.snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setState((prev) => ({ ...prev, snackbarOpen: false }))}
          message={state.validationMessages?.[0]}
        />

        {/* Basic Info Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Basic Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <TextField
                  fullWidth
                  label="Agent/Owner"
                  value={state.agentOwner}
                  onChange={(e) => update("agentOwner", e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Property Address"
                  value={state.propertyAddress}
                  onChange={(e) => update("propertyAddress", e.target.value)}
                />
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={state.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={state.call}
                    onChange={(e) => update("call", e.target.value)}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "3fr 4fr 4fr 2fr",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Analysis Date"
                    placeholder="MM / DD / YY"
                    value={getTodayFormatted()}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Listed Price"
                    value={
                      state.listedPrice
                        ? state.listedPrice.toLocaleString("en-US")
                        : ""
                    }
                    onChange={(e) =>
                      update(
                        "listedPrice",
                        parseCurrencyWithValidation(
                          e.target.value,
                          "Listed Price",
                          setState,
                        ),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Purchase Price"
                    value={
                      state.purchasePrice
                        ? state.purchasePrice.toLocaleString("en-US")
                        : ""
                    }
                    onChange={(e) =>
                      update(
                        "purchasePrice",
                        parseCurrencyWithValidation(
                          e.target.value,
                          "Purchase Price",
                          setState,
                        ),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="% Difference"
                    value={
                      (
                        ((state.purchasePrice - state.listedPrice) /
                          state.listedPrice) *
                        100
                      ).toFixed(1) + "%"
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={state.propertyType}
                    onChange={(e) =>
                      update("propertyType", e.target.value as PropertyType)
                    }
                    label="Property Type"
                  >
                    <MenuItem value="Single Family">Single Family</MenuItem>
                    <MenuItem value="Multi Family">Multi Family</MenuItem>
                    <MenuItem value="Hotel">Hotel</MenuItem>
                    <MenuItem value="Land">Land</MenuItem>
                    <MenuItem value="Office">Office</MenuItem>
                    <MenuItem value="Retail">Retail</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Operation Type</InputLabel>
                  <Select
                    value={state.operationType}
                    onChange={(e) =>
                      update("operationType", e.target.value as OperationType)
                    }
                    label="Operation Type"
                  >
                    {getOperationTypeOptions(state.propertyType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Finance Type</InputLabel>
                  <Select
                    value={state.offerType}
                    onChange={(e) =>
                      update("offerType", e.target.value as OfferType)
                    }
                    label="Finance Type"
                  >
                    {getOfferTypeOptions(
                      state.propertyType,
                      state.operationType,
                    ).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Subject-To Existing Mortgage Section - shown for Subject-To or as part of Hybrid when not arbitrage */}
        {(state.offerType === "Subject To Existing Mortgage" ||
          state.offerType === "Hybrid") &&
          state.operationType !== "Rental Arbitrage" && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Subject-To Existing Mortgage
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <TextField
                      fullWidth
                      label="Payment to Seller (one-time)"
                      value={state.subjectTo.paymentToSeller}
                      onChange={(e) =>
                        updateSubjectTo(
                          "paymentToSeller",
                          parseCurrency(e.target.value),
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark }}>
                        Existing Loans
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          Loan 1
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Loan Amount"
                            value={state.subjectTo.loans[0]?.amount || 0}
                            onChange={(e) =>
                              updateSubjectToLoan(
                                0,
                                "amount",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Interest Rate"
                            value={
                              state.subjectTo.loans[0]?.annualInterestRate || 0
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                0,
                                "annualInterestRate",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Monthly Payment"
                            value={
                              state.subjectTo.loans[0]?.monthlyPayment || 0
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                0,
                                "monthlyPayment",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Original Term (Years)"
                            type="number"
                            value={
                              state.subjectTo?.loans[0]?.originalTermYears || 30
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                0,
                                "originalTermYears",
                                parseInt(e.target.value) || 30,
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={
                              state.subjectTo?.loans[0]?.startDate ||
                              currentDateInputValue()
                            }
                            onChange={(e) => {
                              const newLoans = [
                                ...(state.subjectTo?.loans || []),
                              ];
                              if (!newLoans[0]) {
                                newLoans[0] = {
                                  amount: 0,
                                  annualInterestRate: 0,
                                  monthlyPayment: 0,
                                  originalTermYears: 30,
                                  startDate: currentDateInputValue(),
                                  currentBalance: 0,
                                  paymentNumber: 1,
                                  balloonDue: 0,
                                  interestOnly: false,
                                };
                              }
                              newLoans[0] = {
                                ...newLoans[0],
                                startDate: e.target.value,
                              };
                              setState((prev) => ({
                                ...prev,
                                subjectTo: {
                                  ...(prev.subjectTo || {
                                    paymentToSeller: 0,
                                    loans: [],
                                    totalLoanBalance: 0,
                                    totalMonthlyPayment: 0,
                                    totalAnnualPayment: 0,
                                  }),
                                  loans: newLoans,
                                },
                              }));
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Current Payment Number"
                            type="number"
                            value={
                              state.subjectTo?.loans[0]?.paymentNumber || 1
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                0,
                                "paymentNumber",
                                parseInt(e.target.value) || 1,
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            label="Balloon Due (years)"
                            type="number"
                            value={state.subjectTo?.loans[0]?.balloonDue || 0}
                            onChange={(e) =>
                              updateSubjectToLoan(
                                0,
                                "balloonDue",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            helperText="Leave as 0 for no balloon payment"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  years
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, mt: 2 }}
                        >
                          Loan 2
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Loan Amount"
                            value={state.subjectTo.loans[1]?.amount || 0}
                            onChange={(e) =>
                              updateSubjectToLoan(
                                1,
                                "amount",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Interest Rate"
                            value={
                              state.subjectTo.loans[1]?.annualInterestRate || 0
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                1,
                                "annualInterestRate",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Monthly Payment"
                            value={
                              state.subjectTo.loans[1]?.monthlyPayment || 0
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                1,
                                "monthlyPayment",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Original Term (Years)"
                            type="number"
                            value={
                              state.subjectTo?.loans[1]?.originalTermYears || 30
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                1,
                                "originalTermYears",
                                parseInt(e.target.value) || 30,
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={
                              state.subjectTo?.loans[1]?.startDate ||
                              currentDateInputValue()
                            }
                            onChange={(e) => {
                              const newLoans = [
                                ...(state.subjectTo?.loans || []),
                              ];
                              if (!newLoans[1]) {
                                newLoans[1] = {
                                  amount: 0,
                                  annualInterestRate: 0,
                                  monthlyPayment: 0,
                                  originalTermYears: 30,
                                  startDate: currentDateInputValue(),
                                  currentBalance: 0,
                                  paymentNumber: 1,
                                  balloonDue: 0,
                                  interestOnly: false,
                                };
                              }
                              newLoans[1] = {
                                ...newLoans[1],
                                startDate: e.target.value,
                              };
                              setState((prev) => ({
                                ...prev,
                                subjectTo: {
                                  ...(prev.subjectTo || {
                                    paymentToSeller: 0,
                                    loans: [],
                                    totalLoanBalance: 0,
                                    totalMonthlyPayment: 0,
                                    totalAnnualPayment: 0,
                                  }),
                                  loans: newLoans,
                                },
                              }));
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Current Payment Number"
                            type="number"
                            value={
                              state.subjectTo?.loans[1]?.paymentNumber || 1
                            }
                            onChange={(e) =>
                              updateSubjectToLoan(
                                1,
                                "paymentNumber",
                                parseInt(e.target.value) || 1,
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            label="Balloon Due (years)"
                            type="number"
                            value={state.subjectTo?.loans[1]?.balloonDue || 0}
                            onChange={(e) =>
                              updateSubjectToLoan(
                                1,
                                "balloonDue",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            helperText="Leave as 0 for no balloon payment"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  years
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: brandColors.neutral.light,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 2, color: brandColors.neutral.dark }}
                        >
                          Auto-calculated Totals
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "1fr 1fr 1fr",
                            },
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Total Loan Balance"
                            value={formatCurrency(
                              state.subjectTo.totalLoanBalance,
                            )}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Total Monthly Payment"
                            value={formatCurrency(
                              state.subjectTo.totalMonthlyPayment,
                            )}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Total Annual Payment"
                            value={formatCurrency(
                              state.subjectTo.totalAnnualPayment,
                            )}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Card>
          )}

        {/* Subject-To Amortization Schedule Section */}
        {state.offerType === "Subject To Existing Mortgage" &&
          state.operationType !== "Rental Arbitrage" && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Subject-To Amortization Schedule
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {state.subjectTo?.loans?.map((loan, loanIndex) => (
                      <Box
                        key={loanIndex}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: brandColors.neutral.dark }}
                        >
                          Loan {loanIndex + 1} Amortization Schedule
                        </Typography>
                        {loan.amount > 0 &&
                          loan.annualInterestRate > 0 &&
                          loan.originalTermYears > 0 && (
                            <>
                              <Box sx={{ width: "100%" }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(
                                    100,
                                    ((loan.originalTermYears * 12) / 600) * 100,
                                  )}
                                  sx={{ height: 10, borderRadius: 5 }}
                                />
                              </Box>
                              <Box sx={{ overflowX: "auto" }}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Payment #</TableCell>
                                      <TableCell>Date</TableCell>
                                      <TableCell>Payment</TableCell>
                                      <TableCell>Interest</TableCell>
                                      <TableCell>Principal</TableCell>
                                      <TableCell>Balance</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {buildSubjectToAmortization(
                                      loan,
                                      loan.paymentNumber || 1,
                                    )
                                      .slice(0, 60)
                                      .map((row) => (
                                        <TableRow key={row.index}>
                                          <TableCell>{row.index}</TableCell>
                                          <TableCell>
                                            {row.paymentDate}
                                          </TableCell>
                                          <TableCell>
                                            {formatCurrency(row.payment)}
                                          </TableCell>
                                          <TableCell>
                                            {formatCurrency(row.interest)}
                                          </TableCell>
                                          <TableCell>
                                            {formatCurrency(row.principal)}
                                          </TableCell>
                                          <TableCell>
                                            {formatCurrency(row.balance)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </Box>
                              <Typography
                                variant="caption"
                                align="center"
                                sx={{ color: brandColors.neutral.dark }}
                              >
                                Showing next 60 payments (5 years) of{" "}
                                {loan.originalTermYears * 12 -
                                  (loan.paymentNumber || 1) +
                                  1}{" "}
                                remaining payments
                              </Typography>
                            </>
                          )}
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Card>
          )}

        {/* Seller Finance Section - available even for arbitrage if selected */}
        {state.offerType === "Seller Finance" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Seller Finance</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Payment to Seller (one-time)"
                    value={state.loan.downPayment || 0}
                    onChange={(e) =>
                      updateLoan(
                        "downPayment",
                        parseCurrencyWithValidation(
                          e.target.value,
                          "Payment to Seller",
                          setState,
                        ),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark }}>
                      Seller Finance Loan
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Loan Amount"
                        value={state.loan.loanAmount || 0}
                        onChange={(e) =>
                          updateLoan(
                            "loanAmount",
                            parseCurrencyWithValidation(
                              e.target.value,
                              "Loan Amount",
                              setState,
                            ),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Interest Rate"
                        value={state.loan.annualInterestRate || 0}
                        onChange={(e) =>
                          updateLoan(
                            "annualInterestRate",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Monthly Payment"
                        value={state.loan.monthlyPayment || 0}
                        onChange={(e) =>
                          updateLoan(
                            "monthlyPayment",
                            parseCurrencyWithValidation(
                              e.target.value,
                              "Monthly Payment",
                              setState,
                            ),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Loan Term (Years)"
                        type="number"
                        value={state.loan.amortizationYears || 30}
                        onChange={(e) =>
                          updateLoan(
                            "amortizationYears",
                            parseInt(e.target.value) || 30,
                          )
                        }
                      />
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={currentDateInputValue()}
                        onChange={(e) => {
                          // Start date for seller finance (analysis date is always current)
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.loan.interestOnly || false}
                            onChange={(e) =>
                              updateLoan("interestOnly", e.target.checked)
                            }
                          />
                        }
                        label="Interest Only"
                      />
                      <TextField
                        fullWidth
                        label="Balloon Due (years)"
                        type="number"
                        value={state.loan.balloonDue || 0}
                        onChange={(e) =>
                          updateLoan(
                            "balloonDue",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        helperText="Leave as 0 for no balloon payment"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              years
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: brandColors.neutral.light, borderRadius: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral.dark }}
                    >
                      Auto-calculated Results
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Total Monthly Payment"
                        value={formatCurrency(state.loan.monthlyPayment || 0)}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Total Annual Payment"
                        value={formatCurrency(
                          (state.loan.monthlyPayment || 0) * 12,
                        )}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Total Loan Amount"
                        value={formatCurrency(state.loan.loanAmount || 0)}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {/* Seller Finance Amortization Schedule Section */}
        {state.offerType === "Seller Finance" &&
          state.operationType !== "Rental Arbitrage" && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Seller Finance Amortization Schedule
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {state.loan.loanAmount > 0 &&
                      state.loan.annualInterestRate > 0 &&
                      state.loan.amortizationYears > 0 && (
                        <>
                          <Box sx={{ width: "100%" }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(
                                100,
                                ((state.loan.amortizationYears * 12) / 600) *
                                  100,
                              )}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ overflowX: "auto" }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Payment #</TableCell>
                                  <TableCell>Date</TableCell>
                                  <TableCell>Payment</TableCell>
                                  <TableCell>Interest</TableCell>
                                  <TableCell>Principal</TableCell>
                                  <TableCell>Balance</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {buildAmortization(
                                  state.loan.loanAmount,
                                  state.loan.annualInterestRate,
                                  state.loan.amortizationYears,
                                  state.loan.interestOnly || false,
                                )
                                  .slice(0, 60)
                                  .map((row) => (
                                    <TableRow key={row.index}>
                                      <TableCell>{row.index}</TableCell>
                                      <TableCell>
                                        {(() => {
                                          const startDate = new Date(
                                            currentDate,
                                          );
                                          const paymentDate = new Date(
                                            startDate,
                                          );
                                          paymentDate.setMonth(
                                            startDate.getMonth() +
                                              row.index -
                                              1,
                                          );
                                          return paymentDate.toLocaleDateString(
                                            "en-US",
                                            { month: "short", year: "numeric" },
                                          );
                                        })()}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(row.payment)}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(row.interest)}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(row.principal)}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(row.balance)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </Box>
                          <Typography
                            variant="caption"
                            align="center"
                            sx={{ color: brandColors.neutral.dark }}
                          >
                            Showing next 60 payments (5 years) of{" "}
                            {state.loan.amortizationYears * 12} total payments
                          </Typography>
                        </>
                      )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Card>
          )}

        {/* Hybrid Financing Section - Moved to appear after Seller Finance */}
        {state.offerType === "Hybrid" &&
          state.operationType !== "Rental Arbitrage" && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Hybrid Financing
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark }}>
                        New Note (Loan 3)
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Down Payment"
                          value={state.hybrid?.downPayment}
                          onChange={(e) =>
                            updateHybrid(
                              "downPayment",
                              parseCurrency(e.target.value),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Loan Amount"
                          value={state.hybrid?.loan3Amount}
                          onChange={(e) =>
                            updateHybrid(
                              "loan3Amount",
                              parseCurrency(e.target.value),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Interest Rate"
                          value={state.hybrid?.annualInterestRate}
                          onChange={(e) =>
                            updateHybrid(
                              "annualInterestRate",
                              parseCurrency(e.target.value),
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Monthly Payment (Auto-calculated)"
                          value={state.hybrid?.monthlyPayment}
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          helperText="Calculated from loan amount, interest rate, and term"
                        />
                        <TextField
                          fullWidth
                          label="Loan Term (Years)"
                          type="number"
                          value={state.hybrid?.loanTerm || 30}
                          onChange={(e) =>
                            updateHybrid(
                              "loanTerm",
                              parseInt(e.target.value) || 30,
                            )
                          }
                        />
                        <TextField
                          fullWidth
                          label="Start Date"
                          type="date"
                          value={currentDateInputValue()}
                          onChange={(e) => {
                            // Start date for hybrid loan 3 (analysis date is always current)
                          }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={state.hybrid?.interestOnly}
                              onChange={(e) =>
                                updateHybrid("interestOnly", e.target.checked)
                              }
                            />
                          }
                          label="Interest Only"
                        />
                        <TextField
                          fullWidth
                          label="Balloon Due (years)"
                          type="number"
                          value={state.hybrid?.balloonDue}
                          onChange={(e) =>
                            updateHybrid(
                              "balloonDue",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          helperText="Leave as 0 for no balloon payment"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                years
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>

                    <TextField
                      fullWidth
                      label="Payment to Seller"
                      value={state.hybrid?.paymentToSeller}
                      onChange={(e) =>
                        updateHybrid(
                          "paymentToSeller",
                          parseCurrency(e.target.value),
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />

                    <Box
                      sx={{ mt: 2, p: 2, bgcolor: brandColors.neutral.light, borderRadius: 1 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, color: brandColors.neutral.dark }}
                      >
                        Combined Financing Summary
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Total Loan Balance"
                          value={formatCurrency(
                            state.hybrid?.totalLoanBalance || 0,
                          )}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Total Monthly Payment"
                          value={formatCurrency(
                            state.hybrid?.totalMonthlyPayment || 0,
                          )}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Total Annual Payment"
                          value={formatCurrency(
                            state.hybrid?.totalAnnualPayment || 0,
                          )}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Card>
          )}
        {/* Hybrid Amortization Schedule Section - Combined Schedule for All Loans */}
        {state.offerType === "Cash" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Costs</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Basic Costs - For Cash */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral.dark }}
                    >
                      Basic Costs
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      {/* Hide Closing Costs for Office/Retail Arbitrage (no acquisition) */}
                      {!(
                        state.operationType === "Rental Arbitrage" &&
                        (state.propertyType === "Office" ||
                          state.propertyType === "Retail")
                      ) && (
                        <TextField
                          fullWidth
                          label="Closing Costs"
                          value={state.loan.closingCosts || 0}
                          onChange={(e) =>
                            updateLoan(
                              "closingCosts",
                              parseCurrencyWithValidation(
                                e.target.value,
                                "Closing Costs",
                                setState,
                              ),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      <TextField
                        fullWidth
                        label={
                          state.operationType === "Rental Arbitrage" &&
                          (state.propertyType === "Office" ||
                            state.propertyType === "Retail")
                            ? "Tenant Improvements (TI) / Build-out"
                            : "Rehab Costs"
                        }
                        value={state.loan.rehabCosts || 0}
                        onChange={(e) =>
                          updateLoan(
                            "rehabCosts",
                            parseCurrencyWithValidation(
                              e.target.value,
                              "Rehab Costs",
                              setState,
                            ),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  {/* STR/Rental Arbitrage Specific Costs */}
                  {(state.operationType === "Short Term Rental" ||
                    state.operationType === "Rental Arbitrage") && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, color: brandColors.neutral.dark }}
                      >
                        Property Preparation Costs
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label={
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                              ? "FF&E"
                              : "Repairs"
                          }
                          value={state.arbitrage?.estimateCostOfRepairs || 0}
                          onChange={(e) =>
                            updateArbitrage(
                              "estimateCostOfRepairs",
                              parseCurrencyWithValidation(
                                e.target.value,
                                "Repairs/FF&E",
                                setState,
                              ),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label={
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                              ? "Tenant Improvements (TI) / Build-out"
                              : "Renovation"
                          }
                          value={state.loan.rehabCosts || 0}
                          onChange={(e) =>
                            updateLoan(
                              "rehabCosts",
                              parseCurrencyWithValidation(
                                e.target.value,
                                "Rehab Costs",
                                setState,
                              ),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label={
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                              ? "Signage / Permits"
                              : "Furniture"
                          }
                          value={state.arbitrage?.furnitureCost || 0}
                          onChange={(e) =>
                            updateArbitrage(
                              "furnitureCost",
                              parseCurrencyWithValidation(
                                e.target.value,
                                "Furniture/Signage",
                                setState,
                              ),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label={
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                              ? "Misc. Startup Costs"
                              : "Bedding"
                          }
                          value={state.arbitrage?.otherStartupCosts || 0}
                          onChange={(e) =>
                            updateArbitrage(
                              "otherStartupCosts",
                              parseCurrencyWithValidation(
                                e.target.value,
                                "Other Startup Costs",
                                setState,
                              ),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        {/* Remove placeholder Improvements for Office/Retail; keep hidden always */}
                      </Box>
                    </Box>
                  )}

                  {/* Rental Arbitrage Specific - Deposit */}
                  {state.operationType === "Rental Arbitrage" && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, color: brandColors.neutral.dark }}
                      >
                        Rental Arbitrage Costs
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Deposit"
                          value={state.arbitrage?.deposit || 0}
                          onChange={(e) =>
                            updateArbitrage(
                              "deposit",
                              parseCurrency(e.target.value),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: brandColors.neutral.light, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral.dark }}>
                    Total Cash Required
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Purchase Price"
                      value={formatCurrency(state.purchasePrice || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Total Additional Costs"
                      value={formatCurrency(
                        (state.operationType === "Rental Arbitrage" &&
                        (state.propertyType === "Office" ||
                          state.propertyType === "Retail")
                          ? 0
                          : state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0) +
                          (state.arbitrage?.estimateCostOfRepairs || 0) +
                          (state.arbitrage?.furnitureCost || 0) +
                          (state.arbitrage?.otherStartupCosts || 0) +
                          (state.arbitrage?.deposit || 0),
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Total Cash Required"
                      value={formatCurrency(
                        (state.purchasePrice || 0) +
                          (state.operationType === "Rental Arbitrage" &&
                          (state.propertyType === "Office" ||
                            state.propertyType === "Retail")
                            ? 0
                            : state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0) +
                          (state.arbitrage?.estimateCostOfRepairs || 0) +
                          (state.arbitrage?.furnitureCost || 0) +
                          (state.arbitrage?.otherStartupCosts || 0) +
                          (state.arbitrage?.deposit || 0),
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {/* Loan & Costs Section - Hidden for Subject To Existing Mortgage, Hybrid, and Cash */}
        {state.offerType !== "Subject To Existing Mortgage" &&
          state.offerType !== "Hybrid" &&
          state.offerType !== "Cash" && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {state.operationType === "Rental Arbitrage"
                      ? "Startup Costs"
                      : "Loan & Costs"}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {state.operationType === "Rental Arbitrage" ? (
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Deposit"
                        value={
                          state.arbitrage?.deposit
                            ? state.arbitrage.deposit.toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) =>
                          updateArbitrage(
                            "deposit",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label={
                          state.propertyType === "Office" ||
                          state.propertyType === "Retail"
                            ? "Tenant Improvements (TI) / Build-out"
                            : "Estimate Cost of Repairs"
                        }
                        value={
                          state.arbitrage?.estimateCostOfRepairs
                            ? state.arbitrage.estimateCostOfRepairs.toLocaleString(
                                "en-US",
                              )
                            : ""
                        }
                        onChange={(e) =>
                          updateArbitrage(
                            "estimateCostOfRepairs",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label={
                          state.propertyType === "Office" ||
                          state.propertyType === "Retail"
                            ? "FF&E"
                            : "Furniture Cost"
                        }
                        value={
                          state.arbitrage?.furnitureCost
                            ? state.arbitrage.furnitureCost.toLocaleString(
                                "en-US",
                              )
                            : ""
                        }
                        onChange={(e) =>
                          updateArbitrage(
                            "furnitureCost",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label={
                          state.propertyType === "Office" ||
                          state.propertyType === "Retail"
                            ? "Signage/Permits/Misc"
                            : "Other Startup Costs"
                        }
                        value={
                          state.arbitrage?.otherStartupCosts
                            ? state.arbitrage.otherStartupCosts.toLocaleString(
                                "en-US",
                              )
                            : ""
                        }
                        onChange={(e) =>
                          updateArbitrage(
                            "otherStartupCosts",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  ) : state.offerType === "Seller Finance" ? (
                    // For seller finance, the dedicated section above handles loan fields
                    <Box sx={{ color: brandColors.neutral.dark }}>
                      Seller Finance terms are configured in the Seller Finance
                      section above.
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Down Payment"
                        value={
                          state.loan.downPayment
                            ? state.loan.downPayment.toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) =>
                          updateLoan(
                            "downPayment",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Interest Rate"
                        value={state.loan.annualInterestRate}
                        onChange={(e) =>
                          updateLoan(
                            "annualInterestRate",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Amortization Years"
                        type="number"
                        value={state.loan.amortizationYears}
                        onChange={(e) =>
                          updateLoan(
                            "amortizationYears",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                      <TextField
                        fullWidth
                        label="Closing Costs"
                        value={
                          state.loan.closingCosts
                            ? state.loan.closingCosts.toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) =>
                          updateLoan(
                            "closingCosts",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Card>
          )}

        {/* Amortization Schedule Section - Hidden by finance types unless override enabled */}
        {state.operationType !== "Rental Arbitrage" &&
          (state.showAmortizationOverride ||
            (state.offerType !== "Subject To Existing Mortgage" &&
              state.offerType !== "Hybrid" &&
              state.offerType !== "Cash")) && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Amortization Schedule
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!state.showAmortizationOverride}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              showAmortizationOverride: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Show regardless of Finance Type"
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          100,
                          ((state.loan.amortizationYears * 12) / 600) * 100,
                        )}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>

                    <Box sx={{ overflowX: "auto" }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Interest</TableCell>
                            <TableCell>Principal</TableCell>
                            <TableCell>Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {buildAmortization(
                            state.loan.loanAmount,
                            state.loan.annualInterestRate,
                            state.loan.amortizationYears,
                            state.loan.interestOnly,
                          ).map((row) => (
                            <TableRow key={row.index}>
                              <TableCell>{row.index}</TableCell>
                              <TableCell>
                                {formatCurrency(row.payment)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(row.interest)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(row.principal)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(row.balance)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>

                    <Typography
                      variant="caption"
                      align="center"
                      sx={{ color: brandColors.neutral.dark }}
                    >
                      Showing {state.loan.amortizationYears * 12} payments over{" "}
                      {state.loan.amortizationYears} years
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Card>
          )}

        {/* Appreciation Calculator Section */}
        {state.operationType !== "Rental Arbitrage" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>
                  Appreciation Calculator
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Balloon Payment Integration Indicator */}
                {state.offerType &&
                  [
                    "Seller Finance",
                    "Subject To Existing Mortgage",
                    "Hybrid",
                  ].includes(state.offerType) &&
                  (state.loan?.balloonDue > 0 ||
                    state.subjectTo?.loans?.some(
                      (loan) => loan.balloonDue > 0,
                    ) ||
                    state.hybrid?.balloonDue > 0 ||
                    state.hybrid?.subjectToLoans?.some(
                      (loan) => loan.balloonDue > 0,
                    )) && (
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        bgcolor: state.appreciation?.manuallyOverridden
                          ? brandColors.backgrounds.success
                          : brandColors.backgrounds.warning,
                        borderRadius: 1,
                        border: `1px solid ${state.appreciation?.manuallyOverridden ? brandColors.accent.success : brandColors.accent.warning}`,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: state.appreciation?.manuallyOverridden
                            ? brandColors.accent.success
                            : brandColors.neutral.dark,
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        Balloon Payment Integration{" "}
                        {state.appreciation?.manuallyOverridden
                          ? "Overridden"
                          : "Active"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: state.appreciation?.manuallyOverridden
                            ? brandColors.accent.success
                            : brandColors.neutral.dark,
                          fontSize: "0.875rem",
                        }}
                      >
                        {state.appreciation?.manuallyOverridden
                          ? 'You have manually overridden the automatic "Years to Hold" setting. The field now operates independently of balloon payment terms.'
                          : '"Years to Hold" has been automatically set based on your balloon payment due date to ensure your appreciation analysis aligns with your financing timeline.'}
                      </Typography>
                    </Box>
                  )}

                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Annual Appreciation %"
                    value={state.appreciation?.appreciationPercentPerYear}
                    onChange={(e) =>
                      updateAppreciation(
                        "appreciationPercentPerYear",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Years to Hold"
                    type="number"
                    value={state.appreciation?.yearsOfAppreciation}
                    onChange={(e) =>
                      updateAppreciation(
                        "yearsOfAppreciation",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    helperText={
                      state.appreciation?.manuallyOverridden
                        ? "Manually overridden - you can adjust this value independently of balloon payment terms"
                        : state.offerType &&
                            [
                              "Seller Finance",
                              "Subject To Existing Mortgage",
                              "Hybrid",
                            ].includes(state.offerType) &&
                            (state.loan?.balloonDue > 0 ||
                              state.subjectTo?.loans?.some(
                                (loan) => loan.balloonDue > 0,
                              ) ||
                              state.hybrid?.balloonDue > 0 ||
                              state.hybrid?.subjectToLoans?.some(
                                (loan) => loan.balloonDue > 0,
                              ))
                          ? `Auto-set based on balloon payment due date`
                          : "Number of years to hold the property for appreciation analysis"
                    }
                  />
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: brandColors.neutral.light, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral.dark }}>
                    Auto-calculated Results
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Future Value"
                      value={formatCurrency(
                        state.appreciation?.futurePropertyValue || 0,
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Total Appreciation"
                      value={formatCurrency(
                        (state.appreciation?.futurePropertyValue || 0) -
                          state.purchasePrice,
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                </Box>

                {/* Refinance Subsection */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid #bdbdbd",
                    bgcolor: "inherit",
                  }}
                  style={{ backgroundColor: brandColors.neutral.light }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, color: brandColors.neutral.dark, fontWeight: 600 }}
                  >
                    Refinance Analysis (70% LTV Constraint)
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Refinance LTV %"
                      value={state.appreciation?.refinanceLtv || 70}
                      onChange={(e) =>
                        updateAppreciation(
                          "refinanceLtv",
                          parseCurrency(e.target.value),
                        )
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      helperText="Maximum loan-to-value ratio for refinancing"
                    />
                    <TextField
                      fullWidth
                      label="Current Loan Balance"
                      value={formatCurrency(state.loan?.loanAmount || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                      helperText="Current outstanding loan amount"
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 1,
                      border: "1px solid brandColors.text.disabled",
                      bgcolor: "inherit",
                    }}
                    style={{ backgroundColor: "#eeeeee" }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral.dark, fontWeight: 600 }}
                    >
                      Refinance Potential
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Maximum Refinance Loan"
                        value={formatCurrency(
                          (state.appreciation?.futurePropertyValue || 0) *
                            ((state.appreciation?.refinanceLtv || 70) / 100),
                        )}
                        InputProps={{
                          readOnly: true,
                        }}
                        helperText="Maximum loan amount based on future value and LTV"
                      />
                      <TextField
                        fullWidth
                        label="Equity Available for Cash-Out"
                        value={formatCurrency(
                          calculateRefinancePotential(
                            state.appreciation?.futurePropertyValue || 0,
                            state.loan?.loanAmount || 0,
                            state.appreciation?.refinanceLtv || 70,
                          ),
                        )}
                        InputProps={{
                          readOnly: true,
                        }}
                        helperText="Cash you can pull out after refinancing"
                      />
                    </Box>

                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid #757575",
                        bgcolor: "inherit",
                      }}
                      style={{ backgroundColor: brandColors.borders.secondary }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, color: brandColors.neutral.dark, fontWeight: 600 }}
                      >
                        Refinance Timing
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Years Until Refinance Possible"
                          value={
                            state.appreciation?.futurePropertyValue > 0 &&
                            state.loan?.loanAmount > 0
                              ? calculateYearsUntilRefinance(
                                  state.loan.loanAmount,
                                  state.purchasePrice,
                                  state.appreciation.appreciationPercentPerYear,
                                  state.appreciation.refinanceLtv,
                                )
                              : "N/A"
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                          helperText="Years needed for property value to support refinancing"
                        />
                        <TextField
                          fullWidth
                          label="Remaining Balance After Refi"
                          value={formatCurrency(
                            (state.appreciation?.futurePropertyValue || 0) *
                              ((state.appreciation?.refinanceLtv || 70) / 100),
                          )}
                          InputProps={{
                            readOnly: true,
                          }}
                          helperText="New loan balance after refinancing"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}
        {/* Income Section */}
        {state.operationType !== "Fix & Flip" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Income</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Property Configuration (Units) */}
                  {(state.propertyType === "Multi Family" ||
                    state.propertyType === "Hotel") && (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        sx={{ width: "200px" }}
                        label="Number of Units"
                        type="number"
                        value={
                          state.propertyType === "Hotel"
                            ? state.str?.unitDailyRents.length
                            : state.multi?.unitRents.length
                        }
                        onChange={(e) => {
                          const count = Math.max(
                            1,
                            parseInt(e.target.value) || 1,
                          );
                          if (state.propertyType === "Hotel") {
                            const newRents = Array(count)
                              .fill(0)
                              .map((_, i) => state.str?.unitDailyRents[i] || 0);
                            updateStr("unitDailyRents", newRents);
                          } else {
                            const newRents = Array(count)
                              .fill(0)
                              .map((_, i) => state.multi?.unitRents[i] || 0);
                            updateMulti("unitRents", newRents);
                          }
                        }}
                      />
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(250px, 1fr))",
                        }}
                      >
                        {(state.propertyType === "Hotel"
                          ? state.str?.unitDailyRents
                          : state.multi?.unitRents
                        )?.map((rent, index) => (
                          <TextField
                            key={index}
                            fullWidth
                            label={`Unit ${index + 1} ${state.propertyType === "Hotel" || state.operationType === "Short Term Rental" ? "Nightly Rate" : "Monthly Rent"}`}
                            value={rent}
                            onChange={(e) => {
                              if (state.propertyType === "Hotel") {
                                const newRents = [
                                  ...(state.str?.unitDailyRents || []),
                                ];
                                newRents[index] = parseCurrency(e.target.value);
                                updateStr("unitDailyRents", newRents);
                              } else {
                                const newRents = [
                                  ...(state.multi?.unitRents || []),
                                ];
                                newRents[index] = parseCurrency(e.target.value);
                                updateMulti("unitRents", newRents);
                              }
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Short Term Income Fields (STR, Arbitrage, Hotel) - hidden for Land and for Office/Retail */}
                  {state.propertyType !== "Land" &&
                    state.propertyType !== "Office" &&
                    state.propertyType !== "Retail" &&
                    (state.propertyType === "Hotel" ||
                      state.operationType === "Short Term Rental" ||
                      state.operationType === "Rental Arbitrage") && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {/* Single Family Nightly Rate */}
                        {state.propertyType === "Single Family" && (
                          <Box
                            sx={{
                              display: "grid",
                              gap: 2,
                              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            }}
                          >
                            <TextField
                              fullWidth
                              label="Nightly Rate"
                              value={state.str?.unitDailyRents[0]}
                              onChange={(e) => {
                                const newRents = [
                                  ...(state.str?.unitDailyRents || []),
                                ];
                                newRents[0] = parseCurrency(e.target.value);
                                updateStr("unitDailyRents", newRents);
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        )}

                        {/* Common Short Term Income Fields */}
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Average Nights/Month"
                            type="number"
                            value={state.str?.avgNightsPerMonth}
                            onChange={(e) =>
                              updateStr(
                                "avgNightsPerMonth",
                                parseInt(e.target.value) || 0,
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            label="Daily Cleaning Fee"
                            value={state.str?.dailyCleaningFee}
                            onChange={(e) =>
                              updateStr(
                                "dailyCleaningFee",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Additional Guest Fee (Monthly)"
                            value={state.str?.laundry}
                            onChange={(e) =>
                              updateStr(
                                "laundry",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Laundry (Monthly)"
                            value={state.str?.laundry}
                            onChange={(e) =>
                              updateStr(
                                "laundry",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Experiences (Monthly)"
                            value={state.str?.activities}
                            onChange={(e) =>
                              updateStr(
                                "activities",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Extra Monthly Income"
                            value={state.str?.grossMonthlyIncome}
                            onChange={(e) =>
                              updateStr(
                                "grossMonthlyIncome",
                                parseCurrency(e.target.value),
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                  {/* Office/Retail Income Fields */}
                  {(state.propertyType === "Office" ||
                    state.propertyType === "Retail") && (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark }}>
                        {state.propertyType} Income Inputs
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(3, 1fr)",
                          },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Square Footage"
                          type="number"
                          value={state.officeRetail?.squareFootage ?? 0}
                          onChange={(e) =>
                            updateOfficeRetail(
                              "squareFootage",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                        <TextField
                          fullWidth
                          label="Rent per SF (Monthly)"
                          value={state.officeRetail?.rentPerSFMonthly ?? 0}
                          onChange={(e) =>
                            updateOfficeRetail(
                              "rentPerSFMonthly",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Occupancy Rate"
                          value={state.officeRetail?.occupancyRatePct ?? 0}
                          onChange={(e) =>
                            updateOfficeRetail(
                              "occupancyRatePct",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Other Monthly Income"
                          value={state.officeRetail?.extraMonthlyIncome ?? 0}
                          onChange={(e) =>
                            updateOfficeRetail(
                              "extraMonthlyIncome",
                              parseCurrency(e.target.value),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Land Income Fields */}
                  {state.propertyType === "Land" && (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark }}>
                        Land Inputs
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(3, 1fr)",
                          },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Acreage"
                          type="number"
                          value={state.land?.acreage ?? 0}
                          onChange={(e) =>
                            updateLand(
                              "acreage",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                        <FormControl fullWidth>
                          <InputLabel>Zoning</InputLabel>
                          <Select
                            value={state.land?.zoning ?? "Residential"}
                            label="Zoning"
                            onChange={(e) =>
                              updateLand(
                                "zoning",
                                e.target.value as LandInputs["zoning"],
                              )
                            }
                          >
                            <MenuItem value="Residential">Residential</MenuItem>
                            <MenuItem value="Commercial">Commercial</MenuItem>
                            <MenuItem value="Agricultural">
                              Agricultural
                            </MenuItem>
                            <MenuItem value="Mixed">Mixed</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          label="Other Monthly Income"
                          value={state.land?.extraMonthlyIncome ?? 0}
                          onChange={(e) =>
                            updateLand(
                              "extraMonthlyIncome",
                              parseCurrency(e.target.value),
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Extra Income - Always shown at bottom */}
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr" },
                    }}
                  >
                    {state.propertyType === "Single Family" ? (
                      <TextField
                        fullWidth
                        label="Monthly Rent"
                        value={state.sfr?.monthlyRent}
                        onChange={(e) =>
                          updateSfr(
                            "monthlyRent",
                            parseCurrency(e.target.value),
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Extra Monthly Income"
                        value={
                          state.propertyType === "Multi Family"
                            ? state.multi?.grossMonthlyIncome
                            : state.propertyType === "Office" ||
                                state.propertyType === "Retail"
                              ? state.officeRetail?.extraMonthlyIncome
                              : state.propertyType === "Land"
                                ? state.land?.extraMonthlyIncome
                                : state.str?.grossMonthlyIncome
                        }
                        onChange={(e) => {
                          const value = parseCurrency(e.target.value);
                          if (state.propertyType === "Multi Family") {
                            updateMulti("grossMonthlyIncome", value);
                          } else if (
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                          ) {
                            updateOfficeRetail("extraMonthlyIncome", value);
                          } else if (state.propertyType === "Land") {
                            updateLand("extraMonthlyIncome", value);
                          } else {
                            updateStr("grossMonthlyIncome", value);
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {/* Operating Expenses Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>
                Operating Expenses
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral.dark }}>
                Fixed Monthly Expenses
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                }}
              >
                <TextField
                  fullWidth
                  label="Taxes"
                  value={
                    state.ops.taxes
                      ? state.ops.taxes.toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) =>
                    updateOps("taxes", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Insurance"
                  value={
                    state.ops.insurance
                      ? state.ops.insurance.toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) =>
                    updateOps("insurance", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="HOA"
                  value={
                    state.ops.hoa ? state.ops.hoa.toLocaleString("en-US") : ""
                  }
                  onChange={(e) =>
                    updateOps("hoa", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Gas & Electric"
                  value={
                    state.ops.gasElectric
                      ? state.ops.gasElectric.toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) =>
                    updateOps("gasElectric", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Internet"
                  value={
                    state.ops.internet
                      ? state.ops.internet.toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) =>
                    updateOps("internet", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Water & Sewer"
                  value={
                    state.ops.waterSewer
                      ? state.ops.waterSewer.toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) =>
                    updateOps("waterSewer", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Heat"
                  value={state.ops.heat}
                  onChange={(e) =>
                    updateOps("heat", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Lawn & Snow"
                  value={state.ops.lawnSnow}
                  onChange={(e) =>
                    updateOps("lawnSnow", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Bill"
                  value={state.ops.phoneBill}
                  onChange={(e) =>
                    updateOps("phoneBill", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Cleaner"
                  value={state.ops.cleaner}
                  onChange={(e) =>
                    updateOps("cleaner", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                {state.operationType === "Rental Arbitrage" && (
                  <TextField
                    fullWidth
                    label="Monthly Rent to Landlord"
                    value={state.ops.monthlyRentToLandlord}
                    onChange={(e) =>
                      updateOps(
                        "monthlyRentToLandlord",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                )}
                <TextField
                  fullWidth
                  label="Extra Expenses"
                  value={state.ops.extra}
                  onChange={(e) =>
                    updateOps("extra", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ mt: 4, mb: 2, color: brandColors.neutral.dark }}
              >
                Variable Expenses (% of Income)
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                }}
              >
                <TextField
                  fullWidth
                  label="Maintenance %"
                  value={state.ops.maintenance}
                  onChange={(e) =>
                    updateOps("maintenance", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Vacancy %"
                  value={state.ops.vacancy}
                  onChange={(e) =>
                    updateOps("vacancy", parseCurrency(e.target.value))
                  }
                  helperText={
                    state.operationType === "Fix & Flip" &&
                    state.fixFlip?.holdingPeriodMonths
                      ? `Auto-calculated based on ${state.fixFlip.holdingPeriodMonths} month holding period (${calculateFixFlipVacancyRate(state.fixFlip.holdingPeriodMonths)}%)`
                      : "Percentage of income lost due to vacancy"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Management %"
                  value={state.ops.management}
                  onChange={(e) =>
                    updateOps("management", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="CapEx %"
                  value={state.ops.capEx}
                  onChange={(e) =>
                    updateOps("capEx", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="OpEx %"
                  value={state.ops.opEx}
                  onChange={(e) =>
                    updateOps("opEx", parseCurrency(e.target.value))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Pro Forma Presets - Hidden for Fix & Flip operations */}
        {state.operationType !== "Fix & Flip" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Pro Forma Analysis
                  </Typography>
                  <Chip
                    label="Premium Feature"
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Section Description */}
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f0f4ff",
                      borderRadius: 1,
                      border: "1px solid brandColors.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.primary, fontWeight: 500 }}
                    >
                      <strong>
                        Financial Projections & Cash Flow Analysis:
                      </strong>{" "}
                      Create detailed pro forma statements, analyze cash flow
                      scenarios, perform sensitivity analysis, and compare
                      against industry benchmarks.
                    </Typography>
                  </Box>

                  {/* Tab Navigation */}
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={state.activeProFormaTab}
                      onChange={(_, newValue) => {
                        console.log("Tab changed to:", newValue); // Debug logging
                        setState((prev) => ({
                          ...prev,
                          activeProFormaTab: newValue,
                        }));
                        // If switching to presets tab, apply moderate preset
                        if (newValue === "presets") {
                          applyProFormaPreset("moderate");
                        }
                      }}
                      sx={{
                        minHeight: "auto",
                        "& .MuiTab-root": {
                          minWidth: "auto",
                          px: 2,
                          py: 1,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textTransform: "none",
                          color: brandColors.neutral.dark,
                          "&.Mui-selected": {
                            color: brandColors.primary,
                            fontWeight: 700,
                            backgroundColor: "#f0f4ff",
                            borderRadius: "4px 4px 0 0",
                          },
                          "&:hover": {
                            backgroundColor: brandColors.backgrounds.secondary,
                            color: brandColors.primary,
                          },
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: brandColors.primary,
                          height: 3,
                        },
                      }}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Presets" value="presets" />
                      <Tab label="Custom" value="custom" />
                      <Tab label="Sensitivity" value="sensitivity" />
                      <Tab label="Benchmarks" value="benchmarks" />
                      {shouldShowAdrTabs(state) && (
                        <>
                          <Tab
                            label="Revenue"
                            value="revenue"
                            onClick={() => {
                              setState((prev) => ({
                                ...prev,
                                activeProFormaTab: "revenue",
                              }));
                            }}
                          />
                          <Tab
                            label="Break-Even"
                            value="breakEven"
                            onClick={() => {
                              setState((prev) => ({
                                ...prev,
                                activeProFormaTab: "breakEven",
                              }));
                            }}
                          />
                        </>
                      )}
                    </Tabs>

                    {/* Guidance message when ADR tabs are not visible */}
                    {!shouldShowAdrTabs(state) &&
                      getAdrTabsVisibilityReason() && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 2,
                            backgroundColor: brandColors.backgrounds.secondary,
                            borderRadius: 1,
                            border: "1px solid brandColors.borders.secondary",
                            fontSize: "0.875rem",
                            color: brandColors.neutral.dark,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic" }}
                          >
                            {getAdrTabsVisibilityReason()}
                          </Typography>
                        </Box>
                      )}
                  </Box>

                  {/* Presets Tab */}
                  {state.activeProFormaTab === "presets" && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                          mb: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Pro Forma:
                        </Typography>

                        {["conservative", "moderate", "aggressive"].map(
                          (preset) => (
                            <Button
                              key={preset}
                              size="small"
                              variant={
                                state.proFormaPreset === preset
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() =>
                                applyProFormaPreset(
                                  preset as
                                    | "conservative"
                                    | "moderate"
                                    | "aggressive",
                                )
                              }
                              sx={{
                                minWidth: "auto",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                              }}
                            >
                              {preset === "moderate" ? "Moderate" : preset}
                            </Button>
                          ),
                        )}
                      </Box>

                      {/* Current Values Display */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: "0.8rem",
                          color: brandColors.neutral.dark,
                        }}
                      >
                        <Typography>
                          <strong>M:</strong> {state.ops.maintenance}% |
                          <strong> V:</strong> {state.ops.vacancy}% |
                          <strong> Mgmt:</strong> {state.ops.management}% |
                          <strong> CapEx:</strong> {state.ops.capEx}% |
                          <strong> OpEx:</strong> {state.ops.opEx}%
                        </Typography>
                      </Box>

                      {/* Property Type & Operation Type Info */}
                      <Box
                        sx={{
                          fontSize: "0.75rem",
                          color: "#888",
                          fontStyle: "italic",
                        }}
                      >
                        Based on {state.propertyType} + {state.operationType} |
                        {state.proFormaPreset === "conservative"
                          ? " Conservative"
                          : state.proFormaPreset === "moderate"
                            ? " Moderate"
                            : " Aggressive"}{" "}
                        preset applied
                      </Box>
                    </Box>
                  )}

                  {/* Custom Tab */}
                  {state.activeProFormaTab === "custom" && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Custom Pro Forma Values:
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const name = prompt("Enter preset name:");
                            if (name && name.trim()) {
                              const description = prompt(
                                "Enter description (optional):",
                              );
                              saveCustomPreset(
                                name.trim(),
                                description || undefined,
                              );
                              // Show success message
                              alert(
                                `Preset "${name.trim()}" saved successfully!`,
                              );
                            }
                          }}
                        >
                          Save Current
                        </Button>
                      </Box>

                      {/* Pro Forma Input Fields */}
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(auto-fit, minmax(200px, 1fr))",
                          },
                          mb: 3,
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Maintenance %"
                          type="number"
                          value={state.ops.maintenance}
                          onChange={(e) =>
                            updateOps(
                              "maintenance",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                        <TextField
                          fullWidth
                          label="Vacancy %"
                          type="number"
                          value={state.ops.vacancy}
                          onChange={(e) =>
                            updateOps(
                              "vacancy",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                        <TextField
                          fullWidth
                          label="Management %"
                          type="number"
                          value={state.ops.management}
                          onChange={(e) =>
                            updateOps(
                              "management",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                        <TextField
                          fullWidth
                          label="CapEx %"
                          type="number"
                          value={state.ops.capEx}
                          onChange={(e) =>
                            updateOps("capEx", parseFloat(e.target.value) || 0)
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                        <TextField
                          fullWidth
                          label="OpEx %"
                          type="number"
                          value={state.ops.opEx}
                          onChange={(e) =>
                            updateOps("opEx", parseFloat(e.target.value) || 0)
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                      </Box>

                      {/* Current Values Summary */}
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: brandColors.neutral.light,
                          borderRadius: 1,
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: brandColors.neutral.dark, mb: 1 }}
                        >
                          <strong>Current Pro Forma Values:</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          Total Variable:{" "}
                          {computeVariableMonthlyOpsPct(state.ops)}% | Fixed: $
                          {computeFixedMonthlyOps(state.ops).toLocaleString()}
                          /month
                        </Typography>
                      </Box>

                      {/* Custom Presets List */}
                      {state.customProFormaPresets.length > 0 && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                          >
                            Saved Custom Presets:
                          </Typography>
                          <Box
                            sx={{
                              display: "grid",
                              gap: 1,
                              gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(auto-fit, minmax(250px, 1fr))",
                              },
                            }}
                          >
                            {state.customProFormaPresets.map((preset) => (
                              <Card
                                key={preset.id}
                                variant="outlined"
                                sx={{ p: 2, position: "relative" }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 700 }}
                                  >
                                    {preset.name}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      deleteCustomPreset(preset.id)
                                    }
                                    sx={{ color: "#d32f2f" }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                {preset.description && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: brandColors.neutral.dark,
                                      mb: 1,
                                      display: "block",
                                    }}
                                  >
                                    {preset.description}
                                  </Typography>
                                )}
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#888" }}
                                >
                                  M: {preset.maintenance}% | V: {preset.vacancy}
                                  % | Mgmt: {preset.management}% | CapEx:{" "}
                                  {preset.capEx}% | OpEx: {preset.opEx}%
                                </Typography>
                                <Button
                                  size="small"
                                  variant={
                                    state.selectedCustomPreset === preset.id
                                      ? "contained"
                                      : "outlined"
                                  }
                                  onClick={() => applyCustomPreset(preset.id)}
                                  sx={{ mt: 1, fontSize: "0.7rem" }}
                                >
                                  {state.selectedCustomPreset === preset.id
                                    ? "Applied"
                                    : "Apply"}
                                </Button>
                              </Card>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {state.customProFormaPresets.length === 0 && (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, fontStyle: "italic" }}
                          >
                            No custom presets saved yet. Adjust the values above
                            and use the "Save Current" button to save your
                            custom Pro Forma settings.
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#999", mt: 1, display: "block" }}
                          >
                            Debug: {state.customProFormaPresets.length} presets
                            in state
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Sensitivity Analysis Tab */}
                  {state.activeProFormaTab === "sensitivity" && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Sensitivity Analysis:
                        </Typography>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography variant="body2">
                            Range: ±{state.sensitivityAnalysis.sensitivityRange}
                            %
                          </Typography>
                          <Slider
                            value={state.sensitivityAnalysis.sensitivityRange}
                            onChange={(_, value) =>
                              setState((prev) => ({
                                ...prev,
                                sensitivityAnalysis: {
                                  ...prev.sensitivityAnalysis,
                                  sensitivityRange: value as number,
                                },
                              }))
                            }
                            min={10}
                            max={50}
                            step={5}
                            sx={{ width: 100 }}
                          />
                          <Typography variant="body2">
                            Steps: {state.sensitivityAnalysis.sensitivitySteps}
                          </Typography>
                          <Slider
                            value={state.sensitivityAnalysis.sensitivitySteps}
                            onChange={(_, value) =>
                              setState((prev) => ({
                                ...prev,
                                sensitivityAnalysis: {
                                  ...prev.sensitivityAnalysis,
                                  sensitivitySteps: value as number,
                                },
                              }))
                            }
                            min={3}
                            max={9}
                            step={1}
                            sx={{ width: 100 }}
                          />
                        </Box>

                        <Table
                          size="small"
                          sx={{ border: 1, borderColor: brandColors.borders.secondary }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Scenario</TableCell>
                              <TableCell>Maintenance</TableCell>
                              <TableCell>Vacancy</TableCell>
                              <TableCell>Management</TableCell>
                              <TableCell>CapEx</TableCell>
                              <TableCell>OpEx</TableCell>
                              <TableCell>Monthly CF</TableCell>
                              <TableCell>Annual CF</TableCell>
                              <TableCell>CoC Return</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {calculateSensitivityAnalysis().map((row, i) => (
                              <TableRow
                                key={i}
                                sx={{
                                  backgroundColor:
                                    row.multiplier === "100%"
                                      ? brandColors.neutral.light
                                      : "inherit",
                                  fontWeight:
                                    row.multiplier === "100%"
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                <TableCell>{row.multiplier}</TableCell>
                                <TableCell>{row.maintenance}%</TableCell>
                                <TableCell>{row.vacancy}%</TableCell>
                                <TableCell>{row.management}%</TableCell>
                                <TableCell>{row.capEx}%</TableCell>
                                <TableCell>{row.opEx}%</TableCell>
                                <TableCell>
                                  {formatCurrency(row.monthlyCashFlow)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(row.annualCashFlow)}
                                </TableCell>
                                <TableCell>{row.cashOnCash}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Box>
                  )}

                  {/* Benchmark Comparison Tab */}
                  {state.activeProFormaTab === "benchmarks" && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Industry Benchmarks:
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: brandColors.neutral.dark, mb: 2 }}
                        >
                          Comparing your assumptions to industry averages for{" "}
                          {state.propertyType} + {state.operationType}
                        </Typography>

                        <Table
                          size="small"
                          sx={{ border: 1, borderColor: brandColors.borders.secondary }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Category</TableCell>
                              <TableCell>Your %</TableCell>
                              <TableCell>Industry Avg</TableCell>
                              <TableCell>Variance</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(compareToBenchmarks()).map(
                              ([category, data]) => (
                                <TableRow key={category}>
                                  <TableCell
                                    sx={{ textTransform: "capitalize" }}
                                  >
                                    {category}
                                  </TableCell>
                                  <TableCell>{data.current}%</TableCell>
                                  <TableCell>{data.benchmark}%</TableCell>
                                  <TableCell
                                    sx={{
                                      color:
                                        data.variance > 0
                                          ? "#d32f2f"
                                          : brandColors.accent.success,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {data.variance > 0 ? "+" : ""}
                                    {data.variancePct}%
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={
                                        data.variance > 0
                                          ? "Above Avg"
                                          : "Below Avg"
                                      }
                                      size="small"
                                      color={
                                        data.variance > 0
                                          ? "warning"
                                          : "success"
                                      }
                                      variant="outlined"
                                    />
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>

                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: brandColors.neutral.light,
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                            <strong>Note:</strong> Industry benchmarks are based
                            on aggregated data from real estate professionals.
                            Your specific market conditions may vary
                            significantly.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Revenue Analysis Tab - gated by ADR predicate */}
                  {shouldShowAdrTabs(state) &&
                    state.activeProFormaTab === "revenue" && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 600, color: brandColors.primary }}
                          >
                            Revenue Projections:
                          </Typography>
                        </Box>

                        {/* Revenue Input Fields */}
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "repeat(auto-fit, minmax(200px, 1fr))",
                            },
                            mb: 3,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Total Rooms"
                            type="number"
                            value={state.revenueInputs.totalRooms}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                revenueInputs: {
                                  ...prev.revenueInputs,
                                  totalRooms: parseInt(e.target.value) || 1,
                                },
                              }))
                            }
                            inputProps={{ min: 1, max: 1000 }}
                          />
                          <TextField
                            fullWidth
                            label="Average Daily Rate ($)"
                            type="number"
                            value={state.revenueInputs.averageDailyRate}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                revenueInputs: {
                                  ...prev.revenueInputs,
                                  averageDailyRate:
                                    parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{ min: 0, step: 1 }}
                          />
                          <TextField
                            fullWidth
                            label="Base Occupancy Rate (%)"
                            type="number"
                            value={state.revenueInputs.occupancyRate}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                revenueInputs: {
                                  ...prev.revenueInputs,
                                  occupancyRate:
                                    parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                          />
                          <TextField
                            fullWidth
                            label="Fixed Annual Costs ($)"
                            type="number"
                            value={state.revenueInputs.fixedAnnualCosts}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                revenueInputs: {
                                  ...prev.revenueInputs,
                                  fixedAnnualCosts:
                                    parseFloat(e.target.value) || 0,
                                  fixedMonthlyCosts:
                                    (parseFloat(e.target.value) || 0) / 12,
                                },
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{ min: 0, step: 1000 }}
                          />
                        </Box>

                        {/* Seasonal Variations */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                          >
                            Seasonal Occupancy Multipliers:
                          </Typography>
                          <Box
                            sx={{
                              display: "grid",
                              gap: 2,
                              gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(auto-fit, minmax(150px, 1fr))",
                              },
                            }}
                          >
                            <TextField
                              fullWidth
                              label="Q1 (Winter)"
                              type="number"
                              value={state.revenueInputs.seasonalVariations.q1}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  revenueInputs: {
                                    ...prev.revenueInputs,
                                    seasonalVariations: {
                                      ...prev.revenueInputs.seasonalVariations,
                                      q1: parseFloat(e.target.value) || 1,
                                    },
                                  },
                                }))
                              }
                              inputProps={{ min: 0, max: 3, step: 0.1 }}
                            />
                            <TextField
                              fullWidth
                              label="Q2 (Spring)"
                              type="number"
                              value={state.revenueInputs.seasonalVariations.q2}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  revenueInputs: {
                                    ...prev.revenueInputs,
                                    seasonalVariations: {
                                      ...prev.revenueInputs.seasonalVariations,
                                      q2: parseFloat(e.target.value) || 1,
                                    },
                                  },
                                }))
                              }
                              inputProps={{ min: 0, max: 3, step: 0.1 }}
                            />
                            <TextField
                              fullWidth
                              label="Q3 (Summer)"
                              type="number"
                              value={state.revenueInputs.seasonalVariations.q3}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  revenueInputs: {
                                    ...prev.revenueInputs,
                                    seasonalVariations: {
                                      ...prev.revenueInputs.seasonalVariations,
                                      q3: parseFloat(e.target.value) || 1,
                                    },
                                  },
                                }))
                              }
                              inputProps={{ min: 0, max: 3, step: 0.1 }}
                            />
                            <TextField
                              fullWidth
                              label="Q4 (Fall)"
                              type="number"
                              value={state.revenueInputs.seasonalVariations.q4}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  revenueInputs: {
                                    ...prev.revenueInputs,
                                    seasonalVariations: {
                                      ...prev.revenueInputs.seasonalVariations,
                                      q4: parseFloat(e.target.value) || 1,
                                    },
                                  },
                                }))
                              }
                              inputProps={{ min: 0, max: 3, step: 0.1 }}
                            />
                          </Box>
                        </Box>

                        {/* Revenue Projections Table */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                          >
                            Revenue Projections (33 Rooms):
                          </Typography>
                          <Table
                            size="small"
                            sx={{ border: 1, borderColor: brandColors.borders.secondary }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Occupancy</TableCell>
                                <TableCell>ADR $50</TableCell>
                                <TableCell>ADR $100</TableCell>
                                <TableCell>ADR $150</TableCell>
                                <TableCell>ADR $200</TableCell>
                                <TableCell>ADR $250</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {[
                                10, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95,
                                100,
                              ].map((occupancy) => (
                                <TableRow key={occupancy}>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    {occupancy}%
                                  </TableCell>
                                  {[50, 100, 150, 200, 250].map((adr) => {
                                    const annualRevenue =
                                      ((state.revenueInputs.totalRooms *
                                        adr *
                                        occupancy) /
                                        100) *
                                      365;
                                    const monthlyRevenue = annualRevenue / 12;
                                    return (
                                      <TableCell key={adr}>
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              display: "block",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            ${annualRevenue.toLocaleString()}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ color: brandColors.neutral.dark }}
                                          >
                                            ${monthlyRevenue.toLocaleString()}
                                            /mo
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>

                        {/* Fixed Costs Summary */}
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: brandColors.neutral.light,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 1 }}
                          >
                            <strong>Fixed Costs Summary:</strong>
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#888" }}>
                            Annual: $
                            {state.revenueInputs.fixedAnnualCosts.toLocaleString()}{" "}
                            | Monthly: $
                            {(
                              state.revenueInputs.fixedAnnualCosts / 12
                            ).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  {/* Break-Even Analysis Tab - gated by ADR predicate */}
                  {shouldShowAdrTabs(state) &&
                    state.activeProFormaTab === "breakEven" && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 600, color: brandColors.primary }}
                          >
                            Break-Even Analysis:
                          </Typography>
                        </Box>

                        {/* Break-Even Calculations */}
                        <Box
                          sx={{
                            display: "grid",
                            gap: 3,
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "repeat(auto-fit, minmax(250px, 1fr))",
                            },
                            mb: 3,
                          }}
                        >
                          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.selected }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: brandColors.actions.primary, mb: 1 }}
                            >
                              Break-Even Occupancy
                            </Typography>
                            <Typography variant="h6" sx={{ color: brandColors.actions.primary }}>
                              {calculateBreakEvenOccupancy().toFixed(1)}%
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: brandColors.neutral.dark }}
                            >
                              Minimum occupancy needed to cover costs
                            </Typography>
                          </Card>

                          <Card sx={{ p: 2, backgroundColor: "#f3e5f5" }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: "#7b1fa2", mb: 1 }}
                            >
                              Break-Even ADR
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#7b1fa2" }}>
                              ${calculateBreakEvenADR().toFixed(0)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: brandColors.neutral.dark }}
                            >
                              Minimum daily rate needed to cover costs
                            </Typography>
                          </Card>

                          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.success }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: "#388e3c", mb: 1 }}
                            >
                              Margin of Safety
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#388e3c" }}>
                              {calculateMarginOfSafety().toFixed(1)}%
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: brandColors.neutral.dark }}
                            >
                              Current occupancy above break-even
                            </Typography>
                          </Card>
                        </Box>

                        {/* Break-Even Table */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                          >
                            Break-Even Analysis by Occupancy:
                          </Typography>
                          <Table
                            size="small"
                            sx={{ border: 1, borderColor: brandColors.borders.secondary }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Occupancy</TableCell>
                                <TableCell>Revenue</TableCell>
                                <TableCell>Fixed Costs</TableCell>
                                <TableCell>Variable Costs</TableCell>
                                <TableCell>Net Income</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(
                                (occupancy) => {
                                  const revenue =
                                    ((state.revenueInputs.totalRooms *
                                      state.revenueInputs.averageDailyRate *
                                      occupancy) /
                                      100) *
                                    365;
                                  const fixedCosts =
                                    state.revenueInputs.fixedAnnualCosts;
                                  // Use centralized utility function to eliminate redundant calculation
                                  const variableCosts =
                                    (revenue *
                                      computeVariableMonthlyOpsPct(state.ops)) /
                                    100;
                                  const netIncome =
                                    revenue - fixedCosts - variableCosts;
                                  const isProfitable = netIncome > 0;

                                  return (
                                    <TableRow
                                      key={occupancy}
                                      sx={{
                                        backgroundColor: isProfitable
                                          ? "#f1f8e9"
                                          : "#ffebee",
                                      }}
                                    >
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        {occupancy}%
                                      </TableCell>
                                      <TableCell>
                                        ${revenue.toLocaleString()}
                                      </TableCell>
                                      <TableCell>
                                        ${fixedCosts.toLocaleString()}
                                      </TableCell>
                                      <TableCell>
                                        ${variableCosts.toLocaleString()}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: isProfitable
                                            ? brandColors.accent.success
                                            : "#d32f2f",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ${netIncome.toLocaleString()}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={
                                            isProfitable ? "Profitable" : "Loss"
                                          }
                                          size="small"
                                          color={
                                            isProfitable ? "success" : "error"
                                          }
                                          variant="outlined"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                },
                              )}
                            </TableBody>
                          </Table>
                        </Box>

                        {/* Pro Forma Integration */}
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "#fff3e0",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#e65100", mb: 1 }}
                          >
                            <strong>Pro Forma Integration:</strong>
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#e65100" }}
                          >
                            Break-even calculations include your current Pro
                            Forma percentages: Total Variable:{" "}
                            {computeVariableMonthlyOpsPct(state.ops)}% | Fixed:
                            $
                            {computeFixedMonthlyOps(state.ops).toLocaleString()}
                            /month
                          </Typography>
                        </Box>
                      </Box>
                    )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}
        {/* Risk Assessment Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>
                  Risk Assessment
                </Typography>
                <Chip
                  label="Premium Feature"
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Section Description */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#fff3e0",
                    borderRadius: 1,
                    border: "1px solid #ffb74d",
                    fontSize: "0.875rem",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#e65100", fontWeight: 500 }}
                  >
                    <strong>Risk Scoring & Mitigation:</strong> Comprehensive
                    risk assessment across market, property, tenant, and
                    financing factors with actionable recommendations for risk
                    mitigation.
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Overall Risk Score:
                  </Typography>
                  {state.riskScoreResults ? (
                    <>
                      <Chip
                        label={`${state.riskScoreResults.overallRiskScore}/10`}
                        color={
                          state.riskScoreResults.overallRiskScore <= 3
                            ? "success"
                            : state.riskScoreResults.overallRiskScore <= 5
                              ? "warning"
                              : state.riskScoreResults.overallRiskScore <= 7
                                ? "error"
                                : "error"
                        }
                        variant="filled"
                        sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: brandColors.neutral.dark, fontWeight: 500 }}
                      >
                        {state.riskScoreResults.riskCategory}
                      </Typography>
                    </>
                  ) : (
                    <Chip
                      label="Not Calculated"
                      color="default"
                      variant="outlined"
                    />
                  )}
                </Box>

                {state.riskScoreResults && (
                  <>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: brandColors.backgrounds.secondary,
                          borderRadius: 1,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: brandColors.primary, mb: 1 }}
                        >
                          Market Risk
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 600, color: "#e65100" }}
                        >
                          {state.riskScoreResults.riskBreakdown.marketRisk}/10
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: brandColors.backgrounds.secondary,
                          borderRadius: 1,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: brandColors.primary, mb: 1 }}
                        >
                          Property Risk
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 600, color: "#e65100" }}
                        >
                          {state.riskScoreResults.riskBreakdown.propertyRisk}/10
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: brandColors.backgrounds.secondary,
                          borderRadius: 1,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: brandColors.primary, mb: 1 }}
                        >
                          Tenant Risk
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 600, color: "#e65100" }}
                        >
                          {state.riskScoreResults.riskBreakdown.tenantRisk}/10
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: brandColors.backgrounds.secondary,
                          borderRadius: 1,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: brandColors.primary, mb: 1 }}
                        >
                          Financing Risk
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 600, color: "#e65100" }}
                        >
                          {state.riskScoreResults.riskBreakdown.financingRisk}
                          /10
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#fff3e0",
                        borderRadius: 1,
                        border: "1px solid #ffb74d",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#e65100", mb: 1 }}
                      >
                        Key Recommendations:
                      </Typography>
                      {state.riskScoreResults.recommendations
                        .slice(0, 3)
                        .map((rec, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{ mb: 0.5, color: "#bf360c" }}
                          >
                            - {rec}
                          </Typography>
                        ))}
                    </Box>
                  </>
                )}

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const marketConditions = state.marketConditions;
                      const results = calculateRiskScore(
                        state.riskFactors,
                        state.marketConditions,
                        state.propertyAge,
                      );
                      setState((prev) => ({
                        ...prev,
                        riskScoreResults: results,
                      }));
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      "&:hover": { backgroundColor: "#2d3748" },
                    }}
                  >
                    {state.riskScoreResults
                      ? "Recalculate Risk Score"
                      : "Calculate Risk Score"}
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Advanced Analysis Section */}
        {/* Advanced Analysis Summary + CTA */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>
                  Advanced Analysis
                </Typography>
                <Chip
                  label="Premium Feature"
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Section Description */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: brandColors.backgrounds.selected,
                  borderRadius: 1,
                  border: "1px solid brandColors.accent.info",
                  fontSize: "0.875rem",
                  mb: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#1565c0", fontWeight: 500 }}
                >
                  <strong>Advanced Modeling & Specialized Analysis:</strong>{" "}
                  Access sophisticated tools for exit strategies, tax
                  implications, seasonal adjustments, and market analysis beyond
                  basic financial projections.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                {/* Exit Strategies Summary */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: brandColors.backgrounds.secondary,
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
                    Exit Strategies
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: brandColors.primary }}
                  >
                    Available
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.neutral.dark, fontSize: "0.8rem" }}
                  >
                    Refinance, Sale, 1031 Exchange
                  </Typography>
                </Box>

                {/* Tax Implications Summary */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: brandColors.backgrounds.secondary,
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
                    Tax Analysis
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: brandColors.primary }}
                  >
                    Available
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.neutral.dark, fontSize: "0.8rem" }}
                  >
                    Depreciation, deductions, gains
                  </Typography>
                </Box>

                {/* Seasonal Adjustments Summary */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: brandColors.backgrounds.secondary,
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
                    Seasonal Analysis
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: brandColors.primary }}
                  >
                    Available
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.neutral.dark, fontSize: "0.8rem" }}
                  >
                    Monthly occupancy patterns
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  backgroundColor: brandColors.backgrounds.selected,
                  borderRadius: 1,
                  border: "1px solid brandColors.accent.info",
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1565c0", mb: 1 }}
                >
                  Unlock Advanced Modeling & Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 2 }}>
                  Access specialized tools for exit strategies, tax
                  implications, confidence intervals, seasonal adjustments,
                  market analysis, and stress testing - separate from basic
                  financial projections.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Save current deal state to sessionStorage
                    sessionStorage.setItem(
                      "advancedDeal",
                      JSON.stringify(state),
                    );
                    // Navigate to advanced analysis page
                    navigate("/advanced-calculations");
                  }}
                  sx={{
                    backgroundColor: brandColors.primary,
                    "&:hover": { backgroundColor: "#2d3748" },
                  }}
                  startIcon={<TrendingUpIcon />}
                >
                  Open Advanced Modeling
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Fix & Flip Section */}

        {/* Fix & Flip Section */}
        {state.operationType === "Fix & Flip" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Fix & Flip</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  }}
                >
                  <TextField
                    fullWidth
                    label="After Repair Value (ARV)"
                    value={state.fixFlip?.arv}
                    onChange={(e) =>
                      updateFixFlip("arv", parseCurrency(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Months Until Flip"
                    type="number"
                    value={state.fixFlip?.holdingPeriodMonths}
                    onChange={(e) =>
                      updateFixFlip(
                        "holdingPeriodMonths",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                  <TextField
                    fullWidth
                    label="Holding Costs (Monthly)"
                    value={state.fixFlip?.holdingCosts}
                    onChange={(e) =>
                      updateFixFlip(
                        "holdingCosts",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Selling Costs %"
                    value={state.fixFlip?.sellingCostsPercent}
                    onChange={(e) =>
                      updateFixFlip(
                        "sellingCostsPercent",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Target %"
                    value={state.fixFlip?.targetPercent}
                    onChange={(e) =>
                      updateFixFlip(
                        "targetPercent",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Rehab Cost"
                    value={state.fixFlip?.rehabCost}
                    onChange={(e) =>
                      updateFixFlip("rehabCost", parseCurrency(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: brandColors.neutral.light, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral.dark }}>
                    Auto-calculated Results
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Maximum Allowable Offer"
                      value={formatCurrency(
                        state.fixFlip?.maximumAllowableOffer || 0,
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Projected Profit"
                      value={formatCurrency(
                        state.fixFlip?.projectedProfit || 0,
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="ROI During Hold"
                      value={
                        (state.fixFlip?.roiDuringHold || 0).toFixed(1) + "%"
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Annualized ROI"
                      value={
                        (state.fixFlip?.annualizedRoi || 0).toFixed(1) + "%"
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  {/* Exit Strategy Results */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: "#fff3e0",
                      borderRadius: 1,
                      border: "1px solid #ffb74d",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: "#e65100", fontWeight: 600 }}
                    >
                      Exit Strategy Analysis
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(auto-fit, minmax(200px, 1fr))",
                        },
                      }}
                    >
                      {state.fixFlip?.exitStrategies?.map((strategy, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: "#fff",
                            borderRadius: 1,
                            border: "1px solid brandColors.borders.secondary",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: brandColors.primary, mb: 1, fontWeight: 600 }}
                          >
                            {strategy.timeframe} Year Exit
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 0.5 }}
                          >
                            Projected Value:{" "}
                            {formatCurrency(strategy.projectedValue)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 0.5 }}
                          >
                            Net Proceeds: {formatCurrency(strategy.netProceeds)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 0.5 }}
                          >
                            ROI: {strategy.roi.toFixed(1)}%
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, fontWeight: 600 }}
                          >
                            Annualized ROI: {strategy.annualizedRoi.toFixed(1)}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {/* BRRRR Section */}
        {state.operationType === "BRRRR" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>BRRRR</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  }}
                >
                  <TextField
                    fullWidth
                    label="After Repair Value (ARV)"
                    value={state.brrrr?.arv}
                    onChange={(e) =>
                      updateBRRRR("arv", parseCurrency(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Refinance LTV %"
                    value={state.brrrr?.refinanceLtv}
                    onChange={(e) =>
                      updateBRRRR("refinanceLtv", parseCurrency(e.target.value))
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Refinance Interest Rate"
                    value={state.brrrr?.refinanceInterestRate}
                    onChange={(e) =>
                      updateBRRRR(
                        "refinanceInterestRate",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Loan Term (years)"
                    type="number"
                    value={state.brrrr?.loanTerm}
                    onChange={(e) =>
                      updateBRRRR("loanTerm", parseInt(e.target.value) || 0)
                    }
                  />
                  <TextField
                    fullWidth
                    label="New Monthly Payment"
                    value={state.brrrr?.newMonthlyPayment}
                    onChange={(e) =>
                      updateBRRRR(
                        "newMonthlyPayment",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Original Cash Invested"
                    value={state.brrrr?.originalCashInvested}
                    onChange={(e) =>
                      updateBRRRR(
                        "originalCashInvested",
                        parseCurrency(e.target.value),
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: brandColors.neutral.light, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral.dark }}>
                    Auto-calculated Results
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Cash-Out Amount"
                      value={formatCurrency(state.brrrr?.cashOutAmount || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Remaining Cash in Deal"
                      value={formatCurrency(
                        state.brrrr?.remainingCashInDeal || 0,
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Cash on Cash Return"
                      value={
                        (state.brrrr?.newCashOnCashReturn || 0).toFixed(1) + "%"
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Refinance Closing Costs"
                      value={formatCurrency(
                        state.brrrr?.refinanceClosingCosts || 0,
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Effective Cash-Out (After Costs)"
                      value={formatCurrency(state.brrrr?.effectiveCashOut || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="LTV Constraint Met"
                      value={state.brrrr?.ltvConstraint ? "Yes" : "No"}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  {/* Exit Strategy Results */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: "#fff3e0",
                      borderRadius: 1,
                      border: "1px solid #ffb74d",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: "#e65100", fontWeight: 600 }}
                    >
                      Exit Strategy Analysis
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(auto-fit, minmax(200px, 1fr))",
                        },
                      }}
                    >
                      {state.brrrr?.exitStrategies?.map((strategy, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: "#fff",
                            borderRadius: 1,
                            border: "1px solid brandColors.borders.secondary",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: brandColors.primary, mb: 1, fontWeight: 600 }}
                          >
                            {strategy.timeframe} Year Exit
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 0.5 }}
                          >
                            Projected Value:{" "}
                            {formatCurrency(strategy.projectedValue)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 0.5 }}
                          >
                            Net Proceeds:{" "}
                            {formatCurrency(strategy.projectedValue)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, mb: 0.5 }}
                          >
                            ROI: {strategy.roi.toFixed(1)}%
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral.dark, fontWeight: 600 }}
                          >
                            Annualized ROI: {strategy.annualizedRoi.toFixed(1)}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}
        {/* At a Glance Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>At a Glance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Property & Deal Info */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 2,
                    border: "1px solid brandColors.borders.secondary",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: brandColors.primary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Property & Deal Info
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Property Address"
                      value={state.propertyAddress}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Agent/Owner"
                      value={state.agentOwner}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Analysis Date"
                      value={getTodayFormatted()}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Property Type"
                      value={state.propertyType}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Operation Type"
                      value={state.operationType}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Finance Type"
                      value={state.offerType}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Box>

                {/* Key Financial Metrics */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 2,
                    border: "1px solid brandColors.borders.secondary",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: brandColors.primary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Key Financial Metrics
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Total Acquisition Cost"
                      value={formatCurrency(
                        state.purchasePrice +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0),
                      )}
                      InputProps={{ readOnly: true }}
                      helperText="Purchase + Closing + Immediate CapEx"
                    />
                    <TextField
                      fullWidth
                      label="Total Project Cost"
                      value={formatCurrency(
                        state.purchasePrice +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0) +
                          (state.loan.rehabCosts || 0),
                      )}
                      InputProps={{ readOnly: true }}
                      helperText="Acquisition + Rehab"
                    />
                    <TextField
                      fullWidth
                      label="Price per Unit"
                      value={
                        state.propertyType === "Multi Family" &&
                        state.multi?.unitRents
                          ? formatCurrency(
                              state.purchasePrice /
                                state.multi.unitRents.length,
                            )
                          : "N/A"
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Price per SF"
                      value={(() => {
                        const sf = state.officeRetail?.squareFootage || 0;
                        return sf > 0
                          ? formatCurrency(state.purchasePrice / sf)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="ARV (if value-add/flip)"
                      value={
                        state.fixFlip?.arv
                          ? formatCurrency(state.fixFlip.arv)
                          : "N/A"
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Equity at Purchase"
                      value={
                        state.fixFlip?.arv
                          ? formatCurrency(
                              state.fixFlip.arv -
                                (state.purchasePrice +
                                  (state.loan.closingCosts || 0) +
                                  (state.loan.rehabCosts || 0) +
                                  (state.loan.rehabCosts || 0)),
                            )
                          : "N/A"
                      }
                      InputProps={{ readOnly: true }}
                      helperText="ARV - Total Project Cost"
                    />
                    <TextField
                      fullWidth
                      label="LTV"
                      value={(() => {
                        const loanAmount = computeLoanAmount(state);
                        return state.purchasePrice > 0
                          ? ((loanAmount / state.purchasePrice) * 100).toFixed(
                              1,
                            ) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Loan Amount ÷ Purchase Price"
                    />
                    <TextField
                      fullWidth
                      label="LTC"
                      value={(() => {
                        const loanAmount = computeLoanAmount(state);
                        const totalProjectCost =
                          state.purchasePrice +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0) +
                          (state.loan.rehabCosts || 0);
                        return totalProjectCost > 0
                          ? ((loanAmount / totalProjectCost) * 100).toFixed(1) +
                              "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Loan Amount ÷ Total Project Cost"
                    />
                    <TextField
                      fullWidth
                      label="Debt Yield"
                      value={(() => {
                        const annualNOI =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            variableMonthlyFromPercentages(
                              computeIncome(state),
                              state.ops,
                            )) *
                          12;
                        const loanAmount = computeLoanAmount(state);
                        return loanAmount > 0
                          ? ((annualNOI / loanAmount) * 100).toFixed(2) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="NOI ÷ Loan Amount"
                    />
                    <TextField
                      fullWidth
                      label="DSCR (Y1)"
                      value={(() => {
                        const annualNOI =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            variableMonthlyFromPercentages(
                              computeIncome(state),
                              state.ops,
                            )) *
                          12;
                        const annualDebtService =
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          }) * 12;
                        return annualDebtService > 0
                          ? (annualNOI / annualDebtService).toFixed(2)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="NOI ÷ Annual Debt Service"
                    />
                    <TextField
                      fullWidth
                      label="DSCR (Stabilized)"
                      value={(() => {
                        // Assume 5% rent growth and 3% expense growth for stabilized
                        const stabilizedAnnualNOI =
                          (computeIncome(state) * 1.05 -
                            computeFixedMonthlyOps(state.ops) * 1.03 -
                            variableMonthlyFromPercentages(
                              computeIncome(state) * 1.05,
                              state.ops,
                            )) *
                          12;
                        const annualDebtService =
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          }) * 12;
                        return annualDebtService > 0
                          ? (stabilizedAnnualNOI / annualDebtService).toFixed(2)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Stabilized NOI ÷ Annual Debt Service"
                    />
                    <TextField
                      fullWidth
                      label="Expense Ratio"
                      value={(() => {
                        const grossIncome = computeIncome(state) * 12;
                        const operatingExpenses =
                          (computeFixedMonthlyOps(state.ops) +
                            variableMonthlyFromPercentages(
                              computeIncome(state),
                              state.ops,
                            )) *
                          12;
                        return grossIncome > 0
                          ? ((operatingExpenses / grossIncome) * 100).toFixed(
                              1,
                            ) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Operating Expenses ÷ EGI"
                    />
                    <TextField
                      fullWidth
                      label="NOI Margin"
                      value={(() => {
                        const grossIncome = computeIncome(state) * 12;
                        const annualNOI =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            variableMonthlyFromPercentages(
                              computeIncome(state),
                              state.ops,
                            )) *
                          12;
                        return grossIncome > 0
                          ? ((annualNOI / grossIncome) * 100).toFixed(1) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="NOI ÷ EGI"
                    />
                    <TextField
                      fullWidth
                      label="GRM"
                      value={(() => {
                        const grossAnnualIncome = computeIncome(state) * 12;
                        return grossAnnualIncome > 0
                          ? (state.purchasePrice / grossAnnualIncome).toFixed(2)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Purchase Price ÷ Gross Annual Income"
                    />
                    <TextField
                      fullWidth
                      label="Break-even Occupancy (No Debt)"
                      value={(() => {
                        try {
                          const monthlyRevenue =
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                              ? (state.officeRetail?.squareFootage || 0) *
                                  (state.officeRetail?.rentPerSFMonthly || 0) +
                                (state.officeRetail?.extraMonthlyIncome || 0)
                              : computeIncome(state);

                          if (monthlyRevenue > 0) {
                            const expenses =
                              computeFixedMonthlyOps(state.ops) +
                              variableMonthlyFromPercentages(
                                monthlyRevenue,
                                state.ops,
                              );
                            return (
                              ((expenses / monthlyRevenue) * 100).toFixed(1) +
                              "%"
                            );
                          } else {
                            return "0.0%";
                          }
                        } catch (error) {
                          return "0.0%";
                        }
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Expenses ÷ GPR"
                    />
                    <TextField
                      fullWidth
                      label="Break-even Occupancy (With Debt)"
                      value={(() => {
                        try {
                          const monthlyRevenue =
                            state.propertyType === "Office" ||
                            state.propertyType === "Retail"
                              ? (state.officeRetail?.squareFootage || 0) *
                                  (state.officeRetail?.rentPerSFMonthly || 0) +
                                (state.officeRetail?.extraMonthlyIncome || 0)
                              : computeIncome(state);

                          if (monthlyRevenue > 0) {
                            const expenses =
                              computeFixedMonthlyOps(state.ops) +
                              variableMonthlyFromPercentages(
                                monthlyRevenue,
                                state.ops,
                              );
                            const debtService = totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            });
                            return (
                              (
                                ((expenses + debtService) / monthlyRevenue) *
                                100
                              ).toFixed(1) + "%"
                            );
                          } else {
                            return "0.0%";
                          }
                        } catch (error) {
                          return "0.0%";
                        }
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="(Expenses + Debt Service) ÷ GPR"
                    />
                    <TextField
                      fullWidth
                      label="Payback Period (Years)"
                      value={(() => {
                        const totalCashInvested =
                          state.loan.downPayment +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0);
                        const annualCashFlow =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            })) *
                          12;
                        return annualCashFlow > 0
                          ? (totalCashInvested / annualCashFlow).toFixed(1)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Total Cash Invested ÷ Annual Cash Flow"
                    />
                    <TextField
                      fullWidth
                      label="Equity Multiple (MOIC)"
                      value={(() => {
                        // Simplified calculation - can be enhanced with actual distribution tracking
                        const totalCashInvested =
                          state.loan.downPayment +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0);
                        const annualCashFlow =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            })) *
                          12;
                        // Assume 5-year hold period for MOIC calculation
                        const totalDistributions = annualCashFlow * 5;
                        return totalCashInvested > 0
                          ? (totalDistributions / totalCashInvested).toFixed(2)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Total Distributions ÷ Total Cash Invested"
                    />
                    <TextField
                      fullWidth
                      label="IRR (Levered)"
                      value={(() => {
                        // Simplified IRR calculation - can be enhanced with actual cash flow projections
                        const totalCashInvested =
                          state.loan.downPayment +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0);
                        const annualCashFlow =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            })) *
                          12;
                        // Assume 5-year hold and 3% annual appreciation
                        const futureValue =
                          state.purchasePrice * Math.pow(1.03, 5);
                        const totalReturn =
                          annualCashFlow * 5 + futureValue - totalCashInvested;
                        const irr =
                          totalCashInvested > 0
                            ? Math.pow(
                                (totalReturn + totalCashInvested) /
                                  totalCashInvested,
                                1 / 5,
                              ) - 1
                            : 0;
                        return (irr * 100).toFixed(1) + "%";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Internal Rate of Return (Levered)"
                    />
                    <TextField
                      fullWidth
                      label="IRR (Unlevered)"
                      value={(() => {
                        // Simplified unlevered IRR calculation
                        const totalCashInvested =
                          state.purchasePrice +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0);
                        const annualCashFlow =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops)) *
                          12;
                        // Assume 5-year hold and 3% annual appreciation
                        const futureValue =
                          state.purchasePrice * Math.pow(1.03, 5);
                        const totalReturn =
                          annualCashFlow * 5 + futureValue - totalCashInvested;
                        const irr =
                          totalCashInvested > 0
                            ? Math.pow(
                                (totalReturn + totalCashInvested) /
                                  totalCashInvested,
                                1 / 5,
                              ) - 1
                            : 0;
                        return (irr * 100).toFixed(1) + "%";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Internal Rate of Return (Unlevered)"
                    />
                    <TextField
                      fullWidth
                      label="Return on Equity (Current)"
                      value={(() => {
                        const equity =
                          state.purchasePrice - computeLoanAmount(state);
                        const annualCashFlow =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            })) *
                          12;
                        return equity > 0
                          ? ((annualCashFlow / equity) * 100).toFixed(1) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Annual Cash Flow ÷ Current Equity"
                    />
                    <TextField
                      fullWidth
                      label="Return on Equity (Stabilized)"
                      value={(() => {
                        const equity =
                          state.purchasePrice - computeLoanAmount(state);
                        // Assume 5% rent growth and 3% expense growth for stabilized
                        const stabilizedAnnualCashFlow =
                          (computeIncome(state) * 1.05 -
                            computeFixedMonthlyOps(state.ops) * 1.03 -
                            totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            })) *
                          12;
                        return equity > 0
                          ? ((stabilizedAnnualCashFlow / equity) * 100).toFixed(
                              1,
                            ) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Stabilized Annual Cash Flow ÷ Current Equity"
                    />
                    <TextField
                      fullWidth
                      label="Cash Reserve Months on Hand"
                      value={(() => {
                        const monthlyCashFlow =
                          computeIncome(state) -
                          computeFixedMonthlyOps(state.ops) -
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          });
                        // Assume 6 months of cash flow as cash reserve
                        const cashReserve = monthlyCashFlow * 6;
                        return monthlyCashFlow > 0
                          ? (cashReserve / monthlyCashFlow).toFixed(1)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Cash Reserve ÷ Monthly Cash Flow"
                    />
                  </Box>
                </Box>

                {/* STR/Hotel Specific Metrics */}
                {(state.propertyType === "Hotel" ||
                  state.operationType === "Short Term Rental") && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: brandColors.backgrounds.secondary,
                      borderRadius: 2,
                      border: "1px solid brandColors.borders.secondary",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: brandColors.primary,
                        fontSize: "0.9rem",
                      }}
                    >
                      STR/Hotel Specific Metrics
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="ADR"
                        value={
                          state.revenueInputs?.averageDailyRate
                            ? formatCurrency(
                                state.revenueInputs.averageDailyRate,
                              )
                            : "N/A"
                        }
                        InputProps={{ readOnly: true }}
                      />
                      <TextField
                        fullWidth
                        label="Occupancy Rate"
                        value={
                          state.revenueInputs?.occupancyRate
                            ? (state.revenueInputs.occupancyRate * 100).toFixed(
                                1,
                              ) + "%"
                            : "N/A"
                        }
                        InputProps={{ readOnly: true }}
                      />
                      <TextField
                        fullWidth
                        label="RevPAR"
                        value={(() => {
                          const adr =
                            state.revenueInputs?.averageDailyRate || 0;
                          const occupancy =
                            state.revenueInputs?.occupancyRate || 0;
                          return adr > 0
                            ? formatCurrency(adr * occupancy)
                            : "N/A";
                        })()}
                        InputProps={{ readOnly: true }}
                        helperText="ADR × Occupancy Rate"
                      />
                      <TextField
                        fullWidth
                        label="GOP Margin"
                        value={(() => {
                          const grossRevenue =
                            (state.revenueInputs?.averageDailyRate || 0) *
                            (state.revenueInputs?.totalRooms || 0) *
                            (state.revenueInputs?.occupancyRate || 0) *
                            365;
                          const operatingExpenses =
                            (computeFixedMonthlyOps(state.ops) +
                              variableMonthlyFromPercentages(
                                computeIncome(state),
                                state.ops,
                              )) *
                            12;
                          return grossRevenue > 0
                            ? (
                                ((grossRevenue - operatingExpenses) /
                                  grossRevenue) *
                                100
                              ).toFixed(1) + "%"
                            : "N/A";
                        })()}
                        InputProps={{ readOnly: true }}
                        helperText="(Gross Revenue - Operating Expenses) ÷ Gross Revenue"
                      />
                    </Box>
                  </Box>
                )}

                {/* Financial Terms */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 2,
                    border: "1px solid brandColors.borders.secondary",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: brandColors.primary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Financial Terms
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Listed Price"
                      value={formatCurrency(state.listedPrice)}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Purchase Price"
                      value={formatCurrency(state.purchasePrice)}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Down Payment"
                      value={formatCurrency(state.loan.downPayment || 0)}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Loan Amount"
                      value={formatCurrency(computeLoanAmount(state))}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Interest Rate"
                      value={
                        (state.loan.annualInterestRate || 0).toFixed(2) + "%"
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Total Monthly Debt Service"
                      value={formatCurrency(
                        totalMonthlyDebtService({
                          newLoanMonthly: state.loan.monthlyPayment || 0,
                          subjectToMonthlyTotal:
                            state.subjectTo?.totalMonthlyPayment,
                          hybridMonthly: state.hybrid?.monthlyPayment,
                        }),
                      )}
                      InputProps={{ readOnly: true }}
                      helperText="Consolidated monthly payment to all lenders"
                    />
                  </Box>
                </Box>

                {/* Income & Performance */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 2,
                    border: "1px solid brandColors.borders.secondary",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: brandColors.primary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Income & Performance
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Monthly Income"
                      value={formatCurrency(computeIncome(state))}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Monthly Operating Expenses"
                      value={formatCurrency(
                        computeFixedMonthlyOps(state.ops) +
                          variableMonthlyFromPercentages(
                            computeIncome(state),
                            state.ops,
                          ),
                      )}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Monthly Cash Flow"
                      value={formatCurrency(
                        computeIncome(state) -
                          computeFixedMonthlyOps(state.ops) -
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          }),
                      )}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Annual Cash Flow"
                      value={formatCurrency(
                        (computeIncome(state) -
                          computeFixedMonthlyOps(state.ops) -
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          })) *
                          12,
                      )}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Cash on Cash Return"
                      value={
                        computeCocAnnual(
                          state,
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            totalMonthlyDebtService({
                              newLoanMonthly: state.loan.monthlyPayment || 0,
                              subjectToMonthlyTotal:
                                state.subjectTo?.totalMonthlyPayment,
                              hybridMonthly: state.hybrid?.monthlyPayment,
                            })) *
                            12,
                        ).toFixed(1) + "%"
                      }
                      InputProps={{ readOnly: true }}
                    />
                    {!isCashOnCashValid(state) && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#d32f2f", fontStyle: "italic" }}
                      >
                        Cash-on-Cash Return calculation is invalid. Please check
                        that all cash investment amounts are positive.
                      </Typography>
                    )}
                    {/* Break Even Occupancy - Only show for non-Land properties */}
                    {state.propertyType !== "Land" ? (
                      <>
                        <TextField
                          fullWidth
                          label="Break Even Occupancy"
                          value={(() => {
                            try {
                              const monthlyRevenue =
                                state.propertyType === "Office" ||
                                state.propertyType === "Retail"
                                  ? (state.officeRetail?.squareFootage || 0) *
                                      (state.officeRetail?.rentPerSFMonthly ||
                                        0) +
                                    (state.officeRetail?.extraMonthlyIncome ||
                                      0)
                                  : computeIncome(state);

                              // Only calculate if we have positive revenue
                              if (monthlyRevenue > 0) {
                                return (
                                  financeBreakEvenOccupancy({
                                    monthlyRevenueAt100: monthlyRevenue,
                                    fixedMonthlyOps: computeFixedMonthlyOps(
                                      state.ops,
                                    ),
                                    variablePct: computeVariableMonthlyOpsPct(
                                      state.ops,
                                    ),
                                    includeVariablePct:
                                      state.includeVariablePctInBreakeven ||
                                      false,
                                  }).toFixed(1) + "%"
                                );
                              } else {
                                return "0.0%";
                              }
                            } catch (error) {
                              return "0.0%";
                            }
                          })()}
                          InputProps={{ readOnly: true }}
                        />
                        {!isBreakEvenValid(state) && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#d32f2f", fontStyle: "italic" }}
                          >
                            Break-even calculation is invalid. Variable costs
                            may exceed revenue or revenue is zero.
                          </Typography>
                        )}
                      </>
                    ) : (
                      <TextField
                        fullWidth
                        label="Break Even Occupancy"
                        value="Not applicable for Land"
                        InputProps={{ readOnly: true }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Costs & Expenses */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 2,
                    border: "1px solid brandColors.borders.secondary",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: brandColors.primary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Costs & Expenses
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Total Project Cost"
                      value={formatCurrency(
                        state.purchasePrice +
                          (state.loan.closingCosts || 0) +
                          (state.loan.rehabCosts || 0) +
                          (state.arbitrage?.furnitureCost || 0),
                      )}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Closing Costs"
                      value={formatCurrency(state.loan.closingCosts || 0)}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Rehab Costs"
                      value={formatCurrency(state.loan.rehabCosts || 0)}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Variable Monthly Expenses"
                      value={formatCurrency(
                        variableMonthlyFromPercentages(
                          computeIncome(state),
                          state.ops,
                        ),
                      )}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Total Monthly Expenses"
                      value={formatCurrency(
                        computeFixedMonthlyOps(state.ops) +
                          variableMonthlyFromPercentages(
                            computeIncome(state),
                            state.ops,
                          ),
                      )}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Total Annual Expenses"
                      value={formatCurrency(
                        (computeFixedMonthlyOps(state.ops) +
                          variableMonthlyFromPercentages(
                            computeIncome(state),
                            state.ops,
                          )) *
                          12,
                      )}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Box>

                {/* Sensitivities */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 2,
                    border: "1px solid brandColors.borders.secondary",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: brandColors.primary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Sensitivities
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="DSCR at -10% Rent"
                      value={(() => {
                        const reducedIncome = computeIncome(state) * 0.9;
                        const annualNOI =
                          (reducedIncome -
                            computeFixedMonthlyOps(state.ops) -
                            variableMonthlyFromPercentages(
                              reducedIncome,
                              state.ops,
                            )) *
                          12;
                        const annualDebtService =
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          }) * 12;
                        return annualDebtService > 0
                          ? (annualNOI / annualDebtService).toFixed(2)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="DSCR with 10% rent reduction"
                    />
                    <TextField
                      fullWidth
                      label="DSCR at +10% Expenses"
                      value={(() => {
                        const increasedExpenses =
                          (computeFixedMonthlyOps(state.ops) +
                            variableMonthlyFromPercentages(
                              computeIncome(state),
                              state.ops,
                            )) *
                          1.1;
                        const annualNOI =
                          (computeIncome(state) - increasedExpenses) * 12;
                        const annualDebtService =
                          totalMonthlyDebtService({
                            newLoanMonthly: state.loan.monthlyPayment || 0,
                            subjectToMonthlyTotal:
                              state.subjectTo?.totalMonthlyPayment,
                            hybridMonthly: state.hybrid?.monthlyPayment,
                          }) * 12;
                        return annualDebtService > 0
                          ? (annualNOI / annualDebtService).toFixed(2)
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="DSCR with 10% expense increase"
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={exportToPDF}
            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            onClick={exportToExcel}
            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
          >
            Email PDF
          </Button>
          <Button
            variant="contained"
            onClick={() => setState(defaultState)}
            sx={{ bgcolor: brandColors.primary, color: brandColors.backgrounds.primary }}
          >
            Reset
          </Button>
        </Box>
      </Container>
      </Box>
    </>
  );
};

export default UnderwritePage;
