/**
 * Floating Card 3D Component
 * Reusable 3D card with floating animation
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingCard3DProps {
  position: [number, number, number];
  children?: React.ReactNode;
  floatAmplitude?: number;
  floatSpeed?: number;
  color?: string;
}

export const FloatingCard3D: React.FC<FloatingCard3DProps> = ({
  position,
  children,
  floatAmplitude = 0.2,
  floatSpeed = 1,
  color = '#1976d2',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        initialY + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[2, 1.2, 0.1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.9}
      />
      {children}
    </mesh>
  );
};

