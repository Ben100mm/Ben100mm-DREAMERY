#!/bin/bash

# Start ML Risk API
# Usage: ./start_ml_api.sh [port]

PORT=${1:-8001}

echo "Starting ML Risk API on port $PORT..."
echo "API will be available at http://localhost:$PORT"
echo ""
echo "Endpoints:"
echo "  - GET  /health                - Health check"
echo "  - GET  /api/model-info        - Model information"
echo "  - POST /api/predict-risk      - Predict risk score"
echo "  - POST /api/batch-predict-risk - Batch predictions"
echo ""

# Check if Python dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "Error: FastAPI not installed"
    echo "Run: pip install -r requirements.txt"
    exit 1
fi

if ! python -c "import sklearn" 2>/dev/null; then
    echo "Warning: scikit-learn not installed"
    echo "ML model will use fallback mode"
    echo "To enable full ML features: pip install scikit-learn"
    echo ""
fi

# Start the API
python ml_risk_api.py $PORT

