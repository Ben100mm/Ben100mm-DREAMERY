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
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Apple,
  Microsoft,
  Twitter,
  Phone,
  ArrowBack,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  maxWidth: '500px',
  width: '100%',
  margin: '0 auto',
}));

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '50px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '12px',
  border: '1px solid rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    background: 'rgba(255,255,255,0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.3s ease',
}));

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic-link'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
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
    setSuccess(authMode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setSuccess('Magic link sent to your email!');
  };

  const handleSocialLogin = (provider: string) => {
    setError('');
    setSuccess('');
    setSuccess(`Signing in with ${provider}...`);
  };

  const handleForgotPassword = () => {
    setError('');
    setSuccess('');
    setSuccess('Password reset link sent to your email!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" sx={{ 
                color: '#333333', 
                fontWeight: 700, 
                mb: 1,
              }}>
                {authMode === 'signin' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Magic Link'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666666' }}>
                {authMode === 'signin' ? 'Sign in to your account' : authMode === 'signup' ? 'Join Dreamery today' : 'Get a magic link sent to your email'}
              </Typography>
            </Box>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)' }}>
                {success}
              </Alert>
            )}

            {/* Auth Mode Toggle */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant={authMode === 'signin' ? 'contained' : 'outlined'}
                    onClick={() => setAuthMode('signin')}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      background: authMode === 'signin' ? 'rgba(0,0,0,0.1)' : 'transparent',
                      border: '1px solid rgba(0,0,0,0.2)',
                      color: '#333333',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant={authMode === 'signup' ? 'contained' : 'outlined'}
                    onClick={() => setAuthMode('signup')}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      background: authMode === 'signup' ? 'rgba(0,0,0,0.1)' : 'transparent',
                      border: '1px solid rgba(0,0,0,0.2)',
                      color: '#333333',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant={authMode === 'magic-link' ? 'contained' : 'outlined'}
                    onClick={() => setAuthMode('magic-link')}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      background: authMode === 'magic-link' ? 'rgba(0,0,0,0.1)' : 'transparent',
                      border: '1px solid rgba(0,0,0,0.2)',
                      color: '#333333',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    Magic Link
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Email/Password Form */}
            {(authMode === 'signin' || authMode === 'signup') && (
              <Box component="form" onSubmit={handleEmailPasswordSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#333333',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0,0,0,0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0,0,0,0.6)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0,0,0,0.6)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0,0,0,0.8)',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(0,0,0,0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#333333',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0,0,0,0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0,0,0,0.6)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0,0,0,0.6)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0,0,0,0.8)',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(0,0,0,0.6)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(0,0,0,0.6)' }}
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
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    mb: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </Button>
                {authMode === 'signin' && (
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleForgotPassword}
                      sx={{
                        color: '#666666',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#333333',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                )}
              </Box>
            )}

            {/* Magic Link Form */}
            {authMode === 'magic-link' && (
              <Box component="form" onSubmit={handleMagicLinkSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#333333',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0,0,0,0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0,0,0,0.6)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0,0,0,0.6)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0,0,0,0.8)',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(0,0,0,0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Send Magic Link
                </Button>
              </Box>
            )}

            {/* Divider */}
            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
              <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.2)' }} />
              <Typography sx={{ px: 2, color: '#666666' }}>
                or continue with
              </Typography>
              <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.2)' }} />
            </Box>

            {/* Social Login Buttons */}
            <Box sx={{ mb: 3 }}>
              <SocialButton
                onClick={() => handleSocialLogin('Google')}
                startIcon={<Google />}
                sx={{
                  color: '#fff',
                  background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3367d6 0%, #2d8f47 100%)',
                  },
                }}
              >
                Continue with Google
              </SocialButton>
              
              <SocialButton
                onClick={() => handleSocialLogin('Apple')}
                startIcon={<Apple />}
                sx={{
                  color: '#fff',
                  background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)',
                  },
                }}
              >
                Continue with Apple
              </SocialButton>
              
              <SocialButton
                onClick={() => handleSocialLogin('Microsoft')}
                startIcon={<Microsoft />}
                sx={{
                  color: '#fff',
                  background: 'linear-gradient(135deg, #00a4ef 0%, #0078d4 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0093d6 0%, #006cbd 100%)',
                  },
                }}
              >
                Continue with Microsoft
              </SocialButton>
              
              <SocialButton
                onClick={() => handleSocialLogin('X (Twitter)')}
                startIcon={<Twitter />}
                sx={{
                  color: '#fff',
                  background: 'linear-gradient(135deg, #1da1f2 0%, #14171a 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a8cd8 0%, #0f1215 100%)',
                  },
                }}
              >
                Continue with X (Twitter)
              </SocialButton>
            </Box>

            {/* Toggle Sign In/Sign Up */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#666666', mb: 1 }}>
                {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              </Typography>
              <Button
                onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                sx={{
                  color: '#667eea',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#5a6fd8',
                  },
                }}
              >
                {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
              </Button>
            </Box>

            {/* Back to Home */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
                sx={{
                  color: '#666666',
                  textTransform: 'none',
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