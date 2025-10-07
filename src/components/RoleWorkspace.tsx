import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  FormControl,
  Select,
  MenuItem as SelectMenuItem,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AcquisitionSpecialistDashboard from './close/dashboard/AcquisitionSpecialistDashboard';
import BuyerMessages from './buyer/BuyerMessages';
import {
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Queue as QueueIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Home as HomeIcon,
  ManageAccounts as ManageAccountsIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { RoleContext } from '../context/RoleContext.js';
import { useWorkspace } from '../context/WorkspaceContext';
import UnifiedRoleSelector from './UnifiedRoleSelector';

// Types
interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  level: 'admin' | 'agent' | 'lender' | 'buyer' | 'seller' | 'attorney' | 'support';
}

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  category?: string;
}

interface RoleConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tabs: TabItem[];
  defaultTab: string;
}

interface ProfessionalSupportState {
  activeTab: string;
  userRole: UserRole;
  drawerOpen: boolean;
  notifications: number;
  sidebarCollapsed: boolean;
  favorites: string[];
  selectedRole: string;
  favoritesExpanded: boolean;
  subTab: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface RoleWorkspaceProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

// Role list for selector
const roleList = [
  'Acquisition Specialist',
  'Disposition Agent',
  'Title Agent',
  'Escrow Officer',
  'Notary Public',
  'Residential Appraiser',
  'Commercial Appraiser',
  'Home Inspector',
  'Commercial Inspector',
  'Energy Inspector',
  'Land Surveyor',
  'Insurance Agent',
  'Title Insurance Agent',
  'Mortgage Broker',
  'Mortgage Lender',
  'Loan Officer',
  'Mortgage Underwriter',
  'Hard Money Lender',
  'Private Lender',
  'Limited Partner (LP)',
  'Banking Advisor',
  'Seller Finance Purchase Specialist',
  'Subject To Existing Mortgage Purchase Specialist',
  'Trust Acquisition Specialist',
  'Hybrid Purchase Specialist',
  'Lease Option Specialist',
  'General Contractor',
  'Electrical Contractor',
  'Plumbing Contractor',
  'HVAC Contractor',
  'Roofing Contractor',
  'Painting Contractor',
  'Landscaping Contractor',
  'Flooring Contractor',
  'Kitchen Contractor',
  'Bathroom Contractor',
  'Interior Designer',
  'Architect',
  'Landscape Architect',
  'Kitchen Designer',
  'Bathroom Designer',
  'Lighting Designer',
  'Furniture Designer',
  'Color Consultant',
  'Permit Expeditor',
  'Energy Consultant',
  'Property Manager',
  'Long-term Rental Property Manager',
  'Short-term Rental Property Manager',
  'STR Setup & Manager',
  'Housekeeper',
  'Landscape Cleaner',
  'Turnover Specialist',
  'Handyman',
  'Landscaper',
  'Arborist',
  'Tenant Screening Agent',
  'Leasing Agent',
  'Bookkeeper',
  'Certified Public Accountant (CPA)',
  'Accountant',
  'Photographer',
  'Videographer',
  'AR/VR Developer',
  'Digital Twins Developer',
  'Estate Planning Attorney',
  '1031 Exchange Intermediary',
  'Entity Formation Service Provider',
  'Escrow Service Provider',
  'Legal Notary Service Provider',
  'Real Estate Consultant',
  'Real Estate Educator',
  'Financial Advisor',
  'Tax Advisor',
  'Relocation Specialist',
  'Real Estate Investment Advisor',
];

// Role-specific configurations
const roleConfigurations: Record<string, RoleConfig> = {
  'acquisition-specialist': {
    id: 'acquisition-specialist',
    name: 'Acquisition Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'deal-sourcing', label: 'Deal Sourcing', icon: <TimelineIcon />, description: 'Advanced Filters, Saved Searches, Lists, Skip Trace' },
      { value: 'underwriting', label: 'Underwriting', icon: <SecurityIcon />, description: 'ARV, MAO, Repairs, Sensitivity' },
      { value: 'offer-builder', label: 'Offer Builder', icon: <AddIcon />, description: 'Term Sheets, LOIs, PSAs, Counteroffers' },
      { value: 'pipeline', label: 'Pipeline', icon: <TimelineIcon />, description: 'Leads, Stages, Follow-ups, KPIs' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'MLS/PropStream/Zillow feeds, AI comps/ARV calculator, skip tracing integration, automated seller outreach' },
    ],
  },
  'disposition-agent': {
    id: 'disposition-agent',
    name: 'Disposition Agent',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes, Campaigns' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'inventory', label: 'Inventory', icon: <TimelineIcon />, description: 'Active Listings, Pending, Sold, Buyers Wanted' },
      { value: 'buyer-crm', label: 'Buyer CRM', icon: <SecurityIcon />, description: 'Segments, Requirements, Hotlists, Broadcasts' },
      { value: 'deal-room', label: 'Deal Room', icon: <AddIcon />, description: 'Gallery, Docs, Chat' },
      { value: 'marketing-studio', label: 'Marketing Studio', icon: <TimelineIcon />, description: 'Flyers, Blast, Social, Virtual Tours' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Investor marketplace, buyer proof-of-funds verification, e-sign offer acceptance, Property flyers' },
    ],
  },
  'title-agent': {
    id: 'title-agent',
    name: 'Title Agent',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'title-search', label: 'Title Search', icon: <TimelineIcon />, description: 'Chain, Liens, Judgments, Reports' },
      { value: 'curative', label: 'Curative', icon: <SecurityIcon />, description: 'Requirements, Tasks, Evidence, Approvals' },
      { value: 'closing-pack', label: 'Closing Pack', icon: <AddIcon />, description: 'CD/HUD, Deeds, Policies' },
      { value: 'vendor-portal', label: 'Vendor Portal', icon: <TimelineIcon />, description: 'Orders, SLAs, Invoices, Scorecards' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'County record integrations, lien/judgment auto-pull, AI-powered title search summaries, escrow integration' },
    ],
  },
  'escrow-officer': {
    id: 'escrow-officer',
    name: 'Escrow Officer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'escrow-files', label: 'Escrow Files', icon: <TimelineIcon />, description: 'Ledger, Disbursements, Conditions' },
      { value: 'milestones', label: 'Milestones', icon: <SecurityIcon />, description: 'Open, Docs In, Clear to Close, Funded' },
      { value: 'parties-payoffs', label: 'Parties & Payoffs', icon: <AddIcon />, description: 'Contacts, Requests, Confirmations' },
      { value: 'reconciliation', label: 'Reconciliation', icon: <TimelineIcon />, description: 'Balancing, Exceptions, Reports' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Bank/ACH/wire integrations, automated disbursement rules, compliance audit logs, fraud detection tools' },
    ],
  },
  'notary-public': {
    id: 'notary-public',
    name: 'Notary Public',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'bookings', label: 'Bookings', icon: <TimelineIcon />, description: 'Calendar, Mobile, Remote' },
      { value: 'signer-workflow', label: 'Signer Workflow', icon: <SecurityIcon />, description: 'KBA, ID Check, Stamps' },
      { value: 'packages', label: 'Packages', icon: <AddIcon />, description: 'Refi, Purchase, HELOC' },
      { value: 'route-dispatch', label: 'Route & Dispatch', icon: <TimelineIcon />, description: 'Maps, Time Blocks, Check-ins' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Remote online notarization (RON), KBA/ID check APIs, digital seals/stamps, GPS on-site check-in' },
    ],
  },
  'residential-appraiser': {
    id: 'residential-appraiser',
    name: 'Residential Appraiser',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'orders', label: 'Orders', icon: <TimelineIcon />, description: 'Queue, Due Dates, Fees' },
      { value: 'property-data', label: 'Property Data', icon: <SecurityIcon />, description: 'Subject, Photos, Notes' },
      { value: 'comps-models', label: 'Comps & Models', icon: <AddIcon />, description: 'Sales, Cost, Income' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Templates, Completed, QC, History' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'MLS/AMC feeds, AI-assisted appraisal draft, photo analysis for condition scoring, USPAP compliance tools' },
    ],
  },
  'home-inspector': {
    id: 'home-inspector',
    name: 'Home Inspector',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'inspections', label: 'Inspections', icon: <TimelineIcon />, description: 'Calendar, Slots, Types' },
      { value: 'checklists', label: 'Checklists', icon: <SecurityIcon />, description: 'Safety, Systems, Structure' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Templates, Completed, History' },
      { value: 'photos', label: 'Photos', icon: <AddIcon />, description: 'Capture, Upload, Annotate, Archive' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Mobile offline app, AI defect/photo tagging, voice-to-text notes, 360° camera integration' },
    ],
  },
  'commercial-inspector': {
    id: 'commercial-inspector',
    name: 'Commercial Inspector',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'inspections', label: 'Inspections', icon: <TimelineIcon />, description: 'Calendar, Slots, Types' },
      { value: 'checklists', label: 'Checklists', icon: <SecurityIcon />, description: 'HVAC, Electrical, Structural' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Templates, Completed, History' },
      { value: 'photos', label: 'Photos', icon: <AddIcon />, description: 'Capture, Upload, Annotate, Archive' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'OSHA/compliance modules, municipal inspection code integrations, drone support for large sites' },
    ],
  },
  'energy-inspector': {
    id: 'energy-inspector',
    name: 'Energy Inspector',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'inspections', label: 'Inspections', icon: <TimelineIcon />, description: 'Calendar, Slots, Types' },
      { value: 'energy-audit', label: 'Energy Audit', icon: <SecurityIcon />, description: 'Consumption, Efficiency, Benchmark' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Templates, Completed, History' },
      { value: 'recommendations', label: 'Recommendations', icon: <AddIcon />, description: 'Upgrades, Cost, ROI, Compliance' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'DOE/Energy Star benchmarks, AI ROI calculators for retrofits, IoT/smart meter data ingestion' },
    ],
  },
  'insurance-agent': {
    id: 'insurance-agent',
    name: 'Insurance Agent',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'policy-management', label: 'Policy Management', icon: <TimelineIcon />, description: 'Active, Renewals, Claims' },
      { value: 'client-portal', label: 'Client Portal', icon: <SecurityIcon />, description: 'Policies, Docs, Payments' },
      { value: 'claims-processing', label: 'Claims Processing', icon: <AddIcon />, description: 'Queue, Settlements, History' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Performance, Revenue, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Carrier API integration, claims automation, digital COIs, AI risk assessments' },
    ],
  },
  'title-insurance-agent': {
    id: 'title-insurance-agent',
    name: 'Title Insurance Agent',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'policy-management', label: 'Policy Management', icon: <TimelineIcon />, description: 'Active, Renewals, Claims' },
      { value: 'claims-queue', label: 'Claims Queue', icon: <SecurityIcon />, description: 'Pending, History, Settlements' },
      { value: 'docs', label: 'Docs', icon: <AddIcon />, description: 'Policies, Endorsements, Templates' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Title insurer integrations, AI endorsement drafting, automated renewals, escrow sync' },
    ],
  },
  'commercial-appraiser': {
    id: 'commercial-appraiser',
    name: 'Commercial Appraiser',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'orders', label: 'Orders', icon: <TimelineIcon />, description: 'Queue, Due Dates, Fees' },
      { value: 'property-data', label: 'Property Data', icon: <SecurityIcon />, description: 'Subject, Photos, Notes' },
      { value: 'comps-models', label: 'Comps & Models', icon: <AddIcon />, description: 'Sales, Income, Valuation' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Templates, Completed, QC, History' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Income-based valuation models, cap rate databases, cost approach calculators, zoning/permit integration' },
    ],
  },
  'mortgage-broker': {
    id: 'mortgage-broker',
    name: 'Mortgage Broker',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'loan-apps', label: 'Loan Apps', icon: <TimelineIcon />, description: 'Queue, Details, Docs' },
      { value: 'lender-network', label: 'Lender Network', icon: <SecurityIcon />, description: 'Directory, Rates, Performance' },
      { value: 'client-management', label: 'Client Management', icon: <AddIcon />, description: 'Profiles, Communication, History' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Deals, KPIs' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'LOS integrations (Encompass/Blend), lender rate sheet APIs, pre-approval automation, credit pull integration' },
    ],
  },
  'mortgage-lender': {
    id: 'mortgage-lender',
    name: 'Mortgage Lender',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'loan-portfolio', label: 'Loan Portfolio', icon: <TimelineIcon />, description: 'Active, Closed, Pipeline' },
      { value: 'processing', label: 'Processing', icon: <SecurityIcon />, description: 'Queue, Docs, Underwriting' },
      { value: 'underwriting', label: 'Underwriting', icon: <AddIcon />, description: 'Queue, Risk, Decisions' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Performance, Compliance, Metrics' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Automated income/asset verification, fraud detection, ACH payment system, compliance dashboard' },
    ],
  },
  'loan-officer': {
    id: 'loan-officer',
    name: 'Loan Officer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'applications', label: 'Applications', icon: <TimelineIcon />, description: 'Queue, Progress, Docs' },
      { value: 'client-portal', label: 'Client Portal', icon: <SecurityIcon />, description: 'Status, Docs, Updates' },
      { value: 'communication', label: 'Communication', icon: <AddIcon />, description: 'Messages, Calls, Notes' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Approvals, Rejections' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Digital borrower intake, e-sign disclosures, AI affordability calculator, mobile borrower portal' },
    ],
  },
  'mortgage-underwriter': {
    id: 'mortgage-underwriter',
    name: 'Mortgage Underwriter',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'underwriting-queue', label: 'Underwriting Queue', icon: <TimelineIcon />, description: 'Pending, History, Risk' },
      { value: 'risk-assessment', label: 'Risk Assessment', icon: <SecurityIcon />, description: 'Credit, Collateral, Compliance' },
      { value: 'docs', label: 'Docs', icon: <AddIcon />, description: 'Review, Approval, Exceptions' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Metrics, Risk, Approvals, Declines' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Automated underwriting system (AUS), credit bureau integrations, income analysis AI, fraud detection' },
    ],
  },
  'hard-money-lender': {
    id: 'hard-money-lender',
    name: 'Hard Money Lender',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'applications', label: 'Applications', icon: <TimelineIcon />, description: 'Queue, Assets, Risk' },
      { value: 'asset-eval', label: 'Asset Eval', icon: <SecurityIcon />, description: 'Market, Valuation, Comps' },
      { value: 'loan-tracking', label: 'Loan Tracking', icon: <AddIcon />, description: 'Payments, Defaults, Extensions' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Metrics, ROI, Revenue, Portfolio' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Collateral valuation tools, AI ARV/lien checks, disbursement rules, borrower CRM' },
    ],
  },
  'private-lender': {
    id: 'private-lender',
    name: 'Private Lender',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'opportunities', label: 'Opportunities', icon: <TimelineIcon />, description: 'Queue, Analysis, Tracking' },
      { value: 'portfolio', label: 'Portfolio', icon: <SecurityIcon />, description: 'Active, History, Risk' },
      { value: 'client-management', label: 'Client Management', icon: <AddIcon />, description: 'Profiles, Communication, Docs' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, ROI, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Syndication tools, escrow/payment automation, investor dashboards, compliance/tax docs automation' },
    ],
  },
  'limited-partner-lp': {
    id: 'limited-partner-lp',
    name: 'Limited Partner (LP)',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'investments', label: 'Investments', icon: <TimelineIcon />, description: 'Active, History, Distributions' },
      { value: 'performance', label: 'Performance', icon: <SecurityIcon />, description: 'ROI, Benchmarks, KPIs' },
      { value: 'reports', label: 'Reports', icon: <AddIcon />, description: 'Tax, Compliance, Summaries' },
      { value: 'communication', label: 'Communication', icon: <TimelineIcon />, description: 'Updates, Announcements, Notes' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Investor dashboards, automated distributions, LP/GP legal docs, AI-generated fund updates' },
    ],
  },
  'banking-advisor': {
    id: 'banking-advisor',
    name: 'Banking Advisor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'clients', label: 'Clients', icon: <TimelineIcon />, description: 'Directory, Profiles, History' },
      { value: 'planning', label: 'Planning', icon: <SecurityIcon />, description: 'Goals, Strategies, Risk' },
      { value: 'advisory', label: 'Advisory', icon: <AddIcon />, description: 'Notes, Docs, Reports' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Performance, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Bank API integrations, AI financial planning assistant, Monte Carlo simulations, compliance reporting' },
    ],
  },
  'seller-finance-purchase-specialist': {
    id: 'seller-finance-purchase-specialist',
    name: 'Seller Finance Purchase Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'deal-structuring', label: 'Deal Structuring', icon: <TimelineIcon />, description: 'Terms, Docs, Analysis' },
      { value: 'payments', label: 'Payments', icon: <SecurityIcon />, description: 'Schedule, History, Defaults' },
      { value: 'risk', label: 'Risk', icon: <AddIcon />, description: 'Legal, Market, Compliance' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Risks' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Amortization calculators, digital PN/mortgage docs, escrow/payment automation, default workflows' },
    ],
  },
  'subject-to-existing-mortgage-purchase-specialist': {
    id: 'subject-to-existing-mortgage-purchase-specialist',
    name: 'Subject To Existing Mortgage Purchase Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'deals', label: 'Deals', icon: <TimelineIcon />, description: 'Queue, Docs, Analysis' },
      { value: 'risk', label: 'Risk', icon: <SecurityIcon />, description: 'Legal, Market, Compliance' },
      { value: 'finances', label: 'Finances', icon: <AddIcon />, description: 'Cash Flow, Equity, Payments' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Risks, ROI' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Mortgage servicer sync, insurance tracking, AI legal risk analysis, seller communication automation' },
    ],
  },
  'trust-acquisition-specialist': {
    id: 'trust-acquisition-specialist',
    name: 'Trust Acquisition Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'trusts', label: 'Trusts', icon: <TimelineIcon />, description: 'Queue, Analysis, Docs' },
      { value: 'legal', label: 'Legal', icon: <SecurityIcon />, description: 'Review, Compliance, Filing' },
      { value: 'financials', label: 'Financials', icon: <AddIcon />, description: 'Valuation, ROI, Risks' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Performance, Risks, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Probate/court record integration, AI legal summaries, trustee communication hub, compliance audit' },
    ],
  },
  'hybrid-purchase-specialist': {
    id: 'hybrid-purchase-specialist',
    name: 'Hybrid Purchase Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'deals', label: 'Deals', icon: <TimelineIcon />, description: 'Queue, Docs, Analysis' },
      { value: 'structuring', label: 'Structuring', icon: <SecurityIcon />, description: 'Terms, Payments, Options' },
      { value: 'risk', label: 'Risk', icon: <AddIcon />, description: 'Market, Legal, Compliance' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Contract builder for wraps/AITDs, payment management, AI scenario modeling, compliance tracking' },
    ],
  },
  'lease-option-specialist': {
    id: 'lease-option-specialist',
    name: 'Lease Option Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'leases', label: 'Leases', icon: <TimelineIcon />, description: 'Agreements, Renewals, Terms' },
      { value: 'options', label: 'Options', icon: <SecurityIcon />, description: 'Queue, Tracking, Expirations' },
      { value: 'payments', label: 'Payments', icon: <AddIcon />, description: 'Schedule, Defaults, History' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Performance, ROI, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Option valuation calculators, renewal automation, digital lease-option templates, tenant qualification tools' },
    ],
  },
  'general-contractor': {
    id: 'general-contractor',
    name: 'General Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'subcontractors', label: 'Subcontractors', icon: <SecurityIcon />, description: 'Directory, Work Orders, Payments' },
      { value: 'quality-control', label: 'Quality Control', icon: <AddIcon />, description: 'Inspections, Compliance, Safety' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Performance, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Gantt charts, supplier marketplace, permit integration, mobile field app' },
    ],
  },
  'electrical-contractor': {
    id: 'electrical-contractor',
    name: 'Electrical Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'code-compliance', label: 'Code Compliance', icon: <SecurityIcon />, description: 'Requirements, Inspections, Docs' },
      { value: 'work-orders', label: 'Work Orders', icon: <AddIcon />, description: 'Queue, Assignments, Progress' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Safety, Performance, Quality' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'NEC code library, load calculators, AR field reporting, offline mobile app' },
    ],
  },
  'plumbing-contractor': {
    id: 'plumbing-contractor',
    name: 'Plumbing Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'service-calls', label: 'Service Calls', icon: <SecurityIcon />, description: 'Queue, History, Scheduling' },
      { value: 'inventory', label: 'Inventory', icon: <AddIcon />, description: 'Materials, Suppliers, Costs' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Pipe sizing calculators, supplier APIs, GPS dispatch, mobile invoicing' },
    ],
  },
  'hvac-contractor': {
    id: 'hvac-contractor',
    name: 'HVAC Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'maintenance', label: 'Maintenance', icon: <SecurityIcon />, description: 'Calendar, Equipment, Clients' },
      { value: 'service-calls', label: 'Service Calls', icon: <AddIcon />, description: 'Queue, History, Scheduling' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Load calculation software, IoT thermostat sync, service agreement automation, parts marketplace' },
    ],
  },
  'roofing-contractor': {
    id: 'roofing-contractor',
    name: 'Roofing Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'weather-tracking', label: 'Weather Tracking', icon: <SecurityIcon />, description: 'Forecast, Delays, Safety' },
      { value: 'materials', label: 'Materials', icon: <AddIcon />, description: 'Inventory, Suppliers, Costs' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Drone roof scans, AI hail/wind damage detection, supplier pricing APIs, warranty tracking' },
    ],
  },
  'painting-contractor': {
    id: 'painting-contractor',
    name: 'Painting Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'color-consultation', label: 'Color Consultation', icon: <SecurityIcon />, description: 'Palettes, Preferences, Matching' },
      { value: 'client-collaboration', label: 'Client Collaboration', icon: <AddIcon />, description: 'Notes, Feedback, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'AI color-matching, AR paint previews, supplier integrations, client approval workflows' },
    ],
  },
  'landscaping-contractor': {
    id: 'landscaping-contractor',
    name: 'Landscaping Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'seasonal-planning', label: 'Seasonal Planning', icon: <SecurityIcon />, description: 'Planting, Weather, Schedules' },
      { value: 'maintenance', label: 'Maintenance', icon: <AddIcon />, description: 'Tasks, Clients, Progress' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Plant libraries, drone mapping, irrigation tools, GPS crew management' },
    ],
  },
  'flooring-contractor': {
    id: 'flooring-contractor',
    name: 'Flooring Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'materials', label: 'Materials', icon: <SecurityIcon />, description: 'Inventory, Suppliers, Costs' },
      { value: 'installation', label: 'Installation', icon: <AddIcon />, description: 'Schedule, Progress, Quality' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'AR room measurement, supplier catalogs, AI material estimator, crew mobile app' },
    ],
  },
  'kitchen-contractor': {
    id: 'kitchen-contractor',
    name: 'Kitchen Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'design-collaboration', label: 'Design Collaboration', icon: <SecurityIcon />, description: 'Tools, 3D, Feedback' },
      { value: 'materials', label: 'Materials', icon: <AddIcon />, description: 'Inventory, Suppliers, Costs' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'CAD integration, supplier catalog sync, AR kitchen previews, AI cost estimator' },
    ],
  },
  'bathroom-contractor': {
    id: 'bathroom-contractor',
    name: 'Bathroom Contractor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'fixtures', label: 'Fixtures', icon: <SecurityIcon />, description: 'Selection, Suppliers, Tracking' },
      { value: 'installation', label: 'Installation', icon: <AddIcon />, description: 'Schedule, Progress, Quality' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: '3D modeling, AR previews, fixture catalogs, AI compliance checker for ventilation/waterproofing' },
    ],
  },
  'interior-designer': {
    id: 'interior-designer',
    name: 'Interior Designer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'presentations', label: 'Presentations', icon: <SecurityIcon />, description: 'Boards, Slides, Approvals' },
      { value: 'client-feedback', label: 'Client Feedback', icon: <AddIcon />, description: 'Notes, Revisions, Ratings' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'AR/VR walkthroughs, supplier catalogs, AI style board generator, moodboard-sharing hub' },
    ],
  },
  'architect': {
    id: 'architect',
    name: 'Architect',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'blueprints', label: 'Blueprints', icon: <SecurityIcon />, description: 'Versions, Approvals, Archive' },
      { value: 'client-approvals', label: 'Client Approvals', icon: <AddIcon />, description: 'Notes, Feedback, Signatures' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'CAD/BIM integrations, zoning/permit compliance, structural AI checks, client approval workflows' },
    ],
  },
  'landscape-architect': {
    id: 'landscape-architect',
    name: 'Landscape Architect',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'site-analysis', label: 'Site Analysis', icon: <SecurityIcon />, description: 'Assessments, Environment, Planning' },
      { value: 'designs', label: 'Designs', icon: <AddIcon />, description: 'Plans, Revisions, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'GIS integrations, environmental data, AR/VR previews, regulatory compliance tools' },
    ],
  },
  'kitchen-designer': {
    id: 'kitchen-designer',
    name: 'Kitchen Designer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: '3d-modeling', label: '3D Modeling', icon: <SecurityIcon />, description: 'Visualization, Approvals, Iterations' },
      { value: 'client-presentations', label: 'Client Presentations', icon: <AddIcon />, description: 'Slides, Boards, Feedback' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Supplier catalogs, AR/VR previews, AI material/cost estimator, client approval system' },
    ],
  },
  'bathroom-designer': {
    id: 'bathroom-designer',
    name: 'Bathroom Designer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'fixtures', label: 'Fixtures', icon: <SecurityIcon />, description: 'Selection, Preferences, Suppliers' },
      { value: 'designs', label: 'Designs', icon: <AddIcon />, description: 'Layouts, Revisions, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Fixture supplier sync, AR visualization, AI layout suggestions, client feedback hub' },
    ],
  },
  'lighting-designer': {
    id: 'lighting-designer',
    name: 'Lighting Designer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'lighting-plans', label: 'Lighting Plans', icon: <SecurityIcon />, description: 'Fixtures, Energy, Schemes' },
      { value: 'presentations', label: 'Presentations', icon: <AddIcon />, description: 'Slides, Boards, Feedback' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Lighting simulation tools, energy compliance, AR lighting previews, supplier catalog sync' },
    ],
  },
  'furniture-designer': {
    id: 'furniture-designer',
    name: 'Furniture Designer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'custom-orders', label: 'Custom Orders', icon: <SecurityIcon />, description: 'Specs, Tracking, Manufacturing' },
      { value: 'client-collaboration', label: 'Client Collaboration', icon: <AddIcon />, description: 'Notes, Feedback, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Manufacturing integration, 3D modeling, AR fit previews, supplier/material sync' },
    ],
  },
  'color-consultant': {
    id: 'color-consultant',
    name: 'Color Consultant',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Budget, Resources' },
      { value: 'color-schemes', label: 'Color Schemes', icon: <SecurityIcon />, description: 'Palettes, Matching, Preferences' },
      { value: 'client-collaboration', label: 'Client Collaboration', icon: <AddIcon />, description: 'Notes, Feedback, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'AI palette generator, AR visualization, paint supplier catalogs, collaboration hub' },
    ],
  },
  'property-manager': {
    id: 'property-manager',
    name: 'Property Manager',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'portfolio', label: 'Portfolio', icon: <TimelineIcon />, description: 'Properties, Details, Tenants' },
      { value: 'tenants', label: 'Tenants', icon: <SecurityIcon />, description: 'Directory, Leases, Communication' },
      { value: 'maintenance', label: 'Maintenance', icon: <AddIcon />, description: 'Tasks, Vendors, Requests' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Occupancy, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Tenant portal, rent collection (ACH/Stripe), AI predictive maintenance, automated work orders' },
    ],
  },
  'long-term-rental-property-manager': {
    id: 'long-term-rental-property-manager',
    name: 'Long-term Rental Property Manager',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'leases', label: 'Leases', icon: <TimelineIcon />, description: 'Agreements, Renewals, Payments' },
      { value: 'tenants', label: 'Tenants', icon: <SecurityIcon />, description: 'Profiles, Requests, Issues' },
      { value: 'maintenance', label: 'Maintenance', icon: <AddIcon />, description: 'Tasks, Vendors, History' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Occupancy, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Tenant credit checks, e-sign leases, ACH auto-pay, compliance reminders' },
    ],
  },
  'short-term-rental-property-manager': {
    id: 'short-term-rental-property-manager',
    name: 'Short-term Rental Property Manager',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'bookings', label: 'Bookings', icon: <TimelineIcon />, description: 'Calendar, Guests, Pricing' },
      { value: 'guest-services', label: 'Guest Services', icon: <SecurityIcon />, description: 'Check-in, Requests, Feedback' },
      { value: 'channel-management', label: 'Channel Management', icon: <AddIcon />, description: 'Listings, Sync, Analytics' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Occupancy, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Airbnb/VRBO API sync, dynamic pricing, guest review automation, smart lock/IoT integration' },
    ],
  },
  'str-setup-manager': {
    id: 'str-setup-manager',
    name: 'STR Setup & Manager',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'setup', label: 'Setup', icon: <TimelineIcon />, description: 'Listings, Amenities, Photography' },
      { value: 'channel-management', label: 'Channel Management', icon: <SecurityIcon />, description: 'Integration, Pricing, Sync' },
      { value: 'analytics', label: 'Analytics', icon: <AddIcon />, description: 'Performance, Occupancy, Revenue' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Trends, ROI, Metrics, Quality' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Photography booking, AI listing optimizer, OTA compliance tracking, integration marketplace' },
    ],
  },
  'housekeeper': {
    id: 'housekeeper',
    name: 'Housekeeper',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'schedules', label: 'Schedules', icon: <TimelineIcon />, description: 'Calendar, Assignments, Clients' },
      { value: 'tasks', label: 'Tasks', icon: <SecurityIcon />, description: 'Cleaning, Staging, Turnovers' },
      { value: 'quality-control', label: 'Quality Control', icon: <AddIcon />, description: 'Inspections, Photos, Standards' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Jobs, Quality, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Mobile field app, GPS check-in, photo proof uploads, client feedback ratings' },
    ],
  },
  'landscape-cleaner': {
    id: 'landscape-cleaner',
    name: 'Landscape Cleaner',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'schedules', label: 'Schedules', icon: <TimelineIcon />, description: 'Calendar, Assignments, Clients' },
      { value: 'seasonal-tasks', label: 'Seasonal Tasks', icon: <SecurityIcon />, description: 'Planning, Weather, Resources' },
      { value: 'maintenance', label: 'Maintenance', icon: <AddIcon />, description: 'Requests, Status, Feedback' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Jobs, Quality, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Route optimization, GPS crew tracking, mobile reporting, drone integration' },
    ],
  },
  'turnover-specialist': {
    id: 'turnover-specialist',
    name: 'Turnover Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'turnovers', label: 'Turnovers', icon: <TimelineIcon />, description: 'Schedule, Assignments, Clients' },
      { value: 'tasks', label: 'Tasks', icon: <SecurityIcon />, description: 'Cleaning, Repairs, Staging' },
      { value: 'inspections', label: 'Inspections', icon: <AddIcon />, description: 'Reports, Feedback, Standards' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Jobs, Quality, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Smart lock sync, inventory management, AI turnover checklist, mobile photo uploads' },
    ],
  },
  'handyman': {
    id: 'handyman',
    name: 'Handyman',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'work-orders', label: 'Work Orders', icon: <TimelineIcon />, description: 'Queue, Assignments, Progress' },
      { value: 'repairs', label: 'Repairs', icon: <SecurityIcon />, description: 'Plumbing, Electrical, Carpentry' },
      { value: 'inventory', label: 'Inventory', icon: <AddIcon />, description: 'Tools, Materials, Suppliers' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Jobs, Quality, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Mobile offline app, parts marketplace, client booking portal, GPS dispatch' },
    ],
  },
  'landscaper': {
    id: 'landscaper',
    name: 'Landscaper',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'schedules', label: 'Schedules', icon: <TimelineIcon />, description: 'Calendar, Assignments, Clients' },
      { value: 'seasonal', label: 'Seasonal', icon: <SecurityIcon />, description: 'Planning, Planting, Maintenance' },
      { value: 'equipment', label: 'Equipment', icon: <AddIcon />, description: 'Inventory, Suppliers, Costs' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Jobs, Quality, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Drone mapping, plant library integration, irrigation planning, GPS crew management' },
    ],
  },
  'arborist': {
    id: 'arborist',
    name: 'Arborist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'schedules', label: 'Schedules', icon: <TimelineIcon />, description: 'Calendar, Assignments, Clients' },
      { value: 'tree-health', label: 'Tree Health', icon: <SecurityIcon />, description: 'Assessments, Treatments, Tracking' },
      { value: 'maintenance', label: 'Maintenance', icon: <AddIcon />, description: 'Care Plans, Progress, Reports' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Jobs, Quality, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Tree disease database, drone canopy scans, AR growth projections, compliance reporting' },
    ],
  },
  'tenant-screening-agent': {
    id: 'tenant-screening-agent',
    name: 'Tenant Screening Agent',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'applications', label: 'Applications', icon: <TimelineIcon />, description: 'Queue, Verification, Status' },
      { value: 'background-checks', label: 'Background Checks', icon: <SecurityIcon />, description: 'Credit, Evictions, References' },
      { value: 'compliance', label: 'Compliance', icon: <AddIcon />, description: 'Docs, Laws, Reports' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Trends, Approvals' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Credit bureau API, eviction database, AI tenant scoring, fraud detection' },
    ],
  },
  'leasing-agent': {
    id: 'leasing-agent',
    name: 'Leasing Agent',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'showings', label: 'Showings', icon: <TimelineIcon />, description: 'Schedule, Clients, Properties' },
      { value: 'negotiations', label: 'Negotiations', icon: <SecurityIcon />, description: 'Terms, Offers, Approvals' },
      { value: 'leases', label: 'Leases', icon: <AddIcon />, description: 'Drafts, Signatures, Tracking' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Occupancy, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Virtual tour/AR tools, lead gen CRM, e-sign leases, automated follow-ups' },
    ],
  },
  'bookkeeper': {
    id: 'bookkeeper',
    name: 'Bookkeeper',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'records', label: 'Records', icon: <TimelineIcon />, description: 'Transactions, Reconciliation, Journals' },
      { value: 'clients', label: 'Clients', icon: <SecurityIcon />, description: 'Profiles, Communication, Billing' },
      { value: 'reports', label: 'Reports', icon: <AddIcon />, description: 'Financials, Tax, Compliance, Trends' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, ROI, Quality' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Bank sync, auto-categorization, tax-ready exports, AI reconciliation assistant' },
    ],
  },
  'certified-public-accountant-cpa': {
    id: 'certified-public-accountant-cpa',
    name: 'Certified Public Accountant (CPA)',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'tax-prep', label: 'Tax Prep', icon: <TimelineIcon />, description: 'Queue, Clients, Filings' },
      { value: 'clients', label: 'Clients', icon: <SecurityIcon />, description: 'Directory, History, Billing' },
      { value: 'compliance', label: 'Compliance', icon: <AddIcon />, description: 'Docs, Laws, Audit Prep' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, ROI, Quality' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'IRS/state filing integration, AI tax strategy suggestions, secure client vault, e-filing' },
    ],
  },
  'accountant': {
    id: 'accountant',
    name: 'Accountant',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'financials', label: 'Financials', icon: <TimelineIcon />, description: 'Analysis, Budgets, Costs' },
      { value: 'clients', label: 'Clients', icon: <SecurityIcon />, description: 'Directory, History, Billing' },
      { value: 'reports', label: 'Reports', icon: <AddIcon />, description: 'Financials, Metrics, Trends' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, ROI, Compliance, Quality' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Bank integrations, AI forecasting, payroll module, compliance dashboard' },
    ],
  },
  'financial-advisor': {
    id: 'financial-advisor',
    name: 'Financial Advisor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'clients', label: 'Clients', icon: <TimelineIcon />, description: 'Portfolio, Profiles, Goals' },
      { value: 'planning', label: 'Planning', icon: <SecurityIcon />, description: 'Tools, Risk, Strategies' },
      { value: 'investments', label: 'Investments', icon: <AddIcon />, description: 'Tracking, ROI, Benchmarks' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Clients, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Market data feeds, AI portfolio rebalancing, compliance alerts, Monte Carlo simulations' },
    ],
  },
  'tax-advisor': {
    id: 'tax-advisor',
    name: 'Tax Advisor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'clients', label: 'Clients', icon: <TimelineIcon />, description: 'Directory, History, Billing' },
      { value: 'tax-planning', label: 'Tax Planning', icon: <SecurityIcon />, description: 'Strategies, Compliance, Filing' },
      { value: 'docs', label: 'Docs', icon: <AddIcon />, description: 'Reports, Prep, Submissions' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Clients, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'IRS/state API e-filing, AI deduction finder, secure client vault, compliance automation' },
    ],
  },
  'photographer': {
    id: 'photographer',
    name: 'Photographer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'shoots', label: 'Shoots', icon: <TimelineIcon />, description: 'Schedule, Clients, Equipment' },
      { value: 'editing', label: 'Editing', icon: <SecurityIcon />, description: 'Tools, Galleries, Approvals' },
      { value: 'portfolio', label: 'Portfolio', icon: <AddIcon />, description: 'Gallery, Sales, Marketing' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Booking system, AI photo editing, client gallery delivery, licensing/payment integration' },
    ],
  },
  'videographer': {
    id: 'videographer',
    name: 'Videographer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Queue, Clients, Equipment' },
      { value: 'editing', label: 'Editing', icon: <SecurityIcon />, description: 'Tools, Galleries, Approvals' },
      { value: 'portfolio', label: 'Portfolio', icon: <AddIcon />, description: 'Gallery, Sales, Marketing' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Quality, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Drone integration, AI auto-edit tools, stock licensing sync, client portal' },
    ],
  },
  'ar-vr-developer': {
    id: 'ar-vr-developer',
    name: 'AR/VR Developer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'projects', label: 'Projects', icon: <TimelineIcon />, description: 'Timeline, Resources, Quality' },
      { value: 'tech-integration', label: 'Tech Integration', icon: <SecurityIcon />, description: 'Tools, APIs, Optimization' },
      { value: 'client-collaboration', label: 'Client Collaboration', icon: <AddIcon />, description: 'Training, Feedback, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: '3D engine integration (Unity/Unreal), hardware testing tools, AI optimization, cloud rendering' },
    ],
  },
  'digital-twins-developer': {
    id: 'digital-twins-developer',
    name: 'Digital Twins Developer',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'modeling', label: 'Modeling', icon: <TimelineIcon />, description: 'Tools, Clients, Iterations' },
      { value: 'virtual-tours', label: 'Virtual Tours', icon: <SecurityIcon />, description: 'Creation, Features, Clients' },
      { value: 'collaboration', label: 'Collaboration', icon: <AddIcon />, description: 'Training, Feedback, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'BIM/IFC integration, IoT sensor sync, AR overlays, simulation dashboards' },
    ],
  },
  'permit-expeditor': {
    id: 'permit-expeditor',
    name: 'Permit Expeditor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'permits', label: 'Permits', icon: <TimelineIcon />, description: 'Queue, Applications, Status' },
      { value: 'docs', label: 'Docs', icon: <SecurityIcon />, description: 'Filing, Compliance, Clients' },
      { value: 'clients', label: 'Clients', icon: <AddIcon />, description: 'Profiles, Communication, Billing' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Trends, Compliance' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'City/County API integrations, AI compliance checker, digital submission workflows, status automation' },
    ],
  },
  'energy-consultant': {
    id: 'energy-consultant',
    name: 'Energy Consultant',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'analysis', label: 'Analysis', icon: <TimelineIcon />, description: 'Tools, Reports, Audits' },
      { value: 'advisory', label: 'Advisory', icon: <SecurityIcon />, description: 'Clients, Plans, Tracking' },
      { value: 'implementation', label: 'Implementation', icon: <AddIcon />, description: 'Tasks, Status, Metrics' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, ROI, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'DOE/Energy Star APIs, AI energy ROI calculators, smart meter integration, compliance dashboards' },
    ],
  },
  'estate-planning-attorney': {
    id: 'estate-planning-attorney',
    name: 'Estate Planning Attorney',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'clients', label: 'Clients', icon: <TimelineIcon />, description: 'Directory, Cases, Docs' },
      { value: 'estate-plans', label: 'Estate Plans', icon: <SecurityIcon />, description: 'Wills, Trusts, Strategies' },
      { value: 'docs', label: 'Docs', icon: <AddIcon />, description: 'Templates, Filings, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Cases, Compliance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Probate court integration, AI estate draft tools, digital trust templates, compliance alerts' },
    ],
  },
  '1031-exchange-intermediary': {
    id: '1031-exchange-intermediary',
    name: '1031 Exchange Intermediary',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'exchanges', label: 'Exchanges', icon: <TimelineIcon />, description: 'Queue, Properties, Status' },
      { value: 'compliance', label: 'Compliance', icon: <SecurityIcon />, description: 'Rules, Timelines, Tracking' },
      { value: 'docs', label: 'Docs', icon: <AddIcon />, description: 'Filings, Reports, Approvals' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Deals, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'IRS integration, deadline automation, AI exchange modeling, escrow sync' },
    ],
  },
  'entity-formation-service-provider': {
    id: 'entity-formation-service-provider',
    name: 'Entity Formation Service Provider',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'formations', label: 'Formations', icon: <TimelineIcon />, description: 'Queue, Entity Types, Clients' },
      { value: 'docs', label: 'Docs', icon: <SecurityIcon />, description: 'Filings, Compliance, Status' },
      { value: 'clients', label: 'Clients', icon: <AddIcon />, description: 'Directory, Communication, Billing' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Compliance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Secretary of State e-filing, AI entity recommendation, registered agent sync, compliance alerts' },
    ],
  },
  'escrow-service-provider': {
    id: 'escrow-service-provider',
    name: 'Escrow Service Provider',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'transactions', label: 'Transactions', icon: <TimelineIcon />, description: 'Queue, Parties, Status' },
      { value: 'docs', label: 'Docs', icon: <SecurityIcon />, description: 'Queue, Processing, Compliance' },
      { value: 'clients', label: 'Clients', icon: <AddIcon />, description: 'Directory, Communication, Billing' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Bank integrations, fraud detection, automated reconciliations, digital disbursements' },
    ],
  },
  'legal-notary-service-provider': {
    id: 'legal-notary-service-provider',
    name: 'Legal Notary Service Provider',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'appointments', label: 'Appointments', icon: <TimelineIcon />, description: 'Calendar, Clients, Types' },
      { value: 'verification', label: 'Verification', icon: <SecurityIcon />, description: 'Docs, Compliance, Status' },
      { value: 'certificates', label: 'Certificates', icon: <AddIcon />, description: 'Queue, History, Storage' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, Performance, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'RON integration, KBA APIs, GPS tracking, digital seals' },
    ],
  },
  'real-estate-consultant': {
    id: 'real-estate-consultant',
    name: 'Real Estate Consultant',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'advisory', label: 'Advisory', icon: <TimelineIcon />, description: 'Clients, History, Notes' },
      { value: 'market-analysis', label: 'Market Analysis', icon: <SecurityIcon />, description: 'Trends, Reports, Forecasts' },
      { value: 'strategies', label: 'Strategies', icon: <AddIcon />, description: 'Recommendations, Docs, Plans' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Metrics, ROI, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'MLS/CoStar/PropStream data, AI investment memos, scenario modeling, compliance dashboards' },
    ],
  },
  'real-estate-educator': {
    id: 'real-estate-educator',
    name: 'Real Estate Educator',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'courses', label: 'Courses', icon: <TimelineIcon />, description: 'Library, Content, Enrollment' },
      { value: 'students', label: 'Students', icon: <SecurityIcon />, description: 'Directory, Progress, Feedback' },
      { value: 'assessments', label: 'Assessments', icon: <AddIcon />, description: 'Assignments, Tracking, Grades' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Students, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'LMS integrations, AI course generator, certification issuance, student analytics' },
    ],
  },
  'relocation-specialist': {
    id: 'relocation-specialist',
    name: 'Relocation Specialist',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'moves', label: 'Moves', icon: <TimelineIcon />, description: 'Schedule, Clients, Coordination' },
      { value: 'support', label: 'Support', icon: <SecurityIcon />, description: 'Requests, Issues, Resolutions' },
      { value: 'vendors', label: 'Vendors', icon: <AddIcon />, description: 'Directory, Services, Status' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Moves, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'Moving company integrations, AI cost calculators, client booking portal, GPS tracking' },
    ],
  },
  'real-estate-investment-advisor': {
    id: 'real-estate-investment-advisor',
    name: 'Real Estate Investment Advisor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'investments', label: 'Investments', icon: <TimelineIcon />, description: 'Opportunities, Clients, ROI' },
      { value: 'analysis', label: 'Analysis', icon: <SecurityIcon />, description: 'Tools, Market, Risk' },
      { value: 'advisory', label: 'Advisory', icon: <AddIcon />, description: 'Notes, Docs, Plans' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Investments, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'MLS/market data sync, AI scenario modeling, LP/GP dashboards, compliance modules' },
    ],
  },
  'land-surveyor': {
    id: 'land-surveyor',
    name: 'Land Surveyor',
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Tasks, Calendar, Files' },
      { value: 'communications', label: 'Communications', icon: <SupportIcon />, description: 'Chat, Email, Calls, Notes' },
      { value: 'contracts-esign', label: 'Contracts & eSign', icon: <DescriptionIcon />, description: 'Templates, Signatures, Version Control, Audit Trail' },
      { value: 'money-billing', label: 'Money & Billing', icon: <AnalyticsIcon />, description: 'Quotes, Invoices, Payments' },
      { value: 'surveys', label: 'Surveys', icon: <TimelineIcon />, description: 'Queue, Properties, Status' },
      { value: 'data', label: 'Data', icon: <SecurityIcon />, description: 'Maps, Boundaries, Docs' },
      { value: 'reports', label: 'Reports', icon: <AddIcon />, description: 'Templates, History, QC' },
      { value: 'reports', label: 'Reports', icon: <TimelineIcon />, description: 'Revenue, Jobs, Metrics, Trends' },
      { value: 'advanced', label: 'Advanced', icon: <SettingsIcon />, description: 'GIS integrations, drone LiDAR mapping, AR boundary overlays, compliance mapping' },
    ],
  },
};

const RoleWorkspace: React.FC<RoleWorkspaceProps> = ({
  allowedRoles = roleList,
  redirectPath = '/workspaces'
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userRole, setUserRole } = (useContext(RoleContext as any) as any) || {};
  const { selectedMode, setSelectedMode, activeTab, setActiveTab, subTab, setSubTab } = useWorkspace();
  const currentUserRole = userRole || 'Real Estate Agent';
  const isAuthorized = allowedRoles.includes(currentUserRole);
  
  console.log('RoleWorkspace - userRole:', currentUserRole, 'isAuthorized:', isAuthorized, 'allowedRoles:', allowedRoles);

  // Map user role to role configuration key
  const getRoleKey = (role: string): string => {
    // Convert role name to a key format
    return role.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  };

  // Check if role has specific configuration
  const hasRoleConfig = (roleKey: string): boolean => {
    return roleConfigurations.hasOwnProperty(roleKey);
  };

  const currentRoleKey = getRoleKey(currentUserRole);
  const currentRoleConfig = roleConfigurations[currentRoleKey] || {
    id: currentRoleKey,
    name: currentUserRole,
    description: '',
    icon: <PersonIcon />,
    color: brandColors.primary,
    defaultTab: 'dashboard',
    tabs: [],
  };

  // Debug effect to log role changes
  useEffect(() => {
    console.log('RoleWorkspace - userRole changed to:', currentUserRole, 'currentRoleKey:', currentRoleKey);
  }, [currentUserRole, currentRoleKey]);

  const [state, setState] = useState<ProfessionalSupportState>({
    activeTab: activeTab,
    userRole: {
      id: '1',
      name: 'Professional Support',
      permissions: ['view', 'edit', 'submit'],
      level: 'support'
    },
    drawerOpen: false,
    notifications: 3,
    sidebarCollapsed: false,
    favorites: [],
    selectedRole: currentRoleKey,
    favoritesExpanded: true,
    subTab: subTab,
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [roleSelectAnchor, setRoleSelectAnchor] = useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setSubTab(0);
    setState(prev => ({ ...prev, activeTab: newValue, subTab: 0 }));
  };

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
    setState(prev => ({ ...prev, subTab: newValue }));
  };

  const toggleDrawer = () => {
    setState(prev => ({ ...prev, drawerOpen: !prev.drawerOpen }));
  };

  const toggleSidebarCollapse = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const toggleFavorites = () => {
    setState(prev => ({ ...prev, favoritesExpanded: !prev.favoritesExpanded }));
  };

  const toggleFavorite = (tabValue: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(tabValue)
        ? prev.favorites.filter(fav => fav !== tabValue)
        : [...prev.favorites, tabValue]
    }));
  };

  const handleRoleChange = (roleKey: string) => {
    const roleName = roleList.find(role => getRoleKey(role) === roleKey) || roleKey;
    setState(prev => ({
      ...prev,
      selectedRole: roleKey,
      activeTab: activeTab, // Keep current active tab
      favorites: [], // Reset favorites when changing roles
    }));
    setRoleSelectAnchor(null);
    // Update the user's role in the context
    if (setUserRole) {
      setUserRole(roleName);
    }
    console.log('Role changed to:', roleName);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleRoleSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    setRoleSelectAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationsMenuAnchor(null);
    setUserMenuAnchor(null);
    setRoleSelectAnchor(null);
  };

  const handleBackToClose = () => {
    navigate(redirectPath);
  };

  // Get current tabs based on selected role
  const currentTabs = currentRoleConfig?.tabs || [];
  const favoriteTabs = currentTabs.filter(tab => state.favorites.includes(tab.value));

  const renderTabContent = () => {
    const currentTab = currentTabs.find(tab => tab.value === state.activeTab);
    
    return (
      <Box sx={{ p: 3 }}>
        {hasRoleConfig(currentRoleKey) ? (
          // Role-specific content only
          <>
            {state.activeTab === 'dashboard' && (
              <Box sx={{ width: '100%' }}>
                {currentRoleKey === 'acquisition-specialist' ? (
                  <AcquisitionSpecialistDashboard />
                ) : (
                  <>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="dashboard tabs">
                        <Tab label="Tasks" />
                        <Tab label="Calendar" />
                        <Tab label="Files" />
                      </Tabs>
                    </Box>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Active Tasks</Typography>
                      <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold', mb: 1 }}>12</Typography>
                      <Typography variant="body2" color="text.secondary">Manage and track your active tasks</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.accent.success, mb: 2 }}>Calendar Events</Typography>
                      <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold', mb: 1 }}>8</Typography>
                      <Typography variant="body2" color="text.secondary">View and manage your upcoming events</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.accent.warning, mb: 2 }}>Files</Typography>
                      <Typography variant="h4" sx={{ color: brandColors.accent.warning, fontWeight: 'bold', mb: 1 }}>24</Typography>
                      <Typography variant="body2" color="text.secondary">Manage uploaded files and documents</Typography>
                    </TabPanel>
                  </>
                )}
              </Box>
            )}

            {state.activeTab === 'communications' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="communications tabs">
                    <Tab label="Chat" />
                    <Tab label="Email" />
                    <Tab label="Calls" />
                    <Tab label="Notes" />
                    {currentRoleKey === 'disposition-agent' && <Tab label="Campaigns" />}
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Chat</Typography>
                  <Typography variant="body2" color="text.secondary">Real-time messaging with team and clients</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Email</Typography>
                  <Typography variant="body2" color="text.secondary">Email management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Calls</Typography>
                  <Typography variant="body2" color="text.secondary">Call logs and recording management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Meeting notes and documentation</Typography>
                </TabPanel>
                {currentRoleKey === 'disposition-agent' && (
                  <TabPanel value={state.subTab} index={4}>
                    <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Campaigns</Typography>
                    <Typography variant="body2" color="text.secondary">Mass SMS/email campaigns for marketing and outreach</Typography>
                  </TabPanel>
                )}
              </Box>
            )}

            {state.activeTab === 'contracts-esign' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="contracts tabs">
                    <Tab label="Templates" />
                    <Tab label="Signatures" />
                    <Tab label="Version Control" />
                    <Tab label="Audit Trail" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Templates</Typography>
                  <Typography variant="body2" color="text.secondary">Contract templates and forms</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Signatures</Typography>
                  <Typography variant="body2" color="text.secondary">Digital signature management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Version Control</Typography>
                  <Typography variant="body2" color="text.secondary">Document version tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Audit Trail</Typography>
                  <Typography variant="body2" color="text.secondary">Complete activity logging</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'money-billing' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="money billing tabs">
                    <Tab label="Quotes" />
                    <Tab label="Invoices" />
                    <Tab label="Payments" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quotes</Typography>
                  <Typography variant="body2" color="text.secondary">Price quotes and estimates</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Invoices</Typography>
                  <Typography variant="body2" color="text.secondary">Invoice generation and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payments</Typography>
                  <Typography variant="body2" color="text.secondary">Payment processing and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'deal-sourcing' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="deal sourcing tabs">
                    <Tab label="Advanced Filters" />
                    <Tab label="Saved Searches" />
                    <Tab label="Lists" />
                    <Tab label="Skip Trace" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Advanced Filters</Typography>
                  <Typography variant="body2" color="text.secondary">Interactive map with property filters</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Saved Searches</Typography>
                  <Typography variant="body2" color="text.secondary">Pre-configured search criteria</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lists</Typography>
                  <Typography variant="body2" color="text.secondary">Property lists and collections</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Skip Trace</Typography>
                  <Typography variant="body2" color="text.secondary">Owner contact information lookup</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'underwriting' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="underwriting tabs">
                    <Tab label="ARV" />
                    <Tab label="MAO" />
                    <Tab label="Repairs" />
                    <Tab label="Sensitivity" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>ARV</Typography>
                  <Typography variant="body2" color="text.secondary">After Repair Value calculations</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>MAO</Typography>
                  <Typography variant="body2" color="text.secondary">Maximum Allowable Offer calculations</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Repairs</Typography>
                  <Typography variant="body2" color="text.secondary">Repair cost estimation and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Sensitivity</Typography>
                  <Typography variant="body2" color="text.secondary">Market sensitivity analysis</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'offer-builder' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="offer builder tabs">
                    <Tab label="Term Sheets" />
                    <Tab label="LOIs" />
                    <Tab label="PSAs" />
                    <Tab label="Counteroffers" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Term Sheets</Typography>
                  <Typography variant="body2" color="text.secondary">Deal term documentation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>LOIs</Typography>
                  <Typography variant="body2" color="text.secondary">Letters of Intent creation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>PSAs</Typography>
                  <Typography variant="body2" color="text.secondary">Purchase and Sale Agreements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Counteroffers</Typography>
                  <Typography variant="body2" color="text.secondary">Counteroffer management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'pipeline' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="pipeline tabs">
                    <Tab label="Leads" />
                    <Tab label="Stages" />
                    <Tab label="Follow-ups" />
                    <Tab label="KPIs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Leads</Typography>
                  <Typography variant="body2" color="text.secondary">Lead management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Stages</Typography>
                  <Typography variant="body2" color="text.secondary">Deal stage progression</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Follow-ups</Typography>
                  <Typography variant="body2" color="text.secondary">Follow-up task management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>KPIs</Typography>
                  <Typography variant="body2" color="text.secondary">Key Performance Indicators</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'inventory' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="inventory tabs">
                    <Tab label="Active Listings" />
                    <Tab label="Pending" />
                    <Tab label="Sold" />
                    <Tab label="Buyers Wanted" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Active Listings</Typography>
                  <Typography variant="body2" color="text.secondary">Manage your currently active property listings</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Pending</Typography>
                  <Typography variant="body2" color="text.secondary">Track properties with pending offers and transactions</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Sold</Typography>
                  <Typography variant="body2" color="text.secondary">View completed sales and transaction history</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Buyers Wanted</Typography>
                  <Typography variant="body2" color="text.secondary">Connect with buyers looking for specific properties</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'buyer-crm' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="buyer crm tabs">
                    <Tab label="Segments" />
                    <Tab label="Requirements" />
                    <Tab label="Hotlists" />
                    <Tab label="Broadcasts" />
                    <Tab label="Messages" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Segments</Typography>
                  <Typography variant="body2" color="text.secondary">Organize buyers into targeted segments</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Requirements</Typography>
                  <Typography variant="body2" color="text.secondary">Track buyer requirements and preferences</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Hotlists</Typography>
                  <Typography variant="body2" color="text.secondary">Manage priority buyer lists and hot prospects</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Broadcasts</Typography>
                  <Typography variant="body2" color="text.secondary">Send targeted messages to buyer segments</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={4}>
                  <BuyerMessages />
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'deal-room' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="deal room tabs">
                    <Tab label="Gallery" />
                    <Tab label="Docs" />
                    <Tab label="Chat" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Gallery</Typography>
                  <Typography variant="body2" color="text.secondary">Property photos and virtual tour galleries</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Docs</Typography>
                  <Typography variant="body2" color="text.secondary">Property documents, reports, and disclosures</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Chat</Typography>
                  <Typography variant="body2" color="text.secondary">Real-time communication with interested parties</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'marketing-studio' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="marketing studio tabs">
                    <Tab label="Flyers" />
                    <Tab label="Blast" />
                    <Tab label="Social" />
                    <Tab label="Virtual Tours" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Flyers</Typography>
                  <Typography variant="body2" color="text.secondary">Create and manage property marketing flyers</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Blast</Typography>
                  <Typography variant="body2" color="text.secondary">Mass marketing campaigns and email blasts</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Social</Typography>
                  <Typography variant="body2" color="text.secondary">Social media marketing and content management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Virtual Tours</Typography>
                  <Typography variant="body2" color="text.secondary">Create and manage virtual property tours</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'title-search' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="title search tabs">
                    <Tab label="Chain" />
                    <Tab label="Liens" />
                    <Tab label="Judgments" />
                    <Tab label="Reports" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Chain</Typography>
                  <Typography variant="body2" color="text.secondary">Title chain of ownership history and verification</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Liens</Typography>
                  <Typography variant="body2" color="text.secondary">Property liens and encumbrances search and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Judgments</Typography>
                  <Typography variant="body2" color="text.secondary">Legal judgments and court records affecting the property</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Title search reports and documentation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'curative' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="curative tabs">
                    <Tab label="Requirements" />
                    <Tab label="Tasks" />
                    <Tab label="Evidence" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Requirements</Typography>
                  <Typography variant="body2" color="text.secondary">Title curative requirements and specifications</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">Curative tasks and action items tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Evidence</Typography>
                  <Typography variant="body2" color="text.secondary">Documentation and evidence collection for curative work</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">Curative approvals and sign-off management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'closing-pack' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="closing pack tabs">
                    <Tab label="CD/HUD" />
                    <Tab label="Deeds" />
                    <Tab label="Policies" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>CD/HUD</Typography>
                  <Typography variant="body2" color="text.secondary">Closing Disclosure and HUD-1 settlement statements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deeds</Typography>
                  <Typography variant="body2" color="text.secondary">Deed preparation and execution management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Policies</Typography>
                  <Typography variant="body2" color="text.secondary">Title insurance policies and coverage management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'vendor-portal' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="vendor portal tabs">
                    <Tab label="Orders" />
                    <Tab label="SLAs" />
                    <Tab label="Invoices" />
                    <Tab label="Scorecards" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Orders</Typography>
                  <Typography variant="body2" color="text.secondary">Title search and service orders management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>SLAs</Typography>
                  <Typography variant="body2" color="text.secondary">Service Level Agreements and performance tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Invoices</Typography>
                  <Typography variant="body2" color="text.secondary">Vendor invoices and payment processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Scorecards</Typography>
                  <Typography variant="body2" color="text.secondary">Vendor performance scorecards and ratings</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'escrow-files' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="escrow files tabs">
                    <Tab label="Ledger" />
                    <Tab label="Disbursements" />
                    <Tab label="Conditions" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Ledger</Typography>
                  <Typography variant="body2" color="text.secondary">Escrow account ledger and transaction tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Disbursements</Typography>
                  <Typography variant="body2" color="text.secondary">Fund disbursement management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Conditions</Typography>
                  <Typography variant="body2" color="text.secondary">Escrow conditions and requirements management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'milestones' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="milestones tabs">
                    <Tab label="Open" />
                    <Tab label="Docs In" />
                    <Tab label="Clear to Close" />
                    <Tab label="Funded" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Open</Typography>
                  <Typography variant="body2" color="text.secondary">New escrow files and initial setup tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Docs In</Typography>
                  <Typography variant="body2" color="text.secondary">Document collection and verification status</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Clear to Close</Typography>
                  <Typography variant="body2" color="text.secondary">Ready for closing and final preparations</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Funded</Typography>
                  <Typography variant="body2" color="text.secondary">Completed transactions and funding confirmations</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'parties-payoffs' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="parties payoffs tabs">
                    <Tab label="Contacts" />
                    <Tab label="Requests" />
                    <Tab label="Confirmations" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Contacts</Typography>
                  <Typography variant="body2" color="text.secondary">Transaction parties and stakeholder contact management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Requests</Typography>
                  <Typography variant="body2" color="text.secondary">Payoff requests and lender communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Confirmations</Typography>
                  <Typography variant="body2" color="text.secondary">Payoff confirmations and verification tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'reconciliation' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="reconciliation tabs">
                    <Tab label="Balancing" />
                    <Tab label="Exceptions" />
                    <Tab label="Reports" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Balancing</Typography>
                  <Typography variant="body2" color="text.secondary">Account balancing and reconciliation processes</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Exceptions</Typography>
                  <Typography variant="body2" color="text.secondary">Exception handling and discrepancy resolution</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Reconciliation reports and audit documentation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'bookings' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="bookings tabs">
                    <Tab label="Calendar" />
                    <Tab label="Mobile" />
                    <Tab label="Remote" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">Schedule and manage notary appointments and bookings</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Mobile</Typography>
                  <Typography variant="body2" color="text.secondary">Mobile notary services and on-site appointments</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Remote</Typography>
                  <Typography variant="body2" color="text.secondary">Remote online notarization (RON) appointments and services</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'signer-workflow' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="signer workflow tabs">
                    <Tab label="KBA" />
                    <Tab label="ID Check" />
                    <Tab label="Stamps" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>KBA</Typography>
                  <Typography variant="body2" color="text.secondary">Knowledge-Based Authentication for signer verification</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>ID Check</Typography>
                  <Typography variant="body2" color="text.secondary">Identity verification and document validation processes</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Stamps</Typography>
                  <Typography variant="body2" color="text.secondary">Digital notary stamps and seal management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'packages' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="packages tabs">
                    <Tab label="Refi" />
                    <Tab label="Purchase" />
                    <Tab label="HELOC" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Refi</Typography>
                  <Typography variant="body2" color="text.secondary">Refinancing document packages and notarization services</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Purchase</Typography>
                  <Typography variant="body2" color="text.secondary">Purchase transaction document packages and services</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>HELOC</Typography>
                  <Typography variant="body2" color="text.secondary">Home Equity Line of Credit document packages</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'route-dispatch' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="route dispatch tabs">
                    <Tab label="Maps" />
                    <Tab label="Time Blocks" />
                    <Tab label="Check-ins" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Maps</Typography>
                  <Typography variant="body2" color="text.secondary">Route planning and mapping for mobile notary services</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Time Blocks</Typography>
                  <Typography variant="body2" color="text.secondary">Time block scheduling and appointment management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Check-ins</Typography>
                  <Typography variant="body2" color="text.secondary">Location check-ins and appointment verification</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'orders' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="orders tabs">
                    <Tab label="Queue" />
                    <Tab label="Due Dates" />
                    <Tab label="Fees" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Appraisal order queue and workflow management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Due Dates</Typography>
                  <Typography variant="body2" color="text.secondary">Order due dates and deadline tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Fees</Typography>
                  <Typography variant="body2" color="text.secondary">Appraisal fees and pricing management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'property-data' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="property data tabs">
                    <Tab label="Subject" />
                    <Tab label="Photos" />
                    <Tab label="Notes" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Subject Property</Typography>
                  <Typography variant="body2" color="text.secondary">Subject property information and characteristics</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photos</Typography>
                  <Typography variant="body2" color="text.secondary">Property photos and documentation management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Property inspection notes and observations</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'comps-models' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="comps models tabs">
                    <Tab label="Sales" />
                    <Tab label="Cost" />
                    <Tab label="Income" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Sales Comparables</Typography>
                  <Typography variant="body2" color="text.secondary">Sales comparison analysis and comparable properties</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cost Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Cost approach analysis and construction cost data</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Income Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Income approach analysis and rental comparables</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'inspections' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="inspections tabs">
                    <Tab label="Calendar" />
                    <Tab label="Slots" />
                    <Tab label="Types" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Inspection Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">Schedule and manage inspection appointments</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Time Slots</Typography>
                  <Typography variant="body2" color="text.secondary">Manage available time slots and scheduling</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Inspection Types</Typography>
                  <Typography variant="body2" color="text.secondary">Configure different types of inspections and their requirements</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'checklists' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="checklists tabs">
                    {currentRoleKey === 'commercial-inspector' ? (
                      <>
                        <Tab label="HVAC" />
                        <Tab label="Electrical" />
                        <Tab label="Structural" />
                      </>
                    ) : (
                      <>
                        <Tab label="Safety" />
                        <Tab label="Systems" />
                        <Tab label="Structure" />
                      </>
                    )}
                  </Tabs>
                </Box>
                {currentRoleKey === 'commercial-inspector' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>HVAC Checklists</Typography>
                      <Typography variant="body2" color="text.secondary">Commercial HVAC system inspection checklists and protocols</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Electrical Checklists</Typography>
                      <Typography variant="body2" color="text.secondary">Commercial electrical system inspection checklists and safety protocols</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Structural Checklists</Typography>
                      <Typography variant="body2" color="text.secondary">Commercial structural inspection checklists and building code compliance</Typography>
                    </TabPanel>
                  </>
                ) : (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Safety Checklists</Typography>
                      <Typography variant="body2" color="text.secondary">Safety inspection checklists and protocols</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Systems Checklists</Typography>
                      <Typography variant="body2" color="text.secondary">HVAC, electrical, plumbing, and other system inspection checklists</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Structure Checklists</Typography>
                      <Typography variant="body2" color="text.secondary">Foundation, framing, roofing, and structural inspection checklists</Typography>
                    </TabPanel>
                  </>
                )}
              </Box>
            )}

            {state.activeTab === 'energy-audit' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="energy audit tabs">
                    <Tab label="Consumption" />
                    <Tab label="Efficiency" />
                    <Tab label="Benchmark" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Consumption</Typography>
                  <Typography variant="body2" color="text.secondary">Track and analyze energy consumption patterns and usage data</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Efficiency</Typography>
                  <Typography variant="body2" color="text.secondary">Assess energy efficiency ratings and performance metrics</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Benchmarking</Typography>
                  <Typography variant="body2" color="text.secondary">Compare energy performance against industry benchmarks and standards</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'policy-management' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="policy management tabs">
                    <Tab label="Active" />
                    <Tab label="Renewals" />
                    <Tab label="Claims" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Active Policies</Typography>
                  <Typography variant="body2" color="text.secondary">Manage active insurance policies and coverage details</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Policy Renewals</Typography>
                  <Typography variant="body2" color="text.secondary">Track upcoming renewals and manage renewal processes</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Claims Overview</Typography>
                  <Typography variant="body2" color="text.secondary">Monitor claims status and policy claim history</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-portal' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client portal tabs">
                    <Tab label="Policies" />
                    <Tab label="Docs" />
                    <Tab label="Payments" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Policies</Typography>
                  <Typography variant="body2" color="text.secondary">Client-facing policy management and access portal</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Document Management</Typography>
                  <Typography variant="body2" color="text.secondary">Client document storage and sharing platform</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment Portal</Typography>
                  <Typography variant="body2" color="text.secondary">Client payment processing and billing management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'claims-queue' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="claims queue tabs">
                    <Tab label="Pending" />
                    <Tab label="History" />
                    <Tab label="Settlements" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Pending Claims</Typography>
                  <Typography variant="body2" color="text.secondary">Manage pending title insurance claims and processing workflow</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Claims History</Typography>
                  <Typography variant="body2" color="text.secondary">Historical title insurance claims data and processing records</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Settlements</Typography>
                  <Typography variant="body2" color="text.secondary">Process title insurance claim settlements and payment approvals</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'docs' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="docs tabs">
                    {currentRoleKey === 'tax-advisor' ? (
                      <>
                        <Tab label="Reports" />
                        <Tab label="Prep" />
                        <Tab label="Submissions" />
                      </>
                    ) : (
                      <>
                        <Tab label="Policies" />
                        <Tab label="Endorsements" />
                        <Tab label="Templates" />
                      </>
                    )}
                  </Tabs>
                </Box>
                {currentRoleKey === 'tax-advisor' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Reports</Typography>
                      <Typography variant="body2" color="text.secondary">Generate comprehensive tax reports and analysis for clients</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Preparation</Typography>
                      <Typography variant="body2" color="text.secondary">Tax return preparation tools and document management</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Submissions</Typography>
                      <Typography variant="body2" color="text.secondary">Electronic filing and submission management for tax returns</Typography>
                    </TabPanel>
                  </>
                ) : (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Title Policies</Typography>
                      <Typography variant="body2" color="text.secondary">Manage title insurance policies and coverage documents</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Endorsements</Typography>
                      <Typography variant="body2" color="text.secondary">Create and manage title insurance endorsements and amendments</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Document Templates</Typography>
                      <Typography variant="body2" color="text.secondary">Title insurance document templates and forms</Typography>
                    </TabPanel>
                  </>
                )}
              </Box>
            )}

            {state.activeTab === 'claims-processing' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="claims processing tabs">
                    <Tab label="Queue" />
                    <Tab label="Settlements" />
                    <Tab label="History" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Claims Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Manage pending claims and processing workflow</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Settlements</Typography>
                  <Typography variant="body2" color="text.secondary">Process claim settlements and payment approvals</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Claims History</Typography>
                  <Typography variant="body2" color="text.secondary">Historical claims data and processing records</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'recommendations' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="recommendations tabs">
                    <Tab label="Upgrades" />
                    <Tab label="Cost" />
                    <Tab label="ROI" />
                    <Tab label="Compliance" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Upgrades</Typography>
                  <Typography variant="body2" color="text.secondary">Recommend energy efficiency upgrades and improvements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cost Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Analyze costs and savings potential for energy improvements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>ROI Calculations</Typography>
                  <Typography variant="body2" color="text.secondary">Calculate return on investment for energy efficiency projects</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Ensure recommendations meet energy codes and compliance requirements</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'photos' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="photos tabs">
                    <Tab label="Capture" />
                    <Tab label="Upload" />
                    <Tab label="Annotate" />
                    <Tab label="Archive" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photo Capture</Typography>
                  <Typography variant="body2" color="text.secondary">Capture photos during inspections with mobile app integration</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photo Upload</Typography>
                  <Typography variant="body2" color="text.secondary">Upload and organize inspection photos</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photo Annotation</Typography>
                  <Typography variant="body2" color="text.secondary">Annotate photos with notes, arrows, and highlights</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={3}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photo Archive</Typography>
                  <Typography variant="body2" color="text.secondary">Archive and manage historical inspection photos</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'reports' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="reports tabs">
                    {currentRoleKey === 'insurance-agent' ? (
                      <>
                        <Tab label="Performance" />
                        <Tab label="Revenue" />
                        <Tab label="Metrics" />
                        <Tab label="Trends" />
                      </>
                    ) : currentRoleKey === 'title-insurance-agent' ? (
                      <>
                        <Tab label="Revenue" />
                        <Tab label="Metrics" />
                        <Tab label="Performance" />
                        <Tab label="Trends" />
                      </>
                    ) : (
                      <>
                        <Tab label="Templates" />
                        <Tab label="Completed" />
                        <Tab label="History" />
                      </>
                    )}
                  </Tabs>
                </Box>
                {currentRoleKey === 'insurance-agent' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Performance Reports</Typography>
                      <Typography variant="body2" color="text.secondary">Agent performance metrics and productivity reports</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Revenue Reports</Typography>
                      <Typography variant="body2" color="text.secondary">Revenue tracking and commission analysis reports</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Business Metrics</Typography>
                      <Typography variant="body2" color="text.secondary">Key business metrics and KPI tracking</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Trend Analysis</Typography>
                      <Typography variant="body2" color="text.secondary">Market trends and business analytics</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'title-insurance-agent' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Revenue Reports</Typography>
                      <Typography variant="body2" color="text.secondary">Title insurance revenue tracking and commission analysis</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Business Metrics</Typography>
                      <Typography variant="body2" color="text.secondary">Key title insurance business metrics and KPI tracking</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Performance Reports</Typography>
                      <Typography variant="body2" color="text.secondary">Title insurance agent performance metrics and productivity</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Trend Analysis</Typography>
                      <Typography variant="body2" color="text.secondary">Title insurance market trends and business analytics</Typography>
                    </TabPanel>
                  </>
                ) : (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Report Templates</Typography>
                      <Typography variant="body2" color="text.secondary">Inspection report templates and forms</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Completed Reports</Typography>
                      <Typography variant="body2" color="text.secondary">Completed inspection reports and deliverables</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Report History</Typography>
                      <Typography variant="body2" color="text.secondary">Historical reports and version tracking</Typography>
                    </TabPanel>
                  </>
                )}
              </Box>
            )}

            {state.activeTab === 'loan-apps' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="loan apps tabs">
                    <Tab label="Queue" />
                    <Tab label="Details" />
                    <Tab label="Docs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Loan Applications Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Manage incoming loan applications and processing workflow</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Application Details</Typography>
                  <Typography variant="body2" color="text.secondary">Detailed loan application information and borrower data</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Documentation</Typography>
                  <Typography variant="body2" color="text.secondary">Required documents and verification materials</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'lender-network' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="lender network tabs">
                    <Tab label="Directory" />
                    <Tab label="Rates" />
                    <Tab label="Performance" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lender Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Network of lending partners and their specialties</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Rate Sheets</Typography>
                  <Typography variant="body2" color="text.secondary">Current interest rates and loan products from lenders</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Performance Metrics</Typography>
                  <Typography variant="body2" color="text.secondary">Lender performance tracking and analytics</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-management' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client management tabs">
                    <Tab label="Profiles" />
                    <Tab label="Communication" />
                    <Tab label="History" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Profiles</Typography>
                  <Typography variant="body2" color="text.secondary">Comprehensive client information and preferences</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Communication History</Typography>
                  <Typography variant="body2" color="text.secondary">All client interactions and communication logs</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Transaction History</Typography>
                  <Typography variant="body2" color="text.secondary">Complete history of client transactions and deals</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'loan-portfolio' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="loan portfolio tabs">
                    <Tab label="Active" />
                    <Tab label="Closed" />
                    <Tab label="Pipeline" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Active Loans</Typography>
                  <Typography variant="body2" color="text.secondary">Currently active loan portfolio and status tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Closed Loans</Typography>
                  <Typography variant="body2" color="text.secondary">Completed loan transactions and historical data</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Pipeline</Typography>
                  <Typography variant="body2" color="text.secondary">Loans in various stages of processing and approval</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'processing' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="processing tabs">
                    <Tab label="Queue" />
                    <Tab label="Docs" />
                    <Tab label="Underwriting" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Processing Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Loan applications awaiting processing and review</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Document Processing</Typography>
                  <Typography variant="body2" color="text.secondary">Document collection, verification, and organization</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Underwriting Support</Typography>
                  <Typography variant="body2" color="text.secondary">Supporting underwriting team with loan analysis</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'underwriting-queue' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="underwriting queue tabs">
                    <Tab label="Pending" />
                    <Tab label="History" />
                    <Tab label="Risk" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Pending Reviews</Typography>
                  <Typography variant="body2" color="text.secondary">Loan applications awaiting underwriting review and decision</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Review History</Typography>
                  <Typography variant="body2" color="text.secondary">Completed underwriting reviews and decisions</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Risk Assessment</Typography>
                  <Typography variant="body2" color="text.secondary">Risk analysis and credit evaluation tools</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'risk-assessment' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="risk assessment tabs">
                    <Tab label="Credit" />
                    <Tab label="Collateral" />
                    <Tab label="Compliance" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Credit Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Borrower creditworthiness evaluation and scoring</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Collateral Evaluation</Typography>
                  <Typography variant="body2" color="text.secondary">Property valuation and collateral assessment</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance Review</Typography>
                  <Typography variant="body2" color="text.secondary">Regulatory compliance and policy adherence verification</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'applications' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="applications tabs">
                    <Tab label="Queue" />
                    <Tab label="Progress" />
                    <Tab label="Docs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Application Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Loan applications awaiting review and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Track application progress through various stages</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Documentation</Typography>
                  <Typography variant="body2" color="text.secondary">Required documents and verification materials</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-portal' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client portal tabs">
                    <Tab label="Status" />
                    <Tab label="Docs" />
                    <Tab label="Updates" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Application Status</Typography>
                  <Typography variant="body2" color="text.secondary">Real-time loan application status and progress updates</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Document Center</Typography>
                  <Typography variant="body2" color="text.secondary">Secure document upload and management portal</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Updates & Notifications</Typography>
                  <Typography variant="body2" color="text.secondary">Important updates and milestone notifications</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'communication' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="communication tabs">
                    <Tab label="Messages" />
                    <Tab label="Calls" />
                    <Tab label="Notes" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Messages</Typography>
                  <Typography variant="body2" color="text.secondary">Client messaging and communication history</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Call Logs</Typography>
                  <Typography variant="body2" color="text.secondary">Call history and recording management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Meeting notes and client interaction documentation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'opportunities' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="opportunities tabs">
                    <Tab label="Queue" />
                    <Tab label="Analysis" />
                    <Tab label="Tracking" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Investment Opportunities</Typography>
                  <Typography variant="body2" color="text.secondary">Available investment opportunities and deal pipeline</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Investment analysis and due diligence tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Track investment progress and performance</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'portfolio' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="portfolio tabs">
                    <Tab label="Active" />
                    <Tab label="History" />
                    <Tab label="Risk" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Active Investments</Typography>
                  <Typography variant="body2" color="text.secondary">Currently active investment portfolio and performance</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Investment History</Typography>
                  <Typography variant="body2" color="text.secondary">Historical investment data and completed deals</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Risk Management</Typography>
                  <Typography variant="body2" color="text.secondary">Portfolio risk assessment and mitigation strategies</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'investments' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="investments tabs">
                    <Tab label="Active" />
                    <Tab label="History" />
                    <Tab label="Distributions" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Active Investments</Typography>
                  <Typography variant="body2" color="text.secondary">Current investment holdings and positions</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Investment History</Typography>
                  <Typography variant="body2" color="text.secondary">Complete investment transaction history</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Distributions</Typography>
                  <Typography variant="body2" color="text.secondary">Investment distributions and returns tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'performance' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="performance tabs">
                    <Tab label="ROI" />
                    <Tab label="Benchmarks" />
                    <Tab label="KPIs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>ROI Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Return on investment analysis and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Benchmarking</Typography>
                  <Typography variant="body2" color="text.secondary">Performance benchmarking against industry standards</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Key Performance Indicators</Typography>
                  <Typography variant="body2" color="text.secondary">Critical performance metrics and analytics</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'clients' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="clients tabs">
                    <Tab label="Directory" />
                    <Tab label="Profiles" />
                    <Tab label="History" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Comprehensive client directory and contact management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Profiles</Typography>
                  <Typography variant="body2" color="text.secondary">Detailed client profiles and preferences</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Service History</Typography>
                  <Typography variant="body2" color="text.secondary">Complete client service and interaction history</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'planning' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="planning tabs">
                    <Tab label="Goals" />
                    <Tab label="Strategies" />
                    <Tab label="Risk" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Financial Goals</Typography>
                  <Typography variant="body2" color="text.secondary">Client financial goals and objectives tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Investment Strategies</Typography>
                  <Typography variant="body2" color="text.secondary">Investment strategy development and implementation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Risk Assessment</Typography>
                  <Typography variant="body2" color="text.secondary">Risk assessment and mitigation planning</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'advisory' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="advisory tabs">
                    <Tab label="Notes" />
                    <Tab label="Docs" />
                    <Tab label="Reports" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Advisory Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Client advisory notes and recommendations</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Advisory Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Financial planning documents and reports</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Advisory Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Comprehensive advisory reports and analysis</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'deal-structuring' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="deal structuring tabs">
                    <Tab label="Terms" />
                    <Tab label="Docs" />
                    <Tab label="Analysis" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Terms</Typography>
                  <Typography variant="body2" color="text.secondary">Structuring deal terms and conditions</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Legal Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Deal documentation and legal agreements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Financial analysis and deal structuring tools</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'payments' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="payments tabs">
                    <Tab label="Schedule" />
                    <Tab label="History" />
                    <Tab label="Defaults" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">Payment scheduling and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment History</Typography>
                  <Typography variant="body2" color="text.secondary">Complete payment transaction history</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Default Management</Typography>
                  <Typography variant="body2" color="text.secondary">Default tracking and management tools</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'risk' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="risk tabs">
                    <Tab label="Legal" />
                    <Tab label="Market" />
                    <Tab label="Compliance" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Legal Risk</Typography>
                  <Typography variant="body2" color="text.secondary">Legal risk assessment and mitigation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Market Risk</Typography>
                  <Typography variant="body2" color="text.secondary">Market risk analysis and monitoring</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance Risk</Typography>
                  <Typography variant="body2" color="text.secondary">Compliance risk assessment and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'deals' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="deals tabs">
                    <Tab label="Queue" />
                    <Tab label="Docs" />
                    <Tab label="Analysis" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Active deals and transaction pipeline</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Deal documentation and legal agreements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Deal analysis and due diligence tools</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'finances' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="finances tabs">
                    <Tab label="Cash Flow" />
                    <Tab label="Equity" />
                    <Tab label="Payments" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cash Flow Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Cash flow analysis and projections</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equity Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Equity position and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Payment processing and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'trusts' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="trusts tabs">
                    <Tab label="Queue" />
                    <Tab label="Analysis" />
                    <Tab label="Docs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Trust Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Trust acquisition opportunities and pipeline</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Trust Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Trust analysis and due diligence</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Trust Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Trust documentation and legal agreements</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'legal' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="legal tabs">
                    <Tab label="Review" />
                    <Tab label="Compliance" />
                    <Tab label="Filing" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Legal Review</Typography>
                  <Typography variant="body2" color="text.secondary">Legal document review and analysis</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Legal compliance and regulatory adherence</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Filing</Typography>
                  <Typography variant="body2" color="text.secondary">Legal filing and document management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'financials' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="financials tabs">
                    <Tab label="Valuation" />
                    <Tab label="ROI" />
                    <Tab label="Risks" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Valuation</Typography>
                  <Typography variant="body2" color="text.secondary">Property valuation and assessment tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>ROI Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Return on investment analysis and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Risk Assessment</Typography>
                  <Typography variant="body2" color="text.secondary">Financial risk assessment and mitigation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'structuring' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="structuring tabs">
                    <Tab label="Terms" />
                    <Tab label="Payments" />
                    <Tab label="Options" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Terms</Typography>
                  <Typography variant="body2" color="text.secondary">Structuring deal terms and conditions</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment Structure</Typography>
                  <Typography variant="body2" color="text.secondary">Payment structuring and scheduling</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Deal Options</Typography>
                  <Typography variant="body2" color="text.secondary">Various deal structuring options and alternatives</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'leases' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="leases tabs">
                    <Tab label="Agreements" />
                    <Tab label="Renewals" />
                    <Tab label="Terms" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lease Agreements</Typography>
                  <Typography variant="body2" color="text.secondary">Lease agreement management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lease Renewals</Typography>
                  <Typography variant="body2" color="text.secondary">Lease renewal management and scheduling</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lease Terms</Typography>
                  <Typography variant="body2" color="text.secondary">Lease terms and conditions management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'options' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="options tabs">
                    <Tab label="Queue" />
                    <Tab label="Tracking" />
                    <Tab label="Expirations" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Option Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Lease option opportunities and pipeline</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Option Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Track lease option progress and status</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Option Expirations</Typography>
                  <Typography variant="body2" color="text.secondary">Manage option expiration dates and renewals</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'projects' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="projects tabs">
                    <Tab label="Timeline" />
                    <Tab label="Budget" />
                    <Tab label="Resources" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Project Timeline</Typography>
                  <Typography variant="body2" color="text.secondary">Project scheduling and timeline management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Budget Management</Typography>
                  <Typography variant="body2" color="text.secondary">Project budget tracking and cost management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Resource Allocation</Typography>
                  <Typography variant="body2" color="text.secondary">Resource planning and allocation management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'subcontractors' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="subcontractors tabs">
                    <Tab label="Directory" />
                    <Tab label="Work Orders" />
                    <Tab label="Payments" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Subcontractor Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Subcontractor directory and contact management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Work Orders</Typography>
                  <Typography variant="body2" color="text.secondary">Work order management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Subcontractor payment processing and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'quality-control' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="quality control tabs">
                    <Tab label="Inspections" />
                    <Tab label="Compliance" />
                    <Tab label="Safety" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quality Inspections</Typography>
                  <Typography variant="body2" color="text.secondary">Quality inspection management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Compliance monitoring and reporting</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Safety</Typography>
                  <Typography variant="body2" color="text.secondary">Safety protocols and incident management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'code-compliance' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="code compliance tabs">
                    <Tab label="Requirements" />
                    <Tab label="Inspections" />
                    <Tab label="Docs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Code Requirements</Typography>
                  <Typography variant="body2" color="text.secondary">Building code requirements and standards</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Code Inspections</Typography>
                  <Typography variant="body2" color="text.secondary">Code compliance inspection management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Code compliance documentation and certificates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'work-orders' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="work orders tabs">
                    <Tab label="Queue" />
                    <Tab label="Assignments" />
                    <Tab label="Progress" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Work Order Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Work order queue and priority management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Assignments</Typography>
                  <Typography variant="body2" color="text.secondary">Work order assignment and scheduling</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Work order progress tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'service-calls' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="service calls tabs">
                    <Tab label="Queue" />
                    <Tab label="History" />
                    <Tab label="Scheduling" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Service Call Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Service call queue and priority management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Call History</Typography>
                  <Typography variant="body2" color="text.secondary">Service call history and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Scheduling</Typography>
                  <Typography variant="body2" color="text.secondary">Service call scheduling and dispatch</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'inventory' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="inventory tabs">
                    <Tab label="Materials" />
                    <Tab label="Suppliers" />
                    <Tab label="Costs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Materials Inventory</Typography>
                  <Typography variant="body2" color="text.secondary">Material inventory management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Supplier Management</Typography>
                  <Typography variant="body2" color="text.secondary">Supplier directory and relationship management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cost Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Material cost tracking and analysis</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'maintenance' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="maintenance tabs">
                    <Tab label="Calendar" />
                    <Tab label="Equipment" />
                    <Tab label="Clients" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Maintenance Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">Maintenance scheduling and calendar management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equipment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Equipment maintenance and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Maintenance</Typography>
                  <Typography variant="body2" color="text.secondary">Client maintenance service management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'weather-tracking' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="weather tracking tabs">
                    <Tab label="Forecast" />
                    <Tab label="Delays" />
                    <Tab label="Safety" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Weather Forecast</Typography>
                  <Typography variant="body2" color="text.secondary">Weather forecasting and monitoring</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Project Delays</Typography>
                  <Typography variant="body2" color="text.secondary">Weather-related project delay management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Safety Protocols</Typography>
                  <Typography variant="body2" color="text.secondary">Weather safety protocols and procedures</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'materials' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="materials tabs">
                    <Tab label="Inventory" />
                    <Tab label="Suppliers" />
                    <Tab label="Costs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Material Inventory</Typography>
                  <Typography variant="body2" color="text.secondary">Material inventory management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Supplier Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Material supplier directory and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cost Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Material cost analysis and budgeting</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'color-consultation' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="color consultation tabs">
                    <Tab label="Palettes" />
                    <Tab label="Preferences" />
                    <Tab label="Matching" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Color Palettes</Typography>
                  <Typography variant="body2" color="text.secondary">Color palette creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Preferences</Typography>
                  <Typography variant="body2" color="text.secondary">Client color preferences and history</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Color Matching</Typography>
                  <Typography variant="body2" color="text.secondary">Color matching tools and techniques</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-collaboration' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client collaboration tabs">
                    <Tab label="Notes" />
                    <Tab label="Feedback" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Collaboration Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Client collaboration notes and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback collection and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Approval Workflow</Typography>
                  <Typography variant="body2" color="text.secondary">Client approval workflow and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'seasonal-planning' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="seasonal planning tabs">
                    <Tab label="Planting" />
                    <Tab label="Weather" />
                    <Tab label="Schedules" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Planting Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal planting schedule and planning</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Weather Planning</Typography>
                  <Typography variant="body2" color="text.secondary">Weather-based seasonal planning</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Seasonal Schedules</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal maintenance and care schedules</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'equipment' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="equipment tabs">
                    <Tab label="Inventory" />
                    <Tab label="Suppliers" />
                    <Tab label="Costs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equipment Inventory</Typography>
                  <Typography variant="body2" color="text.secondary">Equipment inventory management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equipment Suppliers</Typography>
                  <Typography variant="body2" color="text.secondary">Equipment supplier directory and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equipment Costs</Typography>
                  <Typography variant="body2" color="text.secondary">Equipment cost tracking and analysis</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'installation' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="installation tabs">
                    <Tab label="Schedule" />
                    <Tab label="Progress" />
                    <Tab label="Quality" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Installation Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">Installation scheduling and timeline management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Installation progress tracking and updates</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quality Control</Typography>
                  <Typography variant="body2" color="text.secondary">Installation quality control and inspection</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'design-collaboration' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="design collaboration tabs">
                    <Tab label="Tools" />
                    <Tab label="3D" />
                    <Tab label="Feedback" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Tools</Typography>
                  <Typography variant="body2" color="text.secondary">Design collaboration tools and software</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>3D Modeling</Typography>
                  <Typography variant="body2" color="text.secondary">3D modeling and visualization tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback collection and integration</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'fixtures' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="fixtures tabs">
                    <Tab label="Selection" />
                    <Tab label="Suppliers" />
                    <Tab label="Tracking" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Fixture Selection</Typography>
                  <Typography variant="body2" color="text.secondary">Fixture selection and specification tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Fixture Suppliers</Typography>
                  <Typography variant="body2" color="text.secondary">Fixture supplier directory and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Order Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Fixture order tracking and delivery management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'presentations' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="presentations tabs">
                    <Tab label="Boards" />
                    <Tab label="Slides" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Boards</Typography>
                  <Typography variant="body2" color="text.secondary">Design presentation boards and mood boards</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Presentation Slides</Typography>
                  <Typography variant="body2" color="text.secondary">Presentation slide creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">Client approval workflow and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'blueprints' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="blueprints tabs">
                    <Tab label="Versions" />
                    <Tab label="Approvals" />
                    <Tab label="Archive" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Blueprint Versions</Typography>
                  <Typography variant="body2" color="text.secondary">Blueprint version control and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Approval Process</Typography>
                  <Typography variant="body2" color="text.secondary">Blueprint approval workflow and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Archive</Typography>
                  <Typography variant="body2" color="text.secondary">Blueprint archive and historical records</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-approvals' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client approvals tabs">
                    <Tab label="Notes" />
                    <Tab label="Feedback" />
                    <Tab label="Signatures" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Approval Notes</Typography>
                  <Typography variant="body2" color="text.secondary">Client approval notes and comments</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback collection and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Digital Signatures</Typography>
                  <Typography variant="body2" color="text.secondary">Digital signature collection and verification</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'site-analysis' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="site analysis tabs">
                    <Tab label="Assessments" />
                    <Tab label="Environment" />
                    <Tab label="Planning" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Site Assessments</Typography>
                  <Typography variant="body2" color="text.secondary">Site assessment and evaluation tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Environmental Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Environmental impact analysis and assessment</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Planning Tools</Typography>
                  <Typography variant="body2" color="text.secondary">Site planning and development tools</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'designs' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="designs tabs">
                    <Tab label="Plans" />
                    <Tab label="Revisions" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Plans</Typography>
                  <Typography variant="body2" color="text.secondary">Design plan creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Revisions</Typography>
                  <Typography variant="body2" color="text.secondary">Design revision tracking and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">Design approval workflow and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === '3d-modeling' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="3d modeling tabs">
                    <Tab label="Visualization" />
                    <Tab label="Approvals" />
                    <Tab label="Iterations" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>3D Visualization</Typography>
                  <Typography variant="body2" color="text.secondary">3D modeling and visualization tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">3D model approval workflow and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Iterations</Typography>
                  <Typography variant="body2" color="text.secondary">Design iteration tracking and version control</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-presentations' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client presentations tabs">
                    <Tab label="Slides" />
                    <Tab label="Boards" />
                    <Tab label="Feedback" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Presentation Slides</Typography>
                  <Typography variant="body2" color="text.secondary">Client presentation slide creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Design Boards</Typography>
                  <Typography variant="body2" color="text.secondary">Design presentation boards and materials</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback collection and integration</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'lighting-plans' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="lighting plans tabs">
                    <Tab label="Fixtures" />
                    <Tab label="Energy" />
                    <Tab label="Schemes" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lighting Fixtures</Typography>
                  <Typography variant="body2" color="text.secondary">Lighting fixture selection and specification</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Efficiency</Typography>
                  <Typography variant="body2" color="text.secondary">Energy-efficient lighting design and planning</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lighting Schemes</Typography>
                  <Typography variant="body2" color="text.secondary">Lighting scheme design and implementation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'custom-orders' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="custom orders tabs">
                    <Tab label="Specs" />
                    <Tab label="Tracking" />
                    <Tab label="Manufacturing" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Order Specifications</Typography>
                  <Typography variant="body2" color="text.secondary">Custom order specifications and requirements</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Order Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Custom order tracking and status updates</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Manufacturing</Typography>
                  <Typography variant="body2" color="text.secondary">Manufacturing process and timeline management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'color-schemes' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="color schemes tabs">
                    <Tab label="Palettes" />
                    <Tab label="Matching" />
                    <Tab label="Preferences" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Color Palettes</Typography>
                  <Typography variant="body2" color="text.secondary">Color palette creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Color Matching</Typography>
                  <Typography variant="body2" color="text.secondary">Color matching tools and techniques</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Preferences</Typography>
                  <Typography variant="body2" color="text.secondary">Client color preferences and history</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'portfolio' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="portfolio tabs">
                    <Tab label="Properties" />
                    <Tab label="Details" />
                    <Tab label="Tenants" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Portfolio</Typography>
                  <Typography variant="body2" color="text.secondary">Property portfolio management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Details</Typography>
                  <Typography variant="body2" color="text.secondary">Detailed property information and specifications</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tenant Management</Typography>
                  <Typography variant="body2" color="text.secondary">Tenant directory and relationship management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'tenants' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="tenants tabs">
                    <Tab label="Directory" />
                    <Tab label="Leases" />
                    <Tab label="Communication" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tenant Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Tenant directory and contact management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lease Management</Typography>
                  <Typography variant="body2" color="text.secondary">Lease agreement management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Communication</Typography>
                  <Typography variant="body2" color="text.secondary">Tenant communication and messaging</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'bookings' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="bookings tabs">
                    <Tab label="Calendar" />
                    <Tab label="Guests" />
                    <Tab label="Pricing" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Booking Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">Booking calendar and availability management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Guest Management</Typography>
                  <Typography variant="body2" color="text.secondary">Guest information and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Pricing Management</Typography>
                  <Typography variant="body2" color="text.secondary">Dynamic pricing and rate management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'guest-services' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="guest services tabs">
                    <Tab label="Check-in" />
                    <Tab label="Requests" />
                    <Tab label="Feedback" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Check-in Process</Typography>
                  <Typography variant="body2" color="text.secondary">Guest check-in process and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Guest Requests</Typography>
                  <Typography variant="body2" color="text.secondary">Guest request management and fulfillment</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Guest Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Guest feedback collection and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'channel-management' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="channel management tabs">
                    <Tab label="Integration" />
                    <Tab label="Pricing" />
                    <Tab label="Sync" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Channel Integration</Typography>
                  <Typography variant="body2" color="text.secondary">OTA channel integration and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Pricing Strategy</Typography>
                  <Typography variant="body2" color="text.secondary">Multi-channel pricing strategy and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Data Synchronization</Typography>
                  <Typography variant="body2" color="text.secondary">Channel data synchronization and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'analytics' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="analytics tabs">
                    <Tab label="Performance" />
                    <Tab label="Occupancy" />
                    <Tab label="Revenue" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Performance Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">Property performance analytics and insights</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Occupancy Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">Occupancy rate analysis and trends</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Revenue Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">Revenue analysis and financial insights</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'schedules' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="schedules tabs">
                    <Tab label="Calendar" />
                    <Tab label="Assignments" />
                    <Tab label="Clients" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Service Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">Service scheduling and calendar management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Assignment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Service assignment and dispatch management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Scheduling</Typography>
                  <Typography variant="body2" color="text.secondary">Client-specific scheduling and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'tasks' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="tasks tabs">
                    <Tab label="Cleaning" />
                    <Tab label="Staging" />
                    <Tab label="Turnovers" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cleaning Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">Cleaning task management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Staging Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">Property staging task management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Turnover Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">Property turnover task management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'quality-control' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="quality control tabs">
                    <Tab label="Inspections" />
                    <Tab label="Photos" />
                    <Tab label="Standards" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quality Inspections</Typography>
                  <Typography variant="body2" color="text.secondary">Quality inspection management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photo Documentation</Typography>
                  <Typography variant="body2" color="text.secondary">Photo documentation and verification</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quality Standards</Typography>
                  <Typography variant="body2" color="text.secondary">Quality standards and compliance management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'seasonal-tasks' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="seasonal tasks tabs">
                    <Tab label="Planning" />
                    <Tab label="Weather" />
                    <Tab label="Resources" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Seasonal Planning</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal task planning and scheduling</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Weather Considerations</Typography>
                  <Typography variant="body2" color="text.secondary">Weather-based seasonal task planning</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Resource Management</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal resource planning and allocation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'tree-health' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="tree health tabs">
                    <Tab label="Assessments" />
                    <Tab label="Treatments" />
                    <Tab label="Tracking" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tree Assessments</Typography>
                  <Typography variant="body2" color="text.secondary">Tree health assessment and evaluation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Treatment Plans</Typography>
                  <Typography variant="body2" color="text.secondary">Tree treatment planning and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Health Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Tree health tracking and monitoring</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'care-plans' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="care plans tabs">
                    <Tab label="Care Plans" />
                    <Tab label="Progress" />
                    <Tab label="Reports" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tree Care Plans</Typography>
                  <Typography variant="body2" color="text.secondary">Tree care plan development and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Care plan progress tracking and updates</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Care Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Tree care reports and documentation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'applications' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="applications tabs">
                    <Tab label="Queue" />
                    <Tab label="Verification" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Application Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Tenant application queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Verification Process</Typography>
                  <Typography variant="body2" color="text.secondary">Application verification and screening</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Application Status</Typography>
                  <Typography variant="body2" color="text.secondary">Application status tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'background-checks' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="background checks tabs">
                    <Tab label="Credit" />
                    <Tab label="Evictions" />
                    <Tab label="References" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Credit Checks</Typography>
                  <Typography variant="body2" color="text.secondary">Credit check processing and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Eviction History</Typography>
                  <Typography variant="body2" color="text.secondary">Eviction history verification and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Reference Checks</Typography>
                  <Typography variant="body2" color="text.secondary">Reference verification and contact management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'compliance' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="compliance tabs">
                    <Tab label="Docs" />
                    <Tab label="Laws" />
                    <Tab label="Reports" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Compliance document management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Legal Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Legal compliance monitoring and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Compliance reporting and documentation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'showings' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="showings tabs">
                    <Tab label="Schedule" />
                    <Tab label="Clients" />
                    <Tab label="Properties" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Showing Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">Property showing scheduling and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Client showing coordination and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Access</Typography>
                  <Typography variant="body2" color="text.secondary">Property access management and coordination</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'negotiations' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="negotiations tabs">
                    <Tab label="Terms" />
                    <Tab label="Offers" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Negotiation Terms</Typography>
                  <Typography variant="body2" color="text.secondary">Lease negotiation terms and conditions</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Offer Management</Typography>
                  <Typography variant="body2" color="text.secondary">Offer creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Approval Process</Typography>
                  <Typography variant="body2" color="text.secondary">Offer approval workflow and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'leases' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="leases tabs">
                    <Tab label="Drafts" />
                    <Tab label="Signatures" />
                    <Tab label="Tracking" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lease Drafts</Typography>
                  <Typography variant="body2" color="text.secondary">Lease document drafting and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Digital Signatures</Typography>
                  <Typography variant="body2" color="text.secondary">Digital signature collection and verification</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lease Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Lease status tracking and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'records' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="records tabs">
                    <Tab label="Transactions" />
                    <Tab label="Reconciliation" />
                    <Tab label="Journals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Transaction Records</Typography>
                  <Typography variant="body2" color="text.secondary">Financial transaction recording and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Bank Reconciliation</Typography>
                  <Typography variant="body2" color="text.secondary">Bank reconciliation and account balancing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Journal Entries</Typography>
                  <Typography variant="body2" color="text.secondary">Journal entry creation and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'financials' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="financials tabs">
                    <Tab label="Analysis" />
                    <Tab label="Budgets" />
                    <Tab label="Costs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Financial Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Financial analysis and reporting</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Budget Management</Typography>
                  <Typography variant="body2" color="text.secondary">Budget creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cost Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Cost tracking and analysis</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'tax-prep' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="tax prep tabs">
                    <Tab label="Queue" />
                    <Tab label="Clients" />
                    <Tab label="Filings" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Prep Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Tax preparation queue and workflow</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Tax client management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Filings</Typography>
                  <Typography variant="body2" color="text.secondary">Tax filing management and submission</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'shoots' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="shoots tabs">
                    <Tab label="Schedule" />
                    <Tab label="Clients" />
                    <Tab label="Equipment" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Shoot Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">Photography shoot scheduling and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Photography client management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equipment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Photography equipment management and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'editing' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="editing tabs">
                    <Tab label="Tools" />
                    <Tab label="Galleries" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Editing Tools</Typography>
                  <Typography variant="body2" color="text.secondary">Photo/video editing tools and software</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Galleries</Typography>
                  <Typography variant="body2" color="text.secondary">Client gallery creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">Client approval workflow and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'portfolio' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="portfolio tabs">
                    <Tab label="Gallery" />
                    <Tab label="Sales" />
                    <Tab label="Marketing" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Portfolio Gallery</Typography>
                  <Typography variant="body2" color="text.secondary">Portfolio gallery creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Sales Management</Typography>
                  <Typography variant="body2" color="text.secondary">Portfolio sales and licensing management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Marketing</Typography>
                  <Typography variant="body2" color="text.secondary">Portfolio marketing and promotion</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'projects' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="projects tabs">
                    <Tab label="Queue" />
                    <Tab label="Clients" />
                    <Tab label="Equipment" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Project Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Video project queue and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Video client management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Equipment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Video equipment management and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'tech-integration' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="tech integration tabs">
                    <Tab label="Tools" />
                    <Tab label="APIs" />
                    <Tab label="Optimization" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Development Tools</Typography>
                  <Typography variant="body2" color="text.secondary">AR/VR development tools and software</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>API Integration</Typography>
                  <Typography variant="body2" color="text.secondary">API integration and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Performance Optimization</Typography>
                  <Typography variant="body2" color="text.secondary">Performance optimization and testing</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-collaboration' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client collaboration tabs">
                    <Tab label="Training" />
                    <Tab label="Feedback" />
                    <Tab label="Approvals" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Training</Typography>
                  <Typography variant="body2" color="text.secondary">Client training and onboarding</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback collection and integration</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Project Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">Project approval workflow and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'modeling' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="modeling tabs">
                    <Tab label="Tools" />
                    <Tab label="Clients" />
                    <Tab label="Iterations" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Modeling Tools</Typography>
                  <Typography variant="body2" color="text.secondary">Digital twin modeling tools and software</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Digital twin client management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Model Iterations</Typography>
                  <Typography variant="body2" color="text.secondary">Model iteration tracking and version control</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'virtual-tours' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="virtual tours tabs">
                    <Tab label="Creation" />
                    <Tab label="Features" />
                    <Tab label="Clients" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tour Creation</Typography>
                  <Typography variant="body2" color="text.secondary">Virtual tour creation and development</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Interactive Features</Typography>
                  <Typography variant="body2" color="text.secondary">Interactive tour features and functionality</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">Client tour delivery and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'permits' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="permits tabs">
                    <Tab label="Queue" />
                    <Tab label="Applications" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Permit Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Permit application queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Permit Applications</Typography>
                  <Typography variant="body2" color="text.secondary">Permit application creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Status Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Permit status tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'docs' && currentRoleKey !== 'tax-advisor' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="docs tabs">
                    <Tab label="Filing" />
                    <Tab label="Compliance" />
                    <Tab label="Clients" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Document Filing</Typography>
                  <Typography variant="body2" color="text.secondary">Document filing and submission management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Compliance document management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Client document management and communication</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'analysis' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="analysis tabs">
                    <Tab label="Tools" />
                    <Tab label="Reports" />
                    <Tab label="Audits" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Analysis Tools</Typography>
                  <Typography variant="body2" color="text.secondary">Energy analysis tools and software</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Analysis Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Energy analysis report generation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Audits</Typography>
                  <Typography variant="body2" color="text.secondary">Energy audit management and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'advisory' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="advisory tabs">
                    <Tab label="Clients" />
                    <Tab label="Plans" />
                    <Tab label="Tracking" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Advisory Clients</Typography>
                  <Typography variant="body2" color="text.secondary">Energy advisory client management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Energy Plans</Typography>
                  <Typography variant="body2" color="text.secondary">Energy efficiency plan development</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Energy efficiency progress tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'implementation' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="implementation tabs">
                    <Tab label="Tasks" />
                    <Tab label="Status" />
                    <Tab label="Metrics" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Implementation Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">Energy efficiency implementation task management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Project Status</Typography>
                  <Typography variant="body2" color="text.secondary">Implementation project status tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Performance Metrics</Typography>
                  <Typography variant="body2" color="text.secondary">Energy efficiency performance metrics and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'estate-plans' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="estate plans tabs">
                    <Tab label="Wills" />
                    <Tab label="Trusts" />
                    <Tab label="Strategies" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Will Creation</Typography>
                  <Typography variant="body2" color="text.secondary">Will creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Trust Management</Typography>
                  <Typography variant="body2" color="text.secondary">Trust creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Estate Strategies</Typography>
                  <Typography variant="body2" color="text.secondary">Estate planning strategy development</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'exchanges' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="exchanges tabs">
                    <Tab label="Queue" />
                    <Tab label="Properties" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Exchange Queue</Typography>
                  <Typography variant="body2" color="text.secondary">1031 exchange queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Management</Typography>
                  <Typography variant="body2" color="text.secondary">Exchange property management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Exchange Status</Typography>
                  <Typography variant="body2" color="text.secondary">Exchange status tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'formations' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="formations tabs">
                    <Tab label="Queue" />
                    <Tab label="Entity Types" />
                    <Tab label="Clients" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Formation Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Entity formation queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Entity Types</Typography>
                  <Typography variant="body2" color="text.secondary">Entity type selection and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Entity formation client management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'transactions' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="transactions tabs">
                    <Tab label="Queue" />
                    <Tab label="Parties" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Transaction Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Escrow transaction queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Party Management</Typography>
                  <Typography variant="body2" color="text.secondary">Transaction party management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Transaction Status</Typography>
                  <Typography variant="body2" color="text.secondary">Transaction status tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'appointments' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="appointments tabs">
                    <Tab label="Calendar" />
                    <Tab label="Clients" />
                    <Tab label="Types" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Appointment Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">Notary appointment scheduling and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Notary client management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Service Types</Typography>
                  <Typography variant="body2" color="text.secondary">Notary service type management and tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'verification' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="verification tabs">
                    <Tab label="Docs" />
                    <Tab label="Compliance" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Document Verification</Typography>
                  <Typography variant="body2" color="text.secondary">Document verification and authentication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Notary compliance and regulatory adherence</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Verification Status</Typography>
                  <Typography variant="body2" color="text.secondary">Verification status tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'certificates' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="certificates tabs">
                    <Tab label="Queue" />
                    <Tab label="History" />
                    <Tab label="Storage" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Certificate Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Notary certificate queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Certificate History</Typography>
                  <Typography variant="body2" color="text.secondary">Certificate history and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Digital Storage</Typography>
                  <Typography variant="body2" color="text.secondary">Digital certificate storage and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'courses' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="courses tabs">
                    <Tab label="Library" />
                    <Tab label="Content" />
                    <Tab label="Enrollment" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Course Library</Typography>
                  <Typography variant="body2" color="text.secondary">Real estate education course library and catalog</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Course Content</Typography>
                  <Typography variant="body2" color="text.secondary">Course content creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Student Enrollment</Typography>
                  <Typography variant="body2" color="text.secondary">Student enrollment and progress tracking</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'students' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="students tabs">
                    <Tab label="Directory" />
                    <Tab label="Progress" />
                    <Tab label="Feedback" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Student Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Student directory and contact management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Student progress tracking and analytics</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Student Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Student feedback collection and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'assessments' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="assessments tabs">
                    <Tab label="Assignments" />
                    <Tab label="Tracking" />
                    <Tab label="Grades" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Assessment Assignments</Typography>
                  <Typography variant="body2" color="text.secondary">Assessment assignment creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Assessment progress tracking and analytics</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Grade Management</Typography>
                  <Typography variant="body2" color="text.secondary">Grade management and reporting</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'moves' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="moves tabs">
                    <Tab label="Schedule" />
                    <Tab label="Clients" />
                    <Tab label="Coordination" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Move Scheduling</Typography>
                  <Typography variant="body2" color="text.secondary">Relocation move scheduling and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Relocation client management and communication</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Move Coordination</Typography>
                  <Typography variant="body2" color="text.secondary">Move coordination and logistics management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'support' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="support tabs">
                    <Tab label="Requests" />
                    <Tab label="Issues" />
                    <Tab label="Resolutions" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Support Requests</Typography>
                  <Typography variant="body2" color="text.secondary">Relocation support request management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Issue Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Issue tracking and resolution management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Resolution Management</Typography>
                  <Typography variant="body2" color="text.secondary">Issue resolution tracking and follow-up</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'vendors' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="vendors tabs">
                    <Tab label="Directory" />
                    <Tab label="Services" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Vendor Directory</Typography>
                  <Typography variant="body2" color="text.secondary">Relocation vendor directory and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Service Management</Typography>
                  <Typography variant="body2" color="text.secondary">Vendor service management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Vendor Status</Typography>
                  <Typography variant="body2" color="text.secondary">Vendor status tracking and performance monitoring</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'surveys' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="surveys tabs">
                    <Tab label="Queue" />
                    <Tab label="Properties" />
                    <Tab label="Status" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Survey Queue</Typography>
                  <Typography variant="body2" color="text.secondary">Land survey queue and processing</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Surveys</Typography>
                  <Typography variant="body2" color="text.secondary">Property survey management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Survey Status</Typography>
                  <Typography variant="body2" color="text.secondary">Survey status tracking and updates</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'data' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="data tabs">
                    <Tab label="Maps" />
                    <Tab label="Boundaries" />
                    <Tab label="Docs" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Survey Maps</Typography>
                  <Typography variant="body2" color="text.secondary">Survey map creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Boundary Data</Typography>
                  <Typography variant="body2" color="text.secondary">Property boundary data and documentation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Survey Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Survey document management and storage</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'templates' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="templates tabs">
                    <Tab label="Templates" />
                    <Tab label="History" />
                    <Tab label="QC" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Report Templates</Typography>
                  <Typography variant="body2" color="text.secondary">Survey report template creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Report History</Typography>
                  <Typography variant="body2" color="text.secondary">Survey report history and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quality Control</Typography>
                  <Typography variant="body2" color="text.secondary">Survey report quality control and review</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'setup' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="setup tabs">
                    <Tab label="Listings" />
                    <Tab label="Amenities" />
                    <Tab label="Photography" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Listings</Typography>
                  <Typography variant="body2" color="text.secondary">STR property listing creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Amenity Management</Typography>
                  <Typography variant="body2" color="text.secondary">Property amenity management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photography Setup</Typography>
                  <Typography variant="body2" color="text.secondary">Property photography setup and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'turnovers' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="turnovers tabs">
                    <Tab label="Schedule" />
                    <Tab label="Assignments" />
                    <Tab label="Clients" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Turnover Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">Property turnover scheduling and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Assignment Management</Typography>
                  <Typography variant="body2" color="text.secondary">Turnover assignment and task management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Management</Typography>
                  <Typography variant="body2" color="text.secondary">Turnover client management and communication</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'inspections' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="inspections tabs">
                    <Tab label="Reports" />
                    <Tab label="Feedback" />
                    <Tab label="Standards" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Inspection Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Turnover inspection report creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Client Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">Inspection feedback collection and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Quality Standards</Typography>
                  <Typography variant="body2" color="text.secondary">Inspection quality standards and compliance</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'asset-eval' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="asset eval tabs">
                    <Tab label="Market" />
                    <Tab label="Valuation" />
                    <Tab label="Comps" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Market Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Asset market analysis and trends</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Asset Valuation</Typography>
                  <Typography variant="body2" color="text.secondary">Asset valuation and appraisal</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Comparable Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Comparable property analysis and research</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'client-feedback' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="client feedback tabs">
                    <Tab label="Collection" />
                    <Tab label="Analysis" />
                    <Tab label="Action" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Feedback Collection</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback collection and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Feedback Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">Client feedback analysis and insights</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Action Planning</Typography>
                  <Typography variant="body2" color="text.secondary">Action planning based on client feedback</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'collaboration' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="collaboration tabs">
                    <Tab label="Teams" />
                    <Tab label="Projects" />
                    <Tab label="Tools" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Team Collaboration</Typography>
                  <Typography variant="body2" color="text.secondary">Team collaboration and communication tools</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Project Collaboration</Typography>
                  <Typography variant="body2" color="text.secondary">Project collaboration and workflow management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Collaboration Tools</Typography>
                  <Typography variant="body2" color="text.secondary">Collaboration tools and integrations</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'loan-tracking' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="loan tracking tabs">
                    <Tab label="Payments" />
                    <Tab label="Defaults" />
                    <Tab label="Extensions" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Payment Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">Loan payment tracking and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Default Management</Typography>
                  <Typography variant="body2" color="text.secondary">Loan default tracking and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Extension Management</Typography>
                  <Typography variant="body2" color="text.secondary">Loan extension tracking and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'market-analysis' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="market analysis tabs">
                    <Tab label="Trends" />
                    <Tab label="Reports" />
                    <Tab label="Forecasts" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Market Trends</Typography>
                  <Typography variant="body2" color="text.secondary">Real estate market trend analysis</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Analysis Reports</Typography>
                  <Typography variant="body2" color="text.secondary">Market analysis report generation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Market Forecasts</Typography>
                  <Typography variant="body2" color="text.secondary">Market forecasting and predictions</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'repairs' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="repairs tabs">
                    <Tab label="Plumbing" />
                    <Tab label="Electrical" />
                    <Tab label="Carpentry" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Plumbing Repairs</Typography>
                  <Typography variant="body2" color="text.secondary">Plumbing repair work orders and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Electrical Repairs</Typography>
                  <Typography variant="body2" color="text.secondary">Electrical repair work orders and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Carpentry Repairs</Typography>
                  <Typography variant="body2" color="text.secondary">Carpentry repair work orders and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'seasonal' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="seasonal tabs">
                    <Tab label="Planning" />
                    <Tab label="Tasks" />
                    <Tab label="Resources" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Seasonal Planning</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal planning and preparation</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Seasonal Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal task management and tracking</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Seasonal Resources</Typography>
                  <Typography variant="body2" color="text.secondary">Seasonal resource management and allocation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'strategies' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="strategies tabs">
                    <Tab label="Recommendations" />
                    <Tab label="Docs" />
                    <Tab label="Plans" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Strategy Recommendations</Typography>
                  <Typography variant="body2" color="text.secondary">Strategic recommendations and advice</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Strategy Documents</Typography>
                  <Typography variant="body2" color="text.secondary">Strategy document creation and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Strategic Plans</Typography>
                  <Typography variant="body2" color="text.secondary">Strategic planning and implementation</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'tax-planning' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="tax planning tabs">
                    <Tab label="Strategies" />
                    <Tab label="Compliance" />
                    <Tab label="Filing" />
                  </Tabs>
                </Box>
                <TabPanel value={state.subTab} index={0}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Strategies</Typography>
                  <Typography variant="body2" color="text.secondary">Tax planning strategies and optimization</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={1}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Compliance</Typography>
                  <Typography variant="body2" color="text.secondary">Tax compliance monitoring and management</Typography>
                </TabPanel>
                <TabPanel value={state.subTab} index={2}>
                  <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Tax Filing</Typography>
                  <Typography variant="body2" color="text.secondary">Tax filing preparation and management</Typography>
                </TabPanel>
              </Box>
            )}

            {state.activeTab === 'advanced' && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={state.subTab} onChange={handleSubTabChange} aria-label="advanced tabs">
                    {currentRoleKey === 'acquisition-specialist' ? (
                      <>
                        <Tab label="Data Feeds" />
                        <Tab label="AI Calculator" />
                        <Tab label="Skip Tracing" />
                        <Tab label="Automated Outreach" />
                      </>
                    ) : currentRoleKey === 'disposition-agent' ? (
                      <>
                        <Tab label="Investor Marketplace" />
                        <Tab label="Proof of Funds" />
                        <Tab label="E-sign Offers" />
                        <Tab label="Property Flyers" />
                      </>
                    ) : currentRoleKey === 'title-agent' ? (
                      <>
                        <Tab label="County Records" />
                        <Tab label="Lien/Judgment Pull" />
                        <Tab label="AI Search Summaries" />
                        <Tab label="Escrow Integration" />
                      </>
                    ) : currentRoleKey === 'escrow-officer' ? (
                      <>
                        <Tab label="Bank Integration" />
                        <Tab label="Automated Rules" />
                        <Tab label="Audit Logs" />
                        <Tab label="Fraud Detection" />
                      </>
                    ) : currentRoleKey === 'notary-public' ? (
                      <>
                        <Tab label="RON Platform" />
                        <Tab label="KBA/ID APIs" />
                        <Tab label="Digital Seals" />
                        <Tab label="GPS Check-in" />
                      </>
                    ) : currentRoleKey === 'residential-appraiser' ? (
                      <>
                        <Tab label="MLS/AMC Feeds" />
                        <Tab label="AI Appraisal Draft" />
                        <Tab label="Photo Analysis" />
                        <Tab label="USPAP Compliance" />
                      </>
                    ) : currentRoleKey === 'home-inspector' ? (
                      <>
                        <Tab label="Mobile Offline" />
                        <Tab label="AI Defect Tagging" />
                        <Tab label="Voice-to-Text" />
                        <Tab label="360° Camera" />
                      </>
                    ) : currentRoleKey === 'commercial-inspector' ? (
                      <>
                        <Tab label="OSHA/Compliance" />
                        <Tab label="Municipal Codes" />
                        <Tab label="Drone Support" />
                      </>
                    ) : currentRoleKey === 'energy-inspector' ? (
                      <>
                        <Tab label="DOE/Energy Star" />
                        <Tab label="AI ROI Calculators" />
                        <Tab label="IoT/Smart Meters" />
                      </>
                    ) : currentRoleKey === 'insurance-agent' ? (
                      <>
                        <Tab label="Carrier APIs" />
                        <Tab label="Claims Automation" />
                        <Tab label="Digital COIs" />
                        <Tab label="AI Risk Assessment" />
                      </>
                    ) : currentRoleKey === 'title-insurance-agent' ? (
                      <>
                        <Tab label="Title Insurer APIs" />
                        <Tab label="AI Endorsement Drafting" />
                        <Tab label="Automated Renewals" />
                        <Tab label="Escrow Sync" />
                      </>
                    ) : (
                      <>
                        <Tab label="Income Models" />
                        <Tab label="Cap Rate DB" />
                        <Tab label="Cost Calculator" />
                        <Tab label="Zoning/Permits" />
                      </>
                    )}
                  </Tabs>
                </Box>
                {currentRoleKey === 'acquisition-specialist' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>MLS/PropStream/Zillow Feeds</Typography>
                      <Typography variant="body2" color="text.secondary">Automated property data feeds from multiple sources</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI Comps/ARV Calculator</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered comparable analysis and ARV calculations</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Skip Tracing Integration</Typography>
                      <Typography variant="body2" color="text.secondary">Integrated skip tracing for owner contact information</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Automated Seller Outreach</Typography>
                      <Typography variant="body2" color="text.secondary">SMS/Email dialer for automated seller communication</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'disposition-agent' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Investor Marketplace</Typography>
                      <Typography variant="body2" color="text.secondary">Connect with investors and funding sources</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Buyer Proof of Funds</Typography>
                      <Typography variant="body2" color="text.secondary">Verify and manage buyer proof of funds documentation</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>E-sign Offer Acceptance</Typography>
                      <Typography variant="body2" color="text.secondary">Digital offer acceptance and contract management</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Property Flyers</Typography>
                      <Typography variant="body2" color="text.secondary">Generate and customize property marketing materials</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'title-agent' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>County Record Integrations</Typography>
                      <Typography variant="body2" color="text.secondary">Automated county record system integrations and data feeds</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Lien/Judgment Auto-pull</Typography>
                      <Typography variant="body2" color="text.secondary">Automated lien and judgment record retrieval and monitoring</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI-powered Title Search Summaries</Typography>
                      <Typography variant="body2" color="text.secondary">AI-generated title search summaries and analysis</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Escrow Integration</Typography>
                      <Typography variant="body2" color="text.secondary">Seamless integration with escrow services and closing coordination</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'escrow-officer' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Bank/ACH/Wire Integrations</Typography>
                      <Typography variant="body2" color="text.secondary">Banking system integrations for ACH and wire transfers</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Automated Disbursement Rules</Typography>
                      <Typography variant="body2" color="text.secondary">Automated disbursement rules and workflow management</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Compliance Audit Logs</Typography>
                      <Typography variant="body2" color="text.secondary">Comprehensive audit logs for regulatory compliance</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Fraud Detection Tools</Typography>
                      <Typography variant="body2" color="text.secondary">Advanced fraud detection and prevention tools</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'notary-public' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Remote Online Notarization (RON)</Typography>
                      <Typography variant="body2" color="text.secondary">Remote online notarization platform and services</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>KBA/ID Check APIs</Typography>
                      <Typography variant="body2" color="text.secondary">Knowledge-Based Authentication and ID verification APIs</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Digital Seals/Stamps</Typography>
                      <Typography variant="body2" color="text.secondary">Digital notary seals and stamp management tools</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>GPS On-site Check-in</Typography>
                      <Typography variant="body2" color="text.secondary">GPS-based location verification for mobile notary services</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'residential-appraiser' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>MLS/AMC Feeds</Typography>
                      <Typography variant="body2" color="text.secondary">Automated MLS and AMC data feeds for property information and comparables</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI-Assisted Appraisal Draft</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered tools to assist with appraisal report drafting and analysis</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Photo Analysis for Condition Scoring</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered photo analysis to automatically score property condition and quality</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>USPAP Compliance Tools</Typography>
                      <Typography variant="body2" color="text.secondary">Tools and checklists to ensure USPAP compliance and regulatory adherence</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'home-inspector' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Mobile Offline App</Typography>
                      <Typography variant="body2" color="text.secondary">Mobile app that works offline for field inspections with sync capabilities</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI Defect/Photo Tagging</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered automatic defect detection and photo tagging for inspection photos</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Voice-to-Text Notes</Typography>
                      <Typography variant="body2" color="text.secondary">Voice-to-text transcription for hands-free note taking during inspections</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>360° Camera Integration</Typography>
                      <Typography variant="body2" color="text.secondary">360-degree camera integration for comprehensive property documentation</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'commercial-inspector' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>OSHA/Compliance Modules</Typography>
                      <Typography variant="body2" color="text.secondary">OSHA compliance modules and safety protocol management for commercial inspections</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Municipal Inspection Code Integrations</Typography>
                      <Typography variant="body2" color="text.secondary">Integration with local municipal inspection codes and building regulations</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Drone Support for Large Sites</Typography>
                      <Typography variant="body2" color="text.secondary">Drone integration for comprehensive inspection of large commercial properties and sites</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'energy-inspector' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>DOE/Energy Star Benchmarks</Typography>
                      <Typography variant="body2" color="text.secondary">Department of Energy and Energy Star benchmarking tools and compliance standards</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI ROI Calculators for Retrofits</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered return on investment calculators for energy efficiency retrofits and upgrades</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>IoT/Smart Meter Data Ingestion</Typography>
                      <Typography variant="body2" color="text.secondary">Integration with IoT devices and smart meters for real-time energy data collection and analysis</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'insurance-agent' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Carrier API Integration</Typography>
                      <Typography variant="body2" color="text.secondary">Integration with insurance carrier APIs for real-time policy and claims data</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Claims Automation</Typography>
                      <Typography variant="body2" color="text.secondary">Automated claims processing and workflow management tools</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Digital COIs</Typography>
                      <Typography variant="body2" color="text.secondary">Digital Certificate of Insurance generation and management</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI Risk Assessments</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered risk assessment and underwriting tools</Typography>
                    </TabPanel>
                  </>
                ) : currentRoleKey === 'title-insurance-agent' ? (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Title Insurer Integrations</Typography>
                      <Typography variant="body2" color="text.secondary">Integration with title insurance company APIs for real-time policy and claims data</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>AI Endorsement Drafting</Typography>
                      <Typography variant="body2" color="text.secondary">AI-powered tools for drafting title insurance endorsements and amendments</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Automated Renewals</Typography>
                      <Typography variant="body2" color="text.secondary">Automated title insurance policy renewal processing and notifications</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Escrow Sync</Typography>
                      <Typography variant="body2" color="text.secondary">Synchronization with escrow services for seamless closing coordination</Typography>
                    </TabPanel>
                  </>
                ) : (
                  <>
                    <TabPanel value={state.subTab} index={0}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Income-based Valuation Models</Typography>
                      <Typography variant="body2" color="text.secondary">Advanced income capitalization and DCF valuation models</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={1}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cap Rate Databases</Typography>
                      <Typography variant="body2" color="text.secondary">Comprehensive capitalization rate databases and market data</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={2}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Cost Approach Calculators</Typography>
                      <Typography variant="body2" color="text.secondary">Cost approach calculators and depreciation analysis tools</Typography>
                    </TabPanel>
                    <TabPanel value={state.subTab} index={3}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>Zoning/Permit Integration</Typography>
                      <Typography variant="body2" color="text.secondary">Zoning analysis and permit integration for property valuation</Typography>
                    </TabPanel>
                  </>
                )}
              </Box>
            )}
          </>
        ) : (
          // Minimal content for unconfigured roles
          <Typography variant="h4" gutterBottom>
            {currentUserRole} Workspace
          </Typography>
        )}
      </Box>
    );
  };

  // If role is not yet known, render nothing until RoleContext resolves (RoleProvider shows loader)
  // Only redirect if we definitively know role is not allowed
  // Keep guard duplicated in rendered tree to satisfy hooks rule

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {!isAuthorized && currentUserRole && <Navigate to="/" />}
      {/* Top App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: brandColors.primary,
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: brandColors.text.inverse }}>
            Dreamery {currentUserRole}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={state.notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleUserMenuClick}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  {userRole.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title="Back to Close Hub">
              <IconButton
                color="inherit"
                onClick={handleBackToClose}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dynamic Sidebar Navigation */}
      <Box
        sx={{
          width: state.sidebarCollapsed ? 80 : 280,
          flexShrink: 0,
          background: brandColors.backgrounds.secondary,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          transition: 'width 0.3s ease',
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Mode Selector */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <FormControl fullWidth size="small">
              <Select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  backgroundColor: brandColors.surfaces.primary,
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: brandColors.borders.secondary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: brandColors.primary,
                  },
                }}
                renderValue={(value) => {
                  const modeOptions = [
                    { id: 'close', name: 'Close', icon: <HomeIcon /> },
                    { id: 'manage', name: 'Manage', icon: <ManageAccountsIcon /> },
                    { id: 'fund', name: 'Fund', icon: <AccountBalanceIcon /> },
                    { id: 'invest', name: 'Invest', icon: <TrendingUpIcon /> },
                    { id: 'operate', name: 'Operate', icon: <BuildIcon /> },
                  ];
                  const selectedModeConfig = modeOptions.find(m => m.id === value);
                  if (!selectedModeConfig) return 'Select Mode';
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: brandColors.primary }}>
                        {selectedModeConfig.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedModeConfig.name}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {[
                  { id: 'close', name: 'Close', icon: <HomeIcon /> },
                  { id: 'manage', name: 'Manage', icon: <ManageAccountsIcon /> },
                  { id: 'fund', name: 'Fund', icon: <AccountBalanceIcon /> },
                  { id: 'invest', name: 'Invest', icon: <TrendingUpIcon /> },
                  { id: 'operate', name: 'Operate', icon: <BuildIcon /> },
                ].map((mode) => (
                  <MenuItem key={mode.id} value={mode.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Box sx={{ color: brandColors.primary }}>
                        {mode.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mode.name}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Role Selector */}
          {!state.sidebarCollapsed && (
            <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
              <UnifiedRoleSelector 
                currentRole={currentUserRole}
                variant="outlined"
                size="small"
                sx={{ 
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderColor: brandColors.borders.secondary,
                    '&:hover': {
                      borderColor: brandColors.primary,
                    }
                  }
                }}
              />
            </Box>
          )}

          {/* Station Button */}
          <Box sx={{ px: 2, mb: 2, flexShrink: 0 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                py: 2,
                fontWeight: 600,
                fontSize: state.sidebarCollapsed ? '0.75rem' : '1.1rem',
                '&:hover': {
                  backgroundColor: brandColors.actions.primary,
                }
              }}
            >
              {state.sidebarCollapsed ? 'S' : 'Station'}
            </Button>
          </Box>

          {/* Collapse Toggle */}
          <Box sx={{ px: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              onClick={toggleSidebarCollapse}
              size="small"
              sx={{
                backgroundColor: brandColors.backgrounds.primary,
                '&:hover': {
                  backgroundColor: brandColors.backgrounds.hover,
                }
              }}
            >
              {state.sidebarCollapsed ? <MenuIcon /> : <MenuIcon />}
            </IconButton>
          </Box>

          {!state.sidebarCollapsed && (
            <>
              {/* Favorites Section */}
              {favoriteTabs.length > 0 && (
                <>
                  <Box sx={{ px: 2, mb: 1 }}>
                    <Button
                      onClick={toggleFavorites}
                      startIcon={state.favoritesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{
                        color: brandColors.text.secondary,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        p: 0,
                        minWidth: 'auto',
                      }}
                    >
                      FAVORITES ({favoriteTabs.length})
                    </Button>
                  </Box>
                  <Collapse in={state.favoritesExpanded}>
                    <Box sx={{ px: 0, mb: 2 }}>
                      {favoriteTabs.map((tab) => (
                        <Box
                          key={tab.value}
                          onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                          sx={{
                            margin: '4px 8px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                            transition: 'background-color 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                              backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : brandColors.backgrounds.hover,
                            }
                          }}
                        >
                          <Box sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center' }}>
                            {tab.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: state.activeTab === tab.value ? 600 : 400,
                              color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                              fontSize: '14px',
                              flex: 1,
                            }}
                          >
                            {tab.label}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tab.value);
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <StarIcon sx={{ fontSize: 16, color: brandColors.accent.warning }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </>
              )}

              {/* All Tabs */}
              <Box sx={{ px: 0 }}>
                {currentTabs.map((tab) => (
                  <Box
                    key={tab.value}
                    onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                    sx={{
                      margin: '4px 8px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : brandColors.backgrounds.hover,
                      }
                    }}
                  >
                    <Box sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center' }}>
                      {tab.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: state.activeTab === tab.value ? 600 : 400,
                        color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                        fontSize: '14px',
                        flex: 1,
                      }}
                    >
                      {tab.label}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tab.value);
                      }}
                      sx={{ p: 0.5 }}
                    >
                      {state.favorites.includes(tab.value) ? (
                        <StarIcon sx={{ fontSize: 16, color: brandColors.accent.warning }} />
                      ) : (
                        <StarBorderIcon sx={{ fontSize: 16, color: brandColors.text.disabled }} />
                      )}
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Collapsed Sidebar Icons */}
          {state.sidebarCollapsed && (
            <Box sx={{ px: 1 }}>
              {currentTabs.map((tab) => (
                <Tooltip key={tab.value} title={tab.label} placement="right">
                  <IconButton
                    onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                    sx={{
                      width: '100%',
                      mb: 1,
                      color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary,
                      backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                      '&:hover': {
                        backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : brandColors.backgrounds.hover,
                      }
                    }}
                  >
                    {tab.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          pl: 3,
          pr: 3,
          pb: 3,
          marginTop: '64px',
          overflow: 'auto',
        }}
      >
        {/* Tab Content */}
        {renderTabContent()}
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsMenuAnchor}
        open={Boolean(notificationsMenuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          }
        }}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            New support ticket assigned
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Document review required
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Compliance update available
          </Typography>
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Support</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Role Selector Menu */}
      <Menu
        anchorEl={roleSelectAnchor}
        open={Boolean(roleSelectAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: brandColors.primary }}>
            Switch Role
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a different professional role to access role-specific tools and features.
          </Typography>
        </Box>
        {roleList.map((role) => {
          const roleKey = getRoleKey(role);
          return (
            <MenuItem
              key={roleKey}
              onClick={() => handleRoleChange(roleKey)}
              selected={state.selectedRole === roleKey}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  backgroundColor: brandColors.backgrounds.selected,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ color: brandColors.primary }}>
                  <PersonIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {role}
                  </Typography>
                </Box>
                {state.selectedRole === roleKey && (
                  <Chip label="Active" size="small" color="primary" />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default RoleWorkspace;
