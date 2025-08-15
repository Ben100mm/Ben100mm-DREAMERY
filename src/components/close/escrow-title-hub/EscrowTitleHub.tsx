import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
  Insurance as InsuranceIcon,
  DocumentScanner as DocumentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

const StatusChip = styled(Chip)<{ status: 'active' | 'pending' | 'completed' | 'error' }>`
  background-color: ${({ status }) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'completed': return '#2196f3';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  color: white;
  font-weight: 600;
`;

// Mock data types
interface EscrowAccount {
  id: string;
  accountNumber: string;
  propertyAddress: string;
  buyer: string;
  seller: string;
  amount: number;
  status: 'active' | 'pending' | 'closed';
  createdAt: string;
  closingDate: string;
}

interface TitleSearch {
  id: string;
  propertyAddress: string;
  searchDate: string;
  status: 'in-progress' | 'completed' | 'failed';
  results: string[];
  documents: string[];
}

interface TitleInsurance {
  id: string;
  policyNumber: string;
  propertyAddress: string;
  coverage: number;
  premium: number;
  status: 'active' | 'pending' | 'expired';
  effectiveDate: string;
  expirationDate: string;
}

const EscrowTitleHub: React.FC = () => {
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [titleSearches, setTitleSearches] = useState<TitleSearch[]>([]);
  const [titleInsurance, setTitleInsurance] = useState<TitleInsurance[]>([]);
  const [openEscrowDialog, setOpenEscrowDialog] = useState(false);
  const [openTitleSearchDialog, setOpenTitleSearchDialog] = useState(false);
  const [openInsuranceDialog, setOpenInsuranceDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    // Mock data initialization
    const mockEscrowAccounts: EscrowAccount[] = [
      {
        id: '1',
        accountNumber: 'ESC-2024-001',
        propertyAddress: '123 Main St, San Francisco, CA',
        buyer: 'John Smith',
        seller: 'Jane Doe',
        amount: 850000,
        status: 'active',
        createdAt: '2024-01-01',
        closingDate: '2024-01-25',
      },
      {
        id: '2',
        accountNumber: 'ESC-2024-002',
        propertyAddress: '456 Oak Ave, Los Angeles, CA',
        buyer: 'Mike Johnson',
        seller: 'Sarah Wilson',
        amount: 650000,
        status: 'pending',
        createdAt: '2024-01-05',
        closingDate: '2024-02-01',
      },
    ];

    const mockTitleSearches: TitleSearch[] = [
      {
        id: '1',
        propertyAddress: '123 Main St, San Francisco, CA',
        searchDate: '2024-01-02',
        status: 'completed',
        results: ['No liens found', 'Clear title', 'Property taxes current'],
        documents: ['Title Report.pdf', 'Tax Certificate.pdf'],
      },
      {
        id: '2',
        propertyAddress: '456 Oak Ave, Los Angeles, CA',
        searchDate: '2024-01-06',
        status: 'in-progress',
        results: ['Search in progress'],
        documents: [],
      },
    ];

    const mockTitleInsurance: TitleInsurance[] = [
      {
        id: '1',
        policyNumber: 'TI-2024-001',
        propertyAddress: '123 Main St, San Francisco, CA',
        coverage: 850000,
        premium: 2125,
        status: 'active',
        effectiveDate: '2024-01-25',
        expirationDate: '2025-01-25',
      },
      {
        id: '2',
        policyNumber: 'TI-2024-002',
        propertyAddress: '456 Oak Ave, Los Angeles, CA',
        coverage: 650000,
        premium: 1625,
        status: 'pending',
        effectiveDate: '2024-02-01',
        expirationDate: '2025-02-01',
      },
    ];

    setEscrowAccounts(mockEscrowAccounts);
    setTitleSearches(mockTitleSearches);
    setTitleInsurance(mockTitleInsurance);
  }, []);

  const handleOpenEscrowDialog = (account?: EscrowAccount) => {
    setSelectedItem(account || null);
    setOpenEscrowDialog(true);
  };

  const handleOpenTitleSearchDialog = (search?: TitleSearch) => {
    setSelectedItem(search || null);
    setOpenTitleSearchDialog(true);
  };

  const handleOpenInsuranceDialog = (insurance?: TitleInsurance) => {
    setSelectedItem(insurance || null);
    setOpenInsuranceDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Escrow & Title Hub
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenEscrowDialog()}
            sx={{ backgroundColor: '#1976d2' }}
          >
            New Escrow Account
          </Button>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => handleOpenTitleSearchDialog()}
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          >
            New Title Search
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalanceIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {escrowAccounts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Escrow Accounts
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {titleSearches.filter(s => s.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Title Searches
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <InsuranceIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {titleInsurance.filter(i => i.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Insurance Policies
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {formatCurrency(escrowAccounts.reduce((sum, acc) => sum + acc.amount, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Escrow Value
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Grid container spacing={3}>
        {/* Escrow Accounts */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Escrow Accounts
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenEscrowDialog()}
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
                        <StatusChip
                          label={account.status}
                          status={account.status === 'active' ? 'active' : account.status === 'pending' ? 'pending' : 'completed'}
                          size="small"
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
                            <IconButton size="small" onClick={() => handleOpenEscrowDialog(account)}>
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
        </Grid>

        {/* Title Searches */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Title Searches
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenTitleSearchDialog()}
                >
                  New Search
                </Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Search Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titleSearches.map((search) => (
                    <TableRow key={search.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 150 }}>
                          {search.propertyAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(search.searchDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={search.status}
                          status={search.status === 'completed' ? 'completed' : search.status === 'in-progress' ? 'pending' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Results">
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Documents">
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
        </Grid>

        {/* Title Insurance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Title Insurance Policies
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenInsuranceDialog()}
                >
                  New Policy
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Number</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Coverage</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Effective Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titleInsurance.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {policy.policyNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {policy.propertyAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatCurrency(policy.coverage)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatCurrency(policy.premium)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={policy.status}
                          status={policy.status === 'active' ? 'active' : policy.status === 'pending' ? 'pending' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(policy.effectiveDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Policy">
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Policy">
                            <IconButton size="small" onClick={() => handleOpenInsuranceDialog(policy)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Policy">
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
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Recent Activity
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
              New escrow account created for 789 Pine St, Seattle, WA
            </Alert>
            <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
              Title search completed for 123 Main St, San Francisco, CA
            </Alert>
            <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
              Title insurance policy pending approval for 456 Oak Ave, Los Angeles, CA
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Escrow Account Dialog */}
      <Dialog open={openEscrowDialog} onClose={() => setOpenEscrowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Escrow Account' : 'New Escrow Account'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buyer Name"
                defaultValue={selectedItem?.buyer || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Seller Name"
                defaultValue={selectedItem?.seller || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Escrow Amount"
                type="number"
                defaultValue={selectedItem?.amount || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Closing Date"
                type="date"
                defaultValue={selectedItem?.closingDate || ''}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedItem?.status || 'pending'}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEscrowDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title Search Dialog */}
      <Dialog open={openTitleSearchDialog} onClose={() => setOpenTitleSearchDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Title Search' : 'New Title Search'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search Date"
                type="date"
                defaultValue={selectedItem?.searchDate || new Date().toISOString().split('T')[0]}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedItem?.status || 'in-progress'}>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTitleSearchDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title Insurance Dialog */}
      <Dialog open={openInsuranceDialog} onClose={() => setOpenInsuranceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Title Insurance Policy' : 'New Title Insurance Policy'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coverage Amount"
                type="number"
                defaultValue={selectedItem?.coverage || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Premium Amount"
                type="number"
                defaultValue={selectedItem?.premium || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Effective Date"
                type="date"
                defaultValue={selectedItem?.effectiveDate || ''}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedItem?.status || 'pending'}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsuranceDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { EscrowTitleHub };
