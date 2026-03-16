import { render, screen } from '@testing-library/react';
import LastPriceCard from '../components/Exchanges/LastPriceCard';

describe('LastPriceCard', () => {
  it('shows loading state when loading and no price', () => {
    render(<LastPriceCard symbol="BTCUSDT" loading={true} />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
  });

  it('shows error state when error and no price', () => {
    render(<LastPriceCard symbol="ETHUSDT" error="Network error" />);
    expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
    expect(screen.getByText('ETHUSDT')).toBeInTheDocument();
  });

  it('renders formatted price when price is provided', () => {
    render(<LastPriceCard symbol="BTCUSDT" price="65432.10" />);
    expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
    expect(screen.getByText('65,432.10')).toBeInTheDocument();
  });

  it('renders dash when no price and no loading/error', () => {
    render(<LastPriceCard symbol="SOLUSDT" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('shows price instead of loading when both price and loading are set', () => {
    render(<LastPriceCard symbol="BTCUSDT" price="100.00" loading={true} />);
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    expect(screen.getByText('100.00')).toBeInTheDocument();
  });
});
