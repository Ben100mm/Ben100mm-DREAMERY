from dreamery_property_scraper import DreameryPropertyScraper
import json
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main function to handle API calls"""
    try:
        # Get search parameters from command line
        search_params = json.loads(sys.argv[1])
        
        # Initialize scraper
        scraper = DreameryPropertyScraper()
        
        # Search properties
        properties = scraper.search_properties(**search_params)
        
        # Return results
        result = {
            'success': True,
            'properties': properties,
            'total': len(properties)
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        logger.error(f"API call failed: {e}")
        error_result = {
            'success': False,
            'error': str(e),
            'properties': [],
            'total': 0
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
