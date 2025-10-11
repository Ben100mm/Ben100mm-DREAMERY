import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PhotoCamera as CameraIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface AdvertiseCreateFormProps {
  workspaceType: 'rent' | 'manage' | 'fund' | 'operate';
  onCancel: () => void;
  onSuccess: () => void;
}

const AdvertiseCreateForm: React.FC<AdvertiseCreateFormProps> = ({ 
  workspaceType, 
  onCancel, 
  onSuccess 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    features: [] as string[],
    images: [] as string[],
    contactInfo: {
      email: '',
      phone: '',
    },
    targeting: {
      budget: '',
      duration: '30',
      audience: [] as string[],
    },
  });

  const getContextualFields = () => {
    switch (workspaceType) {
      case 'rent':
        return {
          title: 'Rental Property Advertisement',
          priceLabel: 'Monthly Rent',
          locationLabel: 'Property Address',
          categories: [
            'Apartment',
            'House',
            'Condo',
            'Townhouse',
            'Studio',
            'Room',
          ],
          features: [
            'Pet Friendly',
            'Parking Included',
            'Laundry',
            'Balcony/Patio',
            'Gym/Fitness',
            'Pool',
            'Air Conditioning',
            'Dishwasher',
            'Hardwood Floors',
            'Furnished',
          ],
        };
      case 'manage':
        return {
          title: 'Property Management Service Advertisement',
          priceLabel: 'Service Fee',
          locationLabel: 'Service Area',
          categories: [
            'Residential Management',
            'Commercial Management',
            'HOA Management',
            'Short-term Rental Management',
            'Multi-family Management',
            'Single Family Management',
          ],
          features: [
            '24/7 Support',
            'Maintenance Coordination',
            'Tenant Screening',
            'Rent Collection',
            'Financial Reporting',
            'Property Inspections',
            'Marketing & Advertising',
            'Legal Compliance',
            'Emergency Response',
            'Online Portal',
          ],
        };
      case 'fund':
        return {
          title: 'Fundraising Opportunity Advertisement',
          priceLabel: 'Minimum Investment',
          locationLabel: 'Project Location',
          categories: [
            'Residential Development',
            'Commercial Development',
            'Mixed-Use Development',
            'Renovation Project',
            'Land Acquisition',
            'REIT Investment',
          ],
          features: [
            'High Returns',
            'Stable Cash Flow',
            'Prime Location',
            'Experienced Team',
            'Institutional Grade',
            'Tax Benefits',
            'Diversification',
            'Low Risk',
            'Exit Strategy',
            'Regular Distributions',
          ],
        };
      case 'operate':
        return {
          title: 'Operational Service Advertisement',
          priceLabel: 'Service Rate',
          locationLabel: 'Service Area',
          categories: [
            'Renovation & Remodeling',
            'Maintenance & Repairs',
            'Cleaning Services',
            'Landscaping',
            'Painting',
            'Plumbing',
            'Electrical',
            'HVAC',
            'Flooring',
            'Roofing',
          ],
          features: [
            'Licensed & Insured',
            'Experienced Team',
            'Quality Materials',
            'Warranty Included',
            'Free Estimates',
            'Quick Response',
            'Competitive Pricing',
            'References Available',
            'Project Management',
            'Cleanup Included',
          ],
        };
    }
  };

  const contextualFields = getContextualFields();

  const steps = ['Basic Information', 'Details & Features', 'Targeting & Budget'];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // In real app, this would call API to create ad
    console.log('Creating ad with data:', formData);
    onSuccess();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Advertisement Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={`e.g., ${workspaceType === 'rent' ? 'Beautiful 2BR Apartment' : 
                  workspaceType === 'manage' ? 'Professional Property Management' :
                  workspaceType === 'fund' ? 'Prime Development Opportunity' :
                  'Expert Home Renovation Services'}`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your offering in detail..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={contextualFields.priceLabel}
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder={workspaceType === 'rent' ? '$2,500/month' : 
                  workspaceType === 'fund' ? '$25,000 minimum' : 
                  '$75/hour'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={contextualFields.locationLabel}
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={workspaceType === 'rent' ? '123 Main St, City, State' : 
                  workspaceType === 'fund' ? 'Downtown District' : 
                  'City-wide service'}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                >
                  {contextualFields.categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Features/Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {contextualFields.features.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    color={formData.features.includes(feature) ? 'primary' : 'default'}
                    variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Images
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: `2px dashed ${brandColors.borders.secondary}`,
                  backgroundColor: brandColors.backgrounds.secondary,
                }}
              >
                <CameraIcon sx={{ fontSize: 48, color: brandColors.text.secondary, mb: 1 }} />
                <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                  Click to upload images or drag and drop
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  startIcon={<CameraIcon />}
                >
                  Choose Images
                </Button>
              </Paper>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Advertising Budget"
                value={formData.targeting.budget}
                onChange={(e) => handleInputChange('targeting.budget', e.target.value)}
                placeholder="$500/month"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Campaign Duration</InputLabel>
                <Select
                  value={formData.targeting.duration}
                  onChange={(e) => handleInputChange('targeting.duration', e.target.value)}
                  label="Campaign Duration"
                >
                  <MenuItem value="7">7 days</MenuItem>
                  <MenuItem value="30">30 days</MenuItem>
                  <MenuItem value="60">60 days</MenuItem>
                  <MenuItem value="90">90 days</MenuItem>
                  <MenuItem value="180">6 months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Target Audience
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {workspaceType === 'rent' ? [
                  'Young Professionals', 'Families', 'Students', 'Seniors', 'Pet Owners'
                ] : workspaceType === 'manage' ? [
                  'Property Owners', 'Real Estate Investors', 'Landlords', 'HOA Boards'
                ] : workspaceType === 'fund' ? [
                  'Accredited Investors', 'Institutional Investors', 'High Net Worth', 'REITs'
                ] : [
                  'Property Owners', 'Real Estate Investors', 'Homeowners', 'Businesses'
                ]}.map((audience) => (
                  <Chip
                    key={audience}
                    label={audience}
                    onClick={() => {
                      const currentAudience = formData.targeting.audience;
                      handleInputChange('targeting.audience', 
                        currentAudience.includes(audience)
                          ? currentAudience.filter(a => a !== audience)
                          : [...currentAudience, audience]
                      );
                    }}
                    color={formData.targeting.audience.includes(audience) ? 'primary' : 'default'}
                    variant={formData.targeting.audience.includes(audience) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={onCancel} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600, color: brandColors.text.primary }}>
          {contextualFields.title}
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ color: brandColors.text.secondary }}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
              }}
            >
              Preview
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{
                  backgroundColor: brandColors.primary,
                  '&:hover': {
                    backgroundColor: brandColors.actions.primary,
                  },
                }}
              >
                Create Advertisement
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  backgroundColor: brandColors.primary,
                  '&:hover': {
                    backgroundColor: brandColors.actions.primary,
                  },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdvertiseCreateForm;
