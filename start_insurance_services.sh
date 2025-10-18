#!/bin/bash

# Start Insurance Services
# This script starts both the free insurance data service and the real API service

echo "🚀 Starting Insurance Services..."
echo "=================================="

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check ports
echo "Checking ports..."
check_port 5002
check_port 5003

echo ""
echo "Starting Free Insurance Data Service (Port 5003)..."
echo "✅ NO API KEYS REQUIRED - Uses free public data sources"
cd server
python3 start_free_insurance_api.py &
FREE_PID=$!

# Wait a moment for the service to start
sleep 3

echo ""
echo "Starting Real Insurance API Service (Port 5002)..."
echo "⚠️  Requires API keys for real data"
python3 start_insurance_api.py &
REAL_PID=$!

echo ""
echo "🎉 Insurance Services Started!"
echo "=================================="
echo "Free Insurance Data API: http://localhost:5003"
echo "  - No API keys required"
echo "  - Uses free public data sources"
echo "  - 8 major insurance providers"
echo "  - Realistic premium calculations"
echo ""
echo "Real Insurance API: http://localhost:5002"
echo "  - Requires API keys"
echo "  - Real-time data from insurance providers"
echo "  - Currently returns empty quotes (no API keys)"
echo ""
echo "Frontend Integration:"
echo "  - Currently configured to use Free API (port 5003)"
echo "  - Change port in InsuranceUtilities.tsx to switch"
echo ""
echo "To stop services:"
echo "  kill $FREE_PID $REAL_PID"
echo ""
echo "To test services:"
echo "  cd server && python3 test_free_insurance_api.py"
echo "  cd server && python3 test_insurance_api.py"
echo ""
echo "Services are running in the background..."
echo "Press Ctrl+C to stop this script (services will continue running)"

# Keep script running
wait
