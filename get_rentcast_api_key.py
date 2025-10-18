#!/usr/bin/env python3
"""
RentCast API Key Setup Script
=============================

This script helps you get a FREE RentCast API key for rental market data.
RentCast offers 50 free API calls per month with no credit card required!

Steps:
1. Go to https://developers.rentcast.io/
2. Sign up for a free account (no credit card required)
3. Get your API key from the dashboard
4. Run this script to update your .env file

"""

import os
import webbrowser
from pathlib import Path

def main():
    print("🏠 RENTCAST API KEY SETUP")
    print("=" * 50)
    print()
    print("RentCast offers 50 FREE API calls per month!")
    print("No credit card required - completely free!")
    print()
    
    # Open the RentCast signup page
    print("Opening RentCast signup page...")
    webbrowser.open("https://developers.rentcast.io/")
    print()
    
    print("Please follow these steps:")
    print("1. Sign up for a free account at https://developers.rentcast.io/")
    print("2. Get your API key from the dashboard")
    print("3. Come back here and enter your API key")
    print()
    
    # Get API key from user
    api_key = input("Enter your RentCast API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided. Exiting.")
        return
    
    # Update .env file
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ .env file not found. Please run the main setup first.")
        return
    
    # Read current .env file
    with open(env_path, 'r') as f:
        lines = f.readlines()
    
    # Update RENTCAST_API_KEY
    updated = False
    for i, line in enumerate(lines):
        if line.startswith('RENTCAST_API_KEY='):
            lines[i] = f'RENTCAST_API_KEY="{api_key}"\n'
            updated = True
            break
    
    if not updated:
        # Add new line if not found
        lines.append(f'RENTCAST_API_KEY="{api_key}"\n')
    
    # Write back to .env file
    with open(env_path, 'w') as f:
        f.writelines(lines)
    
    print("✅ API key saved to .env file!")
    print()
    print("🧪 Testing the API key...")
    
    # Test the API key
    try:
        import sys
        sys.path.append('server')
        from external_data_service import ExternalDataService
        from dotenv import load_dotenv
        
        load_dotenv()
        service = ExternalDataService()
        
        # Test with a sample address
        rental_data = service.get_rentcast_rental_data('123 Main St, San Francisco, CA', bedrooms=2)
        
        if rental_data:
            print("🎉 SUCCESS! Your RentCast API key is working!")
            print(f"   Estimated rent: ${rental_data.estimated_rent}")
            print(f"   Rent range: ${rental_data.rent_range_low} - ${rental_data.rent_range_high}")
        else:
            print("⚠️  API key saved but no data returned. This might be normal for test addresses.")
            print("   Try with a real address to verify it's working.")
    
    except Exception as e:
        print(f"❌ Error testing API key: {e}")
        print("   The API key was saved, but there was an error testing it.")
    
    print()
    print("🚀 Your rental market data integration is ready!")
    print("   You can now use the Flask API endpoints to get real rental data.")

if __name__ == "__main__":
    main()
