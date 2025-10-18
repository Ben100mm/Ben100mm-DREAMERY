#!/usr/bin/env python3
"""
Debug Census tract lookup
"""

import requests
import json

def debug_census_tract():
    """Debug the Census tract lookup"""
    url = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
    params = {
        'x': -122.4194,  # San Francisco longitude
        'y': 37.7749,    # San Francisco latitude
        'benchmark': 'Public_AR_Current',
        'vintage': 'Current_Current',
        'format': 'json'
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
    debug_census_tract()
