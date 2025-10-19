import { useState, useEffect } from 'react';
import { PropertyData } from '../types/realtor';

interface EnrichedPropertyResponse {
  success: boolean;
  properties?: PropertyData[];
  property?: PropertyData;
  total?: number;
  error?: string;
}

interface UseEnrichedPropertyDataReturn {
  properties: PropertyData[];
  loading: boolean;
  error: string | null;
  total: number;
  searchProperties: (params: any) => Promise<void>;
  getProperty: (propertyId: string) => Promise<PropertyData | null>;
}

export const useEnrichedPropertyData = (): UseEnrichedPropertyDataReturn => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_ENHANCED_API_URL || 'http://localhost:8002';

  const searchProperties = async (searchParams: any): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== undefined && searchParams[key] !== null) {
          params.append(key, searchParams[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/enhanced/properties?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EnrichedPropertyResponse = await response.json();
      
      if (data.success && data.properties) {
        setProperties(data.properties);
        setTotal(data.total || data.properties.length);
      } else {
        throw new Error(data.error || 'Failed to fetch properties');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching enriched properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProperty = async (propertyId: string): Promise<PropertyData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enhanced/properties/${propertyId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EnrichedPropertyResponse = await response.json();
      
      if (data.success && data.property) {
        return data.property;
      } else {
        throw new Error(data.error || 'Failed to fetch property');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      return null;
    }
  };

  return {
    properties,
    loading,
    error,
    total,
    searchProperties,
    getProperty
  };
};

// Hook for enriching existing properties
export const usePropertyEnrichment = () => {
  const [enriching, setEnriching] = useState(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);

  const enrichProperties = async (properties: PropertyData[]): Promise<PropertyData[]> => {
    setEnriching(true);
    setEnrichmentError(null);

    try {
      const API_BASE_URL = process.env.REACT_APP_ENHANCED_API_URL || 'http://localhost:8002';
      
      const response = await fetch(`${API_BASE_URL}/api/enhanced/enrich`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: properties.map(prop => ({
            property_id: prop.property_id,
            address: prop.address,
            latitude: prop.coordinates?.lat,
            longitude: prop.coordinates?.lng,
            list_price: prop.list_price,
            description: prop.description
          })),
          batch_size: 10
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.enriched_properties) {
        return data.enriched_properties;
      } else {
        throw new Error(data.error || 'Failed to enrich properties');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setEnrichmentError(errorMessage);
      console.error('Error enriching properties:', err);
      return properties; // Return original properties on error
    } finally {
      setEnriching(false);
    }
  };

  return {
    enriching,
    enrichmentError,
    enrichProperties
  };
};

// Hook for checking API health
export const useEnhancedAPIHealth = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const API_BASE_URL = process.env.REACT_APP_ENHANCED_API_URL || 'http://localhost:8002';
      const response = await fetch(`${API_BASE_URL}/api/enhanced/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHealth(data);
    } catch (err) {
      console.error('Error checking API health:', err);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    health,
    loading,
    checkHealth
  };
};
