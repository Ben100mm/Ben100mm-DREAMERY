/**
 * Campaign Management Section 3D Component
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
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
    <group visible={visible} position={[0, 0, -360]}>
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
          CAMPAIGN MANAGEMENT
        </Text>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
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

