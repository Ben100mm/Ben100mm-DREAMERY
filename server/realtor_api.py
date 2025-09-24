"""
Flask API endpoint for Realtor.com data processing
Serves parsed property data to the TypeScript frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from typing import Dict, Any, List, Dict
from dreamery_property_scraper import DreameryPropertyScraper
from models import PropertyData, Property, ListingType, SearchPropertyType, ReturnType, HomeFlags, PetPolicy, OpenHouse, Unit, HomeMonthlyFee, HomeOneTimeFee, HomeParkingDetails, PropertyDetails, Popularity, TaxRecord, PropertyEstimate, HomeEstimates
from parsers import parse_address, parse_description, parse_open_houses, parse_units, parse_tax_record, parse_estimates
from enhanced_scraper import ScraperInput
from scraper_api import scrape_property

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Initialize the scraper
scraper = DreameryPropertyScraper()

@app.route('/api/realtor/search', methods=['POST'])
def search_properties():
    """Search for properties using the integrated parsers"""
    try:
        # Get search parameters from request
        search_params = request.get_json()
        if not search_params:
            return jsonify({
                'success': False,
                'error': 'No search parameters provided',
                'properties': [],
                'total': 0
            }), 400

        # Search properties using the scraper
        properties = scraper.search_properties(**search_params)
        
        # Convert PropertyData objects to dictionaries for JSON serialization
        serialized_properties = []
        for prop in properties:
            if isinstance(prop, PropertyData):
                serialized_properties.append(property_data_to_dict(prop))
            else:
                # Handle legacy format
                serialized_properties.append(prop)

        return jsonify({
            'success': True,
            'properties': serialized_properties,
            'total': len(serialized_properties)
        })

    except Exception as e:
        logger.error(f"Property search failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'properties': [],
            'total': 0
        }), 500

@app.route('/api/realtor/property/<property_id>', methods=['GET'])
def get_property_details(property_id):
    """Get detailed information for a specific property"""
    try:
        # Get property details using the scraper
        properties = scraper._get_property_details(property_id)
        
        if not properties:
            return jsonify({
                'success': False,
                'error': 'Property not found',
                'property': None
            }), 404

        property_data = properties[0]
        
        # Convert PropertyData object to dictionary
        if isinstance(property_data, PropertyData):
            serialized_property = property_data_to_dict(property_data)
        else:
            serialized_property = property_data

        return jsonify({
            'success': True,
            'property': serialized_property
        })

    except Exception as e:
        logger.error(f"Failed to get property details: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'property': None
        }), 500

@app.route('/api/realtor/suggestions', methods=['GET'])
def get_property_suggestions():
    """Get property suggestions for autocomplete"""
    try:
        query = request.args.get('q', '')
        limit = int(request.args.get('limit', 10))
        
        if not query:
            return jsonify({
                'success': True,
                'suggestions': []
            })

        # Use the scraper's location handling for suggestions
        location_info = scraper._handle_location(query)
        
        suggestions = []
        if location_info:
            suggestions.append(location_info.get('display_name', query))
        
        return jsonify({
            'success': True,
            'suggestions': suggestions[:limit]
        })

    except Exception as e:
        logger.error(f"Failed to get suggestions: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'suggestions': []
        }), 500

@app.route('/api/realtor/search/advanced', methods=['POST'])
def search_properties_advanced():
    """Advanced property search using processors for comprehensive data extraction"""
    try:
        # Get search parameters from request
        search_params = request.get_json()
        if not search_params:
            return jsonify({
                'success': False,
                'error': 'No search parameters provided',
                'properties': [],
                'total': 0
            }), 400

        # Extract advanced parameters
        mls_only = search_params.pop('mls_only', False)
        extra_property_data = search_params.pop('extra_property_data', False)
        exclude_pending = search_params.pop('exclude_pending', False)

        # Search properties using the advanced method
        properties = scraper.search_properties_advanced(
            mls_only=mls_only,
            extra_property_data=extra_property_data,
            exclude_pending=exclude_pending,
            **search_params
        )
        
        # Convert Property objects to dictionaries for JSON serialization
        serialized_properties = []
        for prop in properties:
            if isinstance(prop, Property):
                serialized_properties.append(property_to_dict(prop))
            else:
                # Handle legacy format
                serialized_properties.append(prop)

        return jsonify({
            'success': True,
            'properties': serialized_properties,
            'total': len(serialized_properties)
        })

    except Exception as e:
        logger.error(f"Advanced property search failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'properties': [],
            'total': 0
        }), 500

@app.route('/api/realtor/search/comprehensive', methods=['POST'])
def search_properties_comprehensive():
    """Comprehensive property search using enhanced GraphQL queries for maximum data extraction"""
    try:
        # Get search parameters from request
        search_params = request.get_json()
        if not search_params:
            return jsonify({
                'success': False,
                'error': 'No search parameters provided',
                'properties': [],
                'total': 0
            }), 400

        # Extract advanced parameters
        mls_only = search_params.pop('mls_only', False)
        extra_property_data = search_params.pop('extra_property_data', True)  # Default to True for comprehensive
        exclude_pending = search_params.pop('exclude_pending', False)

        # Search properties using the comprehensive method
        properties = scraper.search_properties_comprehensive(
            mls_only=mls_only,
            extra_property_data=extra_property_data,
            exclude_pending=exclude_pending,
            **search_params
        )
        
        # Convert Property objects to dictionaries for JSON serialization
        serialized_properties = []
        for prop in properties:
            if isinstance(prop, Property):
                serialized_properties.append(property_to_dict(prop))
            else:
                # Handle legacy format
                serialized_properties.append(prop)

        return jsonify({
            'success': True,
            'properties': serialized_properties,
            'total': len(serialized_properties)
        })

    except Exception as e:
        logger.error(f"Comprehensive property search failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'properties': [],
            'total': 0
        }), 500

@app.route('/api/realtor/search/enhanced', methods=['POST'])
def search_properties_enhanced():
    """Enhanced property search using Pydantic models and improved session management"""
    try:
        # Get search parameters from request
        search_params = request.get_json()
        if not search_params:
            return jsonify({
                'success': False,
                'error': 'No search parameters provided',
                'properties': [],
                'total': 0
            }), 400

        # Create ScraperInput from request data
        try:
            scraper_input = ScraperInput(**search_params)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'Invalid input parameters: {str(e)}',
                'properties': [],
                'total': 0
            }), 400

        # Create enhanced scraper
        enhanced_scraper = DreameryPropertyScraper.from_scraper_input(scraper_input)
        
        # Perform search based on return type
        if scraper_input.return_type == ReturnType.pandas:
            # For pandas return type, use comprehensive search
            properties = enhanced_scraper.search_properties_comprehensive(
                location=scraper_input.location,
                listing_type=scraper_input.listing_type.value,
                property_types=[pt.value for pt in scraper_input.property_type] if scraper_input.property_type else None,
                radius=scraper_input.radius,
                past_days=scraper_input.last_x_days,
                limit=scraper_input.limit,
                mls_only=scraper_input.mls_only,
                extra_property_data=scraper_input.extra_property_data,
                exclude_pending=scraper_input.exclude_pending
            )
        else:
            # For other return types, use standard search
            properties = enhanced_scraper.search_properties_advanced(
                location=scraper_input.location,
                listing_type=scraper_input.listing_type.value,
                property_types=[pt.value for pt in scraper_input.property_type] if scraper_input.property_type else None,
                radius=scraper_input.radius,
                past_days=scraper_input.last_x_days,
                limit=scraper_input.limit,
                mls_only=scraper_input.mls_only,
                extra_property_data=scraper_input.extra_property_data,
                exclude_pending=scraper_input.exclude_pending
            )
        
        # Convert Property objects to dictionaries for JSON serialization
        serialized_properties = []
        for prop in properties:
            if isinstance(prop, Property):
                serialized_properties.append(property_to_dict(prop))
            else:
                # Handle legacy format
                serialized_properties.append(prop)

        return jsonify({
            'success': True,
            'properties': serialized_properties,
            'total': len(serialized_properties),
            'return_type': scraper_input.return_type.value
        })

    except Exception as e:
        logger.error(f"Enhanced property search failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'properties': [],
            'total': 0
        }), 500

@app.route('/api/realtor/scrape', methods=['POST'])
def scrape_properties_api():
    """High-level property scraping API with comprehensive validation"""
    try:
        # Get search parameters from request
        search_params = request.get_json()
        if not search_params:
            return jsonify({
                'success': False,
                'error': 'No search parameters provided',
                'data': None
            }), 400

        # Extract parameters with defaults
        location = search_params.get('location')
        if not location:
            return jsonify({
                'success': False,
                'error': 'Location is required',
                'data': None
            }), 400

        listing_type = search_params.get('listing_type', 'for_sale')
        return_type = search_params.get('return_type', 'pandas')
        property_type = search_params.get('property_type')
        radius = search_params.get('radius')
        mls_only = search_params.get('mls_only', False)
        past_days = search_params.get('past_days')
        proxy = search_params.get('proxy')
        date_from = search_params.get('date_from')
        date_to = search_params.get('date_to')
        foreclosure = search_params.get('foreclosure')
        extra_property_data = search_params.get('extra_property_data', True)
        exclude_pending = search_params.get('exclude_pending', False)
        limit = search_params.get('limit', 10000)

        # Call the high-level scraping API
        results = scrape_property(
            location=location,
            listing_type=listing_type,
            return_type=return_type,
            property_type=property_type,
            radius=radius,
            mls_only=mls_only,
            past_days=past_days,
            proxy=proxy,
            date_from=date_from,
            date_to=date_to,
            foreclosure=foreclosure,
            extra_property_data=extra_property_data,
            exclude_pending=exclude_pending,
            limit=limit
        )

        # Handle different return types
        if return_type == 'pandas':
            # Convert pandas DataFrame to JSON
            if hasattr(results, 'to_dict'):
                data = results.to_dict('records')
            else:
                data = results
        elif return_type == 'pydantic':
            # Convert Pydantic models to dictionaries
            data = []
            for result in results:
                if hasattr(result, 'model_dump'):
                    data.append(result.model_dump())
                else:
                    data.append(result)
        else:  # raw
            data = results

        return jsonify({
            'success': True,
            'data': data,
            'return_type': return_type,
            'count': len(data) if isinstance(data, list) else len(data) if hasattr(data, '__len__') else 1
        })

    except ValueError as e:
        logger.error(f"Validation error in scrape API: {e}")
        return jsonify({
            'success': False,
            'error': f'Validation error: {str(e)}',
            'data': None
        }), 400
    except Exception as e:
        logger.error(f"Scrape API failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'data': None
        }), 500

@app.route('/api/realtor/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'message': 'Realtor API is running'
    })

def property_data_to_dict(property_data: PropertyData) -> Dict[str, Any]:
    """Convert PropertyData object to dictionary for JSON serialization"""
    result = {
        'property_id': property_data.property_id,
        'listing_id': property_data.listing_id,
        'status': property_data.status,
        'list_price': property_data.list_price,
        'neighborhoods': property_data.neighborhoods,
        'days_on_mls': property_data.days_on_mls,
        'last_sold_date': property_data.last_sold_date,
        'last_sold_price': property_data.last_sold_price,
        'list_date': property_data.list_date,
        'photos': property_data.photos,
        'agent': property_data.agent,
        'office': property_data.office,
        'coordinates': property_data.coordinates,
        'mls_data': property_data.mls_data
    }

    # Convert address
    if property_data.address:
        result['address'] = {
            'full_line': property_data.address.full_line,
            'street': property_data.address.street,
            'unit': property_data.address.unit,
            'city': property_data.address.city,
            'state': property_data.address.state,
            'zip': property_data.address.zip,
            'street_direction': property_data.address.street_direction,
            'street_number': property_data.address.street_number,
            'street_name': property_data.address.street_name,
            'street_suffix': property_data.address.street_suffix
        }

    # Convert description
    if property_data.description:
        result['description'] = {
            'primary_photo': property_data.description.primary_photo,
            'alt_photos': property_data.description.alt_photos,
            'style': property_data.description.style.value if property_data.description.style else None,
            'beds': property_data.description.beds,
            'baths_full': property_data.description.baths_full,
            'baths_half': property_data.description.baths_half,
            'sqft': property_data.description.sqft,
            'lot_sqft': property_data.description.lot_sqft,
            'sold_price': property_data.description.sold_price,
            'year_built': property_data.description.year_built,
            'garage': property_data.description.garage,
            'stories': property_data.description.stories,
            'text': property_data.description.text,
            'name': property_data.description.name,
            'type': property_data.description.type
        }

    # Convert open houses
    if property_data.open_houses:
        result['open_houses'] = []
        for oh in property_data.open_houses:
            result['open_houses'].append({
                'start_date': oh.start_date.isoformat() if oh.start_date else None,
                'end_date': oh.end_date.isoformat() if oh.end_date else None,
                'description': oh.description,
                'is_appointment_only': oh.is_appointment_only
            })

    # Convert units
    if property_data.units:
        result['units'] = []
        for unit in property_data.units:
            unit_dict = {
                'unit_number': unit.unit_number,
                'beds': unit.beds,
                'baths': unit.baths,
                'sqft': unit.sqft,
                'rent': unit.rent
            }
            if unit.availability:
                unit_Dict['availability'] = {
                    'date': unit.availability.get('date'),
                    'status': unit.availability.get('status')
                }
            result['units'].append(unit_dict)

    # Convert tax record
    if property_data.tax_record:
        result['tax_record'] = {
            'assessed_value': property_data.tax_record.assessed_value,
            'tax_amount': property_data.tax_record.tax_amount,
            'last_update_date': property_data.tax_record.last_update_date.isoformat() if property_data.tax_record.last_update_date else None,
            'tax_year': property_data.tax_record.tax_year
        }

    # Convert estimates
    if property_data.estimates:
        result['estimates'] = property_data.estimates

    return result

def property_to_dict(property_obj: Property) -> Dict[str, Any]:
    """Convert Property object to dictionary for JSON serialization"""
    # Use Pydantic's model_dump for clean serialization
    if hasattr(property_obj, 'model_dump'):
        return property_obj.model_dump()
    
    # Fallback for legacy objects
    result = {
        'property_id': property_obj.property_id,
        'mls': property_obj.mls,
        'mls_id': property_obj.mls_id,
        'property_url': str(property_obj.property_url) if property_obj.property_url else None,
        'listing_id': property_obj.listing_id,
        'permalink': property_obj.permalink,
        'status': property_obj.status,
        'list_price': property_obj.list_price,
        'list_price_min': property_obj.list_price_min,
        'list_price_max': property_obj.list_price_max,
        'list_date': property_obj.list_date.isoformat() if property_obj.list_date else None,
        'prc_sqft': property_obj.prc_sqft,
        'last_sold_date': property_obj.last_sold_date.isoformat() if property_obj.last_sold_date else None,
        'pending_date': property_obj.pending_date.isoformat() if property_obj.pending_date else None,
        'new_construction': property_obj.new_construction,
        'hoa_fee': property_obj.hoa_fee,
        'latitude': property_obj.latitude,
        'longitude': property_obj.longitude,
        'neighborhoods': property_obj.neighborhoods,
        'county': property_obj.county,
        'fips_code': property_obj.fips_code,
        'days_on_mls': property_obj.days_on_mls,
        'nearby_schools': property_obj.nearby_schools,
        'assessed_value': property_obj.assessed_value,
        'estimated_value': property_obj.estimated_value,
        'mls_status': property_obj.mls_status,
        'last_sold_price': property_obj.last_sold_price,
        'tags': property_obj.tags,
        'details': property_obj.details,
        'open_houses': property_obj.open_houses,
        'pet_policy': property_obj.pet_policy,
        'units': property_obj.units,
        'monthly_fees': property_obj.monthly_fees,
        'one_time_fees': property_obj.one_time_fees,
        'parking': property_obj.parking,
        'terms': property_obj.terms,
        'popularity': property_obj.popularity,
        'tax_record': property_obj.tax_record,
        'parcel_info': property_obj.parcel_info,
        'current_estimates': property_obj.current_estimates,
        'estimates': property_obj.estimates,
        'photos': property_obj.photos,
        'flags': property_obj.flags,
        'tax': property_obj.tax,
        'tax_history': property_obj.tax_history
    }

    # Convert address
    if property_obj.address:
        result['address'] = {
            'full_line': property_obj.address.full_line,
            'street': property_obj.address.street,
            'unit': property_obj.address.unit,
            'city': property_obj.address.city,
            'state': property_obj.address.state,
            'zip': property_obj.address.zip,
            'street_direction': property_obj.address.street_direction,
            'street_number': property_obj.address.street_number,
            'street_name': property_obj.address.street_name,
            'street_suffix': property_obj.address.street_suffix,
            'formatted_address': property_obj.address.formatted_address
        }

    # Convert description
    if property_obj.description:
        result['description'] = {
            'primary_photo': str(property_obj.description.primary_photo) if property_obj.description.primary_photo else None,
            'alt_photos': [str(photo) for photo in property_obj.description.alt_photos] if property_obj.description.alt_photos else None,
            'style': property_obj.description.style.value if property_obj.description.style else None,
            'beds': property_obj.description.beds,
            'baths_full': property_obj.description.baths_full,
            'baths_half': property_obj.description.baths_half,
            'sqft': property_obj.description.sqft,
            'lot_sqft': property_obj.description.lot_sqft,
            'sold_price': property_obj.description.sold_price,
            'year_built': property_obj.description.year_built,
            'garage': property_obj.description.garage,
            'stories': property_obj.description.stories,
            'text': property_obj.description.text,
            'name': property_obj.description.name,
            'type': property_obj.description.type
        }

    # Convert advertisers
    if property_obj.advertisers:
        result['advertisers'] = {}
        
        if property_obj.advertisers.agent:
            result['advertisers']['agent'] = {
                'uuid': property_obj.advertisers.agent.uuid,
                'nrds_id': property_obj.advertisers.agent.nrds_id,
                'mls_set': property_obj.advertisers.agent.mls_set,
                'name': property_obj.advertisers.agent.name,
                'email': property_obj.advertisers.agent.email,
                'phones': property_obj.advertisers.agent.phones,
                'href': property_obj.advertisers.agent.href,
                'state_license': property_obj.advertisers.agent.state_license
            }
        
        if property_obj.advertisers.broker:
            result['advertisers']['broker'] = {
                'uuid': property_obj.advertisers.broker.uuid,
                'name': property_obj.advertisers.broker.name
            }
        
        if property_obj.advertisers.builder:
            result['advertisers']['builder'] = {
                'uuid': property_obj.advertisers.builder.uuid,
                'name': property_obj.advertisers.builder.name
            }
        
        if property_obj.advertisers.office:
            result['advertisers']['office'] = {
                'uuid': property_obj.advertisers.office.uuid,
                'mls_set': property_obj.advertisers.office.mls_set,
                'name': property_obj.advertisers.office.name,
                'email': property_obj.advertisers.office.email,
                'phones': property_obj.advertisers.office.phones,
                'href': property_obj.advertisers.office.href
            }

    return result

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
