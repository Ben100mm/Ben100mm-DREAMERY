import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { WorkspaceItem } from '../../data/workspaces/types';
import { brandColors } from '../../theme';

interface SidebarItemProps {
  item: WorkspaceItem;
  isActive: boolean;
  isFavorite: boolean;
  onClick: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
  showFavoriteButton?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isFavorite,
  onClick,
  onToggleFavorite,
  showFavoriteButton = true,
}) => {
  return (
    <Box
      onClick={() => onClick(item.id)}
      sx={{
        mx: 1,
        mb: 0.5,
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        backgroundColor: isActive ? brandColors.primary : 'transparent',
        color: isActive ? brandColors.text.inverse : 'inherit',
        '&:hover': {
          backgroundColor: isActive ? brandColors.primary : brandColors.interactive.hover,
        },
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        position: 'relative',
      }}
    >
       <Box sx={{ color: isActive ? 'white' : brandColors.primary }}>
        {item.icon}
      </Box>
      <Typography 
        variant="body2"
        sx={{ 
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? 'white' : 'inherit',
          flex: 1,
        }}
      >
        {item.label}
      </Typography>
      {showFavoriteButton && (
        <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            sx={{
              color: isActive ? 'white' : isFavorite ? '#ffc107' : 'rgba(0, 0, 0, 0.54)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {isFavorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SidebarItem;
