# External Data Integration Guide

## Overview

This guide covers the implementation of external data enrichment for the Dreamery property platform. The system integrates with multiple APIs to provide comprehensive property data including walkability scores, amenities, transit information, demographics, and school data.

## Architecture

### Components

1. **External Data Service** (`external_data_service.py`)
   - Core service for API integrations
   - Handles rate limiting and error management
   - Provides data models for enriched information

2. **Enhanced Realtor API** (`enhanced_realtor_api.py`)
   - Flask API server for enriched property data
   - Async processing for batch enrichment
   - RESTful endpoints for frontend integration

3. **Enrichment Pipeline** (`enrichment_pipeline.py`)
   - Batch processing for existing properties
   - Database integration
   - Command-line interface for automation

4. **Environment Configuration** (`environment_config.py`)
   - API key management
   - Configuration validation
   - Rate limiting settings

## External APIs Integrated

### 1. Walk Score API
**Purpose**: Walkability, bikeability, and transit scores
**Documentation**: https://www.walkscore.com/professional/api-sign-up.php
**Data Provided**:
- Walk Score (0-100)
- Bike Score (0-100)
- Transit Score (0-100)
- Descriptive text

### 2. Google Places API
**Purpose**: Nearby amenities and points of interest
**Documentation**: https://developers.google.com/maps/documentation/places/web-service
**Data Provided**:
- Restaurants, cafes, grocery stores
- Healthcare facilities, schools
- Parks, shopping centers
- Ratings and distance information

### 3. US Census API
**Purpose**: Demographic and economic data
**Documentation**: https://api.census.gov/data/
**Data Provided**:
- Population statistics
- Median age and income
- Education levels
- Employment rates
- Housing units

### 4. Transit APIs
**Purpose**: Public transportation information
**Implementation**: Uses Google Places API for transit stops
**Data Provided**:
- Nearest transit stops
- Distance to stops
- Available routes (future enhancement)

### 5. School APIs
**Purpose**: Educational institution data
**Implementation**: Uses Google Places API for schools
**Data Provided**:
- School names and types
- Ratings and distances
- District information (future enhancement)

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the server directory:

```bash
# Walk Score API
WALKSCORE_API_KEY=your_walkscore_api_key_here

# Google Places API
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# US Census API
CENSUS_API_KEY=your_census_api_key_here

# Mapbox Token (for frontend)
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here

# Rate Limiting
WALKSCORE_RATE_LIMIT=1000
GOOGLE_PLACES_RATE_LIMIT=1000
CENSUS_RATE_LIMIT=500

# Cache Settings
CACHE_ENABLED=true
CACHE_DURATION_HOURS=24
```

### 2. API Key Setup

#### Walk Score API
1. Sign up at: https://www.walkscore.com/professional/api-sign-up.php
2. Get your API key
3. Set `WALKSCORE_API_KEY` environment variable

#### Google Places API
1. Go to: https://console.cloud.google.com/apis/credentials
2. Enable Places API
3. Create credentials (API key)
4. Set `GOOGLE_PLACES_API_KEY` environment variable

#### US Census API
1. Sign up at: https://api.census.gov/data/key_signup.html
2. Get your API key
3. Set `CENSUS_API_KEY` environment variable

#### Mapbox
1. Sign up at: https://account.mapbox.com/
2. Get your access token
3. Set `REACT_APP_MAPBOX_TOKEN` environment variable

### 3. Installation

```bash
# Install Python dependencies
cd server
pip install -r requirements.txt

# Install additional dependencies for external APIs
pip install googlemaps census geopy aiohttp
```

### 4. Running the Services

#### Start Enhanced API Server
```bash
cd server
python start_enhanced_api.py
```

#### Run Enrichment Pipeline
```bash
cd server
python enrichment_pipeline.py --limit 100 --batch-size 10
```

#### Validate Configuration
```bash
cd server
python enrichment_pipeline.py --validate-config
```

## API Endpoints

### Enhanced Property API

#### GET /api/enhanced/properties
Get properties with enriched data

**Parameters**:
- `location`: Search location
- `limit`: Number of properties to return
- `property_type`: Type of property

**Example**:
```bash
curl "http://localhost:8002/api/enhanced/properties?location=San+Francisco&limit=10"
```

#### GET /api/enhanced/properties/{property_id}
Get single property with enriched data

**Example**:
```bash
curl "http://localhost:8002/api/enhanced/properties/prop_123"
```

#### POST /api/enhanced/enrich
Enrich existing properties

**Body**:
```json
{
  "properties": [
    {
      "property_id": "prop_123",
      "address": {"formatted_address": "123 Main St, San Francisco, CA"},
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  ],
  "batch_size": 10
}
```

#### GET /api/enhanced/health
Check API health and configuration

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "services": {
    "walkscore": true,
    "google_places": true,
    "census": false,
    "transit": true,
    "schools": true
  }
}
```

## Frontend Integration

### React Hooks

#### useEnrichedPropertyData
```typescript
import { useEnrichedPropertyData } from '../hooks/useEnrichedPropertyData';

const { properties, loading, error, searchProperties } = useEnrichedPropertyData();

// Search for enriched properties
await searchProperties({
  location: 'San Francisco, CA',
  limit: 20
});
```

#### usePropertyEnrichment
```typescript
import { usePropertyEnrichment } from '../hooks/useEnrichedPropertyData';

const { enriching, enrichProperties } = usePropertyEnrichment();

// Enrich existing properties
const enrichedProperties = await enrichProperties(properties);
```

### Property Data Structure

Enhanced properties include additional fields:

```typescript
interface PropertyData {
  // ... existing fields ...
  
  // External enrichment data
  walk_score?: number;
  bike_score?: number;
  transit_score?: number;
  amenities?: Array<{
    name: string;
    type: string;
    rating?: number;
    distance_meters?: number;
  }>;
  demographics?: {
    population?: number;
    median_age?: number;
    median_income?: number;
    employment_rate?: number;
  };
  schools?: Array<{
    name: string;
    type: string;
    rating?: number;
    distance_meters?: number;
  }>;
}
```

## Data Enrichment Pipeline

### Batch Processing

The enrichment pipeline can process properties in batches:

```bash
# Process 100 properties with batch size of 10
python enrichment_pipeline.py --limit 100 --batch-size 10

# Reprocess properties enriched more than 30 days ago
python enrichment_pipeline.py --days-since-enrichment 30

# Export enriched data
python enrichment_pipeline.py --export --output-file enriched_data.json
```

### Database Integration

The pipeline automatically updates the database with enriched data:

```sql
UPDATE properties SET
  walk_score = :walk_score,
  bike_score = :bike_score,
  transit_score = :transit_score,
  amenities = :amenities,
  demographics = :demographics,
  schools = :schools,
  enrichment_date = :enrichment_date
WHERE property_id = :property_id;
```

## Rate Limiting

The system implements intelligent rate limiting for each API:

- **Walk Score**: 1000 requests/minute
- **Google Places**: 1000 requests/minute
- **Census**: 500 requests/minute
- **Transit**: 100 requests/minute
- **Schools**: 100 requests/minute

Rate limits are configurable via environment variables.

## Error Handling

### API Failures
- Automatic retry with exponential backoff
- Graceful degradation when APIs are unavailable
- Comprehensive logging of errors and warnings

### Data Validation
- Input validation for coordinates and addresses
- Data type checking for API responses
- Fallback to cached data when available

## Monitoring and Logging

### Logging Configuration
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Health Monitoring
The `/api/enhanced/health` endpoint provides:
- Service status
- Configuration validation
- API availability check

## Performance Optimization

### Caching Strategy
- 24-hour cache for enriched data
- In-memory caching for API responses
- Database caching for frequently accessed properties

### Batch Processing
- Concurrent API calls within rate limits
- Configurable batch sizes
- Progress tracking and reporting

### Database Optimization
- Indexed queries for enriched data
- Efficient JSON storage for complex data
- Regular cleanup of stale enrichment data

## Security Considerations

### API Key Management
- Environment variable storage
- No hardcoded keys in source code
- Regular key rotation support

### Data Privacy
- No personal information in API calls
- Coordinate-based lookups only
- GDPR-compliant data handling

## Troubleshooting

### Common Issues

#### API Key Not Working
```bash
# Validate configuration
python enrichment_pipeline.py --validate-config

# Check environment variables
echo $WALKSCORE_API_KEY
```

#### Rate Limit Exceeded
- Reduce batch size
- Increase delays between requests
- Check API usage quotas

#### No Data Returned
- Verify coordinates are valid
- Check API service status
- Review error logs

### Debug Mode
```bash
# Enable debug logging
export ENHANCED_API_DEBUG=true
python start_enhanced_api.py
```

## Future Enhancements

### Planned Features
1. **Advanced Transit Data**
   - Real-time arrival information
   - Route planning integration
   - Transit frequency data

2. **Enhanced School Data**
   - School district APIs
   - Test scores and ratings
   - Enrollment statistics

3. **Crime Data Integration**
   - Local crime statistics
   - Safety scores
   - Historical trends

4. **Climate Data**
   - Weather patterns
   - Climate risk assessment
   - Environmental factors

### Performance Improvements
1. **GraphQL API**
   - Efficient data fetching
   - Flexible queries
   - Real-time subscriptions

2. **Machine Learning**
   - Predictive property values
   - Market trend analysis
   - Personalized recommendations

## Support

For issues or questions:
1. Check the logs for error messages
2. Validate API configuration
3. Review rate limiting settings
4. Check external API status pages

## License

This implementation follows the same license as the main Dreamery project.
