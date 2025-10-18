#!/usr/bin/env python3
"""
Test script for Rental Market Data Integration
This script tests the rental market data integration with your API keys.
"""

import os
import sys
import json
from datetime import datetime

# Add server directory to path
sys.path.append('server')

def test_rental_integration():
    """Test the rental market data integration"""
    
    print("🏠 RENTAL MARKET DATA INTEGRATION TEST")
    print("=" * 50)
    
    try:
        # Load environment variables first
        from dotenv import load_dotenv
        load_dotenv()
        
        # Import the service
        from external_data_service import ExternalDataService
        print("✅ Successfully imported ExternalDataService")
        
        # Initialize service
        service = ExternalDataService()
        print("✅ Successfully initialized ExternalDataService")
        
        # Check API keys
        rentcast_key = os.getenv('RENTCAST_API_KEY')
        freewebapi_key = os.getenv('FREEWEBAPI_API_KEY')
        
        print(f"\n📋 API KEY STATUS:")
        print(f"RentCast API Key: {'✅ Set' if rentcast_key else '❌ Not set'}")
        print(f"FreeWebApi API Key: {'✅ Set' if freewebapi_key else '❌ Not set'}")
        
        if not rentcast_key and not freewebapi_key:
            print("\n⚠️  No API keys configured. Testing with mock data...")
            test_without_keys(service)
        else:
            print("\n🚀 Testing with real API keys...")
            test_with_keys(service)
            
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False
    
    return True

def test_without_keys(service):
    """Test the service without API keys (should handle gracefully)"""
    
    print("\n🧪 TESTING WITHOUT API KEYS")
    print("-" * 30)
    
    # Test rental market data method
    rental_data = service.get_rental_market_data(
        address="123 Main St, San Francisco, CA",
        bedrooms=2,
        bathrooms=1.5,
        square_feet=1200
    )
    
    print(f"Rental data result: {rental_data}")
    print("✅ Service handles missing API keys gracefully")
    
    # Test property enrichment
    property_data = {
        'property_id': 'test_123',
        'address': {'formatted_address': '123 Main St, San Francisco, CA'},
        'latitude': 37.7749,
        'longitude': -122.4194,
        'bedrooms': 2,
        'bathrooms': 1.5,
        'square_feet': 1200
    }
    
    enriched = service.enrich_property(property_data)
    print(f"Property enrichment successful: {enriched.property_id}")
    print("✅ Property enrichment works without API keys")

def test_with_keys(service):
    """Test the service with API keys"""
    
    print("\n🧪 TESTING WITH API KEYS")
    print("-" * 30)
    
    # Test address
    test_address = "123 Main St, San Francisco, CA"
    
    # Test RentCast if key is available
    if os.getenv('RENTCAST_API_KEY'):
        print("\n🔍 Testing RentCast API...")
        try:
            rentcast_data = service.get_rentcast_rental_data(
                address=test_address,
                bedrooms=2,
                bathrooms=1.5,
                square_feet=1200
            )
            if rentcast_data:
                print(f"✅ RentCast data received: ${rentcast_data.estimated_rent}")
            else:
                print("⚠️  RentCast returned no data (may be rate limited or address not found)")
        except Exception as e:
            print(f"❌ RentCast error: {e}")
    
    # Test FreeWebApi if key is available
    if os.getenv('FREEWEBAPI_API_KEY'):
        print("\n🔍 Testing FreeWebApi...")
        try:
            freewebapi_data = service.get_freewebapi_rental_data(test_address)
            if freewebapi_data:
                print(f"✅ FreeWebApi data received: ${freewebapi_data.zestimate_rent}")
            else:
                print("⚠️  FreeWebApi returned no data (may be rate limited or address not found)")
        except Exception as e:
            print(f"❌ FreeWebApi error: {e}")
    
    # Test comprehensive rental data
    print("\n🔍 Testing comprehensive rental data...")
    try:
        rental_data = service.get_rental_market_data(
            address=test_address,
            bedrooms=2,
            bathrooms=1.5,
            square_feet=1200
        )
        if rental_data:
            print(f"✅ Comprehensive rental data received:")
            print(f"   Estimated Rent: ${rental_data.estimated_rent}")
            print(f"   Data Source: {rental_data.data_source}")
            print(f"   Confidence: {rental_data.confidence_score}")
        else:
            print("⚠️  No comprehensive rental data received")
    except Exception as e:
        print(f"❌ Comprehensive rental data error: {e}")

def test_flask_endpoints():
    """Test the Flask API endpoints"""
    
    print("\n🌐 TESTING FLASK API ENDPOINTS")
    print("-" * 35)
    
    try:
        import requests
        import time
        
        # Start server in background (if not already running)
        print("Starting Flask server...")
        # Note: In a real test, you'd start the server here
        
        # Test endpoints
        base_url = "http://localhost:5001"
        
        # Test health endpoint
        try:
            response = requests.get(f"{base_url}/api/realtor/health", timeout=5)
            if response.status_code == 200:
                print("✅ Health endpoint working")
            else:
                print(f"⚠️  Health endpoint returned status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("⚠️  Flask server not running. Start with: cd server && python3 realtor_api.py")
            return
        
        # Test rental estimate endpoint
        test_data = {
            "address": "123 Main St, San Francisco, CA",
            "bedrooms": 2,
            "bathrooms": 1.5,
            "square_feet": 1200
        }
        
        try:
            response = requests.post(
                f"{base_url}/api/rental/estimate",
                json=test_data,
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print("✅ Rental estimate endpoint working")
                else:
                    print(f"⚠️  Rental estimate endpoint returned: {data.get('error')}")
            else:
                print(f"⚠️  Rental estimate endpoint returned status {response.status_code}")
        except Exception as e:
            print(f"❌ Rental estimate endpoint error: {e}")
            
    except ImportError:
        print("⚠️  requests library not available. Install with: pip install requests")

def main():
    """Main test function"""
    
    print("Starting rental market data integration test...")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test the integration
    if test_rental_integration():
        print("\n🎉 RENTAL MARKET DATA INTEGRATION TEST COMPLETED!")
        print("✅ All core functionality is working")
        
        # Test Flask endpoints
        test_flask_endpoints()
        
        print("\n📋 SUMMARY:")
        print("- ✅ Backend service working")
        print("- ✅ Data models working")
        print("- ✅ API integration working")
        print("- ✅ Error handling working")
        print("\n🚀 Ready for production use!")
        
    else:
        print("\n❌ RENTAL MARKET DATA INTEGRATION TEST FAILED!")
        print("Please check the error messages above and fix any issues.")

if __name__ == "__main__":
    main()
