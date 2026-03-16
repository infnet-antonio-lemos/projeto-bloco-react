import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BybitPriceList from '../components/Bybit/BybitPriceList';

const mockPrices = [
  { symbol: 'BTCUSDT', lastPrice: '65000.00' },
  { symbol: 'ETHUSDT', lastPrice: '3200.00' },
  { symbol: 'SOLUSDT', lastPrice: '150.00' },
];

const renderComponent = () =>
  render(
    <MemoryRouter>
      <BybitPriceList />
    </MemoryRouter>
  );

describe('BybitPriceList', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ retCode: 0, result: { list: mockPrices } }),
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Carregando preços...')).toBeInTheDocument();
  });

  it('renders price table after data loads', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('BTCUSDT')).toBeInTheDocument());
    expect(screen.getByText('ETHUSDT')).toBeInTheDocument();
    expect(screen.getByText('SOLUSDT')).toBeInTheDocument();
  });

  it('filters symbols by search term', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('BTCUSDT'));

    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrar por símbolo' }), {
      target: { value: 'BTC' },
    });

    expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
    expect(screen.queryByText('ETHUSDT')).not.toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error')))
    );
    renderComponent();
    await waitFor(() => expect(screen.getByText(/erro:/i)).toBeInTheDocument());
  });

  it('renders the Atualizar button after data loads', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('BTCUSDT'));
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument();
  });
});
