import { useState, useCallback } from 'react';

interface PropertySearchParams {
  location: string;
  listing_type: 'for_sale' | 'for_rent' | 'sold' | 'pending';
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  min_baths?: number;
  min_sqft?: number;
  max_sqft?: number;
  property_types?: string[];
  radius?: number;
  past_days?: number;
}

interface Property {
  id: string;
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  daysOnMarket: number;
  image: string;
  mls?: string;
  mls_id?: string;
  status?: string;
  list_price?: number;
  price_per_sqft?: number;
  year_built?: number;
  garage?: number;
  lot_sqft?: number;
  description?: string;
  photos?: string[];
  agent?: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const usePropertySearch = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProperties = useCallback(async (params: PropertySearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (data.success) {
        setProperties(data.properties);
      } else {
        setError(data.error || 'Search failed');
        setProperties([]);
      }
    } catch (err) {
      setError('Network error occurred');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    properties,
    loading,
    error,
    searchProperties,
  };
};
