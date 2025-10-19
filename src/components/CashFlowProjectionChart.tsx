/**
 * Cash Flow Projection Chart Component
 * 
 * Visualizes year-by-year cash flow projections with interactive charts
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShowChart,
  BarChart as BarChartIcon,
  AccountBalance
} from '@mui/icons-material';
import { YearlyProjection, CashFlowProjectionResults } from '../utils/cashFlowProjections';

// ============================================================================
// Types
// ============================================================================

type ChartType = 'cash-flow' | 'income-expense' | 'loan-paydown' | 'property-value';
type ChartStyle = 'line' | 'bar' | 'area';

interface CashFlowProjectionChartProps {
  results: CashFlowProjectionResults;
  showCapitalEvents?: boolean;
  initialChartType?: ChartType;
}

// ============================================================================
// Formatting Helpers
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

// ============================================================================
// Component
// ============================================================================

export const CashFlowProjectionChart: React.FC<CashFlowProjectionChartProps> = ({
  results,
  showCapitalEvents = true,
  initialChartType = 'cash-flow'
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');

  const { yearlyProjections, summary } = results;

  // Prepare chart data
  const chartData = yearlyProjections.map(proj => ({
    year: `Year ${proj.year}`,
    yearNum: proj.year,
    
    // Cash Flow
    cashFlowBeforeCapEx: proj.cashFlowBeforeCapEx,
    cashFlowAfterCapEx: proj.cashFlowAfterCapEx,
    cumulativeCashFlow: proj.cumulativeCashFlow,
    
    // Income & Expenses
    grossIncome: proj.annualGrossIncome,
    expenses: proj.totalExpenses,
    debtService: proj.totalDebtService,
    noi: proj.noi,
    capitalEvents: proj.totalCapitalEvents,
    
    // Loan
    loanBalance: proj.loanBalance,
    principalPayment: proj.principalPayment,
    interestPayment: proj.interestPayment,
    
    // Property Value
    propertyValue: proj.propertyValue,
    equity: proj.equity,
    
    // Metrics
    cashOnCash: proj.cashOnCashReturn,
    roi: proj.roi,
    capRate: proj.capRate
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.95) }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
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
                {entry.name}: {formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Render chart based on type and style
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'cash-flow':
        if (chartStyle === 'area') {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart {...commonProps}>
                <defs>
                  <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="year" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke={theme.palette.text.disabled} />
                <Area
                  type="monotone"
                  dataKey="cashFlowAfterCapEx"
                  name="Annual Cash Flow"
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorCashFlow)"
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeCashFlow"
                  name="Cumulative Cash Flow"
                  stroke={theme.palette.success.main}
                  fillOpacity={1}
                  fill="url(#colorCumulative)"
                />
              </AreaChart>
            </ResponsiveContainer>
          );
        } else if (chartStyle === 'bar') {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="year" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke={theme.palette.text.disabled} />
                <Bar dataKey="cashFlowAfterCapEx" name="Annual Cash Flow" fill={theme.palette.primary.main} />
                {showCapitalEvents && (
                  <Bar dataKey="capitalEvents" name="Capital Events" fill={theme.palette.error.main} />
                )}
              </BarChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="year" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke={theme.palette.text.disabled} />
                <Line
                  type="monotone"
                  dataKey="cashFlowAfterCapEx"
                  name="Annual Cash Flow"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeCashFlow"
                  name="Cumulative Cash Flow"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          );
        }

      case 'income-expense':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="year" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="grossIncome" name="Gross Income" fill={theme.palette.success.main} stackId="a" />
              <Bar dataKey="expenses" name="Operating Expenses" fill={theme.palette.warning.main} stackId="b" />
              <Bar dataKey="debtService" name="Debt Service" fill={theme.palette.error.main} stackId="b" />
              <Line
                type="monotone"
                dataKey="noi"
                name="NOI"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'loan-paydown':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="year" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="loanBalance"
                name="Loan Balance"
                stroke={theme.palette.error.main}
                fill={alpha(theme.palette.error.main, 0.3)}
              />
              <Bar dataKey="principalPayment" name="Principal Payment" fill={theme.palette.primary.main} />
              <Bar dataKey="interestPayment" name="Interest Payment" fill={theme.palette.warning.main} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'property-value':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="year" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="propertyValue"
                name="Property Value"
                stroke={theme.palette.info.main}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
              <Area
                type="monotone"
                dataKey="equity"
                name="Equity"
                stroke={theme.palette.success.main}
                fillOpacity={1}
                fill="url(#colorEquity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney color="primary" />
                <Typography variant="subtitle2" color="text.secondary">
                  Total Cash Flow
                </Typography>
              </Box>
              <Typography variant="h5" color={summary.totalCashFlow >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(summary.totalCashFlow)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Over {yearlyProjections.length} years
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalance color="primary" />
                <Typography variant="subtitle2" color="text.secondary">
                  Principal Paydown
                </Typography>
              </Box>
              <Typography variant="h5" color="primary.main">
                {formatCurrency(summary.totalPrincipalPaydown)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Loan reduction
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="subtitle2" color="text.secondary">
                  Appreciation
                </Typography>
              </Box>
              <Typography variant="h5" color="success.main">
                {formatCurrency(summary.totalAppreciation)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Property value gain
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShowChart color="info" />
                <Typography variant="subtitle2" color="text.secondary">
                  Annualized Return
                </Typography>
              </Box>
              <Typography variant="h5" color="info.main">
                {formatPercent(summary.annualizedReturn)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                IRR equivalent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Chart Type
            </Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(e, value) => value && setChartType(value)}
              size="small"
            >
              <ToggleButton value="cash-flow">Cash Flow</ToggleButton>
              <ToggleButton value="income-expense">Income & Expense</ToggleButton>
              <ToggleButton value="loan-paydown">Loan Paydown</ToggleButton>
              <ToggleButton value="property-value">Property Value</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Chart Style
            </Typography>
            <ToggleButtonGroup
              value={chartStyle}
              exclusive
              onChange={(e, value) => value && setChartStyle(value)}
              size="small"
            >
              <ToggleButton value="area">Area</ToggleButton>
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Paper>

      {/* Chart */}
      <Paper sx={{ p: 2 }}>
        {renderChart()}
      </Paper>

      {/* Year Details Table */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Year-by-Year Breakdown
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Income</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Expenses</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>NOI</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Debt Service</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Cash Flow</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>CoC %</th>
              </tr>
            </thead>
            <tbody>
              {yearlyProjections.map((proj, index) => (
                <tr
                  key={proj.year}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.action.hover, 0.05)
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Year {proj.year}
                      {proj.capitalEvents.length > 0 && (
                        <Chip
                          label={`${proj.capitalEvents.length} event${proj.capitalEvents.length > 1 ? 's' : ''}`}
                          size="small"
                          color="warning"
                        />
                      )}
                    </Box>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {formatCurrency(proj.annualGrossIncome)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {formatCurrency(proj.totalExpenses)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(proj.noi)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {formatCurrency(proj.totalDebtService)}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: proj.cashFlowAfterCapEx >= 0 ? theme.palette.success.main : theme.palette.error.main
                    }}
                  >
                    {formatCurrency(proj.cashFlowAfterCapEx)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {formatPercent(proj.cashOnCashReturn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
};

export default CashFlowProjectionChart;

