/**
 * Custom hook for Realtor.com data integration
 * Provides property search functionality with the new parsers
 */

import { useState, useEffect, useCallback } from 'react';
import { realtorService } from '../services/realtorService';
import { 
  PropertyData, 
  Property,
  RealtorSearchParams, 
  RealtorApiResponse, 
  PropertyFilters,
  ScraperInput
} from '../types/realtor';

interface UseRealtorDataReturn {
  properties: PropertyData[];
  loading: boolean;
  error: string | null;
  total: number;
  searchProperties: (params: RealtorSearchParams) => Promise<void>;
  searchWithFilters: (searchParams: RealtorSearchParams, filters: PropertyFilters) => Promise<void>;
  searchPropertiesAdvanced: (params: RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }) => Promise<Property[]>;
  searchPropertiesComprehensive: (params: RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }) => Promise<Property[]>;
  searchPropertiesEnhanced: (params: ScraperInput) => Promise<Property[]>;
  getPropertyDetails: (propertyId: string) => Promise<PropertyData | null>;
  getSuggestions: (query: string) => Promise<string[]>;
  clearError: () => void;
  clearProperties: () => void;
}

export const useRealtorData = (): UseRealtorDataReturn => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const searchProperties = useCallback(async (params: RealtorSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: RealtorApiResponse = await realtorService.searchProperties(params);
      
      if (response.success) {
        setProperties(response.properties);
        setTotal(response.total);
      } else {
        setError(response.error || 'Failed to search properties');
        setProperties([]);
        setTotal(0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWithFilters = useCallback(async (
    searchParams: RealtorSearchParams, 
    filters: PropertyFilters
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: RealtorApiResponse = await realtorService.searchPropertiesWithFilters(
        searchParams, 
        filters
      );
      
      if (response.success) {
        setProperties(response.properties);
        setTotal(response.total);
      } else {
        setError(response.error || 'Failed to search properties with filters');
        setProperties([]);
        setTotal(0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyDetails = useCallback(async (propertyId: string): Promise<PropertyData | null> => {
    try {
      return await realtorService.getPropertyDetails(propertyId);
    } catch (err) {
      console.error('Error getting property details:', err);
      return null;
    }
  }, []);

  const searchPropertiesAdvanced = useCallback(async (params: RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }): Promise<Property[]> => {
    try {
      const response = await realtorService.searchPropertiesAdvanced(params);
      return response.properties;
    } catch (err) {
      console.error('Error in advanced property search:', err);
      return [];
    }
  }, []);

  const searchPropertiesComprehensive = useCallback(async (params: RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }): Promise<Property[]> => {
    try {
      const response = await realtorService.searchPropertiesComprehensive(params);
      return response.properties;
    } catch (err) {
      console.error('Error in comprehensive property search:', err);
      return [];
    }
  }, []);

  const searchPropertiesEnhanced = useCallback(async (params: ScraperInput): Promise<Property[]> => {
    try {
      const response = await realtorService.searchPropertiesEnhanced(params);
      return response.properties;
    } catch (err) {
      console.error('Error in enhanced property search:', err);
      return [];
    }
  }, []);

  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    try {
      return await realtorService.getPropertySuggestions(query);
    } catch (err) {
      console.error('Error getting suggestions:', err);
      return [];
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearProperties = useCallback(() => {
    setProperties([]);
    setTotal(0);
  }, []);

  return {
    properties,
    loading,
    error,
    total,
    searchProperties,
    searchWithFilters,
    searchPropertiesAdvanced,
    searchPropertiesComprehensive,
    searchPropertiesEnhanced,
    getPropertyDetails,
    getSuggestions,
    clearError,
    clearProperties
  };
};

// Hook for property suggestions/autocomplete
export const usePropertySuggestions = (query: string, enabled: boolean = true) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const results = await realtorService.getPropertySuggestions(query);
        setSuggestions(results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suggestions';
        setError(errorMessage);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, enabled]);

  return { suggestions, loading, error };
};

// Hook for property details
export const usePropertyDetails = (propertyId: string | null) => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setProperty(null);
      return;
    }

    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await realtorService.getPropertyDetails(propertyId);
        setProperty(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property details';
        setError(errorMessage);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  return { property, loading, error };
};
