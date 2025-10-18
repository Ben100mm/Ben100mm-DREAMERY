#!/usr/bin/env python3
"""
Debug Census API to see what's happening
"""

import os
import sys
import requests
import json

# Add the server directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def debug_census_api():
    """Debug the Census API call"""
    api_key = "9cf4e4da721198bafff44b65e180798c7213642b"
    
    # Test the Census API directly
    url = "https://api.census.gov/data/2022/acs/acs5"
    
    # Test with San Francisco coordinates
    params = {
        'get': 'B01003_001E,B19013_001E',  # Total population, median household income
        'for': 'state:06&in=county:075',   # California, San Francisco County
        'key': api_key
    }
    
    print(f"URL: {url}")
    print(f"Params: {params}")
    
    try:
        response = requests.get(url, params=params, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text[:500]}...")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"JSON Data: {data}")
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                print(f"Raw Response: {response.text}")
        else:
            print(f"Error Response: {response.text}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    debug_census_api()
