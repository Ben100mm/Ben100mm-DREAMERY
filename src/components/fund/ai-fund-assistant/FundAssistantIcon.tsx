import React from 'react';
import { Box } from '@mui/material';
import { brandColors } from '../../../theme';

interface FundAssistantIconProps {
  sx?: any;
  size?: number;
  color?: string;
  variant?: 'logo' | 'icon';
}

const FundAssistantIcon: React.FC<FundAssistantIconProps> = ({ 
  sx = {}, 
  size = 24,
  color = brandColors.primary,
  variant = 'logo'
}) => {
  if (variant === 'icon') {
    // For sidebar navigation, use a colored icon that's visible on light backgrounds
    return (
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx
        }}
      >
        {/* Central solid circle */}
        <Box
          sx={{
            width: size * 0.25,
            height: size * 0.25,
            backgroundColor: color,
            borderRadius: '50%',
            position: 'absolute',
            zIndex: 3,
          }}
        />
        
        {/* Outer ring */}
        <Box
          sx={{
            width: size * 0.8,
            height: size * 0.8,
            border: `2px solid ${color}`,
            borderRadius: '50%',
            position: 'absolute',
            zIndex: 2,
          }}
        />
        
        {/* Four smaller circles at cardinal points */}
        {/* Top circle */}
        <Box
          sx={{
            width: size * 0.15,
            height: size * 0.15,
            backgroundColor: color,
            borderRadius: '50%',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        />
        
        {/* Bottom circle */}
        <Box
          sx={{
            width: size * 0.15,
            height: size * 0.15,
            backgroundColor: color,
            borderRadius: '50%',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        />
        
        {/* Left circle */}
        <Box
          sx={{
            width: size * 0.15,
            height: size * 0.15,
            backgroundColor: color,
            borderRadius: '50%',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        />
        
        {/* Right circle */}
        <Box
          sx={{
            width: size * 0.15,
            height: size * 0.15,
            backgroundColor: color,
            borderRadius: '50%',
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        />
      </Box>
    );
  }

  // Default: use the Lumina logo
  return (
    <Box
      component="img"
      src="/lumina-logo.png"
      alt="Lumina logo"
      sx={{
        width: size,
        height: size,
        ...sx
      }}
    />
  );
};

export default FundAssistantIcon;

