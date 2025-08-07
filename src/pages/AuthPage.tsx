import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Apple,
  Facebook,
  ArrowBack,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom X (Twitter) Icon Component
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Google Logo Component
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Custom Microsoft Logo Component
const MicrosoftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '400px',
  width: '100%',
  margin: '0 auto',
}));

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Simulate authentication
    setSuccess(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
  };

  const handleSocialLogin = (provider: string) => {
    setError('');
    setSuccess('');
    setSuccess(`Signing in with ${provider}...`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <StyledCard>
          <CardContent sx={{ padding: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ 
                color: '#1e3a8a', 
                fontWeight: 700, 
                mb: 1,
                fontSize: '2rem',
              }}>
                Dreamery
              </Typography>
              <Typography variant="h5" component="h2" sx={{ 
                color: '#333333', 
                fontWeight: 600,
                fontSize: '1.5rem',
              }}>
                {isSignUp ? 'Create account' : 'Sign in'}
              </Typography>
            </Box>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Email/Password Form */}
            <Box component="form" onSubmit={handleEmailPasswordSubmit}>
              <TextField
                fullWidth
                label="Email Address*"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#333333',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#c0c0c0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3a8a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1e3a8a',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password*"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#333333',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#c0c0c0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3a8a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1e3a8a',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#666666' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  height: '48px',
                  borderRadius: '8px',
                  background: '#1e3a8a',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  mb: 3,
                  '&:hover': {
                    background: '#1d4ed8',
                  },
                }}
              >
                {isSignUp ? 'Create account' : 'Continue'}
              </Button>
            </Box>

            {/* Toggle Sign In/Sign Up */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography sx={{ color: '#666666', fontSize: '14px' }}>
                {isSignUp ? 'Have a Dreamery account?' : "New to Dreamery?"}
                {' '}
                <Link
                  component="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  sx={{
                    color: '#1e3a8a',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {isSignUp ? 'Sign in' : 'Create account'}
                </Link>
              </Typography>
              {isSignUp && (
                <Typography sx={{ color: '#666666', fontSize: '14px', mt: 1 }}>
                  I am a{' '}
                  <Link
                    component="button"
                    onClick={() => window.location.href = '/professional-signup'}
                    sx={{
                      color: '#1e3a8a',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Professional
                  </Link>
                  {' '}or{' '}
                  <Link
                    component="button"
                    onClick={() => window.location.href = '/business-signup'}
                    sx={{
                      color: '#1e3a8a',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Business
                  </Link>
                </Typography>
              )}
            </Box>

            {/* Divider */}
            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
              <Divider sx={{ flex: 1, borderColor: '#e0e0e0' }} />
              <Typography sx={{ px: 2, color: '#666666', fontSize: '14px' }}>
                Or Continue with
              </Typography>
              <Divider sx={{ flex: 1, borderColor: '#e0e0e0' }} />
            </Box>

            {/* Social Login Buttons */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton
                onClick={() => handleSocialLogin('Google')}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <GoogleIcon />
              </IconButton>
              
              <IconButton
                onClick={() => handleSocialLogin('Apple')}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <Apple />
              </IconButton>
              
              <IconButton
                onClick={() => handleSocialLogin('Microsoft')}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <MicrosoftIcon />
              </IconButton>
              
              <IconButton
                onClick={() => handleSocialLogin('Facebook')}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  color: '#1877f2',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <Facebook />
              </IconButton>
              
              <IconButton
                onClick={() => handleSocialLogin('X')}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <XIcon />
              </IconButton>
            </Box>

            {/* Terms of Use */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{ color: '#666666', fontSize: '12px' }}>
                By submitting, I accept Dreamery's{' '}
                <Link
                  sx={{
                    color: '#1e3a8a',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  terms of use
                </Link>
              </Typography>
            </Box>

            {/* Back to Home */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
                sx={{
                  color: '#666666',
                  textTransform: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#333333',
                  },
                }}
              >
                Go Back
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
};

export default AuthPage;