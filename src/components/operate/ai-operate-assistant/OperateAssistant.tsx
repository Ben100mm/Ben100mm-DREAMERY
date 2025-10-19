import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { brandColors } from "../../../theme";
import OperateAssistantIcon from './OperateAssistantIcon';

const OperateAssistant: React.FC = () => {
  return (
    <Box>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <OperateAssistantIcon size={40} sx={{ color: brandColors.primary }} />
            <Typography variant="h6">
              Specialized assistance for Fix & Flip, BRRR, and Construction projects
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include AI-powered deal analysis, renovation cost optimization, BRRR refinance strategies, construction project management, and profit maximization insights.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OperateAssistant;

