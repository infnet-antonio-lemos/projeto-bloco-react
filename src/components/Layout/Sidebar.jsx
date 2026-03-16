import { NavLink } from 'react-router-dom';
import { exchanges } from '../../data/exchanges';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { id: 'main-exchanges', label: 'Exchanges', icon: '🏦', path: '/exchanges', mock: false },
    ...exchanges.map(exchange => ({
      id: exchange.id,
      label: exchange.name,
      icon: exchange.icon,
      path: exchange.path,
      mock: exchange.mock
    }))
  ];

  const handleLinkClick = (e, item) => {
    if (item.mock) {
      e.preventDefault();
      alert(`A integração com a ${item.label} ainda não está disponível.`);
    }
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button 
            className="sidebar-close" 
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="sidebar-menu-item">
                <NavLink 
                  to={item.mock ? '#' : item.path} 
                  className={({ isActive }) => `sidebar-link ${isActive && !item.mock ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, item)}
                  end={item.path === '/'} // Avoid active state on root for all paths if path was /
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <p>CryptoView v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
