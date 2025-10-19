/**
 * Campaign Management Section 3D Component
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const features = [
  'Real-time Campaign Dashboard',
  'Budget Management Tools',
  'Performance Alerts',
  'Campaign Scheduling',
  'Multi-campaign Management',
  'Optimization Recommendations',
];

export const CampaignManagementSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, -640]}>
      <mesh position={[0, 1, -2]}>
        <boxGeometry args={[4, 2.5, 0.3]} />
        <meshStandardMaterial color={brandColors.primary} metalness={0.7} roughness={0.3} transparent opacity={0.6} />
      </mesh>

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Campaign Management
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Powerful Management Tools
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={feature}
                      primaryTypographyProps={{ fontSize: '1.1rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Html>
      )}
    </group>
  );
};

