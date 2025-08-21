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
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Description as Description,
} from '@mui/icons-material';
import { brandColors } from "../theme";
import TemplatesComponent from '../components/TemplatesComponent';

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
  transactionTab: string;
  listingsTab: string;
  offersTab: string;
  documentsTab: string;
  templatesTab: string;
  userRole: UserRole;
  drawerOpen: boolean;
  notifications: number;
  paymentsTab?: string;
}

const CloseBrokeragesPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, setState] = useState<CloseState>({
    activeTab: 'dashboard',
    transactionTab: 'overview',
    listingsTab: 'overview',
    offersTab: 'overview',
    documentsTab: 'overview',
    templatesTab: 'overview',
    paymentsTab: 'sales',
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
    { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { value: 'agents', label: 'Agent Management', icon: <PeopleIcon /> },
    { value: 'transactions', label: 'Transactions', icon: <BusinessIcon /> },
    { value: 'listings', label: 'Listings', icon: <BusinessIcon /> },
    { value: 'offers', label: 'Offers', icon: <AssessmentIcon /> },
    { value: 'documents', label: 'Documents', icon: <AssessmentIcon /> },
    { value: 'payments-finance', label: 'Payments & Finance', icon: <AssessmentIcon /> },
    { value: 'tasks-reminders', label: 'Tasks & Reminders', icon: <AssessmentIcon /> },
    { value: 'checklists', label: 'Checklists', icon: <CheckCircleIcon /> },
    { value: 'working-documents', label: 'Templates', icon: <AssessmentIcon /> },
    { value: 'templates', label: 'Working Documents', icon: <AssessmentIcon /> },
    { value: 'access-archives', label: 'Access Archives', icon: <AssessmentIcon /> },
    { value: 'compliance', label: 'Compliance', icon: <AssessmentIcon /> },
    { value: 'training-resources', label: 'Training & Resources', icon: <AssessmentIcon /> },
    { value: 'reports-analytics', label: 'Reports & Analytics', icon: <AssessmentIcon /> },
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
    navigate('/close');
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
            Dreamery Closing Hub - Brokerages
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
                  P
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
          <Box sx={{ px: 2, mb: 2 }}>
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
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <BusinessIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Brokerage Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your brokerage operations, agents, and closing processes
              </Typography>
            </Paper>

            {/* Overview Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <PeopleIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  {mockBrokerageData.totalAgents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Agents
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <BusinessIcon sx={{ fontSize: 40, color: brandColors.actions.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.warning }}>
                  {mockBrokerageData.activeTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  ${(mockBrokerageData.monthlyVolume / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Volume
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', flex: '1 1 200px', minWidth: '200px' }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  {mockBrokerageData.completedThisMonth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed This Month
                </Typography>
              </Paper>
            </Box>

            {/* Top Performing Agent */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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

            {/* Agent Performance Overview */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                Agent Performance Overview
              </Typography>
              <Grid container spacing={3}>
                {[
                  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', performance: 95, transactions: 12, revenue: 45000 },
                  { id: 2, name: 'Mike Wilson', avatar: 'MW', performance: 87, transactions: 8, revenue: 32000 },
                  { id: 3, name: 'Lisa Brown', avatar: 'LB', performance: 92, transactions: 15, revenue: 58000 },
                  { id: 4, name: 'David Lee', avatar: 'DL', performance: 78, transactions: 6, revenue: 22000 },
                  { id: 5, name: 'Emily Davis', avatar: 'ED', performance: 89, transactions: 11, revenue: 41000 }
                ].map((agent) => (
                  <Grid component="div" xs={12} sm={6} md={4} key={agent.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Recent Activity */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                Recent Activity
              </Typography>
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {[
                  { action: 'New listing added', agent: 'Sarah Johnson', property: '123 Main St', time: '2 hours ago', status: 'completed' },
                  { action: 'Offer submitted', agent: 'Mike Wilson', property: '456 Oak Ave', time: '4 hours ago', status: 'pending' },
                  { action: 'Transaction closed', agent: 'Lisa Brown', property: '789 Pine Rd', time: '6 hours ago', status: 'completed' },
                  { action: 'Document signed', agent: 'David Lee', property: '321 Elm St', time: '1 day ago', status: 'completed' },
                  { action: 'New agent onboarded', agent: 'Emily Davis', property: 'N/A', time: '2 days ago', status: 'completed' }
                ].map((activity, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', alignItems: 'center', 
                    py: 1,
                    borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.agent} • {activity.property !== 'N/A' ? activity.property : 'Onboarding'} • {activity.time}
                      </Typography>
                    </Box>
                    <Chip 
                      label={activity.status} 
                      size="small" 
                      sx={{ 
                        backgroundColor: activity.status === 'completed' ? '#e8f5e8' : '#fff3cd',
                        color: activity.status === 'completed' ? '#2e7d32' : '#856404'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
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
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Agent Management
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your brokerage agents and their performance
              </Typography>
            </Paper>
            {/* Agent Performance Dashboard */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                Agent Performance Dashboard
              </Typography>
              <Grid container spacing={3}>
                {[
                  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', performance: 95, transactions: 12, revenue: 45000 },
                  { id: 2, name: 'Mike Wilson', avatar: 'MW', performance: 87, transactions: 8, revenue: 32000 },
                  { id: 3, name: 'Lisa Brown', avatar: 'LB', performance: 92, transactions: 15, revenue: 58000 },
                  { id: 4, name: 'David Lee', avatar: 'DL', performance: 78, transactions: 6, revenue: 22000 },
                  { id: 5, name: 'Emily Davis', avatar: 'ED', performance: 89, transactions: 11, revenue: 41000 }
                ].map((agent) => (
                  <Grid component="div" xs={12} sm={6} md={4} key={agent.id}>
                    <Card sx={{ height: '100%' }}>
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
                          <Box sx={{ bgcolor: '#e0e0e0', borderRadius: 1, height: 8, mb: 2 }}>
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
                            startIcon={<PersonIcon />}
                            sx={{ flex: 1 }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{ flex: 1 }}
                          >
                            Edit
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Add New Agent */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                Add New Agent
              </Typography>
              <Grid container spacing={3}>
                <Grid component="div" xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Agent Name"
                    variant="outlined"
                    placeholder="Enter full name"
                  />
                </Grid>
                <Grid component="div" xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    placeholder="Enter email address"
                    type="email"
                  />
                </Grid>
                <Grid component="div" xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    placeholder="Enter phone number"
                  />
                </Grid>
                <Grid component="div" xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="License Number"
                    variant="outlined"
                    placeholder="Enter license number"
                  />
                </Grid>
                <Grid component="div" xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: brandColors.primary }}
                  >
                    Add Agent
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

        {state.activeTab === 'listings' && (
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
                <BusinessIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Listings
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage all property listings across the brokerage
              </Typography>
            </Paper>
            
            {/* Listings Management Tabs */}
            <Box sx={{ pl: 0, ml: 3, mb: 4 }}>
              <Tabs 
                value={state.listingsTab || 'overview'} 
                onChange={(e, newValue) => setState(prev => ({ ...prev, listingsTab: newValue }))}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  mb: 3
                }}
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Active Listings" value="active" />
                <Tab label="Pending Approval" value="pending" />
                <Tab label="Expired" value="expired" />
                <Tab label="Create Listing" value="create" />
              </Tabs>

              {/* Overview Tab */}
              {(!state.listingsTab || state.listingsTab === 'overview') && (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                        89
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Active
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Approval
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                        $45.2M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Value
                      </Typography>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expired This Month
                      </Typography>
                    </Paper>
                  </Box>

                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                          borderBottom: '1px solid #e0e0e0',
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

              {/* Active Listings Tab */}
              {state.listingsTab === 'active' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Active Listings (89)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search listings..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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
                        <Card key={listing.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
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

              {/* Pending Approval Tab */}
              {state.listingsTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                        <Card key={listing.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
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

              {/* Expired Tab */}
              {state.listingsTab === 'expired' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Expired Listings This Month (23)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search expired listings..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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
                        <Card key={listing.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
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

              {/* Create Listing Tab */}
              {state.listingsTab === 'create' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                <AssessmentIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Offers
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Review and manage all offers across brokerage listings
              </Typography>
            </Paper>
            
            {/* Offers Management Tabs */}
            <Box sx={{ pl: 0, ml: 3, mb: 4 }}>
              <Tabs 
                value={state.offersTab || 'overview'} 
                onChange={(e, newValue) => setState(prev => ({ ...prev, offersTab: newValue }))}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  mb: 3
                }}
              >
                <Tab label="Overview" value="overview" />
                <Tab label="All Offers" value="all" />
                <Tab label="Pending Review" value="pending" />
                <Tab label="Negotiating" value="negotiating" />
                <Tab label="Compare" value="compare" />
              </Tabs>

              {/* Overview Tab */}
              {(!state.offersTab || state.offersTab === 'overview') && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                          47
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Offers
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                          12
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Review
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                          8
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Under Negotiation
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                          $12.8M
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Offer Value
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                          borderBottom: '1px solid #e0e0e0',
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

              {/* All Offers Tab */}
              {state.offersTab === 'all' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        All Offers (47)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search offers..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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

              {/* Pending Review Tab */}
              {state.offersTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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

              {/* Negotiating Tab */}
              {state.offersTab === 'negotiating' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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

              {/* Compare Tab */}
              {state.offersTab === 'compare' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                    <Grid container spacing={3}>
                      {[
                        { id: 1, property: '123 Main St, Los Angeles', buyer: 'John Smith', agent: 'Sarah Johnson', price: 850000, downPayment: 170000, closingDate: '2024-02-15', financing: 'Conventional', contingencies: ['Inspection', 'Appraisal'] },
                        { id: 2, property: '456 Oak Ave, San Francisco', buyer: 'Emily Davis', agent: 'Mike Wilson', price: 1200000, downPayment: 240000, closingDate: '2024-02-28', financing: 'FHA', contingencies: ['Inspection'] }
                      ].map((offer) => (
                        <Grid item xs={12} md={6} key={offer.id}>
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
                        </Grid>
                      ))}
                    </Grid>

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
                <AssessmentIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Documents
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Review and manage all brokerage documents
              </Typography>
            </Paper>
            
            {/* Documents Management Tabs */}
            <Box sx={{ pl: 0, ml: 3, mb: 4 }}>
              <Tabs 
                value={state.documentsTab || 'overview'} 
                onChange={(e, newValue) => setState(prev => ({ ...prev, documentsTab: newValue }))}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  mb: 3
                }}
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Pending Review" value="pending" />
                <Tab label="Document Categories" value="categories" />
                <Tab label="Upload Documents" value="upload" />
                <Tab label="Document Workflow" value="workflow" />
              </Tabs>

              {/* Overview Tab */}
              {(!state.documentsTab || state.documentsTab === 'overview') && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                          156
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Documents
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                          23
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Review
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                          89
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Approved
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                          44
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rejected
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                          borderBottom: '1px solid #e0e0e0',
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

              {/* Pending Review Tab */}
              {state.documentsTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Documents Pending Review (23)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search documents..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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

              {/* Document Categories Tab */}
              {state.documentsTab === 'categories' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Document Categories
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {[
                        { name: 'Legal Documents', count: 45, color: 'primary', examples: ['Purchase Agreements', 'Contracts', 'Addendums'] },
                        { name: 'Financial Documents', count: 38, color: 'success', examples: ['Loan Documents', 'Commission Agreements', 'Financial Statements'] },
                        { name: 'Property Documents', count: 42, color: 'info', examples: ['Title Reports', 'HOA Documents', 'Property Surveys'] },
                        { name: 'Transaction Documents', count: 31, color: 'warning', examples: ['Closing Statements', 'Settlement Documents', 'Transfer Records'] }
                      ].map((category) => (
                        <Grid item xs={12} sm={6} md={3} key={category.name}>
                          <Card sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                {category.name}
                              </Typography>
                              <Typography variant="h4" sx={{ color: brandColors[category.color], fontWeight: 'bold', mb: 2 }}>
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
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              )}

              {/* Upload Documents Tab */}
              {state.documentsTab === 'upload' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Upload New Documents
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
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
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
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
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 4, textAlign: 'center', mb: 3 }}>
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

              {/* Document Workflow Tab */}
              {state.documentsTab === 'workflow' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Document Workflow Management
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Workflow Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Button variant="outlined" startIcon={<SearchIcon />} fullWidth>
                            Search Documents
                          </Button>
                          <Button variant="outlined" startIcon={<AssessmentIcon />} fullWidth>
                            Generate Reports
                          </Button>
                          <Button variant="outlined" startIcon={<BusinessIcon />} fullWidth>
                            Bulk Actions
                          </Button>
                          <Button variant="outlined" startIcon={<PeopleIcon />} fullWidth>
                            Assign Reviewers
                          </Button>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
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
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Templates Component */}
        {state.activeTab === 'working-documents' && <TemplatesComponent />}

        {state.activeTab === 'templates' && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3 }}>
              Working Documents
            </Typography>
            <Typography variant="body1">
              This section will contain working document management and editing tools.
            </Typography>
          </Box>
        )}

        {state.activeTab === 'access-archives' && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3 }}>
              Access Archives
            </Typography>
            <Typography variant="body1">
              This section will contain access to brokerage archives.
            </Typography>
          </Box>
        )}

        {state.activeTab === 'transactions' && (
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
                <BusinessIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Transactions
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Track and manage all brokerage transactions
              </Typography>
            </Paper>
            
            {/* Transaction Management Tabs */}
            <Box sx={{ pl: 0, ml: 3, mb: 4 }}>
              <Tabs 
                value={state.transactionTab || 'overview'} 
                onChange={(e, newValue) => setState(prev => ({ ...prev, transactionTab: newValue }))}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  mb: 3
                }}
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Active Transactions" value="active" />
                <Tab label="Pending Review" value="pending" />
                <Tab label="Completed" value="completed" />
                <Tab label="Create File" value="create" />
              </Tabs>

              {/* Overview Tab */}
              {(!state.transactionTab || state.transactionTab === 'overview') && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                          156
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Active
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
                          23
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Review
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                          89
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed This Month
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                          $28.4M
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Volume
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                          borderBottom: '1px solid #e0e0e0',
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

              {/* Active Transactions Tab */}
              {state.transactionTab === 'active' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Active Transactions (156)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search transactions..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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

              {/* Pending Review Tab */}
              {state.transactionTab === 'pending' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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

              {/* Completed Tab */}
              {state.transactionTab === 'completed' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Completed Transactions This Month (89)
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search completed transactions..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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

              {/* Create File Tab */}
              {state.transactionTab === 'create' && (
                <Box>
                  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Create New Transaction File
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
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
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
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
                      </Grid>
                    </Grid>
                    
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
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
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

        {state.activeTab === 'support' && (
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
                  Support
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Get help and support for your brokerage operations
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
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <SettingsIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
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
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <IntegrationIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
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
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3 }}>
              Payments & Finance
            </Typography>
            
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

export default CloseBrokeragesPage;
