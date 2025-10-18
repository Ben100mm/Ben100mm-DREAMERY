"""
Automated Data Discovery Service
Discovers and catalogs available commercial real estate data sources across all 50 states
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
    StateCode, DataSource, StateOpenDataConfig, StateDataSummary,
    FEDERAL_DATA_CONFIGS, STATE_DATA_CONFIGS
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataDiscoveryService:
    """Service for discovering and cataloging data sources"""
    
    def __init__(self):
        self.session = self._create_session()
        self.discovered_sources = {}
        self.data_catalog = {}
        
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
    
    def discover_federal_sources(self) -> Dict[str, Any]:
        """Discover available federal data sources"""
        logger.info("Discovering federal data sources...")
        
        federal_sources = {
            'census': self._discover_census_sources(),
            'bls': self._discover_bls_sources(),
            'data_gov': self._discover_data_gov_sources(),
            'gsa': self._discover_gsa_sources()
        }
        
        self.discovered_sources['federal'] = federal_sources
        return federal_sources
    
    def _discover_census_sources(self) -> Dict[str, Any]:
        """Discover Census Bureau data sources"""
        try:
            # Test Census API availability
            url = "https://api.census.gov/data/2022/acs/acs5"
            params = {
                'get': 'B01003_001E',
                'for': 'state:01',
                'key': os.getenv('CENSUS_API_KEY', 'test')
            }
            
            response = self.session.get(url, params=params, timeout=10)
            api_available = response.status_code == 200
            
            return {
                'api_available': api_available,
                'base_url': 'https://api.census.gov/data',
                'rate_limit': '500/hour',
                'api_key_required': True,
                'datasets': [
                    'American Community Survey (ACS)',
                    'Economic Census',
                    'County Business Patterns',
                    'Population Estimates',
                    'Decennial Census'
                ],
                'last_checked': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error discovering Census sources: {e}")
            return {'api_available': False, 'error': str(e)}
    
    def _discover_bls_sources(self) -> Dict[str, Any]:
        """Discover BLS data sources"""
        try:
            # Test BLS API availability
            url = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
            payload = {
                "seriesid": ["LAU0100000000000003"],
                "startyear": "2022",
                "endyear": "2022"
            }
            
            response = self.session.post(url, json=payload, timeout=10)
            api_available = response.status_code == 200
            
            return {
                'api_available': api_available,
                'base_url': 'https://api.bls.gov/publicAPI/v2',
                'rate_limit': '500/hour',
                'api_key_required': False,
                'datasets': [
                    'Employment Statistics',
                    'Unemployment Data',
                    'Wage Data',
                    'Industry Data',
                    'Occupational Data'
                ],
                'last_checked': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error discovering BLS sources: {e}")
            return {'api_available': False, 'error': str(e)}
    
    def _discover_data_gov_sources(self) -> Dict[str, Any]:
        """Discover Data.gov sources"""
        try:
            # Test Data.gov API
            url = "https://catalog.data.gov/api/3/action/package_search"
            params = {
                'q': 'real estate',
                'rows': 10
            }
            
            response = self.session.get(url, params=params, timeout=10)
            api_available = response.status_code == 200
            
            if api_available:
                data = response.json()
                total_datasets = data.get('result', {}).get('count', 0)
            else:
                total_datasets = 0
            
            return {
                'api_available': api_available,
                'base_url': 'https://catalog.data.gov/api/3',
                'rate_limit': '1000/hour',
                'api_key_required': False,
                'total_datasets': total_datasets,
                'datasets': [
                    'Federal Real Property Profile',
                    'State Government Datasets',
                    'Local Government Datasets',
                    'Real Estate Data',
                    'Property Data'
                ],
                'last_checked': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error discovering Data.gov sources: {e}")
            return {'api_available': False, 'error': str(e)}
    
    def _discover_gsa_sources(self) -> Dict[str, Any]:
        """Discover GSA (General Services Administration) sources"""
        try:
            # Test GSA Federal Real Property Profile
            url = "https://catalog.data.gov/api/3/action/package_search"
            params = {
                'q': 'federal real property',
                'rows': 5
            }
            
            response = self.session.get(url, params=params, timeout=10)
            api_available = response.status_code == 200
            
            return {
                'api_available': api_available,
                'base_url': 'https://catalog.data.gov/api/3',
                'rate_limit': '1000/hour',
                'api_key_required': False,
                'datasets': [
                    'Federal Real Property Profile',
                    'Federal Building Data',
                    'Government Property Data'
                ],
                'last_checked': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error discovering GSA sources: {e}")
            return {'api_available': False, 'error': str(e)}
    
    def discover_state_sources(self, state: StateCode = None) -> Dict[str, Any]:
        """Discover state data sources"""
        if state:
            states_to_check = [state]
        else:
            states_to_check = list(StateCode)
        
        logger.info(f"Discovering state data sources for {len(states_to_check)} states...")
        
        state_sources = {}
        
        for state_code in states_to_check:
            try:
                state_sources[state_code.name] = self._discover_single_state(state_code)
                time.sleep(0.1)  # Rate limiting
            except Exception as e:
                logger.error(f"Error discovering sources for {state_code.value}: {e}")
                state_sources[state_code.name] = {'error': str(e)}
        
        self.discovered_sources['states'] = state_sources
        return state_sources
    
    def _discover_single_state(self, state: StateCode) -> Dict[str, Any]:
        """Discover data sources for a single state"""
        state_info = {
            'state_name': state.value,
            'state_code': state.name,
            'data_portals': [],
            'apis_available': [],
            'datasets_found': 0,
            'last_checked': datetime.now().isoformat()
        }
        
        # Check for state open data portal
        portal_info = self._check_state_portal(state)
        if portal_info:
            state_info['data_portals'].append(portal_info)
        
        # Check for specific APIs
        api_info = self._check_state_apis(state)
        if api_info:
            state_info['apis_available'].extend(api_info)
        
        # Search for real estate datasets
        datasets = self._search_state_datasets(state)
        state_info['datasets_found'] = len(datasets)
        state_info['datasets'] = datasets
        
        return state_info
    
    def _check_state_portal(self, state: StateCode) -> Optional[Dict[str, Any]]:
        """Check if state has an open data portal"""
        # Common state data portal patterns
        portal_patterns = [
            f"https://data.{state.value.lower().replace(' ', '')}.gov",
            f"https://opendata.{state.value.lower().replace(' ', '')}.gov",
            f"https://{state.value.lower().replace(' ', '')}.opendata.arcgis.com",
            f"https://data.{state.name.lower()}.gov"
        ]
        
        for pattern in portal_patterns:
            try:
                response = self.session.get(pattern, timeout=5)
                if response.status_code == 200:
                    return {
                        'url': pattern,
                        'status': 'available',
                        'title': f"{state.value} Open Data Portal"
                    }
            except:
                continue
        
        return None
    
    def _check_state_apis(self, state: StateCode) -> List[Dict[str, Any]]:
        """Check for available APIs in state"""
        apis = []
        
        # Check for CKAN-based APIs (common for state portals)
        ckan_urls = [
            f"https://data.{state.value.lower().replace(' ', '')}.gov/api/3",
            f"https://opendata.{state.value.lower().replace(' ', '')}.gov/api/3"
        ]
        
        for url in ckan_urls:
            try:
                response = self.session.get(f"{url}/action/package_list", timeout=5)
                if response.status_code == 200:
                    apis.append({
                        'type': 'CKAN API',
                        'url': url,
                        'status': 'available'
                    })
            except:
                continue
        
        return apis
    
    def _search_state_datasets(self, state: StateCode) -> List[Dict[str, Any]]:
        """Search for real estate datasets in state"""
        datasets = []
        
        # Search Data.gov for state-specific datasets
        try:
            url = "https://catalog.data.gov/api/3/action/package_search"
            params = {
                'q': f'{state.value} real estate property',
                'fq': 'organization_type:State Government',
                'rows': 20
            }
            
            response = self.session.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                results = data.get('result', {}).get('results', [])
                
                for result in results:
                    datasets.append({
                        'title': result.get('title', ''),
                        'organization': result.get('organization', {}).get('title', ''),
                        'url': result.get('url', ''),
                        'tags': result.get('tags', []),
                        'resources': len(result.get('resources', []))
                    })
        except Exception as e:
            logger.error(f"Error searching datasets for {state.value}: {e}")
        
        return datasets
    
    def discover_county_sources(self, state: StateCode) -> Dict[str, Any]:
        """Discover county-level data sources"""
        logger.info(f"Discovering county sources for {state.value}...")
        
        # This would need to be implemented based on specific county APIs
        # For now, return a placeholder structure
        return {
            'state': state.value,
            'counties_checked': 0,
            'counties_with_data': 0,
            'sources_found': [],
            'last_checked': datetime.now().isoformat()
        }
    
    def discover_all_sources(self) -> Dict[str, Any]:
        """Discover all available data sources"""
        logger.info("Starting comprehensive data discovery...")
        
        discovery_results = {
            'federal': self.discover_federal_sources(),
            'states': self.discover_state_sources(),
            'discovery_date': datetime.now().isoformat(),
            'summary': {}
        }
        
        # Generate summary statistics
        federal_available = sum(1 for source in discovery_results['federal'].values() 
                              if source.get('api_available', False))
        states_with_data = sum(1 for state in discovery_results['states'].values() 
                             if state.get('datasets_found', 0) > 0)
        
        discovery_results['summary'] = {
            'federal_sources_available': federal_available,
            'total_federal_sources': len(discovery_results['federal']),
            'states_with_data': states_with_data,
            'total_states_checked': len(discovery_results['states']),
            'discovery_success_rate': states_with_data / len(discovery_results['states']) if discovery_results['states'] else 0
        }
        
        self.data_catalog = discovery_results
        return discovery_results
    
    def generate_data_catalog(self) -> Dict[str, Any]:
        """Generate comprehensive data catalog"""
        if not self.data_catalog:
            self.discover_all_sources()
        
        catalog = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'version': '1.0',
                'total_sources': 0,
                'coverage': {}
            },
            'federal_sources': self.data_catalog.get('federal', {}),
            'state_sources': self.data_catalog.get('states', {}),
            'recommendations': self._generate_recommendations()
        }
        
        # Calculate totals
        catalog['metadata']['total_sources'] = (
            len(catalog['federal_sources']) + 
            sum(len(state.get('apis_available', [])) for state in catalog['state_sources'].values())
        )
        
        return catalog
    
    def _generate_recommendations(self) -> List[Dict[str, Any]]:
        """Generate recommendations for data integration"""
        recommendations = []
        
        # Federal data recommendations
        if self.data_catalog.get('federal', {}).get('census', {}).get('api_available'):
            recommendations.append({
                'priority': 'high',
                'type': 'federal',
                'source': 'Census Bureau',
                'reason': 'Comprehensive demographic and economic data',
                'implementation_effort': 'medium'
            })
        
        if self.data_catalog.get('federal', {}).get('bls', {}).get('api_available'):
            recommendations.append({
                'priority': 'high',
                'type': 'federal',
                'source': 'Bureau of Labor Statistics',
                'reason': 'Employment and wage data for market analysis',
                'implementation_effort': 'medium'
            })
        
        # State data recommendations
        high_data_states = [
            state for state, data in self.data_catalog.get('states', {}).items()
            if data.get('datasets_found', 0) > 5
        ]
        
        for state in high_data_states[:5]:  # Top 5 states
            recommendations.append({
                'priority': 'medium',
                'type': 'state',
                'source': f"{state} State Data",
                'reason': f'High data availability ({self.data_catalog["states"][state].get("datasets_found", 0)} datasets)',
                'implementation_effort': 'high'
            })
        
        return recommendations
    
    def save_discovery_results(self, output_file: str = None) -> str:
        """Save discovery results to file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"data_discovery_{timestamp}.json"
        
        catalog = self.generate_data_catalog()
        
        with open(output_file, 'w') as f:
            json.dump(catalog, f, indent=2)
        
        logger.info(f"Saved discovery results to {output_file}")
        return output_file
    
    def get_integration_roadmap(self) -> Dict[str, Any]:
        """Generate integration roadmap based on discovery results"""
        if not self.data_catalog:
            self.discover_all_sources()
        
        roadmap = {
            'phases': [],
            'timeline': {},
            'resources_needed': [],
            'success_metrics': {}
        }
        
        # Phase 1: Federal Data Integration
        roadmap['phases'].append({
            'phase': 1,
            'name': 'Federal Data Integration',
            'duration_weeks': 4,
            'sources': ['Census Bureau', 'BLS', 'Data.gov'],
            'priority': 'high',
            'dependencies': []
        })
        
        # Phase 2: High-Data States
        high_data_states = [
            state for state, data in self.data_catalog.get('states', {}).items()
            if data.get('datasets_found', 0) > 3
        ]
        
        roadmap['phases'].append({
            'phase': 2,
            'name': 'High-Data States Integration',
            'duration_weeks': 8,
            'sources': high_data_states[:10],
            'priority': 'high',
            'dependencies': ['Phase 1']
        })
        
        # Phase 3: Remaining States
        roadmap['phases'].append({
            'phase': 3,
            'name': 'Remaining States Integration',
            'duration_weeks': 12,
            'sources': [state for state in StateCode if state.name not in high_data_states],
            'priority': 'medium',
            'dependencies': ['Phase 2']
        })
        
        # Phase 4: County Data Integration
        roadmap['phases'].append({
            'phase': 4,
            'name': 'County Data Integration',
            'duration_weeks': 16,
            'sources': ['County Assessor APIs'],
            'priority': 'low',
            'dependencies': ['Phase 3']
        })
        
        return roadmap

def main():
    """Example usage of the Data Discovery Service"""
    service = DataDiscoveryService()
    
    # Discover all sources
    results = service.discover_all_sources()
    print(f"Discovery complete: {results['summary']}")
    
    # Generate catalog
    catalog = service.generate_data_catalog()
    print(f"Data catalog generated with {catalog['metadata']['total_sources']} sources")
    
    # Generate roadmap
    roadmap = service.get_integration_roadmap()
    print(f"Integration roadmap: {len(roadmap['phases'])} phases")
    
    # Save results
    output_file = service.save_discovery_results()
    print(f"Results saved to: {output_file}")

if __name__ == "__main__":
    main()
