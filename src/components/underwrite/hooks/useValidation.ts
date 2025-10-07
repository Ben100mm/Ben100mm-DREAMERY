/**
 * Validation hook for UnderwritePage
 * Handles validation logic and state normalization
 */

import { DealState, PropertyType, OperationType, OfferType } from "../types";
import { getOperationTypeOptions, getOfferTypeOptions } from "../utils";

export interface ValidationResult {
  next: DealState;
  messages: string[];
}

/**
 * Validates and normalizes the deal state
 * Ensures operation type and offer type are valid for the selected property type
 */
export function validateAndNormalizeState(input: DealState): ValidationResult {
  const messages: string[] = [];
  
  // Ensure operation type valid for property type
  const allowedOps = getOperationTypeOptions(input.propertyType);
  let operationType = input.operationType;
  if (!allowedOps.includes(operationType)) {
    operationType = allowedOps[0];
    messages.push(
      `Operation Type reset to ${operationType} for ${input.propertyType}.`,
    );
  }
  
  // Ensure offer type valid for combination
  const allowedOffers = getOfferTypeOptions(
    input.propertyType,
    operationType,
  );
  let offerType = input.offerType;
  if (!allowedOffers.includes(offerType)) {
    offerType = allowedOffers[0];
    messages.push(
      `Finance Type reset to ${offerType} for ${input.propertyType} + ${operationType}.`,
    );
  }
  
  const next: DealState = {
    ...input,
    operationType,
    offerType,
    validationMessages: messages,
    snackbarOpen: messages.length > 0,
  };
  
  return { next, messages };
}

/**
 * Hook for validation logic
 */
export function useValidation() {
  return {
    validateAndNormalizeState,
    getOperationTypeOptions,
    getOfferTypeOptions,
  };
}

