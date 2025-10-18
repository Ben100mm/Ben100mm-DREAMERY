/**
 * Upgrade Prompt Component
 * 
 * Shows helpful prompts when users could benefit from upgrading calculator mode
 */

import React from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import { CalculatorMode } from '../../types/calculatorMode';

interface UpgradePromptProps {
  currentMode: CalculatorMode;
  targetMode: CalculatorMode;
  feature: string;
  description: string;
  onUpgrade: () => void;
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
}) => {
  return (
    <Alert
      severity="info"
      sx={{
        mb: 2,
        backgroundColor: brandColors.backgrounds.hover,
        border: `1px solid ${brandColors.primary}`,
        '& .MuiAlert-icon': {
          color: brandColors.primary,
        },
      }}
      icon={<LockIcon />}
      action={
        <Button
          color="primary"
          size="small"
          variant="contained"
          onClick={onUpgrade}
          sx={{
            backgroundColor: brandColors.primary,
            '&:hover': {
              backgroundColor: brandColors.primaryDark,
            },
          }}
        >
          Upgrade to {MODE_LABELS[targetMode]}
        </Button>
      }
    >
      <AlertTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {feature} Available in {MODE_LABELS[targetMode]} Mode
          </Typography>
        </Box>
      </AlertTitle>
      <Typography variant="body2">
        {description}
      </Typography>
    </Alert>
  );
};

export default UpgradePrompt;