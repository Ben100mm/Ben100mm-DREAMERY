import React, { useState } from 'react';
import {
  Box,
  Container,
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
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Print as PrintIcon,
  Apps as AppsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme/theme';

interface NotificationSettings {
  // Listing Notifications
  newListingCreated: boolean;
  listingExpirationReminder: boolean;
  listingExpirationReminderDays: number;
  listingExpired: boolean;
  listingDateChanged: boolean;
  listingPriceChanged: boolean;
  
  // Transaction Notifications
  transactionClosingReminder: boolean;
  transactionClosingReminderDays: number;
  transactionClosed: boolean;
  newTransactionCreated: boolean;
  documentSubmittedForReview: boolean;
  checklistComplete: boolean;
  closingDateChanged: boolean;
  salesPriceChanged: boolean;
  
  // Dead Transactions
  transactionCancelled: boolean;
  listingWithdrawn: boolean;
  
  // Company Wide Notifications
  agentSummaryBeforeClosing: boolean;
  agentSummaryBeforeClosingDays: number;
  agentSummaryWhenClosing: boolean;
  agentListingExpirationReminder: boolean;
  agentListingExpirationDays: number;
  agentUploadFlaggedDocs: boolean;
  agentUploadFlaggedDocsInitialDays: number;
  agentUploadFlaggedDocsRepeatDays: number;
  
  // Task Email Notifications
  newTaskAssigned: boolean;
  taskAccepted: boolean;
  taskDeclined: boolean;
  dailyTaskSummary: boolean;
}

const NotificationsPage: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    // Listing Notifications
    newListingCreated: true,
    listingExpirationReminder: true,
    listingExpirationReminderDays: 3,
    listingExpired: true,
    listingDateChanged: true,
    listingPriceChanged: true,
    
    // Transaction Notifications
    transactionClosingReminder: true,
    transactionClosingReminderDays: 3,
    transactionClosed: true,
    newTransactionCreated: true,
    documentSubmittedForReview: true,
    checklistComplete: true,
    closingDateChanged: true,
    salesPriceChanged: true,
    
    // Dead Transactions
    transactionCancelled: true,
    listingWithdrawn: true,
    
    // Company Wide Notifications
    agentSummaryBeforeClosing: false,
    agentSummaryBeforeClosingDays: 0,
    agentSummaryWhenClosing: false,
    agentListingExpirationReminder: false,
    agentListingExpirationDays: 0,
    agentUploadFlaggedDocs: false,
    agentUploadFlaggedDocsInitialDays: 0,
    agentUploadFlaggedDocsRepeatDays: 0,
    
    // Task Email Notifications
    newTaskAssigned: false,
    taskAccepted: false,
    taskDeclined: false,
    dailyTaskSummary: false,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSettingChange = (setting: keyof NotificationSettings, value: boolean | number) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setUserMenuOpen(false);
  };

  const handleSave = () => {
    console.log('Saving notification settings:', notificationSettings);
    // TODO: Implement save functionality
  };

  const handleNext = () => {
    console.log('Moving to next section');
    // TODO: Implement navigation to next section
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          {/* SKYSLOPE Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 700, mr: 1 }}>
              SKYSLOPE
            </Typography>
          </Box>

          {/* Main Navigation Tabs */}
          <Box sx={{ display: 'flex', gap: 2, mr: 'auto' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              px: 2, 
              py: 1, 
              borderBottom: '2px solid #e0e0e0',
              cursor: 'pointer'
            }}>
              <DescriptionIcon fontSize="small" />
              <Typography variant="body2">DOCUMENTS TO REVIEW</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              px: 2, 
              py: 1,
              cursor: 'pointer'
            }}>
              <EditIcon fontSize="small" />
              <Typography variant="body2">WORKING DOCUMENTS</Typography>
            </Box>
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Search">
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton size="small">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Apps">
              <IconButton size="small">
                <AppsIcon />
              </IconButton>
            </Tooltip>
            
            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, cursor: 'pointer' }} onClick={handleUserMenuClick}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: brandColors.primary }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="body2">Justin Henderson</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Secondary Navigation */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['NOTIFICATIONS', 'PERSONAL INFORMATION', 'SIGNATURE', 'CHANGE PASSWORD', 'DIRECTORY', 'UPLOAD LOGO'].map((tab) => (
              <Box
                key={tab}
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: tab === 'NOTIFICATIONS' ? '2px solid' + brandColors.primary : '2px solid transparent',
                  color: tab === 'NOTIFICATIONS' ? brandColors.primary : 'text.secondary',
                  cursor: 'pointer',
                  fontWeight: tab === 'NOTIFICATIONS' ? 600 : 400,
                }}
              >
                {tab}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, position: 'relative' }}>
          {/* Navigation Arrows */}
          <IconButton
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <ChevronLeftIcon sx={{ color: brandColors.primary }} />
          </IconButton>
          
          <IconButton
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <ChevronRightIcon sx={{ color: brandColors.primary }} />
          </IconButton>

          {/* Page Title */}
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
            Notification Settings
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Listing Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Listing Notifications
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME WHEN A NEW LISTING IS CREATED.
                    </Typography>
                    <Switch
                      checked={notificationSettings.newListingCreated}
                      onChange={(e) => handleSettingChange('newListingCreated', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        EMAIL ME
                      </Typography>
                      <TextField
                        size="small"
                        value={notificationSettings.listingExpirationReminderDays}
                        onChange={(e) => handleSettingChange('listingExpirationReminderDays', parseInt(e.target.value) || 0)}
                        sx={{ width: 60 }}
                        inputProps={{ min: 0, max: 30 }}
                      />
                      <Typography variant="body1">
                        DAYS BEFORE THE LISTING EXPIRATION DATE.
                      </Typography>
                    </Box>
                    <Switch
                      checked={notificationSettings.listingExpirationReminder}
                      onChange={(e) => handleSettingChange('listingExpirationReminder', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF A LISTING PASSES THE EXPIRATION DATE.
                    </Typography>
                    <Switch
                      checked={notificationSettings.listingExpired}
                      onChange={(e) => handleSettingChange('listingExpired', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF THE LIST DATE OR EXPIRATION DATE CHANGES.
                    </Typography>
                    <Switch
                      checked={notificationSettings.listingDateChanged}
                      onChange={(e) => handleSettingChange('listingDateChanged', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF THE LIST PRICE CHANGES.
                    </Typography>
                    <Switch
                      checked={notificationSettings.listingPriceChanged}
                      onChange={(e) => handleSettingChange('listingPriceChanged', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Transaction Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Transaction Notifications
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        EMAIL ME
                      </Typography>
                      <TextField
                        size="small"
                        value={notificationSettings.transactionClosingReminderDays}
                        onChange={(e) => handleSettingChange('transactionClosingReminderDays', parseInt(e.target.value) || 0)}
                        sx={{ width: 60 }}
                        inputProps={{ min: 0, max: 30 }}
                      />
                      <Typography variant="body1">
                        DAYS BEFORE THE TRANSACTION CLOSING DATE.
                      </Typography>
                    </Box>
                    <Switch
                      checked={notificationSettings.transactionClosingReminder}
                      onChange={(e) => handleSettingChange('transactionClosingReminder', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF A TRANSACTION PASSES THE CLOSING DATE.
                    </Typography>
                    <Switch
                      checked={notificationSettings.transactionClosed}
                      onChange={(e) => handleSettingChange('transactionClosed', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME WHEN A NEW TRANSACTION IS CREATED.
                    </Typography>
                    <Switch
                      checked={notificationSettings.newTransactionCreated}
                      onChange={(e) => handleSettingChange('newTransactionCreated', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME WHEN A DOC HAS BEEN SUBMITTED FOR REVIEW.
                    </Typography>
                    <Switch
                      checked={notificationSettings.documentSubmittedForReview}
                      onChange={(e) => handleSettingChange('documentSubmittedForReview', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME WHEN A CHECKLIST IS 100% COMPLETE.
                    </Typography>
                    <Switch
                      checked={notificationSettings.checklistComplete}
                      onChange={(e) => handleSettingChange('checklistComplete', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF THE CLOSING DATE OR ACCEPTANCE DATE CHANGES.
                    </Typography>
                    <Switch
                      checked={notificationSettings.closingDateChanged}
                      onChange={(e) => handleSettingChange('closingDateChanged', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF THE SALES PRICE CHANGES.
                    </Typography>
                    <Switch
                      checked={notificationSettings.salesPriceChanged}
                      onChange={(e) => handleSettingChange('salesPriceChanged', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Dead Transactions */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Dead Transactions
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF A TRANSACTION IS CANCELLED.
                    </Typography>
                    <Switch
                      checked={notificationSettings.transactionCancelled}
                      onChange={(e) => handleSettingChange('transactionCancelled', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF A LISTING IS WITHDRAWN.
                    </Typography>
                    <Switch
                      checked={notificationSettings.listingWithdrawn}
                      onChange={(e) => handleSettingChange('listingWithdrawn', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Company Wide Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Company Wide Notifications
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        EMAIL AGENTS A SUMMARY OF THE REMAINING REQUIRED DOCS
                      </Typography>
                      <TextField
                        size="small"
                        value={notificationSettings.agentSummaryBeforeClosingDays}
                        onChange={(e) => handleSettingChange('agentSummaryBeforeClosingDays', parseInt(e.target.value) || 0)}
                        sx={{ width: 60 }}
                        inputProps={{ min: 0, max: 30 }}
                      />
                      <Typography variant="body1">
                        DAYS BEFORE THEIR TRANSACTION'S CLOSING DATE.
                      </Typography>
                    </Box>
                    <Switch
                      checked={notificationSettings.agentSummaryBeforeClosing}
                      onChange={(e) => handleSettingChange('agentSummaryBeforeClosing', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL AGENTS A SUMMARY OF REMAINING REQUIRED DOCS WHEN THEIR TRANSACTION CLOSES.
                    </Typography>
                    <Switch
                      checked={notificationSettings.agentSummaryWhenClosing}
                      onChange={(e) => handleSettingChange('agentSummaryWhenClosing', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        EMAIL AGENTS
                      </Typography>
                      <TextField
                        size="small"
                        value={notificationSettings.agentListingExpirationDays}
                        onChange={(e) => handleSettingChange('agentListingExpirationDays', parseInt(e.target.value) || 0)}
                        sx={{ width: 60 }}
                        inputProps={{ min: 0, max: 30 }}
                      />
                      <Typography variant="body1">
                        DAYS BEFORE THEIR LISTING'S EXPIRATION DATE.
                      </Typography>
                    </Box>
                    <Switch
                      checked={notificationSettings.agentListingExpirationReminder}
                      onChange={(e) => handleSettingChange('agentListingExpirationReminder', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        EMAIL AGENTS TO UPLOAD FLAGGED DOCS
                      </Typography>
                      <TextField
                        size="small"
                        value={notificationSettings.agentUploadFlaggedDocsInitialDays}
                        onChange={(e) => handleSettingChange('agentUploadFlaggedDocsInitialDays', parseInt(e.target.value) || 0)}
                        sx={{ width: 60 }}
                        inputProps={{ min: 0, max: 30 }}
                      />
                      <Typography variant="body1">
                        DAYS AFTER THEY CREATE A FILE, AND KEEP EMAILING EVERY
                      </Typography>
                      <TextField
                        size="small"
                        value={notificationSettings.agentUploadFlaggedDocsRepeatDays}
                        onChange={(e) => handleSettingChange('agentUploadFlaggedDocsRepeatDays', parseInt(e.target.value) || 0)}
                        sx={{ width: 60 }}
                        inputProps={{ min: 0, max: 30 }}
                      />
                      <Typography variant="body1">
                        DAYS UNTIL THE DOCS ARE UPLOADED.
                      </Typography>
                    </Box>
                    <Switch
                      checked={notificationSettings.agentUploadFlaggedDocs}
                      onChange={(e) => handleSettingChange('agentUploadFlaggedDocs', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Task Email Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Task Email Notifications
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF I'M ASSIGNED A NEW TASK.
                    </Typography>
                    <Switch
                      checked={notificationSettings.newTaskAssigned}
                      onChange={(e) => handleSettingChange('newTaskAssigned', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF ANOTHER USER ACCEPTS MY TASK.
                    </Typography>
                    <Switch
                      checked={notificationSettings.taskAccepted}
                      onChange={(e) => handleSettingChange('taskAccepted', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME IF ANOTHER USER DECLINES MY TASK.
                    </Typography>
                    <Switch
                      checked={notificationSettings.taskDeclined}
                      onChange={(e) => handleSettingChange('taskDeclined', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      EMAIL ME A DAILY SUMMARY OF TODAY'S TASKS AND OVERDUE TASKS.
                    </Typography>
                    <Switch
                      checked={notificationSettings.dailyTaskSummary}
                      onChange={(e) => handleSettingChange('dailyTaskSummary', e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleNext}
              sx={{
                px: 4,
                py: 1.5,
                borderColor: '#e0e0e0',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Next
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: brandColors.primary,
                '&:hover': {
                  backgroundColor: brandColors.secondary
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: 'white', borderTop: '1px solid #e0e0e0', py: 3, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ in Sacramento by SkySlope
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                Terms of use
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                Privacy Policy
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton size="small" sx={{ color: '#1877f2' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#e4405f' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#1da1f2' }}>
                <TwitterIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
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

export default NotificationsPage;
