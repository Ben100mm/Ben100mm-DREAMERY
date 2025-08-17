import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme/theme';

interface ProfileHeaderProps {
  title?: string;
  subtitle?: string;
  showNotificationsButton?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  title = "Dreamery's Listing Agents Hub",
  subtitle = "Professional listing management and offer oversight",
  showNotificationsButton = true
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1200,
          backgroundColor: brandColors.primary,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'white' }}>
              {title}
              {subtitle && (
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.7rem' }}>
                  {subtitle}
                </Typography>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showNotificationsButton && (
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit"
                  onClick={() => navigate('/notifications')}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Profile">
              <IconButton 
                color="inherit"
                onClick={() => navigate('/profile')}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleUserMenuClick}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="body2" sx={{ ml: 1, mr: 0.5, color: 'white' }}>User Account</Typography>
                <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'white' }} />
              </Box>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/notifications'); handleUserMenuClose(); }}>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          Notifications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileHeader;
