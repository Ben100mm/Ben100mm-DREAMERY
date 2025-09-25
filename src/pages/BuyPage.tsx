/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Popover,
  Paper,
  Link,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import styled from "styled-components";
import { brandColors, colorUtils } from "../theme";
import { PageAppBar } from "../components/Header";
import { MarketplaceModeToggle } from "../components/MarketplaceModeToggle";
import AppleMapsComponent from "../components/AppleMapsComponent";
import { PROPERTY_FEATURES, PROPERTY_CONDITIONS, SCHOOL_RATINGS, NEIGHBORHOOD_AMENITIES, PROPERTY_STATUSES } from "../data";
import { useRealtorData } from "../hooks/useRealtorData";
import { RealtorSearchParams, PropertyData } from "../types/realtor";
import PropertyDetailModal from "../components/PropertyDetailModal";

// Lazy load icons to reduce initial bundle size
const LazySearchIcon = React.lazy(() => import("@mui/icons-material/Search"));
const LazyFavoriteIcon = React.lazy(() => import("@mui/icons-material/Favorite"));
const LazyFavoriteBorderIcon = React.lazy(() => import("@mui/icons-material/FavoriteBorder"));
const LazyArrowBackIcon = React.lazy(() => import("@mui/icons-material/ArrowBack"));
const LazyKeyboardArrowDownIcon = React.lazy(() => import("@mui/icons-material/KeyboardArrowDown"));
const LazyKeyboardArrowUpIcon = React.lazy(() => import("@mui/icons-material/KeyboardArrowUp"));
const LazyClearIcon = React.lazy(() => import("@mui/icons-material/Clear"));

const PageContainer = styled.div`
  min-height: 100vh;
  background: brandColors.backgrounds.secondary;
`;

const HeaderSection = styled.div`
  background: brandColors.backgrounds.primary;
  padding: 1rem 0;
  border-bottom: 1px solid brandColors.borders.secondary;
  position: sticky;
  top: 64px;
  z-index: 100;
  margin-top: 64px;
`;

const FilterButton = styled(Button)`
  text-transform: none;
  color: brandColors.text.primary;  // High contrast text
  border: 1px solid brandColors.borders.secondary;
  background: brandColors.backgrounds.primary;
  padding: 8px 16px;
  min-width: 120px;
  &:hover {
    background: brandColors.backgrounds.secondary;
    border-color: brandColors.borders.hover;  // Use theme color
    color: brandColors.text.primary;  // Maintain high contrast
  }
  &.active {
    border-color: brandColors.primary;
    color: brandColors.primary;
    background: brandColors.backgrounds.selected;  // Add background for active state
  }
`;

const FilterPopover = styled(Paper)`
  padding: 1.5rem;
  min-width: 300px;
  max-width: 400px;
`;

const MapContainer = styled.div`
  height: 70vh;
  background: linear-gradient(135deg, #eeeeee 0%, #eeeeee 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: brandColors.backgrounds.primary;
  font-size: 1.2rem;
  position: relative;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);  // Increased opacity for better contrast
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: brandColors.text.primary;  // High contrast text
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // Added shadow for better visibility
`;

const PropertiesContainer = styled.div`
  padding: 2rem;
  background: brandColors.backgrounds.primary;
`;

const PropertyCard = styled(Card)`
  height: 100%;
  transition: all 0.2s ease;
  width: 100%;
  min-height: 200px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: colorUtils.shadow('0, 0, 0', 0.15, 12, 4);
  }
  
  @media (max-width: 768px) {
    min-height: 250px;
  }
`;

const PropertyImage = styled.div`
  height: 200px;
  background:
    linear-gradient(45deg, #eeeeee 25%, transparent 25%),
    linear-gradient(-45deg, #eeeeee 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #eeeeee 75%),
    linear-gradient(-45deg, transparent 75%, #eeeeee 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: brandColors.neutral[800];
  font-size: 0.9rem;
`;

const BuyPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter states
  const [propertyStatus, setPropertyStatus] = useState("for-sale");
  const [priceType, setPriceType] = useState("list-price");
  const [minPrice, setMinPrice] = useState("no-min");
  const [maxPrice, setMaxPrice] = useState("no-max");
  const [minBeds, setMinBeds] = useState("any");
  const [minBaths, setMinBaths] = useState("any");
  const [homeTypes, setHomeTypes] = useState([
    "houses",
    "townhomes",
    "multi-family",
    "condos",
    "lots",
    "apartments",
    "manufactured",
  ]);
  const [listingTypes, setListingTypes] = useState([
    "owner-posted",
    "agent-listed",
    "new-construction",
    "foreclosures",
    "auctions",
  ]);
  const [maxHoa, setMaxHoa] = useState("any");
  const [propertyStatuses, setPropertyStatuses] = useState(["coming-soon"]);
  const [parkingSpots, setParkingSpots] = useState("any");
  const [minSqft, setMinSqft] = useState("no-min");
  const [maxSqft, setMaxSqft] = useState("no-max");
  const [minLotSize, setMinLotSize] = useState("no-min");
  const [maxLotSize, setMaxLotSize] = useState("no-max");
  const [yearBuiltMin, setYearBuiltMin] = useState("");
  const [yearBuiltMax, setYearBuiltMax] = useState("");
  const [hasBasement, setHasBasement] = useState(false);
  const [singleStoryOnly, setSingleStoryOnly] = useState(false);
  const [fiftyFivePlus, setFiftyFivePlus] = useState("include");
  const [hasAC, setHasAC] = useState(false);
  const [hasPool, setHasPool] = useState(false);
  const [waterfront, setWaterfront] = useState(false);
  const [daysOnZillow, setDaysOnZillow] = useState("any");
  const [keywords, setKeywords] = useState("");

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handlePropertyClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  const handleFilterClick = (
    filterName: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setActiveFilter(null);
    setAnchorEl(null);
  };

  // Map properties with coordinates aligned to San Francisco neighborhoods
  const mapProperties = [
    // Marina District / Presidio area
    { id: 1, price: "12.5M", x: 15, y: 20, specialLabels: ["3D TOUR"] },
    { id: 2, price: "10.00M", x: 20, y: 25, specialLabels: ["SHOWCASE"] },
    
    // Pacific Heights / Nob Hill
    { id: 3, price: "5.70M", x: 35, y: 30, specialLabels: ["NEW"] },
    { id: 4, price: "2.49M", x: 40, y: 35, specialLabels: [] },
    
    // Union Square / Financial District
    { id: 5, price: "1.80M", x: 55, y: 40, specialLabels: [] },
    { id: 6, price: "3.20M", x: 60, y: 35, specialLabels: ["3D TOUR"] },
    
    // Mission District
    { id: 7, price: "3.89M", x: 45, y: 55, specialLabels: [] },
    { id: 8, price: "3.00M", x: 50, y: 60, specialLabels: ["SHOWCASE"] },
    
    // Haight-Ashbury / Castro
    { id: 9, price: "2.15M", x: 35, y: 50, specialLabels: [] },
    { id: 10, price: "3.50M", x: 40, y: 45, specialLabels: ["NEW"] },
    
    // Richmond District
    { id: 11, price: "3.59M", x: 25, y: 40, specialLabels: [] },
    { id: 12, price: "3.40M", x: 30, y: 45, specialLabels: [] },
    
    // Sunset District
    { id: 13, price: "1.85M", x: 20, y: 60, specialLabels: [] },
    { id: 14, price: "1.05M", x: 25, y: 65, specialLabels: [] },
    
    // Dogpatch / Bay Area
    { id: 15, price: "1.58M", x: 65, y: 55, specialLabels: [] },
    { id: 16, price: "1.60M", x: 70, y: 50, specialLabels: [] },
    { id: 17, price: "1.50M", x: 75, y: 45, specialLabels: [] },
  ];

  // Use realtor data hook
  const { 
    properties: realtorProperties, 
    loading, 
    error, 
    total, 
    searchProperties 
  } = useRealtorData();

  // Load initial data
  useEffect(() => {
    const searchParams: RealtorSearchParams = {
      location: "San Francisco, CA",
      listing_type: "for_sale",
      limit: 20
    };
    searchProperties(searchParams);
  }, [searchProperties]);

  const properties = [
    {
      id: 1,
      price: "$1,876,000",
      address: "153 Silliman St, San Francisco, CA 94134",
      beds: 5,
      baths: 3,
      sqft: 1850,
      type: "Foreclosure",
      daysOnMarket: 49,
      image: "P1",
    },
    {
      id: 2,
      price: "$2,150,000",
      address: "275 Teddy Ave, San Francisco, CA 94134",
      beds: 3,
      baths: 2,
      sqft: 1168,
      type: "House for sale",
      priceCut: "$50,000",
      image: "P2",
    },
    {
      id: 3,
      price: "$2,450,000",
      address: "76 Bay View St, San Francisco, CA 94124",
      beds: 2,
      baths: 1,
      sqft: 1515,
      type: "House for sale",
      openHouse: "Sat 2-4pm",
      image: "P3",
    },
    {
      id: 4,
      price: "$1,950,000",
      address: "444 Ellington Ave, San Francisco, CA 94112",
      beds: 2,
      baths: 1,
      sqft: 1275,
      type: "House for sale",
      flexible: true,
      image: "P4",
    },
    {
      id: 5,
      price: "$2,750,000",
      address: "123 Marina Blvd, San Francisco, CA 94123",
      beds: 3,
      baths: 2,
      sqft: 1650,
      type: "Condo for sale",
      daysOnMarket: 12,
      image: "P5",
    },
    {
      id: 6,
      price: "$3,200,000",
      address: "456 Pacific Heights, San Francisco, CA 94115",
      beds: 4,
      baths: 3,
      sqft: 2200,
      type: "House for sale",
      priceCut: "$75,000",
      image: "P6",
    },
    {
      id: 7,
      price: "$1,876,000",
      address: "789 Mission Bay, San Francisco, CA 94158",
      beds: 2,
      baths: 2,
      sqft: 1100,
      type: "Condo for sale",
      daysOnMarket: 8,
      image: "P7",
    },
    {
      id: 8,
      price: "$3,950,000",
      address: "321 Presidio Heights, San Francisco, CA 94118",
      beds: 5,
      baths: 4,
      sqft: 2800,
      type: "House for sale",
      openHouse: "Sun 1-3pm",
      image: "P8",
    },
    {
      id: 9,
      price: "$2,100,000",
      address: "654 Noe Valley, San Francisco, CA 94114",
      beds: 3,
      baths: 2,
      sqft: 1400,
      type: "House for sale",
      daysOnMarket: 23,
      image: "P9",
    },
    {
      id: 10,
      price: "$2,350,000",
      address: "987 Castro District, San Francisco, CA 94114",
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: "Condo for sale",
      priceCut: "$25,000",
      image: "P10",
    },
    {
      id: 11,
      price: "$3,000,000",
      address: "147 Russian Hill, San Francisco, CA 94109",
      beds: 3,
      baths: 2,
      sqft: 1800,
      type: "House for sale",
      daysOnMarket: 15,
      image: "P11",
    },
    {
      id: 12,
      price: "$1,876,000",
      address: "258 Hayes Valley, San Francisco, CA 94102",
      beds: 2,
      baths: 1,
      sqft: 950,
      type: "Condo for sale",
      flexible: true,
      image: "P12",
    },
    {
      id: 13,
      price: "$3,650,000",
      address: "369 Nob Hill, San Francisco, CA 94108",
      beds: 4,
      baths: 3,
      sqft: 2400,
      type: "House for sale",
      openHouse: "Sat 11am-1pm",
      image: "P13",
    },
    {
      id: 14,
      price: "$2,000,000",
      address: "741 Potrero Hill, San Francisco, CA 94110",
      beds: 3,
      baths: 2,
      sqft: 1350,
      type: "House for sale",
      daysOnMarket: 31,
      image: "P14",
    },
    {
      id: 15,
      price: "$2,800,000",
      address: "852 Bernal Heights, San Francisco, CA 94110",
      beds: 3,
      baths: 2,
      sqft: 1600,
      type: "House for sale",
      priceCut: "$40,000",
      image: "P15",
    },
  ];

  const renderFilterContent = () => {
    switch (activeFilter) {
      case "for-sale":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Property Status
            </Typography>
            <RadioGroup
              value={propertyStatus}
              onChange={(e) => setPropertyStatus(e.target.value)}
            >
              <FormControlLabel
                value="for-sale"
                control={<Radio />}
                label="For Sale"
              />

              <FormControlLabel value="sold" control={<Radio />} label="Sold" />
              <FormControlLabel
                value="coming-soon"
                control={<Radio />}
                label="Coming soon"
              />
            </RadioGroup>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "price":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Price Range
            </Typography>
            <Box sx={{ mb: 2 }}>
              <RadioGroup
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
              >
                <FormControlLabel
                  value="list-price"
                  control={<Radio />}
                  label="List Price"
                />
                <FormControlLabel
                  value="monthly-payment"
                  control={<Radio />}
                  label="Monthly Payment"
                />
              </RadioGroup>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Minimum</InputLabel>
                <Select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  label="Minimum"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="no-min">No Min</MenuItem>
                  <MenuItem value="50000">$50,000</MenuItem>
                  <MenuItem value="100000">$100,000</MenuItem>
                  <MenuItem value="150000">$150,000</MenuItem>
                  <MenuItem value="200000">$200,000</MenuItem>
                  <MenuItem value="250000">$250,000</MenuItem>
                  <MenuItem value="300000">$300,000</MenuItem>
                  <MenuItem value="400000">$400,000</MenuItem>
                  <MenuItem value="500000">$500,000</MenuItem>
                  <MenuItem value="600000">$600,000</MenuItem>
                  <MenuItem value="700000">$700,000</MenuItem>
                  <MenuItem value="800000">$800,000</MenuItem>
                  <MenuItem value="900000">$900,000</MenuItem>
                  <MenuItem value="1000000">$1,000,000</MenuItem>
                  <MenuItem value="14000000">$14M</MenuItem>
                  <MenuItem value="15000000">$15M</MenuItem>
                  <MenuItem value="16000000">$16M</MenuItem>
                  <MenuItem value="17000000">$17M</MenuItem>
                  <MenuItem value="18000000">$18M</MenuItem>
                </Select>
              </FormControl>
              <Typography sx={{ alignSelf: "center" }}>-</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Maximum</InputLabel>
                <Select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  label="Maximum"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="no-max">No Max</MenuItem>
                  <MenuItem value="50000">$50,000</MenuItem>
                  <MenuItem value="100000">$100,000</MenuItem>
                  <MenuItem value="150000">$150,000</MenuItem>
                  <MenuItem value="200000">$200,000</MenuItem>
                  <MenuItem value="250000">$250,000</MenuItem>
                  <MenuItem value="300000">$300,000</MenuItem>
                  <MenuItem value="400000">$400,000</MenuItem>
                  <MenuItem value="500000">$500,000</MenuItem>
                  <MenuItem value="600000">$600,000</MenuItem>
                  <MenuItem value="700000">$700,000</MenuItem>
                  <MenuItem value="800000">$800,000</MenuItem>
                  <MenuItem value="900000">$900,000</MenuItem>
                  <MenuItem value="1000000">$1,000,000</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {priceType === "monthly-payment" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                  Includes estimated principal and interest, mortgage insurance,
                  property taxes, home insurance and HOA fees.
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                  <InputLabel>Down Payment</InputLabel>
                  <Select value="no-down" label="Down Payment">
                    <MenuItem value="no-down">No Down Payment</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Credit Score</InputLabel>
                  <Select value="no-selection" label="Credit Score">
                    <MenuItem value="no-selection">No Selection</MenuItem>
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                    Save this monthly payment info to your Dreamery account.
                    (See our{" "}
                    <Link
                      href="#"
                      sx={{ color: brandColors.primary, textDecoration: "none" }}
                    >
                      privacy policy
                    </Link>
                    )
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: brandColors.primary,
                        backgroundColor: "rgba(26, 54, 93, 0.04)",
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "beds-baths":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Beds & Baths
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Bedrooms
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["Any", "1+", "2+", "3+", "4+", "5+"].map((bed) => (
                  <Button
                    key={bed}
                    variant={
                      minBeds === bed.toLowerCase().replace("+", "")
                        ? "contained"
                        : "outlined"
                    }
                    size="small"
                    onClick={() =>
                      setMinBeds(bed.toLowerCase().replace("+", ""))
                    }
                    sx={{ minWidth: "60px" }}
                  >
                    {bed}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Bathrooms
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["Any", "1+", "1.5+", "2+", "3+", "4+"].map((bath) => (
                  <Button
                    key={bath}
                    variant={
                      minBaths ===
                      bath.toLowerCase().replace("+", "").replace(".5", "5")
                        ? "contained"
                        : "outlined"
                    }
                    size="small"
                    onClick={() =>
                      setMinBaths(
                        bath.toLowerCase().replace("+", "").replace(".5", "5"),
                      )
                    }
                    sx={{ minWidth: "60px" }}
                  >
                    {bath}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "home-type":
        const allHomeTypes = [
          { value: "houses", label: "Houses" },
          { value: "townhomes", label: "Townhomes" },
          { value: "multi-family", label: "Multi-family" },
          { value: "condos", label: "Condos/Co-ops" },
          { value: "lots", label: "Lots/Land" },
          { value: "apartments", label: "Apartments" },
          { value: "manufactured", label: "Manufactured" },
        ];

        const handleSelectAll = () => {
          setHomeTypes(allHomeTypes.map(type => type.value));
        };

        const handleDeselectAll = () => {
          setHomeTypes([]);
        };

        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Home Type
            </Typography>

            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.5,
                }}
              >
                Select All
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleDeselectAll}
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.5,
                }}
              >
                Deselect All
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {allHomeTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    control={
                      <Checkbox
                        checked={homeTypes.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHomeTypes([...homeTypes, type.value]);
                          } else {
                            setHomeTypes(
                              homeTypes.filter((t) => t !== type.value),
                            );
                          }
                        }}
                      />
                    }
                    label={type.label}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "listing-type":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Listing Type
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { value: "owner-posted", label: "Owner posted" },
                { value: "agent-listed", label: "Agent listed" },
                { value: "new-construction", label: "New construction" },
              ].map((type) => (
                <FormControlLabel
                  key={type.value}
                  control={
                    <Checkbox
                      checked={listingTypes.includes(type.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setListingTypes([...listingTypes, type.value]);
                        } else {
                          setListingTypes(
                            listingTypes.filter((t) => t !== type.value),
                          );
                        }
                      }}
                    />
                  }
                  label={type.label}
                />
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "more":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              More Filters
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Max HOA
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={maxHoa}
                  onChange={(e) => setMaxHoa(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="no-hoa">No HOA Fee</MenuItem>
                  <MenuItem value="50">$50/month</MenuItem>
                  <MenuItem value="100">$100/month</MenuItem>
                  <MenuItem value="200">$200/month</MenuItem>
                  <MenuItem value="300">$300/month</MenuItem>
                  <MenuItem value="400">$400/month</MenuItem>
                  <MenuItem value="500">$500/month</MenuItem>
                  <MenuItem value="600">$600/month</MenuItem>
                  <MenuItem value="700">$700/month</MenuItem>
                  <MenuItem value="800">$800/month</MenuItem>
                  <MenuItem value="900">$900/month</MenuItem>
                  <MenuItem value="1000">$1000/month</MenuItem>
                  <MenuItem value="1500">$1500/month</MenuItem>
                  <MenuItem value="2000">$2000/month</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Parking spots
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={parkingSpots}
                  onChange={(e) => setParkingSpots(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="1">1+</MenuItem>
                  <MenuItem value="2">2+</MenuItem>
                  <MenuItem value="3">3+</MenuItem>
                  <MenuItem value="4">4+</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Square feet
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={minSqft}
                    onChange={(e) => setMinSqft(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="no-min">No Min</MenuItem>
                    <MenuItem value="500">500</MenuItem>
                    <MenuItem value="750">750</MenuItem>
                    <MenuItem value="1000">1,000</MenuItem>
                    <MenuItem value="1250">1,250</MenuItem>
                    <MenuItem value="1500">1,500</MenuItem>
                    <MenuItem value="1750">1,750</MenuItem>
                    <MenuItem value="2000">2,000</MenuItem>
                    <MenuItem value="2250">2,250</MenuItem>
                    <MenuItem value="2500">2,500</MenuItem>
                    <MenuItem value="2750">2,750</MenuItem>
                    <MenuItem value="3000">3,000</MenuItem>
                    <MenuItem value="3500">3,500</MenuItem>
                    <MenuItem value="4000">4,000</MenuItem>
                    <MenuItem value="5000">5,000</MenuItem>
                    <MenuItem value="7500">7,500</MenuItem>
                  </Select>
                </FormControl>
                <Typography sx={{ alignSelf: "center" }}>-</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={maxSqft}
                    onChange={(e) => setMaxSqft(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="no-max">No Max</MenuItem>
                    <MenuItem value="500">500</MenuItem>
                    <MenuItem value="750">750</MenuItem>
                    <MenuItem value="1000">1,000</MenuItem>
                    <MenuItem value="1250">1,250</MenuItem>
                    <MenuItem value="1500">1,500</MenuItem>
                    <MenuItem value="1750">1,750</MenuItem>
                    <MenuItem value="2000">2,000</MenuItem>
                    <MenuItem value="2250">2,250</MenuItem>
                    <MenuItem value="2500">2,500</MenuItem>
                    <MenuItem value="2750">2,750</MenuItem>
                    <MenuItem value="3000">3,000</MenuItem>
                    <MenuItem value="3500">3,500</MenuItem>
                    <MenuItem value="4000">4,000</MenuItem>
                    <MenuItem value="5000">5,000</MenuItem>
                    <MenuItem value="7500">7,500</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Lot size
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={minLotSize}
                    onChange={(e) => setMinLotSize(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="no-min">No Min</MenuItem>
                    <MenuItem value="1000">1,000 sqft</MenuItem>
                    <MenuItem value="2000">2,000 sqft</MenuItem>
                    <MenuItem value="3000">3,000 sqft</MenuItem>
                    <MenuItem value="4000">4,000 sqft</MenuItem>
                    <MenuItem value="5000">5,000 sqft</MenuItem>
                    <MenuItem value="7500">7,500 sqft</MenuItem>
                    <MenuItem value="10890">1/4 acre/10,890 sqft</MenuItem>
                    <MenuItem value="21780">1/2 acre</MenuItem>
                    <MenuItem value="43560">1 acre</MenuItem>
                    <MenuItem value="87120">2 acres</MenuItem>
                    <MenuItem value="217800">5 acres</MenuItem>
                    <MenuItem value="435600">10 acres</MenuItem>
                    <MenuItem value="871200">20 acres</MenuItem>
                    <MenuItem value="2178000">50 acres</MenuItem>
                    <MenuItem value="4356000">100 acres</MenuItem>
                  </Select>
                </FormControl>
                <Typography sx={{ alignSelf: "center" }}>-</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={maxLotSize}
                    onChange={(e) => setMaxLotSize(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="no-max">No Max</MenuItem>
                    <MenuItem value="1000">1,000 sqft</MenuItem>
                    <MenuItem value="2000">2,000 sqft</MenuItem>
                    <MenuItem value="3000">3,000 sqft</MenuItem>
                    <MenuItem value="4000">4,000 sqft</MenuItem>
                    <MenuItem value="5000">5,000 sqft</MenuItem>
                    <MenuItem value="7500">7,500 sqft</MenuItem>
                    <MenuItem value="10890">1/4 acre/10,890 sqft</MenuItem>
                    <MenuItem value="21780">1/2 acre</MenuItem>
                    <MenuItem value="43560">1 acre</MenuItem>
                    <MenuItem value="87120">2 acres</MenuItem>
                    <MenuItem value="217800">5 acres</MenuItem>
                    <MenuItem value="435600">10 acres</MenuItem>
                    <MenuItem value="871200">20 acres</MenuItem>
                    <MenuItem value="2178000">50 acres</MenuItem>
                    <MenuItem value="4356000">100 acres</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Year built
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="No Min"
                  value={yearBuiltMin}
                  onChange={(e) => setYearBuiltMin(e.target.value)}
                  fullWidth
                />
                <Typography sx={{ alignSelf: "center" }}>-</Typography>
                <TextField
                  size="small"
                  placeholder="No Max"
                  value={yearBuiltMax}
                  onChange={(e) => setYearBuiltMax(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                55+ Communities
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={fiftyFivePlus}
                  onChange={(e) => setFiftyFivePlus(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="include">Include</MenuItem>
                  <MenuItem value="dont-show">Don't show</MenuItem>
                  <MenuItem value="only-show">Only show</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Days on Dreamery
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={daysOnZillow}
                  onChange={(e) => setDaysOnZillow(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="1">1 day</MenuItem>
                  <MenuItem value="7">7 days</MenuItem>
                  <MenuItem value="14">14 days</MenuItem>
                  <MenuItem value="30">30 days</MenuItem>
                  <MenuItem value="90">90 days</MenuItem>
                  <MenuItem value="180">6 months</MenuItem>
                  <MenuItem value="365">12 months</MenuItem>
                  <MenuItem value="730">24 months</MenuItem>
                  <MenuItem value="1095">36 months</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Keywords
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="MLS #, yard, etc."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="text"
                onClick={handleCloseFilter}
                sx={{ flex: 1 }}
              >
                Reset all filters
              </Button>
              <Button
                variant="contained"
                onClick={handleCloseFilter}
                sx={{ flex: 1 }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

    return (
    <PageContainer>
      <PageAppBar title="Dreamery Marketplace" />
      <HeaderSection>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
              San Francisco, CA Real Estate & Homes For Sale
            </Typography>
            <MarketplaceModeToggle />
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, justifyContent: 'space-between' }}>
            <TextField
              placeholder="San Francisco, CA"
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                      <LazySearchIcon />
                    </React.Suspense>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                        <LazyClearIcon />
                      </React.Suspense>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" sx={{ bgcolor: brandColors.primary }}>
              Save search
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid brandColors.borders.secondary",
                borderRadius: "6px",
                padding: "6px 12px",
                backgroundColor: brandColors.backgrounds.secondary,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: brandColors.neutral[100],
                  borderColor: brandColors.neutral[300],
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: brandColors.text.primary }}
              >
                500
              </Typography>
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyFavoriteIcon sx={{ color: brandColors.accent.error, fontSize: 20 }} />
              </React.Suspense>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <FilterButton
              onClick={(e) => handleFilterClick("for-sale", e)}
              className={activeFilter === "for-sale" ? "active" : ""}
              endIcon={
                activeFilter === "for-sale" ? (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowUpIcon />
                  </React.Suspense>
                ) : (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowDownIcon />
                  </React.Suspense>
                )
              }
            >
              Property Status
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick("price", e)}
              className={activeFilter === "price" ? "active" : ""}
              endIcon={
                activeFilter === "price" ? (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowUpIcon />
                  </React.Suspense>
                ) : (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowDownIcon />
                  </React.Suspense>
                )
              }
            >
              Price
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick("beds-baths", e)}
              className={activeFilter === "beds-baths" ? "active" : ""}
              endIcon={
                activeFilter === "beds-baths" ? (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowUpIcon />
                  </React.Suspense>
                ) : (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowDownIcon />
                  </React.Suspense>
                )
              }
            >
              Beds & Baths
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick("home-type", e)}
              className={activeFilter === "home-type" ? "active" : ""}
              endIcon={
                activeFilter === "home-type" ? (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowUpIcon />
                  </React.Suspense>
                ) : (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowDownIcon />
                  </React.Suspense>
                )
              }
            >
              Home Type
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick("listing-type", e)}
              className={activeFilter === "listing-type" ? "active" : ""}
              endIcon={
                activeFilter === "listing-type" ? (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowUpIcon />
                  </React.Suspense>
                ) : (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowDownIcon />
                  </React.Suspense>
                )
              }
            >
              Listing Type
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick("more", e)}
              className={activeFilter === "more" ? "active" : ""}
              endIcon={
                activeFilter === "more" ? (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowUpIcon />
                  </React.Suspense>
                ) : (
                  <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                    <LazyKeyboardArrowDownIcon />
                  </React.Suspense>
                )
              }
            >
              More
            </FilterButton>
          </Box>
        </Container>
      </HeaderSection>

      <Popover
        open={Boolean(activeFilter)}
        anchorEl={anchorEl}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <FilterPopover>{renderFilterContent()}</FilterPopover>
      </Popover>

      <Box sx={{ 
        display: "flex", 
        height: "calc(100vh - 200px)",
        "@media (max-width: 768px)": {
          flexDirection: "column",
          height: "auto",
          minHeight: "calc(100vh - 200px)"
        }
      }}>
        <Box sx={{ 
          flex: "2", 
          position: "relative", 
          p: 2,
          "@media (max-width: 768px)": {
            flex: "none",
            height: "300px",
            p: 1
          }
        }}>
          <AppleMapsComponent 
            properties={realtorProperties.map(prop => ({
              id: parseInt(prop.property_id) || Math.random(),
              price: prop.list_price ? `$${(prop.list_price / 1000000).toFixed(1)}M` : 'N/A',
              x: prop.coordinates?.lng ? (prop.coordinates.lng + 122.4) * 100 : Math.random() * 100,
              y: prop.coordinates?.lat ? (prop.coordinates.lat - 37.7) * 100 : Math.random() * 100,
              specialLabels: [],
              coordinates: prop.coordinates || {
                lat: 37.7749 + (Math.random() - 0.5) * 0.1,
                lng: -122.4194 + (Math.random() - 0.5) * 0.1
              }
            }))}
            onPropertyClick={(property) => {
              console.log('Property clicked:', property);
              // Find the corresponding realtor property and open modal
              const realtorProperty = realtorProperties.find(prop => 
                prop.property_id === property.id.toString()
              );
              if (realtorProperty) {
                handlePropertyClick(realtorProperty);
              }
            }}
          />
        </Box>

        <Box
          sx={{ 
            flex: "1", 
            overflowY: "auto", 
            borderLeft: "1px solid brandColors.borders.secondary",
            maxHeight: "calc(100vh - 200px)",
            "@media (max-width: 768px)": {
              flex: "none",
              borderLeft: "none",
              borderTop: "1px solid brandColors.borders.secondary",
              maxHeight: "60vh"
            },
            /* Custom scrollbar styling */
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "3px",
              margin: "8px 12px 8px 0",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "3px",
              margin: "2px 4px 2px 0",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#a8a8a8",
            },
          }}
        >
          <Container maxWidth="xl" sx={{ p: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                1,095 results
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort</InputLabel>
                <Select value="homes-for-you" label="Sort">
                  <MenuItem value="homes-for-you">Homes for You</MenuItem>
                  <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                  <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: { xs: 1.5, md: 2 },
              pb: 2
            }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {!loading && !error && realtorProperties.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No properties found. Try adjusting your search criteria.
                </Alert>
              )}
              {!loading && realtorProperties.map((property) => (
                <Box
                  key={property.property_id}
                  onClick={() => handlePropertyClick(property)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover .property-card': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <PropertyCard 
                    className="property-card"
                    sx={{ 
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                  <Box sx={{ 
                    display: "flex",
                    "@media (max-width: 600px)": {
                      flexDirection: "column"
                    }
                  }}>
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "200px" },
                        height: "100%",
                        minHeight: { xs: "200px", sm: "180px" },
                        flexShrink: 0,
                        background: brandColors.neutral[100],
                        backgroundImage: property.photos && property.photos.length > 0 
                          ? `url(${property.photos[0].href})` 
                          : `url(/P1.jpg)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        "@media (max-width: 600px)": {
                          height: "200px",
                          width: "100%"
                        }
                      }}
                    />
                    <CardContent sx={{ 
                      p: { xs: 1.5, md: 2 }, 
                      flex: 1,
                      minWidth: 0
                    }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ 
                            fontWeight: 700, 
                            color: brandColors.primary,
                            fontSize: { xs: "1.1rem", md: "1.25rem" }
                          }}
                        >
                          {property.list_price ? `$${property.list_price.toLocaleString()}` : 'Price not available'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.property_id);
                          }}
                          sx={{
                            color: favorites.has(property.property_id)
                              ? brandColors.accent.error
                              : brandColors.neutral[400],
                          }}
                        >
                          {favorites.has(property.property_id) ? (
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                              <LazyFavoriteIcon />
                            </React.Suspense>
                          ) : (
                            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                              <LazyFavoriteBorderIcon />
                            </React.Suspense>
                          )}
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {property.days_on_mls && (
                          <Chip
                            label={`${property.days_on_mls} days on MLS`}
                            size="small"
                            color="primary"
                          />
                        )}
                        {property.flags?.is_price_reduced && (
                          <Chip
                            label="Price reduced"
                            size="small"
                            color="secondary"
                          />
                        )}
                        {property.open_houses && property.open_houses.length > 0 && (
                          <Chip
                            label={`Open: ${property.open_houses[0].start_date || 'Check listing'}`}
                            size="small"
                            color="success"
                          />
                        )}
                        {property.flags?.is_new_construction && (
                          <Chip
                            label="New construction"
                            size="small"
                            color="info"
                          />
                        )}
                      </Box>

                      <Typography variant="body2" sx={{ 
                        mb: 1, 
                        color: brandColors.neutral[800],
                        fontSize: { xs: "0.875rem", md: "0.875rem" }
                      }}>
                        {property.description?.beds || 0} bds | {property.description?.baths_full || 0} ba |{" "}
                        {property.description?.sqft ? property.description.sqft.toLocaleString() : 'N/A'} sqft - {property.description?.type || 'Property'}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ 
                          color: brandColors.text.primary, 
                          fontWeight: 500,
                          fontSize: { xs: "0.875rem", md: "0.875rem" },
                          wordBreak: "break-word"
                        }}
                      >
                        {property.address?.formatted_address || property.address?.full_line || 'Address not available'}
                      </Typography>

                      <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          href="http://localhost:3000/underwrite"
                          sx={{
                            borderColor: brandColors.primary,
                            color: brandColors.primary,
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.25,
                            borderRadius: "4px",
                            minWidth: "auto",
                            height: "28px",
                            "&:hover": {
                              backgroundColor: brandColors.primary,
                              color: brandColors.backgrounds.primary,
                              borderColor: brandColors.primary,
                            },
                          }}
                        >
                          Underwrite
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </PropertyCard>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
        onFavorite={toggleFavorite}
        favorites={favorites}
      />
      
      
    </PageContainer>
  );
};

export default BuyPage;
