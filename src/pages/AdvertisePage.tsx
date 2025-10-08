import React from 'react';
import styled from 'styled-components';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material';
import { 
  Business as BusinessIcon,
  HomeWork as PropertyIcon,
  TrendingUp as InvestorIcon,
  Group as AgentIcon,
  Campaign as CampaignIcon,
  Visibility as VisibilityIcon,
  Speed as PerformanceIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const HeroSection = styled(Box)`
  background: linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.interactive.hover} 100%);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/houses-watercolor.png') center/cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const HeroContent = styled(Box)`
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(Typography)`
  font-weight: 700;
  margin-bottom: 16px;
  color: ${brandColors.text.primary};
  text-align: center;
`;

const SectionSubtitle = styled(Typography)`
  color: ${brandColors.text.secondary};
  text-align: center;
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid ${brandColors.neutral[200]};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: ${brandColors.primary};
  }
`;

const CardHeader = styled(Box)`
  background: linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.interactive.hover} 100%);
  color: white;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled(Box)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureChip = styled(Chip)`
  margin: 4px;
  font-weight: 500;
`;

const PriceTag = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  color: ${brandColors.primary};
  margin: 16px 0;
`;

const BenefitsList = styled(Box)`
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BenefitItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  &::before {
    content: '✓';
    color: ${brandColors.success};
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const AdvertisePage: React.FC = () => {
  const advertisingPackages = [
    {
      id: 'property-showcase',
      title: 'Property Showcase',
      icon: <PropertyIcon sx={{ fontSize: 32 }} />,
      targetAudience: 'Property Owners & Listing Agents',
      description: 'Premium placement for your properties across the Dreamery platform',
      price: 'Starting at $299/month',
      features: [
        'Featured listings on marketplace homepage',
        'Priority search results placement',
        'Enhanced property detail pages with video tours',
        'Social media cross-promotion',
        'Weekly performance analytics',
        'Lead generation tools'
      ],
      tags: ['Most Popular', 'High ROI']
    },
    {
      id: 'agent-profile',
      title: 'Agent Profile Boost',
      icon: <AgentIcon sx={{ fontSize: 32 }} />,
      targetAudience: 'Real Estate Agents & Brokers',
      description: 'Increase your visibility and attract more clients',
      price: 'Starting at $199/month',
      features: [
        'Featured agent profile in search results',
        'Verified badge and professional highlights',
        'Client testimonials showcase',
        'Direct lead routing from platform',
        'Monthly performance reports',
        'Access to exclusive networking events'
      ],
      tags: ['Professional Growth', 'Lead Generation']
    },
    {
      id: 'investor-spotlight',
      title: 'Investor Spotlight',
      icon: <InvestorIcon sx={{ fontSize: 32 }} />,
      targetAudience: 'Real Estate Investors & Funds',
      description: 'Showcase your investment opportunities and track record',
      price: 'Starting at $499/month',
      features: [
        'Featured investor profile',
        'Investment opportunity listings',
        'Track record and portfolio showcase',
        'Direct connection to qualified investors',
        'Market insights and analytics',
        'Priority access to off-market deals'
      ],
      tags: ['Premium', 'High-Value Deals']
    },
    {
      id: 'business-enterprise',
      title: 'Enterprise Solutions',
      icon: <BusinessIcon sx={{ fontSize: 32 }} />,
      targetAudience: 'Businesses & Service Providers',
      description: 'Custom advertising solutions for real estate businesses',
      price: 'Custom Pricing',
      features: [
        'Custom branded landing pages',
        'Multi-channel advertising campaigns',
        'Dedicated account management',
        'Advanced analytics and reporting',
        'API integration capabilities',
        'White-label solutions available'
      ],
      tags: ['Enterprise', 'Custom Solutions']
    }
  ];

  const platformBenefits = [
    {
      icon: <VisibilityIcon sx={{ fontSize: 48, color: brandColors.primary }} />,
      title: 'Maximum Visibility',
      description: 'Reach thousands of active buyers, investors, and professionals on our platform daily'
    },
    {
      icon: <PerformanceIcon sx={{ fontSize: 48, color: brandColors.primary }} />,
      title: 'Performance Tracking',
      description: 'Real-time analytics and insights to optimize your advertising campaigns'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48, color: brandColors.primary }} />,
      title: 'Targeted Reach',
      description: 'Advanced targeting options to reach your ideal audience based on behavior and preferences'
    },
    {
      icon: <CampaignIcon sx={{ fontSize: 48, color: brandColors.primary }} />,
      title: 'Flexible Campaigns',
      description: 'Choose from various advertising formats and customize your campaigns to fit your goals'
    }
  ];

  return (
    <>
      <PageAppBar title="Dreamery – Advertising Opportunities" />
      
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Advertise with Dreamery
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}
            >
              Connect with buyers, investors, and real estate professionals
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto',
                fontSize: '1.1rem',
                opacity: 0.9
              }}
            >
              Leverage our powerful platform to showcase your properties, services, and expertise 
              to a highly engaged audience of real estate professionals and active buyers.
            </Typography>
          </Container>
        </HeroContent>
      </HeroSection>

      <Box sx={{ backgroundColor: brandColors.neutral[50], py: 8 }}>
        <Container maxWidth="lg">
          {/* Platform Benefits Section */}
          <Box sx={{ mb: 8 }}>
            <SectionTitle variant="h3">
              Why Advertise on Dreamery?
            </SectionTitle>
            <SectionSubtitle variant="body1">
              Join hundreds of successful real estate professionals who have grown their business with Dreamery
            </SectionSubtitle>
            
            <Grid container spacing={4}>
              {platformBenefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    {benefit.icon}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Advertising Packages Section */}
          <Box sx={{ mb: 8 }}>
            <SectionTitle variant="h3">
              Advertising Packages
            </SectionTitle>
            <SectionSubtitle variant="body1">
              Choose the perfect package for your business needs. All packages include dedicated support and performance tracking.
            </SectionSubtitle>
            
            <Grid container spacing={4}>
              {advertisingPackages.map((pkg) => (
                <Grid item xs={12} md={6} key={pkg.id}>
                  <StyledCard elevation={2}>
                    <CardHeader>
                      <IconWrapper>
                        {pkg.icon}
                      </IconWrapper>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {pkg.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {pkg.targetAudience}
                        </Typography>
                      </Box>
                    </CardHeader>
                    
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Box>
                        {pkg.tags.map((tag, idx) => (
                          <FeatureChip 
                            key={idx}
                            label={tag} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="body1" sx={{ mt: 2, mb: 2, color: brandColors.text.secondary }}>
                        {pkg.description}
                      </Typography>
                      
                      <PriceTag>
                        {pkg.price}
                      </PriceTag>
                      
                      <BenefitsList>
                        {pkg.features.map((feature, idx) => (
                          <BenefitItem key={idx}>
                            <Typography variant="body2">
                              {feature}
                            </Typography>
                          </BenefitItem>
                        ))}
                      </BenefitsList>
                      
                      <Button 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        sx={{ 
                          mt: 3,
                          backgroundColor: brandColors.primary,
                          '&:hover': {
                            backgroundColor: brandColors.interactive.hover
                          }
                        }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Call to Action Section */}
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 6, 
              backgroundColor: 'white',
              borderRadius: 4,
              boxShadow: 3
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Contact our advertising team to discuss custom solutions and learn how we can help you achieve your business goals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  backgroundColor: brandColors.primary,
                  px: 4,
                  '&:hover': {
                    backgroundColor: brandColors.interactive.hover
                  }
                }}
              >
                Contact Sales
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: brandColors.primary,
                  color: brandColors.primary,
                  px: 4,
                  '&:hover': {
                    borderColor: brandColors.interactive.hover,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Schedule a Demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AdvertisePage;