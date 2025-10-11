import React from 'react';
import AdvertiseCreateForm from './AdvertiseCreateForm';

interface AdvertiseEditFormProps {
  adData: any;
  workspaceType: 'rent' | 'manage' | 'fund' | 'operate';
  onCancel: () => void;
  onSuccess: () => void;
}

const AdvertiseEditForm: React.FC<AdvertiseEditFormProps> = ({ 
  adData, 
  workspaceType, 
  onCancel, 
  onSuccess 
}) => {
  // For now, we'll reuse the create form with pre-populated data
  // In a real app, this would be a separate component with edit-specific logic
  
  return (
    <AdvertiseCreateForm
      workspaceType={workspaceType}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};

export default AdvertiseEditForm;
