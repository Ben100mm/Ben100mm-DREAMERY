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
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  PieChart as PieChartIcon,
  Assessment as AssessmentIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'opportunity' | 'joint-venture' | 'fractional' | 'private-market' | 'advisor' | 'portfolio-manager' | 'general';
  organization: string;
  investment?: string;
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
  investmentAmount?: string;
  commitmentLevel?: string;
  investmentType?: string;
}

interface Message {
  id: number;
  sender: 'investor' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const InvestMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Mock conversations data for investment opportunities
  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Alex Thompson',
      contactType: 'opportunity',
      organization: 'Thompson Investment Group',
      investment: 'Austin Luxury Condo Development',
      lastMessage: 'The crowdfunded deal looks promising. Can we discuss terms?',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
      email: 'alex.thompson@thompsoninvest.com',
      phone: '(555) 123-4567',
      role: 'Investment Manager',
      joinDate: '2023-01-15',
      verificationStatus: 'Accredited',
      dateOfContact: '2024-01-20',
      topicOfDiscussion: 'Crowdfunded Investment Opportunity',
      investmentAmount: '$250K - $1M',
      commitmentLevel: 'High Interest',
      investmentType: 'Crowdfunded Deal',
    },
    {
      id: 2,
      contactName: 'Maria Rodriguez',
      contactType: 'joint-venture',
      organization: 'Rodriguez Real Estate Partners',
      investment: 'Dallas Mixed-Use Development',
      lastMessage: 'Joint venture proposal received. Reviewing partnership terms.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
      email: 'maria.rodriguez@rodriguezpartners.com',
      phone: '(555) 234-5678',
      role: 'Managing Partner',
      joinDate: '2023-03-20',
      verificationStatus: 'Accredited',
      dateOfContact: '2024-01-18',
      topicOfDiscussion: 'Joint Venture Partnership',
      investmentAmount: '$2M - $10M',
      commitmentLevel: 'Medium Interest',
      investmentType: 'Joint Venture',
    },
    {
      id: 3,
      contactName: 'James Wilson',
      contactType: 'fractional',
      organization: 'Wilson Capital Management',
      investment: 'Fractional Ownership - Houston Office Building',
      lastMessage: 'Fractional ownership units available. Minimum $100K investment.',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
      email: 'james.wilson@wilsoncapital.com',
      phone: '(555) 345-6789',
      role: 'Capital Manager',
      joinDate: '2022-08-10',
      verificationStatus: 'Accredited',
      dateOfContact: '2024-01-16',
      topicOfDiscussion: 'Fractional Ownership Opportunity',
      investmentAmount: '$100K - $500K',
      commitmentLevel: 'High Interest',
      investmentType: 'Fractional Ownership',
    },
    {
      id: 4,
      contactName: 'Sarah Chen',
      contactType: 'private-market',
      organization: 'Chen Private Investments',
      investment: 'Private Market - San Antonio Retail Center',
      lastMessage: 'Private market listing updated. Due diligence materials ready.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
      email: 'sarah.chen@chenprivate.com',
      phone: '(555) 456-7890',
      role: 'Private Market Specialist',
      joinDate: '2023-02-15',
      verificationStatus: 'Accredited',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Private Market Investment',
      investmentAmount: '$5M - $25M',
      commitmentLevel: 'Medium Interest',
      investmentType: 'Private Market',
    },
    {
      id: 5,
      contactName: 'Michael Davis',
      contactType: 'advisor',
      organization: 'Davis Investment Advisors',
      investment: 'Portfolio Diversification Strategy',
      lastMessage: 'Portfolio analysis complete. Recommendations ready for review.',
      timestamp: '4 days ago',
      unread: 1,
      status: 'normal',
      email: 'michael.davis@davisadvisors.com',
      phone: '(555) 567-8901',
      role: 'Senior Investment Advisor',
      joinDate: '2021-12-05',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Investment Advisory Services',
      investmentAmount: 'N/A',
      commitmentLevel: 'Service Provider',
      investmentType: 'Advisory Services',
    },
    {
      id: 6,
      contactName: 'Lisa Anderson',
      contactType: 'portfolio-manager',
      organization: 'Anderson Portfolio Management',
      investment: 'Multi-Asset Portfolio Strategy',
      lastMessage: 'Portfolio performance report available. Q4 results strong.',
      timestamp: '5 days ago',
      unread: 0,
      status: 'completed',
      email: 'lisa.anderson@andersonportfolio.com',
      phone: '(555) 678-9012',
      role: 'Portfolio Manager',
      joinDate: '2023-01-22',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-10',
      topicOfDiscussion: 'Portfolio Management Services',
      investmentAmount: 'N/A',
      commitmentLevel: 'Service Provider',
      investmentType: 'Portfolio Management',
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Hi, I\'m interested in learning more about the Austin Luxury Condo Development crowdfunded deal.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'investor',
      content: 'Thank you for your interest! This is an exciting opportunity in the growing Austin market. What specific questions do you have?',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'The crowdfunded deal looks promising. Can we discuss terms?',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUpIcon sx={{ color: brandColors.primary }} />;
      case 'joint-venture': return <GroupIcon sx={{ color: brandColors.actions.success }} />;
      case 'fractional': return <PieChartIcon sx={{ color: brandColors.actions.warning }} />;
      case 'private-market': return <BusinessIcon sx={{ color: brandColors.actions.info }} />;
      case 'advisor': return <PersonIcon sx={{ color: brandColors.actions.error }} />;
      case 'portfolio-manager': return <AssessmentIcon sx={{ color: brandColors.actions.primary }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'opportunity': return 'Investment Opportunity';
      case 'joint-venture': return 'Joint Venture Partner';
      case 'fractional': return 'Fractional Ownership';
      case 'private-market': return 'Private Market';
      case 'advisor': return 'Investment Advisor';
      case 'portfolio-manager': return 'Portfolio Manager';
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
    { label: 'Investment Opportunities', filter: 'opportunity' },
    { label: 'Joint Venture Partners', filter: 'joint-venture' },
    { label: 'Fractional Ownership', filter: 'fractional' },
    { label: 'Private Market', filter: 'private-market' },
    { label: 'Investment Advisors', filter: 'advisor' },
    { label: 'Portfolio Managers', filter: 'portfolio-manager' },
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
          <TrendingUpIcon sx={{ fontSize: 28, color: 'white' }} />
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
            Investment Communications
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Manage communications with investment opportunities and portfolio partners
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
                        justifyContent: message.sender === 'investor' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'investor' 
                            ? brandColors.primary 
                            : brandColors.backgrounds.secondary,
                          color: message.sender === 'investor' ? 'white' : 'text.primary',
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
                        Investment Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Investment</Typography>
                          <Typography variant="body2">{selectedConv.investment}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Investment Type</Typography>
                          <Typography variant="body2">{selectedConv.investmentType}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Investment Range</Typography>
                          <Typography variant="body2">{selectedConv.investmentAmount}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Commitment Level</Typography>
                          <Typography variant="body2">{selectedConv.commitmentLevel}</Typography>
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

export default InvestMessages;
