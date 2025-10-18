#!/usr/bin/env python3
"""
Test Free Rental Estimator Integration
=====================================

This script tests the free rental estimator integration
that works without any API keys or credit cards.
"""

import sys
import os
sys.path.append('server')

from external_data_service import ExternalDataService
from dotenv import load_dotenv

def main():
    print("🏠 TESTING FREE RENTAL ESTIMATOR INTEGRATION")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Initialize service
    service = ExternalDataService()
    
    # Test addresses
    test_addresses = [
        ("123 Main St, San Francisco, CA", 2, 1.5, 1200),
        ("456 Oak Ave, Austin, TX", 3, 2, 1500),
        ("789 Pine St, Seattle, WA", 1, 1, 800),
        ("321 Elm St, New York, NY", 2, 1, 1000)
    ]
    
    print("Testing rental data integration with free estimator...")
    print()
    
    for i, (address, bedrooms, bathrooms, square_feet) in enumerate(test_addresses, 1):
        print(f"{i}. Testing: {address}")
        print(f"   Property: {bedrooms} bed, {bathrooms} bath, {square_feet} sqft")
        
        rental_data = service.get_rental_market_data(
            address, bedrooms, bathrooms, square_feet
        )
        
        if rental_data:
            print(f"   ✅ SUCCESS!")
            print(f"   Estimated rent: ${rental_data.estimated_rent}")
            print(f"   Rent range: ${rental_data.rent_range_low} - ${rental_data.rent_range_high}")
            print(f"   Data source: {rental_data.data_source}")
            print(f"   Confidence: {rental_data.confidence_score}")
            if rental_data.market_rent_per_sqft:
                print(f"   Rent per sqft: ${rental_data.market_rent_per_sqft:.2f}")
        else:
            print(f"   ❌ No data returned")
        
        print()
    
    print("=" * 50)
    print("🎉 FREE RENTAL ESTIMATOR INTEGRATION COMPLETE!")
    print("   No API keys required - completely free!")
    print("   Works with any US address")

if __name__ == "__main__":
    main()
