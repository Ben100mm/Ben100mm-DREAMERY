import React from 'react';
import { Box, LinearProgress, CircularProgress, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from './Typography';

export type ProgressType = 'linear' | 'circular';
export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface DesignSystemProgressProps extends Omit<BoxProps, 'variant'> {
  type?: ProgressType;
  size?: ProgressSize;
  variant?: ProgressVariant;
  value?: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  indeterminate?: boolean;
}

// Styled Progress Components
const StyledLinearProgress = styled(LinearProgress)<{
  $variant: ProgressVariant;
  $size: ProgressSize;
}>(({ $variant, $size }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'success':
        return {
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'rgb(var(--success))',
          },
        };
      case 'warning':
        return {
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'rgb(var(--warning))',
          },
        };
      case 'danger':
        return {
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'rgb(var(--danger))',
          },
        };
      case 'info':
        return {
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'rgb(var(--info))',
          },
        };
      default:
        return {
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'rgb(var(--brand-primary))',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch ($size) {
      case 'sm':
        return {
          height: '4px',
        };
      case 'md':
        return {
          height: '6px',
        };
      case 'lg':
        return {
          height: '8px',
        };
      default:
        return {
          height: '6px',
        };
    }
  };

  return {
    backgroundColor: 'rgb(var(--bg-muted))',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    ...getVariantStyles(),
    ...getSizeStyles(),
  };
});

const StyledCircularProgress = styled(CircularProgress)<{
  $variant: ProgressVariant;
  $size: ProgressSize;
}>(({ $variant, $size }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'success':
        return {
          color: 'rgb(var(--success))',
        };
      case 'warning':
        return {
          color: 'rgb(var(--warning))',
        };
      case 'danger':
        return {
          color: 'rgb(var(--danger))',
        };
      case 'info':
        return {
          color: 'rgb(var(--info))',
        };
      default:
        return {
          color: 'rgb(var(--brand-primary))',
        };
    }
  };

  const getSizeStyles = () => {
    switch ($size) {
      case 'sm':
        return {
          width: '24px !important',
          height: '24px !important',
        };
      case 'md':
        return {
          width: '40px !important',
          height: '40px !important',
        };
      case 'lg':
        return {
          width: '56px !important',
          height: '56px !important',
        };
      default:
        return {
          width: '40px !important',
          height: '40px !important',
        };
    }
  };

  return {
    ...getVariantStyles(),
    ...getSizeStyles(),
  };
});

const ProgressContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
  width: '100%',
}));

const ProgressLabel = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

const CircularProgressContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-2)',
}));

export const ProgressIndicator: React.FC<DesignSystemProgressProps> = ({
  type = 'linear',
  size = 'md',
  variant = 'default',
  value = 0,
  max = 100,
  showLabel = false,
  label,
  showPercentage = false,
  indeterminate = false,
  ...props
}) => {
  const percentage = Math.round((value / max) * 100);
  const displayValue = indeterminate ? undefined : (value / max) * 100;

  if (type === 'circular') {
    return (
      <CircularProgressContainer {...props}>
        <StyledCircularProgress
          $variant={variant}
          $size={size}
          variant={indeterminate ? 'indeterminate' : 'determinate'}
          value={displayValue}
        />
        {(showLabel || showPercentage) && (
          <Box>
            {showLabel && label && (
              <Typography variant="caption" color="muted" align="center">
                {label}
              </Typography>
            )}
            {showPercentage && !indeterminate && (
              <Typography variant="caption" color="muted" align="center">
                {percentage}%
              </Typography>
            )}
          </Box>
        )}
      </CircularProgressContainer>
    );
  }

  return (
    <ProgressContainer {...props}>
      {(showLabel || showPercentage) && (
        <ProgressLabel>
          {showLabel && label && (
            <Typography variant="caption" color="muted">
              {label}
            </Typography>
          )}
          {showPercentage && !indeterminate && (
            <Typography variant="caption" color="muted">
              {percentage}%
            </Typography>
          )}
        </ProgressLabel>
      )}
      <StyledLinearProgress
        $variant={variant}
        $size={size}
        variant={indeterminate ? 'indeterminate' : 'determinate'}
        value={displayValue}
      />
    </ProgressContainer>
  );
};

export default ProgressIndicator;
