import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
  InputAdornment,
  Divider,
  CircularProgress,
} from '@mui/material';
import { brandColors } from '../../../theme';
import {
  Security as SecurityIcon,
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  DocumentScanner as DocumentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Message as MessageIcon,
  Security as InsuranceIcon,
} from '@mui/icons-material';
// Types
interface SearchResult {
  id: string;
  propertyAddress: string;
  searchDate: string;
  status: 'completed' | 'in-progress' | 'error';
  results: string[];
  documents: string[];
}

interface InsuranceQuote {
  id: string;
  propertyAddress: string;
  coverage: number;
  premium: number;
  effectiveDate: string;
  status: 'pending' | 'active' | 'expired';
}

interface EscrowAccount {
  id: string;
  accountNumber: string;
  propertyAddress: string;
  amount: number;
  status: 'active' | 'pending' | 'completed';
  lastUpdated: string;
}

interface TitleData {
  searchResults: SearchResult[];
  insuranceQuote: InsuranceQuote;
}

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
}

// Helper function for status colors
const getStatusColor = (status: 'completed' | 'in-progress' | 'error' | 'active' | 'pending' | 'expired') => {
  switch (status) {
    case 'completed':
    case 'active':
      return brandColors.accent.success;
    case 'in-progress':
    case 'pending':
      return brandColors.accent.info;
    case 'error':
    case 'expired':
      return brandColors.actions.error;
    default:
      return brandColors.text.disabled;
  }
};

// Tab interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanelComponent(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`escrow-title-tabpanel-${index}`}
      aria-labelledby={`escrow-title-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: '2rem', '@media (max-width: 600px)': { padding: '1rem' } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EscrowTitleHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [titleData, setTitleData] = useState<TitleData>({
    searchResults: [],
    insuranceQuote: {} as InsuranceQuote,
  });
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', content: '' });
  const [openEscrowDialog, setOpenEscrowDialog] = useState(false);
  const [openTitleSearchDialog, setOpenTitleSearchDialog] = useState(false);
  const [openInsuranceDialog, setOpenInsuranceDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        const mockSearchResults: SearchResult[] = [
          {
            id: '1',
            propertyAddress: '123 Main St, San Francisco, CA',
            searchDate: '2024-01-25',
            status: 'completed',
            results: ['No liens found', 'Clear title', 'Property taxes current'],
            documents: ['title_report.pdf', 'lien_search.pdf', 'tax_certificate.pdf'],
          },
          {
            id: '2',
            propertyAddress: '456 Oak Ave, Los Angeles, CA',
            searchDate: '2024-01-24',
            status: 'in-progress',
            results: ['Search in progress'],
            documents: [],
          },
          {
            id: '3',
            propertyAddress: '789 Pine St, Seattle, WA',
            searchDate: '2024-01-23',
            status: 'completed',
            results: ['No liens found', 'Clear title', 'Property taxes current'],
            documents: ['title_report.pdf', 'lien_search.pdf'],
          },
        ];

        const mockInsuranceQuote: InsuranceQuote = {
          id: '1',
          propertyAddress: '123 Main St, San Francisco, CA',
          coverage: 750000,
          premium: 1250,
          effectiveDate: '2024-02-01',
          status: 'active',
        };

        const mockEscrowAccounts: EscrowAccount[] = [
          {
            id: '1',
            accountNumber: 'ESC-001-2024',
            propertyAddress: '123 Main St, San Francisco, CA',
            amount: 150000,
            status: 'active',
            lastUpdated: '2024-01-25',
          },
          {
            id: '2',
            accountNumber: 'ESC-002-2024',
            propertyAddress: '456 Oak Ave, Los Angeles, CA',
            amount: 200000,
            status: 'pending',
            lastUpdated: '2024-01-24',
          },
          {
            id: '3',
            accountNumber: 'ESC-003-2024',
            propertyAddress: '789 Pine St, Seattle, WA',
            amount: 175000,
            status: 'active',
            lastUpdated: '2024-01-23',
          },
        ];

        const mockMessages: Message[] = [
          {
            id: '1',
            from: 'title@company.com',
            to: 'agent@dreamery.com',
            subject: 'Title Search Results - 123 Main St',
            content: 'Title search completed successfully. No liens found.',
            timestamp: '2024-01-25T10:30:00Z',
            encrypted: true,
          },
          {
            id: '2',
            from: 'escrow@company.com',
            to: 'agent@dreamery.com',
            subject: 'Escrow Account Update',
            content: 'Escrow account ESC-001-2024 has been funded.',
            timestamp: '2024-01-25T09:15:00Z',
            encrypted: true,
          },
        ];

        setTitleData({
          searchResults: mockSearchResults,
          insuranceQuote: mockInsuranceQuote,
        });
        setEscrowAccounts(mockEscrowAccounts);
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTitleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        // Mock API call to /api/title/search
        console.log('Searching for:', searchQuery);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        alert(`Title search initiated for: ${searchQuery}`);
        setSearchQuery('');
      } catch (error) {
        console.error('Error searching title:', error);
        alert('Error initiating title search. Please try again.');
      }
    }
  };

  const handleInsuranceOrder = async () => {
    try {
      // Mock API call to /api/title/insurance
      console.log('Ordering title insurance');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Title insurance order submitted successfully!');
    } catch (error) {
      console.error('Error ordering insurance:', error);
      alert('Error ordering title insurance. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.to && newMessage.subject && newMessage.content) {
      try {
        // Mock encrypted message using crypto-js (would be implemented in production)
        console.log('Sending encrypted message:', newMessage);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add message to list
        const message: Message = {
          id: Date.now().toString(),
          from: 'agent@dreamery.com',
          to: newMessage.to,
          subject: newMessage.subject,
          content: newMessage.content,
          timestamp: new Date().toISOString(),
          encrypted: true,
        };
        
        setMessages([message, ...messages]);
        setNewMessage({ to: '', subject: '', content: '' });
        alert('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again.');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ padding: '1rem' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '1rem' }}>
      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {escrowAccounts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Escrow Accounts
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {titleData.searchResults.filter(s => s.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Title Searches
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <InsuranceIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {titleData.insuranceQuote.status === 'active' ? 1 : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Insurance Policies
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {formatCurrency(escrowAccounts.reduce((sum, acc) => sum + acc.amount, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Escrow Value
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: brandColors.neutral[100] }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Escrow and title management tabs"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: brandColors.actions.primary,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SearchIcon />
                  Title Search
                </Box>
              }
              id="escrow-title-tab-0"
              aria-controls="escrow-title-tabpanel-0"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsuranceIcon />
                  Title Insurance
                </Box>
              }
              id="escrow-title-tab-1"
              aria-controls="escrow-title-tabpanel-1"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceIcon />
                  Escrow Accounts
                </Box>
              }
              id="escrow-title-tab-2"
              aria-controls="escrow-title-tabpanel-2"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MessageIcon />
                  Secure Messaging
                </Box>
              }
              id="escrow-title-tab-3"
              aria-controls="escrow-title-tabpanel-3"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanelComponent value={activeTab} index={0}>
          {/* Title Search Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                Title Search
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenTitleSearchDialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                New Search
              </Button>
            </Box>

            {/* Search Form */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    label="Property Address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter property address to search..."
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleTitleSearch}
                    disabled={!searchQuery.trim()}
                    sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
                  >
                    Search
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Search Results */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Searches
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Search Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Results</TableCell>
                      <TableCell>Documents</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {titleData.searchResults.map((search) => (
                      <TableRow key={search.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {search.propertyAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(search.searchDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                                                     <Chip
                             label={search.status}
                             size="small"
                             sx={{
                               backgroundColor: getStatusColor(search.status),
                               color: brandColors.backgrounds.primary,
                               fontWeight: 600
                             }}
                           />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ maxWidth: 200 }}>
                            {search.results.map((result, index) => (
                              <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                • {result}
                              </Typography>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {search.documents.map((doc, index) => (
                              <Button
                                key={index}
                                size="small"
                                startIcon={<DownloadIcon />}
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                {doc}
                              </Button>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Report">
                              <IconButton size="small">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>
        </TabPanelComponent>

        <TabPanelComponent value={activeTab} index={1}>
          {/* Title Insurance Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                Title Insurance
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenInsuranceDialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                New Policy
              </Button>
            </Box>

            {/* Current Policy */}
            {titleData.insuranceQuote.id && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    Current Policy
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Property Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {titleData.insuranceQuote.propertyAddress}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Coverage Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(titleData.insuranceQuote.coverage)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Premium
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(titleData.insuranceQuote.premium)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                                             <Chip
                         label={titleData.insuranceQuote.status}
                         size="small"
                         sx={{
                           backgroundColor: getStatusColor(titleData.insuranceQuote.status),
                           color: brandColors.backgrounds.primary,
                           fontWeight: 600
                         }}
                       />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Order New Insurance */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Order New Title Insurance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Get a quote and order title insurance for your property.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<InsuranceIcon />}
                  onClick={handleInsuranceOrder}
                  sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
                >
                  Get Insurance Quote
                </Button>
              </CardContent>
            </Card>
          </Box>
        </TabPanelComponent>

        <TabPanelComponent value={activeTab} index={2}>
          {/* Escrow Accounts Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                Escrow Accounts
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenEscrowDialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Add Account
              </Button>
            </Box>

            {/* Escrow Balance Tracker */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
              {/* Escrow Accounts */}
              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        Escrow Accounts
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenEscrowDialog(true)}
                      >
                        Add Account
                      </Button>
                    </Box>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Account</TableCell>
                          <TableCell>Property</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {escrowAccounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {account.accountNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 150 }}>
                                {account.propertyAddress}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formatCurrency(account.amount)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                                                           <Chip
                               label={account.status}
                               size="small"
                               sx={{
                                 backgroundColor: getStatusColor(account.status),
                                 color: brandColors.backgrounds.primary,
                                 fontWeight: 600
                               }}
                             />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="View Details">
                                  <IconButton size="small">
                                    <ViewIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Account">
                                  <IconButton size="small" onClick={() => setOpenEscrowDialog(true)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Box>

              {/* Total Balance */}
              <Box>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                      Total Escrow Balance
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: brandColors.actions.primary, mb: 2 }}>
                      {formatCurrency(escrowAccounts.reduce((sum, acc) => sum + acc.amount, 0))}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Active Accounts:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {escrowAccounts.filter(acc => acc.status === 'active').length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Pending Accounts:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {escrowAccounts.filter(acc => acc.status === 'pending').length}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </TabPanelComponent>

        <TabPanelComponent value={activeTab} index={3}>
          {/* Secure Messaging Tab */}
          <Box>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: brandColors.actions.primary }}>
              Secure Messaging
            </Typography>

                         {/* Send New Message */}
             <Box sx={{ 
               border: '2px solid brandColors.actions.primary',
               borderRadius: '12px',
               padding: '1rem',
               background: brandColors.backgrounds.secondary,
               position: 'relative',
               mb: 4
             }}>
               <Typography variant="h6" component="h4" sx={{ fontWeight: 600, mb: 2, color: brandColors.actions.primary }}>
                 Send Encrypted Message
               </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="To"
                  value={newMessage.to}
                  onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                  placeholder="recipient@example.com"
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  placeholder="Message subject"
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Message"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  placeholder="Type your secure message here..."
                  variant="outlined"
                  multiline
                  rows={4}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: brandColors.actions.primary }}>
                    <LockIcon fontSize="small" />
                    <Typography variant="caption">
                      Message will be encrypted using AES-256
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    disabled={!newMessage.to || !newMessage.subject || !newMessage.content}
                    sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
                  >
                    Send Message
                  </Button>
                                 </Box>
               </Box>
             </Box>

            {/* Message History */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Message History
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {messages.map((message) => (
                    <Box key={message.id} sx={{ p: 2, border: '1px solid brandColors.borders.secondary', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {message.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {message.encrypted && (
                            <LockIcon fontSize="small" color="primary" />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {new Date(message.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        From: {message.from} | To: {message.to}
                      </Typography>
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanelComponent>
      </Paper>

      {/* Dialogs */}
      {/* Escrow Account Dialog */}
      <Dialog open={openEscrowDialog} onClose={() => setOpenEscrowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Escrow Account</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Account Number"
                defaultValue={selectedItem?.accountNumber || ''}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Escrow Amount"
                type="number"
                defaultValue={selectedItem?.amount || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Closing Date"
                type="date"
                defaultValue={selectedItem?.closingDate || ''}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedItem?.status || 'pending'}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEscrowDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenEscrowDialog(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title Search Dialog */}
      <Dialog open={openTitleSearchDialog} onClose={() => setOpenTitleSearchDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Title Search</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Search Date"
                type="date"
                defaultValue={selectedItem?.searchDate || ''}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedItem?.status || 'in-progress'}>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTitleSearchDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenTitleSearchDialog(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title Insurance Dialog */}
      <Dialog open={openInsuranceDialog} onClose={() => setOpenInsuranceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Title Insurance Policy</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Coverage Amount"
                type="number"
                defaultValue={selectedItem?.coverage || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Premium Amount"
                type="number"
                defaultValue={selectedItem?.premium || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Effective Date"
                type="date"
                defaultValue={selectedItem?.effectiveDate || ''}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedItem?.status || 'pending'}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsuranceDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenInsuranceDialog(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EscrowTitleHub;
