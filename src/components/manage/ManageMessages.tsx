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
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const ManageMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      tenant: 'John Smith',
      property: '123 Main St, Apt 2B',
      lastMessage: 'The AC is still not working properly. Can you send someone to check it?',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'urgent',
    },
    {
      id: 2,
      tenant: 'Sarah Johnson',
      property: '456 Oak Ave, Apt 1A',
      lastMessage: 'Thank you for fixing the leak so quickly!',
      timestamp: '1 day ago',
      unread: 0,
      status: 'normal',
    },
    {
      id: 3,
      tenant: 'Mike Davis',
      property: '789 Pine St, Apt 3C',
      lastMessage: 'When is the rent due this month?',
      timestamp: '2 days ago',
      unread: 1,
      status: 'normal',
    },
    {
      id: 4,
      tenant: 'Lisa Wilson',
      property: '321 Elm St, Apt 2A',
      lastMessage: 'I would like to renew my lease for another year.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'normal',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'tenant',
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
      sender: 'tenant',
      content: 'The AC is still not working properly. Can you send someone to check it?',
      timestamp: '2:15 PM',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'error';
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

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Messages
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: brandColors.primary }}>
            New Message
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid brandColors.neutral[300]' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Conversations
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {conversations.map((conversation, index) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem sx={{
        backgroundColor: selectedConversation === conversation.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        cursor: 'pointer',
        
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
      }}
                      onClick={() => setSelectedConversation(conversation.id)}
                      sx={{
                        15`,
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={conversation.unread}
                          color="error"
                          invisible={conversation.unread === 0}
                        >
                          <Avatar sx={{ bgcolor: brandColors.primary }}>
                            {conversation.tenant.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {conversation.tenant}
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
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {conversation.property}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {conversation.lastMessage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {conversation.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < conversations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Messages */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid brandColors.neutral[300]' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: brandColors.primary }}>
                        {selectedConv.tenant.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {selectedConv.tenant}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConv.property}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                  {messages.map((message) => (
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
                          backgroundColor: message.sender === 'manager' ? brandColors.primary : brandColors.neutral[100],
                          color: message.sender === 'manager' ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.7,
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid brandColors.neutral[300]' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <IconButton>
                      <AttachIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{ bgcolor: brandColors.primary }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageMessages;
