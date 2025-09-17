import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import styled from 'styled-components';
import SecurityIcon from '@mui/icons-material/Security';
import QrCodeIcon from '@mui/icons-material/QrCode';
import KeyIcon from '@mui/icons-material/Key';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import UsbIcon from '@mui/icons-material/Usb';
import { brandColors } from "../../theme";


const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MethodCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px brandColors.shadows.medium;
  }
  
  &.selected {
    border-color: brandColors.primary;
    background-color: rgba(26, 54, 93, 0.05);
  }
`;

const QRCodeContainer = styled(Box)`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: brandColors.neutral[100];
  border-radius: 8px;
  margin: 1rem 0;
`;

interface TwoFactorFormProps {
  onSuccess?: () => void;
}

type TwoFactorMethod = 'authenticator' | 'hardware' | 'none';

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>('none');
  const [activeStep, setActiveStep] = useState(0);
  const [setupKey, setSetupKey] = useState('JBSWY3DPEHPK3PXP');
  const [qrCode, setQrCode] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSetup, setIsSetup] = useState(false);

  const steps = [
    'Choose 2FA Method',
    'Setup Authentication',
    'Verify Setup'
  ];

  const handleMethodSelect = (method: TwoFactorMethod) => {
    setSelectedMethod(method);
    setActiveStep(1);
  };

  const handleSetup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate setup process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSetup(true);
      setActiveStep(2);
    } catch (error) {
      setError('Failed to setup 2FA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim() || verificationCode.length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/failure
      const isSuccess = Math.random() > 0.3; // 70% success rate
      
      if (isSuccess) {
        setSuccess('Two-factor authentication setup successful!');
        onSuccess?.();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (method: TwoFactorMethod) => {
    switch (method) {
      case 'authenticator':
        return <SmartphoneIcon />;
      case 'hardware':
        return <UsbIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const getMethodLabel = (method: TwoFactorMethod) => {
    switch (method) {
      case 'authenticator':
        return 'Authenticator App';
      case 'hardware':
        return 'Hardware Token';
      default:
        return 'Two-Factor Authentication';
    }
  };

  const getMethodDescription = (method: TwoFactorMethod) => {
    switch (method) {
      case 'authenticator':
        return 'Use apps like Google Authenticator, Authy, or Microsoft Authenticator';
      case 'hardware':
        return 'Use hardware tokens like YubiKey or similar security keys';
      default:
        return 'Choose your preferred 2FA method';
    }
  };

  const getMethodColor = (method: TwoFactorMethod) => {
    switch (method) {
      case 'authenticator':
        return brandColors.accent.success;
      case 'hardware':
        return brandColors.accent.warning;
      default:
        return brandColors.neutral[600];
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(['authenticator', 'hardware'] as TwoFactorMethod[]).map((method) => (
              <MethodCard
                key={method}
                className={selectedMethod === method ? 'selected' : ''}
                onClick={() => handleMethodSelect(method)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: getMethodColor(method),
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: brandColors.text.inverse,
                        fontSize: '1.5rem'
                      }}
                    >
                      {getMethodIcon(method)}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {getMethodLabel(method)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getMethodDescription(method)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MethodCard>
            ))}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedMethod === 'authenticator' 
                ? 'Scan the QR code with your authenticator app or enter the setup key manually.'
                : 'Insert your hardware token and follow the setup instructions.'
              }
            </Typography>

            {selectedMethod === 'authenticator' && (
              <>
                <QRCodeContainer>
                  <Box sx={{ textAlign: 'center' }}>
                    <QrCodeIcon sx={{ fontSize: 120, color: '#666' }} />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      QR Code (Demo)
                    </Typography>
                  </Box>
                </QRCodeContainer>

                <Typography variant="subtitle2" gutterBottom>
                  Setup Key (Manual Entry):
                </Typography>
                <TextField
                  fullWidth
                  value={setupKey}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={() => navigator.clipboard.writeText(setupKey)}
                      >
                        Copy
                      </Button>
                    )
                  }}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {selectedMethod === 'hardware' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Insert your hardware token (YubiKey, etc.) and follow the device-specific setup instructions.
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSetup}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Setup 2FA'
              )}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter the verification code from your {selectedMethod === 'authenticator' ? 'authenticator app' : 'hardware token'} to complete setup.
            </Typography>

            <TextField
              fullWidth
              label="Verification Code"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              variant="outlined"
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*'
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setActiveStep(0);
                  setSelectedMethod('none');
                  setVerificationCode('');
                  setError(null);
                  setSuccess(null);
                }}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length < 6}
                sx={{ flex: 1 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Verify & Complete'
                )}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <Typography variant="h6" gutterBottom>
        Two-Factor Authentication Setup
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enhance your account security with 2FA
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {renderStepContent(index)}
            </StepContent>
          </Step>
        ))}
      </Stepper>

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
        <Chip label="Security Features" size="small" />
      </Divider>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          icon={<SecurityIcon />}
          label="Enhanced Security"
          color="primary"
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<CheckCircleIcon />}
          label="Industry Standard"
          color="success"
          variant="outlined"
          size="small"
        />
      </Box>
    </FormContainer>
  );
};

export default TwoFactorForm; 