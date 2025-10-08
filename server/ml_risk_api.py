"""
ML Risk Model API
FastAPI endpoint for serving ML-based risk predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
import uvicorn

from ml_risk_model import predict_risk, MLRiskFeatures


app = FastAPI(
    title="Dreamery ML Risk API",
    description="Machine Learning Risk Assessment for Real Estate Investments",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RiskPredictionRequest(BaseModel):
    """Request model for risk prediction"""
    # Market factors
    market_volatility: float = Field(..., ge=1, le=10, description="Market volatility (1-10)")
    market_appreciation_rate: float = Field(3.5, description="Annual market appreciation rate (%)")
    market_inventory_level: float = Field(6.0, ge=0, description="Months of inventory")
    market_demand_strength: float = Field(5.0, ge=1, le=10, description="Market demand (1-10)")
    
    # Property factors
    property_age: int = Field(..., ge=0, description="Property age in years")
    property_condition: float = Field(..., ge=1, le=10, description="Property condition (1-10)")
    property_value: float = Field(..., gt=0, description="Property value ($)")
    maintenance_cost_multiplier: float = Field(1.0, ge=0, description="Maintenance cost multiplier")
    
    # Location factors
    location_stability: float = Field(..., ge=1, le=10, description="Location stability (1-10)")
    neighborhood_crime_rate: float = Field(5.0, ge=0, description="Crime rate per 1000 residents")
    school_rating: float = Field(5.0, ge=1, le=10, description="School rating (1-10)")
    walkability_score: float = Field(50.0, ge=0, le=100, description="Walkability score (0-100)")
    
    # Tenant/Income factors
    tenant_quality: float = Field(..., ge=1, le=10, description="Tenant quality (1-10)")
    vacancy_rate: float = Field(5.0, ge=0, le=100, description="Vacancy rate (%)")
    rent_to_market_ratio: float = Field(1.0, ge=0, description="Rent to market ratio")
    debt_service_coverage_ratio: float = Field(1.25, ge=0, description="DSCR")
    
    # Financing factors
    financing_risk: float = Field(..., ge=1, le=10, description="Financing risk (1-10)")
    loan_to_value: float = Field(..., ge=0, le=100, description="LTV (%)")
    interest_rate: float = Field(..., ge=0, description="Interest rate (%)")
    has_balloon_payment: bool = Field(False, description="Has balloon payment")
    is_interest_only: bool = Field(False, description="Is interest-only loan")
    
    # Economic factors
    unemployment_rate: float = Field(4.5, ge=0, description="Unemployment rate (%)")
    inflation_rate: float = Field(2.5, description="Inflation rate (%)")
    median_income: float = Field(60000, gt=0, description="Median income ($)")
    
    # Optional: rule-based score for comparison
    rule_based_score: Optional[float] = Field(None, ge=1, le=10, description="Rule-based score for comparison")


class FeatureImportance(BaseModel):
    """Feature importance"""
    feature: str
    importance: float


class ConfidenceInterval(BaseModel):
    """Confidence interval for prediction"""
    lower_bound: float
    upper_bound: float


class Comparison(BaseModel):
    """Comparison with rule-based model"""
    rule_based_score: float
    ml_vs_rule_difference: float


class Metadata(BaseModel):
    """Prediction metadata"""
    model_version: str
    prediction_timestamp: str


class RiskPredictionResponse(BaseModel):
    """Response model for risk prediction"""
    overall_risk_score: float = Field(..., description="Overall risk score (1-10)")
    confidence_score: float = Field(..., description="Confidence in prediction (0-1)")
    risk_category: str = Field(..., description="Risk category (Low/Medium/High/Very High)")
    top_risk_drivers: List[FeatureImportance] = Field(..., description="Top risk drivers")
    confidence_interval: ConfidenceInterval = Field(..., description="95% confidence interval")
    comparison: Comparison = Field(..., description="Comparison with rule-based model")
    ml_recommendations: List[str] = Field(..., description="ML-driven recommendations")
    metadata: Metadata = Field(..., description="Prediction metadata")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "ML Risk Model API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/api/predict-risk", response_model=RiskPredictionResponse)
async def predict_risk_endpoint(request: RiskPredictionRequest):
    """
    Predict investment risk using ML model
    
    Args:
        request: Risk prediction request with property and market features
        
    Returns:
        Risk prediction with score, confidence, and recommendations
    """
    try:
        # Convert request to dict
        features_dict = request.dict(exclude={'rule_based_score'})
        
        # Make prediction
        prediction = predict_risk(
            features_dict=features_dict,
            rule_based_score=request.rule_based_score
        )
        
        return prediction
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error making prediction: {str(e)}"
        )


@app.post("/api/batch-predict-risk")
async def batch_predict_risk(requests: List[RiskPredictionRequest]):
    """
    Batch predict risk for multiple properties
    
    Args:
        requests: List of risk prediction requests
        
    Returns:
        List of risk predictions
    """
    try:
        predictions = []
        
        for request in requests:
            features_dict = request.dict(exclude={'rule_based_score'})
            prediction = predict_risk(
                features_dict=features_dict,
                rule_based_score=request.rule_based_score
            )
            predictions.append(prediction)
        
        return {
            "predictions": predictions,
            "count": len(predictions)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error making batch predictions: {str(e)}"
        )


@app.get("/api/model-info")
async def get_model_info():
    """Get information about the ML model"""
    from ml_risk_model import get_ml_risk_model
    
    model = get_ml_risk_model()
    
    return {
        "model_version": model.model_version,
        "feature_count": len(model.feature_names),
        "features": model.feature_names,
        "sklearn_available": model.model is not None
    }


if __name__ == "__main__":
    import sys
    
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    
    print(f"Starting ML Risk API on port {port}...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

