#!/usr/bin/env python3
"""
Test Insurance API
Simple test script to verify insurance API functionality
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5002"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/api/insurance/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Health check passed: {data['status']}")
            print(f"  Available APIs: {', '.join(data['available_apis'])}")
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
                
                # Display first quote if available
                if data['quotes']:
                    quote = data['quotes'][0]
                    print(f"  Sample quote:")
                    print(f"    Provider: {quote['provider']}")
                    print(f"    Premium: ${quote['annualPremium']:,.2f}/year")
                    print(f"    Deductible: ${quote['deductible']:,.2f}")
                    print(f"    API Source: {quote['apiSource']}")
                
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
    
    # Test with a mock quote ID
    test_bind = {
        "quoteId": "test_12345"
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

def main():
    """Run all tests"""
    print("Insurance API Test Suite")
    print("=" * 50)
    
    # Check if API is running
    print("Checking if API server is running...")
    try:
        response = requests.get(f"{BASE_URL}/api/insurance/health", timeout=5)
        if response.status_code != 200:
            print("✗ API server is not running or not responding")
            print("Please start the API server with: python start_insurance_api.py")
            return
    except Exception as e:
        print("✗ Cannot connect to API server")
        print("Please start the API server with: python start_insurance_api.py")
        return
    
    print("✓ API server is running")
    
    # Run tests
    tests = [
        test_health_check,
        test_insurance_quotes,
        test_policy_binding
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
        print("✓ All tests passed! Insurance API is working correctly.")
    else:
        print("✗ Some tests failed. Check the output above for details.")
        print("\nTroubleshooting tips:")
        print("1. Make sure API keys are configured in insurance_config.env")
        print("2. Check that all required APIs are accessible")
        print("3. Review the server logs for error details")

if __name__ == "__main__":
    main()
