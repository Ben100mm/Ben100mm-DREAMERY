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

const BusinessSignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [firstName, setFirstName] = useState('');

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
    
    if (!email || !password || !businessType || !firstName || !zipPostal || !phoneArea || !phonePrefix || !phoneLine) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!consentChecked) {
      setError('Please accept the consent to receive emails');
      return;
    }
    
    setSuccess('Business account created successfully!');
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

              {/* Business Information Section */}
              <Typography variant="h6" sx={{ color: '#333333', fontWeight: 700, mb: 2, mt: 3 }}>
                Business Information
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#666666', fontWeight: 600 }}>Business type</InputLabel>
                <Select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}

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
                  {/* Real Estate Companies */}
                  <MenuItem value="real-estate-company">Real Estate Company</MenuItem>
                  <MenuItem value="brokerage-firm">Brokerage Firm</MenuItem>
                  <MenuItem value="real-estate-team">Real Estate Team</MenuItem>
                  <MenuItem value="real-estate-office">Real Estate Office</MenuItem>
                  
                  {/* Title & Escrow Companies */}
                  <MenuItem value="title-company">Title Company</MenuItem>
                  <MenuItem value="escrow-company">Escrow Company</MenuItem>
                  <MenuItem value="title-insurance-company">Title Insurance Company</MenuItem>
                  
                  {/* Mortgage Companies */}
                  <MenuItem value="mortgage-company">Mortgage Company</MenuItem>
                  <MenuItem value="mortgage-brokerage">Mortgage Brokerage</MenuItem>
                  <MenuItem value="hard-money-lending-company">Hard Money Lending Company</MenuItem>
                  <MenuItem value="private-lending-company">Private Lending Company</MenuItem>
                  
                  {/* Property Management Companies */}
                  <MenuItem value="property-management-company">Property Management Company</MenuItem>
                  <MenuItem value="str-management-company">STR Management Company</MenuItem>
                  <MenuItem value="maintenance-company">Maintenance Company</MenuItem>
                  <MenuItem value="cleaning-company">Cleaning Company</MenuItem>
                  
                  {/* Construction & Development Companies */}
                  <MenuItem value="construction-company">Construction Company</MenuItem>
                  <MenuItem value="development-company">Development Company</MenuItem>
                  <MenuItem value="building-company">Building Company</MenuItem>
                  <MenuItem value="renovation-company">Renovation Company</MenuItem>
                  
                  {/* Design & Architecture Firms */}
                  <MenuItem value="architecture-firm">Architecture Firm</MenuItem>
                  <MenuItem value="interior-design-firm">Interior Design Firm</MenuItem>
                  <MenuItem value="landscape-design-firm">Landscape Design Firm</MenuItem>
                  <MenuItem value="design-consulting-firm">Design Consulting Firm</MenuItem>
                  
                  {/* Inspection & Appraisal Companies */}
                  <MenuItem value="inspection-company">Inspection Company</MenuItem>
                  <MenuItem value="appraisal-company">Appraisal Company</MenuItem>
                  <MenuItem value="surveying-company">Surveying Company</MenuItem>
                  
                  {/* Insurance Companies */}
                  <MenuItem value="insurance-company">Insurance Company</MenuItem>
                  <MenuItem value="title-insurance-company">Title Insurance Company</MenuItem>
                  <MenuItem value="property-insurance-company">Property Insurance Company</MenuItem>
                  
                  {/* Legal & Professional Services */}
                  <MenuItem value="law-firm">Law Firm</MenuItem>
                  <MenuItem value="accounting-firm">Accounting Firm</MenuItem>
                  <MenuItem value="tax-consulting-firm">Tax Consulting Firm</MenuItem>
                  <MenuItem value="1031-exchange-company">1031 Exchange Company</MenuItem>
                  
                  {/* Technology Companies */}
                  <MenuItem value="crm-company">CRM Company</MenuItem>
                  <MenuItem value="software-company">Software Company</MenuItem>
                  <MenuItem value="api-provider">API Provider</MenuItem>
                  <MenuItem value="tech-consulting-firm">Technology Consulting Firm</MenuItem>
                  
                  {/* Investment Companies */}
                  <MenuItem value="investment-company">Investment Company</MenuItem>
                  <MenuItem value="syndication-company">Syndication Company</MenuItem>
                  <MenuItem value="crowdfunding-platform">Crowdfunding Platform</MenuItem>
                  <MenuItem value="reit">Real Estate Investment Trust (REIT)</MenuItem>
                  
                  {/* Auction & iBuyer Companies */}
                  <MenuItem value="auction-company">Auction Company</MenuItem>
                  <MenuItem value="ibuyer-company">iBuyer Company</MenuItem>
                  <MenuItem value="wholesaling-company">Wholesaling Company</MenuItem>
                  
                  {/* Marketing & Media Companies */}
                  <MenuItem value="marketing-agency">Marketing Agency</MenuItem>
                  <MenuItem value="photography-company">Photography Company</MenuItem>
                  <MenuItem value="virtual-tour-company">Virtual Tour Company</MenuItem>
                  <MenuItem value="staging-company">Staging Company</MenuItem>
                  
                  {/* Other Business Types */}
                  <MenuItem value="consulting-firm">Consulting Firm</MenuItem>
                  <MenuItem value="training-company">Training Company</MenuItem>
                  <MenuItem value="education-company">Education Company</MenuItem>
                  <MenuItem value="other-business">Other Business</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Business name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Business name"
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

export default BusinessSignupPage; 