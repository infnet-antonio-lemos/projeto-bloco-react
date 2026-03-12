import './LastPriceCard.css';

/**
 * Reusable LastPriceCard component
 * @param {Object} props
 * @param {string} props.symbol - Trading pair symbol (e.g. BTCUSDT)
 * @param {string|number} props.price - Last traded price
 * @param {boolean} props.loading
 * @param {string} props.error
 */
const LastPriceCard = ({ symbol, price, loading, error }) => {
  if (loading && !price) {
    return (
      <div className="last-price-card">
        <div className="last-price-header">
          <span className="last-price-label">Último Preço</span>
          <span className="last-price-symbol">{symbol}</span>
        </div>
        <span className="last-price-value loading-text">Carregando...</span>
      </div>
    );
  }

  if (error && !price) {
    return (
      <div className="last-price-card error">
        <div className="last-price-header">
          <span className="last-price-label">Último Preço</span>
          <span className="last-price-symbol">{symbol}</span>
        </div>
        <span className="last-price-value error-text">Erro ao carregar</span>
      </div>
    );
  }

  const formattedPrice = price
    ? parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
    : '—';

  return (
    <div className="last-price-card">
      <div className="last-price-header">
        <span className="last-price-label">Último Preço</span>
        <span className="last-price-symbol">{symbol}</span>
      </div>
      <span className="last-price-value">{formattedPrice}</span>
    </div>
  );
};

export default LastPriceCard;
