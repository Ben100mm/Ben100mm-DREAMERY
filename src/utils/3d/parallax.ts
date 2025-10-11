/**
 * Parallax Calculation Utilities
 * Calculate sphere offset for concave Milky Way background based on camera path movement
 */

import * as THREE from 'three';

// Create the winding path for parallax calculations (same as in scroll.ts)
function createParallaxWindingPath(): THREE.CatmullRomCurve3 {
  const waypoints = [
    new THREE.Vector3(0, 0, 10),        // Section 0: Hero (start)
    new THREE.Vector3(3, 1, -30),       // Section 1: Curve right, slight up
    new THREE.Vector3(-2, 2, -70),      // Section 2: Curve left, up
    new THREE.Vector3(4, 0, -110),      // Section 3: Curve right, level
    new THREE.Vector3(-3, -1, -150),    // Section 4: Curve left, slight down
    new THREE.Vector3(0, 1, -190),      // Section 5: Center, up
    new THREE.Vector3(5, 2, -230),      // Section 6: Curve right, up
    new THREE.Vector3(-4, 0, -270),     // Section 7: Curve left, level
    new THREE.Vector3(2, -2, -310),     // Section 8: Curve right, down
    new THREE.Vector3(-1, 1, -350),     // Section 9: Curve left, up
    new THREE.Vector3(3, -1, -390),     // Section 10: Curve right, down
    new THREE.Vector3(0, 0, -430),      // Section 11: Center, level (end)
  ];
  
  return new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5);
}

const parallaxWindingPath = createParallaxWindingPath();

/**
 * Calculate parallax offset for the Milky Way background sphere
 * Creates inverse movement effect - camera goes right, sphere shifts left
 * 
 * @param scrollProgress - Progress along scroll path (0-1)
 * @param parallaxFactor - How strong the parallax effect should be (0.3-0.5 recommended)
 * @returns Vector3 offset for sphere position
 */
export function calculateMilkyWayParallaxOffset(
  scrollProgress: number, 
  parallaxFactor: number = 0.4
): THREE.Vector3 {
  // Get current camera position on the winding path
  const t = Math.max(0, Math.min(1, scrollProgress));
  const currentPosition = parallaxWindingPath.getPointAt(t);
  
  // Get the tangent (direction) at current position
  const tangent = parallaxWindingPath.getTangentAt(t);
  
  // Calculate the offset by taking the opposite direction
  // Camera movement in X/Y should cause sphere to shift in opposite direction
  const offsetX = -currentPosition.x * parallaxFactor;
  const offsetY = -currentPosition.y * parallaxFactor;
  const offsetZ = 0; // Keep Z position stable
  
  return new THREE.Vector3(offsetX, offsetY, offsetZ);
}

/**
 * Get the current camera position on the winding path
 * 
 * @param scrollProgress - Progress along scroll path (0-1)
 * @returns Vector3 current camera position
 */
export function getCurrentCameraPosition(scrollProgress: number): THREE.Vector3 {
  const t = Math.max(0, Math.min(1, scrollProgress));
  return parallaxWindingPath.getPointAt(t);
}

/**
 * Get the camera's look direction along the winding path
 * 
 * @param scrollProgress - Progress along scroll path (0-1)
 * @returns Vector3 look direction
 */
export function getCameraLookDirection(scrollProgress: number): THREE.Vector3 {
  const t = Math.max(0, Math.min(1, scrollProgress));
  const lookAheadT = Math.min(t + 0.03, 1);
  return parallaxWindingPath.getPointAt(lookAheadT);
}

/**
 * Calculate UV offset for texture based on camera movement
 * This can be used in the shader to create subtle texture parallax
 * 
 * @param scrollProgress - Progress along scroll path (0-1)
 * @param uvFactor - How much the texture should shift (0.1-0.3 recommended)
 * @returns Vector2 UV offset
 */
export function calculateTextureUVOffset(
  scrollProgress: number, 
  uvFactor: number = 0.15
): THREE.Vector2 {
  const currentPosition = getCurrentCameraPosition(scrollProgress);
  
  // Map camera position to UV coordinates (normalized)
  const uvX = (currentPosition.x / 10) * uvFactor; // Normalize X movement
  const uvY = (currentPosition.y / 10) * uvFactor; // Normalize Y movement
  
  return new THREE.Vector2(uvX, uvY);
}
