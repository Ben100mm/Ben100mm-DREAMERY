# Rental Market Data Integration

## Overview

This document describes the integration of rental market data APIs into the Dreamery property platform. The system now supports multiple free rental data sources to provide comprehensive rental market analysis for properties.

## Features

### Supported APIs

1. **RentCast API** (Primary)
   - **Free Tier**: 50 API calls per month
   - **Data**: Rental estimates, rent ranges, confidence scores
   - **Coverage**: United States
   - **Documentation**: https://developers.rentcast.io/

2. **FreeWebApi** (Secondary)
   - **Free Tier**: 100 API calls per day
   - **Data**: Zestimate rental estimates, rent ranges
   - **Coverage**: United States and Canada
   - **Documentation**: https://freewebapi.com/data-apis/real-estate-api/

### Data Points Provided

- **Rental Estimates**: Current market rent estimates
- **Rent Ranges**: Low and high rent estimates
- **Market Metrics**: Rent per square foot, vacancy rates, growth rates
- **Property Details**: Bedrooms, bathrooms, square footage
- **Location Data**: ZIP code, city, state
- **Data Quality**: Source, confidence scores, last updated timestamps

## Architecture

### Backend Components

#### 1. Data Models (`server/external_data_service.py`)

```python
@dataclass
class RentalMarketData:
    estimated_rent: Optional[float] = None
    rent_range_low: Optional[float] = None
    rent_range_high: Optional[float] = None
    market_rent_per_sqft: Optional[float] = None
    vacancy_rate: Optional[float] = None
    rent_growth_rate: Optional[float] = None
    # ... additional fields
```

#### 2. API Service (`server/external_data_service.py`)

- `get_rentcast_rental_data()`: Fetch data from RentCast API
- `get_freewebapi_rental_data()`: Fetch data from FreeWebApi
- `get_rental_market_data()`: Comprehensive data aggregation
- Rate limiting and error handling
- Data validation and quality scoring

#### 3. Flask Endpoints (`server/realtor_api.py`)

- `POST /api/rental/estimate`: Get comprehensive rental data
- `POST /api/rental/rentcast`: Get RentCast-specific data
- `POST /api/rental/freewebapi`: Get FreeWebApi-specific data

### Frontend Components

#### 1. TypeScript Types (`src/types/rental.ts`)

Complete type definitions for all rental data structures, API responses, and component props.

#### 2. Service Layer (`src/services/rentalService.ts`)

- API communication with error handling
- Data validation and quality assessment
- Source comparison functionality
- Batch data processing

#### 3. React Hooks (`src/hooks/useRentalData.ts`)

- `useRentalData()`: Main hook for rental data management
- `useRentalDataValidation()`: Data quality validation
- `useRentalMarketAnalysis()`: Yield analysis

#### 4. UI Components (`src/components/RentalDataCard.tsx`)

- Comprehensive rental data display
- Source-specific information
- Data quality indicators
- Responsive design

## API Usage

### Get Rental Estimate

```typescript
import { rentalService } from '../services/rentalService';

const request = {
  address: "123 Main St, San Francisco, CA",
  bedrooms: 2,
  bathrooms: 1.5,
  square_feet: 1200
};

const response = await rentalService.getRentalEstimate(request);
```

### Compare Multiple Sources

```typescript
const comparison = await rentalService.compareRentalSources(request);
console.log(comparison.comparison.average_rent);
```

### React Hook Usage

```typescript
import { useRentalData } from '../hooks/useRentalData';

function PropertyComponent() {
  const { 
    rentalData, 
    loading, 
    error, 
    getRentalEstimate 
  } = useRentalData();

  const handleGetRentalData = () => {
    getRentalEstimate({
      address: "123 Main St, San Francisco, CA",
      bedrooms: 2,
      bathrooms: 1.5
    });
  };

  return (
    <div>
      {loading && <p>Loading rental data...</p>}
      {error && <p>Error: {error}</p>}
      {rentalData && <RentalDataCard rentalData={rentalData} />}
    </div>
  );
}
```

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Rental Market Data APIs
RENTCAST_API_KEY="your-rentcast-api-key"
FREEWEBAPI_API_KEY="your-freewebapi-api-key"
```

### API Key Setup

1. **RentCast API**:
   - Visit https://developers.rentcast.io/
   - Sign up for free account
   - Get API key from dashboard
   - Free tier: 50 calls/month

2. **FreeWebApi**:
   - Visit https://freewebapi.com/data-apis/real-estate-api/
   - Sign up for free account
   - Get API key from dashboard
   - Free tier: 100 calls/day

## Rate Limiting

The system implements intelligent rate limiting:

- **RentCast**: 50 calls per month (free tier)
- **FreeWebApi**: 100 calls per day (free tier)
- Automatic fallback between sources
- Request queuing and retry logic

## Data Quality

### Validation Features

- Missing data detection
- Confidence score assessment
- Source reliability scoring
- Data freshness validation
- Range validation (low < high)

### Quality Scoring

- **High (80-100%)**: Complete data with high confidence
- **Medium (60-79%)**: Mostly complete data
- **Low (0-59%)**: Incomplete or unreliable data

## Error Handling

### Backend Errors

- API key validation
- Network timeout handling
- Rate limit management
- Data parsing errors
- Graceful degradation

### Frontend Errors

- User-friendly error messages
- Retry mechanisms
- Fallback data sources
- Loading states
- Error boundaries

## Integration with Existing Features

### Property Enrichment

Rental market data is automatically included in property enrichment:

```python
# In external_data_service.py
def enrich_property(self, property_data: Dict[str, Any]) -> EnrichedPropertyData:
    # ... existing enrichment
    rental_market_data = self.get_rental_market_data(
        address=address,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        square_feet=square_feet
    )
    # ... return enriched data
```

### Deal Analysis

Rental data integrates with existing deal analysis:

- Cash flow calculations
- ROI analysis
- Cap rate calculations
- Market comparison

## Performance Considerations

### Caching

- API response caching
- Data freshness tracking
- Cache invalidation strategies

### Optimization

- Batch API calls
- Parallel data fetching
- Lazy loading
- Data compression

## Security

### API Key Management

- Environment variable storage
- No hardcoded keys
- Secure key rotation
- Access logging

### Data Privacy

- No personal data storage
- Address anonymization options
- GDPR compliance considerations

## Monitoring and Logging

### Metrics Tracked

- API call success rates
- Response times
- Data quality scores
- Error frequencies
- Rate limit usage

### Logging

- API request/response logging
- Error tracking
- Performance monitoring
- Usage analytics

## Future Enhancements

### Planned Features

1. **Additional Data Sources**
   - Zillow Rentals API
   - Apartment List API
   - RentSpree integration

2. **Advanced Analytics**
   - Market trend analysis
   - Predictive modeling
   - Comparative analysis
   - Investment scoring

3. **Real-time Updates**
   - WebSocket integration
   - Live data streaming
   - Push notifications

4. **Enhanced UI**
   - Interactive charts
   - Market heat maps
   - Trend visualizations
   - Mobile optimization

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify environment variables
   - Check API key validity
   - Confirm account status

2. **Rate Limit Exceeded**
   - Check usage quotas
   - Implement request queuing
   - Consider upgrading plans

3. **Data Quality Issues**
   - Validate input addresses
   - Check property details
   - Review confidence scores

4. **Network Errors**
   - Check internet connection
   - Verify API endpoints
   - Review firewall settings

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug
```

## Support

For technical support or questions:

1. Check the API documentation
2. Review error logs
3. Test with sample data
4. Contact development team

## License

This integration is part of the Dreamery Software LLC proprietary platform. All rights reserved.
