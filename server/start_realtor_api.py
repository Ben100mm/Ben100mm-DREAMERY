#!/usr/bin/env python3
"""
Startup script for the Realtor.com API server
"""

import sys
import os
import subprocess
import logging

# Add the server directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def install_requirements():
    """Install required Python packages"""
    try:
        subprocess.check_call([
            sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'
        ])
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False

def start_server():
    """Start the Flask API server"""
    try:
        import realtor_api
        app = realtor_api.app
        print("🚀 Starting Realtor.com API server...")
        print("📍 Server will be available at: http://localhost:8001")
        print("🔍 API endpoints:")
        print("   - POST /api/realtor/search - Search properties")
        print("   - GET  /api/realtor/property/<id> - Get property details")
        print("   - GET  /api/realtor/suggestions - Get suggestions")
        print("   - GET  /api/realtor/health - Health check")
        print("\nPress Ctrl+C to stop the server")
        
        app.run(debug=True, host='0.0.0.0', port=8001)
    except ImportError as e:
        print(f"❌ Failed to import realtor_api: {e}")
        print("Make sure all dependencies are installed")
        return False
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main function"""
    print("🏠 Dreamery Realtor.com API Server")
    print("=" * 40)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
