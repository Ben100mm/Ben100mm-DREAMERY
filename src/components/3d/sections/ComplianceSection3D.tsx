/**
 * Compliance & Trust Section 3D Component
 */

import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppGoodIcon from '@mui/icons-material/GppGood';

export const ComplianceSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const shieldRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (shieldRef.current && visible) {
      shieldRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group visible={visible} position={[0, 0, 0]}>
      <mesh ref={shieldRef} position={[0, 1, -2]}>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color={brandColors.primary} metalness={0.9} roughness={0.1} />
      </mesh>

      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Trust & Compliance
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Grid container spacing={3}>
            {[
              { icon: <SecurityIcon sx={{ fontSize: 48, color: brandColors.primary }} />, title: 'GDPR Compliant', items: ['Data protection', 'Privacy first', 'EU standards'] },
              { icon: <VerifiedUserIcon sx={{ fontSize: 48, color: brandColors.primary }} />, title: 'SOC 2 Certified', items: ['Security audited', 'Industry standards', 'Verified practices'] },
              { icon: <GppGoodIcon sx={{ fontSize: 48, color: brandColors.primary }} />, title: 'Bank-Level Security', items: ['256-bit encryption', 'Secure infrastructure', 'Regular audits'] },
            ].map((item, index) => (
              <Grid item xs={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{item.title}</Typography>
                    <List dense>
                      {item.items.map((text, i) => (
                        <ListItem key={i}><ListItemText primary={`• ${text}`} /></ListItem>
                      ))}
                    </List>
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

