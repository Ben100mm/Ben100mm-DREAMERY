import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import {
  calculateSeasonalAdjustments,
  calculateMarketAdjustments,
  calculateExitStrategies,
  calculateRiskScore,
  defaultMarketConditions,
  defaultSeasonalFactors,
  MarketConditions,
  SeasonalFactors,
} from "../utils/advancedCalculations";
import {
  EnhancedNumberInput,
  EnhancedSelectWithValidation,
  EnhancedTextFieldWithValidation,
} from "./EnhancedFormComponents";
import { CompletionProgress, HelpTooltip } from "./UXComponents";
import { brandColors } from "../theme";

type SeasonalAdjustmentsProps = {
  baseVacancyRate: number;
  baseMaintenanceCost: number;
  onResultsChange?: (results: any) => void;
};

type MarketConditionsProps = {
  baseMetrics: {
    vacancyRate: number;
    rentGrowth: number;
    appreciation: number;
    capRate: number;
  };
  onResultsChange?: (results: any) => void;
};

type ExitStrategiesProps = {
  propertyValue: number;
  currentMarketValue: number;
  onResultsChange?: (results: any) => void;
};

type RiskAnalysisProps = {
  onResultsChange?: (results: any) => void;
};

export const AdvancedAnalysisDashboard: React.FC<{
  allResults?: Record<string, any>;
}> = ({ allResults = {} }) => {
  const [completed, setCompleted] = useState(0);

  const handleExport = () => {
    if (Object.keys(allResults).length === 0) {
      alert("No results to export. Please complete some calculations first.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.entries(allResults)
        .map(([type, res]) => `${type},${JSON.stringify(res)}`)
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "advanced-calculations-results.csv";
    link.click();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
          Advanced Analysis Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 2 }}>
          Configure market and seasonal inputs, then review calculated outputs.
        </Typography>
        <CompletionProgress
          completed={completed}
          total={4}
          label="Calculation Completion"
        />

        {/* Quick Export Button */}
        {Object.keys(allResults).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleExport}
              size="small"
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                "&:hover": { borderColor: brandColors.secondary, bgcolor: brandColors.backgrounds.hover },
              }}
            >
              Quick Export Results
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const SeasonalAdjustmentsCalculator: React.FC<
  SeasonalAdjustmentsProps
> = ({ baseVacancyRate, baseMaintenanceCost, onResultsChange }) => {
  const [factors] = useState<SeasonalFactors>(defaultSeasonalFactors);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const result = useMemo(
    () => calculateSeasonalAdjustments(baseVacancyRate, factors, month),
    [baseVacancyRate, factors, month],
  );
  useEffect(() => {
    onResultsChange?.(result);
  }, [result, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Seasonal Adjustments
          </Typography>
          <HelpTooltip title="Adjust vacancy/maintenance by season" />
        </Box>
        <EnhancedNumberInput
          label="Month (1-12)"
          value={month}
          onChange={setMonth}
          min={1}
          max={12}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
            Adjusted Vacancy: {(result.adjustedVacancyRate * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
            Maintenance Multiplier: {result.maintenanceMultiplier.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const MarketConditionsCalculator: React.FC<MarketConditionsProps> = ({
  baseMetrics,
  onResultsChange,
}) => {
  const [type, setType] =
    useState<keyof typeof defaultMarketConditions>("stable");
  const result = useMemo(
    () =>
      calculateMarketAdjustments(baseMetrics, defaultMarketConditions[type]),
    [baseMetrics, type],
  );
  useEffect(() => {
    onResultsChange?.(result);
  }, [result, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Market Conditions
          </Typography>
          <HelpTooltip title="Apply market scenario to base metrics" />
        </Box>
        <EnhancedSelectWithValidation
          label="Market"
          value={type}
          onChange={(v) => setType(v as any)}
          options={[
            { value: "hot", label: "Hot" },
            { value: "stable", label: "Stable" },
            { value: "slow", label: "Slow" },
          ]}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
            Adj Vacancy: {(result.adjustedVacancyRate * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
            Adj Rent Growth: {(result.adjustedRentGrowth * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
            Adj Appreciation: {(result.adjustedAppreciation * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
            Adj Cap Rate: {(result.adjustedCapRate * 100).toFixed(2)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ExitStrategiesCalculator: React.FC<ExitStrategiesProps> = ({
  propertyValue,
  currentMarketValue,
  onResultsChange,
}) => {
  const [years, setYears] = useState<string>("2,5,10");
  const strategies = useMemo(
    () =>
      years
        .split(",")
        .map((y) => ({
          timeframe: Math.max(1, Number(y.trim()) || 1),
          sellingCosts: 6,
          capitalGainsTax: 15,
          depreciationRecapture: 10,
          marketAppreciation: 0.04,
        })),
    [years],
  );
  const results = useMemo(
    () =>
      calculateExitStrategies(propertyValue, strategies, currentMarketValue),
    [propertyValue, strategies, currentMarketValue],
  );
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Exit Strategies
          </Typography>
          <HelpTooltip title="Compare outcomes across different exit years" />
        </Box>
        <EnhancedTextFieldWithValidation
          label="Years (comma-separated)"
          value={years}
          onChange={setYears}
        />
        <Box sx={{ mt: 1 }}>
          {results.map((r) => (
            <Typography
              key={r.timeframe}
              variant="body2"
              sx={{ color: brandColors.neutral.dark }}
            >
              Year {r.timeframe}: ROI {r.roi.toFixed(1)}%, Annualized{" "}
              {r.annualizedRoi.toFixed(1)}%
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export const RiskAnalysisCalculator: React.FC<RiskAnalysisProps> = ({
  onResultsChange,
}) => {
  const [market, setMarket] =
    useState<keyof typeof defaultMarketConditions>("stable");
  const [age, setAge] = useState<number>(20);
  const [rf, setRf] = useState({
    marketVolatility: 5,
    tenantQuality: 5,
    propertyCondition: 5,
    locationStability: 5,
    financingRisk: 5,
  });
  const propertyAge = {
    age,
    maintenanceCostMultiplier: 1.0,
    utilityEfficiencyMultiplier: 1.0,
    insuranceCostMultiplier: 1.0,
    expectedLifespan: 50,
  };
  const res = useMemo(
    () => calculateRiskScore(rf, defaultMarketConditions[market], propertyAge),
    [rf, market, propertyAge],
  );
  useEffect(() => {
    onResultsChange?.(res);
  }, [res, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Risk Analysis
          </Typography>
          <HelpTooltip title="Risk scoring with recommendations" />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          <EnhancedSelectWithValidation
            label="Market"
            value={market}
            onChange={(v) => setMarket(v as any)}
            options={[
              { value: "hot", label: "Hot" },
              { value: "stable", label: "Stable" },
              { value: "slow", label: "Slow" },
            ]}
          />
          <EnhancedNumberInput
            label="Age (yrs)"
            value={age}
            onChange={setAge}
            min={0}
            max={100}
          />
          <EnhancedNumberInput
            label="Financing Risk (1-10)"
            value={rf.financingRisk}
            onChange={(v) => setRf((p) => ({ ...p, financingRisk: v }))}
            min={1}
            max={10}
          />
          <EnhancedNumberInput
            label="Market Volatility (1-10)"
            value={rf.marketVolatility}
            onChange={(v) => setRf((p) => ({ ...p, marketVolatility: v }))}
            min={1}
            max={10}
          />
          <EnhancedNumberInput
            label="Tenant Quality (1-10)"
            value={rf.tenantQuality}
            onChange={(v) => setRf((p) => ({ ...p, tenantQuality: v }))}
            min={1}
            max={10}
          />
          <EnhancedNumberInput
            label="Property Condition (1-10)"
            value={rf.propertyCondition}
            onChange={(v) => setRf((p) => ({ ...p, propertyCondition: v }))}
            min={1}
            max={10}
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            Overall: {res.overallRiskScore} ({res.riskCategory})
          </Typography>
          {res.recommendations.map((r, i) => (
            <Typography key={i} variant="body2">
              - {r}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalysisDashboard;
