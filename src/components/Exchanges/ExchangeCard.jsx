import { useNavigate } from 'react-router-dom';
import './ExchangeCard.css';

const ExchangeCard = ({ exchange }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (exchange.name === 'Binance') {
      navigate('/binance');
    } else {
      alert(`Detalhes para ${exchange.name} em breve!`);
    }
  };

  return (
    <div className="exchange-card">
      <div className="exchange-card-header">
        <div className="exchange-icon">
          {exchange.icon}
        </div>
        <h3 className="exchange-name">{exchange.name}</h3>
      </div>
      
      <p className="exchange-description">{exchange.description}</p>
      
      <div className="exchange-stats">
        <div className="stat-item">
          <span className="stat-label">Volume 24h:</span>
          <span className="stat-value">{exchange.volume24h}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">País:</span>
          <span className="stat-value">{exchange.country}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pares:</span>
          <span className="stat-value">{exchange.tradingPairs}</span>
        </div>
      </div>
      
      <div className="exchange-footer">
        <span className={`exchange-status ${exchange.status}`}>
          {exchange.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
        </span>
        <button className="btn-details" onClick={handleDetailsClick}>Ver Detalhes</button>
      </div>
    </div>
  );
};

export default ExchangeCard;
