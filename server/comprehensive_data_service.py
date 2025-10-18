"""
Comprehensive Commercial Real Estate Data Integration Service
Combines federal, state, and county data sources for all 50 states
"""

import os
import json
import time
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import asdict
from datetime import datetime, timedelta
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import pandas as pd

from state_data_models import (
    StateCode, DataSource, CommercialRealEstateData, StateDataSummary,
    FederalCensusData, FederalBLSData, StatePropertyData, StateCommercialRentData,
    CountyAssessorData
)
from federal_data_service import FederalDataService
from state_data_service import StateDataService
from data_discovery_service import DataDiscoveryService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ComprehensiveDataService:
    """Comprehensive service integrating all government data sources"""
    
    def __init__(self):
        self.federal_service = FederalDataService()
        self.state_service = StateDataService()
        self.discovery_service = DataDiscoveryService()
        self.session = self._create_session()
        self.cache = {}
        self.rate_limits = {}
        
    def _create_session(self) -> requests.Session:
        """Create HTTP session with retry strategy"""
        session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        return session
    
    def get_comprehensive_data(self, latitude: float, longitude: float,
                             state: str, county: str = None, city: str = None,
                             include_federal: bool = True, include_state: bool = True,
                             include_county: bool = True) -> CommercialRealEstateData:
        """Get comprehensive commercial real estate data from all sources"""
        
        logger.info(f"Getting comprehensive data for {latitude}, {longitude} in {state}")
        
        # Initialize data components
        census_data = None
        bls_data = None
        state_property_data = None
        state_rent_data = None
        county_data = None
        
        data_sources = []
        confidence_scores = []
        
        # Get federal data
        if include_federal:
            try:
                logger.info("Fetching federal data...")
                federal_data = self.federal_service.get_commercial_real_estate_data(
                    latitude, longitude, state, county
                )
                if federal_data:
                    census_data = federal_data.census_data
                    bls_data = federal_data.bls_data
                    data_sources.extend(federal_data.data_sources)
                    confidence_scores.append(federal_data.confidence_score or 0.5)
            except Exception as e:
                logger.error(f"Error fetching federal data: {e}")
        
        # Get state data
        if include_state:
            try:
                logger.info("Fetching state data...")
                state_code = StateCode[state.upper()] if state.upper() in StateCode.__members__ else None
                if state_code:
                    state_data = self.state_service.get_commercial_real_estate_data(
                        latitude, longitude, state, county
                    )
                    if state_data:
                        state_property_data = state_data.state_property_data
                        state_rent_data = state_data.state_rent_data
                        county_data = state_data.county_data
                        data_sources.extend(state_data.data_sources)
                        confidence_scores.append(state_data.confidence_score or 0.5)
            except Exception as e:
                logger.error(f"Error fetching state data: {e}")
        
        # Get county data if not already included
        if include_county and not county_data:
            try:
                logger.info("Fetching county data...")
                state_code = StateCode[state.upper()] if state.upper() in StateCode.__members__ else None
                if state_code and county:
                    county_data = self.state_service.get_county_data(state_code, county)
                    if county_data:
                        data_sources.append('county')
                        confidence_scores.append(0.7)
            except Exception as e:
                logger.error(f"Error fetching county data: {e}")
        
        # Calculate overall data quality score
        data_quality_score = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.0
        
        # Generate market indicators
        market_indicators = self._generate_market_indicators(
            census_data, bls_data, state_property_data, state_rent_data
        )
        
        # Generate rent estimates
        rent_estimates = self._generate_rent_estimates(
            state_rent_data, state_property_data, market_indicators
        )
        
        # Generate investment metrics
        investment_metrics = self._generate_investment_metrics(
            state_property_data, market_indicators, rent_estimates
        )
        
        return CommercialRealEstateData(
            address=f"{latitude}, {longitude}",  # Would need reverse geocoding
            latitude=latitude,
            longitude=longitude,
            state=state,
            county=county,
            city=city,
            census_data=census_data,
            bls_data=bls_data,
            state_property_data=state_property_data,
            state_rent_data=state_rent_data,
            county_data=county_data,
            market_indicators=market_indicators,
            rent_estimates=rent_estimates,
            investment_metrics=investment_metrics,
            data_quality_score=data_quality_score,
            last_updated=datetime.now(),
            data_sources=data_sources,
            confidence_score=data_quality_score
        )
    
    def _generate_market_indicators(self, census_data: Optional[FederalCensusData],
                                  bls_data: Optional[FederalBLSData],
                                  state_property_data: Optional[StatePropertyData],
                                  state_rent_data: Optional[StateCommercialRentData]) -> Dict[str, Any]:
        """Generate market indicators from available data"""
        indicators = {}
        
        # Population indicators
        if census_data:
            indicators['population'] = census_data.total_population
            indicators['median_age'] = census_data.median_age
            indicators['median_income'] = census_data.median_household_income
            indicators['poverty_rate'] = census_data.poverty_rate
        
        # Employment indicators
        if bls_data:
            indicators['unemployment_rate'] = bls_data.unemployment_rate
            indicators['total_employment'] = bls_data.total_employment
            indicators['average_wage'] = bls_data.average_hourly_wage
        
        # Property indicators
        if state_property_data:
            indicators['assessed_value'] = state_property_data.assessed_value
            indicators['market_value'] = state_property_data.market_value
            indicators['last_sale_price'] = state_property_data.last_sale_price
            indicators['sale_price_per_sqft'] = state_property_data.sale_price_per_sqft
        
        # Rent indicators
        if state_rent_data:
            indicators['office_rent_per_sqft'] = state_rent_data.office_rent_per_sqft
            indicators['retail_rent_per_sqft'] = state_rent_data.retail_rent_per_sqft
            indicators['vacancy_rate'] = state_rent_data.vacancy_rate
            indicators['rent_growth_rate'] = state_rent_data.rent_growth_rate
        
        # Calculate derived indicators
        if indicators.get('population') and indicators.get('total_employment'):
            indicators['employment_rate'] = indicators['total_employment'] / indicators['population']
        
        if indicators.get('median_income') and indicators.get('office_rent_per_sqft'):
            indicators['income_to_rent_ratio'] = indicators['median_income'] / (indicators['office_rent_per_sqft'] * 12)
        
        return indicators
    
    def _generate_rent_estimates(self, state_rent_data: Optional[StateCommercialRentData],
                               state_property_data: Optional[StatePropertyData],
                               market_indicators: Dict[str, Any]) -> Dict[str, float]:
        """Generate rent estimates for different property types"""
        estimates = {}
        
        # Use state rent data if available
        if state_rent_data:
            if state_rent_data.office_rent_per_sqft:
                estimates['office_rent_per_sqft'] = state_rent_data.office_rent_per_sqft
            if state_rent_data.retail_rent_per_sqft:
                estimates['retail_rent_per_sqft'] = state_rent_data.retail_rent_per_sqft
            if state_rent_data.industrial_rent_per_sqft:
                estimates['industrial_rent_per_sqft'] = state_rent_data.industrial_rent_per_sqft
            if state_rent_data.warehouse_rent_per_sqft:
                estimates['warehouse_rent_per_sqft'] = state_rent_data.warehouse_rent_per_sqft
            if state_rent_data.multifamily_rent_per_unit:
                estimates['multifamily_rent_per_unit'] = state_rent_data.multifamily_rent_per_unit
        
        # Generate estimates based on market indicators if no direct data
        if not estimates and market_indicators:
            # Use median income as a proxy for rent capacity
            median_income = market_indicators.get('median_household_income', 50000)
            
            # Rough estimates based on income (these would need refinement)
            estimates['office_rent_per_sqft'] = median_income / 10000  # $5/sqft per $50k income
            estimates['retail_rent_per_sqft'] = median_income / 12000  # $4.17/sqft per $50k income
            estimates['industrial_rent_per_sqft'] = median_income / 15000  # $3.33/sqft per $50k income
            estimates['warehouse_rent_per_sqft'] = median_income / 18000  # $2.78/sqft per $50k income
            estimates['multifamily_rent_per_unit'] = median_income / 20  # $2,500/month per $50k income
        
        return estimates
    
    def _generate_investment_metrics(self, state_property_data: Optional[StatePropertyData],
                                   market_indicators: Dict[str, Any],
                                   rent_estimates: Dict[str, float]) -> Dict[str, float]:
        """Generate investment metrics"""
        metrics = {}
        
        # Cap rate calculation
        if state_property_data and state_property_data.market_value and rent_estimates:
            # Estimate NOI based on rent estimates
            estimated_noi = sum(rent_estimates.values()) * 1000  # Rough estimate
            if state_property_data.market_value > 0:
                metrics['cap_rate'] = estimated_noi / state_property_data.market_value
        
        # Price per square foot
        if state_property_data and state_property_data.square_footage and state_property_data.market_value:
            metrics['price_per_sqft'] = state_property_data.market_value / state_property_data.square_footage
        
        # Market strength indicators
        if market_indicators:
            # Population growth proxy (would need historical data)
            metrics['market_strength'] = min(1.0, (market_indicators.get('median_household_income', 0) / 50000))
            
            # Employment stability
            unemployment_rate = market_indicators.get('unemployment_rate', 0.05)
            metrics['employment_stability'] = max(0, 1 - unemployment_rate)
        
        return metrics
    
    def get_all_states_data_summary(self) -> Dict[str, StateDataSummary]:
        """Get data summary for all states"""
        logger.info("Generating data summary for all states...")
        
        summaries = {}
        for state in StateCode:
            try:
                summary = self.state_service.get_state_data_summary(state)
                summaries[state.name] = summary
                time.sleep(0.1)  # Rate limiting
            except Exception as e:
                logger.error(f"Error getting summary for {state.value}: {e}")
                continue
        
        return summaries
    
    def discover_and_catalog_all_sources(self) -> Dict[str, Any]:
        """Discover and catalog all available data sources"""
        logger.info("Starting comprehensive data discovery...")
        
        # Discover federal sources
        federal_sources = self.discovery_service.discover_federal_sources()
        
        # Discover state sources
        state_sources = self.discovery_service.discover_state_sources()
        
        # Generate comprehensive catalog
        catalog = {
            'discovery_date': datetime.now().isoformat(),
            'federal_sources': federal_sources,
            'state_sources': state_sources,
            'integration_status': self._assess_integration_status(),
            'recommendations': self._generate_integration_recommendations()
        }
        
        return catalog
    
    def _assess_integration_status(self) -> Dict[str, Any]:
        """Assess current integration status"""
        return {
            'federal_integration': 'complete',
            'state_integration': 'partial',
            'county_integration': 'minimal',
            'data_quality_score': 0.7,
            'coverage_percentage': 0.6,
            'last_assessment': datetime.now().isoformat()
        }
    
    def _generate_integration_recommendations(self) -> List[Dict[str, Any]]:
        """Generate recommendations for improving integration"""
        return [
            {
                'priority': 'high',
                'action': 'Implement missing state APIs',
                'impact': 'Increase data coverage by 30%',
                'effort': 'medium'
            },
            {
                'priority': 'high',
                'action': 'Add county assessor data integration',
                'impact': 'Improve property-level accuracy',
                'effort': 'high'
            },
            {
                'priority': 'medium',
                'action': 'Implement data quality monitoring',
                'impact': 'Ensure data freshness and accuracy',
                'effort': 'low'
            },
            {
                'priority': 'medium',
                'action': 'Add real-time data updates',
                'impact': 'Improve data timeliness',
                'effort': 'high'
            }
        ]
    
    def batch_process_locations(self, locations: List[Dict[str, Any]]) -> List[CommercialRealEstateData]:
        """Process multiple locations in batch"""
        logger.info(f"Processing {len(locations)} locations...")
        
        results = []
        for i, location in enumerate(locations):
            try:
                data = self.get_comprehensive_data(
                    latitude=location['latitude'],
                    longitude=location['longitude'],
                    state=location['state'],
                    county=location.get('county'),
                    city=location.get('city')
                )
                results.append(data)
                
                # Progress logging
                if (i + 1) % 10 == 0:
                    logger.info(f"Processed {i + 1}/{len(locations)} locations")
                
                # Rate limiting
                time.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Error processing location {i}: {e}")
                continue
        
        return results
    
    def save_comprehensive_data(self, data: CommercialRealEstateData, 
                              output_file: str = None) -> str:
        """Save comprehensive data to JSON file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"comprehensive_data_{timestamp}.json"
        
        # Convert dataclass to dictionary
        data_dict = asdict(data)
        
        # Convert datetime objects to strings
        def convert_datetime(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            elif isinstance(obj, dict):
                return {k: convert_datetime(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_datetime(item) for item in obj]
            else:
                return obj
        
        data_dict = convert_datetime(data_dict)
        
        with open(output_file, 'w') as f:
            json.dump(data_dict, f, indent=2)
        
        logger.info(f"Saved comprehensive data to {output_file}")
        return output_file
    
    def generate_data_report(self) -> Dict[str, Any]:
        """Generate comprehensive data report"""
        logger.info("Generating comprehensive data report...")
        
        # Get all states summary
        states_summary = self.get_all_states_data_summary()
        
        # Discover sources
        sources_catalog = self.discover_and_catalog_all_sources()
        
        # Calculate statistics
        total_states = len(states_summary)
        states_with_federal = sum(1 for s in states_summary.values() if s.has_federal_data)
        states_with_state = sum(1 for s in states_summary.values() if s.has_state_data)
        states_with_county = sum(1 for s in states_summary.values() if s.has_county_data)
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_states': total_states,
                'states_with_federal_data': states_with_federal,
                'states_with_state_data': states_with_state,
                'states_with_county_data': states_with_county,
                'federal_coverage': states_with_federal / total_states,
                'state_coverage': states_with_state / total_states,
                'county_coverage': states_with_county / total_states
            },
            'state_details': states_summary,
            'sources_catalog': sources_catalog,
            'recommendations': self._generate_integration_recommendations()
        }
        
        return report

def main():
    """Example usage of the Comprehensive Data Service"""
    service = ComprehensiveDataService()
    
    # Example location (San Francisco)
    latitude = 37.7749
    longitude = -122.4194
    state = "CA"
    county = "San Francisco"
    
    # Get comprehensive data
    data = service.get_comprehensive_data(
        latitude=latitude,
        longitude=longitude,
        state=state,
        county=county
    )
    
    print(f"Comprehensive data: {data.data_quality_score}")
    print(f"Data sources: {data.data_sources}")
    
    # Generate report
    report = service.generate_data_report()
    print(f"Data coverage: {report['summary']['federal_coverage']:.2%} federal, {report['summary']['state_coverage']:.2%} state")
    
    # Save data
    output_file = service.save_comprehensive_data(data)
    print(f"Data saved to: {output_file}")

if __name__ == "__main__":
    main()
