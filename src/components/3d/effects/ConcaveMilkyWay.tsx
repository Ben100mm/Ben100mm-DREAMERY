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
  
  // Create small sphere geometry for testing
  const sphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(5, 16, 16);
    // Small sphere for testing
    return geometry;
  }, []);
  
  // Create mesh material with solid color for testing
  const meshMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: '#ff0000', // Bright red for testing
      side: THREE.FrontSide,
      transparent: false,
    });
    return material;
  }, []);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // For testing: position small sphere in front of camera
      meshRef.current.position.set(0, 0, 5);
      
      // Add rotation for visibility
      meshRef.current.rotation.y += delta;
      
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
