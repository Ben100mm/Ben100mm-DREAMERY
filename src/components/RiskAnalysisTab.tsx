import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { DealState } from '../types/deal';
import { defaultRiskFactors } from '../utils/advancedCalculations';

interface RiskAnalysisTabProps {
  dealState: DealState | null;
  updateDealState: (updates: Partial<DealState>) => void;
  handleResultsChange: <K extends keyof any>(calculatorType: K, results: any) => void;
  isCalculating: boolean;
  setIsCalculating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RiskAnalysisTab: React.FC<RiskAnalysisTabProps> = ({
  dealState,
  updateDealState,
  handleResultsChange,
  isCalculating,
  setIsCalculating,
}) => {
  if (!dealState) {
    return (
      <Box>
        <Typography variant="body2" sx={{ color: '#666' }}>
          No deal data found. Please go back to the Underwrite page and click "Open Advanced Analysis" to load your deal data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
        Risk Factor Configuration
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
        Configure risk factors to assess investment risk and generate risk scores
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Market Volatility"
          type="number"
          inputProps={{ 
            min: 1, 
            max: 10,
            'aria-label': 'Market Volatility rating from 1 to 10',
            'aria-describedby': 'market-volatility-helper',
            'data-testid': 'market-volatility-input'
          }}
          value={dealState.riskFactors.marketVolatility}
          onChange={(e) => {
            const rawValue = parseInt(e.target.value);
            const value = isNaN(rawValue) ? 5 : Math.max(1, Math.min(10, rawValue));
            updateDealState({
              riskFactors: { ...(dealState?.riskFactors || defaultRiskFactors), marketVolatility: value }
            });
          }}
          helperText={dealState.riskFactors.marketVolatility < 1 || dealState.riskFactors.marketVolatility > 10 ? 'Must be 1-10' : ''}
          id="market-volatility-helper"
        />
        <TextField
          fullWidth
          label="Tenant Quality"
          type="number"
          inputProps={{ 
            min: 1, 
            max: 10,
            'aria-label': 'Tenant Quality rating from 1 to 10',
            'aria-describedby': 'tenant-quality-helper',
            'data-testid': 'tenant-quality-input'
          }}
          value={dealState.riskFactors.tenantQuality}
          onChange={(e) => {
            const rawValue = parseInt(e.target.value);
            const value = isNaN(rawValue) ? 7 : Math.max(1, Math.min(10, rawValue));
            updateDealState({
              riskFactors: { ...(dealState?.riskFactors || defaultRiskFactors), tenantQuality: value }
            });
          }}
          helperText={dealState.riskFactors.tenantQuality < 1 || dealState.riskFactors.tenantQuality > 10 ? 'Must be 1-10' : ''}
          id="tenant-quality-helper"
        />
      </Box>
      
      <Button 
        variant="contained" 
        disabled={isCalculating}
        onClick={async () => {
          if (dealState) {
            setIsCalculating(true);
            try {
              // Trigger recalculation by updating a dependency
              updateDealState({ 
                riskFactors: { ...dealState.riskFactors } 
              });
            } finally {
              setIsCalculating(false);
            }
          }
        }}
        aria-label="Recalculate risk analysis based on current configuration"
        sx={{ mt: 2 }}
      >
        {isCalculating ? <CircularProgress size={24} /> : 'Recalculate Risk Analysis'}
      </Button>
      
      {dealState.riskScoreResults && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
            Risk Analysis Results
          </Typography>
          
          <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
              Overall Risk Score: {dealState.riskScoreResults.overallRiskScore}/10
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              Risk Level: {dealState.riskScoreResults.riskCategory}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {dealState.riskScoreResults.recommendations?.join(', ')}
            </Typography>
          </Box>
          
          <Box sx={{ p: 2, backgroundColor: '#fff3cd', borderRadius: 1, border: '1px solid #ffeaa7' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#856404' }}>
              Confidence Intervals (95%):
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404', mb: 1 }}>
              Based on market volatility of {dealState?.riskFactors?.marketVolatility || 5}/10
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
                              - Higher volatility = wider confidence intervals
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
                              - Lower volatility = more precise projections
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
