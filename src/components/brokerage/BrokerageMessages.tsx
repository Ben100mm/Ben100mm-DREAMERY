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
  Security as SecurityIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'agent' | 'client' | 'lender' | 'title-company' | 'compliance' | 'support' | 'general';
  organization: string;
  property?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'urgent' | 'normal' | 'completed';
  priority: 'high' | 'medium' | 'low';
  transactionType?: string;
  commissionRate?: string;
  role?: string;
  email?: string;
  phone?: string;
  dateOfContact?: string;
  topicOfDiscussion?: string;
  joinDate?: string;
  verificationStatus?: string;
}

interface Message {
  id: number;
  sender: 'brokerage' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

const BrokerageMessages: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState(0);

  const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Sarah Mitchell',
      contactType: 'agent',
      organization: 'Premier Realty Group',
      property: '123 Main Street, Unit 2A',
      lastMessage: 'The listing agreement has been signed. Ready to go live on the market.',
      timestamp: '10:30 AM',
      unread: 2,
      status: 'urgent',
      priority: 'high',
      transactionType: 'Listing',
      commissionRate: '6%',
      role: 'Listing Agent',
      email: 'sarah.mitchell@premierrealty.com',
      phone: '(555) 123-4567',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Listing Agreement',
      joinDate: '2024-01-10',
      verificationStatus: 'Verified',
    },
    {
      id: 2,
      contactName: 'Michael Chen',
      contactType: 'client',
      organization: 'Individual Client',
      property: '456 Oak Avenue',
      lastMessage: 'I\'m interested in viewing the property this weekend. What time works best?',
      timestamp: '9:15 AM',
      unread: 0,
      status: 'normal',
      priority: 'medium',
      transactionType: 'Buyer Representation',
      commissionRate: '3%',
      role: 'Buyer Client',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'Property Viewing',
      joinDate: '2024-01-08',
      verificationStatus: 'Verified',
    },
    {
      id: 3,
      contactName: 'Emily Rodriguez',
      contactType: 'lender',
      organization: 'Rodriguez Mortgage Services',
      property: '789 Pine Street',
      lastMessage: 'The pre-approval letter is ready. The client is qualified for the purchase.',
      timestamp: 'Yesterday',
      unread: 1,
      status: 'completed',
      priority: 'low',
      transactionType: 'Financing',
      commissionRate: 'N/A',
      role: 'Mortgage Broker',
      email: 'emily.rodriguez@rodriguezmortgage.com',
      phone: '(555) 345-6789',
      dateOfContact: '2024-01-08',
      topicOfDiscussion: 'Pre-approval Letter',
      joinDate: '2024-01-05',
      verificationStatus: 'Pending',
    },
    {
      id: 4,
      contactName: 'David Thompson',
      contactType: 'title-company',
      organization: 'Thompson Title Services',
      property: '321 Elm Street',
      lastMessage: 'The title search is complete. No issues found. Ready for closing.',
      timestamp: '2 days ago',
      unread: 0,
      status: 'normal',
      priority: 'high',
      transactionType: 'Title Services',
      commissionRate: 'N/A',
      role: 'Title Officer',
      email: 'david.thompson@thompsontitle.com',
      phone: '(555) 456-7890',
      dateOfContact: '2024-01-05',
      topicOfDiscussion: 'Title Search',
      joinDate: '2024-01-03',
      verificationStatus: 'Verified',
    },
    {
      id: 5,
      contactName: 'Lisa Wang',
      contactType: 'compliance',
      organization: 'Wang Compliance Services',
      property: 'All Properties',
      lastMessage: 'The compliance review is complete. All transactions are in order.',
      timestamp: '3 days ago',
      unread: 3,
      status: 'urgent',
      priority: 'medium',
      transactionType: 'Compliance',
      commissionRate: 'N/A',
      role: 'Compliance Officer',
      email: 'lisa.wang@wangcompliance.com',
      phone: '(555) 567-8901',
      dateOfContact: '2024-01-03',
      topicOfDiscussion: 'Compliance Review',
      joinDate: '2024-01-01',
      verificationStatus: 'Verified',
    },
    {
      id: 6,
      contactName: 'Robert Johnson',
      contactType: 'support',
      organization: 'Johnson Support Services',
      property: 'All Properties',
      lastMessage: 'The technical support ticket has been resolved. All systems are working properly.',
      timestamp: '1 week ago',
      unread: 0,
      status: 'completed',
      priority: 'low',
      transactionType: 'Support',
      commissionRate: 'N/A',
      role: 'Support Specialist',
      email: 'robert.johnson@johnsonsupport.com',
      phone: '(555) 678-9012',
      dateOfContact: '2023-12-28',
      topicOfDiscussion: 'Technical Support',
      joinDate: '2023-12-25',
      verificationStatus: 'Verified',
    },
  ];

  const sampleMessages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'The listing agreement has been signed. Ready to go live on the market.',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'brokerage',
      content: 'Excellent! I\'ll get the marketing materials ready and schedule the photo shoot.',
      timestamp: '10:45 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'Perfect! The property should be ready for photos by tomorrow afternoon.',
      timestamp: '2:15 PM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'agent': return <PersonIcon sx={{ color: brandColors.primary }} />;
      case 'client': return <BusinessIcon sx={{ color: brandColors.actions.success }} />;
      case 'lender': return <AccountBalanceIcon sx={{ color: brandColors.actions.warning }} />;
      case 'title-company': return <AssessmentIcon sx={{ color: brandColors.actions.info }} />;
      case 'compliance': return <SecurityIcon sx={{ color: brandColors.actions.error }} />;
      case 'support': return <SupportIcon sx={{ color: brandColors.actions.primary }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'agent': return 'Real Estate Agent';
      case 'client': return 'Client';
      case 'lender': return 'Lender';
      case 'title-company': return 'Title Company';
      case 'compliance': return 'Compliance Officer';
      case 'support': return 'Support Specialist';
      default: return 'General Contact';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return brandColors.actions.error;
      case 'normal': return brandColors.actions.info;
      case 'completed': return brandColors.actions.success;
      default: return brandColors.text.secondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return brandColors.actions.error;
      case 'medium': return brandColors.actions.warning;
      case 'low': return brandColors.actions.success;
      default: return brandColors.text.secondary;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'brokerage',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConv(conversation);
    setMessages(sampleMessages);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${brandColors.borders.secondary}`,
        backgroundColor: brandColors.backgrounds.primary
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ color: brandColors.primary, fontWeight: 600 }}>
            Brokerage Messages
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                '&:hover': {
                  borderColor: brandColors.primaryDark,
                  backgroundColor: brandColors.backgrounds.hover,
                },
              }}
            >
              New Contact
            </Button>
            <IconButton sx={{ color: brandColors.primary }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ color: brandColors.text.secondary, mb: 3 }}>
          Manage communications with agents, clients, lenders, and business partners
        </Typography>

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: brandColors.primary,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: brandColors.primary,
                },
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{
              borderColor: brandColors.borders.secondary,
              color: brandColors.text.primary,
              '&:hover': {
                borderColor: brandColors.primary,
                backgroundColor: brandColors.backgrounds.hover,
              },
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Conversations List */}
        <Box sx={{ 
          width: 400, 
          borderRight: `1px solid ${brandColors.borders.secondary}`,
          backgroundColor: brandColors.backgrounds.secondary,
          overflow: 'auto'
        }}>
          <List sx={{ p: 0 }}>
            {filteredConversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                sx={{
                  cursor: 'pointer',
                  borderBottom: `1px solid ${brandColors.borders.secondary}`,
                  backgroundColor: selectedConv?.id === conversation.id ? brandColors.backgrounds.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: brandColors.backgrounds.hover,
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    invisible={conversation.unread === 0}
                    badgeContent={conversation.unread}
                    color="error"
                  >
                    <Avatar sx={{ bgcolor: brandColors.primary }}>
                      {getContactTypeIcon(conversation.contactType)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: brandColors.text.primary }}>
                        {conversation.contactName}
                      </Typography>
                      <Chip
                        label={conversation.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(conversation.status),
                          color: brandColors.text.inverse,
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {getContactTypeLabel(conversation.contactType)} • {conversation.organization}
                      </Typography>
                      <Typography variant="body2" sx={{ color: brandColors.text.secondary, mt: 0.5 }}>
                        {conversation.lastMessage}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {conversation.timestamp}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${brandColors.borders.secondary}`,
                backgroundColor: brandColors.backgrounds.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar sx={{ bgcolor: brandColors.primary }}>
                  {getContactTypeIcon(selectedConv.contactType)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                    {selectedConv.contactName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getContactTypeLabel(selectedConv.contactType)} • {selectedConv.organization}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={selectedConv.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedConv.status),
                      color: brandColors.text.inverse,
                    }}
                  />
                  <Chip
                    label={selectedConv.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(selectedConv.priority),
                      color: brandColors.text.inverse,
                    }}
                  />
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                overflow: 'auto',
                backgroundColor: brandColors.backgrounds.primary,
                height: '100%',
                color: 'text.secondary'
              }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'brokerage' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: message.sender === 'brokerage' 
                          ? brandColors.primary 
                          : brandColors.backgrounds.secondary,
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: message.sender === 'brokerage' ? brandColors.text.inverse : brandColors.text.primary 
                        }}
                      >
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: message.sender === 'brokerage' ? brandColors.text.inverse : brandColors.text.primary,
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
              <Box sx={{ 
                p: 2, 
                borderTop: `1px solid ${brandColors.borders.secondary}`,
                backgroundColor: brandColors.backgrounds.primary,
                display: 'flex',
                gap: 1
              }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: brandColors.primary,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: brandColors.primary,
                      },
                    },
                  }}
                />
                <IconButton sx={{ color: brandColors.primary }}>
                  <AttachIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    backgroundColor: brandColors.primary,
                    '&:hover': {
                      backgroundColor: brandColors.primaryDark,
                    },
                    '&:disabled': {
                      backgroundColor: brandColors.text.disabled,
                    },
                  }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: brandColors.backgrounds.primary,
              color: 'text.secondary'
            }}>
              <Typography variant="h6" sx={{ color: brandColors.text.secondary }}>
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>

        {/* Contact Details Sidebar */}
        {selectedConv && (
          <Box sx={{ 
            width: 300, 
            borderLeft: `1px solid ${brandColors.borders.secondary}`,
            backgroundColor: brandColors.backgrounds.secondary,
            overflow: 'auto',
            p: 2
          }}>
            <Typography variant="h6" sx={{ color: brandColors.text.primary, mb: 2 }}>
              Contact Details
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.primary, width: 56, height: 56 }}>
                  {getContactTypeIcon(selectedConv.contactType)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                    {selectedConv.contactName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedConv.role}
                  </Typography>
                </Box>
              </Box>
            </Box>

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
                  <Typography variant="caption" color="text.secondary">Transaction Type</Typography>
                  <Typography variant="body2">{selectedConv.transactionType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Commission Rate</Typography>
                  <Typography variant="body2">{selectedConv.commissionRate}</Typography>
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
                    sx={{
                      backgroundColor: getStatusColor(selectedConv.status),
                      color: brandColors.text.inverse,
                    }}
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
        )}
      </Box>
    </Box>
  );
};

export default BrokerageMessages;