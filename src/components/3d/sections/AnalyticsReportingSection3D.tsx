/**
 * Analytics & Reporting Section 3D Component
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const analyticsFeatures = [
  'Real-Time Performance Dashboard',
  'Custom Report Builder',
  'Export to CSV/PDF',
  'ROI Tracking',
  'Conversion Attribution',
  'Heatmap Analytics',
  'Audience Demographics',
  'A/B Test Results',
];

export const AnalyticsReportingSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, -440]}>
      {visible && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#1976d2"
          letterSpacing={0.05}
        >
          ANALYTICS & REPORTING
        </Text>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Comprehensive Analytics Suite
              </Typography>
              <Grid container spacing={2}>
                {analyticsFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: 'rgba(25,118,210,0.05)', borderRadius: '8px' }}>
                      <Typography variant="body1">• {feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Html>
      )}
    </group>
  );
};

