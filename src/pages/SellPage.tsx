import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Tabs,
  Tab,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  List as ListIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const SellPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const listingSteps = [
    'Property Details',
    'Photos & Media',
    'Pricing & Market Analysis',
    'Review & Publish'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    setSnackbar({ open: true, message: 'Property listed successfully!' });
    setActiveStep(0);
  };

  return (
    <PageTemplate title="Sell Your Property" subtitle="List your property and reach qualified buyers">
      <Box>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Create Listing" />
          <Tab label="Market Analysis" />
          <Tab label="Seller Tools" />
          <Tab label="My Listings" />
        </Tabs>

        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', mb: 3 }}>
              <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Create New Listing
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {listingSteps.map((step, index) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Step {index + 1} content will be implemented here.
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={index === listingSteps.length - 1 ? handleSubmit : handleNext}
                          sx={{ mr: 1, backgroundColor: '#1a365d' }}
                        >
                          {index === listingSteps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                      </Box>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === listingSteps.length && (
              <Paper square elevation={0} sx={{ p: 3, mt: 1, mb: 1 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Paper>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Market Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Current market trends and pricing data for your area.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Average Days on Market: 45" variant="outlined" />
                    <Chip label="Price per sqft: $250" variant="outlined" />
                    <Chip label="Market: Seller's Market" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    Comparable Sales
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Recent sales in your neighborhood to help with pricing.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="123 Main St: $450,000" variant="outlined" />
                    <Chip label="456 Oak Ave: $475,000" variant="outlined" />
                    <Chip label="789 Pine Rd: $425,000" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Pricing Calculator
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Get an accurate estimate of your property's value.
                  </Typography>
                  <Button variant="contained" sx={{ backgroundColor: '#1a365d' }}>
                    Calculate Value
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    Professional Photos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Schedule professional photography for your listing.
                  </Typography>
                  <Button variant="contained" sx={{ backgroundColor: '#1a365d' }}>
                    Book Photographer
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d' }}>
                    Virtual Tours
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Create immersive 3D tours of your property.
                  </Typography>
                  <Button variant="contained" sx={{ backgroundColor: '#1a365d' }}>
                    Create Tour
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', mb: 2 }}>
              <ListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              My Listings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No active listings. Create your first listing to get started.
            </Typography>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </PageTemplate>
  );
};

export default SellPage; 