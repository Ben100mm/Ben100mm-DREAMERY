import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import movingDetailsImage from '../moving-details-illustration.png';

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
  gap: 4rem;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ImageContainer = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 900px) {
    width: 300px;
    height: 300px;
  }
`;

const SellListMovingDetailsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state?.address || '';
  const sellChecked: boolean = Boolean(location.state?.sellChecked);
  const listChecked: boolean = Boolean(location.state?.listChecked);

  const signedAgreementLabel = sellChecked && listChecked
    ? "I've signed a listing agreement with an agent to list my home now and will sell if I get a resonable offer"
    : sellChecked
      ? "I've signed a listing agreement with an agent to sell my home"
      : "I've signed a listing agreement with an agent to list my home";

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleNext = () => {
    if (selectedOption) {
      navigate('/sell-moving-details-2', { 
        state: { 
          address: address,
          sellChecked,
          listChecked,
          movingDetails: selectedOption 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/sell', { state: { address: address } });
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      {/* Header with Progress Bar and Exit Button */}
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 200 }}>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={13} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1a365d',
                  borderRadius: 4,
                }
              }} 
            />
          </Box>
          <Button
            onClick={handleExit}
            sx={{
              color: '#666666',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#333333',
              }
            }}
          >
            Exit
          </Button>
        </Box>
      </HeaderSection>

      {/* Main Content */}
      <MainContent>
        <ContentWrapper>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1a365d', 
              mb: 2
            }}
          >
            Before we continue, do any of these describe your situation?
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666666', 
              mb: 4,
              fontSize: '14px'
            }}
          >
            If you've signed an agreement with an agent, we may need to share your selling options with them.
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedOption}
              onChange={handleOptionChange}
              sx={{ gap: 2 }}
            >
              <FormControlLabel
                value="agent_for_owner"
                control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                label="I'm the owner's real estate agent"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 500
                  }
                }}
              />
              <FormControlLabel
                value="agent_and_owner"
                control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                label="I'm both the owner and a licensed agent"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 500
                  }
                }}
              />
              <FormControlLabel
                value="working_with_builder"
                control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                label="I'm working with a home builder"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 500
                  }
                }}
              />
              <FormControlLabel
                value="signed_agreement"
                control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                label={signedAgreementLabel}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 500
                  }
                }}
              />
              <FormControlLabel
                value="none"
                control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                label="None of the above"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 500
                  }
                }}
              />
            </RadioGroup>
          </FormControl>
        </ContentWrapper>
        
        <ImageContainer>
          <img src={movingDetailsImage} alt="Watercolor houses illustration" />
        </ImageContainer>
      </MainContent>

      {/* Footer with Navigation Buttons */}
      <Box sx={{ 
        px: { xs: '1rem', md: '2rem' },
        py: { xs: '1rem', md: '2rem' },
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderColor: '#1a365d',
            color: '#1a365d',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#0d2340',
              backgroundColor: 'rgba(26, 54, 93, 0.04)',
            }
          }}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          variant="contained"
          sx={{
            backgroundColor: selectedOption ? '#1a365d' : '#cccccc',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: selectedOption ? '#0d2340' : '#cccccc',
            },
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#999999',
            }
          }}
        >
          Next
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SellListMovingDetailsPage; 