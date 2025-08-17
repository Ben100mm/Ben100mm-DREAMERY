import { createTheme } from '@mui/material/styles';

// Brand Color Palette
export const brandColors = {
  // Primary Brand Colors
  primary: '#1a365d',        // Dark blue - Primary brand color
  secondary: '#0d2340',      // Darker blue for gradients
  
  // Accent Colors
  accent: {
    success: '#4caf50',      // Green for success
    warning: '#ff9800',      // Orange for pending states
    info: '#2196f3',         // Blue for completed states
  },
  
  // Neutral Colors
  neutral: {
    light: '#f5f5f5',        // Light background
    medium: '#e0e0e0',       // Medium borders
    dark: '#666666',         // Dark text
  },
  
  // Action Colors
  actions: {
    primary: '#1976d2',      // Blue for primary actions
    success: '#4caf50',      // Green for success indicators
    warning: '#ff9800',      // Orange for warnings
    error: '#f44336',        // Red for errors
  },
  
  // Status Colors
  status: {
    active: '#1976d2',       // Blue for active states
    completed: '#4caf50',    // Green for completed
    pending: '#ff9800',      // Orange for pending
    inactive: '#9e9e9e',     // Gray for inactive
  },
  
  // Background Colors
  backgrounds: {
    primary: '#ffffff',       // White primary background
    secondary: '#f8f9fa',    // Light gray secondary
    selected: '#e3f2fd',     // Light blue for selected states
    hover: '#f0f8ff',        // Very light blue for hover
    success: '#e8f5e8',      // Light green for success states
    warning: '#fff3cd',      // Light yellow for warning states
    error: '#fff5f5',        // Light red for error states
    gradient: 'linear-gradient(135deg, #1a365d 0%, #0d2340 100%)',
  },
  
  // Border Colors
  borders: {
    primary: '#1a365d',      // Primary brand color for borders
    secondary: '#e0e0e0',    // Light gray for secondary borders
    focus: '#1976d2',        // Blue for focus states
    success: '#4caf50',      // Green for success borders
    warning: '#ff9800',      // Orange for warning borders
    error: '#f44336',        // Red for error borders
  },
  
  // Text Colors
  text: {
    primary: '#333333',      // Dark gray for main text
    secondary: '#666666',    // Medium gray for secondary text
    disabled: '#9e9e9e',     // Light gray for disabled text
  }
};

// Create Material-UI theme with brand colors
export const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.primary,
      light: '#2d5a8a',
      dark: brandColors.secondary,
      contrastText: brandColors.backgrounds.primary,
    },
    secondary: {
      main: brandColors.secondary,
      light: brandColors.primary,
      dark: '#061018',
      contrastText: brandColors.backgrounds.primary,
    },
    success: {
      main: brandColors.accent.success,
      light: '#66bb6a',
      dark: brandColors.accent.success,
      contrastText: brandColors.backgrounds.primary,
    },
    warning: {
      main: brandColors.accent.warning,
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: brandColors.backgrounds.primary,
    },
    error: {
      main: brandColors.actions.error,
      light: '#ef5350',
      dark: '#c62828',
      contrastText: brandColors.backgrounds.primary,
    },
    info: {
      main: brandColors.accent.info,
      light: '#64b5f6',
      dark: brandColors.actions.primary,
      contrastText: brandColors.backgrounds.primary,
    },
    text: {
      primary: brandColors.text.primary,
      secondary: brandColors.neutral.dark,
      disabled: brandColors.text.disabled,
    },
    background: {
      default: brandColors.backgrounds.primary,
      paper: brandColors.backgrounds.primary,
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
            boxShadow: '0 4px 8px rgba(26, 54, 93, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: brandColors.secondary,
          },
        },
        outlined: {
          borderColor: brandColors.primary,
          color: brandColors.primary,
          '&:hover': {
            backgroundColor: brandColors.backgrounds.hover,
            borderColor: brandColors.secondary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(26, 54, 93, 0.15)',
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
          '&.Mui-selected': {
            color: brandColors.primary,
          },
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
