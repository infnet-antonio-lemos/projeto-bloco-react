import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExchangeCard.css';

const formatVolume = (usd) => {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`;
  return `$${usd.toFixed(0)}`;
};

const ExchangeCard = ({ exchange }) => {
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    if (exchange.mock) return;

    const fetchLiveData = async () => {
      try {
        if (exchange.id === 'binance') {
          const [priceRes, tickerRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/price'),
            fetch('https://api.binance.com/api/v3/ticker/24hr?type=MINI'),
          ]);
          const prices = await priceRes.json();
          const tickers = await tickerRes.json();
          const tradingPairs = prices.length.toLocaleString('pt-BR');
          const volume = tickers
            .filter(t => t.symbol.endsWith('USDT'))
            .reduce((sum, t) => sum + parseFloat(t.quoteVolume), 0);
          setLiveData({ tradingPairs, volume24h: formatVolume(volume) });
        } else if (exchange.id === 'bybit') {
          const res = await fetch('https://api.bybit.com/v5/market/tickers?category=spot');
          const data = await res.json();
          if (data.retCode !== 0) return;
          const list = data.result.list;
          const tradingPairs = list.length.toLocaleString('pt-BR');
          const volume = list
            .filter(t => t.symbol.endsWith('USDT'))
            .reduce((sum, t) => sum + parseFloat(t.turnover24h || 0), 0);
          setLiveData({ tradingPairs, volume24h: formatVolume(volume) });
        }
      } catch {
        // on error, keep static data
      }
    };

    fetchLiveData();
  }, [exchange.id, exchange.mock]);

  const tradingPairs = liveData?.tradingPairs ?? exchange.tradingPairs;
  const volume24h = liveData?.volume24h ?? exchange.volume24h;

  const handleDetailsClick = () => {
    if (exchange.name === 'Binance') {
      navigate('/binance');
    } else if (exchange.name === 'Bybit') {
      navigate('/bybit');
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
          <span className="stat-value">{volume24h}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pares:</span>
          <span className="stat-value">{tradingPairs}</span>
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
