import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RecentTrades from '../Exchanges/RecentTrades';
import OrderBook from '../Exchanges/OrderBook';
import MarketData from '../Exchanges/MarketData';
import './BybitMarketData.css';

const BybitMarketData = () => {
  const { symbol } = useParams();
  const [klines, setKlines] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orderBook, setOrderBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(20);
  const [klineInterval, setKlineInterval] = useState('60');

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
        
        const klineResponse = await fetch(
          `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=${klineInterval}&limit=${limit}`
        );
        const klineData = await klineResponse.json();

        const tradesResponse = await fetch(
          `https://api.bybit.com/v5/market/recent-trade?category=spot&symbol=${symbol}&limit=20`
        );
        const tradesData = await tradesResponse.json();

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

  return (
    <div className="bybit-container">
      <Link to="/bybit" className="back-button">← Voltar para Lista de Preços</Link>
      
      <h2>Dados de Mercado {symbol}</h2>

      <MarketData
        data={klines}
        loading={loading}
        error={error}
        intervals={intervals}
        currentInterval={klineInterval}
        onIntervalChange={setKlineInterval}
        limits={limitOptions}
        currentLimit={limit}
        onLimitChange={setLimit}
        itemsPerPage={5}
      />


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
