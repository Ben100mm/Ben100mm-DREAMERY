import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  TextField,
  FormControl,
  Select,
  Grid,
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
  Business as BusinessIcon,
  Flag as FlagIcon,
  IntegrationInstructions as IntegrationIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Print as PrintIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

// Import the actual components
import ClosingDashboard from '../components/close/closing-dashboard/ClosingDashboard';
import EscrowTitleHub from '../components/close/escrow-title-hub/EscrowTitleHub';
import { LazyDueDiligenceTools } from '../components/lazy';
import FinancingCoordination from '../components/close/financing/FinancingCoordination';
import LegalCompliance from '../components/close/legal-compliance/LegalCompliance';
import SettlementClosingCosts from '../components/close/settlement/SettlementClosingCosts';
import InsuranceUtilities from '../components/close/insurance-utilities/InsuranceUtilities';
import FinalWalkthroughHandover from '../components/close/walkthrough/FinalWalkthroughHandover';
import PostClosingServices from '../components/close/post-closing/PostClosingServices';
import AIClosingAssistant from '../components/close/assistant/ClosingAssistant';
import PartnerIntegrations from '../components/close/integrations/PartnerIntegrations';
import NotificationsSettingsPage from './NotificationsSettingsPage';
import { brandColors } from "../theme";
import ClosingAssistantIcon from '../components/close/ai-closing-assistant/ClosingAssistantIcon';
import { RoleContext } from '../context/RoleContext';

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
  userRole: UserRole;
  drawerOpen: boolean;
  notifications: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CloseBuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  console.log('CloseBuyerPage - userRole:', userRole, 'isBuyerAuthorized:', isBuyerAuthorized, 'allowedRoles:', allowedRoles);

  // Debug effect to log role changes
  useEffect(() => {
    console.log('CloseBuyerPage - userRole changed to:', userRole);
  }, [userRole]);

  const [state, setState] = useState<CloseState>({
    activeTab: 'dashboard',
    userRole: {
      id: '1',
      name: 'Buyer',
      permissions: ['view', 'edit', 'submit'],
      level: 'buyer'
    },
    drawerOpen: false,
    notifications: 3
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

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
    navigate('/close');
  };

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { value: 'escrow-title', label: 'Escrow & Title', icon: <SecurityIcon /> },
    { value: 'due-diligence', label: 'Due Diligence', icon: <SearchIcon /> },
    { value: 'financing', label: 'Financing', icon: <AccountBalanceIcon /> },
    { value: 'legal', label: 'Legal & Compliance', icon: <GavelIcon /> },
    { value: 'settlement', label: 'Settlement', icon: <CalculateIcon /> },
    { value: 'insurance', label: 'Insurance & Utilities', icon: <HomeIcon /> },
    { value: 'walkthrough', label: 'Walkthrough', icon: <CheckCircleIcon /> },
    { value: 'post-closing', label: 'Post-Closing', icon: <SupportIcon /> },
    { value: 'assistant', label: 'Closing Assistant', icon: <ClosingAssistantIcon size={20} variant="icon" /> },
    { value: 'integrations', label: 'Integrations', icon: <IntegrationIcon /> },
  ];

  const renderTabContent = () => {
    switch (state.activeTab) {
      case 'dashboard':
        return <ClosingDashboard />;
      case 'escrow-title':
        return <EscrowTitleHub />;
      case 'due-diligence':
        return <LazyDueDiligenceTools />;
      case 'financing':
        return <FinancingCoordination />;
      case 'legal':
        return <LegalCompliance />;
      case 'settlement':
        return <SettlementClosingCosts />;
      case 'insurance':
        return <InsuranceUtilities />;
      case 'walkthrough':
        return <FinalWalkthroughHandover />;
      case 'post-closing':
        return <PostClosingServices />;
      case 'assistant':
        return <AIClosingAssistant />;
      case 'integrations':
        return <PartnerIntegrations />;
      default:
        return <ClosingDashboard />;
    }
  };

  // If role is not yet known, render nothing until RoleContext resolves (RoleProvider shows loader)
  // Only redirect if we definitively know role is not allowed
  // Keep guard duplicated in rendered tree to satisfy hooks rule

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {!isBuyerAuthorized && userRole && <Navigate to="/" />}
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'white' }}>
            Dreamery Closing Hub
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={state.notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleUserMenuClick}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  J
                </Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title="Back to Close Hub">
              <IconButton
                color="inherit"
                onClick={handleBackToClose}
              >
                <ArrowBackIcon />
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
          {/* Station Button */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: brandColors.primary,
                color: 'white',
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

          {/* Navigation Tabs - Scrollable */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
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
                  <Box sx={{ color: brandColors.actions.primary }}>
                    {tab.icon}
                  </Box>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontWeight: state.activeTab === tab.value ? 'bold' : 'normal',
                      color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
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
        {/* Tab Content */}
        {state.activeTab === 'dashboard' ? (
          /* Dashboard Content */
          <>
            {/* Dashboard Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Closing Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Centralized overview of all closing activities and progress tracking
              </Typography>
            </Paper>

            {/* Overview Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, ml: 3 }}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: brandColors.primary, mb: 1 }}>
                  3
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Active Closings
                </Typography>
                <Chip label="On Track" color="success" size="small" />
              </Paper>
              
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: brandColors.primary, mb: 1 }}>
                  1
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Milestones Completed
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      backgroundColor: brandColors.backgrounds.secondary,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: '65%',
                        height: '100%',
                        backgroundColor: brandColors.primary,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                    65%
                  </Typography>
                </Box>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: brandColors.primary, mb: 1 }}>
                  2
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Timeline Events
                </Typography>
                <Chip label="2/5" color="primary" size="small" />
              </Paper>
              
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: brandColors.primary, mb: 1 }}>
                  2
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  At Risk
                </Typography>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: brandColors.actions.warning,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  2
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', ml: 3 }}>
            {/* Closing Timeline */}
            <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', minWidth: '400px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                  Closing Timeline
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                >
                  + Add Event
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: <CheckCircleIcon sx={{ color: 'green' }} />, title: 'Contract Signed', description: 'Purchase agreement executed by all parties', status: 'completed', date: '1/14/2024' },
                  { icon: <CheckCircleIcon sx={{ color: 'green' }} />, title: 'Home Inspection', description: 'Property inspection scheduled and completed', status: 'completed', date: '1/19/2024' },
                  { icon: <TimelineIcon sx={{ color: brandColors.accent.info }} />, title: 'Loan Approval', description: 'Mortgage pre-approval received from lender', status: 'in-progress', date: '1/24/2024' },
                  { icon: <TimelineIcon sx={{ color: brandColors.text.disabled }} />, title: 'Title Search', description: 'Title company conducting property research', status: 'pending', date: '1/31/2024' },
                  { icon: <TimelineIcon sx={{ color: brandColors.text.disabled }} />, title: 'Closing Date', description: '', status: 'pending', date: '2/14/2024' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ mt: 0.5 }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      {item.description && (
                        <Typography variant="body2" sx={{ color: brandColors.text.secondary, mb: 1 }}>
                          {item.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: item.status === 'completed' ? brandColors.backgrounds.success : 
                                           item.status === 'in-progress' ? brandColors.backgrounds.selected : 
                                           brandColors.backgrounds.secondary,
                            color: item.status === 'completed' ? brandColors.actions.success : 
                                   item.status === 'in-progress' ? brandColors.primary : 
                                   brandColors.text.secondary
                          }}
                        />
                        <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                          {item.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Key Milestones */}
            <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', minWidth: '400px' }}>
              <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 600, mb: 3 }}>
                Key Milestones
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { title: 'Complete Home Inspection', description: 'Schedule and complete property inspection', status: 'completed', dueDate: '1/19/2024', priority: 'high' },
                  { title: 'Obtain Loan Approval', description: 'Secure final mortgage approval', status: 'in-progress', dueDate: '1/29/2024', priority: 'high' },
                  { title: 'Title Search & Insurance', description: 'Complete title research and secure insurance', status: 'pending', dueDate: '2/4/2024', priority: 'medium' },
                  { title: 'Final Walkthrough', description: 'Conduct final property inspection', status: 'pending', dueDate: '2/9/2024', priority: 'medium' }
                ].map((milestone, index) => (
                  <Box key={index} sx={{ p: 2, border: `1px solid ${brandColors.borders.secondary}`, borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      {milestone.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text.secondary, mb: 1 }}>
                      {milestone.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip 
                        label={milestone.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: milestone.status === 'completed' ? brandColors.backgrounds.success : 
                                         milestone.status === 'in-progress' ? brandColors.backgrounds.selected : 
                                         brandColors.backgrounds.secondary,
                          color: milestone.status === 'completed' ? brandColors.actions.success : 
                                 milestone.status === 'in-progress' ? brandColors.primary : 
                                 brandColors.text.secondary
                        }}
                      />
                      <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                        Due: {milestone.dueDate}
                      </Typography>
                                               <Chip 
                           label={milestone.priority} 
                           size="small" 
                           sx={{ 
                             backgroundColor: milestone.priority === 'high' ? brandColors.backgrounds.error : 
                                            brandColors.backgrounds.warning,
                             color: milestone.priority === 'high' ? brandColors.actions.error : 
                                    brandColors.actions.warning
                           }}
                         />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
          </>
        ) : (
          /* Other Tab Content */
          <Box>
            {state.activeTab === 'escrow-title' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SecurityIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Escrow & Title Hub
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Manage escrow accounts, title searches, and title insurance
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <EscrowTitleHub />
                </Box>
              </>
            )}
            
            {state.activeTab === 'due-diligence' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SearchIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Due Diligence Tools
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Comprehensive property and legal research tools
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <LazyDueDiligenceTools />
                </Box>
              </>
            )}
            
            {state.activeTab === 'financing' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <AccountBalanceIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Financing Coordination
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Coordinate with lenders and manage funding processes
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <FinancingCoordination />
                </Box>
              </>
            )}
            
            {state.activeTab === 'legal' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <GavelIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Legal & Compliance
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Legal document preparation and regulatory compliance
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <LegalCompliance />
                </Box>
              </>
            )}
            
            {state.activeTab === 'settlement' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CalculateIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Settlement & Closing Costs
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Calculate and track all closing costs and settlement amounts
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <SettlementClosingCosts />
                </Box>
              </>
            )}
            
            {state.activeTab === 'insurance' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <HomeIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Insurance & Utilities
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Manage property insurance and utility transfers
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <InsuranceUtilities />
                </Box>
              </>
            )}
            
            {state.activeTab === 'walkthrough' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Final Walkthrough & Handover
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Final property inspection and key handover process
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <FinalWalkthroughHandover />
                </Box>
              </>
            )}
            
            {state.activeTab === 'post-closing' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SupportIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Post-Closing Services
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Ongoing support and services after closing
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <PostClosingServices />
                </Box>
              </>
            )}
            
            {state.activeTab === 'assistant' && (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: brandColors.primary,
                    borderRadius: '16px 16px 0 0',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <ClosingAssistantIcon size={28} color="white" />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Lumina
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Intelligent assistance for closing processes and decision making
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <AIClosingAssistant />
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
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <IntegrationIcon sx={{ fontSize: 28, color: 'white' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                      Partner Integrations
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Connect with third-party services and platforms
                  </Typography>
                </Paper>
                <Box sx={{ pl: 0, ml: 3 }}>
                  <PartnerIntegrations />
                </Box>
              </>
            )}
          </Box>
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
            Closing documents ready for review
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Title search completed
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Insurance quote received
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
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          Support
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CloseBuyerPage;
