import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { useWorkspace } from '../context/WorkspaceContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import CloseWorkspace from './workspaces/CloseWorkspace';
import ManageWorkspace from './workspaces/ManageWorkspace';
import FundWorkspace from './workspaces/FundWorkspace';
import InvestWorkspace from './workspaces/InvestWorkspace';
import OperateWorkspace from './workspaces/OperateWorkspace';
import LearnWorkspace from './workspaces/LearnWorkspace';
import { WorkspaceConfig } from '../data/workspaces/types';
import { closeWorkspace } from '../data/workspaces/closeWorkspace';
import { manageWorkspace } from '../data/workspaces/manageWorkspace';
import { fundWorkspace } from '../data/workspaces/fundWorkspace';
import { investWorkspace } from '../data/workspaces/investWorkspace';
import { operateWorkspace } from '../data/workspaces/operateWorkspace';
import { learnWorkspace } from '../data/workspaces/learnWorkspace';

const UnifiedDashboardFixed: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  const { preferences, setDefaultWorkspace, toggleFavoriteSidebarItem, updateWorkspaceSettings } = useUserPreferences();
  const { selectedWorkspace, setSelectedWorkspace: setGlobalWorkspace } = useWorkspace();
  
  // Available workspaces for buyers
  const availableWorkspaces: WorkspaceConfig[] = [
    closeWorkspace,
    manageWorkspace,
    fundWorkspace,
    investWorkspace,
    operateWorkspace,
    learnWorkspace,
  ];

  // Wrapper to update both global and preference contexts
  const setSelectedWorkspace = (workspaceId: string) => {
    setGlobalWorkspace(workspaceId);
  };
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
    navigate('/');
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
      case 'learn':
        return <LearnWorkspace activeTab={activeTab} />;
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

            <Tooltip title="Back to Homepage">
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
