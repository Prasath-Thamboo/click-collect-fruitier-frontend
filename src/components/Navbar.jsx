import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
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
        {user && user.role === 'CLIENT' && <Link to="/orders" className="hover:underline">Mes commandes</Link>}
        {user && user.role === 'CLIENT' && <Link to="/account" className="hover:underline">Mon compte</Link>}
        {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
          <Link
            to="/backoffice"
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded font-medium transition-colors"
          >
            Back office
          </Link>
        )}

        {(!user || user.role === 'CLIENT' || user.role === 'GUEST') && (
          <Link to="/cart" className="relative hover:opacity-80">
            <span className="text-xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-green-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="opacity-80 hidden sm:inline">{user.email}</span>
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
