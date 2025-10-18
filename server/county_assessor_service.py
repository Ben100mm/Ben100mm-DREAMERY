"""
County Assessor API Integration Service
Integrates with various county assessor APIs and data sources to enrich property tax data.
Supports both free and paid data sources with fallback mechanisms.
"""

import os
import json
import time
import logging
import requests
from typing import Dict, List, Optional, Any, Tuple, Union
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum
import pandas as pd
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CountyAssessorSource(Enum):
    """Available county assessor data sources"""
    REALTOR_COM = "realtor_com"  # Current source
    COOK_COUNTY = "cook_county"  # Free historical data
    REALIE = "realie"  # Free trial + paid
    TAXNETUSA = "taxnetusa"  # Paid service
    MANUAL_SCRAPING = "manual_scraping"  # Web scraping fallback

@dataclass
class CountyTaxData:
    """Enhanced county tax data structure"""
    # Basic identifiers
    apn: Optional[str] = None  # Assessor's Parcel Number
    parcel_id: Optional[str] = None
    property_id: Optional[str] = None
    
    # Assessment data
    assessed_value: Optional[float] = None
    land_value: Optional[float] = None
    building_value: Optional[float] = None
    improvement_value: Optional[float] = None
    
    # Tax information
    annual_tax: Optional[float] = None
    tax_rate: Optional[float] = None
    tax_year: Optional[int] = None
    tax_status: Optional[str] = None  # current, delinquent, exempt
    
    # Property details
    property_type: Optional[str] = None
    land_use: Optional[str] = None
    zoning: Optional[str] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    
    # Ownership
    owner_name: Optional[str] = None
    owner_address: Optional[str] = None
    mailing_address: Optional[str] = None
    
    # Exemptions
    exemptions: List[str] = None
    exemption_amount: Optional[float] = None
    
    # Data source and metadata
    data_source: Optional[str] = None
    last_updated: Optional[datetime] = None
    confidence_score: Optional[float] = None
    raw_data: Optional[Dict[str, Any]] = None

@dataclass
class CountyAssessorConfig:
    """Configuration for county assessor data sources"""
    source: CountyAssessorSource
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    rate_limit: int = 100  # requests per minute
    timeout: int = 30
    retry_attempts: int = 3
    enabled: bool = True

class CountyAssessorService:
    """Main service for county assessor data integration"""
    
    def __init__(self):
        self.configs = self._load_configurations()
        self.session = self._create_session()
        self.rate_limiter = {}
        
    def _load_configurations(self) -> Dict[CountyAssessorSource, CountyAssessorConfig]:
        """Load configurations for different data sources"""
        configs = {}
        
        # Realtor.com (current source)
        configs[CountyAssessorSource.REALTOR_COM] = CountyAssessorConfig(
            source=CountyAssessorSource.REALTOR_COM,
            rate_limit=1000,
            enabled=True
        )
        
        # Cook County (free historical data)
        configs[CountyAssessorSource.COOK_COUNTY] = CountyAssessorConfig(
            source=CountyAssessorSource.COOK_COUNTY,
            base_url="https://datacatalog.cookcountyil.gov",
            rate_limit=60,
            enabled=True
        )
        
        # Realie (free trial + paid)
        realie_key = os.getenv('REALIE_API_KEY')
        configs[CountyAssessorSource.REALIE] = CountyAssessorConfig(
            source=CountyAssessorSource.REALIE,
            api_key=realie_key,
            base_url="https://api.realie.ai",
            rate_limit=100,
            enabled=bool(realie_key)
        )
        
        # TaxNetUSA (paid service)
        taxnet_key = os.getenv('TAXNETUSA_API_KEY')
        configs[CountyAssessorSource.TAXNETUSA] = CountyAssessorConfig(
            source=CountyAssessorSource.TAXNETUSA,
            api_key=taxnet_key,
            base_url="https://api.taxnetusa.com",
            rate_limit=200,
            enabled=bool(taxnet_key)
        )
        
        return configs
    
    def _create_session(self) -> requests.Session:
        """Create configured requests session"""
        session = requests.Session()
        
        # Configure retry strategy
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        
        return session
    
    def _rate_limit_check(self, source: CountyAssessorSource) -> bool:
        """Check if we can make a request based on rate limits"""
        config = self.configs.get(source)
        if not config or not config.enabled:
            return False
            
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        if source not in self.rate_limiter:
            self.rate_limiter[source] = []
        
        # Remove old requests
        self.rate_limiter[source] = [
            req_time for req_time in self.rate_limiter[source] 
            if req_time > minute_ago
        ]
        
        # Check if we can make another request
        if len(self.rate_limiter[source]) >= config.rate_limit:
            return False
            
        self.rate_limiter[source].append(now)
        return True
    
    def get_tax_data(self, property_data: Dict[str, Any]) -> Optional[CountyTaxData]:
        """Get tax data for a property from available sources"""
        property_id = property_data.get('property_id', '')
        address = property_data.get('address', {})
        coordinates = property_data.get('coordinates', {})
        
        # Try sources in order of preference (free first)
        sources_to_try = [
            CountyAssessorSource.REALTOR_COM,  # Current source
            CountyAssessorSource.COOK_COUNTY,  # Free historical
            CountyAssessorSource.REALIE,  # Free trial
            CountyAssessorSource.TAXNETUSA,  # Paid service
        ]
        
        for source in sources_to_try:
            if not self._rate_limit_check(source):
                continue
                
            try:
                tax_data = self._get_tax_data_from_source(source, property_data)
                if tax_data:
                    logger.info(f"Successfully retrieved tax data from {source.value} for property {property_id}")
                    return tax_data
            except Exception as e:
                logger.warning(f"Failed to get tax data from {source.value}: {str(e)}")
                continue
        
        logger.warning(f"No tax data available for property {property_id}")
        return None
    
    def _get_tax_data_from_source(self, source: CountyAssessorSource, property_data: Dict[str, Any]) -> Optional[CountyTaxData]:
        """Get tax data from specific source"""
        if source == CountyAssessorSource.REALTOR_COM:
            return self._get_realtor_tax_data(property_data)
        elif source == CountyAssessorSource.COOK_COUNTY:
            return self._get_cook_county_tax_data(property_data)
        elif source == CountyAssessorSource.REALIE:
            return self._get_realie_tax_data(property_data)
        elif source == CountyAssessorSource.TAXNETUSA:
            return self._get_taxnetusa_tax_data(property_data)
        
        return None
    
    def _get_realtor_tax_data(self, property_data: Dict[str, Any]) -> Optional[CountyTaxData]:
        """Extract tax data from existing Realtor.com data"""
        tax_history = property_data.get('tax_history', [])
        if not tax_history:
            return None
            
        # Get latest tax data
        latest_tax = max(tax_history, key=lambda x: x.get('year', 0))
        
        return CountyTaxData(
            property_id=property_data.get('property_id'),
            assessed_value=latest_tax.get('assessment', {}).get('total'),
            land_value=latest_tax.get('assessment', {}).get('land'),
            building_value=latest_tax.get('assessment', {}).get('building'),
            annual_tax=latest_tax.get('tax'),
            tax_year=latest_tax.get('year'),
            data_source=CountyAssessorSource.REALTOR_COM.value,
            last_updated=datetime.now(),
            confidence_score=0.9,  # High confidence for Realtor.com data
            raw_data=latest_tax
        )
    
    def _get_cook_county_tax_data(self, property_data: Dict[str, Any]) -> Optional[CountyTaxData]:
        """Get historical tax data from Cook County (free)"""
        # Cook County provides historical data via PTAXSIM
        # This would require implementing the R package or finding alternative access
        # For now, return None as this requires additional implementation
        logger.info("Cook County data access requires PTAXSIM implementation")
        return None
    
    def _get_realie_tax_data(self, property_data: Dict[str, Any]) -> Optional[CountyTaxData]:
        """Get tax data from Realie API"""
        config = self.configs[CountyAssessorSource.REALIE]
        if not config.api_key:
            return None
            
        # Implement Realie API call
        # This would require their specific API documentation
        logger.info("Realie API integration requires API key and documentation")
        return None
    
    def _get_taxnetusa_tax_data(self, property_data: Dict[str, Any]) -> Optional[CountyTaxData]:
        """Get tax data from TaxNetUSA API"""
        config = self.configs[CountyAssessorSource.TAXNETUSA]
        if not config.api_key:
            return None
            
        # Implement TaxNetUSA API call
        # This would require their specific API documentation
        logger.info("TaxNetUSA API integration requires API key and documentation")
        return None
    
    def enrich_property_with_tax_data(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich property data with county tax information"""
        tax_data = self.get_tax_data(property_data)
        
        if not tax_data:
            return property_data
        
        # Add tax data to property
        enriched_data = property_data.copy()
        enriched_data['county_tax_data'] = asdict(tax_data)
        
        # Update existing tax fields if they're missing or less complete
        if not enriched_data.get('assessed_value') and tax_data.assessed_value:
            enriched_data['assessed_value'] = tax_data.assessed_value
            
        if not enriched_data.get('tax') and tax_data.annual_tax:
            enriched_data['tax'] = tax_data.annual_tax
        
        return enriched_data
    
    def batch_enrich_properties(self, properties: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enrich multiple properties with tax data"""
        enriched_properties = []
        
        for property_data in properties:
            try:
                enriched = self.enrich_property_with_tax_data(property_data)
                enriched_properties.append(enriched)
            except Exception as e:
                logger.error(f"Failed to enrich property {property_data.get('property_id', 'unknown')}: {str(e)}")
                enriched_properties.append(property_data)  # Return original on error
        
        return enriched_properties

# Example usage and testing
if __name__ == "__main__":
    service = CountyAssessorService()
    
    # Example property data
    sample_property = {
        'property_id': '12345',
        'address': {
            'street': '123 Main St',
            'city': 'Chicago',
            'state': 'IL',
            'zip_code': '60601'
        },
        'coordinates': {
            'lat': 41.8781,
            'lng': -87.6298
        },
        'tax_history': [
            {
                'year': 2023,
                'tax': 8500,
                'assessment': {
                    'total': 425000,
                    'land': 85000,
                    'building': 340000
                }
            }
        ]
    }
    
    # Test enrichment
    enriched = service.enrich_property_with_tax_data(sample_property)
    print(json.dumps(enriched, indent=2, default=str))
