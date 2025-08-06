import React, { useState } from 'react';
import { Container, Paper, Box, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import styled from 'styled-components';
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

const AuthCard = styled(Paper)`
  width: 100%;
  max-width: 480px;
  min-height: 600px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
  .MuiTabs-root {
    margin-bottom: 2rem;
  }

  .MuiTab-root {
    font-weight: 600;
    font-size: 1.125rem;
    text-transform: none;
    min-height: 48px;
    padding: 12px 16px;
    color: #666;
    
    &.Mui-selected {
      color: #1a365d;
    }
  }

  .MuiTabPanel-root {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState('signin');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthCard elevation={0}>
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