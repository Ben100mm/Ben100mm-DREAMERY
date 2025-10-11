import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip, Badge, Avatar, Button, Menu, MenuItem, Divider, ListItemIcon, useTheme } from '@mui/material';
import {
  Notifications as NotificationIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// ULTIMATE FIX: No icons at all - completely text-only sidebar

import { RoleContext } from '../context/RoleContext';
import UnifiedRoleSelector from '../components/UnifiedRoleSelector';
import PersonalWorkspaceSelector from '../components/PersonalWorkspaceSelector';
import CloseWorkspace from '../components/workspaces/CloseWorkspace';
import RentWorkspace from '../components/workspaces/RentWorkspace';
import ManageWorkspace from '../components/workspaces/ManageWorkspace';
import InvestWorkspace from '../components/workspaces/InvestWorkspace';
import FundWorkspace from '../components/workspaces/FundWorkspace';
import OperateWorkspace from '../components/workspaces/OperateWorkspace';
import { brandColors } from "../theme";
import { rentWorkspace } from '../data/workspaces/rentWorkspace';
import { closeWorkspace } from '../data/workspaces/closeWorkspace';
import { manageWorkspace } from '../data/workspaces/manageWorkspace';
import { investWorkspace } from '../data/workspaces/investWorkspace';
import { fundWorkspace } from '../data/workspaces/fundWorkspace';
import { operateWorkspace } from '../data/workspaces/operateWorkspace';
import { learnWorkspace } from '../data/workspaces/learnWorkspace';



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


const WorkspacesPersonalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  console.log('WorkspacesPersonalPage - userRole:', userRole, 'isBuyerAuthorized:', isBuyerAuthorized, 'allowedRoles:', allowedRoles);

  // Debug effect to log role changes
  useEffect(() => {
    console.log('WorkspacesPersonalPage - userRole changed to:', userRole);
  }, [userRole]);

  const [state, setState] = useState<CloseState>({
    activeTab: 'dashboard',
    userRole: {
      id: '1',
      name: 'Buyer',
      permissions: ['view', 'edit', 'submit'],
      level: 'buyer'
    },
    drawerOpen: false,
    notifications: 3
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // Workspace state management
  const getCurrentWorkspace = useCallback(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const workspaceParam = searchParams.get('workspace');
    
    // Check query parameter first (for /workspaces/personal?workspace=invest)
    if (workspaceParam) {
      return workspaceParam;
    }
    
    // Check pathname for direct routes
    if (path === '/close/personal') return 'close';
    if (path === '/workspaces/personal') return 'rent';
    if (path === '/rent') return 'rent';
    if (path === '/manage') return 'manage';
    if (path === '/invest') return 'invest';
    if (path === '/fund') return 'fund';
    if (path === '/operate') return 'operate';
    if (path === '/learn') return 'learn';
    
    return 'rent'; // default
  }, [location.pathname, location.search]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(getCurrentWorkspace());

  // Update selected workspace when location changes
  useEffect(() => {
    setSelectedWorkspace(getCurrentWorkspace());
  }, [location.pathname, location.search, getCurrentWorkspace]);

  // Reset active tab when workspace changes
  useEffect(() => {
    setState(prev => ({ ...prev, activeTab: 'dashboard' }));
  }, [selectedWorkspace]);

  // Render workspace content based on selected workspace
  const renderWorkspaceContent = () => {
    switch (selectedWorkspace) {
      case 'rent':
        return <RentWorkspace activeTab={state.activeTab} />;
      case 'close':
        return <CloseWorkspace activeTab={state.activeTab} />;
      case 'manage':
        return <ManageWorkspace activeTab={state.activeTab} />;
      case 'invest':
        return <InvestWorkspace activeTab={state.activeTab} />;
      case 'fund':
        return <FundWorkspace activeTab={state.activeTab} />;
      case 'operate':
        return <OperateWorkspace activeTab={state.activeTab} />;
      case 'learn':
        // For now, show a placeholder for learn workspace
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: brandColors.primary, mb: 2 }}>
              Learn Workspace
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.text.secondary }}>
              Learning resources and educational content coming soon.
            </Typography>
          </Box>
        );
      default:
        return <RentWorkspace activeTab={state.activeTab} />;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setState(prev => ({ ...prev, activeTab: newValue }));
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


  // Get sidebar items based on selected workspace
  const getSidebarItems = () => {
    const workspaceConfigs = {
      rent: rentWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
      close: closeWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
      manage: manageWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
      invest: investWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
      fund: fundWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
      operate: operateWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
      learn: learnWorkspace.sidebarItems.map(item => ({
        value: item.id,
        label: item.label
      })),
    };

    return workspaceConfigs[selectedWorkspace as keyof typeof workspaceConfigs] || workspaceConfigs.rent;
  };

  const tabs = getSidebarItems();


  // If role is not yet known, render nothing until RoleContext resolves (RoleProvider shows loader)
  // Only redirect if we definitively know role is not allowed
  // Keep guard duplicated in rendered tree to satisfy hooks rule

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {!isBuyerAuthorized && userRole && <Navigate to="/" />}
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
            Dreamery Closing Hub
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={state.notifications} color="error">
                  <NotificationIcon />
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

          {/* Personal Workspace Selector */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <PersonalWorkspaceSelector 
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
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
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

          {/* COMPLETELY REBUILT SIDEBAR - NO BOX COMPONENTS */}
          <div style={{ width: '100%', padding: '8px' }}>
            {tabs.map((tab) => (
              <div
                key={tab.value}
                onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                style={{
                  margin: '4px 8px',
                  padding: '16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (state.activeTab !== tab.value) {
                    e.currentTarget.style.backgroundColor = brandColors.backgrounds.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (state.activeTab !== tab.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span
                  style={{
                    fontWeight: state.activeTab === tab.value ? 600 : 400,
                    color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                    fontSize: '14px',
                    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
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
        {/* Dynamic Workspace Content */}
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
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Box sx={{ width: 16, height: 16, backgroundColor: brandColors.text.primary, borderRadius: 1 }} />
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

export default WorkspacesPersonalPage;