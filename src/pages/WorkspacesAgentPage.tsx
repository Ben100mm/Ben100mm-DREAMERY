import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
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
  ContentCopy as ContentCopyIcon,
  ContentPaste as ContentPasteIcon,
  TextFields as TextFieldsIcon,
  CheckBox as CheckBoxIcon,
  Input as InputIcon,
  StrikethroughS as StrikethroughSIcon,
  Save as SaveIcon,
  Send as SendIcon,
  ArrowUpward as ArrowUpwardIcon,
  CloudUpload as UploadIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { brandColors } from "../theme";
import { RoleContext } from "../context/RoleContext";
import UnifiedRoleSelector from '../components/UnifiedRoleSelector';
import OfficeSelector from '../components/OfficeSelector';
import AgentMessages from "../components/agent/AgentMessages";

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

const WorkspacesAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Role-based access guard (no early returns to satisfy hooks rule)
  const { userRole } = (useContext(RoleContext) as any) || { userRole: 'Real Estate Agent' };
  const buyingRoles = ['Real Estate Agent', 'Buyer\'s Agent', 'Wholesaler', 'Realtor'];
  const listingRoles = ['Listing Agent', 'Commercial Agent', 'Luxury Agent', 'New Construction Agent', 'Disposition Agent'];
  const isAgentAuthorized = !!userRole && (buyingRoles.includes(userRole) || listingRoles.includes(userRole));
  
  console.log('WorkspacesAgentPage - userRole:', userRole, 'isAgentAuthorized:', isAgentAuthorized, 'buyingRoles:', buyingRoles, 'listingRoles:', listingRoles);
  
  // Debug effect to log role changes
  useEffect(() => {
    console.log('WorkspacesAgentPage - userRole changed to:', userRole);
  }, [userRole]);

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

  // Review Offers Tab State
  const [reviewOffersTab, setReviewOffersTab] = useState('dashboard');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [digitalSignatureTab, setDigitalSignatureTab] = useState('dashboard');
  
  // Write Offer Tab State
  const [writeOfferTab, setWriteOfferTab] = useState('offer-details');
  
  // Send Offers Modal State
  const [sendOffersModalOpen, setSendOffersModalOpen] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [recipients, setRecipients] = useState<string[]>(['beth.gilbert@seller.com', 'shawn.gilbert@seller.com']);
  const [customMessage, setCustomMessage] = useState('Hi Beth and Shawn,\n\nYou have been invited to review your offers for 1235 H Street.\n\nThanks!');
  const [attachCSV, setAttachCSV] = useState(true);
  const [hideBuyerInfo, setHideBuyerInfo] = useState(true);

  // Sample offers data for comparison
  const offers = [
    {
      id: 1,
      price: 410000,
      netAmount: 385400,
      commission: 24600,
      score: 87,
      status: 'ACTIVE',
      agent: 'Vanessa Harrington',
      closingDate: '21 days',
      loanType: 'Conventional',
      downPayment: 50000,
      financeType: 'Fixed',
      initialDeposit: 15000,
      daysOnMarket: 45,
      contingencies: ['Inspection: Waived', 'Appraisal: Required', 'Financing: Approved'],
      notes: 'Good terms, flexible closing, inspection waived. Strong buyer with pre-approved financing.',
      attachments: ['Pre-approval Letter', 'Financial Statement']
    },
    {
      id: 2,
      price: 395000,
      netAmount: 371300,
      commission: 23700,
      score: 83,
      status: 'PENDING',
      agent: 'Michael Chen',
      closingDate: '30 days',
      loanType: 'FHA',
      downPayment: 39500,
      financeType: 'Fixed',
      initialDeposit: 12000,
      daysOnMarket: 52,
      contingencies: ['Inspection: Required', 'Appraisal: Required', 'Financing: Pending'],
      notes: 'First-time buyer, needs closing cost assistance. Good credit score.',
      attachments: ['Pre-approval Letter', 'Credit Report']
    },
    {
      id: 3,
      price: 425000,
      netAmount: 399500,
      commission: 25500,
      score: 92,
      status: 'ACTIVE',
      agent: 'Sarah Johnson',
      closingDate: '14 days',
      loanType: 'Conventional',
      downPayment: 85000,
      financeType: 'Fixed',
      initialDeposit: 20000,
      daysOnMarket: 38,
      contingencies: ['Inspection: Waived', 'Appraisal: Waived', 'Financing: Approved'],
      notes: 'Cash buyer, no contingencies. Wants quick closing. Excellent offer.',
      attachments: ['Proof of Funds', 'ID Verification']
    },
    {
      id: 4,
      price: 385000,
      netAmount: 361900,
      commission: 23100,
      score: 78,
      status: 'PENDING',
      agent: 'David Rodriguez',
      closingDate: '45 days',
      loanType: 'VA',
      downPayment: 0,
      financeType: 'Fixed',
      initialDeposit: 8000,
      daysOnMarket: 65,
      contingencies: ['Inspection: Required', 'Appraisal: Required', 'Financing: Pending'],
      notes: 'Veteran buyer, longer closing timeline. Needs property to appraise.',
      attachments: ['VA Certificate', 'Military ID']
    }
  ];

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
    { value: 'messages', label: 'Messages', icon: <ChatIcon /> },
    
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
    navigate('/workspaces');
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
      {!isAgentAuthorized && userRole && <Navigate to="/" />}
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
          {/* Role Selector */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <UnifiedRoleSelector 
              currentRole={userRole}
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

          {/* Office Selector */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <OfficeSelector 
              selectedOffice={selectedOffice}
              onOfficeChange={setSelectedOffice}
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
                <AssignmentIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Agent Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your clients, transactions, and closing processes
              </Typography>
            </Paper>

            {/* Overview Cards - Row 1 */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1.5, md: 2 }, 
              mb: 3,
              '& > *': {
                marginBottom: { xs: '1rem', md: '0' }
              }
            }}>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <PeopleIcon sx={{ fontSize: 32, color: brandColors.actions.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Active Clients
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <AssignmentIcon sx={{ fontSize: 32, color: brandColors.actions.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.warning }}>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pending Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <CheckCircleIcon sx={{ fontSize: 32, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  24
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Completed This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <ChecklistIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Incomplete Checklists
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <DescriptionIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Documents to Review
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
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
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1.5, md: 2 }, 
              mb: 3,
              '& > *': {
                marginBottom: { xs: '1rem', md: '0' }
              }
            }}>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <TaskIcon sx={{ fontSize: 32, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  9
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Tasks & Reminders
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <ListAltIcon sx={{ fontSize: 32, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                  15
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Active Listings
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <ReceiptIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  4
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pending Offers
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <ManageAccountsIcon sx={{ fontSize: 32, color: brandColors.accent.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.warning }}>
                  6
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Manage Transactions
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <CancelIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Canceled Contracts
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
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
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1.5, md: 2 }, 
              mb: 4,
              '& > *': {
                marginBottom: { xs: '1rem', md: '0' }
              }
            }}>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  $2.4M
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pipeline Value
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <EventIcon sx={{ fontSize: 32, color: brandColors.accent.info, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.info }}>
                  7
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Scheduled Closing This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <AttachMoneyIcon sx={{ fontSize: 32, color: brandColors.accent.warning, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.warning }}>
                  $18.5K
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Pending Commission
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <AccountBalanceIcon sx={{ fontSize: 32, color: brandColors.accent.success, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                  $32.1K
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Commission Earned This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
                <ScheduleIcon sx={{ fontSize: 32, color: brandColors.actions.error, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.actions.error }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Expired Listings This Month
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ 
                p: { xs: 2, md: 2.5 }, 
                textAlign: 'center', 
                flex: '1 1 180px', 
                minWidth: { xs: '150px', md: '180px' },
                width: '100%',
                maxWidth: { xs: '100%', sm: '180px' }
              }}>
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
            <Paper elevation={2} sx={{ 
              p: { xs: 2, md: 3 },
              width: '100%'
            }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AssignmentIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                              border: '1px solid brandColors.neutral[400]',
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
                              border: '1px solid brandColors.neutral[400]',
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
                              border: '1px solid brandColors.neutral[400]',
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
                              border: '1px solid brandColors.neutral[400]',
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
                      border: '1px solid brandColors.accent.info',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: brandColors.accent.infoDark, fontWeight: 500 }}>
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
                            border: '1px solid brandColors.neutral[400]',
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
                            border: '1px solid brandColors.neutral[400]',
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
                            border: '1px solid brandColors.neutral[400]',
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
                            border: '1px solid brandColors.neutral[400]',
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
                              border: '1px solid brandColors.neutral[400]',
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
                              border: '1px solid brandColors.neutral[400]',
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
                            border: '1px solid brandColors.neutral[400]',
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
                            border: '1px solid brandColors.neutral[400]',
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
                    border: '1px solid brandColors.neutral[100]',
                    borderRadius: '8px'
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      💡 This form creates a new transaction file. Use MLS Search for accurate property data.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Activity Log Interface */}
              <Paper elevation={2} sx={{ p: 3 }}>
                {/* Header with Navigation and Property Address */}
                <Box sx={{ 
                  mb: 3, 
                  p: 3, 
                  background: 'linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="text"
                      startIcon={<ArrowBackIcon />}
                      sx={{ color: brandColors.primary, fontWeight: 600 }}
                    >
                      Back to Offers
                    </Button>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                      1235 H Street, Sacramento, CA 95824
                    </Typography>
                  </Box>
                </Box>

                {/* Activity Log Title and Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.primary }}>
                    Activity Log
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        placeholder="Search"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            pr: 6,
                            backgroundColor: 'white'
                          }
                        }}
                      />
                      <SearchIcon sx={{ 
                        position: 'absolute', 
                        right: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'text.secondary'
                      }} />
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>

                {/* Activity Log Table */}
                <Paper elevation={1} sx={{ backgroundColor: 'white' }}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr auto',
                    borderBottom: '2px solid brandColors.neutral[300]',
                    p: 2,
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Activity
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Date and Time
                      </Typography>
                      <ArrowUpwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </Box>
                  </Box>

                  {/* Activity Entries */}
                  {[
                    {
                      activity: 'Kristen Turner has signed the accepted offer from **Beth Brown**.',
                      dateTime: 'July 1, 2022, 1:30 PM PDT'
                    },
                    {
                      activity: 'Kristen Turner has invited **Sally Seller** to review offers.',
                      dateTime: 'July 4, 2022, 10:30 PM PDT'
                    },
                    {
                      activity: 'Beth Brown has submitted a counter offer.',
                      dateTime: 'July 4, 2022, 8:30 AM PDT'
                    },
                    {
                      activity: 'Beth Brown has read the counter offer email.',
                      dateTime: 'July 3, 2022, 4:30 PM PDT'
                    },
                    {
                      activity: 'Kristen Turner has declined an offer from **James Harvey**.',
                      dateTime: 'July 3, 2022, 2:30 PM PDT'
                    },
                    {
                      activity: 'Sally Seller has signed counter documents.',
                      dateTime: 'July 3, 2022, 1:30 PM PDT'
                    },
                    {
                      activity: 'Kristen Turner has countered offer from **Beth Brown**.',
                      dateTime: 'July 3, 2022, 10:00 AM PDT'
                    },
                    {
                      activity: 'Sally Seller has opened email invite to review offers.',
                      dateTime: 'July 2, 2022, 1:30 PM PDT'
                    },
                    {
                      activity: 'Kristen Turner has invited **Sally Seller** to review offers.',
                      dateTime: 'July 2, 2022, 10:30 PM PDT'
                    },
                    {
                      activity: 'Kristen Turner has added a **new offer** from **James Harvey**.',
                      dateTime: 'July 2, 2022, 10:20 AM PDT'
                    }
                  ].map((entry, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        p: 2,
                        borderBottom: '1px solid brandColors.neutral[300]',
                        '&:hover': { backgroundColor: '#f8f9fa' },
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                        {entry.activity.split('**').map((part, i) => 
                          i % 2 === 0 ? part : (
                            <Box key={i} component="span" sx={{ fontWeight: 700, color: brandColors.primary }}>
                              {part}
                            </Box>
                          )
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {entry.dateTime}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
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
                      border: '1px solid brandColors.neutral[400]',
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
                          border: selectedProperty?.mlsNumber === property.mlsNumber ? `2px solid ${brandColors.primary}` : '1px solid brandColors.neutral[300]',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedProperty?.mlsNumber === property.mlsNumber ? '#f0f8ff' : 'white',
                          '&:hover': {
                            backgroundColor: selectedProperty?.mlsNumber === property.mlsNumber ? '#f0f8ff' : brandColors.neutral[100],
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
                            backgroundColor: brandColors.neutral[100],
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
                    border: '1px solid brandColors.accent.success',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                      ✅ Property data imported successfully!
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.accent.successDark, mt: 1 }}>
                      Property details have been added to your form.
                    </Typography>
                  </Box>
                )}

                {/* Modal Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: '1px solid brandColors.neutral[300]' }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <BusinessIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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

        {state.activeTab === 'messages' && (
          <AgentMessages />
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ManageAccountsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                        border: '1px solid brandColors.neutral[400]', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }} 
                    />
                  </Box>
                  <Button variant="outlined">Search</Button>
                  <Button variant="outlined">Show All</Button>
                  <IconButton sx={{ border: '1px solid brandColors.neutral[400]', backgroundColor: brandColors.backgrounds.selected }}>
                    <ListAltIcon />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid brandColors.neutral[400]' }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ListAltIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                        border: '1px solid brandColors.neutral[400]', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }} 
                    />
                    <Button variant="contained" sx={{ backgroundColor: brandColors.actions.primary }}>
                      Search
                    </Button>
                  </Box>
                  <Button variant="outlined">Show All</Button>
                  <IconButton sx={{ border: '1px solid brandColors.neutral[400]' }}>
                    <ListAltIcon />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid brandColors.neutral[400]' }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CreateIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                              <CheckCircleIcon sx={{ fontSize: 12, color: brandColors.text.inverse }} />
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
                      <Box sx={{ display: 'flex', border: '1px solid brandColors.neutral[400]', borderRadius: '8px', overflow: 'hidden' }}>
                        <Box
                          onClick={() => handlePropertyPurposeChange('sale')}
                          sx={{
                            px: 3,
                            py: 1.5,
                            cursor: 'pointer',
                            backgroundColor: propertyPurpose === 'sale' ? brandColors.primary : 'white',
                            color: propertyPurpose === 'sale' ? 'white' : 'text.primary',
                            borderRight: '1px solid brandColors.neutral[400]',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: propertyPurpose === 'sale' ? brandColors.primary : brandColors.neutral[100]
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
                              backgroundColor: propertyPurpose === 'rent' ? brandColors.primary : brandColors.neutral[100]
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                    border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                              border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                                  border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Seller Name</Typography>
                        <input 
                          type="text" 
                          placeholder="Enter seller name" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                          border: '1px solid brandColors.neutral[400]', 
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
                      border: '2px dashed brandColors.neutral[400]', 
                      borderRadius: '8px', 
                      p: 4, 
                      textAlign: 'center',
                      backgroundColor: brandColors.neutral[50],
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
                              border: '1px solid brandColors.neutral[300]', 
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
                              border: '1px solid brandColors.neutral[300]', 
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
                              border: '1px solid brandColors.neutral[300]', 
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
                              border: '1px solid brandColors.neutral[300]', 
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
                              border: '1px solid brandColors.neutral[300]', 
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
                              border: '1px solid brandColors.neutral[300]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] }
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                      border: '2px dashed brandColors.neutral[400]', 
                      borderRadius: '8px', 
                      p: 4, 
                      textAlign: 'center',
                      backgroundColor: brandColors.neutral[50],
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
                          border: '1px solid brandColors.neutral[300]', 
                          borderRadius: '4px', 
                          p: 2, 
                          textAlign: 'center',
                          backgroundColor: '#f9f9f9',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: brandColors.neutral[100] }
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
                      <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                      <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                      <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
                      {[
                        { name: 'Standard Lease Agreement', status: 'Required', date: '2024-01-12', size: '2.1 MB', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Lease Addendum', status: 'Conditional', date: '', size: '', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Security Deposit Receipt', status: 'Required', date: '2024-01-11', size: '0.8 MB', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Move-in Checklist', status: 'Required', date: '2024-01-10', size: '0.5 MB', type: 'PDF', category: 'Lease Documents' },
                        { name: 'Rent Payment Schedule', status: 'Required', date: '2024-01-09', size: '0.3 MB', type: 'DOCX', category: 'Lease Documents' }
                      ].map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
                      {[
                        { name: 'Rental Application Form', status: 'Required', date: '2024-01-12', size: '1.2 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'Credit Check Authorization', status: 'Required', date: '2024-01-11', size: '0.8 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'Employment Verification', status: 'Required', date: '2024-01-10', size: '0.6 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'References Form', status: 'Required', date: '2024-01-09', size: '0.4 MB', type: 'PDF', category: 'Tenant Forms' },
                        { name: 'Income Verification', status: 'Required', date: '2024-01-08', size: '0.7 MB', type: 'PDF', category: 'Tenant Forms' }
                      ].map((doc, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                    <Box sx={{ border: '1px solid brandColors.neutral[300]', borderRadius: '4px', overflow: 'hidden' }}>
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
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid brandColors.neutral[300]', '&:hover': { backgroundColor: brandColors.neutral[100] }, '&:last-child': { borderBottom: 'none' } }}>
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] },
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                            border: '1px solid brandColors.neutral[400]', 
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
                          border: '1px solid brandColors.neutral[400]', 
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
                      border: '1px solid brandColors.neutral[300]', 
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
                          borderBottom: '1px solid brandColors.neutral[300]',
                          '&:hover': { backgroundColor: brandColors.neutral[100] }
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ReceiptIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Write An Offer
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Create and submit property offers for your clients
              </Typography>
            </Paper>
            {/* Professional Offer Creation Interface */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Tab Navigation */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[
                      { value: 'offer-details', label: 'OFFER DETAILS', icon: <DescriptionIcon /> },
                      { value: 'property-info', label: 'PROPERTY INFO', icon: <BusinessIcon /> },
                      { value: 'buyer-details', label: 'BUYER DETAILS', icon: <PersonIcon /> },
                      { value: 'financing', label: 'FINANCING', icon: <AccountBalanceIcon /> },
                      { value: 'terms', label: 'TERMS & CONDITIONS', icon: <AssignmentIcon /> },
                      { value: 'attachments', label: 'ATTACHMENTS', icon: <AttachMoneyIcon /> },
                      { value: 'review', label: 'REVIEW & SUBMIT', icon: <CheckCircleIcon /> },
                      { value: 'my-offers', label: 'MY OFFERS', icon: <ListAltIcon /> }
                    ].map((tab) => (
                      <Button
                        key={tab.value}
                        onClick={() => setWriteOfferTab(tab.value)}
                        variant={writeOfferTab === tab.value ? 'contained' : 'text'}
                        startIcon={tab.icon}
                        sx={{
                          borderRadius: 0,
                          borderBottom: writeOfferTab === tab.value ? 2 : 0,
                          borderColor: brandColors.primary,
                          backgroundColor: writeOfferTab === tab.value ? brandColors.primary : 'transparent',
                          color: writeOfferTab === tab.value ? 'white' : 'text.primary',
                          '&:hover': {
                            backgroundColor: writeOfferTab === tab.value ? brandColors.secondary : 'rgba(0,0,0,0.04)'
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
              {writeOfferTab === 'offer-details' && (
                <>
                  {/* Offer Details Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Offer Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Offer Price"
                        type="number"
                        placeholder="$0.00"
                        InputProps={{
                          startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Earnest Money"
                        type="number"
                        placeholder="$0.00"
                        InputProps={{
                          startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Closing Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        fullWidth
                        label="Offer Expiration"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'property-info' && (
                <>
                  {/* Property Information Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Property Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Property Address"
                        placeholder="123 Main Street"
                      />
                      <TextField
                        fullWidth
                        label="MLS Number"
                        placeholder="MLS #123456"
                      />
                      <TextField
                        fullWidth
                        label="Property Type"
                        select
                        defaultValue=""
                      >
                        <MenuItem value="single-family">Single Family</MenuItem>
                        <MenuItem value="multi-family">Multi Family</MenuItem>
                        <MenuItem value="condo">Condo</MenuItem>
                        <MenuItem value="townhouse">Townhouse</MenuItem>
                        <MenuItem value="land">Land</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Square Footage"
                        type="number"
                        placeholder="0"
                      />
                      <TextField
                        fullWidth
                        label="Bedrooms"
                        type="number"
                        placeholder="0"
                      />
                      <TextField
                        fullWidth
                        label="Bathrooms"
                        type="number"
                        placeholder="0"
                      />
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'buyer-details' && (
                <>
                  {/* Buyer Details Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Buyer Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Buyer Name"
                        placeholder="John Doe"
                      />
                      <TextField
                        fullWidth
                        label="Buyer Email"
                        type="email"
                        placeholder="john.doe@email.com"
                      />
                      <TextField
                        fullWidth
                        label="Buyer Phone"
                        placeholder="(555) 123-4567"
                      />
                      <TextField
                        fullWidth
                        label="Buyer Agent"
                        placeholder="Agent Name"
                      />
                      <TextField
                        fullWidth
                        label="Buyer Agent Email"
                        type="email"
                        placeholder="agent@email.com"
                      />
                      <TextField
                        fullWidth
                        label="Buyer Agent Phone"
                        placeholder="(555) 987-6543"
                      />
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'financing' && (
                <>
                  {/* Financing Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Financing Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Loan Type"
                        select
                        defaultValue=""
                      >
                        <MenuItem value="conventional">Conventional</MenuItem>
                        <MenuItem value="fha">FHA</MenuItem>
                        <MenuItem value="va">VA</MenuItem>
                        <MenuItem value="usda">USDA</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Down Payment"
                        type="number"
                        placeholder="$0.00"
                        InputProps={{
                          startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Interest Rate"
                        type="number"
                        placeholder="0.00"
                        InputProps={{
                          endAdornment: <Typography variant="body1" sx={{ ml: 1 }}>%</Typography>
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Loan Term"
                        select
                        defaultValue=""
                      >
                        <MenuItem value="15">15 Years</MenuItem>
                        <MenuItem value="20">20 Years</MenuItem>
                        <MenuItem value="30">30 Years</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Pre-Approval Amount"
                        type="number"
                        placeholder="$0.00"
                        InputProps={{
                          startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Lender Name"
                        placeholder="Bank or Lender Name"
                      />
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'terms' && (
                <>
                  {/* Terms & Conditions Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Terms & Conditions
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Inspection Period (Days)"
                        type="number"
                        placeholder="0"
                      />
                      <TextField
                        fullWidth
                        label="Appraisal Contingency"
                        select
                        defaultValue=""
                      >
                        <MenuItem value="required">Required</MenuItem>
                        <MenuItem value="waived">Waived</MenuItem>
                        <MenuItem value="conditional">Conditional</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Financing Contingency"
                        select
                        defaultValue=""
                      >
                        <MenuItem value="required">Required</MenuItem>
                        <MenuItem value="waived">Waived</MenuItem>
                        <MenuItem value="conditional">Conditional</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Sale of Buyer's Home"
                        select
                        defaultValue=""
                      >
                        <MenuItem value="not-required">Not Required</MenuItem>
                        <MenuItem value="required">Required</MenuItem>
                        <MenuItem value="conditional">Conditional</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Additional Terms"
                        placeholder="Enter any additional terms or conditions..."
                      />
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'attachments' && (
                <>
                  {/* Attachments Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Required Documents & Attachments
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 3, border: '2px dashed brandColors.neutral[400]', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          Pre-Approval Letter
                        </Typography>
                        <Button variant="outlined" startIcon={<UploadIcon />}>
                          Upload Document
                        </Button>
                      </Box>
                      <Box sx={{ p: 3, border: '2px dashed brandColors.neutral[400]', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          Proof of Funds
                        </Typography>
                        <Button variant="outlined" startIcon={<UploadIcon />}>
                          Upload Document
                        </Button>
                      </Box>
                      <Box sx={{ p: 3, border: '2px dashed brandColors.neutral[400]', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          Buyer's Agent Agreement
                        </Typography>
                        <Button variant="outlined" startIcon={<UploadIcon />}>
                          Upload Document
                        </Button>
                      </Box>
                      <Box sx={{ p: 3, border: '2px dashed brandColors.neutral[400]', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                          + Add More Documents
                        </Typography>
                        <Button variant="text" startIcon={<AddIcon />}>
                          Add Document Type
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'review' && (
                <>
                  {/* Review & Submit Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                      Review & Submit Offer
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 3 }}>
                      <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                          Offer Summary
                        </Typography>
                        <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                          $450,000
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Offer Price
                        </Typography>
                      </Box>
                      <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                          Closing Date
                        </Typography>
                        <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                          Dec 15, 2024
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Target Close
                        </Typography>
                      </Box>
                      <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                          Financing
                        </Typography>
                        <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                          Conventional
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Loan Type
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<SaveIcon />}
                        sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                      >
                        Save Draft
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{ backgroundColor: brandColors.primary }}
                      >
                        Submit Offer
                      </Button>
                    </Box>
                  </Paper>
                </>
              )}

              {writeOfferTab === 'my-offers' && (
                <>
                  {/* My Offers Management Tab */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                    {/* Header with Navigation and Agent Info */}
                    <Box sx={{ 
                      mb: 3, 
                      p: 3, 
                      background: 'linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          variant="text"
                          startIcon={<ArrowBackIcon />}
                          sx={{ color: brandColors.primary, fontWeight: 600 }}
                        >
                          Back
                        </Button>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Tracy Lee
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>|</Typography>
                        <Button
                          variant="text"
                          sx={{ color: brandColors.primary, textDecoration: 'underline' }}
                        >
                          Edit Details
                        </Button>
                      </Box>
                    </Box>

                    {/* Offers Summary and Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                        All Offers (5)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="text"
                          startIcon={<DownloadIcon />}
                          sx={{ color: brandColors.primary }}
                        >
                          Download Offers
                        </Button>
                        <Button
                          variant="text"
                          startIcon={<DescriptionIcon />}
                          sx={{ color: brandColors.primary }}
                        >
                          Activity Log
                        </Button>
                      </Box>
                    </Box>

                    {/* Offers Table */}
                    <Paper elevation={1} sx={{ backgroundColor: 'white' }}>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr 1fr auto',
                        borderBottom: '2px solid brandColors.neutral[300]',
                        p: 2,
                        backgroundColor: '#f8f9fa'
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Property Address
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Offer Amount
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            Date Submitted
                          </Typography>
                          <ArrowUpwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Actions
                        </Typography>
                      </Box>

                      {/* Offer Rows */}
                      {[
                        {
                          address: '11 Arcangelo Gate, Elder Mills, York, Ontario L4L 1A7',
                          amount: '$1,295,000',
                          date: '03/22/2023 04:32:00 P.M.',
                          status: 'Countered',
                          statusColor: brandColors.accent.infoLight
                        },
                        {
                          address: '70 Simmons St, Elder Mills, York, Ontario L4L 1A7',
                          amount: '$1,310,000',
                          date: '03/22/2023 04:32:00 P.M.',
                          status: 'In Review',
                          statusColor: '#bbdefb'
                        },
                        {
                          address: '163 Erb St W, Waterloo, Ontario N2L 1V2',
                          amount: '$1,300,000',
                          date: '03/22/2023 04:32:00 P.M.',
                          status: 'In Review',
                          statusColor: '#bbdefb'
                        },
                        {
                          address: '11623 Dixie Rd, Sandringham-Wellington North, Peel, Ontario L6R 0B3',
                          amount: '$1,400,000',
                          date: '03/22/2023 04:32:00 P.M.',
                          status: 'Declined',
                          statusColor: brandColors.neutral[300]
                        },
                        {
                          address: '8872 9 Line, Rural Halton Hills, Halton, Ontario L0P 1K0',
                          amount: '$1,299,999',
                          date: '03/22/2023 04:32:00 P.M.',
                          status: 'Declined',
                          statusColor: brandColors.neutral[300]
                        }
                      ].map((offer, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr auto',
                            p: 2,
                            borderBottom: '1px solid brandColors.neutral[300]',
                            '&:hover': { backgroundColor: '#f8f9fa' },
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                            {offer.address}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                            {offer.amount}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            {offer.date}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={offer.status}
                              size="small"
                              sx={{
                                backgroundColor: offer.statusColor,
                                color: 'text.primary',
                                fontWeight: 600
                              }}
                            />
                            {offer.status === 'Countered' && (
                              <IconButton size="small">
                                <ExpandMoreIcon />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  </Paper>
                </>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  disabled={writeOfferTab === 'offer-details'}
                  onClick={() => {
                    const tabs = ['offer-details', 'property-info', 'buyer-details', 'financing', 'terms', 'attachments', 'review', 'my-offers'];
                    const currentIndex = tabs.indexOf(writeOfferTab);
                    if (currentIndex > 0) {
                      setWriteOfferTab(tabs[currentIndex - 1]);
                    }
                  }}
                  sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  disabled={writeOfferTab === 'review' || writeOfferTab === 'my-offers'}
                  onClick={() => {
                    const tabs = ['offer-details', 'property-info', 'buyer-details', 'financing', 'terms', 'attachments', 'review', 'my-offers'];
                    const currentIndex = tabs.indexOf(writeOfferTab);
                    if (currentIndex < tabs.length - 1) {
                      setWriteOfferTab(tabs[currentIndex + 1]);
                    }
                  }}
                  sx={{ backgroundColor: brandColors.primary }}
                >
                  {writeOfferTab === 'review' || writeOfferTab === 'my-offers' ? 'Submit' : 'Next'}
                </Button>
              </Box>
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
        color: brandColors.text.inverse
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CompareArrowsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
        <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
          Review Offers
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
        Compare and evaluate multiple offers on your listings
      </Typography>
    </Paper>

    {/* Professional Offer Comparison Interface */}
    <Box sx={{ pl: 0, ml: 3 }}>
      {/* Tab Navigation */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
                                {[
                      { value: 'dashboard', label: 'DASHBOARD', icon: <AssessmentIcon /> },
                      { value: 'offers', label: 'OFFERS', icon: <ListAltIcon /> },
                      { value: 'offer-review', label: 'OFFER REVIEW', icon: <DescriptionIcon /> },
                      { value: 'compare', label: 'COMPARE', icon: <CompareArrowsIcon /> }
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
      {reviewOffersTab === 'dashboard' && (
        <>

          

          {/* Offer Summary - Horizontal Layout */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Offer Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
              <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, textAlign: 'center', border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                  Total Offers
                </Typography>
                <Typography variant="h3" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                  8
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All offers received
                </Typography>
              </Box>
              <Box sx={{ p: 3, backgroundColor: '#fff3cd', borderRadius: 2, textAlign: 'center', border: '1px solid #ffd54f' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#856404' }}>
                  Pending Review
                </Typography>
                <Typography variant="h3" sx={{ color: brandColors.accent.warningDark, fontWeight: 700 }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#856404' }}>
                  Awaiting decision
                </Typography>
              </Box>
              <Box sx={{ p: 3, backgroundColor: '#e3f2fd', borderRadius: 2, textAlign: 'center', border: '1px solid #90caf9' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.accent.infoDark }}>
                  Under Negotiation
                </Typography>
                <Typography variant="h3" sx={{ color: brandColors.accent.infoDark, fontWeight: 700 }}>
                  2
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.accent.infoDark }}>
                  In discussion
                </Typography>
              </Box>
              <Box sx={{ p: 3, backgroundColor: '#e8f5e8', borderRadius: 2, textAlign: 'center', border: '1px solid #a5d6a7' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#2e7d32' }}>
                  Accepted
                </Typography>
                <Typography variant="h3" sx={{ color: '#2e7d32', fontWeight: 700 }}>
                  2
                </Typography>
                <Typography variant="caption" sx={{ color: '#2e7d32' }}>
                  Deal closed
                </Typography>
              </Box>
              <Box sx={{ p: 3, backgroundColor: '#fce4ec', borderRadius: 2, textAlign: 'center', border: '1px solid #f8bbd9' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#c2185b' }}>
                  Rejected
                </Typography>
                <Typography variant="h3" sx={{ color: '#c2185b', fontWeight: 700 }}>
                  1
                </Typography>
                <Typography variant="caption" sx={{ color: '#c2185b' }}>
                  Not proceeding
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Main Content Area */}
          <Box sx={{ display: 'flex', gap: 3 }}>


            {/* Main Content - Offer Cards */}
            <Paper elevation={1} sx={{ flex: 1, p: 3, backgroundColor: 'white' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Offers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  {
                    id: 'OFF001',
                    buyer: 'John Smith',
                    agent: 'Sarah Johnson',
                    amount: '$445,000',
                    status: 'Pending',
                    priority: 'High',
                    date: '2024-01-15'
                  },
                  {
                    id: 'OFF002',
                    buyer: 'Mike Wilson',
                    agent: 'David Brown',
                    amount: '$440,000',
                    status: 'Under Review',
                    priority: 'Medium',
                    date: '2024-01-14'
                  },
                  {
                    id: 'OFF003',
                    buyer: 'Lisa Davis',
                    agent: 'Emily Wilson',
                    amount: '$450,000',
                    status: 'Negotiating',
                    priority: 'High',
                    date: '2024-01-13'
                  }
                ].map((offer) => (
                  <Box key={offer.id} sx={{ 
                    p: 2, 
                    border: '1px solid brandColors.neutral[300]', 
                    borderRadius: 1,
                    '&:hover': { backgroundColor: brandColors.neutral[100] }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {offer.buyer}
                      </Typography>
                      <Chip 
                        label={offer.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: offer.status === 'Pending' ? '#fff3cd' : 
                                         offer.status === 'Under Review' ? '#e3f2fd' : '#e8f5e8',
                          color: offer.status === 'Pending' ? '#856404' : 
                                 offer.status === 'Under Review' ? brandColors.accent.infoDark : '#2e7d32'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Agent: {offer.agent} • Date: {offer.date}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                        {offer.amount}
                      </Typography>
                      <Chip 
                        label={offer.priority} 
                        size="small" 
                        sx={{ 
                          backgroundColor: offer.priority === 'High' ? '#ffebee' : '#fff3cd',
                          color: offer.priority === 'High' ? brandColors.accent.errorDark : '#856404'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Automation & Integration Hub */}
          <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Automation & Integration Hub
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {/* MLS Integration */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  MLS Integration
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Property Data" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Market Updates" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Comparable Sales" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Real-time MLS data sync
                </Typography>
              </Box>

              {/* CRM Integration */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  CRM Integration
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Client Updates" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Transaction Sync" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Follow-up Tasks" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Automated client management
                </Typography>
              </Box>

              {/* Email Automation */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Email Automation
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Offer Notifications" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Status Updates" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Client Reports" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Professional communication
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Compliance & Ethics Dashboard */}
          <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Compliance & Ethics Dashboard
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {/* NAR Code of Ethics */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  NAR Code of Ethics
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Fair Representation" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="No Discrimination" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Transparent Process" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  All compliance checks passed
                </Typography>
              </Box>

              {/* Fair Housing Compliance */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Fair Housing Compliance
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Protected Classes" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Equal Treatment" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="No Bias" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Full compliance maintained
                </Typography>
              </Box>

              {/* Documentation Audit */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Documentation Audit
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="All Offers Documented" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Timestamps Recorded" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                  <Chip 
                    label="Agent Notes Complete" 
                    size="small" 
                    sx={{ 
                      backgroundColor: brandColors.accent.success, 
                      color: brandColors.text.inverse,
                      '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 }
                    }}
                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: brandColors.text.inverse }} />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Audit trail complete
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {reviewOffersTab === 'offers' && (
        <>
          {/* Market Intelligence & Analytics Dashboard */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Market Intelligence & Analytics
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {/* Comparable Sales */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Comparable Sales
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">1234 Oak St</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>$445,000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">567 Pine Ave</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>$432,000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">890 Elm Dr</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>$418,000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid brandColors.neutral[300]' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Average:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.primary }}>$431,667</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Market Trends */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Market Trends
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Days on Market</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: brandColors.accent.success, fontWeight: 600 }}>↓ 12%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Price per Sq Ft</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: brandColors.accent.success, fontWeight: 600 }}>↑ 8%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Inventory Level</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: brandColors.accent.error, fontWeight: 600 }}>↓ 15%</Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, pt: 1, borderTop: '1px solid brandColors.neutral[300]' }}>
                    Last 30 days
                  </Typography>
                </Box>
              </Box>

              {/* Buyer Demand */}
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Buyer Demand
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Showings</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>24</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Offers Received</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>4</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Avg Days to Offer</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>11</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 1, pt: 1, borderTop: '1px solid brandColors.neutral[300]', color: brandColors.accent.success, fontWeight: 600 }}>
                    Strong buyer interest
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Offers Management Content */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Active Offers Management
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {/* Offer Summary Cards */}
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Total Offers Received
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                  8
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across all active listings
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Pending Review
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.accent.warning, fontWeight: 700 }}>
                  3
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Require immediate attention
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Under Negotiation
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 700 }}>
                  2
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active counter-offers
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Offers Table */}
          <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              All Offers
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '40px 150px 200px 150px 120px 120px 120px 100px 80px',
                gap: 1,
                p: 2,
                backgroundColor: '#f8f9fa',
                borderRadius: 1,
                mb: 2,
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                <Box>✓</Box>
                <Box>Offer Date</Box>
                <Box>Buyer</Box>
                <Box>Agent</Box>
                <Box>Offer Amount</Box>
                <Box>Status</Box>
                <Box>Priority</Box>
                <Box>Actions</Box>
              </Box>

              {/* Offer Rows */}
              {[
                {
                  id: 'OFF001',
                  date: '2024-01-15',
                  buyer: 'John Smith',
                  agent: 'Sarah Johnson',
                  amount: '$445,000',
                  status: 'Pending',
                  priority: 'High'
                },
                {
                  id: 'OFF002',
                  date: '2024-01-14',
                  buyer: 'Mike Wilson',
                  agent: 'David Brown',
                  amount: '$440,000',
                  status: 'Under Review',
                  priority: 'Medium'
                },
                {
                  id: 'OFF003',
                  date: '2024-01-13',
                  buyer: 'Lisa Davis',
                  agent: 'Emily Wilson',
                  amount: '$450,000',
                  status: 'Negotiating',
                  priority: 'High'
                }
              ].map((offer) => (
                <Box key={offer.id} sx={{
                  display: 'grid',
                  gridTemplateColumns: '40px 150px 200px 150px 120px 120px 120px 100px 80px',
                  gap: 1,
                  p: 2,
                  borderBottom: '1px solid brandColors.neutral[300]',
                  alignItems: 'center',
                  '&:hover': { backgroundColor: brandColors.neutral[100] }
                }}>
                  <Box>
                    <input type="checkbox" />
                  </Box>
                  <Box sx={{ fontSize: '0.875rem' }}>{offer.date}</Box>
                  <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{offer.buyer}</Box>
                  <Box sx={{ fontSize: '0.875rem' }}>{offer.agent}</Box>
                  <Box sx={{ fontSize: '0.875rem', fontWeight: 600, color: brandColors.primary }}>{offer.amount}</Box>
                  <Box>
                    <Chip 
                      label={offer.status} 
                      size="small" 
                      sx={{ 
                        backgroundColor: offer.status === 'Pending' ? '#fff3cd' : 
                                       offer.status === 'Under Review' ? '#e3f2fd' : '#e8f5e8',
                        color: offer.status === 'Pending' ? '#856404' : 
                               offer.status === 'Under Review' ? brandColors.accent.infoDark : '#2e7d32',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Box>
                    <Chip 
                      label={offer.priority} 
                      size="small" 
                      sx={{ 
                        backgroundColor: offer.priority === 'High' ? '#ffebee' : '#fff3cd',
                        color: offer.priority === 'High' ? brandColors.accent.errorDark : '#856404',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Box>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}

      {reviewOffersTab === 'offer-review' && (
        <>
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
                <Box sx={{ display: 'flex', border: '1px solid brandColors.neutral[300]', borderRadius: '4px' }}>
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
                    sx={{ borderRadius: '0 4px 4px 0',
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
                      backgroundColor: index <= 2 ? brandColors.primary : brandColors.neutral[300],
                      color: brandColors.text.inverse,
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
                        backgroundColor: index < 2 ? brandColors.primary : brandColors.neutral[300],
                        ml: 0.5
                      }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Offer Review Content */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Offer Review & Analysis
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {/* Review Status */}
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Review Status
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                  In Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  3 offers pending review
                </Typography>
              </Box>
              
              {/* Review Priority */}
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Review Priority
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.accent.warning, fontWeight: 700 }}>
                  High
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Requires immediate attention
                </Typography>
              </Box>
              
              {/* Review Deadline */}
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Review Deadline
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.accent.error, fontWeight: 700 }}>
                  24h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Time remaining to respond
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Negotiation Tools & Communication */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Negotiation Tools & Communication
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {/* Create Counter-Offer */}
              <Box sx={{ p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Create Counter-Offer
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<EditIcon />}
                      sx={{ 
                        borderColor: brandColors.primary, 
                        color: brandColors.primary,
                        '&:hover': { 
                          borderColor: brandColors.secondary, 
                          backgroundColor: 'rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      Price Counter
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<EditIcon />}
                      sx={{ 
                        borderColor: brandColors.primary, 
                        color: brandColors.primary,
                        '&:hover': { 
                          borderColor: brandColors.secondary, 
                          backgroundColor: 'rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      Terms Counter
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Generate professional counter-offers with built-in templates
                  </Typography>
                </Box>
              </Box>

              {/* Communication Hub */}
              <Box sx={{ p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Communication Hub
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<ShareIcon />}
                      sx={{ 
                        borderColor: brandColors.primary, 
                        color: brandColors.primary,
                        '&:hover': { 
                          borderColor: brandColors.secondary, 
                          backgroundColor: 'rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      Message Agents
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<ScheduleIcon />}
                      sx={{ 
                        borderColor: brandColors.primary, 
                        color: brandColors.primary,
                        '&:hover': { 
                          borderColor: brandColors.secondary, 
                          backgroundColor: 'rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      Schedule Meeting
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Direct communication with buyer agents and clients
                  </Typography>
                </Box>
              </Box>

              {/* Document Sharing */}
              <Box sx={{ p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Document Sharing
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<DownloadIcon />}
                      sx={{ 
                        borderColor: brandColors.primary, 
                        color: brandColors.primary,
                        '&:hover': { 
                          borderColor: brandColors.secondary, 
                          backgroundColor: 'rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      Share Offers
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<DownloadIcon />}
                      sx={{ 
                        borderColor: brandColors.primary, 
                        color: brandColors.primary,
                        '&:hover': { 
                          borderColor: brandColors.secondary, 
                          backgroundColor: 'rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      Export Report
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Secure sharing and professional reporting
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Detailed Offer Review */}
          <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Detailed Offer Review
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
              {/* Offer Details */}
              <Box sx={{ p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Offer #OFF001 - John Smith
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Offer Amount:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>$445,000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Earnest Money:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>$10,000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Closing Date:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>45 days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Financing:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Conventional</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Review Actions */}
              <Box sx={{ p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                  Review Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      backgroundColor: brandColors.accent.success,
                      '&:hover': { backgroundColor: '#45a049' }
                    }}
                  >
                    Accept Offer
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ borderColor: brandColors.accent.warning, color: brandColors.accent.warning }}
                  >
                    Counter Offer
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ borderColor: brandColors.accent.error, color: brandColors.accent.error }}
                  >
                    Reject Offer
                  </Button>
                  <Button 
                    variant="text" 
                    fullWidth 
                    startIcon={<EditIcon />}
                  >
                    Request More Info
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Review Notes & Comments */}
          <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review Notes & Comments
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Add Review Notes"
                placeholder="Enter your review notes, concerns, or recommendations..."
                variant="outlined"
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined">Save Draft</Button>
                <Button variant="contained" sx={{ backgroundColor: brandColors.primary }}>
                  Submit Review
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {reviewOffersTab === 'compare' && (
        <>
          {/* Offer Comparison Interface */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
              Offer Comparison & Analysis
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Left Sidebar - Comparison Summary */}
              <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Comparison Overview */}
                <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: brandColors.primary }}>
                    You are comparing 4 offers
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<InfoIcon />}
                    sx={{ 
                      borderColor: brandColors.primary, 
                      color: brandColors.primary,
                      '&:hover': { 
                        borderColor: brandColors.secondary, 
                        backgroundColor: 'rgba(0,0,0,0.04)' 
                      }
                    }}
                  >
                    Fair Representation
                  </Button>
                </Paper>

                {/* Quick Stats */}
                <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Quick Stats
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Highest Offer:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.accent.info }}>$410,000</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Lowest Offer:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.accent.error }}>$385,000</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Avg Offer:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>$397,500</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Price Range:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>$25,000</Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Offer Scoring */}
                <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Offer Scoring
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: brandColors.accent.success
                      }} />
                      <Typography variant="body2">Offer #3</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.accent.success, ml: 'auto' }}>92</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: brandColors.accent.info
                      }} />
                      <Typography variant="body2">Offer #1</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.accent.info, ml: 'auto' }}>87</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: brandColors.accent.warning
                      }} />
                      <Typography variant="body2">Offer #2</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.accent.warning, ml: 'auto' }}>83</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: brandColors.accent.error
                      }} />
                      <Typography variant="body2">Offer #4</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.accent.error, ml: 'auto' }}>78</Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Comparison Criteria */}
                <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Comparison Criteria
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Buyers</Typography>
                      <Chip label="25%" size="small" sx={{ backgroundColor: brandColors.primary, color: brandColors.text.inverse }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Closing Date</Typography>
                      <Chip label="20%" size="small" sx={{ backgroundColor: brandColors.primary, color: brandColors.text.inverse }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Loan Type</Typography>
                      <Chip label="15%" size="small" sx={{ backgroundColor: brandColors.primary, color: brandColors.text.inverse }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Down Payment</Typography>
                      <Chip label="20%" size="small" sx={{ backgroundColor: brandColors.primary, color: brandColors.text.inverse }} />
                    </Box>
                  </Box>
                </Paper>
              </Box>

                                  {/* Main Content - 4 Offers Carousel */}
                    <Box sx={{ flex: 1 }}>
                      {/* Carousel Navigation */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Offer Comparison View
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={() => setCurrentOfferIndex(Math.max(0, currentOfferIndex - 1))}
                            disabled={currentOfferIndex === 0}
                            sx={{ color: brandColors.primary }}
                          >
                            <ArrowBackIcon />
                          </IconButton>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                            {currentOfferIndex + 1} of 4
                          </Typography>
                          <IconButton
                            onClick={() => setCurrentOfferIndex(Math.min(3, currentOfferIndex + 1))}
                            disabled={currentOfferIndex === 3}
                            sx={{ color: brandColors.primary }}
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* 4 Offers Side by Side */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
                        {offers.map((offer, index) => (
                          <Paper
                            key={offer.id}
                            elevation={currentOfferIndex === index ? 3 : 1}
                            sx={{
                              p: 2,
                              backgroundColor: currentOfferIndex === index ? 'white' : '#f8f9fa',
                              border: currentOfferIndex === index ? `2px solid ${brandColors.primary}` : '1px solid brandColors.neutral[300]',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                elevation: 2,
                                backgroundColor: 'white'
                              }
                            }}
                            onClick={() => setCurrentOfferIndex(index)}
                          >
                            {/* Offer Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                                ${offer.price.toLocaleString()}
                              </Typography>
                              <Chip
                                label={`Score: ${offer.score}`}
                                size="small"
                                sx={{
                                  backgroundColor: offer.score >= 90 ? brandColors.accent.success : 
                                                 offer.score >= 80 ? brandColors.accent.info : 
                                                 offer.score >= 70 ? brandColors.accent.warning : brandColors.accent.error,
                                  color: brandColors.text.inverse,
                                  fontWeight: 600
                                }}
                              />
                            </Box>

                            {/* Status & Agent */}
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={offer.status}
                                size="small"
                                sx={{
                                  backgroundColor: offer.status === 'ACTIVE' ? '#e3f2fd' : 
                                                 offer.status === 'PENDING' ? '#fff3cd' : '#fce4ec',
                                  color: offer.status === 'ACTIVE' ? brandColors.accent.infoDark : 
                                         offer.status === 'PENDING' ? '#856404' : '#c2185b',
                                  fontWeight: 600,
                                  mb: 1
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                                {offer.agent}
                              </Typography>
                            </Box>

                            {/* Key Terms */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Closing:</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{offer.closingDate}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Down:</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>${offer.downPayment.toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Loan:</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{offer.loanType}</Typography>
                              </Box>
                            </Box>

                            {/* Expand Indicator */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                {currentOfferIndex === index ? '✓ Selected' : 'Click to expand'}
                              </Typography>
                            </Box>
                          </Paper>
                        ))}
                      </Box>

                      {/* Expanded Offer Details */}
                      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: brandColors.primary }}>
                          Detailed View: {offers[currentOfferIndex].agent}'s Offer
                        </Typography>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Offer Price</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                              offers[currentOfferIndex].price.toLocaleString()
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Net Amount</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              offers[currentOfferIndex].netAmount.toLocaleString()
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Commission</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.accent.success }}>
                              offers[currentOfferIndex].commission.toLocaleString()
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Score</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                              {offers[currentOfferIndex].score}/100
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Closing Date</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{offers[currentOfferIndex].closingDate}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Loan Type</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{offers[currentOfferIndex].loanType}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Down Payment</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>${offers[currentOfferIndex].downPayment.toLocaleString()}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Finance Type</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{offers[currentOfferIndex].financeType}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Initial Deposit</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>${offers[currentOfferIndex].initialDeposit.toLocaleString()}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Days on Market</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{offers[currentOfferIndex].daysOnMarket}</Typography>
                          </Box>
                        </Box>

                        {/* Contingency Status */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Contingency Status
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {offers[currentOfferIndex].contingencies.map((contingency, idx) => (
                              <Chip
                                key={idx}
                                label={contingency}
                                size="small"
                                sx={{
                                  backgroundColor: contingency.includes('Waived') ? '#e8f5e8' : 
                                                 contingency.includes('Required') ? '#fff3cd' : '#fce4ec',
                                  color: contingency.includes('Waived') ? '#2e7d32' : 
                                         contingency.includes('Required') ? '#856404' : '#c2185b',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                          <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            sx={{
                              backgroundColor: brandColors.accent.success,
                              '&:hover': { backgroundColor: '#45a049' }
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            sx={{
                              borderColor: brandColors.accent.warning,
                              color: brandColors.accent.warning,
                              '&:hover': {
                                borderColor: brandColors.accent.warningDark,
                                backgroundColor: 'rgba(255,152,0,0.04)'
                              }
                            }}
                          >
                            Counter
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<NoteAddIcon />}
                          >
                            Notes
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<ShareIcon />}
                          >
                            Share
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={() => setSendOffersModalOpen(true)}
                            sx={{
                              backgroundColor: brandColors.primary,
                              '&:hover': { backgroundColor: brandColors.secondary }
                            }}
                          >
                            Send to Sellers
                          </Button>
                        </Box>

                        {/* Notes & Attachments */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                              Notes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {offers[currentOfferIndex].notes}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                              Attachments
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {offers[currentOfferIndex].attachments.map((attachment, idx) => (
                                <Button
                                  key={idx}
                                  variant="text"
                                  size="small"
                                  startIcon={<DescriptionIcon />}
                                  sx={{ justifyContent: 'flex-start', p: 0 }}
                                >
                                  {attachment}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
            </Box>
          </Paper>
        </>
      )}

      {/* Send Offers Modal */}
      <Modal
        open={sendOffersModalOpen}
        onClose={() => setSendOffersModalOpen(false)}
        aria-labelledby="send-offers-modal-title"
        aria-describedby="send-offers-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: 600, md: 700 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          overflow: 'hidden'
        }}>
          {/* Modal Header */}
          <Box sx={{
            p: 3,
            backgroundColor: brandColors.primary,
            color: brandColors.text.inverse,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Share offers with Sellers
            </Typography>
            <IconButton
              onClick={() => setSendOffersModalOpen(false)}
              sx={{ color: brandColors.text.inverse }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 3, maxHeight: 'calc(90vh - 140px)', overflow: 'auto' }}>
            {/* Description */}
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Send an email to your recipients with a link to easily compare offers from their browser. 
              Along with your selected offers, all offers will be visible to Sellers.
              <Button
                variant="text"
                size="small"
                sx={{ ml: 1, color: brandColors.primary, textDecoration: 'underline' }}
              >
                Preview
              </Button>
            </Typography>

            {/* Recipients Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Recipients
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    To
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40, p: 1, border: '1px solid brandColors.neutral[300]', borderRadius: 1 }}>
                    {recipients.map((email, index) => (
                      <Chip
                        key={index}
                        label={email}
                        onDelete={() => setRecipients(prev => prev.filter((_, i) => i !== index))}
                        sx={{ backgroundColor: '#e3f2fd', color: brandColors.accent.infoDark }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="text" size="small" sx={{ color: brandColors.primary }}>
                    Bcc
                  </Button>
                  <Button variant="text" size="small" sx={{ color: brandColors.primary }}>
                    Cc
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Custom Message Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Custom Message - optional
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your message here..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
            </Box>

            {/* Sharing Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Sharing Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attachCSV}
                      onChange={(e) => setAttachCSV(e.target.checked)}
                    />
                  }
                  label="Attach CSV of all offers to email"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hideBuyerInfo}
                      onChange={(e) => setHideBuyerInfo(e.target.checked)}
                    />
                  }
                  label="Hide Buyer information (default)"
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                  Reduce bias by hiding buyer names and offer documents when sharing.
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setSendOffersModalOpen(false)}
                sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  // Handle sending offers
                  console.log('Sending offers:', { selectedOffers, recipients, customMessage, attachCSV, hideBuyerInfo });
                  setSendOffersModalOpen(false);
                }}
                sx={{ backgroundColor: brandColors.primary }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
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
        color: brandColors.text.inverse
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <DescriptionIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
        <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
            <Box sx={{ display: 'flex', border: '1px solid brandColors.neutral[300]', borderRadius: '4px' }}>
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
          <Typography variant="h4" sx={{ color: brandColors.accent.warningDark, fontWeight: 700 }}>18</Typography>
          <Typography variant="subtitle1" color="text.secondary">Pending Review</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
          <Typography variant="h4" sx={{ color: brandColors.accent.successDark, fontWeight: 700 }}>12</Typography>
          <Typography variant="subtitle1" color="text.secondary">Approved Today</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
          <Typography variant="h4" sx={{ color: brandColors.accent.infoDark, fontWeight: 700 }}>6</Typography>
          <Typography variant="subtitle1" color="text.secondary">Rejected Today</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fce4ec' }}>
          <Typography variant="h4" sx={{ color: '#c2185b', fontWeight: 700 }}>4</Typography>
          <Typography variant="subtitle1" color="text.secondary">Overdue Reviews</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: brandColors.backgrounds.selected }}>
          <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>8</Typography>
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
                  backgroundColor: brandColors.neutral[100],
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
                    border: '1px solid brandColors.neutral[300]',
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
                    border: '1px solid brandColors.accent.info',
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
                    backgroundColor: brandColors.neutral[100],
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
                      backgroundColor: brandColors.neutral[100],
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
                    border: '1px solid brandColors.neutral[400]', 
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
              backgroundColor: brandColors.neutral[100],
              borderRadius: '8px',
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Page</Typography>
                  <select 
                    style={{ 
                      padding: '4px 8px', 
                      border: '1px solid brandColors.neutral[400]', 
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
              border: '1px solid brandColors.neutral[300]',
              borderRadius: '8px',
              p: { xs: 2, md: 4 },
              height: '600px',
              overflow: 'auto'
            }}>
              {/* Document Content */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: brandColors.primary,
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
                  backgroundColor: brandColors.neutral[300], 
                  borderRadius: '4px', 
                  mb: 2 
                }} />
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: brandColors.neutral[300], 
                  borderRadius: '4px', 
                  mb: 2,
                  width: '80%' 
                }} />
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: brandColors.neutral[300], 
                  borderRadius: '4px', 
                  mb: 2,
                  width: '60%' 
                }} />
                <Box sx={{ 
                  height: '20px', 
                  backgroundColor: brandColors.neutral[300], 
                  borderRadius: '4px', 
                  mb: 2,
                  width: '90%' 
                }} />
              </Box>

              {/* Signature Area */}
              <Box sx={{ 
                border: '2px dashed brandColors.neutral[400]', 
                borderRadius: '8px', 
                p: 4, 
                textAlign: 'center',
                backgroundColor: brandColors.neutral[50],
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
                    backgroundColor: brandColors.accent.success,
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
                    backgroundColor: brandColors.accent.error,
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

                {state.activeTab === 'payments-finance' && (
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
                <AccountBalanceIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Payments & Finance
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Professional payment processing, commission management, and financial reporting
              </Typography>
            </Paper>

            {/* Professional Payment & Finance Interface */}
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Tab Navigation */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[
                      { value: 'dashboard', label: 'DASHBOARD', icon: <AssessmentIcon /> },
                      { value: 'payments', label: 'PAYMENTS', icon: <PaymentIcon /> },
                      { value: 'invoices', label: 'INVOICES', icon: <ReceiptLongIcon /> }
                    ].map((tab) => (
                      <Button
                        key={tab.value}
                        onClick={() => setFinanceTab(tab.value)}
                        variant={financeTab === tab.value ? 'contained' : 'text'}
                        startIcon={tab.icon}
                        sx={{
                          borderRadius: 0,
                          borderBottom: financeTab === tab.value ? 2 : 0,
                          borderColor: brandColors.primary,
                          backgroundColor: financeTab === tab.value ? brandColors.primary : 'transparent',
                          color: financeTab === tab.value ? 'white' : 'text.primary',
                          '&:hover': {
                            backgroundColor: financeTab === tab.value ? brandColors.secondary : 'rgba(0,0,0,0.04)'
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
              {financeTab === 'dashboard' && (
                <>
                  {/* Financial Overview Dashboard */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Financial Overview
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                      {/* Total Commissions */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <MonetizationOnIcon sx={{ fontSize: 40, color: brandColors.primary, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.primary }}>
                          $24,850
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Commissions
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          +12% this month
                        </Typography>
                      </Box>
                      
                      {/* Pending Payments */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          $8,420
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Payments
                        </Typography>
                        <Typography variant="caption" color="warning.main">
                          3 transactions
                        </Typography>
                      </Box>
                      
                      {/* Monthly Revenue */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          $16,430
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Revenue
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          +8% vs last month
                        </Typography>
                      </Box>
                      
                      {/* Processing Speed */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <SpeedIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                          2.4 days
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Payment Time
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          Industry leading
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Business Intelligence & Reports */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Business Intelligence & Reports
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      {/* Sales Performance */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Sales Performance
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                            $24,850
                          </Typography>
                          <Chip label="+12%" color="success" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Total sales this month
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" startIcon={<TrendingUpIcon />}>
                            View Details
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                            Generate Report
                          </Button>
                        </Box>
                      </Box>

                      {/* Payment Analytics */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Payment Analytics
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 700 }}>
                            87%
                          </Typography>
                          <Chip label="+5%" color="success" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          On-time payment rate
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                            View Analytics
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                            Export Data
                          </Button>
                        </Box>
                      </Box>

                      {/* Cash Flow Overview */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Cash Flow Overview
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 700 }}>
                            $16,430
                          </Typography>
                          <Chip label="+8%" color="success" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Net cash flow this month
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" startIcon={<TrendingUpIcon />}>
                            View Cash Flow
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                            Forecast
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Financial Reports */}
                  <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Financial Reports
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      {/* Commission Reports */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Commission Reports
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                            Generate Report
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                            Export to Excel
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Detailed commission tracking and analysis
                        </Typography>
                      </Box>
                      
                      {/* Revenue Analytics */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Revenue Analytics
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<TrendingUpIcon />}>
                            View Trends
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                            Performance Metrics
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Revenue growth and performance analysis
                        </Typography>
                      </Box>
                      
                      {/* Tax Reports */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Tax Reports
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<ReceiptLongIcon />}>
                            Generate Tax Report
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                            Export for Tax Filing
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Tax preparation and reporting tools
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}

              {financeTab === 'payments' && (
                <>
                  {/* Payment Processing Center */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Payment Processing Center
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      {/* Commission Payments */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Commission Payments
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<PaymentIcon />}>
                            Process Commission
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<ReceiptLongIcon />}>
                            View Commission History
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Handle agent commission payments and tracking
                        </Typography>
                      </Box>
                      
                      {/* Client Payments */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Client Payments
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<CreditCardIcon />}>
                            Process Client Payment
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<ReceiptLongIcon />}>
                            View Payment History
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Manage deposits, closing costs, and fees
                        </Typography>
                      </Box>
                      
                      {/* Escrow Management */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Escrow Management
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<SecurityIcon />}>
                            Manage Escrow
                          </Button>
                          <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                            Escrow Reports
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Secure escrow account management and reporting
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Payment Methods & Integration */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Payment Methods & Integration
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      {/* Direct Deposit */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Direct Deposit
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: brandColors.accent.success }} />
                          <Typography variant="caption">Connected</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Send payments directly to bank accounts
                        </Typography>
                      </Box>
                      
                      {/* Financial Transfer */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Financial Transfer
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: brandColors.accent.success }} />
                          <Typography variant="caption">Connected</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Secure wire transfers and ACH payments
                        </Typography>
                      </Box>
                      
                      {/* Credit Card Processing */}
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Credit Card Processing
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: brandColors.accent.warning }} />
                          <Typography variant="caption">Pending</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Accept credit card payments from clients
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Recent Transactions */}
                  <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Recent Transactions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        {
                          id: 'TXN001',
                          type: 'Commission Payment',
                          amount: '$2,400',
                          status: 'Completed',
                          date: '2024-01-15',
                          property: '123 Main St, Anytown, USA',
                          client: 'John Smith'
                        },
                        {
                          id: 'TXN002',
                          type: 'Client Deposit',
                          amount: '$15,000',
                          status: 'Pending',
                          date: '2024-01-14',
                          property: '456 Oak Ave, Somewhere, USA',
                          client: 'Sarah Johnson'
                        },
                        {
                          id: 'TXN003',
                          type: 'Closing Cost',
                          amount: '$8,500',
                          status: 'Completed',
                          date: '2024-01-13',
                          property: '789 Pine Rd, Elsewhere, USA',
                          client: 'Mike Chen'
                        },
                        {
                          id: 'TXN004',
                          type: 'Commission Payment',
                          amount: '$3,200',
                          status: 'Processing',
                          date: '2024-01-12',
                          property: '321 Elm Dr, Nowhere, USA',
                          client: 'Lisa Rodriguez'
                        }
                      ].map((transaction) => (
                        <Box key={transaction.id} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2, 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: 1 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: 
                                transaction.status === 'Completed' ? brandColors.accent.success :
                                transaction.status === 'Pending' ? brandColors.accent.warning :
                                transaction.status === 'Processing' ? brandColors.accent.info : brandColors.neutral[500],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: brandColors.text.inverse,
                              fontSize: '12px',
                              fontWeight: 600
                            }}>
                              {transaction.status === 'Completed' ? '✓' :
                               transaction.status === 'Pending' ? '⏳' :
                               transaction.status === 'Processing' ? '⚡' : '?'}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {transaction.type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {transaction.property} • {transaction.client}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
                              {transaction.amount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.date}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </>
              )}

              {financeTab === 'invoices' && (
                <>
                  {/* Enhanced Invoice Management System */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Invoice Management
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        sx={{ 
                          backgroundColor: brandColors.primary, 
                          color: brandColors.text.inverse,
                          '&:hover': { backgroundColor: brandColors.secondary }
                        }}
                      >
                        + Create Invoice
                      </Button>
                    </Box>

                    {/* Invoice Filters & Search */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                      <TextField
                        size="small"
                        label="Date From"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150 }}
                      />
                      <TextField
                        size="small"
                        label="Date To"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150 }}
                      />
                      <TextField
                        size="small"
                        label="Customer Name"
                        placeholder="Search customers..."
                        sx={{ minWidth: 200 }}
                      />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select label="Filter">
                          <MenuItem value="all">All Invoices</MenuItem>
                          <MenuItem value="overdue">Overdue</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Invoice Table */}
                    <Box sx={{ overflowX: 'auto' }}>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '40px 120px 100px 200px 150px 100px 120px 120px 120px 120px 80px',
                        gap: 1,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1,
                        mb: 2,
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        <Box>✓</Box>
                        <Box>Invoice Date</Box>
                        <Box>Invoice#</Box>
                        <Box>Customer</Box>
                        <Box>Reference</Box>
                        <Box>Status</Box>
                        <Box>Due Date</Box>
                        <Box>Payment Status</Box>
                        <Box>Total Amount</Box>
                        <Box>Balance</Box>
                        <Box>Action</Box>
                      </Box>

                      {/* Invoice Rows */}
                      {[
                        {
                          id: 'INV001',
                          date: '2024-01-15',
                          number: 'INV-001',
                          customer: 'Jaxon Garcia',
                          reference: 'Property Sale',
                          status: 'Overdue',
                          dueDate: '2024-01-10',
                          paymentStatus: 'Pending',
                          totalAmount: '$2,400.00',
                          balance: '$2,400.00'
                        },
                        {
                          id: 'INV002',
                          date: '2024-01-14',
                          number: 'INV-002',
                          customer: 'Shelby Block',
                          reference: 'Commission',
                          status: 'Overdue',
                          dueDate: '2024-01-09',
                          paymentStatus: 'Unpaid',
                          totalAmount: '$1,800.00',
                          balance: '$1,800.00'
                        },
                        {
                          id: 'INV003',
                          date: '2024-01-13',
                          number: 'INV-003',
                          customer: 'Presley Garcia',
                          reference: 'Closing Services',
                          status: 'Overdue',
                          dueDate: '2024-01-08',
                          paymentStatus: 'Pending',
                          totalAmount: '$3,200.00',
                          balance: '$3,200.00'
                        },
                        {
                          id: 'INV004',
                          date: '2024-01-12',
                          number: 'INV-004',
                          customer: 'Jon Smith',
                          reference: 'Property Management',
                          status: 'Overdue',
                          dueDate: '2024-01-07',
                          paymentStatus: 'Unpaid',
                          totalAmount: '$950.00',
                          balance: '$950.00'
                        },
                        {
                          id: 'INV005',
                          date: '2024-01-11',
                          number: 'INV-005',
                          customer: 'Rochelle Garcia',
                          reference: 'Listing Services',
                          status: 'Overdue',
                          dueDate: '2024-01-06',
                          paymentStatus: 'Pending',
                          totalAmount: '$1,500.00',
                          balance: '$1,500.00'
                        },
                        {
                          id: 'INV006',
                          date: '2024-01-10',
                          number: 'INV-006',
                          customer: 'Jesse Garcia',
                          reference: 'Commission',
                          status: 'Paid',
                          dueDate: '2024-01-05',
                          paymentStatus: 'Paid',
                          totalAmount: '$2,100.00',
                          balance: '$0.00'
                        },
                        {
                          id: 'INV007',
                          date: '2024-01-09',
                          number: 'INV-007',
                          customer: 'Axe Cap Title Company',
                          reference: 'Title Services',
                          status: 'Paid',
                          dueDate: '2024-01-04',
                          paymentStatus: 'Paid',
                          totalAmount: '$850.00',
                          balance: '$0.00'
                        },
                        {
                          id: 'INV008',
                          date: '2024-01-08',
                          number: 'INV-008',
                          customer: 'Shelby Zip',
                          reference: 'Property Sale',
                          status: 'Paid',
                          dueDate: '2024-01-03',
                          paymentStatus: 'Paid',
                          totalAmount: '$3,600.00',
                          balance: '$0.00'
                        }
                      ].map((invoice) => (
                        <Box key={invoice.id} sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '40px 120px 100px 200px 150px 100px 120px 120px 120px 120px 80px',
                          gap: 1,
                          p: 2,
                          borderBottom: '1px solid brandColors.neutral[300]',
                          alignItems: 'center',
                          '&:hover': { backgroundColor: brandColors.neutral[100] }
                        }}>
                          <Box>
                            <input type="checkbox" />
                          </Box>
                          <Box sx={{ fontSize: '0.875rem' }}>{invoice.date}</Box>
                          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{invoice.number}</Box>
                          <Box sx={{ fontSize: '0.875rem' }}>{invoice.customer}</Box>
                          <Box sx={{ fontSize: '0.875rem' }}>{invoice.reference}</Box>
                          <Box>
                            <Chip 
                              label={invoice.status} 
                              size="small" 
                              sx={{ 
                                backgroundColor: invoice.status === 'Overdue' ? '#ffebee' : '#e8f5e8',
                                color: invoice.status === 'Overdue' ? brandColors.accent.errorDark : '#2e7d32',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Box sx={{ fontSize: '0.875rem' }}>{invoice.dueDate}</Box>
                          <Box>
                            <Chip 
                              label={invoice.paymentStatus} 
                              size="small" 
                              sx={{ 
                                backgroundColor: invoice.paymentStatus === 'Paid' ? '#e8f5e8' : 
                                               invoice.paymentStatus === 'Pending' ? '#fff3cd' : '#ffebee',
                                color: invoice.paymentStatus === 'Paid' ? '#2e7d32' : 
                                       invoice.paymentStatus === 'Pending' ? '#856404' : brandColors.accent.errorDark,
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Box sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{invoice.totalAmount}</Box>
                          <Box sx={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 600,
                            color: invoice.balance === '$0.00' ? '#2e7d32' : brandColors.accent.errorDark
                          }}>
                            {invoice.balance}
                          </Box>
                          <Box>
                            <IconButton size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </>
              )}

              {financeTab === 'sales' && (
                <>
                  {/* Sales Management */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Sales Management
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AttachMoneyIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          $45,200
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Sales This Month
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                          12
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Transactions Completed
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          $3,450
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Commission
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Sales Sub-sections */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Invoices Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Invoices
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          + Create Invoice
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            8
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active Invoices
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            $12,800
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Outstanding Amount
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.error }}>
                            2
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Overdue
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Payments Received Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Payments Received
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<PaymentIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          Record Payment
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                            $32,400
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Received
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            15
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Payments This Month
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            2.1 days
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Avg Processing Time
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Credit Notes Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Credit Notes
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<NoteAddIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          + Create Credit Note
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            3
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active Credit Notes
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            $2,150
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Credit Amount
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                            1
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Applied This Month
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </>
              )}

              {financeTab === 'purchases' && (
                <>
                  {/* Purchases Management */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Purchases & Expenses
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <ReceiptIcon sx={{ fontSize: 40, color: brandColors.accent.error, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.error }}>
                          $8,750
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Expenses
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <WarningIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          5
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Bills
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <CheckCircleIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          $2,300
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Payments Made
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Purchases Sub-sections */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Bills Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Bills
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          + Add Bill
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            5
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pending Bills
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.error }}>
                            $3,200
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Due
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            2
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Overdue
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Expenses Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Expenses
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          + Record Expense
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.error, mb: 1 }}>
                            $8,750
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Expenses
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            18
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Categories
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            $486
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Average
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Payments Made Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Payments Made
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<PaymentIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          Record Payment
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                            $2,300
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Paid
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            12
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Payments This Month
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            $192
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average Payment
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Vendor Credits Section */}
                    <Paper elevation={1} sx={{ p: 3, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Vendor Credits
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<NoteAddIcon />}
                          sx={{ 
                            borderColor: brandColors.primary, 
                            color: brandColors.primary,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          + Add Credit
                        </Button>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                            $850
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Credits
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                            4
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active Credits
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                            $212
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average Credit
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </>
              )}

              {financeTab === 'lending' && (
                <>
                  {/* Lending Management */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Lending & Financing
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                          $125,000
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Loans
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          3.2%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Interest Rate
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          15
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Years Average Term
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}

              {financeTab === 'escrow' && (
                <>
                  {/* Escrow Deposit Management */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Escrow Deposit Management
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <SecurityIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                          $89,500
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Escrow Funds
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          8
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Escrow Accounts
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <WarningIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          $12,300
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Deposits
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}

              {financeTab === 'banking' && (
                <>
                  {/* Banking Management */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Banking & Accounts
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          $156,800
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Account Balance
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                          $23,450
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Deposits
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          $8,900
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Withdrawals
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}

              {financeTab === 'reports' && (
                <Box sx={{ p: 3, backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 180px)' }}>
                  {/* Header for Reports */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Button
                      variant="text"
                      endIcon={<ExpandMoreIcon />}
                      sx={{
                        color: 'text.primary',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        '& .MuiButton-endIcon': { ml: 0.5 }
                      }}
                    >
                      All Reports
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: brandColors.primary,
                        '&:hover': { backgroundColor: brandColors.secondary }
                      }}
                    >
                      Create Report
                    </Button>
                  </Box>

                  {/* Reports Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                    {/* Report Card 1: N. Cal Income Statement */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          N. Cal Income Statement
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: Income Statement <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Report Card 2: Kylee Report */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Kylee Report
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: Summary <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Report Card 3: Lathan Performance */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Lathan Performance
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: Agent-Performance <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Report Card 4: Jesse Performance */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Jesse Performance
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: Agent-Performance <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Report Card 5: Summary Transactions */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Summary Transactions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: Summary <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Report Card 6: General Ledger YTD */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          General Ledger YTD
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: General Ledger <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>

                    {/* Report Card 7: 2022 Income statement */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          2022 Income statement
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Type: Income Statement <DescriptionIcon sx={{ fontSize: 16 }} />
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="text" sx={{ color: brandColors.primary }}>
                          Edit Report
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              )}

              {financeTab === 'company' && (
                <>
                  {/* Company Management */}
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Company & Business Management
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.info }}>
                          Dreamery Real Estate
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Company Name
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.success }}>
                          $2.4M
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Company Valuation
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                        <PeopleIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.accent.warning }}>
                          24
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Agents
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}


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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AssignmentTurnedInIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                    { name: 'Starter Agent', count: 1, color: brandColors.accent.success },
                    { name: 'State-Specific', count: 2, color: brandColors.accent.info },
                    { name: 'MPE Forms', count: 1, color: brandColors.accent.warning },
                    { name: 'Special Cases', count: 1, color: brandColors.accent.info },
                    { name: 'Condo', count: 1, color: brandColors.accent.error },
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
                        border: '1px solid brandColors.neutral[300]'
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ChecklistIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TaskIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EditIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  Digital Signature
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Sign documents electronically with secure digital signatures
              </Typography>
            </Paper>
            <Box sx={{ pl: 0, ml: 3 }}>
              {/* Tab Navigation */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[
                      { value: 'dashboard', label: 'DASHBOARD', icon: <AssessmentIcon /> },
                      { value: 'document-setup', label: 'DOCUMENT SETUP', icon: <EditIcon /> },
                      { value: 'envelopes', label: 'ENVELOPES', icon: <DescriptionIcon /> },
                      { value: 'templates', label: 'TEMPLATES', icon: <AssignmentTurnedInIcon /> },
                      { value: 'signatures', label: 'SIGNATURES', icon: <CheckCircleIcon /> }
                    ].map((tab) => (
                      <Button
                        key={tab.value}
                        onClick={() => setDigitalSignatureTab(tab.value)}
                        variant={digitalSignatureTab === tab.value ? 'contained' : 'text'}
                        startIcon={tab.icon}
                        sx={{
                          borderRadius: 0,
                          borderBottom: digitalSignatureTab === tab.value ? 2 : 0,
                          borderColor: brandColors.primary,
                          backgroundColor: digitalSignatureTab === tab.value ? brandColors.primary : 'transparent',
                          color: digitalSignatureTab === tab.value ? 'white' : 'text.primary',
                          '&:hover': {
                            backgroundColor: digitalSignatureTab === tab.value ? brandColors.secondary : 'rgba(0,0,0,0.04)'
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
              {digitalSignatureTab === 'dashboard' && (
                <>
                  {/* Professional Document Management & E-Signature Interface */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                    {/* Left Sidebar - Features & Security */}
                    <Paper elevation={2} sx={{ p: 3, width: 280, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                    Dreamery D-Sign
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Robust Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      360° summary of all your envelopes
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Easy Form Prep
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prepare forms to send for signature
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1, border: '2px solid brandColors.accent.success' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#2e7d32' }}>
                      Highly Secure
                    </Typography>
                                          <Typography variant="body2" color="#2e7d32">
                    Dreamery D-Sign adheres to the most stringent security standards
                  </Typography>
                </Box>
                
                <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: brandColors.primary, 
                        color: brandColors.text.inverse,
                        width: '100%',
                        '&:hover': { backgroundColor: brandColors.secondary }
                      }}
                    >
                      Request Demo
                    </Button>
                </Paper>

                {/* Main Content - Document Viewer */}
                <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
                  {/* Top Bar */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid brandColors.neutral[300]' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                        DREAMERY D-SIGN
                      </Typography>
                      <Chip label="Doc 1/1: purchase_agreement_2_.pdf" size="small" />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Page 1/5
                      </Typography>
                      <Chip 
                        label="DigiSign Verified" 
                        size="small" 
                        sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small">
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>
                          150%
                        </Typography>
                        <IconButton size="small">
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Button 
                        variant="contained" 
                        sx={{ 
                          backgroundColor: brandColors.primary, 
                          color: brandColors.text.inverse,
                          '&:hover': { backgroundColor: brandColors.secondary }
                        }}
                      >
                        Start
                      </Button>
                    </Box>
                  </Box>

                  {/* Document Content */}
                  <Box sx={{ 
                    border: '2px solid brandColors.neutral[300]', 
                    borderRadius: 2, 
                    p: 4, 
                    backgroundColor: brandColors.neutral[50],
                    minHeight: 600,
                    position: 'relative'
                  }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontWeight: 700, color: '#1a1a1a' }}>
                      PURCHASE AGREEMENT
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      textAlign: 'center', 
                      mb: 4, 
                      p: 2, 
                      backgroundColor: '#fff3cd', 
                      border: '1px solid #ffeaa7',
                      borderRadius: 1,
                      color: '#856404'
                    }}>
                      THIS IS A LEGALLY BINDING CONTRACT BETWEEN PURCHASER AND SELLER. IF YOU DO NOT UNDERSTAND IT, SEEK LEGAL ADVICE.
                    </Typography>

                    {/* Document Sections */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                        1. PARTIES TO CONTRACT - PROPERTY
                      </Typography>
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Broker" 
                            variant="outlined" 
                            size="small"
                            placeholder="Enter broker name"
                          />
                        </Box>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Purchaser" 
                            variant="outlined" 
                            size="small"
                            placeholder="Enter purchaser name"
                          />
                        </Box>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Seller" 
                            variant="outlined" 
                            size="small"
                            placeholder="Enter seller name"
                          />
                        </Box>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Property Description" 
                            variant="outlined" 
                            size="small"
                            placeholder="Enter property details"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                        2. EARNEST MONEY DEPOSIT
                      </Typography>
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Amount" 
                            variant="outlined" 
                            size="small"
                            placeholder="$0.00"
                          />
                        </Box>
                        <Box>
                          <FormControl fullWidth size="small">
                            <InputLabel>Payment Type</InputLabel>
                            <Select label="Payment Type">
                              <MenuItem value="cash">Cash</MenuItem>
                              <MenuItem value="check">Check</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Broker Details" 
                            variant="outlined" 
                            size="small"
                            placeholder="Enter broker details"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                        3. PURCHASE PRICE
                      </Typography>
                      <TextField 
                        fullWidth 
                        label="Total Purchase Price" 
                        variant="outlined" 
                        size="small"
                        placeholder="$0.00"
                        sx={{ maxWidth: 300 }}
                      />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                        4. FINANCING
                      </Typography>
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                          <FormControl fullWidth size="small">
                            <InputLabel>Loan Type</InputLabel>
                            <Select label="Loan Type">
                              <MenuItem value="va">VA</MenuItem>
                              <MenuItem value="fha">FHA</MenuItem>
                              <MenuItem value="sdhda">SDHDA</MenuItem>
                              <MenuItem value="conventional">Conventional</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box>
                          <TextField 
                            fullWidth 
                            label="Delivery Date" 
                            variant="outlined" 
                            size="small"
                            placeholder="MM/DD/YYYY"
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Signature Fields Placeholder */}
                    <Box sx={{ 
                      mt: 4, 
                      p: 3, 
                      backgroundColor: '#e3f2fd', 
                      border: '2px dashed brandColors.accent.info',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: brandColors.accent.infoDark, mb: 1 }}>
                        Digital Signature Fields
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click "Start" to begin the digital signature process
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* Additional Features */}
              <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                {/* Envelope Management */}
                <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Envelope Management
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 700 }}>12</Typography>
                        <Typography variant="body2" color="text.secondary">Active Envelopes</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.warning, fontWeight: 700 }}>5</Typography>
                        <Typography variant="body2" color="text.secondary">Pending Signatures</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 700 }}>28</Typography>
                        <Typography variant="body2" color="text.secondary">Completed This Month</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Recent Activity */}
                <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Recent Activity
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {[
                      { action: 'Document signed', client: 'John Smith', time: '2 hours ago', status: 'completed' },
                      { action: 'Envelope sent', client: 'Sarah Johnson', time: '4 hours ago', status: 'pending' },
                      { action: 'Document viewed', client: 'Mike Wilson', time: '6 hours ago', status: 'viewed' },
                      { action: 'Signature completed', client: 'Lisa Brown', time: '1 day ago', status: 'completed' }
                    ].map((activity, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        py: 1,
                        borderBottom: index < 3 ? '1px solid brandColors.neutral[100]' : 'none'
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.client} • {activity.time}
                          </Typography>
                        </Box>
                        <Chip 
                          label={activity.status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: activity.status === 'completed' ? '#e8f5e8' : 
                                           activity.status === 'pending' ? '#fff3cd' : '#e3f2fd',
                            color: activity.status === 'completed' ? '#2e7d32' : 
                                   activity.status === 'pending' ? '#856404' : brandColors.accent.infoDark
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
                </>
              )}

              {digitalSignatureTab === 'document-setup' && (
                <>
                  {/* D-Sign Document Setup Flow */}
                  <Box sx={{ mb: 4 }}>


                    {/* Step 1: Select Property */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: brandColors.text.inverse,
                          fontWeight: 600
                        }}>
                          1
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Select a Property
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Enter the address of the property or choose an existing property from your Dreamery account.
                      </Typography>
                      
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                          <TextField
                            fullWidth
                            label="Property Address"
                            variant="outlined"
                            placeholder="Enter street address"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            label="City"
                            variant="outlined"
                            placeholder="City"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            label="State"
                            variant="outlined"
                            placeholder="State"
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<SearchIcon />}
                          sx={{ mr: 2 }}
                        >
                          Search Existing Properties
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<BusinessIcon />}
                        >
                          Browse Dreamery Properties
                        </Button>
                      </Box>
                    </Paper>

                    {/* Step 2: Add Recipients and Prepare Form */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: brandColors.text.inverse,
                          fontWeight: 600
                        }}>
                          2
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Add Recipients and Prepare Form
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Add people who need to sign. Then place signature and date fields, add checkboxes, and text blocks.
                      </Typography>
                      
                      {/* Recipients Section */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Recipients
                        </Typography>
                        <Box sx={{ display: 'grid', gap: 2 }}>
                          <Box>
                            <TextField
                              fullWidth
                              label="First Name"
                              variant="outlined"
                              placeholder="Enter first name"
                              size="small"
                            />
                          </Box>
                          <Box>
                            <TextField
                              fullWidth
                              label="Last Name"
                              variant="outlined"
                              placeholder="Enter last name"
                              size="small"
                            />
                          </Box>
                          <Box>
                            <TextField
                              fullWidth
                              label="Email"
                              variant="outlined"
                              placeholder="Enter email address"
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          sx={{ mt: 2 }}
                        >
                          + Add Another Recipient
                        </Button>
                      </Box>

                      {/* Form Fields Section */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Form Fields
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CreateIcon />}
                            sx={{ minWidth: 100 }}
                          >
                            Signature
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<TextFieldsIcon />}
                            sx={{ minWidth: 100 }}
                          >
                            Initials
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EventIcon />}
                            sx={{ minWidth: 100 }}
                          >
                            Date
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CheckBoxIcon />}
                            sx={{ minWidth: 100 }}
                          >
                            Checkbox
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<InputIcon />}
                            sx={{ minWidth: 100 }}
                          >
                            Text Field
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Click on a field type, then click on the document where you want to place it.
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Step 3: Personalized Note */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          backgroundColor: brandColors.primary, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: brandColors.text.inverse,
                          fontWeight: 600
                        }}>
                          3
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Make a Personalized Note
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Write a custom message for your client. Include any details you might want to point out.
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Personal Message"
                        variant="outlined"
                        placeholder="Enter your personalized message to the client..."
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                        >
                          Preview Message
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyIcon />}
                        >
                          Use Template
                        </Button>
                      </Box>
                    </Paper>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                      >
                        Previous Step
                      </Button>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<SaveIcon />}
                        >
                          Save Draft
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<SendIcon />}
                          sx={{
                            backgroundColor: brandColors.primary,
                            '&:hover': { backgroundColor: brandColors.secondary }
                          }}
                        >
                          Send for Signature
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Document Editor Interface */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 4, mt: 4 }}>
                    {/* Left Sidebar - Block Actions & Properties */}
                    <Paper elevation={2} sx={{ p: 3, width: 280, height: 'fit-content' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        Block Actions
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<ContentCopyIcon />}
                          sx={{ mb: 1, justifyContent: 'flex-start' }}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<ContentPasteIcon />}
                          sx={{ mb: 1, justifyContent: 'flex-start' }}
                        >
                          Paste
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<DeleteIcon />}
                          sx={{ justifyContent: 'flex-start' }}
                          color="error"
                        >
                          Delete
                        </Button>
                      </Box>

                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        Properties
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Optional Field"
                        />
                      </Box>
                    </Paper>

                    {/* Main Content - Document Editor */}
                    <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
                      {/* Top Toolbar */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid brandColors.neutral[300]' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
                            D-SIGN
                          </Typography>
                          <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                              value="nick-jacoy"
                              displayEmpty
                              sx={{ backgroundColor: 'white' }}
                            >
                              <MenuItem value="nick-jacoy">Nick Jacoy</MenuItem>
                              <MenuItem value="client-2">Client 2</MenuItem>
                              <MenuItem value="client-3">Client 3</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Editing 1 Block
                          </Typography>
                          <IconButton size="small">
                            <CloseIcon />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">
                            Page 14 -
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small">
                              <RemoveIcon />
                            </IconButton>
                            <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>
                              125%
                            </Typography>
                            <IconButton size="small">
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      {/* Signature Tools Toolbar */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CreateIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Signature
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<TextFieldsIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Initials
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PersonIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Full Name
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EventIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Date
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ScheduleIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Time
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CheckBoxIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Checkbox
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<InputIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Text Field
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<StrikethroughSIcon />}
                          sx={{ minWidth: 100 }}
                        >
                          Strike
                        </Button>
                      </Box>

                      {/* Document Content */}
                      <Box sx={{ 
                        border: '2px solid brandColors.neutral[300]', 
                        borderRadius: 2, 
                        p: 4, 
                        backgroundColor: brandColors.neutral[50],
                        minHeight: 600,
                        position: 'relative'
                      }}>
                        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontWeight: 700, color: '#1a1a1a' }}>
                          BUYER ADVISORY
                        </Typography>
                        
                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 1, color: '#856404' }}>
                          ARIZONA ASSOCIATION OF REALTORS®
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}>
                            BUYER ACKNOWLEDGMENT
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            I acknowledge that I have received and read the Arizona Association of REALTORS® Buyer Advisory.
                          </Typography>
                        </Box>

                        {/* Interactive Signature Fields */}
                        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', mb: 4 }}>
                          <Box sx={{ 
                            p: 3, 
                            backgroundColor: '#e3f2fd', 
                            border: '2px dashed brandColors.accent.info',
                            borderRadius: 2,
                            textAlign: 'center',
                            minWidth: 200
                          }}>
                            <Typography variant="h6" sx={{ color: brandColors.accent.infoDark, mb: 1 }}>
                              Signature
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              NJ
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              BUYER SIGNATURE
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            p: 3, 
                            backgroundColor: '#e3f2fd', 
                            border: '2px dashed brandColors.accent.info',
                            borderRadius: 2,
                            textAlign: 'center',
                            minWidth: 200
                          }}>
                            <Typography variant="h6" sx={{ color: brandColors.accent.infoDark, mb: 1 }}>
                              Date
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              MM/DD/YYYY
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              DATE
                            </Typography>
                          </Box>
                        </Box>

                        {/* Document Logos */}
                        <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.3 }}>
                          <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                            Buyer Advisory
                          </Typography>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.3 }}>
                          <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                            ADRE
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </>
              )}

              {digitalSignatureTab === 'envelopes' && (
                <>
                  {/* Templates Management Interface */}
                  <Box sx={{ mb: 4 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                        Templates
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                          backgroundColor: brandColors.primary,
                          '&:hover': { backgroundColor: brandColors.secondary }
                        }}
                      >
                        + Create Template
                      </Button>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {[
                            { value: 'my-templates', label: 'My templates', active: true },
                            { value: 'create-template', label: 'Create template', active: false }
                          ].map((tab) => (
                            <Button
                              key={tab.value}
                              variant="text"
                              sx={{
                                borderRadius: 0,
                                borderBottom: tab.active ? 2 : 0,
                                borderColor: brandColors.primary,
                                color: tab.active ? brandColors.primary : 'text.secondary',
                                fontWeight: tab.active ? 600 : 400,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  color: brandColors.primary
                                }
                              }}
                            >
                              {tab.label}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Template Count and Create Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          12 TEMPLATES
                        </Typography>
                      </Box>
                    </Box>

                    {/* Template Grid */}
                    <Box sx={{ display: 'grid', gap: 3 }}>
                      {[
                        { name: 'Starter Agent Template', forms: 108 },
                        { name: 'MPE Form Template', forms: 1 },
                        { name: 'Special Cases Only', forms: 1 },
                        { name: 'Condo Form Template', forms: 1 },
                        { name: 'Arizona Agents', forms: 2 },
                        { name: 'California Agents', forms: 2 },
                        { name: 'Brokerage Wide Template', forms: 2 },
                        { name: 'Burbank Client Template', forms: 1 },
                        { name: 'Essential Forms v1', forms: 3 }
                      ].map((template, index) => (
                        <Box key={index}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 3,
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                elevation: 3,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            {/* Template Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {template.name}
                              </Typography>
                              <IconButton size="small">
                                <MoreVertIcon />
                              </IconButton>
                            </Box>

                            {/* Form Count */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <VisibilityIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                              <Typography variant="body2" color="text.secondary">
                                {template.forms} {template.forms === 1 ? 'Form' : 'Forms'}
                              </Typography>
                            </Box>

                            {/* Quick Actions */}
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid brandColors.neutral[100]' }}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ContentCopyIcon />}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Duplicate
                                </Button>
                              </Box>
                            </Box>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {digitalSignatureTab === 'templates' && (
                <>
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Templates Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Save and reuse document setups for common forms.
                    </Typography>
                  </Paper>
                </>
              )}

              {digitalSignatureTab === 'signatures' && (
                <>
                  <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Signatures & Verification
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      View completed signatures, download signed documents, and verify signatures.
                    </Typography>
                  </Paper>
                </>
              )}
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CancelIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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
                color: brandColors.text.inverse
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ArchiveIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
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

export default WorkspacesAgentPage;
