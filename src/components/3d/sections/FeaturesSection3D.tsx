/**
 * Platform Features Section 3D Component
 */

import React, { useRef, useState } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import DevicesIcon from '@mui/icons-material/Devices';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import ScienceIcon from '@mui/icons-material/Science';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: [number, number, number];
  color: string;
}

const features: Feature[] = [
  {
    id: 'targeting',
    title: 'Advanced Targeting',
    description: 'Precision targeting based on demographics, behavior, and intent',
    icon: <TrackChangesIcon sx={{ fontSize: 48 }} />,
    position: [3, 2, -1],
    color: '#1976d2',
  },
  {
    id: 'analytics',
    title: 'Real-Time Analytics',
    description: 'Comprehensive reporting and insights dashboard',
    icon: <BarChartIcon sx={{ fontSize: 48 }} />,
    position: [2, -1, -1],
    color: '#64b5f6',
  },
  {
    id: 'mobile',
    title: 'Mobile Optimized',
    description: 'Responsive ads that look great on any device',
    icon: <DevicesIcon sx={{ fontSize: 48 }} />,
    position: [-2, 2, -1],
    color: '#90caf9',
  },
  {
    id: 'integration',
    title: 'Easy Integration',
    description: 'Seamless integration with CRM and marketing tools',
    icon: <IntegrationInstructionsIcon sx={{ fontSize: 48 }} />,
    position: [-3, -1, -1],
    color: '#42a5f5',
  },
  {
    id: 'testing',
    title: 'A/B Testing',
    description: 'Test and optimize campaigns for maximum performance',
    icon: <ScienceIcon sx={{ fontSize: 48 }} />,
    position: [0, 3, -1],
    color: '#2196f3',
  },
  {
    id: 'performance',
    title: 'High Performance',
    description: 'Fast loading times and optimized delivery',
    icon: <SpeedIcon sx={{ fontSize: 48 }} />,
    position: [3, -2, -1],
    color: '#1e88e5',
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'Bank-level security and fraud protection',
    icon: <SecurityIcon sx={{ fontSize: 48 }} />,
    position: [-3, -3, -1],
    color: '#1565c0',
  },
  {
    id: 'support',
    title: '24/7 Support',
    description: 'Dedicated support team available round the clock',
    icon: <SupportAgentIcon sx={{ fontSize: 48 }} />,
    position: [0, -3, -1],
    color: '#0d47a1',
  },
];

export const FeaturesSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} visible={visible} position={[0, 0, 0]}>
      {/* Central hub sphere */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={brandColors.primary}
          metalness={0.9}
          roughness={0.1}
          emissive={brandColors.primary}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Feature nodes */}
      {features.map((feature) => (
        <group key={feature.id}>
          <mesh
            position={feature.position}
            onClick={() => setSelectedFeature(feature)}
            onPointerOver={() => setHoveredFeature(feature.id)}
            onPointerOut={() => setHoveredFeature(null)}
          >
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial
              color={feature.color}
              metalness={0.7}
              roughness={0.3}
              emissive={hoveredFeature === feature.id ? feature.color : '#000000'}
              emissiveIntensity={hoveredFeature === feature.id ? 0.5 : 0}
            />
          </mesh>

          {/* Connection line to center */}
          <Line
            points={[
              feature.position,
              [0, 0, -1],
            ]}
            color={feature.color}
            lineWidth={2}
            opacity={0.5}
            transparent
          />
        </group>
      ))}

      {/* Title */}
      <Html position={[0, 4, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 700,
            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          Platform Features
        </Typography>
      </Html>

      {/* Feature Details */}
      <Html position={[0, -5, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '900px' }}>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.id}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedFeature?.id === feature.id
                      ? `2px solid ${feature.color}`
                      : '1px solid rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 32px ${feature.color}40`,
                    },
                  }}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: feature.color, mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 1, color: brandColors.text.primary }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
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

