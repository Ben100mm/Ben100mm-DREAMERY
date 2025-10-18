"""
State-Specific Commercial Real Estate Data Models
Comprehensive data models for all 50 states and federal government sources
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from enum import Enum

class StateCode(Enum):
    """US State codes for data organization"""
    AL = "Alabama"
    AK = "Alaska"
    AZ = "Arizona"
    AR = "Arkansas"
    CA = "California"
    CO = "Colorado"
    CT = "Connecticut"
    DE = "Delaware"
    FL = "Florida"
    GA = "Georgia"
    HI = "Hawaii"
    ID = "Idaho"
    IL = "Illinois"
    IN = "Indiana"
    IA = "Iowa"
    KS = "Kansas"
    KY = "Kentucky"
    LA = "Louisiana"
    ME = "Maine"
    MD = "Maryland"
    MA = "Massachusetts"
    MI = "Michigan"
    MN = "Minnesota"
    MS = "Mississippi"
    MO = "Missouri"
    MT = "Montana"
    NE = "Nebraska"
    NV = "Nevada"
    NH = "New Hampshire"
    NJ = "New Jersey"
    NM = "New Mexico"
    NY = "New York"
    NC = "North Carolina"
    ND = "North Dakota"
    OH = "Ohio"
    OK = "Oklahoma"
    OR = "Oregon"
    PA = "Pennsylvania"
    RI = "Rhode Island"
    SC = "South Carolina"
    SD = "South Dakota"
    TN = "Tennessee"
    TX = "Texas"
    UT = "Utah"
    VT = "Vermont"
    VA = "Virginia"
    WA = "Washington"
    WV = "West Virginia"
    WI = "Wisconsin"
    WY = "Wyoming"
    DC = "District of Columbia"

class DataSource(Enum):
    """Data source types"""
    FEDERAL = "federal"
    STATE = "state"
    COUNTY = "county"
    MUNICIPAL = "municipal"
    PRIVATE = "private"

@dataclass
class FederalCensusData:
    """US Census Bureau commercial real estate data"""
    # Geographic identifiers
    state_fips: Optional[str] = None
    county_fips: Optional[str] = None
    tract_fips: Optional[str] = None
    block_group: Optional[str] = None
    
    # Demographics
    total_population: Optional[int] = None
    median_age: Optional[float] = None
    median_household_income: Optional[int] = None
    poverty_rate: Optional[float] = None
    
    # Housing characteristics
    total_housing_units: Optional[int] = None
    occupied_housing_units: Optional[int] = None
    vacant_housing_units: Optional[int] = None
    owner_occupied: Optional[int] = None
    renter_occupied: Optional[int] = None
    
    # Commercial indicators
    total_businesses: Optional[int] = None
    retail_trade_establishments: Optional[int] = None
    professional_services: Optional[int] = None
    manufacturing_establishments: Optional[int] = None
    
    # Data metadata
    data_year: Optional[int] = None
    last_updated: Optional[datetime] = None
    confidence_score: Optional[float] = None

@dataclass
class FederalBLSData:
    """Bureau of Labor Statistics economic data"""
    # Geographic identifiers
    state_code: Optional[str] = None
    county_code: Optional[str] = None
    msa_code: Optional[str] = None
    
    # Employment data
    total_employment: Optional[int] = None
    unemployment_rate: Optional[float] = None
    labor_force_participation: Optional[float] = None
    
    # Wage data
    average_hourly_wage: Optional[float] = None
    median_annual_wage: Optional[int] = None
    
    # Industry data
    retail_trade_employment: Optional[int] = None
    professional_services_employment: Optional[int] = None
    manufacturing_employment: Optional[int] = None
    construction_employment: Optional[int] = None
    
    # Data metadata
    data_year: Optional[int] = None
    last_updated: Optional[datetime] = None

@dataclass
class StatePropertyData:
    """State-level property assessment and transaction data"""
    # Property identification
    property_id: str
    parcel_id: Optional[str] = None
    apn: Optional[str] = None  # Assessor's Parcel Number
    
    # Location data
    address: str
    city: str
    state: str
    zip_code: Optional[str] = None
    county: Optional[str] = None
    
    # Property characteristics
    property_type: Optional[str] = None  # commercial, residential, mixed-use
    land_use_code: Optional[str] = None
    zoning: Optional[str] = None
    square_footage: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    
    # Assessment data
    assessed_value: Optional[float] = None
    market_value: Optional[float] = None
    land_value: Optional[float] = None
    improvement_value: Optional[float] = None
    tax_amount: Optional[float] = None
    
    # Transaction data
    last_sale_date: Optional[datetime] = None
    last_sale_price: Optional[float] = None
    sale_price_per_sqft: Optional[float] = None
    
    # Commercial specific data
    occupancy_rate: Optional[float] = None
    rent_per_sqft: Optional[float] = None
    cap_rate: Optional[float] = None
    noi: Optional[float] = None  # Net Operating Income
    
    # Data metadata
    data_source: Optional[str] = None
    last_updated: Optional[datetime] = None
    confidence_score: Optional[float] = None

@dataclass
class StateCommercialRentData:
    """State-specific commercial rent data"""
    # Geographic identifiers
    state: str
    county: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    
    # Rent data by property type
    office_rent_per_sqft: Optional[float] = None
    retail_rent_per_sqft: Optional[float] = None
    industrial_rent_per_sqft: Optional[float] = None
    warehouse_rent_per_sqft: Optional[float] = None
    multifamily_rent_per_unit: Optional[float] = None
    
    # Market metrics
    vacancy_rate: Optional[float] = None
    absorption_rate: Optional[float] = None
    new_construction: Optional[int] = None  # square feet
    total_inventory: Optional[int] = None  # square feet
    
    # Rent trends
    rent_growth_rate: Optional[float] = None
    rent_growth_1yr: Optional[float] = None
    rent_growth_3yr: Optional[float] = None
    rent_growth_5yr: Optional[float] = None
    
    # Data metadata
    data_year: Optional[int] = None
    last_updated: Optional[datetime] = None
    data_source: Optional[str] = None
    confidence_score: Optional[float] = None

@dataclass
class StateOpenDataConfig:
    """Configuration for state open data sources"""
    state: StateCode
    data_portal_url: str
    api_base_url: Optional[str] = None
    api_key_required: bool = False
    rate_limit_per_hour: int = 1000
    
    # Available datasets
    property_assessments: bool = False
    property_transactions: bool = False
    commercial_rent_data: bool = False
    zoning_data: bool = False
    tax_data: bool = False
    
    # Data formats
    supported_formats: List[str] = field(default_factory=lambda: ['CSV', 'JSON'])
    api_available: bool = False
    
    # Authentication
    auth_type: Optional[str] = None  # 'api_key', 'oauth', 'none'
    auth_url: Optional[str] = None
    
    # Data update frequency
    update_frequency: str = 'monthly'  # daily, weekly, monthly, quarterly, annually

@dataclass
class CountyAssessorData:
    """County-level property assessor data"""
    # Geographic identifiers
    county: str
    state: str
    fips_code: Optional[str] = None
    
    # Property data
    properties: List[StatePropertyData] = field(default_factory=list)
    
    # Summary statistics
    total_properties: Optional[int] = None
    total_assessed_value: Optional[float] = None
    average_property_value: Optional[float] = None
    commercial_properties: Optional[int] = None
    residential_properties: Optional[int] = None
    
    # Data metadata
    last_updated: Optional[datetime] = None
    data_source: Optional[str] = None

@dataclass
class StateDataSummary:
    """Summary of available data for a state"""
    state: StateCode
    data_sources: List[DataSource] = field(default_factory=list)
    
    # Data availability flags
    has_federal_data: bool = False
    has_state_data: bool = False
    has_county_data: bool = False
    has_commercial_rent_data: bool = False
    has_property_assessments: bool = False
    has_transaction_data: bool = False
    
    # Data quality metrics
    data_completeness_score: Optional[float] = None
    data_freshness_score: Optional[float] = None
    api_availability_score: Optional[float] = None
    
    # Coverage information
    counties_covered: int = 0
    total_counties: int = 0
    cities_covered: int = 0
    
    # Last update information
    last_federal_update: Optional[datetime] = None
    last_state_update: Optional[datetime] = None
    last_county_update: Optional[datetime] = None

@dataclass
class CommercialRealEstateData:
    """Comprehensive commercial real estate data for a location"""
    # Geographic identifiers
    address: str
    latitude: float
    longitude: float
    state: str
    county: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    
    # Federal data
    census_data: Optional[FederalCensusData] = None
    bls_data: Optional[FederalBLSData] = None
    
    # State data
    state_property_data: Optional[StatePropertyData] = None
    state_rent_data: Optional[StateCommercialRentData] = None
    
    # County data
    county_data: Optional[CountyAssessorData] = None
    
    # Market analysis
    market_indicators: Dict[str, Any] = field(default_factory=dict)
    rent_estimates: Dict[str, float] = field(default_factory=dict)
    investment_metrics: Dict[str, float] = field(default_factory=dict)
    
    # Data quality and metadata
    data_quality_score: Optional[float] = None
    last_updated: Optional[datetime] = None
    data_sources: List[str] = field(default_factory=list)
    confidence_score: Optional[float] = None

# State-specific data configurations
STATE_DATA_CONFIGS = {
    StateCode.CT: StateOpenDataConfig(
        state=StateCode.CT,
        data_portal_url="https://data.ct.gov",
        api_base_url="https://data.ct.gov/api",
        property_transactions=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    ),
    StateCode.NY: StateOpenDataConfig(
        state=StateCode.NY,
        data_portal_url="https://data.ny.gov",
        api_base_url="https://data.ny.gov/api",
        property_transactions=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    ),
    StateCode.MD: StateOpenDataConfig(
        state=StateCode.MD,
        data_portal_url="https://opendata.maryland.gov",
        api_base_url="https://opendata.maryland.gov/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="quarterly"
    ),
    StateCode.CA: StateOpenDataConfig(
        state=StateCode.CA,
        data_portal_url="https://data.ca.gov",
        api_base_url="https://data.ca.gov/api",
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    ),
    StateCode.TX: StateOpenDataConfig(
        state=StateCode.TX,
        data_portal_url="https://data.texas.gov",
        api_base_url="https://data.texas.gov/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="quarterly"
    ),
    StateCode.FL: StateOpenDataConfig(
        state=StateCode.FL,
        data_portal_url="https://data.floridajobs.org",
        api_base_url="https://data.floridajobs.org/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    ),
    StateCode.IL: StateOpenDataConfig(
        state=StateCode.IL,
        data_portal_url="https://data.illinois.gov",
        api_base_url="https://data.illinois.gov/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    ),
    StateCode.PA: StateOpenDataConfig(
        state=StateCode.PA,
        data_portal_url="https://data.pa.gov",
        api_base_url="https://data.pa.gov/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="quarterly"
    ),
    StateCode.OH: StateOpenDataConfig(
        state=StateCode.OH,
        data_portal_url="https://data.ohio.gov",
        api_base_url="https://data.ohio.gov/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    ),
    StateCode.GA: StateOpenDataConfig(
        state=StateCode.GA,
        data_portal_url="https://data.georgia.gov",
        api_base_url="https://data.georgia.gov/api",
        property_assessments=True,
        commercial_rent_data=False,
        api_available=True,
        update_frequency="monthly"
    )
}

# Federal data source configurations
FEDERAL_DATA_CONFIGS = {
    'census': {
        'api_base_url': 'https://api.census.gov/data',
        'rate_limit_per_hour': 500,
        'api_key_required': True,
        'available_datasets': [
            'American Community Survey',
            'Economic Census',
            'County Business Patterns',
            'Population Estimates'
        ]
    },
    'bls': {
        'api_base_url': 'https://api.bls.gov/publicAPI/v2',
        'rate_limit_per_hour': 500,
        'api_key_required': False,
        'available_datasets': [
            'Employment Statistics',
            'Unemployment Data',
            'Wage Data',
            'Industry Data'
        ]
    },
    'data_gov': {
        'api_base_url': 'https://catalog.data.gov/api/3',
        'rate_limit_per_hour': 1000,
        'api_key_required': False,
        'available_datasets': [
            'Federal Real Property Profile',
            'State Government Datasets',
            'Local Government Datasets'
        ]
    }
}

def get_state_config(state_code: StateCode) -> Optional[StateOpenDataConfig]:
    """Get configuration for a specific state"""
    return STATE_DATA_CONFIGS.get(state_code)

def get_all_state_configs() -> Dict[StateCode, StateOpenDataConfig]:
    """Get all state configurations"""
    return STATE_DATA_CONFIGS

def get_federal_configs() -> Dict[str, Dict[str, Any]]:
    """Get federal data source configurations"""
    return FEDERAL_DATA_CONFIGS

def get_states_with_commercial_data() -> List[StateCode]:
    """Get list of states with commercial real estate data available"""
    return [state for state, config in STATE_DATA_CONFIGS.items() 
            if config.commercial_rent_data or config.property_assessments]

def get_states_with_apis() -> List[StateCode]:
    """Get list of states with API access available"""
    return [state for state, config in STATE_DATA_CONFIGS.items() 
            if config.api_available]
