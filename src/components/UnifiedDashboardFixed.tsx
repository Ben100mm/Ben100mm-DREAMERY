import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  Select,
  Chip,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { RoleContext } from '../context/RoleContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import CloseWorkspace from './workspaces/CloseWorkspace';
import ManageWorkspace from './workspaces/ManageWorkspace';
import FundWorkspace from './workspaces/FundWorkspace';
import InvestWorkspace from './workspaces/InvestWorkspace';
import OperateWorkspace from './workspaces/OperateWorkspace';
import { WorkspaceConfig } from '../data/workspaces/types';

// Inline workspace configurations to avoid import issues
const closeWorkspaceConfig: WorkspaceConfig = {
  id: 'close',
  name: 'Close',
  description: 'Closing and transaction management',
  icon: <Box sx={{ width: 24, height: 24, bgcolor: brandColors.primary, borderRadius: 1 }} />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { id: 'dashboard', label: 'Dashboard', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'messages', label: 'Messages', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'escrow-title', label: 'Escrow & Title', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'due-diligence', label: 'Due Diligence', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'financing', label: 'Financing', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'legal', label: 'Legal & Compliance', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'settlement', label: 'Settlement', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'insurance', label: 'Insurance & Utilities', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'walkthrough', label: 'Walkthrough', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'post-closing', label: 'Post-Closing', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'assistant', label: 'Closing Assistant', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'integrations', label: 'Integrations', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
  ],
};

const manageWorkspaceConfig: WorkspaceConfig = {
  id: 'manage',
  name: 'Manage',
  description: 'Property management and rental operations',
  icon: <Box sx={{ width: 24, height: 24, bgcolor: brandColors.primary, borderRadius: 1 }} />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { id: 'dashboard', label: 'Dashboard', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'messages', label: 'Messages', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'calendar', label: 'Calendar', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'listings', label: 'Listings', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'earnings', label: 'Earnings', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'insights', label: 'Insights', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'listing', label: 'Creating a Listing', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'leases', label: 'Online Leases', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'applications', label: 'Rental Applications', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'payments', label: 'Online Rent Payments', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'integrations', label: 'Integrations', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'insurance', label: 'Insurance', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'account', label: 'Manage Your Account', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
  ],
};

const fundWorkspaceConfig: WorkspaceConfig = {
  id: 'fund',
  name: 'Fund',
  description: 'Capital raising and fundraising platform',
  icon: <Box sx={{ width: 24, height: 24, bgcolor: brandColors.primary, borderRadius: 1 }} />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { id: 'dashboard', label: 'Dashboard', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'messages', label: 'Messages', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'projects', label: 'Projects', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'createproject', label: 'Create New Project', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'investor', label: 'Investor Onboarding', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'compliance', label: 'Capital Raise Compliance Tools', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'calculator', label: 'Waterfall & ROI Calculators', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'portal', label: 'Secure Investor Portal', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
  ],
};

const investWorkspaceConfig: WorkspaceConfig = {
  id: 'invest',
  name: 'Invest',
  description: 'Investment opportunities and portfolio management',
  icon: <Box sx={{ width: 24, height: 24, bgcolor: brandColors.primary, borderRadius: 1 }} />,
  color: brandColors.primary,
  defaultTab: 'crowdfunding',
  sidebarItems: [
    { id: 'crowdfunding', label: 'Crowdfunded Deals', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'messages', label: 'Messages', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'jointventure', label: 'Joint Venture', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'fractional', label: 'Fractional Ownership', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'privatemarket', label: 'Private Market Investment Listings', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
  ],
};

const operateWorkspaceConfig: WorkspaceConfig = {
  id: 'operate',
  name: 'Operate',
  description: 'Property operations and project management',
  icon: <Box sx={{ width: 24, height: 24, bgcolor: brandColors.primary, borderRadius: 1 }} />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { id: 'dashboard', label: 'Dashboard', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'messages', label: 'Messages', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'projects', label: 'Projects', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'createproject', label: 'Create a New Project', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'expenses', label: 'Expense Tracking', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'contractors', label: 'Contractor & Vendor Scheduling', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
    { id: 'optimization', label: 'Portfolio Optimization Suggestions', icon: <Box sx={{ width: 20, height: 20, bgcolor: brandColors.primary, borderRadius: 0.5 }} /> },
  ],
};

const UnifiedDashboardFixed: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  const { preferences, setDefaultWorkspace, toggleFavoriteSidebarItem, updateWorkspaceSettings } = useUserPreferences();
  
  // Available workspaces for buyers
  const availableWorkspaces: WorkspaceConfig[] = [
    closeWorkspaceConfig,
    manageWorkspaceConfig,
    fundWorkspaceConfig,
    investWorkspaceConfig,
    operateWorkspaceConfig,
  ];

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(preferences.defaultWorkspace || 'close');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(preferences.customLayout.sidebarCollapsed);

  // Update active tab when workspace changes
  useEffect(() => {
    const workspaceSettings = preferences.workspaceSettings[selectedWorkspace];
    const defaultTab = workspaceSettings?.defaultTab || availableWorkspaces.find(w => w.id === selectedWorkspace)?.defaultTab || 'dashboard';
    setActiveTab(defaultTab);
  }, [selectedWorkspace, preferences.workspaceSettings, availableWorkspaces]);

  // Update default workspace preference
  useEffect(() => {
    setDefaultWorkspace(selectedWorkspace);
  }, [selectedWorkspace, setDefaultWorkspace]);

  const currentWorkspace = availableWorkspaces.find(w => w.id === selectedWorkspace);

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    updateWorkspaceSettings(selectedWorkspace, { defaultTab: tabId });
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

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderWorkspaceContent = () => {
    switch (selectedWorkspace) {
      case 'close':
        return <CloseWorkspace activeTab={activeTab} />;
      case 'manage':
        return <ManageWorkspace activeTab={activeTab} />;
      case 'fund':
        return <FundWorkspace activeTab={activeTab} />;
      case 'invest':
        return <InvestWorkspace activeTab={activeTab} />;
      case 'operate':
        return <OperateWorkspace activeTab={activeTab} />;
      default:
        return <CloseWorkspace activeTab={activeTab} />;
    }
  };

  // If role is not authorized, redirect
  if (!isBuyerAuthorized && userRole) {
    navigate('/');
    return null;
  }

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
            Dreamery {currentWorkspace?.name || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={3} color="error">
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
                  J
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

      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarCollapsed ? 80 : 280,
          flexShrink: 0,
          background: brandColors.backgrounds.secondary,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          transition: 'width 0.3s ease',
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Workspace Selector */}
          {!sidebarCollapsed && (
            <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedWorkspace}
                  onChange={(e) => handleWorkspaceChange(e.target.value)}
                  displayEmpty
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: brandColors.primary,
                    },
                  }}
                  renderValue={(value) => {
                    const workspace = availableWorkspaces.find(w => w.id === value);
                    if (!workspace) return 'Select Workspace';
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: brandColors.primary }}>
                          {workspace.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {workspace.name}
                        </Typography>
                        <Chip 
                          label={workspace.name} 
                          size="small" 
                          sx={{ 
                            backgroundColor: brandColors.primary,
                            color: brandColors.text.inverse,
                            fontSize: '0.75rem',
                            height: 20,
                          }} 
                        />
                      </Box>
                    );
                  }}
                >
                  {availableWorkspaces.map((workspace) => (
                    <MenuItem key={workspace.id} value={workspace.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <Box sx={{ color: brandColors.primary }}>
                          {workspace.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {workspace.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {workspace.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Station Button */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <Box
              sx={{
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                borderRadius: 2,
                py: 1.5,
                px: 2,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: sidebarCollapsed ? '0.75rem' : '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {sidebarCollapsed ? 'S' : 'Station'}
            </Box>
          </Box>

          {/* Favorites Section */}
          {!sidebarCollapsed && preferences.favoriteSidebarItems.length > 0 && (
            <>
              <Box sx={{ px: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  FAVORITES
                </Typography>
              </Box>
              <Box sx={{ px: 0, mb: 2 }}>
                {preferences.favoriteSidebarItems.map((itemId) => {
                  const item = currentWorkspace?.sidebarItems.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <Box
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      sx={{
                        mx: 1,
                        mb: 0.5,
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        backgroundColor: activeTab === item.id ? brandColors.primary : 'transparent',
                        color: activeTab === item.id ? 'white' : 'inherit',
                        '&:hover': {
                          backgroundColor: activeTab === item.id ? brandColors.primary : brandColors.interactive.hover,
                        },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        position: 'relative',
                      }}
                    >
                      <Box sx={{ color: activeTab === item.id ? 'white' : brandColors.primary }}>
                        {item.icon}
                      </Box>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontWeight: activeTab === item.id ? 'bold' : 'normal',
                          color: activeTab === item.id ? 'white' : 'inherit',
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Tooltip title="Remove from favorites">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteSidebarItem(item.id);
                          }}
                          sx={{
                            color: activeTab === item.id ? 'white' : '#ffc107',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <StarIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}
              </Box>
              <Divider sx={{ mx: 2, mb: 2 }} />
            </>
          )}

          {/* Navigation Items */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {currentWorkspace?.sidebarItems.map((item) => (
              <Box
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: activeTab === item.id ? brandColors.primary : 'transparent',
                  color: activeTab === item.id ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: activeTab === item.id ? brandColors.primary : brandColors.interactive.hover,
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative',
                }}
              >
                <Box sx={{ color: activeTab === item.id ? 'white' : brandColors.primary }}>
                  {item.icon}
                </Box>
                {!sidebarCollapsed && (
                  <>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontWeight: activeTab === item.id ? 'bold' : 'normal',
                        color: activeTab === item.id ? 'white' : 'inherit',
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Tooltip title={preferences.favoriteSidebarItems.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteSidebarItem(item.id);
                        }}
                        sx={{
                          color: activeTab === item.id ? 'white' : preferences.favoriteSidebarItems.includes(item.id) ? '#ffc107' : 'rgba(0, 0, 0, 0.54)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        {preferences.favoriteSidebarItems.includes(item.id) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            ))}
          </Box>

          {/* Collapse Toggle */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={toggleSidebarCollapse}
              sx={{ fontSize: '0.75rem' }}
              startIcon={sidebarCollapsed ? <ChevronLeftIcon /> : <ChevronLeftIcon sx={{ transform: 'rotate(180deg)' }} />}
            >
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </Button>
          </Box>
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
        {renderWorkspaceContent()}
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
            Closing documents ready for review
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Title search completed
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Insurance quote received
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
    </Box>
  );
};

export default UnifiedDashboardFixed;
