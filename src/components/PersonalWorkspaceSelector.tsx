import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Home as RentIcon,
  Close as CloseIcon,
  Dashboard as ManageIcon,
  TrendingUp as InvestIcon,
  AccountBalance as FundIcon,
  Build as OperateIcon,
  School as LearnIcon,
  Campaign as AdvertiseIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';

interface PersonalWorkspaceSelectorProps {
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  sx?: any;
}

/**
 * PersonalWorkspaceSelector - Dropdown for personal workspace navigation
 * 
 * Workspaces:
 * - Rent → /workspaces/personal?workspace=rent
 * - Close → /workspaces/personal?workspace=close
 * - Manage → /manage
 * - Invest → /invest
 * - Fund → /fund
 * - Operate → /operate
 * - Learn → /learn
 * - Advertise → /advertise
 */
const PersonalWorkspaceSelector: React.FC<PersonalWorkspaceSelectorProps> = ({
  variant = 'outlined',
  size = 'small',
  sx = {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current workspace from URL path and query params
  const getCurrentWorkspace = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const workspaceParam = searchParams.get('workspace');
    
    // Check query parameter first (for /workspaces/personal?workspace=invest)
    if (workspaceParam) {
      return workspaceParam;
    }
    
    // Check pathname for direct routes
    if (path === '/close/personal') return 'close';
    if (path === '/workspaces/personal') return 'rent';
    if (path === '/rent') return 'rent';
    if (path === '/manage') return 'manage';
    if (path === '/invest') return 'invest';
    if (path === '/fund') return 'fund';
    if (path === '/operate') return 'operate';
    if (path === '/learn') return 'learn';
    if (path === '/advertise') return 'advertise';
    
    return 'rent'; // default
  };
  
  const [selectedWorkspace, setSelectedWorkspace] = useState(getCurrentWorkspace());

  // Update selected workspace when location changes
  useEffect(() => {
    setSelectedWorkspace(getCurrentWorkspace());
  }, [location.pathname, location.search]);

  const workspaceOptions = [
    { value: 'rent', label: 'Rent', icon: <RentIcon fontSize="small" />, route: '/workspaces/personal?workspace=rent' },
    { value: 'close', label: 'Close', icon: <CloseIcon fontSize="small" />, route: '/workspaces/personal?workspace=close' },
    { value: 'manage', label: 'Manage', icon: <ManageIcon fontSize="small" />, route: '/manage' },
    { value: 'invest', label: 'Invest', icon: <InvestIcon fontSize="small" />, route: '/invest' },
    { value: 'fund', label: 'Fund', icon: <FundIcon fontSize="small" />, route: '/fund' },
    { value: 'operate', label: 'Operate', icon: <OperateIcon fontSize="small" />, route: '/operate' },
    { value: 'learn', label: 'Learn', icon: <LearnIcon fontSize="small" />, route: '/learn' },
    { value: 'advertise', label: 'Advertise', icon: <AdvertiseIcon fontSize="small" />, route: '/advertise' },
  ];

  const handleWorkspaceChange = (event: any) => {
    const value = event.target.value;
    setSelectedWorkspace(value);

    const workspace = workspaceOptions.find(opt => opt.value === value);
    
    if (workspace) {
      console.log('PersonalWorkspaceSelector: Workspace selected:', workspace.label);
      navigate(workspace.route);
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
        value={selectedWorkspace}
        onChange={handleWorkspaceChange}
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
        {workspaceOptions.map((workspace) => (
          <MenuItem key={workspace.value} value={workspace.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: brandColors.primary, display: 'flex' }}>
                {workspace.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {workspace.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PersonalWorkspaceSelector;

