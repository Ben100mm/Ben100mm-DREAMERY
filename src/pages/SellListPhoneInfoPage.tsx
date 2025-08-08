import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Link
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
`;

const SellListPhoneInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleNext = () => {
    if (!phoneNumber.trim()) return;
    navigate('/sell-services', { 
      state: { 
        ...prevState, 
        phoneNumber: phoneNumber.trim()
      } 
    });
  };
  const handleBack = () => {
    navigate('/sell-contact-info', { state: prevState });
  };
  const handleExit = () => navigate('/');

  return (
    <PageContainer>
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Add contact info
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#1a365d', borderRadius: 4 } }}
            />
          </Box>
          <Button onClick={handleExit} sx={{ color: '#666666', textTransform: 'none' }}>Exit</Button>
        </Box>
      </HeaderSection>

      <MainContent>
        <ContentWrapper>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a365d', mb: 2, textAlign: 'center' }}>
            What's your phone number?
          </Typography>

          <Typography variant="body2" sx={{ color: '#666666', mb: 4, textAlign: 'center' }}>
            We'll send you a text so you can get help when you're ready. You don't need to reply.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="(555) 123-4567"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1a365d',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1a365d',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666666',
                  '&.Mui-focused': {
                    color: '#1a365d',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem', lineHeight: 1.5 }}>
              By tapping "Next", you agree that Dreamery Group and its affiliates, and other real estate professionals may call/text you about your inquiry, which may involve use of automated means and prerecorded/artificial voices. You don't need to consent as a condition of buying any property, goods or services. Message/data rates may apply. You also agree to our{' '}
              <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Terms of Use
              </Link>
              . We may share information about your recent and future site activity with your agent to help them understand what you're looking for in a home.
            </Typography>
          </Box>
        </ContentWrapper>
      </MainContent>

      <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', px: { xs: '1rem', md: '2rem' }, py: { xs: '0.75rem', md: '1rem' }, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', zIndex: 5 }}>
        <Button onClick={handleBack} variant="outlined" sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600 }}>Back</Button>
        <Button 
          onClick={handleNext} 
          disabled={!phoneNumber.trim()}
          variant="contained" 
          sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}
        >
          Next
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SellListPhoneInfoPage; 