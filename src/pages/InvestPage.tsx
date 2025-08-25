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
  Group as CrowdfundingIcon,
  Handshake as JointVentureIcon,
  PieChart as FractionalIcon,
  Business as PrivateMarketIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const InvestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('crowdfunding');

  const sidebarItems = [
    { id: 'crowdfunding', label: 'Crowdfunded Deals', icon: <CrowdfundingIcon /> },
    { id: 'jointventure', label: 'Joint Venture', icon: <JointVentureIcon /> },
    { id: 'fractional', label: 'Fractional Ownership', icon: <FractionalIcon /> },
    { id: 'privatemarket', label: 'Private Market Investment Listings', icon: <PrivateMarketIcon /> }
  ];

  const getBanner = () => {
    switch (activeTab) {
      case 'crowdfunding':
        return {
          title: 'Crowdfunded Deals',
          subtitle: 'Access to vetted real estate investment opportunities through crowdfunding platforms'
        };
      case 'jointventure':
        return {
          title: 'Joint Venture',
          subtitle: 'Partner with experienced developers and investors on larger projects'
        };
      case 'fractional':
        return {
          title: 'Fractional Ownership',
          subtitle: 'Own a portion of premium properties with lower capital requirements'
        };
      case 'privatemarket':
        return {
          title: 'Private Market Investment Listings',
          subtitle: 'Exclusive access to off-market investment opportunities and private placements'
        };
      default:
        return { title: 'Investment Opportunities', subtitle: 'Connect to real estate investment opportunities' };
    }
  };

  const getBannerIcon = () => {
    switch (activeTab) {
      case 'crowdfunding':
        return <CrowdfundingIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'jointventure':
        return <JointVentureIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'fractional':
        return <FractionalIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'privatemarket':
        return <PrivateMarketIcon sx={{ fontSize: 28, color: 'white' }} />;
      default:
        return <CrowdfundingIcon sx={{ fontSize: 28, color: 'white' }} />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'crowdfunding':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Crowdfunded Deals
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and invest in vetted real estate opportunities through our crowdfunding platform.
            </Typography>
          </Box>
        );
      case 'jointventure':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Joint Venture
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Partner with experienced developers and investors on larger real estate projects.
            </Typography>
          </Box>
        );
      case 'fractional':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Fractional Ownership
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Own a portion of premium properties with lower capital requirements and shared benefits.
            </Typography>
          </Box>
        );
      case 'privatemarket':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Private Market Investment Listings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access exclusive off-market investment opportunities and private placements.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select an investment option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Investment Opportunities" />
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

export default InvestPage;
