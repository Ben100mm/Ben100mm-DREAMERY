import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Person,
  Close,
  ArrowBack,
  ArrowForward,
  Save,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface ProfileProps {
  onClose?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();

  // Check if we should show notifications tab by default
  useEffect(() => {
    if (location.pathname === '/profile' && location.search.includes('tab=notifications')) {
      setActiveTab('NOTIFICATIONS');
    }
  }, [location]);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    newListing: true,
    listingExpiration: true,
    listingExpirationDays: 3,
    listingExpired: true,
    listingDateChange: true,
    listingPriceChange: true,
    companyClosingReminder: false,
    companyClosingReminderDays: '',
    companyClosingSummary: false,
    companyExpirationReminder: false,
    companyExpirationDays: 0,
    companyFlaggedDocs: false,
    companyFlaggedDocsInitial: '',
    companyFlaggedDocsRepeat: '',
    transactionClosing: true,
    transactionClosingDays: 3,
    newTask: false,
  });

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setUserMenuOpen(false);
    setAnchorEl(null);
  };

  const handleSettingChange = (setting: string, value: any) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    // Save notification settings logic here
    console.log('Saving notification settings:', notificationSettings);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.back();
    }
  };

  const tabs = ['PROFILE', 'NOTIFICATIONS', 'PERSONAL INFORMATION', 'SIGNATURE', 'CHANGE PASSWORD', 'DIRECTORY', 'UPLOAD LOGO'];

  const renderProfileContent = () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Profile Information
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your profile settings and preferences here.
      </Typography>
    </Box>
  );

  const renderNotificationsContent = () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Notification Settings
      </Typography>
      
      {/* Listing Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Listing Notifications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>EMAIL ME WHEN A NEW LISTING IS CREATED.</Typography>
            <Switch
              checked={notificationSettings.newListing}
              onChange={(e) => handleSettingChange('newListing', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>EMAIL ME</Typography>
              <TextField
                size="small"
                type="number"
                value={notificationSettings.listingExpirationDays}
                onChange={(e) => handleSettingChange('listingExpirationDays', parseInt(e.target.value) || 0)}
                sx={{ width: 60 }}
              />
              <Typography>DAYS BEFORE THE LISTING EXPIRATION DATE.</Typography>
            </Box>
            <Switch
              checked={notificationSettings.listingExpiration}
              onChange={(e) => handleSettingChange('listingExpiration', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>EMAIL ME IF A LISTING PASSES THE EXPIRATION DATE.</Typography>
            <Switch
              checked={notificationSettings.listingExpired}
              onChange={(e) => handleSettingChange('listingExpired', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>EMAIL ME IF THE LIST DATE OR EXPIRATION DATE CHANGES.</Typography>
            <Switch
              checked={notificationSettings.listingDateChange}
              onChange={(e) => handleSettingChange('listingDateChange', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>EMAIL ME IF THE LIST PRICE CHANGES.</Typography>
            <Switch
              checked={notificationSettings.listingPriceChange}
              onChange={(e) => handleSettingChange('listingPriceChange', e.target.checked)}
            />
          </Box>
        </Box>
      </Box>

      {/* Company Wide Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Company Wide Notifications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>EMAIL AGENTS A SUMMARY OF THE REMAINING REQUIRED DOCS</Typography>
              <TextField
                size="small"
                type="number"
                value={notificationSettings.companyClosingReminderDays}
                onChange={(e) => handleSettingChange('companyClosingReminderDays', e.target.value)}
                sx={{ width: 60 }}
              />
              <Typography>DAYS BEFORE THEIR TRANSACTION'S CLOSING DATE.</Typography>
            </Box>
            <Switch
              checked={notificationSettings.companyClosingReminder}
              onChange={(e) => handleSettingChange('companyClosingReminder', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>EMAIL AGENTS A SUMMARY OF REMAINING REQUIRED DOCS WHEN THEIR TRANSACTION CLOSES.</Typography>
            <Switch
              checked={notificationSettings.companyClosingSummary}
              onChange={(e) => handleSettingChange('companyClosingSummary', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>EMAIL AGENTS</Typography>
              <TextField
                size="small"
                type="number"
                value={notificationSettings.companyExpirationDays}
                onChange={(e) => handleSettingChange('companyExpirationDays', parseInt(e.target.value) || 0)}
                sx={{ width: 60 }}
              />
              <Typography>DAYS BEFORE THEIR LISTING'S EXPIRATION DATE.</Typography>
            </Box>
            <Switch
              checked={notificationSettings.companyExpirationReminder}
              onChange={(e) => handleSettingChange('companyExpirationReminder', e.target.checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>EMAIL AGENTS TO UPLOAD FLAGGED DOCS</Typography>
              <TextField
                size="small"
                type="number"
                value={notificationSettings.companyFlaggedDocsInitial}
                onChange={(e) => handleSettingChange('companyFlaggedDocsInitial', e.target.value)}
                sx={{ width: 60 }}
              />
              <Typography>DAYS AFTER THEY CREATE A FILE, AND KEEP EMAILING EVERY</Typography>
              <TextField
                size="small"
                type="number"
                value={notificationSettings.companyFlaggedDocsRepeat}
                onChange={(e) => handleSettingChange('companyFlaggedDocsRepeat', e.target.value)}
                sx={{ width: 60 }}
              />
              <Typography>DAYS UNTIL THE DOCS ARE UPLOADED.</Typography>
            </Box>
            <Switch
              checked={notificationSettings.companyFlaggedDocs}
              onChange={(e) => handleSettingChange('companyFlaggedDocs', e.target.checked)}
            />
          </Box>
        </Box>
      </Box>

      {/* Transaction Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Transaction Notifications
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>EMAIL ME</Typography>
            <TextField
              size="small"
              type="number"
              value={notificationSettings.transactionClosingDays}
              onChange={(e) => handleSettingChange('transactionClosingDays', parseInt(e.target.value) || 0)}
              sx={{ width: 60 }}
            />
            <Typography>DAYS BEFORE THE TRANSACTION CLOSING DATE.</Typography>
          </Box>
          <Switch
            checked={notificationSettings.transactionClosing}
            onChange={(e) => handleSettingChange('transactionClosing', e.target.checked)}
          />
        </Box>
      </Box>

      {/* Task Email Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Task Email Notifications
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>EMAIL ME IF I'M ASSIGNED A NEW TASK.</Typography>
          <Switch
            checked={notificationSettings.newTask}
            onChange={(e) => handleSettingChange('newTask', e.target.checked)}
          />
        </Box>
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'PROFILE':
        return renderProfileContent();
      case 'NOTIFICATIONS':
        return renderNotificationsContent();
      default:
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              {activeTab}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This section is under development.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {onClose ? (
              <IconButton onClick={onClose} sx={{ color: 'black' }}>
                <ArrowBack />
              </IconButton>
            ) : (
              <IconButton onClick={handleBack} sx={{ color: 'black' }}>
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              DREAMERY
            </Typography>
          </Box>
          
          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, cursor: 'pointer' }} onClick={handleUserMenuClick}>
                      <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
            <Person />
          </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              User Account
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Secondary Navigation */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ px: 4 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {tabs.map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  px: 3,
                  py: 2,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? '2px solid #1976d2' : 'none',
                  color: activeTab === tab ? '#1976d2' : '#666',
                  fontWeight: activeTab === tab ? 600 : 400,
                  '&:hover': {
                    color: '#1976d2',
                  },
                }}
              >
                {tab}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 4, px: 4 }}>
        <Paper sx={{ p: 4, position: 'relative' }}>
          {/* Navigation Arrows */}
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ArrowForward />
            </IconButton>

          {renderContent()}
        </Paper>
      </Box>

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
      >
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <Notifications fontSize="small" />
          </ListItemIcon>
          Notifications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <Close fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
