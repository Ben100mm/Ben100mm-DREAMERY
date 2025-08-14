import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { StatusChip, HelpTooltip } from './index';

interface ResultsSummaryProps {
  allResults: any;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ allResults }) => {
  if (Object.keys(allResults).length === 0) {
    return null;
  }

  return (
    <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1a365d' }}>
          Summary of All Calculations
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
          Overview of results from all completed calculations
        </Typography>
        
        {/* Export Functionality */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => {
              const csvContent = 'data:text/csv;charset=utf-8,' + Object.entries(allResults).map(([type, res]) => `${type},${JSON.stringify(res)}`).join('\n');
              const link = document.createElement('a');
              link.href = encodeURI(csvContent);
              link.download = 'advanced-calculations-results.csv';
              link.click();
            }}
            data-testid="export-all-results-csv-button"
            sx={{ 
              bgcolor: '#1a365d', 
              '&:hover': { bgcolor: '#0f2027' },
              color: 'white'
            }}
          >
            Export All Results as CSV
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => {
              const jsonContent = JSON.stringify(allResults, null, 2);
              const blob = new Blob([jsonContent], { type: 'application/json' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'advanced-calculations-results.json';
              link.click();
              URL.revokeObjectURL(link.href);
            }}
            data-testid="export-all-results-json-button"
            sx={{ 
              borderColor: '#1a365d', 
              color: '#1a365d',
              '&:hover': { borderColor: '#0f2027', bgcolor: '#f0f8ff' }
            }}
          >
            Export as JSON
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => {
              // Create a formatted text report
              let reportContent = 'ADVANCED ANALYSIS RESULTS REPORT\n';
              reportContent += '=====================================\n\n';
              reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
              reportContent += `Total Calculations: ${Object.keys(allResults).length}\n\n`;
              
              Object.entries(allResults).forEach(([type, results]) => {
                reportContent += `${type.toUpperCase()} ANALYSIS\n`;
                reportContent += '-'.repeat(type.length + 9) + '\n';
                reportContent += JSON.stringify(results, null, 2) + '\n\n';
              });
              
              const blob = new Blob([reportContent], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'advanced-calculations-report.txt';
              link.click();
              URL.revokeObjectURL(link.href);
            }}
            data-testid="export-all-results-report-button"
            sx={{ 
              borderColor: '#2e7d32', 
              color: '#2e7d32',
              '&:hover': { borderColor: '#1b5e20', bgcolor: '#f1f8e9' }
            }}
          >
            Export as Report
          </Button>
        </Box>
        
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' } }}>
          {Object.entries(allResults).map(([type, results]) => (
            <Box key={type}>
              <Card sx={{ p: 2, height: '100%', border: '1px solid #e8eaed', bgcolor: '#fafbfc' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <StatusChip
                    status="success"
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    size="small"
                  />
                  <HelpTooltip title={`Results from ${type} calculations`} />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  {type === 'seasonal' && 'Seasonal adjustments for vacancy rates and maintenance costs'}
                  {type === 'market' && 'Market condition adjustments for local market factors'}
                  {type === 'exit' && 'Exit strategy analysis with different timeframes'}
                  {type === 'tax' && 'Tax implications and deduction calculations'}
                  {type === 'refinance' && 'Refinance scenario comparisons and analysis'}
                  {type === 'risk' && 'Risk assessment and scoring analysis'}
                  {type === 'stress' && 'Stress testing with worst-case scenarios'}
                  {type === 'sensitivity' && 'Sensitivity analysis for key variables'}
                  {type === 'inflation' && 'Inflation-adjusted projections over time'}
                </Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: '#ffffff', borderRadius: 1, border: '1px solid #e8eaed' }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Results available
                  </Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
