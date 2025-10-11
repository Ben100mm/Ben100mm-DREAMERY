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
  const texture = useLoader(TextureLoader, '/milky-way-background.png');
  
  // Configure texture for better quality and reduced grain
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter; // Better mipmap filtering
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16; // Higher anisotropy for better quality at angles
  
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
      opacity: 0.7, // Reduced opacity to soften grain appearance
      depthWrite: false, // Prevent z-fighting with other elements
      fog: false, // Disable fog for consistent appearance
    });
  }, [texture]);
  
  // Animate parallax rotation based on scroll
  useFrame(() => {
    if (meshRef.current) {
      // Very subtle rotation opposite to scroll direction (parallax effect)
      // Looking right makes background shift left - but much gentler
      const targetRotationY = -scrollProgress * 0.08; // Much more subtle
      const targetRotationX = Math.sin(scrollProgress * 0.3) * 0.04; // Very gentle vertical tilt
      
      // Slower interpolation for smoother movement
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.03;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.03;
      
      // Remove scale breathing effect as it worsens the grain
      // Keep static scale for better visual quality
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

