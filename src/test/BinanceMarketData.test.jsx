import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BinanceMarketData from '../components/Binance/BinanceMarketData';

const mockOrderBook = {
  bids: [['64999.00', '0.5']],
  asks: [['65001.00', '0.3']],
};
const mockTrades = [
  { price: '65000.00', qty: '0.1', time: 1700000000000, isBuyerMaker: false },
];
const mockKlines = [
  [1700000000000, '64000', '65500', '63000', '65000', '1000', 0, '', 0, '', '', ''],
];

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/binance/BTCUSDT']}>
      <Routes>
        <Route path="/binance/:symbol" element={<BinanceMarketData />} />
      </Routes>
    </MemoryRouter>
  );

describe('BinanceMarketData', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockOrderBook) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTrades) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockKlines) })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/Carregando livro de ordens para BTCUSDT/)).toBeInTheDocument();
  });

  it('renders symbol heading after data loads', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('Dados de Mercado BTCUSDT')).toBeInTheDocument());
  });

  it('renders back link after data loads', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('← Voltar para Lista de Preços')).toBeInTheDocument()
    );
  });

  it('shows error message when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error')))
    );
    renderComponent();
    await waitFor(() => expect(screen.getByText(/Erro:/i)).toBeInTheDocument());
  });
});
