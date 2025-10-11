/**
 * Advertising Opportunities Section 3D Component
 */

import React, { useState } from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography, Grid, Chip } from '@mui/material';
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
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(opportunities[0]);

  return (
    <group visible={visible} position={[0, 0, -40]}>
      {/* 3D Title */}
      {visible && (
        <Text
          position={[0, 4, 0]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#1976d2"
          letterSpacing={0.05}
        >
          ADVERTISING OPPORTUNITIES
        </Text>
      )}

      {/* Selected Opportunity Details */}
      {visible && (
        <Html position={[0, -3, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
          <Box sx={{ width: '1000px' }}>
            <Grid container spacing={3}>
              {opportunities.map((opportunity) => (
                <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 48px rgba(31, 38, 135, 0.5)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2, fontSize: 36, color: opportunity.color }}>
                        {opportunity.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {opportunity.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {opportunity.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={opportunity.roi}
                        size="small"
                        sx={{
                          backgroundColor: brandColors.primary,
                          color: 'white',
                          mr: 1,
                          mb: 1,
                        }}
                      />
                      <Chip
                        label={opportunity.pricing}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: brandColors.primary,
                          color: brandColors.primary,
                          mb: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {opportunity.targetAudience}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Html>
      )}
    </group>
  );
};

