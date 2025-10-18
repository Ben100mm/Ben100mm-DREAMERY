#!/usr/bin/env python3
"""
Test Free Insurance Data API
Test script to verify free insurance data functionality
No API keys required
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5003"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/api/insurance/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Health check passed: {data['status']}")
            print(f"  Data source: {data['data_source']}")
            print(f"  Providers: {data['providers']}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Health check error: {e}")
        return False

def test_insurance_quotes():
    """Test the insurance quotes endpoint"""
    print("\nTesting insurance quotes...")
    
    # Test data
    test_property = {
        "propertyAddress": "123 Main St, San Francisco, CA 94102",
        "propertyType": "single-family",
        "constructionYear": "1995",
        "squareFootage": "2500",
        "coverageAmount": "850000",
        "policyType": "homeowners"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/insurance/quotes",
            json=test_property,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✓ Quotes request successful")
                print(f"  Total quotes: {data['total']}")
                print(f"  Data source: {data['data_source']}")
                
                # Display first few quotes
                if data['quotes']:
                    print(f"  Sample quotes:")
                    for i, quote in enumerate(data['quotes'][:3]):
                        print(f"    {i+1}. {quote['provider']}: ${quote['annualPremium']:,.2f}/year (Rating: {quote['rating']})")
                
                return True
            else:
                print(f"✗ Quotes request failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"✗ Quotes request failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Quotes request error: {e}")
        return False

def test_policy_binding():
    """Test the policy binding endpoint"""
    print("\nTesting policy binding...")
    
    # Test with a free data quote ID
    test_bind = {
        "quoteId": "free_1"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/insurance/bind",
            json=test_bind,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✓ Policy binding successful")
                print(f"  Policy ID: {data.get('policyId', 'N/A')}")
                print(f"  Message: {data.get('message', 'N/A')}")
                return True
            else:
                print(f"✗ Policy binding failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"✗ Policy binding failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Policy binding error: {e}")
        return False

def test_different_properties():
    """Test quotes for different property types and locations"""
    print("\nTesting different property types...")
    
    test_cases = [
        {
            "name": "Condo in New York",
            "data": {
                "propertyAddress": "456 Park Ave, New York, NY 10022",
                "propertyType": "condo",
                "constructionYear": "2010",
                "squareFootage": "1200",
                "coverageAmount": "600000",
                "policyType": "condo"
            }
        },
        {
            "name": "Townhouse in Texas",
            "data": {
                "propertyAddress": "789 Oak St, Austin, TX 78701",
                "propertyType": "townhouse",
                "constructionYear": "2005",
                "squareFootage": "1800",
                "coverageAmount": "450000",
                "policyType": "homeowners"
            }
        }
    ]
    
    passed = 0
    for test_case in test_cases:
        try:
            response = requests.post(
                f"{BASE_URL}/api/insurance/quotes",
                json=test_case["data"],
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['success'] and data['total'] > 0:
                    print(f"✓ {test_case['name']}: {data['total']} quotes")
                    passed += 1
                else:
                    print(f"✗ {test_case['name']}: No quotes returned")
            else:
                print(f"✗ {test_case['name']}: Request failed")
        except Exception as e:
            print(f"✗ {test_case['name']}: Error - {e}")
    
    return passed == len(test_cases)

def main():
    """Run all tests"""
    print("Free Insurance Data API Test Suite")
    print("=" * 50)
    print("✅ NO API KEYS REQUIRED")
    print("✅ USES FREE PUBLIC DATA SOURCES")
    print("=" * 50)
    
    # Check if API is running
    print("Checking if API server is running...")
    try:
        response = requests.get(f"{BASE_URL}/api/insurance/health", timeout=5)
        if response.status_code != 200:
            print("✗ API server is not running or not responding")
            print("Please start the API server with: python3 start_free_insurance_api.py")
            return
    except Exception as e:
        print("✗ Cannot connect to API server")
        print("Please start the API server with: python3 start_free_insurance_api.py")
        return
    
    print("✓ API server is running")
    
    # Run tests
    tests = [
        test_health_check,
        test_insurance_quotes,
        test_policy_binding,
        test_different_properties
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ All tests passed! Free Insurance Data API is working correctly.")
        print("\n🎉 Benefits:")
        print("  - No API keys required")
        print("  - Uses free public data sources")
        print("  - Realistic premium calculations")
        print("  - Multiple property types supported")
        print("  - State-specific rate calculations")
        print("  - 8 major insurance providers")
    else:
        print("✗ Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()
