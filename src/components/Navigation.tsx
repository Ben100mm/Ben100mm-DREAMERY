import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  width: 100%;
  background: transparent;
  padding: 0.5rem 0;
  position: absolute;
  bottom: 5%;
  left: 0;
  z-index: 9999;
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
    color: white;
    text-decoration: none;
    font-weight: 400;
    opacity: 0.8;
    transition: opacity 0.2s;
    &:hover {
      opacity: 1;
      color: white;
    }
  }
`;

const Navigation: React.FC = () => {
  const navItems = [
    'Buy', 'Rent', 'Sell', 'Mortgage', 'Underwrite', 'Analyze',
    'Close', 'Manage', 'Invest', 'Fund', 'Operate', 'Partner',
    'Learn', 'Advertise'
  ];

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <a href={`#${item.toLowerCase()}`}>{item}</a>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;