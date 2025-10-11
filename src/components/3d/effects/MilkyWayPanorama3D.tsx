/**
 * Interactive Milky Way Panorama 3D Component
 * Features stereographic projection, mouse interaction, and WebGL rendering
 * Based on ESO's 360-degree Milky Way panorama
 */

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { milkyWayVertexShader, milkyWayFragmentShader, projectionUtils } from '../../../shaders/milkyWayPanorama';

interface MilkyWayPanorama3DProps {
  /** Panorama texture URL - defaults to a placeholder */
  textureUrl?: string;
  /** Initial zoom level */
  initialZoom?: number;
  /** Mouse sensitivity for rotation */
  mouseSensitivity?: number;
  /** Enable/disable mouse interaction */
  interactive?: boolean;
  /** Custom star color */
  starColor?: string;
  /** Star twinkling intensity */
  starIntensity?: number;
  /** Overall brightness */
  brightness?: number;
  /** Contrast level */
  contrast?: number;
  /** Color saturation */
  saturation?: number;
  /** Auto-rotation speed (0 to disable) */
  autoRotate?: number;
  /** Component visibility */
  visible?: boolean;
  /** Custom material uniforms */
  customUniforms?: Record<string, any>;
}

export const MilkyWayPanorama3D: React.FC<MilkyWayPanorama3DProps> = ({
  textureUrl = '/milky-way-panorama.jpg', // You'll need to add this texture
  initialZoom = 1.0,
  mouseSensitivity = 0.002,
  interactive = true,
  starColor = '#ffffff',
  starIntensity = 0.3,
  brightness = 0.0,
  contrast = 1.0,
  saturation = 1.0,
  autoRotate = 0.01,
  visible = true,
  customUniforms = {},
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, camera } = useThree();
  
  // Mouse interaction state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(initialZoom);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Load the Milky Way panorama texture
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    // Try to load the texture, fallback to a generated one if not available
    return new Promise<THREE.Texture>((resolve) => {
      loader.load(
        textureUrl,
        (loadedTexture) => {
          console.log('✅ Milky Way texture loaded successfully:', textureUrl);
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          loadedTexture.flipY = false;
          setIsLoading(false);
          resolve(loadedTexture);
        },
        undefined,
        (error) => {
          console.warn('⚠️ Could not load Milky Way texture, using fallback:', error);
          setHasError(true);
          setIsLoading(false);
          // Create a fallback texture
          const fallbackTexture = createFallbackMilkyWayTexture();
          console.log('🔄 Created fallback texture');
          resolve(fallbackTexture);
        }
      );
    });
  }, [textureUrl]);

  // Create a fallback Milky Way texture if the main one fails to load
  const createFallbackMilkyWayTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Create a gradient background representing the Milky Way
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.3, '#1a1a3a');
    gradient.addColorStop(0.5, '#2a2a5a');
    gradient.addColorStop(0.7, '#1a1a3a');
    gradient.addColorStop(1, '#0a0a1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some star-like noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() > 0.98) {
        const brightness = Math.random() * 255;
        data[i] = brightness;     // R
        data[i + 1] = brightness; // G
        data[i + 2] = brightness; // B
        data[i + 3] = 255;        // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false;
    
    return texture;
  }, []);

  // Shader material uniforms for stereographic projection
  const uniforms = useMemo(() => ({
    u_image: { value: null as THREE.Texture | null },
    u_translate: { value: new THREE.Vector2(size.width / 2, size.height / 2) },
    u_scale: { value: 500 },
    u_rotate: { value: new THREE.Vector2(rotationY, rotationX) },
    u_brightness: { value: brightness },
    u_contrast: { value: contrast },
    u_saturation: { value: saturation },
    ...customUniforms,
  }), [size, rotationX, rotationY, brightness, contrast, saturation, customUniforms]);

  // Mouse event handlers
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive) return;
    
    const x = (event.clientX / size.width) * 2 - 1;
    const y = -(event.clientY / size.height) * 2 + 1;
    
    setMousePosition({ x, y });
    
    if (isMouseDown) {
      const deltaX = x - lastMousePosition.x;
      const deltaY = y - lastMousePosition.y;
      
      setRotationY(prev => prev + deltaX * mouseSensitivity * 10);
      setRotationX(prev => Math.max(-Math.PI/2, Math.min(Math.PI/2, prev + deltaY * mouseSensitivity * 10)));
    }
    
    setLastMousePosition({ x, y });
  }, [interactive, size, isMouseDown, lastMousePosition, mouseSensitivity]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!interactive) return;
    setIsMouseDown(true);
    setLastMousePosition({
      x: (event.clientX / size.width) * 2 - 1,
      y: -(event.clientY / size.height) * 2 + 1,
    });
  }, [interactive, size]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!interactive) return;
    event.preventDefault();
    
    const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5.0, prev * zoomDelta)));
  }, [interactive]);

  // Set up event listeners
  useEffect(() => {
    if (!interactive) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleWheel, interactive]);

  // Load texture and update uniforms
  useEffect(() => {
    texture.then((loadedTexture) => {
      if (materialRef.current) {
        materialRef.current.uniforms.u_image.value = loadedTexture;
        materialRef.current.needsUpdate = true;
      }
    });
  }, [texture]);

  // Update uniforms on state changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_translate.value.set(size.width / 2, size.height / 2);
      materialRef.current.uniforms.u_scale.value = 500 * zoom;
      materialRef.current.uniforms.u_rotate.value.set(rotationY, rotationX);
      materialRef.current.uniforms.u_brightness.value = brightness;
      materialRef.current.uniforms.u_contrast.value = contrast;
      materialRef.current.uniforms.u_saturation.value = saturation;
    }
  }, [size, zoom, rotationX, rotationY, brightness, contrast, saturation]);

  // Animation loop
  useFrame((state) => {
    // Auto-rotation
    if (autoRotate > 0) {
      setRotationY(prev => prev + autoRotate);
    }
  });

  // Don't render if not visible
  if (!visible) return null;

  // Debug logging
  console.log('🌌 MilkyWayPanorama3D rendering:', { 
    visible, 
    isLoading, 
    hasError, 
    textureUrl,
    zoom,
    rotationX,
    rotationY
  });

  return (
    <group>
      {/* Fullscreen quad for stereographic projection */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={milkyWayVertexShader}
          fragmentShader={milkyWayFragmentShader}
          transparent={false}
        />
      </mesh>
      
      {/* Loading indicator */}
      {isLoading && (
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}
      
      {/* Error indicator */}
      {hasError && (
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

// Utility hook for panorama controls
export const useMilkyWayControls = () => {
  const [controls, setControls] = useState({
    brightness: 0.0,
    contrast: 1.0,
    saturation: 1.0,
    starIntensity: 0.3,
    zoom: 1.0,
    autoRotate: 0.01,
  });

  const updateControl = useCallback((key: string, value: number) => {
    setControls(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetControls = useCallback(() => {
    setControls({
      brightness: 0.0,
      contrast: 1.0,
      saturation: 1.0,
      starIntensity: 0.3,
      zoom: 1.0,
      autoRotate: 0.01,
    });
  }, []);

  return { controls, updateControl, resetControls };
};
