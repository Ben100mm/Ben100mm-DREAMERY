import React from 'react';
import {
  Box,
  Button,
  TextField,
  Divider,
  Typography,
  FormControlLabel,
  Checkbox,
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

const SignUpForm: React.FC = () => {
  return (
    <Box>
      <SocialButton
        variant="outlined"
        startIcon={<GoogleIcon />}
        fullWidth
      >
        Sign up with Google
      </SocialButton>
      <SocialButton
        variant="outlined"
        startIcon={<AppleIcon />}
        fullWidth
      >
        Sign up with Apple
      </SocialButton>
      <SocialButton
        variant="outlined"
        startIcon={<FacebookIcon />}
        fullWidth
      >
        Sign up with Facebook
      </SocialButton>

      <OrDivider>
        <Divider />
        <Typography variant="body2">or</Typography>
        <Divider />
      </OrDivider>

      <Box component="form" sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
          />
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
          />
        </Box>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Checkbox value="terms" color="primary" />}
          label={
            <Typography variant="body2">
              I agree to the Terms of Service and Privacy Policy
            </Typography>
          }
          sx={{ mb: 2 }}
        />
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
          Create Account
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpForm;