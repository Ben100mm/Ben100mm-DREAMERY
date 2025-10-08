/**
 * Local MLS (Multiple Listing Service) Data Adapter
 * Note: MLS data typically requires specific board membership and agreements
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

export class MLSAdapter implements DataSourceAdapter {
  private config: DataSourceConfig;
  private metadata: DataSourceMetadata;

  constructor(config?: Partial<DataSourceConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      apiKey: config?.apiKey || process.env.REACT_APP_MLS_API_KEY,
      baseURL: config?.baseURL || process.env.REACT_APP_MLS_BASE_URL || 'https://api.mls.local',
      timeout: config?.timeout ?? 10000,
      retryAttempts: config?.retryAttempts ?? 3,
      cacheTTL: config?.cacheTTL ?? 6 * 60 * 60 * 1000, // 6 hours (MLS updates frequently)
      priority: config?.priority ?? 4,
    };

    this.metadata = {
      name: 'Local MLS Data',
      source: DataSource.MLS,
      isAvailable: this.config.enabled && !!this.config.apiKey,
      apiVersion: 'v1',
    };
  }

  /**
   * Fetch data from MLS
   */
  async fetchData(
    zipCode: string,
    options?: FetchOptions,
  ): Promise<StandardMarketData> {
    if (!this.config.enabled) {
      throw new DataSourceError(
        'MLS adapter is disabled',
        DataSource.MLS,
        undefined,
        false,
      );
    }

    if (!this.config.apiKey) {
      console.warn('No MLS API key found, using mock data');
      return this.fetchMockData(zipCode);
    }

    try {
      // In production, implement actual MLS API call
      return await this.fetchMockData(zipCode);
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error;
      }
      throw new DataSourceError(
        `Failed to fetch MLS data: ${error}`,
        DataSource.MLS,
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
    await new Promise((resolve) => setTimeout(resolve, 250));

    const mockData = MockProviders.mls(zipCode);
    return MockProviders.mlsToStandard(mockData, zipCode);
  }

  /**
   * Check if adapter is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    return await this.testConnection();
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

export default MLSAdapter;

