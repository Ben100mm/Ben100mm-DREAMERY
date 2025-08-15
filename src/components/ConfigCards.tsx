import React from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { brandColors } from "../theme";
import { DealState } from "../types/deal";
import {
  defaultMarketConditionsSimple,
  defaultRiskFactors,
  defaultExitStrategies,
} from "../utils/advancedCalculations";

interface ConfigCardsProps {
  dealState: DealState;
  updateDealState: (updates: Partial<DealState>) => void;
  scenarios: any[];
  setScenarios: (scenarios: any[]) => void;
  allResults: any;
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }) => void;
}

export const ConfigCards: React.FC<ConfigCardsProps> = ({
  dealState,
  updateDealState,
  scenarios,
  setScenarios,
  allResults,
  setSnackbar,
}) => {
  if (!dealState) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body2">
          No deal data found. Please go back to the Underwrite page and click
          "Open Advanced Analysis" to load your deal data.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      {/* Market Conditions Configuration */}
      <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
        >
          Market Conditions
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
            label="Inflation Rate (%)"
            type="number"
            inputProps={{
              "aria-label": "Inflation Rate percentage",
              "aria-describedby": "inflation-rate-helper",
              "data-testid": "inflation-rate-input",
            }}
            value={(
              (dealState.marketConditions?.inflationRate ||
                defaultMarketConditionsSimple.inflationRate) * 100
            ).toFixed(1)}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") return; // Allow empty for reset
              const value = Math.max(0, parseFloat(rawValue) || 0) / 100;
              updateDealState({
                marketConditions: {
                  ...(dealState?.marketConditions ||
                    defaultMarketConditionsSimple),
                  inflationRate: value,
                },
              });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText={
              parseFloat(
                (
                  (dealState.marketConditions?.inflationRate ||
                    defaultMarketConditionsSimple.inflationRate) * 100
                ).toFixed(1),
              ) < 0
                ? "Must be 0 or greater"
                : ""
            }
            id="inflation-rate-helper"
          />
          <TextField
            fullWidth
            label="Appreciation Rate (%)"
            type="number"
            inputProps={{
              "aria-label": "Appreciation Rate percentage",
              "aria-describedby": "appreciation-rate-helper",
              "data-testid": "appreciation-rate-input",
            }}
            value={(
              (dealState.marketConditions?.appreciationRate ||
                defaultMarketConditionsSimple.appreciationRate) * 100
            ).toFixed(1)}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") return; // Allow empty for reset
              const value = Math.max(0, parseFloat(rawValue) || 0) / 100;
              updateDealState({
                marketConditions: {
                  ...(dealState?.marketConditions ||
                    defaultMarketConditionsSimple),
                  appreciationRate: value,
                },
              });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText={
              parseFloat(
                (
                  (dealState.marketConditions?.appreciationRate ||
                    defaultMarketConditionsSimple.appreciationRate) * 100
                ).toFixed(1),
              ) < 0
                ? "Must be 0 or greater"
                : ""
            }
            id="appreciation-rate-helper"
          />
          <TextField
            fullWidth
            label="Rent Growth Rate (%)"
            type="number"
            inputProps={{
              "aria-label": "Rent Growth Rate percentage",
              "aria-describedby": "rent-growth-rate-helper",
              "data-testid": "rent-growth-rate-input",
            }}
            value={(
              (dealState.marketConditions?.rentGrowthRate ||
                defaultMarketConditionsSimple.rentGrowthRate) * 100
            ).toFixed(1)}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") return; // Allow empty for reset
              const value = Math.max(0, parseFloat(rawValue) || 0) / 100;
              updateDealState({
                marketConditions: {
                  ...(dealState?.marketConditions ||
                    defaultMarketConditionsSimple),
                  rentGrowthRate: value,
                },
              });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText={
              parseFloat(
                (
                  (dealState.marketConditions?.rentGrowthRate ||
                    defaultMarketConditionsSimple.rentGrowthRate) * 100
                ).toFixed(1),
              ) < 0
                ? "Must be 0 or greater"
                : ""
            }
            id="rent-growth-rate-helper"
          />
        </Box>
      </Card>

      {/* Exit Strategy Configuration */}
      <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
        >
          Exit Strategy Configuration
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            fullWidth
            label="Market Appreciation (%)"
            type="number"
            value={
              dealState.exitStrategies[0]?.marketAppreciation
                ? (
                    dealState.exitStrategies[0].marketAppreciation * 100
                  ).toFixed(1)
                : "4.0"
            }
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") return;
              const value = Math.max(0, parseFloat(rawValue) || 0) / 100;
              updateDealState({
                exitStrategies: (
                  dealState?.exitStrategies || defaultExitStrategies
                ).map((strategy) => ({
                  ...strategy,
                  marketAppreciation: value,
                })),
              });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            label="Selling Costs (%)"
            type="number"
            inputProps={{ "data-testid": "selling-costs-input" }}
            value={
              dealState.exitStrategies[0]?.sellingCosts ||
              defaultExitStrategies[0].sellingCosts
            }
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") return;
              const value = Math.max(0, parseFloat(rawValue) || 0);
              updateDealState({
                exitStrategies: (
                  dealState?.exitStrategies || defaultExitStrategies
                ).map((strategy) => ({
                  ...strategy,
                  sellingCosts: value,
                })),
              });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Box>
      </Card>

      {/* Risk Factor Configuration */}
      <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
        >
          Risk Factor Configuration
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
          }}
        >
          <TextField
            fullWidth
            label="Market Volatility"
            type="number"
            inputProps={{
              min: 1,
              max: 10,
              "data-testid": "market-volatility-input",
            }}
            value={dealState.riskFactors.marketVolatility}
            onChange={(e) => {
              const rawValue = parseInt(e.target.value);
              const value = isNaN(rawValue)
                ? 5
                : Math.max(1, Math.min(10, rawValue));
              updateDealState({
                riskFactors: {
                  ...(dealState?.riskFactors || defaultRiskFactors),
                  marketVolatility: value,
                },
              });
            }}
          />
          <TextField
            fullWidth
            label="Tenant Quality"
            type="number"
            inputProps={{
              min: 1,
              max: 10,
              "data-testid": "tenant-quality-input",
            }}
            value={dealState.riskFactors.tenantQuality}
            onChange={(e) => {
              const rawValue = parseInt(e.target.value);
              const value = isNaN(rawValue)
                ? 7
                : Math.max(1, Math.min(10, rawValue));
              updateDealState({
                riskFactors: {
                  ...(dealState?.riskFactors || defaultRiskFactors),
                  tenantQuality: value,
                },
              });
            }}
          />
        </Box>
      </Card>

      {/* Scenario Management */}
      <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
        >
          Scenario Management
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (Object.keys(allResults).length === 0) {
                setSnackbar({
                  open: true,
                  message:
                    "No results to save. Please complete some calculations first.",
                  severity: "warning",
                });
                return;
              }

              const scenarioName = prompt(
                "Enter a name for this scenario:",
                `Scenario ${scenarios.length + 1}`,
              );
              if (scenarioName) {
                setScenarios([
                  ...scenarios,
                  {
                    name: scenarioName,
                    results: { ...allResults },
                    timestamp: new Date().toISOString(),
                    dealState: dealState ? { ...dealState } : null,
                  },
                ]);

                // Show success snackbar
                setSnackbar({
                  open: true,
                  message: `Scenario "${scenarioName}" saved successfully`,
                  severity: "success",
                });
              }
            }}
            data-testid="save-scenario-button"
            sx={{
              bgcolor: brandColors.accent.success,
              color: brandColors.backgrounds.primary,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Save Current Scenario
          </Button>

          {scenarios.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear all saved scenarios?",
                  )
                ) {
                  setScenarios([]);
                  setSnackbar({
                    open: true,
                    message: "All saved scenarios cleared.",
                    severity: "success",
                  });
                }
              }}
              data-testid="clear-all-scenarios-button"
              sx={{
                borderColor: "#d32f2f",
                color: "#d32f2f",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Clear All Scenarios
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};
