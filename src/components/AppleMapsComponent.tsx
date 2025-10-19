import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  IconButton,
  Chip,
  Card,
  CardContent,
  Slider,
  Switch,
} from '@mui/material';
import styled from 'styled-components';
import { brandColors } from '../theme';
import { appleMapsConfig, getAppleMapsToken, isAppleMapsConfigured } from '../config/appleMaps';

// Lazy load icons
const LazySchoolIcon = React.lazy(() => import('@mui/icons-material/School'));
const LazyDrawIcon = React.lazy(() => import('@mui/icons-material/Edit'));
const LazyMapIcon = React.lazy(() => import('@mui/icons-material/Map'));
const LazySatelliteIcon = React.lazy(() => import('@mui/icons-material/Satellite'));
const LazyStreetviewIcon = React.lazy(() => import('@mui/icons-material/Streetview'));
const LazyZoomInIcon = React.lazy(() => import('@mui/icons-material/ZoomIn'));
const LazyZoomOutIcon = React.lazy(() => import('@mui/icons-material/ZoomOut'));
const LazyCloseIcon = React.lazy(() => import('@mui/icons-material/Close'));
const LazyLayersIcon = React.lazy(() => import('@mui/icons-material/Layers'));
const LazyFilterListIcon = React.lazy(() => import('@mui/icons-material/FilterList'));

// Apple Maps MapKit JS types
declare global {
  interface Window {
    mapkit: any;
  }
}

interface MapKit {
  Map: any;
  Annotation: any;
  Coordinate: any;
  CoordinateRegion: any;
  MapPoint: any;
  MapSize: any;
  init: (options: any) => void;
}

interface Property {
  id: number;
  price: string;
  x: number;
  y: number;
  specialLabels?: string[];
  isHighlighted?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AppleMapsComponentProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: ${brandColors.text.primary};
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  backdrop-filter: blur(10px);
`;

const MapControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
`;

const BottomControls = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
`;

const LayerControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
`;

const MapOptionsModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapOptionsPaper = styled(Paper)`
  width: 400px;
  max-height: 80vh;
  padding: 1.5rem;
  border-radius: 12px;
  outline: none;
  overflow-y: auto;
`;

const PropertyPopup = styled(Card)`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  max-width: 300px;
  z-index: 20;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const AppleMapsComponent: React.FC<AppleMapsComponentProps> = ({ 
  properties, 
  onPropertyClick 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  
  // Map state
  const [mapView, setMapView] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [showLayerControls, setShowLayerControls] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]);
  const [showSchoolDistricts, setShowSchoolDistricts] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize Apple Maps
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Load MapKit JS script
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      if (window.mapkit) {
        // Initialize MapKit
        window.mapkit.init({
          authorizationCallback: (done: any) => {
            const token = getAppleMapsToken();
            if (token) {
              done(token);
            } else {
              console.warn('Apple Maps JWT token not configured. Please set REACT_APP_APPLE_MAPS_JWT_TOKEN in your environment variables.');
              // For development without a token, we'll use a placeholder
              done('YOUR_APPLE_MAPS_JWT_TOKEN');
            }
          }
        });

        // Create the map
        map.current = new window.mapkit.Map(mapContainer.current, {
          region: new window.mapkit.CoordinateRegion(
            new window.mapkit.Coordinate(appleMapsConfig.defaultCenter.latitude, appleMapsConfig.defaultCenter.longitude),
            new window.mapkit.CoordinateSpan(0.1, 0.1)
          ),
          mapType: window.mapkit.Map.MapTypes.Standard,
          showsMapTypeControl: appleMapsConfig.features.showsMapTypeControl,
          showsZoomControl: appleMapsConfig.features.showsZoomControl,
          showsCompass: appleMapsConfig.features.showsCompass,
          showsScale: appleMapsConfig.features.showsScale,
          showsUserLocation: appleMapsConfig.features.showsUserLocation,
          showsTraffic: appleMapsConfig.features.showsTraffic,
          showsBuildings: appleMapsConfig.features.showsBuildings,
          showsPointsOfInterest: appleMapsConfig.features.showsPointsOfInterest,
        });

        // Add property annotations
        properties.forEach((property) => {
          if (property.coordinates) {
            const annotation = new window.mapkit.Annotation(
              new window.mapkit.Coordinate(property.coordinates.lat, property.coordinates.lng),
              () => {
                // Create custom annotation view
                const annotationElement = document.createElement('div');
                annotationElement.style.cssText = `
                  background: ${property.isHighlighted ? appleMapsConfig.propertyMarker.color.highlighted : appleMapsConfig.propertyMarker.color.default};
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 600;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  transition: all 0.2s ease;
                `;
                annotationElement.textContent = property.price;
                
                // Add click handler
                annotationElement.addEventListener('click', () => {
                  setSelectedProperty(property);
                  onPropertyClick?.(property);
                });

                return annotationElement;
              }
            );

            annotation.title = property.price;
            annotation.subtitle = `Property ${property.id}`;
            
            map.current.addAnnotation(annotation);
          }
        });

        // Handle map events
        map.current.addEventListener('region-change-end', () => {
          // Handle map region changes
        });

        setIsMapLoaded(true);
      }
    };

    document.head.appendChild(script);

    return () => {
      if (map.current) {
        map.current.destroy();
        map.current = null;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [properties, onPropertyClick]);

  // Update map style when view changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const mapTypes = {
      standard: window.mapkit.Map.MapTypes.Standard,
      satellite: window.mapkit.Map.MapTypes.Satellite,
      hybrid: window.mapkit.Map.MapTypes.Hybrid
    };

    map.current.mapType = mapTypes[mapView];
  }, [mapView, isMapLoaded]);

  const handleZoomIn = () => {
    if (map.current) {
      const currentRegion = map.current.region;
      const newSpan = new window.mapkit.CoordinateSpan(
        currentRegion.span.latitudeDelta * 0.7,
        currentRegion.span.longitudeDelta * 0.7
      );
      map.current.region = new window.mapkit.CoordinateRegion(currentRegion.center, newSpan);
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      const currentRegion = map.current.region;
      const newSpan = new window.mapkit.CoordinateSpan(
        currentRegion.span.latitudeDelta * 1.3,
        currentRegion.span.longitudeDelta * 1.3
      );
      map.current.region = new window.mapkit.CoordinateRegion(currentRegion.center, newSpan);
    }
  };

  const handleMapViewChange = (view: 'standard' | 'satellite' | 'hybrid') => {
    setMapView(view);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const toggleSchoolDistricts = () => {
    setShowSchoolDistricts(!showSchoolDistricts);
    // TODO: Implement school districts layer
  };

  const toggleTransit = () => {
    setShowTransit(!showTransit);
    // TODO: Implement transit layer
  };

  return (
    <MapContainer ref={mapContainer}>
      {/* Map overlay showing property count */}
      <MapOverlay>
        {properties.length} of 1,095 homes
      </MapOverlay>

      {/* Layer Controls */}
      <LayerControls>
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyLayersIcon />
            </React.Suspense>
          }
          onClick={() => setShowLayerControls(!showLayerControls)}
          sx={{ 
            backgroundColor: 'white',
            color: showLayerControls ? brandColors.primary : brandColors.text.primary,
            borderColor: showLayerControls ? brandColors.primary : brandColors.borders.secondary,
          }}
        >
          Layers
        </Button>
      </LayerControls>

      {/* Top right controls */}
      <MapControls>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Schools</InputLabel>
          <Select
            label="Schools"
            sx={{ backgroundColor: 'white' }}
          >
            <MenuItem value="">All Schools</MenuItem>
            <MenuItem value="elementary">Elementary</MenuItem>
            <MenuItem value="middle">Middle School</MenuItem>
            <MenuItem value="high">High School</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyDrawIcon />
            </React.Suspense>
          }
          sx={{ backgroundColor: 'white' }}
        >
          Draw Area
        </Button>
      </MapControls>

      {/* Bottom right controls */}
      <BottomControls>
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyMapIcon />
            </React.Suspense>
          }
          onClick={() => setShowMapOptions(true)}
          sx={{ backgroundColor: 'white' }}
        >
          Map
        </Button>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleZoomIn}
            sx={{ 
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyZoomInIcon />
            </React.Suspense>
          </IconButton>
          <IconButton
            size="small"
            onClick={handleZoomOut}
            sx={{ 
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyZoomOutIcon />
            </React.Suspense>
          </IconButton>
        </Box>
      </BottomControls>

      {/* Layer Controls Panel */}
      {showLayerControls && (
        <Paper
          sx={{
            position: 'absolute',
            top: '4rem',
            right: '1rem',
            p: 2,
            minWidth: 250,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
            Map Layers
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showSchoolDistricts}
                  onChange={toggleSchoolDistricts}
                  color="primary"
                />
              }
              label="School Districts"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={showTransit}
                  onChange={toggleTransit}
                  color="primary"
                />
              }
              label="Transit Lines"
            />
          </Box>
        </Paper>
      )}

      {/* Map Options Modal */}
      <MapOptionsModal
        open={showMapOptions}
        onClose={() => setShowMapOptions(false)}
      >
        <MapOptionsPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Map Options</Typography>
            <IconButton onClick={() => setShowMapOptions(false)} size="small">
              <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                <LazyCloseIcon />
              </React.Suspense>
            </IconButton>
          </Box>

          {/* Map View Options */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Map Style
            </Typography>
            <RadioGroup
              value={mapView}
              onChange={(e) => handleMapViewChange(e.target.value as any)}
            >
              <FormControlLabel
                value="standard"
                control={<Radio size="small" />}
                label="Standard"
              />
              <FormControlLabel
                value="satellite"
                control={<Radio size="small" />}
                label="Satellite"
              />
              <FormControlLabel
                value="hybrid"
                control={<Radio size="small" />}
                label="Hybrid"
              />
            </RadioGroup>
          </Box>

          {/* Price Range Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Price Range
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000000}
              step={100000}
              valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
              color="primary"
            />
          </Box>

          {/* Data Layers */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Data Layers
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Market Activity', 'Crime Data', 'Demographics', 'Climate Risks'].map((layer) => (
                <FormControlLabel
                  key={layer}
                  control={<Checkbox size="small" />}
                  label={layer}
                />
              ))}
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowMapOptions(false)}
            sx={{ backgroundColor: brandColors.primary }}
          >
            Apply Settings
          </Button>
        </MapOptionsPaper>
      </MapOptionsModal>

      {/* Selected Property Info */}
      {selectedProperty && (
        <PropertyPopup>
          <CardContent>
            <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>
              {selectedProperty.price}
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
              Property details would appear here
            </Typography>
            {selectedProperty.specialLabels && selectedProperty.specialLabels.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {selectedProperty.specialLabels.map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => setSelectedProperty(null)}
            >
              Close
            </Button>
          </CardContent>
        </PropertyPopup>
      )}
    </MapContainer>
  );
};

export default AppleMapsComponent;
