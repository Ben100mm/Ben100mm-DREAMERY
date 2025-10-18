#!/usr/bin/env python3
"""
Debug comprehensive integration error
"""

import os
import sys
import logging
import traceback

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from comprehensive_data_service import ComprehensiveDataService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def debug_comprehensive():
    """Debug comprehensive integration"""
    logger.info("Debugging comprehensive integration...")
    
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
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = debug_comprehensive()
    
    if result:
        logger.info("🎉 Comprehensive integration debug passed!")
    else:
        logger.error("❌ Comprehensive integration debug failed!")
