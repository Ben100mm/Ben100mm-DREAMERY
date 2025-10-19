/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { TextField, IconButton, Box, CircularProgress, Alert, Fade } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import { useNavigate } from "react-router-dom";
import { brandColors } from "../theme";
import { addressAutocompleteService, AddressSuggestion } from "../services/addressAutocompleteService";
import { AddressValidator, AddressGeocoder, SearchRouter, AddressFormatter } from "../utils/addressUtils";

const HeroContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/hero-background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: brandColors.backgrounds.primary;
  padding: 0 2rem;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  margin-top: -5%;
  color: white;
`;


const StyledTextField = styled(TextField)`
  flex-grow: 1;
  .MuiInputBase-root {
    color: brandColors.text.primary;  // Use high contrast text color
    font-weight: 600;
    &::before,
    &::after {
      display: none;
    }
    input {
      font-size: 1.1rem;
      &::placeholder {
        color: #757575;  // Lighter gray for better contrast on light background
        opacity: 1;
        font-weight: 500;
      }
    }
  }
`;

const SparkleButton = styled(IconButton)`
  color: brandColors.primary;
  opacity: 1;
  margin-right: 0.25rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  &:hover {
    opacity: 1;
    background-color: rgba(26, 54, 93, 1);
    color: brandColors.backgrounds.primary;
  }
`;

const MapButton = styled(IconButton)`
  color: brandColors.primary;
  opacity: 1;
  margin-right: 0.25rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  &:hover {
    opacity: 1;
    background-color: rgba(26, 54, 93, 1);
    color: brandColors.backgrounds.primary;
  }
`;

const SearchButton = styled.button`
  background: brandColors.primary;
  color: brandColors.text.inverse;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: brandColors.primaryDark;
  }
  &:disabled {
    background: brandColors.neutral.gray300;
    cursor: not-allowed;
  }
`;

const SuggestionDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${brandColors.borders.primary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  margin-top: 4px;
`;

const SuggestionItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isSelected ? brandColors.interactive.hover : 'transparent'};
  
  &:hover {
    background-color: ${brandColors.interactive.hover};
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const SuggestionIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: ${brandColors.primary};
`;

const SuggestionContent = styled.div`
  flex: 1;
`;

const SuggestionTitle = styled.div`
  font-weight: 600;
  color: ${brandColors.text.primary};
  margin-bottom: 2px;
`;

const SuggestionSubtitle = styled.div`
  font-size: 0.875rem;
  color: ${brandColors.text.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: ${brandColors.text.secondary};
`;

const ErrorContainer = styled.div`
  padding: 12px 16px;
  color: ${brandColors.text.error};
  font-size: 0.875rem;
  border-top: 1px solid ${brandColors.borders.secondary};
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  padding: 0.75rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px brandColors.shadows.light;
  &:hover {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 8px brandColors.shadows.medium;
  }
`;

const SparkleIcon = () => {
  // Get the background color at the logo's position to determine logo color
  const [logoColor, setLogoColor] = React.useState(brandColors.primary); // Default navy blue

  React.useEffect(() => {
    const updateLogoColor = () => {
      // Create a canvas to sample the background color
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Get the search bar element position
        const searchBar = document.querySelector(
          '[data-testid="search-container"]',
        );
        if (searchBar) {
          const rect = searchBar.getBoundingClientRect();
          const x = rect.left + rect.width / 2; // Center of search bar
          const y = rect.top + rect.height / 2; // Center of search bar

          // Sample the background color
          const imageData = ctx.getImageData(x, y, 1, 1);
          const r = imageData.data[0];
          const g = imageData.data[1];
          const b = imageData.data[2];

          // Calculate brightness to determine if background is light or dark
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;

          // Set logo color based on background brightness
          setLogoColor(brightness > 128 ? brandColors.primary : brandColors.backgrounds.primary);
        }
      }
    };

    updateLogoColor();
    window.addEventListener("resize", updateLogoColor);
    return () => window.removeEventListener("resize", updateLogoColor);
  }, []);

  return (
    <img
      src="/logo.png"
      alt="Dreamery Logo"
      style={{
        width: "65px",
        height: "65px",
        objectFit: "contain",
        filter:
          logoColor === brandColors.backgrounds.primary
            ? "brightness(0) invert(1)"
            : "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
      }}
    />
  );
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      console.log('🔍 Hero: Starting debounced search for:', searchQuery);
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await addressAutocompleteService.getSuggestions(searchQuery);
        console.log('✅ Hero: Received suggestions:', results);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('❌ Hero: Error fetching suggestions:', err);
        setError('Failed to fetch suggestions');
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setError(null);
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: AddressSuggestion) => {
    setSearchQuery(suggestion.fullAddress);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  // Handle search submission
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('Please enter an address to search');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Validate address
      const validation = AddressValidator.validate(searchQuery);
      if (!validation.isValid) {
        setError(validation.errors[0]);
        setIsSearching(false);
        return;
      }

      // Format address for search
      const formattedQuery = AddressFormatter.formatForDisplay(searchQuery);
      
      // Geocode address
      const geocodedAddress = await AddressGeocoder.geocodeAddress(formattedQuery);
      
      // Get search route
      const { route, state } = SearchRouter.getSearchRoute(geocodedAddress, formattedQuery);
      
      // Navigate to search results
      navigate(route, { state });
    } catch (err) {
      setError('Failed to process search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, navigate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSuggestionSelect, handleSearch]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon for suggestion type
  const getSuggestionIcon = (type: AddressSuggestion['type']) => {
    switch (type) {
      case 'address':
        return <HomeIcon fontSize="small" />;
      case 'street':
        return <LocationOnIcon fontSize="small" />;
      case 'neighborhood':
        return <BusinessIcon fontSize="small" />;
      default:
        return <PublicIcon fontSize="small" />;
    }
  };

  return (
    <HeroContainer>
      <Overlay />
      <Content>
        <Title>It Starts with a Home.</Title>
        <SearchContainer ref={searchContainerRef} data-testid="search-container">
          <StyledTextField
            ref={inputRef}
            variant="standard"
            placeholder="Enter an address, neighborhood, city, or ZIP code"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            fullWidth
            disabled={isSearching}
          />
          <SparkleButton>
            <SparkleIcon />
          </SparkleButton>
          <MapButton>
            <MapIcon />
          </MapButton>
          <SearchButton 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              'Search'
            )}
          </SearchButton>
          
          {/* Suggestions Dropdown */}
          <SuggestionDropdown $isOpen={showSuggestions && !error}>
            {isLoading ? (
              <LoadingContainer>
                <CircularProgress size={20} />
                <span style={{ marginLeft: 8 }}>Searching...</span>
              </LoadingContainer>
            ) : (
              suggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={suggestion.id}
                  isSelected={index === selectedIndex}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <SuggestionIcon>
                    {getSuggestionIcon(suggestion.type)}
                  </SuggestionIcon>
                  <SuggestionContent>
                    <SuggestionTitle>{suggestion.displayName}</SuggestionTitle>
                    {suggestion.metadata && (
                      <SuggestionSubtitle>
                        {[suggestion.metadata.city, suggestion.metadata.state, suggestion.metadata.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </SuggestionSubtitle>
                    )}
                  </SuggestionContent>
                </SuggestionItem>
              ))
            )}
          </SuggestionDropdown>
          
          {/* Error Display */}
          <Fade in={!!error}>
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                zIndex: 1001
              }}
            >
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          </Fade>
        </SearchContainer>
      </Content>
    </HeroContainer>
  );
};

export default Hero;
