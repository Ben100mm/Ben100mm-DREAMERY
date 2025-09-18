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
  ProgressIndicator,
  Alert,
  ThemeProvider,
  useTheme,
} from './index';
import { Box, Divider } from '@mui/material';
import { Email, Lock, Person, Search } from '@mui/icons-material';

const ThemeToggle: React.FC = () => {
  const { mode, setMode, actualMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
      <Typography variant="h6">Theme:</Typography>
      <Button
        variant={mode === 'light' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setMode('light')}
      >
        Light
      </Button>
      <Button
        variant={mode === 'dark' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setMode('dark')}
      >
        Dark
      </Button>
      <Button
        variant={mode === 'system' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setMode('system')}
      >
        System
      </Button>
      <Typography variant="caption" color="muted">
        (Current: {actualMode})
      </Typography>
    </Box>
  );
};

const ColorPalette: React.FC = () => {
  const colors = [
    { name: 'Primary', token: '--brand-primary', class: 'bg-brand-primary' },
    { name: 'Secondary', token: '--brand-secondary', class: 'bg-brand-secondary' },
    { name: 'Accent', token: '--brand-accent', class: 'bg-brand-accent' },
    { name: 'Success', token: '--success', class: 'bg-success' },
    { name: 'Warning', token: '--warning', class: 'bg-warning' },
    { name: 'Danger', token: '--danger', class: 'bg-danger' },
    { name: 'Info', token: '--info', class: 'bg-info' },
  ];

  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
        Color Palette
      </Typography>
      <Grid columns={2} gap="md">
        {colors.map((color) => (
          <GridItem key={color.name}>
            <Box
              className={`${color.class} rounded-lg p-4`}
              style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography variant="body2" color="inverse" weight="semibold">
                {color.name}
              </Typography>
            </Box>
            <Typography variant="caption" color="muted" style={{ marginTop: 'var(--space-1)' }}>
              {color.token}
            </Typography>
          </GridItem>
        ))}
      </Grid>
    </Card>
  );
};

const TypographyShowcase: React.FC = () => {
  const typographyVariants = [
    { variant: 'display1', text: 'Display 1', description: 'Hero headlines' },
    { variant: 'display2', text: 'Display 2', description: 'Page titles' },
    { variant: 'h1', text: 'Heading 1', description: 'Main headings' },
    { variant: 'h2', text: 'Heading 2', description: 'Sub headings' },
    { variant: 'h3', text: 'Heading 3', description: 'Card titles' },
    { variant: 'body1', text: 'Body 1', description: 'Default text' },
    { variant: 'body2', text: 'Body 2', description: 'Secondary text' },
    { variant: 'lead', text: 'Lead text', description: 'Introductory text' },
    { variant: 'caption', text: 'Caption', description: 'Small text' },
  ] as const;

  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
        Typography Scale
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {typographyVariants.map(({ variant, text, description }) => (
          <Box key={variant}>
            <Typography variant={variant as any}>{text}</Typography>
            <Typography variant="caption" color="muted">
              {description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

const ButtonShowcase: React.FC = () => {
  const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'warning', 'info'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
        Button Variants
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Box>
          <Typography variant="h6" style={{ marginBottom: 'var(--space-2)' }}>Variants</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" style={{ marginBottom: 'var(--space-2)' }}>Sizes</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {sizes.map((size) => (
              <Button key={size} variant="default" size={size}>
                {size}
              </Button>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" style={{ marginBottom: 'var(--space-2)' }}>States</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Button variant="default" loading loadingText="Loading...">
              Loading
            </Button>
            <Button variant="default" disabled>
              Disabled
            </Button>
            <Button variant="default" fullWidth>
              Full Width
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const FormShowcase: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    search: '',
  });

  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
        Form Components
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          leftIcon={<Email />}
          variant="outlined"
          size="md"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          leftIcon={<Lock />}
          showPasswordToggle
          variant="outlined"
          size="md"
        />

        <Input
          label="Search"
          placeholder="Search..."
          value={formData.search}
          onChange={(e) => setFormData({ ...formData, search: e.target.value })}
          rightIcon={<Search />}
          variant="outlined"
          size="md"
        />

        <Box sx={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="default">Submit</Button>
          <Button variant="outline">Cancel</Button>
        </Box>
      </Box>
    </Card>
  );
};

const ProgressShowcase: React.FC = () => {
  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
        Progress Indicators
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Box>
          <Typography variant="h6" style={{ marginBottom: 'var(--space-2)' }}>Linear Progress</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <ProgressIndicator
              type="linear"
              value={75}
              max={100}
              showPercentage
              label="Upload Progress"
            />
            <ProgressIndicator
              type="linear"
              value={45}
              max={100}
              variant="success"
              showPercentage
              label="Success Progress"
            />
            <ProgressIndicator
              type="linear"
              variant="warning"
              indeterminate
              label="Processing..."
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" style={{ marginBottom: 'var(--space-2)' }}>Circular Progress</Typography>
          <Box sx={{ display: 'flex', gap: 'var(--space-4)' }}>
            <ProgressIndicator
              type="circular"
              value={60}
              showPercentage
              size="sm"
            />
            <ProgressIndicator
              type="circular"
              value={80}
              variant="success"
              showPercentage
              size="md"
            />
            <ProgressIndicator
              type="circular"
              variant="info"
              indeterminate
              size="lg"
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const AlertShowcase: React.FC = () => {
  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3" color="brand-primary" style={{ marginBottom: 'var(--space-4)' }}>
        Alert Components
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Alert variant="success" title="Success!" dismissible>
          Your changes have been saved successfully.
        </Alert>
        
        <Alert variant="warning" title="Warning">
          Please review your information before proceeding.
        </Alert>
        
        <Alert variant="danger" title="Error" dismissible>
          Something went wrong. Please try again.
        </Alert>
        
        <Alert variant="info" title="Information">
          This is some helpful information for the user.
        </Alert>
      </Box>
    </Card>
  );
};

const DesignSystemShowcase: React.FC = () => {
  return (
    <ThemeProvider defaultMode="light">
      <Container padding="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Box>
            <Typography variant="display2" color="brand-primary" align="center">
              Dreamery Design System
            </Typography>
            <Typography variant="lead" color="muted" align="center">
              A comprehensive design system for consistent, accessible, and maintainable UI components
            </Typography>
          </Box>

          <ThemeToggle />

          <Grid columns={1} gap="lg">
            <GridItem>
              <ColorPalette />
            </GridItem>
            
            <GridItem>
              <TypographyShowcase />
            </GridItem>
            
            <GridItem>
              <ButtonShowcase />
            </GridItem>
            
            <GridItem>
              <FormShowcase />
            </GridItem>
            
            <GridItem>
              <ProgressShowcase />
            </GridItem>
            
            <GridItem>
              <AlertShowcase />
            </GridItem>
          </Grid>

          <Spacer size="section" />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default DesignSystemShowcase;
