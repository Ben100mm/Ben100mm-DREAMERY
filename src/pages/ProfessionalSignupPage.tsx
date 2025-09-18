import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert,
  ListSubheader,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { brandColors } from "../theme";

const StyledCard = styled(Card)(({ theme }) => ({
  background: brandColors.backgrounds.primary,
  border: "1px solid brandColors.borders.secondary",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  maxWidth: "600px",
  width: "100%",
  margin: "0 auto",
}));

const ProfessionalSignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [professionalType, setProfessionalType] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zipPostal, setZipPostal] = useState("");
  const [phoneArea, setPhoneArea] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [phoneLine, setPhoneLine] = useState("");
  const [extension, setExtension] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !email ||
      !password ||
      professionalType.length === 0 ||
      !firstName ||
      !lastName ||
      !zipPostal ||
      !phoneArea ||
      !phonePrefix ||
      !phoneLine
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!consentChecked) {
      setError("Please accept the consent to receive emails");
      return;
    }

    setSuccess("Professional account created successfully!");
    // Redirect to partner profile completion
    window.location.href = "/partner-profile";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: brandColors.backgrounds.primary,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 2,
        overflowY: "auto",
        py: 4,
      }}
    >
      <Container maxWidth="md" sx={{ my: 2 }}>
        <StyledCard>
          <CardContent
            sx={{ padding: 4, maxHeight: "80vh", overflowY: "auto" }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: brandColors.primary,
                  fontWeight: 700,
                  mb: 1,
                  fontSize: "2rem",
                  fontFamily: "serif",
                }}
              >
                Welcome to Dreamery
              </Typography>
            </Box>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Account Information Section */}
              <Typography
                variant="h6"
                sx={{ color: brandColors.text.primary, fontWeight: 700, mb: 2 }}
              >
                Account Information
              </Typography>

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: brandColors.text.primary,
                    "& fieldset": {
                      borderColor: brandColors.borders.secondary,
                    },
                    "&:hover fieldset": {
                      borderColor: brandColors.neutral[300],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: brandColors.primary,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: brandColors.neutral[800],
                    fontWeight: 600,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: brandColors.primary,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    color: brandColors.text.primary,
                    "& fieldset": {
                      borderColor: brandColors.borders.secondary,
                    },
                    "&:hover fieldset": {
                      borderColor: brandColors.neutral[300],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: brandColors.primary,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: brandColors.neutral[800],
                    fontWeight: 600,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: brandColors.primary,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: brandColors.neutral[800] }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Requirements */}
              <Box sx={{ mb: 3, pl: 2 }}>
                <Typography
                  sx={{ color: brandColors.neutral[800], fontSize: "12px", mb: 0.5 }}
                >
                  - At least 8 characters
                </Typography>
                <Typography
                  sx={{ color: brandColors.neutral[800], fontSize: "12px", mb: 0.5 }}
                >
                  - Mix of letters and numbers
                </Typography>
                <Typography
                  sx={{ color: brandColors.neutral[800], fontSize: "12px", mb: 0.5 }}
                >
                  - At least 1 special character
                </Typography>
                <Typography sx={{ color: brandColors.neutral[800], fontSize: "12px" }}>
                  - At least 1 lowercase letter and 1 uppercase letter
                </Typography>
              </Box>

              {/* Professional Information Section */}
              <Typography
                variant="h6"
                sx={{ color: brandColors.text.primary, fontWeight: 700, mb: 2, mt: 3 }}
              >
                Professional Information
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: brandColors.neutral[800], fontWeight: 600 }}>
                  Professional type (select multiple)
                </InputLabel>
                <Select
                  multiple
                  value={professionalType}
                  onChange={(e) => setProfessionalType(e.target.value as string[])}
                  IconComponent={KeyboardArrowDown}
                  renderValue={(selected) => {
                    const roleLabels: { [key: string]: string } = {
                      "real-estate-agent": "Real Estate Agent",
                      "real-estate-broker": "Real Estate Broker",
                      "realtor": "Realtor",
                      "listing-agent": "Listing Agent",
                      "buyers-agent": "Buyer's Agent",
                      "commercial-agent": "Commercial Real Estate Agent",
                      "luxury-agent": "Luxury Real Estate Agent",
                      "new-construction-agent": "New Construction Agent",
                      "wholesaler": "Wholesaler",
                      "disposition-agent": "Disposition Agent",
                      "title-agent": "Title Agent",
                      "escrow-officer": "Escrow Officer",
                      "notary": "Notary Public",
                      "appraiser": "Appraiser",
                      "residential-appraiser": "Residential Appraiser",
                      "commercial-appraiser": "Commercial Appraiser",
                      "home-inspector": "Home Inspector",
                      "commercial-inspector": "Commercial Inspector",
                      "energy-inspector": "Energy Inspector",
                      "surveyor": "Surveyor",
                      "land-surveyor": "Land Surveyor",
                      "insurance-agent": "Insurance Agent",
                      "title-insurance-agent": "Title Insurance Agent",
                      "mortgage-broker": "Mortgage Broker",
                      "mortgage-lender": "Mortgage Lender",
                      "loan-officer": "Loan Officer",
                      "mortgage-underwriter": "Mortgage Underwriter",
                      "hard-money-lender": "Hard Money Lender",
                      "private-lender": "Private Lender",
                      "lp": "Limited Partner (LP)",
                      "seller-finance-specialist": "Seller Finance Specialist",
                      "banking-advisor": "Banking Advisor",
                      "general-contractor": "General Contractor",
                      "contractor": "Contractor",
                      "electrical-contractor": "Electrical Contractor",
                      "plumbing-contractor": "Plumbing Contractor",
                      "hvac-contractor": "HVAC Contractor",
                      "roofing-contractor": "Roofing Contractor",
                      "painting-contractor": "Painting Contractor",
                      "landscaping-contractor": "Landscaping Contractor",
                      "flooring-contractor": "Flooring Contractor",
                      "kitchen-contractor": "Kitchen Contractor",
                      "bathroom-contractor": "Bathroom Contractor",
                      "interior-designer": "Interior Designer",
                      "architect": "Architect",
                      "landscape-architect": "Landscape Architect",
                      "kitchen-designer": "Kitchen Designer",
                      "bathroom-designer": "Bathroom Designer",
                      "lighting-designer": "Lighting Designer",
                      "furniture-designer": "Furniture Designer",
                      "color-consultant": "Color Consultant",
                      "permit-expeditor": "Permit Expeditor",
                      "energy-consultant": "Energy Consultant",
                      "property-manager": "Property Manager",
                      "ltr-property-manager": "Long-term Rental Property Manager",
                      "str-property-manager": "Short-term Rental Property Manager",
                      "str-setup-manager": "STR Setup & Manager",
                      "housekeeper": "Housekeeper",
                      "landscape-cleaner": "Landscape Cleaner",
                      "turnover-specialist": "Turnover Specialist",
                      "handyman": "Handyman",
                      "landscaper": "Landscaper",
                      "arborist": "Arborist",
                      "tenant-screening-agent": "Tenant Screening Agent",
                      "leasing-agent": "Leasing Agent",
                      "bookkeeper": "Bookkeeper",
                      "cpa": "Certified Public Accountant (CPA)",
                      "accountant": "Accountant",
                      "photographer": "Photographer",
                      "videographer": "Videographer",
                      "ar-vr-developer": "AR/VR Developer",
                      "digital-twins-developer": "Digital Twins Developer",
                      "real-estate-attorney": "Real Estate Attorney",
                      "estate-planning-attorney": "Estate Planning Attorney",
                      "1031-exchange-intermediary": "1031 Exchange Intermediary",
                      "entity-formation-service-provider": "Entity Formation Service Provider",
                      "escrow-service-provider": "Escrow Service Provider",
                      "legal-notary-service-provider": "Legal Notary Service Provider",
                      "investor-buyer": "Investor Buyer",
                      "retail-buyer": "Retail Buyer",
                      "ibuyer": "iBuyer",
                      "property-flipper": "Property Flipper",
                      "consultant": "Real Estate Consultant",
                      "educator": "Real Estate Educator",
                      "trainer": "Real Estate Trainer",
                      "coach": "Real Estate Coach",
                      "financial-advisor": "Financial Advisor",
                      "tax-advisor": "Tax Advisor",
                      "relocation-specialist": "Relocation Specialist",
                      "investment-advisor": "Real Estate Investment Advisor",
                      "other": "Other"
                    };

                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Box
                            key={value}
                            sx={{
                              backgroundColor: brandColors.primary,
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '12px',
                              fontWeight: 500,
                            }}
                          >
                            {roleLabels[value] || value}
                          </Box>
                        ))}
                      </Box>
                    );
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: brandColors.borders.secondary,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: brandColors.neutral[300],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: brandColors.primary,
                    },
                  }}
                >
                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Real Estate Agents / Brokers
                  </ListSubheader>
                  <MenuItem value="real-estate-agent">
                    Real Estate Agent
                  </MenuItem>
                  <MenuItem value="real-estate-broker">
                    Real Estate Broker
                  </MenuItem>
                  <MenuItem value="realtor">Realtor</MenuItem>
                  <MenuItem value="listing-agent">Listing Agent</MenuItem>
                  <MenuItem value="buyers-agent">Buyer's Agent</MenuItem>
                  <MenuItem value="commercial-agent">
                    Commercial Real Estate Agent
                  </MenuItem>
                  <MenuItem value="luxury-agent">
                    Luxury Real Estate Agent
                  </MenuItem>
                  <MenuItem value="new-construction-agent">
                    New Construction Agent
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Wholesalers
                  </ListSubheader>
                  <MenuItem value="wholesaler">Wholesaler</MenuItem>
                  <MenuItem value="disposition-agent">
                    Disposition Agent
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Title
                  </ListSubheader>
                  <MenuItem value="title-agent">Title Agent</MenuItem>
                  <MenuItem value="escrow-officer">Escrow Officer</MenuItem>
                  <MenuItem value="notary">Notary Public</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Appraisers
                  </ListSubheader>
                  <MenuItem value="appraiser">Appraiser</MenuItem>
                  <MenuItem value="residential-appraiser">
                    Residential Appraiser
                  </MenuItem>
                  <MenuItem value="commercial-appraiser">
                    Commercial Appraiser
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Inspectors
                  </ListSubheader>
                  <MenuItem value="home-inspector">Home Inspector</MenuItem>
                  <MenuItem value="commercial-inspector">
                    Commercial Inspector
                  </MenuItem>
                  <MenuItem value="energy-inspector">Energy Inspector</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Surveyors
                  </ListSubheader>
                  <MenuItem value="surveyor">Surveyor</MenuItem>
                  <MenuItem value="land-surveyor">Land Surveyor</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Insurance Agents
                  </ListSubheader>
                  <MenuItem value="insurance-agent">Insurance Agent</MenuItem>
                  <MenuItem value="title-insurance-agent">
                    Title Insurance Agent
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Mortgage Lenders / Brokers
                  </ListSubheader>
                  <MenuItem value="mortgage-broker">Mortgage Broker</MenuItem>
                  <MenuItem value="mortgage-lender">Mortgage Lender</MenuItem>
                  <MenuItem value="loan-officer">Loan Officer</MenuItem>
                  <MenuItem value="mortgage-underwriter">
                    Mortgage Underwriter
                  </MenuItem>
                  <MenuItem value="hard-money-lender">
                    Hard Money Lender
                  </MenuItem>
                  <MenuItem value="private-lender">Private Lender</MenuItem>
                  <MenuItem value="lp">Limited Partner (LP)</MenuItem>
                  <MenuItem value="seller-finance-specialist">
                    Seller Finance Specialist
                  </MenuItem>
                  <MenuItem value="banking-advisor">Banking Advisor</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Contractors / GC
                  </ListSubheader>
                  <MenuItem value="general-contractor">
                    General Contractor
                  </MenuItem>
                  <MenuItem value="contractor">Contractor</MenuItem>
                  <MenuItem value="electrical-contractor">
                    Electrical Contractor
                  </MenuItem>
                  <MenuItem value="plumbing-contractor">
                    Plumbing Contractor
                  </MenuItem>
                  <MenuItem value="hvac-contractor">HVAC Contractor</MenuItem>
                  <MenuItem value="roofing-contractor">
                    Roofing Contractor
                  </MenuItem>
                  <MenuItem value="painting-contractor">
                    Painting Contractor
                  </MenuItem>
                  <MenuItem value="landscaping-contractor">
                    Landscaping Contractor
                  </MenuItem>
                  <MenuItem value="flooring-contractor">
                    Flooring Contractor
                  </MenuItem>
                  <MenuItem value="kitchen-contractor">
                    Kitchen Contractor
                  </MenuItem>
                  <MenuItem value="bathroom-contractor">
                    Bathroom Contractor
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Design & Architecture
                  </ListSubheader>
                  <MenuItem value="interior-designer">
                    Interior Designer
                  </MenuItem>
                  <MenuItem value="architect">Architect</MenuItem>
                  <MenuItem value="landscape-architect">
                    Landscape Architect
                  </MenuItem>
                  <MenuItem value="kitchen-designer">Kitchen Designer</MenuItem>
                  <MenuItem value="bathroom-designer">
                    Bathroom Designer
                  </MenuItem>
                  <MenuItem value="lighting-designer">
                    Lighting Designer
                  </MenuItem>
                  <MenuItem value="furniture-designer">
                    Furniture Designer
                  </MenuItem>
                  <MenuItem value="color-consultant">Color Consultant</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Permit Expeditors
                  </ListSubheader>
                  <MenuItem value="permit-expeditor">Permit Expeditor</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Energy Consultants
                  </ListSubheader>
                  <MenuItem value="energy-consultant">
                    Energy Consultant
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Property Managers
                  </ListSubheader>
                  <MenuItem value="property-manager">Property Manager</MenuItem>
                  <MenuItem value="ltr-property-manager">
                    Long-term Rental Property Manager
                  </MenuItem>
                  <MenuItem value="str-property-manager">
                    Short-term Rental Property Manager
                  </MenuItem>
                  <MenuItem value="str-setup-manager">
                    STR Setup & Manager
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Cleaning & Maintenance
                  </ListSubheader>
                  <MenuItem value="housekeeper">Housekeeper</MenuItem>
                  <MenuItem value="landscape-cleaner">
                    Landscape Cleaner
                  </MenuItem>
                  <MenuItem value="turnover-specialist">
                    Turnover Specialist
                  </MenuItem>
                  <MenuItem value="handyman">Handyman</MenuItem>
                  <MenuItem value="landscaper">Landscaper</MenuItem>
                  <MenuItem value="arborist">Arborist</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Tenant Services
                  </ListSubheader>
                  <MenuItem value="tenant-screening-agent">
                    Tenant Screening Agent
                  </MenuItem>
                  <MenuItem value="leasing-agent">Leasing Agent</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Accounting
                  </ListSubheader>
                  <MenuItem value="bookkeeper">Bookkeeper</MenuItem>
                  <MenuItem value="cpa">
                    Certified Public Accountant (CPA)
                  </MenuItem>
                  <MenuItem value="accountant">Accountant</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Marketing & Advertisement
                  </ListSubheader>
                  <MenuItem value="photographer">Photographer</MenuItem>
                  <MenuItem value="videographer">Videographer</MenuItem>
                  <MenuItem value="ar-vr-developer">AR/VR Developer</MenuItem>
                  <MenuItem value="digital-twins-developer">
                    Digital Twins Developer
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Legal Services
                  </ListSubheader>
                  <MenuItem value="real-estate-attorney">
                    Real Estate Attorney
                  </MenuItem>
                  <MenuItem value="estate-planning-attorney">
                    Estate Planning Attorney
                  </MenuItem>
                  <MenuItem value="1031-exchange-intermediary">
                    1031 Exchange Intermediary
                  </MenuItem>
                  <MenuItem value="entity-formation-service-provider">
                    Entity Formation Service Provider
                  </MenuItem>
                  <MenuItem value="escrow-service-provider">
                    Escrow Service Provider
                  </MenuItem>
                  <MenuItem value="legal-notary-service-provider">
                    Legal Notary Service Provider
                  </MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Buyers & Investors
                  </ListSubheader>
                  <MenuItem value="investor-buyer">Investor Buyer</MenuItem>
                  <MenuItem value="retail-buyer">Retail Buyer</MenuItem>
                  <MenuItem value="ibuyer">iBuyer</MenuItem>
                  <MenuItem value="property-flipper">Property Flipper</MenuItem>

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      color: brandColors.neutral[800],
                      backgroundColor: brandColors.neutral[100],
                      fontSize: "14px",
                    }}
                  >
                    Other
                  </ListSubheader>
                  <MenuItem value="consultant">Real Estate Consultant</MenuItem>
                  <MenuItem value="educator">Real Estate Educator</MenuItem>
                  <MenuItem value="trainer">Real Estate Trainer</MenuItem>
                  <MenuItem value="coach">Real Estate Coach</MenuItem>
                  <MenuItem value="financial-advisor">
                    Financial Advisor
                  </MenuItem>
                  <MenuItem value="tax-advisor">Tax Advisor</MenuItem>
                  <MenuItem value="relocation-specialist">
                    Relocation Specialist
                  </MenuItem>
                  <MenuItem value="investment-advisor">
                    Real Estate Investment Advisor
                  </MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              
              {/* Helper text for multiple selection */}
              <Typography
                sx={{
                  color: brandColors.neutral[600],
                  fontSize: "12px",
                  mb: 2,
                  fontStyle: "italic",
                }}
              >
                You can select multiple professional types that apply to you
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: brandColors.text.primary,
                        "& fieldset": {
                          borderColor: brandColors.borders.secondary,
                        },
                        "&:hover fieldset": {
                          borderColor: brandColors.neutral[300],
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: brandColors.primary,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: brandColors.neutral[800],
                        fontWeight: 600,
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: brandColors.primary,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: brandColors.text.primary,
                        "& fieldset": {
                          borderColor: brandColors.borders.secondary,
                        },
                        "&:hover fieldset": {
                          borderColor: brandColors.neutral[300],
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: brandColors.primary,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: brandColors.neutral[800],
                        fontWeight: 600,
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: brandColors.primary,
                      },
                    }}
                  />
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Zip/Postal"
                value={zipPostal}
                onChange={(e) => setZipPostal(e.target.value)}
                placeholder="Zip/Postal"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: brandColors.text.primary,
                    "& fieldset": {
                      borderColor: brandColors.borders.secondary,
                    },
                    "&:hover fieldset": {
                      borderColor: brandColors.neutral[300],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: brandColors.primary,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: brandColors.neutral[800],
                    fontWeight: 600,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: brandColors.primary,
                  },
                }}
              />

              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: brandColors.neutral[800],
                    fontWeight: 600,
                    mb: 1,
                    fontSize: "14px",
                  }}
                >
                  Phone number
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Area"
                    value={phoneArea}
                    onChange={(e) => setPhoneArea(e.target.value)}
                    sx={{
                      width: "80px",
                      "& .MuiOutlinedInput-root": {
                        color: brandColors.text.primary,
                        "& fieldset": {
                          borderColor: brandColors.borders.secondary,
                        },
                        "&:hover fieldset": {
                          borderColor: brandColors.neutral[300],
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: brandColors.primary,
                        },
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="Prefix"
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    sx={{
                      width: "80px",
                      "& .MuiOutlinedInput-root": {
                        color: brandColors.text.primary,
                        "& fieldset": {
                          borderColor: brandColors.borders.secondary,
                        },
                        "&:hover fieldset": {
                          borderColor: brandColors.neutral[300],
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: brandColors.primary,
                        },
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="Line"
                    value={phoneLine}
                    onChange={(e) => setPhoneLine(e.target.value)}
                    sx={{
                      width: "80px",
                      "& .MuiOutlinedInput-root": {
                        color: brandColors.text.primary,
                        "& fieldset": {
                          borderColor: brandColors.borders.secondary,
                        },
                        "&:hover fieldset": {
                          borderColor: brandColors.neutral[300],
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: brandColors.primary,
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{
                        color: brandColors.neutral[800],
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Ext
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Ext"
                      value={extension}
                      onChange={(e) => setExtension(e.target.value)}
                      sx={{
                        width: "80px",
                        "& .MuiOutlinedInput-root": {
                          color: brandColors.text.primary,
                          "& fieldset": {
                            borderColor: brandColors.borders.secondary,
                          },
                          "&:hover fieldset": {
                            borderColor: brandColors.neutral[300],
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: brandColors.primary,
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Consent Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    sx={{
                      color: brandColors.primary,
                      "&.Mui-checked": {
                        color: brandColors.primary,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: brandColors.text.primary, fontSize: "14px" }}>
                    By checking the box, I consent to receive emails from
                    Dreamery, including newsletters, alerts, updates,
                    invitations, promotions and other news and notifications
                  </Typography>
                }
                sx={{ mb: 3, alignItems: "flex-start" }}
              />

              {/* Continue Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  height: "48px",
                  borderRadius: "8px",
                  background: brandColors.primary,
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  mb: 2,
                  "&:hover": {
                    background: "#1d4ed8",
                  },
                }}
              >
                Continue
              </Button>

              {/* Terms of Use */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography sx={{ color: brandColors.neutral[800], fontSize: "12px" }}>
                  By submitting, I accept Dreamery's{" "}
                  <Link
                    sx={{
                      color: brandColors.primary,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    terms of use
                  </Link>
                </Typography>
              </Box>

              {/* Back to Home */}
              <Box sx={{ textAlign: "center" }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => window.history.back()}
                  sx={{
                    color: brandColors.neutral[800],
                    textTransform: "none",
                    fontSize: "14px",
                    "&:hover": {
                      color: brandColors.text.primary,
                    },
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
};

export default ProfessionalSignupPage;
