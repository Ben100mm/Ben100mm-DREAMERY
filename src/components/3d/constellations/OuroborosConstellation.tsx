/**
 * Ouroboros Constellation Component
 * Elegant wireframe-style constellation that matches the reference design
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OuroborosConstellationProps {
  visible?: boolean;
  scrollProgress?: number;
  mousePosition?: { x: number; y: number };
}

export const OuroborosConstellation: React.FC<OuroborosConstellationProps> = ({
  visible = true,
  scrollProgress = 0,
  mousePosition = { x: 0, y: 0 }
}) => {
  const constellationRef = useRef<THREE.Group>(null);
  
  // Create ouroboros curve points
  const ouroborosPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      
      // Create ouroboros shape - a snake eating its tail
      const radius = 2.5;
      const x = Math.cos(t) * radius + Math.cos(t * 3) * 0.3;
      const y = Math.sin(t) * radius + Math.sin(t * 2) * 0.4;
      const z = Math.sin(t * 4) * 0.2;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    return points;
  }, []);
  
  // Create constellation nodes (bright points)
  const nodePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const nodeCount = 12;
    
    for (let i = 0; i < nodeCount; i++) {
      const t = (i / nodeCount) * Math.PI * 2;
      const radius = 2.5;
      const x = Math.cos(t) * radius + Math.cos(t * 3) * 0.3;
      const y = Math.sin(t) * radius + Math.sin(t * 2) * 0.4;
      const z = Math.sin(t * 4) * 0.2;
      
      positions.push(new THREE.Vector3(x, y, z));
    }
    
    return positions;
  }, []);
  
  useFrame((state, delta) => {
    if (constellationRef.current && visible) {
      // Subtle rotation based on time
      constellationRef.current.rotation.z += delta * 0.1;
      
      // Mouse influence on position
      const mouseInfluence = 0.3;
      constellationRef.current.position.x = mousePosition.x * mouseInfluence;
      constellationRef.current.position.y = mousePosition.y * mouseInfluence * 0.5;
      
      // Scroll-based scale and opacity
      const scale = 1 + scrollProgress * 0.2;
      constellationRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group ref={constellationRef} visible={visible} position={[4, 0, 0]}>
      {/* Main ouroboros curve */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={ouroborosPoints.length}
            array={new Float32Array(ouroborosPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.8}
          linewidth={2}
        />
      </line>
      
      {/* Constellation nodes */}
      {nodePositions.map((position, index) => (
        <mesh key={index} position={[position.x, position.y, position.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial
            color={index % 3 === 0 ? "#ffffff" : index % 3 === 1 ? "#64b5f6" : "#ffd700"}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Glowing center point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Outer glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};
