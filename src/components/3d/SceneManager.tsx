/**
 * Scene Manager
 * Manages camera transitions, scroll-based animations, and section visibility
 */

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { ScrollController } from '../../utils/3d/scroll';

interface SceneManagerProps {
  onSectionChange?: (sectionIndex: number) => void;
  onScrollUpdate?: (progress: number, velocity: number) => void;
}

export const SceneManager: React.FC<SceneManagerProps> = ({ onSectionChange, onScrollUpdate }) => {
  const { camera } = useThree();
  const scrollControllerRef = useRef<ScrollController>();
  const previousSectionRef = useRef<number>(0);

  useEffect(() => {
    scrollControllerRef.current = new ScrollController();

    return () => {
      scrollControllerRef.current?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (scrollControllerRef.current) {
      // Update camera based on scroll
      scrollControllerRef.current.updateCamera(camera, delta);

      // Get scroll data for effects
      const scrollProgress = scrollControllerRef.current.getScrollProgress();
      const scrollVelocity = scrollControllerRef.current.getScrollVelocity();
      onScrollUpdate?.(scrollProgress, scrollVelocity);

      // Check if section changed
      const currentSection = scrollControllerRef.current.getCurrentSection();
      if (currentSection !== previousSectionRef.current) {
        previousSectionRef.current = currentSection;
        onSectionChange?.(currentSection);
      }
    }
  });

  return null;
};

