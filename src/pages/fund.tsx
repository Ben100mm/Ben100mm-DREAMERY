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
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  AccountBalance as BankIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  Percent as PercentIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const FundingCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ApplicationCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockFundingSources = [
  {
    id: 1,
    name: "Dreamery Bank",
    type: "Traditional Bank",
    minAmount: "$50,000",
    maxAmount: "$2,000,000",
    interestRate: "4.25%",
    term: "5-30 years",
    requirements: ["Good Credit", "20% Down", "Income Verification"],
    status: "Available",
    approvalTime: "2-3 weeks"
  },
  {
    id: 2,
    name: "City National Credit Union",
    type: "Credit Union",
    minAmount: "$25,000",
    maxAmount: "$1,500,000",
    interestRate: "4.15%",
    term: "3-25 years",
    requirements: ["Member", "Good Credit", "15% Down"],
    status: "Available",
    approvalTime: "3-4 weeks"
  },
  {
    id: 3,
    name: "Metro Investment Fund",
    type: "Private Lender",
    minAmount: "$100,000",
    maxAmount: "$5,000,000",
    interestRate: "6.50%",
    term: "1-5 years",
    requirements: ["High Net Worth", "Property Collateral", "Business Plan"],
    status: "Limited",
    approvalTime: "1-2 weeks"
  },
  {
    id: 4,
    name: "Premier Mortgage Group",
    type: "Mortgage Company",
    minAmount: "$75,000",
    maxAmount: "$3,000,000",
    interestRate: "4.75%",
    term: "10-30 years",
    requirements: ["Good Credit", "25% Down", "Property Appraisal"],
    status: "Available",
    approvalTime: "2-4 weeks"
  }
];

const mockLoanApplications = [
  {
    id: 1,
    property: "123 Main St, City, State",
    amount: "$350,000",
    lender: "Dreamery Bank",
    status: "Under Review",
    submittedDate: "2024-01-10",
    expectedDecision: "2024-01-25",
    progress: 65
  },
  {
    id: 2,
    property: "456 Oak Ave, City, State",
    amount: "$280,000",
    lender: "City National Credit Union",
    status: "Approved",
    submittedDate: "2024-01-05",
    expectedDecision: "2024-01-20",
    progress: 100
  },
  {
    id: 3,
    property: "789 Pine Rd, City, State",
    amount: "$420,000",
    lender: "Premier Mortgage Group",
    status: "Pending Documents",
    submittedDate: "2024-01-12",
    expectedDecision: "2024-01-30",
    progress: 30
  }
];

const FundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSource, setSelectedSource] = useState<any>(null);

  return (
    <PageTemplate 
      title="Funding Solutions" 
      subtitle="Find the right funding source for your real estate projects"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Funding Sources" />
          <Tab label="My Applications" />
          <Tab label="Loan Calculator" />
          <Tab label="Requirements" />
        </Tabs>
      </Box>

      {/* Funding Sources Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Funding Sources
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Compare different funding options and find the best fit for your project.
          </Typography>

          <Grid container spacing={3}>
            {mockFundingSources.map((source) => (
              <Grid item xs={12} md={6} lg={3} key={source.id}>
                <FundingCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {source.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {source.type}
                        </Typography>
                      </Box>
                      <Chip 
                        label={source.status} 
                        color={source.status === 'Available' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Loan Range:</strong> {source.minAmount} - {source.maxAmount}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Interest Rate:</strong> {source.interestRate}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Term:</strong> {source.term}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Approval Time:</strong> {source.approvalTime}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Requirements:</strong>
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {source.requirements.map((req, index) => (
                        <Chip 
                          key={index}
                          label={req} 
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Button variant="contained" fullWidth>
                      Apply Now
                    </Button>
                  </CardContent>
                </FundingCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* My Applications Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Loan Applications
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track the status of your funding applications.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Lender</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Progress</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockLoanApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {application.property}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {application.lender}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {application.amount}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={application.status} 
                              color={
                                application.status === 'Approved' ? 'success' : 
                                application.status === 'Under Review' ? 'primary' : 
                                'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={application.progress} 
                                sx={{ width: 60, mr: 1 }}
                              />
                              <Typography variant="body2">
                                {application.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Button size="small" variant="outlined">
                              View Details
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
            <ApplicationCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Applications:</strong> 3
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Approved:</strong> 1
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Under Review:</strong> 1
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Pending:</strong> 1
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Requested:</strong> $1,050,000
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  New Application
                </Button>
              </CardContent>
            </ApplicationCard>
          </Grid>
        </Grid>
      )}

      {/* Loan Calculator Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Loan Calculator
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Calculate monthly payments and total costs for different loan scenarios.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Loan Amount"
                      type="number"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Interest Rate (%)"
                      type="number"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Loan Term (years)"
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
                </Grid>

                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Calculate Payment
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Breakdown
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Monthly Payment:</strong> $1,850
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Principal & Interest:</strong> $1,650
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Property Tax:</strong> $150
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Insurance:</strong> $50
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Interest:</strong> $185,000
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Cost:</strong> $485,000
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Requirements Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Funding Requirements
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Understand the requirements for different types of funding.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Traditional Bank Loans
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Credit Score: 680+" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Down Payment: 20% minimum" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Income Verification" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Property Appraisal" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Debt-to-Income Ratio: <43%" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Private Lenders
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Higher Interest Rates" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Faster Approval Process" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Flexible Terms" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                      <ListItemText primary="Higher Down Payment" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                      <ListItemText primary="Shorter Loan Terms" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </PageTemplate>
  );
};

export default FundPage; 