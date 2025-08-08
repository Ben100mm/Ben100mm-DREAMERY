import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  padding-bottom: 96px; /* reserve space for fixed footer */
  overflow-y: auto; /* force page-level scrolling */
  -webkit-overflow-scrolling: touch;
`;

const HeaderSection = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const SummarySection = styled.div`
  margin-bottom: 2rem;
`;

const SummaryCard = styled(Card)`
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
`;

const EditButton = styled(IconButton)`
  color: #1a365d;
  &:hover {
    background-color: rgba(26, 54, 93, 0.04);
  }
`;

const SellListSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  // Extract all form data
  const {
    address = '',
    sellChecked = false,
    listChecked = false,
    movingDetails = '',
    sellTiming = '',
    listTiming = '',
    homeDetails = {},
    homeDetails2 = {},
    homeDetails3 = {},
    homeQuality = '',
    homeQuality2 = '',
    homeQuality3 = '',
    homeQuality4 = '',
    countertops = '',
    hoa = '',
    communityTypes = [],
    guard = '',
    propertyConditions = [],
    otherDetails = '',
    firstName = '',
    lastName = '',
    phoneNumber = ''
  } = formData;

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedData, setEditedData] = useState(formData);

  // Helpers to safely read/update nested values using dot-paths
  const getValueByPath = (obj: any, path: string) => {
    try {
      return path.split('.').reduce((o: any, k: string) => (o ? o[k] : undefined), obj);
    } catch {
      return undefined;
    }
  };

  const setValueByPath = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const newObj: any = { ...obj };
    let curr: any = newObj;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const key = keys[i];
      curr[key] = { ...(curr[key] || {}) };
      curr = curr[key];
    }
    curr[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSave = (section: string) => {
    setEditingSection(null);
    // Update the formData with edited values
    setEditedData({ ...editedData });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditedData(formData);
  };

  const handleNext = () => {
    navigate('/sell-services', { state: editedData });
  };

  const handleBack = () => {
    navigate('/sell-phone-info', { state: editedData });
  };

  const handleExit = () => navigate('/');

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'Not provided';
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'None';
    return String(value);
  };

  const renderEditableField = (label: string, value: any, fieldPath: string, type: 'text' | 'select' | 'radio' | 'checkbox' = 'text', options?: any[]) => {
    const isEditing = editingSection === fieldPath;
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
          {label}:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {type === 'text' && (
                <TextField
                  size="small"
                  value={getValueByPath(editedData, fieldPath) || ''}
                  onChange={(e) => setEditedData(setValueByPath(editedData, fieldPath, e.target.value))}
                  sx={{ minWidth: 200 }}
                />
              )}
              {type === 'select' && options && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={getValueByPath(editedData, fieldPath) || ''}
                    onChange={(e) => setEditedData(setValueByPath(editedData, fieldPath, e.target.value))}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <IconButton size="small" onClick={() => handleSave(fieldPath)} sx={{ color: '#22c55e' }}>
                <CheckIcon />
              </IconButton>
              <Button size="small" onClick={handleCancel} sx={{ color: '#666666' }}>
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ color: '#6b7280', mr: 2 }}>
                {formatValue(getValueByPath(editedData, fieldPath) ?? value)}
              </Typography>
              <EditButton size="small" onClick={() => handleEdit(fieldPath)}>
                <EditIcon />
              </EditButton>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <PageContainer>
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Review & Confirm
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1a365d',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Button onClick={handleExit} sx={{ color: '#666666', textTransform: 'none' }}>
            Exit
          </Button>
        </Box>
      </HeaderSection>

      <MainContent>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', mb: 3, textAlign: 'center' }}>
          Review Your Information
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#6b7280', mb: 4, textAlign: 'center' }}>
          Please review all the information below. You can edit any section by clicking the edit icon.
        </Typography>

        {/* Property Information */}
        <SummarySection>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
            Property Information
          </Typography>
          <SummaryCard>
            <CardContent>
              {renderEditableField('Property Address', address, 'address')}
              {renderEditableField('Sell Property', sellChecked ? 'Yes' : 'No', 'sellChecked', 'radio', [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ])}
              {renderEditableField('List Property', listChecked ? 'Yes' : 'No', 'listChecked', 'radio', [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ])}
            </CardContent>
          </SummaryCard>
        </SummarySection>

        {/* Moving Details */}
        <SummarySection>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
            Moving Details
          </Typography>
          <SummaryCard>
            <CardContent>
              {renderEditableField('Agent Relationship', movingDetails, 'movingDetails', 'select', [
                { value: 'no-agent', label: 'No agent yet' },
                { value: 'working-with-agent', label: 'Working with an agent' },
                { value: 'signed-agreement', label: 'Signed agreement with agent' }
              ])}
              {renderEditableField('Timing', sellTiming || listTiming, 'sellTiming', 'select', [
                { value: 'asap', label: 'As soon as possible' },
                { value: '1month', label: 'Within 1 month' },
                { value: '2-3months', label: '2-3 months' },
                { value: '4+months', label: '4+ months' },
                { value: 'browsing', label: 'Just browsing' }
              ])}
            </CardContent>
          </SummaryCard>
        </SummarySection>

        {/* Home Details */}
        <SummarySection>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
            Home Details
          </Typography>
          <SummaryCard>
            <CardContent>
              {renderEditableField('Home Type', getValueByPath(formData, 'homeDetails.homeType'), 'homeDetails.homeType')}
              {renderEditableField('Square Footage', getValueByPath(formData, 'homeDetails.squareFeet'), 'homeDetails.squareFeet')}
              {renderEditableField('Year Built', getValueByPath(formData, 'homeDetails.yearBuilt'), 'homeDetails.yearBuilt')}
              {renderEditableField('Bedrooms', getValueByPath(formData, 'homeDetails.bedrooms'), 'homeDetails.bedrooms')}
              {renderEditableField('Full Bathrooms', getValueByPath(formData, 'homeDetails.fullBaths'), 'homeDetails.fullBaths')}
              {renderEditableField('Floors', getValueByPath(formData, 'homeDetails.floors'), 'homeDetails.floors')}
              {renderEditableField('Pool Type', getValueByPath(formData, 'homeDetails2.poolType'), 'homeDetails2.poolType', 'select', [
                { value: '', label: '' },
                { value: 'No', label: 'No' },
                { value: 'In-ground', label: 'In-ground' },
                { value: 'Above ground', label: 'Above ground' },
                { value: 'Community Pool', label: 'Community Pool' }
              ])}
              {renderEditableField('Garage Spaces', getValueByPath(formData, 'homeDetails2.garageSpaces'), 'homeDetails2.garageSpaces')}
              {renderEditableField('Carport Spaces', getValueByPath(formData, 'homeDetails2.carportSpaces'), 'homeDetails2.carportSpaces')}
              {renderEditableField('Has Basement', getValueByPath(formData, 'homeDetails3.hasBasement'), 'homeDetails3.hasBasement', 'radio', [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ])}
              {getValueByPath(formData, 'homeDetails3.hasBasement') === 'yes' && (
                <>
                  {renderEditableField('Basement Use', getValueByPath(formData, 'homeDetails3.basementUse'), 'homeDetails3.basementUse', 'select', [
                    { value: 'Not Functional', label: 'Not Functional' },
                    { value: 'For Storage', label: 'For Storage' },
                    { value: 'Fully Functional and Furnishable', label: 'Fully Functional and Furnishable' }
                  ])}
                  {renderEditableField('Knows Square Footage', getValueByPath(formData, 'homeDetails3.knowsSqft'), 'homeDetails3.knowsSqft', 'radio', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ])}
                  {getValueByPath(formData, 'homeDetails3.knowsSqft') === 'yes' && (
                    <>
                      {renderEditableField('Finished Area (sqft)', getValueByPath(formData, 'homeDetails3.finishedSqft'), 'homeDetails3.finishedSqft')}
                      {renderEditableField('Unfinished Area (sqft)', getValueByPath(formData, 'homeDetails3.unfinishedSqft'), 'homeDetails3.unfinishedSqft')}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </SummaryCard>
        </SummarySection>

        {/* Home Quality */}
        <SummarySection>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
            Home Quality
          </Typography>
          <SummaryCard>
            <CardContent>
              {renderEditableField('Exterior Quality', homeQuality, 'homeQuality', 'select', [
                { value: 'Fixer upper', label: 'Fixer upper' },
                { value: 'Dated', label: 'Dated' },
                { value: 'Standard', label: 'Standard' },
                { value: 'High-end', label: 'High-end' },
                { value: 'Luxury', label: 'Luxury' }
              ])}
              {renderEditableField('Living Room Quality', homeQuality2, 'homeQuality2', 'select', [
                { value: 'Fixer upper', label: 'Fixer upper' },
                { value: 'Dated', label: 'Dated' },
                { value: 'Standard', label: 'Standard' },
                { value: 'High-end', label: 'High-end' },
                { value: 'Luxury', label: 'Luxury' }
              ])}
              {renderEditableField('Bathroom Quality', homeQuality3, 'homeQuality3', 'select', [
                { value: 'Fixer upper', label: 'Fixer upper' },
                { value: 'Dated', label: 'Dated' },
                { value: 'Standard', label: 'Standard' },
                { value: 'High-end', label: 'High-end' },
                { value: 'Luxury', label: 'Luxury' }
              ])}
              {renderEditableField('Kitchen Quality', homeQuality4, 'homeQuality4', 'select', [
                { value: 'Fixer upper', label: 'Fixer upper' },
                { value: 'Dated', label: 'Dated' },
                { value: 'Standard', label: 'Standard' },
                { value: 'High-end', label: 'High-end' },
                { value: 'Luxury', label: 'Luxury' }
              ])}
            </CardContent>
          </SummaryCard>
        </SummarySection>

        {/* Additional Information */}
        <SummarySection>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
            Additional Information
          </Typography>
          <SummaryCard>
            <CardContent>
              {renderEditableField('Kitchen Countertops', countertops, 'countertops', 'select', [
                { value: 'Granite', label: 'Granite' },
                { value: 'Quartz', label: 'Quartz' },
                { value: 'Marble', label: 'Marble' },
                { value: 'Butcher Block', label: 'Butcher Block' },
                { value: 'Laminate', label: 'Laminate' },
                { value: 'Tile', label: 'Tile' },
                { value: 'Concrete', label: 'Concrete' },
                { value: 'Other', label: 'Other' }
              ])}
              {renderEditableField('HOA', hoa, 'hoa', 'radio', [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ])}
              {hoa === 'yes' && (
                <>
                  {renderEditableField('Community Type', communityTypes, 'communityTypes')}
                  {renderEditableField('Guard at Entrance', guard, 'guard', 'radio', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ])}
                </>
              )}
              {renderEditableField('Property Conditions', propertyConditions, 'propertyConditions')}
              {propertyConditions.includes('Other') && (
                renderEditableField('Other Details', otherDetails, 'otherDetails')
              )}
            </CardContent>
          </SummaryCard>
        </SummarySection>

        {/* Contact Information */}
        <SummarySection>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
            Contact Information
          </Typography>
          <SummaryCard>
            <CardContent>
              {renderEditableField('First Name', firstName, 'firstName')}
              {renderEditableField('Last Name', lastName, 'lastName')}
              {renderEditableField('Phone Number', phoneNumber, 'phoneNumber')}
            </CardContent>
          </SummaryCard>
        </SummarySection>
      </MainContent>

      {/* Footer fixed to viewport bottom; content spacing handled by PageContainer padding-bottom */}
      <Box sx={{ 
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        px: { xs: '1rem', md: '2rem' },
        py: { xs: '0.75rem', md: '1rem' },
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid #e0e0e0',
        zIndex: 10
      }}>
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderColor: '#1a365d',
            color: '#1a365d',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#0d2340',
              backgroundColor: 'rgba(26, 54, 93, 0.04)',
            }
          }}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          variant="contained"
          sx={{
            backgroundColor: '#1a365d',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#0d2340',
            }
          }}
        >
          Continue to Results
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SellListSummaryPage; 