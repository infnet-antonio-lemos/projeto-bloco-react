import './RefreshButton.css';

const RefreshButton = ({ onClick, loading = false, className = '' }) => {
  return (
    <button 
      onClick={onClick} 
      className={`refresh-button ${className}`}
      disabled={loading}
    >
      {loading ? 'Atualizando...' : 'Atualizar'}
    </button>
  );
};

export default RefreshButton;
