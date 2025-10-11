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
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Campaign as CampaignIcon,
  Business as BusinessIcon,
  Home as PropertyIcon,
  TrendingUp as InvestorIcon,
  Handshake as AgentIcon,
  AccountBalance as LenderIcon,
  Build as ServiceIcon,
  Psychology as AIIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { brandColors } from '../theme/theme';

const AdvertisePage: React.FC = () => {
  const navigate = useNavigate();

  const advertisingOpportunities = [
    {
      id: 'property',
      title: 'Property Listings',
      icon: <PropertyIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Showcase your properties to qualified buyers and investors',
      features: ['Professional Photography', 'Virtual Tours', 'Market Analysis', 'Lead Generation'],
      pricing: 'Starting at $299/month',
      level: 'All Levels'
    },
    {
      id: 'services',
      title: 'Professional Services',
      icon: <ServiceIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Promote your real estate services to the right audience',
      features: ['Agent Profiles', 'Service Listings', 'Client Testimonials', 'Local SEO'],
      pricing: 'Starting at $199/month',
      level: 'All Levels'
    },
    {
      id: 'investment',
      title: 'Investment Opportunities',
      icon: <InvestorIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Connect with investors for your real estate deals',
      features: ['Deal Presentations', 'Investor Matching', 'Financial Modeling', 'Due Diligence Tools'],
      pricing: 'Starting at $499/month',
      level: 'Advanced'
    },
    {
      id: 'lending',
      title: 'Mortgage & Lending',
      icon: <LenderIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Reach borrowers looking for financing solutions',
      features: ['Rate Showcases', 'Pre-approval Tools', 'Application Forms', 'Rate Alerts'],
      pricing: 'Starting at $399/month',
      level: 'Professional'
    },
    {
      id: 'technology',
      title: 'PropTech Solutions',
      icon: <AIIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Market your technology solutions to the real estate industry',
      features: ['Product Demos', 'Case Studies', 'Integration Guides', 'Developer Resources'],
      pricing: 'Starting at $799/month',
      level: 'Enterprise'
    },
    {
      id: 'business',
      title: 'Business Services',
      icon: <BusinessIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Promote your business services to real estate professionals',
      features: ['Service Directory', 'Portfolio Showcases', 'Client Reviews', 'Industry Insights'],
      pricing: 'Starting at $249/month',
      level: 'All Levels'
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleViewSamples = () => {
    // This could open a modal or navigate to a samples page
    console.log('View sample advertisements');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.backgrounds.primary, position: 'relative' }}>
      
      {/* Back to Homepage Button */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          onClick={handleBackToHome}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: brandColors.primary,
            color: 'white',
            minWidth: 'auto',
            padding: 0,
            border: '3px solid white',
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: brandColors.actions.primary,
              transform: 'scale(1.05)',
              boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.5)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 24 }} />
        </Button>
      </Box>

      {/* Advertising Opportunities Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 2, color: brandColors.text.primary }}>
            Advertising Opportunities
          </Typography>
          <Typography variant="h6" sx={{ color: brandColors.text.secondary, maxWidth: 600, mx: 'auto' }}>
            Choose the perfect advertising solution for your business
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {advertisingOpportunities.map((opportunity) => (
            <Grid item xs={12} md={6} lg={4} key={opportunity.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${brandColors.shadows.hover}`,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {opportunity.icon}
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 600, ml: 2, color: brandColors.text.primary }}>
                      {opportunity.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 3, color: brandColors.text.secondary, lineHeight: 1.6 }}>
                    {opportunity.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.text.primary }}>
                      Features:
                    </Typography>
                    <List dense>
                      {opportunity.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={feature}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.9rem',
                                color: brandColors.text.secondary,
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={opportunity.pricing}
                      sx={{
                        backgroundColor: brandColors.primary,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={opportunity.level}
                      variant="outlined"
                      sx={{
                        borderColor: brandColors.primary,
                        color: brandColors.primary,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      backgroundColor: brandColors.primary,
                      color: 'white',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: brandColors.actions.primary,
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sample Advertisements Section */}
      <Box sx={{ backgroundColor: brandColors.backgrounds.secondary, py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 2, color: brandColors.text.primary }}>
              Sample Advertisements
            </Typography>
            <Typography variant="h6" sx={{ color: brandColors.text.secondary, maxWidth: 600, mx: 'auto' }}>
              See how your ads will look on our platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <PropertyIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Property Listing Ad
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                    Beautiful 3BR/2BA home in prime location
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <ServiceIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Service Provider Ad
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                    Professional real estate photography services
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <BusinessIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Business Services Ad
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                    Title insurance and closing services
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 3, color: brandColors.text.primary }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: brandColors.text.secondary, maxWidth: 600, mx: 'auto' }}>
          Join thousands of real estate professionals who trust Dreamery for their advertising needs
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            backgroundColor: brandColors.primary,
            color: 'white',
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: brandColors.actions.primary,
            }
          }}
        >
          Start Advertising Today
        </Button>
      </Container>
    </Box>
  );
};

export default AdvertisePage;
