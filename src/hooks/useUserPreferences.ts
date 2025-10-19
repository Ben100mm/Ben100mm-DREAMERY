import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  defaultWorkspace: string;
  favoriteSidebarItems: string[];
  customLayout: {
    sidebarWidth: number;
    sidebarCollapsed: boolean;
  };
  workspaceSettings: {
    [workspaceId: string]: {
      defaultTab: string;
      customSidebarItems: string[];
    };
  };
}

const defaultPreferences: UserPreferences = {
  defaultWorkspace: 'close',
  favoriteSidebarItems: [],
  customLayout: {
    sidebarWidth: 280,
    sidebarCollapsed: false,
  },
  workspaceSettings: {},
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dreamery-user-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('dreamery-user-preferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save user preferences:', error);
      }
    }
  }, [preferences, isLoading]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const setDefaultWorkspace = useCallback((workspaceId: string) => {
    updatePreferences({ defaultWorkspace: workspaceId });
  }, [updatePreferences]);

  const toggleFavoriteSidebarItem = useCallback((itemId: string) => {
    setPreferences(prev => {
      const favorites = prev.favoriteSidebarItems;
      const isFavorite = favorites.includes(itemId);
      return {
        ...prev,
        favoriteSidebarItems: isFavorite
          ? favorites.filter(id => id !== itemId)
          : [...favorites, itemId]
      };
    });
  }, []);

  const updateWorkspaceSettings = useCallback((workspaceId: string, settings: Partial<UserPreferences['workspaceSettings'][string]>) => {
    setPreferences(prev => ({
      ...prev,
      workspaceSettings: {
        ...prev.workspaceSettings,
        [workspaceId]: {
          ...prev.workspaceSettings[workspaceId],
          ...settings,
        },
      },
    }));
  }, []);

  const setSidebarWidth = useCallback((width: number) => {
    updatePreferences({
      customLayout: {
        ...preferences.customLayout,
        sidebarWidth: Math.max(200, Math.min(400, width)),
      },
    });
  }, [preferences.customLayout, updatePreferences]);

  const toggleSidebarCollapsed = useCallback(() => {
    updatePreferences({
      customLayout: {
        ...preferences.customLayout,
        sidebarCollapsed: !preferences.customLayout.sidebarCollapsed,
      },
    });
  }, [preferences.customLayout, updatePreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    setDefaultWorkspace,
    toggleFavoriteSidebarItem,
    updateWorkspaceSettings,
    setSidebarWidth,
    toggleSidebarCollapsed,
    resetPreferences,
  };
};
