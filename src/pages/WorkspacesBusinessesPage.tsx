import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Chip,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Support as SupportIcon,
  Settings as SettingsIcon,
  IntegrationInstructions as IntegrationIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { brandColors } from "../theme";
import UnifiedRoleSelector from '../components/UnifiedRoleSelector';
import BusinessMessages from "../components/business/BusinessMessages";

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

const WorkspacesBusinessesPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, setState] = useState<CloseState>({
    activeTab: 'dashboard',
    userRole: {
      id: 'business-001',
      name: 'Enterprise Solutions Corp',
      permissions: ['manage_business', 'view_analytics', 'generate_reports'],
      level: 'admin'
    },
    drawerOpen: false,
    notifications: 12
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { value: 'messages', label: 'Messages', icon: <ChatIcon /> },
    { value: 'businesses', label: 'Business Management', icon: <BusinessIcon /> },
    { value: 'employees', label: 'Employee Access', icon: <PeopleIcon /> },
    { value: 'analytics', label: 'Analytics', icon: <AssessmentIcon /> },
    { value: 'support', label: 'Support', icon: <SupportIcon /> },
    { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { value: 'integrations', label: 'Integrations', icon: <IntegrationIcon /> },
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
    navigate('/workspaces');
  };

  const mockBusinessData = {
    totalBusinesses: 156,
    activeUsers: 2847,
    monthlyTransactions: 1247,
    totalRevenue: 45600000,
    pendingApprovals: 23,
    topPerformingBusiness: 'TechStart Solutions',
    topBusinessRevenue: 5200000
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
            Dreamery Closing Hub - Businesses
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
                  E
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
          {/* Role Selector */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <UnifiedRoleSelector 
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
                <BusinessIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Business Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your business operations and employee access to closing processes
              </Typography>
            </Paper>

            {/* Overview Cards */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 2, md: 3 }, 
              mb: 4,
              '& > *': {
                marginBottom: { xs: '1rem', md: '0' }
              }
            }}>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 200px', 
                minWidth: { xs: '150px', md: '200px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '200px' }
              }}>
                <BusinessIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  {mockBusinessData.totalBusinesses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Businesses
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 200px', 
                minWidth: { xs: '150px', md: '200px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '200px' }
              }}>
                <PeopleIcon sx={{ fontSize: 40, color: brandColors.actions.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.warning }}>
                  {mockBusinessData.activeUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 200px', 
                minWidth: { xs: '150px', md: '200px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '200px' }
              }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  {mockBusinessData.monthlyTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 3 }, 
                textAlign: 'center', 
                flex: '1 1 200px', 
                minWidth: { xs: '150px', md: '200px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '200px' }
              }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  ${(mockBusinessData.totalRevenue / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </Paper>
            </Box>

            {/* Top Performing Business */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Top Performing Business
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: brandColors.primary }}>
                  T
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {mockBusinessData.topPerformingBusiness}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Top Business - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>
                  <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    ${(mockBusinessData.topBusinessRevenue / 1000000).toFixed(1)}M
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </>
        )}

        {state.activeTab === 'businesses' && (
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
                <BusinessIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Business Management
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage business accounts and their access to closing services
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Business Management Content</Typography>
              <Typography variant="body1">This section will contain business management tools and features.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'employees' && (
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
                <PeopleIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Employee Access
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage employee access and permissions for closing processes
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Employee Access Content</Typography>
              <Typography variant="body1">This section will contain employee access management tools.</Typography>
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
                <AssessmentIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Analytics
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Analyze business performance and usage metrics
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Analytics Content</Typography>
              <Typography variant="body1">This section will contain analytics and reporting tools.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'messages' && (
          <BusinessMessages />
        )}

        {state.activeTab === 'support' && (
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
                <SupportIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Support
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Get help and support for your business operations
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Support Content</Typography>
              <Typography variant="body1">This section will contain support and help resources.</Typography>
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
                <SettingsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Settings
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Configure your business account and preferences
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
                <IntegrationIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
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
            New business account registered
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Employee access request pending
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Monthly business report ready
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

export default WorkspacesBusinessesPage;
