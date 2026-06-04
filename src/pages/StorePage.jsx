import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function StorePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/stores/${id}`),
      api.get(`/products?storeId=${id}`),
    ]).then(([storeRes, productsRes]) => {
      setStore(storeRes.data);
      setProducts(productsRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleOrder = async (product) => {
    if (!user) return navigate('/login');
    if (!pickupDate) return setError('Choisissez une date de retrait.');
    setError('');
    try {
      await api.post('/orders', {
        storeId: id,
        totalAmount: product.price,
        pickupDate,
      });
      setSuccess(`Commande pour "${product.name}" passée avec succès !`);
      setOrdering(null);
    } catch {
      setError('Erreur lors de la commande.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  if (!store) return <div className="p-8 text-center text-red-500">Magasin introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700">{store.name}</h1>
        <p className="text-gray-500">📍 {store.address}</p>
      </div>

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>
      )}

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Produits disponibles</h2>
      {products.length === 0 ? (
        <p className="text-gray-400">Aucun produit disponible.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <span className="text-green-600 font-bold">{product.price.toFixed(2)} €</span>
              </div>
              {product.description && (
                <p className="text-gray-500 text-sm mb-3">{product.description}</p>
              )}
              {ordering === product.id ? (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOrder(product)}
                      className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setOrdering(null)}
                      className="flex-1 border py-1.5 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setOrdering(product.id); setSuccess(''); setError(''); }}
                  className="mt-2 w-full bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Commander
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
