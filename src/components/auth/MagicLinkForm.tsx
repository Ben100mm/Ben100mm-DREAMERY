import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import styled from 'styled-components';
import EmailIcon from '@mui/icons-material/Email';

const InfoBox = styled(Box)`
  background-color: rgba(26, 54, 93, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

interface FormState {
  email: string;
  isLoading: boolean;
  error: string | null;
  validationError: string | null;
}

const MagicLinkForm: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    isLoading: false,
    error: null,
    validationError: null,
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setFormState(prev => ({
      ...prev,
      email,
      validationError: email && !validateEmail(email) ? 'Please enter a valid email address' : null,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formState.email) {
      setFormState(prev => ({ ...prev, validationError: 'Email is required' }));
      return;
    }

    if (!validateEmail(formState.email)) {
      setFormState(prev => ({ ...prev, validationError: 'Please enter a valid email address' }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: 'Failed to send magic link. Please try again.',
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (emailSent) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <EmailIcon sx={{ fontSize: 40, color: '#1a365d', mb: 1.5 }} />
        <Typography variant="h6" gutterBottom>
          Check your email
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We've sent you a magic link to sign in to your account.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setEmailSent(false)}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          Back to Magic Link Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <InfoBox>
        <EmailIcon sx={{ color: '#1a365d' }} />
        <Typography variant="body2" color="text.secondary">
          We'll email you a magic link for password-free sign in. This link will expire in 24 hours.
        </Typography>
      </InfoBox>

      <Box component="form" onSubmit={handleSubmit}>
        {formState.error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: '8px' }}
            onClose={() => setFormState(prev => ({ ...prev, error: null }))}
          >
            {formState.error}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={formState.email}
          onChange={handleEmailChange}
          autoComplete="email"
          autoFocus
          error={!!formState.validationError}
          helperText={formState.validationError}
          disabled={formState.isLoading}
          sx={{ mb: formState.validationError ? 1 : 3 }}
        />

        {formState.validationError && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2, borderRadius: '8px' }}
            onClose={() => setFormState(prev => ({ ...prev, validationError: null }))}
          >
            {formState.validationError}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={formState.isLoading || !!formState.validationError}
          sx={{
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
          {formState.isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Sending...</span>
            </Box>
          ) : (
            'Send Magic Link'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default MagicLinkForm;