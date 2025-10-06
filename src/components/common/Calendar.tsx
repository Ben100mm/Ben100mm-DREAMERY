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

interface CalendarEvent {
  id: number;
  title: string;
  type: string;
  property: string;
  date: string;
  time: string;
  status: string;
}

interface CalendarProps {
  workspaceType?: 'close' | 'manage' | 'fund' | 'invest' | 'operate';
}

const Calendar: React.FC<CalendarProps> = ({ workspaceType = 'close' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: '',
    property: '',
    time: '',
    description: '',
  });

  // Mock calendar events based on workspace type
  const getEventsForWorkspace = (type: string): CalendarEvent[] => {
    const baseEvents = [
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
    ];

    switch (type) {
      case 'close':
        return [
          ...baseEvents,
          {
            id: 3,
            title: 'Closing Meeting',
            type: 'meeting',
            property: '789 Pine St',
            date: '2024-01-16',
            time: '9:00 AM',
            status: 'scheduled',
          },
          {
            id: 4,
            title: 'Document Review',
            type: 'document',
            property: '321 Elm St',
            date: '2024-01-17',
            time: '3:00 PM',
            status: 'scheduled',
          },
        ];
      case 'manage':
        return [
          ...baseEvents,
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
      case 'fund':
        return [
          {
            id: 1,
            title: 'Investor Meeting',
            type: 'meeting',
            property: '123 Main St',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'scheduled',
          },
          {
            id: 2,
            title: 'Capital Raise Presentation',
            type: 'presentation',
            property: '456 Oak Ave',
            date: '2024-01-15',
            time: '2:00 PM',
            status: 'in_progress',
          },
        ];
      case 'invest':
        return [
          {
            id: 1,
            title: 'Investment Review',
            type: 'review',
            property: '123 Main St',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'scheduled',
          },
          {
            id: 2,
            title: 'Portfolio Analysis',
            type: 'analysis',
            property: '456 Oak Ave',
            date: '2024-01-15',
            time: '2:00 PM',
            status: 'in_progress',
          },
        ];
      case 'operate':
        return [
          {
            id: 1,
            title: 'Project Kickoff',
            type: 'project',
            property: '123 Main St',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'scheduled',
          },
          {
            id: 2,
            title: 'Contractor Meeting',
            type: 'meeting',
            property: '456 Oak Ave',
            date: '2024-01-15',
            time: '2:00 PM',
            status: 'in_progress',
          },
        ];
      default:
        return baseEvents;
    }
  };

  const events = getEventsForWorkspace(workspaceType);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'inspection': return 'primary';
      case 'maintenance': return 'warning';
      case 'move_in': return 'success';
      case 'meeting': return 'info';
      case 'document': return 'secondary';
      case 'presentation': return 'primary';
      case 'review': return 'info';
      case 'analysis': return 'warning';
      case 'project': return 'success';
      default: return 'default';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <HomeIcon />;
      case 'maintenance': return <BuildIcon />;
      case 'move_in': return <PersonIcon />;
      case 'meeting': return <ScheduleIcon />;
      case 'document': return <CheckCircleIcon />;
      case 'presentation': return <ScheduleIcon />;
      case 'review': return <CheckCircleIcon />;
      case 'analysis': return <CheckCircleIcon />;
      case 'project': return <BuildIcon />;
      default: return <ScheduleIcon />;
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
    // Handle saving the event
    console.log('Saving event:', newEvent);
    handleCloseDialog();
  };

  const getWorkspaceTitle = (type: string) => {
    switch (type) {
      case 'close': return 'Closing Calendar';
      case 'manage': return 'Property Management Calendar';
      case 'fund': return 'Fundraising Calendar';
      case 'invest': return 'Investment Calendar';
      case 'operate': return 'Operations Calendar';
      default: return 'Calendar';
    }
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {getWorkspaceTitle(workspaceType)}
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
        <Grid size={{ md: 8, xs: 12 }}>
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
                mb: 2
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Box key={day} sx={{ p: 1, textAlign: 'center', fontWeight: 'bold', color: 'text.secondary' }}>
                    {day}
                  </Box>
                ))}
                
                {/* Calendar days */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const dayEvents = events.filter(event => event.date === `2024-01-${day.toString().padStart(2, '0')}`);
                  return (
                    <Box
                      key={day}
                      sx={{
                        p: 1,
                        minHeight: 60,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        backgroundColor: dayEvents.length > 0 ? 'action.selected' : 'transparent',
                      }}
                    >
                      <Typography variant="body2">{day}</Typography>
                      {dayEvents.slice(0, 2).map(event => (
                        <Chip
                          key={event.id}
                          label={event.title}
                          size="small"
                          color={getEventTypeColor(event.type) as any}
                          sx={{ fontSize: '0.6rem', height: 16, mb: 0.5 }}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{dayEvents.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upcoming Events
              </Typography>
              <List>
                {events.slice(0, 5).map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getEventTypeIcon(event.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={`${event.date} at ${event.time}`}
                      />
                      <Chip
                        label={event.status}
                        size="small"
                        color={getEventTypeColor(event.type) as any}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
                <MenuItem value="inspection">Inspection</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="document">Document Review</MenuItem>
                <MenuItem value="presentation">Presentation</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="analysis">Analysis</MenuItem>
                <MenuItem value="project">Project</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Property"
              value={newEvent.property}
              onChange={(e) => setNewEvent({ ...newEvent, property: e.target.value })}
              fullWidth
            />
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

export default Calendar;
