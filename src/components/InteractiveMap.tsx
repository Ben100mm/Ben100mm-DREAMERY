import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import styled from 'styled-components';
import { brandColors } from '../theme';

// Lazy load icons
const LazySchoolIcon = React.lazy(() => import('@mui/icons-material/School'));
const LazyDrawIcon = React.lazy(() => import('@mui/icons-material/Edit'));
const LazyMapIcon = React.lazy(() => import('@mui/icons-material/Map'));
const LazySatelliteIcon = React.lazy(() => import('@mui/icons-material/Satellite'));
const LazyStreetviewIcon = React.lazy(() => import('@mui/icons-material/Streetview'));
const LazyZoomInIcon = React.lazy(() => import('@mui/icons-material/ZoomIn'));
const LazyZoomOutIcon = React.lazy(() => import('@mui/icons-material/ZoomOut'));
const LazyCloseIcon = React.lazy(() => import('@mui/icons-material/Close'));

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-image: url('/san-francisco-map.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #e3f2fd; /* Fallback color while image loads */
  border-radius: 8px;
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: ${brandColors.text.primary};
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
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

const PropertyMarker = styled.div<{ x: number; y: number; isHighlighted?: boolean }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  background: ${props => props.isHighlighted ? '#ff4444' : '#d32f2f'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 5;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    z-index: 15;
  }
`;

const SpecialLabel = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${brandColors.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.6rem;
  font-weight: 600;
  white-space: nowrap;
`;

const MapOptionsModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapOptionsPaper = styled(Paper)`
  width: 300px;
  padding: 1.5rem;
  border-radius: 8px;
  outline: none;
`;

const LandmarkLabel = styled.div`
  position: absolute;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 8;
`;

interface Property {
  id: number;
  price: string;
  x: number;
  y: number;
  specialLabels?: string[];
  isHighlighted?: boolean;
}

interface InteractiveMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties, onPropertyClick }) => {
  const [mapView, setMapView] = useState<'automatic' | 'satellite' | 'street'>('automatic');
  const [climateRisks, setClimateRisks] = useState<string[]>([]);
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [schoolFilter, setSchoolFilter] = useState('');
  const [drawMode, setDrawMode] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const landmarks = [
    { name: 'Yoda Fountain', x: 15, y: 20 },
    { name: 'Presidio of San Francisco', x: 12, y: 18 },
    { name: 'Golden Gate Park', x: 35, y: 45 },
    { name: 'Union Square', x: 60, y: 35 },
    { name: 'Japantown', x: 45, y: 30 },
  ];

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    onPropertyClick?.(property);
  };

  const handleDrawToggle = () => {
    setDrawMode(!drawMode);
    if (!drawMode) {
      setDrawCount(prev => prev + 1);
    }
  };

  const handleClimateRiskChange = (risk: string) => {
    setClimateRisks(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  };

  const handleDeselectAllClimateRisks = () => {
    setClimateRisks([]);
  };

  return (
    <MapContainer ref={mapRef}>
      {/* Map overlay showing property count */}
      <MapOverlay>
        {properties.length} of 1,095 homes
      </MapOverlay>

      {/* Top right controls */}
      <MapControls>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Schools</InputLabel>
          <Select
            value={schoolFilter}
            label="Schools"
            onChange={(e) => setSchoolFilter(e.target.value)}
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
          onClick={handleDrawToggle}
          sx={{ 
            backgroundColor: 'white',
            color: drawMode ? brandColors.primary : brandColors.text.primary,
            borderColor: drawMode ? brandColors.primary : brandColors.borders.secondary,
          }}
        >
          Draw {drawCount > 0 && `(${drawCount})`}
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

      {/* Landmarks */}
      {landmarks.map((landmark, index) => (
        <LandmarkLabel
          key={index}
          style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
        >
          {landmark.name}
        </LandmarkLabel>
      ))}

      {/* Property markers */}
      {properties.map((property) => (
        <PropertyMarker
          key={property.id}
          x={property.x}
          y={property.y}
          isHighlighted={property.isHighlighted}
          onClick={() => handlePropertyClick(property)}
        >
          {property.price}
          {property.specialLabels?.map((label, index) => (
            <SpecialLabel key={index}>
              {label}
            </SpecialLabel>
          ))}
        </PropertyMarker>
      ))}

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
              Map Options
            </Typography>
            <RadioGroup
              value={mapView}
              onChange={(e) => setMapView(e.target.value as any)}
            >
              <FormControlLabel
                value="automatic"
                control={<Radio size="small" />}
                label="Automatic"
              />
              <FormControlLabel
                value="satellite"
                control={<Radio size="small" />}
                label="Satellite"
              />
              <FormControlLabel
                value="street"
                control={<Radio size="small" />}
                label="Street view"
              />
            </RadioGroup>
          </Box>

          {/* Climate Risks */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Climate Risks
            </Typography>
            <Box sx={{ mb: 1 }}>
              <FormControlLabel
                value="none"
                control={
                  <Radio
                    size="small"
                    checked={climateRisks.length === 0}
                    onChange={handleDeselectAllClimateRisks}
                  />
                }
                label="None selected"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {['Wind', 'Flood', 'Air', 'Fire', 'Heat'].map((risk) => (
                <FormControlLabel
                  key={risk}
                  control={
                    <Checkbox
                      size="small"
                      checked={climateRisks.includes(risk)}
                      onChange={() => handleClimateRiskChange(risk)}
                    />
                  }
                  label={risk}
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
            Apply
          </Button>
        </MapOptionsPaper>
      </MapOptionsModal>

      {/* Selected Property Info */}
      {selectedProperty && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '300px',
            zIndex: 20,
          }}
        >
          <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>
            {selectedProperty.price}
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
            Property details would appear here
          </Typography>
          {selectedProperty.specialLabels && (
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
        </Box>
      )}
    </MapContainer>
  );
};

export default InteractiveMap;
