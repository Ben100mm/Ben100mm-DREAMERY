import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  pmt,
  totalMonthlyDebtService,
  computeFixedMonthlyOps,
  computeVariableMonthlyOpsPct,
  breakEvenOccupancy as financeBreakEvenOccupancy,
  remainingPrincipalAfterPayments,
  brrrrAnnualCashFlowPostRefi,
} from '../utils/finance';

// Updated type definitions
type PropertyType = 'Single Family' | 'Multi Family / Hospitality' | 'Hotel';
type OperationType = 'Buy & Hold' | 'Fix & Flip' | 'Short Term Rental' | 'Rental Arbitrage' | 'BRRRR';
type OfferType =
  | 'Cash'
  | 'FHA'
  | 'Seller Finance'
  | 'Conventional'
  | 'SBA'
  | 'DSCR'
  | 'Hard Money'
  | 'Private'
  | 'Line of Credit'
  | 'Subject To Existing Mortgage'
  | 'Hybrid';

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
}

interface AppreciationInputs {
  appreciationPercentPerYear: number;
  yearsOfAppreciation: number;
  futurePropertyValue: number;
  refinanceLtv: number;
  refinancePotential: number;
  remainingBalanceAfterRefi: number;
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
  subjectTo?: SubjectToInputs;
  hybrid?: HybridInputs;
  fixFlip?: FixFlipInputs;
  brrrr?: BRRRRInputs;
  ops: OperatingInputsCommon;
  sfr?: IncomeInputsSfr;
  multi?: IncomeInputsMulti;
  str?: IncomeInputsStr;
  arbitrage?: ArbitrageInputs;
  appreciation: AppreciationInputs;
  // Settings
  showBothPaybackMethods: boolean;
  paybackCalculationMethod: 'initial' | 'remaining';
  reservesCalculationMethod: 'months' | 'fixed';
  reservesMonths: number;
  reservesFixedAmount: number;
  includeVariableExpensesInBreakEven: boolean;
  includeVariablePctInBreakeven?: boolean;
}

function parseCurrency(input: string): number {
  const numeric = Number(String(input).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );
}

// Returns today's date formatted for an HTML input[type="date"] (YYYY-MM-DD) using local time
function currentDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function monthlyPayment(loanAmount: number, annualRatePct: number, years: number, interestOnly: boolean): number {
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
): Array<{ index: number; payment: number; interest: number; principal: number; balance: number }> {
  const schedule: Array<{ index: number; payment: number; interest: number; principal: number; balance: number }> = [];
  const n = Math.min(600, Math.round(years * 12)); // cap at 50 years
  let balance = startBalance ?? loanAmount;
  const monthlyRate = annualRatePct / 100 / 12;
  const pmt = interestOnly ? balance * monthlyRate : monthlyPayment(balance, annualRatePct, years, false);
  for (let i = 1; i <= n; i += 1) {
    const interest = balance * monthlyRate;
    const principal = interestOnly ? 0 : Math.max(0, pmt - interest);
    balance = Math.max(0, interestOnly ? balance : balance - principal);
    schedule.push({ index: i, payment: pmt, interest, principal, balance });
  }
  return schedule;
}

function computeIncome(state: DealState): number {
  const { propertyType, operationType } = state;
  if (operationType === 'Short Term Rental' || operationType === 'Rental Arbitrage') {
    const nights = state.str?.avgNightsPerMonth ?? 0;
    const nightly = state.str?.unitDailyRents?.[0] ?? 0; // Assuming first unit for nightly rate
    const rent = nights * nightly;
    const fees = (state.str?.dailyCleaningFee ?? 0) * (nights > 0 ? Math.ceil(nights) : 0);
    const extra =
      (state.str?.laundry ?? 0) + (state.str?.activities ?? 0) + (state.str?.grossMonthlyIncome ?? 0);
    return rent + fees + extra;
  }
  if (propertyType === 'Single Family') {
    return (state.sfr?.monthlyRent ?? 0) + (state.sfr?.grossMonthlyIncome ?? 0);
  }
  if (propertyType === 'Multi Family / Hospitality') {
    const rents = state.multi?.unitRents ?? [];
    const rentTotal = rents.reduce((a, b) => a + b, 0);
    return rentTotal + (state.multi?.grossMonthlyIncome ?? 0);
  }
  // Fix & Flip / Arbitrage / BRRRR default monthly income 0 for calculator primary tab
  return 0;
}

function computeOperatingExpenses(state: DealState, monthlyIncome: number): number {
  const { ops } = state;
  const variable =
    monthlyIncome * ((ops.maintenance + ops.vacancy + ops.management) / 100);
  const fixed =
    ops.taxes +
    ops.insurance +
    ops.hoa +
    (state.operationType === 'Rental Arbitrage' ? state.arbitrage?.monthlyRentToLandlord ?? 0 : 0);
  return variable + fixed;
}

function computeLoanAmount(state: DealState): number {
  if (state.operationType === 'Rental Arbitrage') return 0;
  const base = Math.max(0, state.purchasePrice - state.loan.downPayment);
  if (state.offerType === 'Subject To Existing Mortgage') {
    const existing = state.subjectTo?.totalLoanBalance ?? 0;
    // In Subject-To, buyer may assume existing balance and add new financing only if purchase price exceeds down payment + existing
    const delta = Math.max(0, base - existing);
    return delta;
  }
  return base;
}

function computeCocAnnual(state: DealState, annualCashFlow: number): number {
  const invested =
    state.operationType === 'Rental Arbitrage'
      ? (state.arbitrage?.deposit ?? 0) + (state.arbitrage?.estimateCostOfRepairs ?? 0) + (state.arbitrage?.furnitureCost ?? 0) + (state.arbitrage?.otherStartupCosts ?? 0)
      : state.loan.downPayment + state.loan.amortizationAmount + state.loan.balloonDue;
  if (invested <= 0) return 0;
  return (annualCashFlow / invested) * 100;
}

function computeFixFlipCalculations(state: DealState): {
  maximumAllowableOffer: number;
  projectedProfit: number;
  roiDuringHold: number;
  annualizedRoi: number;
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
  const maximumAllowableOffer = Math.max(0, targetPrice - rehabCost - totalHoldingCosts - sellingCosts);
  
  // Calculate Projected Profit
  const totalCosts = maximumAllowableOffer + rehabCost + totalHoldingCosts + sellingCosts;
  const projectedProfit = Math.max(0, arv - totalCosts);
  
  // Calculate ROI During Hold
  const totalCashInvested = maximumAllowableOffer + rehabCost;
  const roiDuringHold = totalCashInvested > 0 ? (projectedProfit / totalCashInvested) * 100 : 0;
  
  // Calculate Annualized ROI
  const annualizedRoi = holdingPeriodMonths > 0 ? (roiDuringHold / holdingPeriodMonths) * 12 : 0;
  
  return {
    maximumAllowableOffer,
    projectedProfit,
    roiDuringHold,
    annualizedRoi
  };
}

function computeBRRRRCalculations(state: DealState): {
  cashOutAmount: number;
  remainingCashInDeal: number;
  newCashOnCashReturn: number;
} {
  const arv = state.brrrr?.arv ?? 0;
  const refinanceLtv = state.brrrr?.refinanceLtv ?? 0;
  const originalCashInvested = state.brrrr?.originalCashInvested ?? 0;
  const newMonthlyPayment = state.brrrr?.newMonthlyPayment ?? 0;

  // Cash-out amount based on LTV (simplified). Payoff logic can be extended with remaining principal if needed.
  const refinanceLoan = arv * (refinanceLtv / 100);
  const cashOutAmount = Math.max(0, refinanceLoan - originalCashInvested);

  // Remaining cash in deal after refi proceeds
  const remainingCashInDeal = Math.max(0, originalCashInvested - cashOutAmount);

  // Compute post-refi annual cash flow using current operating assumptions
  const monthlyRevenue = computeIncome(state);
  const fixedMonthlyOps = computeFixedMonthlyOps({
    taxes: state.ops.taxes,
    insurance: state.ops.insurance,
    hoa: state.ops.hoa,
    gasElectric: state.ops.gasElectric,
    internet: state.ops.internet,
    waterSewer: state.ops.waterSewer,
    heat: state.ops.heat,
    lawnSnow: state.ops.lawnSnow,
    phone: state.ops.phoneBill,
    cleaner: state.ops.cleaner,
    extras: state.ops.extra,
  });
  const variablePct = computeVariableMonthlyOpsPct({
    mgmtPct: (state.ops.management || 0) / 100,
    repairsPct: (state.ops.maintenance || 0) / 100,
    utilitiesPct: (state.ops.utilitiesPct || 0) / 100,
    capExPct: (state.ops.capEx || 0) / 100,
    opExPct: (state.ops.opEx || 0) / 100,
  });
  const annualCashFlow = brrrrAnnualCashFlowPostRefi({
    monthlyRevenue,
    fixedMonthlyOps,
    variablePct,
    newLoanMonthly: newMonthlyPayment,
  });
  const newCashOnCashReturn = remainingCashInDeal > 0 ? (annualCashFlow / remainingCashInDeal) * 100 : 0;

  return {
    cashOutAmount,
    remainingCashInDeal,
    newCashOnCashReturn,
  };
}

const defaultState: DealState = {
  propertyType: 'Single Family',
  operationType: 'Short Term Rental',
  offerType: 'Conventional',
  propertyAddress: '',
  agentOwner: '',
  call: '',
  email: '',
  analysisDate: currentDateInputValue(),
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
  multi: { unitRents: [1300, 1300], grossMonthlyIncome: 0, grossYearlyIncome: 0 },
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
  arbitrage: { deposit: 2000, monthlyRentToLandlord: 2000, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 },
  appreciation: { appreciationPercentPerYear: 3, yearsOfAppreciation: 3, futurePropertyValue: 0, refinanceLtv: 70, refinancePotential: 0, remainingBalanceAfterRefi: 0 },
  // Settings
  showBothPaybackMethods: false,
  paybackCalculationMethod: 'initial',
  reservesCalculationMethod: 'months',
  reservesMonths: 3,
  reservesFixedAmount: 0,
  includeVariableExpensesInBreakEven: false,
  includeVariablePctInBreakeven: false,
};

const UnderwritePage: React.FC = () => {
  const [state, setState] = useState<DealState>(() => {
    try {
      const fromLocal = localStorage.getItem('underwrite:last');
      if (fromLocal) {
        const parsed = JSON.parse(fromLocal) as DealState;
        return { ...parsed, analysisDate: parsed.analysisDate || currentDateInputValue() };
      }
    } catch {}
    return defaultState;
  });

  const loanAmount = computeLoanAmount(state);
  const amortMonths = Math.max(1, Math.round((state.loan.amortizationYears || 0) * 12));
  const annualRateDecimal = (state.loan.annualInterestRate || 0) / 100;
  const newLoanMonthlyPmt = state.loan.interestOnly
    ? loanAmount * (annualRateDecimal / 12)
    : pmt(annualRateDecimal, amortMonths, loanAmount);
  const monthlyIncome = computeIncome(state);
  const fixedMonthlyOps = computeFixedMonthlyOps({
    taxes: state.ops.taxes,
    insurance: state.ops.insurance,
    hoa: state.ops.hoa,
    gasElectric: state.ops.gasElectric,
    internet: state.ops.internet,
    waterSewer: state.ops.waterSewer,
    heat: state.ops.heat,
    lawnSnow: state.ops.lawnSnow,
    phone: state.ops.phoneBill,
    cleaner: state.ops.cleaner,
    extras: state.ops.extra,
    baseRentForArbitrage: state.operationType === 'Rental Arbitrage' ? (state.arbitrage?.monthlyRentToLandlord ?? 0) : 0,
  }) ?? 0;
  const variablePct = computeVariableMonthlyOpsPct({
    mgmtPct: (state.ops.management || 0) / 100,
    repairsPct: (state.ops.maintenance || 0) / 100,
    utilitiesPct: (state.ops.utilitiesPct || 0) / 100,
    capExPct: (state.ops.capEx || 0) / 100,
    opExPct: (state.ops.opEx || 0) / 100,
  });
  const monthlyOps = fixedMonthlyOps + (variablePct * monthlyIncome);
  const monthlyPiti = newLoanMonthlyPmt + state.ops.taxes + state.ops.insurance + state.ops.hoa;
  const monthlyNoi = Math.max(0, monthlyIncome - monthlyOps);
  const annualNoi = monthlyNoi * 12;
  const capRate = state.purchasePrice > 0 ? (annualNoi / state.purchasePrice) * 100 : 0;
  const subjectToMonthly = (state.subjectTo?.totalMonthlyPayment ?? 0);
  const hybridMonthly = (state.hybrid?.monthlyPayment ?? 0);
  const totalMonthlyDS = totalMonthlyDebtService({ newLoanMonthly: newLoanMonthlyPmt, subjectToMonthlyTotal: subjectToMonthly, hybridMonthly });
  const annualDebtService = totalMonthlyDS * 12;
  const annualCashFlow = Math.max(0, annualNoi - annualDebtService);
  const coc = computeCocAnnual(state, annualCashFlow);
  const rentToPrice = state.purchasePrice > 0 ? (monthlyIncome / state.purchasePrice) * 100 : 0;

  // Calculate reserves based on user preference
  const reserves = (() => {
    if (state.reservesCalculationMethod === 'months') {
      // Default: 6 months of total monthly expenses
      const totalMonthlyExpenses = monthlyPiti + (state.ops.maintenance + state.ops.vacancy + state.ops.management) * monthlyIncome / 100;
      return totalMonthlyExpenses * state.reservesMonths;
    } else {
      // Fixed amount
      return state.reservesFixedAmount;
    }
  })();

  // Additional KPI calculations
  const buyersEntry = (() => {
    if (state.operationType === 'Rental Arbitrage') {
      return (state.arbitrage?.deposit ?? 0) + 
             (state.arbitrage?.estimateCostOfRepairs ?? 0) + 
             (state.arbitrage?.furnitureCost ?? 0) + 
             (state.arbitrage?.otherStartupCosts ?? 0);
    }
    let entry = (state.loan.downPayment || 0) + (state.loan.closingCosts || 0) + (state.loan.rehabCosts || 0);
    if (state.offerType === 'Subject To Existing Mortgage' && state.subjectTo) {
      entry += state.subjectTo.paymentToSeller;
    }
    if (state.offerType === 'Hybrid' && state.hybrid) {
      entry += state.hybrid.paymentToSeller;
    }
    // Add reserves to buyer's entry
    entry += reserves;
    return entry;
  })();

  const buyersEntryPercentage = state.purchasePrice > 0 ? (buyersEntry / state.purchasePrice) * 100 : 0;
  
  const monthlyRentToPrice = state.purchasePrice > 0 ? (monthlyIncome / state.purchasePrice) * 100 : 0;
  
  const annualGrossYield = state.purchasePrice > 0 ? (monthlyIncome * 12 / state.purchasePrice) * 100 : 0;
  
  const dscrRatio = annualDebtService > 0 ? annualNoi / annualDebtService : 0;
  
  const paybackPeriod = (() => {
    if (state.operationType !== 'Rental Arbitrage' || monthlyNoi <= 0) return 0;
    if (state.paybackCalculationMethod === 'initial') {
      return buyersEntry / monthlyNoi;
    } else {
      // For remaining cash basis, we need to calculate remaining cash in deal
      // This would be the original cash invested minus any cash-out from refinancing
      // For now, we'll use a simplified calculation
      const remainingCashInDeal = Math.max(0, buyersEntry - (monthlyNoi * 6)); // Assume 6 months of cash flow
      return remainingCashInDeal / monthlyNoi;
    }
  })();

  const paybackPeriodRemaining = (() => {
    if (state.operationType !== 'Rental Arbitrage' || monthlyNoi <= 0) return 0;
    const remainingCashInDeal = Math.max(0, buyersEntry - (monthlyNoi * 6)); // Assume 6 months of cash flow
    return remainingCashInDeal / monthlyNoi;
  })();
  
  const breakEvenOccupancy = (() => {
    if (state.operationType !== 'Short Term Rental' || !state.str?.unitDailyRents?.[0] || state.str.unitDailyRents[0] <= 0) return 0;
    const dailyRate = state.str.unitDailyRents[0];
    const nightsModel = state.str.avgNightsPerMonth && state.str.avgNightsPerMonth > 0 ? state.str.avgNightsPerMonth : 30;
    const monthlyRevenueAt100 = dailyRate * nightsModel;
    const occFrac = financeBreakEvenOccupancy({
      monthlyRevenueAt100,
      fixedMonthlyOps,
      variablePct,
      includeVariablePct: state.includeVariablePctInBreakeven ?? state.includeVariableExpensesInBreakEven,
    });
    return occFrac * nightsModel;
  })();
  
  const breakEvenOccupancyPercent = (() => {
    if (!state.str?.avgNightsPerMonth || state.str.avgNightsPerMonth <= 0) return 0;
    return (breakEvenOccupancy / state.str.avgNightsPerMonth) * 100;
  })();

  // Appreciation calculations
  const futurePropertyValue = state.purchasePrice * Math.pow(1 + state.appreciation.appreciationPercentPerYear / 100, state.appreciation.yearsOfAppreciation);
  const refinancePotential = futurePropertyValue * (state.appreciation.refinanceLtv || 70) / 100;
  const remainingBalanceAfterRefi = (() => {
    const paymentsMade = Math.max(0, Math.round(state.appreciation.yearsOfAppreciation * 12));
    return remainingPrincipalAfterPayments({
      principal: loanAmount,
      annualRate: annualRateDecimal,
      termMonths: amortMonths,
      interestOnly: state.loan.interestOnly,
    }, paymentsMade);
  })();

  const schedule = React.useMemo(() => {
    if (state.operationType === 'Rental Arbitrage' || loanAmount <= 0) return [] as ReturnType<typeof buildAmortization>;
    return buildAmortization(
      loanAmount,
      state.loan.annualInterestRate,
      state.loan.amortizationYears,
      state.loan.interestOnly,
    );
  }, [state.operationType, loanAmount, state.loan.annualInterestRate, state.loan.amortizationYears, state.loan.interestOnly]);

  function getOperationTypeOptions(propertyType: PropertyType): OperationType[] {
    if (propertyType === 'Hotel') {
      return ['Buy & Hold', 'Rental Arbitrage'];
    }
    return ['Buy & Hold', 'Fix & Flip', 'Short Term Rental', 'Rental Arbitrage', 'BRRRR'];
  }

  function getOfferTypeOptions(propertyType: PropertyType, operationType: OperationType): OfferType[] {
    if (operationType === 'Rental Arbitrage') {
      if (propertyType === 'Single Family' || propertyType === 'Multi Family / Hospitality') {
        return ['Private', 'Line of Credit', 'SBA'];
      }
      return [];
    }
    if (operationType === 'Fix & Flip' || operationType === 'BRRRR') {
      return ['Seller Finance', 'SBA', 'Hard Money', 'Private'];
    }
    if (operationType === 'Buy & Hold' && (propertyType === 'Single Family' || propertyType === 'Multi Family / Hospitality')) {
      return ['FHA', 'Cash', 'Seller Finance', 'Conventional', 'SBA', 'DSCR', 'Subject To Existing Mortgage', 'Hybrid'];
    }
    return ['Cash', 'Seller Finance', 'Conventional', 'SBA', 'DSCR', 'Subject To Existing Mortgage', 'Hybrid'];
  }

  React.useEffect(() => {
    const allowed = getOfferTypeOptions(state.propertyType, state.operationType);
    if (allowed.length > 0 && !allowed.includes(state.offerType)) {
      setState((prev) => ({ ...prev, offerType: allowed[0] }));
    }
  }, [state.propertyType, state.operationType, state.offerType]);

  // Update operation type when property type changes to Hotel
  React.useEffect(() => {
    if (state.propertyType === 'Hotel') {
      const allowedOperationTypes = getOperationTypeOptions('Hotel');
      if (!allowedOperationTypes.includes(state.operationType)) {
        setState((prev) => ({ ...prev, operationType: 'Buy & Hold' }));
      }
    }
  }, [state.propertyType, state.operationType]);

  // Update appreciation calculations when inputs change
  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      appreciation: {
        ...prev.appreciation,
        futurePropertyValue,
        refinancePotential,
        remainingBalanceAfterRefi
      }
    }));
  }, [futurePropertyValue, refinancePotential, remainingBalanceAfterRefi]);

  // Persist Subject-To totals
  React.useEffect(() => {
    if (state.subjectTo) {
      const totalLoanBalance = (state.subjectTo.loans?.reduce((sum, l) => sum + (l.amount || 0), 0)) || 0;
      const totalMonthlyPayment = (state.subjectTo.loans?.reduce((sum, l) => sum + (l.monthlyPayment || 0), 0)) || 0;
      const totalAnnualPayment = totalMonthlyPayment * 12;
      if (
        totalLoanBalance !== state.subjectTo.totalLoanBalance ||
        totalMonthlyPayment !== state.subjectTo.totalMonthlyPayment ||
        totalAnnualPayment !== state.subjectTo.totalAnnualPayment
      ) {
        setState(prev => ({
          ...prev,
          subjectTo: {
            ...(prev.subjectTo ?? { paymentToSeller: 0, loans: [] }),
            totalLoanBalance,
            totalMonthlyPayment,
            totalAnnualPayment,
          }
        }));
      }
    }
  }, [state.subjectTo?.loans]);

  // Keep loan monthly/annual payment fresh in state
  React.useEffect(() => {
    const monthly = Math.max(0, newLoanMonthlyPmt || 0);
    const annual = monthly * 12;
    if (monthly !== state.loan.monthlyPayment || annual !== state.loan.annualPayment) {
      setState(prev => ({ ...prev, loan: { ...prev.loan, monthlyPayment: monthly, annualPayment: annual } }));
    }
  }, [newLoanMonthlyPmt]);

  // Hybrid annual payment mirror
  React.useEffect(() => {
    if (state.hybrid) {
      const annual = (state.hybrid.monthlyPayment || 0) * 12;
      if (annual !== state.hybrid.annualPayment) {
        setState(prev => ({ ...prev, hybrid: { ...(prev.hybrid ?? { monthlyPayment: 0 } as any), annualPayment: annual } }));
      }
    }
  }, [state.hybrid?.monthlyPayment]);

  // Update Fix & Flip calculations when inputs change
  React.useEffect(() => {
    if (state.operationType === 'Fix & Flip' && state.fixFlip) {
      const calculations = computeFixFlipCalculations(state);
      setState(prev => ({
        ...prev,
        fixFlip: {
          ...prev.fixFlip!,
          ...calculations
        }
      }));
    }
  }, [state.operationType, state.fixFlip?.arv, state.fixFlip?.holdingPeriodMonths, state.fixFlip?.holdingCosts, state.fixFlip?.sellingCostsPercent, state.fixFlip?.targetPercent, state.fixFlip?.rehabCost, state]);

  // Update BRRRR calculations when inputs change
  React.useEffect(() => {
    if (state.operationType === 'BRRRR' && state.brrrr) {
      const calculations = computeBRRRRCalculations(state);
      setState(prev => ({
        ...prev,
        brrrr: {
          ...prev.brrrr!,
          ...calculations
        }
      }));
    }
  }, [state.operationType, state.brrrr?.arv, state.brrrr?.refinanceLtv, state.brrrr?.originalCashInvested, state.brrrr?.newMonthlyPayment, state.ops.expensesWithoutMortgage, state]);

  function saveDeal() {
    localStorage.setItem('underwrite:last', JSON.stringify(state));
  }

  function update<K extends keyof DealState>(key: K, value: DealState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function updateLoan<K extends keyof LoanTerms>(key: K, value: LoanTerms[K]) {
    setState((prev) => ({ ...prev, loan: { ...prev.loan, [key]: value } }));
  }

  function updateOps<K extends keyof OperatingInputsCommon>(key: K, value: OperatingInputsCommon[K]) {
    setState((prev) => ({ ...prev, ops: { ...prev.ops, [key]: value } }));
  }

  function updateAppreciation<K extends keyof AppreciationInputs>(key: K, value: AppreciationInputs[K]) {
    setState((prev) => ({ ...prev, appreciation: { ...prev.appreciation, [key]: value } }));
  }

  function exportToPDF() {
    // TODO: Implement PDF export with jsPDF
    alert('PDF export coming soon! This will include your deal analysis with Dreamery branding.');
  }

  function exportToExcel() {
    // TODO: Implement Excel export with xlsx
    alert('Excel export coming soon! This will include your deal analysis in an editable spreadsheet format.');
  }

  function applyPreset(preset: 'conservative' | 'moderate' | 'aggressive') {
    const presets = {
      conservative: {
        rentGrowth: 1.5,
        expenseInflation: 3.0,
        vacancy: 8.0,
        capRateExitAdjustment: 0.5,
        maintenanceReserve: 10.0
      },
      moderate: {
        rentGrowth: 3.0,
        expenseInflation: 2.0,
        vacancy: 5.0,
        capRateExitAdjustment: 0.0,
        maintenanceReserve: 8.0
      },
      aggressive: {
        rentGrowth: 4.5,
        expenseInflation: 1.5,
        vacancy: 3.0,
        capRateExitAdjustment: -0.25,
        maintenanceReserve: 5.0
      }
    };

    const selectedPreset = presets[preset];
    
    // Update the state with the selected preset values
    setState(prev => ({
      ...prev,
      ops: {
        ...prev.ops,
        vacancy: selectedPreset.vacancy,
        maintenance: selectedPreset.maintenanceReserve
      }
    }));

    // TODO: Apply other preset values when pro forma calculations are implemented
    alert(`${preset.charAt(0).toUpperCase() + preset.slice(1)} preset applied! Rent growth: ${selectedPreset.rentGrowth}%, Vacancy: ${selectedPreset.vacancy}%, Maintenance: ${selectedPreset.maintenanceReserve}%`);
  }

  // no-op

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      transition: 'all 0.3s ease-in-out'
    }}>
      <Container maxWidth="lg" sx={{ 
        py: 2,
        minHeight: '100vh',
        transition: 'all 0.3s ease-in-out'
      }}>
        <Card sx={{ 
          borderRadius: 2, 
          border: '1px solid #e0e0e0',
          transition: 'all 0.3s ease-in-out',
          minHeight: 'fit-content',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ 
            transition: 'all 0.3s ease-in-out',
            minHeight: 'fit-content',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d', mb: 1 }}>
              Dreamery Calculator
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Fill the red inputs. Sections expand based on your Property Type and Finance Type selections. Amortization
              schedule supports up to 50 years.
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
              gap: 2, 
              mb: 2,
              transition: 'all 0.3s ease-in-out',
              minHeight: 'fit-content',
              gridAutoRows: 'min-content',
              alignContent: 'start',
              order: 3
            }}>
              <FormControl fullWidth sx={{ minHeight: '56px' }}>
                <InputLabel>Property Type</InputLabel>
                <Select label="Property Type" value={state.propertyType} onChange={(e) => update('propertyType', e.target.value as PropertyType)}>
                  <MenuItem value="Single Family">Single</MenuItem>
                  <MenuItem value="Multi Family / Hospitality">Multi</MenuItem>
                  <MenuItem value="Hotel">Hotel</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ minHeight: '56px' }}>
                <InputLabel>Operation Type</InputLabel>
                <Select label="Operation Type" value={state.operationType} onChange={(e) => update('operationType', e.target.value as OperationType)}>
                  {getOperationTypeOptions(state.propertyType).map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ minHeight: '56px' }}>
                <InputLabel>Finance Type</InputLabel>
                <Select label="Finance Type" value={state.offerType} onChange={(e) => update('offerType', e.target.value as OfferType)}>
                  {getOfferTypeOptions(state.propertyType, state.operationType).map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Income Section */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Income</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ 
                  minHeight: '200px', 
                  transition: 'all 0.3s ease-in-out',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  {/* Single Family Income */}
                  {state.propertyType === 'Single Family' && (
                    <Box sx={{ mb: 3, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Single Family Income</Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
                        gap: 2,
                        minHeight: 'fit-content',
                        gridAutoRows: 'min-content',
                        alignContent: 'start'
                      }}>
                        <TextField
                          label="Monthly Rent"
                          value={state.sfr?.monthlyRent ?? 0}
                          onChange={(e) => update('sfr', { ...(state.sfr ?? { monthlyRent: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), monthlyRent: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ 
                            '& input': { color: '#b71c1c' },
                            minHeight: '56px',
                            '& .MuiInputBase-root': {
                              minHeight: '56px'
                            }
                          }}
                        />
                        <TextField
                          label="Extra Monthly Income"
                          value={state.sfr?.grossMonthlyIncome ?? 0}
                          onChange={(e) => update('sfr', { ...(state.sfr ?? { monthlyRent: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), grossMonthlyIncome: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ 
                            '& input': { color: '#b71c1c' },
                            minHeight: '56px',
                            '& .MuiInputBase-root': {
                              minHeight: '56px'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Multi-Family Income */}
                  {state.propertyType === 'Multi Family / Hospitality' && (
                    <Box sx={{ mb: 3, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Multi-Family Income</Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
                        gap: 2, 
                        mb: 2,
                        minHeight: 'fit-content',
                        gridAutoRows: 'min-content',
                        alignContent: 'start'
                      }}>
                        <TextField
                          label="Number of Units"
                          type="number"
                          value={state.multi?.unitRents?.length ?? 2}
                          onChange={(e) => {
                            const units = parseInt(e.target.value) || 2;
                            const rents = Array.from({ length: units }, (_, i) => state.multi?.unitRents?.[i] ?? 0);
                            update('multi', { unitRents: rents, grossMonthlyIncome: state.multi?.grossMonthlyIncome ?? 0, grossYearlyIncome: state.multi?.grossYearlyIncome ?? 0 });
                          }}
                          InputProps={{ inputProps: { min: 1, max: 10 } }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Extra Monthly Income"
                          value={state.multi?.grossMonthlyIncome ?? 0}
                          onChange={(e) => update('multi', { ...(state.multi ?? { unitRents: [1300, 1300], grossMonthlyIncome: 0, grossYearlyIncome: 0 }), grossMonthlyIncome: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(200px, 1fr))' }, 
                        gap: 2,
                        minHeight: 'fit-content',
                        gridAutoRows: 'min-content',
                        alignContent: 'start'
                      }}>
                        {Array.from({ length: state.multi?.unitRents?.length ?? 0 }).map((_, idx) => (
                          <TextField
                            key={idx}
                            label={`Unit ${idx + 1} Monthly Rent`}
                            value={state.multi?.unitRents?.[idx] ?? 0}
                            onChange={(e) => {
                              const rents = [...(state.multi?.unitRents ?? [])];
                              rents[idx] = parseCurrency(e.target.value);
                              update('multi', { unitRents: rents, grossMonthlyIncome: state.multi?.grossMonthlyIncome ?? 0, grossYearlyIncome: state.multi?.grossYearlyIncome ?? 0 });
                            }}
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                            sx={{ '& input': { color: '#b71c1c' } }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Hotel Rental Income */}
                  {state.propertyType === 'Hotel' && (
                    <Box sx={{ mb: 3, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Hotel Rental Income</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 4 }}>
                        <TextField
                          label="Number of Units"
                          type="number"
                          value={state.str?.unitDailyRents?.length ?? 1}
                          onChange={(e) => {
                            const units = parseInt(e.target.value) || 1;
                            const dailyRents = Array.from({ length: units }, (_, i) => state.str?.unitDailyRents?.[i] ?? 0);
                            const monthlyRents = Array.from({ length: units }, (_, i) => state.str?.unitMonthlyRents?.[i] ?? 0);
                            update('str', { ...(state.str ?? { unitDailyRents: [0], unitMonthlyRents: [0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), unitDailyRents: dailyRents, unitMonthlyRents: monthlyRents });
                          }}
                          InputProps={{ inputProps: { min: 1, max: 20 } }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Daily Rate"
                          value={state.str?.unitDailyRents?.[0] ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0], unitMonthlyRents: [0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), unitDailyRents: [parseCurrency(e.target.value), ...(state.str?.unitDailyRents?.slice(1) ?? [])] })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Avg Nights Per Month"
                          value={state.str?.avgNightsPerMonth ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0], unitMonthlyRents: [0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), avgNightsPerMonth: parseCurrency(e.target.value) })}
                          InputProps={{ inputProps: { min: 0, max: 31 } }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 4 }}>
                        <TextField
                          label="Daily Cleaning Fee"
                          value={state.str?.dailyCleaningFee ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), dailyCleaningFee: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Laundry"
                          value={state.str?.laundry ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), laundry: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Activities"
                          value={state.str?.activities ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), activities: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                      <TextField
                        label="Extra Monthly Income"
                        value={state.str?.grossMonthlyIncome ?? 0}
                        onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0], unitMonthlyRents: [0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), grossMonthlyIncome: parseCurrency(e.target.value) })}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        sx={{ '& input': { color: '#b71c1c' }, mb: 3 }}
                      />
                      
                      {/* Individual Unit Daily Rates */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(200px, 1fr))' }, 
                        gap: 4,
                        minHeight: 'fit-content',
                        gridAutoRows: 'min-content',
                        alignContent: 'start'
                      }}>
                        {Array.from({ length: state.str?.unitDailyRents?.length ?? 0 }).map((_, idx) => (
                          <TextField
                            key={idx}
                            label={`Unit ${idx + 1} Daily Rate`}
                            value={state.str?.unitDailyRents?.[idx] ?? 0}
                            onChange={(e) => {
                              const dailyRents = [...(state.str?.unitDailyRents ?? [])];
                              dailyRents[idx] = parseCurrency(e.target.value);
                              update('str', { ...(state.str ?? { unitDailyRents: [0], unitMonthlyRents: [0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), unitDailyRents: dailyRents });
                            }}
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                            sx={{ '& input': { color: '#b71c1c' } }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Rental Arbitrage Income */}
                  {state.operationType === 'Rental Arbitrage' && (
                    <Box sx={{ mb: 3, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Rental Arbitrage Income</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                        <TextField
                          label="Deposit"
                          value={state.arbitrage?.deposit ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), deposit: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Monthly Rent to Landlord"
                          value={state.arbitrage?.monthlyRentToLandlord ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), monthlyRentToLandlord: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        <TextField
                          label="Estimate Cost of Repairs"
                          value={state.arbitrage?.estimateCostOfRepairs ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), estimateCostOfRepairs: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Furniture Cost"
                          value={state.arbitrage?.furnitureCost ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), furnitureCost: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Other Startup Costs"
                          value={state.arbitrage?.otherStartupCosts ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), otherStartupCosts: parseCurrency(e.target.value) })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Operating Expenses Section */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Operating Expenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                  <TextField
                    label="Monthly Taxes"
                    value={state.ops.taxes}
                    onChange={(e) => updateOps('taxes', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Monthly Insurance"
                    value={state.ops.insurance}
                    onChange={(e) => updateOps('insurance', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Monthly HOA"
                    value={state.ops.hoa}
                    onChange={(e) => updateOps('hoa', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Gas & Electric"
                    value={state.ops.gasElectric}
                    onChange={(e) => updateOps('gasElectric', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Internet"
                    value={state.ops.internet}
                    onChange={(e) => updateOps('internet', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Water & Sewer"
                    value={state.ops.waterSewer}
                    onChange={(e) => updateOps('waterSewer', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Heat"
                    value={state.ops.heat}
                    onChange={(e) => updateOps('heat', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Lawn & Snow"
                    value={state.ops.lawnSnow}
                    onChange={(e) => updateOps('lawnSnow', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Phone Bill"
                    value={state.ops.phoneBill}
                    onChange={(e) => updateOps('phoneBill', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Cleaner"
                    value={state.ops.cleaner}
                    onChange={(e) => updateOps('cleaner', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Extra Expenses"
                    value={state.ops.extra}
                    onChange={(e) => updateOps('extra', parseCurrency(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <TextField
                    label="Maintenance (% of Income)"
                    value={state.ops.maintenance}
                    onChange={(e) => updateOps('maintenance', parseCurrency(e.target.value))}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Vacancy (% of Income)"
                    value={state.ops.vacancy}
                    onChange={(e) => updateOps('vacancy', parseCurrency(e.target.value))}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Management (% of Income)"
                    value={state.ops.management}
                    onChange={(e) => updateOps('management', parseCurrency(e.target.value))}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="CapEx (% of Income)"
                    value={state.ops.capEx}
                    onChange={(e) => updateOps('capEx', parseCurrency(e.target.value))}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="OpEx (% of Income)"
                    value={state.ops.opEx}
                    onChange={(e) => updateOps('opEx', parseCurrency(e.target.value))}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Pro Forma Presets */}
            <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mb: 1 }}>
                Pro Forma Presets
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant={state.ops.vacancy === 8 && state.ops.maintenance === 10 ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => applyPreset('conservative')}
                  sx={{ 
                    textTransform: 'none',
                    bgcolor: state.ops.vacancy === 8 && state.ops.maintenance === 10 ? '#1a365d' : 'transparent',
                    color: state.ops.vacancy === 8 && state.ops.maintenance === 10 ? 'white' : '#1a365d',
                    borderColor: '#1a365d',
                    '&:hover': {
                      bgcolor: state.ops.vacancy === 8 && state.ops.maintenance === 10 ? '#1a365d' : '#f0f0f0'
                    }
                  }}
                >
                  Conservative
                </Button>
                <Button
                  variant={state.ops.vacancy === 5 && state.ops.maintenance === 8 ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => applyPreset('moderate')}
                  sx={{ 
                    textTransform: 'none',
                    bgcolor: state.ops.vacancy === 5 && state.ops.maintenance === 8 ? '#1a365d' : 'transparent',
                    color: state.ops.vacancy === 5 && state.ops.maintenance === 8 ? 'white' : '#1a365d',
                    borderColor: '#1a365d',
                    '&:hover': {
                      bgcolor: state.ops.vacancy === 5 && state.ops.maintenance === 8 ? '#f0f0f0' : '#e0e0e0'
                    }
                  }}
                >
                  Moderate
                </Button>
                <Button
                  variant={state.ops.vacancy === 3 && state.ops.maintenance === 5 ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => applyPreset('aggressive')}
                  sx={{ 
                    textTransform: 'none',
                    bgcolor: state.ops.vacancy === 3 && state.ops.maintenance === 5 ? '#1a365d' : 'transparent',
                    color: state.ops.vacancy === 3 && state.ops.maintenance === 5 ? 'white' : '#1a365d',
                    borderColor: '#1a365d',
                    '&:hover': {
                      bgcolor: state.ops.vacancy === 3 && state.ops.maintenance === 5 ? '#1a365d' : '#f0f0f0'
                    }
                  }}
                >
                  Aggressive
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                Click a preset to apply conservative, moderate, or aggressive assumptions for vacancy rates and maintenance reserves.
              </Typography>
            </Box>

            {/* Basic Property Info Section */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Basic Property Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                  <TextField
                    label="Property Address"
                    value={state.propertyAddress}
                    onChange={(e) => update('propertyAddress', e.target.value)}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Agent/Owner"
                    value={state.agentOwner}
                    onChange={(e) => update('agentOwner', e.target.value)}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Analysis Date"
                    type="date"
                    value={state.analysisDate}
                    onChange={(e) => update('analysisDate', e.target.value)}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Listed Price ($)"
                    value={state.listedPrice}
                    onChange={(e) => update('listedPrice', parseCurrency(e.target.value))}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="Purchase Price ($)"
                    value={state.purchasePrice}
                    onChange={(e) => update('purchasePrice', parseCurrency(e.target.value))}
                    sx={{ '& input': { color: '#b71c1c' } }}
                  />
                  <TextField
                    label="% Difference"
                    value={state.percentageDifference}
                    InputProps={{
                      readOnly: true,
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{ '& input': { color: '#666' } }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>{state.operationType === 'Rental Arbitrage' ? 'Startup Costs' : 'Loan & Costs'}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ minHeight: '150px', transition: 'all 0.3s ease-in-out' }}>
                  {state.operationType === 'Rental Arbitrage' ? (
                    <Box sx={{ opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        <TextField
                          label="Damage Deposit ($)"
                          value={state.arbitrage?.deposit ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), deposit: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Furniture Cost ($)"
                          value={state.arbitrage?.furnitureCost ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), furnitureCost: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Repairs / Setup ($)"
                          value={state.arbitrage?.estimateCostOfRepairs ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), estimateCostOfRepairs: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Other Startup Costs ($)"
                          value={state.arbitrage?.otherStartupCosts ?? 0}
                          onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), otherStartupCosts: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        <TextField
                          label="Purchase Price"
                          value={state.purchasePrice}
                          onChange={(e) => update('purchasePrice', parseCurrency(e.target.value))}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Down Payment ($)"
                          value={state.loan.downPayment}
                          onChange={(e) => updateLoan('downPayment', parseCurrency(e.target.value))}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Interest Rate (%)"
                          value={state.loan.annualInterestRate}
                          onChange={(e) => updateLoan('annualInterestRate', parseCurrency(e.target.value))}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Amortization (years)"
                          value={state.loan.amortizationYears}
                          onChange={(e) => updateLoan('amortizationYears', Math.min(50, parseCurrency(e.target.value)))}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Closing Costs ($)"
                          value={state.loan.closingCosts ?? 0}
                          onChange={(e) => updateLoan('closingCosts', parseCurrency(e.target.value))}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Rehab Costs ($)"
                          value={state.loan.rehabCosts ?? 0}
                          onChange={(e) => updateLoan('rehabCosts', parseCurrency(e.target.value))}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        {(state.operationType === 'Short Term Rental') && (
                          <TextField
                            label="Furniture Cost ($)"
                            value={state.loan.amortizationAmount}
                            onChange={(e) => updateLoan('amortizationAmount', parseCurrency(e.target.value))}
                            sx={{ '& input': { color: '#b71c1c' } }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Income & Operating</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ minHeight: '300px', transition: 'all 0.3s ease-in-out' }}>
                  {/* Income, gated by property type */}
                  {state.propertyType === 'Single Family' && (
                    <Box sx={{ mb: 2, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                        <TextField
                          label="Monthly Rent"
                          value={state.sfr?.monthlyRent ?? 0}
                          onChange={(e) => update('sfr', { ...(state.sfr ?? { monthlyRent: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), monthlyRent: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Extra Monthly Income"
                          value={state.sfr?.grossMonthlyIncome ?? 0}
                          onChange={(e) => update('sfr', { ...(state.sfr ?? { monthlyRent: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), grossMonthlyIncome: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                    </Box>
                  )}

                  {state.propertyType === 'Multi Family / Hospitality' && (
                    <Box sx={{ mb: 2, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <TextField
                          label="Units"
                          value={state.multi?.unitRents?.length ?? 2}
                          onChange={(e) => {
                            const units = Math.max(1, Math.min(50, parseCurrency(e.target.value)));
                            const rents = Array.from({ length: units }, (_, i) => state.multi?.unitRents?.[i] ?? 0);
                            update('multi', { unitRents: rents, grossMonthlyIncome: state.multi?.grossMonthlyIncome ?? 0, grossYearlyIncome: state.multi?.grossYearlyIncome ?? 0 });
                          }}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Extra Monthly Income"
                          value={state.multi?.grossMonthlyIncome ?? 0}
                          onChange={(e) => update('multi', { ...(state.multi ?? { unitRents: [1300, 1300], grossMonthlyIncome: 0, grossYearlyIncome: 0 }), grossMonthlyIncome: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 1 }}>
                        {Array.from({ length: state.multi?.unitRents?.length ?? 0 }).map((_, idx) => (
                          <TextField
                            key={idx}
                            label={`Unit ${idx + 1} Rent`}
                            value={state.multi?.unitRents?.[idx] ?? 0}
                            onChange={(e) => {
                              const rents = [...(state.multi?.unitRents ?? [])];
                              rents[idx] = parseCurrency(e.target.value);
                              update('multi', { unitRents: rents, grossMonthlyIncome: state.multi?.grossMonthlyIncome ?? 0, grossYearlyIncome: state.multi?.grossYearlyIncome ?? 0 });
                            }}
                            sx={{ '& input': { color: '#b71c1c' } }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {(state.operationType === 'Short Term Rental' || state.operationType === 'Rental Arbitrage') && (
                    <Box sx={{ mb: 2, opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease-in-out' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                        <TextField
                          label="Nightly Rate"
                          value={state.str?.unitDailyRents?.[0] ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), unitDailyRents: [parseCurrency(e.target.value), 0] })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Avg Nights per Month"
                          value={state.str?.avgNightsPerMonth ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), avgNightsPerMonth: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Daily Cleaning Fee"
                          value={state.str?.dailyCleaningFee ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), dailyCleaningFee: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Additional Guest Fee (Monthly)"
                          value={state.str?.laundry ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), laundry: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Experiences (Monthly)"
                          value={state.str?.activities ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), activities: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        <TextField
                          label="Extra Monthly Income"
                          value={state.str?.grossMonthlyIncome ?? 0}
                          onChange={(e) => update('str', { ...(state.str ?? { unitDailyRents: [0, 0], unitMonthlyRents: [0, 0], dailyCleaningFee: 0, laundry: 0, activities: 0, avgNightsPerMonth: 0, grossDailyIncome: 0, grossMonthlyIncome: 0, grossYearlyIncome: 0 }), grossMonthlyIncome: parseCurrency(e.target.value) })}
                          sx={{ '& input': { color: '#b71c1c' } }}
                        />
                        {state.operationType === 'Rental Arbitrage' && (
                          <TextField
                            label="Monthly Rent to Landlord"
                            value={state.arbitrage?.monthlyRentToLandlord ?? 0}
                            onChange={(e) => update('arbitrage', { ...(state.arbitrage ?? { deposit: 0, monthlyRentToLandlord: 0, estimateCostOfRepairs: 0, furnitureCost: 0, otherStartupCosts: 0, startupCostsTotal: 0 }), monthlyRentToLandlord: parseCurrency(e.target.value) })}
                            sx={{ '& input': { color: '#b71c1c' } }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Operating inputs common */}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                    Operating inputs
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                    <TextField
                      label="Monthly Taxes"
                      value={state.ops.taxes}
                      onChange={(e) => updateOps('taxes', parseCurrency(e.target.value))}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Monthly Insurance"
                      value={state.ops.insurance}
                      onChange={(e) => updateOps('insurance', parseCurrency(e.target.value))}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Monthly HOA"
                      value={state.ops.hoa}
                      onChange={(e) => updateOps('hoa', parseCurrency(e.target.value))}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Maintenance (% of Income)"
                      value={state.ops.maintenance}
                      onChange={(e) => updateOps('maintenance', parseCurrency(e.target.value))}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Vacancy (% of Income)"
                      value={state.ops.vacancy}
                      onChange={(e) => updateOps('vacancy', parseCurrency(e.target.value))}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Management (% of Income)"
                      value={state.ops.management}
                      onChange={(e) => updateOps('management', parseCurrency(e.target.value))}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Subject-To section, shown only when not Rental Arbitrage and Finance Type matches */}
            {state.operationType !== 'Rental Arbitrage' &&
              (state.offerType === 'Subject To Existing Mortgage' || state.offerType === 'Hybrid') && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Subject-To Existing Mortgage</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Payment to Seller */}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Payment to Seller (One-time up-front)"
                      value={state.subjectTo?.paymentToSeller ?? 0}
                      onChange={(e) => update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), paymentToSeller: parseCurrency(e.target.value) })}
                      helperText="One-time payment to seller (part of Buyer's Entry)"
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                  </Box>

                  {/* Existing Loans */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Existing Loans (Up to 2)</Typography>
                  
                  {/* Loan 1 */}
                  <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Loan 1</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                      <TextField
                        label="Loan Amount"
                        value={state.subjectTo?.loans?.[0]?.amount ?? 0}
                        onChange={(e) => {
                          const newLoans = [...(state.subjectTo?.loans ?? [])];
                          if (newLoans[0]) {
                            newLoans[0] = { ...newLoans[0], amount: parseCurrency(e.target.value) };
                          } else {
                            newLoans[0] = { amount: parseCurrency(e.target.value), annualInterestRate: 0, monthlyPayment: 0 };
                          }
                          update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loans: newLoans });
                        }}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <TextField
                        label="Interest Rate (%)"
                        value={state.subjectTo?.loans?.[0]?.annualInterestRate ?? 0}
                        onChange={(e) => {
                          const newLoans = [...(state.subjectTo?.loans ?? [])];
                          if (newLoans[0]) {
                            newLoans[0] = { ...newLoans[0], annualInterestRate: parseCurrency(e.target.value) };
                          } else {
                            newLoans[0] = { amount: 0, annualInterestRate: parseCurrency(e.target.value), monthlyPayment: 0 };
                          }
                          update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loans: newLoans });
                        }}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <TextField
                        label="Monthly Payment"
                        value={state.subjectTo?.loans?.[0]?.monthlyPayment ?? 0}
                        onChange={(e) => {
                          const newLoans = [...(state.subjectTo?.loans ?? [])];
                          if (newLoans[0]) {
                            newLoans[0] = { ...newLoans[0], monthlyPayment: parseCurrency(e.target.value) };
                          } else {
                            newLoans[0] = { amount: 0, annualInterestRate: 0, monthlyPayment: parseCurrency(e.target.value) };
                          }
                          update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loans: newLoans });
                        }}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                    </Box>
                  </Box>

                  {/* Loan 2 */}
                  <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Loan 2</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                      <TextField
                        label="Loan Amount"
                        value={state.subjectTo?.loans?.[1]?.amount ?? 0}
                        onChange={(e) => {
                          const newLoans = [...(state.subjectTo?.loans ?? [])];
                          if (newLoans[1]) {
                            newLoans[1] = { ...newLoans[1], amount: parseCurrency(e.target.value) };
                          } else {
                            newLoans[1] = { amount: parseCurrency(e.target.value), annualInterestRate: 0, monthlyPayment: 0 };
                          }
                          update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loans: newLoans });
                        }}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <TextField
                        label="Interest Rate (%)"
                        value={state.subjectTo?.loans?.[1]?.annualInterestRate ?? 0}
                        onChange={(e) => {
                          const newLoans = [...(state.subjectTo?.loans ?? [])];
                          if (newLoans[1]) {
                            newLoans[1] = { ...newLoans[1], annualInterestRate: parseCurrency(e.target.value) };
                          } else {
                            newLoans[1] = { amount: 0, annualInterestRate: parseCurrency(e.target.value), monthlyPayment: 0 };
                          }
                          update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loans: newLoans });
                        }}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <TextField
                        label="Monthly Payment"
                        value={state.subjectTo?.loans?.[1]?.monthlyPayment ?? 0}
                        onChange={(e) => {
                          const newLoans = [...(state.subjectTo?.loans ?? [])];
                          if (newLoans[1]) {
                            newLoans[1] = { ...newLoans[1], monthlyPayment: parseCurrency(e.target.value) };
                          } else {
                            newLoans[1] = { amount: 0, annualInterestRate: 0, monthlyPayment: parseCurrency(e.target.value) };
                          }
                          update('subjectTo', { ...(state.subjectTo ?? { paymentToSeller: 0, loans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loans: newLoans });
                        }}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                    </Box>
                  </Box>

                  {/* Auto-calculated Totals */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Auto-calculated Totals</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Loan Balance</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency((state.subjectTo?.loans?.[0]?.amount ?? 0) + (state.subjectTo?.loans?.[1]?.amount ?? 0))}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Monthly Payment</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency((state.subjectTo?.loans?.[0]?.monthlyPayment ?? 0) + (state.subjectTo?.loans?.[1]?.monthlyPayment ?? 0))}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Annual Payment</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency(((state.subjectTo?.loans?.[0]?.monthlyPayment ?? 0) + (state.subjectTo?.loans?.[1]?.monthlyPayment ?? 0)) * 12)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Hybrid section, shown only when not Rental Arbitrage and Finance Type is Hybrid */}
            {state.operationType !== 'Rental Arbitrage' && state.offerType === 'Hybrid' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Hybrid Financing</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* New Note Section */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>New Note (Loan 3)</Typography>
                  <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                      <TextField
                        label="Down Payment"
                        value={state.hybrid?.downPayment ?? 0}
                        onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), downPayment: parseCurrency(e.target.value) })}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <TextField
                        label="Loan Amount"
                        value={state.hybrid?.loan3Amount ?? 0}
                        onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), loan3Amount: parseCurrency(e.target.value) })}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <TextField
                        label="Interest Rate (%)"
                        value={state.hybrid?.annualInterestRate ?? 0}
                        onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), annualInterestRate: parseCurrency(e.target.value) })}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                      <TextField
                        label="Monthly Payment"
                        value={state.hybrid?.monthlyPayment ?? 0}
                        onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), monthlyPayment: parseCurrency(e.target.value) })}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.hybrid?.interestOnly ?? false}
                            onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), interestOnly: e.target.checked })}
                          />
                        }
                        label="Interest Only"
                      />
                      <TextField
                        label="Balloon Due (years)"
                        value={state.hybrid?.balloonDue ?? 0}
                        onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), balloonDue: parseFloat(e.target.value) || 0 })}
                        sx={{ '& input': { color: '#b71c1c' } }}
                      />
                    </Box>
                  </Box>

                  {/* Payment to Seller */}
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Payment to Seller (One-time up-front)"
                      value={state.hybrid?.paymentToSeller ?? 0}
                      onChange={(e) => update('hybrid', { ...(state.hybrid ?? { downPayment: 0, loan3Amount: 0, annualInterestRate: 0, monthlyPayment: 0, annualPayment: 0, interestOnly: false, balloonDue: 0, paymentToSeller: 0, subjectToLoans: [], totalLoanBalance: 0, totalMonthlyPayment: 0, totalAnnualPayment: 0 }), paymentToSeller: parseCurrency(e.target.value) })}
                      helperText="One-time payment to seller (part of Buyer's Entry)"
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                  </Box>

                  {/* Combined Totals */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Combined Financing Summary</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Loan Balance</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency((state.hybrid?.loan3Amount ?? 0) + ((state.subjectTo?.loans?.[0]?.amount ?? 0) + (state.subjectTo?.loans?.[1]?.amount ?? 0)))}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Monthly Payment</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency((state.hybrid?.monthlyPayment ?? 0) + ((state.subjectTo?.loans?.[0]?.monthlyPayment ?? 0) + (state.subjectTo?.loans?.[1]?.monthlyPayment ?? 0)))}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Annual Payment</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency(((state.hybrid?.monthlyPayment ?? 0) + ((state.subjectTo?.loans?.[0]?.monthlyPayment ?? 0) + (state.subjectTo?.loans?.[1]?.monthlyPayment ?? 0))) * 12)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Fix & Flip section */}
            {state.operationType === 'Fix & Flip' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Fix & Flip</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label="ARV Target / Selling Price"
                      value={state.fixFlip?.arv ?? 0}
                      onChange={(e) => update('fixFlip', { ...(state.fixFlip ?? { arv: 0, holdingPeriodMonths: 0, holdingCosts: 0, sellingCostsPercent: 0, targetPercent: 70, rehabCost: 0, maximumAllowableOffer: 0, projectedProfit: 0, roiDuringHold: 0, annualizedRoi: 0 }), arv: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Months Until Flip"
                      value={state.fixFlip?.holdingPeriodMonths ?? 0}
                      onChange={(e) => update('fixFlip', { ...(state.fixFlip ?? { arv: 0, holdingPeriodMonths: 0, holdingCosts: 0, sellingCostsPercent: 0, targetPercent: 70, rehabCost: 0, maximumAllowableOffer: 0, projectedProfit: 0, roiDuringHold: 0, annualizedRoi: 0 }), holdingPeriodMonths: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Holding Costs (Monthly)"
                      value={state.fixFlip?.holdingCosts ?? 0}
                      onChange={(e) => update('fixFlip', { ...(state.fixFlip ?? { arv: 0, holdingPeriodMonths: 0, holdingCosts: 0, sellingCostsPercent: 0, targetPercent: 70, rehabCost: 0, maximumAllowableOffer: 0, projectedProfit: 0, roiDuringHold: 0, annualizedRoi: 0 }), holdingCosts: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mt: 2 }}>
                    <TextField
                      label="Selling Costs %"
                      value={state.fixFlip?.sellingCostsPercent ?? 0}
                      onChange={(e) => update('fixFlip', { ...(state.fixFlip ?? { arv: 0, holdingPeriodMonths: 0, holdingCosts: 0, sellingCostsPercent: 0, targetPercent: 70, rehabCost: 0, maximumAllowableOffer: 0, projectedProfit: 0, roiDuringHold: 0, annualizedRoi: 0 }), sellingCostsPercent: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Rehab Cost"
                      value={state.fixFlip?.rehabCost ?? 0}
                      onChange={(e) => update('fixFlip', { ...(state.fixFlip ?? { arv: 0, holdingPeriodMonths: 0, holdingCosts: 0, sellingCostsPercent: 0, targetPercent: 70, rehabCost: 0, maximumAllowableOffer: 0, projectedProfit: 0, roiDuringHold: 0, annualizedRoi: 0 }), rehabCost: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Target % of ARV"
                      value={state.fixFlip?.targetPercent ?? 70}
                      onChange={(e) => update('fixFlip', { ...(state.fixFlip ?? { arv: 0, holdingPeriodMonths: 0, holdingCosts: 0, sellingCostsPercent: 0, targetPercent: 70, rehabCost: 0, maximumAllowableOffer: 0, projectedProfit: 0, roiDuringHold: 0, annualizedRoi: 0 }), targetPercent: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                  </Box>
                  
                  {/* Fix & Flip Results */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>Flip Analysis Results</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">70% of ARV Target</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency((state.fixFlip?.arv ?? 0) * ((state.fixFlip?.targetPercent ?? 70) / 100))}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Maximum Allowable Offer (MAO)</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency(state.fixFlip?.maximumAllowableOffer ?? 0)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Projected Profit</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency(state.fixFlip?.projectedProfit ?? 0)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">ROI During Hold</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {state.fixFlip?.roiDuringHold ? `${state.fixFlip.roiDuringHold.toFixed(2)}%` : '0%'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Annualized ROI</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {state.fixFlip?.annualizedRoi ? `${state.fixFlip.annualizedRoi.toFixed(2)}%` : '0%'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Total Cash Invested</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency((state.fixFlip?.maximumAllowableOffer ?? 0) + (state.fixFlip?.rehabCost ?? 0))}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* BRRRR section */}
            {state.operationType === 'BRRRR' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>BRRRR</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                    <TextField
                      label="ARV"
                      value={state.brrrr?.arv ?? 0}
                      onChange={(e) => update('brrrr', { ...(state.brrrr ?? { arv: 0, refinanceLtv: 0, refinanceInterestRate: 0, loanTerm: 0, newMonthlyPayment: 0, originalCashInvested: 0, cashOutAmount: 0, remainingCashInDeal: 0, newCashOnCashReturn: 0 }), arv: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Refinance LTV (%)"
                      value={state.brrrr?.refinanceLtv ?? 0}
                      onChange={(e) => update('brrrr', { ...(state.brrrr ?? { arv: 0, refinanceLtv: 0, refinanceInterestRate: 0, loanTerm: 0, newMonthlyPayment: 0, originalCashInvested: 0, cashOutAmount: 0, remainingCashInDeal: 0, newCashOnCashReturn: 0 }), refinanceLtv: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Refinance Interest Rate (%)"
                      value={state.brrrr?.refinanceInterestRate ?? 0}
                      onChange={(e) => update('brrrr', { ...(state.brrrr ?? { arv: 0, refinanceLtv: 0, refinanceInterestRate: 0, loanTerm: 0, newMonthlyPayment: 0, originalCashInvested: 0, cashOutAmount: 0, remainingCashInDeal: 0, newCashOnCashReturn: 0 }), refinanceInterestRate: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Loan Term (years)"
                      value={state.brrrr?.loanTerm ?? 0}
                      onChange={(e) => update('brrrr', { ...(state.brrrr ?? { arv: 0, refinanceLtv: 0, refinanceInterestRate: 0, loanTerm: 0, newMonthlyPayment: 0, originalCashInvested: 0, cashOutAmount: 0, remainingCashInDeal: 0, newCashOnCashReturn: 0 }), loanTerm: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="New Monthly Payment"
                      value={state.brrrr?.newMonthlyPayment ?? 0}
                      onChange={(e) => update('brrrr', { ...(state.brrrr ?? { arv: 0, refinanceLtv: 0, refinanceInterestRate: 0, loanTerm: 0, newMonthlyPayment: 0, originalCashInvested: 0, cashOutAmount: 0, remainingCashInDeal: 0, newCashOnCashReturn: 0 }), newMonthlyPayment: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                    <TextField
                      label="Original Cash Invested"
                      value={state.brrrr?.originalCashInvested ?? 0}
                      onChange={(e) => update('brrrr', { ...(state.brrrr ?? { arv: 0, refinanceLtv: 0, refinanceInterestRate: 0, loanTerm: 0, newMonthlyPayment: 0, originalCashInvested: 0, cashOutAmount: 0, remainingCashInDeal: 0, newCashOnCashReturn: 0 }), originalCashInvested: parseCurrency(e.target.value) })}
                      sx={{ '& input': { color: '#b71c1c' } }}
                    />
                  </Box>

                  {/* BRRRR Results */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>BRRRR Results</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Cash-Out Amount</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency(state.brrrr?.cashOutAmount ?? 0)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Remaining Cash in Deal</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {formatCurrency(state.brrrr?.remainingCashInDeal ?? 0)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">New Cash-on-Cash Return</Typography>
                        <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                          {state.brrrr?.newCashOnCashReturn ? `${state.brrrr.newCashOnCashReturn.toFixed(2)}%` : '0.00%'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* KPIs */}
            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1.5 }}>
              <Kpi label="Loan Amount" value={formatCurrency(loanAmount)} />
              <Kpi label="Monthly Payment" value={formatCurrency(newLoanMonthlyPmt)} />
              <Kpi label="Monthly NOI" value={formatCurrency(monthlyNoi)} />
              <Kpi label="Cap Rate" value={`${capRate.toFixed(2)}%`} />
              <Kpi label="Cash on Cash" value={`${coc.toFixed(2)}%`} />
            </Box>

            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              <Kpi label="PITI (Monthly)" value={formatCurrency(monthlyPiti)} />
              <Kpi label="Annual Cash Flow" value={formatCurrency(annualCashFlow)} />
              <Kpi label="Rent/Price" value={`${rentToPrice.toFixed(2)}%`} />
            </Box>

            {/* At a Glance Summary */}
            <Accordion defaultExpanded sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>At a Glance</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Buyer's Entry</Typography>
                    <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                      {formatCurrency(buyersEntry)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {buyersEntryPercentage.toFixed(2)}% of Purchase Price
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Rent-to-Price Ratio</Typography>
                    <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                      {monthlyRentToPrice.toFixed(2)}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Monthly (1% Rule)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Annual Gross Yield</Typography>
                    <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                      {annualGrossYield.toFixed(2)}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Annual Rent / Purchase Price
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">DSCR Ratio</Typography>
                    <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                      {dscrRatio.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      NOI / Annual Debt Service
                    </Typography>
                  </Box>
                </Box>
                
                {state.operationType === 'Rental Arbitrage' && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Payback Period
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                      <FormControlLabel
                        control={
                          <ToggleButtonGroup
                            value={state.paybackCalculationMethod}
                            exclusive
                            onChange={(e, value) => value && update('paybackCalculationMethod', value)}
                            size="small"
                          >
                            <ToggleButton value="initial">Initial Entry Basis</ToggleButton>
                            <ToggleButton value="remaining">Remaining Cash Basis</ToggleButton>
                          </ToggleButtonGroup>
                        }
                        label=""
                      />
                    </Box>
                    
                    {state.showBothPaybackMethods ? (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="textSecondary">Initial Entry Basis</Typography>
                          <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                            {paybackPeriod.toFixed(1)} months
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="textSecondary">Remaining Cash Basis</Typography>
                          <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                            {paybackPeriodRemaining.toFixed(1)} months
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                        {paybackPeriod.toFixed(1)} months
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.showBothPaybackMethods}
                            onChange={(e) => update('showBothPaybackMethods', e.target.checked)}
                          />
                        }
                        label="Show both methods"
                      />
                    </Box>
                  </Box>
                )}

                {state.operationType === 'Short Term Rental' && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Break-even Occupancy
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
                      {breakEvenOccupancy.toFixed(1)} nights/month
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {breakEvenOccupancyPercent.toFixed(1)}% occupancy rate
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.includeVariableExpensesInBreakEven}
                          onChange={(e) => update('includeVariableExpensesInBreakEven', e.target.checked)}
                        />
                      }
                      label="Include variable % expenses"
                    />
                  </Box>
                )}

                {/* Reserves Configuration */}
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Reserves Configuration
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <FormControlLabel
                      control={
                        <ToggleButtonGroup
                          value={state.reservesCalculationMethod}
                          exclusive
                          onChange={(e, value) => value && update('reservesCalculationMethod', value)}
                          size="small"
                        >
                          <ToggleButton value="months">{state.reservesMonths} Months</ToggleButton>
                          <ToggleButton value="fixed">Fixed Amount</ToggleButton>
                        </ToggleButtonGroup>
                      }
                      label=""
                    />
                  </Box>
                  
                  {state.reservesCalculationMethod === 'months' ? (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Months"
                        type="number"
                        value={state.reservesMonths}
                        onChange={(e) => update('reservesMonths', parseInt(e.target.value) || 6)}
                        size="small"
                        sx={{ width: 100 }}
                        InputProps={{ inputProps: { min: 1, max: 24 } }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        of total monthly expenses
                      </Typography>
                    </Box>
                  ) : (
                    <TextField
                      label="Fixed Amount"
                      type="number"
                      value={state.reservesFixedAmount}
                      onChange={(e) => update('reservesFixedAmount', parseCurrency(e.target.value))}
                      size="small"
                      sx={{ width: 150 }}
                      InputProps={{
                        startAdornment: <Typography variant="caption" sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  )}
                  
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    Current reserves: {formatCurrency(reserves)}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {state.operationType !== 'Rental Arbitrage' && (
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Amortization Schedule ({state.loan.amortizationYears} years)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LinearProgress sx={{ my: 1 }} value={100} />
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell align="right">Payment</TableCell>
                      <TableCell align="right">Interest</TableCell>
                      <TableCell align="right">Principal</TableCell>
                      <TableCell align="right">Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule.map((row) => (
                      <TableRow key={row.index}>
                        <TableCell>{row.index}</TableCell>
                        <TableCell align="right">{formatCurrency(row.payment)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.interest)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.principal)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Showing all {schedule.length} months for the selected term.
                </Typography>
              </AccordionDetails>
            </Accordion>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <Button variant="outlined" onClick={() => saveDeal()} sx={{ textTransform: 'none', borderColor: '#1a365d', color: '#1a365d' }}>
                Save Locally
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  localStorage.removeItem('underwrite:last');
                  setState(defaultState);
                }}
                sx={{ textTransform: 'none', background: '#1a365d' }}
              >
                Reset
              </Button>
            </Box>

            {/* Export Section */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Export & Reports</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => exportToPDF()} 
                    sx={{ textTransform: 'none', borderColor: '#1a365d', color: '#1a365d' }}
                  >
                    Export to PDF
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => exportToExcel()} 
                    sx={{ textTransform: 'none', borderColor: '#1a365d', color: '#1a365d' }}
                  >
                    Export to Excel
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                  Export your deal analysis with Dreamery branding for presentations and investor meetings.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Pro Forma Presets */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Pro Forma Presets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => applyPreset('conservative')}
                    sx={{ 
                      textTransform: 'none', 
                      borderColor: '#d32f2f', 
                      color: '#d32f2f',
                      '&:hover': { borderColor: '#b71c1c', backgroundColor: '#ffebee' }
                    }}
                  >
                    Conservative
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => applyPreset('moderate')}
                    sx={{ 
                      textTransform: 'none', 
                      background: '#1a365d',
                      '&:hover': { background: '#0f2440' }
                    }}
                  >
                    Moderate (Default)
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => applyPreset('aggressive')}
                    sx={{ 
                      textTransform: 'none', 
                      borderColor: '#2e7d32', 
                      color: '#2e7d32',
                      '&:hover': { borderColor: '#1b5e20', backgroundColor: '#e8f5e8' }
                    }}
                  >
                    Aggressive
                  </Button>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Conservative</Typography>
                    <Typography variant="caption" display="block">Rent Growth: 1.5%/year</Typography>
                    <Typography variant="caption" display="block">Expense Inflation: 3%/year</Typography>
                    <Typography variant="caption" display="block">Vacancy: 8%</Typography>
                    <Typography variant="caption" display="block">Cap Rate Exit: +0.50%</Typography>
                    <Typography variant="caption" display="block">Maintenance Reserve: 10%</Typography>
                  </Box>
                  <Box sx={{ p: 2, border: '1px solid #1a365d', borderRadius: 1, bgcolor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>Moderate (Default)</Typography>
                    <Typography variant="caption" display="block">Rent Growth: 3%/year</Typography>
                    <Typography variant="caption" display="block">Expense Inflation: 2%/year</Typography>
                    <Typography variant="caption" display="block">Vacancy: 5%</Typography>
                    <Typography variant="caption" display="block">Cap Rate Exit: 0.00%</Typography>
                    <Typography variant="caption" display="block">Maintenance Reserve: 8%</Typography>
                  </Box>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="caption" display="block">Rent Growth: 4.5%/year</Typography>
                    <Typography variant="caption" display="block">Expense Inflation: 1.5%/year</Typography>
                    <Typography variant="caption" display="block">Vacancy: 3%</Typography>
                    <Typography variant="caption" display="block">Cap Rate Exit: -0.25%</Typography>
                    <Typography variant="caption" display="block">Maintenance Reserve: 5%</Typography>
                  </Box>
                </Box>
                
                <Typography variant="caption" sx={{ color: '#666', mt: 2, display: 'block' }}>
                  Pro & Enterprise users can create and save custom presets. 
                  <Button size="small" sx={{ ml: 1, textTransform: 'none', color: '#1a365d' }}>
                    Upgrade to Enterprise
                  </Button>
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Appreciation Calculator Section */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Appreciation Calculator</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {/* Inputs */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Appreciation Assumptions</Typography>
                    <TextField
                      fullWidth
                      label="Appreciation % Per Year"
                      type="number"
                      value={state.appreciation.appreciationPercentPerYear}
                      onChange={(e) => updateAppreciation('appreciationPercentPerYear', parseFloat(e.target.value) || 0)}
                      InputProps={{ endAdornment: <Typography variant="caption">%</Typography> }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Years of Appreciation"
                      type="number"
                      value={state.appreciation.yearsOfAppreciation}
                      onChange={(e) => updateAppreciation('yearsOfAppreciation', parseFloat(e.target.value) || 0)}
                      InputProps={{ endAdornment: <Typography variant="caption">years</Typography> }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Refinance LTV %"
                      type="number"
                      value={state.appreciation.refinanceLtv}
                      onChange={(e) => updateAppreciation('refinanceLtv', parseFloat(e.target.value) || 0)}
                      InputProps={{ endAdornment: <Typography variant="caption">%</Typography> }}
                      helperText="Default: 70% LTV for refinance"
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  {/* Results */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Projected Results</Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <Kpi 
                        label="Future Property Value" 
                        value={formatCurrency(state.appreciation.futurePropertyValue)} 
                      />
                      <Kpi 
                        label="Refinance Potential" 
                        value={formatCurrency(state.appreciation.refinancePotential)} 
                      />
                      <Kpi 
                        label="Remaining Balance After Refi" 
                        value={formatCurrency(state.appreciation.remainingBalanceAfterRefi)} 
                      />
                      <Kpi 
                        label="Cash Out Amount" 
                        value={formatCurrency(Math.max(0, state.appreciation.refinancePotential - state.appreciation.remainingBalanceAfterRefi))} 
                      />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="caption" sx={{ color: '#666', mt: 2, display: 'block' }}>
                  Calculate future property value and refinance potential based on appreciation assumptions.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

function Kpi(props: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
      <Typography variant="caption" sx={{ color: '#666' }}>
        {props.label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d' }}>
        {props.value}
      </Typography>
    </Box>
  );
}

export default UnderwritePage;


