// Apple Maps Configuration
export const appleMapsConfig = {
  // Default center coordinates (San Francisco)
  defaultCenter: {
    latitude: 37.7749,
    longitude: -122.4194
  },
  
  // Default zoom level
  defaultZoom: 11,
  
  // Map type options
  mapTypes: {
    standard: 'standard',
    satellite: 'satellite', 
    hybrid: 'hybrid'
  },
  
  // Feature toggles
  features: {
    showsMapTypeControl: true,
    showsZoomControl: true,
    showsCompass: true,
    showsScale: true,
    showsUserLocation: true,
    showsTraffic: false,
    showsBuildings: true,
    showsPointsOfInterest: true
  },
  
  // Property marker styling
  propertyMarker: {
    size: 12,
    color: {
      default: '#1976d2',
      highlighted: '#ff4444',
      selected: '#4caf50'
    }
  },
  
  // Map styling
  mapStyle: {
    // Apple Maps uses predefined styles
    // Custom styling is limited compared to other providers
    accentColor: '#1976d2' // This affects UI elements like controls
  }
};

// Helper function to get Apple Maps JWT token
export const getAppleMapsToken = (): string | null => {
  return process.env.REACT_APP_APPLE_MAPS_JWT_TOKEN || null;
};

// Helper function to check if Apple Maps is properly configured
export const isAppleMapsConfigured = (): boolean => {
  return getAppleMapsToken() !== null;
};

// Default property coordinates for San Francisco area
export const defaultPropertyCoordinates = {
  lat: 37.7749,
  lng: -122.4194
};

// San Francisco bounding box for property searches
export const sanFranciscoBounds = {
  north: 37.8324,
  south: 37.7049,
  east: -122.3482,
  west: -122.5169
};
