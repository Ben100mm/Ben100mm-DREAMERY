import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  FormControl,
  Select,
  MenuItem as SelectMenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Queue as QueueIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { RoleContext } from '../context/RoleContext';

// Types
interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  level: 'admin' | 'agent' | 'lender' | 'buyer' | 'seller' | 'attorney' | 'support';
}

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  category?: string;
}

interface RoleConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tabs: TabItem[];
  defaultTab: string;
}

interface ProfessionalSupportState {
  activeTab: string;
  userRole: UserRole;
  drawerOpen: boolean;
  notifications: number;
  sidebarCollapsed: boolean;
  favorites: string[];
  selectedRole: string;
  favoritesExpanded: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface RoleWorkspaceProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

// Role list for selector
const roleList = [
  'Acquisition Specialist',
  'Disposition Agent',
  'Title Agent',
  'Escrow Officer',
  'Notary Public',
  'Residential Appraiser',
  'Commercial Appraiser',
  'Home Inspector',
  'Commercial Inspector',
  'Energy Inspector',
  'Land Surveyor',
  'Insurance Agent',
  'Title Insurance Agent',
  'Mortgage Broker',
  'Mortgage Lender',
  'Loan Officer',
  'Mortgage Underwriter',
  'Hard Money Lender',
  'Private Lender',
  'Limited Partner (LP)',
  'Banking Advisor',
  'Seller Finance Purchase Specialist',
  'Subject To Existing Mortgage Purchase Specialist',
  'Trust Acquisition Specialist',
  'Hybrid Purchase Specialist',
  'Lease Option Specialist',
  'General Contractor',
  'Electrical Contractor',
  'Plumbing Contractor',
  'HVAC Contractor',
  'Roofing Contractor',
  'Painting Contractor',
  'Landscaping Contractor',
  'Flooring Contractor',
  'Kitchen Contractor',
  'Bathroom Contractor',
  'Interior Designer',
  'Architect',
  'Landscape Architect',
  'Kitchen Designer',
  'Bathroom Designer',
  'Lighting Designer',
  'Furniture Designer',
  'Color Consultant',
  'Permit Expeditor',
  'Energy Consultant',
  'Property Manager',
  'Long-term Rental Property Manager',
  'Short-term Rental Property Manager',
  'STR Setup & Manager',
  'Housekeeper',
  'Landscape Cleaner',
  'Turnover Specialist',
  'Handyman',
  'Landscaper',
  'Arborist',
  'Tenant Screening Agent',
  'Leasing Agent',
  'Bookkeeper',
  'Certified Public Accountant (CPA)',
  'Accountant',
  'Photographer',
  'Videographer',
  'AR/VR Developer',
  'Digital Twins Developer',
  'Estate Planning Attorney',
  '1031 Exchange Intermediary',
  'Entity Formation Service Provider',
  'Escrow Service Provider',
  'Legal Notary Service Provider',
  'Real Estate Consultant',
  'Real Estate Educator',
  'Financial Advisor',
  'Tax Advisor',
  'Relocation Specialist',
  'Real Estate Investment Advisor',
];

// Role-specific configurations
const roleConfigurations: Record<string, RoleConfig> = {
  'acquisition-specialist': {
    id: 'acquisition-specialist',
    name: 'Acquisition Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'deal-sourcing', label: 'Deal Sourcing', icon: <TimelineIcon />, description: 'Advanced Filters, Saved Searches, Lists, Skip Trace' },
      { value: 'underwriting', label: 'Underwriting', icon: <SecurityIcon />, description: 'ARV, MAO, Repairs, Sensitivity' },
      { value: 'offer-builder', label: 'Offer Builder', icon: <AddIcon />, description: 'Term Sheets, LOIs, PSAs, Counteroffers' },
      { value: 'pipeline', label: 'Pipeline', icon: <TimelineIcon />, description: 'Leads, Stages, Follow-ups, KPIs' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'MLS/PropStream/Zillow feeds, AI comps/ARV calculator, skip tracing integration, automated seller outreach' },
    ],
  },
};

const RoleWorkspace: React.FC<RoleWorkspaceProps> = ({
  allowedRoles = roleList,
  redirectPath = '/close'
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userRole, setUserRole } = (useContext(RoleContext as any) as any) || {};
  const currentUserRole = userRole || 'Real Estate Agent';
  const isAuthorized = allowedRoles.includes(currentUserRole);
  
  console.log('RoleWorkspace - userRole:', currentUserRole, 'isAuthorized:', isAuthorized, 'allowedRoles:', allowedRoles);

  // Map user role to role configuration key
  const getRoleKey = (role: string): string => {
    // Convert role name to a key format
    return role.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  };

  // Check if role has specific configuration
  const hasRoleConfig = (roleKey: string): boolean => {
    return roleConfigurations.hasOwnProperty(roleKey);
  };

  const currentRoleKey = getRoleKey(currentUserRole);
  const currentRoleConfig = roleConfigurations[currentRoleKey] || {
    id: currentRoleKey,
    name: currentUserRole,
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [],
  };

  // Debug effect to log role changes
  useEffect(() => {
    console.log('RoleWorkspace - userRole changed to:', currentUserRole, 'currentRoleKey:', currentRoleKey);
  }, [currentUserRole, currentRoleKey]);

  const [state, setState] = useState<ProfessionalSupportState>({
    activeTab: currentRoleConfig?.defaultTab || 'dashboard',
    userRole: {
      id: '1',
      name: 'Professional Support',
      permissions: ['view', 'edit', 'submit'],
      level: 'support'
    },
    drawerOpen: false,
    notifications: 3,
    sidebarCollapsed: false,
    favorites: [],
    selectedRole: currentRoleKey,
    favoritesExpanded: true,
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [roleSelectAnchor, setRoleSelectAnchor] = useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setState(prev => ({ ...prev, activeTab: newValue }));
  };

  const toggleDrawer = () => {
    setState(prev => ({ ...prev, drawerOpen: !prev.drawerOpen }));
  };

  const toggleSidebarCollapse = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const toggleFavorites = () => {
    setState(prev => ({ ...prev, favoritesExpanded: !prev.favoritesExpanded }));
  };

  const toggleFavorite = (tabValue: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(tabValue)
        ? prev.favorites.filter(fav => fav !== tabValue)
        : [...prev.favorites, tabValue]
    }));
  };

  const handleRoleChange = (roleKey: string) => {
    const roleName = roleList.find(role => getRoleKey(role) === roleKey) || roleKey;
    setState(prev => ({
      ...prev,
      selectedRole: roleKey,
      activeTab: 'dashboard',
      favorites: [], // Reset favorites when changing roles
    }));
    setRoleSelectAnchor(null);
    // Update the user's role in the context
    if (setUserRole) {
      setUserRole(roleName);
    }
    console.log('Role changed to:', roleName);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleRoleSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    setRoleSelectAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationsMenuAnchor(null);
    setUserMenuAnchor(null);
    setRoleSelectAnchor(null);
  };

  const handleBackToClose = () => {
    navigate(redirectPath);
  };

  // Get current tabs based on selected role
  const currentTabs = currentRoleConfig?.tabs || [];
  const favoriteTabs = currentTabs.filter(tab => state.favorites.includes(tab.value));

  const renderTabContent = () => {
    const currentTab = currentTabs.find(tab => tab.value === state.activeTab);
    
    return (
      <Box sx={{ p: 3 }}>
        {hasRoleConfig(currentRoleKey) ? (
          // Role-specific content only
          <>
            {state.activeTab === 'dashboard' && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 200px', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Tasks
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 200px', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calendar Events
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 200px', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: brandColors.accent.warning, fontWeight: 'bold' }}>
                    24
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Files Uploaded
                  </Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'communications' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Chat</Typography>
                  <Typography variant="body2" color="text.secondary">Real-time messaging with team and clients</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Email</Typography>
                  <Typography variant="body2" color="text.secondary">Email management and tracking</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Calls</Typography>
                  <Typography variant="body2" color="text.secondary">Call logs and recording management</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Meeting notes and documentation</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'contracts-esign' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Templates</Typography>
                  <Typography variant="body2" color="text.secondary">Contract templates and forms</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Signatures</Typography>
                  <Typography variant="body2" color="text.secondary">Digital signature management</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Version Control</Typography>
                  <Typography variant="body2" color="text.secondary">Document version tracking</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Audit Trail</Typography>
                  <Typography variant="body2" color="text.secondary">Complete activity logging</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'money-billing' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Quotes</Typography>
                  <Typography variant="body2" color="text.secondary">Price quotes and estimates</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Invoices</Typography>
                  <Typography variant="body2" color="text.secondary">Invoice generation and tracking</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Payments</Typography>
                  <Typography variant="body2" color="text.secondary">Payment processing and tracking</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'deal-sourcing' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Advanced Filters</Typography>
                  <Typography variant="body2" color="text.secondary">Interactive map with property filters</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Saved Searches</Typography>
                  <Typography variant="body2" color="text.secondary">Pre-configured search criteria</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Lists</Typography>
                  <Typography variant="body2" color="text.secondary">Property lists and collections</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Skip Trace</Typography>
                  <Typography variant="body2" color="text.secondary">Owner contact information lookup</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'underwriting' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>ARV</Typography>
                  <Typography variant="body2" color="text.secondary">After Repair Value calculations</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>MAO</Typography>
                  <Typography variant="body2" color="text.secondary">Maximum Allowable Offer calculations</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Repairs</Typography>
                  <Typography variant="body2" color="text.secondary">Repair cost estimation and tracking</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Sensitivity</Typography>
                  <Typography variant="body2" color="text.secondary">Market sensitivity analysis</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'offer-builder' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Term Sheets</Typography>
                  <Typography variant="body2" color="text.secondary">Deal term documentation</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>LOIs</Typography>
                  <Typography variant="body2" color="text.secondary">Letters of Intent creation</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>PSAs</Typography>
                  <Typography variant="body2" color="text.secondary">Purchase and Sale Agreements</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Counteroffers</Typography>
                  <Typography variant="body2" color="text.secondary">Counteroffer management</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'pipeline' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Leads</Typography>
                  <Typography variant="body2" color="text.secondary">Lead management and tracking</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Stages</Typography>
                  <Typography variant="body2" color="text.secondary">Deal stage progression</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Follow-ups</Typography>
                  <Typography variant="body2" color="text.secondary">Follow-up task management</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>KPIs</Typography>
                  <Typography variant="body2" color="text.secondary">Key Performance Indicators</Typography>
                </Paper>
              </Box>
            )}

            {state.activeTab === 'advanced' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>MLS/PropStream/Zillow Feeds</Typography>
                  <Typography variant="body2" color="text.secondary">Automated property data feeds from multiple sources</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>AI Comps/ARV Calculator</Typography>
                  <Typography variant="body2" color="text.secondary">AI-powered comparable analysis and ARV calculations</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Skip Tracing Integration</Typography>
                  <Typography variant="body2" color="text.secondary">Integrated skip tracing for owner contact information</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>Automated Seller Outreach</Typography>
                  <Typography variant="body2" color="text.secondary">SMS/Email dialer for automated seller communication</Typography>
                </Paper>
              </Box>
            )}
          </>
        ) : (
          // Minimal content for unconfigured roles
          <Typography variant="h4" gutterBottom>
            {currentUserRole} Workspace
          </Typography>
        )}
      </Box>
    );
  };

  // If role is not yet known, render nothing until RoleContext resolves (RoleProvider shows loader)
  // Only redirect if we definitively know role is not allowed
  // Keep guard duplicated in rendered tree to satisfy hooks rule

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {!isAuthorized && currentUserRole && <Navigate to="/" />}
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
            Dreamery {currentUserRole}
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
                  {userRole.charAt(0)}
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

      {/* Dynamic Sidebar Navigation */}
      <Box
        sx={{
          width: state.sidebarCollapsed ? 80 : 280,
          flexShrink: 0,
          background: brandColors.backgrounds.secondary,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          transition: 'width 0.3s ease',
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Role Selector */}
          {!state.sidebarCollapsed && (
            <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleRoleSelectClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  borderColor: brandColors.borders.secondary,
                  color: brandColors.text.primary,
                  '&:hover': {
                    borderColor: brandColors.primary,
                    backgroundColor: brandColors.backgrounds.hover,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: currentRoleConfig?.color }}>
                    {currentRoleConfig?.icon}
                  </Box>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {currentUserRole}
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Box>
          )}

          {/* Station Button */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                py: 2,
                fontWeight: 600,
                fontSize: state.sidebarCollapsed ? '0.75rem' : '1.1rem',
                '&:hover': {
                  backgroundColor: brandColors.actions.primary,
                }
              }}
            >
              {state.sidebarCollapsed ? 'S' : 'Station'}
            </Button>
          </Box>

          {/* Collapse Toggle */}
          <Box sx={{ px: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              onClick={toggleSidebarCollapse}
              size="small"
              sx={{
                backgroundColor: brandColors.backgrounds.primary,
                '&:hover': {
                  backgroundColor: brandColors.backgrounds.hover,
                }
              }}
            >
              {state.sidebarCollapsed ? <MenuIcon /> : <MenuIcon />}
            </IconButton>
          </Box>

          {!state.sidebarCollapsed && (
            <>
              {/* Favorites Section */}
              {favoriteTabs.length > 0 && (
                <>
                  <Box sx={{ px: 2, mb: 1 }}>
                    <Button
                      onClick={toggleFavorites}
                      startIcon={state.favoritesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{
                        color: brandColors.text.secondary,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        p: 0,
                        minWidth: 'auto',
                      }}
                    >
                      FAVORITES ({favoriteTabs.length})
                    </Button>
                  </Box>
                  <Collapse in={state.favoritesExpanded}>
                    <Box sx={{ px: 0, mb: 2 }}>
                      {favoriteTabs.map((tab) => (
                        <Box
                          key={tab.value}
                          onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                          sx={{
                            margin: '4px 8px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                            transition: 'background-color 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                              backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : brandColors.backgrounds.hover,
                            }
                          }}
                        >
                          <Box sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center' }}>
                            {tab.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: state.activeTab === tab.value ? 600 : 400,
                              color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                              fontSize: '14px',
                              flex: 1,
                            }}
                          >
                            {tab.label}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tab.value);
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <StarIcon sx={{ fontSize: 16, color: brandColors.accent.warning }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </>
              )}

              {/* All Tabs */}
              <Box sx={{ px: 0 }}>
                {currentTabs.map((tab) => (
                  <Box
                    key={tab.value}
                    onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                    sx={{
                      margin: '4px 8px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : brandColors.backgrounds.hover,
                      }
                    }}
                  >
                    <Box sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center' }}>
                      {tab.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: state.activeTab === tab.value ? 600 : 400,
                        color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                        fontSize: '14px',
                        flex: 1,
                      }}
                    >
                      {tab.label}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tab.value);
                      }}
                      sx={{ p: 0.5 }}
                    >
                      {state.favorites.includes(tab.value) ? (
                        <StarIcon sx={{ fontSize: 16, color: brandColors.accent.warning }} />
                      ) : (
                        <StarBorderIcon sx={{ fontSize: 16, color: brandColors.text.disabled }} />
                      )}
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Collapsed Sidebar Icons */}
          {state.sidebarCollapsed && (
            <Box sx={{ px: 1 }}>
              {currentTabs.slice(0, 6).map((tab) => (
                <Tooltip key={tab.value} title={tab.label} placement="right">
                  <IconButton
                    onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                    sx={{
                      width: '100%',
                      mb: 1,
                      color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                      backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                      '&:hover': {
                        backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : brandColors.backgrounds.hover,
                      }
                    }}
                  >
                    {tab.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          )}
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
        {renderTabContent()}
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
            New support ticket assigned
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Document review required
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Compliance update available
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
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Support</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Role Selector Menu */}
      <Menu
        anchorEl={roleSelectAnchor}
        open={Boolean(roleSelectAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: brandColors.primary }}>
            Switch Role
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a different professional role to access role-specific tools and features.
          </Typography>
        </Box>
        {roleList.map((role) => {
          const roleKey = getRoleKey(role);
          return (
            <MenuItem
              key={roleKey}
              onClick={() => handleRoleChange(roleKey)}
              selected={state.selectedRole === roleKey}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  backgroundColor: brandColors.backgrounds.selected,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ color: brandColors.primary }}>
                  <PersonIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {role}
                  </Typography>
                </Box>
                {state.selectedRole === roleKey && (
                  <Chip label="Active" size="small" color="primary" />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default RoleWorkspace;
