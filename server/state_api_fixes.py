"""
State API Fixes and Improvements
Fixes common issues with state data portal APIs
"""

import requests
import json
import logging
from typing import Dict, List, Optional, Any
from state_data_models import StateCode, StateOpenDataConfig

logger = logging.getLogger(__name__)

class StateAPIFixer:
    """Fixes and improves state API integrations"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
    
    def discover_actual_endpoints(self, state: StateCode) -> Dict[str, Any]:
        """Discover actual API endpoints for a state"""
        config = StateOpenDataConfig(
            state=state,
            data_portal_url="",
            api_base_url="",
            api_available=False
        )
        
        # Common state data portal patterns
        portal_patterns = [
            f"https://data.{state.value.lower().replace(' ', '')}.gov",
            f"https://opendata.{state.value.lower().replace(' ', '')}.gov",
            f"https://{state.value.lower().replace(' ', '')}.opendata.arcgis.com",
            f"https://data.{state.name.lower()}.gov",
            f"https://{state.name.lower()}.opendata.arcgis.com"
        ]
        
        working_endpoints = []
        
        for pattern in portal_patterns:
            try:
                # Test main portal
                response = self.session.get(pattern, timeout=5)
                if response.status_code == 200:
                    working_endpoints.append({
                        'url': pattern,
                        'type': 'portal',
                        'status': 'working'
                    })
                
                # Test API endpoints
                api_endpoints = [
                    f"{pattern}/api/3",
                    f"{pattern}/api",
                    f"{pattern}/api/v1",
                    f"{pattern}/api/v2"
                ]
                
                for api_url in api_endpoints:
                    try:
                        api_response = self.session.get(f"{api_url}/action/package_list", timeout=5)
                        if api_response.status_code == 200:
                            working_endpoints.append({
                                'url': api_url,
                                'type': 'api',
                                'status': 'working'
                            })
                            break
                    except:
                        continue
                        
            except Exception as e:
                logger.debug(f"Failed to test {pattern}: {e}")
                continue
        
        return {
            'state': state.value,
            'working_endpoints': working_endpoints,
            'has_working_api': len([e for e in working_endpoints if e['type'] == 'api']) > 0
        }
    
    def get_actual_resource_ids(self, state: StateCode, api_base_url: str) -> List[str]:
        """Get actual resource IDs from state API"""
        try:
            # Get package list
            url = f"{api_base_url}/action/package_list"
            response = self.session.get(url, timeout=10)
            
            if response.status_code != 200:
                return []
            
            packages = response.json().get('result', [])
            
            # Filter for real estate related packages
            real_estate_keywords = [
                'property', 'real estate', 'assessment', 'tax', 'parcel',
                'commercial', 'residential', 'building', 'land', 'zoning'
            ]
            
            relevant_packages = []
            for package in packages:
                package_lower = package.lower()
                if any(keyword in package_lower for keyword in real_estate_keywords):
                    relevant_packages.append(package)
            
            return relevant_packages
            
        except Exception as e:
            logger.error(f"Error getting resource IDs for {state.value}: {e}")
            return []
    
    def test_state_api_connectivity(self, state: StateCode) -> Dict[str, Any]:
        """Test connectivity to state APIs"""
        results = {
            'state': state.value,
            'portal_accessible': False,
            'api_accessible': False,
            'working_endpoints': [],
            'resource_ids': [],
            'errors': []
        }
        
        # Test portal accessibility
        portal_urls = [
            f"https://data.{state.value.lower().replace(' ', '')}.gov",
            f"https://opendata.{state.value.lower().replace(' ', '')}.gov"
        ]
        
        for portal_url in portal_urls:
            try:
                response = self.session.get(portal_url, timeout=5)
                if response.status_code == 200:
                    results['portal_accessible'] = True
                    results['working_endpoints'].append(portal_url)
                    break
            except Exception as e:
                results['errors'].append(f"Portal {portal_url}: {str(e)}")
        
        # Test API accessibility
        api_urls = [
            f"https://data.{state.value.lower().replace(' ', '')}.gov/api/3",
            f"https://opendata.{state.value.lower().replace(' ', '')}.gov/api/3"
        ]
        
        for api_url in api_urls:
            try:
                response = self.session.get(f"{api_url}/action/package_list", timeout=5)
                if response.status_code == 200:
                    results['api_accessible'] = True
                    results['working_endpoints'].append(api_url)
                    
                    # Get resource IDs
                    resource_ids = self.get_actual_resource_ids(state, api_url)
                    results['resource_ids'] = resource_ids
                    break
            except Exception as e:
                results['errors'].append(f"API {api_url}: {str(e)}")
        
        return results
    
    def generate_working_configs(self) -> Dict[str, StateOpenDataConfig]:
        """Generate working configurations for all states"""
        working_configs = {}
        
        # Test a few key states first
        test_states = [
            StateCode.CA, StateCode.NY, StateCode.TX, StateCode.FL, 
            StateCode.IL, StateCode.PA, StateCode.OH, StateCode.GA
        ]
        
        for state in test_states:
            try:
                results = self.test_state_api_connectivity(state)
                
                if results['api_accessible']:
                    # Find the working API URL
                    api_url = None
                    for endpoint in results['working_endpoints']:
                        if endpoint['type'] == 'api':
                            api_url = endpoint['url']
                            break
                    
                    if api_url:
                        config = StateOpenDataConfig(
                            state=state,
                            data_portal_url=results['working_endpoints'][0]['url'] if results['working_endpoints'] else "",
                            api_base_url=api_url,
                            api_key_required=False,
                            rate_limit_per_hour=1000,
                            property_assessments=len(results['resource_ids']) > 0,
                            property_transactions=len(results['resource_ids']) > 0,
                            commercial_rent_data=False,
                            zoning_data=len(results['resource_ids']) > 0,
                            tax_data=len(results['resource_ids']) > 0,
                            supported_formats=['CSV', 'JSON'],
                            api_available=True,
                            auth_type='none',
                            update_frequency='monthly'
                        )
                        working_configs[state.name] = config
                        logger.info(f"✅ {state.value}: API working with {len(results['resource_ids'])} resources")
                    else:
                        logger.warning(f"⚠️ {state.value}: Portal accessible but no working API")
                else:
                    logger.warning(f"❌ {state.value}: No accessible API")
                    
            except Exception as e:
                logger.error(f"❌ {state.value}: Error testing - {e}")
        
        return working_configs

def main():
    """Test state API connectivity"""
    fixer = StateAPIFixer()
    
    print("🔍 Testing State API Connectivity...")
    print("=" * 50)
    
    # Test key states
    test_states = [StateCode.CA, StateCode.NY, StateCode.TX, StateCode.FL]
    
    for state in test_states:
        print(f"\nTesting {state.value}...")
        results = fixer.test_state_api_connectivity(state)
        
        print(f"  Portal Accessible: {results['portal_accessible']}")
        print(f"  API Accessible: {results['api_accessible']}")
        print(f"  Resource IDs: {len(results['resource_ids'])}")
        
        if results['errors']:
            print(f"  Errors: {len(results['errors'])}")
    
    print("\n" + "=" * 50)
    print("Generating working configurations...")
    
    working_configs = fixer.generate_working_configs()
    print(f"✅ Found {len(working_configs)} working state APIs")
    
    # Save working configurations
    config_data = {}
    for state_name, config in working_configs.items():
        config_data[state_name] = {
            'state_name': config.state.value,
            'data_portal_url': config.data_portal_url,
            'api_base_url': config.api_base_url,
            'api_available': config.api_available,
            'property_assessments': config.property_assessments,
            'property_transactions': config.property_transactions
        }
    
    with open('working_state_configs.json', 'w') as f:
        json.dump(config_data, f, indent=2)
    
    print("✅ Saved working configurations to working_state_configs.json")

if __name__ == "__main__":
    main()
