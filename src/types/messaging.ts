export interface Conversation {
  id: string;
  contactName: string;
  organization: string;
  role: string;
  initials: string;
  joinDate: Date;
  verificationStatus: string;
  dateOfContact: string;
  topicOfDiscussion: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
}

export interface UserDetails {
  id: string;
  name: string;
  organization: string;
  role: string;
  initials: string;
  joinDate: Date;
  verificationStatus: string;
  contactDate: string;
  topicOfDiscussion: string;
}
