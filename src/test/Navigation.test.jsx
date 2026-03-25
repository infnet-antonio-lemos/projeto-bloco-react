import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import ExchangesPage from '../pages/ExchangesPage';
import BinancePage from '../pages/BinancePage';
import BybitPage from '../pages/BybitPage';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url) => {
      // Mock específico para a API da Bybit
      if (url.includes('bybit.com')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              retCode: 0,
              result: { list: [] },
            }),
        });
      }
      // Mock genérico para Binance e qualquer outra API
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderApp = (initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ExchangesPage />} />
          <Route path="/exchanges" element={<ExchangesPage />} />
          <Route path="/binance" element={<BinancePage />} />
          <Route path="/bybit" element={<BybitPage />} />
        </Routes>
      </MainLayout>
    </MemoryRouter>
  );

describe('Navegação entre rotas (integração)', () => {
  it('renderiza a página inicial com a lista de exchanges', async () => {
    renderApp('/');
    await waitFor(() =>
      expect(screen.getByText('Exchanges de Criptomoedas')).toBeInTheDocument()
    );
  });

  it('navega para a página da Binance ao clicar no link do menu', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(menuButton);

    const binanceLink = screen.getByRole('link', { name: /binance/i });
    await user.click(binanceLink);

    await waitFor(() =>
      expect(screen.getByText(/preços de mercado binance/i)).toBeInTheDocument()
    );
  });

  it('navega para a página da Bybit ao clicar no link do menu', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(menuButton);

    const bybitLink = screen.getByRole('link', { name: /bybit/i });
    await user.click(bybitLink);

    await waitFor(() =>
      expect(screen.getByText(/preços de mercado bybit/i)).toBeInTheDocument()
    );
  });

  it('navega para /binance diretamente pela rota', async () => {
    renderApp('/binance');
    await waitFor(() =>
      expect(screen.getByText(/preços de mercado binance/i)).toBeInTheDocument()
    );
  });

  it('volta para a página de exchanges ao clicar em Exchanges no menu', async () => {
    const user = userEvent.setup();
    renderApp('/binance');

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(menuButton);

    const exchangesLink = screen.getByRole('link', { name: /exchanges/i });
    await user.click(exchangesLink);

    await waitFor(() =>
      expect(screen.getByText('Exchanges de Criptomoedas')).toBeInTheDocument()
    );
  });
});