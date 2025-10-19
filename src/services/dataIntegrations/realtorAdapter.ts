/**
 * Realtor.com Economic API Adapter
 * https://www.realtor.com/research/data/
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

export class RealtorAdapter implements DataSourceAdapter {
  private config: DataSourceConfig;
  private metadata: DataSourceMetadata;

  constructor(config?: Partial<DataSourceConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      apiKey: config?.apiKey || process.env.REACT_APP_REALTOR_API_KEY,
      baseURL: config?.baseURL || 'https://api.realtor.com/v1',
      timeout: config?.timeout ?? 10000,
      retryAttempts: config?.retryAttempts ?? 3,
      cacheTTL: config?.cacheTTL ?? 24 * 60 * 60 * 1000, // 24 hours
      priority: config?.priority ?? 2,
    };

    this.metadata = {
      name: 'Realtor.com Economic Data',
      source: DataSource.REALTOR,
      isAvailable: this.config.enabled && !!this.config.apiKey,
      apiVersion: 'v1',
    };
  }

  /**
   * Fetch market data from Realtor.com
   */
  async fetchData(
    zipCode: string,
    options?: FetchOptions,
  ): Promise<StandardMarketData> {
    if (!this.config.enabled) {
      throw new DataSourceError(
        'Realtor adapter is disabled',
        DataSource.REALTOR,
        undefined,
        false,
      );
    }

    // If no API key, use mock data
    if (!this.config.apiKey) {
      console.warn('No Realtor API key found, using mock data');
      return this.fetchMockData(zipCode);
    }

    try {
      // In production, implement actual API call
      return await this.fetchMockData(zipCode);
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error;
      }
      throw new DataSourceError(
        `Failed to fetch Realtor data: ${error}`,
        DataSource.REALTOR,
        undefined,
        true,
      );
    }
  }

  /**
   * Fetch mock data for development/testing
   */
  private async fetchMockData(zipCode: string): Promise<StandardMarketData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    const mockData = MockProviders.realtor(zipCode);
    return MockProviders.realtorToStandard(mockData, zipCode);
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

export default RealtorAdapter;

