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
import SocialLoginButtons from './SocialLoginButtons';



const OrDivider = styled(Box)`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  .MuiDivider-root {
    flex-grow: 1;
  }
  
  .MuiTypography-root {
    margin: 0 1rem;
    color: #666;
  }
`;

interface SignUpFormProps {
  onSuccess?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  return (
    <Box sx={{ 
        maxHeight: '60vh',
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.25)',
          },
        },
      }}>
      <SocialLoginButtons mode="signup" />

      <OrDivider>
        <Divider />
        <Typography variant="body2">or</Typography>
        <Divider />
      </OrDivider>

      <Box component="form" sx={{ mt: 0.5 }}>
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
          sx={{ mb: 1.5 }}
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
          sx={{ mb: 1.5 }}
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
          sx={{ mb: 1.5 }}
        />
        <FormControlLabel
          control={<Checkbox value="terms" color="primary" />}
          label={
            <Typography variant="body2">
              I agree to the Terms of Service and Privacy Policy
            </Typography>
          }
          sx={{ mb: 1.5 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 1,
            mb: 1,
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