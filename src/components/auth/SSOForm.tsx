import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import styled from 'styled-components';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Provider icons (you would import actual logos in production)
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WorkIcon from '@mui/icons-material/Work';

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProviderCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    border-color: #1a365d;
    background-color: rgba(26, 54, 93, 0.05);
  }
`;

const ProviderIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
  transition: all 0.2s ease;
`;

interface SSOFormProps {
  onSuccess?: () => void;
}

type SSOProvider = 'google' | 'microsoft' | 'github' | 'linkedin' | 'okta' | 'auth0' | 'azure' | 'saml';

interface ProviderInfo {
  id: SSOProvider;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  type: 'oauth' | 'enterprise';
}

const SSOForm: React.FC<SSOFormProps> = ({ onSuccess }) => {
  const [selectedProvider, setSelectedProvider] = useState<SSOProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const providers: ProviderInfo[] = [
    {
      id: 'google',
      name: 'Google',
      description: 'Sign in with your Google account',
      color: '#4285f4',
      icon: <GoogleIcon />,
      type: 'oauth'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      description: 'Sign in with your Microsoft account',
      color: '#00a1f1',
      icon: <MicrosoftIcon />,
      type: 'oauth'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sign in with your GitHub account',
      color: '#333',
      icon: <GitHubIcon />,
      type: 'oauth'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Sign in with your LinkedIn account',
      color: '#0077b5',
      icon: <LinkedInIcon />,
      type: 'oauth'
    },
    {
      id: 'okta',
      name: 'Okta',
      description: 'Enterprise SSO with Okta',
      color: '#007dc1',
      icon: <BusinessIcon />,
      type: 'enterprise'
    },
    {
      id: 'auth0',
      name: 'Auth0',
      description: 'Enterprise SSO with Auth0',
      color: '#eb5424',
      icon: <SecurityIcon />,
      type: 'enterprise'
    },
    {
      id: 'azure',
      name: 'Azure AD',
      description: 'Enterprise SSO with Azure Active Directory',
      color: '#0078d4',
      icon: <MicrosoftIcon />,
      type: 'enterprise'
    },
    {
      id: 'saml',
      name: 'SAML',
      description: 'Generic SAML-based SSO',
      color: '#666',
      icon: <WorkIcon />,
      type: 'enterprise'
    }
  ];

  const handleProviderSelect = (provider: SSOProvider) => {
    setSelectedProvider(provider);
    setError(null);
    setSuccess(null);
  };

  const handleSSOAuth = async () => {
    if (!selectedProvider) {
      setError('Please select an SSO provider');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        const provider = providers.find(p => p.id === selectedProvider);
        setSuccess(`Successfully authenticated with ${provider?.name}`);
        onSuccess?.();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      setError('SSO authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const oauthProviders = providers.filter(p => p.type === 'oauth');
  const enterpriseProviders = providers.filter(p => p.type === 'enterprise');

  return (
    <FormContainer>
      <Typography variant="h6" gutterBottom>
        Single Sign-On (SSO)
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Sign in with your existing account from trusted providers
      </Typography>

      {/* OAuth Providers */}
      <Box>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Social & Personal Accounts
        </Typography>
        <Grid container spacing={1}>
          {oauthProviders.map((provider) => (
            <Grid item xs={6} sm={4} key={provider.id}>
              <ProviderCard
                className={selectedProvider === provider.id ? 'selected' : ''}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                  <ProviderIcon
                    sx={{
                      backgroundColor: provider.color,
                      width: 40,
                      height: 40,
                      fontSize: '1.25rem',
                      mb: 1
                    }}
                  >
                    {provider.icon}
                  </ProviderIcon>
                  
                  <Typography variant="body2" fontWeight="600">
                    {provider.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {provider.description}
                  </Typography>
                </CardContent>
              </ProviderCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }}>
        <Chip label="Enterprise SSO" size="small" />
      </Divider>

      {/* Enterprise Providers */}
      <Box>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Enterprise & Business Accounts
        </Typography>
        <Grid container spacing={1}>
          {enterpriseProviders.map((provider) => (
            <Grid item xs={6} sm={4} key={provider.id}>
              <ProviderCard
                className={selectedProvider === provider.id ? 'selected' : ''}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                  <ProviderIcon
                    sx={{
                      backgroundColor: provider.color,
                      width: 40,
                      height: 40,
                      fontSize: '1.25rem',
                      mb: 1
                    }}
                  >
                    {provider.icon}
                  </ProviderIcon>
                  
                  <Typography variant="body2" fontWeight="600">
                    {provider.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {provider.description}
                  </Typography>
                </CardContent>
              </ProviderCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedProvider && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleSSOAuth}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Authenticating...
            </Box>
          ) : (
            `Sign in with ${providers.find(p => p.id === selectedProvider)?.name}`
          )}
        </Button>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Divider sx={{ my: 2 }}>
        <Chip label="Security & Benefits" size="small" />
      </Divider>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          icon={<SecurityIcon />}
          label="Secure OAuth2"
          color="primary"
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<CheckCircleIcon />}
          label="No Password"
          color="success"
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<BusinessIcon />}
          label="Enterprise Ready"
          color="secondary"
          variant="outlined"
          size="small"
        />
      </Box>

      <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
        SSO provides secure, passwordless authentication using industry-standard protocols like OAuth2, OpenID Connect, and SAML.
      </Alert>
    </FormContainer>
  );
};

export default SSOForm; 