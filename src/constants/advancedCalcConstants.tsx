import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { brandColors } from "../theme";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WarningIcon from "@mui/icons-material/Warning";
import { OverviewTab } from "../components/OverviewTab";
import { GlobalConfigTab } from "../components/GlobalConfigTab";
import { ExitStrategiesTab } from "../components/ExitStrategiesTab";
import { RiskAnalysisTab } from "../components/RiskAnalysisTab";
import { ScenarioComparisonTab } from "../components/ScenarioComparisonTab";
import { StressTestingTab } from "../components/StressTestingTab";
import { MonteCarloResults } from "../utils/monteCarloSimulation";
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
} from "../components";
import LazyComprehensiveRefinanceCalculator from "../components/lazy/ComprehensiveRefinanceCalculatorLazy";

export {
  SeasonalAdjustmentsCalculator,
  MarketConditionsCalculator,
  ExitStrategiesCalculator,
  RiskAnalysisCalculator,
  TaxImplicationsCalculator,
  RefinanceScenariosCalculator,
  SensitivityAnalysisCalculator,
  StressTestingCalculator,
  InflationAdjustmentsCalculator,
  LazyComprehensiveRefinanceCalculator,
};

// Color constants
export const DEFAULT_COLOR = brandColors.primary;
export const SECONDARY_COLOR = brandColors.accent.success;
export const WARNING_COLOR = "#d32f2f";
export const INFO_COLOR = brandColors.actions.primary;
export const SUCCESS_COLOR = brandColors.accent.success;

// Spacing constants
export const DEFAULT_SPACING = 2;
export const CARD_SPACING = 3;
export const SECTION_SPACING = 4;

// Background colors
export const CARD_BACKGROUND = brandColors.backgrounds.secondary;
export const ALERT_BACKGROUND = brandColors.backgrounds.hover;
export const INFO_BACKGROUND = brandColors.backgrounds.selected;

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
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }) => void,
  monteCarloResults: MonteCarloResults | null,
  monteCarloLoading: boolean,
  runRiskSimulation: () => void,
) => [
  {
    label: "Overview",
    icon: <CalculateIcon aria-label="Calculate" />,
    className: "overview-tab",
    component: <OverviewTab dealState={dealState} allResults={allResults} />,
  },
  {
    label: "Global Configuration",
    icon: <SettingsIcon aria-label="Settings" />,
    className: "global-config-tab",
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
    label: "Seasonal & Market",
    icon: <TimelineIcon />,
    component: (
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <Box>
          <SeasonalAdjustmentsCalculator
            baseVacancyRate={dealState?.proForma?.vacancy || 0.05}
            baseMaintenanceCost={dealState?.proForma?.maintenance || 500}
            onResultsChange={(results: any) =>
              handleResultsChange("seasonal", results)
            }
          />
        </Box>
        <Box>
          <MarketConditionsCalculator
            baseMetrics={{
              vacancyRate: dealState?.proForma?.vacancy || 0.05,
              rentGrowth: dealState?.marketConditions?.rentGrowthRate || 0.03,
              appreciation:
                dealState?.marketConditions?.appreciationRate || 0.04,
              capRate: 0.06,
            }}
            onResultsChange={(results: any) =>
              handleResultsChange("market", results)
            }
          />
        </Box>
      </Box>
    ),
  },
  {
    label: "Exit Strategies",
    icon: <TrendingUpIcon aria-label="Trending Up" />,
    className: "exit-strategies-tab",
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
    label: "Tax",
    icon: <AccountBalanceIcon aria-label="Account Balance" />,
    className: "tax-implications-tab",
    component: (
      <TaxImplicationsCalculator
        onResultsChange={(results: any) => handleResultsChange("tax", results)}
      />
    ),
  },
  {
    label: "Refinance",
    icon: <AccountBalanceIcon aria-label="Account Balance" />,
    className: "refinance-tab",
    component: <LazyComprehensiveRefinanceCalculator />,
  },
  {
    label: "Risk Analysis",
    icon: <SecurityIcon aria-label="Security" />,
    className: "risk-analysis-tab",
    component: (
      <RiskAnalysisTab
        dealState={dealState}
        updateDealState={updateDealState}
        handleResultsChange={handleResultsChange}
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
        monteCarloResults={monteCarloResults}
        monteCarloLoading={monteCarloLoading}
        runRiskSimulation={runRiskSimulation}
      />
    ),
  },
  {
    label: "Stress Testing",
    icon: <WarningIcon aria-label="Warning" />,
    className: "stress-testing-tab",
    component: (
      <StressTestingTab
        dealState={dealState}
        onResultsChange={(results: any) =>
          handleResultsChange("stressTesting", results)
        }
      />
    ),
  },
  {
    label: "Sensitivity & Inflation",
    icon: <ShowChartIcon aria-label="Show Chart" />,
    className: "sensitivity-analysis-tab",
    component: (
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <Box>
          <SensitivityAnalysisCalculator
            onResultsChange={(results: any) =>
              handleResultsChange("sensitivity", results)
            }
          />
        </Box>
        <Box>
          <InflationAdjustmentsCalculator
            onResultsChange={(results: any) =>
              handleResultsChange("inflation", results)
            }
          />
        </Box>
      </Box>
    ),
  },
  {
    label: "Scenario Comparison",
    icon: <SwapHorizIcon aria-label="Swap Horizontally" />,
    className: "scenario-comparison-tab",
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
  OVERVIEW: "Overview",
  GLOBAL_CONFIG: "Global Configuration",
  SEASONAL_MARKET: "Seasonal & Market",
  EXIT_STRATEGIES: "Exit Strategies",
  TAX: "Tax",
  REFINANCE: "Refinance",
  RISK_ANALYSIS: "Risk Analysis",
  STRESS_TESTING: "Stress Testing",
  SENSITIVITY_INFLATION: "Sensitivity & Inflation",
  SCENARIO_COMPARISON: "Scenario Comparison",
} as const;

// Tab class names for styling
export const TAB_CLASSES = {
  OVERVIEW: "overview-tab",
  GLOBAL_CONFIG: "global-config-tab",
  EXIT_STRATEGIES: "exit-strategies-tab",
  TAX: "tax-implications-tab",
  REFINANCE: "refinance-tab",
  RISK_ANALYSIS: "risk-analysis-tab",
  STRESS_TESTING: "stress-testing-tab",
  SENSITIVITY_ANALYSIS: "sensitivity-analysis-tab",
  SCENARIO_COMPARISON: "scenario-comparison-tab",
} as const;

// Export types for better type safety
export type TabLabel = (typeof TAB_LABELS)[keyof typeof TAB_LABELS];
export type TabClass = (typeof TAB_CLASSES)[keyof typeof TAB_CLASSES];
