import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  IconButton,
  Chip,
  Badge,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Support as SupportIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  IntegrationInstructions as IntegrationIcon,
  BugReport as BugReportIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'client' | 'technical-support' | 'training' | 'compliance' | 'integration' | 'feature-request' | 'emergency' | 'general';
  organization: string;
  supportLevel?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'urgent' | 'normal' | 'completed';
  avatar?: string;
  email?: string;
  phone?: string;
  role?: string;
  joinDate?: string;
  verificationStatus?: string;
  dateOfContact?: string;
  topicOfDiscussion?: string;
  supportTicketId?: string;
  priority?: string;
  resolutionStatus?: string;
}

interface Message {
  id: number;
  sender: 'support' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const ProfessionalSupportMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Mock conversations data for professional support
  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Sarah Mitchell',
      contactType: 'client',
      organization: 'Premier Realty Group',
      supportLevel: 'Premium Support',
      lastMessage: 'The new MLS integration feature is working perfectly. Thank you for the quick implementation!',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
      email: 'sarah.mitchell@premierrealty.com',
      phone: '(555) 123-4567',
      role: 'Real Estate Broker',
      joinDate: '2023-01-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-20',
      topicOfDiscussion: 'MLS Integration & Feature Implementation',
      supportTicketId: 'SUP-2024-001',
      priority: 'High',
      resolutionStatus: 'In Progress',
    },
    {
      id: 2,
      contactName: 'Michael Chen',
      contactType: 'technical-support',
      organization: 'Tech Solutions Inc.',
      supportLevel: 'Standard Support',
      lastMessage: 'Database performance issue resolved. System running at optimal speed.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
      email: 'michael.chen@techsolutions.com',
      phone: '(555) 234-5678',
      role: 'IT Administrator',
      joinDate: '2023-03-20',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-18',
      topicOfDiscussion: 'System Performance & Database Optimization',
      supportTicketId: 'SUP-2024-002',
      priority: 'Medium',
      resolutionStatus: 'Resolved',
    },
    {
      id: 3,
      contactName: 'Jennifer Rodriguez',
      contactType: 'training',
      organization: 'Real Estate Training Academy',
      supportLevel: 'Training Support',
      lastMessage: 'Training session completed successfully. All agents are now certified.',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
      email: 'jennifer.rodriguez@trainingacademy.com',
      phone: '(555) 345-6789',
      role: 'Training Coordinator',
      joinDate: '2022-08-10',
      verificationStatus: 'Certified',
      dateOfContact: '2024-01-16',
      topicOfDiscussion: 'Platform Training & Certification',
      supportTicketId: 'SUP-2024-003',
      priority: 'Medium',
      resolutionStatus: 'Completed',
    },
    {
      id: 4,
      contactName: 'David Thompson',
      contactType: 'compliance',
      organization: 'Real Estate Compliance Services',
      supportLevel: 'Compliance Support',
      lastMessage: 'Annual compliance audit completed. All systems meet regulatory requirements.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
      email: 'david.thompson@compliance.com',
      phone: '(555) 456-7890',
      role: 'Compliance Officer',
      joinDate: '2023-02-15',
      verificationStatus: 'Certified',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Regulatory Compliance & System Audit',
      supportTicketId: 'SUP-2024-004',
      priority: 'High',
      resolutionStatus: 'Resolved',
    },
    {
      id: 5,
      contactName: 'Lisa Anderson',
      contactType: 'integration',
      organization: 'Integration Partners LLC',
      supportLevel: 'Integration Support',
      lastMessage: 'Third-party API integration testing completed. Ready for production deployment.',
      timestamp: '4 days ago',
      unread: 1,
      status: 'normal',
      email: 'lisa.anderson@integrationpartners.com',
      phone: '(555) 567-8901',
      role: 'Integration Specialist',
      joinDate: '2021-12-05',
      verificationStatus: 'Certified',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Third-Party Integration & API Development',
      supportTicketId: 'SUP-2024-005',
      priority: 'Medium',
      resolutionStatus: 'In Progress',
    },
    {
      id: 6,
      contactName: 'Robert Kim',
      contactType: 'feature-request',
      organization: 'Innovation Real Estate Group',
      supportLevel: 'Premium Support',
      lastMessage: 'Feature request for automated reporting has been submitted for review.',
      timestamp: '5 days ago',
      unread: 0,
      status: 'completed',
      email: 'robert.kim@innovationrealty.com',
      phone: '(555) 678-9012',
      role: 'Business Analyst',
      joinDate: '2023-01-22',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-10',
      topicOfDiscussion: 'Feature Development & Product Enhancement',
      supportTicketId: 'SUP-2024-006',
      priority: 'Low',
      resolutionStatus: 'Submitted',
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Hi, I wanted to thank you for the excellent support with the MLS integration. It\'s working perfectly now.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'support',
      content: 'You\'re very welcome! I\'m glad we could get the MLS integration working smoothly for you.',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'The new MLS integration feature is working perfectly. Thank you for the quick implementation!',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'client': return <PersonIcon sx={{ color: brandColors.primary }} />;
      case 'technical-support': return <BuildIcon sx={{ color: brandColors.actions.success }} />;
      case 'training': return <SchoolIcon sx={{ color: brandColors.actions.warning }} />;
      case 'compliance': return <SecurityIcon sx={{ color: brandColors.actions.info }} />;
      case 'integration': return <IntegrationIcon sx={{ color: brandColors.actions.error }} />;
      case 'feature-request': return <LightbulbIcon sx={{ color: brandColors.actions.primary }} />;
      case 'emergency': return <WarningIcon sx={{ color: brandColors.actions.error }} />;
      case 'support': return <SupportIcon sx={{ color: brandColors.actions.success }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return 'Client';
      case 'technical-support': return 'Technical Support';
      case 'training': return 'Training';
      case 'compliance': return 'Compliance';
      case 'integration': return 'Integration';
      case 'feature-request': return 'Feature Request';
      case 'emergency': return 'Emergency Support';
      case 'support': return 'Support';
      default: return 'Contact';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'error';
      case 'completed': return 'success';
      case 'normal': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const tabCategories = [
    { label: 'All Communications', filter: 'all' },
    { label: 'Client Communications', filter: 'client' },
    { label: 'Technical Support', filter: 'technical-support' },
    { label: 'Training Communications', filter: 'training' },
    { label: 'Compliance Communications', filter: 'compliance' },
    { label: 'Integration Support', filter: 'integration' },
    { label: 'Feature Requests', filter: 'feature-request' },
    { label: 'Emergency Support', filter: 'emergency' },
  ];

  const filteredConversations = activeTab === 0 
    ? conversations 
    : conversations.filter(conv => conv.contactType === tabCategories[activeTab].filter);

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <Box>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 3, 
            backgroundColor: brandColors.primary,
            borderRadius: '16px 16px 0 0',
            color: brandColors.text.inverse
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SupportIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
          <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
            Professional Support Communications
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Manage communications with clients, technical support, training, and compliance teams
        </Typography>
      </Paper>

      {/* Category Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 48,
            },
          }}
        >
          {tabCategories.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ 
        height: 'calc(100vh - 240px)',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          display: 'flex', 
          height: '100%', 
          border: `1px solid ${brandColors.borders.secondary}`, 
          borderRadius: 1, 
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Conversation List */}
          <Box sx={{ 
            width: 320, 
            minWidth: 320, 
            maxWidth: 320,
            borderRight: `1px solid ${brandColors.borders.secondary}`, 
            display: 'flex',
            flexShrink: 0,
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Search and Filter */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton size="small">
                  <FilterIcon />
                </IconButton>
                <IconButton size="small" color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Conversations List */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {filteredConversations.map((conversation, index) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem
                      onClick={() => setSelectedConversation(conversation.id)}
                      sx={{ '&:hover': {
                          backgroundColor: brandColors.backgrounds.hover,
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={conversation.unread}
                          color="primary"
                          invisible={conversation.unread === 0}
                        >
                          <Avatar sx={{ bgcolor: brandColors.primary }}>
                            {getContactTypeIcon(conversation.contactType)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {conversation.contactName}
                            </Typography>
                            <Chip
                              label={conversation.status}
                              size="small"
                              color={getStatusColor(conversation.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {getContactTypeLabel(conversation.contactType)} • {conversation.organization}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px'
                            }}>
                              {conversation.lastMessage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {conversation.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredConversations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Box>
          
          {/* Chat Interface */}
          <Box sx={{ 
            flex: 1, 
            minWidth: 0,
            borderRight: !showDetailsPanel ? 'none' : `1px solid ${brandColors.borders.secondary}`, 
            display: selectedConversation ? 'flex' : 'none',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  backgroundColor: brandColors.backgrounds.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: brandColors.primary }}>
                      {getContactTypeIcon(selectedConv.contactType)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedConv.contactName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getContactTypeLabel(selectedConv.contactType)} • {selectedConv.organization}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => setShowDetailsPanel(!showDetailsPanel)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message, index) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'support' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'support' 
                            ? brandColors.primary 
                            : brandColors.backgrounds.secondary,
                          color: message.sender === 'support' ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            opacity: 0.7,
                            display: 'block',
                            mt: 1,
                            textAlign: 'right'
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      size="small"
                    />
                    <IconButton 
                      color="primary" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'text.secondary'
              }}>
                <Typography variant="h6">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Details Panel */}
          <Box sx={{ 
            width: showDetailsPanel ? 320 : 0, 
            minWidth: showDetailsPanel ? 320 : 0,
            maxWidth: showDetailsPanel ? 320 : 0,
            display: showDetailsPanel ? 'flex' : 'none',
            flexShrink: 0,
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            transition: 'width 0.3s ease'
          }}>
            {selectedConv && (
              <Card sx={{ height: '100%', borderRadius: 0, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Details Header */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    backgroundColor: brandColors.backgrounds.secondary
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Contact Details
                      </Typography>
                      <IconButton size="small" onClick={() => setShowDetailsPanel(false)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: brandColors.primary, width: 56, height: 56 }}>
                        {getContactTypeIcon(selectedConv.contactType)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedConv.contactName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConv.role}
                        </Typography>
                        <Chip 
                          label={selectedConv.verificationStatus} 
                          size="small" 
                          color="success"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Details Content */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                        Contact Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Email</Typography>
                          <Typography variant="body2">{selectedConv.email}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Phone</Typography>
                          <Typography variant="body2">{selectedConv.phone}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Organization</Typography>
                          <Typography variant="body2">{selectedConv.organization}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Support Level</Typography>
                          <Typography variant="body2">{selectedConv.supportLevel}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                        Support Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Support Ticket ID</Typography>
                          <Typography variant="body2">{selectedConv.supportTicketId}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Priority</Typography>
                          <Chip 
                            label={selectedConv.priority} 
                            size="small" 
                            color={getPriorityColor(selectedConv.priority || 'Low') as any}
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Resolution Status</Typography>
                          <Typography variant="body2">{selectedConv.resolutionStatus}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Contact Type</Typography>
                          <Typography variant="body2">{getContactTypeLabel(selectedConv.contactType)}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                        Communication Details
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Date of Contact</Typography>
                          <Typography variant="body2">{selectedConv.dateOfContact}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Topic of Discussion</Typography>
                          <Typography variant="body2">{selectedConv.topicOfDiscussion}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Chip 
                            label={selectedConv.status} 
                            size="small" 
                            color={getStatusColor(selectedConv.status) as any}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                        Additional Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Join Date</Typography>
                          <Typography variant="body2">{selectedConv.joinDate}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Verification Status</Typography>
                          <Typography variant="body2">{selectedConv.verificationStatus}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessionalSupportMessages;
