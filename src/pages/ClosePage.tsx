import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowBack as ArrowBackIcon,
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
import { brandColors } from "../theme";

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
  const navigate = useNavigate();
  
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

  const handleBackToHome = () => {
    navigate('/');
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
    <Box sx={{ minHeight: '100vh', background: brandColors.backgrounds.secondary }}>
      
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: brandColors.primary,
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
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'white' }}>
            Dreamery Closing Hub
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

            <Tooltip title="Back to Home">
              <IconButton
                color="inherit"
                onClick={handleBackToHome}
              >
                <ArrowBackIcon />
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
          width: 320, // Increased from 280px to 320px
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320, // Increased from 280px to 320px
            boxSizing: 'border-box',
            backgroundColor: brandColors.backgrounds.secondary,
            borderRight: '1px solid brandColors.borders.secondary',
            marginTop: '80px', // Add space below header
            marginLeft: '2mm', // Add 2mm gap on left side
            marginRight: '2mm', // Add 2mm gap on right side
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderBottom: '1px solid brandColors.borders.secondary' }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        
        {/* Header Section in Sidebar */}
        <Box sx={{ 
          background: '#1a365d',
          color: brandColors.backgrounds.primary,
          padding: '2rem 1.5rem', // Increased padding from 1.5rem 1rem
          margin: '1rem 0.75rem 1.5rem 0.75rem', // Increased margins
          borderRadius: 1
        }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', color: 'white' }}>
            Station
          </Typography>
        </Box>
        
        <List sx={{ pt: 2, px: 1 }}> {/* Increased top padding and added horizontal padding */}
          {accessibleFeatures.map((feature, index) => (
            <ListItem
              key={feature.id}
              onClick={() => handleTabChange({} as React.SyntheticEvent, index)}
              sx={{
                mx: 0.5, // Reduced from 1 to 0.5 for better spacing
                mb: 1, // Increased from 0.5 to 1 for more space between items
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: activeTabIndex === index ? brandColors.backgrounds.hover : 'transparent',
                color: activeTabIndex === index ? brandColors.primary : 'inherit',
                padding: '0.75rem 1rem', // Added explicit padding
                '&:hover': {
                  backgroundColor: activeTabIndex === index ? brandColors.backgrounds.selected : brandColors.neutral.light,
                },
              }}
            >
                             <ListItemIcon sx={{ 
                 color: activeTabIndex === index ? brandColors.primary : 'inherit',
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
        marginLeft: { xs: 0, md: '344px' }, // Increased to 320px + 2mm + 2mm + some extra space
        marginTop: '80px', // Increased from 64px to 80px for more space below header
        paddingLeft: '0.5rem', // Reduced from 2rem to 0.5rem for less left spacing
        paddingRight: '0.5rem', // Reduced from 2rem to 0.5rem for less right spacing
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        <Container maxWidth={false} sx={{ mb: 4, px: 1 }}> {/* Reduced horizontal padding from px: 4 to px: 1 */}
          {/* Content Display - Shows only selected topic */}
          <Paper sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            {/* Header for selected topic */}
            <Box sx={{ 
              backgroundColor: brandColors.primary,
              padding: '1.5rem 2rem',
              borderBottom: '1px solid brandColors.borders.secondary'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: brandColors.backgrounds.primary }}>
                  {accessibleFeatures[activeTabIndex]?.icon}
                </Box>
                <Typography variant="h5" sx={{ color: brandColors.backgrounds.primary, fontWeight: 600 }}>
                  {accessibleFeatures[activeTabIndex]?.name}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: 1 }}>
                {accessibleFeatures[activeTabIndex]?.description}
              </Typography>
            </Box>

            {/* Content for selected topic */}
            <Box sx={{ padding: '2rem' }}>
              {renderTabContent()}
            </Box>
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
