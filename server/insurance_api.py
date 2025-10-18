"""
Insurance API Service
Integrates with multiple free insurance provider APIs to get real-time quotes
"""

import os
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union
from dataclasses import dataclass
from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class InsuranceQuote:
    """Insurance quote data structure"""
    id: str
    provider: str
    policy_type: str
    annual_premium: float
    deductible: float
    coverage: Dict[str, float]
    features: List[str]
    rating: float
    review_count: int
    status: str
    valid_until: str
    logo: str
    api_source: str

@dataclass
class PropertyInfo:
    """Property information for insurance quotes"""
    address: str
    property_type: str
    construction_year: int
    square_footage: int
    coverage_amount: float
    policy_type: str
    zip_code: str
    state: str
    city: str

class InsuranceAPIService:
    """Main service for integrating with insurance provider APIs"""
    
    def __init__(self):
        self.api_keys = self._load_api_keys()
        self.session = self._create_session()
        self.rate_limits = {}
        self.cache = {}
        
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables"""
        return {
            'insurehero': os.getenv('INSUREHERO_API_KEY'),
            'gigeasy': os.getenv('GIGEASY_API_KEY'),
            'fize': os.getenv('FIZE_API_KEY'),
            'openkoda': os.getenv('OPENKODA_API_KEY'),
        }
    
    def _create_session(self) -> requests.Session:
        """Create HTTP session with retry strategy"""
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Dreamery-Insurance-API/1.0',
            'Content-Type': 'application/json'
        })
        return session
    
    def _check_rate_limit(self, api_name: str, limit_per_minute: int = 60) -> bool:
        """Check if API call is within rate limits"""
        now = datetime.now()
        if api_name not in self.rate_limits:
            self.rate_limits[api_name] = []
        
        # Remove calls older than 1 minute
        self.rate_limits[api_name] = [
            call_time for call_time in self.rate_limits[api_name]
            if now - call_time < timedelta(minutes=1)
        ]
        
        if len(self.rate_limits[api_name]) >= limit_per_minute:
            return False
        
        self.rate_limits[api_name].append(now)
        return True
    
    def _make_api_call(self, url: str, params: Dict, api_name: str, 
                      rate_limit: int = 60) -> Optional[Dict]:
        """Make API call with rate limiting and error handling"""
        if not self._check_rate_limit(api_name, rate_limit):
            logger.warning(f"Rate limit exceeded for {api_name}")
            return None
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API call failed for {api_name}: {e}")
            return None
    
    def get_insurehero_quotes(self, property_info: PropertyInfo) -> List[InsuranceQuote]:
        """Get quotes from InsureHero API"""
        if not self.api_keys['insurehero']:
            logger.warning("InsureHero API key not configured")
            return []
        
        url = "https://api.insurehero.io/v1/quotes"
        params = {
            'api_key': self.api_keys['insurehero'],
            'address': property_info.address,
            'property_type': property_info.property_type,
            'construction_year': property_info.construction_year,
            'square_footage': property_info.square_footage,
            'coverage_amount': property_info.coverage_amount,
            'policy_type': property_info.policy_type,
            'zip_code': property_info.zip_code,
            'state': property_info.state
        }
        
        data = self._make_api_call(url, params, 'insurehero', 100)
        if not data:
            return []
        
        quotes = []
        for quote_data in data.get('quotes', []):
            quote = InsuranceQuote(
                id=f"insurehero_{quote_data.get('id')}",
                provider=quote_data.get('provider', 'Unknown'),
                policy_type=property_info.policy_type,
                annual_premium=float(quote_data.get('annual_premium', 0)),
                deductible=float(quote_data.get('deductible', 0)),
                coverage={
                    'dwelling': float(quote_data.get('dwelling_coverage', 0)),
                    'personalProperty': float(quote_data.get('personal_property_coverage', 0)),
                    'liability': float(quote_data.get('liability_coverage', 0)),
                    'medicalPayments': float(quote_data.get('medical_payments', 0)),
                    'additionalLivingExpenses': float(quote_data.get('ale_coverage', 0))
                },
                features=quote_data.get('features', []),
                rating=float(quote_data.get('rating', 4.0)),
                review_count=int(quote_data.get('review_count', 0)),
                status='quoted',
                valid_until=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                logo=quote_data.get('logo', ''),
                api_source='insurehero'
            )
            quotes.append(quote)
        
        return quotes
    
    def get_gigeasy_quotes(self, property_info: PropertyInfo) -> List[InsuranceQuote]:
        """Get quotes from GigEasy API"""
        if not self.api_keys['gigeasy']:
            logger.warning("GigEasy API key not configured")
            return []
        
        url = "https://api.gigeasy.ai/v1/insurance/quotes"
        params = {
            'api_key': self.api_keys['gigeasy'],
            'address': property_info.address,
            'property_type': property_info.property_type,
            'year_built': property_info.construction_year,
            'square_feet': property_info.square_footage,
            'coverage_amount': property_info.coverage_amount,
            'policy_type': property_info.policy_type,
            'zip_code': property_info.zip_code,
            'state': property_info.state
        }
        
        data = self._make_api_call(url, params, 'gigeasy', 100)
        if not data:
            return []
        
        quotes = []
        for quote_data in data.get('quotes', []):
            quote = InsuranceQuote(
                id=f"gigeasy_{quote_data.get('id')}",
                provider=quote_data.get('insurer_name', 'Unknown'),
                policy_type=property_info.policy_type,
                annual_premium=float(quote_data.get('premium', 0)),
                deductible=float(quote_data.get('deductible', 0)),
                coverage={
                    'dwelling': float(quote_data.get('dwelling_limit', 0)),
                    'personalProperty': float(quote_data.get('personal_property_limit', 0)),
                    'liability': float(quote_data.get('liability_limit', 0)),
                    'medicalPayments': float(quote_data.get('medical_payments_limit', 0)),
                    'additionalLivingExpenses': float(quote_data.get('ale_limit', 0))
                },
                features=quote_data.get('features', []),
                rating=float(quote_data.get('rating', 4.0)),
                review_count=int(quote_data.get('review_count', 0)),
                status='quoted',
                valid_until=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                logo=quote_data.get('logo_url', ''),
                api_source='gigeasy'
            )
            quotes.append(quote)
        
        return quotes
    
    def get_fize_quotes(self, property_info: PropertyInfo) -> List[InsuranceQuote]:
        """Get quotes from Fize API"""
        if not self.api_keys['fize']:
            logger.warning("Fize API key not configured")
            return []
        
        url = "https://api.getfize.com/v1/insurance/quotes"
        params = {
            'api_key': self.api_keys['fize'],
            'address': property_info.address,
            'property_type': property_info.property_type,
            'year_built': property_info.construction_year,
            'square_footage': property_info.square_footage,
            'coverage_amount': property_info.coverage_amount,
            'policy_type': property_info.policy_type,
            'zip_code': property_info.zip_code,
            'state': property_info.state
        }
        
        data = self._make_api_call(url, params, 'fize', 100)
        if not data:
            return []
        
        quotes = []
        for quote_data in data.get('quotes', []):
            quote = InsuranceQuote(
                id=f"fize_{quote_data.get('id')}",
                provider=quote_data.get('provider_name', 'Unknown'),
                policy_type=property_info.policy_type,
                annual_premium=float(quote_data.get('annual_premium', 0)),
                deductible=float(quote_data.get('deductible', 0)),
                coverage={
                    'dwelling': float(quote_data.get('dwelling_coverage', 0)),
                    'personalProperty': float(quote_data.get('personal_property_coverage', 0)),
                    'liability': float(quote_data.get('liability_coverage', 0)),
                    'medicalPayments': float(quote_data.get('medical_payments', 0)),
                    'additionalLivingExpenses': float(quote_data.get('ale_coverage', 0))
                },
                features=quote_data.get('features', []),
                rating=float(quote_data.get('rating', 4.0)),
                review_count=int(quote_data.get('review_count', 0)),
                status='quoted',
                valid_until=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                logo=quote_data.get('logo', ''),
                api_source='fize'
            )
            quotes.append(quote)
        
        return quotes
    
    def get_openkoda_quotes(self, property_info: PropertyInfo) -> List[InsuranceQuote]:
        """Get quotes from Openkoda API"""
        if not self.api_keys['openkoda']:
            logger.warning("Openkoda API key not configured")
            return []
        
        url = "https://api.openkoda.com/v1/insurance/quotes"
        params = {
            'api_key': self.api_keys['openkoda'],
            'address': property_info.address,
            'property_type': property_info.property_type,
            'construction_year': property_info.construction_year,
            'square_footage': property_info.square_footage,
            'coverage_amount': property_info.coverage_amount,
            'policy_type': property_info.policy_type,
            'zip_code': property_info.zip_code,
            'state': property_info.state
        }
        
        data = self._make_api_call(url, params, 'openkoda', 100)
        if not data:
            return []
        
        quotes = []
        for quote_data in data.get('quotes', []):
            quote = InsuranceQuote(
                id=f"openkoda_{quote_data.get('id')}",
                provider=quote_data.get('provider', 'Unknown'),
                policy_type=property_info.policy_type,
                annual_premium=float(quote_data.get('premium', 0)),
                deductible=float(quote_data.get('deductible', 0)),
                coverage={
                    'dwelling': float(quote_data.get('dwelling_coverage', 0)),
                    'personalProperty': float(quote_data.get('personal_property_coverage', 0)),
                    'liability': float(quote_data.get('liability_coverage', 0)),
                    'medicalPayments': float(quote_data.get('medical_payments', 0)),
                    'additionalLivingExpenses': float(quote_data.get('ale_coverage', 0))
                },
                features=quote_data.get('features', []),
                rating=float(quote_data.get('rating', 4.0)),
                review_count=int(quote_data.get('review_count', 0)),
                status='quoted',
                valid_until=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                logo=quote_data.get('logo', ''),
                api_source='openkoda'
            )
            quotes.append(quote)
        
        return quotes
    
    def get_all_quotes(self, property_info: PropertyInfo) -> List[InsuranceQuote]:
        """Get quotes from all available APIs"""
        all_quotes = []
        
        # Get quotes from each API
        apis = [
            self.get_insurehero_quotes,
            self.get_gigeasy_quotes,
            self.get_fize_quotes,
            self.get_openkoda_quotes
        ]
        
        for api_func in apis:
            try:
                quotes = api_func(property_info)
                all_quotes.extend(quotes)
            except Exception as e:
                logger.error(f"Error getting quotes from {api_func.__name__}: {e}")
                continue
        
        # Sort by annual premium (lowest first)
        all_quotes.sort(key=lambda x: x.annual_premium)
        
        return all_quotes
    
    def bind_policy(self, quote_id: str) -> Dict[str, Union[bool, str]]:
        """Bind an insurance policy"""
        try:
            # Extract API source from quote ID
            api_source = quote_id.split('_')[0]
            
            if api_source == 'insurehero':
                return self._bind_insurehero_policy(quote_id)
            elif api_source == 'gigeasy':
                return self._bind_gigeasy_policy(quote_id)
            elif api_source == 'fize':
                return self._bind_fize_policy(quote_id)
            elif api_source == 'openkoda':
                return self._bind_openkoda_policy(quote_id)
            else:
                return {'success': False, 'error': 'Unknown API source'}
                
        except Exception as e:
            logger.error(f"Error binding policy {quote_id}: {e}")
            return {'success': False, 'error': str(e)}
    
    def _bind_insurehero_policy(self, quote_id: str) -> Dict[str, Union[bool, str]]:
        """Bind policy through InsureHero API"""
        if not self.api_keys['insurehero']:
            return {'success': False, 'error': 'InsureHero API key not configured'}
        
        url = "https://api.insurehero.io/v1/policies/bind"
        data = {
            'api_key': self.api_keys['insurehero'],
            'quote_id': quote_id.split('_')[1]
        }
        
        try:
            response = self.session.post(url, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            return {'success': True, 'policy_id': result.get('policy_id')}
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}
    
    def _bind_gigeasy_policy(self, quote_id: str) -> Dict[str, Union[bool, str]]:
        """Bind policy through GigEasy API"""
        if not self.api_keys['gigeasy']:
            return {'success': False, 'error': 'GigEasy API key not configured'}
        
        url = "https://api.gigeasy.ai/v1/insurance/bind"
        data = {
            'api_key': self.api_keys['gigeasy'],
            'quote_id': quote_id.split('_')[1]
        }
        
        try:
            response = self.session.post(url, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            return {'success': True, 'policy_id': result.get('policy_id')}
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}
    
    def _bind_fize_policy(self, quote_id: str) -> Dict[str, Union[bool, str]]:
        """Bind policy through Fize API"""
        if not self.api_keys['fize']:
            return {'success': False, 'error': 'Fize API key not configured'}
        
        url = "https://api.getfize.com/v1/insurance/bind"
        data = {
            'api_key': self.api_keys['fize'],
            'quote_id': quote_id.split('_')[1]
        }
        
        try:
            response = self.session.post(url, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            return {'success': True, 'policy_id': result.get('policy_id')}
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}
    
    def _bind_openkoda_policy(self, quote_id: str) -> Dict[str, Union[bool, str]]:
        """Bind policy through Openkoda API"""
        if not self.api_keys['openkoda']:
            return {'success': False, 'error': 'Openkoda API key not configured'}
        
        url = "https://api.openkoda.com/v1/insurance/bind"
        data = {
            'api_key': self.api_keys['openkoda'],
            'quote_id': quote_id.split('_')[1]
        }
        
        try:
            response = self.session.post(url, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            return {'success': True, 'policy_id': result.get('policy_id')}
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}

# Flask API endpoints
app = Flask(__name__)
insurance_service = InsuranceAPIService()

@app.route('/api/insurance/quotes', methods=['POST'])
def get_insurance_quotes():
    """Get insurance quotes from multiple providers"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['propertyAddress', 'propertyType', 'constructionYear', 
                          'squareFootage', 'coverageAmount', 'policyType']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse address to extract zip code, city, state
        address_parts = data['propertyAddress'].split(',')
        if len(address_parts) < 3:
            return jsonify({'error': 'Address must include city, state, and zip code'}), 400
        
        city = address_parts[-2].strip()
        state_zip = address_parts[-1].strip().split()
        if len(state_zip) < 2:
            return jsonify({'error': 'Address must include state and zip code'}), 400
        
        state = state_zip[0]
        zip_code = state_zip[1]
        
        # Create PropertyInfo object
        property_info = PropertyInfo(
            address=data['propertyAddress'],
            property_type=data['propertyType'],
            construction_year=int(data['constructionYear']),
            square_footage=int(data['squareFootage']),
            coverage_amount=float(data['coverageAmount']),
            policy_type=data['policyType'],
            zip_code=zip_code,
            state=state,
            city=city
        )
        
        # Get quotes from all APIs
        quotes = insurance_service.get_all_quotes(property_info)
        
        # Convert to dictionary format for JSON response
        quotes_data = []
        for quote in quotes:
            quote_dict = {
                'id': quote.id,
                'provider': quote.provider,
                'policyType': quote.policy_type,
                'annualPremium': quote.annual_premium,
                'deductible': quote.deductible,
                'coverage': quote.coverage,
                'features': quote.features,
                'rating': quote.rating,
                'reviewCount': quote.review_count,
                'status': quote.status,
                'validUntil': quote.valid_until,
                'logo': quote.logo,
                'apiSource': quote.api_source
            }
            quotes_data.append(quote_dict)
        
        return jsonify({
            'success': True,
            'quotes': quotes_data,
            'total': len(quotes_data)
        })
        
    except Exception as e:
        logger.error(f"Error getting insurance quotes: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/insurance/bind', methods=['POST'])
def bind_insurance_policy():
    """Bind an insurance policy"""
    try:
        data = request.get_json()
        
        if 'quoteId' not in data:
            return jsonify({'error': 'Missing required field: quoteId'}), 400
        
        result = insurance_service.bind_policy(data['quoteId'])
        
        if result['success']:
            return jsonify({
                'success': True,
                'policyId': result.get('policy_id'),
                'message': 'Policy bound successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
            
    except Exception as e:
        logger.error(f"Error binding policy: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/insurance/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'insurance-api',
        'timestamp': datetime.now().isoformat(),
        'available_apis': list(insurance_service.api_keys.keys())
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
