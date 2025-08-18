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
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  Settings as SettingsIcon,
  IntegrationInstructions as IntegrationIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Checklist as ChecklistIcon,
  Description as DescriptionIcon,
  ManageAccounts as ManageAccountsIcon,
  ListAlt as ListAltIcon,
  Cancel as CancelIcon,
  Archive as ArchiveIcon,
  Task as TaskIcon,
  Edit as EditIcon,
  Create as CreateIcon,
  Receipt as ReceiptIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import { brandColors } from "../theme";

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

const CloseAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, setState] = useState<CloseState>({
    activeTab: 'dashboard',
    userRole: {
      id: 'agent-001',
      name: 'Sarah Johnson',
      permissions: ['view_clients', 'manage_transactions', 'generate_reports'],
      level: 'agent'
    },
    drawerOpen: false,
    notifications: 3
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedOffice, setSelectedOffice] = useState('ALL');

  const tabs = [
    // Core Dashboard & Overview
    { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    
    // Client & Transaction Management
    { value: 'clients', label: 'Client Management', icon: <PeopleIcon /> },
    { value: 'transactions', label: 'Transactions', icon: <AssignmentIcon /> },
    { value: 'manage-transactions', label: 'Manage Transactions', icon: <ManageAccountsIcon /> },
    
    // Listing & Offer Management
    { value: 'manage-listings', label: 'Manage Listings', icon: <ListAltIcon /> },
    { value: 'write-listing', label: 'Write A Listing', icon: <CreateIcon /> },
    { value: 'write-offer', label: 'Write An Offer', icon: <ReceiptIcon /> },
    
    // Document & Task Management
    { value: 'documents-review', label: 'Documents to Review', icon: <DescriptionIcon /> },
    { value: 'working-documents', label: 'Working Documents', icon: <AssignmentTurnedInIcon /> },
    { value: 'incomplete-checklist', label: 'Checklists', icon: <ChecklistIcon /> },
    { value: 'tasks-reminders', label: 'Tasks & Reminders', icon: <TaskIcon /> },
    
    // Digital Tools
    { value: 'digital-signature', label: 'Digital Signature', icon: <EditIcon /> },
    
    // Contract & Archive Management
    { value: 'canceled-contracts', label: 'Canceled Contracts', icon: <CancelIcon /> },
    { value: 'access-archives', label: 'Access Archives', icon: <ArchiveIcon /> },
    
    // Reports & Analytics
    { value: 'reports', label: 'Reports & Analytics', icon: <BusinessIcon /> },
    
    // Support & Configuration
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

  const mockClientTransactions = [
    {
      id: 1,
      clientName: 'John & Sarah Smith',
      propertyAddress: '123 Main St, Anytown, USA',
      status: 'In Progress',
      closingDate: '2024-02-15',
      progress: 75,
    },
    {
      id: 2,
      clientName: 'Mike Johnson',
      propertyAddress: '456 Oak Ave, Somewhere, USA',
      status: 'Pending Review',
      closingDate: '2024-02-20',
      progress: 45,
    },
    {
      id: 3,
      clientName: 'Lisa Chen',
      propertyAddress: '789 Pine Rd, Elsewhere, USA',
      status: 'Documents Ready',
      closingDate: '2024-02-25',
      progress: 90,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'primary';
      case 'Pending Review':
        return 'warning';
      case 'Documents Ready':
        return 'success';
      default:
        return 'default';
    }
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
            Dreamery Closing Hub - Agent
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
                  S
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

          {/* Office Selection */}
          <Box sx={{ px: 2, mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                mb: 1, 
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Select Office:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '& .MuiSelect-select': {
                    fontWeight: 600,
                    color: 'text.primary',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="MAIN">Main Office</MenuItem>
                <MenuItem value="NORTH">North Branch</MenuItem>
                <MenuItem value="SOUTH">South Branch</MenuItem>
                <MenuItem value="EAST">East Branch</MenuItem>
                <MenuItem value="WEST">West Branch</MenuItem>
              </Select>
            </FormControl>
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
                <AssignmentIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Agent Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your clients, transactions, and closing processes
              </Typography>
            </Paper>

            {/* Overview Cards - Row 1 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <PeopleIcon sx={{ fontSize: 32, color: brandColors.actions.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Active Clients
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <AssignmentIcon sx={{ fontSize: 32, color: brandColors.actions.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.warning }}>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pending Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <CheckCircleIcon sx={{ fontSize: 32, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  24
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Completed This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <ChecklistIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Incomplete Checklists
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <DescriptionIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Documents to Review
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <AssignmentTurnedInIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  7
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Working Documents
                </Typography>
              </Paper>
            </Box>

            {/* Overview Cards - Row 2 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <TaskIcon sx={{ fontSize: 32, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  9
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Tasks & Reminders
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <ListAltIcon sx={{ fontSize: 32, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  15
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Active Listings
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <ReceiptIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  4
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pending Offers
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <ManageAccountsIcon sx={{ fontSize: 32, color: brandColors.accent.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.warning }}>
                  6
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Manage Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <CancelIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Canceled Contracts
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <EditIcon sx={{ fontSize: 32, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Digital Signatures
                </Typography>
              </Paper>
            </Box>

            {/* Recent Transactions */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Recent Client Transactions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockClientTransactions.map((transaction) => (
                  <Card key={transaction.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {transaction.clientName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {transaction.propertyAddress}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Closing Date: {transaction.closingDate}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={transaction.status} 
                            color={getStatusColor(transaction.status) as any}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {transaction.progress}% Complete
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </>
        )}

        {state.activeTab === 'clients' && (
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
                  Client Management
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your client relationships and information
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Client Management Content</Typography>
              <Typography variant="body1">This section will contain client management tools and features.</Typography>
            </Box>
          </>
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
                <AssignmentIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Transactions
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Track and manage all your closing transactions
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Transactions Content</Typography>
              <Typography variant="body1">This section will contain transaction tracking and management tools.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'reports' && (
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
                  Reports & Analytics
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Generate reports and analyze your performance metrics
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Reports & Analytics Content</Typography>
              <Typography variant="body1">This section will contain reporting and analytics tools.</Typography>
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
                Get help and support for your closing processes
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
                Configure your account and preferences
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

        {/* New Tab Content Sections */}
        {state.activeTab === 'manage-transactions' && (
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
                <ManageAccountsIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Manage Transactions
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Comprehensive transaction management and oversight tools
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Manage Transactions Content</Typography>
              <Typography variant="body1">This section will contain advanced transaction management tools.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'manage-listings' && (
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
                <ListAltIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Manage Listings
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage and update your property listings
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Manage Listings Content</Typography>
              <Typography variant="body1">This section will contain listing management tools.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'write-listing' && (
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
                <CreateIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Write A Listing
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Create new property listings with our guided form
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Write A Listing Content</Typography>
              <Typography variant="body1">This section will contain the listing creation form.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'write-offer' && (
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
                <ReceiptIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Write An Offer
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Create and submit property offers for your clients
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Write An Offer Content</Typography>
              <Typography variant="body1">This section will contain the offer creation form.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'documents-review' && (
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
                <DescriptionIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Documents to Review
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Review and approve pending documents
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Documents to Review Content</Typography>
              <Typography variant="body1">This section will contain documents awaiting review.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'working-documents' && (
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
                <AssignmentTurnedInIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Working Documents
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Access and edit documents in progress
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Working Documents Content</Typography>
              <Typography variant="body1">This section will contain documents currently being worked on.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'incomplete-checklist' && (
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
                <ChecklistIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Checklists
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage transaction checklists and track completion status
              </Typography>
            </Paper>

            {/* Checklist Content */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Transaction Details */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                  Transaction Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>ADDRESS</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>164 Front Street, Beverly Hills, CA 90210</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>AGENT</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Lauren Thompson</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>ACCEPTANCE DATE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>06/13/2018</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>CLOSE OF ESCROW</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>06/18/2015</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>CHECKLIST TYPE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Commercial Lease</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>TYPE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Purchase / Tenant</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>PRICE PER SF</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>$230.00</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>SELLER</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Seller One</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>BUYER</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Buyer One</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Action Buttons */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Button variant="contained" sx={{ backgroundColor: brandColors.actions.primary }}>
                    Order Home Warranty
                  </Button>
                  <Button variant="contained" sx={{ backgroundColor: brandColors.actions.primary }}>
                    Order NHD
                  </Button>
                  <Button variant="contained" sx={{ backgroundColor: brandColors.actions.primary }}>
                    Get Paid Now!
                  </Button>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value=""
                      displayEmpty
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">Checked</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value=""
                      displayEmpty
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">Update Agent</MenuItem>
                      <MenuItem value="agent1">Agent 1</MenuItem>
                      <MenuItem value="agent2">Agent 2</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Documentation Section */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: brandColors.primary }}>
                    Documentation
                  </Typography>
                  <Button variant="outlined" sx={{ borderColor: brandColors.primary, color: brandColors.primary }}>
                    + Add New
                  </Button>
                </Box>
                
                {/* Documentation Table */}
                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', gap: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Documentation</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Docs</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Comments</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Actions</Typography>
                  </Box>
                  
                  {/* Purchase Contract Row */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', gap: 2, p: 2, borderBottom: '1px solid', borderColor: 'grey.200', alignItems: 'center' }}>
                    <Typography variant="body1">Purchase Contract</Typography>
                    <Chip label="Pending" color="warning" size="small" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon sx={{ fontSize: 20, color: 'grey.600' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input type="text" placeholder="Add comment..." style={{ border: 'none', outline: 'none', width: '100%', padding: '4px' }} />
                      <Typography sx={{ color: 'grey.500' }}>&gt;</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Save</Button>
                      <Button size="small" variant="outlined">Cancel</Button>
                    </Box>
                  </Box>

                  {/* Listing Agreement Row */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', gap: 2, p: 2, borderBottom: '1px solid', borderColor: 'grey.200', alignItems: 'center' }}>
                    <Typography variant="body1">Listing Agreement</Typography>
                    <Chip label="Completed" color="success" size="small" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon sx={{ fontSize: 20, color: 'grey.600' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input type="text" placeholder="Add comment..." style={{ border: 'none', outline: 'none', width: '100%', padding: '4px' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Attach</Button>
                      <Button size="small" variant="outlined">Unaccept</Button>
                    </Box>
                  </Box>

                  {/* EMD Row */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', gap: 2, p: 2, borderBottom: '1px solid', borderColor: 'grey.200', alignItems: 'center' }}>
                    <Typography variant="body1">EMD</Typography>
                    <Chip label="Pending" color="warning" size="small" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon sx={{ fontSize: 20, color: 'grey.600' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input type="text" placeholder="Add comment..." style={{ border: 'none', outline: 'none', width: '100%', padding: '4px' }} />
                      <Typography sx={{ color: 'grey.500' }}>&gt;</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Save</Button>
                      <Button size="small" variant="outlined">Cancel</Button>
                    </Box>
                  </Box>

                  {/* Disclosures Row */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', gap: 2, p: 2, borderBottom: '1px solid', borderColor: 'grey.200', alignItems: 'center' }}>
                    <Typography variant="body1">Disclosures</Typography>
                    <Chip label="Pending" color="warning" size="small" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon sx={{ fontSize: 20, color: 'grey.600' }} />
                      <CloseIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input type="text" placeholder="Add comment..." style={{ border: 'none', outline: 'none', width: '100%', padding: '4px' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Attach</Button>
                      <Button size="small" variant="outlined">Accept</Button>
                      <Button size="small" variant="outlined">Reject</Button>
                    </Box>
                  </Box>

                  {/* Inspections Row */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', gap: 2, p: 2, borderBottom: '1px solid', borderColor: 'grey.200', alignItems: 'center' }}>
                    <Typography variant="body1">Inspections</Typography>
                    <Chip label="Pending" color="warning" size="small" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon sx={{ fontSize: 20, color: 'grey.600' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input type="text" placeholder="Add comment..." style={{ border: 'none', outline: 'none', width: '100%', padding: 'none' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Attach</Button>
                      <Button size="small" variant="outlined">Accept</Button>
                      <Button size="small" variant="outlined">Reject</Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </>
        )}

        {state.activeTab === 'tasks-reminders' && (
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
                <TaskIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Tasks & Reminders
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your tasks and set important reminders
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Tasks & Reminders Content</Typography>
              <Typography variant="body1">This section will contain task management and reminder tools.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'digital-signature' && (
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
                <EditIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Digital Signature
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Sign documents electronically with secure digital signatures
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Digital Signature Content</Typography>
              <Typography variant="body1">This section will contain digital signature tools.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'canceled-contracts' && (
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
                <CancelIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Canceled Contracts
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                View and manage canceled or terminated contracts
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Canceled Contracts Content</Typography>
              <Typography variant="body1">This section will contain canceled contract information.</Typography>
            </Box>
          </>
        )}

        {state.activeTab === 'access-archives' && (
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
                <ArchiveIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Access Archives
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Access historical documents and completed transactions
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              <Typography variant="h6">Access Archives Content</Typography>
              <Typography variant="body1">This section will contain archived documents and records.</Typography>
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
            New client transaction started
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Documents ready for review
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Closing date approaching
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

export default CloseAgentPage;
