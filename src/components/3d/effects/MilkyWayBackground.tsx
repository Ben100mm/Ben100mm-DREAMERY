/**
 * Milky Way and Nebula Background Effect
 * Creates an immersive space background with parallax scrolling effect
 * Gives the feeling of traveling through space towards the Milky Way
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MilkyWayBackgroundProps {
  scrollVelocity?: number;
  scrollProgress?: number;
}

export const MilkyWayBackground: React.FC<MilkyWayBackgroundProps> = ({ 
  scrollVelocity = 0, 
  scrollProgress = 0 
}) => {
  const milkyWayRef = useRef<THREE.Mesh>(null);
  const nebula1Ref = useRef<THREE.Mesh>(null);
  const nebula2Ref = useRef<THREE.Mesh>(null);
  const nebula3Ref = useRef<THREE.Mesh>(null);
  const distantStarsRef = useRef<THREE.Points>(null);

  // Create Milky Way texture programmatically
  const milkyWayTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.5, '#0f3460');
    gradient.addColorStop(0.7, '#16213e');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Milky Way core
    const coreGradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/3);
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    coreGradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.6)');
    coreGradient.addColorStop(0.6, 'rgba(255, 150, 50, 0.4)');
    coreGradient.addColorStop(1, 'rgba(100, 50, 150, 0.2)');
    ctx.fillStyle = coreGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add dust lanes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height/2 + (Math.random() - 0.5) * canvas.height/4;
      const width = 50 + Math.random() * 100;
      const height = 10 + Math.random() * 30;
      ctx.fillRect(x, y, width, height);
    }

    // Add star clusters
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Create nebula textures
  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Create nebula colors
    const colors = [
      'rgba(255, 100, 150, 0.6)', // Pink nebula
      'rgba(100, 150, 255, 0.5)', // Blue nebula
      'rgba(255, 200, 100, 0.4)', // Orange nebula
    ];

    // Create multiple nebula shapes
    for (let c = 0; c < colors.length; c++) {
      ctx.fillStyle = colors[c];
      ctx.beginPath();
      
      // Create organic nebula shape
      const centerX = 100 + Math.random() * 300;
      const centerY = 100 + Math.random() * 300;
      const radius = 50 + Math.random() * 100;
      
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add wispy extensions
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const extX = centerX + Math.cos(angle) * radius * 1.5;
        const extY = centerY + Math.sin(angle) * radius * 1.5;
        ctx.beginPath();
        ctx.arc(extX, extY, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Distant stars
  const distantStars = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position stars in a large sphere around the scene
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 400;
      
      // Random star colors (white to blue-white)
      const colorIntensity = 0.7 + Math.random() * 0.3;
      colors[i * 3] = colorIntensity;
      colors[i * 3 + 1] = colorIntensity;
      colors[i * 3 + 2] = colorIntensity + Math.random() * 0.2;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Animate Milky Way rotation and movement
    if (milkyWayRef.current) {
      milkyWayRef.current.rotation.y = time * 0.01;
      // Move towards camera based on scroll
      milkyWayRef.current.position.z = -800 + scrollProgress * 200;
    }
    
    // Animate nebulae with different speeds for parallax
    if (nebula1Ref.current) {
      nebula1Ref.current.rotation.z = time * 0.02;
      nebula1Ref.current.position.z = -600 + scrollProgress * 150;
      nebula1Ref.current.position.x = Math.sin(time * 0.01) * 20;
    }
    
    if (nebula2Ref.current) {
      nebula2Ref.current.rotation.z = -time * 0.015;
      nebula2Ref.current.position.z = -500 + scrollProgress * 100;
      nebula2Ref.current.position.y = Math.sin(time * 0.008) * 15;
    }
    
    if (nebula3Ref.current) {
      nebula3Ref.current.rotation.z = time * 0.025;
      nebula3Ref.current.position.z = -700 + scrollProgress * 250;
      nebula3Ref.current.position.x = Math.cos(time * 0.012) * 25;
    }
    
    // Animate distant stars
    if (distantStarsRef.current) {
      const positions = distantStarsRef.current.geometry.attributes.position;
      const scrollSpeed = Math.abs(scrollVelocity) * 2;
      
      for (let i = 0; i < positions.count; i++) {
        // Subtle twinkling effect
        positions.array[i * 3 + 1] += Math.sin(time * 2 + i) * 0.001;
        // Move stars towards camera
        positions.array[i * 3 + 2] += (1 + scrollSpeed) * delta * 5;
        
        // Reset stars that go past camera
        if (positions.array[i * 3 + 2] > 50) {
          positions.array[i * 3 + 2] = -400;
        }
      }
      
      positions.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Distant Stars */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={distantStars.positions.length / 3}
            array={distantStars.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={distantStars.colors.length / 3}
            array={distantStars.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Milky Way Background */}
      <mesh ref={milkyWayRef} position={[0, 0, -800]}>
        <planeGeometry args={[400, 200]} />
        <meshBasicMaterial
          map={milkyWayTexture}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nebula 1 - Pink/Red */}
      <mesh ref={nebula1Ref} position={[-50, 20, -600]}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial
          map={nebulaTexture}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nebula 2 - Blue */}
      <mesh ref={nebula2Ref} position={[60, -30, -500]}>
        <planeGeometry args={[100, 60]} />
        <meshBasicMaterial
          map={nebulaTexture}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nebula 3 - Orange */}
      <mesh ref={nebula3Ref} position={[-80, -10, -700]}>
        <planeGeometry args={[80, 100]} />
        <meshBasicMaterial
          map={nebulaTexture}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
