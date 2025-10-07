import React, { useState, useContext, useEffect } from 'react';
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

  // Category-level options (Buyer first, then A-Z)
  const categoryOptions = [
    { value: 'buyer', label: 'Buyer', icon: <PersonIcon />, route: '/workspaces/buyer', roleMapping: 'Retail Buyer' },
    { value: 'agent', label: 'Agent', icon: <PersonIcon />, route: '/workspaces/agent', roleMapping: 'Real Estate Agent' },
    { value: 'brokerages', label: 'Brokerages', icon: <AccountBalanceIcon />, route: '/workspaces/brokerages', roleMapping: 'Real Estate Broker' },
    { value: 'businesses', label: 'Businesses', icon: <BusinessIcon />, route: '/workspaces/businesses', roleMapping: 'Business' },
  ];

  // Map buyer roles to "buyer" category
  const buyerRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];

  // Sync local state with context when userRole changes
  useEffect(() => {
    const roleToDisplay = currentRole || userRole;
    if (roleToDisplay) {
      // If it's a buyer role, display as "buyer" category
      if (buyerRoles.includes(roleToDisplay)) {
        setSelectedValue('buyer');
      } else {
        setSelectedValue(roleToDisplay);
      }
    }
  }, [userRole, currentRole]);

  // All 80+ professional roles (sorted A-Z)
  const professionalRoles = [
    '1031 Exchange Intermediary',
    'Accountant',
    'Acquisition Specialist',
    'AR/VR Developer',
    'Architect',
    'Arborist',
    'Banking Advisor',
    'Bathroom Contractor',
    'Bathroom Designer',
    'Bookkeeper',
    'Certified Public Accountant (CPA)',
    'Color Consultant',
    'Commercial Appraiser',
    'Commercial Inspector',
    'Digital Twins Developer',
    'Disposition Agent',
    'Electrical Contractor',
    'Energy Consultant',
    'Energy Inspector',
    'Entity Formation Service Provider',
    'Escrow Officer',
    'Escrow Service Provider',
    'Estate Planning Attorney',
    'Financial Advisor',
    'Flooring Contractor',
    'Furniture Designer',
    'General Contractor',
    'Handyman',
    'Hard Money Lender',
    'Home Inspector',
    'Housekeeper',
    'HVAC Contractor',
    'Hybrid Purchase Specialist',
    'Insurance Agent',
    'Interior Designer',
    'Kitchen Contractor',
    'Kitchen Designer',
    'Land Surveyor',
    'Landscape Architect',
    'Landscape Cleaner',
    'Landscaper',
    'Landscaping Contractor',
    'Lease Option Specialist',
    'Leasing Agent',
    'Legal Notary Service Provider',
    'Lighting Designer',
    'Limited Partner (LP)',
    'Loan Officer',
    'Long-term Rental Property Manager',
    'Mortgage Broker',
    'Mortgage Lender',
    'Mortgage Underwriter',
    'Notary Public',
    'Painting Contractor',
    'Permit Expeditor',
    'Photographer',
    'Plumbing Contractor',
    'Private Lender',
    'Property Manager',
    'Real Estate Consultant',
    'Real Estate Educator',
    'Real Estate Investment Advisor',
    'Relocation Specialist',
    'Residential Appraiser',
    'Roofing Contractor',
    'Seller Finance Purchase Specialist',
    'Short-term Rental Property Manager',
    'STR Setup & Manager',
    'Subject To Existing Mortgage Purchase Specialist',
    'Tax Advisor',
    'Tenant Screening Agent',
    'Title Agent',
    'Title Insurance Agent',
    'Trust Acquisition Specialist',
    'Turnover Specialist',
    'Videographer',
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
          <em>Select Workspace</em>
        </MenuItem>

        {/* Unified list: Buyer first, then all roles A-Z */}
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

