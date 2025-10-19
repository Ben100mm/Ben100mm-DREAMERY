/**
 * Animated Text 3D Component
 * Text with 3D effects and animations
 */

import React, { useRef, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandColors } from '../../../theme/theme';

interface AnimatedText3DProps {
  text: string;
  position: [number, number, number];
  size?: number;
  color?: string;
  animate?: boolean;
}

export const AnimatedText3D: React.FC<AnimatedText3DProps> = ({
  text,
  position,
  size = 1,
  color = brandColors.primary,
  animate = true,
}) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current && animate) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000000"
    >
      {text}
    </Text>
  );
};

