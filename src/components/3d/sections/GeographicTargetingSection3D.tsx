/**
 * Geographic Targeting Section 3D Component
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';

const markets = [
  { name: 'San Francisco', state: 'CA', reach: '2.5M' },
  { name: 'Los Angeles', state: 'CA', reach: '4.8M' },
  { name: 'New York', state: 'NY', reach: '6.2M' },
  { name: 'Miami', state: 'FL', reach: '1.8M' },
  { name: 'Seattle', state: 'WA', reach: '1.5M' },
  { name: 'Austin', state: 'TX', reach: '1.2M' },
];

export const GeographicTargetingSection3D: React.FC<{ visible: boolean; sectionIndex: number; scrollProgress: number }> = ({ visible, sectionIndex, scrollProgress }) => {
  // Get dynamic position that moves toward camera along the winding path
  const contentPosition = getContentPositionAlongPath(sectionIndex, scrollProgress);

  return (
    <group visible={visible} position={[contentPosition.x, contentPosition.y, contentPosition.z]}>
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
          GEOGRAPHIC TARGETING
        </Text>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={2}>
            {markets.map((market, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{market.name}</Typography>
                    <Chip label={market.state} size="small" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">Reach: {market.reach}</Typography>
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

