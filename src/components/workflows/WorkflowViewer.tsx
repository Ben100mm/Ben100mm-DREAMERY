import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as PendingIcon,
  Block as BlockedIcon,
  PlayArrow as InProgressIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { WorkflowStep } from '../../context/ProfessionalSupportContext';
import { brandColors } from '../../theme';

interface WorkflowViewerProps {
  workflowId: string;
  workflowName: string;
  steps: WorkflowStep[];
  onStepComplete?: (stepId: string) => void;
  onStepStart?: (stepId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const WorkflowViewer: React.FC<WorkflowViewerProps> = ({
  workflowId,
  workflowName,
  steps,
  onStepComplete,
  onStepStart,
  showActions = true,
  compact = false,
}) => {
  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: brandColors.accent.successDark }} />;
      case 'in-progress':
        return <InProgressIcon sx={{ color: brandColors.accent.infoDark }} />;
      case 'blocked':
        return <BlockedIcon sx={{ color: brandColors.accent.errorDark }} />;
      default:
        return <PendingIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateProgress = () => {
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getTotalEstimatedTime = () => {
    const remainingSteps = steps.filter(
      s => s.status === 'pending' || s.status === 'in-progress'
    );
    return remainingSteps.reduce((total, step) => total + step.estimatedTime, 0);
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const isStepAvailable = (step: WorkflowStep): boolean => {
    if (step.dependencies.length === 0) return true;
    return step.dependencies.every(depId => {
      const depStep = steps.find(s => s.id === depId);
      return depStep && depStep.status === 'completed';
    });
  };

  const progress = calculateProgress();
  const remainingTime = getTotalEstimatedTime();
  const activeStep = steps.findIndex(s => s.status === 'in-progress');

  if (compact) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {workflowName}
              </Typography>
              <Chip
                label={`${Math.round(progress)}%`}
                size="small"
                color={progress === 100 ? 'success' : 'primary'}
              />
            </Box>
            <LinearProgress variant="determinate" value={progress} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                {steps.filter(s => s.status === 'completed').length} of {steps.length} steps
              </Typography>
              {remainingTime > 0 && (
                <Typography variant="caption" color="text.secondary">
                  ~{formatTime(remainingTime)} remaining
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: brandColors.primary }}>
            {workflowName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={`${steps.filter(s => s.status === 'completed').length}/${steps.length} Complete`}
              color={progress === 100 ? 'success' : 'primary'}
              size="small"
            />
            {remainingTime > 0 && (
              <Chip
                icon={<ScheduleIcon />}
                label={`~${formatTime(remainingTime)} remaining`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: brandColors.accent.successDark,
              }
            }} 
          />
        </Box>

        {/* Blocked Steps Warning */}
        {steps.some(s => s.status === 'blocked') && (
          <Alert severity="warning">
            Some steps are blocked. Complete their dependencies to continue.
          </Alert>
        )}

        {/* Steps */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => {
            const isAvailable = isStepAvailable(step);
            const isActive = step.status === 'in-progress';
            const isCompleted = step.status === 'completed';
            const isBlocked = step.status === 'blocked' || !isAvailable;

            return (
              <Step key={step.id} active={isActive} completed={isCompleted}>
                <StepLabel
                  icon={getStepIcon(step.status)}
                  error={step.status === 'blocked'}
                  optional={
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {step.required && (
                        <Chip label="Required" size="small" color="error" variant="outlined" />
                      )}
                      <Chip 
                        label={formatTime(step.estimatedTime)} 
                        size="small" 
                        variant="outlined"
                        icon={<ScheduleIcon fontSize="small" />}
                      />
                      {step.completedAt && (
                        <Chip 
                          label={`Completed ${new Date(step.completedAt).toLocaleDateString()}`}
                          size="small" 
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {step.name}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>

                    {/* Dependencies */}
                    {step.dependencies.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          Dependencies:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {step.dependencies.map(depId => {
                            const depStep = steps.find(s => s.id === depId);
                            if (!depStep) return null;
                            return (
                              <Chip
                                key={depId}
                                label={depStep.name}
                                size="small"
                                color={depStep.status === 'completed' ? 'success' : 'default'}
                                variant="outlined"
                              />
                            );
                          })}
                        </Stack>
                      </Box>
                    )}

                    {/* Assignee */}
                    {step.assignee && (
                      <Typography variant="caption" color="text.secondary">
                        Assigned to: <strong>{step.assignee}</strong>
                      </Typography>
                    )}

                    {/* Due Date */}
                    {step.dueDate && (
                      <Typography variant="caption" color="text.secondary">
                        Due: <strong>{new Date(step.dueDate).toLocaleDateString()}</strong>
                      </Typography>
                    )}

                    {/* Actions */}
                    {showActions && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {step.status === 'pending' && isAvailable && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onStepStart?.(step.id)}
                          >
                            Start Step
                          </Button>
                        )}
                        {step.status === 'in-progress' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => onStepComplete?.(step.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                        {isBlocked && step.status !== 'completed' && (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            This step is blocked. Complete dependencies first.
                          </Alert>
                        )}
                      </Box>
                    )}
                  </Stack>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {/* Completion Message */}
        {progress === 100 && (
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <Typography variant="subtitle2" fontWeight="bold">
              Workflow Complete!
            </Typography>
            <Typography variant="body2">
              All steps have been completed successfully.
            </Typography>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default WorkflowViewer;

