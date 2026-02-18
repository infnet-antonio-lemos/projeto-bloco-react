import React from 'react';
import './RecentTrades.css';

/**
 * Reusable RecentTrades component
 * @param {Object} props
 * @param {Array} props.data - Array of trade objects { price, amount, time, side: 'buy'|'sell' }
 * @param {boolean} props.loading
 * @param {string} props.error
 */
const RecentTrades = ({ data, loading, error }) => {
  if (loading && (!data || data.length === 0)) {
    return (
      <div className="recent-trades-container">
        <div className="recent-trades-header">
          <h3>Últimas Transações</h3>
        </div>
        <div className="loading-message">Carregando transações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-trades-container">
        <div className="recent-trades-header">
          <h3>Últimas Transações</h3>
        </div>
        <div className="error-message">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="recent-trades-container">
      <div className="recent-trades-header">
        <h3>Últimas Transações</h3>
      </div>
      <div className="trades-table-responsive">
        <table className="trades-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Preço</th>
              <th>Quantidade</th>
              <th>Horário</th>
              <th>Lado</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((trade, index) => (
                <tr key={index}>
                  <td 
                    className={trade.side === 'buy' ? 'trade-row-buy' : 'trade-row-sell'}
                    style={{ textAlign: 'left' }}
                  >
                    {parseFloat(trade.price).toFixed(8)}
                  </td>
                  <td>{parseFloat(trade.amount).toFixed(8)}</td>
                  <td>{new Date(trade.time).toLocaleTimeString()}</td>
                  <td className={trade.side === 'buy' ? 'trade-row-buy' : 'trade-row-sell'}>
                    {trade.side === 'buy' ? 'Compra' : 'Venda'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhuma negociação recente</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrades;
