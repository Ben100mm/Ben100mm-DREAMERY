/**
 * Concave Milky Way Background
 * 3D inverted sphere with Milky Way texture and dynamic parallax movement
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { calculateMilkyWayParallaxOffset, getCurrentCameraPosition, calculateTextureUVOffset } from '../../../utils/3d/parallax';

// Custom shader material for the concave Milky Way effect
const MilkyWayShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTexture: null,
    uTime: 0,
    uScrollProgress: 0,
    uParallaxOffset: new THREE.Vector3(0, 0, 0),
    uUVOffset: new THREE.Vector2(0, 0),
    uOpacity: 0.4,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    uniform vec3 uParallaxOffset;
    uniform float uTime;
    uniform float uScrollProgress;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      // Apply parallax offset to vertex position
      vec3 offsetPosition = position + uParallaxOffset * 0.1;
      
      // Add subtle concave distortion based on distance from center
      float distanceFromCenter = length(position.xz);
      float concaveFactor = 1.0 + (distanceFromCenter * 0.0001);
      
      offsetPosition *= concaveFactor;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uScrollProgress;
    uniform vec2 uUVOffset;
    uniform float uOpacity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      // Calculate UV coordinates with parallax offset
      vec2 uv = vUv + uUVOffset;
      
      // Apply subtle animation to UV coordinates
      uv += sin(uTime * 0.1) * 0.001;
      
      // Sample the Milky Way texture
      vec4 textureColor = texture2D(uTexture, uv);
      
      // Add subtle vignette effect for depth
      float distanceFromCenter = length(vUv - 0.5);
      float vignette = 1.0 - smoothstep(0.3, 0.8, distanceFromCenter);
      
      // Apply color grading for space effect
      vec3 color = textureColor.rgb;
      
      // Enhance the galactic colors
      color.r = pow(color.r, 1.1);
      color.g = pow(color.g, 0.9);
      color.b = pow(color.b, 1.2);
      
      // Apply vignette and opacity
      color *= vignette;
      float alpha = textureColor.a * uOpacity * vignette;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

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
  const materialRef = useRef<any>(null);
  const timeRef = useRef(0);
  
  // Load the Milky Way texture
  const milkyWayTexture = useTexture('/milky-way-background.jpg');
  
  // Create inverted sphere geometry (inside faces visible)
  const sphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(250, 64, 64);
    // Flip faces to make inside visible
    geometry.scale(-1, 1, 1);
    return geometry;
  }, []);
  
  // Create the shader material
  const shaderMaterial = useMemo(() => {
    const material = new MilkyWayShaderMaterial();
    material.transparent = true;
    material.side = THREE.BackSide; // Render back faces for inside view
    material.uniforms.uTexture.value = milkyWayTexture;
    return material;
  }, [milkyWayTexture]);
  
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Update time uniform for subtle animation
      timeRef.current += delta;
      materialRef.current.uniforms.uTime.value = timeRef.current;
      
      // Update scroll progress uniform
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
      
      // Calculate parallax offset based on camera movement
      const parallaxOffset = calculateMilkyWayParallaxOffset(scrollProgress, parallaxFactor);
      materialRef.current.uniforms.uParallaxOffset.value = parallaxOffset;
      
      // Calculate texture UV offset for subtle parallax
      const uvOffset = calculateTextureUVOffset(scrollProgress, 0.15);
      materialRef.current.uniforms.uUVOffset.value = uvOffset;
      
      // Update sphere position with parallax offset
      const currentCameraPosition = getCurrentCameraPosition(scrollProgress);
      meshRef.current.position.copy(parallaxOffset);
      
      // Add subtle rotation based on scroll for dynamic effect
      meshRef.current.rotation.y = scrollProgress * Math.PI * 0.1;
      meshRef.current.rotation.x = scrollVelocity * 0.01;
    }
  });
  
  return (
    <mesh
      ref={(mesh) => {
        meshRef.current = mesh;
        if (mesh) {
          materialRef.current = mesh.material;
        }
      }}
      geometry={sphereGeometry}
      material={shaderMaterial}
      renderOrder={-1} // Render first as background
    />
  );
};
