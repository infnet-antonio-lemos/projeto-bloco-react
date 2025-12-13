import './Header.css';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="header">
      <div className="header-container">
        <button 
          className="menu-toggle" 
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
        
        <div className="header-logo">
          <h1>CryptoView</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
