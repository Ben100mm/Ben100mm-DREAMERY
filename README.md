# Dreamery Homepage

# ⚠️ PROPRIETARY SOFTWARE - CONFIDENTIAL ⚠️

**DREAMERY SOFTWARE LLC - PRIVATE REPOSITORY**

Copyright (c) 2024 Dreamery Software LLC. All rights reserved.

This software and associated documentation files are **PROPRIETARY AND CONFIDENTIAL**. Unauthorized copying, distribution, or use is **STRICTLY PROHIBITED** and may result in legal action.

**CLASSIFICATION**: CONFIDENTIAL - PROPRIETARY  
**ACCESS LEVEL**: AUTHORIZED PERSONNEL ONLY  
**LEGAL STATUS**: PROTECTED BY COPYRIGHT AND TRADE SECRET LAWS

A modern, responsive real estate platform homepage built with React and Material-UI, featuring a comprehensive authentication system, advanced security features, and elegant user interface.

## Features

### Authentication System
- **Basic Authentication Methods:**
  - Traditional email/password login
  - Social login (Google, Apple, Microsoft, Facebook, Twitter)
  - Passwordless authentication via Magic Link
- **Advanced Security Features:**
  - One-Time Password (OTP) via SMS, email, or authenticator apps
  - Biometric authentication (fingerprint and face recognition)
  - Two-Factor Authentication (2FA) with authenticator apps and hardware tokens
  - Single Sign-On (SSO) with OAuth2/OpenID Connect
  - Enterprise SSO support (Okta, Auth0, Azure AD, SAML)
- **Security Management:**
  - Dedicated Security Settings page
  - Security score tracking
  - Method status management
  - Progressive security enhancement

### Core Features
- **Hero Section:**
  - Advanced search interface with autocomplete
  - Geolocation support
  - Search history with localStorage persistence
  - Map icon and navy blue search button
- **Navigation:**
  - Responsive header with logo and navigation buttons
  - Security settings access
  - Clean, modern design
- **User Experience:**
  - Responsive design for all devices
  - Loading states and error handling
  - Success feedback and user guidance
  - Accessibility features

### Design & UI
- Clean, modern design with full-screen hero image
- Transparent, elegant search interface
- Material-UI components with custom styling
- Styled with styled-components
- Consistent color scheme and typography

## Technologies Used

### Frontend Framework & Libraries
- React 18.2.0
- TypeScript 4.9.5
- Material-UI (MUI) v5.15.10
- Styled Components v6.1.19
- React Router v6.22.0

### Development Tools
- Create React App
- ESLint
- Prettier
- Git

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ben100mm/Ben100mm-dreamery-operating-software.git
cd dreamery-operating-software
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
dreamery-operating-software/
├── public/                 # Static assets
│   ├── favicon.png
│   ├── hero-background.jpg
│   └── logo.png
├── src/
│   ├── components/        # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── MagicLinkForm.tsx
│   │   │   ├── OTPForm.tsx
│   │   │   ├── BiometricForm.tsx
│   │   │   ├── TwoFactorForm.tsx
│   │   │   ├── SSOForm.tsx
│   │   │   └── SocialLoginButtons.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   └── Navigation.tsx
│   ├── pages/            # Page components
│   │   ├── auth/
│   │   │   └── AuthPage.tsx
│   │   └── SecuritySettings.tsx
│   ├── assets/           # Project assets (images, icons)
│   │   └── social-logos/ # Social media icons
│   └── App.tsx           # Root component
└── package.json
```

## Recent Updates

### Authentication & Security Enhancements
- **Reorganized Authentication Flow**: Separated basic auth from advanced security features
- **Security Settings Page**: Dedicated page for managing advanced authentication methods
- **Progressive Security**: Users can enhance security after initial sign-in
- **Security Scoring**: Visual feedback on account security level

### Hero Section Improvements
- **Advanced Search**: Autocomplete with geolocation and search history
- **UI Enhancements**: Map icon, navy blue search button, improved placeholder text
- **Responsive Design**: Optimized for all device sizes

### Component Architecture
- **Modular Design**: Separated concerns between basic auth and security features
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth user experience with loading indicators

## Development

### Available Scripts
- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Key Routes
- `/` - Homepage with hero section
- `/auth` - Basic authentication (Sign In, Sign Up, Magic Link)
- `/security` - Advanced security settings (2FA, Biometric, OTP, SSO)

## 🔒 ACCESS AND USAGE RESTRICTIONS

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
- Complete required security training
- Use only company-approved development tools
- Contact legal@dreamerysoftware.com for licensing inquiries

## Legal Information

This is proprietary software owned by Dreamery Software LLC. All rights reserved.

- **License**: Proprietary - see LICENSE file for details
- **Privacy Policy**: See legal/PRIVACY_POLICY.md
- **Terms of Service**: See legal/TERMS_OF_SERVICE.md
- **Security Policy**: See legal/SECURITY_POLICY.md

## ⚠️ LEGAL WARNING ⚠️

**UNAUTHORIZED USE IS ILLEGAL**

This software contains **PROPRIETARY AND CONFIDENTIAL INFORMATION** protected by copyright, trade secret, and other intellectual property laws. 

**UNAUTHORIZED ACCESS, USE, COPYING, OR DISTRIBUTION IS STRICTLY PROHIBITED** and may result in:
- Civil and criminal penalties under applicable law
- Injunctive relief and monetary damages
- Legal action for intellectual property infringement
- Termination of access and employment/contractual relationships

**REPORT VIOLATIONS**: benjamin@dreameryestates.com

## Acknowledgments

- Material-UI team for the excellent component library
- The React community for inspiration and best practices
- Web Authentication API for biometric authentication concepts
