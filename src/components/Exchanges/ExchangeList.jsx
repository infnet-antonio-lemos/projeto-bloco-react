import ExchangeCard from './ExchangeCard';
import './ExchangeList.css';

const ExchangeList = () => {
  // Dados mockados de exchanges
  const exchanges = [
    {
      id: 1,
      name: 'Binance',
      icon: '🟡',
      description: 'A maior exchange de criptomoedas do mundo em volume de negociação.',
      volume24h: '$28.5B',
      country: 'Malta',
      tradingPairs: '1,400+',
      status: 'active'
    },
    // {
    //   id: 2,
    //   name: 'Coinbase',
    //   icon: '🔵',
    //   description: 'Exchange regulamentada nos EUA com foco em segurança e conformidade.',
    //   volume24h: '$3.2B',
    //   country: 'EUA',
    //   tradingPairs: '240+',
    //   status: 'active'
    // },
    // {
    //   id: 3,
    //   name: 'Kraken',
    //   icon: '🟣',
    //   description: 'Exchange veterana com forte foco em segurança e trading avançado.',
    //   volume24h: '$1.8B',
    //   country: 'EUA',
    //   tradingPairs: '185+',
    //   status: 'active'
    // },
    // {
    //   id: 4,
    //   name: 'KuCoin',
    //   icon: '🟢',
    //   description: 'Exchange popular conhecida por listar novos tokens rapidamente.',
    //   volume24h: '$1.5B',
    //   country: 'Seychelles',
    //   tradingPairs: '700+',
    //   status: 'active'
    // },
    {
      id: 5,
      name: 'Bybit',
      icon: '🟠',
      description: 'Plataforma especializada em derivativos e trading de futuros.',
      volume24h: '$8.3B',
      country: 'Dubai',
      tradingPairs: '450+',
      status: 'active'
    },
    // {
    //   id: 6,
    //   name: 'Bitfinex',
    //   icon: '🔴',
    //   description: 'Exchange com ferramentas avançadas para traders profissionais.',
    //   volume24h: '$620M',
    //   country: 'Hong Kong',
    //   tradingPairs: '330+',
    //   status: 'active'
    // }
  ];

  return (
    <div className="exchange-list-container">
      <div className="exchange-list-header">
        <h2 className="page-title">Exchanges de Criptomoedas</h2>
        <p className="page-description">
          Explore as principais exchanges e corretoras de criptomoedas do mercado
        </p>
      </div>

      <div className="exchange-grid">
        {exchanges.map(exchange => (
          <ExchangeCard key={exchange.id} exchange={exchange} />
        ))}
      </div>
    </div>
  );
};

export default ExchangeList;
