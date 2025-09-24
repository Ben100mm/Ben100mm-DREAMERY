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
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

interface EnhancedInteractiveMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const EnhancedInteractiveMap: React.FC<EnhancedInteractiveMapProps> = ({ 
  properties, 
  onPropertyClick 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Map state
  const [mapView, setMapView] = useState<'street' | 'satellite' | 'hybrid'>('street');
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [showLayerControls, setShowLayerControls] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSchoolDistricts, setShowSchoolDistricts] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [clusterRadius, setClusterRadius] = useState(50);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set your Mapbox access token here
    // For demo purposes, we'll use a placeholder
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiZHJlYW1lcnkiLCJhIjoiY2t4eHh4eHh4eHh4eCJ9.demo';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 11,
      maxZoom: 18,
      minZoom: 8,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl());

    // Handle map load
    map.current.on('load', () => {
      if (!map.current) return;

      // Add property markers as GeoJSON source
      const geoJsonData = {
        type: 'FeatureCollection' as const,
        features: properties.map(property => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: property.coordinates ? [property.coordinates.lng, property.coordinates.lat] : 
              [-122.4194 + (Math.random() - 0.5) * 0.1, 37.7749 + (Math.random() - 0.5) * 0.1]
          },
          properties: {
            id: property.id,
            price: property.price,
            specialLabels: property.specialLabels || [],
            isHighlighted: property.isHighlighted || false
          }
        }))
      };

      // Add property source
      map.current.addSource('properties', {
        type: 'geojson',
        data: geoJsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: clusterRadius
      });

      // Add property clusters
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'properties',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            brandColors.primary,
            10,
            brandColors.accent.success,
            30,
            brandColors.accent.warning,
            50,
            brandColors.accent.error
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10,
            20,
            30,
            25,
            50,
            30
          ]
        }
      });

      // Add cluster count labels
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'properties',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Add individual property markers
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'properties',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['get', 'isHighlighted'],
            brandColors.accent.error,
            brandColors.primary
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add price labels
      map.current.addLayer({
        id: 'price-labels',
        type: 'symbol',
        source: 'properties',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'price'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-offset': [0, 2]
        },
        paint: {
          'text-color': brandColors.text.primary,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });

      // Add click handlers
      map.current.on('click', 'clusters', (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties!.cluster_id;
        
        map.current!.getSource('properties').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          
          map.current!.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom
          });
        });
      });

      map.current.on('click', 'unclustered-point', (e) => {
        const coordinates = (e.features![0].geometry as any).coordinates.slice();
        const properties = e.features![0].properties!;
        
        // Find the property object
        const property = properties.find((p: Property) => p.id === properties.id);
        if (property) {
          setSelectedProperty(property);
          onPropertyClick?.(property);
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'clusters', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'clusters', () => {
        map.current!.getCanvas().style.cursor = '';
      });

      map.current.on('mouseenter', 'unclustered-point', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'unclustered-point', () => {
        map.current!.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map style when view changes
  useEffect(() => {
    if (!map.current) return;

    const styleMap = {
      street: 'mapbox://styles/mapbox/streets-v12',
      satellite: 'mapbox://styles/mapbox/satellite-v9',
      hybrid: 'mapbox://styles/mapbox/satellite-streets-v12'
    };

    map.current.setStyle(styleMap[mapView]);
  }, [mapView]);

  // Update cluster radius
  useEffect(() => {
    if (!map.current) return;

    const source = map.current.getSource('properties') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setClusterRadius(clusterRadius);
    }
  }, [clusterRadius]);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleMapViewChange = (view: 'street' | 'satellite' | 'hybrid') => {
    setMapView(view);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
    // TODO: Implement heatmap layer
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
                  checked={showHeatmap}
                  onChange={toggleHeatmap}
                  color="primary"
                />
              }
              label="Price Heatmap"
            />
            
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
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cluster Radius: {clusterRadius}px
              </Typography>
              <Slider
                value={clusterRadius}
                onChange={(_, value) => setClusterRadius(value as number)}
                min={20}
                max={100}
                step={10}
                color="primary"
              />
            </Box>
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
                value="street"
                control={<Radio size="small" />}
                label="Street View"
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
              valueLabelFormat={(value) => `$${(value / 1000000).toFixed(1)}M`}
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

export default EnhancedInteractiveMap;
