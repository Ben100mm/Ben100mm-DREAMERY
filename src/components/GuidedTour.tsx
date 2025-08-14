import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  HelpOutline as HelpIcon,
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  description: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: string;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const steps: TourStep[] = [
    {
              title: 'Welcome to Advanced Analysis Suite!',
      description: 'This guided tour will walk you through the powerful features available for analyzing your real estate investments. Let\'s get started with a comprehensive overview of what you can accomplish.',
              target: 'body',
        placement: 'center',
        icon: ''
    },
    {
              title: 'Overview Dashboard',
      description: 'Start here to see a summary of all your calculations and key metrics at a glance. This gives you the big picture before diving into specific analysis areas.',
      target: '.overview-tab',
      placement: 'bottom',
              icon: ''
    },
    {
              title: 'Global Configuration',
      description: 'Set up your market conditions, exit strategies, and risk factors here. These settings affect all your calculations and can be saved as scenarios for comparison.',
      target: '.global-config-tab',
      placement: 'bottom',
              icon: ''
    },
    {
              title: 'Exit Strategies Analysis',
      description: 'Analyze different exit timelines and their impact on your ROI. Compare short-term flips vs. long-term holds with detailed projections.',
      target: '.exit-strategies-tab',
      placement: 'bottom',
              icon: ''
    },
    {
              title: 'Risk Assessment & Scoring',
      description: 'Evaluate your deal\'s risk profile with our comprehensive scoring system. Get detailed breakdowns of market, property, tenant, and financing risks.',
      target: '.risk-analysis-tab',
      placement: 'bottom',
              icon: ''
    },
    {
              title: 'Tax Implications Calculator',
      description: 'Understand the tax impact of your investment decisions. Calculate deductions, tax savings, and effective tax rates for better planning.',
      target: '.tax-implications-tab',
      placement: 'bottom',
              icon: ''
    },
    {
              title: 'Sensitivity Analysis',
      description: 'Test how changes in key variables affect your investment outcomes. Understand which factors have the biggest impact on your returns.',
      target: '.sensitivity-analysis-tab',
      placement: 'bottom',
              icon: ''
    },
    {
              title: 'Scenario Comparison',
      description: 'Save and compare different analysis scenarios side by side. Make informed decisions by comparing multiple investment strategies.',
      target: '.scenario-comparison-tab',
      placement: 'bottom',
              icon: ''
    },
    {
      title: 'Cloud Save & Sync',
      description: 'Save your work to the cloud and access it from any device. Sign in to automatically sync your deals and calculations across devices.',
      target: '.cloud-save-section',
      placement: 'top',
      icon: ''
    },
    {
      title: 'You\'re All Set!',
        description: 'You now have a complete understanding of the Advanced Analysis Suite. Start with the Overview tab to see your current calculations, then explore each section to dive deeper into specific analysis areas. Remember, you can always access this tour again by clicking the help button in the top navigation.',
      target: 'body',
      placement: 'center',
      icon: ''
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setCompleted(new Set());
    }
  }, [isOpen]);

  const handleNext = () => {
    setCompleted(prev => new Set(Array.from(prev).concat([activeStep])));
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFinish = () => {
    setCompleted(prev => new Set(Array.from(prev).concat([activeStep])));
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const isStepCompleted = (stepIndex: number) => completed.has(stepIndex);

  const getStepIcon = (stepIndex: number) => {
    if (isStepCompleted(stepIndex)) {
      return <CheckIcon sx={{ color: '#2e7d32' }} />;
    }
    return <Typography variant="h6">{steps[stepIndex].icon}</Typography>;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a365d 0%, #0f2027 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HelpIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Guided Tour
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Stepper Sidebar */}
          <Box sx={{ 
            width: 300, 
            borderRight: 1, 
            borderColor: '#e0e0e0',
            backgroundColor: '#fafbfc',
            p: 2
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1a365d', fontWeight: 600 }}>
              Tour Steps
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {steps.map((step, index) => (
                <Box
                  key={index}
                  onClick={() => handleStepClick(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: activeStep === index ? '#e3f2fd' : 'transparent',
                    border: activeStep === index ? '2px solid #1a365d' : '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: activeStep === index ? '#e3f2fd' : '#f5f5f5',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: isStepCompleted(index) ? '#2e7d32' : '#1a365d',
                    color: 'white'
                  }}>
                    {getStepIcon(index)}
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: activeStep === index ? '#1a365d' : '#666',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {step.title}
                    </Typography>
                    
                    {isStepCompleted(index) && (
                      <Chip 
                        label="Completed" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#e8f5e8', 
                          color: '#2e7d32',
                          fontSize: '0.7rem'
                        }} 
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Content Area */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#1a365d', fontWeight: 700 }}>
                {steps[activeStep].title}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3, color: '#666', lineHeight: 1.6 }}>
                {steps[activeStep].description}
              </Typography>

              {/* Target Element Highlight */}
              {steps[activeStep].target !== 'body' && (
                <Paper sx={{ 
                  p: 2, 
                  backgroundColor: '#fff3e0', 
                  border: '2px dashed #f57c00',
                  borderRadius: 2,
                  mb: 3
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#f57c00', fontWeight: 600, mb: 1 }}>
                    Tip:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Look for the highlighted element on the page: <strong>{steps[activeStep].target.replace('.', '')}</strong>
                  </Typography>
                </Paper>
              )}

              {/* Progress Indicator */}
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  height: 8, 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${((activeStep + 1) / steps.length) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#1a365d',
                    transition: 'width 0.3s ease'
                  }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        pt: 2, 
        borderTop: 1, 
        borderColor: '#e0e0e0',
        backgroundColor: '#fafbfc'
      }}>
        <Button onClick={handleSkip} sx={{ color: '#666' }}>
          Skip Tour
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<PrevIcon />}
          sx={{ 
            borderColor: '#1a365d', 
            color: '#1a365d',
            '&:hover': { borderColor: '#0f2027', bgcolor: '#f0f8ff' }
          }}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          variant="contained"
          endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <NextIcon />}
          sx={{ 
            bgcolor: '#1a365d', 
            '&:hover': { bgcolor: '#0f2027' },
            color: 'white'
          }}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
