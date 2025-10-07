/**
 * Market Data Service
 * 
 * Provides comprehensive market data integration for real estate analysis
 * Includes historical trends, market comparisons, and predictive analytics
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Core market data point with comprehensive metrics
 */
export interface MarketDataPoint {
  // Location identifiers
  zipCode: string;
  city?: string;
  state?: string;
  
  // Rent and Price metrics
  medianRent: number; // Monthly median rent
  medianPrice: number; // Median property sale price
  rentGrowth12mo: number; // Year-over-year rent growth percentage
  appreciationRate12mo: number; // Year-over-year price appreciation percentage
  
  // Market dynamics
  vacancyRate: number; // Percentage of vacant units
  daysOnMarket: number; // Average days properties spend on market
  foreclosureRate: number; // Percentage of properties in foreclosure
  
  // Quality of life metrics
  economicDiversityIndex: number; // 0-100, higher is more diverse economy
  crimeSafetyScore: number; // 0-100, higher is safer
  schoolRating: number; // 0-10, average school rating
  
  // Metadata
  dateUpdated: Date;
}

/**
 * Historical data series for trend analysis
 */
export interface MarketDataSeries {
  zipCode: string;
  dataPoints: MarketDataPoint[];
  startDate: Date;
  endDate: Date;
}

/**
 * Market health assessment
 */
export interface MarketHealthScore {
  overallScore: number; // 0-100
  category: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  strengths: string[];
  concerns: string[];
  breakdown: {
    priceGrowth: number;
    rentGrowth: number;
    marketLiquidity: number;
    economicStability: number;
    qualityOfLife: number;
  };
}

/**
 * Trend analysis results
 */
export interface TrendAnalysis {
  rentTrend: 'Rising' | 'Stable' | 'Declining';
  priceTrend: 'Rising' | 'Stable' | 'Declining';
  vacancyTrend: 'Improving' | 'Stable' | 'Worsening';
  momentumScore: number; // -100 to +100
  projectedRent12mo: number;
  projectedPrice12mo: number;
  confidence: number; // 0-100
}

/**
 * Market comparison result
 */
export interface MarketComparison {
  markets: {
    zipCode: string;
    data: MarketDataPoint;
    healthScore: MarketHealthScore;
  }[];
  bestMarket: string;
  rankingCriteria: string;
}

/**
 * API configuration
 */
interface APIConfig {
  baseURL: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * Cache configuration
 */
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxEntries: number;
  storageKey: string;
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_API_CONFIG: APIConfig = {
  baseURL: process.env.REACT_APP_MARKET_DATA_API || 'https://api.marketdata.com',
  apiKey: process.env.REACT_APP_MARKET_DATA_KEY,
  timeout: 10000,
  retryAttempts: 3,
};

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxEntries: 100,
  storageKey: 'marketDataCache',
};

// ============================================================================
// Cache Management
// ============================================================================

interface CacheEntry {
  data: MarketDataPoint;
  timestamp: number;
}

interface CacheStore {
  [zipCode: string]: CacheEntry;
}

class MarketDataCache {
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
  }

  /**
   * Get cached data for a zip code
   */
  get(zipCode: string): MarketDataPoint | null {
    try {
      const cacheStr = localStorage.getItem(this.config.storageKey);
      if (!cacheStr) return null;

      const cache: CacheStore = JSON.parse(cacheStr);
      const entry = cache[zipCode];

      if (!entry) return null;

      // Check if cache is still valid
      const age = Date.now() - entry.timestamp;
      if (age > this.config.ttl) {
        this.remove(zipCode);
        return null;
      }

      // Parse date back to Date object
      return {
        ...entry.data,
        dateUpdated: new Date(entry.data.dateUpdated),
      };
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cached data for a zip code
   */
  set(zipCode: string, data: MarketDataPoint): void {
    try {
      const cacheStr = localStorage.getItem(this.config.storageKey);
      const cache: CacheStore = cacheStr ? JSON.parse(cacheStr) : {};

      // Add new entry
      cache[zipCode] = {
        data,
        timestamp: Date.now(),
      };

      // Enforce max entries limit
      const entries = Object.entries(cache);
      if (entries.length > this.config.maxEntries) {
        // Remove oldest entries
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toRemove = entries.slice(0, entries.length - this.config.maxEntries);
        toRemove.forEach(([key]) => delete cache[key]);
      }

      localStorage.setItem(this.config.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Remove cached data for a zip code
   */
  remove(zipCode: string): void {
    try {
      const cacheStr = localStorage.getItem(this.config.storageKey);
      if (!cacheStr) return;

      const cache: CacheStore = JSON.parse(cacheStr);
      delete cache[zipCode];
      localStorage.setItem(this.config.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get all cached zip codes
   */
  getAll(): string[] {
    try {
      const cacheStr = localStorage.getItem(this.config.storageKey);
      if (!cacheStr) return [];

      const cache: CacheStore = JSON.parse(cacheStr);
      return Object.keys(cache);
    } catch (error) {
      console.error('Cache getAll error:', error);
      return [];
    }
  }
}

// ============================================================================
// Mock Data Generator (for testing/development)
// ============================================================================

/**
 * Generate mock market data for testing
 */
export function generateMockMarketData(zipCode: string): MarketDataPoint {
  // Use zip code to seed pseudo-random values for consistency
  const seed = parseInt(zipCode.replace(/\D/g, '')) || 12345;
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return min + ((x - Math.floor(x)) * (max - min));
  };

  return {
    zipCode,
    city: 'Sample City',
    state: 'CA',
    medianRent: Math.round(random(1500, 4500)),
    medianPrice: Math.round(random(300000, 1200000)),
    rentGrowth12mo: random(-5, 15),
    appreciationRate12mo: random(-10, 20),
    vacancyRate: random(2, 15),
    daysOnMarket: Math.round(random(15, 90)),
    foreclosureRate: random(0.1, 3),
    economicDiversityIndex: random(40, 95),
    crimeSafetyScore: random(50, 95),
    schoolRating: random(4, 9.5),
    dateUpdated: new Date(),
  };
}

// ============================================================================
// Market Data Service
// ============================================================================

export class MarketDataService {
  private cache: MarketDataCache;
  private apiConfig: APIConfig;

  constructor(
    apiConfig: APIConfig = DEFAULT_API_CONFIG,
    cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG,
  ) {
    this.cache = new MarketDataCache(cacheConfig);
    this.apiConfig = apiConfig;
  }

  /**
   * Fetch market data for a zip code
   * Uses cache first, then falls back to API
   */
  async fetchMarketData(
    zipCode: string,
    forceRefresh: boolean = false,
  ): Promise<MarketDataPoint> {
    // Validate zip code
    if (!this.isValidZipCode(zipCode)) {
      throw new Error(`Invalid zip code: ${zipCode}`);
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.cache.get(zipCode);
      if (cached) {
        console.log(`Using cached data for ${zipCode}`);
        return cached;
      }
    }

    // Fetch from API (or use mock data in development)
    try {
      const data = await this.fetchFromAPI(zipCode);
      this.cache.set(zipCode, data);
      return data;
    } catch (error) {
      console.error('API fetch failed, using mock data:', error);
      const mockData = generateMockMarketData(zipCode);
      this.cache.set(zipCode, mockData);
      return mockData;
    }
  }

  /**
   * Get historical market trends
   */
  async getHistoricalTrends(
    zipCode: string,
    months: number = 12,
  ): Promise<MarketDataSeries> {
    // In production, this would fetch historical data from API
    // For now, generate simulated historical data
    const currentData = await this.fetchMarketData(zipCode);
    const dataPoints: MarketDataPoint[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      // Simulate historical data with slight variations
      const variation = 1 - (i * 0.01); // Earlier months have slightly lower values
      dataPoints.push({
        ...currentData,
        medianRent: Math.round(currentData.medianRent * variation),
        medianPrice: Math.round(currentData.medianPrice * variation),
        dateUpdated: date,
      });
    }

    return {
      zipCode,
      dataPoints,
      startDate: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    };
  }

  /**
   * Compare multiple markets
   */
  async compareMarkets(zipCodes: string[]): Promise<MarketComparison> {
    const markets = await Promise.all(
      zipCodes.map(async (zipCode) => {
        const data = await this.fetchMarketData(zipCode);
        const healthScore = this.calculateMarketHealth(data);
        return { zipCode, data, healthScore };
      }),
    );

    // Rank by overall health score
    const sorted = [...markets].sort(
      (a, b) => b.healthScore.overallScore - a.healthScore.overallScore,
    );

    return {
      markets,
      bestMarket: sorted[0].zipCode,
      rankingCriteria: 'Overall Market Health Score',
    };
  }

  /**
   * Calculate market health score
   */
  calculateMarketHealth(data: MarketDataPoint): MarketHealthScore {
    const scores = {
      // Price growth score (0-20)
      priceGrowth: this.scoreMetric(data.appreciationRate12mo, -5, 15, 20),
      // Rent growth score (0-20)
      rentGrowth: this.scoreMetric(data.rentGrowth12mo, -3, 10, 20),
      // Market liquidity score (0-20, lower days on market is better)
      marketLiquidity: this.scoreMetric(data.daysOnMarket, 90, 15, 20, true),
      // Economic stability score (0-20)
      economicStability:
        (data.economicDiversityIndex / 100) * 10 +
        this.scoreMetric(data.foreclosureRate, 3, 0.1, 10, true),
      // Quality of life score (0-20)
      qualityOfLife:
        (data.crimeSafetyScore / 100) * 10 + (data.schoolRating / 10) * 10,
    };

    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    // Determine category
    let category: MarketHealthScore['category'];
    if (overallScore >= 85) category = 'Excellent';
    else if (overallScore >= 70) category = 'Good';
    else if (overallScore >= 55) category = 'Fair';
    else if (overallScore >= 40) category = 'Poor';
    else category = 'Critical';

    // Generate strengths and concerns
    const strengths: string[] = [];
    const concerns: string[] = [];

    if (scores.priceGrowth > 15) strengths.push('Strong price appreciation');
    else if (scores.priceGrowth < 8) concerns.push('Weak price growth');

    if (scores.rentGrowth > 15) strengths.push('Excellent rent growth');
    else if (scores.rentGrowth < 8) concerns.push('Stagnant rental income');

    if (scores.marketLiquidity > 15) strengths.push('High market liquidity');
    else if (scores.marketLiquidity < 8) concerns.push('Slow market conditions');

    if (scores.economicStability > 15) strengths.push('Stable economy');
    else if (scores.economicStability < 8) concerns.push('Economic concerns');

    if (scores.qualityOfLife > 15) strengths.push('Excellent quality of life');
    else if (scores.qualityOfLife < 8) concerns.push('Quality of life issues');

    if (data.vacancyRate < 5) strengths.push('Low vacancy rate');
    else if (data.vacancyRate > 10) concerns.push('High vacancy rate');

    return {
      overallScore,
      category,
      strengths,
      concerns,
      breakdown: scores,
    };
  }

  /**
   * Analyze market trends
   */
  identifyTrends(data: MarketDataPoint): TrendAnalysis {
    // Classify trends based on growth rates
    const rentTrend =
      data.rentGrowth12mo > 3 ? 'Rising' : data.rentGrowth12mo < -1 ? 'Declining' : 'Stable';
    const priceTrend =
      data.appreciationRate12mo > 4
        ? 'Rising'
        : data.appreciationRate12mo < -2
          ? 'Declining'
          : 'Stable';
    const vacancyTrend =
      data.vacancyRate < 5
        ? 'Improving'
        : data.vacancyRate > 10
          ? 'Worsening'
          : 'Stable';

    // Calculate momentum score
    const momentumScore =
      data.rentGrowth12mo * 3 +
      data.appreciationRate12mo * 4 -
      data.vacancyRate * 2 +
      (data.economicDiversityIndex - 50) / 5;

    // Project 12-month forward values
    const projectedRent12mo = data.medianRent * (1 + data.rentGrowth12mo / 100);
    const projectedPrice12mo = data.medianPrice * (1 + data.appreciationRate12mo / 100);

    // Calculate confidence based on data quality
    const confidence = Math.min(
      100,
      60 +
        (data.economicDiversityIndex > 60 ? 10 : 0) +
        (data.daysOnMarket < 45 ? 10 : 0) +
        (data.vacancyRate < 8 ? 10 : 0) +
        (data.foreclosureRate < 1.5 ? 10 : 0),
    );

    return {
      rentTrend,
      priceTrend,
      vacancyTrend,
      momentumScore: Math.max(-100, Math.min(100, momentumScore)),
      projectedRent12mo,
      projectedPrice12mo,
      confidence,
    };
  }

  /**
   * Generate investment recommendations based on market data
   */
  generateRecommendations(data: MarketDataPoint): string[] {
    const recommendations: string[] = [];
    const health = this.calculateMarketHealth(data);
    const trends = this.identifyTrends(data);

    // Overall market assessment
    if (health.overallScore >= 75) {
      recommendations.push(
        `Strong market: Overall score ${health.overallScore}/100 indicates favorable conditions`,
      );
    } else if (health.overallScore < 55) {
      recommendations.push(
        `Caution: Below-average market health score (${health.overallScore}/100) suggests increased risk`,
      );
    }

    // Price and rent trends
    if (trends.rentTrend === 'Rising' && trends.priceTrend === 'Rising') {
      recommendations.push('Positive momentum: Both rents and prices are appreciating');
    } else if (trends.rentTrend === 'Declining' || trends.priceTrend === 'Declining') {
      recommendations.push('Market cooling: Consider waiting for market stabilization');
    }

    // Vacancy considerations
    if (data.vacancyRate < 5) {
      recommendations.push('Low vacancy rate indicates strong rental demand');
    } else if (data.vacancyRate > 10) {
      recommendations.push(
        'High vacancy rate - factor in longer lease-up times and potential rent concessions',
      );
    }

    // Market liquidity
    if (data.daysOnMarket < 30) {
      recommendations.push('Fast-moving market: Properties sell quickly, consider competitive offers');
    } else if (data.daysOnMarket > 60) {
      recommendations.push(
        'Slow market: More room for negotiation, but potentially lower exit liquidity',
      );
    }

    // Economic diversity
    if (data.economicDiversityIndex < 50) {
      recommendations.push(
        'Limited economic diversity - increased risk from single industry downturns',
      );
    }

    // Quality of life
    if (data.schoolRating > 8) {
      recommendations.push('Excellent schools: Attractive to families, supports rent premiums');
    }
    if (data.crimeSafetyScore < 60) {
      recommendations.push('Safety concerns: May impact rental demand and property values');
    }

    return recommendations;
  }

  /**
   * Apply market data to deal assumptions
   */
  applyMarketDataToAssumptions(
    data: MarketDataPoint,
  ): {
    suggestedRent: number;
    suggestedAppreciation: number;
    suggestedVacancy: number;
    adjustmentRationale: string[];
  } {
    const rationale: string[] = [];

    // Suggest rent based on median
    const suggestedRent = data.medianRent;
    rationale.push(`Median rent in ${data.zipCode}: $${suggestedRent.toLocaleString()}/mo`);

    // Suggest appreciation rate
    const suggestedAppreciation = Math.max(0, Math.min(15, data.appreciationRate12mo));
    rationale.push(
      `12-month appreciation rate: ${data.appreciationRate12mo.toFixed(1)}% (using ${suggestedAppreciation.toFixed(1)}%)`,
    );

    // Suggest vacancy rate with buffer
    const suggestedVacancy = Math.max(5, data.vacancyRate + 2); // Add 2% buffer
    rationale.push(
      `Market vacancy ${data.vacancyRate.toFixed(1)}% + 2% buffer = ${suggestedVacancy.toFixed(1)}%`,
    );

    return {
      suggestedRent,
      suggestedAppreciation,
      suggestedVacancy,
      adjustmentRationale: rationale,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Fetch data from API
   */
  private async fetchFromAPI(zipCode: string): Promise<MarketDataPoint> {
    // In production, implement actual API call
    // For now, use mock data
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    return generateMockMarketData(zipCode);
  }

  /**
   * Validate zip code format
   */
  private isValidZipCode(zipCode: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  }

  /**
   * Score a metric on a scale from min to max
   */
  private scoreMetric(
    value: number,
    min: number,
    max: number,
    maxScore: number,
    inverse: boolean = false,
  ): number {
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const score = inverse ? 1 - normalized : normalized;
    return score * maxScore;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let serviceInstance: MarketDataService | null = null;

/**
 * Get singleton instance of MarketDataService
 */
export function getMarketDataService(): MarketDataService {
  if (!serviceInstance) {
    serviceInstance = new MarketDataService();
  }
  return serviceInstance;
}

/**
 * Reset singleton instance (useful for testing)
 */
export function resetMarketDataService(): void {
  serviceInstance = null;
}

// ============================================================================
// Exports
// ============================================================================

export default MarketDataService;

