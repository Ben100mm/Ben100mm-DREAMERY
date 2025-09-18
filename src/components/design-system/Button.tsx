import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Design System Button Variants
export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'info';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface DesignSystemButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

// Styled Button Component
const StyledButton = styled(MuiButton)<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $loading: boolean;
}>(({ theme, $variant, $size, $loading }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'default':
        return {
          backgroundColor: `rgb(var(--brand-primary))`,
          color: `rgb(var(--brand-primary-contrast))`,
          '&:hover': {
            backgroundColor: `rgba(var(--brand-primary), 0.9)`,
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-colored-hover)',
          },
        };
      case 'secondary':
        return {
          backgroundColor: `rgb(var(--brand-secondary))`,
          color: `rgb(var(--brand-secondary-contrast))`,
          '&:hover': {
            backgroundColor: `rgba(var(--brand-secondary), 0.9)`,
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-colored-hover)',
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: `rgb(var(--brand-primary))`,
          border: `1px solid rgb(var(--border))`,
          '&:hover': {
            backgroundColor: `rgba(var(--hover), var(--hover-opacity))`,
            borderColor: `rgb(var(--brand-primary))`,
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: `rgb(var(--fg-default))`,
          '&:hover': {
            backgroundColor: `rgba(var(--hover), var(--hover-opacity))`,
          },
        };
      case 'destructive':
        return {
          backgroundColor: `rgb(var(--danger))`,
          color: `rgb(var(--danger-contrast))`,
          '&:hover': {
            backgroundColor: `rgba(var(--danger), 0.9)`,
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-colored-hover)',
          },
        };
      case 'success':
        return {
          backgroundColor: `rgb(var(--success))`,
          color: `rgb(var(--success-contrast))`,
          '&:hover': {
            backgroundColor: `rgba(var(--success), 0.9)`,
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-colored-hover)',
          },
        };
      case 'warning':
        return {
          backgroundColor: `rgb(var(--warning))`,
          color: `rgb(var(--warning-contrast))`,
          '&:hover': {
            backgroundColor: `rgba(var(--warning), 0.9)`,
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-colored-hover)',
          },
        };
      case 'info':
        return {
          backgroundColor: `rgb(var(--info))`,
          color: `rgb(var(--info-contrast))`,
          '&:hover': {
            backgroundColor: `rgba(var(--info), 0.9)`,
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-colored-hover)',
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch ($size) {
      case 'sm':
        return {
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--text-sm)',
          minHeight: '32px',
        };
      case 'md':
        return {
          padding: 'var(--space-3) var(--space-4)',
          fontSize: 'var(--text-base)',
          minHeight: '40px',
        };
      case 'lg':
        return {
          padding: 'var(--space-4) var(--space-6)',
          fontSize: 'var(--text-lg)',
          minHeight: '48px',
        };
      default:
        return {};
    }
  };

  return {
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 'var(--font-weight-medium)',
    textTransform: 'none',
    borderRadius: 'var(--radius-lg)',
    transition: 'var(--transition-base)',
    boxShadow: 'var(--shadow-sm)',
    '&:focus-visible': {
      outline: `2px solid rgb(var(--ring))`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...($loading && {
      cursor: 'not-allowed',
    }),
  };
});

export const Button: React.FC<DesignSystemButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  loadingText,
  children,
  disabled,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $loading={loading}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
            sx={{ 
              color: 'inherit', 
              marginRight: loadingText ? 'var(--space-2)' : 0 
            }}
          />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
