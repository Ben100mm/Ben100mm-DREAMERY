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

// Theme configuration
export const brandColors = {
  primary: '#1976d2',
  primaryLight: '#42a5f5',
  primaryDark: '#1565c0',
  secondary: '#dc004e',
  secondaryLight: '#ff5983',
  secondaryDark: '#9a0036',
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Background colors
  backgrounds: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    hover: '#f5f5f5',
    selected: '#e3f2fd',
    disabled: '#f5f5f5',
  },
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#bdbdbd',
    inverse: '#ffffff',
  },
  
  // Border colors
  borders: {
    primary: '#e0e0e0',
    secondary: '#f0f0f0',
    focus: '#1976d2',
  },
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

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

// Utility functions
function parseCurrency(input: string): number {
  const numeric = Number(String(input).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );
}

function formatPercent(value: number): string {
  return `${Number.isFinite(value) ? value.toFixed(2) : 0}%`;
}

// Finance calculations
function pmt(rate: number, nper: number, pv: number, fv: number = 0, type: number = 0): number {
  if (rate === 0) return -(pv + fv) / nper;
  const pvif = Math.pow(1 + rate, nper);
  const pmt = rate / (pvif - 1) * -(pv * pvif + fv);
  return type === 1 ? pmt / (1 + rate) : pmt;
}

function calculateMonthlyPayment(principal: number, rate: number, term: number): number {
  if (rate === 0) return principal / term;
  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;
  return pmt(monthlyRate, numPayments, principal);
}

function calculateCashFlow(monthlyIncome: number, monthlyExpenses: number): number {
  return monthlyIncome - monthlyExpenses;
}

function calculateCashOnCashReturn(cashInvested: number, annualCashFlow: number): number {
  if (cashInvested <= 0) return 0;
  return (annualCashFlow / cashInvested) * 100;
}

function calculateCapRate(annualNOI: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (annualNOI / purchasePrice) * 100;
}

function calculateROI(cashInvested: number, annualCashFlow: number, annualAppreciation: number): number {
  if (cashInvested <= 0) return 0;
  return ((annualCashFlow + annualAppreciation) / cashInvested) * 100;
}

// Mode Selector Component
interface ModeSelectorProps {
  value: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
  showDescription?: boolean;
  variant?: 'default' | 'compact';
}

const MODE_ICONS = {
  essential: <SpeedIcon fontSize="small" />,
  standard: <AssignmentIcon fontSize="small" />,
  professional: <EngineeringIcon fontSize="small" />,
};

const CALCULATOR_MODES = {
  essential: {
    id: 'essential' as CalculatorMode,
    label: 'Essential',
    description: 'Quick analysis with simplified inputs for fast deal evaluation',
    features: [
      'Basic property inputs (price, down payment, rate, term)',
      'Simple financing options (Cash, Conventional, FHA)',
      'Preset operating expenses',
      'Buy & Hold strategy only',
      'Key metrics (cash flow, CoC, ROI, Cap Rate)',
    ],
  },
  standard: {
    id: 'standard' as CalculatorMode,
    label: 'Standard',
    description: 'Comprehensive analysis with detailed inputs and all property strategies',
    features: [
      'All Essential features',
      'All financing types (Subject-To, Seller Finance, Hybrid, Hard Money, Private, Line of Credit)',
      'Detailed expense breakdown with custom categories',
      'All property strategies (Buy & Hold, Fix & Flip, BRRRR, Rental Arbitrage, Short Term Rental)',
      'All property types (SFR, Multi-family, Commercial, Land, Hotel)',
      'Industry benchmarks and regional adjustments',
      'Advanced risk assessment',
      'Full amortization schedule with detailed breakdown',
      'Multiple exit strategy analysis',
      'Appreciation calculations',
      'IRR and MOIC calculations',
      'Tax implications (basic)',
      'Refinance scenarios',
      'Sensitivity analysis',
      'Stress testing',
      'Pro forma analysis'
    ],
  },
  professional: {
    id: 'professional' as CalculatorMode,
    label: 'Professional',
    description: 'Complete professional toolkit with advanced modeling and scenario analysis',
    features: [
      'All Standard features',
      'Capital events planning and management',
      'Tax-Deferred Exchanges (1031 & 721)',
      'Advanced modeling (seasonal adjustments, market conditions, property age factors)',
      'Monte Carlo simulations with 10,000+ iterations',
      'Scenario comparison and optimization',
      'Cloud sync & save with unlimited deals',
      'Confidence intervals and uncertainty analysis',
      'ML-powered risk predictions',
      'Comprehensive tax implications (all deductions, brackets)',
      'Multiple refinance scenarios with break-even analysis',
      'Exit strategy optimization',
      'Inflation adjustments and projections',
      'Market volatility analysis',
      'Property age and location factor adjustments',
      'Seasonal rent and expense variations',
      'Advanced cash flow projections (10+ years)',
      'Comprehensive pro forma analysis',
      'Risk scoring and recommendations',
      'Data export and reporting',
      'API integrations and automation'
    ],
  }
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  value,
  onChange,
  showDescription = true,
  variant = 'default',
}) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: CalculatorMode | null
  ) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  const currentConfig = CALCULATOR_MODES[value];

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ color: brandColors.neutral[600], fontWeight: 500 }}
        >
          Mode:
        </Typography>
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={handleChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.813rem',
              textTransform: 'none',
              borderColor: brandColors.neutral[300],
              '&.Mui-selected': {
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                '&:hover': {
                  backgroundColor: brandColors.primaryLight,
                },
              },
            },
          }}
        >
          {(Object.keys(CALCULATOR_MODES) as CalculatorMode[]).map((mode) => {
            const config = CALCULATOR_MODES[mode];
            return (
              <ToggleButton key={mode} value={mode}>
                {config.label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: brandColors.neutral[700], 
          fontWeight: 600,
          mb: 1.5 
        }}
      >
        Calculator Mode
      </Typography>

      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        sx={{
          width: '100%',
          '& .MuiToggleButtonGroup-grouped': {
            border: `1px solid ${brandColors.neutral[300]}`,
            borderRadius: '8px',
            margin: '0 4px',
            px: 3,
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 500,
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: brandColors.primary,
              color: 'white',
              '&:hover': {
                backgroundColor: brandColors.primary,
              },
            },
            '&:hover': {
              backgroundColor: brandColors.neutral[50],
            },
            '&:not(:last-of-type)': {
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
            },
            '&:not(:first-of-type)': {
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
            },
          },
        }}
      >
        {(Object.keys(CALCULATOR_MODES) as CalculatorMode[]).map((mode) => {
          const config = CALCULATOR_MODES[mode];
          return (
            <Tooltip
              key={mode}
              title={
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    {config.description}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Features:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {config.features.map((feature, idx) => (
                      <Typography 
                        key={idx} 
                        component="li" 
                        variant="caption"
                        sx={{ mb: 0.25 }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              }
              placement="bottom"
              arrow
            >
              <ToggleButton value={mode} sx={{ flex: 1 }}>
                {config.label}
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

// Main Standard Calculator Component
export const StandardCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
    
    const monthlyExpenses = monthlyFixedOps + monthlyVariableOps;
    const monthlyCashFlow = monthlyIncome - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    
    const cashInvested = state.loan.downPayment + state.loan.closingCosts + state.loan.rehabCosts;
    const annualAppreciation = state.purchasePrice * (state.appreciation.annualAppreciationRate / 100);
    
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

export default StandardCalculator;
