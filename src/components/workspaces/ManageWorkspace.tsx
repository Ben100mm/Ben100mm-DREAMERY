import React, { useState } from 'react';

import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { brandColors } from '../../theme';
import ManageDashboard from '../manage/ManageDashboard';
import ManageCalendar from '../manage/ManageCalendar';
import ManageListings from '../manage/ManageListings';
import ManageMessagesEnhanced from '../manage/ManageMessagesEnhanced';
import ManageEarnings from '../manage/ManageEarnings';
import Calendar from '../common/Calendar';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Home as ListingIcon,
  Chat as ChatIcon,
  AttachMoney as EarningsIcon,
  Insights as InsightsIcon,
  Add as CreateListingIcon,
  Assignment as LeaseIcon,
  PersonAdd as ApplicationIcon,
  Payment as PaymentIcon,
  IntegrationInstructions as IntegrationIcon,
  Security as InsuranceIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';

interface ManageWorkspaceProps {
  activeTab: string;
}

const ManageWorkspace: React.FC<ManageWorkspaceProps> = ({ activeTab }) => {
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
  
  // Listing form state
  const [propertyAddress, setPropertyAddress] = useState('');
  const [sellChecked, setSellChecked] = useState(false);
  const [listChecked, setListChecked] = useState(false);
  const [listingStep, setListingStep] = useState(1);
  const [selectedSituation, setSelectedSituation] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState('');
  
  // Property details state
  const [homeType, setHomeType] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [fullBathrooms, setFullBathrooms] = useState(0);
  const [threeQuarterBathrooms, setThreeQuarterBathrooms] = useState(0);
  const [halfBathrooms, setHalfBathrooms] = useState(0);
  const [floorsAboveGround, setFloorsAboveGround] = useState(0);
  const [lotSize, setLotSize] = useState('');
  
  // Property features state
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
  
  // Basement details state
  const [basementCondition, setBasementCondition] = useState('');
  const [knowsBasementSqft, setKnowsBasementSqft] = useState('');
  const [basementFinishedSqft, setBasementFinishedSqft] = useState('');
  const [basementUnfinishedSqft, setBasementUnfinishedSqft] = useState('');
  
  // Property descriptions state
  const [selectedExteriorDescription, setSelectedExteriorDescription] = useState('');
  const [selectedLivingRoomDescription, setSelectedLivingRoomDescription] = useState('');
  const [selectedMainBathroomDescription, setSelectedMainBathroomDescription] = useState('');
  const [selectedKitchenDescription, setSelectedKitchenDescription] = useState('');
  const [selectedCountertopType, setSelectedCountertopType] = useState('');
  
  // Community features state
  const [isHOA, setIsHOA] = useState('');
  const [isAgeRestricted, setIsAgeRestricted] = useState('');
  const [isGatedCommunity, setIsGatedCommunity] = useState('');
  const [hasGuardAtEntrance, setHasGuardAtEntrance] = useState('');
  
  // Additional info state
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
  
  // Contact info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
    if (listingStep < 14) {
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
    return (
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, backgroundColor: 'white' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
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
          subtitle: 'Centralized overview of your rental properties and management activities',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'calendar':
        return {
          title: 'Calendar',
          subtitle: 'Schedule and manage property maintenance, inspections, and tenant activities',
          icon: <CalendarIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'listings':
        return {
          title: 'Listings',
          subtitle: 'Manage your rental property listings and marketing',
          icon: <ListingIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'messages':
        return {
          title: 'Messages',
          subtitle: 'Communicate with tenants, contractors, and service providers',
          icon: <ChatIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'earnings':
        return {
          title: 'Earnings',
          subtitle: 'Track rental income, expenses, and financial performance',
          icon: <EarningsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'insights':
        return {
          title: 'Insights',
          subtitle: 'Analytics and reports on property performance and market trends',
          icon: <InsightsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'listing':
        return {
          title: 'Creating a Listing',
          subtitle: 'Step-by-step process to create and publish rental listings',
          icon: <CreateListingIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'leases':
        return {
          title: 'Online Leases',
          subtitle: 'Digital lease management and tenant onboarding',
          icon: <LeaseIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'applications':
        return {
          title: 'Rental Applications',
          subtitle: 'Process and manage tenant applications and screening',
          icon: <ApplicationIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'payments':
        return {
          title: 'Online Rent Payments',
          subtitle: 'Secure payment processing and rent collection management',
          icon: <PaymentIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'integrations':
        return {
          title: 'Integrations',
          subtitle: 'Connect with third-party property management tools and services',
          icon: <IntegrationIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'insurance':
        return {
          title: 'Insurance',
          subtitle: 'Property insurance management and claims processing',
          icon: <InsuranceIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'account':
        return {
          title: 'Manage Your Account',
          subtitle: 'Account settings, preferences, and profile management',
          icon: <AccountIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Property Management Dashboard',
          subtitle: 'Centralized overview of your rental properties and management activities',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ManageDashboard />;
      case 'calendar':
        return <ManageCalendar />;
      case 'listings':
        return <ManageListings />;
      case 'messages':
        return (
          <Box>
            <Calendar workspaceType="manage" />
            <Box sx={{ mt: 4 }}>
              <ManageMessagesEnhanced />
            </Box>
          </Box>
        );
      case 'earnings':
        return <ManageEarnings />;
      case 'insights':
        return (
          <Box>
            {renderTabs(insightsTabs, insightsTab, setInsightsTab)}
            
            {insightsTab === 'performance-analytics' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Performance Analytics
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Portfolio Performance</Typography>
                      <Typography variant="h4" color="success.main">94.2%</Typography>
                      <Typography variant="body2" color="text.secondary">Overall efficiency score</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
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
                  <Grid size={{ md: 4, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Average Tenancy</Typography>
                      <Typography variant="h4" color="info.main">28 months</Typography>
                      <Typography variant="body2" color="text.secondary">Stable tenant base</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ md: 4, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Renewal Rate</Typography>
                      <Typography variant="h4" color="success.main">78%</Typography>
                      <Typography variant="body2" color="text.secondary">High satisfaction</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ md: 4, xs: 12 }}>
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
                            src="/houses-watercolor.png" 
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

                {/* Step 2 - Situation */}
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

                {/* Step 3 - Timeline */}
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

                {/* Step 4 - Property Details */}
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
                                border: `1px solid ${brandColors.borders.secondary}`,
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
                                border: `1px solid ${brandColors.borders.secondary}`,
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
                        <Box sx={{ mb: 4, p: 3, border: `1px solid ${brandColors.borders.secondary}`, borderRadius: 2 }}>
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
                        <Box sx={{ mb: 4, p: 3, border: `1px solid ${brandColors.borders.secondary}`, borderRadius: 2 }}>
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
                                      border: `1px solid ${brandColors.borders.secondary}`,
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
                                      border: `1px solid ${brandColors.borders.secondary}`,
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
                        <Box sx={{ mb: 4, p: 3, border: `1px solid ${brandColors.borders.secondary}`, borderRadius: 2 }}>
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
                        <Box sx={{ mb: 4, p: 3, border: `1px solid ${brandColors.borders.secondary}`, borderRadius: 2 }}>
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

                {/* Step 6: Basement Details */}
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
                                  border: '1px solid brandColors.neutral[300]',
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
                                  border: '1px solid brandColors.neutral[300]',
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
                                  border: '1px solid brandColors.neutral[300]',
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
                                  border: '1px solid brandColors.neutral[300]',
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

                {/* Step 8: Kitchen Countertops */}
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

                {/* Step 9: HOA and Community Features */}
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

                {/* Step 10: Additional Information */}
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
                        <Box sx={{ mb: 4, p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2, bgcolor: brandColors.neutral[50] }}>
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
                        <Box sx={{ mb: 4, p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2, bgcolor: brandColors.neutral[50] }}>
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
                        <Box sx={{ mb: 4, p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2, bgcolor: brandColors.neutral[50] }}>
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
                        <Box sx={{ mb: 4, p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2, bgcolor: brandColors.neutral[50] }}>
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
                        <Box sx={{ mb: 3, p: 3, border: '1px solid brandColors.neutral[300]', borderRadius: 2, bgcolor: brandColors.neutral[50] }}>
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
                        onClick={goNext}
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

                {/* Step 11: Contact Information */}
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
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 3,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        Property Information
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Property Address:</strong> {propertyAddress || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Sell Property:</strong> {sellChecked ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>List Property:</strong> {listChecked ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                    </Box>

                    {/* Moving Details Section */}
                    <Box sx={{ 
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 3,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        Moving Details
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Agent Relationship:</strong> {selectedSituation || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Timing:</strong> {selectedTimeline || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                    </Box>

                    {/* Home Details Section */}
                    <Box sx={{ 
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 3,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        Home Details
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Home Type:</strong> {homeType || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Square Footage:</strong> {squareFootage || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Year Built:</strong> {yearBuilt || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Bedrooms:</strong> {bedrooms || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Full Bathrooms:</strong> {fullBathrooms || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Three Quarter Bathrooms:</strong> {threeQuarterBathrooms || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Half Bathrooms:</strong> {halfBathrooms || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Floors:</strong> {floorsAboveGround || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Lot Size:</strong> {lotSize || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Pool Type:</strong> {selectedPoolType || 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Garage Spaces:</strong> {garageSpaces || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Carport Spaces:</strong> {carportSpaces || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Parking Type:</strong> {parkingType || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Heating/Cooling:</strong> {heatingCooling || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Has Fireplace:</strong> {hasFireplace ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Has Pool:</strong> {hasPool ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Has Deck/Patio:</strong> {hasDeckPatio ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Has Fenced Yard:</strong> {hasFencedYard ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Has Basement:</strong> {hasBasement || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                    </Box>

                    {/* Basement Details Section */}
                    {hasBasement === 'yes' && (
                      <Box sx={{ 
                        backgroundColor: brandColors.neutral[50], 
                        p: 3, 
                        borderRadius: 2, 
                        mb: 3,
                        border: '1px solid brandColors.neutral[100]'
                      }}>
                        <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                          Basement Details
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body1">
                            <strong>Basement Condition:</strong> {basementCondition || 'Not provided'}
                          </Typography>
                          <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                        </Box>
                        {knowsBasementSqft === 'yes' && (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body1">
                                <strong>Finished Sqft:</strong> {basementFinishedSqft || 'Not provided'}
                              </Typography>
                              <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body1">
                                <strong>Unfinished Sqft:</strong> {basementUnfinishedSqft || 'Not provided'}
                              </Typography>
                              <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                            </Box>
                          </>
                        )}
                      </Box>
                    )}

                    {/* Home Quality Section */}
                    <Box sx={{ 
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 3,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        Home Quality
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Exterior Quality:</strong> {selectedExteriorDescription || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Living Room Quality:</strong> {selectedLivingRoomDescription || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Bathroom Quality:</strong> {selectedMainBathroomDescription || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Kitchen Quality:</strong> {selectedKitchenDescription || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                    </Box>

                    {/* Additional Information Section */}
                    <Box sx={{ 
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 3,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        Additional Information
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Kitchen Countertops:</strong> {selectedCountertopType || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>HOA:</strong> {isHOA || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
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
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                    </Box>

                    {/* HOA and Community Features Section */}
                    <Box sx={{ 
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 3,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        HOA and Community Features
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>HOA:</strong> {isHOA || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Age Restricted Community:</strong> {isAgeRestricted === 'yes' ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Gated Community:</strong> {isGatedCommunity === 'yes' ? 'Yes' : 'No'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Guard at Entrance:</strong> {hasGuardAtEntrance || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                    </Box>

                    {/* Contact Information Section */}
                    <Box sx={{ 
                      backgroundColor: brandColors.neutral[50], 
                      p: 3, 
                      borderRadius: 2, 
                      mb: 4,
                      border: '1px solid brandColors.neutral[100]'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                        Contact Information
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>First Name:</strong> {firstName || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Last Name:</strong> {lastName || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>Phone Number:</strong> {phoneNumber || 'Not provided'}
                        </Typography>
                        <EditIcon sx={{ fontSize: 20, color: brandColors.primary, cursor: 'pointer' }} />
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

                {/* Step 14 - Final Step */}
                {listingStep === 14 && (
                  <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 3 }}>
                    {/* Header Illustration */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Box
                        component="img"
                        src="/final sell:list.png"
                        alt="Final step illustration"
                        sx={{
                          maxWidth: '100%',
                          height: 'auto',
                          maxHeight: '300px'
                        }}
                      />
                    </Box>
                    
                    <Typography
                      variant="h4"
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
                      border: '2px solid brandColors.neutral[100]',
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
                          <Typography sx={{ fontSize: 24, color: brandColors.text.inverse }}>🏠</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.primary }}>
                          DREAMERY
                        </Typography>
                      </Box>
                      
                      <Typography variant="h2" sx={{ 
                        fontWeight: 700, 
                        color: brandColors.accent.success, 
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
                        <Box sx={{ p: 2, backgroundColor: brandColors.neutral[50], borderRadius: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Get prime exposure on Dreamery resulting in <strong>75% more views</strong>.
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: brandColors.neutral[50], borderRadius: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Helps maximize your sale price by reaching more buyers on Dreamery.
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: brandColors.neutral[50], borderRadius: 2 }}>
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
                      border: '2px solid brandColors.neutral[100]',
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
                          backgroundColor: brandColors.neutral[50], 
                          p: 3, 
                          borderRadius: 2,
                          border: '1px solid brandColors.neutral[100]'
                        }}>
                          <Box sx={{ 
                            backgroundColor: brandColors.accent.error, 
                            color: brandColors.text.inverse, 
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
                            backgroundColor: brandColors.neutral[100], 
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
                        border: '1px solid brandColors.neutral[100]'
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
                          borderTop: '2px solid brandColors.neutral[100]', 
                          pt: 2, 
                          textAlign: 'center' 
                        }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            color: brandColors.accent.success, 
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
                          <Box key={index} sx={{ p: 2, backgroundColor: brandColors.neutral[50], borderRadius: 2 }}>
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
                            backgroundColor: brandColors.neutral[50], 
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
                              color: brandColors.text.inverse,
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
                      backgroundColor: brandColors.backgrounds.warning, 
                      p: 4, 
                      borderRadius: 3, 
                      mb: 4,
                      border: '2px solid brandColors.accent.warning'
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
                        onClick={() => {
                          saveFormData();
                          alert('Form submitted successfully!');
                        }}
                        sx={{
                          backgroundColor: brandColors.neutral[600],
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: brandColors.neutral[700] }
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
                  <Grid container spacing={3}>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Main Photo</Typography>
                      <Typography variant="body2" color="text.secondary">Primary listing image</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Interior Photos</Typography>
                      <Typography variant="body2" color="text.secondary">Living spaces, bedrooms, kitchen</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Exterior Photos</Typography>
                      <Typography variant="body2" color="text.secondary">Front, back, and side views</Typography>
                    </Grid>
                  </Grid>
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
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Property Highlights"
                        secondary="Key features and selling points"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Neighborhood Info"
                        secondary="Local amenities and attractions"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Recent Updates"
                        secondary="Renovations and improvements"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {listingTab === 'pricing' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Pricing
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Rental Pricing</Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ md: 6, xs: 12 }}>
                      <Typography variant="subtitle1">Monthly Rent</Typography>
                      <Typography variant="h4" color="primary">$2,500</Typography>
                      <Typography variant="body2" color="text.secondary">Base monthly rent</Typography>
                    </Grid>
                    <Grid size={{ md: 6, xs: 12 }}>
                      <Typography variant="subtitle1">Security Deposit</Typography>
                      <Typography variant="h4" color="info.main">$2,500</Typography>
                      <Typography variant="body2" color="text.secondary">One month's rent</Typography>
                    </Grid>
                  </Grid>
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
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Online Platforms"
                        secondary="Zillow, Apartments.com, Rent.com"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Social Media"
                        secondary="Facebook, Instagram marketing"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Local Advertising"
                        secondary="Newspaper, community boards"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'leases':
        return (
          <Box>
            {renderTabs(leasesTabs, leasesTab, setLeasesTab)}
            
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
                    <Grid size={{ md: 6, xs: 12 }}>
                      <Typography variant="subtitle1">Fair Housing</Typography>
                      <Typography variant="h4" color="success.main">100%</Typography>
                      <Typography variant="body2" color="text.secondary">Compliant</Typography>
                    </Grid>
                    <Grid size={{ md: 6, xs: 12 }}>
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
                        primary="Unit 2A - Sarah Wilson"
                        secondary="Submitted 2 days ago - Income verification pending"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3B - Mike Johnson"
                        secondary="Submitted 1 day ago - Background check in progress"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 1C - Lisa Davis"
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
                        primary="Income Verification"
                        secondary="3x monthly rent required"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Credit Score"
                        secondary="Minimum 650 required"
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
                  <Grid container spacing={3}>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Criminal Background</Typography>
                      <Typography variant="h4" color="success.main">100%</Typography>
                      <Typography variant="body2" color="text.secondary">All clear</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Credit Check</Typography>
                      <Typography variant="h4" color="warning.main">85%</Typography>
                      <Typography variant="body2" color="text.secondary">2 pending</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Reference Check</Typography>
                      <Typography variant="h4" color="info.main">90%</Typography>
                      <Typography variant="body2" color="text.secondary">1 pending</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            {applicationsTab === 'approval' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Approval
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Approval Queue</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 2A - Sarah Wilson"
                        secondary="Ready for approval - All checks complete"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unit 3B - Mike Johnson"
                        secondary="Pending final review - Background check complete"
                      />
                    </ListItem>
                  </List>
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
                <Grid container spacing={3}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Total Processed</Typography>
                      <Typography variant="h4" color="success.main">$45,200</Typography>
                      <Typography variant="body2" color="text.secondary">This month</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Success Rate</Typography>
                      <Typography variant="h4" color="primary">98.5%</Typography>
                      <Typography variant="body2" color="text.secondary">Payment success</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {paymentsTab === 'collection' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Collection
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Collection Status</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="On-Time Payments"
                        secondary="22 of 24 units - 92%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Late Payments"
                        secondary="2 units - 8%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Overdue Payments"
                        secondary="0 units - 0%"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}

            {paymentsTab === 'late-fees' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Late Fees
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Late Fee Management</Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Late Fee Rate</Typography>
                      <Typography variant="h4" color="warning.main">$50</Typography>
                      <Typography variant="body2" color="text.secondary">Per occurrence</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Grace Period</Typography>
                      <Typography variant="h4" color="info.main">5 days</Typography>
                      <Typography variant="body2" color="text.secondary">Before late fee</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Collected This Month</Typography>
                      <Typography variant="h4" color="success.main">$150</Typography>
                      <Typography variant="body2" color="text.secondary">3 late fees</Typography>
                    </Grid>
                  </Grid>
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
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Average Payment Time"
                        secondary="2.3 days - Excellent"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Payment Methods"
                        secondary="ACH: 60%, Credit: 25%, Check: 15%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Processing Fees"
                        secondary="$1,356 - 3% of total revenue"
                      />
                    </ListItem>
                  </List>
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
                        primary="RentSpree"
                        secondary="Tenant screening - Active"
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
                  <Typography variant="h6" gutterBottom>Payment Gateway</Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ md: 6, xs: 12 }}>
                      <Typography variant="subtitle1">Stripe</Typography>
                      <Typography variant="h4" color="success.main">Active</Typography>
                      <Typography variant="body2" color="text.secondary">Primary processor</Typography>
                    </Grid>
                    <Grid size={{ md: 6, xs: 12 }}>
                      <Typography variant="subtitle1">PayPal</Typography>
                      <Typography variant="h4" color="info.main">Backup</Typography>
                      <Typography variant="body2" color="text.secondary">Alternative option</Typography>
                    </Grid>
                  </Grid>
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
                        primary="ABC Plumbing"
                        secondary="Emergency repairs - 24/7 service"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="XYZ Electrical"
                        secondary="Electrical work - Licensed contractor"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="CleanPro Services"
                        secondary="Cleaning & maintenance - Weekly service"
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
                  <Typography variant="h6" gutterBottom>Utility Management</Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Electric</Typography>
                      <Typography variant="h4" color="success.main">100%</Typography>
                      <Typography variant="body2" color="text.secondary">Automated billing</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Water</Typography>
                      <Typography variant="h4" color="success.main">100%</Typography>
                      <Typography variant="body2" color="text.secondary">Automated billing</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Gas</Typography>
                      <Typography variant="h4" color="warning.main">75%</Typography>
                      <Typography variant="body2" color="text.secondary">Manual setup needed</Typography>
                    </Grid>
                  </Grid>
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
                        primary="Property Insurance - Main Building"
                        secondary="Coverage: $2.5M - Expires: Dec 15, 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Liability Insurance"
                        secondary="Coverage: $1M - Expires: Dec 15, 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Flood Insurance"
                        secondary="Coverage: $500K - Expires: Dec 15, 2024"
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
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Total Coverage</Typography>
                      <Typography variant="h4" color="primary">$4M</Typography>
                      <Typography variant="body2" color="text.secondary">Combined coverage</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Monthly Premium</Typography>
                      <Typography variant="h4" color="info.main">$2,400</Typography>
                      <Typography variant="body2" color="text.secondary">All policies</Typography>
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
                        secondary="Status: Approved - Amount: $3,200"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="HVAC Repair - Unit 3B"
                        secondary="Status: Processing - Amount: $1,800"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Roof Repair - Main Building"
                        secondary="Status: Completed - Amount: $8,500"
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
                  <Grid container spacing={3}>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Fire Risk</Typography>
                      <Typography variant="h4" color="success.main">Low</Typography>
                      <Typography variant="body2" color="text.secondary">Smoke detectors installed</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Flood Risk</Typography>
                      <Typography variant="h4" color="warning.main">Medium</Typography>
                      <Typography variant="body2" color="text.secondary">Flood zone 2</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                      <Typography variant="subtitle1">Theft Risk</Typography>
                      <Typography variant="h4" color="success.main">Low</Typography>
                      <Typography variant="body2" color="text.secondary">Security system active</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 'account':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Manage Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Account settings, preferences, profile management, and security options.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a management option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <Box>
      {/* Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 3, 
          backgroundColor: brandColors.primary,
          borderRadius: '16px 16px 0 0',
          color: brandColors.text.inverse
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {banner.icon}
          <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
            {banner.title}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {banner.subtitle}
        </Typography>
      </Paper>

      {/* Content */}
      <Box sx={{ pl: 0, ml: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default ManageWorkspace;
