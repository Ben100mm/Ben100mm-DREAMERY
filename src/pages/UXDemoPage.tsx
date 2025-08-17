import { brandColors } from "../theme/theme";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
} from "@mui/material";
import {
  LoadingSpinner,
  LoadingOverlayComponent,
  LinearProgressWithLabel,
  SuccessMessage,
  ErrorMessage,
  InfoMessage,
  HelpTooltip,
  RequiredFieldIndicator,
  FieldHintText,
  ValidationError,
  SectionStatusIndicator,
  CompletionProgress,
  StatusChip,
  formatCurrency,
  formatPercentage,
  formatPhoneNumber,
  Breadcrumbs,
  QuickJumpMenu,
  SaveProgressIndicator,
  EnhancedTextFieldWithValidation,
  EnhancedSelectWithValidation,
  EnhancedNumberInput,
  FormSection,
  useFormValidation,
  NavigationProgress,
  SectionStatusList,
  ProgressBar,
  useSaveProgress,
  SaveProgressComponent,
  AutoSaveStatus,
  SaveProgressBar,
} from "../components";

const UXDemoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Form validation example
  const formValidation = useFormValidation({
    name: "",
    email: "",
    phone: "",
    amount: 0,
    percentage: 0,
  });

  // Save progress example
  const saveProgress = useSaveProgress(
    { demoData: "Initial value" },
    async (data) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Saving:", data);
    },
    10000, // 10 seconds
    true,
  );

  // Demo loading state
  const handleDemoLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  // Demo progress
  const handleDemoProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Demo messages
  const handleDemoSuccess = () => setShowSuccess(true);
  const handleDemoError = () => setShowError(true);
  const handleDemoInfo = () => setShowInfo(true);

  // Navigation steps
  const navigationSteps = [
    {
      id: "step1",
      label: "Basic Information",
      description: "Enter your basic details",
      completed: formValidation.values.name !== "",
      required: true,
      component: (
        <Box>
          <EnhancedTextFieldWithValidation
            label="Full Name"
            value={formValidation.values.name}
            onChange={(value) => formValidation.setValue("name", value)}
            required
            hint="Enter your full legal name"
            tooltip="This is the name that will appear on official documents"
            error={formValidation.errors.name}
            success={formValidation.values.name.length > 2}
          />
        </Box>
      ),
    },
    {
      id: "step2",
      label: "Contact Details",
      description: "Provide your contact information",
      completed:
        formValidation.values.email !== "" &&
        formValidation.values.phone !== "",
      required: true,
      component: (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <EnhancedTextFieldWithValidation
              label="Email Address"
              value={formValidation.values.email}
              onChange={(value) => formValidation.setValue("email", value)}
              type="email"
              required
              hint="Enter a valid email address"
              error={formValidation.errors.email}
            />
          </Box>
          <Box>
            <EnhancedTextFieldWithValidation
              label="Phone Number"
              value={formValidation.values.phone}
              onChange={(value) => formValidation.setValue("phone", value)}
              type="tel"
              format="phone"
              required
              hint="Enter your phone number"
              error={formValidation.errors.phone}
            />
          </Box>
        </Box>
      ),
    },
    {
      id: "step3",
      label: "Financial Information",
      description: "Enter your financial details",
      completed:
        formValidation.values.amount > 0 &&
        formValidation.values.percentage > 0,
      required: true,
      component: (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <EnhancedNumberInput
              label="Amount"
              value={formValidation.values.amount}
              onChange={(value) => formValidation.setValue("amount", value)}
              format="currency"
              required
              hint="Enter the amount in dollars"
              min={0}
              max={1000000}
            />
          </Box>
          <Box>
            <EnhancedNumberInput
              label="Interest Rate"
              value={formValidation.values.percentage}
              onChange={(value) => formValidation.setValue("percentage", value)}
              format="percentage"
              required
              hint="Enter the annual interest rate"
              min={0}
              max={100}
              step={0.01}
            />
          </Box>
        </Box>
      ),
    },
  ];

  // Section status data
  const sectionStatus = [
    {
      id: "basic",
      label: "Basic Information",
      completed: true,
      required: true,
    },
    {
      id: "contact",
      label: "Contact Details",
      completed: true,
      required: true,
    },
    {
      id: "financial",
      label: "Financial Information",
      completed: false,
      required: true,
    },
    {
      id: "documents",
      label: "Document Upload",
      completed: false,
      required: false,
    },
    {
      id: "review",
      label: "Review & Submit",
      completed: false,
      required: true,
    },
  ];

  // Quick jump sections
  const quickJumpSections = [
    { id: "overview", label: "Overview", completed: true },
    { id: "details", label: "Details", completed: true },
    { id: "finances", label: "Finances", completed: false },
    { id: "summary", label: "Summary", completed: false },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        UX Improvements Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page demonstrates all the user experience improvements implemented
        across the application.
      </Typography>

      {/* Breadcrumbs */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Navigation & Breadcrumbs
        </Typography>
        <Breadcrumbs
          items={[
            { label: "Home", onClick: () => console.log("Home clicked") },
            { label: "Demo", onClick: () => console.log("Demo clicked") },
            { label: "UX Improvements", active: true },
          ]}
        />
      </Box>

      {/* Progress Indicators */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Progress Indicators
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Linear Progress
              </Typography>
              <LinearProgressWithLabel
                value={progress}
                label="Current Progress"
                showPercentage
              />
              <Button onClick={handleDemoProgress} sx={{ mt: 2 }}>
                Start Progress Demo
              </Button>
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Completion Progress
              </Typography>
              <CompletionProgress
                completed={3}
                total={5}
                label="Form Completion"
              />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Loading States */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Loading States
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          }}
        >
          <Box>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Loading Spinner
              </Typography>
              <LoadingSpinner message="Processing..." />
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Loading Overlay
              </Typography>
              <LoadingOverlayComponent
                loading={loading}
                message="Loading data..."
              >
                <Box
                  sx={{
                    height: 100,
                    backgroundColor: brandColors.neutral.light,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography>Content Area</Typography>
                </Box>
              </LoadingOverlayComponent>
              <Button onClick={handleDemoLoading} sx={{ mt: 2 }}>
                Toggle Loading
              </Button>
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Progress Bar
              </Typography>
              <ProgressBar
                current={progress}
                total={100}
                label="Upload Progress"
                showPercentage
              />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Success/Error Messages */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Success/Error Messages
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={handleDemoSuccess}
            >
              Show Success
            </Button>
          </Box>
          <Box>
            <Button variant="contained" color="error" onClick={handleDemoError}>
              Show Error
            </Button>
          </Box>
          <Box>
            <Button variant="contained" color="info" onClick={handleDemoInfo}>
              Show Info
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Form Components */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Enhanced Form Components
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Enhanced Text Field
              </Typography>
              <EnhancedTextFieldWithValidation
                label="Property Address"
                value={formValidation.values.name}
                onChange={(value) => formValidation.setValue("name", value)}
                required
                hint="Enter the property's full street address"
                tooltip="This should include street number, name, city, state, and ZIP code"
                placeholder="123 Main St, City, State 12345"
                multiline
                rows={2}
              />
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Enhanced Select
              </Typography>
              <EnhancedSelectWithValidation
                label="Property Type"
                value={formValidation.values.email}
                onChange={(value) => formValidation.setValue("email", value)}
                options={[
                  { value: "single", label: "Single Family" },
                  { value: "multi", label: "Multi Family" },
                  { value: "condo", label: "Condominium" },
                  { value: "townhouse", label: "Townhouse" },
                ]}
                required
                hint="Select the type of property"
                tooltip="This determines the loan type and requirements"
              />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Auto-formatting Examples */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Auto-formatting Examples
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          }}
        >
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Currency Formatting
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Input: 150000
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency("150000")}
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Percentage Formatting
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Input: 3.75
              </Typography>
              <Typography variant="h6" color="primary">
                {formatPercentage("3.75")}
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Phone Formatting
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Input: 5551234567
              </Typography>
              <Typography variant="h6" color="primary">
                {formatPhoneNumber("5551234567")}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Section Status */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Section Status
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Section Status List
              </Typography>
              <SectionStatusList
                sections={sectionStatus}
                onSectionClick={(id) => console.log("Clicked section:", id)}
              />
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Jump Menu
              </Typography>
              <QuickJumpMenu
                sections={quickJumpSections}
                onJumpTo={(id) => console.log("Jump to:", id)}
              />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Save Progress */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Save Progress & Auto-save
        </Typography>
        <Paper sx={{ p: 3 }}>
          <SaveProgressComponent
            isSaving={saveProgress.isSaving}
            lastSaved={saveProgress.lastSaved}
            hasUnsavedChanges={saveProgress.hasUnsavedChanges}
            onSave={() => saveProgress.save()}
            onReset={saveProgress.resetToLastSaved}
            onExport={saveProgress.exportData}
            onImport={saveProgress.importData}
            showAutoSave
            autoSaveInterval={10000}
          />
        </Paper>
      </Box>

      {/* Navigation Progress */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Navigation Progress
        </Typography>
        <NavigationProgress
          steps={navigationSteps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          title="Multi-Step Form Demo"
          subtitle="This demonstrates the enhanced navigation and progress tracking"
          showBreadcrumbs
          showProgress
          showQuickJump
        />
      </Box>

      {/* Status Chips */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Status Chips
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <StatusChip status="success" label="Completed" />
          <StatusChip status="error" label="Error" />
          <StatusChip status="warning" label="Warning" />
          <StatusChip status="info" label="Information" />
          <StatusChip status="default" label="Default" />
        </Box>
      </Box>

      {/* Form Section Example */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Form Section Component
        </Typography>
        <FormSection
          title="Property Details"
          subtitle="Enter the basic property information"
          completed={false}
          required
          collapsible
          defaultExpanded
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Box>
              <EnhancedTextFieldWithValidation
                label="Property Address"
                value=""
                onChange={() => {}}
                required
                hint="Enter the full property address"
              />
            </Box>
            <Box>
              <EnhancedNumberInput
                label="Purchase Price"
                value={0}
                onChange={() => {}}
                format="currency"
                required
                hint="Enter the purchase price"
                min={0}
              />
            </Box>
          </Box>
        </FormSection>
      </Box>

      {/* Success/Error Messages */}
      {showSuccess && (
        <SuccessMessage
          message="Analysis saved successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorMessage
          message="Please check your input values"
          onClose={() => setShowError(false)}
        />
      )}
      {showInfo && (
        <InfoMessage
          message="Your progress has been automatically saved"
          onClose={() => setShowInfo(false)}
        />
      )}
    </Container>
  );
};

export default UXDemoPage;
