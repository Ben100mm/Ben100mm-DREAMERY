/**
 * Milky Way Panorama Section 3D
 * Interactive 360-degree Milky Way visualization with stereographic projection
 */

import React, { useState, useRef } from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Button, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import { useNavigate } from 'react-router-dom';
import { animationPresets } from '../../../utils/3d/animations';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';
import { MilkyWayPanorama3D, useMilkyWayControls } from '../effects/MilkyWayPanorama3D';
import { MilkyWayControls } from '../controls/MilkyWayControls';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScienceIcon from '@mui/icons-material/Science';

export const MilkyWaySection3D: React.FC<{ 
  visible: boolean; 
  sectionIndex: number; 
  scrollProgress: number;
  mousePosition?: { x: number; y: number };
}> = ({ visible, sectionIndex, scrollProgress, mousePosition = { x: 0, y: 0 } }) => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);
  const [panoramaVisible, setPanoramaVisible] = useState(true);
  const { controls, updateControl, resetControls } = useMilkyWayControls();

  // Get dynamic position that moves toward camera along the winding path
  const contentPosition = getContentPositionAlongPath(sectionIndex, scrollProgress);

  const handleResetRotation = () => {
    // Reset panorama rotation to initial state
    updateControl('autoRotate', 0.01);
  };

  const handleToggleControls = () => {
    setShowControls(!showControls);
  };

  const handleToggleVisibility = () => {
    setPanoramaVisible(!panoramaVisible);
  };

  return (
    <group visible={visible} position={[contentPosition.x, contentPosition.y, contentPosition.z]}>
      {/* Milky Way Panorama Background */}
      {visible && (
        <MilkyWayPanorama3D
          visible={panoramaVisible}
          interactive={true}
          initialZoom={controls.zoom}
          mouseSensitivity={0.002}
          starColor="#ffffff"
          starIntensity={controls.starIntensity}
          brightness={controls.brightness}
          contrast={controls.contrast}
          saturation={controls.saturation}
          autoRotate={controls.autoRotate}
          customUniforms={{
            // Add any custom uniforms here
          }}
        />
      )}

      {/* 3D Title - Space-themed typography */}
      {visible && (
        <group position={[0, 4, 2]}>
          <Text
            position={[0, 1, 0]}
            fontSize={1.5}
            color="#64b5f6"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#1a237e"
            letterSpacing={0.1}
          >
            Explore the
          </Text>
          <Text
            position={[0, -0.5, 0]}
            fontSize={1.8}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ff8f00"
            letterSpacing={0.15}
          >
            Milky Way
          </Text>
        </group>
      )}

      {/* HTML Overlay Content */}
      {visible && (
        <Html position={[0, -2, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              width: '900px',
              textAlign: 'center',
              background: 'rgba(10, 10, 30, 0.9)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(100, 181, 246, 0.3)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 8px 32px 0 rgba(26, 35, 126, 0.5)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                mb: 3,
                color: '#ffffff',
                lineHeight: 1.6,
                fontSize: '1.1rem',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Experience the universe like never before with our interactive 360° Milky Way panorama. 
              Based on the European Southern Observatory's magnificent data, explore the cosmos with 
              stereographic projection technology.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: '2px solid #ffd700',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#ffd700',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                      '100%': { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#64b5f6',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                WEBGL INTERACTIVE
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/milky-way-demo')}
                sx={{
                  backgroundColor: brandColors.primary,
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(26, 35, 126, 0.4)',
                  '&:hover': {
                    backgroundColor: brandColors.actions.primary,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(26, 35, 126, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={<PublicIcon />}
              >
                Full Experience
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff8f00',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
                startIcon={<ScienceIcon />}
              >
                Learn More
              </Button>
            </Box>

            {/* Feature Highlights */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
              <Chip
                label="360° Panorama"
                sx={{
                  backgroundColor: 'rgba(100, 181, 246, 0.2)',
                  color: '#64b5f6',
                  border: '1px solid #64b5f6',
                  fontSize: '0.9rem',
                  py: 2,
                  px: 2,
                }}
                icon={<VisibilityIcon />}
              />
              <Chip
                label="Stereographic Projection"
                sx={{
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  color: '#ffd700',
                  border: '1px solid #ffd700',
                  fontSize: '0.9rem',
                  py: 2,
                  px: 2,
                }}
                icon={<ScienceIcon />}
              />
              <Chip
                label="Interactive Controls"
                sx={{
                  backgroundColor: 'rgba(100, 181, 246, 0.2)',
                  color: '#64b5f6',
                  border: '1px solid #64b5f6',
                  fontSize: '0.9rem',
                  py: 2,
                  px: 2,
                }}
                icon={<PublicIcon />}
              />
              <Chip
                label="ESO Data"
                sx={{
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  color: '#ffd700',
                  border: '1px solid #ffd700',
                  fontSize: '0.9rem',
                  py: 2,
                  px: 2,
                }}
                icon={<ScienceIcon />}
              />
            </Box>

            {/* Technical Details */}
            <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(26, 35, 126, 0.3)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'left', lineHeight: 1.6 }}>
                <strong>Technical Specifications:</strong><br />
                • Based on ESO's 360° equirectangular Milky Way panorama<br />
                • Real-time stereographic projection using WebGL shaders<br />
                • Interactive mouse controls with zoom and rotation<br />
                • Procedural star field with twinkling effects<br />
                • Customizable brightness, contrast, and saturation<br />
                • Optimized for 60fps performance on modern devices
              </Typography>
            </Box>
          </Box>
        </Html>
      )}

      {/* Control Panel */}
      <MilkyWayControls
        controls={controls}
        onUpdateControl={updateControl}
        onResetControls={resetControls}
        visible={panoramaVisible}
        onToggleVisibility={handleToggleVisibility}
        showControls={showControls}
        onToggleControls={handleToggleControls}
        onResetRotation={handleResetRotation}
      />
    </group>
  );
};
