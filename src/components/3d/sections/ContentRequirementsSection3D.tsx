/**
 * Content Requirements Section 3D Component
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const requirements = [
  { title: 'Image Guidelines', items: ['High resolution (min 1920x1080)', 'Professional quality', 'No watermarks', 'Brand compliant'] },
  { title: 'Copy Requirements', items: ['Clear headlines', 'Compelling CTAs', 'Legal disclosures', 'Truthful claims'] },
  { title: 'Brand Standards', items: ['Logo specifications', 'Color guidelines', 'Font requirements', 'Voice & tone'] },
];

export const ContentRequirementsSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, -680]}>
      {requirements.map((_, index) => (
        <mesh key={index} position={[-2.5 + index * 2.5, 1, -2]}>
          <boxGeometry args={[1.5, 1.5, 0.1]} />
          <meshStandardMaterial color={brandColors.primary} metalness={0.6} roughness={0.4} transparent opacity={0.7} />
        </mesh>
      ))}

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Content Requirements
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            {requirements.map((req, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{req.title}</Typography>
                    {req.items.map((item, i) => (
                      <Typography key={i} variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        • {item}
                      </Typography>
                    ))}
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

