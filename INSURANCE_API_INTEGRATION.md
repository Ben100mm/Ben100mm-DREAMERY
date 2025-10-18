# Insurance API Integration Guide

## Overview

This guide covers the integration of free insurance provider APIs into the Dreamery platform, enabling real-time insurance quotes and policy management.

## Free Insurance API Providers

### 1. InsureHero (Recommended)
- **Website**: https://insurehero.io
- **Free Tier**: Contact for details
- **Features**: Multi-provider quotes, policy management, claims handling
- **API Documentation**: Available upon request
- **Best For**: Comprehensive insurance solutions

### 2. GigEasy
- **Website**: https://gigeasy.ai/developers.html
- **Free Tier**: Sandbox testing environment
- **Features**: Quoting, binding, compliance checks across all states
- **API Documentation**: Available on website
- **Best For**: State-specific compliance and automated workflows

### 3. Fize
- **Website**: https://getfize.com
- **Free Tier**: Free sign-up with API access
- **Features**: User-permissioned insurance data collection
- **API Documentation**: Available upon signup
- **Best For**: Data verification and policy information retrieval

### 4. Openkoda (Open Source)
- **Website**: https://openkoda.com
- **Free Tier**: Completely free (open source)
- **Features**: Auto-generated REST APIs, custom workflows
- **API Documentation**: Available on GitHub
- **Best For**: Custom implementations and full control

## Setup Instructions

### 1. Install Dependencies

```bash
pip install requests flask
```

### 2. Configure API Keys

1. Copy the configuration template:
```bash
cp insurance_config.env.example insurance_config.env
```

2. Edit `insurance_config.env` and add your API keys:
```env
INSUREHERO_API_KEY=your_actual_api_key_here
GIGEASY_API_KEY=your_actual_api_key_here
FIZE_API_KEY=your_actual_api_key_here
OPENKODA_API_KEY=your_actual_api_key_here
```

### 3. Start the Insurance API Server

```bash
cd server
python start_insurance_api.py
```

The API will be available at `http://localhost:5002`

## API Endpoints

### Health Check
```
GET /api/insurance/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "insurance-api",
  "timestamp": "2024-02-14T10:00:00Z",
  "available_apis": ["insurehero", "gigeasy", "fize", "openkoda"]
}
```

### Get Insurance Quotes
```
POST /api/insurance/quotes
```

**Request Body:**
```json
{
  "propertyAddress": "123 Main St, San Francisco, CA 94102",
  "propertyType": "single-family",
  "constructionYear": "1995",
  "squareFootage": "2500",
  "coverageAmount": "850000",
  "policyType": "homeowners"
}
```

**Response:**
```json
{
  "success": true,
  "quotes": [
    {
      "id": "insurehero_12345",
      "provider": "State Farm",
      "policyType": "homeowners",
      "annualPremium": 1200.00,
      "deductible": 1000.00,
      "coverage": {
        "dwelling": 850000,
        "personalProperty": 425000,
        "liability": 300000,
        "medicalPayments": 5000,
        "additionalLivingExpenses": 85000
      },
      "features": ["24/7 Claims Service", "Multi-Policy Discount"],
      "rating": 4.8,
      "reviewCount": 127,
      "status": "quoted",
      "validUntil": "2024-03-14",
      "logo": "https://example.com/logo.png",
      "apiSource": "insurehero"
    }
  ],
  "total": 1
}
```

### Bind Insurance Policy
```
POST /api/insurance/bind
```

**Request Body:**
```json
{
  "quoteId": "insurehero_12345"
}
```

**Response:**
```json
{
  "success": true,
  "policyId": "POL-123456789",
  "message": "Policy bound successfully"
}
```

## Integration with Frontend

The insurance API integrates seamlessly with the existing `InsuranceUtilities.tsx` component. The component already has the necessary API calls:

```typescript
// Request quotes
const response = await fetch('/api/insurance/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(insuranceForm),
});

// Bind policy
const response = await fetch('/api/insurance/bind', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ quoteId }),
});
```

## Features

### Multi-Provider Quotes
- Fetches quotes from all available APIs simultaneously
- Sorts results by annual premium (lowest first)
- Handles API failures gracefully with fallback mechanisms

### Rate Limiting
- Implements rate limiting for each API provider
- Prevents exceeding API quotas
- Configurable limits per minute

### Error Handling
- Comprehensive error handling for API failures
- Detailed logging for debugging
- Graceful degradation when APIs are unavailable

### Caching
- Implements caching to reduce API calls
- Configurable cache duration
- Automatic cache invalidation

## Getting API Keys

### InsureHero
1. Visit https://insurehero.io
2. Contact their sales team for API access
3. Request free tier or trial access
4. Receive API key via email

### GigEasy
1. Visit https://gigeasy.ai/developers.html
2. Sign up for developer account
3. Access sandbox environment
4. Request production API key

### Fize
1. Visit https://getfize.com
2. Sign up for free account
3. Access API documentation
4. Generate API key from dashboard

### Openkoda
1. Visit https://openkoda.com
2. Download open source code
3. Set up your own instance
4. Generate API key

## Cost Analysis

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| InsureHero | Contact for details | Custom pricing | Enterprise solutions |
| GigEasy | Sandbox testing | Usage-based | State compliance |
| Fize | Free signup | Tiered pricing | Data verification |
| Openkoda | Completely free | N/A | Custom implementations |

## Security Considerations

1. **API Key Management**: Store API keys securely in environment variables
2. **Rate Limiting**: Implement proper rate limiting to avoid abuse
3. **Data Privacy**: Ensure compliance with insurance data regulations
4. **Error Handling**: Don't expose sensitive information in error messages

## Monitoring and Logging

The API includes comprehensive logging for:
- API call success/failure rates
- Response times
- Error messages
- Rate limit violations

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct
   - Check if the key has expired
   - Ensure the key has proper permissions

2. **Rate Limit Exceeded**
   - Check rate limiting configuration
   - Implement exponential backoff
   - Consider upgrading API plan

3. **No Quotes Returned**
   - Verify property information is complete
   - Check if APIs are responding
   - Review error logs for specific issues

### Debug Mode

Enable debug mode by setting:
```python
app.run(debug=True)
```

This will provide detailed error messages and logging.

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live quote updates
2. **Policy Management**: Full policy lifecycle management
3. **Claims Integration**: Claims filing and tracking
4. **Analytics**: Quote conversion and performance analytics
5. **Mobile App**: Native mobile app integration

## Support

For technical support or questions about the insurance API integration:

1. Check the logs for error messages
2. Verify API key configuration
3. Test individual API endpoints
4. Contact the respective API providers for specific issues

## License

This insurance API integration is part of the Dreamery platform and follows the same licensing terms.
