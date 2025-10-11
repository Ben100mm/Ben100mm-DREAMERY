/**
 * Integration Capabilities Section 3D Component
 */

import React from 'react';
import { Html, Line } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';

const integrations = [
  { name: 'Salesforce', category: 'CRM' },
  { name: 'HubSpot', category: 'Marketing' },
  { name: 'Google Analytics', category: 'Analytics' },
  { name: 'Zapier', category: 'Automation' },
  { name: 'Slack', category: 'Communication' },
  { name: 'Mailchimp', category: 'Email' },
];

export const IntegrationSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <group visible={visible} position={[0, 0, 0]}>
      <mesh position={[0, 1, -2]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={brandColors.primary} metalness={0.9} roughness={0.1} />
      </mesh>

      {integrations.map((_, index) => {
        const angle = (index / integrations.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 2.5 - 2;
        return (
          <React.Fragment key={index}>
            <mesh position={[x, 1, z]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#64b5f6" metalness={0.7} roughness={0.3} />
            </mesh>
            <Line points={[[0, 1, -2], [x, 1, z]]} color={brandColors.primary} lineWidth={1} />
          </React.Fragment>
        );
      })}

      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Seamless Integrations
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            {integrations.map((integration, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{integration.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{integration.category}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Html>
    </group>
  );
};

