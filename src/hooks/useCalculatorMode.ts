/**
 * Calculator Mode Hook
 * 
 * Manages calculator mode state with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { CalculatorMode } from '../types/calculatorMode';

const STORAGE_KEY = 'dreamery-calculator-mode';
const DEFAULT_MODE: CalculatorMode = 'essential';

interface UseCalculatorModeReturn {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  isEssential: boolean;
  isStandard: boolean;
  isProfessional: boolean;
  canUpgradeTo: (targetMode: CalculatorMode) => boolean;
  upgradeTo: (targetMode: CalculatorMode) => void;
}

/**
 * Hook to manage calculator mode with localStorage persistence
 */
export function useCalculatorMode(): UseCalculatorModeReturn {
  // Initialize from localStorage or default
  const [mode, setModeState] = useState<CalculatorMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['essential', 'standard', 'professional'].includes(stored)) {
        return stored as CalculatorMode;
      }
    } catch (error) {
      console.warn('Failed to read calculator mode from localStorage:', error);
    }
    return DEFAULT_MODE;
  });

  // Persist to localStorage whenever mode changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save calculator mode to localStorage:', error);
    }
  }, [mode]);

  // Set mode with validation
  const setMode = useCallback((newMode: CalculatorMode) => {
    if (['essential', 'standard', 'professional'].includes(newMode)) {
      setModeState(newMode);
    } else {
      console.warn('Invalid calculator mode:', newMode);
    }
  }, []);

  // Helper booleans
  const isEssential = mode === 'essential';
  const isStandard = mode === 'standard';
  const isProfessional = mode === 'professional';

  // Check if can upgrade to target mode
  const canUpgradeTo = useCallback((targetMode: CalculatorMode): boolean => {
    const modeOrder: CalculatorMode[] = ['essential', 'standard', 'professional'];
    const currentIndex = modeOrder.indexOf(mode);
    const targetIndex = modeOrder.indexOf(targetMode);
    return targetIndex > currentIndex;
  }, [mode]);

  // Upgrade to target mode
  const upgradeTo = useCallback((targetMode: CalculatorMode) => {
    if (canUpgradeTo(targetMode)) {
      setMode(targetMode);
    }
  }, [canUpgradeTo, setMode]);

  return {
    mode,
    setMode,
    isEssential,
    isStandard,
    isProfessional,
    canUpgradeTo,
    upgradeTo,
  };
}

export default useCalculatorMode;