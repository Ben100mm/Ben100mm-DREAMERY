#!/usr/bin/env python3
"""
Test script for County Assessor API Integration
Demonstrates the integration with sample property data
"""

import sys
import os
import json
from datetime import datetime

# Add the server directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

from county_assessor_service import CountyAssessorService, CountyAssessorSource
from tax_data_processor import TaxDataProcessor

def test_county_assessor_integration():
    """Test the county assessor integration with sample data"""
    
    print("🏠 County Assessor API Integration Test")
    print("=" * 50)
    
    # Initialize services
    print("Initializing services...")
    county_service = CountyAssessorService()
    tax_processor = TaxDataProcessor()
    
    # Sample properties for different counties
    sample_properties = [
        {
            'property_id': 'cook_001',
            'address': {
                'street': '123 Main St',
                'city': 'Chicago',
                'state': 'IL',
                'county': 'Cook',
                'zip_code': '60601'
            },
            'coordinates': {
                'lat': 41.8781,
                'lng': -87.6298
            },
            'tax_history': [
                {
                    'year': 2023,
                    'tax': 8500,
                    'assessment': {
                        'total': 425000,
                        'land': 85000,
                        'building': 340000
                    }
                }
            ]
        },
        {
            'property_id': 'la_001',
            'address': {
                'street': '456 Sunset Blvd',
                'city': 'Los Angeles',
                'state': 'CA',
                'county': 'Los Angeles',
                'zip_code': '90028'
            },
            'coordinates': {
                'lat': 34.0522,
                'lng': -118.2437
            },
            'apn': '1234567890'
        },
        {
            'property_id': 'harris_001',
            'address': {
                'street': '789 Main St',
                'city': 'Houston',
                'state': 'TX',
                'county': 'Harris',
                'zip_code': '77002'
            },
            'coordinates': {
                'lat': 29.7604,
                'lng': -95.3698
            },
            'apn': '1234567890'
        }
    ]
    
    print(f"Testing with {len(sample_properties)} sample properties...")
    print()
    
    # Test each property
    for i, property_data in enumerate(sample_properties, 1):
        print(f"📍 Property {i}: {property_data['address']['city']}, {property_data['address']['state']}")
        print("-" * 40)
        
        # Test county detection
        county_code = tax_processor._detect_county(property_data)
        print(f"Detected county: {county_code}")
        
        # Test tax data processing
        tax_data = county_service.get_tax_data(property_data)
        
        if tax_data:
            print(f"✅ Tax data retrieved from: {tax_data.data_source}")
            print(f"   Assessed Value: ${tax_data.assessed_value:,.2f}" if tax_data.assessed_value else "   Assessed Value: N/A")
            print(f"   Annual Tax: ${tax_data.annual_tax:,.2f}" if tax_data.annual_tax else "   Annual Tax: N/A")
            print(f"   Tax Year: {tax_data.tax_year}" if tax_data.tax_year else "   Tax Year: N/A")
            print(f"   Confidence Score: {tax_data.confidence_score:.2f}" if tax_data.confidence_score else "   Confidence Score: N/A")
        else:
            print("❌ No tax data available")
        
        print()
    
    # Test batch processing
    print("🔄 Testing batch processing...")
    print("-" * 30)
    
    enriched_properties = county_service.batch_enrich_properties(sample_properties)
    
    print(f"Processed {len(enriched_properties)} properties")
    
    # Count successful enrichments
    successful = sum(1 for prop in enriched_properties if 'county_tax_data' in prop)
    print(f"Successfully enriched: {successful}/{len(enriched_properties)}")
    
    # Test data processor
    print("\n🔧 Testing tax data processor...")
    print("-" * 35)
    
    # Test data normalization
    raw_data = {
        'pin': '1234567890',
        'total_assessed_value': '$425,000',
        'land_assessed_value': '$85,000',
        'building_assessed_value': '$340,000',
        'total_tax': '$8,500',
        'tax_year': '2023',
        'property_class': 'Residential',
        'owner_name': 'John Doe'
    }
    
    county_format = tax_processor.county_formats['cook_il']
    normalized = tax_processor.normalize_tax_data(raw_data, county_format)
    
    print("Raw data normalization test:")
    print(f"  APN: {normalized.apn}")
    print(f"  Assessed Value: ${normalized.assessed_value:,.2f}")
    print(f"  Land Value: ${normalized.land_value:,.2f}")
    print(f"  Building Value: ${normalized.building_value:,.2f}")
    print(f"  Annual Tax: ${normalized.annual_tax:,.2f}")
    print(f"  Tax Year: {normalized.tax_year}")
    print(f"  Property Type: {normalized.property_type}")
    print(f"  Owner Name: {normalized.owner_name}")
    print(f"  Confidence Score: {normalized.confidence_score:.2f}")
    
    # Test conversion to TaxHistory
    print("\n🔄 Testing TaxHistory conversion...")
    print("-" * 35)
    
    tax_history_list = tax_processor.convert_to_tax_history(normalized)
    
    if tax_history_list:
        tax_history = tax_history_list[0]
        print("Converted to TaxHistory format:")
        print(f"  Year: {tax_history.year}")
        print(f"  Tax: ${tax_history.tax:,.2f}")
        print(f"  Assessment Total: ${tax_history.assessment.total:,.2f}")
        print(f"  Assessment Land: ${tax_history.assessment.land:,.2f}")
        print(f"  Assessment Building: ${tax_history.assessment.building:,.2f}")
    
    print("\n✅ County Assessor Integration Test Complete!")
    print("=" * 50)

def test_api_configuration():
    """Test API configuration and availability"""
    
    print("\n🔑 API Configuration Test")
    print("=" * 30)
    
    # Check environment variables
    api_keys = {
        'REALIE_API_KEY': os.getenv('REALIE_API_KEY'),
        'TAXNETUSA_API_KEY': os.getenv('TAXNETUSA_API_KEY'),
        'WALK_SCORE_API_KEY': os.getenv('WALK_SCORE_API_KEY'),
        'GOOGLE_PLACES_API_KEY': os.getenv('GOOGLE_PLACES_API_KEY'),
    }
    
    print("API Key Status:")
    for key, value in api_keys.items():
        status = "✅ Set" if value else "❌ Not set"
        print(f"  {key}: {status}")
    
    print("\nData Source Availability:")
    county_service = CountyAssessorService()
    
    for source, config in county_service.configs.items():
        status = "✅ Enabled" if config.enabled else "❌ Disabled"
        print(f"  {source.value}: {status}")

if __name__ == "__main__":
    try:
        test_county_assessor_integration()
        test_api_configuration()
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
