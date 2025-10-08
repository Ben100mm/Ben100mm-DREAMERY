/**
 * Calculator Mode Selector Component
 * 
 * Allows users to switch between Essential, Standard, and Professional calculator modes
 */

import React from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Speed as SpeedIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import { 
  CalculatorMode, 
  CALCULATOR_MODES,
  getModeConfig 
} from '../../types/calculatorMode';

interface ModeSelectorProps {
  value: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
  showDescription?: boolean;
  variant?: 'default' | 'compact';
}

const MODE_ICONS = {
  essential: <SpeedIcon fontSize="small" />,
  standard: <AssignmentIcon fontSize="small" />,
  professional: <EngineeringIcon fontSize="small" />,
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  value,
  onChange,
  showDescription = true,
  variant = 'default',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: CalculatorMode | null
  ) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  const currentConfig = getModeConfig(value);

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ color: brandColors.neutral[600], fontWeight: 500 }}
        >
          Mode:
        </Typography>
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={handleChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.813rem',
              textTransform: 'none',
              borderColor: brandColors.neutral[300],
              '&.Mui-selected': {
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                '&:hover': {
                  backgroundColor: brandColors.primaryLight,
                },
              },
            },
          }}
        >
          {(Object.keys(CALCULATOR_MODES) as CalculatorMode[]).map((mode) => {
            const config = CALCULATOR_MODES[mode];
            return (
              <ToggleButton key={mode} value={mode}>
                {config.label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: brandColors.neutral[700], 
          fontWeight: 600,
          mb: 1.5 
        }}
      >
        Calculator Mode
      </Typography>

      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        sx={{
          width: '100%',
          '& .MuiToggleButtonGroup-grouped': {
            border: `1px solid ${brandColors.neutral[300]}`,
            borderRadius: '8px',
            margin: '0 4px',
            px: 3,
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 500,
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: brandColors.primary,
              color: 'white',
              '&:hover': {
                backgroundColor: brandColors.primary,
              },
            },
            '&:hover': {
              backgroundColor: brandColors.neutral[50],
            },
            '&:not(:last-of-type)': {
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
            },
            '&:not(:first-of-type)': {
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
            },
          },
        }}
      >
        {(Object.keys(CALCULATOR_MODES) as CalculatorMode[]).map((mode) => {
          const config = CALCULATOR_MODES[mode];
          return (
            <Tooltip
              key={mode}
              title={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {config.label} Mode
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    {config.description}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Features:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {config.features.map((feature, idx) => (
                      <Typography 
                        key={idx} 
                        component="li" 
                        variant="caption"
                        sx={{ mb: 0.25 }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              }
              placement="bottom"
              arrow
            >
              <ToggleButton value={mode} sx={{ flex: 1 }}>
                {config.label}
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ModeSelector;

