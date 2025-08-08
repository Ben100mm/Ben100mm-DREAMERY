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
import movingDetailsImage from '../moving-details-illustration-2.png';

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

const SellListMovingDetails2Page: React.FC = () => {
  const [sellTiming, setSellTiming] = useState('');
  const [listTiming, setListTiming] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { address, sellChecked, listChecked, movingDetails } = location.state || {};

  const handleSellTimingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSellTiming(value);
    // If both are selected, update list timing to match
    if (sellChecked && listChecked) {
      setListTiming(value);
    }
  };

  const handleListTimingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setListTiming(value);
    // If both are selected, update sell timing to match
    if (sellChecked && listChecked) {
      setSellTiming(value);
    }
  };

  const handleNext = () => {
    // When both are selected, use the same timing for both
    const finalSellTiming = sellChecked ? sellTiming : '';
    const finalListTiming = listChecked ? (sellChecked && listChecked ? sellTiming : listTiming) : '';
    
    if ((sellChecked && !sellTiming) || (listChecked && !listTiming)) {
      return; // Don't proceed if required selections aren't made
    }

    navigate('/sell-home-details', { 
      state: { 
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming: finalSellTiming,
        listTiming: finalListTiming
      } 
    });
  };

  const handleBack = () => {
    navigate('/sell-moving-details', { 
      state: { 
        address,
        sellChecked,
        listChecked
      } 
    });
  };

  const handleExit = () => {
    navigate('/');
  };

  const timingOptions = [
    { value: 'asap', label: 'As soon as possible' },
    { value: '1month', label: 'Within 1 month' },
    { value: '2-3months', label: '2-3 months' },
    { value: '4+months', label: '4+ months' },
    { value: 'browsing', label: 'Just browsing' }
  ];

  return (
    <PageContainer>
      {/* Header with Progress Bar and Exit Button */}
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 200 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Moving details
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={75} 
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
          {sellChecked && listChecked ? (
            // Both Sell and List selected - show single question
            <>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1a365d', 
                  mb: 3
                }}
              >
                How soon would you like to sell or list?
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={sellTiming}
                  onChange={handleSellTimingChange}
                  sx={{ gap: 2 }}
                >
                  {timingOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                      label={option.label}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '16px',
                          color: '#333333',
                          fontWeight: 500
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </>
          ) : sellChecked ? (
            // Only Sell selected
            <>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1a365d', 
                  mb: 3
                }}
              >
                How soon would you like to sell?
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={sellTiming}
                  onChange={handleSellTimingChange}
                  sx={{ gap: 2 }}
                >
                  {timingOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                      label={option.label}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '16px',
                          color: '#333333',
                          fontWeight: 500
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </>
          ) : (
            // Only List selected
            <>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1a365d', 
                  mb: 3
                }}
              >
                How soon would you like to list?
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={listTiming}
                  onChange={handleListTimingChange}
                  sx={{ gap: 2 }}
                >
                  {timingOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />}
                      label={option.label}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '16px',
                          color: '#333333',
                          fontWeight: 500
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </>
          )}
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
          disabled={
            (sellChecked && !sellTiming) || 
            (listChecked && !listTiming) ||
            (!sellChecked && !listChecked)
          }
          variant="contained"
          sx={{
            backgroundColor: '#1a365d',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#0d2340',
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

export default SellListMovingDetails2Page; 