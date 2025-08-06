import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Slider,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  Calculate as CalculateIcon,
  AccountBalance as BankIcon,
  TrendingUp as RateIcon,
  Description as ApplicationIcon,
  Compare as CompareIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const CalculatorCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const ResultCard = styled(Card)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RateCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const mockRates = [
  {
    lender: "Dreamery Bank",
    rate: "3.25%",
    apr: "3.45%",
    monthlyPayment: "$1,234",
    points: 0,
    featured: true
  },
  {
    lender: "City National",
    rate: "3.35%",
    apr: "3.52%",
    monthlyPayment: "$1,245",
    points: 0,
    featured: false
  },
  {
    lender: "Metro Credit Union",
    rate: "3.15%",
    apr: "3.38%",
    monthlyPayment: "$1,220",
    points: 0.5,
    featured: false
  },
  {
    lender: "Premier Mortgage",
    rate: "3.45%",
    apr: "3.58%",
    monthlyPayment: "$1,260",
    points: 0,
    featured: false
  }
];

const MortgagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loanAmount, setLoanAmount] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(3.25);
  const [loanTerm, setLoanTerm] = useState(30);

  const propertyValue = loanAmount + downPayment;
  const loanToValue = (loanAmount / propertyValue) * 100;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
  const totalPayment = monthlyPayment * (loanTerm * 12);
  const totalInterest = totalPayment - loanAmount;

  function calculateMonthlyPayment(principal: number, rate: number, years: number) {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const handleLoanAmountChange = (event: Event, newValue: number | number[]) => {
    setLoanAmount(newValue as number);
  };

  const handleDownPaymentChange = (event: Event, newValue: number | number[]) => {
    setDownPayment(newValue as number);
  };

  const handleInterestRateChange = (event: Event, newValue: number | number[]) => {
    setInterestRate(newValue as number);
  };

  const handleLoanTermChange = (event: Event, newValue: number | number[]) => {
    setLoanTerm(newValue as number);
  };

  return (
    <PageTemplate 
      title="Mortgage Solutions" 
      subtitle="Find the perfect mortgage for your dream home"
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Loan Calculator" />
          <Tab label="Current Rates" />
          <Tab label="Apply Now" />
          <Tab label="My Applications" />
        </Tabs>
      </Box>

      {/* Loan Calculator Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CalculatorCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mortgage Calculator
                </Typography>
                <Typography variant="body2" paragraph>
                  Adjust the sliders to see how different factors affect your monthly payment.
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Property Value: ${propertyValue.toLocaleString()}
                  </Typography>
                  <Slider
                    value={propertyValue}
                    onChange={(e, newValue) => {
                      const newPropertyValue = newValue as number;
                      setLoanAmount(newPropertyValue - downPayment);
                    }}
                    min={100000}
                    max={1000000}
                    step={10000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Down Payment: ${downPayment.toLocaleString()} ({((downPayment / propertyValue) * 100).toFixed(1)}%)
                  </Typography>
                  <Slider
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                    min={0}
                    max={propertyValue}
                    step={5000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Interest Rate: {interestRate}%
                  </Typography>
                  <Slider
                    value={interestRate}
                    onChange={handleInterestRateChange}
                    min={2.5}
                    max={6.0}
                    step={0.05}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Loan Term: {loanTerm} years
                  </Typography>
                  <Slider
                    value={loanTerm}
                    onChange={handleLoanTermChange}
                    min={15}
                    max={30}
                    step={5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} years`}
                  />
                </Box>
              </CardContent>
            </CalculatorCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ResultCard>
              <Typography variant="h6" gutterBottom>
                Payment Breakdown
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Payment
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#1a365d', fontWeight: 'bold' }}>
                    ${monthlyPayment.toFixed(0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Loan Amount
                  </Typography>
                  <Typography variant="h6">
                    ${loanAmount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Interest
                  </Typography>
                  <Typography variant="h6">
                    ${totalInterest.toFixed(0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Payment
                  </Typography>
                  <Typography variant="h6">
                    ${totalPayment.toFixed(0)}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  Loan-to-Value Ratio: {loanToValue.toFixed(1)}%
                  {loanToValue > 80 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Note: You may need Private Mortgage Insurance (PMI) for LTV > 80%
                    </Typography>
                  )}
                </Alert>
              </Box>
            </ResultCard>
          </Grid>
        </Grid>
      )}

      {/* Current Rates Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Today's Best Mortgage Rates
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Rates are updated daily. All rates assume excellent credit (740+) and 20% down payment.
          </Typography>

          <Grid container spacing={3}>
            {mockRates.map((rate, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <RateCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {rate.lender}
                      </Typography>
                      {rate.featured && (
                        <Typography variant="caption" sx={{ color: '#1a365d', fontWeight: 'bold' }}>
                          FEATURED
                        </Typography>
                      )}
                    </Box>
                    
                    <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 'bold', mb: 1 }}>
                      {rate.rate}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      APR: {rate.apr}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom>
                      ${rate.monthlyPayment}/month
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Points: {rate.points}
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      startIcon={<CompareIcon />}
                    >
                      Compare
                    </Button>
                  </CardContent>
                </RateCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Apply Now Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Start Your Mortgage Application
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Complete this form to begin your mortgage application process. We'll guide you through each step.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Social Security Number"
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Property Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Property Address"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Purchase Price"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Down Payment"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Loan Type</InputLabel>
                        <Select label="Loan Type">
                          <MenuItem value="conventional">Conventional</MenuItem>
                          <MenuItem value="fha">FHA</MenuItem>
                          <MenuItem value="va">VA</MenuItem>
                          <MenuItem value="usda">USDA</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<ApplicationIcon />}
            >
              Submit Application
            </Button>
          </Box>
        </Box>
      )}

      {/* My Applications Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Mortgage Applications
          </Typography>
          <Alert severity="info">
            You don't have any mortgage applications yet. Start your first application above!
          </Alert>
        </Box>
      )}
    </PageTemplate>
  );
};

export default MortgagePage; 