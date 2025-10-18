#!/usr/bin/env python3
"""
Simple test of Census API without key
"""

import os
import sys
import logging

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from federal_data_service import FederalDataService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_census_simple():
    """Test Census API with simple approach"""
    logger.info("Testing Census API with simple approach...")
    
    try:
        # Create service without API key
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
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Test without API key
    logger.info("Testing without API key...")
    result = test_census_simple()
    
    if result:
        logger.info("🎉 Census API test passed!")
    else:
        logger.error("❌ Census API test failed!")
