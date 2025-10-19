import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Notifications,
  Email,
  Schedule,
  Business,
  Assignment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { brandColors } from '../theme/theme';

interface NotificationSettings {
  // Listing Notifications
  newListingCreated: boolean;
  listingExpirationReminder: boolean;
  listingExpired: boolean;
  listingDateChanged: boolean;
  listingPriceChanged: boolean;
  listingExpirationDays: number;
  
  // Transaction Notifications
  transactionClosingReminder: boolean;
  transactionExpired: boolean;
  newTransactionCreated: boolean;
  documentSubmitted: boolean;
  checklistComplete: boolean;
  transactionDateChanged: boolean;
  salesPriceChanged: boolean;
  transactionClosingDays: number;
  
  // Dead Transactions
  transactionCancelled: boolean;
  listingWithdrawn: boolean;
  
  // Company Wide Notifications
  agentSummaryBeforeClosing: boolean;
  agentSummaryAfterClosing: boolean;
  agentListingExpirationReminder: boolean;
  agentDocumentReminder: boolean;
  companyClosingDays: number;
  companyListingDays: number;
  companyReminderDays: number;
  companyFollowUpDays: number;
  
  // Task Email Notifications
  newTaskAssigned: boolean;
  taskAccepted: boolean;
  taskDeclined: boolean;
  dailyTaskSummary: boolean;
}

const NotificationsSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>({
    // Listing Notifications
    newListingCreated: true,
    listingExpirationReminder: true,
    listingExpired: true,
    listingDateChanged: true,
    listingPriceChanged: true,
    listingExpirationDays: 3,
    
    // Transaction Notifications
    transactionClosingReminder: true,
    transactionExpired: true,
    newTransactionCreated: true,
    documentSubmitted: true,
    checklistComplete: true,
    transactionDateChanged: true,
    salesPriceChanged: true,
    transactionClosingDays: 3,
    
    // Dead Transactions
    transactionCancelled: true,
    listingWithdrawn: true,
    
    // Company Wide Notifications
    agentSummaryBeforeClosing: false,
    agentSummaryAfterClosing: false,
    agentListingExpirationReminder: false,
    agentDocumentReminder: false,
    companyClosingDays: 3,
    companyListingDays: 3,
    companyReminderDays: 3,
    companyFollowUpDays: 7,
    
    // Task Email Notifications
    newTaskAssigned: false,
    taskAccepted: false,
    taskDeclined: false,
    dailyTaskSummary: false,
  });

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving notification settings:', settings);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    // TODO: Implement next step functionality
    console.log('Moving to next step');
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
              Back to Profile
            </Link>
            <Typography color="text.primary">Notifications</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" sx={{ 
            color: brandColors.primary,
            fontWeight: 700,
            mb: 1
          }}>
            Notification Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customize your email notifications for listings, transactions, and tasks
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Left Side - Navigation */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                Settings Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="text"
                  startIcon={<Email />}
                  sx={{ 
                    justifyContent: 'flex-start',
                    color: brandColors.primary,
                    backgroundColor: brandColors.backgrounds.selected,
                    '&:hover': {
                      backgroundColor: brandColors.backgrounds.hover,
                    }
                  }}
                >
                  Email Notifications
                </Button>
                <Button
                  variant="text"
                  startIcon={<Schedule />}
                  sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
                >
                  Timing Preferences
                </Button>
                <Button
                  variant="text"
                  startIcon={<Business />}
                  sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
                >
                  Company Settings
                </Button>
                <Button
                  variant="text"
                  startIcon={<Assignment />}
                  sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
                >
                  Task Notifications
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Right Side - Settings */}
          <Box sx={{ flex: '1 1 600px', minWidth: '600px' }}>
            <Paper sx={{ p: 4 }}>
              {/* Listing Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: brandColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Email color="primary" />
                  Listing Notifications
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.newListingCreated}
                        onChange={(e) => handleSettingChange('newListingCreated', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me when a new listing is created"
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.listingExpirationReminder}
                          onChange={(e) => handleSettingChange('listingExpirationReminder', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Email me"
                    />
                    <TextField
                      type="number"
                      value={settings.listingExpirationDays}
                      onChange={(e) => handleSettingChange('listingExpirationDays', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography>days before the listing expiration date</Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.listingExpired}
                        onChange={(e) => handleSettingChange('listingExpired', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if a listing passes the expiration date"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.listingDateChanged}
                        onChange={(e) => handleSettingChange('listingDateChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if the list date or expiration date changes"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.listingPriceChanged}
                        onChange={(e) => handleSettingChange('listingPriceChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if the list price changes"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Transaction Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: brandColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Schedule color="primary" />
                  Transaction Notifications
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.transactionClosingReminder}
                          onChange={(e) => handleSettingChange('transactionClosingReminder', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Email me"
                    />
                    <TextField
                      type="number"
                      value={settings.transactionClosingDays}
                      onChange={(e) => handleSettingChange('transactionClosingDays', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography>days before the transaction closing date</Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.transactionExpired}
                        onChange={(e) => handleSettingChange('transactionExpired', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if a transaction passes the closing date"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.newTransactionCreated}
                        onChange={(e) => handleSettingChange('newTransactionCreated', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me when a new transaction is created"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.documentSubmitted}
                        onChange={(e) => handleSettingChange('documentSubmitted', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me when a doc has been submitted for review"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.checklistComplete}
                        onChange={(e) => handleSettingChange('checklistComplete', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me when a checklist is 100% complete"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.transactionDateChanged}
                        onChange={(e) => handleSettingChange('transactionDateChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if the closing date or acceptance date changes"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.salesPriceChanged}
                        onChange={(e) => handleSettingChange('salesPriceChanged', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if the sales price changes"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Dead Transactions */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: brandColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Notifications color="primary" />
                  Dead Transactions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.transactionCancelled}
                        onChange={(e) => handleSettingChange('transactionCancelled', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if a transaction is cancelled"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.listingWithdrawn}
                        onChange={(e) => handleSettingChange('listingWithdrawn', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if a listing is withdrawn"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Company Wide Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: brandColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Business color="primary" />
                  Company Wide Notifications
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.agentSummaryBeforeClosing}
                          onChange={(e) => handleSettingChange('agentSummaryBeforeClosing', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Email agents a summary of the remaining required docs"
                    />
                    <TextField
                      type="number"
                      value={settings.companyClosingDays}
                      onChange={(e) => handleSettingChange('companyClosingDays', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography>days before their transaction's closing date</Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.agentSummaryAfterClosing}
                        onChange={(e) => handleSettingChange('agentSummaryAfterClosing', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email agents a summary of remaining required docs when their transaction closes"
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.agentListingExpirationReminder}
                          onChange={(e) => handleSettingChange('agentListingExpirationReminder', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Email agents"
                    />
                    <TextField
                      type="number"
                      value={settings.companyListingDays}
                      onChange={(e) => handleSettingChange('companyListingDays', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography>days before their listing's expiration date</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.agentDocumentReminder}
                          onChange={(e) => handleSettingChange('agentDocumentReminder', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Email agents to upload flagged docs"
                    />
                    <TextField
                      type="number"
                      value={settings.companyReminderDays}
                      onChange={(e) => handleSettingChange('companyReminderDays', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography>days after they create a file, and keep emailing every</Typography>
                    <TextField
                      type="number"
                      value={settings.companyFollowUpDays}
                      onChange={(e) => handleSettingChange('companyFollowUpDays', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography>days until the docs are uploaded</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Task Email Notifications */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: brandColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Assignment color="primary" />
                  Task Email Notifications
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.newTaskAssigned}
                        onChange={(e) => handleSettingChange('newTaskAssigned', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if I'm assigned a new task"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.taskAccepted}
                        onChange={(e) => handleSettingChange('taskAccepted', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if another user accepts my task"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.taskDeclined}
                        onChange={(e) => handleSettingChange('taskDeclined', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me if another user declines my task"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dailyTaskSummary}
                        onChange={(e) => handleSettingChange('dailyTaskSummary', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email me a daily summary of today's tasks and overdue tasks"
                  />
                </Box>
              </Box>
                          </Paper>
            </Box>
          </Box>

        {/* Navigation and Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 4,
          px: 2
        }}>
          <IconButton
            onClick={handleBack}
            sx={{ 
              color: brandColors.neutral[800],
              '&:hover': { color: brandColors.primary }
            }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleNext}
              sx={{ 
                color: brandColors.neutral[800],
                borderColor: brandColors.neutral[500],
                '&:hover': {
                  borderColor: brandColors.primary,
                  color: brandColors.primary
                }
              }}
            >
              Next
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
          
          <IconButton
            onClick={handleNext}
            sx={{ 
              color: brandColors.primary,
              '&:hover': { 
                backgroundColor: brandColors.backgrounds.hover 
              }
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default NotificationsSettingsPage;
