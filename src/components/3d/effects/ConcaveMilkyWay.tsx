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
  
  // Load the milky way texture with better quality settings
  const texture = useLoader(TextureLoader, '/milky-way-background.jpg');
  
  // Configure texture for better quality
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  
  // Create sphere geometry (to see inside)
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(
      50,   // Smaller radius for more pronounced concave effect
      128,  // More segments for smoother surface
      128   // More segments for smoother surface
    );
    
    return geo;
  }, []);
  
  // Create material with the texture
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // Render the inside surface
      transparent: true,
      opacity: 0.9, // Higher opacity for richer appearance
      depthWrite: false, // Prevent z-fighting with other elements
      fog: false, // Disable fog for consistent appearance
    });
  }, [texture]);
  
  // Animate parallax rotation based on scroll
  useFrame(() => {
    if (meshRef.current) {
      // More pronounced rotation opposite to scroll direction (parallax effect)
      // Looking right makes background shift left
      const targetRotationY = -scrollProgress * 0.3; // Increased for more visible parallax
      const targetRotationX = Math.sin(scrollProgress * 0.5) * 0.15; // More pronounced vertical tilt
      
      // Smoother interpolation for natural movement
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.08;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.08;
      
      // Add subtle scale breathing based on velocity
      const targetScale = 1 + Math.abs(scrollVelocity) * 0.0001;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.15;
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

