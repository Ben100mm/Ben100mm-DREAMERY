import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import { RoleContext } from '../context/RoleContext';

const supportedRoles = [
  'Title Agent', 'Escrow Officer', 'Notary Public', 'Appraiser', 'Insurance Agent', 'Mortgage Broker',
  'General Contractor', 'Property Manager', 'Real Estate Attorney', 'Photographer'
];

const OtherProfessionalPage: React.FC = () => {
  const { userRole } = (React.useContext(RoleContext) as any) || {};

  if (!supportedRoles.includes(userRole)) return <Navigate to="/" />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {userRole} Portal
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Document Management</Typography>
          <Button variant="contained" sx={{ mt: 2 }}>Upload Document</Button>
        </Paper>

        {['Title Agent', 'Escrow Officer', 'Notary Public', 'Appraiser'].includes(userRole) && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Compliance</Typography>
            <Typography variant="body2" color="text.secondary">Manage compliance documents.</Typography>
          </Paper>
        )}

        {['Insurance Agent'].includes(userRole) && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Insurance</Typography>
            <Button variant="contained" color="success" sx={{ mt: 2 }}>Add Quote</Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default OtherProfessionalPage;


