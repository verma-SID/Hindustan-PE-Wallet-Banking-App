import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Use MemoryRouter to provide a router context
import CustomNavbar from './CustomNavbar';

describe('CustomNavbar Component', () => {
  it('renders Navbar brand text', () => {
    render(
      <MemoryRouter>
        <CustomNavbar />
      </MemoryRouter>
    );
    const brandText = screen.getByText('Wallet Banking App');
    expect(brandText).toBeInTheDocument();
  });

  it('renders Home navigation link', () => {
    render(
      <MemoryRouter>
        <CustomNavbar />
      </MemoryRouter>
    );
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
  });

  it('renders Dashboard navigation link', () => {
    render(
      <MemoryRouter>
        <CustomNavbar />
      </MemoryRouter>
    );
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();
  });
});
