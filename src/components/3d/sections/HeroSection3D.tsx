/**
 * Hero Section 3D Component
 */

import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Button, Grid, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import { useNavigate } from 'react-router-dom';
import { animationPresets } from '../../../utils/3d/animations';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const HeroSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
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

  return (
    <group visible={visible} position={[0, 0, 0]}>
      {/* HTML Overlay Content */}
      {visible && (
        <Html position={[0, -1, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              width: '800px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: brandColors.text.primary,
              background: `linear-gradient(135deg, ${brandColors.primary} 0%, #64b5f6 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Reach Your Perfect Audience
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: brandColors.text.secondary,
              lineHeight: 1.6,
            }}
          >
            Connect with qualified real estate professionals, investors, and
            homebuyers through targeted advertising on the Dreamery platform
          </Typography>

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

