import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Calculate as CalculateIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Support as SupportIcon,
  SmartToy as SmartToyIcon,
  IntegrationInstructions as IntegrationIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

// Import Close feature components
import {
  ClosingDashboard,
  EscrowTitleHub,
  DueDiligenceTools,
  FinancingCoordination,
  LegalCompliance,
  SettlementClosingCosts,
  InsuranceUtilities,
  FinalWalkthroughHandover,
  PostClosingServices,
  AIClosingAssistant,
  PartnerIntegrations,
} from '../components/close';

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 80px;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a87 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
`;

const StyledPaper = styled(Paper)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TabPanel = styled.div`
  padding: 2rem;
  
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const StatusChip = styled(Chip)<{ status: 'active' | 'pending' | 'completed' | 'error' }>`
  background-color: ${({ status }) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'completed': return '#2196f3';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  color: white;
  font-weight: 600;
`;

// Tab interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanelComponent(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`close-tabpanel-${index}`}
      aria-labelledby={`close-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanel>{children}</TabPanel>}
    </div>
  );
}

// Feature categories configuration
const featureCategories = [
  {
    id: 'dashboard',
    name: 'Closing Dashboard',
    icon: <DashboardIcon />,
    description: 'Centralized overview of all closing activities and progress tracking',
    status: 'active' as const,
  },
  {
    id: 'escrow-title',
    name: 'Escrow & Title Hub',
    icon: <SecurityIcon />,
    description: 'Manage escrow accounts, title searches, and title insurance',
    status: 'pending' as const,
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence Tools',
    icon: <SearchIcon />,
    description: 'Comprehensive property and legal research tools',
    status: 'active' as const,
  },
  {
    id: 'financing',
    name: 'Financing Coordination',
    icon: <AccountBalanceIcon />,
    description: 'Coordinate with lenders and manage funding processes',
    status: 'pending' as const,
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: <GavelIcon />,
    description: 'Legal document preparation and regulatory compliance',
    status: 'active' as const,
  },
  {
    id: 'settlement',
    name: 'Settlement & Closing Costs',
    icon: <CalculateIcon />,
    description: 'Calculate and track all closing costs and settlement amounts',
    status: 'completed' as const,
  },
  {
    id: 'insurance',
    name: 'Insurance & Utilities',
    icon: <HomeIcon />,
    description: 'Manage property insurance and utility transfers',
    status: 'pending' as const,
  },
  {
    id: 'walkthrough',
    name: 'Final Walkthrough & Handover',
    icon: <CheckCircleIcon />,
    description: 'Final property inspection and key handover process',
    status: 'pending' as const,
  },
  {
    id: 'post-closing',
    name: 'Post-Closing Services',
    icon: <SupportIcon />,
    description: 'Ongoing support and services after closing',
    status: 'active' as const,
  },
  {
    id: 'ai-assistant',
    name: 'AI-Powered Closing Assistant',
    icon: <SmartToyIcon />,
    description: 'Intelligent assistance for closing processes and decision making',
    status: 'active' as const,
  },
  {
    id: 'integrations',
    name: 'Partner Integrations',
    icon: <IntegrationIcon />,
    description: 'Connect with third-party services and platforms',
    status: 'pending' as const,
  },
];

const ClosePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, userRole } = useAuth();

  useEffect(() => {
    // Initialize closing session data
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ClosingDashboard />;
      case 1:
        return <EscrowTitleHub />;
      case 2:
        return <DueDiligenceTools />;
      case 3:
        return <FinancingCoordination />;
      case 4:
        return <LegalCompliance />;
      case 5:
        return <SettlementClosingCosts />;
      case 6:
        return <InsuranceUtilities />;
      case 7:
        return <FinalWalkthroughHandover />;
      case 8:
        return <PostClosingServices />;
      case 9:
        return <AIClosingAssistant />;
      case 10:
        return <PartnerIntegrations />;
      default:
        return <ClosingDashboard />;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header Section */}
      <HeaderSection>
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Closing Management
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                Streamline your real estate closing process with comprehensive tools and AI-powered assistance
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="flex-end">
                <StatusChip
                  label="Closing Session Active"
                  status="active"
                  size="large"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeaderSection>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        {/* Feature Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {featureCategories.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={feature.id}>
              <FeatureCard
                onClick={() => setActiveTab(index)}
                sx={{
                  border: activeTab === index ? '2px solid #1976d2' : 'none',
                  backgroundColor: activeTab === index ? '#f3f8ff' : 'white',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ color: '#1976d2', mb: 1 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                  <StatusChip
                    label={feature.status}
                    status={feature.status}
                    size="small"
                  />
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* Tabbed Interface */}
        <StyledPaper>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile ? 'auto' : false}
              aria-label="Closing management tabs"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                },
              }}
            >
              {featureCategories.map((feature, index) => (
                <Tab
                  key={feature.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {feature.icon}
                      {!isMobile && feature.name}
                    </Box>
                  }
                  id={`close-tab-${index}`}
                  aria-controls={`close-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          {featureCategories.map((feature, index) => (
            <TabPanelComponent key={feature.id} value={activeTab} index={index}>
              {renderTabContent()}
            </TabPanelComponent>
          ))}
        </StyledPaper>
      </Container>
    </PageContainer>
  );
};

export default ClosePage;
