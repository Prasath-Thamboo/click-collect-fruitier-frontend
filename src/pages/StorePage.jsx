import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">Chargement…</p>
    </div>
  );
}

export default function StorePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, replaceCart } = useCart();
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'MANAGER';
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

  if (loading) return <Spinner />;
  if (!store) return (
    <div className="p-8 text-center text-red-500">Magasin introuvable.</div>
  );

  const cartQty = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tous les magasins
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {store.address}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Produits disponibles
          {products.length > 0 && (
            <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {products.length}
            </span>
          )}
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Aucun produit disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-900 leading-snug">{product.name}</h3>
                  <span className="bg-green-50 text-green-700 text-sm font-bold px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                    {product.price.toFixed(2)} €
                  </span>
                </div>

                {product.description && (
                  <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
                )}

                {!isStaff && (
                  <button
                    onClick={() => handleAdd(product)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      added === product.id
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                    }`}
                  >
                    {added === product.id ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Ajouté au panier
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter au panier
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky cart button */}
      {!isStaff && cart.items.length > 0 && cart.storeId === id && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-green-600 text-white px-6 py-3.5 rounded-2xl shadow-lg font-semibold hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Voir le panier
            </span>
            <span className="bg-white text-green-700 rounded-xl px-2.5 py-0.5 text-sm font-bold">
              {cartQty} article{cartQty > 1 ? 's' : ''}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
