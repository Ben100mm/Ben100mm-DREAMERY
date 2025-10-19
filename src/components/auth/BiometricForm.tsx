import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import styled from 'styled-components';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FaceIcon from '@mui/icons-material/Face';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { brandColors } from "../../theme";


const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BiometricCard = styled(Card)`
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

const BiometricIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  font-size: 2rem;
  color: white;
  transition: all 0.2s ease;
`;

interface BiometricFormProps {
  onSuccess?: () => void;
}

type BiometricMethod = 'fingerprint' | 'face' | 'none';

interface BiometricCapability {
  fingerprint: boolean;
  face: boolean;
}

const BiometricForm: React.FC<BiometricFormProps> = ({ onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<BiometricMethod>('none');
  const [capabilities, setCapabilities] = useState<BiometricCapability>({
    fingerprint: false,
    face: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Simulate device capability detection
    const detectCapabilities = async () => {
      try {
        // In a real app, you would use Web Authentication API or similar
        // For demo purposes, we'll simulate detection
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate different device capabilities
        const hasFingerprint = Math.random() > 0.3; // 70% chance
        const hasFace = Math.random() > 0.5; // 50% chance
        
        setCapabilities({
          fingerprint: hasFingerprint,
          face: hasFace
        });
      } catch (error) {
        console.error('Error detecting biometric capabilities:', error);
      }
    };

    detectCapabilities();
  }, []);

  const handleBiometricAuth = async () => {
    if (selectedMethod === 'none') {
      setError('Please select a biometric authentication method');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        setSuccess(`Successfully authenticated using ${selectedMethod === 'fingerprint' ? 'fingerprint' : 'face recognition'}`);
        onSuccess?.();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      setError('Biometric authentication is not available on this device.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getMethodIcon = (method: BiometricMethod) => {
    switch (method) {
      case 'fingerprint':
        return <FingerprintIcon />;
      case 'face':
        return <FaceIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const getMethodLabel = (method: BiometricMethod) => {
    switch (method) {
      case 'fingerprint':
        return 'Fingerprint (Touch ID)';
      case 'face':
        return 'Face Recognition (Face ID)';
      default:
        return 'Biometric Authentication';
    }
  };

  const getMethodColor = (method: BiometricMethod) => {
    switch (method) {
      case 'fingerprint':
        return brandColors.accent.success;
      case 'face':
        return brandColors.accent.info;
      default:
        return brandColors.neutral[600];
    }
  };

  const availableMethods = [
    ...(capabilities.fingerprint ? [{ method: 'fingerprint' as BiometricMethod }] : []),
    ...(capabilities.face ? [{ method: 'face' as BiometricMethod }] : [])
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (availableMethods.length === 0) {
    return (
      <FormContainer>
        <Typography variant="h6" gutterBottom>
          Biometric Authentication
        </Typography>
        
        <Alert severity="warning">
          Biometric authentication is not available on this device. 
          Please use an alternative authentication method.
        </Alert>
        
        <Typography variant="body2" color="text.secondary">
          This device does not support fingerprint or face recognition.
        </Typography>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Typography variant="h6" gutterBottom>
        Biometric Authentication
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Choose your preferred biometric authentication method
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {availableMethods.map(({ method }) => (
          <BiometricCard
            key={method}
            className={selectedMethod === method ? 'selected' : ''}
            onClick={() => setSelectedMethod(method)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BiometricIcon
                  sx={{
                    backgroundColor: getMethodColor(method),
                    width: 50,
                    height: 50,
                    fontSize: '1.5rem'
                  }}
                >
                  {getMethodIcon(method)}
                </BiometricIcon>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    {getMethodLabel(method)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method === 'fingerprint' 
                      ? 'Use your fingerprint to authenticate'
                      : 'Use face recognition to authenticate'
                    }
                  </Typography>
                </Box>
                
                {selectedMethod === method && (
                  <CheckCircleIcon color="primary" />
                )}
              </Box>
            </CardContent>
          </BiometricCard>
        ))}
      </Box>

      {selectedMethod !== 'none' && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleBiometricAuth}
          disabled={isAuthenticating}
          sx={{ mt: 2 }}
        >
          {isAuthenticating ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Authenticating...
            </Box>
          ) : (
            `Authenticate with ${selectedMethod === 'fingerprint' ? 'Fingerprint' : 'Face Recognition'}`
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
        <Chip label="Device Capabilities" size="small" />
      </Divider>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          icon={capabilities.fingerprint ? <CheckCircleIcon /> : <ErrorIcon />}
          label="Fingerprint"
          color={capabilities.fingerprint ? 'success' : 'default'}
          variant="outlined"
          size="small"
        />
        <Chip
          icon={capabilities.face ? <CheckCircleIcon /> : <ErrorIcon />}
          label="Face Recognition"
          color={capabilities.face ? 'success' : 'default'}
          variant="outlined"
          size="small"
        />
      </Box>
    </FormContainer>
  );
};

export default BiometricForm; 