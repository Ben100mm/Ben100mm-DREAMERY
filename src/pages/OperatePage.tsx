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
  Receipt as ExpenseIcon,
  Schedule as ContractorIcon,
  TrendingUp as OptimizationIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const OperatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'projects', label: 'Projects', icon: <ProjectsIcon /> },
    { id: 'createproject', label: 'Create a New Project', icon: <CreateProjectIcon /> },
    { id: 'expenses', label: 'Expense Tracking', icon: <ExpenseIcon /> },
    { id: 'contractors', label: 'Contractor & Vendor Scheduling', icon: <ContractorIcon /> },
    { id: 'optimization', label: 'Portfolio Optimization Suggestions', icon: <OptimizationIcon /> }
  ];

  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Operations Dashboard',
          subtitle: 'Centralized overview of your property operations, performance metrics, and ongoing activities'
        };
      case 'projects':
        return {
          title: 'Projects',
          subtitle: 'Manage and track all your active operational projects and property improvements'
        };
      case 'createproject':
        return {
          title: 'Create a New Project',
          subtitle: 'Start a new operational project, renovation, or property improvement initiative'
        };
      case 'expenses':
        return {
          title: 'Expense Tracking',
          subtitle: 'Monitor and categorize all operational expenses, maintenance costs, and property expenditures'
        };
      case 'contractors':
        return {
          title: 'Contractor & Vendor Scheduling',
          subtitle: 'Schedule and manage contractors, vendors, and service providers for property operations'
        };
      case 'optimization':
        return {
          title: 'Portfolio Optimization Suggestions',
          subtitle: 'AI-powered recommendations for improving property performance and portfolio returns'
        };
      default:
        return { title: 'Property Operations', subtitle: 'Ongoing operations and tools for investment properties' };
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
      case 'expenses':
        return <ExpenseIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'contractors':
        return <ContractorIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'optimization':
        return <OptimizationIcon sx={{ fontSize: 28, color: 'white' }} />;
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
              Operations Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your property operations, track performance metrics, and view ongoing activities across your portfolio.
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
              View and manage all your active operational projects, renovations, and property improvements.
            </Typography>
          </Box>
        );
      case 'createproject':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Create a New Project
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start a new operational project with step-by-step setup for renovations, improvements, or maintenance.
            </Typography>
          </Box>
        );
      case 'expenses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Expense Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and categorize all operational expenses, maintenance costs, and property-related expenditures.
            </Typography>
          </Box>
        );
      case 'contractors':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Contractor & Vendor Scheduling
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule and manage contractors, vendors, and service providers for property operations and maintenance.
            </Typography>
          </Box>
        );
      case 'optimization':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Portfolio Optimization Suggestions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AI-powered recommendations for improving property performance, reducing costs, and maximizing portfolio returns.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select an operations option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Property Operations" />
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

export default OperatePage;
