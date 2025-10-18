"""
Test script for comprehensive data integration
Tests the integration with sample data from multiple states
"""

import os
import sys
import json
import logging
from datetime import datetime

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from comprehensive_data_service import ComprehensiveDataService
from data_discovery_service import DataDiscoveryService
from state_data_models import StateCode

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_federal_data_integration():
    """Test federal data integration"""
    logger.info("Testing federal data integration...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with San Francisco coordinates
        latitude = 37.7749
        longitude = -122.4194
        state = "CA"
        county = "San Francisco"
        
        # Get federal data only
        data = service.get_comprehensive_data(
            latitude=latitude,
            longitude=longitude,
            state=state,
            county=county,
            include_federal=True,
            include_state=False,
            include_county=False
        )
        
        if data:
            logger.info(f"✓ Federal data integration successful")
            logger.info(f"  - Data quality score: {data.data_quality_score}")
            logger.info(f"  - Data sources: {data.data_sources}")
            logger.info(f"  - Census data available: {data.census_data is not None}")
            logger.info(f"  - BLS data available: {data.bls_data is not None}")
            return True
        else:
            logger.error("✗ Federal data integration failed - no data returned")
            return False
            
    except Exception as e:
        logger.error(f"✗ Federal data integration failed: {e}")
        return False

def test_state_data_integration():
    """Test state data integration"""
    logger.info("Testing state data integration...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with multiple states
        test_locations = [
            {"latitude": 37.7749, "longitude": -122.4194, "state": "CA", "county": "San Francisco"},
            {"latitude": 40.7128, "longitude": -74.0060, "state": "NY", "county": "New York"},
            {"latitude": 41.8781, "longitude": -87.6298, "state": "IL", "county": "Cook"},
            {"latitude": 29.7604, "longitude": -95.3698, "state": "TX", "county": "Harris"},
            {"latitude": 25.7617, "longitude": -80.1918, "state": "FL", "county": "Miami-Dade"}
        ]
        
        successful_tests = 0
        
        for location in test_locations:
            try:
                data = service.get_comprehensive_data(
                    latitude=location["latitude"],
                    longitude=location["longitude"],
                    state=location["state"],
                    county=location["county"],
                    include_federal=False,
                    include_state=True,
                    include_county=False
                )
                
                if data and data.data_quality_score > 0:
                    logger.info(f"✓ State data for {location['state']}: {data.data_quality_score}")
                    successful_tests += 1
                else:
                    logger.warning(f"⚠ State data for {location['state']}: No data or low quality")
                    
            except Exception as e:
                logger.error(f"✗ State data for {location['state']} failed: {e}")
        
        logger.info(f"State data integration: {successful_tests}/{len(test_locations)} successful")
        return successful_tests > 0
        
    except Exception as e:
        logger.error(f"✗ State data integration failed: {e}")
        return False

def test_data_discovery():
    """Test data discovery service"""
    logger.info("Testing data discovery service...")
    
    try:
        discovery_service = DataDiscoveryService()
        
        # Test federal source discovery
        federal_sources = discovery_service.discover_federal_sources()
        logger.info(f"✓ Discovered {len(federal_sources)} federal sources")
        
        # Test state source discovery for a few states
        test_states = [StateCode.CA, StateCode.NY, StateCode.TX, StateCode.FL, StateCode.IL]
        state_sources = discovery_service.discover_state_sources()
        
        states_with_data = 0
        for state in test_states:
            if state.name in state_sources and state_sources[state.name].get('datasets_found', 0) > 0:
                states_with_data += 1
                logger.info(f"✓ {state.value}: {state_sources[state.name]['datasets_found']} datasets")
        
        logger.info(f"State discovery: {states_with_data}/{len(test_states)} states with data")
        return states_with_data > 0
        
    except Exception as e:
        logger.error(f"✗ Data discovery failed: {e}")
        return False

def test_comprehensive_integration():
    """Test comprehensive data integration"""
    logger.info("Testing comprehensive data integration...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test with a high-data state (California)
        data = service.get_comprehensive_data(
            latitude=37.7749,
            longitude=-122.4194,
            state="CA",
            county="San Francisco",
            include_federal=True,
            include_state=True,
            include_county=True
        )
        
        if data:
            logger.info(f"✓ Comprehensive integration successful")
            logger.info(f"  - Data quality score: {data.data_quality_score}")
            logger.info(f"  - Data sources: {data.data_sources}")
            logger.info(f"  - Market indicators: {len(data.market_indicators)}")
            logger.info(f"  - Rent estimates: {len(data.rent_estimates)}")
            logger.info(f"  - Investment metrics: {len(data.investment_metrics)}")
            return True
        else:
            logger.error("✗ Comprehensive integration failed - no data returned")
            return False
            
    except Exception as e:
        logger.error(f"✗ Comprehensive integration failed: {e}")
        return False

def test_batch_processing():
    """Test batch processing capabilities"""
    logger.info("Testing batch processing...")
    
    try:
        service = ComprehensiveDataService()
        
        # Test batch processing with multiple locations
        locations = [
            {"latitude": 37.7749, "longitude": -122.4194, "state": "CA", "county": "San Francisco"},
            {"latitude": 40.7128, "longitude": -74.0060, "state": "NY", "county": "New York"},
            {"latitude": 41.8781, "longitude": -87.6298, "state": "IL", "county": "Cook"}
        ]
        
        results = service.batch_process_locations(locations)
        
        if results and len(results) > 0:
            logger.info(f"✓ Batch processing successful: {len(results)} locations processed")
            
            # Check data quality
            avg_quality = sum(r.data_quality_score for r in results if r.data_quality_score) / len(results)
            logger.info(f"  - Average data quality: {avg_quality:.2f}")
            
            return True
        else:
            logger.error("✗ Batch processing failed - no results")
            return False
            
    except Exception as e:
        logger.error(f"✗ Batch processing failed: {e}")
        return False

def test_data_export():
    """Test data export functionality"""
    logger.info("Testing data export...")
    
    try:
        service = ComprehensiveDataService()
        
        # Get sample data
        data = service.get_comprehensive_data(
            latitude=37.7749,
            longitude=-122.4194,
            state="CA",
            county="San Francisco"
        )
        
        if data:
            # Test JSON export
            output_file = service.save_comprehensive_data(data, "test_export.json")
            
            if os.path.exists(output_file):
                logger.info(f"✓ Data export successful: {output_file}")
                
                # Check file size
                file_size = os.path.getsize(output_file)
                logger.info(f"  - File size: {file_size} bytes")
                
                # Clean up test file
                os.remove(output_file)
                return True
            else:
                logger.error("✗ Data export failed - file not created")
                return False
        else:
            logger.error("✗ Data export failed - no data to export")
            return False
            
    except Exception as e:
        logger.error(f"✗ Data export failed: {e}")
        return False

def run_all_tests():
    """Run all integration tests"""
    logger.info("=" * 60)
    logger.info("COMPREHENSIVE DATA INTEGRATION TESTS")
    logger.info("=" * 60)
    
    tests = [
        ("Federal Data Integration", test_federal_data_integration),
        ("State Data Integration", test_state_data_integration),
        ("Data Discovery", test_data_discovery),
        ("Comprehensive Integration", test_comprehensive_integration),
        ("Batch Processing", test_batch_processing),
        ("Data Export", test_data_export)
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
        status = "✓ PASS" if result else "✗ FAIL"
        logger.info(f"{test_name}: {status}")
    
    logger.info(f"\nOverall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        logger.info("🎉 All tests passed! Integration is working correctly.")
    else:
        logger.warning(f"⚠ {total - passed} tests failed. Check the logs above for details.")
    
    return results

if __name__ == "__main__":
    # Run all tests
    results = run_all_tests()
    
    # Exit with appropriate code
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)
