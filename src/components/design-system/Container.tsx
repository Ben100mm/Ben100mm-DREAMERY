import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type ContainerVariant = 'default' | 'narrow' | 'wide' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface DesignSystemContainerProps extends Omit<BoxProps, 'variant'> {
  variant?: ContainerVariant;
  padding?: ContainerPadding;
  children: React.ReactNode;
}

// Styled Container Component
const StyledContainer = styled(Box)<{
  $variant: ContainerVariant;
  $padding: ContainerPadding;
}>(({ $variant, $padding }) => {
  const getVariantStyles = () => {
    switch ($variant) {
      case 'default':
        return {
          maxWidth: '1280px',
          margin: '0 auto',
        };
      case 'narrow':
        return {
          maxWidth: '720px',
          margin: '0 auto',
        };
      case 'wide':
        return {
          maxWidth: '960px',
          margin: '0 auto',
        };
      case 'full':
        return {
          maxWidth: '100%',
          margin: '0',
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
        return { padding: '0 var(--space-4)' };
      case 'md':
        return { padding: '0 var(--space-6)' };
      case 'lg':
        return { padding: '0 var(--space-8)' };
      case 'xl':
        return { padding: '0 var(--space-12)' };
      default:
        return { padding: '0 var(--space-6)' };
    }
  };

  return {
    width: '100%',
    ...getVariantStyles(),
    ...getPaddingStyles(),
  };
});

export const Container: React.FC<DesignSystemContainerProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  ...props
}) => {
  return (
    <StyledContainer
      $variant={variant}
      $padding={padding}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default Container;
