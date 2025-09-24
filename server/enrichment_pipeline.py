"""
Property Data Enrichment Pipeline
Processes properties from the database and enriches them with external data
"""

import os
import sys
import json
import logging
import argparse
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import pandas as pd
from sqlalchemy import create_engine, text
from external_data_service import ExternalDataService
from environment_config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PropertyEnrichmentPipeline:
    """Pipeline for enriching property data with external APIs"""
    
    def __init__(self, db_url: str = None):
        self.external_service = ExternalDataService()
        self.db_url = db_url or os.getenv('DATABASE_URL', 'sqlite:///properties.db')
        self.engine = create_engine(self.db_url)
        self.processed_count = 0
        self.error_count = 0
        self.cache_enabled = config.cache_config['enabled']
        
    def get_properties_to_enrich(self, limit: int = None, 
                                days_since_enrichment: int = 30) -> List[Dict[str, Any]]:
        """Get properties that need enrichment from the database"""
        try:
            query = """
            SELECT 
                property_id,
                address,
                latitude,
                longitude,
                list_price,
                description,
                enrichment_date,
                created_at
            FROM properties 
            WHERE latitude IS NOT NULL 
            AND longitude IS NOT NULL
            """
            
            if days_since_enrichment:
                cutoff_date = datetime.now() - timedelta(days=days_since_enrichment)
                query += f" AND (enrichment_date IS NULL OR enrichment_date < '{cutoff_date}')"
            
            if limit:
                query += f" LIMIT {limit}"
            
            with self.engine.connect() as conn:
                result = conn.execute(text(query))
                properties = []
                for row in result:
                    properties.append({
                        'property_id': row.property_id,
                        'address': json.loads(row.address) if isinstance(row.address, str) else row.address,
                        'latitude': float(row.latitude),
                        'longitude': float(row.longitude),
                        'list_price': row.list_price,
                        'description': json.loads(row.description) if isinstance(row.description, str) else row.description,
                        'enrichment_date': row.enrichment_date,
                        'created_at': row.created_at
                    })
                
                logger.info(f"Found {len(properties)} properties to enrich")
                return properties
                
        except Exception as e:
            logger.error(f"Error getting properties to enrich: {e}")
            return []
    
    def save_enriched_property(self, property_id: str, enriched_data: Dict[str, Any]) -> bool:
        """Save enriched data back to the database"""
        try:
            update_query = """
            UPDATE properties 
            SET 
                walk_score = :walk_score,
                bike_score = :bike_score,
                transit_score = :transit_score,
                amenities = :amenities,
                transit_data = :transit_data,
                demographics = :demographics,
                schools = :schools,
                enrichment_date = :enrichment_date,
                updated_at = :updated_at
            WHERE property_id = :property_id
            """
            
            with self.engine.connect() as conn:
                conn.execute(text(update_query), {
                    'property_id': property_id,
                    'walk_score': enriched_data.get('walk_score'),
                    'bike_score': enriched_data.get('bike_score'),
                    'transit_score': enriched_data.get('transit_score'),
                    'amenities': json.dumps(enriched_data.get('amenities', [])),
                    'transit_data': json.dumps(enriched_data.get('transit')),
                    'demographics': json.dumps(enriched_data.get('demographics')),
                    'schools': json.dumps(enriched_data.get('schools', [])),
                    'enrichment_date': datetime.now(),
                    'updated_at': datetime.now()
                })
                conn.commit()
                
            logger.info(f"Saved enriched data for property {property_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving enriched data for property {property_id}: {e}")
            return False
    
    def enrich_properties_batch(self, properties: List[Dict[str, Any]], 
                              batch_size: int = 10) -> Dict[str, int]:
        """Enrich a batch of properties"""
        results = {'processed': 0, 'errors': 0, 'skipped': 0}
        
        for i in range(0, len(properties), batch_size):
            batch = properties[i:i + batch_size]
            logger.info(f"Processing batch {i//batch_size + 1} of {(len(properties)-1)//batch_size + 1}")
            
            for property_data in batch:
                try:
                    # Skip if already enriched recently (if cache is enabled)
                    if (self.cache_enabled and 
                        property_data.get('enrichment_date') and 
                        property_data['enrichment_date'] > datetime.now() - timedelta(hours=config.cache_config['duration_hours'])):
                        results['skipped'] += 1
                        continue
                    
                    # Enrich property
                    enriched = self.external_service.enrich_property(property_data)
                    
                    # Convert to database format
                    enriched_data = {
                        'walk_score': enriched.walk_score_data.walk_score if enriched.walk_score_data else None,
                        'bike_score': enriched.walk_score_data.bike_score if enriched.walk_score_data else None,
                        'transit_score': enriched.walk_score_data.transit_score if enriched.walk_score_data else None,
                        'amenities': [
                            {
                                'name': amenity.name,
                                'type': amenity.type,
                                'rating': amenity.rating,
                                'distance_meters': amenity.distance_meters,
                                'price_level': amenity.price_level
                            } for amenity in enriched.amenities
                        ],
                        'transit': {
                            'nearest_stop': enriched.transit_data.nearest_stop if enriched.transit_data else None,
                            'distance_meters': enriched.transit_data.distance_meters if enriched.transit_data else None,
                            'routes': enriched.transit_data.routes if enriched.transit_data else []
                        } if enriched.transit_data else None,
                        'demographics': {
                            'population': enriched.census_data.population if enriched.census_data else None,
                            'median_age': enriched.census_data.median_age if enriched.census_data else None,
                            'median_income': enriched.census_data.median_income if enriched.census_data else None,
                            'education_level': enriched.census_data.education_level if enriched.census_data else None,
                            'employment_rate': enriched.census_data.employment_rate if enriched.census_data else None,
                            'housing_units': enriched.census_data.housing_units if enriched.census_data else None
                        } if enriched.census_data else None,
                        'schools': [
                            {
                                'name': school.name,
                                'type': school.type,
                                'rating': school.rating,
                                'distance_meters': school.distance_meters,
                                'district': school.district,
                                'enrollment': school.enrollment
                            } for school in enriched.schools
                        ]
                    }
                    
                    # Save to database
                    if self.save_enriched_property(property_data['property_id'], enriched_data):
                        results['processed'] += 1
                    else:
                        results['errors'] += 1
                    
                    # Add delay between properties to respect rate limits
                    import time
                    time.sleep(0.1)
                    
                except Exception as e:
                    logger.error(f"Error enriching property {property_data.get('property_id')}: {e}")
                    results['errors'] += 1
                    continue
        
        return results
    
    def run_enrichment_pipeline(self, limit: int = None, batch_size: int = 10, 
                              days_since_enrichment: int = 30) -> Dict[str, Any]:
        """Run the complete enrichment pipeline"""
        logger.info("Starting property enrichment pipeline")
        
        # Validate configuration
        validation = config.validate_configuration()
        if not validation['valid']:
            logger.error("Configuration validation failed")
            return {'success': False, 'error': 'Configuration validation failed', 'validation': validation}
        
        # Get properties to enrich
        properties = self.get_properties_to_enrich(limit, days_since_enrichment)
        if not properties:
            logger.info("No properties found to enrich")
            return {'success': True, 'message': 'No properties found to enrich'}
        
        # Enrich properties
        start_time = datetime.now()
        results = self.enrich_properties_batch(properties, batch_size)
        end_time = datetime.now()
        
        # Calculate statistics
        total_time = (end_time - start_time).total_seconds()
        avg_time_per_property = total_time / results['processed'] if results['processed'] > 0 else 0
        
        pipeline_results = {
            'success': True,
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'total_time_seconds': total_time,
            'properties_found': len(properties),
            'results': results,
            'average_time_per_property': avg_time_per_property,
            'configuration': validation
        }
        
        logger.info(f"Enrichment pipeline completed: {results}")
        return pipeline_results
    
    def export_enriched_data(self, output_file: str = None) -> str:
        """Export all enriched property data to JSON"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"enriched_properties_export_{timestamp}.json"
        
        try:
            query = """
            SELECT 
                property_id,
                address,
                latitude,
                longitude,
                list_price,
                description,
                walk_score,
                bike_score,
                transit_score,
                amenities,
                transit_data,
                demographics,
                schools,
                enrichment_date
            FROM properties 
            WHERE enrichment_date IS NOT NULL
            """
            
            with self.engine.connect() as conn:
                result = conn.execute(text(query))
                properties = []
                for row in result:
                    property_data = {
                        'property_id': row.property_id,
                        'address': json.loads(row.address) if isinstance(row.address, str) else row.address,
                        'latitude': float(row.latitude),
                        'longitude': float(row.longitude),
                        'list_price': row.list_price,
                        'description': json.loads(row.description) if isinstance(row.description, str) else row.description,
                        'walk_score': row.walk_score,
                        'bike_score': row.bike_score,
                        'transit_score': row.transit_score,
                        'amenities': json.loads(row.amenities) if isinstance(row.amenities, str) else row.amenities,
                        'transit_data': json.loads(row.transit_data) if isinstance(row.transit_data, str) else row.transit_data,
                        'demographics': json.loads(row.demographics) if isinstance(row.demographics, str) else row.demographics,
                        'schools': json.loads(row.schools) if isinstance(row.schools, str) else row.schools,
                        'enrichment_date': row.enrichment_date.isoformat() if row.enrichment_date else None
                    }
                    properties.append(property_data)
            
            with open(output_file, 'w') as f:
                json.dump(properties, f, indent=2)
            
            logger.info(f"Exported {len(properties)} enriched properties to {output_file}")
            return output_file
            
        except Exception as e:
            logger.error(f"Error exporting enriched data: {e}")
            raise

def main():
    """Command line interface for the enrichment pipeline"""
    parser = argparse.ArgumentParser(description='Property Data Enrichment Pipeline')
    parser.add_argument('--limit', type=int, help='Limit number of properties to process')
    parser.add_argument('--batch-size', type=int, default=10, help='Batch size for processing')
    parser.add_argument('--days-since-enrichment', type=int, default=30, 
                       help='Days since last enrichment to reprocess')
    parser.add_argument('--export', action='store_true', help='Export enriched data to JSON')
    parser.add_argument('--output-file', help='Output file for export')
    parser.add_argument('--validate-config', action='store_true', 
                       help='Validate configuration and exit')
    
    args = parser.parse_args()
    
    # Validate configuration if requested
    if args.validate_config:
        validation = config.validate_configuration()
        print(json.dumps(validation, indent=2))
        sys.exit(0 if validation['valid'] else 1)
    
    # Initialize pipeline
    pipeline = PropertyEnrichmentPipeline()
    
    # Export data if requested
    if args.export:
        try:
            output_file = pipeline.export_enriched_data(args.output_file)
            print(f"Exported enriched data to: {output_file}")
        except Exception as e:
            logger.error(f"Export failed: {e}")
            sys.exit(1)
    else:
        # Run enrichment pipeline
        try:
            results = pipeline.run_enrichment_pipeline(
                limit=args.limit,
                batch_size=args.batch_size,
                days_since_enrichment=args.days_since_enrichment
            )
            print(json.dumps(results, indent=2))
        except Exception as e:
            logger.error(f"Enrichment pipeline failed: {e}")
            sys.exit(1)

if __name__ == '__main__':
    main()
