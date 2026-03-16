import { render, screen } from '@testing-library/react';
import RecentTrades from '../components/Exchanges/RecentTrades';

const mockTrades = [
  { price: '65000.5', amount: '0.001', time: new Date('2024-01-01T12:00:00Z').getTime(), side: 'buy' },
  { price: '64999.0', amount: '0.002', time: new Date('2024-01-01T12:00:01Z').getTime(), side: 'sell' },
];

describe('RecentTrades', () => {
  it('shows loading state when loading and no data', () => {
    render(<RecentTrades loading={true} />);
    expect(screen.getByText('Carregando transações...')).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<RecentTrades error="API Error" />);
    expect(screen.getByText('Erro: API Error')).toBeInTheDocument();
  });

  it('renders the table header', () => {
    render(<RecentTrades data={mockTrades} />);
    expect(screen.getByText('Preço')).toBeInTheDocument();
    expect(screen.getByText('Quantidade')).toBeInTheDocument();
    expect(screen.getByText('Horário')).toBeInTheDocument();
    expect(screen.getByText('Lado')).toBeInTheDocument();
  });

  it('renders buy and sell labels for trade rows', () => {
    render(<RecentTrades data={mockTrades} />);
    expect(screen.getByText('Compra')).toBeInTheDocument();
    expect(screen.getByText('Venda')).toBeInTheDocument();
  });

  it('shows empty state message when data is empty', () => {
    render(<RecentTrades data={[]} />);
    expect(screen.getByText('Nenhuma negociação recente')).toBeInTheDocument();
  });

  it('renders correct number of trade rows', () => {
    render(<RecentTrades data={mockTrades} />);
    const buyLabels = screen.getAllByText('Compra');
    const sellLabels = screen.getAllByText('Venda');
    expect(buyLabels).toHaveLength(1);
    expect(sellLabels).toHaveLength(1);
  });
});
