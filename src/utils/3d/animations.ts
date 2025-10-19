/**
 * GSAP Animation Presets for 3D Advertise Page
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animationPresets = {
  // Fly in from left
  flyInLeft: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        delay,
        ease: 'power3.out',
      }
    );
  },

  // Fly in from right
  flyInRight: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        delay,
        ease: 'power3.out',
      }
    );
  },

  // Fly in from top
  flyInTop: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay,
        ease: 'power3.out',
      }
    );
  },

  // Fade in
  fadeIn: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        delay,
        ease: 'power2.inOut',
      }
    );
  },

  // Scale in
  scaleIn: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'back.out(1.7)',
      }
    );
  },

  // Pulsate
  pulsate: (element: HTMLElement | null) => {
    if (!element) return;
    return gsap.to(element, {
      scale: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  },

  // Counter animation
  animateCounter: (
    element: HTMLElement | null,
    start: number,
    end: number,
    duration = 2,
    suffix = ''
  ) => {
    if (!element) return;
    const obj = { value: start };
    return gsap.to(obj, {
      value: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.floor(obj.value).toLocaleString() + suffix;
      },
    });
  },
};

// Mesh animation utilities for Three.js objects
export const meshAnimations = {
  floatY: (position: { y: number }, amplitude = 0.5, speed = 1) => {
    return {
      y: position.y + Math.sin(Date.now() * 0.001 * speed) * amplitude,
    };
  },

  rotateY: (rotation: { y: number }, speed = 0.5) => {
    rotation.y += 0.01 * speed;
  },

  scaleOnHover: (
    scale: { x: number; y: number; z: number },
    targetScale = 1.2,
    speed = 0.1
  ) => {
    const target = targetScale;
    scale.x += (target - scale.x) * speed;
    scale.y += (target - scale.y) * speed;
    scale.z += (target - scale.z) * speed;
  },
};

export { ScrollTrigger };

