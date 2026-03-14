import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExchangeCard from '../components/Exchanges/ExchangeCard';

const mockExchange = {
  id: 'coinbase',
  name: 'Coinbase',
  icon: '🔵',
  description: 'Exchange regulamentada nos EUA.',
  volume24h: '$3.2B',
  tradingPairs: '240+',
  status: 'active',
  country: 'EUA',
  mock: true, // prevents API fetch
};

const renderCard = (exchange = mockExchange) =>
  render(
    <MemoryRouter>
      <ExchangeCard exchange={exchange} />
    </MemoryRouter>
  );

describe('ExchangeCard', () => {
  it('renders exchange name', () => {
    renderCard();
    expect(screen.getByText('Coinbase')).toBeInTheDocument();
  });

  it('renders exchange icon', () => {
    renderCard();
    expect(screen.getByText('🔵')).toBeInTheDocument();
  });

  it('renders exchange description', () => {
    renderCard();
    expect(screen.getByText('Exchange regulamentada nos EUA.')).toBeInTheDocument();
  });

  it('renders static volume and tradingPairs from props', () => {
    renderCard();
    expect(screen.getByText('$3.2B')).toBeInTheDocument();
    expect(screen.getByText('240+')).toBeInTheDocument();
  });

  it('renders active status badge', () => {
    renderCard();
    expect(screen.getByText(/ativo/i)).toBeInTheDocument();
  });

  it('shows alert for non-Binance/Bybit exchanges when details clicked', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: /detalhes/i }));
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Coinbase'));
    alertMock.mockRestore();
  });
});
