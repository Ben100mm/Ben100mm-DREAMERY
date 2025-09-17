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
  Business as BusinessIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  IntegrationInstructions as IntegrationIcon,
  Support as SupportIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'employee' | 'business-management' | 'client' | 'vendor' | 'support' | 'analytics' | 'integration' | 'general';
  organization: string;
  department?: string;
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
  employeeLevel?: string;
  departmentAccess?: string;
  permissions?: string;
}

interface Message {
  id: number;
  sender: 'business' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const BusinessMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Mock conversations data for business management
  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Sarah Thompson',
      contactType: 'employee',
      organization: 'TechStart Solutions',
      department: 'Real Estate Operations',
      lastMessage: 'Monthly business operations report is ready for review.',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
      email: 'sarah.thompson@techstartsolutions.com',
      phone: '(555) 123-4567',
      role: 'Operations Manager',
      joinDate: '2023-01-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-20',
      topicOfDiscussion: 'Monthly Operations Review',
      employeeLevel: 'Senior Management',
      departmentAccess: 'Full Access',
      permissions: 'Admin, Operations, Reporting',
    },
    {
      id: 2,
      contactName: 'Michael Rodriguez',
      contactType: 'business-management',
      organization: 'Enterprise Real Estate Group',
      department: 'Business Development',
      lastMessage: 'New business partnership proposal received. Review needed.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
      email: 'michael.rodriguez@enterprisegroup.com',
      phone: '(555) 234-5678',
      role: 'Business Development Director',
      joinDate: '2023-03-20',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-18',
      topicOfDiscussion: 'Business Partnership Opportunities',
      employeeLevel: 'Executive',
      departmentAccess: 'Business Development',
      permissions: 'Business Development, Partnerships',
    },
    {
      id: 3,
      contactName: 'Jennifer Chen',
      contactType: 'client',
      organization: 'Chen Investment Group',
      department: 'Client Services',
      lastMessage: 'Portfolio expansion request submitted. Need approval.',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
      email: 'jennifer.chen@cheninvestment.com',
      phone: '(555) 345-6789',
      role: 'Investment Manager',
      joinDate: '2022-08-10',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-16',
      topicOfDiscussion: 'Portfolio Management & Expansion',
      employeeLevel: 'N/A',
      departmentAccess: 'Client Services',
      permissions: 'Client Access',
    },
    {
      id: 4,
      contactName: 'David Wilson',
      contactType: 'vendor',
      organization: 'Wilson Technology Services',
      department: 'IT Services',
      lastMessage: 'System maintenance completed. Performance improved by 25%.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
      email: 'david.wilson@wilsonservices.com',
      phone: '(555) 456-7890',
      role: 'Technical Director',
      joinDate: '2023-02-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Technology Services & Maintenance',
      employeeLevel: 'N/A',
      departmentAccess: 'IT Services',
      permissions: 'Technical Support',
    },
    {
      id: 5,
      contactName: 'Lisa Anderson',
      contactType: 'analytics',
      organization: 'Data Analytics Partners',
      department: 'Business Intelligence',
      lastMessage: 'Q1 business analytics report ready. Key insights available.',
      timestamp: '4 days ago',
      unread: 1,
      status: 'normal',
      email: 'lisa.anderson@dataanalytics.com',
      phone: '(555) 567-8901',
      role: 'Senior Data Analyst',
      joinDate: '2021-12-05',
      verificationStatus: 'Certified',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Business Analytics & Reporting',
      employeeLevel: 'N/A',
      departmentAccess: 'Analytics',
      permissions: 'Data Access, Reporting',
    },
    {
      id: 6,
      contactName: 'Robert Kim',
      contactType: 'integration',
      organization: 'Integration Solutions Inc.',
      department: 'Technical Integration',
      lastMessage: 'API integration testing completed. Ready for production.',
      timestamp: '5 days ago',
      unread: 0,
      status: 'completed',
      email: 'robert.kim@integrationsolutions.com',
      phone: '(555) 678-9012',
      role: 'Integration Specialist',
      joinDate: '2023-01-22',
      verificationStatus: 'Certified',
      dateOfContact: '2024-01-10',
      topicOfDiscussion: 'Third-Party Integrations',
      employeeLevel: 'N/A',
      departmentAccess: 'Technical',
      permissions: 'Integration Management',
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Hi, I wanted to update you on our monthly business operations. Everything is running smoothly.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'business',
      content: 'Thank you for the update, Sarah. I\'m glad to hear operations are running well.',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'Monthly business operations report is ready for review.',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'employee': return <PersonIcon sx={{ color: brandColors.primary }} />;
      case 'business-management': return <BusinessIcon sx={{ color: brandColors.actions.success }} />;
      case 'client': return <GroupIcon sx={{ color: brandColors.actions.warning }} />;
      case 'vendor': return <DescriptionIcon sx={{ color: brandColors.actions.info }} />;
      case 'support': return <SupportIcon sx={{ color: brandColors.actions.error }} />;
      case 'analytics': return <AssessmentIcon sx={{ color: brandColors.actions.primary }} />;
      case 'integration': return <IntegrationIcon sx={{ color: brandColors.actions.success }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'employee': return 'Employee';
      case 'business-management': return 'Business Management';
      case 'client': return 'Client';
      case 'vendor': return 'Vendor';
      case 'support': return 'Support';
      case 'analytics': return 'Analytics';
      case 'integration': return 'Integration';
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
    { label: 'Employee Communications', filter: 'employee' },
    { label: 'Business Management', filter: 'business-management' },
    { label: 'Client Communications', filter: 'client' },
    { label: 'Vendor Communications', filter: 'vendor' },
    { label: 'Support Communications', filter: 'support' },
    { label: 'Analytics Communications', filter: 'analytics' },
    { label: 'Integration Communications', filter: 'integration' },
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
          <BusinessIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
          <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
            Business Communications
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Manage communications with employees, clients, vendors, and business partners
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
                        justifyContent: message.sender === 'business' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'business' 
                            ? brandColors.primary 
                            : brandColors.backgrounds.secondary,
                          color: message.sender === 'business' ? 'white' : 'text.primary',
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
                          <Typography variant="caption" color="text.secondary">Department</Typography>
                          <Typography variant="body2">{selectedConv.department}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                        Business Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Employee Level</Typography>
                          <Typography variant="body2">{selectedConv.employeeLevel}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Department Access</Typography>
                          <Typography variant="body2">{selectedConv.departmentAccess}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Permissions</Typography>
                          <Typography variant="body2">{selectedConv.permissions}</Typography>
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

export default BusinessMessages;
