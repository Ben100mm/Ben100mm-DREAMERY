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
  Grid,
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
  TextField,
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
  Add as AddIcon,
  Remove as RemoveIcon,
  CompareArrows as CompareArrowsIcon,
  Flag as FlagIcon,
  Bookmark as BookmarkIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  NoteAdd as NoteAddIcon,
  Link as LinkIcon,
  Info as InfoIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
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

  // Finance Tab State
  const [financeTab, setFinanceTab] = useState('dashboard');

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
    { value: 'review-offers', label: 'Review Offers', icon: <CompareArrowsIcon /> },
    { value: 'payments-finance', label: 'Payments & Finance', icon: <AccountBalanceIcon /> },
    
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
                  
                  {/* Tab Navigation */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {[
                          { value: 'overview', label: 'OVERVIEW', icon: <DashboardIcon /> },
                          { value: 'offers', label: 'OFFERS', icon: <ListAltIcon /> },
                          { value: 'comparison', label: 'COMPARISON', icon: <CompareArrowsIcon /> }
                        ].map((tab) => (
                          <Button
                            key={tab.value}
                            onClick={() => setReviewOffersTab(tab.value)}
                            variant={reviewOffersTab === tab.value ? 'contained' : 'text'}
                            startIcon={tab.icon}
                            sx={{
                              borderRadius: 0,
                              borderBottom: reviewOffersTab === tab.value ? 2 : 0,
                              borderColor: brandColors.primary,
                              backgroundColor: reviewOffersTab === tab.value ? brandColors.primary : 'transparent',
                              color: reviewOffersTab === tab.value ? 'white' : 'text.primary',
                              '&:hover': {
                                backgroundColor: reviewOffersTab === tab.value ? brandColors.secondary : 'rgba(0,0,0,0.04)'
                              }
                            }}
                          >
                            {tab.label}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Tab Content */}
                  {reviewOffersTab === 'overview' && (
                    <>
                      {/* Property Context Header & Workflow Stages */}
                      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                        {/* Your existing property context content */}
                      </Paper>
                    </>
                  )}

                  {reviewOffersTab === 'offers' && (
                    <>
                      {/* Active Offers Management */}
                      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                        {/* Your offers management content */}
                      </Paper>
                    </>
                  )}

                  {reviewOffersTab === 'comparison' && (
                    <>
                      {/* Offer Comparison Matrix */}
                      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                        {/* Your comparison content */}
                      </Paper>
                    </>
                  )}

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
        {state.activeTab === 'review-offers' && (
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
                <CompareArrowsIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  Review Offers
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Compare and evaluate multiple offers on your listings
              </Typography>
            </Paper>

            {/* Professional Offer Comparison Interface */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Enhanced Property Context Header with Workflow Stages */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' }, 
                  justifyContent: 'space-between',
                  gap: 2
                }}>
                  {/* Navigation Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button variant="outlined" size="small" sx={{ minWidth: 'auto', p: 1 }}>
                      <ArrowBackIcon />
                    </Button>
                    <Button variant="outlined" size="small" sx={{ minWidth: 'auto', p: 1 }}>
                      <ArrowBackIcon sx={{ transform: 'scaleX(-1)' }} />
                    </Button>
                  </Box>

                  {/* Property Address */}
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      1235 H Street, Sacramento, CA 95824
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      MLS #9876543 • Sale Price: $450,000
                    </Typography>
                  </Box>

                  {/* Workflow Stage Management */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Current Stage</Typography>
                      <Chip 
                        label="Offer Review" 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ 
                          borderRadius: '4px 0 0 4px', 
                          backgroundColor: brandColors.primary,
                          '&:hover': { backgroundColor: brandColors.primary }
                        }}
                      >
                        Grid View
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ 
                          borderRadius: '0 4px 4px 0',
                          borderLeft: 'none'
                        }}
                      >
                        List View
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Workflow Progress Bar */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Transaction Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {['Listed', 'Offers Received', 'Under Review', 'Negotiating', 'Accepted', 'Closed'].map((stage, index) => (
                      <Box key={stage} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: index <= 2 ? brandColors.primary : '#e0e0e0',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {index < 2 ? '✓' : index === 2 ? '3' : index + 1}
                        </Box>
                        <Typography variant="caption" sx={{ 
                          ml: 0.5, 
                          color: index <= 2 ? brandColors.primary : 'text.secondary',
                          fontWeight: index === 2 ? 600 : 400
                        }}>
                          {stage}
                        </Typography>
                        {index < 5 && (
                          <Box sx={{
                            width: 20,
                            height: 2,
                            backgroundColor: index < 2 ? brandColors.primary : '#e0e0e0',
                            ml: 0.5
                          }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>

              {/* Enhanced Main Control Bar with Advanced Features */}
              <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'white' }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' }, 
                  justifyContent: 'space-between',
                  gap: 2
                }}>
                  {/* View Options & Status Filters */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<ListAltIcon />}
                      sx={{ 
                        backgroundColor: brandColors.primary,
                        '&:hover': { backgroundColor: brandColors.primary }
                      }}
                    >
                      View as List
                    </Button>
                    
                    {/* Status Filter Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value="all"
                        label="Status"
                        sx={{ height: 40 }}
                      >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="review">Under Review</MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="countered">Countered</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Priority Filter */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value="all"
                        label="Priority"
                        sx={{ height: 40 }}
                      >
                        <MenuItem value="all">All Priorities</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Enhanced Action Buttons */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Add New Offer">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Create Counter-Offer">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Offers">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Link">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <LinkIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Export Report">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Enhanced Filter and Search */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Advanced Filters">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        size="small"
                        placeholder="Search offers, buyers, agents..."
                        InputProps={{
                          startAdornment: (
                            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                          ),
                        }}
                        sx={{ minWidth: 250 }}
                      />
                    </Box>
                  </Box>

                  {/* Navigation & Notifications */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Notifications">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <NotificationsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Options">
                      <IconButton size="small" sx={{ color: brandColors.primary }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" sx={{ color: brandColors.primary }}>
                      <ArrowBackIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: brandColors.primary }}>
                      <ArrowBackIcon sx={{ transform: 'scaleX(-1)' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              {/* Financial Analysis Dashboard */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Financial Analysis Dashboard
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                  {/* Net Proceeds Analysis */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Total Net Proceeds</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.primary }}>
                      $1,494,000
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Across all 4 offers
                    </Typography>
                  </Box>
                  
                  {/* Commission Analysis */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Total Commission</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      $95,400
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average: $23,850 per offer
                    </Typography>
                  </Box>
                  
                  {/* Market Analysis */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Market Position</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      Above Market
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +5.2% vs. comparable sales
                    </Typography>
                  </Box>
                  
                  {/* Risk Assessment */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Overall Risk</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      Low Risk
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Strong buyer pool
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Automation & Integration Hub */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Automation & Integration Hub
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                  {/* MLS Integration */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      MLS Integration
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip label="Property Data ✓" color="success" size="small" />
                      <Chip label="Market Updates ✓" color="success" size="small" />
                      <Chip label="Comparable Sales ✓" color="success" size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Real-time MLS data sync
                    </Typography>
                  </Box>
                  
                  {/* CRM Integration */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      CRM Integration
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip label="Client Updates ✓" color="success" size="small" />
                      <Chip label="Transaction Sync ✓" color="success" size="small" />
                      <Chip label="Follow-up Tasks ✓" color="success" size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Automated client management
                    </Typography>
                  </Box>
                  
                  {/* Email Automation */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Email Automation
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip label="Offer Notifications ✓" color="success" size="small" />
                      <Chip label="Status Updates ✓" color="success" size="small" />
                      <Chip label="Client Reports ✓" color="success" size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Professional communication
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Compliance & Ethics Dashboard */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Compliance & Ethics Dashboard
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                  {/* NAR Code of Ethics */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      NAR Code of Ethics
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip label="Fair Representation ✓" color="success" size="small" />
                      <Chip label="No Discrimination ✓" color="success" size="small" />
                      <Chip label="Transparent Process ✓" color="success" size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      All compliance checks passed
                    </Typography>
                  </Box>
                  
                  {/* Fair Housing */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Fair Housing Compliance
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip label="Protected Classes ✓" color="success" size="small" />
                      <Chip label="Equal Treatment ✓" color="success" size="small" />
                      <Chip label="No Bias ✓" color="success" size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Full compliance maintained
                    </Typography>
                  </Box>
                  
                  {/* Documentation Audit */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Documentation Audit
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip label="All Offers Documented ✓" color="success" size="small" />
                      <Chip label="Timestamps Recorded ✓" color="success" size="small" />
                      <Chip label="Agent Notes Complete ✓" color="success" size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Audit trail complete
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Market Intelligence & Analytics */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Market Intelligence & Analytics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                  {/* Comparable Sales */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Comparable Sales
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">1234 Oak St</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>$445,000</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">567 Pine Ave</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>$432,000</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">890 Elm Dr</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>$418,000</Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Average: $431,667
                    </Typography>
                  </Box>
                  
                  {/* Market Trends */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Market Trends
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Days on Market</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4caf50' }}>↓ 12%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Price per Sq Ft</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4caf50' }}>↑ 8%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Inventory Level</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#f44336' }}>↓ 15%</Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Last 30 days
                    </Typography>
                  </Box>
                  
                  {/* Buyer Demand */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Buyer Demand
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Showings</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>24</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Offers Received</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>4</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Avg Days to Offer</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>11</Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Strong buyer interest
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Negotiation Tools & Communication */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Negotiation Tools & Communication
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                  {/* Counter-Offer Creation */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Create Counter-Offer
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button size="small" variant="outlined" startIcon={<EditIcon />}>
                        Price Counter
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<EditIcon />}>
                        Terms Counter
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Generate professional counter-offers with built-in templates
                    </Typography>
                  </Box>
                  
                  {/* Communication Hub */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Communication Hub
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button size="small" variant="outlined" startIcon={<ShareIcon />}>
                        Message Agents
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<ShareIcon />}>
                        Schedule Meeting
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Direct communication with buyer agents and clients
                    </Typography>
                  </Box>
                  
                  {/* Document Sharing */}
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Document Sharing
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                        Share Offers
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                        Export Report
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Secure sharing and professional reporting
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              {/* Main Content Area */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Enhanced Left Sidebar - Advanced Comparison & Analysis */}
                <Paper elevation={1} sx={{ p: 3, width: 320, backgroundColor: 'white', height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    You are comparing 4 offers
                  </Typography>
                  
                  {/* Fair Representation & Compliance */}
                  <Button 
                    variant="outlined" 
                    startIcon={<InfoIcon />}
                    fullWidth
                    sx={{ mb: 3, color: brandColors.primary, borderColor: brandColors.primary }}
                  >
                    Fair Representation
                  </Button>

                  {/* Quick Stats */}
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                      Quick Stats
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Highest Offer</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>$410,000</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Lowest Offer</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336' }}>$385,000</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Avg Offer</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>$397,500</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Price Range</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>$25,000</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Scoring System */}
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                      Offer Scoring
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {[
                        { offer: 'Offer #3', score: 92, price: '$410,000', color: '#4caf50' },
                        { offer: 'Offer #1', score: 87, price: '$400,000', color: '#2196f3' },
                        { offer: 'Offer #2', score: 83, price: '$395,000', color: '#ff9800' },
                        { offer: 'Offer #4', score: 78, price: '$385,000', color: '#f44336' }
                      ].map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: item.color
                          }} />
                          <Typography variant="caption" sx={{ flex: 1 }}>{item.offer}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: item.color }}>
                            {item.score}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Comparison Criteria */}
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                    Comparison Criteria
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { criteria: 'Buyers', weight: '25%' },
                      { criteria: 'Closing Date', weight: '20%' },
                      { criteria: 'Loan Type', weight: '15%' },
                      { criteria: 'Down Payment', weight: '20%' },
                      { criteria: 'Finance Type', weight: '10%' },
                      { criteria: 'Initial Deposit', weight: '10%' }
                    ].map((item) => (
                      <Box key={item.criteria} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {item.criteria}
                        </Typography>
                        <Chip 
                          label={item.weight} 
                          size="small" 
                          sx={{ 
                            backgroundColor: brandColors.primary, 
                            color: 'white',
                            fontSize: '10px',
                            height: 20
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Export Options */}
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                      Export Options
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                        PDF
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                        Excel
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                {/* Main Content - Offer Cards */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Enhanced Sample Offers with Advanced Data */}
                    {[
                      {
                        id: 1,
                        price: '$400,000',
                        agent: 'Vanessa Harrington - Agent',
                        buyers: 'Jane Herman',
                        closingDate: '21 days',
                        loanType: 'Conventional',
                        downPayment: '$50,000',
                        financeType: 'Fixed',
                        initialDeposit: '$15,000',
                        increasedDeposit: '-',
                        status: 'active',
                        priority: 'high',
                        score: 87,
                        netProceeds: '$376,000',
                        commission: '$24,000',
                        closingCosts: '$8,000',
                        daysOnMarket: 45,
                        buyerStrength: 'A+',
                        financingApproved: true,
                        inspectionWaived: false,
                        appraisalWaived: false,
                        notes: 'Strong offer, motivated buyer, pre-approved financing',
                        timeline: 'Received: 2 days ago, Expires: 5 days',
                        riskFactors: ['Low risk', 'Strong buyer', 'Conventional financing'],
                        attachments: ['Pre-approval Letter', 'Proof of Funds', 'Buyer Profile']
                      },
                      {
                        id: 2,
                        price: '$395,000',
                        agent: 'Hannah Lewis - Agent',
                        buyers: 'Joe Herman',
                        closingDate: '21 days',
                        loanType: 'Conventional',
                        downPayment: '$50,000',
                        financeType: 'Fixed',
                        initialDeposit: '$15,000',
                        increasedDeposit: '-',
                        status: 'pending',
                        priority: 'medium',
                        score: 83,
                        netProceeds: '$371,000',
                        commission: '$23,700',
                        closingCosts: '$8,000',
                        daysOnMarket: 45,
                        buyerStrength: 'A-',
                        financingApproved: true,
                        inspectionWaived: true,
                        appraisalWaived: false,
                        notes: 'Good terms, flexible closing, inspection waived',
                        timeline: 'Received: 1 day ago, Expires: 6 days',
                        riskFactors: ['Low risk', 'Good buyer', 'Some contingencies'],
                        attachments: ['Pre-approval Letter', 'Buyer Profile']
                      },
                      {
                        id: 3,
                        price: '$410,000',
                        agent: 'Michael Chen - Agent',
                        buyers: 'Sarah & David Wilson',
                        closingDate: '21 days',
                        loanType: 'Conventional',
                        downPayment: '$50,000',
                        financeType: 'Fixed',
                        initialDeposit: '$15,000',
                        increasedDeposit: '-',
                        status: 'highlighted',
                        priority: 'high',
                        score: 92,
                        netProceeds: '$386,000',
                        commission: '$24,600',
                        closingCosts: '$8,000',
                        daysOnMarket: 45,
                        buyerStrength: 'A+',
                        financingApproved: true,
                        inspectionWaived: true,
                        appraisalWaived: true,
                        notes: 'Highest offer, all cash, no contingencies',
                        timeline: 'Received: 3 days ago, Expires: 4 days',
                        riskFactors: ['No risk', 'Cash buyer', 'No contingencies'],
                        attachments: ['Proof of Funds', 'Buyer Profile', 'Cash Verification']
                      },
                      {
                        id: 4,
                        price: '$385,000',
                        agent: 'Lisa Rodriguez - Agent',
                        buyers: 'Robert Johnson',
                        closingDate: '21 days',
                        loanType: 'Conventional',
                        downPayment: '$50,000',
                        financeType: 'Fixed',
                        initialDeposit: '$15,000',
                        increasedDeposit: '-',
                        status: 'review',
                        priority: 'low',
                        score: 78,
                        netProceeds: '$361,000',
                        commission: '$23,100',
                        closingCosts: '$8,000',
                        daysOnMarket: 45,
                        buyerStrength: 'B+',
                        financingApproved: false,
                        inspectionWaived: false,
                        appraisalWaived: false,
                        notes: 'Lower price but quick close, needs financing approval',
                        timeline: 'Received: 4 days ago, Expires: 3 days',
                        riskFactors: ['Medium risk', 'Financing pending', 'All contingencies'],
                        attachments: ['Loan Application', 'Buyer Profile']
                      }
                    ].map((offer) => (
                      <Paper key={offer.id} elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                        {/* Enhanced Header with Status, Priority, and Score */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            {/* Offer Price */}
                            <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                              {offer.price}
                            </Typography>
                            
                            {/* Financial Summary */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Net: {offer.netProceeds}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Commission: {offer.commission}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* Status, Priority, and Score */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            {/* Status Badge */}
                            <Chip 
                              label={offer.status.toUpperCase()} 
                              color={
                                offer.status === 'highlighted' ? 'warning' :
                                offer.status === 'active' ? 'primary' :
                                offer.status === 'pending' ? 'default' : 'secondary'
                              }
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                            
                            {/* Priority Badge */}
                            <Chip 
                              label={offer.priority.toUpperCase()} 
                              color={
                                offer.priority === 'high' ? 'error' :
                                offer.priority === 'medium' ? 'warning' : 'default'
                              }
                              size="small"
                              variant="outlined"
                            />
                            
                            {/* Score Badge */}
                            <Chip 
                              label={`Score: ${offer.score}`}
                              color={
                                offer.score >= 90 ? 'success' :
                                offer.score >= 80 ? 'primary' :
                                offer.score >= 70 ? 'warning' : 'error'
                              }
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Box>

                        {/* Agent and Buyer Information */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {offer.agent}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              {offer.buyers}
                            </Typography>
                          </Box>
                          
                          {/* Buyer Strength Indicator */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">Strength:</Typography>
                            <Chip 
                              label={offer.buyerStrength} 
                              color={
                                offer.buyerStrength === 'A+' ? 'success' :
                                offer.buyerStrength === 'A-' ? 'primary' : 'warning'
                              }
                              size="small"
                            />
                          </Box>
                        </Box>

                        {/* Timeline and Risk Information */}
                        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Timeline & Risk Assessment
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Timeline</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
                                {offer.timeline}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
                                {offer.riskFactors[0]}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Enhanced Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                          <Button 
                            variant="contained" 
                            startIcon={<CheckCircleOutlineIcon />}
                            sx={{ 
                              backgroundColor: brandColors.primary,
                              '&:hover': { backgroundColor: brandColors.primary }
                            }}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<EditIcon />}
                            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                          >
                            Counter
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<NoteAddIcon />}
                            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                          >
                            Notes
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<ShareIcon />}
                            sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                          >
                            Share
                          </Button>
                        </Box>

                        {/* Enhanced Offer Details Grid */}
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: 2,
                          mb: 3
                        }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Closing Date</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{offer.closingDate}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Loan Type</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{offer.loanType}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Down Payment</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{offer.downPayment}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Finance Type</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{offer.financeType}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Initial Deposit</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{offer.initialDeposit}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Days on Market</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{offer.daysOnMarket}</Typography>
                          </Box>
                        </Box>

                        {/* Contingency Status */}
                        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Contingency Status
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">Inspection</Typography>
                              <Chip 
                                label={offer.inspectionWaived ? 'Waived' : 'Required'} 
                                color={offer.inspectionWaived ? 'success' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">Appraisal</Typography>
                              <Chip 
                                label={offer.appraisalWaived ? 'Waived' : 'Required'} 
                                color={offer.appraisalWaived ? 'success' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">Financing</Typography>
                              <Chip 
                                label={offer.financingApproved ? 'Approved' : 'Pending'} 
                                color={offer.financingApproved ? 'success' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </Box>

                        {/* Enhanced Notes and Attachments */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {/* Notes Section */}
                          {offer.notes && (
                            <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary">Notes</Typography>
                              <Typography variant="body2">{offer.notes}</Typography>
                            </Box>
                          )}
                          
                          {/* Attachments Section */}
                          {offer.attachments && offer.attachments.length > 0 && (
                            <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary">Attachments</Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                                {offer.attachments.map((attachment, index) => (
                                  <Typography key={index} variant="body2" sx={{ fontSize: '12px' }}>
                                    📎 {attachment}
                                  </Typography>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Box>
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

    {/* Complete Professional Document Review Interface */}
    <Box sx={{ pl: 0, ml: 3 }}>
      {/* Property Context Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 2
        }}>
          {/* Navigation Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="outlined" size="small" sx={{ minWidth: 'auto', p: 1 }}>
              <ArrowBackIcon />
            </Button>
            <Button variant="outlined" size="small" sx={{ minWidth: 'auto', p: 1 }}>
              <ArrowBackIcon sx={{ transform: 'scaleX(-1)' }} />
            </Button>
          </Box>

          {/* Property Address */}
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
              456 Haddington Street, Sacramento CA 95816
            </Typography>
            <Typography variant="body2" color="text.secondary">
              MLS #1234567 • Sale Price: $1,200,000
            </Typography>
          </Box>

          {/* Global Navigation & Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <Button 
                variant="contained" 
                size="small" 
                sx={{ 
                  borderRadius: '4px 0 0 4px', 
                  backgroundColor: brandColors.primary,
                  '&:hover': { backgroundColor: brandColors.primary }
                }}
              >
                Both
              </Button>
              <Button variant="outlined" size="small" sx={{ borderRadius: '0 4px 4px 0' }}>
                Listings
              </Button>
              <Button variant="outlined" size="small" sx={{ borderRadius: '0 4px 4px 0' }}>
                Transactions
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Stage 1</Typography>
              <Button variant="outlined" size="small" sx={{ minWidth: 'auto', p: 1 }}>
                <ExpandMoreIcon />
              </Button>
            </Box>
            <Button variant="outlined" size="small">
              Update Agent
            </Button>
          </Box>
        </Box>
      </Paper>

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

      {/* Main Review Interface - 3 Column Layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr 1fr' },
        gap: 3, 
        mt: 3 
      }}>
        {/* Left Sidebar - Document Checklist */}
        <Box sx={{ order: { xs: 2, lg: 1 } }}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: brandColors.primary }}>
              Document Checklist
            </Typography>
            
            {/* Sales Documentation Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Sales Documentation
                </Typography>
                <IconButton size="small" sx={{ color: brandColors.primary }}>
                  <AddIcon />
                </IconButton>
              </Box>
              
              {/* Document Items */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  mb: 2
                }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      1. Exclusive Right to Sell
                    </Typography>
                    <Chip 
                      label="Incomplete" 
                      size="small" 
                      color="warning" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                
                {/* Attached Documents */}
                <Box sx={{ ml: 3, mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 1.5,
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0f8ff' }
                  }}>
                    <DescriptionIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Exclusive-Right-to-Sell.pdf
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded 13 days ago
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 1.5,
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    <DescriptionIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Wire-Fraud.pdf
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded 13 days ago • Currently Viewing
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* More Document Items */}
              {[
                { name: '2. Agency Disclosure', status: 'Pending', color: 'info' },
                { name: '3. Lead Based Paint', status: 'Pending', color: 'info' },
                { name: '4. Seller Property Disclosure', status: 'Pending', color: 'info' },
                { name: '5. Short Sale Addendum', status: 'Pending', color: 'info' }
              ].map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Chip 
                      label={item.status} 
                      size="small" 
                      color={item.color as any} 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}

              {/* Disclosure Documentation Section */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Disclosure Documentation
                  </Typography>
                  <IconButton size="small" sx={{ color: brandColors.primary }}>
                    <AddIcon />
                  </IconButton>
                </Box>
                
                {[
                  { name: '1. Title Commitment', status: 'Pending' },
                  { name: '2. 1099 Forms', status: 'Pending' },
                  { name: '3. Home Inspection Report', status: 'Pending' }
                ].map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px'
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color="info" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Activity Logging */}
              <Box sx={{ mt: 4, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <Typography variant="subtitle2" gutterBottom>Activity Name</Typography>
                <input 
                  type="text" 
                  placeholder="Enter activity description" 
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    fontSize: '14px' 
                  }} 
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="outlined" size="small">Cancel</Button>
                  <Button variant="contained" size="small">Send</Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Center Panel - Enhanced Document Viewer */}
        <Box sx={{ order: { xs: 1, lg: 2 } }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {/* Enhanced Document Viewer Header */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Page</Typography>
                  <select 
                    style={{ 
                      padding: '4px 8px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px', 
                      fontSize: '14px' 
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Wire-Fraud.pdf
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wire Fraud Advisory • 0.8 MB • PDF • Added 13 days ago
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button variant="outlined" size="small">-</Button>
                  <Typography variant="body2">200%</Typography>
                  <Button variant="outlined" size="small">+</Button>
                </Box>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                  Download
                </Button>
              </Box>
            </Box>

            {/* Enhanced Document Content */}
            <Box sx={{ 
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              p: { xs: 2, md: 4 },
              height: '600px',
              overflow: 'auto'
            }}>
              {/* Document Content */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: '#1a365d',
                  mb: 2
                }}>
                  WIRE FRAUD AND ELECTRONIC FUNDS TRANSFER ADVISORY
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#2d3748',
                  lineHeight: 1.3
                }}>
                  (C.A.R Form LID Reviewed 2025)
                </Typography>
              </Box>

              {/* Document Content Placeholder */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px', 
                  mb: 2 
                }} />
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px', 
                  mb: 2,
                  width: '80%' 
                }} />
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px', 
                  mb: 2,
                  width: '60%' 
                }} />
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px', 
                  mb: 2,
                  width: '90%' 
                }} />
              </Box>

              {/* Signature Area */}
              <Box sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: '8px', 
                p: 4, 
                textAlign: 'center',
                backgroundColor: '#fafafa',
                mt: 6
              }}>
                <Typography variant="body1" color="text.secondary">
                  Signature Area
                </Typography>
              </Box>

              {/* Accept/Reject Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 3, 
                mt: 4 
              }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  sx={{ 
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#45a049' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Accept
                </Button>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<CancelIcon />}
                  sx={{ 
                    backgroundColor: '#f44336',
                    '&:hover': { backgroundColor: '#da190b' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Reject
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Panel - Transaction Details */}
        <Box sx={{ order: { xs: 3, lg: 3 } }}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
            {/* Transaction Details Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Box sx={{ display: 'flex' }}>
                <Button 
                  variant="text" 
                  sx={{ 
                    borderBottom: '2px solid',
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                    borderRadius: 0,
                    pb: 1
                  }}
                >
                  Transaction
                </Button>
                <Button 
                  variant="text" 
                  sx={{ 
                    color: 'text.secondary',
                    borderRadius: 0,
                    pb: 1
                  }}
                >
                  Comments (0)
                </Button>
              </Box>
            </Box>

            {/* Transaction Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip label="Pending" size="small" color="warning" variant="outlined" />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">File name</Typography>
                <Typography variant="body2" color="text.secondary">
                  456 Haddington Street, Sacramento, CA 95816
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Type</Typography>
                <Typography variant="body2" color="text.secondary">Listing</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Checklist Type</Typography>
                <Typography variant="body2" color="text.secondary">New Home</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Agent</Typography>
                <Typography variant="body2" color="text.secondary">Aaron Smith</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">MLS #</Typography>
                <Typography variant="body2" color="text.secondary">1234567</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Close of Escrow</Typography>
                <Typography variant="body2" color="text.secondary">11/29/2023</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Acceptance Date</Typography>
                <Typography variant="body2" color="text.secondary">11/24/2023</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Escrow #</Typography>
                <Typography variant="body2" color="text.secondary">1234567</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body2" color="text.secondary">456had...@skyslope.com</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Year Built</Typography>
                <Typography variant="body2" color="text.secondary">1965</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Sale Price</Typography>
                <Typography variant="body2" color="text.secondary">$1,200,000</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">File ID</Typography>
                <Typography variant="body2" color="text.secondary">1234567</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Contacts</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Seller</Typography>
                <Typography variant="body2" color="text.secondary">Halley Nelson, Bob Nelson</Typography>
              </Box>
            </Box>

            {/* Panel Actions */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button variant="outlined" fullWidth>Close</Button>
              <Button variant="contained" fullWidth>Submit</Button>
            </Box>
          </Paper>
        </Box>
      </Box>
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