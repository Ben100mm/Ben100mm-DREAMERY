import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Alert,
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
  SelectChangeEvent,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Warning,
  Error,
  Info,
  Refresh,
  Download,
  Upload,
  Settings,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { performanceMonitor, PerformanceReport } from '../utils/PerformanceMonitor';
import { bundleSizeTracker, BundleSizeData, RegressionAlert } from '../utils/BundleSizeTracker';

interface PerformanceMetricsDashboardProps {
  showBundleAnalysis?: boolean;
  showPerformanceMetrics?: boolean;
  showRegressionAlerts?: boolean;
  refreshInterval?: number;
}

export const PerformanceMetricsDashboard: React.FC<PerformanceMetricsDashboardProps> = ({
  showBundleAnalysis = true,
  showPerformanceMetrics = true,
  showRegressionAlerts = true,
  refreshInterval = 10000, // 10 seconds
}) => {
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [bundleReport, setBundleReport] = useState<any>(null);
  const [regressionAlerts, setRegressionAlerts] = useState<RegressionAlert[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customBudget, setCustomBudget] = useState({
    name: '',
    threshold: 0,
    unit: 'KB',
    severity: 'warning' as const,
  });

  useEffect(() => {
    // Set up performance monitoring
    performanceMonitor.onReport((report) => {
      setPerformanceReport(report);
    });

    // Set up bundle regression alerts
    bundleSizeTracker.onRegression((alert) => {
      setRegressionAlerts(prev => [alert, ...prev]);
    });

    // Initial load
    loadData();

    // Set up refresh interval
    const interval = setInterval(loadData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadData = () => {
    if (showPerformanceMetrics) {
      const report = performanceMonitor.generateReport();
      setPerformanceReport(report);
    }

    if (showBundleAnalysis) {
      const report = bundleSizeTracker.generateReport();
      setBundleReport(report);
    }

    if (showRegressionAlerts) {
      const alerts = bundleSizeTracker.getAlerts();
      setRegressionAlerts(alerts);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="error" />;
      case 'decreasing':
        return <TrendingDown color="success" />;
      case 'stable':
        return <TrendingFlat color="info" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Error />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      default:
        return <Info />;
    }
  };

  const exportData = () => {
    const data = {
      performance: performanceReport,
      bundle: bundleReport,
      alerts: regressionAlerts,
      timestamp: Date.now(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCustomBudget = () => {
    if (customBudget.name && customBudget.threshold > 0) {
      bundleSizeTracker.addBudget(customBudget);
      setCustomBudget({ name: '', threshold: 0, unit: 'KB', severity: 'warning' });
      setSettingsOpen(false);
      loadData();
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Performance Metrics Dashboard
        </Typography>
        <Box>
          <IconButton onClick={loadData} color="primary" title="Refresh Data">
            <Refresh />
          </IconButton>
          <IconButton onClick={exportData} color="primary" title="Export Data">
            <Download />
          </IconButton>
          <IconButton onClick={() => setSettingsOpen(true)} color="primary" title="Settings">
            <Settings />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Performance Score Card */}
        {showPerformanceMetrics && (
          <Grid size={{ xs: 12 }} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" color="primary" sx={{ mr: 2 }}>
                    {performanceReport?.summary.averageScore.toFixed(0) || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / 100
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={performanceReport?.summary.averageScore || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {performanceReport?.summary.totalMetrics || 0} metrics tracked
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Bundle Size Card */}
        {showBundleAnalysis && bundleReport?.currentBuild && (
          <Grid size={{ xs: 12 }} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bundle Size
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {formatBytes(bundleReport.currentBuild.totalSize)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getTrendIcon(bundleReport.trends?.totalSize?.trend || 'stable')}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {bundleReport.trends?.totalSize?.trend || 'stable'} trend
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Gzipped: {formatBytes(bundleReport.currentBuild.gzippedSize)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Alerts Summary Card */}
        {showRegressionAlerts && (
          <Grid size={{ xs: 12 }} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Regression Alerts
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" color="error" sx={{ mr: 2 }}>
                    {regressionAlerts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    active alerts
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['critical', 'error', 'warning'].map(severity => {
                    const count = regressionAlerts.filter(alert => alert.type === severity).length;
                    if (count === 0) return null;
                    return (
                      <Chip
                        key={severity}
                        label={`${count} ${severity}`}
                        color={getSeverityColor(severity) as any}
                        size="small"
                      />
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Performance Metrics Section */}
      {showPerformanceMetrics && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => toggleSection('performance')}
            >
              <Typography variant="h6">Performance Metrics</Typography>
              {expandedSections['performance'] ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandedSections['performance']}>
              <Box sx={{ mt: 2 }}>
                {performanceReport?.metrics && performanceReport.metrics.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {performanceReport.metrics.slice(0, 20).map((metric, index) => (
                          <TableRow key={index}>
                            <TableCell>{metric.name}</TableCell>
                            <TableCell>
                              {metric.value.toFixed(2)} {metric.unit}
                            </TableCell>
                            <TableCell>
                              <Chip label={metric.category} size="small" />
                            </TableCell>
                            <TableCell>{formatTimestamp(metric.timestamp)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No performance metrics available
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* Bundle Analysis Section */}
      {showBundleAnalysis && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => toggleSection('bundle')}
            >
              <Typography variant="h6">Bundle Analysis</Typography>
              {expandedSections['bundle'] ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandedSections['bundle']}>
              <Box sx={{ mt: 2 }}>
                {bundleReport?.currentBuild ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Build Details
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          Build ID: {bundleReport.currentBuild.buildId}
                        </Typography>
                        <Typography variant="body2">
                          Commit: {bundleReport.currentBuild.commitHash}
                        </Typography>
                        <Typography variant="body2">
                          Timestamp: {formatTimestamp(bundleReport.currentBuild.timestamp)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Size Breakdown
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          JavaScript: {formatBytes(bundleReport.currentBuild.jsSize)}
                        </Typography>
                        <Typography variant="body2">
                          CSS: {formatBytes(bundleReport.currentBuild.cssSize)}
                        </Typography>
                        <Typography variant="body2">
                          Images: {formatBytes(bundleReport.currentBuild.imageSize)}
                        </Typography>
                        <Typography variant="body2">
                          Other: {formatBytes(bundleReport.currentBuild.otherSize)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No bundle analysis available
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* Regression Alerts Section */}
      {showRegressionAlerts && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => toggleSection('alerts')}
            >
              <Typography variant="h6">Regression Alerts</Typography>
              {expandedSections['alerts'] ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandedSections['alerts']}>
              <Box sx={{ mt: 2 }}>
                {regressionAlerts.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {regressionAlerts.slice(0, 10).map((alert, index) => (
                      <Alert
                        key={index}
                        severity={getSeverityColor(alert.type) as any}
                        icon={getSeverityIcon(alert.type)}
                        action={
                          <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                              // Handle alert action
                            }}
                          >
                            View Details
                          </Button>
                        }
                      >
                        <Typography variant="body2" gutterBottom>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(alert.timestamp)}
                        </Typography>
                      </Alert>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No regression alerts
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Performance Dashboard Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add Custom Performance Budget
            </Typography>
            <TextField
              label="Budget Name"
              value={customBudget.name}
              onChange={(e) => setCustomBudget(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Threshold"
              type="number"
              value={customBudget.threshold}
              onChange={(e) => setCustomBudget(prev => ({ ...prev, threshold: Number(e.target.value) }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={customBudget.unit}
                label="Unit"
                onChange={(e: SelectChangeEvent) => setCustomBudget(prev => ({ ...prev, unit: e.target.value }))}
              >
                <MenuItem value="B">Bytes</MenuItem>
                <MenuItem value="KB">Kilobytes</MenuItem>
                <MenuItem value="MB">Megabytes</MenuItem>
                <MenuItem value="ms">Milliseconds</MenuItem>
                <MenuItem value="s">Seconds</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={customBudget.severity}
                label="Severity"
                onChange={(e: SelectChangeEvent) => setCustomBudget(prev => ({ ...prev, severity: e.target.value as any }))}
              >
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={addCustomBudget} variant="contained">
            Add Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerformanceMetricsDashboard;
