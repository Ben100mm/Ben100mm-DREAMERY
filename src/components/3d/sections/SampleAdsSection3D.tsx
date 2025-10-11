/**
 * Sample Advertisements Section 3D Component
 */

import React, { useState } from 'react';
import { Html, Image as DreiImage } from '@react-three/drei';
import { Box, Typography, Card, CardContent, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import { InteractiveMesh } from '../shared/InteractiveMesh';

const adSamples = [
  { id: 'banner', type: 'Banner Ad', format: '728x90', position: [-3, 1, -2] as [number, number, number], ctr: '2.5%' },
  { id: 'sidebar', type: 'Sidebar Ad', format: '300x600', position: [0, 1, -2] as [number, number, number], ctr: '3.2%' },
  { id: 'native', type: 'Native Ad', format: 'Responsive', position: [3, 1, -2] as [number, number, number], ctr: '4.1%' },
];

export const SampleAdsSection3D: React.FC<{ visible: boolean }> = React.memo(({ visible }) => {
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedAd, setSelectedAd] = useState<typeof adSamples[0] | null>(null);

  return (
    <group visible={visible} position={[0, 0, -120]}>
      {adSamples.map((ad) => (
        <InteractiveMesh
          key={ad.id}
          position={ad.position}
          geometry="box"
          color={brandColors.primary}
          onClick={() => setSelectedAd(ad)}
        />
      ))}

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Sample Advertisements
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', p: 4 }}>
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

