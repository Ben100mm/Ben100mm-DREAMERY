#!/usr/bin/env python3
"""
RentCast Subscription Activation Script
======================================

Your RentCast API key is valid, but you need to activate your subscription.
This script will help you activate your free subscription.

"""

import webbrowser
import os
from dotenv import load_dotenv

def main():
    print("🏠 RENTCAST SUBSCRIPTION ACTIVATION")
    print("=" * 50)
    print()
    
    # Load current API key
    load_dotenv()
    api_key = os.getenv('RENTCAST_API_KEY')
    
    if not api_key:
        print("❌ No RentCast API key found in .env file")
        print("   Please run get_rentcast_api_key.py first")
        return
    
    print(f"✅ Your API key: {api_key}")
    print()
    print("🔧 ISSUE: Your API key is valid but subscription is inactive")
    print("   Error: 'billing/subscription-inactive'")
    print()
    print("📋 STEPS TO ACTIVATE YOUR FREE SUBSCRIPTION:")
    print("   1. Go to your RentCast API dashboard")
    print("   2. Navigate to the 'Billing' or 'Subscription' section")
    print("   3. Activate your free plan (50 calls/month)")
    print("   4. Make sure your subscription is active")
    print()
    
    # Open the RentCast dashboard
    print("🌐 Opening RentCast API dashboard...")
    webbrowser.open("https://app.rentcast.io/")
    print()
    
    print("📝 After activating your subscription:")
    print("   1. Wait a few minutes for the changes to take effect")
    print("   2. Run: python3 test_rentcast_integration.py")
    print("   3. Your rental market data integration will be ready!")
    print()
    
    print("💡 TIP: The free plan gives you 50 API calls per month")
    print("   This is perfect for testing and development!")

if __name__ == "__main__":
    main()
