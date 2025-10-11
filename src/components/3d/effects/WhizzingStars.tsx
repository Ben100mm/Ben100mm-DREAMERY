/**
 * Whizzing Stars Effect
 * Dynamic stars that move faster when scrolling for motion blur effect
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WhizzingStarsProps {
  visible?: boolean;
  scrollVelocity?: number;
  scrollProgress?: number;
}

export const WhizzingStars: React.FC<WhizzingStarsProps> = ({ 
  visible = true, 
  scrollVelocity = 0, 
  scrollProgress = 0 
}) => {
  const starsRef = useRef<THREE.Points>(null);
  const previousScrollRef = useRef(0);
  
  const [positions, velocities] = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Random positions in a cylinder around the path
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 20;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = Math.random() * -500;
      
      // Random velocities for whizzing effect
      vel[i] = 2 + Math.random() * 3;
    }
    
    return [pos, vel];
  }, []);
  
  useFrame((state, delta) => {
    if (starsRef.current && visible) {
      const positions = starsRef.current.geometry.attributes.position;
      const scrollSpeed = Math.abs(scrollVelocity);
      
      // Only move stars when scrolling (no constant movement)
      if (scrollSpeed > 0.01) {
        const intensity = Math.min(scrollSpeed * 10, 5); // Cap the intensity
        
        for (let i = 0; i < positions.count; i++) {
          // Move stars forward based on scroll speed only
          positions.array[i * 3 + 2] += (velocities[i] * intensity) * delta;
          
          // Reset stars that go past camera
          if (positions.array[i * 3 + 2] > 10) {
            positions.array[i * 3 + 2] = -500;
          }
        }
        
        positions.needsUpdate = true;
      }
    }
    
    previousScrollRef.current = scrollVelocity;
  });
  
  // Don't render if not visible
  if (!visible) return null;

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

