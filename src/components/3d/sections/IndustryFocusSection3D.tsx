/**
 * Industry Focus Section 3D Component
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const focusAreas = [
  { title: 'Residential Real Estate', description: 'Primary home buyers and sellers', color: '#1976d2' },
  { title: 'Commercial Properties', description: 'Office, retail, and industrial', color: '#64b5f6' },
  { title: 'Investment Properties', description: 'Rental and flip opportunities', color: '#90caf9' },
  { title: 'Luxury Market', description: 'High-end properties $1M+', color: '#42a5f5' },
];

export const IndustryFocusSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, -240]}>
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
          INDUSTRY FOCUS
        </Text>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            {focusAreas.map((area, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', height: '100%' }}>
                  <CardContent>
                    <Chip label="Real Estate" size="small" sx={{ mb: 2, backgroundColor: area.color, color: 'white' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{area.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{area.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Html>
      )}
    </group>
  );
};

