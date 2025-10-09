/**
 * Address Autocomplete Service
 * Provides multi-source address suggestions with ranking and validation
 */

import { realtorService } from './realtorService';

export interface AddressSuggestion {
  id: string;
  displayName: string;
  fullAddress: string;
  type: 'address' | 'street' | 'neighborhood' | 'city' | 'zip' | 'area';
  confidence: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  metadata?: {
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface AddressSearchResult {
  suggestions: AddressSuggestion[];
  total: number;
  hasMore: boolean;
  timestamp?: number;
}

class AddressAutocompleteService {
  private cache = new Map<string, AddressSearchResult>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MIN_QUERY_LENGTH = 2;
  private readonly MAX_SUGGESTIONS = 10;

  /**
   * Get address suggestions from multiple sources
   */
  async getSuggestions(query: string): Promise<AddressSuggestion[]> {
    if (!query || query.length < this.MIN_QUERY_LENGTH) {
      return [];
    }

    const normalizedQuery = this.normalizeQuery(query);
    
    // Check cache first
    const cached = this.getCachedResult(normalizedQuery);
    if (cached) {
      return cached.suggestions;
    }

    try {
      // Fetch from multiple sources in parallel
      const [realtorSuggestions, googleSuggestions] = await Promise.allSettled([
        this.getRealtorSuggestions(normalizedQuery),
        this.getGooglePlacesSuggestions(normalizedQuery)
      ]);

      // Combine and rank results
      const allSuggestions = this.combineSuggestions([
        realtorSuggestions.status === 'fulfilled' ? realtorSuggestions.value : [],
        googleSuggestions.status === 'fulfilled' ? googleSuggestions.value : []
      ]);

      const rankedSuggestions = this.rankSuggestions(allSuggestions, normalizedQuery);
      const topSuggestions = rankedSuggestions.slice(0, this.MAX_SUGGESTIONS);

      // Cache the results
      this.cacheResult(normalizedQuery, {
        suggestions: topSuggestions,
        total: rankedSuggestions.length,
        hasMore: rankedSuggestions.length > this.MAX_SUGGESTIONS
      });

      return topSuggestions;
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  }

  /**
   * Get suggestions from Realtor.com API
   */
  private async getRealtorSuggestions(query: string): Promise<AddressSuggestion[]> {
    try {
      const suggestions = await realtorService.getPropertySuggestions(query, 10);
      
      return suggestions.map((suggestion, index) => ({
        id: `realtor-${index}`,
        displayName: suggestion,
        fullAddress: suggestion,
        type: this.determineAddressType(suggestion),
        confidence: 0.8,
        metadata: this.extractMetadata(suggestion)
      }));
    } catch (error) {
      console.error('Error fetching Realtor suggestions:', error);
      return [];
    }
  }

  /**
   * Get suggestions from Google Places API (placeholder for future implementation)
   */
  private async getGooglePlacesSuggestions(query: string): Promise<AddressSuggestion[]> {
    // TODO: Implement Google Places API integration
    // For now, return empty array
    return [];
  }

  /**
   * Combine suggestions from multiple sources and deduplicate
   */
  private combineSuggestions(suggestionArrays: AddressSuggestion[][]): AddressSuggestion[] {
    const seen = new Set<string>();
    const combined: AddressSuggestion[] = [];

    for (const suggestions of suggestionArrays) {
      for (const suggestion of suggestions) {
        const key = suggestion.fullAddress.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(suggestion);
        }
      }
    }

    return combined;
  }

  /**
   * Rank suggestions by relevance
   */
  private rankSuggestions(suggestions: AddressSuggestion[], query: string): AddressSuggestion[] {
    const normalizedQuery = query.toLowerCase();

    return suggestions.sort((a, b) => {
      // Exact matches get highest priority
      const aExact = a.fullAddress.toLowerCase().includes(normalizedQuery);
      const bExact = b.fullAddress.toLowerCase().includes(normalizedQuery);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Type priority: address > street > neighborhood > city > zip > area
      const typePriority = { address: 0, street: 1, neighborhood: 2, city: 3, zip: 4, area: 5 };
      const aTypePriority = typePriority[a.type];
      const bTypePriority = typePriority[b.type];

      if (aTypePriority !== bTypePriority) {
        return aTypePriority - bTypePriority;
      }

      // Confidence score
      return b.confidence - a.confidence;
    });
  }

  /**
   * Determine the type of address based on content
   */
  private determineAddressType(address: string): AddressSuggestion['type'] {
    const lowerAddress = address.toLowerCase();
    
    // Check for street number (indicates specific address)
    if (/\d+\s/.test(address)) {
      return 'address';
    }
    
    // Check for street indicators
    if (/\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court|pl|place|way|cir|circle)\b/.test(lowerAddress)) {
      return 'street';
    }
    
    // Check for neighborhood indicators
    if (/\b(district|neighborhood|area|heights|hills|valley|park|gardens)\b/.test(lowerAddress)) {
      return 'neighborhood';
    }
    
    // Check for ZIP code
    if (/\b\d{5}(-\d{4})?\b/.test(address)) {
      return 'zip';
    }
    
    // Default to city/area
    return 'area';
  }

  /**
   * Extract metadata from address string
   */
  private extractMetadata(address: string): AddressSuggestion['metadata'] {
    // Simple metadata extraction - could be enhanced with more sophisticated parsing
    const parts = address.split(',').map(part => part.trim());
    
    const metadata: AddressSuggestion['metadata'] = {};
    
    if (parts.length >= 2) {
      metadata.city = parts[parts.length - 2];
      metadata.state = parts[parts.length - 1];
    }
    
    if (parts.length >= 3) {
      metadata.zip = parts[parts.length - 1].match(/\d{5}(-\d{4})?/)?.[0];
    }
    
    metadata.country = 'US'; // Default for now
    
    return metadata;
  }

  /**
   * Normalize search query
   */
  private normalizeQuery(query: string): string {
    return query
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s,.-]/g, ''); // Remove special characters except common address punctuation
  }

  /**
   * Validate address format
   */
  validateAddress(address: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!address || address.trim().length === 0) {
      errors.push('Address is required');
    }
    
    if (address.length < 3) {
      errors.push('Address must be at least 3 characters long');
    }
    
    // Check for potentially malicious input
    if (/[<>'"&]/.test(address)) {
      errors.push('Address contains invalid characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Cache management
   */
  private getCachedResult(query: string): AddressSearchResult | null {
    const cached = this.cache.get(query);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached;
    }
    
    if (cached) {
      this.cache.delete(query);
    }
    
    return null;
  }

  private cacheResult(query: string, result: AddressSearchResult): void {
    this.cache.set(query, {
      ...result,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries
    if (this.cache.size > 100) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 20 entries
      for (let i = 0; i < 20 && i < entries.length; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get recent searches (placeholder for future implementation)
   */
  async getRecentSearches(): Promise<AddressSuggestion[]> {
    // TODO: Implement recent searches from localStorage or backend
    return [];
  }
}

// Export singleton instance
export const addressAutocompleteService = new AddressAutocompleteService();
export default AddressAutocompleteService;
