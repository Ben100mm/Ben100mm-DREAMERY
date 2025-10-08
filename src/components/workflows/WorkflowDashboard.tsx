import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import WorkflowManager from './WorkflowManager';
import { workflowEngine } from '../../services/WorkflowEngine';

interface WorkflowDashboardProps {
  roleId: string;
  roleName: string;
}

const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({ roleId, roleName }) => {
  const [workflowTemplate, setWorkflowTemplate] = useState<any[]>([]);
  const [showManager, setShowManager] = useState(true);

  useEffect(() => {
    const template = workflowEngine.getWorkflow(roleId);
    setWorkflowTemplate(template);
  }, [roleId]);

  const totalSteps = workflowTemplate.length;
  const requiredSteps = workflowTemplate.filter(s => s.required).length;
  const estimatedTime = workflowTemplate.reduce((total, step) => total + step.estimatedTime, 0);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? `${days} days ${remainingHours} hours` : `${days} days`;
    }
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
  };

  if (workflowTemplate.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" icon={<InfoIcon />}>
          <Typography variant="subtitle2" fontWeight="bold">
            No Workflow Template Available
          </Typography>
          <Typography variant="body2">
            There is currently no workflow template configured for the {roleName} role.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Overview Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: brandColors.primary }}>
          {roleName} Workflows
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage and track your professional workflows with structured processes and automated progress tracking.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon sx={{ color: brandColors.accent.infoDark }} />
                  <Typography variant="caption" color="text.secondary">
                    Total Steps
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {totalSteps}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {requiredSteps} required
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon sx={{ color: brandColors.accent.warningDark }} />
                  <Typography variant="caption" color="text.secondary">
                    Estimated Time
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {Math.round(estimatedTime / 60)}h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(estimatedTime)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: brandColors.accent.successDark }} />
                  <Typography variant="caption" color="text.secondary">
                    Workflow Type
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Standard
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Industry-standard process
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: brandColors.primary }} />
                  <Typography variant="caption" color="text.secondary">
                    Efficiency
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Optimized
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Automated tracking
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workflow Template Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: brandColors.primary }}>
          Workflow Template Overview
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {workflowTemplate.map((step, index) => (
            <Box key={step.id}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: brandColors.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {step.name}
                    </Typography>
                    {step.required && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: brandColors.accent.errorDark,
                          backgroundColor: 'rgba(211, 47, 47, 0.1)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        Required
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      ~{step.estimatedTime < 60 ? `${step.estimatedTime}m` : `${Math.round(step.estimatedTime / 60)}h`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {step.description}
                  </Typography>
                  {step.dependencies.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Dependencies: {step.dependencies.map(depId => {
                        const depStep = workflowTemplate.find(s => s.id === depId);
                        return depStep?.name;
                      }).join(', ')}
                    </Typography>
                  )}
                </Box>
              </Box>
              {index < workflowTemplate.length - 1 && (
                <Divider sx={{ my: 2, ml: 5 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Features Info */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Workflow Features
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><Typography variant="body2">Automated step progression with dependency tracking</Typography></li>
          <li><Typography variant="body2">Real-time progress monitoring and time estimates</Typography></li>
          <li><Typography variant="body2">Pause and resume workflows as needed</Typography></li>
          <li><Typography variant="body2">Multiple concurrent workflow support</Typography></li>
          <li><Typography variant="body2">Complete workflow history and audit trail</Typography></li>
        </ul>
      </Alert>

      {/* Workflow Manager */}
      <Divider sx={{ my: 4 }} />
      <WorkflowManager roleId={roleId} roleName={roleName} />
    </Box>
  );
};

export default WorkflowDashboard;

