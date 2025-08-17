import React from 'react';
import { Box } from '@mui/material';
import { brandColors } from '../../../theme';

interface ClosingAssistantIconProps {
  sx?: any;
  size?: number;
  color?: string;
}

const ClosingAssistantIcon: React.FC<ClosingAssistantIconProps> = ({ 
  sx = {}, 
  size = 24,
  color = brandColors.primary
}) => {
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
          transform: 'translateX(-50%)',
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
      
      {/* Connection lines from outer ring to cardinal point circles */}
      {/* Top line */}
      <Box
        sx={{
          width: 2,
          height: size * 0.25,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.075,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />
      
      {/* Bottom line */}
      <Box
        sx={{
          width: 2,
          height: size * 0.25,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.075,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />
      
      {/* Left line */}
      <Box
        sx={{
          width: size * 0.25,
          height: 2,
          backgroundColor: color,
          position: 'absolute',
          left: size * 0.075,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      />
      
      {/* Right line */}
      <Box
        sx={{
          width: size * 0.25,
          height: 2,
          backgroundColor: color,
          position: 'absolute',
          right: size * 0.075,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default ClosingAssistantIcon;
