import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { Alert, Box, Button, Typography } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

interface RouteProtectionProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const RouteProtection: React.FC<RouteProtectionProps> = ({ 
  children, 
  fallbackMessage = "This feature is coming soon!" 
}) => {
  const location = useLocation();
  const { isPageEnabled, currentPhase, phases } = useFeatureFlags();

  if (!isPageEnabled(location.pathname)) {
    const currentPhaseConfig = phases.find(p => p.id === currentPhase);
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        p: 3 
      }}>
        <ConstructionIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Feature Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {fallbackMessage}
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Currently in {currentPhaseConfig?.name}. This feature will be available in a future phase.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};
