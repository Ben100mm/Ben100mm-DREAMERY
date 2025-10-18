"""
Environment Configuration for External Data Services
Handles API keys and configuration for external data enrichment
"""

import os
from typing import Dict, Optional

class EnvironmentConfig:
    """Configuration manager for external API services"""
    
    def __init__(self):
        self.api_keys = self._load_api_keys()
        self.rate_limits = self._load_rate_limits()
        self.cache_config = self._load_cache_config()
        self.api_config = self._load_api_config()
    
    def _load_api_keys(self) -> Dict[str, Optional[str]]:
        """Load API keys from environment variables"""
        return {
            'walkscore': os.getenv('WALKSCORE_API_KEY'),
            'google_places': os.getenv('GOOGLE_PLACES_API_KEY'),
            'census': os.getenv('CENSUS_API_KEY'),
            'transit': os.getenv('TRANSIT_API_KEY'),
            'schools': os.getenv('SCHOOL_API_KEY'),
            'mapbox': os.getenv('REACT_APP_MAPBOX_TOKEN'),
            'bls': os.getenv('BLS_API_KEY'),
            'data_gov': os.getenv('DATA_GOV_API_KEY'),
            'rentcast': os.getenv('RENTCAST_API_KEY'),
            'freewebapi': os.getenv('FREEWEBAPI_API_KEY'),
            'attom': os.getenv('ATTOM_API_KEY'),
            'fred': os.getenv('FRED_API_KEY'),
            'airtable': os.getenv('AIRTABLE_API_KEY')
        }
    
    def _load_rate_limits(self) -> Dict[str, int]:
        """Load rate limit configurations"""
        return {
            'walkscore': int(os.getenv('WALKSCORE_RATE_LIMIT', '1000')),
            'google_places': int(os.getenv('GOOGLE_PLACES_RATE_LIMIT', '1000')),
            'census': int(os.getenv('CENSUS_RATE_LIMIT', '500')),
            'transit': int(os.getenv('TRANSIT_RATE_LIMIT', '100')),
            'schools': int(os.getenv('SCHOOL_RATE_LIMIT', '100')),
            'bls': int(os.getenv('BLS_RATE_LIMIT', '500')),
            'data_gov': int(os.getenv('DATA_GOV_RATE_LIMIT', '1000')),
            'rentcast': int(os.getenv('RENTCAST_RATE_LIMIT', '50')),
            'freewebapi': int(os.getenv('FREEWEBAPI_RATE_LIMIT', '100')),
            'attom': int(os.getenv('ATTOM_RATE_LIMIT', '1000')),
            'fred': int(os.getenv('FRED_RATE_LIMIT', '1200')),
            'airtable': int(os.getenv('AIRTABLE_RATE_LIMIT', '5'))
        }
    
    def _load_cache_config(self) -> Dict[str, any]:
        """Load cache configuration"""
        return {
            'enabled': os.getenv('CACHE_ENABLED', 'true').lower() == 'true',
            'duration_hours': int(os.getenv('CACHE_DURATION_HOURS', '24'))
        }
    
    def _load_api_config(self) -> Dict[str, any]:
        """Load API server configuration"""
        return {
            'port': int(os.getenv('ENHANCED_API_PORT', '8002')),
            'host': os.getenv('ENHANCED_API_HOST', '0.0.0.0'),
            'debug': os.getenv('ENHANCED_API_DEBUG', 'false').lower() == 'true'
        }
    
    def get_api_key(self, service: str) -> Optional[str]:
        """Get API key for a specific service"""
        return self.api_keys.get(service)
    
    def get_rate_limit(self, service: str) -> int:
        """Get rate limit for a specific service"""
        return self.rate_limits.get(service, 100)
    
    def is_service_configured(self, service: str) -> bool:
        """Check if a service is properly configured"""
        return bool(self.api_keys.get(service))
    
    def get_configured_services(self) -> list:
        """Get list of configured services"""
        return [service for service, key in self.api_keys.items() if key]
    
    def validate_configuration(self) -> Dict[str, any]:
        """Validate the current configuration"""
        validation = {
            'valid': True,
            'services': {},
            'warnings': [],
            'errors': []
        }
        
        for service, key in self.api_keys.items():
            if key:
                validation['services'][service] = 'configured'
            else:
                validation['services'][service] = 'not_configured'
                if service in ['walkscore', 'google_places']:
                    validation['warnings'].append(f"{service} API key not configured")
        
        if not any(self.api_keys.values()):
            validation['valid'] = False
            validation['errors'].append("No API keys configured")
        
        return validation

# Global configuration instance
config = EnvironmentConfig()

# Example environment setup instructions
ENVIRONMENT_SETUP_INSTRUCTIONS = """
# External API Configuration Setup

## Required API Keys

### 1. Walk Score API
- Sign up at: https://www.walkscore.com/professional/api-sign-up.php
- Set environment variable: WALKSCORE_API_KEY=your_key_here

### 2. Google Places API
- Go to: https://console.cloud.google.com/apis/credentials
- Enable Places API
- Set environment variable: GOOGLE_PLACES_API_KEY=your_key_here

### 3. US Census API (Optional)
- Sign up at: https://api.census.gov/data/key_signup.html
- Set environment variable: CENSUS_API_KEY=your_key_here

### 4. Mapbox Token (for frontend)
- Sign up at: https://account.mapbox.com/
- Set environment variable: REACT_APP_MAPBOX_TOKEN=your_token_here

## Environment Variables

Create a .env file in the server directory with:

```
WALKSCORE_API_KEY=your_walkscore_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
CENSUS_API_KEY=your_census_api_key_here
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here

# Optional rate limiting
WALKSCORE_RATE_LIMIT=1000
GOOGLE_PLACES_RATE_LIMIT=1000
CENSUS_RATE_LIMIT=500

# Cache settings
CACHE_ENABLED=true
CACHE_DURATION_HOURS=24
```

## Usage

```python
from environment_config import config

# Check if service is configured
if config.is_service_configured('walkscore'):
    print("Walk Score API is configured")

# Get API key
api_key = config.get_api_key('google_places')

# Validate configuration
validation = config.validate_configuration()
print(f"Configuration valid: {validation['valid']}")
```
"""
