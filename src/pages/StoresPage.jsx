import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stores').then(({ data }) => setStores(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-2">Nos magasins</h1>
      <p className="text-gray-500 mb-8">Choisissez un magasin pour voir ses produits et commander.</p>
      {stores.length === 0 ? (
        <p className="text-gray-400">Aucun magasin disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.id}`}
              className="block bg-white rounded-2xl shadow hover:shadow-md transition p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏪</span>
                <h2 className="text-lg font-semibold text-gray-800">{store.name}</h2>
              </div>
              <p className="text-gray-500 text-sm">📍 {store.address}</p>
              <span className="mt-3 inline-block text-sm text-green-600 font-medium">
                Voir les produits →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
