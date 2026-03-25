import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

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
          <img src={logo} alt="CryptoView logo" className="header-logo-img" />
          <h1>CryptoView</h1>
        </div>

        <div className="header-user">
          <span className="header-username">{user?.displayName}</span>
          <button className="header-logout-btn" onClick={logout} aria-label="Sair">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
