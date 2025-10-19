import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { brandColors } from "../../../theme";
import InvestAssistantIcon from './InvestAssistantIcon';

const InvestAssistant: React.FC = () => {
  return (
    <Box>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <InvestAssistantIcon size={40} sx={{ color: brandColors.primary }} />
            <Typography variant="h6">
              Intelligent assistance for investment decisions and portfolio management
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include AI-powered investment insights, deal analysis, and portfolio optimization.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InvestAssistant;

