import { render, screen, fireEvent } from '@testing-library/react';
import MarketData from '../components/Exchanges/MarketData';

const intervals = ['1m', '5m', '15m', '1h', '1d'];
const limits = [5, 10, 20, 50];

// Generate mock kline rows: [openTime, open, high, low, close, volume, ...]
const makeMockData = (count) =>
  Array.from({ length: count }, (_, i) => [
    1700000000000 + i * 60000,
    `${60000 + i}`,
    `${60100 + i}`,
    `${59900 + i}`,
    `${60050 + i}`,
    `${1000 + i}`,
    0, '', 0, '', '', '',
  ]);

const defaultProps = {
  data: makeMockData(3),
  loading: false,
  error: null,
  intervals,
  currentInterval: '1d',
  onIntervalChange: vi.fn(),
  limits,
  currentLimit: 10,
  onLimitChange: vi.fn(),
};

describe('MarketData', () => {
  it('shows loading state when loading and no data', () => {
    render(<MarketData {...defaultProps} data={[]} loading={true} />);
    expect(screen.getByText('Carregando dados de mercado...')).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<MarketData {...defaultProps} error="Falha na API" />);
    expect(screen.getByText('Erro: Falha na API')).toBeInTheDocument();
  });

  it('renders interval and limit selects', () => {
    render(<MarketData {...defaultProps} />);
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('calls onIntervalChange when interval select changes', () => {
    const onIntervalChange = vi.fn();
    render(<MarketData {...defaultProps} onIntervalChange={onIntervalChange} />);
    const [intervalSelect] = screen.getAllByRole('combobox');
    fireEvent.change(intervalSelect, { target: { value: '1h' } });
    expect(onIntervalChange).toHaveBeenCalledWith('1h');
  });

  it('calls onLimitChange when limit select changes', () => {
    const onLimitChange = vi.fn();
    render(<MarketData {...defaultProps} onLimitChange={onLimitChange} />);
    const [, limitSelect] = screen.getAllByRole('combobox');
    fireEvent.change(limitSelect, { target: { value: '20' } });
    expect(onLimitChange).toHaveBeenCalledWith(20);
  });

  it('renders the correct number of data rows', () => {
    render(<MarketData {...defaultProps} data={makeMockData(3)} itemsPerPage={10} />);
    // 3 data rows inside the tbody
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows = 4
    expect(rows.length).toBe(4);
  });

  it('shows pagination when data exceeds itemsPerPage', () => {
    render(<MarketData {...defaultProps} data={makeMockData(15)} itemsPerPage={10} />);
    expect(screen.getByText(/de 2/)).toBeInTheDocument(); // "Página 1 de 2"
  });
});
