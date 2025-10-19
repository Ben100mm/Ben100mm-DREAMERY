import React, { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import UnifiedDashboard from '../components/UnifiedDashboardFixed';

const CloseBuyerPage: React.FC = () => {
  const userRole = (useContext(RoleContext as any) as any)?.userRole || 'Retail Buyer';
  const allowedRoles = ['Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'];
  const isBuyerAuthorized = allowedRoles.includes(userRole);
  
  console.log('CloseBuyerPage - userRole:', userRole, 'isBuyerAuthorized:', isBuyerAuthorized, 'allowedRoles:', allowedRoles);

  // Debug effect to log role changes
  useEffect(() => {
    console.log('CloseBuyerPage - userRole changed to:', userRole);
  }, [userRole]);

  // If role is not authorized, redirect
  if (!isBuyerAuthorized && userRole) {
    return <Navigate to="/" />;
  }

  // If role is not yet known, render nothing until RoleContext resolves
  if (!userRole) {
    return null;
  }

  // Render the unified dashboard for authorized buyers
  return <UnifiedDashboard />;
};

export default CloseBuyerPage;
