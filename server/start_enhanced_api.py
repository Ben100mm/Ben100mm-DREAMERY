#!/usr/bin/env python3
"""
Startup script for the Enhanced Realtor API with External Data Integration
"""

import os
import sys
import logging
from datetime import datetime

# Add the server directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_realtor_api import app, enhanced_api
from environment_config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def validate_environment():
    """Validate environment configuration"""
    logger.info("Validating environment configuration...")
    
    validation = config.validate_configuration()
    
    if not validation['valid']:
        logger.error("Configuration validation failed:")
        for error in validation['errors']:
            logger.error(f"  - {error}")
        
        logger.warning("Some features may not work properly without proper API keys.")
        logger.info("See environment_config.py for setup instructions.")
    else:
        logger.info("Configuration validation passed!")
    
    # Log configured services
    configured_services = config.get_configured_services()
    if configured_services:
        logger.info(f"Configured services: {', '.join(configured_services)}")
    else:
        logger.warning("No external services configured")
    
    return validation

def print_startup_banner():
    """Print startup banner"""
    banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                    Enhanced Realtor API Server                              ║
║                    External Data Integration Service                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Features:                                                                  ║
║  • Walk Score API Integration                                               ║
║  • Google Places API for Amenities                                          ║
║  • Transit Data Integration                                                 ║
║  • Census Demographics Data                                                 ║
║  • School Information                                                       ║
║  • Property Data Enrichment Pipeline                                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Started: {start_time}                                                      ║
║  Host: {host}:{port}                                                        ║
║  Debug: {debug}                                                             ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """.format(
        start_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        host=config.api_config['host'],
        port=config.api_config['port'],
        debug=config.api_config['debug']
    )
    
    print(banner)

def print_api_endpoints():
    """Print available API endpoints"""
    endpoints = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                            API Endpoints                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  GET  /api/enhanced/properties          - Get enriched properties           ║
║  GET  /api/enhanced/properties/<id>     - Get single enriched property      ║
║  POST /api/enhanced/enrich              - Enrich existing properties        ║
║  GET  /api/enhanced/health              - API health check                  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Example Usage:                                                             ║
║  curl http://localhost:8002/api/enhanced/health                             ║
║  curl http://localhost:8002/api/enhanced/properties?location=San+Francisco  ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """
    
    print(endpoints)

def print_environment_setup():
    """Print environment setup instructions"""
    setup_info = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                        Environment Setup Required                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Set the following environment variables for full functionality:            ║
║                                                                              ║
║  WALKSCORE_API_KEY=your_walkscore_api_key                                   ║
║  GOOGLE_PLACES_API_KEY=your_google_places_api_key                           ║
║  CENSUS_API_KEY=your_census_api_key                                         ║
║  REACT_APP_MAPBOX_TOKEN=your_mapbox_token                                   ║
║                                                                              ║
║  See environment_config.py for detailed setup instructions.                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """
    
    print(setup_info)

def main():
    """Main startup function"""
    print_startup_banner()
    
    # Validate environment
    validation = validate_environment()
    
    if not validation['valid']:
        print_environment_setup()
    
    # Print API endpoints
    print_api_endpoints()
    
    # Start the Flask app
    logger.info("Starting Enhanced Realtor API server...")
    
    try:
        app.run(
            host=config.api_config['host'],
            port=config.api_config['port'],
            debug=config.api_config['debug']
        )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
