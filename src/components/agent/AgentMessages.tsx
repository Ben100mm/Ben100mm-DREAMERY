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
  Person as PersonIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Gavel as GavelIcon,
  Support as SupportIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'client' | 'transaction' | 'listing' | 'offer' | 'lender' | 'title' | 'escrow' | 'support' | 'general';
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
  transactionStage?: string;
  dealValue?: string;
}

interface Message {
  id: number;
  sender: 'agent' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const AgentMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Mock conversations data for real estate agents
  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Sarah Johnson',
      contactType: 'client',
      organization: 'First-Time Homebuyer',
      property: '123 Oak Street, Austin TX',
      lastMessage: 'Thank you for helping us find our dream home! The inspection went great.',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      role: 'Buyer Client',
      joinDate: '2024-01-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-20',
      topicOfDiscussion: 'Property Purchase & Closing Process',
      transactionStage: 'Under Contract - Inspection Period',
      dealValue: '$485,000',
    },
    {
      id: 2,
      contactName: 'Mike Chen',
      contactType: 'lender',
      organization: 'First National Mortgage',
      property: 'Multiple Properties',
      lastMessage: 'Pre-approval letter updated. DTI ratio looks good at 28%.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
      email: 'mike.chen@firstnational.com',
      phone: '(555) 234-5678',
      role: 'Senior Loan Officer',
      joinDate: '2023-03-20',
      verificationStatus: 'Licensed',
      dateOfContact: '2024-01-18',
      topicOfDiscussion: 'Loan Processing & Pre-approval',
      transactionStage: 'Loan Processing',
      dealValue: '$485,000',
    },
    {
      id: 3,
      contactName: 'Lisa Rodriguez',
      contactType: 'title',
      organization: 'Premier Title Company',
      property: '123 Oak Street, Austin TX',
      lastMessage: 'Title search complete. No issues found. Ready for closing.',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
      email: 'lisa.rodriguez@premiertitle.com',
      phone: '(555) 345-6789',
      role: 'Title Officer',
      joinDate: '2022-08-10',
      verificationStatus: 'Licensed',
      dateOfContact: '2024-01-16',
      topicOfDiscussion: 'Title Search & Closing Coordination',
      transactionStage: 'Title Clear to Close',
      dealValue: '$485,000',
    },
    {
      id: 4,
      contactName: 'David Thompson',
      contactType: 'transaction',
      organization: 'Thompson Realty Group',
      property: '456 Pine Avenue, Unit 1A',
      lastMessage: 'Counter-offer received. Buyer is considering the terms.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
      email: 'david.thompson@thompsonrealty.com',
      phone: '(555) 456-7890',
      role: 'Listing Agent',
      joinDate: '2023-02-15',
      verificationStatus: 'Licensed',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Transaction Negotiations',
      transactionStage: 'Negotiating Terms',
      dealValue: '$520,000',
    },
    {
      id: 5,
      contactName: 'Jennifer Kim',
      contactType: 'escrow',
      organization: 'Secure Escrow Services',
      property: '789 Elm Street, Austin TX',
      lastMessage: 'Escrow instructions updated. Wire transfer details confirmed.',
      timestamp: '4 days ago',
      unread: 1,
      status: 'normal',
      email: 'jennifer.kim@secureescrow.com',
      phone: '(555) 567-8901',
      role: 'Escrow Officer',
      joinDate: '2021-12-05',
      verificationStatus: 'Licensed',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Escrow & Closing Coordination',
      transactionStage: 'In Escrow',
      dealValue: '$485,000',
    },
    {
      id: 6,
      contactName: 'Robert Wilson',
      contactType: 'support',
      organization: 'Dreamery Support Team',
      property: 'N/A',
      lastMessage: 'Your request for MLS integration has been processed.',
      timestamp: '5 days ago',
      unread: 0,
      status: 'completed',
      email: 'robert.wilson@dreamery.com',
      phone: '(555) 678-9012',
      role: 'Technical Support Specialist',
      joinDate: '2023-01-22',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-10',
      topicOfDiscussion: 'Platform Support & Integration',
      transactionStage: 'N/A',
      dealValue: 'N/A',
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Hi! Thank you for helping us find our dream home. We\'re so excited about the property on Oak Street.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'agent',
      content: 'You\'re very welcome! I\'m thrilled we found the perfect home for you. The inspection is scheduled for tomorrow at 2 PM.',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'Thank you for helping us find our dream home! The inspection went great.',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'client': return <PersonIcon sx={{ color: brandColors.primary }} />;
      case 'transaction': return <BusinessIcon sx={{ color: brandColors.actions.success }} />;
      case 'listing': return <HomeIcon sx={{ color: brandColors.actions.warning }} />;
      case 'offer': return <AssignmentIcon sx={{ color: brandColors.actions.info }} />;
      case 'lender': return <AccountBalanceIcon sx={{ color: brandColors.actions.error }} />;
      case 'title': return <GavelIcon sx={{ color: brandColors.actions.primary }} />;
      case 'escrow': return <DescriptionIcon sx={{ color: brandColors.actions.success }} />;
      case 'support': return <SupportIcon sx={{ color: brandColors.actions.info }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return 'Client';
      case 'transaction': return 'Transaction';
      case 'listing': return 'Listing';
      case 'offer': return 'Offer';
      case 'lender': return 'Lender';
      case 'title': return 'Title Company';
      case 'escrow': return 'Escrow';
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
    { label: 'Transaction Communications', filter: 'transaction' },
    { label: 'Listing Communications', filter: 'listing' },
    { label: 'Offer Communications', filter: 'offer' },
    { label: 'Lender Communications', filter: 'lender' },
    { label: 'Title/Escrow Communications', filter: 'title' },
    { label: 'Support Communications', filter: 'support' },
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
          <PersonIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />
          <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
            Agent Communications
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Manage communications with clients, lenders, title companies, and transaction partners
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
                      sx={{
                        backgroundColor: selectedConversation === conversation.id ? brandColors.backgrounds.selected : 'transparent',
                        cursor: 'pointer',
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
                        justifyContent: message.sender === 'agent' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'agent' 
                            ? brandColors.primary 
                            : brandColors.backgrounds.secondary,
                          color: message.sender === 'agent' ? 'white' : 'text.primary',
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
                        Transaction Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Property</Typography>
                          <Typography variant="body2">{selectedConv.property}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Transaction Stage</Typography>
                          <Typography variant="body2">{selectedConv.transactionStage}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Deal Value</Typography>
                          <Typography variant="body2">{selectedConv.dealValue}</Typography>
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
                        Professional Information
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

export default AgentMessages;
