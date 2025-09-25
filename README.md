# DREAMERY

**DREAMERY SOFTWARE LLC - PRIVATE REPOSITORY**

## Overview

The Dreamery Homepage is a comprehensive real estate platform built with React, TypeScript, and Material-UI. It provides property search, analysis, and related services for real estate professionals and consumers.

## Quick Start

### Development Setup
```bash
# Install dependencies
npm install
cd server && pip install -r requirements.txt

# Start development servers
npm start                    # Frontend (port 3000)
cd server && python start_realtor_api.py  # Backend (port 5001)
```

### Documentation
- **[Development Guide](docs/DEVELOPMENT.md)** - Setup and development
- **[API Documentation](docs/API.md)** - API integration and endpoints
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript 4.9.5** - Type safety
- **Material-UI v5.15.10** - Component library
- **Styled Components** - CSS-in-JS styling

### Backend
- **Python Flask** - API server
- **Prisma ORM** - Database toolkit
- **PostgreSQL/SQLite** - Database

## Features

### Core Functionality
- Property search and filtering
- Interactive maps with Apple Maps integration
- Real estate data analysis
- User authentication and role management
- Responsive design for all devices

### User Roles
- **Buyer** - Individual homebuyers
- **Buying Agent** - Agents representing buyers
- **Listing Agent** - Agents representing sellers
- **Broker** - Office-level oversight
- **Brand Manager** - Multi-office management
- **Enterprise** - Large brokerage operations

## Project Structure

```
dreamery-homepage/
├── src/                    # React frontend
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── theme/            # Design system
├── server/               # Python backend
├── public/               # Static assets
└── docs/                 # Documentation
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001
REACT_APP_APPLE_MAPS_JWT_TOKEN=your_jwt_token
```

### Backend (server/.env)
```
FLASK_ENV=development
DATABASE_URL=sqlite:///dev.db
SECRET_KEY=your_secret_key
```

## Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run linting
npm run type-check # TypeScript checking
```

### Database Commands
```bash
npm run db:push    # Push schema changes
npm run db:seed    # Seed database
npm run db:studio  # Open Prisma Studio
```

## Access and Usage Restrictions

**AUTHORIZED PERSONNEL ONLY**

This is a **PRIVATE, PROPRIETARY REPOSITORY** with restricted access. Unauthorized access is strictly prohibited and may result in legal action.

### Authorized Access
- Full-time employees of Dreamery Software LLC
- Contractors with signed Non-Disclosure Agreements
- Partners with explicit written authorization
- Third-party developers with valid service agreements

### Prohibited Activities
- Copying, reproducing, or distributing any code
- Reverse engineering or decompiling software
- Creating competing products or services
- Sharing code with unauthorized parties
- Using proprietary information for personal gain

### For Authorized Developers
- Follow all security protocols and coding standards
- Maintain strict confidentiality of all proprietary information
- Report any security concerns immediately
- Use only for authorized business purposes

## Legal Information

- **License**: Proprietary - See LICENSE file
- **Copyright**: © 2024 Dreamery Software LLC. All rights reserved.
- **Privacy Policy**: See legal/PRIVACY_POLICY.md
- **Terms of Service**: See legal/TERMS_OF_SERVICE.md
- **Security Policy**: See legal/SECURITY_POLICY.md

## Legal Warning

**UNAUTHORIZED USE IS ILLEGAL**

This software is proprietary and confidential. Any unauthorized use, copying, distribution, or reverse engineering is strictly prohibited and may result in civil and criminal penalties under applicable law.

## Support

For technical support or questions:
- Check documentation in `docs/` directory
- Review existing GitHub issues
- Contact authorized development team

---

**Classification**: PROPRIETARY - CONFIDENTIAL  
**Access Level**: AUTHORIZED PERSONNEL ONLY  
**Copyright**: © 2024 Dreamery Software LLC. All rights reserved.
