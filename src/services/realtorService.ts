/**
 * Service layer for Realtor.com API integration
 * Bridges Python backend with TypeScript frontend
 */

import { 
  PropertyData, 
  Property,
  RealtorApiResponse, 
  RealtorSearchParams, 
  PropertySearchService,
  PropertyFilters,
  ScraperInput
} from '../types/realtor';

class RealtorService implements PropertySearchService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/realtor') {
    this.baseUrl = baseUrl;
  }

  /**
   * Search for properties using the Python backend
   */
  async searchProperties(params: RealtorSearchParams): Promise<RealtorApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RealtorApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching properties:', error);
      return {
        success: false,
        properties: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get detailed information for a specific property
   */
  async getPropertyDetails(propertyId: string): Promise<PropertyData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/property/${propertyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; property?: PropertyData; error?: string } = await response.json();
      
      if (!data.success || !data.property) {
        return null;
      }

      return data.property;
    } catch (error) {
      console.error('Error getting property details:', error);
      return null;
    }
  }

  /**
   * Advanced property search using processors for comprehensive data extraction
   */
  async searchPropertiesAdvanced(params: RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }): Promise<{ success: boolean; properties: Property[]; total: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/search/advanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in advanced property search:', error);
      return {
        success: false,
        properties: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Comprehensive property search using enhanced GraphQL queries for maximum data extraction
   */
  async searchPropertiesComprehensive(params: RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }): Promise<{ success: boolean; properties: Property[]; total: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/search/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in comprehensive property search:', error);
      return {
        success: false,
        properties: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Enhanced property search using Pydantic models and improved session management
   */
  async searchPropertiesEnhanced(params: ScraperInput): Promise<{ 
    success: boolean; 
    properties: Property[]; 
    total: number; 
    return_type?: string;
    error?: string 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/search/enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in enhanced property search:', error);
      return {
        success: false,
        properties: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * High-level property scraping API with comprehensive validation
   */
  async scrapeProperties(params: {
    location: string;
    listing_type?: string;
    return_type?: string;
    property_type?: string[];
    radius?: number;
    mls_only?: boolean;
    past_days?: number;
    proxy?: string;
    date_from?: string;
    date_to?: string;
    foreclosure?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
    limit?: number;
  }): Promise<{ 
    success: boolean; 
    data: any; 
    return_type?: string;
    count?: number;
    error?: string 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in scrape properties:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Search properties with advanced filters
   */
  async searchPropertiesWithFilters(
    searchParams: RealtorSearchParams,
    filters: PropertyFilters
  ): Promise<RealtorApiResponse> {
    try {
      const enhancedParams = {
        ...searchParams,
        ...this.convertFiltersToSearchParams(filters)
      };

      return await this.searchProperties(enhancedParams);
    } catch (error) {
      console.error('Error searching properties with filters:', error);
      return {
        success: false,
        properties: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get property suggestions for autocomplete
   */
  async getPropertySuggestions(query: string, limit: number = 10): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; suggestions?: string[]; error?: string } = await response.json();
      
      if (!data.success || !data.suggestions) {
        return [];
      }

      return data.suggestions;
    } catch (error) {
      console.error('Error getting property suggestions:', error);
      return [];
    }
  }

  /**
   * Convert TypeScript filters to search parameters
   */
  private convertFiltersToSearchParams(filters: PropertyFilters): Partial<RealtorSearchParams> {
    const params: Partial<RealtorSearchParams> = {};

    if (filters.priceRange) {
      params.min_price = filters.priceRange.min;
      params.max_price = filters.priceRange.max;
    }

    if (filters.bedrooms) {
      params.beds = filters.bedrooms.min;
    }

    if (filters.bathrooms) {
      params.baths = filters.bathrooms.min;
    }

    if (filters.squareFootage) {
      params.sqft_min = filters.squareFootage.min;
      params.sqft_max = filters.squareFootage.max;
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      params.property_types = filters.propertyTypes.map(type => type.toString());
    }

    if (filters.listingTypes && filters.listingTypes.length > 0) {
      params.listing_type = filters.listingTypes[0]; // Use first listing type
    }

    if (filters.yearBuilt) {
      // Note: This would need to be implemented in the backend
      // For now, we'll add it as a custom parameter
      (params as any).year_built_min = filters.yearBuilt.min;
      (params as any).year_built_max = filters.yearBuilt.max;
    }

    if (filters.lotSize) {
      // Note: This would need to be implemented in the backend
      (params as any).lot_sqft_min = filters.lotSize.min;
      (params as any).lot_sqft_max = filters.lotSize.max;
    }

    if (filters.keywords) {
      // Note: This would need to be implemented in the backend
      (params as any).keywords = filters.keywords;
    }

    return params;
  }

  /**
   * Format property data for display
   */
  formatPropertyForDisplay(property: PropertyData): {
    id: string;
    price: string;
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    type: string;
    daysOnMarket: number;
    image: string;
    status: string;
    listPrice: number;
    pricePerSqft: number;
    photos: string[];
    agent: {
      name: string;
      email: string;
      phone: string;
      company: string;
    };
    coordinates: {
      lat: number;
      lng: number;
    };
  } {
    const address = property.address;
    const description = property.description;
    const price = property.list_price || 0;
    const sqft = description?.sqft || 0;

    return {
      id: property.property_id,
      price: price > 0 ? `$${price.toLocaleString()}` : 'Price not available',
      address: address ? 
        `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') :
        'Address not available',
      beds: description?.beds || 0,
      baths: (description?.baths_full || 0) + (description?.baths_half || 0) * 0.5,
      sqft: sqft,
      type: description?.type || 'Property',
      daysOnMarket: property.days_on_mls || 0,
      image: property.photos?.[0]?.href || 'P1',
      status: property.status || 'active',
      listPrice: price,
      pricePerSqft: sqft > 0 ? Math.round(price / sqft) : 0,
      photos: property.photos?.map(photo => photo.href) || [],
      agent: {
        name: property.agent?.name || '',
        email: property.agent?.email || '',
        phone: property.agent?.phone || '',
        company: property.office?.name || ''
      },
      coordinates: property.coordinates || { lat: 0, lng: 0 }
    };
  }
}

// Export singleton instance
export const realtorService = new RealtorService();
export default RealtorService;
