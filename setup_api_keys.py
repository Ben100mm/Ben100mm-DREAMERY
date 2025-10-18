#!/usr/bin/env python3
"""
API Keys Setup Script for Dreamery Rental Market Data Integration
This script helps you set up the required API keys for the rental market data integration.
"""

import os
import sys

def create_env_file():
    """Create a .env file with API key placeholders"""
    
    env_content = '''# PROPRIETARY SOFTWARE - DREAMERY SOFTWARE LLC
# Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
# Confidential and proprietary. Unauthorized access, use, or distribution is prohibited.

# Database Configuration
# For development (SQLite)
DATABASE_URL="file:./dev.db"

# Environment
NODE_ENV="development"

# Server Configuration
PORT=3000
HOST="localhost"

# Security
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
SESSION_SECRET="your-session-secret-key-change-in-production"

# External Data APIs
# Walk Score API - https://www.walkscore.com/professional/api-sign-up.php
WALKSCORE_API_KEY=""

# Google Places API - https://developers.google.com/maps/documentation/places/web-service
GOOGLE_PLACES_API_KEY=""

# US Census API - https://api.census.gov/data/
CENSUS_API_KEY=""

# Transit API (if using specific transit service)
TRANSIT_API_KEY=""

# School API (if using specific school data service)
SCHOOL_API_KEY=""

# Rental Market Data APIs
# RentCast API - https://developers.rentcast.io/ (50 free calls/month)
# Get your free API key at: https://developers.rentcast.io/
RENTCAST_API_KEY=""

# FreeWebApi - https://freewebapi.com/data-apis/real-estate-api/ (100 free calls/day)
# Get your free API key at: https://freewebapi.com/data-apis/real-estate-api/
FREEWEBAPI_API_KEY=""

# Apple Maps Configuration
# Get your JWT token from Apple Developer Console
# REACT_APP_APPLE_MAPS_JWT_TOKEN="your-apple-maps-jwt-token"

# Logging
LOG_LEVEL="debug"

# ML Risk Model Configuration
REACT_APP_ML_RISK_API_URL="http://localhost:8001"
REACT_APP_ML_RISK_ENABLED="true"
'''
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Created .env file with API key placeholders")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def setup_rental_api_keys():
    """Interactive setup for rental market data API keys"""
    
    print("\n🏠 RENTAL MARKET DATA API KEYS SETUP")
    print("=" * 50)
    
    print("\n1. RENTCAST API (Primary - 50 free calls/month)")
    print("   Get your free API key at: https://developers.rentcast.io/")
    print("   - Sign up for free account")
    print("   - Get API key from dashboard")
    print("   - Free tier: 50 calls per month")
    
    rentcast_key = input("\nEnter your RentCast API key (or press Enter to skip): ").strip()
    
    print("\n2. FREEWEBAPI (Secondary - 100 free calls/day)")
    print("   Get your free API key at: https://freewebapi.com/data-apis/real-estate-api/")
    print("   - Sign up for free account")
    print("   - Get API key from dashboard")
    print("   - Free tier: 100 calls per day")
    
    freewebapi_key = input("\nEnter your FreeWebApi API key (or press Enter to skip): ").strip()
    
    return rentcast_key, freewebapi_key

def update_env_file(rentcast_key, freewebapi_key):
    """Update the .env file with the provided API keys"""
    
    if not os.path.exists('.env'):
        print("❌ .env file not found. Please run the script again.")
        return False
    
    try:
        # Read current .env file
        with open('.env', 'r') as f:
            content = f.read()
        
        # Update API keys
        if rentcast_key:
            content = content.replace('RENTCAST_API_KEY=""', f'RENTCAST_API_KEY="{rentcast_key}"')
            print(f"✅ Updated RentCast API key")
        
        if freewebapi_key:
            content = content.replace('FREEWEBAPI_API_KEY=""', f'FREEWEBAPI_API_KEY="{freewebapi_key}"')
            print(f"✅ Updated FreeWebApi API key")
        
        # Write updated content
        with open('.env', 'w') as f:
            f.write(content)
        
        print("\n🎉 API keys have been added to .env file!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating .env file: {e}")
        return False

def test_api_keys():
    """Test the API keys by running a simple test"""
    
    print("\n🧪 TESTING API KEYS")
    print("=" * 30)
    
    try:
        # Load environment variables
        from dotenv import load_dotenv
        load_dotenv()
        
        rentcast_key = os.getenv('RENTCAST_API_KEY')
        freewebapi_key = os.getenv('FREEWEBAPI_API_KEY')
        
        print(f"RentCast API Key: {'✅ Set' if rentcast_key else '❌ Not set'}")
        print(f"FreeWebApi API Key: {'✅ Set' if freewebapi_key else '❌ Not set'}")
        
        if rentcast_key or freewebapi_key:
            print("\n🚀 Ready to test rental market data integration!")
            print("Run: python3 test_rental_integration.py")
        else:
            print("\n⚠️  No API keys set. The integration will work but won't fetch real data.")
            
    except ImportError:
        print("⚠️  python-dotenv not installed. Install with: pip install python-dotenv")
    except Exception as e:
        print(f"❌ Error testing API keys: {e}")

def main():
    """Main setup function"""
    
    print("🏠 DREAMERY RENTAL MARKET DATA INTEGRATION SETUP")
    print("=" * 60)
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        if not create_env_file():
            return
    
    # Setup API keys
    rentcast_key, freewebapi_key = setup_rental_api_keys()
    
    # Update .env file
    if rentcast_key or freewebapi_key:
        update_env_file(rentcast_key, freewebapi_key)
    
    # Test the setup
    test_api_keys()
    
    print("\n📋 NEXT STEPS:")
    print("1. Start the Flask server: cd server && python3 realtor_api.py")
    print("2. Test the API endpoints with curl or Postman")
    print("3. Check the documentation: docs/RENTAL_MARKET_DATA_INTEGRATION.md")
    print("4. Use the quick start guide: RENTAL_DATA_QUICK_START.md")

if __name__ == "__main__":
    main()
