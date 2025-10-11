/**
 * Milky Way Galaxy Background Effect
 * Spiral galaxy far in the background for cosmic atmosphere
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MilkyWayGalaxy: React.FC = () => {
  const galaxyRef = useRef<THREE.Points>(null);
  
  const [positions, colors, scales] = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    
    const colorInside = new THREE.Color('#ff6030');
    const colorOutside = new THREE.Color('#1b3984');
    
    for (let i = 0; i < count; i++) {
      // Spiral galaxy pattern
      const radius = Math.random() * 200 + 100;
      const spinAngle = radius * 0.05;
      const angle = Math.random() * Math.PI * 2 + spinAngle;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 300; // Far away
      
      // Color gradient from center to edge
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / 300);
      
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
      
      scl[i] = Math.random();
    }
    
    return [pos, col, scl];
  }, []);
  
  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <points ref={galaxyRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

