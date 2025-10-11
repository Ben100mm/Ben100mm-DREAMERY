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
      {/* Close button - top left */}
      {visible && (
        <Html position={[-8, 4, 2]} distanceFactor={8} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <Typography sx={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold' }}>
              ×
            </Typography>
          </Box>
        </Html>
      )}

      {/* Centered Title - matching reference layout */}
      {visible && (
        <Html position={[0, 0, 2]} distanceFactor={10} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: '#ffffff',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {/* Main Title */}
            <Typography
              sx={{
                fontSize: '4rem',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1,
                mb: 1,
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Continuous
            </Typography>
            
            <Typography
              sx={{
                fontSize: '3.5rem',
                fontWeight: 300,
                color: '#d4af37',
                lineHeight: 1,
                mb: 4,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Feedback
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontSize: '1.2rem',
                color: '#ffffff',
                lineHeight: 1.4,
                mb: 2,
                maxWidth: '600px',
                fontWeight: 300,
              }}
            >
              Timely, and clear feedback based on<br />
              facts and examples is an act of kindness.
            </Typography>

            {/* Tagline with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  border: '2px solid #d4af37',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '8px solid #d4af37',
                    position: 'absolute',
                    top: '2px',
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                BEING STUCK IS BORING
              </Typography>
            </Box>
          </Box>
        </Html>
      )}

      {/* Ouroboros Constellation - positioned like in reference */}
      <OuroborosConstellation
        visible={visible}
        scrollProgress={scrollProgress}
        mousePosition={mousePosition}
        position={[6, -1, 0]}
        scale={[2, 2, 2]}
      />

      {/* Bottom UI elements - matching reference */}
      {visible && (
        <>
          {/* Volume icon - bottom left */}
          <Html position={[-8, -4, 2]} distanceFactor={8} style={{ pointerEvents: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#ffffff',
                cursor: 'pointer',
                '&:hover': { opacity: 0.7 },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 12,
                    border: '2px solid #ffffff',
                    borderRadius: '2px',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid #ffffff',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                    },
                  }}
                />
              </Box>
            </Box>
          </Html>

          {/* Share and JOIN buttons - bottom right */}
          <Html position={[8, -4, 2]} distanceFactor={8} style={{ pointerEvents: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Share icon */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1px',
                  }}
                >
                  <Box sx={{ width: '4px', height: '4px', backgroundColor: '#ffffff', borderRadius: '50%' }} />
                  <Box sx={{ width: '4px', height: '4px', backgroundColor: '#ffffff', borderRadius: '50%' }} />
                  <Box sx={{ width: '4px', height: '4px', backgroundColor: '#ffffff', borderRadius: '50%' }} />
                </Box>
              </Box>

              {/* JOIN button */}
              <Button
                onClick={() => navigate('/auth')}
                sx={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#ffffff',
                  },
                }}
              >
                JOIN
              </Button>
            </Box>
          </Html>
        </>
      )}
    </group>
  );
};

