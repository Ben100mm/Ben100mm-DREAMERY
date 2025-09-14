import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import styled from 'styled-components';
import { brandColors } from '../../theme';
import { UserDetails } from '../../types/messaging';

// Lazy load icons
const LazyCloseIcon = React.lazy(() => import('@mui/icons-material/Close'));
const LazyArrowBackIcon = React.lazy(() => import('@mui/icons-material/ArrowBack'));
const LazyPhoneIcon = React.lazy(() => import('@mui/icons-material/Phone'));
const LazyEmailIcon = React.lazy(() => import('@mui/icons-material/Email'));
const LazyLocationIcon = React.lazy(() => import('@mui/icons-material/LocationOn'));
const LazyVerifiedIcon = React.lazy(() => import('@mui/icons-material/Verified'));
const LazyPendingIcon = React.lazy(() => import('@mui/icons-material/Pending'));
const LazyUnverifiedIcon = React.lazy(() => import('@mui/icons-material/Unpublished'));

interface DetailsPanelProps {
  userDetails?: UserDetails;
  onBackToList?: () => void;
}

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${brandColors.backgrounds.primary};
  overflow: hidden;
`;

const DetailsHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${brandColors.borders.secondary};
  background: ${brandColors.backgrounds.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DetailsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
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

const UserProfileSection = styled.div`
  margin-bottom: 1.5rem;
`;

const UserAvatar = styled(Avatar)`
  background: ${brandColors.primary};
  color: ${brandColors.backgrounds.primary};
  font-weight: 600;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
`;

const UserName = styled(Typography)`
  font-weight: 600;
  color: ${brandColors.text.primary};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const UserRole = styled(Typography)`
  color: ${brandColors.text.secondary};
  text-align: center;
  margin-bottom: 0.25rem;
`;

const UserOrganization = styled(Typography)`
  color: ${brandColors.text.secondary};
  text-align: center;
  margin-bottom: 1rem;
  font-style: italic;
`;

const VerificationStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const StatusChip = styled(Chip)<{ status: string }>`
  font-size: 0.8rem;
  background: ${props => {
    switch (props.status) {
      case 'Verified':
        return brandColors.accent.success;
      case 'Pending':
        return brandColors.accent.warning;
      case 'Unverified':
        return brandColors.text.disabled;
      default:
        return brandColors.text.disabled;
    }
  }};
  color: ${brandColors.backgrounds.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled(Button)`
  text-transform: none;
  border-radius: 8px;
  padding: 0.75rem;
  
  &.primary {
    background: ${brandColors.primary};
    color: ${brandColors.backgrounds.primary};
    
    &:hover {
      background: ${brandColors.secondary};
    }
  }
  
  &.secondary {
    border: 1px solid ${brandColors.borders.secondary};
    color: ${brandColors.text.primary};
    
    &:hover {
      background: ${brandColors.backgrounds.hover};
      border-color: ${brandColors.primary};
    }
  }
`;

const InfoSection = styled(Card)`
  margin-bottom: 1.5rem;
  background: ${brandColors.backgrounds.primary};
  border: 1px solid ${brandColors.borders.secondary};
  box-shadow: none;
`;

const InfoSectionTitle = styled(Typography)`
  font-weight: 600;
  color: ${brandColors.text.primary};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${brandColors.borders.secondary};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${brandColors.backgrounds.secondary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled(Typography)`
  color: ${brandColors.text.secondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const InfoValue = styled(Typography)`
  color: ${brandColors.text.primary};
  font-size: 0.9rem;
`;

const PrivateNotesSection = styled.div`
  margin-bottom: 1.5rem;
`;

const PrivateNotesTextarea = styled(TextField)`
  & .MuiOutlinedInput-root {
    backgroundColor: ${brandColors.backgrounds.secondary};
  }
`;

const SupportSection = styled.div`
  margin-bottom: 1rem;
`;

const SupportOption = styled(ListItem)`
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid ${brandColors.borders.secondary};
  
  &:hover {
    background: ${brandColors.backgrounds.hover};
  }
`;

const NoDetailsSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${brandColors.text.secondary};
  padding: 2rem;
  text-align: center;
`;

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  userDetails,
  onBackToList,
}) => {
  const [privateNotes, setPrivateNotes] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <LazyVerifiedIcon />;
      case 'Pending':
        return <LazyPendingIcon />;
      default:
        return <LazyUnverifiedIcon />;
    }
  };

  const handleCall = () => {
    // In a real app, this would initiate a call
    console.log('Initiating call to:', userDetails?.name);
  };

  const handleViewCaseDetails = () => {
    // In a real app, this would navigate to case details
    console.log('Viewing case details for:', userDetails?.name);
  };

  if (!userDetails) {
    return (
      <DetailsContainer>
        <NoDetailsSelected>
          <Typography variant="h6" color={brandColors.text.secondary}>
            Select a conversation to view details
          </Typography>
          <Typography variant="body2" color={brandColors.text.secondary} sx={{ mt: 1 }}>
            Choose a conversation from the list to see contact information and case details
          </Typography>
        </NoDetailsSelected>
      </DetailsContainer>
    );
  }

  return (
    <DetailsContainer>
      <DetailsHeader>
        <Typography variant="h6" sx={{ 
          color: brandColors.primary,
          fontWeight: 600,
          margin: 0
        }}>
          Details
        </Typography>
        <Box>
          {onBackToList && (
            <IconButton onClick={onBackToList} sx={{ mr: 1 }}>
              <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                <LazyArrowBackIcon />
              </React.Suspense>
            </IconButton>
          )}
          <IconButton>
            <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
              <LazyCloseIcon />
            </React.Suspense>
          </IconButton>
        </Box>
      </DetailsHeader>

      <DetailsContent>
        <UserProfileSection>
          <UserAvatar>
            {userDetails.initials}
          </UserAvatar>
          
          <UserName variant="h6">
            {userDetails.name}
          </UserName>
          
          <UserRole variant="body2">
            {userDetails.role}
          </UserRole>
          
          {userDetails.organization && (
            <UserOrganization variant="body2">
              {userDetails.organization}
            </UserOrganization>
          )}
          
          <VerificationStatus>
            <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
              {getVerificationIcon(userDetails.verificationStatus)}
            </React.Suspense>
            <StatusChip 
              label={userDetails.verificationStatus} 
              status={userDetails.verificationStatus}
              size="small"
            />
          </VerificationStatus>
        </UserProfileSection>

        <ActionButtons>
          <ActionButton 
            variant="contained" 
            className="primary"
            onClick={handleCall}
            startIcon={
              <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                <LazyPhoneIcon />
              </React.Suspense>
            }
          >
            Call
          </ActionButton>
          
          <ActionButton 
            variant="outlined" 
            className="secondary"
            onClick={handleViewCaseDetails}
          >
            View Case Details
          </ActionButton>
        </ActionButtons>

        <InfoSection>
          <CardContent>
            <InfoSectionTitle variant="subtitle1">
              Contact Information
            </InfoSectionTitle>
            
            <InfoItem>
              <InfoLabel>Date of Contact</InfoLabel>
              <InfoValue>{formatDate(userDetails.contactDate)}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Join Date</InfoLabel>
              <InfoValue>{formatDate(userDetails.joinDate)}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Topic of Discussion</InfoLabel>
              <InfoValue>{userDetails.topicOfDiscussion}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Verification Status</InfoLabel>
              <InfoValue>{userDetails.verificationStatus}</InfoValue>
            </InfoItem>
          </CardContent>
        </InfoSection>

        {userDetails.caseDetails && (
          <InfoSection>
            <CardContent>
              <InfoSectionTitle variant="subtitle1">
                Case Details
              </InfoSectionTitle>
              
              <InfoItem>
                <InfoLabel>Case ID</InfoLabel>
                <InfoValue>{userDetails.caseDetails.id}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Type</InfoLabel>
                <InfoValue>{userDetails.caseDetails.type}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>{userDetails.caseDetails.status}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Priority</InfoLabel>
                <InfoValue>{userDetails.caseDetails.priority}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Created</InfoLabel>
                <InfoValue>{formatDate(userDetails.caseDetails.createdDate)}</InfoValue>
              </InfoItem>
              
              {userDetails.caseDetails.relatedProperty && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <InfoItem>
                    <InfoLabel>Property</InfoLabel>
                    <InfoValue>{userDetails.caseDetails.relatedProperty.address}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Type</InfoLabel>
                    <InfoValue>{userDetails.caseDetails.relatedProperty.type}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Price</InfoLabel>
                    <InfoValue>{userDetails.caseDetails.relatedProperty.price}</InfoValue>
                  </InfoItem>
                </>
              )}
            </CardContent>
          </InfoSection>
        )}

        <PrivateNotesSection>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 600,
            color: brandColors.text.primary,
            marginBottom: 1
          }}>
            Private Notes
          </Typography>
          
          <PrivateNotesTextarea
            multiline
            rows={4}
            placeholder="Add private notes about this contact..."
            value={privateNotes}
            onChange={(e) => setPrivateNotes(e.target.value)}
            fullWidth
          />
        </PrivateNotesSection>

        <SupportSection>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 600,
            color: brandColors.text.primary,
            marginBottom: 1
          }}>
            Support Options
          </Typography>
          
          <List disablePadding>
            <SupportOption>
              <ListItemIcon>
                <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                  <LazyEmailIcon />
                </React.Suspense>
              </ListItemIcon>
              <ListItemText 
                primary="Send Email" 
                secondary="Send a follow-up email"
              />
            </SupportOption>
            
            <SupportOption>
              <ListItemIcon>
                <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                  <LazyLocationIcon />
                </React.Suspense>
              </ListItemIcon>
              <ListItemText 
                primary="Schedule Meeting" 
                secondary="Set up an in-person meeting"
              />
            </SupportOption>
          </List>
        </SupportSection>
      </DetailsContent>
    </DetailsContainer>
  );
};

export { DetailsPanel };
