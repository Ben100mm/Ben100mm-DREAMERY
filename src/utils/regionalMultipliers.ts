/**
 * Regional Multipliers for Pro Forma Presets
 * 
 * Adjusts expense percentages based on geographic location to reflect
 * local market conditions more accurately.
 * 
 * Base presets (conservative, moderate, aggressive) are multiplied by
 * regional factors to produce location-specific values.
 */

// ============================================================================
// Types
// ============================================================================

export interface RegionalMultipliers {
  propertyTax: number;      // Multiplier for property taxes (e.g., 1.5 = 50% higher)
  insurance: number;        // Multiplier for insurance costs
  maintenance: number;      // Multiplier for maintenance costs
  management: number;       // Multiplier for property management fees
  utilities: number;        // Multiplier for utility costs
  vacancy: number;          // Multiplier for vacancy rate
  capEx: number;           // Multiplier for capital expenditure reserves
  hoa: number;             // Multiplier for HOA fees (if applicable)
}

export interface RegionData {
  name: string;
  description: string;
  multipliers: RegionalMultipliers;
  notes?: string[];
}

export type RegionKey = 
  | 'california-bay-area'
  | 'california-socal'
  | 'new-york-metro'
  | 'florida-coastal'
  | 'florida-inland'
  | 'texas-major-cities'
  | 'midwest-rust-belt'
  | 'midwest-growing'
  | 'southeast-growing'
  | 'mountain-west'
  | 'pacific-northwest'
  | 'northeast-boston'
  | 'south-atlantic'
  | 'great-plains'
  | 'hawaii'
  | 'alaska'
  | 'national-average';

// ============================================================================
// Regional Data
// ============================================================================

/**
 * Regional multipliers by market
 * Base multiplier of 1.0 = national average
 */
export const regionalData: Record<RegionKey, RegionData> = {
  'california-bay-area': {
    name: 'California - Bay Area',
    description: 'San Francisco, Oakland, San Jose metro areas',
    multipliers: {
      propertyTax: 1.0,  // Prop 13 keeps taxes relatively stable
      insurance: 1.3,    // Earthquake and wildfire risk
      maintenance: 1.4,  // High labor costs
      management: 1.2,   // Higher professional service costs
      utilities: 1.3,    // Above average utility rates
      vacancy: 0.9,      // Strong rental demand
      capEx: 1.3,        // Higher replacement costs
      hoa: 1.5,          // Expensive HOA fees
    },
    notes: [
      'Prop 13 limits annual property tax increases',
      'Earthquake and wildfire insurance recommended',
      'High labor and material costs',
      'Strong rental market reduces vacancy',
    ],
  },
  
  'california-socal': {
    name: 'California - Southern',
    description: 'Los Angeles, San Diego, Orange County',
    multipliers: {
      propertyTax: 1.0,
      insurance: 1.25,   // Earthquake, wildfire, some coastal flood
      maintenance: 1.3,
      management: 1.15,
      utilities: 1.2,
      vacancy: 0.95,
      capEx: 1.25,
      hoa: 1.4,
    },
    notes: [
      'Prop 13 applies',
      'Coastal properties may need flood insurance',
      'High costs but strong demand',
    ],
  },
  
  'new-york-metro': {
    name: 'New York Metro',
    description: 'NYC, Long Island, Westchester, Northern NJ',
    multipliers: {
      propertyTax: 2.0,  // Among highest in nation
      insurance: 1.2,
      maintenance: 1.5,  // Very high labor costs
      management: 1.3,
      utilities: 1.4,    // High heating costs
      vacancy: 0.85,     // Very strong demand
      capEx: 1.4,
      hoa: 1.3,
    },
    notes: [
      'Property taxes are among the highest in the US',
      'High heating costs in winter',
      'Strong rental demand keeps vacancy low',
      'Co-op/condo maintenance fees can be very high',
    ],
  },
  
  'florida-coastal': {
    name: 'Florida - Coastal',
    description: 'Miami, Tampa Bay, coastal areas',
    multipliers: {
      propertyTax: 1.1,
      insurance: 2.0,    // Hurricane/flood insurance very expensive
      maintenance: 1.1,  // Salt air increases wear
      management: 1.0,
      utilities: 1.1,    // High A/C costs
      vacancy: 0.9,      // Strong demand
      capEx: 1.2,        // Salt air corrosion
      hoa: 1.2,
    },
    notes: [
      'Hurricane and flood insurance costs are very high',
      'Wind mitigation features can reduce insurance',
      'Salt air increases maintenance needs',
      'No state income tax attracts renters',
    ],
  },
  
  'florida-inland': {
    name: 'Florida - Inland',
    description: 'Orlando, Central Florida',
    multipliers: {
      propertyTax: 1.05,
      insurance: 1.4,    // Hurricane risk but no flood
      maintenance: 1.0,
      management: 0.95,
      utilities: 1.1,
      vacancy: 0.95,
      capEx: 1.0,
      hoa: 1.0,
    },
    notes: [
      'Lower insurance than coastal but still elevated',
      'Growing population and employment',
      'Tourism-driven economy in some areas',
    ],
  },
  
  'texas-major-cities': {
    name: 'Texas - Major Cities',
    description: 'Austin, Dallas, Houston, San Antonio',
    multipliers: {
      propertyTax: 1.8,  // High property taxes (no income tax)
      insurance: 1.2,    // Hail, tornado, flood risk
      maintenance: 0.95,
      management: 0.9,
      utilities: 0.95,
      vacancy: 0.9,      // Strong growth
      capEx: 0.95,
      hoa: 0.9,
    },
    notes: [
      'High property taxes fund schools (no state income tax)',
      'Strong job growth attracts renters',
      'Consider hail damage coverage',
      'Homestead exemptions available for owner-occupied',
    ],
  },
  
  'midwest-rust-belt': {
    name: 'Midwest - Legacy Industrial',
    description: 'Detroit, Cleveland, Buffalo, Milwaukee',
    multipliers: {
      propertyTax: 1.3,
      insurance: 0.9,
      maintenance: 1.1,  // Older housing stock
      management: 0.85,
      utilities: 1.1,    // Cold winters
      vacancy: 1.3,      // Weaker demand in some areas
      capEx: 1.2,        // Older homes need more work
      hoa: 0.8,
    },
    notes: [
      'Older housing stock requires more maintenance',
      'Vacancy can be higher in declining neighborhoods',
      'Lower costs but potentially lower rents',
      'High heating costs in winter',
    ],
  },
  
  'midwest-growing': {
    name: 'Midwest - Growing Markets',
    description: 'Columbus, Indianapolis, Kansas City, Minneapolis',
    multipliers: {
      propertyTax: 1.2,
      insurance: 0.95,
      maintenance: 0.95,
      management: 0.85,
      utilities: 1.05,
      vacancy: 1.0,
      capEx: 0.95,
      hoa: 0.85,
    },
    notes: [
      'Good balance of affordability and growth',
      'Moderate costs across the board',
      'Strong employment markets',
    ],
  },
  
  'southeast-growing': {
    name: 'Southeast - Growth Markets',
    description: 'Charlotte, Raleigh, Atlanta, Nashville',
    multipliers: {
      propertyTax: 0.95,
      insurance: 1.1,
      maintenance: 0.9,
      management: 0.9,
      utilities: 0.95,
      vacancy: 0.9,      // Strong growth
      capEx: 0.9,
      hoa: 0.95,
    },
    notes: [
      'Strong population and job growth',
      'Business-friendly environment',
      'Lower costs than coastal markets',
      'Moderate climate reduces HVAC costs',
    ],
  },
  
  'mountain-west': {
    name: 'Mountain West',
    description: 'Denver, Salt Lake City, Boise, Phoenix',
    multipliers: {
      propertyTax: 0.9,
      insurance: 0.95,
      maintenance: 1.0,
      management: 0.95,
      utilities: 1.0,
      vacancy: 0.95,
      capEx: 1.0,
      hoa: 1.0,
    },
    notes: [
      'Growing markets with strong economies',
      'Lower property taxes',
      'Phoenix has high A/C costs',
      'Water concerns in some areas',
    ],
  },
  
  'pacific-northwest': {
    name: 'Pacific Northwest',
    description: 'Seattle, Portland metro areas',
    multipliers: {
      propertyTax: 1.1,
      insurance: 1.0,
      maintenance: 1.2,  // Moisture and mold issues
      management: 1.1,
      utilities: 0.9,    // Mild climate
      vacancy: 0.9,      // Strong demand
      capEx: 1.15,
      hoa: 1.2,
    },
    notes: [
      'Moisture management is critical',
      'Strong tech-driven job markets',
      'Tenant-friendly regulations',
      'Mild climate reduces heating/cooling',
    ],
  },
  
  'northeast-boston': {
    name: 'Northeast - Boston Area',
    description: 'Boston, Providence, Worcester',
    multipliers: {
      propertyTax: 1.5,
      insurance: 1.1,
      maintenance: 1.3,  // Older housing stock
      management: 1.2,
      utilities: 1.3,    // High heating costs
      vacancy: 0.85,     // Student population stabilizes demand
      capEx: 1.3,        // Old homes need work
      hoa: 1.2,
    },
    notes: [
      'High property taxes',
      'Many older properties require updates',
      'Strong rental demand from universities',
      'Lead paint abatement may be required',
    ],
  },
  
  'south-atlantic': {
    name: 'South Atlantic',
    description: 'D.C., Baltimore, Virginia Beach',
    multipliers: {
      propertyTax: 1.2,
      insurance: 1.1,
      maintenance: 1.0,
      management: 1.0,
      utilities: 1.0,
      vacancy: 0.95,
      capEx: 1.0,
      hoa: 1.1,
    },
    notes: [
      'Government employment provides stability',
      'Mixed urban and suburban markets',
      'Moderate costs overall',
    ],
  },
  
  'great-plains': {
    name: 'Great Plains',
    description: 'Oklahoma City, Omaha, Wichita, Des Moines',
    multipliers: {
      propertyTax: 1.0,
      insurance: 1.1,    // Tornado risk
      maintenance: 0.85,
      management: 0.8,
      utilities: 0.9,
      vacancy: 1.1,
      capEx: 0.85,
      hoa: 0.75,
    },
    notes: [
      'Low cost of living',
      'Tornado insurance recommended',
      'Lower professional service costs',
      'More affordable market overall',
    ],
  },
  
  'hawaii': {
    name: 'Hawaii',
    description: 'All Hawaiian islands',
    multipliers: {
      propertyTax: 0.7,  // Low property taxes
      insurance: 1.5,    // Hurricane, volcano risk
      maintenance: 1.6,  // Everything is more expensive
      management: 1.4,
      utilities: 1.8,    // Highest in nation
      vacancy: 0.8,      // Strong demand, limited supply
      capEx: 1.5,
      hoa: 1.3,
    },
    notes: [
      'Low property taxes but high everything else',
      'All materials must be shipped',
      'Strong vacation rental market',
      'Utilities are extremely expensive',
    ],
  },
  
  'alaska': {
    name: 'Alaska',
    description: 'All Alaskan markets',
    multipliers: {
      propertyTax: 1.0,
      insurance: 1.2,
      maintenance: 1.4,  // Harsh climate
      management: 1.2,
      utilities: 1.5,    // Heating costs
      vacancy: 1.2,
      capEx: 1.3,
      hoa: 1.1,
    },
    notes: [
      'Extreme climate increases all costs',
      'Limited contractor availability',
      'High heating costs',
      'Short construction season',
    ],
  },
  
  'national-average': {
    name: 'National Average',
    description: 'Use when specific region is unknown',
    multipliers: {
      propertyTax: 1.0,
      insurance: 1.0,
      maintenance: 1.0,
      management: 1.0,
      utilities: 1.0,
      vacancy: 1.0,
      capEx: 1.0,
      hoa: 1.0,
    },
    notes: [
      'Baseline values without regional adjustments',
      'Use when location is unknown or mixed portfolio',
    ],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get regional multipliers by key
 */
export function getRegionalMultipliers(regionKey: RegionKey): RegionalMultipliers {
  return regionalData[regionKey].multipliers;
}

/**
 * Get all available regions
 */
export function getAllRegions(): Array<{ key: RegionKey; data: RegionData }> {
  return Object.entries(regionalData).map(([key, data]) => ({
    key: key as RegionKey,
    data,
  }));
}

/**
 * Apply regional multipliers to a pro forma preset
 */
export interface ProFormaPreset {
  maintenance: number;
  vacancy: number;
  management: number;
  capEx: number;
  opEx: number;
}

export function applyRegionalMultipliers(
  basePreset: ProFormaPreset,
  regionKey: RegionKey
): ProFormaPreset {
  const multipliers = regionalData[regionKey].multipliers;
  
  return {
    maintenance: parseFloat((basePreset.maintenance * multipliers.maintenance).toFixed(2)),
    vacancy: parseFloat((basePreset.vacancy * multipliers.vacancy).toFixed(2)),
    management: parseFloat((basePreset.management * multipliers.management).toFixed(2)),
    capEx: parseFloat((basePreset.capEx * multipliers.capEx).toFixed(2)),
    opEx: parseFloat((basePreset.opEx * 1.0).toFixed(2)), // OpEx uses average of other factors
  };
}

/**
 * Get location-adjusted preset
 */
export function getLocationAdjustedPreset(
  presetType: 'conservative' | 'moderate' | 'aggressive',
  regionKey: RegionKey
): ProFormaPreset {
  const basePresets: Record<string, ProFormaPreset> = {
    conservative: { maintenance: 8, vacancy: 6, management: 12, capEx: 6, opEx: 4 },
    moderate: { maintenance: 6, vacancy: 4, management: 9, capEx: 4, opEx: 3 },
    aggressive: { maintenance: 4, vacancy: 2, management: 6, capEx: 2, opEx: 2 },
  };
  
  const basePreset = basePresets[presetType];
  return applyRegionalMultipliers(basePreset, regionKey);
}

/**
 * Detect region from property address (basic implementation)
 * In production, this could use a geocoding API
 */
export function detectRegionFromAddress(address: string): RegionKey {
  const addressLower = address.toLowerCase();
  
  // California
  if (addressLower.includes('san francisco') || addressLower.includes('oakland') || 
      addressLower.includes('san jose') || addressLower.includes(' sf ') ||
      addressLower.includes('bay area')) {
    return 'california-bay-area';
  }
  if (addressLower.includes('los angeles') || addressLower.includes('san diego') ||
      addressLower.includes('orange county') || addressLower.includes(' la ') ||
      addressLower.includes('irvine') || addressLower.includes('anaheim')) {
    return 'california-socal';
  }
  
  // New York
  if (addressLower.includes('new york') || addressLower.includes('brooklyn') ||
      addressLower.includes('queens') || addressLower.includes('manhattan') ||
      addressLower.includes(' ny ') || addressLower.includes('bronx')) {
    return 'new-york-metro';
  }
  
  // Florida
  if (addressLower.includes('miami') || addressLower.includes('tampa') ||
      addressLower.includes('fort myers') || addressLower.includes('naples') ||
      addressLower.includes('jacksonville') || addressLower.includes('west palm')) {
    return 'florida-coastal';
  }
  if (addressLower.includes('orlando') || addressLower.includes('lakeland') ||
      addressLower.includes('ocala') || (addressLower.includes('florida') && !addressLower.includes('miami'))) {
    return 'florida-inland';
  }
  
  // Texas
  if (addressLower.includes('austin') || addressLower.includes('dallas') ||
      addressLower.includes('houston') || addressLower.includes('san antonio') ||
      addressLower.includes(' tx ') || addressLower.includes('texas')) {
    return 'texas-major-cities';
  }
  
  // Southeast
  if (addressLower.includes('charlotte') || addressLower.includes('raleigh') ||
      addressLower.includes('atlanta') || addressLower.includes('nashville') ||
      addressLower.includes('durham') || addressLower.includes('asheville')) {
    return 'southeast-growing';
  }
  
  // Pacific Northwest
  if (addressLower.includes('seattle') || addressLower.includes('portland') ||
      addressLower.includes('tacoma') || addressLower.includes('spokane') ||
      addressLower.includes('eugene') || addressLower.includes('bellev')) {
    return 'pacific-northwest';
  }
  
  // Mountain West
  if (addressLower.includes('denver') || addressLower.includes('phoenix') ||
      addressLower.includes('salt lake') || addressLower.includes('boise') ||
      addressLower.includes('scottsdale') || addressLower.includes('mesa')) {
    return 'mountain-west';
  }
  
  // Boston area
  if (addressLower.includes('boston') || addressLower.includes('cambridge') ||
      addressLower.includes('providence') || addressLower.includes('worcester') ||
      addressLower.includes(' ma ') || addressLower.includes('massachusetts')) {
    return 'northeast-boston';
  }
  
  // Rust Belt
  if (addressLower.includes('detroit') || addressLower.includes('cleveland') ||
      addressLower.includes('buffalo') || addressLower.includes('milwaukee') ||
      addressLower.includes('pittsburgh') || addressLower.includes('rochester')) {
    return 'midwest-rust-belt';
  }
  
  // Growing Midwest
  if (addressLower.includes('columbus') || addressLower.includes('indianapolis') ||
      addressLower.includes('kansas city') || addressLower.includes('minneapolis') ||
      addressLower.includes('madison') || addressLower.includes('cincinnati')) {
    return 'midwest-growing';
  }
  
  // South Atlantic
  if (addressLower.includes('washington') || addressLower.includes('baltimore') ||
      addressLower.includes('virginia beach') || addressLower.includes('richmond') ||
      addressLower.includes(' dc ') || addressLower.includes('d.c.')) {
    return 'south-atlantic';
  }
  
  // Great Plains
  if (addressLower.includes('oklahoma') || addressLower.includes('omaha') ||
      addressLower.includes('wichita') || addressLower.includes('des moines') ||
      addressLower.includes('tulsa') || addressLower.includes('lincoln')) {
    return 'great-plains';
  }
  
  // Hawaii
  if (addressLower.includes('hawaii') || addressLower.includes('honolulu') ||
      addressLower.includes('maui') || addressLower.includes('kauai') ||
      addressLower.includes(' hi ')) {
    return 'hawaii';
  }
  
  // Alaska
  if (addressLower.includes('alaska') || addressLower.includes('anchorage') ||
      addressLower.includes('fairbanks') || addressLower.includes(' ak ')) {
    return 'alaska';
  }
  
  // Default to national average if no match
  return 'national-average';
}

/**
 * Compare adjusted preset to base preset
 */
export function getAdjustmentSummary(
  basePreset: ProFormaPreset,
  adjustedPreset: ProFormaPreset
): Record<keyof ProFormaPreset, { diff: number; pctChange: number }> {
  const keys: Array<keyof ProFormaPreset> = ['maintenance', 'vacancy', 'management', 'capEx', 'opEx'];
  const summary: any = {};
  
  keys.forEach(key => {
    const diff = adjustedPreset[key] - basePreset[key];
    const pctChange = basePreset[key] > 0 ? (diff / basePreset[key]) * 100 : 0;
    summary[key] = {
      diff: parseFloat(diff.toFixed(2)),
      pctChange: parseFloat(pctChange.toFixed(1)),
    };
  });
  
  return summary;
}

