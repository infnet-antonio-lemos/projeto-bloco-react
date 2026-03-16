import { render, screen } from '@testing-library/react';
import OrderBook from '../components/Exchanges/OrderBook';

const mockBids = [
  ['65000.00000000', '0.50000000'],
  ['64999.00000000', '1.20000000'],
];
const mockAsks = [
  ['65001.00000000', '0.30000000'],
  ['65002.00000000', '0.80000000'],
];

describe('OrderBook', () => {
  it('shows loading state when loading and no data', () => {
    render(<OrderBook loading={true} />);
    expect(screen.getByText('Carregando livro de ofertas...')).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<OrderBook error="Timeout" />);
    expect(screen.getByText('Erro: Timeout')).toBeInTheDocument();
  });

  it('renders bids and asks headers', () => {
    render(<OrderBook bids={mockBids} asks={mockAsks} />);
    expect(screen.getByText('Compras (Bids)')).toBeInTheDocument();
    expect(screen.getByText('Vendas (Asks)')).toBeInTheDocument();
  });

  it('renders correct number of bid rows', () => {
    render(<OrderBook bids={mockBids} asks={[]} />);
    const bidPrices = screen.getAllByText(/65000|64999/);
    expect(bidPrices.length).toBeGreaterThanOrEqual(2);
  });

  it('renders correct number of ask rows', () => {
    render(<OrderBook bids={[]} asks={mockAsks} />);
    const askPrices = screen.getAllByText(/65001|65002/);
    expect(askPrices.length).toBeGreaterThanOrEqual(2);
  });

  it('shows empty state messages when bids and asks are empty', () => {
    render(<OrderBook bids={[]} asks={[]} />);
    expect(screen.getByText('Sem ofertas de compra')).toBeInTheDocument();
    expect(screen.getByText('Sem ofertas de venda')).toBeInTheDocument();
  });
});
