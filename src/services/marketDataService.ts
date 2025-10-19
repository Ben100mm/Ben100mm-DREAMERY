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
 * Market risk data for risk analysis integration
 */
export interface MarketRiskData {
  address: string;
  zipCode: string;
  marketVolatilityScore: number; // 1-10, higher = more volatile
  locationStabilityScore: number; // 1-10, higher = more stable
  recommendations: string[];
  dataQuality: 'High' | 'Medium' | 'Low';
  lastUpdated: Date;
  underlyingData?: MarketDataPoint; // Optional raw data
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

  /**
   * Fetch market risk data for a given address
   * Returns data-driven risk scores and recommendations
   * 
   * @param address - Full address or zip code
   * @returns MarketRiskData with volatility and stability scores
   */
  async fetchMarketRiskData(address: string): Promise<MarketRiskData> {
    // Extract zip code from address
    const zipCode = this.extractZipCode(address);
    
    if (!zipCode) {
      throw new Error(`Unable to extract valid zip code from address: ${address}`);
    }

    // Fetch market data
    const data = await this.fetchMarketData(zipCode);

    // Calculate market volatility score (1-10, higher = more volatile)
    const marketVolatilityScore = this.calculateMarketVolatility(data);

    // Calculate location stability score (1-10, higher = more stable)
    const locationStabilityScore = this.calculateLocationStability(data);

    // Generate recommendations
    const recommendations = this.generateRiskRecommendations(
      data,
      marketVolatilityScore,
      locationStabilityScore,
    );

    // Assess data quality
    const dataQuality = this.assessDataQuality(data);

    return {
      address,
      zipCode,
      marketVolatilityScore,
      locationStabilityScore,
      recommendations,
      dataQuality,
      lastUpdated: data.dateUpdated,
      underlyingData: data,
    };
  }

  /**
   * Calculate market volatility score (1-10)
   * Calibrated against national averages
   * Higher score = more volatile/risky market
   */
  private calculateMarketVolatility(data: MarketDataPoint): number {
    return this.calculateVolatilityScore(data);
  }

  /**
   * Calculate volatility score using calibrated thresholds
   * Calibrated against national averages for more accurate risk assessment
   */
  private calculateVolatilityScore(data: MarketDataPoint): number {
    let volatilityPoints = 0;

    // RENT GROWTH VOLATILITY (calibrated against national avg ~3-4%)
    // Higher absolute change = more volatility
    const absRentGrowth = Math.abs(data.rentGrowth12mo);
    if (absRentGrowth > 8) {
      volatilityPoints += 3; // Extreme volatility
    } else if (absRentGrowth > 5) {
      volatilityPoints += 2; // High volatility
    } else if (absRentGrowth < 2) {
      volatilityPoints -= 1; // Very stable (bonus)
    }
    // 2-5% is normal range (0 points)

    // PRICE APPRECIATION VOLATILITY (calibrated against national avg ~4-6%)
    // Extreme swings indicate unstable market
    const absAppreciation = Math.abs(data.appreciationRate12mo);
    if (absAppreciation > 15) {
      volatilityPoints += 2; // Very volatile
    } else if (absAppreciation < 3) {
      volatilityPoints -= 1; // Very stable (bonus)
    }
    // 3-15% is normal range (0 points)

    // VACANCY RATE (calibrated against national avg ~6-7%)
    // High vacancy = market instability
    if (data.vacancyRate > 10) {
      volatilityPoints += 2; // High vacancy = unstable
    } else if (data.vacancyRate > 7) {
      volatilityPoints += 1; // Above average
    } else if (data.vacancyRate < 4) {
      volatilityPoints -= 1; // Very tight market (bonus)
    }
    // 4-7% is normal range (0 points)

    // DAYS ON MARKET (calibrated against national avg ~40-50 days)
    // Longer DOM = less liquidity/volatility
    if (data.daysOnMarket > 75) {
      volatilityPoints += 1; // Slow market
    } else if (data.daysOnMarket < 30) {
      volatilityPoints -= 1; // Fast market (bonus)
    }

    // FORECLOSURE RATE (calibrated against national avg ~1%)
    // High foreclosures = economic stress
    if (data.foreclosureRate > 2.5) {
      volatilityPoints += 2; // High stress
    } else if (data.foreclosureRate > 1.5) {
      volatilityPoints += 1; // Moderate stress
    } else if (data.foreclosureRate < 0.5) {
      volatilityPoints -= 1; // Very healthy (bonus)
    }

    // Convert to 1-10 scale
    // Base is 5.5, adjust by points (can go below 1 or above 10, but we'll clamp)
    const rawScore = 5.5 + volatilityPoints;
    const score = Math.min(10, Math.max(1, rawScore));
    
    return Math.round(score * 10) / 10; // Round to 1 decimal
  }

  /**
   * Calculate location stability score (1-10)
   * Calibrated against national averages
   * Higher score = more stable/desirable location
   */
  private calculateLocationStability(data: MarketDataPoint): number {
    return this.calculateLocationStabilityScore(data);
  }

  /**
   * Calculate location stability score using calibrated thresholds
   * Based on economic diversity, foreclosure rate, days on market, safety score, and school rating
   */
  private calculateLocationStabilityScore(data: MarketDataPoint): number {
    let stabilityPoints = 0;

    // ECONOMIC DIVERSITY INDEX (calibrated against national avg ~65)
    // Higher diversity = more resilient to economic shocks
    if (data.economicDiversityIndex > 80) {
      stabilityPoints += 3; // Highly diverse, very stable
    } else if (data.economicDiversityIndex > 70) {
      stabilityPoints += 2; // Above average diversity
    } else if (data.economicDiversityIndex > 60) {
      stabilityPoints += 1; // Average diversity
    } else if (data.economicDiversityIndex < 45) {
      stabilityPoints -= 2; // Single-industry risk
    } else if (data.economicDiversityIndex < 55) {
      stabilityPoints -= 1; // Below average diversity
    }

    // FORECLOSURE RATE (calibrated against national avg ~1%)
    // Lower foreclosures = stable community
    if (data.foreclosureRate < 0.5) {
      stabilityPoints += 2; // Very healthy market
    } else if (data.foreclosureRate < 1.0) {
      stabilityPoints += 1; // Below average foreclosures
    } else if (data.foreclosureRate > 2.5) {
      stabilityPoints -= 2; // High distress
    } else if (data.foreclosureRate > 1.5) {
      stabilityPoints -= 1; // Above average foreclosures
    }

    // DAYS ON MARKET (calibrated against national avg ~40-50 days)
    // Faster sales = more desirable location
    if (data.daysOnMarket < 30) {
      stabilityPoints += 2; // Hot market, very desirable
    } else if (data.daysOnMarket < 45) {
      stabilityPoints += 1; // Above average desirability
    } else if (data.daysOnMarket > 75) {
      stabilityPoints -= 1; // Slow market
    } else if (data.daysOnMarket > 90) {
      stabilityPoints -= 2; // Very slow market
    }

    // CRIME/SAFETY SCORE (calibrated against national avg ~70)
    // Higher safety = more stable, desirable location
    if (data.crimeSafetyScore > 85) {
      stabilityPoints += 2; // Very safe
    } else if (data.crimeSafetyScore > 75) {
      stabilityPoints += 1; // Above average safety
    } else if (data.crimeSafetyScore < 55) {
      stabilityPoints -= 2; // Safety concerns
    } else if (data.crimeSafetyScore < 65) {
      stabilityPoints -= 1; // Below average safety
    }

    // SCHOOL RATING (calibrated against national avg ~6-7)
    // Better schools = family appeal, stability
    if (data.schoolRating > 8.5) {
      stabilityPoints += 2; // Excellent schools
    } else if (data.schoolRating > 7.5) {
      stabilityPoints += 1; // Above average schools
    } else if (data.schoolRating < 5) {
      stabilityPoints -= 1; // Below average schools
    }

    // Convert to 1-10 scale
    // Base is 5.5, adjust by points
    const rawScore = 5.5 + stabilityPoints;
    const score = Math.min(10, Math.max(1, rawScore));
    
    return Math.round(score * 10) / 10; // Round to 1 decimal
  }

  /**
   * Generate data-driven recommendations based on market data
   * Uses calibrated thresholds and actual metrics
   */
  private generateRiskRecommendations(
    data: MarketDataPoint,
    volatilityScore: number,
    stabilityScore: number,
  ): string[] {
    return this.generateDataDrivenRecommendations(data, volatilityScore, stabilityScore);
  }

  /**
   * Generate data-driven recommendations based on actual market metrics
   * Calibrated against national averages for actionable insights
   */
  private generateDataDrivenRecommendations(
    data: MarketDataPoint,
    volatilityScore: number,
    stabilityScore: number,
  ): string[] {
    const recommendations: string[] = [];

    // RENT GROWTH VOLATILITY ASSESSMENT (calibrated vs national avg 3-4%)
    const absRentGrowth = Math.abs(data.rentGrowth12mo);
    if (absRentGrowth > 8) {
      recommendations.push(
        `⚠️ Extreme rent volatility (${data.rentGrowth12mo.toFixed(1)}% vs 3-4% national avg): High income uncertainty - use conservative projections`,
      );
    } else if (absRentGrowth > 5) {
      recommendations.push(
        `Elevated rent volatility (${data.rentGrowth12mo.toFixed(1)}%): Factor in potential rent fluctuations`,
      );
    } else if (absRentGrowth < 2) {
      recommendations.push(
        `✓ Stable rent growth (${data.rentGrowth12mo.toFixed(1)}%): Predictable income stream`,
      );
    }

    // PRICE APPRECIATION ASSESSMENT (calibrated vs national avg 4-6%)
    const absAppreciation = Math.abs(data.appreciationRate12mo);
    if (absAppreciation > 15) {
      recommendations.push(
        `⚠️ High price volatility (${data.appreciationRate12mo.toFixed(1)}% vs 4-6% avg): Potential bubble risk or rapid correction`,
      );
    } else if (data.appreciationRate12mo < 0) {
      recommendations.push(
        `Market correction phase (${data.appreciationRate12mo.toFixed(1)}%): Consider timing and entry price carefully`,
      );
    } else if (absAppreciation < 3) {
      recommendations.push(
        `✓ Stable appreciation (${data.appreciationRate12mo.toFixed(1)}%): Lower speculation risk`,
      );
    }

    // VACANCY RATE ASSESSMENT (calibrated vs national avg 6-7%)
    if (data.vacancyRate > 10) {
      recommendations.push(
        `⚠️ High vacancy (${data.vacancyRate.toFixed(1)}% vs 6-7% avg): Factor in 2-3 month lease-up time and possible concessions`,
      );
    } else if (data.vacancyRate > 7) {
      recommendations.push(
        `Above-average vacancy (${data.vacancyRate.toFixed(1)}%): Plan for standard 1-2 month lease-up`,
      );
    } else if (data.vacancyRate < 4) {
      recommendations.push(
        `✓ Tight rental market (${data.vacancyRate.toFixed(1)}%): Strong rental demand, potential for rent growth`,
      );
    }

    // DAYS ON MARKET ASSESSMENT (calibrated vs national avg 40-50 days)
    if (data.daysOnMarket > 75) {
      recommendations.push(
        `Slow market (${Math.round(data.daysOnMarket)} days vs 40-50 avg): Lower exit liquidity - plan longer holding period`,
      );
    } else if (data.daysOnMarket < 30) {
      recommendations.push(
        `✓ Hot market (${Math.round(data.daysOnMarket)} days): High demand area, good exit liquidity`,
      );
    }

    // FORECLOSURE RATE ASSESSMENT (calibrated vs national avg 1%)
    if (data.foreclosureRate > 2.5) {
      recommendations.push(
        `⚠️ High foreclosure rate (${data.foreclosureRate.toFixed(1)}% vs 1% avg): Economic distress - verify employment stability`,
      );
    } else if (data.foreclosureRate < 0.5) {
      recommendations.push(
        `✓ Healthy market (${data.foreclosureRate.toFixed(1)}% foreclosures): Strong economic fundamentals`,
      );
    }

    // ECONOMIC DIVERSITY ASSESSMENT (calibrated vs national avg 65)
    if (data.economicDiversityIndex < 45) {
      recommendations.push(
        `⚠️ Low economic diversity (${data.economicDiversityIndex.toFixed(0)}/100 vs 65 avg): Single-industry risk - research top 3 employers`,
      );
    } else if (data.economicDiversityIndex > 80) {
      recommendations.push(
        `✓ Diverse economy (${data.economicDiversityIndex.toFixed(0)}/100): Resilient to industry-specific downturns`,
      );
    }

    // SAFETY ASSESSMENT (calibrated vs national avg 70)
    if (data.crimeSafetyScore < 55) {
      recommendations.push(
        `⚠️ Safety concerns (${data.crimeSafetyScore.toFixed(0)}/100 vs 70 avg): May impact insurance (+15-25%) and tenant quality`,
      );
    } else if (data.crimeSafetyScore > 85) {
      recommendations.push(
        `✓ Safe area (${data.crimeSafetyScore.toFixed(0)}/100): Appeals to quality tenants, supports rent premiums`,
      );
    }

    // SCHOOL RATING ASSESSMENT (calibrated vs national avg 6-7)
    if (data.schoolRating < 5) {
      recommendations.push(
        `Below-average schools (${data.schoolRating.toFixed(1)}/10 vs 6-7 avg): Limited family appeal - target working professionals`,
      );
    } else if (data.schoolRating > 8.5) {
      recommendations.push(
        `✓ Excellent schools (${data.schoolRating.toFixed(1)}/10): Strong family demand, long-term tenant stability`,
      );
    }

    // COMBINED RISK ASSESSMENT
    if (volatilityScore > 7 && stabilityScore < 5) {
      recommendations.push(
        `🚨 HIGH RISK: Volatility ${volatilityScore}/10 + Stability ${stabilityScore}/10 = Significant investment risk`,
      );
      recommendations.push(
        'Consider: 50% higher down payment, 12-month reserves, conservative cap rate (+1-2%)',
      );
    } else if (volatilityScore < 4 && stabilityScore > 7) {
      recommendations.push(
        `✅ FAVORABLE: Volatility ${volatilityScore}/10 + Stability ${stabilityScore}/10 = Lower-risk investment opportunity`,
      );
    } else if (volatilityScore >= 6 || stabilityScore <= 6) {
      recommendations.push(
        `Moderate risk profile: Run stress tests for 20% income drop and 15% expense increase scenarios`,
      );
    }

    // CASH RESERVE RECOMMENDATION (data-driven)
    const buffer = this.calculateRecommendedBuffer(volatilityScore, stabilityScore);
    recommendations.push(
      `💰 Recommended reserves: ${buffer} months (covers ${(buffer * data.medianRent).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`,
    );

    return recommendations;
  }

  /**
   * Calculate recommended cash reserve buffer based on risk scores
   */
  private calculateRecommendedBuffer(
    volatilityScore: number,
    stabilityScore: number,
  ): number {
    // Base buffer is 3 months
    let buffer = 3;

    // Add months for high volatility
    if (volatilityScore > 7) {
      buffer += 3;
    } else if (volatilityScore > 5) {
      buffer += 2;
    } else if (volatilityScore > 3) {
      buffer += 1;
    }

    // Add months for low stability
    if (stabilityScore < 4) {
      buffer += 3;
    } else if (stabilityScore < 6) {
      buffer += 2;
    } else if (stabilityScore < 8) {
      buffer += 1;
    }

    return Math.min(12, buffer); // Cap at 12 months
  }

  /**
   * Assess the quality of the underlying data
   */
  private assessDataQuality(data: MarketDataPoint): 'High' | 'Medium' | 'Low' {
    const now = new Date();
    const dataAge = now.getTime() - data.dateUpdated.getTime();
    const daysOld = dataAge / (1000 * 60 * 60 * 24);

    // Check data freshness
    if (daysOld > 90) return 'Low'; // Data older than 3 months
    if (daysOld > 30) return 'Medium'; // Data older than 1 month

    // Check completeness
    const hasAllQualityMetrics =
      data.economicDiversityIndex > 0 &&
      data.crimeSafetyScore > 0 &&
      data.schoolRating > 0;

    if (!hasAllQualityMetrics) return 'Medium';

    return 'High';
  }

  /**
   * Extract zip code from an address string
   */
  private extractZipCode(address: string): string | null {
    // Try to find 5-digit zip code
    const zipMatch = address.match(/\b\d{5}(?:-\d{4})?\b/);
    if (zipMatch) {
      return zipMatch[0];
    }

    // If address is already just a zip code
    if (this.isValidZipCode(address)) {
      return address;
    }

    return null;
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

