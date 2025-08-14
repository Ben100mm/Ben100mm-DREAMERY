import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import { DealState } from '../types/deal';

interface ScenarioComparisonTabProps {
  dealState: DealState | null;
  scenarios: any[];
  setScenarios: React.Dispatch<React.SetStateAction<any[]>>;
  setAllResults: React.Dispatch<React.SetStateAction<any>>;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
}

export const ScenarioComparisonTab: React.FC<ScenarioComparisonTabProps> = ({
  dealState,
  scenarios,
  setScenarios,
  setAllResults,
  setTabValue,
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

  if (scenarios.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          No scenarios saved yet. Go to the Global Configuration tab to save your first scenario.
        </Typography>
      </Alert>
    );
  }

  const handleLoadScenario = (scenario: any) => {
    if (scenario.results) {
      setAllResults(scenario.results);
    }
    if (scenario.dealState) {
      // Note: In a real implementation, you'd want to update the main dealState
      // This is simplified for the component extraction
    }
    setTabValue(0); // Switch to Overview tab
  };

  const handleRenameScenario = (index: number, currentName: string) => {
    const newName = prompt('Enter new name for scenario:', currentName);
    if (newName && newName.trim()) {
      const updatedScenarios = [...scenarios];
      updatedScenarios[index] = { ...updatedScenarios[index], name: newName.trim() };
      setScenarios(updatedScenarios);
    }
  };

  const exportScenariosAsCSV = () => {
    if (scenarios.length === 0) return;
    
    const headers = ['Scenario Name', 'Timestamp', 'Key Metrics'];
    const csvContent = [
      headers.join(','),
      ...scenarios.map(scenario => [
        `"${scenario.name}"`,
        `"${scenario.timestamp || 'N/A'}"`,
        `"${Object.keys(scenario.results || {}).join(', ')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scenarios-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportScenariosAsJSON = () => {
    if (scenarios.length === 0) return;
    
    const jsonContent = JSON.stringify(scenarios, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scenarios-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
        Scenario Comparison
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
        Compare saved scenarios and their key metrics
      </Typography>
      
      <Table 
        size="small" 
        aria-label="Scenario Comparison Results"
        data-testid="scenario-comparison-table"
        sx={{ border: 1, borderColor: '#e0e0e0' }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Scenario Name</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Key Metrics</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scenarios.map((scenario, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {scenario.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {scenario.timestamp ? new Date(scenario.timestamp).toLocaleString() : 'No timestamp'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {Object.keys(scenario.results || {}).map((metric, metricIndex) => (
                    <Chip
                      key={metricIndex}
                      label={metric}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleLoadScenario(scenario)}
                    sx={{ 
                      borderColor: '#1a365d', 
                      color: '#1a365d',
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      px: 1
                    }}
                  >
                    Load
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleRenameScenario(index, scenario.name)}
                    sx={{ 
                      borderColor: '#2e7d32', 
                      color: '#2e7d32',
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      px: 1
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setScenarios(scenarios.filter((_, i) => i !== index));
                    }}
                    sx={{ 
                      borderColor: '#d32f2f', 
                      color: '#d32f2f',
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      px: 1
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Export Scenarios */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>
          Export Scenarios
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={exportScenariosAsCSV}
            disabled={scenarios.length === 0}
            sx={{ 
              borderColor: '#1a365d', 
              color: '#1a365d',
              '&:hover': { borderColor: '#0f2027', bgcolor: '#e6f3ff' }
            }}
          >
            Export Comparison as CSV
          </Button>
          <Button
            variant="outlined"
            onClick={exportScenariosAsJSON}
            disabled={scenarios.length === 0}
            sx={{ 
              borderColor: '#1a365d', 
              color: '#1a365d',
              '&:hover': { borderColor: '#0f2027', bgcolor: '#e6f3ff' }
            }}
          >
            Export as JSON
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
