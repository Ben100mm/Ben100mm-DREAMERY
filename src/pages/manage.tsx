import React, { useState, useEffect } from 'react';
import { 
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Card,
  FormControl,
  Grid,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';
import housesImage from '../houses-watercolor.png';
import { ConversationList, ChatInterface, DetailsPanel } from '../components/messaging';
import { Conversation, Message, UserDetails } from '../types/messaging';
// Lazy load icons to reduce initial bundle size
const LazyDashboardIcon = React.lazy(() => import('@mui/icons-material/Dashboard'));
const LazyAccountIcon = React.lazy(() => import('@mui/icons-material/AccountCircle'));
const LazyListingIcon = React.lazy(() => import('@mui/icons-material/AddHome'));
const LazyLeaseIcon = React.lazy(() => import('@mui/icons-material/Description'));
const LazyApplicationIcon = React.lazy(() => import('@mui/icons-material/Assignment'));
const LazyPaymentIcon = React.lazy(() => import('@mui/icons-material/Payment'));
const LazyIntegrationIcon = React.lazy(() => import('@mui/icons-material/Settings'));
const LazyInsuranceIcon = React.lazy(() => import('@mui/icons-material/Security'));
const LazyCalendarIcon = React.lazy(() => import('@mui/icons-material/Event'));
const LazyChatIcon = React.lazy(() => import('@mui/icons-material/Chat'));
const LazyEarningsIcon = React.lazy(() => import('@mui/icons-material/MonetizationOn'));
const LazyInsightsIcon = React.lazy(() => import('@mui/icons-material/Insights'));
const LazyHomeIcon = React.lazy(() => import('@mui/icons-material/Home'));
const LazyEditIcon = React.lazy(() => import('@mui/icons-material/Edit'));


const ManagePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accountSubTab, setAccountSubTab] = useState('personal');
  
  // Sub-tab states for each component
  const [dashboardTab, setDashboardTab] = useState('overview');
  const [calendarTab, setCalendarTab] = useState('scheduling');
  const [listingsTab, setListingsTab] = useState('property-listings');
  const [messagesTab, setMessagesTab] = useState('tenant-communication');
  const [earningsTab, setEarningsTab] = useState('revenue-tracking');
  const [insightsTab, setInsightsTab] = useState('performance-analytics');
  const [listingTab, setListingTab] = useState('property-setup');
  const [leasesTab, setLeasesTab] = useState('lease-management');
  const [applicationsTab, setApplicationsTab] = useState('application-processing');
  const [paymentsTab, setPaymentsTab] = useState('payment-processing');
  const [integrationsTab, setIntegrationsTab] = useState('third-party-services');
  const [insuranceTab, setInsuranceTab] = useState('property-insurance');
  
  // Messaging state
  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [showConversationList, setShowConversationList] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(!isMobile);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  
  // Listing form state
  const [propertyAddress, setPropertyAddress] = useState('');
  const [sellChecked, setSellChecked] = useState(false);
  const [listChecked, setListChecked] = useState(false);
  const [listingStep, setListingStep] = useState(1);
  const [selectedSituation, setSelectedSituation] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState('');
  
  // Function to handle step navigation with data persistence
  const goToStep = (step: number) => {
    setListingStep(step);
  };
  
  // Function to go back to previous step
  const goBack = () => {
    if (listingStep > 1) {
      setListingStep(listingStep - 1);
    }
  };
  
    // Function to go to next step
  const goNext = () => {
    if (listingStep < 14) { // Updated to reflect new total steps
      setListingStep(listingStep + 1);
    }
  };
  
  // Function to save all form data
  const saveFormData = () => {
    const formData = {
      propertyAddress,
      sellChecked,
      listChecked,
      selectedSituation,
      selectedTimeline,
      homeType,
      squareFootage,
      yearBuilt,
      bedrooms,
      fullBathrooms,
      threeQuarterBathrooms,
      halfBathrooms,
      floorsAboveGround,
      lotSize,
      selectedPoolType,
      garageSpaces,
      carportSpaces,
      parkingType,
      heatingCooling,
      hasFireplace,
      hasPool,
      hasBasement,
      hasDeckPatio,
      hasFencedYard,
      basementCondition,
      knowsBasementSqft,
      basementFinishedSqft,
      basementUnfinishedSqft,
      selectedExteriorDescription,
      selectedLivingRoomDescription,
      selectedMainBathroomDescription,
      selectedKitchenDescription,
      selectedCountertopType,
      isHOA,
      isAgeRestricted,
      isGatedCommunity,
      hasGuardAtEntrance,
      additionalInfo,
      firstName,
      lastName,
      phoneNumber
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('dreameryListingFormData', JSON.stringify(formData));
    console.log('Form data saved:', formData);
  };
  
  // Function to load saved form data
  const loadFormData = () => {
    const savedData = localStorage.getItem('dreameryListingFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Restore all form state
        setPropertyAddress(parsedData.propertyAddress || '');
        setSellChecked(parsedData.sellChecked || false);
        setListChecked(parsedData.listChecked || false);
        setSelectedSituation(parsedData.selectedSituation || '');
        setSelectedTimeline(parsedData.selectedTimeline || '');
        setHomeType(parsedData.homeType || '');
        setSquareFootage(parsedData.squareFootage || '');
        setYearBuilt(parsedData.yearBuilt || '');
        setBedrooms(parsedData.bedrooms || 0);
        setFullBathrooms(parsedData.fullBathrooms || 0);
        setThreeQuarterBathrooms(parsedData.threeQuarterBathrooms || 0);
        setHalfBathrooms(parsedData.halfBathrooms || 0);
        setFloorsAboveGround(parsedData.floorsAboveGround || 0);
        setLotSize(parsedData.lotSize || '');
        setSelectedPoolType(parsedData.selectedPoolType || '');
        setGarageSpaces(parsedData.garageSpaces || 0);
        setCarportSpaces(parsedData.carportSpaces || 0);
        setParkingType(parsedData.parkingType || '');
        setHeatingCooling(parsedData.heatingCooling || '');
        setHasFireplace(parsedData.hasFireplace || false);
        setHasPool(parsedData.hasPool || false);
        setHasBasement(parsedData.hasBasement || '');
        setHasDeckPatio(parsedData.hasDeckPatio || false);
        setHasFencedYard(parsedData.hasFencedYard || false);
        setBasementCondition(parsedData.basementCondition || '');
        setKnowsBasementSqft(parsedData.knowsBasementSqft || '');
        setBasementFinishedSqft(parsedData.basementFinishedSqft || '');
        setBasementUnfinishedSqft(parsedData.basementUnfinishedSqft || '');
        setSelectedExteriorDescription(parsedData.selectedExteriorDescription || '');
        setSelectedLivingRoomDescription(parsedData.selectedLivingRoomDescription || '');
        setSelectedMainBathroomDescription(parsedData.selectedMainBathroomDescription || '');
        setSelectedKitchenDescription(parsedData.selectedKitchenDescription || '');
        setSelectedCountertopType(parsedData.selectedCountertopType || '');
        setIsHOA(parsedData.isHOA || '');
        setIsAgeRestricted(parsedData.isAgeRestricted || '');
        setIsGatedCommunity(parsedData.isGatedCommunity || '');
        setHasGuardAtEntrance(parsedData.hasGuardAtEntrance || '');
        setAdditionalInfo(parsedData.additionalInfo || {});
        setFirstName(parsedData.firstName || '');
        setLastName(parsedData.lastName || '');
        setPhoneNumber(parsedData.phoneNumber || '');
        console.log('Form data loaded:', parsedData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    }
  };
  


  // Home details form state
  const [homeType, setHomeType] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [fullBathrooms, setFullBathrooms] = useState(0);
  const [threeQuarterBathrooms, setThreeQuarterBathrooms] = useState(0);
  const [halfBathrooms, setHalfBathrooms] = useState(0);
  const [floorsAboveGround, setFloorsAboveGround] = useState(0);
  const [lotSize, setLotSize] = useState('');

  // Pool details form state
  const [selectedPoolType, setSelectedPoolType] = useState('');
  const [garageSpaces, setGarageSpaces] = useState(0);
  const [carportSpaces, setCarportSpaces] = useState(0);
  const [parkingType, setParkingType] = useState('');
  const [heatingCooling, setHeatingCooling] = useState('');
  const [hasFireplace, setHasFireplace] = useState(false);
  const [hasPool, setHasPool] = useState(false);
  const [hasBasement, setHasBasement] = useState('');
  const [hasDeckPatio, setHasDeckPatio] = useState(false);
  const [hasFencedYard, setHasFencedYard] = useState(false);

  // Basement details form state
  const [basementCondition, setBasementCondition] = useState('');
  const [knowsBasementSqft, setKnowsBasementSqft] = useState('');
  const [basementFinishedSqft, setBasementFinishedSqft] = useState('');
  const [basementUnfinishedSqft, setBasementUnfinishedSqft] = useState('');

  // Exterior description form state
  const [selectedExteriorDescription, setSelectedExteriorDescription] = useState('');

  // Living room description form state
  const [selectedLivingRoomDescription, setSelectedLivingRoomDescription] = useState('');

  // Main bathroom description form state
  const [selectedMainBathroomDescription, setSelectedMainBathroomDescription] = useState('');

  // Kitchen description form state
  const [selectedKitchenDescription, setSelectedKitchenDescription] = useState('');

  // Kitchen countertops form state
  const [selectedCountertopType, setSelectedCountertopType] = useState('');

  // HOA and community features form state
  const [isHOA, setIsHOA] = useState('');
  const [isAgeRestricted, setIsAgeRestricted] = useState('');
  const [isGatedCommunity, setIsGatedCommunity] = useState('');
  const [hasGuardAtEntrance, setHasGuardAtEntrance] = useState('');

  // Additional information form state
  const [additionalInfo, setAdditionalInfo] = useState({
    leasedSolarPanels: false,
    foundationIssues: false,
    fireDamage: false,
    septicSystem: false,
    asbestosSiding: false,
    horseProperty: false,
    mobileManufacturedHome: false,
    uniqueOwnershipStructure: false,
    bmrOwnershipProgram: false,
    rentControlledWithTenant: false,
    undergroundFuelOilTanks: false,
    cesspoolOnProperty: false,
    noneOfThese: false,
    other: false
  });

  // Name collection form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Phone number collection form state
  const [phoneNumber, setPhoneNumber] = useState('');

  // Mock messaging data - 10 Dreamery-relevant conversations
  const mockConversations: Conversation[] = [
    {
      id: '1',
      contactName: 'Sarah Johnson',
      role: 'Property Buyer',
      organization: 'Dream Homes Realty',
      propertyDescription: '3BR/2BA Modern Condo in Downtown',
      lastMessage: 'Thank you for the quick response! I\'m very interested in scheduling a viewing.',
      timestamp: new Date('2024-01-15T14:30:00'),
      unreadCount: 2,
      status: 'Active',
      initials: 'SJ',
      topicOfDiscussion: 'Property Viewing Request',
      dateOfContact: new Date('2024-01-15T10:00:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2024-01-10T09:00:00'),
    },
    {
      id: '2',
      contactName: 'Michael Chen',
      role: 'Real Estate Agent',
      organization: 'Premier Properties',
      propertyDescription: 'Luxury Villa with Pool - Malibu',
      lastMessage: 'The inspection report looks great. When can we proceed with the offer?',
      timestamp: new Date('2024-01-15T11:45:00'),
      unreadCount: 0,
      status: 'Pending',
      initials: 'MC',
      topicOfDiscussion: 'Purchase Offer Negotiation',
      dateOfContact: new Date('2024-01-14T16:20:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2024-01-05T08:30:00'),
    },
    {
      id: '3',
      contactName: 'Emily Rodriguez',
      role: 'Property Seller',
      organization: 'Family Home LLC',
      propertyDescription: 'Historic Victorian House - 4BR/3BA',
      lastMessage: 'The closing documents have been signed. Thank you for your excellent service!',
      timestamp: new Date('2024-01-14T16:00:00'),
      unreadCount: 0,
      status: 'Closed',
      initials: 'ER',
      topicOfDiscussion: 'Property Sale Completion',
      dateOfContact: new Date('2024-01-01T09:00:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-12-20T14:15:00'),
    },
    {
      id: '4',
      contactName: 'David Thompson',
      role: 'Property Manager',
      organization: 'Urban Living Properties',
      propertyDescription: '12-Unit Apartment Building - Westside',
      lastMessage: 'I need to discuss the maintenance schedule for next month. Can we set up a call?',
      timestamp: new Date('2024-01-15T09:15:00'),
      unreadCount: 1,
      status: 'Active',
      initials: 'DT',
      topicOfDiscussion: 'Property Management Services',
      dateOfContact: new Date('2024-01-12T14:30:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-11-15T10:00:00'),
    },
    {
      id: '5',
      contactName: 'Lisa Park',
      role: 'Tenant',
      organization: 'Individual',
      propertyDescription: '2BR/1BA Apartment - Midtown',
      lastMessage: 'The leak in the kitchen faucet has been fixed. Thank you for sending the plumber so quickly!',
      timestamp: new Date('2024-01-15T08:45:00'),
      unreadCount: 0,
      status: 'Active',
      initials: 'LP',
      topicOfDiscussion: 'Maintenance Request',
      dateOfContact: new Date('2024-01-14T11:20:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-08-20T09:00:00'),
    },
    {
      id: '6',
      contactName: 'Robert Martinez',
      role: 'Mortgage Broker',
      organization: 'Dreamery Home Loans',
      propertyDescription: 'Single Family Home - Suburban',
      lastMessage: 'The pre-approval letter is ready. Your client should receive it within the hour.',
      timestamp: new Date('2024-01-14T17:30:00'),
      unreadCount: 0,
      status: 'Pending',
      initials: 'RM',
      topicOfDiscussion: 'Mortgage Pre-approval',
      dateOfContact: new Date('2024-01-13T10:15:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-09-10T08:30:00'),
    },
    {
      id: '7',
      contactName: 'Jennifer Walsh',
      role: 'Home Inspector',
      organization: 'Quality Inspections Inc.',
      propertyDescription: 'Townhouse - New Construction',
      lastMessage: 'The inspection is complete. I found a few minor issues that need attention before closing.',
      timestamp: new Date('2024-01-14T15:20:00'),
      unreadCount: 1,
      status: 'Active',
      initials: 'JW',
      topicOfDiscussion: 'Property Inspection Report',
      dateOfContact: new Date('2024-01-12T08:00:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-07-05T14:00:00'),
    },
    {
      id: '8',
      contactName: 'Amanda Foster',
      role: 'Rental Applicant',
      organization: 'Individual',
      propertyDescription: '1BR/1BA Studio - Arts District',
      lastMessage: 'I\'m very interested in the studio apartment. When can I submit my rental application?',
      timestamp: new Date('2024-01-15T13:10:00'),
      unreadCount: 3,
      status: 'Active',
      initials: 'AF',
      topicOfDiscussion: 'Rental Application Inquiry',
      dateOfContact: new Date('2024-01-15T13:10:00'),
      verificationStatus: 'Pending',
      joinDate: new Date('2024-01-15T13:10:00'),
    },
    {
      id: '9',
      contactName: 'Thomas Kim',
      role: 'Insurance Agent',
      organization: 'Dreamery Insurance Partners',
      propertyDescription: 'Multi-Family Property - 6 Units',
      lastMessage: 'The insurance quote for your multi-family property is ready. Coverage includes flood protection.',
      timestamp: new Date('2024-01-13T16:45:00'),
      unreadCount: 0,
      status: 'Pending',
      initials: 'TK',
      topicOfDiscussion: 'Property Insurance Quote',
      dateOfContact: new Date('2024-01-10T11:30:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-06-20T09:15:00'),
    },
    {
      id: '10',
      contactName: 'Maria Gonzalez',
      role: 'Property Investor',
      organization: 'Gonzalez Investment Group',
      propertyDescription: 'Commercial Property - Retail Space',
      lastMessage: 'I\'d like to discuss the investment potential of the retail property. Are you available for a call this week?',
      timestamp: new Date('2024-01-12T14:20:00'),
      unreadCount: 2,
      status: 'Active',
      initials: 'MG',
      topicOfDiscussion: 'Investment Property Discussion',
      dateOfContact: new Date('2024-01-12T14:20:00'),
      verificationStatus: 'Verified',
      joinDate: new Date('2023-05-15T10:30:00'),
    },
  ];

  const mockMessages: Message[] = [
    // Conversation 1 - Sarah Johnson (Property Buyer)
    {
      id: '1',
      conversationId: '1',
      senderId: 'user1',
      senderName: 'Sarah Johnson',
      content: 'Hi! I saw your listing for the downtown condo and I\'m very interested. Is it still available?',
      timestamp: new Date('2024-01-15T10:00:00'),
      isFromUser: false,
    },
    {
      id: '2',
      conversationId: '1',
      senderId: 'agent1',
      senderName: 'You',
      content: 'Hello Sarah! Yes, the condo is still available. Would you like to schedule a viewing?',
      timestamp: new Date('2024-01-15T10:15:00'),
      isFromUser: true,
    },
    {
      id: '3',
      conversationId: '1',
      senderId: 'user1',
      senderName: 'Sarah Johnson',
      content: 'That would be great! I\'m available this weekend. What times work for you?',
      timestamp: new Date('2024-01-15T10:30:00'),
      isFromUser: false,
    },
    {
      id: '4',
      conversationId: '1',
      senderId: 'user1',
      senderName: 'Sarah Johnson',
      content: 'Thank you for the quick response! I\'m very interested in scheduling a viewing.',
      timestamp: new Date('2024-01-15T14:30:00'),
      isFromUser: false,
    },
    
    // Conversation 5 - Lisa Park (Tenant)
    {
      id: '5',
      conversationId: '5',
      senderId: 'tenant1',
      senderName: 'Lisa Park',
      content: 'Hi, I have a maintenance issue in my apartment. The kitchen faucet has been leaking for two days now.',
      timestamp: new Date('2024-01-14T11:20:00'),
      isFromUser: false,
    },
    {
      id: '6',
      conversationId: '5',
      senderId: 'agent1',
      senderName: 'You',
      content: 'I\'m sorry to hear about the leak, Lisa. I\'ll send a plumber over today. What\'s the best time for you?',
      timestamp: new Date('2024-01-14T11:35:00'),
      isFromUser: true,
    },
    {
      id: '7',
      conversationId: '5',
      senderId: 'tenant1',
      senderName: 'Lisa Park',
      content: 'The leak in the kitchen faucet has been fixed. Thank you for sending the plumber so quickly!',
      timestamp: new Date('2024-01-15T08:45:00'),
      isFromUser: false,
    },
    
    // Conversation 8 - Amanda Foster (Rental Applicant)
    {
      id: '8',
      conversationId: '8',
      senderId: 'applicant1',
      senderName: 'Amanda Foster',
      content: 'Hi! I saw the studio apartment listing in the Arts District. Is it still available for rent?',
      timestamp: new Date('2024-01-15T13:10:00'),
      isFromUser: false,
    },
    {
      id: '9',
      conversationId: '8',
      senderId: 'agent1',
      senderName: 'You',
      content: 'Hello Amanda! Yes, the studio is still available. Are you interested in scheduling a viewing?',
      timestamp: new Date('2024-01-15T13:25:00'),
      isFromUser: true,
    },
    {
      id: '10',
      conversationId: '8',
      senderId: 'applicant1',
      senderName: 'Amanda Foster',
      content: 'I\'m very interested in the studio apartment. When can I submit my rental application?',
      timestamp: new Date('2024-01-15T13:45:00'),
      isFromUser: false,
    },
    
    // Conversation 10 - Maria Gonzalez (Property Investor)
    {
      id: '11',
      conversationId: '10',
      senderId: 'investor1',
      senderName: 'Maria Gonzalez',
      content: 'Good morning! I\'m interested in the retail property you have listed. What are the current rental rates?',
      timestamp: new Date('2024-01-12T14:20:00'),
      isFromUser: false,
    },
    {
      id: '12',
      conversationId: '10',
      senderId: 'agent1',
      senderName: 'You',
      content: 'Hello Maria! The current rental rate is $45/sq ft annually. Would you like to see the financials?',
      timestamp: new Date('2024-01-12T14:45:00'),
      isFromUser: true,
    },
    {
      id: '13',
      conversationId: '10',
      senderId: 'investor1',
      senderName: 'Maria Gonzalez',
      content: 'I\'d like to discuss the investment potential of the retail property. Are you available for a call this week?',
      timestamp: new Date('2024-01-12T15:10:00'),
      isFromUser: false,
    },
  ];

  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Responsive behavior
  useEffect(() => {
    if (isMobile) {
      setShowDetailsPanel(false);
    } else {
      setShowConversationList(true);
      setShowDetailsPanel(true);
    }
  }, [isMobile]);

  // Messaging functions
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (isMobile) {
      setShowConversationList(false);
      setShowDetailsPanel(false);
    }
  };

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversationId,
      senderId: 'current-user',
      senderName: 'You',
      content: message,
      timestamp: new Date(),
      isFromUser: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    console.log('Sending message:', { message, conversationId: selectedConversationId });
  };

  const handleTranslationToggle = (enabled: boolean) => {
    setTranslationEnabled(enabled);
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowConversationList(true);
      setShowDetailsPanel(false);
    }
  };

  const handleShowDetails = () => {
    if (isMobile) {
      setShowConversationList(false);
      setShowDetailsPanel(true);
    } else {
      setShowDetailsPanel(!showDetailsPanel);
    }
  };

  const selectedConversation = mockConversations.find(conv => conv.id === selectedConversationId);
  const conversationMessages = messages.filter(msg => msg.conversationId === selectedConversationId);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyDashboardIcon /></React.Suspense> },
    { id: 'calendar', label: 'Calendar', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyCalendarIcon /></React.Suspense> },
    { id: 'listings', label: 'Listings', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyListingIcon /></React.Suspense> },
    { id: 'messages', label: 'Messages', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyChatIcon /></React.Suspense> },
    { id: 'earnings', label: 'Earnings', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyEarningsIcon /></React.Suspense> },
    { id: 'insights', label: 'Insights', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyInsightsIcon /></React.Suspense> },
    { id: 'listing', label: 'Creating a Listing', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyListingIcon /></React.Suspense> },
    { id: 'leases', label: 'Online Leases', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyLeaseIcon /></React.Suspense> },
    { id: 'applications', label: 'Rental Applications', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyApplicationIcon /></React.Suspense> },
    { id: 'payments', label: 'Online Rent Payments', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyPaymentIcon /></React.Suspense> },
    { id: 'integrations', label: 'Integrations', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyIntegrationIcon /></React.Suspense> },
    { id: 'insurance', label: 'Insurance', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyInsuranceIcon /></React.Suspense> },
    { id: 'account', label: 'Manage Your Account', icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><LazyAccountIcon /></React.Suspense> }
  ];

  const accountSubTabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'security', label: 'Login & Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'payments', label: 'Payments' },
    { id: 'taxes', label: 'Taxes' }
  ];

  // Tab definitions for each component
  const dashboardTabs = [
    { id: 'overview', label: 'Property Overview' },
    { id: 'metrics', label: 'Performance Metrics' },
    { id: 'activity', label: 'Tenant Activity' },
    { id: 'maintenance', label: 'Maintenance Status' }
  ];

  const calendarTabs = [
    { id: 'scheduling', label: 'Scheduling' },
    { id: 'events', label: 'Events' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'appointments', label: 'Tenant Appointments' },
    { id: 'tours', label: 'Property Tours' }
  ];

  const listingsTabs = [
    { id: 'property-listings', label: 'Property Listings' },
    { id: 'market-analysis', label: 'Market Analysis' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'availability', label: 'Availability' },
    { id: 'marketing', label: 'Marketing' }
  ];

  const messagesTabs = [
    { id: 'tenant-communication', label: 'Tenant Communication' },
    { id: 'maintenance-requests', label: 'Maintenance Requests' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'support', label: 'Support' }
  ];

  const earningsTabs = [
    { id: 'revenue-tracking', label: 'Revenue Tracking' },
    { id: 'rent-collection', label: 'Rent Collection' },
    { id: 'financial-performance', label: 'Financial Performance' },
    { id: 'profit-analysis', label: 'Profit Analysis' }
  ];

  const insightsTabs = [
    { id: 'performance-analytics', label: 'Performance Analytics' },
    { id: 'market-trends', label: 'Market Trends' },
    { id: 'tenant-analytics', label: 'Tenant Analytics' },
    { id: 'financial-reports', label: 'Financial Reports' }
  ];

  const listingTabs = [
    { id: 'property-setup', label: 'Property Setup' },
    { id: 'photos', label: 'Photos' },
    { id: 'description', label: 'Description' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'marketing-strategy', label: 'Marketing Strategy' }
  ];

  const leasesTabs = [
    { id: 'lease-management', label: 'Lease Management' },
    { id: 'digital-signing', label: 'Digital Signing' },
    { id: 'renewals', label: 'Renewals' },
    { id: 'terms', label: 'Terms' },
    { id: 'compliance', label: 'Compliance' }
  ];

  const applicationsTabs = [
    { id: 'application-processing', label: 'Application Processing' },
    { id: 'tenant-screening', label: 'Tenant Screening' },
    { id: 'background-checks', label: 'Background Checks' },
    { id: 'approval', label: 'Approval' }
  ];

  const paymentsTabs = [
    { id: 'payment-processing', label: 'Payment Processing' },
    { id: 'collection', label: 'Collection' },
    { id: 'late-fees', label: 'Late Fees' },
    { id: 'financial-tracking', label: 'Financial Tracking' }
  ];

  const integrationsTabs = [
    { id: 'third-party-services', label: 'Third-party Services' },
    { id: 'payment-processors', label: 'Payment Processors' },
    { id: 'maintenance-vendors', label: 'Maintenance Vendors' },
    { id: 'utilities', label: 'Utilities' }
  ];

  const insuranceTabs = [
    { id: 'property-insurance', label: 'Property Insurance' },
    { id: 'coverage-management', label: 'Coverage Management' },
    { id: 'claims', label: 'Claims' },
    { id: 'risk-assessment', label: 'Risk Assessment' }
  ];

  // Helper function to render tabs
  const renderTabs = (tabs: any[], activeTab: string, setActiveTab: (tab: string) => void) => {
    console.log('Rendering tabs:', tabs, 'activeTab:', activeTab);
    if (!tabs || tabs.length === 0) {
      console.log('No tabs provided');
      return null;
    }
    return (
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, backgroundColor: 'white' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => {
            console.log('Tab changed to:', newValue);
            setActiveTab(newValue);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab 
              key={tab.id} 
              label={tab.label} 
              value={tab.id}
              sx={{ textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </Box>
    );
  };

  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Property Management Dashboard',
          subtitle: 'Centralized overview of all property management activities and progress tracking'
        };
      case 'calendar':
        return {
          title: 'Calendar',
          subtitle: 'View and manage maintenance, lease, and payment schedules'
        };
      case 'listing':
        return {
          title: 'Creating a Listing',
          subtitle: 'Step-by-step tools to create and publish a listing'
        };
      case 'listings':
        return {
          title: 'Listings',
          subtitle: 'Browse, edit, and manage your active and archived listings'
        };
      case 'messages':
        return {
          title: 'Messages',
          subtitle: 'Conversations with tenants, applicants, and partners'
        };
      case 'earnings':
        return {
          title: 'Earnings',
          subtitle: 'Track rent collections, deposits, payouts, and monthly totals'
        };
      case 'insights':
        return {
          title: 'Insights',
          subtitle: 'Performance metrics, trends, and recommendations for your portfolio'
        };
      case 'account':
        return {
          title: 'Manage Your Account',
          subtitle: 'Update your profile, manage preferences, and control your account settings'
        };
      case 'leases':
        return {
          title: 'Online Leases',
          subtitle: 'Generate, send, and manage digital lease agreements with electronic signatures'
        };
      case 'applications':
        return {
          title: 'Rental Applications',
          subtitle: 'Process rental applications, conduct background checks, and manage tenant screening'
        };
      case 'payments':
        return {
          title: 'Online Rent Payments',
          subtitle: 'Accept online rent payments, track payment history, and manage late fees'
        };
      case 'integrations':
        return {
          title: 'Integrations',
          subtitle: 'Connect with third-party services, accounting software, and property management tools'
        };
      case 'insurance':
        return {
          title: 'Insurance',
          subtitle: 'Manage property insurance policies, claims, and coverage information'
        };
      default:
        return { title: 'Property Management', subtitle: 'Manage your portfolio with Dreamery' };
    }
  };

  const getBannerIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyDashboardIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'calendar':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyCalendarIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'listing':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyListingIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'listings':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyListingIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'messages':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyChatIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'earnings':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyEarningsIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'insights':
        return <React.Suspense fallback={<Box sx={{ width: 28, color: 'white' }} />}><LazyInsightsIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'account':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyAccountIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'leases':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyLeaseIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'applications':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyApplicationIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'payments':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyPaymentIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'integrations':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyIntegrationIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      case 'insurance':
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyInsuranceIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
      default:
        return <React.Suspense fallback={<Box sx={{ width: 28, height: 28 }} />}><LazyDashboardIcon sx={{ fontSize: 28, color: 'white' }} /></React.Suspense>;
    }
  };

  const renderAccountSubContent = () => {
    switch (accountSubTab) {
      case 'personal':
  return (
        <Box>
          <Typography variant="h6" gutterBottom>
              Personal Information
          </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your name, contact information, and professional details.
          </Typography>
      </Box>
        );
      case 'security':
        return (
        <Box>
          <Typography variant="h6" gutterBottom>
              Login & Security
          </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your password, two-factor authentication, and login preferences.
          </Typography>
                      </Box>
        );
      case 'privacy':
        return (
                      <Box>
                        <Typography variant="h6" gutterBottom>
              Privacy
                        </Typography>
            <Typography variant="body1" color="text.secondary">
              Control your data sharing preferences and privacy settings.
                        </Typography>
                      </Box>
        );
      case 'notifications':
        return (
        <Box>
          <Typography variant="h6" gutterBottom>
              Notifications
          </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure email, SMS, and in-app notification preferences.
          </Typography>
                    </Box>
        );
      case 'payments':
        return (
                            <Box>
            <Typography variant="h6" gutterBottom>
              Payments
                              </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage payment methods, billing information, and subscription details.
                              </Typography>
                            </Box>
        );
      case 'taxes':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Taxes
                          </Typography>
            <Typography variant="body1" color="text.secondary">
              View tax documents, update tax information, and manage tax preferences.
                  </Typography>
        </Box>
        );
      default:
        return (
        <Box>
          <Typography variant="h6" gutterBottom>
              Select a sub-tab
          </Typography>
          </Box>
        );
    }
  };

  // Load saved data when component mounts
  React.useEffect(() => {
    loadFormData();
  }, []);
  
  // Save data whenever any form field changes
  React.useEffect(() => {
    saveFormData();
  }, [
    propertyAddress, sellChecked, listChecked, selectedSituation, selectedTimeline,
    homeType, squareFootage, yearBuilt, bedrooms, fullBathrooms, threeQuarterBathrooms,
    halfBathrooms, floorsAboveGround, lotSize, selectedPoolType, garageSpaces,
    carportSpaces, parkingType, heatingCooling, hasFireplace, hasPool, hasBasement,
    hasDeckPatio, hasFencedYard, basementCondition, knowsBasementSqft,
    basementFinishedSqft, basementUnfinishedSqft, selectedExteriorDescription,
    selectedLivingRoomDescription, selectedMainBathroomDescription, selectedKitchenDescription,
    selectedCountertopType, isHOA, isAgeRestricted, isGatedCommunity, hasGuardAtEntrance,
    additionalInfo, firstName, lastName, phoneNumber
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            {renderTabs(dashboardTabs, dashboardTab, setDashboardTab)}
            
            {dashboardTab === 'overview' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Property Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 200 }}>
                      <Typography variant="h6" gutterBottom>Total Properties</Typography>
                      <Typography variant="h3" color="primary">24</Typography>
                      <Typography variant="body2" color="text.secondary">+2 this month</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 200 }}>
                      <Typography variant="h6" gutterBottom>Occupancy Rate</Typography>
                      <Typography variant="h3" color="success.main">94%</Typography>
                      <Typography variant="body2" color="text.secondary">Above market average</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 200 }}>
                      <Typography variant="h6" gutterBottom>Monthly Revenue</Typography>
                      <Typography variant="h3" color="primary">$45,200</Typography>
                      <Typography variant="body2" color="text.secondary">+8% from last month</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 200 }}>
                      <Typography variant="h6" gutterBottom>Maintenance Requests</Typography>
                      <Typography variant="h3" color="warning.main">12</Typography>
                      <Typography variant="body2" color="text.secondary">3 urgent</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {dashboardTab === 'metrics' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Performance Metrics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Rent Collection Rate</Typography>
                      <Typography variant="h4" color="success.main">98.5%</Typography>
                      <Typography variant="body2" color="text.secondary">Last 30 days</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Average Rent</Typography>
                      <Typography variant="h4" color="primary">$1,875</Typography>
                      <Typography variant="body2" color="text.secondary">Per unit</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Turnover Rate</Typography>
                      <Typography variant="h4" color="info.main">12%</Typography>
                      <Typography variant="body2" color="text.secondary">Annual</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {dashboardTab === 'activity' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Tenant Activity
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="New lease signed - Unit 3A"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Rent payment received - Unit 2B"
                        secondary="4 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Maintenance request - Unit 1C"
                        secondary="6 hours ago"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {dashboardTab === 'maintenance' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Maintenance Status
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Open Requests</Typography>
                      <Typography variant="h4" color="warning.main">8</Typography>
                      <Typography variant="body2" color="text.secondary">3 urgent, 5 normal</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Completed This Month</Typography>
                      <Typography variant="h4" color="success.main">24</Typography>
                      <Typography variant="body2" color="text.secondary">Average 2.4 days</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 'calendar':
        return (
          <Box>
            {renderTabs(calendarTabs, calendarTab, setCalendarTab)}
            
            {calendarTab === 'scheduling' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Scheduling
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Today's Schedule</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Property Inspection - 123 Main St"
                        secondary="10:00 AM - 11:00 AM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Tenant Meeting - Unit 2B"
                        secondary="2:00 PM - 3:00 PM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Lease Renewal - Unit 4A"
                        secondary="4:00 PM - 5:00 PM"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {calendarTab === 'events' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Events
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Rent Due Date"
                            secondary="January 1st"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Lease Expiration"
                            secondary="January 15th"
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Recurring Events</Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Monthly Property Walkthrough"
                            secondary="First Monday of each month"
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {calendarTab === 'maintenance' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Maintenance
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Scheduled Maintenance</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="HVAC Service - Building A"
                        secondary="January 10th, 9:00 AM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Fire Safety Inspection"
                        secondary="January 20th, 2:00 PM"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {calendarTab === 'appointments' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Tenant Appointments
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Lease Signing - John Smith"
                        secondary="Tomorrow, 10:00 AM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Move-in Inspection - Sarah Johnson"
                        secondary="Friday, 2:00 PM"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {calendarTab === 'tours' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Property Tours
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Scheduled Tours</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3A - Prospective Tenant"
                        secondary="Today, 3:00 PM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 1B - Family Tour"
                        secondary="Wednesday, 11:00 AM"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'listing':
        return (
          <Box>
            {renderTabs(listingTabs, listingTab, setListingTab)}
            
            {listingTab === 'property-setup' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                {/* Listing Creation Form with Multi-Step Layout */}
            {listingStep === 1 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                  {/* Left Column - Form */}
                  <Box sx={{ flex: 1, maxWidth: '500px' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: brandColors.primary,
                        mb: 2
                      }}
                    >
                      Tell us a bit about your home
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        mb: 4,
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      Discover your home's potential selling price with our Showcase listing in just 3 minutes. 
                      Start by entering your property's address below.
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <TextField
                        fullWidth
                        placeholder="Enter your address"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        variant="outlined"
                        size="medium"
                        sx={{ mb: 3 }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={sellChecked}
                              onChange={(e) => setSellChecked(e.target.checked)}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Sell"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={listChecked}
                              onChange={(e) => setListChecked(e.target.checked)}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="List"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Right Column - Watercolor Houses Image */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    minHeight: '400px'
                  }}>
                    <Box
                      sx={{
                        width: '400px',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        mb: 3
                      }}
                    >
                      <img 
                        src={housesImage} 
                        alt="Watercolor houses illustration" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%',
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (propertyAddress.trim() && (sellChecked || listChecked)) {
                        goNext();
                      } else {
                        alert('Please enter an address and select at least one option (Sell or List)');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Step 2: Questionnaire */}
            {listingStep === 2 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                  {/* Left Column - Questionnaire */}
                  <Box sx={{ flex: 1, maxWidth: '500px' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: brandColors.primary,
                        mb: 2
                      }}
                    >
                      Before we continue, do any of these describe your situation?
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        mb: 4,
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      If you've signed an agreement with an agent, we may need to share your selling options with them.
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <RadioGroup
                        value={selectedSituation || ''}
                        onChange={(e) => setSelectedSituation(e.target.value)}
                      >
                        <FormControlLabel
                          value="agent"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="I'm the owner's real estate agent"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="owner-agent"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="I'm both the owner and a licensed agent"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="builder"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="I'm working with a home builder"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="owner"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="I'm the owner and haven't signed an agreement with an agent"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="other"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="Other"
                          sx={{ mb: 2 }}
                        />
                      </RadioGroup>
                    </Box>
                    </Box>

                  {/* Right Column - Moving Details Illustration */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    minHeight: '400px'
                  }}>
                    <Box
                      sx={{
                        width: '400px',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        mb: 3
                      }}
                    >
                      <img 
                        src="/moving-details-illustration.png" 
                        alt="Moving details illustration" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                      </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (selectedSituation) {
                        goNext();
                      } else {
                        alert('Please select an option to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                      </Button>
                    </Box>
              </>
            )}

            {/* Step 3: Timeline Questionnaire */}
            {listingStep === 3 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                  {/* Left Column - Timeline Questionnaire */}
                  <Box sx={{ flex: 1, maxWidth: '500px' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: brandColors.primary,
                        mb: 2
                      }}
                    >
                      How soon would you like to sell?
                    </Typography>
                    
                    <Box sx={{ mb: 4 }}>
                      <RadioGroup
                        value={selectedTimeline || ''}
                        onChange={(e) => setSelectedTimeline(e.target.value)}
                      >
                        <FormControlLabel
                          value="asap"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="As soon as possible"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="1-month"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="Within 1 month"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="2-3-months"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="2-3 months"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="4-plus-months"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="4+ months"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="browsing"
                          control={<Radio sx={{ color: brandColors.primary }} />}
                          label="Just browsing"
                          sx={{ mb: 2 }}
                        />
                      </RadioGroup>
        </Box>
                  </Box>
                  
                  {/* Right Column - Moving Details Illustration 2 */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    minHeight: '400px'
                  }}>
                    <Box
                      sx={{
                        width: '400px',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        mb: 3
                      }}
                    >
                      <img 
                        src="/moving-details-illustration-2.png" 
                        alt="Moving details illustration 2" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (selectedTimeline) {
                        goNext();
                      } else {
                        alert('Please select a timeline to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Step 4: Home Details Form */}
            {listingStep === 4 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                  {/* Left Column - Home Details Form */}
                  <Box sx={{ flex: 1, maxWidth: '500px' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: brandColors.primary,
                        mb: 2
                      }}
                    >
                      Review your home details
          </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        mb: 4,
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      Update any missing or incorrect info.
          </Typography>

                    <Box sx={{ mb: 4 }}>
                      {/* Home Type Dropdown */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                          Home type
                              </Typography>
                        <Select
                          fullWidth
                          value={homeType || ''}
                          onChange={(e) => setHomeType(e.target.value)}
                          displayEmpty
                          variant="outlined"
                          size="medium"
                        >
                          <MenuItem value="" disabled>
                            Select home type
                          </MenuItem>
                          <MenuItem value="single-family">Single-family</MenuItem>
                          <MenuItem value="condo">Condo</MenuItem>
                          <MenuItem value="townhouse">Townhouse</MenuItem>
                          <MenuItem value="multi-family">Multi-family</MenuItem>
                          <MenuItem value="manufactured">Manufactured</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </Box>

                      {/* Square Footage */}
                      <Box sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          placeholder="Square footage (above ground)"
                          value={squareFootage}
                          onChange={(e) => setSquareFootage(e.target.value)}
                          variant="outlined"
                          size="medium"
                          sx={{ mb: 1 }}
                        />
                              <Typography variant="caption" color="text.secondary">
                          Tip: Don't include basements, non-permitted additions, or non-heated square footage.
                              </Typography>
                            </Box>

                      {/* Lot Size */}
                      <TextField
                        fullWidth
                        placeholder="Lot size (acres)"
                        value={lotSize}
                        onChange={(e) => setLotSize(e.target.value)}
                        variant="outlined"
                        size="medium"
                        sx={{ mb: 3 }}
                      />

                      {/* Year Built */}
                      <TextField
                        fullWidth
                        placeholder="Year built"
                        value={yearBuilt}
                        onChange={(e) => setYearBuilt(e.target.value)}
                        variant="outlined"
                        size="medium"
                        sx={{ mb: 3 }}
                      />

                      {/* Number Inputs with +/- Buttons */}
                      {[
                        { label: 'Bedrooms', value: bedrooms, setter: setBedrooms },
                        { label: 'Full bathrooms', value: fullBathrooms, setter: setFullBathrooms },
                        { label: '3/4 bathrooms', value: threeQuarterBathrooms, setter: setThreeQuarterBathrooms },
                        { label: '1/2 bathrooms', value: halfBathrooms, setter: setHalfBathrooms },
                        { label: 'Floors (above ground)', value: floorsAboveGround, setter: setFloorsAboveGround }
                      ].map((field) => (
                        <Box key={field.label} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          mb: 2 
                        }}>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {field.label}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => field.setter(Math.max(0, field.value - 1))}
                              sx={{ 
                                minWidth: '32px', 
                                height: '32px', 
                                borderRadius: '50%',
                                border: '1px solid #ccc',
                                p: 0
                              }}
                            >
                              -
                            </Button>
                            <Typography variant="body1" sx={{ 
                              minWidth: '20px', 
                              textAlign: 'center',
                              fontWeight: 500
                            }}>
                              {field.value}
                          </Typography>
                            <Button
                              variant="outlined"
                            size="small"
                              onClick={() => field.setter(field.value + 1)}
                              sx={{ 
                                minWidth: '32px', 
                                height: '32px', 
                                borderRadius: '50%',
                                border: '1px solid #ccc',
                                p: 0
                              }}
                            >
                              +
                          </Button>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Right Column - Home Details Illustration */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    minHeight: '400px'
                  }}>
                    <Box
                      sx={{
                        width: '400px',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        mb: 3
                      }}
                    >
                      <img 
                        src="/home-details-1.png" 
                        alt="Home details illustration" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
        </Box>
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (homeType && squareFootage && yearBuilt) {
                        goNext();
                      } else {
                        alert('Please fill in Home type, Square footage, and Year built to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Step 5: Property Features & Amenities */}
            {listingStep === 5 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                {/* Left Column - Property Features Form */}
                <Box sx={{ flex: 1, maxWidth: '500px' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: brandColors.primary,
                      mb: 2
                    }}
                  >
                    Property Features & Amenities
          </Typography>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.secondary',
                      mb: 4,
                      fontWeight: 400
                    }}
                  >
                    Tell us about your home's special features and parking options
          </Typography>

                  <Box sx={{ mb: 4 }}>
                    {/* Pool Section */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                        Pool & Water Features
                          </Typography>
                      <Select
                        fullWidth
                        value={selectedPoolType || ''}
                        onChange={(e) => setSelectedPoolType(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="medium"
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="" disabled>
                          Select pool type
                        </MenuItem>
                        <MenuItem value="no">No pool</MenuItem>
                        <MenuItem value="in-ground">In-ground pool</MenuItem>
                        <MenuItem value="above-ground">Above ground pool</MenuItem>
                        <MenuItem value="community">Community pool access</MenuItem>
                        <MenuItem value="hot-tub">Hot tub/spa</MenuItem>
                      </Select>
                    </Box>

                    {/* Parking Section */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                        Parking & Garage
                          </Typography>
                      
                      {/* Parking Type */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                          Primary parking type
                        </Typography>
                        <Select
                          fullWidth
                          value={parkingType || ''}
                          onChange={(e) => setParkingType(e.target.value)}
                          displayEmpty
                          variant="outlined"
                          size="medium"
                        >
                          <MenuItem value="" disabled>
                            Select parking type
                          </MenuItem>
                          <MenuItem value="garage-attached">Garage (Attached)</MenuItem>
                          <MenuItem value="garage-detached">Garage (Detached)</MenuItem>
                          <MenuItem value="carport">Carport</MenuItem>
                          <MenuItem value="street">Street Parking</MenuItem>
                          <MenuItem value="driveway">Driveway</MenuItem>
                          <MenuItem value="none">No Parking</MenuItem>
                        </Select>
                      </Box>

                      {/* Parking Spaces */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          Number of covered parking spaces
                        </Typography>
                        {[
                          { label: 'Garage Spaces', value: garageSpaces, setter: setGarageSpaces },
                          { label: 'Carport Spaces', value: carportSpaces, setter: setCarportSpaces }
                        ].map((field) => (
                          <Box key={field.label} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            mb: 2 
                          }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                              {field.label}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Button
                                variant="outlined"
                            size="small"
                                onClick={() => field.setter(Math.max(0, field.value - 1))}
                                sx={{ 
                                  minWidth: '32px', 
                                  height: '32px', 
                                  borderRadius: '50%',
                                  border: '1px solid #ccc',
                                  p: 0
                                }}
                              >
                                -
                              </Button>
                              <Typography variant="body1" sx={{ 
                                minWidth: '20px', 
                                textAlign: 'center',
                                fontWeight: 500
                              }}>
                                {field.value}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => field.setter(field.value + 1)}
                                sx={{ 
                                  minWidth: '32px', 
                                  height: '32px', 
                                  borderRadius: '50%',
                                  border: '1px solid #ccc',
                                  p: 0
                                }}
                              >
                                +
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Heating & Cooling Section */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                        Heating & Cooling Systems
                      </Typography>
                      <Select
                        fullWidth
                        value={heatingCooling || ''}
                        onChange={(e) => setHeatingCooling(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="medium"
                      >
                        <MenuItem value="" disabled>
                          Select system type
                        </MenuItem>
                        <MenuItem value="central">Central Air/Heat</MenuItem>
                        <MenuItem value="window-units">Window Units</MenuItem>
                        <MenuItem value="baseboard">Baseboard Heat</MenuItem>
                        <MenuItem value="radiant">Radiant Heat</MenuItem>
                        <MenuItem value="heat-pump">Heat Pump</MenuItem>
                        <MenuItem value="mini-split">Mini-Split System</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                      </Select>
                    </Box>

                    {/* Additional Features Section */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                        Additional Property Features
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {[
                          { label: 'Fireplace', value: hasFireplace, setter: setHasFireplace },
                          { label: 'Deck/Patio', value: hasDeckPatio, setter: setHasDeckPatio },
                          { label: 'Fenced Yard', value: hasFencedYard, setter: setHasFencedYard }
                        ].map((feature) => (
                          <FormControlLabel
                            key={feature.label}
                            control={
                              <Checkbox
                                checked={feature.value}
                                onChange={(e) => feature.setter(e.target.checked)}
                                sx={{ color: brandColors.primary }}
                              />
                            }
                            label={feature.label}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                {/* Right Column - Home Details Illustration 2 */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'flex-start', 
                  alignItems: 'center',
                  minHeight: '400px'
                }}>
                  <Box
                    sx={{
                      width: '400px',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 3
                    }}
                  >
                    <img 
                      src="/home-details-2.png" 
                      alt="Home details illustration 2" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (selectedPoolType && parkingType && heatingCooling) {
                        goNext();
                      } else {
                        alert('Please complete all required fields to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Step 6: Basement Details Form */}
            {listingStep === 6 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                {/* Left Column - Basement Details Form */}
                <Box sx={{ flex: 1, maxWidth: '500px' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: brandColors.primary,
                      mb: 2
                    }}
                  >
                    Does your home have a basement?
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    {/* Basement Presence */}
                    <RadioGroup
                      value={hasBasement || ''}
                      onChange={(e) => setHasBasement(e.target.value)}
                      sx={{ mb: 3 }}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Yes"
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="No"
                        sx={{ mb: 1 }}
                      />
                    </RadioGroup>

                    {/* Basement Condition - Only show if basement exists */}
                    {hasBasement === 'yes' && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                          Basement condition
                    </Typography>
                        <Select
                          fullWidth
                          value={basementCondition || ''}
                          onChange={(e) => setBasementCondition(e.target.value)}
                          displayEmpty
                          variant="outlined"
                          size="medium"
                        >
                          <MenuItem value="" disabled>
                            Select condition
                          </MenuItem>
                          <MenuItem value="not-functional">Not Functional</MenuItem>
                          <MenuItem value="for-storage">For Storage</MenuItem>
                          <MenuItem value="fully-functional">Fully Functional and Furnishable</MenuItem>
                        </Select>
                      </Box>
                    )}

                    {/* Basement Square Footage - Only show if basement exists */}
                    {hasBasement === 'yes' && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                          Do you know the square footage of the basement?
                    </Typography>
                        
                        <RadioGroup
                          value={knowsBasementSqft || ''}
                          onChange={(e) => setKnowsBasementSqft(e.target.value)}
                          sx={{ mb: 2 }}
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label="Yes"
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label="No"
                            sx={{ mb: 1 }}
                          />
                        </RadioGroup>

                        {/* Square Footage Inputs - Only show if user knows the footage */}
                        {knowsBasementSqft === 'yes' && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                              What's the square footage of the basement?
                    </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                              It's okay to estimate.
                    </Typography>
                            
                            <TextField
                              fullWidth
                              placeholder="Finished area (sqft)"
                              value={basementFinishedSqft}
                              onChange={(e) => setBasementFinishedSqft(e.target.value)}
                              variant="outlined"
                              size="medium"
                              sx={{ mb: 2 }}
                            />
                            
                            <TextField
                              fullWidth
                              placeholder="Unfinished area (sqft)"
                              value={basementUnfinishedSqft}
                              onChange={(e) => setBasementUnfinishedSqft(e.target.value)}
                              variant="outlined"
                              size="medium"
                            />
                  </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
                
                {/* Right Column - Home Details Illustration 3 */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'flex-start', 
                  alignItems: 'center',
                  minHeight: '400px'
                }}>
                  <Box
                    sx={{
                      width: '400px',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 3
                    }}
                  >
                    <img 
                      src="/home-details-3.png" 
                      alt="Home details illustration 3" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (hasBasement) {
                        if (hasBasement === 'yes' && (!basementCondition || !knowsBasementSqft)) {
                          alert('Please complete the basement details to continue');
                        } else if (hasBasement === 'yes' && knowsBasementSqft === 'yes' && (!basementFinishedSqft || !basementUnfinishedSqft)) {
                          alert('Please enter the basement square footage to continue');
                        } else {
                          goNext();
                        }
                      } else {
                        alert('Please select whether your home has a basement to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
        </Box>
              </>
            )}

            {/* Step 7: Property Quality Assessment */}
            {listingStep === 7 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100%',
                maxWidth: '1000px', 
                mx: 'auto' 
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: brandColors.primary,
                    mb: 4,
                    textAlign: 'center'
                  }}
                >
                  Property Quality Assessment
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    textAlign: 'center',
                    fontWeight: 400
                  }}
                >
                  Rate the quality of different areas of your property
                </Typography>

                {/* Exterior Quality */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Exterior Quality
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={selectedExteriorDescription}
                      onChange={(e) => setSelectedExteriorDescription(e.target.value)}
                    >
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2
                      }}>
                        {[
                          { label: 'Fixer upper', subtitle: 'Needs significant repairs', value: 'fixer-upper' },
                          { label: 'Dated', subtitle: 'Hasn\'t been updated recently', value: 'dated' },
                          { label: 'Standard', subtitle: 'Updated with common finishes', value: 'standard' },
                          { label: 'High-end', subtitle: 'High-quality upgrades', value: 'high-end' },
                          { label: 'Luxury', subtitle: 'Elegant, top-tier finishes', value: 'luxury' },
                        ].map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                                  {option.subtitle}
                      </Typography>
                    </Box>
                            }
                            sx={{ 
                              alignItems: 'flex-start', 
                              m: 0,
                              p: 2,
                              border: '1px solid #e0e0e0',
                              borderRadius: 1,
                              '&:hover': { borderColor: brandColors.primary }
                            }}
                          />
                        ))}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* Living Room Quality */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Living Room Quality
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={selectedLivingRoomDescription}
                      onChange={(e) => setSelectedLivingRoomDescription(e.target.value)}
                    >
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2
                      }}>
                        {[
                          { label: 'Fixer upper', subtitle: 'Needs significant repairs', value: 'fixer-upper' },
                          { label: 'Dated', subtitle: 'Hasn\'t been updated recently', value: 'dated' },
                          { label: 'Standard', subtitle: 'Updated with common finishes', value: 'standard' },
                          { label: 'High-end', subtitle: 'High-quality upgrades', value: 'high-end' },
                          { label: 'Luxury', subtitle: 'Elegant, top-tier finishes', value: 'luxury' },
                        ].map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                                  {option.subtitle}
                      </Typography>
                    </Box>
                            }
                            sx={{ 
                              alignItems: 'flex-start', 
                              m: 0,
                              p: 2,
                              border: '1px solid #e0e0e0',
                              borderRadius: 1,
                              '&:hover': { borderColor: brandColors.primary }
                            }}
                          />
                        ))}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* Main Bathroom Quality */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Main Bathroom Quality
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={selectedMainBathroomDescription}
                      onChange={(e) => setSelectedMainBathroomDescription(e.target.value)}
                    >
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2
                      }}>
                        {[
                          { label: 'Fixer upper', subtitle: 'Needs significant repairs', value: 'fixer-upper' },
                          { label: 'Dated', subtitle: 'Hasn\'t been updated recently', value: 'dated' },
                          { label: 'Standard', subtitle: 'Updated with common finishes', value: 'standard' },
                          { label: 'High-end', subtitle: 'High-quality upgrades', value: 'high-end' },
                          { label: 'Luxury', subtitle: 'Elegant, top-tier finishes', value: 'luxury' },
                        ].map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                                  {option.subtitle}
                      </Typography>
                    </Box>
                            }
                            sx={{ 
                              alignItems: 'flex-start', 
                              m: 0,
                              p: 2,
                              border: '1px solid #e0e0e0',
                              borderRadius: 1,
                              '&:hover': { borderColor: brandColors.primary }
                            }}
                          />
                        ))}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* Kitchen Quality */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Kitchen Quality
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={selectedKitchenDescription}
                      onChange={(e) => setSelectedKitchenDescription(e.target.value)}
                    >
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2
                      }}>
                        {[
                          { label: 'Fixer upper', subtitle: 'Needs significant repairs', value: 'fixer-upper' },
                          { label: 'Dated', subtitle: 'Hasn\'t been updated recently', value: 'dated' },
                          { label: 'Standard', subtitle: 'Updated with common finishes', value: 'standard' },
                          { label: 'High-end', subtitle: 'High-quality upgrades', value: 'high-end' },
                          { label: 'Luxury', subtitle: 'Elegant, top-tier finishes', value: 'luxury' },
                        ].map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                                  {option.subtitle}
                      </Typography>
                    </Box>
                            }
                            sx={{ 
                              alignItems: 'flex-start', 
                              m: 0,
                              p: 2,
                              border: '1px solid #e0e0e0',
                              borderRadius: 1,
                              '&:hover': { borderColor: brandColors.primary }
                            }}
                          />
                        ))}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 'auto',
                  pt: 4,
                  gap: 2
                }}>
                  <Button
                    variant="outlined"
                    onClick={goBack}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (selectedExteriorDescription && selectedLivingRoomDescription && 
                          selectedMainBathroomDescription && selectedKitchenDescription) {
                        goNext();
                      } else {
                        alert('Please complete all quality assessments to continue.');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 8: Kitchen Countertops Form */}
            {listingStep === 8 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                {/* Left Column - Kitchen Countertops Form */}
                <Box sx={{ flex: 1, maxWidth: '500px' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: brandColors.primary,
                      mb: 4
                    }}
                  >
                    What type of countertops are in the kitchen?
                </Typography>
                  
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      aria-label="kitchen-countertops"
                      name="kitchen-countertops-radio-group"
                      value={selectedCountertopType}
                      onChange={(e) => setSelectedCountertopType(e.target.value)}
                    >
                      <FormControlLabel
                        value="solid-stone-slab"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Solid stone slab (granite, quartz, marble)"
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        value="engineered-quartz"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Engineered quartz (Caesarstone, Silestone)"
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        value="granite-tile"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Granite tile"
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        value="corian"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Corian"
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        value="laminate-formica"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Laminate/formica"
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        value="other-tile"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="Other tile"
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        value="none-above"
                        control={<Radio sx={{ color: brandColors.primary }} />}
                        label="None of the above"
                        sx={{ mb: 2 }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                
                {/* Right Column - Additional Info Illustration */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'flex-start', 
                  alignItems: 'center',
                  minHeight: '400px'
                }}>
                  <Box
                    sx={{
                      width: '400px',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 3
                    }}
                  >
                    <img 
                      src="/Additional Info.png" 
                      alt="Kitchen countertops illustration" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (selectedCountertopType) {
                        goNext();
                      } else {
                        alert('Please select a countertop type to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}



            {/* Step 9: HOA and Community Features Form */}
            {listingStep === 9 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                {/* Left Column - HOA and Community Features Form */}
                <Box sx={{ flex: 1, maxWidth: '500px' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: brandColors.primary,
                      mb: 4
                    }}
                  >
                    Is your home part of a home owner's association (HOA)?
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    {/* HOA Question */}
                    <Box sx={{ mb: 3 }}>
                      <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                          value={isHOA || ''}
                          onChange={(e) => setIsHOA(e.target.value)}
                          row
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label="Yes"
                            sx={{ mr: 4 }}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio sx={{ color: brandColors.primary }} />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    {/* Community Features - Only show if HOA exists */}
                    {isHOA === 'yes' && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'text.primary',
                            mb: 2,
                            fontWeight: 600
                          }}
                        >
                          Do any of these apply to your home?
                  </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isAgeRestricted === 'yes'}
                                onChange={(e) => setIsAgeRestricted(e.target.checked ? 'yes' : 'no')}
                                sx={{ color: brandColors.primary }}
                              />
                            }
                            label="Age-restricted community"
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isGatedCommunity === 'yes'}
                                onChange={(e) => setIsGatedCommunity(e.target.checked ? 'yes' : 'no')}
                                sx={{ color: brandColors.primary }}
                              />
                            }
                            label="Gated community"
                            sx={{ mb: 1 }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            color: 'text.primary',
                            mb: 2,
                            fontWeight: 600
                          }}
                        >
                          Is there a guard at the entrance?
                  </Typography>
                        
                        <FormControl component="fieldset" fullWidth>
                          <RadioGroup
                            value={hasGuardAtEntrance || ''}
                            onChange={(e) => setHasGuardAtEntrance(e.target.value)}
                            row
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio sx={{ color: brandColors.primary }} />}
                              label="Yes"
                              sx={{ mr: 4 }}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio sx={{ color: brandColors.primary }} />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </>
                    )}
                </Box>
                </Box>
                
                {/* Right Column - Additional Info-2 Illustration */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'flex-start', 
                  alignItems: 'center',
                  minHeight: '400px'
                }}>
                  <Box
                    sx={{
                      width: '400px',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 3
                    }}
                  >
                    <img 
                      src="/Additional Info-2.png" 
                      alt="HOA and community features illustration" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (isHOA) {
                        goNext();
                      } else {
                        alert('Please select whether your home is part of an HOA to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}





            {/* Step 10: Additional Information Form */}
            {listingStep === 10 && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  flex: 1
                }}>
                {/* Left Column - Additional Information Form */}
                <Box sx={{ flex: 1, maxWidth: '500px' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: brandColors.primary,
                      mb: 2
                    }}
                  >
                    To the best of your knowledge, do any of these apply to your home?
        </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 4,
                      fontStyle: 'italic'
                    }}
                  >
                    Select all that apply.
                  </Typography>
                  
                  <FormControl component="fieldset" fullWidth>
                    {/* Property Systems & Infrastructure */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        Property Systems & Infrastructure
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.septicSystem}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                septicSystem: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Septic system"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.cesspoolOnProperty}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                cesspoolOnProperty: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Cesspool on property"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.undergroundFuelOilTanks}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                undergroundFuelOilTanks: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Underground fuel oil tanks"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.leasedSolarPanels}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                leasedSolarPanels: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Leased or financed solar panels"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>

                    {/* Property Condition & Issues */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        Property Condition & Issues
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.foundationIssues}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                foundationIssues: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Foundation issues"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.fireDamage}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                fireDamage: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Fire damage"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.asbestosSiding}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                asbestosSiding: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Asbestos siding"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>

                    {/* Property Type & Features */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        Property Type & Features
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.horseProperty}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                horseProperty: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Horse property"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.mobileManufacturedHome}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                mobileManufacturedHome: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Mobile or manufactured home"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>

                    {/* Ownership & Legal */}
                    <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        Ownership & Legal
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.uniqueOwnershipStructure}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                uniqueOwnershipStructure: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Unique ownership structure"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.bmrOwnershipProgram}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                bmrOwnershipProgram: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Part of a Below Market Rate (BMR) Ownership Program"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.rentControlledWithTenant}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                rentControlledWithTenant: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Rent-controlled and has a tenant"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>

                    {/* General Options */}
                    <Box sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: brandColors.primary, fontWeight: 600 }}>
                        General Options
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.noneOfThese}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                noneOfThese: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="None of these apply to my home"
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={additionalInfo.other}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                other: e.target.checked
                              }))}
                              sx={{ color: brandColors.primary }}
                            />
                          }
                          label="Other"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>
                  </FormControl>
                </Box>
                
                {/* Right Column - Additional Info-3 Illustration */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'flex-start', 
                  alignItems: 'center',
                  minHeight: '400px'
                }}>
                  <Box
                    sx={{
                      width: '400px',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 3
                    }}
                  >
                    <img 
                      src="/Additional Info-3.png" 
                      alt="Additional information illustration" 
                      style={{
                        width: '100%',
                height: '100%', 
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      goNext();
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}



            {/* Step 11: Name Collection Form */}
            {listingStep === 11 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100%',
                maxWidth: '500px', 
                mx: 'auto',
                p: 3
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: brandColors.primary,
                    mb: 4,
                    textAlign: 'center'
                  }}
                >
                  What's your name?
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  {/* First Name Input */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                      First name
                    </Typography>
                    <TextField
                      fullWidth
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      variant="outlined"
                      size="medium"
                      placeholder="Enter your first name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: brandColors.primary,
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Last Name Input */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                      Last name
                    </Typography>
                    <TextField
                      fullWidth
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      variant="outlined"
                      size="medium"
                      placeholder="Enter your last name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: brandColors.primary,
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Navigation Buttons - Bottom of content space */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: 2,
                  mt: 'auto',
                  pt: 4
                }}>
                  {/* Back Button - Bottom Left */}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={goBack}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {/* Next Button - Bottom Right */}
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      if (firstName.trim() && lastName.trim()) {
                        goNext();
                      } else {
                        alert('Please enter both your first name and last name to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}





            {/* Step 12: Phone Number Collection Form */}
            {listingStep === 12 && (
              <Box sx={{ maxWidth: '600px', mx: 'auto', p: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: brandColors.primary,
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  What's your phone number?
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    textAlign: 'center',
                    lineHeight: 1.5
                  }}
                >
                  We'll send you a text so you can get help when you're ready. You don't need to reply.
                </Typography>

                {/* Phone Input Field */}
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    variant="outlined"
                    size="medium"
                    placeholder="Phone"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                    fontSize: '1.1rem',
                        '&.Mui-focused fieldset': {
                          borderColor: brandColors.primary,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Legal Disclaimer */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '0.875rem'
                    }}
                  >
                    By tapping "Next", you agree that Dreamery Group and its affiliates, and other real estate professionals may call/text you about your inquiry, which may involve use of automated means and prerecorded/artificial voices.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '0.875rem',
                      mt: 2
                    }}
                  >
                    You don't need to consent as a condition of buying any property, goods or services. Message/data rates may apply.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '0.875rem',
                      mt: 2
                    }}
                  >
                    You also agree to our{' '}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color: brandColors.primary,
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Terms of Use
                    </Box>
                    . We may share information about your recent and future site activity with your agent to help them understand what you're looking for in a home.
                  </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                                          onClick={goBack}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      '&:hover': { 
                        borderColor: brandColors.secondary,
                        backgroundColor: 'rgba(26, 54, 93, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (phoneNumber.trim()) {
                                                  goNext();
                      } else {
                        alert('Please enter your phone number to continue');
                      }
                    }}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                    '&:hover': { backgroundColor: brandColors.secondary }
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
            )}

            {/* Step 13: Review Your Information */}
            {listingStep === 13 && (
              <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: brandColors.primary,
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  Review Your Information
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    textAlign: 'center',
                    lineHeight: 1.5
                  }}
                >
                  Please review all the information below. You can edit any section by clicking the edit icon.
                </Typography>

                {/* Property Information Section */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 3,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                    Property Information
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Property Address:</strong> {propertyAddress || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Sell Property:</strong> {sellChecked ? 'true' : 'false'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>List Property:</strong> {listChecked ? 'true' : 'false'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                </Box>

                {/* Moving Details Section */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 3,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                    Moving Details
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Agent Relationship:</strong> {selectedSituation || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Timing:</strong> {selectedTimeline || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                </Box>

                {/* Home Details Section */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 3,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                    Home Details
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Home Type:</strong> {homeType || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Square Footage:</strong> {squareFootage || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Year Built:</strong> {yearBuilt || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Bedrooms:</strong> {bedrooms || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Full Bathrooms:</strong> {fullBathrooms || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Floors:</strong> {floorsAboveGround || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Pool Type:</strong> {selectedPoolType || 'No'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Garage Spaces:</strong> {garageSpaces || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Carport Spaces:</strong> {carportSpaces || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Has Basement:</strong> {hasBasement || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                </Box>

                {/* Home Quality Section */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 3,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                    Home Quality
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Exterior Quality:</strong> {selectedExteriorDescription || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Living Room Quality:</strong> {selectedLivingRoomDescription || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Bathroom Quality:</strong> {selectedMainBathroomDescription || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Kitchen Quality:</strong> {selectedKitchenDescription || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                </Box>

                {/* Additional Information Section */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 3,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                    Additional Information
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Kitchen Countertops:</strong> {selectedCountertopType || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>HOA:</strong> {isHOA || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Property Conditions:</strong> {[
                        additionalInfo.leasedSolarPanels && 'Leased solar panels',
                        additionalInfo.foundationIssues && 'Foundation issues',
                        additionalInfo.fireDamage && 'Fire damage',
                        additionalInfo.septicSystem && 'Septic system',
                        additionalInfo.asbestosSiding && 'Asbestos siding',
                        additionalInfo.horseProperty && 'Horse property',
                        additionalInfo.mobileManufacturedHome && 'Mobile home',
                        additionalInfo.uniqueOwnershipStructure && 'Unique ownership',
                        additionalInfo.bmrOwnershipProgram && 'BMR program',
                        additionalInfo.rentControlledWithTenant && 'Rent controlled',
                        additionalInfo.undergroundFuelOilTanks && 'Fuel oil tanks',
                        additionalInfo.cesspoolOnProperty && 'Cesspool',
                        additionalInfo.other && 'Other'
                      ].filter(Boolean).join(', ') || 'none'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                </Box>

                {/* Contact Information Section */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 4,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>First Name:</strong> {firstName || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Last Name:</strong> {lastName || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Phone Number:</strong> {phoneNumber || 'Not provided'}
                    </Typography>
                    <React.Suspense fallback={<Box sx={{ width: 20, height: 20 }} />}>
                      <LazyEditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                    </React.Suspense>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                                          onClick={goBack}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                                          onClick={goNext}
                    sx={{
                      backgroundColor: brandColors.primary,
                      px: 4,
                      py: 1.5,
                      '&:hover': { backgroundColor: brandColors.secondary }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 14: Your Selling Options - Final Page */}
            {listingStep === 14 && (
              <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 3 }}>
                {/* Header Illustration */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                  component="img"
                    src="/final sell:list.png"
                    alt="Watercolor neighborhood illustration"
                    sx={{
                      width: '100%',
                      maxWidth: '600px',
                      height: 'auto',
                      borderRadius: 2,
                      mb: 3
                    }}
                  />
                </Box>

                {/* Main Title and Subtitle */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: brandColors.primary,
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {propertyAddress || 'Your Property'} Your selling options
                  </Typography>
                  
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    textAlign: 'center',
                    lineHeight: 1.5
                  }}
                >
                  Here are your tailored selling options (based on the info you provided).
                  </Typography>
                  
                {/* Dreamery Listing Card */}
                <Box sx={{ 
                  backgroundColor: 'white', 
                  p: 4, 
                  borderRadius: 3, 
                  mb: 4,
                  border: '2px solid #e9ecef',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: brandColors.primary, 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                        <LazyHomeIcon sx={{ fontSize: 24, color: 'white' }} />
                      </React.Suspense>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.primary }}>
                      DREAMERY
                    </Typography>
                  </Box>
                  
                  <Typography variant="h2" sx={{ 
                    fontWeight: 700, 
                    color: '#4caf50', 
                    mb: 1 
                  }}>
                    $782,148
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    Updated Aug 15, 2025
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Maximize sales price
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Have any questions? Speak to a Dreamery specialist.
                      </Typography>
                    </Box>

                {/* How it works Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: brandColors.primary, 
                    mb: 2 
                  }}>
                    How it works
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Connect with a local Dreamery partner agent and get a Showcase listing at no additional cost. Sell when you're ready.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
                    gap: 2 
                  }}>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Get prime exposure on Dreamery resulting in <strong>75% more views</strong>.
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Helps maximize your sale price by reaching more buyers on Dreamery.
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Sell for <strong>2% more</strong> when using a premium Showcase listing.
                      </Typography>
                    </Box>
                    </Box>
                  </Box>
                  
                {/* Get Showcase for free Card */}
                <Box sx={{ 
                  backgroundColor: 'white', 
                  p: 4, 
                  borderRadius: 3, 
                  mb: 4,
                  border: '2px solid #e9ecef',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: brandColors.primary, 
                    mb: 3 
                  }}>
                    Get Showcase for free when you sell with a Dreamery partner agent
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Features included in a Showcase listing:
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        {[
                          'Higher search ranking',
                          'High resolution photos',
                          'Interactive floor plan',
                          'AI-powered virtual tours'
                        ].map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              backgroundColor: brandColors.primary, 
                              borderRadius: '50%', 
                              mr: 2 
                            }} />
                            <Typography variant="body1">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      backgroundColor: '#f8f9fa', 
                      p: 3, 
                      borderRadius: 2,
                      border: '1px solid #e9ecef'
                    }}>
                      <Box sx={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        px: 2, 
                        py: 0.5, 
                        borderRadius: 1, 
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        Showcase
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 120, 
                        backgroundColor: '#e9ecef', 
                        borderRadius: 1, 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary'
                      }}>
                        [Image Placeholder]
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        3 bds | 3 ba | 3,240 sqft - Active
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        255 Mathewson PI SW Atlanta, GA
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                        backgroundColor: brandColors.primary,
                        px: 4,
                        py: 1.5,
                        '&:hover': { backgroundColor: brandColors.secondary }
                      }}
                    >
                      Find out more
                  </Button>
                  </Box>
                </Box>

                {/* Estimated costs and fees Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: brandColors.primary, 
                    mb: 3 
                  }}>
                    Estimated costs and fees
                  </Typography>
                  
                  <Box sx={{ 
                    backgroundColor: 'white', 
                    p: 3, 
                    borderRadius: 2,
                    border: '1px solid #e9ecef'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">
                        <strong>Est. market value:</strong>
                      </Typography>
                      <Typography variant="body1">$582,148 - $982,148</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">
                        <strong>Est. agent fees (3 - 6%):</strong>
                      </Typography>
                      <Typography variant="body1">$23,464 - $46,929</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">
                        <strong>Closing costs (1%):</strong>
                      </Typography>
                      <Typography variant="body1">$7,821</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="body1">
                        <strong>Repair costs:</strong>
                      </Typography>
                      <Typography variant="body1">Pending walkthrough</Typography>
                    </Box>
                    
                    <Box sx={{ 
                      borderTop: '2px solid #e9ecef', 
                      pt: 2, 
                      textAlign: 'center' 
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#4caf50', 
                        mb: 2 
                      }}>
                        Estimated cash proceeds: $727,398 - $750,863
                      </Typography>
                      
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: brandColors.primary,
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: brandColors.secondary }
                        }}
                      >
                        Find out more
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Why choose Dreamery Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: brandColors.primary, 
                    mb: 3 
                  }}>
                    Why choose Dreamery?
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 2 
                  }}>
                    {[
                      'Trusted by millions of homeowners nationwide',
                      'Local expertise with national reach',
                      'Transparent pricing and no hidden fees',
                      'Dedicated support throughout your selling journey'
                    ].map((benefit, index) => (
                      <Box key={index} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="body1">{benefit}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Next steps Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: brandColors.primary, 
                    mb: 3 
                  }}>
                    Next steps
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 2 
                  }}>
                    {[
                      'Connect with your local Dreamery partner agent',
                      'Schedule a free home evaluation',
                      'Get your personalized selling strategy',
                      'List your home with maximum exposure'
                    ].map((step, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 2 
                      }}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          backgroundColor: brandColors.primary, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          mr: 2
                        }}>
                          {index + 1}
                        </Box>
                        <Typography variant="body1">{step}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Limited time offer Card */}
                <Box sx={{ 
                  backgroundColor: '#fff3cd', 
                  p: 4, 
                  borderRadius: 3, 
                  mb: 4,
                  border: '2px solid #ffeaa7'
                }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: brandColors.primary, 
                    mb: 3 
                  }}>
                    Limited time offer
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Get your Showcase listing completely free when you sell with a Dreamery partner agent. This premium feature normally costs $299 and includes:
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {[
                      'Higher search ranking in results',
                      'High resolution professional photos',
                      'Interactive floor plan',
                      'AI-powered virtual tours'
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          backgroundColor: brandColors.primary, 
                          borderRadius: '50%', 
                          mr: 2 
                        }} />
                        <Typography variant="body1">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                                          onClick={goBack}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#6c757d',
                      px: 4,
                      py: 1.5,
                      '&:hover': { backgroundColor: '#5a6268' }
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            )}
              </Box>
            )}

            {listingTab === 'photos' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Photos
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Property Photos</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Upload and manage property photos for your listing.
                  </Typography>
                </Paper>
              </Box>
            )}

            {listingTab === 'description' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Description
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Property Description</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Write compelling descriptions to attract potential tenants.
                  </Typography>
                </Paper>
              </Box>
            )}

            {listingTab === 'pricing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Pricing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Rent Pricing</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Set competitive rent prices based on market analysis.
                  </Typography>
                </Paper>
              </Box>
            )}

            {listingTab === 'marketing-strategy' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Marketing Strategy
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Marketing Channels</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Plan your marketing approach across different platforms.
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'listings':
        return (
          <Box>
            {renderTabs(listingsTabs, listingsTab, setListingsTab)}
            
            {listingsTab === 'property-listings' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Property Listings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Active Listings</Typography>
                      <Typography variant="h4" color="success.main">8</Typography>
                      <Typography variant="body2" color="text.secondary">Currently available</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Pending</Typography>
                      <Typography variant="h4" color="warning.main">3</Typography>
                      <Typography variant="body2" color="text.secondary">Under review</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Archived</Typography>
                      <Typography variant="h4" color="text.secondary">12</Typography>
                      <Typography variant="body2" color="text.secondary">Previously listed</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {listingsTab === 'market-analysis' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Market Analysis
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Market Trends</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Average Rent in Area</Typography>
                      <Typography variant="h4" color="primary">$1,850</Typography>
                      <Typography variant="body2" color="text.secondary">+5% from last quarter</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Days on Market</Typography>
                      <Typography variant="h4" color="info.main">12</Typography>
                      <Typography variant="body2" color="text.secondary">Average for similar properties</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            {listingsTab === 'pricing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Pricing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Rent Pricing Strategy</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 1A - $1,800/month"
                        secondary="Market rate: $1,850"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 2B - $1,950/month"
                        secondary="Premium pricing for renovated unit"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3C - $1,700/month"
                        secondary="Competitive pricing for quick lease"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {listingsTab === 'availability' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Availability
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Unit Availability</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Available Now</Typography>
                      <Typography variant="h4" color="success.main">5</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Available Soon</Typography>
                      <Typography variant="h4" color="warning.main">3</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            {listingsTab === 'marketing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Marketing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Marketing Channels</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Zillow"
                        secondary="Active - 8 listings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Apartments.com"
                        secondary="Active - 8 listings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Rent.com"
                        secondary="Active - 6 listings"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'messages':
        return (
          <Box>
            {renderTabs(messagesTabs, messagesTab, setMessagesTab)}
            
            {messagesTab === 'tenant-communication' && (
              <Box sx={{ 
                height: 'calc(100vh - 240px)', // Account for header, banner, and padding
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
                  minHeight: 0 // Allow flex children to shrink
                }}>
                  {/* Conversation List */}
                  <Box sx={{ 
                    width: isMobile ? '100%' : 320, 
                    minWidth: isMobile ? 'auto' : 320, 
                    maxWidth: isMobile ? '100%' : 320,
                    borderRight: isMobile ? 'none' : `1px solid ${brandColors.borders.secondary}`, 
                    display: showConversationList ? 'flex' : 'none',
                    flexShrink: 0,
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}>
                    <ConversationList
                      conversations={mockConversations}
                      selectedConversationId={selectedConversationId}
                      onConversationSelect={handleConversationSelect}
                      onBackToList={isMobile ? handleBackToList : undefined}
                    />
                  </Box>
                  
                  {/* Chat Interface */}
                  <Box sx={{ 
                    flex: 1, 
                    minWidth: 0, // Allow flex item to shrink below content size
                    borderRight: isMobile || !showDetailsPanel ? 'none' : `1px solid ${brandColors.borders.secondary}`, 
                    display: selectedConversation ? 'flex' : 'none',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}>
                    <ChatInterface
                      conversation={selectedConversation}
                      messages={conversationMessages}
                      onSendMessage={handleSendMessage}
                      onTranslationToggle={handleTranslationToggle}
                      translationEnabled={translationEnabled}
                      onBackToList={isMobile ? handleBackToList : undefined}
                      onShowDetails={handleShowDetails}
                      isMobile={isMobile}
                    />
                  </Box>
                  
                  {/* Details Panel */}
                  <Box sx={{ 
                    width: isMobile ? '100%' : 320, 
                    minWidth: isMobile ? 'auto' : 320,
                    maxWidth: isMobile ? '100%' : 320,
                    display: showDetailsPanel ? 'flex' : 'none',
                    flexShrink: 0,
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}>
                    <DetailsPanel
                      userDetails={selectedConversation ? {
                        id: selectedConversation.id,
                        name: selectedConversation.contactName,
                        organization: selectedConversation.organization,
                        role: selectedConversation.role,
                        initials: selectedConversation.initials,
                        joinDate: selectedConversation.joinDate,
                        verificationStatus: selectedConversation.verificationStatus,
                        contactDate: selectedConversation.dateOfContact,
                        topicOfDiscussion: selectedConversation.topicOfDiscussion,
                      } : undefined}
                      onBackToList={isMobile ? handleBackToList : undefined}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {messagesTab === 'maintenance-requests' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Maintenance Requests
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Open Requests</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Kitchen Sink Leak - Unit 2A"
                        secondary="Submitted 2 hours ago - Urgent"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Heating Issue - Unit 1B"
                        secondary="Submitted 1 day ago - Normal"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Door Lock Problem - Unit 3C"
                        secondary="Submitted 2 days ago - Normal"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {messagesTab === 'notifications' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Notifications
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Notifications</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Rent Payment Received"
                        secondary="Unit 2B - $1,800 - 2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="New Lease Application"
                        secondary="Unit 3A - John Smith - 4 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Maintenance Completed"
                        secondary="Unit 1C - HVAC Repair - 6 hours ago"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {messagesTab === 'support' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Support
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Support Tickets</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Account Access Issue"
                        secondary="Ticket #12345 - In Progress"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Payment Processing Question"
                        secondary="Ticket #12344 - Resolved"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'earnings':
        return (
          <Box>
            {renderTabs(earningsTabs, earningsTab, setEarningsTab)}
            
            {earningsTab === 'revenue-tracking' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Revenue Tracking
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Total Revenue</Typography>
                      <Typography variant="h4" color="success.main">$45,200</Typography>
                      <Typography variant="body2" color="text.secondary">This month</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Growth Rate</Typography>
                      <Typography variant="h4" color="primary">+8.2%</Typography>
                      <Typography variant="body2" color="text.secondary">vs last month</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Average per Unit</Typography>
                      <Typography variant="h4" color="info.main">$1,885</Typography>
                      <Typography variant="body2" color="text.secondary">Monthly</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {earningsTab === 'rent-collection' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Rent Collection
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Collection Status</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Collected This Month</Typography>
                      <Typography variant="h4" color="success.main">$42,100</Typography>
                      <Typography variant="body2" color="text.secondary">93% of expected</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Outstanding</Typography>
                      <Typography variant="h4" color="warning.main">$3,100</Typography>
                      <Typography variant="body2" color="text.secondary">7% pending</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            {earningsTab === 'financial-performance' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Financial Performance
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Net Operating Income</Typography>
                      <Typography variant="h4" color="primary">$38,500</Typography>
                      <Typography variant="body2" color="text.secondary">After expenses</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Cash Flow</Typography>
                      <Typography variant="h4" color="success.main">$35,200</Typography>
                      <Typography variant="body2" color="text.secondary">Available for distribution</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {earningsTab === 'profit-analysis' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Profit Analysis
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Profit Margins</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Gross Profit Margin"
                        secondary="85.2% - Above industry average"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Net Profit Margin"
                        secondary="78.1% - Excellent performance"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Operating Margin"
                        secondary="82.3% - Strong operational efficiency"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'insights':
        return (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
              Insights Component - Tabs Test
            </Typography>
            
            {/* Direct tabs test */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, backgroundColor: 'white' }}>
              <Tabs 
                value={insightsTab} 
                onChange={(e, newValue) => {
                  console.log('Insights tab changed to:', newValue);
                  setInsightsTab(newValue);
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Performance Analytics" value="performance-analytics" />
                <Tab label="Market Trends" value="market-trends" />
                <Tab label="Tenant Analytics" value="tenant-analytics" />
                <Tab label="Financial Reports" value="financial-reports" />
              </Tabs>
            </Box>
            
            {insightsTab === 'performance-analytics' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Performance Analytics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Portfolio Performance</Typography>
                      <Typography variant="h4" color="success.main">94.2%</Typography>
                      <Typography variant="body2" color="text.secondary">Overall efficiency score</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Occupancy Rate</Typography>
                      <Typography variant="h4" color="primary">96.8%</Typography>
                      <Typography variant="body2" color="text.secondary">Above market average</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {insightsTab === 'market-trends' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Market Trends
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Local Market Analysis</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Rent Growth Rate"
                        secondary="+5.2% year-over-year - Strong market"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Vacancy Rate"
                        secondary="3.1% - Below market average of 5.2%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Days on Market"
                        secondary="12 days - Fast leasing market"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {insightsTab === 'tenant-analytics' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Tenant Analytics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Average Tenancy</Typography>
                      <Typography variant="h4" color="info.main">28 months</Typography>
                      <Typography variant="body2" color="text.secondary">Stable tenant base</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Renewal Rate</Typography>
                      <Typography variant="h4" color="success.main">78%</Typography>
                      <Typography variant="body2" color="text.secondary">High satisfaction</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Payment On-Time</Typography>
                      <Typography variant="h4" color="success.main">94%</Typography>
                      <Typography variant="body2" color="text.secondary">Excellent payment history</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {insightsTab === 'financial-reports' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Financial Reports
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Available Reports</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Monthly Income Statement"
                        secondary="Download PDF - Last updated: Today"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Annual Performance Report"
                        secondary="Download PDF - Last updated: 1 week ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Tax Preparation Package"
                        secondary="Download ZIP - Last updated: 2 weeks ago"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'account':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Account Settings
                </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Manage your personal information, security settings, and preferences.
                  </Typography>
            
            {/* Sub-tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={accountSubTab} 
                onChange={(e, newValue) => setAccountSubTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5
                  },
                  '& .Mui-selected': {
                    color: brandColors.primary,
                    fontWeight: 600
                  }
                }}
              >
                {accountSubTabs.map((tab) => (
                  <Tab 
                    key={tab.id} 
                    value={tab.id} 
                    label={tab.label}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Sub-tab content */}
            {renderAccountSubContent()}
          </Box>
        );
      case 'leases':
        return (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
              Online Leases Component - Tabs Test
            </Typography>
            
            {/* Direct tabs test */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, backgroundColor: 'white' }}>
              <Tabs 
                value={leasesTab} 
                onChange={(e, newValue) => {
                  console.log('Leases tab changed to:', newValue);
                  setLeasesTab(newValue);
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Lease Management" value="lease-management" />
                <Tab label="Digital Signing" value="digital-signing" />
                <Tab label="Renewals" value="renewals" />
                <Tab label="Terms" value="terms" />
                <Tab label="Compliance" value="compliance" />
              </Tabs>
            </Box>
            
            {leasesTab === 'lease-management' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Lease Management
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Active Leases</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 1A - John Smith"
                        secondary="Lease expires: March 15, 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 2B - Sarah Johnson"
                        secondary="Lease expires: June 30, 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3C - Mike Davis"
                        secondary="Lease expires: December 1, 2024"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {leasesTab === 'digital-signing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Digital Signing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Pending Signatures</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 4A - New Lease"
                        secondary="Waiting for tenant signature - 2 days"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 1B - Renewal"
                        secondary="Waiting for landlord signature - 1 day"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {leasesTab === 'renewals' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Renewals
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Upcoming Renewals</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 2A - 30 days notice due"
                        secondary="Contact tenant for renewal decision"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3B - 60 days notice due"
                        secondary="Prepare renewal offer"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {leasesTab === 'terms' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Terms
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Standard Lease Terms</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Security Deposit"
                        secondary="1.5x monthly rent"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Pet Policy"
                        secondary="Allowed with additional deposit"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Late Fee"
                        secondary="$50 after 5-day grace period"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {leasesTab === 'compliance' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Compliance
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Compliance Status</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Fair Housing</Typography>
                      <Typography variant="h4" color="success.main">100%</Typography>
                      <Typography variant="body2" color="text.secondary">Compliant</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">State Regulations</Typography>
                      <Typography variant="h4" color="success.main">100%</Typography>
                      <Typography variant="body2" color="text.secondary">Compliant</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'applications':
        return (
          <Box>
            {renderTabs(applicationsTabs, applicationsTab, setApplicationsTab)}
            
            {applicationsTab === 'application-processing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Application Processing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Pending Applications</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3A - John Smith"
                        secondary="Submitted 2 days ago - Under review"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 1B - Sarah Johnson"
                        secondary="Submitted 1 week ago - Background check in progress"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 2C - Mike Davis"
                        secondary="Submitted 3 days ago - References pending"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {applicationsTab === 'tenant-screening' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Tenant Screening
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Screening Criteria</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Credit Score"
                        secondary="Minimum 650 required"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Income Verification"
                        secondary="3x monthly rent required"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Employment History"
                        secondary="2+ years stable employment"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {applicationsTab === 'background-checks' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Background Checks
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Check Status</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Criminal Background"
                        secondary="Completed - No issues found"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Credit Check"
                        secondary="Completed - Score: 720"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Previous Landlord"
                        secondary="In Progress - Contacting references"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {applicationsTab === 'approval' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Approval
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Approval Status</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Approved</Typography>
                      <Typography variant="h4" color="success.main">8</Typography>
                      <Typography variant="body2" color="text.secondary">This month</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Pending</Typography>
                      <Typography variant="h4" color="warning.main">3</Typography>
                      <Typography variant="body2" color="text.secondary">Under review</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Rejected</Typography>
                      <Typography variant="h4" color="error.main">1</Typography>
                      <Typography variant="body2" color="text.secondary">This month</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'payments':
        return (
          <Box>
            {renderTabs(paymentsTabs, paymentsTab, setPaymentsTab)}
            
            {paymentsTab === 'payment-processing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Payment Processing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Payment Methods</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Credit/Debit Cards"
                        secondary="Visa, Mastercard, American Express"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Bank Transfer (ACH)"
                        secondary="Direct from checking/savings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Digital Wallets"
                        secondary="PayPal, Apple Pay, Google Pay"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {paymentsTab === 'collection' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Collection
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Collected This Month</Typography>
                      <Typography variant="h4" color="success.main">$42,100</Typography>
                      <Typography variant="body2" color="text.secondary">93% of expected</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Outstanding</Typography>
                      <Typography variant="h4" color="warning.main">$3,100</Typography>
                      <Typography variant="body2" color="text.secondary">7% pending</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {paymentsTab === 'late-fees' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Late Fees
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Late Fee Policy</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Grace Period"
                        secondary="5 days after due date"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Late Fee Amount"
                        secondary="$50 per occurrence"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Additional Fees"
                        secondary="$25 per week after grace period"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {paymentsTab === 'financial-tracking' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Financial Tracking
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Payment Analytics</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">On-Time Rate</Typography>
                      <Typography variant="h4" color="success.main">94%</Typography>
                      <Typography variant="body2" color="text.secondary">Last 12 months</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Average Payment Time</Typography>
                      <Typography variant="h4" color="info.main">2.3 days</Typography>
                      <Typography variant="body2" color="text.secondary">After due date</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Collection Rate</Typography>
                      <Typography variant="h4" color="primary">98.5%</Typography>
                      <Typography variant="body2" color="text.secondary">Overall success</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'integrations':
        return (
          <Box>
            {renderTabs(integrationsTabs, integrationsTab, setIntegrationsTab)}
            
            {integrationsTab === 'third-party-services' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Third-party Services
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Connected Services</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="QuickBooks Online"
                        secondary="Accounting integration - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Zillow Rental Manager"
                        secondary="Listing syndication - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="DocuSign"
                        secondary="Digital signatures - Active"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {integrationsTab === 'payment-processors' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Payment Processors
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Payment Gateways</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Stripe"
                        secondary="Primary payment processor - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="PayPal"
                        secondary="Alternative payment method - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Square"
                        secondary="In-person payments - Inactive"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {integrationsTab === 'maintenance-vendors' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Maintenance Vendors
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Vendor Network</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Handy Pro"
                        secondary="General maintenance - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="TaskRabbit"
                        secondary="Quick fixes - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Local HVAC Company"
                        secondary="HVAC services - Active"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {integrationsTab === 'utilities' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Utilities
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Utility Connections</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Electric Company"
                        secondary="Bill tracking - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Water Department"
                        secondary="Usage monitoring - Active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Gas Company"
                        secondary="Bill tracking - Active"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'insurance':
        return (
          <Box>
            {renderTabs(insuranceTabs, insuranceTab, setInsuranceTab)}
            
            {insuranceTab === 'property-insurance' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Property Insurance
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Active Policies</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Building Insurance - State Farm"
                        secondary="Coverage: $500,000 - Expires: Dec 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Liability Insurance - Allstate"
                        secondary="Coverage: $1M - Expires: Mar 2025"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Flood Insurance - FEMA"
                        secondary="Coverage: $250,000 - Expires: Sep 2024"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {insuranceTab === 'coverage-management' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Coverage Management
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Total Coverage</Typography>
                      <Typography variant="h4" color="primary">$1.75M</Typography>
                      <Typography variant="body2" color="text.secondary">Across all policies</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Monthly Premium</Typography>
                      <Typography variant="h4" color="info.main">$2,450</Typography>
                      <Typography variant="body2" color="text.secondary">Total cost</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {insuranceTab === 'claims' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Claims
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Claims</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Water Damage - Unit 2A"
                        secondary="Claim #12345 - $3,200 - Approved"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="HVAC Repair - Building A"
                        secondary="Claim #12344 - $1,800 - Pending"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Storm Damage - Roof"
                        secondary="Claim #12343 - $5,500 - In Review"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {insuranceTab === 'risk-assessment' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Risk Assessment
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Risk Factors</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Property Age"
                        secondary="15 years - Moderate risk"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Location Risk"
                        secondary="Low crime area - Low risk"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Natural Disasters"
                        secondary="Flood zone - High risk"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a tab from the sidebar
                      </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Property Management" />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', mt: '64px' }}>
        {/* Left Sidebar */}
        <Paper 
          elevation={3} 
          sx={{ 
            width: 280, 
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Station Header */}
          <Box sx={{ px: 3, py: 2, mb: 1, flexShrink: 0 }}>
            <Box
              sx={{
                backgroundColor: '#1a365d',
                color: 'white',
                borderRadius: 2,
                py: 1.5,
                px: 2,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Station
                    </Box>
                  </Box>
                  
          {/* Sidebar Navigation */}
          <List sx={{ px: 2, pt: 0, flex: 1, overflow: 'auto' }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => setActiveTab(item.id)}
                  selected={activeTab === item.id}
                    sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: '#1a365d',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1a365d',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                      '& .MuiListItemText-primary': {
                        color: 'white',
                        fontWeight: 600,
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(26, 54, 93, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40,
                      color: activeTab === item.id ? 'white' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: activeTab === item.id ? 600 : 400,
                      color: activeTab === item.id ? 'white' : 'inherit'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: 3, backgroundColor: '#fafafa', overflow: 'auto' }}>
          <Container maxWidth="lg">
            {/* Top Banner (matches CloseBuyerPage) */}
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
                {getBannerIcon()}
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
                  {banner.title}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {banner.subtitle}
              </Typography>
            </Paper>

            <Box sx={{ padding: 2 }}>
              {renderContent()}
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default ManagePage; 