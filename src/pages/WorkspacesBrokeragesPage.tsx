import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  AppBar,
  Toolbar,
  Drawer,
  List,
  Grid,
  TextField,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Chip,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import { brandColors } from "../theme";
import UnifiedRoleSelector from '../components/UnifiedRoleSelector';
import TemplatesComponent from '../components/TemplatesComponent';
import { RoleContext } from "../context/RoleContext";
import { AGENT_ROLES } from "../data";
import BrokerageMessages from "../components/brokerage/BrokerageMessages";

// Lazy load icons to reduce initial bundle size
const LazyArrowBackIcon = React.lazy(() => import('@mui/icons-material/ArrowBack'));
const LazyNotificationsIcon = React.lazy(() => import('@mui/icons-material/Notifications'));
const LazyMenuIcon = React.lazy(() => import('@mui/icons-material/Menu'));
const LazyDashboardIcon = React.lazy(() => import('@mui/icons-material/Dashboard'));
const LazyBusinessIcon = React.lazy(() => import('@mui/icons-material/Business'));
const LazyPeopleIcon = React.lazy(() => import('@mui/icons-material/People'));
const LazyAssessmentIcon = React.lazy(() => import('@mui/icons-material/Assessment'));
const LazySupportIcon = React.lazy(() => import('@mui/icons-material/Support'));
const LazySettingsIcon = React.lazy(() => import('@mui/icons-material/Settings'));
const LazyIntegrationIcon = React.lazy(() => import('@mui/icons-material/IntegrationInstructions'));
const LazyTrendingUpIcon = React.lazy(() => import('@mui/icons-material/TrendingUp'));
const LazyCheckCircleIcon = React.lazy(() => import('@mui/icons-material/CheckCircle'));
const LazyPersonIcon = React.lazy(() => import('@mui/icons-material/Person'));
const LazyCloseIcon = React.lazy(() => import('@mui/icons-material/Close'));
const LazyEditIcon = React.lazy(() => import('@mui/icons-material/Edit'));
const LazyAddIcon = React.lazy(() => import('@mui/icons-material/Add'));
const LazySearchIcon = React.lazy(() => import('@mui/icons-material/Search'));
const LazyDescriptionIcon = React.lazy(() => import('@mui/icons-material/Description'));
const LazyAssignmentIcon = React.lazy(() => import('@mui/icons-material/Assignment'));
const LazyArchiveIcon = React.lazy(() => import('@mui/icons-material/Archive'));
const LazySecurityIcon = React.lazy(() => import('@mui/icons-material/Security'));
const LazySchoolIcon = React.lazy(() => import('@mui/icons-material/School'));
const LazyMoreVertIcon = React.lazy(() => import('@mui/icons-material/MoreVert'));
const LazySendIcon = React.lazy(() => import('@mui/icons-material/Send'));
const LazyArrowForwardIcon = React.lazy(() => import('@mui/icons-material/ArrowForward'));
const LazyChatIcon = React.lazy(() => import('@mui/icons-material/Chat'));

// Custom Atom Icon Component
const AtomIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx
    }}
  >
    {/* Nucleus */}
    <Box
      sx={{
        width: 8,
        height: 8,
        backgroundColor: brandColors.actions.primary,
        borderRadius: '50%',
        position: 'absolute',
        zIndex: 2,
      }}
    />
    
    {/* Electron orbits */}
    <Box
      sx={{
        width: 20,
        height: 20,
        border: `1.5px solid ${brandColors.actions.primary}`,
        borderRadius: '50%',
        position: 'absolute',
        transform: 'rotate(0deg)',
      }}
    />
    <Box
      sx={{
        width: 16,
        height: 16,
        border: `1.5px solid ${brandColors.actions.primary}`,
        borderRadius: '50%',
        position: 'absolute',
        transform: 'rotate(45deg)',
      }}
    />
    <Box
      sx={{
        width: 18,
        height: 18,
        border: `1.5px solid ${brandColors.actions.primary}`,
        borderRadius: '50%',
        position: 'absolute',
        transform: 'rotate(-30deg)',
      }}
    />
    
    {/* Electrons */}
    <Box
      sx={{
        width: 4,
        height: 4,
        backgroundColor: brandColors.actions.primary,
        borderRadius: '50%',
        position: 'absolute',
        top: 1,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    />
    <Box
      sx={{
        width: 4,
        height: 4,
        backgroundColor: brandColors.actions.primary,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 1,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    />
    <Box
      sx={{
        width: 4,
        height: 4,
        backgroundColor: brandColors.actions.primary,
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        right: 1,
        transform: 'translateY(-50%)',
      }}
    />
  </Box>
);

// Types
interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  level: 'admin' | 'agent' | 'lender' | 'buyer' | 'seller' | 'attorney';
}

interface CloseState {
  activeTab: string;
  dashboardTab: string;
  transactionTab: string;
  listingsTab: string;
  offersTab: string;
  documentsTab: string;
  templatesTab: string;
  paymentsTab?: string;
  reportsTab?: string;
  trainingTab?: string;
  userRole: UserRole;
  drawerOpen: boolean;
  notifications: number;
}

const WorkspacesBrokeragesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userRole } = (React.useContext(RoleContext) as any) || {};
  const isBrokerAuthorized = userRole === 'Real Estate Broker';

  const [state, setState] = useState<CloseState>({
    activeTab: 'dashboard',
    dashboardTab: 'overview',
    transactionTab: 'overview',
    listingsTab: 'overview',
    offersTab: 'overview',
    documentsTab: 'overview',
    templatesTab: 'overview',
    paymentsTab: 'sales',
    reportsTab: 'reports',
    trainingTab: 'overview',
    drawerOpen: false,
    notifications: 5,
    userRole: {
      id: 'brokerage-001',
      name: 'Premier Real Estate Group',
      permissions: ['manage_agents', 'view_analytics', 'generate_reports'],
      level: 'admin'
    },
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyDashboardIcon /></React.Suspense> },
    { value: 'messages', label: 'Messages', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyChatIcon /></React.Suspense> },
    { value: 'agents', label: 'Agent Management', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyPeopleIcon /></React.Suspense> },
    { value: 'transactions', label: 'Transactions', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyBusinessIcon /></React.Suspense> },
    { value: 'listings', label: 'Listings', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyBusinessIcon /></React.Suspense> },
    { value: 'offers', label: 'Offers', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAssessmentIcon /></React.Suspense> },
    { value: 'documents', label: 'Documents', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAssessmentIcon /></React.Suspense> },
    { value: 'payments-finance', label: 'Payments & Finance', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAssessmentIcon /></React.Suspense> },
    { value: 'tasks-reminders', label: 'Tasks & Reminders', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAssignmentIcon /></React.Suspense> },
    { value: 'checklists', label: 'Checklists', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyCheckCircleIcon /></React.Suspense> },
    { value: 'templates', label: 'Templates and Envelopes', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAssessmentIcon /></React.Suspense> },
    { value: 'access-archives', label: 'Access Archives', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyArchiveIcon /></React.Suspense> },
    { value: 'compliance', label: 'Compliance', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazySecurityIcon /></React.Suspense> },
    { value: 'training-resources', label: 'Training & Resources', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazySchoolIcon /></React.Suspense> },
    { value: 'reports-analytics', label: 'Reports & Analytics', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAssessmentIcon /></React.Suspense> },
    { value: 'support', label: 'Support', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazySupportIcon /></React.Suspense> },
    { value: 'settings', label: 'Settings', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazySettingsIcon /></React.Suspense> },
    { value: 'integrations', label: 'Integrations', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyIntegrationIcon /></React.Suspense> },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setState(prev => ({ ...prev, activeTab: newValue }));
  };

  const toggleDrawer = () => {
    setState(prev => ({ ...prev, drawerOpen: !prev.drawerOpen }));
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationsMenuAnchor(null);
    setUserMenuAnchor(null);
  };

  const handleBackToClose = () => {
    navigate('/');
  };

  const mockBrokerageData = {
    totalAgents: 24,
    activeTransactions: 156,
    monthlyVolume: 28400000,
    pendingReviews: 12,
    completedThisMonth: 89,
    topPerformingAgent: 'Sarah Johnson',
    topAgentVolume: 3200000
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {!isBrokerAuthorized && <Navigate to="/" />}
      {/* Top App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: brandColors.primary,
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: brandColors.text.inverse }}>
            Dreamery Closing Hub - Brokerages
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={state.notifications} color="error">
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyNotificationsIcon />
                  </React.Suspense>
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleUserMenuClick}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  P
                </Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title="Back to Homepage">
              <IconButton
                color="inherit"
                onClick={handleBackToClose}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyArrowBackIcon />
                </React.Suspense>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          background: brandColors.backgrounds.secondary,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Role Selector */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <UnifiedRoleSelector 
              currentRole={userRole}
              variant="outlined"
              size="small"
              sx={{ 
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderColor: brandColors.borders.secondary,
                  '&:hover': {
                    borderColor: brandColors.primary,
                  }
                }
              }}
            />
          </Box>

          {/* Station Button */}
          <Box sx={{ px: 2, mb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                py: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: brandColors.actions.primary,
                }
              }}
            >
              Station
            </Button>
          </Box>

          <List>
            {tabs.map((tab) => (
              <Box
                key={tab.value}
                onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: brandColors.backgrounds.hover,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: state.activeTab === tab.value ? brandColors.primary : 'text.secondary' }}>
                    {tab.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: state.activeTab === tab.value ? 600 : 400,
                      color: state.activeTab === tab.value ? brandColors.primary : 'text.primary',
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </List>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          pl: 3,
          pr: 3,
          pb: 3,
          marginTop: '64px',
          overflow: 'auto',
        }}
      >
        {state.activeTab === 'dashboard' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Brokerage Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your brokerage operations, agents, and closing processes
              </Typography>
            </Paper>

            {/* Dashboard Content */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.dashboardTab} onChange={(e, newValue) => setState(prev => ({ ...prev, dashboardTab: newValue }))}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="Insights" value="insights" />
                  <Tab label="Performance" value="performance" />
                  <Tab label="Activity" value="activity" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              {state.dashboardTab === 'overview' && (
                <>
            {/* Overview Cards */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 2, md: 3 }, 
              mb: 4,
              justifyContent: 'flex-start',
              '& > *': {
                marginBottom: { xs: '1rem', md: '0' }
              }
            }}>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 250px', 
                minWidth: { xs: '200px', md: '250px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '250px' }
              }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  {mockBrokerageData.totalAgents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Agents
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 250px', 
                minWidth: { xs: '200px', md: '250px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '250px' }
              }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.warning }}>
                  {mockBrokerageData.activeTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 250px', 
                minWidth: { xs: '200px', md: '250px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '250px' }
              }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyTrendingUpIcon />
                </React.Suspense>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  ${(mockBrokerageData.monthlyVolume / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Volume
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 250px', 
                minWidth: { xs: '200px', md: '250px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '250px' }
              }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  {mockBrokerageData.completedThisMonth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed This Month
                </Typography>
              </Paper>
            </Box>

            {/* Top Performing Agent */}
            <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Top Performing Agent
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: brandColors.primary }}>
                  S
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {mockBrokerageData.topPerformingAgent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Top Agent - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>
                  <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    ${(mockBrokerageData.topAgentVolume / 1000000).toFixed(1)}M
                  </Typography>
                </Box>
              </Box>
            </Paper>
                  </>
                )}

                {state.dashboardTab === 'insights' && (
                  <>
                    {/* Insights Section */}
                    <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Insights
                        </Typography>
                        <Button variant="outlined" size="small">
                          Edit Dashboard
                        </Button>
                      </Box>
                      
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                        {/* Recent Average Deal Card */}
                        <Paper sx={{ 
                          p: { xs: 2, md: 3 }, 
                          borderRadius: 2, 
                          boxShadow: 1,
                          width: '100%'
                        }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                            Recent Average Deal
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            for Current Quarter
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                            GCI: $37,831.67
                          </Typography>
                        </Paper>

                        {/* Performance Card */}
                        <Paper sx={{ 
                          p: { xs: 2, md: 3 }, 
                          borderRadius: 2, 
                          boxShadow: 1,
                          width: '100%'
                        }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                            Performance
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            for Current Year
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                                <Box sx={{ 
                                  width: 60, 
                                  height: 60, 
                                  borderRadius: '50%', 
                                  border: '4px solid brandColors.neutral[300]',
                                  position: 'relative',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                                    25%
                                  </Typography>
                                </Box>
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '50%',
                                  border: '4px solid transparent',
                                  borderTop: '4px solid brandColors.accent.success',
                                  transform: 'rotate(90deg)',
                                  clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                                }} />
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>5</Typography>
                              <Typography variant="caption" color="text.secondary">Units</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  border: '4px solid brandColors.neutral[300]',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                    10%
                  </Typography>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid transparent',
                  borderTop: '4px solid brandColors.accent.success',
                  transform: 'rotate(36deg)',
                  clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>$7,990,000</Typography>
              <Typography variant="caption" color="text.secondary">Volume</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>20</Typography>
              <Typography variant="caption" color="text.secondary">Target Units</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>$1,000,000</Typography>
              <Typography variant="caption" color="text.secondary">Target Volume</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Home Value Trend Bar Chart Card */}
        <Paper sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 2, 
          boxShadow: 1,
          width: '100%'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Home Value Trend
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            for Current Year
          </Typography>
          <Box sx={{ height: 120, display: 'flex', alignItems: 'end', gap: 2, mb: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 60, 
              backgroundColor: '#8b0000', 
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ color: brandColors.text.inverse, transform: 'rotate(-90deg)' }}>
                Buyer
              </Typography>
            </Box>
            <Box sx={{ 
              width: 40, 
              height: 120, 
              backgroundColor: brandColors.primary, 
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ color: brandColors.text.inverse, transform: 'rotate(-90deg)' }}>
                Seller
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                backgroundColor: '#8b0000', 
                borderRadius: 4,
                mb: 1
              }} />
              <Typography variant="caption">Buyer 20%</Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                backgroundColor: brandColors.primary, 
                borderRadius: 4,
                mb: 1
              }} />
              <Typography variant="caption">Seller 80%</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Home Value Trend Pie Chart Card */}
        <Paper sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 2, 
          boxShadow: 1,
          width: '100%'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Home Value Trend
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            for Current Year and Lead, Active, Pending, Closed, Dead Deals
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              background: 'conic-gradient(#8b0000 0deg 180deg, brandColors.accent.infoDark 180deg 270deg, brandColors.accent.info 270deg 300deg, #03a9f4 300deg 360deg)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: 'white' 
              }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#8b0000', borderRadius: 2 }} />
                <Typography variant="caption">Lead</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: brandColors.accent.infoDark, borderRadius: 2 }} />
                <Typography variant="caption">Active</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: brandColors.accent.info, borderRadius: 2 }} />
                <Typography variant="caption">Pending</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#03a9f4', borderRadius: 2 }} />
                <Typography variant="caption">Closed</Typography>
              </Box>
            </Box>
            <IconButton size="small" sx={{ color: brandColors.primary }}>
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyArrowForwardIcon />
                </React.Suspense>
            </IconButton>
          </Box>
        </Paper>

        {/* Deals Card */}
        <Paper sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 2, 
          boxShadow: 1,
          width: '100%'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Deals
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            for Current Year and Lead, Active, Pending, Closed, Dead Deals
          </Typography>
          <Box sx={{ 
            height: 120, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: brandColors.neutral[100],
            borderRadius: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              Content coming soon
            </Typography>
          </Box>
        </Paper>

        {/* 2019 Realized Card */}
        <Paper sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 2, 
          boxShadow: 1,
          width: '100%'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            2019 Realized
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            for Current Year
          </Typography>
          <Box sx={{ 
            height: 120, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: brandColors.neutral[100],
            borderRadius: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              Content coming soon
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Paper>
  </>
)}

{state.dashboardTab === 'performance' && (
  <>
    {/* Agent Performance Overview */}
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
        Agent Performance Overview
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {[
          { id: 1, name: 'Sarah Johnson', avatar: 'SJ', performance: 95, transactions: 12, revenue: 45000 },
          { id: 2, name: 'Mike Wilson', avatar: 'MW', performance: 87, transactions: 8, revenue: 32000 },
          { id: 3, name: 'Lisa Brown', avatar: 'LB', performance: 92, transactions: 15, revenue: 58000 },
          { id: 4, name: 'David Lee', avatar: 'DL', performance: 78, transactions: 6, revenue: 22000 },
          { id: 5, name: 'Emily Davis', avatar: 'ED', performance: 89, transactions: 11, revenue: 41000 }
        ].map((agent) => (
          <Paper key={agent.id} sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: brandColors.primary, mr: 2 }}>
                {agent.avatar}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {agent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Performance: {agent.performance}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Transactions:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {agent.transactions}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Revenue:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.accent.success }}>
                ${agent.revenue.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  </>
)}

{state.dashboardTab === 'activity' && (
  <>
    {/* Recent Activity */}
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
        Recent Activity
      </Typography>
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {[
          { action: 'New listing added', agent: 'Sarah Johnson', property: '123 Main St', time: '2 hours ago', status: 'completed' },
          { action: 'Offer submitted', agent: 'Mike Wilson', property: '456 Oak Ave', time: '4 hours ago', status: 'pending' },
          { action: 'Transaction closed', agent: 'Lisa Brown', property: '789 Pine Rd', time: '6 hours ago', status: 'completed' },
          { action: 'Document signed', agent: 'David Lee', property: '321 Elm St', time: '1 day ago', status: 'completed' },
          { action: 'New agent onboarded', agent: 'Emily Davis', property: 'N/A', time: '2 days ago', status: 'completed' },
          { action: 'Property inspection scheduled', agent: 'Sarah Johnson', property: '654 Maple Dr', time: '3 days ago', status: 'scheduled' },
          { action: 'Contract negotiation', agent: 'Mike Wilson', property: '987 Cedar Ln', time: '4 days ago', status: 'in-progress' },
          { action: 'Closing documents prepared', agent: 'Lisa Brown', property: '147 Oak St', time: '5 days ago', status: 'completed' }
        ].map((activity, index) => (
          <Box key={index} sx={{ 
            display: 'flex', alignItems: 'center', 
            py: 2,
            borderBottom: index < 7 ? '1px solid brandColors.neutral[100]' : 'none'
          }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: activity.status === 'completed' ? brandColors.accent.success : 
                               activity.status === 'pending' ? brandColors.accent.warning : 
                               activity.status === 'scheduled' ? brandColors.accent.info : brandColors.accent.info,
              mr: 2 
            }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {activity.action}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.agent} • {activity.property} • {activity.time}
              </Typography>
            </Box>
            <Chip 
              label={activity.status} 
              size="small"
              color={activity.status === 'completed' ? 'success' : 
                     activity.status === 'pending' ? 'warning' : 
                     activity.status === 'scheduled' ? 'info' : 'default'}
            />
          </Box>
        ))}
              </Box>
            </Paper>
          </>
        )}

        {/* Close Dashboard Content wrapper and fragment */}
        </Box>
          </>
        )}

        {state.activeTab === 'agents' && (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Agent Management
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your brokerage agents and their performance
              </Typography>
            </Paper>
            {/* Agent Performance Dashboard */}
            <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                Agent Performance Dashboard
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {[
                  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', performance: 95, transactions: 12, revenue: 45000 },
                  { id: 2, name: 'Mike Wilson', avatar: 'MW', performance: 87, transactions: 8, revenue: 32000 },
                  { id: 3, name: 'Lisa Brown', avatar: 'LB', performance: 92, transactions: 15, revenue: 58000 },
                  { id: 4, name: 'David Lee', avatar: 'DL', performance: 78, transactions: 6, revenue: 22000 },
                  { id: 5, name: 'Emily Davis', avatar: 'ED', performance: 89, transactions: 11, revenue: 41000 }
                ].map((agent) => (
                  <Box key={agent.id}>
                    <Card sx={{ 
                      height: '100%',
                      width: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar sx={{ bgcolor: brandColors.primary, mr: 2, width: 56, height: 56 }}>
                            {agent.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {agent.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Agent ID: {agent.id}
                            </Typography>
            </Box>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Performance Score:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {agent.performance}%
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: brandColors.neutral[300], borderRadius: 1, height: 8, mb: 2 }}>
                            <Box
                              sx={{
                                width: `${agent.performance}%`,
                                height: '100%',
                                bgcolor: agent.performance >= 90 ? brandColors.accent.success : 
                                         agent.performance >= 80 ? brandColors.actions.warning : brandColors.actions.error,
                                borderRadius: 1
                              }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Active Transactions:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {agent.transactions}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Revenue:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.accent.success }}>
                            ${agent.revenue.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPersonIcon />
                </React.Suspense>}
                            sx={{ flex: 1 }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyEditIcon />
                </React.Suspense>}
                            sx={{ flex: 1 }}
                          >
                            Edit
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Add New Agent */}
            <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                Add New Agent
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Agent Name"
                    variant="outlined"
                    placeholder="Enter full name"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    placeholder="Enter email address"
                    type="email"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    placeholder="Enter phone number"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="License Number"
                    variant="outlined"
                    placeholder="Enter license number"
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Button
                    variant="contained"
                    startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                    sx={{ backgroundColor: brandColors.primary }}
                  >
                    Add Agent
                  </Button>
                </Box>
              </Box>
            </Paper>
          </>
        )}

        {state.activeTab === 'listings' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Listings
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage property listings, track status, and handle approval processes
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.listingsTab} onChange={(e, newValue) => setState(prev => ({ ...prev, listingsTab: newValue }))}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="Active Listings" value="active" />
                  <Tab label="Pending Approval" value="pending" />
                  <Tab label="Expired" value="expired" />
                  <Tab label="Create Listing" value="create" />
                </Tabs>
              </Box>

              {state.listingsTab === 'overview' && (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        89
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Active
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Approval
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        $45.2M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Value
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expired This Month
                      </Typography>
                    </Paper>
                  </Box>

                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Recent Listings Activity
                    </Typography>
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', agent: 'Sarah Johnson', status: 'Active', price: 850000, daysOnMarket: 15, views: 245 },
                        { id: 2, property: '456 Oak Ave, San Francisco', agent: 'Mike Wilson', status: 'Pending Approval', price: 1200000, daysOnMarket: 0, views: 0 },
                        { id: 3, property: '789 Pine Rd, Seattle', agent: 'Lisa Brown', status: 'Active', price: 650000, daysOnMarket: 8, views: 189 },
                        { id: 4, property: '321 Elm St, Miami', agent: 'David Lee', status: 'Active', price: 950000, daysOnMarket: 22, views: 312 },
                        { id: 5, property: '654 Maple Dr, Austin', agent: 'Emily Davis', status: 'Expired', price: 750000, daysOnMarket: 90, views: 567 }
                      ].map((listing) => (
                        <Box key={listing.id} sx={{ 
                          p: 2, 
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {listing.property}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Agent: {listing.agent} • Days on Market: {listing.daysOnMarket} • Views: {listing.views}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                ${listing.price.toLocaleString()}
                              </Typography>
                              <Chip 
                                label={listing.status} 
                                size="small"
                                color={
                                  listing.status === 'Active' ? 'primary' :
                                  listing.status === 'Pending Approval' ? 'warning' :
                                  'default'
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.listingsTab === 'active' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Active Listings (89)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search listings..."
                        InputProps={{
                          startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                        }}
                        sx={{ minWidth: 300 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', agent: 'Sarah Johnson', price: 850000, daysOnMarket: 15, views: 245, offers: 3, propertyType: 'Single Family' },
                        { id: 2, property: '789 Pine Rd, Seattle', agent: 'Lisa Brown', price: 650000, daysOnMarket: 8, views: 189, offers: 1, propertyType: 'Condo' },
                        { id: 3, property: '321 Elm St, Miami', agent: 'David Lee', price: 950000, daysOnMarket: 22, views: 312, offers: 5, propertyType: 'Single Family' },
                        { id: 4, property: '147 Birch St, Portland', agent: 'Maria Garcia', price: 720000, daysOnMarket: 12, views: 156, offers: 2, propertyType: 'Townhouse' },
                        { id: 5, property: '258 Spruce Ave, Chicago', agent: 'Tom Anderson', price: 890000, daysOnMarket: 19, views: 278, offers: 4, propertyType: 'Single Family' }
                      ].map((listing) => (
                        <Card key={listing.id} sx={{ 
                          mb: 2, 
                          '&:last-child': { mb: 0 },
                          width: '100%'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {listing.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {listing.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Type: {listing.propertyType}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Days on Market: {listing.daysOnMarket}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Views: {listing.views}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Offers: {listing.offers}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold', mb: 1 }}>
                                  ${listing.price.toLocaleString()}
                                </Typography>
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    View Details
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Edit Listing
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.listingsTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Listings Pending Approval (12)
                    </Typography>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '456 Oak Ave, San Francisco', agent: 'Mike Wilson', price: 1200000, submitted: '2024-01-14', issue: 'Missing Photos', priority: 'High' },
                        { id: 2, property: '654 Maple Dr, Austin', agent: 'Emily Davis', price: 750000, submitted: '2024-01-11', issue: 'Contract Review Required', priority: 'Medium' },
                        { id: 3, property: '987 Cedar Ln, Denver', agent: 'John Smith', price: 890000, submitted: '2024-01-10', issue: 'Title Verification', priority: 'High' },
                        { id: 4, property: '369 Willow St, Boston', agent: 'Jennifer White', price: 1100000, submitted: '2024-01-09', issue: 'Pricing Analysis', priority: 'Low' }
                      ].map((listing) => (
                        <Card key={listing.id} sx={{ 
                          mb: 2, 
                          '&:last-child': { mb: 0 },
                          width: '100%'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {listing.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {listing.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Submitted: {listing.submitted}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Issue: {listing.issue}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold', mb: 1 }}>
                                  ${listing.price.toLocaleString()}
                                </Typography>
                                <Chip 
                                  label={listing.priority} 
                                  color={
                                    listing.priority === 'High' ? 'error' :
                                    listing.priority === 'Medium' ? 'warning' : 'default'
                                  }
                                  sx={{ mb: 1 }}
                                />
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    Review
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Approve
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.listingsTab === 'expired' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Expired Listings This Month (23)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search expired listings..."
                        InputProps={{
                          startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                        }}
                        sx={{ minWidth: 300 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '654 Maple Dr, Austin', agent: 'Emily Davis', originalPrice: 750000, finalPrice: 720000, daysOnMarket: 90, reason: 'Market Conditions' },
                        { id: 2, property: '147 Birch St, Portland', agent: 'Maria Garcia', originalPrice: 680000, finalPrice: 650000, daysOnMarket: 85, reason: 'Pricing Strategy' },
                        { id: 3, property: '258 Spruce Ave, Chicago', agent: 'Tom Anderson', originalPrice: 920000, finalPrice: 890000, daysOnMarket: 88, reason: 'Property Condition' },
                        { id: 4, property: '369 Willow St, Boston', agent: 'Jennifer White', originalPrice: 1150000, finalPrice: 1100000, daysOnMarket: 92, reason: 'Market Conditions' }
                      ].map((listing) => (
                        <Card key={listing.id} sx={{ 
                          mb: 2, 
                          '&:last-child': { mb: 0 },
                          width: '100%'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {listing.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {listing.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Days on Market: {listing.daysOnMarket}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Reason: {listing.reason}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                    ${listing.originalPrice.toLocaleString()}
                                  </Typography>
                                  <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                                    ${listing.finalPrice.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Button size="small" variant="outlined">
                                  Relist
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.listingsTab === 'create' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Create New Property Listing
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <Box>
                        <TextField
                          fullWidth
                          label="Property Address"
                          placeholder="Enter full property address"
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Property Type"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="single-family">Single Family</MenuItem>
                          <MenuItem value="multi-family">Multi-Family</MenuItem>
                          <MenuItem value="condo">Condo</MenuItem>
                          <MenuItem value="townhouse">Townhouse</MenuItem>
                          <MenuItem value="land">Land</MenuItem>
                          <MenuItem value="commercial">Commercial</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          label="List Price"
                          placeholder="$0"
                          sx={{ mb: 3 }}
                        />
                      </Box>
                      
                      <Box>
                        <TextField
                          fullWidth
                          label="Assigned Agent"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="sarah">Sarah Johnson</MenuItem>
                          <MenuItem value="mike">Mike Wilson</MenuItem>
                          <MenuItem value="lisa">Lisa Brown</MenuItem>
                          <MenuItem value="david">David Lee</MenuItem>
                          <MenuItem value="emily">Emily Davis</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          label="Property Status"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="pending">Pending Approval</MenuItem>
                          <MenuItem value="draft">Draft</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          label="Target Listing Date"
                          type="date"
                          sx={{ mb: 3 }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button variant="contained" size="large">
                        Create Listing
                      </Button>
                      <Button variant="outlined" size="large">
                        Save as Draft
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'offers' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Offers
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage purchase offers, track negotiations, and handle offer comparisons
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.offersTab} onChange={(e, newValue) => setState(prev => ({ ...prev, offersTab: newValue }))}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="All Offers" value="all" />
                  <Tab label="Pending Review" value="pending" />
                  <Tab label="Negotiating" value="negotiating" />
                  <Tab label="Compare" value="compare" />
                </Tabs>
              </Box>

              {state.offersTab === 'overview' && (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        47
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Offers
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Review
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Under Negotiation
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        $12.8M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Offer Value
                      </Typography>
                    </Paper>
                  </Box>

                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Recent Offers Activity
                    </Typography>
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', buyer: 'John Smith', agent: 'Sarah Johnson', status: 'Pending Review', price: 850000, submitted: '2024-01-15' },
                        { id: 2, property: '456 Oak Ave, San Francisco', buyer: 'Emily Davis', agent: 'Mike Wilson', status: 'Under Negotiation', price: 1200000, submitted: '2024-01-14' },
                        { id: 3, property: '789 Pine Rd, Seattle', buyer: 'David Lee', agent: 'Lisa Brown', status: 'Accepted', price: 650000, submitted: '2024-01-13' },
                        { id: 4, property: '321 Elm St, Miami', buyer: 'Maria Garcia', agent: 'David Lee', status: 'Pending Review', price: 950000, submitted: '2024-01-12' },
                        { id: 5, property: '654 Maple Dr, Austin', buyer: 'Tom Anderson', agent: 'Emily Davis', status: 'Counter Offer', price: 750000, submitted: '2024-01-11' }
                      ].map((offer) => (
                        <Box key={offer.id} sx={{ 
                          p: 2, 
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {offer.property}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Buyer: {offer.buyer} • Agent: {offer.agent} • {offer.submitted}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                ${offer.price.toLocaleString()}
                              </Typography>
                              <Chip 
                                label={offer.status} 
                                size="small"
                                color={
                                  offer.status === 'Pending Review' ? 'warning' :
                                  offer.status === 'Under Negotiation' ? 'primary' :
                                  offer.status === 'Accepted' ? 'success' :
                                  'default'
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.offersTab === 'all' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        All Offers (47)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search offers..."
                        InputProps={{
                          startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                        }}
                        sx={{ minWidth: 300 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', buyer: 'John Smith', agent: 'Sarah Johnson', price: 850000, status: 'Pending Review', submitted: '2024-01-15', daysActive: 2 },
                        { id: 2, property: '456 Oak Ave, San Francisco', buyer: 'Emily Davis', agent: 'Mike Wilson', price: 1200000, status: 'Under Negotiation', submitted: '2024-01-14', daysActive: 3 },
                        { id: 3, property: '789 Pine Rd, Seattle', buyer: 'David Lee', agent: 'Lisa Brown', price: 650000, status: 'Accepted', submitted: '2024-01-13', daysActive: 4 },
                        { id: 4, property: '321 Elm St, Miami', buyer: 'Maria Garcia', agent: 'David Lee', price: 950000, status: 'Pending Review', submitted: '2024-01-12', daysActive: 5 },
                        { id: 5, property: '654 Maple Dr, Austin', buyer: 'Tom Anderson', agent: 'Emily Davis', price: 750000, status: 'Counter Offer', submitted: '2024-01-11', daysActive: 6 }
                      ].map((offer) => (
                        <Card key={offer.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {offer.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Buyer: {offer.buyer}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {offer.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Submitted: {offer.submitted}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Days Active: {offer.daysActive}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold', mb: 1 }}>
                                  ${offer.price.toLocaleString()}
                                </Typography>
                                <Chip 
                                  label={offer.status} 
                                  color={
                                    offer.status === 'Pending Review' ? 'warning' :
                                    offer.status === 'Under Negotiation' ? 'primary' :
                                    offer.status === 'Accepted' ? 'success' :
                                    'default'
                                  }
                                  sx={{ mb: 1 }}
                                />
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    View Details
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Take Action
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.offersTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Offers Pending Review (12)
                    </Typography>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', buyer: 'John Smith', agent: 'Sarah Johnson', price: 850000, submitted: '2024-01-15', priority: 'High', issue: 'Missing Pre-approval' },
                        { id: 2, property: '321 Elm St, Miami', buyer: 'Maria Garcia', agent: 'David Lee', price: 950000, submitted: '2024-01-12', priority: 'Medium', issue: 'Contract Review Required' },
                        { id: 3, property: '147 Birch St, Portland', buyer: 'Robert Chen', agent: 'Maria Garcia', price: 720000, submitted: '2024-01-10', priority: 'High', issue: 'Financing Contingency' },
                        { id: 4, property: '258 Spruce Ave, Chicago', buyer: 'Jennifer White', agent: 'Tom Anderson', price: 890000, submitted: '2024-01-09', priority: 'Low', issue: 'Documentation Complete' }
                      ].map((offer) => (
                        <Card key={offer.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {offer.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Buyer: {offer.buyer}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {offer.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Submitted: {offer.submitted}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Issue: {offer.issue}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold', mb: 1 }}>
                                  ${offer.price.toLocaleString()}
                                </Typography>
                                <Chip 
                                  label={offer.priority} 
                                  color={
                                    offer.priority === 'High' ? 'error' :
                                    offer.priority === 'Medium' ? 'warning' : 'default'
                                  }
                                  sx={{ mb: 1 }}
                                />
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    Review
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Approve
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.offersTab === 'negotiating' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Offers Under Negotiation (8)
                    </Typography>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '456 Oak Ave, San Francisco', buyer: 'Emily Davis', agent: 'Mike Wilson', originalPrice: 1200000, currentPrice: 1180000, counterOffers: 3, lastActivity: '2024-01-14' },
                        { id: 2, property: '654 Maple Dr, Austin', buyer: 'Tom Anderson', agent: 'Emily Davis', originalPrice: 750000, currentPrice: 735000, counterOffers: 2, lastActivity: '2024-01-13' },
                        { id: 3, property: '987 Cedar Ln, Denver', buyer: 'John Smith', agent: 'Robert Chen', originalPrice: 890000, currentPrice: 875000, counterOffers: 4, lastActivity: '2024-01-12' }
                      ].map((offer) => (
                        <Card key={offer.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {offer.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Buyer: {offer.buyer}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {offer.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Counter Offers: {offer.counterOffers}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Last Activity: {offer.lastActivity}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                    ${offer.originalPrice.toLocaleString()}
                                  </Typography>
                                  <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                                    ${offer.currentPrice.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Button size="small" variant="contained">
                                  Continue Negotiation
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.offersTab === 'compare' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Compare Offers
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Select offers to compare side by side
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {[
                          { id: 1, property: '123 Main St, Los Angeles', buyer: 'John Smith', price: 850000, selected: true },
                          { id: 2, property: '456 Oak Ave, San Francisco', buyer: 'Emily Davis', price: 1200000, selected: true },
                          { id: 3, property: '789 Pine Rd, Seattle', buyer: 'David Lee', price: 650000, selected: false },
                          { id: 4, property: '321 Elm St, Miami', buyer: 'Maria Garcia', price: 950000, selected: false }
                        ].map((offer) => (
                          <Chip
                            key={offer.id}
                            label={`${offer.property} - $${offer.price.toLocaleString()}`}
                            color={offer.selected ? 'primary' : 'default'}
                            onClick={() => {
                              // Toggle selection logic would go here
                            }}
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Comparison Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', buyer: 'John Smith', agent: 'Sarah Johnson', price: 850000, downPayment: 170000, closingDate: '2024-02-15', financing: 'Conventional', contingencies: ['Inspection', 'Appraisal'] },
                        { id: 2, property: '456 Oak Ave, San Francisco', buyer: 'Emily Davis', agent: 'Mike Wilson', price: 1200000, downPayment: 240000, closingDate: '2024-02-28', financing: 'FHA', contingencies: ['Inspection'] }
                      ].map((offer) => (
                        <Box key={offer.id}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                {offer.property}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Buyer: {offer.buyer}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Agent: {offer.agent}
                                </Typography>
                              </Box>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                                  ${offer.price.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Down Payment: ${offer.downPayment.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Closing Date: {offer.closingDate}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Financing: {offer.financing}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  Contingencies:
                                </Typography>
                                {offer.contingencies.map((contingency, index) => (
                                  <Chip key={index} label={contingency} size="small" sx={{ mr: 1, mb: 1 }} />
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button variant="contained" size="large">
                        Send to Seller
                      </Button>
                      <Button variant="outlined" size="large">
                        Generate Report
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'documents' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Documents
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage document workflow, categories, and review processes
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.documentsTab} onChange={(e, newValue) => setState(prev => ({ ...prev, documentsTab: newValue }))}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="Pending Review" value="pending" />
                  <Tab label="Document Categories" value="categories" />
                  <Tab label="Upload Documents" value="upload" />
                  <Tab label="Document Workflow" value="workflow" />
                </Tabs>
              </Box>

              {state.documentsTab === 'overview' && (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Documents
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Review
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        89
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Approved
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        44
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rejected
                      </Typography>
                    </Paper>
                  </Box>

                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Recent Document Activity
                    </Typography>
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {[
                        { id: 1, name: 'Purchase Agreement - 123 Main St', agent: 'Sarah Johnson', status: 'Pending Review', category: 'Legal', submitted: '2024-01-15' },
                        { id: 2, name: 'Title Report - 456 Oak Ave', agent: 'Mike Wilson', status: 'Approved', category: 'Property', submitted: '2024-01-14' },
                        { id: 3, name: 'Loan Documents - 789 Pine Rd', agent: 'Lisa Brown', status: 'Pending Review', category: 'Financial', submitted: '2024-01-13' },
                        { id: 4, name: 'HOA Documents - 321 Elm St', agent: 'David Lee', status: 'Rejected', category: 'Property', submitted: '2024-01-12' },
                        { id: 5, name: 'Commission Agreement - 654 Maple Dr', agent: 'Emily Davis', status: 'Approved', category: 'Financial', submitted: '2024-01-11' }
                      ].map((document) => (
                        <Box key={document.id} sx={{ 
                          p: 2, 
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {document.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Agent: {document.agent} • Category: {document.category} • {document.submitted}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Chip 
                                label={document.status} 
                                size="small"
                                color={
                                  document.status === 'Pending Review' ? 'warning' :
                                  document.status === 'Approved' ? 'success' :
                                  'error'
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.documentsTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Documents Pending Review (23)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search documents..."
                        InputProps={{
                          startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                        }}
                        sx={{ minWidth: 300 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, name: 'Purchase Agreement - 123 Main St', agent: 'Sarah Johnson', category: 'Legal', priority: 'High', submitted: '2024-01-15', issue: 'Missing signature page' },
                        { id: 2, name: 'Loan Documents - 789 Pine Rd', agent: 'Lisa Brown', category: 'Financial', priority: 'Medium', submitted: '2024-01-13', issue: 'Incomplete income verification' },
                        { id: 3, name: 'HOA Documents - 321 Elm St', agent: 'David Lee', category: 'Property', priority: 'High', submitted: '2024-01-12', issue: 'Outdated bylaws' },
                        { id: 4, name: 'Commission Agreement - 654 Maple Dr', agent: 'Emily Davis', category: 'Financial', priority: 'Low', submitted: '2024-01-11', issue: 'Rate calculation review' },
                        { id: 5, name: 'Title Report - 456 Oak Ave', agent: 'Mike Wilson', category: 'Property', priority: 'Medium', submitted: '2024-01-10', issue: 'Lien verification required' }
                      ].map((document) => (
                        <Card key={document.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {document.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {document.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Category: {document.category}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Submitted: {document.submitted}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Issue: {document.issue}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Chip 
                                  label={document.priority} 
                                  color={
                                    document.priority === 'High' ? 'error' :
                                    document.priority === 'Medium' ? 'warning' : 'default'
                                  }
                                  sx={{ mb: 1 }}
                                />
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    View Document
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Review
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.documentsTab === 'categories' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Document Categories
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                      {[
                        { name: 'Legal Documents', count: 45, color: 'primary', examples: ['Purchase Agreements', 'Contracts', 'Addendums'] },
                        { name: 'Financial Documents', count: 38, color: 'success', examples: ['Loan Documents', 'Commission Agreements', 'Financial Statements'] },
                        { name: 'Property Documents', count: 42, color: 'info', examples: ['Title Reports', 'HOA Documents', 'Property Surveys'] },
                        { name: 'Transaction Documents', count: 31, color: 'warning', examples: ['Closing Statements', 'Settlement Documents', 'Transfer Records'] }
                      ].map((category) => (
                        <Box key={category.name}>
                          <Card sx={{ 
                      height: '100%',
                      width: '100%'
                    }}>
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                {category.name}
                              </Typography>
                              <Typography variant="h4" sx={{ color: (brandColors as any)[category.color], fontWeight: 'bold', mb: 2 }}>
                                {category.count}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Documents
                              </Typography>
                              <Box>
                                {category.examples.map((example, index) => (
                                  <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    • {example}
                                  </Typography>
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.documentsTab === 'upload' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Upload New Documents
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <Box>
                        <TextField
                          fullWidth
                          label="Document Name"
                          placeholder="Enter document name"
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Document Category"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="legal">Legal Documents</MenuItem>
                          <MenuItem value="financial">Financial Documents</MenuItem>
                          <MenuItem value="property">Property Documents</MenuItem>
                          <MenuItem value="transaction">Transaction Documents</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          label="Assigned Agent"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="sarah">Sarah Johnson</MenuItem>
                          <MenuItem value="mike">Mike Wilson</MenuItem>
                          <MenuItem value="lisa">Lisa Brown</MenuItem>
                          <MenuItem value="david">David Lee</MenuItem>
                          <MenuItem value="emily">Emily Davis</MenuItem>
                        </TextField>
                      </Box>
                      
                      <Box>
                        <TextField
                          fullWidth
                          label="Transaction Reference"
                          placeholder="Enter transaction ID or property address"
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Priority Level"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          label="Notes"
                          multiline
                          rows={3}
                          placeholder="Add any additional notes..."
                          sx={{ mb: 3 }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ border: '2px dashed brandColors.neutral[400]', borderRadius: 2, p: 4, textAlign: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Drag and drop documents here, or click to browse
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Supported formats: PDF, DOC, DOCX, JPG, PNG
                      </Typography>
                      <Button variant="outlined" size="large">
                        Choose Files
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="contained" size="large">
                        Upload Documents
                      </Button>
                      <Button variant="outlined" size="large">
                        Save as Draft
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.documentsTab === 'workflow' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Document Workflow Management
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Workflow Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Button variant="outlined" startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>} fullWidth>
                            Search Documents
                          </Button>
                          <Button variant="outlined" startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>} fullWidth>
                            Generate Reports
                          </Button>
                          <Button variant="outlined" startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>} fullWidth>
                            Bulk Actions
                          </Button>
                          <Button variant="outlined" startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>} fullWidth>
                            Assign Reviewers
                          </Button>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Quick Stats
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Documents Reviewed Today
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              12
                            </Typography>
                          </Paper>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Average Review Time
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              2.3 hours
                            </Typography>
                          </Paper>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Pending Assignments
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              8
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'working-documents' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ fontSize: 28, color: brandColors.text.inverse }} />}>
                  <LazyDescriptionIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Working Documents
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage active working documents and collaborative editing
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Working Documents Management</Typography>
              <Typography variant="body1">
                Working documents and collaborative editing system will be implemented here.
              </Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'templates' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Templates and Envelopes
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Create and manage document templates and digital signature envelopes
              </Typography>
            </Paper>

            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={state.templatesTab} onChange={(e, newValue) => setState(prev => ({ ...prev, templatesTab: newValue }))}>
                <Tab label="Templates" value="templates" />
                <Tab label="Envelopes" value="envelopes" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {state.templatesTab === 'templates' && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Document Templates</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Create and manage reusable document templates for common real estate transactions.
                </Typography>
                
                {/* Create New Template Button */}
                <Box sx={{ mb: 3 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                    sx={{ backgroundColor: brandColors.primary }}
                  >
                    Create New Template
                  </Button>
                </Box>
                
                {/* Template Management Interface */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                  {/* Existing Templates */}
                  {[
                    { title: "Real Estate Purchase Agreement", category: "Purchase", forms: 12 },
                    { title: "Lease Agreement", category: "Lease", forms: 8 },
                    { title: "Property Management Contract", category: "Management", forms: 5 },
                    { title: "Offer to Purchase", category: "Purchase", forms: 15 },
                    { title: "Rental Application", category: "Application", forms: 20 },
                    { title: "Inspection Checklist", category: "Inspection", forms: 6 }
                  ].map((template, index) => (
                    <Paper key={index} sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip label={template.category} color="primary" size="small" />
                        <IconButton size="small">
                          <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                        </IconButton>
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {template.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.forms} forms created
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined">Edit</Button>
                        <Button size="small" variant="outlined">Duplicate</Button>
                        <Button size="small" variant="outlined">Share</Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {state.templatesTab === 'envelopes' && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Digital Signature Envelopes</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Manage digital signature envelopes and track signing progress for documents.
                </Typography>
                
                {/* Create New Envelope Button */}
                <Box sx={{ mb: 3 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySendIcon />
                </React.Suspense>}
                    sx={{ backgroundColor: brandColors.primary }}
                  >
                    Create New Envelope
                  </Button>
                </Box>

                {/* Envelopes List */}
                <Paper sx={{ borderRadius: 2, boxShadow: 2 }}>
                  {/* List Header */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    backgroundColor: 'grey.50',
                    borderRadius: '8px 8px 0 0'
                  }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 2, alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Document Title</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Recipients</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Progress</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Actions</Typography>
                    </Box>
                  </Box>

                  {/* Envelopes List Items */}
                  {[
                    { title: "Purchase Agreement - 123 Main St", status: "Pending", recipients: 3, progress: 67 },
                    { title: "Lease Agreement - 456 Oak Ave", status: "Completed", recipients: 2, progress: 100 },
                    { title: "Property Management - 789 Pine St", status: "Draft", recipients: 1, progress: 0 },
                    { title: "Offer Letter - 321 Elm St", status: "Pending", recipients: 4, progress: 50 },
                    { title: "Inspection Report - 654 Maple Dr", status: "Completed", recipients: 2, progress: 100 },
                    { title: "Disclosure Form - 987 Cedar Ln", status: "Draft", recipients: 3, progress: 0 }
                  ].map((envelope, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        '&:hover': { backgroundColor: 'grey.50' },
                        '&:last-child': { borderBottom: 0 }
                      }}
                    >
                      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 2, alignItems: 'center' }}>
                        {/* Document Title */}
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {envelope.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created {new Date().toLocaleDateString()}
                          </Typography>
                        </Box>

                        {/* Status */}
                        <Box>
                          <Chip 
                            label={envelope.status} 
                            color={envelope.status === 'Completed' ? 'success' : envelope.status === 'Pending' ? 'warning' : 'default'} 
                            size="small" 
                            sx={{ minWidth: 80 }}
                          />
                        </Box>

                        {/* Recipients */}
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: brandColors.primary 
                            }} />
                            {envelope.recipients} recipients
                          </Typography>
                        </Box>

                        {/* Progress */}
                        <Box sx={{ minWidth: 120 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">{envelope.progress}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={envelope.progress} 
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" sx={{ minWidth: 'auto', px: 1 }}>
                            View
                          </Button>
                          <Button size="small" variant="outlined" sx={{ minWidth: 'auto', px: 1 }}>
                            Edit
                          </Button>
                          <IconButton size="small">
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}
          </>
        )}

        {state.activeTab === 'access-archives' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyArchiveIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Access Archives
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Access historical documents and archived records
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Archive Management</Typography>
              <Typography variant="body1">
                Historical document access and archive management system will be implemented here.
              </Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'transactions' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Transactions
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage all transaction files, track progress, and handle closing processes
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.transactionTab} onChange={(e, newValue) => setState(prev => ({ ...prev, transactionTab: newValue }))}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="Active Transactions" value="active" />
                  <Tab label="Pending Review" value="pending" />
                  <Tab label="Completed" value="completed" />
                  <Tab label="Create File" value="create" />
                </Tabs>
              </Box>

              {state.transactionTab === 'overview' && (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Active
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Review
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        89
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed This Month
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        $28.4M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Volume
                      </Typography>
                    </Paper>
                  </Box>

                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Recent Transaction Activity
                    </Typography>
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', agent: 'Sarah Johnson', status: 'Active', value: 850000, date: '2024-01-15' },
                        { id: 2, property: '456 Oak Ave, San Francisco', agent: 'Mike Wilson', status: 'Pending Review', value: 1200000, date: '2024-01-14' },
                        { id: 3, property: '789 Pine Rd, Seattle', agent: 'Lisa Brown', status: 'Completed', value: 650000, date: '2024-01-13' },
                        { id: 4, property: '321 Elm St, Miami', agent: 'David Lee', status: 'Active', value: 950000, date: '2024-01-12' },
                        { id: 5, property: '654 Maple Dr, Austin', agent: 'Emily Davis', status: 'Pending Review', value: 750000, date: '2024-01-11' }
                      ].map((transaction) => (
                        <Box key={transaction.id} sx={{ 
                          p: 2, 
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {transaction.property}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Agent: {transaction.agent} • {transaction.date}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                ${transaction.value.toLocaleString()}
                              </Typography>
                              <Chip 
                                label={transaction.status} 
                                size="small"
                                color={
                                  transaction.status === 'Active' ? 'primary' :
                                  transaction.status === 'Pending Review' ? 'warning' :
                                  'success'
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.transactionTab === 'active' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Active Transactions (156)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search transactions..."
                        InputProps={{
                          startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                        }}
                        sx={{ minWidth: 300 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', agent: 'Sarah Johnson', status: 'In Escrow', value: 850000, daysLeft: 15, nextAction: 'Title Search' },
                        { id: 2, property: '456 Oak Ave, San Francisco', agent: 'Mike Wilson', status: 'Under Contract', value: 1200000, daysLeft: 8, nextAction: 'Inspection' },
                        { id: 3, property: '789 Pine Rd, Seattle', agent: 'Lisa Brown', status: 'In Escrow', value: 650000, daysLeft: 22, nextAction: 'Appraisal' },
                        { id: 4, property: '321 Elm St, Miami', agent: 'David Lee', status: 'Under Contract', value: 950000, daysLeft: 12, nextAction: 'Financing' },
                        { id: 5, property: '654 Maple Dr, Austin', agent: 'Emily Davis', status: 'In Escrow', value: 750000, daysLeft: 19, nextAction: 'Final Walkthrough' }
                      ].map((transaction) => (
                        <Card key={transaction.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {transaction.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {transaction.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Value: ${transaction.value.toLocaleString()}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Days Left: {transaction.daysLeft}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  Next Action: {transaction.nextAction}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Chip 
                                  label={transaction.status} 
                                  color="primary"
                                  sx={{ mb: 1 }}
                                />
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    View Details
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Update Status
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.transactionTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Transactions Pending Review (23)
                    </Typography>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '456 Oak Ave, San Francisco', agent: 'Mike Wilson', issue: 'Missing Documentation', priority: 'High', submitted: '2024-01-14' },
                        { id: 2, property: '654 Maple Dr, Austin', agent: 'Emily Davis', issue: 'Contract Review Required', priority: 'Medium', submitted: '2024-01-11' },
                        { id: 3, property: '987 Cedar Ln, Denver', agent: 'John Smith', issue: 'Title Issue Found', priority: 'High', submitted: '2024-01-10' },
                        { id: 4, property: '147 Birch St, Portland', agent: 'Maria Garcia', issue: 'Financing Contingency', priority: 'Low', submitted: '2024-01-09' }
                      ].map((transaction) => (
                        <Card key={transaction.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {transaction.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {transaction.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Submitted: {transaction.submitted}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Issue: {transaction.issue}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Chip 
                                  label={transaction.priority} 
                                  color={
                                    transaction.priority === 'High' ? 'error' :
                                    transaction.priority === 'Medium' ? 'warning' : 'default'
                                  }
                                  sx={{ mb: 1 }}
                                />
                                <Box>
                                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                    Review
                                  </Button>
                                  <Button size="small" variant="contained">
                                    Approve
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.transactionTab === 'completed' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Completed Transactions This Month (89)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search completed transactions..."
                        InputProps={{
                          startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                        }}
                        sx={{ minWidth: 300 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {[
                        { id: 1, property: '789 Pine Rd, Seattle', agent: 'Lisa Brown', closedDate: '2024-01-13', value: 650000, commission: 19500 },
                        { id: 2, property: '258 Spruce Ave, Chicago', agent: 'Tom Anderson', closedDate: '2024-01-12', value: 890000, commission: 26700 },
                        { id: 3, property: '369 Willow St, Boston', agent: 'Jennifer White', closedDate: '2024-01-11', value: 1100000, commission: 33000 },
                        { id: 4, property: '741 Aspen Dr, Phoenix', agent: 'Robert Chen', closedDate: '2024-01-10', value: 720000, commission: 21600 }
                      ].map((transaction) => (
                        <Card key={transaction.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {transaction.property}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Agent: {transaction.agent}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Closed: {transaction.closedDate}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Value: ${transaction.value.toLocaleString()}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                                  ${transaction.commission.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Commission
                                </Typography>
                                <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                                  View Details
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {state.transactionTab === 'create' && (
                <Box>
                  <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Create New Transaction File
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <Box>
                        <TextField
                          fullWidth
                          label="Client Name"
                          placeholder="Enter client name"
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Property Address"
                          placeholder="Enter property address"
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Transaction Type"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="purchase">Purchase</MenuItem>
                          <MenuItem value="sale">Sale</MenuItem>
                          <MenuItem value="refinance">Refinance</MenuItem>
                          <MenuItem value="lease">Lease</MenuItem>
                        </TextField>
                      </Box>
                      
                      <Box>
                        <TextField
                          fullWidth
                          label="Assigned Agent"
                          select
                          defaultValue=""
                          sx={{ mb: 3 }}
                        >
                          <MenuItem value="sarah">Sarah Johnson</MenuItem>
                          <MenuItem value="mike">Mike Wilson</MenuItem>
                          <MenuItem value="lisa">Lisa Brown</MenuItem>
                          <MenuItem value="david">David Lee</MenuItem>
                          <MenuItem value="emily">Emily Davis</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          label="Estimated Value"
                          placeholder="$0"
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Target Closing Date"
                          type="date"
                          sx={{ mb: 3 }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button variant="contained" size="large">
                        Create Transaction File
                      </Button>
                      <Button variant="outlined" size="large">
                        Save as Draft
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'analytics' && (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Analytics
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Analyze brokerage performance and trends
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Analytics Content</Typography>
              <Typography variant="body1">This section will contain analytics and reporting tools.</Typography>
            </Box>
          </>
        )}

        

        {state.activeTab === 'settings' && (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySettingsIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Settings
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Configure your brokerage account and preferences
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Settings Content</Typography>
              <Typography variant="body1">This section will contain account and preference settings.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'integrations' && (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyIntegrationIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Integrations
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Connect with third-party services and platforms
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Integrations Content</Typography>
              <Typography variant="body1">This section will contain integration tools and settings.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'payments-finance' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Payments & Finance
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage all financial transactions, invoices, and banking operations
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.paymentsTab} onChange={(e, newValue) => setState(prev => ({ ...prev, paymentsTab: newValue }))}>
                  <Tab label="Sales" value="sales" />
                  <Tab label="Purchases" value="purchases" />
                  <Tab label="Lending" value="lending" />
                  <Tab label="Escrow Deposit" value="escrow" />
                  <Tab label="Banking" value="banking" />
                </Tabs>
              </Box>

              {state.paymentsTab === 'sales' && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>Sales</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Invoices</Typography>
                      <Typography variant="body2" color="text.secondary">Manage and track all outgoing invoices</Typography>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Payments Received</Typography>
                      <Typography variant="body2" color="text.secondary">Track incoming payments from clients</Typography>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Credit Notes</Typography>
                      <Typography variant="body2" color="text.secondary">Handle credit notes and refunds</Typography>
                    </Paper>
                  </Box>
                </Box>
              )}

              {state.paymentsTab === 'purchases' && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>Purchases</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Bills</Typography>
                      <Typography variant="body2" color="text.secondary">Manage vendor bills and expenses</Typography>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Expenses</Typography>
                      <Typography variant="body2" color="text.secondary">Track business expenses and costs</Typography>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Payments Made</Typography>
                      <Typography variant="body2" color="text.secondary">Record payments to vendors</Typography>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Vendor Credits</Typography>
                      <Typography variant="body2" color="text.secondary">Handle vendor credits and adjustments</Typography>
                    </Paper>
                  </Box>
                </Box>
              )}

              {state.paymentsTab === 'lending' && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>Lending</Typography>
                  <Typography variant="body1">Lending management and loan tracking features will be implemented here.</Typography>
                </Box>
              )}

              {state.paymentsTab === 'escrow' && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>Escrow Deposit</Typography>
                  <Typography variant="body1">Escrow deposit management and tracking features will be implemented here.</Typography>
                </Box>
              )}

              {state.paymentsTab === 'banking' && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>Banking</Typography>
                  <Typography variant="body1">Banking integration and account management features will be implemented here.</Typography>
                </Box>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'reports-analytics' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Reports & Analytics
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Generate reports, analyze performance, and track business metrics
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.reportsTab} onChange={(e, newValue) => setState(prev => ({ ...prev, reportsTab: newValue }))}>
                  <Tab label="Reports" value="reports" />
                  <Tab label="Analytics" value="analytics" />
                </Tabs>
              </Box>

              {state.reportsTab === 'reports' && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">All Reports</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Typography variant="body2" color="text.secondary">▼</Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: brandColors.primary,
                        '&:hover': { backgroundColor: brandColors.actions.primary }
                      }}
                    >
                      Create Report
                    </Button>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                    {/* N. Cal Income Statement */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        N. Cal Income Statement
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: Income Statement</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Kylee Report */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Kylee Report
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: Summary</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Lathan Performance */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Lathan Performance
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: Agent-Performance</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Jesse Performance */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Jesse Performance
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: Agent-Performance</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Summary Transactions */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Summary Transactions
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: Summary</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* General Ledger YTD */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        General Ledger YTD
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: General Ledger</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* 2022 Income Statement */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        2022 Income Statement
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Type: Income Statement</Typography>
                        <Box sx={{ width: 16, height: 16, backgroundColor: 'text.secondary', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: brandColors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Edit Report
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.actions.primary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              )}

              {state.reportsTab === 'analytics' && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>Analytics Dashboard</Typography>
                  <Typography variant="body1">
                    Advanced analytics and data visualization features will be implemented here.
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'tasks-reminders' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssignmentIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Tasks & Reminders
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage tasks, set reminders, and track completion deadlines
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                  sx={{ backgroundColor: brandColors.primary }}
                >
                  Create New Task
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssignmentIcon />
                </React.Suspense>}
                >
                  Import Tasks
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>}
                >
                  Bulk Complete
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>}
                >
                  More Actions
                </Button>
              </Box>

              {/* Task Statistics */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    24
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                    8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Today
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.error, fontWeight: 'bold' }}>
                    4
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue
                  </Typography>
                </Paper>
              </Box>

              {/* Task Filters and Search */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Search tasks..."
                    InputProps={{
                      startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                    }}
                    sx={{ minWidth: 250 }}
                  />
                  <TextField
                    size="small"
                    select
                    defaultValue="all"
                    label="Status"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </TextField>
                  <TextField
                    size="small"
                    select
                    defaultValue="all"
                    label="Priority"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </TextField>
                  <TextField
                    size="small"
                    select
                    defaultValue="all"
                    label="Assignee"
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="all">All Assignees</MenuItem>
                    <MenuItem value="sarah">Sarah Johnson</MenuItem>
                    <MenuItem value="mike">Mike Wilson</MenuItem>
                    <MenuItem value="lisa">Lisa Brown</MenuItem>
                    <MenuItem value="david">David Lee</MenuItem>
                    <MenuItem value="emily">Emily Davis</MenuItem>
                  </TextField>
                </Box>
              </Paper>

              {/* Task List */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Active Tasks
                </Typography>
                
                <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                  {[
                    { 
                      id: 1, 
                      title: 'Review Purchase Agreement for 123 Main St', 
                      description: 'Review and approve the purchase agreement before sending to client',
                      assignee: 'Sarah Johnson',
                      priority: 'high',
                      status: 'pending',
                      dueDate: '2024-01-20',
                      category: 'Legal Review',
                      progress: 0
                    },
                    { 
                      id: 2, 
                      title: 'Schedule Property Inspection', 
                      description: 'Coordinate with inspector and client for property inspection',
                      assignee: 'Mike Wilson',
                      priority: 'medium',
                      status: 'in-progress',
                      dueDate: '2024-01-22',
                      category: 'Property',
                      progress: 60
                    },
                    { 
                      id: 3, 
                      title: 'Prepare Closing Documents', 
                      description: 'Gather and prepare all necessary closing documents',
                      assignee: 'Lisa Brown',
                      priority: 'high',
                      status: 'pending',
                      dueDate: '2024-01-19',
                      category: 'Closing',
                      progress: 25
                    },
                    { 
                      id: 4, 
                      title: 'Follow up on Loan Approval', 
                      description: 'Check status of loan approval with lender',
                      assignee: 'David Lee',
                      priority: 'medium',
                      status: 'in-progress',
                      dueDate: '2024-01-25',
                      category: 'Financing',
                      progress: 80
                    },
                    { 
                      id: 5, 
                      title: 'Update MLS Listing', 
                      description: 'Update property photos and description on MLS',
                      assignee: 'Emily Davis',
                      priority: 'low',
                      status: 'pending',
                      dueDate: '2024-01-28',
                      category: 'Marketing',
                      progress: 0
                    },
                    { 
                      id: 6, 
                      title: 'Client Meeting Preparation', 
                      description: 'Prepare presentation materials for client meeting',
                      assignee: 'Sarah Johnson',
                      priority: 'high',
                      status: 'pending',
                      dueDate: '2024-01-18',
                      category: 'Client Relations',
                      progress: 40
                    }
                  ].map((task) => (
                    <Card key={task.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {task.title}
                              </Typography>
                              <Chip 
                                label={task.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {task.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                              <Typography variant="body2" color="text.secondary">
                                Assignee: {task.assignee}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Due: {task.dueDate}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Progress: {task.progress}%
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progress
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {task.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={task.progress} 
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                            <Chip 
                              label={task.priority} 
                              color={
                                task.priority === 'high' ? 'error' :
                                task.priority === 'medium' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                            <Chip 
                              label={task.status} 
                              color={
                                task.status === 'completed' ? 'success' :
                                task.status === 'in-progress' ? 'primary' :
                                task.status === 'overdue' ? 'error' : 'default'
                              }
                              size="small"
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button size="small" variant="outlined">
                                Edit
                              </Button>
                              <Button size="small" variant="contained">
                                {task.status === 'completed' ? 'Reopen' : 'Complete'}
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Reminders Section */}
              <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Upcoming Reminders
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      id: 1, 
                      title: 'Client Follow-up Call', 
                      time: '2024-01-20 10:00 AM',
                      type: 'Phone Call',
                      client: 'John Smith',
                      property: '123 Main St'
                    },
                    { 
                      id: 2, 
                      title: 'Document Review Deadline', 
                      time: '2024-01-21 5:00 PM',
                      type: 'Deadline',
                      client: 'Emily Davis',
                      property: '456 Oak Ave'
                    },
                    { 
                      id: 3, 
                      title: 'Inspection Report Due', 
                      time: '2024-01-22 2:00 PM',
                      type: 'Report',
                      client: 'Mike Wilson',
                      property: '789 Pine Rd'
                    },
                    { 
                      id: 4, 
                      title: 'Closing Date Reminder', 
                      time: '2024-01-25 9:00 AM',
                      type: 'Closing',
                      client: 'Lisa Brown',
                      property: '321 Elm St'
                    }
                  ].map((reminder) => (
                    <Card key={reminder.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary 
                        }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {reminder.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {reminder.time} • {reminder.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reminder.client} • {reminder.property}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                        </IconButton>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Box>
          </>
        )}

        {state.activeTab === 'checklists' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Checklists
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Create and manage checklists for various business processes and transactions
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                  sx={{ backgroundColor: brandColors.primary }}
                >
                  Create New Checklist
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssignmentIcon />
                </React.Suspense>}
                >
                  Import Templates
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>}
                >
                  Bulk Actions
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>}
                >
                  More Actions
                </Button>
              </Box>

              {/* Checklist Statistics */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    18
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Checklists
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                    6
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Today
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed This Week
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                    95%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </Paper>
              </Box>

              {/* Checklist Categories */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Checklist Categories
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                  {[
                    { name: 'Transaction Closing', count: 8, color: 'primary', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>, description: 'Complete closing process checklists' },
                    { name: 'Property Management', count: 5, color: 'success', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>, description: 'Property maintenance and management' },
                    { name: 'Client Onboarding', count: 3, color: 'info', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>, description: 'New client setup and documentation' },
                    { name: 'Compliance & Legal', count: 2, color: 'warning', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>, description: 'Regulatory compliance requirements' }
                  ].map((category) => (
                    <Box key={category.name}>
                      <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ color: (brandColors as any)[category.color], mb: 2 }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {category.name}
                          </Typography>
                          <Typography variant="h4" sx={{ color: (brandColors as any)[category.color], fontWeight: 'bold', mb: 1 }}>
                            {category.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Checklists
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {category.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Active Checklists */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Active Checklists
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search checklists..."
                    InputProps={{
                      startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                    }}
                    sx={{ minWidth: 250 }}
                  />
                </Box>
                
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {[
                    { 
                      id: 1, 
                      title: 'Property Closing Checklist - 123 Main St', 
                      category: 'Transaction Closing',
                      assignee: 'Sarah Johnson',
                      progress: 75,
                      totalItems: 24,
                      completedItems: 18,
                      dueDate: '2024-01-25',
                      priority: 'high'
                    },
                    { 
                      id: 2, 
                      title: 'New Client Onboarding - John Smith', 
                      category: 'Client Onboarding',
                      assignee: 'Mike Wilson',
                      progress: 45,
                      totalItems: 18,
                      completedItems: 8,
                      dueDate: '2024-01-22',
                      priority: 'medium'
                    },
                    { 
                      id: 3, 
                      title: 'Property Management - 456 Oak Ave', 
                      category: 'Property Management',
                      assignee: 'Lisa Brown',
                      progress: 90,
                      totalItems: 15,
                      completedItems: 14,
                      dueDate: '2024-01-20',
                      priority: 'low'
                    },
                    { 
                      id: 4, 
                      title: 'Compliance Review - Q4 2024', 
                      category: 'Compliance & Legal',
                      assignee: 'David Lee',
                      progress: 30,
                      totalItems: 32,
                      completedItems: 10,
                      dueDate: '2024-01-31',
                      priority: 'high'
                    },
                    { 
                      id: 5, 
                      title: 'Lease Renewal - 789 Pine Rd', 
                      category: 'Property Management',
                      assignee: 'Emily Davis',
                      progress: 60,
                      totalItems: 20,
                      completedItems: 12,
                      dueDate: '2024-01-28',
                      priority: 'medium'
                    }
                  ].map((checklist) => (
                    <Card key={checklist.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {checklist.title}
                              </Typography>
                              <Chip 
                                label={checklist.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                              <Typography variant="body2" color="text.secondary">
                                Assignee: {checklist.assignee}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Due: {checklist.dueDate}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Items: {checklist.completedItems}/{checklist.totalItems}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progress
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {checklist.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={checklist.progress} 
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                            <Chip 
                              label={checklist.priority} 
                              color={
                                checklist.priority === 'high' ? 'error' :
                                checklist.priority === 'medium' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                              <Button size="small" variant="contained">
                                Continue
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Checklist Templates */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Checklist Templates
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      title: 'Standard Property Closing', 
                      category: 'Transaction Closing',
                      items: 24,
                      estimatedTime: '2-3 hours',
                      usage: 156,
                      description: 'Complete checklist for standard property closing process'
                    },
                    { 
                      title: 'New Agent Onboarding', 
                      category: 'Client Onboarding',
                      items: 18,
                      estimatedTime: '1-2 days',
                      usage: 23,
                      description: 'Comprehensive onboarding checklist for new agents'
                    },
                    { 
                      title: 'Property Management Monthly', 
                      category: 'Property Management',
                      items: 15,
                      estimatedTime: '1-2 hours',
                      usage: 89,
                      description: 'Monthly property management and maintenance tasks'
                    },
                    { 
                      title: 'Compliance Review Quarterly', 
                      category: 'Compliance & Legal',
                      items: 32,
                      estimatedTime: '4-6 hours',
                      usage: 12,
                      description: 'Quarterly compliance and legal review checklist'
                    },
                    { 
                      title: 'Lease Renewal Process', 
                      category: 'Property Management',
                      items: 20,
                      estimatedTime: '2-3 hours',
                      usage: 45,
                      description: 'Complete lease renewal and negotiation checklist'
                    },
                    { 
                      title: 'High-Value Transaction', 
                      category: 'Transaction Closing',
                      items: 28,
                      estimatedTime: '3-4 hours',
                      usage: 67,
                      description: 'Enhanced checklist for high-value property transactions'
                    }
                  ].map((template, index) => (
                    <Card key={index} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip label={template.category} color="primary" size="small" />
                          <IconButton size="small">
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {template.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {template.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {template.items} items
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.estimatedTime}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Used {template.usage} times
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            Use Template
                          </Button>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            Customize
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Box>
          </>
        )}

        {state.activeTab === 'compliance' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Compliance
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage regulatory compliance, audit requirements, and risk monitoring
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>}
                  sx={{ backgroundColor: brandColors.primary }}
                >
                  New Compliance Review
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>}
                >
                  Generate Audit Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>}
                >
                  Risk Assessment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>}
                >
                  More Actions
                </Button>
              </Box>

              {/* Compliance Overview Statistics */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    95%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Score
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Reviews
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.error, fontWeight: 'bold' }}>
                    1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Risk Items
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                    28
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days to Next Audit
                  </Typography>
                </Paper>
              </Box>

              {/* Compliance Categories */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Compliance Categories
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                  {[
                    { name: 'Real Estate Law', status: 'Compliant', score: 98, color: 'success', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>, lastReview: '2024-01-10' },
                    { name: 'Financial Regulations', status: 'Under Review', score: 85, color: 'warning', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>, lastReview: '2024-01-15' },
                    { name: 'Data Privacy', status: 'Compliant', score: 92, color: 'success', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>, lastReview: '2024-01-08' },
                    { name: 'Anti-Money Laundering', status: 'Compliant', score: 96, color: 'success', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>, lastReview: '2024-01-12' }
                  ].map((category) => (
                    <Box key={category.name}>
                      <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ color: (brandColors as any)[category.color], mb: 2 }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {category.name}
                          </Typography>
                          <Typography variant="h4" sx={{ color: (brandColors as any)[category.color], fontWeight: 'bold', mb: 1 }}>
                            {category.score}%
                          </Typography>
                          <Chip 
                            label={category.status} 
                            color={category.status === 'Compliant' ? 'success' : 'warning'}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Last Review: {category.lastReview}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Active Compliance Issues */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Active Compliance Issues
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search issues..."
                    InputProps={{
                      startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                    }}
                    sx={{ minWidth: 250 }}
                  />
                </Box>
                
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {[
                    { 
                      id: 1, 
                      title: 'Financial Disclosure Requirements Update', 
                      category: 'Financial Regulations',
                      priority: 'high',
                      status: 'Under Review',
                      assignee: 'David Lee',
                      dueDate: '2024-01-25',
                      description: 'New financial disclosure requirements need to be implemented across all transactions',
                      riskLevel: 'High'
                    },
                    { 
                      id: 2, 
                      title: 'Data Retention Policy Review', 
                      category: 'Data Privacy',
                      priority: 'medium',
                      status: 'Pending',
                      assignee: 'Sarah Johnson',
                      dueDate: '2024-01-30',
                      description: 'Review and update data retention policies to ensure GDPR compliance',
                      riskLevel: 'Medium'
                    },
                    { 
                      id: 3, 
                      title: 'AML Training Certification', 
                      category: 'Anti-Money Laundering',
                      priority: 'medium',
                      status: 'In Progress',
                      assignee: 'Mike Wilson',
                      dueDate: '2024-01-28',
                      description: 'Complete annual AML training certification for all agents',
                      riskLevel: 'Medium'
                    },
                    { 
                      id: 4, 
                      title: 'Contract Template Updates', 
                      category: 'Real Estate Law',
                      priority: 'low',
                      status: 'Pending',
                      assignee: 'Lisa Brown',
                      dueDate: '2024-02-05',
                      description: 'Update contract templates to reflect recent legal changes',
                      riskLevel: 'Low'
                    }
                  ].map((issue) => (
                    <Card key={issue.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {issue.title}
                              </Typography>
                              <Chip 
                                label={issue.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {issue.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                              <Typography variant="body2" color="text.secondary">
                                Assignee: {issue.assignee}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Due: {issue.dueDate}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Risk Level: {issue.riskLevel}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                            <Chip 
                              label={issue.priority} 
                              color={
                                issue.priority === 'high' ? 'error' :
                                issue.priority === 'medium' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                            <Chip 
                              label={issue.status} 
                              color={
                                issue.status === 'Under Review' ? 'warning' :
                                issue.status === 'In Progress' ? 'primary' :
                                issue.status === 'Pending' ? 'default' : 'success'
                              }
                              size="small"
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                              <Button size="small" variant="contained">
                                Take Action
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Audit Schedule */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Upcoming Audits & Reviews
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      id: 1, 
                      title: 'Annual Financial Compliance Audit', 
                      type: 'External Audit',
                      date: '2024-02-15',
                      auditor: 'Deloitte & Associates',
                      scope: 'Financial transactions, reporting, and compliance',
                      status: 'Scheduled',
                      preparationDays: 28
                    },
                    { 
                      id: 2, 
                      title: 'Real Estate License Renewal Review', 
                      type: 'Regulatory Review',
                      date: '2024-03-01',
                      auditor: 'State Real Estate Commission',
                      scope: 'License compliance, continuing education, and record keeping',
                      status: 'Preparation Required',
                      preparationDays: 42
                    },
                    { 
                      id: 3, 
                      title: 'Data Privacy Compliance Review', 
                      type: 'Internal Review',
                      date: '2024-01-30',
                      auditor: 'Internal Compliance Team',
                      scope: 'Data handling, privacy policies, and GDPR compliance',
                      status: 'In Progress',
                      preparationDays: 5
                    },
                    { 
                      id: 4, 
                      title: 'AML Program Assessment', 
                      type: 'Regulatory Review',
                      date: '2024-04-15',
                      auditor: 'Federal Financial Institutions',
                      scope: 'Anti-money laundering procedures and training',
                      status: 'Scheduled',
                      preparationDays: 88
                    }
                  ].map((audit) => (
                    <Card key={audit.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: 
                            audit.status === 'Scheduled' ? brandColors.accent.info :
                            audit.status === 'In Progress' ? brandColors.actions.warning :
                            brandColors.actions.error
                        }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {audit.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {audit.type} • {audit.date} • {audit.auditor}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scope: {audit.scope}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={audit.status} 
                            size="small"
                            color={
                              audit.status === 'Scheduled' ? 'info' :
                              audit.status === 'In Progress' ? 'warning' :
                              'error'
                            }
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {audit.preparationDays} days to prepare
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Compliance Reports */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Compliance Reports & Documentation
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      title: 'Q4 2024 Compliance Report', 
                      type: 'Quarterly Report',
                      status: 'Completed',
                      date: '2024-01-05',
                      size: '2.4 MB',
                      description: 'Comprehensive quarterly compliance assessment and findings'
                    },
                    { 
                      title: 'Annual Risk Assessment', 
                      type: 'Risk Analysis',
                      status: 'In Progress',
                      date: '2024-01-15',
                      size: '1.8 MB',
                      description: 'Annual risk assessment and mitigation strategy report'
                    },
                    { 
                      title: 'Data Privacy Impact Assessment', 
                      type: 'Privacy Review',
                      status: 'Pending Review',
                      date: '2024-01-20',
                      size: '3.1 MB',
                      description: 'Assessment of data privacy practices and GDPR compliance'
                    },
                    { 
                      title: 'AML Training Records', 
                      type: 'Training Documentation',
                      status: 'Completed',
                      date: '2024-01-10',
                      size: '0.9 MB',
                      description: 'Complete records of AML training completion for all agents'
                    },
                    { 
                      title: 'Regulatory Change Log', 
                      type: 'Change Tracking',
                      status: 'Updated',
                      date: '2024-01-18',
                      size: '0.5 MB',
                      description: 'Log of regulatory changes and implementation status'
                    },
                    { 
                      title: 'Compliance Policy Manual', 
                      type: 'Policy Document',
                      status: 'Under Review',
                      date: '2024-01-22',
                      size: '5.2 MB',
                      description: 'Comprehensive compliance policy and procedure manual'
                    }
                  ].map((report, index) => (
                    <Card key={index} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip label={report.type} color="primary" size="small" />
                          <IconButton size="small">
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {report.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {report.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {report.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {report.size}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            View
                          </Button>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            Download
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Box>
          </>
        )}

        {state.activeTab === 'training-resources' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Training & Resources
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Access training materials, resources, and professional development tools
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              {/* Tabs Navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={state.trainingTab || 'overview'} onChange={(e, newValue) => setState(prev => ({ ...prev, trainingTab: newValue }))}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="Courses" value="courses" />
                  <Tab label="Resources" value="resources" />
                  <Tab label="Development Paths" value="paths" />
                  <Tab label="Achievements" value="achievements" />
                  <Tab label="Management" value="management" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              {(state.trainingTab === 'overview' || !state.trainingTab) && (
                <>
                  {/* Quick Actions */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>}
                      sx={{ backgroundColor: brandColors.primary }}
                    >
                      Enroll in Course
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>}
                    >
                      Take Assessment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssignmentIcon />
                </React.Suspense>}
                    >
                      Download Resources
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>}
                    >
                      More Actions
                    </Button>
                  </Box>

              {/* Learning Progress Overview */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    78%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Courses Completed
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Courses
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                    156
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CE Credits Earned
                  </Typography>
                </Paper>
              </Box>

              {/* Featured Courses */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Featured Courses
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      title: 'Advanced Real Estate Law', 
                      category: 'Legal',
                      instructor: 'Prof. Sarah Johnson',
                      duration: '8 weeks',
                      level: 'Advanced',
                      rating: 4.8,
                      students: 245,
                      progress: 0,
                      description: 'Comprehensive course covering advanced real estate legal principles and case studies'
                    },
                    { 
                      title: 'Digital Marketing for Real Estate', 
                      category: 'Marketing',
                      instructor: 'Mike Wilson',
                      duration: '6 weeks',
                      level: 'Intermediate',
                      rating: 4.6,
                      students: 189,
                      progress: 65,
                      description: 'Learn modern digital marketing strategies specifically for real estate professionals'
                    },
                    { 
                      title: 'Financial Analysis & Investment', 
                      category: 'Finance',
                      instructor: 'Dr. Lisa Brown',
                      duration: '10 weeks',
                      level: 'Advanced',
                      rating: 4.9,
                      students: 156,
                      progress: 0,
                      description: 'Advanced financial analysis techniques for real estate investment decisions'
                    },
                    { 
                      title: 'Client Relationship Management', 
                      category: 'Sales',
                      instructor: 'Emily Davis',
                      duration: '4 weeks',
                      level: 'Beginner',
                      rating: 4.7,
                      students: 312,
                      progress: 0,
                      description: 'Build and maintain strong client relationships for long-term success'
                    },
                    { 
                      title: 'Property Management Essentials', 
                      category: 'Management',
                      instructor: 'David Lee',
                      duration: '7 weeks',
                      level: 'Intermediate',
                      rating: 4.5,
                      students: 178,
                      progress: 0,
                      description: 'Essential skills for effective property management and tenant relations'
                    },
                    { 
                      title: 'Negotiation Mastery', 
                      category: 'Sales',
                      instructor: 'Robert Chen',
                      duration: '5 weeks',
                      level: 'Intermediate',
                      rating: 4.8,
                      students: 203,
                      progress: 0,
                      description: 'Master negotiation techniques for successful real estate transactions'
                    }
                  ].map((course, index) => (
                    <Card key={index} sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip label={course.category} color="primary" size="small" />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {course.rating}
                            </Typography>
                            <Box sx={{ color: '#ffc107', fontSize: 16 }}>★</Box>
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {course.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary">
                            {course.instructor}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.duration}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.level}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {course.students} students enrolled
                          </Typography>
                          {course.progress > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {course.progress}% complete
                            </Typography>
                          )}
                        </Box>
                        {course.progress > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={course.progress} 
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ flex: 1 }}>
                            {course.progress > 0 ? 'Continue' : 'Enroll'}
                          </Button>
                          <Button size="small" variant="outlined">
                            Preview
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Resource Library */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Resource Library
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search resources..."
                    InputProps={{
                      startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                    }}
                    sx={{ minWidth: 250 }}
                  />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      name: 'Contract Templates', 
                      category: 'Legal',
                      count: 45,
                      color: 'primary',
                      icon: <React.Suspense fallback={<Box />}><LazyDescriptionIcon /></React.Suspense>,
                      description: 'Standard contract templates and forms'
                    },
                    { 
                      name: 'Marketing Materials', 
                      category: 'Marketing',
                      count: 32,
                      color: 'success',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>,
                      description: 'Brochures, flyers, and presentation templates'
                    },
                    { 
                      name: 'Training Videos', 
                      category: 'Training',
                      count: 78,
                      color: 'info',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>,
                      description: 'Video tutorials and training content'
                    },
                    { 
                      name: 'Compliance Guides', 
                      category: 'Compliance',
                      count: 23,
                      color: 'warning',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>,
                      description: 'Regulatory compliance documentation'
                    },
                    { 
                      name: 'Financial Calculators', 
                      category: 'Tools',
                      count: 15,
                      color: 'error',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>,
                      description: 'Financial analysis and calculation tools'
                    },
                    { 
                      name: 'Best Practices', 
                      category: 'Guidelines',
                      count: 67,
                      color: 'secondary',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>,
                      description: 'Industry best practices and guidelines'
                    },
                    { 
                      name: 'Case Studies', 
                      category: 'Learning',
                      count: 34,
                      color: 'primary',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>,
                      description: 'Real-world case studies and examples'
                    },
                    { 
                      name: 'Webinar Recordings', 
                      category: 'Training',
                      count: 89,
                      color: 'info',
                      icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>,
                      description: 'Recorded webinars and presentations'
                    }
                  ].map((resource) => (
                    <Box key={resource.name}>
                      <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ color: (brandColors as any)[resource.color], mb: 2 }}>
                            {resource.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {resource.name}
                          </Typography>
                          <Typography variant="h4" sx={{ color: (brandColors as any)[resource.color], fontWeight: 'bold', mb: 1 }}>
                            {resource.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Resources
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Professional Development Paths */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Professional Development Paths
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      title: 'Real Estate Specialist', 
                      level: 'Intermediate',
                      courses: 8,
                      duration: '6-8 months',
                      description: 'Comprehensive path for real estate professionals looking to specialize',
                      skills: ['Advanced Negotiation', 'Market Analysis', 'Client Management', 'Legal Compliance'],
                      progress: 75
                    },
                    { 
                      title: 'Property Management Expert', 
                      level: 'Advanced',
                      courses: 12,
                      duration: '8-10 months',
                      description: 'Advanced certification for property management professionals',
                      skills: ['Portfolio Management', 'Financial Analysis', 'Tenant Relations', 'Maintenance Planning'],
                      progress: 45
                    },
                    { 
                      title: 'Investment Advisor', 
                      level: 'Expert',
                      courses: 15,
                      duration: '10-12 months',
                      description: 'Expert-level path for real estate investment professionals',
                      skills: ['Investment Analysis', 'Risk Management', 'Portfolio Optimization', 'Market Forecasting'],
                      progress: 30
                    },
                    { 
                      title: 'Sales & Marketing Leader', 
                      level: 'Advanced',
                      courses: 10,
                      duration: '7-9 months',
                      description: 'Leadership path for sales and marketing professionals',
                      skills: ['Team Leadership', 'Strategic Planning', 'Digital Marketing', 'Performance Management'],
                      progress: 60
                    }
                  ].map((path, index) => (
                    <Card key={index} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {path.title}
                        </Typography>
                        <Chip label={path.level} color="primary" size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {path.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary">
                          {path.courses} courses
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {path.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Key Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {path.skills.map((skill, skillIndex) => (
                            <Chip key={skillIndex} label={skill} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {path.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={path.progress} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Button variant="contained" fullWidth>
                        Continue Path
                      </Button>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Recent Achievements */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Recent Achievements & Certifications
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      title: 'Advanced Real Estate Law', 
                      type: 'Course Completion',
                      date: '2024-01-15',
                      instructor: 'Prof. Sarah Johnson',
                      ceCredits: 12,
                      description: 'Successfully completed advanced legal principles course'
                    },
                    { 
                      title: 'Digital Marketing Certification', 
                      type: 'Professional Certification',
                      date: '2024-01-10',
                      instructor: 'Mike Wilson',
                      ceCredits: 8,
                      description: 'Earned professional certification in digital marketing'
                    },
                    { 
                      title: 'Client Management Excellence', 
                      type: 'Skill Badge',
                      date: '2024-01-08',
                      instructor: 'Emily Davis',
                      ceCredits: 6,
                      description: 'Demonstrated excellence in client relationship management'
                    },
                    { 
                      title: 'Financial Analysis Mastery', 
                      type: 'Course Completion',
                      date: '2024-01-05',
                      instructor: 'Dr. Lisa Brown',
                      ceCredits: 15,
                      description: 'Completed comprehensive financial analysis course'
                    },
                    { 
                      title: 'Negotiation Skills', 
                      type: 'Assessment Passed',
                      date: '2024-01-03',
                      instructor: 'Robert Chen',
                      ceCredits: 4,
                      description: 'Successfully passed advanced negotiation assessment'
                    },
                    { 
                      title: 'Property Management Basics', 
                      type: 'Course Completion',
                      date: '2023-12-28',
                      instructor: 'David Lee',
                      ceCredits: 10,
                      description: 'Completed foundational property management course'
                    }
                  ].map((achievement, index) => (
                    <Card key={index} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip label={achievement.type} color="success" size="small" />
                          <IconButton size="small">
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {achievement.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary">
                            {achievement.instructor}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {achievement.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {achievement.ceCredits} CE Credits
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            View Certificate
                          </Button>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            Share
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
              
              {/* Close Overview tab fragment */}
              </>
            )}

            {/* Additional Tab Content Sections */}
              {state.trainingTab === 'courses' && (
                <>
                  {/* Courses Management Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      Course Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                      sx={{ backgroundColor: brandColors.primary }}
                    >
                      Add New Course
                    </Button>
                  </Box>

                  {/* Course Statistics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        24
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Courses
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        18
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Courses
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        6
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Draft Courses
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Enrollments
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}

              {state.trainingTab === 'resources' && (
                <>
                  {/* Resources Management Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      Resource Library Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                      sx={{ backgroundColor: brandColors.primary }}
                    >
                      Upload Resource
                    </Button>
                  </Box>

                  {/* Resource Statistics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        456
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Resources
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        89
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Downloads This Month
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        New This Week
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Categories
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}

              {state.trainingTab === 'paths' && (
                <>
                  {/* Development Paths Management Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      Professional Development Paths
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>}
                      sx={{ backgroundColor: brandColors.primary }}
                    >
                      Create New Path
                    </Button>
                  </Box>

                  {/* Path Statistics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Paths
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        45
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Learners
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed This Month
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        67%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Completion
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}

              {state.trainingTab === 'achievements' && (
                <>
                  {/* Achievements Management Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      Achievements & Certifications
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>}
                      sx={{ backgroundColor: brandColors.primary }}
                    >
                      Issue Certificate
                    </Button>
                  </Box>

                  {/* Achievement Statistics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        89
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Achievements
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This Month
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        CE Credits Issued
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Certification Types
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}

              {state.trainingTab === 'management' && (
                <>
                  {/* Training Management Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      Training Program Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySettingsIcon />
                </React.Suspense>}
                      sx={{ backgroundColor: brandColors.primary }}
                    >
                      Program Settings
                    </Button>
                  </Box>

                  {/* Management Statistics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        24
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Learners
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        78%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Program Completion Rate
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        4.2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Rating
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total CE Credits
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </Box>
          </>
        )}

        {state.activeTab === 'messages' && (
          <BrokerageMessages />
        )}

        {state.activeTab === 'support' && (
          <>
            {/* Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySupportIcon />
                </React.Suspense>
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Support
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Get help and support for your brokerage operations
              </Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySupportIcon />
                </React.Suspense>}
                  sx={{ backgroundColor: brandColors.primary }}
                >
                  Create Support Ticket
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>}
                >
                  View Documentation
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>}
                >
                  Contact Support
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>}
                >
                  More Actions
                </Button>
              </Box>

              {/* Support Statistics */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Tickets
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    89
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved This Month
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                    2.3h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Response Time
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                    98%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Satisfaction Rate
                  </Typography>
                </Paper>
              </Box>

              {/* Support Categories */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Support Categories
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                  {[
                    { name: 'Technical Issues', count: 8, color: 'error', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySettingsIcon />
                </React.Suspense>, description: 'Software and system problems' },
                    { name: 'Account Management', count: 5, color: 'primary', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>, description: 'User accounts and permissions' },
                    { name: 'Training & Onboarding', count: 12, color: 'success', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>, description: 'Learning and setup assistance' },
                    { name: 'Billing & Payments', count: 3, color: 'warning', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>, description: 'Financial and payment issues' }
                  ].map((category) => (
                    <Box key={category.name}>
                      <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ color: (brandColors as any)[category.color], mb: 2 }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {category.name}
                          </Typography>
                          <Typography variant="h4" sx={{ color: (brandColors as any)[category.color], fontWeight: 'bold', mb: 1 }}>
                            {category.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Tickets
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {category.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Active Support Tickets */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Active Support Tickets
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search tickets..."
                    InputProps={{
                      startAdornment: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>
                    }}
                    sx={{ minWidth: 250 }}
                  />
                </Box>
                
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {[
                    { 
                      id: 1, 
                      title: 'Login Authentication Error', 
                      category: 'Technical Issues',
                      priority: 'high',
                      status: 'In Progress',
                      assignee: 'Tech Support Team',
                      submitted: '2024-01-15',
                      description: 'Unable to log in to the system, getting authentication error'
                    },
                    { 
                      id: 2, 
                      title: 'New Agent Onboarding Request', 
                      category: 'Training & Onboarding',
                      priority: 'medium',
                      status: 'Open',
                      assignee: 'Training Team',
                      submitted: '2024-01-14',
                      description: 'Need assistance setting up new agent account and training materials'
                    },
                    { 
                      id: 3, 
                      title: 'Payment Processing Issue', 
                      category: 'Billing & Payments',
                      priority: 'high',
                      status: 'Under Review',
                      assignee: 'Billing Team',
                      submitted: '2024-01-13',
                      description: 'Credit card payment failed during transaction processing'
                    },
                    { 
                      id: 4, 
                      title: 'Report Generation Problem', 
                      category: 'Technical Issues',
                      priority: 'low',
                      status: 'Open',
                      assignee: 'Tech Support Team',
                      submitted: '2024-01-12',
                      description: 'Monthly performance report not generating properly'
                    },
                    { 
                      id: 5, 
                      title: 'Permission Access Request', 
                      category: 'Account Management',
                      priority: 'medium',
                      status: 'In Progress',
                      assignee: 'Admin Team',
                      submitted: '2024-01-11',
                      description: 'Need elevated permissions for financial reporting access'
                    }
                  ].map((ticket) => (
                    <Card key={ticket.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {ticket.title}
                              </Typography>
                              <Chip 
                                label={ticket.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {ticket.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                              <Typography variant="body2" color="text.secondary">
                                Assignee: {ticket.assignee}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Submitted: {ticket.submitted}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Status: {ticket.status}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                            <Chip 
                              label={ticket.priority} 
                              color={
                                ticket.priority === 'high' ? 'error' :
                                ticket.priority === 'medium' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                            <Chip 
                              label={ticket.status} 
                              color={
                                ticket.status === 'In Progress' ? 'primary' :
                                ticket.status === 'Open' ? 'warning' :
                                ticket.status === 'Under Review' ? 'info' : 'success'
                              }
                              size="small"
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                              <Button size="small" variant="contained">
                                Update Status
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Knowledge Base & Resources */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 4,
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Knowledge Base & Resources
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {[
                    { 
                      title: 'Getting Started Guide', 
                      type: 'User Manual',
                      category: 'Training',
                      views: 156,
                      lastUpdated: '2024-01-10',
                      description: 'Complete guide for new users to get started with the platform'
                    },
                    { 
                      title: 'Troubleshooting Common Issues', 
                      type: 'FAQ',
                      category: 'Technical',
                      views: 89,
                      lastUpdated: '2024-01-08',
                      description: 'Solutions to frequently encountered problems and errors'
                    },
                    { 
                      title: 'API Documentation', 
                      type: 'Technical Guide',
                      category: 'Development',
                      views: 45,
                      lastUpdated: '2024-01-05',
                      description: 'Complete API reference and integration examples'
                    },
                    { 
                      title: 'Best Practices Guide', 
                      type: 'Guidelines',
                      category: 'Operations',
                      views: 234,
                      lastUpdated: '2024-01-12',
                      description: 'Recommended practices for optimal platform usage'
                    },
                    { 
                      title: 'Video Tutorials', 
                      type: 'Training',
                      category: 'Learning',
                      views: 178,
                      lastUpdated: '2024-01-15',
                      description: 'Step-by-step video guides for key platform features'
                    },
                    { 
                      title: 'Release Notes', 
                      type: 'Documentation',
                      category: 'Updates',
                      views: 67,
                      lastUpdated: '2024-01-18',
                      description: 'Latest platform updates and new feature announcements'
                    }
                  ].map((resource, index) => (
                    <Card key={index} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip label={resource.category} color="primary" size="small" />
                          <IconButton size="small">
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {resource.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {resource.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {resource.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {resource.views} views
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Last Updated: {resource.lastUpdated}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            View
                          </Button>
                          <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                            Download
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Contact Information */}
              <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                  Contact Support
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Support Channels
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary 
                        }} />
                        <Typography variant="body2">
                          Email: support@dreamery.com
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary 
                        }} />
                        <Typography variant="body2">
                          Phone: 1-800-DREAMERY
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary 
                        }} />
                        <Typography variant="body2">
                          Live Chat: Available 24/7
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary 
                        }} />
                        <Typography variant="body2">
                          Response Time: Within 2 hours
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Business Hours
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2">
                        Monday - Friday: 8:00 AM - 8:00 PM EST
                      </Typography>
                      <Typography variant="body2">
                        Saturday: 9:00 AM - 5:00 PM EST
                      </Typography>
                      <Typography variant="body2">
                        Sunday: 10:00 AM - 4:00 PM EST
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                        Emergency Support: Available 24/7
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </>
        )}
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsMenuAnchor}
        open={Boolean(notificationsMenuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          }
        }}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            New agent onboarding completed
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Monthly performance report ready
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            High-value transaction pending review
          </Typography>
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPersonIcon />
                </React.Suspense>
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySupportIcon />
                </React.Suspense>
          </ListItemIcon>
          Support
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkspacesBrokeragesPage;
