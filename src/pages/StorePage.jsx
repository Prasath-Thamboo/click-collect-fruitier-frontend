import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function StorePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, replaceCart } = useCart();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/stores/${id}`),
      api.get(`/products?storeId=${id}`),
    ]).then(([storeRes, productsRes]) => {
      setStore(storeRes.data);
      setProducts(productsRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = (product) => {
    if (cart.storeId && cart.storeId !== id && cart.items.length > 0) {
      const ok = window.confirm(
        `Votre panier contient des articles de "${cart.storeName}".\nVider le panier et ajouter cet article ?`
      );
      if (!ok) return;
      replaceCart(product, id, store.name);
    } else {
      addToCart(product, id, store.name);
    }
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  if (!store) return <div className="p-8 text-center text-red-500">Magasin introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700">{store.name}</h1>
        <p className="text-gray-500">📍 {store.address}</p>
      </div>

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
              <button
                onClick={() => handleAdd(product)}
                className={`mt-2 w-full py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  added === product.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {added === product.id ? '✓ Ajouté au panier' : 'Ajouter au panier'}
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.items.length > 0 && cart.storeId === id && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg font-semibold hover:bg-green-700 flex items-center gap-3"
          >
            <span>🛒</span>
            <span>Voir le panier</span>
            <span className="bg-white text-green-700 rounded-full px-2 py-0.5 text-sm font-bold">
              {cart.items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
