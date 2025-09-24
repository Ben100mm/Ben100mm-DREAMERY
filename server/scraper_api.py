"""
High-level property scraping API with comprehensive validation
"""

import warnings
import pandas as pd
from typing import Union, Optional, List, Dict
from enhanced_scraper import ScraperInput
from models import ListingType, SearchPropertyType, ReturnType, Property
from dreamery_property_scraper import DreameryPropertyScraper
from utils import process_result, ordered_properties, validate_input, validate_dates, validate_limit




def scrape_property(
    location: str,
    listing_type: str = "for_sale",
    return_type: str = "pandas",
    property_type: Optional[List[str]] = None,
    radius: float = None,
    mls_only: bool = False,
    past_days: int = None,
    proxy: str = None,
    date_from: str = None,
    date_to: str = None,
    foreclosure: bool = None,
    extra_property_data: bool = True,
    exclude_pending: bool = False,
    limit: int = 10000
) -> Union[pd.DataFrame, List[dict], List[Property]]:
    """
    Scrape properties from Realtor.com based on a given location and listing type.
    
    :param location: Location to search (e.g. "Dallas, TX", "85281", "2530 Al Lipscomb Way")
    :param listing_type: Listing Type (for_sale, for_rent, sold, pending)
    :param return_type: Return type (pandas, pydantic, raw)
    :param property_type: Property Type (single_family, multi_family, condos, condo_townhome_rowhome_coop, condo_townhome, townhomes, duplex_triplex, farm, land, mobile)
    :param radius: Get properties within _ (e.g. 1.0) miles. Only applicable for individual addresses.
    :param mls_only: If set, fetches only listings with MLS IDs.
    :param proxy: Proxy to use for scraping
    :param past_days: Get properties sold or listed (dependent on your listing_type) in the last _ days.
        - PENDING: Filters by pending_date. Contingent properties without pending_date are included.
        - SOLD: Filters by sold_date (when property was sold)
        - FOR_SALE/FOR_RENT: Filters by list_date (when property was listed)
    :param date_from, date_to: Get properties sold or listed (dependent on your listing_type) between these dates. format: 2021-01-28
    :param foreclosure: If set, fetches only foreclosure listings.
    :param extra_property_data: Increases requests by O(n). If set, this fetches additional property data (e.g. agent, broker, property evaluations etc.)
    :param exclude_pending: If true, this excludes pending or contingent properties from the results, unless listing type is pending.
    :param limit: Limit the number of results returned. Maximum is 10,000.
    """
    validate_input(listing_type)
    validate_dates(date_from, date_to)
    validate_limit(limit)

    scraper_input = ScraperInput(
        location=location,
        listing_type=ListingType(listing_type.upper()),
        return_type=ReturnType(return_type.lower()),
        property_type=[SearchPropertyType[prop.upper()] for prop in property_type] if property_type else None,
        proxy=proxy,
        radius=radius,
        mls_only=mls_only,
        last_x_days=past_days,
        date_from=date_from,
        date_to=date_to,
        foreclosure=foreclosure,
        extra_property_data=extra_property_data,
        exclude_pending=exclude_pending,
        limit=limit,
    )

    scraper = DreameryPropertyScraper.from_scraper_input(scraper_input)
    
    # Use appropriate search method based on return type
    if scraper_input.return_type == ReturnType.pandas:
        results = scraper.search_properties_comprehensive(
            location=scraper_input.location,
            listing_type=scraper_input.listing_type.value.lower(),
            property_types=[pt.value for pt in scraper_input.property_type] if scraper_input.property_type else None,
            radius=scraper_input.radius,
            past_days=scraper_input.last_x_days,
            limit=scraper_input.limit,
            mls_only=scraper_input.mls_only,
            extra_property_data=scraper_input.extra_property_data,
            exclude_pending=scraper_input.exclude_pending
        )
    else:
        results = scraper.search_properties_advanced(
            location=scraper_input.location,
            listing_type=scraper_input.listing_type.value.lower(),
            property_types=[pt.value for pt in scraper_input.property_type] if scraper_input.property_type else None,
            radius=scraper_input.radius,
            past_days=scraper_input.last_x_days,
            limit=scraper_input.limit,
            mls_only=scraper_input.mls_only,
            extra_property_data=scraper_input.extra_property_data,
            exclude_pending=scraper_input.exclude_pending
        )

    if scraper_input.return_type != ReturnType.pandas:
        return results

    properties_dfs = [df for result in results if not (df := process_result(result)).empty]
    if not properties_dfs:
        return pd.DataFrame()

    with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=FutureWarning)

        return pd.concat(properties_dfs, ignore_index=True, axis=0)[ordered_properties()].replace(
            {"None": pd.NA, None: pd.NA, "": pd.NA}
        )
