import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Description as DocumentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Lightbulb as LightbulbIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { brandColors } from "../../theme";

// Custom Lumina Logo Component
const LuminaIcon: React.FC<{ sx?: any; size?: number }> = ({ sx = {}, size = 24 }) => (
  <Box
    component="img"
    src="/lumina-logo.png"
    alt="Lumina logo"
    sx={{
      width: size,
      height: size,
      ...sx
    }}
  />
);

// Types
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  actions?: Action[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'link';
  url: string;
  size?: string;
}

interface Action {
  id: string;
  label: string;
  type: 'button' | 'link' | 'form';
  action: string;
  icon?: string;
}

interface Prediction {
  id: string;
  type: 'delay' | 'risk' | 'opportunity' | 'milestone';
  title: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  estimatedDate?: string;
  confidence: number;
  recommendations: string[];
  category: 'timeline' | 'financing' | 'legal' | 'inspection' | 'closing' | 'title';
}

interface Summary {
  id: string;
  documentName: string;
  documentType: 'contract' | 'inspection' | 'appraisal' | 'title' | 'insurance' | 'other';
  summary: string;
  keyPoints: string[];
  riskLevel: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  nextSteps: string[];
  createdAt: string;
  wordCount: number;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  completed: boolean;
  snoozed: boolean;
  snoozeUntil?: string;
}

interface AssistantData {
  predictions: Prediction[];
  summaries: Summary[];
  reminders: Reminder[];
  chatHistory: Message[];
}

// Mock data
const mockPredictions: Prediction[] = [
  {
    id: '1',
    type: 'delay',
    title: 'Title Search Delay',
    description: 'County records show a potential lien that needs resolution before closing',
    probability: 0.75,
    impact: 'high',
    estimatedDate: '2024-02-20',
    confidence: 0.85,
    recommendations: [
      'Contact title company immediately',
      'Request expedited lien search',
      'Prepare alternative closing date',
      'Notify all parties of potential delay'
    ],
    category: 'title',
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Inspection Completion',
    description: 'Home inspection scheduled for tomorrow, results expected within 24 hours',
    probability: 0.95,
    impact: 'medium',
    estimatedDate: '2024-02-15',
    confidence: 0.90,
    recommendations: [
      'Ensure property is accessible',
      'Prepare inspection fee',
      'Schedule follow-up for any issues',
      'Review inspection contingency timeline'
    ],
    category: 'inspection',
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'Rate Lock Extension',
    description: 'Current rate lock expires in 5 days, consider extending for better terms',
    probability: 0.60,
    impact: 'medium',
    estimatedDate: '2024-02-19',
    confidence: 0.75,
    recommendations: [
      'Check current market rates',
      'Calculate extension cost vs. savings',
      'Consult with lender about options',
      'Review loan commitment terms'
    ],
    category: 'financing',
  },
];

const mockSummaries: Summary[] = [
  {
    id: '1',
    documentName: 'Purchase Agreement',
    documentType: 'contract',
    summary: 'Standard residential purchase agreement with 30-day closing timeline and standard contingencies for inspection and financing.',
    keyPoints: [
      'Purchase price: $750,000',
      'Closing date: February 28, 2024',
      'Inspection contingency: 10 days',
      'Financing contingency: 21 days',
      'Earnest money: $15,000'
    ],
    riskLevel: 'low',
    actionRequired: false,
    nextSteps: [
      'Schedule home inspection',
      'Submit loan application',
      'Order title search',
      'Coordinate closing date'
    ],
    createdAt: '2024-02-10T10:00:00Z',
    wordCount: 1250,
  },
  {
    id: '2',
    documentName: 'Home Inspection Report',
    documentType: 'inspection',
    summary: 'Overall good condition with minor issues requiring attention. No major structural concerns identified.',
    keyPoints: [
      'Roof: Good condition, 5-7 years remaining',
      'HVAC: Functional, recommend service',
      'Electrical: Up to code, minor updates needed',
      'Plumbing: Good condition, one leaky faucet',
      'Foundation: Solid, no issues'
    ],
    riskLevel: 'medium',
    actionRequired: true,
    nextSteps: [
      'Request seller repairs for leaky faucet',
      'Schedule HVAC service',
      'Review electrical updates with contractor',
      'Consider roof replacement timeline'
    ],
    createdAt: '2024-02-12T14:30:00Z',
    wordCount: 850,
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Submit Loan Documents',
    description: 'Lender requires additional documentation for loan approval',
    dueDate: '2024-02-16',
    priority: 'high',
    category: 'financing',
    completed: false,
    snoozed: false,
  },
  {
    id: '2',
    title: 'Schedule Final Walkthrough',
    description: 'Coordinate final property inspection before closing',
    dueDate: '2024-02-25',
    priority: 'medium',
    category: 'inspection',
    completed: false,
    snoozed: false,
  },
  {
    id: '3',
    title: 'Transfer Utilities',
    description: 'Contact utility companies to transfer services to buyer',
    dueDate: '2024-02-27',
    priority: 'medium',
    category: 'closing',
    completed: false,
    snoozed: false,
  },
];

const mockChatHistory: Message[] = [
  {
    id: '1',
          type: 'assistant',
      content: 'Hello! I\'m Lumina your Closing Assistant. I can help you with timeline predictions, document summaries, and personalized reminders. What would you like to know about your closing process?',
    timestamp: new Date(Date.now() - 3600000),
    actions: [
      { id: '1', label: 'What\'s next?', type: 'button', action: 'timeline' },
      { id: '2', label: 'Document help', type: 'button', action: 'documents' },
      { id: '3', label: 'Check reminders', type: 'button', action: 'reminders' },
    ],
  },
];

const ClosingAssistant: React.FC = () => {
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
  const [summaryText, setSummaryText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
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

  const generateAIResponse = async (userInput: string): Promise<{ content: string; actions?: Action[] }> => {
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('AI response error:', error);
    }

    // Fallback responses based on keywords
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('next') || lowerInput.includes('timeline')) {
      return {
        content: 'Based on your current progress, here\'s what\'s coming up:\n\n1. **Home Inspection** (Tomorrow) - Results expected within 24 hours\n2. **Loan Processing** (3-5 days) - Submit any requested documents\n3. **Title Search** (1-2 weeks) - Currently in progress\n4. **Final Walkthrough** (3 days before closing)\n5. **Closing** (February 28, 2024)\n\nWould you like me to check for any potential delays or help with specific tasks?',
        actions: [
          { id: '1', label: 'Check for delays', type: 'button', action: 'check-delays' },
          { id: '2', label: 'View timeline', type: 'button', action: 'view-timeline' },
        ],
      };
    } else if (lowerInput.includes('document') || lowerInput.includes('help')) {
      return {
        content: 'I can help you with document analysis and summaries. Here are your current documents:\n\n• Purchase Agreement (reviewed)\n• Home Inspection Report (action required)\n• Loan Application (in progress)\n\nWould you like me to summarize any specific document or help you understand what\'s needed next?',
        actions: [
          { id: '1', label: 'Summarize documents', type: 'button', action: 'summarize' },
          { id: '2', label: 'Check requirements', type: 'button', action: 'requirements' },
        ],
      };
    } else if (lowerInput.includes('reminder') || lowerInput.includes('due')) {
      return {
        content: 'Here are your upcoming deadlines:\n\n🚨 **High Priority** (Due Feb 16): Submit loan documents\n📅 **Medium Priority** (Due Feb 25): Schedule final walkthrough\n📅 **Medium Priority** (Due Feb 27): Transfer utilities\n\nWould you like me to set up additional reminders or help you complete any of these tasks?',
        actions: [
          { id: '1', label: 'Set reminders', type: 'button', action: 'set-reminders' },
          { id: '2', label: 'Mark complete', type: 'button', action: 'mark-complete' },
        ],
      };
    } else {
      return {
        content: 'I\'m Lumina, your closing assistant! I can:\n\n• Predict potential delays and issues\n• Summarize and analyze documents\n• Set personalized reminders\n• Answer questions about next steps\n\nWhat would you like to know?',
        actions: [
          { id: '1', label: 'What\'s next?', type: 'button', action: 'timeline' },
          { id: '2', label: 'Document help', type: 'button', action: 'documents' },
          { id: '3', label: 'Check reminders', type: 'button', action: 'reminders' },
        ],
      };
    }
  };

  const handleActionClick = (action: Action) => {
    switch (action.action) {
      case 'timeline':
        setActiveTab(1);
        break;
      case 'documents':
        setActiveTab(2);
        break;
      case 'reminders':
        setActiveTab(3);
        break;
      case 'check-delays':
        setActiveTab(1);
        break;
      case 'summarize':
        setActiveTab(2);
        break;
      case 'set-reminders':
        setActiveTab(3);
        break;
      default:
        break;
    }
  };

  const handleDocumentSummary = async (documentText: string) => {
    if (!documentText.trim()) {
      toast.error('Please enter document text to summarize');
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch('/api/assistant/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: documentText }),
      });

      if (response.ok) {
        const summary = await response.json();
        toast.success('Document summarized successfully!');
        // Add summary to list
        const newSummary: Summary = {
          id: Date.now().toString(),
          documentName: 'Custom Document',
          documentType: 'other',
          summary: summary.summary,
          keyPoints: summary.keyPoints || [],
          riskLevel: summary.riskLevel || 'low',
          actionRequired: summary.actionRequired || false,
          nextSteps: summary.nextSteps || [],
          createdAt: new Date().toISOString(),
          wordCount: documentText.split(' ').length,
        };
        setAssistantData(prev => ({
          ...prev,
          summaries: [newSummary, ...prev.summaries],
        }));
      } else {
        throw new Error('Failed to summarize document');
      }
    } catch (error) {
      toast.error('Failed to summarize document');
      console.error('Summarization error:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDelayPrediction = async () => {
    try {
      const response = await fetch('/api/assistant/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'delay' }),
      });

      if (response.ok) {
        const predictions = await response.json();
        setAssistantData(prev => ({ ...prev, predictions }));
        toast.success('Delay predictions updated!');
      } else {
        throw new Error('Failed to fetch predictions');
      }
    } catch (error) {
      toast.error('Failed to fetch delay predictions');
      console.error('Prediction error:', error);
    }
  };

  const handleReminderUpdate = async (reminderId: string, updates: Partial<Reminder>) => {
    try {
      const response = await fetch(`/api/assistant/reminders/${reminderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setAssistantData(prev => ({
          ...prev,
          reminders: prev.reminders.map(reminder =>
            reminder.id === reminderId ? { ...reminder, ...updates } : reminder
          ),
        }));
        toast.success('Reminder updated successfully!');
      } else {
        throw new Error('Failed to update reminder');
      }
    } catch (error) {
      toast.error('Failed to update reminder');
      console.error('Reminder update error:', error);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return brandColors.accent.success;
      case 'medium':
        return brandColors.accent.warning;
      case 'high':
        return brandColors.actions.error;
      case 'critical':
        return brandColors.accent.info;
      default:
        return brandColors.text.disabled;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return brandColors.accent.success;
      case 'medium':
        return brandColors.accent.warning;
      case 'high':
        return brandColors.actions.error;
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
        return brandColors.accent.info;
      default:
        return brandColors.text.disabled;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Dreamery's Closing Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get intelligent insights, predictions, and personalized guidance for your closing process
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
            <Typography variant="h6" component="div">
              {assistantData.predictions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lumina Predictions
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <DocumentIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
            <Typography variant="h6" component="div">
              {assistantData.summaries.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Documents Analyzed
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
            <Typography variant="h6" component="div">
              {assistantData.reminders.filter(r => !r.completed).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Reminders
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
                            <LuminaIcon size={40} sx={{ mb: 1 }} />
            <Typography variant="h6" component="div">
              {assistantData.chatHistory.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Conversations
            </Typography>
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
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar sx={{ backgroundColor: message.type === 'assistant' ? brandColors.actions.primary : brandColors.accent.success }}>
                        {message.type === 'assistant' ? <LuminaIcon size={24} /> : <HomeIcon />}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {message.type === 'assistant' ? 'Lumina' : 'You'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <Paper sx={{ p: 2, backgroundColor: message.type === 'assistant' ? brandColors.backgrounds.primary : brandColors.backgrounds.selected }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {message.content}
                          </Typography>
                          {message.actions && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                              {message.actions.map((action) => (
                                <Button
                                  key={action.id}
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleActionClick(action)}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </Box>
                          )}
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                ))}
                {isTyping && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Avatar sx={{ backgroundColor: brandColors.actions.primary }}>
                      <LuminaIcon size={24} />
                    </Avatar>
                    <Paper sx={{ p: 2, backgroundColor: brandColors.backgrounds.primary }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Lumina is thinking...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>

              {/* Chat Input */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Ask me anything about your closing process..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Quick Actions */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quick actions:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<TimelineIcon />}
                    onClick={() => setInputMessage('What\'s next in my closing process?')}
                  >
                    What's next?
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DocumentIcon />}
                    onClick={() => setInputMessage('Help me understand my documents')}
                  >
                    Document help
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<NotificationsIcon />}
                    onClick={() => setInputMessage('Check my reminders and deadlines')}
                  >
                    Check reminders
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Predictions Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Lumina Predictions & Insights
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleDelayPrediction}
                >
                  Refresh Predictions
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {assistantData.predictions.map((prediction) => (
                  <Box key={prediction.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ backgroundColor: getImpactColor(prediction.impact) }}>
                            {prediction.type === 'delay' ? <WarningIcon /> :
                             prediction.type === 'milestone' ? <CheckCircleIcon /> :
                             prediction.type === 'opportunity' ? <LightbulbIcon /> : <InfoIcon />}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {prediction.title}
                            </Typography>
                            <Chip 
                              label={prediction.type} 
                              size="small" 
                              color="primary"
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {prediction.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Probability
                            </Typography>
                            <Typography variant="body2">
                              {(prediction.probability * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Impact
                            </Typography>
                            <Chip 
                              label={prediction.impact} 
                              size="small"
                              sx={{ 
                                backgroundColor: getImpactColor(prediction.impact),
                                color: brandColors.backgrounds.primary
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Confidence
                            </Typography>
                            <Typography variant="body2">
                              {(prediction.confidence * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                          {prediction.estimatedDate && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Estimated Date
                              </Typography>
                              <Typography variant="body2">
                                {prediction.estimatedDate}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Recommendations
                          </Typography>
                          <List dense>
                            {prediction.recommendations.map((rec, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircleIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={rec} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Document Analysis Tab */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Document Analysis & Summaries
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DocumentIcon />}
                  onClick={() => setDocumentDialogOpen(true)}
                >
                  Analyze New Document
                </Button>
              </Box>

              {/* Document Summarization Tool */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Document Summarization Tool
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Paste your document text below and I'll provide a summary with key points and next steps.
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Paste your document text here..."
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleDocumentSummary(summaryText)}
                    disabled={!summaryText.trim() || isSummarizing}
                    startIcon={isSummarizing ? <CircularProgress size={16} /> : <DocumentIcon />}
                  >
                    {isSummarizing ? 'Analyzing...' : 'Analyze Document'}
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Summaries */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {assistantData.summaries.map((summary) => (
                  <Box key={summary.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ backgroundColor: getRiskColor(summary.riskLevel) }}>
                            <DocumentIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {summary.documentName}
                            </Typography>
                            <Chip 
                              label={summary.documentType} 
                              size="small" 
                              color="primary"
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {summary.summary}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Key Points
                          </Typography>
                          {summary.keyPoints.slice(0, 3).map((point, index) => (
                            <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              • {point}
                            </Typography>
                          ))}
                          {summary.keyPoints.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{summary.keyPoints.length - 3} more points
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip 
                            label={`Risk: ${summary.riskLevel}`} 
                            size="small"
                            sx={{ 
                              backgroundColor: getRiskColor(summary.riskLevel),
                              color: brandColors.backgrounds.primary
                            }}
                          />
                          {summary.actionRequired && (
                            <Chip 
                              label="Action Required" 
                              size="small"
                              color="warning"
                            />
                          )}
                          <Chip 
                            label={`${summary.wordCount} words`} 
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedDocument(summary);
                            setDocumentDialogOpen(true);
                          }}
                          fullWidth
                        >
                          View Full Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Reminders Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personalized Reminders
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {assistantData.reminders.map((reminder) => (
                  <Box key={reminder.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ backgroundColor: getPriorityColor(reminder.priority) }}>
                            <NotificationsIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {reminder.title}
                            </Typography>
                            <Chip 
                              label={reminder.priority} 
                              size="small"
                              sx={{ 
                                backgroundColor: getPriorityColor(reminder.priority),
                                color: brandColors.backgrounds.primary
                              }}
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {reminder.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Due Date
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reminder.dueDate}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleReminderUpdate(reminder.id, { completed: !reminder.completed })}
                            color={reminder.completed ? 'success' : 'primary'}
                            fullWidth
                          >
                            {reminder.completed ? 'Completed' : 'Mark Complete'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleReminderUpdate(reminder.id, { snoozed: !reminder.snoozed })}
                            color={reminder.snoozed ? 'warning' : 'primary'}
                            fullWidth
                          >
                            {reminder.snoozed ? 'Snoozed' : 'Snooze'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Document Analysis Dialog */}
      <Dialog open={documentDialogOpen} onClose={() => setDocumentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDocument ? 'Document Analysis' : 'Analyze New Document'}
        </DialogTitle>
        <DialogContent>
          {selectedDocument ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedDocument.documentName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Type: {selectedDocument.documentType} | Risk Level: {selectedDocument.riskLevel}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedDocument.summary}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Key Points
                </Typography>
                <List dense>
                  {selectedDocument.keyPoints.map((point, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Next Steps
                </Typography>
                <List dense>
                  {selectedDocument.nextSteps.map((step, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <AssignmentIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                Document analysis form will be implemented here.
              </Typography>
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

export default ClosingAssistant;
