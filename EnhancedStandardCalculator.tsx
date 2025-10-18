import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider,
  Grid,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Snackbar,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
} from "@mui/icons-material";

// Import utilities
import { 
  calculateMonthlyPayment,
  calculateCashOnCashReturn,
  calculateCapRate,
  calculateROI,
  calculateIRR,
  calculateMOIC,
  generateAmortizationSchedule,
  formatCurrency,
  formatPercent,
  parseCurrency,
  type AmortizationEntry,
} from './financeUtils';
import { brandColors } from './theme';
import { ModeSelector } from './ModeSelector';
import { UpgradePrompt } from './UpgradePrompt';

// Types
export type CalculatorMode = 'essential' | 'standard' | 'professional';
export type PropertyType = 'SFR' | 'Multi Family' | 'Commercial' | 'Land' | 'Hotel' | 'Office' | 'Retail' | 'Condo' | 'Townhouse';
export type OperationType = 'Buy & Hold' | 'Fix & Flip' | 'Short Term Rental' | 'Rental Arbitrage' | 'BRRRR';
export type OfferType = 'Cash' | 'Conventional' | 'FHA' | 'VA' | 'USDA' | 'Subject To Existing Mortgage' | 'Seller Finance' | 'Hybrid' | 'Hard Money' | 'Private' | 'Line of Credit' | 'SBA' | 'DSCR';

export interface LoanTerms {
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  amortizationYears: number;
  closingCosts: number;
  rehabCosts: number;
  points: number;
  interestOnly: boolean;
  ioPeriodMonths: number;
}

export interface SubjectToInputs {
  existingBalance: number;
  existingRate: number;
  existingPayment: number;
  existingTerm: number;
}

export interface HybridInputs {
  cashPortion: number;
  loanPortion: number;
  sellerFinancePortion: number;
  sellerFinanceRate: number;
  sellerFinanceTerm: number;
}

export interface FixFlipInputs {
  purchasePrice: number;
  rehabCosts: number;
  holdingCosts: number;
  sellingCosts: number;
  targetProfit: number;
  timelineMonths: number;
}

export interface BRRRRInputs {
  purchasePrice: number;
  rehabCosts: number;
  refinanceLtv: number;
  refinanceRate: number;
  refinanceTerm: number;
  refinanceClosingCosts: number;
}

export interface IncomeInputsSfr {
  monthlyRent: number;
  yearlyRent: number;
  rentGrowthRate: number;
}

export interface IncomeInputsMulti {
  units: number;
  avgRentPerUnit: number;
  occupancyRate: number;
  rentGrowthRate: number;
}

export interface IncomeInputsStr {
  nightlyRate: number;
  occupancyRate: number;
  cleaningFee: number;
  platformFees: number;
  seasonalAdjustment: number;
}

export interface ArbitrageInputs {
  deposit: number;
  estimateCostOfRepairs: number;
  furnitureCost: number;
  otherStartupCosts: number;
}

export interface OperatingInputsCommon {
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

export interface AppreciationInputs {
  annualAppreciationRate: number;
  holdingPeriodYears: number;
}

export interface DealState {
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

// Enhanced Standard Calculator Component
export const EnhancedStandardCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);

  // Initialize state with default values
  const [state, setState] = useState<DealState>({
    propertyType: 'SFR',
    operationType: 'Buy & Hold',
    offerType: 'Conventional',
    propertyAddress: '',
    agentOwner: '',
    call: '',
    email: '',
    analysisDate: new Date().toISOString().split('T')[0],
    listedPrice: 250000,
    purchasePrice: 250000,
    percentageDifference: 0,
    loan: {
      downPayment: 50000,
      loanAmount: 200000,
      interestRate: 6.5,
      amortizationYears: 30,
      closingCosts: 6000,
      rehabCosts: 0,
      points: 0,
      interestOnly: false,
      ioPeriodMonths: 0,
    },
    ops: {
      principalAndInterest: 0,
      totalSubtoLoans: 0,
      taxes: 3000,
      insurance: 1200,
      gasElectric: 200,
      internet: 50,
      hoa: 0,
      cleaner: 0,
      waterSewer: 100,
      heat: 150,
      lawnSnow: 50,
      phoneBill: 0,
      extra: 0,
      maintenance: 200,
      vacancy: 100,
      management: 200,
      capEx: 200,
      opEx: 0,
      expensesWithoutMortgage: 0,
      monthlyExpenses: 0,
      monthlyExpensesPercent: 0,
      yearlyExpenses: 0,
      expensesWithMortgage: 0,
      monthlyExpensesWithMortgage: 0,
      yearlyExpensesWithMortgage: 0,
    },
    sfr: {
      monthlyRent: 2000,
      yearlyRent: 24000,
      rentGrowthRate: 3,
    },
    appreciation: {
      annualAppreciationRate: 3,
      holdingPeriodYears: 10,
    },
    showBothPaybackMethods: false,
    paybackCalculationMethod: 'initial',
    reservesCalculationMethod: 'months',
    reservesMonths: 6,
    reservesFixedAmount: 5000,
    includeVariableExpensesInBreakEven: true,
    includeVariablePctInBreakeven: false,
  });

  // Calculate derived values
  const calculations = useMemo(() => {
    const monthlyIncome = state.sfr?.monthlyRent || 0;
    const monthlyFixedOps = state.ops.taxes / 12 + state.ops.insurance / 12 + 
                           state.ops.gasElectric + state.ops.internet + state.ops.hoa +
                           state.ops.cleaner + state.ops.waterSewer + state.ops.heat +
                           state.ops.lawnSnow + state.ops.phoneBill + state.ops.extra +
                           state.ops.maintenance + state.ops.vacancy + state.ops.management +
                           state.ops.capEx + state.ops.opEx;
    
    const monthlyVariableOps = monthlyIncome * (state.ops.vacancy / 100) + 
                              monthlyIncome * (state.ops.management / 100);
    
    const monthlyExpenses = monthlyFixedOps + monthlyVariableOps + state.ops.principalAndInterest;
    const monthlyCashFlow = monthlyIncome - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    
    const cashInvested = state.loan.downPayment + state.loan.closingCosts + state.loan.rehabCosts;
    const annualAppreciation = state.purchasePrice * (state.appreciation.annualAppreciationRate / 100);
    
    // Calculate IRR (simplified - would need more complex cash flow projections)
    const cashFlows = [-cashInvested];
    for (let year = 1; year <= state.appreciation.holdingPeriodYears; year++) {
      cashFlows.push(annualCashFlow + annualAppreciation);
    }
    const irr = calculateIRR(cashFlows);
    
    // Calculate MOIC
    const totalCashReceived = annualCashFlow * state.appreciation.holdingPeriodYears + 
                             state.purchasePrice * Math.pow(1 + state.appreciation.annualAppreciationRate / 100, state.appreciation.holdingPeriodYears);
    const moic = calculateMOIC(cashInvested, totalCashReceived);
    
    return {
      monthlyIncome,
      monthlyFixedOps,
      monthlyVariableOps,
      monthlyExpenses,
      monthlyCashFlow,
      annualCashFlow,
      cashInvested,
      annualAppreciation,
      cashOnCashReturn: calculateCashOnCashReturn(cashInvested, annualCashFlow),
      capRate: calculateCapRate(annualCashFlow, state.purchasePrice),
      roi: calculateROI(cashInvested, annualCashFlow, annualAppreciation),
      irr,
      moic,
    };
  }, [state]);

  // Update loan calculations when inputs change
  useEffect(() => {
    const monthlyPayment = calculateMonthlyPayment(
      state.loan.loanAmount,
      state.loan.interestRate,
      state.loan.amortizationYears
    );
    
    setState(prev => ({
      ...prev,
      loan: {
        ...prev.loan,
        loanAmount: prev.purchasePrice - prev.loan.downPayment,
      },
      ops: {
        ...prev.ops,
        principalAndInterest: monthlyPayment,
      },
    }));
  }, [state.purchasePrice, state.loan.downPayment, state.loan.interestRate, state.loan.amortizationYears]);

  // Generate amortization schedule
  useEffect(() => {
    if (state.loan.loanAmount > 0 && state.loan.interestRate > 0) {
      const schedule = generateAmortizationSchedule(
        state.loan.loanAmount,
        state.loan.interestRate,
        state.loan.amortizationYears
      );
      setAmortizationSchedule(schedule);
    }
  }, [state.loan.loanAmount, state.loan.interestRate, state.loan.amortizationYears]);

  const handleInputChange = (field: string, value: any) => {
    setState(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof DealState],
            [keys[1]]: value,
          },
        };
      }
      return prev;
    });
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Check if feature requires upgrade
  const requiresUpgrade = (requiredMode: CalculatorMode): boolean => {
    const modeOrder: CalculatorMode[] = ['essential', 'standard', 'professional'];
    const currentIndex = modeOrder.indexOf(mode);
    const requiredIndex = modeOrder.indexOf(requiredMode);
    return currentIndex < requiredIndex;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: brandColors.backgrounds.primary }}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
        <Card sx={{ borderRadius: 2, border: `1px solid ${brandColors.borders.primary}` }}>
          <CardContent>
            {/* Header */}
            <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.text.primary, mb: 1 }}>
              Dreamery Calculator
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.text.secondary, mb: 2 }}>
              Fill the red inputs. Sections expand based on your Property Type and Finance Type selections. Amortization
              schedule supports up to 50 years.
            </Typography>

            {/* Mode Selector */}
            <ModeSelector value={mode} onChange={setMode} />

            {/* Basic Info Accordion */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Basic Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Property Address"
                      value={state.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Agent/Owner"
                      value={state.agentOwner}
                      onChange={(e) => handleInputChange('agentOwner', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Property Type</InputLabel>
                      <Select
                        value={state.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        label="Property Type"
                      >
                        <MenuItem value="SFR">Single Family Residence</MenuItem>
                        <MenuItem value="Multi Family">Multi Family</MenuItem>
                        <MenuItem value="Commercial">Commercial</MenuItem>
                        <MenuItem value="Land">Land</MenuItem>
                        <MenuItem value="Hotel">Hotel</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Retail">Retail</MenuItem>
                        <MenuItem value="Condo">Condo</MenuItem>
                        <MenuItem value="Townhouse">Townhouse</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Operation Type</InputLabel>
                      <Select
                        value={state.operationType}
                        onChange={(e) => handleInputChange('operationType', e.target.value)}
                        label="Operation Type"
                      >
                        <MenuItem value="Buy & Hold">Buy & Hold</MenuItem>
                        <MenuItem value="Fix & Flip">Fix & Flip</MenuItem>
                        <MenuItem value="Short Term Rental">Short Term Rental</MenuItem>
                        <MenuItem value="Rental Arbitrage">Rental Arbitrage</MenuItem>
                        <MenuItem value="BRRRR">BRRRR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Offer Type</InputLabel>
                      <Select
                        value={state.offerType}
                        onChange={(e) => handleInputChange('offerType', e.target.value)}
                        label="Offer Type"
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Conventional">Conventional</MenuItem>
                        <MenuItem value="FHA">FHA</MenuItem>
                        <MenuItem value="VA">VA</MenuItem>
                        <MenuItem value="USDA">USDA</MenuItem>
                        <MenuItem value="Subject To Existing Mortgage">Subject To Existing Mortgage</MenuItem>
                        <MenuItem value="Seller Finance">Seller Finance</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                        <MenuItem value="Hard Money">Hard Money</MenuItem>
                        <MenuItem value="Private">Private</MenuItem>
                        <MenuItem value="Line of Credit">Line of Credit</MenuItem>
                        <MenuItem value="SBA">SBA</MenuItem>
                        <MenuItem value="DSCR">DSCR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Listed Price"
                      type="number"
                      value={state.listedPrice}
                      onChange={(e) => handleInputChange('listedPrice', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Purchase Price"
                      type="number"
                      value={state.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Income Accordion */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Income</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monthly Rent"
                      type="number"
                      value={state.sfr?.monthlyRent || 0}
                      onChange={(e) => handleInputChange('sfr.monthlyRent', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Yearly Rent"
                      type="number"
                      value={state.sfr?.yearlyRent || 0}
                      onChange={(e) => handleInputChange('sfr.yearlyRent', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Rent Growth Rate"
                      type="number"
                      value={state.sfr?.rentGrowthRate || 0}
                      onChange={(e) => handleInputChange('sfr.rentGrowthRate', parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Operating Expenses Accordion */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Operating Expenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Property Taxes"
                      type="number"
                      value={state.ops.taxes}
                      onChange={(e) => handleInputChange('ops.taxes', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Insurance"
                      type="number"
                      value={state.ops.insurance}
                      onChange={(e) => handleInputChange('ops.insurance', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Gas & Electric"
                      type="number"
                      value={state.ops.gasElectric}
                      onChange={(e) => handleInputChange('ops.gasElectric', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Internet"
                      type="number"
                      value={state.ops.internet}
                      onChange={(e) => handleInputChange('ops.internet', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="HOA"
                      type="number"
                      value={state.ops.hoa}
                      onChange={(e) => handleInputChange('ops.hoa', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Maintenance"
                      type="number"
                      value={state.ops.maintenance}
                      onChange={(e) => handleInputChange('ops.maintenance', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Vacancy"
                      type="number"
                      value={state.ops.vacancy}
                      onChange={(e) => handleInputChange('ops.vacancy', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Management"
                      type="number"
                      value={state.ops.management}
                      onChange={(e) => handleInputChange('ops.management', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CapEx"
                      type="number"
                      value={state.ops.capEx}
                      onChange={(e) => handleInputChange('ops.capEx', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Financing Accordion */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Financing</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Down Payment"
                      type="number"
                      value={state.loan.downPayment}
                      onChange={(e) => handleInputChange('loan.downPayment', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Loan Amount"
                      type="number"
                      value={state.loan.loanAmount}
                      onChange={(e) => handleInputChange('loan.loanAmount', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Interest Rate"
                      type="number"
                      value={state.loan.interestRate}
                      onChange={(e) => handleInputChange('loan.interestRate', parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amortization Years"
                      type="number"
                      value={state.loan.amortizationYears}
                      onChange={(e) => handleInputChange('loan.amortizationYears', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Closing Costs"
                      type="number"
                      value={state.loan.closingCosts}
                      onChange={(e) => handleInputChange('loan.closingCosts', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Rehab Costs"
                      type="number"
                      value={state.loan.rehabCosts}
                      onChange={(e) => handleInputChange('loan.rehabCosts', parseCurrency(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Subject-To Existing Mortgage Accordion */}
            {state.offerType === 'Subject To Existing Mortgage' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Subject-To Existing Mortgage</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Existing Balance"
                        type="number"
                        value={state.subjectTo?.existingBalance || 0}
                        onChange={(e) => handleInputChange('subjectTo.existingBalance', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Existing Rate"
                        type="number"
                        value={state.subjectTo?.existingRate || 0}
                        onChange={(e) => handleInputChange('subjectTo.existingRate', parseFloat(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Existing Payment"
                        type="number"
                        value={state.subjectTo?.existingPayment || 0}
                        onChange={(e) => handleInputChange('subjectTo.existingPayment', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Existing Term"
                        type="number"
                        value={state.subjectTo?.existingTerm || 0}
                        onChange={(e) => handleInputChange('subjectTo.existingTerm', parseInt(e.target.value))}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Hybrid Financing Accordion */}
            {state.offerType === 'Hybrid' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Hybrid Financing</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Cash Portion"
                        type="number"
                        value={state.hybrid?.cashPortion || 0}
                        onChange={(e) => handleInputChange('hybrid.cashPortion', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Loan Portion"
                        type="number"
                        value={state.hybrid?.loanPortion || 0}
                        onChange={(e) => handleInputChange('hybrid.loanPortion', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Seller Finance Portion"
                        type="number"
                        value={state.hybrid?.sellerFinancePortion || 0}
                        onChange={(e) => handleInputChange('hybrid.sellerFinancePortion', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Seller Finance Rate"
                        type="number"
                        value={state.hybrid?.sellerFinanceRate || 0}
                        onChange={(e) => handleInputChange('hybrid.sellerFinanceRate', parseFloat(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Seller Finance Term"
                        type="number"
                        value={state.hybrid?.sellerFinanceTerm || 0}
                        onChange={(e) => handleInputChange('hybrid.sellerFinanceTerm', parseInt(e.target.value))}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Fix & Flip Accordion */}
            {state.operationType === 'Fix & Flip' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Fix & Flip</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Purchase Price"
                        type="number"
                        value={state.fixFlip?.purchasePrice || 0}
                        onChange={(e) => handleInputChange('fixFlip.purchasePrice', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Rehab Costs"
                        type="number"
                        value={state.fixFlip?.rehabCosts || 0}
                        onChange={(e) => handleInputChange('fixFlip.rehabCosts', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Holding Costs"
                        type="number"
                        value={state.fixFlip?.holdingCosts || 0}
                        onChange={(e) => handleInputChange('fixFlip.holdingCosts', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Selling Costs"
                        type="number"
                        value={state.fixFlip?.sellingCosts || 0}
                        onChange={(e) => handleInputChange('fixFlip.sellingCosts', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Target Profit"
                        type="number"
                        value={state.fixFlip?.targetProfit || 0}
                        onChange={(e) => handleInputChange('fixFlip.targetProfit', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Timeline (Months)"
                        type="number"
                        value={state.fixFlip?.timelineMonths || 0}
                        onChange={(e) => handleInputChange('fixFlip.timelineMonths', parseInt(e.target.value))}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* BRRRR Accordion */}
            {state.operationType === 'BRRRR' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>BRRRR</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Purchase Price"
                        type="number"
                        value={state.brrrr?.purchasePrice || 0}
                        onChange={(e) => handleInputChange('brrrr.purchasePrice', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Rehab Costs"
                        type="number"
                        value={state.brrrr?.rehabCosts || 0}
                        onChange={(e) => handleInputChange('brrrr.rehabCosts', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Refinance LTV"
                        type="number"
                        value={state.brrrr?.refinanceLtv || 0}
                        onChange={(e) => handleInputChange('brrrr.refinanceLtv', parseFloat(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Refinance Rate"
                        type="number"
                        value={state.brrrr?.refinanceRate || 0}
                        onChange={(e) => handleInputChange('brrrr.refinanceRate', parseFloat(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Refinance Term"
                        type="number"
                        value={state.brrrr?.refinanceTerm || 0}
                        onChange={(e) => handleInputChange('brrrr.refinanceTerm', parseInt(e.target.value))}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Refinance Closing Costs"
                        type="number"
                        value={state.brrrr?.refinanceClosingCosts || 0}
                        onChange={(e) => handleInputChange('brrrr.refinanceClosingCosts', parseCurrency(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Amortization Schedule Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>
                  Amortization Schedule ({state.loan.amortizationYears} years)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Principal</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Interest</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {amortizationSchedule.slice(0, 12).map((entry) => (
                      <TableRow key={entry.month}>
                        <TableCell>{entry.month}</TableCell>
                        <TableCell>{formatCurrency(entry.payment)}</TableCell>
                        <TableCell>{formatCurrency(entry.principal)}</TableCell>
                        <TableCell>{formatCurrency(entry.interest)}</TableCell>
                        <TableCell>{formatCurrency(entry.balance)}</TableCell>
                      </TableRow>
                    ))}
                    {amortizationSchedule.length > 12 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                          ... and {amortizationSchedule.length - 12} more payments
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>

            {/* Appreciation Calculator Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Appreciation Calculator</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Annual Appreciation Rate"
                      type="number"
                      value={state.appreciation.annualAppreciationRate}
                      onChange={(e) => handleInputChange('appreciation.annualAppreciationRate', parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Holding Period Years"
                      type="number"
                      value={state.appreciation.holdingPeriodYears}
                      onChange={(e) => handleInputChange('appreciation.holdingPeriodYears', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* KPI Results Grid */}
            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                  Monthly Cash Flow
                </Typography>
                <Typography variant="h4" sx={{ color: calculations.monthlyCashFlow >= 0 ? brandColors.success : brandColors.error, fontWeight: 700 }}>
                  {formatCurrency(calculations.monthlyCashFlow)}
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                  Cash on Cash Return
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                  {formatPercent(calculations.cashOnCashReturn)}
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                  Cap Rate
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                  {formatPercent(calculations.capRate)}
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                  ROI
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                  {formatPercent(calculations.roi)}
                </Typography>
              </Paper>
            </Box>

            {/* Advanced Metrics Grid */}
            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                  IRR
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.secondary, fontWeight: 700 }}>
                  {formatPercent(calculations.irr)}
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                  MOIC
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.secondary, fontWeight: 700 }}>
                  {calculations.moic.toFixed(2)}x
                </Typography>
              </Paper>
            </Box>

            {/* Summary Table */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Deal Summary
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Purchase Price</TableCell>
                    <TableCell>{formatCurrency(state.purchasePrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Down Payment</TableCell>
                    <TableCell>{formatCurrency(state.loan.downPayment)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loan Amount</TableCell>
                    <TableCell>{formatCurrency(state.loan.loanAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Payment</TableCell>
                    <TableCell>{formatCurrency(state.ops.principalAndInterest)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Income</TableCell>
                    <TableCell>{formatCurrency(calculations.monthlyIncome)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Expenses</TableCell>
                    <TableCell>{formatCurrency(calculations.monthlyExpenses)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Cash Flow</TableCell>
                    <TableCell>{formatCurrency(calculations.annualCashFlow)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cash Invested</TableCell>
                    <TableCell>{formatCurrency(calculations.cashInvested)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Appreciation</TableCell>
                    <TableCell>{formatCurrency(calculations.annualAppreciation)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EnhancedStandardCalculator;
