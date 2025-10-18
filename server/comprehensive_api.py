"""
Comprehensive Commercial Real Estate Data API
RESTful API endpoints for all government data sources
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import pandas as pd

from comprehensive_data_service import ComprehensiveDataService
from state_data_models import StateCode, CommercialRealEstateData
from data_discovery_service import DataDiscoveryService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize services
comprehensive_service = ComprehensiveDataService()
discovery_service = DataDiscoveryService()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/data/comprehensive', methods=['POST'])
def get_comprehensive_data():
    """Get comprehensive commercial real estate data"""
    try:
        data = request.get_json()
        
        # Validate required parameters
        required_fields = ['latitude', 'longitude', 'state']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract parameters
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])
        state = data['state']
        county = data.get('county')
        city = data.get('city')
        include_federal = data.get('include_federal', True)
        include_state = data.get('include_state', True)
        include_county = data.get('include_county', True)
        
        # Get comprehensive data
        result = comprehensive_service.get_comprehensive_data(
            latitude=latitude,
            longitude=longitude,
            state=state,
            county=county,
            city=city,
            include_federal=include_federal,
            include_state=include_state,
            include_county=include_county
        )
        
        # Convert to JSON-serializable format
        result_dict = _convert_to_json_serializable(result)
        
        return jsonify({
            'success': True,
            'data': result_dict,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_comprehensive_data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/batch', methods=['POST'])
def batch_process_locations():
    """Process multiple locations in batch"""
    try:
        data = request.get_json()
        
        if 'locations' not in data:
            return jsonify({'error': 'Missing locations array'}), 400
        
        locations = data['locations']
        if not isinstance(locations, list):
            return jsonify({'error': 'Locations must be an array'}), 400
        
        # Validate each location
        for i, location in enumerate(locations):
            required_fields = ['latitude', 'longitude', 'state']
            for field in required_fields:
                if field not in location:
                    return jsonify({'error': f'Location {i} missing required field: {field}'}), 400
        
        # Process locations
        results = comprehensive_service.batch_process_locations(locations)
        
        # Convert to JSON-serializable format
        results_dict = [_convert_to_json_serializable(result) for result in results]
        
        return jsonify({
            'success': True,
            'data': results_dict,
            'processed_count': len(results),
            'total_count': len(locations),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in batch_process_locations: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/states/summary', methods=['GET'])
def get_states_summary():
    """Get data summary for all states"""
    try:
        summary = comprehensive_service.get_all_states_data_summary()
        
        # Convert to JSON-serializable format
        summary_dict = {}
        for state, data in summary.items():
            summary_dict[state] = _convert_to_json_serializable(data)
        
        return jsonify({
            'success': True,
            'data': summary_dict,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_states_summary: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/states/<state_code>', methods=['GET'])
def get_state_data(state_code):
    """Get data for a specific state"""
    try:
        # Validate state code
        if state_code.upper() not in StateCode.__members__:
            return jsonify({'error': f'Invalid state code: {state_code}'}), 400
        
        state = StateCode[state_code.upper()]
        
        # Get state data summary
        summary = comprehensive_service.state_service.get_state_data_summary(state)
        
        # Convert to JSON-serializable format
        summary_dict = _convert_to_json_serializable(summary)
        
        return jsonify({
            'success': True,
            'data': summary_dict,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_state_data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/discovery', methods=['GET'])
def discover_data_sources():
    """Discover available data sources"""
    try:
        # Get discovery parameters
        state_code = request.args.get('state')
        include_federal = request.args.get('include_federal', 'true').lower() == 'true'
        include_states = request.args.get('include_states', 'true').lower() == 'true'
        
        results = {}
        
        if include_federal:
            results['federal'] = discovery_service.discover_federal_sources()
        
        if include_states:
            if state_code:
                state = StateCode[state_code.upper()] if state_code.upper() in StateCode.__members__ else None
                if state:
                    results['states'] = discovery_service.discover_state_sources(state)
                else:
                    return jsonify({'error': f'Invalid state code: {state_code}'}), 400
            else:
                results['states'] = discovery_service.discover_state_sources()
        
        return jsonify({
            'success': True,
            'data': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in discover_data_sources: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/catalog', methods=['GET'])
def get_data_catalog():
    """Get comprehensive data catalog"""
    try:
        catalog = discovery_service.generate_data_catalog()
        
        return jsonify({
            'success': True,
            'data': catalog,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_data_catalog: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/report', methods=['GET'])
def generate_data_report():
    """Generate comprehensive data report"""
    try:
        report = comprehensive_service.generate_data_report()
        
        return jsonify({
            'success': True,
            'data': report,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in generate_data_report: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/search', methods=['POST'])
def search_properties():
    """Search for properties across states"""
    try:
        data = request.get_json()
        
        if 'query' not in data:
            return jsonify({'error': 'Missing query parameter'}), 400
        
        query = data['query']
        state_code = data.get('state')
        property_type = data.get('property_type')
        
        # Convert state code to StateCode enum if provided
        state = None
        if state_code:
            if state_code.upper() not in StateCode.__members__:
                return jsonify({'error': f'Invalid state code: {state_code}'}), 400
            state = StateCode[state_code.upper()]
        
        # Search properties
        properties = comprehensive_service.state_service.search_properties(
            query=query,
            state=state,
            property_type=property_type
        )
        
        # Convert to JSON-serializable format
        properties_dict = [_convert_to_json_serializable(prop) for prop in properties]
        
        return jsonify({
            'success': True,
            'data': properties_dict,
            'count': len(properties),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in search_properties: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/export', methods=['POST'])
def export_data():
    """Export data to various formats"""
    try:
        data = request.get_json()
        
        if 'locations' not in data:
            return jsonify({'error': 'Missing locations array'}), 400
        
        locations = data['locations']
        format_type = data.get('format', 'json')
        
        # Process locations
        results = comprehensive_service.batch_process_locations(locations)
        
        if format_type == 'json':
            # Return JSON data
            results_dict = [_convert_to_json_serializable(result) for result in results]
            return jsonify({
                'success': True,
                'data': results_dict,
                'format': 'json',
                'timestamp': datetime.now().isoformat()
            })
        
        elif format_type == 'csv':
            # Convert to CSV
            csv_data = _convert_to_csv(results)
            return jsonify({
                'success': True,
                'data': csv_data,
                'format': 'csv',
                'timestamp': datetime.now().isoformat()
            })
        
        else:
            return jsonify({'error': f'Unsupported format: {format_type}'}), 400
        
    except Exception as e:
        logger.error(f"Error in export_data: {e}")
        return jsonify({'error': str(e)}), 500

def _convert_to_json_serializable(obj):
    """Convert objects to JSON-serializable format"""
    if hasattr(obj, '__dict__'):
        # Convert dataclass to dict
        result = {}
        for key, value in obj.__dict__.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
            elif hasattr(value, '__dict__'):
                result[key] = _convert_to_json_serializable(value)
            elif isinstance(value, list):
                result[key] = [_convert_to_json_serializable(item) for item in value]
            elif isinstance(value, dict):
                result[key] = {k: _convert_to_json_serializable(v) for k, v in value.items()}
            else:
                result[key] = value
        return result
    elif isinstance(value, datetime):
        return value.isoformat()
    else:
        return obj

def _convert_to_csv(results: List[CommercialRealEstateData]) -> str:
    """Convert results to CSV format"""
    if not results:
        return ""
    
    # Flatten the data for CSV
    flattened_data = []
    for result in results:
        row = {
            'latitude': result.latitude,
            'longitude': result.longitude,
            'state': result.state,
            'county': result.county,
            'city': result.city,
            'data_quality_score': result.data_quality_score,
            'confidence_score': result.confidence_score,
            'last_updated': result.last_updated.isoformat() if result.last_updated else None
        }
        
        # Add census data
        if result.census_data:
            row.update({
                'population': result.census_data.total_population,
                'median_income': result.census_data.median_household_income,
                'median_age': result.census_data.median_age
            })
        
        # Add BLS data
        if result.bls_data:
            row.update({
                'unemployment_rate': result.bls_data.unemployment_rate,
                'total_employment': result.bls_data.total_employment,
                'average_wage': result.bls_data.average_hourly_wage
            })
        
        # Add property data
        if result.state_property_data:
            row.update({
                'assessed_value': result.state_property_data.assessed_value,
                'market_value': result.state_property_data.market_value,
                'last_sale_price': result.state_property_data.last_sale_price
            })
        
        # Add rent estimates
        if result.rent_estimates:
            row.update(result.rent_estimates)
        
        flattened_data.append(row)
    
    # Convert to CSV
    df = pd.DataFrame(flattened_data)
    return df.to_csv(index=False)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get configuration from environment
    port = int(os.getenv('COMPREHENSIVE_API_PORT', 8003))
    host = os.getenv('COMPREHENSIVE_API_HOST', '0.0.0.0')
    debug = os.getenv('COMPREHENSIVE_API_DEBUG', 'false').lower() == 'true'
    
    logger.info(f"Starting Comprehensive Data API on {host}:{port}")
    app.run(host=host, port=port, debug=debug)
