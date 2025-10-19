/**
 * Performance Metrics Section 3D Component
 */

import React, { useRef } from 'react';
import { Html, Box as DreiBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const metrics = [
  { label: 'Avg CTR', value: '3.2%', target: 0.8 },
  { label: 'Conversion Rate', value: '5.8%', target: 1.2 },
  { label: 'Cost Per Lead', value: '$12', target: 0.6 },
  { label: 'ROI', value: '285%', target: 1.5 },
];

export const PerformanceMetricsSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const barRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    barRefs.current.forEach((bar) => {
      if (bar && visible) {
        bar.scale.y += (bar.userData.target - bar.scale.y) * 0.05;
      }
    });
  });

  return (
    <group visible={visible} position={[0, 0, -560]}>
      {metrics.map((metric, index) => (
        <DreiBox
          key={index}
          ref={(ref) => {
            if (ref) {
              barRefs.current[index] = ref;
              ref.userData.target = metric.target;
            }
          }}
          args={[0.5, metric.target, 0.5]}
          position={[-3 + index * 2, metric.target / 2, -2]}
        >
          <meshStandardMaterial color={brandColors.primary} metalness={0.7} roughness={0.3} />
        </DreiBox>
      ))}

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Performance Metrics
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">{metric.label}</Typography>
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

