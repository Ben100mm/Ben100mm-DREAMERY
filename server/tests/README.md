# Dreamery Property Scraper Tests

This directory contains comprehensive tests for the Dreamery property scraping functionality.

## Test Structure

### Test Files

- **`test_property_scraper.py`** - Main test suite with comprehensive property scraping tests
- **`test_models.py`** - Tests for data models and validation
- **`test_integration.py`** - Integration tests for end-to-end workflows
- **`conftest.py`** - Test configuration and fixtures
- **`__init__.py`** - Package initialization

### Configuration Files

- **`pytest.ini`** - Pytest configuration
- **`README.md`** - This documentation file

## Running Tests

### Quick Start

```bash
# Run all tests
cd server
python run_tests.py

# Run with verbose output
python run_tests.py --verbose

# Run with coverage
python run_tests.py --coverage
```

### Test Categories

```bash
# Run only fast tests (skip slow integration tests)
python run_tests.py --type fast

# Run only model tests
python run_tests.py --type models

# Run only scraper tests
python run_tests.py --type scraper

# Run only integration tests
python run_tests.py --type integration
```

### Direct Pytest

```bash
# Run all tests
pytest tests/

# Run specific test file
pytest tests/test_property_scraper.py

# Run with markers
pytest -m "not slow"
pytest -m "integration"
pytest -m "property_search"
```

## Test Categories

### Unit Tests
- Model validation
- Basic functionality
- Error handling
- Data formatting

### Integration Tests
- End-to-end property searches
- API connectivity
- Data consistency
- Multiple search types

### Property Search Tests
- Different listing types (for_sale, for_rent, sold, pending)
- Location variations (cities, zip codes, addresses)
- Search parameters (radius, date ranges, property types)
- Return type consistency (pandas, pydantic, raw)
- Data quality validation

## Test Functions

### Core Property Search Tests

- `test_dreamery_pending_or_contingent()` - Tests pending vs regular property searches
- `test_dreamery_pending_comps()` - Tests pending comparable properties
- `test_dreamery_sold_past()` - Tests sold properties in past days
- `test_dreamery_comps()` - Tests comparable property searches
- `test_dreamery_last_x_days_sold()` - Tests date range filtering
- `test_dreamery_date_range_sold()` - Tests specific date range searches
- `test_dreamery_single_property()` - Tests single property by address
- `test_dreamery_basic_searches()` - Tests basic search functionality
- `test_dreamery_city()` - Tests city-based searches
- `test_dreamery_land()` - Tests land property type searches

### Data Quality Tests

- `test_dreamery_agent()` - Tests agent information extraction
- `test_dreamery_apartment_list_price()` - Tests apartment pricing data
- `test_dreamery_phone_number_matching()` - Tests agent contact consistency
- `test_dreamery_return_type()` - Tests different return formats
- `test_dreamery_has_open_house()` - Tests open house data availability

### Edge Case Tests

- `test_dreamery_bad_address()` - Tests invalid address handling
- `test_dreamery_foreclosed()` - Tests foreclosure filtering
- `test_dreamery_exclude_pending()` - Tests pending property exclusion
- `test_dreamery_limit()` - Tests result limiting
- `test_dreamery_style_value_error()` - Tests error handling
- `test_dreamery_primary_image_error()` - Tests image error handling

### Advanced Tests

- `test_dreamery_return_type_consistency()` - Tests return type consistency
- `test_dreamery_pending_date_filtering()` - Tests pending date filtering
- `test_dreamery_scraper_initialization()` - Tests scraper setup
- `test_dreamery_location_handling()` - Tests location processing
- `test_dreamery_search_type_determination()` - Tests search logic

## Test Data

### Sample Locations
- Dallas, TX
- Phoenix, AZ
- San Francisco, CA
- Atlanta, GA
- Surprise, AZ
- Detroit, MI

### Sample Addresses
- "2530 Al Lipscomb Way"
- "15509 N 172nd Dr, Surprise, AZ 85388" 
- "1 Hawthorne St Unit 12F, San Francisco, CA 94105"

### Sample ZIP Codes
- 75201 (Dallas)
- 85281 (Arizona)
- 94105 (San Francisco)
- 00741 (Puerto Rico)

## Test Markers

- `@pytest.mark.slow` - Marks slow-running tests
- `@pytest.mark.integration` - Marks integration tests
- `@pytest.mark.unit` - Marks unit tests
- `@pytest.mark.property_search` - Marks property search tests
- `@pytest.mark.data_validation` - Marks data validation tests

## Requirements

- pytest >= 7.4.0
- pandas >= 1.5.0
- requests >= 2.31.0
- pydantic >= 2.5.0

## Notes

- Tests may take longer to run due to real API calls
- Some tests may fail if external APIs are unavailable
- Integration tests are marked as slow and can be skipped
- Test data reflects real property market conditions and may vary
