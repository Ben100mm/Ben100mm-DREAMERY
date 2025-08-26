import React from 'react';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { brandColors } from '../theme';
import { useFaviconVariant } from '../hooks/useFaviconVariant';

const MarketplacePage: React.FC = () => {
  // Light background → use dark favicon
  useFaviconVariant('dark');
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.backgrounds.primary }}>
      <Outlet />
    </Box>
  );
};

export default MarketplacePage;


