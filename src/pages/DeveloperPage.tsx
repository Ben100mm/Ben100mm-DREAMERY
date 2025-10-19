import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Home as HomeIcon,
  Code as CodeIcon,
  CloudQueue as CloudQueueIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { PerformanceMetricsDashboard } from '../components/PerformanceMetricsDashboard';
import { DataSourcesDashboard } from '../pages/DataSourcesDashboard';
import { PhaseControlPanel } from '../components/admin/PhaseControlPanel';
import { brandColors } from '../theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`developer-tabpanel-${index}`}
      aria-labelledby={`developer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const DeveloperPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <CodeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Developer Tools
            </Typography>
          </Breadcrumbs>

          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Developer Tools
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Performance monitoring, data management, and admin controls
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Info Banner */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Developer Access Required</AlertTitle>
          This page contains development tools, performance monitoring, and admin controls.
          Access is restricted to developers and administrators.
        </Alert>

        {/* Main Content */}
        <Paper elevation={3}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tab 
              label="Performance Dashboard" 
              icon={<SettingsIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Data Sources" 
              icon={<CloudQueueIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Admin Controls" 
              icon={<SettingsIcon />}
              iconPosition="start"
            />
          </Tabs>

          {/* Performance Dashboard Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box px={3}>
              <PerformanceMetricsDashboard 
                showBundleAnalysis={true}
                showPerformanceMetrics={true}
                showRegressionAlerts={true}
                refreshInterval={5000}
              />
            </Box>
          </TabPanel>

          {/* Data Sources Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box px={3}>
              <DataSourcesDashboard />
            </Box>
          </TabPanel>

          {/* Admin Controls Tab */}
          <TabPanel value={activeTab} index={2}>
            <Box px={3}>
              <PhaseControlPanel />
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default DeveloperPage;
