/**
 * Hero Section 3D Component - Clean "Continuous Feedback" Design
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';
import { OuroborosConstellation } from '../../3d/constellations/OuroborosConstellation';

export const HeroSection3D: React.FC<{ 
  visible: boolean; 
  sectionIndex: number; 
  scrollProgress: number;
  mousePosition?: { x: number; y: number };
}> = ({ visible, sectionIndex, scrollProgress, mousePosition = { x: 0, y: 0 } }) => {
  const navigate = useNavigate();

  // Get dynamic position that moves toward camera along the winding path
  const contentPosition = getContentPositionAlongPath(sectionIndex, scrollProgress);

  return (
    <group visible={visible} position={[contentPosition.x, contentPosition.y, contentPosition.z]}>
      {/* 3D Title - Large elegant typography matching the reference */}
      {visible && (
        <group position={[-3, 2, 2]}>
          <Text
            position={[0, 1.5, 0]}
            fontSize={2.5}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#64b5f6"
            letterSpacing={0.05}
            font="/fonts/PlayfairDisplay-Regular.ttf"
          >
            Continuous
          </Text>
          <Text
            position={[0, 0.3, 0]}
            fontSize={2.2}
            color="#ffd700"
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffa726"
            letterSpacing={0.03}
            font="/fonts/Inter-Regular.ttf"
          >
            Feedback
          </Text>
        </group>
      )}

      {/* Ouroboros Constellation - Positioned on the right */}
      <OuroborosConstellation
        visible={visible}
        scrollProgress={scrollProgress}
        mousePosition={mousePosition}
        position={[4, 0, 0]}
        scale={[1.5, 1.5, 1.5]}
      />

      {/* Clean Text Overlay - No glass cards, just text over background */}
      {visible && (
        <Html position={[-3, -1, 3]} distanceFactor={12} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              maxWidth: '500px',
              color: '#ffffff',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#ffffff',
                mb: 3,
                fontWeight: 400,
              }}
            >
              Timely, and clear feedback based on facts and examples is an act of kindness.
            </Typography>

            {/* Tagline with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: '1px solid #ffd700',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderBottom: '6px solid #ffd700',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                BEING STUCK IS BORING
              </Typography>
            </Box>

            {/* Simple action buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/auth')}
                sx={{
                  backgroundColor: '#64b5f6',
                  color: '#000',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#90caf9',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: '#ff8f00',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Html>
      )}
    </group>
  );
};

