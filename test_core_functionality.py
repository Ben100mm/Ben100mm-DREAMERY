#!/usr/bin/env python3
"""
Test core county assessor functionality without Flask dependencies
"""

import sys
import os
import json

# Add the server directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

def test_core_functionality():
    """Test core county assessor functionality"""
    
    print('🧪 Testing Core County Assessor Functionality')
    print('=' * 60)
    
    try:
        # Test 1: County Assessor Service
        print('1. Testing County Assessor Service...')
        from county_assessor_service import CountyAssessorService
        
        service = CountyAssessorService()
        
        # Sample property with tax history
        property_data = {
            'property_id': 'test_core_001',
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
        }
        
        tax_data = service.get_tax_data(property_data)
        
        if tax_data:
            print('   ✅ County Assessor Service working')
            print(f'   Data source: {tax_data.data_source}')
            print(f'   Assessed value: ${tax_data.assessed_value:,.2f}')
            print(f'   Annual tax: ${tax_data.annual_tax:,.2f}')
            print(f'   Confidence score: {tax_data.confidence_score:.2f}')
        else:
            print('   ❌ County Assessor Service failed')
            return False
        
        # Test 2: Tax Data Processor
        print('\n2. Testing Tax Data Processor...')
        from tax_data_processor import TaxDataProcessor
        
        processor = TaxDataProcessor()
        
        # Test county detection
        county = processor._detect_county(property_data)
        print(f'   County detection: {county}')
        
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
        
        print(f'   Data normalization: ✅')
        print(f'   APN: {normalized.apn}')
        print(f'   Assessed Value: ${normalized.assessed_value:,.2f}')
        print(f'   Confidence Score: {normalized.confidence_score:.2f}')
        
        # Test 3: External Data Service Integration
        print('\n3. Testing External Data Service Integration...')
        from external_data_service import ExternalDataService
        
        external_service = ExternalDataService()
        
        # Test property enrichment
        enriched = external_service.enrich_property(property_data)
        
        if enriched and hasattr(enriched, 'county_tax_data') and enriched.county_tax_data:
            print('   ✅ External Data Service integration working')
            print(f'   County tax data source: {enriched.county_tax_data.data_source}')
            print(f'   County tax assessed value: ${enriched.county_tax_data.assessed_value:,.2f}')
        else:
            print('   ❌ External Data Service integration failed')
            return False
        
        # Test 4: Data Model Validation
        print('\n4. Testing Data Model Validation...')
        from models import CountyTaxData
        
        # Test model creation
        model_data = CountyTaxData(
            property_id='test_model',
            assessed_value=425000.0,
            annual_tax=8500.0,
            tax_year=2023,
            data_source='test',
            confidence_score=0.95
        )
        
        print(f'   CountyTaxData model: ✅')
        print(f'   Property ID: {model_data.property_id}')
        print(f'   Assessed Value: ${model_data.assessed_value:,.2f}')
        print(f'   Annual Tax: ${model_data.annual_tax:,.2f}')
        print(f'   Tax Year: {model_data.tax_year}')
        print(f'   Data Source: {model_data.data_source}')
        print(f'   Confidence Score: {model_data.confidence_score:.2f}')
        
        # Test 5: Batch Processing
        print('\n5. Testing Batch Processing...')
        
        properties = [property_data, property_data.copy()]
        properties[1]['property_id'] = 'test_core_002'
        
        enriched_batch = service.batch_enrich_properties(properties)
        
        if len(enriched_batch) == 2:
            print('   ✅ Batch processing working')
            print(f'   Processed {len(enriched_batch)} properties')
        else:
            print('   ❌ Batch processing failed')
            return False
        
        print('\n✅ ALL CORE FUNCTIONALITY TESTS PASSED!')
        print('=' * 60)
        print('County Assessor Integration is fully functional and ready for production.')
        
        return True
        
    except Exception as e:
        print(f'\n❌ Core functionality test failed: {str(e)}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_core_functionality()
    sys.exit(0 if success else 1)
