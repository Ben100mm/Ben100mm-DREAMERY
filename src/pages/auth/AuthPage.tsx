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
  max-width: 1200px;
  min-height: 500px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 1rem;
  
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
    height: 100%;
  }

  .MuiTabs-root {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .MuiBox-root {
    height: 100%;
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
              height: 35,
              width: 'auto',
              marginBottom: '-2px',
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
              fontSize: '1.25rem',
              textTransform: 'uppercase',
            }}
          >
            DREAMERY
          </Typography>
        </LogoContainer>
        <Box sx={{ width: '100%', typography: 'body1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TabContext value={tab}>
            <Box sx={{ width: '100%', mb: 4 }}>
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
            <Box sx={{ display: 'flex', gap: 4, width: '100%', justifyContent: 'center' }}>
              <Box sx={{ flex: 1, maxWidth: 360 }}>
                <TabPanel value="signin">
                  <SignInForm />
                </TabPanel>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 360 }}>
                <TabPanel value="signup">
                  <SignUpForm />
                </TabPanel>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 360 }}>
                <TabPanel value="magic">
                  <MagicLinkForm />
                </TabPanel>
              </Box>
            </Box>
          </TabContext>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;