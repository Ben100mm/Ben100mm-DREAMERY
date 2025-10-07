/**
 * Cash Flow Projections Tab for UnderwritePage
 * 
 * Integrates year-by-year cash flow projections into the underwriting workflow
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ExpandMore,
  Download,
  Refresh,
  TrendingUp,
  Settings
} from '@mui/icons-material';
import {
  generateCashFlowProjections,
  CashFlowProjectionParams,
  CapitalEvent,
  GrowthRates
} from '../utils/cashFlowProjections';
import CashFlowProjectionChart from './CashFlowProjectionChart';
import CapitalEventsConfiguration from './CapitalEventsConfiguration';
import { downloadExcelFile } from '../utils/excelExport';

// ============================================================================
// Types
// ============================================================================

interface CashFlowProjectionsTabProps {
  dealState: any; // Accept any dealState structure to support different DealState types
}

// ============================================================================
// Helper Functions
// ============================================================================

function extractProjectionParams(dealState: any, settings: ProjectionSettings): CashFlowProjectionParams {
  // Extract initial monthly rent (handle different property types)
  const monthlyRent = dealState.revenueInputs?.averageDailyRate 
    ? dealState.revenueInputs.averageDailyRate * 30 * (dealState.revenueInputs.occupancyRate / 100)
    : (dealState.sfr?.totalMonthlyRent || dealState.multi?.totalMonthlyRent || dealState.str?.totalMonthlyRevenue || 0);

  // Calculate annual expenses
  const annualTaxes = (dealState.ops?.taxes || 0) * 12;
  const annualInsurance = (dealState.ops?.insurance || 0) * 12;
  const annualMaintenance = (dealState.ops?.maintenance || 0) / 100 * monthlyRent * 12; // Maintenance is percentage
  const annualManagement = (dealState.ops?.management || 0) / 100 * monthlyRent * 12; // Management is percentage
  const annualCapEx = (dealState.ops?.capEx || 0) / 100 * monthlyRent * 12; // CapEx is percentage

  // Calculate initial investment (down payment + closing costs estimate)
  const downPayment = (dealState.purchasePrice || 0) - (dealState.loan?.loanAmount || 0);
  const closingCosts = (dealState.purchasePrice || 0) * 0.03; // Estimate 3% closing costs
  const initialInvestment = downPayment + closingCosts;

  return {
    purchasePrice: dealState.purchasePrice || 0,
    currentPropertyValue: dealState.purchasePrice || 0,
    initialMonthlyRent: monthlyRent,
    vacancyRate: (dealState.ops?.vacancy || 0) / 100,
    annualTaxes,
    annualInsurance,
    annualMaintenance,
    annualManagement,
    annualCapEx,
    loanAmount: dealState.loan?.loanAmount || 0,
    annualInterestRate: dealState.loan?.annualInterestRate || 0,
    loanTermMonths: (dealState.loan?.amortizationYears || 30) * 12,
    interestOnly: dealState.loan?.interestOnly || false,
    growthRates: settings.growthRates,
    capitalEvents: settings.capitalEvents,
    projectionYears: settings.projectionYears,
    initialInvestment
  };
}

interface ProjectionSettings {
  projectionYears: number;
  growthRates: GrowthRates;
  capitalEvents: CapitalEvent[];
}

// ============================================================================
// Component
// ============================================================================

export const CashFlowProjectionsTab: React.FC<CashFlowProjectionsTabProps> = ({
  dealState
}) => {
  const [settings, setSettings] = useState<ProjectionSettings>({
    projectionYears: 10,
    growthRates: {
      rentGrowthRate: dealState.marketConditions?.rentGrowthRate || 0.03,
      expenseGrowthRate: dealState.marketConditions?.inflationRate || 0.025,
      propertyAppreciationRate: dealState.marketConditions?.appreciationRate || 0.04
    },
    capitalEvents: []
  });

  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  // Generate projections
  const projectionResults = useMemo(() => {
    try {
      const params = extractProjectionParams(dealState, settings);
      return generateCashFlowProjections(params);
    } catch (error) {
      console.error('Error generating projections:', error);
      return null;
    }
  }, [dealState, settings]);

  // Handle export to Excel
  const handleExportToExcel = () => {
    if (projectionResults) {
      const location = dealState.city || dealState.propertyAddress || 'Property';
      downloadExcelFile(
        projectionResults,
        `CashFlow_${location.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
      );
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    // Force recalculation by updating a dependency
    setSettings({ ...settings });
  };

  if (!projectionResults) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Unable to generate cash flow projections. Please check your deal inputs.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Year-by-Year Cash Flow Projections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed annual projections with rent growth, expense inflation, and capital events
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportToExcel}
            size="small"
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      {/* Projection Settings */}
      <Accordion
        expanded={advancedSettingsOpen}
        onChange={(e, expanded) => setAdvancedSettingsOpen(expanded)}
        sx={{ mb: 3 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings />
            <Typography>Projection Settings</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Projection Period
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Years</InputLabel>
                <Select
                  value={settings.projectionYears}
                  onChange={(e) => setSettings({
                    ...settings,
                    projectionYears: Number(e.target.value)
                  })}
                  label="Years"
                >
                  {[5, 10, 15, 20, 25, 30].map(years => (
                    <MenuItem key={years} value={years}>{years} Years</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Growth Rates
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Rent Growth Rate"
                type="number"
                value={settings.growthRates.rentGrowthRate * 100}
                onChange={(e) => setSettings({
                  ...settings,
                  growthRates: {
                    ...settings.growthRates,
                    rentGrowthRate: Number(e.target.value) / 100
                  }
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: -10, max: 20 }
                }}
                size="small"
                fullWidth
                helperText="Annual rent increase"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Expense Growth Rate"
                type="number"
                value={settings.growthRates.expenseGrowthRate * 100}
                onChange={(e) => setSettings({
                  ...settings,
                  growthRates: {
                    ...settings.growthRates,
                    expenseGrowthRate: Number(e.target.value) / 100
                  }
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0, max: 20 }
                }}
                size="small"
                fullWidth
                helperText="Annual expense inflation"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Property Appreciation"
                type="number"
                value={settings.growthRates.propertyAppreciationRate * 100}
                onChange={(e) => setSettings({
                  ...settings,
                  growthRates: {
                    ...settings.growthRates,
                    propertyAppreciationRate: Number(e.target.value) / 100
                  }
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: -10, max: 20 }
                }}
                size="small"
                fullWidth
                helperText="Annual property value growth"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Capital Events Configuration */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <CapitalEventsConfiguration
          events={settings.capitalEvents}
          onChange={(events) => setSettings({ ...settings, capitalEvents: events })}
          projectionYears={settings.projectionYears}
        />
      </Paper>

      {/* Chart Visualization */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <CashFlowProjectionChart
          results={projectionResults}
          showCapitalEvents={true}
        />
      </Paper>

      {/* Key Insights */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6">Key Insights</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Alert severity="info">
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Total Return Breakdown
              </Typography>
              <Typography variant="body2">
                • Cash Flow: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(projectionResults.summary.totalCashFlow)}
              </Typography>
              <Typography variant="body2">
                • Principal Paydown: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(projectionResults.summary.totalPrincipalPaydown)}
              </Typography>
              <Typography variant="body2">
                • Appreciation: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(projectionResults.summary.totalAppreciation)}
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12} md={6}>
            <Alert severity="success">
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Final Position (Year {settings.projectionYears})
              </Typography>
              <Typography variant="body2">
                • Final Equity: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(projectionResults.summary.finalEquity)}
              </Typography>
              <Typography variant="body2">
                • Annualized Return: {projectionResults.summary.annualizedReturn.toFixed(2)}%
              </Typography>
              <Typography variant="body2">
                • Total Capital Events: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(projectionResults.summary.totalCapitalEvents)}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CashFlowProjectionsTab;

