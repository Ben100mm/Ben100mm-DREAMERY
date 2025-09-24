import requests
from bs4 import BeautifulSoup
import json
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import re
import time
from urllib.parse import urlencode, urljoin
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from concurrent.futures import ThreadPoolExecutor, as_completed
from json import JSONDecodeError

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

    def __init__(self):
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
        """Get details for a single property"""
        query = """
        query Home($property_id: ID!) {
            home(property_id: $property_id) {
                property_id
                listing_id
                status
                list_price
                beds
                baths
                sqft
                address {
                    street
                    city
                    state
                    postal_code
                }
                photos {
                    href
                }
                agent {
                    name
                    email
                    phone
                }
                office {
                    name
                }
            }
        }
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
        """Build GraphQL query based on search type"""
        if search_type == "comps":
            return """
            query Property_search($coordinates: [Float]!, $radius: String!, $offset: Int!) {
                home_search(
                    query: {
                        nearby: {
                            coordinates: $coordinates
                            radius: $radius
                        }
                        status: for_sale
                    }
                    limit: 200
                    offset: $offset
                ) {
                    total
                    results {
                        property_id
                        listing_id
                        status
                        list_price
                        beds
                        baths
                        sqft
                        address {
                            street
                            city
                            state
                            postal_code
                        }
                        photos {
                            href
                        }
                        agent {
                            name
                            email
                            phone
                        }
                        office {
                            name
                        }
                    }
                }
            }
            """
        else:  # area search
            return """
            query Home_search($city: String, $county: [String], $state_code: String, 
                            $postal_code: String, $offset: Int) {
                home_search(
                    query: {
                        city: $city
                        county: $county
                        postal_code: $postal_code
                        state_code: $state_code
                        status: for_sale
                    }
                    limit: 200
                    offset: $offset
                ) {
                    total
                    results {
                        property_id
                        listing_id
                        status
                        list_price
                        beds
                        baths
                        sqft
                        address {
                            street
                            city
                            state
                            postal_code
                        }
                        photos {
                            href
                        }
                        agent {
                            name
                            email
                            phone
                        }
                        office {
                            name
                        }
                    }
                }
            }
            """
    
    def _format_property_for_dreamery(self, prop: Dict[str, Any]) -> Dict[str, Any]:
        """Format property for Dreamery frontend"""
        address = prop.get('address', {})
        price = prop.get('list_price', 0)
        photos = prop.get('photos', [])
        agent = prop.get('agent', {})
        office = prop.get('office', {})
        
        return {
            'id': prop.get('property_id', ''),
            'price': f"${price:,}" if price else "Price not available",
            'address': f"{address.get('street', '')}, {address.get('city', '')}, {address.get('state', '')} {address.get('postal_code', '')}".strip(', '),
            'beds': prop.get('beds', 0),
            'baths': prop.get('baths', 0),
            'sqft': prop.get('sqft', 0),
            'type': 'House',  # Default type
            'daysOnMarket': 0,  # Not available in basic query
            'image': photos[0]['href'] if photos else 'P1',
            'mls': '',  # Not available in basic query
            'mls_id': prop.get('listing_id', ''),
            'status': prop.get('status', 'active'),
            'list_price': price,
            'price_per_sqft': price / prop.get('sqft', 1) if prop.get('sqft', 0) > 0 else 0,
            'photos': [photo['href'] for photo in photos],
            'agent': {
                'name': agent.get('name', ''),
                'email': agent.get('email', ''),
                'phone': agent.get('phone', ''),
                'company': office.get('name', '')
            },
            'coordinates': {
                'lat': 0,  # Not available in basic query
                'lng': 0
            }
        }
