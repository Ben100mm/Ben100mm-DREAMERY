import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import finalSellListImage from '../final sell:list.png';

const PageContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const HeaderSection = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 120vh;
`;

const HeroIllustration = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    max-width: 100%;
  }
`;

const SellListServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  const handleBack = () => {
    navigate('/sell-summary', { state: formData });
  };
  const handleExit = () => navigate('/');

  // Extract data from form state
  const {
    address = '153 Silliman St, San Francisco, CA 94134',
    sellChecked = false,
    listChecked = false,
    homeQuality,
    homeQuality2,
    homeQuality3,
    homeQuality4,
    countertops,
    hoa,
    communityTypes = [],
    guard,
    propertyConditions = [],
    otherDetails,
    firstName,
    lastName,
    phoneNumber
  } = formData;

  const estimatedValue = 782148;
  const marketValueRange = [estimatedValue - 200000, estimatedValue + 200000];
  const agentFeesRange = [Math.round(estimatedValue * 0.03), Math.round(estimatedValue * 0.06)];
  const closingCosts = Math.round(estimatedValue * 0.01);
  const cashProceedsRange = [estimatedValue - agentFeesRange[1] - closingCosts, estimatedValue - agentFeesRange[0] - closingCosts];

  return (
    <PageContainer>
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
            Dreamery
          </Typography>
          <Button onClick={handleExit} sx={{ color: '#666666', textTransform: 'none' }}>Exit</Button>
        </Box>
      </HeaderSection>

      <MainContent>
        <HeroIllustration>
          <img src={finalSellListImage} alt="Sell or List Your Home" />
        </HeroIllustration>
        
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', mb: 1, textAlign: 'center' }}>
          {address}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 4, textAlign: 'center' }}>
          Your selling options
        </Typography>

        <Typography variant="body1" sx={{ color: '#666666', mb: 4, textAlign: 'center' }}>
          Here are your tailored selling options (based on the info you provided).
        </Typography>

        <Card sx={{ border: '2px solid #1a365d', borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M6 18L10 14L14 18L18 14L22 18L24 16V6L22 4H8L6 6V18Z" 
                      stroke="#1a365d" 
                      strokeWidth="1.5" 
                      fill="none"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M10 14V8H20V14" 
                      stroke="#1a365d" 
                      strokeWidth="1.5" 
                      fill="none"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M12 10H18" 
                      stroke="#1a365d" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', letterSpacing: '0.1em' }}>
                  DREAMERY
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#22c55e', mr: 2 }}>
                ${estimatedValue.toLocaleString()}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Updated Aug 15, 2025
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a365d', mb: 3 }}>
              Maximize sales price
            </Typography>

            <Box sx={{ backgroundColor: '#f0f9ff', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#1a365d', fontWeight: 500 }}>
                Have any questions? Speak to a Dreamery specialist.
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
              How it works
            </Typography>

            <Typography variant="body2" sx={{ color: '#666666', mb: 3 }}>
              Connect with a local Dreamery partner agent and get a Showcase listing at no additional cost. Sell when you're ready.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
              Highlights
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                • Get prime exposure on Dreamery resulting in 75% more views.
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                • Helps maximize your sale price by reaching more buyers on Dreamery.
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                • Sell for 2% more when using a premium Showcase listing.
              </Typography>
            </Box>

            <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#1a365d', fontWeight: 500 }}>
                Get Showcase for free when you sell with a Dreamery partner agent.
              </Typography>
            </Box>

            <Box sx={{ backgroundColor: '#f8fafc', p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
                    Get Showcase for free when you sell with a Dreamery partner agent
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, backgroundColor: '#1a365d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: '50%' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#1a365d', fontWeight: 500 }}>
                        Higher search ranking
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, backgroundColor: '#1a365d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: '50%' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#1a365d', fontWeight: 500 }}>
                        High resolution photos
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, backgroundColor: '#1a365d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: '50%' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#1a365d', fontWeight: 500 }}>
                        Interactive floor plan
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, backgroundColor: '#1a365d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: '50%' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#1a365d', fontWeight: 500 }}>
                        AI-powered virtual tours
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 200, 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      left: 10, 
                      backgroundColor: '#dc2626', 
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      Showcase
                    </Box>
                    
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      width: 24, 
                      height: 24, 
                      backgroundColor: '#f3f4f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Box sx={{ width: 16, height: 16, backgroundColor: '#ef4444', borderRadius: '50%' }} />
                    </Box>
                    
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 10, 
                      left: 10, 
                      right: 10,
                      backgroundColor: 'white',
                      p: 1,
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a365d' }}>
                        3 bds | 3 ba | 3,240 sqft - Active
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                        255 Mathewson Pl SW Atlanta, GA
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              fullWidth
              sx={{ 
                backgroundColor: '#1a365d', 
                color: 'white', 
                textTransform: 'none', 
                fontWeight: 600,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Find out more
            </Button>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 3 }}>
          Estimated costs and fees
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Est. market value
              </Typography>
              <Tooltip title="Estimated market value based on recent sales and property details" arrow>
                <IconButton size="small" sx={{ color: '#1a365d', p: 0 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${marketValueRange[0].toLocaleString()} - ${marketValueRange[1].toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Est. agent fees (3 - 6%)
              </Typography>
              <Tooltip title="Standard real estate agent commission rates" arrow>
                <IconButton size="small" sx={{ color: '#1a365d', p: 0 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${agentFeesRange[0].toLocaleString()} - ${agentFeesRange[1].toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Closing costs (1%)
              </Typography>
              <Tooltip title="Estimated closing costs including title insurance, escrow fees, and other transaction costs" arrow>
                <IconButton size="small" sx={{ color: '#1a365d', p: 0 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${closingCosts.toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Repair costs
              </Typography>
              <Tooltip title="Estimated repair costs based on property condition assessment" arrow>
                <IconButton size="small" sx={{ color: '#1a365d', p: 0 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#666666' }}>
              Pending walkthrough
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d' }}>
              Est. cash proceeds
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
              ${cashProceedsRange[0].toLocaleString()} - ${cashProceedsRange[1].toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Button 
          variant="contained" 
          fullWidth
          sx={{ 
            backgroundColor: '#1a365d', 
            color: 'white', 
            textTransform: 'none', 
            fontWeight: 600,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Find out more
        </Button>

        <Box sx={{ mt: 6, p: 3, backgroundColor: '#f8fafc', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 3 }}>
            Why choose Dreamery?
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              • Trusted by millions of homeowners nationwide
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              • Local expertise with national reach
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              • Transparent pricing and no hidden fees
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              • Dedicated support throughout your selling journey
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f0f9ff', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 3 }}>
            Next steps
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              1. Connect with your local Dreamery partner agent
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              2. Schedule a free home evaluation
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              3. Get your personalized selling strategy
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              4. List your home with maximum exposure
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, p: 3, backgroundColor: '#fef3c7', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#92400e', mb: 3 }}>
            Limited time offer
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#92400e', mb: 2 }}>
            Get your Showcase listing completely free when you sell with a Dreamery partner agent. 
            This premium feature normally costs $299 and includes:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#92400e' }}>
              • Higher search ranking in results
            </Typography>
            <Typography variant="body2" sx={{ color: '#92400e' }}>
              • High resolution professional photos
            </Typography>
            <Typography variant="body2" sx={{ color: '#92400e' }}>
              • Interactive floor plan
            </Typography>
            <Typography variant="body2" sx={{ color: '#92400e' }}>
              • AI-powered virtual tours
            </Typography>
          </Box>
        </Box>
      </MainContent>
    </PageContainer>
  );
};

export default SellListServicesPage; 