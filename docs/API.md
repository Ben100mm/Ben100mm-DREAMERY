# API Documentation

**Dreamery Homepage - API Integration & Endpoints**

## Overview

The Dreamery Homepage integrates with multiple APIs to provide comprehensive real estate data and functionality.

## Backend API (Flask)

### Base URL
```
http://localhost:5001/api
```

### Health Check
```
GET /api/realtor/health
```
Returns server status and version information.

### Property Search
```
POST /api/realtor/search
```
Search for properties with various filters and parameters.

**Request Body:**
```json
{
  "location": "San Francisco, CA",
  "listing_type": "for_sale",
  "property_type": ["single_family", "condos"],
  "radius": 5.0,
  "limit": 100
}
```

**Response:**
```json
{
  "properties": [...],
  "summary": {
    "total_count": 150,
    "average_price": 1200000,
    "min_price": 800000,
    "max_price": 2500000
  }
}
```

## External API Integrations

### Realtor.com Integration
- **Purpose**: Property data scraping and search
- **Authentication**: API key required
- **Rate Limits**: 250,000 requests/day
- **Data Types**: Property listings, details, estimates

### Apple Maps Integration
- **Purpose**: Interactive property maps and location services
- **Authentication**: JWT token required
- **Features**: Map display, property markers, street view
- **Usage Limits**: 250,000 map loads/day

## Frontend API Services

### Property Service
```typescript
import { realtorService } from '../services/realtorService';

// Search properties
const properties = await realtorService.searchProperties({
  location: 'San Francisco, CA',
  listingType: 'for_sale',
  propertyType: ['single_family', 'condos']
});

// Get property details
const property = await realtorService.getPropertyDetails(propertyId);
```

### Maps Service
```typescript
import { mapsService } from '../services/mapsService';

// Initialize map
const map = await mapsService.initializeMap(containerId, {
  center: { lat: 37.7749, lng: -122.4194 },
  zoom: 12
});

// Add property markers
await mapsService.addPropertyMarkers(properties);
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property with ID 123 not found",
    "details": {
      "property_id": "123",
      "timestamp": "2024-12-25T10:30:00Z"
    }
  }
}
```

### Error Codes
- `PROPERTY_NOT_FOUND` - Property doesn't exist
- `INVALID_LOCATION` - Location parameter invalid
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `AUTHENTICATION_FAILED` - Invalid API credentials
- `SERVER_ERROR` - Internal server error

## Rate Limits

### Realtor.com API
- **Free Tier**: 250,000 requests/day
- **Burst Limit**: 100 requests/minute
- **Reset Time**: Daily at midnight UTC

### Apple Maps API
- **Free Tier**: 250,000 map loads/day
- **Concurrent Limit**: 10 simultaneous requests
- **Reset Time**: Daily at midnight UTC

## Authentication

### API Keys
Store API keys in environment variables:
```bash
REALTOR_API_KEY=your_realtor_api_key
APPLE_MAPS_JWT_TOKEN=your_apple_maps_token
```

### Frontend Authentication
```typescript
// Check authentication status
const isAuthenticated = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Login
await authService.login(email, password);
```

## Data Models

### Property Model
```typescript
interface Property {
  property_id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  list_price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  listing_type: 'for_sale' | 'for_rent' | 'pending' | 'sold';
  photos: string[];
  description: string;
}
```

### Search Parameters
```typescript
interface SearchParams {
  location: string;
  listing_type: 'for_sale' | 'for_rent';
  property_type: string[];
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet_min?: number;
  radius?: number;
  limit?: number;
}
```

## Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5001/api/realtor/health

# Test property search
curl -X POST http://localhost:5001/api/realtor/search \
  -H "Content-Type: application/json" \
  -d '{"location": "San Francisco, CA", "listing_type": "for_sale"}'
```

### Frontend Testing
```typescript
// Test API service
import { realtorService } from '../services/realtorService';

test('property search returns results', async () => {
  const result = await realtorService.searchProperties({
    location: 'San Francisco, CA',
    listing_type: 'for_sale'
  });
  
  expect(result.properties).toBeDefined();
  expect(result.properties.length).toBeGreaterThan(0);
});
```

## Monitoring

### API Health Monitoring
- Health check endpoint: `/api/realtor/health`
- Response time monitoring
- Error rate tracking
- Rate limit monitoring

### Performance Metrics
- Request/response times
- API success rates
- Data freshness
- Cache hit rates

---

**Classification**: INTERNAL USE ONLY  
**Access**: AUTHORIZED PERSONNEL ONLY
