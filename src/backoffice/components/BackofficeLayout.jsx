import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { to: '/backoffice/dashboard', label: 'Tableau de bord', icon: '⊞' },
  { to: '/backoffice/stores', label: 'Magasins', icon: '⌂' },
  { to: '/backoffice/products', label: 'Produits', icon: '◈' },
  { to: '/backoffice/orders', label: 'Commandes', icon: '≡' },
  { to: '/backoffice/users', label: 'Utilisateurs', icon: '⊛' },
];

const managerNav = [
  { to: '/backoffice/dashboard', label: 'Tableau de bord', icon: '⊞' },
  { to: '/backoffice/products', label: 'Produits', icon: '◈' },
  { to: '/backoffice/orders', label: 'Commandes', icon: '≡' },
];

export default function BackofficeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nav = user?.role === 'ADMIN' ? adminNav : managerNav;

  const handleLogout = () => {
    logout();
    navigate('/backoffice/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="w-60 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-slate-700">
          <p className="text-base font-bold text-white leading-tight">FruityCollect</p>
          <p className="text-slate-400 text-xs mt-0.5">Back office</p>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base w-5 text-center">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-white text-sm font-medium truncate">{user?.email}</p>
          <p className="text-slate-400 text-xs mb-3">
            {user?.role === 'ADMIN' ? 'Administrateur' : 'Manager'}
          </p>
          <Link
            to="/"
            className="w-full text-left text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1.5 mb-1"
          >
            ← Site principal
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded hover:bg-slate-800 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
