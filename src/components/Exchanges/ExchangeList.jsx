import ExchangeCard from './ExchangeCard';
import { exchanges } from '../../data/exchanges';
import './ExchangeList.css';

const ExchangeList = () => {
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
