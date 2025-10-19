import pytest
import sys
import os

# Add the server directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Test configuration
@pytest.fixture(scope="session")
def test_config():
    """Test configuration fixture"""
    return {
        "test_timeout": 30,
        "max_retries": 3,
        "test_locations": [
            "Dallas, TX",
            "Phoenix, AZ", 
            "San Francisco, CA",
            "Atlanta, GA"
        ],
        "test_zip_codes": [
            "75201",  # Dallas
            "85281",  # Arizona
            "94105",  # San Francisco
            "00741"   # Puerto Rico
        ]
    }

@pytest.fixture
def sample_property_data():
    """Sample property data for testing"""
    return {
        "property_id": "test_123456",
        "listing_id": "listing_123456",
        "status": "for_sale",
        "list_price": 500000,
        "address": {
            "full_line": "123 Test St",
            "city": "Test City",
            "state": "TX",
            "zip": "12345"
        },
        "description": {
            "beds": 3,
            "baths_full": 2,
            "sqft": 2000,
            "year_built": 2020
        }
    }

# Skip slow tests unless explicitly requested
def pytest_configure(config):
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )

# Custom markers for different test types
pytest_plugins = []
