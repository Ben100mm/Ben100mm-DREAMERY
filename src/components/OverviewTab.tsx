import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { AdvancedAnalysisDashboard } from './AdvancedCalculations';

interface OverviewTabProps {
  dealState: any;
  allResults: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ dealState, allResults }) => {
  if (!dealState) {
    return (
      <Box>
        <Typography variant="body2" sx={{ color: '#666' }}>
          No deal data found. Please go back to the Underwrite page and click "Open Advanced Analysis" to load your deal data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
        Advanced Calculations Overview
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
        Welcome to the Advanced Calculations Suite. This comprehensive tool provides sophisticated analysis for your real estate investments.
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
                Deal Information
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Property Type:</strong> {dealState.propertyType}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {dealState.city}, {dealState.state}
                </Typography>
                <Typography variant="body2">
                  <strong>Purchase Price:</strong> ${dealState.purchasePrice?.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Operation Type:</strong> {dealState.operationType}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: '100%', backgroundColor: '#f0f8ff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography variant="body2">
                  - Configure market conditions in Global Configuration
                </Typography>
                <Typography variant="body2">
                  - Set up exit strategies for different timeframes
                </Typography>
                <Typography variant="body2">
                  - Analyze risk factors and get scoring
                </Typography>
                <Typography variant="body2">
                  - Save scenarios for comparison
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <AdvancedAnalysisDashboard allResults={allResults} />
      </Box>
    </Box>
  );
};
