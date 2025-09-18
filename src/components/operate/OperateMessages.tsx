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
  Build as BuildIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Engineering as EngineeringIcon,
  Assessment as AssessmentIcon,
  Support as SupportIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'project-team' | 'contractor' | 'vendor' | 'expense' | 'optimization' | 'operations-manager' | 'general';
  organization: string;
  project?: string;
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
  projectPhase?: string;
  budgetAllocation?: string;
  completionDate?: string;
}

interface Message {
  id: number;
  sender: 'operator' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const OperateMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Mock conversations data for property operations
  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Tom Rodriguez',
      contactType: 'project-team',
      organization: 'Austin Development Team',
      project: 'Luxury Apartment Renovation',
      lastMessage: 'Phase 2 construction is ahead of schedule. Need material approval.',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
      email: 'tom.rodriguez@austindev.com',
      phone: '(555) 123-4567',
      role: 'Project Manager',
      joinDate: '2023-01-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-20',
      topicOfDiscussion: 'Construction Progress Update',
      projectPhase: 'Phase 2 - Construction',
      budgetAllocation: '$2.5M',
      completionDate: '2024-06-30',
    },
    {
      id: 2,
      contactName: 'Sarah Kim',
      contactType: 'contractor',
      organization: 'Elite Construction Co.',
      project: 'Luxury Apartment Renovation',
      lastMessage: 'Electrical work completed. Inspection scheduled for tomorrow.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
      email: 'sarah.kim@eliteconstruction.com',
      phone: '(555) 234-5678',
      role: 'General Contractor',
      joinDate: '2023-03-20',
      verificationStatus: 'Licensed',
      dateOfContact: '2024-01-18',
      topicOfDiscussion: 'Electrical Installation & Inspection',
      projectPhase: 'Phase 2 - Construction',
      budgetAllocation: '$450K',
      completionDate: '2024-03-15',
    },
    {
      id: 3,
      contactName: 'Mike Johnson',
      contactType: 'vendor',
      organization: 'Premier Materials Supply',
      project: 'Luxury Apartment Renovation',
      lastMessage: 'Flooring materials delivered. Invoice attached for approval.',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
      email: 'mike.johnson@premiermaterials.com',
      phone: '(555) 345-6789',
      role: 'Sales Manager',
      joinDate: '2022-08-10',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-16',
      topicOfDiscussion: 'Material Delivery & Billing',
      projectPhase: 'Phase 2 - Construction',
      budgetAllocation: '$125K',
      completionDate: '2024-02-28',
    },
    {
      id: 4,
      contactName: 'Lisa Chen',
      contactType: 'expense',
      organization: 'Financial Operations Team',
      project: 'Luxury Apartment Renovation',
      lastMessage: 'Monthly expense report ready. Budget variance analysis included.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
      email: 'lisa.chen@financialops.com',
      phone: '(555) 456-7890',
      role: 'Financial Analyst',
      joinDate: '2023-02-15',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Monthly Financial Reporting',
      projectPhase: 'All Phases',
      budgetAllocation: '$3.2M Total',
      completionDate: '2024-06-30',
    },
    {
      id: 5,
      contactName: 'Robert Davis',
      contactType: 'optimization',
      organization: 'Portfolio Optimization Services',
      project: 'Multi-Property Portfolio',
      lastMessage: 'Portfolio analysis complete. Optimization recommendations ready.',
      timestamp: '4 days ago',
      unread: 1,
      status: 'normal',
      email: 'robert.davis@portfolioopt.com',
      phone: '(555) 567-8901',
      role: 'Portfolio Analyst',
      joinDate: '2021-12-05',
      verificationStatus: 'Certified',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Portfolio Optimization Strategy',
      projectPhase: 'Strategic Planning',
      budgetAllocation: 'N/A',
      completionDate: '2024-12-31',
    },
    {
      id: 6,
      contactName: 'Jennifer Wilson',
      contactType: 'operations-manager',
      organization: 'Property Operations Group',
      project: 'All Active Projects',
      lastMessage: 'Weekly operations summary complete. All projects on track.',
      timestamp: '5 days ago',
      unread: 0,
      status: 'completed',
      email: 'jennifer.wilson@propertyops.com',
      phone: '(555) 678-9012',
      role: 'Operations Manager',
      joinDate: '2023-01-22',
      verificationStatus: 'Verified',
      dateOfContact: '2024-01-10',
      topicOfDiscussion: 'Weekly Operations Review',
      projectPhase: 'All Phases',
      budgetAllocation: 'Multi-Project',
      completionDate: 'Ongoing',
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Hi, I wanted to update you on the Phase 2 construction progress.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'operator',
      content: 'Thank you for the update. How is everything progressing?',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'Phase 2 construction is ahead of schedule. Need material approval.',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'project-team': return <PersonIcon sx={{ color: brandColors.primary }} />;
      case 'contractor': return <BuildIcon sx={{ color: brandColors.actions.success }} />;
      case 'vendor': return <BusinessIcon sx={{ color: brandColors.actions.warning }} />;
      case 'expense': return <AccountBalanceIcon sx={{ color: brandColors.actions.info }} />;
      case 'optimization': return <TrendingUpIcon sx={{ color: brandColors.actions.error }} />;
      case 'operations-manager': return <AssessmentIcon sx={{ color: brandColors.actions.primary }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'project-team': return 'Project Team';
      case 'contractor': return 'Contractor';
      case 'vendor': return 'Vendor';
      case 'expense': return 'Expense Management';
      case 'optimization': return 'Portfolio Optimization';
      case 'operations-manager': return 'Operations Manager';
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
    { label: 'Project Team', filter: 'project-team' },
    { label: 'Contractors', filter: 'contractor' },
    { label: 'Vendors', filter: 'vendor' },
    { label: 'Expense Management', filter: 'expense' },
    { label: 'Portfolio Optimization', filter: 'optimization' },
    { label: 'Operations Manager', filter: 'operations-manager' },
  ];

  const filteredConversations = activeTab === 0 
    ? conversations 
    : conversations.filter(conv => conv.contactType === tabCategories[activeTab].filter);

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <Box>
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
                        justifyContent: message.sender === 'operator' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'operator' 
                            ? brandColors.primary 
                            : brandColors.backgrounds.secondary,
                          color: message.sender === 'operator' ? 'white' : 'text.primary',
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
                        Project Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Project</Typography>
                          <Typography variant="body2">{selectedConv.project}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Project Phase</Typography>
                          <Typography variant="body2">{selectedConv.projectPhase}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Budget Allocation</Typography>
                          <Typography variant="body2">{selectedConv.budgetAllocation}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Expected Completion</Typography>
                          <Typography variant="body2">{selectedConv.completionDate}</Typography>
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

export default OperateMessages;
