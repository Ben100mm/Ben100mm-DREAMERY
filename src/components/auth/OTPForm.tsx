import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider
} from '@mui/material';
import styled from 'styled-components';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import SecurityIcon from '@mui/icons-material/Security';

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OTPInput = styled(TextField)`
  .MuiInputBase-root {
    font-size: 1.5rem;
    text-align: center;
    letter-spacing: 0.5rem;
    font-weight: 600;
  }
`;

const MethodSelector = styled(Box)`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MethodChip = styled(Chip)`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

interface OTPFormProps {
  onSuccess?: () => void;
}

type OTPMethod = 'sms' | 'email' | 'authenticator';

const OTPForm: React.FC<OTPFormProps> = ({ onSuccess }) => {
  const [method, setMethod] = useState<OTPMethod>('sms');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'verify'>('input');

  const handleSendOTP = async () => {
    if (!identifier.trim()) {
      setError('Please enter your phone number or email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`OTP sent to your ${method === 'sms' ? 'phone' : method === 'email' ? 'email' : 'authenticator app'}`);
      setStep('verify');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Authentication successful!');
      onSuccess?.();
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (methodType: OTPMethod) => {
    switch (methodType) {
      case 'sms':
        return <SmsIcon />;
      case 'email':
        return <EmailIcon />;
      case 'authenticator':
        return <SecurityIcon />;
      default:
        return <SmsIcon />;
    }
  };

  const getMethodLabel = (methodType: OTPMethod) => {
    switch (methodType) {
      case 'sms':
        return 'SMS';
      case 'email':
        return 'Email';
      case 'authenticator':
        return 'Authenticator App';
      default:
        return 'SMS';
    }
  };

  const getPlaceholder = () => {
    switch (method) {
      case 'sms':
        return 'Enter your phone number';
      case 'email':
        return 'Enter your email address';
      case 'authenticator':
        return 'Enter your username or email';
      default:
        return 'Enter your phone number';
    }
  };

  return (
    <FormContainer>
      <Typography variant="h6" gutterBottom>
        One-Time Password Authentication
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Choose your preferred authentication method
      </Typography>

      <MethodSelector>
        {(['sms', 'email', 'authenticator'] as OTPMethod[]).map((methodType) => (
          <MethodChip
            key={methodType}
            icon={getMethodIcon(methodType)}
            label={getMethodLabel(methodType)}
            variant={method === methodType ? 'filled' : 'outlined'}
            color={method === methodType ? 'primary' : 'default'}
            onClick={() => setMethod(methodType)}
          />
        ))}
      </MethodSelector>

      {step === 'input' ? (
        <>
          <TextField
            fullWidth
            label={getMethodLabel(method)}
            placeholder={getPlaceholder()}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            variant="outlined"
            size="small"
          />

          {method === 'authenticator' && (
            <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
              Use your authenticator app (Google Authenticator, Authy, etc.) to scan the QR code or enter the setup key.
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOTP}
            disabled={isLoading || !identifier.trim()}
            sx={{ mt: 1 }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              `Send OTP via ${getMethodLabel(method)}`
            )}
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter the 6-digit code sent to your {method === 'sms' ? 'phone' : method === 'email' ? 'email' : 'authenticator app'}
          </Typography>

          <OTPInput
            fullWidth
            label="OTP Code"
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
            }}
            variant="outlined"
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]*'
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setStep('input');
                setOtp('');
                setError(null);
                setSuccess(null);
              }}
              sx={{ flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length < 6}
              sx={{ flex: 1 }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Verify OTP'
              )}
            </Button>
          </Box>
        </>
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
    </FormContainer>
  );
};

export default OTPForm; 