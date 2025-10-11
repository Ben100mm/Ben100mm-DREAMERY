/**
 * Pricing Section 3D Component
 */

import React, { useState, useRef } from 'react';
import { Html, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Switch,
  Slider,
  Grid,
  Chip,
} from '@mui/material';
import { brandColors } from '../../../theme/theme';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PricingTier {
  name: string;
  price: number;
  annualPrice: number;
  features: string[];
  color: string;
  recommended?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 199,
    annualPrice: 1990,
    color: '#64b5f6',
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
    color: brandColors.primary,
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
    color: '#1e88e5',
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

export const PricingSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const consoleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (consoleRef.current && visible) {
      consoleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const calculateSavings = (tier: PricingTier) => {
    const annualTotal = tier.price * 12;
    const savings = annualTotal - tier.annualPrice;
    const percentage = Math.round((savings / annualTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <group visible={visible} position={[0, 0, 0]}>
      {/* 3D Pricing Console */}
      <group ref={consoleRef} position={[0, 0, -2]}>
        <mesh>
          <boxGeometry args={[6, 3, 0.5]} />
          <meshStandardMaterial
            color={brandColors.primary}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Price display meshes */}
        {pricingTiers.map((tier, index) => (
          <mesh
            key={tier.name}
            position={[-3 + index * 3, 0, 0.3]}
          >
            <planeGeometry args={[2, 2.5]} />
            <meshStandardMaterial
              color={tier.color}
              metalness={0.5}
              roughness={0.4}
              transparent
              opacity={0.8}
            />
            <Text
              position={[0, 0.8, 0.1]}
              fontSize={0.2}
              color="white"
              anchorX="center"
            >
              {tier.name}
            </Text>
            <Text
              position={[0, 0.3, 0.1]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              fontWeight={700}
            >
              ${isAnnual ? tier.annualPrice : tier.price}
            </Text>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.15}
              color="white"
              anchorX="center"
            >
              {isAnnual ? '/year' : '/month'}
            </Text>
          </mesh>
        ))}
      </group>

      {/* HTML Overlay */}
      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 700,
            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            mb: 2,
          }}
        >
          Flexible Pricing Plans
        </Typography>
      </Html>

      <Html position={[0, -3, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '1000px' }}>
          {/* Annual/Monthly Toggle */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            <Typography sx={{ mr: 2, fontWeight: 600 }}>Monthly</Typography>
            <Switch
              checked={isAnnual}
              onChange={(e) => setIsAnnual(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: brandColors.primary,
                },
              }}
            />
            <Typography sx={{ ml: 2, fontWeight: 600 }}>
              Annual
              <Chip
                label="Save 17%"
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            </Typography>
          </Box>

          {/* Pricing Cards */}
          <Grid container spacing={3}>
            {pricingTiers.map((tier) => {
              const savings = calculateSavings(tier);
              return (
                <Grid item xs={12} md={4} key={tier.name}>
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '16px',
                      border: tier.recommended
                        ? `3px solid ${brandColors.primary}`
                        : '1px solid rgba(0,0,0,0.1)',
                      boxShadow: tier.recommended
                        ? '0 12px 40px rgba(25, 118, 210, 0.3)'
                        : '0 4px 12px rgba(0,0,0,0.1)',
                      position: 'relative',
                      transform: tier.recommended ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    {tier.recommended && (
                      <Chip
                        label="MOST POPULAR"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: brandColors.primary,
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: tier.color,
                        }}
                      >
                        {tier.name}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            color: brandColors.text.primary,
                          }}
                        >
                          ${isAnnual ? tier.annualPrice : tier.price}
                          <Typography
                            component="span"
                            variant="h6"
                            sx={{ color: brandColors.text.secondary }}
                          >
                            {isAnnual ? '/year' : '/month'}
                          </Typography>
                        </Typography>
                        {isAnnual && (
                          <Typography
                            variant="body2"
                            sx={{ color: '#4caf50', fontWeight: 600, mt: 1 }}
                          >
                            Save ${savings.amount} ({savings.percentage}% off)
                          </Typography>
                        )}
                      </Box>

                      <List dense sx={{ mb: 3 }}>
                        {tier.features.map((feature, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <CheckCircleIcon
                              sx={{
                                color: tier.color,
                                fontSize: 20,
                                mr: 1,
                              }}
                            />
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                fontSize: '0.95rem',
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      <Button
                        variant={tier.recommended ? 'contained' : 'outlined'}
                        fullWidth
                        sx={{
                          py: 1.5,
                          fontWeight: 600,
                          backgroundColor: tier.recommended
                            ? brandColors.primary
                            : 'transparent',
                          borderColor: tier.color,
                          color: tier.recommended ? 'white' : tier.color,
                          '&:hover': {
                            backgroundColor: tier.recommended
                              ? brandColors.actions.primary
                              : 'rgba(25, 118, 210, 0.05)',
                          },
                        }}
                        onClick={() => setSelectedTier(tier)}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Additional Info */}
          <Box
            sx={{
              mt: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: brandColors.primary }}>
              Need a custom plan? Contact our sales team
            </Typography>
          </Box>
        </Box>
      </Html>
    </group>
  );
};

