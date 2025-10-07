# Visual Regression Testing Guide

## Overview

Visual regression testing helps detect unintended visual changes in your UI by comparing screenshots of components across different states, viewports, and themes.

## Current Implementation

The project currently uses **Jest Snapshots** for visual regression testing. Snapshots are stored in `__snapshots__` directories alongside test files.

### Running Visual Tests

```bash
# Run all visual regression tests
npm test -- --testPathPattern=VisualRegression

# Update snapshots after intentional UI changes
npm test -- --testPathPattern=VisualRegression --updateSnapshot

# Run tests in watch mode
npm test -- --testPathPattern=VisualRegression --watch
```

## Test Coverage

### ✅ Major Sections
- Card components
- Form sections
- Results sections
- Navigation headers

### ✅ Responsive Layouts
- Mobile viewport (375px)
- Tablet viewport (768px)
- Desktop viewport (1920px)
- Responsive card grids

### ✅ Accordion States
- Collapsed accordions
- Expanded accordions
- Mixed state accordions

### ✅ Error States
- Form field errors
- Error alerts
- Warning alerts
- Info alerts
- Success alerts
- Disabled button states

### ✅ Validation Messages
- Inline validation (success/error)
- Multiple field validation
- Validation summary cards
- Contextual help messages

### ✅ Additional Coverage
- Button variants (contained, outlined, text)
- Button sizes (small, medium, large)
- Loading states
- Dark mode / theme variants

---

## Upgrading to Percy (Recommended for Production)

[Percy](https://percy.io/) provides automated visual testing with:
- Cross-browser testing
- Responsive testing
- Visual diffs
- GitHub integration
- Team collaboration

### Setup Percy

1. **Install Percy**:
```bash
npm install --save-dev @percy/cli @percy/puppeteer
```

2. **Set Environment Variable**:
```bash
export PERCY_TOKEN=your_percy_token_here
```

3. **Create Percy Configuration** (`percy.yml`):
```yaml
version: 2
static:
  include: '*.html'
  
snapshot:
  widths:
    - 375   # Mobile
    - 768   # Tablet
    - 1280  # Desktop
    - 1920  # Large Desktop
  
  min-height: 1024
  
  percy-css: |
    * {
      animation: none !important;
      transition: none !important;
    }
```

4. **Create Percy Test Script** (`src/__tests__/percy/percy.test.ts`):
```typescript
import { percySnapshot } from '@percy/puppeteer';
import puppeteer from 'puppeteer';

describe('Percy Visual Tests', () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should capture UnderwritePage', async () => {
    await page.goto('http://localhost:3000/underwrite');
    await percySnapshot(page, 'UnderwritePage');
  });

  it('should capture AnalyzePage', async () => {
    await page.goto('http://localhost:3000/analyze');
    await percySnapshot(page, 'AnalyzePage');
  });
});
```

5. **Run Percy Tests**:
```bash
# Start dev server
npm start

# In another terminal, run Percy
npx percy exec -- npm test -- percy.test.ts
```

6. **Add to CI/CD** (GitHub Actions):
```yaml
name: Visual Regression Tests

on: [pull_request]

jobs:
  percy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm start &
      - run: npx percy exec -- npm test -- percy.test.ts
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

### Percy Configuration Options

```javascript
// .percy.js
module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 768, 1280, 1920],
    minHeight: 1024,
    percyCSS: `
      * {
        animation: none !important;
        transition: none !important;
      }
    `,
    enableJavaScript: true,
  },
};
```

---

## Upgrading to Chromatic (For Storybook Projects)

[Chromatic](https://www.chromatic.com/) is ideal if you're using Storybook for component development.

### Setup Chromatic

1. **Install Chromatic**:
```bash
npm install --save-dev chromatic
```

2. **Set Environment Variable**:
```bash
export CHROMATIC_PROJECT_TOKEN=your_chromatic_token_here
```

3. **Create Storybook Stories** (if not already):
```typescript
// src/stories/UnderwritePage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import UnderwritePage from '../pages/UnderwritePage';

const meta: Meta<typeof UnderwritePage> = {
  title: 'Pages/UnderwritePage',
  component: UnderwritePage,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [375, 768, 1280, 1920],
    },
  },
};

export default meta;
type Story = StoryObj<typeof UnderwritePage>;

export const Default: Story = {};

export const WithData: Story = {
  // Pre-fill with test data
};

export const ErrorState: Story = {
  // Show error states
};
```

4. **Run Chromatic**:
```bash
npx chromatic --project-token=<your-token>
```

5. **Add to CI/CD** (GitHub Actions):
```yaml
name: Chromatic Visual Tests

on: push

jobs:
  chromatic-deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

---

## Best Practices

### 1. **Stabilize Animations**
Disable animations in snapshots to prevent flakiness:
```css
* {
  animation: none !important;
  transition: none !important;
}
```

### 2. **Mock Dynamic Data**
Use fixed data for consistent snapshots:
```typescript
beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(1234567890000);
  Math.random = jest.fn(() => 0.5);
});
```

### 3. **Test Key States**
Focus on important visual states:
- Default/empty state
- Filled with data
- Loading state
- Error state
- Success state
- Edge cases (very long text, many items, etc.)

### 4. **Organize Tests by Component**
Group related visual tests:
```typescript
describe('PropertyCard', () => {
  describe('Visual States', () => {
    it('default state');
    it('with long address');
    it('with error');
  });
});
```

### 5. **Use Descriptive Snapshot Names**
```typescript
percySnapshot(page, 'UnderwritePage - Buy & Hold - Mobile');
percySnapshot(page, 'UnderwritePage - Fix & Flip - Desktop');
```

### 6. **Review Changes Carefully**
When snapshots change:
1. Review the visual diff
2. Verify the change is intentional
3. Document why the change was made
4. Update snapshots with `--updateSnapshot`

### 7. **Test Responsive Breakpoints**
Test at common device widths:
- 375px (iPhone SE)
- 768px (iPad portrait)
- 1280px (Laptop)
- 1920px (Desktop)

---

## Snapshot Management

### Updating Snapshots

```bash
# Update all snapshots
npm test -- --updateSnapshot

# Update specific test file snapshots
npm test -- VisualRegression.test --updateSnapshot

# Interactive update mode
npm test -- --watch
# Press 'u' to update failing snapshots
```

### Reviewing Snapshot Changes

When you see snapshot failures:

1. **Check the diff** in terminal output
2. **Run tests locally** to see the actual vs expected
3. **Use Percy/Chromatic** for visual diffs (if integrated)
4. **Verify the change is intentional**
5. **Update if correct**, otherwise fix the bug

### Snapshot Storage

- **Location**: `src/__tests__/visual/__snapshots__/`
- **Commit**: Yes, commit snapshots to Git
- **Size**: Monitor snapshot file sizes
- **Cleanup**: Remove obsolete snapshots periodically

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on:
  pull_request:
    branches: [main, develop]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run visual regression tests
        run: npm test -- --testPathPattern=VisualRegression --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Troubleshooting

### Flaky Tests

**Problem**: Snapshots change randomly
**Solutions**:
- Disable animations and transitions
- Mock Date.now() and Math.random()
- Wait for fonts to load
- Use `waitFor` for async content
- Increase timeouts for slow operations

### Large Snapshot Files

**Problem**: Snapshot files are too large
**Solutions**:
- Use Percy/Chromatic instead of Jest snapshots
- Snapshot smaller components instead of full pages
- Use visual regression tools that store images externally
- Configure snapshot serializers to exclude non-essential data

### Snapshot Mismatches in CI

**Problem**: Tests pass locally but fail in CI
**Solutions**:
- Use Docker for consistent environments
- Install same fonts in CI as local
- Mock window dimensions
- Use headless browser in both environments
- Check for platform-specific rendering differences

---

## Resources

- [Percy Documentation](https://docs.percy.io/)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Jest Snapshot Testing](https://jestjs.io/docs/snapshot-testing)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Visual Regression Testing Best Practices](https://percy.io/blog/visual-regression-testing-best-practices)

---

## Summary

**Current Status**:
- ✅ Jest snapshots implemented
- ✅ 30+ visual test scenarios
- ✅ Responsive testing
- ✅ Error state testing
- ✅ Theme variant testing

**Next Steps**:
1. Integrate Percy or Chromatic for production use
2. Add visual tests to CI/CD pipeline
3. Create Storybook stories for component library
4. Set up automated visual review process
5. Train team on visual regression testing workflow

