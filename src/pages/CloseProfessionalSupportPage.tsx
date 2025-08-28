import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

import { useAuth } from '../contexts/AuthContext';
import { useProfessionalSupport } from '../context/ProfessionalSupportContext';
import { realtimeService } from '../services/RealtimeService';
import { getChatServerUrl } from '../utils/env';

// Lazy load ALL icons to reduce initial bundle size
const LazySupportIcon = React.lazy(() => import('@mui/icons-material/Support'));
const LazyPeopleIcon = React.lazy(() => import('@mui/icons-material/People'));
const LazyDescriptionIcon = React.lazy(() => import('@mui/icons-material/Description'));
const LazySecurityIcon = React.lazy(() => import('@mui/icons-material/Security'));

const CloseProfessionalSupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only connect to realtime service when needed tabs are active
  useEffect(() => {
    const needsRealtime = ['collaboration', 'shared-queue', 'shared-documents', 'compliance-hub'].includes(activeTab);
    
    if (needsRealtime) {
      realtimeService.connect(getChatServerUrl());
      return () => realtimeService.disconnect();
    }
  }, [activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'shared-queue':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shared Queue
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Queue management features coming soon...
            </Typography>
          </Box>
        );
      case 'shared-documents':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shared Documents
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Document management features coming soon...
            </Typography>
          </Box>
        );
      case 'compliance-hub':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Compliance Hub
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Compliance features coming soon...
            </Typography>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Professional Support Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a tab to access specific tools and features.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 280, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Professional Support
          </Typography>
        </Box>
        
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="Dashboard" 
            value="dashboard"
            icon={
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazySupportIcon />
              </React.Suspense>
            }
          />
          <Tab 
            label="Shared Queue" 
            value="shared-queue"
            icon={
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyPeopleIcon />
              </React.Suspense>
            }
          />
          <Tab 
            label="Shared Documents" 
            value="shared-documents"
            icon={
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyDescriptionIcon />
              </React.Suspense>
            }
          />
          <Tab 
            label="Compliance Hub" 
            value="compliance-hub"
            icon={
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazySecurityIcon />
              </React.Suspense>
            }
          />
        </Tabs>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading && <LinearProgress />}
        
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default CloseProfessionalSupportPage;
