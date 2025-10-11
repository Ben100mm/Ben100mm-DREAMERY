import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { RoleContext } from '../context/RoleContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import DynamicSidebar from './sidebar/DynamicSidebar';
import CloseWorkspace from './workspaces/CloseWorkspace';
import ManageWorkspace from './workspaces/ManageWorkspace';
import FundWorkspace from './workspaces/FundWorkspace';
import InvestWorkspace from './workspaces/InvestWorkspace';
import OperateWorkspace from './workspaces/OperateWorkspace';
import RentWorkspace from './workspaces/RentWorkspace';
import LearnWorkspace from './workspaces/LearnWorkspace';
import AdvertiseWorkspace from './workspaces/AdvertiseWorkspace';
import { closeWorkspace } from '../data/workspaces/closeWorkspace';
import { manageWorkspace } from '../data/workspaces/manageWorkspace';
import { fundWorkspace } from '../data/workspaces/fundWorkspace';
import { investWorkspace } from '../data/workspaces/investWorkspace';
import { operateWorkspace } from '../data/workspaces/operateWorkspace';
import { rentWorkspace } from '../data/workspaces/rentWorkspace';
import { learnWorkspace } from '../data/workspaces/learnWorkspace';
import { advertiseWorkspace } from '../data/workspaces/advertiseWorkspace';
import { WorkspaceConfig } from '../data/workspaces/types';

const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  const { preferences, setDefaultWorkspace, toggleFavoriteSidebarItem, updateWorkspaceSettings } = useUserPreferences();
  const { selectedWorkspace, setSelectedWorkspace: setGlobalWorkspace } = useWorkspace();
  
  // Available workspaces for buyers
  const availableWorkspaces: WorkspaceConfig[] = [
    rentWorkspace,
    closeWorkspace,
    manageWorkspace,
    fundWorkspace,
    investWorkspace,
    operateWorkspace,
    learnWorkspace,
    advertiseWorkspace,
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
    // Save tab preference for this workspace
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
      case 'rent':
        return <RentWorkspace activeTab={activeTab} />;
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
      case 'advertise':
        return <AdvertiseWorkspace activeTab={activeTab} />;
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
      <DynamicSidebar
        workspaces={availableWorkspaces}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={handleWorkspaceChange}
        currentWorkspace={currentWorkspace || null}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        favoriteItems={preferences.favoriteSidebarItems}
        onToggleFavorite={toggleFavoriteSidebarItem}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

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

export default UnifiedDashboard;
