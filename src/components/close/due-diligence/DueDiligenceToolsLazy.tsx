import React, { useState, useEffect, Suspense } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { brandColors } from '../../../theme';

// Lazy load icons to reduce initial bundle size
const LazySearchIcon = React.lazy(() => import('@mui/icons-material/Search'));
const LazyEditIcon = React.lazy(() => import('@mui/icons-material/Edit'));
const LazyVisibilityIcon = React.lazy(() => import('@mui/icons-material/Visibility'));
const LazyDownloadIcon = React.lazy(() => import('@mui/icons-material/Download'));
const LazyAddIcon = React.lazy(() => import('@mui/icons-material/Add'));
const LazyBusinessIcon = React.lazy(() => import('@mui/icons-material/Business'));
const LazyAssessmentIcon = React.lazy(() => import('@mui/icons-material/Assessment'));
const LazyWarningIcon = React.lazy(() => import('@mui/icons-material/Warning'));

// Icon wrapper component with fallback
const IconWrapper: React.FC<{ icon: React.ComponentType<any>; sx?: any }> = ({ icon: Icon, sx }) => (
  <Suspense fallback={<Box sx={{ width: 24, height: 24, ...sx }} />}>
    <Icon sx={sx} />
  </Suspense>
);

// Types
interface Inspector {
  id: string;
  name: string;
  company: string;
  specialties: string[];
  rating: number;
  hourlyRate: number;
  availability: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}

interface Appraisal {
  id: string;
  propertyAddress: string;
  appraiserName: string;
  orderDate: string;
  estimatedValue: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  cost: number;
  notes: string;
}

interface HOADocument {
  id: string;
  propertyAddress: string;
  documentType: 'covenants' | 'bylaws' | 'rules' | 'financials' | 'meetings' | 'other';
  title: string;
  status: 'requested' | 'received' | 'reviewed' | 'approved' | 'rejected';
  requestDate: string;
  receivedDate?: string;
  fileUrl?: string;
  notes: string;
}

interface Issue {
  id: string;
  propertyAddress: string;
  category: 'inspection' | 'appraisal' | 'hoa' | 'legal' | 'environmental' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  resolution?: string;
  resolutionDate?: string;
}

interface DueDiligence {
  inspectors: Inspector[];
  appraisals: Appraisal[];
  hoaDocuments: HOADocument[];
  issues: Issue[];
}

// Main component with lazy-loaded icons
const DueDiligenceTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Placeholder data - in real app this would come from props or context
  const dueDiligenceData: DueDiligence = {
    inspectors: [],
    appraisals: [],
    hoaDocuments: [],
    issues: []
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Due Diligence Tools
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search due diligence items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconWrapper icon={LazySearchIcon} sx={{ mr: 1, color: 'text.secondary' }} />
            ),
          }}
        />
      </Box>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="Inspectors" />
        <Tab label="Appraisals" />
        <Tab label="HOA Documents" />
        <Tab label="Issues" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <IconWrapper icon={LazyBusinessIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
                Inspectors
              </Typography>
              <Typography color="text.secondary">
                No inspectors found. Add your first inspector to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<IconWrapper icon={LazyAddIcon} />}
                sx={{ mt: 2 }}
              >
                Add Inspector
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <IconWrapper icon={LazyAssessmentIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
                Appraisals
              </Typography>
              <Typography color="text.secondary">
                No appraisals found. Order your first appraisal to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<IconWrapper icon={LazyAddIcon} />}
                sx={{ mt: 2 }}
              >
                Order Appraisal
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <IconWrapper icon={LazyDownloadIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
                HOA Documents
              </Typography>
              <Typography color="text.secondary">
                No HOA documents found. Request your first document to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<IconWrapper icon={LazyAddIcon} />}
                sx={{ mt: 2 }}
              >
                Request Document
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <IconWrapper icon={LazyWarningIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
                Issues
              </Typography>
              <Typography color="text.secondary">
                No issues found. Create your first issue to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<IconWrapper icon={LazyAddIcon} />}
                sx={{ mt: 2 }}
              >
                Create Issue
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default DueDiligenceTools;
