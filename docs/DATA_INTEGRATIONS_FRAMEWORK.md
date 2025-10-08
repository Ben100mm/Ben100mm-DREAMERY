# Data Integrations Framework

## Overview

The Data Integrations Framework provides a unified, type-safe interface for accessing real estate market data from multiple authoritative sources. It intelligently aggregates data, handles fallbacks, assesses quality, and provides caching and rate limiting capabilities.

## Features

### 🌐 Multi-Source Integration
- **Zillow Research Data** - Home values (ZHVI), rent prices (ZRI), market trends
- **Realtor.com Economic Data** - Market statistics, inventory data, days on market
- **US Census Bureau** - Demographics, housing statistics, economic indicators
- **Local MLS Data** - Multiple Listing Service data with local market statistics

### 🎯 Intelligent Aggregation
- **Weighted Average** - Combines data using configurable weights and quality scores
- **Priority Selection** - Uses highest priority source for each field
- **Best Quality** - Selects source with highest overall quality score
- **Consensus** - Uses median values across all sources

### ✅ Quality Assessment
- **Completeness** - Evaluates data field coverage
- **Freshness** - Assesses data age and currency
- **Accuracy** - Confidence scoring for reliability
- **Warnings** - Identifies data quality issues

### ⚡ Performance & Reliability
- Built-in caching with configurable TTL
- Automatic rate limit management
- Intelligent fallback mechanisms
- Retry logic with exponential backoff

## Getting Started

### Quick Start

```typescript
import { useDataIntegrations } from '../hooks/useDataIntegrations';
import { AggregationStrategy } from '../services/dataIntegrations';

function MyComponent() {
  const {
    marketData,
    loading,
    error,
    fetchMarketData,
  } = useDataIntegrations({
    strategy: AggregationStrategy.WEIGHTED_AVERAGE,
    minimumSources: 1,
  });

  const handleFetch = async () => {
    await fetchMarketData('94102');
  };

  return (
    <div>
      <button onClick={handleFetch}>Fetch Data</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {marketData && (
        <div>
          <p>Median Rent: ${marketData.medianRent}</p>
          <p>Median Price: ${marketData.medianPrice}</p>
          <p>Confidence: {marketData.confidence}%</p>
        </div>
      )}
    </div>
  );
}
```

### Using the Widget

The framework includes a ready-to-use widget component:

```typescript
import { MarketDataIntegrationWidget } from '../components/MarketDataIntegrationWidget';

function MyPage() {
  return (
    <div>
      <h1>Real Estate Analysis</h1>
      <MarketDataIntegrationWidget 
        initialZipCode="94102"
        compact={false}
        autoExpand={true}
      />
    </div>
  );
}
```

## Architecture

### Directory Structure

```
src/
├── services/
│   └── dataIntegrations/
│       ├── index.ts              # Main exports
│       ├── types.ts              # TypeScript types and interfaces
│       ├── dataAggregator.ts     # Core aggregation logic
│       ├── zillowAdapter.ts      # Zillow API adapter
│       ├── realtorAdapter.ts     # Realtor.com API adapter
│       ├── censusAdapter.ts      # Census Bureau adapter
│       ├── mlsAdapter.ts         # MLS data adapter
│       └── mockProviders.ts      # Mock data for development
├── hooks/
│   └── useDataIntegrations.ts    # React hook for easy access
├── components/
│   ├── DataIntegrations/
│   │   ├── DataSourcesStatus.tsx # Source status component
│   │   └── MarketDataExplorer.tsx # Data explorer component
│   └── MarketDataIntegrationWidget.tsx # Reusable widget
└── pages/
    └── DataSourcesDashboard.tsx  # Full dashboard page
```

### Core Components

#### DataAggregator
The central orchestrator that:
- Manages multiple data source adapters
- Implements aggregation strategies
- Handles fallbacks and retries
- Assesses data quality
- Returns standardized results

#### Data Source Adapters
Each adapter implements the `DataSourceAdapter` interface:
- `fetchData()` - Retrieve market data
- `isAvailable()` - Check if adapter is configured and available
- `testConnection()` - Verify API connectivity
- `getMetadata()` - Return adapter information
- `getConfig()` - Access configuration settings

#### React Hook
`useDataIntegrations` provides:
- State management for market data
- Loading and error states
- Data source status tracking
- Convenience methods for fetching and clearing data

## API Reference

### Standard Market Data

```typescript
interface StandardMarketData {
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
```

### Aggregated Market Data

```typescript
interface AggregatedMarketData extends StandardMarketData {
  sources: DataSource[];
  sourceData: Map<DataSource, Partial<StandardMarketData>>;
  aggregationStrategy: AggregationStrategy;
  qualityScores: Map<DataSource, DataQuality>;
}
```

### Aggregation Strategies

```typescript
enum AggregationStrategy {
  WEIGHTED_AVERAGE = 'weighted_average',  // Recommended
  PRIORITY = 'priority',
  BEST_QUALITY = 'best_quality',
  CONSENSUS = 'consensus',
}
```

### Data Quality

```typescript
interface DataQuality {
  completeness: number; // 0-100
  freshness: number;    // 0-100
  accuracy: number;     // 0-100
  overall: number;      // 0-100
  warnings: string[];
}
```

## Configuration

### Environment Variables

Configure API keys in your `.env` file:

```bash
# Zillow Research Data API
REACT_APP_ZILLOW_API_KEY=your_zillow_key_here

# Realtor.com Economic API
REACT_APP_REALTOR_API_KEY=your_realtor_key_here

# US Census Bureau (optional - API is public)
REACT_APP_CENSUS_API_KEY=your_census_key_here

# Local MLS Data
REACT_APP_MLS_API_KEY=your_mls_key_here
REACT_APP_MLS_BASE_URL=https://your.mls.api.com
```

### Programmatic Configuration

```typescript
import { DataAggregator, AggregationStrategy } from '../services/dataIntegrations';

const aggregator = new DataAggregator({
  strategy: AggregationStrategy.WEIGHTED_AVERAGE,
  weights: new Map([
    [DataSource.ZILLOW, 0.35],
    [DataSource.REALTOR, 0.35],
    [DataSource.MLS, 0.20],
    [DataSource.CENSUS, 0.10],
  ]),
  minimumSources: 2,
  requiredSources: [DataSource.ZILLOW],
  conflictResolution: ConflictResolution.PREFER_NEWEST,
});
```

## Advanced Usage

### Direct API Access

```typescript
import {
  DataAggregator,
  ZillowAdapter,
  DataSource,
} from '../services/dataIntegrations';

// Create custom aggregator
const aggregator = new DataAggregator({
  strategy: AggregationStrategy.BEST_QUALITY,
  minimumSources: 3,
});

// Fetch aggregated data
const data = await aggregator.fetchAggregatedData('94102', {
  forceRefresh: true,
  timeout: 15000,
});

// Access individual source data
const zillowData = data.sourceData.get(DataSource.ZILLOW);

// Check quality scores
const zillowQuality = data.qualityScores.get(DataSource.ZILLOW);
console.log('Completeness:', zillowQuality.completeness);
console.log('Freshness:', zillowQuality.freshness);

// Test connections
const statuses = await aggregator.testAllConnections();
console.log('Zillow:', statuses.get(DataSource.ZILLOW));
```

### Custom Adapter

Create a custom adapter by implementing the `DataSourceAdapter` interface:

```typescript
import {
  DataSourceAdapter,
  StandardMarketData,
  DataSourceMetadata,
  DataSourceConfig,
  FetchOptions,
  DataSource,
} from '../services/dataIntegrations/types';

export class CustomAdapter implements DataSourceAdapter {
  private config: DataSourceConfig;
  
  constructor(config?: Partial<DataSourceConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      apiKey: config?.apiKey || process.env.REACT_APP_CUSTOM_API_KEY,
      baseURL: config?.baseURL || 'https://api.custom.com',
      timeout: config?.timeout ?? 10000,
      retryAttempts: config?.retryAttempts ?? 3,
      cacheTTL: config?.cacheTTL ?? 24 * 60 * 60 * 1000,
      priority: config?.priority ?? 5,
    };
  }

  async fetchData(
    zipCode: string,
    options?: FetchOptions
  ): Promise<StandardMarketData> {
    // Implement your data fetching logic
    // Transform to StandardMarketData format
  }

  async isAvailable(): Promise<boolean> {
    return this.config.enabled && !!this.config.apiKey;
  }

  async testConnection(): Promise<boolean> {
    // Test API connectivity
  }

  getMetadata(): DataSourceMetadata {
    return {
      name: 'Custom Data Source',
      source: DataSource.CUSTOM,
      isAvailable: this.config.enabled,
    };
  }

  getConfig(): DataSourceConfig {
    return { ...this.config };
  }
}
```

## Dashboard

Access the full Data Sources Dashboard at `/data-sources` to:

- Monitor real-time connection status
- Test data source availability
- Fetch and explore market data interactively
- Compare data across sources
- View quality metrics and warnings
- Access API documentation

## Best Practices

### 1. Use the React Hook
For most use cases, use the `useDataIntegrations` hook for automatic state management and optimal performance.

### 2. Handle Errors Gracefully
Always handle errors and provide fallback UI:

```typescript
const { marketData, loading, error, fetchMarketData } = useDataIntegrations();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!marketData) return <EmptyState />;
```

### 3. Cache Appropriately
Market data changes slowly. Use default caching settings (24 hours) for most use cases.

### 4. Monitor Quality
Check confidence scores and quality warnings before using data in critical calculations:

```typescript
if (marketData.confidence < 70) {
  // Show warning to user about data quality
}

marketData.qualityScores.forEach((quality, source) => {
  if (quality.warnings.length > 0) {
    console.warn(`${source} warnings:`, quality.warnings);
  }
});
```

### 5. Test Connections
Periodically test data source connections:

```typescript
const { testAllConnections } = useDataIntegrations();

useEffect(() => {
  // Test on mount and every hour
  testAllConnections();
  const interval = setInterval(testAllConnections, 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

## Development

### Mock Data

Without API keys, the framework automatically uses mock data for development and testing:

```typescript
import { MockProviders } from '../services/dataIntegrations';

// Generate consistent mock data
const mockData = MockProviders.zillow('94102');
const standardized = MockProviders.zillowToStandard(mockData, '94102');
```

### Testing

```typescript
import { DataAggregator, DataSource } from '../services/dataIntegrations';

describe('Data Integrations', () => {
  it('should aggregate data from multiple sources', async () => {
    const aggregator = new DataAggregator();
    const data = await aggregator.fetchAggregatedData('94102');
    
    expect(data.zipCode).toBe('94102');
    expect(data.sources.length).toBeGreaterThan(0);
    expect(data.confidence).toBeGreaterThanOrEqual(0);
  });
});
```

## Troubleshooting

### No Data Sources Available

**Problem**: `availableSources.length === 0`

**Solution**: 
1. Check that API keys are configured in `.env`
2. Verify environment variables are prefixed with `REACT_APP_`
3. Restart development server after changing `.env`
4. Check adapter configurations in `DataAggregator` constructor

### Low Confidence Scores

**Problem**: `marketData.confidence < 50`

**Solution**:
1. Check quality scores for individual sources
2. Review warnings in quality assessments
3. Consider increasing `minimumSources` requirement
4. Verify data freshness (check `dateUpdated`)

### API Rate Limits

**Problem**: Frequent rate limit errors

**Solution**:
1. Increase cache TTL to reduce API calls
2. Implement request throttling
3. Use priority selection strategy to minimize requests
4. Monitor rate limit metadata in source status

### Connection Failures

**Problem**: Sources showing as disconnected

**Solution**:
1. Verify API keys are valid and not expired
2. Check API service status
3. Review network connectivity
4. Examine error logs for specific failure reasons

## Support

For issues, questions, or contributions:

1. Check the [API Documentation](#api-reference)
2. Review the dashboard at `/data-sources`
3. Examine the source code in `src/services/dataIntegrations/`
4. Contact the development team

## License

Copyright © 2024 Dreamery Software LLC. All rights reserved.

