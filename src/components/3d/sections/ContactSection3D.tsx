/**
 * Contact Section 3D Component
 */

import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';

export const ContactSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  return (
    <group visible={visible} position={[0, 0, -440]}>
      <mesh position={[0, 1, -2]}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color={brandColors.primary} metalness={0.7} roughness={0.3} transparent opacity={0.5} />
      </mesh>

      {visible && (
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Get In Touch
        </Typography>
      </Html>
      )}

      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} component="div">
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Send Us A Message</Typography>
                  <TextField fullWidth label="Name" variant="outlined" sx={{ mb: 2 }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  <TextField fullWidth label="Message" variant="outlined" multiline rows={4} sx={{ mb: 2 }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  <Button variant="contained" fullWidth sx={{ py: 1.5, backgroundColor: brandColors.primary, '&:hover': { backgroundColor: brandColors.actions.primary } }}>
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} component="div">
              <Grid container spacing={2}>
                {[
                  { icon: <EmailIcon sx={{ fontSize: 40, color: brandColors.primary }} />, title: 'Email', value: 'advertise@dreamery.com' },
                  { icon: <PhoneIcon sx={{ fontSize: 40, color: brandColors.primary }} />, title: 'Phone', value: '1-800-DREAMERY' },
                  { icon: <ChatIcon sx={{ fontSize: 40, color: brandColors.primary }} />, title: 'Live Chat', value: 'Available 24/7' },
                ].map((item, index) => (
                  <Grid item xs={12} key={index} component="div">
                    <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                        <Box sx={{ mr: 2 }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                          <Typography variant="body1" color="textSecondary">{item.value}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Html>
      )}
    </group>
  );
};

