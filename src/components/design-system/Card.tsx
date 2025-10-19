import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'subtle';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface DesignSystemCardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: CardVariant;
  padding?: CardPadding;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

// Styled Card Component
const StyledCard = styled(MuiCard)<{
  $variant: CardVariant;
  $padding: CardPadding;
}>(({ $variant, $padding }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'default':
        return {
          backgroundColor: `rgb(var(--bg-elevated))`,
          border: `1px solid rgb(var(--border))`,
          boxShadow: 'var(--shadow-sm)',
        };
      case 'elevated':
        return {
          backgroundColor: `rgb(var(--bg-elevated))`,
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          '&:hover': {
            boxShadow: 'var(--shadow-colored-hover)',
            transform: 'translateY(-2px)',
          },
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          border: `2px solid rgb(var(--border))`,
          boxShadow: 'none',
        };
      case 'glass':
        return {
          backgroundColor: `rgba(255, 255, 255, 0.25)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          boxShadow: 'var(--shadow-colored)',
        };
      case 'subtle':
        return {
          backgroundColor: `rgb(var(--bg-muted))`,
          border: 'none',
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  const getPaddingStyles = () => {
    switch ($padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: 'var(--space-3)' };
      case 'md':
        return { padding: 'var(--space-4)' };
      case 'lg':
        return { padding: 'var(--space-6)' };
      default:
        return { padding: 'var(--space-4)' };
    }
  };

  return {
    borderRadius: 'var(--radius-xl)',
    transition: 'var(--transition-base)',
    ...getVariantStyles(),
    ...getPaddingStyles(),
  };
});

const StyledCardContent = styled(CardContent)<{ $padding: CardPadding }>(({ $padding }) => {
  const getPaddingStyles = () => {
    switch ($padding) {
      case 'none':
        return { padding: 0, '&:last-child': { paddingBottom: 0 } };
      case 'sm':
        return { padding: 'var(--space-3)', '&:last-child': { paddingBottom: 'var(--space-3)' } };
      case 'md':
        return { padding: 'var(--space-4)', '&:last-child': { paddingBottom: 'var(--space-4)' } };
      case 'lg':
        return { padding: 'var(--space-6)', '&:last-child': { paddingBottom: 'var(--space-6)' } };
      default:
        return { padding: 'var(--space-4)', '&:last-child': { paddingBottom: 'var(--space-4)' } };
    }
  };

  return {
    ...getPaddingStyles(),
  };
});

const StyledCardHeader = styled(CardHeader)(() => ({
  padding: 'var(--space-4) var(--space-4) 0 var(--space-4)',
  '& .MuiCardHeader-title': {
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--text-lg)',
    color: 'rgb(var(--fg-default))',
  },
  '& .MuiCardHeader-subheader': {
    fontFamily: 'var(--font-family-primary)',
    fontSize: 'var(--text-sm)',
    color: 'rgb(var(--fg-muted))',
  },
}));

const StyledCardActions = styled(CardActions)(() => ({
  padding: '0 var(--space-4) var(--space-4) var(--space-4)',
  gap: 'var(--space-2)',
}));

export const Card: React.FC<DesignSystemCardProps> = ({
  variant = 'default',
  padding = 'md',
  header,
  actions,
  children,
  ...props
}) => {
  return (
    <StyledCard $variant={variant} $padding={padding} {...props}>
      {header && <StyledCardHeader>{header}</StyledCardHeader>}
      <StyledCardContent $padding={padding}>
        {children}
      </StyledCardContent>
      {actions && <StyledCardActions>{actions}</StyledCardActions>}
    </StyledCard>
  );
};

export default Card;
