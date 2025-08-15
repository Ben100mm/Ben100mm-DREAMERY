import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const InsuranceUtilities: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Insurance & Utilities
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <HomeIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            <Typography variant="h6">
              Manage property insurance and utility transfers
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include insurance management, utility transfer tools, and coverage tracking.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export { InsuranceUtilities };
