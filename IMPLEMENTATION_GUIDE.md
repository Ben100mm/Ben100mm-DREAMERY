# Design System Implementation Guide

This guide provides step-by-step instructions for implementing the Dreamery Design System in your project.

## Quick Start

### 1. Import Design System Components

```tsx
// Import individual components
import { Button, Card, Typography, Input } from '@/components/design-system';

// Or import everything
import * as DesignSystem from '@/components/design-system';
```

### 2. Wrap Your App with ThemeProvider

```tsx
import { ThemeProvider } from '@/components/design-system';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 3. Use Semantic CSS Classes

```tsx
// Use utility classes for quick styling
<div className="bg-default text-default p-4 rounded-lg shadow">
  <h1 className="text-2xl font-bold text-brand-primary">Title</h1>
  <p className="text-muted">Subtitle</p>
</div>
```

## Migration from Existing Components

### Step 1: Update Imports

Replace existing component imports:

```tsx
// Before
import { Button, Card, Typography } from '@mui/material';

// After
import { Button, Card, Typography } from '@/components/design-system';
```

### Step 2: Update Component Props

Update component props to use design system variants:

```tsx
// Before
<Button variant="contained" color="primary" size="large">
  Click me
</Button>

// After
<Button variant="default" size="lg">
  Click me
</Button>
```

### Step 3: Replace Hardcoded Colors

Replace hardcoded colors with semantic tokens:

```tsx
// Before
<div style={{ backgroundColor: '#1a365d', color: '#ffffff' }}>
  Content
</div>

// After
<div className="bg-brand-primary text-brand-primary-contrast">
  Content
</div>
```

## Component Usage Examples

### Buttons

```tsx
import { Button } from '@/components/design-system';

// Primary action
<Button variant="default" size="lg">
  Save Changes
</Button>

// Secondary action
<Button variant="outline" size="md">
  Cancel
</Button>

// Loading state
<Button variant="default" loading loadingText="Saving...">
  Save
</Button>

// Destructive action
<Button variant="destructive" size="sm">
  Delete
</Button>
```

### Cards

```tsx
import { Card } from '@/components/design-system';

<Card variant="elevated" padding="lg">
  <Typography variant="h3">Card Title</Typography>
  <Typography variant="body1" color="muted">
    Card content goes here
  </Typography>
</Card>
```

### Forms

```tsx
import { Input, Button } from '@/components/design-system';

<form>
  <Input
    label="Email Address"
    type="email"
    placeholder="Enter your email"
    variant="outlined"
    size="md"
    required
  />
  
  <Input
    label="Password"
    type="password"
    placeholder="Enter your password"
    showPasswordToggle
    variant="outlined"
    size="md"
    required
  />
  
  <Button type="submit" variant="default" size="lg">
    Sign In
</Button>
</form>
```

### Layout

```tsx
import { Container, Grid, GridItem, Spacer } from '@/components/design-system';

<Container variant="wide" padding="lg">
  <Grid columns={12} gap="md" responsive>
    <GridItem span={8}>
      <Typography variant="h1">Main Content</Typography>
      <Typography variant="body1">
        Your main content goes here
      </Typography>
    </GridItem>
    
    <GridItem span={4}>
      <Card variant="elevated">
        <Typography variant="h3">Sidebar</Typography>
        <Typography variant="body2">
          Sidebar content
        </Typography>
      </Card>
    </GridItem>
  </Grid>
  
  <Spacer size="section" />
</Container>
```

## CSS Custom Properties Usage

### Direct CSS Usage

```css
.my-component {
  background-color: rgb(var(--bg-default));
  color: rgb(var(--fg-default));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.my-component:hover {
  background-color: rgb(var(--bg-muted));
  box-shadow: var(--shadow-md);
}
```

### Styled Components Usage

```tsx
import styled from 'styled-components';

const StyledComponent = styled.div`
  background-color: rgb(var(--bg-default));
  color: rgb(var(--fg-default));
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  
  &:hover {
    background-color: rgb(var(--bg-muted));
  }
`;
```

## Theme Switching

### Using the Theme Hook

```tsx
import { useTheme } from '@/components/design-system';

function ThemeToggle() {
  const { mode, setMode, actualMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {actualMode}</p>
      <button onClick={() => setMode('light')}>Light</button>
      <button onClick={() => setMode('dark')}>Dark</button>
      <button onClick={() => setMode('system')}>System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### Manual Theme Switching

```tsx
// Set theme programmatically
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.removeAttribute('data-theme'); // for light
```

## Responsive Design

### Using Responsive Utilities

```tsx
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Responsive Heading
  </h1>
</div>
```

### Using Grid System

```tsx
<Grid columns={12} gap="md" responsive>
  <GridItem span={12} md={8} lg={6}>
    Main content
  </GridItem>
  <GridItem span={12} md={4} lg={6}>
    Sidebar
  </GridItem>
</Grid>
```

## Accessibility Best Practices

### Focus Management

```tsx
<Button className="focus-ring">
  Accessible Button
</Button>
```

### ARIA Labels

```tsx
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>

<Input
  label="Password"
  aria-describedby="password-help"
  aria-invalid={hasError}
/>
```

### Color Contrast

Always test color combinations for WCAG AA compliance:

```tsx
// Good - high contrast
<div className="bg-brand-primary text-brand-primary-contrast">
  High contrast text
</div>

// Bad - low contrast
<div className="bg-muted text-muted">
  Low contrast text
</div>
```

## Performance Optimization

### Lazy Loading Components

```tsx
import { lazy, Suspense } from 'react';

const DesignSystemShowcase = lazy(() => import('@/components/design-system/DesignSystemShowcase'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesignSystemShowcase />
    </Suspense>
  );
}
```

### CSS Custom Properties

The design system uses CSS custom properties for optimal performance:

- No JavaScript runtime theme switching
- CSS-only color changes
- Minimal bundle size impact
- Browser-optimized rendering

## Common Patterns

### Page Layout

```tsx
import { Container, Spacer, Typography } from '@/components/design-system';

function PageLayout({ children, title }) {
  return (
    <Container variant="wide" padding="lg">
      <Typography variant="h1">{title}</Typography>
      <Spacer size="lg" />
      {children}
    </Container>
  );
}
```

### Form Layout

```tsx
import { Card, Input, Button, Grid, GridItem } from '@/components/design-system';

function FormLayout({ onSubmit }) {
  return (
    <Card variant="elevated" padding="lg">
      <form onSubmit={onSubmit}>
        <Grid columns={1} gap="md">
          <GridItem>
            <Input label="Name" required />
          </GridItem>
          <GridItem>
            <Input label="Email" type="email" required />
          </GridItem>
          <GridItem>
            <Button type="submit" variant="default" fullWidth>
              Submit
            </Button>
          </GridItem>
        </Grid>
      </form>
    </Card>
  );
}
```

### Loading States

```tsx
import { ProgressIndicator, Card, Typography } from '@/components/design-system';

function LoadingCard() {
  return (
    <Card variant="elevated" padding="lg">
      <Typography variant="h3">Loading...</Typography>
      <ProgressIndicator
        type="linear"
        variant="info"
        indeterminate
        label="Please wait"
      />
    </Card>
  );
}
```

## Troubleshooting

### Common Issues

1. **Colors not updating**: Ensure you're using `rgb(var(--token))` syntax
2. **Theme not switching**: Check that ThemeProvider wraps your app
3. **Responsive not working**: Verify responsive prop is set to true
4. **TypeScript errors**: Import types from the design system

### Debug Mode

Enable debug mode to see design tokens:

```css
* {
  outline: 1px solid red; /* Debug all elements */
}

[class*="bg-"] {
  outline: 2px solid blue; /* Debug background classes */
}
```

## Testing

### Visual Regression Testing

Test components across different themes and screen sizes:

```tsx
// Test light theme
<ThemeProvider defaultMode="light">
  <YourComponent />
</ThemeProvider>

// Test dark theme
<ThemeProvider defaultMode="dark">
  <YourComponent />
</ThemeProvider>
```

### Accessibility Testing

Use tools like:
- axe-core for automated testing
- WAVE for visual accessibility
- Keyboard navigation testing
- Screen reader testing

## Maintenance

### Regular Updates

1. **Color audits**: Check contrast ratios quarterly
2. **Component reviews**: Update components based on usage patterns
3. **Performance monitoring**: Track bundle size and render performance
4. **Accessibility testing**: Regular WCAG compliance checks

### Contributing

When adding new components:

1. Follow existing patterns
2. Include TypeScript types
3. Add accessibility features
4. Test responsive behavior
5. Update documentation
6. Validate with design team

## Resources

- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Component API Reference](./src/components/design-system/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
