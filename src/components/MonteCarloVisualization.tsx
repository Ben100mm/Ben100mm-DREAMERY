/**
 * Monte Carlo Simulation Visualization Component
 * 
 * Displays probability distributions and statistical analysis from Monte Carlo simulations
 */

import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
  TextField,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import {
  TrendingUp,
  ShowChart,
  Assessment,
  Speed
} from '@mui/icons-material';
import { MonteCarloResults } from '../utils/monteCarloSimulation';
import { brandColors } from '../theme';

// ============================================================================
// Types
// ============================================================================

interface MonteCarloVisualizationProps {
  results: MonteCarloResults;
  targetReturn?: number;
  onTargetReturnChange?: (target: number) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const formatProbability = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// ============================================================================
// Component
// ============================================================================

export const MonteCarloVisualization: React.FC<MonteCarloVisualizationProps> = ({
  results,
  targetReturn = 0,
  onTargetReturnChange
}) => {
  const theme = useTheme();

  // Prepare histogram data for Recharts
  const histogramChartData = useMemo(() => {
    const { bins, frequencies } = results.histogramData;
    return bins.slice(0, -1).map((bin, index) => ({
      range: `${formatCurrency(bin)}`,
      rangeValue: bin,
      frequency: frequencies[index],
      percentage: (frequencies[index] / results.simulationCount) * 100
    }));
  }, [results]);

  // Prepare CDF data
  const cdfData = useMemo(() => {
    const sorted = [...results.results]
      .map(r => r.totalReturn)
      .sort((a, b) => a - b);
    
    const data = sorted.map((value, index) => ({
      value,
      cumulativeProbability: ((index + 1) / sorted.length) * 100
    }));
    
    // Sample every Nth point for performance
    const sampleRate = Math.max(1, Math.floor(data.length / 200));
    return data.filter((_, i) => i % sampleRate === 0);
  }, [results]);

  // Calculate probability of target
  const targetProbability = useMemo(() => {
    return results.probabilityOfTargetReturn(targetReturn);
  }, [results, targetReturn]);

  // Statistics cards
  const statisticsCards = [
    {
      title: 'Mean Return',
      value: formatCurrency(results.totalReturnStats.mean),
      subtitle: `Annualized: ${formatPercent(results.annualizedReturnStats.mean)}`,
      icon: <TrendingUp sx={{ color: brandColors.neutral[600] }} />,
      color: brandColors.neutral[600]
    },
    {
      title: 'Median Return',
      value: formatCurrency(results.totalReturnStats.median),
      subtitle: `50th Percentile`,
      icon: <Assessment sx={{ color: brandColors.neutral[600] }} />,
      color: brandColors.neutral[600]
    },
    {
      title: 'Standard Deviation',
      value: formatCurrency(results.totalReturnStats.stdDev),
      subtitle: `Risk measure`,
      icon: <Speed sx={{ color: brandColors.neutral[700] }} />,
      color: brandColors.neutral[700]
    },
    {
      title: 'Positive Return Probability',
      value: formatProbability(results.probabilityOfPositiveReturn),
      subtitle: `${results.results.filter(r => r.totalReturn > 0).length} of ${results.simulationCount}`,
      icon: <ShowChart sx={{ color: brandColors.neutral[800] }} />,
      color: brandColors.neutral[800]
    }
  ];

  // Percentile data
  const percentileData = [
    { label: '10th Percentile', value: results.totalReturnStats.percentile10, color: brandColors.neutral[700] },
    { label: '25th Percentile', value: results.totalReturnStats.percentile25, color: brandColors.neutral[600] },
    { label: '50th Percentile (Median)', value: results.totalReturnStats.median, color: brandColors.neutral[600] },
    { label: '75th Percentile', value: results.totalReturnStats.percentile75, color: brandColors.neutral[800] },
    { label: '90th Percentile', value: results.totalReturnStats.percentile90, color: brandColors.neutral[800] }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.95) }}>
          <Typography variant="subtitle2" gutterBottom>
            {payload[0].payload.range || formatCurrency(payload[0].payload.value)}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: entry.color,
                  borderRadius: '2px'
                }}
              />
              <Typography variant="body2">
                {entry.name}: {entry.value.toFixed(2)}{entry.name.includes('Probability') || entry.name.includes('%') ? '%' : ''}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Performance Metrics */}
      <Alert 
        sx={{
          mb: 3,
          backgroundColor: brandColors.neutral[50],
          color: brandColors.neutral[800],
          border: `1px solid ${brandColors.neutral[200]}`,
          '& .MuiAlert-icon': {
            color: brandColors.neutral[600]
          }
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          Simulation completed in {results.executionTimeMs.toFixed(0)}ms
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {results.simulationCount.toLocaleString()} iterations • 
          ~{(results.executionTimeMs / results.simulationCount).toFixed(2)}ms per simulation
        </Typography>
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statisticsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {card.icon}
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: card.color, fontWeight: 600 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Histogram */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Distribution of Total Returns
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Frequency distribution showing likelihood of different return outcomes
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={histogramChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="rangeValue" 
              stroke={theme.palette.text.secondary}
              tickFormatter={formatCurrency}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={results.totalReturnStats.mean} stroke={theme.palette.primary.main} strokeDasharray="3 3">
              <Label value="Mean" position="top" fill={theme.palette.primary.main} />
            </ReferenceLine>
            <ReferenceLine x={results.totalReturnStats.median} stroke={theme.palette.info.main} strokeDasharray="3 3">
              <Label value="Median" position="top" fill={theme.palette.info.main} />
            </ReferenceLine>
            <Bar dataKey="frequency" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Cumulative Distribution Function */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cumulative Probability Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Probability of achieving at least a certain return
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={cdfData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorCDF" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="value" 
              stroke={theme.palette.text.secondary}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              domain={[0, 100]}
              label={{ value: 'Cumulative Probability (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulativeProbability"
              name="Cumulative %"
              stroke={theme.palette.primary.main}
              fillOpacity={1}
              fill="url(#colorCDF)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Percentile Analysis */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Percentile Analysis
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {percentileData.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" sx={{ color: item.color, fontWeight: 600 }}>
                  {formatCurrency(item.value)}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, bgcolor: alpha(item.color, 0.2), borderRadius: 1 }}>
                <Box 
                  sx={{ 
                    width: `${((item.value - results.totalReturnStats.min) / (results.totalReturnStats.max - results.totalReturnStats.min)) * 100}%`,
                    height: '100%',
                    bgcolor: item.color,
                    borderRadius: 1
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Target Return Analysis */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Target Return Probability
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          What's the probability of achieving your target return?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <TextField
            label="Target Return"
            type="number"
            value={targetReturn}
            onChange={(e) => onTargetReturnChange && onTargetReturnChange(Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { step: 10000 }
            }}
            sx={{ width: 200 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ color: brandColors.neutral[800], fontWeight: 700 }}>
              {formatProbability(targetProbability)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Probability of achieving at least ${targetReturn.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Chip 
                label={`Best Case: ${formatCurrency(results.totalReturnStats.max)}`}
                sx={{ backgroundColor: brandColors.neutral[800], color: brandColors.neutral[50] }}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Chip 
                label={`Most Likely: ${formatCurrency(results.totalReturnStats.median)}`}
                sx={{ backgroundColor: brandColors.neutral[600], color: brandColors.neutral[50] }}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Chip 
                label={`Worst Case: ${formatCurrency(results.totalReturnStats.min)}`}
                sx={{ backgroundColor: brandColors.neutral[700], color: brandColors.neutral[50] }}
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default MonteCarloVisualization;

