# Development Guide

**Dreamery Homepage - Development Setup & Guidelines**

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/Ben100mm/Ben100mm-dreamery-operating-software.git
cd dreamery-homepage

# Install dependencies
npm install
cd server && pip install -r requirements.txt
```

### Development Server
```bash
# Start frontend (port 3000)
npm start

# Start backend API (port 5001)
cd server
python start_realtor_api.py
```

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

## Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript 4.9.5** - Type safety
- **Material-UI v5.15.10** - Component library
- **Styled Components** - CSS-in-JS

### Backend
- **Python Flask** - API server
- **Prisma ORM** - Database toolkit
- **PostgreSQL/SQLite** - Database

## Development Guidelines

### Code Standards
- Use TypeScript for all new code
- Follow Material-UI design system
- Implement responsive design
- Include proper error handling

### Git Workflow
- Create feature branches from `main`
- Use descriptive commit messages
- Submit pull requests for review
- Ensure all tests pass

### Testing
```bash
# Run frontend tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
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

## Common Issues

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Ensure backend server is running on port 5001
- Check CORS settings in Flask app
- Verify environment variables

### Database Issues
```bash
# Reset database
npm run db:push
npm run db:seed
```

## Support

For development issues:
- Check existing GitHub issues
- Review component documentation
- Consult API documentation in `server/` directory

---

**Classification**: INTERNAL USE ONLY  
**Access**: AUTHORIZED PERSONNEL ONLY
