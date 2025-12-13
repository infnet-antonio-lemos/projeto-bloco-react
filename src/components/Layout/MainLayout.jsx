import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="main-layout">
      <Header onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
