/**
 * Hero Section 3D Component - Clean "Continuous Feedback" Design
 */

import React from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';

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

      {/* Text content removed */}

      {/* Ouroboros Constellation removed */}

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

