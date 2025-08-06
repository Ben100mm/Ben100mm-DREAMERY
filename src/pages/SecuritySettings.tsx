import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
  Button
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import OTPForm from '../components/auth/OTPForm';
import BiometricForm from '../components/auth/BiometricForm';
import TwoFactorForm from '../components/auth/TwoFactorForm';
import SSOForm from '../components/auth/SSOForm';

const SettingsContainer = styled(Container)`
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
`;

const SettingsCard = styled(Paper)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HeaderSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const SecurityMethodCard = styled(Card)`
  margin-bottom: 1rem;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #1a365d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SecuritySettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [securityStatus, setSecurityStatus] = useState({
    password: true,
    twoFactor: false,
    biometric: false,
    otp: false,
    sso: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleSecurityUpdate = (method: string, enabled: boolean) => {
    setSecurityStatus(prev => ({
      ...prev,
      [method]: enabled
    }));
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getSecurityScore = () => {
    const enabledMethods = Object.values(securityStatus).filter(Boolean).length;
    return Math.min(enabledMethods * 20, 100);
  };

  return (
    <SettingsContainer>
      <SettingsCard>
        <HeaderSection>
          <SecurityIcon sx={{ fontSize: 40, color: '#1a365d' }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="#1a365d">
              Security Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account security and authentication methods
            </Typography>
          </Box>
        </HeaderSection>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            icon={<ShieldIcon />}
            label={`Security Score: ${getSecurityScore()}%`}
            color={getSecurityScore() >= 80 ? 'success' : getSecurityScore() >= 60 ? 'warning' : 'error'}
            variant="outlined"
          />
          <Chip
            icon={<LockIcon />}
            label={`${Object.values(securityStatus).filter(Boolean).length} methods enabled`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Two-Factor Auth" value="2fa" />
              <Tab label="Biometric" value="biometric" />
              <Tab label="OTP Methods" value="otp" />
              <Tab label="Single Sign-On" value="sso" />
            </Tabs>
          </Box>

          <TabPanel value="overview">
            <Typography variant="h6" gutterBottom>
              Security Overview
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Enable multiple authentication methods to enhance your account security.
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(securityStatus).map(([method, enabled]) => (
                <SecurityMethodCard key={method}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {method.charAt(0).toUpperCase() + method.slice(1)} Authentication
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {enabled ? 'Enabled and active' : 'Not configured'}
                        </Typography>
                      </Box>
                      <Chip
                        label={enabled ? 'Enabled' : 'Disabled'}
                        color={enabled ? 'success' : 'default'}
                        variant={enabled ? 'filled' : 'outlined'}
                      />
                    </Box>
                  </CardContent>
                </SecurityMethodCard>
              ))}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveTab('2fa')}
              >
                Configure Security
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value="2fa">
            <Typography variant="h6" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add an extra layer of security to your account
            </Typography>
            <TwoFactorForm onSuccess={() => handleSecurityUpdate('twoFactor', true)} />
          </TabPanel>

          <TabPanel value="biometric">
            <Typography variant="h6" gutterBottom>
              Biometric Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Use fingerprint or face recognition for quick access
            </Typography>
            <BiometricForm onSuccess={() => handleSecurityUpdate('biometric', true)} />
          </TabPanel>

          <TabPanel value="otp">
            <Typography variant="h6" gutterBottom>
              One-Time Password Methods
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Set up SMS, email, or authenticator app verification
            </Typography>
            <OTPForm onSuccess={() => handleSecurityUpdate('otp', true)} />
          </TabPanel>

          <TabPanel value="sso">
            <Typography variant="h6" gutterBottom>
              Single Sign-On Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Connect your account with external identity providers
            </Typography>
            <SSOForm onSuccess={() => handleSecurityUpdate('sso', true)} />
          </TabPanel>
        </TabContext>
      </SettingsCard>
    </SettingsContainer>
  );
};

export default SecuritySettings; 