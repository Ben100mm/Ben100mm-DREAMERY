/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential.
 * 
 * Immersive 3D Advertising Page
 * Full-page 3D canvas with 12 comprehensive advertising sections and constant Milky Way backdrop
 */

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';

// Core components
import { SceneManager } from '../components/3d/SceneManager';

// Visual effects
import { EnhancedStarField } from '../components/3d/effects/EnhancedStarField';

// Section components - 12 focused sections
import { HeroSection3D } from '../components/3d/sections/HeroSection3D';
import { OpportunitiesSection3D } from '../components/3d/sections/OpportunitiesSection3D';
import { PricingSection3D } from '../components/3d/sections/PricingSection3D';
import { SampleAdsSection3D } from '../components/3d/sections/SampleAdsSection3D';
import { CompetitiveAdvantagesSection3D } from '../components/3d/sections/CompetitiveAdvantagesSection3D';
import { ContactSection3D } from '../components/3d/sections/ContactSection3D';
import { IndustryFocusSection3D } from '../components/3d/sections/IndustryFocusSection3D';
import { PerformanceMetricsSection3D } from '../components/3d/sections/PerformanceMetricsSection3D';
import { IntegrationSection3D } from '../components/3d/sections/IntegrationSection3D';
import { CampaignManagementSection3D } from '../components/3d/sections/CampaignManagementSection3D';
import { GeographicTargetingSection3D } from '../components/3d/sections/GeographicTargetingSection3D';
import { AnalyticsReportingSection3D } from '../components/3d/sections/AnalyticsReportingSection3D';
// MilkyWaySection3D removed - using constant backdrop instead
import { WhizzingStars } from '../components/3d/effects/WhizzingStars';

/**
 * Scene Content Component
 * Contains all 3D elements, lighting, and 12 focused sections
 */
const SceneContent: React.FC<{ 
  currentSection: number; 
  onSectionChange: (section: number) => void;
  onScrollUpdate: (progress: number, velocity: number, mousePosition?: { x: number; y: number }) => void;
  scrollVelocity: number;
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}> = ({ currentSection, onSectionChange, onScrollUpdate, scrollVelocity, scrollProgress, mousePosition }) => {
  return (
    <>
      {/* Camera - controlled by SceneManager based on scroll */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />

      {/* Milky Way Panorama removed */}

      {/* Whizzing Stars - Only active during scroll */}
      <WhizzingStars 
        visible={true}
        scrollVelocity={scrollVelocity}
        scrollProgress={scrollProgress}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#64b5f6" />
      <pointLight position={[5, 0, 5]} intensity={0.3} color="#90caf9" />

      {/* Test sphere removed */}

      {/* Scene Manager - handles camera transitions */}
      <SceneManager 
        onSectionChange={onSectionChange}
        onScrollUpdate={onScrollUpdate}
      />

      {/* 12 Focused Sections - Only render nearby sections for performance */}
      {/* Section 0: Hero - Introduction */}
      {Math.abs(currentSection - 0) <= 1 && <HeroSection3D visible={currentSection === 0} sectionIndex={0} scrollProgress={scrollProgress} mousePosition={mousePosition} />}
      
      {/* Section 1: Opportunities - Advertising opportunities for different users */}
      {Math.abs(currentSection - 1) <= 1 && <OpportunitiesSection3D visible={currentSection === 1} sectionIndex={1} scrollProgress={scrollProgress} />}
      
      {/* Section 2: Pricing - Pricing plans */}
      {Math.abs(currentSection - 2) <= 1 && <PricingSection3D visible={currentSection === 2} sectionIndex={2} scrollProgress={scrollProgress} />}
      
      {/* Section 3: Sample Ads - Ad examples */}
      {Math.abs(currentSection - 3) <= 1 && <SampleAdsSection3D visible={currentSection === 3} sectionIndex={3} scrollProgress={scrollProgress} />}
      
      {/* Section 4: Competitive Advantages - Why choose this platform */}
      {Math.abs(currentSection - 4) <= 1 && <CompetitiveAdvantagesSection3D visible={currentSection === 4} sectionIndex={4} scrollProgress={scrollProgress} />}
      
      {/* Section 5: Contact - Contact information */}
      {Math.abs(currentSection - 5) <= 1 && <ContactSection3D visible={currentSection === 5} sectionIndex={5} scrollProgress={scrollProgress} />}
      
      {/* Section 6: Industry Focus - Industry-specific information */}
      {Math.abs(currentSection - 6) <= 1 && <IndustryFocusSection3D visible={currentSection === 6} sectionIndex={6} scrollProgress={scrollProgress} />}
      
      {/* Section 7: Performance Metrics - Performance data */}
      {Math.abs(currentSection - 7) <= 1 && <PerformanceMetricsSection3D visible={currentSection === 7} sectionIndex={7} scrollProgress={scrollProgress} />}
      
      {/* Section 8: Integration - Integration capabilities */}
      {Math.abs(currentSection - 8) <= 1 && <IntegrationSection3D visible={currentSection === 8} sectionIndex={8} scrollProgress={scrollProgress} />}
      
      {/* Section 9: Campaign Management - Campaign tools */}
      {Math.abs(currentSection - 9) <= 1 && <CampaignManagementSection3D visible={currentSection === 9} sectionIndex={9} scrollProgress={scrollProgress} />}
      
      {/* Section 10: Geographic Targeting - Location targeting */}
      {Math.abs(currentSection - 10) <= 1 && <GeographicTargetingSection3D visible={currentSection === 10} sectionIndex={10} scrollProgress={scrollProgress} />}
      
      {/* Section 11: Analytics & Reporting - Analytics features */}
      {Math.abs(currentSection - 11) <= 1 && <AnalyticsReportingSection3D visible={currentSection === 11} sectionIndex={11} scrollProgress={scrollProgress} />}
      
      {/* Section 12: Final section - Clean content (Milky Way is already constant background) */}
      {/* No additional content needed - Milky Way panorama is the constant backdrop */}
    </>
  );
};

/**
 * Loading Fallback Component
 */
const LoadingFallback: React.FC = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      zIndex: 9999,
    }}
  >
    <Box sx={{ textAlign: 'center', color: 'white' }}>
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Box sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
        Loading 3D Experience...
      </Box>
    </Box>
  </Box>
);

/**
 * Main Advertise3D Page Component
 */
const Advertise3DPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  
  // Milky Way controls removed
  
  // Debug logging
  console.log('Current section:', currentSection, 'Total sections: 6 (0-5)');
  console.log('Scroll velocity:', scrollVelocity, 'Stars should whizz when > 0');
  console.log('🌌 Milky Way panorama is constant backdrop across all sections');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [scrollAttempts, setScrollAttempts] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const currentSectionRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const targetSectionRef = useRef(0);
  const scrollAttemptsRef = useRef(0);
  const lastScrollDirectionRef = useRef<'up' | 'down' | null>(null);
  
  // Keep refs in sync with state
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);
  
  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  // Custom scroll control with 2-second transitions
  useEffect(() => {
    // Hide scrollbar
    const style = document.createElement('style');
    style.id = 'scroll-styles';
    style.textContent = `
      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        display: none;
      }
      html,
      body {
        -ms-overflow-style: none;
        scrollbar-width: none;
        scroll-behavior: auto;
      }
    `;
    document.head.appendChild(style);
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) {
        return;
      }

      // Determine scroll direction: positive deltaY = scrolling down, negative = scrolling up
      const scrollingDown = e.deltaY > 0;
      const direction = scrollingDown ? 1 : -1;
      const current = currentSectionRef.current;
      const nextSection = Math.max(0, Math.min(5, current + direction));
      
      // Check if direction changed - reset attempts if so
      const currentDirection = scrollingDown ? 'down' : 'up';
      if (lastScrollDirectionRef.current !== currentDirection) {
        scrollAttemptsRef.current = 0;
        setScrollAttempts(0);
        lastScrollDirectionRef.current = currentDirection;
      }
      
      // Only proceed if we're moving to a different section
      if (nextSection !== current) {
        scrollAttemptsRef.current += 1;
        setScrollAttempts(scrollAttemptsRef.current);
        
        console.log(`Scroll attempt ${scrollAttemptsRef.current}/2: ${scrollingDown ? 'down' : 'up'} from section ${current} to ${nextSection}`);
        
        // Require 2 attempts to move to next section
        if (scrollAttemptsRef.current < 2) {
          console.log(`Need ${2 - scrollAttemptsRef.current} more scroll attempt(s) to move to section ${nextSection}`);
          return;
        }
        
        // Reset attempts after successful section change
        scrollAttemptsRef.current = 0;
        setScrollAttempts(0);
        lastScrollDirectionRef.current = null;
        
        console.log(`✓ Two scroll attempts completed. Moving from section ${current} to ${nextSection}`);
        
        isScrollingRef.current = true; // Update ref immediately
        setIsScrolling(true);
        currentSectionRef.current = nextSection; // Update ref immediately
        targetSectionRef.current = nextSection;
        
        // Smooth scroll to next section over 2 seconds
        const targetY = nextSection * window.innerHeight;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease-in-out function for smooth animation
          const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          window.scrollTo(0, startY + distance * easeProgress);
          
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            // Animation complete - update state and unlock scrolling
            console.log(`✓ Scroll animation complete. Now at section ${nextSection}`);
            setCurrentSection(nextSection);
            isScrollingRef.current = false;
            setIsScrolling(false);
          }
        };
        
        requestAnimationFrame(animateScroll);
      } else {
        console.log(`Already at section ${current}, not scrolling`);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Set loading complete after initial render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', handleWheel);
      const styleEl = document.getElementById('scroll-styles');
      if (styleEl) styleEl.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - we use refs to avoid stale closures

  // Section change handler (called by SceneManager)
  const handleSectionChange = (section: number) => {
    // Only update if we're not in manual scroll mode
    if (!isScrollingRef.current) {
      console.log(`SceneManager wants to change to section ${section}`);
      setCurrentSection(section);
      currentSectionRef.current = section;
    }
  };

  // Scroll update handler (called by SceneManager)
  const handleScrollUpdate = (progress: number, velocity: number, mousePos?: { x: number; y: number }) => {
    setScrollVelocity(velocity);
    setScrollProgress(progress);
    if (mousePos) {
      setMousePosition(mousePos);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: '#000',
        }}
      >
        {/* Background removed - using 3D Milky Way panorama instead */}
        {/* Scrollable sections - 6 main sections with programmatic scroll control */}
        {[0, 1, 2, 3, 4, 5].map((sectionIndex) => (
          <Box
            key={sectionIndex}
            id={`section-${sectionIndex}`}
            sx={{
              height: '100vh',
              width: '100%',
            }}
          />
        ))}

        {/* Loading Screen */}
        {isLoading && <LoadingFallback />}

        {/* Fixed Full-Page Canvas */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: 'transparent',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 10], fov: 75 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <SceneContent
                currentSection={currentSection}
                onSectionChange={handleSectionChange}
                onScrollUpdate={handleScrollUpdate}
                scrollVelocity={scrollVelocity}
                scrollProgress={scrollProgress}
                mousePosition={mousePosition}
              />
            </Suspense>
          </Canvas>
        </Box>

        {/* Elegant UI Elements - Scroll Indicators and Controls */}
        <Box
          sx={{
            position: 'fixed',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Scroll Indicator */}
          <Box
            sx={{
              width: '40px',
              height: '60px',
              border: '2px solid #64b5f6',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(100, 181, 246, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '8px solid #64b5f6',
                mb: 1,
              }}
            />
            <Box
              sx={{
                width: '2px',
                height: '8px',
                backgroundColor: '#64b5f6',
              }}
            />
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid #64b5f6',
                mt: 1,
              }}
            />
          </Box>
          
          {/* Scroll Attempt Indicator */}
          {scrollAttempts > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 2,
                p: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                sx={{
                  fontSize: '12px',
                  color: '#64b5f6',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                Scroll {scrollAttempts}/2
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[1, 2].map((attempt) => (
                  <Box
                    key={attempt}
                    sx={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: attempt <= scrollAttempts ? '#64b5f6' : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Section Progress Indicator */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((section) => (
              <Box
                key={section}
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: section === currentSection ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#64b5f6',
                    transform: 'scale(1.2)',
                  },
                }}
                onClick={() => {
                  const targetY = section * window.innerHeight;
                  window.scrollTo({
                    top: targetY,
                    behavior: 'smooth',
                  });
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Volume Control - Bottom Left */}
        <Box
          sx={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 20,
          }}
        >
          <Box
            sx={{
              width: '48px',
              height: '48px',
              border: '2px solid #ffd700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Box
              sx={{
                width: '20px',
                height: '20px',
                position: 'relative',
              }}
            >
              {/* Speaker Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '4px',
                  top: '6px',
                  width: 0,
                  height: 0,
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRight: '8px solid #ffd700',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: '2px',
                  top: '4px',
                  width: '6px',
                  height: '12px',
                  border: '2px solid #ffd700',
                  borderLeft: 'none',
                  borderRadius: '0 3px 3px 0',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Milky Way Controls removed - Milky Way is always visible */}

      </Box>
    </ThemeProvider>
  );
};

export default Advertise3DPage;
