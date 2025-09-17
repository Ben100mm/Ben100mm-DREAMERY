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
  Home as HomeIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'tenant' | 'maintenance' | 'manager' | 'vendor' | 'contractor' | 'lease-applicant' | 'payment' | 'insurance' | 'general';
  organization: string;
  property?: string;
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
}

interface Message {
  id: number;
  sender: 'manager' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const ManageMessagesEnhanced: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Mock conversations data for property management
  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'John Smith',
      contactType: 'tenant',
      organization: 'Resident',
      property: '123 Oak Street, Apt 2B',
      lastMessage: 'The AC is still not working properly. Can you send someone to check it?',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      role: 'Tenant',
      joinDate: '2023-01-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-20',
      topicOfDiscussion: 'AC Repair Request',
    },
    {
      id: 2,
      contactName: 'Sarah Johnson',
      contactType: 'tenant',
      organization: 'Resident',
      property: '456 Pine Avenue, Unit 1A',
      lastMessage: 'Thank you for fixing the leak so quickly!',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
      email: 'sarah.johnson@email.com',
      phone: '(555) 234-5678',
      role: 'Tenant',
      joinDate: '2023-03-20',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-18',
      topicOfDiscussion: 'Kitchen Leak Repair',
    },
    {
      id: 3,
      contactName: 'Mike Davis',
      contactType: 'maintenance',
      organization: 'Premier Maintenance Co.',
      property: 'Multiple Properties',
      lastMessage: 'Maintenance request completed. Please confirm.',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
      email: 'mike.davis@premiermaintenance.com',
      phone: '(555) 345-6789',
      role: 'Maintenance Supervisor',
      joinDate: '2022-08-10',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-16',
      topicOfDiscussion: 'Routine Maintenance Updates',
    },
    {
      id: 4,
      contactName: 'Lisa Wilson',
      contactType: 'lease-applicant',
      organization: 'Prospective Tenant',
      property: '789 Elm Street, Apt 3C',
      lastMessage: 'I would like to schedule a viewing for the apartment.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
      email: 'lisa.wilson@email.com',
      phone: '(555) 456-7890',
      role: 'Prospective Tenant',
      joinDate: '2024-01-10',
      verificationStatus: 'Pending',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Apartment Viewing Request',
    },
    {
      id: 5,
      contactName: 'Robert Kim',
      contactType: 'insurance',
      organization: 'Secure Property Insurance',
      property: 'All Properties',
      lastMessage: 'Insurance renewal documents are ready for review.',
      timestamp: '4 days ago',
      unread: 1,
      status: 'normal',
      email: 'robert.kim@secureinsurance.com',
      phone: '(555) 567-8901',
      role: 'Insurance Agent',
      joinDate: '2021-12-05',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Insurance Renewal & Coverage',
    },
    {
      id: 6,
      contactName: 'Jennifer Torres',
      contactType: 'vendor',
      organization: 'Elite Landscaping Services',
      property: 'Multiple Properties',
      lastMessage: 'Landscaping service completed for this week.',
      timestamp: '5 days ago',
      unread: 0,
      status: 'completed',
      email: 'jennifer.torres@elitelandscaping.com',
      phone: '(555) 678-9012',
      role: 'Landscaping Coordinator',
      joinDate: '2023-02-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-10',
      topicOfDiscussion: 'Weekly Landscaping Services',
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Hi, I wanted to report that the AC in my unit is not working properly.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'manager',
      content: 'I\'m sorry to hear that. I\'ll send a maintenance technician to check it out. When would be a good time?',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'The AC is still not working properly. Can you send someone to check it?',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'tenant': return <PersonIcon sx={{ color: brandColors.primary }} />;
      case 'maintenance': return <BuildIcon sx={{ color: brandColors.actions.success }} />;
      case 'manager': return <PersonIcon sx={{ color: brandColors.actions.warning }} />;
      case 'vendor': return <HomeIcon sx={{ color: brandColors.actions.info }} />;
      case 'contractor': return <BuildIcon sx={{ color: brandColors.actions.error }} />;
      case 'lease-applicant': return <AssignmentIcon sx={{ color: brandColors.actions.primary }} />;
      case 'payment': return <PaymentIcon sx={{ color: brandColors.actions.success }} />;
      case 'insurance': return <SecurityIcon sx={{ color: brandColors.actions.info }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'tenant': return 'Tenant';
      case 'maintenance': return 'Maintenance';
      case 'manager': return 'Property Manager';
      case 'vendor': return 'Vendor';
      case 'contractor': return 'Contractor';
      case 'lease-applicant': return 'Lease Applicant';
      case 'payment': return 'Payment Processing';
      case 'insurance': return 'Insurance Agent';
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
    { label: 'Tenant Communication', filter: 'tenant' },
    { label: 'Maintenance Requests', filter: 'maintenance' },
    { label: 'Property Manager', filter: 'manager' },
    { label: 'Vendor/Contractor', filter: 'vendor' },
    { label: 'Lease Applications', filter: 'lease-applicant' },
    { label: 'Payment Processing', filter: 'payment' },
    { label: 'Insurance', filter: 'insurance' },
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
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <HomeIcon sx={{ fontSize: 28, color: 'white' }} />
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
            Property Management Communications
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Manage communications with tenants, vendors, and service providers
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
                      button
                      onClick={() => setSelectedConversation(conversation.id)}
                      selected={selectedConversation === conversation.id}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: brandColors.backgrounds.selected,
                        },
                        '&:hover': {
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
                        justifyContent: message.sender === 'manager' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'manager' 
                            ? brandColors.primary 
                            : brandColors.backgrounds.secondary,
                          color: message.sender === 'manager' ? 'white' : 'text.primary',
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
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}>
                        Property Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Property Address</Typography>
                          <Typography variant="body2">{selectedConv.property}</Typography>
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

export default ManageMessagesEnhanced;
