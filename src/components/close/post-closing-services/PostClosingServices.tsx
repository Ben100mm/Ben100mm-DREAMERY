import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Support as SupportIcon } from '@mui/icons-material';

const PostClosingServices: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Post-Closing Services
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SupportIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            <Typography variant="h6">
              Ongoing support and services after closing
            </Typography>
          </Box>
          
          <Alert severity="info">
            This component will include post-closing support, ongoing services, and customer care tools.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostClosingServices;
