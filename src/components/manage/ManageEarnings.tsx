import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const ManageEarnings: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [propertyFilter, setPropertyFilter] = useState('all');

  // Mock earnings data
  const earningsData = {
    totalRevenue: 45000,
    totalExpenses: 12000,
    netIncome: 33000,
    occupancyRate: 83.3,
    averageRent: 3750,
    previousMonth: {
      totalRevenue: 42000,
      totalExpenses: 11000,
      netIncome: 31000,
    },
  };

  const monthlyBreakdown = [
    { month: 'January 2024', revenue: 45000, expenses: 12000, net: 33000, occupancy: 83.3 },
    { month: 'December 2023', revenue: 42000, expenses: 11000, net: 31000, occupancy: 80.0 },
    { month: 'November 2023', revenue: 41000, expenses: 10500, net: 30500, occupancy: 78.3 },
    { month: 'October 2023', revenue: 43000, expenses: 11500, net: 31500, occupancy: 81.7 },
  ];

  const propertyEarnings = [
    {
      id: 1,
      property: '123 Main St',
      unit: 'Apt 2B',
      tenant: 'John Smith',
      rent: 2500,
      status: 'paid',
      dueDate: '2024-01-01',
      paidDate: '2024-01-01',
    },
    {
      id: 2,
      property: '456 Oak Ave',
      unit: 'Apt 1A',
      tenant: 'Sarah Johnson',
      rent: 3200,
      status: 'paid',
      dueDate: '2024-01-01',
      paidDate: '2024-01-02',
    },
    {
      id: 3,
      property: '789 Pine St',
      unit: 'Apt 3C',
      tenant: 'Mike Davis',
      rent: 2800,
      status: 'overdue',
      dueDate: '2024-01-01',
      paidDate: null,
    },
    {
      id: 4,
      property: '321 Elm St',
      unit: 'Apt 2A',
      tenant: 'Lisa Wilson',
      rent: 3500,
      status: 'paid',
      dueDate: '2024-01-01',
      paidDate: '2024-01-01',
    },
  ];

  const expenses = [
    { category: 'Maintenance', amount: 4500, percentage: 37.5 },
    { category: 'Property Management', amount: 3600, percentage: 30.0 },
    { category: 'Insurance', amount: 1800, percentage: 15.0 },
    { category: 'Utilities', amount: 1200, percentage: 10.0 },
    { category: 'Marketing', amount: 900, percentage: 7.5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getChangeIcon = (current: number, previous: number) => {
    return current > previous ? <TrendingUpIcon sx={{ color: brandColors.accent.success }} /> : <TrendingDownIcon sx={{ color: brandColors.accent.error }} />;
  };

  const getChangeColor = (current: number, previous: number) => {
    return current > previous ? brandColors.accent.success : brandColors.accent.error;
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+change.toFixed(1)%` : `${change.toFixed(1)}%`;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Earnings & Financials
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              label="Time Period"
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Property</InputLabel>
            <Select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              label="Property"
            >
              <MenuItem value="all">All Properties</MenuItem>
              <MenuItem value="123-main">123 Main St</MenuItem>
              <MenuItem value="456-oak">456 Oak Ave</MenuItem>
              <MenuItem value="789-pine">789 Pine St</MenuItem>
              <MenuItem value="321-elm">321 Elm St</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.success, mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    earningsData.totalRevenue.toLocaleString()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getChangeIcon(earningsData.totalRevenue, earningsData.previousMonth.totalRevenue)}
                <Typography
                  variant="caption"
                  sx={{ color: getChangeColor(earningsData.totalRevenue, earningsData.previousMonth.totalRevenue) }}
                >
                  {calculateChange(earningsData.totalRevenue, earningsData.previousMonth.totalRevenue)} from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.warning, mr: 2 }}>
                  <ReceiptIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    earningsData.totalExpenses.toLocaleString()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getChangeIcon(earningsData.totalExpenses, earningsData.previousMonth.totalExpenses)}
                <Typography
                  variant="caption"
                  sx={{ color: getChangeColor(earningsData.totalExpenses, earningsData.previousMonth.totalExpenses) }}
                >
                  {calculateChange(earningsData.totalExpenses, earningsData.previousMonth.totalExpenses)} from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.primary, mr: 2 }}>
                  <BankIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    earningsData.netIncome.toLocaleString()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Net Income
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getChangeIcon(earningsData.netIncome, earningsData.previousMonth.netIncome)}
                <Typography
                  variant="caption"
                  sx={{ color: getChangeColor(earningsData.netIncome, earningsData.previousMonth.netIncome) }}
                >
                  {calculateChange(earningsData.netIncome, earningsData.previousMonth.netIncome)} from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.info, mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {earningsData.occupancyRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Occupancy Rate
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Average rent: earningsData.averageRent.toLocaleString()
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Rent Collection */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Rent Collection
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Tenant</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Paid Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {propertyEarnings.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {row.property}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.unit}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.tenant}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            row.rent.toLocaleString()
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={getStatusColor(row.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(row.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {row.paidDate ? new Date(row.paidDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Breakdown */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Expense Breakdown
              </Typography>
              {expenses.map((expense, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{expense.category}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      expense.amount.toLocaleString()
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, backgroundColor: brandColors.neutral[300], borderRadius: 4 }}>
                    <Box
                      sx={{
                        width: `${expense.percentage}%`,
                        height: '100%',
                        backgroundColor: brandColors.primary,
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {expense.percentage}% of total expenses
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageEarnings;
