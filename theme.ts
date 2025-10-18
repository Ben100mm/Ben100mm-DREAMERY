/**
 * Brand Colors and Theme Configuration
 * 
 * Complete theme system for the Standard Calculator
 */

export const brandColors = {
  // Primary colors
  primary: '#1976d2',
  primaryLight: '#42a5f5',
  primaryDark: '#1565c0',
  
  // Secondary colors
  secondary: '#dc004e',
  secondaryLight: '#ff5983',
  secondaryDark: '#9a0036',
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Background colors
  backgrounds: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#f1f3f4',
    hover: '#f5f5f5',
    selected: '#e3f2fd',
    disabled: '#f5f5f5',
    paper: '#ffffff',
    card: '#ffffff',
  },
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#bdbdbd',
    inverse: '#ffffff',
    hint: '#9e9e9e',
  },
  
  // Border colors
  borders: {
    primary: '#e0e0e0',
    secondary: '#f0f0f0',
    focus: '#1976d2',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
  },
  
  // Status colors
  success: '#4caf50',
  successLight: '#81c784',
  successDark: '#388e3c',
  
  warning: '#ff9800',
  warningLight: '#ffb74d',
  warningDark: '#f57c00',
  
  error: '#f44336',
  errorLight: '#e57373',
  errorDark: '#d32f2f',
  
  info: '#2196f3',
  infoLight: '#64b5f6',
  infoDark: '#1976d2',
  
  // Chart colors
  chart: {
    primary: '#1976d2',
    secondary: '#dc004e',
    tertiary: '#4caf50',
    quaternary: '#ff9800',
    quinary: '#9c27b0',
    senary: '#00bcd4',
  },
  
  // Gradient colors
  gradients: {
    primary: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    secondary: 'linear-gradient(135deg, #dc004e 0%, #ff5983 100%)',
    success: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
    warning: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
    error: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
  },
};

// Typography configuration
export const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing configuration
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
};

// Border radius configuration
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadow configuration
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Breakpoints configuration
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
};

// Component-specific styles
export const componentStyles = {
  // Card styles
  card: {
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    backgroundColor: brandColors.backgrounds.card,
    border: `1px solid ${brandColors.borders.primary}`,
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: brandColors.primary,
      color: brandColors.text.inverse,
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
      boxShadow: shadows.sm,
      '&:hover': {
        backgroundColor: brandColors.primaryDark,
        boxShadow: shadows.md,
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: brandColors.primary,
      border: `1px solid ${brandColors.primary}`,
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: brandColors.backgrounds.hover,
      },
    },
  },
  
  // Input styles
  input: {
    borderRadius: borderRadius.md,
    border: `1px solid ${brandColors.borders.primary}`,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.md,
    '&:focus': {
      borderColor: brandColors.borders.focus,
      boxShadow: `0 0 0 2px ${brandColors.borders.focus}20`,
    },
    '&:error': {
      borderColor: brandColors.borders.error,
    },
  },
  
  // Accordion styles
  accordion: {
    borderRadius: borderRadius.lg,
    border: `1px solid ${brandColors.borders.primary}`,
    backgroundColor: brandColors.backgrounds.card,
    marginBottom: spacing.md,
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      marginBottom: spacing.md,
    },
  },
  
  // Table styles
  table: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    border: `1px solid ${brandColors.borders.primary}`,
    backgroundColor: brandColors.backgrounds.card,
  },
  
  // Paper styles
  paper: {
    borderRadius: borderRadius.lg,
    backgroundColor: brandColors.backgrounds.paper,
    boxShadow: shadows.sm,
    border: `1px solid ${brandColors.borders.secondary}`,
  },
  
  // Chip styles
  chip: {
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
  },
  
  // Alert styles
  alert: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
};

// Animation configuration
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// Z-index configuration
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Export default theme object
export const theme = {
  colors: brandColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  componentStyles,
  animations,
  zIndex,
};

export default theme;
