import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { brandColors } from '../theme';

const MarketplacePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.backgrounds.primary }}>
      <Outlet />
    </Box>
  );
};

export default MarketplacePage;


