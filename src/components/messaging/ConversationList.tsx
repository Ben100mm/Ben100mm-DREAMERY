import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Badge,
  Tabs,
  Tab,
  Paper,
  Button,
} from '@mui/material';
import styled from 'styled-components';
import { brandColors } from '../../theme';
import { Conversation } from '../../types/messaging';

// Lazy load icons
const LazySearchIcon = React.lazy(() => import('@mui/icons-material/Search'));
const LazySettingsIcon = React.lazy(() => import('@mui/icons-material/Settings'));
const LazyArrowBackIcon = React.lazy(() => import('@mui/icons-material/ArrowBack'));

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onConversationSelect: (id: string) => void;
  onBackToList?: () => void;
}

const ConversationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: brandColors.backgrounds.primary;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid brandColors.borders.secondary;
  background: brandColors.backgrounds.primary;
`;

const SearchSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid brandColors.borders.secondary;
`;

const FilterSection = styled.div`
  padding: 0 1rem;
  border-bottom: 1px solid brandColors.borders.secondary;
`;

const ConversationListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: brandColors.borders.secondary;
    border-radius: 2px;
    opacity: 0.6;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: brandColors.text.disabled;
    opacity: 0.8;
  }
`;

const ConversationItem = styled(ListItemButton)<{ selected: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid brandColors.borders.secondary;
  background: props => props.selected ? brandColors.backgrounds.selected : 'transparent';
  
  &:hover {
    background: props => props.selected ? brandColors.backgrounds.selected : brandColors.backgrounds.hover;
  }
`;

const ConversationAvatar = styled(Avatar)`
  background: brandColors.primary;
  color: brandColors.backgrounds.primary;
  font-weight: 600;
  width: 48px;
  height: 48px;
`;

const ConversationContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 1rem;
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ConversationName = styled(Typography)`
  font-weight: 600;
  color: brandColors.text.primary;
  font-size: 0.95rem;
`;

const ConversationTime = styled(Typography)`
  color: brandColors.text.secondary;
  font-size: 0.8rem;
`;

const ConversationRole = styled(Typography)`
  color: brandColors.text.secondary;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const ConversationProperty = styled(Typography)`
  color: brandColors.text.secondary;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  font-style: italic;
`;

const ConversationMessage = styled(Typography)`
  color: brandColors.text.secondary;
  font-size: 0.85rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StatusChip = styled(Chip)<{ status: string }>`
  font-size: 0.7rem;
  height: 20px;
  background: props => {
    switch (props.status) {
      case 'Active':
        return brandColors.accent.success;
      case 'Pending':
        return brandColors.accent.warning;
      case 'Closed':
        return brandColors.text.disabled;
      default:
        return brandColors.text.disabled;
    
  }};
  color: brandColors.backgrounds.primary;
  
  .MuiChip-label {
    padding: 0 8px;
  }
`;

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  onBackToList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.propertyDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.organization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'unread' && (conv.unreadCount || 0) > 0);
    
    return matchesSearch && matchesFilter;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleFilterChange = (event: React.SyntheticEvent, newValue: 'all' | 'unread') => {
    setActiveFilter(newValue);
  };

  return (
    <ConversationListContainer>
      <HeaderSection>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {onBackToList && (
              <IconButton onClick={onBackToList} sx={{ mr: 1 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyArrowBackIcon />
                </React.Suspense>
              </IconButton>
            )}
            <Typography variant="h6" sx={{ 
              color: brandColors.primary,
              fontWeight: 600,
              margin: 0
            }}>
              Messages
            </Typography>
          </Box>
          <IconButton>
            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
              <LazySettingsIcon />
            </React.Suspense>
          </IconButton>
        </Box>
      </HeaderSection>

      <SearchSection>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                  <LazySearchIcon sx={{ color: brandColors.text.secondary }} />
                </React.Suspense>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: brandColors.backgrounds.secondary,
            },
          }}
        />
      </SearchSection>

      <FilterSection>
        <Tabs
          value={activeFilter}
          onChange={handleFilterChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: 40,
              fontSize: '0.9rem',
            },
            '& .Mui-selected': {
              color: brandColors.primary,
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: brandColors.primary,
              height: 3,
            },
          }}
        >
          <Tab 
            label="All" 
            value="all"
            sx={{ 
              color: brandColors.text.secondary,
              
            }}
          />
          <Tab 
            label="Unread" 
            value="unread"
            sx={{ 
              color: brandColors.text.secondary,
              
            }}
          />
        </Tabs>
      </FilterSection>

      <ConversationListContent>
        <List disablePadding>
          {filteredConversations.map((conversation) => (
            <ListItem key={conversation.id} disablePadding>
              <ConversationItem
                selected={selectedConversationId === conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={conversation.unreadCount}
                    color="error"
                    invisible={conversation.unreadCount === 0}
                  >
                    <ConversationAvatar>
                      {conversation.initials}
                    </ConversationAvatar>
                  </Badge>
                </ListItemAvatar>
                
                <ConversationContent>
                  <ConversationHeader>
                    <Box>
                      <ConversationName>
                        {conversation.contactName}
                      </ConversationName>
                      <ConversationRole>
                        {conversation.role}
                        {conversation.organization && ` • ${conversation.organization}`}
                      </ConversationRole>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <StatusChip 
                        label={conversation.status || 'normal'} 
                        status={conversation.status || 'normal'}
                        size="small"
                      />
                      <ConversationTime>
                        {formatTime(conversation.timestamp || new Date())}
                      </ConversationTime>
                    </Box>
                  </ConversationHeader>
                  
                  <ConversationProperty>
                    {conversation.propertyDescription}
                  </ConversationProperty>
                  
                  <ConversationMessage>
                    {conversation.lastMessage || 'No messages'}
                  </ConversationMessage>
                </ConversationContent>
              </ConversationItem>
            </ListItem>
          ))}
        </List>
        
        {filteredConversations.length === 0 && (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="200px"
            padding={2}
          >
            <Typography variant="body2" color={brandColors.text.secondary} textAlign="center">
              {searchQuery ? 'No conversations found matching your search.' : 'No conversations yet.'}
            </Typography>
          </Box>
        )}
      </ConversationListContent>
    </ConversationListContainer>
  );
};

export { ConversationList };
