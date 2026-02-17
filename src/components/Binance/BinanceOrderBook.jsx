import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BinanceOrderBook.css';

const BinanceOrderBook = () => {
  const { symbol } = useParams();
  const [orderBook, setOrderBook] = useState(null);
  const [trades, setTrades] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  
  // Filter states
  const [klinesInterval, setKlinesInterval] = useState('1d');
  const [limit, setLimit] = useState(10);
  const [klinesData, setKlinesData] = useState([]);
  
  // Pagination for klines
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
  const limits = [1, 5, 10, 20, 50, 100];

  useEffect(() => {
    console.log("fetching");
    const fetchData = async () => {
      if (!symbol) return;
      
      try {
        setLoading(true);
        
        const [orderBookRes, tradesRes, klinesRes] = await Promise.all([
          fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`),
          fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=10`),
          fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${klinesInterval}&limit=${limit}`)
        ]);
        
        if (!orderBookRes.ok || !tradesRes.ok || !klinesRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const orderBookData = await orderBookRes.json();
        const tradesData = await tradesRes.json();
        const klinesResData = await klinesRes.json();
        
        setOrderBook(orderBookData);
        setTrades(tradesData);
        setKlinesData(klinesResData);
        
        // Process latest candle data - taking the last one in the array as it's the most recent
        if (klinesResData && klinesResData.length > 0) {
          const latestCandle = klinesResData[klinesResData.length - 1];
          setMarketStats({
            high: latestCandle[2],
            low: latestCandle[3],
            volume: latestCandle[5],
            tradeCount: latestCandle[8]
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);
    
    return () => clearInterval(intervalId);
  }, [symbol, klinesInterval, limit]);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [klinesInterval, limit, symbol]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKlines = klinesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(klinesData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && !orderBook) return <div className="loading">Carregando livro de ordens para {symbol}...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!orderBook) return <div className="error">Nenhum dado disponível</div>;

  return (
    <div className="binance-container">
      <Link to="/binance" className="back-button">← Voltar para Lista de Preços</Link>
      
      <h2>Dados de Mercado {symbol}</h2>
      
      {klinesData.length > 0 && (
        <div className="market-stats-container">
          <div className="stats-filters">
            <div className="filter-group">
              <label>Intervalo:</label>
              <select 
                value={klinesInterval} 
                onChange={(e) => setKlinesInterval(e.target.value)}
                className="filter-select"
              >
                {intervals.map(int => (
                  <option key={int} value={int}>{int}</option>
                ))}
              </select>
            </div>
            
             <div className="filter-group">
              <label>Limite:</label>
              <select 
                value={limit} 
                onChange={(e) => setLimit(Number(e.target.value))}
                className="filter-select"
              >
                {limits.map(lim => (
                  <option key={lim} value={lim}>{lim}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="order-table">
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
                {currentKlines.map((kline, index) => (
                  <tr key={index}>
                    <td>{new Date(kline[0]).toLocaleString()}</td>
                    <td>{parseFloat(kline[1]).toFixed(8)}</td>
                    <td className="stat-value high">{parseFloat(kline[2]).toFixed(8)}</td>
                    <td className="stat-value low">{parseFloat(kline[3]).toFixed(8)}</td>
                    <td>{parseFloat(kline[4]).toFixed(8)}</td>
                    <td>{parseFloat(kline[5]).toFixed(2)}</td>
                    <td>{kline[8]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}
      
      <h3>Livro de Ordens</h3>
      <div className="order-book-container">
        <div className="order-book-header">
          <h3>ID da Última Atualização: {orderBook.lastUpdateId}</h3>
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

      <div className="trades-container">
        <div className="trades-header">
          <h3>Negócios Recentes</h3>
        </div>
        <div className="table-responsive">
          <table className="order-table">
            <thead>
              <tr>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Horário</th>
                <th style={{ textAlign: 'right' }}>Lado</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className={trade.isBuyerMaker ? 'trade-row-seller' : 'trade-row-buyer'}>
                    {parseFloat(trade.price).toFixed(8)}
                  </td>
                  <td>{parseFloat(trade.qty).toFixed(8)}</td>
                  <td>{new Date(trade.time).toLocaleTimeString()}</td>
                  <td style={{ textAlign: 'right', color: trade.isBuyerMaker ? '#ff4d4d' : '#00ff88' }}>
                    {trade.isBuyerMaker ? 'Venda' : 'Compra'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BinanceOrderBook;
