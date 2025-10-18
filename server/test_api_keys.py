#!/usr/bin/env python3
"""
Test API Keys for Comprehensive Data Integration
Tests Census and BLS API connectivity with actual API keys
"""

import os
import sys
import logging
from datetime import datetime

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from federal_data_service import FederalDataService
from comprehensive_data_service import ComprehensiveDataService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_census_api():
    """Test Census API with actual API key"""
    logger.info("Testing Census API...")
    
    try:
        service = FederalDataService()
        
        # Test with San Francisco coordinates
        census_data = service.get_census_data(
            latitude=37.7749,
            longitude=-122.4194,
            year=2022
        )
        
        if census_data:
            logger.info("✅ Census API working!")
            logger.info(f"  - State FIPS: {census_data.state_fips}")
            logger.info(f"  - County FIPS: {census_data.county_fips}")
            logger.info(f"  - Population: {census_data.total_population}")
            logger.info(f"  - Median Income: ${census_data.median_household_income}")
            return True
        else:
            logger.warning("⚠️ Census API returned no data")
            return False
            
    except Exception as e:
        logger.error(f"❌ Census API test failed: {e}")
        return False

def test_bls_api():
    """Test BLS API with actual API key"""
    logger.info("Testing BLS API...")
    
    try:
        service = FederalDataService()
        
        # Test with California state code
        bls_data = service.get_bls_data(state_code="06", county_code="075")
        
        if bls_data:
            logger.info("✅ BLS API working!")
            logger.info(f"  - State Code: {bls_data.state_code}")
            logger.info(f"  - Unemployment Rate: {bls_data.unemployment_rate}%")
            logger.info(f"  - Total Employment: {bls_data.total_employment:,}")
            logger.info(f"  - Average Wage: ${bls_data.average_hourly_wage}/hour")
            return True
        else:
            logger.warning("⚠️ BLS API returned no data")
            return False
            
    except Exception as e:
        logger.error(f"❌ BLS API test failed: {e}")
        return False

def test_comprehensive_integration():
    """Test comprehensive integration with API keys"""
    logger.info("Testing comprehensive integration...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with San Francisco
        data = service.get_comprehensive_data(
            latitude=37.7749,
            longitude=-122.4194,
            state="CA",
            county="San Francisco",
            include_federal=True,
            include_state=False,
            include_county=False
        )
        
        if data:
            logger.info("✅ Comprehensive integration working!")
            logger.info(f"  - Data Quality Score: {data.data_quality_score}")
            logger.info(f"  - Data Sources: {data.data_sources}")
            logger.info(f"  - Census Data Available: {data.census_data is not None}")
            logger.info(f"  - BLS Data Available: {data.bls_data is not None}")
            
            if data.census_data:
                logger.info(f"  - Population: {data.census_data.total_population}")
                logger.info(f"  - Median Income: ${data.census_data.median_household_income}")
            
            if data.bls_data:
                logger.info(f"  - Unemployment Rate: {data.bls_data.unemployment_rate}%")
                logger.info(f"  - Total Employment: {data.bls_data.total_employment}")
            
            return True
        else:
            logger.warning("⚠️ Comprehensive integration returned no data")
            return False
            
    except Exception as e:
        logger.error(f"❌ Comprehensive integration test failed: {e}")
        return False

def test_api_rate_limits():
    """Test API rate limiting"""
    logger.info("Testing API rate limits...")
    
    try:
        service = FederalDataService()
        
        # Test multiple calls to check rate limiting
        success_count = 0
        for i in range(3):
            try:
                census_data = service.get_census_data(37.7749, -122.4194)
                if census_data:
                    success_count += 1
                logger.info(f"  Call {i+1}: {'Success' if census_data else 'No data'}")
            except Exception as e:
                logger.warning(f"  Call {i+1}: Failed - {e}")
        
        logger.info(f"✅ Rate limiting test: {success_count}/3 calls successful")
        return success_count > 0
        
    except Exception as e:
        logger.error(f"❌ Rate limiting test failed: {e}")
        return False

def run_all_tests():
    """Run all API key tests"""
    logger.info("=" * 60)
    logger.info("API KEY TESTS")
    logger.info("=" * 60)
    
    tests = [
        ("Census API", test_census_api),
        ("BLS API", test_bls_api),
        ("Comprehensive Integration", test_comprehensive_integration),
        ("Rate Limiting", test_api_rate_limits)
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
    logger.info("API KEY TEST RESULTS")
    logger.info("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{test_name}: {status}")
    
    logger.info(f"\nOverall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        logger.info("🎉 All API key tests passed! System is fully functional!")
    elif passed > 0:
        logger.info("⚠️ Some tests passed. System is partially functional.")
    else:
        logger.error("❌ All tests failed. Check API key configuration.")
    
    return results

if __name__ == "__main__":
    # Check if API keys are configured
    census_key = os.getenv('CENSUS_API_KEY')
    bls_key = os.getenv('BLS_API_KEY')
    
    if not census_key:
        logger.warning("⚠️ CENSUS_API_KEY not found in environment (optional - Census API works without key)")
    
    if not bls_key:
        logger.warning("⚠️ BLS_API_KEY not found in environment (optional)")
    
    logger.info(f"Census API Key: {'✅ Configured' if census_key else '⚠️ Missing (using public access)'}")
    logger.info(f"BLS API Key: {'✅ Configured' if bls_key else '❌ Missing'}")
    
    # Run all tests
    results = run_all_tests()
    
    # Exit with appropriate code
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)
