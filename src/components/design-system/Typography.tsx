import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'overline'
  | 'display1' | 'display2' | 'display3'
  | 'lead' | 'small';

export type TypographyColor = 
  | 'default' | 'muted' | 'subtle' | 'inverse' | 'disabled'
  | 'brand-primary' | 'brand-secondary' | 'brand-accent'
  | 'success' | 'warning' | 'danger' | 'info';

export interface DesignSystemTypographyProps extends Omit<MuiTypographyProps, 'variant' | 'color'> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  noWrap?: boolean;
}

// Styled Typography Component
const StyledTypography = styled(MuiTypography)<{
  $variant: TypographyVariant;
  $color: TypographyColor;
  $weight: string;
  $truncate: boolean;
}>(({ $variant, $color, $weight, $truncate }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'h1':
        return {
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-5xl)',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--line-height-tight)',
          letterSpacing: '-0.025em',
        };
      case 'h2':
        return {
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--line-height-tight)',
          letterSpacing: '-0.025em',
        };
      case 'h3':
        return {
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-weight-semibold)',
          lineHeight: 'var(--line-height-snug)',
        };
      case 'h4':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          lineHeight: 'var(--line-height-snug)',
        };
      case 'h5':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          lineHeight: 'var(--line-height-normal)',
        };
      case 'h6':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          lineHeight: 'var(--line-height-normal)',
        };
      case 'display1':
        return {
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-6xl)',
          fontWeight: 'var(--font-weight-black)',
          lineHeight: 'var(--line-height-tight)',
          letterSpacing: '-0.05em',
        };
      case 'display2':
        return {
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-5xl)',
          fontWeight: 'var(--font-weight-extrabold)',
          lineHeight: 'var(--line-height-tight)',
          letterSpacing: '-0.025em',
        };
      case 'display3':
        return {
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--line-height-snug)',
        };
      case 'body1':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 'var(--line-height-normal)',
        };
      case 'body2':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 'var(--line-height-normal)',
        };
      case 'lead':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 'var(--line-height-relaxed)',
        };
      case 'caption':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 'var(--line-height-normal)',
        };
      case 'overline':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          lineHeight: 'var(--line-height-normal)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        };
      case 'small':
        return {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 'var(--line-height-normal)',
        };
      default:
        return {};
    }
  };

  const getColorStyles = () => {
    switch ($color) {
      case 'default':
        return { color: 'rgb(var(--fg-default))' };
      case 'muted':
        return { color: 'rgb(var(--fg-muted))' };
      case 'subtle':
        return { color: 'rgb(var(--fg-subtle))' };
      case 'inverse':
        return { color: 'rgb(var(--fg-inverse))' };
      case 'disabled':
        return { color: 'rgb(var(--fg-disabled))' };
      case 'brand-primary':
        return { color: 'rgb(var(--brand-primary))' };
      case 'brand-secondary':
        return { color: 'rgb(var(--brand-secondary))' };
      case 'brand-accent':
        return { color: 'rgb(var(--brand-accent))' };
      case 'success':
        return { color: 'rgb(var(--success))' };
      case 'warning':
        return { color: 'rgb(var(--warning))' };
      case 'danger':
        return { color: 'rgb(var(--danger))' };
      case 'info':
        return { color: 'rgb(var(--info))' };
      default:
        return { color: 'rgb(var(--fg-default))' };
    }
  };

  const getWeightStyles = () => {
    switch ($weight) {
      case 'normal':
        return { fontWeight: 'var(--font-weight-normal)' };
      case 'medium':
        return { fontWeight: 'var(--font-weight-medium)' };
      case 'semibold':
        return { fontWeight: 'var(--font-weight-semibold)' };
      case 'bold':
        return { fontWeight: 'var(--font-weight-bold)' };
      case 'extrabold':
        return { fontWeight: 'var(--font-weight-extrabold)' };
      case 'black':
        return { fontWeight: 'var(--font-weight-black)' };
      default:
        return {};
    }
  };

  return {
    ...getVariantStyles(),
    ...getColorStyles(),
    ...getWeightStyles(),
    ...($truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  };
});

export const Typography: React.FC<DesignSystemTypographyProps> = ({
  variant = 'body1',
  color = 'default',
  weight,
  align,
  truncate = false,
  noWrap = false,
  children,
  ...props
}) => {
  return (
    <StyledTypography
      $variant={variant}
      $color={color}
      $weight={weight || 'normal'}
      $truncate={truncate}
      textAlign={align}
      noWrap={noWrap}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography;
