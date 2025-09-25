# Dreamery Homepage - Setup and Configuration Guide

**Classification**: TECHNICAL - INTERNAL USE  
**Last Updated**: December 2024  
**Version**: 1.0

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Database Configuration](#database-configuration)
6. [Environment Configuration](#environment-configuration)
7. [Apple Maps Integration](#apple-maps-integration)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Ben100mm/Ben100mm-dreamery-operating-software.git
cd dreamery-homepage
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment
```bash
# Copy environment template
cp env.example .env

# Edit environment variables (see Environment Configuration section)
nano .env
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 5. Start Development Servers
```bash
# Start frontend (terminal 1)
npm start

# Start backend (terminal 2)
cd server && python start_realtor_api.py
```

The application will be available at `http://localhost:3000`

---

## Prerequisites

### System Requirements
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Python**: 3.8 or higher
- **pip**: Latest version
- **Git**: Latest version

### Development Tools (Recommended)
- **VS Code**: Code editor with TypeScript support
- **React DevTools**: Browser extension for React debugging
- **Postman**: API testing tool
- **Prisma Studio**: Database GUI (optional)

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Available Scripts
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Eject from Create React App (not recommended)
npm run eject
```

### 3. Key Dependencies
- **React 18.2.0**: Core React library
- **TypeScript 4.9.5**: Type-safe development
- **Material-UI v5.15.10**: Component library
- **Styled Components v6.1.19**: CSS-in-JS styling
- **React Router v6.22.0**: Client-side routing

### 4. Project Structure
```
src/
├── components/          # Reusable React components
│   ├── auth/           # Authentication components
│   ├── Header.tsx      # Main header component
│   ├── Hero.tsx        # Hero section component
│   └── Navigation.tsx  # Navigation component
├── pages/              # Page-level components
│   ├── auth/           # Authentication pages
│   ├── BuyPage.tsx     # Property buying page
│   ├── RentPage.tsx    # Property rental page
│   └── manage.tsx      # Management dashboard
├── services/           # API service layers
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── theme/             # Design system and theming
└── App.tsx            # Root component
```

---

## Backend Setup

### 1. Install Python Dependencies
```bash
cd server
pip install -r requirements.txt
```

### 2. Key Dependencies
- **Flask**: Lightweight web framework
- **Pydantic**: Data validation and parsing
- **Pandas**: Data manipulation and analysis
- **Requests**: HTTP library for API calls
- **BeautifulSoup4**: HTML parsing
- **Prisma**: Database ORM

### 3. Server Structure
```
server/
├── models.py                    # Data models and Pydantic schemas
├── realtor_api.py              # Main API endpoints
├── dreamery_property_scraper.py # Property scraping logic
├── scraper_api.py              # High-level scraping API
├── utils.py                    # Utility functions
├── start_realtor_api.py        # Server startup script
├── requirements.txt            # Python dependencies
└── tests/                      # Test files
    └── README.md               # Testing documentation
```

### 4. Start the Server
```bash
cd server
python start_realtor_api.py
```

The API will be available at `http://localhost:5001`

### 5. API Endpoints
- **GET** `/api/realtor/health` - Health check
- **POST** `/api/realtor/search` - Property search
- **POST** `/api/realtor/scrape` - High-level scraping
- **GET** `/api/realtor/property/{id}` - Property details
- **GET** `/api/realtor/suggestions` - Search suggestions

---

## Database Configuration

### 1. Prisma Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Reset database
npm run db:reset

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### 2. Database Options

#### Development (SQLite)
```bash
# In .env file
DATABASE_URL="file:./dev.db"
```

#### Production (PostgreSQL)
```bash
# In .env file
DATABASE_URL="postgresql://username:password@localhost:5432/dreamery_professional_support"
```

### 3. Database Schema
The database includes models for:
- **User Management**: User, UserProfile, UserRole
- **Workflow Management**: Workflow, WorkflowStep
- **Document Management**: DocumentTemplate, DocumentInstance
- **Compliance**: ComplianceRequirement, ComplianceRecord
- **Analytics**: AnalyticsMetric, AnalyticsDashboard
- **Audit**: AuditLog for all operations

### 4. Data Seeding
The seed script creates:
- Default user roles and permissions
- Sample workflows and templates
- Test data for development
- Professional role configurations

---

## Environment Configuration

### 1. Environment File Setup
```bash
# Copy the example file
cp env.example .env

# Edit the environment file
nano .env
```

### 2. Required Environment Variables

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5001

# Apple Maps Integration
REACT_APP_APPLE_MAPS_JWT_TOKEN=your_apple_maps_jwt_token

# Development Settings
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

#### Backend (server/.env)
```bash
# Database Configuration
DATABASE_URL="file:./dev.db"

# API Configuration
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5001

# Security
SECRET_KEY=your_secret_key_here
```

### 3. Environment-Specific Configurations

#### Development
```bash
REACT_APP_ENV=development
REACT_APP_DEBUG=true
FLASK_ENV=development
FLASK_DEBUG=true
```

#### Production
```bash
REACT_APP_ENV=production
REACT_APP_DEBUG=false
FLASK_ENV=production
FLASK_DEBUG=false
```

### 4. Security Considerations
- **Never commit .env files**: Add to .gitignore
- **Use strong secret keys**: Generate random strings
- **Rotate credentials regularly**: Update tokens and keys
- **Limit API access**: Use appropriate CORS settings

---

## Apple Maps Integration

### 1. Prerequisites
- Apple Developer Account
- Access to Apple Developer Console
- MapKit JS capability enabled

### 2. Get Apple Maps JWT Token

#### Step 1: Create API Key
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Keys** from the sidebar
4. Click the **+** button to create a new key
5. Give your key a name (e.g., "Dreamery Maps")
6. Enable **MapKit JS** capability
7. Click **Continue** and then **Register**
8. Download the key file (.p8 file)
9. Note down your **Key ID** and **Team ID**

#### Step 2: Generate JWT Token
```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Your Apple Developer credentials
const teamId = 'YOUR_TEAM_ID';
const keyId = 'YOUR_KEY_ID';
const privateKey = fs.readFileSync('path/to/your/AuthKey_KEYID.p8');

// Generate JWT token
const token = jwt.sign({
  iss: teamId,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
}, privateKey, {
  algorithm: 'ES256',
  header: {
    kid: keyId
  }
});

console.log('Your Apple Maps JWT token:', token);
```

#### Step 3: Configure Environment
```bash
# Add to .env file
REACT_APP_APPLE_MAPS_JWT_TOKEN=your_generated_jwt_token_here
```

### 3. Features
- **Free Usage**: 250,000 map loads per day
- **Property Markers**: Custom property annotations
- **Map Types**: Standard, Satellite, and Hybrid views
- **Interactive Controls**: Zoom, compass, scale
- **Street View**: Look Around integration
- **Privacy Focused**: No user tracking
- **Responsive Design**: Works on all devices

### 4. Usage in Components
```typescript
import { AppleMapsComponent } from '../components';

const MyComponent = () => {
  const properties = [
    {
      id: 1,
      price: '$1.2M',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      },
      specialLabels: ['New Listing'],
      isHighlighted: false
    }
  ];

  return (
    <AppleMapsComponent 
      properties={properties}
      onPropertyClick={(property) => console.log('Clicked property:', property)}
    />
  );
};
```

---

## Development Workflow

### 1. Daily Development Process

#### Start Development Session
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install
cd server && pip install -r requirements.txt && cd ..

# Start development servers
npm start                    # Terminal 1
cd server && python start_realtor_api.py  # Terminal 2
```

#### Make Changes
1. **Frontend Changes**: Edit files in `src/` directory
2. **Backend Changes**: Edit files in `server/` directory
3. **Database Changes**: Update `prisma/schema.prisma` and run migrations
4. **Test Changes**: Run tests and check for errors

#### End Development Session
```bash
# Run tests
npm test

# Run linting
npm run lint

# Commit changes
git add .
git commit -m "Description of changes"

# Push changes
git push origin feature-branch
```

### 2. Code Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run all tests
npm test

# Run integration tests
npm run test:integration
```

### 3. Database Management
```bash
# Check database status
npm run db:studio

# Reset database
npm run db:reset

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 4. Performance Monitoring
```bash
# Measure bundle size
node scripts/measure-performance.js

# Analyze bundle
npm run build
npm run analyze

# Check performance budgets
npm run performance:check
```

---

## Troubleshooting

### Common Issues

#### Frontend Issues

##### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

##### Runtime Errors
```bash
# Check console for errors
# Open browser DevTools (F12)

# Check network requests
# Look for failed API calls in Network tab

# Check React DevTools
# Install React DevTools browser extension
```

#### Backend Issues

##### Import Errors
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt

# Check Python path
which python
```

##### API Connection Issues
```bash
# Check if server is running
curl http://localhost:5001/api/realtor/health

# Check server logs
cd server
python start_realtor_api.py

# Check CORS settings
# Verify CORS is enabled in Flask app
```

#### Database Issues

##### Connection Errors
```bash
# Check database URL
echo $DATABASE_URL

# Test database connection
npm run db:studio

# Reset database
npm run db:reset
```

##### Migration Issues
```bash
# Reset migrations
npm run db:migrate:reset

# Push schema directly (development only)
npm run db:push

# Check schema syntax
npx prisma validate
```

### Debug Mode

#### Enable Debug Logging
```bash
# Frontend debugging
REACT_APP_DEBUG=true npm start

# Backend debugging
FLASK_DEBUG=true python start_realtor_api.py

# Database debugging
DEBUG=prisma:* npm run db:studio
```

#### Browser DevTools
1. **Console**: Check for JavaScript errors
2. **Network**: Monitor API requests and responses
3. **Elements**: Inspect DOM structure and styles
4. **Performance**: Analyze loading and rendering performance
5. **React DevTools**: Debug React component state and props

### Getting Help

#### Documentation
- Check this setup guide for common issues
- Review component documentation in code comments
- Consult API documentation in `server/` directory

#### Debugging Tools
- **Browser DevTools**: Built-in debugging tools
- **React DevTools**: Component inspection
- **Prisma Studio**: Database visualization
- **Postman**: API testing

#### Support Channels
- Check existing GitHub issues
- Review error logs and console output
- Test with minimal reproduction cases
- Document steps to reproduce issues

---

## Production Deployment

### 1. Build for Production
```bash
# Build frontend
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### 2. Environment Configuration
```bash
# Production environment variables
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.dreamery.com
REACT_APP_APPLE_MAPS_JWT_TOKEN=production_jwt_token
```

### 3. Server Configuration
```bash
# Production server setup
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=production_secret_key
```

### 4. Database Migration
```bash
# Run production migrations
npm run db:migrate

# Verify database schema
npm run db:validate
```

### 5. Security Checklist
- [ ] Environment variables secured
- [ ] API endpoints protected
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] SSL/TLS certificates installed
- [ ] Error handling configured
- [ ] Logging configured
- [ ] Monitoring set up

---

**This setup guide provides comprehensive instructions for setting up and configuring the Dreamery Homepage development environment. Follow these steps carefully to ensure a successful development setup.**
