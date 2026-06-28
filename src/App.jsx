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
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountPage from './pages/AccountPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NewSubscriptionPage from './pages/NewSubscriptionPage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';
import PolitiqueConfidentialitePage from './pages/PolitiqueConfidentialitePage';
import PolitiqueCookiesPage from './pages/PolitiqueCookiesPage';
import CGVPage from './pages/CGVPage';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
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
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/account"
                element={<PrivateRoute><AccountPage /></PrivateRoute>}
              />
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route path="/cgv" element={<CGVPage />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
              <Route path="/politique-cookies" element={<PolitiqueCookiesPage />} />
              <Route
                path="/orders"
                element={<PrivateRoute><OrdersPage /></PrivateRoute>}
              />
              <Route
                path="/subscriptions"
                element={<PrivateRoute><SubscriptionsPage /></PrivateRoute>}
              />
              <Route
                path="/subscriptions/new"
                element={<PrivateRoute><NewSubscriptionPage /></PrivateRoute>}
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
