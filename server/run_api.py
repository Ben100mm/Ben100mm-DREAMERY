#!/usr/bin/env python3
"""
Simple script to run the Realtor API server
"""

import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the Flask app
try:
    from realtor_api import app
    print("🚀 Starting Realtor.com API server...")
    print("📍 Server will be available at: http://localhost:5001")
    print("🔍 API endpoints:")
    print("   - POST /api/realtor/search - Search properties")
    print("   - GET  /api/realtor/property/<id> - Get property details")
    print("   - GET  /api/realtor/suggestions - Get suggestions")
    print("   - GET  /api/realtor/health - Health check")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=8001)
except Exception as e:
    print(f"❌ Error starting server: {e}")
    import traceback
    traceback.print_exc()
