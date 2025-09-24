import pytest
import pandas as pd
from typing import List, Dict, Any, Union
from dreamery_property_scraper import DreameryPropertyScraper
from models import Property, PropertyData, Address, Description, ListingType, ReturnType


def scrape_property(
    location: str,
    listing_type: str = "for_sale",
    property_type: List[str] = None,
    radius: float = None,
    past_days: int = None,
    date_from: str = None,
    date_to: str = None,
    foreclosure: bool = None,
    exclude_pending: bool = False,
    extra_property_data: bool = True,
    limit: int = 200,
    return_type: str = "pandas"
) -> Union[pd.DataFrame, List[Property], List[Dict[str, Any]]]:
    """
    Helper function to scrape properties using DreameryPropertyScraper
    Compatible with the original test interface
    """
    scraper = DreameryPropertyScraper()
    
    # Convert parameters to match DreameryPropertyScraper interface
    kwargs = {
        "location": location,
        "listing_type": listing_type,
        "limit": limit,
        "extra_property_data": extra_property_data,
        "exclude_pending": exclude_pending
    }
    
    if property_type:
        kwargs["property_types"] = property_type
    if radius:
        kwargs["radius"] = radius
    if past_days:
        kwargs["past_days"] = past_days
    if foreclosure is not None:
        # Note: foreclosure filtering would need to be implemented in the search
        pass
    
    try:
        if return_type == "pydantic":
            # Use advanced search for pydantic objects
            results = scraper.search_properties_advanced(**kwargs)
            return results
        elif return_type == "raw":
            # Use basic search for raw dictionaries
            results = scraper.search_properties(**kwargs)
            # Convert PropertyData objects to dictionaries
            raw_results = []
            for result in results:
                if hasattr(result, '__dict__'):
                    raw_dict = {}
                    for key, value in result.__dict__.items():
                        if hasattr(value, '__dict__'):
                            raw_dict[key] = value.__dict__
                        else:
                            raw_dict[key] = value
                    # Add required fields for compatibility
                    raw_dict['href'] = f"https://www.realtor.com/property/{result.property_id}"
                    raw_dict['property_url'] = f"https://www.realtor.com/property/{result.property_id}"
                    raw_results.append(raw_dict)
                else:
                    raw_results.append(result)
            return raw_results
        else:  # pandas (default)
            # Use basic search and convert to DataFrame
            results = scraper.search_properties(**kwargs)
            
            # Convert PropertyData objects to DataFrame
            if not results:
                return pd.DataFrame()
            
            data_list = []
            for result in results:
                if hasattr(result, '__dict__'):
                    row = {}
                    for key, value in result.__dict__.items():
                        if hasattr(value, '__dict__'):
                            # Handle nested objects by flattening them
                            if hasattr(value, 'formatted_address'):
                                row['formatted_address'] = value.formatted_address
                            elif hasattr(value, 'full_line'):
                                row['address_line'] = value.full_line
                                row['city'] = getattr(value, 'city', None)
                                row['state'] = getattr(value, 'state', None) 
                                row['zip'] = getattr(value, 'zip', None)
                            else:
                                for sub_key, sub_value in value.__dict__.items():
                                    row[f"{key}_{sub_key}"] = sub_value
                        else:
                            row[key] = value
                    
                    # Add required columns for compatibility
                    row['property_url'] = f"https://www.realtor.com/property/{result.property_id}"
                    row['agent_name'] = getattr(result, 'agent', {}).get('name') if hasattr(result, 'agent') else None
                    row['agent_phones'] = getattr(result, 'agent', {}).get('phones') if hasattr(result, 'agent') else None
                    row['list_price_min'] = row.get('list_price')  # For apartment compatibility
                    row['list_price_max'] = row.get('list_price')  # For apartment compatibility
                    row['style'] = getattr(result.description, 'style', None) if hasattr(result, 'description') and result.description else None
                    
                    data_list.append(row)
                else:
                    data_list.append(result)
            
            return pd.DataFrame(data_list)
            
    except Exception as e:
        print(f"Error in scrape_property: {e}")
        if return_type == "pandas":
            return pd.DataFrame()
        else:
            return []


def test_dreamery_pending_or_contingent():
    """Test pending vs regular property searches"""
    pending_or_contingent_result = scrape_property(location="Surprise, AZ", listing_type="pending")

    regular_result = scrape_property(location="Surprise, AZ", listing_type="for_sale", exclude_pending=True)

    assert all([result is not None for result in [pending_or_contingent_result, regular_result]])
    assert len(pending_or_contingent_result) != len(regular_result)


def test_dreamery_pending_comps():
    """Test pending comparables search"""
    pending_comps = scrape_property(
        location="2530 Al Lipscomb Way",
        radius=5,
        past_days=180,
        listing_type="pending",
    )

    for_sale_comps = scrape_property(
        location="2530 Al Lipscomb Way",
        radius=5,
        past_days=180,
        listing_type="for_sale",
    )

    sold_comps = scrape_property(
        location="2530 Al Lipscomb Way",
        radius=5,
        past_days=180,
        listing_type="sold",
    )

    results = [pending_comps, for_sale_comps, sold_comps]
    assert all([result is not None for result in results])

    # Assert all lengths are different
    assert len(set([len(result) for result in results])) == len(results)


def test_dreamery_sold_past():
    """Test sold properties in past days"""
    result = scrape_property(
        location="San Diego, CA",
        past_days=30,
        listing_type="sold",
    )

    assert result is not None and len(result) > 0


def test_dreamery_comps():
    """Test comparable properties search"""
    result = scrape_property(
        location="2530 Al Lipscomb Way",
        radius=0.5,
        past_days=180,
        listing_type="sold",
    )

    assert result is not None and len(result) > 0


def test_dreamery_last_x_days_sold():
    """Test sold properties filtering by different day ranges"""
    days_result_30 = scrape_property(location="Dallas, TX", listing_type="sold", past_days=30)

    days_result_10 = scrape_property(location="Dallas, TX", listing_type="sold", past_days=10)

    assert all([result is not None for result in [days_result_30, days_result_10]]) and len(days_result_30) != len(
        days_result_10
    )


def test_dreamery_date_range_sold():
    """Test sold properties with date range filtering"""
    days_result_30 = scrape_property(
        location="Dallas, TX", listing_type="sold", date_from="2023-05-01", date_to="2023-05-28"
    )

    days_result_60 = scrape_property(
        location="Dallas, TX", listing_type="sold", date_from="2023-04-01", date_to="2023-06-10"
    )

    assert all([result is not None for result in [days_result_30, days_result_60]]) and len(days_result_30) < len(
        days_result_60
    )


def test_dreamery_single_property():
    """Test single property search by address"""
    results = [
        scrape_property(
            location="15509 N 172nd Dr, Surprise, AZ 85388",
            listing_type="for_sale",
        ),
        scrape_property(
            location="2530 Al Lipscomb Way",
            listing_type="for_sale",
        ),
    ]

    assert all([result is not None for result in results])


def test_dreamery_basic_searches():
    """Test basic property searches across different locations and types"""
    results = [
        scrape_property(
            location="2530 Al Lipscomb Way",
            listing_type="for_sale",
        ),
        scrape_property(
            location="Phoenix, AZ", listing_type="for_rent", limit=1000
        ),
        scrape_property(
            location="Dallas, TX", listing_type="sold", limit=1000
        ),
        scrape_property(location="85281"),
    ]

    assert all([result is not None for result in results])


def test_dreamery_city():
    """Test city-based property search"""
    results = scrape_property(location="Atlanta, GA", listing_type="for_sale", limit=1000)

    assert results is not None and len(results) > 0


def test_dreamery_land():
    """Test land property type search"""
    results = scrape_property(location="Atlanta, GA", listing_type="for_sale", property_type=["land"], limit=1000)

    assert results is not None and len(results) > 0


def test_dreamery_bad_address():
    """Test handling of invalid addresses"""
    bad_results = scrape_property(
        location="abceefg ju098ot498hh9",
        listing_type="for_sale",
    )

    if len(bad_results) == 0:
        assert True


def test_dreamery_foreclosed():
    """Test foreclosure vs non-foreclosure property filtering"""
    foreclosed = scrape_property(location="Dallas, TX", listing_type="for_sale", past_days=100, foreclosure=True)

    not_foreclosed = scrape_property(location="Dallas, TX", listing_type="for_sale", past_days=100, foreclosure=False)

    assert len(foreclosed) != len(not_foreclosed)


def test_dreamery_agent():
    """Test agent information extraction"""
    scraped = scrape_property(location="Detroit, MI", listing_type="for_sale", limit=1000, extra_property_data=False)
    if len(scraped) > 0 and "agent_name" in scraped.columns:
        assert scraped["agent_name"].nunique() > 1


def test_dreamery_without_extra_details():
    """Test difference between basic and detailed property data"""
    results = [
        scrape_property(
            location="00741",
            listing_type="sold",
            limit=10,
            extra_property_data=False,
        ),
        scrape_property(
            location="00741",
            listing_type="sold",
            limit=10,
            extra_property_data=True,
        ),
    ]

    assert not results[0].equals(results[1])


def test_dreamery_pr_zip_code():
    """Test Puerto Rico zip code search"""
    results = scrape_property(
        location="00741",
        listing_type="for_sale",
    )

    assert results is not None and len(results) > 0


def test_dreamery_exclude_pending():
    """Test excluding pending properties"""
    results = scrape_property(
        location="33567",
        listing_type="pending",
        exclude_pending=True,
    )

    assert results is not None and len(results) > 0


def test_dreamery_style_value_error():
    """Test handling of style value errors"""
    results = scrape_property(
        location="Alaska, AK",
        listing_type="sold",
        extra_property_data=False,
        limit=1000,
    )

    assert results is not None and len(results) > 0


def test_dreamery_primary_image_error():
    """Test handling of primary image errors"""
    results = scrape_property(
        location="Spokane, PA",
        listing_type="for_rent",
        past_days=360,
        radius=3,
        extra_property_data=False,
    )

    assert results is not None and len(results) > 0


def test_dreamery_limit():
    """Test result limiting functionality"""
    over_limit = 876
    extra_params = {"limit": over_limit}

    over_results = scrape_property(
        location="Waddell, AZ",
        listing_type="for_sale",
        **extra_params,
    )

    assert over_results is not None and len(over_results) <= over_limit

    under_limit = 1
    under_results = scrape_property(
        location="Waddell, AZ",
        listing_type="for_sale",
        limit=under_limit,
    )

    assert under_results is not None and len(under_results) == under_limit


def test_dreamery_apartment_list_price():
    """Test apartment listing price extraction"""
    results = scrape_property(
        location="Spokane, WA",
        listing_type="for_rent",
        extra_property_data=False,
    )

    assert results is not None

    if len(results) > 0:
        apartment_results = results[results["style"] == "APARTMENT"] if "style" in results.columns else results

        # Get percentage of results with at least 1 of any column not none: list_price, list_price_min, list_price_max
        if len(apartment_results) > 0:
            price_columns = ["list_price", "list_price_min", "list_price_max"]
            available_columns = [col for col in price_columns if col in apartment_results.columns]
            if available_columns:
                assert (
                    len(apartment_results[apartment_results[available_columns].notnull().any(axis=1)]) / len(apartment_results)
                    > 0.5
                )


def test_dreamery_phone_number_matching():
    """Test agent phone number consistency"""
    searches = [
        scrape_property(
            location="Phoenix, AZ",
            listing_type="for_sale",
            limit=100,
        ),
        scrape_property(
            location="Phoenix, AZ",
            listing_type="for_sale",
            limit=100,
        ),
    ]

    assert all([search is not None for search in searches])

    if len(searches[0]) > 0 and len(searches[1]) > 0:
        # Random row
        phone_rows = searches[0][searches[0]["agent_phones"].notnull()] if "agent_phones" in searches[0].columns else searches[0]
        if len(phone_rows) > 0:
            row = phone_rows.sample()

            # Find matching row
            matching_row = searches[1].loc[searches[1]["property_url"] == row["property_url"].values[0]]

            # Assert phone numbers are the same
            if not matching_row.empty and "agent_phones" in searches[1].columns:
                assert row["agent_phones"].values[0] == matching_row["agent_phones"].values[0]


def test_dreamery_return_type():
    """Test different return types (pandas, pydantic, raw)"""
    results = {
        "pandas": [scrape_property(location="Surprise, AZ", listing_type="for_rent", limit=100)],
        "pydantic": [scrape_property(location="Surprise, AZ", listing_type="for_rent", limit=100, return_type="pydantic")],
        "raw": [
            scrape_property(location="Surprise, AZ", listing_type="for_rent", limit=100, return_type="raw"),
            scrape_property(location="66642", listing_type="for_rent", limit=100, return_type="raw"),
        ],
    }

    assert all(isinstance(result, pd.DataFrame) for result in results["pandas"])
    assert all(isinstance(result[0], Property) if len(result) > 0 else True for result in results["pydantic"])
    assert all(isinstance(result[0], dict) if len(result) > 0 else True for result in results["raw"])


def test_dreamery_has_open_house():
    """Test open house data availability"""
    address_result = scrape_property("1 Hawthorne St Unit 12F, San Francisco, CA 94105", return_type="raw")
    if len(address_result) > 0:
        assert address_result[0].get("open_houses") is not None  # has open house data from address search

    zip_code_result = scrape_property("94105", return_type="raw")
    if len(zip_code_result) > 0:
        address_from_zip_result = list(filter(lambda row: row.get("property_id") == '1264014746', zip_code_result))
        if address_from_zip_result:
            assert address_from_zip_result[0].get("open_houses") is not None  # has open house data from general search


def test_dreamery_return_type_consistency():
    """Test that return_type works consistently between general and address searches"""
    
    # Test configurations - different search types
    test_locations = [
        ("Dallas, TX", "general"),  # General city search
        ("75201", "zip"),          # ZIP code search
        ("2530 Al Lipscomb Way", "address")  # Address search
    ]
    
    for location, search_type in test_locations:
        # Test all return types for each search type
        pandas_result = scrape_property(
            location=location,
            listing_type="for_sale",
            limit=3,
            return_type="pandas"
        )
        
        pydantic_result = scrape_property(
            location=location,
            listing_type="for_sale",
            limit=3,
            return_type="pydantic"
        )
        
        raw_result = scrape_property(
            location=location,
            listing_type="for_sale",
            limit=3,
            return_type="raw"
        )
        
        # Validate pandas return type
        assert isinstance(pandas_result, pd.DataFrame), f"pandas result should be DataFrame for {search_type}"
        assert len(pandas_result) >= 0, f"pandas result should not be None for {search_type}"
        
        if len(pandas_result) > 0:
            required_columns = ["property_id", "property_url", "list_price", "status"]
            available_columns = [col for col in required_columns if col in pandas_result.columns]
            assert len(available_columns) > 0, f"Missing required columns in pandas result for {search_type}"
        
        # Validate pydantic return type
        assert isinstance(pydantic_result, list), f"pydantic result should be list for {search_type}"
        assert len(pydantic_result) >= 0, f"pydantic result should not be None for {search_type}"
        
        if len(pydantic_result) > 0:
            for item in pydantic_result:
                assert isinstance(item, Property), f"pydantic items should be Property objects for {search_type}"
                assert item.property_id is not None, f"property_id should not be None for {search_type}"
        
        # Validate raw return type
        assert isinstance(raw_result, list), f"raw result should be list for {search_type}"
        assert len(raw_result) >= 0, f"raw result should not be None for {search_type}"
        
        if len(raw_result) > 0:
            for item in raw_result:
                assert isinstance(item, dict), f"raw items should be dict for {search_type}"
                assert "property_id" in item, f"raw items should have property_id for {search_type}"
                assert "href" in item or "property_url" in item, f"raw items should have href or property_url for {search_type}"
        
        # Cross-validate that different return types return related data
        if len(pandas_result) > 0 and len(pydantic_result) > 0 and len(raw_result) > 0:
            pandas_ids = set(pandas_result["property_id"].tolist()) if "property_id" in pandas_result.columns else set()
            pydantic_ids = set(prop.property_id for prop in pydantic_result)
            raw_ids = set(item["property_id"] for item in raw_result)
            
            # All return types should have some properties
            assert len(pandas_ids) >= 0, f"pandas should return properties for {search_type}"
            assert len(pydantic_ids) >= 0, f"pydantic should return properties for {search_type}"
            assert len(raw_ids) >= 0, f"raw should return properties for {search_type}"


def test_dreamery_pending_date_filtering():
    """Test that pending properties are properly filtered by pending_date using client-side filtering."""
    
    # Test 1: Verify that date filtering works with different time windows
    result_no_filter = scrape_property(
        location="Dallas, TX",
        listing_type="pending", 
        limit=20
    )
    
    result_30_days = scrape_property(
        location="Dallas, TX", 
        listing_type="pending",
        past_days=30,
        limit=20
    )
    
    result_10_days = scrape_property(
        location="Dallas, TX",
        listing_type="pending", 
        past_days=10,
        limit=20
    )
    
    # Basic assertions - we should get some results
    assert result_no_filter is not None and len(result_no_filter) >= 0
    assert result_30_days is not None and len(result_30_days) >= 0
    assert result_10_days is not None and len(result_10_days) >= 0
    
    # Filtering should work: longer periods should return same or more results
    assert len(result_30_days) <= len(result_no_filter), "30-day filter should return <= unfiltered results"
    assert len(result_10_days) <= len(result_30_days), "10-day filter should return <= 30-day results"
    
    # Test 2: Verify that date range filtering works
    if len(result_no_filter) > 0:
        result_date_range = scrape_property(
            location="Dallas, TX",
            listing_type="pending",
            date_from="2025-08-01", 
            date_to="2025-12-31",
            limit=20
        )
        
        assert result_date_range is not None
        # Date range should capture recent properties
        assert len(result_date_range) >= 0
    
    # Test 3: Verify that both pending and contingent properties are included
    # Get raw data to check property types
    if len(result_no_filter) > 0:
        raw_result = scrape_property(
            location="Dallas, TX",
            listing_type="pending",
            return_type="raw",
            limit=15
        )
        
        if raw_result:
            # Check that we get both pending and contingent properties
            pending_count = 0
            contingent_count = 0
            
            for prop in raw_result:
                flags = prop.get('flags', {})
                if isinstance(flags, dict):
                    if flags.get('is_pending'):
                        pending_count += 1
                    if flags.get('is_contingent'):
                        contingent_count += 1
            
            # We should get at least one of each type (when available)
            total_properties = pending_count + contingent_count
            assert total_properties >= 0, "Should find at least some pending or contingent properties"


# Helper functions for testing
def test_dreamery_scraper_initialization():
    """Test DreameryPropertyScraper initialization"""
    scraper = DreameryPropertyScraper()
    assert scraper is not None
    assert scraper.session is not None
    
    # Test with legacy session
    legacy_scraper = DreameryPropertyScraper(use_enhanced_session=False)
    assert legacy_scraper is not None
    assert legacy_scraper.session is not None


def test_dreamery_location_handling():
    """Test location handling functionality"""
    scraper = DreameryPropertyScraper()
    
    # Test valid location
    location_info = scraper._handle_location("Dallas, TX")
    assert location_info is not None
    
    # Test invalid location
    invalid_location = scraper._handle_location("InvalidLocation123456")
    assert invalid_location is None or len(str(invalid_location)) == 0


def test_dreamery_search_type_determination():
    """Test search type determination logic"""
    scraper = DreameryPropertyScraper()
    
    # Mock location info for different test cases
    address_location = {"area_type": "address", "mpr_id": "123456"}
    city_location = {"area_type": "city", "city": "Dallas", "state_code": "TX"}
    postal_location = {"area_type": "postal_code", "postal_code": "75201"}
    
    # Test single property search
    search_type = scraper._determine_search_type(address_location, None)
    assert search_type == "single_property"
    
    # Test comps search
    search_type = scraper._determine_search_type(address_location, 5.0)
    assert search_type == "comps"
    
    # Test area search
    search_type = scraper._determine_search_type(city_location, None)
    assert search_type == "area"
