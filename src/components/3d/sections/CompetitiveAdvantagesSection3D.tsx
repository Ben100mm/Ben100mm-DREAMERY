/**
 * Competitive Advantages Section 3D Component
 */

import React from 'react';
import { Html, Box as DreiBox } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
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
    <group visible={visible} position={[0, 0, -280]}>
      {advantages.map((adv, index) => {
        const height = 1 + (index * 0.5);
        return (
          <DreiBox key={index} args={[0.5, height, 0.5]} position={[-3 + index * 2, height / 2, -2]}>
            <meshStandardMaterial color={brandColors.primary} metalness={0.7} roughness={0.3} />
          </DreiBox>
        );
      })}

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Competitive Advantages
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Grid container spacing={3}>
            {advantages.map((adv, index) => (
              // @ts-ignore - Grid item props work correctly in MUI v7
              <Grid item xs={6} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
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

