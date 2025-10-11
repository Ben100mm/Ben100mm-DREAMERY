/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential.
 * 
 * Procedural Milky Way Background
 * A 3D sphere with procedurally generated galaxy using WebGL shaders
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralMilkyWayProps {
  scrollProgress: number;
  scrollVelocity: number;
}

export const ProceduralMilkyWay: React.FC<ProceduralMilkyWayProps> = ({ 
  scrollProgress, 
  scrollVelocity 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Vertex shader for concave sphere with parallax
  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  // Simplified fragment shader that definitely works
  const fragmentShader = `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uScrollVelocity;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vec3 pos = normalize(vPosition);
      
      // Simple coordinate mapping
      vec2 st = vUv;
      
      // Base colors
      vec3 deepSpace = vec3(0.1, 0.05, 0.2);
      vec3 nebula = vec3(0.5, 0.2, 0.7);
      vec3 brightNebula = vec3(0.8, 0.4, 1.0);
      
      // Simple star field using sine waves
      float stars = 0.0;
      for (int i = 0; i < 3; i++) {
        float freq = 50.0 + float(i) * 30.0;
        float starPattern = sin(st.x * freq) * sin(st.y * freq);
        stars += smoothstep(0.98, 1.0, starPattern);
      }
      
      // Nebula clouds using simple patterns
      float clouds = sin(st.x * 8.0 + uTime) * sin(st.y * 6.0 + uTime * 0.7);
      clouds = smoothstep(0.3, 0.8, clouds);
      
      // Mix colors
      vec3 color = mix(deepSpace, nebula, clouds);
      color += stars * vec3(1.0, 1.0, 1.0);
      
      // Add bright core
      float coreDist = distance(st, vec2(0.5, 0.4));
      float core = 1.0 - smoothstep(0.0, 0.3, coreDist);
      color += core * brightNebula * 0.5;
      
      // Parallax effect
      float parallax = sin(pos.x * 2.0 + uScrollProgress * 3.0) * 0.1;
      color += parallax * vec3(0.2, 0.1, 0.3);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  
  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uScrollProgress: { value: 0.0 },
        uScrollVelocity: { value: 0.0 },
      },
      transparent: true,
      side: THREE.BackSide, // Render inside of sphere
      depthWrite: false,
    });
  }, [vertexShader, fragmentShader]);
  
  // Create sphere geometry for concave effect
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(
      50,   // Radius for pronounced concave effect
      128,  // High resolution for smooth surface
      128
    );
  }, []);
  
  // Animate parallax and update uniforms
  useFrame((state) => {
    if (meshRef.current && material.uniforms) {
      // Update time uniform for animation
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uScrollProgress.value = scrollProgress;
      material.uniforms.uScrollVelocity.value = scrollVelocity;
      
      // Very subtle rotation for parallax effect
      const targetRotationY = -scrollProgress * 0.08;
      const targetRotationX = Math.sin(scrollProgress * 0.3) * 0.04;
      
      // Smooth interpolation
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.03;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.03;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
      renderOrder={-1} // Render in background
    />
  );
};
