import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  RestoreFromTrash as RestoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SaveProgressIndicator, StatusChip } from './UXComponents';

// Styled components
const SaveStatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const AutoSaveIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

// Save Progress Hook
export const useSaveProgress = (
  initialData: any,
  saveFunction: (data: any) => Promise<void>,
  autoSaveInterval: number = 30000, // 30 seconds
  enableAutoSave: boolean = true
) => {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveHistory, setSaveHistory] = useState<Array<{ timestamp: Date; data: any }>>([]);
  const [error, setError] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef(JSON.stringify(initialData));

  // Check for changes
  const checkForChanges = useCallback(() => {
    const currentDataString = JSON.stringify(data);
    const hasChanges = currentDataString !== lastSavedDataRef.current;
    setHasUnsavedChanges(hasChanges);
    return hasChanges;
  }, [data]);

  // Save function
  const save = useCallback(async (showSuccessMessage = true) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      await saveFunction(data);
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastSavedDataRef.current = JSON.stringify(data);
      
      // Add to save history
      setSaveHistory(prev => [
        { timestamp: new Date(), data: JSON.parse(JSON.stringify(data)) },
        ...prev.slice(0, 9) // Keep last 10 saves
      ]);
      
      if (showSuccessMessage) {
        // Success message will be handled by the component
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [data, saveFunction, isSaving]);

  // Auto-save effect
  useEffect(() => {
    if (!enableAutoSave || !hasUnsavedChanges) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges) {
        save(false); // Don't show success message for auto-save
      }
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, autoSaveInterval, enableAutoSave, save]);

  // Update data function
  const updateData = useCallback((updates: Partial<typeof data>) => {
    setData((prev: typeof data) => ({ ...prev, ...updates }));
  }, []);

  // Reset to last saved
  const resetToLastSaved = useCallback(() => {
    if (lastSavedDataRef.current) {
      setData(JSON.parse(lastSavedDataRef.current));
      setHasUnsavedChanges(false);
    }
  }, []);

  // Restore from history
  const restoreFromHistory = useCallback((historyItem: { timestamp: Date; data: any }) => {
    setData(historyItem.data);
    setHasUnsavedChanges(true);
  }, []);

  // Export data
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Import data
  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setData(importedData);
          setHasUnsavedChanges(true);
          resolve();
        } catch (err) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    data,
    updateData,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveHistory,
    error,
    save,
    resetToLastSaved,
    restoreFromHistory,
    exportData,
    importData,
    checkForChanges,
  };
};

// Save Progress Component
export const SaveProgressComponent: React.FC<{
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  showAutoSave?: boolean;
  autoSaveInterval?: number;
}> = ({
  isSaving,
  lastSaved,
  hasUnsavedChanges,
  onSave,
  onReset,
  onExport,
  onImport,
  showAutoSave = true,
  autoSaveInterval = 30000,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    if (importFile && onImport) {
      onImport(importFile);
      setImportFile(null);
      setShowImportDialog(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  return (
    <SaveStatusContainer>
      <SaveProgressIndicator
        saved={!hasUnsavedChanges}
        lastSaved={lastSaved ?? undefined}
        onSave={onSave}
      />
      
      {isSaving && (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={16} />
          <Typography variant="caption">Saving...</Typography>
        </Box>
      )}
      
      {showAutoSave && (
        <AutoSaveIndicator>
          <InfoIcon fontSize="small" />
          Auto-save every {Math.round(autoSaveInterval / 1000)}s
        </AutoSaveIndicator>
      )}
      
      <Box display="flex" gap={1}>
        {onReset && hasUnsavedChanges && (
          <Tooltip title="Reset to last saved">
            <IconButton size="small" onClick={onReset}>
              <RestoreIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onExport && (
          <Tooltip title="Export data">
            <IconButton size="small" onClick={onExport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onImport && (
          <Tooltip title="Import data">
            <IconButton size="small" onClick={() => setShowImportDialog(true)}>
              <UploadIcon />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Save history">
          <IconButton size="small" onClick={() => setShowHistory(true)}>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Save History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Save History</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recent saves and their timestamps
          </Typography>
          <List>
            {lastSaved && (
              <ListItem>
                <ListItemIcon>
                  <CloudDoneIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Last Saved"
                  secondary={lastSaved.toLocaleString()}
                />
              </ListItem>
            )}
            <Divider />
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Current Status"
                secondary={hasUnsavedChanges ? 'Has unsaved changes' : 'All changes saved'}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onClose={() => setShowImportDialog(false)}>
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a JSON file to import. This will replace your current data.
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<UploadIcon />}
            fullWidth
            sx={{ mt: 2 }}
          >
            Choose File
          </Button>
          {importFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {importFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!importFile}
            variant="contained"
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </SaveStatusContainer>
  );
};

// Auto-save Status Component
export const AutoSaveStatus: React.FC<{
  enabled: boolean;
  interval: number;
  lastAutoSave?: Date;
  nextAutoSave?: Date;
}> = ({ enabled, interval, lastAutoSave, nextAutoSave }) => {
  if (!enabled) return null;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <StatusChip
        status={enabled ? 'info' : 'default'}
        label="Auto-save"
        size="small"
      />
      <Typography variant="caption" color="text.secondary">
        Every {Math.round(interval / 1000)}s
      </Typography>
      {lastAutoSave && (
        <Typography variant="caption" color="text.secondary">
                          - Last: {lastAutoSave.toLocaleTimeString()}
        </Typography>
      )}
      {nextAutoSave && (
        <Typography variant="caption" color="text.secondary">
                          - Next: {nextAutoSave.toLocaleTimeString()}
        </Typography>
      )}
    </Box>
  );
};

// Save Progress Bar Component
export const SaveProgressBar: React.FC<{
  progress: number;
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
}> = ({ progress, status, message }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'saving': return 'primary';
      case 'saved': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saving': return <CircularProgress size={16} />;
      case 'saved': return <CloudDoneIcon />;
      case 'error': return <WarningIcon />;
      default: return null;
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {getStatusIcon()}
        <Typography variant="body2" color="text.secondary">
          {message || `Save Status: ${status}`}
        </Typography>
      </Box>
      
      {status === 'saving' && (
        <Box
          sx={{
            width: '100%',
            height: 4,
            backgroundColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: `${getStatusColor()}.main`,
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      )}
      
      {status === 'saved' && (
        <Typography variant="caption" color="success.main">
                        Saved successfully
        </Typography>
      )}
      
      {status === 'error' && (
        <Typography variant="caption" color="error.main">
                          Save failed
        </Typography>
      )}
    </Box>
  );
};
