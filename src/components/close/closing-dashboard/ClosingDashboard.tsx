import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LineChart, LineSeriesType } from '@mui/x-charts';

// Styled components
const MetricCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ProgressCard = styled(Card)`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const StatusIndicator = styled.div<{ status: 'completed' | 'in-progress' | 'pending' | 'blocked' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ status }) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#2196f3';
      case 'pending': return '#ff9800';
      case 'blocked': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  margin-right: 8px;
`;

// Mock data types
interface ClosingTask {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo: string;
  progress: number;
}

interface ClosingMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const ClosingDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ClosingTask[]>([]);
  const [metrics, setMetrics] = useState<ClosingMetric[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data initialization
    const mockTasks: ClosingTask[] = [
      {
        id: '1',
        name: 'Title Search & Insurance',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-15',
        assignedTo: 'Sarah Johnson',
        progress: 100,
      },
      {
        id: '2',
        name: 'Property Appraisal',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-01-18',
        assignedTo: 'Mike Chen',
        progress: 75,
      },
      {
        id: '3',
        name: 'Home Inspection',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-01-20',
        assignedTo: 'Lisa Rodriguez',
        progress: 0,
      },
      {
        id: '4',
        name: 'Loan Processing',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-01-22',
        assignedTo: 'David Kim',
        progress: 60,
      },
      {
        id: '5',
        name: 'Document Preparation',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-01-25',
        assignedTo: 'Emily Watson',
        progress: 30,
      },
    ];

    const mockMetrics: ClosingMetric[] = [
      { label: 'Days to Closing', value: '12', change: -2, trend: 'down' },
      { label: 'Tasks Completed', value: '8/15', change: 2, trend: 'up' },
      { label: 'Documents Uploaded', value: '23/35', change: 5, trend: 'up' },
      { label: 'Risk Score', value: 'Low', change: 0, trend: 'stable' },
    ];

    setTasks(mockTasks);
    setMetrics(mockMetrics);
    setOverallProgress(53); // Mock overall progress
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => setLoading(false), 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#2196f3';
      case 'pending': return '#ff9800';
      case 'blocked': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Closing Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          >
            Export Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          >
            Share Status
          </Button>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {metric.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    label={`${metric.change > 0 ? '+' : ''}${metric.change}`}
                    size="small"
                    color={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>
        ))}
      </Grid>

      {/* Overall Progress */}
      <ProgressCard sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Overall Closing Progress
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1976d2' }}>
              {overallProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {15 - tasks.filter(t => t.status === 'completed').length} tasks remaining
          </Typography>
        </CardContent>
      </ProgressCard>

      {/* Tasks Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Closing Tasks
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#1976d2' }}>
              Add Task
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StatusIndicator status={task.status} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {task.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status.replace('-', ' ')}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(task.status),
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2">{task.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{task.assignedTo}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit Task">
                        <IconButton size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Updates
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                  Title search completed successfully - No liens found
                </Alert>
                <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                  Property appraisal scheduled for January 18th
                </Alert>
                <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
                  Loan pre-approval received from lender
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Next Steps
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  Schedule home inspection
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="info" fontSize="small" />
                  Review and sign disclosure documents
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" fontSize="small" />
                  Confirm closing date with all parties
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export { ClosingDashboard };
