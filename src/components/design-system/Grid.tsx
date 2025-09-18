import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DesignSystemGridProps extends Omit<BoxProps, 'variant'> {
  columns?: GridColumns;
  gap?: GridGap;
  responsive?: boolean;
  children: React.ReactNode;
}

export interface DesignSystemGridItemProps extends Omit<BoxProps, 'variant'> {
  span?: GridColumns;
  start?: GridColumns;
  end?: GridColumns;
  children: React.ReactNode;
}

// Styled Grid Component
const StyledGrid = styled(Box)<{
  $columns: GridColumns;
  $gap: GridGap;
  $responsive: boolean;
}>(({ $columns, $gap, $responsive }) => {
  const getGapValue = () => {
    switch ($gap) {
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
      default:
        return 'var(--space-4)';
    }
  };

  const getGridTemplateColumns = () => {
    return `repeat(${$columns}, 1fr)`;
  };

  const getResponsiveStyles = () => {
    if (!$responsive) return {};
    
    return {
      '@media (max-width: 767px)': {
        gridTemplateColumns: '1fr',
        gap: 'var(--space-3)',
      },
      '@media (min-width: 768px) and (max-width: 1199px)': {
        gridTemplateColumns: $columns >= 3 ? 'repeat(2, 1fr)' : `repeat(${$columns}, 1fr)`,
      },
    };
  };

  return {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gap: getGapValue(),
    width: '100%',
    ...getResponsiveStyles(),
  };
});

// Styled Grid Item Component
const StyledGridItem = styled(Box)<{
  $span?: GridColumns;
  $start?: GridColumns;
  $end?: GridColumns;
}>(({ $span, $start, $end }) => {
  const getGridColumn = () => {
    if ($span) {
      return `span ${$span}`;
    }
    if ($start && $end) {
      return `${$start} / ${$end}`;
    }
    if ($start) {
      return `${$start} / -1`;
    }
    return 'auto';
  };

  return {
    gridColumn: getGridColumn(),
  };
});

export const Grid: React.FC<DesignSystemGridProps> = ({
  columns = 12,
  gap = 'md',
  responsive = true,
  children,
  ...props
}) => {
  return (
    <StyledGrid
      $columns={columns}
      $gap={gap}
      $responsive={responsive}
      {...props}
    >
      {children}
    </StyledGrid>
  );
};

export const GridItem: React.FC<DesignSystemGridItemProps> = ({
  span,
  start,
  end,
  children,
  ...props
}) => {
  return (
    <StyledGridItem
      $span={span}
      $start={start}
      $end={end}
      {...props}
    >
      {children}
    </StyledGridItem>
  );
};

export default Grid;
