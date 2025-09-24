"""
External Data Enrichment Service
Integrates with various APIs to enrich property data with:
- Walk Score API for walkability scores
- Google Maps Places API for amenities
- Transit APIs for public transport data
- Census API for demographic information
- School APIs for detailed school data
"""

import os
import json
import time
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class WalkScoreData:
    """Walk Score API response data"""
    walk_score: Optional[int] = None
    bike_score: Optional[int] = None
    transit_score: Optional[int] = None
    description: Optional[str] = None
    updated: Optional[datetime] = None

@dataclass
class AmenityData:
    """Google Places API amenity data"""
    name: str
    type: str
    rating: Optional[float] = None
    distance_meters: Optional[int] = None
    place_id: Optional[str] = None
    price_level: Optional[int] = None

@dataclass
class TransitData:
    """Transit API data"""
    nearest_stop: Optional[str] = None
    distance_meters: Optional[int] = None
    routes: List[str] = None
    frequency_minutes: Optional[int] = None

@dataclass
class CensusData:
    """Census API demographic data"""
    population: Optional[int] = None
    median_age: Optional[float] = None
    median_income: Optional[int] = None
    education_level: Optional[str] = None
    employment_rate: Optional[float] = None
    housing_units: Optional[int] = None

@dataclass
class SchoolData:
    """School API data"""
    name: str
    type: str  # elementary, middle, high
    rating: Optional[int] = None
    distance_meters: Optional[int] = None
    district: Optional[str] = None
    enrollment: Optional[int] = None

@dataclass
class EnrichedPropertyData:
    """Combined enriched property data"""
    property_id: str
    address: str
    latitude: float
    longitude: float
    walk_score_data: Optional[WalkScoreData] = None
    amenities: List[AmenityData] = None
    transit_data: Optional[TransitData] = None
    census_data: Optional[CensusData] = None
    schools: List[SchoolData] = None
    enrichment_date: Optional[datetime] = None
    
    def __post_init__(self):
        if self.amenities is None:
            self.amenities = []
        if self.schools is None:
            self.schools = []

class ExternalDataService:
    """Main service for integrating external APIs"""
    
    def __init__(self):
        self.api_keys = self._load_api_keys()
        self.session = self._create_session()
        self.cache = {}
        self.rate_limits = {}
        
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables"""
        return {
            'walkscore': os.getenv('WALKSCORE_API_KEY'),
            'google_places': os.getenv('GOOGLE_PLACES_API_KEY'),
            'census': os.getenv('CENSUS_API_KEY'),
            'transit': os.getenv('TRANSIT_API_KEY'),
            'schools': os.getenv('SCHOOL_API_KEY')
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
    
    def _check_rate_limit(self, api_name: str, limit_per_minute: int = 60) -> bool:
        """Check if API call is within rate limits"""
        now = datetime.now()
        if api_name not in self.rate_limits:
            self.rate_limits[api_name] = []
        
        # Remove calls older than 1 minute
        self.rate_limits[api_name] = [
            call_time for call_time in self.rate_limits[api_name]
            if now - call_time < timedelta(minutes=1)
        ]
        
        if len(self.rate_limits[api_name]) >= limit_per_minute:
            return False
        
        self.rate_limits[api_name].append(now)
        return True
    
    def _make_api_call(self, url: str, params: Dict, api_name: str, 
                      rate_limit: int = 60) -> Optional[Dict]:
        """Make API call with rate limiting and error handling"""
        if not self._check_rate_limit(api_name, rate_limit):
            logger.warning(f"Rate limit exceeded for {api_name}")
            return None
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API call failed for {api_name}: {e}")
            return None
    
    def get_walk_score(self, latitude: float, longitude: float, 
                      address: str) -> Optional[WalkScoreData]:
        """Get walkability scores from Walk Score API"""
        if not self.api_keys['walkscore']:
            logger.warning("Walk Score API key not configured")
            return None
        
        url = "https://api.walkscore.com/score"
        params = {
            'format': 'json',
            'lat': latitude,
            'lon': longitude,
            'address': address,
            'wsapikey': self.api_keys['walkscore']
        }
        
        data = self._make_api_call(url, params, 'walkscore', 1000)
        if not data:
            return None
        
        return WalkScoreData(
            walk_score=data.get('walkscore'),
            bike_score=data.get('bike', {}).get('score'),
            transit_score=data.get('transit', {}).get('score'),
            description=data.get('description'),
            updated=datetime.now()
        )
    
    def get_google_places_amenities(self, latitude: float, longitude: float, 
                                   radius: int = 1000) -> List[AmenityData]:
        """Get nearby amenities from Google Places API"""
        if not self.api_keys['google_places']:
            logger.warning("Google Places API key not configured")
            return []
        
        amenities = []
        place_types = [
            'restaurant', 'grocery_or_supermarket', 'hospital', 'school',
            'park', 'shopping_mall', 'gym', 'bank', 'pharmacy', 'gas_station'
        ]
        
        for place_type in place_types:
            url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                'location': f"{latitude},{longitude}",
                'radius': radius,
                'type': place_type,
                'key': self.api_keys['google_places']
            }
            
            data = self._make_api_call(url, params, 'google_places', 1000)
            if not data or 'results' not in data:
                continue
            
            for place in data['results'][:5]:  # Limit to 5 per type
                amenities.append(AmenityData(
                    name=place.get('name', ''),
                    type=place_type,
                    rating=place.get('rating'),
                    distance_meters=place.get('distance'),
                    place_id=place.get('place_id'),
                    price_level=place.get('price_level')
                ))
        
        return amenities
    
    def get_transit_data(self, latitude: float, longitude: float) -> Optional[TransitData]:
        """Get public transit data"""
        # Using Google Places API for transit stops as fallback
        if not self.api_keys['google_places']:
            logger.warning("Google Places API key not configured for transit")
            return None
        
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            'location': f"{latitude},{longitude}",
            'radius': 500,
            'type': 'transit_station',
            'key': self.api_keys['google_places']
        }
        
        data = self._make_api_call(url, params, 'google_places', 1000)
        if not data or 'results' not in data or not data['results']:
            return None
        
        nearest_stop = data['results'][0]
        return TransitData(
            nearest_stop=nearest_stop.get('name'),
            distance_meters=nearest_stop.get('distance'),
            routes=[],  # Would need additional API call for routes
            frequency_minutes=None
        )
    
    def get_census_data(self, latitude: float, longitude: float) -> Optional[CensusData]:
        """Get demographic data from Census API"""
        if not self.api_keys['census']:
            logger.warning("Census API key not configured")
            return None
        
        # Get census tract for coordinates
        url = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
        params = {
            'x': longitude,
            'y': latitude,
            'benchmark': 'Public_AR_Current',
            'vintage': 'Current_Current',
            'format': 'json'
        }
        
        tract_data = self._make_api_call(url, params, 'census', 1000)
        if not tract_data:
            return None
        
        # Get demographic data for the tract
        # This is a simplified version - real implementation would need tract-specific calls
        return CensusData(
            population=None,  # Would need additional API calls
            median_age=None,
            median_income=None,
            education_level=None,
            employment_rate=None,
            housing_units=None
        )
    
    def get_school_data(self, latitude: float, longitude: float) -> List[SchoolData]:
        """Get nearby schools data"""
        if not self.api_keys['google_places']:
            logger.warning("Google Places API key not configured for schools")
            return []
        
        schools = []
        school_types = ['school', 'university']
        
        for school_type in school_types:
            url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                'location': f"{latitude},{longitude}",
                'radius': 2000,
                'type': school_type,
                'key': self.api_keys['google_places']
            }
            
            data = self._make_api_call(url, params, 'google_places', 1000)
            if not data or 'results' not in data:
                continue
            
            for school in data['results'][:10]:  # Limit to 10 schools
                schools.append(SchoolData(
                    name=school.get('name', ''),
                    type=self._determine_school_type(school.get('name', '')),
                    rating=school.get('rating'),
                    distance_meters=school.get('distance'),
                    district=None,  # Would need additional API call
                    enrollment=None
                ))
        
        return schools
    
    def _determine_school_type(self, school_name: str) -> str:
        """Determine school type based on name"""
        name_lower = school_name.lower()
        if any(word in name_lower for word in ['elementary', 'primary', 'grade']):
            return 'elementary'
        elif any(word in name_lower for word in ['middle', 'intermediate']):
            return 'middle'
        elif any(word in name_lower for word in ['high', 'secondary']):
            return 'high'
        elif any(word in name_lower for word in ['university', 'college']):
            return 'university'
        else:
            return 'unknown'
    
    def enrich_property(self, property_data: Dict[str, Any]) -> EnrichedPropertyData:
        """Enrich a single property with external data"""
        property_id = property_data.get('property_id', '')
        address = property_data.get('address', {}).get('formatted_address', '')
        latitude = property_data.get('latitude')
        longitude = property_data.get('longitude')
        
        if not latitude or not longitude:
            logger.error(f"Missing coordinates for property {property_id}")
            return EnrichedPropertyData(
                property_id=property_id,
                address=address,
                latitude=0,
                longitude=0
            )
        
        logger.info(f"Enriching property {property_id} at {latitude}, {longitude}")
        
        # Get all external data
        walk_score_data = self.get_walk_score(latitude, longitude, address)
        amenities = self.get_google_places_amenities(latitude, longitude)
        transit_data = self.get_transit_data(latitude, longitude)
        census_data = self.get_census_data(latitude, longitude)
        schools = self.get_school_data(latitude, longitude)
        
        return EnrichedPropertyData(
            property_id=property_id,
            address=address,
            latitude=latitude,
            longitude=longitude,
            walk_score_data=walk_score_data,
            amenities=amenities,
            transit_data=transit_data,
            census_data=census_data,
            schools=schools,
            enrichment_date=datetime.now()
        )
    
    def enrich_properties_batch(self, properties: List[Dict[str, Any]], 
                              batch_size: int = 10) -> List[EnrichedPropertyData]:
        """Enrich multiple properties in batches"""
        enriched_properties = []
        
        for i in range(0, len(properties), batch_size):
            batch = properties[i:i + batch_size]
            logger.info(f"Processing batch {i//batch_size + 1} of {len(properties)//batch_size + 1}")
            
            for property_data in batch:
                try:
                    enriched = self.enrich_property(property_data)
                    enriched_properties.append(enriched)
                    
                    # Add delay between properties to respect rate limits
                    time.sleep(0.1)
                    
                except Exception as e:
                    logger.error(f"Failed to enrich property {property_data.get('property_id')}: {e}")
                    continue
        
        return enriched_properties
    
    def save_enriched_data(self, enriched_properties: List[EnrichedPropertyData], 
                          output_file: str = None) -> str:
        """Save enriched data to JSON file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"enriched_properties_{timestamp}.json"
        
        # Convert dataclasses to dictionaries
        data = [asdict(prop) for prop in enriched_properties]
        
        # Convert datetime objects to strings for JSON serialization
        for prop_data in data:
            if prop_data.get('enrichment_date'):
                prop_data['enrichment_date'] = prop_data['enrichment_date'].isoformat()
            if prop_data.get('walk_score_data', {}).get('updated'):
                prop_data['walk_score_data']['updated'] = prop_data['walk_score_data']['updated'].isoformat()
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Saved enriched data to {output_file}")
        return output_file
    
    def load_enriched_data(self, file_path: str) -> List[EnrichedPropertyData]:
        """Load enriched data from JSON file"""
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        enriched_properties = []
        for prop_data in data:
            # Convert string dates back to datetime objects
            if prop_data.get('enrichment_date'):
                prop_data['enrichment_date'] = datetime.fromisoformat(prop_data['enrichment_date'])
            if prop_data.get('walk_score_data', {}).get('updated'):
                prop_data['walk_score_data']['updated'] = datetime.fromisoformat(
                    prop_data['walk_score_data']['updated']
                )
            
            enriched_properties.append(EnrichedPropertyData(**prop_data))
        
        return enriched_properties

def main():
    """Example usage of the External Data Service"""
    service = ExternalDataService()
    
    # Example property data
    sample_property = {
        'property_id': 'test_001',
        'address': {'formatted_address': '123 Main St, San Francisco, CA'},
        'latitude': 37.7749,
        'longitude': -122.4194
    }
    
    # Enrich single property
    enriched = service.enrich_property(sample_property)
    print(f"Enriched property: {enriched}")
    
    # Save enriched data
    output_file = service.save_enriched_data([enriched])
    print(f"Saved to: {output_file}")

if __name__ == "__main__":
    main()
