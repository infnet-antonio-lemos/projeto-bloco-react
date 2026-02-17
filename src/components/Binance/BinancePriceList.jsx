import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BinancePriceList.css';

const BinancePriceList = () => {
  const navigate = useNavigate();
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
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setPrices(data);
        setFilteredPrices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const filtered = prices.filter(price => 
      price.symbol.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="binance-container">
      <h2>Preços de Mercado Binance</h2>
      
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
                  onClick={() => navigate(`/binance/${item.symbol}`)}
                  style={{ cursor: 'pointer' }}
                  title="Clique para ver detalhes"
                >
                  <td>{item.symbol}</td>
                  <td>{parseFloat(item.price).toFixed(8)}</td>
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

export default BinancePriceList;
