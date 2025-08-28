import React, { useState } from 'react';
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
  FormControl
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  AddHome as ListingIcon,
  Description as LeaseIcon,
  Assignment as ApplicationIcon,
  Payment as PaymentIcon,
  Settings as IntegrationIcon,
  Security as InsuranceIcon,
  Event as CalendarIcon,
  Chat as ChatIcon,
  MonetizationOn as EarningsIcon,
  Insights as InsightsIcon,
  Home as HomeIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';
import housesImage from '../houses-watercolor.png';

const ManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accountSubTab, setAccountSubTab] = useState('personal');
  
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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'listings', label: 'Listings', icon: <ListingIcon /> },
    { id: 'messages', label: 'Messages', icon: <ChatIcon /> },
    { id: 'earnings', label: 'Earnings', icon: <EarningsIcon /> },
    { id: 'insights', label: 'Insights', icon: <InsightsIcon /> },
    { id: 'listing', label: 'Creating a Listing', icon: <ListingIcon /> },
    { id: 'leases', label: 'Online Leases', icon: <LeaseIcon /> },
    { id: 'applications', label: 'Rental Applications', icon: <ApplicationIcon /> },
    { id: 'payments', label: 'Online Rent Payments', icon: <PaymentIcon /> },
    { id: 'integrations', label: 'Integrations', icon: <IntegrationIcon /> },
    { id: 'insurance', label: 'Insurance', icon: <InsuranceIcon /> },
    { id: 'account', label: 'Manage Your Account', icon: <AccountIcon /> }
  ];

  const accountSubTabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'security', label: 'Login & Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'payments', label: 'Payments' },
    { id: 'taxes', label: 'Taxes' }
  ];

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
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'calendar':
        return <CalendarIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'listing':
        return <ListingIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'listings':
        return <ListingIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'messages':
        return <ChatIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'earnings':
        return <EarningsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'insights':
        return <InsightsIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'account':
        return <AccountIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'leases':
        return <LeaseIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'applications':
        return <ApplicationIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'payments':
        return <PaymentIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'integrations':
        return <IntegrationIcon sx={{ fontSize: 28, color: 'white' }} />;
      case 'insurance':
        return <InsuranceIcon sx={{ fontSize: 28, color: 'white' }} />;
      default:
        return <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />;
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
            <Typography variant="h5" gutterBottom>
              Dashboard
                      </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to your property management dashboard.
                      </Typography>
          </Box>
        );
      case 'calendar':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Calendar
                      </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule view for tasks, inspections, rent due dates, and lease events.
                        </Typography>
          </Box>
        );
      case 'listing':
        return (
          <Box>
            {/* Listing Creation Form with Multi-Step Layout */}
            {listingStep === 1 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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

                {/* Right Column - Watercolor Houses Image and Button */}
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
                  
                  {/* Next Button positioned below the image */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
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
                </Box>
              </Box>
            )}

            {/* Step 2: Questionnaire */}
            {listingStep === 2 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
        </Box>
      )}

            {/* Step 3: Timeline Questionnaire */}
            {listingStep === 3 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
              </Box>
            )}

            {/* Step 4: Home Details Form */}
            {listingStep === 4 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
        </Box>
      )}

            {/* Step 5: Property Features & Amenities */}
            {listingStep === 5 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
              </Box>
            )}

            {/* Step 6: Basement Details Form */}
            {listingStep === 6 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
        </Box>
      )}

            {/* Step 7: Property Quality Assessment */}
            {listingStep === 7 && (
              <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
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





            {/* Step 9: Additional Information Form */}
            {listingStep === 8 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
              </Box>
            )}



            {/* Step 9: HOA and Community Features Form */}
            {listingStep === 9 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
              </Box>
            )}





            {/* Step 10: Additional Information Form */}
            {listingStep === 10 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start',
                maxWidth: '100%'
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
                    <Box sx={{ mb: 3 }}>
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Leased or financed solar panels</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                      />
                      
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Foundation issues</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Fire damage</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                      />
                      
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Septic system</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Asbestos siding</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                      />
                      
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Horse property</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Mobile or manufactured home</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                      />
                      
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Unique ownership structure</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Part of a Below Market Rate (BMR) Ownership Program</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Rent-controlled and has a tenant</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Existing active or inactive underground fuel oil tanks</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Cesspool on property</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                      />
                      
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">None of these apply to my home</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">Other</Typography>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              cursor: 'help'
                            }}>
                              i
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                      />
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
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    gap: 2
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
                </Box>
              </Box>
            )}



            {/* Step 11: Name Collection Form */}
            {listingStep === 11 && (
              <Box sx={{ 
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

                {/* Navigation Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: 2
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Sell Property:</strong> {sellChecked ? 'true' : 'false'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>List Property:</strong> {listChecked ? 'true' : 'false'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Timing:</strong> {selectedTimeline || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Square Footage:</strong> {squareFootage || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Year Built:</strong> {yearBuilt || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Bedrooms:</strong> {bedrooms || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Full Bathrooms:</strong> {fullBathrooms || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Floors:</strong> {floorsAboveGround || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Pool Type:</strong> {selectedPoolType || 'No'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Garage Spaces:</strong> {garageSpaces || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Carport Spaces:</strong> {carportSpaces || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Has Basement:</strong> {hasBasement || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Living Room Quality:</strong> {selectedLivingRoomDescription || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Bathroom Quality:</strong> {selectedMainBathroomDescription || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Kitchen Quality:</strong> {selectedKitchenDescription || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>HOA:</strong> {isHOA || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Last Name:</strong> {lastName || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Phone Number:</strong> {phoneNumber || 'Not provided'}
                    </Typography>
                    <EditIcon sx={{ cursor: 'pointer', color: brandColors.primary, fontSize: 20 }} />
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
                      <HomeIcon sx={{ fontSize: 24, color: 'white' }} />
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
        );
      case 'listings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Listings
                </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage active, pending, and archived listings. Add filters, edit details, or publish.
                      </Typography>
                    </Box>
        );
      case 'messages':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Messages
                      </Typography>
            <Typography variant="body1" color="text.secondary">
              View conversations with tenants, applicants, and service partners.
                      </Typography>
                    </Box>
        );
      case 'earnings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Earnings
                      </Typography>
            <Typography variant="body1" color="text.secondary">
              Summary of rent collections, payouts, and exportable statements.
                      </Typography>
                    </Box>
        );
      case 'insights':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Insights
                      </Typography>
            <Typography variant="body1" color="text.secondary">
              KPIs, trends, and recommended actions across your portfolio.
                      </Typography>
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
            <Typography variant="h5" gutterBottom>
              Online Leases
                  </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and manage digital lease agreements.
                  </Typography>
                </Box>
        );
      case 'applications':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Rental Applications
        </Typography>
            <Typography variant="body1" color="text.secondary">
              Process rental applications and tenant screening.
                  </Typography>
          </Box>
        );
      case 'payments':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Online Rent Payments
                  </Typography>
            <Typography variant="body1" color="text.secondary">
              Accept online rent payments and track history.
                    </Typography>
                  </Box>
        );
      case 'integrations':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Integrations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connect with third-party services.
                      </Typography>
                    </Box>
        );
      case 'insurance':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Insurance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage property insurance policies.
                      </Typography>
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

            {renderContent()}
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default ManagePage; 