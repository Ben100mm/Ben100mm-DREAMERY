# Rental Market Data Integration - Quick Start Guide

## Overview

This guide will help you quickly set up and use the rental market data integration in your Dreamery property platform.

## Prerequisites

- Node.js and npm installed
- Python 3.8+ installed
- Access to the Dreamery codebase

## Setup (5 minutes)

### 1. Install Dependencies

The rental market data integration uses existing dependencies. No additional packages are required.

### 2. Configure API Keys

Add your API keys to your `.env` file:

```bash
# Get free API keys from:
# RentCast: https://developers.rentcast.io/ (50 free calls/month)
# FreeWebApi: https://freewebapi.com/data-apis/real-estate-api/ (100 free calls/day)

RENTCAST_API_KEY="your-rentcast-api-key"
FREEWEBAPI_API_KEY="your-freewebapi-api-key"
```

### 3. Start the Backend Server

```bash
cd server
python realtor_api.py
```

The server will start on `http://localhost:5001`

## Usage Examples

### Basic Rental Data Retrieval

```typescript
import { useRentalData } from './hooks/useRentalData';

function PropertyRentalInfo() {
  const { rentalData, loading, error, getRentalEstimate } = useRentalData();

  const handleGetRentalData = async () => {
    await getRentalEstimate({
      address: "123 Main St, San Francisco, CA",
      bedrooms: 2,
      bathrooms: 1.5,
      square_feet: 1200
    });
  };

  return (
    <div>
      <button onClick={handleGetRentalData}>
        Get Rental Data
      </button>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {rentalData && (
        <div>
          <h3>Rental Estimate: ${rentalData.estimated_rent?.toLocaleString()}</h3>
          <p>Source: {rentalData.data_source}</p>
          <p>Confidence: {rentalData.confidence_score}</p>
        </div>
      )}
    </div>
  );
}
```

### Using the Rental Data Card Component

```typescript
import RentalDataCard from './components/RentalDataCard';
import { useRentalData } from './hooks/useRentalData';

function PropertyDetails() {
  const { rentalData, getRentalEstimate } = useRentalData();

  return (
    <div>
      <RentalDataCard 
        rentalData={rentalData}
        showDetails={true}
        title="Market Rental Analysis"
      />
    </div>
  );
}
```

### Compare Multiple Data Sources

```typescript
import { rentalService } from './services/rentalService';

async function compareRentalSources() {
  const request = {
    address: "123 Main St, San Francisco, CA",
    bedrooms: 2,
    bathrooms: 1.5
  };

  const comparison = await rentalService.compareRentalSources(request);
  
  console.log('Average Rent:', comparison.comparison.average_rent);
  console.log('RentCast Data:', comparison.rentcast);
  console.log('FreeWebApi Data:', comparison.freewebapi);
}
```

## API Endpoints

### Get Rental Estimate
```bash
POST http://localhost:5001/api/rental/estimate
Content-Type: application/json

{
  "address": "123 Main St, San Francisco, CA",
  "bedrooms": 2,
  "bathrooms": 1.5,
  "square_feet": 1200
}
```

### Get RentCast Data
```bash
POST http://localhost:5001/api/rental/rentcast
Content-Type: application/json

{
  "address": "123 Main St, San Francisco, CA",
  "bedrooms": 2,
  "bathrooms": 1.5
}
```

### Get FreeWebApi Data
```bash
POST http://localhost:5001/api/rental/freewebapi
Content-Type: application/json

{
  "address": "123 Main St, San Francisco, CA"
}
```

## Data Structure

The rental data includes:

```typescript
{
  estimated_rent: 3500,           // Monthly rent estimate
  rent_range_low: 3200,           // Low end of rent range
  rent_range_high: 3800,          // High end of rent range
  market_rent_per_sqft: 2.92,     // Rent per square foot
  bedrooms: 2,                     // Number of bedrooms
  bathrooms: 1.5,                  // Number of bathrooms
  square_feet: 1200,              // Property square footage
  data_source: "RentCast",        // Data source
  confidence_score: 0.85,         // Confidence level (0-1)
  last_updated: "2024-01-15T10:30:00Z"
}
```

## Free API Limits

- **RentCast**: 50 calls per month
- **FreeWebApi**: 100 calls per day

The system automatically handles rate limiting and falls back to available sources.

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Check your `.env` file has the correct API keys
   - Restart the server after adding keys

2. **"Unable to retrieve rental data" error**
   - Verify the address format is correct
   - Check if the property exists in the API databases
   - Try a different address

3. **Rate limit exceeded**
   - Wait for the rate limit to reset
   - Consider upgrading to paid plans for higher limits

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

## Next Steps

1. **Integrate with Property Search**: Add rental data to property search results
2. **Create Rental Analysis**: Build rental yield calculators
3. **Add Market Trends**: Implement trend analysis features
4. **Enhance UI**: Create interactive rental data visualizations

## Support

For questions or issues:
1. Check the full documentation in `docs/RENTAL_MARKET_DATA_INTEGRATION.md`
2. Review the API documentation
3. Contact the development team

## License

This integration is part of the Dreamery Software LLC proprietary platform.
