import React, { useState } from 'react';
import {
  Button,
  Card,
  Typography,
  Input,
  Container,
  Spacer,
  Grid,
  GridItem,
  Alert,
  ProgressIndicator,
  ThemeProvider,
  useTheme,
} from './index';
import { Box } from '@mui/material';
import { Email, Lock, Person, Search, Notifications } from '@mui/icons-material';

// Example of integrating the design system into an existing page
const ExamplePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
    }, 2000);
  };

  return (
    <Container variant="wide" padding="lg">
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="display2" color="brand-primary">
          Welcome to Dreamery
        </Typography>
        <Typography variant="lead" color="muted">
          Your comprehensive real estate platform
        </Typography>
      </Box>

      {/* Alert Section */}
      {showAlert && (
        <Alert
          variant="success"
          title="Success!"
          dismissible
          onDismiss={() => setShowAlert(false)}
        >
          Your account has been created successfully!
        </Alert>
      )}

      <Spacer size="lg" />

      {/* Main Content Grid */}
      <Grid columns={12} gap="lg" responsive>
        {/* Left Column - Form */}
        <GridItem span={12}>
          <Card variant="elevated" padding="lg">
            <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
              Create Account
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  leftIcon={<Person />}
                  variant="outlined"
                  size="md"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  leftIcon={<Email />}
                  variant="outlined"
                  size="md"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  leftIcon={<Lock />}
                  showPasswordToggle
                  variant="outlined"
                  size="md"
                  required
                />

                {isLoading ? (
                  <ProgressIndicator
                    type="linear"
                    variant="info"
                    indeterminate
                    label="Creating your account..."
                  />
                ) : (
                  <Box sx={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      fullWidth
                    >
                      Create Account
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </form>
          </Card>
        </GridItem>

        {/* Right Column - Features */}
        <GridItem span={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Card variant="glass" padding="lg">
              <Typography variant="h4" color="brand-primary" style={{ marginBottom: 'var(--space-3)' }}>
                Why Choose Dreamery?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Box>
                  <Typography variant="h6" color="default">
                    Comprehensive Tools
                  </Typography>
                  <Typography variant="body2" color="muted">
                    Everything you need to manage your real estate portfolio in one place.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="default">
                    Expert Support
                  </Typography>
                  <Typography variant="body2" color="muted">
                    Get help from our team of real estate professionals.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="default">
                    Advanced Analytics
                  </Typography>
                  <Typography variant="body2" color="muted">
                    Make data-driven decisions with our powerful analytics tools.
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Card variant="subtle" padding="lg">
              <Typography variant="h5" color="brand-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Button variant="ghost" size="md" fullWidth>
                  <Search style={{ marginRight: 'var(--space-2)' }} />
                  Search Properties
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  <Notifications style={{ marginRight: 'var(--space-2)' }} />
                  View Notifications
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  <Person style={{ marginRight: 'var(--space-2)' }} />
                  Manage Profile
                </Button>
              </Box>
            </Card>
          </Box>
        </GridItem>
      </Grid>

      <Spacer size="section" />
    </Container>
  );
};

// Wrapper with theme provider
const ExampleIntegration: React.FC = () => {
  return (
    <ThemeProvider defaultMode="light">
      <ExamplePage />
    </ThemeProvider>
  );
};

export default ExampleIntegration;
