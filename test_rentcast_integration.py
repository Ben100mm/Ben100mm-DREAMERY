#!/usr/bin/env python3
"""
RentCast Integration Test Script
===============================

This script tests your RentCast API integration after subscription activation.

"""

import sys
sys.path.append('server')
from external_data_service import ExternalDataService
import os
from dotenv import load_dotenv

def test_rentcast_integration():
    print("🏠 RENTCAST INTEGRATION TEST")
    print("=" * 50)
    print()
    
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('RENTCAST_API_KEY')
    
    if not api_key:
        print("❌ No RentCast API key found in .env file")
        return False
    
    print(f"✅ API Key: {api_key}")
    print()
    
    # Initialize service
    try:
        service = ExternalDataService()
        print("✅ ExternalDataService initialized")
    except Exception as e:
        print(f"❌ Error initializing service: {e}")
        return False
    
    # Test addresses
    test_addresses = [
        "1600 Amphitheatre Parkway, Mountain View, CA 94043",
        "123 Main St, Austin, TX 78701",
        "456 Oak Ave, Seattle, WA 98101"
    ]
    
    print("\\n🧪 Testing RentCast API with multiple addresses...")
    print("-" * 50)
    
    success_count = 0
    
    for i, address in enumerate(test_addresses, 1):
        print(f"\\n{i}. Testing: {address}")
        try:
            rental_data = service.get_rentcast_rental_data(address, bedrooms=2, bathrooms=1.5, square_feet=1200)
            
            if rental_data:
                print(f"   ✅ SUCCESS!")
                print(f"   Estimated rent: ${rental_data.estimated_rent}")
                print(f"   Rent range: ${rental_data.rent_range_low} - ${rental_data.rent_range_high}")
                print(f"   Confidence: {rental_data.confidence}")
                print(f"   Property ID: {rental_data.property_id}")
                success_count += 1
            else:
                print(f"   ⚠️  No data returned (this might be normal for some addresses)")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\\n" + "=" * 50)
    print(f"📊 RESULTS: {success_count}/{len(test_addresses)} addresses returned data")
    
    if success_count > 0:
        print("🎉 SUCCESS! Your RentCast integration is working!")
        print("   You can now use the Flask API endpoints to get real rental data.")
        
        # Test comprehensive rental data
        print("\\n🔍 Testing comprehensive rental data...")
        rental_data = service.get_rental_market_data("1600 Amphitheatre Parkway, Mountain View, CA 94043", bedrooms=2, bathrooms=1.5, square_feet=1200)
        
        if rental_data:
            print("✅ Comprehensive rental data working!")
            print(f"   Data source: {rental_data.data_source}")
            print(f"   Estimated rent: ${rental_data.estimated_rent}")
        else:
            print("⚠️  Comprehensive rental data returned None")
        
        return True
    else:
        print("❌ No data returned from any address")
        print("   Please check your RentCast subscription status")
        print("   Run: python3 activate_rentcast_subscription.py")
        return False

if __name__ == "__main__":
    test_rentcast_integration()
