/**
 * Integration Capabilities Section 3D Component
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

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
    <group visible={visible} position={[0, 0, -320]}>

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Seamless Integrations
        </Typography>
      </Html>
      )}

      {visible && (
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
      )}
    </group>
  );
};

