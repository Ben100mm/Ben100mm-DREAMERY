import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '600px',
  width: '100%',
  margin: '0 auto',
}));

const ProfessionalSignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [professionalType, setProfessionalType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipPostal, setZipPostal] = useState('');
  const [phoneArea, setPhoneArea] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('');
  const [phoneLine, setPhoneLine] = useState('');
  const [extension, setExtension] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password || !professionalType || !firstName || !lastName || !zipPostal || !phoneArea || !phonePrefix || !phoneLine) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!consentChecked) {
      setError('Please accept the consent to receive emails');
      return;
    }
    
    setSuccess('Professional account created successfully!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 2,
        overflowY: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="md" sx={{ my: 2 }}>
        <StyledCard>
          <CardContent sx={{ padding: 4, maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ 
                color: '#1e3a8a', 
                fontWeight: 700, 
                mb: 1,
                fontSize: '2rem',
                fontFamily: 'serif',
              }}>
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
              <Typography variant="h6" sx={{ color: '#333333', fontWeight: 700, mb: 2 }}>
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
                  '& .MuiOutlinedInput-root': {
                    color: '#333333',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#c0c0c0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3a8a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    fontWeight: 600,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1e3a8a',
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#333333',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#c0c0c0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3a8a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    fontWeight: 600,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1e3a8a',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#666666' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Password Requirements */}
              <Box sx={{ mb: 3, pl: 2 }}>
                <Typography sx={{ color: '#666666', fontSize: '12px', mb: 0.5 }}>
                  • At least 8 characters
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '12px', mb: 0.5 }}>
                  • Mix of letters and numbers
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '12px', mb: 0.5 }}>
                  • At least 1 special character
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '12px' }}>
                  • At least 1 lowercase letter and 1 uppercase letter
                </Typography>
              </Box>

              {/* Professional Information Section */}
              <Typography variant="h6" sx={{ color: '#333333', fontWeight: 700, mb: 2, mt: 3 }}>
                Professional Information
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#666666', fontWeight: 600 }}>Professional type</InputLabel>
                <Select
                  value={professionalType}
                  onChange={(e) => setProfessionalType(e.target.value)}

                  IconComponent={KeyboardArrowDown}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#c0c0c0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e3a8a',
                    },
                  }}
                >
                  {/* Real Estate Agents / Brokers */}
                  <MenuItem value="real-estate-agent">Real Estate Agent</MenuItem>
                  <MenuItem value="real-estate-broker">Real Estate Broker</MenuItem>
                  <MenuItem value="realtor">Realtor</MenuItem>
                  <MenuItem value="listing-agent">Listing Agent</MenuItem>
                  <MenuItem value="buyers-agent">Buyer's Agent</MenuItem>
                  <MenuItem value="commercial-agent">Commercial Real Estate Agent</MenuItem>
                  <MenuItem value="luxury-agent">Luxury Real Estate Agent</MenuItem>
                  <MenuItem value="new-construction-agent">New Construction Agent</MenuItem>
                  
                  {/* Wholesalers */}
                  <MenuItem value="wholesaler">Wholesaler</MenuItem>
                  
                  {/* Title Companies */}
                  <MenuItem value="title-company">Title Company</MenuItem>
                  <MenuItem value="title-agent">Title Agent</MenuItem>
                  <MenuItem value="escrow-officer">Escrow Officer</MenuItem>
                  <MenuItem value="notary">Notary Public</MenuItem>
                  
                  {/* Appraisers */}
                  <MenuItem value="appraiser">Appraiser</MenuItem>
                  <MenuItem value="residential-appraiser">Residential Appraiser</MenuItem>
                  <MenuItem value="commercial-appraiser">Commercial Appraiser</MenuItem>
                  
                  {/* Inspectors */}
                  <MenuItem value="home-inspector">Home Inspector</MenuItem>
                  <MenuItem value="commercial-inspector">Commercial Inspector</MenuItem>
                  <MenuItem value="energy-inspector">Energy Inspector</MenuItem>
                  
                  {/* Surveyors */}
                  <MenuItem value="surveyor">Surveyor</MenuItem>
                  <MenuItem value="land-surveyor">Land Surveyor</MenuItem>
                  
                  {/* Insurance Agents */}
                  <MenuItem value="insurance-agent">Insurance Agent</MenuItem>
                  <MenuItem value="title-insurance-agent">Title Insurance Agent</MenuItem>
                  
                  {/* Mortgage Lenders / Brokers */}
                  <MenuItem value="mortgage-broker">Mortgage Broker</MenuItem>
                  <MenuItem value="mortgage-lender">Mortgage Lender</MenuItem>
                  <MenuItem value="loan-officer">Loan Officer</MenuItem>
                  <MenuItem value="mortgage-underwriter">Mortgage Underwriter</MenuItem>
                  <MenuItem value="hard-money-lender">Hard Money Lender</MenuItem>
                  <MenuItem value="private-lender">Private Lender</MenuItem>
                  <MenuItem value="lp">Limited Partner (LP)</MenuItem>
                  <MenuItem value="seller-finance-specialist">Seller Finance Specialist</MenuItem>
                  <MenuItem value="banking-partner">Banking Partner</MenuItem>
                  
                  {/* Syndication & Crowdfunding */}
                  <MenuItem value="syndication-platform">Syndication Platform</MenuItem>
                  <MenuItem value="crowdfunding-platform">Crowdfunding Platform</MenuItem>
                  
                  {/* Contractors / GC */}
                  <MenuItem value="general-contractor">General Contractor</MenuItem>
                  <MenuItem value="contractor">Contractor</MenuItem>
                  <MenuItem value="electrical-contractor">Electrical Contractor</MenuItem>
                  <MenuItem value="plumbing-contractor">Plumbing Contractor</MenuItem>
                  <MenuItem value="hvac-contractor">HVAC Contractor</MenuItem>
                  <MenuItem value="roofing-contractor">Roofing Contractor</MenuItem>
                  <MenuItem value="painting-contractor">Painting Contractor</MenuItem>
                  <MenuItem value="landscaping-contractor">Landscaping Contractor</MenuItem>
                  <MenuItem value="flooring-contractor">Flooring Contractor</MenuItem>
                  <MenuItem value="kitchen-contractor">Kitchen Contractor</MenuItem>
                  <MenuItem value="bathroom-contractor">Bathroom Contractor</MenuItem>
                  
                  {/* Handymen */}
                  <MenuItem value="handyman">Handyman</MenuItem>
                  
                  {/* Builders / Developers */}
                  <MenuItem value="builder">Builder</MenuItem>
                  <MenuItem value="developer">Developer</MenuItem>
                  <MenuItem value="property-developer">Property Developer</MenuItem>
                  <MenuItem value="land-developer">Land Developer</MenuItem>
                  
                  {/* Design & Architecture */}
                  <MenuItem value="interior-designer">Interior Designer</MenuItem>
                  <MenuItem value="architect">Architect</MenuItem>
                  <MenuItem value="landscape-architect">Landscape Architect</MenuItem>
                  <MenuItem value="kitchen-designer">Kitchen Designer</MenuItem>
                  <MenuItem value="bathroom-designer">Bathroom Designer</MenuItem>
                  <MenuItem value="lighting-designer">Lighting Designer</MenuItem>
                  <MenuItem value="furniture-designer">Furniture Designer</MenuItem>
                  <MenuItem value="color-consultant">Color Consultant</MenuItem>
                  
                  {/* Permit Expeditors */}
                  <MenuItem value="permit-expeditor">Permit Expeditor</MenuItem>
                  
                  {/* Energy Consultants */}
                  <MenuItem value="energy-consultant">Energy Consultant</MenuItem>
                  
                  {/* Property Managers */}
                  <MenuItem value="property-manager">Property Manager</MenuItem>
                  <MenuItem value="ltr-property-manager">Long-term Rental Property Manager</MenuItem>
                  <MenuItem value="str-property-manager">Short-term Rental Property Manager</MenuItem>
                  <MenuItem value="str-setup-management">STR Setup & Management Company</MenuItem>
                  
                  {/* Cleaning & Turnover */}
                  <MenuItem value="cleaning-team">Cleaning & Turnover Team</MenuItem>
                  <MenuItem value="maintenance-vendor">Maintenance Vendor</MenuItem>
                  
                  {/* Tenant Services */}
                  <MenuItem value="tenant-screening">Tenant Screening Service</MenuItem>
                  <MenuItem value="leasing-agent">Leasing Agent</MenuItem>
                  
                  {/* CRM Providers */}
                  <MenuItem value="crm-provider">CRM Provider</MenuItem>
                  
                  {/* Accounting Platforms */}
                  <MenuItem value="accounting-platform">Accounting Platform</MenuItem>
                  <MenuItem value="bookkeeper">Bookkeeper</MenuItem>
                  <MenuItem value="cpa">Certified Public Accountant (CPA)</MenuItem>
                  <MenuItem value="accountant">Accountant</MenuItem>
                  
                  {/* Document Services */}
                  <MenuItem value="document-signing">Document Signing Service</MenuItem>
                  <MenuItem value="document-storage">Document Storage Service</MenuItem>
                  
                  {/* APIs & Tools */}
                  <MenuItem value="valuation-api">Valuation API</MenuItem>
                  <MenuItem value="lead-gen-api">Lead Generation API</MenuItem>
                  <MenuItem value="ai-underwriting">AI Underwriting Tool</MenuItem>
                  <MenuItem value="ai-analysis">AI Analysis Tool</MenuItem>
                  <MenuItem value="ar-vr-digital-twins">AR/VR & Digital Twins</MenuItem>
                  <MenuItem value="property-measurement">Property Measurement Tool</MenuItem>
                  
                  {/* Legal Services */}
                  <MenuItem value="real-estate-attorney">Real Estate Attorney</MenuItem>
                  <MenuItem value="estate-planning-attorney">Estate Planning Attorney</MenuItem>
                  <MenuItem value="1031-exchange-intermediary">1031 Exchange Intermediary</MenuItem>
                  <MenuItem value="entity-formation">Entity Formation Service</MenuItem>
                  <MenuItem value="escrow-service">Escrow Service</MenuItem>
                  <MenuItem value="notary-service">Notary Service</MenuItem>
                  
                  {/* Buyers & Investors */}
                  <MenuItem value="investor-buyer">Investor Buyer</MenuItem>
                  <MenuItem value="retail-buyer">Retail Buyer (MLS)</MenuItem>
                  <MenuItem value="ibuyer">iBuyer</MenuItem>
                  <MenuItem value="reit">REIT</MenuItem>
                  <MenuItem value="auction-platform">Auction Platform</MenuItem>
                  <MenuItem value="property-investor">Property Investor</MenuItem>
                  <MenuItem value="flipper">Property Flipper</MenuItem>
                  <MenuItem value="landlord">Landlord</MenuItem>
                  
                  {/* Other */}
                  <MenuItem value="consultant">Real Estate Consultant</MenuItem>
                  <MenuItem value="educator">Real Estate Educator</MenuItem>
                  <MenuItem value="trainer">Real Estate Trainer</MenuItem>
                  <MenuItem value="coach">Real Estate Coach</MenuItem>
                  <MenuItem value="financial-advisor">Financial Advisor</MenuItem>
                  <MenuItem value="tax-advisor">Tax Advisor</MenuItem>
                  <MenuItem value="relocation-specialist">Relocation Specialist</MenuItem>
                  <MenuItem value="investment-advisor">Real Estate Investment Advisor</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c0c0c0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666666',
                        fontWeight: 600,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1e3a8a',
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
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c0c0c0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666666',
                        fontWeight: 600,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1e3a8a',
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
                  '& .MuiOutlinedInput-root': {
                    color: '#333333',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#c0c0c0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3a8a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    fontWeight: 600,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1e3a8a',
                  },
                }}
              />
              
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#666666', fontWeight: 600, mb: 1, fontSize: '14px' }}>
                  Phone number
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="XXX"
                    value={phoneArea}
                    onChange={(e) => setPhoneArea(e.target.value)}
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c0c0c0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a',
                        },
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="XXX"
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c0c0c0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a',
                        },
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="XXXX"
                    value={phoneLine}
                    onChange={(e) => setPhoneLine(e.target.value)}
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c0c0c0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a',
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ color: '#666666', fontWeight: 600, fontSize: '14px' }}>
                      Ext
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="XXXXX"
                      value={extension}
                      onChange={(e) => setExtension(e.target.value)}
                      sx={{
                        width: '80px',
                        '& .MuiOutlinedInput-root': {
                          color: '#333333',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#c0c0c0',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1e3a8a',
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
                      color: '#1e3a8a',
                      '&.Mui-checked': {
                        color: '#1e3a8a',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: '#333333', fontSize: '14px' }}>
                    By checking the box, I consent to receive emails from Dreamery, including newsletters, alerts, updates, invitations, promotions and other news and notifications
                  </Typography>
                }
                sx={{ mb: 3, alignItems: 'flex-start' }}
              />

              {/* Continue Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  height: '48px',
                  borderRadius: '8px',
                  background: '#1e3a8a',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  mb: 2,
                  '&:hover': {
                    background: '#1d4ed8',
                  },
                }}
              >
                Continue
              </Button>

              {/* Terms of Use */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography sx={{ color: '#666666', fontSize: '12px' }}>
                  By submitting, I accept Dreamery's{' '}
                  <Link
                    sx={{
                      color: '#1e3a8a',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    terms of use
                  </Link>
                </Typography>
              </Box>

              {/* Back to Home */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => window.history.back()}
                  sx={{
                    color: '#666666',
                    textTransform: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: '#333333',
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