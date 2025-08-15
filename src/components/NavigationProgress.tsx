import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Divider,
  Collapse,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Home as HomeIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  Breadcrumbs,
  QuickJumpMenu,
  CompletionProgress,
  SectionStatusIndicator,
} from "./UXComponents";

// Styled components
const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const StepContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderLeft: `2px solid ${theme.palette.divider}`,
  marginLeft: theme.spacing(2),
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

// Navigation Step Interface
export interface NavigationStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  required: boolean;
  component: React.ReactNode;
  validation?: () => boolean;
}

// Main Navigation Component
export const NavigationProgress: React.FC<{
  steps: NavigationStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete?: () => void;
  showBreadcrumbs?: boolean;
  showProgress?: boolean;
  showQuickJump?: boolean;
  title?: string;
  subtitle?: string;
}> = ({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  showBreadcrumbs = true,
  showProgress = true,
  showQuickJump = true,
  title,
  subtitle,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(currentStep);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
      setExpandedStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
      setExpandedStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    onStepChange(stepIndex);
    setExpandedStep(stepIndex);
  };

  const handleStepToggle = (stepIndex: number) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;

  const breadcrumbItems = steps.map((step, index) => ({
    label: step.label,
    onClick: () => handleStepClick(index),
    active: index === currentStep,
  }));

  const quickJumpSections = steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    completed: step.completed,
  }));

  const handleJumpTo = (id: string) => {
    const stepIndex = steps.findIndex((step) => step.id === id);
    if (stepIndex !== -1) {
      handleStepClick(stepIndex);
    }
    setDrawerOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box>
      {/* Header with Title and Progress */}
      {title && (
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Breadcrumbs */}
      {showBreadcrumbs && <Breadcrumbs items={breadcrumbItems} />}

      {/* Progress Overview */}
      {showProgress && (
        <ProgressContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" component="h2">
              Progress Overview
            </Typography>
            <Chip
              label={`${completedSteps}/${totalSteps} completed`}
              color={completedSteps === totalSteps ? "success" : "primary"}
              variant="outlined"
            />
          </Box>

          <CompletionProgress
            completed={completedSteps}
            total={totalSteps}
            label="Overall Progress"
          />

          {showQuickJump && (
            <Box mt={2}>
              <QuickJumpMenu
                sections={quickJumpSections}
                onJumpTo={handleJumpTo}
              />
            </Box>
          )}
        </ProgressContainer>
      )}

      {/* Stepper Navigation */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Stepper activeStep={currentStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.id} completed={step.completed}>
              <StepLabel
                optional={
                  <Box display="flex" alignItems="center" gap={1}>
                    {step.required && (
                      <Chip
                        label="Required"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    {step.completed && (
                      <Chip
                        label="Completed"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                onClick={() => handleStepToggle(index)}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1">{step.label}</Typography>
                  {step.description && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStepToggle(index);
                      }}
                    >
                      {expandedStep === index ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  )}
                </Box>
              </StepLabel>

              <StepContent>
                <StepContentWrapper>
                  {step.description && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {step.description}
                    </Typography>
                  )}

                  <Collapse in={expandedStep === index}>
                    {step.component}
                  </Collapse>

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      startIcon={<NavigateBeforeIcon />}
                    >
                      Back
                    </Button>

                    <Box>
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onComplete}
                          disabled={!step.completed}
                        >
                          Complete
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          disabled={!step.completed}
                          endIcon={<NavigateNextIcon />}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
                  </Box>
                </StepContentWrapper>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Floating Action Buttons */}
      <FloatingActionButton
        color="primary"
        size="small"
        onClick={scrollToTop}
        sx={{ bottom: 80 }}
      >
        <ArrowUpwardIcon />
      </FloatingActionButton>

      <FloatingActionButton
        color="secondary"
        size="small"
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </FloatingActionButton>

      {/* Quick Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        <DrawerHeader>
          <Typography variant="h6">Quick Navigation</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <NavigateBeforeIcon />
          </IconButton>
        </DrawerHeader>

        <List>
          {steps.map((step, index) => (
            <ListItem key={step.id} disablePadding>
              <ListItemButton
                onClick={() => handleJumpTo(step.id)}
                selected={index === currentStep}
              >
                <ListItemIcon>
                  {step.completed ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={step.label}
                  secondary={step.description}
                  primaryTypographyProps={{
                    fontWeight: index === currentStep ? "medium" : "normal",
                  }}
                />
                {step.required && (
                  <Chip
                    label="Required"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <Box p={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Progress Summary
          </Typography>
          <CompletionProgress completed={completedSteps} total={totalSteps} />
        </Box>
      </Drawer>
    </Box>
  );
};

// Section Status Component
export const SectionStatusList: React.FC<{
  sections: Array<{
    id: string;
    label: string;
    completed: boolean;
    required?: boolean;
  }>;
  onSectionClick?: (id: string) => void;
}> = ({ sections, onSectionClick }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Section Status
      </Typography>
      {sections.map((section) => (
        <SectionStatusIndicator
          key={section.id}
          completed={section.completed}
          label={`${section.label}${section.required ? " *" : ""}`}
          onClick={() => onSectionClick?.(section.id)}
        />
      ))}
    </Box>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<{
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}> = ({ current, total, label, showPercentage = true, color = "primary" }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <Box>
      {label && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {showPercentage && (
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight="medium"
            >
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
      )}

      <Box
        sx={{
          width: "100%",
          height: 8,
          backgroundColor: "divider",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: `${color}.main`,
            transition: "width 0.3s ease",
          }}
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="right"
      >
        {current} of {total}
      </Typography>
    </Box>
  );
};
