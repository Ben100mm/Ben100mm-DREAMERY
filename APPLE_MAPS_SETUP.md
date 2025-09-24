# Apple Maps Integration Setup

This guide will help you set up Apple Maps integration for your Dreamery real estate application.

## Prerequisites

1. Apple Developer Account
2. Access to Apple Developer Console

## Step 1: Get Apple Maps JWT Token

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Keys** from the sidebar
4. Click the **+** button to create a new key
5. Give your key a name (e.g., "Dreamery Maps")
6. Enable **MapKit JS** capability
7. Click **Continue** and then **Register**
8. Download the key file (.p8 file)
9. Note down your **Key ID** and **Team ID**

## Step 2: Generate JWT Token

You'll need to generate a JWT token using your Apple Developer credentials. Here's a simple Node.js script to help:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Your Apple Developer credentials
const teamId = 'YOUR_TEAM_ID';
const keyId = 'YOUR_KEY_ID';
const privateKey = fs.readFileSync('path/to/your/AuthKey_KEYID.p8');

// Generate JWT token
const token = jwt.sign({
  iss: teamId,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
}, privateKey, {
  algorithm: 'ES256',
  header: {
    kid: keyId
  }
});

console.log('Your Apple Maps JWT token:', token);
```

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Add your Apple Maps JWT token to `.env`:
   ```
   REACT_APP_APPLE_MAPS_JWT_TOKEN=your_generated_jwt_token_here
   ```

## Step 4: Usage

The Apple Maps component is already integrated into your BuyPage. You can also use it in other components:

```tsx
import { AppleMapsComponent } from '../components';

const MyComponent = () => {
  const properties = [
    {
      id: 1,
      price: '$1.2M',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      },
      specialLabels: ['New Listing'],
      isHighlighted: false
    }
  ];

  return (
    <AppleMapsComponent 
      properties={properties}
      onPropertyClick={(property) => console.log('Clicked property:', property)}
    />
  );
};
```

## Features

✅ **Free Usage**: 250,000 map loads per day  
✅ **Property Markers**: Custom property annotations  
✅ **Map Types**: Standard, Satellite, and Hybrid views  
✅ **Interactive Controls**: Zoom, compass, scale  
✅ **Street View**: Look Around integration  
✅ **Privacy Focused**: No user tracking  
✅ **Responsive Design**: Works on all devices  

## Configuration

You can customize the map behavior by modifying `src/config/appleMaps.ts`:

- Default center coordinates
- Map features (controls, traffic, etc.)
- Property marker styling
- Map styling options

## Troubleshooting

### Map Not Loading
- Check that your JWT token is correctly set in environment variables
- Verify your Apple Developer account has MapKit JS enabled
- Check browser console for any error messages

### Properties Not Showing
- Ensure property coordinates are in the correct format (lat, lng)
- Check that coordinates are within the map's visible region
- Verify the property data structure matches the expected interface

### Performance Issues
- Apple Maps is optimized for performance
- If you have many properties (>1000), consider clustering
- Use the free tier limits as a guide for optimization

## Free Tier Limits

- **250,000 map loads per day** - More than enough for most real estate apps
- **25,000 service calls per day** - Covers geocoding and directions
- **No payment required** - Completely free to use

## Support

For Apple Maps specific issues:
- [Apple Maps Documentation](https://developer.apple.com/maps/)
- [MapKit JS Documentation](https://developer.apple.com/documentation/mapkitjs)
- [Apple Developer Forums](https://developer.apple.com/forums/)

For Dreamery-specific issues:
- Check the component documentation in `src/components/AppleMapsComponent.tsx`
- Review the configuration in `src/config/appleMaps.ts`
