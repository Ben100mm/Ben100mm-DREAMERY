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
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

// Import the actual components
import ClosingDashboard from '../components/close/closing-dashboard/ClosingDashboard';
import EscrowTitleHub from '../components/close/escrow-title-hub/EscrowTitleHub';
import DueDiligenceTools from '../components/close/due-diligence/DueDiligenceTools';
import FinancingCoordination from '../components/close/financing/FinancingCoordination';
import LegalCompliance from '../components/close/legal-compliance/LegalCompliance';
import SettlementClosingCosts from '../components/close/settlement/SettlementClosingCosts';
import InsuranceUtilities from '../components/close/insurance-utilities/InsuranceUtilities';
import FinalWalkthroughHandover from '../components/close/walkthrough/FinalWalkthroughHandover';
import PostClosingServices from '../components/close/post-closing/PostClosingServices';
import AIClosingAssistant from '../components/close/assistant/ClosingAssistant';
import PartnerIntegrations from '../components/close/integrations/PartnerIntegrations';

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

// Mock user authentication hook (replace with actual useAuth)
const useAuth = () => {
  const [user, setUser] = useState<UserRole | null>({
    id: '1',
    name: 'John Doe',
    permissions: ['view', 'edit', 'delete'],
    level: 'agent'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate auth check
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading, setUser };
};

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
      {value === index && (
        <Box sx={{ padding: '2rem', '@media (max-width: 600px)': { padding: '1rem' } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Feature categories configuration with role-based access
const featureCategories = [
  {
    id: 'dashboard',
    name: 'Closing Dashboard',
    icon: <DashboardIcon />,
    description: 'Centralized overview of all closing activities and progress tracking',
    status: 'active' as const,
    roles: ['admin', 'agent', 'lender', 'buyer', 'seller', 'attorney'],
    permissions: ['view'],
  },
  {
    id: 'escrow-title',
    name: 'Escrow & Title Hub',
    icon: <SecurityIcon />,
    description: 'Manage escrow accounts, title searches, and title insurance',
    status: 'pending' as const,
    roles: ['admin', 'agent', 'attorney'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence Tools',
    icon: <SearchIcon />,
    description: 'Comprehensive property and legal research tools',
    status: 'active' as const,
    roles: ['admin', 'agent', 'buyer', 'attorney'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'financing',
    name: 'Financing Coordination',
    icon: <AccountBalanceIcon />,
    description: 'Coordinate with lenders and manage funding processes',
    status: 'pending' as const,
    roles: ['admin', 'agent', 'lender', 'buyer'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: <GavelIcon />,
    description: 'Legal document preparation and regulatory compliance',
    status: 'active' as const,
    roles: ['admin', 'agent', 'attorney'],
    permissions: ['view', 'edit', 'delete'],
  },
  {
    id: 'settlement',
    name: 'Settlement & Closing Costs',
    icon: <CalculateIcon />,
    description: 'Calculate and track all closing costs and settlement amounts',
    status: 'completed' as const,
    roles: ['admin', 'agent', 'buyer', 'seller'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'insurance',
    name: 'Insurance & Utilities',
    icon: <HomeIcon />,
    description: 'Manage property insurance and utility transfers',
    status: 'pending' as const,
    roles: ['admin', 'agent', 'buyer', 'seller'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'walkthrough',
    name: 'Final Walkthrough & Handover',
    icon: <CheckCircleIcon />,
    description: 'Final property inspection and key handover process',
    status: 'pending' as const,
    roles: ['admin', 'agent', 'buyer', 'seller'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'post-closing',
    name: 'Post-Closing Services',
    icon: <SupportIcon />,
    description: 'Ongoing support and services after closing',
    status: 'active' as const,
    roles: ['admin', 'agent', 'buyer', 'seller'],
    permissions: ['view', 'edit'],
  },
  {
    id: 'ai-assistant',
    name: 'AI-Powered Closing Assistant',
    icon: <SmartToyIcon />,
    description: 'Intelligent assistance for closing processes and decision making',
    status: 'active' as const,
    roles: ['admin', 'agent', 'lender', 'buyer', 'seller', 'attorney'],
    permissions: ['view'],
  },
  {
    id: 'integrations',
    name: 'Partner Integrations',
    icon: <IntegrationIcon />,
    description: 'Connect with third-party services and platforms',
    status: 'pending' as const,
    roles: ['admin', 'agent'],
    permissions: ['view', 'edit'],
  },
];

const ClosePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, loading } = useAuth();
  
  const [closeState, setCloseState] = useState<CloseState>({
    activeTab: 'dashboard',
    userRole: user || {
      id: '1',
      name: 'Guest',
      permissions: ['view'],
      level: 'buyer'
    },
    drawerOpen: false,
    notifications: 3,
  });

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (user) {
      setCloseState(prev => ({ ...prev, userRole: user }));
    }
  }, [user]);

  // Filter features based on user role
  const accessibleFeatures = featureCategories.filter(feature =>
    feature.roles.includes(closeState.userRole.level)
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
    setCloseState(prev => ({ ...prev, activeTab: accessibleFeatures[newValue]?.id || 'dashboard' }));
  };

  const handleDrawerToggle = () => {
    setCloseState(prev => ({ ...prev, drawerOpen: !prev.drawerOpen }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderTabContent = () => {
    try {
      const currentFeature = accessibleFeatures[activeTabIndex];
      if (!currentFeature) return <ClosingDashboard />;

      switch (currentFeature.id) {
        case 'dashboard':
          return <ClosingDashboard />;
        case 'escrow-title':
          return <EscrowTitleHub />;
        case 'due-diligence':
          return <DueDiligenceTools />;
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
        case 'ai-assistant':
          return <AIClosingAssistant />;
        case 'integrations':
          return <PartnerIntegrations />;
        default:
          return <ClosingDashboard />;
      }
    } catch (error) {
      console.error('[ERROR] Failed to render component for tab:', activeTabIndex, error);
      return <div>Error rendering component: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Dreamery Closing Management
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={closeState.notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  {closeState.userRole.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={closeState.drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Close Module
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        <List sx={{ pt: 1 }}>
          {accessibleFeatures.map((feature, index) => (
            <ListItem
              key={feature.id}
              onClick={() => handleTabChange({} as React.SyntheticEvent, index)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: activeTabIndex === index ? '#e3f2fd' : 'transparent',
                color: activeTabIndex === index ? '#1976d2' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTabIndex === index ? '#bbdefb' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: activeTabIndex === index ? '#1976d2' : 'inherit',
                minWidth: 40 
              }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText 
                primary={feature.name}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: activeTabIndex === index ? 600 : 400,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        marginLeft: { xs: 0, md: '280px' },
        marginTop: '64px',
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        {/* Header Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          padding: '3rem 0',
          marginBottom: '2rem'
        }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Closing Management
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                  Streamline your real estate closing process with comprehensive tools and AI-powered assistance
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`Role: ${closeState.userRole.level}`}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label="Closing Session Active"
                    sx={{ 
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mb: 4 }}>
          {/* Tabbed Interface */}
          <Paper sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Closing management tabs"
                sx={{
                  backgroundColor: '#1976d2',
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-selected': {
                      color: 'white',
                    },
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'white',
                    height: 3,
                  },
                }}
              >
                {accessibleFeatures.map((feature, index) => (
                  <Tab
                    key={feature.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {feature.icon}
                        {feature.name}
                      </Box>
                    }
                    id={`close-tab-${index}`}
                    aria-controls={`close-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Tab Content */}
            {accessibleFeatures.map((feature, index) => (
              <TabPanelComponent key={feature.id} value={activeTabIndex} index={index}>
                {renderTabContent()}
              </TabPanelComponent>
            ))}
          </Paper>
        </Container>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          Notifications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ClosePage;
