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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { brandColors } from "../../../theme";

// Types
interface Statement {
  id: string;
  type: 'HUD-1' | 'ALTA';
  propertyAddress: string;
  closingDate: string;
  buyer: string;
  seller: string;
  purchasePrice: number;
  loanAmount: number;
  status: 'draft' | 'final' | 'signed';
  lastModified: string;
}

interface CostItem {
  id: string;
  category: string;
  description: string;
  buyerCost: number;
  sellerCost: number;
  totalCost: number;
  type: 'debit' | 'credit';
  section: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N';
  required: boolean;
  notes: string;
}

interface SettlementData {
  statement: Statement;
  costs: CostItem[];
  commission: CommissionSplit;
  prorations: ProrationData;
}

interface CommissionSplit {
  totalCommission: number;
  listingAgent: number;
  sellingAgent: number;
  brokerSplit: number;
  agentSplit: number;
  listingPercentage: number;
  sellingPercentage: number;
}

interface ProrationData {
  propertyTaxes: TaxProration;
  insurance: InsuranceProration;
  hoa: HOAProration;
  utilities: UtilityProration;
}

interface TaxProration {
  annualAmount: number;
  daysInYear: number;
  sellerDays: number;
  buyerDays: number;
  sellerCredit: number;
  buyerDebit: number;
  dueDate: string;
}

interface InsuranceProration {
  annualPremium: number;
  policyStartDate: string;
  policyEndDate: string;
  sellerCredit: number;
  buyerDebit: number;
}

interface HOAProration {
  monthlyDues: number;
  sellerDays: number;
  buyerDays: number;
  sellerCredit: number;
  buyerDebit: number;
}

interface UtilityProration {
  monthlyAverage: number;
  sellerDays: number;
  buyerDays: number;
  sellerCredit: number;
  buyerDebit: number;
}

// Mock data
const mockStatement: Statement = {
  id: '1',
  type: 'ALTA',
  propertyAddress: '123 Main St, San Francisco, CA 94102',
  closingDate: '2024-02-14',
  buyer: 'John & Sarah Smith',
  seller: 'Michael Johnson',
  purchasePrice: 850000,
  loanAmount: 680000,
  status: 'draft',
  lastModified: '2024-01-24',
};

const mockCosts: CostItem[] = [
  {
    id: '1',
    category: 'Origination Fee',
    description: 'Loan processing and underwriting',
    buyerCost: 2500,
    sellerCost: 0,
    totalCost: 2500,
    type: 'debit',
    section: 'A',
    required: true,
    notes: 'Standard origination fee',
  },
  {
    id: '2',
    category: 'Appraisal Fee',
    description: 'Property valuation',
    buyerCost: 450,
    sellerCost: 0,
    totalCost: 450,
    type: 'debit',
    section: 'A',
    required: true,
    notes: 'Required by lender',
  },
  {
    id: '3',
    category: 'Credit Report',
    description: 'Credit check and report',
    buyerCost: 35,
    sellerCost: 0,
    totalCost: 35,
    type: 'debit',
    section: 'A',
    required: true,
    notes: 'Lender requirement',
  },
  {
    id: '4',
    category: 'Title Insurance - Owner',
    description: 'Owner title insurance policy',
    buyerCost: 1200,
    sellerCost: 0,
    totalCost: 1200,
    type: 'debit',
    section: 'B',
    required: true,
    notes: 'Protects buyer',
  },
  {
    id: '5',
    category: 'Title Insurance - Lender',
    description: 'Lender title insurance policy',
    buyerCost: 800,
    sellerCost: 0,
    totalCost: 800,
    type: 'debit',
    section: 'B',
    required: true,
    notes: 'Required by lender',
  },
  {
    id: '6',
    category: 'Recording Fees',
    description: 'County recording charges',
    buyerCost: 150,
    sellerCost: 0,
    totalCost: 150,
    type: 'debit',
    section: 'B',
    required: true,
    notes: 'Government fees',
  },
  {
    id: '7',
    category: 'Transfer Tax',
    description: 'Property transfer tax',
    buyerCost: 0,
    sellerCost: 8500,
    totalCost: 8500,
    type: 'debit',
    section: 'C',
    required: true,
    notes: '1% of purchase price',
  },
  {
    id: '8',
    category: 'Escrow Setup',
    description: 'Initial escrow deposit',
    buyerCost: 800,
    sellerCost: 0,
    totalCost: 800,
    type: 'debit',
    section: 'A',
    required: true,
    notes: 'For taxes and insurance',
  },
  {
    id: '9',
    category: 'Homeowner Insurance',
    description: 'Annual premium',
    buyerCost: 1200,
    sellerCost: 0,
    totalCost: 1200,
    type: 'debit',
    section: 'A',
    required: true,
    notes: 'First year premium',
  },
  {
    id: '10',
    category: 'Survey',
    description: 'Property survey',
    buyerCost: 300,
    sellerCost: 0,
    totalCost: 300,
    type: 'debit',
    section: 'B',
    required: false,
    notes: 'Optional survey',
  },
];

const mockCommission: CommissionSplit = {
  totalCommission: 25500,
  listingAgent: 12750,
  sellingAgent: 12750,
  brokerSplit: 5100,
  agentSplit: 20400,
  listingPercentage: 50,
  sellingPercentage: 50,
};

const mockProrations: ProrationData = {
  propertyTaxes: {
    annualAmount: 8500,
    daysInYear: 365,
    sellerDays: 45,
    buyerDays: 320,
    sellerCredit: 1047.95,
    buyerDebit: 7452.05,
    dueDate: '2024-12-10',
  },
  insurance: {
    annualPremium: 1200,
    policyStartDate: '2024-02-14',
    policyEndDate: '2025-02-14',
    sellerCredit: 0,
    buyerDebit: 1200,
  },
  hoa: {
    monthlyDues: 300,
    sellerDays: 15,
    buyerDays: 15,
    sellerCredit: 150,
    buyerDebit: 150,
  },
  utilities: {
    monthlyAverage: 200,
    sellerDays: 15,
    buyerDays: 15,
    sellerCredit: 100,
    buyerDebit: 100,
  },
};

const SettlementClosingCosts: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settlementData, setSettlementData] = useState<SettlementData>({
    statement: mockStatement,
    costs: mockCosts,
    commission: mockCommission,
    prorations: mockProrations,
  });
  const [commissionForm, setCommissionForm] = useState({
    totalCommission: mockCommission.totalCommission,
    listingPercentage: mockCommission.listingPercentage,
    sellingPercentage: mockCommission.sellingPercentage,
    brokerSplit: mockCommission.brokerSplit,
  });
  const [prorationForm, setProrationForm] = useState({
    propertyTaxes: { ...mockProrations.propertyTaxes },
    insurance: { ...mockProrations.insurance },
    hoa: { ...mockProrations.hoa },
    utilities: { ...mockProrations.utilities },
  });
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedStatementType, setSelectedStatementType] = useState<'HUD-1' | 'ALTA'>('ALTA');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const calculateCommissionSplit = () => {
    const { totalCommission, listingPercentage, sellingPercentage, brokerSplit } = commissionForm;
    const agentSplit = totalCommission - brokerSplit;
    
    const listingAgent = (agentSplit * listingPercentage) / 100;
    const sellingAgent = (agentSplit * sellingPercentage) / 100;

    setSettlementData(prev => ({
      ...prev,
      commission: {
        totalCommission,
        listingAgent,
        sellingAgent,
        brokerSplit,
        agentSplit,
        listingPercentage,
        sellingPercentage,
      },
    }));
  };

  const calculateProrations = () => {
    const { propertyTaxes, insurance, hoa, utilities } = prorationForm;
    
    // Calculate property tax prorations
    const sellerCredit = (propertyTaxes.annualAmount * propertyTaxes.sellerDays) / propertyTaxes.daysInYear;
    const buyerDebit = propertyTaxes.annualAmount - sellerCredit;
    
    // Calculate HOA prorations
    const hoaSellerCredit = (hoa.monthlyDues * hoa.sellerDays) / 30;
    const hoaBuyerDebit = hoa.monthlyDues - hoaSellerCredit;
    
    // Calculate utility prorations
    const utilitySellerCredit = (utilities.monthlyAverage * utilities.sellerDays) / 30;
    const utilityBuyerDebit = utilities.monthlyAverage - utilitySellerCredit;

    setSettlementData(prev => ({
      ...prev,
      prorations: {
        propertyTaxes: {
          ...propertyTaxes,
          sellerCredit,
          buyerDebit,
        },
        insurance: { ...insurance },
        hoa: {
          ...hoa,
          sellerCredit: hoaSellerCredit,
          buyerDebit: hoaBuyerDebit,
        },
        utilities: {
          ...utilities,
          sellerCredit: utilitySellerCredit,
          buyerDebit: utilityBuyerDebit,
        },
      },
    }));
  };

  const generateSettlementStatement = async () => {
    try {
      // Mock API call to generate settlement statement
      const response = await fetch('/api/settlement/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statementType: selectedStatementType,
          settlementData,
        }),
      });

      if (response.ok) {
        // Generate PDF using jsPDF
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(20);
        doc.text(`${selectedStatementType} Settlement Statement`, 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Property: ${settlementData.statement.propertyAddress}`, 20, 40);
        doc.text(`Closing Date: ${settlementData.statement.closingDate}`, 20, 50);
        doc.text(`Buyer: ${settlementData.statement.buyer}`, 20, 60);
        doc.text(`Seller: ${settlementData.statement.seller}`, 20, 70);
        doc.text(`Purchase Price: $${settlementData.statement.purchasePrice.toLocaleString()}`, 20, 80);
        doc.text(`Loan Amount: $${settlementData.statement.loanAmount.toLocaleString()}`, 20, 90);
        
        // Add cost summary
        doc.text('Cost Breakdown:', 20, 110);
        let yPosition = 120;
        
        const buyerTotal = settlementData.costs.reduce((sum, cost) => sum + cost.buyerCost, 0);
        const sellerTotal = settlementData.costs.reduce((sum, cost) => sum + cost.sellerCost, 0);
        
        doc.text(`Total Buyer Costs: $${buyerTotal.toLocaleString()}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Total Seller Costs: $${sellerTotal.toLocaleString()}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Net Cash to Seller: $${(settlementData.statement.purchasePrice - sellerTotal - buyerTotal).toLocaleString()}`, 20, yPosition);
        
        // Save PDF
        doc.save(`${selectedStatementType.toLowerCase()}-settlement-statement.pdf`);
        toast.success(`${selectedStatementType} settlement statement generated successfully!`);
        setGenerateDialogOpen(false);
      } else {
        throw new Error('Failed to generate statement');
      }
    } catch (error) {
      toast.error('Failed to generate settlement statement');
      console.error('Generation error:', error);
    }
  };

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/rates');
      if (response.ok) {
        const data = await response.json();
        // Update rates if needed
        console.log('Rates fetched:', data);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const buyerTotal = settlementData.costs.reduce((sum, cost) => sum + cost.buyerCost, 0);
  const sellerTotal = settlementData.costs.reduce((sum, cost) => sum + cost.sellerCost, 0);
  const totalCosts = settlementData.costs.reduce((sum, cost) => sum + cost.totalCost, 0);

  const getSectionColor = (section: string) => {
    const colors: { [key: string]: string } = {
      'A': '#f8f9fa',      // Very light grey
      'B': '#e9ecef',      // Light grey
      'C': '#dee2e6',      // Medium light grey
      'D': '#ced4da',      // Medium grey
      'E': '#adb5bd',      // Medium dark grey
      'F': '#6c757d',      // Dark grey
      'G': '#495057',      // Darker grey
      'H': '#343a40',      // Very dark grey
      'I': '#f8f9fa',      // Very light grey (repeating pattern)
      'J': '#e9ecef',      // Light grey (repeating pattern)
      'K': '#dee2e6',      // Medium light grey (repeating pattern)
      'L': '#ced4da',      // Medium grey (repeating pattern)
      'M': '#adb5bd',      // Medium dark grey (repeating pattern)
      'N': '#6c757d',      // Dark grey (repeating pattern)
    };
    return colors[section] || '#ffffff'; // Default to white
  };

  return (
    <Box sx={{ p: 3 }}>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
            <Typography variant="h6" component="div">
              ${totalCosts.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Closing Costs
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <MoneyIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
            <Typography variant="h6" component="div">
              ${buyerTotal.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Buyer Costs
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
            <Typography variant="h6" component="div">
              ${sellerTotal.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seller Costs
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AccountBalanceIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
            <Typography variant="h6" component="div">
              ${settlementData.commission.totalCommission.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Commission
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: brandColors.neutral.light }}>
          <Tab label="Cost Breakdown" />
          <Tab label="Commission Calculator" />
          <Tab label="Prorations" />
          <Tab label="Generate Statement" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Cost Breakdown Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Closing Cost Breakdown
              </Typography>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Section</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Buyer Cost</TableCell>
                    <TableCell align="right">Seller Cost</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {settlementData.costs.map((cost) => (
                    <TableRow key={cost.id} sx={{ backgroundColor: getSectionColor(cost.section) }}>
                      <TableCell>
                        <Chip label={cost.section} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {cost.category}
                        </Typography>
                      </TableCell>
                      <TableCell>{cost.description}</TableCell>
                      <TableCell align="right">
                        ${cost.buyerCost.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${cost.sellerCost.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${cost.totalCost.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={cost.type} 
                          size="small"
                          color={cost.type === 'debit' ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={cost.required ? 'Yes' : 'No'} 
                          size="small"
                          color={cost.required ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ mt: 3, p: 2, backgroundColor: brandColors.neutral.light, borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Cost Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Buyer Costs</Typography>
                    <Typography variant="h6" color="primary">${buyerTotal.toLocaleString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Seller Costs</Typography>
                    <Typography variant="h6" color="secondary">${sellerTotal.toLocaleString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Net Cash to Seller</Typography>
                    <Typography variant="h6" color="success.main">
                      ${(settlementData.statement.purchasePrice - sellerTotal - buyerTotal).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Commission Calculator Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Commission Split Calculator
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Commission Inputs
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Total Commission"
                      type="number"
                      value={commissionForm.totalCommission}
                      onChange={(e) => setCommissionForm(prev => ({ 
                        ...prev, 
                        totalCommission: parseFloat(e.target.value) || 0 
                      }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Listing Agent %"
                      type="number"
                      value={commissionForm.listingPercentage}
                      onChange={(e) => setCommissionForm(prev => ({ 
                        ...prev, 
                        listingPercentage: parseFloat(e.target.value) || 0 
                      }))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Selling Agent %"
                      type="number"
                      value={commissionForm.sellingPercentage}
                      onChange={(e) => setCommissionForm(prev => ({ 
                        ...prev, 
                        sellingPercentage: parseFloat(e.target.value) || 0 
                      }))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Broker Split"
                      type="number"
                      value={commissionForm.brokerSplit}
                      onChange={(e) => setCommissionForm(prev => ({ 
                        ...prev, 
                        brokerSplit: parseFloat(e.target.value) || 0 
                      }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateCommissionSplit}
                      startIcon={<CalculateIcon />}
                    >
                      Calculate Split
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Commission Breakdown
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Commission</Typography>
                      <Typography variant="h6">${settlementData.commission.totalCommission.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Listing Agent</Typography>
                      <Typography variant="h6" color="primary">${settlementData.commission.listingAgent.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Selling Agent</Typography>
                      <Typography variant="h6" color="secondary">${settlementData.commission.sellingAgent.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Broker Split</Typography>
                      <Typography variant="h6" color="warning.main">${settlementData.commission.brokerSplit.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Agent Split</Typography>
                      <Typography variant="h6" color="success.main">${settlementData.commission.agentSplit.toLocaleString()}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {/* Prorations Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Proration Calculators
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Property Taxes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Annual Tax Amount"
                      type="number"
                      value={prorationForm.propertyTaxes.annualAmount}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        propertyTaxes: {
                          ...prev.propertyTaxes,
                          annualAmount: parseFloat(e.target.value) || 0
                        }
                      }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Seller Days"
                      type="number"
                      value={prorationForm.propertyTaxes.sellerDays}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        propertyTaxes: {
                          ...prev.propertyTaxes,
                          sellerDays: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                    <TextField
                      fullWidth
                      label="Buyer Days"
                      type="number"
                      value={prorationForm.propertyTaxes.buyerDays}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        propertyTaxes: {
                          ...prev.propertyTaxes,
                          buyerDays: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                    <TextField
                      fullWidth
                      label="Due Date"
                      type="date"
                      value={prorationForm.propertyTaxes.dueDate}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        propertyTaxes: {
                          ...prev.propertyTaxes,
                          dueDate: e.target.value
                        }
                      }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: brandColors.neutral.light, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Seller Credit: ${settlementData.prorations.propertyTaxes.sellerCredit.toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">Buyer Debit: ${settlementData.prorations.propertyTaxes.buyerDebit.toFixed(2)}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">HOA Dues</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Monthly HOA Dues"
                      type="number"
                      value={prorationForm.hoa.monthlyDues}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        hoa: {
                          ...prev.hoa,
                          monthlyDues: parseFloat(e.target.value) || 0
                        }
                      }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Seller Days"
                      type="number"
                      value={prorationForm.hoa.sellerDays}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        hoa: {
                          ...prev.hoa,
                          sellerDays: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                    <TextField
                      fullWidth
                      label="Buyer Days"
                      type="number"
                      value={prorationForm.hoa.buyerDays}
                      onChange={(e) => setProrationForm(prev => ({
                        ...prev,
                        hoa: {
                          ...prev.hoa,
                          buyerDays: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: brandColors.neutral.light, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Seller Credit: ${settlementData.prorations.hoa.sellerCredit.toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">Buyer Debit: ${settlementData.prorations.hoa.buyerDebit.toFixed(2)}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={calculateProrations}
                  startIcon={<CalculateIcon />}
                >
                  Calculate All Prorations
                </Button>
              </Box>
            </Box>
          )}

          {/* Generate Statement Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Generate Settlement Statement
              </Typography>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    Generate a professional {selectedStatementType} settlement statement with all closing costs, 
                    commissions, and prorations included.
                  </Typography>
                  
                  <FormControl sx={{ minWidth: 200, mb: 2 }}>
                    <InputLabel>Statement Type</InputLabel>
                    <Select
                      value={selectedStatementType}
                      onChange={(e) => setSelectedStatementType(e.target.value as 'HUD-1' | 'ALTA')}
                      label="Statement Type"
                    >
                      <MenuItem value="HUD-1">HUD-1 Settlement Statement</MenuItem>
                      <MenuItem value="ALTA">ALTA Settlement Statement</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    startIcon={<DocumentIcon />}
                    onClick={() => setGenerateDialogOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    Generate {selectedStatementType} Statement
                  </Button>
                </CardContent>
              </Card>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Statement Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Property: {settlementData.statement.propertyAddress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Closing Date: {settlementData.statement.closingDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Buyer: {settlementData.statement.buyer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seller: {settlementData.statement.seller}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Financial Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Purchase Price: ${settlementData.statement.purchasePrice.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Loan Amount: ${settlementData.statement.loanAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Costs: ${totalCosts.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net to Seller: ${(settlementData.statement.purchasePrice - sellerTotal - buyerTotal).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Generate Statement Dialog */}
      <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate {selectedStatementType} Settlement Statement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            This will generate a comprehensive {selectedStatementType} settlement statement containing:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            • Complete cost breakdown by section
            • Commission split calculations
            • Proration calculations for taxes, insurance, HOA, and utilities
            • Net cash flow calculations
            • Professional formatting for legal and regulatory compliance
          </Typography>
          <Alert severity="info">
            The statement will be generated as a PDF and downloaded automatically.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
          <Button onClick={generateSettlementStatement} variant="contained">
            Generate Statement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettlementClosingCosts;
