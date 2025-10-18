/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
 */

import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import styled from 'styled-components';
import { brandColors } from '../theme';

// Lazy load icons
const LazyMapIcon = React.lazy(() => import('@mui/icons-material/Map'));
const LazyLayersIcon = React.lazy(() => import('@mui/icons-material/Layers'));
const LazyZoomInIcon = React.lazy(() => import('@mui/icons-material/ZoomIn'));
const LazyZoomOutIcon = React.lazy(() => import('@mui/icons-material/ZoomOut'));

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: ${brandColors.neutral[100]};
`;

const MapImage = styled.div`
  height: 100%;
  width: 100%;
  background-image: url('/san-francisco-map.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
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

const PropertyMarker = styled.div<{ x: number; y: number; isHighlighted?: boolean }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transform: translate(-50%, -50%);
  background: ${props => props.isHighlighted ? '#ff4444' : '#1976d2'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  z-index: 5;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
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

interface MapPlaceholderProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  properties, 
  onPropertyClick 
}) => {
  const [showLayers, setShowLayers] = React.useState(false);

  return (
    <MapContainer>
      <MapImage>
        {/* Map overlay showing property count */}
        <MapOverlay>
          {properties.length} of 1,095 homes
        </MapOverlay>

        {/* Layer Controls */}
        <Box sx={{ position: 'absolute', top: '1rem', right: '200px', zIndex: 10 }}>
          <IconButton
            size="small"
            onClick={() => setShowLayers(!showLayers)}
            sx={{ 
              backgroundColor: 'white',
              color: showLayers ? brandColors.primary : brandColors.text.primary,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyLayersIcon />
            </React.Suspense>
          </IconButton>
        </Box>

        {/* Top right controls */}
        <MapControls>
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 1, 
            p: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyMapIcon fontSize="small" />
            </React.Suspense>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Map View
            </Typography>
          </Box>
        </MapControls>

        {/* Bottom right controls */}
        <BottomControls>
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

        {/* Property markers */}
        {properties.map((property) => (
          <PropertyMarker
            key={property.id}
            x={property.x}
            y={property.y}
            isHighlighted={property.isHighlighted}
            onClick={() => onPropertyClick?.(property)}
          >
            {property.price}
            {property.specialLabels && property.specialLabels.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                {property.specialLabels.map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    size="small"
                    sx={{ 
                      height: 16, 
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: brandColors.text.primary
                    }}
                  />
                ))}
              </Box>
            )}
          </PropertyMarker>
        ))}

        {/* Layer Controls Panel */}
        {showLayers && (
          <Box
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
              <Typography variant="body2" color="text.secondary">
                School Districts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Transit Lines
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Market Activity
              </Typography>
            </Box>
          </Box>
        )}
      </MapImage>
    </MapContainer>
  );
};

export default MapPlaceholder;
