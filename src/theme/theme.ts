/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
 */

import { createTheme } from '@mui/material/styles';

// Dreamery Brand Color Palette - Official Colors Only
export const brandColors = {
  // Primary Brand Colors
  primary: '#0d2340',        // Dark Blue - Primary brand color
  primaryLight: '#1a365d',   // Secondary brand color (darker blue)
  primaryDark: '#0a1a2e',    // Darker variant for gradients
  primary50: '#f0f4f8',      // Very light tint
  primary100: '#e3e8ed',     // Light tint
  primary200: '#c7d2da',     // Medium-light tint
  primary300: '#a3b4c0',     // Medium tint
  primary400: '#7f96a6',     // Medium-dark tint
  primary500: '#0d2340',     // Base color
  primary600: '#0a1a2e',     // Dark variant
  primary700: '#07111f',     // Darker variant
  primary800: '#040810',     // Very dark variant
  primary900: '#020408',     // Darkest variant
  
  // Secondary Colors
  secondary: '#1a365d',      // Darker Blue for gradients and secondary elements
  secondaryLight: '#2d4a6b', // Lighter variant
  secondaryDark: '#0d2340',  // Darker variant
  
  // Accent Colors - Status Indicators
  accent: {
    success: '#19401a',      // Success Green - "On Track" status and completed milestones
    successLight: '#2d5a2d', // Light green
    successDark: '#0f2a0f',  // Dark green
    warning: '#995c03',      // Warning Orange - "At Risk" indicators and pending states
    warningLight: '#b8730a', // Light orange
    warningDark: '#7a4a02',  // Dark orange
    info: '#113c5e',         // Info Blue - Progress bars and active states
    infoLight: '#1a5a8a',    // Light blue
    infoDark: '#0d2a42',     // Dark blue
    error: '#570701',        // Error Red - High urgency indicators
    errorLight: '#7a0a02',   // Light red
    errorDark: '#3d0501',    // Dark red
  },
  
  // Direct color access for backward compatibility
  success: '#19401a',        // Success Green
  warning: '#995c03',        // Warning Orange  
  error: '#570701',          // Error Red
  info: '#113c5e',           // Info Blue
  
  // Neutral Colors - Dreamery Brand Palette (Enhanced Contrast)
  neutral: {
    0: '#ffffff',            // White - Primary backgrounds for cards and content areas
    50: '#fafafa',           // Very light gray
    100: '#f5f5f5',          // Light Gray - Secondary backgrounds and subtle sections
    200: '#e0e0e0',          // Light borders (improved contrast)
    300: '#bdbdbd',          // Medium borders
    400: '#9e9e9e',          // Medium Gray - Tertiary text color
    500: '#757575',          // Medium gray (improved contrast)
    600: '#616161',          // Dark Gray - Secondary text color
    700: '#424242',          // Dark gray - Primary text color
    800: '#212121',          // Very dark gray - High contrast text
    900: '#0a0a0a',          // Almost black - Maximum contrast text
    950: '#000000',          // Pure black
  },
  
  // Action Colors - Dreamery Brand Actions
  actions: {
    primary: '#0d2340',      // Primary brand color for actions
    primaryHover: '#1a365d', // Primary hover state
    secondary: '#1a365d',    // Secondary brand color for actions
    secondaryHover: '#0d2340', // Secondary hover state
    success: '#19401a',      // Success Green for success indicators
    successHover: '#0f2a0f', // Success hover state
    warning: '#995c03',      // Warning Orange for warnings
    warningHover: '#7a4a02', // Warning hover state
    error: '#570701',        // Error Red for errors
    errorHover: '#3d0501',   // Error hover state
    info: '#113c5e',         // Info Blue for info actions
    infoHover: '#0d2a42',    // Info hover state
    disabled: '#ababab',     // Disabled state
  },
  
  // Status Colors - Dreamery Brand Status System
  status: {
    active: '#0d2340',       // Primary brand for active states
    completed: '#19401a',    // Success Green for completed
    pending: '#995c03',      // Warning Orange for pending
    inactive: '#ababab',     // Medium Gray for inactive
    draft: '#858585',        // Dark Gray for draft states
    archived: '#616161',     // Dark gray for archived
    cancelled: '#570701',    // Error Red for cancelled
    scheduled: '#113c5e',    // Info Blue for scheduled
    inProgress: '#995c03',   // Warning Orange for in progress
  },
  
  // Surface Colors - Dreamery Brand Surfaces (Enhanced Contrast)
  surfaces: {
    primary: '#ffffff',       // White - Primary backgrounds for cards and content areas
    secondary: '#f8f9fa',    // Very Light Gray - Secondary backgrounds (improved contrast)
    tertiary: '#f1f3f4',     // Light gray tertiary surface (better contrast)
    elevated: '#ffffff',     // Elevated surfaces (cards, modals)
    overlay: 'rgba(0, 0, 0, 0.5)', // Backdrop overlay
    glass: 'rgba(255, 255, 255, 0.25)', // Glass morphism
    glassHover: 'rgba(255, 255, 255, 0.35)', // Glass hover
    glassDark: 'rgba(13, 35, 64, 0.25)', // Dark glass
    glassDarkHover: 'rgba(13, 35, 64, 0.35)', // Dark glass hover
  },
  
  // Background Colors - Dreamery Brand Backgrounds (Enhanced Contrast)
  backgrounds: {
    primary: '#ffffff',       // White - Primary backgrounds for cards and content areas
    secondary: '#f8f9fa',    // Very Light Gray - Secondary backgrounds (improved contrast)
    tertiary: '#f1f3f4',     // Light gray with better contrast
    selected: '#e3f2fd',     // Light blue for selected states (maintained)
    hover: '#f0f4f8',        // Very light blue for hover (maintained)
    focus: '#e3f2fd',        // Light blue for focus states (improved)
    success: '#e8f5e8',      // Light green for success states (maintained)
    warning: '#fff3cd',      // Light yellow for warning states (improved contrast)
    error: '#ffebee',        // Light red for error states (improved contrast)
    info: '#e3f2fd',         // Light blue for info states (improved)
    gradient: 'linear-gradient(135deg, #0d2340 0%, #1a365d 100%)',
    gradientLight: 'linear-gradient(135deg, #1a365d 0%, #2d4a6b 100%)',
    gradientSubtle: 'linear-gradient(180deg, rgba(13, 35, 64, 0.1) 0%, transparent 100%)',
  },
  
  // Border Colors - Dreamery Brand Borders
  borders: {
    primary: '#0d2340',      // Primary brand color for borders
    secondary: '#e3e1e1',    // Light Gray for secondary borders
    tertiary: '#f5f5f5',     // Very light gray for subtle borders
    focus: '#113c5e',        // Info Blue for focus states
    success: '#19401a',      // Success Green for success borders
    warning: '#995c03',      // Warning Orange for warning borders
    error: '#570701',        // Error Red for error borders
    info: '#113c5e',         // Info Blue for info borders
    disabled: '#e3e1e1',     // Light Gray for disabled borders
    hover: '#ababab',        // Medium Gray for hover borders
  },
  
  // Text Colors - Dreamery Brand Text System (Enhanced Contrast)
  text: {
    primary: '#212121',      // Very Dark Gray - Primary text color (WCAG AA compliant)
    secondary: '#424242',    // Dark Gray - Secondary text color (improved contrast)
    tertiary: '#616161',     // Medium gray for tertiary text (better readability)
    disabled: '#9e9e9e',     // Light Gray for disabled text
    inverse: '#ffffff',      // White text for dark backgrounds
    accent: '#0d2340',       // Primary brand for accent text
    success: '#19401a',      // Success Green for success text
    warning: '#995c03',      // Warning Orange for warning text
    error: '#570701',        // Error Red for error text
    info: '#113c5e',         // Info Blue for info text
    link: '#113c5e',         // Info Blue for links
    linkHover: '#0d2a42',    // Darker blue for link hover
  },
  
  // Interactive States - Dreamery Brand Interactions
  interactive: {
    hover: 'rgba(13, 35, 64, 0.08)', // Light blue hover
    hoverDark: 'rgba(13, 35, 64, 0.12)', // Darker blue hover
    pressed: 'rgba(13, 35, 64, 0.12)', // Pressed state
    focus: '#113c5e', // Info Blue focus ring
    focusVisible: 'rgba(17, 60, 94, 0.3)', // Visible focus ring
    disabled: 'rgba(0, 0, 0, 0.26)', // Disabled state
  },
  
  // Data Visualization Colors - Dreamery Brand Data
  data: {
    primary: '#0d2340',      // Primary data color
    secondary: '#19401a',    // Success Green data color
    tertiary: '#995c03',     // Warning Orange data color
    quaternary: '#113c5e',   // Info Blue data color
    quinary: '#570701',      // Error Red data color
    senary: '#1a365d',       // Secondary brand data color
    neutral: '#ababab',      // Medium Gray neutral data color
  },
  
  // Accessibility Colors - Dreamery Brand Accessibility
  accessibility: {
    focus: '#113c5e',        // Info Blue high contrast focus
    focusRing: 'rgba(17, 60, 94, 0.5)', // Info Blue focus ring
    highContrast: '#0a0a0a', // High contrast text
    lowContrast: '#ababab',  // Medium Gray low contrast text
    required: '#570701',     // Error Red required field indicator
  },
  
  // Shadow Colors - Dreamery Brand Shadows
  shadows: {
    light: 'rgba(0, 0, 0, 0.1)', // Light shadow
    medium: 'rgba(0, 0, 0, 0.15)', // Medium shadow
    dark: 'rgba(0, 0, 0, 0.25)', // Dark shadow
    colored: 'rgba(13, 35, 64, 0.15)', // Brand colored shadow
    coloredHover: '#113c5e', // Info Blue colored hover shadow
  }
};

// Color utility functions for Dreamery Brand patterns
export const colorUtils = {
  // Glass morphism backgrounds
  glass: (opacity = 0.25) => `rgba(255, 255, 255, ${opacity})`,
  glassHover: (opacity = 0.35) => `rgba(255, 255, 255, ${opacity})`,
  glassDark: (opacity = 0.25) => `rgba(13, 35, 64, ${opacity})`,
  glassDarkHover: (opacity = 0.35) => `rgba(13, 35, 64, ${opacity})`,
  
  // Brand color with opacity
  primaryWithOpacity: (opacity = 1) => `rgba(13, 35, 64, ${opacity})`,
  secondaryWithOpacity: (opacity = 1) => `rgba(26, 54, 93, ${opacity})`,
  
  // Common gradients
  primaryGradient: 'linear-gradient(135deg, #0d2340 0%, #1a365d 100%)',
  primaryGradientLight: 'linear-gradient(135deg, #1a365d 0%, #2d4a6b 100%)',
  subtleGradient: 'linear-gradient(180deg, rgba(13, 35, 64, 0.1) 0%, transparent 100%)',
  glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
  
  // Interactive states
  hover: (color: string, opacity = 0.08) => {
    const rgb = color.startsWith('#') ? color.slice(1) : color;
    const r = parseInt(rgb.slice(0, 2), 16);
    const g = parseInt(rgb.slice(2, 4), 16);
    const b = parseInt(rgb.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  // Shadow utilities
  shadow: (color = '0, 0, 0', opacity = 0.1, blur = 8, spread = 0) => 
    `rgba(${color}, ${opacity}) ${spread}px ${spread}px ${blur}px`,
  shadowColored: (opacity = 0.15, blur = 8, spread = 0) => 
    `rgba(13, 35, 64, ${opacity}) ${spread}px ${spread}px ${blur}px`,
};

// Create Material-UI theme with Dreamery brand colors
export const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.primary, // #0d2340
      light: brandColors.primaryLight, // #1a365d
      dark: brandColors.primaryDark, // #0a1a2e
      contrastText: brandColors.text.inverse,
    },
    secondary: {
      main: brandColors.secondary, // #1a365d
      light: brandColors.secondaryLight, // #2d4a6b
      dark: brandColors.secondaryDark, // #0d2340
      contrastText: brandColors.text.inverse,
    },
    success: {
      main: brandColors.accent.success, // #19401a
      light: brandColors.accent.successLight, // #2d5a2d
      dark: brandColors.accent.successDark, // #0f2a0f
      contrastText: brandColors.text.inverse,
    },
    warning: {
      main: brandColors.accent.warning, // #995c03
      light: brandColors.accent.warningLight, // #b8730a
      dark: brandColors.accent.warningDark, // #7a4a02
      contrastText: brandColors.text.inverse,
    },
    error: {
      main: brandColors.accent.error, // #570701
      light: brandColors.accent.errorLight, // #7a0a02
      dark: brandColors.accent.errorDark, // #3d0501
      contrastText: brandColors.text.inverse,
    },
    info: {
      main: brandColors.accent.info, // #113c5e
      light: brandColors.accent.infoLight, // #1a5a8a
      dark: brandColors.accent.infoDark, // #0d2a42
      contrastText: brandColors.text.inverse,
    },
    text: {
      primary: brandColors.text.primary,    // #212121 - High contrast primary text
      secondary: brandColors.text.secondary, // #424242 - Improved secondary text
      disabled: brandColors.text.disabled,   // #9e9e9e - Disabled text
    },
    background: {
      default: brandColors.backgrounds.primary,
      paper: brandColors.surfaces.elevated,
    },
    divider: brandColors.borders.secondary,
    action: {
      active: brandColors.primary, // Override default blue #1976d2
      hover: brandColors.interactive.hover,
      selected: brandColors.backgrounds.selected,
      disabled: brandColors.text.disabled,
      disabledBackground: brandColors.backgrounds.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      color: brandColors.text.primary,    // #212121 - High contrast headings
      fontWeight: 700,
    },
    h2: {
      color: brandColors.text.primary,    // #212121 - High contrast headings
      fontWeight: 600,
    },
    h3: {
      color: brandColors.text.primary,    // #212121 - High contrast headings
      fontWeight: 600,
    },
    h4: {
      color: brandColors.text.primary,    // #212121 - High contrast headings
      fontWeight: 500,
    },
    h5: {
      color: brandColors.text.primary,    // #212121 - High contrast headings
      fontWeight: 500,
    },
    h6: {
      color: brandColors.text.primary,    // #212121 - High contrast headings
      fontWeight: 500,
    },
    body1: {
      color: brandColors.text.primary,    // #212121 - High contrast body text
    },
    body2: {
      color: brandColors.text.secondary,  // #424242 - Improved secondary text
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px brandColors.interactive.focus',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: brandColors.actions.primaryHover,
          },
        },
        outlined: {
          borderColor: brandColors.primary,
          color: brandColors.primary,
          '&:hover': {
            backgroundColor: brandColors.interactive.hover,
            borderColor: brandColors.primaryDark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: colorUtils.shadow('0, 0, 0', 0.1, 8, 2),
          '&:hover': {
            boxShadow: colorUtils.shadowColored(0.15, 16, 4),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.borders.focus,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.borders.focus,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: brandColors.primary,
          color: brandColors.backgrounds.primary,
        },
        colorSuccess: {
          backgroundColor: brandColors.accent.success,
          color: brandColors.backgrounds.primary,
        },
        colorWarning: {
          backgroundColor: brandColors.accent.warning,
          color: brandColors.backgrounds.primary,
        },
        colorInfo: {
          backgroundColor: brandColors.accent.info,
          color: brandColors.backgrounds.primary,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: brandColors.primary,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    '0 25px 50px rgba(0,0,0,0.25), 0 20px 20px rgba(0,0,0,0.22)',
    '0 30px 60px rgba(0,0,0,0.25), 0 25px 25px rgba(0,0,0,0.22)',
    '0 35px 70px rgba(0,0,0,0.25), 0 30px 30px rgba(0,0,0,0.22)',
    '0 40px 80px rgba(0,0,0,0.25), 0 35px 35px rgba(0,0,0,0.22)',
    '0 45px 90px rgba(0,0,0,0.25), 0 40px 40px rgba(0,0,0,0.22)',
    '0 50px 100px rgba(0,0,0,0.25), 0 45px 45px rgba(0,0,0,0.22)',
    '0 55px 110px rgba(0,0,0,0.25), 0 50px 50px rgba(0,0,0,0.22)',
    '0 60px 120px rgba(0,0,0,0.25), 0 55px 55px rgba(0,0,0,0.22)',
    '0 65px 130px rgba(0,0,0,0.25), 0 60px 60px rgba(0,0,0,0.22)',
    '0 70px 140px rgba(0,0,0,0.25), 0 65px 65px rgba(0,0,0,0.22)',
    '0 75px 150px rgba(0,0,0,0.25), 0 70px 70px rgba(0,0,0,0.22)',
    '0 80px 160px rgba(0,0,0,0.25), 0 75px 75px rgba(0,0,0,0.22)',
    '0 85px 170px rgba(0,0,0,0.25), 0 80px 80px rgba(0,0,0,0.22)',
    '0 90px 180px rgba(0,0,0,0.25), 0 85px 85px rgba(0,0,0,0.22)',
    '0 95px 190px rgba(0,0,0,0.25), 0 90px 90px rgba(0,0,0,0.22)',
    '0 100px 200px rgba(0,0,0,0.25), 0 95px 95px rgba(0,0,0,0.22)',
    '0 105px 210px rgba(0,0,0,0.25), 0 100px 100px rgba(0,0,0,0.22)',
    '0 110px 220px rgba(0,0,0,0.25), 0 105px 105px rgba(0,0,0,0.22)',
    '0 115px 230px rgba(0,0,0,0.25), 0 110px 110px rgba(0,0,0,0.22)',

  ],
});

export default theme;
