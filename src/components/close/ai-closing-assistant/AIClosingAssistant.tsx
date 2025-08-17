import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { brandColors } from "../../../theme";
import ClosingAssistantIcon from './ClosingAssistantIcon';

const AIClosingAssistant: React.FC = () => {
  return (
    <Box>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <ClosingAssistantIcon size={40} sx={{ color: brandColors.primary }} />
            <Typography variant="h6">
              Intelligent assistance for closing processes and decision making
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include AI-powered insights, automated workflows, and intelligent decision support.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AIClosingAssistant;
