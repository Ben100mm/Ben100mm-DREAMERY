/**
 * Essentials Calculator System Demo Page
 * 
 * Demonstrates the complete Essentials mode Calculator functionality
 */

import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { EssentialsCalculator } from '../components/EssentialsCalculator';
import { brandColors } from '../theme';

export const EssentialsCalculatorPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: brandColors.backgrounds.secondary }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: brandColors.primary, 
                fontWeight: 700, 
                mb: 2 
              }}
            >
              Essentials Calculator System
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto' }}
            >
              A complete real estate investment calculator with progressive disclosure modes. 
              This is an exact copy of the Essentials mode Calculator from the Dreamery platform.
            </Typography>
          </Box>
          
          <EssentialsCalculator />
        </Paper>
      </Container>
    </Box>
  );
};

export default EssentialsCalculatorPage;
