import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import ProfileHeader from '../components/ProfileHeader';
import { brandColors } from '../theme/theme';

const ListingsPage: React.FC = () => {
  const sampleListings = [
    {
      id: 1,
      address: '123 Main Street, City, State',
      price: '$450,000',
      status: 'Active',
      type: 'Single Family',
      daysOnMarket: 15
    },
    {
      id: 2,
      address: '456 Oak Avenue, City, State',
      price: '$325,000',
      status: 'Pending',
      type: 'Condo',
      daysOnMarket: 8
    },
    {
      id: 3,
      address: '789 Pine Road, City, State',
      price: '$675,000',
      status: 'Active',
      type: 'Multi-Family',
      daysOnMarket: 22
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <ProfileHeader 
        title="Manage Listings"
        subtitle="Create, edit, and manage your property listings"
        showBackArrow={true}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Your Listings
          </Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: brandColors.primary }}
          >
            + Add New Listing
          </Button>
        </Box>

        <Grid container spacing={3}>
          {sampleListings.map((listing) => (
            <Grid item xs={12} md={6} lg={4} key={listing.id}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {listing.address}
                  </Typography>
                  <Box 
                    sx={{ 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 1, 
                      backgroundColor: listing.status === 'Active' ? '#e8f5e8' : '#fff3e0',
                      color: listing.status === 'Active' ? '#2e7d32' : '#ed6c02',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {listing.status}
                  </Box>
                </Box>
                
                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 700, mb: 2 }}>
                  {listing.price}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Type: {listing.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {listing.daysOnMarket} days on market
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">Edit</Button>
                  <Button size="small" variant="outlined">View Details</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ListingsPage;
