#!/usr/bin/env python3
"""
Startup script for the Comprehensive Commercial Real Estate Data API
"""

import os
import sys
import logging
from datetime import datetime

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from comprehensive_api import app
from environment_config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_environment():
    """Check if required environment variables are set"""
    logger.info("Checking environment configuration...")
    
    required_keys = ['CENSUS_API_KEY', 'BLS_API_KEY']
    optional_keys = ['DATA_GOV_API_KEY', 'RENTCAST_API_KEY', 'FREEWEBAPI_API_KEY']
    
    missing_required = []
    missing_optional = []
    
    for key in required_keys:
        if not os.getenv(key):
            missing_required.append(key)
    
    for key in optional_keys:
        if not os.getenv(key):
            missing_optional.append(key)
    
    if missing_required:
        logger.error(f"Missing required API keys: {', '.join(missing_required)}")
        logger.error("Please set these environment variables before starting the API")
        return False
    
    if missing_optional:
        logger.warning(f"Missing optional API keys: {', '.join(missing_optional)}")
        logger.warning("Some features may not be available")
    
    logger.info("✓ Environment configuration check passed")
    return True

def print_startup_info():
    """Print startup information"""
    logger.info("=" * 60)
    logger.info("COMPREHENSIVE COMMERCIAL REAL ESTATE DATA API")
    logger.info("=" * 60)
    logger.info(f"Startup time: {datetime.now().isoformat()}")
    logger.info(f"Python version: {sys.version}")
    logger.info(f"Working directory: {os.getcwd()}")
    
    # Print configuration
    logger.info("\nConfiguration:")
    logger.info(f"  - API Port: {os.getenv('COMPREHENSIVE_API_PORT', '8003')}")
    logger.info(f"  - API Host: {os.getenv('COMPREHENSIVE_API_HOST', '0.0.0.0')}")
    logger.info(f"  - Debug Mode: {os.getenv('COMPREHENSIVE_API_DEBUG', 'false')}")
    
    # Print available services
    configured_services = config.get_configured_services()
    logger.info(f"\nConfigured Services: {', '.join(configured_services)}")
    
    # Print API endpoints
    logger.info("\nAvailable API Endpoints:")
    endpoints = [
        "GET  /health - Health check",
        "POST /api/data/comprehensive - Get comprehensive data",
        "POST /api/data/batch - Batch process locations",
        "GET  /api/data/states/summary - Get all states summary",
        "GET  /api/data/states/{state} - Get state-specific data",
        "GET  /api/data/discovery - Discover data sources",
        "GET  /api/data/catalog - Get data catalog",
        "GET  /api/data/report - Generate data report",
        "POST /api/data/search - Search properties",
        "POST /api/data/export - Export data"
    ]
    
    for endpoint in endpoints:
        logger.info(f"  {endpoint}")
    
    logger.info("\n" + "=" * 60)

def main():
    """Main startup function"""
    try:
        # Check environment
        if not check_environment():
            sys.exit(1)
        
        # Print startup info
        print_startup_info()
        
        # Get configuration
        port = int(os.getenv('COMPREHENSIVE_API_PORT', 8003))
        host = os.getenv('COMPREHENSIVE_API_HOST', '0.0.0.0')
        debug = os.getenv('COMPREHENSIVE_API_DEBUG', 'false').lower() == 'true'
        
        # Start the API
        logger.info(f"Starting API server on {host}:{port}")
        logger.info("Press Ctrl+C to stop the server")
        
        app.run(host=host, port=port, debug=debug)
        
    except KeyboardInterrupt:
        logger.info("\nShutting down API server...")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Failed to start API server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
