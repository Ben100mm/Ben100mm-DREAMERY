"""
Federal Government Data Integration Service
Integrates with US Census Bureau, BLS, and Data.gov APIs
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
    FederalCensusData, FederalBLSData, CommercialRealEstateData,
    StateCode, DataSource, FEDERAL_DATA_CONFIGS
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FederalDataService:
    """Service for integrating federal government data sources"""
    
    def __init__(self):
        self.api_keys = self._load_api_keys()
        self.session = self._create_session()
        self.rate_limits = {}
        self.cache = {}
        
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables"""
        return {
            'census': os.getenv('CENSUS_API_KEY'),
            'bls': os.getenv('BLS_API_KEY'),
            'data_gov': os.getenv('DATA_GOV_API_KEY')  # Optional
        }
    
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
    
    def _check_rate_limit(self, api_name: str, limit_per_hour: int = 500) -> bool:
        """Check if API call is within rate limits"""
        now = datetime.now()
        if api_name not in self.rate_limits:
            self.rate_limits[api_name] = []
        
        # Remove calls older than 1 hour
        self.rate_limits[api_name] = [
            call_time for call_time in self.rate_limits[api_name]
            if now - call_time < timedelta(hours=1)
        ]
        
        if len(self.rate_limits[api_name]) >= limit_per_hour:
            return False
        
        self.rate_limits[api_name].append(now)
        return True
    
    def _make_api_call(self, url: str, params: Dict, api_name: str, 
                      rate_limit: int = 500, method: str = 'GET') -> Optional[Dict]:
        """Make API call with rate limiting and error handling"""
        if not self._check_rate_limit(api_name, rate_limit):
            logger.warning(f"Rate limit exceeded for {api_name}")
            return None
        
        try:
            if method.upper() == 'POST':
                response = self.session.post(url, json=params, timeout=30)
            else:
                response = self.session.get(url, params=params, timeout=30)
            
            # Handle 204 No Content responses
            if response.status_code == 204:
                logger.warning(f"No data available for {api_name}")
                return None
            
            response.raise_for_status()
            
            # Check if response has content
            if not response.text.strip():
                logger.warning(f"Empty response from {api_name}")
                return None
            
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API call failed for {api_name}: {e}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error for {api_name}: {e}")
            return None
    
    def get_census_data(self, latitude: float, longitude: float, 
                       year: int = 2022) -> Optional[FederalCensusData]:
        """Get Census data for coordinates"""
        # Census API can work without a key for basic data
        if not self.api_keys.get('census'):
            logger.info("Census API key not configured, using public access")
        
        # First, get the census tract for the coordinates
        tract_data = self._get_census_tract(latitude, longitude)
        if not tract_data:
            return None
        
        state_fips = tract_data.get('state')
        county_fips = tract_data.get('county')
        tract_fips = tract_data.get('tract')
        
        if not all([state_fips, county_fips, tract_fips]):
            logger.error("Could not determine census tract")
            return None
        
        # Get demographic data
        demographics = self._get_census_demographics(state_fips, county_fips, tract_fips, year)
        if not demographics:
            return None
        
        # Get business data
        businesses = self._get_census_businesses(state_fips, county_fips, tract_fips, year)
        
        return FederalCensusData(
            state_fips=state_fips,
            county_fips=county_fips,
            tract_fips=tract_fips,
            total_population=demographics.get('B01003_001E'),  # Total population
            median_age=demographics.get('B01002_001E'),  # Median age
            median_household_income=demographics.get('B19013_001E'),  # Median household income
            poverty_rate=demographics.get('B17001_002E'),  # Poverty rate
            total_housing_units=demographics.get('B25001_001E'),  # Total housing units
            occupied_housing_units=demographics.get('B25003_001E'),  # Occupied housing units
            vacant_housing_units=demographics.get('B25004_001E'),  # Vacant housing units
            owner_occupied=demographics.get('B25003_002E'),  # Owner occupied
            renter_occupied=demographics.get('B25003_003E'),  # Renter occupied
            total_businesses=businesses.get('total_establishments'),
            retail_trade_establishments=businesses.get('retail_trade'),
            professional_services=businesses.get('professional_services'),
            manufacturing_establishments=businesses.get('manufacturing'),
            data_year=year,
            last_updated=datetime.now(),
            confidence_score=0.8
        )
    
    def _get_census_tract(self, latitude: float, longitude: float) -> Optional[Dict]:
        """Get census tract for coordinates"""
        url = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
        params = {
            'x': longitude,
            'y': latitude,
            'benchmark': 'Public_AR_Current',
            'vintage': 'Current_Current',
            'format': 'json'
        }
        
        data = self._make_api_call(url, params, 'census', 1000)
        if not data or 'result' not in data:
            return None
        
        geographies = data['result'].get('geographies', {})
        census_tract = geographies.get('Census Tracts', [])
        
        if not census_tract:
            return None
        
        tract_info = census_tract[0]
        return {
            'state': tract_info.get('STATE'),
            'county': tract_info.get('COUNTY'),
            'tract': tract_info.get('TRACT')
        }
    
    def _get_census_demographics(self, state_fips: str, county_fips: str, 
                                tract_fips: str, year: int) -> Optional[Dict]:
        """Get demographic data from Census API"""
        url = f"https://api.census.gov/data/{year}/acs/acs5"
        params = {
            'get': 'B01003_001E,B01002_001E,B19013_001E,B17001_002E,B25001_001E,B25003_001E,B25003_002E,B25003_003E',
            'for': f'tract:{tract_fips}',
            'in': f'state:{state_fips} county:{county_fips}'
        }
        
        # Add API key if available
        if self.api_keys.get('census'):
            params['key'] = self.api_keys['census']
        
        data = self._make_api_call(url, params, 'census', 1000)
        if not data or len(data) < 2:
            return None
        
        # Parse the response (first row is headers, second is data)
        headers = data[0]
        values = data[1]
        
        return dict(zip(headers, values))
    
    def _get_census_businesses(self, state_fips: str, county_fips: str, 
                              tract_fips: str, year: int) -> Dict:
        """Get business data from Census API"""
        # This is a simplified version - real implementation would need
        # multiple API calls for different business categories
        return {
            'total_establishments': None,
            'retail_trade': None,
            'professional_services': None,
            'manufacturing': None
        }
    
    def get_bls_data(self, state_code: str, county_code: str = None) -> Optional[FederalBLSData]:
        """Get BLS economic data for state/county"""
        if not self.api_keys['bls']:
            logger.warning("BLS API key not configured")
            return None
        
        # Get employment data
        employment_data = self._get_bls_employment_data(state_code, county_code)
        if not employment_data:
            return None
        
        # Get wage data
        wage_data = self._get_bls_wage_data(state_code, county_code)
        
        return FederalBLSData(
            state_code=state_code,
            county_code=county_code,
            total_employment=employment_data.get('total_employment'),
            unemployment_rate=employment_data.get('unemployment_rate'),
            labor_force_participation=employment_data.get('labor_force_participation'),
            average_hourly_wage=wage_data.get('average_hourly_wage'),
            median_annual_wage=wage_data.get('median_annual_wage'),
            retail_trade_employment=employment_data.get('retail_trade'),
            professional_services_employment=employment_data.get('professional_services'),
            manufacturing_employment=employment_data.get('manufacturing'),
            construction_employment=employment_data.get('construction'),
            data_year=2023,  # Most recent BLS data
            last_updated=datetime.now()
        )
    
    def _get_bls_employment_data(self, state_code: str, county_code: str = None) -> Optional[Dict]:
        """Get BLS employment data"""
        # BLS API requires POST requests with specific series IDs
        url = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
        
        # Example series IDs for state-level data
        series_ids = [
            f"LAU{state_code}0000000000003",  # Unemployment rate
            f"LAU{state_code}0000000000004",  # Labor force
        ]
        
        if county_code:
            series_ids.extend([
                f"LAU{state_code}{county_code}0000000000003",
                f"LAU{state_code}{county_code}0000000000004",
            ])
        
        payload = {
            "seriesid": series_ids,
            "startyear": "2022",
            "endyear": "2023"
        }
        
        # Add API key if available
        if self.api_keys.get('bls'):
            payload["registrationkey"] = self.api_keys['bls']
        
        try:
            # BLS API requires POST request
            response = self.session.post(url, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if not data or 'Results' not in data:
                return None
            
            # Parse BLS response
            results = data.get('Results', {})
            series_data = results.get('series', [])
            
            employment_data = {
                'total_employment': None,
                'unemployment_rate': None,
                'labor_force_participation': None,
                'retail_trade': None,
                'professional_services': None,
                'manufacturing': None,
                'construction': None
            }
            
            # Parse series data
            for series in series_data:
                series_id = series.get('seriesID', '')
                data_points = series.get('data', [])
                
                if data_points:
                    latest_data = data_points[0]  # Most recent data point
                    value = latest_data.get('value')
                    
                    if 'LAU' in series_id and '0003' in series_id:
                        employment_data['unemployment_rate'] = float(value) if value else None
                    elif 'LAU' in series_id and '0004' in series_id:
                        employment_data['total_employment'] = int(value) if value else None
            
            return employment_data
            
        except Exception as e:
            logger.error(f"BLS API call failed: {e}")
            return None
    
    def _get_bls_wage_data(self, state_code: str, county_code: str = None) -> Dict:
        """Get BLS wage data"""
        # Simplified implementation - would need specific series IDs
        return {
            'average_hourly_wage': None,
            'median_annual_wage': None
        }
    
    def get_data_gov_datasets(self, query: str = "commercial real estate", 
                             organization: str = "State Government") -> List[Dict]:
        """Search Data.gov for relevant datasets"""
        url = "https://catalog.data.gov/api/3/action/package_search"
        params = {
            'q': query,
            'fq': f'organization_type:{organization}',
            'rows': 100
        }
        
        data = self._make_api_call(url, params, 'data_gov', 1000)
        if not data or 'result' not in data:
            return []
        
        results = data['result'].get('results', [])
        return results
    
    def get_state_datasets(self, state: StateCode) -> List[Dict]:
        """Get available datasets for a specific state"""
        query = f"{state.value} real estate property"
        return self.get_data_gov_datasets(query, "State Government")
    
    def get_commercial_real_estate_data(self, latitude: float, longitude: float,
                                      state: str, county: str = None) -> CommercialRealEstateData:
        """Get comprehensive commercial real estate data"""
        # Get federal data
        census_data = self.get_census_data(latitude, longitude)
        bls_data = self.get_bls_data(state, county)
        
        # Get state datasets
        state_code = StateCode[state.upper()] if state.upper() in StateCode.__members__ else None
        state_datasets = []
        if state_code:
            state_datasets = self.get_state_datasets(state_code)
        
        # Calculate data quality score
        data_sources = []
        if census_data:
            data_sources.append('census')
        if bls_data:
            data_sources.append('bls')
        if state_datasets:
            data_sources.append('data_gov')
        
        data_quality_score = len(data_sources) / 3.0  # Normalize to 0-1
        
        return CommercialRealEstateData(
            address=f"{latitude}, {longitude}",  # Would need reverse geocoding
            latitude=latitude,
            longitude=longitude,
            state=state,
            county=county,
            census_data=census_data,
            bls_data=bls_data,
            data_quality_score=data_quality_score,
            last_updated=datetime.now(),
            data_sources=data_sources,
            confidence_score=data_quality_score
        )
    
    def get_all_states_summary(self) -> Dict[str, Any]:
        """Get summary of data availability for all states"""
        summary = {}
        
        for state in StateCode:
            state_code = state.name
            datasets = self.get_state_datasets(state)
            
            summary[state_code] = {
                'state_name': state.value,
                'datasets_available': len(datasets),
                'has_property_data': any('property' in str(dataset).lower() for dataset in datasets),
                'has_real_estate_data': any('real estate' in str(dataset).lower() for dataset in datasets),
                'has_commercial_data': any('commercial' in str(dataset).lower() for dataset in datasets),
                'api_available': len(datasets) > 0,
                'last_checked': datetime.now().isoformat()
            }
        
        return summary
    
    def save_federal_data(self, data: CommercialRealEstateData, 
                         output_file: str = None) -> str:
        """Save federal data to JSON file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"federal_data_{timestamp}.json"
        
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
        
        logger.info(f"Saved federal data to {output_file}")
        return output_file

def main():
    """Example usage of the Federal Data Service"""
    service = FederalDataService()
    
    # Example coordinates (San Francisco)
    latitude = 37.7749
    longitude = -122.4194
    
    # Get comprehensive data
    data = service.get_commercial_real_estate_data(
        latitude=latitude,
        longitude=longitude,
        state="CA",
        county="San Francisco"
    )
    
    print(f"Federal data: {data}")
    
    # Get all states summary
    summary = service.get_all_states_summary()
    print(f"States with data: {len([s for s in summary.values() if s['datasets_available'] > 0])}")

if __name__ == "__main__":
    main()
