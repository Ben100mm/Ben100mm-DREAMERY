/**
 * Hero Section 3D Component
 */

import React, { useEffect, useState } from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Button, Grid, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import { useNavigate } from 'react-router-dom';
import { animationPresets } from '../../../utils/3d/animations';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';
import { OuroborosConstellation } from '../../3d/constellations/OuroborosConstellation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const HeroSection3D: React.FC<{ 
  visible: boolean; 
  sectionIndex: number; 
  scrollProgress: number;
  mousePosition?: { x: number; y: number };
}> = ({ visible, sectionIndex, scrollProgress, mousePosition = { x: 0, y: 0 } }) => {
  const navigate = useNavigate();
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    if (visible && !statsAnimated) {
      setStatsAnimated(true);
      // Trigger counter animations
      const counters = document.querySelectorAll('.stat-counter');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        animationPresets.animateCounter(counter as HTMLElement, 0, target, 2, '+');
      });
    }
  }, [visible, statsAnimated]);

  // Get dynamic position that moves toward camera along the winding path
  const contentPosition = getContentPositionAlongPath(sectionIndex, scrollProgress);

  return (
    <group visible={visible} position={[contentPosition.x, contentPosition.y, contentPosition.z]}>
      {/* 3D Title - Elegant typography matching reference */}
      {visible && (
        <group position={[0, 3, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={1.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#64b5f6"
            letterSpacing={0.1}
          >
            Continuous
          </Text>
          <Text
            position={[0, -0.5, 0]}
            fontSize={1.2}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffa726"
            letterSpacing={0.1}
          >
            Feedback
          </Text>
        </group>
      )}

      {/* Ouroboros Constellation */}
      <OuroborosConstellation 
        visible={visible} 
        scrollProgress={scrollProgress} 
        mousePosition={mousePosition} 
      />

      {/* HTML Overlay Content */}
      {visible && (
        <Html position={[0, -1, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              width: '800px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
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
            Timely, and clear feedback based on facts and examples is an act of kindness.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
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
                fontFamily: '"Inter", sans-serif',
              }}
            >
              BEING STUCK IS BORING
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/auth')}
              sx={{
                backgroundColor: brandColors.primary,
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  backgroundColor: brandColors.actions.primary,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Advertising
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: brandColors.actions.primary,
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                },
              }}
            >
              View Pricing
            </Button>
          </Box>

          {/* Trust Indicators */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                  <span className="stat-counter" data-target="50000">0</span>+
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                  <span className="stat-counter" data-target="92">0</span>%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Customer Satisfaction
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: brandColors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                  <span className="stat-counter" data-target="300">0</span>%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Average ROI
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Value Propositions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Chip
              label="Targeted Reach"
              sx={{
                backgroundColor: brandColors.primary,
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
              }}
            />
            <Chip
              label="Proven Results"
              sx={{
                backgroundColor: brandColors.primary,
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
              }}
            />
            <Chip
              label="Easy Integration"
              sx={{
                backgroundColor: brandColors.primary,
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
              }}
            />
            <Chip
              label="24/7 Support"
              sx={{
                backgroundColor: brandColors.primary,
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
              }}
            />
          </Box>
        </Box>
      </Html>
      )}
    </group>
  );
};

