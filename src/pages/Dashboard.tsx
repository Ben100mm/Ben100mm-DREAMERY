import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardContainer = styled(Container)`
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
`;

const DashboardCard = styled(Paper)`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HeaderSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const StatusCard = styled(Card)`
  margin-bottom: 1rem;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmailVerified, logout, sendVerificationEmail } = useAuth();
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSecuritySettings = () => {
    navigate('/security');
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingEmail(true);
    try {
      await sendVerificationEmail();
      // Show success message
    } catch (error) {
      console.error('Failed to send verification email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!user) {
    return (
      <DashboardContainer>
        <DashboardCard>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </DashboardCard>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardCard>
        <HeaderSection>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="#1a365d">
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account and security settings
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ color: '#666' }}
          >
            Logout
          </Button>
        </HeaderSection>

        <Grid container spacing={3}>
          {/* User Info Card */}
          <Grid item xs={12} md={6}>
            <StatusCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 40, color: '#1a365d' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      Account Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your profile details
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body2" fontWeight="600">{user.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography variant="body2" fontWeight="600">{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Member since:</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StatusCard>
          </Grid>

          {/* Email Verification Card */}
          <Grid item xs={12} md={6}>
            <StatusCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EmailIcon sx={{ fontSize: 40, color: isEmailVerified ? '#4caf50' : '#ff9800' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      Email Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verify your email address
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    icon={isEmailVerified ? <CheckCircleIcon /> : <WarningIcon />}
                    label={isEmailVerified ? 'Verified' : 'Not Verified'}
                    color={isEmailVerified ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Box>

                {!isEmailVerified && (
                  <Button
                    variant="contained"
                    onClick={handleSendVerificationEmail}
                    disabled={isSendingEmail}
                    sx={{ mt: 1 }}
                  >
                    {isSendingEmail ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Send Verification Email'
                    )}
                  </Button>
                )}
              </CardContent>
            </StatusCard>
          </Grid>

          {/* Security Settings Card */}
          <Grid item xs={12}>
            <StatusCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: '#1a365d' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      Security Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your authentication methods
                    </Typography>
                  </Box>
                </Box>

                {!isEmailVerified ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Please verify your email address before accessing security settings.
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Your email is verified. You can now access security settings.
                  </Alert>
                )}

                <Button
                  variant="contained"
                  onClick={handleSecuritySettings}
                  disabled={!isEmailVerified}
                  sx={{ mt: 1 }}
                >
                  Access Security Settings
                </Button>
              </CardContent>
            </StatusCard>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Quick Actions */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            {isEmailVerified && (
              <Button
                variant="contained"
                onClick={handleSecuritySettings}
              >
                Security Settings
              </Button>
            )}
          </Box>
        </Box>
      </DashboardCard>
    </DashboardContainer>
  );
};

export default Dashboard; 