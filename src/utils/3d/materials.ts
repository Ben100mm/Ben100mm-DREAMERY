/**
 * Custom Material Configurations for 3D Elements
 */

import * as THREE from 'three';
import { brandColors } from '../../theme/theme';

export const materials = {
  // Glass morphism material
  glassMorphism: new THREE.MeshPhysicalMaterial({
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.3,
    color: new THREE.Color(brandColors.primary),
    envMapIntensity: 1,
    ior: 1.5,
  }),

  // Metallic material
  metallic: new THREE.MeshStandardMaterial({
    metalness: 0.9,
    roughness: 0.1,
    color: new THREE.Color(brandColors.primary),
    emissive: new THREE.Color(brandColors.primary),
    emissiveIntensity: 0.2,
  }),

  // Holographic material
  holographic: new THREE.MeshPhongMaterial({
    color: new THREE.Color(brandColors.primary),
    transparent: true,
    opacity: 0.7,
    shininess: 100,
    specular: new THREE.Color(0xffffff),
  }),

  // Glow material
  glow: (color: string = brandColors.primary) =>
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      side: THREE.BackSide,
    }),

  // Standard colored material
  standard: (color: string = brandColors.primary) =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.3,
      roughness: 0.4,
    }),

  // Emissive material
  emissive: (color: string = brandColors.primary, intensity: number = 0.5) =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      metalness: 0.5,
      roughness: 0.2,
    }),

  // Milky Way panorama material
  milkyWayPanorama: () =>
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: false,
    }),
};

// Color utilities
export const colors = {
  primary: new THREE.Color(brandColors.primary),
  secondary: new THREE.Color(brandColors.secondary || '#64b5f6'),
  accent: new THREE.Color('#ffd700'),
  white: new THREE.Color(0xffffff),
  black: new THREE.Color(0x000000),
};

// Geometry utilities
export const geometries = {
  // Create gradient texture
  createGradientTexture: (color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  },

  // Create noise texture
  createNoiseTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = Math.random() * 255;
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },
};

