/**
 * Competitive Advantages Section 3D Component
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const advantages = [
  { title: 'AI-Powered Targeting', description: 'Advanced machine learning algorithms' },
  { title: 'Real-Time Optimization', description: 'Automatic campaign adjustments' },
  { title: 'Industry Expertise', description: 'Real estate-specific platform' },
  { title: 'Exclusive Inventory', description: 'Premium ad placements' },
];

export const CompetitiveAdvantagesSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, -160]}>
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
          COMPETITIVE ADVANTAGES
        </Text>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Grid container spacing={3}>
            {advantages.map((adv, index) => (
              // @ts-ignore - Grid item props work correctly in MUI v7
              <Grid item xs={6} key={index}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon sx={{ color: brandColors.primary, mr: 1, fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{adv.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">{adv.description}</Typography>
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

