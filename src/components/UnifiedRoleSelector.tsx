import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { RoleContext } from '../context/RoleContext';

interface UnifiedRoleSelectorProps {
  currentRole?: string;
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  sx?: any;
}

/**
 * UnifiedRoleSelector - Unified dropdown for all workspace categories and professional roles
 * 
 * Categories:
 * - Buyer → /workspaces/buyer
 * - Agent → /workspaces/agent
 * - Brokerages → /workspaces/brokerages
 * - Businesses → /workspaces/businesses
 * 
 * Professional Roles → /workspaces/professional-support (with specific role set)
 */
const UnifiedRoleSelector: React.FC<UnifiedRoleSelectorProps> = ({
  currentRole,
  variant = 'outlined',
  size = 'medium',
  sx = {},
}) => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useContext(RoleContext as any) as any || {};
  const [selectedValue, setSelectedValue] = useState(currentRole || userRole || '');

  // Category-level options
  const categoryOptions = [
    { value: 'buyer', label: 'Buyer', icon: <PersonIcon />, route: '/workspaces/buyer', roleMapping: 'Retail Buyer' },
    { value: 'agent', label: 'Agent', icon: <PersonIcon />, route: '/workspaces/agent', roleMapping: 'Real Estate Agent' },
    { value: 'brokerages', label: 'Brokerages', icon: <AccountBalanceIcon />, route: '/workspaces/brokerages', roleMapping: 'Real Estate Broker' },
    { value: 'businesses', label: 'Businesses', icon: <BusinessIcon />, route: '/workspaces/businesses', roleMapping: 'Business' },
  ];

  // All 80+ professional roles
  const professionalRoles = [
    'Acquisition Specialist',
    'Disposition Agent',
    'Title Agent',
    'Escrow Officer',
    'Notary Public',
    'Residential Appraiser',
    'Commercial Appraiser',
    'Home Inspector',
    'Commercial Inspector',
    'Energy Inspector',
    'Land Surveyor',
    'Insurance Agent',
    'Title Insurance Agent',
    'Mortgage Broker',
    'Mortgage Lender',
    'Loan Officer',
    'Mortgage Underwriter',
    'Hard Money Lender',
    'Private Lender',
    'Limited Partner (LP)',
    'Banking Advisor',
    'Seller Finance Purchase Specialist',
    'Subject To Existing Mortgage Purchase Specialist',
    'Trust Acquisition Specialist',
    'Hybrid Purchase Specialist',
    'Lease Option Specialist',
    'General Contractor',
    'Electrical Contractor',
    'Plumbing Contractor',
    'HVAC Contractor',
    'Roofing Contractor',
    'Painting Contractor',
    'Landscaping Contractor',
    'Flooring Contractor',
    'Kitchen Contractor',
    'Bathroom Contractor',
    'Interior Designer',
    'Architect',
    'Landscape Architect',
    'Kitchen Designer',
    'Bathroom Designer',
    'Lighting Designer',
    'Furniture Designer',
    'Color Consultant',
    'Permit Expeditor',
    'Energy Consultant',
    'Property Manager',
    'Long-term Rental Property Manager',
    'Short-term Rental Property Manager',
    'STR Setup & Manager',
    'Housekeeper',
    'Landscape Cleaner',
    'Turnover Specialist',
    'Handyman',
    'Landscaper',
    'Arborist',
    'Tenant Screening Agent',
    'Leasing Agent',
    'Bookkeeper',
    'Certified Public Accountant (CPA)',
    'Accountant',
    'Photographer',
    'Videographer',
    'AR/VR Developer',
    'Digital Twins Developer',
    'Estate Planning Attorney',
    '1031 Exchange Intermediary',
    'Entity Formation Service Provider',
    'Escrow Service Provider',
    'Legal Notary Service Provider',
    'Real Estate Consultant',
    'Real Estate Educator',
    'Financial Advisor',
    'Tax Advisor',
    'Relocation Specialist',
    'Real Estate Investment Advisor',
  ];

  const handleRoleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);

    // Check if it's a category option
    const categoryOption = categoryOptions.find(opt => opt.value === value);
    
    if (categoryOption) {
      // Category selection: navigate to category workspace
      console.log('UnifiedRoleSelector: Category selected:', categoryOption.label);
      if (setUserRole) {
        setUserRole(categoryOption.roleMapping);
      }
      setTimeout(() => {
        navigate(categoryOption.route);
      }, 100);
    } else {
      // Professional role selection: navigate to professional-support with that role
      console.log('UnifiedRoleSelector: Professional role selected:', value);
      if (setUserRole) {
        setUserRole(value);
      }
      setTimeout(() => {
        navigate('/workspaces/professional-support');
      }, 100);
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
        value={selectedValue}
        onChange={handleRoleChange}
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
        <MenuItem value="" disabled>
          <em>Select Workspace / Role</em>
        </MenuItem>

        {/* Category Options */}
        <Box sx={{ px: 2, py: 1, backgroundColor: brandColors.backgrounds.secondary }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text.secondary }}>
            WORKSPACES
          </Typography>
        </Box>
        {categoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: brandColors.primary, display: 'flex' }}>
                {option.icon}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {option.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Professional Roles */}
        <Box sx={{ px: 2, py: 1, backgroundColor: brandColors.backgrounds.secondary }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text.secondary }}>
            PROFESSIONAL ROLES
          </Typography>
        </Box>
        {professionalRoles.map((role) => (
          <MenuItem key={role} value={role}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: brandColors.primary, display: 'flex' }}>
                <SupportIcon fontSize="small" />
              </Box>
              <Typography variant="body2">
                {role}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UnifiedRoleSelector;

