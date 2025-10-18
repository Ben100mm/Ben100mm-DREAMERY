#!/usr/bin/env python3
"""
Basic Functionality Test for Comprehensive Data Integration
Tests core functionality without requiring API keys
"""

import os
import sys
import json
import logging
from datetime import datetime

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from state_data_models import StateCode, StatePropertyData, FederalCensusData, CommercialRealEstateData
from comprehensive_data_service import ComprehensiveDataService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_data_models():
    """Test data model creation and serialization"""
    logger.info("Testing data models...")
    
    try:
        # Test StatePropertyData
        property_data = StatePropertyData(
            property_id="test_001",
            address="123 Main St",
            city="San Francisco",
            state="CA"
        )
        
        # Test FederalCensusData
        census_data = FederalCensusData(
            state_fips="06",
            county_fips="075",
            total_population=1000000,
            median_household_income=75000
        )
        
        # Test CommercialRealEstateData
        commercial_data = CommercialRealEstateData(
            address="123 Main St, San Francisco, CA",
            latitude=37.7749,
            longitude=-122.4194,
            state="CA",
            census_data=census_data,
            state_property_data=property_data
        )
        
        logger.info("✅ Data models created successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Data model test failed: {e}")
        return False

def test_state_configurations():
    """Test state configuration loading"""
    logger.info("Testing state configurations...")
    
    try:
        from state_configurations import get_all_state_configs, get_states_with_apis
        
        configs = get_all_state_configs()
        states_with_apis = get_states_with_apis()
        
        logger.info(f"✅ Loaded {len(configs)} state configurations")
        logger.info(f"✅ Found {len(states_with_apis)} states with APIs")
        
        # Test a few specific states
        ca_config = configs.get(StateCode.CA)
        if ca_config:
            logger.info(f"✅ California config: API available = {ca_config.api_available}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ State configuration test failed: {e}")
        return False

def test_service_initialization():
    """Test service initialization without API calls"""
    logger.info("Testing service initialization...")
    
    try:
        # Test ComprehensiveDataService initialization
        service = ComprehensiveDataService()
        logger.info("✅ ComprehensiveDataService initialized")
        
        # Test that services are properly initialized
        assert hasattr(service, 'federal_service')
        assert hasattr(service, 'state_service')
        assert hasattr(service, 'discovery_service')
        
        logger.info("✅ All services initialized properly")
        return True
        
    except Exception as e:
        logger.error(f"❌ Service initialization test failed: {e}")
        return False

def test_data_quality_scoring():
    """Test data quality scoring logic"""
    logger.info("Testing data quality scoring...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with mock data
        mock_data = CommercialRealEstateData(
            address="123 Main St, San Francisco, CA",
            latitude=37.7749,
            longitude=-122.4194,
            state="CA",
            data_sources=['census', 'state'],
            confidence_score=0.8
        )
        
        # Test quality score calculation
        quality_score = mock_data.data_quality_score or 0.0
        assert 0.0 <= quality_score <= 1.0
        
        logger.info(f"✅ Data quality scoring works: {quality_score}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Data quality scoring test failed: {e}")
        return False

def test_market_indicators():
    """Test market indicator generation"""
    logger.info("Testing market indicator generation...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with mock census data
        mock_census = FederalCensusData(
            total_population=1000000,
            median_household_income=75000,
            median_age=35.5
        )
        
        # Test market indicator generation
        indicators = service._generate_market_indicators(
            census_data=mock_census,
            bls_data=None,
            state_property_data=None,
            state_rent_data=None
        )
        
        assert isinstance(indicators, dict)
        assert 'population' in indicators
        assert 'median_income' in indicators
        
        logger.info(f"✅ Market indicators generated: {len(indicators)} indicators")
        return True
        
    except Exception as e:
        logger.error(f"❌ Market indicator test failed: {e}")
        return False

def test_rent_estimates():
    """Test rent estimate generation"""
    logger.info("Testing rent estimate generation...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with mock data
        mock_indicators = {
            'median_household_income': 75000,
            'population': 1000000
        }
        
        estimates = service._generate_rent_estimates(
            state_rent_data=None,
            state_property_data=None,
            market_indicators=mock_indicators
        )
        
        assert isinstance(estimates, dict)
        assert len(estimates) > 0
        
        logger.info(f"✅ Rent estimates generated: {len(estimates)} estimates")
        return True
        
    except Exception as e:
        logger.error(f"❌ Rent estimate test failed: {e}")
        return False

def test_investment_metrics():
    """Test investment metric generation"""
    logger.info("Testing investment metric generation...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with mock data
        mock_property = StatePropertyData(
            property_id="test_001",
            address="123 Main St",
            city="San Francisco",
            state="CA",
            market_value=1000000,
            square_footage=5000
        )
        
        mock_indicators = {'median_household_income': 75000}
        mock_rent_estimates = {'office_rent_per_sqft': 3.50}
        
        metrics = service._generate_investment_metrics(
            state_property_data=mock_property,
            market_indicators=mock_indicators,
            rent_estimates=mock_rent_estimates
        )
        
        assert isinstance(metrics, dict)
        
        logger.info(f"✅ Investment metrics generated: {len(metrics)} metrics")
        return True
        
    except Exception as e:
        logger.error(f"❌ Investment metric test failed: {e}")
        return False

def test_json_serialization():
    """Test JSON serialization of data models"""
    logger.info("Testing JSON serialization...")
    
    try:
        # Create test data
        commercial_data = CommercialRealEstateData(
            address="123 Main St, San Francisco, CA",
            latitude=37.7749,
            longitude=-122.4194,
            state="CA",
            data_quality_score=0.8,
            last_updated=datetime.now()
        )
        
        # Test serialization
        data_dict = {
            'address': commercial_data.address,
            'latitude': commercial_data.latitude,
            'longitude': commercial_data.longitude,
            'state': commercial_data.state,
            'data_quality_score': commercial_data.data_quality_score,
            'last_updated': commercial_data.last_updated.isoformat() if commercial_data.last_updated else None
        }
        
        # Test JSON conversion
        json_str = json.dumps(data_dict, indent=2)
        parsed_data = json.loads(json_str)
        
        assert parsed_data['address'] == commercial_data.address
        assert parsed_data['latitude'] == commercial_data.latitude
        
        logger.info("✅ JSON serialization works correctly")
        return True
        
    except Exception as e:
        logger.error(f"❌ JSON serialization test failed: {e}")
        return False

def run_all_tests():
    """Run all basic functionality tests"""
    logger.info("=" * 60)
    logger.info("BASIC FUNCTIONALITY TESTS")
    logger.info("=" * 60)
    
    tests = [
        ("Data Models", test_data_models),
        ("State Configurations", test_state_configurations),
        ("Service Initialization", test_service_initialization),
        ("Data Quality Scoring", test_data_quality_scoring),
        ("Market Indicators", test_market_indicators),
        ("Rent Estimates", test_rent_estimates),
        ("Investment Metrics", test_investment_metrics),
        ("JSON Serialization", test_json_serialization)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        logger.info(f"\n--- {test_name} ---")
        try:
            results[test_name] = test_func()
        except Exception as e:
            logger.error(f"Test {test_name} crashed: {e}")
            results[test_name] = False
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("TEST RESULTS SUMMARY")
    logger.info("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{test_name}: {status}")
    
    logger.info(f"\nOverall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        logger.info("🎉 All basic functionality tests passed!")
        logger.info("The system is ready for API key configuration.")
    else:
        logger.warning(f"⚠️ {total - passed} tests failed. Check the logs above for details.")
    
    return results

if __name__ == "__main__":
    # Run all tests
    results = run_all_tests()
    
    # Exit with appropriate code
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)
