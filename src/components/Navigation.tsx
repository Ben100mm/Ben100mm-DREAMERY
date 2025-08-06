import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavContainer = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.45);
  padding: 0.75rem 0;
  position: absolute;
  bottom: 5%;
  left: 0;
  z-index: 9999;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
`;

const NavItem = styled.li`
  a {
    color: #1a365d;
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 1rem;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    &:hover {
      background: rgba(255, 255, 255, 0.4);
      color: #0d2340;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
    }
  }
`;

const Navigation: React.FC = () => {
  const navItems = [
    { name: 'Buy', path: '/buy' },
    { name: 'Rent', path: '/rent' },
    { name: 'Sell', path: '/sell' },
    { name: 'Mortgage', path: '/mortgage' },
    { name: 'Underwrite', path: '/underwrite' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Close', path: '/close' },
    { name: 'Manage', path: '/manage' },
    { name: 'Invest', path: '/invest' },
    { name: 'Fund', path: '/fund' },
    { name: 'Operate', path: '/operate' },
    { name: 'Partner', path: '/partner' },
    { name: 'Learn', path: '/learn' },
    { name: 'Advertise', path: '/advertise' }
  ];

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <Link to={item.path}>{item.name}</Link>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation; 