"""
Tax Data Processor
Handles different county assessor data formats and normalizes them into a standard structure.
Supports various data sources including free and paid APIs.
"""

import json
import logging
import re
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from dataclasses import dataclass
import requests
from bs4 import BeautifulSoup

from models import CountyTaxData, TaxHistory, Assessment

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CountyFormat:
    """Configuration for different county data formats"""
    name: str
    state: str
    county: str
    data_source: str  # api, scraping, csv, etc.
    base_url: Optional[str] = None
    api_endpoint: Optional[str] = None
    field_mappings: Dict[str, str] = None
    requires_auth: bool = False
    rate_limit: int = 60  # requests per minute

class TaxDataProcessor:
    """Processes tax data from various county assessor sources"""
    
    def __init__(self):
        self.county_formats = self._load_county_formats()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def _load_county_formats(self) -> Dict[str, CountyFormat]:
        """Load configurations for different county formats"""
        formats = {}
        
        # Cook County, Illinois (Free historical data)
        formats['cook_il'] = CountyFormat(
            name="Cook County",
            state="IL",
            county="Cook",
            data_source="api",
            base_url="https://datacatalog.cookcountyil.gov",
            field_mappings={
                'apn': 'pin',
                'assessed_value': 'total_assessed_value',
                'land_value': 'land_assessed_value',
                'building_value': 'building_assessed_value',
                'annual_tax': 'total_tax',
                'tax_year': 'tax_year',
                'property_type': 'property_class',
                'owner_name': 'owner_name'
            }
        )
        
        # Los Angeles County, California (Scraping)
        formats['la_ca'] = CountyFormat(
            name="Los Angeles County",
            state="CA",
            county="Los Angeles",
            data_source="scraping",
            base_url="https://assessor.lacounty.gov",
            field_mappings={
                'apn': 'apn',
                'assessed_value': 'total_value',
                'land_value': 'land_value',
                'building_value': 'improvements_value',
                'annual_tax': 'total_tax',
                'property_type': 'property_type',
                'owner_name': 'owner_name'
            }
        )
        
        # Harris County, Texas (Scraping)
        formats['harris_tx'] = CountyFormat(
            name="Harris County",
            state="TX",
            county="Harris",
            data_source="scraping",
            base_url="https://www.hcad.org",
            field_mappings={
                'apn': 'account_number',
                'assessed_value': 'total_appraised_value',
                'land_value': 'land_value',
                'building_value': 'improvement_value',
                'annual_tax': 'total_tax',
                'property_type': 'property_type',
                'owner_name': 'owner_name'
            }
        )
        
        # Miami-Dade County, Florida (Scraping)
        formats['miami_fl'] = CountyFormat(
            name="Miami-Dade County",
            state="FL",
            county="Miami-Dade",
            data_source="scraping",
            base_url="https://www.miamidade.gov",
            field_mappings={
                'apn': 'folio_number',
                'assessed_value': 'assessed_value',
                'land_value': 'land_value',
                'building_value': 'building_value',
                'annual_tax': 'total_tax',
                'property_type': 'property_use',
                'owner_name': 'owner_name'
            }
        )
        
        return formats
    
    def process_tax_data(self, property_data: Dict[str, Any], county_code: Optional[str] = None) -> Optional[CountyTaxData]:
        """Process tax data for a property based on county"""
        if not county_code:
            county_code = self._detect_county(property_data)
        
        if not county_code or county_code not in self.county_formats:
            logger.warning(f"No county format found for {county_code}")
            return None
        
        county_format = self.county_formats[county_code]
        
        try:
            if county_format.data_source == "api":
                return self._process_api_data(property_data, county_format)
            elif county_format.data_source == "scraping":
                return self._process_scraped_data(property_data, county_format)
            else:
                logger.warning(f"Unsupported data source: {county_format.data_source}")
                return None
        except Exception as e:
            logger.error(f"Failed to process tax data for {county_code}: {str(e)}")
            return None
    
    def _detect_county(self, property_data: Dict[str, Any]) -> Optional[str]:
        """Detect county from property data"""
        address = property_data.get('address', {})
        state = address.get('state', '').upper()
        county = address.get('county', '').lower()
        
        # Map common county names to our format codes
        county_mappings = {
            'cook': 'cook_il',
            'los angeles': 'la_ca',
            'harris': 'harris_tx',
            'miami-dade': 'miami_fl',
            'miami dade': 'miami_fl'
        }
        
        if county in county_mappings:
            return county_mappings[county]
        
        # Try to match by state and common patterns
        if state == 'IL' and 'cook' in county:
            return 'cook_il'
        elif state == 'CA' and 'los angeles' in county:
            return 'la_ca'
        elif state == 'TX' and 'harris' in county:
            return 'harris_tx'
        elif state == 'FL' and ('miami' in county or 'dade' in county):
            return 'miami_fl'
        
        return None
    
    def _process_api_data(self, property_data: Dict[str, Any], county_format: CountyFormat) -> Optional[CountyTaxData]:
        """Process data from API endpoints"""
        # This would implement actual API calls
        # For now, return None as most free APIs require specific implementation
        logger.info(f"API processing not yet implemented for {county_format.name}")
        return None
    
    def _process_scraped_data(self, property_data: Dict[str, Any], county_format: CountyFormat) -> Optional[CountyTaxData]:
        """Process data from web scraping"""
        address = property_data.get('address', {})
        apn = property_data.get('apn') or address.get('apn')
        
        if not apn:
            logger.warning(f"No APN found for property {property_data.get('property_id')}")
            return None
        
        try:
            # This would implement actual web scraping
            # For now, return a placeholder structure
            logger.info(f"Scraping processing not yet implemented for {county_format.name}")
            return None
        except Exception as e:
            logger.error(f"Failed to scrape data from {county_format.name}: {str(e)}")
            return None
    
    def normalize_tax_data(self, raw_data: Dict[str, Any], county_format: CountyFormat) -> CountyTaxData:
        """Normalize raw tax data into standard format"""
        mappings = county_format.field_mappings
        normalized = {}
        
        # Map fields using county-specific mappings
        for standard_field, source_field in mappings.items():
            if source_field in raw_data:
                normalized[standard_field] = raw_data[source_field]
        
        # Clean and validate data
        normalized = self._clean_tax_data(normalized)
        
        # Create CountyTaxData object
        return CountyTaxData(
            apn=normalized.get('apn'),
            parcel_id=normalized.get('parcel_id'),
            property_id=normalized.get('property_id'),
            assessed_value=self._parse_currency(normalized.get('assessed_value')),
            land_value=self._parse_currency(normalized.get('land_value')),
            building_value=self._parse_currency(normalized.get('building_value')),
            improvement_value=self._parse_currency(normalized.get('improvement_value')),
            annual_tax=self._parse_currency(normalized.get('annual_tax')),
            tax_rate=self._parse_percentage(normalized.get('tax_rate')),
            tax_year=self._parse_year(normalized.get('tax_year')),
            tax_status=normalized.get('tax_status'),
            property_type=normalized.get('property_type'),
            land_use=normalized.get('land_use'),
            zoning=normalized.get('zoning'),
            lot_size=self._parse_number(normalized.get('lot_size')),
            year_built=self._parse_year(normalized.get('year_built')),
            owner_name=normalized.get('owner_name'),
            owner_address=normalized.get('owner_address'),
            mailing_address=normalized.get('mailing_address'),
            exemptions=normalized.get('exemptions', []),
            exemption_amount=self._parse_currency(normalized.get('exemption_amount')),
            data_source=county_format.data_source,
            last_updated=datetime.now(),
            confidence_score=self._calculate_confidence_score(normalized),
            raw_data=raw_data
        )
    
    def _clean_tax_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Clean and standardize tax data"""
        cleaned = {}
        
        for key, value in data.items():
            if value is None or value == '':
                continue
                
            # Clean string values
            if isinstance(value, str):
                cleaned_value = value.strip()
                if cleaned_value:
                    cleaned[key] = cleaned_value
            else:
                cleaned[key] = value
        
        return cleaned
    
    def _parse_currency(self, value: Any) -> Optional[float]:
        """Parse currency values from various formats"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Remove currency symbols and commas
            cleaned = re.sub(r'[^\d.-]', '', value)
            try:
                return float(cleaned)
            except ValueError:
                return None
        
        return None
    
    def _parse_percentage(self, value: Any) -> Optional[float]:
        """Parse percentage values"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Remove % symbol
            cleaned = value.replace('%', '').strip()
            try:
                return float(cleaned)
            except ValueError:
                return None
        
        return None
    
    def _parse_number(self, value: Any) -> Optional[float]:
        """Parse numeric values"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Remove commas and other formatting
            cleaned = re.sub(r'[^\d.-]', '', value)
            try:
                return float(cleaned)
            except ValueError:
                return None
        
        return None
    
    def _parse_year(self, value: Any) -> Optional[int]:
        """Parse year values"""
        if value is None:
            return None
        
        if isinstance(value, int):
            return value
        
        if isinstance(value, str):
            # Extract year from string
            year_match = re.search(r'\b(19|20)\d{2}\b', value)
            if year_match:
                return int(year_match.group())
        
        return None
    
    def _calculate_confidence_score(self, data: Dict[str, Any]) -> float:
        """Calculate confidence score based on data completeness"""
        required_fields = ['assessed_value', 'annual_tax', 'tax_year']
        optional_fields = ['land_value', 'building_value', 'property_type', 'owner_name']
        
        score = 0.0
        total_weight = 0.0
        
        # Required fields have higher weight
        for field in required_fields:
            total_weight += 2.0
            if field in data and data[field] is not None:
                score += 2.0
        
        # Optional fields have lower weight
        for field in optional_fields:
            total_weight += 1.0
            if field in data and data[field] is not None:
                score += 1.0
        
        return score / total_weight if total_weight > 0 else 0.0
    
    def convert_to_tax_history(self, county_tax_data: CountyTaxData) -> List[TaxHistory]:
        """Convert CountyTaxData to TaxHistory format for compatibility"""
        if not county_tax_data:
            return []
        
        assessment = Assessment(
            land=county_tax_data.land_value,
            building=county_tax_data.building_value,
            total=county_tax_data.assessed_value
        )
        
        tax_history = TaxHistory(
            assessment=assessment,
            tax=county_tax_data.annual_tax,
            year=county_tax_data.tax_year,
            assessed_year=county_tax_data.tax_year
        )
        
        return [tax_history]

# Example usage
if __name__ == "__main__":
    processor = TaxDataProcessor()
    
    # Example property data
    sample_property = {
        'property_id': '12345',
        'address': {
            'street': '123 Main St',
            'city': 'Chicago',
            'state': 'IL',
            'county': 'Cook',
            'zip_code': '60601'
        },
        'apn': '1234567890'
    }
    
    # Process tax data
    tax_data = processor.process_tax_data(sample_property, 'cook_il')
    if tax_data:
        print("Tax data processed successfully:")
        print(json.dumps(tax_data.__dict__, indent=2, default=str))
    else:
        print("No tax data available")
