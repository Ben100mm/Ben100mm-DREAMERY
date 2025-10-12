/**
 * Pricing Section 3D Component
 */

import React, { useState } from 'react';
import { Html, Text } from '@react-three/drei';
import {
  Box,
  Typography,
} from '@mui/material';
import { getContentPositionAlongPath } from '../../../utils/3d/scroll';

interface PricingTier {
  name: string;
  price: number;
  annualPrice: number;
  features: string[];
  recommended?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 199,
    annualPrice: 1990,
    features: [
      '1 Active Campaign',
      'Basic Analytics',
      '10,000 Impressions/month',
      'Email Support',
      'Standard Targeting',
    ],
  },
  {
    name: 'Professional',
    price: 499,
    annualPrice: 4990,
    recommended: true,
    features: [
      '5 Active Campaigns',
      'Advanced Analytics',
      '50,000 Impressions/month',
      'Priority Support',
      'Advanced Targeting',
      'A/B Testing',
      'Custom Reports',
    ],
  },
  {
    name: 'Enterprise',
    price: 999,
    annualPrice: 9990,
    features: [
      'Unlimited Campaigns',
      'Premium Analytics',
      'Unlimited Impressions',
      'Dedicated Account Manager',
      'AI-Powered Targeting',
      'Full A/B Testing Suite',
      'Custom Integrations',
      'API Access',
      'White-Label Options',
    ],
  },
];

export const PricingSection3D: React.FC<{ visible: boolean; sectionIndex: number; scrollProgress: number }> = ({ visible, sectionIndex, scrollProgress }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Get dynamic position that moves toward camera along the winding path
  const contentPosition = getContentPositionAlongPath(sectionIndex, scrollProgress);

  const calculateSavings = (tier: PricingTier) => {
    const annualTotal = tier.price * 12;
    const savings = annualTotal - tier.annualPrice;
    const percentage = Math.round((savings / annualTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <group visible={visible} position={[contentPosition.x, contentPosition.y, contentPosition.z]}>
      {/* 3D Title */}
      {visible && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#1976d2"
          letterSpacing={0.05}
        >
          FLEXIBLE PRICING PLANS
        </Text>
      )}

      {visible && (
        <Html position={[0, 0, 0]} center distanceFactor={6} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ 
          width: '1200px', 
          textAlign: 'center',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Plain Text Pricing Plans */}
          {pricingTiers.map((tier, index) => {
            const savings = calculateSavings(tier);
            return (
              <Box key={tier.name} sx={{ mb: 6 }}>
                <Typography 
                  sx={{ 
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    color: 'white'
                  }}
                >
                  {tier.name} {tier.recommended && '(MOST POPULAR)'}
                </Typography>
                
                <Typography 
                  sx={{ 
                    fontSize: '24px',
                    marginBottom: '15px',
                    color: 'white'
                  }}
                >
                  ${isAnnual ? tier.annualPrice : tier.price}{isAnnual ? '/year' : '/month'}
                </Typography>

                {isAnnual && (
                  <Typography 
                    sx={{ 
                      fontSize: '16px',
                      marginBottom: '20px',
                      color: '#4caf50'
                    }}
                  >
                    Save ${savings.amount} ({savings.percentage}% off)
                  </Typography>
                )}

                <Typography 
                  sx={{ 
                    fontSize: '18px',
                    color: 'white',
                    lineHeight: 1.6,
                    marginBottom: '20px'
                  }}
                >
                  Features: {tier.features.join(', ')}
                </Typography>
                
                {index < pricingTiers.length - 1 && (
                  <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', margin: '30px 0' }} />
                )}
              </Box>
            );
          })}

          {/* Plain Text Additional Info */}
          <Box sx={{ mt: 6 }}>
            <Typography 
              sx={{ 
                fontSize: '16px',
                color: 'white',
                marginBottom: '10px'
              }}
            >
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '16px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Need a custom plan? Contact our sales team
            </Typography>
          </Box>
        </Box>
      </Html>
      )}
    </group>
  );
};

