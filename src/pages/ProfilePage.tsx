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
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Switch,
  FormControlLabel,
  Divider,
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
  const [tabValue, setTabValue] = useState(1); // Start with Notifications tab
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

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    // Listing Notifications
    newListingCreated: true,
    listingExpirationDays: 3,
    listingExpirationPassed: true,
    listingDateChanged: true,
    listingPriceChanged: true,
    
    // Transaction Notifications
    transactionClosingDays: 3,
    transactionClosingPassed: true,
    newTransactionCreated: true,
    docSubmittedForReview: true,
    checklistComplete: true,
    closingDateChanged: true,
    salesPriceChanged: true,
    
    // Dead Transactions
    transactionCancelled: true,
    listingWithdrawn: true,
    
    // Company Wide Notifications
    emailAgentsRemainingDocs: false,
    emailAgentsRemainingDocsDays: '',
    emailAgentsRemainingDocsOnClose: false,
    emailAgentsListingExpiration: false,
    emailAgentsListingExpirationDays: '',
    emailAgentsFlaggedDocs: false,
    emailAgentsFlaggedDocsDays: '',
    emailAgentsFlaggedDocsRepeat: '',
    
    // Task Email Notifications
    newTaskAssigned: false,
    taskAccepted: false,
    taskDeclined: false,
    dailyTaskSummary: false,
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

  const handleNotificationChange = (field: string, value: boolean | string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile data:', profileData);
    console.log('Saving notification settings:', notificationSettings);
  };

  const handleBack = () => {
    navigate(-1);
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
              <Box sx={{ flex: 1 }}>
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
              </Box>
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
            </Box>
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
                label="PERSONAL INFORMATION" 
                icon={<Person />} 
                iconPosition="start"
                {...a11yProps(0)} 
              />
              <Tab 
                label="NOTIFICATIONS" 
                icon={<Notifications />} 
                iconPosition="start"
                {...a11yProps(1)} 
              />
              <Tab 
                label="SIGNATURE" 
                icon={<Edit />} 
                iconPosition="start"
                {...a11yProps(2)} 
              />
              <Tab 
                label="CHANGE PASSWORD" 
                icon={<Lock />} 
                iconPosition="start"
                {...a11yProps(3)} 
              />
              <Tab 
                label="DIRECTORY" 
                icon={<Business />} 
                iconPosition="start"
                {...a11yProps(4)} 
              />
              <Tab 
                label="LOGO" 
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Company"
                  value={profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Role"
                  value={profileData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
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
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
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
              </Box>
            </Box>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {/* Left Column */}
              <Box sx={{ flex: 1 }}>
                {/* Listing Notifications */}
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Listing Notifications
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.newListingCreated}
                        onChange={(e) => handleNotificationChange('newListingCreated', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME WHEN A NEW LISTING IS CREATED."
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.listingExpirationPassed}
                          onChange={(e) => handleNotificationChange('listingExpirationPassed', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="EMAIL ME"
                    />
                    <TextField
                      size="small"
                      value={notificationSettings.listingExpirationDays}
                      onChange={(e) => handleNotificationChange('listingExpirationDays', e.target.value)}
                      sx={{ width: 60 }}
                    />
                    <Typography>DAYS BEFORE THE LISTING EXPIRATION DATE.</Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.listingExpirationPassed}
                        onChange={(e) => handleNotificationChange('listingExpirationPassed', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF A LISTING PASSES THE EXPIRATION DATE."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.listingDateChanged}
                        onChange={(e) => handleNotificationChange('listingDateChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF THE LIST DATE OR EXPIRATION DATE CHANGES."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.listingPriceChanged}
                        onChange={(e) => handleNotificationChange('listingPriceChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF THE LIST PRICE CHANGES."
                    sx={{ mb: 1 }}
                  />
                </Box>

                {/* Transaction Notifications */}
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Transaction Notifications
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.transactionClosingPassed}
                          onChange={(e) => handleNotificationChange('transactionClosingPassed', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="EMAIL ME"
                    />
                    <TextField
                      size="small"
                      value={notificationSettings.transactionClosingDays}
                      onChange={(e) => handleNotificationChange('transactionClosingDays', e.target.value)}
                      sx={{ width: 60 }}
                    />
                    <Typography>DAYS BEFORE THE TRANSACTION CLOSING DATE.</Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.transactionClosingPassed}
                        onChange={(e) => handleNotificationChange('transactionClosingPassed', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF A TRANSACTION PASSES THE CLOSING DATE."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.newTransactionCreated}
                        onChange={(e) => handleNotificationChange('newTransactionCreated', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME WHEN A NEW TRANSACTION IS CREATED."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.docSubmittedForReview}
                        onChange={(e) => handleNotificationChange('docSubmittedForReview', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME WHEN A DOC HAS BEEN SUBMITTED FOR REVIEW."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.checklistComplete}
                        onChange={(e) => handleNotificationChange('checklistComplete', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME WHEN A CHECKLIST IS 100% COMPLETE."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.closingDateChanged}
                        onChange={(e) => handleNotificationChange('closingDateChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF THE CLOSING DATE OR ACCEPTANCE DATE CHANGES."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.salesPriceChanged}
                        onChange={(e) => handleNotificationChange('salesPriceChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF THE SALES PRICE CHANGES."
                    sx={{ mb: 1 }}
                  />
                </Box>

                {/* Dead Transactions */}
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Dead Transactions
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.transactionCancelled}
                        onChange={(e) => handleNotificationChange('transactionCancelled', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF A TRANSACTION IS CANCELLED."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.listingWithdrawn}
                        onChange={(e) => handleNotificationChange('listingWithdrawn', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF A LISTING IS WITHDRAWN."
                    sx={{ mb: 1 }}
                  />
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ flex: 1 }}>
                {/* Company Wide Notifications */}
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Company Wide Notifications
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailAgentsRemainingDocs}
                          onChange={(e) => handleNotificationChange('emailAgentsRemainingDocs', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="EMAIL AGENTS A SUMMARY OF THE REMAINING REQUIRED DOCS"
                    />
                    <TextField
                      size="small"
                      value={notificationSettings.emailAgentsRemainingDocsDays}
                      onChange={(e) => handleNotificationChange('emailAgentsRemainingDocsDays', e.target.value)}
                      sx={{ width: 60 }}
                    />
                    <Typography>DAYS BEFORE THEIR TRANSACTION'S CLOSING DATE.</Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailAgentsRemainingDocsOnClose}
                        onChange={(e) => handleNotificationChange('emailAgentsRemainingDocsOnClose', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL AGENTS A SUMMARY OF REMAINING REQUIRED DOCS WHEN THEIR TRANSACTION CLOSES."
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailAgentsListingExpiration}
                          onChange={(e) => handleNotificationChange('emailAgentsListingExpiration', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="EMAIL AGENTS"
                    />
                    <TextField
                      size="small"
                      value={notificationSettings.emailAgentsListingExpirationDays}
                      onChange={(e) => handleNotificationChange('emailAgentsListingExpirationDays', e.target.value)}
                      sx={{ width: 60 }}
                    />
                    <Typography>DAYS BEFORE THEIR LISTING'S EXPIRATION DATE.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailAgentsFlaggedDocs}
                          onChange={(e) => handleNotificationChange('emailAgentsFlaggedDocs', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="EMAIL AGENTS TO UPLOAD FLAGGED DOCS"
                    />
                    <TextField
                      size="small"
                      value={notificationSettings.emailAgentsFlaggedDocsDays}
                      onChange={(e) => handleNotificationChange('emailAgentsFlaggedDocsDays', e.target.value)}
                      sx={{ width: 60 }}
                    />
                    <Typography>DAYS AFTER THEY CREATE A FILE, AND KEEP EMAILING EVERY</Typography>
                    <TextField
                      size="small"
                      value={notificationSettings.emailAgentsFlaggedDocsRepeat}
                      onChange={(e) => handleNotificationChange('emailAgentsFlaggedDocsRepeat', e.target.value)}
                      sx={{ width: 60 }}
                    />
                    <Typography>DAYS UNTIL THE DOCS ARE UPLOADED.</Typography>
                  </Box>
                </Box>

                {/* Task Email Notifications */}
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Task Email Notifications
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.newTaskAssigned}
                        onChange={(e) => handleNotificationChange('newTaskAssigned', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF I'M ASSIGNED A NEW TASK."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.taskAccepted}
                        onChange={(e) => handleNotificationChange('taskAccepted', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF ANOTHER USER ACCEPTS MY TASK."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.taskDeclined}
                        onChange={(e) => handleNotificationChange('taskDeclined', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME IF ANOTHER USER DECLINES MY TASK."
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.dailyTaskSummary}
                        onChange={(e) => handleNotificationChange('dailyTaskSummary', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="EMAIL ME A DAILY SUMMARY OF TODAY'S TASKS AND OVERDUE TASKS."
                    sx={{ mb: 1 }}
                  />
                </Box>
              </Box>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Box>
            </Box>
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
            Save
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
