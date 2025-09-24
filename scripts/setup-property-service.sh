#!/bin/bash
# scripts/setup-property-service.sh

echo "Setting up Dreamery Property Service..."

# Install Python dependencies
cd server
pip3 install -r requirements.txt

# Make Python scripts executable
chmod +x dreamery_property_api.py

echo "Property service setup complete!"
echo "You can now test the API with:"
echo "curl -X POST http://localhost:5055/api/properties/search -H 'Content-Type: application/json' -d '{\"location\":\"San Francisco, CA\",\"listing_type\":\"for_sale\"}'"
