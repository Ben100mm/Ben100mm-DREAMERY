import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import WorkflowIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import { brandColors } from "../theme";


export const professionalRoles = [
  {
    id: 'title-agent',
    name: 'Title Agent',
    description: 'Title insurance and escrow services',
    icon: <BusinessIcon />,
    color: brandColors.accent.infoDark,
    category: 'Title & Escrow',
    permissions: ['view_documents', 'view_compliance', 'view_workflows'],
    features: ['Title Search', 'Lien Check', 'Settlement', 'Recording'],
    coreComponents: ['Document Management', 'Compliance', 'Transaction Management'],
  },
  {
    id: 'escrow-officer',
    name: 'Escrow Officer',
    description: 'Escrow and closing coordination',
    icon: <BusinessIcon />,
    color: brandColors.accent.infoDark,
    category: 'Title & Escrow',
    permissions: ['view_documents', 'view_compliance', 'view_workflows'],
    features: ['Escrow Management', 'Closing Coordination', 'Fund Disbursement'],
    coreComponents: ['Document Management', 'Compliance', 'Transaction Management'],
  },
  {
    id: 'notary-public',
    name: 'Notary Public',
    description: 'Document notarization services',
    icon: <DescriptionIcon />,
    color: brandColors.accent.infoDark,
    category: 'Title & Escrow',
    permissions: ['view_documents', 'view_compliance'],
    features: ['Document Notarization', 'Identity Verification', 'Witness Services'],
    coreComponents: ['Document Management', 'Compliance'],
  },
  // ... minimal seed; rest are imported previously inline
];

export const dropdownConfig: Array<{ category: string; roles: string[] }> = [
  { category: 'Acquisition Specialists', roles: ['Acquisition Specialist', 'Disposition Agent'] },
  { category: 'Title', roles: ['Title Agent', 'Escrow Officer', 'Notary Public'] },
  { category: 'Appraisers', roles: ['Residential Appraiser', 'Commercial Appraiser'] },
  { category: 'Inspectors', roles: ['Home Inspector', 'Commercial Inspector', 'Energy Inspector'] },
  { category: 'Surveyors', roles: ['Land Surveyor'] },
  { category: 'Insurance Agents', roles: ['Insurance Agent', 'Title Insurance Agent'] },
];


