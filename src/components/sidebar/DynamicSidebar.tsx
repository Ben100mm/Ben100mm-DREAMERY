import React from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  Paper,
} from '@mui/material';
import { brandColors } from '../../theme';
import WorkspaceSelector from './WorkspaceSelector';
import SidebarItem from './SidebarItem';
import { WorkspaceConfig, WorkspaceItem } from '../../data/workspaces/types';

interface DynamicSidebarProps {
  workspaces: WorkspaceConfig[];
  selectedWorkspace: string;
  onWorkspaceChange: (workspaceId: string) => void;
  currentWorkspace: WorkspaceConfig | null;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  favoriteItems: string[];
  onToggleFavorite: (itemId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  workspaces,
  selectedWorkspace,
  onWorkspaceChange,
  currentWorkspace,
  activeTab,
  onTabChange,
  favoriteItems,
  onToggleFavorite,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  if (!currentWorkspace) return null;

  return (
    <Box
      sx={{
        width: isCollapsed ? 80 : 280,
        flexShrink: 0,
        background: brandColors.backgrounds.secondary,
        height: '100%',
        overflow: 'auto',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Workspace Selector */}
      {!isCollapsed && (
        <WorkspaceSelector
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onWorkspaceChange={onWorkspaceChange}
        />
      )}

      {/* Station Button */}
      <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: brandColors.primary,
            color: brandColors.text.inverse,
            py: 2,
            fontWeight: 600,
            fontSize: isCollapsed ? '0.75rem' : '1.1rem',
            '&:hover': {
              backgroundColor: brandColors.actions.primary,
            },
          }}
        >
          {isCollapsed ? 'S' : 'Station'}
        </Button>
      </Box>

      {/* Favorites Section */}
      {!isCollapsed && favoriteItems.length > 0 && (
        <>
          <Box sx={{ px: 2, mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              FAVORITES
            </Typography>
          </Box>
          <Box sx={{ px: 0, mb: 2 }}>
            {favoriteItems.map((itemId) => {
              const item = currentWorkspace.sidebarItems.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  isFavorite={true}
                  onClick={onTabChange}
                  onToggleFavorite={onToggleFavorite}
                />
              );
            })}
          </Box>
          <Divider sx={{ mx: 2, mb: 2 }} />
        </>
      )}

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {currentWorkspace.sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            isFavorite={favoriteItems.includes(item.id)}
            onClick={onTabChange}
            onToggleFavorite={onToggleFavorite}
            showFavoriteButton={!isCollapsed}
          />
        ))}
      </Box>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={onToggleCollapse}
            sx={{ fontSize: '0.75rem' }}
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DynamicSidebar;
