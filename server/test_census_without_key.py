#!/usr/bin/env python3
"""
Test Census API without key to see the expected format
"""

import requests
import json

def test_census_without_key():
    """Test Census API without key to see expected response"""
    url = "https://api.census.gov/data/2022/acs/acs5"
    
    # Test with San Francisco coordinates
    params = {
        'get': 'B01003_001E,B19013_001E',  # Total population, median household income
        'for': 'state:06&in=county:075',   # California, San Francisco County
    }
    
    print(f"URL: {url}")
    print(f"Params: {params}")
    
    try:
        response = requests.get(url, params=params, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response Text: {response.text[:500]}...")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"JSON Data: {data}")
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
        else:
            print(f"Error Response: {response.text}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_census_without_key()
