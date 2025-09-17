import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const FundCreateProject: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState({
    // Basic Information
    name: '',
    description: '',
    type: '',
    location: '',
    // Financial Details
    targetAmount: '',
    minInvestment: '',
    expectedReturn: '',
    riskLevel: '',
    // Timeline
    startDate: '',
    endDate: '',
    // Additional Details
    features: [] as string[],
    documents: [] as string[],
    images: [] as string[],
    // Terms & Conditions
    terms: '',
    risks: '',
    // Review
    isDraft: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);

  const steps = [
    'Basic Information',
    'Financial Details',
    'Timeline & Location',
    'Features & Documents',
    'Terms & Risks',
    'Review & Publish',
  ];

  const projectTypes = [
    { value: 'commercial', label: 'Commercial Real Estate' },
    { value: 'residential', label: 'Residential Development' },
    { value: 'retail', label: 'Retail & Mixed-Use' },
    { value: 'industrial', label: 'Industrial & Warehouse' },
    { value: 'hospitality', label: 'Hospitality & Hotels' },
    { value: 'healthcare', label: 'Healthcare Facilities' },
  ];

  const riskLevels = [
    { value: 'low', label: 'Low Risk', description: 'Stable returns, established market' },
    { value: 'medium', label: 'Medium Risk', description: 'Moderate volatility, growth potential' },
    { value: 'high', label: 'High Risk', description: 'High volatility, significant upside' },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setProjectData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', projectData);
    // In real app, this would save to API
  };

  const handlePublish = () => {
    console.log('Publishing project:', projectData);
    // In real app, this would publish to API
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Name"
              fullWidth
              value={projectData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Downtown Office Complex"
              required
            />
            <TextField
              label="Project Description"
              multiline
              rows={4}
              fullWidth
              value={projectData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide a detailed description of the project, its benefits, and investment opportunity..."
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Project Type</InputLabel>
              <Select
                value={projectData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Project Type"
              >
                {projectTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 1: // Financial Details
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Target Amount ($)"
                  type="number"
                  fullWidth
                  value={projectData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                  placeholder="2000000"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Minimum Investment ($)"
                  type="number"
                  fullWidth
                  value={projectData.minInvestment}
                  onChange={(e) => handleInputChange('minInvestment', e.target.value)}
                  placeholder="10000"
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Expected Annual Return (%)"
                  type="number"
                  fullWidth
                  value={projectData.expectedReturn}
                  onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                  placeholder="12.5"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={projectData.riskLevel}
                    onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                    label="Risk Level"
                  >
                    {riskLevels.map((risk) => (
                      <MenuItem key={risk.value} value={risk.value}>
                        <Box>
                          <Typography variant="body2">{risk.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {risk.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 2: // Timeline & Location
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Location"
              fullWidth
              value={projectData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Downtown, City, State"
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Fundraising Start Date"
                  type="date"
                  fullWidth
                  value={projectData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fundraising End Date"
                  type="date"
                  fullWidth
                  value={projectData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3: // Features & Documents
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Project Features
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddFeature}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {projectData.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    onDelete={() => handleRemoveFeature(index)}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Project Documents
              </Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => setOpenDocumentDialog(true)}
              >
                Upload Documents
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Upload project plans, financial projections, legal documents, etc.
              </Typography>
            </Box>
          </Box>
        );

      case 4: // Terms & Risks
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Terms & Conditions"
              multiline
              rows={6}
              fullWidth
              value={projectData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="Enter the terms and conditions for this investment opportunity..."
            />
            <TextField
              label="Risk Disclosure"
              multiline
              rows={6}
              fullWidth
              value={projectData.risks}
              onChange={(e) => handleInputChange('risks', e.target.value)}
              placeholder="Disclose all potential risks associated with this investment..."
            />
          </Box>
        );

      case 5: // Review & Publish
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Project Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><BusinessIcon /></ListItemIcon>
                      <ListItemText primary="Project Name" secondary={projectData.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationIcon /></ListItemIcon>
                      <ListItemText primary="Location" secondary={projectData.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MoneyIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Target Amount" 
                        secondary={`$${parseInt(projectData.targetAmount || '0').toLocaleString()}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MoneyIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Min Investment" 
                        secondary={`$${parseInt(projectData.minInvestment || '0').toLocaleString()}`} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Expected Return" 
                        secondary={`${projectData.expectedReturn}% annually`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon /></ListItemIcon>
                      <ListItemText primary="Risk Level" secondary={projectData.riskLevel} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Duration" 
                        secondary={`${projectData.startDate} to ${projectData.endDate}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                      <ListItemText primary="Features" secondary={`${projectData.features.length} features added`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>

            <FormControlLabel
              control={
                <Switch
                  checked={!projectData.isDraft}
                  onChange={(e) => handleInputChange('isDraft', !e.target.checked)}
                />
              }
              label="Publish immediately (uncheck to save as draft)"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Create New Project
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
          >
            Preview
          </Button>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent>
          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handlePublish}
              sx={{ bgcolor: brandColors.primary }}
            >
              Publish Project
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ bgcolor: brandColors.primary }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      {/* Document Upload Dialog */}
      <Dialog open={openDocumentDialog} onClose={() => setOpenDocumentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Project Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ height: 100, borderStyle: 'dashed' }}
            >
              Click to upload or drag and drop
            </Button>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB each)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDocumentDialog(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FundCreateProject;
