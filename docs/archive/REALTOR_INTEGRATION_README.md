# Realtor.com Data Integration

This document describes the integration of Realtor.com data parsing functionality into the Dreamery homepage project.

## Overview

The integration adds comprehensive real estate data processing capabilities using Python parsers and TypeScript services, enabling dynamic property search and display functionality.

## Architecture

### Python Backend (Server)

#### Files Added/Modified:
- `server/models.py` - Data models for property information
- `server/parsers.py` - Parsers for Realtor.com data processing
- `server/realtor_api.py` - Flask API endpoints
- `server/dreamery_property_scraper.py` - Updated to use new parsers
- `server/requirements.txt` - Python dependencies
- `server/start_realtor_api.py` - Server startup script

#### Key Features:
- **Data Models**: Structured models for addresses, descriptions, open houses, units, tax records, and estimates
- **Parsers**: Functions to parse and normalize Realtor.com API responses
- **API Endpoints**: RESTful API for property search and details
- **Error Handling**: Comprehensive error handling and logging

### TypeScript Frontend

#### Files Added:
- `src/types/realtor.ts` - TypeScript interfaces for Realtor.com data
- `src/services/realtorService.ts` - Service layer for API communication
- `src/hooks/useRealtorData.ts` - React hooks for data management
- `src/components/RealtorPropertyCard.tsx` - Property display component

#### Key Features:
- **Type Safety**: Full TypeScript support for all data structures
- **Service Layer**: Clean abstraction for API communication
- **React Hooks**: Custom hooks for data fetching and state management
- **Reusable Components**: Property card component with modern UI

## Data Flow

1. **User Search**: User enters search criteria in the frontend
2. **API Call**: TypeScript service sends request to Python API
3. **Data Fetching**: Python scraper fetches data from Realtor.com
4. **Parsing**: Raw data is parsed using the parser functions
5. **Normalization**: Data is converted to structured models
6. **API Response**: JSON response sent back to frontend
7. **Display**: React components render the property data

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Start the Python API Server

```bash
cd server
python start_realtor_api.py
```

The server will start on `http://localhost:5001`

### 3. Update Frontend Configuration

The TypeScript service is configured to use the Python API at `/api/realtor`. Make sure your frontend build process can proxy requests to the Python server.

### 4. Use in React Components

```typescript
import { useRealtorData } from '../hooks/useRealtorData';
import RealtorPropertyCard from '../components/RealtorPropertyCard';

function PropertySearch() {
  const { properties, loading, error, searchProperties } = useRealtorData();

  const handleSearch = () => {
    searchProperties({
      location: 'San Francisco, CA',
      listing_type: 'for_sale',
      min_price: 500000,
      max_price: 2000000,
      beds: 2,
      limit: 20
    });
  };

  return (
    <div>
      <button onClick={handleSearch}>Search Properties</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div className="properties-grid">
        {properties.map(property => (
          <RealtorPropertyCard
            key={property.property_id}
            property={property}
            onPropertyClick={(prop) => console.log('Clicked:', prop)}
          />
        ))}
      </div>
    </div>
  );
}
```

## API Endpoints

### Search Properties
- **POST** `/api/realtor/search`
- **Body**: RealtorSearchParams
- **Response**: RealtorApiResponse

### Get Property Details
- **GET** `/api/realtor/property/{property_id}`
- **Response**: PropertyData

### Get Suggestions
- **GET** `/api/realtor/suggestions?q={query}&limit={limit}`
- **Response**: Array of suggestion strings

### Health Check
- **GET** `/api/realtor/health`
- **Response**: Server status

## Data Models

### PropertyData
Main property data structure containing:
- Basic info (ID, status, price)
- Address details
- Property description
- Open houses
- Units (for multi-family)
- Tax records
- Estimates
- Photos and media

### Address
Structured address information:
- Full address line
- Individual components (street, city, state, zip)
- Street details (number, direction, name, suffix)

### Description
Property characteristics:
- Photos and media
- Property type and style
- Bedrooms, bathrooms, square footage
- Year built, garage, stories
- Additional details

## Error Handling

The integration includes comprehensive error handling:

1. **Python Level**: Try-catch blocks around all parsing operations
2. **API Level**: HTTP status codes and error responses
3. **TypeScript Level**: Service layer error handling
4. **React Level**: Hook-based error state management

## Performance Considerations

- **Debounced Search**: Autocomplete suggestions are debounced
- **Caching**: Service layer can be extended with caching
- **Pagination**: API supports pagination for large result sets
- **Image Optimization**: Property images are optimized for display

## Security

- **CORS**: Enabled for frontend integration
- **Input Validation**: All inputs are validated
- **Error Sanitization**: Error messages are sanitized before sending to frontend

## Future Enhancements

1. **Caching Layer**: Add Redis or similar for API response caching
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Authentication**: Add authentication for API access
4. **WebSocket Support**: Real-time property updates
5. **Advanced Filtering**: More sophisticated search filters
6. **Map Integration**: Geographic property visualization

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all Python dependencies are installed
2. **CORS Issues**: Verify CORS is properly configured
3. **Type Errors**: Ensure TypeScript types are properly imported
4. **API Connection**: Check that the Python server is running

### Debug Mode

Enable debug mode by setting `debug=True` in the Flask app configuration.

## Contributing

When adding new features:

1. Update the Python models if new data fields are needed
2. Add corresponding TypeScript interfaces
3. Update the parsers to handle new data
4. Add API endpoints as needed
5. Update the service layer
6. Add React components and hooks
7. Update this documentation
