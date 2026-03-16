import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BybitMarketData from '../components/Bybit/BybitMarketData';

const mockKlineData = {
  retCode: 0,
  result: { list: [['1700000000000', '64000', '65500', '63000', '65000', '1000', '65000000']] },
};
const mockTradesData = {
  retCode: 0,
  result: {
    list: [{ price: '65000.00', size: '0.1', time: '1700000000000', side: 'Buy' }],
  },
};
const mockOrderBookData = {
  retCode: 0,
  result: { b: [['64999.00', '0.5']], a: [['65001.00', '0.3']] },
};

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/bybit/BTCUSDT']}>
      <Routes>
        <Route path="/bybit/:symbol" element={<BybitMarketData />} />
      </Routes>
    </MemoryRouter>
  );

describe('BybitMarketData', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockKlineData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTradesData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockOrderBookData) })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Carregando dados de mercado...')).toBeInTheDocument();
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
