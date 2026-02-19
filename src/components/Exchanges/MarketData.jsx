import React, { useState, useEffect } from 'react';
import './MarketData.css';

/**
 * Reusable MarketData component (Klines Table)
 * @param {Object} props
 * @param {Array} props.data - Array of kline data
 * @param {boolean} props.loading
 * @param {string} props.error
 * @param {Array} props.intervals - Array of interval options { value, label } or strings
 * @param {string} props.currentInterval
 * @param {Function} props.onIntervalChange
 * @param {Array} props.limits - Array of limit numbers
 * @param {number} props.currentLimit
 * @param {Function} props.onLimitChange
 * @param {number} props.itemsPerPage - Number of items to show per page (client-side pagination)
 */
const MarketData = ({
  data,
  loading,
  error,
  intervals,
  currentInterval,
  onIntervalChange,
  limits,
  currentLimit,
  onLimitChange,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when data changes or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, currentLimit, currentInterval]);

  if (loading && (!data || data.length === 0)) {
    return <div className="market-data-container loading">Carregando dados de mercado...</div>;
  }

  if (error) {
    return <div className="market-data-container error">Erro: {error}</div>;
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper to format interval label
  const getIntervalLabel = (val) => {
    if (typeof val === 'object') return val.label;
    return val;
  };
  
  const getIntervalValue = (val) => {
    if (typeof val === 'object') return val.value;
    return val;
  };

  const currentIntervalLabel = intervals.find(i => getIntervalValue(i) === currentInterval)?.label || currentInterval;

  return (
    <div className="market-data-container">
      <div className="filters-header">
        <h3>Dados Históricos ({currentIntervalLabel})</h3>
        <div className="controls-group">
          <div className="limit-control">
            <label>Intervalo:</label>
            <select 
              value={currentInterval} 
              onChange={(e) => onIntervalChange(e.target.value)}
              className="limit-select"
            >
              {intervals.map((int, idx) => (
                <option key={idx} value={getIntervalValue(int)}>
                  {getIntervalLabel(int)}
                </option>
              ))}
            </select>
          </div>

          <div className="limit-control">
            <label>Limite:</label>
            <select 
              value={currentLimit} 
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="limit-select"
            >
              {limits.map(lim => (
                <option key={lim} value={lim}>{lim}</option>
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
            {currentItems.length > 0 ? (
              currentItems.map((kline, index) => (
                <tr key={index}>
                  {/* Handle both timestamp formats (number vs string) */}
                  <td>{new Date(Number(kline[0])).toLocaleString()}</td>
                  <td>{parseFloat(kline[1]).toFixed(8)}</td>
                  <td className="price-up">{parseFloat(kline[2]).toFixed(8)}</td>
                  <td className="price-down">{parseFloat(kline[3]).toFixed(8)}</td>
                  <td>{parseFloat(kline[4]).toFixed(8)}</td>
                  <td>{parseFloat(kline[5]).toFixed(2)}</td>
                  {/* Index 8 for Binance (trades), Index 6 for Bybit (turnover) or mapped earlier */}
                  <td>{kline[6] || kline[8] || '-'}</td>
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

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          
          <span>
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketData;
