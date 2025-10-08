/**
 * Data Integrations Framework
 * 
 * Provides unified interface for multiple real estate data sources:
 * - Zillow Research Data API
 * - Realtor.com Economic API
 * - US Census Bureau Data
 * - Local MLS Statistics
 * - Mock Data Providers (for testing/development)
 * 
 * Usage:
 * ```typescript
 * import { DataAggregator } from './services/dataIntegrations';
 * 
 * const aggregator = new DataAggregator();
 * const data = await aggregator.fetchAggregatedData('94102');
 * ```
 */

// Export types
export * from './types';

// Export adapters
export { ZillowAdapter } from './zillowAdapter';
export { RealtorAdapter } from './realtorAdapter';
export { CensusAdapter } from './censusAdapter';
export { MLSAdapter } from './mlsAdapter';

// Export aggregator
export { DataAggregator } from './dataAggregator';

// Export mock providers
export { MockProviders } from './mockProviders';

// ============================================================================
// Convenience Functions
// ============================================================================

import { DataAggregator } from './dataAggregator';
import { AggregationStrategy, DataSource } from './types';

let defaultAggregator: DataAggregator | null = null;

/**
 * Get singleton instance of DataAggregator
 */
export function getDataAggregator(): DataAggregator {
  if (!defaultAggregator) {
    defaultAggregator = new DataAggregator({
      strategy: AggregationStrategy.WEIGHTED_AVERAGE,
      minimumSources: 1,
    });
  }
  return defaultAggregator;
}

/**
 * Reset singleton instance
 */
export function resetDataAggregator(): void {
  defaultAggregator = null;
}

/**
 * Quick fetch from all sources
 */
export async function fetchMarketDataFromAllSources(zipCode: string) {
  const aggregator = getDataAggregator();
  return await aggregator.fetchAggregatedData(zipCode);
}

/**
 * Test all data source connections
 */
export async function testAllDataSources() {
  const aggregator = getDataAggregator();
  return await aggregator.testAllConnections();
}

/**
 * Get available data sources
 */
export async function getAvailableDataSources() {
  const aggregator = getDataAggregator();
  return await aggregator.getAvailableAdapters();
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  getDataAggregator,
  resetDataAggregator,
  fetchMarketDataFromAllSources,
  testAllDataSources,
  getAvailableDataSources,
};

