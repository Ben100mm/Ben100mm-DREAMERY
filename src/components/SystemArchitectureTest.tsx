import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  ExpandMore as ExpandMoreIcon,
  AccountTree as WorkflowIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useProfessionalSupport } from '../context/ProfessionalSupportContext';
import { workflowEngine } from '../services/WorkflowEngine';
import { documentTemplateService } from '../services/DocumentTemplateService';
import { complianceService } from '../services/ComplianceService';
import { RBACMiddleware, useRBAC } from './RBACMiddleware';

// Test component to verify system architecture
const SystemArchitectureTest: React.FC = () => {
  const { state, dispatch, hasPermission, getRoleWorkflows, getRoleDocuments, getRoleCompliance } = useProfessionalSupport();
  const { hasPermission: rbacHasPermission } = useRBAC();
  
  const [testRole] = useState('title-agent');
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflowProgress, setWorkflowProgress] = useState<any>(null);

  // Test workflow functionality
  const testWorkflow = () => {
    try {
      const workflowId = workflowEngine.startWorkflow(testRole);
      setActiveWorkflow(workflowId);
      
      const progress = workflowEngine.getWorkflowProgress(workflowId, testRole);
      setWorkflowProgress(progress);
      
      console.log('✅ Workflow started successfully:', workflowId);
      console.log('✅ Workflow progress:', progress);
    } catch (error) {
      console.error('❌ Workflow test failed:', error);
    }
  };

  // Test document templates
  const testDocumentTemplates = () => {
    try {
      const templates = documentTemplateService.getTemplates(testRole);
      console.log('✅ Document templates loaded:', templates.length);
      
      if (templates.length > 0) {
        const template = templates[0];
        const validation = documentTemplateService.validateTemplateVariables(template, {
          propertyAddress: '123 Main St',
          buyerName: 'John Doe',
          sellerName: 'Jane Smith',
          purchasePrice: 250000,
          closingDate: '2024-12-31',
          titleCompany: 'Dreamery Title',
        });
        
        console.log('✅ Template validation test:', validation);
        
        const document = documentTemplateService.generateDocument(template, {
          propertyAddress: '123 Main St',
          buyerName: 'John Doe',
          sellerName: 'Jane Smith',
          purchasePrice: 250000,
          closingDate: '2024-12-31',
          titleCompany: 'Dreamery Title',
        });
        
        console.log('✅ Document generation test:', document);
      }
    } catch (error) {
      console.error('❌ Document template test failed:', error);
    }
  };

  // Test compliance service
  const testCompliance = () => {
    try {
      const checklists = complianceService.getChecklists(testRole);
      console.log('✅ Compliance checklists loaded:', checklists.length);
      
      if (checklists.length > 0) {
        const checklist = checklists[0];
        const progress = complianceService.getChecklistProgress(testRole, checklist.id);
        console.log('✅ Compliance progress test:', progress);
        
        const status = complianceService.getRoleComplianceStatus(testRole);
        console.log('✅ Compliance status test:', status);
      }
    } catch (error) {
      console.error('❌ Compliance test failed:', error);
    }
  };

  // Test RBAC functionality
  const testRBAC = () => {
    try {
      console.log('✅ RBAC permissions:', state.permissions);
      console.log('✅ Has permission view_documents:', hasPermission('view_documents'));
      console.log('✅ Has permission view_compliance:', hasPermission('view_compliance'));
      console.log('✅ Has permission view_workflows:', hasPermission('view_workflows'));
      console.log('✅ RBAC hook permissions:', rbacHasPermission('view_documents'));
    } catch (error) {
      console.error('❌ RBAC test failed:', error);
    }
  };

  // Run all tests
  const runAllTests = () => {
    console.log('🚀 Starting System Architecture Tests...');
    testWorkflow();
    testDocumentTemplates();
    testCompliance();
    testRBAC();
    console.log('✅ All tests completed. Check console for results.');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Architecture Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Controls
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={runAllTests}>
            Run All Tests
          </Button>
          <Button variant="outlined" onClick={testWorkflow}>
            Test Workflow Engine
          </Button>
          <Button variant="outlined" onClick={testDocumentTemplates}>
            Test Document Templates
          </Button>
          <Button variant="outlined" onClick={testCompliance}>
            Test Compliance Service
          </Button>
          <Button variant="outlined" onClick={testRBAC}>
            Test RBAC
          </Button>
        </Box>
      </Paper>

      {/* Test Results Display */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {/* Workflow Test Results */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workflow Engine Test
            </Typography>
            {activeWorkflow ? (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Workflow: {activeWorkflow}
                </Typography>
                {workflowProgress && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {workflowProgress.completed}/{workflowProgress.total} steps
                      </Typography>
                      <Typography variant="body2">
                        {workflowProgress.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={workflowProgress.percentage} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No active workflow
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* RBAC Test Results */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              RBAC Test Results
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip
                label={`Permissions: ${state.permissions.length}`}
                color="primary"
                size="small"
              />
              <Chip
                label={`View Documents: ${hasPermission('view_documents') ? '✅' : '❌'}`}
                color={hasPermission('view_documents') ? 'success' : 'error'}
                size="small"
              />
              <Chip
                label={`View Compliance: ${hasPermission('view_compliance') ? '✅' : '❌'}`}
                color={hasPermission('view_compliance') ? 'success' : 'error'}
                size="small"
              />
              <Chip
                label={`View Workflows: ${hasPermission('view_workflows') ? '✅' : '❌'}`}
                color={hasPermission('view_workflows') ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Document Templates Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Document Templates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Templates loaded: {getRoleDocuments(testRole).length}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {getRoleDocuments(testRole).slice(0, 3).map((template) => (
                <Chip
                  key={template.id}
                  label={template.name}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Compliance Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compliance Service
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Checklists loaded: {getRoleCompliance(testRole).length}
            </Typography>
            {(() => {
              const status = complianceService.getRoleComplianceStatus(testRole);
              return (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Overall: {status.overallPercentage}%
                  </Typography>
                  <Typography variant="body2">
                    {status.completedChecklists}/{status.totalChecklists} complete
                  </Typography>
                </Box>
              );
            })()}
          </CardContent>
        </Card>
      </Box>

      {/* RBAC Middleware Test */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          RBAC Middleware Test
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <RBACMiddleware requiredPermission="view_documents">
            <Card>
              <CardContent>
                <Typography variant="h6">Documents Tab</Typography>
                <Typography variant="body2" color="text.secondary">
                  This content requires view_documents permission
                </Typography>
              </CardContent>
            </Card>
          </RBACMiddleware>
          
          <RBACMiddleware requiredPermission="view_compliance">
            <Card>
              <CardContent>
                <Typography variant="h6">Compliance Tab</Typography>
                <Typography variant="body2" color="text.secondary">
                  This content requires view_compliance permission
                </Typography>
              </CardContent>
            </Card>
          </RBACMiddleware>
          
          <RBACMiddleware requiredPermission="nonexistent_permission">
            <Card>
              <CardContent>
                <Typography variant="h6">Hidden Tab</Typography>
                <Typography variant="body2" color="text.secondary">
                  This content should be hidden
                </Typography>
              </CardContent>
            </Card>
          </RBACMiddleware>
        </Box>
      </Paper>
    </Box>
  );
};

export default SystemArchitectureTest;
