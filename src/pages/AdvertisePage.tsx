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
  Paper
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Event as CalendarIcon,
  Campaign as AdsIcon,
  LocalOffer as PromotionsIcon,
  Add as CreateIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const AdvertisePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'ads', label: 'Ads', icon: <AdsIcon /> },
    { id: 'promotions', label: 'Promotions', icon: <PromotionsIcon /> },
    { id: 'create', label: 'Create', icon: <CreateIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
  ];

  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Marketing Dashboard',
          subtitle: 'Overview of your advertising campaigns, performance metrics, and marketing activities'
        };
      case 'calendar':
        return {
          title: 'Marketing Calendar',
          subtitle: 'Schedule and manage your advertising campaigns, promotions, and marketing events'
        };
      case 'ads':
        return {
          title: 'Ads Management',
          subtitle: 'Create, edit, and manage your advertising campaigns across different platforms'
        };
      case 'promotions':
        return {
          title: 'Promotions',
          subtitle: 'Design and launch promotional campaigns, special offers, and marketing incentives'
        };
      case 'create':
        return {
          title: 'Create Campaign',
          subtitle: 'Build new advertising campaigns, design creatives, and set up targeting'
        };
      case 'analytics':
        return {
          title: 'Marketing Analytics',
          subtitle: 'Track performance metrics, ROI analysis, and campaign effectiveness insights'
        };
      case 'settings':
        return {
          title: 'Marketing Settings',
          subtitle: 'Configure your advertising preferences, billing, and account settings'
        };
      default:
        return { title: 'Marketing Tools', subtitle: 'Promote your listings, services, and brand effectively' };
    }
  };

  const getBannerIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'calendar':
        return <CalendarIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'ads':
        return <AdsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'promotions':
        return <PromotionsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'create':
        return <CreateIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'analytics':
        return <AnalyticsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'settings':
        return <SettingsIcon sx={{ fontSize: 28, color: 'white' }} />;
      default:
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your advertising campaigns, track performance metrics, and view marketing ROI across all channels.
            </Typography>
          </Box>
        );
      case 'calendar':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule and coordinate your marketing activities, plan campaign launches, and manage promotional events.
            </Typography>
          </Box>
        );
      case 'ads':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Ads Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, edit, and optimize your advertising campaigns. Manage budgets, targeting, and creative assets.
            </Typography>
          </Box>
        );
      case 'promotions':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Promotions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Design and launch promotional campaigns, special offers, and marketing incentives to attract customers.
            </Typography>
          </Box>
        );
      case 'create':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Create Campaign
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Build new advertising campaigns from scratch. Design creatives, set targeting parameters, and configure budgets.
            </Typography>
          </Box>
        );
      case 'analytics':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Analyze campaign performance, track conversion rates, and measure ROI to optimize your marketing strategy.
            </Typography>
          </Box>
        );
      case 'settings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your advertising preferences, manage billing and payment methods, and set account permissions.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a marketing option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Marketing Tools" />
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
            {/* Top Banner (matches other pages) */}
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

export default AdvertisePage;
