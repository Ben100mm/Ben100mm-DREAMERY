import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { brandColors } from './theme';

interface UpgradePromptProps {
  currentMode: 'essential' | 'standard' | 'professional';
  targetMode: 'standard' | 'professional';
  feature: string;
  description?: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  variant?: 'card' | 'alert' | 'inline';
  showDismiss?: boolean;
}

const MODE_CONFIG = {
  essential: {
    label: 'Essential',
    color: brandColors.info,
    icon: <TrendingUpIcon fontSize="small" />,
  },
  standard: {
    label: 'Standard',
    color: brandColors.primary,
    icon: <StarIcon fontSize="small" />,
  },
  professional: {
    label: 'Professional',
    color: brandColors.secondary,
    icon: <StarIcon fontSize="small" />,
  },
};

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  currentMode,
  targetMode,
  feature,
  description,
  onUpgrade,
  onDismiss,
  variant = 'card',
  showDismiss = true,
}) => {
  const currentConfig = MODE_CONFIG[currentMode];
  const targetConfig = MODE_CONFIG[targetMode];

  const handleUpgrade = () => {
    onUpgrade?.();
  };

  const handleDismiss = () => {
    onDismiss?.();
  };

  if (variant === 'alert') {
    return (
      <Alert
        severity="info"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={handleUpgrade}
              sx={{
                backgroundColor: targetConfig.color,
                '&:hover': {
                  backgroundColor: targetConfig.color,
                  opacity: 0.9,
                },
              }}
            >
              Upgrade to {targetConfig.label}
            </Button>
            {showDismiss && (
              <IconButton size="small" onClick={handleDismiss}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          borderRadius: '8px',
          border: `1px solid ${brandColors.borders.info}`,
          backgroundColor: `${brandColors.info}10`,
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {feature} is available in {targetConfig.label} mode
          </Typography>
          {description && (
            <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
              {description}
            </Typography>
          )}
        </Box>
      </Alert>
    );
  }

  if (variant === 'inline') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderRadius: '6px',
          backgroundColor: `${targetConfig.color}10`,
          border: `1px solid ${targetConfig.color}30`,
        }}
      >
        <LockIcon fontSize="small" sx={{ color: targetConfig.color }} />
        <Typography variant="body2" sx={{ flex: 1, color: brandColors.text.secondary }}>
          {feature} requires {targetConfig.label} mode
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={handleUpgrade}
          sx={{
            borderColor: targetConfig.color,
            color: targetConfig.color,
            '&:hover': {
              backgroundColor: `${targetConfig.color}10`,
              borderColor: targetConfig.color,
            },
          }}
        >
          Upgrade
        </Button>
        {showDismiss && (
          <IconButton size="small" onClick={handleDismiss}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: `2px solid ${targetConfig.color}`,
        backgroundColor: `${targetConfig.color}05`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {showDismiss && (
        <IconButton
          size="small"
          onClick={handleDismiss}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: brandColors.backgrounds.paper,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: brandColors.backgrounds.hover,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: targetConfig.color,
              color: brandColors.text.inverse,
            }}
          >
            <LockIcon />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Upgrade Required
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
              This feature is available in {targetConfig.label} mode
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            {feature}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Chip
            label={currentConfig.label}
            size="small"
            icon={currentConfig.icon}
            sx={{
              backgroundColor: `${currentConfig.color}20`,
              color: currentConfig.color,
              fontWeight: 500,
            }}
          />
          
          <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
            →
          </Typography>
          
          <Chip
            label={targetConfig.label}
            size="small"
            icon={targetConfig.icon}
            sx={{
              backgroundColor: targetConfig.color,
              color: brandColors.text.inverse,
              fontWeight: 500,
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleUpgrade}
          sx={{
            backgroundColor: targetConfig.color,
            color: brandColors.text.inverse,
            fontWeight: 600,
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: targetConfig.color,
              opacity: 0.9,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Upgrade to {targetConfig.label}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
