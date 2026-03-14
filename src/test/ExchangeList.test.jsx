import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExchangeList from '../components/Exchanges/ExchangeList';
import { exchanges } from '../data/exchanges';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ExchangeList', () => {
  it('renders the section title', () => {
    render(
      <MemoryRouter>
        <ExchangeList />
      </MemoryRouter>
    );
    expect(screen.getByText('Exchanges de Criptomoedas')).toBeInTheDocument();
  });

  it('renders a card for every exchange in the data', () => {
    render(
      <MemoryRouter>
        <ExchangeList />
      </MemoryRouter>
    );
    exchanges.forEach((exchange) => {
      expect(screen.getByText(exchange.name)).toBeInTheDocument();
    });
  });
});
