#!/bin/bash

# API Keys Setup Script for Dreamery Rental Market Data Integration
# This script helps you add your API keys to the .env file

echo "🏠 DREAMERY RENTAL MARKET DATA API KEYS SETUP"
echo "=============================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please run the setup first."
    exit 1
fi

echo "📋 Current .env file found. Here are the rental market data API key lines:"
echo ""
grep -n "RENTCAST_API_KEY\|FREEWEBAPI_API_KEY" .env
echo ""

echo "🔑 To add your API keys, edit the .env file and replace the empty values:"
echo ""
echo "For RentCast API (50 free calls/month):"
echo "  RENTCAST_API_KEY=\"your-actual-rentcast-api-key-here\""
echo ""
echo "For FreeWebApi (100 free calls/day):"
echo "  FREEWEBAPI_API_KEY=\"your-actual-freewebapi-api-key-here\""
echo ""

echo "📝 You can edit the file using:"
echo "  nano .env"
echo "  vim .env"
echo "  code .env"
echo ""

echo "🔗 Get your free API keys from:"
echo "  RentCast: https://developers.rentcast.io/"
echo "  FreeWebApi: https://freewebapi.com/data-apis/real-estate-api/"
echo ""

echo "🧪 After adding your keys, test the integration with:"
echo "  python3 test_rental_integration.py"
echo ""

echo "🚀 Start the server with:"
echo "  cd server && python3 realtor_api.py"
echo ""

# Function to add API key
add_api_key() {
    local key_name=$1
    local key_value=$2
    
    if [ -n "$key_value" ]; then
        # Use sed to replace the empty value with the actual key
        sed -i.bak "s/${key_name}=\"\"/${key_name}=\"${key_value}\"/" .env
        echo "✅ Added ${key_name}"
    fi
}

# Interactive mode
echo "Would you like to add API keys now? (y/n)"
read -r response

if [ "$response" = "y" ] || [ "$response" = "y" ]; then
    echo ""
    echo "Enter your RentCast API key (or press Enter to skip):"
    read -r rentcast_key
    add_api_key "RENTCAST_API_KEY" "$rentcast_key"
    
    echo ""
    echo "Enter your FreeWebApi API key (or press Enter to skip):"
    read -r freewebapi_key
    add_api_key "FREEWEBAPI_API_KEY" "$freewebapi_key"
    
    echo ""
    echo "🎉 API keys have been added to .env file!"
    echo ""
    echo "📋 Updated rental market data API keys:"
    grep "RENTCAST_API_KEY\|FREEWEBAPI_API_KEY" .env
else
    echo "No problem! You can add them later by editing the .env file."
fi

echo ""
echo "✅ Setup complete! The rental market data integration is ready to use."
