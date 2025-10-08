/**
 * Data Aggregator
 * Combines data from multiple sources with intelligent fallback and conflict resolution
 */

import {
  StandardMarketData,
  DataSource,
  AggregationStrategy,
  AggregationConfig,
  ConflictResolution,
  AggregatedMarketData,
  DataQuality,
  DataSourceError,
  AggregationError,
  FetchOptions,
} from './types';
import { ZillowAdapter } from './zillowAdapter';
import { RealtorAdapter } from './realtorAdapter';
import { CensusAdapter } from './censusAdapter';
import { MLSAdapter } from './mlsAdapter';
import { MockProviders } from './mockProviders';

export class DataAggregator {
  private adapters: Map<DataSource, any>;
  private config: AggregationConfig;

  constructor(config?: Partial<AggregationConfig>) {
    this.config = {
      strategy: config?.strategy || AggregationStrategy.PRIORITY,
      weights: config?.weights || new Map([
        [DataSource.ZILLOW, 0.3],
        [DataSource.REALTOR, 0.3],
        [DataSource.MLS, 0.25],
        [DataSource.CENSUS, 0.15],
      ]),
      minimumSources: config?.minimumSources || 1,
      requiredSources: config?.requiredSources || [],
      conflictResolution: config?.conflictResolution || ConflictResolution.PREFER_NEWEST,
    };

    // Initialize adapters
    this.adapters = new Map([
      [DataSource.ZILLOW, new ZillowAdapter()],
      [DataSource.REALTOR, new RealtorAdapter()],
      [DataSource.CENSUS, new CensusAdapter()],
      [DataSource.MLS, new MLSAdapter()],
    ]);
  }

  /**
   * Fetch aggregated data from all available sources
   */
  async fetchAggregatedData(
    zipCode: string,
    options?: FetchOptions,
  ): Promise<AggregatedMarketData> {
    const sourceData = new Map<DataSource, Partial<StandardMarketData>>();
    const qualityScores = new Map<DataSource, DataQuality>();
    const errors: DataSourceError[] = [];

    // Fetch from all sources in priority order
    const prioritizedSources = this.getPrioritizedSources();

    for (const [source, adapter] of prioritizedSources) {
      try {
        const data = await adapter.fetchData(zipCode, options);
        sourceData.set(source, data);
        
        const quality = this.assessDataQuality(data);
        qualityScores.set(source, quality);
      } catch (error) {
        if (error instanceof DataSourceError) {
          errors.push(error);
          console.warn(`Failed to fetch from ${source}:`, error.message);
        } else {
          console.error(`Unexpected error fetching from ${source}:`, error);
        }
      }
    }

    // Check if we have minimum required sources
    if (sourceData.size < this.config.minimumSources) {
      throw new AggregationError(
        `Failed to fetch from minimum required sources (${this.config.minimumSources})`,
        errors.map(e => e.source),
      );
    }

    // Check if all required sources are present
    const missingRequired = this.config.requiredSources?.filter(
      source => !sourceData.has(source),
    );
    if (missingRequired && missingRequired.length > 0) {
      throw new AggregationError(
        `Missing required sources: ${missingRequired.join(', ')}`,
        missingRequired,
      );
    }

    // Aggregate the data
    const aggregated = this.aggregateData(sourceData, qualityScores);

    return {
      ...aggregated,
      sources: Array.from(sourceData.keys()),
      sourceData,
      aggregationStrategy: this.config.strategy,
      qualityScores,
      dataSource: DataSource.AGGREGATED,
    };
  }

  /**
   * Aggregate data from multiple sources
   */
  private aggregateData(
    sourceData: Map<DataSource, Partial<StandardMarketData>>,
    qualityScores: Map<DataSource, DataQuality>,
  ): StandardMarketData {
    const sources = Array.from(sourceData.keys());
    
    if (sources.length === 0) {
      throw new AggregationError('No source data available', []);
    }

    // If only one source, return it directly
    if (sources.length === 1) {
      const data = sourceData.get(sources[0])!;
      return data as StandardMarketData;
    }

    // Apply aggregation strategy
    switch (this.config.strategy) {
      case AggregationStrategy.WEIGHTED_AVERAGE:
        return this.weightedAverage(sourceData, qualityScores);
      
      case AggregationStrategy.PRIORITY:
        return this.prioritySelection(sourceData);
      
      case AggregationStrategy.BEST_QUALITY:
        return this.bestQualitySelection(sourceData, qualityScores);
      
      case AggregationStrategy.CONSENSUS:
        return this.consensusAggregation(sourceData, qualityScores);
      
      default:
        return this.prioritySelection(sourceData);
    }
  }

  /**
   * Weighted average aggregation
   */
  private weightedAverage(
    sourceData: Map<DataSource, Partial<StandardMarketData>>,
    qualityScores: Map<DataSource, DataQuality>,
  ): StandardMarketData {
    const result: any = {};
    const numericFields = [
      'medianRent',
      'medianPrice',
      'rentGrowth12mo',
      'appreciationRate12mo',
      'vacancyRate',
      'daysOnMarket',
      'foreclosureRate',
      'economicDiversityIndex',
      'crimeSafetyScore',
      'schoolRating',
    ];

    // Calculate weighted averages for numeric fields
    for (const field of numericFields) {
      let weightedSum = 0;
      let totalWeight = 0;

      for (const [source, data] of sourceData) {
        const value = (data as any)[field];
        if (value !== undefined && value !== null) {
          const weight = this.config.weights?.get(source) || 0.25;
          const quality = qualityScores.get(source)?.overall || 50;
          const adjustedWeight = weight * (quality / 100);
          
          weightedSum += value * adjustedWeight;
          totalWeight += adjustedWeight;
        }
      }

      result[field] = totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    // Use first available value for non-numeric fields
    const firstData = sourceData.values().next().value as StandardMarketData;
    result.zipCode = firstData.zipCode;
    result.city = firstData.city;
    result.state = firstData.state;
    result.dateUpdated = new Date();
    result.confidence = this.calculateConfidence(sourceData, qualityScores);

    return result as StandardMarketData;
  }

  /**
   * Priority-based selection (use highest priority source for each field)
   */
  private prioritySelection(
    sourceData: Map<DataSource, Partial<StandardMarketData>>,
  ): StandardMarketData {
    const prioritizedSources = this.getPrioritizedSources();
    const result: any = {};

    const fields = [
      'zipCode', 'city', 'state',
      'medianRent', 'medianPrice', 'rentGrowth12mo', 'appreciationRate12mo',
      'vacancyRate', 'daysOnMarket', 'foreclosureRate',
      'economicDiversityIndex', 'crimeSafetyScore', 'schoolRating',
    ];

    for (const field of fields) {
      for (const [source] of prioritizedSources) {
        const data = sourceData.get(source);
        if (data && (data as any)[field] !== undefined) {
          result[field] = (data as any)[field];
          break;
        }
      }
    }

    result.dateUpdated = new Date();
    result.confidence = 75;

    return result as StandardMarketData;
  }

  /**
   * Best quality selection
   */
  private bestQualitySelection(
    sourceData: Map<DataSource, Partial<StandardMarketData>>,
    qualityScores: Map<DataSource, DataQuality>,
  ): StandardMarketData {
    // Find source with highest overall quality
    let bestSource: DataSource | null = null;
    let bestQuality = 0;

    for (const [source, quality] of qualityScores) {
      if (quality.overall > bestQuality) {
        bestQuality = quality.overall;
        bestSource = source;
      }
    }

    if (!bestSource) {
      return this.prioritySelection(sourceData);
    }

    return sourceData.get(bestSource)! as StandardMarketData;
  }

  /**
   * Consensus aggregation (median values)
   */
  private consensusAggregation(
    sourceData: Map<DataSource, Partial<StandardMarketData>>,
    qualityScores: Map<DataSource, DataQuality>,
  ): StandardMarketData {
    const result: any = {};
    const numericFields = [
      'medianRent', 'medianPrice', 'rentGrowth12mo', 'appreciationRate12mo',
      'vacancyRate', 'daysOnMarket', 'foreclosureRate',
      'economicDiversityIndex', 'crimeSafetyScore', 'schoolRating',
    ];

    // Use median for numeric fields
    for (const field of numericFields) {
      const values: number[] = [];
      
      for (const data of sourceData.values()) {
        const value = (data as any)[field];
        if (value !== undefined && value !== null) {
          values.push(value);
        }
      }

      if (values.length > 0) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        result[field] = values.length % 2 === 0
          ? (values[mid - 1] + values[mid]) / 2
          : values[mid];
      } else {
        result[field] = 0;
      }
    }

    // Use first available value for non-numeric fields
    const firstData = sourceData.values().next().value as StandardMarketData;
    result.zipCode = firstData.zipCode;
    result.city = firstData.city;
    result.state = firstData.state;
    result.dateUpdated = new Date();
    result.confidence = this.calculateConfidence(sourceData, qualityScores);

    return result as StandardMarketData;
  }

  /**
   * Assess data quality
   */
  private assessDataQuality(data: StandardMarketData): DataQuality {
    const warnings: string[] = [];
    
    // Check completeness
    const requiredFields = [
      'medianRent', 'medianPrice', 'rentGrowth12mo', 'appreciationRate12mo',
      'vacancyRate', 'daysOnMarket',
    ];
    
    let completeFields = 0;
    for (const field of requiredFields) {
      if ((data as any)[field] !== undefined && (data as any)[field] !== null) {
        completeFields++;
      }
    }
    const completeness = (completeFields / requiredFields.length) * 100;

    if (completeness < 100) {
      warnings.push(`Data is ${completeness.toFixed(0)}% complete`);
    }

    // Check freshness
    const dataAge = Date.now() - data.dateUpdated.getTime();
    const daysOld = dataAge / (1000 * 60 * 60 * 24);
    let freshness = 100;
    
    if (daysOld > 90) {
      freshness = 30;
      warnings.push('Data is more than 90 days old');
    } else if (daysOld > 30) {
      freshness = 60;
      warnings.push('Data is more than 30 days old');
    } else if (daysOld > 7) {
      freshness = 80;
    }

    // Use confidence score as accuracy proxy
    const accuracy = data.confidence || 70;

    // Calculate overall score
    const overall = (completeness * 0.4 + freshness * 0.3 + accuracy * 0.3);

    return {
      completeness,
      freshness,
      accuracy,
      overall,
      warnings,
    };
  }

  /**
   * Calculate confidence for aggregated data
   */
  private calculateConfidence(
    sourceData: Map<DataSource, Partial<StandardMarketData>>,
    qualityScores: Map<DataSource, DataQuality>,
  ): number {
    let totalQuality = 0;
    let count = 0;

    for (const [source, quality] of qualityScores) {
      totalQuality += quality.overall;
      count++;
    }

    const avgQuality = count > 0 ? totalQuality / count : 50;
    
    // Bonus for multiple sources
    const sourceBonus = Math.min(20, sourceData.size * 5);
    
    return Math.min(100, avgQuality + sourceBonus);
  }

  /**
   * Get adapters in priority order
   */
  private getPrioritizedSources(): Array<[DataSource, any]> {
    const entries = Array.from(this.adapters.entries());
    
    entries.sort((a, b) => {
      const configA = a[1].getConfig();
      const configB = b[1].getConfig();
      return configA.priority - configB.priority;
    });

    return entries;
  }

  /**
   * Get list of available adapters
   */
  async getAvailableAdapters(): Promise<DataSource[]> {
    const available: DataSource[] = [];

    for (const [source, adapter] of this.adapters) {
      if (await adapter.isAvailable()) {
        available.push(source);
      }
    }

    return available;
  }

  /**
   * Test all connections
   */
  async testAllConnections(): Promise<Map<DataSource, boolean>> {
    const results = new Map<DataSource, boolean>();

    for (const [source, adapter] of this.adapters) {
      const isAvailable = await adapter.testConnection();
      results.set(source, isAvailable);
    }

    return results;
  }
}

export default DataAggregator;

