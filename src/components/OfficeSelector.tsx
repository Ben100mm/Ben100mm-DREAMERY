import React, { useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Business as BusinessIcon,
  LocationCity as LocationIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';

interface OfficeSelectorProps {
  selectedOffice?: string;
  onOfficeChange?: (office: string) => void;
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  sx?: any;
}

/**
 * OfficeSelector - Dropdown for selecting agent's office location
 * 
 * Used in WorkspacesAgentPage to filter by office
 */
const OfficeSelector: React.FC<OfficeSelectorProps> = ({
  selectedOffice = 'ALL',
  onOfficeChange,
  variant = 'outlined',
  size = 'small',
  sx = {},
}) => {
  const [currentOffice, setCurrentOffice] = useState(selectedOffice);

  const officeOptions = [
    { value: 'ALL', label: 'All Offices', icon: <BusinessIcon fontSize="small" /> },
    { value: 'downtown', label: 'Downtown Office', icon: <LocationIcon fontSize="small" /> },
    { value: 'north', label: 'North Office', icon: <LocationIcon fontSize="small" /> },
    { value: 'south', label: 'South Office', icon: <LocationIcon fontSize="small" /> },
    { value: 'east', label: 'East Office', icon: <LocationIcon fontSize="small" /> },
    { value: 'west', label: 'West Office', icon: <LocationIcon fontSize="small" /> },
    { value: 'suburban', label: 'Suburban Office', icon: <LocationIcon fontSize="small" /> },
    { value: 'waterfront', label: 'Waterfront Office', icon: <LocationIcon fontSize="small" /> },
  ];

  const handleOfficeChange = (event: any) => {
    const value = event.target.value;
    setCurrentOffice(value);

    console.log('OfficeSelector: Office selected:', value);
    
    if (onOfficeChange) {
      onOfficeChange(value);
    }
  };

  return (
    <FormControl 
      variant={variant}
      size={size}
      sx={{ 
        minWidth: 200,
        ...sx 
      }}
    >
      <Select
        value={currentOffice}
        onChange={handleOfficeChange}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          backgroundColor: brandColors.backgrounds.primary,
          color: brandColors.text.primary,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: brandColors.borders.secondary,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: brandColors.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brandColors.primary,
          },
        }}
      >
        {officeOptions.map((office) => (
          <MenuItem key={office.value} value={office.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: brandColors.primary, display: 'flex' }}>
                {office.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {office.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OfficeSelector;

