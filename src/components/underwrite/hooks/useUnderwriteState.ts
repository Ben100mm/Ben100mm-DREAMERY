/**
 * State management hook for UnderwritePage
 * Handles state initialization, persistence, and updates
 */

import { useState, useEffect, useCallback } from "react";
import { DealState } from "../types";
import { defaultState } from "../constants";
import { validateAndNormalizeState } from "./useValidation";

const STORAGE_KEY = "underwrite:last";

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Load state from localStorage with validation
 */
function loadStateFromStorage(): DealState {
  try {
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) {
      const parsed = JSON.parse(fromLocal) as DealState;
      console.log(
        "Loading from localStorage, original analysisDate:",
        parsed.analysisDate,
      );
      
      const normalized = validateAndNormalizeState({
        ...parsed,
        analysisDate: getCurrentDate(), // Always use current date
        proFormaAuto: parsed.proFormaAuto ?? true,
        validationMessages: [],
      });
      
      return normalized.next;
    }
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
  }
  return defaultState;
}

/**
 * Save state to localStorage
 */
function saveStateToStorage(state: DealState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
}

/**
 * Hook for managing underwrite state
 */
export function useUnderwriteState() {
  const [state, setState] = useState<DealState>(() => loadStateFromStorage());
  const [currentDate, setCurrentDate] = useState<string>(() => getCurrentDate());

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getCurrentDate();
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  /**
   * Update state with validation
   */
  const updateState = useCallback(
    (updates: Partial<DealState> | ((prev: DealState) => DealState)) => {
      setState((prev) => {
        const next = typeof updates === "function" ? updates(prev) : { ...prev, ...updates };
        return next;
      });
    },
    []
  );

  /**
   * Reset state to defaults
   */
  const resetState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Handle property type change with validation
   */
  const handlePropertyTypeChange = useCallback(
    (propertyType: DealState["propertyType"]) => {
      setState((prev) => {
        const updated = { ...prev, propertyType };
        const validated = validateAndNormalizeState(updated);
        return validated.next;
      });
    },
    []
  );

  /**
   * Handle operation type change with validation
   */
  const handleOperationTypeChange = useCallback(
    (operationType: DealState["operationType"]) => {
      setState((prev) => {
        const updated = { ...prev, operationType };
        const validated = validateAndNormalizeState(updated);
        return validated.next;
      });
    },
    []
  );

  /**
   * Handle offer type change with validation
   */
  const handleOfferTypeChange = useCallback(
    (offerType: DealState["offerType"]) => {
      setState((prev) => {
        const updated = { ...prev, offerType };
        const validated = validateAndNormalizeState(updated);
        return validated.next;
      });
    },
    []
  );

  /**
   * Close validation snackbar
   */
  const closeSnackbar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      snackbarOpen: false,
      validationMessages: [],
    }));
  }, []);

  return {
    state,
    setState,
    updateState,
    resetState,
    currentDate,
    handlePropertyTypeChange,
    handleOperationTypeChange,
    handleOfferTypeChange,
    closeSnackbar,
  };
}

