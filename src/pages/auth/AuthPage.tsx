import React, { useState } from 'react';
import { Container, Paper, Box, Tab, Tabs, Typography } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SignInForm from '../../components/auth/SignInForm';
import SignUpForm from '../../components/auth/SignUpForm';
import MagicLinkForm from '../../components/auth/MagicLinkForm';

const AuthContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
      color: #1a365d;
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
      background: rgba(0, 0, 0, 0.15);
      border-radius: 3px;
      
      &:hover {
        background: rgba(0, 0, 0, 0.25);
      }
    }
  }
`;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleLogoClick = () => {
    navigate('/');
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
              color: '#1a365d',
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
          <TabContext value={tab}>
            <Box>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                TabIndicatorProps={{
                  style: {
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab label="Sign In" value="signin" />
                <Tab label="Sign Up" value="signup" />
                <Tab label="Magic Link" value="magic" />
              </Tabs>
            </Box>
            <TabPanel value="signin">
              <SignInForm />
            </TabPanel>
            <TabPanel value="signup">
              <SignUpForm />
            </TabPanel>
            <TabPanel value="magic">
              <MagicLinkForm />
            </TabPanel>
          </TabContext>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;