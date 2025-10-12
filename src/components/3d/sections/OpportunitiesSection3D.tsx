/**
 * Advertising Opportunities Section 3D Component
 */

import React, { useState } from 'react';
import { Html, Text } from '@react-three/drei';
import { Box, Typography } from '@mui/material';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  features: string[];
}

const opportunities: Opportunity[] = [
  {
    id: 'property',
    title: 'Property Listings',
    description: 'Showcase properties to qualified buyers and investors',
    features: ['Professional Photography', 'Virtual Tours', 'Market Analysis', 'Lead Generation']
  },
  {
    id: 'services',
    title: 'Professional Services',
    description: 'Promote real estate services to the right audience',
    features: ['Agent Profiles', 'Service Listings', 'Client Testimonials', 'Local SEO']
  },
  {
    id: 'investment',
    title: 'Investment Opportunities',
    description: 'Connect with investors for real estate deals',
    features: ['Deal Presentations', 'Investor Matching', 'Financial Modeling', 'Due Diligence Tools']
  },
  {
    id: 'lending',
    title: 'Mortgage & Lending',
    description: 'Reach borrowers looking for financing solutions',
    features: ['Rate Showcases', 'Pre-approval Tools', 'Application Forms', 'Rate Alerts']
  },
  {
    id: 'technology',
    title: 'PropTech Solutions',
    description: 'Market technology solutions to the real estate industry',
    features: ['Product Demos', 'Case Studies', 'Integration Guides', 'Developer Resources']
  },
  {
    id: 'business',
    title: 'Business Services',
    description: 'Promote business services to real estate professionals',
    features: ['Service Directory', 'Portfolio Showcases', 'Client Reviews', 'Industry Insights']
  }
];

export const OpportunitiesSection3D: React.FC<{ visible: boolean; sectionIndex: number; scrollProgress: number }> = ({ visible, sectionIndex, scrollProgress }) => {

  // Get dynamic position that moves toward camera along the winding path
  const contentPosition = getContentPositionAlongPath(sectionIndex, scrollProgress);

  return (
    <group visible={visible} position={[contentPosition.x, contentPosition.y, contentPosition.z]}>
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

      {/* Plain Text Opportunities */}
      {visible && (
        <Html position={[0, 0, 0]} center distanceFactor={6} style={{ pointerEvents: 'auto' }}>
          <Box sx={{ 
            width: '1200px', 
            textAlign: 'center',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '20px'
          }}>
            {opportunities.map((opportunity, index) => (
              <Box key={opportunity.id} sx={{ mb: 4 }}>
                <Typography 
                  sx={{ 
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    color: 'white'
                  }}
                >
                  {opportunity.title}
                </Typography>
                
                <Typography 
                  sx={{ 
                    fontSize: '18px',
                    marginBottom: '10px',
                    color: 'white',
                    lineHeight: 1.5
                  }}
                >
                  {opportunity.description}
                </Typography>

                <Typography 
                  sx={{ 
                    fontSize: '16px',
                    color: 'white',
                    lineHeight: 1.6,
                    marginBottom: '20px'
                  }}
                >
                  Features: {opportunity.features.join(', ')}
                </Typography>
                
                {index < opportunities.length - 1 && (
                  <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', margin: '20px 0' }} />
                )}
              </Box>
            ))}
          </Box>
        </Html>
      )}
    </group>
  );
};

