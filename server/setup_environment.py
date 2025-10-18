#!/usr/bin/env python3
"""
Environment Setup Script for Comprehensive Data Integration
Sets up all required API keys and configurations
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def create_env_file():
    """Create .env file with all required API keys"""
    env_content = """# Comprehensive Data Integration Environment Variables

# Federal API Keys (REQUIRED)
CENSUS_API_KEY=your_census_api_key_here
BLS_API_KEY=your_bls_api_key_here
DATA_GOV_API_KEY=your_data_gov_api_key_here

# Existing API Keys
WALKSCORE_API_KEY=your_walkscore_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
RENTCAST_API_KEY=your_rentcast_api_key_here
FREEWEBAPI_API_KEY=your_freewebapi_api_key_here

# Rate Limiting
CENSUS_RATE_LIMIT=500
BLS_RATE_LIMIT=500
DATA_GOV_RATE_LIMIT=1000
WALKSCORE_RATE_LIMIT=1000
GOOGLE_PLACES_RATE_LIMIT=1000
RENTCAST_RATE_LIMIT=50
FREEWEBAPI_RATE_LIMIT=100

# API Configuration
COMPREHENSIVE_API_PORT=8003
COMPREHENSIVE_API_HOST=0.0.0.0
COMPREHENSIVE_API_DEBUG=false

# Cache Settings
CACHE_ENABLED=true
CACHE_DURATION_HOURS=24
"""
    
    env_file = Path("server/.env")
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print(f"✅ Created {env_file}")
    return env_file

def get_api_key_instructions():
    """Get instructions for obtaining API keys"""
    instructions = {
        "Census Bureau API": {
            "url": "https://api.census.gov/data/key_signup.html",
            "description": "Free API key for demographic and economic data",
            "required": True,
            "rate_limit": "500 requests/hour"
        },
        "Bureau of Labor Statistics API": {
            "url": "https://api.bls.gov/publicAPI/v2/timeseries/data/",
            "description": "Free API for employment and wage data",
            "required": True,
            "rate_limit": "500 requests/hour"
        },
        "Data.gov API": {
            "url": "https://catalog.data.gov/api/3",
            "description": "Free API for federal and state datasets",
            "required": False,
            "rate_limit": "1000 requests/hour"
        },
        "Walk Score API": {
            "url": "https://www.walkscore.com/professional/api-sign-up.php",
            "description": "Walkability and transit scores",
            "required": False,
            "rate_limit": "1000 requests/hour"
        },
        "Google Places API": {
            "url": "https://console.cloud.google.com/apis/credentials",
            "description": "Places and amenities data",
            "required": False,
            "rate_limit": "1000 requests/hour"
        }
    }
    return instructions

def print_setup_instructions():
    """Print setup instructions"""
    print("\n" + "="*60)
    print("COMPREHENSIVE DATA INTEGRATION SETUP")
    print("="*60)
    
    instructions = get_api_key_instructions()
    
    print("\n📋 REQUIRED API KEYS:")
    for api_name, info in instructions.items():
        if info["required"]:
            print(f"\n🔑 {api_name}")
            print(f"   URL: {info['url']}")
            print(f"   Description: {info['description']}")
            print(f"   Rate Limit: {info['rate_limit']}")
    
    print("\n📋 OPTIONAL API KEYS:")
    for api_name, info in instructions.items():
        if not info["required"]:
            print(f"\n🔑 {api_name}")
            print(f"   URL: {info['url']}")
            print(f"   Description: {info['description']}")
            print(f"   Rate Limit: {info['rate_limit']}")
    
    print("\n" + "="*60)
    print("SETUP STEPS:")
    print("="*60)
    print("1. Get API keys from the URLs above")
    print("2. Edit server/.env file with your API keys")
    print("3. Run: python3 server/test_comprehensive_integration.py")
    print("4. Start API: python3 server/start_comprehensive_api.py")
    print("\n" + "="*60)

def create_quick_start_script():
    """Create a quick start script"""
    script_content = """#!/bin/bash
# Quick Start Script for Comprehensive Data Integration

echo "🚀 Starting Comprehensive Data Integration API..."

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "❌ .env file not found. Please run setup_environment.py first."
    exit 1
fi

# Check if API keys are configured
if grep -q "your_.*_api_key_here" server/.env; then
    echo "⚠️  Warning: Some API keys are not configured."
    echo "   Edit server/.env file with your actual API keys."
fi

# Start the API
cd server
python3 start_comprehensive_api.py
"""
    
    script_file = Path("start_comprehensive_api.sh")
    with open(script_file, 'w') as f:
        f.write(script_content)
    
    # Make executable
    os.chmod(script_file, 0o755)
    print(f"✅ Created {script_file}")

def create_docker_setup():
    """Create Docker setup for easy deployment"""
    dockerfile_content = """FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY server/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY server/ .

# Expose port
EXPOSE 8003

# Set environment variables
ENV COMPREHENSIVE_API_PORT=8003
ENV COMPREHENSIVE_API_HOST=0.0.0.0

# Start the application
CMD ["python3", "start_comprehensive_api.py"]
"""
    
    dockerfile = Path("Dockerfile")
    with open(dockerfile, 'w') as f:
        f.write(dockerfile_content)
    
    print(f"✅ Created {dockerfile}")

def create_requirements_file():
    """Create requirements.txt file"""
    requirements = """flask==2.3.3
flask-cors==4.0.0
requests==2.31.0
pandas==2.0.3
urllib3==1.26.18
"""
    
    req_file = Path("server/requirements.txt")
    with open(req_file, 'w') as f:
        f.write(requirements)
    
    print(f"✅ Created {req_file}")

def main():
    """Main setup function"""
    print("🔧 Setting up Comprehensive Data Integration Environment...")
    
    # Create .env file
    create_env_file()
    
    # Create requirements file
    create_requirements_file()
    
    # Create quick start script
    create_quick_start_script()
    
    # Create Docker setup
    create_docker_setup()
    
    # Print instructions
    print_setup_instructions()
    
    print("\n✅ Setup complete! Follow the instructions above to get started.")

if __name__ == "__main__":
    main()
