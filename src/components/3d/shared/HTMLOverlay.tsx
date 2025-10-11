/**
 * HTML Overlay Component
 * Styled container for HTML overlays in 3D space
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { Box } from '@mui/material';
import { brandColors } from '../../../theme/theme';

interface HTMLOverlayProps {
  position: [number, number, number];
  children: React.ReactNode;
  center?: boolean;
  distanceFactor?: number;
  style?: React.CSSProperties;
  transform?: boolean;
  occlude?: boolean;
}

export const HTMLOverlay: React.FC<HTMLOverlayProps> = ({
  position,
  children,
  center = true,
  distanceFactor = 10,
  style,
  transform = false,
  occlude = false,
}) => {
  return (
    <Html
      position={position}
      center={center}
      distanceFactor={distanceFactor}
      transform={transform}
      occlude={occlude}
      style={{
        pointerEvents: 'auto',
        ...style,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: `0 8px 32px ${brandColors.shadows.medium}`,
          border: `1px solid rgba(255, 255, 255, 0.3)`,
          maxWidth: '400px',
          color: brandColors.text.primary,
        }}
      >
        {children}
      </Box>
    </Html>
  );
};

