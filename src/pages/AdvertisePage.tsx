import React from 'react';
import { 
  Box,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdvertisePage: React.FC = () => {
  const navigate = useNavigate();

  const advertisingOpportunities = [
    {
      id: 'property',
      title: 'Property Listings',
      description: 'Showcase properties to qualified buyers and investors',
      features: ['Professional Photography', 'Virtual Tours', 'Market Analysis', 'Lead Generation']
    },
    {
      id: 'services',
      title: 'Professional Services',
      description: 'Promote real estate services to the right audience',
      features: ['Agent Profiles', 'Service Listings', 'Client Testimonials', 'Local SEO']
    },
    {
      id: 'investment',
      title: 'Investment Opportunities',
      description: 'Connect with investors for real estate deals',
      features: ['Deal Presentations', 'Investor Matching', 'Financial Modeling', 'Due Diligence Tools']
    },
    {
      id: 'lending',
      title: 'Mortgage & Lending',
      description: 'Reach borrowers looking for financing solutions',
      features: ['Rate Showcases', 'Pre-approval Tools', 'Application Forms', 'Rate Alerts']
    },
    {
      id: 'technology',
      title: 'PropTech Solutions',
      description: 'Market technology solutions to the real estate industry',
      features: ['Product Demos', 'Case Studies', 'Integration Guides', 'Developer Resources']
    },
    {
      id: 'business',
      title: 'Business Services',
      description: 'Promote business services to real estate professionals',
      features: ['Service Directory', 'Portfolio Showcases', 'Client Reviews', 'Industry Insights']
    }
  ];

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box 
      sx={{ 
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        position: 'relative'
      }}
    >
      {/* Simple Back to Homepage Link */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Typography
          onClick={handleBackToHome}
          sx={{
            color: 'black',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '16px',
          }}
        >
          ← Back to Home
        </Typography>
      </Box>

      {/* Plain Text Sections with Scroll-Snap */}
      {advertisingOpportunities.map((opportunity, index) => (
        <Box
          key={opportunity.id}
          sx={{
            height: '100vh',
            width: '100%',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            position: 'relative',
            padding: '40px',
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 800 }}>
            <Typography 
              sx={{ 
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: 'black'
              }}
            >
              {opportunity.title}
            </Typography>
            
            <Typography 
              sx={{ 
                fontSize: '20px',
                marginBottom: '30px',
                color: 'black',
                lineHeight: 1.5
              }}
            >
              {opportunity.description}
            </Typography>

            <Typography 
              sx={{ 
                fontSize: '18px',
                color: 'black',
                lineHeight: 1.6
              }}
            >
              Features: {opportunity.features.join(', ')}
            </Typography>
          </Box>
          
          {/* Section indicator */}
          <Typography
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'black',
              fontSize: '14px',
            }}
          >
            {index + 1} / {advertisingOpportunities.length}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AdvertisePage;
