import pytest
import pandas as pd
from dreamery_property_scraper import DreameryPropertyScraper
from models import Property, PropertyData


@pytest.mark.integration
class TestDreameryIntegration:
    """Integration tests for Dreamery property scraping"""
    
    def test_full_property_search_workflow(self):
        """Test complete property search workflow"""
        scraper = DreameryPropertyScraper()
        
        # Test basic search
        results = scraper.search_properties(
            location="Dallas, TX",
            listing_type="for_sale",
            limit=5
        )
        
        assert results is not None
        assert isinstance(results, list)
        
        if len(results) > 0:
            # Verify each result is a PropertyData object
            for result in results:
                assert hasattr(result, 'property_id')
                assert result.property_id is not None
    
    def test_advanced_search_workflow(self):
        """Test advanced property search workflow"""
        scraper = DreameryPropertyScraper()
        
        # Test advanced search
        results = scraper.search_properties_advanced(
            location="Phoenix, AZ",
            listing_type="for_sale",
            limit=5,
            extra_property_data=True
        )
        
        assert results is not None
        assert isinstance(results, list)
        
        if len(results) > 0:
            # Verify each result is a Property object
            for result in results:
                assert isinstance(result, Property)
                assert result.property_id is not None
    
    def test_comprehensive_search_workflow(self):
        """Test comprehensive property search workflow"""
        scraper = DreameryPropertyScraper()
        
        # Test comprehensive search
        results = scraper.search_properties_comprehensive(
            location="San Francisco, CA",
            listing_type="for_sale",
            limit=3,
            extra_property_data=True
        )
        
        assert results is not None
        assert isinstance(results, list)
        
        if len(results) > 0:
            # Verify each result is a Property object with enhanced data
            for result in results:
                assert isinstance(result, Property)
                assert result.property_id is not None
                # Check for enhanced data fields
                assert hasattr(result, 'address')
                assert hasattr(result, 'description')
    
    @pytest.mark.slow
    def test_multiple_listing_types(self):
        """Test searching across different listing types"""
        scraper = DreameryPropertyScraper()
        
        listing_types = ["for_sale", "for_rent", "sold"]
        
        for listing_type in listing_types:
            results = scraper.search_properties(
                location="Atlanta, GA",
                listing_type=listing_type,
                limit=3
            )
            
            assert results is not None
            assert isinstance(results, list)
            # Results may be empty for some listing types in certain areas
    
    @pytest.mark.slow
    def test_location_variations(self):
        """Test different location input formats"""
        scraper = DreameryPropertyScraper()
        
        locations = [
            "Dallas, TX",           # City, State
            "75201",               # ZIP code
            "Los Angeles, CA",     # Major city
            "Seattle, WA"          # Different region
        ]
        
        for location in locations:
            results = scraper.search_properties(
                location=location,
                listing_type="for_sale",
                limit=2
            )
            
            assert results is not None
            assert isinstance(results, list)
            # Results may vary by location
    
    def test_error_handling(self):
        """Test error handling for invalid inputs"""
        scraper = DreameryPropertyScraper()
        
        # Test invalid location
        results = scraper.search_properties(
            location="InvalidLocation123456789",
            listing_type="for_sale",
            limit=5
        )
        
        # Should return empty list, not raise exception
        assert results is not None
        assert isinstance(results, list)
        assert len(results) == 0
    
    def test_session_management(self):
        """Test session management and connection handling"""
        # Test enhanced session
        enhanced_scraper = DreameryPropertyScraper(use_enhanced_session=True)
        assert enhanced_scraper.session is not None
        
        # Test legacy session
        legacy_scraper = DreameryPropertyScraper(use_enhanced_session=False)
        assert legacy_scraper.session is not None
        
        # Test basic functionality with both
        for scraper in [enhanced_scraper, legacy_scraper]:
            location_info = scraper._handle_location("Dallas, TX")
            # Should either return valid location info or None (not raise exception)
            assert location_info is None or isinstance(location_info, dict)
    
    def test_property_details_extraction(self):
        """Test property details extraction"""
        scraper = DreameryPropertyScraper()
        
        # Get a property
        results = scraper.search_properties(
            location="Austin, TX",
            listing_type="for_sale",
            limit=1
        )
        
        if len(results) > 0:
            property_data = results[0]
            
            # Verify basic fields exist
            assert hasattr(property_data, 'property_id')
            assert hasattr(property_data, 'address')
            
            # Check that address is properly formatted
            if hasattr(property_data, 'address') and property_data.address:
                assert isinstance(property_data.address, str) or hasattr(property_data.address, 'formatted_address')
    
    def test_data_consistency(self):
        """Test data consistency across different search methods"""
        scraper = DreameryPropertyScraper()
        
        location = "Denver, CO"
        
        # Get results from different methods
        basic_results = scraper.search_properties(
            location=location,
            listing_type="for_sale",
            limit=3
        )
        
        advanced_results = scraper.search_properties_advanced(
            location=location,
            listing_type="for_sale",
            limit=3,
            extra_property_data=False
        )
        
        # Both should return valid results (or both empty)
        assert isinstance(basic_results, list)
        assert isinstance(advanced_results, list)
        
        # If both have results, check for consistency
        if len(basic_results) > 0 and len(advanced_results) > 0:
            # Both should have property_id fields
            basic_ids = [getattr(p, 'property_id', None) for p in basic_results]
            advanced_ids = [getattr(p, 'property_id', None) for p in advanced_results]
            
            assert all(id is not None for id in basic_ids)
            assert all(id is not None for id in advanced_ids)
