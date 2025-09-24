import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import json
import uuid
from typing import Dict, List, Dict, Optional, Union, Any, Union
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import re
import time
from urllib.parse import urlencode, urljoin
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from concurrent.futures import ThreadPoolExecutor, as_completed
from json import JSONDecodeError
from models import PropertyData, Property, Address, Description, PropertyType, ListingType, SearchPropertyType, ReturnType, HomeFlags, PetPolicy, OpenHouse, Unit, HomeMonthlyFee, HomeOneTimeFee, HomeParkingDetails, PropertyDetails, Popularity, TaxRecord, PropertyEstimate, HomeEstimates, Advertisers, Agent, Office, Broker, Builder
from parsers import (
    parse_address, parse_description, parse_open_houses, parse_units,
    parse_tax_record, parse_estimates, parse_neighborhoods, calculate_days_on_mls
)
from processors import process_property, process_extra_property_details, get_key
from queries import HOMES_DATA, SEARCH_HOMES_DATA, GENERAL_RESULTS_QUERY, HOME_FRAGMENT
from enhanced_scraper import EnhancedScraper, ScraperInput
from exceptions import AuthenticationError, ScrapingError, ValidationError, RateLimitError

logger = logging.getLogger(__name__)

@dataclass
class PropertyAddress:
    street: str
    city: str
    state: str
    zip_code: str
    
    @property
    def formatted_address(self) -> str:
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}"

@dataclass
class PropertyDescription:
    beds: int
    full_baths: int
    half_baths: int
    sqft: int
    year_built: int
    stories: int
    garage: int
    lot_sqft: int
    style: str
    property_type: str

@dataclass
class PropertyAgent:
    name: str
    email: str
    phone: str
    company: str
    license: str

class DreameryPropertyScraper:
    SEARCH_GQL_URL = "https://www.realtor.com/api/v1/rdc_search_srp?client_id=rdc-search-new-communities&schema=vesta"
    PROPERTY_URL = "https://www.realtor.com/realestateandhomes-detail/"
    PROPERTY_GQL = "https://graph.realtor.com/graphql"
    ADDRESS_AUTOCOMPLETE_URL = "https://parser-external.geo.moveaws.com/suggest"
    NUM_PROPERTY_WORKERS = 20
    DEFAULT_PAGE_SIZE = 200

    def __init__(self, use_enhanced_session: bool = True):
        if use_enhanced_session:
            # Use enhanced session management
            self.session = requests.Session()
            retries = Retry(
                total=3, 
                backoff_factor=4, 
                status_forcelist=[429, 403], 
                allowed_methods=frozenset(["GET", "POST"])
            )
            adapter = HTTPAdapter(max_retries=retries)
            self.session.mount("http://", adapter)
            self.session.mount("https://", adapter)
            self.session.headers.update({
                "accept": "application/json, text/javascript",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "origin": "https://www.realtor.com",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "rdc-ab-tests": "commute_travel_time_variation:v1",
                "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            })
        else:
            # Use legacy session management
            self.session = requests.Session()
            self.session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            })
        
        self.base_url = "https://www.realtor.com"
        self.api_base = "https://www.realtor.com/api/v1"
        self.access_token = None

    def get_access_token(self) -> str:
        """Get access token for Realtor.com API"""
        if self.access_token:
            return self.access_token
            
        device_id = str(uuid.uuid4()).upper()

        response = requests.post(
            "https://graph.realtor.com/auth/token",
            headers={
                "Host": "graph.realtor.com",
                "Accept": "*/*",
                "Content-Type": "Application/json",
                "X-Client-ID": "rdc_mobile_native,iphone",
                "X-Visitor-ID": device_id,
                "X-Client-Version": "24.21.23.679885",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Realtor.com/24.21.23.679885 CFNetwork/1494.0.7 Darwin/23.4.0",
            },
            data=json.dumps({
                "grant_type": "device_mobile",
                "device_id": device_id,
                "client_app_id": "rdc_mobile_native,24.21.23.679885,iphone",
            }),
        )

        data = response.json()

        if not (access_token := data.get("access_token")):
            raise AuthenticationError(
                "Failed to get access token, use a proxy/vpn or wait a moment and try again.", 
                response=response
            )

        self.access_token = access_token
        return access_token

    @classmethod
    def from_scraper_input(cls, scraper_input: ScraperInput) -> 'DreameryPropertyScraper':
        """Create scraper instance from Pydantic ScraperInput"""
        scraper = cls(use_enhanced_session=True)
        
        # Set properties from scraper input
        scraper.location = scraper_input.location
        scraper.listing_type = scraper_input.listing_type
        scraper.property_type = scraper_input.property_type
        scraper.radius = scraper_input.radius
        scraper.last_x_days = scraper_input.last_x_days
        scraper.mls_only = scraper_input.mls_only
        scraper.date_from = scraper_input.date_from
        scraper.date_to = scraper_input.date_to
        scraper.foreclosure = scraper_input.foreclosure
        scraper.extra_property_data = scraper_input.extra_property_data
        scraper.exclude_pending = scraper_input.exclude_pending
        scraper.limit = scraper_input.limit
        scraper.return_type = scraper_input.return_type
        
        # Set proxy if provided
        if scraper_input.proxy:
            proxy_url = scraper_input.proxy
            proxies = {"http": proxy_url, "https": proxy_url}
            scraper.session.proxies.update(proxies)
        
        return scraper
    
    def search_properties(self, 
                         location: str = "San Francisco, CA",
                         listing_type: str = "for_sale",
                         property_types: Optional[List[str]] = None,
                         min_price: Optional[int] = None,
                         max_price: Optional[int] = None,
                         beds: Optional[int] = None,
                         baths: Optional[int] = None,
                         sqft_min: Optional[int] = None,
                         sqft_max: Optional[int] = None,
                         radius: Optional[float] = None,
                         past_days: Optional[int] = None,
                         limit: int = 50) -> List[Dict[str, Any]]:
        """
        Search for properties using Realtor.com API
        """
        try:
            # Map listing types
            listing_type_map = {
                'for_sale': 'for_sale',
                'for_rent': 'for_rent',
                'sold': 'sold',
                'pending': 'pending'
            }
            
            # Get location info
            location_info = self._handle_location(location)
            if not location_info:
                logger.error(f"Could not find location: {location}")
                return []
            
            # Build search variables
            search_variables = self._build_search_variables(
                location_info, listing_type_map.get(listing_type, 'for_sale'),
                property_types, min_price, max_price, beds, baths, 
                sqft_min, sqft_max, radius, past_days, limit
            )
            
            # Determine search type
            search_type = self._determine_search_type(location_info, radius)
            
            # Perform search
            if search_type == "single_property":
                return self._handle_single_property(location_info)
            else:
                return self._perform_general_search(search_variables, search_type, limit)
                
        except Exception as e:
            logger.error(f"Property search failed: {e}")
            return []

    def search_properties_advanced(self, 
                                 location: str = "San Francisco, CA",
                                 listing_type: str = "for_sale",
                                 property_types: Optional[List[str]] = None,
                                 min_price: Optional[int] = None,
                                 max_price: Optional[int] = None,
                                 beds: Optional[int] = None,
                                 baths: Optional[int] = None,
                                 sqft_min: Optional[int] = None,
                                 sqft_max: Optional[int] = None,
                                 radius: Optional[float] = None,
                                 past_days: Optional[int] = None,
                                 limit: int = 50,
                                 mls_only: bool = False,
                                 extra_property_data: bool = False,
                                 exclude_pending: bool = False) -> List[Property]:
        """
        Advanced property search using the new processors for comprehensive data extraction
        """
        try:
            # Map listing types
            listing_type_map = {
                'for_sale': ListingType.FOR_SALE,
                'for_rent': ListingType.FOR_RENT,
                'sold': ListingType.SOLD,
                'pending': ListingType.PENDING
            }
            
            # Get location info
            location_info = self._handle_location(location)
            if not location_info:
                logger.error(f"Could not find location: {location}")
                return []
            
            # Build search variables
            search_variables = self._build_search_variables(
                location_info, listing_type_map.get(listing_type, ListingType.FOR_SALE),
                property_types, min_price, max_price, beds, baths, 
                sqft_min, sqft_max, radius, past_days, limit
            )
            
            # Determine search type
            search_type = self._determine_search_type(location_info, radius)
            
            # Perform search
            if search_type == "single_property":
                properties = self._handle_single_property(location_info)
            else:
                properties = self._perform_general_search(search_variables, search_type, limit)
            
            # Process properties using the new processors
            processed_properties = []
            for prop in properties:
                processed_prop = self._process_property_with_processors(
                    prop,
                    mls_only=mls_only,
                    extra_property_data=extra_property_data,
                    exclude_pending=exclude_pending,
                    listing_type=listing_type_map.get(listing_type, ListingType.FOR_SALE)
                )
                if processed_prop:
                    processed_properties.append(processed_prop)
            
            return processed_properties
                
        except Exception as e:
            logger.error(f"Advanced property search failed: {e}")
            return []

    def search_properties_comprehensive(self, 
                                      location: str = "San Francisco, CA",
                                      listing_type: str = "for_sale",
                                      property_types: Optional[List[str]] = None,
                                      min_price: Optional[int] = None,
                                      max_price: Optional[int] = None,
                                      beds: Optional[int] = None,
                                      baths: Optional[int] = None,
                                      sqft_min: Optional[int] = None,
                                      sqft_max: Optional[int] = None,
                                      radius: Optional[float] = None,
                                      past_days: Optional[int] = None,
                                      limit: int = 50,
                                      mls_only: bool = False,
                                      extra_property_data: bool = True,
                                      exclude_pending: bool = False) -> List[Property]:
        """
        Comprehensive property search using enhanced GraphQL queries for maximum data extraction
        """
        try:
            # Map listing types
            listing_type_map = {
                'for_sale': ListingType.FOR_SALE,
                'for_rent': ListingType.FOR_RENT,
                'sold': ListingType.SOLD,
                'pending': ListingType.PENDING
            }
            
            # Get location info
            location_info = self._handle_location(location)
            if not location_info:
                logger.error(f"Could not find location: {location}")
                return []
            
            # Build search variables
            search_variables = self._build_search_variables(
                location_info, listing_type_map.get(listing_type, ListingType.FOR_SALE),
                property_types, min_price, max_price, beds, baths, 
                sqft_min, sqft_max, radius, past_days, limit
            )
            
            # Determine search type
            search_type = self._determine_search_type(location_info, radius)
            
            # Perform search with enhanced queries
            if search_type == "single_property":
                properties = self._handle_single_property(location_info)
            else:
                properties = self._perform_general_search(search_variables, search_type, limit)
            
            # Process properties using the new processors with comprehensive data
            processed_properties = []
            for prop in properties:
                processed_prop = self._process_property_with_processors(
                    prop,
                    mls_only=mls_only,
                    extra_property_data=extra_property_data,
                    exclude_pending=exclude_pending,
                    listing_type=listing_type_map.get(listing_type, ListingType.FOR_SALE)
                )
                if processed_prop:
                    processed_properties.append(processed_prop)
            
            return processed_properties
                
        except Exception as e:
            logger.error(f"Comprehensive property search failed: {e}")
            return []
    
    def _handle_location(self, location: str) -> Optional[Dict[str, Any]]:
        """Handle location lookup using Realtor.com API"""
        params = {
            "input": location,
            "client_id": "rdc-search-new-communities",
            "limit": "1",
            "area_types": "city,state,county,postal_code,address,street,neighborhood,school,school_district,university,park",
        }

        try:
            response = self.session.get(self.ADDRESS_AUTOCOMPLETE_URL, params=params)
            response_json = response.json()
            result = response_json["autocomplete"]
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Location lookup failed: {e}")
            return None
    
    def _build_search_variables(self, location_info: Dict[str, Any], listing_type: str,
                               property_types: Optional[List[str]], min_price: Optional[int],
                               max_price: Optional[int], beds: Optional[int], baths: Optional[int],
                               sqft_min: Optional[int], sqft_max: Optional[int], radius: Optional[float],
                               past_days: Optional[int], limit: int) -> Dict[str, Any]:
        """Build search variables for GraphQL query"""
        search_variables = {"offset": 0}
        
        location_type = location_info["area_type"]
        
        if location_type == "address":
            if radius:
                coordinates = list(location_info["centroid"].values())
                search_variables.update({
                    "coordinates": coordinates,
                    "radius": f"{radius}mi",
                })
            else:
                search_variables["property_id"] = [location_info["mpr_id"]]
        elif location_type == "postal_code":
            search_variables["postal_code"] = location_info.get("postal_code")
        else:
            search_variables.update({
                "city": location_info.get("city"),
                "county": location_info.get("county"),
                "state_code": location_info.get("state_code"),
                "postal_code": location_info.get("postal_code"),
            })
        
        return search_variables
    
    def _determine_search_type(self, location_info: Dict[str, Any], radius: Optional[float]) -> str:
        """Determine the type of search to perform"""
        location_type = location_info["area_type"]
        
        if location_type == "address":
            if radius:
                return "comps"
            else:
                return "single_property"
        else:
            return "area"
    
    def _handle_single_property(self, location_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Handle single property search"""
        property_id = location_info["mpr_id"]
        return self._get_property_details(property_id)
    
    def _get_property_details(self, property_id: str) -> List[Dict[str, Any]]:
        """Get details for a single property using enhanced query template"""
        query = f"""
        query Home($property_id: ID!) {{
            home(property_id: $property_id) {HOMES_DATA}
        }}
        """
        
        variables = {"property_id": property_id}
        payload = {"query": query, "variables": variables}
        
        try:
            response = self.session.post(self.SEARCH_GQL_URL, json=payload)
            response_json = response.json()
            
            if "data" in response_json and response_json["data"]["home"]:
                property_data = response_json["data"]["home"]
                return [self._format_property_for_dreamery(property_data)]
            else:
                return []
        except Exception as e:
            logger.error(f"Failed to get property details: {e}")
            return []
    
    def _perform_general_search(self, search_variables: Dict[str, Any], 
                               search_type: str, limit: int) -> List[Dict[str, Any]]:
        """Perform general property search"""
        query = self._build_search_query(search_type)
        payload = {"query": query, "variables": search_variables}
        
        try:
            response = self.session.post(self.SEARCH_GQL_URL, json=payload)
            response_json = response.json()
            
            search_key = "home_search" if "home_search" in query else "property_search"
            
            if (response_json is None or "data" not in response_json or 
                response_json["data"] is None or search_key not in response_json["data"] or
                response_json["data"][search_key] is None or 
                "results" not in response_json["data"][search_key]):
                return []
            
            properties_list = response_json["data"][search_key]["results"]
            total_properties = response_json["data"][search_key]["total"]
            
            # Limit results
            properties_list = properties_list[:limit]
            
            # Format properties for Dreamery
            formatted_properties = []
            for prop in properties_list:
                formatted_prop = self._format_property_for_dreamery(prop)
                formatted_properties.append(formatted_prop)
            
            return formatted_properties
            
        except Exception as e:
            logger.error(f"General search failed: {e}")
            return []
    
    def _build_search_query(self, search_type: str) -> str:
        """Build GraphQL query based on search type using enhanced query templates"""
        if search_type == "comps":
            return f"""
            query Property_search($coordinates: [Float]!, $radius: String!, $offset: Int!) {{
                home_search(
                    query: {{
                        nearby: {{
                            coordinates: $coordinates
                            radius: $radius
                        }}
                        status: for_sale
                    }}
                    limit: 200
                    offset: $offset
                ) {{
                    total
                    results {SEARCH_HOMES_DATA}
                }}
            }}
            """
        else:  # area search
            return f"""
            query Home_search($city: String, $county: [String], $state_code: String, 
                            $postal_code: String, $offset: Int) {{
                home_search(
                    query: {{
                        city: $city
                        county: $county
                        postal_code: $postal_code
                        state_code: $state_code
                        status: for_sale
                    }}
                    limit: 200
                    offset: $offset
                ) {{
                    total
                    results {SEARCH_HOMES_DATA}
                }}
            }}
            """
    
    def _process_property_with_processors(self, prop: Dict[str, Any], 
                                        mls_only: bool = False, 
                                        extra_property_data: bool = False,
                                        exclude_pending: bool = False,
                                        listing_type: ListingType = ListingType.FOR_SALE) -> Union[Property, None]:
        """Process property using the new processors for comprehensive data extraction"""
        try:
            return process_property(
                prop,
                mls_only=mls_only,
                extra_property_data=extra_property_data,
                exclude_pending=exclude_pending,
                listing_type=listing_type,
                get_key_func=get_key,
                process_extra_property_details_func=process_extra_property_details
            )
        except Exception as e:
            logger.error(f"Error processing property with processors: {e}")
            return None

    def _format_property_for_dreamery(self, prop: Dict[str, Any]) -> Property:
        """Format property for Dreamery frontend using new parsers"""
        try:
            # Parse address using the new parser
            address = parse_address(prop, "general_search")
            
            # Parse description using the new parser
            description = parse_description(prop)
            
            # Parse other data using parsers
            open_houses = parse_open_houses(prop.get('open_houses'))
            units = parse_units(prop.get('units'))
            tax_record = parse_tax_record(prop.get('tax_record'))
            estimates = parse_estimates(prop.get('estimates'))
            neighborhoods = parse_neighborhoods(prop)
            days_on_mls = calculate_days_on_mls(prop)
            
            # Convert dates to ISO strings for JSON serialization
            last_sold_date = None
            if prop.get('last_sold_date'):
                try:
                    last_sold_date = datetime.strptime(prop['last_sold_date'], "%Y-%m-%d").isoformat()
                except (ValueError, TypeError):
                    last_sold_date = None
            
            list_date = None
            if prop.get('list_date'):
                try:
                    list_date = datetime.strptime(prop['list_date'], "%Y-%m-%d").isoformat()
                except (ValueError, TypeError):
                    list_date = None
            
            # Create proper Property model with complex nested structures
            return Property(
                property_url=prop.get('href', 'https://realtor.com'),
                property_id=prop.get('property_id', ''),
                listing_id=prop.get('listing_id'),
                permalink=prop.get('permalink'),
                mls=prop.get('mls'),
                mls_id=prop.get('mls_id'),
                status=prop.get('status'),
                address=address,
                list_price=prop.get('list_price'),
                list_price_min=prop.get('list_price_min'),
                list_price_max=prop.get('list_price_max'),
                list_date=list_date,
                pending_date=prop.get('pending_date'),
                last_sold_date=last_sold_date,
                prc_sqft=prop.get('prc_sqft'),
                new_construction=prop.get('new_construction'),
                hoa_fee=prop.get('hoa_fee'),
                days_on_mls=days_on_mls,
                description=description,
                tags=prop.get('tags', []),
                details=prop.get('details', []),
                latitude=prop.get('coordinates', {}).get('lat') if prop.get('coordinates') else None,
                longitude=prop.get('coordinates', {}).get('lng') if prop.get('coordinates') else None,
                neighborhoods=neighborhoods,
                county=prop.get('county'),
                fips_code=prop.get('fips_code'),
                nearby_schools=prop.get('nearby_schools', []),
                assessed_value=prop.get('assessed_value'),
                estimated_value=prop.get('estimated_value'),
                tax=prop.get('tax'),
                tax_history=prop.get('tax_history', []),
                mls_status=prop.get('mls_status'),
                last_sold_price=prop.get('last_sold_price'),
                open_houses=open_houses,
                pet_policy=prop.get('pet_policy'),
                units=units,
                monthly_fees=prop.get('monthly_fees'),
                one_time_fees=prop.get('one_time_fees', []),
                parking=prop.get('parking'),
                terms=prop.get('terms', []),
                popularity=prop.get('popularity'),
                tax_record=tax_record,
                parcel_info=prop.get('parcel_info'),
                current_estimates=prop.get('current_estimates', []),
                estimates=estimates,
                photos=prop.get('photos', []),
                flags=prop.get('flags'),
                advertisers=Advertisers(
                    agent=Agent(
                        name=prop.get('agent', {}).get('name') if prop.get('agent') else None,
                        uuid=prop.get('agent', {}).get('uuid') if prop.get('agent') else None,
                        mls_set=prop.get('agent', {}).get('mls_set') if prop.get('agent') else None,
                        nrds_id=prop.get('agent', {}).get('nrds_id') if prop.get('agent') else None,
                        email=prop.get('agent', {}).get('email') if prop.get('agent') else None,
                        phones=prop.get('agent', {}).get('phones', []) if prop.get('agent') else None,
                        href=prop.get('agent', {}).get('href') if prop.get('agent') else None,
                        state_license=prop.get('agent', {}).get('state_license') if prop.get('agent') else None
                    ) if prop.get('agent') else None,
                    broker=Broker(
                        name=prop.get('broker', {}).get('name') if prop.get('broker') else None,
                        uuid=prop.get('broker', {}).get('uuid') if prop.get('broker') else None
                    ) if prop.get('broker') else None,
                    builder=Builder(
                        name=prop.get('builder', {}).get('name') if prop.get('builder') else None,
                        uuid=prop.get('builder', {}).get('uuid') if prop.get('builder') else None
                    ) if prop.get('builder') else None,
                    office=Office(
                        name=prop.get('office', {}).get('name') if prop.get('office') else None,
                        uuid=prop.get('office', {}).get('uuid') if prop.get('office') else None,
                        mls_set=prop.get('office', {}).get('mls_set') if prop.get('office') else None,
                        email=prop.get('office', {}).get('email') if prop.get('office') else None,
                        phones=prop.get('office', {}).get('phones', []) if prop.get('office') else None,
                        href=prop.get('office', {}).get('href') if prop.get('office') else None
                    ) if prop.get('office') else None
                ) if any([prop.get('agent'), prop.get('broker'), prop.get('builder'), prop.get('office')]) else None
            )
        except Exception as e:
            logger.error(f"Error formatting property: {e}")
            # Return a basic Property object if parsing fails
            return Property(
                property_url=prop.get('href', 'https://realtor.com'),
                property_id=prop.get('property_id', ''),
                listing_id=prop.get('listing_id'),
                permalink=prop.get('permalink'),
                mls=prop.get('mls'),
                mls_id=prop.get('mls_id'),
                status=prop.get('status'),
                address=Address(
                    full_line=prop.get('address', {}).get('line', '') if prop.get('address') else '',
                    city=prop.get('address', {}).get('city') if prop.get('address') else None,
                    state=prop.get('address', {}).get('state') if prop.get('address') else None,
                    zip=prop.get('address', {}).get('postal_code') if prop.get('address') else None
                ) if prop.get('address') else None,
                list_price=prop.get('list_price'),
                list_price_min=prop.get('list_price_min'),
                list_price_max=prop.get('list_price_max'),
                list_date=prop.get('list_date'),
                pending_date=prop.get('pending_date'),
                last_sold_date=prop.get('last_sold_date'),
                prc_sqft=prop.get('prc_sqft'),
                new_construction=prop.get('new_construction'),
                hoa_fee=prop.get('hoa_fee'),
                days_on_mls=prop.get('days_on_mls'),
                description=Description(
                    beds=prop.get('beds'),
                    baths_full=prop.get('baths'),
                    sqft=prop.get('sqft'),
                    lot_sqft=prop.get('lot_sqft'),
                    year_built=prop.get('year_built'),
                    garage=prop.get('garage'),
                    text=prop.get('description'),
                    type=prop.get('property_type')
                ) if any([prop.get('beds'), prop.get('baths'), prop.get('sqft')]) else None,
                tags=prop.get('tags', []),
                details=prop.get('details', []),
                latitude=prop.get('coordinates', {}).get('lat') if prop.get('coordinates') else None,
                longitude=prop.get('coordinates', {}).get('lng') if prop.get('coordinates') else None,
                neighborhoods=prop.get('neighborhoods'),
                county=prop.get('county'),
                fips_code=prop.get('fips_code'),
                nearby_schools=prop.get('nearby_schools', []),
                assessed_value=prop.get('assessed_value'),
                estimated_value=prop.get('estimated_value'),
                tax=prop.get('tax'),
                tax_history=prop.get('tax_history', []),
                mls_status=prop.get('mls_status'),
                last_sold_price=prop.get('last_sold_price'),
                open_houses=prop.get('open_houses', []),
                pet_policy=prop.get('pet_policy'),
                units=prop.get('units', []),
                monthly_fees=prop.get('monthly_fees'),
                one_time_fees=prop.get('one_time_fees', []),
                parking=prop.get('parking'),
                terms=prop.get('terms', []),
                popularity=prop.get('popularity'),
                tax_record=prop.get('tax_record'),
                parcel_info=prop.get('parcel_info'),
                current_estimates=prop.get('current_estimates', []),
                estimates=prop.get('estimates'),
                photos=prop.get('photos', []),
                flags=prop.get('flags'),
                advertisers=Advertisers(
                    agent=Agent(
                        name=prop.get('agent', {}).get('name') if prop.get('agent') else None,
                        uuid=prop.get('agent', {}).get('uuid') if prop.get('agent') else None,
                        mls_set=prop.get('agent', {}).get('mls_set') if prop.get('agent') else None,
                        nrds_id=prop.get('agent', {}).get('nrds_id') if prop.get('agent') else None,
                        email=prop.get('agent', {}).get('email') if prop.get('agent') else None,
                        phones=prop.get('agent', {}).get('phones', []) if prop.get('agent') else None,
                        href=prop.get('agent', {}).get('href') if prop.get('agent') else None,
                        state_license=prop.get('agent', {}).get('state_license') if prop.get('agent') else None
                    ) if prop.get('agent') else None,
                    office=Office(
                        name=prop.get('office', {}).get('name') if prop.get('office') else None,
                        uuid=prop.get('office', {}).get('uuid') if prop.get('office') else None,
                        mls_set=prop.get('office', {}).get('mls_set') if prop.get('office') else None,
                        email=prop.get('office', {}).get('email') if prop.get('office') else None,
                        phones=prop.get('office', {}).get('phones', []) if prop.get('office') else None,
                        href=prop.get('office', {}).get('href') if prop.get('office') else None
                    ) if prop.get('office') else None
                ) if any([prop.get('agent'), prop.get('office')]) else None
            )
