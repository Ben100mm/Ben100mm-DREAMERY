/**
 * TypeScript types for rental market data integration
 * Supports RentCast, FreeWebApi, and other rental data sources
 */

export interface RentalMarketData {
  // Rent estimates
  estimated_rent?: number;
  rent_range_low?: number;
  rent_range_high?: number;
  
  // Market metrics
  market_rent_per_sqft?: number;
  vacancy_rate?: number;
  rent_growth_rate?: number;
  
  // Property details
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  
  // Location data
  zip_code?: string;
  city?: string;
  state?: string;
  
  // Data source and freshness
  data_source?: string;
  last_updated?: string;
  confidence_score?: number;
}

export interface RentCastData {
  property_id: string;
  estimated_rent?: number;
  rent_range_low?: number;
  rent_range_high?: number;
  confidence?: string;
  last_updated?: string;
}

export interface FreeWebApiData {
  property_id: string;
  zestimate_rent?: number;
  rent_zestimate_range_low?: number;
  rent_zestimate_range_high?: number;
  last_updated?: string;
}

export interface RentalEstimateRequest {
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  zip_code?: string;
  city?: string;
  state?: string;
}

export interface RentalEstimateResponse {
  success: boolean;
  rental_data?: RentalMarketData;
  error?: string;
}

export interface RentCastResponse {
  success: boolean;
  rentcast_data?: RentCastData;
  error?: string;
}

export interface FreeWebApiResponse {
  success: boolean;
  freewebapi_data?: FreeWebApiData;
  error?: string;
}

// Rental market analysis types
export interface RentalMarketAnalysis {
  property_id: string;
  address: string;
  current_rent?: number;
  market_rent: number;
  rent_vs_market: number; // Percentage difference
  rent_per_sqft: number;
  market_rent_per_sqft: number;
  vacancy_rate?: number;
  rent_growth_rate?: number;
  confidence_score?: number;
  data_source: string;
  last_updated: string;
  analysis_date: string;
}

export interface RentalYieldAnalysis {
  property_id: string;
  purchase_price: number;
  estimated_rent: number;
  gross_yield: number; // Annual rent / purchase price
  net_yield: number; // After expenses
  cap_rate?: number;
  cash_flow?: number;
  roi?: number;
}

export interface RentalMarketTrends {
  location: string;
  period: string; // e.g., "2024", "Q1 2024"
  average_rent: number;
  rent_growth_yoy: number;
  vacancy_rate: number;
  new_listings: number;
  days_on_market: number;
  price_per_sqft: number;
}

// API service interfaces
export interface RentalDataService {
  getRentalEstimate(request: RentalEstimateRequest): Promise<RentalEstimateResponse>;
  getRentCastData(request: RentalEstimateRequest): Promise<RentCastResponse>;
  getFreeWebApiData(request: RentalEstimateRequest): Promise<FreeWebApiResponse>;
  analyzeRentalMarket(propertyId: string, purchasePrice: number): Promise<RentalYieldAnalysis>;
  getMarketTrends(location: string, period?: string): Promise<RentalMarketTrends[]>;
}

// Component props interfaces
export interface RentalDataCardProps {
  rentalData: RentalMarketData;
  showDetails?: boolean;
  className?: string;
}

export interface RentalAnalysisProps {
  propertyId: string;
  purchasePrice: number;
  currentRent?: number;
  onAnalysisComplete?: (analysis: RentalYieldAnalysis) => void;
}

export interface RentalMarketTrendsProps {
  location: string;
  period?: string;
  onTrendsLoaded?: (trends: RentalMarketTrends[]) => void;
}

// Utility types
export type RentalDataSource = 'RentCast' | 'FreeWebApi' | 'Zillow' | 'Unknown';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface RentalDataQuality {
  source: RentalDataSource;
  confidence: ConfidenceLevel;
  last_updated: string;
  completeness_score: number; // 0-100
  accuracy_score?: number; // 0-100
}

// Error types
export interface RentalDataError {
  code: string;
  message: string;
  source?: string;
  timestamp: string;
}

export interface RentalApiError extends RentalDataError {
  status_code: number;
  endpoint: string;
}
