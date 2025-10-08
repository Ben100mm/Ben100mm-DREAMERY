import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { WorkflowStep } from '../../context/ProfessionalSupportContext';
import { workflowEngine } from '../../services/WorkflowEngine';
import { brandColors } from '../../theme';
import WorkflowViewer from './WorkflowViewer';

interface ActiveWorkflow {
  id: string;
  roleId: string;
  roleName: string;
  startedAt: Date;
  status: 'active' | 'paused' | 'completed';
  steps: WorkflowStep[];
}

interface WorkflowManagerProps {
  roleId: string;
  roleName: string;
  onWorkflowSelect?: (workflowId: string) => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  roleId,
  roleName,
  onWorkflowSelect,
}) => {
  const [activeWorkflows, setActiveWorkflows] = useState<ActiveWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflowForMenu, setSelectedWorkflowForMenu] = useState<ActiveWorkflow | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Load workflows from localStorage on mount
  useEffect(() => {
    const storedWorkflows = localStorage.getItem(`workflows_${roleId}`);
    if (storedWorkflows) {
      const parsed = JSON.parse(storedWorkflows);
      setActiveWorkflows(parsed.map((w: any) => ({
        ...w,
        startedAt: new Date(w.startedAt),
        steps: w.steps.map((s: any) => ({
          ...s,
          dueDate: s.dueDate ? new Date(s.dueDate) : undefined,
          completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
        })),
      })));
    }
  }, [roleId]);

  // Save workflows to localStorage whenever they change
  useEffect(() => {
    if (activeWorkflows.length > 0) {
      localStorage.setItem(`workflows_${roleId}`, JSON.stringify(activeWorkflows));
    }
  }, [activeWorkflows, roleId]);

  const handleStartNewWorkflow = () => {
    const workflowId = workflowEngine.startWorkflow(roleId);
    const steps = workflowEngine.getWorkflow(roleId);
    
    // Start the first step automatically
    if (steps.length > 0) {
      steps[0].status = 'in-progress';
    }

    const newWorkflow: ActiveWorkflow = {
      id: workflowId,
      roleId,
      roleName,
      startedAt: new Date(),
      status: 'active',
      steps: steps,
    };

    setActiveWorkflows(prev => [...prev, newWorkflow]);
  };

  const handleStepStart = (workflowId: string, stepId: string) => {
    setActiveWorkflows(prev => prev.map(workflow => {
      if (workflow.id !== workflowId) return workflow;
      
      return {
        ...workflow,
        steps: workflow.steps.map(step => {
          // Set the selected step to in-progress
          if (step.id === stepId && step.status === 'pending') {
            return { ...step, status: 'in-progress' as const };
          }
          // Set any other in-progress steps to pending
          if (step.status === 'in-progress' && step.id !== stepId) {
            return { ...step, status: 'pending' as const };
          }
          return step;
        }),
      };
    }));
  };

  const handleStepComplete = (workflowId: string, stepId: string) => {
    setActiveWorkflows(prev => prev.map(workflow => {
      if (workflow.id !== workflowId) return workflow;
      
      const updatedSteps = workflow.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'completed' as const,
            completedAt: new Date(),
          };
        }
        return step;
      });

      // Check if all steps are completed
      const allCompleted = updatedSteps.every(s => s.status === 'completed' || !s.required);
      
      // Auto-start next available step
      if (!allCompleted) {
        const nextStep = updatedSteps.find(step => {
          if (step.status !== 'pending') return false;
          // Check if all dependencies are met
          return step.dependencies.every(depId => {
            const depStep = updatedSteps.find(s => s.id === depId);
            return depStep && depStep.status === 'completed';
          });
        });

        if (nextStep) {
          nextStep.status = 'in-progress';
        }
      }

      return {
        ...workflow,
        steps: updatedSteps,
        status: allCompleted ? 'completed' as const : workflow.status,
      };
    }));
  };

  const handlePauseWorkflow = (workflowId: string) => {
    setActiveWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: 'paused' as const }
        : workflow
    ));
    handleMenuClose();
  };

  const handleResumeWorkflow = (workflowId: string) => {
    setActiveWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: 'active' as const }
        : workflow
    ));
    handleMenuClose();
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setActiveWorkflows(prev => prev.filter(w => w.id !== workflowId));
    handleMenuClose();
  };

  const handleViewWorkflow = (workflow: ActiveWorkflow) => {
    setSelectedWorkflow(workflow);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflow: ActiveWorkflow) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflowForMenu(workflow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflowForMenu(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateProgress = (steps: WorkflowStep[]) => {
    const completed = steps.filter(s => s.status === 'completed').length;
    return (completed / steps.length) * 100;
  };

  const filterWorkflows = (status: string) => {
    if (status === 'all') return activeWorkflows;
    if (status === 'active') return activeWorkflows.filter(w => w.status === 'active');
    if (status === 'completed') return activeWorkflows.filter(w => w.status === 'completed');
    if (status === 'paused') return activeWorkflows.filter(w => w.status === 'paused');
    return activeWorkflows;
  };

  const filteredWorkflows = filterWorkflows(
    tabValue === 0 ? 'active' : tabValue === 1 ? 'completed' : 'paused'
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: brandColors.primary }}>
          Workflow Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleStartNewWorkflow}
          sx={{ 
            backgroundColor: brandColors.primary,
            '&:hover': { backgroundColor: brandColors.accent.infoDark }
          }}
        >
          Start New Workflow
        </Button>
      </Box>

      {/* Available Workflow Template */}
      {activeWorkflows.length === 0 && (
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {roleName} Workflow
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Structured workflow with {workflowEngine.getWorkflow(roleId).length} steps to guide you through the process
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleStartNewWorkflow}
            sx={{ 
              backgroundColor: brandColors.primary,
              '&:hover': { backgroundColor: brandColors.accent.infoDark }
            }}
          >
            Start Your First Workflow
          </Button>
        </Paper>
      )}

      {/* Tabs */}
      {activeWorkflows.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Active (${activeWorkflows.filter(w => w.status === 'active').length})`} />
            <Tab label={`Completed (${activeWorkflows.filter(w => w.status === 'completed').length})`} />
            <Tab label={`Paused (${activeWorkflows.filter(w => w.status === 'paused').length})`} />
          </Tabs>
        </Box>
      )}

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 && activeWorkflows.length > 0 && (
        <Alert severity="info">
          No {tabValue === 0 ? 'active' : tabValue === 1 ? 'completed' : 'paused'} workflows
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredWorkflows.map((workflow) => {
          const progress = calculateProgress(workflow.steps);
          const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
          const currentStep = workflow.steps.find(s => s.status === 'in-progress');

          return (
            <Grid item xs={12} md={6} lg={4} key={workflow.id}>
              <Card 
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: workflow.status === 'completed' ? `4px solid ${brandColors.accent.successDark}` :
                              workflow.status === 'paused' ? `4px solid ${brandColors.accent.warningDark}` :
                              `4px solid ${brandColors.primary}`,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {workflow.roleName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Started {workflow.startedAt.toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, workflow)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {completedSteps}/{workflow.steps.length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: workflow.status === 'completed' 
                              ? brandColors.accent.successDark 
                              : brandColors.primary,
                          }
                        }}
                      />
                    </Box>

                    {currentStep && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          Current Step:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {currentStep.name}
                        </Typography>
                      </Box>
                    )}

                    <Chip
                      label={workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      size="small"
                      color={
                        workflow.status === 'completed' ? 'success' :
                        workflow.status === 'paused' ? 'warning' :
                        'primary'
                      }
                    />
                  </Stack>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewWorkflow(workflow)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedWorkflowForMenu?.status === 'active' && (
          <MenuItem onClick={() => handlePauseWorkflow(selectedWorkflowForMenu.id)}>
            <PauseIcon sx={{ mr: 1 }} fontSize="small" />
            Pause Workflow
          </MenuItem>
        )}
        {selectedWorkflowForMenu?.status === 'paused' && (
          <MenuItem onClick={() => handleResumeWorkflow(selectedWorkflowForMenu.id)}>
            <PlayArrowIcon sx={{ mr: 1 }} fontSize="small" />
            Resume Workflow
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedWorkflowForMenu && handleDeleteWorkflow(selectedWorkflowForMenu.id)}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Workflow
        </MenuItem>
      </Menu>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedWorkflow?.roleName} Workflow
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <WorkflowViewer
              workflowId={selectedWorkflow.id}
              workflowName={selectedWorkflow.roleName}
              steps={selectedWorkflow.steps}
              onStepComplete={(stepId) => handleStepComplete(selectedWorkflow.id, stepId)}
              onStepStart={(stepId) => handleStepStart(selectedWorkflow.id, stepId)}
              showActions={selectedWorkflow.status === 'active'}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowManager;

