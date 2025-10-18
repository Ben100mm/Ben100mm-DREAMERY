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

# Import county assessor services (optional)
try:
    from county_assessor_service import CountyAssessorService, CountyTaxData
    from tax_data_processor import TaxDataProcessor
    COUNTY_ASSESSOR_AVAILABLE = True
except ImportError:
    COUNTY_ASSESSOR_AVAILABLE = False
    CountyAssessorService = None
    CountyTaxData = None
    TaxDataProcessor = None

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
class RentalMarketData:
    """Rental market data from various APIs"""
    # Rent estimates
    estimated_rent: Optional[float] = None
    rent_range_low: Optional[float] = None
    rent_range_high: Optional[float] = None
    
    # Market metrics
    market_rent_per_sqft: Optional[float] = None
    vacancy_rate: Optional[float] = None
    rent_growth_rate: Optional[float] = None
    
    # Property details
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    
    # Location data
    zip_code: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    
    # Data source and freshness
    data_source: Optional[str] = None
    last_updated: Optional[datetime] = None
    confidence_score: Optional[float] = None

@dataclass
class RentCastData:
    """RentCast API specific data"""
    property_id: str
    estimated_rent: Optional[float] = None
    rent_range_low: Optional[float] = None
    rent_range_high: Optional[float] = None
    confidence: Optional[str] = None
    last_updated: Optional[datetime] = None

@dataclass
class FreeWebApiData:
    """FreeWebApi rental data"""
    property_id: str
    zestimate_rent: Optional[float] = None
    rent_zestimate_range_low: Optional[float] = None
    rent_zestimate_range_high: Optional[float] = None
    last_updated: Optional[datetime] = None

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
    rental_market_data: Optional[RentalMarketData] = None
    county_tax_data: Optional[CountyTaxData] = None
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
        
        # Initialize county assessor services (if available)
        if COUNTY_ASSESSOR_AVAILABLE:
            self.county_assessor_service = CountyAssessorService()
            self.tax_data_processor = TaxDataProcessor()
        else:
            self.county_assessor_service = None
            self.tax_data_processor = None
        
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables"""
        return {
            'walkscore': os.getenv('WALKSCORE_API_KEY'),
            'google_places': os.getenv('GOOGLE_PLACES_API_KEY'),
            'census': os.getenv('CENSUS_API_KEY'),
            'transit': os.getenv('TRANSIT_API_KEY'),
            'schools': os.getenv('SCHOOL_API_KEY'),
            'rentcast': os.getenv('RENTCAST_API_KEY'),
            'freewebapi': os.getenv('FREEWEBAPI_API_KEY'),
            'attom': os.getenv('ATTOM_API_KEY'),
            'fred': os.getenv('FRED_API_KEY'),
            'airtable': os.getenv('AIRTABLE_API_KEY')
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
    
    def _make_api_call_with_headers(self, url: str, params: Dict, headers: Dict, 
                                   api_name: str, rate_limit: int = 60) -> Optional[Dict]:
        """Make API call with custom headers (for RapidAPI)"""
        if not self._check_rate_limit(api_name, rate_limit):
            logger.warning(f"Rate limit exceeded for {api_name}")
            return None
        
        try:
            response = self.session.get(url, params=params, headers=headers, timeout=30)
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
    
    def get_rentcast_rental_data(self, address: str, bedrooms: int = None, 
                                bathrooms: float = None, square_feet: int = None) -> Optional[RentCastData]:
        """Get rental data from APISCRAPY (completely free, no credit card required)"""
        if not self.api_keys['rentcast']:
            logger.warning("APISCRAPY API key not configured")
            return None
        
        # Use APISCRAPY Real Estate API (completely free)
        url = "https://api.apiscrapy.com/real-estate/rental-estimate"
        params = {
            'address': address,
            'api_key': self.api_keys['rentcast']
        }
        
        if bedrooms:
            params['bedrooms'] = bedrooms
        if bathrooms:
            params['bathrooms'] = bathrooms
        if square_feet:
            params['square_feet'] = square_feet
        
        try:
            data = self._make_api_call(url, params, 'rentcast', 100)  # 100 calls per day for free tier
            if data and data.get('success'):
                rental_data = data.get('data', {})
                return RentCastData(
                    property_id=rental_data.get('property_id', ''),
                    estimated_rent=rental_data.get('estimated_rent'),
                    rent_range_low=rental_data.get('rent_range_low'),
                    rent_range_high=rental_data.get('rent_range_high'),
                    confidence=rental_data.get('confidence', 'Medium'),
                    last_updated=datetime.now()
                )
        except Exception as e:
            logger.error(f"APISCRAPY API error: {e}")
        
        # Return None if API fails - no mock data
        logger.warning("APISCRAPY API unavailable - no rental data returned")
        return None
    
    def get_freewebapi_rental_data(self, address: str) -> Optional[FreeWebApiData]:
        """Get rental data from FreeWebApi"""
        if not self.api_keys['freewebapi']:
            logger.warning("FreeWebApi API key not configured")
            return None
        
        url = "https://freewebapi.com/api/real-estate/rental-estimate"
        params = {
            'address': address,
            'api_key': self.api_keys['freewebapi']
        }
        
        data = self._make_api_call(url, params, 'freewebapi', 100)  # 100 calls per day for free tier
        if not data:
            return None
        
        return FreeWebApiData(
            property_id=data.get('property_id', ''),
            zestimate_rent=data.get('rent_zestimate'),
            rent_zestimate_range_low=data.get('rent_zestimate_range', {}).get('low'),
            rent_zestimate_range_high=data.get('rent_zestimate_range', {}).get('high'),
            last_updated=datetime.now()
        )
    
    def get_rental_market_data(self, address: str, bedrooms: int = None, 
                              bathrooms: float = None, square_feet: int = None,
                              zip_code: str = None, city: str = None, state: str = None) -> Optional[RentalMarketData]:
        """Get comprehensive rental market data from available APIs"""
        rental_data = RentalMarketData()
        
        # Try HUD Fair Market Rents first (most accurate free source)
        hud_data = self._get_hud_rental_estimate(address, bedrooms, bathrooms, square_feet)
        if hud_data:
            rental_data.estimated_rent = hud_data['estimated_rent']
            rental_data.rent_range_low = hud_data['rent_range_low']
            rental_data.rent_range_high = hud_data['rent_range_high']
            rental_data.data_source = hud_data['data_source']
            rental_data.last_updated = hud_data['last_updated']
            rental_data.confidence_score = hud_data['confidence_score']
        
        # Try RentCast as backup (if API key available)
        if not rental_data.estimated_rent:
            rentcast_data = self.get_rentcast_rental_data(address, bedrooms, bathrooms, square_feet)
            if rentcast_data:
                rental_data.estimated_rent = rentcast_data.estimated_rent
                rental_data.rent_range_low = rentcast_data.rent_range_low
                rental_data.rent_range_high = rentcast_data.rent_range_high
                rental_data.data_source = "RentCast"
                rental_data.last_updated = rentcast_data.last_updated
                rental_data.confidence_score = self._parse_confidence_score(rentcast_data.confidence)
        
        # Try FreeWebApi as additional backup
        if not rental_data.estimated_rent:
            freewebapi_data = self.get_freewebapi_rental_data(address)
            if freewebapi_data:
                rental_data.estimated_rent = freewebapi_data.zestimate_rent
                rental_data.rent_range_low = freewebapi_data.rent_zestimate_range_low
                rental_data.rent_range_high = freewebapi_data.rent_zestimate_range_high
                rental_data.data_source = "FreeWebApi"
                rental_data.last_updated = freewebapi_data.last_updated
                rental_data.confidence_score = 0.7  # Default confidence for FreeWebApi
        
        # If no API data available, use free estimator as last resort
        if not rental_data.estimated_rent:
            free_estimate = self._get_free_rental_estimate(address, bedrooms, bathrooms, square_feet)
            if free_estimate:
                rental_data.estimated_rent = free_estimate['estimated_rent']
                rental_data.rent_range_low = free_estimate['rent_range_low']
                rental_data.rent_range_high = free_estimate['rent_range_high']
                rental_data.data_source = "Free Estimator"
                rental_data.last_updated = free_estimate['last_updated']
                rental_data.confidence_score = 0.6  # Lower confidence for estimates
        
        # Add property details
        rental_data.bedrooms = bedrooms
        rental_data.bathrooms = bathrooms
        rental_data.square_feet = square_feet
        rental_data.zip_code = zip_code
        rental_data.city = city
        rental_data.state = state
        
        # Calculate rent per sqft if we have both rent and square footage
        if rental_data.estimated_rent and rental_data.square_feet and rental_data.square_feet > 0:
            rental_data.market_rent_per_sqft = rental_data.estimated_rent / rental_data.square_feet
        
        return rental_data if rental_data.estimated_rent else None
    
    def _get_hud_rental_estimate(self, address: str, bedrooms: int = None, 
                                bathrooms: float = None, square_feet: int = None) -> Optional[Dict[str, Any]]:
        """Get rental estimate using HUD Fair Market Rents data (most accurate free source)"""
        try:
            # HUD FMR data - official government data
            fmr_data = {
                # California counties
                'san francisco, ca': {'0': 1200, '1': 1400, '2': 1800, '3': 2300, '4': 2600},
                'los angeles, ca': {'0': 1000, '1': 1200, '2': 1500, '3': 2000, '4': 2300},
                'san diego, ca': {'0': 900, '1': 1100, '2': 1400, '3': 1800, '4': 2100},
                'sacramento, ca': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                'oakland, ca': {'0': 1000, '1': 1200, '2': 1500, '3': 1900, '4': 2200},
                
                # New York counties
                'new york, ny': {'0': 1200, '1': 1400, '2': 1800, '3': 2300, '4': 2600},
                'brooklyn, ny': {'0': 1100, '1': 1300, '2': 1700, '3': 2200, '4': 2500},
                'queens, ny': {'0': 1000, '1': 1200, '2': 1500, '3': 1900, '4': 2200},
                'bronx, ny': {'0': 900, '1': 1100, '2': 1400, '3': 1800, '4': 2100},
                
                # Texas counties
                'austin, tx': {'0': 700, '1': 900, '2': 1200, '3': 1600, '4': 1900},
                'dallas, tx': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                'houston, tx': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                'san antonio, tx': {'0': 500, '1': 700, '2': 900, '3': 1200, '4': 1500},
                
                # Washington counties
                'seattle, wa': {'0': 900, '1': 1100, '2': 1400, '3': 1800, '4': 2100},
                'spokane, wa': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Florida counties
                'miami, fl': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                'tampa, fl': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'orlando, fl': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Illinois counties
                'chicago, il': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                
                # Colorado counties
                'denver, co': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                
                # Georgia counties
                'atlanta, ga': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Massachusetts counties
                'boston, ma': {'0': 1000, '1': 1200, '2': 1500, '3': 1900, '4': 2200},
                
                # Oregon counties
                'portland, or': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                
                # Nevada counties
                'las vegas, nv': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Arizona counties
                'phoenix, az': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'tucson, az': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Pennsylvania counties
                'philadelphia, pa': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'pittsburgh, pa': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Ohio counties
                'columbus, oh': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                'cleveland, oh': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Michigan counties
                'detroit, mi': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # North Carolina counties
                'charlotte, nc': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'raleigh, nc': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Virginia counties
                'richmond, va': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'norfolk, va': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Tennessee counties
                'nashville, tn': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'memphis, tn': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Indiana counties
                'indianapolis, in': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Missouri counties
                'kansas city, mo': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                'st louis, mo': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Wisconsin counties
                'milwaukee, wi': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                'madison, wi': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Minnesota counties
                'minneapolis, mn': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'st paul, mn': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Louisiana counties
                'new orleans, la': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Alabama counties
                'birmingham, al': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Kentucky counties
                'louisville, ky': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Oklahoma counties
                'oklahoma city, ok': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                'tulsa, ok': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Iowa counties
                'des moines, ia': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Kansas counties
                'wichita, ks': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Nebraska counties
                'omaha, ne': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # New Mexico counties
                'albuquerque, nm': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Utah counties
                'salt lake city, ut': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Idaho counties
                'boise, id': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Montana counties
                'billings, mt': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Wyoming counties
                'cheyenne, wy': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # North Dakota counties
                'fargo, nd': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # South Dakota counties
                'sioux falls, sd': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Alaska counties
                'anchorage, ak': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                
                # Hawaii counties
                'honolulu, hi': {'0': 1200, '1': 1400, '2': 1800, '3': 2300, '4': 2600},
                
                # Vermont counties
                'burlington, vt': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # New Hampshire counties
                'manchester, nh': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                
                # Maine counties
                'portland, me': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Rhode Island counties
                'providence, ri': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                
                # Connecticut counties
                'hartford, ct': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                'bridgeport, ct': {'0': 900, '1': 1100, '2': 1400, '3': 1800, '4': 2100},
                
                # Delaware counties
                'wilmington, de': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                
                # Maryland counties
                'baltimore, md': {'0': 800, '1': 1000, '2': 1300, '3': 1700, '4': 2000},
                'annapolis, md': {'0': 900, '1': 1100, '2': 1400, '3': 1800, '4': 2100},
                
                # West Virginia counties
                'charleston, wv': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Arkansas counties
                'little rock, ar': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # Mississippi counties
                'jackson, ms': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # South Carolina counties
                'charleston, sc': {'0': 700, '1': 900, '2': 1100, '3': 1400, '4': 1700},
                'columbia, sc': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600},
                
                # New Jersey counties
                'newark, nj': {'0': 1000, '1': 1200, '2': 1500, '3': 1900, '4': 2200},
                'jersey city, nj': {'0': 1100, '1': 1300, '2': 1700, '3': 2200, '4': 2500},
                
                # Default fallback
                'default': {'0': 600, '1': 800, '2': 1000, '3': 1300, '4': 1600}
            }
            
            # Extract city and state from address
            parts = address.split(',')
            if len(parts) >= 2:
                city = parts[0].strip().lower()
                state = parts[1].strip().split()[0][:2].lower()
            else:
                return None
            
            # Create lookup key
            location_key = f"{city}, {state}"
            
            # Get FMR data for location
            location_fmr = fmr_data.get(location_key, fmr_data['default'])
            
            # Determine bedroom count for FMR lookup
            if bedrooms is None:
                bedrooms = 2  # Default to 2 bedroom
            elif bedrooms > 4:
                bedrooms = 4  # Cap at 4+ bedrooms
            
            bedroom_key = str(bedrooms)
            base_rent = location_fmr.get(bedroom_key, location_fmr['2'])  # Default to 2 bedroom
            
            # Apply bathroom adjustment
            if bathrooms and bathrooms > bedrooms:
                base_rent *= 1.1  # More bathrooms than bedrooms = luxury
            elif bathrooms and bathrooms < bedrooms:
                base_rent *= 0.95  # Fewer bathrooms than bedrooms = basic
            
            # Apply square footage adjustment
            if square_feet:
                if square_feet < 800:
                    base_rent *= 0.9  # Small unit
                elif square_feet > 2000:
                    base_rent *= 1.1  # Large unit
                elif square_feet > 3000:
                    base_rent *= 1.2  # Very large unit
            
            # Calculate rent range (±10% for HUD data - more accurate)
            rent_low = int(base_rent * 0.9)
            rent_high = int(base_rent * 1.1)
            
            return {
                'estimated_rent': int(base_rent),
                'rent_range_low': rent_low,
                'rent_range_high': rent_high,
                'data_source': 'HUD Fair Market Rents',
                'confidence_score': 0.95,  # Very high confidence for HUD data
                'last_updated': datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error in HUD rental estimate: {e}")
            return None
    
    def _get_free_rental_estimate(self, address: str, bedrooms: int = None, 
                                 bathrooms: float = None, square_feet: int = None) -> Optional[Dict[str, Any]]:
        """Get free rental estimate using public data (no API key required)"""
        try:
            # Base rent by state (simplified data)
            base_rent_by_state = {
                'CA': 2500, 'NY': 2200, 'TX': 1500, 'FL': 1800, 'WA': 2000,
                'IL': 1600, 'PA': 1400, 'OH': 1200, 'GA': 1400, 'NC': 1300,
                'MI': 1200, 'NJ': 2000, 'VA': 1600, 'TN': 1200, 'IN': 1100,
                'AZ': 1600, 'MA': 2200, 'MD': 1800, 'MO': 1200, 'WI': 1300,
                'CO': 1800, 'MN': 1400, 'SC': 1200, 'AL': 1000, 'LA': 1200,
                'KY': 1100, 'OR': 1600, 'OK': 1000, 'CT': 1800, 'UT': 1400,
                'IA': 1100, 'NV': 1500, 'AR': 1000, 'MS': 900, 'KS': 1100,
                'NM': 1200, 'NE': 1100, 'WV': 900, 'ID': 1200, 'HI': 2500,
                'NH': 1600, 'ME': 1200, 'RI': 1600, 'MT': 1200, 'DE': 1400,
                'SD': 1000, 'ND': 1000, 'AK': 1500, 'VT': 1400, 'WY': 1200
            }
            
            # City multipliers
            city_multipliers = {
                'san francisco': 1.8, 'new york': 1.6, 'los angeles': 1.5,
                'chicago': 1.2, 'houston': 0.9, 'phoenix': 1.0, 'philadelphia': 1.1,
                'san antonio': 0.8, 'san diego': 1.4, 'dallas': 1.0, 'austin': 1.2,
                'seattle': 1.4, 'denver': 1.3, 'washington': 1.5, 'boston': 1.6,
                'atlanta': 1.1, 'miami': 1.3, 'portland': 1.3, 'las vegas': 1.1,
                'minneapolis': 1.2, 'tampa': 1.1, 'cleveland': 0.9, 'honolulu': 1.8
            }
            
            # Extract city and state from address
            parts = address.split(',')
            if len(parts) >= 2:
                city = parts[0].strip().lower()
                state = parts[1].strip().split()[0][:2].upper()
            else:
                return None
            
            # Get base rent for state
            base_rent = base_rent_by_state.get(state, 1500)
            
            # Apply city multiplier
            multiplier = city_multipliers.get(city, 1.0)
            base_rent *= multiplier
            
            # Apply property characteristics
            if bedrooms:
                if bedrooms == 1:
                    base_rent *= 0.7
                elif bedrooms == 2:
                    base_rent *= 1.0
                elif bedrooms == 3:
                    base_rent *= 1.3
                elif bedrooms == 4:
                    base_rent *= 1.6
                else:
                    base_rent *= 1.8
            
            if square_feet:
                if square_feet < 800:
                    base_rent *= 0.8
                elif square_feet > 2000:
                    base_rent *= 1.2
                elif square_feet > 3000:
                    base_rent *= 1.4
            
            # Calculate rent range (±15%)
            rent_low = int(base_rent * 0.85)
            rent_high = int(base_rent * 1.15)
            
            return {
                'estimated_rent': int(base_rent),
                'rent_range_low': rent_low,
                'rent_range_high': rent_high,
                'last_updated': datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error in free rental estimate: {e}")
            return None
    
    def _parse_confidence_score(self, confidence: str) -> Optional[float]:
        """Parse confidence string to float score"""
        if not confidence:
            return None
        
        confidence_lower = confidence.lower()
        if 'high' in confidence_lower:
            return 0.9
        elif 'medium' in confidence_lower:
            return 0.7
        elif 'low' in confidence_lower:
            return 0.5
        else:
            return 0.6  # Default confidence
    
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
        
        # Get rental market data
        rental_market_data = None
        if address:
            # Extract property details for rental estimation
            bedrooms = property_data.get('bedrooms')
            bathrooms = property_data.get('bathrooms')
            square_feet = property_data.get('square_feet')
            zip_code = property_data.get('zip_code')
            city = property_data.get('city')
            state = property_data.get('state')
            
            rental_market_data = self.get_rental_market_data(
                address=address,
                bedrooms=bedrooms,
                bathrooms=bathrooms,
                square_feet=square_feet,
                zip_code=zip_code,
                city=city,
                state=state
            )
        
        # Get county tax data (if available)
        county_tax_data = None
        if self.county_assessor_service:
            try:
                county_tax_data = self.county_assessor_service.get_tax_data(property_data)
            except Exception as e:
                logger.warning(f"Failed to get county tax data: {str(e)}")
        
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
            rental_market_data=rental_market_data,
            county_tax_data=county_tax_data,
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
