import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Slider,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const MortgagePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loanAmount, setLoanAmount] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const calculateMonthlyPayment = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPayment - (loanAmount - downPayment);

  const mockRates = [
    { lender: 'Dreamery Bank', rate: 4.25, apr: 4.35, points: 0, monthly: 1234 },
    { lender: 'City Mortgage', rate: 4.50, apr: 4.60, points: 0, monthly: 1268 },
    { lender: 'Home Finance', rate: 4.75, apr: 4.85, points: 0.5, monthly: 1302 },
    { lender: 'National Lending', rate: 4.00, apr: 4.10, points: 1, monthly: 1200 },
    { lender: 'Community Bank', rate: 4.35, apr: 4.45, points: 0, monthly: 1245 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleApply = () => {
    setSnackbar({ open: true, message: 'Mortgage application submitted successfully!' });
  };

  return (
    <PageTemplate title="Mortgage Solutions" subtitle="Find the perfect mortgage for your dream home">
      <Box>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Loan Calculator" />
          <Tab label="Current Rates" />
          <Tab label="Apply Now" />
          <Tab label="My Applications" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Loan Calculator
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Loan Amount: {formatCurrency(loanAmount)}</Typography>
                    <Slider
                      value={loanAmount}
                      onChange={(_, value) => setLoanAmount(value as number)}
                      min={50000}
                      max={1000000}
                      step={10000}
                      valueLabelDisplay="auto"
                      valueLabelFormat={formatCurrency}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Down Payment: {formatCurrency(downPayment)}</Typography>
                    <Slider
                      value={downPayment}
                      onChange={(_, value) => setDownPayment(value as number)}
                      min={0}
                      max={loanAmount}
                      step={5000}
                      valueLabelDisplay="auto"
                      valueLabelFormat={formatCurrency}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Interest Rate: {interestRate}%</Typography>
                    <Slider
                      value={interestRate}
                      onChange={(_, value) => setInterestRate(value as number)}
                      min={2}
                      max={8}
                      step={0.1}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Loan Term: {loanTerm} years</Typography>
                    <Slider
                      value={loanTerm}
                      onChange={(_, value) => setLoanTerm(value as number)}
                      min={15}
                      max={30}
                      step={5}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    Payment Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700 }}>
                      {formatCurrency(monthlyPayment)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Payment
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Principal & Interest:</Typography>
                    <Typography>{formatCurrency(monthlyPayment)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Property Tax (est.):</Typography>
                    <Typography>{formatCurrency(monthlyPayment * 0.2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Insurance (est.):</Typography>
                    <Typography>{formatCurrency(monthlyPayment * 0.1)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total Monthly:</Typography>
                    <Typography variant="h6">{formatCurrency(monthlyPayment * 1.3)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Total Interest:</Typography>
                    <Typography>{formatCurrency(totalInterest)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Total Payment:</Typography>
                    <Typography>{formatCurrency(totalPayment)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Current Mortgage Rates
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Lender</TableCell>
                      <TableCell align="right">Rate</TableCell>
                      <TableCell align="right">APR</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell align="right">Monthly Payment</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockRates.map((rate, index) => (
                      <TableRow key={index}>
                        <TableCell>{rate.lender}</TableCell>
                        <TableCell align="right">{rate.rate}%</TableCell>
                        <TableCell align="right">{rate.apr}%</TableCell>
                        <TableCell align="right">{rate.points}</TableCell>
                        <TableCell align="right">{formatCurrency(rate.monthly)}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleApply}
                            sx={{ backgroundColor: '#1a365d' }}
                          >
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mortgage Application
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Annual Income"
                    type="number"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Down Payment Amount"
                    type="number"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Loan Type</InputLabel>
                    <Select label="Loan Type">
                      <MenuItem value="conventional">Conventional</MenuItem>
                      <MenuItem value="fha">FHA</MenuItem>
                      <MenuItem value="va">VA</MenuItem>
                      <MenuItem value="usda">USDA</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Property Type</InputLabel>
                    <Select label="Property Type">
                      <MenuItem value="primary">Primary Residence</MenuItem>
                      <MenuItem value="secondary">Secondary Home</MenuItem>
                      <MenuItem value="investment">Investment Property</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleApply}
                  sx={{ backgroundColor: '#1a365d' }}
                >
                  Submit Application
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {tabValue === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              My Applications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No applications submitted yet. Apply for a mortgage to see them here.
            </Typography>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </PageTemplate>
  );
};

export default MortgagePage; 