import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';

const LegalCompliance: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Legal & Compliance
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <GavelIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            <Typography variant="h6">
              Legal document preparation and regulatory compliance
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include legal document preparation, compliance tracking, and regulatory tools.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export { LegalCompliance };
