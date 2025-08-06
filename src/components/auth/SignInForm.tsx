import React from 'react';
import {
  Box,
  Button,
  TextField,
  Divider,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';
import styled from 'styled-components';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';

const SocialButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  padding: 0.75rem 1.5rem;
  margin-bottom: 1rem;
  text-transform: none;
  font-weight: 500;
  border-radius: 8px;
  
  .MuiButton-startIcon {
    margin-right: 2rem;
  }
`;

const OrDivider = styled(Box)`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  
  .MuiDivider-root {
    flex-grow: 1;
  }
  
  .MuiTypography-root {
    margin: 0 1rem;
    color: #666;
  }
`;

const SignInForm: React.FC = () => {
  return (
    <Box>
      <SocialButton
        variant="outlined"
        startIcon={<GoogleIcon />}
        fullWidth
      >
        Continue with Google
      </SocialButton>
      <SocialButton
        variant="outlined"
        startIcon={<AppleIcon />}
        fullWidth
      >
        Continue with Apple
      </SocialButton>
      <SocialButton
        variant="outlined"
        startIcon={<FacebookIcon />}
        fullWidth
      >
        Continue with Facebook
      </SocialButton>

      <OrDivider>
        <Divider />
        <Typography variant="body2">or</Typography>
        <Divider />
      </OrDivider>

      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '8px',
            backgroundColor: '#1a365d',
            '&:hover': {
              backgroundColor: '#0d2340',
            },
          }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default SignInForm;