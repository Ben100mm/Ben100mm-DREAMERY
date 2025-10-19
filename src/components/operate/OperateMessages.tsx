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
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  Engineering as EngineeringIcon,
  Assessment as AssessmentIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Conversation {
  id: number;
  contactName: string;
  contactType: 'contractor' | 'vendor' | 'maintenance' | 'renovation' | 'property-manager' | 'supplier' | 'general';
  organization: string;
  project?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'urgent' | 'normal' | 'completed';
  priority: 'high' | 'medium' | 'low';
  projectType?: string;
  serviceType?: string;
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
  sender: 'operator' | 'contact';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

// Define conversations data outside the component to avoid initialization issues
const conversations: Conversation[] = [
    {
      id: 1,
      contactName: 'Mike Rodriguez',
      contactType: 'contractor',
      organization: 'Rodriguez Construction',
      project: '3-Bed Fix & Flip - Oak Ave',
      lastMessage: 'Kitchen cabinets are installed. Starting on the bathroom tile tomorrow. Should be ready for final inspection by end of month.',
      timestamp: '10:30 AM',
      unread: 2,
      status: 'urgent',
      priority: 'high',
      projectType: 'Fix & Flip',
      serviceType: 'General Contracting',
      role: 'General Contractor',
      email: 'mike.rodriguez@rodriguezconstruction.com',
      phone: '(555) 123-4567',
      dateOfContact: '2024-01-15',
      topicOfDiscussion: 'Fix & Flip Renovation Timeline',
      joinDate: '2024-01-10',
      verificationStatus: 'Verified',
    },
    {
      id: 2,
      contactName: 'Sarah Johnson',
      contactType: 'contractor',
      organization: 'Elite Construction',
      project: '4-Unit BRRR - Maple St',
      lastMessage: 'All 4 units are tenant-ready. Should we schedule the appraisal for the refinance next week?',
      timestamp: '9:15 AM',
      unread: 0,
      status: 'normal',
      priority: 'high',
      projectType: 'BRRR',
      serviceType: 'Multi-Family Renovation',
      role: 'Project Manager',
      email: 'sarah.johnson@eliteconstruction.com',
      phone: '(555) 234-5678',
      dateOfContact: '2024-01-12',
      topicOfDiscussion: 'BRRR Refinance Preparation',
      joinDate: '2024-01-08',
      verificationStatus: 'Verified',
    },
    {
      id: 3,
      contactName: 'David Chen',
      contactType: 'contractor',
      organization: 'Premier Builders',
      project: 'New Construction - Pine Ridge',
      lastMessage: 'Foundation inspection passed! Starting framing next Monday. Updated timeline attached.',
      timestamp: 'Yesterday',
      unread: 1,
      status: 'normal',
      priority: 'medium',
      projectType: 'New Construction',
      serviceType: 'Ground-Up Construction',
      role: 'Construction Manager',
      email: 'david.chen@premierbuilders.com',
      phone: '(555) 345-6789',
      dateOfContact: '2024-01-08',
      topicOfDiscussion: 'Construction Phase Updates',
      joinDate: '2024-01-05',
      verificationStatus: 'Verified',
    },
    {
      id: 4,
      contactName: 'Lisa Martinez',
      contactType: 'vendor',
      organization: 'AAA Appraisers',
      project: 'Duplex BRRR - Cedar Ln',
      lastMessage: 'Appraisal scheduled for March 25th. Please ensure all units are tenant-occupied before then.',
      timestamp: '2 days ago',
      unread: 0,
      status: 'normal',
      priority: 'high',
      projectType: 'BRRR',
      serviceType: 'Appraisal Services',
      role: 'Senior Appraiser',
      email: 'lisa.martinez@aaaappraisers.com',
      phone: '(555) 456-7890',
      dateOfContact: '2024-01-05',
      topicOfDiscussion: 'BRRR Appraisal Scheduling',
      joinDate: '2024-01-03',
      verificationStatus: 'Verified',
    },
    {
      id: 5,
      contactName: 'Robert Kim',
      contactType: 'vendor',
      organization: 'Regional Bank',
      project: '4-Unit BRRR - Maple St',
      lastMessage: 'Great news! Your refinance application is approved at 75% LTV. Closing scheduled for March 15th.',
      timestamp: '3 days ago',
      unread: 3,
      status: 'urgent',
      priority: 'high',
      projectType: 'BRRR',
      serviceType: 'Refinance Lending',
      role: 'Commercial Loan Officer',
      email: 'robert.kim@regionalbank.com',
      phone: '(555) 567-8901',
      dateOfContact: '2024-01-03',
      topicOfDiscussion: 'Refinance Approval & Closing',
      joinDate: '2024-01-01',
      verificationStatus: 'Verified',
    },
    {
      id: 6,
      contactName: 'Emily Thompson',
      contactType: 'contractor',
      organization: 'Modern Renovations LLC',
      project: 'Ranch Fix & Flip - Willow Dr',
      lastMessage: 'Demo is complete. Starting electrical and plumbing rough-ins this week.',
      timestamp: '1 week ago',
      unread: 0,
      status: 'normal',
      priority: 'medium',
      projectType: 'Fix & Flip',
      serviceType: 'Renovation Contracting',
      role: 'Lead Renovator',
      email: 'emily.thompson@modernrenovations.com',
      phone: '(555) 678-9012',
      dateOfContact: '2023-12-28',
      topicOfDiscussion: 'Flip Renovation Progress',
      joinDate: '2023-12-25',
      verificationStatus: 'Verified',
    },
  ];

const OperateMessages: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(conversations[conversations.length - 1] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState(0);

  const sampleMessages: Message[] = [
    {
      id: 1,
      sender: 'contact',
      content: 'Demo is complete. Starting electrical and plumbing rough-ins this week.',
      timestamp: '9:00 AM',
    },
    {
      id: 2,
      sender: 'operator',
      content: 'Great! Are we still on track for the projected timeline? Any concerns about the budget?',
      timestamp: '9:15 AM',
    },
    {
      id: 3,
      sender: 'contact',
      content: 'Timeline looks good. We\'re slightly under budget so far. I\'ll send the updated cost breakdown by EOD.',
      timestamp: '9:45 AM',
    },
    {
      id: 4,
      sender: 'operator',
      content: 'Perfect. Let\'s schedule a walkthrough for Friday to review progress before the next phase.',
      timestamp: '10:00 AM',
    },
  ];

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'contractor': return <BuildIcon sx={{ color: brandColors.primary }} />;
      case 'vendor': return <BusinessIcon sx={{ color: brandColors.actions.success }} />;
      case 'maintenance': return <EngineeringIcon sx={{ color: brandColors.actions.warning }} />;
      case 'renovation': return <BuildIcon sx={{ color: brandColors.actions.info }} />;
      case 'property-manager': return <PersonIcon sx={{ color: brandColors.actions.error }} />;
      case 'supplier': return <AccountBalanceIcon sx={{ color: brandColors.actions.primary }} />;
      default: return <PersonIcon sx={{ color: brandColors.text.secondary }} />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'contractor': return 'General Contractor';
      case 'vendor': return 'Service Vendor';
      case 'maintenance': return 'Maintenance Team';
      case 'renovation': return 'Renovation Specialist';
      case 'property-manager': return 'Property Manager';
      case 'supplier': return 'Material Supplier';
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
        sender: 'operator',
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
            Deal Communications
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
          Coordinate with contractors, inspectors, lenders, and appraisers for Fix & Flip, BRRR, and Construction projects
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
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: message.sender === 'operator' ? brandColors.text.inverse : brandColors.text.primary 
                        }}
                      >
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: message.sender === 'operator' ? brandColors.text.inverse : brandColors.text.primary,
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
                Project Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Project</Typography>
                  <Typography variant="body2">{selectedConv.project}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Project Type</Typography>
                  <Typography variant="body2">{selectedConv.projectType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Service Type</Typography>
                  <Typography variant="body2">{selectedConv.serviceType}</Typography>
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

export default OperateMessages;