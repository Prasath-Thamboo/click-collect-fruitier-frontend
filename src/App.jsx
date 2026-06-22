import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import StoresPage from './pages/StoresPage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import ManagerPage from './pages/ManagerPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';

import BackofficeLayout from './backoffice/components/BackofficeLayout';
import BackofficeRoute from './backoffice/components/BackofficeRoute';
import BackofficeLogin from './backoffice/pages/BackofficeLogin';
import BackofficeDashboard from './backoffice/pages/BackofficeDashboard';
import BackofficeStores from './backoffice/pages/BackofficeStores';
import BackofficeProducts from './backoffice/pages/BackofficeProducts';
import BackofficeOrders from './backoffice/pages/BackofficeOrders';
import BackofficeUsers from './backoffice/pages/BackofficeUsers';

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Back office */}
            <Route path="/backoffice/login" element={<BackofficeLogin />} />
            <Route
              path="/backoffice"
              element={
                <BackofficeRoute>
                  <BackofficeLayout />
                </BackofficeRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<BackofficeDashboard />} />
              <Route path="stores" element={<BackofficeStores />} />
              <Route path="products" element={<BackofficeProducts />} />
              <Route path="orders" element={<BackofficeOrders />} />
              <Route path="users" element={<BackofficeUsers />} />
            </Route>

            {/* Application principale */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<StoresPage />} />
              <Route path="/stores/:id" element={<StorePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/orders"
                element={<PrivateRoute><OrdersPage /></PrivateRoute>}
              />
              <Route
                path="/manager"
                element={<PrivateRoute roles={['MANAGER', 'ADMIN']}><ManagerPage /></PrivateRoute>}
              />
              <Route
                path="/admin"
                element={<PrivateRoute roles={['ADMIN']}><AdminPage /></PrivateRoute>}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
