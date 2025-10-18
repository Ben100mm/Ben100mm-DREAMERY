#!/usr/bin/env python3
"""
Start Free Insurance Data API Server
Runs the free insurance data service on port 5003
No API keys required - uses public data sources
"""

import os
import sys
from pathlib import Path

# Add the server directory to Python path
server_dir = Path(__file__).parent
sys.path.insert(0, str(server_dir))

if __name__ == '__main__':
    # Import and run the free insurance data API
    from free_insurance_data import app
    
    port = int(os.getenv('FREE_INSURANCE_API_PORT', 5003))
    host = os.getenv('FREE_INSURANCE_API_HOST', '0.0.0.0')
    
    print(f"Starting Free Insurance Data API server on {host}:{port}")
    print("✅ NO API KEYS REQUIRED - Uses free public data sources")
    print("Available endpoints:")
    print("  GET  /api/insurance/health - Health check")
    print("  POST /api/insurance/quotes - Get insurance quotes")
    print("  POST /api/insurance/bind   - Bind insurance policy")
    print("\nData sources:")
    print("  - Public insurance rate data")
    print("  - State-based rate calculations")
    print("  - Property-specific factors")
    print("  - Real provider information")
    print("\nFeatures:")
    print("  - 8 major insurance providers")
    print("  - Realistic premium calculations")
    print("  - State-specific rates")
    print("  - Property age and size factors")
    print("  - Completely free to use")
    
    app.run(host=host, port=port, debug=True)
