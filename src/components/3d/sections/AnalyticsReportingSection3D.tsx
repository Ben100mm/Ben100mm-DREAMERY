/**
 * Analytics & Reporting Section 3D Component
 */

import React from 'react';
import { Html, Box as DreiBox } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { brandColors } from '../../../theme/theme';

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
    <group visible={visible} position={[0, 0, 0]}>
      {[0.5, 1, 1.5, 1.2, 0.8].map((height, index) => (
        <DreiBox
          key={index}
          args={[0.4, height, 0.4]}
          position={[-2.5 + index, height / 2, -2]}
        >
          <meshStandardMaterial color={brandColors.primary} metalness={0.7} roughness={0.3} />
        </DreiBox>
      ))}

      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Analytics & Reporting
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
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
    </group>
  );
};

