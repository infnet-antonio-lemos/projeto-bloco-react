import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/Layout/Header';

describe('Header', () => {
  it('renders the app name', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByText('CryptoView')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByAltText('CryptoView logo')).toBeInTheDocument();
  });

  it('renders the menu toggle button', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Toggle menu' })).toBeInTheDocument();
  });

  it('calls onMenuToggle when toggle button is clicked', async () => {
    const handleToggle = vi.fn();
    render(<Header onMenuToggle={handleToggle} />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
