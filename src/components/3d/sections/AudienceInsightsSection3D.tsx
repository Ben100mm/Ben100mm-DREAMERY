/**
 * Audience Insights Section 3D Component
 * Features custom GLSL shader for data sphere
 */

import React, { useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import {
  dataSphereVertexShader,
  dataSphereFragmentShader,
} from '../../../shaders/dataSphere.glsl';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const AudienceInsightsSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  // Create shader material with custom GLSL
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: dataSphereVertexShader,
      fragmentShader: dataSphereFragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(brandColors.primary) },
        color2: { value: new THREE.Color('#64b5f6') },
        color3: { value: new THREE.Color('#90caf9') },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    }

    if (sphereRef.current && visible) {
      sphereRef.current.rotation.y += 0.002;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const stats = [
    {
      icon: <PeopleIcon sx={{ fontSize: 60, color: brandColors.primary }} />,
      value: '50,000+',
      label: 'Active Users',
      description: 'Engaged real estate professionals and buyers',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 60, color: brandColors.primary }} />,
      value: '2.5M',
      label: 'Monthly Impressions',
      description: 'Average monthly ad impressions',
    },
    {
      icon: <PublicIcon sx={{ fontSize: 60, color: brandColors.primary }} />,
      value: '150+',
      label: 'Markets',
      description: 'Coverage across major US markets',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 60, color: brandColors.primary }} />,
      value: '4.2 min',
      label: 'Avg. Session',
      description: 'High engagement and time on platform',
    },
  ];

  return (
    <group visible={visible} position={[0, 0, 0]}>
      {/* Custom shader sphere */}
      <mesh ref={sphereRef} position={[0, 0, -2]}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={shaderMaterial} ref={shaderRef} attach="material" />
      </mesh>

      {/* Particle trails */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle + i * 0.1) * radius * 0.5;
        const z = Math.sin(angle) * radius - 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={brandColors.primary}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

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
          Audience Insights
        </Typography>
      </Html>

      {/* Statistics */}
      <Html position={[0, -4, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '1000px' }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 32px ${brandColors.primary}40`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: brandColors.primary,
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: brandColors.text.primary }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Additional insights */}
          <Card
            sx={{
              mt: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              p: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Demographic Breakdown
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  User Types:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Real Estate Agents: 35%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Home Buyers: 40%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Investors: 15%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Industry Professionals: 10%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Top Markets:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • San Francisco Bay Area
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Los Angeles Metro
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • New York City
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Miami-Dade County
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Html>
    </group>
  );
};

