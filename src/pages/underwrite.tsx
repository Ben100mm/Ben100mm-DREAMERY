import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Rating
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Timeline as TimelineIcon,
  Description as DocumentIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  AccountBalance as BankIcon,
  LocationOn
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';
import { brandColors } from "../theme";


const RiskCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px brandColors.shadows.medium;
  }
`;

const ApprovalCard = styled(Card)`
  background: linear-gradient(135deg, brandColors.primary 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockLoanApplications = [
  {
    id: 1,
    applicant: "John Smith",
    propertyAddress: "123 Main St, City, State",
    loanAmount: "$350,000",
    creditScore: 750,
    debtToIncome: 0.32,
    loanToValue: 0.75,
    status: "Under Review",
    riskScore: 85,
    documents: ["Income Verification", "Bank Statements", "Tax Returns"],
    timeline: "2-3 business days"
  },
  {
    id: 2,
    applicant: "Sarah Johnson",
    propertyAddress: "456 Oak Ave, City, State",
    loanAmount: "$420,000",
    creditScore: 720,
    debtToIncome: 0.28,
    loanToValue: 0.80,
    status: "Approved",
    riskScore: 92,
    documents: ["Income Verification", "Bank Statements", "Tax Returns", "Appraisal"],
    timeline: "Completed"
  },
  {
    id: 3,
    applicant: "Mike Davis",
    propertyAddress: "789 Pine Rd, City, State",
    loanAmount: "$280,000",
    creditScore: 680,
    debtToIncome: 0.45,
    loanToValue: 0.85,
    status: "Pending Documents",
    riskScore: 65,
    documents: ["Income Verification"],
    timeline: "Waiting for documents"
  }
];

const mockRiskFactors = [
  { factor: "Credit Score", weight: 30, score: 85, status: "Good" },
  { factor: "Debt-to-Income Ratio", weight: 25, score: 78, status: "Good" },
  { factor: "Loan-to-Value Ratio", weight: 20, score: 82, status: "Good" },
  { factor: "Employment History", weight: 15, score: 90, status: "Excellent" },
  { factor: "Property Type", weight: 10, score: 75, status: "Acceptable" }
];

const UnderwritePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [underwritingStep, setUnderwritingStep] = useState(0);

  const underwritingSteps = [
    {
      label: 'Initial Review',
      description: 'Review application completeness and basic eligibility',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Verify all required documents are submitted and application meets basic criteria.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Application appears complete and meets initial requirements.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Risk Assessment',
      description: 'Evaluate credit, income, and property risk factors',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Analyze credit score, debt-to-income ratio, and loan-to-value ratio.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {mockRiskFactors.map((factor, index) => (
              <Card key={index}>
                <CardContent>
                  <Typography variant="h6">{factor.factor}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={factor.score / 20} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {factor.score}/100
                    </Typography>
                  </Box>
                  <Chip 
                    label={factor.status} 
                    color={factor.status === 'Excellent' ? 'success' : factor.status === 'Good' ? 'primary' : 'warning'}
                    size="small"
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )
    },
    {
      label: 'Property Evaluation',
      description: 'Review property appraisal and market analysis',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Evaluate property value, condition, and market position.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Property Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  Estimated Value: $450,000<br/>
                  Appraised Value: $445,000<br/>
                  Market Position: Strong<br/>
                  Property Condition: Good
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  Market Trend: +3.2%<br/>
                  Days on Market: 45<br/>
                  Comparable Sales: 12<br/>
                  Market Confidence: High
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )
    },
    {
      label: 'Final Decision',
      description: 'Make approval decision and set terms',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Review all factors and make final underwriting decision.
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Application meets all underwriting criteria. Recommended for approval.
          </Alert>
          <Button variant="contained" color="success" startIcon={<CheckIcon />}>
            Approve Application
          </Button>
        </Box>
      )
    }
  ];

  return (
    <PageTemplate 
      title="Loan Underwriting" 
      subtitle="Comprehensive loan evaluation and risk assessment tools"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Applications" />
          <Tab label="Underwriting Process" />
          <Tab label="Risk Assessment" />
          <Tab label="Approvals" />
        </Tabs>
      </Box>

      {/* Applications Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Loan Applications
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Review and process loan applications through the underwriting pipeline.
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell align="right">Loan Amount</TableCell>
                  <TableCell align="right">Credit Score</TableCell>
                  <TableCell align="right">Risk Score</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLoanApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {application.applicant}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          DTI: {(application.debtToIncome * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {application.propertyAddress}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {application.loanAmount}
                    </TableCell>
                    <TableCell align="right">
                      {application.creditScore}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {application.riskScore}
                        </Typography>
                        <Rating value={application.riskScore / 20} readOnly size="small" />
                      </Box>
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
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => setSelectedApplication(application)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Underwriting Process Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Underwriting Process
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Step-by-step underwriting workflow for loan evaluation.
          </Typography>

          <Stepper activeStep={underwritingStep} orientation="vertical">
            {underwritingSteps.map((step, index) => (
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
                      onClick={() => setUnderwritingStep((prev) => prev + 1)}
                      sx={{ mr: 1 }}
                      disabled={underwritingStep === underwritingSteps.length - 1}
                    >
                      {underwritingStep === underwritingSteps.length - 1 ? 'Complete' : 'Continue'}
                    </Button>
                    <Button
                      disabled={underwritingStep === 0}
                      onClick={() => setUnderwritingStep((prev) => prev - 1)}
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

      {/* Risk Assessment Tab */}
      {activeTab === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Assessment Dashboard
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {mockRiskFactors.map((factor, index) => (
                    <RiskCard key={index}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            {factor.factor}
                          </Typography>
                          <Chip 
                            label={factor.status} 
                            color={
                              factor.status === 'Excellent' ? 'success' : 
                              factor.status === 'Good' ? 'primary' : 
                              'warning'
                            }
                            size="small"
                          />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Weight: {factor.weight}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={factor.score} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Score: {factor.score}/100
                          </Typography>
                        </Box>
                      </CardContent>
                    </RiskCard>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
            <ApprovalCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Risk Score
                </Typography>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  85/100
                </Typography>
                <Rating value={4.25} readOnly size="large" sx={{ mb: 2 }} />
                <Typography variant="body2" paragraph>
                  This application presents moderate risk with strong compensating factors.
                </Typography>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Recommended for approval with standard terms
                </Alert>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Generate Report
                </Button>
              </CardContent>
            </ApprovalCard>
          </Box>
        </Box>
      )}

      {/* Approvals Tab */}
      {activeTab === 3 && (
        <>
          <Box>
            <Typography variant="h6" gutterBottom>
              Approval Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved This Month
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Review
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="h4" sx={{ color: brandColors.accent.error }}>
                    1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Declined This Month
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Placeholder Underwriting Cards */}
          <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700, mb: 3, mt: 4 }}>
            Featured Underwriting Applications
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {Array.from({ length: 10 }, (_, index) => (
              <Card key={`underwrite-placeholder-${index}`} sx={{ 
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
                    image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Application+${index + 1}`}
                    alt={`Application ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ color: brandColors.primary, fontWeight: 600, mb: 1 }}>
                      Application #{index + 1}
                    </Typography>
                    
                    <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                      (350000 + index * 45000).toLocaleString()
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
                          {(720 + index * 15)} credit score
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {(25 + index * 2)}% DTI
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {(15 + index)}% down
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: brandColors.primary,
                        '&:hover': { backgroundColor: brandColors.primaryDark }
                      }}
                    >
                      Review Application
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
    </PageTemplate>
  );
};

export default UnderwritePage; 