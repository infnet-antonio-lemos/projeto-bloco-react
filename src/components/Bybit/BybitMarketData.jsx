import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RecentTrades from '../Exchanges/RecentTrades';
import OrderBook from '../Exchanges/OrderBook';
import './BybitMarketData.css';

const BybitMarketData = () => {
  const { symbol } = useParams();
  const [klines, setKlines] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orderBook, setOrderBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(20); // Default API limit
  const [klineInterval, setKlineInterval] = useState('60'); // Default 1h
  
  // Client-side pagination state for Klines
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fixed items per page

  const limitOptions = [1, 5, 10, 20, 50, 100, 200];
  const intervals = [
    { value: '1', label: '1m' },
    { value: '5', label: '5m' },
    { value: '15', label: '15m' },
    { value: '60', label: '1h' },
    { value: '240', label: '4h' },
    { value: 'D', label: '1d' },
    { value: 'W', label: '1w' },
    { value: 'M', label: '1M' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Klines
        const klineResponse = await fetch(
          `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=${klineInterval}&limit=${limit}`
        );
        const klineData = await klineResponse.json();

        // Fetch Recent Trades
        const tradesResponse = await fetch(
          `https://api.bybit.com/v5/market/recent-trade?category=spot&symbol=${symbol}&limit=20`
        );
        const tradesData = await tradesResponse.json();

        // Fetch Order Book
        const orderBookResponse = await fetch(
          `https://api.bybit.com/v5/market/orderbook?category=spot&symbol=${symbol}&limit=10`
        );
        const orderBookData = await orderBookResponse.json();

        if (klineData.retCode !== 0) throw new Error(klineData.retMsg);
        if (tradesData.retCode !== 0) throw new Error(tradesData.retMsg);
        if (orderBookData.retCode !== 0) throw new Error(orderBookData.retMsg);

        setKlines(klineData.result.list);
        setTrades(tradesData.result.list);
        setOrderBook(orderBookData.result);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol, limit, klineInterval]);

  if (loading) return <div className="loading">Carregando dados de mercado...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKlines = klines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(klines.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bybit-container">
      <Link to="/bybit" className="back-button">← Voltar para Lista de Preços</Link>
      
      <h2>Dados de Mercado {symbol}</h2>

      <div className="market-data-container">
        <div className="filters-header">
          <h3>Dados Históricos ({intervals.find(i => i.value === klineInterval)?.label || klineInterval})</h3>
          <div className="controls-group">
            <div className="limit-control">
              <label>Intervalo:</label>
              <select 
                value={klineInterval} 
                onChange={(e) => setKlineInterval(e.target.value)}
                className="limit-select"
              >
                {intervals.map(int => (
                  <option key={int.value} value={int.value}>{int.label}</option>
                ))}
              </select>
            </div>

            <div className="limit-control">
              <label>Limite:</label>
              <select 
                value={limit} 
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1); // Reset page when fetching new data
                }}
                className="limit-select"
              >
                {limitOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tempo Abertura</th>
                <th>Abertura</th>
                <th>Máxima</th>
                <th>Mínima</th>
                <th>Fechamento</th>
                <th>Volume</th>
                <th>Negócios</th>
              </tr>
            </thead>
            <tbody>
              {currentKlines.length > 0 ? (
                currentKlines.map((kline, index) => (
                  <tr key={index}>
                    <td>{new Date(parseInt(kline[0])).toLocaleString()}</td>
                    <td>{parseFloat(kline[1]).toFixed(8)}</td>
                    <td className="price-up">{parseFloat(kline[2]).toFixed(8)}</td>
                    <td className="price-down">{parseFloat(kline[3]).toFixed(8)}</td>
                    <td>{parseFloat(kline[4]).toFixed(8)}</td>
                    <td>{parseFloat(kline[5]).toFixed(2)}</td>
                    <td>{parseFloat(kline[6]).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum dado disponível</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Client Side Pagination Controls */}
        <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="limit-select"
          >
            Anterior
          </button>
          
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="limit-select"
          >
            Próxima
          </button>
        </div>
      </div>

      <OrderBook
        bids={orderBook?.b}
        asks={orderBook?.a}
        loading={loading}
        error={error}
      />

      <div className="market-data-container">
        <RecentTrades
          data={trades.map(trade => ({
            price: trade.price,
            amount: trade.size,
            time: parseInt(trade.time),
            side: trade.side.toLowerCase()
          }))}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default BybitMarketData;
