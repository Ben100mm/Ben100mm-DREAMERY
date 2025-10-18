#!/usr/bin/env python3
"""
Debug Census demographics lookup
"""

import requests
import json

def debug_census_demographics():
    """Debug the Census demographics lookup"""
    url = "https://api.census.gov/data/2022/acs/acs5"
    params = {
        'get': 'B01003_001E,B01002_001E,B19013_001E,B17001_002E,B25001_001E,B25003_001E,B25003_002E,B25003_003E',
        'for': 'tract:010100',  # Example tract
        'in': 'state:06 county:075'  # California, San Francisco County
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
                print(f"JSON Data: {json.dumps(data, indent=2)[:1000]}...")
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
        else:
            print(f"Error Response: {response.text}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    debug_census_demographics()
