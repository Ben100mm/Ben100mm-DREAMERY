"""
Comprehensive State Configurations for All 50 States
Configuration for state open data portals, APIs, and data sources
"""

from state_data_models import StateCode, StateOpenDataConfig, DataSource
from typing import Optional, Dict, List, Any

# Comprehensive state configurations for all 50 states
COMPREHENSIVE_STATE_CONFIGS = {
    # High Data Availability States
    StateCode.CA: StateOpenDataConfig(
        state=StateCode.CA,
        data_portal_url="https://data.ca.gov",
        api_base_url="https://data.ca.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON', 'XML'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.TX: StateOpenDataConfig(
        state=StateCode.TX,
        data_portal_url="https://data.texas.gov",
        api_base_url="https://data.texas.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.FL: StateOpenDataConfig(
        state=StateCode.FL,
        data_portal_url="https://data.floridajobs.org",
        api_base_url="https://data.floridajobs.org/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.NY: StateOpenDataConfig(
        state=StateCode.NY,
        data_portal_url="https://data.ny.gov",
        api_base_url="https://data.ny.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.IL: StateOpenDataConfig(
        state=StateCode.IL,
        data_portal_url="https://data.illinois.gov",
        api_base_url="https://data.illinois.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.PA: StateOpenDataConfig(
        state=StateCode.PA,
        data_portal_url="https://data.pa.gov",
        api_base_url="https://data.pa.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.OH: StateOpenDataConfig(
        state=StateCode.OH,
        data_portal_url="https://data.ohio.gov",
        api_base_url="https://data.ohio.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.GA: StateOpenDataConfig(
        state=StateCode.GA,
        data_portal_url="https://data.georgia.gov",
        api_base_url="https://data.georgia.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.NC: StateOpenDataConfig(
        state=StateCode.NC,
        data_portal_url="https://data.nconemap.gov",
        api_base_url="https://data.nconemap.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.MI: StateOpenDataConfig(
        state=StateCode.MI,
        data_portal_url="https://data.michigan.gov",
        api_base_url="https://data.michigan.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    # Medium Data Availability States
    StateCode.VA: StateOpenDataConfig(
        state=StateCode.VA,
        data_portal_url="https://data.virginia.gov",
        api_base_url="https://data.virginia.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.WA: StateOpenDataConfig(
        state=StateCode.WA,
        data_portal_url="https://data.wa.gov",
        api_base_url="https://data.wa.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.AZ: StateOpenDataConfig(
        state=StateCode.AZ,
        data_portal_url="https://data.az.gov",
        api_base_url="https://data.az.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.MA: StateOpenDataConfig(
        state=StateCode.MA,
        data_portal_url="https://data.mass.gov",
        api_base_url="https://data.mass.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.TN: StateOpenDataConfig(
        state=StateCode.TN,
        data_portal_url="https://data.tn.gov",
        api_base_url="https://data.tn.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.IN: StateOpenDataConfig(
        state=StateCode.IN,
        data_portal_url="https://data.in.gov",
        api_base_url="https://data.in.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.MO: StateOpenDataConfig(
        state=StateCode.MO,
        data_portal_url="https://data.mo.gov",
        api_base_url="https://data.mo.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.MD: StateOpenDataConfig(
        state=StateCode.MD,
        data_portal_url="https://opendata.maryland.gov",
        api_base_url="https://opendata.maryland.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.WI: StateOpenDataConfig(
        state=StateCode.WI,
        data_portal_url="https://data.wi.gov",
        api_base_url="https://data.wi.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.CO: StateOpenDataConfig(
        state=StateCode.CO,
        data_portal_url="https://data.colorado.gov",
        api_base_url="https://data.colorado.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    # Lower Data Availability States
    StateCode.AL: StateOpenDataConfig(
        state=StateCode.AL,
        data_portal_url="https://data.alabama.gov",
        api_base_url="https://data.alabama.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.AK: StateOpenDataConfig(
        state=StateCode.AK,
        data_portal_url="https://data.alaska.gov",
        api_base_url="https://data.alaska.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.AR: StateOpenDataConfig(
        state=StateCode.AR,
        data_portal_url="https://data.arkansas.gov",
        api_base_url="https://data.arkansas.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.CT: StateOpenDataConfig(
        state=StateCode.CT,
        data_portal_url="https://data.ct.gov",
        api_base_url="https://data.ct.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=False,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    ),
    
    StateCode.DE: StateOpenDataConfig(
        state=StateCode.DE,
        data_portal_url="https://data.delaware.gov",
        api_base_url="https://data.delaware.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.HI: StateOpenDataConfig(
        state=StateCode.HI,
        data_portal_url="https://data.hawaii.gov",
        api_base_url="https://data.hawaii.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.ID: StateOpenDataConfig(
        state=StateCode.ID,
        data_portal_url="https://data.idaho.gov",
        api_base_url="https://data.idaho.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.IA: StateOpenDataConfig(
        state=StateCode.IA,
        data_portal_url="https://data.iowa.gov",
        api_base_url="https://data.iowa.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.KS: StateOpenDataConfig(
        state=StateCode.KS,
        data_portal_url="https://data.kansas.gov",
        api_base_url="https://data.kansas.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.KY: StateOpenDataConfig(
        state=StateCode.KY,
        data_portal_url="https://data.ky.gov",
        api_base_url="https://data.ky.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.LA: StateOpenDataConfig(
        state=StateCode.LA,
        data_portal_url="https://data.louisiana.gov",
        api_base_url="https://data.louisiana.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.ME: StateOpenDataConfig(
        state=StateCode.ME,
        data_portal_url="https://data.maine.gov",
        api_base_url="https://data.maine.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.MN: StateOpenDataConfig(
        state=StateCode.MN,
        data_portal_url="https://data.mn.gov",
        api_base_url="https://data.mn.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.MS: StateOpenDataConfig(
        state=StateCode.MS,
        data_portal_url="https://data.mississippi.gov",
        api_base_url="https://data.mississippi.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.MT: StateOpenDataConfig(
        state=StateCode.MT,
        data_portal_url="https://data.montana.gov",
        api_base_url="https://data.montana.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.NE: StateOpenDataConfig(
        state=StateCode.NE,
        data_portal_url="https://data.nebraska.gov",
        api_base_url="https://data.nebraska.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.NV: StateOpenDataConfig(
        state=StateCode.NV,
        data_portal_url="https://data.nv.gov",
        api_base_url="https://data.nv.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.NH: StateOpenDataConfig(
        state=StateCode.NH,
        data_portal_url="https://data.nh.gov",
        api_base_url="https://data.nh.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.NJ: StateOpenDataConfig(
        state=StateCode.NJ,
        data_portal_url="https://data.nj.gov",
        api_base_url="https://data.nj.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.NM: StateOpenDataConfig(
        state=StateCode.NM,
        data_portal_url="https://data.newmexico.gov",
        api_base_url="https://data.newmexico.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.ND: StateOpenDataConfig(
        state=StateCode.ND,
        data_portal_url="https://data.nd.gov",
        api_base_url="https://data.nd.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.OK: StateOpenDataConfig(
        state=StateCode.OK,
        data_portal_url="https://data.ok.gov",
        api_base_url="https://data.ok.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.OR: StateOpenDataConfig(
        state=StateCode.OR,
        data_portal_url="https://data.oregon.gov",
        api_base_url="https://data.oregon.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.RI: StateOpenDataConfig(
        state=StateCode.RI,
        data_portal_url="https://data.ri.gov",
        api_base_url="https://data.ri.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.SC: StateOpenDataConfig(
        state=StateCode.SC,
        data_portal_url="https://data.sc.gov",
        api_base_url="https://data.sc.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.SD: StateOpenDataConfig(
        state=StateCode.SD,
        data_portal_url="https://data.sd.gov",
        api_base_url="https://data.sd.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.UT: StateOpenDataConfig(
        state=StateCode.UT,
        data_portal_url="https://data.utah.gov",
        api_base_url="https://data.utah.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='quarterly'
    ),
    
    StateCode.VT: StateOpenDataConfig(
        state=StateCode.VT,
        data_portal_url="https://data.vermont.gov",
        api_base_url="https://data.vermont.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.WV: StateOpenDataConfig(
        state=StateCode.WV,
        data_portal_url="https://data.wv.gov",
        api_base_url="https://data.wv.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.WY: StateOpenDataConfig(
        state=StateCode.WY,
        data_portal_url="https://data.wyoming.gov",
        api_base_url="https://data.wyoming.gov/api",
        api_key_required=False,
        rate_limit_per_hour=500,
        property_assessments=False,
        property_transactions=False,
        commercial_rent_data=False,
        zoning_data=False,
        tax_data=True,
        supported_formats=['CSV'],
        api_available=False,
        auth_type='none',
        update_frequency='annually'
    ),
    
    StateCode.DC: StateOpenDataConfig(
        state=StateCode.DC,
        data_portal_url="https://opendata.dc.gov",
        api_base_url="https://opendata.dc.gov/api",
        api_key_required=False,
        rate_limit_per_hour=1000,
        property_assessments=True,
        property_transactions=True,
        commercial_rent_data=False,
        zoning_data=True,
        tax_data=True,
        supported_formats=['CSV', 'JSON'],
        api_available=True,
        auth_type='none',
        update_frequency='monthly'
    )
}

def get_state_config(state_code: StateCode) -> Optional[StateOpenDataConfig]:
    """Get configuration for a specific state"""
    return COMPREHENSIVE_STATE_CONFIGS.get(state_code)

def get_all_state_configs() -> Dict[StateCode, StateOpenDataConfig]:
    """Get all state configurations"""
    return COMPREHENSIVE_STATE_CONFIGS

def get_states_by_data_availability() -> Dict[str, List[StateCode]]:
    """Get states categorized by data availability"""
    high_data = []
    medium_data = []
    low_data = []
    
    for state, config in COMPREHENSIVE_STATE_CONFIGS.items():
        if config.api_available and config.property_assessments and config.property_transactions:
            high_data.append(state)
        elif config.api_available and (config.property_assessments or config.property_transactions):
            medium_data.append(state)
        else:
            low_data.append(state)
    
    return {
        'high_data_availability': high_data,
        'medium_data_availability': medium_data,
        'low_data_availability': low_data
    }

def get_states_with_apis() -> List[StateCode]:
    """Get states with API access available"""
    return [state for state, config in COMPREHENSIVE_STATE_CONFIGS.items() if config.api_available]

def get_states_with_property_data() -> List[StateCode]:
    """Get states with property assessment data"""
    return [state for state, config in COMPREHENSIVE_STATE_CONFIGS.items() if config.property_assessments]

def get_states_with_transaction_data() -> List[StateCode]:
    """Get states with property transaction data"""
    return [state for state, config in COMPREHENSIVE_STATE_CONFIGS.items() if config.property_transactions]

def get_data_availability_summary() -> Dict[str, Any]:
    """Get summary of data availability across all states"""
    total_states = len(COMPREHENSIVE_STATE_CONFIGS)
    states_with_apis = len(get_states_with_apis())
    states_with_property_data = len(get_states_with_property_data())
    states_with_transaction_data = len(get_states_with_transaction_data())
    
    return {
        'total_states': total_states,
        'states_with_apis': states_with_apis,
        'states_with_property_data': states_with_property_data,
        'states_with_transaction_data': states_with_transaction_data,
        'api_coverage_percentage': (states_with_apis / total_states) * 100,
        'property_data_coverage_percentage': (states_with_property_data / total_states) * 100,
        'transaction_data_coverage_percentage': (states_with_transaction_data / total_states) * 100
    }
