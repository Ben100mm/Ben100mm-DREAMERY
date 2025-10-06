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
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
  DirectionsWalk as WalkthroughIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const ClosingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: '',
    property: '',
    time: '',
    description: '',
  });

  // Mock closing calendar events
  const events = [
    {
      id: 1,
      title: 'Home Inspection',
      type: 'inspection',
      property: '123 Main Street, Unit 2A',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Loan Approval Meeting',
      type: 'meeting',
      property: '123 Main Street, Unit 2A',
      date: '2024-01-15',
      time: '2:00 PM',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Title Search Review',
      type: 'review',
      property: '123 Main Street, Unit 2A',
      date: '2024-01-16',
      time: '9:00 AM',
      status: 'scheduled',
    },
    {
      id: 4,
      title: 'Final Walkthrough',
      type: 'walkthrough',
      property: '123 Main Street, Unit 2A',
      date: '2024-01-17',
      time: '3:00 PM',
      status: 'scheduled',
    },
    {
      id: 5,
      title: 'Closing Day',
      type: 'closing',
      property: '123 Main Street, Unit 2A',
      date: '2024-01-18',
      time: '10:00 AM',
      status: 'scheduled',
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'inspection': return 'primary';
      case 'meeting': return 'info';
      case 'review': return 'warning';
      case 'walkthrough': return 'success';
      case 'closing': return 'error';
      default: return 'default';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <BuildIcon />;
      case 'meeting': return <PersonIcon />;
      case 'review': return <SearchIcon />;
      case 'walkthrough': return <WalkthroughIcon />;
      case 'closing': return <GavelIcon />;
      default: return <ScheduleIcon />;
    }
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
    // Here you would typically save the event to your backend
    console.log('Saving event:', newEvent);
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                  Closing Calendar
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    backgroundColor: brandColors.primary,
                    '&:hover': {
                      backgroundColor: brandColors.actions.primary,
                    },
                  }}
                >
                  Schedule Event
                </Button>
              </Box>

              {/* Simple Calendar Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 1, 
                mb: 3,
                textAlign: 'center'
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Typography key={day} variant="subtitle2" sx={{ fontWeight: 600, p: 1 }}>
                    {day}
                  </Typography>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const hasEvent = events.some(event => 
                    new Date(event.date).getDate() === day
                  );
                  return (
                    <Box
                      key={day}
                      sx={{
                        p: 1,
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: hasEvent ? brandColors.backgrounds.selected : 'transparent',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: hasEvent ? brandColors.backgrounds.hover : brandColors.backgrounds.secondary,
                        },
                      }}
                    >
                      <Typography variant="body2">{day}</Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Upcoming Events */}
              <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 600, mb: 2 }}>
                Upcoming Events
              </Typography>
              <List>
                {events.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ color: brandColors.primary }}>
                          {getEventTypeIcon(event.type)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {event.title}
                            </Typography>
                            <Chip
                              label={event.status}
                              size="small"
                              color={getEventTypeColor(event.type) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                              {event.property}
                            </Typography>
                            <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
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

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<BuildIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Schedule Inspection
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Book Meeting
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<WalkthroughIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Schedule Walkthrough
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GavelIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Set Closing Date
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Closing Event</DialogTitle>
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
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="review">Document Review</MenuItem>
                <MenuItem value="walkthrough">Final Walkthrough</MenuItem>
                <MenuItem value="closing">Closing Day</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Property</InputLabel>
              <Select
                value={newEvent.property}
                onChange={(e) => setNewEvent({ ...newEvent, property: e.target.value })}
                label="Property"
              >
                <MenuItem value="123 Main Street, Unit 2A">123 Main Street, Unit 2A</MenuItem>
                <MenuItem value="456 Oak Avenue">456 Oak Avenue</MenuItem>
                <MenuItem value="789 Pine Street">789 Pine Street</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date & Time"
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

export default ClosingCalendar;
