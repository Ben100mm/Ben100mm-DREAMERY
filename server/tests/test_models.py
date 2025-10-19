import pytest
from datetime import datetime
from models import (
    Property, Address, Description, PropertyType, ListingType, 
    SearchPropertyType, ReturnType, HomeFlags, PetPolicy, OpenHouse,
    PropertyData, Agent, Office, Broker
)

class TestModels:
    """Test cases for Dreamery property models"""
    
    def test_address_model(self):
        """Test Address model creation and validation"""
        address = Address(
            full_line="123 Test St",
            city="Test City", 
            state="TX",
            zip="12345"
        )
        
        assert address.full_line == "123 Test St"
        assert address.city == "Test City"
        assert address.state == "TX"
        assert address.zip == "12345"
        assert "123 Test St" in address.formatted_address
        assert "Test City" in address.formatted_address
    
    def test_description_model(self):
        """Test Description model creation and validation"""
        description = Description(
            beds=3,
            baths_full=2,
            baths_half=1,
            sqft=2000,
            year_built=2020
        )
        
        assert description.beds == 3
        assert description.baths_full == 2
        assert description.baths_half == 1
        assert description.sqft == 2000
        assert description.year_built == 2020
    
    def test_property_model(self):
        """Test Property model creation and validation"""
        address = Address(
            full_line="123 Test St",
            city="Test City",
            state="TX", 
            zip="12345"
        )
        
        description = Description(
            beds=3,
            baths_full=2,
            sqft=2000
        )
        
        property_obj = Property(
            property_url="https://www.realtor.com/property/test123",
            property_id="test123",
            status="for_sale",
            list_price=500000,
            address=address,
            description=description
        )
        
        assert property_obj.property_id == "test123"
        assert property_obj.status == "for_sale"
        assert property_obj.list_price == 500000
        assert property_obj.address.city == "Test City"
        assert property_obj.description.beds == 3
    
    def test_property_data_model(self):
        """Test PropertyData model creation and validation"""
        property_data = PropertyData(
            property_id="test123",
            address="123 Test St, Test City, TX 12345",
            price=500000,
            beds=3,
            baths=2.5,
            sqft=2000,
            property_type="single_family",
            listing_type="for_sale",
            status="active"
        )
        
        assert property_data.property_id == "test123"
        assert property_data.price == 500000
        assert property_data.beds == 3
        assert property_data.baths == 2.5
        assert property_data.sqft == 2000
    
    def test_agent_model(self):
        """Test Agent model creation and validation"""
        agent = Agent(
            name="John Doe",
            email="john@example.com",
            state_license="TX123456"
        )
        
        assert agent.name == "John Doe"
        assert agent.email == "john@example.com"
        assert agent.state_license == "TX123456"
    
    def test_home_flags_model(self):
        """Test HomeFlags model creation and validation"""
        flags = HomeFlags(
            is_pending=True,
            is_contingent=False,
            is_new_construction=True,
            is_foreclosure=False
        )
        
        assert flags.is_pending is True
        assert flags.is_contingent is False
        assert flags.is_new_construction is True
        assert flags.is_foreclosure is False
    
    def test_pet_policy_model(self):
        """Test PetPolicy model creation and validation"""
        pet_policy = PetPolicy(
            cats=True,
            dogs=True,
            dogs_small=True,
            dogs_large=False
        )
        
        assert pet_policy.cats is True
        assert pet_policy.dogs is True
        assert pet_policy.dogs_small is True
        assert pet_policy.dogs_large is False
    
    def test_open_house_model(self):
        """Test OpenHouse model creation and validation"""
        start_date = datetime.now()
        end_date = datetime.now()
        
        open_house = OpenHouse(
            start_date=start_date,
            end_date=end_date,
            description="Weekend open house",
            time_zone="America/New_York"
        )
        
        assert open_house.start_date == start_date
        assert open_house.end_date == end_date
        assert open_house.description == "Weekend open house"
        assert open_house.time_zone == "America/New_York"
    
    def test_enums(self):
        """Test enum values"""
        assert ListingType.FOR_SALE.value == "FOR_SALE"
        assert ListingType.FOR_RENT.value == "FOR_RENT"
        assert ListingType.PENDING.value == "PENDING"
        assert ListingType.SOLD.value == "SOLD"
        
        assert PropertyType.SINGLE_FAMILY.value == "SINGLE_FAMILY"
        assert PropertyType.APARTMENT.value == "APARTMENT"
        assert PropertyType.CONDO.value == "CONDO"
        
        assert ReturnType.pandas.value == "pandas"
        assert ReturnType.pydantic.value == "pydantic"
        assert ReturnType.raw.value == "raw"
