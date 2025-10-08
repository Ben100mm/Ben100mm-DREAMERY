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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        bgcolor: brandColors.neutral[50],
        border: `1px solid ${brandColors.neutral[200]}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: brandColors.neutral[600], 
            fontWeight: 500,
            mb: 0.5 
          }}
        >
          Calculator Mode
        </Typography>
        {showDescription && (
          <Typography 
            variant="caption" 
            sx={{ color: brandColors.neutral[500] }}
          >
            Choose the level of detail that fits your analysis needs
          </Typography>
        )}
      </Box>

      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(3, 1fr)' 
          },
          gap: { xs: 1, sm: 0 },
          '& .MuiToggleButtonGroup-grouped': {
            border: `1px solid ${brandColors.neutral[300]}`,
            borderRadius: { xs: '8px', sm: 0 },
            '&:not(:first-of-type)': {
              marginLeft: { xs: 0, sm: -1 },
              borderLeft: { sm: `1px solid ${brandColors.neutral[300]}` },
            },
            '&:first-of-type': {
              borderRadius: { sm: '8px 0 0 8px' },
            },
            '&:last-of-type': {
              borderRadius: { sm: '0 8px 8px 0' },
            },
          },
        }}
      >
        {(Object.keys(CALCULATOR_MODES) as CalculatorMode[]).map((mode) => {
          const config = CALCULATOR_MODES[mode];
          const isSelected = value === mode;

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
              <ToggleButton
                value={mode}
                sx={{
                  py: { xs: 2, sm: 2.5 },
                  px: 2,
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                  border: `1px solid ${brandColors.neutral[300]}`,
                  bgcolor: isSelected 
                    ? brandColors.primary 
                    : 'white',
                  color: isSelected 
                    ? brandColors.text.inverse 
                    : brandColors.neutral[700],
                  '&:hover': {
                    bgcolor: isSelected 
                      ? brandColors.primaryLight 
                      : brandColors.neutral[100],
                  },
                  '&.Mui-selected': {
                    bgcolor: brandColors.primary,
                    color: brandColors.text.inverse,
                    '&:hover': {
                      bgcolor: brandColors.primaryLight,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  {MODE_ICONS[mode]}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  >
                    {config.label}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'inherit',
                    opacity: 0.9,
                    textAlign: 'center',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {config.shortDescription}
                </Typography>
                {!isMobile && isSelected && (
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      mt: 1,
                      height: 20,
                      fontSize: '0.688rem',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'inherit',
                    }}
                  />
                )}
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>

    </Paper>
  );
};

export default ModeSelector;

