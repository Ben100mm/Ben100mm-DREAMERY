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

export const sections: Section[] = [
  {
    id: 'hero',
    cameraPosition: new THREE.Vector3(0, 0, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 0,
  },
  {
    id: 'opportunities',
    cameraPosition: new THREE.Vector3(5, 2, 12),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 1,
  },
  {
    id: 'pricing',
    cameraPosition: new THREE.Vector3(-5, 1, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 2,
  },
  {
    id: 'features',
    cameraPosition: new THREE.Vector3(0, 4, 12),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 3,
  },
  {
    id: 'audience',
    cameraPosition: new THREE.Vector3(3, -2, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 4,
  },
  {
    id: 'testimonials',
    cameraPosition: new THREE.Vector3(-4, 1, 11),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 5,
  },
  {
    id: 'samples',
    cameraPosition: new THREE.Vector3(0, -3, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 6,
  },
  {
    id: 'competitive',
    cameraPosition: new THREE.Vector3(6, 0, 12),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 7,
  },
  {
    id: 'onboarding',
    cameraPosition: new THREE.Vector3(-3, 3, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 8,
  },
  {
    id: 'compliance',
    cameraPosition: new THREE.Vector3(0, 0, 15),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 9,
  },
  {
    id: 'faq',
    cameraPosition: new THREE.Vector3(4, 2, 11),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 10,
  },
  {
    id: 'contact',
    cameraPosition: new THREE.Vector3(-5, 0, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 11,
  },
  {
    id: 'tech-specs',
    cameraPosition: new THREE.Vector3(0, 5, 12),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 12,
  },
  {
    id: 'industry',
    cameraPosition: new THREE.Vector3(5, -1, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 13,
  },
  {
    id: 'performance',
    cameraPosition: new THREE.Vector3(-4, 2, 11),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 14,
  },
  {
    id: 'integration',
    cameraPosition: new THREE.Vector3(3, 0, 13),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 15,
  },
  {
    id: 'campaign',
    cameraPosition: new THREE.Vector3(-2, -2, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 16,
  },
  {
    id: 'content',
    cameraPosition: new THREE.Vector3(0, 3, 11),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 17,
  },
  {
    id: 'geographic',
    cameraPosition: new THREE.Vector3(6, 1, 12),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 18,
  },
  {
    id: 'analytics',
    cameraPosition: new THREE.Vector3(0, 0, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    index: 19,
  },
];

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
    
    // Debug logging (remove after testing)
    if (scrollY % 100 < 10) { // Log occasionally to avoid spam
      console.log('[ScrollController]', {
        scrollY,
        scrollHeight,
        progress: this.scrollProgress,
        targetSection: this.targetSection
      });
    }
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

