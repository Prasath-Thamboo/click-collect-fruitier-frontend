import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-tight">
        🍎 FruityCollect
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:underline">Magasins</Link>
        {user && <Link to="/orders" className="hover:underline">Mes commandes</Link>}
        {user?.role === 'MANAGER' && (
          <Link to="/manager" className="hover:underline">Manager</Link>
        )}
        {user?.role === 'ADMIN' && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="opacity-80">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 px-3 py-1 rounded font-medium hover:bg-green-50"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-white text-green-700 px-3 py-1 rounded font-medium hover:bg-green-50"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
