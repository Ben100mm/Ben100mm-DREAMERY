import React from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Box,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import { 
  CheckCircle, 
  Lock, 
  Undo,
  PlayArrow,
  Pause
} from '@mui/icons-material';

export const PhaseControlPanel: React.FC = () => {
  const { currentPhase, phases, switchToPhase, enabledPages } = useFeatureFlags();

  const handlePhaseSwitch = (phaseId: number) => {
    const phase = phases.find(p => p.id === phaseId);
    if (confirm(`Switch to ${phase?.name}?\n\n${phase?.description}`)) {
      switchToPhase(phaseId);
    }
  };

  const handleRollback = () => {
    const previousPhase = Math.max(1, currentPhase - 1);
    const phase = phases.find(p => p.id === previousPhase);
    if (confirm(`Rollback to ${phase?.name}?\n\n${phase?.description}`)) {
      switchToPhase(previousPhase);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Phase Control Panel
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Current Phase: {phases.find(p => p.id === currentPhase)?.name}</AlertTitle>
        Manage the 3-phase feature rollout. Changes are instant and persistent.
      </Alert>

      <Grid container spacing={3}>
        {/* Current Phase Status */}
        <Grid item xs={12} md={6} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Status
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Chip 
                  icon={<CheckCircle />} 
                  label={`Phase ${currentPhase}`} 
                  color="primary" 
                />
                <Typography variant="body1">
                  {phases.find(p => p.id === currentPhase)?.description}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Available Features:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {enabledPages
                  .filter(page => !['/', '/auth', '/professional-signup', '/business-signup'].includes(page))
                  .map((page, index) => (
                    <Chip 
                      key={index}
                      label={page === '/lumina' ? 'Lumina' : 
                             page === '/underwrite' ? 'Underwrite' :
                             page === '/marketplace' ? 'Marketplace' :
                             page === '/mortgage' ? 'Mortgage' :
                             page === '/workspaces' ? 'Workspaces' :
                             page === '/learn' ? 'Learn' :
                             page === '/advertise' ? 'Advertise' :
                             page === '/partner' ? 'Partners' :
                             page === '/developer' ? 'Developer' : page}
                      size="small"
                      variant="outlined"
                    />
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<Undo />}
                  onClick={handleRollback}
                  disabled={currentPhase <= 1}
                  fullWidth
                >
                  Rollback to Phase {Math.max(1, currentPhase - 1)}
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => handlePhaseSwitch(Math.min(3, currentPhase + 1))}
                  disabled={currentPhase >= 3}
                  fullWidth
                >
                  Advance to Phase {Math.min(3, currentPhase + 1)}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* All Phases */}
        <Grid item xs={12} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phase Overview
              </Typography>
              
              {phases.map((phase) => (
                <Paper 
                  key={phase.id} 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    p: 2,
                    border: phase.id === currentPhase ? '2px solid' : '1px solid',
                    borderColor: phase.id === currentPhase ? 'primary.main' : 'divider',
                    backgroundColor: phase.id === currentPhase ? 'action.selected' : 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">
                      {phase.name}
                    </Typography>
                    {phase.id === currentPhase ? (
                      <Chip icon={<CheckCircle />} label="Active" color="primary" />
                    ) : (
                      <Button 
                        variant="contained" 
                        onClick={() => handlePhaseSwitch(phase.id)}
                        size="small"
                        startIcon={<PlayArrow />}
                      >
                        Activate
                      </Button>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {phase.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Available Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {phase.enabledPages
                      .filter(page => !['/', '/auth', '/professional-signup', '/business-signup'].includes(page))
                      .map((page, index) => (
                        <Chip 
                          key={index}
                          label={page === '/lumina' ? 'Lumina' : 
                                 page === '/underwrite' ? 'Underwrite' :
                                 page === '/marketplace' ? 'Marketplace' :
                                 page === '/mortgage' ? 'Mortgage' :
                                 page === '/workspaces' ? 'Workspaces' :
                                 page === '/learn' ? 'Learn' :
                                 page === '/advertise' ? 'Advertise' :
                                 page === '/partner' ? 'Partners' :
                                 page === '/developer' ? 'Developer' : page}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                  </Box>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
