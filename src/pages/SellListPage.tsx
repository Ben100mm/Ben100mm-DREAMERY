import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
  Grid,
  Divider,
} from "@mui/material";
import {
  Search,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Clear,
  Home,
  Business,
  Person,
  Description,
  PhotoCamera,
  LocationOn,
  AttachMoney,
  Schedule,
} from "@mui/icons-material";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const FilterButton = styled(Button)`
  text-transform: none;
  color: #333;
  border: 1px solid #e0e0e0;
  background: white;
  padding: 8px 16px;
  min-width: 120px;
  &:hover {
    background: #f8f9fa;
    border-color: #c0c0c0;
  }
  &.active {
    border-color: #1a365d;
    color: #1a365d;
  }
`;

const FilterPopover = styled(Paper)`
  padding: 1.5rem;
  min-width: 300px;
  max-width: 400px;
`;

const ServiceCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
    border-color: #1a365d;
  }
  &.selected {
    border-color: #1a365d;
    background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  }
`;

const SellListPage: React.FC = () => {
  const location = useLocation();
  const address = location.state?.address || "";

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");

  // Filter states
  const [propertyType, setPropertyType] = useState("residential");
  const [listingType, setListingType] = useState("for-sale");
  const [propertyStatus, setPropertyStatus] = useState("active");
  const [priceRange, setPriceRange] = useState("any");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [urgency, setUrgency] = useState("standard");

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

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const services = [
    {
      id: "sell-home",
      title: "Sell Your Home",
      description: "List your property for sale with professional marketing",
      icon: <Home sx={{ fontSize: 40, color: "#1a365d" }} />,
      features: [
        "Professional photography",
        "Virtual tours",
        "Marketing materials",
        "Open house coordination",
        "Negotiation support",
      ],
      price: "2.5% commission",
      estimatedTime: "30-90 days",
    },
    {
      id: "list-rental",
      title: "List Your Rental",
      description: "Find quality tenants for your rental property",
      icon: <Business sx={{ fontSize: 40, color: "#1a365d" }} />,
      features: [
        "Tenant screening",
        "Property marketing",
        "Lease preparation",
        "Background checks",
        "Rent collection setup",
      ],
      price: "1 month rent",
      estimatedTime: "7-21 days",
    },
    {
      id: "agent-services",
      title: "Agent Services",
      description: "Professional real estate agent assistance",
      icon: <Person sx={{ fontSize: 40, color: "#1a365d" }} />,
      features: [
        "Market analysis",
        "Pricing strategy",
        "Property staging",
        "Legal guidance",
        "Closing coordination",
      ],
      price: "3% commission",
      estimatedTime: "45-120 days",
    },
    {
      id: "property-management",
      title: "Property Management",
      description: "Complete property management services",
      icon: <Description sx={{ fontSize: 40, color: "#1a365d" }} />,
      features: [
        "Rent collection",
        "Maintenance coordination",
        "Tenant relations",
        "Financial reporting",
        "24/7 support",
      ],
      price: "8-12% monthly",
      estimatedTime: "Ongoing service",
    },
  ];

  const renderFilterContent = () => {
    switch (activeFilter) {
      case "property-type":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Property Type
            </Typography>
            <RadioGroup
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <FormControlLabel
                value="residential"
                control={<Radio />}
                label="Residential"
              />
              <FormControlLabel
                value="commercial"
                control={<Radio />}
                label="Commercial"
              />
              <FormControlLabel
                value="land"
                control={<Radio />}
                label="Land/Lot"
              />
              <FormControlLabel
                value="investment"
                control={<Radio />}
                label="Investment Property"
              />
            </RadioGroup>
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
            <RadioGroup
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
            >
              <FormControlLabel
                value="for-sale"
                control={<Radio />}
                label="For Sale"
              />
              <FormControlLabel
                value="for-rent"
                control={<Radio />}
                label="For Rent"
              />
              <FormControlLabel
                value="auction"
                control={<Radio />}
                label="Auction"
              />
              <FormControlLabel
                value="fsbo"
                control={<Radio />}
                label="For Sale by Owner"
              />
            </RadioGroup>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "property-status":
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
                value="active"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel value="sold" control={<Radio />} label="Sold" />
              <FormControlLabel
                value="expired"
                control={<Radio />}
                label="Expired"
              />
            </RadioGroup>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "price-range":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Price Range
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                <MenuItem value="any">Any Price</MenuItem>
                <MenuItem value="under-100k">Under $100,000</MenuItem>
                <MenuItem value="100k-200k">$100,000 - $200,000</MenuItem>
                <MenuItem value="200k-300k">$200,000 - $300,000</MenuItem>
                <MenuItem value="300k-500k">$300,000 - $500,000</MenuItem>
                <MenuItem value="500k-750k">$500,000 - $750,000</MenuItem>
                <MenuItem value="750k-1m">$750,000 - $1,000,000</MenuItem>
                <MenuItem value="over-1m">Over $1,000,000</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case "urgency":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Urgency Level
            </Typography>
            <RadioGroup
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label="Standard (30-90 days)"
              />
              <FormControlLabel
                value="quick"
                control={<Radio />}
                label="Quick Sale (15-30 days)"
              />
              <FormControlLabel
                value="urgent"
                control={<Radio />}
                label="Urgent (7-15 days)"
              />
              <FormControlLabel
                value="asap"
                control={<Radio />}
                label="ASAP (3-7 days)"
              />
            </RadioGroup>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
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
      {/* Top Search Section */}
      <Box
        sx={{
          background: "white",
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{ color: "#666", textTransform: "none" }}
            >
              Back
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a365d" }}>
              Sell / List Your Property
            </Typography>
            {address && (
              <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                Property: {address}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1, position: "relative" }}>
              <TextField
                fullWidth
                placeholder={address || "Enter your property address"}
                value={address}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <Clear sx={{ color: "#666" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1a365d",
                color: "white",
                textTransform: "uppercase",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#0d2340",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      <HeaderSection>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FilterButton
              onClick={(e) => handleFilterClick("property-type", e)}
              className={activeFilter === "property-type" ? "active" : ""}
              endIcon={
                activeFilter === "property-type" ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )
              }
            >
              Property Type
            </FilterButton>

            <FilterButton
              onClick={(e) => handleFilterClick("listing-type", e)}
              className={activeFilter === "listing-type" ? "active" : ""}
              endIcon={
                activeFilter === "listing-type" ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )
              }
            >
              Listing Type
            </FilterButton>

            <FilterButton
              onClick={(e) => handleFilterClick("property-status", e)}
              className={activeFilter === "property-status" ? "active" : ""}
              endIcon={
                activeFilter === "property-status" ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )
              }
            >
              Property Status
            </FilterButton>

            <FilterButton
              onClick={(e) => handleFilterClick("price-range", e)}
              className={activeFilter === "price-range" ? "active" : ""}
              endIcon={
                activeFilter === "price-range" ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )
              }
            >
              Price Range
            </FilterButton>

            <FilterButton
              onClick={(e) => handleFilterClick("urgency", e)}
              className={activeFilter === "urgency" ? "active" : ""}
              endIcon={
                activeFilter === "urgency" ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )
              }
            >
              Urgency
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1a365d", mb: 2 }}
          >
            Choose Your Service
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
            Select the service that best fits your needs. Our professionals will
            help you get the best value for your property.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {services.map((service) => (
            <Box key={service.id}>
              <ServiceCard
                className={selectedService === service.id ? "selected" : ""}
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#1a365d" }}
                  >
                    {service.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                    {service.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "#1a365d" }}
                    >
                      What's included:
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {service.features.map((feature, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{ color: "#666", mb: 0.5 }}
                        >
                          - {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#1a365d" }}
                      >
                        {service.price}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {service.estimatedTime}
                      </Typography>
                    </Box>

                    <Button
                      variant={
                        selectedService === service.id
                          ? "contained"
                          : "outlined"
                      }
                      size="small"
                      sx={{
                        backgroundColor:
                          selectedService === service.id
                            ? "#1a365d"
                            : "transparent",
                        color:
                          selectedService === service.id ? "white" : "#1a365d",
                        borderColor: "#1a365d",
                        "&:hover": {
                          backgroundColor:
                            selectedService === service.id
                              ? "#0d2340"
                              : "#f8f9fa",
                        },
                      }}
                    >
                      {selectedService === service.id ? "Selected" : "Select"}
                    </Button>
                  </Box>
                </CardContent>
              </ServiceCard>
            </Box>
          ))}
        </Box>

        {selectedService && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1a365d", mb: 2 }}
            >
              Next Steps
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#1a365d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Property Assessment
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#666", ml: 6 }}>
                  Schedule a free property evaluation with our experts
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#1a365d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Marketing Strategy
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#666", ml: 6 }}>
                  Professional photography and marketing materials
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#1a365d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    3
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Listing & Showings
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#666", ml: 6 }}>
                  Property listed and showings coordinated
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#1a365d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    4
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Closing Support
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#666", ml: 6 }}>
                  Negotiation and closing coordination
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#1a365d",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#0d2340",
                  },
                }}
              >
                Schedule Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#1a365d",
                  color: "#1a365d",
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#0d2340",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </PageContainer>
  );
};

export default SellListPage;
