import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Support as SupportIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Calculate as CalculateIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Archive as ArchiveIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle as AccountCircleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Receipt as ReceiptIcon,
  PhotoCamera as PhotoCameraIcon,
  Build as BuildIcon,
  Architecture as ArchitectureIcon,
  CleaningServices as CleaningServicesIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  IntegrationInstructions as IntegrationIcon,
} from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { brandColors } from "../theme";
import { RoleContext } from '../context/RoleContext';

// Professional Role Types and their core component integrations
interface ProfessionalRole {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  coreComponents: string[];
  features: string[];
  color: string;
  category: string;
}

const professionalRoles: ProfessionalRole[] = [
  // WHOLESALERS
  {
    id: 'wholesaler',
    name: 'Wholesaler',
    description: 'Property wholesaling and assignment contracts',
    icon: <BusinessIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'CRM'],
    features: ['Contract management', 'Assignment deals', 'Buyer network', 'Deal analysis'],
    color: '#1976d2',
    category: 'Wholesalers'
  },
  {
    id: 'disposition-agent',
    name: 'Disposition Agent',
    description: 'Property disposition and liquidation services',
    icon: <BusinessIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'CRM'],
    features: ['Liquidation planning', 'Market analysis', 'Buyer outreach', 'Deal structuring'],
    color: '#1976d2',
    category: 'Wholesalers'
  },

  // TITLE & ESCROW
  {
    id: 'title-agent',
    name: 'Title Agent',
    description: 'Title search and insurance services',
    icon: <SecurityIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Title searches', 'Title insurance', 'Chain of title', 'Lien searches'],
    color: '#388e3c',
    category: 'Title & Escrow'
  },
  {
    id: 'escrow-officer',
    name: 'Escrow Officer',
    description: 'Escrow and closing coordination',
    icon: <SecurityIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Transaction Management'],
    features: ['Escrow management', 'Closing coordination', 'Fund disbursement', 'Document preparation'],
    color: '#388e3c',
    category: 'Title & Escrow'
  },
  {
    id: 'notary-public',
    name: 'Notary Public',
    description: 'Document notarization services',
    icon: <SecurityIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Document notarization', 'Identity verification', 'Oath administration', 'Record keeping'],
    color: '#388e3c',
    category: 'Title & Escrow'
  },

  // APPRAISERS
  {
    id: 'residential-appraiser',
    name: 'Residential Appraiser',
    description: 'Residential property valuation',
    icon: <AssessmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Residential valuations', 'Market analysis', 'Comparable research', 'Report generation'],
    color: '#f57c00',
    category: 'Appraisers'
  },
  {
    id: 'commercial-appraiser',
    name: 'Commercial Appraiser',
    description: 'Commercial property valuation',
    icon: <AssessmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Commercial valuations', 'Income analysis', 'Market research', 'Investment analysis'],
    color: '#f57c00',
    category: 'Appraisers'
  },

  // INSPECTORS
  {
    id: 'home-inspector',
    name: 'Home Inspector',
    description: 'Residential property inspections',
    icon: <AssessmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Home inspections', 'Defect identification', 'Safety assessments', 'Report generation'],
    color: '#d32f2f',
    category: 'Inspectors'
  },
  {
    id: 'commercial-inspector',
    name: 'Commercial Inspector',
    description: 'Commercial property inspections',
    icon: <AssessmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Commercial inspections', 'Code compliance', 'Safety assessments', 'Detailed reporting'],
    color: '#d32f2f',
    category: 'Inspectors'
  },
  {
    id: 'energy-inspector',
    name: 'Energy Inspector',
    description: 'Energy efficiency and sustainability assessments',
    icon: <AssessmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Energy audits', 'Efficiency ratings', 'Green certifications', 'Sustainability reports'],
    color: '#d32f2f',
    category: 'Inspectors'
  },

  // SURVEYORS
  {
    id: 'land-surveyor',
    name: 'Land Surveyor',
    description: 'Property boundary and land surveying',
    icon: <AssessmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Boundary surveys', 'Topographic mapping', 'Legal descriptions', 'Survey reports'],
    color: '#7b1fa2',
    category: 'Surveyors'
  },

  // INSURANCE AGENTS
  {
    id: 'insurance-agent',
    name: 'Insurance Agent',
    description: 'Property and casualty insurance',
    icon: <AccountBalanceIcon />,
    coreComponents: ['Insurance', 'Document Management', 'Compliance'],
    features: ['Policy management', 'Quote generation', 'Claims processing', 'Risk assessment'],
    color: '#1565c0',
    category: 'Insurance Agents'
  },
  {
    id: 'title-insurance-agent',
    name: 'Title Insurance Agent',
    description: 'Title insurance policies and claims',
    icon: <AccountBalanceIcon />,
    coreComponents: ['Insurance', 'Document Management', 'Compliance'],
    features: ['Title insurance', 'Policy issuance', 'Claims handling', 'Risk mitigation'],
    color: '#1565c0',
    category: 'Insurance Agents'
  },

  // MORTGAGE LENDERS / BROKERS
  {
    id: 'mortgage-broker',
    name: 'Mortgage Broker',
    description: 'Mortgage loan origination and brokerage',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Loan origination', 'Lender relationships', 'Rate shopping', 'Application processing'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'mortgage-lender',
    name: 'Mortgage Lender',
    description: 'Direct mortgage lending services',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Direct lending', 'Underwriting', 'Loan servicing', 'Portfolio management'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'loan-officer',
    name: 'Loan Officer',
    description: 'Mortgage loan origination and processing',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Loan applications', 'Document collection', 'Customer service', 'Rate quotes'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'mortgage-underwriter',
    name: 'Mortgage Underwriter',
    description: 'Loan underwriting and risk assessment',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Risk assessment', 'Credit analysis', 'Document review', 'Approval decisions'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'hard-money-lender',
    name: 'Hard Money Lender',
    description: 'Short-term, asset-based lending',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Quick funding', 'Asset-based loans', 'Bridge financing', 'Rehab loans'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'private-lender',
    name: 'Private Lender',
    description: 'Private capital lending services',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Private financing', 'Flexible terms', 'Direct lending', 'Portfolio management'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'limited-partner',
    name: 'Limited Partner (LP)',
    description: 'Investment partnership capital',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Capital investment', 'Partnership management', 'Returns tracking', 'Risk sharing'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'seller-finance-specialist',
    name: 'Seller Finance Specialist',
    description: 'Seller-financed transaction structuring',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Creative financing', 'Contract structuring', 'Payment plans', 'Risk management'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },
  {
    id: 'banking-advisor',
    name: 'Banking Advisor',
    description: 'Banking and financial services',
    icon: <AccountBalanceWalletIcon />,
    coreComponents: ['Document Management', 'Transaction Management', 'Commission'],
    features: ['Banking services', 'Financial planning', 'Investment advice', 'Account management'],
    color: '#2e7d32',
    category: 'Mortgage Lenders & Brokers'
  },

  // CONTRACTORS / GC
  {
    id: 'general-contractor',
    name: 'General Contractor',
    description: 'Overall project management and coordination',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Project management', 'Subcontractor coordination', 'Permit management', 'Quality control'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'electrical-contractor',
    name: 'Electrical Contractor',
    description: 'Electrical system installation and repair',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Electrical work', 'Code compliance', 'Safety inspections', 'System upgrades'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'plumbing-contractor',
    name: 'Plumbing Contractor',
    description: 'Plumbing system installation and repair',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Plumbing work', 'Pipe installation', 'Fixture replacement', 'System maintenance'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'hvac-contractor',
    name: 'HVAC Contractor',
    description: 'Heating, ventilation, and air conditioning',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['HVAC installation', 'System maintenance', 'Energy efficiency', 'Climate control'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'roofing-contractor',
    name: 'Roofing Contractor',
    description: 'Roof installation and repair',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Roof installation', 'Repair services', 'Maintenance', 'Weatherproofing'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'painting-contractor',
    name: 'Painting Contractor',
    description: 'Interior and exterior painting services',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Interior painting', 'Exterior painting', 'Color consultation', 'Surface preparation'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'landscaping-contractor',
    name: 'Landscaping Contractor',
    description: 'Landscape design and maintenance',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Landscape design', 'Plant installation', 'Maintenance', 'Irrigation systems'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'flooring-contractor',
    name: 'Flooring Contractor',
    description: 'Floor installation and repair',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Floor installation', 'Material selection', 'Repair services', 'Maintenance'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'kitchen-contractor',
    name: 'Kitchen Contractor',
    description: 'Kitchen remodeling and renovation',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Kitchen design', 'Cabinet installation', 'Countertop work', 'Appliance integration'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },
  {
    id: 'bathroom-contractor',
    name: 'Bathroom Contractor',
    description: 'Bathroom remodeling and renovation',
    icon: <BuildIcon />,
    coreComponents: ['Document Management', 'Transaction Management'],
    features: ['Bathroom design', 'Fixture installation', 'Tile work', 'Plumbing integration'],
    color: '#d32f2f',
    category: 'Contractors & GC'
  },

  // DESIGN & ARCHITECTURE
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    description: 'Interior space planning and design',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Space planning', 'Color schemes', 'Furniture selection', 'Material coordination'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Building design and architectural services',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Building design', 'Construction documents', 'Permit coordination', 'Project management'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'landscape-architect',
    name: 'Landscape Architect',
    description: 'Landscape design and planning',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Site planning', 'Landscape design', 'Environmental integration', 'Permit coordination'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'kitchen-designer',
    name: 'Kitchen Designer',
    description: 'Kitchen space planning and design',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Kitchen layout', 'Cabinet design', 'Appliance planning', 'Material selection'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'bathroom-designer',
    name: 'Bathroom Designer',
    description: 'Bathroom space planning and design',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Bathroom layout', 'Fixture planning', 'Tile design', 'Storage solutions'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'lighting-designer',
    name: 'Lighting Designer',
    description: 'Lighting system design and planning',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Lighting design', 'Fixture selection', 'Energy efficiency', 'Ambiance creation'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'furniture-designer',
    name: 'Furniture Designer',
    description: 'Custom furniture design and creation',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Custom furniture', 'Space planning', 'Material selection', 'Fabric coordination'],
    color: '#00838f',
    category: 'Design & Architecture'
  },
  {
    id: 'color-consultant',
    name: 'Color Consultant',
    description: 'Color scheme and palette consultation',
    icon: <ArchitectureIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Color analysis', 'Palette creation', 'Material coordination', 'Trend consultation'],
    color: '#00838f',
    category: 'Design & Architecture'
  },

  // PERMIT & ENERGY
  {
    id: 'permit-expeditor',
    name: 'Permit Expeditor',
    description: 'Building permit processing and coordination',
    icon: <AssignmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Permit applications', 'Code compliance', 'Government coordination', 'Timeline management'],
    color: '#6a1b9a',
    category: 'Permit & Energy'
  },
  {
    id: 'energy-consultant',
    name: 'Energy Consultant',
    description: 'Energy efficiency and sustainability consulting',
    icon: <AssignmentIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Energy audits', 'Efficiency recommendations', 'Green certifications', 'Cost analysis'],
    color: '#6a1b9a',
    category: 'Permit & Energy'
  },

  // PROPERTY MANAGERS
  {
    id: 'property-manager',
    name: 'Property Manager',
    description: 'General property management services',
    icon: <HomeIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Tenant management', 'Maintenance coordination', 'Financial reporting', 'Property oversight'],
    color: '#2e7d32',
    category: 'Property Managers'
  },
  {
    id: 'long-term-rental-manager',
    name: 'Long-term Rental Property Manager',
    description: 'Traditional rental property management',
    icon: <HomeIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Tenant screening', 'Lease management', 'Rent collection', 'Maintenance coordination'],
    color: '#2e7d32',
    category: 'Property Managers'
  },
  {
    id: 'short-term-rental-manager',
    name: 'Short-term Rental Property Manager',
    description: 'STR and vacation rental management',
    icon: <HomeIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Guest management', 'Booking coordination', 'Cleaning services', 'Revenue optimization'],
    color: '#2e7d32',
    category: 'Property Managers'
  },
  {
    id: 'str-setup-manager',
    name: 'STR Setup & Manager',
    description: 'STR property setup and management',
    icon: <HomeIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Property setup', 'Furnishing', 'Listing optimization', 'Guest services'],
    color: '#2e7d32',
    category: 'Property Managers'
  },

  // CLEANING & MAINTENANCE
  {
    id: 'housekeeper',
    name: 'Housekeeper',
    description: 'Regular cleaning and maintenance services',
    icon: <CleaningServicesIcon />,
    coreComponents: ['Transaction Management'],
    features: ['Regular cleaning', 'Deep cleaning', 'Maintenance tasks', 'Quality control'],
    color: '#c62828',
    category: 'Cleaning & Maintenance'
  },
  {
    id: 'landscape-cleaner',
    name: 'Landscape Cleaner',
    description: 'Landscape maintenance and cleanup',
    icon: <CleaningServicesIcon />,
    coreComponents: ['Transaction Management'],
    features: ['Landscape maintenance', 'Debris removal', 'Seasonal cleanup', 'Plant care'],
    color: '#c62828',
    category: 'Cleaning & Maintenance'
  },
  {
    id: 'turnover-specialist',
    name: 'Turnover Specialist',
    description: 'Property turnover and preparation services',
    icon: <CleaningServicesIcon />,
    coreComponents: ['Transaction Management'],
    features: ['Turnover cleaning', 'Property preparation', 'Inspection coordination', 'Quality assurance'],
    color: '#c62828',
    category: 'Cleaning & Maintenance'
  },
  {
    id: 'handyman',
    name: 'Handyman',
    description: 'General repair and maintenance services',
    icon: <CleaningServicesIcon />,
    coreComponents: ['Transaction Management'],
    features: ['General repairs', 'Maintenance tasks', 'Small projects', 'Emergency services'],
    color: '#c62828',
    category: 'Cleaning & Maintenance'
  },
  {
    id: 'landscaper',
    name: 'Landscaper',
    description: 'Landscape design and maintenance',
    icon: <CleaningServicesIcon />,
    coreComponents: ['Transaction Management'],
    features: ['Landscape design', 'Plant installation', 'Maintenance', 'Seasonal care'],
    color: '#c62828',
    category: 'Cleaning & Maintenance'
  },
  {
    id: 'arborist',
    name: 'Arborist',
    description: 'Tree care and maintenance services',
    icon: <CleaningServicesIcon />,
    coreComponents: ['Transaction Management'],
    features: ['Tree care', 'Pruning', 'Disease treatment', 'Removal services'],
    color: '#c62828',
    category: 'Cleaning & Maintenance'
  },

  // TENANT SERVICES
  {
    id: 'tenant-screening-agent',
    name: 'Tenant Screening Agent',
    description: 'Tenant background and credit screening',
    icon: <PersonIcon />,
    coreComponents: ['Document Management', 'Compliance', 'CRM'],
    features: ['Background checks', 'Credit reports', 'Reference verification', 'Risk assessment'],
    color: '#1565c0',
    category: 'Tenant Services'
  },
  {
    id: 'leasing-agent',
    name: 'Leasing Agent',
    description: 'Property leasing and tenant acquisition',
    icon: <PersonIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Property marketing', 'Tenant acquisition', 'Lease negotiation', 'Move-in coordination'],
    color: '#1565c0',
    category: 'Tenant Services'
  },

  // ACCOUNTING
  {
    id: 'bookkeeper',
    name: 'Bookkeeper',
    description: 'Financial record keeping and management',
    icon: <ReceiptIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Financial records', 'Transaction tracking', 'Report generation', 'Tax preparation'],
    color: '#00838f',
    category: 'Accounting'
  },
  {
    id: 'cpa',
    name: 'Certified Public Accountant (CPA)',
    description: 'Professional accounting and tax services',
    icon: <ReceiptIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['Tax preparation', 'Financial planning', 'Audit services', 'Business consulting'],
    color: '#00838f',
    category: 'Accounting'
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'General accounting and financial services',
    icon: <ReceiptIcon />,
    coreComponents: ['Document Management', 'Compliance'],
    features: ['Financial statements', 'Tax preparation', 'Bookkeeping', 'Financial analysis'],
    color: '#00838f',
    category: 'Accounting'
  },

  // MARKETING & ADVERTISEMENT
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Real estate photography services',
    icon: <PhotoCameraIcon />,
    coreComponents: ['Document Management', 'CRM', 'Marketing'],
    features: ['Property photography', 'Virtual tours', 'Drone photography', 'Image editing'],
    color: '#1565c0',
    category: 'Marketing & Advertisement'
  },
  {
    id: 'videographer',
    name: 'Videographer',
    description: 'Real estate video production',
    icon: <PhotoCameraIcon />,
    coreComponents: ['Document Management', 'CRM', 'Marketing'],
    features: ['Property videos', 'Virtual tours', 'Marketing content', 'Video editing'],
    color: '#1565c0',
    category: 'Marketing & Advertisement'
  },
  {
    id: 'ar-vr-developer',
    name: 'AR/VR Developer',
    description: 'Augmented and virtual reality experiences',
    icon: <PhotoCameraIcon />,
    coreComponents: ['Document Management', 'CRM', 'Marketing'],
    features: ['Virtual tours', 'AR experiences', 'Interactive content', 'Technology integration'],
    color: '#1565c0',
    category: 'Marketing & Advertisement'
  },
  {
    id: 'digital-twins-developer',
    name: 'Digital Twins Developer',
    description: 'Digital twin property modeling',
    icon: <PhotoCameraIcon />,
    coreComponents: ['Document Management', 'CRM', 'Marketing'],
    features: ['3D modeling', 'Digital twins', 'Virtual staging', 'Interactive experiences'],
    color: '#1565c0',
    category: 'Marketing & Advertisement'
  },

  // LEGAL SERVICES
  {
    id: 'real-estate-attorney',
    name: 'Real Estate Attorney',
    description: 'Real estate legal services and representation',
    icon: <GavelIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['Contract review', 'Legal representation', 'Title issues', 'Dispute resolution'],
    color: '#c62828',
    category: 'Legal Services'
  },
  {
    id: 'estate-planning-attorney',
    name: 'Estate Planning Attorney',
    description: 'Estate planning and trust services',
    icon: <GavelIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['Estate planning', 'Trust creation', 'Asset protection', 'Succession planning'],
    color: '#c62828',
    category: 'Legal Services'
  },
  {
    id: '1031-exchange-intermediary',
    name: '1031 Exchange Intermediary',
    description: 'Tax-deferred exchange facilitation',
    icon: <GavelIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['Exchange coordination', 'Documentation', 'Timeline management', 'Compliance oversight'],
    color: '#c62828',
    category: 'Legal Services'
  },
  {
    id: 'entity-formation-service-provider',
    name: 'Entity Formation Service Provider',
    description: 'Business entity creation and management',
    icon: <GavelIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['LLC formation', 'Corporation setup', 'Compliance management', 'Ongoing services'],
    color: '#c62828',
    category: 'Legal Services'
  },
  {
    id: 'escrow-service-provider',
    name: 'Escrow Service Provider',
    description: 'Escrow and closing services',
    icon: <GavelIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['Escrow services', 'Closing coordination', 'Fund management', 'Document handling'],
    color: '#c62828',
    category: 'Legal Services'
  },
  {
    id: 'legal-notary-service-provider',
    name: 'Legal Notary Service Provider',
    description: 'Legal document notarization',
    icon: <GavelIcon />,
    coreComponents: ['Document Management', 'Compliance', 'Commission'],
    features: ['Document notarization', 'Identity verification', 'Legal compliance', 'Record keeping'],
    color: '#c62828',
    category: 'Legal Services'
  },

  // BUYERS & INVESTORS
  {
    id: 'investor-buyer',
    name: 'Investor Buyer',
    description: 'Investment property acquisition',
    icon: <PersonIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Investment analysis', 'Property evaluation', 'Portfolio building', 'ROI optimization'],
    color: '#2e7d32',
    category: 'Buyers & Investors'
  },
  {
    id: 'retail-buyer',
    name: 'Retail Buyer',
    description: 'Primary residence and personal property',
    icon: <PersonIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Home search', 'Financing coordination', 'Negotiation support', 'Closing assistance'],
    color: '#2e7d32',
    category: 'Buyers & Investors'
  },
  {
    id: 'ibuyer',
    name: 'iBuyer',
    description: 'Instant property purchase services',
    icon: <PersonIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Quick offers', 'Cash purchases', 'Streamlined process', 'Fast closing'],
    color: '#2e7d32',
    category: 'Buyers & Investors'
  },
  {
    id: 'property-flipper',
    name: 'Property Flipper',
    description: 'Property renovation and resale',
    icon: <PersonIcon />,
    coreComponents: ['Document Management', 'CRM', 'Transaction Management'],
    features: ['Property acquisition', 'Renovation management', 'Market analysis', 'Quick resale'],
    color: '#2e7d32',
    category: 'Buyers & Investors'
  },

  // OTHER
  {
    id: 'real-estate-consultant',
    name: 'Real Estate Consultant',
    description: 'General real estate consulting services',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM'],
    features: ['Market analysis', 'Investment advice', 'Strategy development', 'Portfolio review'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'real-estate-educator',
    name: 'Real Estate Educator',
    description: 'Real estate education and training',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM'],
    features: ['Course development', 'Training delivery', 'Certification programs', 'Continuing education'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'real-estate-trainer',
    name: 'Real Estate Trainer',
    description: 'Professional development and skills training',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM'],
    features: ['Skills training', 'Professional development', 'Performance coaching', 'Best practices'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'real-estate-coach',
    name: 'Real Estate Coach',
    description: 'One-on-one coaching and mentoring',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM'],
    features: ['Personal coaching', 'Goal setting', 'Performance improvement', 'Accountability'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'financial-advisor',
    name: 'Financial Advisor',
    description: 'Financial planning and investment advice',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM', 'Commission'],
    features: ['Financial planning', 'Investment advice', 'Retirement planning', 'Risk management'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'tax-advisor',
    name: 'Tax Advisor',
    description: 'Tax planning and optimization services',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM', 'Commission'],
    features: ['Tax planning', 'Optimization strategies', 'Compliance management', 'Audit support'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'relocation-specialist',
    name: 'Relocation Specialist',
    description: 'Corporate and personal relocation services',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM'],
    features: ['Relocation planning', 'Destination research', 'Logistics coordination', 'Settlement support'],
    color: '#6a1b9a',
    category: 'Other'
  },
  {
    id: 'real-estate-investment-advisor',
    name: 'Real Estate Investment Advisor',
    description: 'Investment strategy and portfolio management',
    icon: <SupportIcon />,
    coreComponents: ['Document Management', 'CRM', 'Commission'],
    features: ['Investment strategy', 'Portfolio analysis', 'Market research', 'Risk assessment'],
    color: '#6a1b9a',
    category: 'Other'
  }
];

const CloseProfessionalSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userRole } = (useContext(RoleContext as any) || {}) as { userRole?: string };
  
  // Professional roles that can access this page
  const allowedRoles = [
    'Title Agent', 'Escrow Officer', 'Notary Public', 'Appraiser', 
    'Insurance Agent', 'Mortgage Broker', 'General Contractor', 
    'Property Manager', 'Real Estate Attorney', 'Photographer'
  ];
  const isProfessionalAuthorized = !!userRole && allowedRoles.includes(userRole);

  const [state, setState] = useState({
    activeTab: 'overview',
    selectedRole: null as ProfessionalRole | null,
    drawerOpen: false,
    notifications: 5
  });

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setState(prev => ({ ...prev, activeTab: newValue }));
  };

  const handleRoleSelect = (role: ProfessionalRole) => {
    setState(prev => ({ ...prev, selectedRole: role, activeTab: 'overview' }));
  };

  const toggleDrawer = () => {
    setState(prev => ({ ...prev, drawerOpen: !prev.drawerOpen }));
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationsMenuAnchor(null);
    setUserMenuAnchor(null);
  };

  const handleBackToClose = () => {
    navigate('/close');
  };

  const tabs = [
    // Core Dashboard & Overview
    { value: 'overview', label: 'Overview', icon: <DashboardIcon /> },

    // Professional Role Management
    { value: 'roles', label: 'Professional Roles', icon: <PersonIcon /> },
    { value: 'role-directory', label: 'Role Directory', icon: <PeopleIcon /> },

    // Core Service Components
    { value: 'integrations', label: 'Core Integrations', icon: <BusinessIcon /> },
    { value: 'service-catalog', label: 'Service Catalog', icon: <AssignmentIcon /> },

    // Workflow & Process Management
    { value: 'workflows', label: 'Workflows', icon: <AssignmentIcon /> },
    { value: 'process-templates', label: 'Process Templates', icon: <DescriptionIcon /> },

    // Compliance & Quality
    { value: 'compliance', label: 'Compliance', icon: <SecurityIcon /> },
    { value: 'quality-assurance', label: 'Quality Assurance', icon: <CheckCircleIcon /> },

    // Document & Resource Management
    { value: 'documents', label: 'Document Hub', icon: <DescriptionIcon /> },
    { value: 'resource-library', label: 'Resource Library', icon: <ArchiveIcon /> },

    // Communication & Collaboration
    { value: 'communications', label: 'Communications', icon: <SupportIcon /> },
    { value: 'collaboration', label: 'Collaboration Hub', icon: <IntegrationIcon /> },

    // Analytics & Reporting
    { value: 'analytics', label: 'Analytics', icon: <AssessmentIcon /> },
    { value: 'reports', label: 'Reports', icon: <BusinessIcon /> },

    // Support & Configuration
    { value: 'support', label: 'Support', icon: <SupportIcon /> },
    { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { value: 'integrations-hub', label: 'Integrations', icon: <IntegrationIcon /> },
  ];

  // Role-based access guard
  if (!isProfessionalAuthorized && userRole) {
    return <Navigate to="/" />;
  }

  // Build role-specific workflows by category
  const getWorkflowForCategory = (category: string): string[] => {
    switch (category) {
      case 'Title & Escrow':
        return ['Open order', 'Title search', 'Lien/Judgment check', 'Clear to close', 'Settlement'];
      case 'Appraisers':
        return ['Accept order', 'Inspect property', 'Market analysis & comps', 'Draft report', 'QC review', 'Deliver report'];
      case 'Inspectors':
        return ['Schedule inspection', 'Onsite inspection', 'Photo & notes', 'Issue report', 'Follow-ups'];
      case 'Surveyors':
        return ['Research records', 'Field survey', 'Draft plat', 'Legal description', 'Deliverables'];
      case 'Insurance Agents':
        return ['Gather risk data', 'Quote generation', 'Bind policy', 'Policy docs', 'Claims support'];
      case 'Mortgage Lenders & Brokers':
        return ['Application intake', 'Disclosures', 'Processing', 'Underwriting', 'Clear to close', 'Funding'];
      case 'Contractors & GC':
        return ['Scope & bid', 'Permits', 'Execute work', 'Change orders', 'Punch list', 'Completion'];
      case 'Design & Architecture':
        return ['Discovery', 'Schematic design', 'Design development', 'Construction docs', 'Permitting'];
      case 'Permit & Energy':
        return ['Gather docs', 'Submit applications', 'AHJ coordination', 'Approval', 'Close-out'];
      case 'Property Managers':
        return ['Onboarding', 'Tenant/guest ops', 'Maintenance', 'Financials', 'Reporting'];
      case 'Cleaning & Maintenance':
        return ['Intake request', 'Schedule', 'Perform service', 'QA', 'Invoice'];
      case 'Tenant Services':
        return ['Lead intake', 'Screening', 'Leasing', 'Move-in', 'Renewals'];
      case 'Accounting':
        return ['Books setup', 'Transaction posting', 'Reconciliation', 'Reports', 'Tax prep'];
      case 'Marketing & Advertisement':
        return ['Intake brief', 'Shoot/produce', 'Edit', 'Publish', 'Analytics'];
      case 'Legal Services':
        return ['Intake', 'Document review/draft', 'Negotiation', 'Execution', 'Record/close'];
      case 'Buyers & Investors':
        return ['Deal intake', 'Underwrite', 'Offer/contract', 'Due diligence', 'Close'];
      default:
        return ['Intake', 'Plan', 'Execute', 'Review', 'Complete'];
    }
  };

  // Render content for the selected role and active tab
  const renderRoleContent = () => {
    if (!state.selectedRole) return null;
    const role = state.selectedRole;

    switch (state.activeTab) {
      case 'overview':
        return (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ color: role.color, mr: 2 }}>{role.icon}</Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: role.color }}>{role.name}</Typography>
                <Typography variant="body2" color="text.secondary">{role.description}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              <Button variant="contained" size="small">Start Workflow</Button>
              <Button variant="outlined" size="small">Upload Document</Button>
              <Button variant="outlined" size="small">View Templates</Button>
              <Button variant="text" size="small">Contact Client</Button>
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Features</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {role.features.map((f, i) => (
                <Chip key={i} label={f} size="small" />
              ))}
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>Core Integrations</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {role.coreComponents.map((c) => (
                <Chip key={c} label={c} size="small" color="primary" variant="outlined" />
              ))}
            </Box>
          </Paper>
        );
      case 'integrations':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Integrations for {role.name}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {role.coreComponents.map((c) => (
                <Chip key={c} label={c} color="primary" variant="outlined" />
              ))}
            </Box>
          </Paper>
        );
      case 'workflows':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Standard Workflow</Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {getWorkflowForCategory(role.category).map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={`Step ${idx + 1}`} size="small" color="primary" />
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      case 'compliance':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Compliance Checklist</Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {['License verified', 'Insurance/COI on file', 'W9 received', 'Agreements signed'].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: brandColors.actions.primary }} />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      case 'documents':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Document Hub</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small">Upload</Button>
              <Button variant="outlined" size="small">Browse Templates</Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Role-specific document templates and recent uploads will appear here for {role.name}.
            </Typography>
          </Paper>
        );
      case 'role-directory':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Role Directory</Typography>
            <Typography variant="body2" color="text.secondary">Search and manage professionals related to {role.name}.</Typography>
          </Paper>
        );
      case 'service-catalog':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Service Catalog</Typography>
            <Typography variant="body2" color="text.secondary">Showcase standard services offered by {role.name} with pricing and SLAs.</Typography>
          </Paper>
        );
      case 'process-templates':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Process Templates</Typography>
            <Typography variant="body2" color="text.secondary">Reusable workflow templates tailored for {role.name}.</Typography>
          </Paper>
        );
      case 'quality-assurance':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quality Assurance</Typography>
            <Typography variant="body2" color="text.secondary">QA checklists, SLAs, and KPIs for {role.name} engagements.</Typography>
          </Paper>
        );
      case 'resource-library':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Resource Library</Typography>
            <Typography variant="body2" color="text.secondary">Guides, templates, and training for {role.name}.</Typography>
          </Paper>
        );
      case 'communications':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Communications</Typography>
            <Typography variant="body2" color="text.secondary">Messaging, scheduled updates, and client notifications for {role.name}.</Typography>
          </Paper>
        );
      case 'collaboration':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Collaboration Hub</Typography>
            <Typography variant="body2" color="text.secondary">Shared boards and tasking with agents/clients for {role.name}.</Typography>
          </Paper>
        );
      case 'analytics':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Analytics</Typography>
            <Typography variant="body2" color="text.secondary">KPIs and performance metrics for {role.name}.</Typography>
          </Paper>
        );
      case 'reports':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Reports</Typography>
            <Typography variant="body2" color="text.secondary">Downloadable and scheduled reports for {role.name}.</Typography>
          </Paper>
        );
      case 'support':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Support</Typography>
            <Typography variant="body2" color="text.secondary">FAQs and ticketing for {role.name}.</Typography>
          </Paper>
        );
      case 'settings':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Settings</Typography>
            <Typography variant="body2" color="text.secondary">Role-specific preferences and defaults for {role.name}.</Typography>
          </Paper>
        );
      case 'integrations-hub':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Integrations</Typography>
            <Typography variant="body2" color="text.secondary">Connected apps and APIs configured for {role.name}.</Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'white' }}>
            Dreamery Professional Support Hub
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
                  J
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

      {/* Sidebar Navigation */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          background: brandColors.backgrounds.secondary,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Temporary Role Selector */}
          <Box sx={{ px: 2, pb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="ps-role-select-label">Select Role</InputLabel>
              <Select
                labelId="ps-role-select-label"
                label="Select Role"
                native
                value={state.selectedRole?.id || ''}
                onChange={(e: any) => {
                  const role = professionalRoles.find(r => r.id === e.target.value);
                  if (role) {
                    setState(prev => ({ ...prev, selectedRole: role, activeTab: 'overview' }));
                  }
                }}
              >
                <option aria-label="None" value="" />
                {professionalRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Navigation Tabs */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {tabs.map((tab) => (
              <Box
                key={tab.value}
                onClick={() => handleTabChange({} as React.SyntheticEvent, tab.value)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: state.activeTab === tab.value ? brandColors.backgrounds.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: brandColors.backgrounds.hover,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: brandColors.actions.primary }}>
                    {tab.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: state.activeTab === tab.value ? 'bold' : 'normal',
                      color: state.activeTab === tab.value ? brandColors.primary : brandColors.text.primary
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
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
            {/* Header */}
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
                <SupportIcon sx={{ fontSize: 28, color: 'white' }} />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
              Professional Support Hub
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Welcome to the Professional Support Hub. This system integrates all professional service providers 
            through shared core components for seamless collaboration.
              </Typography>
            </Paper>

        {/* Role selection view OR role-specific content */}
        {(state.activeTab === 'roles' || !state.selectedRole) ? (
          <Box sx={{ mt: 3 }}>
            {Array.from(new Set(professionalRoles.map(role => role.category))).map((category) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
              sx={{ 
                    fontWeight: 600, 
                    color: brandColors.primary,
                    mb: 2,
                    pb: 1,
                    borderBottom: '2px solid',
                    borderColor: brandColors.primary + '40'
                  }}
                >
                  {category}
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' },
                  gap: 2 
                }}>
                  {professionalRoles
                    .filter(role => role.category === category)
                    .map((role) => (
            <Paper 
                        key={role.id} 
                        elevation={1}
              sx={{ 
                          p: 2.5,
                          borderLeft: `4px solid ${role.color}`,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            elevation: 3,
                            transform: 'translateX(4px)',
                            boxShadow: `0 4px 20px ${role.color}20`
                          }
                        }}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Box sx={{ 
                            backgroundColor: `${role.color}15`, 
                            p: 1.2, 
                            borderRadius: 1.5, 
                            mr: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Box sx={{ color: role.color, fontSize: 22 }}>
                              {role.icon}
              </Box>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: role.color, mb: 0.5 }}>
                              {role.name}
              </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                              {role.description}
                            </Typography>
            </Box>
                          <Button 
                            variant="text" 
                            size="small"
              sx={{ 
                              color: role.color,
                              minWidth: 'auto',
                              px: 1,
                              '&:hover': {
                                backgroundColor: `${role.color}10`
                              }
                            }}
                          >
                            <ArrowForwardIcon sx={{ fontSize: 18 }} />
                          </Button>
              </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                          {role.features.slice(0, 3).map((feature, index) => (
                            <Chip 
                              key={index}
                              label={feature} 
                              size="small" 
                              variant="outlined"
              sx={{ 
                                borderColor: `${role.color}40`,
                                color: role.color,
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-label': { px: 1 }
                              }} 
                            />
                          ))}
                          {role.features.length > 3 && (
                            <Chip 
                              label={`+${role.features.length - 3} more`} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderColor: 'grey.300',
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-label': { px: 1 }
                              }} 
                            />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {role.coreComponents.map((component) => (
                            <Chip 
                              key={component}
                              label={component} 
                              size="small" 
              sx={{ 
                                backgroundColor: `${role.color}15`,
                                color: role.color,
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-label': { px: 1 }
                              }} 
                            />
                          ))}
                        </Box>
                      </Paper>
                    ))}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => setState(prev => ({ ...prev, selectedRole: null, activeTab: 'roles' }))}
              >
                Back to Roles
              </Button>
              <Typography variant="h6" sx={{ ml: 2, fontWeight: 600, color: brandColors.primary }}>
                {state.selectedRole?.name}
                </Typography>
              </Box>
            {renderRoleContent()}
            </Box>
        )}

        {/* Empty states for role-dependent tabs when no role selected */}
        {!state.selectedRole && state.activeTab !== 'roles' && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Select a Professional Role</Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a role from the "Professional Roles" tab to view {tabs.find(t => t.value === state.activeTab)?.label?.toLowerCase()} tailored to that profession.
              </Typography>
            </Paper>
        )}
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
            New document uploaded for review
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Compliance check completed
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Payment processed successfully
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
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          Support
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CloseProfessionalSupportPage;
