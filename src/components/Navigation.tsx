import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { brandColors } from "../theme";

const NavContainer = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  padding: 0.75rem 0;
  position: absolute;
  bottom: 5%;
  left: 0;
  z-index: 9999;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 1.00rem;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
`;

const NavItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-weight: 800;
    padding: 0.35rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
    letter-spacing: 0.3px;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
      font-weight: 900;
    }
  }
`;

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Lumina', path: '/lumina' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Sell / List', path: '/sell' },
    { name: 'Mortgage', path: '/mortgage' },
    { name: 'Underwrite', path: '/underwrite' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Close', path: '/close' },
    { name: 'Manage', path: '/manage' },
    { name: 'Invest', path: '/invest' },
    { name: 'Fund', path: '/fund' },
    { name: 'Operate', path: '/operate' },
    { name: 'Partners', path: '/partner' },
    { name: 'Learn', path: '/learn' },
    { name: 'Advertise', path: '/advertise' }
  ];

  const handleNavClick = (path: string) => {
    console.log('Navigation clicked:', path); // Debug log
    // Navigate to any declared route; non-declared paths will log for now
    switch (path) {
      case '/lumina':
      case '/marketplace':
      case '/sell':
      case '/mortgage':
      case '/underwrite':
      case '/analyze':
      case '/close':
      case '/manage':
      case '/invest':
      case '/fund':
      case '/operate':
      case '/learn':
      case '/advertise':
      case '/partner':
        console.log('Navigating to:', path); // Debug log
        navigate(path);
        break;
      default:
        console.log('Route not implemented:', path); // Debug log
        // Route not implemented yet
        break;
    }
  };

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}>
              {item.name}
            </a>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;