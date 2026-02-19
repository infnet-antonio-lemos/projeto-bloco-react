import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RecentTrades from '../Exchanges/RecentTrades';
import OrderBook from '../Exchanges/OrderBook';
import MarketData from '../Exchanges/MarketData';
import './BinanceMarketData.css';

const BinanceMarketData = () => {
  const { symbol } = useParams();
  const [orderBook, setOrderBook] = useState(null);
  const [trades, setTrades] = useState([]);
  
  // Filter states
  const [klinesInterval, setKlinesInterval] = useState('1d');
  const [limit, setLimit] = useState(10);
  const [klinesData, setKlinesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
  const limits = [1, 5, 10, 20, 50, 100];

  useEffect(() => {
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

  if (loading && !orderBook) return <div className="loading">Carregando livro de ordens para {symbol}...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!orderBook) return <div className="error">Nenhum dado disponível</div>;

  return (
    <div className="binance-container">
      <Link to="/binance" className="back-button">← Voltar para Lista de Preços</Link>
      
      <h2>Dados de Mercado {symbol}</h2>
      
      <MarketData
        data={klinesData}
        loading={loading}
        error={error}
        intervals={intervals}
        currentInterval={klinesInterval}
        onIntervalChange={setKlinesInterval}
        limits={limits}
        currentLimit={limit}
        onLimitChange={setLimit}
        itemsPerPage={5}
      />
      
      <OrderBook
        bids={orderBook?.bids}
        asks={orderBook?.asks}
        loading={loading}
        error={error}
      />

      <RecentTrades
        data={trades.map(trade => ({
          price: trade.price,
          amount: trade.qty,
          time: trade.time,
          side: trade.isBuyerMaker ? 'sell' : 'buy'
        }))}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default BinanceMarketData;
