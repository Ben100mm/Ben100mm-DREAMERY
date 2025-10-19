/**
 * Upgrade Prompt Component
 * 
 * Shows helpful prompts when users could benefit from upgrading calculator mode
 */

import React from 'react';
import {
  Alert,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import { CalculatorMode } from '../../types/calculatorMode';

interface UpgradePromptProps {
  currentMode: CalculatorMode;
  targetMode: CalculatorMode;
  feature: string;
  description?: string;
  onUpgrade: () => void;
  variant?: 'info' | 'warning';
}

const MODE_LABELS: Record<CalculatorMode, string> = {
  essential: 'Essential',
  standard: 'Standard',
  professional: 'Professional',
};

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  currentMode,
  targetMode,
  feature,
  description,
  onUpgrade,
  variant = 'info',
}) => {
  return (
    <Alert
      severity={variant}
      icon={<TrendingUpIcon />}
      sx={{
        mt: 2,
        mb: 2,
        bgcolor: variant === 'info' ? brandColors.backgrounds.info : brandColors.backgrounds.warning,
        borderColor: variant === 'info' ? brandColors.borders.info : brandColors.borders.warning,
        '& .MuiAlert-icon': {
          color: variant === 'info' ? brandColors.text.info : brandColors.text.warning,
        },
      }}
      action={
        <Button
          size="small"
          onClick={onUpgrade}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: variant === 'info' ? brandColors.text.info : brandColors.text.warning,
          }}
        >
          Upgrade to {MODE_LABELS[targetMode]}
        </Button>
      }
    >
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {feature} is available in {MODE_LABELS[targetMode]} mode
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ display: 'block' }}>
            {description}
          </Typography>
        )}
      </Box>
    </Alert>
  );
};

export default UpgradePrompt;

