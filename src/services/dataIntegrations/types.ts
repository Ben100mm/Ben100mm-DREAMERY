/**
 * Common types and interfaces for data integration framework
 */

// ============================================================================
// Core Data Structures
// ============================================================================

/**
 * Standard market data structure from any source
 */
export interface StandardMarketData {
  zipCode: string;
  city?: string;
  state?: string;
  
  // Financial metrics
  medianRent: number;
  medianPrice: number;
  rentGrowth12mo: number;
  appreciationRate12mo: number;
  
  // Market dynamics
  vacancyRate: number;
  daysOnMarket: number;
  foreclosureRate: number;
  
  // Quality metrics
  economicDiversityIndex: number;
  crimeSafetyScore: number;
  schoolRating: number;
  
  // Metadata
  dateUpdated: Date;
  dataSource: DataSource;
  confidence: number; // 0-100
}

/**
 * Data source enumeration
 */
export enum DataSource {
  ZILLOW = 'zillow',
  REALTOR = 'realtor',
  CENSUS = 'census',
  MLS = 'mls',
  MOCK = 'mock',
  AGGREGATED = 'aggregated',
}

/**
 * Data source metadata
 */
export interface DataSourceMetadata {
  name: string;
  source: DataSource;
  isAvailable: boolean;
  apiVersion?: string;
  lastSuccessfulFetch?: Date;
  rateLimit?: {
    requestsPerMinute: number;
    requestsRemaining: number;
    resetTime?: Date;
  };
}

/**
 * API configuration for data sources
 */
export interface DataSourceConfig {
  enabled: boolean;
  apiKey?: string;
  baseURL?: string;
  timeout: number;
  retryAttempts: number;
  cacheTTL: number; // milliseconds
  priority: number; // Lower number = higher priority
}

/**
 * Fetch options
 */
export interface FetchOptions {
  forceRefresh?: boolean;
  timeout?: number;
  includeRawData?: boolean;
}

/**
 * Data quality assessment
 */
export interface DataQuality {
  completeness: number; // 0-100
  freshness: number; // 0-100
  accuracy: number; // 0-100
  overall: number; // 0-100
  warnings: string[];
}

// ============================================================================
// Adapter Interface
// ============================================================================

/**
 * Base interface for all data source adapters
 */
export interface DataSourceAdapter {
  /**
   * Fetch market data for a location
   */
  fetchData(zipCode: string, options?: FetchOptions): Promise<StandardMarketData>;
  
  /**
   * Check if the adapter is available and configured
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Get metadata about the data source
   */
  getMetadata(): DataSourceMetadata;
  
  /**
   * Test the connection to the data source
   */
  testConnection(): Promise<boolean>;
  
  /**
   * Get configuration
   */
  getConfig(): DataSourceConfig;
}

// ============================================================================
// Zillow-Specific Types
// ============================================================================

export interface ZillowResearchData {
  regionId: number;
  regionName: string;
  regionType: string;
  
  // Rent data
  rentZRI: number; // Zillow Rent Index
  rentZRIYoY: number; // Year-over-year change
  
  // Price data
  zhvi: number; // Zillow Home Value Index
  zhviYoY: number; // Year-over-year change
  
  // Inventory
  inventoryRaw: number;
  daysOnMarket: number;
  
  // Additional metrics
  priceToRentRatio: number;
  forecastedRentGrowth?: number;
  forecastedPriceGrowth?: number;
  
  date: string;
}

// ============================================================================
// Realtor.com-Specific Types
// ============================================================================

export interface RealtorEconomicData {
  zip: string;
  
  // Market metrics
  medianListPrice: number;
  medianListPriceYoY: number;
  medianSalePrice: number;
  
  // Inventory
  activeListingCount: number;
  newListingCount: number;
  pendingListingCount: number;
  
  // Market dynamics
  daysOnMarket: number;
  monthsOfSupply: number;
  priceReducedCount: number;
  
  // Economic indicators
  hotness_score?: number;
  
  date: string;
}

// ============================================================================
// Census Bureau-Specific Types
// ============================================================================

export interface CensusData {
  geoid: string;
  name: string;
  
  // Demographics
  population: number;
  medianAge: number;
  medianIncome: number;
  
  // Housing
  totalHousingUnits: number;
  occupiedHousingUnits: number;
  vacancyRate: number;
  medianHomeValue: number;
  medianGrossRent: number;
  
  // Economic
  unemploymentRate: number;
  povertyRate: number;
  
  // Education
  bachelorsOrHigher: number; // Percentage
  
  year: number;
}

// ============================================================================
// MLS-Specific Types
// ============================================================================

export interface MLSData {
  mlsNumber: string;
  mlsSource: string;
  
  // Location
  zipCode: string;
  subdivision?: string;
  
  // Market statistics
  averageSalePrice: number;
  medianSalePrice: number;
  averageListPrice: number;
  
  // Inventory
  activeListings: number;
  soldListings: number;
  pendingListings: number;
  
  // Performance
  averageDaysOnMarket: number;
  saleToPriceRatio: number; // Average (sale price / list price)
  
  // Trends
  monthOverMonthChange: number;
  yearOverYearChange: number;
  
  date: string;
}

// ============================================================================
// Aggregation Types
// ============================================================================

/**
 * Aggregated data from multiple sources
 */
export interface AggregatedMarketData extends StandardMarketData {
  sources: DataSource[];
  sourceData: Map<DataSource, Partial<StandardMarketData>>;
  aggregationStrategy: AggregationStrategy;
  qualityScores: Map<DataSource, DataQuality>;
}

/**
 * Aggregation strategy
 */
export enum AggregationStrategy {
  WEIGHTED_AVERAGE = 'weighted_average',
  PRIORITY = 'priority',
  BEST_QUALITY = 'best_quality',
  CONSENSUS = 'consensus',
}

/**
 * Aggregation configuration
 */
export interface AggregationConfig {
  strategy: AggregationStrategy;
  weights?: Map<DataSource, number>;
  minimumSources?: number;
  requiredSources?: DataSource[];
  conflictResolution?: ConflictResolution;
}

/**
 * Conflict resolution strategy
 */
export enum ConflictResolution {
  PREFER_NEWEST = 'prefer_newest',
  PREFER_HIGHEST_QUALITY = 'prefer_highest_quality',
  AVERAGE = 'average',
  MEDIAN = 'median',
}

// ============================================================================
// Error Types
// ============================================================================

export class DataSourceError extends Error {
  constructor(
    message: string,
    public source: DataSource,
    public statusCode?: number,
    public retryable: boolean = false,
  ) {
    super(message);
    this.name = 'DataSourceError';
  }
}

export class AggregationError extends Error {
  constructor(
    message: string,
    public failedSources: DataSource[],
    public partialData?: Partial<StandardMarketData>,
  ) {
    super(message);
    this.name = 'AggregationError';
  }
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Rate limiter state
 */
export interface RateLimiterState {
  requestCount: number;
  windowStart: number;
  limit: number;
}

/**
 * Cache entry
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  source: DataSource;
  expiresAt: number;
}

/**
 * Fetch result with metadata
 */
export interface FetchResult<T> {
  data: T;
  source: DataSource;
  fetchTime: number; // milliseconds
  cached: boolean;
  quality: DataQuality;
}

