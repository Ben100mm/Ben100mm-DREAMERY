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
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  PersonAdd as InvestorIcon,
  Security as ComplianceIcon,
  Calculate as CalculatorIcon,
  AccountBox as PortalIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const FundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'projects', label: 'Projects', icon: <ProjectsIcon /> },
    { id: 'createproject', label: 'Create New Project', icon: <CreateProjectIcon /> },
    { id: 'investor', label: 'Investor Onboarding', icon: <InvestorIcon /> },
    { id: 'compliance', label: 'Capital Raise Compliance Tools', icon: <ComplianceIcon /> },
    { id: 'calculator', label: 'Waterfall & ROI Calculators', icon: <CalculatorIcon /> },
    { id: 'portal', label: 'Secure Investor Portal', icon: <PortalIcon /> }
  ];

  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Fundraising Dashboard',
          subtitle: 'Centralized overview of your capital raising activities and project performance'
        };
      case 'projects':
        return {
          title: 'Projects',
          subtitle: 'Manage and track all your real estate fundraising projects'
        };
      case 'createproject':
        return {
          title: 'Create New Project',
          subtitle: 'Start a new real estate investment opportunity and fundraising campaign'
        };
      case 'investor':
        return {
          title: 'Investor Onboarding',
          subtitle: 'Streamlined process for bringing new investors into your projects'
        };
      case 'compliance':
        return {
          title: 'Capital Raise Compliance Tools',
          subtitle: 'Ensure regulatory compliance and proper documentation for fundraising activities'
        };
      case 'calculator':
        return {
          title: 'Waterfall & ROI Calculators',
          subtitle: 'Advanced financial modeling tools for project returns and investor distributions'
        };
      case 'portal':
        return {
          title: 'Secure Investor Portal',
          subtitle: 'Protected access for investors to view project updates and manage investments'
        };
      default:
        return { title: 'Fundraising Platform', subtitle: 'Raise capital for real estate projects' };
    }
  };

  const getBannerIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'projects':
        return <ProjectsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'createproject':
        return <CreateProjectIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'investor':
        return <InvestorIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'compliance':
        return <ComplianceIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'calculator':
        return <CalculatorIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'portal':
        return <PortalIcon sx={{ fontSize: 28, color: 'white' }} />;
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
              Fundraising Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your capital raising progress, investor activity, and project performance metrics.
            </Typography>
          </Box>
        );
      case 'projects':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage all your active and completed fundraising projects.
            </Typography>
          </Box>
        );
      case 'createproject':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Create New Project
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start a new real estate investment opportunity with step-by-step project setup.
            </Typography>
          </Box>
        );
      case 'investor':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Investor Onboarding
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Streamlined process for bringing new investors into your projects with compliance checks.
            </Typography>
          </Box>
        );
      case 'compliance':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Capital Raise Compliance Tools
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ensure regulatory compliance with built-in tools and documentation templates.
            </Typography>
          </Box>
        );
      case 'calculator':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Waterfall & ROI Calculators
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced financial modeling for project returns, investor distributions, and scenario analysis.
            </Typography>
          </Box>
        );
      case 'portal':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Secure Investor Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Protected access for investors to view project updates, documents, and manage their investments.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a fundraising option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Fundraising Platform" />
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

export default FundPage;
