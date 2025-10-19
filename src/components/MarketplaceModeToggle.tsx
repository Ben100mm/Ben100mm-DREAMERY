import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export const MarketplaceModeToggle: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode: 'buy' | 'rent' = location.pathname.includes('/rent') ? 'rent' : 'buy';

  const handleChange = (_: unknown, newMode: 'buy' | 'rent' | null) => {
    if (!newMode || newMode === mode) return;
    navigate(`/marketplace/${newMode}`);
  };

  return (
    <ToggleButtonGroup size="small" value={mode} exclusive onChange={handleChange} color="primary">
      <ToggleButton value="buy">Buy</ToggleButton>
      <ToggleButton value="rent">Rent</ToggleButton>
    </ToggleButtonGroup>
  );
};


