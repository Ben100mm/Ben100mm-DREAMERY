/**
 * Onboarding & Support Section 3D Component
 */

import React from 'react';
import { Html, Line } from '@react-three/drei';
import { Box, Typography, Stepper, Step, StepLabel, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const steps = [
  { label: 'Sign Up', description: 'Create your account' },
  { label: 'Setup Campaign', description: 'Configure your ads' },
  { label: 'Review & Approve', description: 'Review before launch' },
  { label: 'Go Live', description: 'Launch your campaign' },
];

export const OnboardingSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, 0]}>
      {steps.map((_, index) => (
        <mesh key={index} position={[-4 + index * 2.5, 1, -2]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={brandColors.primary} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      <Line
        points={[[-4, 1, -2], [-1.5, 1, -2], [1, 1, -2], [3.5, 1, -2]]}
        color={brandColors.primary}
        lineWidth={2}
      />

      <Html position={[0, 3, 0]} center distanceFactor={10}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Getting Started
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8}>
        <Box sx={{ width: '800px' }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', p: 4 }}>
            <CardContent>
              <Stepper activeStep={-1} alternativeLabel>
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{step.label}</Typography>
                      <Typography variant="body2" color="textSecondary">{step.description}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
                Our dedicated team will guide you through every step. 24/7 support available.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Html>
    </group>
  );
};

