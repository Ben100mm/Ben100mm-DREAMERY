import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { brandColors } from "../theme";
import {
  LineChart,
  LineSeriesType,
  BarChart,
  BarSeriesType,
} from "@mui/x-charts";
import { DealState } from "../types/deal";
import {
  defaultExitStrategies,
  calculateConfidenceIntervals,
} from "../utils/advancedCalculations";

interface ExitStrategiesTabProps {
  dealState: DealState | null;
  updateDealState: (updates: Partial<DealState>) => void;
  handleResultsChange: <K extends keyof any>(
    calculatorType: K,
    results: any,
  ) => void;
  isCalculating: boolean;
  setIsCalculating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExitStrategiesTab: React.FC<ExitStrategiesTabProps> = ({
  dealState,
  updateDealState,
  handleResultsChange,
  isCalculating,
  setIsCalculating,
}) => {
  if (!dealState) {
    return (
      <Box>
        <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
          No deal data found. Please go back to the Underwrite page and click
          "Open Advanced Analysis" to load your deal data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
      >
        Exit Strategy Configuration
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 3 }}>
        Configure exit strategy parameters and view projected returns over
        different timeframes
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Market Appreciation (%)"
          type="number"
          value={
            dealState.exitStrategies[0]?.marketAppreciation
              ? (dealState.exitStrategies[0].marketAppreciation * 100).toFixed(
                  1,
                )
              : "4.0"
          }
          onChange={(e) => {
            const rawValue = e.target.value;
            if (rawValue === "") return; // Allow empty for reset
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
          helperText={
            parseFloat(
              dealState.exitStrategies[0]?.marketAppreciation
                ? (
                    dealState.exitStrategies[0].marketAppreciation * 100
                  ).toFixed(1)
                : "4.0",
            ) < 0
              ? "Must be 0 or greater"
              : ""
          }
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
            if (rawValue === "") return; // Allow empty for reset
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
          helperText={
            (dealState.exitStrategies[0]?.sellingCosts ||
              defaultExitStrategies[0].sellingCosts) < 0
              ? "Must be 0 or greater"
              : ""
          }
        />
      </Box>

      <Button
        variant="contained"
        disabled={isCalculating}
        onClick={async () => {
          if (dealState) {
            setIsCalculating(true);
            try {
              // Trigger recalculation by updating a dependency
              updateDealState({
                exitStrategies: [...(dealState?.exitStrategies || [])],
              });
            } finally {
              setIsCalculating(false);
            }
          }
        }}
        aria-label="Recalculate exit strategy projections based on current configuration"
        data-testid="recalculate-exit-strategies-button"
        sx={{ mt: 2 }}
      >
        {isCalculating ? (
          <CircularProgress size={24} />
        ) : (
          "Recalculate Exit Strategies"
        )}
      </Button>

      {dealState.exitStrategyResults && (
        <>
          <Table
            size="small"
            aria-label="Exit Strategies Results"
            data-testid="exit-strategies-results-table"
            sx={{ mt: 2, border: 1, borderColor: brandColors.borders.secondary }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Timeframe (Years)</TableCell>
                <TableCell>Projected Value</TableCell>
                <TableCell>Net Proceeds</TableCell>
                <TableCell>ROI (%)</TableCell>
                <TableCell>Annualized ROI (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dealState.exitStrategyResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.timeframe}</TableCell>
                  <TableCell>
                    ${result.projectedValue.toLocaleString()}
                    <br />
                    <Typography variant="caption" sx={{ color: brandColors.neutral.dark }}>
                      ±$
                      {(
                        calculateConfidenceIntervals(
                          result.projectedValue,
                          dealState?.riskFactors?.marketVolatility || 5,
                          0.95,
                        ).upperBound - result.projectedValue
                      ).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>${result.netProceeds.toLocaleString()}</TableCell>
                  <TableCell
                    sx={{ color: result.roi > 0 ? brandColors.accent.success : "#d32f2f" }}
                  >
                    {result.roi.toFixed(1)}%
                  </TableCell>
                  <TableCell
                    sx={{
                      color: result.annualizedRoi > 0 ? brandColors.accent.success : "#d32f2f",
                    }}
                  >
                    {result.annualizedRoi.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Confidence Intervals Summary for Exit Strategies */}
          <Box
            sx={{ mt: 2, p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}
            >
              Statistical Confidence (95%):
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
              Based on market volatility of{" "}
              {dealState?.riskFactors?.marketVolatility || 5}/10
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
              - Higher volatility = wider confidence intervals
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
              - Lower volatility = more precise projections
            </Typography>
          </Box>

          {/* Charts */}
          <Box
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: brandColors.primary,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                ROI Trend Over Time
              </Typography>
              <LineChart
                width={400}
                height={250}
                aria-label="ROI Trend Over Time Chart"
                data-testid="roi-trend-chart"
                series={[
                  {
                    data: dealState.exitStrategyResults.map((r) => r.roi),
                    label: "ROI (%)",
                    color: brandColors.primary,
                    type: "line",
                  } as LineSeriesType,
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: dealState.exitStrategyResults.map(
                      (r) => `${r.timeframe} Years`,
                    ),
                    label: "Timeframe",
                  },
                ]}
                yAxis={[
                  {
                    label: "ROI (%)",
                    min:
                      Math.min(
                        ...dealState.exitStrategyResults.map((r) => r.roi),
                      ) - 5,
                    max:
                      Math.max(
                        ...dealState.exitStrategyResults.map((r) => r.roi),
                      ) + 5,
                  },
                ]}
              />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: brandColors.primary,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Projected Property Values
              </Typography>
              <BarChart
                width={400}
                height={250}
                aria-label="Projected Property Values Chart"
                data-testid="projected-values-chart"
                series={[
                  {
                    data: dealState.exitStrategyResults.map(
                      (r) => r.projectedValue / 1000,
                    ),
                    label: "Value ($K)",
                    color: brandColors.accent.success,
                    type: "bar",
                  } as BarSeriesType,
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: dealState.exitStrategyResults.map(
                      (r) => `${r.timeframe} Years`,
                    ),
                    label: "Timeframe",
                  },
                ]}
                yAxis={[
                  {
                    label: "Value ($K)",
                    min: 0,
                  },
                ]}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
