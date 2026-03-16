import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';

const renderComponent = (children = <p>Page content</p>) =>
  render(
    <MemoryRouter>
      <MainLayout>{children}</MainLayout>
    </MemoryRouter>
  );

describe('MainLayout', () => {
  it('renders children', () => {
    renderComponent(<p>Page content</p>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders the header', () => {
    renderComponent();
    expect(screen.getByText('CryptoView')).toBeInTheDocument();
  });

  it('opens the sidebar when the menu toggle is clicked', async () => {
    renderComponent();
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).not.toHaveClass('sidebar-open');
    await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(sidebar).toHaveClass('sidebar-open');
  });

  it('closes the sidebar when close button is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(document.querySelector('.sidebar')).not.toHaveClass('sidebar-open');
  });
});
