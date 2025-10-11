/**
 * Glow Effect Component
 * Adds a glow effect to any mesh
 */

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { glowVertexShader, glowFragmentShader } from '../../../shaders/glow.glsl';

interface GlowEffectProps {
  color?: string;
  intensity?: number;
  power?: number;
  scale?: number;
  children?: React.ReactNode;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  color = '#1976d2',
  intensity = 1.0,
  power = 3.0,
  scale = 1.1,
  children,
}) => {
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        power: { value: power },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
  }, [color, intensity, power]);

  return (
    <group>
      {/* Render children (the main mesh) */}
      {children}
      
      {/* Render glow mesh slightly larger */}
      <mesh scale={[scale, scale, scale]} material={glowMaterial}>
        {/* Clone geometry from children if possible */}
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
};

