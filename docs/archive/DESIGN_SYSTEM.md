# Dreamery Design System

A comprehensive design system built for the Dreamery platform, providing consistent, accessible, and maintainable UI components.

## Table of Contents

- [Design Language Principles](#design-language-principles)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Library](#component-library)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)
- [Usage Guidelines](#usage-guidelines)

## Design Language Principles

### Core Principles
- **Minimalist & Uncluttered**: Clean layouts with ample white space
- **Consistent Typography**: Clear hierarchy with Inter and Montserrat fonts
- **Cohesive Brand Palette**: Semantic color tokens for maintainability
- **Rounded Corners**: Friendly, approachable aesthetic (8px base radius)
- **Trust-Focused**: Real product interfaces and professional appearance

### Visual Identity
- **Primary Brand**: #1a365d (Dark Blue)
- **Secondary Brand**: #0d2340 (Darker Blue)
- **Accent Color**: #1976d2 (Info Blue)
- **Typography**: Inter (body) + Montserrat (headings)
- **Border Radius**: 8px base, 12px for cards, 16px for large elements

## Color System

### Semantic Color Tokens

Our color system uses CSS custom properties with semantic naming for maintainability and theme switching.

#### Backgrounds
```css
--bg-default: 255 255 255;     /* Primary background */
--bg-muted: 248 249 250;       /* Muted background */
--bg-elevated: 255 255 255;    /* Elevated surfaces */
--bg-subtle: 240 244 248;      /* Very light blue tint */
```

#### Content
```css
--fg-default: 51 51 51;        /* Primary text */
--fg-muted: 102 102 102;       /* Secondary text */
--fg-subtle: 158 158 158;      /* Tertiary text */
--fg-inverse: 255 255 255;     /* Inverse text */
--fg-disabled: 189 189 189;    /* Disabled text */
```

#### Brand Colors
```css
--brand-primary: 26 54 93;     /* #1a365d */
--brand-secondary: 13 35 64;   /* #0d2340 */
--brand-accent: 25 118 210;    /* #1976d2 */
```

#### Status Colors
```css
--success: 76 175 80;          /* #4caf50 */
--warning: 255 152 0;          /* #ff9800 */
--danger: 244 67 54;           /* #f44336 */
--info: 33 150 243;            /* #2196f3 */
```

### Dark Mode Support

All colors automatically adapt to dark mode using the `[data-theme="dark"]` selector:

```css
[data-theme="dark"] {
  --bg-default: 13 35 64;      /* Dark background */
  --fg-default: 255 255 255;   /* Light text */
  /* ... all other colors adapt */
}
```

### Usage Guidelines

- **Never hardcode colors** - Always use semantic tokens
- **Test accessibility** - Ensure WCAG AA contrast ratios
- **Use semantic names** - `--brand-primary` not `--blue-500`
- **Support both themes** - All colors have light/dark variants

## Typography

### Font Families
- **Primary**: Inter (body text, UI elements)
- **Display**: Montserrat (headings, large text)

### Type Scale

| Element | Font Size | Line Height | Weight | Usage |
|---------|-----------|-------------|--------|-------|
| Display 1 | 60px | 1.25 | 900 | Hero headlines |
| Display 2 | 48px | 1.25 | 800 | Page titles |
| Display 3 | 36px | 1.375 | 700 | Section headers |
| H1 | 48px | 1.25 | 700 | Main headings |
| H2 | 36px | 1.25 | 700 | Sub headings |
| H3 | 30px | 1.375 | 600 | Card titles |
| H4 | 24px | 1.375 | 600 | Small headings |
| H5 | 20px | 1.5 | 600 | Labels |
| H6 | 18px | 1.5 | 600 | Small labels |
| Body 1 | 16px | 1.5 | 400 | Default text |
| Body 2 | 14px | 1.5 | 400 | Secondary text |
| Lead | 18px | 1.625 | 400 | Introductory text |
| Caption | 12px | 1.5 | 400 | Small text |
| Small | 14px | 1.5 | 400 | Helper text |

### Usage Examples

```tsx
import { Typography } from '@/components/design-system';

// Headings
<Typography variant="h1">Main Heading</Typography>
<Typography variant="h2" color="muted">Sub Heading</Typography>

// Body text
<Typography variant="body1">Default paragraph text</Typography>
<Typography variant="lead" color="brand-primary">Introductory text</Typography>

// Special cases
<Typography variant="caption" color="subtle" truncate>
  Truncated text that will be cut off
</Typography>
```

## Spacing & Layout

### 8-Point Scale

Our spacing system uses an 8-point scale for consistency:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| --space-1 | 0.25rem | 4px | Tight spacing |
| --space-2 | 0.5rem | 8px | Small spacing |
| --space-3 | 0.75rem | 12px | Medium-small |
| --space-4 | 1rem | 16px | Base spacing |
| --space-6 | 1.5rem | 24px | Medium spacing |
| --space-8 | 2rem | 32px | Large spacing |
| --space-12 | 3rem | 48px | Section spacing |
| --space-16 | 4rem | 64px | Large section |
| --space-24 | 6rem | 96px | Page spacing |
| --space-32 | 8rem | 128px | Major section |

### Layout Containers

```tsx
import { Container } from '@/components/design-system';

// Default container (1280px max-width)
<Container>Content</Container>

// Narrow container (720px max-width)
<Container variant="narrow">Content</Container>

// Wide container (960px max-width)
<Container variant="wide">Content</Container>
```

### Grid System

```tsx
import { Grid, GridItem } from '@/components/design-system';

<Grid columns={12} gap="md" responsive>
  <GridItem span={8}>Main content</GridItem>
  <GridItem span={4}>Sidebar</GridItem>
</Grid>
```

## Component Library

### Button

```tsx
import { Button } from '@/components/design-system';

// Variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading loadingText="Saving...">Save</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

### Card

```tsx
import { Card } from '@/components/design-system';

<Card variant="elevated" padding="lg">
  <Typography variant="h3">Card Title</Typography>
  <Typography variant="body1">Card content goes here</Typography>
</Card>

// Variants: default, elevated, outlined, glass, subtle
// Padding: none, sm, md, lg
```

### Input

```tsx
import { Input } from '@/components/design-system';

<Input
  label="Email Address"
  placeholder="Enter your email"
  variant="outlined"
  size="md"
  showPasswordToggle
  leftIcon={<EmailIcon />}
  errorMessage="Please enter a valid email"
/>
```

### Progress Indicator

```tsx
import { ProgressIndicator } from '@/components/design-system';

// Linear progress
<ProgressIndicator
  type="linear"
  value={75}
  max={100}
  showPercentage
  label="Upload Progress"
/>

// Circular progress
<ProgressIndicator
  type="circular"
  value={60}
  showLabel
  label="Loading..."
/>
```

### Alert

```tsx
import { Alert } from '@/components/design-system';

<Alert variant="success" title="Success!" dismissible>
  Your changes have been saved successfully.
</Alert>

<Alert variant="warning" title="Warning">
  Please review your information before proceeding.
</Alert>
```

## Accessibility

### WCAG AA Compliance

All components are built with accessibility in mind:

- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Management**: Visible focus indicators
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Semantic HTML**: Correct heading hierarchy

### Focus Management

```css
.focus-ring:focus-visible {
  outline: 2px solid rgb(var(--ring));
  outline-offset: 2px;
}
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

## Responsive Design

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1199px
- **Desktop**: 1200px+

### Responsive Utilities

```css
/* Mobile first approach */
.component {
  font-size: var(--text-base);
}

@media (min-width: 768px) {
  .component {
    font-size: var(--text-lg);
  }
}

@media (min-width: 1200px) {
  .component {
    font-size: var(--text-xl);
  }
}
```

### Container Responsiveness

```tsx
<Container padding="sm md lg xl">
  {/* Responsive padding: sm on mobile, md on tablet, lg on desktop, xl on large screens */}
</Container>
```

## Usage Guidelines

### Do's ✅

- Use semantic color tokens instead of hardcoded values
- Follow the 8-point spacing scale
- Use appropriate typography variants
- Test with keyboard navigation
- Validate color contrast ratios
- Use responsive design patterns

### Don'ts ❌

- Don't hardcode colors (`color: #1a365d`)
- Don't skip accessibility features
- Don't use arbitrary spacing values
- Don't mix different design patterns
- Don't ignore responsive requirements
- Don't use components outside their intended purpose

### Performance

- Lazy load icons using `React.lazy`
- Keep initial bundle under 2MB
- Implement route-based code splitting
- Use CSS custom properties for theming
- Optimize images and assets

### Code Organization

- Centralized design tokens in CSS custom properties
- Reusable components with typed interfaces
- Consistent import ordering
- Comprehensive documentation
- Regular design system audits

## Getting Started

1. Import components from the design system:
```tsx
import { Button, Card, Typography } from '@/components/design-system';
```

2. Use semantic color tokens:
```tsx
<div className="bg-default text-default">
  Content with semantic colors
</div>
```

3. Follow the spacing scale:
```tsx
<div className="p-4 m-6">Content with consistent spacing</div>
```

4. Test accessibility:
- Use keyboard navigation
- Check color contrast
- Test with screen readers
- Validate ARIA labels

## Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns
2. Include TypeScript types
3. Add accessibility features
4. Test responsive behavior
5. Update documentation
6. Validate with design team

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material-UI Documentation](https://mui.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Design System Best Practices](https://designsystemsrepo.com/)
