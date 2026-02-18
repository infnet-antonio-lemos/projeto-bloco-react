import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import './BybitPriceList.css';

const BybitPriceList = () => {
  // const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.bybit.com/v5/market/tickers?category=spot');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        if (data.retCode !== 0) {
            throw new Error(data.retMsg || 'Failed to fetch data');
        }

        setPrices(data.result.list);
        setFilteredPrices(data.result.list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const filtered = prices.filter(item => 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrices(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, prices]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="loading">Carregando preços...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="bybit-container">
      <h2>Preços de Mercado Bybit</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Filtrar por símbolo (ex: BTCUSDT)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-responsive">
        <table className="price-table">
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr 
                  key={item.symbol} 
                  style={{ cursor: 'default' }}
                >
                  <td>{item.symbol}</td>
                  <td>{parseFloat(item.lastPrice).toFixed(8)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>Nenhum resultado encontrado</td>
              </tr>
            )}
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
  );
};

export default BybitPriceList;
