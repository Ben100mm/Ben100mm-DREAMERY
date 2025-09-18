import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Checklist as ChecklistIcon,
  CameraAlt as CameraIcon,
  Videocam as VideoIcon,
  Build as BuildIcon,
  Key as KeyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Photo as PhotoIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { brandColors } from "../../../theme";

// Types
interface Task {
  id: string;
  category: 'exterior' | 'interior' | 'systems' | 'appliances' | 'documentation';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  photos: Photo[];
  videos: Video[];
  notes: string;
  requiresRepair: boolean;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  type: 'before' | 'after' | 'general';
}

interface Video {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  duration: number;
}

interface Repair {
  id: string;
  taskId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  estimatedCost: number;
  actualCost: number;
  beforePhotos: Photo[];
  afterPhotos: Photo[];
  completionDate?: string;
  verificationDate?: string;
  notes: string;
  warranty: boolean;
  warrantyExpiry?: string;
}

interface KeyExchange {
  id: string;
  scheduledDate: Date | null;
  scheduledTime: string;
  location: string;
  participants: string[];
  keys: Key[];
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  documents: Document[];
}

interface Key {
  id: string;
  type: 'front-door' | 'back-door' | 'garage' | 'mailbox' | 'pool' | 'other';
  description: string;
  quantity: number;
  received: boolean;
  receivedBy?: string;
  receivedAt?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'agreement' | 'receipt' | 'inventory' | 'other';
  url: string;
  uploadedAt: string;
  signed: boolean;
}

interface PossessionAgreement {
  id: string;
  buyerName: string;
  sellerName: string;
  propertyAddress: string;
  closingDate: string;
  possessionDate: string;
  rentBackPeriod?: number;
  rentBackAmount?: number;
  utilities: string[];
  maintenance: string[];
  insurance: string;
  status: 'draft' | 'signed' | 'active' | 'completed';
  terms: string[];
  signatures: Signature[];
}

interface Signature {
  id: string;
  name: string;
  role: 'buyer' | 'seller' | 'agent' | 'attorney';
  signedAt: string;
  signatureUrl: string;
}

interface WalkthroughData {
  checklist: Task[];
  repairs: Repair[];
  keyExchange: KeyExchange;
  possessionAgreement: PossessionAgreement;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    category: 'exterior',
    title: 'Roof Inspection',
    description: 'Check for any visible damage, missing shingles, or signs of leaks',
    status: 'completed',
    priority: 'high',
    assignedTo: 'John Smith',
    dueDate: '2024-02-10',
    completedDate: '2024-02-10',
    photos: [
      {
        id: '1',
        url: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Roof+OK',
        caption: 'Roof in good condition',
        timestamp: '2024-02-10T10:00:00Z',
        type: 'after',
      },
    ],
    videos: [],
    notes: 'Roof appears to be in excellent condition with no visible damage',
    requiresRepair: false,
  },
  {
    id: '2',
    category: 'interior',
    title: 'Kitchen Appliances',
    description: 'Test all kitchen appliances including refrigerator, stove, dishwasher',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-02-12',
    photos: [
      {
        id: '2',
        url: 'https://via.placeholder.com/300x200/ff9800/ffffff?text=Stove+Test',
        caption: 'Testing stove functionality',
        timestamp: '2024-02-11T14:30:00Z',
        type: 'general',
      },
    ],
    videos: [],
    notes: 'Refrigerator working, stove needs pilot light adjustment',
    requiresRepair: true,
  },
  {
    id: '3',
    category: 'systems',
    title: 'HVAC System',
    description: 'Test heating and cooling systems, check filters and ductwork',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Mike Wilson',
    dueDate: '2024-02-13',
    photos: [],
    videos: [],
    notes: '',
    requiresRepair: false,
  },
  {
    id: '4',
    category: 'appliances',
    title: 'Washer & Dryer',
    description: 'Test laundry appliances and check for any leaks or issues',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Lisa Brown',
    dueDate: '2024-02-14',
    photos: [],
    videos: [],
    notes: '',
    requiresRepair: false,
  },
];

const mockRepairs: Repair[] = [
  {
    id: '1',
    taskId: '2',
    description: 'Stove pilot light adjustment and burner cleaning',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Mike Wilson',
    estimatedCost: 150,
    actualCost: 125,
    beforePhotos: [
      {
        id: '3',
        url: 'https://via.placeholder.com/300x200/f44336/ffffff?text=Before',
        caption: 'Stove before repair',
        timestamp: '2024-02-11T15:00:00Z',
        type: 'before',
      },
    ],
    afterPhotos: [
      {
        id: '4',
        url: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=After',
        caption: 'Stove after repair',
        timestamp: '2024-02-11T16:30:00Z',
        type: 'after',
      },
    ],
    completionDate: '2024-02-11',
    verificationDate: '2024-02-11',
    notes: 'Pilot light adjusted, all burners working properly, stove cleaned',
    warranty: true,
    warrantyExpiry: '2025-02-11',
  },
];

const mockKeyExchange: KeyExchange = {
  id: '1',
  scheduledDate: new Date('2024-02-14'),
  scheduledTime: '14:00',
  location: 'Property Address - 123 Main St, San Francisco, CA 94102',
  participants: ['John Smith (Buyer)', 'Michael Johnson (Seller)', 'Sarah Wilson (Agent)'],
  keys: [
    {
      id: '1',
      type: 'front-door',
      description: 'Front door key',
      quantity: 2,
      received: false,
    },
    {
      id: '2',
      type: 'back-door',
      description: 'Back door key',
      quantity: 1,
      received: false,
    },
    {
      id: '3',
      type: 'garage',
      description: 'Garage remote',
      quantity: 1,
      received: false,
    },
  ],
  status: 'scheduled',
  notes: 'Meet at property for final walkthrough and key exchange',
  documents: [],
};

const mockPossessionAgreement: PossessionAgreement = {
  id: '1',
  buyerName: 'John & Sarah Smith',
  sellerName: 'Michael Johnson',
  propertyAddress: '123 Main St, San Francisco, CA 94102',
  closingDate: '2024-02-14',
  possessionDate: '2024-02-21',
  rentBackPeriod: 7,
  rentBackAmount: 200,
  utilities: ['Electric', 'Water', 'Gas', 'Internet'],
  maintenance: ['Lawn care', 'Pool maintenance', 'General repairs'],
  insurance: 'Seller maintains insurance until possession date',
  status: 'draft',
  terms: [
    'Seller agrees to maintain property in current condition',
    'Buyer agrees to pay $200/day for rent-back period',
    'Utilities remain in seller\'s name until possession date',
    'Seller responsible for all maintenance during rent-back period',
  ],
  signatures: [],
};

const FinalWalkthroughHandover: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [walkthroughData, setWalkthroughData] = useState<WalkthroughData>({
    checklist: mockTasks,
    repairs: mockRepairs,
    keyExchange: mockKeyExchange,
    possessionAgreement: mockPossessionAgreement,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [repairDialogOpen, setRepairDialogOpen] = useState(false);
  const [keyExchangeDialogOpen, setKeyExchangeDialogOpen] = useState(false);
  const [possessionDialogOpen, setPossessionDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setWalkthroughData(prev => ({
      ...prev,
      checklist: prev.checklist.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
  };

  const handleTaskPriorityChange = (taskId: string, newPriority: Task['priority']) => {
    setWalkthroughData(prev => ({
      ...prev,
      checklist: prev.checklist.map(task =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      ),
    }));
  };

  const handleRepairStatusChange = (repairId: string, newStatus: Repair['status']) => {
    setWalkthroughData(prev => ({
      ...prev,
      repairs: prev.repairs.map(repair =>
        repair.id === repairId ? { ...repair, status: newStatus } : repair
      ),
    }));
  };

  const handleKeyExchangeScheduling = async () => {
    try {
      const response = await fetch('/api/key-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walkthroughData.keyExchange),
      });

      if (response.ok) {
        toast.success('Key exchange scheduled successfully!');
        setKeyExchangeDialogOpen(false);
      } else {
        throw new Error('Failed to schedule key exchange');
      }
    } catch (error) {
      toast.error('Failed to schedule key exchange');
      console.error('Scheduling error:', error);
    }
  };

  const handlePossessionAgreement = async () => {
    try {
      const response = await fetch('/api/possession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walkthroughData.possessionAgreement),
      });

      if (response.ok) {
        toast.success('Possession agreement created successfully!');
        setPossessionDialogOpen(false);
      } else {
        throw new Error('Failed to create possession agreement');
      }
    } catch (error) {
      toast.error('Failed to create possession agreement');
      console.error('Agreement error:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadCaption || !selectedTask) {
      toast.error('Please select a file and provide a caption');
      return;
    }

    try {
      // Mock file upload
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: URL.createObjectURL(uploadFile),
        caption: uploadCaption,
        timestamp: new Date().toISOString(),
        type: 'general',
      };

      setWalkthroughData(prev => ({
        ...prev,
        checklist: prev.checklist.map(task =>
          task.id === selectedTask.id
            ? { ...task, photos: [...task.photos, newPhoto] }
            : task
        ),
      }));

      toast.success('File uploaded successfully!');
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadCaption('');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    }
  };

  const fetchRepairs = async () => {
    try {
      const response = await fetch('/api/repairs');
      if (response.ok) {
        const repairs = await response.json();
        setWalkthroughData(prev => ({ ...prev, repairs }));
      }
    } catch (error) {
      console.error('Failed to fetch repairs:', error);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return brandColors.accent.warning;
      case 'in-progress':
        return brandColors.accent.info;
      case 'completed':
        return brandColors.accent.success;
      case 'failed':
        return brandColors.actions.error;
      case 'verified':
        return '#9c27b0';
      default:
        return brandColors.text.disabled;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return brandColors.accent.success;
      case 'medium':
        return brandColors.accent.warning;
      case 'high':
        return brandColors.actions.error;
      case 'critical':
        return '#9c27b0';
      default:
        return brandColors.text.disabled;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exterior':
        return <HomeIcon />;
      case 'interior':
        return <HomeIcon />;
      case 'systems':
        return <BuildIcon />;
      case 'appliances':
        return <BuildIcon />;
      case 'documentation':
        return <AssignmentIcon />;
      default:
        return <HomeIcon />;
    }
  };

  const completedTasks = walkthroughData.checklist.filter(task => task.status === 'completed').length;
  const totalTasks = walkthroughData.checklist.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>

      {/* Progress Overview */}
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ChecklistIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Walkthrough Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedTasks} of {totalTasks} tasks completed
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {completionPercentage.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ChecklistIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
            <Typography variant="h6" component="div">
              {totalTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
            <Typography variant="h6" component="div">
              {completedTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <BuildIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
            <Typography variant="h6" component="div">
              {walkthroughData.repairs.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Repairs
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <KeyIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
            <Typography variant="h6" component="div">
              {walkthroughData.keyExchange.keys.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keys to Exchange
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: brandColors.neutral[100] }}>
          <Tab label="Walkthrough Checklist" />
          <Tab label="Repair Verification" />
          <Tab label="Key Exchange" />
          <Tab label="Possession Agreement" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Walkthrough Checklist Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Walkthrough Checklist
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setTaskDialogOpen(true)}
                >
                  Add Task
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {walkthroughData.checklist.map((task) => (
                  <Box key={task.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ backgroundColor: brandColors.actions.primary }}>
                            {getCategoryIcon(task.category)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {task.title}
                            </Typography>
                            <Chip 
                              label={task.category} 
                              size="small" 
                              color="primary"
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {task.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip 
                            label={task.status} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(task.status),
                              color: brandColors.backgrounds.primary
                            }}
                          />
                          <Chip 
                            label={task.priority} 
                            size="small"
                            sx={{ 
                              backgroundColor: getPriorityColor(task.priority),
                              color: brandColors.backgrounds.primary
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Assigned to: {task.assignedTo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Due: {task.dueDate}
                          </Typography>
                        </Box>

                        {task.photos.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Photos ({task.photos.length})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {task.photos.slice(0, 3).map((photo) => (
                                <Avatar
                                  key={photo.id}
                                  src={photo.url}
                                  variant="rounded"
                                  sx={{ width: 60, height: 60 }}
                                />
                              ))}
                              {task.photos.length > 3 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{task.photos.length - 3} more
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CameraIcon />}
                            onClick={() => {
                              setSelectedTask(task);
                              setUploadType('photo');
                              setUploadDialogOpen(true);
                            }}
                          >
                            Add Photo
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VideoIcon />}
                            onClick={() => {
                              setSelectedTask(task);
                              setUploadType('video');
                              setUploadDialogOpen(true);
                            }}
                          >
                            Add Video
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              setSelectedTask(task);
                              setTaskDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Repair Verification Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Repair Verification
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Before/After</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {walkthroughData.repairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {repair.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={repair.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(repair.status),
                            color: brandColors.backgrounds.primary
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={repair.priority} 
                          size="small"
                          sx={{ 
                            backgroundColor: getPriorityColor(repair.priority),
                            color: brandColors.backgrounds.primary
                          }}
                        />
                      </TableCell>
                      <TableCell>{repair.assignedTo}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Est: repair.estimatedCost
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Actual: repair.actualCost
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {repair.beforePhotos.length > 0 && (
                            <Tooltip title="Before">
                              <Avatar
                                src={repair.beforePhotos[0].url}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                            </Tooltip>
                          )}
                          {repair.afterPhotos.length > 0 && (
                            <Tooltip title="After">
                              <Avatar
                                src={repair.afterPhotos[0].url}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedRepair(repair);
                            setRepairDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Key Exchange Tab */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Key Exchange
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setKeyExchangeDialogOpen(true)}
                >
                  Schedule Exchange
                </Button>
              </Box>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <KeyIcon sx={{ fontSize: 40, color: '#1976d0' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Key Exchange Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {walkthroughData.keyExchange.status}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Scheduled Date
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.keyExchange.scheduledDate?.toLocaleDateString() || 'Not scheduled'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Scheduled Time
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.keyExchange.scheduledTime || 'Not scheduled'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.keyExchange.location}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Participants
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.keyExchange.participants.join(', ')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Keys to Exchange
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                      {walkthroughData.keyExchange.keys.map((key) => (
                        <Box key={key.id} sx={{ p: 2, border: '1px solid brandColors.borders.secondary', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {key.type.replace('-', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {key.description} (Qty: {key.quantity})
                          </Typography>
                          <Chip 
                            label={key.received ? 'Received' : 'Pending'} 
                            size="small"
                            color={key.received ? 'success' : 'warning'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Possession Agreement Tab */}
          {activeTab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Possession Agreement
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  onClick={() => setPossessionDialogOpen(true)}
                >
                  Create Agreement
                </Button>
              </Box>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: '#1976d0' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Possession Agreement Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {walkthroughData.possessionAgreement.status}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Buyer
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.possessionAgreement.buyerName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Seller
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.possessionAgreement.sellerName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Property Address
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.possessionAgreement.propertyAddress}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Closing Date
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.possessionAgreement.closingDate}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                        Possession Date
                      </Typography>
                      <Typography variant="body1">
                        {walkthroughData.possessionAgreement.possessionDate}
                      </Typography>
                    </Box>
                    {walkthroughData.possessionAgreement.rentBackPeriod && (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                          Rent-Back Period
                        </Typography>
                        <Typography variant="body1">
                          {walkthroughData.possessionAgreement.rentBackPeriod} days
                          {walkthroughData.possessionAgreement.rentBackAmount && (
                            <span> - walkthroughData.possessionAgreement.rentBackAmount/day</span>
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Agreement Terms
                    </Typography>
                    <List dense>
                      {walkthroughData.possessionAgreement.terms.map((term, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={term} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Task management form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Task</Button>
        </DialogActions>
      </Dialog>

      {/* Repair Dialog */}
      <Dialog open={repairDialogOpen} onClose={() => setRepairDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Repair Details</DialogTitle>
        <DialogContent>
          {selectedRepair && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRepair.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status: {selectedRepair.status} | Priority: {selectedRepair.priority}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Assigned to: {selectedRepair.assignedTo}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Cost: selectedRepair.actualCost (Estimated: selectedRepair.estimatedCost)
              </Typography>
              {selectedRepair.completionDate && (
                <Typography variant="body2" gutterBottom>
                  Completed: {selectedRepair.completionDate}
                </Typography>
              )}
              <Typography variant="body2" gutterBottom>
                Notes: {selectedRepair.notes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRepairDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Key Exchange Dialog */}
      <Dialog open={keyExchangeDialogOpen} onClose={() => setKeyExchangeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule Key Exchange</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Exchange Date"
                value={walkthroughData.keyExchange.scheduledDate}
                onChange={(newDate) => setWalkthroughData(prev => ({
                  ...prev,
                  keyExchange: { ...prev.keyExchange, scheduledDate: newDate }
                }))}
                minDate={new Date()}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Exchange Time"
              type="time"
              value={walkthroughData.keyExchange.scheduledTime}
              onChange={(e) => setWalkthroughData(prev => ({
                ...prev,
                keyExchange: { ...prev.keyExchange, scheduledTime: e.target.value }
              }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Location"
              value={walkthroughData.keyExchange.location}
              onChange={(e) => setWalkthroughData(prev => ({
                ...prev,
                keyExchange: { ...prev.keyExchange, location: e.target.value }
              }))}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={walkthroughData.keyExchange.notes}
              onChange={(e) => setWalkthroughData(prev => ({
                ...prev,
                keyExchange: { ...prev.keyExchange, notes: e.target.value }
              }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKeyExchangeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleKeyExchangeScheduling} variant="contained">
            Schedule Exchange
          </Button>
        </DialogActions>
      </Dialog>

      {/* Possession Agreement Dialog */}
      <Dialog open={possessionDialogOpen} onClose={() => setPossessionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Possession Agreement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Possession agreement form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPossessionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePossessionAgreement} variant="contained">
            Create Agreement
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add {uploadType === 'photo' ? 'Photo' : 'Video'} to Task
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Caption"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            type="file"
            fullWidth
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setUploadFile(target.files?.[0] || null);
            }}
            inputProps={{
              accept: uploadType === 'photo' ? '.jpg,.jpeg,.png,.gif' : '.mp4,.mov,.avi'
            }}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            {uploadType === 'photo' ? 'Upload a photo to document the task progress or completion.' : 'Upload a video to document the task progress or completion.'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFileUpload} variant="contained" disabled={!uploadFile || !uploadCaption}>
            Upload {uploadType === 'photo' ? 'Photo' : 'Video'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinalWalkthroughHandover;
