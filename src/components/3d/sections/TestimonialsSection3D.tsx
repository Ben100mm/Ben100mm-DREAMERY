/**
 * Testimonials & Success Stories Section 3D Component
 */

import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  Grid,
} from '@mui/material';
import { brandColors } from '../../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  results: {
    metric: string;
    value: string;
  }[];
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Real Estate Broker',
    company: 'Premium Properties SF',
    avatar: '/P1.jpg',
    rating: 5,
    quote: 'Dreamery advertising has transformed our lead generation. We saw a 320% increase in qualified leads within the first month.',
    results: [
      { metric: 'Lead Increase', value: '320%' },
      { metric: 'ROI', value: '450%' },
      { metric: 'Cost per Lead', value: '-65%' },
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Investment Manager',
    company: 'Coastal Capital Group',
    avatar: '/P2.jpg',
    rating: 5,
    quote: 'The targeting capabilities are incredible. We reached exactly the right investors and closed 3 deals in 6 weeks.',
    results: [
      { metric: 'Deals Closed', value: '3' },
      { metric: 'Time to Close', value: '-40%' },
      { metric: 'Investment Volume', value: '$12M' },
    ],
  },
  {
    id: '3',
    name: 'Jessica Martinez',
    role: 'Mortgage Loan Officer',
    company: 'Bay Area Lending',
    avatar: '/P3.jpg',
    rating: 5,
    quote: 'Our loan applications tripled, and the quality of leads improved significantly. Best advertising investment we have made.',
    results: [
      { metric: 'Applications', value: '+300%' },
      { metric: 'Conversion Rate', value: '28%' },
      { metric: 'Avg Loan Size', value: '+45%' },
    ],
  },
];

export const TestimonialsSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  const avatarRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }

    // Animate avatar spheres
    avatarRefs.current.forEach((avatar, i) => {
      if (avatar) {
        avatar.position.y += Math.sin(state.clock.elapsedTime + i * 2) * 0.005;
      }
    });
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <group ref={groupRef} visible={visible} position={[0, 0, -200]}>
      {/* Floating avatar spheres */}
      {testimonials.map((testimonial, index) => {
        const angle = (index / testimonials.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 2;

        return (
          <mesh
            key={testimonial.id}
            ref={(ref) => ref && (avatarRefs.current[index] = ref)}
            position={[x, 1, z]}
            onClick={() => setCurrentIndex(index)}
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={index === currentIndex ? brandColors.primary : '#64b5f6'}
              metalness={0.7}
              roughness={0.3}
              emissive={index === currentIndex ? brandColors.primary : '#000000'}
              emissiveIntensity={index === currentIndex ? 0.5 : 0}
            />
          </mesh>
        );
      })}

      {/* Star rating particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 6;
        const y = Math.random() * 4 - 1;
        const z = (Math.random() - 0.5) * 4 - 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
          </mesh>
        );
      })}

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
          Success Stories
        </Typography>
      </Html>
      )}

      {/* Testimonial Content */}
      {visible && (
      <Html position={[0, -2, 0]} center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <Box sx={{ width: '800px' }}>
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              p: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <CardContent>
              {/* Header with avatar and info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={currentTestimonial.avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    border: `3px solid ${brandColors.primary}`,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {currentTestimonial.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                    {currentTestimonial.role} • {currentTestimonial.company}
                  </Typography>
                  <Rating value={currentTestimonial.rating} readOnly />
                </Box>
              </Box>

              {/* Quote */}
              <Typography
                variant="h6"
                sx={{
                  fontStyle: 'italic',
                  mb: 3,
                  lineHeight: 1.7,
                  color: brandColors.text.primary,
                  fontSize: '1.25rem',
                }}
              >
                "{currentTestimonial.quote}"
              </Typography>

              {/* Results */}
              <Grid container spacing={2}>
                {currentTestimonial.results.map((result, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: brandColors.primary,
                          mb: 0.5,
                        }}
                      >
                        {result.value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.metric}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Navigation */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 3,
                  gap: 2,
                }}
              >
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    backgroundColor: brandColors.primary,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: brandColors.actions.primary,
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {testimonials.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor:
                          index === currentIndex ? brandColors.primary : 'rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </Box>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    backgroundColor: brandColors.primary,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: brandColors.actions.primary,
                    },
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Html>
      )}
    </group>
  );
};

