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
  Modal,
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
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Comment as CommentIcon,
  Sort as SortIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
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
  showImportSuccess?: boolean;
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
  const [propertyPurpose, setPropertyPurpose] = useState('sale'); // 'sale' or 'rent'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDocCategory, setSelectedDocCategory] = useState('All');

  // Tab completion tracking for guided navigation
  const [tabCompletion, setTabCompletion] = useState({
    LISTING: false,
    PHOTOS: false,
    CONTACTS: false,
    CHECKLIST: false,
    DOCUMENTS: false,
    LOG: false,
    TASKS: false
  });

  // Function to mark tab as completed
  const markTabComplete = (tabName: string) => {
    setTabCompletion(prev => ({
      ...prev,
      [tabName]: true
    }));
  };

  // Function to get next suggested tab
  const getNextSuggestedTab = () => {
    const tabOrder = ['LISTING', 'CONTACTS', 'PHOTOS', 'DOCUMENTS', 'CHECKLIST', 'TASKS', 'LOG'];
    const currentIndex = tabOrder.indexOf(listingTab);
    
    // Find next incomplete tab
    for (let i = currentIndex + 1; i < tabOrder.length; i++) {
      if (!tabCompletion[tabOrder[i] as keyof typeof tabCompletion]) {
        return tabOrder[i];
      }
    }
    
    // If all tabs after current are complete, suggest first incomplete tab
    for (let i = 0; i < tabOrder.length; i++) {
      if (!tabCompletion[tabOrder[i] as keyof typeof tabCompletion]) {
        return tabOrder[i];
      }
    }
    
    return null; // All tabs complete
  };

  // Function to navigate to next suggested tab
  const goToNextTab = () => {
    const nextTab = getNextSuggestedTab();
    if (nextTab) {
      setListingTab(nextTab);
    }
  };

  // Check if all tabs are complete
  const allTabsComplete = Object.values(tabCompletion).every(complete => complete);

  // MLS Modal State
  const [mlsModalOpen, setMlsModalOpen] = useState(false);
  const [mlsSearchQuery, setMlsSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // MLS Functions
  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
  };

  const handleImportProperty = () => {
    if (selectedProperty) {
      // Here you would populate the form fields with the selected property data
      console.log('Importing property:', selectedProperty);
      
      // Show success message
      setState(prev => ({
        ...prev,
        showImportSuccess: true
      }));
      
      // Auto-close modal after a delay
      setTimeout(() => {
        setMlsModalOpen(false);
        setSelectedProperty(null);
        setState(prev => ({
          ...prev,
          showImportSuccess: false
        }));
      }, 2000);
    }
  };



  // Property Purpose Functions
  const handlePropertyPurposeChange = (purpose: 'sale' | 'rent') => {
    setPropertyPurpose(purpose);
    // Reset property type when switching purpose
    setPropertyType('');
    // Reset tab completion for LISTING tab
    setTabCompletion(prev => ({
      ...prev,
      LISTING: false
    }));
  };

  // Auto-mark LISTING tab as complete when property type and purpose are selected
  useEffect(() => {
    if (propertyType && propertyPurpose && !tabCompletion.LISTING) {
      markTabComplete('LISTING');
    }
  }, [propertyType, propertyPurpose, tabCompletion.LISTING]);

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
    { value: 'working-documents', label: 'Templates', icon: <AssignmentTurnedInIcon /> },
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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

            {/* Overview Cards - Row 3 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  $2.4M
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pipeline Value
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <EventIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  7
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Scheduled Closing This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <AttachMoneyIcon sx={{ fontSize: 32, color: brandColors.accent.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.warning }}>
                  $18.5K
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pending Commission
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <AccountBalanceIcon sx={{ fontSize: 32, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  $32.1K
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Commission Earned This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <ScheduleIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Expired Listings This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2.5, textAlign: 'center', flex: '1 1 180px', minWidth: '180px' }}>
                <WarningIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  1
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Expired Escrow(s) This Month
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

            {/* Transactions Content */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Create Your File Form */}
              <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: brandColors.primary }}>
                  Create Your File
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Let's capture a few details to make your workflow faster.
                </Typography>

                                  {/* Form Sections */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* 0. Transaction Type Section */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: brandColors.primary }}>
                        Transaction Type
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        {['Purchase', 'Sale', 'Lease', 'Refinance'].map((type) => (
                          <Box key={type} sx={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              id={`transaction-${type.toLowerCase()}`}
                              name="transactionType"
                              value={type.toLowerCase()}
                              style={{ marginRight: '8px' }}
                            />
                            <label htmlFor={`transaction-${type.toLowerCase()}`}>
                              <Typography variant="body1">{type}</Typography>
                            </label>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* 1. Who's your client? Section */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: brandColors.primary }}>
                        Who's your client?
                      </Typography>
                    
                    {/* Representation */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Representation
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        {['Buyer', 'Tenant', 'Seller', 'Landlord'].map((type) => (
                          <Box key={type} sx={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              id={type.toLowerCase()}
                              name="representation"
                              value={type.toLowerCase()}
                              style={{ marginRight: '8px' }}
                            />
                            <label htmlFor={type.toLowerCase()}>
                              <Typography variant="body1">{type}</Typography>
                            </label>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Primary Client */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Primary Client
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
                          <input
                            type="checkbox"
                            id="company-trust"
                            style={{ marginRight: '8px' }}
                          />
                          <label htmlFor="company-trust">
                            <Typography variant="body1">My client is a company, trust</Typography>
                          </label>
                        </Box>
                      </Box>
                      
                      {/* Client Name Fields */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mt: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            First Name
                          </Typography>
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
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Last Name
                          </Typography>
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
                      </Box>
                      
                      {/* Client Contact Fields */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mt: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Email
                          </Typography>
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
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Phone
                          </Typography>
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
                      </Box>
                    </Box>

                    {/* Additional Contact */}
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: brandColors.primary,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': { opacity: 0.8 }
                        }}
                      >
                        + Additional Contact
                      </Typography>
                    </Box>
                  </Box>

                  {/* 2. Property Information Section */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: brandColors.primary }}>
                      Property Information
                    </Typography>
                    
                    {/* MLS Integration Notice */}
                    <Box sx={{ 
                      p: 2, 
                      mb: 3, 
                      backgroundColor: '#e3f2fd', 
                      border: '1px solid #2196f3',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                        💡 Tip: Use MLS Search to auto-fill property details for accuracy
                      </Typography>
                    </Box>
                    
                    {/* Property Fields */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Street Address
                        </Typography>
                        <input
                          type="text"
                          placeholder="Enter street address"
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
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          City
                        </Typography>
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
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          State
                        </Typography>
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
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          <option value="NY">New York</option>
                          <option value="IL">Illinois</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ZIP Code
                        </Typography>
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
                    </Box>

                    {/* MLS Search Button */}
                    <Button
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={() => setMlsModalOpen(true)}
                      sx={{
                        borderColor: brandColors.primary,
                        color: brandColors.primary,
                        '&:hover': {
                          borderColor: brandColors.primary,
                          backgroundColor: 'rgba(26, 54, 93, 0.04)'
                        }
                      }}
                    >
                      Search MLS Data
                    </Button>
                    
                    {/* Additional Property Details */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Additional Details
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Property Type
                          </Typography>
                          <select
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
                            <option value="condo">Condo</option>
                            <option value="townhouse">Townhouse</option>
                            <option value="land">Land</option>
                          </select>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Estimated Value
                          </Typography>
                          <input
                            type="text"
                            placeholder="Enter estimated value"
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
                  </Box>

                  {/* 3. Transaction Timeline Section */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: brandColors.primary }}>
                      Transaction Timeline
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Target Closing Date
                        </Typography>
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
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Priority Level
                        </Typography>
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
                    </Box>
                  </Box>

                  {/* Form Actions */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, pt: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: brandColors.primary,
                        '&:hover': { backgroundColor: brandColors.primary, opacity: 0.9 },
                        py: 1.5,
                        px: 4
                      }}
                    >
                      Create File
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      sx={{ py: 1.5, px: 4 }}
                    >
                      Save Draft
                    </Button>
                  </Box>
                  
                  {/* Form Status */}
                  <Box sx={{ 
                    p: 2, 
                    mt: 2, 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #e9ecef',
                    borderRadius: '8px'
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      💡 This form creates a new transaction file. Use MLS Search for accurate property data.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Existing Transactions List */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: brandColors.primary }}>
                  Active Transactions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your active transactions will appear here.
                </Typography>
              </Paper>
            </Box>

            {/* MLS Data Search Modal */}
            <Modal
              open={mlsModalOpen}
              onClose={() => setMlsModalOpen(false)}
              aria-labelledby="mls-search-modal"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
              }}
            >
              <Paper
                elevation={24}
                sx={{
                  width: { xs: '95%', sm: '600px', md: '800px' },
                  maxHeight: '90vh',
                  overflow: 'auto',
                  p: 3,
                  borderRadius: '12px'
                }}
              >
                {/* Modal Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Search for MLS data
                  </Typography>
                  <IconButton onClick={() => setMlsModalOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Search Input */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Search by MLS #
                  </Typography>
                  <input
                    type="text"
                    placeholder="Enter MLS number"
                    value={mlsSearchQuery}
                    onChange={(e) => setMlsSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </Box>

                {/* Results Section */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    RESULTS:
                  </Typography>
                  
                  {/* MLS Results */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      {
                        mlsNumber: '22-290',
                        address: '4319 Brookins Rd, Leesville, LA 41446',
                        agent: 'Susan Pillard',
                        date: '11/25/2020',
                        price: '$200,000',
                        propertyType: 'Single Family',
                        sqft: '1,850',
                        beds: '3',
                        baths: '2',
                        yearBuilt: '1995'
                      },
                      {
                        mlsNumber: '22-295',
                        address: '2654 Shadow Lark Rd, Leesville, LA 41597',
                        agent: 'Charlotte Brunswick',
                        date: '6/11/2020',
                        price: '$250,000',
                        propertyType: 'Multi Family',
                        sqft: '2,200',
                        beds: '4',
                        baths: '3',
                        yearBuilt: '1998'
                      },
                      {
                        mlsNumber: '22-296',
                        address: '2654 Monarch Ave, Leesville, LA 41366',
                        agent: 'Caroline Cruz',
                        date: '3/16/2020',
                        price: '$219,000',
                        propertyType: 'Condo',
                        sqft: '1,600',
                        beds: '2',
                        baths: '2',
                        yearBuilt: '2000'
                      }
                    ].map((property, index) => (
                      <Paper
                        key={index}
                        elevation={1}
                        sx={{
                          p: 2,
                          border: selectedProperty?.mlsNumber === property.mlsNumber ? `2px solid ${brandColors.primary}` : '1px solid #e0e0e0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedProperty?.mlsNumber === property.mlsNumber ? '#f0f8ff' : 'white',
                          '&:hover': {
                            backgroundColor: selectedProperty?.mlsNumber === property.mlsNumber ? '#f0f8ff' : '#f5f5f5',
                            borderColor: brandColors.primary
                          }
                        }}
                        onClick={() => handlePropertySelect(property)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              MLS#: {property.mlsNumber}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {property.address}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                              <Chip label={property.propertyType} size="small" variant="outlined" />
                              <Chip label={`${property.beds} bed`} size="small" variant="outlined" />
                              <Chip label={`${property.baths} bath`} size="small" variant="outlined" />
                              <Chip label={`${property.sqft} sqft`} size="small" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Listed by: {property.agent} • {property.date} • {property.price}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: 80, 
                            height: 60, 
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #ddd'
                          }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                              PHOTO NOT AVAILABLE
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>

                {/* Success Message */}
                {state.showImportSuccess && (
                  <Box sx={{ 
                    p: 2, 
                    mt: 2, 
                    backgroundColor: '#e8f5e8', 
                    border: '1px solid #4caf50',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                      ✅ Property data imported successfully!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#388e3c', mt: 1 }}>
                      Property details have been added to your form.
                    </Typography>
                  </Box>
                )}

                {/* Modal Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setMlsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleImportProperty}
                    disabled={!selectedProperty}
                    sx={{
                      backgroundColor: brandColors.primary,
                      '&:hover': { backgroundColor: brandColors.primary, opacity: 0.9 }
                    }}
                  >
                    Import
                  </Button>
                </Box>
              </Paper>
            </Modal>
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

              

              
              {/* Navigation Tabs */}
              <Paper elevation={2} sx={{ p: 0, mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
                  <Box sx={{ display: 'flex' }}>
                    {['LISTING', 'CONTACTS', 'PHOTOS', 'DOCUMENTS', 'CHECKLIST', 'TASKS', 'LOG'].map((tab) => (
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
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: tab === listingTab ? brandColors.primary : 'grey.50',
                            color: tab === listingTab ? 'white' : 'text.primary',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {tab}
                          </Typography>
                          {/* Completion indicator */}
                          {tabCompletion[tab as keyof typeof tabCompletion] && (
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: brandColors.accent.success,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ml: 1
                              }}
                            >
                              <CheckCircleIcon sx={{ fontSize: 12, color: 'white' }} />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                {/* Progress Bar */}
                <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress: {Object.values(tabCompletion).filter(Boolean).length} of 7 tabs completed
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({Math.round((Object.values(tabCompletion).filter(Boolean).length / 7) * 100)}%)
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    height: 8, 
                    backgroundColor: 'grey.300', 
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      width: `${(Object.values(tabCompletion).filter(Boolean).length / 7) * 100}%`,
                      height: '100%',
                      backgroundColor: brandColors.accent.success,
                      transition: 'width 0.3s ease'
                    }} />
                  </Box>
                </Box>
              </Paper>

              {/* Tab Content */}
              {listingTab === 'LISTING' && (
                <>
                  {/* Property Purpose Toggle - Sale vs Rent */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                      Property Purpose
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        I'm creating a listing for:
                      </Typography>
                      <Box sx={{ display: 'flex', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                        <Box
                          onClick={() => handlePropertyPurposeChange('sale')}
                          sx={{
                            px: 3,
                            py: 1.5,
                            cursor: 'pointer',
                            backgroundColor: propertyPurpose === 'sale' ? brandColors.primary : 'white',
                            color: propertyPurpose === 'sale' ? 'white' : 'text.primary',
                            borderRight: '1px solid #ccc',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: propertyPurpose === 'sale' ? brandColors.primary : '#f5f5f5'
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            For Sale
                          </Typography>
                        </Box>
                        <Box
                          onClick={() => handlePropertyPurposeChange('rent')}
                          sx={{
                            px: 3,
                            py: 1.5,
                            cursor: 'pointer',
                            backgroundColor: propertyPurpose === 'rent' ? brandColors.primary : 'white',
                            color: propertyPurpose === 'rent' ? 'white' : 'text.primary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: propertyPurpose === 'rent' ? brandColors.primary : '#f5f5f5'
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            For Rent
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>

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
                          {propertyPurpose === 'sale' ? (
                            <>
                              <option value="single-family">Single Family</option>
                              <option value="multi-family">Multi Family</option>
                              <option value="condo">Condo</option>
                              <option value="townhouse">Townhouse</option>
                              <option value="land">Land</option>
                              <option value="commercial">Commercial</option>
                            </>
                          ) : (
                            <>
                              <option value="apartment">Apartment</option>
                              <option value="house">House</option>
                              <option value="condo">Condo</option>
                              <option value="room">Room</option>
                              <option value="commercial">Commercial Space</option>
                            </>
                          )}
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
                      {propertyPurpose === 'sale' ? 'Listing Details' : 'Rental Details'}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {propertyPurpose === 'sale' ? 'Listing Price *' : 'Monthly Rent *'}
                        </Typography>
                        <input 
                          type="number" 
                          placeholder={propertyPurpose === 'sale' ? 'Enter listing price' : 'Enter monthly rent'} 
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

                  {/* Rental-Specific Details */}
                  {propertyPurpose === 'rent' && (
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                        Rental Details
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Security Deposit</Typography>
                          <input 
                            type="number" 
                            placeholder="Enter security deposit amount" 
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
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Lease Duration</Typography>
                          <select 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }}
                          >
                            <option value="">Select lease duration</option>
                            <option value="6-months">6 Months</option>
                            <option value="1-year">1 Year</option>
                            <option value="2-years">2 Years</option>
                            <option value="month-to-month">Month-to-Month</option>
                          </select>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Available Date</Typography>
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
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Utilities Included</Typography>
                          <select 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }}
                          >
                            <option value="">Select utilities included</option>
                            <option value="all">All Utilities</option>
                            <option value="partial">Partial Utilities</option>
                            <option value="none">No Utilities</option>
                            <option value="heat-water">Heat & Water</option>
                            <option value="water-only">Water Only</option>
                          </select>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Pet Policy</Typography>
                          <select 
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px', 
                              fontSize: '14px' 
                            }}
                          >
                            <option value="">Select pet policy</option>
                            <option value="allowed">Pets Allowed</option>
                            <option value="cats-only">Cats Only</option>
                            <option value="dogs-only">Dogs Only</option>
                            <option value="no-pets">No Pets</option>
                            <option value="case-by-case">Case by Case</option>
                          </select>
                        </Box>
                      </Box>
                    </Paper>
                  )}

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

                  {/* Action Buttons for LISTING tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center' }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Next Button for LISTING tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ backgroundColor: brandColors.accent.success }}
                      onClick={goToNextTab}
                      disabled={!getNextSuggestedTab()}
                    >
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

                  {/* Completion Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => markTabComplete('PHOTOS')}
                      disabled={tabCompletion.PHOTOS}
                      startIcon={tabCompletion.PHOTOS ? <CheckCircleIcon /> : undefined}
                    >
                      {tabCompletion.PHOTOS ? 'Photos Complete' : 'Mark Photos Complete'}
                    </Button>
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

                  {/* Action Buttons for PHOTOS tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center', mt: 3 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Next Button for PHOTOS tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ backgroundColor: brandColors.accent.success }}
                      onClick={goToNextTab}
                      disabled={!getNextSuggestedTab()}
                    >
                      Next
                    </Button>
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
                    
                    {/* Sample Contacts Table */}
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {/* Table Header */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 100px', 
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
                        <Typography variant="subtitle2">Actions</Typography>
                      </Box>
                      
                      {/* Sample Contact Rows */}
                      {[
                        { name: 'John Smith', type: 'Seller', email: 'john@email.com', phone: '(555) 123-4567' },
                        { name: 'Sarah Johnson', type: 'Buyer Agent', email: 'sarah@agency.com', phone: '(555) 987-6543' },
                        { name: 'Mike Wilson', type: 'Lender', email: 'mike@bank.com', phone: '(555) 456-7890' }
                      ].map((contact, index) => (
                        <Box key={index} sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr 1fr 1fr 100px', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}>
                          <Typography variant="body2">{contact.name}</Typography>
                          <Chip label={contact.type} size="small" color="primary" />
                          <Typography variant="body2">{contact.email}</Typography>
                          <Typography variant="body2">{contact.phone}</Typography>
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

                  {/* Completion Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => markTabComplete('CONTACTS')}
                      disabled={tabCompletion.CONTACTS}
                      startIcon={tabCompletion.CONTACTS ? <CheckCircleIcon /> : undefined}
                    >
                      {tabCompletion.CONTACTS ? 'Contacts Complete' : 'Mark Contacts Complete'}
                    </Button>
                  </Box>

                  {/* Action Buttons for CONTACTS tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center', mt: 3 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Next Button for CONTACTS tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ backgroundColor: brandColors.accent.success }}
                      onClick={goToNextTab}
                      disabled={!getNextSuggestedTab()}
                    >
                      Next
                    </Button>
                  </Box>
                </Paper>
              )}

              {listingTab === 'CHECKLIST' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    Listing Checklist
                  </Typography>
                  
                  {/* Checklist Categories Filter */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Filter by Category
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {['All', 'Property', 'Legal', 'Marketing', 'Financial', 'Closing'].map((category) => (
                        <Chip 
                          key={category}
                          label={category} 
                          variant={category === selectedCategory ? 'filled' : 'outlined'}
                          color={category === selectedCategory ? 'primary' : 'default'}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => setSelectedCategory(category)}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Property Preparation Checklist */}
                  <Box sx={{ mb: 4, display: (selectedCategory === 'All' || selectedCategory === 'Property') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Property Preparation
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { item: 'Property inspection completed', category: 'Property', status: 'completed' },
                        { item: 'Repairs and maintenance addressed', category: 'Property', status: 'completed' },
                        { item: 'Property photos taken and uploaded', category: 'Property', status: 'completed' },
                        { item: 'Property measurements verified', category: 'Property', status: 'completed' },
                        { item: 'Utilities and systems tested', category: 'Property', status: 'pending' },
                        { item: 'Landscaping and curb appeal assessed', category: 'Property', status: 'pending' }
                      ].map((checkItem, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <input 
                            type="checkbox" 
                            checked={checkItem.status === 'completed'}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {checkItem.item}
                          </Typography>
                          <Chip 
                            label={checkItem.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={checkItem.status} 
                            size="small" 
                            color={checkItem.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Legal & Documentation Checklist */}
                  <Box sx={{ mb: 4, display: (selectedCategory === 'All' || selectedCategory === 'Legal') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Legal & Documentation
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { item: 'Title report obtained and reviewed', category: 'Legal', status: 'completed' },
                        { item: 'Property survey completed', category: 'Legal', status: 'completed' },
                        { item: 'HOA documents and restrictions reviewed', category: 'Legal', status: 'pending' },
                        { item: 'Zoning compliance verified', category: 'Legal', status: 'pending' },
                        { item: 'Property tax information current', category: 'Legal', status: 'completed' },
                        { item: 'Easements and restrictions documented', category: 'Legal', status: 'pending' }
                      ].map((checkItem, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <input 
                            type="checkbox" 
                            checked={checkItem.status === 'completed'}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {checkItem.item}
                          </Typography>
                          <Chip 
                            label={checkItem.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={checkItem.status} 
                            size="small" 
                            color={checkItem.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Marketing & Presentation Checklist */}
                  <Box sx={{ mb: 4, display: (selectedCategory === 'All' || selectedCategory === 'Marketing') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Marketing & Presentation
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { item: 'Professional photos taken', category: 'Marketing', status: 'completed' },
                        { item: 'Virtual tour created', category: 'Marketing', status: 'pending' },
                        { item: 'Property description written', category: 'Marketing', status: 'completed' },
                        { item: 'Marketing materials designed', category: 'Marketing', status: 'pending' },
                        { item: 'Social media campaign planned', category: 'Marketing', status: 'pending' },
                        { item: 'Open house scheduled', category: 'Marketing', status: 'pending' }
                      ].map((checkItem, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <input 
                            type="checkbox" 
                            checked={checkItem.status === 'completed'}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {checkItem.item}
                          </Typography>
                          <Chip 
                            label={checkItem.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={checkItem.status} 
                            size="small" 
                            color={checkItem.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Financial & Pricing Checklist */}
                  <Box sx={{ mb: 4, display: (selectedCategory === 'All' || selectedCategory === 'Financial') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Financial & Pricing
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { item: 'Comparative market analysis completed', category: 'Financial', status: 'completed' },
                        { item: 'Listing price determined', category: 'Financial', status: 'completed' },
                        { item: 'Seller\'s net sheet prepared', category: 'Financial', status: 'pending' },
                        { item: 'Financing options researched', category: 'Financial', status: 'pending' },
                        { item: 'Closing cost estimates prepared', category: 'Financial', status: 'pending' },
                        { item: 'Property value assessment obtained', category: 'Financial', status: 'completed' }
                      ].map((checkItem, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <input 
                            type="checkbox" 
                            checked={checkItem.status === 'completed'}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {checkItem.item}
                          </Typography>
                          <Chip 
                            label={checkItem.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={checkItem.status} 
                            size="small" 
                            color={checkItem.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Closing & Transaction Checklist */}
                  <Box sx={{ mb: 4, display: (selectedCategory === 'All' || selectedCategory === 'Closing') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Closing & Transaction
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { item: 'Escrow account opened', category: 'Closing', status: 'pending' },
                        { item: 'Title company selected', category: 'Closing', status: 'pending' },
                        { item: 'Closing date scheduled', category: 'Closing', status: 'pending' },
                        { item: 'Final walkthrough planned', category: 'Closing', status: 'pending' },
                        { item: 'Transfer documents prepared', category: 'Closing', status: 'pending' },
                        { item: 'Keys and access arrangements planned', category: 'Closing', status: 'pending' }
                      ].map((checkItem, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <input 
                            type="checkbox" 
                            checked={checkItem.status === 'completed'}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {checkItem.item}
                          </Typography>
                          <Chip 
                            label={checkItem.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={checkItem.status} 
                            size="small" 
                            color={checkItem.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Listing Agreement & Addendum Section */}
                  <Box sx={{ mb: 4, display: (selectedCategory === 'All' || selectedCategory === 'Legal') ? 'block' : 'none' }}>
                                          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                        Listing Agreement & Addendum
                      </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { item: 'Listing agreement drafted', category: 'Legal', status: 'completed' },
                        { item: 'Commission structure defined', category: 'Legal', status: 'completed' },
                        { item: 'Listing period established', category: 'Legal', status: 'completed' },
                        { item: 'Seller disclosures prepared', category: 'Legal', status: 'pending' },
                        { item: 'Addendum for special conditions', category: 'Legal', status: 'pending' },
                        { item: 'Contingency clauses reviewed', category: 'Legal', status: 'pending' },
                        { item: 'Legal review completed', category: 'Legal', status: 'pending' },
                        { item: 'Seller signature obtained', category: 'Legal', status: 'pending' }
                      ].map((checkItem, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <input 
                            type="checkbox" 
                            checked={checkItem.status === 'completed'}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {checkItem.item}
                          </Typography>
                          <Chip 
                            label={checkItem.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={checkItem.status} 
                            size="small" 
                            color={checkItem.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Add New Item */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Add New Checklist Item
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 2, alignItems: 'end' }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Item Description</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter checklist item" 
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
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Category</Typography>
                        <select 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        >
                          <option value="">Select Category</option>
                          <option value="Property">Property</option>
                          <option value="Legal">Legal</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Financial">Financial</option>
                          <option value="Closing">Closing</option>
                        </select>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Priority</Typography>
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
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </Box>
                      <Button variant="outlined">Add Item</Button>
                    </Box>
                  </Box>

                  {/* Completion Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => markTabComplete('CHECKLIST')}
                      disabled={tabCompletion.CHECKLIST}
                      startIcon={tabCompletion.CHECKLIST ? <CheckCircleIcon /> : undefined}
                    >
                      {tabCompletion.CHECKLIST ? 'Checklist Complete' : 'Mark Checklist Complete'}
                    </Button>
                  </Box>

                  {/* Action Buttons for CHECKLIST tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center', mt: 3 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Next Button for CHECKLIST tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ backgroundColor: brandColors.accent.success }}
                      onClick={goToNextTab}
                      disabled={!getNextSuggestedTab()}
                    >
                      Next
                    </Button>
                  </Box>
                </Paper>
              )}

              {listingTab === 'DOCUMENTS' && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
                    {propertyPurpose === 'sale' ? 'Documents' : 'Rental Documents'}
                  </Typography>
                  
                  {/* Filter by Document Category */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Filter by Document Category
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(propertyPurpose === 'sale' ? 
                        ['All', 'Contracts', 'Addendums', 'Disclosures', 'Financial', 'Legal', 'Property', 'Marketing', 'Other'] :
                        ['All', 'Rental Agreements', 'Lease Documents', 'Tenant Forms', 'Financial', 'Legal', 'Property', 'Marketing', 'Other']
                      ).map((category) => (
                        <Chip 
                          key={category}
                          label={category} 
                          onClick={() => setSelectedDocCategory(category)}
                          variant={selectedDocCategory === category ? 'filled' : 'outlined'}
                          color={selectedDocCategory === category ? 'primary' : 'default'}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                      {[
                        { name: 'Contracts', count: propertyPurpose === 'sale' ? 4 : 4, color: 'primary' },
                        { name: 'Disclosures', count: propertyPurpose === 'sale' ? 4 : 4, color: 'secondary' },
                        { name: 'Financial Documents', count: propertyPurpose === 'sale' ? 4 : 4, color: 'success' },
                        { name: 'Property Documents', count: propertyPurpose === 'sale' ? 5 : 5, color: 'info' },
                        { name: 'Legal Documents', count: propertyPurpose === 'sale' ? 5 : 5, color: 'warning' },
                        { name: 'Marketing Materials', count: propertyPurpose === 'sale' ? 5 : 5, color: 'error' },
                        { name: 'Addendums', count: propertyPurpose === 'sale' ? 5 : 5, color: 'default' },
                        { name: 'Other Documents', count: propertyPurpose === 'sale' ? 5 : 5, color: 'primary' }
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

                  {/* Document Workflow Actions */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Document Workflow Actions
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                      gap: 2 
                    }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<AssignmentIcon />}
                        size="small"
                        sx={{ py: 1.5 }}
                      >
                        Assign
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<CancelIcon />}
                        size="small"
                        sx={{ py: 1.5 }}
                      >
                        Unassign
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<DescriptionIcon />}
                        size="small"
                        sx={{ py: 1.5 }}
                      >
                        Fax Cover
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<ShareIcon />}
                        size="small"
                        sx={{ py: 1.5 }}
                      >
                        Share Docs
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{ py: 1.5 }}
                      >
                        DigiSign
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<VisibilityIcon />}
                        size="small"
                        sx={{ py: 1.5 }}
                      >
                        Email
                      </Button>
                    </Box>
                  </Box>

                  {/* Enhanced Document Categories and Lists */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Document Management
                    </Typography>
                    
                    {/* Contracts Section */}
                    <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Contracts' || selectedDocCategory === 'Rental Agreements') ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                        {propertyPurpose === 'sale' ? 'Contracts' : 'Rental Agreements'}
                      </Typography>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                        {(propertyPurpose === 'sale' ? [
                          { name: 'Purchase Agreement', status: 'Required', date: '', size: '', type: 'PDF', category: 'Contracts' },
                          { name: 'Listing Agreement', status: 'Required', date: '2024-01-15', size: '2.1 MB', type: 'PDF', category: 'Contracts' },
                          { name: 'Counter Offer', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Contracts' },
                          { name: 'Backup Offer', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Contracts' }
                        ] : [
                          { name: 'Rental Agreement', status: 'Required', date: '2024-01-15', size: '1.8 MB', type: 'PDF', category: 'Rental Agreements' },
                          { name: 'Lease Addendum', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Rental Agreements' },
                          { name: 'Pet Agreement', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Rental Agreements' },
                          { name: 'Sublease Agreement', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Rental Agreements' }
                        ]).map((doc, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                            <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                            <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : 'default'} variant="outlined" />
                            <Chip label={doc.category} size="small" color="primary" variant="outlined" />
                            {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                            {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small"><VisibilityIcon /></IconButton>
                              <IconButton size="small"><DownloadIcon /></IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Disclosures Section */}
                    <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Disclosures' || selectedDocCategory === 'Tenant Forms') ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                        {propertyPurpose === 'sale' ? 'Disclosures' : 'Tenant Forms'}
                      </Typography>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                        {(propertyPurpose === 'sale' ? [
                          { name: 'Seller Property Disclosure', status: 'Required', date: '2024-01-14', size: '1.2 MB', type: 'PDF', category: 'Disclosures' },
                          { name: 'Lead Paint Disclosure', status: 'Required', date: '', size: '', type: 'PDF', category: 'Disclosures' },
                          { name: 'Natural Hazard Disclosure', status: 'Required', date: '', size: '', type: 'PDF', category: 'Disclosures' },
                          { name: 'HOA Disclosure', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Disclosures' }
                        ] : [
                          { name: 'Rental Application', status: 'Required', date: '2024-01-14', size: '0.8 MB', type: 'PDF', category: 'Tenant Forms' },
                          { name: 'Credit Check Authorization', status: 'Required', date: '', size: '', type: 'PDF', category: 'Tenant Forms' },
                          { name: 'Employment Verification', status: 'Required', date: '', size: '', type: 'PDF', category: 'Tenant Forms' },
                          { name: 'References Form', status: 'Required', date: '', size: '', type: 'PDF', category: 'Tenant Forms' }
                        ]).map((doc, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                            <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                            <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : doc.status === 'Conditional' ? 'warning' : 'default'} variant="outlined" />
                            <Chip label={doc.category} size="small" color="secondary" variant="outlined" />
                            {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                            {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small"><VisibilityIcon /></IconButton>
                              <IconButton size="small"><DownloadIcon /></IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Financial Documents Section */}
                    <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Financial') ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                        Financial Documents
                      </Typography>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                        {(propertyPurpose === 'sale' ? [
                          { name: 'Pre-approval Letter', status: 'Required', date: '2024-01-13', size: '0.5 MB', type: 'PDF', category: 'Financial' },
                          { name: 'Proof of Funds', status: 'Required', date: '', size: '', type: 'PDF', category: 'Financial' },
                          { name: 'Loan Estimate', status: 'Pending', date: '', size: '', type: 'PDF', category: 'Financial' },
                          { name: 'Closing Disclosure', status: 'Pending', date: '', size: '', type: 'PDF', category: 'Financial' }
                        ] : [
                          { name: 'Income Verification', status: 'Required', date: '2024-01-13', size: '0.7 MB', type: 'PDF', category: 'Financial' },
                          { name: 'Bank Statements', status: 'Required', date: '', size: '', type: 'PDF', category: 'Financial' },
                          { name: 'Pay Stubs', status: 'Required', date: '', size: '', type: 'PDF', category: 'Financial' },
                          { name: 'Tax Returns', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Financial' }
                        ]).map((doc, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                            <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                            <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : doc.status === 'Pending' ? 'warning' : 'default'} variant="outlined" />
                            <Chip label={doc.category} size="small" color="success" variant="outlined" />
                            {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                            {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small"><VisibilityIcon /></IconButton>
                              <IconButton size="small"><DownloadIcon /></IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Property Documents Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Property') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Property Documents
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {(propertyPurpose === 'sale' ? [
                        { name: 'Property Photos', status: 'Required', date: '2024-01-12', size: '15.2 MB', type: 'JPG', category: 'Property' },
                        { name: 'Inspection Report', status: 'Required', date: '2024-01-11', size: '2.8 MB', type: 'PDF', category: 'Property' },
                        { name: 'Appraisal Report', status: 'Required', date: '2024-01-10', size: '1.5 MB', type: 'PDF', category: 'Property' },
                        { name: 'Property Survey', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Property' },
                        { name: 'HOA Documents', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Property' }
                      ] : [
                        { name: 'Property Photos', status: 'Required', date: '2024-01-12', size: '12.8 MB', type: 'JPG', category: 'Property' },
                        { name: 'Property Condition Report', status: 'Required', date: '2024-01-11', size: '1.2 MB', type: 'PDF', category: 'Property' },
                        { name: 'Rental Property Inspection', status: 'Required', date: '2024-01-10', size: '0.9 MB', type: 'PDF', category: 'Property' },
                        { name: 'Property Maintenance Records', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Property' },
                        { name: 'Utility Setup Instructions', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Property' }
                      ]).map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : doc.status === 'Conditional' ? 'warning' : 'default'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="info" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Legal Documents Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Legal') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Legal Documents
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {(propertyPurpose === 'sale' ? [
                        { name: 'Title Report', status: 'Required', date: '2024-01-09', size: '3.2 MB', type: 'PDF', category: 'Legal' },
                        { name: 'Insurance Certificate', status: 'Required', date: '2024-01-08', size: '0.8 MB', type: 'PDF', category: 'Legal' },
                        { name: 'Legal Opinion Letter', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Legal' },
                        { name: 'Compliance Certificate', status: 'Required', date: '2024-01-07', size: '1.1 MB', type: 'PDF', category: 'Legal' },
                        { name: 'Zoning Verification', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Legal' }
                      ] : [
                        { name: 'Landlord Insurance Certificate', status: 'Required', date: '2024-01-09', size: '0.9 MB', type: 'PDF', category: 'Legal' },
                        { name: 'Property Tax Records', status: 'Required', date: '2024-01-08', size: '1.2 MB', type: 'PDF', category: 'Legal' },
                        { name: 'Rental License', status: 'Required', date: '2024-01-07', size: '0.6 MB', type: 'PDF', category: 'Legal' },
                        { name: 'Building Code Compliance', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Legal' },
                        { name: 'Tenant Rights Notice', status: 'Required', date: '2024-01-06', size: '0.4 MB', type: 'PDF', category: 'Legal' }
                      ]).map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : doc.status === 'Conditional' ? 'warning' : 'default'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="secondary" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Marketing Materials Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Marketing') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Marketing Materials
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {(propertyPurpose === 'sale' ? [
                        { name: 'Property Brochure', status: 'Required', date: '2024-01-12', size: '8.5 MB', type: 'PDF', category: 'Marketing' },
                        { name: 'Virtual Tour Video', status: 'Optional', date: '2024-01-11', size: '45.2 MB', type: 'MP4', category: 'Marketing' },
                        { name: 'Professional Photos', status: 'Required', date: '2024-01-10', size: '22.1 MB', type: 'JPG', category: 'Marketing' },
                        { name: 'Marketing Flyer', status: 'Optional', date: '2024-01-09', size: '3.8 MB', type: 'PDF', category: 'Marketing' },
                        { name: 'Property Description', status: 'Required', date: '2024-01-08', size: '0.3 MB', type: 'DOCX', category: 'Marketing' }
                      ] : [
                        { name: 'Rental Listing Photos', status: 'Required', date: '2024-01-12', size: '18.7 MB', type: 'JPG', category: 'Marketing' },
                        { name: 'Virtual Tour', status: 'Optional', date: '2024-01-11', size: '38.9 MB', type: 'MP4', category: 'Marketing' },
                        { name: 'Rental Description', status: 'Required', date: '2024-01-10', size: '0.4 MB', type: 'DOCX', category: 'Marketing' },
                        { name: 'Amenities List', status: 'Required', date: '2024-01-09', size: '0.2 MB', type: 'DOCX', category: 'Marketing' },
                        { name: 'Neighborhood Guide', status: 'Optional', date: '2024-01-08', size: '1.1 MB', type: 'PDF', category: 'Marketing' }
                      ]).map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : 'default'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="info" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Lease Documents Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Lease Documents') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Lease Documents
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {[
                        { name: 'Standard Lease Agreement', status: 'Required', date: '2024-01-12', size: '2.1 MB', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Lease Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Security Deposit Receipt', status: 'Required', date: '2024-01-11', size: '0.8 MB', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Move-in Checklist', status: 'Required', date: '2024-01-10', size: '0.5 MB', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Rent Payment Schedule', status: 'Required', date: '2024-01-09', size: '0.3 MB', type: 'DOCX', category: 'Lease Documents' }
                      ].map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : 'warning'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="secondary" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Addendums Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Addendums') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Addendums
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {(propertyPurpose === 'sale' ? [
                        { name: 'Financing Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Inspection Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Appraisal Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'HOA Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Repair Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' }
                      ] : [
                        { name: 'Pet Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Parking Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Furniture Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Utilities Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' },
                        { name: 'Maintenance Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Addendums' }
                      ]).map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Conditional' ? 'warning' : 'default'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="warning" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Tenant Forms Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Tenant Forms') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Tenant Forms
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {[
                        { name: 'Rental Application Form', status: 'Required', date: '2024-01-12', size: '1.2 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'Credit Check Authorization', status: 'Required', date: '2024-01-11', size: '0.8 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'Employment Verification', status: 'Required', date: '2024-01-10', size: '0.6 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'References Form', status: 'Required', date: '2024-01-09', size: '0.4 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'Income Verification', status: 'Required', date: '2024-01-08', size: '0.7 MB', type: 'PDF', category: 'Tenant Forms' }
                      ].map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Required' ? 'error' : 'default'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="info" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Other Documents Section */}
                  <Box sx={{ mb: 4, display: (selectedDocCategory === 'All' || selectedDocCategory === 'Other') ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                      Other Documents
                    </Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      {(propertyPurpose === 'sale' ? [
                        { name: 'Third Party Reports', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Other' },
                        { name: 'Custom Forms', status: 'Optional', date: '', size: '', type: 'DOCX', category: 'Other' },
                        { name: 'Miscellaneous Documents', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Other' },
                        { name: 'Agent Notes', status: 'Optional', date: '2024-01-05', size: '0.2 MB', type: 'DOCX', category: 'Other' },
                        { name: 'Client Communications', status: 'Optional', date: '2024-01-04', size: '0.1 MB', type: 'PDF', category: 'Other' }
                      ] : [
                        { name: 'Tenant Screening Reports', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Other' },
                        { name: 'Custom Rental Forms', status: 'Optional', date: '', size: '', type: 'DOCX', category: 'Other' },
                        { name: 'Property Management Docs', status: 'Optional', date: '', size: '', type: 'PDF', category: 'Other' },
                        { name: 'Agent Notes', status: 'Optional', date: '2024-01-05', size: '0.2 MB', type: 'DOCX', category: 'Other' },
                        { name: 'Landlord Communications', status: 'Optional', date: '2024-01-04', size: '0.1 MB', type: 'PDF', category: 'Other' }
                      ]).map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child': { borderBottom: 'none' } }}>
                          <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{doc.name}</Typography>
                          <Chip label={doc.status} size="small" color={doc.status === 'Optional' ? 'default' : 'primary'} variant="outlined" />
                          <Chip label={doc.category} size="small" color="default" variant="outlined" />
                          {doc.date && <Typography variant="caption" color="text.secondary">{doc.date}</Typography>}
                          {doc.size && <Typography variant="caption" color="text.secondary">{doc.size}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small"><VisibilityIcon /></IconButton>
                            <IconButton size="small"><DownloadIcon /></IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Completion Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => markTabComplete('DOCUMENTS')}
                      disabled={tabCompletion.DOCUMENTS}
                      startIcon={tabCompletion.DOCUMENTS ? <CheckCircleIcon /> : undefined}
                    >
                      {tabCompletion.DOCUMENTS ? 'Documents Complete' : 'Mark Documents Complete'}
                    </Button>
                  </Box>

                  {/* Action Buttons for DOCUMENTS tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center', mt: 3 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Next Button for DOCUMENTS tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ backgroundColor: brandColors.accent.success }}
                      onClick={goToNextTab}
                      disabled={!getNextSuggestedTab()}
                    >
                      Next
                    </Button>
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
                      Activity Timeline
                    </Typography>
                    
                    {/* Sample Activities */}
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      {[
                        { 
                          activity: 'Property photos uploaded', 
                          user: 'Sarah Johnson', 
                          time: '2 hours ago', 
                          type: 'upload' 
                        },
                        { 
                          activity: 'Title report reviewed', 
                          user: 'Mike Wilson', 
                          time: '4 hours ago', 
                          type: 'review' 
                        },
                        { 
                          activity: 'Inspection scheduled', 
                          user: 'John Smith', 
                          time: '1 day ago', 
                          type: 'schedule' 
                        },
                        { 
                          activity: 'Listing created', 
                          user: 'Sarah Johnson', 
                          time: '2 days ago', 
                          type: 'create' 
                        }
                      ].map((activity, index) => (
                        <Box key={index} sx={{ 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child': { borderBottom: 'none' }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 
                                activity.type === 'upload' ? brandColors.accent.success :
                                activity.type === 'review' ? brandColors.accent.warning :
                                activity.type === 'schedule' ? brandColors.primary :
                                brandColors.accent.info
                            }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {activity.activity}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                by {activity.user} • {activity.time}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Completion Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => markTabComplete('LOG')}
                      disabled={tabCompletion.LOG}
                      startIcon={tabCompletion.LOG ? <CheckCircleIcon /> : undefined}
                    >
                      {tabCompletion.LOG ? 'Log Complete' : 'Mark Log Complete'}
                    </Button>
                  </Box>

                  {/* Action Buttons for LOG tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center', mt: 3 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Next Button for LOG tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ backgroundColor: brandColors.accent.success }}
                      onClick={goToNextTab}
                      disabled={!getNextSuggestedTab()}
                    >
                      Next
                    </Button>
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

                  {/* Completion Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => markTabComplete('TASKS')}
                      disabled={tabCompletion.TASKS}
                      startIcon={tabCompletion.TASKS ? <CheckCircleIcon /> : undefined}
                    >
                      {tabCompletion.TASKS ? 'Tasks Complete' : 'Mark Tasks Complete'}
                    </Button>
                  </Box>

                  {/* Action Buttons for TASKS tab */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 4, alignItems: 'center', mt: 3 }}>
                    <Button variant="outlined" size="large">
                      Save Draft
                    </Button>
                    
                    {/* Submit Button for TASKS tab */}
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ 
                        backgroundColor: brandColors.primary,
                        '&:hover': { backgroundColor: brandColors.primary }
                      }}
                    >
                      Submit Listing
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Global Submit Button - Appears when all tabs are complete */}
            {allTabsComplete && (
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2, 
                border: '2px solid', 
                borderColor: brandColors.accent.success,
                textAlign: 'center'
              }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  🎉 All Tabs Complete!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You've completed all sections. Ready to submit your listing?
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    backgroundColor: brandColors.primary,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': { backgroundColor: brandColors.primary }
                  }}
                >
                  Submit Final Listing
                </Button>
              </Box>
            )}
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
                Review and approve pending documents for your transactions and listings
              </Typography>
            </Paper>

            {/* Documents to Review Content */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Review Statistics Dashboard */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', 
                  sm: 'repeat(3, 1fr)', 
                  md: 'repeat(4, 1fr)', 
                  lg: 'repeat(6, 1fr)' 
                }, 
                gap: { xs: 2, md: 3 }, 
                mb: 4 
              }}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                  <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 700 }}>18</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Pending Review</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h4" sx={{ color: '#388e3c', fontWeight: 700 }}>12</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Approved Today</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                  <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>6</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Rejected Today</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fce4ec' }}>
                  <Typography variant="h4" sx={{ color: '#c2185b', fontWeight: 700 }}>4</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Overdue Reviews</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                  <Typography variant="h4" sx={{ color: '#7b1fa2', fontWeight: 700 }}>8</Typography>
                  <Typography variant="subtitle1" color="text.secondary">High Priority</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e0f2f1' }}>
                  <Typography variant="h4" sx={{ color: '#00695c', fontWeight: 700 }}>24</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Total This Week</Typography>
                </Paper>
              </Box>

              {/* Main Review Interface */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 3, 
                mt: 3 
              }}>
                {/* Document Viewer - Full Width */}
                <Box sx={{ width: '100%' }}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    {/* Document Viewer Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' }, 
                      justifyContent: 'space-between', 
                      mb: 3,
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      gap: { xs: 2, sm: 0 }
                    }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          residential_purchase_agreement.pdf
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Purchase Contract • 2.3 MB • PDF • Added 2 hours ago • High Priority
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1 
                      }}>
                        <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                          Download
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<ShareIcon />}>
                          Share
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<PrintIcon />}>
                          Print
                        </Button>
                      </Box>
                    </Box>

                    {/* Document Content Preview */}
                    <Box sx={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: { xs: 2, md: 4 },
                      height: '600px',
                      overflow: 'auto'
                    }}>
                      {/* Document Header */}
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 700, 
                          color: '#1a365d',
                          mb: 2
                        }}>
                          CALIFORNIA ASSOCIATION OF REALTORS®
                        </Typography>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600, 
                          color: '#2d3748',
                          lineHeight: 1.3
                        }}>
                          CALIFORNIA RESIDENTIAL PURCHASE AGREEMENT<br/>
                          AND JOINT ESCROW INSTRUCTIONS
                        </Typography>
                      </Box>

                      {/* Document Sections */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                          1. OFFER:
                        </Typography>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            A. THIS IS AN OFFER FROM: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            B. THE REAL PROPERTY TO BE ACQUIRED: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            C. THE PURCHASE PRICE: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            D. CLOSE OF ESCROW: _________________________
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                          2. AGENCY:
                        </Typography>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            A. DISCLOSURE: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            B. POTENTIALLY COMPETING BUYERS AND SELLERS: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            C. CONFIRMATION: _________________________
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                          3. FINANCE TERMS:
                        </Typography>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            A. INITIAL DEPOSIT: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            B. INCREASED DEPOSIT: _________________________
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            C. LOAN(S): _________________________
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* Side Panels - Below Document Viewer */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 3
                }}>
                  {/* Left Panel - Document Categories & Lists */}
                  <Box>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      {/* Document Categories */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                          Document Categories
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {[
                            { name: 'Purchase Contracts', count: 6, status: 'pending', color: '#ff9800', priority: 'high' },
                            { name: 'Listing Agreements', count: 4, status: 'pending', color: '#2196f3', priority: 'medium' },
                            { name: 'Addendums', count: 3, status: 'pending', color: '#9c27b0', priority: 'medium' },
                            { name: 'Disclosures', count: 2, status: 'pending', color: '#f44336', priority: 'high' },
                            { name: 'Financial Documents', count: 2, status: 'pending', color: '#4caf50', priority: 'low' },
                            { name: 'Legal Documents', count: 1, status: 'pending', color: '#795548', priority: 'high' }
                          ].map((category, index) => (
                            <Box 
                              key={index}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                p: 2,
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#e3f2fd' }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  backgroundColor: category.color, 
                                  borderRadius: '50%' 
                                }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                  {category.name}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={category.count} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={category.priority} 
                                  size="small" 
                                  color={category.priority === 'high' ? 'error' : category.priority === 'medium' ? 'warning' : 'default'} 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* Recent Documents */}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                          Recent Documents
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {[
                            { name: 'residential_purchase_agreement.pdf', status: 'Pending Review', date: '2 hours ago', priority: 'High', category: 'Purchase Contracts' },
                            { name: 'listing_agreement_addendum.pdf', status: 'Pending Review', date: '4 hours ago', priority: 'Medium', category: 'Listing Agreements' },
                            { name: 'seller_disclosure_form.pdf', status: 'Pending Review', date: '6 hours ago', priority: 'High', category: 'Disclosures' },
                            { name: 'financing_addendum.pdf', status: 'Pending Review', date: '1 day ago', priority: 'Medium', category: 'Addendums' },
                            { name: 'title_report.pdf', status: 'Pending Review', date: '1 day ago', priority: 'Low', category: 'Legal Documents' }
                          ].map((doc, index) => (
                            <Box 
                              key={index}
                              sx={{ 
                                p: 2,
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                border: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#e3f2fd' }
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                {doc.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip 
                                  label={doc.status} 
                                  size="small" 
                                  color="warning" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={doc.priority} 
                                  size="small" 
                                  color={doc.priority === 'High' ? 'error' : doc.priority === 'Medium' ? 'warning' : 'default'} 
                                  variant="outlined"
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {doc.category}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {doc.date}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Right Panel - Review Actions & Details */}
                  <Box>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      {/* Review Actions */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                          Review Actions
                        </Typography>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                          gap: 2 
                        }}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            size="large"
                            sx={{ 
                              backgroundColor: '#4caf50', 
                              color: 'white',
                              py: 1.5,
                              '&:hover': { backgroundColor: '#45a049' }
                            }}
                            startIcon={<CheckCircleIcon />}
                          >
                            Approve Document
                          </Button>
                          <Button 
                            variant="contained" 
                            fullWidth
                            size="large"
                            sx={{ 
                              backgroundColor: '#f44336', 
                              color: 'white',
                              py: 1.5,
                              '&:hover': { backgroundColor: '#d32f2f' }
                            }}
                            startIcon={<CancelIcon />}
                          >
                            Reject Document
                          </Button>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            size="large"
                            startIcon={<EditIcon />}
                          >
                            Request Changes
                          </Button>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            size="large"
                            startIcon={<CommentIcon />}
                          >
                            Add Comments
                          </Button>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            size="large"
                            startIcon={<AssignmentIcon />}
                          >
                            Assign to Agent
                          </Button>
                        </Box>
                      </Box>

                      {/* Document Details */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                          Document Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">STATUS</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#ff9800' }}>
                              Pending Review
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">PRIORITY</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#f44336' }}>
                              High
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">ASSIGNED TO</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Michael Johnson
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">DUE DATE</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Today, 5:00 PM
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">TRANSACTION</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              1011 Riverside Ave
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">DOCUMENT TYPE</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Purchase Contract
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">UPLOADED BY</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Sarah Smith
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Review History */}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                          Review History
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {[
                            { action: 'Document Uploaded', user: 'Sarah Smith', time: '2 hours ago', status: 'Completed' },
                            { action: 'Assigned for Review', user: 'System', time: '2 hours ago', status: 'Completed' },
                            { action: 'Review Started', user: 'Michael Johnson', time: '1 hour ago', status: 'In Progress' }
                          ].map((item, index) => (
                            <Box key={index} sx={{ 
                              p: 2, 
                              backgroundColor: '#f8f9fa', 
                              borderRadius: '6px',
                              border: '1px solid #e0e0e0'
                            }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                {item.action}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  by {item.user} • {item.time}
                                </Typography>
                                <Chip 
                                  label={item.status} 
                                  size="small" 
                                  color={item.status === 'Completed' ? 'success' : 'warning'} 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </Box>

              {/* Quick Actions Bar */}
              <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' }, 
                  justifyContent: 'space-between',
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' }, 
                    gap: 2 
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Quick Actions:
                    </Typography>
                    <Button size="small" variant="outlined" startIcon={<FilterListIcon />}>
                      Filter Documents
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<SortIcon />}>
                      Sort by Priority
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<ScheduleIcon />}>
                      Set Reminders
                    </Button>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' }, 
                    gap: 2 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Last updated: 2 minutes ago
                    </Typography>
                    <Button size="small" variant="contained" startIcon={<RefreshIcon />}>
                      Refresh
                    </Button>
                  </Box>
                </Box>
              </Paper>
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
                  Templates
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage document templates and form collections
              </Typography>
            </Paper>

            {/* Templates Content */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Template Management Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    My Templates
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      12 TEMPLATES
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<CreateIcon />}
                  sx={{ 
                    backgroundColor: brandColors.primary,
                    '&:hover': { backgroundColor: brandColors.primary, opacity: 0.9 }
                  }}
                >
                  + Create Template
                </Button>
              </Box>

              {/* Template Grid - 3x1 Layout */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 4
              }}>
                {/* Template Cards */}
                {[
                  {
                    name: 'Starter Agent Template',
                    formsCount: 108,
                    category: 'Starter Agent',
                    description: 'Complete template for new agents with all essential forms',
                    lastUpdated: '2 days ago',
                    status: 'active'
                  },
                  {
                    name: 'MPE Form Template',
                    formsCount: 1,
                    category: 'MPE Forms',
                    description: 'Master Purchase Agreement template',
                    lastUpdated: '1 week ago',
                    status: 'active'
                  },
                  {
                    name: 'Special Cases Only',
                    formsCount: 1,
                    category: 'Special Cases',
                    description: 'Template for unique transaction scenarios',
                    lastUpdated: '3 days ago',
                    status: 'active'
                  },
                  {
                    name: 'Condo Form Template',
                    formsCount: 1,
                    category: 'Condo',
                    description: 'Specialized forms for condominium transactions',
                    lastUpdated: '1 week ago',
                    status: 'active'
                  },
                  {
                    name: 'Arizona Agents',
                    formsCount: 2,
                    category: 'State-Specific',
                    description: 'Arizona-specific forms and disclosures',
                    lastUpdated: '5 days ago',
                    status: 'active'
                  },
                  {
                    name: 'California Agents',
                    formsCount: 2,
                    category: 'State-Specific',
                    description: 'California-specific forms and disclosures',
                    lastUpdated: '4 days ago',
                    status: 'active'
                  },
                  {
                    name: 'Brokerage Wide Template',
                    formsCount: 2,
                    category: 'Brokerage',
                    description: 'Standard forms for entire brokerage',
                    lastUpdated: '1 week ago',
                    status: 'active'
                  },
                  {
                    name: 'Burbank Client Template',
                    formsCount: 1,
                    category: 'Client-Specific',
                    description: 'Custom template for Burbank clients',
                    lastUpdated: '2 weeks ago',
                    status: 'active'
                  },
                  {
                    name: 'Essential Forms v1',
                    formsCount: 3,
                    category: 'Essential',
                    description: 'Core forms every agent needs',
                    lastUpdated: '1 week ago',
                    status: 'active'
                  },
                  {
                    name: 'Luxury Property Template',
                    formsCount: 5,
                    category: 'Luxury',
                    description: 'Specialized forms for high-value properties',
                    lastUpdated: '3 days ago',
                    status: 'active'
                  },
                  {
                    name: 'Investment Property Template',
                    formsCount: 4,
                    category: 'Investment',
                    description: 'Forms for investment property transactions',
                    lastUpdated: '1 week ago',
                    status: 'active'
                  },
                  {
                    name: 'New Construction Template',
                    formsCount: 6,
                    category: 'New Construction',
                    description: 'Forms for new construction projects',
                    lastUpdated: '5 days ago',
                    status: 'active'
                  }
                ].map((template, index) => (
                  <Paper 
                    key={index}
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    {/* Template Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                          {template.name}
                        </Typography>
                        <Chip 
                          label={template.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      {/* Quick Actions Menu */}
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Template Info */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {template.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {template.formsCount} Forms
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {template.lastUpdated}
                      </Typography>
                    </Box>

                    {/* Template Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<EditIcon />}
                        sx={{ flex: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<AssignmentIcon />}
                        sx={{ flex: 1 }}
                      >
                        Use
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Template Categories Summary */}
              <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                  Template Categories
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
                  gap: 2 
                }}>
                  {[
                    { name: 'Starter Agent', count: 1, color: '#4caf50' },
                    { name: 'State-Specific', count: 2, color: '#2196f3' },
                    { name: 'MPE Forms', count: 1, color: '#ff9800' },
                    { name: 'Special Cases', count: 1, color: '#9c27b0' },
                    { name: 'Condo', count: 1, color: '#f44336' },
                    { name: 'Brokerage', count: 1, color: '#795548' },
                    { name: 'Client-Specific', count: 1, color: '#607d8b' },
                    { name: 'Essential', count: 1, color: '#00bcd4' },
                    { name: 'Luxury', count: 1, color: '#e91e63' },
                    { name: 'Investment', count: 1, color: '#8bc34a' },
                    { name: 'New Construction', count: 1, color: '#ff5722' }
                  ].map((category, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          backgroundColor: category.color, 
                          borderRadius: '50%' 
                        }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {category.name}
                        </Typography>
                      </Box>
                      <Chip 
                        label={category.count} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
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
