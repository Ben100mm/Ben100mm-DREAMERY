import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardActionArea,
  CardContent,
  Radio
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
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 960px;
`;

// Uniform card height for all boxes so rows align visually
const CARD_MIN_HEIGHT = 280;

const PlaceholderImage: React.FC = () => (
  <Box
    sx={{
      width: '100%',
      height: { xs: 140, md: 180 },
      background: '#e5e7eb',
      borderRadius: 1,
    }}
  />
);

const optionDefs = [
  { value: 'fixer', title: 'Fixer upper', subtitle: 'Needs significant repairs' },
  { value: 'dated', title: 'Dated', subtitle: "Hasn't been updated recently" },
  { value: 'standard', title: 'Standard', subtitle: 'Updated with common finishes' },
  { value: 'high_end', title: 'High-end', subtitle: 'High-quality upgrades' },
  { value: 'luxury', title: 'Luxury', subtitle: 'Elegant, top-tier finishes' },
];

const SellListHomeQuality4Page: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [selected, setSelected] = useState<string>('');

  const handleNext = () => {
    if (!selected) return;
    navigate('/sell-additional-info', { state: { ...prevState, homeQuality4: selected } });
  };
  const handleBack = () => {
    navigate('/sell-home-quality-3', { state: prevState });
  };
  const handleExit = () => navigate('/');

  return (
    <PageContainer>
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Home quality
            </Typography>
                        <LinearProgress 
              variant="determinate" 
              value={67} 
              sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#1a365d', borderRadius: 4 } }}
            />
          </Box>
          <Button onClick={handleExit} sx={{ color: '#666666', textTransform: 'none' }}>Exit</Button>
        </Box>
      </HeaderSection>

      <MainContent>
        <ContentWrapper>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a365d', mb: 2 }}>
            How would you describe your kitchen?
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' },
            gap: 2,
            mb: 6
          }}>
            {optionDefs.map((opt, idx) => (
              <Box key={opt.value} sx={{ 
                gridColumn: { md: idx < 3 ? `span 2` : `span 3` }
              }}>
                <Card sx={{ border: selected === opt.value ? '2px solid #1a365d' : '1px solid #e5e7eb', borderRadius: 2, minHeight: { xs: CARD_MIN_HEIGHT, md: CARD_MIN_HEIGHT } }}>
                  <CardActionArea onClick={() => setSelected(opt.value)} sx={{ height: '100%', display: 'flex', alignItems: 'stretch', flexDirection: 'column' }}>
                    <PlaceholderImage />
                    <CardContent sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                      <Radio checked={selected === opt.value} value={opt.value} sx={{ color: '#1a365d', '&.Mui-checked': { color: '#1a365d' } }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#111827' }}>{opt.title}</Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>{opt.subtitle}</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Box>
        </ContentWrapper>
      </MainContent>

      <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', px: { xs: '1rem', md: '2rem' }, py: { xs: '0.75rem', md: '1rem' }, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', zIndex: 5 }}>
        <Button onClick={handleBack} variant="outlined" sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600 }}>Back</Button>
        <Button onClick={handleNext} disabled={!selected} variant="contained" sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}>Next</Button>
      </Box>
    </PageContainer>
  );
};

export default SellListHomeQuality4Page; 