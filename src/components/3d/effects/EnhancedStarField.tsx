/**
 * Enhanced Star Field Effect
 * Multiple layers of stars with different depths, sizes, and movements for 3D space travel effect
 */

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface EnhancedStarFieldProps {
  scrollVelocity?: number;
  mousePosition?: { x: number; y: number };
}

export const EnhancedStarField: React.FC<EnhancedStarFieldProps> = ({ 
  scrollVelocity = 0, 
  mousePosition = { x: 0, y: 0 } 
}) => {
  const nearStarsRef = useRef<THREE.Points>(null);
  const midStarsRef = useRef<THREE.Points>(null);
  const farStarsRef = useRef<THREE.Points>(null);
  const nebulaStarsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  
  // Create different star layers with varying properties
  const [nearPositions, nearVelocities, nearSizes] = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Near stars - bright and fast moving
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 15;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = Math.random() * -600;
      
      vel[i] = 3 + Math.random() * 4; // Fast movement
      sizes[i] = 0.15 + Math.random() * 0.1; // Larger, brighter stars
    }
    
    return [pos, vel, sizes];
  }, []);
  
  const [midPositions, midVelocities, midSizes] = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Mid-distance stars - moderate movement
      const angle = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 25;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = Math.random() * -800;
      
      vel[i] = 1.5 + Math.random() * 2; // Moderate movement
      sizes[i] = 0.08 + Math.random() * 0.06; // Medium stars
    }
    
    return [pos, vel, sizes];
  }, []);
  
  const [farPositions, farVelocities, farSizes] = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Far stars - slow movement, parallax effect
      const angle = Math.random() * Math.PI * 2;
      const radius = 50 + Math.random() * 40;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 2] = Math.random() * -1200;
      
      vel[i] = 0.5 + Math.random() * 1; // Slow movement
      sizes[i] = 0.04 + Math.random() * 0.04; // Small, distant stars
    }
    
    return [pos, vel, sizes];
  }, []);
  
  const [nebulaPositions, nebulaVelocities, nebulaSizes] = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Nebula stars - very distant, colored, slow
      const angle = Math.random() * Math.PI * 2;
      const radius = 70 + Math.random() * 60;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = Math.random() * -1500;
      
      vel[i] = 0.2 + Math.random() * 0.5; // Very slow movement
      sizes[i] = 0.2 + Math.random() * 0.15; // Larger, colored stars
    }
    
    return [pos, vel, sizes];
  }, []);
  
  useFrame((state, delta) => {
    const scrollSpeed = Math.abs(scrollVelocity) * 8;
    
    // Update near stars
    if (nearStarsRef.current) {
      const positions = nearStarsRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.array[i * 3 + 2] += (nearVelocities[i] * scrollSpeed + 2) * delta * 15;
        
        // Reset stars that go past camera
        if (positions.array[i * 3 + 2] > 10) {
          positions.array[i * 3 + 2] = -600;
        }
      }
      positions.needsUpdate = true;
    }
    
    // Update mid stars
    if (midStarsRef.current) {
      const positions = midStarsRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.array[i * 3 + 2] += (midVelocities[i] * scrollSpeed + 1) * delta * 10;
        
        if (positions.array[i * 3 + 2] > 10) {
          positions.array[i * 3 + 2] = -800;
        }
      }
      positions.needsUpdate = true;
    }
    
    // Update far stars
    if (farStarsRef.current) {
      const positions = farStarsRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.array[i * 3 + 2] += (farVelocities[i] * scrollSpeed + 0.5) * delta * 5;
        
        if (positions.array[i * 3 + 2] > 10) {
          positions.array[i * 3 + 2] = -1200;
        }
      }
      positions.needsUpdate = true;
    }
    
    // Update nebula stars
    if (nebulaStarsRef.current) {
      const positions = nebulaStarsRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.array[i * 3 + 2] += (nebulaVelocities[i] * scrollSpeed + 0.2) * delta * 2;
        
        if (positions.array[i * 3 + 2] > 10) {
          positions.array[i * 3 + 2] = -1500;
        }
      }
      positions.needsUpdate = true;
    }
  });
  
  return (
    <group>
      {/* Near Stars - Bright, fast moving */}
      <points ref={nearStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nearPositions.length / 3}
            array={nearPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={nearSizes.length}
            array={nearSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          vertexColors={false}
        />
      </points>
      
      {/* Mid Stars - Moderate movement */}
      <points ref={midStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={midPositions.length / 3}
            array={midPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={midSizes.length}
            array={midSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#e3f2fd"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      
      {/* Far Stars - Slow movement, parallax */}
      <points ref={farStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={farPositions.length / 3}
            array={farPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={farSizes.length}
            array={farSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#bbdefb"
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
      
      {/* Nebula Stars - Colored, very distant */}
      <points ref={nebulaStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nebulaPositions.length / 3}
            array={nebulaPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={nebulaSizes.length}
            array={nebulaSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#9c27b0"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
