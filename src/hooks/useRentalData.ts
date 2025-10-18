/**
 * React hook for rental market data
 * Provides state management and API calls for rental data
 */

import { useState, useEffect, useCallback } from 'react';
import { rentalService } from '../services/rentalService';
import {
  RentalEstimateRequest,
  RentalMarketData,
  RentCastData,
  FreeWebApiData,
  RentalYieldAnalysis,
  RentalMarketTrends
} from '../types/rental';

interface UseRentalDataReturn {
  // State
  rentalData: RentalMarketData | null;
  rentcastData: RentCastData | null;
  freewebapiData: FreeWebApiData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  getRentalEstimate: (request: RentalEstimateRequest) => Promise<void>;
  getRentCastData: (request: RentalEstimateRequest) => Promise<void>;
  getFreeWebApiData: (request: RentalEstimateRequest) => Promise<void>;
  compareSources: (request: RentalEstimateRequest) => Promise<void>;
  clearData: () => void;
  
  // Analysis
  analyzeYield: (propertyId: string, purchasePrice: number) => Promise<RentalYieldAnalysis | null>;
  getMarketTrends: (location: string, period?: string) => Promise<RentalMarketTrends[]>;
}

export const useRentalData = (): UseRentalDataReturn => {
  const [rentalData, setRentalData] = useState<RentalMarketData | null>(null);
  const [rentcastData, setRentcastData] = useState<RentCastData | null>(null);
  const [freewebapiData, setFreewebapiData] = useState<FreeWebApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getRentalEstimate = useCallback(async (request: RentalEstimateRequest) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await rentalService.getRentalEstimate(request);
      
      if (response.success && response.rental_data) {
        setRentalData(response.rental_data);
      } else {
        setError(response.error || 'Failed to get rental estimate');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getRentCastData = useCallback(async (request: RentalEstimateRequest) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await rentalService.getRentCastData(request);
      
      if (response.success && response.rentcast_data) {
        setRentcastData(response.rentcast_data);
      } else {
        setError(response.error || 'Failed to get RentCast data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getFreeWebApiData = useCallback(async (request: RentalEstimateRequest) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await rentalService.getFreeWebApiData(request);
      
      if (response.success && response.freewebapi_data) {
        setFreewebapiData(response.freewebapi_data);
      } else {
        setError(response.error || 'Failed to get FreeWebApi data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const compareSources = useCallback(async (request: RentalEstimateRequest) => {
    setLoading(true);
    clearError();
    
    try {
      const comparison = await rentalService.compareRentalSources(request);
      
      if (comparison.rentcast) {
        setRentcastData(comparison.rentcast);
      }
      
      if (comparison.freewebapi) {
        setFreewebapiData(comparison.freewebapi);
      }
      
      // Create combined rental data from comparison
      const combinedData: RentalMarketData = {
        estimated_rent: comparison.comparison.average_rent,
        rent_range_low: comparison.comparison.rent_range.min,
        rent_range_high: comparison.comparison.rent_range.max,
        data_source: 'Multiple Sources',
        last_updated: new Date().toISOString(),
        confidence_score: Math.max(
          comparison.comparison.confidence_scores.rentcast || 0,
          comparison.comparison.confidence_scores.freewebapi || 0
        )
      };
      
      setRentalData(combinedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const analyzeYield = useCallback(async (propertyId: string, purchasePrice: number): Promise<RentalYieldAnalysis | null> => {
    try {
      const analysis = await rentalService.analyzeRentalMarket(propertyId, purchasePrice);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze yield');
      return null;
    }
  }, []);

  const getMarketTrends = useCallback(async (location: string, period?: string): Promise<RentalMarketTrends[]> => {
    try {
      const trends = await rentalService.getMarketTrends(location, period);
      return trends;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get market trends');
      return [];
    }
  }, []);

  const clearData = useCallback(() => {
    setRentalData(null);
    setRentcastData(null);
    setFreewebapiData(null);
    setError(null);
  }, []);

  return {
    // State
    rentalData,
    rentcastData,
    freewebapiData,
    loading,
    error,
    
    // Actions
    getRentalEstimate,
    getRentCastData,
    getFreeWebApiData,
    compareSources,
    clearData,
    
    // Analysis
    analyzeYield,
    getMarketTrends
  };
};

// Hook for rental data validation
export const useRentalDataValidation = (rentalData: RentalMarketData | null) => {
  const [validation, setValidation] = useState<{
    is_valid: boolean;
    issues: string[];
    quality_score: number;
  } | null>(null);

  useEffect(() => {
    if (rentalData) {
      const result = rentalService.validateRentalData(rentalData);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [rentalData]);

  return validation;
};

// Hook for rental market analysis
export const useRentalMarketAnalysis = (propertyId: string, purchasePrice: number) => {
  const [analysis, setAnalysis] = useState<RentalYieldAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!propertyId || !purchasePrice) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await rentalService.analyzeRentalMarket(propertyId, purchasePrice);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [propertyId, purchasePrice]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  return {
    analysis,
    loading,
    error,
    refresh: runAnalysis
  };
};
