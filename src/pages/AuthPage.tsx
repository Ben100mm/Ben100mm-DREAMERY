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
  Google,
  Apple,
  Microsoft,
  Facebook,
  Twitter,
  ArrowBack,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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
                Or Continue With
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
                  color: '#4285f4',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <Google />
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
                  color: '#00a4ef',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <Microsoft />
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
                onClick={() => handleSocialLogin('Twitter')}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  color: '#1da1f2',
                  '&:hover': {
                    background: '#f8f9fa',
                    borderColor: '#c0c0c0',
                  },
                }}
              >
                <Twitter />
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
                Back to Home
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
};

export default AuthPage; 