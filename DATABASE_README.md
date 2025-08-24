# Dreamery Professional Support - Database & Data Models

## 🗄️ Overview

This document describes the comprehensive data models and interfaces implemented for the Dreamery Professional Support Hub. The system uses a modern stack with **Prisma ORM**, **PostgreSQL/SQLite**, and **Zod validation** for type-safe, production-ready data management.

## 🏗️ Architecture

### Technology Stack
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: Prisma (modern, TypeScript-first)
- **Validation**: Zod (TypeScript-first validation)
- **Language**: TypeScript with full type safety

### Core Components
1. **TypeScript Interfaces** (`src/types/database.ts`)
2. **Zod Validation Schemas** (`src/schemas/validation.ts`)
3. **Prisma Database Schema** (`prisma/schema.prisma`)
4. **Database Service Layer** (`src/services/DatabaseService.ts`)
5. **Database Seeder** (`src/scripts/seedDatabase.ts`)

## 📊 Data Models

### 1. User Management
- **User**: Core user entity with authentication and profile
- **UserProfile**: Extended user information (specialties, experience, etc.)
- **UserRole**: Professional role assignment
- **ProfessionalCategory**: Grouping of related professional roles

### 2. Role-Based Access Control (RBAC)
- **Permission**: Granular permissions for resources
- **RolePermission**: Many-to-many relationship between roles and permissions
- **ProfessionalCategory**: Logical grouping of professional roles

### 3. Workflow Management
- **Workflow**: Role-specific workflow definitions
- **WorkflowStep**: Individual steps within workflows
- **ValidationRule**: Input validation rules for workflow steps

### 4. Document Management
- **DocumentTemplate**: Reusable document templates
- **DocumentInstance**: Specific instances of documents
- **DocumentVariable**: Dynamic variables within templates

### 5. Compliance Management
- **ComplianceRequirement**: Role-specific compliance requirements
- **ComplianceRecord**: User compliance tracking
- **ComplianceEvidence**: Supporting documentation for compliance

### 6. Analytics & Metrics
- **AnalyticsMetric**: Performance and productivity metrics
- **AnalyticsDashboard**: Role-specific dashboard configurations
- **DashboardWidget**: Individual dashboard components

### 7. Task & Reminder Management
- **Task**: User tasks and assignments
- **Reminder**: Scheduled reminders for tasks

### 8. Notification System
- **Notification**: User notifications and alerts

### 9. Audit & Logging
- **AuditLog**: Comprehensive audit trail for all operations

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
npm install prisma @prisma/client zod @types/node
npm install -D prisma @types/node
```

### 2. Environment Configuration
Copy `env.example` to `.env` and configure your database:

```bash
# For development (SQLite)
DATABASE_URL="file:./dev.db"

# For production (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/dreamery_professional_support"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 📝 Usage Examples

### 1. Using the Database Service

```typescript
import { databaseService } from '../services/DatabaseService';

// Create a new user
const newUser = await databaseService.createUser({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roleId: 'acquisition-specialist',
  isActive: true,
});

// Find users by role
const acquisitionSpecialists = await databaseService.findUsers({
  roleId: 'acquisition-specialist',
});

// Search users
const searchResults = await databaseService.searchUsers('John', 'acquisition-specialist');
```

### 2. Using Zod Validation

```typescript
import { schemas } from '../schemas/validation';

// Validate user input
const userData = {
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  roleId: 'real-estate-attorney',
  isActive: true,
};

try {
  const validatedUser = schemas.createUser.parse(userData);
  // Data is valid, proceed with creation
} catch (error) {
  // Handle validation errors
  console.error('Validation failed:', error.errors);
}
```

### 3. Working with Workflows

```typescript
// Create a new workflow
const workflow = await databaseService.createWorkflow({
  name: 'Property Inspection Workflow',
  description: 'Standard workflow for property inspections',
  roleId: 'commercial-inspector',
  isActive: true,
});

// Find workflows by role
const inspectorWorkflows = await databaseService.findWorkflowsByRole('commercial-inspector');
```

## 🎯 Professional Roles Supported

The system supports **89 professional roles** across **18 categories**:

### Acquisition & Disposition
- Acquisition Specialist
- Disposition Agent

### Title & Escrow
- Title Agent
- Escrow Officer
- Notary Public

### Appraisal & Inspection
- Residential Appraiser
- Commercial Appraiser
- Commercial Inspector
- Energy Inspector
- Land Surveyor

### Lending & Financing
- Insurance Agent
- Title Insurance Agent
- Mortgage Broker
- Mortgage Lender
- Loan Officer
- Mortgage Underwriter
- Hard Money Lender
- Private Lender
- Limited Partner (LP)
- Creative Financing Specialists (5 roles)

### Construction & Renovation
- General Contractor
- Electrical Contractor
- Plumbing Contractor
- HVAC Contractor
- Roofing Contractor
- Painting Contractor
- Landscaping Contractor
- Flooring Contractor
- Kitchen Contractor
- Bathroom Contractor

### Design & Interior
- Interior Designer
- Architect
- Landscape Architect
- Kitchen Designer
- Bathroom Designer
- Lighting Designer
- Furniture Designer
- Color Consultant

### Property Management
- Property Manager
- Long-term Rental Property Manager
- Short-term Rental Property Manager

### Maintenance Services
- Permit Expeditor
- STR Setup & Manager
- Housekeeper
- Landscape Cleaner
- Turnover Specialist
- Handyman
- Landscaper
- Arborist

### Tenant Services
- Tenant Screening Agent
- Leasing Agent

### Financial Services
- Bookkeeper
- CPA
- Accountant

### Media & Content
- Photographer
- Videographer

### Technology & Development
- AR/VR Developer
- Digital Twins Developer

### Legal Services
- Real Estate Attorney
- Estate Planning Attorney

### Exchange & Formation
- 1031 Exchange Intermediary
- Entity Formation Service Provider
- Escrow Service Provider

### Consulting & Education
- Real Estate Consultant
- Real Estate Educator

### Notary Services
- Legal Notary Service Provider

### Financial Advisory
- Financial Advisor
- Tax Advisor

### Relocation & Investment
- Relocation Specialist
- Real Estate Investment Advisor

## 🔒 Security & Validation

### Input Validation
- All user inputs are validated using Zod schemas
- Type-safe validation with detailed error messages
- Automatic sanitization and validation

### Role-Based Access Control
- Granular permissions for each professional role
- Resource-level access control
- Audit logging for all operations

### Data Integrity
- Foreign key constraints
- Cascade deletion where appropriate
- Soft delete support for critical data

## 📈 Performance & Scalability

### Database Optimization
- Proper indexing on frequently queried fields
- Efficient relationship loading with Prisma includes
- Pagination support for large datasets

### Caching Strategy
- Prisma query result caching
- Redis integration ready for future implementation
- Optimistic updates for better UX

## 🚀 Future Enhancements

### Planned Features
1. **Real-time Notifications**: WebSocket integration
2. **File Management**: S3 integration for document storage
3. **Advanced Analytics**: Time-series data and reporting
4. **API Rate Limiting**: Request throttling and monitoring
5. **Multi-tenancy**: Support for multiple organizations

### Integration Points
1. **Authentication**: JWT and OAuth integration
2. **Email Service**: SMTP integration for notifications
3. **Payment Processing**: Stripe integration for premium features
4. **Third-party APIs**: MLS, title company integrations

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check database status
npm run db:studio

# Reset database
npm run db:reset
```

#### 2. Prisma Client Generation Issues
```bash
# Regenerate Prisma client
npm run db:generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Validation Errors
- Check Zod schema definitions
- Verify input data types
- Review error messages for specific field issues

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=prisma:*
npm run dev
```

## 📚 Additional Resources

### Documentation
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Documentation](https://zod.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Community
- [Prisma Discord](https://discord.gg/prisma)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [PostgreSQL Community](https://www.postgresql.org/community/)

---

## 🎉 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure environment**: Copy `env.example` to `.env`
4. **Setup database**: `npm run db:push`
5. **Seed database**: `npm run db:seed`
6. **Start development**: `npm run dev`

The system is now ready with a comprehensive, type-safe data layer supporting all 89 professional roles!
