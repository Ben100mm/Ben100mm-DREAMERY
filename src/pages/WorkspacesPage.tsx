import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { RoleContext } from '../context/RoleContext';
import { brandColors } from '../theme';

/**
 * WorkspacesPage - Auto-redirects based on user account type
 * 
 * Individual account → /workspaces/buyer
 * Professional account → /workspaces/professional-support (with specific role)
 * Business account → /workspaces/businesses or /workspaces/brokerages
 */
const WorkspacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useContext(RoleContext as any) as any || {};

  useEffect(() => {
    if (!userRole) {
      // If no role is set, default to buyer workspace
      console.log('WorkspacesPage: No role detected, defaulting to buyer workspace');
      navigate('/workspaces/buyer', { replace: true });
      return;
    }

    console.log('WorkspacesPage: Detected userRole:', userRole);

    // Define role categories
    const individualRoles = [
      'Retail Buyer',
      'Investor Buyer',
      'iBuyer',
      'Property Flipper',
    ];

    const agentRoles = [
      'Real Estate Agent',
      'Buyer\'s Agent',
      'Listing Agent',
      'Commercial Agent',
      'Luxury Agent',
      'New Construction Agent',
      'Wholesaler',
      'Realtor',
    ];

    const brokerageRoles = [
      'Real Estate Broker',
    ];

    const professionalRoles = [
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

    // Determine workspace based on role
    if (individualRoles.includes(userRole)) {
      console.log('WorkspacesPage: Redirecting to buyer workspace');
      navigate('/workspaces/buyer', { replace: true });
    } else if (agentRoles.includes(userRole)) {
      console.log('WorkspacesPage: Redirecting to agent workspace');
      navigate('/workspaces/agent', { replace: true });
    } else if (brokerageRoles.includes(userRole)) {
      console.log('WorkspacesPage: Redirecting to brokerages workspace');
      navigate('/workspaces/brokerages', { replace: true });
    } else if (professionalRoles.includes(userRole)) {
      console.log('WorkspacesPage: Redirecting to professional-support workspace');
      navigate('/workspaces/professional-support', { replace: true });
    } else {
      // Default to businesses for any other role
      console.log('WorkspacesPage: Redirecting to businesses workspace (default)');
      navigate('/workspaces/businesses', { replace: true });
    }
  }, [userRole, navigate]);

  // Show loading state while redirecting
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: brandColors.backgrounds.primary,
      }}
    >
      <CircularProgress size={60} sx={{ color: brandColors.primary, mb: 3 }} />
      <Typography variant="h6" sx={{ color: brandColors.text.primary }}>
        Loading your workspace...
      </Typography>
    </Box>
  );
};

export default WorkspacesPage;

