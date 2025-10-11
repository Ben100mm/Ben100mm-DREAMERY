/**
 * Advertising Opportunities Section 3D Component
 */

import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Grid, List, ListItem, ListItemText, Chip } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import { InteractiveMesh } from '../shared/InteractiveMesh';
import PropertyIcon from '@mui/icons-material/Home';
import ServiceIcon from '@mui/icons-material/Build';
import InvestorIcon from '@mui/icons-material/TrendingUp';
import LenderIcon from '@mui/icons-material/AccountBalance';
import TechIcon from '@mui/icons-material/Psychology';
import BusinessIcon from '@mui/icons-material/Business';

interface Opportunity {
  id: string;
  title: string;
  geometry: 'box' | 'sphere' | 'torus' | 'cone' | 'cylinder';
  position: [number, number, number];
  color: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  roi: string;
  targetAudience: string;
  pricing: string;
}

const opportunities: Opportunity[] = [
  {
    id: 'property',
    title: 'Property Listings',
    geometry: 'box',
    position: [-4, 2, -2],
    color: '#1976d2',
    icon: <PropertyIcon />,
    description: 'Showcase your properties to qualified buyers and investors',
    features: ['Professional Photography', 'Virtual Tours', 'Market Analysis', 'Lead Generation'],
    roi: '250% average ROI',
    targetAudience: 'Home buyers, Investors',
    pricing: 'Starting at $299/month',
  },
  {
    id: 'services',
    title: 'Professional Services',
    geometry: 'sphere',
    position: [-2, 1, -2],
    color: '#64b5f6',
    icon: <ServiceIcon />,
    description: 'Promote your real estate services to the right audience',
    features: ['Agent Profiles', 'Service Listings', 'Client Testimonials', 'Local SEO'],
    roi: '180% average ROI',
    targetAudience: 'Real estate professionals',
    pricing: 'Starting at $199/month',
  },
  {
    id: 'investment',
    title: 'Investment Opportunities',
    geometry: 'torus',
    position: [0, 0, -2],
    color: '#90caf9',
    icon: <InvestorIcon />,
    description: 'Connect with investors for your real estate deals',
    features: ['Deal Presentations', 'Investor Matching', 'Financial Modeling', 'Due Diligence Tools'],
    roi: '320% average ROI',
    targetAudience: 'Investors, Fund Managers',
    pricing: 'Starting at $499/month',
  },
  {
    id: 'lending',
    title: 'Mortgage & Lending',
    geometry: 'cone',
    position: [2, 1, -2],
    color: '#42a5f5',
    icon: <LenderIcon />,
    description: 'Reach borrowers looking for financing solutions',
    features: ['Rate Showcases', 'Pre-approval Tools', 'Application Forms', 'Rate Alerts'],
    roi: '200% average ROI',
    targetAudience: 'Home buyers, Refinancers',
    pricing: 'Starting at $399/month',
  },
  {
    id: 'technology',
    title: 'PropTech Solutions',
    geometry: 'cylinder',
    position: [4, 2, -2],
    color: '#1e88e5',
    icon: <TechIcon />,
    description: 'Market your technology solutions to the real estate industry',
    features: ['Product Demos', 'Case Studies', 'Integration Guides', 'Developer Resources'],
    roi: '280% average ROI',
    targetAudience: 'Tech decision makers',
    pricing: 'Starting at $799/month',
  },
  {
    id: 'business',
    title: 'Business Services',
    geometry: 'box',
    position: [0, -1, -2],
    color: '#2196f3',
    icon: <BusinessIcon />,
    description: 'Promote your business services to real estate professionals',
    features: ['Service Directory', 'Portfolio Showcases', 'Client Reviews', 'Industry Insights'],
    roi: '190% average ROI',
    targetAudience: 'Business owners, Professionals',
    pricing: 'Starting at $249/month',
  },
];

export const OpportunitiesSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [hoveredOpportunity, setHoveredOpportunity] = useState<string | null>(null);

  return (
    <group visible={visible} position={[0, 0, -40]}>
      {/* 3D Meshes for each opportunity */}
      {opportunities.map((opportunity) => (
        <InteractiveMesh
          key={opportunity.id}
          position={opportunity.position}
          geometry={opportunity.geometry}
          color={opportunity.color}
          onClick={() => setSelectedOpportunity(opportunity)}
          onHover={(hovered) => setHoveredOpportunity(hovered ? opportunity.id : null)}
        />
      ))}

      {/* Title */}
      {visible && (
        <Html position={[0, 4, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            Advertising Opportunities
          </Typography>
        </Html>
      )}

      {/* Hover Tooltip */}
      {visible && hoveredOpportunity && (
        <Html
          position={opportunities.find((o) => o.id === hoveredOpportunity)!.position}
          center
          distanceFactor={5}
          style={{ pointerEvents: 'auto' }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              minWidth: '250px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {opportunities.find((o) => o.id === hoveredOpportunity)!.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click to view details
            </Typography>
          </Box>
        </Html>
      )}

      {/* Selected Opportunity Details */}
      {visible && selectedOpportunity && (
        <Html position={[0, -3, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
          <Box
            sx={{
              width: '700px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      mr: 2,
                      fontSize: 40,
                      color: selectedOpportunity.color,
                    }}
                  >
                    {selectedOpportunity.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {selectedOpportunity.title}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  {selectedOpportunity.description}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Features:
                </Typography>
                <List dense>
                  {selectedOpportunity.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText primary={`• ${feature}`} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Details:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedOpportunity.roi}
                    sx={{
                      backgroundColor: brandColors.primary,
                      color: 'white',
                      mb: 1,
                      mr: 1,
                    }}
                  />
                  <Chip
                    label={selectedOpportunity.pricing}
                    variant="outlined"
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      mb: 1,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  <strong>Target Audience:</strong> {selectedOpportunity.targetAudience}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Html>
      )}
    </group>
  );
};

