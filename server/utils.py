"""
Utility functions for data processing and validation
"""

import pandas as pd
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import re


def process_result(result: Any) -> pd.DataFrame:
    """Process a single property result into a pandas DataFrame"""
    if not hasattr(result, 'property_id'):
        return pd.DataFrame()
    
    # Convert Property to dictionary for DataFrame creation
    property_dict = {
        'property_id': getattr(result, 'property_id', None),
        'property_url': str(getattr(result, 'property_url', '')) if hasattr(result, 'property_url') else None,
        'listing_id': getattr(result, 'listing_id', None),
        'mls': getattr(result, 'mls', None),
        'mls_id': getattr(result, 'mls_id', None),
        'status': getattr(result, 'status', None),
        'list_price': getattr(result, 'list_price', None),
        'list_price_min': getattr(result, 'list_price_min', None),
        'list_price_max': getattr(result, 'list_price_max', None),
        'list_date': getattr(result, 'list_date', None),
        'pending_date': getattr(result, 'pending_date', None),
        'last_sold_date': getattr(result, 'last_sold_date', None),
        'prc_sqft': getattr(result, 'prc_sqft', None),
        'new_construction': getattr(result, 'new_construction', None),
        'hoa_fee': getattr(result, 'hoa_fee', None),
        'days_on_mls': getattr(result, 'days_on_mls', None),
        'latitude': getattr(result, 'latitude', None),
        'longitude': getattr(result, 'longitude', None),
        'neighborhoods': getattr(result, 'neighborhoods', None),
        'county': getattr(result, 'county', None),
        'fips_code': getattr(result, 'fips_code', None),
        'nearby_schools': getattr(result, 'nearby_schools', None),
        'assessed_value': getattr(result, 'assessed_value', None),
        'estimated_value': getattr(result, 'estimated_value', None),
        'tax': getattr(result, 'tax', None),
        'mls_status': getattr(result, 'mls_status', None),
        'last_sold_price': getattr(result, 'last_sold_price', None),
        'tags': getattr(result, 'tags', None),
    }
    
    # Add address fields
    address = getattr(result, 'address', None)
    if address:
        property_dict.update({
            'address_full_line': getattr(address, 'full_line', None),
            'address_street': getattr(address, 'street', None),
            'address_unit': getattr(address, 'unit', None),
            'address_city': getattr(address, 'city', None),
            'address_state': getattr(address, 'state', None),
            'address_zip': getattr(address, 'zip', None),
            'address_formatted': getattr(address, 'formatted_address', None),
        })
    
    # Add description fields
    description = getattr(result, 'description', None)
    if description:
        property_dict.update({
            'beds': getattr(description, 'beds', None),
            'baths_full': getattr(description, 'baths_full', None),
            'baths_half': getattr(description, 'baths_half', None),
            'sqft': getattr(description, 'sqft', None),
            'lot_sqft': getattr(description, 'lot_sqft', None),
            'sold_price': getattr(description, 'sold_price', None),
            'year_built': getattr(description, 'year_built', None),
            'garage': getattr(description, 'garage', None),
            'stories': getattr(description, 'stories', None),
            'property_type': getattr(description, 'type', None),
            'property_style': getattr(description, 'style', None),
        })
    
    # Add advertiser fields
    advertisers = getattr(result, 'advertisers', None)
    if advertisers:
        agent = getattr(advertisers, 'agent', None)
        if agent:
            property_dict.update({
                'agent_name': getattr(agent, 'name', None),
                'agent_email': getattr(agent, 'email', None),
                'agent_phone': getattr(agent, 'phones', [None])[0] if getattr(agent, 'phones', None) else None,
                'agent_license': getattr(agent, 'state_license', None),
            })
        
        broker = getattr(advertisers, 'broker', None)
        if broker:
            property_dict['broker_name'] = getattr(broker, 'name', None)
        
        office = getattr(advertisers, 'office', None)
        if office:
            property_dict.update({
                'office_name': getattr(office, 'name', None),
                'office_email': getattr(office, 'email', None),
            })
    
    return pd.DataFrame([property_dict])


def ordered_properties() -> List[str]:
    """Return ordered list of property fields for consistent DataFrame columns"""
    return [
        'property_id', 'property_url', 'listing_id', 'mls', 'mls_id', 'status',
        'list_price', 'list_price_min', 'list_price_max', 'list_date', 'pending_date',
        'last_sold_date', 'prc_sqft', 'new_construction', 'hoa_fee', 'days_on_mls',
        'address_full_line', 'address_street', 'address_unit', 'address_city',
        'address_state', 'address_zip', 'address_formatted', 'latitude', 'longitude',
        'neighborhoods', 'county', 'fips_code', 'beds', 'baths_full', 'baths_half',
        'sqft', 'lot_sqft', 'sold_price', 'year_built', 'garage', 'stories',
        'property_type', 'property_style', 'nearby_schools', 'assessed_value',
        'estimated_value', 'tax', 'mls_status', 'last_sold_price', 'tags',
        'agent_name', 'agent_email', 'agent_phone', 'agent_license', 'broker_name',
        'office_name', 'office_email'
    ]


def validate_input(listing_type: str) -> None:
    """Validate listing type input"""
    valid_types = ["for_sale", "for_rent", "sold", "pending"]
    if listing_type.lower() not in valid_types:
        raise ValueError(f"Invalid listing_type: {listing_type}. Must be one of {valid_types}")


def validate_dates(date_from: Optional[str], date_to: Optional[str]) -> None:
    """Validate date inputs"""
    if date_from and date_to:
        try:
            datetime.strptime(date_from, "%Y-%m-%d")
            datetime.strptime(date_to, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD format")
        
        if date_from > date_to:
            raise ValueError("date_from must be before date_to")


def validate_limit(limit: int) -> None:
    """Validate limit input"""
    if not isinstance(limit, int) or limit <= 0:
        raise ValueError("limit must be a positive integer")
    if limit > 10000:
        raise ValueError("limit cannot exceed 10,000")


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Clean DataFrame by replacing None values and empty strings with pd.NA"""
    return df.replace({"None": pd.NA, None: pd.NA, "": pd.NA})


def format_phone_number(phone: str) -> str:
    """Format phone number to standard format"""
    if not phone:
        return ""
    
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    # Format as (XXX) XXX-XXXX
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11 and digits[0] == '1':
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    
    return phone


def format_price(price: Optional[int]) -> str:
    """Format price with commas and dollar sign"""
    if price is None:
        return ""
    return f"${price:,}"


def format_sqft(sqft: Optional[int]) -> str:
    """Format square footage with commas"""
    if sqft is None:
        return ""
    return f"{sqft:,}"


def calculate_price_per_sqft(price: Optional[int], sqft: Optional[int]) -> Optional[float]:
    """Calculate price per square foot"""
    if price and sqft and sqft > 0:
        return round(price / sqft, 2)
    return None


def is_valid_email(email: str) -> bool:
    """Check if email is valid"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def is_valid_zip_code(zip_code: str) -> bool:
    """Check if zip code is valid (US format)"""
    pattern = r'^\d{5}(-\d{4})?$'
    return bool(re.match(pattern, zip_code))


def parse_date(date_str: str) -> Optional[datetime]:
    """Parse date string to datetime object"""
    if not date_str:
        return None
    
    formats = [
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%SZ",
        "%m/%d/%Y",
        "%m-%d-%Y"
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    return None


def days_since(date: Optional[datetime]) -> Optional[int]:
    """Calculate days since a given date"""
    if not date:
        return None
    
    return (datetime.now() - date).days


def is_recent_listing(list_date: Optional[datetime], days: int = 30) -> bool:
    """Check if listing is recent (within specified days)"""
    if not list_date:
        return False
    
    return days_since(list_date) <= days


def filter_by_price_range(properties: List[Dict[str, Any]], min_price: Optional[int], max_price: Optional[int]) -> List[Dict[str, Any]]:
    """Filter properties by price range"""
    filtered = []
    
    for prop in properties:
        price = prop.get('list_price')
        if price is None:
            continue
        
        if min_price and price < min_price:
            continue
        if max_price and price > max_price:
            continue
        
        filtered.append(prop)
    
    return filtered


def filter_by_bedrooms(properties: List[Dict[str, Any]], min_beds: Optional[int], max_beds: Optional[int]) -> List[Dict[str, Any]]:
    """Filter properties by bedroom count"""
    filtered = []
    
    for prop in properties:
        beds = prop.get('beds')
        if beds is None:
            continue
        
        if min_beds and beds < min_beds:
            continue
        if max_beds and beds > max_beds:
            continue
        
        filtered.append(prop)
    
    return filtered


def filter_by_bathrooms(properties: List[Dict[str, Any]], min_baths: Optional[float], max_baths: Optional[float]) -> List[Dict[str, Any]]:
    """Filter properties by bathroom count"""
    filtered = []
    
    for prop in properties:
        baths_full = prop.get('baths_full', 0) or 0
        baths_half = prop.get('baths_half', 0) or 0
        total_baths = baths_full + (baths_half * 0.5)
        
        if min_baths and total_baths < min_baths:
            continue
        if max_baths and total_baths > max_baths:
            continue
        
        filtered.append(prop)
    
    return filtered


def filter_by_sqft(properties: List[Dict[str, Any]], min_sqft: Optional[int], max_sqft: Optional[int]) -> List[Dict[str, Any]]:
    """Filter properties by square footage"""
    filtered = []
    
    for prop in properties:
        sqft = prop.get('sqft')
        if sqft is None:
            continue
        
        if min_sqft and sqft < min_sqft:
            continue
        if max_sqft and sqft > max_sqft:
            continue
        
        filtered.append(prop)
    
    return filtered


def sort_properties(properties: List[Dict[str, Any]], sort_by: str = 'list_price', ascending: bool = True) -> List[Dict[str, Any]]:
    """Sort properties by specified field"""
    return sorted(properties, key=lambda x: x.get(sort_by, 0), reverse=not ascending)


def get_property_summary(properties: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Get summary statistics for properties"""
    if not properties:
        return {}
    
    prices = [p.get('list_price') for p in properties if p.get('list_price')]
    sqft_values = [p.get('sqft') for p in properties if p.get('sqft')]
    beds_values = [p.get('beds') for p in properties if p.get('beds')]
    
    summary = {
        'total_properties': len(properties),
        'avg_price': sum(prices) / len(prices) if prices else 0,
        'min_price': min(prices) if prices else 0,
        'max_price': max(prices) if prices else 0,
        'avg_sqft': sum(sqft_values) / len(sqft_values) if sqft_values else 0,
        'avg_beds': sum(beds_values) / len(beds_values) if beds_values else 0,
    }
    
    return summary
