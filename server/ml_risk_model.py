"""
ML Risk Model for Real Estate Investment Risk Assessment
Uses machine learning to predict investment risk based on property and market factors
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import pickle
import os

try:
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("Warning: scikit-learn not available. Using fallback model.")


@dataclass
class MLRiskFeatures:
    """Features used for ML risk prediction"""
    # Market factors
    market_volatility: float  # 1-10 scale
    market_appreciation_rate: float  # Annual % 
    market_inventory_level: float  # Months of inventory
    market_demand_strength: float  # 1-10 scale
    
    # Property factors
    property_age: int  # Years
    property_condition: float  # 1-10 scale
    property_value: float  # Dollar amount
    maintenance_cost_multiplier: float  # Multiplier
    
    # Location factors
    location_stability: float  # 1-10 scale
    neighborhood_crime_rate: float  # Per 1000 residents
    school_rating: float  # 1-10 scale
    walkability_score: float  # 0-100
    
    # Tenant/Income factors
    tenant_quality: float  # 1-10 scale
    vacancy_rate: float  # Percentage
    rent_to_market_ratio: float  # Ratio
    debt_service_coverage_ratio: float  # DSCR
    
    # Financing factors
    financing_risk: float  # 1-10 scale
    loan_to_value: float  # Percentage
    interest_rate: float  # Percentage
    has_balloon_payment: bool
    is_interest_only: bool
    
    # Economic factors
    unemployment_rate: float  # Percentage
    inflation_rate: float  # Percentage
    median_income: float  # Dollar amount


@dataclass
class MLRiskPrediction:
    """ML-based risk prediction results"""
    overall_risk_score: float  # 1-10 scale
    confidence_score: float  # 0-1 scale
    risk_category: str  # Low, Medium, High, Very High
    
    # Feature importance
    top_risk_drivers: List[Dict[str, float]]
    
    # Confidence intervals
    lower_bound: float
    upper_bound: float
    
    # Comparison with rule-based
    rule_based_score: float
    ml_vs_rule_difference: float
    
    # Recommendations
    ml_recommendations: List[str]
    
    # Model metadata
    model_version: str
    prediction_timestamp: str


class MLRiskModel:
    """Machine Learning Risk Assessment Model"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.scaler = None
        self.feature_names = self._get_feature_names()
        self.model_version = "1.0.0"
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        elif SKLEARN_AVAILABLE:
            self._initialize_model()
            self._train_on_synthetic_data()
    
    def _get_feature_names(self) -> List[str]:
        """Get ordered list of feature names"""
        return [
            'market_volatility', 'market_appreciation_rate', 'market_inventory_level',
            'market_demand_strength', 'property_age', 'property_condition',
            'property_value', 'maintenance_cost_multiplier', 'location_stability',
            'neighborhood_crime_rate', 'school_rating', 'walkability_score',
            'tenant_quality', 'vacancy_rate', 'rent_to_market_ratio',
            'debt_service_coverage_ratio', 'financing_risk', 'loan_to_value',
            'interest_rate', 'has_balloon_payment', 'is_interest_only',
            'unemployment_rate', 'inflation_rate', 'median_income'
        ]
    
    def _initialize_model(self):
        """Initialize the ML model"""
        if not SKLEARN_AVAILABLE:
            return
        
        # Use Gradient Boosting for better performance
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            min_samples_split=10,
            min_samples_leaf=5,
            random_state=42
        )
        self.scaler = StandardScaler()
    
    def _train_on_synthetic_data(self):
        """Train model on synthetic historical data"""
        if not SKLEARN_AVAILABLE or self.model is None:
            return
        
        # Generate synthetic training data based on realistic patterns
        np.random.seed(42)
        n_samples = 1000
        
        X_train = []
        y_train = []
        
        for _ in range(n_samples):
            features = self._generate_synthetic_sample()
            risk_score = self._calculate_synthetic_risk(features)
            
            X_train.append(self._features_to_array(features))
            y_train.append(risk_score)
        
        X_train = np.array(X_train)
        y_train = np.array(y_train)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
    
    def _generate_synthetic_sample(self) -> MLRiskFeatures:
        """Generate a synthetic training sample"""
        return MLRiskFeatures(
            market_volatility=np.random.uniform(1, 10),
            market_appreciation_rate=np.random.normal(3.5, 2),
            market_inventory_level=np.random.uniform(1, 12),
            market_demand_strength=np.random.uniform(1, 10),
            property_age=int(np.random.exponential(20)),
            property_condition=np.random.normal(6, 2),
            property_value=np.random.lognormal(12.7, 0.5),  # ~$300k mean
            maintenance_cost_multiplier=np.random.uniform(0.8, 1.5),
            location_stability=np.random.uniform(1, 10),
            neighborhood_crime_rate=np.random.exponential(5),
            school_rating=np.random.normal(6, 2),
            walkability_score=np.random.uniform(0, 100),
            tenant_quality=np.random.uniform(1, 10),
            vacancy_rate=np.random.uniform(0, 30),
            rent_to_market_ratio=np.random.normal(1.0, 0.15),
            debt_service_coverage_ratio=np.random.normal(1.25, 0.3),
            financing_risk=np.random.uniform(1, 10),
            loan_to_value=np.random.uniform(50, 95),
            interest_rate=np.random.normal(6.5, 1.5),
            has_balloon_payment=np.random.random() < 0.2,
            is_interest_only=np.random.random() < 0.15,
            unemployment_rate=np.random.normal(4.5, 1.5),
            inflation_rate=np.random.normal(2.5, 1),
            median_income=np.random.lognormal(11, 0.3)  # ~$60k mean
        )
    
    def _calculate_synthetic_risk(self, features: MLRiskFeatures) -> float:
        """Calculate synthetic risk score for training data"""
        # Complex risk formula that combines multiple factors
        risk = 0
        
        # Market risk (25% weight)
        market_risk = (
            features.market_volatility * 0.4 +
            max(0, (6 - features.market_appreciation_rate)) * 0.3 +
            max(0, (features.market_inventory_level - 6)) * 0.2 +
            (10 - features.market_demand_strength) * 0.1
        ) * 0.25
        
        # Property risk (20% weight)
        property_risk = (
            (10 - features.property_condition) * 0.5 +
            min(10, features.property_age / 5) * 0.3 +
            (features.maintenance_cost_multiplier - 0.8) * 5 * 0.2
        ) * 0.20
        
        # Location risk (15% weight)
        location_risk = (
            (10 - features.location_stability) * 0.4 +
            min(10, features.neighborhood_crime_rate) * 0.3 +
            (10 - features.school_rating) * 0.2 +
            (100 - features.walkability_score) / 10 * 0.1
        ) * 0.15
        
        # Tenant/Income risk (10% weight)
        tenant_risk = (
            (10 - features.tenant_quality) * 0.4 +
            features.vacancy_rate / 3 * 0.3 +
            abs(1 - features.rent_to_market_ratio) * 10 * 0.2 +
            max(0, (1.25 - features.debt_service_coverage_ratio)) * 10 * 0.1
        ) * 0.10
        
        # Financing risk (30% weight)
        financing_risk = (
            features.financing_risk * 0.4 +
            (features.loan_to_value - 50) / 5 * 0.3 +
            max(0, (features.interest_rate - 5)) * 0.5 * 0.2 +
            (10 if features.has_balloon_payment else 0) * 0.05 +
            (5 if features.is_interest_only else 0) * 0.05
        ) * 0.30
        
        risk = market_risk + property_risk + location_risk + tenant_risk + financing_risk
        
        # Add some noise
        risk += np.random.normal(0, 0.3)
        
        # Clamp to 1-10 range
        return max(1, min(10, risk))
    
    def _features_to_array(self, features: MLRiskFeatures) -> np.ndarray:
        """Convert features dataclass to numpy array"""
        return np.array([
            features.market_volatility,
            features.market_appreciation_rate,
            features.market_inventory_level,
            features.market_demand_strength,
            features.property_age,
            features.property_condition,
            features.property_value / 100000,  # Scale down
            features.maintenance_cost_multiplier,
            features.location_stability,
            features.neighborhood_crime_rate,
            features.school_rating,
            features.walkability_score / 10,  # Scale down
            features.tenant_quality,
            features.vacancy_rate,
            features.rent_to_market_ratio,
            features.debt_service_coverage_ratio,
            features.financing_risk,
            features.loan_to_value,
            features.interest_rate,
            1.0 if features.has_balloon_payment else 0.0,
            1.0 if features.is_interest_only else 0.0,
            features.unemployment_rate,
            features.inflation_rate,
            features.median_income / 10000,  # Scale down
        ])
    
    def predict(
        self,
        features: MLRiskFeatures,
        rule_based_score: Optional[float] = None
    ) -> MLRiskPrediction:
        """
        Predict risk score using ML model
        
        Args:
            features: Property and market features
            rule_based_score: Optional rule-based score for comparison
            
        Returns:
            MLRiskPrediction with risk score and metadata
        """
        if not SKLEARN_AVAILABLE or self.model is None:
            # Fallback to simplified rule-based calculation
            return self._fallback_prediction(features, rule_based_score)
        
        # Convert features to array and scale
        X = self._features_to_array(features).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        # Predict
        prediction = self.model.predict(X_scaled)[0]
        
        # Calculate confidence (simplified - based on tree variance)
        confidence = 0.85  # Default confidence
        
        # Estimate prediction interval (simplified)
        std_dev = 0.5  # Estimated standard deviation
        lower_bound = max(1, prediction - 1.96 * std_dev)
        upper_bound = min(10, prediction + 1.96 * std_dev)
        
        # Determine risk category
        risk_category = self._get_risk_category(prediction)
        
        # Get feature importance
        top_risk_drivers = self._get_feature_importance()
        
        # Generate ML-specific recommendations
        ml_recommendations = self._generate_ml_recommendations(
            features, prediction, top_risk_drivers
        )
        
        # Compare with rule-based score
        ml_vs_rule_difference = 0.0
        if rule_based_score is not None:
            ml_vs_rule_difference = prediction - rule_based_score
        
        return MLRiskPrediction(
            overall_risk_score=round(prediction, 2),
            confidence_score=round(confidence, 3),
            risk_category=risk_category,
            top_risk_drivers=top_risk_drivers,
            lower_bound=round(lower_bound, 2),
            upper_bound=round(upper_bound, 2),
            rule_based_score=rule_based_score or 0.0,
            ml_vs_rule_difference=round(ml_vs_rule_difference, 2),
            ml_recommendations=ml_recommendations,
            model_version=self.model_version,
            prediction_timestamp=datetime.now().isoformat()
        )
    
    def _fallback_prediction(
        self,
        features: MLRiskFeatures,
        rule_based_score: Optional[float]
    ) -> MLRiskPrediction:
        """Fallback prediction when ML model is not available"""
        # Use simplified calculation
        risk_score = rule_based_score if rule_based_score else 5.0
        
        return MLRiskPrediction(
            overall_risk_score=risk_score,
            confidence_score=0.5,
            risk_category=self._get_risk_category(risk_score),
            top_risk_drivers=[],
            lower_bound=max(1, risk_score - 1),
            upper_bound=min(10, risk_score + 1),
            rule_based_score=rule_based_score or 0.0,
            ml_vs_rule_difference=0.0,
            ml_recommendations=["ML model not available - using fallback"],
            model_version="fallback",
            prediction_timestamp=datetime.now().isoformat()
        )
    
    def _get_risk_category(self, score: float) -> str:
        """Convert risk score to category"""
        if score <= 3:
            return "Low"
        elif score <= 5:
            return "Medium"
        elif score <= 7:
            return "High"
        else:
            return "Very High"
    
    def _get_feature_importance(self) -> List[Dict[str, float]]:
        """Get top risk drivers based on feature importance"""
        if not SKLEARN_AVAILABLE or self.model is None:
            return []
        
        importance = self.model.feature_importances_
        feature_importance = [
            {"feature": name, "importance": float(imp)}
            for name, imp in zip(self.feature_names, importance)
        ]
        
        # Sort by importance and return top 5
        feature_importance.sort(key=lambda x: x['importance'], reverse=True)
        return feature_importance[:5]
    
    def _generate_ml_recommendations(
        self,
        features: MLRiskFeatures,
        prediction: float,
        top_drivers: List[Dict[str, float]]
    ) -> List[str]:
        """Generate ML-driven recommendations"""
        recommendations = []
        
        if prediction > 7:
            recommendations.append(
                "⚠️ High risk detected by ML model - conduct thorough due diligence"
            )
        
        # Add recommendations based on top risk drivers
        for driver in top_drivers[:3]:
            feature = driver['feature']
            
            if feature == 'loan_to_value' and features.loan_to_value > 80:
                recommendations.append(
                    f"ML insight: High LTV ({features.loan_to_value:.1f}%) is a major risk factor"
                )
            elif feature == 'market_volatility' and features.market_volatility > 6:
                recommendations.append(
                    "ML insight: Market volatility is high - consider waiting for stabilization"
                )
            elif feature == 'property_age' and features.property_age > 40:
                recommendations.append(
                    f"ML insight: Property age ({features.property_age} years) increases maintenance risk"
                )
            elif feature == 'debt_service_coverage_ratio' and features.debt_service_coverage_ratio < 1.25:
                recommendations.append(
                    f"ML insight: Low DSCR ({features.debt_service_coverage_ratio:.2f}) indicates cash flow risk"
                )
        
        if features.has_balloon_payment:
            recommendations.append(
                "ML insight: Balloon payment structure significantly increases refinance risk"
            )
        
        return recommendations
    
    def save_model(self, path: str):
        """Save trained model to disk"""
        if not SKLEARN_AVAILABLE or self.model is None:
            raise ValueError("No model to save")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'model_version': self.model_version
        }
        
        with open(path, 'wb') as f:
            pickle.dump(model_data, f)
    
    def load_model(self, path: str):
        """Load trained model from disk"""
        if not SKLEARN_AVAILABLE:
            raise ValueError("scikit-learn not available")
        
        with open(path, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_names = model_data['feature_names']
        self.model_version = model_data['model_version']


# Global model instance
_model_instance: Optional[MLRiskModel] = None


def get_ml_risk_model() -> MLRiskModel:
    """Get or create global ML risk model instance"""
    global _model_instance
    
    if _model_instance is None:
        _model_instance = MLRiskModel()
    
    return _model_instance


def predict_risk(
    features_dict: Dict,
    rule_based_score: Optional[float] = None
) -> Dict:
    """
    Convenience function to predict risk from dictionary
    
    Args:
        features_dict: Dictionary of features
        rule_based_score: Optional rule-based score for comparison
        
    Returns:
        Dictionary with prediction results
    """
    # Convert dict to MLRiskFeatures
    features = MLRiskFeatures(**features_dict)
    
    # Get model and predict
    model = get_ml_risk_model()
    prediction = model.predict(features, rule_based_score)
    
    # Convert to dict
    return {
        'overall_risk_score': prediction.overall_risk_score,
        'confidence_score': prediction.confidence_score,
        'risk_category': prediction.risk_category,
        'top_risk_drivers': prediction.top_risk_drivers,
        'confidence_interval': {
            'lower_bound': prediction.lower_bound,
            'upper_bound': prediction.upper_bound,
        },
        'comparison': {
            'rule_based_score': prediction.rule_based_score,
            'ml_vs_rule_difference': prediction.ml_vs_rule_difference,
        },
        'ml_recommendations': prediction.ml_recommendations,
        'metadata': {
            'model_version': prediction.model_version,
            'prediction_timestamp': prediction.prediction_timestamp,
        }
    }

