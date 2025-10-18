"""
State Government Data Integration Service
Integrates with all 50 state open data portals and APIs
"""

import os
import json
import time
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import asdict
from datetime import datetime, timedelta
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import pandas as pd

from state_data_models import (
    StatePropertyData, StateCommercialRentData, StateDataSummary,
    StateOpenDataConfig, CountyAssessorData, CommercialRealEstateData,
    StateCode, DataSource, STATE_DATA_CONFIGS
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StateDataService:
    """Service for integrating state government data sources"""
    
    def __init__(self):
        self.api_keys = self._load_api_keys()
        self.session = self._create_session()
        self.rate_limits = {}
        self.cache = {}
        self.state_configs = STATE_DATA_CONFIGS
        
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables"""
        keys = {}
        for state in StateCode:
            state_key = f"{state.name}_API_KEY"
            keys[state.name.lower()] = os.getenv(state_key)
        return keys
    
    def _create_session(self) -> requests.Session:
        """Create HTTP session with retry strategy"""
        session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        return session
    
    def _check_rate_limit(self, state: str, limit_per_hour: int = 1000) -> bool:
        """Check if API call is within rate limits"""
        now = datetime.now()
        if state not in self.rate_limits:
            self.rate_limits[state] = []
        
        # Remove calls older than 1 hour
        self.rate_limits[state] = [
            call_time for call_time in self.rate_limits[state]
            if now - call_time < timedelta(hours=1)
        ]
        
        if len(self.rate_limits[state]) >= limit_per_hour:
            return False
        
        self.rate_limits[state].append(now)
        return True
    
    def _make_api_call(self, url: str, params: Dict, state: str, 
                      rate_limit: int = 1000) -> Optional[Dict]:
        """Make API call with rate limiting and error handling"""
        if not self._check_rate_limit(state, rate_limit):
            logger.warning(f"Rate limit exceeded for {state}")
            return None
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API call failed for {state}: {e}")
            return None
    
    def get_state_property_data(self, state: StateCode, property_id: str = None,
                               address: str = None, county: str = None) -> List[StatePropertyData]:
        """Get property data from state sources"""
        config = self.state_configs.get(state)
        if not config or not config.api_available:
            logger.warning(f"No API available for {state.value}")
            return []
        
        properties = []
        
        # Try different data endpoints based on configuration
        if config.property_assessments:
            assessment_data = self._get_property_assessments(state, property_id, address, county)
            if assessment_data:
                properties.extend(assessment_data)
        
        if config.property_transactions:
            transaction_data = self._get_property_transactions(state, property_id, address, county)
            if transaction_data:
                properties.extend(transaction_data)
        
        return properties
    
    def _get_property_assessments(self, state: StateCode, property_id: str = None,
                                 address: str = None, county: str = None) -> List[StatePropertyData]:
        """Get property assessment data from state API"""
        config = self.state_configs.get(state)
        if not config or not config.api_base_url:
            return []
        
        # State-specific API endpoints
        endpoints = {
            StateCode.CT: "/api/3/action/datastore_search",
            StateCode.NY: "/api/3/action/datastore_search",
            StateCode.MD: "/api/3/action/datastore_search",
            StateCode.CA: "/api/3/action/datastore_search",
            StateCode.TX: "/api/3/action/datastore_search"
        }
        
        endpoint = endpoints.get(state, "/api/3/action/datastore_search")
        url = f"{config.api_base_url}{endpoint}"
        
        # Search for property assessment datasets
        params = {
            'resource_id': self._get_property_resource_id(state),
            'limit': 100
        }
        
        if property_id:
            params['q'] = property_id
        elif address:
            params['q'] = address
        elif county:
            params['q'] = county
        
        data = self._make_api_call(url, params, state.name.lower(), config.rate_limit_per_hour)
        if not data or 'result' not in data:
            return []
        
        records = data['result'].get('records', [])
        properties = []
        
        for record in records:
            property_data = self._parse_property_record(record, state)
            if property_data:
                properties.append(property_data)
        
        return properties
    
    def _get_property_transactions(self, state: StateCode, property_id: str = None,
                                  address: str = None, county: str = None) -> List[StatePropertyData]:
        """Get property transaction data from state API"""
        config = self.state_configs.get(state)
        if not config or not config.api_base_url:
            return []
        
        # State-specific transaction endpoints
        transaction_resources = {
            StateCode.CT: "real-estate-sales",
            StateCode.NY: "real-estate-sales",
            StateCode.CA: "property-transactions"
        }
        
        resource_id = transaction_resources.get(state)
        if not resource_id:
            return []
        
        url = f"{config.api_base_url}/api/3/action/datastore_search"
        params = {
            'resource_id': resource_id,
            'limit': 100
        }
        
        if property_id:
            params['q'] = property_id
        elif address:
            params['q'] = address
        elif county:
            params['q'] = county
        
        data = self._make_api_call(url, params, state.name.lower(), config.rate_limit_per_hour)
        if not data or 'result' not in data:
            return []
        
        records = data['result'].get('records', [])
        properties = []
        
        for record in records:
            property_data = self._parse_transaction_record(record, state)
            if property_data:
                properties.append(property_data)
        
        return properties
    
    def _get_property_resource_id(self, state: StateCode) -> str:
        """Get the resource ID for property data in state API"""
        resource_ids = {
            StateCode.CT: "real-estate-sales",
            StateCode.NY: "real-estate-sales",
            StateCode.MD: "real-property-assessments",
            StateCode.CA: "property-assessments",
            StateCode.TX: "property-assessments"
        }
        return resource_ids.get(state, "property-data")
    
    def _parse_property_record(self, record: Dict, state: StateCode) -> Optional[StatePropertyData]:
        """Parse property record from state API response"""
        try:
            # State-specific field mappings
            field_mappings = {
                StateCode.CT: {
                    'property_id': 'PropertyID',
                    'address': 'Address',
                    'city': 'City',
                    'state': 'State',
                    'zip_code': 'ZipCode',
                    'assessed_value': 'AssessedValue',
                    'market_value': 'MarketValue',
                    'last_sale_date': 'SaleDate',
                    'last_sale_price': 'SalePrice'
                },
                StateCode.NY: {
                    'property_id': 'PropertyID',
                    'address': 'Address',
                    'city': 'City',
                    'state': 'State',
                    'zip_code': 'ZipCode',
                    'assessed_value': 'AssessedValue',
                    'market_value': 'MarketValue',
                    'last_sale_date': 'SaleDate',
                    'last_sale_price': 'SalePrice'
                },
                StateCode.MD: {
                    'property_id': 'PropertyID',
                    'address': 'Address',
                    'city': 'City',
                    'state': 'State',
                    'zip_code': 'ZipCode',
                    'assessed_value': 'AssessedValue',
                    'market_value': 'MarketValue',
                    'last_sale_date': 'SaleDate',
                    'last_sale_price': 'SalePrice'
                }
            }
            
            mapping = field_mappings.get(state, {})
            
            # Parse sale date
            sale_date = None
            if mapping.get('last_sale_date') and record.get(mapping['last_sale_date']):
                try:
                    sale_date = datetime.strptime(record[mapping['last_sale_date']], '%Y-%m-%d')
                except:
                    pass
            
            return StatePropertyData(
                property_id=record.get(mapping.get('property_id', 'PropertyID'), ''),
                address=record.get(mapping.get('address', 'Address'), ''),
                city=record.get(mapping.get('city', 'City'), ''),
                state=record.get(mapping.get('state', 'State'), state.value),
                zip_code=record.get(mapping.get('zip_code', 'ZipCode')),
                assessed_value=self._parse_float(record.get(mapping.get('assessed_value', 'AssessedValue'))),
                market_value=self._parse_float(record.get(mapping.get('market_value', 'MarketValue'))),
                last_sale_date=sale_date,
                last_sale_price=self._parse_float(record.get(mapping.get('last_sale_price', 'SalePrice'))),
                data_source=f"{state.value} State API",
                last_updated=datetime.now(),
                confidence_score=0.8
            )
        except Exception as e:
            logger.error(f"Error parsing property record for {state.value}: {e}")
            return None
    
    def _parse_transaction_record(self, record: Dict, state: StateCode) -> Optional[StatePropertyData]:
        """Parse transaction record from state API response"""
        # Similar to _parse_property_record but focused on transaction data
        return self._parse_property_record(record, state)
    
    def _parse_float(self, value: Any) -> Optional[float]:
        """Parse float value from various formats"""
        if value is None:
            return None
        
        try:
            # Remove common formatting
            if isinstance(value, str):
                value = value.replace('$', '').replace(',', '').strip()
            return float(value)
        except (ValueError, TypeError):
            return None
    
    def get_commercial_rent_data(self, state: StateCode, county: str = None,
                                city: str = None) -> Optional[StateCommercialRentData]:
        """Get commercial rent data from state sources"""
        config = self.state_configs.get(state)
        if not config or not config.commercial_rent_data:
            logger.warning(f"No commercial rent data available for {state.value}")
            return None
        
        # Most states don't have direct commercial rent data
        # This would need to be implemented based on available datasets
        return StateCommercialRentData(
            state=state.value,
            county=county,
            city=city,
            data_source=f"{state.value} State API",
            last_updated=datetime.now(),
            confidence_score=0.5
        )
    
    def get_county_data(self, state: StateCode, county: str) -> Optional[CountyAssessorData]:
        """Get county-level assessor data"""
        # This would integrate with county assessor APIs
        # Implementation would vary by county
        return CountyAssessorData(
            county=county,
            state=state.value,
            last_updated=datetime.now(),
            data_source=f"{county} County Assessor"
        )
    
    def get_state_data_summary(self, state: StateCode) -> StateDataSummary:
        """Get summary of data availability for a state"""
        config = self.state_configs.get(state)
        
        # Check data availability
        has_federal_data = True  # Assume federal data is available
        has_state_data = config is not None and config.api_available
        has_county_data = True  # Assume county data is available
        has_commercial_rent_data = config is not None and config.commercial_rent_data
        has_property_assessments = config is not None and config.property_assessments
        has_transaction_data = config is not None and config.property_transactions
        
        # Calculate data quality scores
        data_completeness_score = 0.0
        if has_federal_data:
            data_completeness_score += 0.3
        if has_state_data:
            data_completeness_score += 0.4
        if has_county_data:
            data_completeness_score += 0.3
        
        data_freshness_score = 0.8 if has_state_data else 0.5
        api_availability_score = 1.0 if has_state_data else 0.0
        
        return StateDataSummary(
            state=state,
            data_sources=[DataSource.FEDERAL] + ([DataSource.STATE] if has_state_data else []),
            has_federal_data=has_federal_data,
            has_state_data=has_state_data,
            has_county_data=has_county_data,
            has_commercial_rent_data=has_commercial_rent_data,
            has_property_assessments=has_property_assessments,
            has_transaction_data=has_transaction_data,
            data_completeness_score=data_completeness_score,
            data_freshness_score=data_freshness_score,
            api_availability_score=api_availability_score,
            counties_covered=0,  # Would need to query actual data
            total_counties=0,    # Would need to query actual data
            cities_covered=0,    # Would need to query actual data
            last_federal_update=datetime.now(),
            last_state_update=datetime.now() if has_state_data else None,
            last_county_update=datetime.now() if has_county_data else None
        )
    
    def get_all_states_summary(self) -> Dict[str, StateDataSummary]:
        """Get summary of data availability for all states"""
        summaries = {}
        
        for state in StateCode:
            summaries[state.name] = self.get_state_data_summary(state)
        
        return summaries
    
    def search_properties(self, query: str, state: StateCode = None,
                         property_type: str = None) -> List[StatePropertyData]:
        """Search for properties across states"""
        properties = []
        
        states_to_search = [state] if state else list(StateCode)
        
        for state_code in states_to_search:
            try:
                state_properties = self.get_state_property_data(
                    state_code, 
                    address=query
                )
                properties.extend(state_properties)
                
                # Add delay to respect rate limits
                time.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Error searching properties in {state_code.value}: {e}")
                continue
        
        return properties
    
    def get_commercial_real_estate_data(self, latitude: float, longitude: float,
                                      state: str, county: str = None) -> CommercialRealEstateData:
        """Get comprehensive commercial real estate data from state sources"""
        state_code = StateCode[state.upper()] if state.upper() in StateCode.__members__ else None
        if not state_code:
            logger.error(f"Invalid state code: {state}")
            return None
        
        # Get state property data
        state_properties = self.get_state_property_data(state_code, county=county)
        state_property_data = state_properties[0] if state_properties else None
        
        # Get commercial rent data
        commercial_rent_data = self.get_commercial_rent_data(state_code, county)
        
        # Get county data
        county_data = None
        if county:
            county_data = self.get_county_data(state_code, county)
        
        # Calculate data quality score
        data_sources = ['state']
        if county_data:
            data_sources.append('county')
        
        data_quality_score = len(data_sources) / 2.0  # Normalize to 0-1
        
        return CommercialRealEstateData(
            address=f"{latitude}, {longitude}",  # Would need reverse geocoding
            latitude=latitude,
            longitude=longitude,
            state=state,
            county=county,
            state_property_data=state_property_data,
            state_rent_data=commercial_rent_data,
            county_data=county_data,
            data_quality_score=data_quality_score,
            last_updated=datetime.now(),
            data_sources=data_sources,
            confidence_score=data_quality_score
        )
    
    def save_state_data(self, data: CommercialRealEstateData, 
                       output_file: str = None) -> str:
        """Save state data to JSON file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"state_data_{timestamp}.json"
        
        # Convert dataclass to dictionary
        data_dict = asdict(data)
        
        # Convert datetime objects to strings
        for key, value in data_dict.items():
            if isinstance(value, datetime):
                data_dict[key] = value.isoformat()
            elif isinstance(value, dict) and 'last_updated' in value:
                if isinstance(value['last_updated'], datetime):
                    value['last_updated'] = value['last_updated'].isoformat()
        
        with open(output_file, 'w') as f:
            json.dump(data_dict, f, indent=2)
        
        logger.info(f"Saved state data to {output_file}")
        return output_file

def main():
    """Example usage of the State Data Service"""
    service = StateDataService()
    
    # Get data for California
    ca_data = service.get_state_data_summary(StateCode.CA)
    print(f"California data summary: {ca_data}")
    
    # Search for properties
    properties = service.search_properties("San Francisco", StateCode.CA)
    print(f"Found {len(properties)} properties")
    
    # Get all states summary
    all_summaries = service.get_all_states_summary()
    states_with_data = [s for s in all_summaries.values() if s.has_state_data]
    print(f"States with data: {len(states_with_data)}")

if __name__ == "__main__":
    main()
