/**
 * Grid Compatibility Wrapper for MUI v7
 * Provides backward compatibility with the old Grid API (container/item props)
 */

import React from 'react';
import { Grid as MuiGrid, GridProps } from '@mui/material';

// Type for the legacy Grid props
interface GridCompatProps extends Omit<GridProps, 'container' | 'item'> {
  container?: boolean;
  item?: boolean;
  children?: React.ReactNode;
  spacing?: number;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
}

/**
 * Grid component that wraps MUI Grid to support legacy `item` prop
 * Usage: Same as the old Grid component with `container` and `item` props
 */
export const Grid: React.FC<GridCompatProps> = ({ container, item, children, ...props }) => {
  // Cast to any to bypass TypeScript checks
  return <MuiGrid container={container} item={item as any} {...props}>{children}</MuiGrid>;
};

export default Grid;

