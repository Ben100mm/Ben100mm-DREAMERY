import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import EmailIcon from '@mui/icons-material/Email';

const InfoBox = styled(Box)`
  background-color: rgba(26, 54, 93, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const MagicLinkForm: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <EmailIcon sx={{ fontSize: 48, color: '#1a365d', mb: 2 }} />
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
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
          Send Magic Link
        </Button>
      </Box>
    </Box>
  );
};

export default MagicLinkForm;