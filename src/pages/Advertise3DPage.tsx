/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential.
 * 
 * Immersive 3D Advertising Page
 * Full-page 3D canvas with 20 comprehensive advertising sections
 */

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';

// Core components
import { SceneManager } from '../components/3d/SceneManager';

// Section components
import { HeroSection3D } from '../components/3d/sections/HeroSection3D';
import { OpportunitiesSection3D } from '../components/3d/sections/OpportunitiesSection3D';
import { PricingSection3D } from '../components/3d/sections/PricingSection3D';
import { FeaturesSection3D } from '../components/3d/sections/FeaturesSection3D';
import { AudienceInsightsSection3D } from '../components/3d/sections/AudienceInsightsSection3D';
import { TestimonialsSection3D } from '../components/3d/sections/TestimonialsSection3D';
import { SampleAdsSection3D } from '../components/3d/sections/SampleAdsSection3D';
import { CompetitiveAdvantagesSection3D } from '../components/3d/sections/CompetitiveAdvantagesSection3D';
import { OnboardingSection3D } from '../components/3d/sections/OnboardingSection3D';
import { ComplianceSection3D } from '../components/3d/sections/ComplianceSection3D';
import { FAQSection3D } from '../components/3d/sections/FAQSection3D';
import { ContactSection3D } from '../components/3d/sections/ContactSection3D';
import { TechSpecsSection3D } from '../components/3d/sections/TechSpecsSection3D';
import { IndustryFocusSection3D } from '../components/3d/sections/IndustryFocusSection3D';
import { PerformanceMetricsSection3D } from '../components/3d/sections/PerformanceMetricsSection3D';
import { IntegrationSection3D } from '../components/3d/sections/IntegrationSection3D';
import { CampaignManagementSection3D } from '../components/3d/sections/CampaignManagementSection3D';
import { ContentRequirementsSection3D } from '../components/3d/sections/ContentRequirementsSection3D';
import { GeographicTargetingSection3D } from '../components/3d/sections/GeographicTargetingSection3D';
import { AnalyticsReportingSection3D } from '../components/3d/sections/AnalyticsReportingSection3D';

/**
 * Scene Content Component
 * Contains all 3D elements, lighting, and sections
 */
const SceneContent: React.FC<{ 
  currentSection: number; 
  onSectionChange: (section: number) => void; 
}> = ({ currentSection, onSectionChange }) => {
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

      {/* Background Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Scene Manager - handles camera transitions */}
      <SceneManager onSectionChange={onSectionChange} />

      {/* All 20 Sections - Only render nearby sections for performance */}
      {Math.abs(currentSection - 0) <= 1 && <HeroSection3D visible={currentSection === 0} />}
      {Math.abs(currentSection - 1) <= 1 && <OpportunitiesSection3D visible={currentSection === 1} />}
      {Math.abs(currentSection - 2) <= 1 && <PricingSection3D visible={currentSection === 2} />}
      {Math.abs(currentSection - 3) <= 1 && <FeaturesSection3D visible={currentSection === 3} />}
      {Math.abs(currentSection - 4) <= 1 && <AudienceInsightsSection3D visible={currentSection === 4} />}
      {Math.abs(currentSection - 5) <= 1 && <TestimonialsSection3D visible={currentSection === 5} />}
      {Math.abs(currentSection - 6) <= 1 && <SampleAdsSection3D visible={currentSection === 6} />}
      {Math.abs(currentSection - 7) <= 1 && <CompetitiveAdvantagesSection3D visible={currentSection === 7} />}
      {Math.abs(currentSection - 8) <= 1 && <OnboardingSection3D visible={currentSection === 8} />}
      {Math.abs(currentSection - 9) <= 1 && <ComplianceSection3D visible={currentSection === 9} />}
      {Math.abs(currentSection - 10) <= 1 && <FAQSection3D visible={currentSection === 10} />}
      {Math.abs(currentSection - 11) <= 1 && <ContactSection3D visible={currentSection === 11} />}
      {Math.abs(currentSection - 12) <= 1 && <TechSpecsSection3D visible={currentSection === 12} />}
      {Math.abs(currentSection - 13) <= 1 && <IndustryFocusSection3D visible={currentSection === 13} />}
      {Math.abs(currentSection - 14) <= 1 && <PerformanceMetricsSection3D visible={currentSection === 14} />}
      {Math.abs(currentSection - 15) <= 1 && <IntegrationSection3D visible={currentSection === 15} />}
      {Math.abs(currentSection - 16) <= 1 && <CampaignManagementSection3D visible={currentSection === 16} />}
      {Math.abs(currentSection - 17) <= 1 && <ContentRequirementsSection3D visible={currentSection === 17} />}
      {Math.abs(currentSection - 18) <= 1 && <GeographicTargetingSection3D visible={currentSection === 18} />}
      {Math.abs(currentSection - 19) <= 1 && <AnalyticsReportingSection3D visible={currentSection === 19} />}

      {/* Camera movement controlled by scroll */}
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
  const [isLoading, setIsLoading] = useState(true);

  // Create scroll container with sections
  useEffect(() => {
    // Set loading complete after initial render - reduced timeout for faster load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Section change handler (called by SceneManager)
  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
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
            height: '2000vh', // 20 sections x 100vh
            width: '100%',
            position: 'relative',
            pointerEvents: 'none',
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
            zIndex: 1,
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
          >
            <Suspense fallback={null}>
              <SceneContent 
                currentSection={currentSection} 
                onSectionChange={handleSectionChange}
              />
            </Suspense>
          </Canvas>
        </Box>


      </Box>
    </ThemeProvider>
  );
};

export default Advertise3DPage;

