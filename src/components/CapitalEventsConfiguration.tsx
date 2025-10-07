/**
 * Capital Events Configuration Component
 * 
 * UI for adding, editing, and managing capital events in cash flow projections
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
  Alert,
  Grid,
  Divider,
  Tooltip,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Warning,
  CalendarToday,
  AttachMoney,
  Build,
  Home,
  Info
} from '@mui/icons-material';
import {
  CapitalEvent,
  CapitalEventType,
  CAPITAL_EVENT_PRESETS,
  createCapitalEvent
} from '../utils/cashFlowProjections';

// ============================================================================
// Types
// ============================================================================

interface CapitalEventsConfigurationProps {
  events: CapitalEvent[];
  onChange: (events: CapitalEvent[]) => void;
  projectionYears: number;
  readonly?: boolean;
}

interface EventFormData {
  year: number;
  type: CapitalEventType;
  description: string;
  amount: number;
  isCapitalImprovement: boolean;
  valueAddPercentage: number;
}

// ============================================================================
// Component
// ============================================================================

export const CapitalEventsConfiguration: React.FC<CapitalEventsConfigurationProps> = ({
  events,
  onChange,
  projectionYears,
  readonly = false
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CapitalEvent | null>(null);
  const [presetsDialogOpen, setPresetsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    year: 1,
    type: CapitalEventType.OTHER,
    description: '',
    amount: 0,
    isCapitalImprovement: false,
    valueAddPercentage: 100
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      year: 1,
      type: CapitalEventType.OTHER,
      description: '',
      amount: 0,
      isCapitalImprovement: false,
      valueAddPercentage: 100
    });
    setEditingEvent(null);
  };

  // Open dialog to add new event
  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog to edit existing event
  const handleEdit = (event: CapitalEvent) => {
    setEditingEvent(event);
    setFormData({
      year: event.year,
      type: event.type,
      description: event.description,
      amount: event.amount,
      isCapitalImprovement: event.isCapitalImprovement,
      valueAddPercentage: (event.valueAddPercentage || 1) * 100
    });
    setDialogOpen(true);
  };

  // Delete event
  const handleDelete = (eventId: string) => {
    onChange(events.filter(e => e.id !== eventId));
  };

  // Save event
  const handleSave = () => {
    if (formData.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (formData.year < 1 || formData.year > projectionYears) {
      alert(`Year must be between 1 and ${projectionYears}`);
      return;
    }

    const newEvent: CapitalEvent = {
      id: editingEvent?.id || `event-${Date.now()}-${Math.random()}`,
      year: formData.year,
      type: formData.type,
      description: formData.description || formData.type,
      amount: formData.amount,
      isCapitalImprovement: formData.isCapitalImprovement,
      valueAddPercentage: formData.valueAddPercentage / 100
    };

    if (editingEvent) {
      // Update existing
      onChange(events.map(e => e.id === editingEvent.id ? newEvent : e));
    } else {
      // Add new
      onChange([...events, newEvent]);
    }

    setDialogOpen(false);
    resetForm();
  };

  // Add preset event
  const handleAddPreset = (presetFn: (year: number, ...args: any[]) => CapitalEvent) => {
    const year = formData.year || 1;
    const presetEvent = presetFn(year);
    onChange([...events, presetEvent]);
    setPresetsDialogOpen(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get event icon
  const getEventIcon = (type: CapitalEventType) => {
    switch (type) {
      case CapitalEventType.ROOF_REPLACEMENT:
      case CapitalEventType.HVAC_REPLACEMENT:
      case CapitalEventType.FOUNDATION_REPAIR:
        return <Build />;
      case CapitalEventType.MAJOR_RENOVATION:
      case CapitalEventType.APPLIANCE_REPLACEMENT:
        return <Home />;
      default:
        return <Build />;
    }
  };

  // Calculate total capital events by year
  const eventsByYear = events.reduce((acc, event) => {
    acc[event.year] = (acc[event.year] || 0) + event.amount;
    return acc;
  }, {} as Record<number, number>);

  const totalCapitalEvents = events.reduce((sum, event) => sum + event.amount, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday color="primary" />
          <Typography variant="h6">Capital Events</Typography>
          <Chip
            label={`${events.length} event${events.length !== 1 ? 's' : ''}`}
            size="small"
            color="primary"
          />
        </Box>
        {!readonly && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => setPresetsDialogOpen(true)}
            >
              Add Preset
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={handleAddNew}
            >
              Add Custom Event
            </Button>
          </Box>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Capital Events
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(totalCapitalEvents)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Capital Improvements
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(
                  events
                    .filter(e => e.isCapitalImprovement)
                    .reduce((sum, e) => sum + e.amount, 0)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Events List */}
      {events.length === 0 ? (
        <Alert severity="info" icon={<Info />}>
          No capital events scheduled. Add events to model major expenses or improvements over time.
        </Alert>
      ) : (
        <Paper sx={{ p: 2 }}>
          {events
            .sort((a, b) => a.year - b.year)
            .map((event) => (
              <Box
                key={event.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '80px' }}>
                  {getEventIcon(event.type)}
                  <Typography variant="body2" fontWeight={600}>
                    Year {event.year}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {event.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={event.type}
                      size="small"
                      variant="outlined"
                    />
                    {event.isCapitalImprovement && (
                      <Chip
                        label="Capital Improvement"
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" color="error.main">
                    {formatCurrency(event.amount)}
                  </Typography>
                  {!readonly && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(event)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(event.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
        </Paper>
      )}

      {/* Year Summary */}
      {events.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Events by Year
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Array.from({ length: projectionYears }, (_, i) => i + 1).map(year => {
              const yearTotal = eventsByYear[year] || 0;
              return (
                <Chip
                  key={year}
                  label={`Year ${year}: ${formatCurrency(yearTotal)}`}
                  size="small"
                  color={yearTotal > 0 ? 'warning' : 'default'}
                  variant={yearTotal > 0 ? 'filled' : 'outlined'}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? 'Edit Capital Event' : 'Add Capital Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
              InputProps={{
                inputProps: { min: 1, max: projectionYears }
              }}
              helperText={`Year 1 to ${projectionYears}`}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CapitalEventType })}
                label="Event Type"
              >
                {Object.values(CapitalEventType).map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Replace roof on main house"
              fullWidth
            />

            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 100 }
              }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isCapitalImprovement}
                  onChange={(e) => setFormData({ ...formData, isCapitalImprovement: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Capital Improvement</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Adds value to the property
                  </Typography>
                </Box>
              }
            />

            {formData.isCapitalImprovement && (
              <TextField
                label="Value Add Percentage"
                type="number"
                value={formData.valueAddPercentage}
                onChange={(e) => setFormData({ ...formData, valueAddPercentage: parseFloat(e.target.value) || 100 })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0, max: 200, step: 5 }
                }}
                helperText="What % of the cost adds to property value (typically 50-100%)"
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); resetForm(); }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editingEvent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Presets Dialog */}
      <Dialog
        open={presetsDialogOpen}
        onClose={() => setPresetsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Preset Capital Event</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Year to add event"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
              InputProps={{
                inputProps: { min: 1, max: projectionYears }
              }}
              fullWidth
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 2 }}>Available Presets</Divider>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent onClick={() => handleAddPreset(CAPITAL_EVENT_PRESETS.ROOF_REPLACEMENT)}>
                    <Typography variant="h6" gutterBottom>
                      Roof Replacement
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~$16,000 (2,000 sqft @ $8/sqft)
                    </Typography>
                    <Chip label="80% Value Add" size="small" color="success" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent onClick={() => handleAddPreset(CAPITAL_EVENT_PRESETS.HVAC_REPLACEMENT)}>
                    <Typography variant="h6" gutterBottom>
                      HVAC Replacement
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~$7,500 (3 tons @ $2,500/ton)
                    </Typography>
                    <Chip label="70% Value Add" size="small" color="success" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent onClick={() => handleAddPreset(CAPITAL_EVENT_PRESETS.KITCHEN_RENOVATION)}>
                    <Typography variant="h6" gutterBottom>
                      Kitchen Renovation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~$25,000 (typical budget)
                    </Typography>
                    <Chip label="100% Value Add" size="small" color="success" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent onClick={() => handleAddPreset(CAPITAL_EVENT_PRESETS.EXTERIOR_PAINT)}>
                    <Typography variant="h6" gutterBottom>
                      Exterior Painting
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~$6,000 (2,000 sqft @ $3/sqft)
                    </Typography>
                    <Chip label="Maintenance" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPresetsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CapitalEventsConfiguration;

