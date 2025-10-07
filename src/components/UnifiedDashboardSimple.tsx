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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Group as CrowdfundingIcon,
  Assignment as ProjectsIcon,
  TrendingUp as OptimizationIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { RoleContext } from '../context/RoleContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import CloseWorkspace from './workspaces/CloseWorkspace';
import ManageWorkspace from './workspaces/ManageWorkspace';
import FundWorkspace from './workspaces/FundWorkspace';
import InvestWorkspace from './workspaces/InvestWorkspace';
import OperateWorkspace from './workspaces/OperateWorkspace';

const UnifiedDashboardSimple: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  const { preferences, setDefaultWorkspace, toggleFavoriteSidebarItem, updateWorkspaceSettings } = useUserPreferences();
  
  // Simple workspace configuration
  const workspaces = [
    { id: 'close', name: 'Close', icon: <SecurityIcon />, color: brandColors.primary },
    { id: 'manage', name: 'Manage', icon: <DashboardIcon />, color: brandColors.primary },
    { id: 'fund', name: 'Fund', icon: <ProjectsIcon />, color: brandColors.primary },
    { id: 'invest', name: 'Invest', icon: <CrowdfundingIcon />, color: brandColors.primary },
    { id: 'operate', name: 'Operate', icon: <OptimizationIcon />, color: brandColors.primary },
  ];

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(preferences.defaultWorkspace || 'close');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // Update active tab when workspace changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [selectedWorkspace]);

  // Update default workspace preference
  useEffect(() => {
    setDefaultWorkspace(selectedWorkspace);
  }, [selectedWorkspace, setDefaultWorkspace]);

  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspace);

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
          width: 280,
          flexShrink: 0,
          background: brandColors.backgrounds.secondary,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Workspace Selector */}
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
                  const workspace = workspaces.find(w => w.id === value);
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
                {workspaces.map((workspace) => (
                  <MenuItem key={workspace.id} value={workspace.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Box sx={{ color: brandColors.primary }}>
                        {workspace.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {workspace.name}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
                fontSize: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Station
            </Box>
          </Box>

          {/* Simple Navigation */}
          <Box sx={{ px: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
              {currentWorkspace?.name.toUpperCase()} WORKSPACE
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Select a workspace from the dropdown above to access different features.
            </Typography>
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

export default UnifiedDashboardSimple;
