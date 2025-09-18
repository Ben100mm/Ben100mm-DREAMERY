import React from 'react';
import RoleWorkspace from '../components/RoleWorkspace';

const CloseProfessionalSupportPage: React.FC = () => {
  return (
    <RoleWorkspace 
      allowedRoles={[
        'Real Estate Agent', 
        'Real Estate Broker', 
        'Realtor', 
        "Buyer's Agent",
        'Listing Agent', 
        'Commercial Agent', 
        'Luxury Agent', 
        'New Construction Agent',
        'Wholesaler', 
        'Disposition Agent',
        'Financial Advisor',
        'Tax Advisor',
        'Relocation Specialist',
        'Investment Advisor'
      ]}
      redirectPath="/close"
    />
  );
};

export default CloseProfessionalSupportPage;
