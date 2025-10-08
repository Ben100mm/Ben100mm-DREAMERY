import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { brandColors } from "../theme";
import { PageAppBar } from "../components/Header";
import ProfessionalSupportMessages from "../components/professional-support/ProfessionalSupportMessages";
import CashFlowProjectionsTab from "../components/CashFlowProjectionsTab";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import {
  pmt,
  totalMonthlyDebtService,
  computeFixedMonthlyOps,
  computeVariableMonthlyOpsPct,
  computeVariableExpenseFromPercentages,
  computeVariableExpensePct,
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
  calculateEnhancedTaxImplications,
  calculateRiskScore,
  calculateConfidenceIntervals,
  calculateStressTest,
  calculateInflationAdjustments,
  calculateYearsUntilRefinance,
  calculateRefinancePotential,
  defaultLocationFactors,
  type MarketConditions,
  type ExitStrategy,
  type RefinanceScenario,
  type TaxImplications,
  type RiskFactors,
  type PropertyAgeFactors,
  type LocationFactors,
} from "../utils/advancedCalculations";
import { underwriteCalculationService } from "../services/underwriteCalculationService";
import { MLRiskPredictionDisplay } from "../components/MLRiskPredictionDisplay";
import { ModeSelector } from "../components/calculator/ModeSelector";
import { useCalculatorMode } from "../hooks/useCalculatorMode";
import { isAccordionVisible, getAccordionDetailLevel, CalculatorMode } from "../types/calculatorMode";
import { RegionalAdjustmentPanel } from "../components/calculator/RegionalAdjustmentPanel";
import { UpgradePrompt } from "../components/calculator/UpgradePrompt";
import { 
  type RegionKey, 
  getLocationAdjustedPreset 
} from "../utils/regionalMultipliers";
import AdvancedModelingTab from "./AdvancedModelingTab";
import { AnalysisProvider } from "../context/AnalysisContext";
import { ProFormaPresetSelector } from "../components/calculator/ProFormaPresetSelector";
import { LiveMarketDataWidget } from "../components/calculator/LiveMarketDataWidget";
import { GuidedTour } from "../components/GuidedTour";
import jsPDF from "jspdf";
import { Download as DownloadIcon, Email as EmailIcon, Message as MessageIcon } from "@mui/icons-material";
import { 
  type DealState,
  type PropertyType,
  type OperationType,
  type OfferType,
  type LoanTerms,
  type SubjectToLoan,
  type SubjectToInputs,
  type HybridInputs,
  type FixFlipInputs,
  type BRRRRInputs,
  type AppreciationInputs,
  type IncomeInputsSfr,
  type IncomeInputsMulti,
  type IncomeInputsStr,
  type MetricWithConfidence,
  type UncertaintyParameters,
  type EnhancedSTRInputs,
  type OfficeRetailInputs,
  type LandInputs,
  type ArbitrageInputs,
  type OperatingInputsCommon,
  type CustomProFormaPreset,
  type SensitivityAnalysis,
  type BenchmarkComparison,
  type RevenueInputs,
  type BreakEvenAnalysis,
  type CapitalEvent,
  type CapitalEventInputs,
  type Exchange1031Inputs,
  type SeasonalFactors,
  type EnhancedTaxImplications,
} from "../types/deal";

// Lazy load icons to reduce initial bundle size
const LazyExpandMoreIcon = React.lazy(() => import("@mui/icons-material/ExpandMore"));
const LazyDeleteIcon = React.lazy(() => import("@mui/icons-material/Delete"));
const LazyTrendingUpIcon = React.lazy(() => import("@mui/icons-material/TrendingUp"));
const LazyRestartAltIcon = React.lazy(() => import("@mui/icons-material/RestartAlt"));

// All type definitions are now imported from types/deal.ts

// Capital Event Template Generator
function generateCapitalEventTemplates(propertyAge: number, purchasePrice: number): CapitalEvent[] {
  const templates: CapitalEvent[] = [];
  
  // Roof replacement (typical lifespan: 20-25 years)
  if (propertyAge >= 15) {
    templates.push({
      id: `roof-${Date.now()}-1`,
      year: Math.max(1, 22 - propertyAge),
      description: 'Roof Replacement',
      estimatedCost: Math.round(purchasePrice * 0.05), // ~5% of property value
      category: 'roof',
      likelihood: propertyAge >= 18 ? 80 : 50,
    });
  }

  // HVAC replacement (typical lifespan: 15-20 years)
  if (propertyAge >= 10) {
    templates.push({
      id: `hvac-${Date.now()}-1`,
      year: Math.max(1, 17 - propertyAge),
      description: 'HVAC System Replacement',
      estimatedCost: Math.round(purchasePrice * 0.03), // ~3% of property value
      category: 'hvac',
      likelihood: propertyAge >= 15 ? 70 : 40,
    });
  }

  // Water heater (typical lifespan: 10-15 years)
  if (propertyAge >= 8) {
    templates.push({
      id: `plumbing-${Date.now()}-1`,
      year: Math.max(1, 12 - propertyAge),
      description: 'Water Heater Replacement',
      estimatedCost: Math.round(purchasePrice * 0.005), // ~0.5% of property value
      category: 'plumbing',
      likelihood: propertyAge >= 12 ? 75 : 35,
    });
  }

  // Electrical panel upgrade (older properties)
  if (propertyAge >= 30) {
    templates.push({
      id: `electrical-${Date.now()}-1`,
      year: Math.max(1, 3),
      description: 'Electrical Panel Upgrade',
      estimatedCost: Math.round(purchasePrice * 0.02), // ~2% of property value
      category: 'electrical',
      likelihood: 60,
    });
  }

  // Foundation repairs (older properties)
  if (propertyAge >= 40) {
    templates.push({
      id: `foundation-${Date.now()}-1`,
      year: Math.max(1, 5),
      description: 'Foundation Repairs',
      estimatedCost: Math.round(purchasePrice * 0.04), // ~4% of property value
      category: 'foundation',
      likelihood: 40,
    });
  }

  // Exterior painting (every 7-10 years)
  if (propertyAge >= 5) {
    templates.push({
      id: `other-${Date.now()}-1`,
      year: Math.max(1, 8 - (propertyAge % 8)),
      description: 'Exterior Painting',
      estimatedCost: Math.round(purchasePrice * 0.015), // ~1.5% of property value
      category: 'other',
      likelihood: 85,
    });
  }

  return templates;
}

// Calculate capital event metrics
function calculateCapitalEventMetrics(
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

// Get capital events for a specific year
function getCapitalEventsForYear(events: CapitalEvent[], year: number): number {
  return events
    .filter(event => event.year === year)
    .reduce((sum, event) => sum + (event.estimatedCost * event.likelihood / 100), 0);
}

// Calculate confidence intervals for a metric
function calculateConfidenceInterval(
  baseValue: number,
  uncertaintyFactor: number,
  confidenceLevel: number = 80
): MetricWithConfidence {
  // For 80% confidence: 10th percentile (low) to 90th percentile (high)
  // For 90% confidence: 5th percentile (low) to 95th percentile (high)
  // For 95% confidence: 2.5th percentile (low) to 97.5th percentile (high)
  
  // Z-scores for different confidence levels (assuming normal distribution)
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

// Calculate Cash-on-Cash Return with confidence intervals
function calculateCoCWithConfidence(state: DealState): MetricWithConfidence {
  const monthlyIncome = computeIncome(state);
  const monthlyFixedOps = computeFixedMonthlyOps(state.ops);
  const monthlyVariableOps = computeVariableExpenseFromPercentages(
    monthlyIncome,
    state.ops
  );
  const monthlyDebtService = totalMonthlyDebtService({
    newLoanMonthly: state.loan.monthlyPayment || 0,
    subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
    hybridMonthly: state.hybrid?.monthlyPayment,
  });
  
  const monthlyCashFlow = monthlyIncome - monthlyFixedOps - monthlyVariableOps - monthlyDebtService;
  const annualCashFlow = monthlyCashFlow * 12;
  
  const cashInvested = state.operationType === "Rental Arbitrage"
    ? // Rental Arbitrage: only startup costs, no purchase/down payment/closing
      (state.arbitrage?.deposit || 0) +
      (state.arbitrage?.estimateCostOfRepairs || 0) +
      (state.arbitrage?.furnitureCost || 0) +
      (state.arbitrage?.otherStartupCosts || 0) +
      (state.loan.rehabCosts || 0)
    : // Traditional purchase: down payment + closing + rehab + furniture (if STR)
      state.loan.downPayment +
      (state.loan.closingCosts || 0) +
      (state.loan.rehabCosts || 0) +
      (state.operationType === "Short Term Rental" ? state.arbitrage?.furnitureCost || 0 : 0);
  
  if (cashInvested <= 0) {
    return {
      low: 0,
      base: 0,
      high: 0,
      standardDeviation: 0,
      confidenceLevel: state.uncertaintyParameters.confidenceLevel,
    };
  }
  
  const baseCoC = (annualCashFlow / cashInvested) * 100;
  
  // Combined uncertainty from income and expenses
  const combinedUncertainty = Math.sqrt(
    Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
    Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
  );
  
  return calculateConfidenceInterval(
    baseCoC,
    combinedUncertainty,
    state.uncertaintyParameters.confidenceLevel
  );
}

// Calculate NOI with confidence intervals
function calculateNOIWithConfidence(state: DealState): MetricWithConfidence {
  const monthlyIncome = computeIncome(state);
  const monthlyFixedOps = computeFixedMonthlyOps(state.ops);
  const monthlyVariableOps = computeVariableExpenseFromPercentages(
    monthlyIncome,
    state.ops
  );
  
  const monthlyNOI = monthlyIncome - monthlyFixedOps - monthlyVariableOps;
  const annualNOI = monthlyNOI * 12;
  
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

// Calculate Cap Rate with confidence intervals
function calculateCapRateWithConfidence(state: DealState): MetricWithConfidence {
  const monthlyIncome = computeIncome(state);
  const monthlyFixedOps = computeFixedMonthlyOps(state.ops);
  const monthlyVariableOps = computeVariableExpenseFromPercentages(
    monthlyIncome,
    state.ops
  );
  
  const annualNOI = (monthlyIncome - monthlyFixedOps - monthlyVariableOps) * 12;
  
  if (state.purchasePrice <= 0) {
    return {
      low: 0,
      base: 0,
      high: 0,
      standardDeviation: 0,
      confidenceLevel: state.uncertaintyParameters.confidenceLevel,
    };
  }
  
  const baseCapRate = (annualNOI / state.purchasePrice) * 100;
  
  const combinedUncertainty = Math.sqrt(
    Math.pow(state.uncertaintyParameters.incomeUncertainty, 2) +
    Math.pow(state.uncertaintyParameters.expenseUncertainty, 2)
  );
  
  return calculateConfidenceInterval(
    baseCapRate,
    combinedUncertainty,
    state.uncertaintyParameters.confidenceLevel
  );
}

// Calculate ROI with confidence intervals
function calculateROIWithConfidence(state: DealState): MetricWithConfidence {
  const cashInvested = state.operationType === "Rental Arbitrage"
    ? // Rental Arbitrage: only startup costs, no purchase/down payment/closing
      (state.arbitrage?.deposit || 0) +
      (state.arbitrage?.estimateCostOfRepairs || 0) +
      (state.arbitrage?.furnitureCost || 0) +
      (state.arbitrage?.otherStartupCosts || 0) +
      (state.loan.rehabCosts || 0)
    : // Traditional purchase: down payment + closing + rehab + furniture (if STR)
      state.loan.downPayment +
      (state.loan.closingCosts || 0) +
      (state.loan.rehabCosts || 0) +
      (state.operationType === "Short Term Rental" ? state.arbitrage?.furnitureCost || 0 : 0);
  
  if (cashInvested <= 0) {
    return {
      low: 0,
      base: 0,
      high: 0,
      standardDeviation: 0,
      confidenceLevel: state.uncertaintyParameters.confidenceLevel,
    };
  }
  
  // Simplified ROI: (Current Equity - Cash Invested) / Cash Invested
  const currentEquity = state.purchasePrice - computeLoanAmount(state);
  const baseROI = ((currentEquity - cashInvested) / cashInvested) * 100;
  
  // ROI uncertainty primarily from property value uncertainty
  return calculateConfidenceInterval(
    baseROI,
    state.uncertaintyParameters.appreciationUncertainty,
    state.uncertaintyParameters.confidenceLevel
  );
}

// Format confidence interval for display
function formatConfidenceInterval(metric: MetricWithConfidence, isPercentage: boolean = false, isCurrency: boolean = false): string {
  const suffix = isPercentage ? '%' : '';
  
  if (isCurrency) {
    return `${formatCurrency(metric.low)} - ${formatCurrency(metric.base)} - ${formatCurrency(metric.high)}`;
  }
  
  return `${metric.low.toFixed(1)}${suffix} - ${metric.base.toFixed(1)}${suffix} - ${metric.high.toFixed(1)}${suffix}`;
}

// Calculate enhanced STR revenue with channel fees and dynamic pricing
function calculateSTRRevenue(inputs: EnhancedSTRInputs): {
  monthlyRevenue: number;
  metrics: {
    availableNights: number;
    bookedNights: number;
    effectiveOccupancy: number;
    grossRevenue: number;
    totalChannelFees: number;
    netRevenue: number;
    revPAN: number; // Revenue Per Available Night
    netADR: number; // Net Average Daily Rate after fees
  };
} {
  // Calculate available nights accounting for blocked days
  const availableNights = 365 - inputs.blockedDays;
  
  // Calculate number of turnovers based on length of stay + turnover days
  const daysPerBookingCycle = inputs.averageLengthOfStay + inputs.turnoverDays;
  const turnovers = daysPerBookingCycle > 0 
    ? Math.floor(availableNights / daysPerBookingCycle) 
    : 0;
  
  // Calculate bookable nights (only the actual guest nights, not turnover days)
  const bookableNights = turnovers * inputs.averageLengthOfStay;
  
  // Calculate booked nights based on occupancy rate
  const bookedNights = bookableNights * (inputs.occupancyRate / 100);
  
  // Calculate effective occupancy (booked nights / total available nights)
  const effectiveOccupancy = availableNights > 0 
    ? (bookedNights / availableNights) * 100 
    : 0;
  
  // Apply dynamic pricing if enabled
  let averageRate = inputs.averageDailyRate;
  if (inputs.dynamicPricing) {
    // Assume 28.57% of nights are weekends (2 out of 7 days: Fri/Sat)
    const weekendNights = bookedNights * 0.2857;
    const weekdayNights = bookedNights * 0.7143;
    const weekendRate = inputs.averageDailyRate * (1 + inputs.weekendPremium / 100);
    
    averageRate = (weekendNights * weekendRate + weekdayNights * inputs.averageDailyRate) / bookedNights;
  }
  
  // Calculate gross revenue
  const grossRevenue = bookedNights * averageRate;
  
  // Calculate channel fees based on mix
  const airbnbRevenue = grossRevenue * (inputs.channelMix.airbnb / 100);
  const vrboRevenue = grossRevenue * (inputs.channelMix.vrbo / 100);
  const directRevenue = grossRevenue * (inputs.channelMix.direct / 100);
  
  const airbnbFees = airbnbRevenue * (inputs.channelFees.airbnb / 100);
  const vrboFees = vrboRevenue * (inputs.channelFees.vrbo / 100);
  const directFees = directRevenue * (inputs.channelFees.direct / 100);
  
  const totalChannelFees = airbnbFees + vrboFees + directFees;
  
  // Calculate net revenue after channel fees
  const netRevenue = grossRevenue - totalChannelFees;
  
  // Calculate RevPAN (Revenue Per Available Night)
  const revPAN = availableNights > 0 ? netRevenue / availableNights : 0;
  
  // Calculate Net ADR (after channel fees)
  const netADR = bookedNights > 0 ? netRevenue / bookedNights : 0;
  
  return {
    monthlyRevenue: netRevenue / 12, // Convert annual to monthly
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
      const result = `${month} / day / ${year}`;
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
  const result = `${month} / day / ${year}`;
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
  return `${month} / day / ${year}`;
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
  ioPeriodMonths?: number,
): Array<{
  index: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  isIOPhase?: boolean; // NEW: Track if this payment is in IO phase
}> {
  const schedule: Array<{
    index: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
    isIOPhase?: boolean;
  }> = [];
  const n = Math.min(600, Math.round(years * 12)); // cap at 50 years
  let balance = startBalance ?? loanAmount;
  const monthlyRate = annualRatePct / 100 / 12;
  
  // Hybrid IO loan: IO period followed by amortization
  if (interestOnly && ioPeriodMonths && ioPeriodMonths > 0) {
    const ioPeriod = Math.min(ioPeriodMonths, n);
    const ioPmt = balance * monthlyRate; // Interest-only payment
    
    // IO phase
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
    
    // Amortization phase (if any months remain)
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
  // Pure IO loan (entire term)
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
  // Standard amortizing loan
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

/**
 * Computes Gross Potential Income (GPI) - the maximum possible income if property were 100% occupied.
 * Note: Variable expenses should be calculated as % of EGI (Effective Gross Income), not GPI.
 * This function does NOT apply vacancy, occupancy rates, or seasonal adjustments.
 */
function computeGrossPotentialIncome(state: DealState): number {
  const { propertyType, operationType } = state;

  // Fix & Flip has no rental income during hold period in this calculator
  if (operationType === "Fix & Flip") {
    return 0;
  }

  // Office/Retail: use per-SF model at 100% occupancy
  if (propertyType === "Office" || propertyType === "Retail") {
    const sf = state.officeRetail?.squareFootage ?? 0;
    const rentPerSF = state.officeRetail?.rentPerSFMonthly ?? 0;
    const other = state.officeRetail?.extraMonthlyIncome ?? 0;
    const base = sf * rentPerSF;
    // GPI = base rent at 100% occupancy + other income
    return base + other;
  }

  // STR/Arbitrage nightly model for SFR/Multi/Hotel only
  if (
    (operationType === "Short Term Rental" ||
      operationType === "Rental Arbitrage") &&
    propertyType !== "Land"
  ) {
    // Hotel properties use revenueInputs
    if (propertyType === "Hotel") {
      const {
        totalRooms,
        averageDailyRate,
        occupancyRate,
      } = state.revenueInputs;
      if (totalRooms > 0 && averageDailyRate > 0) {
        // GPI = potential revenue at stated occupancy rate WITHOUT seasonal/vacancy adjustments
        const annualRevenue =
          totalRooms * averageDailyRate * (occupancyRate / 100) * 365;
        return annualRevenue / 12; // Convert to monthly
      }
    }

    // STR model without vacancy adjustments
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
    // GPI without seasonal variations
    return baseIncome;
  }

  if (propertyType === "Multi Family") {
    const rents = state.multi?.unitRents ?? [];
    const rentTotal = rents.reduce((a, b) => a + b, 0);
    const baseIncome = rentTotal + (state.multi?.grossMonthlyIncome ?? 0);
    // GPI without seasonal variations
    return baseIncome;
  }

  if (propertyType === "Land") {
    // Land typically has no rent; allow optional extra income (e.g., grazing)
    return state.land?.extraMonthlyIncome ?? 0;
  }

  // BRRRR/Seller Finance/etc. fall through to 0 if no property-type income
  return 0;
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
    // Check if enhanced STR model is enabled and configured
    if (state.enhancedSTR?.useEnhancedModel && state.enhancedSTR.averageDailyRate > 0) {
      const { monthlyRevenue } = calculateSTRRevenue(state.enhancedSTR);
      return monthlyRevenue;
    }
    
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
            q1: seasonalVariations.q1,
            q2: seasonalVariations.q2,
            q3: seasonalVariations.q3,
            q4: seasonalVariations.q4,
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
        q1: seasonalVariations.q1,
        q2: seasonalVariations.q2,
        q3: seasonalVariations.q3,
        q4: seasonalVariations.q4,
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
        (state.arbitrage?.otherStartupCosts ?? 0) +
        (state.loan.rehabCosts || 0)
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

/**
 * Calculates true IRR using Newton-Raphson method
 * @param initialInvestment - Initial cash outlay (negative value expected)
 * @param cashFlows - Array of annual cash flows
 * @param finalValue - Exit proceeds (after selling costs)
 * @param maxIterations - Maximum iterations for convergence
 * @param tolerance - Convergence tolerance
 * @returns IRR as decimal (e.g., 0.15 = 15%)
 */
function calculateTrueIRR(
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
 * Builds year-by-year cash flow projections for IRR calculation
 * @param state - Current deal state
 * @param isLevered - True for levered (with debt), false for unlevered
 * @returns Array of annual cash flows
 */
function buildCashFlowProjections(
  state: DealState,
  isLevered: boolean
): number[] {
  const cashFlows: number[] = [];
  const holdYears = state.irrHoldPeriodYears || 5;
  
  // Base annual income and expenses
  const monthlyIncome = computeIncome(state);
  const monthlyFixedOps = computeFixedMonthlyOps(state.ops);
  const monthlyVariableOps = computeVariableExpenseFromPercentages(
    monthlyIncome,
    state.ops
  );
  
  // Debt service (only for levered)
  const monthlyDebtService = isLevered
    ? totalMonthlyDebtService({
        newLoanMonthly: state.loan.monthlyPayment || 0,
        subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
        hybridMonthly: state.hybrid?.monthlyPayment,
      })
    : 0;
  
  // Project cash flows with configurable growth assumptions
  const incomeGrowth = 1 + (state.irrIncomeGrowthRate || 2) / 100;
  const expenseGrowth = 1 + (state.irrExpenseGrowthRate || 3) / 100;
  
  for (let year = 0; year < holdYears; year++) {
    const yearMultiplier = year; // Year 0 = first full year
    const annualIncome = monthlyIncome * 12 * Math.pow(incomeGrowth, yearMultiplier);
    const annualFixedOps = monthlyFixedOps * 12 * Math.pow(expenseGrowth, yearMultiplier);
    const annualVariableOps = monthlyVariableOps * 12 * Math.pow(expenseGrowth, yearMultiplier);
    const annualDebtService = monthlyDebtService * 12; // Debt service stays constant
    
    // Include capital events for this year (year + 1 because year 0 = first full year)
    const capitalEventCost = getCapitalEventsForYear(state.capitalEvents.events, year + 1);
    
    const annualCashFlow = annualIncome - annualFixedOps - annualVariableOps - annualDebtService - capitalEventCost;
    cashFlows.push(annualCashFlow);
  }
  
  return cashFlows;
}

/**
 * Calculates net exit proceeds from property sale
 * @param state - Current deal state
 * @param isLevered - True for levered (subtract remaining loan balance)
 * @returns Net proceeds after selling costs and loan payoff
 */
function calculateExitProceeds(
  state: DealState,
  isLevered: boolean
): number {
  const holdYears = state.irrHoldPeriodYears || 5;
  
  // Future value with appreciation
  const appreciationRate = (state.appreciation?.appreciationPercentPerYear || 3) / 100;
  const futureValue = state.purchasePrice * Math.pow(1 + appreciationRate, holdYears);
  
  // Selling costs (configurable, default 7%)
  const sellingCostsPct = (state.irrSellingCostsPct || 7) / 100;
  const sellingCosts = futureValue * sellingCostsPct;
  
  // Gross proceeds before loan payoff
  const grossProceeds = futureValue - sellingCosts;
  
  if (!isLevered) {
    return grossProceeds; // Unlevered = no loan to pay off
  }
  
  // Calculate remaining loan balance after holdYears
  const loanAmount = computeLoanAmount(state);
  const monthlyRate = (state.loan.annualInterestRate || 0) / 100 / 12;
  const totalMonths = (state.loan.amortizationYears || 30) * 12;
  const monthsElapsed = holdYears * 12;
  
  let remainingBalance = loanAmount;
  
  if (loanAmount > 0 && monthlyRate > 0 && !state.loan.interestOnly) {
    // Calculate remaining balance using amortization formula
    const monthlyPayment = state.loan.monthlyPayment || 0;
    
    if (monthsElapsed >= totalMonths) {
      remainingBalance = 0; // Loan fully paid off
    } else {
      // Remaining balance formula
      const remainingMonths = totalMonths - monthsElapsed;
      remainingBalance =
        (monthlyPayment / monthlyRate) *
        (1 - Math.pow(1 + monthlyRate, -remainingMonths));
    }
  } else if (state.loan.interestOnly) {
    // Interest-only: principal stays the same until balloon
    remainingBalance = loanAmount;
  }
  
  // Net proceeds = gross proceeds - remaining loan balance
  const netProceeds = grossProceeds - remainingBalance;
  
  return netProceeds;
}

/**
 * Calculates comprehensive MOIC (Multiple on Invested Capital / Equity Multiple)
 * Includes both operating cash flows AND exit proceeds
 * @param state - Current deal state
 * @param holdingPeriod - Years to hold property (default 5)
 * @returns Object with MOIC value and detailed breakdown
 */
function calculateComprehensiveMOIC(
  state: DealState,
  holdingPeriod: number = 5
): {
  moic: number;
  breakdown: {
    cashInvested: number;
    totalCashFlows: number;
    exitProceeds: {
      futureValue: number;
      sellingCosts: number;
      remainingBalance: number;
      netSaleProceeds: number;
    };
    totalReturn: number;
  };
} {
  // Calculate total cash invested
  const cashInvested =
    state.operationType === "Rental Arbitrage"
      ? (state.arbitrage?.deposit ?? 0) +
        (state.arbitrage?.estimateCostOfRepairs ?? 0) +
        (state.arbitrage?.furnitureCost ?? 0) +
        (state.arbitrage?.otherStartupCosts ?? 0) +
        (state.loan.rehabCosts || 0)
      : (state.loan.downPayment || 0) +
        (state.loan.closingCosts || 0) +
        (state.loan.rehabCosts || 0) +
        (state.operationType === "Short Term Rental"
          ? state.arbitrage?.furnitureCost || 0
          : 0) +
        state.subjectTo.paymentToSeller;

  // Calculate annual cash flow (Year 1 steady state)
  const monthlyIncome = computeIncome(state);
  const monthlyFixedOps = computeFixedMonthlyOps(state.ops);
  const monthlyVariableOps = computeVariableExpenseFromPercentages(
    monthlyIncome,
    state.ops
  );
  const monthlyDebtService = totalMonthlyDebtService({
    newLoanMonthly: state.loan.monthlyPayment || 0,
    subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
    hybridMonthly: state.hybrid?.monthlyPayment,
  });

  const annualCashFlow =
    (monthlyIncome - monthlyFixedOps - monthlyVariableOps - monthlyDebtService) * 12;
  
  // Total cash flows over holding period (simplified - no growth assumed)
  const totalCashFlows = annualCashFlow * holdingPeriod;

  // Calculate exit proceeds
  const appreciationRate =
    (state.appreciation?.appreciationPercentPerYear || 3) / 100;
  const futureValue =
    state.purchasePrice * Math.pow(1 + appreciationRate, holdingPeriod);

  // Selling costs (default 6% per industry standard)
  const sellingCostsPct = 0.06;
  const sellingCosts = futureValue * sellingCostsPct;

  // Calculate remaining loan balance
  const loanAmount = computeLoanAmount(state);
  let remainingBalance = 0;

  if (loanAmount > 0 && !state.loan.interestOnly) {
    // Use remainingPrincipalAfterPayments utility
    const spec: LoanSpec = {
      principal: loanAmount,
      annualRate: (state.loan.annualInterestRate || 0) / 100,
      termMonths: (state.loan.amortizationYears || 30) * 12,
      interestOnly: state.loan.interestOnly || false,
    };
    
    const paymentsMatched = holdingPeriod * 12;
    try {
      remainingBalance = remainingPrincipalAfterPayments(spec, paymentsMatched);
    } catch (error) {
      // If payments exceed term, loan is paid off
      remainingBalance = 0;
    }
  } else if (state.loan.interestOnly) {
    // Interest-only: full principal remains
    remainingBalance = loanAmount;
  }

  const netSaleProceeds = futureValue - sellingCosts - remainingBalance;

  // Total return = operating cash flows + exit proceeds
  const totalReturn = totalCashFlows + netSaleProceeds;

  // MOIC = Total Return / Cash Invested
  const moic = cashInvested > 0 ? totalReturn / cashInvested : 0;

  return {
    moic,
    breakdown: {
      cashInvested,
      totalCashFlows,
      exitProceeds: {
        futureValue,
        sellingCosts,
        remainingBalance,
        netSaleProceeds,
      },
      totalReturn,
    },
  };
}

/**
 * Calculates 1031 Exchange metrics including deferred gains, boot, and carryover basis
 * @param inputs - 1031 Exchange input parameters
 * @param capitalGainsTaxRate - Federal + State capital gains tax rate (default 20%)
 * @returns Comprehensive 1031 exchange calculation results
 */
function calculate1031Exchange(
  inputs: Exchange1031Inputs,
  capitalGainsTaxRate: number = 20
): Exchange1031Inputs {
  if (!inputs.enabled) {
    return inputs;
  }

  // Calculate realized gain on relinquished property
  const realizedGain = inputs.relinquishedPropertyValue - inputs.relinquishedPropertyBasis;

  // Calculate equity in relinquished property
  const relinquishedEquity = inputs.relinquishedPropertyValue - inputs.relinquishedPropertyMortgage;

  // Calculate equity in replacement property
  const replacementEquity = inputs.replacementPropertyValue - inputs.replacementPropertyMortgage;

  // Calculate cash boot (if receiving cash)
  // Positive boot occurs when replacement value < relinquished value
  const cashBoot = Math.max(0, relinquishedEquity - replacementEquity);

  // Calculate mortgage boot (if debt is reduced)
  // Mortgage boot = debt relief (when replacement debt < relinquished debt)
  const mortgageBoot = Math.max(0, inputs.relinquishedPropertyMortgage - inputs.replacementPropertyMortgage);

  // Total boot (taxable portion)
  const totalBoot = cashBoot + mortgageBoot;

  // Recognized gain (taxable) = lesser of realized gain or total boot
  const recognizedGain = Math.min(realizedGain, totalBoot);

  // Deferred gain = realized gain - recognized gain
  const deferredGain = Math.max(0, realizedGain - recognizedGain);

  // Carryover basis calculation
  // New basis = cost of replacement property - deferred gain + recognized gain
  // Or alternatively: original basis - cash paid + debt assumed + boot recognized
  const carryoverBasis = inputs.replacementPropertyValue - deferredGain;

  // Calculate total taxable gain (recognized gain)
  const totalTaxableGain = recognizedGain;

  // Estimate tax liability
  // Includes capital gains tax on recognized gain
  const capitalGainsTax = (recognizedGain * capitalGainsTaxRate) / 100;
  
  // Depreciation recapture on recognized gain (25% rate on depreciation portion)
  const depreciationRecaptureAmount = Math.min(
    recognizedGain,
    inputs.relinquishedPropertyDepreciation
  );
  const depreciationRecaptureTax = (depreciationRecaptureAmount * 25) / 100;

  const estimatedTaxLiability = capitalGainsTax + depreciationRecaptureTax;

  // Net proceeds to reinvest (equity minus boot and costs)
  const totalExchangeCosts = inputs.qualifiedIntermediaryFee + inputs.otherExchangeCosts;
  const netProceedsToReinvest = relinquishedEquity - cashBoot - totalExchangeCosts;

  return {
    ...inputs,
    deferredGain,
    recognizedGain,
    carryoverBasis,
    cashBoot,
    mortgageBoot,
    totalTaxableGain,
    estimatedTaxLiability,
    netProceedsToReinvest,
  };
}

/**
 * Calculates the 1031 exchange deadlines based on the relinquished property closing date
 * @param closingDate - Date string in format YYYY-MM-DD
 * @returns Object with identification and closing deadlines
 */
function calculate1031Deadlines(closingDate: string): {
  identificationDeadline: string;
  closingDeadline: string;
} {
  if (!closingDate) {
    return {
      identificationDeadline: '',
      closingDeadline: '',
    };
  }

  try {
    const closing = new Date(closingDate);
    
    // 45-day identification deadline
    const identification = new Date(closing);
    identification.setDate(identification.getDate() + 45);
    
    // 180-day closing deadline
    const finalClosing = new Date(closing);
    finalClosing.setDate(finalClosing.getDate() + 180);
    
    return {
      identificationDeadline: identification.toISOString().split('T')[0],
      closingDeadline: finalClosing.toISOString().split('T')[0],
    };
  } catch (error) {
    return {
      identificationDeadline: '',
      closingDeadline: '',
    };
  }
}

// Helper function to check if cash-on-cash calculation is valid
function isCashOnCashValid(state: DealState): boolean {
  const invested =
    state.operationType === "Rental Arbitrage"
      ? (state.arbitrage?.deposit ?? 0) +
        (state.arbitrage?.estimateCostOfRepairs ?? 0) +
        (state.arbitrage?.furnitureCost ?? 0) +
        (state.arbitrage?.otherStartupCosts ?? 0) +
        (state.loan.rehabCosts || 0)
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

function getOperationTypeOptions(propertyType: PropertyType, calculatorMode?: CalculatorMode): OperationType[] {
  let baseOptions: OperationType[] = [];
  
  if (propertyType === "Hotel") {
    baseOptions = ["Short Term Rental", "Rental Arbitrage"];
  } else if (propertyType === "Land") {
    // Land logic is intentionally non-additive for operations: raw land is modeled as hold/improve/exit scenarios only
    baseOptions = ["Buy & Hold", "Fix & Flip", "BRRRR"];
  } else if (propertyType === "Office" || propertyType === "Retail") {
    // Commercial: allow B&H, F&F, Arbitrage, BRRRR. Remove STR for Office/Retail.
    baseOptions = ["Buy & Hold", "Fix & Flip", "Rental Arbitrage", "BRRRR"];
  } else {
    baseOptions = [
      "Buy & Hold",
      "Fix & Flip",
      "Short Term Rental",
      "Rental Arbitrage",
      "BRRRR",
    ];
  }

  // Apply calculator mode restrictions
  if (calculatorMode === "essential") {
    // Essential mode: Only "Buy & Hold"
    return baseOptions.filter(op => 
      op === "Buy & Hold"
    );
  } else if (calculatorMode === "standard") {
    // Standard mode: Adds "Short Term Rental"
    return baseOptions.filter(op => 
      op === "Buy & Hold" || 
      op === "Short Term Rental"
    );
  }
  
  // Professional mode: All options available
  return baseOptions;
}

// Helper function to filter property types based on calculator mode
function getPropertyTypeOptions(calculatorMode?: CalculatorMode): PropertyType[] {
  const allPropertyTypes: PropertyType[] = [
    "Single Family",
    "Multi Family", 
    "Hotel",
    "Land",
    "Office",
    "Retail"
  ];

  if (calculatorMode === "essential") {
    // Essential mode: Only "Single Family" and "Land"
    return ["Single Family", "Land"];
  } else if (calculatorMode === "standard") {
    // Standard mode: Adds "Multi Family"
    return ["Single Family", "Land", "Multi Family"];
  }
  
  // Professional mode: All property types available
  return allPropertyTypes;
}

// Helper function to filter finance types based on calculator mode
function filterFinanceTypesByMode(options: OfferType[], calculatorMode?: CalculatorMode): OfferType[] {
  if (!calculatorMode) return options;
  
  if (calculatorMode === "essential") {
    // Essential mode: Only "Conventional" and "FHA"
    return options.filter(option => 
      option === "Conventional" || 
      option === "FHA"
    );
  } else if (calculatorMode === "standard") {
    // Standard mode: Adds "DSCR"
    return options.filter(option => 
      option === "Conventional" || 
      option === "FHA" ||
      option === "DSCR"
    );
  }
  
  // Professional mode: All options available
  return options;
}

function getOfferTypeOptions(
  propertyType: PropertyType,
  operationType: OperationType,
  calculatorMode?: CalculatorMode,
): OfferType[] {
  let baseOptions: OfferType[] = [];
  
  // First handle Land so that subsequent operation-based narrowing does not affect logic
  if (propertyType === "Land") {
    if (operationType === "Fix & Flip" || operationType === "BRRRR") {
      // Allow Hard Money for improvement/refi paths
      baseOptions = [
        "Cash",
        "Hard Money",
        "Private",
        "Seller Finance",
        "Line of Credit",
      ];
    } else {
      // Buy & Hold raw land: conventional/DSCR/FHA/SBA typically not applicable in this model
      baseOptions = ["Cash", "Seller Finance", "Private", "Line of Credit"];
    }
  } else if (operationType === "Rental Arbitrage") {
    // Rental Arbitrage: only Cash / Private / Line of Credit (plus optional Seller Finance)
    baseOptions = ["Cash", "Private", "Line of Credit", "Seller Finance"];
  } else if (operationType === "Fix & Flip") {
    // Fix & Flip: include Subject-To, Hybrid, Line of Credit; remove SBA
    baseOptions = [
      "Seller Finance",
      "Hard Money",
      "Private",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  } else if (operationType === "BRRRR") {
    // BRRRR: Only Cash/Hard Money/Private/Seller Finance/Subject-To/Hybrid/LOC
    baseOptions = [
      "Cash",
      "Hard Money",
      "Private",
      "Seller Finance",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  } else if (
    operationType === "Buy & Hold" &&
    (propertyType === "Single Family" || propertyType === "Multi Family")
  ) {
    // Buy & Hold (SFR/Multi): keep broad retail + creative options
    baseOptions = [
      "FHA",
      "Cash",
      "Seller Finance",
      "Conventional",
      "DSCR",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  } else if (
    operationType === "Buy & Hold" &&
    (propertyType === "Office" || propertyType === "Retail")
  ) {
    // Commercial (Office/Retail): allow conventional, DSCR, SBA in addition to existing options
    baseOptions = [
      "Cash",
      "Seller Finance",
      "Conventional",
      "DSCR",
      "SBA",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  } else {
    // Default for Hotel STR etc.
    baseOptions = [
      "Cash",
      "Seller Finance",
      "Conventional",
      "DSCR",
      "Subject To Existing Mortgage",
      "Hybrid",
      "Line of Credit",
    ];
  }
  
  // Apply calculator mode filtering
  return filterFinanceTypesByMode(baseOptions, calculatorMode);
}

// Note: Variable expense calculations now use computeVariableExpenseFromPercentages()
// imported from utils/finance.ts for consistency across the codebase

function Kpi(props: { label: string; value: string }) {
  return (
    <Box sx={{ border: "1px solid brandColors.borders.secondary", borderRadius: 1, p: 1 }}>
      <Typography variant="caption" sx={{ color: brandColors.neutral[800] }}>
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
  calculatorMode: "standard", // Default to standard mode
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
    totalInterest: 0,
    totalPayment: 0,
    amortizationSchedule: [],
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
    loanAmount: 0,
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
    amortizationSchedule: [],
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
  enhancedSTR: {
    averageDailyRate: 150,
    occupancyRate: 75,
    channelFees: {
      airbnb: 14, // 14% Airbnb host fee
      vrbo: 8, // 8% VRBO commission
      direct: 0, // 0% for direct bookings
    },
    channelMix: {
      airbnb: 60, // 60% of bookings via Airbnb
      vrbo: 30, // 30% via VRBO
      direct: 10, // 10% direct bookings
    },
    averageLengthOfStay: 3, // 3 nights average
    turnoverDays: 1, // 1 day between guests for cleaning
    minimumStay: 2, // 2 night minimum
    blockedDays: 30, // 30 days owner usage/maintenance per year
    dynamicPricing: true,
    weekendPremium: 20, // 20% premium for weekend nights
    useEnhancedModel: false, // Disabled by default, user can enable
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
  enhancedTaxConfig: {
    propertyTaxDeduction: true,
    mortgageInterestDeduction: true,
    depreciationDeduction: true,
    repairExpenseDeduction: true,
    taxBracket: 24,
    taxStrategy: "standard",
    capitalGainsTaxRate: 20,
    depreciationRecaptureRate: 25,
    stateIncomeTaxRate: 0,
    qualifiedBusinessIncomeDeduction: true,
  },
  useEnhancedTaxCalculation: false, // Default to legacy calculation
  // Advanced Analysis Results - initialized as undefined
  exitStrategyResults: undefined,
  refinanceScenarioResults: undefined,
  taxImplicationResults: undefined,
  riskScoreResults: undefined,
  confidenceIntervalResults: undefined,
  inflationProjections: undefined,
  // IRR Configuration Defaults
  irrHoldPeriodYears: 5, // Default 5-year hold
  irrIncomeGrowthRate: 2, // 2% annual income growth
  irrExpenseGrowthRate: 3, // 3% annual expense growth
  irrSellingCostsPct: 7, // 7% selling costs (agent + closing)
  showIrrCashFlowBreakdown: false, // Hidden by default
  // Capital Events Defaults
  capitalEvents: {
    events: [],
    totalExpectedCost: 0,
    averageAnnualCost: 0,
  },
  // Confidence Intervals Defaults
  showConfidenceIntervals: false, // Disabled by default
  uncertaintyParameters: {
    incomeUncertainty: 0.15, // ±15% income uncertainty
    expenseUncertainty: 0.10, // ±10% expense uncertainty
    occupancyUncertainty: 0.10, // ±10% occupancy uncertainty
    appreciationUncertainty: 0.20, // ±20% appreciation uncertainty
    confidenceLevel: 80, // 80% confidence interval (10th-90th percentile)
  },
  // 1031 Exchange Defaults
  exchange1031: {
    enabled: false,
    relinquishedPropertyValue: 0,
    relinquishedPropertyBasis: 0,
    relinquishedPropertyDepreciation: 0,
    relinquishedPropertyMortgage: 0,
    replacementPropertyValue: 0,
    replacementPropertyMortgage: 0,
    qualifiedIntermediaryFee: 1500,
    otherExchangeCosts: 500,
    identificationDeadline: '',
    closingDeadline: '',
    deferredGain: 0,
    recognizedGain: 0,
    carryoverBasis: 0,
    cashBoot: 0,
    mortgageBoot: 0,
    totalTaxableGain: 0,
    estimatedTaxLiability: 0,
    netProceedsToReinvest: 0,
  },
  proFormaAuto: true,
  validationMessages: [],
  showAmortizationOverride: false,
  snackbarOpen: false,
  city: "",
  state: "",
  proForma: {
    taxes: 0,
    insurance: 0,
    maintenance: 0,
    vacancy: 0,
    management: 0,
    capEx: 0,
    opEx: 0,
  },
  // Toggle states for advanced features
  proFormaEnabled: false,
  advancedModelingEnabled: false,
  cashFlowProjectionsEnabled: false,
};

const UnderwritePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Calculator Mode Management
  const { mode: calculatorMode, setMode: setCalculatorMode, isEssential, isStandard, isProfessional } = useCalculatorMode();
  
  // Regional Adjustment State
  const [regionalAdjustmentEnabled, setRegionalAdjustmentEnabled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('national-average');
  
  // Custom Presets State
  const [customProFormaPresets, setCustomProFormaPresets] = useState<Array<{
    id: string;
    name: string;
    description?: string;
    maintenance: number;
    vacancy: number;
    management: number;
    capEx: number;
    opEx: number;
    createdAt: Date;
  }>>([]);
  
  // Guided Tour State
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  
  function validateAndNormalizeState(input: DealState): {
    next: DealState;
    messages: string[];
  } {
    const messages: string[] = [];
    // Ensure operation type valid for property type
    const allowedOps = getOperationTypeOptions(input.propertyType, input.calculatorMode);
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
      input.calculatorMode,
    );
    let offerType = input.offerType;
    if (!allowedOffers.includes(offerType)) {
      offerType = allowedOffers[0];
      messages.push(
        `Finance Type reset to offerType for input.propertyType + operationType.`,
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

  const [showMessages, setShowMessages] = useState(false);

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

  // Sync calculator mode with state
  useEffect(() => {
    if (state.calculatorMode !== calculatorMode) {
      setState(prev => ({ ...prev, calculatorMode }));
    }
  }, [calculatorMode, state.calculatorMode]);

  // Memoize amortization schedule used across sections to avoid recomputation
  const amortizationAll = useMemo(() => {
    const amount = state.loan?.loanAmount || 0;
    const rate = state.loan?.annualInterestRate || 0;
    const years = state.loan?.amortizationYears || 0;
    const io = state.loan?.interestOnly || false;
    const ioPeriod = state.loan?.ioPeriodMonths || 0;
    if (amount <= 0 || years <= 0) return [] as Array<{ index: number; payment: number; interest: number; principal: number; balance: number; isIOPhase?: boolean }>;
    return buildAmortization(amount, rate, years, io, undefined, ioPeriod);
  }, [state.loan?.loanAmount, state.loan?.annualInterestRate, state.loan?.amortizationYears, state.loan?.interestOnly, state.loan?.ioPeriodMonths]);

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

  // Windowed rendering controls for large amortization table
  const [amortRowsToShow, setAmortRowsToShow] = useState<number>(240);

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
              `Operation Type reset to candidate.operationType for currentProperty.`,
            ];
          }
        }

        // Validate offer type for the combination
        const offers = getOfferTypeOptions(
          currentProperty,
          candidate.operationType as OperationType,
          calculatorMode,
        );
        if (!offers.includes(candidate.offerType)) {
          candidate.offerType = offers[0];
          candidate.validationMessages = [
            ...(candidate.validationMessages || []),
            `Finance Type reset to candidate.offerType for currentProperty + candidate.operationType.`,
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
              `Pro Forma Auto-Apply disabled: Changing key === "propertyType" ? "property type" : "operation type" would overwrite your manual Pro Forma edits. Auto-apply has been disabled to protect your custom values. You can re-enable it in the Pro Forma settings if desired.`,
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
  
  // Custom Preset Handlers
  const handleSaveCustomPreset = (name: string, description?: string) => {
    const newPreset = {
      id: Date.now().toString(),
      name,
      description,
      maintenance: state.ops.maintenance,
      vacancy: state.ops.vacancy,
      management: state.ops.management,
      capEx: state.ops.capEx,
      opEx: state.ops.opEx,
      createdAt: new Date(),
    };
    setCustomProFormaPresets(prev => [...prev, newPreset]);
    
    // Save to localStorage
    try {
      const existingPresets = JSON.parse(localStorage.getItem('dreamery-custom-presets') || '[]');
      localStorage.setItem('dreamery-custom-presets', JSON.stringify([...existingPresets, newPreset]));
    } catch (error) {
      console.warn('Failed to save custom preset to localStorage:', error);
    }
  };
  
  const handleDeleteCustomPreset = (id: string) => {
    setCustomProFormaPresets(prev => prev.filter(p => p.id !== id));
    
    // Remove from localStorage
    try {
      const existingPresets = JSON.parse(localStorage.getItem('dreamery-custom-presets') || '[]');
      localStorage.setItem('dreamery-custom-presets', JSON.stringify(existingPresets.filter((p: any) => p.id !== id)));
    } catch (error) {
      console.warn('Failed to delete custom preset from localStorage:', error);
    }
  };
  
  const handleApplyPreset = (preset: { maintenance: number; vacancy: number; management: number; capEx: number; opEx: number }, presetName: string) => {
    updateOps('maintenance', preset.maintenance);
    updateOps('vacancy', preset.vacancy);
    updateOps('management', preset.management);
    updateOps('capEx', preset.capEx);
    updateOps('opEx', preset.opEx);
    
    setState((prev) => ({
      ...prev,
      validationMessages: [`Applied ${presetName} preset to operating expenses`],
      snackbarOpen: true,
    }));
  };
  
  // Load custom presets from localStorage on mount
  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('dreamery-custom-presets');
      if (savedPresets) {
        setCustomProFormaPresets(JSON.parse(savedPresets));
      }
    } catch (error) {
      console.warn('Failed to load custom presets from localStorage:', error);
    }
  }, []);
  
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
          q1: seasonalVariations.q1,
          q2: seasonalVariations.q2,
          q3: seasonalVariations.q3,
          q4: seasonalVariations.q4,
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
          loanAmount: 0,
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
          amortizationSchedule: [],
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

  // Reset handler functions for individual accordions
  function resetBasicInfo() {
    setState((prev) => ({
      ...prev,
      agentOwner: defaultState.agentOwner,
      propertyAddress: defaultState.propertyAddress,
      email: defaultState.email,
      call: defaultState.call,
      listedPrice: defaultState.listedPrice,
      purchasePrice: defaultState.purchasePrice,
      propertyType: defaultState.propertyType,
      operationType: defaultState.operationType,
      offerType: defaultState.offerType,
      city: defaultState.city,
      state: defaultState.state,
    }));
  }

  function resetSubjectTo() {
    setState((prev) => ({
      ...prev,
      subjectTo: { ...defaultState.subjectTo },
    }));
  }

  function resetSellerFinance() {
    // Seller finance fields are stored in state.loan when offerType is "Seller Finance"
    setState((prev) => ({
      ...prev,
      loan: { ...defaultState.loan },
    }));
  }

  function resetHybridFinancing() {
    setState((prev) => ({
      ...prev,
      hybrid: { ...defaultState.hybrid },
    }));
  }

  function resetCosts() {
    setState((prev) => ({
      ...prev,
      loan: {
        ...prev.loan,
        closingCosts: defaultState.loan.closingCosts,
        rehabCosts: defaultState.loan.rehabCosts,
      },
    }));
  }

  function resetLoanCosts() {
    setState((prev) => ({
      ...prev,
      loan: JSON.parse(JSON.stringify(defaultState.loan)),
      arbitrage: JSON.parse(JSON.stringify(defaultState.arbitrage)),
    }));
  }

  function resetIncome() {
    setState((prev) => ({
      ...prev,
      sfr: JSON.parse(JSON.stringify(defaultState.sfr)),
      multi: JSON.parse(JSON.stringify(defaultState.multi)),
      str: JSON.parse(JSON.stringify(defaultState.str)),
      enhancedSTR: JSON.parse(JSON.stringify(defaultState.enhancedSTR)),
      officeRetail: JSON.parse(JSON.stringify(defaultState.officeRetail)),
      land: JSON.parse(JSON.stringify(defaultState.land)),
    }));
  }

  function resetOperatingExpenses() {
    setState((prev) => ({
      ...prev,
      ops: { ...defaultState.ops },
    }));
  }

  function resetProForma() {
    setState((prev) => ({
      ...prev,
      ops: {
        ...prev.ops,
        maintenance: defaultState.ops.maintenance,
        vacancy: defaultState.ops.vacancy,
        management: defaultState.ops.management,
        capEx: defaultState.ops.capEx,
        opEx: defaultState.ops.opEx,
      },
    }));
  }

  function resetAppreciation() {
    setState((prev) => ({
      ...prev,
      appreciation: { ...defaultState.appreciation },
    }));
  }

  function resetFixFlip() {
    setState((prev) => ({
      ...prev,
      fixFlip: JSON.parse(JSON.stringify(defaultState.fixFlip)),
    }));
  }

  function resetBRRRR() {
    setState((prev) => ({
      ...prev,
      brrrr: JSON.parse(JSON.stringify(defaultState.brrrr)),
    }));
  }

  function resetAdvancedAnalysis() {
    setState((prev) => ({
      ...prev,
      marketConditions: defaultState.marketConditions,
      seasonalFactors: defaultState.seasonalFactors,
      propertyAge: defaultState.propertyAge,
      locationFactors: defaultState.locationFactors,
      riskFactors: defaultState.riskFactors,
    }));
  }

  function resetTaxImplications() {
    setState((prev) => ({
      ...prev,
      taxImplications: defaultState.taxImplications,
      enhancedTaxConfig: defaultState.enhancedTaxConfig,
    }));
  }

  function resetCapitalEvents() {
    setState((prev) => ({
      ...prev,
      capitalEvents: { ...defaultState.capitalEvents },
    }));
  }

  function resetExitStrategies() {
    setState((prev) => ({
      ...prev,
      exitStrategies: [...defaultState.exitStrategies],
    }));
  }

  function reset1031Exchange() {
    setState((prev) => ({
      ...prev,
      exchange1031: JSON.parse(JSON.stringify(defaultState.exchange1031)),
    }));
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

  function generatePDFDoc() {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Helper function to add text with line breaks
    const addText = (text: string, x: number, y: number, options?: any) => {
      doc.text(text, x, y, options);
      return y + (options?.lineHeight || 7);
    };
    
    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    yPos = addText("Dreamery Property Analysis", margin, yPos);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = addText(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, yPos + 5);
    
    // Property Information
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    yPos = addText("Property Information", margin, yPos);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    yPos = addText(`Address: ${state.propertyAddress || 'Not specified'}`, margin, yPos);
    yPos = addText(`Property Type: ${state.propertyType}`, margin, yPos);
    yPos = addText(`Operation Type: ${state.operationType}`, margin, yPos);
    yPos = addText(`Finance Type: ${state.offerType}`, margin, yPos);
    
    // Purchase Details
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    yPos = addText("Purchase Details", margin, yPos);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    yPos = addText(`Listed Price: $${state.listedPrice.toLocaleString()}`, margin, yPos);
    yPos = addText(`Purchase Price: $${state.purchasePrice.toLocaleString()}`, margin, yPos);
    if (state.officeRetail?.squareFootage) {
      yPos = addText(`Square Footage: ${state.officeRetail.squareFootage.toLocaleString()} sq ft`, margin, yPos);
    }
    if (state.multi?.unitRents && state.multi.unitRents.length > 1) {
      yPos = addText(`Units: ${state.multi.unitRents.length}`, margin, yPos);
    }
    
    // Financial Metrics
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    yPos = addText("Key Financial Metrics", margin, yPos);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    
    const monthlyIncome = computeIncome(state);
    const monthlyExpenses = computeFixedMonthlyOps(state.ops) + computeVariableExpenseFromPercentages(monthlyIncome, state.ops);
    const monthlyCashFlow = monthlyIncome - monthlyExpenses - (state.loan?.monthlyPayment || 0);
    const annualNOI = (monthlyIncome - computeFixedMonthlyOps(state.ops) - computeVariableExpenseFromPercentages(monthlyIncome, state.ops)) * 12;
    const capRate = state.purchasePrice > 0 ? (annualNOI / state.purchasePrice) * 100 : 0;
    
    yPos = addText(`Monthly Income: $${monthlyIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, margin, yPos);
    yPos = addText(`Monthly Expenses: $${monthlyExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, margin, yPos);
    yPos = addText(`Monthly Cash Flow: $${monthlyCashFlow.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, margin, yPos);
    yPos = addText(`Annual NOI: $${annualNOI.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, margin, yPos);
    yPos = addText(`Cap Rate: ${capRate.toFixed(2)}%`, margin, yPos);
    
    // Loan Details
    if (state.loan && state.loan.loanAmount > 0) {
      yPos += 10;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      yPos = addText("Loan Details", margin, yPos);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos += 5;
      yPos = addText(`Loan Amount: $${state.loan.loanAmount.toLocaleString()}`, margin, yPos);
      yPos = addText(`Down Payment: $${state.loan.downPayment.toLocaleString()}`, margin, yPos);
      yPos = addText(`Interest Rate: ${state.loan.annualInterestRate}%`, margin, yPos);
      yPos = addText(`Monthly Payment: $${(state.loan.monthlyPayment || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, margin, yPos);
    }
    
    // Operating Expenses
    yPos += 10;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    yPos = addText("Operating Expenses", margin, yPos);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    yPos = addText(`Maintenance: ${state.ops.maintenance}%`, margin, yPos);
    yPos = addText(`Vacancy: ${state.ops.vacancy}%`, margin, yPos);
    yPos = addText(`Management: ${state.ops.management}%`, margin, yPos);
    yPos = addText(`CapEx: ${state.ops.capEx}%`, margin, yPos);
    yPos = addText(`OpEx: ${state.ops.opEx}%`, margin, yPos);
    
    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(
        `Generated by Dreamery - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    return doc;
  }

  function exportToPDF() {
    try {
      const doc = generatePDFDoc();
      const fileName = `Dreamery_Analysis_${state.propertyAddress?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setState((prev) => ({
        ...prev,
        validationMessages: ['PDF exported successfully!'],
        snackbarOpen: true,
      }));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setState((prev) => ({
        ...prev,
        validationMessages: ['Error exporting PDF. Please try again.'],
        snackbarOpen: true,
      }));
    }
  }

  function emailPDF() {
    try {
      const doc = generatePDFDoc();
      const fileName = `Dreamery_Analysis_${state.propertyAddress?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Convert PDF to base64 for email attachment
      const pdfBlob = doc.output('blob');
      const pdfDataUri = doc.output('dataurlstring');
      
      // Create mailto link with subject and body
      const subject = encodeURIComponent(`Dreamery Property Analysis - ${state.propertyAddress || 'Property'}`);
      const body = encodeURIComponent(`Please find attached the property analysis for ${state.propertyAddress || 'the property'}.\n\nKey Highlights:\n- Purchase Price: $${state.purchasePrice.toLocaleString()}\n- Property Type: ${state.propertyType}\n- Operation Type: ${state.operationType}\n\nGenerated by Dreamery on ${new Date().toLocaleDateString()}`);
      
      // Open email client
      // Note: Email attachments via mailto: are not supported in most browsers
      // We'll provide instructions to download and attach manually
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      
      // Also download the PDF so user can attach it
      doc.save(fileName);
      
      setState((prev) => ({
        ...prev,
        validationMessages: ['Email client opened! PDF downloaded - please attach it to your email.'],
        snackbarOpen: true,
      }));
    } catch (error) {
      console.error('Error preparing email:', error);
      setState((prev) => ({
        ...prev,
        validationMessages: ['Error preparing email. Please try again.'],
        snackbarOpen: true,
      }));
    }
  }

  function messagePDF() {
    try {
      const doc = generatePDFDoc();
      const fileName = `Dreamery_Analysis_${state.propertyAddress?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Generate PDF blob for messaging
      const pdfBlob = doc.output('blob');
      
      // Download the PDF
      doc.save(fileName);
      
      // Open messaging interface (Professional Support)
      setShowMessages(true);
      
      setState((prev) => ({
        ...prev,
        validationMessages: ['PDF downloaded! Opening messaging to share with your team or professionals.'],
        snackbarOpen: true,
      }));
    } catch (error) {
      console.error('Error preparing message:', error);
      setState((prev) => ({
        ...prev,
        validationMessages: ['Error preparing message. Please try again.'],
        snackbarOpen: true,
      }));
    }
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
              <PageAppBar 
                title="Underwrite Properties with Dreamery" 
                showMessages={showMessages}
                onToggleMessages={() => setShowMessages(!showMessages)}
              />
      {showMessages && <ProfessionalSupportMessages />}
      {!showMessages && (
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

        <Box sx={{ mt: 2 }}>

        {/* Calculator Mode Selector with Help and Export Buttons */}
        <Box sx={{ position: 'relative' }} data-tour="mode-selector">
          <ModeSelector 
            value={calculatorMode}
            onChange={setCalculatorMode}
            showDescription={true}
          />
          <Tooltip title="Take a guided tour" arrow>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowGuidedTour(true)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 'auto',
                px: 1.5,
                py: 0.5,
                borderColor: brandColors.neutral[300],
                color: brandColors.neutral[600],
                fontSize: '0.813rem',
                '&:hover': {
                  borderColor: brandColors.primary,
                  color: brandColors.primary,
                },
              }}
            >
              ? Help
            </Button>
          </Tooltip>
        </Box>

        {/* Live Market Data Widget - Professional Mode Only */}
        {isProfessional && (
          <Box sx={{ mb: 2 }}>
            <LiveMarketDataWidget autoRefreshInterval={5 * 60 * 1000} variant="full" />
          </Box>
        )}

        {/* Guided Tour */}
        <GuidedTour
          isOpen={showGuidedTour}
          onClose={() => setShowGuidedTour(false)}
        />

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

        {/* Upgrade Prompts */}
        {isEssential && (state.offerType === "Subject To Existing Mortgage" || 
                        state.offerType === "Seller Finance" || 
                        state.offerType === "Hybrid") && (
          <UpgradePrompt
            currentMode={calculatorMode}
            targetMode="standard"
            feature="Complex Financing Options"
            description="Subject-To, Seller Finance, and Hybrid financing are available in Standard mode"
            onUpgrade={() => setCalculatorMode('standard')}
          />
        )}
        
        {isStandard && (
          <UpgradePrompt
            currentMode={calculatorMode}
            targetMode="professional"
            feature="Advanced Modeling & Analysis"
            description="Access capital events planning, 1031 exchanges, scenario comparison, and cloud sync"
            onUpgrade={() => setCalculatorMode('professional')}
            variant="info"
          />
        )}

        {/* Basic Info Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }} data-tour="basic-info">
          <Accordion>
            <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700 }}>Basic Info</Typography>
                <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                  <LazyRestartAltIcon 
                    sx={{ 
                      fontSize: 18, 
                      color: 'text.secondary', 
                      cursor: 'pointer',
                      '&:hover': { color: brandColors.neutral[600] },
                      mr: 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      resetBasicInfo();
                    }}
                  />
                </React.Suspense>
              </Box>
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
                    {getPropertyTypeOptions(calculatorMode).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
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
                    {getOperationTypeOptions(state.propertyType, calculatorMode).map((type) => (
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
                      calculatorMode,
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
        {isAccordionVisible(calculatorMode, 'subjectTo') && 
          (state.offerType === "Subject To Existing Mortgage" ||
          state.offerType === "Hybrid") &&
          state.operationType !== "Rental Arbitrage" && (
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <Accordion>
                <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      Subject-To Existing Mortgage
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                      <LazyRestartAltIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: 'text.secondary', 
                          cursor: 'pointer',
                          '&:hover': { color: brandColors.neutral[600] },
                          mr: 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetSubjectTo();
                        }}
                      />
                    </React.Suspense>
                  </Box>
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
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral[800] }}>
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
                          bgcolor: brandColors.neutral[100],
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 2, color: brandColors.neutral[800] }}
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
        {false && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
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
                        sx={{ fontWeight: 600, color: brandColors.neutral[800] }}
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
                              sx={{ color: brandColors.neutral[800] }}
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
        {isAccordionVisible(calculatorMode, 'sellerFinance') && 
          state.offerType === "Seller Finance" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>Seller Finance</Typography>
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetSellerFinance();
                      }}
                    />
                  </React.Suspense>
                </Box>
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
                    <Typography variant="subtitle2" sx={{ color: brandColors.neutral[800] }}>
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
                      {state.loan.interestOnly && (
                        <TextField
                          fullWidth
                          label="Interest-Only Period (months)"
                          type="number"
                          value={state.loan.ioPeriodMonths || 0}
                          onChange={(e) =>
                            updateLoan(
                              "ioPeriodMonths",
                              Math.max(0, parseInt(e.target.value) || 0),
                            )
                          }
                          helperText="Leave as 0 for pure IO loan, or specify months for hybrid IO"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                months
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{
                            min: 0,
                            max: state.loan.amortizationYears * 12,
                          }}
                        />
                      )}
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
                    sx={{ mt: 2, p: 2, bgcolor: brandColors.neutral[100], borderRadius: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral[800] }}
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
        {false && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
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
                              {amortizationAll
                                .slice(0, amortRowsToShow)
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
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 1, gap: 1 }}>
                          <Button size="small" variant="outlined" disabled={amortRowsToShow <= 60} onClick={() => setAmortRowsToShow((n) => Math.max(60, n - 120))}>Show Fewer</Button>
                          <Button size="small" variant="outlined" disabled={amortRowsToShow >= amortizationAll.length} onClick={() => setAmortRowsToShow((n) => Math.min(amortizationAll.length, n + 120))}>Show More</Button>
                        </Box>
                        <Typography
                          variant="caption"
                          align="center"
                          sx={{ color: brandColors.neutral[800] }}
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
        {isAccordionVisible(calculatorMode, 'hybridFinancing') && 
          state.offerType === "Hybrid" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Hybrid Financing
                  </Typography>
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetHybridFinancing();
                      }}
                    />
                  </React.Suspense>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography variant="subtitle2" sx={{ color: brandColors.neutral[800] }}>
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
                    sx={{ mt: 2, p: 2, bgcolor: brandColors.neutral[100], borderRadius: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral[800] }}
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
        {state.offerType === "Cash" && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>Costs</Typography>
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetCosts();
                      }}
                    />
                  </React.Suspense>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Basic Costs - For Cash */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral[800] }}
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
                        sx={{ mb: 2, color: brandColors.neutral[800] }}
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
                        sx={{ mb: 2, color: brandColors.neutral[800] }}
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

                <Box sx={{ mt: 3, p: 2, bgcolor: brandColors.neutral[100], borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral[800] }}>
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
                      label={state.operationType === "Rental Arbitrage" ? "Property Value (Ref Only)" : "Purchase Price"}
                      value={formatCurrency(state.operationType === "Rental Arbitrage" ? 0 : state.purchasePrice || 0)}
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
                        (state.operationType === "Rental Arbitrage"
                          ? 0
                          : state.purchasePrice || 0) +
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
                <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      {state.operationType === "Rental Arbitrage"
                        ? "Startup Costs"
                        : "Loan & Costs"}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                      <LazyRestartAltIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: 'text.secondary', 
                          cursor: 'pointer',
                          '&:hover': { color: brandColors.neutral[600] },
                          mr: 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetLoanCosts();
                        }}
                      />
                    </React.Suspense>
                  </Box>
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
                    <Box sx={{ color: brandColors.neutral[800] }}>
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
                <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                  <Typography sx={{ fontWeight: 700 }}>
                    Amortization Schedule
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
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

                    {state.loan.interestOnly && state.loan.ioPeriodMonths && state.loan.ioPeriodMonths > 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Hybrid IO Loan: {state.loan.ioPeriodMonths} month IO period
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                          • IO Payment: {formatCurrency((state.loan.loanAmount * state.loan.annualInterestRate / 100) / 12)} (months 1-{state.loan.ioPeriodMonths})
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          • Amortizing Payment: {formatCurrency(
                            monthlyPayment(
                              state.loan.loanAmount,
                              state.loan.annualInterestRate,
                              (state.loan.amortizationYears * 12 - state.loan.ioPeriodMonths) / 12,
                              false
                            )
                          )} (months {state.loan.ioPeriodMonths + 1}-{state.loan.amortizationYears * 12})
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: brandColors.accent.error, mt: 0.5 }}>
                          ⚠️ Payment increases by {formatCurrency(
                            monthlyPayment(
                              state.loan.loanAmount,
                              state.loan.annualInterestRate,
                              (state.loan.amortizationYears * 12 - state.loan.ioPeriodMonths) / 12,
                              false
                            ) - ((state.loan.loanAmount * state.loan.annualInterestRate / 100) / 12)
                          )} after IO period
                        </Typography>
                      </Alert>
                    )}
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
                            undefined,
                            state.loan.ioPeriodMonths,
                          ).map((row) => (
                            <TableRow 
                              key={row.index}
                              sx={{
                                bgcolor: row.isIOPhase 
                                  ? brandColors.backgrounds.tertiary 
                                  : 'inherit',
                                borderLeft: row.isIOPhase 
                                  ? `3px solid ${brandColors.accent.warning}` 
                                  : row.index === (state.loan.ioPeriodMonths || 0) + 1
                                    ? `3px solid ${brandColors.accent.success}`
                                    : 'none',
                              }}
                            >
                              <TableCell>{row.index}</TableCell>
                              <TableCell>
                                {formatCurrency(row.payment)}
                                {row.index === (state.loan.ioPeriodMonths || 0) + 1 && state.loan.ioPeriodMonths && (
                                  <Chip 
                                    label="Amort Starts" 
                                    size="small" 
                                    color="success" 
                                    sx={{ ml: 1 }}
                                  />
                                )}
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
                      sx={{ color: brandColors.neutral[800] }}
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
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Appreciation Calculator
                  </Typography>
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAppreciation();
                      }}
                    />
                  </React.Suspense>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {/* Balloon Payment Integration Indicator */}
                {state.offerType &&
                  [
                    "Seller Finance",
                    "Subject To Existing Mortgage",
                    "Hybrid",
                  ].includes(state.offerType) &&
                  ((state.loan?.balloonDue ?? 0) > 0 ||
                    state.subjectTo?.loans?.some(
                      (loan) => (loan.balloonDue ?? 0) > 0,
                    ) ||
                    (state.hybrid?.balloonDue ?? 0) > 0 ||
                    state.hybrid?.subjectToLoans?.some(
                      (loan) => (loan.balloonDue ?? 0) > 0,
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
                            : brandColors.neutral[800],
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
                            : brandColors.neutral[800],
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
                            ((state.loan?.balloonDue ?? 0) > 0 ||
                              state.subjectTo?.loans?.some(
                                (loan) => (loan.balloonDue ?? 0) > 0,
                              ) ||
                              (state.hybrid?.balloonDue ?? 0) > 0 ||
                              state.hybrid?.subjectToLoans?.some(
                                (loan) => (loan.balloonDue ?? 0) > 0,
                              ))
                          ? `Auto-set based on balloon payment due date`
                          : "Number of years to hold the property for appreciation analysis"
                    }
                  />
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: brandColors.neutral[100], borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral[800] }}>
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
                    border: "1px solid brandColors.neutral[400]",
                    bgcolor: 'inherit',
                  }}
                  style={{ backgroundColor: brandColors.neutral[100] }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, color: brandColors.neutral[800], fontWeight: 600 }}
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
                      bgcolor: 'inherit',
                    }}
                    style={{ backgroundColor: brandColors.neutral[200] }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: brandColors.neutral[800], fontWeight: 600 }}
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
                        border: "1px solid brandColors.neutral[600]",
                        bgcolor: 'inherit',
                      }}
                      style={{ backgroundColor: brandColors.borders.secondary }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, color: brandColors.neutral[800], fontWeight: 600 }}
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
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>Income</Typography>
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetIncome();
                      }}
                    />
                  </React.Suspense>
                </Box>
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
                            label={`Unit index + 1 ${state.propertyType === "Hotel" || state.operationType === "Short Term Rental" ? "Nightly Rate" : "Monthly Rent"}`}
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
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral[800] }}>
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
                      <Typography variant="subtitle2" sx={{ color: brandColors.neutral[800] }}>
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
                    {state.propertyType === "Single Family" &&
                    state.operationType !== "Short Term Rental" &&
                    state.operationType !== "Rental Arbitrage" ? (
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
                    ) : state.propertyType !== "Single Family" ||
                      (state.operationType !== "Short Term Rental" &&
                       state.operationType !== "Rental Arbitrage") ? (
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
                    ) : null}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>

        {/* Operating Expenses Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }} data-tour="operating-expenses">
          <Accordion>
            <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700 }}>
                  Operating Expenses
                </Typography>
                <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                  <LazyRestartAltIcon 
                    sx={{ 
                      fontSize: 18, 
                      color: 'text.secondary', 
                      cursor: 'pointer',
                      '&:hover': { color: brandColors.neutral[600] },
                      mr: 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      resetOperatingExpenses();
                    }}
                  />
                </React.Suspense>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" sx={{ mb: 2, color: brandColors.neutral[800] }}>
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
                sx={{ mt: 4, mb: 2, color: brandColors.neutral[800] }}
              >
                Variable Expenses (% of Income)
              </Typography>
              
              {/* Pro Forma Preset Selector */}
              <ProFormaPresetSelector
                currentValues={{
                  maintenance: state.ops.maintenance,
                  vacancy: state.ops.vacancy,
                  management: state.ops.management,
                  capEx: state.ops.capEx,
                  opEx: state.ops.opEx,
                }}
                onApplyPreset={handleApplyPreset}
                regionalAdjustment={{
                  enabled: regionalAdjustmentEnabled,
                  region: selectedRegion,
                }}
                customPresets={customProFormaPresets}
                onSaveCustomPreset={handleSaveCustomPreset}
                onDeleteCustomPreset={handleDeleteCustomPreset}
                variant="full"
              />
              
              {/* Regional Adjustment Panel - Professional Mode Only */}
              {isProfessional && (
                <Box sx={{ mb: 3 }}>
                  <RegionalAdjustmentPanel
                    enabled={regionalAdjustmentEnabled}
                    onEnabledChange={setRegionalAdjustmentEnabled}
                    selectedRegion={selectedRegion}
                    onRegionChange={setSelectedRegion}
                    propertyAddress={state.propertyAddress}
                    autoDetect={isEssential}
                    variant="full"
                  />
                </Box>
              )}
              
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
                      ? `Auto-calculated based on state.fixFlip.holdingPeriodMonths month holding period (calculateFixFlipVacancyRate(state.fixFlip.holdingPeriodMonths)%)`
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
        {/* Risk Assessment Section (disabled in favor of Analyze page) */}
        {false && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
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
                    backgroundColor: brandColors.backgrounds.warning,
                    borderRadius: 1,
                    border: "1px solid brandColors.accent.warningLight",
                    fontSize: "0.875rem",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.accent.warning, fontWeight: 500 }}
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
                        label={`${state.riskScoreResults!.overallRiskScore}/10`}
                        color={
                          state.riskScoreResults!.overallRiskScore <= 3
                            ? "success"
                            : state.riskScoreResults!.overallRiskScore <= 5
                              ? "warning"
                              : state.riskScoreResults!.overallRiskScore <= 7
                                ? "error"
                                : "error"
                        }
                        variant="filled"
                        sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: brandColors.neutral[800], fontWeight: 500 }}
                      >
                        {state.riskScoreResults!.riskCategory}
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
                          sx={{ fontWeight: 600, color: brandColors.accent.warning }}
                        >
                          {state.riskScoreResults!.riskBreakdown.marketRisk}/10
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
                          sx={{ fontWeight: 600, color: brandColors.accent.warning }}
                        >
                          {state.riskScoreResults!.riskBreakdown.propertyRisk}/10
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
                          sx={{ fontWeight: 600, color: brandColors.accent.warning }}
                        >
                          {state.riskScoreResults!.riskBreakdown.tenantRisk}/10
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
                          sx={{ fontWeight: 600, color: brandColors.accent.warning }}
                        >
                          {state.riskScoreResults!.riskBreakdown.financingRisk}
                          /10
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
                          Location Risk
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 600, color: brandColors.accent.warning }}
                        >
                          {state.riskScoreResults!.riskBreakdown.locationRisk}/10
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: brandColors.backgrounds.warning,
                        borderRadius: 1,
                        border: "1px solid brandColors.accent.warningLight",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: brandColors.accent.warning, mb: 1 }}
                      >
                        Key Recommendations:
                      </Typography>
                      {state.riskScoreResults!.recommendations
                        .slice(0, 3)
                        .map((rec, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{ mb: 0.5, color: brandColors.accent.warningDark }}
                          >
                            - {rec}
                          </Typography>
                        ))}
                    </Box>

                    {/* ML-Enhanced Risk Prediction */}
                    <MLRiskPredictionDisplay dealState={state} />
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
                      "&:hover": { backgroundColor: brandColors.primaryDark },
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
        )}

        {/* Cash Flow Projections */}
        {isAccordionVisible(calculatorMode, 'cashFlowProjections') && (
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyExpandMoreIcon />
              </React.Suspense>
            }>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700 }}>
                  Cash Flow Projections
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.cashFlowProjectionsEnabled || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          setState((prev) => ({
                            ...prev,
                            cashFlowProjectionsEnabled: e.target.checked,
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label="Enable"
                  />
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add reset function for cash flow projections if needed
                      }}
                    />
                  </React.Suspense>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2 }}>
                {state.cashFlowProjectionsEnabled && (
                  <CashFlowProjectionsTab dealState={state} />
                )}

                {!state.cashFlowProjectionsEnabled && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      Enable Cash Flow Projections to access detailed year-by-year financial analysis, 
                      Monte Carlo simulations, capital events planning, and advanced growth modeling.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>
        )}

        {/* 1031 Exchange Calculator */}
        {isAccordionVisible(calculatorMode, 'exchange1031') && (
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyExpandMoreIcon />
              </React.Suspense>
            }>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700 }}>
                  1031 Exchange Calculator
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.exchange1031?.enabled || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          setState((prev) => ({
                            ...prev,
                            exchange1031: {
                              ...(prev.exchange1031 || defaultState.exchange1031!),
                              enabled: e.target.checked,
                            },
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label="Enable"
                  />
                  <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                    <LazyRestartAltIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: 'text.secondary', 
                        cursor: 'pointer',
                        '&:hover': { color: brandColors.neutral[600] },
                        mr: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add reset function for 1031 exchange if needed
                      }}
                    />
                  </React.Suspense>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2 }}>
                {state.exchange1031?.enabled && (
                  <>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        1031 Exchange Requirements:
                      </Typography>
                      <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
                        <li>Identify replacement property within 45 days of closing</li>
                        <li>Close on replacement property within 180 days of closing</li>
                        <li>Use a qualified intermediary (cannot touch proceeds)</li>
                        <li>Purchase equal or greater value to defer all gains</li>
                        <li>Reinvest all equity to avoid taxable boot</li>
                      </Typography>
                    </Alert>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                      Relinquished Property (Selling)
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Property Sale Value"
                        type="number"
                        value={state.exchange1031?.relinquishedPropertyValue || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                relinquishedPropertyValue: value,
                              },
                            };
                            // Recalculate
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Sale price of property being sold"
                      />

                      <TextField
                        fullWidth
                        label="Adjusted Basis"
                        type="number"
                        value={state.exchange1031?.relinquishedPropertyBasis || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                relinquishedPropertyBasis: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Original cost + improvements - depreciation"
                      />

                      <TextField
                        fullWidth
                        label="Total Depreciation Taken"
                        type="number"
                        value={state.exchange1031?.relinquishedPropertyDepreciation || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                relinquishedPropertyDepreciation: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Total depreciation deducted over ownership"
                      />

                      <TextField
                        fullWidth
                        label="Existing Mortgage Balance"
                        type="number"
                        value={state.exchange1031?.relinquishedPropertyMortgage || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                relinquishedPropertyMortgage: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Outstanding loan balance at closing"
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                      Replacement Property (Buying)
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Purchase Price"
                        type="number"
                        value={state.exchange1031?.replacementPropertyValue || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                replacementPropertyValue: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Purchase price of replacement property"
                      />

                      <TextField
                        fullWidth
                        label="New Mortgage Amount"
                        type="number"
                        value={state.exchange1031?.replacementPropertyMortgage || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                replacementPropertyMortgage: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="New loan amount on replacement property"
                      />

                      <TextField
                        fullWidth
                        label="Qualified Intermediary Fee"
                        type="number"
                        value={state.exchange1031?.qualifiedIntermediaryFee || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                qualifiedIntermediaryFee: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Fee for 1031 exchange facilitator"
                      />

                      <TextField
                        fullWidth
                        label="Other Exchange Costs"
                        type="number"
                        value={state.exchange1031?.otherExchangeCosts || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setState((prev) => {
                            const updated = {
                              ...prev,
                              exchange1031: {
                                ...(prev.exchange1031 || defaultState.exchange1031!),
                                otherExchangeCosts: value,
                              },
                            };
                            const taxRate = prev.enhancedTaxConfig?.taxBracket || 20;
                            updated.exchange1031 = calculate1031Exchange(updated.exchange1031!, taxRate);
                            return updated;
                          });
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Legal fees, title, etc."
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                      Exchange Analysis Results
                    </Typography>

                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
                      gap: 2,
                      mb: 3,
                      p: 2,
                      backgroundColor: brandColors.backgrounds.secondary,
                      borderRadius: 1,
                    }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Deferred Gain
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.successDark }}>
                          ${(state.exchange1031?.deferredGain || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tax deferred to future sale
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Recognized Gain (Boot)
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: (state.exchange1031?.recognizedGain || 0) > 0 
                            ? brandColors.accent.warning 
                            : brandColors.accent.successDark 
                        }}>
                          ${(state.exchange1031?.recognizedGain || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Taxable portion this year
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Estimated Tax Liability
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: (state.exchange1031?.estimatedTaxLiability || 0) > 0 
                            ? brandColors.neutral[700] 
                            : brandColors.neutral[600] 
                        }}>
                          ${(state.exchange1031?.estimatedTaxLiability || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Capital gains + recapture tax
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Carryover Basis
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ${(state.exchange1031?.carryoverBasis || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          New property tax basis
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Cash Boot
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700,
                          color: (state.exchange1031?.cashBoot || 0) > 0 ? brandColors.neutral[700] : 'text.primary'
                        }}>
                          ${(state.exchange1031?.cashBoot || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Equity not reinvested
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Mortgage Boot
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700,
                          color: (state.exchange1031?.mortgageBoot || 0) > 0 ? brandColors.neutral[700] : 'text.primary'
                        }}>
                          ${(state.exchange1031?.mortgageBoot || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Debt relief (taxable)
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Net Proceeds to Reinvest
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
                          ${(state.exchange1031?.netProceedsToReinvest || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Available for down payment
                        </Typography>
                      </Box>
                    </Box>

                    {/* Trading Up Scenario Analysis */}
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: 
                        (state.exchange1031?.replacementPropertyValue || 0) >= (state.exchange1031?.relinquishedPropertyValue || 0) &&
                        (state.exchange1031?.replacementPropertyMortgage || 0) >= (state.exchange1031?.relinquishedPropertyMortgage || 0)
                          ? brandColors.neutral[200] 
                          : brandColors.neutral[300],
                      borderRadius: 1,
                      mb: 2,
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Exchange Status
                      </Typography>
                      {(state.exchange1031?.replacementPropertyValue || 0) >= (state.exchange1031?.relinquishedPropertyValue || 0) &&
                       (state.exchange1031?.replacementPropertyMortgage || 0) >= (state.exchange1031?.relinquishedPropertyMortgage || 0) ? (
                        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                          ✓ Trading Up: Replacement property value and debt meet or exceed relinquished property. 
                          All gains can be deferred if all equity is reinvested.
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: brandColors.neutral[700] }}>
                          ⚠ Trading Down: Replacement property value or debt is less than relinquished property. 
                          This will result in taxable boot of ${((state.exchange1031?.cashBoot || 0) + (state.exchange1031?.mortgageBoot || 0)).toLocaleString()}.
                        </Typography>
                      )}
                    </Box>

                    {/* Timeline Requirements */}
                    <Box sx={{ p: 2, backgroundColor: brandColors.neutral[100], borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Critical Timeline Requirements
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Day 1-45: Identification Period
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Must identify replacement property in writing to qualified intermediary within 45 days of closing on relinquished property.
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Day 1-180: Exchange Period
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Must close on replacement property within 180 days of closing on relinquished property (or tax return due date, whichever is earlier).
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                {!state.exchange1031?.enabled && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      Enable the 1031 Exchange Calculator to model like-kind exchange scenarios and calculate deferred capital gains.
                      A 1031 exchange allows you to defer capital gains taxes when selling an investment property by reinvesting the proceeds into a similar property.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>
        )}
        {/* Pro Forma Analysis - Moved to before Advanced Analysis */}
        {isAccordionVisible(calculatorMode, 'proFormaAnalysis') && (
          <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
            <Accordion>
              <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Pro Forma Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.proFormaEnabled || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            setState((prev) => ({
                              ...prev,
                              proFormaEnabled: e.target.checked,
                            }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="Enable"
                    />
                    <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                      <LazyRestartAltIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: 'text.secondary', 
                          cursor: 'pointer',
                          '&:hover': { color: brandColors.neutral[600] },
                          mr: 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetProForma();
                        }}
                      />
                    </React.Suspense>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2 }}>
                  {state.proFormaEnabled && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Section Description */}
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: brandColors.backgrounds.selected,
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
                          color: brandColors.neutral[800],
                          "&.Mui-selected": {
                            color: brandColors.primary,
                            fontWeight: 700,
                            backgroundColor: brandColors.backgrounds.selected,
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
                            color: brandColors.neutral[800],
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
                          color: brandColors.neutral[800],
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
                                `Preset name.trim() saved successfully!`,
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
                          backgroundColor: brandColors.neutral[100],
                          borderRadius: 1,
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: brandColors.neutral[800], mb: 1 }}
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
                                    sx={{ color: brandColors.accent.error }}
                                  >
                                    <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyDeleteIcon fontSize="small" />
                </React.Suspense>
                                  </IconButton>
                                </Box>
                                {preset.description && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: brandColors.neutral[800],
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
                            sx={{ color: brandColors.neutral[800], fontStyle: "italic" }}
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
                                      ? brandColors.neutral[100]
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
                          sx={{ color: brandColors.neutral[800], mb: 2 }}
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
                                          ? brandColors.accent.error
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
                            backgroundColor: brandColors.neutral[100],
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
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
                                            {annualRevenue.toLocaleString()}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ color: brandColors.neutral[800] }}
                                          >
                                            {monthlyRevenue.toLocaleString()}/mo
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
                            backgroundColor: brandColors.neutral[100],
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.neutral[800], mb: 1 }}
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
                              sx={{ color: brandColors.neutral[800] }}
                            >
                              Minimum occupancy needed to cover costs
                            </Typography>
                          </Card>

                          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.info }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: brandColors.accent.info, mb: 1 }}
                            >
                              Break-Even ADR
                            </Typography>
                            <Typography variant="h6" sx={{ color: brandColors.accent.info }}>
                              {calculateBreakEvenADR().toFixed(0)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: brandColors.neutral[800] }}
                            >
                              Minimum daily rate needed to cover costs
                            </Typography>
                          </Card>

                          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.success }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: brandColors.accent.successDark, mb: 1 }}
                            >
                              Margin of Safety
                            </Typography>
                            <Typography variant="h6" sx={{ color: brandColors.accent.successDark }}>
                              {calculateMarginOfSafety().toFixed(1)}%
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: brandColors.neutral[800] }}
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
                                          ? brandColors.backgrounds.success
                                          : brandColors.backgrounds.error,
                                      }}
                                    >
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        {occupancy}%
                                      </TableCell>
                                      <TableCell>
                                        revenue.toLocaleString()
                                      </TableCell>
                                      <TableCell>
                                        fixedCosts.toLocaleString()
                                      </TableCell>
                                      <TableCell>
                                        variableCosts.toLocaleString()
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: isProfitable
                                            ? brandColors.accent.success
                                            : brandColors.accent.error,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        netIncome.toLocaleString()
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
                            backgroundColor: brandColors.backgrounds.warning,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: brandColors.accent.warning, mb: 1 }}
                          >
                            <strong>Pro Forma Integration:</strong>
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: brandColors.accent.warning }}
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
                  )}

                  {!state.proFormaEnabled && (
                    <Alert severity="info">
                      <Typography variant="body2">
                        Enable the Pro Forma Analysis to access comprehensive financial projections, 
                        sensitivity analysis, and industry benchmark comparisons for your property investment.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {/* Advanced Modeling - Professional Mode Only */}
        {isAccordionVisible(calculatorMode, 'advancedModeling') && (
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
          <Accordion>
            <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Advanced Modeling & Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.advancedModelingEnabled || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            setState((prev) => ({
                              ...prev,
                              advancedModelingEnabled: e.target.checked,
                            }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="Enable"
                    />
                    <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                      <LazyRestartAltIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: 'text.secondary', 
                          cursor: 'pointer',
                          '&:hover': { color: brandColors.neutral[600] },
                          mr: 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add reset function for advanced modeling if needed
                        }}
                      />
                    </React.Suspense>
                  </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2 }}>
                {state.advancedModelingEnabled && (
                  <>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Access comprehensive modeling tools including seasonal adjustments, exit strategies, 
                        tax implications, refinance scenarios, risk analysis, and scenario comparison.
                        </Typography>
                    </Alert>
              
                    {/* Wrap AdvancedModelingTab in its own AnalysisProvider */}
                    <AnalysisProvider>
                      <AdvancedModelingTab />
                    </AnalysisProvider>
                  </>
                )}

                {!state.advancedModelingEnabled && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      Enable Advanced Modeling to access comprehensive analysis tools including seasonal adjustments, 
                      exit strategies, tax implications, refinance scenarios, and risk analysis.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>
        )}

        {/* Advanced Analysis Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }} data-tour="results">
          <Accordion>
            <AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700 }}>At a Glance</Typography>
                <React.Suspense fallback={<Box sx={{ width: 18, height: 18 }} />}>
                  <LazyRestartAltIcon 
                    sx={{ 
                      fontSize: 18, 
                      color: 'text.secondary', 
                      cursor: 'pointer',
                      '&:hover': { color: brandColors.neutral[600] },
                      mr: 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAdvancedAnalysis();
                    }}
                  />
                </React.Suspense>
              </Box>
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

                {/* Confidence Intervals Section */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: brandColors.backgrounds.tertiary,
                    borderRadius: 2,
                    border: `1px solid ${brandColors.borders.primary}`,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: brandColors.primary,
                          fontSize: "0.9rem",
                        }}
                      >
                        Confidence Intervals
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Show ranges instead of point estimates to communicate uncertainty
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.showConfidenceIntervals || false}
                          onChange={(e) => {
                            setState((prev) => ({
                              ...prev,
                              showConfidenceIntervals: e.target.checked,
                            }));
                          }}
                        />
                      }
                      label="Show Ranges"
                    />
                  </Box>

                  {state.showConfidenceIntervals && (
                    <>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="caption">
                          <strong>{state.uncertaintyParameters.confidenceLevel}% Confidence Interval</strong> - Shows pessimistic (low), expected (base), and optimistic (high) scenarios based on uncertainty assumptions.
                          Income: ±{(state.uncertaintyParameters.incomeUncertainty * 100).toFixed(0)}%, 
                          Expenses: ±{(state.uncertaintyParameters.expenseUncertainty * 100).toFixed(0)}%, 
                          Appreciation: ±{(state.uncertaintyParameters.appreciationUncertainty * 100).toFixed(0)}%
                        </Typography>
                      </Alert>

                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                      >
                        {/* Cash-on-Cash Return with CI */}
                        <Box>
                          <TextField
                            fullWidth
                            label="Cash-on-Cash Return (with Range)"
                            value={(() => {
                              const cocCI = calculateCoCWithConfidence(state);
                              return formatConfidenceInterval(cocCI, true);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Low - Base - High (80% confidence)"
                          />
                          <LinearProgress
                            variant="determinate"
                            value={50}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: brandColors.accent.error + '30',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: brandColors.accent.success,
                              },
                            }}
                          />
                        </Box>

                        {/* NOI with CI */}
                        <Box>
                          <TextField
                            fullWidth
                            label="Annual NOI (with Range)"
                            value={(() => {
                              const noiCI = calculateNOIWithConfidence(state);
                              return formatConfidenceInterval(noiCI, false, true);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Low - Base - High (80% confidence)"
                          />
                          <LinearProgress
                            variant="determinate"
                            value={50}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: brandColors.accent.error + '30',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: brandColors.accent.success,
                              },
                            }}
                          />
                        </Box>

                        {/* Cap Rate with CI */}
                        <Box>
                          <TextField
                            fullWidth
                            label="Cap Rate (with Range)"
                            value={(() => {
                              const capRateCI = calculateCapRateWithConfidence(state);
                              return formatConfidenceInterval(capRateCI, true);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Low - Base - High (80% confidence)"
                          />
                          <LinearProgress
                            variant="determinate"
                            value={50}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: brandColors.accent.error + '30',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: brandColors.accent.success,
                              },
                            }}
                          />
                        </Box>

                        {/* ROI with CI */}
                        <Box>
                          <TextField
                            fullWidth
                            label="ROI (with Range)"
                            value={(() => {
                              const roiCI = calculateROIWithConfidence(state);
                              return formatConfidenceInterval(roiCI, true);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Low - Base - High (80% confidence)"
                          />
                          <LinearProgress
                            variant="determinate"
                            value={50}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: brandColors.accent.error + '30',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: brandColors.accent.success,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </>
                  )}
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
                            computeVariableExpenseFromPercentages(
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
                      label="Cap Rate"
                      value={(() => {
                        const annualNOI =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            computeVariableExpenseFromPercentages(
                              computeIncome(state),
                              state.ops,
                            )) *
                          12;
                        return state.purchasePrice > 0
                          ? ((annualNOI / state.purchasePrice) * 100).toFixed(2) + "%"
                          : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Annual NOI ÷ Purchase Price (Unlevered Return)"
                    />
                    <TextField
                      fullWidth
                      label="DSCR (Y1)"
                      value={(() => {
                        const annualNOI =
                          (computeIncome(state) -
                            computeFixedMonthlyOps(state.ops) -
                            computeVariableExpenseFromPercentages(
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
                            computeVariableExpenseFromPercentages(
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
                            computeVariableExpenseFromPercentages(
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
                            computeVariableExpenseFromPercentages(
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
                              computeVariableExpenseFromPercentages(
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
                              computeVariableExpenseFromPercentages(
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
                        const holdingPeriod = state.irrHoldPeriodYears || 5;
                        const result = calculateComprehensiveMOIC(state, holdingPeriod);
                        return result.moic > 0 ? result.moic.toFixed(2) + "x" : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Total Return (Cash Flows + Exit) ÷ Cash Invested"
                    />
                    
                    {/* MOIC Breakdown */}
                    <Box
                      sx={{
                        gridColumn: "1 / -1",
                        p: 2,
                        bgcolor: brandColors.backgrounds.secondary,
                        borderRadius: 1,
                        border: `1px solid ${brandColors.borders.primary}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        MOIC Breakdown
                      </Typography>
                      {(() => {
                        const holdingPeriod = state.irrHoldPeriodYears || 5;
                        const result = calculateComprehensiveMOIC(state, holdingPeriod);
                        const { breakdown } = result;
                        
                        return (
                          <Box sx={{ display: "grid", gap: 1.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" color="text.secondary">
                                Total Cash Invested:
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatCurrency(breakdown.cashInvested)}
                              </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" color="text.secondary">
                                Operating Cash Flows ({holdingPeriod} years):
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatCurrency(breakdown.totalCashFlows)}
                              </Typography>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Future Property Value:
                                </Typography>
                                <Typography variant="caption">
                                  {formatCurrency(breakdown.exitProceeds.futureValue)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Less: Selling Costs (6%):
                                </Typography>
                                <Typography variant="caption" color={brandColors.neutral[700]}>
                                  -{formatCurrency(breakdown.exitProceeds.sellingCosts)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Less: Remaining Loan:
                                </Typography>
                                <Typography variant="caption" color={brandColors.neutral[700]}>
                                  -{formatCurrency(breakdown.exitProceeds.remainingBalance)}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" color="text.secondary">
                                Net Exit Proceeds:
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatCurrency(breakdown.exitProceeds.netSaleProceeds)}
                              </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" fontWeight={600}>
                                Total Return:
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color={brandColors.neutral[800]}>
                                {formatCurrency(breakdown.totalReturn)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, p: 1, bgcolor: brandColors.backgrounds.tertiary, borderRadius: 1 }}>
                              <Typography variant="body1" fontWeight={700}>
                                Equity Multiple (MOIC):
                              </Typography>
                              <Typography variant="body1" fontWeight={700} color={brandColors.neutral[800]}>
                                {result.moic > 0 ? result.moic.toFixed(2) + "x" : "N/A"}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                              Formula: (Operating Cash Flows + Net Exit Proceeds) ÷ Cash Invested
                            </Typography>
                          </Box>
                        );
                      })()}
                    </Box>
                    
                    {/* IRR Configuration Parameters */}
                    <Box
                      sx={{
                        gridColumn: "1 / -1",
                        p: 2,
                        bgcolor: brandColors.backgrounds.tertiary,
                        borderRadius: 1,
                        border: `1px solid ${brandColors.borders.primary}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        IRR Assumptions (Configurable)
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Hold Period (Years)"
                          type="number"
                          value={state.irrHoldPeriodYears}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(30, Number(e.target.value)));
                            setState((prev) => ({
                              ...prev,
                              irrHoldPeriodYears: val,
                            }));
                          }}
                          inputProps={{ min: 1, max: 30, step: 1 }}
                          helperText="Years before property sale (1-30)"
                        />
                        <TextField
                          fullWidth
                          label="Income Growth Rate (%)"
                          type="number"
                          value={state.irrIncomeGrowthRate}
                          onChange={(e) => {
                            const val = Math.max(-10, Math.min(20, Number(e.target.value)));
                            setState((prev) => ({
                              ...prev,
                              irrIncomeGrowthRate: val,
                            }));
                          }}
                          inputProps={{ min: -10, max: 20, step: 0.1 }}
                          helperText="Annual income growth (-10% to +20%)"
                        />
                        <TextField
                          fullWidth
                          label="Expense Growth Rate (%)"
                          type="number"
                          value={state.irrExpenseGrowthRate}
                          onChange={(e) => {
                            const val = Math.max(-10, Math.min(20, Number(e.target.value)));
                            setState((prev) => ({
                              ...prev,
                              irrExpenseGrowthRate: val,
                            }));
                          }}
                          inputProps={{ min: -10, max: 20, step: 0.1 }}
                          helperText="Annual expense growth (-10% to +20%)"
                        />
                        <TextField
                          fullWidth
                          label="Selling Costs (%)"
                          type="number"
                          value={state.irrSellingCostsPct}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(15, Number(e.target.value)));
                            setState((prev) => ({
                              ...prev,
                              irrSellingCostsPct: val,
                            }));
                          }}
                          inputProps={{ min: 0, max: 15, step: 0.1 }}
                          helperText="Agent commissions + closing costs (0-15%)"
                        />
                      </Box>
                    </Box>

                    {/* Capital Events Section */}
                    {isAccordionVisible(calculatorMode, 'capitalEvents') && (
                    <Box
                      sx={{
                        gridColumn: "1 / -1",
                        p: 2,
                        bgcolor: brandColors.backgrounds.tertiary,
                        borderRadius: 1,
                        border: `1px solid ${brandColors.borders.primary}`,
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Capital Events Planning
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              const propertyAge = state.propertyAge?.age || 15;
                              const templates = generateCapitalEventTemplates(propertyAge, state.purchasePrice);
                              const metrics = calculateCapitalEventMetrics(templates, state.irrHoldPeriodYears);
                              setState((prev) => ({
                                ...prev,
                                capitalEvents: {
                                  events: templates,
                                  ...metrics,
                                },
                              }));
                            }}
                          >
                            Load Templates
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              const newEvent: CapitalEvent = {
                                id: `event-${Date.now()}`,
                                year: 1,
                                description: '',
                                estimatedCost: 0,
                                category: 'other',
                                likelihood: 50,
                              };
                              setState((prev) => {
                                const newEvents = [...prev.capitalEvents.events, newEvent];
                                const metrics = calculateCapitalEventMetrics(newEvents, prev.irrHoldPeriodYears);
                                return {
                                  ...prev,
                                  capitalEvents: {
                                    events: newEvents,
                                    ...metrics,
                                  },
                                };
                              });
                            }}
                          >
                            Add Event
                          </Button>
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                        Track major capital expenditures beyond annual CapEx reserves for more realistic long-term projections
                      </Typography>

                      {/* Capital Events Table */}
                      {state.capitalEvents.events.length > 0 && (
                        <Box sx={{ mb: 2, overflowX: "auto" }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Year</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Est. Cost</TableCell>
                                <TableCell align="right">Likelihood</TableCell>
                                <TableCell align="right">Expected</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {state.capitalEvents.events.map((event) => (
                                <TableRow key={event.id}>
                                  <TableCell>
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={event.year}
                                      onChange={(e) => {
                                        const val = Math.max(1, Math.min(30, Number(e.target.value)));
                                        setState((prev) => {
                                          const updatedEvents = prev.capitalEvents.events.map((ev) =>
                                            ev.id === event.id ? { ...ev, year: val } : ev
                                          );
                                          const metrics = calculateCapitalEventMetrics(updatedEvents, prev.irrHoldPeriodYears);
                                          return {
                                            ...prev,
                                            capitalEvents: {
                                              events: updatedEvents,
                                              ...metrics,
                                            },
                                          };
                                        });
                                      }}
                                      inputProps={{ min: 1, max: 30, step: 1 }}
                                      sx={{ width: 80 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      size="small"
                                      value={event.category}
                                      onChange={(e) => {
                                        setState((prev) => {
                                          const updatedEvents = prev.capitalEvents.events.map((ev) =>
                                            ev.id === event.id ? { ...ev, category: e.target.value as CapitalEvent['category'] } : ev
                                          );
                                          const metrics = calculateCapitalEventMetrics(updatedEvents, prev.irrHoldPeriodYears);
                                          return {
                                            ...prev,
                                            capitalEvents: {
                                              events: updatedEvents,
                                              ...metrics,
                                            },
                                          };
                                        });
                                      }}
                                      sx={{ minWidth: 120 }}
                                    >
                                      <MenuItem value="roof">Roof</MenuItem>
                                      <MenuItem value="hvac">HVAC</MenuItem>
                                      <MenuItem value="foundation">Foundation</MenuItem>
                                      <MenuItem value="electrical">Electrical</MenuItem>
                                      <MenuItem value="plumbing">Plumbing</MenuItem>
                                      <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      value={event.description}
                                      onChange={(e) => {
                                        setState((prev) => {
                                          const updatedEvents = prev.capitalEvents.events.map((ev) =>
                                            ev.id === event.id ? { ...ev, description: e.target.value } : ev
                                          );
                                          const metrics = calculateCapitalEventMetrics(updatedEvents, prev.irrHoldPeriodYears);
                                          return {
                                            ...prev,
                                            capitalEvents: {
                                              events: updatedEvents,
                                              ...metrics,
                                            },
                                          };
                                        });
                                      }}
                                      placeholder="Description"
                                      sx={{ minWidth: 200 }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={event.estimatedCost}
                                      onChange={(e) => {
                                        const val = Math.max(0, Number(e.target.value));
                                        setState((prev) => {
                                          const updatedEvents = prev.capitalEvents.events.map((ev) =>
                                            ev.id === event.id ? { ...ev, estimatedCost: val } : ev
                                          );
                                          const metrics = calculateCapitalEventMetrics(updatedEvents, prev.irrHoldPeriodYears);
                                          return {
                                            ...prev,
                                            capitalEvents: {
                                              events: updatedEvents,
                                              ...metrics,
                                            },
                                          };
                                        });
                                      }}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                      sx={{ width: 120 }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={event.likelihood}
                                      onChange={(e) => {
                                        const val = Math.max(0, Math.min(100, Number(e.target.value)));
                                        setState((prev) => {
                                          const updatedEvents = prev.capitalEvents.events.map((ev) =>
                                            ev.id === event.id ? { ...ev, likelihood: val } : ev
                                          );
                                          const metrics = calculateCapitalEventMetrics(updatedEvents, prev.irrHoldPeriodYears);
                                          return {
                                            ...prev,
                                            capitalEvents: {
                                              events: updatedEvents,
                                              ...metrics,
                                            },
                                          };
                                        });
                                      }}
                                      InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                      }}
                                      inputProps={{ min: 0, max: 100, step: 1 }}
                                      sx={{ width: 90 }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2">
                                      {formatCurrency(event.estimatedCost * event.likelihood / 100)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        setState((prev) => {
                                          const updatedEvents = prev.capitalEvents.events.filter((ev) => ev.id !== event.id);
                                          const metrics = calculateCapitalEventMetrics(updatedEvents, prev.irrHoldPeriodYears);
                                          return {
                                            ...prev,
                                            capitalEvents: {
                                              events: updatedEvents,
                                              ...metrics,
                                            },
                                          };
                                        });
                                      }}
                                    >
                                      <React.Suspense fallback={<span>×</span>}>
                                        <LazyDeleteIcon />
                                      </React.Suspense>
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      )}

                      {/* Summary Metrics */}
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          mt: 2,
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Total Expected Cost"
                          value={formatCurrency(state.capitalEvents.totalExpectedCost)}
                          InputProps={{ readOnly: true }}
                          helperText="Sum of all events weighted by likelihood"
                        />
                        <TextField
                          fullWidth
                          label="Average Annual Impact"
                          value={formatCurrency(state.capitalEvents.averageAnnualCost)}
                          InputProps={{ readOnly: true }}
                          helperText={`Amortized over ${state.irrHoldPeriodYears} years`}
                        />
                      </Box>
                    </Box>
                    )}
                    
                    <TextField
                      fullWidth
                      label="IRR (Levered)"
                      value={(() => {
                        try {
                          // Calculate initial investment (negative cash flow)
                          const totalCashInvested =
                            state.loan.downPayment +
                            (state.loan.closingCosts || 0) +
                            (state.loan.rehabCosts || 0) +
                            (state.operationType === "Short Term Rental"
                              ? state.arbitrage?.furnitureCost || 0
                              : 0);
                          
                          if (totalCashInvested <= 0) return "N/A";
                          
                          // Build year-by-year cash flows (levered) - uses state.irrHoldPeriodYears
                          const cashFlows = buildCashFlowProjections(state, true);
                          
                          // Calculate exit proceeds (levered) - uses state.irrHoldPeriodYears
                          const exitProceeds = calculateExitProceeds(state, true);
                          
                          // Calculate true IRR using Newton-Raphson
                          const irr = calculateTrueIRR(
                            -totalCashInvested, // Negative = cash outflow
                            cashFlows,
                            exitProceeds
                          );
                          
                          return (irr * 100).toFixed(1) + "%";
                        } catch (error) {
                          console.error("Error calculating levered IRR:", error);
                          return "N/A";
                        }
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Internal Rate of Return (Levered) - True IRR with Newton-Raphson"
                    />
                    <TextField
                      fullWidth
                      label="IRR (Unlevered)"
                      value={(() => {
                        try {
                          // Calculate initial investment for all-cash purchase (negative cash flow)
                          const totalCashInvested =
                            state.purchasePrice +
                            (state.loan.closingCosts || 0) +
                            (state.loan.rehabCosts || 0) +
                            (state.operationType === "Short Term Rental"
                              ? state.arbitrage?.furnitureCost || 0
                              : 0);
                          
                          if (totalCashInvested <= 0) return "N/A";
                          
                          // Build year-by-year cash flows (unlevered = no debt) - uses state.irrHoldPeriodYears
                          const cashFlows = buildCashFlowProjections(state, false);
                          
                          // Calculate exit proceeds (unlevered = no loan payoff) - uses state.irrHoldPeriodYears
                          const exitProceeds = calculateExitProceeds(state, false);
                          
                          // Calculate true IRR using Newton-Raphson
                          const irr = calculateTrueIRR(
                            -totalCashInvested, // Negative = cash outflow
                            cashFlows,
                            exitProceeds
                          );
                          
                          return (irr * 100).toFixed(1) + "%";
                        } catch (error) {
                          console.error("Error calculating unlevered IRR:", error);
                          return "N/A";
                        }
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Internal Rate of Return (Unlevered) - True IRR with Newton-Raphson"
                    />
                    
                    {/* IRR Sensitivity Analysis */}
                    <Box
                      sx={{
                        gridColumn: "1 / -1",
                        p: 2,
                        bgcolor: brandColors.backgrounds.tertiary,
                        borderRadius: 1,
                        border: `1px solid ${brandColors.borders.primary}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        IRR Sensitivity Analysis
                      </Typography>
                      <Box sx={{ display: "grid", gap: 2 }}>
                        {/* Hold Period Sensitivity */}
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
                            IRR by Hold Period (Levered)
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {[3, 5, 7, 10, 15].map((years) => {
                              try {
                                const testState = { ...state, irrHoldPeriodYears: years };
                                const cashFlows = buildCashFlowProjections(testState, true);
                                const exitProceeds = calculateExitProceeds(testState, true);
                                const totalInvestment = state.loan.downPayment + (state.loan.closingCosts || 0) + (state.loan.rehabCosts || 0);
                                const irr = calculateTrueIRR(-totalInvestment, cashFlows, exitProceeds);
                                return (
                                  <Box
                                    key={years}
                                    sx={{
                                      px: 2,
                                      py: 1,
                                      bgcolor: years === state.irrHoldPeriodYears ? brandColors.neutral[800] : brandColors.backgrounds.secondary,
                                      color: years === state.irrHoldPeriodYears ? "white" : "text.primary",
                                      borderRadius: 1,
                                      textAlign: "center",
                                    }}
                                  >
                                    <Typography variant="caption">{years}yr</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {(irr * 100).toFixed(1)}%
                                    </Typography>
                                  </Box>
                                );
                              } catch {
                                return null;
                              }
                            })}
                          </Box>
                        </Box>
                        
                        {/* Appreciation Sensitivity */}
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
                            IRR by Appreciation Rate (Levered, {state.irrHoldPeriodYears}yr hold)
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {[0, 2, 3, 5, 7].map((appRate) => {
                              try {
                                const testState = {
                                  ...state,
                                  appreciation: { ...state.appreciation, appreciationPercentPerYear: appRate },
                                };
                                const cashFlows = buildCashFlowProjections(testState, true);
                                const exitProceeds = calculateExitProceeds(testState, true);
                                const totalInvestment = state.loan.downPayment + (state.loan.closingCosts || 0) + (state.loan.rehabCosts || 0);
                                const irr = calculateTrueIRR(-totalInvestment, cashFlows, exitProceeds);
                                return (
                                  <Box
                                    key={appRate}
                                    sx={{
                                      px: 2,
                                      py: 1,
                                      bgcolor: appRate === (state.appreciation?.appreciationPercentPerYear || 3) ? brandColors.neutral[800] : brandColors.backgrounds.secondary,
                                      color: appRate === (state.appreciation?.appreciationPercentPerYear || 3) ? "white" : "text.primary",
                                      borderRadius: 1,
                                      textAlign: "center",
                                    }}
                                  >
                                    <Typography variant="caption">{appRate}% App</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {(irr * 100).toFixed(1)}%
                                    </Typography>
                                  </Box>
                                );
                              } catch {
                                return null;
                              }
                            })}
                          </Box>
                        </Box>
                        
                        {/* Income Growth Sensitivity */}
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
                            IRR by Income Growth Rate (Levered, {state.irrHoldPeriodYears}yr hold)
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {[0, 2, 3, 4, 6].map((growthRate) => {
                              try {
                                const testState = { ...state, irrIncomeGrowthRate: growthRate };
                                const cashFlows = buildCashFlowProjections(testState, true);
                                const exitProceeds = calculateExitProceeds(testState, true);
                                const totalInvestment = state.loan.downPayment + (state.loan.closingCosts || 0) + (state.loan.rehabCosts || 0);
                                const irr = calculateTrueIRR(-totalInvestment, cashFlows, exitProceeds);
                                return (
                                  <Box
                                    key={growthRate}
                                    sx={{
                                      px: 2,
                                      py: 1,
                                      bgcolor: growthRate === state.irrIncomeGrowthRate ? brandColors.neutral[800] : brandColors.backgrounds.secondary,
                                      color: growthRate === state.irrIncomeGrowthRate ? "white" : "text.primary",
                                      borderRadius: 1,
                                      textAlign: "center",
                                    }}
                                  >
                                    <Typography variant="caption">{growthRate}% Growth</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {(irr * 100).toFixed(1)}%
                                    </Typography>
                                  </Box>
                                );
                              } catch {
                                return null;
                              }
                            })}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Year-by-Year Cash Flow Breakdown */}
                    <Box sx={{ gridColumn: "1 / -1" }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            showIrrCashFlowBreakdown: !prev.showIrrCashFlowBreakdown,
                          }))
                        }
                        sx={{ mb: state.showIrrCashFlowBreakdown ? 2 : 0 }}
                      >
                        {state.showIrrCashFlowBreakdown ? "Hide" : "Show"} Year-by-Year Cash Flow Projections
                      </Button>
                      
                      {state.showIrrCashFlowBreakdown && (() => {
                        try {
                          const leveredCashFlows = buildCashFlowProjections(state, true);
                          const unleveredCashFlows = buildCashFlowProjections(state, false);
                          const leveredExit = calculateExitProceeds(state, true);
                          const unleveredExit = calculateExitProceeds(state, false);
                          
                          return (
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: brandColors.backgrounds.secondary,
                                borderRadius: 1,
                                border: `1px solid ${brandColors.borders.secondary}`,
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                Cash Flow Projections ({state.irrHoldPeriodYears} Year Hold)
                              </Typography>
                              <Box
                                sx={{
                                  display: "grid",
                                  gap: 1,
                                  gridTemplateColumns: { xs: "1fr", md: "auto 1fr 1fr 1fr" },
                                  "& > *": { py: 1, px: 2 },
                                }}
                              >
                                {/* Header Row */}
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  Year
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  Levered Cash Flow
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  Unlevered Cash Flow
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  Notes
                                </Typography>
                                
                                {/* Year Rows */}
                                {leveredCashFlows.map((leveredCF, idx) => {
                                  const year = idx + 1;
                                  const capitalEventCost = getCapitalEventsForYear(state.capitalEvents.events, year);
                                  const capitalEvents = state.capitalEvents.events.filter(e => e.year === year);
                                  
                                  return (
                                    <React.Fragment key={idx}>
                                      <Typography variant="body2">
                                        {year}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: leveredCF >= 0 ? brandColors.neutral[800] : brandColors.neutral[700] }}>
                                        {formatCurrency(leveredCF)}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: unleveredCashFlows[idx] >= 0 ? brandColors.neutral[800] : brandColors.neutral[700] }}>
                                        {formatCurrency(unleveredCashFlows[idx])}
                                      </Typography>
                                      <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                                        {idx === 0 ? "Base year" : `+${state.irrIncomeGrowthRate}% income, +${state.irrExpenseGrowthRate}% expenses`}
                                        {capitalEventCost > 0 && (
                                          <span style={{ color: brandColors.accent.warning, display: 'block', marginTop: 4 }}>
                                            Capital Events: {formatCurrency(capitalEventCost)}
                                            {capitalEvents.length > 0 && ` (${capitalEvents.map(e => e.category).join(', ')})`}
                                          </span>
                                        )}
                                      </Typography>
                                    </React.Fragment>
                                  );
                                })}
                                
                                {/* Exit Row */}
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Exit (Yr {state.irrHoldPeriodYears})
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.neutral[800] }}>
                                  {formatCurrency(leveredExit)}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.neutral[800] }}>
                                  {formatCurrency(unleveredExit)}
                                </Typography>
                                <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                                  After {state.appreciation?.appreciationPercentPerYear || 3}% appreciation & {state.irrSellingCostsPct}% selling costs
                                </Typography>
                              </Box>
                            </Box>
                          );
                        } catch (error) {
                          return (
                            <Typography variant="body2" color="error">
                              Error generating cash flow breakdown
                            </Typography>
                          );
                        }
                      })()}
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="Return on Equity (Year 1)"
                      value={(() => {
                        const roe = underwriteCalculationService.calculateROE(state);
                        return roe > 0 ? roe.toFixed(1) + "%" : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Year 1 Cash Flow ÷ Initial Equity"
                    />
                    <TextField
                      fullWidth
                      label="Return on Equity (Year 5)"
                      value={(() => {
                        const roe = underwriteCalculationService.calculateROEAtYear(state, 5);
                        return roe > 0 ? roe.toFixed(1) + "%" : "N/A";
                      })()}
                      InputProps={{ readOnly: true }}
                      helperText="Year 5 Cash Flow ÷ Year 5 Equity (accounts for paydown & appreciation)"
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

                {/* Enhanced STR Settings */}
                {(state.propertyType === "Hotel" ||
                  state.operationType === "Short Term Rental" ||
                  state.operationType === "Rental Arbitrage") && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: brandColors.backgrounds.tertiary,
                      borderRadius: 2,
                      border: `1px solid ${brandColors.borders.primary}`,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: brandColors.primary,
                          fontSize: "0.9rem",
                        }}
                      >
                        Enhanced STR/Arbitrage Revenue Model
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.enhancedSTR?.useEnhancedModel || false}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  useEnhancedModel: e.target.checked,
                                },
                              }));
                            }}
                          />
                        }
                        label="Enable Enhanced Model"
                      />
                    </Box>
                    
                    {state.enhancedSTR?.useEnhancedModel && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                          More accurate STR projections with channel fees, dynamic pricing, and turnover costs
                        </Typography>
                        
                        {/* Basic Inputs */}
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Average Daily Rate"
                            type="number"
                            value={state.enhancedSTR?.averageDailyRate || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  averageDailyRate: Math.max(0, Number(e.target.value)),
                                },
                              }));
                            }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Target Occupancy Rate"
                            type="number"
                            value={state.enhancedSTR?.occupancyRate || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  occupancyRate: Math.max(0, Math.min(100, Number(e.target.value))),
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 1 }}
                          />
                        </Box>
                        
                        {/* Channel Fees */}
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Channel Fees (% of revenue)
                        </Typography>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Airbnb Fee"
                            type="number"
                            value={state.enhancedSTR?.channelFees.airbnb || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  channelFees: {
                                    ...prev.enhancedSTR!.channelFees,
                                    airbnb: Math.max(0, Math.min(100, Number(e.target.value))),
                                  },
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 0.5 }}
                          />
                          <TextField
                            fullWidth
                            label="VRBO Fee"
                            type="number"
                            value={state.enhancedSTR?.channelFees.vrbo || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  channelFees: {
                                    ...prev.enhancedSTR!.channelFees,
                                    vrbo: Math.max(0, Math.min(100, Number(e.target.value))),
                                  },
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 0.5 }}
                          />
                          <TextField
                            fullWidth
                            label="Direct Booking Fee"
                            type="number"
                            value={state.enhancedSTR?.channelFees.direct || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  channelFees: {
                                    ...prev.enhancedSTR!.channelFees,
                                    direct: Math.max(0, Math.min(100, Number(e.target.value))),
                                  },
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 0.5 }}
                          />
                        </Box>
                        
                        {/* Channel Mix */}
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Channel Mix (% of bookings)
                        </Typography>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Airbnb %"
                            type="number"
                            value={state.enhancedSTR?.channelMix.airbnb || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  channelMix: {
                                    ...prev.enhancedSTR!.channelMix,
                                    airbnb: Math.max(0, Math.min(100, Number(e.target.value))),
                                  },
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 1 }}
                            helperText={
                              (state.enhancedSTR?.channelMix.airbnb || 0) +
                              (state.enhancedSTR?.channelMix.vrbo || 0) +
                              (state.enhancedSTR?.channelMix.direct || 0) !== 100
                                ? "Total should equal 100%"
                                : ""
                            }
                            error={
                              (state.enhancedSTR?.channelMix.airbnb || 0) +
                              (state.enhancedSTR?.channelMix.vrbo || 0) +
                              (state.enhancedSTR?.channelMix.direct || 0) !== 100
                            }
                          />
                          <TextField
                            fullWidth
                            label="VRBO %"
                            type="number"
                            value={state.enhancedSTR?.channelMix.vrbo || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  channelMix: {
                                    ...prev.enhancedSTR!.channelMix,
                                    vrbo: Math.max(0, Math.min(100, Number(e.target.value))),
                                  },
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 1 }}
                          />
                          <TextField
                            fullWidth
                            label="Direct %"
                            type="number"
                            value={state.enhancedSTR?.channelMix.direct || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  channelMix: {
                                    ...prev.enhancedSTR!.channelMix,
                                    direct: Math.max(0, Math.min(100, Number(e.target.value))),
                                  },
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100, step: 1 }}
                          />
                        </Box>
                        
                        {/* Booking Logistics */}
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Booking Logistics
                        </Typography>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Avg Length of Stay"
                            type="number"
                            value={state.enhancedSTR?.averageLengthOfStay || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  averageLengthOfStay: Math.max(1, Number(e.target.value)),
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">nights</InputAdornment>,
                            }}
                            inputProps={{ min: 1, max: 365, step: 1 }}
                          />
                          <TextField
                            fullWidth
                            label="Turnover Days"
                            type="number"
                            value={state.enhancedSTR?.turnoverDays || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  turnoverDays: Math.max(0, Number(e.target.value)),
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">days</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 7, step: 1 }}
                            helperText="Days between guests"
                          />
                          <TextField
                            fullWidth
                            label="Blocked Days/Year"
                            type="number"
                            value={state.enhancedSTR?.blockedDays || 0}
                            onChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                enhancedSTR: {
                                  ...prev.enhancedSTR!,
                                  blockedDays: Math.max(0, Math.min(365, Number(e.target.value))),
                                },
                              }));
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">days</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 365, step: 1 }}
                            helperText="Owner use + maintenance"
                          />
                        </Box>
                        
                        {/* Dynamic Pricing */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={state.enhancedSTR?.dynamicPricing || false}
                                onChange={(e) => {
                                  setState((prev) => ({
                                    ...prev,
                                    enhancedSTR: {
                                      ...prev.enhancedSTR!,
                                      dynamicPricing: e.target.checked,
                                    },
                                  }));
                                }}
                              />
                            }
                            label="Dynamic Pricing"
                          />
                          {state.enhancedSTR?.dynamicPricing && (
                            <TextField
                              label="Weekend Premium"
                              type="number"
                              value={state.enhancedSTR?.weekendPremium || 0}
                              onChange={(e) => {
                                setState((prev) => ({
                                  ...prev,
                                  enhancedSTR: {
                                    ...prev.enhancedSTR!,
                                    weekendPremium: Math.max(0, Math.min(200, Number(e.target.value))),
                                  },
                                }));
                              }}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                              inputProps={{ min: 0, max: 200, step: 5 }}
                              sx={{ width: 200 }}
                            />
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                )}
                
                {/* STR/Hotel Specific Metrics */}
                {(state.propertyType === "Hotel" ||
                  state.operationType === "Short Term Rental" ||
                  state.operationType === "Rental Arbitrage") && (
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
                      {state.enhancedSTR?.useEnhancedModel ? "Enhanced STR Metrics" : "STR/Hotel Specific Metrics"}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      {state.enhancedSTR?.useEnhancedModel ? (
                        /* Enhanced STR Metrics */
                        <>
                          <TextField
                            fullWidth
                            label="Gross ADR"
                            value={formatCurrency(state.enhancedSTR.averageDailyRate)}
                            InputProps={{ readOnly: true }}
                            helperText="Average Daily Rate (before fees)"
                          />
                          <TextField
                            fullWidth
                            label="Net ADR"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return formatCurrency(metrics.netADR);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="After channel fees"
                          />
                          <TextField
                            fullWidth
                            label="Target Occupancy"
                            value={`${state.enhancedSTR.occupancyRate}%`}
                            InputProps={{ readOnly: true }}
                            helperText="Of bookable nights"
                          />
                          <TextField
                            fullWidth
                            label="Effective Occupancy"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return `${metrics.effectiveOccupancy}%`;
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Of all available nights"
                          />
                          <TextField
                            fullWidth
                            label="Booked Nights/Year"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return `${metrics.bookedNights} nights`;
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText={`${state.enhancedSTR.blockedDays} days blocked`}
                          />
                          <TextField
                            fullWidth
                            label="RevPAN"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return formatCurrency(metrics.revPAN);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Revenue Per Available Night"
                          />
                          <TextField
                            fullWidth
                            label="Gross Annual Revenue"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return formatCurrency(metrics.grossRevenue);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Before channel fees"
                          />
                          <TextField
                            fullWidth
                            label="Total Channel Fees"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return formatCurrency(metrics.totalChannelFees);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return `${((metrics.totalChannelFees / metrics.grossRevenue) * 100).toFixed(1)}% of gross`;
                            })()}
                            sx={{
                              '& .MuiInputBase-input': {
                                color: brandColors.accent.error,
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Net Annual Revenue"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { metrics } = calculateSTRRevenue(state.enhancedSTR);
                              return formatCurrency(metrics.netRevenue);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="After channel fees"
                            sx={{
                              '& .MuiInputBase-input': {
                                color: brandColors.accent.success,
                                fontWeight: 600,
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Monthly Net Revenue"
                            value={(() => {
                              if (!state.enhancedSTR?.useEnhancedModel) return "N/A";
                              const { monthlyRevenue } = calculateSTRRevenue(state.enhancedSTR);
                              return formatCurrency(monthlyRevenue);
                            })()}
                            InputProps={{ readOnly: true }}
                            helperText="Used in cash flow calculations"
                            sx={{
                              '& .MuiInputBase-input': {
                                color: brandColors.accent.success,
                                fontWeight: 600,
                              },
                            }}
                          />
                        </>
                      ) : (
                        /* Original STR Metrics */
                        <>
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
                              computeVariableExpenseFromPercentages(
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
                        </>
                      )}
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
                          computeVariableExpenseFromPercentages(
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
                        sx={{ color: brandColors.accent.error, fontStyle: "italic" }}
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
                            sx={{ color: brandColors.accent.error, fontStyle: "italic" }}
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
                        computeVariableExpenseFromPercentages(
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
                          computeVariableExpenseFromPercentages(
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
                          computeVariableExpenseFromPercentages(
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
                        const reducedGPI = computeIncome(state) * 0.9;
                        const annualNOI =
                          (reducedIncome -
                            computeFixedMonthlyOps(state.ops) -
                            computeVariableExpenseFromPercentages(
                              reducedGPI,
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
                            computeVariableExpenseFromPercentages(
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
            onClick={messagePDF}
            startIcon={<MessageIcon />}
            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
          >
            Message PDF
          </Button>
          <Button
            variant="outlined"
            onClick={emailPDF}
            startIcon={<EmailIcon />}
            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
          >
            Email PDF
          </Button>
          <Button
            variant="outlined"
            onClick={exportToPDF}
            startIcon={<DownloadIcon />}
            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            onClick={() => setState(defaultState)}
            sx={{ bgcolor: brandColors.primary, color: brandColors.backgrounds.primary }}
          >
            Reset
          </Button>
        </Box>

        </Box>

      </Container>
      </Box>
      )}
    </>
  );
};

export default UnderwritePage;