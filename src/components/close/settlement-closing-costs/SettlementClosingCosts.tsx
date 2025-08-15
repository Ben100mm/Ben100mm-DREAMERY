import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import { brandColors } from "../../../theme";

const SettlementClosingCosts: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Settlement & Closing Costs
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CalculateIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />
            <Typography variant="h6">
              Calculate and track all closing costs and settlement amounts
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include closing cost calculators, settlement tracking, and financial summaries.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettlementClosingCosts;
