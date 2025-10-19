import React, { createContext, useState, useContext, useEffect } from 'react';

interface PhaseConfig {
  id: number;
  name: string;
  description: string;
  enabledPages: string[];
  isActive: boolean;
}

interface FeatureFlagContextType {
  currentPhase: number;
  phases: PhaseConfig[];
  enabledPages: string[];
  isPageEnabled: (pagePath: string) => boolean;
  switchToPhase: (phaseId: number) => void;
  isPhaseActive: (phaseId: number) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  
  const phases: PhaseConfig[] = [
    {
      id: 1,
      name: "Phase 1 - Core Features",
      description: "Homepage, Underwrite, Auth pages, and Developer tools",
      enabledPages: ['/', '/underwrite', '/auth', '/professional-signup', '/business-signup', '/developer'],
      isActive: true
    },
    {
      id: 2,
      name: "Phase 2 - Marketplace",
      description: "Add Marketplace and Mortgage features",
      enabledPages: ['/', '/underwrite', '/marketplace', '/mortgage', '/auth', '/professional-signup', '/business-signup', '/developer'],
      isActive: false
    },
    {
      id: 3,
      name: "Phase 3 - Full Release",
      description: "All features unlocked",
      enabledPages: ['/', '/lumina', '/underwrite', '/marketplace', '/mortgage', '/workspaces', '/learn', '/advertise', '/partner', '/developer', '/auth', '/professional-signup', '/business-signup'],
      isActive: false
    }
  ];

  const [enabledPages, setEnabledPages] = useState(phases[0].enabledPages);

  // Load phase from localStorage on mount
  useEffect(() => {
    const savedPhase = localStorage.getItem('app-phase');
    if (savedPhase) {
      const phaseId = parseInt(savedPhase);
      switchToPhase(phaseId);
    }
  }, []);

  const switchToPhase = (phaseId: number) => {
    const phase = phases.find(p => p.id === phaseId);
    if (phase) {
      setCurrentPhase(phaseId);
      setEnabledPages(phase.enabledPages);
      localStorage.setItem('app-phase', phaseId.toString());
      
      // Update phases array
      phases.forEach(p => p.isActive = p.id === phaseId);
      
      console.log(`Switched to ${phase.name}:`, phase.enabledPages);
    }
  };

  const isPageEnabled = (pagePath: string) => {
    // Check exact match first
    if (enabledPages.includes(pagePath)) {
      return true;
    }
    
    // Check if any enabled page is a parent of this route
    return enabledPages.some(enabledPage => 
      pagePath.startsWith(enabledPage + '/')
    );
  };

  const isPhaseActive = (phaseId: number) => {
    return currentPhase === phaseId;
  };

  return (
    <FeatureFlagContext.Provider value={{
      currentPhase,
      phases,
      enabledPages,
      isPageEnabled,
      switchToPhase,
      isPhaseActive
    }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  return context;
};
