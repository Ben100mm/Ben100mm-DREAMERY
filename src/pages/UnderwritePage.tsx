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
type PropertyType = 'Single Family' | 'Multi Family' | 'Hotel';
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
};

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
  if (propertyType === 'Multi Family') {
    const rents = state.multi?.unitRents ?? [];
    const rentTotal = rents.reduce((a, b) => a + b, 0);
    return rentTotal + (state.multi?.grossMonthlyIncome ?? 0);
  }
  // Fix & Flip / Arbitrage / BRRRR default monthly income 0 for calculator primary tab
  return 0;
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
    taxes: state.ops.taxes || 0,
    insurance: state.ops.insurance || 0,
    hoa: state.ops.hoa || 0,
    gasElectric: state.ops.gasElectric || 0,
    internet: state.ops.internet || 0,
    waterSewer: state.ops.waterSewer || 0,
    heat: state.ops.heat || 0,
    lawnSnow: state.ops.lawnSnow || 0,
    phone: state.ops.phoneBill || 0,
    cleaner: state.ops.cleaner || 0,
    extras: state.ops.extra || 0,
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

function getOperationTypeOptions(propertyType: PropertyType): OperationType[] {
  if (propertyType === 'Hotel') {
    return ['Buy & Hold', 'Rental Arbitrage'];
  }
  return ['Buy & Hold', 'Fix & Flip', 'Short Term Rental', 'Rental Arbitrage', 'BRRRR'];
}

function getOfferTypeOptions(propertyType: PropertyType, operationType: OperationType): OfferType[] {
  if (operationType === 'Rental Arbitrage') {
    if (propertyType === 'Single Family' || propertyType === 'Multi Family') {
      return ['Private', 'Line of Credit', 'SBA'];
    }
    return [];
  }
  if (operationType === 'Fix & Flip' || operationType === 'BRRRR') {
    return ['Seller Finance', 'SBA', 'Hard Money', 'Private'];
  }
  if (operationType === 'Buy & Hold' && (propertyType === 'Single Family' || propertyType === 'Multi Family')) {
    return ['FHA', 'Cash', 'Seller Finance', 'Conventional', 'SBA', 'DSCR', 'Subject To Existing Mortgage', 'Hybrid'];
  }
  return ['Cash', 'Seller Finance', 'Conventional', 'SBA', 'DSCR', 'Subject To Existing Mortgage', 'Hybrid'];
}

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

  function updateSfr<K extends keyof IncomeInputsSfr>(key: K, value: IncomeInputsSfr[K]) {
    setState((prev) => ({ 
      ...prev, 
      sfr: { 
        monthlyRent: 0,
        grossMonthlyIncome: 0,
        grossYearlyIncome: 0,
        [key]: value 
      } 
    }));
  }

  function updateMulti<K extends keyof IncomeInputsMulti>(key: K, value: IncomeInputsMulti[K]) {
    setState((prev) => ({ 
      ...prev, 
      multi: { 
        unitRents: [],
        grossMonthlyIncome: 0,
        grossYearlyIncome: 0,
        [key]: value 
      } 
    }));
  }

  function updateStr<K extends keyof IncomeInputsStr>(key: K, value: IncomeInputsStr[K]) {
    setState((prev) => ({ 
      ...prev, 
      str: { 
        unitDailyRents: [],
        unitMonthlyRents: [],
        dailyCleaningFee: 0,
        laundry: 0,
        activities: 0,
        avgNightsPerMonth: 0,
        grossDailyIncome: 0,
        grossMonthlyIncome: 0,
        grossYearlyIncome: 0,
        [key]: value 
      } 
    }));
  }

  function updateArbitrage<K extends keyof ArbitrageInputs>(key: K, value: ArbitrageInputs[K]) {
    setState((prev) => ({
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
    }));
  }

  function updateSubjectTo<K extends keyof SubjectToInputs>(key: K, value: SubjectToInputs[K]) {
    setState((prev) => ({
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
        }));
      }

  function updateHybrid<K extends keyof HybridInputs>(key: K, value: HybridInputs[K]) {
    setState((prev) => ({
      ...prev,
      hybrid: {
        ...(prev.hybrid ?? {
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
        }),
        [key]: value,
      },
    }));
  }

  function updateFixFlip<K extends keyof FixFlipInputs>(key: K, value: FixFlipInputs[K]) {
    setState((prev) => ({
        ...prev,
        fixFlip: {
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
      },
      }));
    }

  function updateBRRRR<K extends keyof BRRRRInputs>(key: K, value: BRRRRInputs[K]) {
    setState((prev) => ({
        ...prev,
        brrrr: {
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
        }),
        [key]: value,
      },
      }));
    }

  function updateSubjectToLoan(index: number, key: keyof SubjectToLoan, value: number) {
    setState((prev) => {
      const newLoans = [...(prev.subjectTo?.loans ?? [])];
      if (!newLoans[index]) {
        newLoans[index] = { amount: 0, annualInterestRate: 0, monthlyPayment: 0 };
      }
      newLoans[index] = { ...newLoans[index], [key]: value };
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
          loans: newLoans,
        },
      };
    });
  }

  function updateHybridSubjectToLoan(index: number, key: keyof SubjectToLoan, value: number) {
    setState((prev) => {
      const newLoans = [...(prev.hybrid?.subjectToLoans ?? [])];
      if (!newLoans[index]) {
        newLoans[index] = { amount: 0, annualInterestRate: 0, monthlyPayment: 0 };
      }
      newLoans[index] = { ...newLoans[index], [key]: value };
      return {
        ...prev,
        hybrid: {
          ...(prev.hybrid ?? {
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
          }),
          subjectToLoans: newLoans,
        },
      };
    });
  }

  function exportToPDF() {
    // TODO: Implement PDF export with jsPDF
    alert('PDF export coming soon! This will include your deal analysis with Dreamery branding.');
  }

  function exportToExcel() {
    // TODO: Implement Excel export with xlsx
    alert('Excel export coming soon! This will include your deal analysis in an editable spreadsheet format.');
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#ffffff', transition: 'all 0.3s ease-in-out' }}>
      <Container maxWidth="lg" sx={{ py: 2, minHeight: '100vh', transition: 'all 0.3s ease-in-out' }}>
        <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', transition: 'all 0.3s ease-in-out', minHeight: 'fit-content' }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              Dreamery Calculator
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Analyze your next real estate investment with our comprehensive calculator. Input your property details and financing terms to see projected returns and key metrics.
            </Typography>
          </CardContent>
        </Card>

        {/* Basic Info Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Basic Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                  fullWidth
                  label="Property Address"
                  value={state.propertyAddress}
                  onChange={(e) => update('propertyAddress', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Agent/Owner"
                  value={state.agentOwner}
                  onChange={(e) => update('agentOwner', e.target.value)}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Analysis Date"
                  value={state.analysisDate}
                  onChange={(e) => update('analysisDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Listed Price"
                  value={state.listedPrice}
                  onChange={(e) => update('listedPrice', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                        <TextField
                  fullWidth
                  label="Purchase Price"
                  value={state.purchasePrice}
                  onChange={(e) => update('purchasePrice', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="% Difference"
                  value={((state.purchasePrice - state.listedPrice) / state.listedPrice * 100).toFixed(1) + '%'}
                  InputProps={{
                    readOnly: true,
                          }}
                        />
                      </Box>

              <Box sx={{ mt: 3, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={state.propertyType}
                    onChange={(e) => update('propertyType', e.target.value as PropertyType)}
                    label="Property Type"
                  >
                    <MenuItem value="Single Family">Single Family</MenuItem>
                    <MenuItem value="Multi Family">Multi Family</MenuItem>
                    <MenuItem value="Hotel">Hotel</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Operation Type</InputLabel>
                  <Select
                    value={state.operationType}
                    onChange={(e) => update('operationType', e.target.value as OperationType)}
                    label="Operation Type"
                  >
                    {getOperationTypeOptions(state.propertyType).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Finance Type</InputLabel>
                  <Select
                    value={state.offerType}
                    onChange={(e) => update('offerType', e.target.value as OfferType)}
                    label="Finance Type"
                  >
                    {getOfferTypeOptions(state.propertyType, state.operationType).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                    </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Loan & Costs Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>
                {state.operationType === 'Rental Arbitrage' ? 'Startup Costs' : 'Loan & Costs'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {state.operationType === 'Rental Arbitrage' ? (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                    fullWidth
                    label="Deposit"
                    value={state.arbitrage?.deposit}
                    onChange={(e) => updateArbitrage('deposit', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Monthly Rent to Landlord"
                    value={state.arbitrage?.monthlyRentToLandlord}
                    onChange={(e) => updateArbitrage('monthlyRentToLandlord', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                          <TextField
                    fullWidth
                    label="Estimate Cost of Repairs"
                    value={state.arbitrage?.estimateCostOfRepairs}
                    onChange={(e) => updateArbitrage('estimateCostOfRepairs', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                        <TextField
                    fullWidth
                    label="Furniture Cost"
                    value={state.arbitrage?.furnitureCost}
                    onChange={(e) => updateArbitrage('furnitureCost', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Other Startup Costs"
                    value={state.arbitrage?.otherStartupCosts}
                    onChange={(e) => updateArbitrage('otherStartupCosts', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                    fullWidth
                    label="Down Payment"
                    value={state.loan.downPayment}
                    onChange={(e) => updateLoan('downPayment', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                        <TextField
                    fullWidth
                    label="Interest Rate"
                    value={state.loan.annualInterestRate}
                    onChange={(e) => updateLoan('annualInterestRate', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Amortization Years"
                    type="number"
                    value={state.loan.amortizationYears}
                    onChange={(e) => updateLoan('amortizationYears', parseInt(e.target.value) || 0)}
                        />
                        <TextField
                    fullWidth
                    label="Closing Costs"
                    value={state.loan.closingCosts}
                    onChange={(e) => updateLoan('closingCosts', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                      </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Income Section */}
        {state.operationType !== 'Fix & Flip' && (
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Income</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Property Configuration */}
                {(state.propertyType === 'Multi Family' || state.propertyType === 'Hotel') && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                      sx={{ width: '200px' }}
                      label="Number of Units"
                      type="number"
                      value={state.propertyType === 'Hotel' ? state.str?.unitDailyRents.length : state.multi?.unitRents.length}
                      onChange={(e) => {
                        const count = Math.max(1, parseInt(e.target.value) || 1);
                        if (state.propertyType === 'Hotel') {
                          const newRents = Array(count).fill(0).map((_, i) => state.str?.unitDailyRents[i] || 0);
                          updateStr('unitDailyRents', newRents);
                        } else {
                        const newRents = Array(count).fill(0).map((_, i) => state.multi?.unitRents[i] || 0);
                        updateMulti('unitRents', newRents);
                        }
                      }}
                    />
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                      {(state.propertyType === 'Hotel' ? state.str?.unitDailyRents : state.multi?.unitRents)?.map((rent, index) => (
                          <TextField
                        key={index}
                        fullWidth
                          label={`Unit ${index + 1} ${state.propertyType === 'Hotel' || state.operationType === 'Short Term Rental' ? 'Nightly Rate' : 'Monthly Rent'}`}
                        value={rent}
                            onChange={(e) => {
                            if (state.propertyType === 'Hotel') {
                              const newRents = [...(state.str?.unitDailyRents || [])];
                              newRents[index] = parseCurrency(e.target.value);
                              updateStr('unitDailyRents', newRents);
                            } else {
                          const newRents = [...(state.multi?.unitRents || [])];
                          newRents[index] = parseCurrency(e.target.value);
                          updateMulti('unitRents', newRents);
                            }
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {/* Short Term Income Fields (STR, Arbitrage, Hotel) */}
                {(state.propertyType === 'Hotel' || state.operationType === 'Short Term Rental' || state.operationType === 'Rental Arbitrage') && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Single Family Nightly Rate */}
                    {state.propertyType === 'Single Family' && (
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                      fullWidth
                          label="Nightly Rate"
                          value={state.str?.unitDailyRents[0]}
                      onChange={(e) => {
                            const newRents = [...(state.str?.unitDailyRents || [])];
                            newRents[0] = parseCurrency(e.target.value);
                        updateStr('unitDailyRents', newRents);
                      }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                    />
                      </Box>
                    )}
                    
                    {/* Common Short Term Income Fields */}
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                      fullWidth
                      label="Average Nights/Month"
                      type="number"
                      value={state.str?.avgNightsPerMonth}
                      onChange={(e) => updateStr('avgNightsPerMonth', parseInt(e.target.value) || 0)}
                    />
                    <TextField
                      fullWidth
                      label="Daily Cleaning Fee"
                      value={state.str?.dailyCleaningFee}
                      onChange={(e) => updateStr('dailyCleaningFee', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                        />
                      </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                        fullWidth
                        label="Additional Guest Fee (Monthly)"
                        value={state.str?.laundry}
                        onChange={(e) => updateStr('laundry', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        />
                        <TextField
                      fullWidth
                      label="Laundry (Monthly)"
                      value={state.str?.laundry}
                      onChange={(e) => updateStr('laundry', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                      fullWidth
                        label="Experiences (Monthly)"
                      value={state.str?.activities}
                      onChange={(e) => updateStr('activities', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Extra Monthly Income"
                      value={state.str?.grossMonthlyIncome}
                      onChange={(e) => updateStr('grossMonthlyIncome', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                        />
                      </Box>
                    </Box>
                  )}

                {/* Extra Income - Always shown at bottom */}
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr' } }}>
                  <TextField
                    fullWidth
                    label="Extra Monthly Income"
                    value={
                      state.propertyType === 'Single Family'
                        ? state.sfr?.grossMonthlyIncome
                        : state.propertyType === 'Multi Family'
                        ? state.multi?.grossMonthlyIncome
                        : state.str?.grossMonthlyIncome
                    }
                    onChange={(e) => {
                      const value = parseCurrency(e.target.value);
                      if (state.propertyType === 'Single Family') {
                        updateSfr('grossMonthlyIncome', value);
                      } else if (state.propertyType === 'Multi Family') {
                        updateMulti('grossMonthlyIncome', value);
                      } else {
                        updateStr('grossMonthlyIncome', value);
                      }
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
        </Card>
        )}

            {/* Operating Expenses Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Operating Expenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>Fixed Monthly Expenses</Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
                  <TextField
                  fullWidth
                  label="Taxes"
                    value={state.ops.taxes}
                    onChange={(e) => updateOps('taxes', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                  label="Insurance"
                    value={state.ops.insurance}
                    onChange={(e) => updateOps('insurance', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                  label="HOA"
                    value={state.ops.hoa}
                    onChange={(e) => updateOps('hoa', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Gas & Electric"
                    value={state.ops.gasElectric}
                    onChange={(e) => updateOps('gasElectric', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Internet"
                    value={state.ops.internet}
                    onChange={(e) => updateOps('internet', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Water & Sewer"
                    value={state.ops.waterSewer}
                    onChange={(e) => updateOps('waterSewer', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Heat"
                    value={state.ops.heat}
                    onChange={(e) => updateOps('heat', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Lawn & Snow"
                    value={state.ops.lawnSnow}
                    onChange={(e) => updateOps('lawnSnow', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Phone Bill"
                    value={state.ops.phoneBill}
                    onChange={(e) => updateOps('phoneBill', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Cleaner"
                    value={state.ops.cleaner}
                    onChange={(e) => updateOps('cleaner', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                    label="Extra Expenses"
                    value={state.ops.extra}
                    onChange={(e) => updateOps('extra', parseCurrency(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  />
                </Box>
                
              <Typography variant="subtitle2" sx={{ mt: 4, mb: 2, color: '#666' }}>Variable Expenses (% of Income)</Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
                  <TextField
                  fullWidth
                  label="Maintenance %"
                    value={state.ops.maintenance}
                    onChange={(e) => updateOps('maintenance', parseCurrency(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                  label="Vacancy %"
                    value={state.ops.vacancy}
                    onChange={(e) => updateOps('vacancy', parseCurrency(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                  label="Management %"
                    value={state.ops.management}
                    onChange={(e) => updateOps('management', parseCurrency(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                  label="CapEx %"
                    value={state.ops.capEx}
                    onChange={(e) => updateOps('capEx', parseCurrency(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  />
                  <TextField
                  fullWidth
                  label="OpEx %"
                    value={state.ops.opEx}
                    onChange={(e) => updateOps('opEx', parseCurrency(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
        </Card>

            {/* Pro Forma Presets */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Pro Forma Presets</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                      updateOps('maintenance', 5);
                      updateOps('vacancy', 5);
                      updateOps('management', 5);
                      updateOps('capEx', 5);
                      updateOps('opEx', 5);
                  }}
                >
                  Conservative
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                      updateOps('maintenance', 8);
                      updateOps('vacancy', 8);
                      updateOps('management', 8);
                      updateOps('capEx', 8);
                      updateOps('opEx', 8);
                    }}
                  >
                    Moderate (Default)
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                      updateOps('maintenance', 10);
                      updateOps('vacancy', 10);
                      updateOps('management', 10);
                      updateOps('capEx', 10);
                      updateOps('opEx', 10);
                  }}
                >
                  Aggressive
                </Button>
              </Box>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Conservative</Typography>
                    <Typography variant="body2">
                      • Maintenance: 5%<br />
                      • Vacancy: 5%<br />
                      • Management: 5%<br />
                      • CapEx: 5%<br />
                      • OpEx: 5%
              </Typography>
                  </Card>

                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Moderate (Default)</Typography>
                    <Typography variant="body2">
                      • Maintenance: 8%<br />
                      • Vacancy: 8%<br />
                      • Management: 8%<br />
                      • CapEx: 8%<br />
                      • OpEx: 8%
                    </Typography>
                  </Card>

                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Aggressive</Typography>
                    <Typography variant="body2">
                      • Maintenance: 10%<br />
                      • Vacancy: 10%<br />
                      • Management: 10%<br />
                      • CapEx: 10%<br />
                      • OpEx: 10%
                    </Typography>
                  </Card>
                  </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Want to save your own presets? Upgrade to Pro!
                  </Typography>
                  <Button variant="contained" color="primary">
                    Upgrade Now
                  </Button>
                </Box>
                  </Box>
                </AccordionDetails>
            </Accordion>
        </Card>

        {/* Loan & Costs Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>
                {state.operationType === 'Rental Arbitrage' ? 'Startup Costs' : 'Loan & Costs'}
              </Typography>
              </AccordionSummary>
              <AccordionDetails>
                  {state.operationType === 'Rental Arbitrage' ? (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                    fullWidth
                    label="Damage Deposit"
                    value={state.arbitrage?.deposit}
                    onChange={(e) => updateArbitrage('deposit', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Furniture Cost"
                    value={state.arbitrage?.furnitureCost}
                    onChange={(e) => updateArbitrage('furnitureCost', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Repairs/Setup"
                    value={state.arbitrage?.estimateCostOfRepairs}
                    onChange={(e) => updateArbitrage('estimateCostOfRepairs', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Other Startup Costs"
                    value={state.arbitrage?.otherStartupCosts}
                    onChange={(e) => updateArbitrage('otherStartupCosts', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                    </Box>
                  ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                    fullWidth
                          label="Purchase Price"
                          value={state.purchasePrice}
                          onChange={(e) => update('purchasePrice', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Down Payment"
                          value={state.loan.downPayment}
                          onChange={(e) => updateLoan('downPayment', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Interest Rate"
                          value={state.loan.annualInterestRate}
                          onChange={(e) => updateLoan('annualInterestRate', parseCurrency(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                          label="Amortization (years)"
                    type="number"
                          value={state.loan.amortizationYears}
                    onChange={(e) => updateLoan('amortizationYears', parseInt(e.target.value) || 0)}
                        />
                        <TextField
                    fullWidth
                    label="Closing Costs"
                    value={state.loan.closingCosts}
                          onChange={(e) => updateLoan('closingCosts', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                        <TextField
                    fullWidth
                    label="Rehab Costs"
                    value={state.loan.rehabCosts}
                          onChange={(e) => updateLoan('rehabCosts', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                        />
                  {state.operationType === 'Short Term Rental' && (
                          <TextField
                      fullWidth
                      label="Furniture Cost"
                      value={state.arbitrage?.furnitureCost}
                      onChange={(e) => updateArbitrage('furnitureCost', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                    </Box>
                  )}
              </AccordionDetails>
            </Accordion>
        </Card>

        {/* Subject-To Existing Mortgage Section */}
        {(state.offerType === 'Subject To Existing Mortgage' || state.offerType === 'Hybrid') && state.operationType !== 'Rental Arbitrage' && (
          <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Subject-To Existing Mortgage</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                    fullWidth
                    label="Payment to Seller (one-time)"
                    value={state.subjectTo?.paymentToSeller}
                    onChange={(e) => updateSubjectTo('paymentToSeller', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#666' }}>Existing Loans</Typography>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Loan 1</Typography>
                      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                          fullWidth
                          label="Loan Amount"
                          value={state.subjectTo?.loans[0]?.amount}
                          onChange={(e) => updateSubjectToLoan(0, 'amount', parseCurrency(e.target.value))}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Interest Rate"
                          value={state.subjectTo?.loans[0]?.annualInterestRate}
                          onChange={(e) => updateSubjectToLoan(0, 'annualInterestRate', parseCurrency(e.target.value))}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                    <TextField
                      fullWidth
                          label="Monthly Payment"
                          value={state.subjectTo?.loans[0]?.monthlyPayment}
                          onChange={(e) => updateSubjectToLoan(0, 'monthlyPayment', parseCurrency(e.target.value))}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                    />
                  </Box>

                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2 }}>Loan 2</Typography>
                      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                      <TextField
                          fullWidth
                        label="Loan Amount"
                          value={state.subjectTo?.loans[1]?.amount}
                          onChange={(e) => updateSubjectToLoan(1, 'amount', parseCurrency(e.target.value))}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                      />
                      <TextField
                          fullWidth
                          label="Interest Rate"
                          value={state.subjectTo?.loans[1]?.annualInterestRate}
                          onChange={(e) => updateSubjectToLoan(1, 'annualInterestRate', parseCurrency(e.target.value))}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                      />
                      <TextField
                          fullWidth
                        label="Monthly Payment"
                          value={state.subjectTo?.loans[1]?.monthlyPayment}
                          onChange={(e) => updateSubjectToLoan(1, 'monthlyPayment', parseCurrency(e.target.value))}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                      />
                    </Box>
                  </Box>

                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>Auto-calculated Totals</Typography>
                      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
                      <TextField
                          fullWidth
                          label="Total Loan Balance"
                          value={formatCurrency(state.subjectTo?.totalLoanBalance || 0)}
                          InputProps={{
                            readOnly: true,
                          }}
                      />
                      <TextField
                          fullWidth
                          label="Total Monthly Payment"
                          value={formatCurrency(state.subjectTo?.totalMonthlyPayment || 0)}
                          InputProps={{
                            readOnly: true,
                          }}
                      />
                      <TextField
                          fullWidth
                          label="Total Annual Payment"
                          value={formatCurrency(state.subjectTo?.totalAnnualPayment || 0)}
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

        {/* Hybrid Financing Section */}
        {state.offerType === 'Hybrid' && state.operationType !== 'Rental Arbitrage' && (
          <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Hybrid Financing</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#666' }}>New Note (Loan 3)</Typography>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                      <TextField
                        fullWidth
                        label="Down Payment"
                        value={state.hybrid?.downPayment}
                        onChange={(e) => updateHybrid('downPayment', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Loan Amount"
                        value={state.hybrid?.loan3Amount}
                        onChange={(e) => updateHybrid('loan3Amount', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Interest Rate"
                        value={state.hybrid?.annualInterestRate}
                        onChange={(e) => updateHybrid('annualInterestRate', parseCurrency(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Monthly Payment"
                        value={state.hybrid?.monthlyPayment}
                        onChange={(e) => updateHybrid('monthlyPayment', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.hybrid?.interestOnly}
                            onChange={(e) => updateHybrid('interestOnly', e.target.checked)}
                          />
                        }
                        label="Interest Only"
                      />
                      <TextField
                        fullWidth
                        label="Balloon Due (years)"
                        type="number"
                        value={state.hybrid?.balloonDue}
                        onChange={(e) => updateHybrid('balloonDue', parseInt(e.target.value) || 0)}
                      />
                    </Box>
                  </Box>

                    <TextField
                      fullWidth
                    label="Payment to Seller"
                    value={state.hybrid?.paymentToSeller}
                    onChange={(e) => updateHybrid('paymentToSeller', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />

                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>Combined Financing Summary</Typography>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
                      <TextField
                        fullWidth
                        label="Total Loan Balance"
                        value={formatCurrency(state.hybrid?.totalLoanBalance || 0)}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Total Monthly Payment"
                        value={formatCurrency(state.hybrid?.totalMonthlyPayment || 0)}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Total Annual Payment"
                        value={formatCurrency(state.hybrid?.totalAnnualPayment || 0)}
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

        {/* Fix & Flip Section */}
            {state.operationType === 'Fix & Flip' && (
          <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Fix & Flip</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <TextField
                    fullWidth
                    label="After Repair Value (ARV)"
                    value={state.fixFlip?.arv}
                    onChange={(e) => updateFixFlip('arv', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                      label="Months Until Flip"
                    type="number"
                    value={state.fixFlip?.holdingPeriodMonths}
                    onChange={(e) => updateFixFlip('holdingPeriodMonths', parseInt(e.target.value) || 0)}
                    />
                    <TextField
                    fullWidth
                      label="Holding Costs (Monthly)"
                    value={state.fixFlip?.holdingCosts}
                    onChange={(e) => updateFixFlip('holdingCosts', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                    <TextField
                    fullWidth
                      label="Selling Costs %"
                    value={state.fixFlip?.sellingCostsPercent}
                    onChange={(e) => updateFixFlip('sellingCostsPercent', parseCurrency(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                    label="Target %"
                    value={state.fixFlip?.targetPercent}
                    onChange={(e) => updateFixFlip('targetPercent', parseCurrency(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                    label="Rehab Cost"
                    value={state.fixFlip?.rehabCost}
                    onChange={(e) => updateFixFlip('rehabCost', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    />
                  </Box>
                  
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>Auto-calculated Results</Typography>
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <TextField
                      fullWidth
                      label="Maximum Allowable Offer"
                      value={formatCurrency(state.fixFlip?.maximumAllowableOffer || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Projected Profit"
                      value={formatCurrency(state.fixFlip?.projectedProfit || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="ROI During Hold"
                      value={((state.fixFlip?.roiDuringHold || 0).toFixed(1) + '%')}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Annualized ROI"
                      value={((state.fixFlip?.annualizedRoi || 0).toFixed(1) + '%')}
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

        {/* BRRRR Section */}
            {state.operationType === 'BRRRR' && (
          <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>BRRRR</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <TextField
                    fullWidth
                    label="After Repair Value (ARV)"
                    value={state.brrrr?.arv}
                    onChange={(e) => updateBRRRR('arv', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                    label="Refinance LTV %"
                    value={state.brrrr?.refinanceLtv}
                    onChange={(e) => updateBRRRR('refinanceLtv', parseCurrency(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                    label="Refinance Interest Rate"
                    value={state.brrrr?.refinanceInterestRate}
                    onChange={(e) => updateBRRRR('refinanceInterestRate', parseCurrency(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                      label="Loan Term (years)"
                    type="number"
                    value={state.brrrr?.loanTerm}
                    onChange={(e) => updateBRRRR('loanTerm', parseInt(e.target.value) || 0)}
                    />
                    <TextField
                    fullWidth
                      label="New Monthly Payment"
                    value={state.brrrr?.newMonthlyPayment}
                    onChange={(e) => updateBRRRR('newMonthlyPayment', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    />
                    <TextField
                    fullWidth
                      label="Original Cash Invested"
                    value={state.brrrr?.originalCashInvested}
                    onChange={(e) => updateBRRRR('originalCashInvested', parseCurrency(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    />
                  </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>Auto-calculated Results</Typography>
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
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
                      value={formatCurrency(state.brrrr?.remainingCashInDeal || 0)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Cash on Cash Return"
                      value={((state.brrrr?.newCashOnCashReturn || 0).toFixed(1) + '%')}
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

        {/* Amortization Schedule Section */}
            {state.operationType !== 'Rental Arbitrage' && (
          <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Amortization Schedule</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (state.loan.amortizationYears * 12) / 600 * 100)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>

                  <Box sx={{ overflowX: 'auto' }}>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell>{formatCurrency(row.interest)}</TableCell>
                            <TableCell>{formatCurrency(row.principal)}</TableCell>
                            <TableCell>{formatCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  </Box>

                  <Typography variant="caption" align="center" sx={{ color: '#666' }}>
                    Showing {state.loan.amortizationYears * 12} payments over {state.loan.amortizationYears} years
                </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {/* Appreciation Calculator Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Appreciation Calculator</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField
                  fullWidth
                  label="Annual Appreciation %"
                  value={state.appreciation?.appreciationPercentPerYear}
                  onChange={(e) => updateAppreciation('appreciationPercentPerYear', parseCurrency(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Years to Hold"
                  type="number"
                  value={state.appreciation?.yearsOfAppreciation}
                  onChange={(e) => updateAppreciation('yearsOfAppreciation', parseInt(e.target.value) || 0)}
                />
                </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>Auto-calculated Results</Typography>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    fullWidth
                    label="Future Value"
                    value={formatCurrency(state.appreciation?.futurePropertyValue || 0)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Total Appreciation"
                    value={formatCurrency((state.appreciation?.futurePropertyValue || 0) - state.purchasePrice)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
                  </Box>
              </AccordionDetails>
            </Accordion>
        </Card>



        {/* At a Glance Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>At a Glance</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
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
                    value={state.analysisDate}
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

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
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
                    value={(state.loan.annualInterestRate || 0).toFixed(2) + '%'}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Monthly Payment"
                    value={formatCurrency(state.loan.monthlyPayment || 0)}
                    InputProps={{ readOnly: true }}
                      />
                    </Box>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    fullWidth
                    label="Monthly Income"
                    value={formatCurrency(computeIncome(state))}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Monthly Operating Expenses"
                    value={formatCurrency(computeFixedMonthlyOps(state.ops))}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Monthly Debt Service"
                    value={formatCurrency(totalMonthlyDebtService({
                      newLoanMonthly: state.loan.monthlyPayment || 0,
                      subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
                      hybridMonthly: state.hybrid?.monthlyPayment
                    }))}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Monthly Cash Flow"
                    value={formatCurrency(computeIncome(state) - computeFixedMonthlyOps(state.ops) - totalMonthlyDebtService({
                      newLoanMonthly: state.loan.monthlyPayment || 0,
                      subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
                      hybridMonthly: state.hybrid?.monthlyPayment
                    }))}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Annual Cash Flow"
                    value={formatCurrency((computeIncome(state) - computeFixedMonthlyOps(state.ops) - totalMonthlyDebtService({
                      newLoanMonthly: state.loan.monthlyPayment || 0,
                      subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
                      hybridMonthly: state.hybrid?.monthlyPayment
                    })) * 12)}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Cash on Cash Return"
                    value={(computeCocAnnual(state, (computeIncome(state) - computeFixedMonthlyOps(state.ops) - totalMonthlyDebtService({
                      newLoanMonthly: state.loan.monthlyPayment || 0,
                      subjectToMonthlyTotal: state.subjectTo?.totalMonthlyPayment,
                      hybridMonthly: state.hybrid?.monthlyPayment
                    })) * 12)).toFixed(1) + '%'}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Break Even Occupancy"
                    value={financeBreakEvenOccupancy({
                      monthlyRevenueAt100: computeIncome(state),
                      fixedMonthlyOps: computeFixedMonthlyOps(state.ops),
                      variablePct: computeVariableMonthlyOpsPct(state.ops),
                      includeVariablePct: state.includeVariablePctInBreakeven || false
                    }).toFixed(1) + '%'}
                    InputProps={{ readOnly: true }}
                  />
                  </Box>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    fullWidth
                    label="Total Project Cost"
                    value={formatCurrency(state.purchasePrice + (state.loan.closingCosts || 0) + (state.loan.rehabCosts || 0) + (state.arbitrage?.furnitureCost || 0))}
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
                    value={formatCurrency(computeIncome(state) * computeVariableMonthlyOpsPct(state.ops) / 100)}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Total Monthly Expenses"
                    value={formatCurrency(computeFixedMonthlyOps(state.ops) + computeIncome(state) * computeVariableMonthlyOpsPct(state.ops) / 100)}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Total Annual Expenses"
                    value={formatCurrency((computeFixedMonthlyOps(state.ops) + computeIncome(state) * computeVariableMonthlyOpsPct(state.ops) / 100) * 12)}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
                </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Export & Reports Section */}
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Export & Reports</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={exportToPDF}
                >
                  Export to PDF
                </Button>
                <Button
                  variant="outlined"
                  onClick={exportToExcel}
                >
                  Export to Excel
                </Button>
              </Box>
              </AccordionDetails>
            </Accordion>
        </Card>

        {/* Save Locally + Reset Buttons */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={saveDeal}
          >
            Save Locally
          </Button>
          <Button
            variant="outlined"
            onClick={() => setState(defaultState)}
          >
            Reset
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UnderwritePage;
