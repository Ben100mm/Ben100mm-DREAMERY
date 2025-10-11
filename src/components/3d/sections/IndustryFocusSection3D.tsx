/**
 * Industry Focus Section 3D Component
 */

import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const focusAreas = [
  { title: 'Residential Real Estate', description: 'Primary home buyers and sellers', color: '#1976d2' },
  { title: 'Commercial Properties', description: 'Office, retail, and industrial', color: '#64b5f6' },
  { title: 'Investment Properties', description: 'Rental and flip opportunities', color: '#90caf9' },
  { title: 'Luxury Market', description: 'High-end properties $1M+', color: '#42a5f5' },
];

export const IndustryFocusSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const houseRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    houseRefs.current.forEach((house, i) => {
      if (house && visible) {
        house.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002;
        house.rotation.y += 0.005;
      }
    });
  });

  return (
    <group visible={visible} position={[0, 0, 0]}>
      {focusAreas.map((area, index) => (
        <mesh key={index} ref={(ref) => ref && (houseRefs.current[index] = ref)} position={[-3 + index * 2, 1, -2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={area.color} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      <Html position={[0, 3, 0]} center distanceFactor={10}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Industry Focus
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            {focusAreas.map((area, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', height: '100%' }}>
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
    </group>
  );
};

