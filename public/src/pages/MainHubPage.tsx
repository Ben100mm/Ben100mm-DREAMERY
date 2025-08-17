import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import { brandColors } from '../theme/theme';

const MainHubPage: React.FC = () => {
  const navigate = useNavigate();

  const hubSections = [
    {
      title: 'Manage Listings',
      description: 'Create, edit, and manage your property listings',
      route: '/listings',
      color: brandColors.primary
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences and settings',
      route: '/notifications',
      color: brandColors.secondary
    },
    {
      title: 'Profile',
      description: 'Update your profile and account information',
      route: '/profile',
      color: brandColors.success
    },
    {
      title: 'Documents',
      description: 'Review and manage transaction documents',
      route: '/documents',
      color: brandColors.warning
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <ProfileHeader 
        title="Dreamery's Listing Agents Hub"
        subtitle="Professional listing management and offer oversight"
        showBackArrow={false}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>
          Welcome to Dreamery's Listing Agents Hub
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary', textAlign: 'center' }}>
          Your central command center for professional listing management and offer oversight
        </Typography>

        <Grid container spacing={4}>
          {hubSections.map((section) => (
            <Grid item xs={12} md={6} key={section.title}>
              <Paper 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => navigate(section.route)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: section.color,
                      mr: 2
                    }} 
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                  {section.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: section.color, 
                    color: section.color,
                    '&:hover': {
                      borderColor: section.color,
                      backgroundColor: `${section.color}10`
                    }
                  }}
                >
                  Access {section.title}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainHubPage;
