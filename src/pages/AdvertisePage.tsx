import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem
} from '@mui/material';
import { 
  Campaign as AdsIcon,
  TrendingUp as GrowthIcon,
  Visibility as ExposureIcon,
  Speed as PerformanceIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
  Home as PropertyIcon,
  Business as BusinessIcon,
  AutoAwesome as PremiumIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const AdvertisePage: React.FC = () => {
  const advertisingPackages = [
    {
      id: 'listings',
      title: 'Property Listings',
      icon: <PropertyIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Showcase your properties to thousands of qualified buyers',
      features: ['Featured placement on search results', 'High-quality photo galleries', 'Virtual tour integration', '24/7 visibility'],
      price: 'Starting at $299/month'
    },
    {
      id: 'business',
      title: 'Business Profile',
      icon: <BusinessIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Promote your real estate business and grow your brand',
      features: ['Branded business page', 'Client reviews & testimonials', 'Service area targeting', 'Lead generation tools'],
      price: 'Starting at $499/month'
    },
    {
      id: 'premium',
      title: 'Premium Advertising',
      icon: <PremiumIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Maximum exposure with premium ad placements',
      features: ['Homepage banner placement', 'Priority search ranking', 'Email newsletter features', 'Social media promotion'],
      price: 'Custom pricing'
    }
  ];

  const benefits = [
    {
      icon: <ExposureIcon sx={{ fontSize: 50, color: brandColors.primary }} />,
      title: 'Massive Exposure',
      description: 'Reach thousands of active buyers, investors, and real estate professionals daily'
    },
    {
      icon: <GrowthIcon sx={{ fontSize: 50, color: brandColors.primary }} />,
      title: 'Proven Results',
      description: 'Our advertisers see an average 3x increase in leads within the first 30 days'
    },
    {
      icon: <PerformanceIcon sx={{ fontSize: 50, color: brandColors.primary }} />,
      title: 'Real-Time Analytics',
      description: 'Track views, clicks, and leads with detailed performance dashboards'
    }
  ];

  const adFormats = [
    { name: 'Featured Listings', description: 'Premium placement for your property listings' },
    { name: 'Banner Ads', description: 'High-visibility banner placements across the platform' },
    { name: 'Sponsored Content', description: 'Native advertising in relevant sections' },
    { name: 'Email Campaigns', description: 'Featured placement in our email newsletters' }
  ];

        return (
    <>
      <PageAppBar title="Dreamery – Advertise" />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa', pt: 10 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8, mt: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: brandColors.text.primary,
                mb: 2
              }}
            >
              Advertise on Dreamery
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              Connect with qualified buyers, investors, and real estate professionals. Grow your business with targeted advertising that delivers results.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                backgroundColor: brandColors.primary,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: brandColors.interactive.hover }
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Benefits Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Why Advertise with Us
            </Typography>
            <Grid container spacing={4}>
              {benefits.map((benefit, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {benefit.icon}
          </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        {benefit.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                        {benefit.description}
            </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Advertising Packages Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Advertising Packages
            </Typography>
            <Grid container spacing={4}>
              {advertisingPackages.map((pkg) => (
                <Grid item xs={12} md={4} key={pkg.id}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        {pkg.icon}
                        <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>
                          {pkg.title}
            </Typography>
          </Box>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {pkg.description}
            </Typography>
                      <Chip 
                        label={pkg.price} 
                        color="primary"
                        sx={{ mb: 3 }}
                      />
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        What's Included:
            </Typography>
                      <List dense disablePadding>
                        {pkg.features.map((feature, idx) => (
                          <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                            <CheckIcon sx={{ fontSize: 20, color: brandColors.primary, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {feature}
            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button 
                        size="large" 
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          backgroundColor: brandColors.primary,
                          py: 1.5,
                          '&:hover': { backgroundColor: brandColors.interactive.hover }
                        }}
                      >
                        Choose Plan
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Ad Formats Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Advertising Formats
            </Typography>
            <Grid container spacing={3}>
              {adFormats.map((format, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card elevation={2}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {format.name}
            </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format.description}
            </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box sx={{ mb: 8 }}>
            <Card 
              elevation={4}
          sx={{ 
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.interactive.hover} 100%)`,
                color: 'white'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 6 }}>
                <AdsIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                  Ready to Grow Your Business?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Join hundreds of successful real estate professionals advertising on Dreamery
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto', opacity: 0.9 }}>
                  Get started today and see results in as little as 24 hours. Our team will help you create the perfect advertising campaign for your goals.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                  sx={{ 
                      backgroundColor: 'white',
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Start Advertising
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
              sx={{ 
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': { 
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Contact Sales
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Stats Section */}
          <Box sx={{ mb: 8 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: 5 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
                  Platform Statistics
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                        50K+
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                        10K+
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Monthly Listings
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                        95%
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Satisfaction Rate
                </Typography>
              </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                        3x
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Average ROI
              </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          </Container>
      </Box>
    </>
  );
};

export default AdvertisePage;