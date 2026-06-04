import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import StoresPage from './pages/StoresPage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import ManagerPage from './pages/ManagerPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<StoresPage />} />
          <Route path="/stores/:id" element={<StorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={
            <PrivateRoute><OrdersPage /></PrivateRoute>
          } />
          <Route path="/manager" element={
            <PrivateRoute roles={['MANAGER', 'ADMIN']}><ManagerPage /></PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute roles={['ADMIN']}><AdminPage /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
