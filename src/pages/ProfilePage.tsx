import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  TextField,
  Button,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  Person as PersonIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme/theme';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@dreamery.com',
    phone: '(555) 123-4567',
    company: 'Dreamery Real Estate',
    title: 'Real Estate Agent',
    address: '123 Main Street',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
    bio: 'Experienced real estate professional with over 10 years in the industry.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);
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

  const handleEditClick = () => {
    setTempProfileData(profileData);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setProfileData(tempProfileData);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setTempProfileData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setTempProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 700, mr: 1 }}>
              DREAMERY
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              sx={{ 
                borderColor: brandColors.primary, 
                color: brandColors.primary,
                '&:hover': { borderColor: brandColors.actions.primary, backgroundColor: 'rgba(25, 118, 210, 0.04)' }
              }}
            >
              Notifications
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleUserMenuClick}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: brandColors.primary }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1, mr: 0.5 }}>User Account</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Secondary Navigation */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ px: 4 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['PROFILE', 'NOTIFICATIONS', 'PERSONAL INFORMATION', 'SIGNATURE', 'CHANGE PASSWORD', 'DIRECTORY', 'UPLOAD LOGO'].map((tab) => (
              <Button
                key={tab}
                variant={tab === 'PROFILE' ? 'contained' : 'text'}
                sx={{
                  backgroundColor: tab === 'PROFILE' ? brandColors.primary : 'transparent',
                  color: tab === 'PROFILE' ? 'white' : 'text.primary',
                  borderRadius: 0,
                  px: 3,
                  py: 2,
                  '&:hover': {
                    backgroundColor: tab === 'PROFILE' ? brandColors.actions.primary : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                {tab}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 4, px: 4 }}>
        <Paper sx={{ p: 4, position: 'relative' }}>
          {/* Header with Edit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Profile Information
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  sx={{ backgroundColor: brandColors.primary }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          {/* Profile Content */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Left Column */}
            <Box>
              {/* Personal Information */}
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Personal Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="First Name"
                    value={isEditing ? tempProfileData.firstName : profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Last Name"
                    value={isEditing ? tempProfileData.lastName : profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    size="small"
                  />
                </Box>
                
                <TextField
                  label="Email"
                  value={isEditing ? tempProfileData.email : profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                  type="email"
                />
                
                <TextField
                  label="Phone"
                  value={isEditing ? tempProfileData.phone : profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                />
              </Box>

              {/* Company Information */}
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Company Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <TextField
                  label="Company"
                  value={isEditing ? tempProfileData.company : profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                />
                
                <TextField
                  label="Job Title"
                  value={isEditing ? tempProfileData.title : profileData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                />
              </Box>
            </Box>

            {/* Right Column */}
            <Box>
              {/* Address Information */}
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Address Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <TextField
                  label="Street Address"
                  value={isEditing ? tempProfileData.address : profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2 }}>
                  <TextField
                    label="City"
                    value={isEditing ? tempProfileData.city : profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="State"
                    value={isEditing ? tempProfileData.state : profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="ZIP Code"
                    value={isEditing ? tempProfileData.zipCode : profileData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>

              {/* Bio */}
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Bio
              </Typography>
              
              <TextField
                label="About Me"
                value={isEditing ? tempProfileData.bio : profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                fullWidth
                multiline
                rows={4}
                size="small"
              />
            </Box>
          </Box>
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
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
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
    </Box>
  );
};

export default ProfilePage;
