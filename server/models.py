from __future__ import annotations
from enum import Enum
from typing import Optional, Union, Union, Any, List, Dict, Dict
from datetime import datetime
from dataclasses import dataclass
from pydantic import BaseModel, computed_field, HttpUrl, Field


class ReturnType(Enum):
    pydantic = "pydantic"
    pandas = "pandas"
    raw = "raw"


class SiteName(Enum):
    ZILLOW = "zillow"
    REDFIN = "redfin"
    REALTOR = "realtor.com"

    @classmethod
    def get_by_value(cls, value):
        for item in cls:
            if item.value == value:
                return item
        raise ValueError(f"{value} not found in {cls}")


class SearchPropertyType(Enum):
    SINGLE_FAMILY = "single_family"
    APARTMENT = "apartment"
    CONDOS = "condos"
    CONDO_TOWNHOME_ROWHOME_COOP = "condo_townhome_rowhome_coop"
    CONDO_TOWNHOME = "condo_townhome"
    TOWNHOMES = "townhomes"
    DUPLEX_TRIPLEX = "duplex_triplex"
    FARM = "farm"
    LAND = "land"
    MULTI_FAMILY = "multi_family"
    MOBILE = "mobile"


class ListingType(Enum):
    FOR_SALE = "FOR_SALE"
    FOR_RENT = "FOR_RENT"
    PENDING = "PENDING"
    SOLD = "SOLD"


class PropertyType(Enum):
    APARTMENT = "APARTMENT"
    BUILDING = "BUILDING"
    COMMERCIAL = "COMMERCIAL"
    GOVERNMENT = "GOVERNMENT"
    INDUSTRIAL = "INDUSTRIAL"
    CONDO_TOWNHOME = "CONDO_TOWNHOME"
    CONDO_TOWNHOME_ROWHOME_COOP = "CONDO_TOWNHOME_ROWHOME_COOP"
    CONDO = "CONDO"
    CONDOP = "CONDOP"
    CONDOS = "CONDOS"
    COOP = "COOP"
    DUPLEX_TRIPLEX = "DUPLEX_TRIPLEX"
    FARM = "FARM"
    INVESTMENT = "INVESTMENT"
    LAND = "LAND"
    MOBILE = "MOBILE"
    MULTI_FAMILY = "MULTI_FAMILY"
    RENTAL = "RENTAL"
    SINGLE_FAMILY = "SINGLE_FAMILY"
    TOWNHOMES = "TOWNHOMES"
    OTHER = "OTHER"


class Address(BaseModel):
    full_line: Union[str, None] = None
    street: Union[str, None] = None
    unit: Union[str, None] = None
    city: Union[str, None] = Field(None, description="The name of the city")
    state: Union[str, None] = Field(None, description="The name of the state")
    zip: Union[str, None] = Field(None, description="zip code")
    
    # Additional address fields from GraphQL
    street_direction: Union[str, None] = None
    street_number: Union[str, None] = None
    street_name: Union[str, None] = None
    street_suffix: Union[str, None] = None
    
    @computed_field
    @property
    def formatted_address(self) -> Union[str, None]:
        """Computed property that combines full_line, city, state, and zip into a formatted address."""
        parts = []
        
        if self.full_line:
            parts.append(self.full_line)
        
        city_state_zip = []
        if self.city:
            city_state_zip.append(self.city)
        if self.state:
            city_state_zip.append(self.state)
        if self.zip:
            city_state_zip.append(self.zip)
        
        if city_state_zip:
            parts.append(", ".join(city_state_zip))
        
        return ", ".join(parts) if parts else None




class Description(BaseModel):
    primary_photo: Union[HttpUrl, None] = None
    alt_photos: List[HttpUrl] | None = None
    style: Union[PropertyType, None] = None
    beds: Union[int, None] = Field(None, description="Total number of bedrooms")
    baths_full: Union[int, None] = Field(None, description="Total number of full bathrooms (4 parts: Sink, Shower, Bathtub and Toilet)")
    baths_half: Union[int, None] = Field(None, description="Total number of 1/2 bathrooms (2 parts: Usually Sink and Toilet)")
    sqft: Union[int, None] = Field(None, description="Square footage of the Home")
    lot_sqft: Union[int, None] = Field(None, description="Lot square footage")
    sold_price: Union[int, None] = Field(None, description="Sold price of home")
    year_built: Union[int, None] = Field(None, description="The year the building/home was built")
    garage: Union[float, None] = Field(None, description="Number of garage spaces")
    stories: Union[int, None] = Field(None, description="Number of stories in the building")
    text: Union[str, None] = None
    
    # Additional description fields
    name: Union[str, None] = None
    type: Union[str, None] = None


class AgentPhone(BaseModel):
    number: Union[str, None] = None
    type: Union[str, None] = None
    primary: Union[bool, None] = None
    ext: Union[str, None] = None


class Entity(BaseModel):
    name: Union[str, None] = None  # Make name optional since it can be None
    uuid: Union[str, None] = None


class Agent(Entity):
    mls_set: Union[str, None] = None
    nrds_id: Union[str, None] = None
    phones: List[dict] | Union[AgentPhone, None] = None
    email: Union[str, None] = None
    href: Union[str, None] = None
    state_license: Union[str, None] = Field(None, description="Advertiser agent state license number")


class Office(Entity):
    mls_set: Union[str, None] = None
    email: Union[str, None] = None
    href: Union[str, None] = None
    phones: List[dict] | Union[AgentPhone, None] = None


class Broker(Entity):
    pass


class Builder(Entity):
    pass


class Advertisers(BaseModel):
    agent: Union[Agent, None] = None
    broker: Union[Broker, None] = None
    builder: Union[Builder, None] = None
    office: Union[Office, None] = None


class Property(BaseModel):
    property_url: HttpUrl
    property_id: str = Field(..., description="Unique Home identifier also known as property id")
    #: allows_cats: bool
    #: allows_dogs: bool

    listing_id: Union[str, None] = None
    permalink: Union[str, None] = None

    mls: Union[str, None] = None
    mls_id: Union[str, None] = None
    status: Union[str, None] = Field(None, description="Listing status: for_sale, for_rent, sold, off_market, active (New Home Subdivisions), other (if none of the above conditions were met)")
    address: Union[Address, None] = None

    list_price: Union[int, None] = Field(None, description="The current price of the Home")
    list_price_min: Union[int, None] = None
    list_price_max: Union[int, None] = None

    list_date: Union[datetime, None] = Field(None, description="The time this Home entered Move system")
    pending_date: Union[datetime, None] = Field(None, description="The date listing went into pending state")
    last_sold_date: Union[datetime, None] = Field(None, description="Last time the Home was sold")
    prc_sqft: Union[int, None] = None
    new_construction: Union[bool, None] = Field(None, description="Search for new construction homes")
    hoa_fee: Union[int, None] = Field(None, description="Search for homes where HOA fee is known and falls within specified range")
    days_on_mls: Union[int, None] = Field(None, description="An integer value determined by the MLS to calculate days on market")
    description: Union[Description, None] = None
    tags: Union[List[str], None] = None
    details: List[HomeDetails] | None = None

    latitude: Union[float, None] = None
    longitude: Union[float, None] = None
    neighborhoods: Optional[str] = None
    county: Optional[str] = Field(None, description="County associated with home")
    fips_code: Optional[str] = Field(None, description="The FIPS (Federal Information Processing Standard) code for the county")
    nearby_schools: Union[List[str], None] = None
    assessed_value: Union[int, None] = None
    estimated_value: Union[int, None] = None
    tax: Union[int, None] = None
    tax_history: List[TaxHistory] | None = None

    advertisers: Union[Advertisers, None] = None
    
    # Additional fields from GraphQL that aren't currently parsed
    mls_status: Union[str, None] = None
    last_sold_price: Union[int, None] = None
    
    # Structured data from GraphQL
    open_houses: List[OpenHouse] | None = None
    pet_policy: Union[PetPolicy, None] = None
    units: List[Unit] | None = None
    monthly_fees: Union[HomeMonthlyFee, None] = Field(None, description="Monthly fees. Currently only some rental data will have them.")
    one_time_fees: List[HomeOneTimeFee] | None = Field(None, description="One time fees. Currently only some rental data will have them.")
    parking: Union[HomeParkingDetails, None] = Field(None, description="Parking information. Currently only some rental data will have it.")
    terms: List[PropertyDetails] | None = None
    popularity: Union[Popularity, None] = None
    tax_record: Union[TaxRecord, None] = None
    parcel_info: Union[dict, None] = None  # Keep as dict for flexibility
    current_estimates: List[PropertyEstimate] | None = None
    estimates: Union[HomeEstimates, None] = None
    photos: Union[List[dict], None] = None  # Keep as dict for photo structure
    flags: Union[HomeFlags, None] = Field(None, description="Home flags for Listing/Property")


# Specialized models for GraphQL types

class HomeMonthlyFee(BaseModel):
    description: Union[str, None] = None
    display_amount: Union[str, None] = None


class HomeOneTimeFee(BaseModel):
    description: Union[str, None] = None
    display_amount: Union[str, None] = None


class HomeParkingDetails(BaseModel):
    unassigned_space_rent: Union[int, None] = None
    assigned_spaces_available: Union[int, None] = None
    description: Union[str, None] = Field(None, description="Parking information. Currently only some rental data will have it.")
    assigned_space_rent: Union[int, None] = None


class PetPolicy(BaseModel):
    cats: Union[bool, None] = Field(None, description="Search for homes which allow cats")
    dogs: Union[bool, None] = Field(None, description="Search for homes which allow dogs")
    dogs_small: Union[bool, None] = Field(None, description="Search for homes with allow small dogs")
    dogs_large: Union[bool, None] = Field(None, description="Search for homes which allow large dogs")


class OpenHouse(BaseModel):
    start_date: Union[datetime, None] = None
    end_date: Union[datetime, None] = None
    description: Union[str, None] = None
    time_zone: Union[str, None] = None
    dst: Union[bool, None] = None
    href: Union[HttpUrl, None] = None
    methods: Union[List[str], None] = None


class HomeFlags(BaseModel):
    is_pending: Union[bool, None] = None
    is_contingent: Union[bool, None] = None
    is_new_construction: Union[bool, None] = None
    is_coming_soon: Union[bool, None] = None
    is_new_listing: Union[bool, None] = None
    is_price_reduced: Union[bool, None] = None
    is_foreclosure: Union[bool, None] = None


class PopularityPeriod(BaseModel):
    clicks_total: Union[int, None] = None
    views_total: Union[int, None] = None
    dwell_time_mean: Union[float, None] = None
    dwell_time_median: Union[float, None] = None
    leads_total: Union[int, None] = None
    shares_total: Union[int, None] = None
    saves_total: Union[int, None] = None
    last_n_days: Union[int, None] = None


class Popularity(BaseModel):
    periods: List[PopularityPeriod] | None = None


class Assessment(BaseModel):
    building: Union[int, None] = None
    land: Union[int, None] = None
    total: Union[int, None] = None


class TaxHistory(BaseModel):
    assessment: Union[Assessment, None] = None
    market: Union[Assessment, None] = Field(None, description="Market values as provided by the county or local taxing/assessment authority")
    appraisal: Union[Assessment, None] = Field(None, description="Appraised value given by taxing authority")
    value: Union[Assessment, None] = Field(None, description="Value closest to current market value used for assessment by county or local taxing authorities")
    tax: Union[int, None] = None
    year: Union[int, None] = None
    assessed_year: Union[int, None] = Field(None, description="Assessment year for which taxes were billed")


class TaxRecord(BaseModel):
    cl_id: Union[str, None] = None
    public_record_id: Union[str, None] = None
    last_update_date: Union[datetime, None] = None
    apn: Union[str, None] = None
    tax_parcel_id: Union[str, None] = None


class EstimateSource(BaseModel):
    type: Union[str, None] = Field(None, description="Type of the avm vendor, list of values: corelogic, collateral, quantarium")
    name: Union[str, None] = Field(None, description="Name of the avm vendor")


class PropertyEstimate(BaseModel):
    estimate: Union[int, None] = Field(None, description="Estimated value of a property")
    estimate_high: Union[int, None] = Field(None, description="Estimated high value of a property")
    estimate_low: Union[int, None] = Field(None, description="Estimated low value of a property")
    date: Union[datetime, None] = Field(None, description="Date of estimation")
    is_best_home_value: Union[bool, None] = None
    source: Union[EstimateSource, None] = Field(None, description="Source of the latest estimate value")


class HomeEstimates(BaseModel):
    current_values: List[PropertyEstimate] | None = Field(None, description="Current valuation and best value for home from multiple AVM vendors")


class PropertyDetails(BaseModel):
    category: Union[str, None] = None
    text: Union[List[str], None] = None
    parent_category: Union[str, None] = None


class HomeDetails(BaseModel):
    category: Union[str, None] = None
    text: Union[List[str], None] = None
    parent_category: Union[str, None] = None


class UnitDescription(BaseModel):
    baths_consolidated: Union[str, None] = None
    baths: Union[float, None] = None  # Changed to float to handle values like 2.5
    beds: Union[int, None] = None
    sqft: Union[int, None] = None


class UnitAvailability(BaseModel):
    date: Union[datetime, None] = None


class Unit(BaseModel):
    availability: Union[UnitAvailability, None] = None
    description: Union[UnitDescription, None] = None
    photos: Union[List[dict], None] = None  # Keep as dict for photo structure
    list_price: Union[int, None] = None


# Legacy compatibility models
@dataclass
class PropertyData:
    """Legacy property data model for backward compatibility"""
    property_id: str
    address: str
    price: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[float] = None
    sqft: Optional[int] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    status: Optional[str] = None
    mls: Optional[str] = None
    photos: Optional[List[str]] = None
    agent_name: Optional[str] = None
    agent_email: Optional[str] = None
    agent_phone: Optional[str] = None
    office_name: Optional[str] = None
    description: Optional[str] = None
    year_built: Optional[int] = None
    lot_size: Optional[int] = None
    garage: Optional[float] = None
    hoa_fee: Optional[float] = None
    days_on_market: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    county: Optional[str] = None
    neighborhoods: Optional[str] = None
    schools: Optional[List[str]] = None
    tax_history: Optional[List[Dict[str, Any]]] = None
    estimated_value: Optional[float] = None
    assessed_value: Optional[float] = None
    new_construction: Optional[bool] = None
    open_houses: Optional[List[Dict[str, Any]]] = None
    units: Optional[List[Dict[str, Any]]] = None
    monthly_fees: Optional[Dict[str, Any]] = None
    one_time_fees: Optional[Dict[str, Any]] = None
    parking: Optional[Dict[str, Any]] = None
    terms: Optional[List[Dict[str, Any]]] = None
    popularity: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    details: Optional[List[Dict[str, Any]]] = None
    pet_policy: Optional[Dict[str, Any]] = None
    flags: Optional[Dict[str, Any]] = None