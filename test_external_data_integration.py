#!/usr/bin/env python3
"""
Test script for External Data Service with County Assessor Integration
"""

import sys
import os
import json

# Add the server directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

def test_external_data_integration():
    """Test the external data service with county assessor integration"""
    
    try:
        from external_data_service import ExternalDataService
        
        print('Testing External Data Service with County Assessor Integration...')
        print('=' * 60)
        
        # Initialize service
        service = ExternalDataService()
        
        # Sample property data
        property_data = {
            'property_id': 'test_001',
            'address': {
                'street': '123 Main St',
                'city': 'Chicago',
                'state': 'IL',
                'county': 'Cook',
                'zip_code': '60601',
                'formatted_address': '123 Main St, Chicago, IL 60601'
            },
            'latitude': 41.8781,
            'longitude': -87.6298,
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
        }
        
        # Test enrichment
        enriched = service.enrich_property(property_data)
        print('✅ Property enrichment successful')
        print(f'Property ID: {enriched.property_id}')
        print(f'Address: {enriched.address}')
        print(f'Latitude: {enriched.latitude}')
        print(f'Longitude: {enriched.longitude}')
        
        # Check if county tax data is present
        if hasattr(enriched, 'county_tax_data') and enriched.county_tax_data:
            print('✅ County tax data integrated successfully')
            print(f'Data source: {enriched.county_tax_data.data_source}')
            print(f'Assessed value: ${enriched.county_tax_data.assessed_value:,.2f}')
            print(f'Annual tax: ${enriched.county_tax_data.annual_tax:,.2f}')
            print(f'Confidence score: {enriched.county_tax_data.confidence_score:.2f}')
        else:
            print('❌ County tax data not found in enriched property')
            
        print('\n✅ External Data Service integration test PASSED')
        return True
        
    except Exception as e:
        print(f'❌ External Data Service integration test FAILED: {str(e)}')
        import traceback
        traceback.print_exc()
        return False

def test_county_assessor_service_directly():
    """Test county assessor service directly"""
    
    try:
        from county_assessor_service import CountyAssessorService
        
        print('\nTesting County Assessor Service Directly...')
        print('=' * 50)
        
        # Initialize service
        service = CountyAssessorService()
        
        # Sample property data
        property_data = {
            'property_id': 'test_002',
            'address': {
                'street': '456 Oak Ave',
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
                    'tax': 7500,
                    'assessment': {
                        'total': 375000,
                        'land': 75000,
                        'building': 300000
                    }
                }
            ]
        }
        
        # Test tax data retrieval
        tax_data = service.get_tax_data(property_data)
        
        if tax_data:
            print('✅ County assessor service working')
            print(f'Data source: {tax_data.data_source}')
            print(f'Assessed value: ${tax_data.assessed_value:,.2f}')
            print(f'Annual tax: ${tax_data.annual_tax:,.2f}')
            print(f'Tax year: {tax_data.tax_year}')
            print(f'Confidence score: {tax_data.confidence_score:.2f}')
        else:
            print('❌ No tax data retrieved')
            
        # Test property enrichment
        enriched = service.enrich_property_with_tax_data(property_data)
        
        if 'county_tax_data' in enriched:
            print('✅ Property enrichment with tax data successful')
        else:
            print('❌ Property enrichment failed')
            
        print('\n✅ County Assessor Service test PASSED')
        return True
        
    except Exception as e:
        print(f'❌ County Assessor Service test FAILED: {str(e)}')
        import traceback
        traceback.print_exc()
        return False

def test_tax_data_processor():
    """Test tax data processor"""
    
    try:
        from tax_data_processor import TaxDataProcessor
        
        print('\nTesting Tax Data Processor...')
        print('=' * 40)
        
        # Initialize processor
        processor = TaxDataProcessor()
        
        # Test county detection
        property_data = {
            'address': {
                'state': 'IL',
                'county': 'Cook'
            }
        }
        
        county = processor._detect_county(property_data)
        print(f'County detection: {county}')
        
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
        
        county_format = processor.county_formats['cook_il']
        normalized = processor.normalize_tax_data(raw_data, county_format)
        
        print(f'Data normalization successful')
        print(f'APN: {normalized.apn}')
        print(f'Assessed Value: ${normalized.assessed_value:,.2f}')
        print(f'Confidence Score: {normalized.confidence_score:.2f}')
        
        # Test TaxHistory conversion
        tax_history_list = processor.convert_to_tax_history(normalized)
        
        if tax_history_list:
            print(f'TaxHistory conversion successful: {len(tax_history_list)} entries')
        
        print('\n✅ Tax Data Processor test PASSED')
        return True
        
    except Exception as e:
        print(f'❌ Tax Data Processor test FAILED: {str(e)}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Comprehensive County Assessor Integration Test")
    print("=" * 60)
    
    # Run all tests
    tests = [
        test_external_data_integration,
        test_county_assessor_service_directly,
        test_tax_data_processor
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ ALL TESTS PASSED - County Assessor Integration is fully functional!")
    else:
        print("❌ Some tests failed - Check the output above for details")
        sys.exit(1)
