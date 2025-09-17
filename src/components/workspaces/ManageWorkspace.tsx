import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { brandColors } from '../../theme';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Home as ListingIcon,
  Chat as ChatIcon,
  AttachMoney as EarningsIcon,
  Insights as InsightsIcon,
  Add as CreateListingIcon,
  Assignment as LeaseIcon,
  PersonAdd as ApplicationIcon,
  Payment as PaymentIcon,
  IntegrationInstructions as IntegrationIcon,
  Security as InsuranceIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';

interface ManageWorkspaceProps {
  activeTab: string;
}

const ManageWorkspace: React.FC<ManageWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Property Management Dashboard',
          subtitle: 'Centralized overview of your rental properties and management activities',
          icon: <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'calendar':
        return {
          title: 'Calendar',
          subtitle: 'Schedule and manage property maintenance, inspections, and tenant activities',
          icon: <CalendarIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'listings':
        return {
          title: 'Listings',
          subtitle: 'Manage your rental property listings and marketing',
          icon: <ListingIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'messages':
        return {
          title: 'Messages',
          subtitle: 'Communicate with tenants, contractors, and service providers',
          icon: <ChatIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'earnings':
        return {
          title: 'Earnings',
          subtitle: 'Track rental income, expenses, and financial performance',
          icon: <EarningsIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'insights':
        return {
          title: 'Insights',
          subtitle: 'Analytics and reports on property performance and market trends',
          icon: <InsightsIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'listing':
        return {
          title: 'Creating a Listing',
          subtitle: 'Step-by-step process to create and publish rental listings',
          icon: <CreateListingIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'leases':
        return {
          title: 'Online Leases',
          subtitle: 'Digital lease management and tenant onboarding',
          icon: <LeaseIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'applications':
        return {
          title: 'Rental Applications',
          subtitle: 'Process and manage tenant applications and screening',
          icon: <ApplicationIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'payments':
        return {
          title: 'Online Rent Payments',
          subtitle: 'Secure payment processing and rent collection management',
          icon: <PaymentIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'integrations':
        return {
          title: 'Integrations',
          subtitle: 'Connect with third-party property management tools and services',
          icon: <IntegrationIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'insurance':
        return {
          title: 'Insurance',
          subtitle: 'Property insurance management and claims processing',
          icon: <InsuranceIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'account':
        return {
          title: 'Manage Your Account',
          subtitle: 'Account settings, preferences, and profile management',
          icon: <AccountIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      default:
        return {
          title: 'Property Management Dashboard',
          subtitle: 'Centralized overview of your rental properties and management activities',
          icon: <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Property Management Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your rental properties, track performance metrics, and manage ongoing activities.
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
              Schedule and manage property maintenance, inspections, and tenant activities.
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
              Manage your rental property listings and marketing across multiple platforms.
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
              Communicate with tenants, contractors, and service providers in one place.
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
              Track rental income, expenses, and financial performance across your portfolio.
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
              Analytics and reports on property performance, market trends, and optimization opportunities.
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
              Step-by-step process to create and publish rental listings with professional photos and descriptions.
            </Typography>
          </Box>
        );
      case 'leases':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Online Leases
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Digital lease management, tenant onboarding, and document processing.
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
              Process and manage tenant applications, background checks, and screening.
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
              Secure payment processing, rent collection management, and financial tracking.
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
              Connect with third-party property management tools, accounting software, and services.
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
              Property insurance management, policy tracking, and claims processing.
            </Typography>
          </Box>
        );
      case 'account':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Manage Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Account settings, preferences, profile management, and security options.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a management option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <Box>
      {/* Banner */}
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
          {banner.icon}
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
            {banner.title}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {banner.subtitle}
        </Typography>
      </Paper>

      {/* Content */}
      <Box sx={{ pl: 0, ml: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default ManageWorkspace;
