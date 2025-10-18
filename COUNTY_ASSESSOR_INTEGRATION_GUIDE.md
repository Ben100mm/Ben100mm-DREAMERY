# County Assessor API Integration Guide

## Overview

This guide covers the integration of property tax data from county assessor APIs into the Dreamery property platform. The system supports both free and paid data sources with fallback mechanisms.

## Current Implementation Status

✅ **Completed:**
- Enhanced tax data models (`CountyTaxData`)
- County assessor service framework (`CountyAssessorService`)
- Tax data processor for different county formats (`TaxDataProcessor`)
- Integration with existing external data service

🔄 **In Progress:**
- Testing with sample counties
- API key configuration for paid services

## Available Data Sources

### 1. Free Options

#### **Realtor.com (Current Source)**
- **Status**: ✅ Implemented
- **Coverage**: Nationwide
- **Data Quality**: High
- **Cost**: Free (via existing integration)
- **Limitations**: Limited historical data, basic tax information

#### **Cook County, Illinois (Historical Data)**
- **Status**: 🔄 Framework ready
- **Coverage**: Cook County only
- **Data Quality**: High (historical 2006-2020)
- **Cost**: Free
- **Implementation**: Requires PTAXSIM R package integration
- **API**: https://datacatalog.cookcountyil.gov

#### **Find My Assessor (Directory)**
- **Status**: 🔄 Framework ready
- **Coverage**: 3,000+ U.S. counties
- **Data Quality**: Directory only
- **Cost**: Free
- **Implementation**: Web scraping fallback
- **Website**: https://findmyassessor.com

### 2. Free Trial Options

#### **Realie API**
- **Status**: 🔄 Framework ready
- **Coverage**: 3,100+ counties
- **Data Quality**: High
- **Cost**: Free trial, then paid
- **API**: https://api.realie.ai
- **Setup**: Requires API key registration

### 3. Paid Services

#### **TaxNetUSA**
- **Status**: 🔄 Framework ready
- **Coverage**: Nationwide
- **Data Quality**: Very high
- **Cost**: Paid service
- **API**: https://api.taxnetusa.com
- **Setup**: Requires API key and subscription

## Implementation Architecture

### Core Components

1. **CountyAssessorService** (`county_assessor_service.py`)
   - Main service for county assessor data integration
   - Handles rate limiting and error management
   - Provides fallback mechanisms between sources

2. **TaxDataProcessor** (`tax_data_processor.py`)
   - Processes different county data formats
   - Normalizes data into standard structure
   - Handles data cleaning and validation

3. **Enhanced Models** (`models.py`)
   - `CountyTaxData` model for comprehensive tax information
   - Integration with existing `TaxHistory` and `Assessment` models

### Data Flow

```
Property Data → CountyAssessorService → TaxDataProcessor → CountyTaxData → EnrichedPropertyData
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# County Assessor API Keys
REALIE_API_KEY=your_realie_api_key_here
TAXNETUSA_API_KEY=your_taxnetusa_api_key_here

# Optional: County-specific configurations
COOK_COUNTY_API_URL=https://datacatalog.cookcountyil.gov
```

### County Format Configuration

The system supports different county formats through the `CountyFormat` dataclass:

```python
@dataclass
class CountyFormat:
    name: str
    state: str
    county: str
    data_source: str  # api, scraping, csv, etc.
    base_url: Optional[str] = None
    api_endpoint: Optional[str] = None
    field_mappings: Dict[str, str] = None
    requires_auth: bool = False
    rate_limit: int = 60
```

## Usage Examples

### Basic Integration

```python
from county_assessor_service import CountyAssessorService

# Initialize service
service = CountyAssessorService()

# Get tax data for a property
property_data = {
    'property_id': '12345',
    'address': {
        'street': '123 Main St',
        'city': 'Chicago',
        'state': 'IL',
        'county': 'Cook',
        'zip_code': '60601'
    },
    'coordinates': {
        'lat': 41.8781,
        'lng': -87.6298
    }
}

# Enrich property with tax data
enriched_property = service.enrich_property_with_tax_data(property_data)
```

### Batch Processing

```python
# Process multiple properties
properties = [property1, property2, property3]
enriched_properties = service.batch_enrich_properties(properties)
```

### Using Tax Data Processor

```python
from tax_data_processor import TaxDataProcessor

processor = TaxDataProcessor()

# Process tax data for specific county
tax_data = processor.process_tax_data(property_data, 'cook_il')

# Convert to standard format
tax_history = processor.convert_to_tax_history(tax_data)
```

## Supported Counties

### Currently Configured

1. **Cook County, Illinois** (`cook_il`)
   - Data Source: API (historical)
   - Status: Framework ready

2. **Los Angeles County, California** (`la_ca`)
   - Data Source: Web scraping
   - Status: Framework ready

3. **Harris County, Texas** (`harris_tx`)
   - Data Source: Web scraping
   - Status: Framework ready

4. **Miami-Dade County, Florida** (`miami_fl`)
   - Data Source: Web scraping
   - Status: Framework ready

### Adding New Counties

To add support for a new county:

1. **Create County Format Configuration**:
```python
formats['new_county'] = CountyFormat(
    name="New County",
    state="ST",
    county="New County",
    data_source="api",  # or "scraping"
    base_url="https://api.newcounty.gov",
    field_mappings={
        'apn': 'parcel_number',
        'assessed_value': 'total_value',
        # ... other mappings
    }
)
```

2. **Implement Data Processing**:
```python
def _process_new_county_data(self, property_data, county_format):
    # Implement specific processing logic
    pass
```

## Data Quality and Validation

### Confidence Scoring

The system calculates confidence scores based on data completeness:

- **Required fields** (assessed_value, annual_tax, tax_year): 2x weight
- **Optional fields** (land_value, building_value, property_type, owner_name): 1x weight
- **Score range**: 0.0 to 1.0

### Data Cleaning

Automatic data cleaning includes:
- Currency value parsing (removes $, commas)
- Percentage parsing (removes %)
- Year extraction from strings
- String trimming and validation

## Error Handling and Fallbacks

### Fallback Strategy

1. **Realtor.com** (current source) - Always available
2. **Cook County** (free historical) - If available
3. **Realie** (free trial) - If API key provided
4. **TaxNetUSA** (paid) - If API key provided
5. **Manual scraping** - Last resort

### Rate Limiting

Each data source has configurable rate limits:
- Realtor.com: 1000 requests/minute
- Cook County: 60 requests/minute
- Realie: 100 requests/minute
- TaxNetUSA: 200 requests/minute

## Testing

### Unit Tests

```python
# Test county detection
processor = TaxDataProcessor()
county = processor._detect_county({
    'address': {'state': 'IL', 'county': 'Cook'}
})
assert county == 'cook_il'

# Test data normalization
raw_data = {'pin': '1234567890', 'total_assessed_value': '$425,000'}
normalized = processor.normalize_tax_data(raw_data, county_format)
assert normalized['apn'] == '1234567890'
assert normalized['assessed_value'] == 425000.0
```

### Integration Tests

```python
# Test full integration
service = CountyAssessorService()
property_data = {...}  # Sample property
tax_data = service.get_tax_data(property_data)
assert tax_data is not None
assert tax_data.data_source is not None
```

## Performance Considerations

### Caching

- Tax data is cached to avoid redundant API calls
- Cache TTL: 24 hours for tax data
- Cache keys based on property_id and county

### Batch Processing

- Process multiple properties in batches
- Default batch size: 10 properties
- Configurable batch size based on rate limits

### Rate Limiting

- Intelligent queuing system
- Automatic retry with exponential backoff
- Request throttling per data source

## Monitoring and Logging

### Logging Levels

- **INFO**: Successful data retrieval
- **WARNING**: Fallback to alternative sources
- **ERROR**: Failed data retrieval
- **DEBUG**: Detailed processing information

### Metrics to Monitor

- API response times
- Success/failure rates by source
- Rate limit utilization
- Data quality scores
- Cache hit rates

## Future Enhancements

### Planned Features

1. **Real-time Tax Updates**
   - Webhook integration for tax changes
   - Automated data refresh

2. **Additional Counties**
   - Expand to all major metropolitan areas
   - Automated county detection

3. **Enhanced Data Sources**
   - Integration with more paid services
   - Direct county API partnerships

4. **Machine Learning**
   - Tax prediction models
   - Data quality improvement

### API Improvements

1. **GraphQL Support**
   - Flexible data querying
   - Reduced over-fetching

2. **Webhook Support**
   - Real-time data updates
   - Event-driven architecture

## Troubleshooting

### Common Issues

1. **No Tax Data Available**
   - Check county detection logic
   - Verify API keys for paid services
   - Review rate limiting

2. **Data Quality Issues**
   - Validate field mappings
   - Check data cleaning logic
   - Review confidence scores

3. **Rate Limiting Errors**
   - Adjust rate limits in configuration
   - Implement better queuing
   - Consider caching strategies

### Debug Mode

Enable debug logging:

```python
import logging
logging.getLogger('county_assessor_service').setLevel(logging.DEBUG)
```

## Support and Maintenance

### Regular Maintenance

1. **API Key Rotation**
   - Monthly review of API key status
   - Automated key validation

2. **Data Source Updates**
   - Monitor API changes
   - Update field mappings as needed

3. **Performance Monitoring**
   - Track response times
   - Monitor error rates
   - Optimize caching strategies

### Contact Information

- **Technical Issues**: Check logs and error messages
- **API Key Issues**: Contact service providers
- **Data Quality**: Review confidence scores and validation

## Conclusion

The county assessor integration provides comprehensive property tax data through multiple data sources with intelligent fallback mechanisms. The system is designed to be extensible, allowing easy addition of new counties and data sources as they become available.

The free options provide a solid foundation, while paid services offer enhanced data quality and coverage. The modular architecture ensures easy maintenance and future enhancements.
