import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">Chargement…</p>
    </div>
  );
}

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stores').then(({ data }) => setStores(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 via-green-600 to-emerald-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-lg">
            <p className="text-green-200 text-sm font-medium mb-3 tracking-wide uppercase">Click &amp; Collect</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
              Des fruits frais,<br />
              à portée de main.
            </h1>
            <p className="text-green-100 text-base sm:text-lg leading-relaxed">
              Commandez en ligne et récupérez votre panier au magasin de votre choix, quand vous voulez.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nos magasins</h2>
            <p className="text-gray-500 text-sm mt-0.5">Choisissez un magasin pour voir ses produits</p>
          </div>
          {!loading && stores.length > 0 && (
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {stores.length} magasin{stores.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Aucun magasin disponible pour le moment</p>
            <p className="text-gray-400 text-sm mt-1">Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/stores/${store.id}`}
                className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:border-green-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-600 transition-colors truncate">
                    {store.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5 truncate flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {store.address}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                    Voir les produits
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
