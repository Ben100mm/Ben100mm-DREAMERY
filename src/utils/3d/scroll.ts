/**
 * Scroll-based Camera Control System with Winding Path
 */

import * as THREE from 'three';

export interface Section {
  id: string;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  index: number;
}

// Each section is 40 units apart in Z-space, creating depth
const SECTION_SPACING = 40;

// Create a winding path through space for cinematic effect
function createWindingPath(): THREE.CatmullRomCurve3 {
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

const windingPath = createWindingPath();

export const sections: Section[] = [
  {
    id: 'hero',
    cameraPosition: new THREE.Vector3(0, 0, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 0,
  },
  {
    id: 'opportunities',
    cameraPosition: new THREE.Vector3(0, 0, -30),
    cameraTarget: new THREE.Vector3(0, 0, -40),
    index: 1,
  },
  {
    id: 'pricing',
    cameraPosition: new THREE.Vector3(0, 0, -70),
    cameraTarget: new THREE.Vector3(0, 0, -80),
    index: 2,
  },
  {
    id: 'samples',
    cameraPosition: new THREE.Vector3(0, 0, -110),
    cameraTarget: new THREE.Vector3(0, 0, -120),
    index: 3,
  },
  {
    id: 'competitive',
    cameraPosition: new THREE.Vector3(0, 0, -150),
    cameraTarget: new THREE.Vector3(0, 0, -160),
    index: 4,
  },
  {
    id: 'contact',
    cameraPosition: new THREE.Vector3(0, 0, -190),
    cameraTarget: new THREE.Vector3(0, 0, -200),
    index: 5,
  },
  {
    id: 'industry',
    cameraPosition: new THREE.Vector3(0, 0, -230),
    cameraTarget: new THREE.Vector3(0, 0, -240),
    index: 6,
  },
  {
    id: 'performance',
    cameraPosition: new THREE.Vector3(0, 0, -270),
    cameraTarget: new THREE.Vector3(0, 0, -280),
    index: 7,
  },
  {
    id: 'integration',
    cameraPosition: new THREE.Vector3(0, 0, -310),
    cameraTarget: new THREE.Vector3(0, 0, -320),
    index: 8,
  },
  {
    id: 'campaign',
    cameraPosition: new THREE.Vector3(0, 0, -350),
    cameraTarget: new THREE.Vector3(0, 0, -360),
    index: 9,
  },
  {
    id: 'geographic',
    cameraPosition: new THREE.Vector3(0, 0, -390),
    cameraTarget: new THREE.Vector3(0, 0, -400),
    index: 10,
  },
  {
    id: 'analytics',
    cameraPosition: new THREE.Vector3(0, 0, -430),
    cameraTarget: new THREE.Vector3(0, 0, -440),
    index: 11,
  },
];

// Helper to get section Z position (where content is located)
export function getSectionZPosition(index: number): number {
  return index * -SECTION_SPACING;
}

// Helper to get section position along the winding path
export function getSectionPathPosition(index: number): THREE.Vector3 {
  const t = index / (sections.length - 1);
  return windingPath.getPointAt(t);
}

// Helper to get dynamic content position that moves toward camera
export function getContentPositionAlongPath(index: number, scrollProgress: number): THREE.Vector3 {
  // Calculate the section's base position on the path
  const sectionT = index / (sections.length - 1);
  const sectionPosition = windingPath.getPointAt(sectionT);
  
  // Calculate current camera position
  const currentT = Math.max(0, Math.min(1, scrollProgress));
  const cameraPosition = windingPath.getPointAt(currentT);
  
  // Calculate how far the camera has progressed past this section
  const progressPastSection = Math.max(0, currentT - sectionT);
  
  // Only move content toward camera if we're past the section
  if (progressPastSection > 0) {
    // Create a vector from section to camera
    const direction = cameraPosition.clone().sub(sectionPosition).normalize();
    
    // Move content toward camera with controlled movement
    const movementDistance = progressPastSection * 15; // Reduced movement speed
    const contentPosition = sectionPosition.clone().add(direction.multiplyScalar(movementDistance));
    
    return contentPosition;
  }
  
  // If camera hasn't reached this section yet, keep content at its base position
  return sectionPosition;
}

// Helper to get section look direction along the winding path
export function getSectionLookDirection(index: number): THREE.Vector3 {
  const t = Math.min(index / (sections.length - 1) + 0.03, 1);
  return windingPath.getPointAt(t);
}

export class ScrollController {
  private currentSection = 0;
  private targetSection = 0;
  private scrollProgress = 0;
  private previousScrollY = 0;
  private scrollVelocity = 0;
  private boundHandleScroll: () => void;
  private velocityResetTimeout: number | null = null;

  constructor() {
    this.boundHandleScroll = this.handleScroll.bind(this);
    this.setupScrollListener();
  }

  private setupScrollListener() {
    window.addEventListener('scroll', this.boundHandleScroll);
  }

  private handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;
    this.scrollProgress = Math.max(0, Math.min(1, scrollY / scrollHeight));
    
    // Calculate scroll velocity for whizzing stars effect
    this.scrollVelocity = (scrollY - this.previousScrollY) / 16; // Normalize to ~60fps
    this.previousScrollY = scrollY;
    
    // Calculate which section we're in
    const sectionProgress = this.scrollProgress * (sections.length - 1);
    this.currentSection = Math.min(
      Math.floor(sectionProgress),
      sections.length - 1
    );
    
    // Reset velocity to 0 when scrolling stops
    if (this.velocityResetTimeout !== null) {
      clearTimeout(this.velocityResetTimeout);
    }
    this.velocityResetTimeout = window.setTimeout(() => {
      this.scrollVelocity = 0;
      this.velocityResetTimeout = null;
    }, 50); // Reset after 50ms of no scrolling
    
    // Debug logging
    console.log(`Scroll: ${scrollY}/${scrollHeight}, Progress: ${this.scrollProgress}, Section: ${this.currentSection}`);
  }

  public updateCamera(
    camera: THREE.Camera,
    delta: number,
    lerpFactor = 0.1
  ) {
    // Get position along the winding curve
    const t = Math.max(0, Math.min(1, this.scrollProgress));
    const targetPosition = windingPath.getPointAt(t);
    
    // Get tangent for look direction
    const lookAheadT = Math.min(t + 0.03, 1);
    const lookAtPoint = windingPath.getPointAt(lookAheadT);
    
    // Smooth camera movement
    camera.position.lerp(targetPosition, lerpFactor);
    
    // Smooth look-at
    const currentLookAt = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .add(camera.position);
    currentLookAt.lerp(lookAtPoint, lerpFactor);
    camera.lookAt(currentLookAt);
  }

  public getCurrentSection(): number {
    return Math.floor(this.currentSection);
  }

  public getScrollProgress(): number {
    return this.scrollProgress;
  }

  public getScrollVelocity(): number {
    return this.scrollVelocity;
  }

  public dispose() {
    window.removeEventListener('scroll', this.boundHandleScroll);
    if (this.velocityResetTimeout !== null) {
      clearTimeout(this.velocityResetTimeout);
    }
  }
}

// Lerp utility
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Smooth scroll to section
export function scrollToSection(sectionId: string) {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return;

  const sectionHeight = window.innerHeight;
  const targetScroll = section.index * sectionHeight;

  window.scrollTo({
    top: targetScroll,
    behavior: 'smooth',
  });
}

