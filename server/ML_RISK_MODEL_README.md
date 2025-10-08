# ML Risk Model Integration

## Overview

The ML Risk Model provides machine learning-enhanced risk assessment for real estate investments. It uses a Gradient Boosting model trained on synthetic historical data to predict investment risk scores with confidence intervals.

## Architecture

```
┌─────────────────┐
│   React UI      │
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐
│  ML Risk API    │
│  (FastAPI)      │
└────────┬────────┘
         │
         │ Prediction
         ▼
┌─────────────────┐
│  ML Risk Model  │
│  (scikit-learn) │
└─────────────────┘
```

## Features

### ML Model
- **Algorithm**: Gradient Boosting Regressor
- **Features**: 24 input features including:
  - Market factors (volatility, appreciation, demand)
  - Property factors (age, condition, value)
  - Location factors (stability, crime rate, school rating)
  - Tenant/Income factors (quality, vacancy, DSCR)
  - Financing factors (risk, LTV, interest rate)
  - Economic factors (unemployment, inflation, median income)

### API Endpoints

#### `POST /api/predict-risk`
Predict risk score for a single property.

**Request Body:**
```json
{
  "market_volatility": 5,
  "property_age": 20,
  "property_condition": 7,
  "loan_to_value": 80,
  "debt_service_coverage_ratio": 1.25,
  ...
}
```

**Response:**
```json
{
  "overall_risk_score": 5.2,
  "confidence_score": 0.85,
  "risk_category": "Medium",
  "top_risk_drivers": [
    {"feature": "loan_to_value", "importance": 0.23}
  ],
  "confidence_interval": {
    "lower_bound": 4.2,
    "upper_bound": 6.2
  },
  "ml_recommendations": [
    "ML insight: High LTV increases refinance risk"
  ]
}
```

#### `GET /api/model-info`
Get information about the ML model.

#### `GET /health`
Health check endpoint.

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+

### Backend Setup

1. **Install Python Dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Start ML Risk API:**
   ```bash
   python ml_risk_api.py
   # Or specify port:
   python ml_risk_api.py 8001
   ```

   The API will be available at `http://localhost:8001`

### Frontend Setup

1. **Configure Environment Variables:**
   Create/update `.env` file:
   ```env
   REACT_APP_ML_RISK_API_URL=http://localhost:8001
   REACT_APP_ML_RISK_ENABLED=true
   ```

2. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm start
   ```

## Usage

### In the UI

The ML Risk Model is automatically integrated into several pages:

1. **Risk Analysis Tab** (Advanced Modeling):
   - Navigate to Underwrite Page
   - Click "Open Advanced Analysis"
   - Go to "Risk Analysis" tab
   - ML predictions display below rule-based scores

2. **UnderwritePage**:
   - Risk scores automatically include ML predictions
   - View comparison with rule-based scoring

3. **AnalyzePage**:
   - ML risk assessment integrated into risk analysis section

### Features in UI

- **Combined Risk Score**: Weighted average of ML (60%) and rule-based (40%) scores
- **Confidence Intervals**: 95% confidence range for predictions
- **Feature Importance**: Top 5 risk drivers with importance weights
- **ML Recommendations**: Smart recommendations based on feature analysis
- **Comparison View**: Side-by-side comparison of ML vs rule-based scores

## Model Training

The model is currently trained on synthetic data. To retrain with real historical data:

```python
from server.ml_risk_model import MLRiskModel

# Create and train model
model = MLRiskModel()

# Save trained model
model.save_model('models/ml_risk_model.pkl')
```

## API Configuration

### Environment Variables

- `REACT_APP_ML_RISK_API_URL`: ML API endpoint (default: `http://localhost:8001`)
- `REACT_APP_ML_RISK_ENABLED`: Enable/disable ML predictions (default: `true`)

### CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`

To add more origins, edit `server/ml_risk_api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "YOUR_ORIGIN_HERE"],
    ...
)
```

## Caching

Frontend service includes intelligent caching:
- **Cache TTL**: 5 minutes
- **Max Cache Size**: 100 predictions
- **Auto-cleanup**: Removes oldest entries when limit exceeded

To clear cache:
```typescript
import { clearMLRiskCache } from './services/mlRiskService';
clearMLRiskCache();
```

## Troubleshooting

### ML API Not Available

If ML predictions aren't showing:

1. **Check API is running:**
   ```bash
   curl http://localhost:8001/health
   ```

2. **Check environment variables:**
   - Verify `REACT_APP_ML_RISK_API_URL` is set correctly
   - Ensure `REACT_APP_ML_RISK_ENABLED=true`

3. **Check browser console** for error messages

### Fallback Behavior

The system gracefully falls back to rule-based scoring if:
- ML API is unavailable
- API request times out (5 seconds)
- scikit-learn is not installed

### Python Dependencies

If scikit-learn is not available:
```bash
pip install scikit-learn>=1.3.0
```

## Performance

- **Prediction Time**: ~50-100ms per prediction
- **Concurrent Requests**: Supports multiple simultaneous predictions
- **Memory Usage**: ~200MB for model and API
- **Caching**: Reduces repeated API calls

## Future Enhancements

- [ ] Train on real historical property data
- [ ] Add more sophisticated feature engineering
- [ ] Implement model versioning and A/B testing
- [ ] Add real-time model retraining
- [ ] Expand to predict specific risk categories
- [ ] Add explainability features (SHAP values)

## API Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:8001/health

# Model info
curl http://localhost:8001/api/model-info

# Predict risk
curl -X POST http://localhost:8001/api/predict-risk \
  -H "Content-Type: application/json" \
  -d '{
    "market_volatility": 5,
    "property_age": 20,
    "property_condition": 7,
    "property_value": 300000,
    "location_stability": 6,
    "tenant_quality": 7,
    "financing_risk": 5,
    "loan_to_value": 80,
    "interest_rate": 6.5,
    "debt_service_coverage_ratio": 1.25,
    "market_appreciation_rate": 3.5,
    "market_inventory_level": 6,
    "market_demand_strength": 5,
    "maintenance_cost_multiplier": 1,
    "neighborhood_crime_rate": 5,
    "school_rating": 6,
    "walkability_score": 50,
    "vacancy_rate": 5,
    "rent_to_market_ratio": 1,
    "has_balloon_payment": false,
    "is_interest_only": false,
    "unemployment_rate": 4.5,
    "inflation_rate": 2.5,
    "median_income": 65000
  }'
```

## License

Proprietary - Dreamery Software LLC

