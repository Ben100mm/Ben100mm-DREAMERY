/**
 * Concave Milky Way Background
 * 3D inverted sphere with Milky Way texture and dynamic parallax movement
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { calculateMilkyWayParallaxOffset, getCurrentCameraPosition, calculateTextureUVOffset } from '../../../utils/3d/parallax';

// Simple material for debugging - will replace with shader once working

interface ConcaveMilkyWayProps {
  scrollProgress?: number;
  scrollVelocity?: number;
  parallaxFactor?: number;
}

export const ConcaveMilkyWay: React.FC<ConcaveMilkyWayProps> = ({ 
  scrollProgress = 0, 
  scrollVelocity = 0,
  parallaxFactor = 0.4 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load the Milky Way texture
  const milkyWayTexture = useTexture('/milky-way-background.jpg');
  
  // Create inverted sphere geometry (inside faces visible)
  const sphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(200, 32, 32);
    // Flip faces to make inside visible
    geometry.scale(-1, 1, 1);
    return geometry;
  }, []);
  
  // Create a simple mesh material for debugging
  const meshMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      map: milkyWayTexture,
      color: '#ffffff', // Fallback color
      side: THREE.BackSide, // Render back faces for inside view
      transparent: true,
      opacity: 0.8, // Increase opacity for debugging
    });
    return material;
  }, [milkyWayTexture]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Calculate parallax offset based on camera movement
      const parallaxOffset = calculateMilkyWayParallaxOffset(scrollProgress, parallaxFactor);
      
      // Position sphere at camera origin with parallax offset
      meshRef.current.position.set(parallaxOffset.x, parallaxOffset.y, parallaxOffset.z);
      
      // Add subtle rotation based on scroll for dynamic effect
      meshRef.current.rotation.y = scrollProgress * Math.PI * 0.1;
      meshRef.current.rotation.x = scrollVelocity * 0.01;
      
      // Debug logging
      if (scrollProgress > 0.1 && scrollProgress < 0.2) {
        console.log('Milky Way position:', meshRef.current.position);
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={sphereGeometry}
      material={meshMaterial}
      renderOrder={-1} // Render first as background
    />
  );
};
