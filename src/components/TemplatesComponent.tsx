import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { brandColors } from '../theme';

const TemplatesComponent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3 }}>
        Templates Management
      </Typography>
      
      {/* Simple Overview Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
            24
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Templates
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: brandColors.actions.warning, fontWeight: 'bold' }}>
            8
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Starter Templates
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
            12
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Custom Templates
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
            4
          </Typography>
          <Typography variant="body2" color="text.secondary">
            State-Specific
          </Typography>
        </Paper>
      </Box>

      {/* Template Categories */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Template Categories
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        <Chip label="All Templates" color="primary" />
        <Chip label="Starter Agent" variant="outlined" />
        <Chip label="State-specific" variant="outlined" />
        <Chip label="Custom" variant="outlined" />
        <Chip label="Legal Forms" variant="outlined" />
        <Chip label="Marketing" variant="outlined" />
      </Box>

      {/* Create Template Button */}
      <Button 
        variant="contained" 
        startIcon={<Add />}
        sx={{ mb: 4 }}
      >
        Create New Template
      </Button>

      {/* Template Grid */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Templates
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {[
          {
            title: "Real Estate Purchase Agreement",
            description: "Standard purchase agreement template for real estate transactions"
          },
          {
            title: "Lease Agreement",
            description: "Comprehensive lease agreement template for rental properties"
          },
          {
            title: "Property Management Contract",
            description: "Template for property management service agreements"
          },
          {
            title: "Offer to Purchase Real Estate",
            description: "Template for making offers on real estate properties"
          },
          {
            title: "Rental Application Form",
            description: "Standard rental application template for prospective tenants"
          },
          {
            title: "Inspection Checklist",
            description: "Comprehensive property inspection checklist template"
          }
        ].map((template, index) => (
          <Card key={index} sx={{ width: 280, height: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {template.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {template.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label="Active" color="success" size="small" />
                <Typography variant="caption" color="text.secondary">
                  5 forms
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TemplatesComponent;
