import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
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
  gap: 4rem;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ImageContainer = styled.div`
  width: 560px;
  height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 900px) {
    width: 360px;
    height: 360px;
  }
`;

const CounterRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void; }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    <Typography sx={{ color: '#333333', fontWeight: 600 }}>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <IconButton
        onClick={() => onChange(Math.max(0, value - 1))}
        sx={{ width: 36, height: 36, border: '1px solid #cbd5e1', borderRadius: '50%', color: '#1a365d' }}
      >
        <Remove />
      </IconButton>
      <Box sx={{ width: 36, textAlign: 'center', fontWeight: 700, color: '#1a365d' }}>{value}</Box>
      <IconButton
        onClick={() => onChange(value + 1)}
        sx={{ width: 36, height: 36, border: '1px solid #cbd5e1', borderRadius: '50%', color: '#1a365d' }}
      >
        <Add />
      </IconButton>
    </Box>
  </Box>
);

const SellListHomeDetails2Page: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    address,
    sellChecked,
    listChecked,
    movingDetails,
    sellTiming,
    listTiming,
    homeDetails
  } = location.state || {};

  const [poolType, setPoolType] = useState('');
  const [garageSpaces, setGarageSpaces] = useState(0);
  const [carportSpaces, setCarportSpaces] = useState(0);

  const handleNext = () => {
    navigate('/sell-home-details-3', {
      state: {
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming,
        listTiming,
        homeDetails,
        homeDetails2: {
          poolType,
          garageSpaces,
          carportSpaces,
        },
      },
    });
  };

  const handleBack = () => {
    navigate('/sell-home-details', {
      state: {
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming,
        listTiming,
        homeDetails,
      },
    });
  };

  const handleExit = () => navigate('/');

  return (
    <PageContainer>
      {/* Header with Progress Bar and Exit Button */}
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={33}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1a365d',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Button onClick={handleExit} sx={{ color: '#666666', textTransform: 'none' }}>
            Exit
          </Button>
        </Box>
      </HeaderSection>

      <MainContent>
        <ContentWrapper>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a365d', mb: 3 }}>
            Does your home have a pool?
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: 4 }}>
            <InputLabel id="pool-type-label">Pool</InputLabel>
            <Select
              labelId="pool-type-label"
              value={poolType}
              label="Pool"
              onChange={(e) => setPoolType(e.target.value)}
            >
              <MenuItem value={''}></MenuItem>
              <MenuItem value={'No'}>No</MenuItem>
              <MenuItem value={'In-ground'}>In-ground</MenuItem>
              <MenuItem value={'Above ground'}>Above ground</MenuItem>
              <MenuItem value={'Community Pool'}>Community Pool</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>
            How many covered parking spaces does your home have?
          </Typography>

          <CounterRow label="Garage" value={garageSpaces} onChange={setGarageSpaces} />
          <CounterRow label="Carport" value={carportSpaces} onChange={setCarportSpaces} />
        </ContentWrapper>

        <ImageContainer>
          <img src={process.env.PUBLIC_URL + '/home-details-2.png'} alt="Home details 2" />
        </ImageContainer>
      </MainContent>

      {/* Footer with Navigation Buttons */}
      <Box
        sx={{
          px: { xs: '1rem', md: '2rem' },
          py: { xs: '1rem', md: '2rem' },
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600 }}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          variant="contained"
          sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}
        >
          Next
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SellListHomeDetails2Page;