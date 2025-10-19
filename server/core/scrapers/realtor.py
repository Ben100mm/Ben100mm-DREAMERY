"""
Realtor.com scraper implementation
"""

from typing import , List, DictList, Union
from .models import ScraperInput, Property
from ..dreamery_property_scraper import DreameryPropertyScraper


class RealtorScraper:
    """Realtor.com property scraper"""
    
    def __init__(self, scraper_input: ScraperInput):
        self.scraper_input = scraper_input
        self.scraper = DreameryPropertyScraper.from_scraper_input(scraper_input)
    
    def search(self) -> List[Property]:
        """Search for properties using the configured scraper input"""
        if self.scraper_input.return_type.value == "pandas":
            # Use comprehensive search for pandas return type
            return self.scraper.search_properties_comprehensive(
                location=self.scraper_input.location,
                listing_type=self.scraper_input.listing_type.value.lower(),
                property_types=[pt.value for pt in self.scraper_input.property_type] if self.scraper_input.property_type else None,
                radius=self.scraper_input.radius,
                past_days=self.scraper_input.last_x_days,
                limit=self.scraper_input.limit,
                mls_only=self.scraper_input.mls_only,
                extra_property_data=self.scraper_input.extra_property_data,
                exclude_pending=self.scraper_input.exclude_pending
            )
        else:
            # Use advanced search for other return types
            return self.scraper.search_properties_advanced(
                location=self.scraper_input.location,
                listing_type=self.scraper_input.listing_type.value.lower(),
                property_types=[pt.value for pt in self.scraper_input.property_type] if self.scraper_input.property_type else None,
                radius=self.scraper_input.radius,
                past_days=self.scraper_input.last_x_days,
                limit=self.scraper_input.limit,
                mls_only=self.scraper_input.mls_only,
                extra_property_data=self.scraper_input.extra_property_data,
                exclude_pending=self.scraper_input.exclude_pending
            )
