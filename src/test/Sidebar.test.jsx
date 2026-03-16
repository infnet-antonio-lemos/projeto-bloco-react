import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';

const renderComponent = (props = {}) =>
  render(
    <MemoryRouter>
      <Sidebar isOpen={false} onClose={() => {}} {...props} />
    </MemoryRouter>
  );

describe('Sidebar', () => {
  it('renders the Exchanges nav link', () => {
    renderComponent();
    expect(screen.getByText('Exchanges')).toBeInTheDocument();
  });

  it('renders Binance and Bybit nav links', () => {
    renderComponent();
    expect(screen.getByText('Binance')).toBeInTheDocument();
    expect(screen.getByText('Bybit')).toBeInTheDocument();
  });

  it('does not show overlay when closed', () => {
    renderComponent({ isOpen: false });
    expect(document.querySelector('.sidebar-overlay')).not.toBeInTheDocument();
  });

  it('shows overlay when open', () => {
    renderComponent({ isOpen: true });
    expect(document.querySelector('.sidebar-overlay')).toBeInTheDocument();
  });

  it('applies sidebar-open class when open', () => {
    renderComponent({ isOpen: true });
    expect(document.querySelector('.sidebar')).toHaveClass('sidebar-open');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    renderComponent({ onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    renderComponent({ isOpen: true, onClose });
    fireEvent.click(document.querySelector('.sidebar-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
