import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import styled from 'styled-components';
import { brandColors } from '../../theme';
import { Conversation, Message } from '../../types/messaging';

// Lazy load icons
const LazySendIcon = React.lazy(() => import('@mui/icons-material/Send'));
const LazyAttachFileIcon = React.lazy(() => import('@mui/icons-material/AttachFile'));
const LazyEmojiIcon = React.lazy(() => import('@mui/icons-material/EmojiEmotions'));
const LazyTranslateIcon = React.lazy(() => import('@mui/icons-material/Translate'));
const LazyArrowBackIcon = React.lazy(() => import('@mui/icons-material/ArrowBack'));
const LazyMoreVertIcon = React.lazy(() => import('@mui/icons-material/MoreVert'));

interface ChatInterfaceProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onTranslationToggle: (enabled: boolean) => void;
  translationEnabled: boolean;
  isLoading?: boolean;
  onBackToList?: () => void;
  onShowDetails?: () => void;
  isMobile?: boolean;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${brandColors.backgrounds.primary};
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${brandColors.borders.secondary};
  background: ${brandColors.backgrounds.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ChatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContactAvatar = styled(Avatar)`
  background: ${brandColors.primary};
  color: ${brandColors.backgrounds.primary};
  font-weight: 600;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled(Typography)`
  font-weight: 600;
  color: ${brandColors.text.primary};
  font-size: 1rem;
  margin: 0;
`;

const ContactDetails = styled(Typography)`
  color: ${brandColors.text.secondary};
  font-size: 0.8rem;
  margin: 0;
`;

const StatusChip = styled(Chip)<{ status: string }>`
  font-size: 0.7rem;
  height: 20px;
  background: ${props => {
    switch (props.status) {
      case 'Active':
        return brandColors.accent.success;
      case 'Pending':
        return brandColors.accent.warning;
      case 'Closed':
        return brandColors.text.disabled;
      default:
        return brandColors.text.disabled;
    }
  }};
  color: ${brandColors.backgrounds.primary};
  
  .MuiChip-label {
    padding: 0 8px;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${brandColors.borders.secondary};
    border-radius: 2px;
    opacity: 0.6;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${brandColors.text.disabled};
    opacity: 0.8;
  }
`;

const MessageBubble = styled.div<{ isFromUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isFromUser ? 'flex-end' : 'flex-start'};
  max-width: 70%;
`;

const MessageContent = styled(Paper)<{ isFromUser: boolean }>`
  padding: 0.75rem 1rem;
  background: ${props => props.isFromUser 
    ? brandColors.primary  /* Dreamery primary blue for user messages */
    : brandColors.backgrounds.secondary}; /* Dreamery secondary background for respondent messages */
  color: ${props => props.isFromUser 
    ? brandColors.backgrounds.primary  /* White text for user messages */
    : brandColors.text.primary}; /* Dreamery text primary for respondent messages */
  border-radius: ${props => props.isFromUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.4;
`;

const MessageTimestamp = styled(Typography)`
  font-size: 0.7rem;
  color: ${brandColors.text.secondary};
  margin-top: 0.25rem;
  text-align: center;
`;

const MessageInputArea = styled.div`
  padding: 1rem;
  border-top: 1px solid ${brandColors.borders.secondary};
  background: ${brandColors.backgrounds.primary};
`;

const MessageInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

const MessageInput = styled(TextField)`
  flex: 1;
  
  & .MuiOutlinedInput-root {
    borderRadius: 24px;
    backgroundColor: ${brandColors.backgrounds.secondary};
    padding: 0.5rem 1rem;
    
    & .MuiOutlinedInput-input {
      padding: 0.5rem 0;
    }
  }
`;

const SendButton = styled(IconButton)<{ disabled: boolean }>`
  background: ${props => props.disabled 
    ? brandColors.text.disabled 
    : brandColors.primary};
  color: ${brandColors.backgrounds.primary};
  width: 40px;
  height: 40px;
  
  &:hover {
    background: ${props => props.disabled 
      ? brandColors.text.disabled 
      : brandColors.secondary};
  }
`;

const ClosedConversationNotice = styled.div`
  padding: 1rem;
  background: ${brandColors.backgrounds.warning};
  border: 1px solid ${brandColors.accent.warning};
  border-radius: 8px;
  margin: 1rem;
  text-align: center;
`;

const NoConversationSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${brandColors.text.secondary};
  padding: 2rem;
`;

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  messages,
  onSendMessage,
  onTranslationToggle,
  translationEnabled,
  isLoading,
  onBackToList,
  onShowDetails,
  isMobile,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && conversation) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  if (!conversation) {
    return (
      <ChatContainer>
        <NoConversationSelected>
          <Typography variant="h6" color={brandColors.text.secondary}>
            Select a conversation to start messaging
          </Typography>
          <Typography variant="body2" color={brandColors.text.secondary} sx={{ mt: 1 }}>
            Choose from the conversation list to view and send messages
          </Typography>
        </NoConversationSelected>
      </ChatContainer>
    );
  }

  const isConversationClosed = conversation.status === 'Closed';

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatHeaderLeft>
          {isMobile && onBackToList && (
            <IconButton onClick={onBackToList} sx={{ mr: 1 }}>
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyArrowBackIcon />
              </React.Suspense>
            </IconButton>
          )}
          
          <ContactAvatar>
            {conversation.initials}
          </ContactAvatar>
          
          <ContactInfo>
            <ContactName>
              {conversation.contactName}
            </ContactName>
            <ContactDetails>
              {conversation.role}
              {conversation.organization && ` • ${conversation.organization}`}
            </ContactDetails>
          </ContactInfo>
        </ChatHeaderLeft>
        
        <ChatHeaderRight>
          <StatusChip 
            label={conversation.status} 
            status={conversation.status}
            size="small"
          />
          
          <IconButton 
            onClick={() => onTranslationToggle(!translationEnabled)}
            sx={{ 
              color: translationEnabled ? brandColors.primary : brandColors.text.secondary 
            }}
          >
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyTranslateIcon />
            </React.Suspense>
          </IconButton>
          
          <IconButton onClick={onShowDetails}>
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              <LazyMoreVertIcon />
            </React.Suspense>
          </IconButton>
        </ChatHeaderRight>
      </ChatHeader>

      <MessagesArea>
        {messages.map((message) => (
          <MessageBubble key={message.id} isFromUser={message.isFromUser}>
            <MessageContent isFromUser={message.isFromUser}>
              {message.content}
            </MessageContent>
            <MessageTimestamp>
              {formatMessageTime(message.timestamp)}
            </MessageTimestamp>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesArea>

      {isConversationClosed && (
        <ClosedConversationNotice>
          <Typography variant="body2" color={brandColors.accent.warning}>
            This conversation is closed
          </Typography>
        </ClosedConversationNotice>
      )}

      <MessageInputArea>
        {isConversationClosed ? (
          <Typography variant="body2" color={brandColors.text.secondary} textAlign="center">
            This conversation is closed and no longer accepting new messages.
          </Typography>
        ) : (
          <MessageInputContainer>
            <IconButton>
              <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                <LazyAttachFileIcon />
              </React.Suspense>
            </IconButton>
            
            <MessageInput
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            
            <IconButton>
              <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                <LazyEmojiIcon />
              </React.Suspense>
            </IconButton>
            
            <SendButton
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isLoading}
            >
              <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                <LazySendIcon />
              </React.Suspense>
            </SendButton>
          </MessageInputContainer>
        )}
      </MessageInputArea>
    </ChatContainer>
  );
};

export { ChatInterface };
