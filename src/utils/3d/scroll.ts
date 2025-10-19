/**
 * Scroll-based Camera Control System
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
    id: 'features',
    cameraPosition: new THREE.Vector3(0, 0, -110),
    cameraTarget: new THREE.Vector3(0, 0, -120),
    index: 3,
  },
  {
    id: 'audience',
    cameraPosition: new THREE.Vector3(0, 0, -150),
    cameraTarget: new THREE.Vector3(0, 0, -160),
    index: 4,
  },
  {
    id: 'testimonials',
    cameraPosition: new THREE.Vector3(0, 0, -190),
    cameraTarget: new THREE.Vector3(0, 0, -200),
    index: 5,
  },
  {
    id: 'samples',
    cameraPosition: new THREE.Vector3(0, 0, -230),
    cameraTarget: new THREE.Vector3(0, 0, -240),
    index: 6,
  },
  {
    id: 'competitive',
    cameraPosition: new THREE.Vector3(0, 0, -270),
    cameraTarget: new THREE.Vector3(0, 0, -280),
    index: 7,
  },
  {
    id: 'onboarding',
    cameraPosition: new THREE.Vector3(0, 0, -310),
    cameraTarget: new THREE.Vector3(0, 0, -320),
    index: 8,
  },
  {
    id: 'compliance',
    cameraPosition: new THREE.Vector3(0, 0, -350),
    cameraTarget: new THREE.Vector3(0, 0, -360),
    index: 9,
  },
  {
    id: 'faq',
    cameraPosition: new THREE.Vector3(0, 0, -390),
    cameraTarget: new THREE.Vector3(0, 0, -400),
    index: 10,
  },
  {
    id: 'contact',
    cameraPosition: new THREE.Vector3(0, 0, -430),
    cameraTarget: new THREE.Vector3(0, 0, -440),
    index: 11,
  },
  {
    id: 'tech-specs',
    cameraPosition: new THREE.Vector3(0, 0, -470),
    cameraTarget: new THREE.Vector3(0, 0, -480),
    index: 12,
  },
  {
    id: 'industry',
    cameraPosition: new THREE.Vector3(0, 0, -510),
    cameraTarget: new THREE.Vector3(0, 0, -520),
    index: 13,
  },
  {
    id: 'performance',
    cameraPosition: new THREE.Vector3(0, 0, -550),
    cameraTarget: new THREE.Vector3(0, 0, -560),
    index: 14,
  },
  {
    id: 'integration',
    cameraPosition: new THREE.Vector3(0, 0, -590),
    cameraTarget: new THREE.Vector3(0, 0, -600),
    index: 15,
  },
  {
    id: 'campaign',
    cameraPosition: new THREE.Vector3(0, 0, -630),
    cameraTarget: new THREE.Vector3(0, 0, -640),
    index: 16,
  },
  {
    id: 'content',
    cameraPosition: new THREE.Vector3(0, 0, -670),
    cameraTarget: new THREE.Vector3(0, 0, -680),
    index: 17,
  },
  {
    id: 'geographic',
    cameraPosition: new THREE.Vector3(0, 0, -710),
    cameraTarget: new THREE.Vector3(0, 0, -720),
    index: 18,
  },
  {
    id: 'analytics',
    cameraPosition: new THREE.Vector3(0, 0, -750),
    cameraTarget: new THREE.Vector3(0, 0, -760),
    index: 19,
  },
];

// Helper to get section Z position (where content is located)
export function getSectionZPosition(index: number): number {
  return index * -SECTION_SPACING;
}

export class ScrollController {
  private currentSection = 0;
  private targetSection = 0;
  private scrollProgress = 0;
  private boundHandleScroll: () => void;

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
    this.scrollProgress = scrollY / scrollHeight;
    
    // Calculate which section we're in
    const sectionProgress = this.scrollProgress * (sections.length - 1);
    this.targetSection = Math.min(
      Math.floor(sectionProgress),
      sections.length - 1
    );
  }

  public updateCamera(
    camera: THREE.Camera,
    delta: number,
    lerpFactor = 0.05
  ) {
    if (this.targetSection !== this.currentSection) {
      this.currentSection += (this.targetSection - this.currentSection) * lerpFactor;
    }

    const sectionIndex = Math.floor(this.currentSection);
    const nextSectionIndex = Math.min(sectionIndex + 1, sections.length - 1);
    const progress = this.currentSection - sectionIndex;

    const currentSectionData = sections[sectionIndex];
    const nextSectionData = sections[nextSectionIndex];

    // Lerp camera position
    camera.position.lerpVectors(
      currentSectionData.cameraPosition,
      nextSectionData.cameraPosition,
      progress
    );

    // Lerp camera target (lookAt)
    const targetPosition = new THREE.Vector3();
    targetPosition.lerpVectors(
      currentSectionData.cameraTarget,
      nextSectionData.cameraTarget,
      progress
    );
    camera.lookAt(targetPosition);
  }

  public getCurrentSection(): number {
    return Math.floor(this.currentSection);
  }

  public getScrollProgress(): number {
    return this.scrollProgress;
  }

  public dispose() {
    window.removeEventListener('scroll', this.boundHandleScroll);
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

