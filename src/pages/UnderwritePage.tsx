import React, { useState, useEffect, useMemo, useCallback, memo, Suspense } from "react";
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
  type SeasonalFactors,
  type MarketConditions,
  type ExitStrategy,
  type RefinanceScenario,
  type TaxImplications,
  type EnhancedTaxImplications,
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
// Lazy load heavy components to improve initial load time
const AdvancedModelingTab = React.lazy(() => import("./AdvancedModelingTab"));
const AnalysisProvider = React.lazy(() => import("../context/AnalysisContext").then(module => ({ default: module.AnalysisProvider })));
const ProFormaPresetSelector = React.lazy(() => import("../components/calculator/ProFormaPresetSelector").then(module => ({ default: module.ProFormaPresetSelector })));
const LiveMarketDataWidget = React.lazy(() => import("../components/calculator/LiveMarketDataWidget").then(module => ({ default: module.LiveMarketDataWidget })));
const GuidedTour = React.lazy(() => import("../components/GuidedTour").then(module => ({ default: module.GuidedTour })));
import { type DealState } from "../types/deal";

// Lazy load icons to reduce initial bundle size
const LazyExpandMoreIcon = React.lazy(() => import("@mui/icons-material/ExpandMore"));
const LazyDeleteIcon = React.lazy(() => import("@mui/icons-material/Delete"));
const LazyTrendingUpIcon = React.lazy(() => import("@mui/icons-material/TrendingUp"));

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
  ioPeriodMonths?: number; // NEW: IO period for hybrid IO loans
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

interface MetricWithConfidence {
  low: number; // 10th percentile (pessimistic)
  base: number; // Expected value (most likely)
  high: number; // 90th percentile (optimistic)
  standardDeviation: number;
  confidenceLevel: number; // e.g., 80 for 80% confidence interval
}

interface UncertaintyParameters {
  incomeUncertainty: number; // ±% uncertainty in income projections (e.g., 0.15 for ±15%)
  expenseUncertainty: number; // ±% uncertainty in expense projections (e.g., 0.10 for ±10%)
  occupancyUncertainty: number; // ±% uncertainty in occupancy rates (e.g., 0.10 for ±10%)
  appreciationUncertainty: number; // ±% uncertainty in appreciation (e.g., 0.20 for ±20%)
  confidenceLevel: number; // 80, 90, or 95 for confidence interval width
}

interface EnhancedSTRInputs {
  // Existing basic inputs
  averageDailyRate: number;
  occupancyRate: number;
  
  // Channel management
  channelFees: {
    airbnb: number; // e.g., 14%
    vrbo: number; // e.g., 8%
    direct: number; // e.g., 0%
  };
  channelMix: {
    airbnb: number; // % of bookings
    vrbo: number;
    direct: number;
  };
  
  // Booking logistics
  averageLengthOfStay: number; // Nights per booking
  turnoverDays: number; // Days between guests for cleaning/prep
  minimumStay: number; // Minimum nights required
  blockedDays: number; // Owner usage + maintenance days per year
  
  // Dynamic pricing
  dynamicPricing: boolean;
  weekendPremium: number; // % increase for weekend nights
  
  // Use enhanced model flag
  useEnhancedModel: boolean;
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

interface CapitalEvent {
  id: string;
  year: number; // Year from purchase
  description: string;
  estimatedCost: number;
  category: 'roof' | 'hvac' | 'foundation' | 'electrical' | 'plumbing' | 'other';
  likelihood: number; // 0-100%
}

interface CapitalEventInputs {
  events: CapitalEvent[];
  totalExpectedCost: number; // Sum of all events
  averageAnnualCost: number; // Amortized over hold period
}

interface Exchange1031Inputs {
  enabled: boolean;
  // Relinquished Property (property being sold)
  relinquishedPropertyValue: number;
  relinquishedPropertyBasis: number; // Original cost + improvements - depreciation
  relinquishedPropertyDepreciation: number;
  relinquishedPropertyMortgage: number;
  // Replacement Property (property being purchased)
  replacementPropertyValue: number;
  replacementPropertyMortgage: number;
  // Costs
  qualifiedIntermediaryFee: number;
  otherExchangeCosts: number;
  // Timeline tracking
  identificationDeadline: string; // 45 days from closing
  closingDeadline: string; // 180 days from closing
  // Results (calculated)
  deferredGain: number;
  recognizedGain: number; // Boot
  carryoverBasis: number;
  cashBoot: number;
  mortgageBoot: number;
  totalTaxableGain: number;
  estimatedTaxLiability: number;
  netProceedsToReinvest: number;
}

// DealState interface is now imported from types/deal.ts

const defaultState: DealState = {
  propertyType: "Single Family",
  operationType: "Buy & Hold",
  offerType: "Conventional",
  calculatorMode: "standard",
  propertyAddress: "",
  agentOwner: "",
  call: "",
  email: "",
  analysisDate: (() => {
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
    amortizationYears: 30,
    closingCosts: 0,
    rehabCosts: 0,
    ioPeriodMonths: 0,
    totalInterest: 0,
    totalPayment: 0,
    amortizationSchedule: [],
  },
  subjectTo: {
    loans: [],
    paymentToSeller: 0,
    totalBalance: 0,
    totalMonthlyPayment: 0,
  },
  hybrid: {
    loanAmount: 0,
    loanTerm: 0,
    annualInterestRate: 0,
    monthlyPayment: 0,
    annualPayment: 0,
    balloonDue: 0,
    interestOnly: false,
    subjectToLoans: [],
    totalLoanBalance: 0,
    totalMonthlyPayment: 0,
    totalAnnualPayment: 0,
    amortizationSchedule: [],
  },
  ops: {
    taxes: 200,
    insurance: 100,
    maintenance: 5,
    vacancy: 5,
    management: 10,
    capEx: 5,
    opEx: 5,
  },
  sfr: {
    monthlyRent: 1500,
    grossMonthlyIncome: 0,
    grossYearlyIncome: 0,
  },
  multi: {
    unitRents: [1500],
    grossMonthlyIncome: 0,
    grossYearlyIncome: 0,
  },
  str: {
    unitDailyRents: [100],
    unitMonthlyRents: [2000],
    dailyCleaningFee: 50,
    laundry: 100,
    activities: 0,
    avgNightsPerMonth: 20,
    grossDailyIncome: 100,
    grossMonthlyIncome: 0,
    grossYearlyIncome: 0,
  },
  officeRetail: {
    squareFootage: 1000,
    rentPerSFMonthly: 2.5,
    occupancyRatePct: 85,
    extraMonthlyIncome: 0,
  },
  land: {
    acreage: 1,
    extraMonthlyIncome: 0,
  },
  arbitrage: {
    deposit: 1500,
    monthlyRentToLandlord: 1500,
    estimateCostOfRepairs: 0,
    furnitureCost: 0,
    otherStartupCosts: 0,
    startupCostsTotal: 1500,
  },
  appreciation: {
    appreciationPercentPerYear: 3,
    yearsOfAppreciation: 5,
    futurePropertyValue: 0,
    refinanceLtv: 75,
    refinancePotential: 0,
    remainingBalanceAfterRefi: 0,
  },
  showBothPaybackMethods: false,
  paybackCalculationMethod: "initial",
  reservesCalculationMethod: "months",
  reservesMonths: 6,
  reservesFixedAmount: 0,
  includeVariableExpensesInBreakEven: true,
  includeVariablePctInBreakeven: false,
  proFormaPreset: "conservative",
  customProFormaPresets: [],
  selectedCustomPreset: undefined,
  sensitivityAnalysis: {
    showSensitivity: false,
    sensitivityRange: 20,
    sensitivitySteps: 5,
  },
  benchmarkComparison: {
    showBenchmarks: false,
    selectedMarket: undefined,
    includeBenchmarks: false,
  },
  revenueInputs: {
    totalRooms: 0,
    averageDailyRate: 0,
    occupancyRate: 0,
    seasonalVariations: {
      summerVacancyRate: 0,
      winterVacancyRate: 0,
      springVacancyRate: 0,
      fallVacancyRate: 0,
      seasonalMaintenanceMultiplier: 1,
      q1: 100,
      q2: 100,
      q3: 100,
      q4: 100,
    },
    fixedAnnualCosts: 0,
    fixedMonthlyCosts: 0,
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
  marketType: "stable",
  // Advanced Analysis Configuration
  marketConditions: {
    type: "stable",
    vacancyRateAdjustment: 0,
    rentGrowthRate: 0,
    interestRateSensitivity: 0,
    inflationRate: 3,
  },
  exitStrategies: [],
  seasonalFactors: {
    summerVacancyRate: 0,
    winterVacancyRate: 0,
    springVacancyRate: 0,
    fallVacancyRate: 0,
    seasonalMaintenanceMultiplier: 1,
    q1: 100,
    q2: 100,
    q3: 100,
    q4: 100,
  },
  propertyAge: {
    age: 0,
    maintenanceCostMultiplier: 1,
    utilityEfficiencyMultiplier: 1,
    insuranceCostMultiplier: 1,
    expectedLifespan: 50,
  },
  locationFactors: {
    walkabilityScore: 0,
    transitScore: 0,
    crimeRate: 0,
    schoolRating: 0,
    proximityToAmenities: 0,
  },
  riskFactors: {
    tenantQuality: 5,
    propertyCondition: 5,
    locationStability: 5,
    financingRisk: 5,
    marketVolatility: 5,
  },
  taxImplications: {
    federalTaxRate: 0,
    stateTaxRate: 0,
    depreciationRecapture: 0,
    capitalGainsTax: 0,
    propertyTax: 0,
  },
  // Enhanced tax configuration with IRS compliance
  enhancedTaxConfig: undefined,
  useEnhancedTaxCalculation: false,
  // Advanced Analysis Results
  exitStrategyResults: undefined,
  refinanceScenarioResults: undefined,
  taxImplicationResults: undefined,
  riskScoreResults: undefined,
  confidenceIntervalResults: undefined,
  inflationProjections: undefined,
  // IRR Configuration Parameters
  irrHoldPeriodYears: 5,
  irrIncomeGrowthRate: 2,
  irrExpenseGrowthRate: 3,
  irrSellingCostsPct: 7,
  showIrrCashFlowBreakdown: false,
  // Capital Events
  capitalEvents: {
    events: [],
    totalExpectedCost: 0,
    averageAnnualCost: 0,
  },
  // Confidence Intervals
  showConfidenceIntervals: false,
  uncertaintyParameters: {
    incomeUncertainty: 10,
    expenseUncertainty: 15,
    occupancyUncertainty: 5,
    appreciationUncertainty: 20,
    confidenceLevel: 95,
  },
  // 1031 Exchange Calculator
  exchange1031: undefined,
  // UX/logic helpers
  validationMessages: [],
  showAmortizationOverride: false,
  snackbarOpen: false,
}

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
    const existing = state.subjectTo.totalLoanBalance || 0;
    const sellerPayment = state.subjectTo.paymentToSeller || 0;
    const need = Math.max(0, state.purchasePrice - sellerPayment - existing);
    return need;
  }
  const base = Math.max(0, state.purchasePrice - (state.loan.downPayment || 0));
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
        (state.subjectTo.paymentToSeller || 0) +
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
        (state.subjectTo.paymentToSeller || 0);

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
        (state.subjectTo.paymentToSeller || 0) +
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
    // Standard mode: Add "Short Term Rental"
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
    // Standard mode: Add "Multi Family"
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
    // Standard mode: Add "DSCR"
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

const UnderwritePage: React.FC = () => {
  return (
    <div>
      <h1>Underwrite Page</h1>
      <p>This is a placeholder for the UnderwritePage component.</p>
    </div>
  );
};

export default UnderwritePage;