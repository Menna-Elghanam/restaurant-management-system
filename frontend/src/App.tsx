import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Providers
import { AuthProvider } from './context/auth-provider';
import { CartProvider } from './context/cart-provider';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages (you'll create these)
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import TablesPage from './pages/TablesPage';
 import InvoicesPage from './pages/InvoicesPage';
 import SalesPage from './pages/SalesPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/tables" element={<TablesPage />} />
                        <Route path="/invoices" element={<InvoicesPage />} />
                        <Route path="/sales" element={<SalesPage />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;