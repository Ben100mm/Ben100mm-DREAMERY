import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { brandColors } from "../theme";
import { PageAppBar } from "../components/Header";
import { 
  Box,
  Container,
  Typography, 
  Button, 
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Popover,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Slider,
} from "@mui/material";
import { Search, Clear, KeyboardArrowDown, KeyboardArrowUp, Favorite } from "@mui/icons-material";

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
  color: brandColors.text.primary;
  border: 1px solid brandColors.borders.secondary;
  background: brandColors.backgrounds.primary;
  padding: 8px 16px;
  min-width: 120px;
  &:hover {
    background: brandColors.backgrounds.secondary;
    border-color: #c0c0c0;
  }
  &.active {
    border-color: brandColors.primary;
    color: brandColors.primary;
  }
`;

const FilterPopover = styled(Paper)`
  padding: 1.5rem;
  min-width: 300px;
  max-width: 400px;
`;

const MapContainer = styled.div`
  height: 70vh;
  background: linear-gradient(135deg, #d3d3d3 0%, #d3d3d3 100%);
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
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: brandColors.text.primary;
  font-weight: 600;
`;

const ResultsContainer = styled.div`
  padding: 2rem;
  background: brandColors.backgrounds.primary;
`;

const PartnerCard = styled(Card)`
  height: 100%;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PartnersPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Search and filter state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("any");
  const [experienceLevel, setExperienceLevel] = useState<string>("any");
  const [availability, setAvailability] = useState<string>("any");
  const [certifications, setCertifications] = useState<string>("any");
  const [projectSizeRange, setProjectSizeRange] = useState<[number, number]>([0, 500000]);
  const [responseTime, setResponseTime] = useState<string>("any");
  const [minRating, setMinRating] = useState<number>(0);
  const [language, setLanguage] = useState<string>("any");

  // Data
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5055/api/partners`);
        const json = await res.json();
        setPartners(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load partners", e);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const lc = (s: string) => (s || "").toLowerCase();
    return partners.filter((p) => {
      const text = lc([
        p.company,
        p.bio,
        (p.services || []).join(","),
        (p.languages || []).join(","),
        [p.user?.firstName, p.user?.lastName].filter(Boolean).join(" "),
      ].join(" "));
      const roleOk = role === "any" ? true : text.includes(lc(role));
      const experienceOk = experienceLevel === "any" ? true : true; // TODO: Add experience level to partner data
      const availabilityOk = availability === "any" ? true : true; // TODO: Add availability to partner data
      const certificationsOk = certifications === "any" ? true : true; // TODO: Add certifications to partner data
      const projectSizeOk = true; // TODO: Add project size to partner data - will filter by range when implemented
      const responseTimeOk = responseTime === "any" ? true : true; // TODO: Add response time to partner data
      const langOk = language === "any" ? true : text.includes(lc(language));
      const ratingOk = (typeof p.rating === "number" ? p.rating : 0) >= minRating;
      const searchOk = search ? text.includes(lc(search)) : true;
      return roleOk && experienceOk && availabilityOk && certificationsOk && projectSizeOk && responseTimeOk && langOk && ratingOk && searchOk;
    });
      }, [partners, role, experienceLevel, availability, certifications, projectSizeRange, responseTime, language, minRating, search]);

  const handleOpen = (evt: React.MouseEvent<HTMLElement>, key: string) => {
    setAnchorEl(evt.currentTarget);
    setActiveFilter(key);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveFilter(null);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Only close if we're actually leaving the popover area
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && !e.currentTarget.contains(relatedTarget)) {
      // Small delay to prevent accidental closing during scrolling
      setTimeout(() => {
        if (!e.currentTarget.contains(document.activeElement)) {
          handleClose();
        }
      }, 150);
    }
  };

  return (
    <PageContainer>
      <PageAppBar title="Dreamery – Partners" />
      <HeaderSection>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary }}>
              San Francisco, CA Partners & Services
                        </Typography>
                      </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <TextField
              placeholder="San Francisco, CA"
                        size="small"
              sx={{ flexGrow: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}> 
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" sx={{ bgcolor: brandColors.primary }}>Save search</Button>
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
                "&:hover": { backgroundColor: "#e9ecef", borderColor: "#c0c0c0" },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text.primary }}>500</Typography>
              <Favorite sx={{ color: "#e31c25", fontSize: 20 }} />
            </Box>
                    </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <FilterButton onClick={(e) => handleOpen(e, "role")} className={activeFilter === "role" ? "active" : ""} endIcon={activeFilter === "role" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Partners & Services</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "experience")} className={activeFilter === "experience" ? "active" : ""} endIcon={activeFilter === "experience" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Experience</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "availability")} className={activeFilter === "availability" ? "active" : ""} endIcon={activeFilter === "availability" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Availability</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "certifications")} className={activeFilter === "certifications" ? "active" : ""} endIcon={activeFilter === "certifications" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Certifications</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "projectSize")} className={activeFilter === "projectSize" ? "active" : ""} endIcon={activeFilter === "projectSize" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Project Size</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "responseTime")} className={activeFilter === "responseTime" ? "active" : ""} endIcon={activeFilter === "responseTime" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Response Time</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "rating")} className={activeFilter === "rating" ? "active" : ""} endIcon={activeFilter === "rating" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Ratings</FilterButton>
            <FilterButton onClick={(e) => handleOpen(e, "language")} className={activeFilter === "language" ? "active" : ""} endIcon={activeFilter === "language" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>Language</FilterButton>
                    </Box>
        </Container>
      </HeaderSection>

      <Container maxWidth="xl">
        <Box sx={{ display: "flex", height: "calc(100vh - 200px)" }}>
          <Box sx={{ flex: 2, position: "relative", p: 2 }}>
            <Box
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #d3d3d3 0%, #d3d3d3 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: brandColors.backgrounds.primary,
                fontSize: "1.2rem",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  background: "rgba(255, 255, 255, 0.9)",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  color: brandColors.text.primary,
                  fontWeight: 600,
                }}
              >
                {filtered.length} of {partners.length || 0} partners
              </Box>
              Interactive Map View
            </Box>
          </Box>
          <Box sx={{ flex: 1, pl: 0 }}>
            <ResultsContainer>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">{filtered.length} results</Typography>
                <FormControl size="small">
                  <InputLabel id="sort-label">Sort</InputLabel>
                  <Select labelId="sort-label" label="Sort" value="relevance" onChange={() => void 0} sx={{ minWidth: 160 }}>
                    <MenuItem value="relevance">Partners for You</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="reviews">Most Reviewed</MenuItem>
                  </Select>
                </FormControl>
                    </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                {filtered.map((p) => (
                  <PartnerCard key={p.id}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.company}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {Array.isArray(p.services) ? p.services.join(", ") : p.bio}
                      </Typography>
                    </Box>
                        <Chip label={(typeof p.rating === "number" ? p.rating.toFixed(1) : "0.0") + "★"} color="primary" size="small" />
                    </Box>
                  </CardContent>
                </PartnerCard>
                ))}
                {filtered.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No partners match your filters.</Typography>
                )}
                            </Box>
            </ResultsContainer>
                  </Box>
        </Box>
      </Container>

      <Popover 
        open={Boolean(anchorEl)} 
        anchorEl={anchorEl} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        disableRestoreFocus
        keepMounted
        disableAutoFocus
        disableEnforceFocus
        slotProps={{
          paper: {
            onMouseLeave: () => {
              // Keep dropdown open when hovering over content
            },
            onWheel: (e) => {
              // Prevent closing when scrolling
              e.stopPropagation();
            }
          }
        }}
      >
        <FilterPopover>
          {activeFilter === "role" && (
            <FormControl fullWidth size="small">
              <InputLabel id="role-label">Role</InputLabel>
              <Select labelId="role-label" label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="acquisition-specialist">Acquisition Specialist</MenuItem>
                <MenuItem value="disposition-agent">Disposition Agent</MenuItem>
                <MenuItem value="title-agent">Title Agent</MenuItem>
                <MenuItem value="escrow-officer">Escrow Officer</MenuItem>
                <MenuItem value="notary-public">Notary Public</MenuItem>
                <MenuItem value="residential-appraiser">Residential Appraiser</MenuItem>
                <MenuItem value="commercial-appraiser">Commercial Appraiser</MenuItem>
                <MenuItem value="home-inspector">Home Inspector</MenuItem>
                <MenuItem value="commercial-inspector">Commercial Inspector</MenuItem>
                <MenuItem value="energy-inspector">Energy Inspector</MenuItem>
                <MenuItem value="land-surveyor">Land Surveyor</MenuItem>
                <MenuItem value="insurance-agent">Insurance Agent</MenuItem>
                <MenuItem value="title-insurance-agent">Title Insurance Agent</MenuItem>
                <MenuItem value="mortgage-broker">Mortgage Broker</MenuItem>
                <MenuItem value="mortgage-lender">Mortgage Lender</MenuItem>
                <MenuItem value="loan-officer">Loan Officer</MenuItem>
                <MenuItem value="mortgage-underwriter">Mortgage Underwriter</MenuItem>
                <MenuItem value="hard-money-lender">Hard Money Lender</MenuItem>
                <MenuItem value="private-lender">Private Lender</MenuItem>
                <MenuItem value="limited-partner">Limited Partner (LP)</MenuItem>
                <MenuItem value="banking-advisor">Banking Advisor</MenuItem>
                <MenuItem value="seller-finance-specialist">Seller Finance Purchase Specialist</MenuItem>
                <MenuItem value="subject-to-specialist">Subject To Existing Mortgage Purchase Specialist</MenuItem>
                <MenuItem value="trust-acquisition-specialist">Trust Acquisition Specialist</MenuItem>
                <MenuItem value="hybrid-purchase-specialist">Hybrid Purchase Specialist</MenuItem>
                <MenuItem value="lease-option-specialist">Lease Option Specialist</MenuItem>
                <MenuItem value="general-contractor">General Contractor</MenuItem>
                <MenuItem value="electrical-contractor">Electrical Contractor</MenuItem>
                <MenuItem value="plumbing-contractor">Plumbing Contractor</MenuItem>
                <MenuItem value="hvac-contractor">HVAC Contractor</MenuItem>
                <MenuItem value="roofing-contractor">Roofing Contractor</MenuItem>
                <MenuItem value="painting-contractor">Painting Contractor</MenuItem>
                <MenuItem value="landscaping-contractor">Landscaping Contractor</MenuItem>
                <MenuItem value="flooring-contractor">Flooring Contractor</MenuItem>
                <MenuItem value="kitchen-contractor">Kitchen Contractor</MenuItem>
                <MenuItem value="bathroom-contractor">Bathroom Contractor</MenuItem>
                <MenuItem value="interior-designer">Interior Designer</MenuItem>
                <MenuItem value="architect">Architect</MenuItem>
                <MenuItem value="landscape-architect">Landscape Architect</MenuItem>
                <MenuItem value="kitchen-designer">Kitchen Designer</MenuItem>
                <MenuItem value="bathroom-designer">Bathroom Designer</MenuItem>
                <MenuItem value="lighting-designer">Lighting Designer</MenuItem>
                <MenuItem value="furniture-designer">Furniture Designer</MenuItem>
                <MenuItem value="color-consultant">Color Consultant</MenuItem>
                <MenuItem value="permit-expeditor">Permit Expeditor</MenuItem>
                <MenuItem value="energy-consultant">Energy Consultant</MenuItem>
                <MenuItem value="property-manager">Property Manager</MenuItem>
                <MenuItem value="long-term-rental-manager">Long-term Rental Property Manager</MenuItem>
                <MenuItem value="short-term-rental-manager">Short-term Rental Property Manager</MenuItem>
                <MenuItem value="str-setup-manager">STR Setup & Manager</MenuItem>
                <MenuItem value="housekeeper">Housekeeper</MenuItem>
                <MenuItem value="landscape-cleaner">Landscape Cleaner</MenuItem>
                <MenuItem value="turnover-specialist">Turnover Specialist</MenuItem>
                <MenuItem value="handyman">Handyman</MenuItem>
                <MenuItem value="landscaper">Landscaper</MenuItem>
                <MenuItem value="arborist">Arborist</MenuItem>
                <MenuItem value="tenant-screening-agent">Tenant Screening Agent</MenuItem>
                <MenuItem value="leasing-agent">Leasing Agent</MenuItem>
                <MenuItem value="bookkeeper">Bookkeeper</MenuItem>
                <MenuItem value="cpa">Certified Public Accountant (CPA)</MenuItem>
                <MenuItem value="accountant">Accountant</MenuItem>
                <MenuItem value="photographer">Photographer</MenuItem>
                <MenuItem value="videographer">Videographer</MenuItem>
                <MenuItem value="ar-vr-developer">AR/VR Developer</MenuItem>
                <MenuItem value="digital-twins-developer">Digital Twins Developer</MenuItem>
                <MenuItem value="estate-planning-attorney">Estate Planning Attorney</MenuItem>
                <MenuItem value="1031-exchange-intermediary">1031 Exchange Intermediary</MenuItem>
                <MenuItem value="entity-formation-provider">Entity Formation Service Provider</MenuItem>
                <MenuItem value="escrow-service-provider">Escrow Service Provider</MenuItem>
                <MenuItem value="legal-notary-service-provider">Legal Notary Service Provider</MenuItem>
                <MenuItem value="real-estate-consultant">Real Estate Consultant</MenuItem>
                <MenuItem value="real-estate-educator">Real Estate Educator</MenuItem>
                <MenuItem value="financial-advisor">Financial Advisor</MenuItem>
                <MenuItem value="tax-advisor">Tax Advisor</MenuItem>
                <MenuItem value="relocation-specialist">Relocation Specialist</MenuItem>
                <MenuItem value="real-estate-investment-advisor">Real Estate Investment Advisor</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilter === "experience" && (
            <FormControl fullWidth size="small">
              <InputLabel id="experience-label">Experience Level</InputLabel>
              <Select labelId="experience-label" label="Experience Level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="new">New (0-2 years)</MenuItem>
                <MenuItem value="established">Established (3-10 years)</MenuItem>
                <MenuItem value="veteran">Veteran (10+ years)</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilter === "availability" && (
            <FormControl fullWidth size="small">
              <InputLabel id="availability-label">Availability</InputLabel>
              <Select labelId="availability-label" label="Availability" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="available-now">Available Now</MenuItem>
                <MenuItem value="available-soon">Available Soon</MenuItem>
                <MenuItem value="limited">Limited Availability</MenuItem>
                <MenuItem value="no-availability">No Availability</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilter === "certifications" && (
            <FormControl fullWidth size="small">
              <InputLabel id="certifications-label">Certifications</InputLabel>
              <Select labelId="certifications-label" label="Certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="licensed">Licensed</MenuItem>
                <MenuItem value="bonded">Bonded</MenuItem>
                <MenuItem value="insured">Insured</MenuItem>
                <MenuItem value="certified">Certified</MenuItem>
                <MenuItem value="accredited">Accredited</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilter === "projectSize" && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Project Size Range
                </Typography>
              <Slider
                value={projectSizeRange}
                onChange={(_, newValue) => setProjectSizeRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={0}
                max={500000}
                step={10000}
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  ${projectSizeRange[0].toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${projectSizeRange[1].toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
          )}
          {activeFilter === "responseTime" && (
            <FormControl fullWidth size="small">
              <InputLabel id="responseTime-label">Response Time</InputLabel>
              <Select labelId="responseTime-label" label="Response Time" value={responseTime} onChange={(e) => setResponseTime(e.target.value)}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="same-day">Same Day</MenuItem>
                <MenuItem value="24-hours">24 Hours</MenuItem>
                <MenuItem value="48-hours">48 Hours</MenuItem>
                <MenuItem value="1-week">1 Week</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilter === "rating" && (
            <FormControl fullWidth size="small">
              <InputLabel id="rating-label">Min Rating</InputLabel>
              <Select labelId="rating-label" label="Min Rating" value={String(minRating)} onChange={(e) => setMinRating(Number(e.target.value))}>
                <MenuItem value={0}>Any</MenuItem>
                <MenuItem value={3}>3.0+</MenuItem>
                <MenuItem value={4}>4.0+</MenuItem>
                <MenuItem value={4.5}>4.5+</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilter === "language" && (
            <FormControl fullWidth size="small">
              <InputLabel id="lang-label">Language</InputLabel>
              <Select labelId="lang-label" label="Language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="spanish">Spanish</MenuItem>
                <MenuItem value="chinese">Chinese</MenuItem>
                <MenuItem value="vietnamese">Vietnamese</MenuItem>
              </Select>
            </FormControl>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleClose} variant="contained">Apply</Button>
          </Box>
        </FilterPopover>
      </Popover>
    </PageContainer>
  );
};

export default PartnersPage;