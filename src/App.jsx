import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import ExchangesPage from './pages/ExchangesPage'
import BinancePage from './pages/BinancePage'
import BinanceSymbolPage from './pages/BinanceSymbolPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ExchangesPage />} />
          <Route path="/exchanges" element={<ExchangesPage />} />
          <Route path="/binance" element={<BinancePage />} />
          <Route path="/binance/:symbol" element={<BinanceSymbolPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
