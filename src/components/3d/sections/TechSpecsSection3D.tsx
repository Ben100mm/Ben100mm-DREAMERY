/**
 * Technical Specifications Section 3D Component
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const specs = [
  { title: 'Ad Sizes', items: ['Banner: 728x90, 970x90', 'Sidebar: 300x250, 300x600', 'Native: Responsive', 'Mobile: 320x50, 320x100'] },
  { title: 'File Formats', items: ['Images: JPG, PNG, GIF, WebP', 'Video: MP4, WebM', 'Max size: 5MB images, 50MB video', 'HTML5 ads supported'] },
  { title: 'Browser Support', items: ['Chrome (latest)', 'Firefox (latest)', 'Safari (latest)', 'Edge (latest)'] },
  { title: 'Tracking', items: ['Google Analytics', 'Facebook Pixel', 'Custom pixels', 'Third-party tags'] },
];

export const TechSpecsSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, 0]}>
      {specs.map((_, index) => (
        <mesh key={index} position={[-3 + index * 2, 1, -2]}>
          <planeGeometry args={[1.5, 2]} />
          <meshStandardMaterial color={brandColors.primary} metalness={0.6} roughness={0.4} transparent opacity={0.7} />
        </mesh>
      ))}

      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Technical Specifications
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '1000px' }}>
          <Grid container spacing={3}>
            {specs.map((spec, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{spec.title}</Typography>
                    <List dense>
                      {spec.items.map((item, i) => (
                        <ListItem key={i}><ListItemText primary={`• ${item}`} /></ListItem>
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

