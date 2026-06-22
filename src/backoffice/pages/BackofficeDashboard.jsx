import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function BackofficeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const requests = [api.get('/products'), api.get('/orders')];
      if (user?.role === 'ADMIN') {
        requests.push(api.get('/stores'), api.get('/users'));
      }
      const results = await Promise.all(requests);
      const [products, orders] = results;

      const s = {
        products: products.data.length,
        availableProducts: products.data.filter((p) => p.isAvailable).length,
        totalOrders: orders.data.length,
        pending: orders.data.filter((o) => o.status === 'PENDING').length,
        accepted: orders.data.filter((o) => o.status === 'ACCEPTED').length,
        ready: orders.data.filter((o) => o.status === 'READY').length,
      };

      if (user?.role === 'ADMIN') {
        const [stores, users] = [results[2], results[3]];
        s.stores = stores.data.length;
        s.activeStores = stores.data.filter((st) => st.isActive).length;
        s.users = users.data.length;
        s.managers = users.data.filter((u) => u.role === 'MANAGER').length;
      }

      setStats(s);
    };
    load().catch(console.error);
  }, [user]);

  return (
    <div>
      <div className="px-8 py-5 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bienvenue, {user?.email}</p>
      </div>

      <div className="p-8">
        {user?.role === 'ADMIN' && (
          <>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Magasins & Utilisateurs
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Magasins actifs"
                value={stats?.activeStores}
                sub={`${stats?.stores ?? '—'} au total`}
                color="text-blue-600"
              />
              <StatCard
                label="Managers"
                value={stats?.managers}
                sub={`${stats?.users ?? '—'} utilisateurs`}
                color="text-purple-600"
              />
              <StatCard
                label="Produits disponibles"
                value={stats?.availableProducts}
                sub={`${stats?.products ?? '—'} au total`}
                color="text-green-600"
              />
              <StatCard
                label="Commandes totales"
                value={stats?.totalOrders}
                color="text-gray-700"
              />
            </div>
          </>
        )}

        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          État des commandes
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="En attente" value={stats?.pending} color="text-orange-500" />
          <StatCard label="Acceptées" value={stats?.accepted} color="text-blue-600" />
          <StatCard label="Prêtes" value={stats?.ready} color="text-green-600" />
        </div>

        {user?.role !== 'ADMIN' && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <StatCard
              label="Produits disponibles"
              value={stats?.availableProducts}
              sub={`${stats?.products ?? '—'} au total`}
              color="text-green-600"
            />
            <StatCard label="Commandes totales" value={stats?.totalOrders} color="text-gray-700" />
          </div>
        )}
      </div>
    </div>
  );
}
