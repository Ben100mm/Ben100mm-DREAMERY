import React from 'react';
import { PerformanceMetricsDashboard } from '../utils/performance';
import { Box, Typography, Paper } from '@mui/material';
import { brandColors } from "../theme";


const PerformanceDashboardPage: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: brandColors.neutral[100],
      p: 0 
    }}>
      {/* Header */}
      <Paper elevation={1} sx={{ 
        bgcolor: '#1a237e', 
        color: brandColors.text.inverse, 
        p: 3, 
        mb: 3,
        borderRadius: 0
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🚀 Performance Dashboard
        </Typography>
        <Typography variant="h6" color="rgba(255,255,255,0.8)">
          Real-time performance monitoring and analytics
        </Typography>
      </Paper>

      {/* Dashboard Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        <PerformanceMetricsDashboard 
          showBundleAnalysis={true}
          showPerformanceMetrics={true}
          showRegressionAlerts={true}
          refreshInterval={5000} // Updates every 5 seconds
        />
      </Box>
    </Box>
  );
};

export default PerformanceDashboardPage;
