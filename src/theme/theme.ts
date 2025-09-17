import { createTheme } from '@mui/material/styles';

// Enhanced Brand Color Palette with Full Complementary Colors
export const brandColors = {
  // Primary Brand Colors - Based on #1a365d
  primary: '#1a365d',        // Dark blue - Primary brand color
  primaryLight: '#2d5a8a',   // Lighter variant
  primaryDark: '#0d2340',    // Darker variant for gradients
  primary50: '#f0f4f8',      // Very light tint
  primary100: '#d9e6f2',     // Light tint
  primary200: '#b3cce5',     // Medium-light tint
  primary300: '#8db3d8',     // Medium tint
  primary400: '#6699cb',     // Medium-dark tint
  primary500: '#1a365d',     // Base color
  primary600: '#0d2340',     // Dark variant
  primary700: '#061018',     // Darker variant
  primary800: '#040c12',     // Very dark variant
  primary900: '#02080a',     // Darkest variant
  
  // Secondary Colors - Complementary palette
  secondary: '#0d2340',      // Darker blue for gradients
  secondaryLight: '#2d4a6b', // Lighter variant
  secondaryDark: '#061018',  // Darker variant
  
  // Accent Colors - Semantic and complementary
  accent: {
    success: '#4caf50',      // Green for success
    successLight: '#66bb6a', // Light green
    successDark: '#388e3c',  // Dark green
    warning: '#ff9800',      // Orange for pending states
    warningLight: '#ffb74d', // Light orange
    warningDark: '#f57c00',  // Dark orange
    info: '#2196f3',         // Blue for completed states
    infoLight: '#64b5f6',    // Light blue
    infoDark: '#1976d2',     // Dark blue
    error: '#f44336',        // Red for errors
    errorLight: '#ef5350',   // Light red
    errorDark: '#d32f2f',    // Dark red
  },
  
  // Neutral Colors - Extended grayscale
  neutral: {
    0: '#ffffff',            // Pure white
    50: '#fafafa',           // Very light gray
    100: '#f5f5f5',          // Light background
    200: '#eeeeee',          // Light borders
    300: '#e0e0e0',          // Medium borders
    400: '#bdbdbd',          // Medium-light
    500: '#9e9e9e',          // Medium gray
    600: '#757575',          // Medium-dark
    700: '#616161',          // Dark gray
    800: '#424242',          // Very dark gray
    900: '#212121',          // Almost black
    950: '#0a0a0a',          // Pure black
  },
  
  // Action Colors - Enhanced semantic actions
  actions: {
    primary: '#1a365d',      // Primary brand color for actions
    primaryHover: '#0d2340', // Primary hover state
    secondary: '#1976d2',    // Blue for secondary actions
    secondaryHover: '#1565c0', // Secondary hover state
    success: '#4caf50',      // Green for success indicators
    successHover: '#388e3c', // Success hover state
    warning: '#ff9800',      // Orange for warnings
    warningHover: '#f57c00', // Warning hover state
    error: '#f44336',        // Red for errors
    errorHover: '#d32f2f',   // Error hover state
    info: '#2196f3',         // Blue for info actions
    infoHover: '#1976d2',    // Info hover state
    disabled: '#9e9e9e',     // Disabled state
  },
  
  // Status Colors - Comprehensive status system
  status: {
    active: '#1a365d',       // Primary brand for active states
    completed: '#4caf50',    // Green for completed
    pending: '#ff9800',      // Orange for pending
    inactive: '#9e9e9e',     // Gray for inactive
    draft: '#757575',        // Medium gray for draft states
    archived: '#616161',     // Dark gray for archived
    cancelled: '#f44336',    // Red for cancelled
    scheduled: '#2196f3',    // Blue for scheduled
    inProgress: '#ff9800',   // Orange for in progress
  },
  
  // Surface Colors - Material design surfaces
  surfaces: {
    primary: '#ffffff',       // White primary surface
    secondary: '#f8f9fa',    // Light gray secondary surface
    tertiary: '#f5f5f5',     // Very light gray tertiary surface
    elevated: '#ffffff',     // Elevated surfaces (cards, modals)
    overlay: 'rgba(0, 0, 0, 0.5)', // Backdrop overlay
    glass: 'rgba(255, 255, 255, 0.25)', // Glass morphism
    glassHover: 'rgba(255, 255, 255, 0.35)', // Glass hover
    glassDark: 'rgba(26, 54, 93, 0.25)', // Dark glass
    glassDarkHover: 'rgba(26, 54, 93, 0.35)', // Dark glass hover
  },
  
  // Background Colors - Contextual backgrounds
  backgrounds: {
    primary: '#ffffff',       // White primary background
    secondary: '#f8f9fa',    // Light gray secondary
    tertiary: '#f5f5f5',     // Very light gray
    selected: '#e3f2fd',     // Light blue for selected states
    hover: '#f0f8ff',        // Very light blue for hover
    focus: '#e1f5fe',        // Light blue for focus states
    success: '#e8f5e8',      // Light green for success states
    warning: '#fff3cd',      // Light yellow for warning states
    error: '#fff5f5',        // Light red for error states
    info: '#e3f2fd',         // Light blue for info states
    gradient: 'linear-gradient(135deg, #1a365d 0%, #0d2340 100%)',
    gradientLight: 'linear-gradient(135deg, #2d5a8a 0%, #1a365d 100%)',
    gradientSubtle: 'linear-gradient(180deg, rgba(26, 54, 93, 0.1) 0%, transparent 100%)',
  },
  
  // Border Colors - Comprehensive border system
  borders: {
    primary: '#1a365d',      // Primary brand color for borders
    secondary: '#e0e0e0',    // Light gray for secondary borders
    tertiary: '#f5f5f5',     // Very light gray for subtle borders
    focus: '#1976d2',        // Blue for focus states
    success: '#4caf50',      // Green for success borders
    warning: '#ff9800',      // Orange for warning borders
    error: '#f44336',        // Red for error borders
    info: '#2196f3',         // Blue for info borders
    disabled: '#e0e0e0',     // Light gray for disabled borders
    hover: '#bdbdbd',        // Medium gray for hover borders
  },
  
  // Text Colors - Comprehensive text system
  text: {
    primary: '#333333',      // Dark gray for main text
    secondary: '#666666',    // Medium gray for secondary text
    tertiary: '#9e9e9e',     // Light gray for tertiary text
    disabled: '#bdbdbd',     // Light gray for disabled text
    inverse: '#ffffff',      // White text for dark backgrounds
    accent: '#1a365d',       // Primary brand for accent text
    success: '#4caf50',      // Green for success text
    warning: '#ff9800',      // Orange for warning text
    error: '#f44336',        // Red for error text
    info: '#2196f3',         // Blue for info text
    link: '#1976d2',         // Blue for links
    linkHover: '#1565c0',    // Darker blue for link hover
  },
  
  // Interactive States - Comprehensive interaction system
  interactive: {
    hover: 'rgba(26, 54, 93, 0.08)', // Light blue hover
    hoverDark: 'rgba(26, 54, 93, 0.12)', // Darker blue hover
    pressed: 'rgba(26, 54, 93, 0.12)', // Pressed state
    focus: '#1976d2', // Focus ring
    focusVisible: 'rgba(25, 118, 210, 0.3)', // Visible focus ring
    disabled: 'rgba(0, 0, 0, 0.26)', // Disabled state
  },
  
  // Data Visualization Colors
  data: {
    primary: '#1a365d',      // Primary data color
    secondary: '#4caf50',    // Secondary data color
    tertiary: '#ff9800',     // Tertiary data color
    quaternary: '#2196f3',   // Quaternary data color
    quinary: '#9c27b0',      // Quinary data color
    senary: '#00bcd4',       // Senary data color
    neutral: '#9e9e9e',      // Neutral data color
  },
  
  // Accessibility Colors
  accessibility: {
    focus: '#1976d2',        // High contrast focus
    focusRing: 'rgba(25, 118, 210, 0.5)', // Focus ring
    highContrast: '#0a0a0a', // High contrast text
    lowContrast: '#666666',  // Low contrast text
    required: '#f44336',     // Required field indicator
  },
  
  // Shadow Colors
  shadows: {
    light: 'rgba(0, 0, 0, 0.1)', // Light shadow
    medium: 'rgba(0, 0, 0, 0.15)', // Medium shadow
    dark: 'rgba(0, 0, 0, 0.25)', // Dark shadow
    colored: 'rgba(26, 54, 93, 0.15)', // Brand colored shadow
    coloredHover: '#1976d2', // Brand colored hover shadow
  }
};

// Color utility functions for common patterns
export const colorUtils = {
  // Glass morphism backgrounds
  glass: (opacity = 0.25) => `rgba(255, 255, 255, ${opacity})`,
  glassHover: (opacity = 0.35) => `rgba(255, 255, 255, ${opacity})`,
  glassDark: (opacity = 0.25) => `rgba(26, 54, 93, ${opacity})`,
  glassDarkHover: (opacity = 0.35) => `rgba(26, 54, 93, ${opacity})`,
  
  // Brand color with opacity
  primaryWithOpacity: (opacity = 1) => `rgba(26, 54, 93, ${opacity})`,
  secondaryWithOpacity: (opacity = 1) => `rgba(13, 35, 64, ${opacity})`,
  
  // Common gradients
  primaryGradient: 'linear-gradient(135deg, #1a365d 0%, #0d2340 100%)',
  primaryGradientLight: 'linear-gradient(135deg, #2d5a8a 0%, #1a365d 100%)',
  subtleGradient: 'linear-gradient(180deg, rgba(26, 54, 93, 0.1) 0%, transparent 100%)',
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
    `rgba(26, 54, 93, ${opacity}) ${spread}px ${spread}px ${blur}px`,
};

// Create Material-UI theme with brand colors
export const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.primary,
      light: brandColors.primaryLight,
      dark: brandColors.primaryDark,
      contrastText: brandColors.text.inverse,
    },
    secondary: {
      main: brandColors.secondary,
      light: brandColors.secondaryLight,
      dark: brandColors.secondaryDark,
      contrastText: brandColors.text.inverse,
    },
    success: {
      main: brandColors.accent.success,
      light: brandColors.accent.successLight,
      dark: brandColors.accent.successDark,
      contrastText: brandColors.text.inverse,
    },
    warning: {
      main: brandColors.accent.warning,
      light: brandColors.accent.warningLight,
      dark: brandColors.accent.warningDark,
      contrastText: brandColors.text.inverse,
    },
    error: {
      main: brandColors.accent.error,
      light: brandColors.accent.errorLight,
      dark: brandColors.accent.errorDark,
      contrastText: brandColors.text.inverse,
    },
    info: {
      main: brandColors.accent.info,
      light: brandColors.accent.infoLight,
      dark: brandColors.accent.infoDark,
      contrastText: brandColors.text.inverse,
    },
    text: {
      primary: brandColors.text.primary,
      secondary: brandColors.text.secondary,
      disabled: brandColors.text.disabled,
    },
    background: {
      default: brandColors.backgrounds.primary,
      paper: brandColors.surfaces.elevated,
    },
    divider: brandColors.borders.secondary,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      color: brandColors.primary,
      fontWeight: 700,
    },
    h2: {
      color: brandColors.primary,
      fontWeight: 600,
    },
    h3: {
      color: brandColors.primary,
      fontWeight: 600,
    },
    h4: {
      color: brandColors.primary,
      fontWeight: 500,
    },
    h5: {
      color: brandColors.primary,
      fontWeight: 500,
    },
    h6: {
      color: brandColors.primary,
      fontWeight: 500,
    },
    body1: {
      color: brandColors.text.primary,
    },
    body2: {
      color: brandColors.text.secondary,
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
