import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AssistantIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as DocumentIcon,
  Notifications as NotificationIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { brandColors } from '../../../theme';
import ManageAssistantIcon from './ManageAssistantIcon';

// Types
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ActionButton[];
}

interface ActionButton {
  label: string;
  type: 'button';
  action: string;
}

interface Prediction {
  id: string;
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
}

interface Summary {
  id: string;
  title: string;
  content: string;
  type: 'lease' | 'application' | 'payment' | 'maintenance';
  date: Date;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  type: 'lease_renewal' | 'maintenance' | 'payment' | 'inspection';
  completed: boolean;
}

interface AssistantData {
  predictions: Prediction[];
  summaries: Summary[];
  reminders: Reminder[];
  chatHistory: Message[];
}

// Mock data for property management context
const mockPredictions: Prediction[] = [
  {
    id: '1',
    title: 'Lease Renewal Probability',
    description: 'High probability that tenant will renew lease based on payment history and communication patterns.',
    confidence: 85,
    timeframe: 'Next 30 days',
    impact: 'high',
  },
  {
    id: '2',
    title: 'Maintenance Cost Forecast',
    description: 'Predicted maintenance costs for Q1 based on seasonal patterns and property age.',
    confidence: 78,
    timeframe: 'Next 90 days',
    impact: 'medium',
  },
  {
    id: '3',
    title: 'Rent Increase Opportunity',
    description: 'Market analysis suggests 8-12% rent increase potential for next lease cycle.',
    confidence: 92,
    timeframe: 'Next 6 months',
    impact: 'high',
  },
];

const mockSummaries: Summary[] = [
  {
    id: '1',
    title: 'Lease Agreement Summary',
    content: 'Standard 12-month lease with security deposit equal to one month rent. Includes pet policy and maintenance responsibilities.',
    type: 'lease',
    date: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Tenant Application Review',
    content: 'Application shows strong credit score (750+), stable employment history, and positive rental references.',
    type: 'application',
    date: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Monthly Payment Status',
    content: 'All tenants current on payments. One late payment noted for Unit 2B in December, resolved with late fee.',
    type: 'payment',
    date: new Date('2024-01-01'),
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Lease Renewal Notice',
    description: 'Send renewal notice to tenant in Unit 3A - lease expires March 31st',
    dueDate: new Date('2024-02-15'),
    priority: 'high',
    type: 'lease_renewal',
    completed: false,
  },
  {
    id: '2',
    title: 'HVAC Maintenance',
    description: 'Schedule annual HVAC inspection and maintenance for all units',
    dueDate: new Date('2024-02-20'),
    priority: 'medium',
    type: 'maintenance',
    completed: false,
  },
  {
    id: '3',
    title: 'Property Tax Payment',
    description: 'Annual property tax payment due for all managed properties',
    dueDate: new Date('2024-03-01'),
    priority: 'high',
    type: 'payment',
    completed: false,
  },
];

const mockChatHistory: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Hello! I\'m Lumina, your Property Management Assistant. I can help you with tenant insights, maintenance predictions, lease management, and property performance analytics. What would you like to know about your properties?',
    timestamp: new Date(),
    actions: [
      { label: 'Property insights', type: 'button', action: 'insights' },
      { label: 'Tenant status', type: 'button', action: 'tenants' },
      { label: 'Maintenance schedule', type: 'button', action: 'maintenance' },
    ],
  },
];

const ManageAssistant: React.FC = () => {
  const [assistantData, setAssistantData] = useState<AssistantData>({
    predictions: mockPredictions,
    summaries: mockSummaries,
    reminders: mockReminders,
    chatHistory: mockChatHistory,
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Summary | null>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantData.chatHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setAssistantData(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMessage],
    }));

    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const response = await generateAIResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions,
      };

      setAssistantData(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, assistantMessage],
      }));

      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = async (userInput: string): Promise<{ content: string; actions?: ActionButton[] }> => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('tenant') || lowerInput.includes('renter')) {
      return {
        content: 'I can help you with tenant-related information. Based on your current data, all tenants are up to date on payments. Unit 3A has a lease renewal coming up in March. Would you like me to show you detailed tenant status or help with lease renewals?',
        actions: [
          { label: 'Tenant status', type: 'button', action: 'tenants' },
          { label: 'Lease renewals', type: 'button', action: 'renewals' },
        ],
      };
    }
    
    if (lowerInput.includes('maintenance') || lowerInput.includes('repair')) {
      return {
        content: 'I can assist with maintenance planning and tracking. Your properties show normal wear patterns. I recommend scheduling the annual HVAC inspection soon. Would you like to see the maintenance schedule or cost predictions?',
        actions: [
          { label: 'Maintenance schedule', type: 'button', action: 'maintenance' },
          { label: 'Cost predictions', type: 'button', action: 'costs' },
        ],
      };
    }
    
    if (lowerInput.includes('rent') || lowerInput.includes('payment') || lowerInput.includes('earnings')) {
      return {
        content: 'Great question about rental income! Your properties are performing well with 95% occupancy and on-time payments. Market analysis suggests potential for rent increases. Would you like to see earnings analytics or rent optimization suggestions?',
        actions: [
          { label: 'Earnings analytics', type: 'button', action: 'earnings' },
          { label: 'Rent optimization', type: 'button', action: 'rent_optimization' },
        ],
      };
    }
    
    if (lowerInput.includes('property') || lowerInput.includes('performance')) {
      return {
        content: 'I can provide comprehensive property performance insights. Your portfolio shows strong performance with excellent tenant retention and above-market rental yields. Would you like detailed analytics or specific property comparisons?',
        actions: [
          { label: 'Property insights', type: 'button', action: 'insights' },
          { label: 'Performance analytics', type: 'button', action: 'analytics' },
        ],
      };
    }
    
    return {
      content: 'I\'m here to help with all aspects of property management! I can assist with tenant management, maintenance scheduling, lease administration, rent optimization, and property performance analytics. What specific area would you like to explore?',
      actions: [
        { label: 'Property insights', type: 'button', action: 'insights' },
        { label: 'Tenant status', type: 'button', action: 'tenants' },
        { label: 'Maintenance schedule', type: 'button', action: 'maintenance' },
      ],
    };
  };

  const handleActionClick = (action: string) => {
    let message = '';
    let actions: ActionButton[] = [];
    
    switch (action) {
      case 'insights':
        message = 'Here are your key property insights: Your portfolio has 95% occupancy rate, average rent collection time is 2 days early, and tenant satisfaction scores are 4.2/5. The main opportunity is optimizing rent prices based on current market conditions.';
        actions = [
          { label: 'Market analysis', type: 'button', action: 'market' },
          { label: 'Rent optimization', type: 'button', action: 'rent_optimization' },
        ];
        break;
      case 'tenants':
        message = 'Tenant Status Overview: 12 active tenants across 3 properties. All payments current. 2 lease renewals due in the next 60 days. Average tenant tenure is 18 months. 1 maintenance request pending.';
        actions = [
          { label: 'Lease renewals', type: 'button', action: 'renewals' },
          { label: 'Maintenance requests', type: 'button', action: 'maintenance_requests' },
        ];
        break;
      case 'maintenance':
        message = 'Maintenance Schedule: HVAC inspection due Feb 20th, quarterly property inspections scheduled for March, and seasonal landscaping planned for April. Total estimated cost: $2,400.';
        actions = [
          { label: 'Schedule maintenance', type: 'button', action: 'schedule' },
          { label: 'Cost breakdown', type: 'button', action: 'costs' },
        ];
        break;
      default:
        message = 'I can help you with that! Let me gather the specific information you need.';
    }
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: message,
      timestamp: new Date(),
      actions,
    };
    
    setAssistantData(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, assistantMessage],
    }));
  };

  const handleDocumentClick = (document: Summary) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ManageAssistantIcon size={32} sx={{ mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
            Property Management Assistant
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Get intelligent insights, predictions, and assistance for your property management operations.
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 1 }} />
              <Typography variant="h6">95%</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Occupancy Rate</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DocumentIcon sx={{ color: brandColors.primary, mr: 1 }} />
              <Typography variant="h6">3</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Active Properties</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <NotificationIcon sx={{ color: brandColors.accent.warning, mr: 1 }} />
              <Typography variant="h6">2</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Pending Renewals</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ backgroundColor: brandColors.neutral[100] }}>
          <Tab label="Lumina Chat" />
          <Tab label="Predictions" />
          <Tab label="Document Analysis" />
          <Tab label="Reminders" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Lumina Chat Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Chat with Lumina
              </Typography>

              {/* Chat Messages */}
              <Box sx={{ height: 400, overflowY: 'auto', mb: 2, p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1 }}>
                {assistantData.chatHistory.map((message) => (
                  <Box key={message.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: message.type === 'assistant' ? brandColors.primary : brandColors.secondary,
                        fontSize: '0.875rem'
                      }}>
                        {message.type === 'assistant' ? 'L' : 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {message.type === 'assistant' ? 'Lumina' : 'You'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {message.content}
                        </Typography>
                        {message.actions && (
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {message.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="small"
                                variant="outlined"
                                onClick={() => handleActionClick(action.action)}
                                sx={{ mb: 1 }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: brandColors.primary }}>
                      L
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Lumina is typing...
                    </Typography>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>

              {/* Chat Input */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Ask me anything about your property management..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  size="small"
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>

              {/* Quick Actions */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Quick actions:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" onClick={() => handleActionClick('insights')}>
                    Property insights
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleActionClick('tenants')}>
                    Tenant status
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleActionClick('maintenance')}>
                    Maintenance schedule
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Predictions Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Property Predictions
              </Typography>
              <List>
                {assistantData.predictions.map((prediction) => (
                  <ListItem key={prediction.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={prediction.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {prediction.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`${prediction.confidence}% confidence`} size="small" />
                            <Chip label={prediction.timeframe} size="small" />
                            <Chip 
                              label={prediction.impact} 
                              size="small" 
                              color={getImpactColor(prediction.impact)}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Document Analysis Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Document Analysis
              </Typography>
              <List>
                {assistantData.summaries.map((summary) => (
                  <ListItem 
                    key={summary.id} 
                    button 
                    onClick={() => handleDocumentClick(summary)}
                    sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <DocumentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={summary.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {summary.content}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={summary.type} size="small" />
                            <Typography variant="caption" color="text.secondary">
                              {summary.date.toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Reminders Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Property Management Reminders
              </Typography>
              <List>
                {assistantData.reminders.map((reminder) => (
                  <ListItem key={reminder.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <NotificationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={reminder.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {reminder.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={reminder.priority} 
                              size="small" 
                              color={getPriorityColor(reminder.priority)}
                            />
                            <Chip label={reminder.type} size="small" />
                            <Typography variant="caption" color="text.secondary">
                              Due: {reminder.dueDate.toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Document Dialog */}
      <Dialog open={documentDialogOpen} onClose={() => setDocumentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {selectedDocument?.title}
            <IconButton onClick={() => setDocumentDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedDocument.content}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={selectedDocument.type} />
                <Typography variant="body2" color="text.secondary">
                  Document Date: {selectedDocument.date.toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAssistant;
