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
  
  // Create normal sphere geometry for testing
  const sphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    // Remove inversion for testing
    return geometry;
  }, []);
  
  // Create mesh material with Milky Way texture
  const meshMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      map: milkyWayTexture,
      side: THREE.FrontSide, // Test with front faces first
      transparent: true,
      opacity: 0.8,
    });
    return material;
  }, [milkyWayTexture]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // For testing: position sphere behind camera
      meshRef.current.position.set(0, 0, -50);
      
      // Add subtle rotation based on scroll for dynamic effect
      meshRef.current.rotation.y = scrollProgress * Math.PI * 0.1;
      meshRef.current.rotation.x = scrollVelocity * 0.01;
      
      // Debug logging every 60 frames
      if (Math.floor(state.clock.elapsedTime) % 1 === 0) {
        console.log('Camera position:', state.camera.position);
        console.log('Sphere position:', meshRef.current.position);
        console.log('Scroll progress:', scrollProgress);
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={sphereGeometry}
      material={meshMaterial}
    />
  );
};
