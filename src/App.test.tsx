import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './components/Header';

test('renders Dreamery header', () => {
  render(<Header />);
  const heading = screen.getByText(/Dreamery/i);
  expect(heading).toBeInTheDocument();
});
