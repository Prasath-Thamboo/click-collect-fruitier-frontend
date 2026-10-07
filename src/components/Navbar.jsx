import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './ui/Logo';

const ICONS = {
  stores: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  orders: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  subs: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  account: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  backoffice: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
  cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
};

function Icon({ d, className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
    </svg>
  );
}

function CartButton({ itemCount, onClick }) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      aria-label="Panier"
      className="relative grid place-items-center w-11 h-11 rounded-2xl btn-ghost"
    >
      <Icon d={ICONS.cart} className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-gradient-to-br from-strawberry to-mango text-white text-[11px] font-bold grid place-items-center animate-pulse-glow">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  const isClient = !user || user.role === 'CLIENT' || user.role === 'GUEST';
  const isStaff = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const links = [
    { to: '/', label: 'Magasins', icon: ICONS.stores, end: true },
    ...(user?.role === 'CLIENT'
      ? [
          { to: '/orders', label: 'Commandes', icon: ICONS.orders },
          { to: '/subscriptions', label: 'Abonnements', icon: ICONS.subs },
          { to: '/account', label: 'Compte', icon: ICONS.account },
        ]
      : []),
  ];

  const desktopLink = ({ isActive }) =>
    `relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive ? 'text-white bg-white/[0.08]' : 'text-gray-500 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 px-3 sm:px-6 pt-3">
      <div className="max-w-6xl mx-auto glass rounded-3xl">
        <div className="flex items-center justify-between h-16 px-4 sm:px-5">
          <Link to="/" onClick={close} className="shrink-0">
            <Logo />
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-black/20 border border-white/5">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span className="absolute left-1/2 -bottom-[3px] -translate-x-1/2 w-6 h-[3px] rounded-full bg-gradient-to-r from-strawberry via-mango to-kiwi shadow-[0_0_12px_rgba(255,122,69,.9)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            {isStaff && (
              <NavLink
                to="/backoffice"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-mint hover:bg-mint/10 transition-colors flex items-center gap-2"
              >
                <span className="neon-dot" style={{ background: '#2ff5b4', boxShadow: '0 0 10px #2ff5b4' }} />
                Back office
              </NavLink>
            )}
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            {isClient && <CartButton itemCount={itemCount} />}
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden lg:flex items-center gap-2 chip max-w-52">
                  <span className="neon-dot" />
                  <span className="text-xs text-gray-600 truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost h-11 px-4 rounded-2xl text-sm font-medium"
                  title="Déconnexion"
                >
                  <Icon d={ICONS.logout} />
                  <span className="hidden xl:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-fruit h-11 px-5 rounded-2xl text-sm">
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            {isClient && <CartButton itemCount={itemCount} onClick={close} />}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid place-items-center w-11 h-11 rounded-2xl btn-ghost"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              <Icon d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h10M4 17h16'} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-3 pb-4 pt-3 animate-rise">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={close}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${
                      isActive ? 'bg-white/[0.08] text-white' : 'text-gray-600 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon d={l.icon} />
                  {l.label}
                </NavLink>
              ))}
              {isStaff && (
                <Link
                  to="/backoffice"
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-mint bg-mint/10"
                >
                  <Icon d={ICONS.backoffice} />
                  Back office
                </Link>
              )}
            </div>
            <div className="border-t border-white/10 mt-3 pt-3">
              {user ? (
                <>
                  <p className="hud text-gray-400 px-4 pb-2 truncate">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:text-strawberry hover:bg-white/5 transition-colors"
                  >
                    <Icon d={ICONS.logout} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={close} className="btn-fruit w-full py-3 rounded-2xl">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
