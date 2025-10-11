/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential.
 * 
 * Concave Milky Way Background
 * A 3D sphere viewed from inside with parallax effect
 */

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface ConcaveMilkyWayProps {
  scrollProgress: number;
  scrollVelocity: number;
}

export const ConcaveMilkyWay: React.FC<ConcaveMilkyWayProps> = ({ 
  scrollProgress, 
  scrollVelocity 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load the milky way texture
  const texture = useLoader(TextureLoader, '/milky-way-background.jpg');
  
  // Create sphere geometry (to see inside)
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(
      100,  // Large radius to encompass the scene
      64,   // Width segments for smooth surface
      64    // Height segments for smooth surface
    );
    
    return geo;
  }, []);
  
  // Create material with the texture
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // Render the inside surface
      transparent: true,
      opacity: 0.8, // Increased opacity for better visibility
      depthWrite: false, // Prevent z-fighting with other elements
    });
  }, [texture]);
  
  // Animate parallax rotation based on scroll
  useFrame(() => {
    if (meshRef.current) {
      // Subtle rotation opposite to scroll direction (parallax effect)
      // Looking right makes background shift left
      const targetRotationY = -scrollProgress * 0.15; // Negative for opposite direction
      const targetRotationX = Math.sin(scrollProgress * 0.5) * 0.08; // Gentle vertical tilt
      
      // Smooth interpolation for natural movement
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
      
      // Add subtle scale breathing based on velocity
      const targetScale = 1 + Math.abs(scrollVelocity) * 0.00005;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      meshRef.current.scale.setScalar(newScale);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      renderOrder={-1} // Render in background
    />
  );
};

