# Dreamery Homepage

A modern, responsive real estate platform homepage built with React and Material-UI, featuring a sophisticated authentication system and elegant user interface.

## Features

### Authentication System
- Multiple authentication methods:
  - Traditional email/password login
  - Social login (Google, Apple, Microsoft, Facebook, Twitter)
  - Passwordless authentication via Magic Link
- Secure session management
- Responsive and accessible auth forms
- Modern, clean UI with Material Design

### Core Features
- Clean, modern design with full-screen hero image
- Transparent, elegant search interface
- Responsive navigation
- Built with React, TypeScript, and Material-UI
- Styled with styled-components

## Technologies Used

### Frontend Framework & Libraries
- React 18
- TypeScript 4.9
- Material-UI (MUI) v7
- Styled Components v6
- React Router v7

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
git clone https://github.com/Ben100mm/Ben100mm-dreamery-software-VibeCursor.git
cd dreamery-homepage
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
dreamery-homepage/
├── public/                 # Static assets
│   ├── favicon.png
│   ├── hero-background.jpg
│   └── logo.png
├── src/
│   ├── components/        # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── MagicLinkForm.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   └── Navigation.tsx
│   ├── pages/            # Page components
│   │   └── auth/
│   │       └── AuthPage.tsx
│   ├── assets/           # Project assets (images, icons)
│   │   └── social-logos/ # Social media icons
│   └── App.tsx           # Root component
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI team for the excellent component library
- The React community for inspiration and best practices