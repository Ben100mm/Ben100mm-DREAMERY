import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, AlertTitle, IconButton, Collapse, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import Typography from './Typography';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';
export type AlertSeverity = 'success' | 'warning' | 'error' | 'info';

export interface DesignSystemAlertProps extends Omit<MuiAlertProps, 'severity' | 'variant'> {
  variant?: AlertVariant;
  severity?: AlertSeverity;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
}

// Styled Alert Component
const StyledAlert = styled(MuiAlert)<{
  $variant: AlertVariant;
  $severity: AlertSeverity;
}>(({ $variant, $severity }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'success':
        return {
          backgroundColor: 'rgba(var(--success), 0.1)',
          borderColor: 'rgb(var(--success))',
          color: 'rgb(var(--success))',
          '& .MuiAlert-icon': {
            color: 'rgb(var(--success))',
          },
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(var(--warning), 0.1)',
          borderColor: 'rgb(var(--warning))',
          color: 'rgb(var(--warning))',
          '& .MuiAlert-icon': {
            color: 'rgb(var(--warning))',
          },
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(var(--danger), 0.1)',
          borderColor: 'rgb(var(--danger))',
          color: 'rgb(var(--danger))',
          '& .MuiAlert-icon': {
            color: 'rgb(var(--danger))',
          },
        };
      case 'info':
        return {
          backgroundColor: 'rgba(var(--info), 0.1)',
          borderColor: 'rgb(var(--info))',
          color: 'rgb(var(--info))',
          '& .MuiAlert-icon': {
            color: 'rgb(var(--info))',
          },
        };
      default:
        return {
          backgroundColor: 'rgb(var(--bg-muted))',
          borderColor: 'rgb(var(--border))',
          color: 'rgb(var(--fg-default))',
          '& .MuiAlert-icon': {
            color: 'rgb(var(--brand-primary))',
          },
        };
    }
  };

  return {
    fontFamily: 'var(--font-family-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid',
    boxShadow: 'var(--shadow-sm)',
    '& .MuiAlert-message': {
      width: '100%',
    },
    ...getVariantStyles(),
  };
});

const AlertContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
  width: '100%',
}));

const AlertHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
}));

export const Alert: React.FC<DesignSystemAlertProps> = ({
  variant = 'default',
  severity = 'info',
  title,
  dismissible = false,
  onDismiss,
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState(true);

  const handleDismiss = () => {
    setOpen(false);
    onDismiss?.();
  };

  const getSeverity = (): AlertSeverity => {
    if (variant === 'success') return 'success';
    if (variant === 'warning') return 'warning';
    if (variant === 'danger') return 'error';
    if (variant === 'info') return 'info';
    return severity;
  };

  if (!open) {
    return null;
  }

  return (
    <Collapse in={open}>
      <StyledAlert
        $variant={variant}
        $severity={getSeverity()}
        severity={getSeverity()}
        action={
          dismissible ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : undefined
        }
        {...props}
      >
        <AlertContent>
          {(title || dismissible) && (
            <AlertHeader>
              {title && (
                <AlertTitle>
                  <Typography variant="body2" weight="semibold">
                    {title}
                  </Typography>
                </AlertTitle>
              )}
            </AlertHeader>
          )}
          <Typography variant="body2">
            {children}
          </Typography>
        </AlertContent>
      </StyledAlert>
    </Collapse>
  );
};

export default Alert;
