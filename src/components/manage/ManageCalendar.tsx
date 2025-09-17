import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const ManageCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: '',
    property: '',
    time: '',
    description: '',
  });

  // Mock calendar events
  const events = [
    {
      id: 1,
      title: 'Property Inspection',
      type: 'inspection',
      property: '123 Main St',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Maintenance - AC Repair',
      type: 'maintenance',
      property: '456 Oak Ave',
      date: '2024-01-15',
      time: '2:00 PM',
      status: 'in_progress',
    },
    {
      id: 3,
      title: 'Tenant Move-in',
      type: 'move_in',
      property: '789 Pine St',
      date: '2024-01-16',
      time: '9:00 AM',
      status: 'scheduled',
    },
    {
      id: 4,
      title: 'Lease Renewal Meeting',
      type: 'meeting',
      property: '321 Elm St',
      date: '2024-01-17',
      time: '3:00 PM',
      status: 'scheduled',
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'inspection': return 'primary';
      case 'maintenance': return 'warning';
      case 'move_in': return 'success';
      case 'meeting': return 'info';
      default: return 'default';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <HomeIcon />;
      case 'maintenance': return <BuildIcon />;
      case 'move_in': return <PersonIcon />;
      case 'meeting': return <ScheduleIcon />;
      default: return <CalendarIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const handleCreateEvent = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEvent({
      title: '',
      type: '',
      property: '',
      time: '',
      description: '',
    });
  };

  const handleSaveEvent = () => {
    // In real app, this would save to API
    console.log('Saving event:', newEvent);
    handleCloseDialog();
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Property Management Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
          sx={{ bgcolor: brandColors.primary }}
        >
          Schedule Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                January 2024
              </Typography>
              
              {/* Calendar Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 1, 
                mb: 3 
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Box key={day} sx={{ p: 1, textAlign: 'center', fontWeight: 'bold' }}>
                    {day}
                  </Box>
                ))}
                
                {/* Calendar days would go here - simplified for demo */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <Box
                    key={day}
                    sx={{
                      p: 1,
                      minHeight: 60,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Typography variant="body2">{day}</Typography>
                    {/* Events for this day would be rendered here */}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upcoming Events
              </Typography>
              <List>
                {events.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          color: `${getEventTypeColor(event.type)}.main`,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {getEventTypeIcon(event.type)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {event.title}
                            </Typography>
                            <Chip 
                              label={event.status} 
                              size="small" 
                              color={getStatusColor(event.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {event.property}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {event.date} at {event.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < events.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                label="Event Type"
              >
                <MenuItem value="inspection">Property Inspection</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="move_in">Tenant Move-in</MenuItem>
                <MenuItem value="move_out">Tenant Move-out</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="showing">Property Showing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Property</InputLabel>
              <Select
                value={newEvent.property}
                onChange={(e) => setNewEvent({ ...newEvent, property: e.target.value })}
                label="Property"
              >
                <MenuItem value="123 Main St">123 Main St</MenuItem>
                <MenuItem value="456 Oak Ave">456 Oak Ave</MenuItem>
                <MenuItem value="789 Pine St">789 Pine St</MenuItem>
                <MenuItem value="321 Elm St">321 Elm St</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Time"
              type="datetime-local"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            Schedule Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCalendar;
