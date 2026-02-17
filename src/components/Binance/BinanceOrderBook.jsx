import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BinanceOrderBook.css';

const BinanceOrderBook = () => {
  const { symbol } = useParams();
  const [orderBook, setOrderBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderBook = async () => {
      if (!symbol) return;
      
      try {
        setLoading(true);
        // Using limit=10 as requested
        const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order book data');
        }
        
        const data = await response.json();
        setOrderBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();
    
    // Optional: Refresh data every 5 seconds
    const intervalId = setInterval(fetchOrderBook, 5000);
    
    return () => clearInterval(intervalId);
  }, [symbol]);

  if (loading && !orderBook) return <div className="loading">Loading order book for {symbol}...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!orderBook) return <div className="error">No data available</div>;

  return (
    <div className="binance-container">
      <Link to="/binance" className="back-button">← Back to Price List</Link>
      
      <h2>{symbol} Order Book</h2>
      
      <div className="order-book-container">
        <div className="order-book-header">
          <h3>Last Update ID: {orderBook.lastUpdateId}</h3>
        </div>
        
        <div className="order-book-content">
          <div className="order-book-column">
            <h4 className="bids-header">Bids (Buy Orders)</h4>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.bids.map((bid, index) => (
                  <tr key={`bid-${index}`}>
                    <td className="bid-price">{parseFloat(bid[0]).toFixed(8)}</td>
                    <td>{parseFloat(bid[1]).toFixed(8)}</td>
                    <td>{(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="order-book-column">
            <h4 className="asks-header">Asks (Sell Orders)</h4>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.asks.map((ask, index) => (
                  <tr key={`ask-${index}`}>
                    <td className="ask-price">{parseFloat(ask[0]).toFixed(8)}</td>
                    <td>{parseFloat(ask[1]).toFixed(8)}</td>
                    <td>{(parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinanceOrderBook;
