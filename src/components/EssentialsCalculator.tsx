/**
 * Essentials Calculator Component
 * 
 * Simplified calculator for quick deal evaluation with basic inputs
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  Percent as PercentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { ModeSelector } from './calculator/ModeSelector';
import { UpgradePrompt } from './calculator/UpgradePrompt';
import { useCalculatorMode } from '../hooks/useCalculatorMode';

// Types
interface CalculatorInputs {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyType: 'SFR' | 'Multi Family';
  operationType: 'Buy & Hold';
  financingType: 'Cash' | 'Conventional' | 'FHA';
  monthlyRent: number;
  annualRent: number;
  rentInputType: 'monthly' | 'annual';
  operatingExpenses: {
    propertyTax: number;
    insurance: number;
    maintenance: number;
    management: number;
    utilities: number;
    vacancy: number;
  };
}

interface CalculatorResults {
  monthlyPayment: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  roi: number;
  breakEvenRent: number;
  grossRentMultiplier: number;
  debtServiceCoverageRatio: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

// Default values
const DEFAULT_INPUTS: CalculatorInputs = {
  propertyPrice: 250000,
  downPayment: 50000,
  interestRate: 6.5,
  loanTerm: 30,
  propertyType: 'SFR',
  operationType: 'Buy & Hold',
  financingType: 'Conventional',
  monthlyRent: 2000,
  annualRent: 24000,
  rentInputType: 'monthly',
  operatingExpenses: {
    propertyTax: 2500,
    insurance: 1200,
    maintenance: 1500,
    management: 2400,
    utilities: 0,
    vacancy: 1200,
  },
};

// Preset operating expenses based on property type
const PRESET_EXPENSES = {
  'SFR': {
    propertyTax: 2500,
    insurance: 1200,
    maintenance: 1500,
    management: 2400,
    utilities: 0,
    vacancy: 1200,
  },
  'Multi Family': {
    propertyTax: 3500,
    insurance: 1800,
    maintenance: 2500,
    management: 3600,
    utilities: 1200,
    vacancy: 1800,
  },
};

export const EssentialsCalculator: React.FC = () => {
  const { mode: calculatorMode, setMode: setCalculatorMode, isEssential } = useCalculatorMode();
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  // Calculate loan amount
  const loanAmount = useMemo(() => {
    if (inputs.financingType === 'Cash') return 0;
    return inputs.propertyPrice - inputs.downPayment;
  }, [inputs.propertyPrice, inputs.downPayment, inputs.financingType]);

  // Calculate monthly payment
  const monthlyPayment = useMemo(() => {
    if (inputs.financingType === 'Cash') return 0;
    if (loanAmount === 0) return 0;
    
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;
    
    if (monthlyRate === 0) {
      return loanAmount / numPayments;
    }
    
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [loanAmount, inputs.interestRate, inputs.loanTerm, inputs.financingType]);

  // Calculate operating expenses
  const totalOperatingExpenses = useMemo(() => {
    return Object.values(inputs.operatingExpenses).reduce((sum, expense) => sum + expense, 0);
  }, [inputs.operatingExpenses]);

  // Calculate monthly operating expenses
  const monthlyOperatingExpenses = totalOperatingExpenses / 12;

  // Calculate gross monthly rent
  const grossMonthlyRent = inputs.rentInputType === 'monthly' 
    ? inputs.monthlyRent 
    : inputs.annualRent / 12;

  // Calculate net operating income
  const monthlyNOI = grossMonthlyRent - monthlyOperatingExpenses;
  const annualNOI = monthlyNOI * 12;

  // Calculate cash flow
  const monthlyCashFlow = monthlyNOI - monthlyPayment;
  const annualCashFlow = monthlyCashFlow * 12;

  // Calculate key metrics
  const cashOnCashReturn = inputs.downPayment > 0 ? (annualCashFlow / inputs.downPayment) * 100 : 0;
  const capRate = (annualNOI / inputs.propertyPrice) * 100;
  const roi = inputs.downPayment > 0 ? ((annualCashFlow + (inputs.propertyPrice * 0.03)) / inputs.downPayment) * 100 : 0;
  const breakEvenRent = monthlyPayment + monthlyOperatingExpenses;
  const grossRentMultiplier = inputs.propertyPrice / (grossMonthlyRent * 12);
  const debtServiceCoverageRatio = monthlyPayment > 0 ? monthlyNOI / monthlyPayment : 0;

  // Generate amortization schedule (first 12 months for summary)
  const amortizationSchedule = useMemo(() => {
    if (inputs.financingType === 'Cash' || loanAmount === 0) return [];
    
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = inputs.interestRate / 100 / 12;
    
    for (let month = 1; month <= 12; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        balance: Math.max(0, balance),
      });
    }
    
    return schedule;
  }, [loanAmount, monthlyPayment, inputs.interestRate]);

  // Handle input changes
  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (field: keyof CalculatorInputs['operatingExpenses'], value: number) => {
    setInputs(prev => ({
      ...prev,
      operatingExpenses: {
        ...prev.operatingExpenses,
        [field]: value,
      },
    }));
  };

  // Handle property type change - update preset expenses
  const handlePropertyTypeChange = (newType: 'SFR' | 'Multi Family') => {
    setInputs(prev => ({
      ...prev,
      propertyType: newType,
      operatingExpenses: PRESET_EXPENSES[newType],
    }));
  };

  // Handle rent input type change
  const handleRentInputTypeChange = (type: 'monthly' | 'annual') => {
    setInputs(prev => ({
      ...prev,
      rentInputType: type,
      monthlyRent: type === 'monthly' ? prev.monthlyRent : prev.annualRent / 12,
      annualRent: type === 'annual' ? prev.annualRent : prev.monthlyRent * 12,
    }));
  };

  const results: CalculatorResults = {
    monthlyPayment,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    capRate,
    roi,
    breakEvenRent,
    grossRentMultiplier,
    debtServiceCoverageRatio,
    amortizationSchedule,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 600, mb: 1 }}>
          Real Estate Investment Calculator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quick analysis for fast deal evaluation
        </Typography>
      </Box>

      {/* Mode Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <ModeSelector 
            value={calculatorMode}
            onChange={setCalculatorMode}
            showDescription={true}
          />
        </CardContent>
      </Card>

      {/* Upgrade Prompts for Advanced Features */}
      {isEssential && inputs.propertyType === 'Multi Family' && (
        <UpgradePrompt
          currentMode={calculatorMode}
          targetMode="standard"
          feature="Additional Property Types"
          description="Multi Family properties with advanced analysis are available in Standard mode"
          onUpgrade={() => setCalculatorMode('standard')}
        />
      )}

      {/* Main Calculator Form */}
      <Grid container spacing={3}>
        {/* Left Column - Inputs */}
        <Grid item xs={12} md={6}>
          {/* Basic Property Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HomeIcon />
                Basic Property Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Price"
                    value={inputs.propertyPrice}
                    onChange={(e) => handleInputChange('propertyPrice', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={inputs.propertyType}
                      onChange={(e) => handlePropertyTypeChange(e.target.value as 'SFR' | 'Multi Family')}
                      label="Property Type"
                    >
                      <MenuItem value="SFR">Single Family Residential</MenuItem>
                      <MenuItem value="Multi Family">Multi Family</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Operation Type</InputLabel>
                    <Select
                      value={inputs.operationType}
                      disabled
                      label="Operation Type"
                    >
                      <MenuItem value="Buy & Hold">Buy & Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Financing Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon />
                Financing Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Financing Type</InputLabel>
                    <Select
                      value={inputs.financingType}
                      onChange={(e) => handleInputChange('financingType', e.target.value)}
                      label="Financing Type"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Conventional">Conventional Loan</MenuItem>
                      <MenuItem value="FHA">FHA Loan</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {inputs.financingType !== 'Cash' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Down Payment"
                        value={inputs.downPayment}
                        onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Interest Rate"
                        value={inputs.interestRate}
                        onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Loan Term"
                        value={inputs.loanTerm}
                        onChange={(e) => handleInputChange('loanTerm', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">years</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Rental Income */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon />
                Rental Income
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Rent Input Type</InputLabel>
                    <Select
                      value={inputs.rentInputType}
                      onChange={(e) => handleRentInputTypeChange(e.target.value as 'monthly' | 'annual')}
                      label="Rent Input Type"
                    >
                      <MenuItem value="monthly">Monthly Rent</MenuItem>
                      <MenuItem value="annual">Annual Rent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={inputs.rentInputType === 'monthly' ? 'Monthly Rent' : 'Annual Rent'}
                    value={inputs.rentInputType === 'monthly' ? inputs.monthlyRent : inputs.annualRent}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (inputs.rentInputType === 'monthly') {
                        handleInputChange('monthlyRent', value);
                        handleInputChange('annualRent', value * 12);
                      } else {
                        handleInputChange('annualRent', value);
                        handleInputChange('monthlyRent', value / 12);
                      }
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Operating Expenses */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PercentIcon />
                Operating Expenses (Annual)
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Using preset values for {inputs.propertyType}. Upgrade to Standard mode for custom expense categories.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Property Tax"
                    value={inputs.operatingExpenses.propertyTax}
                    onChange={(e) => handleNestedInputChange('propertyTax', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Insurance"
                    value={inputs.operatingExpenses.insurance}
                    onChange={(e) => handleNestedInputChange('insurance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maintenance"
                    value={inputs.operatingExpenses.maintenance}
                    onChange={(e) => handleNestedInputChange('maintenance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Property Management"
                    value={inputs.operatingExpenses.management}
                    onChange={(e) => handleNestedInputChange('management', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Utilities"
                    value={inputs.operatingExpenses.utilities}
                    onChange={(e) => handleNestedInputChange('utilities', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Vacancy Reserve"
                    value={inputs.operatingExpenses.vacancy}
                    onChange={(e) => handleNestedInputChange('vacancy', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Results */}
        <Grid item xs={12} md={6}>
          {/* Key Metrics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalculateIcon />
                Key Metrics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: brandColors.backgrounds.hover }}>
                    <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                      ${monthlyCashFlow.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Cash Flow
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: brandColors.backgrounds.hover }}>
                    <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                      {cashOnCashReturn.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cash on Cash Return
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: brandColors.backgrounds.hover }}>
                    <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                      {capRate.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cap Rate
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: brandColors.backgrounds.hover }}>
                    <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                      {roi.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ROI (with 3% appreciation)
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, display: 'flex', alignItems: Figma', gap: 1 }}>
                <TrendingUpIcon />
                Additional Metrics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: `1px solid ${brandColors.neutral[300]}`, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Break-Even Rent
                    </Typography>
                    <Typography variant="h6" sx={{ color: brandColors.neutral[800] }}>
                      ${breakEvenRent.toFixed(0)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: `1px solid ${brandColors.neutral[300]}`, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Gross Rent Multiplier
                    </Typography>
                    <Typography variant="h6" sx={{ color: brandColors.neutral[800] }}>
                      {grossRentMultiplier.toFixed(1)}x
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: `1px solid ${brandColors.neutral[300]}`, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      DSCR
                    </Typography>
                    <Typography variant="h6" sx={{ color: brandColors.neutral[800] }}>
                      {debtServiceCoverageRatio.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: `1px solid ${brandColors.neutral[300]}`, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Payment
                    </Typography>
                    <Typography variant="h6" sx={{ color: brandColors.neutral[800] }}>
                      ${monthlyPayment.toFixed(0)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Amortization Schedule */}
          {inputs.financingType !== 'Cash' && (
            <Card>
              <CardContent>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon />
                      Amortization Schedule (First 12 Months)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell align="right">Payment</TableCell>
                            <TableCell align="right">Principal</TableCell>
                            <TableCell align="right">Interest</TableCell>
                            <TableCell align="right">Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {amortizationSchedule.map((row) => (
                            <TableRow key={row.month}>
                              <TableCell>{row.month}</TableCell>
                              <TableCell align="right">${row.payment.toFixed(0)}</TableCell>
                              <TableCell align="right">${row.principal.toFixed(0)}</TableCell>
                              <TableCell align="right">${row.interest.toFixed(0)}</TableCell>
                              <TableCell align="right">${row.balance.toFixed(0)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EssentialsCalculator;
