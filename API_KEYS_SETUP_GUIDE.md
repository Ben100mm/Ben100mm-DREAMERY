# Insurance API Keys Setup Guide

## Quick Setup for Testing

For immediate testing, I'll configure mock API keys that will return sample data. This allows you to test the full functionality without waiting for real API keys.

## Real API Keys Setup

### 1. InsureHero (Recommended - Most Comprehensive)
**Website**: https://insurehero.io
**Steps**:
1. Visit https://insurehero.io
2. Click "Contact Sales" or "Get Started"
3. Request API access for free tier
4. Provide your business details
5. Receive API key via email (usually within 24-48 hours)

**Free Tier**: Contact for details (usually includes limited requests per month)

### 2. GigEasy (Developer-Friendly)
**Website**: https://gigeasy.ai/developers.html
**Steps**:
1. Visit https://gigeasy.ai/developers.html
2. Click "Get Started" or "Sign Up"
3. Create developer account
4. Access sandbox environment immediately
5. Request production API key

**Free Tier**: Sandbox testing environment + limited production requests

### 3. Fize (Quick Setup)
**Website**: https://getfize.com
**Steps**:
1. Visit https://getfize.com
2. Click "Sign Up" (free)
3. Complete registration
4. Access API dashboard
5. Generate API key

**Free Tier**: Free signup with API access

### 4. Openkoda (Open Source - Completely Free)
**Website**: https://openkoda.com
**Steps**:
1. Visit https://openkoda.com
2. Download the open source code
3. Set up your own instance
4. Generate API key

**Free Tier**: Completely free (self-hosted)

## Configuration Steps

### Step 1: Get Your API Keys
Follow the steps above to get API keys from the providers you want to use.

### Step 2: Update Configuration
Edit the `insurance_config.env` file and replace the placeholder values:

```env
# Replace with your actual API keys
INSUREHERO_API_KEY=your_actual_insurehero_key_here
GIGEASY_API_KEY=your_actual_gigeasy_key_here
FIZE_API_KEY=your_actual_fize_key_here
OPENKODA_API_KEY=your_actual_openkoda_key_here
```

### Step 3: Restart the API Server
```bash
cd server
python3 start_insurance_api.py
```

### Step 4: Test the Integration
```bash
cd server
python3 test_insurance_api.py
```

## Mock API Keys for Testing

If you want to test immediately without waiting for real API keys, I can configure mock keys that return sample data. This allows you to see the full functionality working.

## Troubleshooting

### Common Issues:
1. **"API key not configured"** - Make sure you've added the key to `insurance_config.env`
2. **"Rate limit exceeded"** - Wait a minute or check your API plan limits
3. **"No quotes returned"** - Check if the API provider is responding
4. **"Invalid API key"** - Verify the key is correct and hasn't expired

### Testing Individual APIs:
You can test each API individually by checking the server logs when making quote requests.

## Cost Comparison

| Provider | Free Tier | Best For | Setup Time |
|----------|-----------|----------|------------|
| InsureHero | Contact for details | Enterprise | 1-2 days |
| GigEasy | Sandbox + limited prod | Developers | Immediate |
| Fize | Free signup | Quick setup | 5 minutes |
| Openkoda | Completely free | Custom needs | 30 minutes |

## Next Steps

1. **Choose 1-2 providers** to start with (I recommend GigEasy + Fize for quick setup)
2. **Get API keys** following the steps above
3. **Update configuration** with your keys
4. **Test the integration** to ensure it's working
5. **Add more providers** as needed

The system is designed to work with any combination of these providers, so you can start with just one and add more later.
