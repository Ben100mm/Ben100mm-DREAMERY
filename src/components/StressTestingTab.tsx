/**
 * Stress Testing Tab Component
 * 
 * Displays comprehensive stress test results across 4 scenarios:
 * - Recession
 * - Interest Rate Shock
 * - Operating Shock
 * - Market Correction
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  Warning,
  CheckCircle,
  Error,
  Info,
  TrendingDown,
  TrendingUp,
  Refresh,
  Settings,
} from '@mui/icons-material';
import { DealState } from '../types/deal';
import {
  runStressTests,
  getStressTestSummary,
  applyStressScenario,
  StressTestResultWithMetrics,
} from '../utils/advancedCalculations';
import { brandColors } from '../theme';
import { formatCurrency } from './UXComponents';

// ============================================================================
// Types
// ============================================================================

interface StressTestingTabProps {
  dealState: DealState | null;
  onResultsChange?: (results: any) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'Mild':
      return brandColors.accent.success;
    case 'Moderate':
      return brandColors.accent.warning;
    case 'Severe':
      return brandColors.accent.error;
    case 'Critical':
      return '#d32f2f';
    default:
      return brandColors.neutral[500];
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'Mild':
      return <CheckCircle sx={{ color: brandColors.accent.success }} />;
    case 'Moderate':
      return <Info sx={{ color: brandColors.accent.warning }} />;
    case 'Severe':
      return <Warning sx={{ color: brandColors.accent.error }} />;
    case 'Critical':
      return <Error sx={{ color: '#d32f2f' }} />;
    default:
      return null;
  }
};

// ============================================================================
// Component
// ============================================================================

export const StressTestingTab: React.FC<StressTestingTabProps> = ({
  dealState,
  onResultsChange,
}) => {
  const [results, setResults] = useState<StressTestResultWithMetrics[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stress tests when dealState changes
  useEffect(() => {
    if (!dealState) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const stressTestResults = runStressTests(dealState);
      setResults(stressTestResults);
      
      if (onResultsChange) {
        onResultsChange({
          stressTests: stressTestResults,
          summary: getStressTestSummary(stressTestResults),
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate stress tests';
      setError(errorMessage);
      console.error('Stress test calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dealState, onResultsChange]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!results) return null;
    return getStressTestSummary(results);
  }, [results]);

  // Handle refresh
  const handleRefresh = () => {
    if (dealState) {
      setIsLoading(true);
      setTimeout(() => {
        try {
          const stressTestResults = runStressTests(dealState);
          setResults(stressTestResults);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to recalculate');
        } finally {
          setIsLoading(false);
        }
      }, 100);
    }
  };

  // Render loading state
  if (!dealState) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No deal data available. Please load a deal to run stress tests.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
          Running Stress Tests...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No stress test results available. Unable to calculate metrics.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary, mb: 1 }}>
            Advanced Stress Testing
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
            Comprehensive analysis across 4 adverse scenarios
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Refresh Analysis">
            <IconButton onClick={handleRefresh} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary Dashboard */}
      {summary && (
        <Card sx={{ mb: 3, backgroundColor: brandColors.backgrounds.secondary }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
              Summary Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                    {summary.passed}/{summary.totalTests}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
                    Tests Passed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                    {summary.passRate.toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
                    Pass Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      color: summary.criticalCount > 0 ? '#d32f2f' : brandColors.accent.warning 
                    }}
                  >
                    {summary.criticalCount + summary.severeCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
                    High Risk Scenarios
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    {summary.worstScenario}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
                    Worst Case Scenario
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Severity Distribution */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Severity Distribution
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {summary.mildCount > 0 && (
                  <Chip 
                    label={`${summary.mildCount} Mild`} 
                    size="small"
                    sx={{ backgroundColor: brandColors.accent.success, color: '#fff' }}
                  />
                )}
                {summary.moderateCount > 0 && (
                  <Chip 
                    label={`${summary.moderateCount} Moderate`} 
                    size="small"
                    sx={{ backgroundColor: brandColors.accent.warning, color: '#fff' }}
                  />
                )}
                {summary.severeCount > 0 && (
                  <Chip 
                    label={`${summary.severeCount} Severe`} 
                    size="small"
                    sx={{ backgroundColor: brandColors.accent.error, color: '#fff' }}
                  />
                )}
                {summary.criticalCount > 0 && (
                  <Chip 
                    label={`${summary.criticalCount} Critical`} 
                    size="small"
                    sx={{ backgroundColor: '#d32f2f', color: '#fff' }}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
            Stress Test Results
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Scenario</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Cash Flow</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>CoC Return</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>DSCR</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:hover': { backgroundColor: brandColors.backgrounds.hover },
                      backgroundColor: !result.passesTest ? 'rgba(244, 67, 54, 0.05)' : 'transparent'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSeverityIcon(result.severity)}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {result.scenarioName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: result.cashFlow < 0 ? brandColors.accent.error : brandColors.neutral[800],
                          fontWeight: result.cashFlow < 0 ? 600 : 400
                        }}
                      >
                        {formatCurrency(result.cashFlow)}/mo
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: result.cocReturn < 0 ? brandColors.accent.error : brandColors.neutral[800],
                          fontWeight: result.cocReturn < 0 ? 600 : 400
                        }}
                      >
                        {result.cocReturn.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: result.dscr < 1.0 ? brandColors.accent.error : 
                                 result.dscr < 1.2 ? brandColors.accent.warning : brandColors.neutral[800],
                          fontWeight: result.dscr < 1.2 ? 600 : 400
                        }}
                      >
                        {result.dscr.toFixed(2)}x
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={result.passesTest ? 'PASS' : 'FAIL'}
                        size="small"
                        color={result.passesTest ? 'success' : 'error'}
                        sx={{ fontWeight: 600, minWidth: 60 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={result.severity}
                        size="small"
                        sx={{ 
                          backgroundColor: getSeverityColor(result.severity),
                          color: '#fff',
                          fontWeight: 600,
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detailed Scenario Analysis */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
        Detailed Scenario Analysis
      </Typography>
      {results.map((result, index) => (
        <Accordion key={index} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {getSeverityIcon(result.severity)}
              <Typography sx={{ fontWeight: 600, flex: 1 }}>
                {result.scenarioName}
              </Typography>
              <Chip 
                label={result.severity}
                size="small"
                sx={{ 
                  backgroundColor: getSeverityColor(result.severity),
                  color: '#fff',
                  fontWeight: 600
                }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: brandColors.neutral[600] }}>
                {result.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Financial Metrics
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Monthly Cash Flow:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(result.cashFlow)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Annual Cash Flow:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(result.cashFlow * 12)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Cash on Cash Return:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {result.cocReturn.toFixed(2)}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">DSCR:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {result.dscr.toFixed(2)}x
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: brandColors.backgrounds.secondary }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Risk Assessment
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Test Status:</Typography>
                        <Chip 
                          label={result.passesTest ? 'PASS' : 'FAIL'}
                          size="small"
                          color={result.passesTest ? 'success' : 'error'}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Severity Level:</Typography>
                        <Chip 
                          label={result.severity}
                          size="small"
                          sx={{ 
                            backgroundColor: getSeverityColor(result.severity),
                            color: '#fff'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Impact:</Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            color: result.impactPercentage < 0 ? brandColors.accent.error : brandColors.accent.success
                          }}
                        >
                          {result.impactPercentage > 0 ? '+' : ''}{result.impactPercentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* DSCR Explanation */}
              <Alert 
                severity={
                  result.dscr < 1.0 ? 'error' : 
                  result.dscr < 1.2 ? 'warning' : 
                  result.dscr < 1.5 ? 'info' : 'success'
                }
                sx={{ mt: 2 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  DSCR Analysis: {result.dscr.toFixed(2)}x
                </Typography>
                <Typography variant="caption">
                  {result.dscr < 1.0 && 'Critical: Cannot cover debt service. Property is cash flow negative after debt payments.'}
                  {result.dscr >= 1.0 && result.dscr < 1.2 && 'Severe: Marginal coverage. Very tight margins with little room for error.'}
                  {result.dscr >= 1.2 && result.dscr < 1.5 && 'Moderate: Acceptable but tight. Property covers debt but with limited buffer.'}
                  {result.dscr >= 1.5 && 'Mild: Good coverage. Property generates sufficient income above debt service.'}
                </Typography>
              </Alert>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Recommendations */}
      {summary && (summary.criticalCount > 0 || summary.severeCount > 0) && (
        <Card sx={{ mt: 3, backgroundColor: 'rgba(244, 67, 54, 0.05)', border: `1px solid ${brandColors.accent.error}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Warning sx={{ color: brandColors.accent.error }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.error }}>
                Risk Warnings
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              This property has failed {summary.failed} out of {summary.totalTests} stress tests. 
              Consider the following:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {summary.criticalCount > 0 && (
                <li>
                  <Typography variant="body2">
                    <strong>Critical Risk:</strong> {summary.criticalCount} scenario(s) show inability to cover debt service. 
                    Increase down payment or negotiate better terms.
                  </Typography>
                </li>
              )}
              {summary.severeCount > 0 && (
                <li>
                  <Typography variant="body2">
                    <strong>Severe Risk:</strong> {summary.severeCount} scenario(s) show marginal coverage. 
                    Build larger cash reserves (6-12 months).
                  </Typography>
                </li>
              )}
              <li>
                <Typography variant="body2">
                  Consider stress testing with increased down payment or reduced purchase price
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Review operating expense assumptions - they may be too optimistic
                </Typography>
              </li>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StressTestingTab;

