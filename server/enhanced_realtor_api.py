"""
Enhanced Realtor API with External Data Integration
Extends the existing realtor API to include enriched property data from external sources
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio
import aiohttp
from external_data_service import ExternalDataService, EnrichedPropertyData

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedRealtorAPI:
    """Enhanced Realtor API with external data enrichment"""
    
    def __init__(self):
        self.external_service = ExternalDataService()
        self.cache_enabled = True
        self.cache_duration_hours = 24
        
    async def enrich_property_async(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Asynchronously enrich a single property"""
        try:
            # Get enriched data
            enriched = self.external_service.enrich_property(property_data)
            
            # Convert to dictionary format compatible with existing API
            enriched_dict = {
                'property_id': enriched.property_id,
                'walk_score': enriched.walk_score_data.walk_score if enriched.walk_score_data else None,
                'bike_score': enriched.walk_score_data.bike_score if enriched.walk_score_data else None,
                'transit_score': enriched.walk_score_data.transit_score if enriched.walk_score_data else None,
                'amenities': [
                    {
                        'name': amenity.name,
                        'type': amenity.type,
                        'rating': amenity.rating,
                        'distance_meters': amenity.distance_meters,
                        'price_level': amenity.price_level
                    } for amenity in enriched.amenities
                ],
                'transit': {
                    'nearest_stop': enriched.transit_data.nearest_stop if enriched.transit_data else None,
                    'distance_meters': enriched.transit_data.distance_meters if enriched.transit_data else None,
                    'routes': enriched.transit_data.routes if enriched.transit_data else []
                } if enriched.transit_data else None,
                'demographics': {
                    'population': enriched.census_data.population if enriched.census_data else None,
                    'median_age': enriched.census_data.median_age if enriched.census_data else None,
                    'median_income': enriched.census_data.median_income if enriched.census_data else None,
                    'education_level': enriched.census_data.education_level if enriched.census_data else None,
                    'employment_rate': enriched.census_data.employment_rate if enriched.census_data else None,
                    'housing_units': enriched.census_data.housing_units if enriched.census_data else None
                } if enriched.census_data else None,
                'schools': [
                    {
                        'name': school.name,
                        'type': school.type,
                        'rating': school.rating,
                        'distance_meters': school.distance_meters,
                        'district': school.district,
                        'enrollment': school.enrollment
                    } for school in enriched.schools
                ],
                'enrichment_date': enriched.enrichment_date.isoformat() if enriched.enrichment_date else None
            }
            
            # Merge with original property data
            property_data.update(enriched_dict)
            return property_data
            
        except Exception as e:
            logger.error(f"Failed to enrich property {property_data.get('property_id')}: {e}")
            return property_data
    
    async def enrich_properties_batch_async(self, properties: List[Dict[str, Any]], 
                                          batch_size: int = 5) -> List[Dict[str, Any]]:
        """Asynchronously enrich multiple properties in batches"""
        enriched_properties = []
        
        for i in range(0, len(properties), batch_size):
            batch = properties[i:i + batch_size]
            logger.info(f"Processing batch {i//batch_size + 1} of {(len(properties)-1)//batch_size + 1}")
            
            # Process batch concurrently
            tasks = [self.enrich_property_async(prop) for prop in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in batch_results:
                if isinstance(result, Exception):
                    logger.error(f"Batch enrichment failed: {result}")
                else:
                    enriched_properties.append(result)
            
            # Add delay between batches to respect rate limits
            await asyncio.sleep(1)
        
        return enriched_properties
    
    def enrich_properties_sync(self, properties: List[Dict[str, Any]], 
                             batch_size: int = 10) -> List[Dict[str, Any]]:
        """Synchronously enrich multiple properties"""
        return asyncio.run(self.enrich_properties_batch_async(properties, batch_size))
    
    def get_property_with_enrichment(self, property_id: str) -> Optional[Dict[str, Any]]:
        """Get a single property with enrichment data"""
        # This would integrate with your existing property lookup
        # For now, return a sample enriched property
        sample_property = {
            'property_id': property_id,
            'address': {'formatted_address': '123 Main St, San Francisco, CA'},
            'latitude': 37.7749,
            'longitude': -122.4194,
            'list_price': 1500000,
            'description': {
                'beds': 3,
                'baths_full': 2,
                'sqft': 1500
            }
        }
        
        return asyncio.run(self.enrich_property_async(sample_property))
    
    def get_properties_with_enrichment(self, search_params: Dict[str, Any]) -> Dict[str, Any]:
        """Get multiple properties with enrichment data"""
        # This would integrate with your existing property search
        # For now, return sample enriched properties
        
        sample_properties = [
            {
                'property_id': 'prop_001',
                'address': {'formatted_address': '123 Main St, San Francisco, CA'},
                'latitude': 37.7749,
                'longitude': -122.4194,
                'list_price': 1500000,
                'description': {'beds': 3, 'baths_full': 2, 'sqft': 1500}
            },
            {
                'property_id': 'prop_002',
                'address': {'formatted_address': '456 Oak Ave, San Francisco, CA'},
                'latitude': 37.7849,
                'longitude': -122.4094,
                'list_price': 1800000,
                'description': {'beds': 4, 'baths_full': 3, 'sqft': 2000}
            }
        ]
        
        enriched_properties = self.enrich_properties_sync(sample_properties)
        
        return {
            'success': True,
            'properties': enriched_properties,
            'total': len(enriched_properties),
            'enrichment_enabled': True
        }

# Flask API endpoints for the enhanced service
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

enhanced_api = EnhancedRealtorAPI()

@app.route('/api/enhanced/properties', methods=['GET'])
def get_enhanced_properties():
    """Get properties with external data enrichment"""
    try:
        search_params = request.args.to_dict()
        result = enhanced_api.get_properties_with_enrichment(search_params)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error getting enhanced properties: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/enhanced/properties/<property_id>', methods=['GET'])
def get_enhanced_property(property_id):
    """Get a single property with external data enrichment"""
    try:
        property_data = enhanced_api.get_property_with_enrichment(property_id)
        if property_data:
            return jsonify({'success': True, 'property': property_data})
        else:
            return jsonify({'success': False, 'error': 'Property not found'}), 404
    except Exception as e:
        logger.error(f"Error getting enhanced property {property_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/enhanced/enrich', methods=['POST'])
def enrich_properties():
    """Enrich existing properties with external data"""
    try:
        data = request.get_json()
        properties = data.get('properties', [])
        batch_size = data.get('batch_size', 10)
        
        enriched_properties = enhanced_api.enrich_properties_sync(properties, batch_size)
        
        return jsonify({
            'success': True,
            'enriched_properties': enriched_properties,
            'count': len(enriched_properties)
        })
    except Exception as e:
        logger.error(f"Error enriching properties: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/enhanced/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': {
            'walkscore': bool(enhanced_api.external_service.api_keys['walkscore']),
            'google_places': bool(enhanced_api.external_service.api_keys['google_places']),
            'census': bool(enhanced_api.external_service.api_keys['census']),
            'transit': bool(enhanced_api.external_service.api_keys['transit']),
            'schools': bool(enhanced_api.external_service.api_keys['schools'])
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002, debug=True)
