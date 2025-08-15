import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { brandColors } from "../../../theme";

const FinancingCoordination: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Financing Coordination
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />
            <Typography variant="h6">
              Coordinate with lenders and manage funding processes
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include lender coordination, funding management, and loan processing tools.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinancingCoordination;
