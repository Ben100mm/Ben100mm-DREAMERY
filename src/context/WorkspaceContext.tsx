import React, { createContext, useContext, useState, useEffect } from 'react';

interface ModeContextValue {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  subTab: number;
  setSubTab: (tab: number) => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial mode from localStorage or default to 'close'
  const getInitialMode = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedMode');
      return stored || 'close';
    }
    return 'close';
  };

  // Get initial workspace from localStorage or default to 'close'
  const getInitialWorkspace = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedWorkspace');
      return stored || 'close';
    }
    return 'close';
  };

  const [selectedMode, setSelectedModeState] = useState<string>(getInitialMode);
  const [selectedWorkspace, setSelectedWorkspaceState] = useState<string>(getInitialWorkspace);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [subTab, setSubTabState] = useState<number>(0);

  // Persist mode selection to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedMode', selectedMode);
    }
  }, [selectedMode]);

  // Persist workspace selection to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedWorkspace', selectedWorkspace);
    }
  }, [selectedWorkspace]);

  // Persist active tab to localStorage (per mode)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`activeTab_${selectedMode}`, activeTab);
    }
  }, [activeTab, selectedMode]);

  // Persist sub tab to localStorage (per mode)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`subTab_${selectedMode}`, subTab.toString());
    }
  }, [subTab, selectedMode]);

  // Load saved tab when mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem(`activeTab_${selectedMode}`);
      const savedSubTab = localStorage.getItem(`subTab_${selectedMode}`);
      
      if (savedTab) {
        setActiveTabState(savedTab);
      } else {
        setActiveTabState('dashboard');
      }
      
      if (savedSubTab) {
        setSubTabState(parseInt(savedSubTab, 10));
      } else {
        setSubTabState(0);
      }
    }
  }, [selectedMode]);

  const setSelectedMode = (mode: string) => {
    setSelectedModeState(mode);
  };

  const setSelectedWorkspace = (workspace: string) => {
    setSelectedWorkspaceState(workspace);
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const setSubTab = (tab: number) => {
    setSubTabState(tab);
  };

  const value: ModeContextValue = {
    selectedMode,
    setSelectedMode,
    selectedWorkspace,
    setSelectedWorkspace,
    activeTab,
    setActiveTab,
    subTab,
    setSubTab,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = (): ModeContextValue => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

// Keep old exports for backward compatibility during transition
export const WorkspaceProvider = ModeProvider;
export const useWorkspace = useMode;
