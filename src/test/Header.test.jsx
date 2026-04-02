import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/Layout/Header';
import { AuthProvider } from '../context/AuthContext';

const renderHeader = (props = {}) =>
  render(
    <AuthProvider>
      <Header onMenuToggle={() => {}} {...props} />
    </AuthProvider>
  );

describe('Header', () => {
  it('renders the app name', () => {
    renderHeader();
    expect(screen.getByText('CryptoView')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    renderHeader();
    expect(screen.getByAltText('CryptoView logo')).toBeInTheDocument();
  });

  it('renders the menu toggle button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Toggle menu' })).toBeInTheDocument();
  });

  it('calls onMenuToggle when toggle button is clicked', async () => {
    const handleToggle = vi.fn();
    renderHeader({ onMenuToggle: handleToggle });
    await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
