/**
 * TypeScript interfaces for Realtor.com data structures
 * These interfaces match the Python models and parsers
 */

export enum PropertyType {
  SINGLE_FAMILY = "SINGLE_FAMILY",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  MULTI_FAMILY = "MULTI_FAMILY",
  LAND = "LAND",
  MOBILE = "MOBILE",
  MANUFACTURED = "MANUFACTURED",
  APARTMENT = "APARTMENT",
  CO_OP = "CO_OP",
  OTHER = "OTHER"
}

export enum ListingType {
  FOR_SALE = "for_sale",
  FOR_RENT = "for_rent",
  SOLD = "sold",
  PENDING = "pending",
  OFF_MARKET = "off_market"
}

export enum ReturnType {
  PYDANTIC = "pydantic",
  PANDAS = "pandas",
  RAW = "raw"
}

export enum SiteName {
  ZILLOW = "zillow",
  REDFIN = "redfin",
  REALTOR = "realtor.com"
}

export enum SearchPropertyType {
  SINGLE_FAMILY = "single_family",
  APARTMENT = "apartment",
  CONDOS = "condos",
  CONDO_TOWNHOME_ROWHOME_COOP = "condo_townhome_rowhome_coop",
  CONDO_TOWNHOME = "condo_townhome",
  TOWNHOMES = "townhomes",
  DUPLEX_TRIPLEX = "duplex_triplex",
  FARM = "farm",
  LAND = "land",
  MULTI_FAMILY = "multi_family",
  MOBILE = "mobile"
}

export enum PropertyType {
  APARTMENT = "APARTMENT",
  BUILDING = "BUILDING",
  COMMERCIAL = "COMMERCIAL",
  GOVERNMENT = "GOVERNMENT",
  INDUSTRIAL = "INDUSTRIAL",
  CONDO_TOWNHOME = "CONDO_TOWNHOME",
  CONDO_TOWNHOME_ROWHOME_COOP = "CONDO_TOWNHOME_ROWHOME_COOP",
  CONDO = "CONDO",
  CONDOP = "CONDOP",
  CONDOS = "CONDOS",
  COOP = "COOP",
  DUPLEX_TRIPLEX = "DUPLEX_TRIPLEX",
  FARM = "FARM",
  INVESTMENT = "INVESTMENT",
  LAND = "LAND",
  MOBILE = "MOBILE",
  MULTI_FAMILY = "MULTI_FAMILY",
  RENTAL = "RENTAL",
  SINGLE_FAMILY = "SINGLE_FAMILY",
  TOWNHOMES = "TOWNHOMES",
  OTHER = "OTHER"
}

export interface Address {
  full_line?: string;
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  
  // Additional address fields
  street_direction?: string;
  street_number?: string;
  street_name?: string;
  street_suffix?: string;
  formatted_address?: string; // Computed field from Pydantic model
}

export interface Description {
  primary_photo?: string;
  alt_photos?: string[];
  style?: PropertyType;
  beds?: number;
  baths_full?: number;
  baths_half?: number;
  sqft?: number;
  lot_sqft?: number;
  sold_price?: number;
  year_built?: number;
  garage?: number;
  stories?: number;
  text?: string;
  
  // Additional description fields
  name?: string;
  type?: string;
}

export interface OpenHouse {
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  description?: string;
  is_appointment_only?: boolean;
}

export interface Unit {
  unit_number?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  rent?: number;
  availability?: {
    date?: string; // ISO date string
    status?: string;
  };
}

export interface TaxRecord {
  assessed_value?: number;
  tax_amount?: number;
  last_update_date?: string; // ISO date string
  tax_year?: number;
}

export interface Estimate {
  date?: string; // ISO date string
  estimate_high?: number;
  estimate_low?: number;
  is_best_home_value?: boolean;
  source?: {
    type?: string;
    name?: string;
  };
}

// New interfaces for processor data structures
export interface Agent {
  uuid?: string;
  nrds_id?: string;
  mls_set?: string;
  name?: string;
  email?: string;
  phones?: string[];
  state_license?: string;
}

export interface Broker {
  uuid?: string;
  name?: string;
}

export interface Builder {
  uuid?: string;
  name?: string;
}

export interface Office {
  uuid?: string;
  mls_set?: string;
  name?: string;
  email?: string;
  phones?: string[];
}

export interface Advertisers {
  agent?: Agent;
  broker?: Broker;
  builder?: Builder;
  office?: Office;
}

// Specialized models for GraphQL types
export interface HomeMonthlyFee {
  description?: string;
  display_amount?: string;
}

export interface HomeOneTimeFee {
  description?: string;
  display_amount?: string;
}

export interface HomeParkingDetails {
  unassigned_space_rent?: number;
  assigned_spaces_available?: number;
  description?: string;
  assigned_space_rent?: number;
}

export interface PetPolicy {
  cats?: boolean;
  dogs?: boolean;
  dogs_small?: boolean;
  dogs_large?: boolean;
}

export interface OpenHouse {
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  description?: string;
  time_zone?: string;
  dst?: boolean;
  href?: string;
  methods?: string[];
}

export interface HomeFlags {
  is_pending?: boolean;
  is_contingent?: boolean;
  is_new_construction?: boolean;
  is_coming_soon?: boolean;
  is_new_listing?: boolean;
  is_price_reduced?: boolean;
  is_foreclosure?: boolean;
}

export interface PopularityPeriod {
  clicks_total?: number;
  views_total?: number;
  dwell_time_mean?: number;
  dwell_time_median?: number;
  leads_total?: number;
  shares_total?: number;
  saves_total?: number;
  last_n_days?: number;
}

export interface Popularity {
  periods?: PopularityPeriod[];
}

export interface Assessment {
  building?: number;
  land?: number;
  total?: number;
}

export interface TaxHistory {
  assessment?: Assessment;
  market?: Assessment;
  appraisal?: Assessment;
  value?: Assessment;
  tax?: number;
  year?: number;
  assessed_year?: number;
}

export interface TaxRecord {
  cl_id?: string;
  public_record_id?: string;
  last_update_date?: string; // ISO date string
  apn?: string;
  tax_parcel_id?: string;
}

export interface EstimateSource {
  type?: string;
  name?: string;
}

export interface PropertyEstimate {
  estimate?: number;
  estimate_high?: number;
  estimate_low?: number;
  date?: string; // ISO date string
  is_best_home_value?: boolean;
  source?: EstimateSource;
}

export interface HomeEstimates {
  current_values?: PropertyEstimate[];
}

export interface PropertyDetails {
  category?: string;
  text?: string[];
  parent_category?: string;
}

export interface HomeDetails {
  category?: string;
  text?: string[];
  parent_category?: string;
}

export interface UnitDescription {
  baths_consolidated?: string;
  baths?: number;
  beds?: number;
  sqft?: number;
}

export interface UnitAvailability {
  date?: string; // ISO date string
}

export interface Unit {
  availability?: UnitAvailability;
  description?: UnitDescription;
  photos?: Array<{ href: string }>;
  list_price?: number;
}

export interface Property {
  // Required fields
  property_url: string;
  property_id: string;
  
  // Basic identifiers
  mls?: string;
  mls_id?: string;
  listing_id?: string;
  permalink?: string;
  
  // Status and pricing
  status?: string;
  list_price?: number;
  list_price_min?: number;
  list_price_max?: number;
  list_date?: string; // ISO date string
  prc_sqft?: number;
  last_sold_date?: string; // ISO date string
  pending_date?: string; // ISO date string
  
  // Property details
  new_construction?: boolean;
  hoa_fee?: number;
  latitude?: number;
  longitude?: number;
  address?: Address;
  description?: Description;
  neighborhoods?: string;
  county?: string;
  fips_code?: string;
  days_on_mls?: number;
  
  // Additional data
  nearby_schools?: string[];
  assessed_value?: number;
  estimated_value?: number;
  advertisers?: Advertisers;
  tax?: number;
  tax_history?: TaxHistory[];
  
  // GraphQL specific fields
  mls_status?: string;
  last_sold_price?: number;
  tags?: string[];
  details?: HomeDetails[];
  open_houses?: OpenHouse[];
  pet_policy?: PetPolicy;
  units?: Unit[];
  monthly_fees?: HomeMonthlyFee;
  one_time_fees?: HomeOneTimeFee[];
  parking?: HomeParkingDetails;
  terms?: PropertyDetails[];
  popularity?: Popularity;
  tax_record?: TaxRecord;
  parcel_info?: Record<string, any>;
  current_estimates?: PropertyEstimate[];
  estimates?: HomeEstimates;
  photos?: Array<{ href: string }>;
  flags?: HomeFlags;
}

export interface PropertyData {
  property_id: string;
  listing_id?: string;
  status?: string;
  list_price?: number;
  address?: Address;
  description?: Description;
  open_houses?: OpenHouse[];
  units?: Unit[];
  tax_record?: TaxRecord;
  estimates?: {
    current_values?: Estimate[];
    [key: string]: any;
  };
  neighborhoods?: string;
  days_on_mls?: number;
  last_sold_date?: string; // ISO date string
  last_sold_price?: number;
  list_date?: string; // ISO date string
  photos?: Array<{ href: string }>;
  agent?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  office?: {
    name?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  mls_data?: Record<string, any>;
}

// Raw API response interfaces
export interface RealtorApiResponse {
  success: boolean;
  properties: PropertyData[];
  total: number;
  error?: string;
}

export interface RealtorSearchParams {
  location: string;
  listing_type?: 'for_sale' | 'for_rent' | 'sold' | 'pending';
  property_types?: string[];
  min_price?: number;
  max_price?: number;
  beds?: number;
  baths?: number;
  sqft_min?: number;
  sqft_max?: number;
  radius?: number;
  past_days?: number;
  limit?: number;
}

// GraphQL query interfaces
export interface GraphQLSearchVariables {
  offset?: number;
  coordinates?: number[];
  radius?: string;
  property_id?: string[];
  postal_code?: string;
  city?: string;
  county?: string[];
  state_code?: string;
}

export interface GraphQLPropertyResult {
  property_id: string;
  listing_id?: string;
  status?: string;
  list_price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    line?: string;
    street_number?: string;
    street_direction?: string;
    street_name?: string;
    street_suffix?: string;
    unit?: string;
    state_code?: string;
  };
  location?: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      line?: string;
      street_number?: string;
      street_direction?: string;
      street_name?: string;
      street_suffix?: string;
      unit?: string;
      state_code?: string;
    };
    neighborhoods?: Array<{ name: string }>;
  };
  description?: {
    type?: string;
    beds?: number;
    baths_full?: number;
    baths_half?: number;
    sqft?: number;
    lot_sqft?: number;
    year_built?: number;
    garage?: number;
    stories?: number;
    text?: string;
    name?: string;
    sold_price?: number;
  };
  photos?: Array<{ href: string }>;
  primary_photo?: { href: string };
  agent?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  office?: {
    name?: string;
  };
  open_houses?: Array<{
    start_date?: string;
    end_date?: string;
    description?: string;
    is_appointment_only?: boolean;
  }>;
  units?: Array<{
    unit_number?: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    rent?: number;
    availability?: {
      date?: string;
      status?: string;
    };
  }>;
  tax_record?: {
    assessed_value?: number;
    tax_amount?: number;
    last_update_date?: string;
    tax_year?: number;
  };
  estimates?: {
    currentValues?: Array<{
      date?: string;
      estimateHigh?: number;
      estimateLow?: number;
      isBestHomeValue?: boolean;
      source?: {
        type?: string;
        name?: string;
      };
    }>;
    current_values?: Array<{
      date?: string;
      estimate_high?: number;
      estimate_low?: number;
      is_best_home_value?: boolean;
      source?: {
        type?: string;
        name?: string;
      };
    }>;
  };
  last_sold_date?: string;
  last_sold_price?: number;
  list_date?: string;
  mls_data?: Record<string, any>;
}

// Service interfaces
export interface PropertySearchService {
  searchProperties(params: RealtorSearchParams): Promise<RealtorApiResponse>;
  getPropertyDetails(propertyId: string): Promise<PropertyData | null>;
}

// Utility types
export type PropertyStatus = 'for_sale' | 'for_rent' | 'sold' | 'pending' | 'off_market';
export type ListingType = 'for_sale' | 'for_rent' | 'sold' | 'pending';

// Enhanced scraper input interface
export interface ScraperInput {
  location: string;
  listing_type: ListingType;
  property_type?: SearchPropertyType[];
  radius?: number;
  mls_only?: boolean;
  proxy?: string;
  last_x_days?: number;
  date_from?: string;
  date_to?: string;
  foreclosure?: boolean;
  extra_property_data?: boolean;
  exclude_pending?: boolean;
  limit?: number;
  return_type?: ReturnType;
}

// Search filter interfaces
export interface PropertyFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  bedrooms?: {
    min: number;
    max: number;
  };
  bathrooms?: {
    min: number;
    max: number;
  };
  squareFootage?: {
    min: number;
    max: number;
  };
  propertyTypes?: PropertyType[];
  listingTypes?: ListingType[];
  yearBuilt?: {
    min: number;
    max: number;
  };
  lotSize?: {
    min: number;
    max: number;
  };
  features?: string[];
  keywords?: string;
}
