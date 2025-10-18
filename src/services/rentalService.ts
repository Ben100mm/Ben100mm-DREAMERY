/**
 * Rental Market Data Service
 * Handles API calls to rental market data endpoints
 */

import {
  RentalEstimateRequest,
  RentalEstimateResponse,
  RentCastResponse,
  FreeWebApiResponse,
  RentalMarketData,
  RentCastData,
  FreeWebApiData,
  RentalYieldAnalysis,
  RentalMarketTrends,
  RentalDataService
} from '../types/rental';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

class RentalService implements RentalDataService {
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    data?: any
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method === 'POST') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive rental market data from available APIs
   */
  async getRentalEstimate(request: RentalEstimateRequest): Promise<RentalEstimateResponse> {
    try {
      const response = await this.makeRequest<RentalEstimateResponse>(
        '/rental/estimate',
        'POST',
        request
      );
      return response;
    } catch (error) {
      console.error('Error getting rental estimate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get rental data specifically from RentCast API
   */
  async getRentCastData(request: RentalEstimateRequest): Promise<RentCastResponse> {
    try {
      const response = await this.makeRequest<RentCastResponse>(
        '/rental/rentcast',
        'POST',
        request
      );
      return response;
    } catch (error) {
      console.error('Error getting RentCast data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get rental data specifically from FreeWebApi
   */
  async getFreeWebApiData(request: RentalEstimateRequest): Promise<FreeWebApiResponse> {
    try {
      const response = await this.makeRequest<FreeWebApiResponse>(
        '/rental/freewebapi',
        'POST',
        request
      );
      return response;
    } catch (error) {
      console.error('Error getting FreeWebApi data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Analyze rental yield for a property
   */
  async analyzeRentalMarket(propertyId: string, purchasePrice: number): Promise<RentalYieldAnalysis> {
    // This would typically call a backend endpoint that combines rental data with financial analysis
    // For now, we'll return a mock implementation
    return {
      property_id: propertyId,
      purchase_price: purchasePrice,
      estimated_rent: 0, // Would be populated from rental data
      gross_yield: 0,
      net_yield: 0,
      cap_rate: 0,
      cash_flow: 0,
      roi: 0
    };
  }

  /**
   * Get market trends for a location
   */
  async getMarketTrends(location: string, period?: string): Promise<RentalMarketTrends[]> {
    // This would typically call a backend endpoint that aggregates market data
    // For now, we'll return a mock implementation
    return [];
  }

  /**
   * Get rental data for multiple properties in batch
   */
  async getBatchRentalData(requests: RentalEstimateRequest[]): Promise<RentalEstimateResponse[]> {
    const promises = requests.map(request => this.getRentalEstimate(request));
    return Promise.all(promises);
  }

  /**
   * Compare rental data from different sources
   */
  async compareRentalSources(request: RentalEstimateRequest): Promise<{
    rentcast?: RentCastData;
    freewebapi?: FreeWebApiData;
    comparison: {
      average_rent: number;
      rent_range: { min: number; max: number };
      confidence_scores: { rentcast?: number; freewebapi?: number };
    };
  }> {
    const [rentcastResponse, freewebapiResponse] = await Promise.all([
      this.getRentCastData(request),
      this.getFreeWebApiData(request)
    ]);

    const rentcast = rentcastResponse.success ? rentcastResponse.rentcast_data : undefined;
    const freewebapi = freewebapiResponse.success ? freewebapiResponse.freewebapi_data : undefined;

    const rents = [
      rentcast?.estimated_rent,
      freewebapi?.zestimate_rent
    ].filter((rent): rent is number => rent !== undefined);

    const rentRanges = [
      { min: rentcast?.rent_range_low, max: rentcast?.rent_range_high },
      { min: freewebapi?.rent_zestimate_range_low, max: freewebapi?.rent_zestimate_range_high }
    ].filter(range => range.min !== undefined && range.max !== undefined);

    return {
      rentcast,
      freewebapi,
      comparison: {
        average_rent: rents.length > 0 ? rents.reduce((sum, rent) => sum + rent, 0) / rents.length : 0,
        rent_range: {
          min: rentRanges.length > 0 ? Math.min(...rentRanges.map(r => r.min!)) : 0,
          max: rentRanges.length > 0 ? Math.max(...rentRanges.map(r => r.max!)) : 0
        },
        confidence_scores: {
          rentcast: rentcast ? 0.8 : undefined, // Mock confidence score
          freewebapi: freewebapi ? 0.7 : undefined
        }
      }
    };
  }

  /**
   * Validate rental data quality
   */
  validateRentalData(data: RentalMarketData): {
    is_valid: boolean;
    issues: string[];
    quality_score: number;
  } {
    const issues: string[] = [];
    let quality_score = 100;

    if (!data.estimated_rent) {
      issues.push('Missing estimated rent');
      quality_score -= 30;
    }

    if (!data.data_source) {
      issues.push('Missing data source');
      quality_score -= 10;
    }

    if (!data.last_updated) {
      issues.push('Missing last updated timestamp');
      quality_score -= 10;
    }

    if (data.confidence_score && data.confidence_score < 0.5) {
      issues.push('Low confidence score');
      quality_score -= 20;
    }

    if (data.rent_range_low && data.rent_range_high && data.rent_range_low > data.rent_range_high) {
      issues.push('Invalid rent range (low > high)');
      quality_score -= 15;
    }

    return {
      is_valid: issues.length === 0,
      issues,
      quality_score: Math.max(0, quality_score)
    };
  }
}

// Export singleton instance
export const rentalService = new RentalService();
export default rentalService;
