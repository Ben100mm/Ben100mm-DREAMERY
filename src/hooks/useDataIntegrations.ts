/**
 * React Hook for Data Integrations Framework
 * 
 * Provides easy access to the data integrations framework for pulling
 * real market data from multiple sources (Zillow, Realtor, Census, MLS)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  DataAggregator,
  getDataAggregator,
  StandardMarketData,
  DataSource,
  DataSourceMetadata,
  AggregatedMarketData,
  AggregationStrategy,
} from '../services/dataIntegrations';

/**
 * Hook return type
 */
export interface UseDataIntegrationsReturn {
  // Data
  marketData: AggregatedMarketData | null;
  availableSources: DataSource[];
  sourceStatuses: Map<DataSource, boolean>;
  sourceMetadata: Map<DataSource, DataSourceMetadata>;
  
  // Loading states
  loading: boolean;
  testing: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  fetchMarketData: (zipCode: string, forceRefresh?: boolean) => Promise<void>;
  testAllConnections: () => Promise<void>;
  clearData: () => void;
  
  // Configuration
  aggregator: DataAggregator;
}

/**
 * Hook options
 */
export interface UseDataIntegrationsOptions {
  /**
   * Aggregation strategy to use
   */
  strategy?: AggregationStrategy;
  
  /**
   * Minimum number of sources required
   */
  minimumSources?: number;
  
  /**
   * Auto-test connections on mount
   */
  autoTest?: boolean;
}

/**
 * Hook for accessing the Data Integrations framework
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fetchMarketData, marketData, loading, error } = useDataIntegrations();
 *   
 *   const handleFetch = async () => {
 *     await fetchMarketData('94102');
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={handleFetch}>Fetch Data</button>
 *       {loading && <p>Loading...</p>}
 *       {error && <p>Error: {error}</p>}
 *       {marketData && <p>Median Rent: ${marketData.medianRent}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDataIntegrations(
  options: UseDataIntegrationsOptions = {}
): UseDataIntegrationsReturn {
  const {
    strategy = AggregationStrategy.WEIGHTED_AVERAGE,
    minimumSources = 1,
    autoTest = false,
  } = options;

  // State
  const [marketData, setMarketData] = useState<AggregatedMarketData | null>(null);
  const [availableSources, setAvailableSources] = useState<DataSource[]>([]);
  const [sourceStatuses, setSourceStatuses] = useState<Map<DataSource, boolean>>(new Map());
  const [sourceMetadata, setSourceMetadata] = useState<Map<DataSource, DataSourceMetadata>>(new Map());
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get aggregator instance
  const [aggregator] = useState(() => 
    new DataAggregator({
      strategy,
      minimumSources,
    })
  );

  /**
   * Test all data source connections
   */
  const testAllConnections = useCallback(async () => {
    setTesting(true);
    setError(null);

    try {
      // Test connections
      const results = await aggregator.testAllConnections();
      setSourceStatuses(results);

      // Get available sources
      const available = await aggregator.getAvailableAdapters();
      setAvailableSources(available);

      // Get metadata for each source
      const metadata = new Map<DataSource, DataSourceMetadata>();
      for (const source of Object.values(DataSource)) {
        try {
          const adapter = (aggregator as any).adapters.get(source);
          if (adapter) {
            metadata.set(source, adapter.getMetadata());
          }
        } catch (err) {
          console.error(`Failed to get metadata for ${source}:`, err);
        }
      }
      setSourceMetadata(metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to test connections';
      setError(message);
      console.error('Connection test error:', err);
    } finally {
      setTesting(false);
    }
  }, [aggregator]);

  /**
   * Fetch market data for a zip code
   */
  const fetchMarketData = useCallback(async (
    zipCode: string,
    forceRefresh: boolean = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await aggregator.fetchAggregatedData(zipCode, {
        forceRefresh,
      });
      setMarketData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(message);
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [aggregator]);

  /**
   * Clear current data
   */
  const clearData = useCallback(() => {
    setMarketData(null);
    setError(null);
  }, []);

  // Auto-test on mount if requested
  useEffect(() => {
    if (autoTest) {
      testAllConnections();
    }
  }, [autoTest, testAllConnections]);

  return {
    // Data
    marketData,
    availableSources,
    sourceStatuses,
    sourceMetadata,
    
    // Loading states
    loading,
    testing,
    
    // Error handling
    error,
    
    // Actions
    fetchMarketData,
    testAllConnections,
    clearData,
    
    // Configuration
    aggregator,
  };
}

export default useDataIntegrations;

