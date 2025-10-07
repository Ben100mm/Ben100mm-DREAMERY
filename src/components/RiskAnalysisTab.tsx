import React, { useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { DealState } from "../types/deal";
import { 
  defaultRiskFactors,
  calculateRiskScore,
  calculateMetricRiskAdjustments,
} from "../utils/advancedCalculations";
import { brandColors } from "../theme";
import { formatCurrency } from "./UXComponents";

interface RiskAnalysisTabProps {
  dealState: DealState | null;
  updateDealState: (updates: Partial<DealState>) => void;
  handleResultsChange: <K extends keyof any>(
    calculatorType: K,
    results: any,
  ) => void;
  isCalculating: boolean;
  setIsCalculating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RiskAnalysisTab: React.FC<RiskAnalysisTabProps> = ({
  dealState,
  updateDealState,
  handleResultsChange,
  isCalculating,
  setIsCalculating,
}) => {
  // Calculate weighted risk score
  const weightedRiskAnalysis = useMemo(() => {
    if (!dealState || !dealState.riskScoreResults) return null;
    
    try {
      const riskScore = calculateRiskScore(
        dealState.riskFactors || defaultRiskFactors,
        dealState.marketConditions
      );
      return riskScore;
    } catch (error) {
      console.error('Error calculating weighted risk:', error);
      return null;
    }
  }, [dealState]);

  // Calculate metric-based risk adjustments if we have the necessary data
  const metricRiskAdjustments = useMemo(() => {
    if (!dealState) return null;
    
    try {
      // Extract metrics from deal state
      const purchasePrice = dealState.purchasePrice || 0;
      const downPayment = (dealState.loan?.downPayment || 20) / 100 * purchasePrice;
      const loanAmount = purchasePrice - downPayment;
      const monthlyRent = dealState.baseMonthlyRent || 0;
      const monthlyExpenses = (dealState.ops?.taxes || 0) / 12 + 
                              (dealState.ops?.insurance || 0) / 12 +
                              (dealState.ops?.maintenance || 0) / 12;
      const monthlyCashFlow = monthlyRent - monthlyExpenses;
      const annualCashFlow = monthlyCashFlow * 12;
      const cocReturn = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;
      
      // Calculate DSCR
      const interestRate = dealState.loan?.rate || 0;
      const loanTermYears = dealState.loan?.term || 30;
      const monthlyRate = interestRate / 100 / 12;
      const loanTermMonths = loanTermYears * 12;
      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
                         (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
      }
      const annualDebtService = monthlyPayment * 12;
      const noi = (monthlyRent - monthlyExpenses + monthlyPayment) * 12;
      const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
      
      const metrics = {
        dscr,
        ltv: (loanAmount / purchasePrice) * 100,
        coc: cocReturn,
        capRate: purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0,
      };
      
      return calculateMetricRiskAdjustments(metrics);
    } catch (error) {
      console.error('Error calculating metric risk adjustments:', error);
      return null;
    }
  }, [dealState]);

  if (!dealState) {
    return (
      <Box>
        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
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
        Risk Factor Configuration
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
        Configure risk factors to assess investment risk and generate risk
        scores
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Market Volatility"
          type="number"
          inputProps={{
            min: 1,
            max: 10,
            "aria-label": "Market Volatility rating from 1 to 10",
            "aria-describedby": "market-volatility-helper",
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
          helperText={
            dealState.riskFactors.marketVolatility < 1 ||
            dealState.riskFactors.marketVolatility > 10
              ? "Must be 1-10"
              : ""
          }
          id="market-volatility-helper"
        />
        <TextField
          fullWidth
          label="Tenant Quality"
          type="number"
          inputProps={{
            min: 1,
            max: 10,
            "aria-label": "Tenant Quality rating from 1 to 10",
            "aria-describedby": "tenant-quality-helper",
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
          helperText={
            dealState.riskFactors.tenantQuality < 1 ||
            dealState.riskFactors.tenantQuality > 10
              ? "Must be 1-10"
              : ""
          }
          id="tenant-quality-helper"
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
                riskFactors: { ...dealState.riskFactors },
              });
            } finally {
              setIsCalculating(false);
            }
          }
        }}
        aria-label="Recalculate risk analysis based on current configuration"
        sx={{ mt: 2 }}
      >
        {isCalculating ? (
          <CircularProgress size={24} />
        ) : (
          "Recalculate Risk Analysis"
        )}
      </Button>

      {dealState.riskScoreResults && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
          >
            Risk Analysis Results
          </Typography>

          <Box
            sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1, mb: 2 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}
            >
              Overall Risk Score: {dealState.riskScoreResults.overallRiskScore}
              /10
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
              Risk Level: {dealState.riskScoreResults.riskCategory}
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
              {dealState.riskScoreResults.recommendations?.join(", ")}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: brandColors.backgrounds.warning,
              borderRadius: 1,
              border: "1px solid #ffeaa7",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: brandColors.neutral[800] }}
            >
              Confidence Intervals (95%):
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
              Based on market volatility of{" "}
              {dealState?.riskFactors?.marketVolatility || 5}/10
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
              - Higher volatility = wider confidence intervals
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
              - Lower volatility = more precise projections
            </Typography>
          </Box>
        </Box>
      )}

      {/* Weighted Risk Scoring Dashboard */}
      {weightedRiskAnalysis && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
          >
            Weighted Risk Scoring Analysis
          </Typography>

          {/* Overall Risk Score Card */}
          <Card sx={{ mb: 3, backgroundColor: brandColors.backgrounds.secondary }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Overall Risk Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 700, color: brandColors.primary }}>
                      {weightedRiskAnalysis.overallRiskScore.toFixed(1)}
                    </Typography>
                    <Box>
                      <Chip 
                        label={weightedRiskAnalysis.riskCategory}
                        color={
                          weightedRiskAnalysis.riskCategory === 'Low Risk' ? 'success' :
                          weightedRiskAnalysis.riskCategory === 'Moderate Risk' ? 'warning' : 'error'
                        }
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Scale: 0 (Low Risk) - 10 (High Risk)
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(weightedRiskAnalysis.overallRiskScore / 10) * 100}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: brandColors.neutral[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 
                            weightedRiskAnalysis.overallRiskScore < 4 ? brandColors.success :
                            weightedRiskAnalysis.overallRiskScore < 7 ? brandColors.warning : brandColors.error
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Risk Category Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Market Risk:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weightedRiskAnalysis.riskBreakdown.marketRisk.toFixed(1)}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(weightedRiskAnalysis.riskBreakdown.marketRisk / 10) * 100}
                          sx={{ width: 100, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Property Risk:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weightedRiskAnalysis.riskBreakdown.propertyRisk.toFixed(1)}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(weightedRiskAnalysis.riskBreakdown.propertyRisk / 10) * 100}
                          sx={{ width: 100, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Tenant Risk:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weightedRiskAnalysis.riskBreakdown.tenantRisk.toFixed(1)}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(weightedRiskAnalysis.riskBreakdown.tenantRisk / 10) * 100}
                          sx={{ width: 100, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Financing Risk:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weightedRiskAnalysis.riskBreakdown.financingRisk.toFixed(1)}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(weightedRiskAnalysis.riskBreakdown.financingRisk / 10) * 100}
                          sx={{ width: 100, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Metric-Based Risk Adjustments */}
          {metricRiskAdjustments && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Metric-Based Risk Adjustments
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                      <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                        DSCR
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
                        {metricRiskAdjustments.dscr.value.toFixed(2)}x
                      </Typography>
                      <Chip 
                        label={metricRiskAdjustments.dscr.riskLevel}
                        size="small"
                        color={
                          metricRiskAdjustments.dscr.riskLevel === 'Excellent' || 
                          metricRiskAdjustments.dscr.riskLevel === 'Good' ? 'success' :
                          metricRiskAdjustments.dscr.riskLevel === 'Acceptable' ? 'warning' : 'error'
                        }
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Adjustment: {metricRiskAdjustments.dscr.adjustment > 0 ? '+' : ''}{metricRiskAdjustments.dscr.adjustment}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                      <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                        LTV
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
                        {metricRiskAdjustments.ltv.value.toFixed(1)}%
                      </Typography>
                      <Chip 
                        label={metricRiskAdjustments.ltv.riskLevel}
                        size="small"
                        color={
                          metricRiskAdjustments.ltv.riskLevel === 'Excellent' || 
                          metricRiskAdjustments.ltv.riskLevel === 'Good' ? 'success' :
                          metricRiskAdjustments.ltv.riskLevel === 'Acceptable' ? 'warning' : 'error'
                        }
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Adjustment: {metricRiskAdjustments.ltv.adjustment > 0 ? '+' : ''}{metricRiskAdjustments.ltv.adjustment}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                      <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                        Cash on Cash
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
                        {metricRiskAdjustments.coc.value.toFixed(1)}%
                      </Typography>
                      <Chip 
                        label={metricRiskAdjustments.coc.riskLevel}
                        size="small"
                        color={
                          metricRiskAdjustments.coc.riskLevel === 'Excellent' || 
                          metricRiskAdjustments.coc.riskLevel === 'Good' ? 'success' :
                          metricRiskAdjustments.coc.riskLevel === 'Acceptable' ? 'warning' : 'error'
                        }
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Adjustment: {metricRiskAdjustments.coc.adjustment > 0 ? '+' : ''}{metricRiskAdjustments.coc.adjustment}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                      <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                        Cap Rate
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
                        {metricRiskAdjustments.capRate.value.toFixed(2)}%
                      </Typography>
                      <Chip 
                        label={metricRiskAdjustments.capRate.riskLevel}
                        size="small"
                        color={
                          metricRiskAdjustments.capRate.riskLevel === 'Excellent' || 
                          metricRiskAdjustments.capRate.riskLevel === 'Good' ? 'success' :
                          metricRiskAdjustments.capRate.riskLevel === 'Acceptable' ? 'warning' : 'error'
                        }
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Adjustment: {metricRiskAdjustments.capRate.adjustment > 0 ? '+' : ''}{metricRiskAdjustments.capRate.adjustment}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: brandColors.neutral[600] }}>
                  Risk adjustments are added to the base risk score. Positive adjustments increase risk, negative adjustments decrease risk.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {weightedRiskAnalysis.recommendations && weightedRiskAnalysis.recommendations.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Risk Mitigation Recommendations
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {weightedRiskAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {rec}
                      </Typography>
                    </li>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};
