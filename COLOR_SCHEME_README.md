# Dreamery Homepage Color Scheme

## Overview
This document outlines the standardized color scheme for the Dreamery Homepage project. All pages and components must use these predefined colors to maintain consistency and brand identity.

## Brand Color Palette

### Primary Brand Colors
- **Primary Brand Color**: `#1a365d` (Dark Blue)
  - Used for: Main brand elements, headers, primary buttons, navigation
  - Access via: `brandColors.primary`
  
- **Secondary Brand Color**: `#0d2340` (Darker Blue for Gradients)
  - Used for: Gradients, hover states, secondary elements
  - Access via: `brandColors.secondary`

### Accent Colors
- **Success Green**: `#4caf50`
  - Used for: Success indicators, completed states, positive actions
  - Access via: `brandColors.accent.success`
  
- **Warning Orange**: `#ff9800`
  - Used for: Pending states, warnings, attention-grabbing elements
  - Access via: `brandColors.accent.warning`
  
- **Info Blue**: `#2196f3`
  - Used for: Completed states, informational elements, links
  - Access via: `brandColors.accent.info`

### Neutral Colors
- **Light**: `#f5f5f5`
  - Used for: Light backgrounds, subtle highlights
  - Access via: `brandColors.neutral.light`
  
- **Medium**: `#e0e0e0`
  - Used for: Borders, dividers, secondary backgrounds
  - Access via: `brandColors.neutral.medium`
  
- **Dark**: `#666666`
  - Used for: Secondary text, muted elements
  - Access via: `brandColors.neutral.dark`

### Action Colors
- **Primary Actions**: `#1976d2` (Blue)
  - Used for: Primary buttons, main CTAs, active states
  - Access via: `brandColors.actions.primary`
  
- **Success**: `#4caf50` (Green)
  - Used for: Success buttons, positive actions
  - Access via: `brandColors.actions.success`
  
- **Warning**: `#ff9800` (Orange)
  - Used for: Warning buttons, caution actions
  - Access via: `brandColors.actions.warning`
  
- **Error**: `#f44336` (Red)
  - Used for: Error states, destructive actions
  - Access via: `brandColors.actions.error`

### Status Colors
- **Active**: `#1976d2` (Blue)
  - Used for: Active states, current selections
  - Access via: `brandColors.status.active`
  
- **Completed**: `#4caf50` (Green)
  - Used for: Completed tasks, finished states
  - Access via: `brandColors.status.completed`
  
- **Pending**: `#ff9800` (Orange)
  - Used for: Pending tasks, waiting states
  - Access via: `brandColors.status.pending`
  
- **Inactive**: `#9e9e9e` (Gray)
  - Used for: Disabled states, inactive elements
  - Access via: `brandColors.status.inactive`

### Background Colors
- **Primary**: `#ffffff` (White)
  - Used for: Main page backgrounds, cards, content areas
  - Access via: `brandColors.backgrounds.primary`
  
- **Secondary**: `#f8f9fa` (Light Gray)
  - Used for: Secondary backgrounds, subtle sections
  - Access via: `brandColors.backgrounds.secondary`
  
- **Selected**: `#e3f2fd` (Light Blue)
  - Used for: Selected states, highlighted areas
  - Access via: `brandColors.backgrounds.selected`
  
- **Hover**: `#f0f8ff` (Very Light Blue)
  - Used for: Hover states, interactive feedback
  - Access via: `brandColors.backgrounds.hover`
  
- **Success**: `#e8f5e8` (Light Green)
  - Used for: Success state backgrounds
  - Access via: `brandColors.backgrounds.success`
  
- **Warning**: `#fff3cd` (Light Yellow)
  - Used for: Warning state backgrounds
  - Access via: `brandColors.backgrounds.warning`
  
- **Error**: `#fff5f5` (Light Red)
  - Used for: Error state backgrounds
  - Access via: `brandColors.backgrounds.error`
  
- **Gradient**: `linear-gradient(135deg, #1a365d 0%, #0d2340 100%)`
  - Used for: Hero sections, prominent backgrounds
  - Access via: `brandColors.backgrounds.gradient`

### Border Colors
- **Primary**: `#1a365d` (Primary Brand Color)
  - Used for: Main borders, focus states
  - Access via: `brandColors.borders.primary`
  
- **Secondary**: `#e0e0e0` (Light Gray)
  - Used for: Secondary borders, subtle separators
  - Access via: `brandColors.borders.secondary`
  
- **Focus**: `#1976d2` (Blue)
  - Used for: Focus states, active borders
  - Access via: `brandColors.borders.focus`
  
- **Success**: `#4caf50` (Green)
  - Used for: Success state borders
  - Access via: `brandColors.borders.success`
  
- **Warning**: `#ff9800` (Orange)
  - Used for: Warning state borders
  - Access via: `brandColors.borders.warning`
  
- **Error**: `#f44336` (Red)
  - Used for: Error state borders
  - Access via: `brandColors.borders.error`

### Text Colors
- **Primary**: `#333333` (Dark Gray)
  - Used for: Main text, headings, body content
  - Access via: `brandColors.text.primary`
  
- **Secondary**: `#666666` (Medium Gray)
  - Used for: Secondary text, captions, labels
  - Access via: `brandColors.text.secondary`
  
- **Disabled**: `#9e9e9e` (Light Gray)
  - Used for: Disabled text, placeholder text
  - Access via: `brandColors.text.disabled`

## Usage Guidelines

### Import Statement
```typescript
import { brandColors } from "../theme";
```

### Examples

#### Buttons
```typescript
// Primary button
<Button 
  variant="contained" 
  sx={{ backgroundColor: brandColors.primary }}
>
  Primary Action
</Button>

// Success button
<Button 
  variant="contained" 
  sx={{ backgroundColor: brandColors.accent.success }}
>
  Success Action
</Button>

// Warning button
<Button 
  variant="outlined" 
  sx={{ 
    borderColor: brandColors.accent.warning,
    color: brandColors.accent.warning 
  }}
>
  Warning Action
</Button>
```

#### Cards and Containers
```typescript
<Card sx={{ 
  backgroundColor: brandColors.backgrounds.primary,
  border: `1px solid ${brandColors.borders.secondary}`,
  '&:hover': {
    backgroundColor: brandColors.backgrounds.hover
  }
}}>
  <CardContent>
    <Typography sx={{ color: brandColors.text.primary }}>
      Content here
    </Typography>
  </CardContent>
</Card>
```

#### Status Indicators
```typescript
<Chip 
  label="Complete" 
  sx={{ 
    backgroundColor: brandColors.status.completed,
    color: 'white'
  }} 
/>

<Chip 
  label="Pending" 
  sx={{ 
    backgroundColor: brandColors.status.pending,
    color: 'white'
  }} 
/>
```

#### Typography
```typescript
<Typography 
  variant="h1" 
  sx={{ color: brandColors.primary }}
>
  Main Heading
</Typography>

<Typography 
  variant="body2" 
  sx={{ color: brandColors.text.secondary }}
>
  Secondary text content
</Typography>
```

## Color Usage Patterns

### Primary Actions
- Use **Blue** (`#1976d2`) for primary actions, main CTAs
- Use **Primary Brand Color** (`#1a365d`) for headers and navigation

### Headers & Navigation
- Use **Blue gradients** (primary to secondary) for prominent sections
- Use **Primary Brand Color** for main navigation elements

### Active States
- Use **Blue accents** for active states, current selections
- Use **Primary Brand Color** for focused elements

### Success Indicators
- Use **Green** for success states, completed tasks
- Use **Light Green backgrounds** for success notifications

### Status Indicators
- **Blue**: Completed states, active elements
- **Green**: Success states, positive outcomes
- **Orange**: Pending states, warnings, attention needed

### Backgrounds
- Use **Light blue tints** for selected/hover states
- Use **White** for primary content areas
- Use **Light gray** for secondary sections

## Implementation Notes

### Theme Integration
The color scheme is implemented through Material-UI's theme system in `src/theme/theme.ts`. This ensures:
- Consistent color application across all components
- Easy color scheme updates in one location
- Proper TypeScript support and autocomplete

### Accessibility
- All color combinations meet WCAG contrast requirements
- Color is never the only indicator of information
- Text remains readable on all background colors

### Responsive Design
- Colors work consistently across all device sizes
- Hover states are optimized for both desktop and mobile
- Focus states are clearly visible for keyboard navigation

## Maintenance

### Adding New Colors
1. Add the color to the `brandColors` object in `src/theme/theme.ts`
2. Update the Material-UI theme configuration if needed
3. Document the new color in this file
4. Update any related components

### Updating Colors
1. Modify the color value in `src/theme/theme.ts`
2. Test the change across all affected components
3. Update this documentation if the color's purpose changes

### Color Audits
- Regularly review color usage across the application
- Ensure consistency in similar UI elements
- Validate accessibility compliance
- Check for any hardcoded colors that bypass the theme system

## Best Practices

1. **Never use hardcoded colors** - Always import from the theme
2. **Use semantic color names** - Choose colors based on their purpose, not appearance
3. **Maintain consistency** - Use the same color for the same purpose across components
4. **Test accessibility** - Ensure sufficient contrast ratios
5. **Document changes** - Update this file when modifying the color scheme

## Troubleshooting

### Common Issues
- **Colors not updating**: Ensure the component imports `brandColors` from the theme
- **TypeScript errors**: Check that the color property exists in the theme definition
- **Inconsistent appearance**: Verify that all instances use the theme colors, not hardcoded values

### Debugging
- Use browser dev tools to inspect element colors
- Check the theme object in React DevTools
- Verify import statements in component files
- Look for any remaining hardcoded color values

---

*This color scheme ensures a consistent, professional appearance across the entire Dreamery Homepage application while maintaining accessibility and usability standards.*
