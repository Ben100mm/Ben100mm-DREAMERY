import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type SpacerSize = 
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  | 'section' | 'page';

export type SpacerDirection = 'vertical' | 'horizontal' | 'both';

export interface DesignSystemSpacerProps extends Omit<BoxProps, 'variant'> {
  size?: SpacerSize;
  direction?: SpacerDirection;
  responsive?: boolean;
}

// Styled Spacer Component
const StyledSpacer = styled(Box)<{
  $size: SpacerSize;
  $direction: SpacerDirection;
  $responsive: boolean;
}>(({ $size, $direction, $responsive }) => {
  const getSizeValue = () => {
    switch ($size) {
      case 'xs':
        return 'var(--space-1)';
      case 'sm':
        return 'var(--space-2)';
      case 'md':
        return 'var(--space-4)';
      case 'lg':
        return 'var(--space-6)';
      case 'xl':
        return 'var(--space-8)';
      case '2xl':
        return 'var(--space-12)';
      case '3xl':
        return 'var(--space-16)';
      case '4xl':
        return 'var(--space-24)';
      case 'section':
        return 'var(--space-32)';
      case 'page':
        return 'var(--space-48)';
      default:
        return 'var(--space-4)';
    }
  };

  const getDirectionStyles = () => {
    const sizeValue = getSizeValue();
    
    switch ($direction) {
      case 'vertical':
        return {
          height: sizeValue,
          width: '100%',
        };
      case 'horizontal':
        return {
          width: sizeValue,
          height: '100%',
        };
      case 'both':
        return {
          height: sizeValue,
          width: sizeValue,
        };
      default:
        return {
          height: sizeValue,
          width: '100%',
        };
    }
  };

  const getResponsiveStyles = () => {
    if (!$responsive) return {};
    
    return {
      '@media (min-width: 768px)': {
        height: $direction === 'horizontal' ? 'inherit' : 'calc(var(--space-32) * 1.5)',
        width: $direction === 'vertical' ? '100%' : 'calc(var(--space-32) * 1.5)',
      },
      '@media (min-width: 1200px)': {
        height: $direction === 'horizontal' ? 'inherit' : 'var(--space-48)',
        width: $direction === 'vertical' ? '100%' : 'var(--space-48)',
      },
    };
  };

  return {
    flexShrink: 0,
    ...getDirectionStyles(),
    ...getResponsiveStyles(),
  };
});

export const Spacer: React.FC<DesignSystemSpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  responsive = false,
  ...props
}) => {
  return (
    <StyledSpacer
      $size={size}
      $direction={direction}
      $responsive={responsive}
      {...props}
    />
  );
};

export default Spacer;
