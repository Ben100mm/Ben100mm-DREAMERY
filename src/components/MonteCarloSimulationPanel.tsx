/**
 * Monte Carlo Simulation Panel Component
 * 
 * React component for integrating Monte Carlo risk analysis into the UI.
 * Provides a complete interface for configuring and running simulations.
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  ShowChart,
  TrendingUp,
  TrendingDown,
  Info,
  ExpandMore,
} from '@mui/icons-material';
import {
  runMonteCarloSimulation,
  createDefaultUncertaintyParameters,
  formatPercentage,
  formatCurrency,
  type MonteCarloResults,
  type BaseState,
  type MonteCarloInputs,
} from '../utils/monteCarloRiskSimulation';

interface MonteCarloSimulationPanelProps {
  baseState: BaseState;
  simulations?: number;
  yearsToProject?: number;
  onResultsChange?: (results: MonteCarloResults | null) => void;
}

export const MonteCarloSimulationPanel: React.FC<MonteCarloSimulationPanelProps> = ({
  baseState,
  simulations = 10000,
  yearsToProject = 10,
  onResultsChange,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<MonteCarloResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setError(null);
    setProgress(0);
    setResults(null);

    try {
      const uncertaintyParameters = createDefaultUncertaintyParameters(baseState);

      const inputs: MonteCarloInputs = {
        baseState,
        uncertaintyParameters,
        simulations,
        yearsToProject,
        onProgress: (progressUpdate) => {
          setProgress(progressUpdate.percentage);
        },
      };

      const simulationResults = await runMonteCarloSimulation(inputs);
      setResults(simulationResults);
      if (onResultsChange) {
        onResultsChange(simulationResults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
      console.error('Monte Carlo simulation error:', err);
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const getRiskLevel = (probabilityOfLoss: number): { label: string; color: 'success' | 'warning' | 'error' } => {
    if (probabilityOfLoss < 5) return { label: 'Low Risk', color: 'success' };
    if (probabilityOfLoss < 15) return { label: 'Moderate Risk', color: 'warning' };
    return { label: 'High Risk', color: 'error' };
  };

  const getReturnQuality = (sharpeRatio: number): { label: string; color: 'success' | 'warning' | 'error' } => {
    if (sharpeRatio > 2) return { label: 'Excellent', color: 'success' };
    if (sharpeRatio > 1) return { label: 'Good', color: 'success' };
    if (sharpeRatio > 0.5) return { label: 'Fair', color: 'warning' };
    return { label: 'Poor', color: 'error' };
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChart color="primary" />
              <Typography variant="h6">Monte Carlo Risk Simulation</Typography>
              <Tooltip title="Runs thousands of simulations to model investment uncertainty">
                <Info fontSize="small" color="action" />
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              startIcon={isRunning ? <Stop /> : <PlayArrow />}
              onClick={handleRunSimulation}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {simulations.toLocaleString()} simulations • {yearsToProject} year projection
          </Typography>

          {isRunning && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {progress.toFixed(1)}% complete
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Expected Return
                  </Typography>
                  <Typography variant="h5">
                    {formatPercentage(results.distributions.annualizedReturn.mean)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Median: {formatPercentage(results.distributions.annualizedReturn.p50)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Level
                  </Typography>
                  <Chip
                    label={getRiskLevel(results.riskMetrics.probabilityOfLoss).label}
                    color={getRiskLevel(results.riskMetrics.probabilityOfLoss).color}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    {formatPercentage(results.riskMetrics.probabilityOfLoss)} chance of loss
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk-Adjusted Return
                  </Typography>
                  <Typography variant="h5">
                    {results.riskMetrics.sharpeRatio.toFixed(2)}
                  </Typography>
                  <Chip
                    label={getReturnQuality(results.riskMetrics.sharpeRatio).label}
                    color={getReturnQuality(results.riskMetrics.sharpeRatio).color}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Return (P50)
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(results.distributions.totalReturn.p50)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Range: {formatCurrency(results.distributions.totalReturn.p25)} - {formatCurrency(results.distributions.totalReturn.p75)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Results */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Return Distributions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">P10</TableCell>
                      <TableCell align="right">P25</TableCell>
                      <TableCell align="right">P50 (Median)</TableCell>
                      <TableCell align="right">P75</TableCell>
                      <TableCell align="right">P90</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Annualized Return</TableCell>
                      <TableCell align="right">{formatPercentage(results.distributions.annualizedReturn.p10)}</TableCell>
                      <TableCell align="right">{formatPercentage(results.distributions.annualizedReturn.p25)}</TableCell>
                      <TableCell align="right"><strong>{formatPercentage(results.distributions.annualizedReturn.p50)}</strong></TableCell>
                      <TableCell align="right">{formatPercentage(results.distributions.annualizedReturn.p75)}</TableCell>
                      <TableCell align="right">{formatPercentage(results.distributions.annualizedReturn.p90)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Return</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalReturn.p10)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalReturn.p25)}</TableCell>
                      <TableCell align="right"><strong>{formatCurrency(results.distributions.totalReturn.p50)}</strong></TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalReturn.p75)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalReturn.p90)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cash Flow</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalCashFlow.p10)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalCashFlow.p25)}</TableCell>
                      <TableCell align="right"><strong>{formatCurrency(results.distributions.totalCashFlow.p50)}</strong></TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalCashFlow.p75)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.totalCashFlow.p90)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Final Equity</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.finalEquity.p10)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.finalEquity.p25)}</TableCell>
                      <TableCell align="right"><strong>{formatCurrency(results.distributions.finalEquity.p50)}</strong></TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.finalEquity.p75)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.distributions.finalEquity.p90)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Risk Metrics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Value at Risk (VaR)</Typography>
                    <Typography variant="body2">95% VaR: {formatPercentage(results.riskMetrics.valueAtRisk95)}</Typography>
                    <Typography variant="body2">99% VaR: {formatPercentage(results.riskMetrics.valueAtRisk99)}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Maximum expected loss at given confidence level
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Conditional VaR (CVaR)</Typography>
                    <Typography variant="body2">95% CVaR: {formatPercentage(results.riskMetrics.conditionalVaR95)}</Typography>
                    <Typography variant="body2">99% CVaR: {formatPercentage(results.riskMetrics.conditionalVaR99)}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Expected loss when in worst cases
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Return Ratios</Typography>
                    <Typography variant="body2">Sharpe Ratio: {results.riskMetrics.sharpeRatio.toFixed(2)}</Typography>
                    <Typography variant="body2">Sortino Ratio: {results.riskMetrics.sortinoRatio.toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Risk-adjusted return metrics (higher is better)
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Downside Risk</Typography>
                    <Typography variant="body2">Downside Deviation: {formatPercentage(results.riskMetrics.downsideDeviation)}</Typography>
                    <Typography variant="body2">Max Drawdown: {formatPercentage(results.riskMetrics.maxDrawdown)}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Measures of negative return volatility
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Scenario Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Scenario</TableCell>
                      <TableCell align="right">Total Return</TableCell>
                      <TableCell align="right">Cash Flow</TableCell>
                      <TableCell align="right">Final Equity</TableCell>
                      <TableCell align="right">Ann. Return</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp color="success" fontSize="small" />
                          Best Case
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.bestCase.totalReturn)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.bestCase.totalCashFlow)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.bestCase.finalEquity)}</TableCell>
                      <TableCell align="right">{formatPercentage(results.scenarioAnalysis.bestCase.annualizedReturn)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Optimistic (P75)</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.optimisticCase.totalReturn)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.optimisticCase.totalCashFlow)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.optimisticCase.finalEquity)}</TableCell>
                      <TableCell align="right">{formatPercentage(results.scenarioAnalysis.optimisticCase.annualizedReturn)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Expected (P50)</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(results.scenarioAnalysis.expectedCase.totalReturn)}</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(results.scenarioAnalysis.expectedCase.totalCashFlow)}</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(results.scenarioAnalysis.expectedCase.finalEquity)}</strong></TableCell>
                      <TableCell align="right"><strong>{formatPercentage(results.scenarioAnalysis.expectedCase.annualizedReturn)}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pessimistic (P25)</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.pessimisticCase.totalReturn)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.pessimisticCase.totalCashFlow)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.pessimisticCase.finalEquity)}</TableCell>
                      <TableCell align="right">{formatPercentage(results.scenarioAnalysis.pessimisticCase.annualizedReturn)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingDown color="error" fontSize="small" />
                          Worst Case
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.worstCase.totalReturn)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.worstCase.totalCashFlow)}</TableCell>
                      <TableCell align="right">{formatCurrency(results.scenarioAnalysis.worstCase.finalEquity)}</TableCell>
                      <TableCell align="right">{formatPercentage(results.scenarioAnalysis.worstCase.annualizedReturn)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          {/* Metadata */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Simulation completed: {results.metadata.completedAt.toLocaleString()} • 
              {results.metadata.simulationCount.toLocaleString()} simulations • 
              Execution time: {(results.metadata.executionTimeMs / 1000).toFixed(2)}s
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MonteCarloSimulationPanel;

