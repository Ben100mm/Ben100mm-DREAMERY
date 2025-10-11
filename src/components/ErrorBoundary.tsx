/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { brandColors } from '../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // If custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: brandColors.backgrounds.primary,
              borderLeft: `4px solid ${brandColors.accent.error}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: brandColors.accent.error,
                }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: brandColors.text.primary, fontWeight: 600 }}
            >
              Oops! Something went wrong
            </Typography>

            <Typography
              variant="body1"
              sx={{ mb: 3, color: brandColors.text.secondary }}
            >
              We're sorry for the inconvenience. An unexpected error occurred while
              loading this page.
            </Typography>

            {process.env.NODE_ENV === 'development' && error && (
              <Box
                sx={{
                  mt: 3,
                  mb: 3,
                  p: 2,
                  backgroundColor: brandColors.backgrounds.secondary,
                  borderRadius: 1,
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 300,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: brandColors.accent.error, fontWeight: 600, mb: 1 }}
                >
                  Error Details (Development Only):
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: brandColors.text.primary,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.toString()}
                </Typography>
                {errorInfo && (
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: brandColors.text.secondary,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      mt: 1,
                    }}
                  >
                    {errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{
                  backgroundColor: brandColors.primary,
                  '&:hover': {
                    backgroundColor: brandColors.primaryDark,
                  },
                }}
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                onClick={() => window.location.href = '/'}
                sx={{
                  borderColor: brandColors.primary,
                  color: brandColors.primary,
                  '&:hover': {
                    borderColor: brandColors.primaryDark,
                    backgroundColor: 'rgba(108, 99, 255, 0.04)',
                  },
                }}
              >
                Go to Home
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 4, color: brandColors.text.secondary }}
            >
              If the problem persists, please contact support.
            </Typography>
          </Paper>
        </Container>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

