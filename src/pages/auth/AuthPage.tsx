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
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                  },
                }}
              >
                <Tab label="Sign In" value="signin" />
                <Tab label="Sign Up" value="signup" />
                <Tab label="Magic Link" value="magic" />
              </Tabs>
            </Box>
            <TabPanel value="signin" sx={{ p: 0, minHeight: '500px' }}>
              <SignInForm />
            </TabPanel>
            <TabPanel value="signup" sx={{ p: 0, minHeight: '500px' }}>
              <SignUpForm />
            </TabPanel>
            <TabPanel value="magic" sx={{ p: 0, minHeight: '500px' }}>
              <MagicLinkForm />
            </TabPanel>
          </TabContext>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;