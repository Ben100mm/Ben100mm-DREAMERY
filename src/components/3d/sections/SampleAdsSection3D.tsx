/**
 * Sample Advertisements Section 3D Component
 */

import React, { useState } from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Card, CardContent, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';

const adSamples = [
  { id: 'banner', type: 'Banner Ad', format: '728x90', ctr: '2.5%' },
  { id: 'sidebar', type: 'Sidebar Ad', format: '300x600', ctr: '3.2%' },
  { id: 'native', type: 'Native Ad', format: 'Responsive', ctr: '4.1%' },
];

export const SampleAdsSection3D: React.FC<{ visible: boolean; sectionIndex: number; scrollProgress: number }> = React.memo(({ visible, sectionIndex, scrollProgress }) => {
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedAd, setSelectedAd] = useState<typeof adSamples[0] | null>(adSamples[0]);

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
          SAMPLE ADVERTISEMENTS
        </Text>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '24px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', p: 4 }}>
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Ad Format</InputLabel>
                <Select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                  <MenuItem value="all">All Formats</MenuItem>
                  <MenuItem value="banner">Banner</MenuItem>
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                  <MenuItem value="native">Native</MenuItem>
                </Select>
              </FormControl>
              {selectedAd && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{selectedAd.type}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>Format: {selectedAd.format}</Typography>
                  <Chip label={`CTR: ${selectedAd.ctr}`} sx={{ backgroundColor: brandColors.primary, color: 'white' }} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Html>
      )}
    </group>
  );
});

