#!/usr/bin/env python3
"""
Start Insurance API Server
Runs the insurance API service on port 5002
"""

import os
import sys
from pathlib import Path

# Add the server directory to Python path
server_dir = Path(__file__).parent
sys.path.insert(0, str(server_dir))

# Load environment variables from insurance config
def load_insurance_env():
    """Load environment variables from insurance config file"""
    config_file = server_dir.parent / 'insurance_config.env'
    if config_file.exists():
        with open(config_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

if __name__ == '__main__':
    # Load insurance-specific environment variables
    load_insurance_env()
    
    # Import and run the insurance API
    from insurance_api import app
    
    port = int(os.getenv('INSURANCE_API_PORT', 5002))
    host = os.getenv('INSURANCE_API_HOST', '0.0.0.0')
    
    print(f"Starting Insurance API server on {host}:{port}")
    print("Available endpoints:")
    print("  GET  /api/insurance/health - Health check")
    print("  POST /api/insurance/quotes - Get insurance quotes")
    print("  POST /api/insurance/bind   - Bind insurance policy")
    print("\nTo get API keys, visit:")
    print("  - InsureHero: https://insurehero.io")
    print("  - GigEasy: https://gigeasy.ai/developers.html")
    print("  - Fize: https://getfize.com")
    print("  - Openkoda: https://openkoda.com")
    
    app.run(host=host, port=port, debug=True)
