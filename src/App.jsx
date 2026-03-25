import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './components/Layout/MainLayout'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import ExchangesPage from './pages/ExchangesPage'
import BinancePage from './pages/BinancePage'
import BinanceSymbolPage from './pages/BinanceSymbolPage'
import BybitPage from './pages/BybitPage'
import BybitSymbolPage from './pages/BybitSymbolPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<ExchangesPage />} />
                    <Route path="/exchanges" element={<ExchangesPage />} />
                    <Route path="/binance" element={<BinancePage />} />
                    <Route path="/binance/:symbol" element={<BinanceSymbolPage />} />
                    <Route path="/bybit" element={<BybitPage />} />
                    <Route path="/bybit/:symbol" element={<BybitSymbolPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
