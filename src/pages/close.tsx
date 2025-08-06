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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
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
  ListItemText,
  Checkbox
} from '@mui/material';
import { 
  Handshake as HandshakeIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccountBalance as BankIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const ClosingCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TimelineCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockClosingTransactions = [
  {
    id: 1,
    propertyAddress: "123 Main St, City, State",
    buyer: "John Smith",
    seller: "Sarah Johnson",
    closingDate: "2024-01-15",
    status: "Scheduled",
    documents: ["Purchase Agreement", "Title Report", "Loan Documents"],
    checklist: ["Title Search", "Insurance", "Final Walkthrough"],
    timeline: "2 days remaining"
  },
  {
    id: 2,
    propertyAddress: "456 Oak Ave, City, State",
    buyer: "Mike Davis",
    seller: "Lisa Wilson",
    closingDate: "2024-01-12",
    status: "Completed",
    documents: ["Purchase Agreement", "Title Report", "Loan Documents", "Settlement Statement"],
    checklist: ["Title Search", "Insurance", "Final Walkthrough", "Funds Transfer"],
    timeline: "Completed"
  },
  {
    id: 3,
    propertyAddress: "789 Pine Rd, City, State",
    buyer: "Alex Brown",
    seller: "David Miller",
    closingDate: "2024-01-20",
    status: "In Progress",
    documents: ["Purchase Agreement", "Title Report"],
    checklist: ["Title Search", "Insurance"],
    timeline: "7 days remaining"
  }
];

const mockClosingChecklist = [
  { item: "Title Search Completed", completed: true, required: true },
  { item: "Property Insurance Secured", completed: true, required: true },
  { item: "Final Walkthrough Scheduled", completed: false, required: true },
  { item: "Loan Documents Prepared", completed: true, required: true },
  { item: "Settlement Statement Ready", completed: false, required: true },
  { item: "Funds Transfer Arranged", completed: false, required: true },
  { item: "Recording Documents Prepared", completed: false, required: true },
  { item: "Keys and Possession Arranged", completed: false, required: true }
];

const mockClosingCosts = [
  { item: "Loan Origination Fee", amount: 1500, paid: true },
  { item: "Appraisal Fee", amount: 450, paid: true },
  { item: "Title Insurance", amount: 1200, paid: false },
  { item: "Recording Fees", amount: 150, paid: false },
  { item: "Transfer Taxes", amount: 3200, paid: false },
  { item: "Escrow Account", amount: 2400, paid: false }
];

const ClosePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [closingStep, setClosingStep] = useState(0);

  const closingSteps = [
    {
      label: 'Pre-Closing Review',
      description: 'Review all documents and ensure readiness for closing',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Verify all required documents are prepared and parties are ready for closing.
          </Typography>
          <List>
            {mockClosingChecklist.slice(0, 4).map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Checkbox checked={item.completed} disabled />
                </ListItemIcon>
                <ListItemText 
                  primary={item.item}
                  secondary={item.required ? "Required" : "Optional"}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )
    },
    {
      label: 'Closing Day Preparation',
      description: 'Final preparations for closing day',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Ensure all parties, documents, and funds are ready for closing.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Party Information
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Buyer: John Smith<br/>
                    Seller: Sarah Johnson<br/>
                    Agent: Dreamery Real Estate<br/>
                    Attorney: Smith & Associates
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Closing Details
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Date: January 15, 2024<br/>
                    Time: 2:00 PM<br/>
                    Location: Dreamery Title Company<br/>
                    Duration: ~2 hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Document Signing',
      description: 'Execute all closing documents',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            All parties will sign the necessary documents to complete the transaction.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Digital signing available for remote closings
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Required Documents
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><DocumentIcon /></ListItemIcon>
                      <ListItemText primary="Purchase Agreement" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DocumentIcon /></ListItemIcon>
                      <ListItemText primary="Loan Documents" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DocumentIcon /></ListItemIcon>
                      <ListItemText primary="Settlement Statement" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DocumentIcon /></ListItemIcon>
                      <ListItemText primary="Title Transfer Documents" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Schedule
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Down Payment: $60,000<br/>
                    Closing Costs: $6,900<br/>
                    Total Due: $66,900<br/>
                    Payment Method: Wire Transfer
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Funds Transfer & Recording',
      description: 'Complete funds transfer and record the transaction',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Transfer funds and record the transaction with the county.
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            All funds have been transferred successfully
          </Alert>
          <Button variant="contained" color="success" startIcon={<CheckIcon />}>
            Complete Closing
          </Button>
        </Box>
      )
    }
  ];

  return (
    <PageTemplate 
      title="Transaction Closing" 
      subtitle="Manage property closings and ensure smooth transactions"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Active Closings" />
          <Tab label="Closing Process" />
          <Tab label="Documents" />
          <Tab label="Costs & Payments" />
        </Tabs>
      </Box>

      {/* Active Closings Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Active Closing Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Monitor and manage upcoming and active property closings.
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell align="center">Closing Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Timeline</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockClosingTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {transaction.propertyAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.buyer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.seller}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {transaction.closingDate}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={transaction.status} 
                        color={
                          transaction.status === 'Completed' ? 'success' : 
                          transaction.status === 'Scheduled' ? 'primary' : 
                          'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {transaction.timeline}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Closing Process Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Closing Process
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Step-by-step closing workflow to ensure smooth transactions.
          </Typography>

          <Stepper activeStep={closingStep} orientation="vertical">
            {closingSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {step.description}
                  </Typography>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setClosingStep((prev) => prev + 1)}
                      sx={{ mr: 1 }}
                      disabled={closingStep === closingSteps.length - 1}
                    >
                      {closingStep === closingSteps.length - 1 ? 'Complete' : 'Continue'}
                    </Button>
                    <Button
                      disabled={closingStep === 0}
                      onClick={() => setClosingStep((prev) => prev - 1)}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Documents Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Closing Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track and manage all documents required for closing.
                </Typography>

                <List>
                  {mockClosingChecklist.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Checkbox checked={item.completed} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.item}
                        secondary={item.required ? "Required" : "Optional"}
                      />
                      <Chip 
                        label={item.completed ? "Complete" : "Pending"} 
                        color={item.completed ? "success" : "warning"}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 3 }}>
                  <Button variant="contained" startIcon={<DocumentIcon />}>
                    Upload Documents
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <TimelineCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Closing Timeline
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Pre-Closing:</strong> 5 days before
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Final Walkthrough:</strong> 1 day before
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Closing Day:</strong> January 15, 2024
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Recording:</strong> Same day
                  </Typography>
                  <Typography variant="body2">
                    <strong>Possession:</strong> After recording
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  75% Complete
                </Typography>
              </CardContent>
            </TimelineCard>
          </Grid>
        </Grid>
      )}

      {/* Costs & Payments Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Closing Costs & Payments
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Track closing costs and payment status.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockClosingCosts.map((cost, index) => (
                      <TableRow key={index}>
                        <TableCell>{cost.item}</TableCell>
                        <TableCell align="right">${cost.amount.toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={cost.paid ? "Paid" : "Pending"} 
                            color={cost.paid ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            {cost.paid ? "View Receipt" : "Pay Now"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Summary
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Total Costs: $7,900
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Paid: $1,950
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Remaining: $5,950
                    </Typography>
                    <Typography variant="body2">
                      Due Date: January 15, 2024
                    </Typography>
                  </Box>
                  <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                    Make Payment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Placeholder Closing Cards */}
        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Closing Transactions
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`close-placeholder-${index}`}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Closing+${index + 1}`}
                  alt={`Closing ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                    Closing #{index + 1}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                    ${(425000 + index * 55000).toLocaleString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: '#718096', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Phoenix, AZ', 'Portland, OR', 'Nashville, TN'][index]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {(15 + index)} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        ${(8000 + index * 500)} fees
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {(85 + index)}% complete
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#1a365d',
                      '&:hover': { backgroundColor: '#0d2340' }
                    }}
                  >
                    View Closing
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageTemplate>
  );
};

export default ClosePage; 