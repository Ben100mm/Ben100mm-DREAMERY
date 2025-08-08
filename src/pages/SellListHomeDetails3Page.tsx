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
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  IconButton
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
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
  position: relative;
  /* Make inner box independently scrollable when content grows */
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 96px; /* leave room so sticky footer doesn't cover fields */
`;

const ScrollButton = styled(IconButton)`
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: #1a365d;
  color: white;
  &:hover {
    background: #0d2340;
  }
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

const SellListHomeDetails3Page: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    address,
    sellChecked,
    listChecked,
    movingDetails,
    sellTiming,
    listTiming,
    homeDetails,
    homeDetails2
  } = location.state || {};

  // Basement progression state
  const [hasBasement, setHasBasement] = useState<string>('');
  const [basementUse, setBasementUse] = useState('');
  const [knowsSqft, setKnowsSqft] = useState<string>('');
  const [finishedSqft, setFinishedSqft] = useState('');
  const [unfinishedSqft, setUnfinishedSqft] = useState('');

  const handleNext = () => {
    navigate('/sell-home-quality', {
      state: {
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming,
        listTiming,
        homeDetails,
        homeDetails2,
        homeDetails3: {
          hasBasement,
          basementUse,
          knowsSqft,
          finishedSqft,
          unfinishedSqft,
        },
      },
    });
  };

  const handleBack = () => {
    navigate('/sell-home-details-2', {
      state: {
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming,
        listTiming,
        homeDetails,
        homeDetails2,
      },
    });
  };

  const handleExit = () => navigate('/');
  const footerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <PageContainer>
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Home details
            </Typography>
            <LinearProgress
              variant="determinate"
              value={98}
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
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a365d', mb: 2 }}>
            Does your home have a basement?
          </Typography>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              row={false}
              value={hasBasement}
              onChange={(e) => setHasBasement(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />} label="Yes" />
              <FormControlLabel value="no" control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />} label="No" />
            </RadioGroup>
          </FormControl>

          {hasBasement === 'yes' && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                Basement condition
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel id="basement-use-label">Basement</InputLabel>
                <Select
                  labelId="basement-use-label"
                  value={basementUse}
                  label="Basement"
                  onChange={(e) => setBasementUse(e.target.value)}
                >
                  <MenuItem value={''}></MenuItem>
                  <MenuItem value={'Not Functional'}>Not Functional</MenuItem>
                  <MenuItem value={'For Storage'}>For Storage</MenuItem>
                  <MenuItem value={'Fully Functional and Furnishable'}>Fully Functional and Furnishable</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                Do you know the square footage of the basement?
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup value={knowsSqft} onChange={(e) => setKnowsSqft(e.target.value)}>
                  <FormControlLabel value="yes" control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />} label="No" />
                </RadioGroup>
              </FormControl>

              {knowsSqft === 'yes' && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                    What's the square footage of the basement?
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block' }}>
                    It's okay to estimate.
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    label="Finished area (sqft)"
                    value={finishedSqft}
                    onChange={(e) => setFinishedSqft(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Unfinished area (sqft)"
                    value={unfinishedSqft}
                    onChange={(e) => setUnfinishedSqft(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </>
              )}
            </>
          )}
        </ContentWrapper>

        <ImageContainer>
          <img src={process.env.PUBLIC_URL + '/home-details-3.png'} alt="Home details 3" />
        </ImageContainer>
      </MainContent>

      <Box
        ref={footerRef}
        sx={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          px: { xs: '1rem', md: '2rem' },
          py: { xs: '1rem', md: '2rem' },
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #e0e0e0',
          zIndex: 5,
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
      {knowsSqft === 'yes' && (
        <ScrollButton
          aria-label="Scroll to actions"
          onClick={() => footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })}
        >
          <KeyboardArrowDown />
        </ScrollButton>
      )}
    </PageContainer>
  );
};

export default SellListHomeDetails3Page;