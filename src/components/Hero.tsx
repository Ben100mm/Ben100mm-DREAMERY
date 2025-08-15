import React from 'react';
import styled from 'styled-components';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';

const HeroContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/hero-background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
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
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  padding: 0.75rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;
  .MuiInputBase-root {
    color: #1a365d;
    font-weight: 600;
    &::before, &::after {
      display: none;
    }
    input {
      font-size: 1.1rem;
      &::placeholder {
        color: #1a365d;
        opacity: 1;
        font-weight: 500;
      }
    }
  }
`;

const SparkleButton = styled(IconButton)`
  color: #1a365d;
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
    color: white;
  }
`;

const MapButton = styled(IconButton)`
  color: #1a365d;
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
    color: white;
  }
`;

const SearchButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #1d4ed8;
  }
`;

const SparkleIcon = () => {
  // Get the background color at the logo's position to determine logo color
  const [logoColor, setLogoColor] = React.useState('#1a365d'); // Default navy blue
  
  React.useEffect(() => {
    const updateLogoColor = () => {
      // Create a canvas to sample the background color
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Get the search bar element position
        const searchBar = document.querySelector('[data-testid="search-container"]');
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
          setLogoColor(brightness > 128 ? '#1a365d' : '#ffffff');
        }
      }
    };
    
    updateLogoColor();
    window.addEventListener('resize', updateLogoColor);
    return () => window.removeEventListener('resize', updateLogoColor);
  }, []);
  
  return (
    <img 
      src="/logo.png" 
      alt="Dreamery Logo" 
      style={{ 
        width: '65px', 
        height: '65px', 
        objectFit: 'contain',
        filter: logoColor === '#ffffff' ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
      }} 
    />
  );
};

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <Overlay />
      <Content>
        <Title>It Starts with a Home.</Title>
        <SearchContainer data-testid="search-container">
          <StyledTextField
            variant="standard"
            placeholder="Enter an address, neighborhood, city, or ZIP code"
            fullWidth
          />
          <SparkleButton>
            <SparkleIcon />
          </SparkleButton>
          <MapButton>
            <MapIcon />
          </MapButton>
          <SearchButton>
            Search
          </SearchButton>
        </SearchContainer>
      </Content>
    </HeroContainer>
  );
};

export default Hero;