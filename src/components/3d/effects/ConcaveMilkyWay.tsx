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
  
  // Debug component mounting
  React.useEffect(() => {
    console.log('ConcaveMilkyWay component mounted');
    return () => console.log('ConcaveMilkyWay component unmounted');
  }, []);
  
  // Load the Milky Way texture with error handling
  const milkyWayTexture = useTexture('/milky-way-background.jpg');
  
  // Debug texture loading
  React.useEffect(() => {
    if (milkyWayTexture) {
      console.log('Milky Way texture loaded successfully');
    } else {
      console.error('Milky Way texture failed to load');
    }
  }, [milkyWayTexture]);
  
  // Create normal sphere geometry for debugging
  const sphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(50, 32, 32);
    // Remove scaling for debugging
    return geometry;
  }, []);
  
  // Create a simple mesh material for debugging - bright red to test visibility
  const meshMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: '#ff0000', // Bright red for testing
      side: THREE.DoubleSide, // Render both sides
      transparent: false,
      opacity: 1.0,
    });
    return material;
  }, []);
  
  useFrame((state, delta) => {
    // Debug logging every 60 frames
    if (Math.floor(state.clock.elapsedTime) % 1 === 0) {
      console.log('useFrame called - sphere should be rendering');
    }
    
    if (meshRef.current) {
      // For debugging: position sphere at origin first
      meshRef.current.position.set(0, 0, 0);
      
      // Add subtle rotation based on scroll for dynamic effect
      meshRef.current.rotation.y = scrollProgress * Math.PI * 0.1;
      meshRef.current.rotation.x = scrollVelocity * 0.01;
      
      // Debug logging
      if (scrollProgress > 0.1 && scrollProgress < 0.2) {
        console.log('Sphere at origin for debugging');
      }
    } else {
      console.log('meshRef.current is null - sphere not created');
    }
  });
  
  return (
    <>
      {/* Test with a simple box first */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      
      {/* Original sphere */}
      <mesh
        ref={meshRef}
        geometry={sphereGeometry}
        material={meshMaterial}
        position={[0, 0, -20]}
      />
    </>
  );
};
