/**
 * Geographic Targeting Section 3D Component
 */

import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const markets = [
  { name: 'San Francisco', state: 'CA', reach: '2.5M' },
  { name: 'Los Angeles', state: 'CA', reach: '4.8M' },
  { name: 'New York', state: 'NY', reach: '6.2M' },
  { name: 'Miami', state: 'FL', reach: '1.8M' },
  { name: 'Seattle', state: 'WA', reach: '1.5M' },
  { name: 'Austin', state: 'TX', reach: '1.2M' },
];

export const GeographicTargetingSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current && visible) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group visible={visible} position={[0, 0, -400]}>
      <mesh ref={globeRef} position={[0, 1, -2]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={brandColors.primary}
          metalness={0.7}
          roughness={0.3}
          wireframe
        />
      </mesh>

      {markets.map((_, index) => {
        const angle = (index / markets.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const y = Math.sin(angle) * 2 + 1;
        return (
          <mesh key={index} position={[x, y, -2]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
        );
      })}

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Geographic Targeting
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={2}>
            {markets.map((market, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
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

