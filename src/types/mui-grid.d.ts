/**
 * Type augmentation for MUI Grid component to support legacy Grid API
 * This resolves TypeScript errors with `item` prop in MUI v7
 */

import { GridProps } from '@mui/material/Grid';

declare module '@mui/material/Grid' {
  interface GridProps {
    /**
     * If `true`, the component will have the flex *item* behavior.
     * You should be wrapping items with a *container*.
     */
    item?: boolean;
  }
}

// Ensure this file is treated as a module
export {};

