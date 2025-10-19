import React, { useState } from 'react';
import { Container, Paper, Box, Tab, Tabs, Typography } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SignInForm from '../../components/auth/SignInForm';
import SignUpForm from '../../components/auth/SignUpForm';
import MagicLinkForm from '../../components/auth/MagicLinkForm';
import { brandColors } from "../../theme";
import {
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  Email as MagicLinkIcon
} from '@mui/icons-material';



const AuthContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, brandColors.neutral[50] 0%, brandColors.neutral[100] 100%);
`;

const LogoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const AuthCard = styled(Paper)`
  width: 100%;
  max-width: 380px;
  min-height: auto;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px brandColors.shadows.light;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  max-height: none;
  overflow: visible;
  
  .MuiTabs-root {
    margin-bottom: 1rem;
  }

  .MuiTab-root {
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    min-height: 40px;
    padding: 8px 12px;
    color: #666;
    
    &.Mui-selected {
      color: brandColors.primary;
    }
  }

  .MuiTabPanel-root {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: auto;
    overflow: visible;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: brandColors.shadows.medium;
      border-radius: 3px;
      
      &:hover {
        background: brandColors.shadows.dark;
      }
    }
  }
`;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'magic'>('signin');

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: 'signin' | 'signup' | 'magic'
  ) => {
    setTab(newValue);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAuthSuccess = () => {
    // Handle successful authentication
    console.log('Authentication successful');
    navigate('/dashboard');
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthCard elevation={0}>
        <LogoContainer onClick={handleLogoClick}>
          <Box
            component="img"
            src="/logo.png"
            alt="Dreamery Logo"
            sx={{ 
              height: 45,
              width: 'auto',
              marginBottom: '-3px',
              filter: 'brightness(0) saturate(100%) invert(13%) sepia(30%) saturate(2910%) hue-rotate(195deg) brightness(93%) contrast(96%)'
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: brandColors.primary,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              fontSize: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            DREAMERY
          </Typography>
        </LogoContainer>
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <Box>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  style: {
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab 
                  label="Sign In" 
                  value="signin" 
                  icon={<LoginIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label="Sign Up" 
                  value="signup" 
                  icon={<SignUpIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label="Magic Link" 
                  value="magic" 
                  icon={<MagicLinkIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
            {tab === 'signin' && (
              <Box sx={{ pt: 2 }}>
                <SignInForm onSuccess={handleAuthSuccess} />
              </Box>
            )}
            {tab === 'signup' && (
              <Box sx={{ pt: 2 }}>
                <SignUpForm onSuccess={handleAuthSuccess} />
              </Box>
            )}
            {tab === 'magic' && (
              <Box sx={{ pt: 2 }}>
                <MagicLinkForm onSuccess={handleAuthSuccess} />
              </Box>
            )}
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;