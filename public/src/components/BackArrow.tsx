import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { brandColors } from '../theme/theme';

interface BackArrowProps {
  title?: string;
  sx?: any;
}

const BackArrow: React.FC<BackArrowProps> = ({ 
  title = "Back to Dreamery's Listing Agents Hub",
  sx = {}
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // Navigate to the main hub - you can adjust this route as needed
    navigate('/');
  };

  return (
    <Tooltip title={title}>
      <IconButton
        onClick={handleBackClick}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          '&:hover': { 
            backgroundColor: '#f5f5f5',
            borderColor: brandColors.primary 
          },
          ...sx
        }}
      >
        <ChevronLeftIcon sx={{ color: brandColors.primary }} />
      </IconButton>
    </Tooltip>
  );
};

export default BackArrow;
