import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { WorkspaceConfig } from '../../data/workspaces/types';
import { brandColors } from '../../theme';

interface WorkspaceSelectorProps {
  workspaces: WorkspaceConfig[];
  selectedWorkspace: string;
  onWorkspaceChange: (workspaceId: string) => void;
  disabled?: boolean;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  workspaces,
  selectedWorkspace,
  onWorkspaceChange,
  disabled = false,
}) => {
  const selectedWorkspaceConfig = workspaces.find(w => w.id === selectedWorkspace);

  return (
    <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
      <FormControl fullWidth size="small">
        <Select
          value={selectedWorkspace}
          onChange={(e) => onWorkspaceChange(e.target.value)}
          disabled={disabled}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            backgroundColor: brandColors.surfaces.primary,
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.borders.secondary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary,
            },
          }}
          renderValue={(value) => {
            if (!selectedWorkspaceConfig) return 'Select Workspace';
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: brandColors.primary }}>
                  {selectedWorkspaceConfig.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedWorkspaceConfig.name}
                </Typography>
                <Chip 
                  label={selectedWorkspaceConfig.name} 
                  size="small" 
                  sx={{ 
                    backgroundColor: brandColors.primary,
                    color: brandColors.text.inverse,
                    fontSize: '0.75rem',
                    height: 20,
                  }} 
                />
              </Box>
            );
          }}
        >
          {workspaces.map((workspace) => (
            <MenuItem key={workspace.id} value={workspace.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ color: brandColors.primary }}>
                  {workspace.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {workspace.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {workspace.description}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default WorkspaceSelector;
