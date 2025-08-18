import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  VisibilityOff as VisibilityOffIcon,
  ExpandMore as ExpandMoreIcon,
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
  const [listingTab, setListingTab] = useState('LISTING');
  const [propertyType, setPropertyType] = useState('');

  // Debug logging for Write A Listing tab
  useEffect(() => {
    if (state.activeTab === 'write-listing') {
      console.log('Write A Listing tab selected');
      console.log('Current listingTab:', listingTab);
      console.log('Current propertyType:', propertyType);
    }
  }, [state.activeTab, listingTab, propertyType]);

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
              {/* Header Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button variant="contained" sx={{ backgroundColor: brandColors.accent.success }}>
                    Create Transaction
                  </Button>
                </Box>
              </Box>

              {/* Search and Filter Bar */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      SEARCH
                    </Typography>
                    <input 
                      type="text" 
                      placeholder="Search transactions..." 
                      style={{ 
                        padding: '8px 12px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }} 
                    />
                  </Box>
                  <Button variant="outlined">Search</Button>
                  <Button variant="outlined">Show All</Button>
                  <IconButton sx={{ border: '1px solid #ccc', backgroundColor: brandColors.backgrounds.selected }}>
                    <ListAltIcon />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid #ccc' }}>
                    <FilterListIcon />
                  </IconButton>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value=""
                      displayEmpty
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">Office</MenuItem>
                      <MenuItem value="eric">Eric Office</MenuItem>
                      <MenuItem value="main">Main Office</MenuItem>
                      <MenuItem value="north">North Office</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value=""
                      displayEmpty
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">Stage Filter</MenuItem>
                      <MenuItem value="checked">Checked</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="review">Under Review</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Transactions Table */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ overflowX: 'auto' }}>
                  {/* Table Header */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 100px 1.5fr 1fr 120px 120px 100px 80px', 
                    gap: 2, 
                    p: 2, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 1, 
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    <Typography variant="subtitle2">Property Address</Typography>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography variant="subtitle2">Agent</Typography>
                    <Typography variant="subtitle2">Office</Typography>
                    <Typography variant="subtitle2">Incomplete Items</Typography>
                    <Typography variant="subtitle2">Closing Date</Typography>
                    <Typography variant="subtitle2">Stage</Typography>
                    <Typography variant="subtitle2">Action</Typography>
                  </Box>
                  
                  {/* Table Rows */}
                  {[
                    { address: '550 Front Street, Beverly Hills, CA 90210', agent: 'Michael Renfroe' },
                    { address: '739 Front Street, Beverly Hills, CA 90210', agent: 'Angela Davis' },
                    { address: '67 Front Street, Beverly Hills, CA 90210', agent: 'Clarence King' },
                    { address: '135 Front Street, Beverly Hills, CA 90210', agent: 'Sean Magpie' },
                    { address: '744 Front Street, Beverly Hills, CA 90210', agent: 'Justin Henderson' },
                    { address: '66 Front Street, Beverly Hills, CA 90210', agent: 'Holly Frazier' },
                    { address: '759 Front Street, Beverly Hills, CA 90210', agent: 'Mark Coffee' },
                    { address: '75 Front Street, Beverly Hills, CA 90210', agent: 'Hazel Archies' },
                    { address: '629 Front Street, Beverly Hills, CA 90210', agent: 'Molly Bishop' },
                    { address: '631 Front Street, Beverly Hills, CA 90210', agent: 'William Jacobs' }
                  ].map((transaction, index) => (
                    <Box key={index} sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 100px 1.5fr 1fr 120px 120px 100px 80px', 
                      gap: 2, 
                      p: 2, 
                      borderBottom: '1px solid', 
                      borderColor: 'grey.200', 
                      alignItems: 'center',
                      '&:hover': { backgroundColor: 'grey.50' }
                    }}>
                      <Typography variant="body2">{transaction.address}</Typography>
                      <Chip label="Pending" color="warning" size="small" />
                      <Typography variant="body2">{transaction.agent}</Typography>
                      <Typography variant="body2">Eric Office</Typography>
                      <Typography variant="body2">1</Typography>
                      <Typography variant="body2">06/14/2015</Typography>
                      <Typography variant="body2">Checked</Typography>
                      <IconButton size="small" sx={{ color: 'grey.500' }}>
                        <VisibilityOffIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Paper>
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
              {/* Header Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button variant="contained" sx={{ backgroundColor: brandColors.accent.success }}>
                    Create Listing
                  </Button>
                </Box>
              </Box>

              {/* Search and Filter Bar */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: '300px' }}>
                    <input 
                      type="text" 
                      placeholder="Search listings..." 
                      style={{ 
                        flex: 1, 
                        padding: '8px 12px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }} 
                    />
                    <Button variant="contained" sx={{ backgroundColor: brandColors.actions.primary }}>
                      Search
                    </Button>
                  </Box>
                  <Button variant="outlined">Show All</Button>
                  <IconButton sx={{ border: '1px solid #ccc' }}>
                    <ListAltIcon />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid #ccc' }}>
                    <FilterListIcon />
                  </IconButton>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value=""
                      displayEmpty
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value=""
                      displayEmpty
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">Stage Filter</MenuItem>
                      <MenuItem value="checked">Checked</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="review">Under Review</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Listings Table */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ overflowX: 'auto' }}>
                  {/* Table Header */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '100px 2fr 100px 1.5fr 1fr 120px 120px 100px 80px 80px', 
                    gap: 2, 
                    p: 2, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 1, 
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    <Typography variant="subtitle2">MLS#</Typography>
                    <Typography variant="subtitle2">Property Address</Typography>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography variant="subtitle2">Listing Agent</Typography>
                    <Typography variant="subtitle2">Office</Typography>
                    <Typography variant="subtitle2">Expiration Date</Typography>
                    <Typography variant="subtitle2">Listing Price</Typography>
                    <Typography variant="subtitle2">Stage</Typography>
                    <Typography variant="subtitle2">View</Typography>
                    <Typography variant="subtitle2">Action</Typography>
                  </Box>
                  
                  {/* Table Rows */}
                  {[
                    {
                      mls: '6654893',
                      address: '123 Armadillo Street, Sacramento, CA 95820',
                      status: 'Active',
                      agent: 'Thompson, Aly',
                      office: 'East Office',
                      expiration: '07/01/2023',
                      price: '$344,444.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654894',
                      address: '1255 University Ave, Sacramento, CA 95825',
                      status: 'Active',
                      agent: 'Johnson, Mike',
                      office: 'Main Office',
                      expiration: '08/15/2023',
                      price: '$288,888.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654895',
                      address: '2340 Maritime Dr, Elk Grove, CA 95758',
                      status: 'Active',
                      agent: 'Smith, Sarah',
                      office: 'North Office',
                      expiration: '09/20/2023',
                      price: '$456,789.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654896',
                      address: '55624 OR-204, Weston, OR 97886',
                      status: 'Active',
                      agent: 'Davis, Lisa',
                      office: 'West Office',
                      expiration: '10/10/2023',
                      price: '$789,123.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654897',
                      address: '546 Woodland Rd, Goldendale, WA 98620',
                      status: 'Active',
                      agent: 'Wilson, Tom',
                      office: 'South Office',
                      expiration: '11/05/2023',
                      price: '$1,234,567.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654898',
                      address: '4534 A Pkwy, Sacramento, CA 95823',
                      status: 'Active',
                      agent: 'Brown, Jennifer',
                      office: 'East Office',
                      expiration: '12/01/2023',
                      price: '$2,345,678.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654899',
                      address: '2230 Auburn Blvd, Sacramento, CA 95281',
                      status: 'Active',
                      agent: 'Miller, David',
                      office: 'Main Office',
                      expiration: '01/15/2024',
                      price: '$2,987,654.00',
                      stage: 'Checked'
                    },
                    {
                      mls: '6654900',
                      address: '5462 Carlson Dr, Sacramento, CA 95819',
                      status: 'Active',
                      agent: 'Garcia, Maria',
                      office: 'North Office',
                      expiration: '02/20/2024',
                      price: '$3,423,532.00',
                      stage: 'Checked'
                    }
                  ].map((listing, index) => (
                    <Box key={index} sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '100px 2fr 100px 1.5fr 1fr 120px 120px 100px 80px 80px', 
                      gap: 2, 
                      p: 2, 
                      borderBottom: '1px solid', 
                      borderColor: 'grey.200', 
                      alignItems: 'center',
                      '&:hover': { backgroundColor: 'grey.50' }
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{listing.mls}</Typography>
                      <Typography variant="body2">{listing.address}</Typography>
                      <Chip label={listing.status} color="default" size="small" />
                      <Typography variant="body2">{listing.agent}</Typography>
                      <Typography variant="body2">{listing.office}</Typography>
                      <Typography variant="body2">{listing.expiration}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{listing.price}</Typography>
                      <Typography variant="body2">{listing.stage}</Typography>
                      <IconButton size="small" sx={{ color: brandColors.actions.primary }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: brandColors.accent.success }}>
                        <CheckCircleIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Paper>
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
              {/* Debug Info */}
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '1px solid #2196f3' }}>
                <Typography variant="body2" color="primary">
                  Debug: Current tab: {listingTab} | Property Type: {propertyType || 'None selected'}
                </Typography>
              </Box>
              
              {/* Navigation Tabs */}
              <Paper elevation={2} sx={{ p: 0, mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
                  <Box sx={{ display: 'flex' }}>
                    {['LISTING', 'PHOTOS', 'CONTACTS', 'CHECKLIST', 'DOCUMENTS', 'LOG', 'TASKS'].map((tab) => (
                      <Box
                        key={tab}
                        onClick={() => setListingTab(tab)}
                        sx={{
                          px: 3,
                          py: 2,
                          cursor: 'pointer',
                          borderBottom: tab === listingTab ? 2 : 0,
                          borderColor: tab === listingTab ? brandColors.primary : 'transparent',
                          backgroundColor: tab === listingTab ? brandColors.primary : 'transparent',
                          color: tab === listingTab ? 'white' : 'text.secondary',
                          fontWeight: tab === listingTab ? 600 : 400,
                          '&:hover': {
                            backgroundColor: tab === listingTab ? brandColors.primary : 'grey.50',
                            color: tab === listingTab ? 'white' : 'text.primary',
                          },
                        }}
                      >
                        <Typography variant="subtitle2">
                          {tab}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>

              {/* Tab Content */}
              {listingTab === 'LISTING' && (
                <>
                  {/* Property Type Selection - Above Property Information */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                      Property Type Selection
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Property Type *</Typography>
                        <select 
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Property Type</option>
                          <option value="single-family">Single Family</option>
                          <option value="multi-family">Multi Family</option>
                          <option value="hotel">Hotel</option>
                          <option value="land">Land</option>
                          <option value="office">Office</option>
                          <option value="retail">Retail</option>
                        </select>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Property Details Form */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                      Property Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Property Address *</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter full property address" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>City *</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter city" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>State *</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          <option value="WA">Washington</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>ZIP Code *</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter ZIP code" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Year Built</Typography>
                        <input 
                          type="number" 
                          placeholder="Enter year built" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                    </Box>
                  </Paper>

                  {/* Listing Details Form */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                      Listing Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Listing Price *</Typography>
                        <input 
                          type="number" 
                          placeholder="Enter listing price" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Square Footage</Typography>
                        <input 
                          type="number" 
                          placeholder="Enter square footage" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Bedrooms</Typography>
                        <input 
                          type="number" 
                          placeholder="Number of bedrooms" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Bathrooms</Typography>
                        <input 
                          type="number" 
                          placeholder="Number of bathrooms" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Lot Size (Acres)</Typography>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter lot size" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Listing Status</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="contingent">Contingent</option>
                          <option value="sold">Sold</option>
                        </select>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Dynamic Income Section based on Property Type */}
                  {propertyType && propertyType !== 'land' && (
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                        Income & Revenue
                      </Typography>
                      
                      {/* Property Configuration (Units) */}
                      {(propertyType === 'multi-family' || propertyType === 'hotel') && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                            Property Configuration
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Number of Units</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter number of units" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Short Term Income Fields (STR, Arbitrage, Hotel) */}
                      {propertyType !== 'office' && propertyType !== 'retail' && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                            Short Term Rental Income
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                            {propertyType === 'single-family' && (
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Nightly Rate</Typography>
                                <input 
                                  type="number" 
                                  placeholder="Enter nightly rate" 
                                  style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    border: '1px solid #ccc', 
                                    borderRadius: '4px', 
                                    fontSize: '14px' 
                                  }} 
                                />
                              </Box>
                            )}
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Average Nights/Month</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter average nights per month" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Daily Cleaning Fee</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter daily cleaning fee" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Long Term Rental Income */}
                      {propertyType === 'multi-family' && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                            Long Term Rental Income
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Monthly Rent per Unit</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter monthly rent" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Office/Retail Income */}
                      {(propertyType === 'office' || propertyType === 'retail') && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                            Commercial Income
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Monthly Rent</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter monthly rent" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Triple Net (NNN)</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter NNN amount" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  )}

                  {/* Dynamic Operating Expenses Section */}
                  {propertyType && propertyType !== 'land' && (
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                        Operating Expenses
                      </Typography>
                      
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Fixed Monthly Expenses
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Taxes</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter monthly taxes" 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Insurance</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter monthly insurance" 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>HOA</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter monthly HOA" 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Gas & Electric</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter monthly utilities" 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Water & Sewer</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter monthly water/sewer" 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Internet & Cable</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter monthly internet/cable" 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                      </Box>

                      {/* Additional Expenses for STR/Hotel */}
                      {propertyType !== 'office' && propertyType !== 'retail' && (
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: 'text.secondary' }}>
                            Short Term Rental Expenses
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Cleaning Service</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter monthly cleaning cost" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Property Management</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter management fee %" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Maintenance Reserve</Typography>
                              <input 
                                type="number" 
                                placeholder="Enter monthly maintenance reserve" 
                                style={{ 
                                  width: '100%', 
                                  padding: '12px', 
                                  border: '1px solid #ccc', 
                                  borderRadius: '4px', 
                                  fontSize: '14px' 
                                }} 
                              />
                            </Box>
                          </Box>
                        </>
                      )}
                    </Paper>
                  )}

                  {/* Agent and Contact Information */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                      Agent & Contact Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Listing Agent *</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Agent</option>
                          <option value="agent1">Aly Testing</option>
                          <option value="agent2">Michael Renfroe</option>
                          <option value="agent3">Angela Davis</option>
                          <option value="agent4">Clarence King</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Office *</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Office</option>
                          <option value="eric">Eric Office</option>
                          <option value="main">Main Office</option>
                          <option value="north">North Office</option>
                          <option value="east">East Office</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Seller Name</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter seller name" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Seller Email</Typography>
                        <input 
                          type="email" 
                          placeholder="Enter seller email" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                    </Box>
                  </Paper>

                  {/* Property Description */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                      Property Description
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                      <textarea 
                        placeholder="Enter detailed property description..." 
                        rows={4}
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          border: '1px solid #ccc', 
                          borderRadius: '4px', 
                          fontSize: '14px',
                          resize: 'vertical'
                        }} 
                      />
                    </Box>
                  </Paper>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    <Button variant="contained" size="large" sx={{ backgroundColor: brandColors.accent.success }}>
                      Next
                    </Button>
                  </Box>
                </>
              )}

              {listingTab === 'PHOTOS' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Property Photos
                  </Typography>
                  
                  {/* Property Type Warning */}
                  {!propertyType && (
                    <Box sx={{ 
                      mb: 4, 
                      p: 3, 
                      backgroundColor: '#fff3cd', 
                      border: '1px solid #ffeaa7', 
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        Please select a Property Type in the LISTING tab to see relevant photo categories
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Photo Upload Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Upload Photos
                    </Typography>
                    <Box sx={{ 
                      border: '2px dashed #ccc', 
                      borderRadius: '8px', 
                      p: 4, 
                      textAlign: 'center',
                      backgroundColor: '#fafafa',
                      cursor: 'pointer',
                      '&:hover': { borderColor: brandColors.primary, backgroundColor: '#f0f8ff' }
                    }}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Drag and drop photos here, or click to browse
                      </Typography>
                      <Button variant="outlined" sx={{ mt: 2 }}>
                        Browse Files
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Supported formats: JPG, PNG, GIF (Max 10MB per file)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Dynamic Photo Categories based on Property Type */}
                  {propertyType && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                        Photo Categories for {propertyType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                      
                      {/* Single Family Photo Categories */}
                      {propertyType === 'single-family' && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[
                            'Exterior Front View',
                            'Exterior Back View', 
                            'Kitchen',
                            'Living Room',
                            'Master Bedroom',
                            'Additional Bedrooms',
                            'Master Bathroom',
                            'Additional Bathrooms',
                            'Garage',
                            'Backyard/Patio',
                            'Basement (if applicable)',
                            'Attic (if applicable)'
                          ].map((category) => (
                            <Box key={category} sx={{ 
                              border: '1px solid #e0e0e0', 
                              borderRadius: '4px', 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f9f9f9'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                              <Typography variant="caption" color="text.secondary">0 photos</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Multi Family Photo Categories */}
                      {propertyType === 'multi-family' && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[
                            'Building Exterior Front',
                            'Building Exterior Back',
                            'Building Exterior Sides',
                            'Unit 1 - Kitchen',
                            'Unit 1 - Living Room',
                            'Unit 1 - Bedrooms',
                            'Unit 1 - Bathrooms',
                            'Unit 2 - Kitchen',
                            'Unit 2 - Living Room',
                            'Unit 2 - Bedrooms',
                            'Unit 2 - Bathrooms',
                            'Common Areas',
                            'Parking/Garage',
                            'Landscaping'
                          ].map((category) => (
                            <Box key={category} sx={{ 
                              border: '1px solid #e0e0e0', 
                              borderRadius: '4px', 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f9f9f9'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                              <Typography variant="caption" color="text.secondary">0 photos</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Hotel Photo Categories */}
                      {propertyType === 'hotel' && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[
                            'Hotel Exterior Front',
                            'Hotel Exterior Back',
                            'Hotel Exterior Sides',
                            'Lobby/Reception',
                            'Standard Room',
                            'Deluxe Room',
                            'Suite',
                            'Bathroom',
                            'Restaurant/Dining',
                            'Pool Area',
                            'Fitness Center',
                            'Conference Rooms',
                            'Parking',
                            'Landscaping'
                          ].map((category) => (
                            <Box key={category} sx={{ 
                              border: '1px solid #e0e0e0', 
                              borderRadius: '4px', 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f9f9f9'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                              <Typography variant="caption" color="text.secondary">0 photos</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Land Photo Categories */}
                      {propertyType === 'land' && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[
                            'Aerial View',
                            'Front View',
                            'Side Views',
                            'Topography',
                            'Soil Conditions',
                            'Access Points',
                            'Boundary Markers',
                            'Existing Structures',
                            'Vegetation',
                            'Water Features',
                            'Survey Points',
                            'Zoning Information'
                          ].map((category) => (
                            <Box key={category} sx={{ 
                              border: '1px solid #e0e0e0', 
                              borderRadius: '4px', 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f9f9f9'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                              <Typography variant="caption" color="text.secondary">0 photos</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Office Photo Categories */}
                      {propertyType === 'office' && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[
                            'Building Exterior Front',
                            'Building Exterior Back',
                            'Building Exterior Sides',
                            'Main Lobby',
                            'Reception Area',
                            'Open Office Space',
                            'Private Offices',
                            'Conference Rooms',
                            'Break Room',
                            'Restrooms',
                            'Storage Areas',
                            'Parking Garage',
                            'Building Systems',
                            'Landscaping'
                          ].map((category) => (
                            <Box key={category} sx={{ 
                              border: '1px solid #e0e0e0', 
                              borderRadius: '4px', 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f9f9f9'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                              <Typography variant="caption" color="text.secondary">0 photos</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Retail Photo Categories */}
                      {propertyType === 'retail' && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[
                            'Store Front',
                            'Store Exterior',
                            'Main Sales Floor',
                            'Display Areas',
                            'Checkout Counter',
                            'Storage/Stock Room',
                            'Employee Break Room',
                            'Restrooms',
                            'Loading Dock',
                            'Parking Lot',
                            'Signage',
                            'Window Displays',
                            'Security Features',
                            'HVAC Systems'
                          ].map((category) => (
                            <Box key={category} sx={{ 
                              border: '1px solid #e0e0e0', 
                              borderRadius: '4px', 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f9f9f9'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                              <Typography variant="caption" color="text.secondary">0 photos</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Photo Management */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Photo Management
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button variant="outlined" size="small">
                        Organize Photos
                      </Button>
                      <Button variant="outlined" size="small">
                        Set Cover Photo
                      </Button>
                      <Button variant="outlined" size="small">
                        Bulk Edit
                      </Button>
                      <Button variant="outlined" size="small" color="error">
                        Delete Selected
                      </Button>
                      {propertyType && (
                        <Button variant="contained" size="small" sx={{ backgroundColor: brandColors.accent.success }}>
                          Generate Photo Report
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              {listingTab === 'CONTACTS' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Contact Information
                  </Typography>
                  
                  {/* Add New Contact */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Add New Contact
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Contact Type *</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Contact Type</option>
                          <option value="seller">Seller</option>
                          <option value="buyer">Buyer</option>
                          <option value="agent">Agent</option>
                          <option value="lender">Lender</option>
                          <option value="inspector">Inspector</option>
                          <option value="attorney">Attorney</option>
                          <option value="other">Other</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>First Name *</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter first name" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Last Name *</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter last name" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Email</Typography>
                        <input 
                          type="email" 
                          placeholder="Enter email address" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Phone</Typography>
                        <input 
                          type="tel" 
                          placeholder="Enter phone number" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Company</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter company name" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Button variant="contained" sx={{ backgroundColor: brandColors.accent.success }}>
                        Add Contact
                      </Button>
                    </Box>
                  </Box>

                  {/* Contact List */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Contact List
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {/* Table Header */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 80px', 
                        gap: 2, 
                        p: 2, 
                        backgroundColor: 'grey.50', 
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography variant="subtitle2">Type</Typography>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="subtitle2">Phone</Typography>
                        <Typography variant="subtitle2">Company</Typography>
                        <Typography variant="subtitle2">Actions</Typography>
                      </Box>
                      
                      {/* Sample Contacts */}
                      {[
                        { name: 'John Smith', type: 'Seller', email: 'john@email.com', phone: '(555) 123-4567', company: 'Smith Properties' },
                        { name: 'Sarah Johnson', type: 'Buyer', email: 'sarah@email.com', phone: '(555) 987-6543', company: 'Johnson Corp' },
                        { name: 'Mike Wilson', type: 'Agent', email: 'mike@realty.com', phone: '(555) 456-7890', company: 'Wilson Realty' }
                      ].map((contact, index) => (
                        <Box key={index} sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 80px', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}>
                          <Typography variant="body2">{contact.name}</Typography>
                          <Chip label={contact.type} size="small" color="primary" />
                          <Typography variant="body2">{contact.email}</Typography>
                          <Typography variant="body2">{contact.phone}</Typography>
                          <Typography variant="body2">{contact.company}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" sx={{ color: brandColors.actions.primary }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'error.main' }}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              )}

              {listingTab === 'CHECKLIST' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Listing Checklist
                  </Typography>
                  
                  {/* Checklist Categories */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Checklist Categories
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                      {['All', 'Property', 'Legal', 'Marketing', 'Financial', 'Closing'].map((category) => (
                        <Chip 
                          key={category}
                          label={category} 
                          variant={category === 'All' ? 'filled' : 'outlined'}
                          color={category === 'All' ? 'primary' : 'default'}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Checklist Items */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Checklist Items
                    </Typography>
                    
                    {/* Property Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, color: brandColors.primary, fontWeight: 600 }}>
                        Property Preparation
                      </Typography>
                      {[
                        'Property photos taken and uploaded',
                        'Property description written',
                        'Property measurements verified',
                        'Property condition assessed',
                        'Repairs completed (if needed)'
                      ].map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          border: '1px solid #e0e0e0', 
                          borderRadius: '4px', 
                          mb: 1,
                          backgroundColor: '#fafafa'
                        }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1 }}>{item}</Typography>
                          <Chip label="Pending" size="small" color="warning" />
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>

                    {/* Legal Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, color: brandColors.primary, fontWeight: 600 }}>
                        Legal & Documentation
                      </Typography>
                      {[
                        'Title search completed',
                        'Property tax information verified',
                        'HOA documents reviewed',
                        'Disclosure forms prepared',
                        'Contract templates ready'
                      ].map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          border: '1px solid #e0e0e0', 
                          borderRadius: '4px', 
                          mb: 1,
                          backgroundColor: '#fafafa'
                        }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1 }}>{item}</Typography>
                          <Chip label="Not Started" size="small" color="default" />
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>

                    {/* Add New Item */}
                    <Box sx={{ mt: 4, p: 3, border: '1px dashed #ccc', borderRadius: '4px' }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                        Add New Checklist Item
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>Item Description</Typography>
                          <input 
                            type="text" 
                            placeholder="Enter checklist item description" 
                            style={{ 
                              width: '100%', 
                              padding: '8px 12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }} 
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom>Category</Typography>
                          <select 
                            style={{ 
                              padding: '8px 12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }}
                          >
                            <option value="property">Property</option>
                            <option value="legal">Legal</option>
                            <option value="marketing">Marketing</option>
                            <option value="financial">Financial</option>
                            <option value="closing">Closing</option>
                          </select>
                        </Box>
                        <Button variant="outlined" size="small">
                          Add Item
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              )}

              {listingTab === 'DOCUMENTS' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Documents
                  </Typography>
                  
                  {/* Document Upload */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Upload Documents
                    </Typography>
                    <Box sx={{ 
                      border: '2px dashed #ccc', 
                      borderRadius: '8px', 
                      p: 4, 
                      textAlign: 'center',
                      backgroundColor: '#fafafa',
                      cursor: 'pointer',
                      '&:hover': { borderColor: brandColors.primary, backgroundColor: '#f0f8ff' }
                    }}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Drag and drop documents here, or click to browse
                      </Typography>
                      <Button variant="outlined" sx={{ mt: 2 }}>
                        Browse Files
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 25MB per file)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Document Categories */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Document Categories
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                      {[
                        { name: 'Property Documents', count: 5, color: 'primary' },
                        { name: 'Legal Documents', count: 3, color: 'secondary' },
                        { name: 'Financial Documents', count: 2, color: 'success' },
                        { name: 'Marketing Materials', count: 4, color: 'info' },
                        { name: 'Contracts', count: 1, color: 'warning' },
                        { name: 'Other', count: 2, color: 'default' }
                      ].map((category) => (
                        <Box key={category.name} sx={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: '4px', 
                          p: 2, 
                          textAlign: 'center',
                          backgroundColor: '#f9f9f9',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f0f0f0' }
                        }}>
                          <Typography variant="subtitle2" gutterBottom>{category.name}</Typography>
                          <Typography variant="h6" color={`${category.color}.main`}>{category.count}</Typography>
                          <Typography variant="caption" color="text.secondary">documents</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Document List */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Document List
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {/* Table Header */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', 
                        gap: 2, 
                        p: 2, 
                        backgroundColor: 'grey.50', 
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        <Typography variant="subtitle2">Document Name</Typography>
                        <Typography variant="subtitle2">Category</Typography>
                        <Typography variant="subtitle2">Upload Date</Typography>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography variant="subtitle2">Actions</Typography>
                      </Box>
                      
                      {/* Sample Documents */}
                      {[
                        { name: 'Property_Photos.pdf', category: 'Property Documents', date: '2024-01-15', status: 'Approved' },
                        { name: 'Title_Report.pdf', category: 'Legal Documents', date: '2024-01-14', status: 'Pending Review' },
                        { name: 'Financial_Statement.xlsx', category: 'Financial Documents', date: '2024-01-13', status: 'Approved' },
                        { name: 'Marketing_Brochure.pdf', category: 'Marketing Materials', date: '2024-01-12', status: 'Draft' }
                      ].map((doc, index) => (
                        <Box key={index} sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{doc.name}</Typography>
                          <Typography variant="body2">{doc.category}</Typography>
                          <Typography variant="body2">{doc.date}</Typography>
                          <Chip 
                            label={doc.status} 
                            size="small" 
                            color={
                              doc.status === 'Approved' ? 'success' : 
                              doc.status === 'Pending Review' ? 'warning' : 
                              doc.status === 'Draft' ? 'default' : 'error'
                            } 
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" sx={{ color: brandColors.actions.primary }}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'error.main' }}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              )}

              {listingTab === 'LOG' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Activity Log
                  </Typography>
                  
                  {/* Log Filters */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Filter Activity
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom>Activity Type</Typography>
                        <select 
                          style={{ 
                            padding: '8px 12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">All Activities</option>
                          <option value="edit">Edits</option>
                          <option value="upload">Uploads</option>
                          <option value="status">Status Changes</option>
                          <option value="comment">Comments</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom>Date Range</Typography>
                        <select 
                          style={{ 
                            padding: '8px 12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="all">All Time</option>
                        </select>
                      </Box>
                      <Button variant="outlined" size="small">
                        Apply Filters
                      </Button>
                      <Button variant="outlined" size="small">
                        Clear Filters
                      </Button>
                    </Box>
                  </Box>

                  {/* Activity Timeline */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    
                    {/* Timeline Items */}
                    <Box sx={{ position: 'relative' }}>
                      {/* Timeline Line */}
                      <Box sx={{ 
                        position: 'absolute', 
                        left: '20px', 
                        top: 0, 
                        bottom: 0, 
                        width: '2px', 
                        backgroundColor: '#e0e0e0' 
                      }} />
                      
                      {/* Activity Items */}
                      {[
                        { 
                          time: '2:30 PM', 
                          date: 'Today', 
                          action: 'Property photos uploaded', 
                          user: 'Sarah Johnson', 
                          type: 'upload',
                          details: '5 photos added to Exterior category'
                        },
                        { 
                          time: '1:45 PM', 
                          date: 'Today', 
                          action: 'Listing description updated', 
                          user: 'Sarah Johnson', 
                          type: 'edit',
                          details: 'Updated property description with new amenities'
                        },
                        { 
                          time: '11:20 AM', 
                          date: 'Today', 
                          action: 'New contact added', 
                          user: 'Sarah Johnson', 
                          type: 'add',
                          details: 'Added buyer contact: Mike Wilson'
                        },
                        { 
                          time: '9:15 AM', 
                          date: 'Today', 
                          action: 'Listing status changed', 
                          user: 'System', 
                          type: 'status',
                          details: 'Status changed from Draft to Active'
                        },
                        { 
                          time: '3:45 PM', 
                          date: 'Yesterday', 
                          action: 'Document uploaded', 
                          user: 'Sarah Johnson', 
                          type: 'upload',
                          details: 'Title report uploaded to Legal Documents'
                        }
                      ].map((activity, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          gap: 3, 
                          mb: 3, 
                          position: 'relative' 
                        }}>
                          {/* Timeline Dot */}
                          <Box sx={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            backgroundColor: 
                              activity.type === 'upload' ? brandColors.accent.success :
                              activity.type === 'edit' ? brandColors.actions.primary :
                              activity.type === 'add' ? brandColors.accent.info :
                              activity.type === 'status' ? brandColors.accent.warning : brandColors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            zIndex: 1
                          }}>
                            {activity.type === 'upload' ? 'UP' :
                             activity.type === 'edit' ? 'ED' :
                             activity.type === 'add' ? 'AD' :
                             activity.type === 'status' ? 'ST' : 'AC'}
                          </Box>
                          
                          {/* Activity Content */}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {activity.action}
                              </Typography>
                              <Chip 
                                label={activity.type.toUpperCase()} 
                                size="small" 
                                color={
                                  activity.type === 'upload' ? 'success' : 
                                  activity.type === 'edit' ? 'primary' : 
                                  activity.type === 'add' ? 'info' : 
                                  activity.type === 'status' ? 'warning' : 'default'
                                } 
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {activity.details}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                {activity.time} • {activity.date}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                by {activity.user}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              )}

              {listingTab === 'TASKS' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Tasks
                  </Typography>
                  
                  {/* Add New Task */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Add New Task
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Task Title *</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter task title" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Priority *</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Due Date</Typography>
                        <input 
                          type="date" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Assigned To</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Assignee</option>
                          <option value="sarah">Sarah Johnson</option>
                          <option value="mike">Mike Wilson</option>
                          <option value="angela">Angela Davis</option>
                        </select>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Task Description</Typography>
                      <textarea 
                        placeholder="Enter task description..." 
                        rows={3}
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          border: '1px solid #ccc', 
                          borderRadius: '4px', 
                          fontSize: '14px',
                          resize: 'vertical'
                        }} 
                      />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Button variant="contained" sx={{ backgroundColor: brandColors.accent.success }}>
                        Create Task
                      </Button>
                    </Box>
                  </Box>

                  {/* Task List */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Task List
                    </Typography>
                    
                    {/* Task Filters */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                      {['All', 'My Tasks', 'High Priority', 'Overdue', 'Completed'].map((filter) => (
                        <Chip 
                          key={filter}
                          label={filter} 
                          variant={filter === 'All' ? 'filled' : 'outlined'}
                          color={filter === 'All' ? 'primary' : 'default'}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>

                    {/* Tasks */}
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {/* Table Header */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', 
                        gap: 2, 
                        p: 2, 
                        backgroundColor: 'grey.50', 
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        <Typography variant="subtitle2">Task</Typography>
                        <Typography variant="subtitle2">Priority</Typography>
                        <Typography variant="subtitle2">Due Date</Typography>
                        <Typography variant="subtitle2">Assigned To</Typography>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography variant="subtitle2">Actions</Typography>
                      </Box>
                      
                      {/* Sample Tasks */}
                      {[
                        { 
                          title: 'Upload property photos', 
                          priority: 'high', 
                          dueDate: '2024-01-20', 
                          assignedTo: 'Sarah Johnson', 
                          status: 'In Progress' 
                        },
                        { 
                          title: 'Review title report', 
                          priority: 'urgent', 
                          dueDate: '2024-01-18', 
                          assignedTo: 'Mike Wilson', 
                          status: 'Pending' 
                        },
                        { 
                          title: 'Prepare marketing materials', 
                          priority: 'medium', 
                          dueDate: '2024-01-25', 
                          assignedTo: 'Angela Davis', 
                          status: 'Not Started' 
                        },
                        { 
                          title: 'Schedule property inspection', 
                          priority: 'low', 
                          dueDate: '2024-01-30', 
                          assignedTo: 'Sarah Johnson', 
                          status: 'Completed' 
                        }
                      ].map((task, index) => (
                        <Box key={index} sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{task.title}</Typography>
                          <Chip 
                            label={task.priority.toUpperCase()} 
                            size="small" 
                            color={
                              task.priority === 'urgent' ? 'error' : 
                              task.priority === 'high' ? 'warning' : 
                              task.priority === 'medium' ? 'primary' : 'default'
                            } 
                          />
                          <Typography variant="body2">{task.dueDate}</Typography>
                          <Typography variant="body2">{task.assignedTo}</Typography>
                          <Chip 
                            label={task.status} 
                            size="small" 
                            color={
                              task.status === 'Completed' ? 'success' : 
                              task.status === 'In Progress' ? 'primary' : 
                              task.status === 'Pending' ? 'warning' : 'default'
                            } 
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" sx={{ color: brandColors.actions.primary }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'error.main' }}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              )}
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
