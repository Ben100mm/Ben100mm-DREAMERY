import React from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { OverviewTab } from '../components/OverviewTab';
import { GlobalConfigTab } from '../components/GlobalConfigTab';
import { ExitStrategiesTab } from '../components/ExitStrategiesTab';
import { RiskAnalysisTab } from '../components/RiskAnalysisTab';
import { ScenarioComparisonTab } from '../components/ScenarioComparisonTab';
import {
  SeasonalAdjustmentsCalculator,
  MarketConditionsCalculator,
  ExitStrategiesCalculator,
  RiskAnalysisCalculator,
  TaxImplicationsCalculator,
  RefinanceScenariosCalculator,
  SensitivityAnalysisCalculator,
  StressTestingCalculator,
  InflationAdjustmentsCalculator,
} from '../components';

// Color constants
export const DEFAULT_COLOR = '#1a365d';
export const SECONDARY_COLOR = '#2e7d32';
export const WARNING_COLOR = '#d32f2f';
export const INFO_COLOR = '#1976d2';
export const SUCCESS_COLOR = '#2e7d32';

// Spacing constants
export const DEFAULT_SPACING = 2;
export const CARD_SPACING = 3;
export const SECTION_SPACING = 4;

// Background colors
export const CARD_BACKGROUND = '#f8f9fa';
export const ALERT_BACKGROUND = '#f0f8ff';
export const INFO_BACKGROUND = '#e3f2fd';

// Tab configuration
export const createTabConfig = (
  dealState: any,
  updateDealState: any,
  handleResultsChange: any,
  isCalculating: boolean,
  setIsCalculating: any,
  scenarios: any[],
  setScenarios: any,
  allResults: any,
  setAllResults: any,
  setTabValue: any,
  setSnackbar: (snackbar: { open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => void
) => [
  {
    label: 'Overview',
    icon: <CalculateIcon aria-label="Calculate" />,
    className: 'overview-tab',
    component: (
      <OverviewTab dealState={dealState} allResults={allResults} />
    ),
  },
  {
    label: 'Global Configuration',
    icon: <SettingsIcon aria-label="Settings" />,
    className: 'global-config-tab',
    component: (
      <GlobalConfigTab 
        dealState={dealState} 
        updateDealState={updateDealState} 
        handleResultsChange={handleResultsChange}
        scenarios={scenarios}
        setScenarios={setScenarios}
        allResults={allResults}
        setSnackbar={setSnackbar}
      />
    ),
  },
  {
    label: 'Seasonal & Market',
    icon: <TimelineIcon />,
    component: (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <SeasonalAdjustmentsCalculator
            baseVacancyRate={dealState?.proForma?.vacancy || 0.05}
            baseMaintenanceCost={dealState?.proForma?.maintenance || 500}
            onResultsChange={(results: any) => handleResultsChange('seasonal', results)}
          />
        </Box>
        <Box>
          <MarketConditionsCalculator
            baseMetrics={{
              vacancyRate: dealState?.proForma?.vacancy || 0.05,
              rentGrowth: dealState?.marketConditions?.rentGrowthRate || 0.03,
              appreciation: dealState?.marketConditions?.appreciationRate || 0.04,
              capRate: 0.06,
            }}
            onResultsChange={(results: any) => handleResultsChange('market', results)}
          />
        </Box>
      </Box>
    ),
  },
  {
    label: 'Exit Strategies',
    icon: <TrendingUpIcon aria-label="Trending Up" />,
    className: 'exit-strategies-tab',
    component: (
      <ExitStrategiesTab 
        dealState={dealState} 
        updateDealState={updateDealState} 
        handleResultsChange={handleResultsChange}
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
      />
    ),
  },
  {
    label: 'Tax & Refinance',
    icon: <AccountBalanceIcon aria-label="Account Balance" />,
    className: 'tax-implications-tab',
    component: (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <TaxImplicationsCalculator
            onResultsChange={(results: any) => handleResultsChange('tax', results)}
          />
        </Box>
        <Box>
          <RefinanceScenariosCalculator
            onResultsChange={(results: any) => handleResultsChange('refinance', results)}
          />
        </Box>
      </Box>
    ),
  },
  {
    label: 'Risk Analysis',
    icon: <SecurityIcon aria-label="Security" />,
    className: 'risk-analysis-tab',
    component: (
      <RiskAnalysisTab 
        dealState={dealState} 
        updateDealState={updateDealState} 
        handleResultsChange={handleResultsChange}
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
      />
    ),
  },
  {
    label: 'Sensitivity & Inflation',
    icon: <ShowChartIcon aria-label="Show Chart" />,
    className: 'sensitivity-analysis-tab',
    component: (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <SensitivityAnalysisCalculator
            onResultsChange={(results: any) => handleResultsChange('sensitivity', results)}
          />
        </Box>
        <Box>
          <InflationAdjustmentsCalculator
            onResultsChange={(results: any) => handleResultsChange('inflation', results)}
          />
        </Box>
      </Box>
    ),
  },
  {
    label: 'Scenario Comparison',
    icon: <SwapHorizIcon aria-label="Swap Horizontally" />,
    className: 'scenario-comparison-tab',
    component: (
      <ScenarioComparisonTab
        dealState={dealState}
        scenarios={scenarios}
        setScenarios={setScenarios}
        setAllResults={setAllResults}
        setTabValue={setTabValue}
      />
    ),
  },
];

// Default values
export const DEFAULT_TAB_INDEX = 0;
export const DEFAULT_TAB_VALUE = 0;

// Tab labels for easy reference
export const TAB_LABELS = {
  OVERVIEW: 'Overview',
  GLOBAL_CONFIG: 'Global Configuration',
  SEASONAL_MARKET: 'Seasonal & Market',
  EXIT_STRATEGIES: 'Exit Strategies',
  TAX_REFINANCE: 'Tax & Refinance',
  RISK_ANALYSIS: 'Risk Analysis',
  SENSITIVITY_INFLATION: 'Sensitivity & Inflation',
  SCENARIO_COMPARISON: 'Scenario Comparison',
} as const;

// Tab class names for styling
export const TAB_CLASSES = {
  OVERVIEW: 'overview-tab',
  GLOBAL_CONFIG: 'global-config-tab',
  EXIT_STRATEGIES: 'exit-strategies-tab',
  TAX_IMPLICATIONS: 'tax-implications-tab',
  RISK_ANALYSIS: 'risk-analysis-tab',
  SENSITIVITY_ANALYSIS: 'sensitivity-analysis-tab',
  SCENARIO_COMPARISON: 'scenario-comparison-tab',
} as const;

// Export types for better type safety
export type TabLabel = typeof TAB_LABELS[keyof typeof TAB_LABELS];
export type TabClass = typeof TAB_CLASSES[keyof typeof TAB_CLASSES];
