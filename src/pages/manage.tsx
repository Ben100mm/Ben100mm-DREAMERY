import React, { useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  AddHome as ListingIcon,
  Description as LeaseIcon,
  Assignment as ApplicationIcon,
  Payment as PaymentIcon,
  Settings as IntegrationIcon,
  Security as InsuranceIcon,
  Event as CalendarIcon,
  Chat as ChatIcon,
  MonetizationOn as EarningsIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const ManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accountSubTab, setAccountSubTab] = useState('personal');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'listings', label: 'Listings', icon: <ListingIcon /> },
    { id: 'messages', label: 'Messages', icon: <ChatIcon /> },
    { id: 'earnings', label: 'Earnings', icon: <EarningsIcon /> },
    { id: 'insights', label: 'Insights', icon: <InsightsIcon /> },
    { id: 'listing', label: 'Creating a Listing', icon: <ListingIcon /> },
    { id: 'leases', label: 'Online Leases', icon: <LeaseIcon /> },
    { id: 'applications', label: 'Rental Applications', icon: <ApplicationIcon /> },
    { id: 'payments', label: 'Online Rent Payments', icon: <PaymentIcon /> },
    { id: 'integrations', label: 'Integrations', icon: <IntegrationIcon /> },
    { id: 'insurance', label: 'Insurance', icon: <InsuranceIcon /> },
    { id: 'account', label: 'Manage Your Account', icon: <AccountIcon /> }
  ];

  const accountSubTabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'security', label: 'Login & Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'payments', label: 'Payments' },
    { id: 'taxes', label: 'Taxes' }
  ];

  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Property Management Dashboard',
          subtitle: 'Centralized overview of all property management activities and progress tracking'
        };
      case 'calendar':
        return {
          title: 'Calendar',
          subtitle: 'View and manage maintenance, lease, and payment schedules'
        };
      case 'listing':
        return {
          title: 'Creating a Listing',
          subtitle: 'Step-by-step tools to create and publish a listing'
        };
      case 'listings':
        return {
          title: 'Listings',
          subtitle: 'Browse, edit, and manage your active and archived listings'
        };
      case 'messages':
        return {
          title: 'Messages',
          subtitle: 'Conversations with tenants, applicants, and partners'
        };
      case 'earnings':
        return {
          title: 'Earnings',
          subtitle: 'Track rent collections, deposits, payouts, and monthly totals'
        };
      case 'insights':
        return {
          title: 'Insights',
          subtitle: 'Performance metrics, trends, and recommendations for your portfolio'
        };
      case 'account':
        return {
          title: 'Manage Your Account',
          subtitle: 'Update your profile, manage preferences, and control your account settings'
        };
      case 'leases':
        return {
          title: 'Online Leases',
          subtitle: 'Generate, send, and manage digital lease agreements with electronic signatures'
        };
      case 'applications':
        return {
          title: 'Rental Applications',
          subtitle: 'Process rental applications, conduct background checks, and manage tenant screening'
        };
      case 'payments':
        return {
          title: 'Online Rent Payments',
          subtitle: 'Accept online rent payments, track payment history, and manage late fees'
        };
      case 'integrations':
        return {
          title: 'Integrations',
          subtitle: 'Connect with third-party services, accounting software, and property management tools'
        };
      case 'insurance':
        return {
          title: 'Insurance',
          subtitle: 'Manage property insurance policies, claims, and coverage information'
        };
      default:
        return { title: 'Property Management', subtitle: 'Manage your portfolio with Dreamery' };
    }
  };

  const getBannerIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'calendar':
        return <CalendarIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'listing':
        return <ListingIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'listings':
        return <ListingIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'messages':
        return <ChatIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'earnings':
        return <EarningsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'insights':
        return <InsightsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'account':
        return <AccountIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'leases':
        return <LeaseIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'applications':
        return <ApplicationIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'payments':
        return <PaymentIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'integrations':
        return <IntegrationIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'insurance':
        return <InsuranceIcon sx={{ fontSize: 28, color: 'white' }} />;
      default:
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
    }
  };

  const renderAccountSubContent = () => {
    switch (accountSubTab) {
      case 'personal':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your name, contact information, and professional details.
            </Typography>
          </Box>
        );
      case 'security':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Login & Security
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your password, two-factor authentication, and login preferences.
            </Typography>
          </Box>
        );
      case 'privacy':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Privacy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Control your data sharing preferences and privacy settings.
            </Typography>
          </Box>
        );
      case 'notifications':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure email, SMS, and in-app notification preferences.
            </Typography>
          </Box>
        );
      case 'payments':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage payment methods, billing information, and subscription details.
            </Typography>
          </Box>
        );
      case 'taxes':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Taxes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View tax documents, update tax information, and manage tax preferences.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a sub-tab
            </Typography>
          </Box>
        );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to your property management dashboard.
            </Typography>
          </Box>
        );
      case 'calendar':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule view for tasks, inspections, rent due dates, and lease events.
            </Typography>
          </Box>
        );
      case 'listing':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Creating a Listing
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage property listings.
            </Typography>
          </Box>
        );
      case 'listings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Listings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage active, pending, and archived listings. Add filters, edit details, or publish.
            </Typography>
          </Box>
        );
      case 'messages':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Messages
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View conversations with tenants, applicants, and service partners.
            </Typography>
          </Box>
        );
      case 'earnings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Earnings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Summary of rent collections, payouts, and exportable statements.
            </Typography>
          </Box>
        );
      case 'insights':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Insights
            </Typography>
            <Typography variant="body1" color="text.secondary">
              KPIs, trends, and recommended actions across your portfolio.
            </Typography>
          </Box>
        );
      case 'account':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Manage your personal information, security settings, and preferences.
            </Typography>
            
            {/* Sub-tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={accountSubTab} 
                onChange={(e, newValue) => setAccountSubTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5
                  },
                  '& .Mui-selected': {
                    color: brandColors.primary,
                    fontWeight: 600
                  }
                }}
              >
                {accountSubTabs.map((tab) => (
                  <Tab 
                    key={tab.id} 
                    value={tab.id} 
                    label={tab.label}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Sub-tab content */}
            {renderAccountSubContent()}
          </Box>
        );
      case 'leases':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Online Leases
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and manage digital lease agreements.
            </Typography>
          </Box>
        );
      case 'applications':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Rental Applications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Process rental applications and tenant screening.
            </Typography>
          </Box>
        );
      case 'payments':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Online Rent Payments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Accept online rent payments and track history.
            </Typography>
          </Box>
        );
      case 'integrations':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Integrations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connect with third-party services.
            </Typography>
          </Box>
        );
      case 'insurance':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Insurance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage property insurance policies.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a tab from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Property Management" />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', mt: '64px' }}>
        {/* Left Sidebar */}
        <Paper 
          elevation={3} 
          sx={{ 
            width: 280, 
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Station Header */}
          <Box sx={{ px: 3, py: 2, mb: 1, flexShrink: 0 }}>
            <Box
              sx={{
                backgroundColor: '#1a365d',
                color: 'white',
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

          {/* Sidebar Navigation */}
          <List sx={{ px: 2, pt: 0, flex: 1, overflow: 'auto' }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => setActiveTab(item.id)}
                  selected={activeTab === item.id}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: '#1a365d',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1a365d',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                      '& .MuiListItemText-primary': {
                        color: 'white',
                        fontWeight: 600,
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(26, 54, 93, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40,
                      color: activeTab === item.id ? 'white' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: activeTab === item.id ? 600 : 400,
                      color: activeTab === item.id ? 'white' : 'inherit'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: 3, backgroundColor: '#fafafa', overflow: 'auto' }}>
          <Container maxWidth="lg">
            {/* Top Banner (matches CloseBuyerPage) */}
            <Paper
              elevation={0}
              sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: brandColors.primary,
                borderRadius: '16px 16px 0 0',
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getBannerIcon()}
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  {banner.title}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {banner.subtitle}
              </Typography>
            </Paper>

            {renderContent()}
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default ManagePage; 