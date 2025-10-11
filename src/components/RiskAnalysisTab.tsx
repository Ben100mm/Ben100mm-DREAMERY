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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DealState } from "../types/deal";
import { 
  defaultRiskFactors,
  calculateRiskScore,
  calculateMetricRiskAdjustments,
} from "../utils/advancedCalculations";
import { brandColors } from "../theme";
import { formatCurrency } from "./UXComponents";
import { MonteCarloResults } from "../utils/monteCarloSimulation";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { MLRiskPredictionDisplay } from "./MLRiskPredictionDisplay";

interface RiskAnalysisTabProps {
  dealState: DealState | null;
  updateDealState: (updates: Partial<DealState>) => void;
  handleResultsChange: <K extends keyof any>(
    calculatorType: K,
    results: any,
  ) => void;
  isCalculating: boolean;
  setIsCalculating: React.Dispatch<React.SetStateAction<boolean>>;
  monteCarloResults?: MonteCarloResults | null;
  monteCarloLoading?: boolean;
  runRiskSimulation?: () => void;
}

export const RiskAnalysisTab: React.FC<RiskAnalysisTabProps> = ({
  dealState,
  updateDealState,
  handleResultsChange,
  isCalculating,
  setIsCalculating,
  monteCarloResults,
  monteCarloLoading,
  runRiskSimulation,
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

          {/* ML-Enhanced Risk Prediction */}
          <MLRiskPredictionDisplay dealState={dealState} />
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
                            weightedRiskAnalysis.overallRiskScore < 4 ? brandColors.accent.success :
                            weightedRiskAnalysis.overallRiskScore < 7 ? brandColors.accent.warning : brandColors.accent.error
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Risk Category Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {(() => {
                      const risks = [
                        { label: 'Market Risk', value: weightedRiskAnalysis.riskBreakdown.marketRisk, description: 'Economic & market conditions' },
                        { label: 'Property Risk', value: weightedRiskAnalysis.riskBreakdown.propertyRisk, description: 'Physical condition & location' },
                        { label: 'Tenant Risk', value: weightedRiskAnalysis.riskBreakdown.tenantRisk, description: 'Occupancy & tenant quality' },
                        { label: 'Financing Risk', value: weightedRiskAnalysis.riskBreakdown.financingRisk, description: 'Loan terms & leverage' }
                      ];
                      const totalRisk = risks.reduce((sum, r) => sum + r.value, 0);
                      
                      return risks.map((risk) => {
                        const percentage = (risk.value / totalRisk) * 100;
                        const color = risk.value < 3 ? brandColors.accent.success : 
                                     risk.value < 6 ? brandColors.accent.warning : 
                                     brandColors.accent.error;
                        
                        return (
                          <Box key={risk.label}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {risk.label}
                                </Typography>
                                <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                                  {risk.description}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color }}>
                                  {risk.value.toFixed(1)} / 10
                                </Typography>
                                <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                                  {percentage.toFixed(1)}% of total
                                </Typography>
                              </Box>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(risk.value / 10) * 100}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: brandColors.neutral[200],
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: color
                                }
                              }}
                            />
                          </Box>
                        );
                      });
                    })()}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Risk Breakdown Pie Chart */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Risk Category Distribution
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[600], mb: 3 }}>
                Proportional breakdown of risk factors contributing to overall investment risk
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PieChart
                      series={[
                        {
                          data: [
                            { 
                              id: 0, 
                              value: weightedRiskAnalysis.riskBreakdown.marketRisk, 
                              label: 'Market Risk',
                              color: '#FF6B6B'
                            },
                            { 
                              id: 1, 
                              value: weightedRiskAnalysis.riskBreakdown.propertyRisk, 
                              label: 'Property Risk',
                              color: '#4ECDC4'
                            },
                            { 
                              id: 2, 
                              value: weightedRiskAnalysis.riskBreakdown.tenantRisk, 
                              label: 'Tenant Risk',
                              color: '#95E1D3'
                            },
                            { 
                              id: 3, 
                              value: weightedRiskAnalysis.riskBreakdown.financingRisk, 
                              label: 'Financing Risk',
                              color: '#F38181'
                            },
                          ],
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                      ]}
                      height={300}
                      slotProps={{
                        legend: {
                          direction: 'column',
                          position: { vertical: 'middle', horizontal: 'right' },
                          padding: 0,
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Risk Factor Analysis
                    </Typography>
                    {[
                      { label: 'Market Risk', value: weightedRiskAnalysis.riskBreakdown.marketRisk, color: '#FF6B6B', description: 'Economic conditions, interest rates, market cycles' },
                      { label: 'Property Risk', value: weightedRiskAnalysis.riskBreakdown.propertyRisk, color: '#4ECDC4', description: 'Physical condition, location quality, age' },
                      { label: 'Tenant Risk', value: weightedRiskAnalysis.riskBreakdown.tenantRisk, color: '#95E1D3', description: 'Occupancy rates, tenant quality, turnover' },
                      { label: 'Financing Risk', value: weightedRiskAnalysis.riskBreakdown.financingRisk, color: '#F38181', description: 'Leverage, interest rate risk, debt coverage' },
                    ].map((item) => {
                      const totalRisk = weightedRiskAnalysis.riskBreakdown.marketRisk + 
                                       weightedRiskAnalysis.riskBreakdown.propertyRisk + 
                                       weightedRiskAnalysis.riskBreakdown.tenantRisk + 
                                       weightedRiskAnalysis.riskBreakdown.financingRisk;
                      const percentage = (item.value / totalRisk * 100).toFixed(1);
                      
                      return (
                        <Paper key={item.label} sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              backgroundColor: item.color, 
                              borderRadius: '50%' 
                            }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.label}
                            </Typography>
                            <Chip 
                              label={`${percentage}%`}
                              size="small"
                              sx={{ ml: 'auto', fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600], display: 'block', ml: 2.5 }}>
                            {item.description}
                          </Typography>
                        </Paper>
                      );
                    })}
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

      {/* Monte Carlo Simulation Section */}
      {runRiskSimulation && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
          >
            Monte Carlo Risk Simulation
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
            Run a probabilistic simulation with 10,000 scenarios to analyze investment risk and potential returns
          </Typography>

          <Button
            variant="contained"
            disabled={monteCarloLoading}
            onClick={runRiskSimulation}
            aria-label="Run Monte Carlo risk simulation"
            sx={{ 
              mb: 3,
              backgroundColor: brandColors.primary,
              '&:hover': {
                backgroundColor: brandColors.secondary,
              }
            }}
          >
            {monteCarloLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Running Simulation...
              </>
            ) : (
              "Run Monte Carlo Simulation"
            )}
          </Button>

          {monteCarloResults && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Simulation completed: {monteCarloResults.simulationCount.toLocaleString()} scenarios analyzed in {Math.round(monteCarloResults.executionTimeMs)}ms
              </Alert>

              {/* Key Statistics Grid */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        IRR Distribution
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Mean
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {monteCarloResults.irrStats.mean.toFixed(2)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Median
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {monteCarloResults.irrStats.median.toFixed(2)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Std Deviation
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {monteCarloResults.irrStats.stdDev.toFixed(2)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Range
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {monteCarloResults.irrStats.min.toFixed(1)}% - {monteCarloResults.irrStats.max.toFixed(1)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Total Return Distribution
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Mean
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {formatCurrency(monteCarloResults.totalReturnStats.mean)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Median
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {formatCurrency(monteCarloResults.totalReturnStats.median)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Std Deviation
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(monteCarloResults.totalReturnStats.stdDev)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                            Range
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(monteCarloResults.totalReturnStats.min)} - {formatCurrency(monteCarloResults.totalReturnStats.max)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Percentile Analysis */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Percentile Analysis - IRR
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          10th Percentile
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.error }}>
                          {monteCarloResults.irrStats.percentile10.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          25th Percentile
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.warning }}>
                          {monteCarloResults.irrStats.percentile25.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          50th (Median)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {monteCarloResults.irrStats.median.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          75th Percentile
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.success }}>
                          {monteCarloResults.irrStats.percentile75.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          90th Percentile
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.success }}>
                          {monteCarloResults.irrStats.percentile90.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Percentile Distribution Chart */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    IRR Distribution Across Percentiles
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[600], mb: 3 }}>
                    Visual representation of return distribution from worst to best case scenarios
                  </Typography>
                  <Box sx={{ width: '100%', height: 350 }}>
                    <BarChart
                      series={[
                        {
                          data: [
                            monteCarloResults.irrStats.percentile10,
                            monteCarloResults.irrStats.percentile25,
                            monteCarloResults.irrStats.median,
                            monteCarloResults.irrStats.percentile75,
                            monteCarloResults.irrStats.percentile90,
                          ],
                          label: 'IRR (%)',
                          color: brandColors.primary,
                        },
                      ]}
                      xAxis={[
                        {
                          scaleType: 'band',
                          data: ['P10\n(Worst)', 'P25', 'P50\n(Median)', 'P75', 'P90\n(Best)'],
                        },
                      ]}
                      yAxis={[
                        {
                          label: 'IRR (%)',
                        },
                      ]}
                      height={300}
                      margin={{ top: 10, right: 30, bottom: 50, left: 60 }}
                      colors={[brandColors.accent.error, brandColors.accent.warning, brandColors.primary, brandColors.accent.success, brandColors.accent.success]}
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip 
                      label={`Mean: ${monteCarloResults.irrStats.mean.toFixed(2)}%`}
                      size="small"
                      sx={{ backgroundColor: brandColors.backgrounds.secondary }}
                    />
                    <Chip 
                      label={`Std Dev: ${monteCarloResults.irrStats.stdDev.toFixed(2)}%`}
                      size="small"
                      sx={{ backgroundColor: brandColors.backgrounds.secondary }}
                    />
                    <Chip 
                      label={`Range: ${(monteCarloResults.irrStats.max - monteCarloResults.irrStats.min).toFixed(2)}%`}
                      size="small"
                      sx={{ backgroundColor: brandColors.backgrounds.secondary }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Risk Metrics */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Risk-Adjusted Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          Sharpe Ratio
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {monteCarloResults.riskMetrics.sharpeRatio.toFixed(2)}
                        </Typography>
                        <Chip 
                          label={monteCarloResults.riskMetrics.sharpeRatio > 1 ? 'Good' : monteCarloResults.riskMetrics.sharpeRatio > 0 ? 'Fair' : 'Poor'}
                          size="small"
                          color={monteCarloResults.riskMetrics.sharpeRatio > 1 ? 'success' : monteCarloResults.riskMetrics.sharpeRatio > 0 ? 'warning' : 'error'}
                          sx={{ mt: 1 }}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          Sortino Ratio
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {monteCarloResults.riskMetrics.sortinoRatio.toFixed(2)}
                        </Typography>
                        <Chip 
                          label={monteCarloResults.riskMetrics.sortinoRatio > 1.5 ? 'Excellent' : monteCarloResults.riskMetrics.sortinoRatio > 0.5 ? 'Good' : 'Poor'}
                          size="small"
                          color={monteCarloResults.riskMetrics.sortinoRatio > 1.5 ? 'success' : monteCarloResults.riskMetrics.sortinoRatio > 0.5 ? 'warning' : 'error'}
                          sx={{ mt: 1 }}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          VaR (95%)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatCurrency(monteCarloResults.riskMetrics.var95)}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                          5% worst case
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          CVaR (95%)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.error }}>
                          {formatCurrency(monteCarloResults.riskMetrics.cvar95)}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                          Expected shortfall
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: brandColors.backgrounds.secondary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          Probability of Loss
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {(monteCarloResults.riskMetrics.probabilityOfLoss * 100).toFixed(1)}%
                        </Typography>
                        <Chip 
                          label={monteCarloResults.riskMetrics.probabilityOfLoss < 0.1 ? 'Low Risk' : monteCarloResults.riskMetrics.probabilityOfLoss < 0.3 ? 'Moderate' : 'High Risk'}
                          size="small"
                          color={monteCarloResults.riskMetrics.probabilityOfLoss < 0.1 ? 'success' : monteCarloResults.riskMetrics.probabilityOfLoss < 0.3 ? 'warning' : 'error'}
                          sx={{ mt: 1 }}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      <strong>Sharpe/Sortino Ratios:</strong> Higher values indicate better risk-adjusted returns (Sharpe &gt;1 is good, Sortino &gt;1.5 is excellent)
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      <strong>VaR:</strong> Maximum expected loss at 95% confidence (5% chance of worse outcome)
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      <strong>CVaR:</strong> Average loss in the worst 5% of scenarios (expected shortfall if VaR is breached)
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>

              {/* Scenario Analysis */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Scenario Analysis (IRR)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffebee', border: '2px solid ' + brandColors.accent.error }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600], fontWeight: 600 }}>
                          WORST CASE (P10)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.accent.error, my: 2 }}>
                          {monteCarloResults.irrStats.percentile10.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                          10% chance of this or worse
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          Total Return: {formatCurrency(monteCarloResults.totalReturnStats.percentile10)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd', border: '2px solid ' + brandColors.primary }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600], fontWeight: 600 }}>
                          BASE CASE (MEDIAN)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, my: 2 }}>
                          {monteCarloResults.irrStats.median.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                          50/50 probability
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          Total Return: {formatCurrency(monteCarloResults.totalReturnStats.median)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9', border: '2px solid ' + brandColors.accent.success }}>
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600], fontWeight: 600 }}>
                          BEST CASE (P90)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.accent.success, my: 2 }}>
                          {monteCarloResults.irrStats.percentile90.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                          10% chance of this or better
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                          Total Return: {formatCurrency(monteCarloResults.totalReturnStats.percentile90)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Range Analysis:
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      • Spread between P10 and P90: {Math.abs(monteCarloResults.irrStats.percentile90 - monteCarloResults.irrStats.percentile10).toFixed(2)}% IRR
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      • Downside risk (Median to P10): {Math.abs(monteCarloResults.irrStats.median - monteCarloResults.irrStats.percentile10).toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      • Upside potential (P90 to Median): {Math.abs(monteCarloResults.irrStats.percentile90 - monteCarloResults.irrStats.median).toFixed(2)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Stress Test Results */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Stress Test Analysis
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 2 }}>
                    Investment resilience under adverse market conditions based on Monte Carlo simulation
                  </Typography>
                  <TableContainer component={Paper} sx={{ backgroundColor: brandColors.backgrounds.secondary }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Stress Scenario</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Threshold</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Simulated Value</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Severity</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>IRR Minimum</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                              P10 scenario (worst 10%)
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">&gt; 5%</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {monteCarloResults.irrStats.percentile10.toFixed(2)}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={Math.min(100, Math.max(0, (monteCarloResults.irrStats.percentile10 / 5) * 100))}
                                  size={40}
                                  thickness={5}
                                  sx={{
                                    color: monteCarloResults.irrStats.percentile10 > 5 ? brandColors.accent.success : brandColors.accent.error
                                  }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Math.round((monteCarloResults.irrStats.percentile10 / 5) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={monteCarloResults.irrStats.percentile10 > 5 ? 'PASS' : 'FAIL'}
                              color={monteCarloResults.irrStats.percentile10 > 5 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Positive Return Probability</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                              Likelihood of making money
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">&gt; 70%</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {(monteCarloResults.probabilityOfPositiveReturn * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={Math.min(100, (monteCarloResults.probabilityOfPositiveReturn / 0.7) * 100)}
                                  size={40}
                                  thickness={5}
                                  sx={{
                                    color: monteCarloResults.probabilityOfPositiveReturn > 0.7 ? brandColors.accent.success : brandColors.accent.error
                                  }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Math.round((monteCarloResults.probabilityOfPositiveReturn / 0.7) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={monteCarloResults.probabilityOfPositiveReturn > 0.7 ? 'PASS' : 'FAIL'}
                              color={monteCarloResults.probabilityOfPositiveReturn > 0.7 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Loss Risk</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                              Probability of negative return
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">&lt; 30%</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {(monteCarloResults.riskMetrics.probabilityOfLoss * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={Math.min(100, 100 - (monteCarloResults.riskMetrics.probabilityOfLoss / 0.3) * 100)}
                                  size={40}
                                  thickness={5}
                                  sx={{
                                    color: monteCarloResults.riskMetrics.probabilityOfLoss < 0.3 ? brandColors.accent.success : brandColors.accent.error
                                  }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Math.round(Math.max(0, 100 - (monteCarloResults.riskMetrics.probabilityOfLoss / 0.3) * 100))}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={monteCarloResults.riskMetrics.probabilityOfLoss < 0.3 ? 'PASS' : 'FAIL'}
                              color={monteCarloResults.riskMetrics.probabilityOfLoss < 0.3 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Downside Deviation</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                              Volatility of negative returns
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">&lt; {(monteCarloResults.irrStats.stdDev * 1.5).toFixed(1)}%</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {monteCarloResults.riskMetrics.downsideDeviation.toFixed(2)}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={Math.min(100, 100 - (monteCarloResults.riskMetrics.downsideDeviation / (monteCarloResults.irrStats.stdDev * 1.5)) * 100)}
                                  size={40}
                                  thickness={5}
                                  sx={{
                                    color: monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5 ? brandColors.accent.success : brandColors.accent.error
                                  }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Math.round(Math.max(0, 100 - (monteCarloResults.riskMetrics.downsideDeviation / (monteCarloResults.irrStats.stdDev * 1.5)) * 100))}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5 ? 'PASS' : 'FAIL'}
                              color={monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Risk-Adjusted Return</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                              Sharpe ratio benchmark
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">&gt; 0.5</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {monteCarloResults.riskMetrics.sharpeRatio.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={Math.min(100, (monteCarloResults.riskMetrics.sharpeRatio / 0.5) * 100)}
                                  size={40}
                                  thickness={5}
                                  sx={{
                                    color: monteCarloResults.riskMetrics.sharpeRatio > 0.5 ? brandColors.accent.success : brandColors.accent.error
                                  }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Math.round((monteCarloResults.riskMetrics.sharpeRatio / 0.5) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={monteCarloResults.riskMetrics.sharpeRatio > 0.5 ? 'PASS' : 'FAIL'}
                              color={monteCarloResults.riskMetrics.sharpeRatio > 0.5 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Maximum Drawdown</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                              Peak-to-trough decline
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">&lt; {formatCurrency(monteCarloResults.totalReturnStats.mean * 0.5)}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(monteCarloResults.riskMetrics.maxDrawdown)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={Math.min(100, 100 - (monteCarloResults.riskMetrics.maxDrawdown / (monteCarloResults.totalReturnStats.mean * 0.5)) * 100)}
                                  size={40}
                                  thickness={5}
                                  sx={{
                                    color: monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5 ? brandColors.accent.success : brandColors.accent.error
                                  }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Math.round(Math.max(0, 100 - (monteCarloResults.riskMetrics.maxDrawdown / (monteCarloResults.totalReturnStats.mean * 0.5)) * 100))}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5 ? 'PASS' : 'FAIL'}
                              color={monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip 
                      label={`${[
                        monteCarloResults.irrStats.percentile10 > 5,
                        monteCarloResults.probabilityOfPositiveReturn > 0.7,
                        monteCarloResults.riskMetrics.probabilityOfLoss < 0.3,
                        monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5,
                        monteCarloResults.riskMetrics.sharpeRatio > 0.5,
                        monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5
                      ].filter(Boolean).length}/6 Tests Passed`}
                      color={[
                        monteCarloResults.irrStats.percentile10 > 5,
                        monteCarloResults.probabilityOfPositiveReturn > 0.7,
                        monteCarloResults.riskMetrics.probabilityOfLoss < 0.3,
                        monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5,
                        monteCarloResults.riskMetrics.sharpeRatio > 0.5,
                        monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5
                      ].filter(Boolean).length >= 5 ? 'success' : [
                        monteCarloResults.irrStats.percentile10 > 5,
                        monteCarloResults.probabilityOfPositiveReturn > 0.7,
                        monteCarloResults.riskMetrics.probabilityOfLoss < 0.3,
                        monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5,
                        monteCarloResults.riskMetrics.sharpeRatio > 0.5,
                        monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5
                      ].filter(Boolean).length >= 3 ? 'warning' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                      {[
                        monteCarloResults.irrStats.percentile10 > 5,
                        monteCarloResults.probabilityOfPositiveReturn > 0.7,
                        monteCarloResults.riskMetrics.probabilityOfLoss < 0.3,
                        monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5,
                        monteCarloResults.riskMetrics.sharpeRatio > 0.5,
                        monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5
                      ].filter(Boolean).length >= 5 
                        ? 'Investment shows strong resilience under stress conditions' 
                        : [
                          monteCarloResults.irrStats.percentile10 > 5,
                          monteCarloResults.probabilityOfPositiveReturn > 0.7,
                          monteCarloResults.riskMetrics.probabilityOfLoss < 0.3,
                          monteCarloResults.riskMetrics.downsideDeviation < monteCarloResults.irrStats.stdDev * 1.5,
                          monteCarloResults.riskMetrics.sharpeRatio > 0.5,
                          monteCarloResults.riskMetrics.maxDrawdown < monteCarloResults.totalReturnStats.mean * 0.5
                        ].filter(Boolean).length >= 3
                          ? 'Investment shows moderate stress resilience - review failed tests'
                          : 'Investment may be vulnerable under adverse conditions - consider risk mitigation'
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Confidence Intervals */}
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    95% Confidence Intervals
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          IRR Range
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                          {monteCarloResults.irrStats.confidenceInterval95.lower.toFixed(2)}% - {monteCarloResults.irrStats.confidenceInterval95.upper.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Total Return Range
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                          {formatCurrency(monteCarloResults.totalReturnStats.confidenceInterval95.lower)} - {formatCurrency(monteCarloResults.totalReturnStats.confidenceInterval95.upper)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Typography variant="caption" sx={{ display: 'block', mt: 2, color: brandColors.neutral[600] }}>
                    95% confidence that the true value falls within this range based on {monteCarloResults.simulationCount.toLocaleString()} simulations.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
