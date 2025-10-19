import React, { forwardRef } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export type InputVariant = 'default' | 'outlined' | 'filled' | 'underlined';
export type InputSize = 'sm' | 'md' | 'lg';

export interface DesignSystemInputProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  helperText?: string;
}

// Styled TextField Component
const StyledTextField = styled(TextField)<{
  $variant: InputVariant;
  $size: InputSize;
  $hasError: boolean;
  $hasSuccess: boolean;
}>(({ $variant, $size, $hasError, $hasSuccess }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'default':
      case 'outlined':
        return {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgb(var(--bg-elevated))',
            '& fieldset': {
              borderColor: 'rgb(var(--border))',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgb(var(--border-focus))',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgb(var(--border-focus))',
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: 'rgb(var(--danger))',
            },
          },
        };
      case 'filled':
        return {
          '& .MuiFilledInput-root': {
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgb(var(--bg-muted))',
            '&:hover': {
              backgroundColor: 'rgb(var(--bg-subtle))',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgb(var(--bg-elevated))',
            },
            '&.Mui-error': {
              backgroundColor: 'rgba(var(--danger), 0.1)',
            },
          },
        };
      case 'underlined':
        return {
          '& .MuiInput-root': {
            '&:before': {
              borderBottomColor: 'rgb(var(--border))',
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottomColor: 'rgb(var(--border-focus))',
            },
            '&.Mui-focused:after': {
              borderBottomColor: 'rgb(var(--border-focus))',
            },
            '&.Mui-error:after': {
              borderBottomColor: 'rgb(var(--danger))',
            },
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
          '& .MuiInputBase-input': {
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
          },
        };
      case 'md':
        return {
          '& .MuiInputBase-input': {
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--text-base)',
          },
        };
      case 'lg':
        return {
          '& .MuiInputBase-input': {
            padding: 'var(--space-4) var(--space-5)',
            fontSize: 'var(--text-lg)',
          },
        };
      default:
        return {};
    }
  };

  return {
    fontFamily: 'var(--font-family-primary)',
    '& .MuiInputLabel-root': {
      fontFamily: 'var(--font-family-primary)',
      fontSize: 'var(--text-sm)',
      color: 'rgb(var(--fg-muted))',
      '&.Mui-focused': {
        color: 'rgb(var(--brand-primary))',
      },
      '&.Mui-error': {
        color: 'rgb(var(--danger))',
      },
    },
    '& .MuiFormHelperText-root': {
      fontFamily: 'var(--font-family-primary)',
      fontSize: 'var(--text-xs)',
      marginTop: 'var(--space-1)',
      '&.Mui-error': {
        color: 'rgb(var(--danger))',
      },
    },
    ...getVariantStyles(),
    ...getSizeStyles(),
  };
});

export const Input = forwardRef<HTMLDivElement, DesignSystemInputProps>(({
  variant = 'outlined',
  size = 'md',
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  errorMessage,
  successMessage,
  helperText,
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getHelperText = () => {
    if (errorMessage) return errorMessage;
    if (successMessage) return successMessage;
    return helperText;
  };

  const getHelperTextProps = () => {
    if (errorMessage) return { error: true };
    if (successMessage) return { success: true };
    return {};
  };

  const InputProps = {
    startAdornment: leftIcon ? (
      <InputAdornment position="start">
        {leftIcon}
      </InputAdornment>
    ) : undefined,
    endAdornment: rightIcon || (isPassword && showPasswordToggle) ? (
      <InputAdornment position="end">
        {isPassword && showPasswordToggle ? (
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleTogglePassword}
            edge="end"
            size="small"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        ) : (
          rightIcon
        )}
      </InputAdornment>
    ) : undefined,
  };

  return (
    <StyledTextField
      ref={ref}
      $variant={variant}
      $size={size}
      $hasError={!!errorMessage}
      $hasSuccess={!!successMessage}
      type={actualType}
      InputProps={InputProps}
      helperText={getHelperText()}
      FormHelperTextProps={getHelperTextProps()}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
