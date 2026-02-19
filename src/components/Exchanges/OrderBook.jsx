import React from 'react';
import './OrderBook.css';

/**
 * Reusable OrderBook component
 * @param {Object} props
 * @param {Array} props.bids - Array of [price, amount]
 * @param {Array} props.asks - Array of [price, amount]
 * @param {boolean} props.loading
 * @param {string} props.error
 */
const OrderBook = ({ bids, asks, loading, error }) => {
  if (loading && (!bids || bids.length === 0)) {
    return (
      <div className="order-book-container">
        <div className="order-book-header">
          <h3>Livro de Ofertas (Order Book)</h3>
        </div>
        <div className="loading-message">Carregando livro de ofertas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-book-container">
        <div className="order-book-header">
          <h3>Livro de Ofertas (Order Book)</h3>
        </div>
        <div className="error-message">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="order-book-container">
      <div className="order-book-header">
        <h3>Livro de Ofertas (Order Book)</h3>
      </div>
      
      <div className="order-book-content">
        <div className="order-book-column">
          <h4 className="bids-header">Compras (Bids)</h4>
          <table className="order-table">
            <thead>
              <tr>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {bids && bids.length > 0 ? (
                bids.map((bid, index) => (
                  <tr key={`bid-${index}`}>
                    <td className="bid-price">{parseFloat(bid[0]).toFixed(8)}</td>
                    <td>{parseFloat(bid[1]).toFixed(8)}</td>
                    <td>{(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(8)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Sem ofertas de compra</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="order-book-column">
          <h4 className="asks-header">Vendas (Asks)</h4>
          <table className="order-table">
            <thead>
              <tr>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {asks && asks.length > 0 ? (
                asks.map((ask, index) => (
                  <tr key={`ask-${index}`}>
                    <td className="ask-price">{parseFloat(ask[0]).toFixed(8)}</td>
                    <td>{parseFloat(ask[1]).toFixed(8)}</td>
                    <td>{(parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(8)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Sem ofertas de venda</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
