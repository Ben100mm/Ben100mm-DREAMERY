/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential.
 * 
 * Immersive 3D Advertising Page
 * Full-page 3D canvas with 12 comprehensive advertising sections
 */

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';

// Core components
import { SceneManager } from '../components/3d/SceneManager';

// Visual effects
import { WhizzingStars } from '../components/3d/effects/WhizzingStars';
import { ConcaveMilkyWay } from '../components/3d/effects/ConcaveMilkyWay';

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

/**
 * Scene Content Component
 * Contains all 3D elements, lighting, and 12 focused sections
 */
const SceneContent: React.FC<{ 
  currentSection: number; 
  onSectionChange: (section: number) => void;
  onScrollUpdate: (progress: number, velocity: number) => void;
  scrollVelocity: number;
  scrollProgress: number;
}> = ({ currentSection, onSectionChange, onScrollUpdate, scrollVelocity, scrollProgress }) => {
  return (
    <>
      {/* Camera - controlled by SceneManager based on scroll */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />

      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#64b5f6" />
      <pointLight position={[5, 0, 5]} intensity={0.3} color="#90caf9" />

      {/* Background Effects - Concave Milky Way for debugging */}
      <ConcaveMilkyWay 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity}
        parallaxFactor={0.4}
      />
      {/* Temporarily disabled for debugging */}
      {/* <WhizzingStars scrollVelocity={scrollVelocity} /> */}

      {/* Scene Manager - handles camera transitions */}
      <SceneManager 
        onSectionChange={onSectionChange}
        onScrollUpdate={onScrollUpdate}
      />

      {/* 12 Focused Sections - Only render nearby sections for performance */}
      {/* Section 0: Hero - Introduction */}
      {Math.abs(currentSection - 0) <= 1 && <HeroSection3D visible={currentSection === 0} sectionIndex={0} scrollProgress={scrollProgress} />}
      
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Create scroll container with sections
  useEffect(() => {
    // Ensure body can scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Set loading complete after initial render - reduced timeout for faster load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      // Cleanup: restore original overflow settings
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Section change handler (called by SceneManager)
  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
  };

  // Scroll update handler (called by SceneManager)
  const handleScrollUpdate = (progress: number, velocity: number) => {
    setScrollVelocity(velocity);
    setScrollProgress(progress);
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
        {/* Scrollable spacer to create scroll area */}
        <Box
          sx={{
            height: '1200vh', // 12 sections x 100vh
            width: '100%',
            position: 'relative',
            pointerEvents: 'none',
            zIndex: -1, // Ensure it's behind the canvas
          }}
        />

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
            zIndex: 2,
            pointerEvents: 'none', // Canvas doesn't block scroll
          }}
        >
          <Canvas
            shadows
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <SceneContent 
                currentSection={currentSection} 
                onSectionChange={handleSectionChange}
                onScrollUpdate={handleScrollUpdate}
                scrollVelocity={scrollVelocity}
                scrollProgress={scrollProgress}
              />
            </Suspense>
          </Canvas>
        </Box>


      </Box>
    </ThemeProvider>
  );
};

export default Advertise3DPage;
