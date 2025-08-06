import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Box,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Rating
} from '@mui/material';
import { 
  TrendingUp as TrendingIcon,
  AccountBalance as AccountIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const InvestmentCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PortfolioCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockInvestmentOpportunities = [
  {
    id: 1,
    title: "Downtown Mixed-Use Development",
    location: "Downtown, City Center",
    type: "Commercial",
    investmentAmount: "$500,000",
    expectedReturn: "12.5%",
    term: "5 years",
    riskLevel: "Medium",
    status: "Open",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    description: "Prime downtown location with retail and residential units"
  },
  {
    id: 2,
    title: "Suburban Rental Portfolio",
    location: "Suburban Heights",
    type: "Residential",
    investmentAmount: "$250,000",
    expectedReturn: "8.2%",
    term: "3 years",
    riskLevel: "Low",
    status: "Open",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    description: "Stable rental income from suburban properties"
  },
  {
    id: 3,
    title: "Industrial Warehouse Fund",
    location: "Industrial District",
    type: "Industrial",
    investmentAmount: "$750,000",
    expectedReturn: "15.3%",
    term: "7 years",
    riskLevel: "High",
    status: "Limited",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
    description: "High-growth industrial real estate opportunity"
  },
  {
    id: 4,
    title: "Student Housing Investment",
    location: "University District",
    type: "Residential",
    investmentAmount: "$300,000",
    expectedReturn: "10.1%",
    term: "4 years",
    riskLevel: "Medium",
    status: "Open",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    description: "Student housing with consistent demand"
  }
];

const mockPortfolio = [
  {
    id: 1,
    name: "Downtown Office Building",
    value: "$1,200,000",
    return: "+8.5%",
    monthlyIncome: "$8,500",
    type: "Commercial"
  },
  {
    id: 2,
    name: "Suburban Rental Properties",
    value: "$850,000",
    return: "+6.2%",
    monthlyIncome: "$5,200",
    type: "Residential"
  },
  {
    id: 3,
    name: "Industrial Warehouse",
    value: "$2,100,000",
    return: "+12.1%",
    monthlyIncome: "$15,800",
    type: "Industrial"
  }
];

const mockPerformanceData = {
  totalValue: "$4,150,000",
  totalReturn: "+9.2%",
  monthlyIncome: "$29,500",
  annualizedReturn: "11.3%",
  portfolioGrowth: "+15.4%"
};

const InvestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  return (
    <PageTemplate 
      title="Investment Opportunities" 
      subtitle="Discover and manage real estate investment opportunities"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Opportunities" />
          <Tab label="My Portfolio" />
          <Tab label="Performance" />
          <Tab label="Investment Tools" />
        </Tabs>
      </Box>

      {/* Opportunities Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Investment Opportunities
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Browse curated real estate investment opportunities with detailed analysis.
          </Typography>

          <Grid container spacing={3}>
            {mockInvestmentOpportunities.map((opportunity) => (
              <Grid item xs={12} md={6} lg={3} key={opportunity.id}>
                <InvestmentCard>
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={opportunity.image} 
                      alt={opportunity.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <Chip 
                      label={opportunity.status} 
                      color={opportunity.status === 'Open' ? 'success' : 'warning'}
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {opportunity.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {opportunity.description}
                    </Typography>
                    
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Investment
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {opportunity.investmentAmount}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Expected Return
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#4caf50' }}>
                          {opportunity.expectedReturn}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Term
                        </Typography>
                        <Typography variant="body2">
                          {opportunity.term}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Risk Level
                        </Typography>
                        <Chip 
                          label={opportunity.riskLevel} 
                          color={
                            opportunity.riskLevel === 'Low' ? 'success' : 
                            opportunity.riskLevel === 'Medium' ? 'warning' : 
                            'error'
                          }
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={opportunity.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({opportunity.rating})
                      </Typography>
                    </Box>

                    <Button variant="contained" fullWidth>
                      View Details
                    </Button>
                  </CardContent>
                </InvestmentCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* My Portfolio Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Investment Portfolio
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track your real estate investments and performance.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Investment</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Current Value</TableCell>
                        <TableCell align="right">Return</TableCell>
                        <TableCell align="right">Monthly Income</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockPortfolio.map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {investment.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={investment.type} 
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {investment.value}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ color: '#4caf50' }}>
                              {investment.return}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {investment.monthlyIncome}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button size="small" variant="outlined">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <PortfolioCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Total Value: <strong>{mockPerformanceData.totalValue}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Total Return: <strong style={{ color: '#4caf50' }}>{mockPerformanceData.totalReturn}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Monthly Income: <strong>{mockPerformanceData.monthlyIncome}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Annualized Return: <strong>{mockPerformanceData.annualizedReturn}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Portfolio Growth: <strong style={{ color: '#4caf50' }}>{mockPerformanceData.portfolioGrowth}</strong>
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  View Detailed Report
                </Button>
              </CardContent>
            </PortfolioCard>
          </Grid>
        </Grid>
      )}

      {/* Performance Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        11.3%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Annualized Return
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        15.4%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Portfolio Growth
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        $29.5K
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Income
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        8.2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Risk Score
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Insights
                </Typography>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Your portfolio is outperforming the market average by 2.3%
                </Alert>
                <Typography variant="body2" paragraph>
                  Your real estate investments are showing strong performance with 
                  consistent cash flow and appreciation. Consider diversifying into 
                  new markets for additional growth opportunities.
                </Typography>
                <Button variant="outlined" startIcon={<AssessmentIcon />}>
                  Get Investment Analysis
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Investment Tools Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Calculator
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Calculate potential returns and cash flow for real estate investments.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Purchase Price"
                      type="number"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Down Payment"
                      type="number"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Monthly Rent"
                      type="number"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Interest Rate"
                      type="number"
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Calculate Returns
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Get insights into market trends and investment opportunities.
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Market Trend:</strong> +3.2% annually
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Average Cap Rate:</strong> 5.8%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Days on Market:</strong> 45
                  </Typography>
                  <Typography variant="body2">
                    <strong>Inventory Level:</strong> Low
                  </Typography>
                </Box>

                <Button variant="outlined" fullWidth>
                  View Market Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </PageTemplate>
  );
};

export default InvestPage; 