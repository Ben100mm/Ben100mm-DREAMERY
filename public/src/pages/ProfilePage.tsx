import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Person,
  Notifications,
  Edit,
  Lock,
  Business,
  Upload,
  ArrowBack,
  Save,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { brandColors } from '../theme/theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: 'Justin',
    lastName: 'Henderson',
    email: 'justin.henderson@dreamery.com',
    phone: '+1 (555) 123-4567',
    company: 'Dreamery Real Estate',
    role: 'Listing Agent',
    bio: 'Experienced real estate professional with over 10 years in the industry.',
    timezone: 'America/Los_Angeles',
    language: 'en',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile data:', profileData);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNotificationsClick = () => {
    navigate('/profile/notifications');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: brandColors.backgrounds.secondary,
      pt: 10,
      pb: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link 
              color="inherit" 
              href="#" 
              onClick={handleBack}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ArrowBack fontSize="small" />
              Back to Dashboard
            </Link>
            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" sx={{ 
            color: brandColors.primary,
            fontWeight: 700,
            mb: 1
          }}>
            Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information, notifications, and account preferences
          </Typography>
        </Box>

        {/* Profile Header Card */}
        <Card sx={{ mb: 4, backgroundColor: brandColors.backgrounds.gradient }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: brandColors.primary,
                    fontSize: '2rem',
                    fontWeight: 700,
                  }}
                >
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  mb: 1
                }}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 1
                }}>
                  {profileData.role}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {profileData.company}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile settings tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 64,
                },
                '& .Mui-selected': {
                  color: brandColors.primary,
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: brandColors.primary,
                }
              }}
            >
              <Tab 
                label="Personal Information" 
                icon={<Person />} 
                iconPosition="start"
                {...a11yProps(0)} 
              />
              <Tab 
                label="Notifications" 
                icon={<Notifications />} 
                iconPosition="start"
                {...a11yProps(1)} 
              />
              <Tab 
                label="Signature" 
                icon={<Edit />} 
                iconPosition="start"
                {...a11yProps(2)} 
              />
              <Tab 
                label="Change Password" 
                icon={<Lock />} 
                iconPosition="start"
                {...a11yProps(3)} 
              />
              <Tab 
                label="Directory" 
                icon={<Business />} 
                iconPosition="start"
                {...a11yProps(4)} 
              />
              <Tab 
                label="Upload Logo" 
                icon={<Upload />} 
                iconPosition="start"
                {...a11yProps(5)} 
              />
            </Tabs>
          </Box>

          {/* Personal Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={profileData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={profileData.timezone}
                    label="Timezone"
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                  >
                    <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                    <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                    <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                    <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={profileData.language}
                    label="Language"
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Notifications sx={{ fontSize: 64, color: brandColors.neutral.medium, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                Notification Settings
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Customize your email notifications for listings, transactions, and tasks
              </Typography>
              <Button
                variant="contained"
                onClick={handleNotificationsClick}
                sx={{ 
                  backgroundColor: brandColors.primary,
                  '&:hover': {
                    backgroundColor: brandColors.secondary,
                  }
                }}
              >
                Configure Notifications
              </Button>
            </Box>
          </TabPanel>

          {/* Signature Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary }}>
              Email Signature
            </Typography>
            <TextField
              fullWidth
              label="Email Signature"
              multiline
              rows={8}
              placeholder="Enter your email signature here..."
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This signature will be automatically added to all outgoing emails.
            </Typography>
          </TabPanel>

          {/* Change Password Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary }}>
              Change Password
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary">
              Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.
            </Typography>
          </TabPanel>

          {/* Directory Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary }}>
              Company Directory
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your company's contact directory and team information.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Manage Directory
            </Button>
          </TabPanel>

          {/* Upload Logo Tab */}
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary }}>
              Company Logo
            </Typography>
            <Box sx={{ 
              border: '2px dashed',
              borderColor: brandColors.neutral.medium,
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              mb: 2
            }}>
              <Upload sx={{ fontSize: 48, color: brandColors.neutral.medium, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Upload Company Logo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Drag and drop your logo here, or click to browse
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" hidden accept="image/*" />
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Supported formats: PNG, JPG, SVG. Maximum size: 5MB.
            </Typography>
          </TabPanel>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 4,
          gap: 2
        }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ 
              color: brandColors.neutral.dark,
              borderColor: brandColors.neutral.medium,
              '&:hover': {
                borderColor: brandColors.primary,
                color: brandColors.primary
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Save />}
            sx={{ 
              backgroundColor: brandColors.primary,
              '&:hover': {
                backgroundColor: brandColors.secondary,
              }
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
