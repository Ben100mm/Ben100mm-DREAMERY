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
  
  // Fragment shader with procedural galaxy generation
  const fragmentShader = `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uScrollVelocity;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // Noise function for star field and clouds
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    // Smooth noise
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    // Fractal noise for more complex patterns
    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec3 pos = normalize(vPosition);
      
      // Spherical coordinates for texture mapping
      vec2 spherical = vec2(atan(pos.z, pos.x), acos(pos.y));
      vec2 st = spherical / 6.28318 + 0.5;
      
      // Base deep space colors
      vec3 deepSpace = vec3(0.02, 0.01, 0.08); // Very dark blue
      vec3 nebulaBlue = vec3(0.15, 0.08, 0.25); // Deep purple-blue
      vec3 nebulaPurple = vec3(0.25, 0.12, 0.35); // Rich purple
      vec3 starWhite = vec3(0.95, 0.95, 1.0); // Bright white
      
      // Generate nebula clouds using fractal noise
      float cloudNoise = fbm(st * 2.0 + uTime * 0.1);
      float cloudMask = smoothstep(0.3, 0.8, cloudNoise);
      
      // Create nebula streaks
      float streakNoise = noise(st * 8.0 + vec2(uTime * 0.05, 0.0));
      float streaks = smoothstep(0.4, 0.7, streakNoise) * 0.3;
      
      // Generate star field
      float starNoise = noise(st * 200.0);
      float stars = step(0.998, starNoise);
      
      // Add smaller, dimmer stars
      float starNoise2 = noise(st * 150.0 + 100.0);
      float smallStars = step(0.995, starNoise2) * 0.6;
      
      // Mix nebula colors
      vec3 nebulaColor = mix(nebulaBlue, nebulaPurple, cloudMask + streaks);
      
      // Combine all elements
      vec3 finalColor = mix(deepSpace, nebulaColor, cloudMask + streaks);
      finalColor += stars * starWhite;
      finalColor += smallStars * starWhite * 0.7;
      
      // Add subtle parallax effect based on position
      float parallaxEffect = sin(vPosition.x * 0.5 + uScrollProgress * 2.0) * 0.1;
      finalColor += parallaxEffect * vec3(0.1, 0.05, 0.15);
      
      // Fade edges slightly for depth
      float edgeFade = 1.0 - smoothstep(0.8, 1.0, length(vPosition));
      finalColor *= edgeFade;
      
      gl_FragColor = vec4(finalColor, 0.9);
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
