import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { brandColors } from "../../../theme";
import FundAssistantIcon from './FundAssistantIcon';

const FundAssistant: React.FC = () => {
  return (
    <Box>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FundAssistantIcon size={40} sx={{ color: brandColors.primary }} />
            <Typography variant="h6">
              Intelligent assistance for capital raising and investor relations
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include AI-powered fundraising insights, investor matching, and compliance support.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FundAssistant;

