/**
 * Address validation and geocoding utilities
 */

export interface GeocodedAddress {
  formattedAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  components: {
    streetNumber?: string;
    route?: string;
    locality?: string;
    administrativeAreaLevel1?: string;
    postalCode?: string;
    country?: string;
  };
  placeId?: string;
  confidence: number;
}

export interface AddressValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

/**
 * Address validation utility
 */
export class AddressValidator {
  /**
   * Validate address format and content
   */
  static validate(address: string): AddressValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation
    if (!address || address.trim().length === 0) {
      errors.push('Address is required');
      return { isValid: false, errors, warnings };
    }

    const trimmedAddress = address.trim();

    // Length validation
    if (trimmedAddress.length < 3) {
      errors.push('Address must be at least 3 characters long');
    }

    if (trimmedAddress.length > 200) {
      errors.push('Address is too long (maximum 200 characters)');
    }

    // Character validation
    if (/[<>'"&]/.test(address)) {
      errors.push('Address contains invalid characters');
    }

    // Check for common misspellings and provide suggestions
    const misspellingSuggestions = this.checkCommonMisspellings(trimmedAddress);
    if (misspellingSuggestions.length > 0) {
      warnings.push('Address may contain misspellings');
      suggestions.push(...misspellingSuggestions);
    }

    // Check for incomplete addresses
    if (this.isIncompleteAddress(trimmedAddress)) {
      warnings.push('Address appears to be incomplete');
      suggestions.push('Include street number, city, and state for best results');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  /**
   * Check for common address misspellings
   */
  private static checkCommonMisspellings(address: string): string[] {
    const suggestions: string[] = [];
    const lowerAddress = address.toLowerCase();

    // Common street suffix misspellings
    const streetSuffixCorrections: Record<string, string> = {
      'st': 'Street',
      'ave': 'Avenue',
      'rd': 'Road',
      'blvd': 'Boulevard',
      'dr': 'Drive',
      'ln': 'Lane',
      'ct': 'Court',
      'pl': 'Place',
      'way': 'Way',
      'cir': 'Circle'
    };

    for (const [abbrev, full] of Object.entries(streetSuffixCorrections)) {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'g');
      if (regex.test(lowerAddress)) {
        suggestions.push(`Consider using "${full}" instead of "${abbrev}"`);
      }
    }

    // Common state abbreviations
    const stateCorrections: Record<string, string> = {
      'ca': 'California',
      'ny': 'New York',
      'tx': 'Texas',
      'fl': 'Florida',
      'il': 'Illinois'
    };

    for (const [abbrev, full] of Object.entries(stateCorrections)) {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'g');
      if (regex.test(lowerAddress)) {
        suggestions.push(`Consider using "${full}" instead of "${abbrev}"`);
      }
    }

    return suggestions;
  }

  /**
   * Check if address appears incomplete
   */
  private static isIncompleteAddress(address: string): boolean {
    const lowerAddress = address.toLowerCase();

    // Check for missing components
    const hasStreetNumber = /\d+/.test(address);
    const hasStreetName = /\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court|pl|place|way|cir|circle)\b/.test(lowerAddress);
    const hasCity = /\b(city|town|village|borough)\b/.test(lowerAddress) || this.hasCommonCityPattern(address);
    const hasState = /\b(state|province)\b/.test(lowerAddress) || this.hasCommonStatePattern(address);
    const hasZip = /\d{5}(-\d{4})?/.test(address);

    // Consider incomplete if missing multiple components
    const missingComponents = [hasStreetNumber, hasStreetName, hasCity, hasState, hasZip]
      .filter(component => !component).length;

    return missingComponents >= 3;
  }

  /**
   * Check for common city name patterns
   */
  private static hasCommonCityPattern(address: string): boolean {
    const commonCityEndings = ['burg', 'ton', 'ville', 'dale', 'field', 'ford', 'port', 'side', 'view'];
    const lowerAddress = address.toLowerCase();
    
    return commonCityEndings.some(ending => 
      lowerAddress.includes(ending) || 
      lowerAddress.match(new RegExp(`\\b\\w+${ending}\\b`))
    );
  }

  /**
   * Check for common state name patterns
   */
  private static hasCommonStatePattern(address: string): boolean {
    const commonStates = [
      'california', 'texas', 'florida', 'new york', 'pennsylvania', 'illinois',
      'ohio', 'georgia', 'north carolina', 'michigan', 'new jersey', 'virginia'
    ];
    
    const lowerAddress = address.toLowerCase();
    return commonStates.some(state => lowerAddress.includes(state));
  }
}

/**
 * Geocoding utility (placeholder for future implementation)
 */
export class AddressGeocoder {
  /**
   * Geocode an address to get coordinates and detailed components
   */
  static async geocodeAddress(address: string): Promise<GeocodedAddress | null> {
    try {
      // TODO: Implement actual geocoding service (Google Maps, Mapbox, etc.)
      // For now, return a mock response
      return this.mockGeocodeResponse(address);
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  static async reverseGeocode(lat: number, lng: number): Promise<GeocodedAddress | null> {
    try {
      // TODO: Implement reverse geocoding
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Mock geocoding response for development
   */
  private static mockGeocodeResponse(address: string): GeocodedAddress {
    // Generate mock coordinates based on address hash
    const hash = this.simpleHash(address);
    const lat = 37.7749 + (hash % 1000) / 10000 - 0.05; // San Francisco area ±0.05 degrees
    const lng = -122.4194 + ((hash >> 10) % 1000) / 10000 - 0.05;

    return {
      formattedAddress: address,
      coordinates: { lat, lng },
      components: {
        locality: 'San Francisco',
        administrativeAreaLevel1: 'CA',
        postalCode: '94102',
        country: 'US'
      },
      placeId: `mock_${hash}`,
      confidence: 0.8
    };
  }

  /**
   * Simple hash function for mock data
   */
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Address formatting utilities
 */
export class AddressFormatter {
  /**
   * Format address for display
   */
  static formatForDisplay(address: string): string {
    return address
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  /**
   * Format address for search
   */
  static formatForSearch(address: string): string {
    return address
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s,.-]/g, '');
  }

  /**
   * Extract components from address string
   */
  static extractComponents(address: string): {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zip?: string;
  } {
    const parts = address.split(',').map(part => part.trim());
    
    const components: any = {};
    
    // Try to extract street number and name from first part
    const firstPart = parts[0];
    const streetMatch = firstPart.match(/^(\d+)\s+(.+)$/);
    if (streetMatch) {
      components.streetNumber = streetMatch[1];
      components.streetName = streetMatch[2];
    } else {
      components.streetName = firstPart;
    }
    
    // Extract city, state, zip from remaining parts
    if (parts.length >= 2) {
      components.city = parts[parts.length - 2];
      
      const lastPart = parts[parts.length - 1];
      const zipMatch = lastPart.match(/(\d{5}(-\d{4})?)/);
      if (zipMatch) {
        components.zip = zipMatch[1];
        components.state = lastPart.replace(zipMatch[1], '').trim();
      } else {
        components.state = lastPart;
      }
    }
    
    return components;
  }
}

/**
 * Search routing utility
 */
export class SearchRouter {
  /**
   * Determine the appropriate route based on search type and address data
   */
  static getSearchRoute(addressData: GeocodedAddress | null, searchQuery: string): {
    route: string;
    state?: any;
  } {
    // Default to marketplace buy page
    const defaultRoute = '/marketplace/buy';
    
    if (!addressData) {
      return {
        route: defaultRoute,
        state: { searchQuery }
      };
    }

    // Determine search type based on address components and query
    const hasStreetNumber = !!addressData.components.streetNumber;
    const hasSpecificLocation = hasStreetNumber && !!addressData.components.route;
    
    // Also check if the search query itself contains a street number
    const queryHasStreetNumber = /\d+\s/.test(searchQuery);

    if (hasSpecificLocation || queryHasStreetNumber) {
      // Specific property address - will open property details modal
      return {
        route: defaultRoute,
        state: { 
          searchQuery,
          addressData,
          searchType: 'specific_property'
        }
      };
    } else {
      // Area search - go to marketplace with filters
      return {
        route: defaultRoute,
        state: { 
          searchQuery,
          addressData,
          searchType: 'area_search'
        }
      };
    }
  }
}
