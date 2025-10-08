/**
 * US Census Bureau Data Adapter
 * https://www.census.gov/data/developers/data-sets.html
 */

import {
  DataSourceAdapter,
  StandardMarketData,
  DataSourceMetadata,
  DataSourceConfig,
  FetchOptions,
  DataSource,
  DataSourceError,
} from './types';
import { MockProviders } from './mockProviders';

export class CensusAdapter implements DataSourceAdapter {
  private config: DataSourceConfig;
  private metadata: DataSourceMetadata;

  constructor(config?: Partial<DataSourceConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      apiKey: config?.apiKey || process.env.REACT_APP_CENSUS_API_KEY,
      baseURL: config?.baseURL || 'https://api.census.gov/data',
      timeout: config?.timeout ?? 15000, // Census API can be slower
      retryAttempts: config?.retryAttempts ?? 3,
      cacheTTL: config?.cacheTTL ?? 7 * 24 * 60 * 60 * 1000, // 7 days (census data updates infrequently)
      priority: config?.priority ?? 3,
    };

    this.metadata = {
      name: 'US Census Bureau',
      source: DataSource.CENSUS,
      isAvailable: this.config.enabled,
      apiVersion: '2021',
    };
  }

  /**
   * Fetch data from Census Bureau API
   */
  async fetchData(
    zipCode: string,
    options?: FetchOptions,
  ): Promise<StandardMarketData> {
    if (!this.config.enabled) {
      throw new DataSourceError(
        'Census adapter is disabled',
        DataSource.CENSUS,
        undefined,
        false,
      );
    }

    try {
      // Census API is public and free, but we'll use mock data for now
      return await this.fetchMockData(zipCode);
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error;
      }
      throw new DataSourceError(
        `Failed to fetch Census data: ${error}`,
        DataSource.CENSUS,
        undefined,
        true,
      );
    }
  }

  /**
   * Fetch mock data
   */
  private async fetchMockData(zipCode: string): Promise<StandardMarketData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockData = MockProviders.census(zipCode);
    return MockProviders.censusToStandard(mockData, zipCode);
  }

  /**
   * Check if adapter is available
   */
  async isAvailable(): Promise<boolean> {
    return this.config.enabled && await this.testConnection();
  }

  /**
   * Get metadata
   */
  getMetadata(): DataSourceMetadata {
    return { ...this.metadata };
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    // Mock mode is always available
    return true;
  }

  /**
   * Get configuration
   */
  getConfig(): DataSourceConfig {
    return { ...this.config };
  }
}

export default CensusAdapter;

