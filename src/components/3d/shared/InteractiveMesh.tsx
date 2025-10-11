/**
 * Interactive Mesh Component
 * Base component for interactive 3D objects
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveMeshProps {
  position: [number, number, number];
  geometry: 'box' | 'sphere' | 'torus' | 'cone' | 'cylinder';
  color?: string;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  scale?: number;
  children?: React.ReactNode;
}

export const InteractiveMesh: React.FC<InteractiveMeshProps> = ({
  position,
  geometry,
  color = '#1976d2',
  onClick,
  onHover,
  scale = 1,
  children,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Hover scale effect
      const targetScale = hovered ? scale * 1.2 : scale;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Idle rotation
      if (!clicked) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
    onHover?.(false);
  };

  const handleClick = () => {
    setClicked(!clicked);
    onClick?.();
  };

  const renderGeometry = () => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.7, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.25, 16, 100]} />;
      case 'cone':
        return <coneGeometry args={[0.6, 1.2, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.6, 0.6, 1.2, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {renderGeometry()}
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.3}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      {children}
    </mesh>
  );
};

