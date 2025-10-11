/**
 * 3D Navbar Component
 * Fixed navigation bar with smooth scroll functionality
 */

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { brandColors } from '../../theme/theme';
import { scrollToSection } from '../../utils/3d/scroll';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'features', label: 'Features' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar3D: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 0,
            mr: 4,
            fontWeight: 700,
            color: brandColors.primary,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Dreamery
        </Typography>

        {/* Navigation Items */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{
                color: brandColors.text.primary,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  color: brandColors.primary,
                },
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          onClick={() => navigate('/auth')}
          sx={{
            backgroundColor: brandColors.primary,
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              backgroundColor: brandColors.actions.primary,
            },
          }}
        >
          Get Started
        </Button>
      </Toolbar>
    </AppBar>
  );
};

