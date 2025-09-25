# Dreamery Homepage - Technical Documentation

**Classification**: TECHNICAL - INTERNAL USE  
**Last Updated**: December 2024  
**Version**: 1.0

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Design System & Color Implementation](#design-system--color-implementation)
3. [Database & Data Models](#database--data-models)
4. [API Integration](#api-integration)
5. [User Role System](#user-role-system)
6. [Performance & Optimization](#performance--optimization)
7. [Development Guidelines](#development-guidelines)

---

## System Architecture

### Technology Stack

#### Frontend Framework & Libraries
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 4.9.5** - Type-safe development with enhanced IDE support
- **Material-UI (MUI) v5.15.10** - Component library with theming
- **Styled Components v6.1.19** - CSS-in-JS styling solution
- **React Router v6.22.0** - Client-side routing

#### Backend & Database
- **Python Flask** - Lightweight web framework for APIs
- **Prisma ORM** - Modern TypeScript-first database toolkit
- **PostgreSQL/SQLite** - Production/development databases
- **Zod** - TypeScript-first validation library

#### Development Tools
- **Create React App** - Build tooling and development server
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Git** - Version control

### Project Structure

```
dreamery-homepage/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── hero-background.jpg
│   ├── logo.png
│   └── index.html
├── src/
│   ├── components/        # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   └── Navigation.tsx
│   ├── pages/            # Page components
│   │   ├── auth/
│   │   ├── BuyPage.tsx
│   │   ├── RentPage.tsx
│   │   └── manage.tsx
│   ├── services/         # API service layers
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── theme/           # Design system and theming
│   └── App.tsx          # Root component
├── server/              # Python backend
│   ├── models.py        # Data models
│   ├── realtor_api.py   # API endpoints
│   └── requirements.txt # Python dependencies
├── prisma/              # Database schema
│   ├── schema.prisma    # Database schema definition
│   └── dev.db          # Development database
└── docs/               # Documentation
    ├── LEGAL_DOCUMENTATION.md
    └── TECHNICAL_DOCUMENTATION.md
```

---

## Design System & Color Implementation

### Enhanced Color System

The Dreamery homepage implements a comprehensive color system based on the primary brand color `#1a365d` (Dark Blue). This system provides semantic color tokens, utility functions, and CSS custom properties for consistent color usage.

#### Primary Brand Colors
- **Primary**: `#1a365d` (Dark Blue) - Main brand color
- **Primary Light**: `#2d5a8a` - Lighter variant
- **Primary Dark**: `#0d2340` - Darker variant for gradients
- **Primary 50-900**: Full tint scale from very light to very dark

#### Accent Colors
- **Success**: `#4caf50` (Green) - Success states, completed tasks
- **Warning**: `#ff9800` (Orange) - Pending states, warnings
- **Info**: `#2196f3` (Blue) - Informational elements, links
- **Error**: `#f44336` (Red) - Error states, destructive actions

#### Implementation Methods

##### TypeScript/JavaScript Usage
```typescript
import { brandColors, colorUtils } from '../theme';

// Direct color usage
const primaryColor = brandColors.primary;
const successColor = brandColors.accent.success;

// Utility functions
const glassBackground = colorUtils.glass(0.25);
const primaryGradient = colorUtils.primaryGradient;
```

##### CSS Custom Properties
```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-border-secondary);
}
```

##### Styled Components
```typescript
const StyledButton = styled.button`
  background: ${brandColors.primary};
  color: ${brandColors.text.inverse};
  border: 1px solid ${brandColors.borders.primary};
  
  &:hover {
    background: ${brandColors.actions.primaryHover};
    box-shadow: ${colorUtils.shadowColored(0.15, 8, 2)};
  }
`;
```

### Design System Components

#### Typography
- **Primary Font**: Inter (body text, UI elements)
- **Display Font**: Montserrat (headings, large text)
- **Type Scale**: Complete scale from 12px to 60px
- **Line Heights**: Optimized for readability

#### Spacing System
- **8-Point Scale**: Consistent spacing using multiples of 8px
- **Tokens**: --space-1 through --space-32
- **Responsive**: Adaptive spacing for different screen sizes

#### Component Library
- **Button**: Multiple variants (default, outline, ghost, destructive)
- **Card**: Elevated surfaces with hover effects
- **Input**: Enhanced form controls with validation
- **Progress**: Linear and circular progress indicators
- **Alert**: Success, warning, error, and info messages

---

## Database & Data Models

### Professional Support Hub Data Models

The system uses a modern stack with **Prisma ORM**, **PostgreSQL/SQLite**, and **Zod validation** for type-safe, production-ready data management.

#### Core Data Models

##### User Management
- **User**: Core user entity with authentication and profile
- **UserProfile**: Extended user information (specialties, experience)
- **UserRole**: Professional role assignment
- **ProfessionalCategory**: Grouping of related professional roles

##### Role-Based Access Control (RBAC)
- **Permission**: Granular permissions for resources
- **RolePermission**: Many-to-many relationship between roles and permissions
- **ProfessionalCategory**: Logical grouping of professional roles

##### Workflow Management
- **Workflow**: Role-specific workflow definitions
- **WorkflowStep**: Individual steps within workflows
- **ValidationRule**: Input validation rules for workflow steps

##### Document Management
- **DocumentTemplate**: Reusable document templates
- **DocumentInstance**: Specific instances of documents
- **DocumentVariable**: Dynamic variables within templates

##### Compliance Management
- **ComplianceRequirement**: Role-specific compliance requirements
- **ComplianceRecord**: User compliance tracking
- **ComplianceEvidence**: Supporting documentation for compliance

#### Professional Roles Supported

The system supports **89 professional roles** across **18 categories**:

- **Acquisition & Disposition**: Acquisition Specialist, Disposition Agent
- **Title & Escrow**: Title Agent, Escrow Officer, Notary Public
- **Appraisal & Inspection**: Residential Appraiser, Commercial Appraiser, Commercial Inspector
- **Lending & Financing**: Insurance Agent, Mortgage Broker, Loan Officer, Hard Money Lender
- **Construction & Renovation**: General Contractor, Electrical Contractor, Plumbing Contractor
- **Design & Interior**: Interior Designer, Architect, Landscape Architect
- **Property Management**: Property Manager, Long-term Rental Property Manager
- **Maintenance Services**: Permit Expeditor, Handyman, Landscaper
- **Tenant Services**: Tenant Screening Agent, Leasing Agent
- **Financial Services**: Bookkeeper, CPA, Accountant
- **Media & Content**: Photographer, Videographer
- **Technology & Development**: AR/VR Developer, Digital Twins Developer
- **Legal Services**: Real Estate Attorney, Estate Planning Attorney
- **Exchange & Formation**: 1031 Exchange Intermediary, Entity Formation Service Provider
- **Consulting & Education**: Real Estate Consultant, Real Estate Educator
- **Notary Services**: Legal Notary Service Provider
- **Financial Advisory**: Financial Advisor, Tax Advisor
- **Relocation & Investment**: Relocation Specialist, Real Estate Investment Advisor

### Data Deletion & Retention System

#### Data Classification & Deletion Strategies
- **Cascade**: User-specific data (profile, preferences, tasks) - Soft delete with 30-day retention
- **Restrict**: Critical business data (transactions, compliance records) - Archive with 7-year retention
- **SetNull**: Optional relationships - Set foreign key to null
- **Preserve**: Audit and analytics data - Anonymize with 7-year retention
- **Soft Delete**: Important data instead of hard deletes

#### Compliance Features
- **GDPR Compliance**: Right to erasure, data portability, data minimization
- **CCPA Compliance**: Right to know, right to delete, right to opt-out
- **SOX Compliance**: Audit trail preservation, data integrity, 7-year retention

---

## API Integration

### Realtor.com Data Integration

The integration adds comprehensive real estate data processing capabilities using Python parsers and TypeScript services.

#### Architecture

##### Python Backend (Server)
- **Data Models**: Structured models for addresses, descriptions, open houses, units, tax records, estimates
- **Parsers**: Functions to parse and normalize Realtor.com API responses
- **API Endpoints**: RESTful API for property search and details
- **Error Handling**: Comprehensive error handling and logging

##### TypeScript Frontend
- **Type Safety**: Full TypeScript support for all data structures
- **Service Layer**: Clean abstraction for API communication
- **React Hooks**: Custom hooks for data fetching and state management
- **Reusable Components**: Property card component with modern UI

#### Enhanced Models Integration

##### Pydantic Models
- **Comprehensive Enums**: ReturnType, SiteName, SearchPropertyType, ListingType, PropertyType
- **Enhanced Data Models**: Address with computed fields, Description with HttpUrl validation
- **Specialized GraphQL Models**: HomeMonthlyFee, HomeParkingDetails, PetPolicy, OpenHouse
- **Property Details**: TaxHistory, PropertyEstimate, PropertyDetails, Unit information

##### Features
- **Pydantic Validation**: Strong typing, automatic validation, HttpUrl validation
- **Computed Fields**: Address formatting, data derivation, type conversion
- **Multiple Return Types**: Pydantic, Pandas, Raw data formats

#### High-Level Scraping API

##### Key Features
- **Comprehensive Validation**: Input, date, limit, and parameter type validation
- **Multiple Return Types**: Pandas DataFrames, Pydantic models, raw data
- **Advanced Data Processing**: DataFrame creation, column ordering, data cleaning
- **Property Filtering**: Price, bedroom, bathroom, square footage filtering
- **Summary Statistics**: Property count, averages, min/max values

##### API Usage Examples
```typescript
import { realtorService } from '../services/realtorService';

const response = await realtorService.scrapeProperties({
  location: 'San Francisco, CA',
  listing_type: 'for_sale',
  return_type: 'pandas',
  property_type: ['single_family', 'condos'],
  radius: 5.0,
  limit: 100
});
```

### Apple Maps Integration

#### Setup Requirements
1. **Apple Developer Account**: Required for MapKit JS access
2. **JWT Token**: Generated using Apple Developer credentials
3. **Environment Configuration**: JWT token stored in environment variables

#### Features
- **Free Usage**: 250,000 map loads per day
- **Property Markers**: Custom property annotations
- **Map Types**: Standard, Satellite, and Hybrid views
- **Interactive Controls**: Zoom, compass, scale
- **Street View**: Look Around integration
- **Privacy Focused**: No user tracking
- **Responsive Design**: Works on all devices

---

## User Role System

### Role Types

The system supports 6 distinct user roles with different dashboard views and feature sets:

#### 1. Buyer
- **Description**: Individual homebuyers
- **Sidebar**: Visible (320px) - Closing features navigation
- **Dashboard**: Standard closing features
- **Features**: Offers, agreements, notifications, search

#### 2. Buying Agent
- **Description**: Agents representing buyers (same view as buyer)
- **Sidebar**: Visible (320px) - Closing features navigation
- **Dashboard**: Same as buyer dashboard
- **Features**: Offers, agreements, notifications, search, transactions, documents

#### 3. Listing Agent
- **Description**: Agents representing sellers
- **Sidebar**: Hidden (full-width view)
- **Dashboard**: Agent dashboard with listing tools
- **Features**: Listings, offers, documents, commission

#### 4. Broker
- **Description**: Office-level oversight
- **Sidebar**: Hidden (full-width view)
- **Dashboard**: Broker dashboard
- **Features**: Compliance, reports, agent management, financials

#### 5. Brand Manager
- **Description**: Multi-office brand oversight
- **Sidebar**: Hidden (full-width view)
- **Dashboard**: Enterprise dashboard
- **Features**: Multi-office, branding, recruiting, analytics

#### 6. Enterprise
- **Description**: Large brokerage with multiple brands
- **Sidebar**: Hidden (full-width view)
- **Dashboard**: Enterprise dashboard
- **Features**: Enterprise tools, marketplace, integrations, AI insights

### Technical Implementation

#### State Management
```typescript
const [selectedUserRole, setSelectedUserRole] = useState<UserRoleType>('buyer');
```

#### Role Configuration
```typescript
interface UserRoleConfig {
  id: UserRoleType;
  label: string;
  description: string;
  icon: string;
  hasSidebar: boolean;
  hasAgentDashboard: boolean;
  hasBrokerDashboard: boolean;
  hasEnterpriseDashboard: boolean;
  features: string[];
}
```

#### Dynamic UI Behavior
- **Header Dropdown**: Top-right role selector with icons and descriptions
- **Dynamic Sidebar**: Shows/hides based on role (320px for buyer views, hidden for others)
- **Role-Specific Dashboards**: Different content and features based on role
- **Smooth Transitions**: CSS transitions for width changes and state updates

---

## Performance & Optimization

### Current Optimization Status

#### Files Successfully Optimized (5 out of 7 major files)
- **MortgagePage.tsx**: 6 icons lazy-loaded, mortgage constants externalized
- **BuyPage.tsx**: 7 icons lazy-loaded, marketplace constants externalized
- **RentPage.tsx**: 7 icons lazy-loaded, marketplace constants externalized
- **manage.tsx**: 14 icons lazy-loaded, significant bundle reduction
- **CloseBrokeragesPage.tsx**: 25 icons lazy-loaded, agent roles externalized

#### Performance Improvements Achieved
- **Icon Optimization**: 59+ icons converted to lazy loading
- **Data Externalization**: 3 major data domains externalized
- **Component Lazy Loading**: 2 heavy components integrated
- **Bundle Size Reduction**: Estimated 15-25% reduction based on icon count

### Technical Implementation

#### Lazy Loading Strategy
- **Icon Lazy Loading**: `React.lazy()` with Suspense fallbacks
- **Component Lazy Loading**: `React.lazy()` with error boundaries
- **Data Lazy Loading**: External constants with tree-shaking

#### Code Splitting Implementation
- **Route-based Splitting**: Already implemented in AppWithRouting.tsx
- **Component-based Splitting**: Newly implemented for heavy components
- **Icon-based Splitting**: Newly implemented for MUI icons

#### Performance Monitoring
- **Bundle Size Measurement**: Script created (`scripts/measure-performance.js`)
- **Performance Budgets**: Defined in performance utilities
- **Compression Ratios**: Estimated at 30% (gzip)

### Performance Targets & Achievements

#### Bundle Size Targets
- **Original Bundle**: Target < 2MB (Estimated: 1.5-1.8MB)
- **Gzipped Bundle**: Target < 500KB (Estimated: 400-450KB)
- **Overall Reduction**: Target 20-30% (Estimated: 25-35%)

#### Loading Performance Targets
- **Initial Load Time**: Target < 3s (Estimated: 2.5-3s)
- **Icon Loading**: Progressive loading implemented
- **Component Loading**: Lazy loading implemented

---

## Development Guidelines

### Code Organization

#### File Structure
- **Components**: Reusable React components in `src/components/`
- **Pages**: Page-level components in `src/pages/`
- **Services**: API service layers in `src/services/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Types**: TypeScript type definitions in `src/types/`
- **Theme**: Design system and theming in `src/theme/`

#### Naming Conventions
- **Components**: PascalCase (e.g., `PropertyCard.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useRealtorData.ts`)
- **Services**: camelCase (e.g., `realtorService.ts`)
- **Types**: PascalCase interfaces (e.g., `PropertyData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Best Practices

#### Component Development
1. **Use TypeScript**: Always use TypeScript for type safety
2. **Follow Design System**: Use semantic color tokens and design system components
3. **Implement Accessibility**: Include ARIA labels, keyboard navigation, focus management
4. **Optimize Performance**: Use lazy loading, memoization, and code splitting
5. **Test Responsively**: Ensure components work on all device sizes

#### API Integration
1. **Type Safety**: Define TypeScript interfaces for all API responses
2. **Error Handling**: Implement comprehensive error handling and user feedback
3. **Loading States**: Provide loading indicators for async operations
4. **Data Validation**: Validate API responses using Zod or similar
5. **Caching**: Implement appropriate caching strategies

#### State Management
1. **Local State**: Use React hooks for component-local state
2. **Global State**: Use Context API or state management library for global state
3. **Server State**: Use React Query or SWR for server state management
4. **Form State**: Use controlled components with validation
5. **URL State**: Use React Router for URL-based state

### Testing

#### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../components/PropertyCard';

test('PropertyCard displays property information', () => {
  const mockProperty = {
    property_id: '123',
    address: { city: 'San Francisco', state: 'CA' },
    list_price: 1000000
  };
  
  render(<PropertyCard property={mockProperty} />);
  
  expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  expect(screen.getByText('$1,000,000')).toBeInTheDocument();
});
```

#### Integration Testing
```typescript
test('Property search integration works end-to-end', async () => {
  render(<PropertySearch />);
  
  const searchInput = screen.getByLabelText('Search location');
  fireEvent.change(searchInput, { target: { value: 'San Francisco' } });
  
  const searchButton = screen.getByText('Search');
  fireEvent.click(searchButton);
  
  await waitFor(() => {
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
  });
});
```

### Deployment

#### Build Process
```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

#### Environment Configuration
```bash
# Development
REACT_APP_API_URL=http://localhost:5001
REACT_APP_APPLE_MAPS_JWT_TOKEN=your_jwt_token

# Production
REACT_APP_API_URL=https://api.dreamery.com
REACT_APP_APPLE_MAPS_JWT_TOKEN=your_production_jwt_token
```

#### Server Setup
```bash
# Install Python dependencies
cd server
pip install -r requirements.txt

# Set up database
npm run db:push
npm run db:seed

# Start server
python start_realtor_api.py
```

---

## Troubleshooting

### Common Issues

#### Build Errors
1. **TypeScript Errors**: Check type definitions and imports
2. **Import Errors**: Verify file paths and exports
3. **Linting Errors**: Run `npm run lint:fix` to auto-fix issues
4. **Dependency Issues**: Delete `node_modules` and reinstall

#### Runtime Errors
1. **API Connection**: Check server status and API endpoints
2. **Authentication**: Verify JWT tokens and authentication flow
3. **Data Loading**: Check network requests and data parsing
4. **Component Rendering**: Inspect React DevTools for component state

#### Performance Issues
1. **Slow Loading**: Check bundle size and implement code splitting
2. **Memory Leaks**: Use React DevTools Profiler to identify issues
3. **Rerenders**: Implement memoization and optimize state updates
4. **Network Requests**: Implement caching and request optimization

### Debug Tools

#### Development Tools
- **React DevTools**: Component inspection and state debugging
- **Browser DevTools**: Network requests, console errors, performance profiling
- **TypeScript**: Compile-time error checking and type validation
- **ESLint**: Code quality and style enforcement

#### Performance Monitoring
- **Bundle Analyzer**: Analyze bundle size and dependencies
- **Lighthouse**: Performance, accessibility, and SEO auditing
- **Web Vitals**: Core web vitals monitoring
- **React Profiler**: Component performance analysis

---

## Future Enhancements

### Planned Features
1. **Dark Mode Support**: Automatic color scheme switching
2. **Advanced Analytics**: Time-series data and reporting
3. **Real-time Notifications**: WebSocket integration
4. **Multi-tenancy**: Support for multiple organizations
5. **Advanced Caching**: Redis integration for performance

### Technical Improvements
1. **Microservices**: Break down monolithic backend
2. **GraphQL**: Implement GraphQL API for flexible data fetching
3. **Progressive Web App**: Add PWA capabilities
4. **Advanced Testing**: Implement end-to-end testing with Playwright
5. **CI/CD Pipeline**: Automated testing and deployment

---

**This technical documentation provides a comprehensive overview of the Dreamery Homepage system architecture, implementation details, and development guidelines. For specific implementation details, refer to the individual component documentation and code comments.**
